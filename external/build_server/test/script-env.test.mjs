import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { buildScriptExecutionEnv } from '../script-env.mjs';

describe('buildScriptExecutionEnv', () => {
  test('includes Nix profile paths in PATH', () => {
    const env = buildScriptExecutionEnv();
    assert.match(env.PATH, /\/nix\/var\/nix\/profiles\/default\/bin/);
    assert.match(env.PATH, /\/\.nix-profile\/bin/);
  });

  test('passes through GITHUB_TOKEN when provided', () => {
    const env = buildScriptExecutionEnv({ githubToken: 'ghp_test' });
    assert.equal(env.GITHUB_TOKEN, 'ghp_test');
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
