/*
Example Usage:

const commitFiles = [
      {
        path: "/my-new-website/index.html",
        content: "Hello World!",
        encoding: "utf-8",
      },
      {
        path: "/my-new-website/images/logo.png",
        content: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQ",
        encoding: "base64",
      },
    ];


const commitTitle = "This is an example commit.";
const branch = "staging";

const Github = new Github(user, key, 'zine-store','zine-team');

await Github.createCommit(
  branch,
  commitTitle,
  commitFiles
);
*/

function Github(user, key, repo, org) {
    const user = user;
    const githubAccessToken = key;

    let endpoints = {
        commits: () => `/repos/${repo}/git/commits`,
        branchHeads: (branchName) => `/repos/${repo}/git/refs/heads/${branchName}`,
        trees: (branchName) => `/repos/${repo}/git/trees/${branchName}`
    };

    let resourceUrl = (endpoint) => {
        //'+user+':'+key+'@
        return 'https://api.github.com/'+endpoint;
    }

    const post = async (url, body) => {
        const response = await fetch(url,
            {
                method: 'POST',
                headers: {
                    'Accept': 'application/vnd.github+json',
                    'Authorization': `Bearer ${githubAccessToken}`,
                    'X-GitHub-Api-Version': '2022-11-28'
                },
                body: JSON.stringify(body)
            });
        return await response.json();
    }

    const get = async (url, body) => {
        const response = await fetch(url,
            {
                method: 'GET',
                headers: {
                    'Accept': 'application/vnd.github+json',
                    'Authorization': `Bearer ${githubAccessToken}`,
                    'X-GitHub-Api-Version': '2022-11-28'
                },
                body: JSON.stringify(body)
            })
        return await response.json();
    }

    const patch = async (url, body) => {
        const response = await fetch(url,
            {
                method: 'PATCH',
                headers: {
                    'Accept': 'application/vnd.github+json',
                    'Authorization': `Bearer ${githubAccessToken}`,
                    'X-GitHub-Api-Version': '2022-11-28'
                },
                body: JSON.stringify(body)
            });

        return await response.json();
    }

    this.createFileBlob = async (branchName, content, encoding = "utf-8") => {
        const url = this.resourceUrl(endpoints.branchHeads(branchName));

        const response = post(url, {
            "content": content,
            "encoding": encoding
        });

        return response.sha
    }

    this.getShaForBaseTree = async (branchName) => {
        const url = this.resourceUrl(endpoints.trees(branchName));

        const response = get(url)

        return response.sha
    }

    this.getParentSha = async (branchName) => {
        const url = this.resourceUrl(endpoints.branchHeads(branchName));

        const response = get(url)

        return response.object.sha
    }

    this.createRepoTree = async (githubAccessToken, repoFullName, branchName, commitFiles) => {
        const shaForBaseTree = await this.getShaForBaseTree(branchName)

        const tree = []

        for (var i = 0; i < commitFiles.length; i++) {
            const fileSha = await this.createFileBlob(commitFiles[i].content, commitFiles[i].encoding)
            tree.push({
                "path": commitFiles[i].path.substring(1),
                "mode": "100644",
                "type": "blob",
                "sha": fileSha
            })
        }

        const url = this.resourceUrl(endpoints.trees(branchName));

        const response = post(url, {
            "base_tree": shaForBaseTree,
            "tree": tree
        }

        )

        return response.sha
    }

    this.updateBranchRef = async (branchName, commitSha) => {
        const url = this.resourceUrl(endpoints.branchHeads(branchName));

        const response = patch(url, {
            "sha": commitSha,
            "force": false
        });

        return response;
    }

    this.createCommit = async (branchName, commitMessage, commitFiles) => {
        const tree = await this.createRepoTree(branchName, commitFiles);
        const parentSha = await this.getParentSha(branchName);

        const url = this.resourceUrl(endpoints.commits());

        const response = post(url, {
            "message": commitMessage,
            "tree": tree,
            "parents": [parentSha]
        });

        const commitSha = response.sha

        await updateBranchRef(branchName, commitSha)
    }
}

