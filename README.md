# Changelog CLI

![npm version](https://img.shields.io/npm/v/chlog-cli)
![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![Lint](https://github.com/husky-dev/chlog-cli/workflows/Lint/badge.svg)
![Test](https://github.com/husky-dev/chlog-cli/workflows/Test/badge.svg)

CLI tool for managing `CHANGELOG.md` file based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) format.

## Installation

```bash
npm isntall -g chlog-cli
```

Or use with `npx`:

```bash
npx chlog-cli help
```

## Usage

Init a new changelog:

```bash
chlog init
chlog init changelog.md
```

Get full changelog:

```bash
chlog get
```

Get all changes at `1.50.x` versions:

```bash
chlog get 1.50
```

Add record:

```bash
chlog add -a 1.50.1 "Some new feature"
# Options:
#   -f, --fixed       add to "Fixed"
#   -a, --added       add to "Added"
#   -c, --changed     add to "Changed"
#   -d, --deprecated  add to "Deprecated"
#   -r, --removed     add to "Removed"
#   -s, --security    add to "Security"
```

Add reccord with a link:

```
chlog add -a Unreleased "Some new feature" "https://jira-ticket.com/APP-300"
```

Change version name:

```bash
chlog change 1.50.1 --name 1.50.2
```

Change version date:

```bash
chlog change 1.50.1 --date "2021-01-01"
chlog change 1.50.1 --date current
chlog change 1.50.1 --date cur
```

Remove version:

```bash
chlog remove 1.50.1
```

Get help:

```bash
chlog -h
chlog help
chlog add -h
chlog add --help
```
