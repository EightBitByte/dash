import { Octokit } from "octokit";

export interface GithubItem {
  id: number;
  title: string;
  html_url: string;
  state: string;
  number: number;
  repository_url: string;
  pull_request?: object;
  user: {
    login: string;
  };
}

export interface FormattedGithubItem {
  id: number;
  title: string;
  url: string;
  state: string;
  repo: string;
  type: "issue" | "pr";
  number: number;
}

export async function getGithubItems(): Promise<{
  prs: FormattedGithubItem[];
  issues: FormattedGithubItem[];
}> {
  try {
    const token = process.env.GITHUB_TOKEN;
    if (!token) {
      console.error("Missing GITHUB_TOKEN");
      return { prs: [], issues: [] };
    }

    const octokit = new Octokit({
      auth: token,
      request: {
        fetch: (url: any, options: any) => {
          return fetch(url, {
            ...options,
            next: { revalidate: 900 },
          });
        },
      },
    });
    const username = process.env.GITHUB_USERNAME || "@me";

    // Search query:
    // is:open (only open items)
    // archived:false (no archived repos)
    // We must run separate queries for issues and PRs due to API limitations
    const baseQuery = `is:open archived:false involves:${username}`;

    const [issuesRes, prsRes] = await Promise.all([
      octokit.rest.search.issuesAndPullRequests({
        q: `${baseQuery} is:issue`,
        sort: "updated",
        order: "desc",
        per_page: 5,
      }),
      octokit.rest.search.issuesAndPullRequests({
        q: `${baseQuery} is:pr`,
        sort: "updated",
        order: "desc",
        per_page: 5,
      }),
    ]);

    const issues = (issuesRes.data.items as GithubItem[]) || [];
    const prs = (prsRes.data.items as GithubItem[]) || [];

    const formatItem = (item: GithubItem): FormattedGithubItem => {
      const repoName = item.repository_url.split("/").slice(-2).join("/");
      return {
        id: item.id,
        title: item.title,
        url: item.html_url,
        state: item.state,
        repo: repoName,
        type: item.pull_request ? "pr" : "issue",
        number: item.number,
      };
    };

    return {
      prs: prs.map(formatItem),
      issues: issues.map(formatItem),
    };
  } catch (error) {
    console.error("Error fetching GitHub items:", error);
    return { prs: [], issues: [] };
  }
}
