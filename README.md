# Gild & Grove

Static English product showcase and wholesale inquiry website for Gild & Grove.

## Preview locally

From this directory, run:

```sh
npx --yes wrangler@4.162.0 pages dev . --port 4173 --compatibility-date 2026-11-13
```

Then open `http://localhost:4173`.

This is a local Pages preview, without a deployment. It checks the clean HTML URLs,
`.html` redirects, and the custom 404 page. A basic Python file server does not
reproduce those routing rules. There is no build step or package manifest.

The wholesale inquiry form uses the existing Formspree endpoint in `index.html`. The public inquiry email is `sales@gildngrove.com`; backend notification recipients and delivery need separate verification. The browser handles loading, success, and failure states in `script.js`, with data-use information in `privacy.html`.

Keep the endpoint and existing field names when changing form presentation. Product
URLs and legacy inquiry option values remain stable. General inquiries start with
a neutral product choice. Browser tests must intercept Formspree requests before
clicking Submit; a simulated success is not proof of email delivery.

Fonts are served locally from `assets/fonts/` with their OFL license files.
Decorative icons are inline SVG, so navigation does not require an icon CDN.

## Building block products (2026-11-18)

Three independent wholesale inquiry pages are linked from the homepage and Home & Gift Decor collection. Their primary images use the original supplied photos with responsive WebP and JPG files. The cow source is limited to 800px; the crow and otter have 1200px variants.

Material, piece count, measurements, supplied components and commercial terms require confirmation. External marketplace images and numeric claims remain outside the public source and release package. They have not been promoted to supplied-product specifications.

Product inquiry option values exactly match the three English product names. Context help follows the selected product and retains the existing tin-design guidance only for tin inquiries. No form service or recipient was changed.


## 2027 graduation keychain (2026-11-20)

The series page is `/products/2027-graduation-keychain`, with ten valid color/design
options and gold-b as the default. Public option data is in
`assets/products/graduation-keychain-2027/options.js`; the corresponding forty
400/800px WebP/JPG files are reused without upscaling. Rose-gold A/B/C/D follow
the supplied image mapping, not the lettering used by the other colors.

The homepage and Home & Gift Decor collection link to the series. Variant deep
links use `?variant=<id>` on the detail page. Inquiry links use the existing
`product` parameter plus `variant`; the optional homepage color/design picker
submits the selected color, disc text and year. Clearing/changing the product
clears irrelevant variant fields. Existing Formspree fields and endpoint remain.

Material and individual packaging are supplier-listed. The 14.6g listing does
not specify net/gross weight. Physical and package dimensions, MOQ, samples,
lead time and customization terms require confirmation. No price or stock is
asserted. Internal supplier/research evidence is excluded from public assets.

For a release, copy only root HTML, styles.css, script.js, robots.txt, sitemap.xml,
products/, collections/ and assets/ into the deployment directory. Exclude
Git data, README, internal notes, backups, preview config and QA files.
