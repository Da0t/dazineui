#!/usr/bin/env node
'use strict';

/**
 * dazineui postinstall
 *
 * Runs automatically when someone does `npm install dazineui`.
 * Drops `.cursor/rules/dazineui-motion.mdc` into their project so that
 * Cursor's AI immediately knows about all dazineui primitives, routing rules,
 * and anti-patterns — without any manual configuration.
 *
 * Uses INIT_CWD (set by npm) to target the project root, not this package's
 * own directory.
 */

const fs   = require('fs');
const path = require('path');

// npm sets INIT_CWD to the directory where the user ran `npm install`
const projectRoot = process.env.INIT_CWD || process.cwd();
const packageRoot = path.resolve(__dirname, '..');

// Don't run inside our own repo during development
if (projectRoot === packageRoot) {
  process.exit(0);
}

const rulesDir  = path.join(projectRoot, '.cursor', 'rules');
const destFile  = path.join(rulesDir, 'dazineui-motion.mdc');
const srcFile   = path.join(packageRoot, '.cursor', 'rules', 'motion-rules.mdc');

try {
  if (!fs.existsSync(srcFile)) {
    // Source rules file missing from the package — skip silently
    process.exit(0);
  }

  // Create .cursor/rules/ if it doesn't exist yet
  fs.mkdirSync(rulesDir, { recursive: true });

  // Write the rules file
  const content = fs.readFileSync(srcFile, 'utf8');
  fs.writeFileSync(destFile, content, 'utf8');

  console.log('');
  console.log('  ✓ dazineui: motion rules installed');
  console.log('    → .cursor/rules/dazineui-motion.mdc');
  console.log('    Cursor + Claude Code will now produce senior-level Three.js designs.');
  console.log('');
} catch {
  // Never break the install — just skip
}
