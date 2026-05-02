# SolarCalc Inference Image Prompts

Brand constraints for every image:
- Primary orange: `#FF6B00`
- Deep blue: `#0B3C5D`
- Dark blue: `#082C44`
- WhatsApp green accent: `#25D366`
- Visual language: premium Brazilian solar company, clean SaaS product, rooftop solar panels, savings calculator, qualified WhatsApp lead, warm sunlight, no generic stock-photo feeling.

Generated with `openai/gpt-image-2@4e59fv73`.

## Final Assets

| Asset | Local file | Task ID | Source URL |
| --- | --- | --- | --- |
| Hero background | `public/solarcalc-hero-bg.png` | `05evfpgbw8y38zz076w8qb38qp` | `https://cloud.inference.sh/app/files/t/34hpyhyd/99fr5sqi.png` |
| Hero A2 cinematic option | `public/solarcalc-hero-a2-cinematic.png` | `7mpgzv7ejc50d29vhh560qg88r` | `https://cloud.inference.sh/app/files/t/34hpyhyd/s6nb0x7u.png` |
| Hero A2 product option | `public/solarcalc-hero-a2-product.png` | `1zcdpa9amq1kpvmvff34f4rm4t` | `https://cloud.inference.sh/app/files/t/34hpyhyd/1atal4ox.png` |
| Hero A2 premium option | `public/solarcalc-hero-a2-premium.png` | `2qvqcy6bkjdy5p3dazvys7z0tg` | `https://cloud.inference.sh/app/files/t/34hpyhyd/zksno9st.png` |
| Flow step 01 | `public/solarcalc-flow-01.png` | `0jqm1htg3abvdjneg6zqy1r7xh` | `https://cloud.inference.sh/app/files/t/34hpyhyd/zv6nskn0.png` |
| Flow step 02 | `public/solarcalc-flow-02.png` | `32kv1x37zn2ha1b63kevyzz7ep` | `https://cloud.inference.sh/app/files/t/34hpyhyd/n9f2x1x7.png` |
| Flow step 03 | `public/solarcalc-flow-03.png` | `3ry4rt8607ryrvpzwpmz3adz0m` | `https://cloud.inference.sh/app/files/t/34hpyhyd/uvd4o1cu.png` |
| Flow step 04 | `public/solarcalc-flow-04.png` | `41c20kpeg5zxq96h9vymhp93kc` | `https://cloud.inference.sh/app/files/t/34hpyhyd/xhsvsy5b.png` |

## Hero Background

```bash
belt app run openai/gpt-image-2@4e59fv73 --input '{
  "prompt": "Premium Brazilian solar energy landing page hero background. Modern residential rooftop with dark blue solar panels, warm orange sunrise glow matching #FF6B00, deep navy atmosphere matching #0B3C5D and #082C44, cinematic commercial photography, clean negative space on the left for headline, no interface overlays, no dashboards, no text, no logos, no people, no purple, no beige, no generic stock photo look.",
  "quality": "high",
  "width": 1536,
  "height": 1024,
  "output_format": "png",
  "n": 1
}'
```

## Flow Step 01

```bash
belt app run openai/gpt-image-2@4e59fv73 --input '{
  "prompt": "Premium vertical card image for a Brazilian solar SaaS landing page, step 1: a qualified customer arrives from an Instagram ad or referral to a solar calculator landing page. Show a modern smartphone in hand with abstract solar-themed landing page shapes, warm orange #FF6B00 accent, deep blue #0B3C5D environment, realistic commercial photography, no readable text, no logos, no UI text, no people faces, consistent premium style.",
  "quality": "high",
  "width": 1024,
  "height": 1280,
  "output_format": "png",
  "n": 1
}'
```

## Flow Step 02

```bash
belt app run openai/gpt-image-2@4e59fv73 --input '{
  "prompt": "Premium vertical card image for a Brazilian solar SaaS landing page, step 2: customer simulates their monthly energy bill in a solar savings calculator. Show close-up of hand using a clean calculator interface with solar panel reflections, orange #FF6B00 controls, deep navy #0B3C5D background, WhatsApp green as tiny accent, no readable text, no logos, no people faces, realistic commercial product photography.",
  "quality": "high",
  "width": 1024,
  "height": 1280,
  "output_format": "png",
  "n": 1
}'
```

## Flow Step 03

```bash
belt app run openai/gpt-image-2@4e59fv73 --input '{
  "prompt": "Premium vertical card image for a Brazilian solar SaaS landing page, step 3: solar savings result appears after calculation. Show abstract dashboard-like visual without readable text, large orange glow and clean energy savings feeling, solar panels in the background, brand palette #FF6B00 #0B3C5D #082C44, realistic premium product-marketing style, no logos, no readable text, no people.",
  "quality": "high",
  "width": 1024,
  "height": 1280,
  "output_format": "png",
  "n": 1
}'
```

## Flow Step 04

```bash
belt app run openai/gpt-image-2@4e59fv73 --input '{
  "prompt": "Premium vertical card image for a Brazilian solar SaaS landing page, step 4: qualified solar lead arrives in WhatsApp for the sales team. Show smartphone with abstract chat bubbles and solar panel reflection, green #25D366 accent, orange #FF6B00 notification glow, deep navy #0B3C5D background, no readable text, no logos, no people faces, realistic commercial photography.",
  "quality": "high",
  "width": 1024,
  "height": 1280,
  "output_format": "png",
  "n": 1
}'
```
