#!/usr/bin/env bash
set -euo pipefail
project_dir="$(cd "$(dirname "$0")/.." && pwd -P)"
runtime_node="$(command -v node || true)"
if [ -z "$runtime_node" ]; then
  runtime_node="${HOME}/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node"
fi
if [ ! -x "$runtime_node" ]; then
  echo 'Node.js is missing. Install Node.js 22 LTS, then retry.' >&2
  exit 1
fi
export PATH="$(dirname "$runtime_node"):$PATH"
export ASTRO_TELEMETRY_DISABLED=1
cd "$project_dir"
action="${1:-dev}"
if [ "$#" -gt 0 ]; then shift; fi
case "$action" in
  install)
    if command -v npm >/dev/null 2>&1; then
      npm ci
      (cd blog && npm ci)
    else
      runtime_tmp="$(mktemp -d -t robotail-npm)"
      trap 'rm -r "$runtime_tmp"' EXIT
      curl -fsSL --max-time 60 https://registry.npmjs.org/npm/-/npm-10.9.4.tgz -o "$runtime_tmp/npm.tgz"
      tar -xzf "$runtime_tmp/npm.tgz" -C "$runtime_tmp"
      "$runtime_node" "$runtime_tmp/package/bin/npm-cli.js" ci
      (cd blog && "$runtime_node" "$runtime_tmp/package/bin/npm-cli.js" ci)
    fi
    ;;
  dev|build|preview)
    cd blog
    exec "$runtime_node" node_modules/astro/astro.js "$action" "$@"
    ;;
  generate|generate:enhanced|generate:brand)
    exec "$runtime_node" scripts/generate-content.js "$@"
    ;;
  test) exec "$runtime_node" --test tests/*.test.js ;;
  *) echo "Usage: bash scripts/blog.sh {install|dev|build|preview|generate|test}" >&2; exit 1 ;;
esac
