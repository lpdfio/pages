# Report

A multi-page report: cover page with a background colour, then a content section with a running header and footer on every page using `region`.

Demonstrates: multiple `section`, canvas underlay for cover, `<region pin="top/bottom">` for running chrome, automatic pagination.

```xml
<lpdf version="1">
  <assets>
    <font name="body"    core="Helvetica"/>
    <font name="bold"    core="Helvetica-Bold"/>
    <font name="italic"  core="Helvetica-Oblique"/>
  </assets>
  <document size="a4" margin="48pt" font="body">

    <!-- ── Cover page ── -->
    <section>
      <canvas>
        <!-- dark background underlay -->
        <layer page="each">
          <rect x="0pt" y="0pt" w="595pt" h="842pt" fill="#0f172a"/>
          <rect x="0pt" y="560pt" w="595pt" h="282pt" fill="#1e3a5f"/>
        </layer>
      </canvas>
      <layout>
        <stack gap="xl" justify="between" height="full">
          <stack gap="m">
            <text font-size="xxl" font="bold" color="#ffffff">Annual Report</text>
            <text font-size="l" color="#94a3b8" data-value="year">2026</text>
          </stack>
          <stack gap="xs">
            <divider color="#334155" thickness="xs"/>
            <text font-size="s" color="#64748b" data-value="company">Acme Inc</text>
          </stack>
        </stack>
      </layout>
    </section>

    <!-- ── Content section ── -->
    <section>
      <layout>

        <!-- running header on every page -->
        <region pin="top" page="each">
          <flank align="center">
            <text font-size="xs" color="#64748b" data-value="company">Acme Inc</text>
            <text font-size="xs" color="#64748b" align="right">Annual Report 2026</text>
          </flank>
          <divider color="#e2e8f0" thickness="xs"/>
        </region>

        <!-- running footer on every page -->
        <region pin="bottom" page="each">
          <divider color="#e2e8f0" thickness="xs"/>
          <flank align="center">
            <text font-size="xs" color="#94a3b8">Confidential</text>
            <text font-size="xs" color="#94a3b8" align="right">lpdf.io</text>
          </flank>
        </region>

        <!-- page content — flows across pages automatically -->
        <stack gap="l">
          <text font-size="xl" font="bold">Executive Summary</text>
          <text font-size="m" align="justify" data-value="summary">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </text>

          <text font-size="xl" font="bold">Financial Highlights</text>
          <table cols="2fr 1fr 1fr" border="xs #e2e8f0" stripe="#f8fafc" padding="xs">
            <thead background="#f1f5f9">
              <td><text font="bold" font-size="xs">Metric</text></td>
              <td align="end"><text font="bold" font-size="xs">2025</text></td>
              <td align="end"><text font="bold" font-size="xs">2026</text></td>
            </thead>
            <tr data-source="financials">
              <td><text data-value="metric">Revenue</text></td>
              <td align="end"><text data-value="y2025">$0</text></td>
              <td align="end"><text data-value="y2026">$0</text></td>
            </tr>
          </table>
        </stack>

      </layout>
    </section>

  </document>
</lpdf>
```

## Sample data

```json
{
  "company": "Acme Inc",
  "year": "2026",
  "summary": "Revenue grew 24% year-over-year driven by new enterprise contracts and expansion into three new markets. Operating margin improved by 4 percentage points.",
  "financials": [
    { "metric": "Revenue",         "y2025": "$4.2M",  "y2026": "$5.2M"  },
    { "metric": "Gross Profit",    "y2025": "$2.1M",  "y2026": "$2.8M"  },
    { "metric": "Operating Income","y2025": "$620K",  "y2026": "$940K"  }
  ]
}
```
