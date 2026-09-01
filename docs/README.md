# HealthSphere AI Website

This is the browser-ready front-end for the HealthSphere AI platform.

## Local use

Open the site from the project folder:

```bash
cd "HealthSphere AI/website"
python -m http.server 8002
```

Then visit:

http://localhost:8002

## Public deployment

This site is static and can be deployed to Netlify or Vercel.

Set the backend URL in `config.js` before deployment:

```js
window.HEALTHSPHERE_API_URL = 'https://your-backend-domain.example.com';
```

Then host the folder as a static site.
