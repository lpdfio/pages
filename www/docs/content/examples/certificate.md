# Certificate

A single-page, canvas-heavy certificate. Decorative border, large centred heading, recipient name from data, signature line.

Demonstrates: canvas `rect` border, `text` with large font, `line` signature line, `img` logo, data binding.

```xml
<lpdf version="1">
  <assets>
    <font name="serif"     core="Times-Roman"/>
    <font name="serif-bold" core="Times-Bold"/>
    <font name="body"      core="Helvetica"/>
    <image name="logo" src="https://example.com/logo.png"/>
  </assets>
  <document size="letter" orientation="landscape" margin="72pt" font="body">
    <section>

      <canvas>
        <!-- outer border -->
        <layer page="each">
          <rect x="16pt" y="16pt" w="760pt" h="580pt"
                stroke="#b8860b" stroke-width="4pt" radius="4pt"/>
          <!-- inner accent border -->
          <rect x="24pt" y="24pt" w="744pt" h="564pt"
                stroke="#daa520" stroke-width="1pt" radius="3pt"/>
          <!-- logo top-right -->
          <img name="logo" anchor="top-right" x="-48pt" y="48pt"
               w="80pt" h="24pt"/>
        </layer>
      </canvas>

      <layout>
        <stack gap="l" justify="center" align="center" height="full">

          <!-- pre-title -->
          <text font-size="xs" color="#888888" align="center" font="body">
            THIS CERTIFICATE IS PROUDLY PRESENTED TO
          </text>

          <!-- recipient name -->
          <text font="serif-bold" font-size="xxl" color="#0f172a" align="center"
                data-value="recipient_name">
            Jane Smith
          </text>

          <divider color="#daa520" thickness="s" width="200pt"/>

          <!-- body text -->
          <text font="serif" font-size="m" color="#334155" align="center"
                width="480pt" line-height="1.7"
                data-value="body">
            In recognition of outstanding achievement and dedication
            in the field of software engineering.
          </text>

          <!-- date -->
          <text font-size="xs" color="#888888" align="center" data-value="date">
            May 4, 2026
          </text>

          <!-- signature row -->
          <split gap="xl" width="440pt">
            <stack gap="xs" align="center">
              <line x1="0pt" y1="0pt" x2="160pt" y2="0pt"
                    stroke="#aaaaaa" stroke-width="0.5pt"/>
              <text font-size="xs" color="#888888" align="center"
                    data-value="signer_name">Alex Johnson</text>
              <text font-size="xs" color="#aaaaaa" align="center"
                    data-value="signer_title">Chief Executive Officer</text>
            </stack>
            <stack gap="xs" align="center">
              <line x1="0pt" y1="0pt" x2="160pt" y2="0pt"
                    stroke="#aaaaaa" stroke-width="0.5pt"/>
              <text font-size="xs" color="#888888" align="center"
                    data-value="co_signer_name">Morgan Lee</text>
              <text font-size="xs" color="#aaaaaa" align="center"
                    data-value="co_signer_title">Director of Engineering</text>
            </stack>
          </split>

        </stack>
      </layout>

    </section>
  </document>
</lpdf>
```

## Sample data

```json
{
  "recipient_name": "Jane Smith",
  "body": "In recognition of outstanding achievement and dedication in the field of software engineering.",
  "date": "May 4, 2026",
  "signer_name": "Alex Johnson",
  "signer_title": "Chief Executive Officer",
  "co_signer_name": "Morgan Lee",
  "co_signer_title": "Director of Engineering"
}
```
