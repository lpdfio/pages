# Chart

A chart drawn from numbers, written like a table: `series` are its columns, each `category` a row and each `value` a cell, a value for each series in the series' order. A chart with one series needs no `series`. It takes its box in the flow as an [image](?p=doc/layout/img) does, and the engine draws its axis, its steps, its labels and its legend by fixed rules, so a chart has few attributes and no styling language.

```xml
<column gap="s" paginate="no">
  <text font-size="l" bold="true">Revenue</text>
  <chart type="bar" height="160pt" prefix="$">
    <category label="Jan"><value>41200</value></category>
    <category label="Feb"><value>38900</value></category>
    <category label="Mar"><value>44100</value></category>
  </chart>
</column>
```

The engine draws a value axis on the left, from zero in round steps, `$0`, `$10,000` up to `$50,000`, with a light gridline at each, a bar for each category with its label under it, and no legend, since there is one series. There is no title attribute: a `text` above the chart is its title, and `paginate="no"` on the column keeps the two on one page.

## Attributes

| Attribute        | Type         | Default | Description |
|------------------|--------------|---------|-------------|
| `type`           | string       | —       | **Required.** The kind of chart: `bar` |
| `height`         | token/length | —       | **Required.** Height of the whole chart: a length, or a name from the `height` row of [tokens](?p=xml/schema#tokens). The axis, the labels and the legend take room inside it and the width, and the bars get the rest |
| `width`          | token/length | `fill`  | Width of the whole chart |
| `direction`      | string       | `vertical` | `vertical`, or `horizontal`, which lists the categories down the left side. See [Horizontal bars](#horizontal-bars) |
| `stacked`        | boolean      | false   | Stacks the bars of a category. See [Stacked bars](#stacked-bars) |
| `prefix`, `suffix` | string     | —       | Written around every number of the chart: `$`, `%`, ` ms`. See [Numbers](#numbers) |
| `decimals`       | 0–6          | as written | The decimals of the value labels |
| `min`, `max`     | number       | —       | A number the value axis reaches at least. They only widen it. See [The axis and the labels](#the-axis-and-the-labels) |
| `thousands-mark` | string       | `,`     | One character between the groups of three digits, or empty for none |
| `decimal-mark`   | string       | `.`     | One character before the decimals |
| `gap`            | token/length | `s`     | The space between the bars, the axis labels and the legend |
| `bar-gap`        | token/length | a tenth of a bar | The space between the bars of one category |
| `category-gap`   | token/length | a quarter of a category | The space between categories |
| `legend`         | string       | `bottom` with two series, `none` with one | `bottom`, `top`, `right` or `none` |
| `value-labels`   | boolean      | false   | Writes each value at the end of its bar |
| `font`, `font-size`, `color` | | the text's around it | The chart's text: its labels, steps and legend, and the color of its zero line |
| `alt`            | string       | —       | What the chart shows, for a [tagged document](?p=pdfua). See [Accessibility](#accessibility) |

A `series` takes `label`, its entry in the legend, and `color`, its bars'. A `category` takes `label`, written by its bars, and `color`, the color of its bar in a chart of one series. A `value` is a plain number, such as `41200`, `-3.5` or `0.25`, and an empty `<value/>` is no value: no bar. All three take `data-source`, `data-if` and `data-if-not`, `series` and `category` `data-label` and `data-color`, and `value` `data-value`. See [From the data](#from-the-data).

## Bars side by side

Two series, revenue and costs, put two bars in each quarter, and a legend under the chart.

```xml
<chart type="bar" height="180pt" prefix="$">
  <series label="Revenue" color="#1763cf"/>
  <series label="Costs" color="#adb5bd"/>
  <category label="Q1"><value>120000</value><value>95000</value></category>
  <category label="Q2"><value>131000</value><value>97000</value></category>
  <category label="Q3"><value>128000</value><value>101000</value></category>
</chart>
```

## Stacked bars

With `stacked="true"`, the bars of a category stand on each other in the order of the series, and the axis runs to the largest total. With `value-labels`, the total of each stack is written at its end. A stacked value can't be negative.

```xml
<chart type="bar" stacked="true" height="180pt" prefix="$" value-labels="true">
  <series label="Europe"/>
  <series label="Americas"/>
  <series label="Asia"/>
  <category label="Q1"><value>52000</value><value>41000</value><value>27000</value></category>
  <category label="Q2"><value>55000</value><value>43000</value><value>30000</value></category>
</chart>
```

## Horizontal bars

`direction="horizontal"` lists the categories down the left side, which suits long labels, and puts the value axis along the bottom. The labels take a column as wide as the longest, a third of the chart's width at most.

```xml
<chart type="bar" direction="horizontal" height="160pt" value-labels="true">
  <category label="Standing desk"><value>1840</value></category>
  <category label="Ergonomic chair with adjustable arms"><value>1525</value></category>
  <category label="Monitor arm"><value>990</value></category>
  <category label="Desk lamp"><value>620</value></category>
</chart>
```

A negative value takes the axis below zero and draws a zero line, so a change can grow to the right and shrink to the left:

```xml
<chart type="bar" direction="horizontal" height="140pt" suffix="%" decimals="2" value-labels="true"
       alt="Change in instructions per fixture since the last release">
  <category label="xs" color="#737373"><value>0.12</value></category>
  <category label="m" color="#c0392b"><value>4.1</value></category>
  <category label="svg" color="#737373"><value>-2.3</value></category>
</chart>
```

## From the data

`data-source` repeats a `category` for each item of a list, as it repeats any element, and `data-label` sets its `label` from the item. With no data, the chart renders as written: one bar for Jan.

```xml
<chart type="bar" height="160pt" prefix="$">
  <category data-source="months" label="Jan" data-label="name">
    <value data-value="revenue">41200</value>
  </category>
</chart>
```

```json
{
  "months": [
    { "name": "Jan", "revenue": 41200 },
    { "name": "Feb", "revenue": 38900 },
    { "name": "Mar", "revenue": 44100 }
  ]
}
```

The number of series can come from the data too: `data-source` on `series` repeats a series for each item, and on `value` repeats a category's values from a list, in the same order. One template then compares two builds or three:

```xml
<chart type="bar" height="180pt">
  <series data-source="builds" label="Build" data-label="name"/>
  <category data-source="fixtures" label="xs" data-label="name">
    <value data-source="counts" data-value="instructions">0</value>
  </category>
</chart>
```

```json
{
  "builds": [{ "name": "v0.37.0" }, { "name": "branch" }],
  "fixtures": [
    { "name": "xs", "counts": [{ "instructions": 3781398 }, { "instructions": 3790112 }] },
    { "name": "s", "counts": [{ "instructions": 9120455 }, { "instructions": 9101230 }] }
  ]
}
```

- A value from the data is a number, or a string that is a plain number. `null` and a missing key are no value: no bar. Anything else is an error that names the path, such as `<value data-value="amount">: '41,200' is not a plain number`.
- `data-label` takes a string or a number, so a year or a week number of the data is a label as it is.
- `data-color` sets the `color` of a series or a category: a script that writes the data can mark a bar red.
- A category holds a value for each series, after the data is bound. One with more or fewer is an error that names it: `category 'Q1' has 1 value, and the chart has 2 series`. The order of the values is the data's to keep.
- `data-if` and `data-if-not` on an element with `data-source` are read once, before the list, as everywhere. See [Combining attributes](?p=data/binding#combining-attributes).

## The axis and the labels

- **The value axis** starts at zero and runs in about five round steps, each 1, 2 or 5 times a power of ten, with a light gridline at each. Fewer steps are drawn where their labels would crowd.
- **A negative value** takes the axis below zero, and a zero line is drawn in the chart's `color`.
- **`min` and `max`** only widen the axis: `max="100"` makes it reach 100 at least, for percentages, or for charts meant to be compared side by side, and a value past them still fits. No bar is cut off, and none starts above zero.
- **A category label** wider than its room wraps at spaces onto three lines at most, and what still doesn't fit ends in an ellipsis, so a chart always renders.
- **The legend** lists each series with its label and its color: under the chart with two series or more, and none with one, unless `legend` places it.

## Numbers

The steps of the axis and the value labels are numbers the engine writes. The marks are `thousands-mark` and `decimal-mark`, with `prefix` and `suffix` around the number, and any style is two characters: `thousands-mark="." decimal-mark=","` writes `1.234,5`, and a space for `thousands-mark` writes `1 234,5`. The two marks the same are an error.

```xml
<chart type="bar" height="140pt" thousands-mark="." decimal-mark="," suffix=" €" value-labels="true">
  <category label="North"><value>1250.5</value></category>
  <category label="South"><value>980.25</value></category>
</chart>
```

- **The steps are written in full**, `$100,000`, never short as `$100k`. A short axis comes from the data: values in thousands and `suffix="k"` write `$412k` on the steps and the value labels alike, in any language's abbreviation.
- **A value label** has the decimals of `decimals`, else the decimals the value was written with: `4.10` writes `4.10`. It rounds half up, so `72.25` with one decimal is `72.3`. The steps take the decimals their size needs.

## Colors and spacing

Without `color`, the series take a fixed palette of eight in order, and it starts over past the eighth. `color` takes a color or a name from the document's [colors](?p=xml/schema#colors), on a series, or on a category in a chart of one series, as `data-color` does from the data.

`gap`, `bar-gap` and `category-gap` set the room, and `legend` picks one of fixed places:

```xml
<chart type="bar" height="150pt" legend="top" bar-gap="2pt" category-gap="30pt">
  <series label="2025"/>
  <series label="2026"/>
  <category label="Orders"><value>410</value><value>455</value></category>
  <category label="Returns"><value>39</value><value>31</value></category>
</chart>
```

A chart is a leaf, as an image is: it takes no `padding`, `background` or `border`. A `column` around it gives them.

## Pages

A chart never splits across pages. When it doesn't fit, it moves whole to the next page, and one taller than a page is cut at its bottom. Its title is a `text` of its own, which could stay behind at the foot of a page: `paginate="no"` on a `column` that holds both keeps them together, as in the first example.

## Accessibility

In a tagged document, with [`pdfua`](?p=pdfua) or a `pdfa` of [level a](?p=pdfa#level-a), a chart is one figure with its `alt`, which says what the chart shows: `alt="Revenue per month, highest in March"`. `alt=""` marks it as decoration. A PDF/UA document needs it on each chart outside a header or a footer, and refuses a chart without it.

## Limits

A chart holds 10,000 categories and 100 series at most, counted after the data is bound. More is an error that names the limit and the list: `a chart holds 10,000 categories at most; the data of 'fixtures' gives 50,000`. A chart at both limits renders inside the render's [time limit](?p=install#time-limit).
