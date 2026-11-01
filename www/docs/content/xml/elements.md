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

Container for font, image and color profile declarations. Comes before `tokens` and `document`.

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

### `profile`

An ICC color profile: the profile of the printing press a [PDF/X](?p=pdfx) document is made for, which the printer gives out. `profile` on `output` names it.

| Attribute | Type   | Description |
|-----------|--------|-------------|
| `name`    | string | **Required.** Alias the `profile` of `output` uses. Same characters as a font `name` |
| `src`     | path   | Path of the `.icc` file, read by the SDK from the machine that renders |
| `ref`     | string | The key the profile's bytes are registered under with `loadProfile`. Defaults to `name` |

It has to be a printer profile, in gray, RGB or CMYK. The engine bundles no press profile.

### `tokens`

Container for custom scales and colors, placed before `document`. See [Tokens](?p=xml/schema#tokens).

| Child | Description |
|-------|-------------|
| `space`, `text-size`, `border`, `radius`, `width`, `height`, `grid` | Replace one scale. Each takes all six of `xs` `s` `m` `l` `xl` `xxl`, as `pt` values. `height` is the row for the heights of boxes, tables, images, shapes and barcodes: `xs` 16pt, `s` 24pt, `m` 32pt, `l` 48pt, `xl` 64pt, `xxl` 96pt |
| `line-height` | Replaces the line-height scale. It takes all six too, but as factors of the font size, not `pt` values: `xs` 1.0, `s` 1.1, `m` 1.2, `l` 1.4, `xl` 1.6, `xxl` 2.0 |
| `aliases` | Holds `alias` elements |
| `colors` | Holds `color` elements |
| `gradients` | Holds `gradient` elements |

### `alias`

A name of your own for a slot of the scale. An attribute that takes a slot (`xs` to `xxl`) takes the name in its place, and reads the slot of its own row: with `caption` for `xs`, `font-size="caption"` is the text size `xs` and `gap="caption"` the space `xs`. See [Aliases](?p=xml/schema#aliases).

| Attribute | Type   | Description |
|-----------|--------|-------------|
| `name`    | string | **Required.** Lowercase letters, digits and `-`, starting with a letter. Not `xs` `s` `m` `l` `xl` `xxl` `fill` or `full`, which mean something already |
| `value`   | string | **Required.** The slot the name stands for: `xs` `s` `m` `l` `xl` or `xxl`. Not another alias |

### `color`

| Attribute | Type   | Description |
|-----------|--------|-------------|
| `name`    | string | **Required.** Name to use in any color attribute. A color named `text` becomes the default text color |
| `value`   | color  | **Required.** `#rgb`, `#rrggbb`, `cmyk()`, `rgb()` or `hsl()`. See [Colors](?p=xml/schema#colors) |

### `gradient`

A named blend of colors, in `gradients` inside `tokens`. A `background` or a `fill` uses it as `gradient:name`, and the blend spans the box it fills. Give `from` and `to` for two colors, or `stop` children for more. See [Gradients](?p=xml/schema#gradients).

| Attribute | Type   | Default  | Description |
|-----------|--------|----------|-------------|
| `name`    | string | —        | **Required.** The name that follows `gradient:`. Lowercase letters, digits and `-`, starting with a letter |
| `type`    | string | —        | **Required.** `linear` or `radial` |
| `from`    | color  | —        | The first color: hex, `cmyk()`, `rgb()`, `hsl()` or a color name. Used with `to`, when there are no `stop` children. For a radial gradient it is the center |
| `to`      | color  | —        | The last color. Used with `from`. For a radial gradient it is the edge |
| `angle`   | number | `0`      | The direction of a linear gradient, in degrees: `0` runs from the top to the bottom, `90` from the left to the right, `180` from the bottom to the top. A radial gradient has no direction |

### `stop`

A color at a place along a `gradient`. A gradient takes two or more, in increasing order, in place of `from` and `to`.

| Attribute | Type    | Description |
|-----------|---------|-------------|
| `offset`  | percent | **Required.** Where the color is reached, from `0%` (the start) to `100%` (the end). Offsets must increase |
| `color`   | color   | **Required.** Hex, `cmyk()`, `rgb()`, `hsl()` or a color name. A gradient's colors are never another gradient, and are all CMYK or all RGB |

### `meta`

Document properties written to the PDF. Child of `document`, before the sections.

| Attribute  | Type   | Description |
|------------|--------|-------------|
| `title`    | string | Document title |
| `author`   | string | Author |
| `subject`  | string | Subject |
| `keywords` | string | Keywords |
| `creator`  | string | Creating application |
| `lang`     | string | The language of the text, as a language tag such as `en-US`, which a screen reader reads it in. A [PDF/UA](?p=pdfua) document needs it |

### `output`

How the PDF file is written, apart from what its pages show: whether it is [encrypted](?p=encryption), and what a reader may do with it, whether it is [PDF/A](?p=pdfa), [PDF/UA](?p=pdfua) or [PDF/X](?p=pdfx), and whether it is [linearized](?p=fast-web-view). Child of `document`, after `meta` and before the sections. The passwords are not here: they come with the render call.

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `encrypt` | string | — | `aes-256` `rc4-128`: encrypts the PDF with this cipher, with the passwords of the render call. Without it the PDF is not encrypted, and passwords given to the render are an error |
| `allow`   | list   | nothing    | What a reader may do without the owner password, separated by spaces: `all`, or any of `print` `modify` `copy` `annotate` `fill-forms` `accessibility` `assemble`. Without it, or with `allow=""`, nothing is allowed. It needs `encrypt` |
| `pdfa`    | string | — | `2b` `2u`: writes the PDF as PDF/A-2b or PDF/A-2u. The render needs `createdOn`, every text a font of `assets`, and the document no CMYK color, form field, barcode digits, `encrypt` or `attachments`, each an error that says what to change |
| `pdfua`   | string | — | `1`: writes the PDF as PDF/UA-1, a tagged PDF a screen reader can read. It combines with `pdfa`. The render needs `createdOn`, `meta` a `title` and a `lang`, every `img` and `barcode` of the layout outside a header or a footer an `alt`, and every text a font of `assets`, each an error that says what to change |
| `pdfx`    | string | — | `4`: writes the PDF as PDF/X-4, for a commercial printer, made for the press profile `profile` names. It combines with `pdfua`. Every page gets a `TrimBox` and a `BleedBox`, RGB is tied to sRGB, and links print as text. The render needs `createdOn`, `meta` a `title`, and every text a font of `assets`, and the document no form field, barcode digits, `encrypt`, `pdfa` or `attachments`, each an error that says what to change |
| `profile` | string | — | The [`profile`](#profile) of `assets` a PDF/X file is made for: the ICC profile of the printing press. It needs `pdfx`, and `pdfx` needs it |
| `linearize` | boolean | `false` | Writes the PDF linearized, for [fast web view](?p=fast-web-view): page 1 and hints that say where every other page is come first, so a viewer that fetches the file by ranges shows page 1 while the rest downloads. Each page then names only the fonts and images it draws. With `encrypt` the file is encrypted first and linearized last. Any change to the file afterwards ends the linearization |

### `attachments`

The files the PDF carries inside it, which a reader lists in its attachments panel: see [Attachments](?p=attachments). Child of `document`, after `meta` and `output` and before the sections. It holds one `file` for each file.

### `file`

A file the PDF carries. Child of `attachments`. The SDK reads it from `src`, or it was loaded on the engine under its `ref` or name.

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `name` | string | required | The name a reader shows the file under and saves it as. Each file of a document has a name of its own |
| `src` | path | — | Where the SDK reads the file from, when it was not loaded on the engine |
| `ref` | string | the name | The key the file was loaded on the engine under |
| `mime` | string | `application/octet-stream` | The type of the file, such as `text/xml` or `application/pdf` |
| `relationship` | string | `unspecified` | `source` `data` `alternative` `supplement` `unspecified`: how the file relates to the document |
| `description` | string | — | A line about the file, which a reader shows beside its name |

### `document`

| Attribute     | Type    | Default    | Description |
|---------------|---------|------------|-------------|
| `size`        | string  | `a4`       | `letter` `legal` `a3` `a4` `a5`, or a custom `"200pt 300pt"` |
| `orientation` | string  | `portrait` | `portrait` `landscape` |
| `bleed`       | pt/mm/in | —         | How far each page reaches past its trim edge, such as `3mm`, for a background or an image that runs off the page when it is cut. The page grows by it, its background fills it, and the layout keeps to the trimmed page. See [PDF/X](?p=pdfx#bleed) |
| `font`        | string  | `Helvetica` | Default font: a built-in name or an asset name |
| `background`  | color or `gradient:name` | — | Page background: a color, or a [gradient](?p=xml/schema#gradients) that spans the page |
| `footnote-counter` | string | `section` | Where the numbers of the [footnotes](?p=doc/layout/footnote) start over: `page`, `section` or `document`. A section's own value overrides it |
| `debug`       | boolean | false      | Render layout boxes |

A document holds an optional `meta`, an optional `output`, optional `attachments` and one or more `section` elements. Any other attribute is an [error](?p=xml/schema#attribute-types), `width`, `height`, `color`, `title` and `font-size` among them, and the one for `margin` says it is set on the `layout`. Set a page size with `size="200pt 300pt"`, and the title on `meta`.

### `section`

| Attribute     | Type    | Default  | Description |
|---------------|---------|----------|-------------|
| `size`        | string  | inherit  | Override page size for this section |
| `orientation` | string  | inherit  | Override orientation |
| `bleed`       | pt/mm/in | inherit | Override the bleed for this section's pages; `0mm` takes it away |
| `background`  | color or `gradient:name` | inherit | Section background. A gradient spans the page |
| `footnote-counter` | string | inherit | Where the numbers of the [footnotes](?p=doc/layout/footnote) in this section start over: `page`, `section` or `document`. Overrides the document's |
| `title`       | string  | —        | Section title. Accepted, but not used: the PDF's outline takes its entries from bookmarks |
| `type`        | string  | —        | `toc`: the section is the document's [table of contents](?p=doc/toc), laid out last with the data `$toc`. One per document |
| `toc-indent-step` | token/pt | `12pt` | In a table of contents, the left padding an entry gets for each level below the first |
| `debug`       | boolean | false    | Render layout boxes |

A section can start with one `bookmark`, which marks its first page, followed by [layers](#layer-elements) and at most one `layout` or one [`markdown`](#markdown), painted in the order they are written. A layer before the layout is painted under it, and a layer after it is painted over it. A section with neither is one page.

### `layout`

The flowing content of a section. Its elements are [layout elements](#layout-elements).

| Attribute | Type    | Default | Description |
|-----------|---------|---------|-------------|
| `margin`  | spacing | `36pt`  | The space between the page edges and the flowing content and its regions: `48pt`, a token, or one to four values like `"48pt 24pt"`. A layer ignores it |

### `markdown`

Markdown as the content of a section, in the place of a `layout`. It holds an optional `markdown-styles` and one `markdown-content`, and nothing else: the page, a header, a footer or a cover stay in the XML around it, and a layer draws a header or a footer in its margin. See [Markdown](?p=doc/markdown).

| Attribute   | Type     | Default | Description |
|-------------|----------|---------|-------------|
| `margin`    | spacing  | `36pt`  | The space between the page edges and the Markdown, as the `margin` of a `layout` |
| `font`      | string   | the document's | The font of the Markdown, which a rule can change |
| `font-size` | token/pt | `m`     | The size of its text, which a rule can change |
| `color`     | color    | the `text` token | The color of its text, which a rule can change |
| `gap`       | token/pt | `l`     | The space between blocks |
| `bookmarks` | integer  | `6`     | How many levels of headings are bookmarks, 0 to 6 |
| `debug`     | boolean  | `false` | Draw the outline of each box |

### `markdown-styles`

The rules that say how each part of a markdown looks, inside `markdown`. A rule is an element named after the Markdown it styles: `h1` to `h6`, `p`, `code`, `quote`, `li`, `a`, `strong`, `em`, `del`, `table`, `th` and `td`. It takes the attributes of the Lpdf element it becomes, and an attribute it does not set stays as the file or the defaults have it. See [Styling](?p=doc/markdown#styling).

| Attribute | Type   | Default | Description |
|-----------|--------|---------|-------------|
| `src`     | string | —       | A file of rules, whose root is a `markdown-styles`. The rules written inside override it, and it overrides the defaults. The SDK, the command line or the extension reads it, as it reads the `src` of a font or an image |

### `markdown-content`

The Markdown, inside `markdown`: written inline, best in a CDATA section, with the indent its lines share removed first, or read from the data. See [Where the Markdown comes from](?p=doc/markdown#where-the-markdown-comes-from).

| Attribute    | Type   | Default | Description |
|--------------|--------|---------|-------------|
| `data-value` | string | —       | The path in the data of a string that holds the Markdown. The text written inside is what a document with no data shows |

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
| `height`    | token/pt/`fill`/`full` | — | A length fixes the height, as a `pt` value or a name from the `height` row of `tokens`; `fill` takes what is left after siblings; `full` takes all the height available. Any of them stops the box splitting across pages |
| `paginate`  | string  | —       | Page breaks: `no` `break-before` `break-after` `keep-next`. See [Page breaks](?p=doc/layout#page-breaks) |
| `background`| color or `gradient:name` | — | Background fill: a color, or a [gradient](?p=xml/schema#gradients) that spans the box |
| `border`    | BorderValue | —   | Border, written `"thickness color"` |
| `radius`    | token/pt| `0`     | Corner radius |
| `color`     | color   | inherit | Color of the text inside. A text that sets none takes the nearest box's, else the `text` color. See [Text color in a box](?p=doc/layout#text-color-in-a-box) |
| `opacity`   | 0–1     | `1`     | How opaque the box and everything in it is, as one. See [Opacity](?p=doc/layout#opacity) |
| `shadow`    | string  | —       | A hard-edged shadow under the box: `"x y color"`, with an optional opacity after the color. See [Shadow](?p=doc/layout#shadow) |
| `font`      | string  | inherit | Font for the text inside |
| `font-size` | token/pt| inherit | Font size for the text inside |
| `debug`     | boolean | false   | Draw the box outlines |
| `ocg` | string | — | `print` or `screen`: shown only in print, or only on screen. See [Print and screen content](?p=print-and-screen) |

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

### `list`

A list of items, each marked with a bullet drawn as a shape or a number the engine writes. Its children are `li` items. The items go top to bottom with `gap` between them, and a list inside an item nests. It takes the attributes of a [box](?p=xml/elements#column), and `width`. See [List](?p=doc/layout/list).

| Attribute  | Type     | Default   | Description |
|------------|----------|-----------|-------------|
| `type`     | string   | `bullet`  | `bullet` marks each item with a shape, `number` with a number |
| `bullet`   | string   | by depth  | The shape of a bullet list: `disc` `circle` `square` `dash`. Without it a list uses a disc, one inside a bullet list a circle, and one inside that a square |
| `format`   | string   | `decimal` | How a number list writes its numbers: `decimal` `lower-alpha` `upper-alpha` `lower-roman` `upper-roman` |
| `start`    | integer  | `1`       | The number of a number list's first item |
| `prefix`   | string   | —         | Text before each number of a number list |
| `suffix`   | string   | `.`       | Text after each number of a number list |
| `indent`   | token/pt | `24pt`    | The width of the marker's column: the words of an item start this far from the list's left edge, at every level |
| `ocg` | string | — | `print` or `screen`: shown only in print, or only on screen. See [Print and screen content](?p=print-and-screen) |

### `li`

One item of a list: a box that holds what a layout holds, beside the item's marker. Its words go in a `text`. It takes the attributes of a [box](?p=xml/elements#column), which go around the marker and the content together, and its `gap` goes between its children: the `gap` of the list unless the item sets one. `data-source` repeats the item once for each entry of the data, and the numbers follow what is made. See [List](?p=doc/layout/list).

### `frame`

Single-child container with padding, border, and background. Always centres its child, so it takes no `gap`, `align` or `justify`, and a second child is an error.

### `code`

Code, or any text whose spaces and lines matter, in a box. The text is kept as it is written: every space, and a new line wherever one is written, except the line break after the start tag and the indent of the line the end tag stands on. A line longer than the box wraps at a space, and a word with none breaks at the last character that fits. The box fills the width, in Courier on a light tint with padding `m`, and splits across pages between lines. Children: `span`, which colors parts of the code. See [Code](?p=doc/layout/code).

| Attribute    | Type    | Default   | Description |
|--------------|---------|-----------|-------------|
| `font`       | string  | `Courier` | Font for the code |
| `font-size`  | token/pt | inherit  | Font size for the code |
| `color`      | color   | inherit   | Color of the code |
| `padding`    | spacing | `m`       | Space between the edge of the box and the code |
| `background` | color   | `#f3f4f6` | The tint of the box |
| `border`, `radius`, `opacity`, `shadow`, `width`, `height` | | | As on a [box](?p=xml/elements#column) |
| `tab-size`   | integer | `4`       | How many columns a tab fills to, 1 to 16 |
| `line-height` | number or token | `1.2` | The distance between lines, as a factor of the font size |
| `widows`, `orphans` | integer | `2` | The fewest lines of the code that may stand alone at the top or the bottom of a page when it splits |
| `paginate`, `debug` | | | As on a box |
| `data-value` | string  | —         | Dot-path to a string that replaces the code, as it is |
| `ocg` | string | — | `print` or `screen`: shown only in print, or only on screen. See [Print and screen content](?p=print-and-screen) |

### `text`

Paragraph or inline text.

| Attribute    | Type    | Default   | Description |
|--------------|---------|-----------|-------------|
| `font`       | string  | inherit, else the document's `font`, or `Helvetica` | Font name |
| `font-size`  | token/pt| inherit, else `m` (11pt) | Font size |
| `color`      | color   | the nearest box's, else `#1a1a1a` | Text color. A text that sets none takes the color of the nearest box that sets one, else the `text` color: a color named `text` in `tokens` changes the default |
| `align`      | string  | `left`    | `left` `center` `right` `justify`. Not inherited: on a box, `align` places the children |
| `width`      | token/pt| —         | Constrain text block width |
| `line-height`| number or token | `1.2` (`m`) | The distance between lines, as a factor of the font size: a number above 0, or a name from the `line-height` row of `tokens` |
| `max-lines`  | integer | —         | The most lines drawn. Only whole lines are drawn, and the rest of the text is dropped. No cap by default: the text wraps whole. See [Capping a text](?p=doc/layout/text#capping-a-text) |
| `ellipsis`   | boolean | `false`   | End the last line drawn in an ellipsis when `max-lines` drops text. With no `max-lines` it changes nothing |
| `role`       | string  | —         | `h1` … `h6`: makes the text a heading, which a [PDF/UA](?p=pdfua) document tags as one. It changes nothing a page shows. A document without `pdfua` ignores it |
| `widows`     | integer | `2`       | The fewest lines, 1 to 10, that a split paragraph may carry to the top of the next page. `1` turns it off |
| `orphans`    | integer | `2`       | The fewest lines, 1 to 10, that a split paragraph may leave at the bottom of a page. `1` turns it off |
| `capture`    | string  | —         | Records the words of this text under a name, for a header or a footer to show. See [Running headers](?p=doc/layout#running-headers) |
| `capture-ref`| string  | —         | In a `region`: shows what was recorded under the name, as of the page the text is on, in place of words of its own |
| `capture-mode` | string | `last`   | With `capture-ref`: `first` or `last`, which of the texts captured on the page it shows |
| `capture-fallback` | string | —     | With `capture-ref`: what it shows until something has been captured in the section |
| `paginate`   | string  | —         | Page breaks: `no` `break-before` `break-after` `keep-next`. See [Page breaks](?p=doc/layout#page-breaks) |
| `debug`      | boolean | false     | Draw the box outline |
| `data-value` | string  | —         | Dot-path to a scalar value that replaces the text |
| `ocg` | string | — | `print` or `screen`: shown only in print, or only on screen. See [Print and screen content](?p=print-and-screen) |

Children: `span` for inline style overrides, `code-span` for a run of code, and `fn` for a footnote.

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

### `code-span`

A run of code inside a `text`: its words in Courier on a light tint, drawn behind them. White space in it collapses as in the text around it, and like a `span` it is not broken inside. See [Code](?p=doc/layout/code#code-in-a-line-of-text).

| Attribute    | Type   | Default   | Description |
|--------------|--------|-----------|-------------|
| `font`       | string | `Courier` | Font override |
| `color`      | color  | the text's | Color override |
| `background` | color  | `#f3f4f6` | The tint behind the words |

### `fn`

A footnote, inside a `text` of the layout. Its place in the text shows a small raised number, and the words it holds go at the bottom of the page where that number lands, under a short rule, in the order of the numbers. It takes no attributes, and holds words and `span` elements. A page with notes has less room for its text, so a line whose note would not fit moves to the next page with it. The numbers start over where `footnote-counter` on the `document` or a `section` says.

Only a `text` of the layout can hold one: an `fn` in a `text-at`, a table or a `region` is an error. See [Footnote](?p=doc/layout/footnote).

### `divider`

Horizontal (or vertical) rule.

| Attribute   | Type    | Default      | Description |
|-------------|---------|--------------|-------------|
| `direction` | string  | `horizontal` | `horizontal` or `vertical` |
| `color`     | color   | `#000000`    | Line color |
| `thickness` | token/pt| `1pt`        | Line thickness. Tokens are border sizes: `xs` 0.5pt up to `xxl` 4pt |
| `debug`     | boolean | false        | Draw the box outline |
| `ocg` | string | — | `print` or `screen`: shown only in print, or only on screen. See [Print and screen content](?p=print-and-screen) |

### `img` (layout)

Inline image.

| Attribute    | Type    | Default | Description |
|--------------|---------|---------|-------------|
| `name`       | string  | —       | **Required.** Asset name |
| `alt`        | string  | —       | What the image shows, which a screen reader reads in a [PDF/UA](?p=pdfua) document; `alt=""` marks it as decoration. A PDF/UA document needs it on each image outside a header or a footer. A document without `pdfua` ignores it |
| `width`      | token/pt/`fill` | — | Width, or `fill`: as wide as the room the image has. Without `height`, the height follows the image's proportions |
| `height`     | token/pt | —      | Height: a length, or a name from the `height` row of `tokens`. With both, they are a maximum: the image is never stretched. With `width="fill"`, a limit |
| `padding`    | spacing | `0`     | Space around the picture, inside the box |
| `background` | color   | —       | Background of the box around the picture |
| `border`     | BorderValue | —   | Border, drawn on the edge of the box |
| `radius`     | token/pt| `0`     | Corner radius: rounds the box, and clips the picture to rounded corners |
| `paginate`   | string  | —       | Page breaks: `no` `break-before` `break-after` `keep-next`. See [Page breaks](?p=doc/layout#page-breaks) |
| `debug`      | boolean | false   | Draw the box outline |
| `ocg` | string | — | `print` or `screen`: shown only in print, or only on screen. See [Print and screen content](?p=print-and-screen) |

`width="fill"` makes the picture as wide as the room it has: the column it is in, what the line of a row leaves after the other children (shared with the other `fill` children), or a table cell. Its height follows its proportions, and a `height` limits it. See [Image](?p=doc/layout/img#fill-the-slot).

An image that sets `padding`, `background` or `border` is a box around its picture: `width` and `height` size the picture, and the box is larger by the padding. With `width="fill"` the box takes the room, and the picture fills what the padding leaves. A `radius` alone clips the picture to rounded corners. See [Image](?p=doc/layout/img#box-around-the-picture).

### `shape`

A rectangle, a circle or an ellipse in the flow, for a status dot, a color swatch or a progress bar. It takes room as an image does, has no children, and is drawn centered in its box. For a shape at a place on the page, use a [layer](?p=doc/layer). See [Shape](?p=doc/layout/shape).

| Attribute      | Type      | Default | Description |
|----------------|-----------|---------|-------------|
| `type`         | string    | —       | **Required.** `rect` `circle` `ellipse` |
| `width`        | token/pt  | —       | Width of a `rect` or an `ellipse`, which need it |
| `height`       | token/pt  | —       | Height of a `rect` or an `ellipse`, which need it: a length, or a name from the `height` row of `tokens` |
| `r`            | pt        | —       | Radius of a `circle`, which needs it. Its box is the square of side `2r` |
| `radius`       | token/pt  | —       | Corner radius of a `rect` |
| `fill`         | color or `gradient:name` | — | Fill: a color, or a [gradient](?p=xml/schema#gradients) that spans the shape |
| `stroke`       | color     | —       | Stroke color |
| `stroke-width` | pt        | —       | Stroke width |
| `stroke-dash`  | string    | —       | Dash pattern: `"4 3"` |
| `opacity`      | 0–1       | `1`     | How opaque the shape is |
| `debug`        | boolean   | false   | Draw the box outline |
| `ocg` | string | — | `print` or `screen`: shown only in print, or only on screen. See [Print and screen content](?p=print-and-screen) |

### `table`

| Attribute   | Type    | Default | Description |
|-------------|---------|---------|-------------|
| `cols`      | string  | —       | **Required.** Column widths, separated by spaces, in `fr`, `pt` or `%`: `"1fr 2fr"`, `"100pt 1fr"` |
| `border`    | BorderValue | —   | Grid lines between and around the cells |
| `stripe`    | color   | —       | Alternating row background |
| `gap`       | token/pt| `0`     | Space between columns and between rows |
| `padding`   | spacing | `0`     | Space between the table's edge and its content. Not cell padding: set it on each `td` |
| `background`| color or `gradient:name` | — | Background behind the whole table. A gradient spans the table |
| `width`     | token/pt| —       | Fixed width |
| `height`    | token/pt/`fill`/`full` | — | A length fixes the height, as a `pt` value or a name from the `height` row of `tokens` |
| `paginate`  | string  | —       | Page breaks: `no` `break-before` `break-after` `keep-next`. See [Page breaks](?p=doc/layout#page-breaks) |
| `debug`     | boolean | false   | Draw the box outline |
| `ocg` | string | — | `print` or `screen`: shown only in print, or only on screen. See [Print and screen content](?p=print-and-screen) |

A table holds an optional `thead` and any number of `tr`.

### `thead` / `tr`

| Attribute   | Type  | Description |
|-------------|-------|-------------|
| `background`| color or `gradient:name` | Row background. A gradient spans the row |
| `keep`      | string | `tr` only. `with-next` keeps the row on the same page as the row after it: a run of such rows and the row that ends it move to the next page together. See [Table](?p=doc/layout/table#keeping-rows-together) |
| `ocg` | string | `print` or `screen`: shown only in print, or only on screen. See [Print and screen content](?p=print-and-screen) |

`thead` repeats at the top of every page. Both hold `td` cells.

### `td`

Takes the shared box attributes, except `width`, which includes `color`, `opacity` and `shadow`. It accepts `paginate`, which has no effect on a cell, since a row never splits. Its own attributes:

| Attribute | Type    | Default | Description |
|-----------|---------|---------|-------------|
| `align`   | string  | fill    | `start` `center` `end`. By default children fill the cell width |
| `valign`  | string  | `top`   | `top` `middle` `bottom` |
| `colspan` | integer | `1`     | How many of the table's columns the cell spans: as wide as them and the gaps between them. A row that spans more columns than `cols` names is an error. See [Table](?p=doc/layout/table#spanning-columns) |
| `rowspan` | integer | `1`     | How many rows the cell spans: as tall as them and the gaps between them, with the rows under it leaving its columns out. The rows it spans stay on one page. A row with a cell too many for the free columns, and a span past the last row, are errors; a `thead` takes no `rowspan`. See [Table](?p=doc/layout/table#spanning-rows) |

### `barcode`

| Attribute   | Type    | Default   | Description |
|-------------|---------|-----------|-------------|
| `type`      | string  | —         | **Required.** `qr` `code128` `ean13` |
| `data`      | string  | —         | **Required.** Barcode data payload |
| `alt`       | string  | —         | What the barcode is for, which a screen reader reads in a [PDF/UA](?p=pdfua) document in place of its data: "QR code to pay this invoice". `alt=""` marks it as decoration. A PDF/UA document needs it on each barcode outside a header or a footer. A document without `pdfua` ignores it |
| `width`     | token/pt| —         | Width. Without `height`, the height follows the barcode's proportions |
| `height`    | token/pt| —         | Height of the whole barcode, with the digits of `hrt` inside it: a length, or a name from the `height` row of `tokens`. With both, they are a maximum: the barcode is never stretched |
| `ec`        | string  | `M`       | QR error correction: `L` `M` `Q` `H` |
| `hrt`       | boolean | false     | Human-readable text below Code128/EAN-13 |
| `data-value`| string  | —         | Dot-path to a scalar value that replaces the data the barcode encodes |
| `color`     | color   | `#000000` | Bar color |
| `background`| color   | —         | Background color |
| `paginate`  | string  | —         | Page breaks: `no` `break-before` `break-after` `keep-next`. See [Page breaks](?p=doc/layout#page-breaks) |
| `debug`     | boolean | false     | Draw the box outline |
| `ocg` | string | — | `print` or `screen`: shown only in print, or only on screen. See [Print and screen content](?p=print-and-screen) |

### `link`

Clickable hyperlink wrapper.

| Attribute | Type    | Description |
|-----------|---------|-------------|
| `href`    | URL     | **Required.** Link target: a URL, or `#id` to jump to the bookmark with that id. Fixed: `data-value` does not change it |
| `gap`     | spacing | Gap between child elements |
| `debug`   | boolean | Draw the box outline |
| `ocg` | string | `print` or `screen`: shown only in print, or only on screen. See [Print and screen content](?p=print-and-screen) |

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
| `height`     | token/pt | —      | Field height: a length, or a name from the `height` row of `tokens` |
| `debug`      | boolean | false   | Draw the box outline |
| `ocg` | string | — | `screen`: shown only on screen. `print` is an error: a field in print content could be filled nowhere. See [Print and screen content](?p=print-and-screen#links-and-form-fields) |

### `region`

Pinned header or footer that repeats across pages. Only allowed directly inside `layout`. `pin` chooses the edge wherever the region is written among the flow, and regions on one edge stack in the order written. In its text, `{page}` is the page number and `{pages}` the total, and a `text` with `capture-ref` shows what the flow captured on its page (see [Running headers](?p=doc/layout#running-headers)).

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
| `font`      | string  | the document's `font`, or `Helvetica` | The font of the `text-at` in the layer that sets none of its own |
| `font-size` | token/pt| `m` (11pt) | The size of the `text-at` in the layer that sets none of its own |
| `color`     | color   | `#1a1a1a` | The color of the `text-at` in the layer that sets none of its own. Defaults to the `text` color |
| `alt`       | string  | —       | In a [PDF/UA](?p=pdfua) document, what the layer shows: a screen reader reads it as one figure at the layer's place. Without it a layer is decoration, which a reader skips with its text |
| `data-if`   | string  | —       | Draw the layer only when the value at the path is truthy |
| `data-if-not` | string | —      | Draw the layer only when the value at the path is falsy |
| `ocg` | string | — | `print` or `screen`: shown only in print, or only on screen. See [Print and screen content](?p=print-and-screen) |

A layer cannot contain another layer.

### `rect`

| Attribute      | Type      | Default | Description |
|----------------|-----------|---------|-------------|
| `x`            | signed pt | —       | X of the left edge (or offset from anchor) |
| `y`            | signed pt | —       | Y of the top edge (or offset from anchor) |
| `width`        | pt        | —       | **Required.** Width |
| `height`       | pt        | —       | **Required.** Height |
| `anchor`       | string    | —       | Reference point |
| `fill`         | color or `gradient:name` | — | Fill: a color, or a [gradient](?p=xml/schema#gradients) that spans the rectangle |
| `stroke`       | color     | —       | Border color |
| `stroke-width` | pt        | `1pt`   | Border width |
| `stroke-dash`  | string    | —       | Dash pattern: `"4 2"` |
| `radius`       | pt        | —       | Corner radius |
| `shadow`       | string    | —       | A hard-edged shadow under the shape: `"x y color"`, with an optional opacity after the color. See [Shadow](?p=doc/layout#shadow) |
| `ocg` | string | — | `print` or `screen`: shown only in print, or only on screen. See [Print and screen content](?p=print-and-screen) |

### `circle`

| Attribute      | Type      | Default | Description |
|----------------|-----------|---------|-------------|
| `x`            | signed pt | —       | X of the left edge of the circle's box, the square of side 2`r` around it (or offset from anchor) |
| `y`            | signed pt | —       | Y of the top edge of the circle's box (or offset from anchor) |
| `r`            | pt        | —       | **Required.** Radius |
| `anchor`       | string    | —       | Reference point |
| `fill`         | color or `gradient:name` | — | Fill: a color, or a [gradient](?p=xml/schema#gradients) that spans the circle's box |
| `stroke`       | color     | —       | Border color |
| `stroke-width` | pt        | `1pt`   | Border width |
| `stroke-dash`  | string    | —       | Dash pattern |
| `shadow`       | string    | —       | A hard-edged shadow under the shape: `"x y color"`, with an optional opacity after the color |
| `ocg` | string | — | `print` or `screen`: shown only in print, or only on screen. See [Print and screen content](?p=print-and-screen) |

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
| `ocg` | string | — | `print` or `screen`: shown only in print, or only on screen. See [Print and screen content](?p=print-and-screen) |

### `path`

| Attribute      | Type    | Default   | Description |
|----------------|---------|-----------|-------------|
| `d`            | string  | —         | **Required.** SVG path data |
| `fill`         | color or `gradient:name` | — | Fill: a color, or a [gradient](?p=xml/schema#gradients) that spans the path's bounding box |
| `stroke`       | color   | —         | Stroke color |
| `fill-rule`    | string  | `nonzero` | `nonzero` `evenodd` |
| `stroke-width` | pt      | `1pt`     | Stroke width |
| `stroke-dash`  | string  | —         | Dash pattern |
| `line-cap`     | string  | `butt`    | `butt` `round` `square` |
| `ocg` | string | — | `print` or `screen`: shown only in print, or only on screen. See [Print and screen content](?p=print-and-screen) |

### `text-at`

Text at a fixed place. It is the layout's `text`: `max-lines`, `ellipsis` and `line-height` are the layout text's attributes, with `text-at`'s own defaults (one line, and a `width` above 1). Its font, size and color default to its layer's. Children: `span`, as in `text`.

| Attribute     | Type      | Default     | Description |
|---------------|-----------|-------------|-------------|
| `x`           | signed pt | —           | X of the left edge of the box (or offset from anchor) |
| `y`           | signed pt | —           | Y of the top edge of the box (or offset from anchor) |
| `anchor`      | string    | —           | Reference point |
| `width`       | pt        | —           | Width of the box. Without it the text is one line at its natural width |
| `max-lines`   | integer   | `1`         | The most lines drawn. Above 1 it needs a `width` |
| `ellipsis`    | boolean   | `false`     | End the last line drawn in an ellipsis when the text does not fit |
| `line-height` | number or token | `1.2` (`m`) | The distance between lines, as a factor of the font size: a number above 0, or a name from the `line-height` row of `tokens` |
| `font`        | string    | the layer's `font`, else the document's, or `Helvetica` | Font name |
| `font-size`   | token/pt  | the layer's, else `m` (11pt) | Font size |
| `bold`        | boolean   | `false`     | The bold face of a built-in font |
| `color`       | color     | the layer's, else `#1a1a1a` | Text color. A color named `text` in `tokens` changes the default |
| `align`       | string    | `left`      | `left` `center` `right` `justify`, within `width` |
| `data-value`  | string    | —           | Dot-path to a value that replaces the text |
| `ocg` | string | — | `print` or `screen`: shown only in print, or only on screen. See [Print and screen content](?p=print-and-screen) |

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
| `ocg` | string | — | `print` or `screen`: shown only in print, or only on screen. See [Print and screen content](?p=print-and-screen) |

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
| `ocg` | string | — | `print` or `screen`: shown only in print, or only on screen. See [Print and screen content](?p=print-and-screen) |

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
