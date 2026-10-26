# List

A list of items, each marked with a bullet or a number that the engine writes. A `list` holds `li` items, an item holds what a layout holds, and a list inside an item is a list under it. Nothing is numbered by hand: add an item and the numbers after it change.

```xml
<list>
  <li><text>Rinse the rice until the water runs clear.</text></li>
  <li><text>Cover it with twice its volume of water.</text></li>
  <li><text>Cook it for fifteen minutes, then let it stand.</text></li>
</list>
```

The words of an item go in a [`text`](?p=doc/layout/text). A long item wraps under its own words, not under the marker, and splits across pages like any text: the marker stays with the first part, and the lines after the break stand under the words. A list splits between its items, and inside an item as the text in it does.

## Attributes

| Attribute    | Type     | Default | Description |
|--------------|----------|---------|-------------|
| `type`       | string   | `bullet` | `bullet` marks each item with a shape, `number` with a number |
| `bullet`     | string   | by depth | The shape of a bullet list: `disc` `circle` `square` `dash`. See [Bullets](#bullets) |
| `format`     | string   | `decimal` | How a number list writes its numbers: `decimal` `lower-alpha` `upper-alpha` `lower-roman` `upper-roman`. See [Numbers](#numbers) |
| `start`      | integer  | `1`     | The number of a number list's first item |
| `prefix`     | string   | —       | Text before each number: `(` |
| `suffix`     | string   | `.`     | Text after each number: `)` |
| `indent`     | token/pt | `24pt`  | The width of the marker's column. See [Indent](#indent) |
| `gap`        | token/pt | —       | Space between the items |
| `font`, `font-size`, `color` | | inherit | Set the text inside and the markers, as on a [box](?p=doc/layout/column) |
| `padding`, `background`, `border`, `radius`, `opacity`, `shadow`, `width`, `height` | | | As on a [box](?p=doc/layout/column) |
| `paginate`, `debug` | | | As on a box |
| `data-source`, `data-if`, `data-if-not`, `data-color`, `data-background` | string | — | As on a box |

An `li` takes the attributes of a box too, other than `width`: `padding`, `background`, `border` and `radius` go around the marker and the words together, and `gap` goes between the children of the item: the `gap` of the list, so a text and the list under it are spaced like two items, unless the item sets its own. Its `data-source` repeats the item once for each entry of the data.

## Bullets

A bullet is drawn as a shape, so it looks the same in every font, and takes the color and size of the first text of its item. Without a `bullet` a list uses a disc, a list inside a bullet list a circle, and one inside that a square, then the three again. A number list between them is not a level.

```xml
<list>
  <li>
    <text>A disc at the top level.</text>
    <list>
      <li>
        <text>A circle one level down.</text>
        <list>
          <li><text>A square one level further.</text></li>
        </list>
      </li>
    </list>
  </li>
</list>
```

`bullet` sets the shape of a list, whatever its depth. A dash is a bullet like the others.

```xml
<list bullet="dash">
  <li><text>Notes under an invoice</text></li>
  <li><text>Release notes</text></li>
</list>
```

## Numbers

`type="number"` numbers the items from 1. The `format` is how a number is written, and `start` is where a list begins, which is how a list that something cut in two goes on.

| `format`      | Writes |
|---------------|--------|
| `decimal`     | 1, 2, 3 |
| `lower-alpha` | a, b, c, then aa, ab |
| `upper-alpha` | A, B, C |
| `lower-roman` | i, ii, iii |
| `upper-roman` | I, II, III |

A number that a letter or a numeral cannot write, one below 1, and one above 3999 for a numeral, is written in decimal.

```xml
<column gap="m">
  <list type="number">
    <li><text>Decimal, which is the default.</text></li>
    <li><text>The second item.</text></li>
  </list>
  <list type="number" format="lower-roman" start="3">
    <li><text>Numerals, from three.</text></li>
    <li><text>Four.</text></li>
  </list>
</column>
```

`prefix` and `suffix` write what stands around a number. A full stop follows it unless `suffix` says otherwise, so `suffix=")"` writes `a)`, and with `prefix="("` too, `(a)`.

```xml
<list type="number" format="lower-alpha" prefix="(" suffix=")">
  <li><text>The first part of the clause.</text></li>
  <li><text>The second part.</text></li>
</list>
```

A number is set at the right of its column, so `9.` and `10.` end together. The numbers follow the items that are there once the data is in: an item that `data-if` leaves out takes no number.

## Nested lists

A list inside an item starts where the words of the item start, and its numbers start over. The nesting has no limit but the width of the page, which each level takes `indent` from.

```xml
<list type="number">
  <li>
    <text>The supplier delivers the goods to the address in the order.</text>
    <list type="number" format="lower-alpha" prefix="(" suffix=")">
      <li><text>Delivery takes place on a weekday between nine and five.</text></li>
      <li>
        <text>The buyer signs for the goods, and the supplier may refuse delivery when:</text>
        <list type="number" format="lower-roman" prefix="(" suffix=")">
          <li><text>nobody is at the address to sign, or</text></li>
          <li><text>the person who signs is not of age.</text></li>
        </list>
      </li>
    </list>
  </li>
  <li><text>Risk passes to the buyer on delivery.</text></li>
</list>
```

## Indent

`indent` is the width of the marker's column, and so how far the words of an item stand from the left edge of the list. A list inside an item starts there, so every level takes the same. A marker that is wider than the column, such as `VIII.`, is not made to fit: give the list an `indent` that has room for it.

```xml
<list type="number" format="upper-roman" start="8" indent="32pt">
  <li><text>Eight</text></li>
  <li><text>Nine</text></li>
  <li><text>Ten</text></li>
</list>
```

## An item that is a box

An `li` takes the box attributes, so an item can be a card.

```xml
<list gap="s">
  <li background="#eef3fc" padding="8pt" radius="4pt">
    <text font="Helvetica-Bold">A tinted item.</text>
    <text>A second paragraph in the same item, under the first, with the marker beside the first line only.</text>
  </li>
  <li><text>An item with no box.</text></li>
</list>
```

## Items from data

`data-source` on an `li` makes one item for each entry of a list in the data, and the numbers of a number list follow what it makes.

```xml
<list type="number">
  <li data-source="clauses"><text data-value="text">A clause</text></li>
</list>
```
