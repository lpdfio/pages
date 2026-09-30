# All Elements

Complete attribute reference for every lpdf XML element. Use Ctrl+F to find the element you need.

---

## Document structure

### `lpdf`

Root element.

| Attribute | Type   | Required | Description |
|-----------|--------|----------|-------------|
| `version` | string | yes      | Schema version — always `"1"` |

### `assets`

Container for font and image declarations. Must appear before `document`.

### `font`

| Attribute | Type   | Description |
|-----------|--------|-------------|
| `name`    | string | Alias used in the document |
| `core`    | string | Built-in PDF font: `Helvetica`, `Helvetica-Bold`, `Helvetica-Oblique`, `Helvetica-BoldOblique`, `Times-Roman`, `Times-Bold`, `Times-Italic`, `Times-BoldItalic`, `Courier`, `Courier-Bold` |
| `src`     | URL    | URL to a .ttf / .otf font file |

### `image`

| Attribute | Type   | Description |
|-----------|--------|-------------|
| `name`    | string | Alias used in `img` elements |
| `src`     | URL    | URL to the image file |

### `tokens`

Container for custom token definitions (spacing, color). Not yet documented.

### `document`

| Attribute     | Type    | Default  | Description |
|---------------|---------|----------|-------------|
| `size`        | string  | `letter` | `letter` `legal` `a4` `a3` |
| `orientation` | string  | `portrait` | `portrait` `landscape` |
| `width`       | pt      | —        | Custom width (overrides `size`) |
| `height`      | pt      | —        | Custom height (overrides `size`) |
| `margin`      | pt      | `0`      | Page margin (all sides) |
| `margin-top`  | pt      | —        | Top margin override |
| `margin-right`| pt      | —        | Right margin override |
| `margin-bottom`| pt     | —        | Bottom margin override |
| `margin-left` | pt      | —        | Left margin override |
| `font`        | string  | —        | Default font (asset name) |
| `font-size`   | token/pt| —        | Default font size |
| `color`       | color   | —        | Default text color |
| `background`  | color   | —        | Page background color |
| `title`       | string  | —        | PDF metadata title |
| `debug`       | boolean | false    | Render layout boxes |

### `section`

| Attribute     | Type    | Default  | Description |
|---------------|---------|----------|-------------|
| `size`        | string  | inherit  | Override page size for this section |
| `orientation` | string  | inherit  | Override orientation |
| `margin`      | pt      | inherit  | Override margin |
| `background`  | color   | inherit  | Section background |
| `title`       | string  | —        | Section metadata title |
| `debug`       | boolean | false    | Render layout boxes |

---

## Layout primitives

Layout elements live inside `layout`. All layout elements support `data-value`, `data-source`, `data-if`, and `data-if-not` unless noted.

### `stack`

Vertical column of children.

| Attribute  | Type    | Default | Description |
|------------|---------|---------|-------------|
| `gap`      | token/pt| `0`     | Space between children |
| `padding`  | token/pt| `0`     | Inner padding |
| `align`    | string  | `stretch` | Horizontal alignment: `start` `center` `end` `stretch` |
| `justify`  | string  | `start` | Vertical distribution: `start` `center` `end` `between` |
| `background`| color  | —       | Background fill |
| `border`   | BorderValue| —    | Border |
| `radius`   | token/pt| —       | Corner radius |
| `width`    | token/pt| —       | Fixed width |
| `height`   | pt/`fill`/`full` | — | A length fixes the height; `fill` takes what is left after siblings; `full` takes all the height available |

### `flank`

Row where every child keeps its own width except one, which fills the rest: the last child by default, the first with `end="true"`.

| Attribute  | Type    | Default | Description |
|------------|---------|---------|-------------|
| `end`      | boolean | `false` | `false`: the last child fills. `true`: the first child fills, the others sit at the right |
| `gap`      | token/pt| `0`     | Gap between children |
| `padding`  | token/pt| `0`     | Inner padding |
| `align`    | string  | `start` | Vertical alignment: `start` `center` `end` |
| `background`| color  | —       | Background fill |
| `border`   | BorderValue| —    | Border |
| `radius`   | token/pt| —       | Corner radius |
| `width`    | token/pt| —       | Fixed width |

### `split`

Two children side by side: by default each keeps its own width, the first at the left edge and the second at the right; with `equal="true"` they take half the width each. Further children are ignored. For more columns use `grid`; for explicit column widths use `table`.

| Attribute  | Type    | Default | Description |
|------------|---------|---------|-------------|
| `equal`    | boolean | `false` | `true`: the two children take half the width each |
| `gap`      | token/pt| `0`     | Gap between the two children |
| `padding`  | token/pt| `0`     | Inner padding |
| `align`    | string  | `start` | Vertical alignment: `start` `center` `end` |
| `background`| color  | —       | Background fill |
| `border`   | BorderValue| —    | Border |
| `radius`   | token/pt| —       | Corner radius |
| `width`    | token/pt| —       | Fixed width |

### `cluster`

Wrapping row of inline items.

| Attribute  | Type    | Default | Description |
|------------|---------|---------|-------------|
| `gap`      | token/pt| `0`     | Gap between items |
| `padding`  | token/pt| `0`     | Inner padding |
| `align`    | string  | `start` | Alignment: `start` `center` `end` `stretch` |
| `background`| color  | —       | Background fill |
| `border`   | BorderValue| —    | Border |
| `radius`   | token/pt| —       | Corner radius |

### `text`

Paragraph or inline text.

| Attribute    | Type    | Default | Description |
|--------------|---------|---------|-------------|
| `font`       | string  | inherit | Font asset name |
| `font-size`  | token/pt| inherit | Font size |
| `color`      | color   | inherit | Text color |
| `align`      | string  | `left`  | `left` `center` `right` `justify` |
| `line-height`| number  | —       | Line height multiplier |
| `width`      | token/pt| —       | Constrain text block width |
| `data-value` | string  | —       | Dot-path to scalar value |

Children: `span` for inline style overrides.

### `span`

Inline text with overridden style.

| Attribute   | Type    | Description |
|-------------|---------|-------------|
| `font`      | string  | Font override |
| `font-size` | token/pt| Font size override |
| `color`     | color   | Color override |
| `href`      | URL     | Makes the span a hyperlink |
| `underline` | boolean | Underline text |
| `strike`    | boolean | Strikethrough text |

### `divider`

Horizontal (or vertical) rule.

| Attribute   | Type    | Default | Description |
|-------------|---------|---------|-------------|
| `color`     | color   | `#000000`    | Line color |
| `thickness` | token/pt| `1pt`        | Line thickness |
| `direction` | string  | `horizontal` | `horizontal` or `vertical` |

### `frame`

Single-child container with padding, border, and background. Always centres its child, so it takes no `gap`, `align` or `justify`.

| Attribute   | Type    | Default | Description |
|-------------|---------|---------|-------------|
| `padding`   | token/pt| `0`     | Inner padding |
| `background`| color   | —       | Background fill |
| `border`    | BorderValue| —    | Border |
| `radius`    | token/pt| —       | Corner radius |
| `width`     | token/pt| —       | Fixed width |
| `height`    | pt/`fill`/`full` | — | A length fixes the height; `fill` takes what is left after siblings; `full` takes all the height available |

### `img` (layout)

Inline image.

| Attribute | Type   | Default | Description |
|-----------|--------|---------|-------------|
| `name`    | string | —       | **Required.** Asset name |
| `width`   | token/pt | —     | Display width |
| `height`  | pt     | —       | Display height |
| `radius`  | token/pt| —      | Corner radius |

### `grid`

Multi-column flow grid.

| Attribute | Type    | Default | Description |
|-----------|---------|---------|-------------|
| `cols`    | integer | `1`     | Number of columns (1–12) |
| `col-width` | token/pt | —    | Minimum column width: fits as many columns as the width allows, at least one, stretched to fill the row (overrides `cols`) |
| `gap`     | token/pt| `0`     | Gap between cells |
| `padding` | token/pt| `0`     | Inner padding |
| `background`| color | —       | Background fill |
| `border`  | BorderValue| —    | Border |
| `radius`  | token/pt| —       | Corner radius |

### `table`

| Attribute   | Type    | Default | Description |
|-------------|---------|---------|-------------|
| `cols`      | string  | equal   | Column widths: `"1fr 2fr"` or `"100pt 1fr"` |
| `border`    | BorderValue| —    | Cell borders |
| `stripe`    | color   | —       | Alternating row background |
| `padding`   | token/pt| `0`     | Default cell padding |

### `thead` / `tr`

| Attribute   | Type  | Description |
|-------------|-------|-------------|
| `background`| color | Row background |

`tr` also accepts `data-source`, `data-if`, `data-if-not`.

### `td`

| Attribute | Type    | Default | Description |
|-----------|---------|---------|-------------|
| `align`   | string  | `start` | `start` `center` `end` |
| `span`    | integer | `1`     | Column span |
| `padding` | token/pt| —       | Cell padding override |

### `barcode`

| Attribute   | Type    | Default | Description |
|-------------|---------|---------|-------------|
| `type`      | string  | `qr`    | `qr` `code128` `ean13` |
| `data`      | string  | —       | Barcode data payload |
| `size`      | token/pt| —       | Uniform size (QR only) |
| `width`     | pt      | —       | Width |
| `height`    | pt      | —       | Height (non-QR) |
| `ec`        | string  | `M`     | QR error correction: `L` `M` `Q` `H` |
| `hrt`       | boolean | false   | Human-readable text below Code128/EAN-13 |
| `data-value`| string  | —       | Dot-path — replaces `data` |

### `link`

Clickable hyperlink wrapper.

| Attribute | Type   | Description |
|-----------|--------|-------------|
| `href`      | URL     | Link target |
| `gap`       | spacing | Gap between child elements |
| `data-value`| string  | Dot-path — replaces `href` |

### `field`

PDF form field.

| Attribute     | Type    | Default | Description |
|---------------|---------|---------|-------------|
| `type`       | string  | `text`  | `text` `checkbox` `dropdown` `radio` `button` |
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

### `region`

Pinned header or footer that repeats across pages.

| Attribute | Type   | Default | Description |
|-----------|--------|---------|-------------|
| `pin`     | string | —       | **Required.** `top` or `bottom` |
| `page`    | string | `first` | `each` `first` `last` `odd` `even` `except-first` `except-last` or a range like `2-last`. **Default is `first`** — use `each` for running headers/footers. |

---

## Canvas primitives

Canvas elements live inside `layer` inside `canvas`.

### `canvas`

Container for absolute-positioned layers. Sibling of `layout` inside a `section`.

### `layer`

| Attribute   | Type    | Default | Description |
|-------------|---------|---------|-------------|
| `page`      | string  | `each`  | `each` `first` `last` `odd` `even` `except-first` `except-last` or a range like `2-last` |
| `opacity`   | 0–1     | 1       | Layer opacity |
| `transform` | string  | —       | SVG-style `rotate(deg, cx, cy)` |

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
| `stroke-width` | pt        | —       | Border width |
| `radius`       | pt        | —       | Corner radius |
| `opacity`      | 0–1       | 1       | Opacity |

### `circle`

| Attribute      | Type      | Default | Description |
|----------------|-----------|---------|-------------|
| `cx`           | signed pt | —       | Centre X |
| `cy`           | signed pt | —       | Centre Y |
| `r`            | pt        | —       | Radius (circle) |
| `rx`           | pt        | —       | Horizontal radius (ellipse) |
| `ry`           | pt        | —       | Vertical radius (ellipse) |
| `anchor`       | string    | —       | Reference point |
| `fill`         | color     | —       | Fill color |
| `stroke`       | color     | —       | Border color |
| `stroke-width` | pt        | —       | Border width |
| `opacity`      | 0–1       | 1       | Opacity |

### `line`

| Attribute      | Type      | Default | Description |
|----------------|-----------|---------|-------------|
| `x1`           | signed pt | —       | **Required.** Start X |
| `y1`           | signed pt | —       | **Required.** Start Y |
| `x2`           | signed pt | —       | **Required.** End X |
| `y2`           | signed pt | —       | **Required.** End Y |
| `stroke`       | color     | —       | Line color |
| `stroke-width` | pt        | —       | Line thickness |
| `stroke-dash`  | string    | —       | Dash pattern: `"4 2"` |
| `line-cap`     | string    | `butt`  | `butt` `round` `square` |

### `path`

| Attribute      | Type    | Default   | Description |
|----------------|---------|-----------|-------------|
| `d`            | string  | —         | **Required.** SVG path data |
| `fill`         | color   | —         | Fill color |
| `stroke`       | color   | —         | Stroke color |
| `fill-rule`    | string  | `nonzero` | `nonzero` `evenodd` |
| `stroke-width` | pt      | —         | Stroke width |
| `stroke-dash`  | string  | —         | Dash pattern |
| `line-cap`     | string  | `butt`    | `butt` `round` `square` |
| `opacity`      | 0–1     | 1         | Opacity |

### `text` (canvas)

| Attribute     | Type      | Default | Description |
|---------------|-----------|---------|-------------|
| `x`           | signed pt | —       | X (or offset from anchor) |
| `y`           | signed pt | —       | Y (or offset from anchor) |
| `anchor`      | string    | —       | Reference point |
| `font`        | string    | inherit | Font asset name |
| `font-size`   | token/pt  | inherit | Font size |
| `color`       | color     | —       | Text color |
| `align`       | string    | `left`  | `left` `center` `right` |
| `w`           | pt        | —       | Wrap width |
| `line-height` | number    | —       | Line height multiplier |
| `opacity`     | 0–1       | 1       | Opacity |
| `data-value`  | string    | —       | Dot-path |

Children: `span` for inline style overrides.

### `img` (canvas)

| Attribute    | Type      | Default | Description |
|--------------|-----------|---------|-------------|
| `name`       | string    | —       | **Required.** Asset name |
| `x`          | signed pt | —       | X (or offset from anchor) |
| `y`          | signed pt | —       | Y (or offset from anchor) |
| `w`          | pt        | —       | **Required.** Width |
| `h`          | pt        | —       | **Required.** Height |
| `anchor`     | string    | —       | Reference point |
| `data-value` | string    | —       | Dot-path — replaces `name` |

---

## Anchor values

Used by canvas primitives (`x`/`y` are offsets from the anchor point):

| Value          | Description |
|----------------|-------------|
| `top-left`     | Top-left corner of the page content area |
| `top-center`   | Top centre |
| `top-right`    | Top-right corner |
| `center-left`  | Middle of the left edge |
| `center`       | Page centre |
| `center-right` | Middle of the right edge |
| `bottom-left`  | Bottom-left corner |
| `bottom-center`| Bottom centre |
| `bottom-right` | Bottom-right corner |
