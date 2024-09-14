[Eirene](https://eirene.netlify.app/) is a playground for standardized observational health analytics using the OMOP Common Data Model.

It allows you to query the [Eunomia Datasets](https://github.com/OHDSI/EunomiaDatasets) in sqlite in the browser. 

[![Netlify Status](https://api.netlify.com/api/v1/badges/f343dd48-834e-4ac1-9202-81a1af29091e/deploy-status)](https://app.netlify.com/sites/eirene/deploys)

## Run
Use the npm scripts in package.json to run
### Dev
This is running the dev script in package.json. Notice that the ENV=dev is set here.
This is so that the basePath gets gets set to "/" in your local environment.
On gitlab, the basePath needs to be the project name because the gitlab page
url will be under the project name as its root rather than "/". See the logic in next.config.js

To use backend functions
```bash
netlify dev
```

If you don't need backend functions, you can do
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

The page should auto-update as you edit files

## Deployment
To produce a static build, we just needed to set 
```
output: 'export'
```
in our next.config.js so our static web pages would be output to /out. 

We also do this
```javascript
eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  }
```
We turn off eslint because it doesn't like that there are backend APIs in my app
despite the fact that we are generating a static export. It can also 
be rather annoying when it is fine in development and then it crashes in
production just because the linter got upset. 

### Netlify
This GitHub repo is already linked to netlify so that pushes to 'main' will result in deployment.
The netlify deployment pipeline is defined under the project settings, but it essentially does the default, 
just runs "npm run build".

## Notes
- To deploy on vercel
  - Under project settings, set the NEXT_PUBLIC_NODE_ENV env variable to "vercel" so the basePath will be set correctly
  - Also, enable git lfs
  - Also, override npm install to npm install --force
- To deploy on gitlab
  - Check the .gitlab-ci.yml file
  - Essentially, we added 'export' to our next.config.js so that our static output would be generated and copied to the public directory
- 

