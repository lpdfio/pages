# Installation

lpdf generates PDF from XML, or from code that builds the same document. One engine runs in every SDK, so the output is identical on every platform. It is compiled to WebAssembly for Node.js and the browser, and to a WASI binary for PHP, Python, and .NET.

The examples in these docs are XML, and they work in every language: pass the XML to `render`, as under *Create PDF* below. Most examples also show the same document built in code, in a tab for each language. The builders are the same in every language: the same elements, the same attributes under the schema's names, and the same constants, written in each language's own case (`fontSize` in Node.js and PHP, `font_size` in Python, `FontSize` in .NET).

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
const { L } = require('@lpdfio/lpdf')
const { readFileSync, writeFileSync } = require('node:fs')

const engine = L.engine()
const xml = readFileSync('document.xml', 'utf8')

engine.render(xml).then((pdf) => writeFileSync('document.pdf', pdf))
```

`render` returns a promise. The package is CommonJS, so load it with `require`: an `import` of `@lpdfio/lpdf` fails with `ERR_PACKAGE_PATH_NOT_EXPORTED`.

## Versioning

The first two numbers are the Lpdf engine, and the last number counts changes to this package only. `0.22.3` runs engine `0.22`. Every engine release publishes all SDKs at `X.Y.0`, so the same `X.Y` means the same engine in every language. To stay on one engine and still get package fixes, use a tilde range in `package.json`:

```json
"@lpdfio/lpdf": "~0.22.0"
```

:::

::: sdk php

## Requirements

- PHP 8.3 or later
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

$engine = L::engine();
$xml = file_get_contents('document.xml');
$pdf = $engine->render($xml);
file_put_contents('document.pdf', $pdf);
```

## Versioning

The first two numbers are the Lpdf engine, and the last number counts changes to this package only. `0.22.3` runs engine `0.22`. Every engine release publishes all SDKs at `X.Y.0`, so the same `X.Y` means the same engine in every language. To stay on one engine and still get package fixes:

```bash
composer require lpdfio/lpdf:~0.22.0
```

:::

::: sdk python

## Requirements

- Python 3.10 or later
- The [`wasmtime`](https://wasmtime.dev) command-line tool on your `PATH`, which runs the bundled WASI binary

## Install

```bash
pip install lpdfio-lpdf
```

## Create PDF

```python
from pathlib import Path
from lpdf import L

engine = L.engine()
xml = Path('document.xml').read_text()
pdf = engine.render(xml)
Path('document.pdf').write_bytes(pdf)
```

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

var engine = L.Engine();
var xml = await File.ReadAllTextAsync("document.xml");
var pdf = await engine.Render(xml);
await File.WriteAllBytesAsync("document.pdf", pdf);
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
