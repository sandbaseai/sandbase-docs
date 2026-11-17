import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const SOURCE = 'sandbaseai/sandbase-docs';
const CONTROLLER = 'sandbase-lab/lab-production';
const SHA = /^[a-f0-9]{40}$/;
const output = (args) => execFileSync('gh', args, { encoding: 'utf8' }).trim();
const json = (args) => JSON.parse(output(args));
const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export function assertReadyPR(pr, comparison) {
  if (pr.state !== 'OPEN' || pr.isDraft || pr.baseRefName !== 'main' || pr.mergeable !== 'MERGEABLE' || !SHA.test(pr.headRefOid)) {
    throw new Error('Expected an open, reviewed, mergeable PR targeting main');
  }
  if (comparison.behind_by !== 0) throw new Error('Rebase onto current main and rerun validation before merging');
  const checks = pr.statusCheckRollup ?? [];
  if (!checks.some((check) => check.name === 'validate' && check.status === 'COMPLETED' && check.conclusion === 'SUCCESS')) {
    throw new Error('The exact PR revision must pass source validation');
  }
  if (checks.some((check) => check.status !== 'COMPLETED' || !['SUCCESS', 'NEUTRAL', 'SKIPPED'].includes(check.conclusion))) {
    throw new Error('Wait for all checks to succeed');
  }
}

function requirePublisher() {
  if (!json(['api', `repos/${CONTROLLER}`]).permissions?.push) {
    throw new Error('Your gh identity needs publisher access to the private production repository');
  }
}

async function deploy(sha) {
  if (!SHA.test(sha)) throw new Error('Provide an exact 40-character source commit');
  requirePublisher();
  const comparison = json(['api', `repos/${SOURCE}/compare/${sha}...main`]);
  if (!['identical', 'ahead'].includes(comparison.status)) throw new Error('The source commit must already be on main');
  const dispatched = new Date(Date.now() - 5000).toISOString();
  output(['workflow', 'run', 'docs.yml', '--repo', CONTROLLER, '--ref', 'main', '-f', `source_sha=${sha}`]);
  for (let attempt = 0; attempt < 30; attempt++) {
    const runs = json(['run', 'list', '--repo', CONTROLLER, '--workflow', 'docs.yml', '--limit', '30',
      '--json', 'databaseId,displayTitle,createdAt,url']);
    const run = runs.find((item) => item.displayTitle === `Docs production ${sha}` && item.createdAt >= dispatched);
    if (run) {
      console.log(run.url);
      execFileSync('gh', ['run', 'watch', String(run.databaseId), '--repo', CONTROLLER, '--exit-status'], { stdio: 'inherit' });
      return;
    }
    await pause(2000);
  }
  throw new Error(`Dispatch accepted but the run was not visible yet. Inspect ${CONTROLLER}/docs.yml for ${sha}; do not assume publication succeeded.`);
}

async function main() {
  const [command, value] = process.argv.slice(2);
  if (command === 'deploy') {
    const sha = value || execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
    return deploy(sha);
  }
  if (command !== 'merge' || !/^\d+$/.test(value ?? '')) throw new Error('Use: release-production.mjs deploy [SHA] | merge PR_NUMBER');
  requirePublisher();
  const pr = json(['pr', 'view', value, '--repo', SOURCE, '--json', 'state,isDraft,baseRefName,headRefOid,mergeable,statusCheckRollup']);
  const comparison = json(['api', `repos/${SOURCE}/compare/main...${pr.headRefOid}`]);
  assertReadyPR(pr, comparison);
  output(['pr', 'merge', value, '--repo', SOURCE, '--squash', '--match-head-commit', pr.headRefOid]);
  const merged = json(['pr', 'view', value, '--repo', SOURCE, '--json', 'mergeCommit']);
  return deploy(merged.mergeCommit.oid);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main().catch((error) => { console.error(error.message); process.exitCode = 1; });
}
