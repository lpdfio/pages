# Code

Code, or any text whose spaces and lines matter, in a box. A `code` keeps its text as it is written: every space, and a new line wherever one is written. The box fills the width, grows with its lines, and is set in Courier on a light tint with padding, which the attributes change.

```xml
<code>
fn main() {
    let items = [3, 5, 8];
    let total: i32 = items.iter().sum();

    println!("total = {}", total);
}
</code>
```

The line break after the start tag and the indent of the line the end tag stands on are not part of the code, so the tags can stand on lines of their own, as `<pre>` does in HTML. Everything between them is kept, the blank lines too. A `code` on one line, `<code>let x = 1;</code>`, is its text as it is.

A `code` is a [column](?p=doc/layout/column) around one text, so it takes the attributes of a box: `font`, `font-size` and `color` set the text inside, and `padding`, `background`, `border`, `radius`, `opacity` and `shadow` draw the box.

Code is XML, so write `<` and `&` as `&lt;` and `&amp;`, or put the whole code in a CDATA section, which keeps it as it is. A `span` cannot stand inside a CDATA section.

```xml
<code><![CDATA[
if a < b && c {
    let values: Vec<i32> = vec![];
}
]]></code>
```

## Attributes

| Attribute    | Type     | Default | Description |
|--------------|----------|---------|-------------|
| `font`       | string   | `Courier` | Font name declared in `assets`. Use a monospace font, since columns line up only in one |
| `font-size`  | token/pt | inherit, else `m` (11pt) | `xs` `s` `m` `l` `xl` `xxl` or `9pt` |
| `color`      | color    | the nearest box's, else `#1a1a1a` | Text color |
| `padding`    | spacing  | `m` (8pt) | Space between the edge of the box and the code |
| `background` | color    | `#f3f4f6` | The tint of the box. `gradient:name` also works |
| `border`     | string   | —       | `1pt #c8ccd2`: a width and a color |
| `radius`     | token/pt | —       | Rounded corners |
| `opacity`    | number   | `1`     | How opaque the box and the code in it are, from 0 to 1. See [Opacity](?p=doc/layout#opacity) |
| `shadow`     | string   | —       | A hard-edged shadow. See [Shadow](?p=doc/layout#shadow) |
| `width`      | token/pt | fills the width | The width of the box |
| `height`     | token/pt | the lines of the code | A height stops the box splitting across pages |
| `tab-size`   | integer  | `4`     | How many columns a tab fills to, 1 to 16. See [Tabs](#tabs) |
| `line-height` | number or token | `1.2` (`m`) | The distance between lines, as a factor of the font size |
| `widows`     | integer  | `2`     | The fewest lines, 1 to 10, that a split code may carry to the top of the next page |
| `orphans`    | integer  | `2`     | The fewest lines, 1 to 10, that a split code may leave at the bottom of a page |
| `paginate`   | string   | —       | Page breaks: `no` `break-before` `break-after` `keep-next`. See [Page breaks](?p=doc/layout#page-breaks) |
| `debug`      | boolean  | `false` | Draw the box outline |
| `data-value` | string   | —       | Dot-path: replaces the code with the bound value, with its spaces and lines. See [Code from data](#code-from-data) |
| `data-if`, `data-if-not`, `data-source` | string | — | Leave the box out, or repeat it for each item of a list |
| `ocg` | string | — | `print` or `screen`: shown only in print, or only on screen. See [Print and screen content](?p=print-and-screen) |

## Words in color

A `span` in a `code` colors a stretch of it, and keeps its spaces. `font`, `color`, `bold`, `href`, `underline` and `strike` are the attributes of [a span in a text](?p=doc/layout/text#inline-spans-for-mixed-styling). The engine knows no language: the keywords and strings are the ones you wrap, or the ones your own highlighter does.

```xml
<code>
<span color="#c0392b">fn</span> <span color="#7d3c98">greeting</span>(name: <span color="#7d3c98">&amp;str</span>) -> <span color="#7d3c98">String</span> {
    <span color="#c0392b">let</span> text = <span color="#1e8449">"hello, "</span>.to_string() + name;
    <span color="#c0392b">return</span> text;
}
</code>
```

## Long lines wrap

A line longer than the box wraps. It breaks at a space, and the next line starts at the left edge. A word with no space in it that is longer than a whole line, such as an address, breaks at the last character that fits and goes on in the next line, so nothing is cut off and nobody has to add line breaks. A short word that does not fit what is left of its line moves down whole.

```xml
<code width="300pt">
// A comment that is longer than the box wraps at a space, and the next line starts at the left edge.
let url = "https://example.com/documents/2026/10/25/a-very-long-address-with-no-space-in-it-at-all/index.html";
</code>
```

## Tabs

A tab fills to the next multiple of `tab-size` columns, counted in characters from the start of the line, as an editor does. The default is 4. A tab at the start of a line is `tab-size` spaces.

```xml
<column gap="s">
  <code>
name	value
a	1
bcd	2
  </code>
  <code tab-size="8">
name	value
a	1
bcd	2
  </code>
</column>
```

## A look of its own

```xml
<code font-size="s" background="#ffffff" border="1pt #c8ccd2" radius="m" padding="l">
SELECT name, total
  FROM invoices
 WHERE total &gt; 100
 ORDER BY total DESC;
</code>
```

## Across pages

A `code` splits between lines when it is longer than the page, as a [text](?p=doc/layout/text#widows-and-orphans) does. Each part is drawn in a box of its own, with the padding at its top and its bottom, so the tint and the padding stay inside the margins. A line that wrapped stays together unless the page ends inside it, and `widows` and `orphans` keep at least two lines of the code together at a break. `paginate="no"` and a `height` keep the box whole.

## Code from data

`data-value` fills the code with a string from the data, as it is: its spaces, its lines and its tabs. A newline that ends the string only ends its last line.

```xml
<code data-value="snippet">fallback code</code>
```

## Code in a line of text

A `code-span` inside a [`text`](?p=doc/layout/text) is the same look in a line: its words in Courier, on a tint behind them.

| Attribute    | Type   | Default   | Description |
|--------------|--------|-----------|-------------|
| `font`       | string | `Courier` | Font name |
| `color`      | color  | the text's | Text color |
| `background` | color  | `#f3f4f6` | The tint drawn behind the words |

```xml
<text>Run <code-span>cargo test</code-span> before you push, and open <code-span>README.md</code-span>. One has colors of its own: <code-span color="#ffffff" background="#1763cf">white on blue</code-span>.</text>
```

Like a `span`, a `code-span` is not broken inside, so it goes to the next line whole, and a run longer than a whole line breaks at the last character that fits, so nothing runs past the box. White space in it collapses as in the text around it. A `code-span` is not allowed in a `code`, which keeps its own spaces.
