import subprocess

# Fetch all remotes
subprocess.run(["git", "fetch", "--all"])

# Get all remote tracking branches for origin
res = subprocess.run(["git", "branch", "-r"], capture_output=True, text=True, encoding="utf-8", errors="ignore")
branches = []
for line in res.stdout.splitlines():
    line = line.strip()
    if line.startswith("origin/") and "->" not in line:
        branches.append(line)

print(f"Checking {len(branches)} remote branches against upstream/main...")

ahead_branches = []
for b in branches:
    # Get number of commits b is ahead of upstream/main
    res_log = subprocess.run(["git", "log", "upstream/main.." + b, "--oneline"], capture_output=True, text=True, encoding="utf-8", errors="ignore")
    commits = [c for c in res_log.stdout.splitlines() if c.strip()]
    if len(commits) > 0:
        print(f"{b} is ahead of upstream/main by {len(commits)} commits:")
        print(f"  First commit: {commits[-1]}")
        ahead_branches.append((b, len(commits), commits[-1]))

print(f"\nTotal ahead remote branches: {len(ahead_branches)}")
