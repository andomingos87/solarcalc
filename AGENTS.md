<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Product Positioning Rule

This app is a B2B landing page for SolarCalc. Its primary audience is solar energy entrepreneurs and solar company owners who are evaluating SolarCalc as a lead-generation product.

The calculator shown on this landing page is a functional B2B demo. It exists so the entrepreneur can simulate the experience, see SolarCalc's capability, and understand both sides of the value proposition:

- what the final customer would see when using a personalized calculator on the entrepreneur's own website;
- what the entrepreneur or sales team would receive as lead context, qualification, analysis, and WhatsApp-ready sales information.

Do not treat this landing-page calculator as the final B2C production calculator. In real customer deployments, calculators may be personalized per solar company and should only expose the customer-facing experience to that company's website visitors. The dual "client / seller" view is intentional on this LP because it is selling SolarCalc to entrepreneurs.

When improving this app, preserve the B2B demo framing unless the user explicitly asks to implement the production B2C embedded calculator variant.
