# Encryption

Lpdf can encrypt a PDF with an open password, an owner password and permissions for printing, copying and editing. The document says that it is encrypted, with which cipher and what a reader may do, in its `output`. The passwords come with the render call, in code: they change from one render to the next, as a statement opens with each customer's own, and a password never travels with the template.

```xml
<document>
  <output encrypt="aes-256" allow="print fill-forms"/>
  <section>
    <layout margin="48pt">
      <text>Account statement</text>
    </layout>
  </section>
</document>
```

## The output element

`output` sits in `document`, after `meta`. It says how the file is written, apart from what its pages show.

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `encrypt` | `aes-256` `rc4-128` | — | Encrypts the PDF with this cipher, with the passwords of the render call. Without it the PDF is not encrypted |
| `allow` | list | nothing | What a reader may do without the owner password, separated by spaces, or `all`. Without it, or with `allow=""`, nothing is allowed. It needs `encrypt` |
| `pdfa` | `2b` `2u` | — | Writes the PDF as [PDF/A](?p=pdfa), which forbids encryption: not with `encrypt` |

The files a document carries in its [`attachments`](?p=attachments) are encrypted with the rest, under the same passwords.

The template is the only place that turns encryption on. Passwords given to the render of a document without `encrypt` are an error, so a file never goes out unencrypted while you believe it is locked.

## Passwords

- The **user password** is the one a reader asks for before showing the PDF. Leave it out, or empty, and anyone can open the file, with `allow` still applied.
- The **owner password** is required. It opens the file with every permission, and a reader that asks for it can lift the restrictions.

A PDF with both passwords opens with either. The permissions are advisory: a reader that follows the standard honors them, and a tool that does not can remove them, so use an open password when the content must stay private.

## Permissions

`allow` lists what a reader may do, separated by spaces, as `cols` lists the columns of a table. A permission comes only from naming it: what `allow` doesn't name is denied, and without `allow` everything is. `allow="all"` allows everything.

| Word | Allows |
|------|--------|
| `all` | Everything below |
| `print` | Printing, at full quality |
| `modify` | Changing the content |
| `copy` | Copying text and graphics |
| `annotate` | Adding or changing annotations |
| `fill-forms` | Filling form fields |
| `accessibility` | Reading the text aloud with a screen reader |
| `assemble` | Inserting, deleting and rotating pages |

`allow="print fill-forms"` lets a reader print the PDF and fill in its fields, and nothing else. A value that goes missing on its way, such as a `NaN` in code that the tree carries as `null`, leaves `allow` out, so the file stays locked rather than open.

## Cipher

**`aes-256`** is the cipher PDF 2.0 asks for and the one security reviews expect. **`rc4-128`** is there for a reader that cannot open AES-256; PDF 2.0 deprecates it, and its key is weak enough that the permissions and passwords hold little against a determined attacker.

An AES-256 render uses a fresh random key, so rendering one document twice gives two different files. RC4-128 gives the same bytes for the same document. If you compare, cache or sign the bytes of a PDF, do it with the RC4 file or before the encryption.

The SDK draws the random bytes from the platform's secure generator and sends them to the engine with the request. The engine refuses an AES-256 request without enough of them.

Passwords are read as UTF-8 and cut at 127 bytes for AES-256 and 32 for RC4-128. The standard asks readers to prepare a password with SASLprep first, and Lpdf does not, so a password with characters that SASLprep changes may not open in every reader. Plain ASCII passwords are safe.

## Encrypt a PDF

The passwords are options of the render call.

::: sdk js

```javascript
import { L } from '@lpdfio/lpdf'
import { writeFileSync } from 'node:fs'

L.engine()
    .render(xml, { userPassword: 'open-sesame', ownerPassword: 'owner-secret' })
    .then((pdf) => writeFileSync('secret.pdf', pdf))
```
:::

::: sdk php

```php
<?php
require_once 'vendor/autoload.php';

use Lpdf\Engine\RenderOptions;
use Lpdf\L;

$pdf = L::engine()->render($xml, new RenderOptions(userPassword: 'open-sesame', ownerPassword: 'owner-secret'));

file_put_contents('secret.pdf', $pdf);
```
:::

::: sdk python

```python
from pathlib import Path
from lpdf import L, RenderOptions

pdf = L.engine().render(xml, RenderOptions(user_password='open-sesame', owner_password='owner-secret'))

Path('secret.pdf').write_bytes(pdf)
```
:::

::: sdk dotnet

```csharp
using Lpdf;
using Lpdf.Engine;

var pdf = L.Engine().Render(xml, new RenderOptions { UserPassword = "open-sesame", OwnerPassword = "owner-secret" });

await File.WriteAllBytesAsync("secret.pdf", pdf);
```
:::

`xml` is a document whose `output` asks for encryption, as under *Create PDF* in [Installation](?p=install). A document built in code says it in its `output` too: `output: { encrypt: 'aes-256', allow: 'print' }` in Node.js, `DocumentOutput` in the other SDKs, with the constants `Cipher` and `Permission` for the values.

## Render without the passwords

A render that cannot have the passwords, such as a preview, asks by name to skip the encryption, and gets the PDF unencrypted. Without it, a document that asks for encryption and gets no owner password is an error, so encryption is never skipped by omission.

- In the SDKs, `skipEncryption: true` in Node.js and PHP, `skip_encryption=True` in Python, `SkipEncryption = true` in .NET, on the same options as the passwords.
- On the command line, `lpdf convert` and `lpdf benchmark` take `--skip-encryption`. They take no passwords: a password on the command line shows to anyone on the machine.
- The VS Code preview and the playground on lpdf.io skip it and say so. In VS Code, **Export PDF** asks for the passwords.

## Errors

Each of these stops the render with an error that says what to change:

- the document asks for encryption, and the render has no owner password and doesn't skip it
- the render has passwords, and the document doesn't ask for encryption
- the render has passwords and skips the encryption
- `allow` without `encrypt`
- `encrypt` with `pdfa`: PDF/A forbids encryption
- a word in `allow` that isn't `all` or one of the seven, or a cipher in `encrypt` that isn't `aes-256` or `rc4-128`
