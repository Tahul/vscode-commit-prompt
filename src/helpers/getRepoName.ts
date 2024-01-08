import * as cp from 'node:child_process'
import { getCwd } from './getCwd'

function getUserRepoFromURL(url: string): `${string}/${string}` | undefined {
  // Remove '.git' if it exists
  const cleanedURL = url.replace(/\.git$/, '');

    // Check if the URL starts with 'git@'
  if (cleanedURL.startsWith('git@')) {
    const parts = cleanedURL.split(':');
    if (parts.length === 2) {
      const userRepoPart = parts[1].replace('.git', '');
      const [user, repo] = userRepoPart.split('/');
      return `${user}/${repo}`;
    }
  } else {
    // Split the URL by '/' and get the last two segments
    const segments = cleanedURL.split('/');
    const user = segments[segments.length - 2];
    const repo = segments[segments.length - 1];
    return `${user}/${repo}`;
  }
}

export function getRepoName() {
  const cwd = getCwd()

  if (!cwd) { return }

  return getUserRepoFromURL(cp.execSync('git remote get-url origin', { cwd }).toString().split('\n')[0])
}
