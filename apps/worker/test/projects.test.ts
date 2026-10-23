import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { createProject, getProject, listProjects, validateProjectInput } from '../../web/lib/projects.js';

test('validates a public HTTPS origin and project metadata', () => {
  assert.deepEqual(validateProjectInput({ name: '  Meu site  ', deployUrl: 'https://example.com/', environment: 'production' }), {
    name: 'Meu site', deployUrl: 'https://example.com', environment: 'production',
  });
  for (const deployUrl of ['http://example.com', 'https://127.0.0.1', 'https://localhost', 'https://site.local',
    'https://user:pass@example.com', 'https://example.com/contact', 'https://example.com/?token=secret']) {
    assert.throws(() => validateProjectInput({ name: 'X', deployUrl, environment: 'staging' }));
  }
  assert.throws(() => validateProjectInput({ name: '', deployUrl: 'https://example.com', environment: 'production' }));
});

test('stores URL-only and GitHub-linked projects across reads', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'farol-projects-'));
  try {
    const manual = await createProject({ name: 'Site', deployUrl: 'https://example.com', environment: 'production' }, null, directory);
    const linked = await createProject({ name: 'Repo', deployUrl: 'https://example.org', environment: 'staging' }, {
      id: 123, installationId: 456, fullName: 'owner/repo', htmlUrl: 'https://github.com/owner/repo',
    }, directory);
    assert.deepEqual(await getProject(manual.id, directory), manual);
    assert.deepEqual((await getProject(linked.id, directory))?.repository, linked.repository);
    assert.equal((await listProjects(directory)).length, 2);
    assert.equal(await getProject('../etc/passwd', directory), null);
  } finally { await rm(directory, { recursive: true, force: true }); }
});
