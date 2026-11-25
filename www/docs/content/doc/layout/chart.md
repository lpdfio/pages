# Chart

A chart drawn from numbers, written like a table: `series` are its columns, each `category` a row and each `value` a cell, a value for each series in the series' order. A chart with one series needs no `series`. It takes its box in the flow as an [image](?p=doc/layout/img) does, and the engine draws its axis, its steps, its labels and its legend by fixed rules, so a chart has few attributes and no styling language. It draws bars, [lines](#lines), [areas](#areas) and [sparklines](#sparklines).

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
| `type`           | string       | —       | **Required.** The kind of chart: `bar`, `line`, `area` or `sparkline` |
| `height`         | token/length | —       | **Required.** Height of the whole chart: a length, or a name from the `height` row of [tokens](?p=xml/schema#tokens). The axis, the labels and the legend take room inside it and the width, and the plot gets the rest |
| `width`          | token/length | `fill`  | Width of the whole chart |
| `direction`      | string       | `vertical` | Bars only: `vertical`, or `horizontal`, which lists the categories down the left side. See [Horizontal bars](#horizontal-bars) |
| `stacked`        | boolean      | false   | Bars and areas only: stacks the bars of a category, or the areas of the series. See [Stacked bars](#stacked-bars) and [Areas](#areas) |
| `prefix`, `suffix` | string     | —       | Written around every number of the chart: `$`, `%`, ` ms`. See [Numbers](#numbers) |
| `decimals`       | 0–6          | as written | The decimals of the value labels |
| `min`, `max`     | number       | —       | A number the value axis reaches at least. They only widen it. See [The axis and the labels](#the-axis-and-the-labels) |
| `thousands-mark` | string       | `,`     | One character between the groups of three digits, or empty for none |
| `decimal-mark`   | string       | `.`     | One character before the decimals |
| `gap`            | token/length | `s`     | The space between the plot and its step labels, its category labels and its legend |
| `bar-gap`        | token/length | a tenth of a bar | The space between the bars of one category |
| `category-gap`   | token/length | a quarter of a category | The space between categories |
| `legend`         | string       | `bottom` with two series, `none` with one | `bottom`, `top`, `right` or `none` |
| `value-labels`   | boolean      | false   | Writes each value at the end of its bar or over its point |
| `stroke-width`   | length       | `1.5pt`, `1pt` for a sparkline | The width of every line of a line, an area or a sparkline. `0` draws none, so an area is its fill alone |
| `font`, `font-size`, `color` | | the text's around it | The chart's text: its labels, steps and legend, and the color of its zero line. A sparkline, which has no text, draws its line in `color` |
| `alt`            | string       | —       | What the chart shows, for a [tagged document](?p=pdfua). See [Accessibility](#accessibility) |

A `series` takes `label`, its entry in the legend, and `color`, its bars', line's or area's. A `category` takes `label`, written by its bars or under its point, and `color`, the color of its bar in a bar chart of one series. A `value` is a plain number, such as `41200`, `-3.5` or `0.25`, and an empty `<value/>` is no value: no bar, and a gap in a line. All three take `data-source`, `data-if` and `data-if-not`, `series` and `category` `data-label` and `data-color`, and `value` `data-value`. See [From the data](#from-the-data).

`direction` is for bars, and `stacked` for bars and areas: on another kind each is an error that names it, such as `direction is for a bar chart, and this is a line chart`.

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

## Lines

`type="line"` draws a line through the values of each series, a point at the middle of each category. Visits per week, this year against last:

```xml
<chart type="line" height="170pt">
  <series label="This year" color="primary"/>
  <series label="Last year" color="text-muted"/>
  <category label="W1"><value>1210</value><value>1005</value></category>
  <category label="W2"><value>1340</value><value>980</value></category>
  <category label="W3"><value>1285</value><value/></category>
  <category label="W4"><value>1502</value><value>1100</value></category>
  <category label="W5"><value>1460</value><value>1150</value></category>
  <category label="W6"><value>1620</value><value>1090</value></category>
</chart>
```

- **The axis fits the values**: it runs from a round step under the lowest to one over the highest. A point is read by its height, and on an axis from zero a line far from it comes out flat. The axis doesn't cross zero where the values don't, so a count never shows below it, and `min="0"` brings it down to zero.
- **A missing value breaks the line**: an empty `<value/>`, or `null` in the data, ends the line at the point before, and it starts again at the point after, so the reader sees the gap. A value with no value next to it, on either side, is a dot.
- **The labels** under the plot are every one where they all fit on one line, and else every 2nd, 3rd or 5th, starting with the first: the smallest step at which they fit. Every point keeps its place, so thirty days in 300pt write `Nov 1`, `Nov 6`, `Nov 11` and on. A label still too wide on its own wraps and shortens, as on bars.
- **`stroke-width`** sets the width of every line, `1.5pt` by default. Which line is the current one and which the comparison is told by the series' `color`.
- **`value-labels`** writes each value over its point.

A share price between $98.40 and $103.95, on an axis from $98 to $104, with its values written:

```xml
<chart type="line" height="150pt" prefix="$" decimals="2" value-labels="true" stroke-width="2pt">
  <category label="Mon"><value>98.40</value></category>
  <category label="Tue"><value>101.15</value></category>
  <category label="Wed"><value>99.80</value></category>
  <category label="Thu"><value>103.95</value></category>
  <category label="Fri"><value>102.30</value></category>
</chart>
```

## Areas

`type="area"` draws the line of each series and fills it down to zero, faded so that the gridlines, and an area behind it, show through. Its axis keeps zero, as an axis of bars does. With `stacked="true"`, each series is filled down to the one under it, and the axis runs to the largest total: the parts of a whole over time.

```xml
<chart type="area" stacked="true" height="170pt" suffix=" GB" value-labels="true">
  <series label="Images"/>
  <series label="Documents"/>
  <series label="Backups"/>
  <category label="Jan"><value>120</value><value>40</value><value>65</value></category>
  <category label="Feb"><value>132</value><value>44</value><value>70</value></category>
  <category label="Mar"><value>141</value><value/><value>72</value></category>
  <category label="Apr"><value>150</value><value>51</value><value>80</value></category>
</chart>
```

- **A missing value** breaks an area that isn't stacked, as it breaks a line. In a stacked area it counts as zero, so the series above still sit on something: in March, the backups sit on the images.
- **A stacked value** can't be negative, and with `value-labels` a stacked area writes the total of each category over its top.
- **The labels** under the plot skip as a line's do.
- **`stroke-width="0"`** draws no line: the area is its fill alone.

## Sparklines

`type="sparkline"` draws one small line through its whole box, with no axis, no labels and no legend, for a table cell: the first value at the left edge and the last at the right, the lowest at the bottom and the highest at the top. The trend of the last weeks, for each product:

```xml
<table cols="2fr 1fr 80pt">
  <tr data-source="products">
    <td><text data-value="name">Product</text></td>
    <td><text data-value="total" align="right">0</text></td>
    <td>
      <chart type="sparkline" height="14pt">
        <category data-source="weeks">
          <value data-value="sales">0</value>
        </category>
      </chart>
    </td>
  </tr>
</table>
```

```json
{
  "products": [
    { "name": "Desk lamp", "total": "1,284", "weeks": [{ "sales": 80 }, { "sales": 91 }, { "sales": 88 }, { "sales": 131 }] },
    { "name": "Standing desk", "total": "412", "weeks": [{ "sales": 60 }, { "sales": null }, { "sales": 41 }, { "sales": 22 }] }
  ]
}
```

`weeks` is read from each product, as paths inside a `data-source` are.

- **One series.** A sparkline takes no `series`: one is an error that names it, `a sparkline has one series, and takes no <series>`.
- **Its color** is the chart's own `color`, since a sparkline has no text: `color="text-muted"`. Without it, the line is the palette's first color, whatever the color of the text around it. `stroke-width` sets its width, `1pt` by default.
- **`min` and `max`** widen it as they widen an axis: the same `min="0" max="150"` on each sparkline of a table draws them all on one scale.
- **A missing value** breaks it, as it breaks a line.

```xml
<chart type="sparkline" height="40pt" width="160pt" color="text-muted" stroke-width="2pt" min="0">
  <category><value>3</value></category>
  <category><value>7</value></category>
  <category><value>4</value></category>
  <category><value>9</value></category>
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

- A value from the data is a number, or a string that is a plain number. `null` and a missing key are no value: no bar, and a gap in a line. Anything else is an error that names the path, such as `<value data-value="amount">: '41,200' is not a plain number`.
- `data-label` takes a string or a number, so a year or a week number of the data is a label as it is.
- `data-color` sets the `color` of a series or a category: a script that writes the data can mark a bar red.
- A category holds a value for each series, after the data is bound. One with more or fewer is an error that names it: `category 'Q1' has 1 value, and the chart has 2 series`. The order of the values is the data's to keep.
- `data-if` and `data-if-not` on an element with `data-source` are read once, before the list, as everywhere. See [Combining attributes](?p=data/binding#combining-attributes).

## The axis and the labels

- **The value axis** of bars and areas starts at zero, and a line's fits its values (see [Lines](#lines)). It runs in about five round steps, each 1, 2 or 5 times a power of ten, with a light gridline at each. Fewer steps are drawn where their labels would crowd.
- **A negative value** takes the axis below zero, and a zero line is drawn in the chart's `color`.
- **`min` and `max`** only widen the axis: `max="100"` makes it reach 100 at least, for percentages, or for charts meant to be compared side by side, and a value past them still fits. No bar is cut off, and none starts above zero. On a line, `min="0"` brings the axis down to zero.
- **A category label** wider than its room wraps at spaces onto three lines at most, and what still doesn't fit ends in an ellipsis, so a chart always renders.
- **The legend** lists each series with its label and its color: under the chart with two series or more, and none with one, unless `legend` places it. A sparkline has none. Under or above the chart it takes half its height at most, and at the right its height and a third of its width: the entries that don't fit give way to an ellipsis.
- **In a horizontal chart**, a category thinner than a line of text has no label, so the labels don't run into each other.

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

## In code

The builders have a `chart` that holds `LChart.series` and `LChart.category`, and each category holds an `LChart.value`, in the language's case. `ChartType` names the kinds: `ChartType.Bar`, `ChartType.Line`, `ChartType.Area` and `ChartType.Sparkline`. A builder has no data binding, so the program turns its own list into categories. `LChart.value` takes one number, written in full with no culture's marks and no exponent, or a string that is a number, such as `'0.250'`, whose decimals a value label keeps. No number is no value.

```js
import { L, LChart, NoAttr, ChartType } from '@lpdfio/lpdf'

const chart = L.chart({ type: ChartType.Bar, height: '160pt', prefix: '$' },
  months.map((month) => LChart.category({ label: month.name }, [LChart.value(NoAttr, [month.revenue])])))
```

## Pages

A chart never splits across pages. When it doesn't fit, it moves whole to the next page, and one taller than a page is cut at its bottom. Its title is a `text` of its own, which could stay behind at the foot of a page: `paginate="no"` on a `column` that holds both keeps them together, as in the first example.

## Accessibility

In a tagged document, with [`pdfua`](?p=pdfua) or a `pdfa` of [level a](?p=pdfa#level-a), a chart is one figure with its `alt`, which says what the chart shows: `alt="Revenue per month, highest in March"`. `alt=""` marks it as decoration. A PDF/UA document needs it on each chart outside a header or a footer, and refuses a chart without it.

## Limits

A chart holds 10,000 categories and 100 series at most, counted after the data is bound. More is an error that names the limit and the list: `a chart holds 10,000 categories at most; the data of 'fixtures' gives 50,000`. A chart at both limits renders inside the render's [time limit](?p=install#time-limit).

A value, the total of a stack, `min` and `max` are 1,000,000,000,000,000 at most either side of zero, where every whole number is still exact. Past it is an error that names the category: `category 'Q1' has the value 1.7e308, and a chart holds values of 1,000,000,000,000,000 at most, either side of zero`.
