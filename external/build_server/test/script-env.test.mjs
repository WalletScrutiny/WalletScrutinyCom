import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { buildScriptExecutionEnv } from '../script-env.mjs';
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
