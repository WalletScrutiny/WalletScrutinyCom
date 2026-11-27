import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { buildScriptExecutionEnv, readPublicGithubToken } from '../script-env.mjs';
import { GITHUB_TOKEN_APP_IDS } from '../config/config.mjs';

describe('buildScriptExecutionEnv', () => {
  test('includes Nix profile paths in PATH', () => {
    const env = buildScriptExecutionEnv();
    assert.match(env.PATH, /\/nix\/var\/nix\/profiles\/default\/bin/);
    assert.match(env.PATH, /\/\.nix-profile\/bin/);
  });

  test('passes GITHUB_TOKEN to an app on the token list', () => {
    const env = buildScriptExecutionEnv({ githubToken: 'ghp_test', appId: 'to.bitkit' });
    assert.equal(env.GITHUB_TOKEN, 'ghp_test');
  });

  test('withholds GITHUB_TOKEN from an app not on the token list', () => {
    const env = buildScriptExecutionEnv({ githubToken: 'ghp_test', appId: 'world.bitkey.app' });
    assert.equal('GITHUB_TOKEN' in env, false);
  });

  test('withholds GITHUB_TOKEN when the app is unknown', () => {
    const env = buildScriptExecutionEnv({ githubToken: 'ghp_test' });
    assert.equal('GITHUB_TOKEN' in env, false);
  });

  test('withholds the host GITHUB_TOKEN from an app not on the token list', () => {
    const previous = process.env.GITHUB_TOKEN;
    process.env.GITHUB_TOKEN = 'ghp_host';
    try {
      assert.equal('GITHUB_TOKEN' in buildScriptExecutionEnv({ appId: 'world.bitkey.app' }), false);
      assert.equal(buildScriptExecutionEnv({ appId: 'to.bitkit' }).GITHUB_TOKEN, 'ghp_host');
    } finally {
      if (previous === undefined) {
        delete process.env.GITHUB_TOKEN;
      } else {
        process.env.GITHUB_TOKEN = previous;
      }
    }
  });

  test('omits GITHUB_TOKEN when there is no token, so spawn() cannot pass "null"', () => {
    const previous = process.env.GITHUB_TOKEN;
    delete process.env.GITHUB_TOKEN;
    try {
      assert.equal('GITHUB_TOKEN' in buildScriptExecutionEnv({ appId: 'to.bitkit' }), false);
    } finally {
      if (previous !== undefined) process.env.GITHUB_TOKEN = previous;
    }
  });

  test('gives an app not on the token list the public token, never the real one', () => {
    const env = buildScriptExecutionEnv({ githubToken: 'ghp_real', publicGithubToken: 'github_pat_public', appId: 'world.bitkey.app' });
    assert.equal(env.GITHUB_TOKEN, 'github_pat_public');
  });

  test('gives an app on the token list the real token, not the public one', () => {
    const env = buildScriptExecutionEnv({ githubToken: 'ghp_real', publicGithubToken: 'github_pat_public', appId: 'to.bitkit' });
    assert.equal(env.GITHUB_TOKEN, 'ghp_real');
  });

  test('gives an unknown app the public token', () => {
    const env = buildScriptExecutionEnv({ githubToken: 'ghp_real', publicGithubToken: 'github_pat_public' });
    assert.equal(env.GITHUB_TOKEN, 'github_pat_public');
  });

  test('reads the public token from GITHUB_PUBLIC_TOKEN_FILE', () => {
    const previous = process.env.GITHUB_PUBLIC_TOKEN_FILE;
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'public-token-'));
    const file = path.join(dir, 'build-server-gh-public-token');
    fs.writeFileSync(file, 'github_pat_public\n');
    process.env.GITHUB_PUBLIC_TOKEN_FILE = file;
    try {
      assert.equal(readPublicGithubToken(), 'github_pat_public');
      const env = buildScriptExecutionEnv({ githubToken: 'ghp_real', appId: 'world.bitkey.app' });
      assert.equal(env.GITHUB_TOKEN, 'github_pat_public');
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
      if (previous === undefined) {
        delete process.env.GITHUB_PUBLIC_TOKEN_FILE;
      } else {
        process.env.GITHUB_PUBLIC_TOKEN_FILE = previous;
      }
    }
  });

  test('without a public token file, an app not on the list gets no token at all', () => {
    const previous = process.env.GITHUB_PUBLIC_TOKEN_FILE;
    process.env.GITHUB_PUBLIC_TOKEN_FILE = path.join(os.tmpdir(), 'no-such-public-token');
    try {
      assert.equal(readPublicGithubToken(), undefined);
      const env = buildScriptExecutionEnv({ githubToken: 'ghp_real', appId: 'world.bitkey.app' });
      assert.equal('GITHUB_TOKEN' in env, false);
    } finally {
      if (previous === undefined) {
        delete process.env.GITHUB_PUBLIC_TOKEN_FILE;
      } else {
        process.env.GITHUB_PUBLIC_TOKEN_FILE = previous;
      }
    }
  });

  test('every app on the token list has a site listing', () => {
    const root = new URL('../../../', import.meta.url);
    for (const appId of GITHUB_TOKEN_APP_IDS) {
      const found = ['_mobile', '_desktop'].some(dir => fs.existsSync(new URL(`${dir}/${appId}.md`, root)));
      assert.ok(found, `${appId} has no _mobile or _desktop listing`);
    }
  });

  test('passes through NIX_SSL_CERT_FILE from the host environment', () => {
    const previous = process.env.NIX_SSL_CERT_FILE;
    process.env.NIX_SSL_CERT_FILE = '/etc/ssl/certs/ca-certificates.crt';
    try {
      const env = buildScriptExecutionEnv();
      assert.equal(env.NIX_SSL_CERT_FILE, '/etc/ssl/certs/ca-certificates.crt');
    } finally {
      if (previous === undefined) {
        delete process.env.NIX_SSL_CERT_FILE;
      } else {
        process.env.NIX_SSL_CERT_FILE = previous;
      }
    }
  });
});
