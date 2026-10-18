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

# Each kind of page loads its own bundle (lpdf-pages.js, lpdf-pages-pricing.js, ...). They all start from the
# same base, which carries the footer's portal links, so every one has the sentinel.
bundles=(www/assets/js/lpdf-pages*.js)
docs=www/assets/js/lpdf-docs.js
failed=0

for bundle in "${bundles[@]}"; do
    if ! grep -q '__PORTAL_URL__' "$bundle"; then
        echo "::error file=$bundle::no __PORTAL_URL__ sentinel — rebuild with 'npm run build:pages' in codesense/portal/ui"
        failed=1
    fi
done

# A page that names a bundle which is not there loads nothing, and the deploy still succeeds.
for name in $(grep -rhoE 'assets/js/lpdf-pages[a-z-]*\.js' www --include='*.html' --exclude-dir=docs | sort -u); do
    if [ ! -f "www/$name" ]; then
        echo "::error::a page loads $name, which is not in www/assets/js — rebuild with 'npm run build:pages' in codesense/portal/ui"
        failed=1
    fi
done

# Any of these in a deployed bundle means a developer build was committed.
for file in "${bundles[@]}" "$docs"; do
    for host in 'my-local.codesense.dev' 'lpdf.local' 'localhost'; do
        if grep -qF "$host" "$file"; then
            echo "::error file=$file::development host '$host' is baked into the bundle — rebuild with 'npm run build:pages' in codesense/portal/ui"
            failed=1
        fi
    done
done

# A page can move to a new tag before the bundle that defines it is rebuilt. The deploy then
# succeeds and the element renders nothing, so every custom element a page uses must be defined
# in a committed bundle. rl-* are Relayout's elements, which are styled by CSS and defined nowhere.
for tag in $(grep -rhoE '<[a-z]+-[a-z-]+' www --include='*.html' --exclude-dir=docs | tr -d '<' | grep -v '^rl-' | sort -u); do
    if ! grep -rqE "[\"'\`]$tag[\"'\`]" www/assets/js; then
        echo "::error::<$tag> is used in a page but no bundle in www/assets/js defines it — rebuild with 'npm run build:pages' in codesense/portal/ui"
        failed=1
    fi
done

exit $failed
