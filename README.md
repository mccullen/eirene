## Run
Use the npm scripts in package.json to run
### Dev
This is running the dev script in package.json. Notice that the ENV=dev is set here.
This is so that the basePath gets gets set to "/" in your local environment.
On gitlab, the basePath needs to be the project name because the gitlab page
url will be under the project name as its root rather than "/". See the logic in next.config.js
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

The page should auto-update as you edit files

## Deployment
### Gitlab
Gitlab will deploy on pushes to 'main' using the .gitlab-ci.yml. 

Gitlab cannot use the backend API as it can only host static pages. However, since our web page is static this is fine. 
To produce a static build, we just needed to set 
```
output: 'export'
```
in our next.config.js so our static web pages would be output to /out. 

We also need to do this
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

Gitlab deployment will be [here](https://mccullen.gitlab.io/eunomia/)

### Vercel
The Gitlab repo is already linked to vercel so that pushes to 'main' will result in vercel deployment.
The vercel deployment pipeline is defined under the project settings, but it essentially does the default, 
just runs "npm run build".

In order to make this work on both gitlab and vercel, the following project settings are used
- The NEXT_PUBLIC_NODE_ENV env variable is set to "vercel" so the basePath will be set correctly in next.config.js
- Git lfs is enabled (not necessary unless we decide to move our sqlite db to lfs)

The vercel deployment will be [here](https://eunomia.vercel.app/)

### API Routes
[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.


## Notes
- To deploy on vercel
  - Under project settings, set the NEXT_PUBLIC_NODE_ENV env variable to "vercel" so the basePath will be set correctly
  - Also, enable git lfs
- To deploy on gitlab
  - Check the .gitlab-ci.yml file
  - Essentially, we added 'export' to our next.config.js so that our static output would be generated and copied to the public directory