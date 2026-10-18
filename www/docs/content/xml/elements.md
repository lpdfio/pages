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
| `font`        | string  | `Helvetica` | Default font: a built-in name or an asset name |
| `background`  | color   | —          | Page background color |
| `debug`       | boolean | false      | Render layout boxes |

A document holds an optional `meta` and one or more `section` elements. Other attributes are not read: `width`, `height`, `color` and `title` are ignored, and `font-size` and `margin` are errors (the margin is set on the `layout`). Set a page size with `size="200pt 300pt"`, and the title on `meta`.

### `section`

| Attribute     | Type    | Default  | Description |
|---------------|---------|----------|-------------|
| `size`        | string  | inherit  | Override page size for this section |
| `orientation` | string  | inherit  | Override orientation |
| `background`  | color   | inherit  | Section background |
| `title`       | string  | —        | Section title. Accepted, but not used: the PDF's outline takes its entries from bookmarks |
| `type`        | string  | —        | `toc`: the section is the document's [table of contents](?p=doc/toc), laid out last with the data `$toc`. One per document |
| `toc-indent-step` | token/pt | `12pt` | In a table of contents, the left padding an entry gets for each level below the first |
| `debug`       | boolean | false    | Render layout boxes |

A section can start with one `bookmark`, which marks its first page, followed by [layers](#layer-elements) and at most one `layout`, painted in the order they are written. A layer before the layout is painted under it, and a layer after it is painted over it. A section with no layout is one page.

### `layout`

The flowing content of a section. Its elements are [layout elements](#layout-elements).

| Attribute | Type    | Default | Description |
|-----------|---------|---------|-------------|
| `margin`  | spacing | `36pt`  | The space between the page edges and the flowing content and its regions: `48pt`, a token, or one to four values like `"48pt 24pt"`. A layer ignores it |

---

## Layout elements

Layout elements live inside `layout`. Every one except `region`, `span` and `bookmark` takes `data-source`, `data-if` and `data-if-not`, and `text` and `barcode` take `data-value`. See [Data Binding](?p=data/binding).

### Shared box attributes

`column`, `row`, `grid`, `frame` and `td` take these, beside their own:

| Attribute   | Type    | Default | Description |
|-------------|---------|---------|-------------|
| `gap`       | token/pt| `0`     | Space between children. Not on `frame`, which has one child |
| `padding`   | spacing | `0`     | Space inside the edge: `8pt`, a token, or one to four values like `"8pt 16pt"` |
| `width`     | token/pt/`fill` | — | Fixed width, or `fill`: the full width, and in a `row` the width the other children leave. Not on `td`: the table's `cols` sets cell widths |
| `height`    | pt/`fill`/`full` | — | A length fixes the height; `fill` takes what is left after siblings; `full` takes all the height available. Any of them stops the box splitting across pages |
| `paginate`  | string  | —       | Page breaks: `no` `break-before` `break-after` `keep-next`. See [Page breaks](?p=doc/layout#page-breaks) |
| `background`| color   | —       | Background fill |
| `border`    | BorderValue | —   | Border, written `"thickness color"` |
| `radius`    | token/pt| `0`     | Corner radius |
| `font`      | string  | inherit | Font for the text inside |
| `font-size` | token/pt| inherit | Font size for the text inside |
| `debug`     | boolean | false   | Draw the box outlines |

### `column`

Vertical column of children.

| Attribute  | Type    | Default   | Description |
|------------|---------|-----------|-------------|
| `align`    | string  | `stretch` | Horizontal alignment: `start` `center` `end` `stretch` |
| `justify`  | string  | `start`   | Vertical distribution: `start` `center` `end` `between` |

### `row`

Children side by side, continuing on the next line when they run out of width. A child with `width="fill"` takes the width its line leaves, shared equally when several on the line use it, and never moves to the next line.

| Attribute  | Type    | Default | Description |
|------------|---------|---------|-------------|
| `align`    | string  | `start` | Vertical alignment on each line: `start` `center` `end`. `stretch` acts as `start` |
| `justify`  | string  | `start` | Distribution along each line: `start` `center` `end` `between`. `between` puts the first child at the left edge, the last at the right, and the others evenly between |

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
| `font`       | string  | inherit, else the document's `font`, or `Helvetica` | Font name |
| `font-size`  | token/pt| inherit, else `m` (11pt) | Font size |
| `color`      | color   | `#1a1a1a` | Text color. Not inherited. A color named `text` in `tokens` changes the default |
| `align`      | string  | `left`    | `left` `center` `right` `justify` |
| `width`      | token/pt| —         | Constrain text block width |
| `widows`     | integer | `2`       | The fewest lines, 1 to 10, that a split paragraph may carry to the top of the next page. `1` turns it off |
| `orphans`    | integer | `2`       | The fewest lines, 1 to 10, that a split paragraph may leave at the bottom of a page. `1` turns it off |
| `paginate`   | string  | —         | Page breaks: `no` `break-before` `break-after` `keep-next`. See [Page breaks](?p=doc/layout#page-breaks) |
| `debug`      | boolean | false     | Draw the box outline |
| `data-value` | string  | —         | Dot-path to a scalar value that replaces the text |

Children: `span` for inline style overrides. Line height is fixed at 1.2 times the font size.

### `span`

Inline text with overridden style.

| Attribute   | Type    | Description |
|-------------|---------|-------------|
| `font`      | string  | Font override |
| `color`     | color   | Color override |
| `href`      | URL     | Makes the span a link: a URL, or `#id` to jump to the bookmark with that id |
| `underline` | boolean | Underline text |
| `strike`    | boolean | Strikethrough text |

A space falls between a span and the text around it only where the text has whitespace there. See [Spaces around a span](?p=doc/layout/text#spaces-around-a-span).

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
| `width`      | token/pt| —       | Width. Without `height`, the height follows the image's proportions |
| `height`     | pt      | —       | Height. With both, they are a maximum: the image is never stretched |
| `padding`    | spacing | `0`     | Space around the image |
| `background` | color   | —       | Background behind the image |
| `border`     | BorderValue | —   | Border |
| `radius`     | token/pt| `0`     | Corner radius |
| `paginate`   | string  | —       | Page breaks: `no` `break-before` `break-after` `keep-next`. See [Page breaks](?p=doc/layout#page-breaks) |
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
| `paginate`  | string  | —       | Page breaks: `no` `break-before` `break-after` `keep-next`. See [Page breaks](?p=doc/layout#page-breaks) |
| `debug`     | boolean | false   | Draw the box outline |

A table holds an optional `thead` and any number of `tr`.

### `thead` / `tr`

| Attribute   | Type  | Description |
|-------------|-------|-------------|
| `background`| color | Row background |

`thead` repeats at the top of every page. Both hold `td` cells.

### `td`

Takes the shared box attributes, except `width`. It accepts `paginate`, which has no effect on a cell, since a row never splits. Its own attributes:

| Attribute | Type    | Default | Description |
|-----------|---------|---------|-------------|
| `align`   | string  | fill    | `start` `center` `end`. By default children fill the cell width |
| `valign`  | string  | `top`   | `top` `middle` `bottom` |

### `barcode`

| Attribute   | Type    | Default   | Description |
|-------------|---------|-----------|-------------|
| `type`      | string  | —         | **Required.** `qr` `code128` `ean13` |
| `data`      | string  | —         | **Required.** Barcode data payload |
| `width`     | token/pt| —         | Width. Without `height`, the height follows the barcode's proportions |
| `height`    | pt      | —         | Height of the whole barcode, with the digits of `hrt` inside it. With both, they are a maximum: the barcode is never stretched |
| `ec`        | string  | `M`       | QR error correction: `L` `M` `Q` `H` |
| `hrt`       | boolean | false     | Human-readable text below Code128/EAN-13 |
| `data-value`| string  | —         | Dot-path to a scalar value that replaces the data the barcode encodes |
| `color`     | color   | `#000000` | Bar color |
| `background`| color   | —         | Background color |
| `paginate`  | string  | —         | Page breaks: `no` `break-before` `break-after` `keep-next`. See [Page breaks](?p=doc/layout#page-breaks) |
| `debug`     | boolean | false     | Draw the box outline |

### `link`

Clickable hyperlink wrapper.

| Attribute | Type    | Description |
|-----------|---------|-------------|
| `href`    | URL     | **Required.** Link target: a URL, or `#id` to jump to the bookmark with that id. Fixed: `data-value` does not change it |
| `gap`     | spacing | Gap between child elements |
| `debug`   | boolean | Draw the box outline |

In an entry of a table of contents, `href="#"` on a `link` or a `span` jumps to that entry's bookmark.

### `bookmark`

An entry of the PDF's outline and a target for `href="#id"` links. It draws nothing, and marks the element that follows it, which must be in the same container. Directly inside a `section`, as its first child, it marks the section's first page. Not allowed in a layer. See [Bookmark](?p=doc/layout/bookmark).

| Attribute | Type    | Default | Description |
|-----------|---------|---------|-------------|
| `label`   | string  | —       | **Required.** The text of the entry, in the outline and in a table of contents |
| `level`   | integer | `1`     | Depth in the outline, 1 to 6. An entry nests under the closest entry before it with a lower level |
| `id`      | string  | from `label` | The name links jump to. Without it, the label lowercased with other characters than letters and digits turned into hyphens, and `-2`, `-3` added when the id is taken. Two bookmarks may not have the same id |

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

## Layer elements

Layer elements live inside a `layer`, which is a child of `section`. Positions and sizes take `pt`, `mm` or `in`. A layer reads single values: `text-at`, `img-at`, `barcode-at` and the `layer` itself take `data-if` and `data-if-not`, and `text-at` and `barcode-at` take `data-value`. `data-source` is not allowed. See [Layer](?p=doc/layer#data-in-a-layer).

### `layer`

Fixed content, in the order it is written among the section's layers and layout.

| Attribute   | Type    | Default | Description |
|-------------|---------|---------|-------------|
| `page`      | string  | `each`  | `each` `first` `last` `odd` `even`, or numbers and ranges such as `2-last` |
| `opacity`   | 0–1     | 1       | Opacity of everything in the layer as one. `0` draws nothing |
| `transform` | string  | —       | `translate(x, y)`, `scale(s)`, `rotate(deg, cx, cy)` or `matrix(a, b, c, d, e, f)`, with plain numbers |
| `clip`      | string  | —       | A rectangle, `x y w h`, in points from the top left corner of the page: what the layer draws outside it is cut off |
| `data-if`   | string  | —       | Draw the layer only when the value at the path is truthy |
| `data-if-not` | string | —      | Draw the layer only when the value at the path is falsy |

A layer cannot contain another layer.

### `rect`

| Attribute      | Type      | Default | Description |
|----------------|-----------|---------|-------------|
| `x`            | signed pt | —       | X of the left edge (or offset from anchor) |
| `y`            | signed pt | —       | Y of the top edge (or offset from anchor) |
| `width`        | pt        | —       | **Required.** Width |
| `height`       | pt        | —       | **Required.** Height |
| `anchor`       | string    | —       | Reference point |
| `fill`         | color     | —       | Fill color |
| `stroke`       | color     | —       | Border color |
| `stroke-width` | pt        | `1pt`   | Border width |
| `stroke-dash`  | string    | —       | Dash pattern: `"4 2"` |
| `radius`       | pt        | —       | Corner radius |

### `circle`

| Attribute      | Type      | Default | Description |
|----------------|-----------|---------|-------------|
| `x`            | signed pt | —       | X of the left edge of the circle's box, the square of side 2`r` around it (or offset from anchor) |
| `y`            | signed pt | —       | Y of the top edge of the circle's box (or offset from anchor) |
| `r`            | pt        | —       | **Required.** Radius |
| `anchor`       | string    | —       | Reference point |
| `fill`         | color     | —       | Fill color |
| `stroke`       | color     | —       | Border color |
| `stroke-width` | pt        | `1pt`   | Border width |
| `stroke-dash`  | string    | —       | Dash pattern |

### `ellipse`

Takes the same attributes as `circle`, with `rx` and `ry` in place of `r`. Its box is 2`rx` wide and 2`ry` high.

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

### `text-at`

Text at a fixed place. It is the layout's `text` with the same defaults. Children: `span`, as in `text`.

| Attribute     | Type      | Default     | Description |
|---------------|-----------|-------------|-------------|
| `x`           | signed pt | —           | X of the left edge of the box (or offset from anchor) |
| `y`           | signed pt | —           | Y of the top edge of the box (or offset from anchor) |
| `anchor`      | string    | —           | Reference point |
| `width`       | pt        | —           | Width of the box. Without it the text is one line at its natural width |
| `max-lines`   | integer   | `1`         | The most lines drawn. Above 1 it needs a `width` |
| `ellipsis`    | boolean   | `false`     | End the last line drawn in an ellipsis when the text does not fit |
| `line-height` | number    | `1.2`       | The distance between lines, as a factor of the font size |
| `font`        | string    | the document's `font`, or `Helvetica` | Font name |
| `font-size`   | token/pt  | `m` (11pt)  | Font size |
| `bold`        | boolean   | `false`     | The bold face of a built-in font |
| `color`       | color     | `#1a1a1a`   | Text color. A color named `text` in `tokens` changes the default |
| `align`       | string    | `left`      | `left` `center` `right` `justify`, within `width` |
| `data-value`  | string    | —           | Dot-path to a value that replaces the text |

### `img-at`

An image at a fixed place. It needs `width` or `height`.

| Attribute    | Type      | Default | Description |
|--------------|-----------|---------|-------------|
| `name`       | string    | —       | **Required.** Asset name |
| `x`          | signed pt | —       | X of the left edge of the box (or offset from anchor) |
| `y`          | signed pt | —       | Y of the top edge of the box (or offset from anchor) |
| `anchor`     | string    | —       | Reference point |
| `width`      | pt        | —       | Width. Without `height`, the height follows the image's proportions |
| `height`     | pt        | —       | Height. With both, they are a maximum: the image is never stretched |

### `barcode-at`

A barcode at a fixed place. It needs `width` or `height`.

| Attribute    | Type      | Default   | Description |
|--------------|-----------|-----------|-------------|
| `type`       | string    | —         | **Required.** `qr` `code128` `ean13` |
| `data`       | string    | —         | **Required.** Barcode data payload |
| `x`          | signed pt | —         | X of the left edge of the box (or offset from anchor) |
| `y`          | signed pt | —         | Y of the top edge of the box (or offset from anchor) |
| `anchor`     | string    | —         | Reference point |
| `width`      | pt        | —         | Width. Without `height`, the height follows the barcode's proportions |
| `height`     | pt        | —         | Height of the whole barcode, with the digits of `hrt` inside it. With both, they are a maximum: the barcode is never stretched |
| `ec`         | string    | `M`       | QR error correction: `L` `M` `Q` `H` |
| `hrt`        | boolean   | `false`   | Human-readable text below Code128/EAN-13 |
| `color`      | color     | `#000000` | Bar color |
| `background` | color     | —         | Background color |
| `data-value` | string    | —         | Dot-path to a value that replaces the data the barcode encodes |

---

## Anchor values

Used by layer elements (`x`/`y` are offsets from the anchor point, and the element's matching point is placed there). The points are on the whole page, not inside the margin:

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
