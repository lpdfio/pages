# Installation

Lpdf generates PDF from XML, or from code that builds the same document. One engine runs in every SDK, so the output is identical on every platform. It is compiled to WebAssembly for Node.js and the browser, to a WASI binary for PHP, Python, and .NET, and to a native library for PHP on Linux.

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

- PHP 8.2 or later, with the DOM extension (`ext-dom`; on Debian and Ubuntu it is the `php-xml` package)
- Composer
- One of the two ways the SDK runs the engine, which it picks itself (*How PHP runs the engine* below):
  - The native library in the package, through PHP's FFI extension (`ext-ffi`): on Linux with glibc 2.17 or newer, on x86_64 or arm64. A web server needs `ffi.enable=true` in php.ini; the command line allows FFI as it is.
  - The [`wasmtime`](https://wasmtime.dev) command-line tool on your `PATH`, which runs the bundled WASI binary: everywhere else, such as macOS, Windows and Alpine, and where FFI isn't allowed.

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

An attribute class takes its attributes as named arguments, `new TextAttr(fontSize: 'xl')`. Positional arguments aren't supported: the parameters follow the schema's order, so an attribute added in a later version can move them.

## How PHP runs the engine

The package carries the engine twice: a native library, which PHP loads through its FFI extension and calls in its own process, and the WASI binary, which the `wasmtime` program runs in a process of its own for each render. `L::engine()` renders with the native library where it loads, and with `wasmtime` otherwise, and `$engine->runner()` says which one renders: `ffi` or `wasm`. Both make the same PDF.

| | Native library (`ffi`) | wasmtime (`wasm`) |
|---|---|---|
| Runs on | Linux with glibc 2.17 or newer, x86_64 and arm64 | Wherever wasmtime runs |
| Needs | The FFI extension, and `ffi.enable=true` under a web server | The `wasmtime` program on `PATH` |
| Each render | A call in PHP's own process | A process of its own, which adds about 20 ms |
| Sandbox | None: the engine has the rights of the PHP process | WebAssembly's: no files, no network |

The native library loads where PHP has the FFI extension, which the official Docker images leave out (`docker-php-ext-install ffi`, with `libffi-dev`), and where `ffi.enable` allows it. Its default, `preload`, allows FFI on the command line only, so PHP-FPM and Apache's PHP module need `ffi.enable=true` in php.ini. Alpine's C library, musl, isn't supported: there the SDK renders with `wasmtime`.

`runner` on the engine picks how: `auto`, the default, chooses as above; `ffi` renders with the native library only, and throws an `EngineException` that names what stands in the way where it can't load; `wasm` renders with `wasmtime` only. For an app that renders templates, fonts or images its own users upload, `wasm` keeps the engine in WebAssembly's sandbox. `libPath` loads the native library from another path.

```php
<?php
require_once 'vendor/autoload.php';

use Lpdf\Engine\EngineOptions;
use Lpdf\L;

$engine = L::engine(new EngineOptions(runner: 'ffi'));
echo $engine->runner(); // ffi, or an EngineException that says why not
```

The time limit and the memory cap below hold through both, with the differences their PHP notes give, and the engine's memory is outside PHP's `memory_limit` either way. Through the native library, a fault the engine can't catch, such as running out of memory before its cap stops it, ends PHP's process; through `wasmtime` it ends the `wasmtime` process, and the render throws an `EngineException`.

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

## Time limit

A render stops after 5 seconds with the SDK's render error, which names the limit: `The render timed out after 5 seconds.` A PDF renders in milliseconds, so a render that runs that long is a document far larger than usual or a fault in the engine, and stopping it frees the thread or the process it held. `timeout` on the engine sets another limit, in seconds, and `timeout: 0` sets none. A render stopped at its limit leaves the engine as it was, and the next render runs as usual.

::: sdk js

```javascript
import { L } from '@lpdfio/lpdf'

const engine = L.engine({ timeout: 60 })
```

A render runs on a worker thread, one at a time, so it doesn't hold up the event loop. At its limit the render rejects with an `LpdfRenderError`, the worker is stopped, and the next render starts a new one. In the browser, `initLpdf(wasmUrl, licenseKey, { timeout: 60 })` takes the same option, and renders run on a Web Worker started from a `blob:` URL: a page with a Content-Security-Policy allows `blob:` in `worker-src`.
:::

::: sdk php

```php
<?php
require_once 'vendor/autoload.php';

use Lpdf\Engine\EngineOptions;
use Lpdf\L;

$engine = L::engine(new EngineOptions(timeout: 60));
```

At its limit the render throws an `EngineException`. Through `wasmtime` its process is stopped. Through the native library the engine stops the render itself, at its next check: a step the engine hands to a library, such as reading the XML, subsetting a font or compressing an image, finishes first, so a render can run past its limit by that step's time.
:::

::: sdk python

```python
from lpdf import EngineOptions, L

engine = L.engine(EngineOptions(timeout=60))
```

At its limit the render raises an `EngineException`. Renders on other threads go on.
:::

::: sdk dotnet

```csharp
using Lpdf;
using Lpdf.Engine;

var engine = L.Engine(new EngineOptions { Timeout = 60 });
```

At its limit the render throws an `EngineException`. Renders on other threads go on.
:::

## Memory limit

A render may allocate 1024 MB, which holds thousands of pages of text and tables. One that needs more stops with the SDK's render error, which names the cap: `the render needs more memory than its cap of 1024 MB: raise the cap in the engine's options, or render the document in smaller parts`. What counts is what the render allocates, the data it binds included. In the .NET, PHP and Python SDKs the fonts, images and files sent with a render count too; in JavaScript what is loaded on the engine before the render doesn't. There is no limit on the size of the XML or of a document built in code. `maxMemoryMb` on the engine sets another cap, a whole number of megabytes from 1 to 4096: lower in a small container, higher for a big document on a machine with the memory for it. 4096 is the most the engine can address as a 32-bit WebAssembly module, and PHP's native library keeps the same range. A render stopped at its cap leaves the engine as it was, and the next render runs as usual.

If the engine crashes, by a fault in it or a render that runs out of memory before its cap stops it, the render fails with the same message in every SDK: `The engine crashed during the render. This is a bug in Lpdf, or the render ran out of memory before its cap stopped it: please report it with the document at https://github.com/lpdfio/lpdf/issues.` The next render runs on a fresh engine. PHP's native library is the exception, below.

::: sdk js

```javascript
import { L } from '@lpdfio/lpdf'

const engine = L.engine({ maxMemoryMb: 2048 })
```

Past the cap the render rejects with an `LpdfRenderError`. In the browser, `initLpdf(wasmUrl, licenseKey, { maxMemoryMb: 2048 })` takes the same option. After a crash the error's `cause` holds the engine's own error, and the worker is replaced for the next render.
:::

::: sdk php

```php
<?php
require_once 'vendor/autoload.php';

use Lpdf\Engine\EngineOptions;
use Lpdf\L;

$engine = L::engine(new EngineOptions(maxMemoryMb: 2048));
```

Past the cap the render throws an `EngineException`. Through `wasmtime`, after a crash its previous exception holds what `wasmtime` reported. Through the native library, a fault the engine catches throws the same message, its previous exception holding the engine's own, and the next render runs as usual. A render that runs out of memory before its cap stops it ends PHP's process instead, and nothing is thrown: under PHP-FPM the request fails and FPM starts a new worker. Where a render could need more memory than the machine has, keep `maxMemoryMb` below it, or render with `wasm`.
:::

::: sdk python

```python
from lpdf import EngineOptions, L

engine = L.engine(EngineOptions(max_memory_mb=2048))
```

Past the cap the render raises an `EngineException`. After a crash it is raised from the engine's trap.
:::

::: sdk dotnet

```csharp
using Lpdf;
using Lpdf.Engine;

var engine = L.Engine(new EngineOptions { MaxMemoryMb = 2048 });
```

Past the cap the render throws an `EngineException`. After a crash its `InnerException` is the engine's trap.
:::

## Images and fonts

An image or a font that comes from a file is declared in `assets` with a `src` path. The SDK reads the file from the machine that renders the PDF, so a relative path is relative to the working directory. The engine does not fetch URLs or read data URIs. An image file the SDK cannot read is an error, and a font file it cannot read falls back to Helvetica without one. To supply the bytes yourself, call `loadImage(name, bytes)` or `loadFont(name, bytes)` on the engine and leave `src` out.

Asset names use lowercase letters, digits, and `-`, and start with a letter: `logo`, `serif-bold`.
