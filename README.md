# Changelog CLI

CLI tool for managing `CHANGELOG.md` file based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) format.

- Version: `Unreleased`, `current`, `0.0.1`, `1.0` (`unreleased` by default)
- Date: `2021-02-12`, `current`


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

chlog change-version "Unreleased" "1.2.1"

chlog change-date -v "1.2.1" "2021-02-12"

chlog remove -v 1.3.5
```

`.chlogrc`:

```json
{
  "version": {
    "current": "cat package.json | grep version | head -1 | awk -F: '{ print $2 }' | sed 's/[\",\t ]//g'"
  }
}
```
