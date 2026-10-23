import assert from 'node:assert/strict';
import { test } from 'node:test';
import { matchingState, selectedRepository } from '../../web/lib/github-selection.js';

test('installation callback requires the same unexpired state token shape', () => {
  const value = 'a'.repeat(64);
  assert.equal(matchingState(value, value), true);
  assert.equal(matchingState(value, 'b'.repeat(64)), false);
  assert.equal(matchingState(undefined, value), false);
  assert.equal(matchingState(value, 'not-a-token'), false);
});

test('only repository IDs from the current installation can be selected', () => {
  const allowed = [{ id: 10, installationId: 20, fullName: 'owner/allowed', htmlUrl: 'https://github.com/owner/allowed' }];
  assert.deepEqual(selectedRepository(allowed, '10'), allowed[0]);
  assert.throws(() => selectedRepository(allowed, '11'));
  assert.throws(() => selectedRepository(allowed, '0'));
  assert.throws(() => selectedRepository(allowed, 'oops'));
});
