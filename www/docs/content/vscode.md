# VS Code

The Lpdf extension for VS Code is a PDF viewer, a PDF preview and export for Markdown files, a visual diff for PDFs, and an editor for Lpdf documents in XML with a live preview. It installs from the [Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=lpdfio.lpdf) or [Open VSX](https://open-vsx.org/extension/lpdfio/lpdf), and everything it does runs on your machine.

## View PDFs

**Lpdf: View PDF**, in the Explorer's menu on a `.pdf` file or in the command palette, opens the file in the Lpdf viewer. To open every PDF in it, turn on the `lpdf.defaultPdfViewer` setting. The viewer follows your light or dark theme.

- Page thumbnails, and a two-page view with or without a cover page.
- Text search, with highlight all, match case, diacritics and whole words.
- Zoom from 10% to 1000%, by the field, the buttons, a pinch, or Ctrl and the mouse wheel, with a toggle between fit to width and fit to page.
- Save, and the document's properties.

## Markdown to PDF

### Preview

**Lpdf: Preview PDF** on a `.md` file, in the Explorer's menu or the button in the editor's title bar, shows the file as a PDF beside it. The same commands are lenses above the first line of the file.

- The preview updates when you save the `.md` file, its Lpdf document or its styles file, and when an image it shows changes.
- The preview and the editor scroll together. They agree exactly at the headings that are bookmarks in the PDF, all six levels unless the document sets `bookmarks`, and roughly in between, most where a section holds a table, an image or a long code block. A heading written with `#` counts; one underlined with `===` or `---` does not. A file with no headings leaves both where they are.

### Export

**Lpdf: Export PDF**, in the Explorer's menu or the lenses above the first line, saves the PDF. When the file's Lpdf document asks for encryption, Export PDF asks for the passwords (*Encrypted export* below). The command line converts the same file to the same PDF with `lpdf convert --input notes.md`.

### Styles

A `.md` file is set on an A4 page with a 54pt margin and the page number, with default styles for headings, lists, quotes, code and tables.

**Lpdf: Link Markdown Styles...**, or **Link Styles...** above the first line, offers a look to start from: Sans, which is what a file gets with no styles, Serif (Times) or Typewriter (Courier). It writes the look beside the `.md` file as `<name>.styles.xml`, `notes.styles.xml` for `notes.md`, and that file is the link: a `.md` file uses the `.styles.xml` beside it with its name, and the lens above the file opens it.

- The rules are named after the Markdown they style, `h1`, `p`, `code`, `quote`, `li`, `table` and so on, and take the attributes of the element each one becomes ([Markdown](?p=doc/markdown)).
- Write only the rules you change. The others stay as the defaults have them.
- Linking a look again overwrites the file. **Lpdf: Unlink Markdown Styles** asks, then deletes it, and the file goes back to the default styles.

### Your own page

**Lpdf: Create Lpdf Document** writes an Lpdf document named after the file, `notes.xml` for `notes.md`, beside it, links the two and opens the document as a tab in the editor of the `.md` file, so the preview stays where it is. The document is an Lpdf document with a `markdown` in a section, so the page size, the margin, a cover, a header or a footer is XML around the Markdown. It names the styles beside the `.md` file, if there are any, and from then on it is where the styles are named. **Lpdf: Unlink Lpdf Document** goes back to the default page.

The link works from the document too. An Lpdf document with a `markdown` has **Link Markdown...** above its first line (**Lpdf: Link Markdown File...**), which makes a `.md` file its body: the preview and the export of the document are the Markdown set in it, and the front matter is its data. A `.md` file goes with one document, and a document with one `.md` file. **Lpdf: Unlink Markdown File** undoes it.

- **Front matter.** A YAML block at the top of the file isn't drawn. Its `key: value` lines are data the document shows with `data-value`, as `<text-at data-value="title">` does.
- **Images.** `![chart](img/chart.png)` is read relative to the `.md` file.

## Compare PDFs

**Lpdf: Compare PDF with HEAD**, in the Explorer's menu on a `.pdf` file or the **...** menu of an open PDF's tab, opens the version in your last commit and your working copy side by side. The file needs a committed version in a git repository. A changed PDF clicked in the Source Control view offers to open this way instead of as a text diff; the `lpdf.promptPdfDiff` setting turns the offer off.

**Lpdf: Compare PDF with branch...**, in the same menus, compares with a branch or a tag you pick: your default branch first, such as `main`, then your other branches, the remote branches and the tags. On a branch where the change is already committed, it shows what the change did against `main`. The left side and its column in the properties are labeled with the branch or tag.

- Each side shows its page count and size.
- The two sides scroll together; untick **Sync scroll** to scroll them apart.
- One zoom for both sides: the buttons, a typed percentage, the fit button or a pinch.
- The info button opens both documents' properties, such as size, page count and producer, in two columns, with the ones that differ marked and counted.

## Author Lpdf documents

### Templates

**Lpdf: New Document...**, also under **File > New File...** and in the Explorer's menu on a folder, writes one of seven templates where you choose: an admission letter, a résumé, an invoice, a report, an installment contract, a brochure and a 117-page book. A template that has data, such as the invoice and the report, writes its JSON beside the XML, and one that has fonts or images writes them to an `assets` folder beside it. The document opens with its preview.

### Preview

Any `.xml` file whose root element is `lpdf` is an Lpdf document, whatever its name. **Lpdf: Preview PDF**, the buttons above `<lpdf>` or the **Lpdf ◆** item in the status bar open the PDF beside the XML. It updates each time you save, and keeps your place and zoom.

### Completion, validation and hover

The [Red Hat XML](https://marketplace.visualstudio.com/items?itemName=redhat.vscode-xml) extension checks the XML against the [Lpdf schema](?p=xml/schema) as you type. VS Code installs it with Lpdf, also if you only use the viewer.

- Completion offers only what the schema allows at the cursor.
- Mistakes are underlined as you type.
- Hovering an element or an attribute shows what it does, the attributes it takes and the values each accepts, from the schema.

The Red Hat XML extension asks for your consent to its own telemetry. Lpdf collects none.

### Generate code

**Lpdf: Generate Code** turns the saved XML into code that builds the same document in JavaScript, Python, Java, C# or PHP, and opens it beside the template. **Lpdf: Generate JavaScript from XML** and the commands for the other languages skip the choice.

### Data

A template binds to JSON data ([Data Binding](?p=data/binding)). A `<name>.data.json` file beside `<name>.xml` is picked up by itself, and **Lpdf: Link Data File...** links any JSON file; **Lpdf: Unlink Data File** removes the link. The preview updates when the data file changes, and the export uses the same data.

### Images and fonts

The images and fonts in `assets` load from disk. A relative path is looked up beside the XML file first, then in the root of the workspace folder. A URL isn't downloaded.

### Encrypted export

**Lpdf: Export PDF** renders the document with its linked data and saves the PDF. A document that asks for [encryption](?p=encryption) in its `output`, as `<output encrypt="aes-256" allow="print"/>` does, is encrypted on export:

- Export PDF asks for an owner password, which is required, and an open password, which is optional: leave it empty and anyone can open the PDF, with the document's `allow` applied. Each is typed twice and checked against the document's cipher, then you choose where to save.
- The cipher and the permissions are the document's.
- With AES-256 every export gets a fresh key, so the same document exported twice gives two different files.
- Lpdf doesn't store the passwords and can't recover them.

The preview has no passwords: it shows such a document unencrypted, and says so.
