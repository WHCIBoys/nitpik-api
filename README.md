# Nitpik API

An API written for Nitpik

## Architecture
This server is built with Koa.js 2.0. It uses Facebook OAuth2 for authentication.

## Development
```BASH
# start dev-server
> npm run dev

# lint
> npm run lint
```

## Secrets
By default, a `src/constant/secret.js` file is required. It will expose the following facebook-specific configuration:

```JavaScript
import { PORT } from './index';

export const APP_ID = 'get id from developer.facebook.com';
export const APP_SECRET = 'get secret from developer.facebook.com';
export const REDIRECT_URI = `http://local.me:${PORT}/oauth2/facebook/callback`;
```
