import { test } from 'node:test';
import assert from 'node:assert/strict';
import { normaliseRepoUrl, mavenRepo, npmRepo, pypiRepo, resolveRepo } from '../sourceRepos.mjs';

test('normaliseRepoUrl handles the shapes registries use', () => {
  const cases = {
    'git+https://github.com/o/r.git': 'https://github.com/o/r',
    'git+ssh://git@github.com/o/r.git': 'https://github.com/o/r',
    'git://github.com/o/r.git': 'https://github.com/o/r',
    'github:o/r': 'https://github.com/o/r',
    'o/r': 'https://github.com/o/r',
    'git@github.com:o/r.git': 'https://github.com/o/r',
    'scm:git:git://github.com/o/r.git': 'https://github.com/o/r',
    'https://github.com/o/r/tree/main/packages/x': 'https://github.com/o/r',
    'https://gitlab.com/g/sub/r/-/tree/main': 'https://gitlab.com/g/sub/r',
    'https://gitbox.apache.org/repos/asf?p=commons-io.git': 'https://gitbox.apache.org/repos/asf/commons-io',
    'https://git-wip-us.apache.org/repos/asf?p=commons-lang.git': 'https://gitbox.apache.org/repos/asf/commons-lang',
    'https://cs.android.com/androidx/platform/frameworks/support': 'https://android.googlesource.com/platform/frameworks/support',
  };
  for (const [raw, want] of Object.entries(cases)) assert.equal(normaliseRepoUrl(raw), want, raw);
  assert.equal(normaliseRepoUrl('https://github.com/o'), null);
  assert.equal(normaliseRepoUrl(''), null);
  assert.equal(normaliseRepoUrl(undefined), null);
});

const respond = (map) => async (url) => {
  const body = map[url];
  return body === undefined ? { status: 404, ok: false } : { status: 200, ok: true, text: async () => body, json: async () => JSON.parse(body) };
};

test('mavenRepo walks to the parent POM when the child has no scm', async () => {
  const base = 'https://repo1.maven.org/maven2';
  const fetchImpl = respond({
    [`${base}/g/a/1.0/a-1.0.pom`]: '<project><parent><groupId>g</groupId><artifactId>p</artifactId><version>2</version></parent></project>',
    [`${base}/g/p/2/p-2.pom`]: '<project><scm><url>https://github.com/o/r</url></scm></project>',
  });
  assert.deepEqual(await mavenRepo('g:a', '1.0', fetchImpl), { url: 'https://github.com/o/r', source: 'maven-parent-scm' });
});

test('mavenRepo ignores a commented scm and a licence url', async () => {
  const fetchImpl = respond({
    'https://repo1.maven.org/maven2/g/a/1/a-1.pom': '<project><!-- <scm><url>https://github.com/x/y</url></scm> --><licenses><license><url>https://github.com/l/l</url></license></licenses></project>',
  });
  const r = await mavenRepo('g:a', '1', fetchImpl);
  assert.equal(r.url, null);
});

test('mavenRepo drops an @aar classifier and skips dynamic versions without fetching', async () => {
  const fetchImpl = respond({
    'https://repo1.maven.org/maven2/g/a/1.0/a-1.0.pom': '<project><scm><url>https://github.com/o/r</url></scm></project>',
  });
  assert.equal((await mavenRepo('g:a', '1.0@aar', fetchImpl)).url, 'https://github.com/o/r');
  const never = () => { throw new Error('fetched'); };
  assert.equal((await mavenRepo('g:a', '2.+', never)).note, 'dynamic version, no POM to read');
  assert.equal((await mavenRepo('g:a', '[1.0,2.0)', never)).note, 'dynamic version, no POM to read');
});

test('npmRepo reads the repository field; @types falls back to DefinitelyTyped', async () => {
  const fetchImpl = respond({
    'https://registry.npmjs.org/lodash/latest': JSON.stringify({ repository: { type: 'git', url: 'git+https://github.com/lodash/lodash.git' } }),
    'https://registry.npmjs.org/@types%2Ffoo/latest': JSON.stringify({ name: '@types/foo' }),
  });
  assert.equal((await npmRepo('lodash', fetchImpl)).url, 'https://github.com/lodash/lodash');
  const types = await resolveRepo({ ecosystem: 'npm', name: '@types/foo' }, fetchImpl);
  assert.deepEqual([types.url, types.source], ['https://github.com/DefinitelyTyped/DefinitelyTyped', 'known-pattern']);
});

test('pypiRepo prefers a source key on a code host, normalises the name, skips funding links', async () => {
  const fetchImpl = respond({
    'https://pypi.org/pypi/typing-extensions/json': JSON.stringify({ info: { project_urls: { Documentation: 'https://docs.example.org', Source: 'https://docs.example.org/src', Repository: 'https://github.com/python/typing_extensions/' } } }),
    'https://pypi.org/pypi/rpi-gpio/json': JSON.stringify({ info: { home_page: 'http://sourceforge.net/projects/raspberry-gpio-python/', project_urls: { Homepage: 'http://sourceforge.net/projects/raspberry-gpio-python/' } } }),
    'https://pypi.org/pypi/x/json': JSON.stringify({ info: { project_urls: { Funding: 'https://github.com/sponsors/someone', Issues: 'https://github.com/o/x/issues' } } }),
  });
  assert.deepEqual(await pypiRepo('typing_extensions', fetchImpl), { url: 'https://github.com/python/typing_extensions', source: 'pypi' });
  assert.equal((await pypiRepo('RPi.GPIO', fetchImpl)).note, 'registry names no repository');
  assert.deepEqual(await pypiRepo('x', fetchImpl), { url: 'https://github.com/o/x', source: 'pypi-homepage' });
  assert.equal((await pypiRepo('nope', fetchImpl)).note, 'not on the registry');
  const never = () => { throw new Error('fetched'); };
  assert.equal((await pypiRepo('\0p\0y', never)).note, 'not a package name');
});

import { parseLsRemote, matchTag, identityOf } from '../sourceIdentity.mjs';

test('identity: annotated tags peel to the commit; monorepo tags prefer the package-qualified one', () => {
  const a = 'a'.repeat(40), b = 'b'.repeat(40), c = 'c'.repeat(40);
  const tags = parseLsRemote(`${a}\trefs/tags/v1.2.3\n${b}\trefs/tags/v1.2.3^{}\n${c}\trefs/tags/pkg@1.2.3\n`);
  assert.equal(tags.get('v1.2.3'), b);
  assert.equal(matchTag(tags, 'pkg', '1.2.3'), 'pkg@1.2.3');
  assert.equal(matchTag(tags, 'other', '1.2.3'), 'v1.2.3');
  assert.equal(matchTag(tags, 'pkg', '1.2'), null);
  assert.equal(matchTag(new Map([['okhttp-parent-4.12.0', a]]), 'com.squareup.okhttp3:okhttp', '4.12.0'), null);
  assert.equal(matchTag(new Map([['okhttp-4.12.0', a]]), 'com.squareup.okhttp3:okhttp', '4.12.0'), 'okhttp-4.12.0');
  assert.equal(matchTag(new Map([['rel/commons-io-2.11.0', a]]), 'commons-io:commons-io', '2.11.0'), 'rel/commons-io-2.11.0');
});

test('identity: no tag falls back to the registry-named commit; unreachable repo is its own status', () => {
  const tags = new Map([['v1.0.0', 'a'.repeat(40)]]);
  assert.equal(identityOf({ ecosystem: 'npm', name: 'x', version: '2.0.0' }, tags, { provenance: true, gitHead: 'f'.repeat(40), published: true }).status, 'commit-named');
  assert.equal(identityOf({ ecosystem: 'cargo', name: 'x', version: '2.0.0' }, tags).status, 'no-tag');
  assert.equal(identityOf({ ecosystem: 'cargo', name: 'x', version: '2.0.0' }, null).status, 'repo-unreachable');
});
