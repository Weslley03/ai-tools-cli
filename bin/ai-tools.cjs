#!/usr/bin/env node

const [major] = process.versions.node.split('.').map(Number)
const MIN = 20

if (major < MIN) {
  console.error(`
  ✖ ai-tools required. node.js v${MIN}+.
    are you usingv${process.versions.node}.
    please update your version. em: https://nodejs.org
  `)

  process.exit(1)
}

import('../dist/cli.js').catch((err) => {
  console.error(err)
  process.exit(1)
})