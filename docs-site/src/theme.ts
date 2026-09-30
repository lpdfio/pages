// The theme choice is stored the way lpdf.io's own toggle stores it: a cookie and localStorage
// under the same key, with the cookie read first. Matching both means a choice made on either
// the site or the docs carries to the other when they share an origin.

export const THEME_STORAGE_KEY = 'cs-theme';
