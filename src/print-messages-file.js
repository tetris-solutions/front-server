#!/usr/bin/env node

const messages = require(process.argv[2])

process.stdout.write(JSON.stringify(messages))
