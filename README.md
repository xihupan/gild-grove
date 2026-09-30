# Gild & Grove

Static English product showcase and wholesale inquiry website for Gild & Grove.

## Preview locally

From this directory, run:

```powershell
python -m http.server 4173
```

Then open `http://localhost:4173`.

The wholesale inquiry form submits through Formspree to `sales@gildngrove.com`. Its endpoint is configured in `index.html`, and the browser handles loading, success, and failure states in `script.js`. The form's data-use explanation is in `privacy.html`.
