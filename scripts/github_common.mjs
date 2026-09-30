#!/usr/bin/env node

/**
 * GitHub API utilities for refresh scripts
 * Common functions for interacting with GitHub API
 */

// Common GitHub API request configuration
const DEFAULT_TIMEOUT = 10000;
const DEFAULT_PER_PAGE = 100;

// Minimal fetch-based client mimicking the axios instance interface used here:
// github.get(url, { params }) resolves { data, headers, status, statusText }
// and rejects with an error exposing .response.status / .response.headers.
export function createGitHubRequest(token) {
  const baseURL = 'https://api.github.com';

  async function get(url, { params = {} } = {}) {
    const fullUrl = new URL(baseURL + url);
    for (const [key, value] of Object.entries(params)) {
      fullUrl.searchParams.append(key, value);
    }
    let response;
    try {
      response = await fetch(fullUrl, {
        headers: token ? { 'Authorization': `token ${token}` } : {},
        signal: AbortSignal.timeout(DEFAULT_TIMEOUT)
      });
    } catch (err) {
      if (err?.name === 'TimeoutError' || err?.name === 'AbortError') {
        const timeoutError = new Error('timeout of ' + DEFAULT_TIMEOUT + 'ms exceeded');
        timeoutError.code = 'ECONNABORTED';
        throw timeoutError;
      }
      throw err;
    }

    if (!response.ok) {
      const requestError = new Error(`Request failed with status code ${response.status}`);
      requestError.response = {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers)
      };
      throw requestError;
    }

    return {
      data: await response.json(),
      headers: Object.fromEntries(response.headers),
      status: response.status,
      statusText: response.statusText
    };
  }

  return { get, defaults: { baseURL } };
}

// Extract repository path from GitHub URL
export function extractRepoPath(repoUrl) {
  if (!repoUrl) {
    throw new Error('Repository URL is required');
  }
  
  const match = repoUrl.match(/github\.com\/([^\/]+\/[^\/]+)/);
  if (!match) {
    throw new Error(`Invalid GitHub URL: ${repoUrl}`);
  }
  
  return match[1].replace(/\.git$/, '');
}

// Fetch latest release from GitHub
export async function fetchLatestRelease(repoUrl, token) {
  const repoPath = extractRepoPath(repoUrl);
  const github = createGitHubRequest(token);
  
  try {
    // First try to get latest release
    const response = await github.get(`/repos/${repoPath}/releases/latest`);
    
    return {
      version: response.data.tag_name,
      date: response.data.published_at.split('T')[0],
      url: response.data.html_url
    };
    
  } catch (releaseError) {
    if (releaseError.response?.status === 404) {
      // No releases found, try tags as fallback
      return await fetchLatestTag(repoPath, token);
    } else if (releaseError.response?.status === 403) {
      throw new Error('Rate limited - GitHub token recommended');
    } else if (releaseError.response?.status === 404) {
      throw new Error(`Repository not found: ${repoUrl}`);
    } else {
      throw new Error(`GitHub API error: ${releaseError.message}`);
    }
  }
}

// Fetch latest tag as fallback when no releases exist
export async function fetchLatestTag(repoPath, token) {
  const github = createGitHubRequest(token);
  
  try {
    const response = await github.get(`/repos/${repoPath}/tags`, {
      params: { per_page: DEFAULT_PER_PAGE }
    });
    
    if (!response.data || response.data.length === 0) {
      throw new Error(`No releases or tags found: https://github.com/${repoPath}`);
    }
    
    // Get the latest tag (first in the array)
    const latestTag = response.data[0];
    
    // Try to get commit date for the tag
    try {
      const commitResponse = await github.get(`/repos/${repoPath}/commits/${latestTag.commit.sha}`);
      
      return {
        version: latestTag.name,
        date: commitResponse.data.commit.committer.date.split('T')[0],
        url: `https://github.com/${repoPath}/releases/tag/${latestTag.name}`
      };
    } catch (commitError) {
      // If we can't get commit date, use current date
      return {
        version: latestTag.name,
        date: new Date().toISOString().split('T')[0],
        url: `https://github.com/${repoPath}/releases/tag/${latestTag.name}`
      };
    }
  } catch (tagsError) {
    if (tagsError.response?.status === 404) {
      throw new Error(`Repository not found: https://github.com/${repoPath}`);
    }
    throw new Error(`No releases or tags found: https://github.com/${repoPath}`);
  }
}

// Fetch all releases from GitHub, handling pagination
export async function fetchAllReleases(repoPath, token) {
  const github = createGitHubRequest(token);
  let releases = [];
  let page = 1;
  const perPage = 100; // Max items per page

  try {
    while (true) {
      const response = await github.get(`/repos/${repoPath}/releases`, {
        params: { page, per_page: perPage }
      });
      if (response.data.length === 0) {
        break; // No more releases
      }
      releases = releases.concat(response.data);
      if (response.data.length < perPage) {
        break; // Last page
      }
      page++;
    }
    return releases;
  } catch (error) {
    if (error.response?.status === 403) {
      throw new Error('Rate limited - GitHub token recommended');
    } else if (error.response?.status === 404) {
      throw new Error(`Repository not found or no releases: ${repoPath}`);
    } else {
      throw new Error(`GitHub API error fetching releases for ${repoPath}: ${error.message}`);
    }
  }
}

// Fetch all tags for a repository
export async function fetchAllTags(repoPath, token) {
  const github = createGitHubRequest(token);
  let allTags = [];
  let url = `/repos/${repoPath}/tags`;

  try {
    while (url) {
      const response = await github.get(url, {
        params: { per_page: DEFAULT_PER_PAGE }
      });
      
      allTags = allTags.concat(response.data || []);
      
      // Check for pagination link
      const linkHeader = response.headers['link'];
      url = null; // Assume no next page unless found
      if (linkHeader) {
        const links = linkHeader.split(',');
        for (const link of links) {
          const parts = link.split(';');
          if (parts[1].includes('rel="next"')) {
            url = parts[0].trim().slice(1, -1); // Extract URL from <URL>
            // The extracted URL is absolute, but github.get will handle it if it's just the path part
            if (url.startsWith(github.defaults.baseURL)) {
              url = url.substring(github.defaults.baseURL.length);
            }
            break;
          }
        }
      }
    }
    return allTags;
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error(`Repository not found: https://github.com/${repoPath}`);
    }
    throw new Error(`Failed to fetch all tags (pagination might be involved): ${error.message}`);
  }
}

// Get commit information
export async function fetchCommitInfo(repoPath, sha, token) {
  const github = createGitHubRequest(token);
  
  try {
    const response = await github.get(`/repos/${repoPath}/commits/${sha}`);
    return {
      date: response.data.commit.committer.date.split('T')[0],
      message: response.data.commit.message,
      author: response.data.commit.author.name
    };
  } catch (error) {
    throw new Error(`Failed to fetch commit info: ${error.message}`);
  }
}

// Check if repository exists
export async function checkRepositoryExists(repoUrl, token) {
  const repoPath = extractRepoPath(repoUrl);
  const github = createGitHubRequest(token);
  
  try {
    await github.get(`/repos/${repoPath}`);
    return true;
  } catch (error) {
    if (error.response?.status === 404) {
      return false;
    }
    throw error;
  }
}

// Get repository information
export async function fetchRepositoryInfo(repoUrl, token) {
  const repoPath = extractRepoPath(repoUrl);
  const github = createGitHubRequest(token);
  
  try {
    const response = await github.get(`/repos/${repoPath}`);
    return {
      name: response.data.name,
      fullName: response.data.full_name,
      description: response.data.description,
      stars: response.data.stargazers_count,
      forks: response.data.forks_count,
      language: response.data.language,
      updatedAt: response.data.updated_at.split('T')[0],
      url: response.data.html_url
    };
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error(`Repository not found: ${repoUrl}`);
    }
    throw new Error(`Failed to fetch repository info: ${error.message}`);
  }
}

// Rate limiting helper
export function getRateLimitDelay(isTokenProvided) {
  // With token: 5000 requests/hour = ~1.4 requests/second
  // Without token: 60 requests/hour = ~1 request/minute
  return isTokenProvided ? 100 : 1000;
}

// Handle GitHub API errors consistently
export function handleGitHubError(error, repoUrl) {
  if (error.response) {
    switch (error.response.status) {
      case 404:
        throw new Error(`Repository not found: ${repoUrl}`);
      case 403:
        if (error.response.headers['x-ratelimit-remaining'] === '0') {
          throw new Error('GitHub API rate limit exceeded - token recommended');
        }
        throw new Error('GitHub API access forbidden - check token permissions');
      case 401:
        throw new Error('GitHub API authentication failed - check token');
      default:
        throw new Error(`GitHub API error (${error.response.status}): ${error.response.statusText}`);
    }
  } else if (error.code === 'ECONNABORTED') {
    throw new Error('GitHub API request timeout');
  } else {
    throw new Error(`GitHub API error: ${error.message}`);
  }
}
