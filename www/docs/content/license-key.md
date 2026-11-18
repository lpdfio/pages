# License key

A license key removes the Lpdf attribution line from the PDFs the engine makes. The engine works without one: a render, a stamp and a merge make the same PDFs, with the line on each page. A Community key is free.

## Set the key

Set the key on the engine after you create it, with `setLicenseKey` (`set_license_key` in Python, `SetLicenseKey` in C#). It is not an argument of the constructor, and the SDKs read no environment variable, so read your own and pass it in. The examples read `LPDF_LICENSE_KEY`; the name is yours to choose.

::: sdk js

```javascript
import { L } from '@lpdfio/lpdf'

const engine = L.engine().setLicenseKey(process.env.LPDF_LICENSE_KEY)
```
:::

::: sdk python

```python
import os
from lpdf import L

engine = L.engine().set_license_key(os.environ['LPDF_LICENSE_KEY'])
```
:::

::: sdk java

```java
import io.lpdf.L;

var engine = L.engine().setLicenseKey(System.getenv("LPDF_LICENSE_KEY"));
```
:::

::: sdk dotnet

```csharp
using Lpdf;

var engine = L.Engine().SetLicenseKey(Environment.GetEnvironmentVariable("LPDF_LICENSE_KEY")!);
```
:::

::: sdk php

```php
<?php
require_once 'vendor/autoload.php';

use Lpdf\L;

$engine = L::engine()->setLicenseKey(getenv('LPDF_LICENSE_KEY'));
```
:::

The key applies to every call on that engine: `render`, `stamp` and `merge`.

## In the browser

In the browser the key is the second argument of `initLpdf`. Leave it out, or pass an empty string, to render without one.

```javascript
import { initLpdf } from '@lpdfio/lpdf/browser'

const lpdf = await initLpdf(wasmUrl, licenseKey)
```

`wasmUrl` is the URL of the engine's `lpdf_bg.wasm` file.

## Without a key

Without a valid key every page carries a small attribution line in its top-right corner: the Lpdf mark and the name. A render draws it on every page. A stamp draws it on the pages it stamps, and a merge on every merged page, as [Stamping existing PDFs](?p=stamp#without-a-license-key) and [Merging PDFs for print](?p=merge#without-a-license-key) describe.

A key the engine doesn't accept draws the line too, such as an expired key, a key issued for another major version of Lpdf, or a key issued for another Codesense product. The render doesn't fail.

## Get a key

Community keys are free. Get a key from the [pricing page](https://lpdf.io/pricing/). The [license](https://lpdf.io/license/) says which tier a project uses.
