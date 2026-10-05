# Book

A pocket book of all twelve chapters of Alice's Adventures in Wonderland, with plates and running heads.

[document.xml](/docs/examples/book/document.xml)

<iframe class="lpdf-example-viewer"
        src="/assets/js/lpdf-demo/viewer/index.html?pdf=/docs/examples/book/document.pdf"
        title="The book, in the PDF viewer"
        loading="lazy"></iframe>

## What it shows

```text
A pocket book, all twelve chapters of Alice's Adventures in Wonderland, 4.25 by 6.875 inches. It is
generated: build.py turns source/alice.txt into this file, so change the script or the text
and not the XML. The text is public domain (Lewis Carroll, 1865). What this adds to the brochure:

  size           two lengths, in points, for a size with no name: 306pt 495pt is a mass-market paperback
  one section    the whole book is one, so the page numbers run on from the cover to the last page
  paginate       paginate="break-before" on a direct child of the layout starts a new page. Each
                 chapter, and the contents, is such a child, so each begins at the top of a page. On
                 a box inside another box it is ignored, and paginate="no" keeps a stanza whole
  headers        the running head, the chapter's number and name, is a canvas layer with a page range:
                 page="4-9" shows it on those pages and no others. There is one for each chapter, and
                 none on a chapter's first page, where the plate is. They are on the canvas and not
                 regions because Lpdf reserves room for every region whose pages it cannot count, on
                 every page: twelve regions left no room for text. A layer reserves nothing, so the
                 page's top margin, 56pt, holds the head, with 18pt between its rule and the text
  footer         a region, the last child of the layout: {page} on every page after the cover
  type           Crimson Text, a book face, in regular, italic and semibold, embedded from assets/fonts
                 (SIL Open Font License). The italic is used on the cover only: see the last paragraph
  canvas         the cover is drawn: a panel, a frame and a pocket watch, from rects, circles and lines
  plates         each chapter opens with a picture in the top two-thirds of the page: an img inside a
                 frame 258pt tall, which centres it across and down, and the chapter's title begins
                 below it, at 66% of the page height, with its text after it. The plates are by Arthur Rackham (1907, public
                 domain); their sizes are set in points, in the proportions of the originals

Where the chapters begin is not something Lpdf can look up, so the page numbers in the contents and the
ranges of the headers are measured and passed to the script, which last built this with the starts
3,11,19,27,37,47,58,69,79,90,99,108. After a change to the text, build, render, read where the chapters begin, and build again.

The words the author emphasised are set plain, not in italic. A span is placed from the width of the
text before it, and for an embedded font Lpdf measures every character outside plain ASCII, such as the
curly quotes and the dash, at one default width. A line with a span after any of them is drawn with the
span too early or too late, and in a book nearly every line has one. Straight quotes would hide it, and a
book with straight quotes is worse.

The lines are not justified: in this version of Lpdf justification is not applied to an embedded font
(a core font is justified, but spans inside it are drawn wrongly). Line height is fixed at 1.2
times the size, so the paragraphs are separated by a gap and not by a first-line indent.
```

## Fonts and images

The document names 15 files, which go in an `assets` folder next to it. In Visual Studio Code, **Lpdf: New Document** puts them there.

- [assets/fonts/CrimsonText-Italic.ttf](/docs/examples/book/assets/fonts/CrimsonText-Italic.ttf)
- [assets/fonts/CrimsonText-Regular.ttf](/docs/examples/book/assets/fonts/CrimsonText-Regular.ttf)
- [assets/fonts/CrimsonText-SemiBold.ttf](/docs/examples/book/assets/fonts/CrimsonText-SemiBold.ttf)
- [assets/images/chapter-01-alice.jpg](/docs/examples/book/assets/images/chapter-01-alice.jpg)
- [assets/images/chapter-02-pool-of-tears.jpg](/docs/examples/book/assets/images/chapter-02-pool-of-tears.jpg)
- [assets/images/chapter-03-caucus-race.jpg](/docs/examples/book/assets/images/chapter-03-caucus-race.jpg)
- [assets/images/chapter-04-white-rabbit.jpg](/docs/examples/book/assets/images/chapter-04-white-rabbit.jpg)
- [assets/images/chapter-05-caterpillar.jpg](/docs/examples/book/assets/images/chapter-05-caterpillar.jpg)
- [assets/images/chapter-06-pig-and-pepper.jpg](/docs/examples/book/assets/images/chapter-06-pig-and-pepper.jpg)
- [assets/images/chapter-07-tea-party.jpg](/docs/examples/book/assets/images/chapter-07-tea-party.jpg)
- [assets/images/chapter-08-croquet-ground.jpg](/docs/examples/book/assets/images/chapter-08-croquet-ground.jpg)
- [assets/images/chapter-09-mock-turtle-story.jpg](/docs/examples/book/assets/images/chapter-09-mock-turtle-story.jpg)
- [assets/images/chapter-10-lobster-quadrille.jpg](/docs/examples/book/assets/images/chapter-10-lobster-quadrille.jpg)
- [assets/images/chapter-11-trial.jpg](/docs/examples/book/assets/images/chapter-11-trial.jpg)
- [assets/images/chapter-12-evidence.jpg](/docs/examples/book/assets/images/chapter-12-evidence.jpg)

## The document

The document is 1,291 lines, so it is not repeated here. Download it above to read it beside the PDF it makes.
