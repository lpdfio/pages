#!/usr/bin/env bash
#
# The committed www/assets/js bundles are built from codesense/portal/ui and deployed
# verbatim, with the deploy replacing __PORTAL_URL__ per stage. A bundle copied out of a
# local `npm run build` instead has the developer's host baked in, and the sed then
# matches nothing — the deployed site silently points sign-in at a machine nobody but the
# developer can reach. Fail the deploy instead of shipping that.
#
# Refresh the bundles with:  npm run build:pages   (in codesense/portal/ui)
set -euo pipefail

pages=www/assets/js/lpdf-pages.js
docs=www/assets/js/lpdf-docs.js
failed=0

if ! grep -q '__PORTAL_URL__' "$pages"; then
    echo "::error file=$pages::no __PORTAL_URL__ sentinel — rebuild with 'npm run build:pages' in codesense/portal/ui"
    failed=1
fi

# Any of these in a deployed bundle means a developer build was committed.
for file in "$pages" "$docs"; do
    for host in 'my-local.codesense.dev' 'lpdf.local' 'localhost'; do
        if grep -qF "$host" "$file"; then
            echo "::error file=$file::development host '$host' is baked into the bundle — rebuild with 'npm run build:pages' in codesense/portal/ui"
            failed=1
        fi
    done
done

exit $failed
