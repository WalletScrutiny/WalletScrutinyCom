import axios from 'axios';

const GITHUB_API_BASE = 'https://api.github.com';
const DOCKER_HUB_API_BASE = 'https://hub.docker.com/v2';

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

// Fetch GitHub releases and their assets
export async function fetchGitHubAssets(repoUrl, githubToken = null) {
  const repoPath = extractRepoPath(repoUrl);
  const headers = githubToken ? { 'Authorization': `token ${githubToken}` } : {};

  const assets = [];

  try {
    // Fetch all releases
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const response = await axios.get(`${GITHUB_API_BASE}/repos/${repoPath}/releases`, {
        headers,
        params: { page, per_page: 100 }
      });

      if (response.data.length === 0) {
        hasMore = false;
        break;
      }

      for (const release of response.data) {
        console.log(`release ${repoPath} ${page} ${release.tag_name}:`, release);
        const version = release.tag_name;

        // Process release assets
        if (release.assets && release.assets.length > 0) {
          for (const asset of release.assets) {
            // GitHub API provides digest (SHA256) directly in the asset object since 2025
            let sha256 = null;

            if (asset.digest) {
              // Extract SHA256 from digest format (usually "sha256:hash" or just "hash")
              if (asset.digest.startsWith('sha256:')) {
                sha256 = asset.digest.replace('sha256:', '').toLowerCase();
              } else if (/^[a-f0-9]{64}$/i.test(asset.digest)) {
                // Already a 64-character hex string
                sha256 = asset.digest.toLowerCase();
              } else {
                // Try to extract hash from digest
                const match = asset.digest.match(/([a-f0-9]{64})/i);
                if (match) {
                  sha256 = match[1].toLowerCase();
                }
              }
            }

            // If digest is not available (older releases or API issue), mark as unknown
            if (!sha256) {
              // console.warn(`  ⚠ No digest available for ${asset.name} - asset may be from before 2025 or API issue`);
              sha256 = 'unknown';
            }

            if (sha256 !== 'unknown') {
              assets.push({
                version,
                assetName: asset.name,
                sha256,
                source: 'github',
                architecture: null,
                os: null,
                size: asset.size,
                downloadUrl: asset.browser_download_url,
                publishedAt: asset.created_at,
                authorId: release.author?.id?.toString() || null,
                authorLogin: release.author?.login || null
              });
            }
          }
        }
      }

      if (response.data.length < 100) {
        hasMore = false;
      } else {
        page++;
      }
    }

    return assets;
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error(`Repository not found: ${repoUrl}`);
    } else if (error.response?.status === 403) {
      throw new Error('GitHub API rate limited - token recommended');
    } else {
      throw new Error(`GitHub API error: ${error.message}`);
    }
  }
}

// Parse Docker image reference to extract registry, namespace, and repository
export function parseDockerImage(imageRef) {
  // Default registry is Docker Hub
  let registry = 'docker.io';
  let imagePath = imageRef;

  // Check if image reference contains a registry (contains '/' and a dot before the first '/')
  // Format: registry.com/user/image or registry.com:port/user/image
  const parts = imageRef.split('/');
  if (parts.length > 1) {
    const firstPart = parts[0];
    // Check if first part looks like a registry (contains dot or is a known registry)
    if (firstPart.includes('.') || firstPart.includes(':') || 
        firstPart === 'ghcr.io' || firstPart === 'docker.io' || firstPart === 'quay.io') {
      registry = firstPart;
      imagePath = parts.slice(1).join('/');
    }
  }

  // Normalize docker.io to hub.docker.com for API calls
  if (registry === 'docker.io') {
    registry = 'hub.docker.com';
  }

  // Extract namespace and repository from image path
  // For Docker Hub API, we need separate namespace and repository
  // For Docker Registry API v2, we use the full repository path
  let namespace = 'library';
  let repository = imagePath;
  let fullRepositoryPath = imagePath; // Full path for Docker Registry API v2

  if (imagePath.includes('/')) {
    const pathParts = imagePath.split('/');
    namespace = pathParts[0];
    repository = pathParts.slice(1).join('/');
    fullRepositoryPath = imagePath; // Keep full path for Registry API v2
  }

  return { registry, namespace, repository, imagePath, fullRepositoryPath };
}

// Get API base URL for a Docker registry
export function getDockerRegistryApiBase(registry) {
  // Docker Hub uses a different API endpoint
  if (registry === 'hub.docker.com') {
    return DOCKER_HUB_API_BASE;
  }
  
  // Other registries use Docker Registry API v2
  // Handle both with and without protocol
  let baseUrl = registry;
  if (!baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
    baseUrl = `https://${baseUrl}`;
  }
  return `${baseUrl}/v2`;
}

// Get Docker Registry token using GitHub token for ghcr.io
export async function getDockerRegistryToken(registry, fullRepositoryPath, githubToken) {
  if (registry !== 'ghcr.io' || !githubToken) {
    return null;
  }

  try {
    // First, get the GitHub username from the token
    let username = null;
    try {
      const userResponse = await axios.get('https://api.github.com/user', {
        headers: {
          'Authorization': `Bearer ${githubToken}`
        }
      });
      username = userResponse.data.login;
    } catch (error) {
      console.warn(`Failed to get GitHub username: ${error.message}`);
      // Try with token as username (some registries accept this)
      username = githubToken;
    }

    // For ghcr.io, we need to get a token from the token endpoint
    // Using Basic auth with username:token format
    const tokenUrl = `https://ghcr.io/token?service=ghcr.io&scope=repository:${fullRepositoryPath}:pull`;
    const auth = Buffer.from(`${username}:${githubToken}`).toString('base64');
    
    const tokenResponse = await axios.get(tokenUrl, {
      headers: {
        'Authorization': `Basic ${auth}`
      },
      validateStatus: function (status) {
        return status < 500;
      }
    });

    if (tokenResponse.status === 200 && tokenResponse.data?.token) {
      return tokenResponse.data.token;
    } else {
      console.warn(`Failed to get Docker registry token: ${tokenResponse.status} - ${JSON.stringify(tokenResponse.data)}`);
      return null;
    }
  } catch (error) {
    console.warn(`Failed to get Docker registry token: ${error.message}`);
    return null;
  }
}

// Fetch Docker container images and their digests
export async function fetchDockerAssets(imageRef, dockerToken = null) {
  const assets = [];

  try {
    // Parse the image reference to extract registry information
    const { registry, namespace, repository, imagePath, fullRepositoryPath } = parseDockerImage(imageRef);
    const apiBase = getDockerRegistryApiBase(registry);

    // Prepare headers
    let headers = {};
    let registryToken = dockerToken;
    
    // For ghcr.io, try to get a registry token if we have a GitHub token
    if (registry === 'ghcr.io' && dockerToken && dockerToken.startsWith('ghp_')) {
      //console.log('Attempting to get Docker registry token from ghcr.io...');
      registryToken = await getDockerRegistryToken(registry, fullRepositoryPath, dockerToken);
      if (registryToken) {
        //console.log('Successfully obtained Docker registry token');
      } else {
        console.warn('Failed to get Docker registry token, using GitHub token directly');
        registryToken = dockerToken;
      }
    }

    if (registryToken) {
      headers['Authorization'] = `Bearer ${registryToken}`;
    }

    // Docker Hub uses a different API structure than standard Docker Registry API
    if (registry === 'hub.docker.com') {
      // Fetch all tags using Docker Hub API
      let page = 1;
      let hasMore = true;

      while (hasMore) {
        const response = await axios.get(`${apiBase}/repositories/${namespace}/${repository}/tags`, {
          headers,
          params: { page, page_size: 200 }
        });

        if (!response.data.results || response.data.results.length === 0) {
          hasMore = false;
          break;
        }

        for (const tag of response.data.results) {
          const version = tag.name;

          // Skip 'latest' version tag
          if (version === 'latest') {
            continue;
          }

          // Get the digest (sha256) for this tag
          // Docker Hub provides digests in the images array
          // Use tag_last_pushed or last_updated as published date
          const publishedAt = tag.tag_last_pushed || tag.last_updated || null;
          
          if (tag.images && tag.images.length > 0) {
            for (const image of tag.images) {
              console.log('image', image);
              const digest = image.digest;
              if (digest && digest.startsWith('sha256:')) {
                const sha256 = digest.replace('sha256:', '');
                // Combine architecture with variant if variant exists
                let architecture = image.architecture;
                if (image.variant) {
                  architecture = `${image.architecture}-${image.variant}`;
                }
                assets.push({
                  version,
                  assetName: `${imageRef}:${version}`,
                  sha256,
                  source: 'docker',
                  architecture: architecture,
                  os: image.os,
                  size: image.size,
                  publishedAt
                });
              }
            }
          } else if (tag.digest) {
            // Some tags might have digest directly
            const sha256 = tag.digest.replace('sha256:', '');
            assets.push({
              version,
              assetName: `${imageRef}:${version}`,
              sha256,
              source: 'docker',
              architecture: null,
              os: null,
              size: tag.full_size,
              publishedAt
            });
          }
        }

        if (!response.data.next) {
          hasMore = false;
        } else {
          page++;
        }
      }
    } else {
      try {
        // Fetch all tags with pagination
        // Docker Registry API v2 supports pagination using 'n' (number of results) and 'last' (last tag name)
        const allTags = [];
        let lastTag = null;
        let hasMore = true;
        const pageSize = 1000; // Request up to 1000 tags per page (some registries support this)

        while (hasMore) {
          const tagsUrl = `${apiBase}/${fullRepositoryPath}/tags/list`;
          const params = { n: pageSize };
          if (lastTag) {
            params.last = lastTag;
          }
          
          let tagsResponse;
          try {
            tagsResponse = await axios.get(tagsUrl, {
              headers,
              params,
              validateStatus: function (status) {
                // Don't throw for any status, we'll handle them explicitly
                return true;
              }
            });
          } catch (axiosError) {
            // If axios throws an error (network, timeout, etc.), rethrow it
            throw axiosError;
          }
          
          // Check for authentication errors
          if (tagsResponse.status === 401 || tagsResponse.status === 403) {
            const errorMsg = tagsResponse.data?.errors?.[0]?.message || tagsResponse.statusText || 'Authentication required';
            const error = new Error(`Docker registry authentication failed for ${registry}: ${errorMsg}. Token may be required or invalid.`);
            error.response = tagsResponse;
            throw error;
          }
          
          // Check for not found
          if (tagsResponse.status === 404) {
            const error = new Error(`Docker image not found: ${imageRef}`);
            error.response = tagsResponse;
            throw error;
          }
          
          // Check for other errors
          if (tagsResponse.status >= 400) {
            const errorMsg = tagsResponse.data?.errors?.[0]?.message || tagsResponse.statusText || 'Unknown error';
            const error = new Error(`Docker registry API error for ${registry} (${tagsResponse.status}): ${errorMsg}`);
            error.response = tagsResponse;
            throw error;
          }

          // Get tags from response
          const pageTags = tagsResponse.data.tags || [];
          
          if (pageTags.length === 0) {
            hasMore = false;
            break;
          }

          // Add tags to our collection
          allTags.push(...pageTags);
          
          // Check if we got fewer tags than requested (indicates last page)
          // Also check if the response indicates there are more tags
          if (pageTags.length < pageSize) {
            hasMore = false;
          } else {
            // Set lastTag to the last tag from this page for next iteration
            lastTag = pageTags[pageTags.length - 1];
            // Some registries may return the same page if there are no more tags
            // We'll detect this by checking if we've seen this tag before
            if (allTags.filter(t => t === lastTag).length > 1) {
              hasMore = false;
            }
          }
        }

        console.log(`Fetched ${allTags.length} tags from ${registry}`);
        //for (const tagName of allTags) {
        //  console.log('tagName', tagName);
        //}

        // Reverse the tags array
        allTags.reverse();

        if (allTags.length === 0) {
          return assets;
        }

        // For each tag, get the manifest to extract digest and architecture info
        for (const tagName of allTags) {
          if (tagName === 'latest') {
            continue;
          }

          try {
            // Get manifest with Accept header for multi-arch support
            const manifestResponse = await axios.get(
              `${apiBase}/${fullRepositoryPath}/manifests/${tagName}`,
              {
                headers: {
                  ...headers,
                  'Accept': 'application/vnd.docker.distribution.manifest.list.v2+json, application/vnd.docker.distribution.manifest.v2+json, application/vnd.oci.image.index.v1+json'
                }
              }
            );
//            console.log(`manifestResponse ${tagName}:`, manifestResponse.data);

            const manifest = manifestResponse.data;
            const manifestDigest = manifestResponse.headers['docker-content-digest'];

            // Handle manifest list (multi-arch)
            if (['application/vnd.docker.distribution.manifest.list.v2+json', 'application/vnd.oci.image.index.v1+json'].includes(manifest.mediaType) && manifest.manifests) {
              for (const manifestRef of manifest.manifests) {
                if (manifestRef.digest && manifestRef.digest.startsWith('sha256:')) {
                  // if both manifestRef.platform?.architecture and manifestRef.platform?.os are null, skip
                  if (manifestRef.platform?.architecture === 'unknown' && manifestRef.platform?.os === 'unknown') {
                    continue;
                  }

                  const sha256 = manifestRef.digest.replace('sha256:', '');

                  assets.push({
                    version: tagName,
                    assetName: `${imageRef}:${tagName}`,
                    sha256,
                    source: 'docker',
                    architecture: manifestRef.platform?.architecture || null,
                    os: manifestRef.platform?.os || null,
                    size: manifestRef.size || null,
                    publishedAt: null
                  });
                }
              }
            } else if (manifest.mediaType === 'application/vnd.docker.distribution.manifest.v2+json') {
              // Single manifest
              const sha256 = manifestDigest ? manifestDigest.replace('sha256:', '') : null;
              if (sha256) {
                assets.push({
                  version: tagName,
                  assetName: `${imageRef}:${tagName}`,
                  sha256,
                  source: 'docker',
                  architecture: manifest.config?.platform?.architecture || null,
                  os: manifest.config?.platform?.os || null,
                  size: manifest.config?.size || null,
                  publishedAt: null
                });
              }
            }
          } catch (manifestError) {
            // Skip tags that fail to fetch manifest
            console.warn(`Failed to fetch manifest for ${imageRef}:${tagName}: ${manifestError.message}`);
            continue;
          }
        }
      } catch (tagsError) {
        // Log detailed error information for debugging
        if (tagsError.response) {
          console.error('Error response status:', tagsError.response.status);
          console.error('Error response headers:', JSON.stringify(tagsError.response.headers, null, 2));
          console.error('Error response data:', JSON.stringify(tagsError.response.data, null, 2));
          
          if (tagsError.response.status === 404) {
            throw new Error(`Docker image not found: ${imageRef}`);
          } else if (tagsError.response.status === 401 || tagsError.response.status === 403) {
            const errorMsg = tagsError.response.data?.errors?.[0]?.message || tagsError.response.statusText;
            throw new Error(`Docker registry authentication failed for ${registry}: ${errorMsg}. Token may be required or invalid.`);
          } else {
            const errorMsg = tagsError.response.data?.errors?.[0]?.message || tagsError.response.statusText || tagsError.message;
            throw new Error(`Docker registry API error for ${registry} (${tagsError.response.status}): ${errorMsg}`);
          }
        } else if (tagsError.request) {
          // Request was made but no response received
          throw new Error(`Docker registry API request failed for ${registry}: No response received. ${tagsError.message}`);
        } else {
          // Error setting up the request
          throw new Error(`Docker registry API error for ${registry}: ${tagsError.message}`);
        }
      }
    }

    return assets;
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error(`Docker image not found: ${imageRef}`);
    } else if (error.response?.status === 401 || error.response?.status === 403) {
      const { registry } = parseDockerImage(imageRef);
      throw new Error(`Docker registry authentication failed for ${registry} - token may be required`);
    } else {
      throw new Error(`Docker registry API error: ${error.message}`);
    }
  }
}

// Notification procedure (placeholder)
export function notifySha256Changed(appId, version, assetName, source, oldSha256, newSha256) {
  console.log(`[NOTIFICATION] SHA256 changed for ${appId}/${version}/${assetName} (source: ${source})`);
  console.log(`  Old: ${oldSha256}`);
  console.log(`  New: ${newSha256}`);
  // TODO: Implement actual notification logic (email, webhook, etc.)
}

