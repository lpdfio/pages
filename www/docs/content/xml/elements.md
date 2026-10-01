# All Elements

Complete attribute reference for every lpdf XML element. Use Ctrl+F to find the element you need.

Lengths, tokens and colors are described in [XML Schema](?p=xml/schema).

---

## Document structure

### `lpdf`

Root element.

| Attribute | Type    | Required | Description |
|-----------|---------|----------|-------------|
| `version` | integer | yes      | Schema version — always `1` |

### `assets`

Container for font and image declarations. Comes before `tokens` and `document`.

### `font`

| Attribute | Type   | Description |
|-----------|--------|-------------|
| `name`    | string | **Required.** Alias used in the document. Lowercase letters, digits and `-`, starting with a letter |
| `core`    | string | Built-in PDF font: `Helvetica`, `Helvetica-Bold`, `Helvetica-Oblique`, `Helvetica-BoldOblique`, `Times-Roman`, `Times-Bold`, `Times-Italic`, `Times-BoldItalic`, `Courier`, `Courier-Bold`, `Courier-Oblique`, `Courier-BoldOblique`, `Symbol`, `ZapfDingbats` |
| `src`     | path   | Path of a .ttf or .otf file, read by the SDK from the machine that renders |
| `ref`     | string | The key the font's bytes are registered under with `loadFont`. Defaults to `name` |

A built-in font can also be used by its name without declaring it: `font="Courier"`.

### `image`

| Attribute | Type   | Description |
|-----------|--------|-------------|
| `name`    | string | **Required.** Alias used in `img` elements. Same characters as a font `name` |
| `src`     | path   | Path of a PNG or JPEG file, read by the SDK from the machine that renders. URLs and data URIs are not fetched |
| `ref`     | string | The key the image's bytes are registered under with `loadImage`. Defaults to `name` |

An image needs either a readable `src` or bytes loaded with `loadImage`.

### `tokens`

Container for custom scales and colors, placed before `document`. See [Tokens](?p=xml/schema#tokens).

| Child | Description |
|-------|-------------|
| `space`, `text-size`, `border`, `radius`, `width`, `grid` | Replace one scale. Each takes all six of `xs` `s` `m` `l` `xl` `xxl`, as `pt` values |
| `colors` | Holds `color` elements |

### `color`

| Attribute | Type   | Description |
|-----------|--------|-------------|
| `name`    | string | **Required.** Name to use in any color attribute. A color named `text` becomes the default text color |
| `value`   | color  | **Required.** `#rgb` or `#rrggbb` |

### `meta`

Document properties written to the PDF. Child of `document`, before the sections.

| Attribute  | Type   | Description |
|------------|--------|-------------|
| `title`    | string | Document title |
| `author`   | string | Author |
| `subject`  | string | Subject |
| `keywords` | string | Keywords |
| `creator`  | string | Creating application |

### `document`

| Attribute     | Type    | Default    | Description |
|---------------|---------|------------|-------------|
| `size`        | string  | `a4`       | `letter` `legal` `a3` `a4` `a5`, or a custom `"200pt 300pt"` |
| `orientation` | string  | `portrait` | `portrait` `landscape` |
| `margin`      | spacing | `0`        | Page margin: `48pt`, a token, or one to four values like `"48pt 24pt"` |
| `font`        | string  | `Helvetica` | Default font: a built-in name or an asset name |
| `background`  | color   | —          | Page background color |
| `debug`       | boolean | false      | Render layout boxes |

A document holds an optional `meta` and one or more `section` elements. Other attributes are not read: `width`, `height`, `margin-top`, `color` and `title` are ignored, and `font-size` is an error. Set a page size with `size="200pt 300pt"`, and the title on `meta`.

### `section`

| Attribute     | Type    | Default  | Description |
|---------------|---------|----------|-------------|
| `size`        | string  | inherit  | Override page size for this section |
| `orientation` | string  | inherit  | Override orientation |
| `margin`      | spacing | inherit  | Override margin |
| `background`  | color   | inherit  | Section background |
| `title`       | string  | —        | Section title. Accepted, but not used yet: the PDF has no bookmarks |
| `debug`       | boolean | false    | Render layout boxes |

---

## Layout elements

Layout elements live inside `layout`. Every one except `region` and `span` takes `data-source`, `data-if` and `data-if-not`, and `text` takes `data-value`. See [Data Binding](?p=data/binding).

### Shared box attributes

`stack`, `flank`, `split`, `cluster`, `grid`, `frame` and `td` take these, beside their own:

| Attribute   | Type    | Default | Description |
|-------------|---------|---------|-------------|
| `gap`       | token/pt| `0`     | Space between children. Not on `frame`, which has one child |
| `padding`   | spacing | `0`     | Space inside the edge: `8pt`, a token, or one to four values like `"8pt 16pt"` |
| `width`     | token/pt| —       | Fixed width. Not on `td`: the table's `cols` sets cell widths |
| `height`    | pt/`fill`/`full` | — | A length fixes the height; `fill` takes what is left after siblings; `full` takes all the height available. Any of them stops the box splitting across pages |
| `background`| color   | —       | Background fill |
| `border`    | BorderValue | —   | Border, written `"thickness color"` |
| `radius`    | token/pt| `0`     | Corner radius |
| `font`      | string  | inherit | Font for the text inside |
| `font-size` | token/pt| inherit | Font size for the text inside |
| `debug`     | boolean | false   | Draw the box outlines |

### `stack`

Vertical column of children.

| Attribute  | Type    | Default   | Description |
|------------|---------|-----------|-------------|
| `align`    | string  | `stretch` | Horizontal alignment: `start` `center` `end` `stretch` |
| `justify`  | string  | `start`   | Vertical distribution: `start` `center` `end` `between` |

### `flank`

Row where every child keeps its own width except one, which fills the rest: the last child by default, the first with `end="true"`.

| Attribute  | Type    | Default | Description |
|------------|---------|---------|-------------|
| `end`      | boolean | `false` | `false`: the last child fills. `true`: the first child fills, the others sit at the right |
| `align`    | string  | `start` | Vertical alignment: `start` `center` `end` |

### `split`

Two children side by side: by default each keeps its own width, the first at the left edge and the second at the right; with `equal="true"` they take half the width each. Further children are ignored. For more columns use `grid`; for explicit column widths use `table`.

| Attribute  | Type    | Default | Description |
|------------|---------|---------|-------------|
| `equal`    | boolean | `false` | `true`: the two children take half the width each |
| `align`    | string  | `start` | Vertical alignment: `start` `center` `end` |

### `cluster`

Wrapping row of inline items.

| Attribute  | Type    | Default | Description |
|------------|---------|---------|-------------|
| `align`    | string  | `start` | Alignment across the row: `start` `center` `end` `stretch` |
| `justify`  | string  | `start` | Distribution along the row: `start` `center` `end`. `between` is an error |

### `grid`

Equal columns, filled left to right.

| Attribute | Type    | Default | Description |
|-----------|---------|---------|-------------|
| `cols`    | integer | `1`     | Number of columns (1–12) |
| `col-width` | token/pt | —    | Minimum column width: fits as many columns as the width allows, at least one, stretched to fill the row (overrides `cols`). Tokens are grid sizes |

### `frame`

Single-child container with padding, border, and background. Always centres its child, so it takes no `gap`, `align` or `justify`, and a second child is an error.

### `text`

Paragraph or inline text.

| Attribute    | Type    | Default   | Description |
|--------------|---------|-----------|-------------|
| `font`       | string  | inherit   | Font name |
| `font-size`  | token/pt| inherit   | Font size |
| `color`      | color   | `#1a1a1a` | Text color. Not inherited |
| `align`      | string  | `left`    | `left` `center` `right` `justify` |
| `width`      | token/pt| —         | Constrain text block width |
| `debug`      | boolean | false     | Draw the box outline |
| `data-value` | string  | —         | Dot-path to a scalar value that replaces the text |

Children: `span` for inline style overrides. Line height is fixed at 1.2 times the font size.

### `span`

Inline text with overridden style.

| Attribute   | Type    | Description |
|-------------|---------|-------------|
| `font`      | string  | Font override |
| `color`     | color   | Color override |
| `href`      | URL     | Makes the span a hyperlink |
| `underline` | boolean | Underline text |
| `strike`    | boolean | Strikethrough text |

### `divider`

Horizontal (or vertical) rule.

| Attribute   | Type    | Default      | Description |
|-------------|---------|--------------|-------------|
| `direction` | string  | `horizontal` | `horizontal` or `vertical` |
| `color`     | color   | `#000000`    | Line color |
| `thickness` | token/pt| `1pt`        | Line thickness. Tokens are border sizes: `xs` 0.5pt up to `xxl` 4pt |
| `debug`     | boolean | false        | Draw the box outline |

### `img` (layout)

Inline image.

| Attribute    | Type    | Default | Description |
|--------------|---------|---------|-------------|
| `name`       | string  | —       | **Required.** Asset name |
| `width`      | token/pt| —       | Display width |
| `height`     | pt      | —       | Display height |
| `padding`    | spacing | `0`     | Space around the image |
| `background` | color   | —       | Background behind the image |
| `border`     | BorderValue | —   | Border |
| `radius`     | token/pt| `0`     | Corner radius |
| `debug`      | boolean | false   | Draw the box outline |

### `table`

| Attribute   | Type    | Default | Description |
|-------------|---------|---------|-------------|
| `cols`      | string  | —       | **Required.** Column widths, separated by spaces, in `fr`, `pt` or `%`: `"1fr 2fr"`, `"100pt 1fr"` |
| `border`    | BorderValue | —   | Grid lines between and around the cells |
| `stripe`    | color   | —       | Alternating row background |
| `gap`       | token/pt| `0`     | Space between columns and between rows |
| `padding`   | spacing | `0`     | Space between the table's edge and its content. Not cell padding: set it on each `td` |
| `background`| color   | —       | Background behind the whole table |
| `width`     | token/pt| —       | Fixed width |
| `height`    | pt/`fill`/`full` | — | A length fixes the height |
| `debug`     | boolean | false   | Draw the box outline |

A table holds an optional `thead` and any number of `tr`.

### `thead` / `tr`

| Attribute   | Type  | Description |
|-------------|-------|-------------|
| `background`| color | Row background |

`thead` repeats at the top of every page. Both hold `td` cells.

### `td`

Takes the shared box attributes, except `width`, and:

| Attribute | Type    | Default | Description |
|-----------|---------|---------|-------------|
| `align`   | string  | fill    | `start` `center` `end`. By default children fill the cell width |
| `valign`  | string  | `top`   | `top` `middle` `bottom` |

### `barcode`

| Attribute   | Type    | Default   | Description |
|-------------|---------|-----------|-------------|
| `type`      | string  | —         | **Required.** `qr` `code128` `ean13` |
| `data`      | string  | —         | **Required.** Barcode data payload |
| `size`      | token/pt| —         | Uniform size (QR only) |
| `width`     | token/pt| —         | Width |
| `height`    | pt      | —         | Height (non-QR) |
| `ec`        | string  | `M`       | QR error correction: `L` `M` `Q` `H` |
| `hrt`       | boolean | false     | Human-readable text below Code128/EAN-13 |
| `color`     | color   | `#000000` | Bar color |
| `background`| color   | —         | Background color |
| `debug`     | boolean | false     | Draw the box outline |

### `link`

Clickable hyperlink wrapper.

| Attribute | Type    | Description |
|-----------|---------|-------------|
| `href`    | URL     | **Required.** Link target. Fixed: `data-value` does not change it |
| `gap`     | spacing | Gap between child elements |
| `debug`   | boolean | Draw the box outline |

### `field`

PDF form field.

| Attribute     | Type    | Default | Description |
|---------------|---------|---------|-------------|
| `type`       | string  | —       | **Required.** `text` `checkbox` `dropdown` `radio` `button` |
| `name`       | string  | —       | **Required.** Field name in the PDF form |
| `value`      | string  | —       | Default value |
| `label`      | string  | —       | Visible label (checkbox, radio, button) |
| `options`    | string  | —       | Comma-separated options (dropdown) |
| `group`      | string  | —       | Radio group name |
| `checked`    | boolean | false   | Initial checked state (checkbox/radio) |
| `required`   | boolean | false   | Mark field as required |
| `readonly`   | boolean | false   | Prevent editing |
| `max-len`    | integer | —       | Maximum text length |
| `action-url` | URL     | —       | Submit URL (button) |
| `width`      | token/pt| —       | Field width |
| `height`     | pt      | —       | Field height |
| `debug`      | boolean | false   | Draw the box outline |

### `region`

Pinned header or footer that repeats across pages. Only allowed directly inside `layout`, with one per pin on a page. In its text, `{page}` is the page number and `{pages}` the total.

| Attribute | Type   | Default | Description |
|-----------|--------|---------|-------------|
| `pin`     | string | —       | **Required.** `top` or `bottom`. `left` and `right` pass validation but are not implemented yet |
| `page`    | string | `each`  | `each` `first` `last` `odd` `even`, or numbers and ranges such as `2-last` |
| `debug`   | boolean | false  | Draw the region's outline |

---

## Canvas elements

Canvas elements live inside `layer` inside `canvas`. Positions and sizes take `pt`, `mm` or `in`, and canvas elements are not data-bound.

### `canvas`

Container for absolute-positioned layers. Sibling of `layout` inside a `section`; the one listed first is painted first. It holds only `layer` elements.

### `layer`

| Attribute   | Type    | Default | Description |
|-------------|---------|---------|-------------|
| `page`      | string  | `each`  | `each` `first` `last` `odd` `even`, or numbers and ranges such as `2-last` |
| `opacity`   | 0–1     | 1       | Layer opacity |
| `transform` | string  | —       | `translate(x, y)`, `scale(s)`, `rotate(deg, cx, cy)` or `matrix(a, b, c, d, e, f)`, with plain numbers |
| `clip`      | string  | —       | Reserved. Accepted, no effect yet |

A layer cannot contain another layer.

### `rect`

| Attribute      | Type      | Default | Description |
|----------------|-----------|---------|-------------|
| `x`            | signed pt | —       | X (or offset from anchor) |
| `y`            | signed pt | —       | Y (or offset from anchor) |
| `w`            | pt        | —       | **Required.** Width |
| `h`            | pt        | —       | **Required.** Height |
| `anchor`       | string    | —       | Reference point |
| `fill`         | color     | —       | Fill color |
| `stroke`       | color     | —       | Border color |
| `stroke-width` | pt        | `1pt`   | Border width |
| `stroke-dash`  | string    | —       | Dash pattern: `"4 2"` |
| `radius`       | pt        | —       | Corner radius |
| `opacity`      | 0–1       | 1       | Opacity |

### `circle`

| Attribute      | Type      | Default | Description |
|----------------|-----------|---------|-------------|
| `cx`           | signed pt | —       | Centre X (or offset from anchor) |
| `cy`           | signed pt | —       | Centre Y (or offset from anchor) |
| `r`            | pt        | —       | **Required.** Radius |
| `anchor`       | string    | —       | Reference point |
| `fill`         | color     | —       | Fill color |
| `stroke`       | color     | —       | Border color |
| `stroke-width` | pt        | `1pt`   | Border width |
| `stroke-dash`  | string    | —       | Dash pattern |
| `opacity`      | 0–1       | 1       | Opacity |

### `ellipse`

Takes the same attributes as `circle`, with `rx` and `ry` in place of `r`.

| Attribute | Type | Description |
|-----------|------|-------------|
| `rx`      | pt   | **Required.** Horizontal radius |
| `ry`      | pt   | **Required.** Vertical radius |

### `line`

| Attribute      | Type      | Default   | Description |
|----------------|-----------|-----------|-------------|
| `x1`           | signed pt | —         | **Required.** Start X |
| `y1`           | signed pt | —         | **Required.** Start Y |
| `x2`           | signed pt | —         | **Required.** End X |
| `y2`           | signed pt | —         | **Required.** End Y |
| `stroke`       | color     | `#000000` | Line color |
| `stroke-width` | pt        | `1pt`     | Line thickness |
| `stroke-dash`  | string    | —         | Dash pattern: `"4 2"` |
| `line-cap`     | string    | `butt`    | `butt` `round` `square` |

### `path`

| Attribute      | Type    | Default   | Description |
|----------------|---------|-----------|-------------|
| `d`            | string  | —         | **Required.** SVG path data |
| `fill`         | color   | —         | Fill color |
| `stroke`       | color   | —         | Stroke color |
| `fill-rule`    | string  | `nonzero` | `nonzero` `evenodd` |
| `stroke-width` | pt      | `1pt`     | Stroke width |
| `stroke-dash`  | string  | —         | Dash pattern |
| `line-cap`     | string  | `butt`    | `butt` `round` `square` |
| `opacity`      | 0–1     | 1         | Opacity |

### `text` (canvas)

| Attribute     | Type      | Default     | Description |
|---------------|-----------|-------------|-------------|
| `x`           | signed pt | —           | X (or offset from anchor) |
| `y`           | signed pt | —           | Y (or offset from anchor) |
| `anchor`      | string    | —           | Reference point |
| `font`        | string    | `Helvetica` | Font name |
| `font-size`   | pt        | `12pt`      | Font size. Tokens are not accepted |
| `color`       | color     | `#000000`   | Text color |
| `align`       | string    | `left`      | `left` `center` `right` `justify` |
| `w`           | pt        | —           | Wrap width. Without it, text wraps at the right edge of the page |
| `line-height` | number    | `1.2`       | Line height multiplier |
| `opacity`     | 0–1       | 1           | Opacity |

Children: `span`, with `font` and `color` only.

### `img` (canvas)

| Attribute    | Type      | Default | Description |
|--------------|-----------|---------|-------------|
| `name`       | string    | —       | **Required.** Asset name |
| `x`          | signed pt | —       | X (or offset from anchor) |
| `y`          | signed pt | —       | Y (or offset from anchor) |
| `w`          | pt        | —       | **Required.** Width |
| `h`          | pt        | —       | **Required.** Height |
| `anchor`     | string    | —       | Reference point |

---

## Anchor values

Used by canvas elements (`x`/`y` are offsets from the anchor point). The points are on the whole page, not inside the margin:

| Value          | Description |
|----------------|-------------|
| `top-left`     | Top-left corner of the page |
| `top-center`   | Top centre |
| `top-right`    | Top-right corner |
| `center-left`  | Middle of the left edge |
| `center`       | Page centre |
| `center-right` | Middle of the right edge |
| `bottom-left`  | Bottom-left corner |
| `bottom-center`| Bottom centre |
| `bottom-right` | Bottom-right corner |
