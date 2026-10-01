#!/usr/bin/env bash
#
# Points an assembled site at one stage.
#
# The committed lpdf-pages.js carries two deploy-time placeholders, __PORTAL_URL__ and __PAGES_URL__
# (check-sentinels.sh guards that). The portal is a Codesense-wide product, not an lpdf one, so it
# lives on codesense.dev for every product; only the marketing site is on lpdf.io.
#
# Prod carries no 'pre' anywhere: my.codesense.dev, lpdf.io. Pre gets its own CNAME; prod keeps the
# committed one.
#
# Usage: set-stage.sh <site-dir> pre|prod
set -euo pipefail

site=${1:?usage: set-stage.sh <site-dir> pre|prod}
stage=${2:?usage: set-stage.sh <site-dir> pre|prod}
bundle="$site/assets/js/lpdf-pages.js"

case "$stage" in
    pre)
        portal=https://my-pre.codesense.dev
        pages=https://pre.lpdf.io
        ;;
    prod)
        portal=https://my.codesense.dev
        pages=https://lpdf.io
        ;;
    *)
        echo "::error::unknown stage '$stage' — expected pre or prod"
        exit 1
        ;;
esac

sed -i "s|__PORTAL_URL__|$portal|g" "$bundle"
sed -i "s|__PAGES_URL__|$pages|g" "$bundle"

if [ "$stage" = pre ]; then
    echo "pre.lpdf.io" > "$site/CNAME"
fi

# Pre must stay out of search results. Prod allows everything, as it did with no robots file, and
# points crawlers at the docs sitemap, the only one there is.
if [ "$stage" = pre ]; then
    printf 'User-agent: *\nDisallow: /\n' > "$site/robots.txt"
else
    printf 'User-agent: *\nAllow: /\n\nSitemap: %s/docs/sitemap-index.xml\n' "$pages" > "$site/robots.txt"
fi

# Check what was written, so a stage never ships with a placeholder left in or another stage's host.
if grep -qE '__PORTAL_URL__|__PAGES_URL__' "$bundle"; then
    echo "::error file=$bundle::a placeholder is still in the bundle after setting the $stage URLs"
    exit 1
fi
if [ "$stage" = prod ] && grep -qE 'my-pre\.codesense\.dev|pre\.lpdf\.io' "$bundle" "$site/CNAME"; then
    echo "::error::the prod site refers to a pre host"
    exit 1
fi
expected=$([ "$stage" = pre ] && echo pre.lpdf.io || echo lpdf.io)
if [ "$(tr -d '[:space:]' < "$site/CNAME")" != "$expected" ]; then
    echo "::error file=$site/CNAME::CNAME is not $expected"
    exit 1
fi

echo "Set $site to $stage: portal $portal, pages $pages"
