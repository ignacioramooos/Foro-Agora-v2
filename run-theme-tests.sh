#!/bin/zsh
set -euo pipefail
ROOT="${0:A:h}"
cd "$ROOT"
npm test -- src/test/theme-persistence.test.ts
