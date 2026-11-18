# License key

A license key removes the Lpdf attribution line from the PDFs the engine makes. The engine works without one: the PDFs it makes are the same, with the line added. A Community key is free.

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

In JavaScript, Python, Java and C# an unset variable is an error, not an empty key. To render without a key, leave the call out, or pass an empty string.

## In the browser

In the browser the key is the second argument of `initLpdf`. Leave it out, or pass an empty string, to render without one.

```javascript
import { initLpdf } from '@lpdfio/lpdf/browser'

const lpdf = await initLpdf(wasmUrl, licenseKey)
```

`wasmUrl` is the URL of the engine's `lpdf_bg.wasm` file.

## Without a key

Without a valid key every page carries a small attribution line in its top-right corner: the Lpdf mark and the name. A render draws it on every page. A stamp draws it on the pages it stamps, and a merge on every merged page, as [Stamping existing PDFs](?p=stamp#without-a-license-key) and [Merging PDFs for print](?p=merge#without-a-license-key) describe.

A key the engine doesn't accept draws the line too, such as an expired key, a key issued for another major version of Lpdf, or a key issued for another Codesense product. The render doesn't fail. [Check a key](#check-a-key) says which of these it is.

## Check a key

`checkLicenseKey` (`check_license_key` in Python, `CheckLicenseKey` in C#) asks the engine what it makes of a key, with the same code a render runs. It checks the key set on the engine, or the key you pass it. The call is synchronous in every language, and a key the engine doesn't accept is a status in the result, not an error.

::: sdk js

```javascript
const check = engine.checkLicenseKey()
console.log(check.status) // 'licensed'
```
:::

::: sdk python

```python
check = engine.check_license_key()
print(check['status'])  # 'licensed'
```
:::

::: sdk java

```java
var check = engine.checkLicenseKey();
System.out.println(check.status()); // licensed
```
:::

::: sdk dotnet

```csharp
var check = engine.CheckLicenseKey();
Console.WriteLine(check.Status); // licensed
```
:::

::: sdk php

```php
$check = $engine->checkLicenseKey();
echo $check['status']; // licensed
```
:::

In the browser, `checkLicenseKey` is a method of what `initLpdf` returns. `status` is one of these:

| Status | Meaning |
|--------|---------|
| `licensed` | The engine accepts the key and draws no attribution line |
| `no_key` | No key is set, or it is an empty string |
| `expired` | The key's date has passed |
| `version_mismatch` | The key was issued for another major version of Lpdf |
| `wrong_product` | The key was issued for another Codesense product |
| `unknown_key` | The key was signed by a signing key this engine doesn't trust, such as one newer than the engine |
| `bad_signature` | The key's signature doesn't match its contents |
| `malformed` | The engine can't read the key |

The rest of the result is there once the key's signature has verified, so an expired key still names its license, and a key the engine can't read says nothing more:

| Field | Value |
|-------|-------|
| `product` | The Codesense product the key was issued for |
| `tier` | `community`, `professional` or `enterprise` |
| `expires` | When the key stops validating, as an ISO 8601 date in UTC. A key with no date has none |
| `license` | The license number, such as `L-7K3M9Q` |
| `key` | Which key of the license it is: 1, 2, 3, in the order they were issued |

JavaScript returns an object, Python a dict and PHP an array, each with these names as keys, and a field the result lacks is left out. Java returns a `LicenseCheck` with a method for each, such as `expires()`, and C# a `LicenseCheck` with a property for each, such as `Expires`, and a field the result lacks is `null`. Both have `isLicensed()` (`IsLicensed` in C#), which is true for `licensed`.

## Get a key

Community keys are free. Get a key from the [pricing page](https://lpdf.io/pricing/). The [license](https://lpdf.io/license/) says which tier a project uses.
