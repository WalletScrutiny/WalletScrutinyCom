// CVSS 4.0 scores, against FIRST's reference calculator (cvss_score.js).
// The expected values are what that calculator gives for the same vectors.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cvss4Score } from '../cvss4.mjs';

test('CVSS 4.0 base scores match the reference calculator', () => {
  const cases = {
    'CVSS:4.0/AV:N/AC:L/AT:N/PR:N/UI:N/VC:H/VI:H/VA:H/SC:N/SI:N/SA:N': 9.3,
    'CVSS:4.0/AV:L/AC:L/AT:N/PR:N/UI:P/VC:H/VI:N/VA:N/SC:N/SI:N/SA:N': 6.8, // RUSTSEC-2026-0459
    'CVSS:4.0/AV:N/AC:L/AT:P/PR:N/UI:N/VC:L/VI:H/VA:N/SC:N/SI:N/SA:N/E:P': 6.9, // PYSEC-2026-3554
    'CVSS:4.0/AV:N/AC:H/AT:P/PR:H/UI:N/VC:L/VI:L/VA:N/SC:N/SI:H/SA:L': 4.8,
    'CVSS:4.0/AV:L/AC:L/AT:P/PR:N/UI:N/VC:H/VI:N/VA:H/SC:L/SI:N/SA:H': 7.1,
    'CVSS:4.0/AV:P/AC:L/AT:P/PR:N/UI:A/VC:H/VI:H/VA:H/SC:L/SI:L/SA:H': 7,
    'CVSS:4.0/AV:N/AC:H/AT:N/PR:H/UI:N/VC:N/VI:N/VA:N/SC:L/SI:L/SA:H': 5.1,
    // environmental and threat metrics
    'CVSS:4.0/AV:L/AC:L/AT:P/PR:H/UI:A/VC:H/VI:H/VA:N/SC:L/SI:L/SA:L/CR:M/MSI:S/MSA:S': 8.5,
    'CVSS:4.0/AV:A/AC:L/AT:P/PR:H/UI:P/VC:L/VI:N/VA:N/SC:L/SI:N/SA:L/E:U/IR:L/AR:L/MAV:L/MSI:N/MSA:H': 0.3,
    // rounded as the reference rounds (other libraries round this one up to 5.7)
    'CVSS:4.0/AV:L/AC:H/AT:P/PR:H/UI:N/VC:H/VI:L/VA:N/SC:L/SI:N/SA:N': 5.6,
    'CVSS:4.0/AV:L/AC:H/AT:N/PR:H/UI:N/VC:N/VI:N/VA:N/SC:N/SI:N/SA:N': 0,
  };
  for (const [vector, score] of Object.entries(cases)) assert.equal(cvss4Score(vector), score, vector);
});

test('anything but a complete CVSS 4.0 vector has no score', () => {
  assert.equal(cvss4Score('CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H'), null);
  assert.equal(cvss4Score('CVSS:4.0/AV:N/AC:L/AT:N/PR:N/UI:N/VC:H/VI:H/VA:H'), null, 'no subsequent-system metrics');
  assert.equal(cvss4Score('CVSS:4.0/AV:X/AC:L/AT:N/PR:N/UI:N/VC:H/VI:H/VA:H/SC:N/SI:N/SA:N'), null);
  assert.equal(cvss4Score(null), null);
});
