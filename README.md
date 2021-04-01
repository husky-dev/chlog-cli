# Changelog CLI

![npm version](https://img.shields.io/npm/v/chlog-cli)
![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![Lint](https://github.com/husky-dev/chlog-cli/workflows/Lint/badge.svg)
![Test](https://github.com/husky-dev/chlog-cli/workflows/Test/badge.svg)

CLI tool for managing `CHANGELOG.md` file based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) format.

```bash
chlog -h
chlog --help
chlog -v
chlog --version
chlog --debug

chlog get -v "1.2"

chlog add -v 1.3 "Some cool feature"
#  -f, --fixed
#  -a, --added
#  -c, --changed
#  -d, --deprecated
#  -r, --removed
#  -s, --security
#  -l, --link

chlog change -v "Unreleased" -n "1.2.1"

chlog change -v "1.2.1" -d "2021-02-12"

chlog remove -v 1.3.5
```
