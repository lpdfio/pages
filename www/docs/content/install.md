# Installation

Lpdf generates PDF from XML, or from code that builds the same document. One engine runs in every SDK, so the output is identical on every platform. It is compiled to WebAssembly for Node.js and the browser, and to a WASI binary for PHP, Python, and .NET.

The examples in these docs are XML, and they work in every language: pass the XML to `render`, as under *Create PDF* below. Most examples also show the same document built in code, in a tab for each language, as under *Create PDF with code*. The builders are the same in every language: the same elements, the same attributes under the schema's names, and the same constants, written in each language's own case (`fontSize` in Node.js and PHP, `font_size` in Python, `FontSize` in .NET).

::: sdk js

## Requirements

- Node.js 20 or later
- No external runtime dependencies — the WASM engine is bundled in the package

## Install

```bash
npm install @lpdfio/lpdf
```

## Create PDF

```javascript
import { L } from '@lpdfio/lpdf'
import { writeFileSync } from 'node:fs'

const xml = `<lpdf version="1">
  <document size="a4">
    <section>
      <layout margin="48pt">
        <column gap="m">
          <text font-size="xl">Hello, world</text>
          <text>This PDF was made with Lpdf.</text>
        </column>
      </layout>
    </section>
  </document>
</lpdf>`

const engine = L.engine()

engine.render(xml).then((pdf) => writeFileSync('hello.pdf', pdf))
```

`render` returns a promise. The example is an ES module: save it as `hello.mjs`, or set `"type": "module"` in `package.json`. CommonJS loads the package with `require` and gets the same classes:

```javascript
const { L } = require('@lpdfio/lpdf')
```

From 0.28.1 the package loads either way. Earlier versions load with `require` only: an `import` of `@lpdfio/lpdf` fails with `ERR_PACKAGE_PATH_NOT_EXPORTED`. To render a file, read it into a string and pass that to `render`.

## Create PDF with code

The same document, built with `L` instead of written as XML. `render` takes either one and makes the same PDF.

```javascript
import { L, NoAttr } from '@lpdfio/lpdf'
import { writeFileSync } from 'node:fs'

const doc = L.document({ size: 'a4' }, [
    L.section(NoAttr, [
        L.layout({ margin: '48pt' }, [
            L.column({ gap: 'm' }, [
                L.text({ fontSize: 'xl' }, ['Hello, world']),
                L.text(NoAttr, ['This PDF was made with Lpdf.']),
            ]),
        ]),
    ]),
])

const engine = L.engine()

engine.render(doc).then((pdf) => writeFileSync('hello.pdf', pdf))
```

## Versioning

The first two numbers are the Lpdf engine, and the last number counts changes to this package only. `0.22.3` runs engine `0.22`. Every engine release publishes all SDKs at `X.Y.0`, so the same `X.Y` means the same engine in every language. To stay on one engine and still get package fixes, use a tilde range in `package.json`:

```json
"@lpdfio/lpdf": "~0.22.0"
```

:::

::: sdk php

## Requirements

- PHP 8.3 or later, with the DOM extension (`ext-dom`; on Debian and Ubuntu it is the `php-xml` package)
- Composer
- The [`wasmtime`](https://wasmtime.dev) command-line tool on your `PATH`, which runs the bundled WASI binary

## Install

```bash
composer require lpdfio/lpdf
```

## Create PDF

```php
<?php
require_once 'vendor/autoload.php';

use Lpdf\L;

$xml = <<<'XML'
<lpdf version="1">
  <document size="a4">
    <section>
      <layout margin="48pt">
        <column gap="m">
          <text font-size="xl">Hello, world</text>
          <text>This PDF was made with Lpdf.</text>
        </column>
      </layout>
    </section>
  </document>
</lpdf>
XML;

$engine = L::engine();
$pdf = $engine->render($xml);
file_put_contents('hello.pdf', $pdf);
```

To render a file, read it into a string with `file_get_contents` and pass that to `render`.

## Create PDF with code

The same document, built with `L` instead of written as XML. `render` takes either one and makes the same PDF.

```php
<?php
require_once 'vendor/autoload.php';

use Lpdf\Kit\DocumentAttr;
use Lpdf\Kit\LayoutAttr;
use Lpdf\L;
use Lpdf\Layout\ColumnAttr;
use Lpdf\Layout\TextAttr;
use const Lpdf\NoAttr;

$doc = L::document(new DocumentAttr(size: 'a4'), [
    L::section(NoAttr, [
        L::layout(new LayoutAttr(margin: '48pt'), [
            L::column(new ColumnAttr(gap: 'm'), [
                L::text(new TextAttr(fontSize: 'xl'), ['Hello, world']),
                L::text(NoAttr, ['This PDF was made with Lpdf.']),
            ]),
        ]),
    ]),
]);

$engine = L::engine();
$pdf = $engine->render($doc);
file_put_contents('hello.pdf', $pdf);
```

## Versioning

The first two numbers are the Lpdf engine, and the last number counts changes to this package only. `0.22.3` runs engine `0.22`. Every engine release publishes all SDKs at `X.Y.0`, so the same `X.Y` means the same engine in every language. To stay on one engine and still get package fixes:

```bash
composer require lpdfio/lpdf:~0.22.0
```

:::

::: sdk python

## Requirements

- Python 3.11 or later, on Linux (x86_64 or aarch64, glibc or musl), macOS (x86_64 or arm64) or Windows (x64 or arm64)
- Nothing else: the engine runs inside Python on the [`wasmtime`](https://pypi.org/project/wasmtime/) package, which pip installs with the SDK

## Install

```bash
pip install lpdfio-lpdf
```

## Create PDF

```python
from pathlib import Path
from lpdf import L

xml = """<lpdf version="1">
  <document size="a4">
    <section>
      <layout margin="48pt">
        <column gap="m">
          <text font-size="xl">Hello, world</text>
          <text>This PDF was made with Lpdf.</text>
        </column>
      </layout>
    </section>
  </document>
</lpdf>"""

engine = L.engine()
pdf = engine.render(xml)
Path('hello.pdf').write_bytes(pdf)
```

To render a file, read it into a string with `Path('document.xml').read_text()` and pass that to `render`.

## Create PDF with code

The same document, built with `L` instead of written as XML. `render` takes either one and makes the same PDF.

```python
from pathlib import Path
from lpdf import L, NoAttr, DocumentAttr, LayoutAttr, ColumnAttr, TextAttr

doc = L.document(DocumentAttr(size='a4'), [
    L.section(NoAttr, [
        L.layout(LayoutAttr(margin='48pt'), [
            L.column(ColumnAttr(gap='m'), [
                L.text(TextAttr(font_size='xl'), ['Hello, world']),
                L.text(NoAttr, ['This PDF was made with Lpdf.']),
            ]),
        ]),
    ]),
])

engine = L.engine()
pdf = engine.render(doc)
Path('hello.pdf').write_bytes(pdf)
```

An attribute class takes its attributes as keyword arguments, `TextAttr(font_size='xl')`, and raises a `TypeError` for positional ones, so an attribute added in a later version never changes what a call sets.

## Threads

A render releases the GIL, so renders on threads run in parallel: use a thread pool, or `asyncio.to_thread` in async code. The first render of a process compiles the engine, which takes a few hundred milliseconds, and the renders after it share it.

## Versioning

The first two numbers are the Lpdf engine, and the last number counts changes to this package only. `0.22.3` runs engine `0.22`. Every engine release publishes all SDKs at `X.Y.0`, so the same `X.Y` means the same engine in every language. To stay on one engine and still get package fixes:

```bash
pip install "lpdfio-lpdf~=0.22.0"
```

:::

::: sdk dotnet

## Requirements

- .NET 8 or later
- No external runtime dependencies — the Wasmtime runtime and the WASI binary are bundled in the package

## Install

```bash
dotnet add package Lpdfio.Lpdf
```

## Create PDF

```csharp
using Lpdf;

var xml = """
    <lpdf version="1">
      <document size="a4">
        <section>
          <layout margin="48pt">
            <column gap="m">
              <text font-size="xl">Hello, world</text>
              <text>This PDF was made with Lpdf.</text>
            </column>
          </layout>
        </section>
      </document>
    </lpdf>
    """;

var engine = L.Engine();
var pdf = engine.Render(xml);
await File.WriteAllBytesAsync("hello.pdf", pdf);
```

To render a file, read it into a string with `File.ReadAllTextAsync` and pass that to `Render`.

`Render` runs on the caller's thread and returns the PDF's bytes. To render on another thread, write `await Task.Run(() => engine.Render(xml))`.

## Create PDF with code

The same document, built with `L` instead of written as XML. `Render` takes either one and makes the same PDF.

```csharp
using Lpdf;
using static Lpdf.L;

var doc = L.Document(new() { Size = "a4" }, [
    L.Section(NoAttr, [
        L.Layout(new() { Margin = "48pt" }, [
            L.Column(new() { Gap = "m" }, [
                L.Text(new() { FontSize = "xl" }, ["Hello, world"]),
                L.Text(NoAttr, ["This PDF was made with Lpdf."]),
            ]),
        ]),
    ]),
]);

var engine = L.Engine();
var pdf = engine.Render(doc);
await File.WriteAllBytesAsync("hello.pdf", pdf);
```

## Versioning

The first two numbers are the Lpdf engine, and the last number counts changes to this package only. `0.22.3` runs engine `0.22`. Every engine release publishes all SDKs at `X.Y.0`, so the same `X.Y` means the same engine in every language. To stay on one engine and still get package fixes, use a version range:

```xml
<PackageReference Include="Lpdfio.Lpdf" Version="[0.22.0,0.23.0)" />
```

:::

## Images and fonts

An image or a font that comes from a file is declared in `assets` with a `src` path. The SDK reads the file from the machine that renders the PDF, so a relative path is relative to the working directory. The engine does not fetch URLs or read data URIs. An image file the SDK cannot read is an error, and a font file it cannot read falls back to Helvetica without one. To supply the bytes yourself, call `loadImage(name, bytes)` or `loadFont(name, bytes)` on the engine and leave `src` out.

Asset names use lowercase letters, digits, and `-`, and start with a letter: `logo`, `serif-bold`.
