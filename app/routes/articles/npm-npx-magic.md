---
meta:
  title: NPM / npx magic
  description: More infro
headers:
  Cache-Control: no-cache
---

# Dump

iT is nteat

```

npx aka npm exec

npm exec --package=<load-remote-package(s)-even-from-github-ssh> -- binary-to-run

remote repo can even have its own dependencies, and the npm exec invocation can compose multiple projects' binaries for maximum spellcasting

toss a package.json and an `#!/usr/bin/env node` script in there and you're cooking

package.json#files to add extra files to your "binary"

then, invocation happens... well, anywhere! so you gotta load your "assets" using something oriented to the location of the installed binary, like \_\_dirname (not `.`` or process.cwd())

my approach had a limitation on a generated JSON artifact; if you use the repository as your registry, you'll get silly stuff stuck muddying up your commit history / diffs (DUH!!!)

```

```

```
