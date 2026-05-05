# Your First Document

A complete document: heading, body text, a divider, and a page footer stamped via canvas.

```xml
<lpdf version="1">
  <document size="letter" margin="48pt">
    <section>
      <layout>
        <stack gap="16pt">
          <text font-size="24pt">Invoice #1042</text>
          <divider/>
          <text font-size="12pt" color="#555555">
            Thank you for your business.
          </text>
        </stack>
      </layout>
      <canvas>
        <layer page="each">
          <text x="0pt" y="756pt" anchor="bottom-left"
                font-size="9pt" color="#aaaaaa">lpdf.io</text>
        </layer>
      </canvas>
    </section>
  </document>
</lpdf>
```

Three things to notice:

- **`layout`** is the flow container — elements stack vertically and paginate automatically.
- **`canvas`** is the absolute-positioning layer — elements are placed by coordinates, independent of the flow.
- **`section`** is the page boundary — content that overflows creates additional pages automatically.
