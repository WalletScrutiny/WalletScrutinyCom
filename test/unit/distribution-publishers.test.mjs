import { describe, test } from 'node:test';
import assert from 'node:assert/strict';

import { checkPublisherClaim, developerEvidence } from '../../scripts/checkDistributionPublishers.mjs';

const core = { website: 'https://bitcoincore.org', repository: 'https://github.com/bitcoin/bitcoin' };
const green = { website: 'https://blockstream.com/green/', repository: 'https://github.com/Blockstream/green_qt' };
const site = (website) => ({ verified: true, method: 'website', website });
const unverified = { verified: false, method: 'none' };

describe('developerEvidence', () => {
  test('accepts the page website or a parent domain of it', () => {
    assert.equal(developerEvidence(core, site('bitcoincore.org')), 'website bitcoincore.org');
    assert.equal(developerEvidence({ website: 'https://www.green.blockstream.com' }, site('blockstream.com')), 'website blockstream.com');
    assert.equal(developerEvidence(green, site('blockstream.com')), 'website blockstream.com');
  });

  test('rejects verification by an unrelated domain, including look-alikes', () => {
    assert.equal(developerEvidence(core, site('evil.org')), null);
    assert.equal(developerEvidence(core, site('notbitcoincore.org')), null);
    assert.equal(developerEvidence({ website: 'https://bitcoincore.org.evil.com' }, site('bitcoincore.org')), null);
  });

  test('accepts a login only for the owner of the page repository', () => {
    const login = (name) => ({ verified: true, method: 'login_provider', login_provider: 'github', login_name: name });
    assert.equal(developerEvidence(core, login('Bitcoin')), 'github.com/bitcoin');
    assert.equal(developerEvidence(core, login('mallory')), null);
  });

  test('nothing counts when Flathub has not verified it', () => {
    assert.equal(developerEvidence(core, { ...site('bitcoincore.org'), verified: false }), null);
    assert.equal(developerEvidence(core, unverified), null);
    assert.equal(developerEvidence(core, undefined), null);
  });
});

describe('checkPublisherClaim', () => {
  test('developer needs evidence', () => {
    assert.equal(checkPublisherClaim(core, { channel: 'flathub', publisher: 'developer' }, site('bitcoincore.org')).ok, true);
    assert.equal(checkPublisherClaim(core, { channel: 'flathub', publisher: 'developer' }, unverified).ok, false);
  });

  test('community is flagged when Flathub ties it to the developers', () => {
    assert.equal(checkPublisherClaim(core, { channel: 'flathub', publisher: 'community' }, unverified).ok, true);
    assert.equal(checkPublisherClaim(core, { channel: 'flathub', publisher: 'community' }, site('bitcoincore.org')).ok, false);
  });
});
