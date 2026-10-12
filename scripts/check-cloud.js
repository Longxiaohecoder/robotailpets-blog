import { spawnSync } from 'node:child_process';

const repository = 'Longxiaohecoder/robotailpets-blog';
const credential = spawnSync('git', ['credential', 'fill'], {
  input: 'protocol=https\nhost=github.com\n\n', encoding: 'utf8',
  env: { ...process.env, GIT_TERMINAL_PROMPT: '0' }
});
const token = credential.stdout?.split('\n').find(line => line.startsWith('password='))?.slice(9);
if (!token) { console.error('GitHub credentials unavailable'); process.exit(1); }

async function github(path, method = 'GET', body) {
  const response = await fetch(`https://api.github.com/repos/${repository}/${path}`, {
    method, signal: AbortSignal.timeout(30000),
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined
  });
  if (!response.ok) throw new Error(`GitHub ${method} ${path}: HTTP ${response.status}`);
  return response.status === 204 ? null : response.json();
}

try {
  if (process.argv[2] === 'dispatch') {
    await github('actions/workflows/auto-publish.yml/dispatches', 'POST', { ref: 'main' });
    console.log('Workflow dispatched on main');
  } else if (process.argv[2] === 'jobs') {
    const id = process.argv[3];
    if (!/^\d+$/.test(id || '')) throw new Error('Numeric run id required');
    const result = await github(`actions/runs/${id}/jobs`);
    console.log(JSON.stringify(result.jobs.map(job => ({ conclusion: job.conclusion, steps: job.steps.map(step => ({ name: step.name, conclusion: step.conclusion })) })), null, 2));
  } else {
    const runs = await github('actions/runs?per_page=3');
    const deployments = await github('deployments?per_page=3');
    const head = await github('commits/main');
    const statuses = await github(`commits/${head.sha}/status`);
    const workflow = await github('actions/workflows/auto-publish.yml');
    const historyFile = await github('contents/content/publication-history.json?ref=main').catch(error => {
      if (error.message.endsWith('HTTP 404')) return null;
      throw error;
    });
    const publicationHistory = historyFile ? JSON.parse(Buffer.from(historyFile.content, 'base64').toString('utf8')) : null;
    console.log(JSON.stringify({
      head: head.sha,
      workflowState: workflow.state,
      publicationHistory,
      runs: runs.workflow_runs.map(run => ({ id: run.id, event: run.event, sha: run.head_sha, status: run.status, conclusion: run.conclusion, url: run.html_url })),
      commitStatuses: statuses.statuses.map(status => ({ context: status.context, state: status.state, url: status.target_url })),
      deployments: await Promise.all(deployments.map(async deployment => ({
        id: deployment.id, sha: deployment.sha, environment: deployment.environment,
        statuses: (await github(`deployments/${deployment.id}/statuses`)).map(status => ({ state: status.state, url: status.environment_url }))
      })))
    }, null, 2));
  }
} catch (error) { console.error(error.message); process.exitCode = 1; }
