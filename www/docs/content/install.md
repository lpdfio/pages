# Installation

lpdf generates PDF from XML. It runs as a WASI binary with adapters for Node.js, PHP, Python, and .NET — identical output on every platform.

::: sdk js

## Requirements

- Node.js 18 or later
- No external runtime dependencies — the WASM engine is bundled in the package

## Install

```bash
npm install @lpdfio/lpdf
```

## Create PDF

```javascript
const { LpdfEngine } = require('@lpdfio/lpdf')
const { readFileSync, writeFileSync } = require('node:fs')

const engine = new LpdfEngine('YOUR_LICENSE_KEY')
const xml = readFileSync('document.xml', 'utf8')
const pdf = await engine.renderPdf(xml)
writeFileSync('document.pdf', pdf)
```

:::

::: sdk php

## Requirements

- PHP 8.2 or later
- Composer

## Install

```bash
composer require lpdfio/lpdf
```

## Create PDF

```php
<?php
require_once 'vendor/autoload.php';

use Lpdf\LpdfEngine;

$engine = new LpdfEngine('YOUR_LICENSE_KEY');
$xml = file_get_contents('document.xml');
$pdf = $engine->renderPdf($xml);
file_put_contents('document.pdf', $pdf);
```

:::

::: sdk python

## Requirements

- Python 3.9 or later

## Install

```bash
pip install lpdfio-lpdf
```

## Create PDF

```python
from pathlib import Path
from lpdf import Pdf

engine = Pdf.engine('YOUR_LICENSE_KEY')
xml = Path('document.xml').read_text()
pdf = engine.render(xml)
Path('document.pdf').write_bytes(pdf)
```

:::

::: sdk dotnet

## Requirements

- .NET 8 or later

## Install

```bash
dotnet add package Lpdfio.Lpdf
```

## Create PDF

```csharp
using Lpdf;

var engine = Pdf.Engine("YOUR_LICENSE_KEY");
var xml = await File.ReadAllTextAsync("document.xml");
var pdf = await engine.Render(xml);
await File.WriteAllBytesAsync("document.pdf", pdf);
```

:::
