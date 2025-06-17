#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const packageJson = require('../package.json');
const versionFile = path.join(__dirname, '../src/version.ts');

const content = `// This file is auto-generated during build
export const VERSION = '${packageJson.version}';`;

fs.writeFileSync(versionFile, content);
console.log(`Updated version.ts to ${packageJson.version}`);