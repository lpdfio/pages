# Encryption

Lpdf can encrypt a PDF with an open password, an owner password and permission flags for printing, copying and editing. The encryption is set on the engine, in code, and not in the XML, so a password never travels with the document.

## Passwords

- The **user password** is the one a reader asks for before showing the PDF. Leave it empty and anyone can open the file, with the permission flags still applied.
- The **owner password** is required. It opens the file with every permission, and a reader that asks for it can lift the flags.

A PDF with both passwords opens with either. The flags are advisory: a reader that follows the standard honors them, and a tool that does not can remove them, so use an open password when the content must stay private.

## Permissions

Every flag is allowed unless you set it to `false`.

| Flag | Allows |
|------|--------|
| `print` | Printing |
| `modify` | Changing the content |
| `copy` | Copying text and graphics |
| `annotate` | Adding or changing annotations |
| `fill_forms` | Filling form fields |
| `accessibility` | Reading the text aloud with a screen reader |
| `assemble` | Inserting, deleting and rotating pages |
| `print_hq` | Printing at full quality |

The flags go by these names in every SDK, in each language's case: `fill_forms` in Node.js, PHP and Python, `FillForms` in .NET.

## Algorithm

The default is **AES-256**, the cipher PDF 2.0 asks for and the one security reviews expect. **RC4-128** is still available for a reader that cannot open AES-256; PDF 2.0 deprecates it, and its key is weak enough that the flags and passwords hold little against a determined attacker.

An AES-256 render uses a fresh random key, so rendering one document twice gives two different files. RC4-128 gives the same bytes for the same document. If you compare, cache or sign the bytes of a PDF, do it with the RC4 file or before the encryption.

The SDK draws the random bytes from the platform's secure generator and sends them to the engine with the request. The engine refuses an AES-256 request without enough of them.

Passwords are read as UTF-8 and cut at 127 bytes. The standard asks readers to prepare a password with SASLprep first, and Lpdf does not, so a password with characters that SASLprep changes may not open in every reader. Plain ASCII passwords are safe.

## Encrypt a PDF

::: sdk js

```javascript
import { L } from '@lpdfio/lpdf'
import { writeFileSync } from 'node:fs'

const engine = L.engine().setEncryption({
    userPassword: 'open-sesame',
    ownerPassword: 'owner-secret',
    permissions: { copy: false, modify: false },
})

engine.render(xml).then((pdf) => writeFileSync('secret.pdf', pdf))
```

To use RC4-128, add `algorithm: 'rc4-128'` to the options. `clearEncryption()` removes the setting.
:::

::: sdk php

```php
<?php
require_once 'vendor/autoload.php';

use Lpdf\L;

$engine = L::engine()->setEncryption(
    userPassword: 'open-sesame',
    ownerPassword: 'owner-secret',
    permissions: ['copy' => false, 'modify' => false],
);

file_put_contents('secret.pdf', $engine->render($xml));
```

To use RC4-128, pass `algorithm: 'rc4-128'`. `clearEncryption()` removes the setting.
:::

::: sdk python

```python
from pathlib import Path
from lpdf import L

engine = L.engine().set_encryption(
    'open-sesame',
    'owner-secret',
    {'copy': False, 'modify': False},
)

Path('secret.pdf').write_bytes(engine.render(xml))
```

To use RC4-128, pass `algorithm='rc4-128'`. `clear_encryption()` removes the setting.
:::

::: sdk dotnet

```csharp
using Lpdf;
using Lpdf.Engine;

var engine = L.Engine().SetEncryption(new EncryptOptions
{
    UserPassword = "open-sesame",
    OwnerPassword = "owner-secret",
    Permissions = new EncryptPermissions { Copy = false, Modify = false },
});

await File.WriteAllBytesAsync("secret.pdf", await engine.Render(xml));
```

To use RC4-128, set `Algorithm = EncryptAlgorithm.Rc4128`. `ClearEncryption()` removes the setting.
:::

`xml` is a document, as under *Create PDF* in [Installation](?p=install). A document built in code encrypts the same way.
