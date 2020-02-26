---
name: Bug report
about: Create a bug report to help us improve
title: "[BUG]"
labels: ''
assignees: freakeinstein

---

**Describe the bug**
A clear and concise description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior

**Expected behavior**
A clear and concise description of what you expected to happen.

**Server Logs**
If possible, collect logs from AquilaDB container by following below steps in your terminal:

1. run `docker ps` and note down container id for AquilaDB
2. run `docker exec -i -t <container id> /bin/bash`
3. run `pm2 logs` and copy contents from there


**please complete the following information:**
 - Host OS: [e.g. Ubuntu 18.04]
 - Docker image label (tag) [e.g. latest, bleeding, release-v0.2.2]
 - AquilaDB Version [e.g. v0.2.2]

**Additional context**
Add any other context about the problem here.
