import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import createRouter from 'koa-router';
import send from 'koa-send';
import axios from 'axios';

import {
  APP_ID,
  APP_SECRET,
  REDIRECT_URI,
} from './constant/secret';

const app = new Koa();
const router = createRouter();

router.get('/oauth2/facebook', async (context ) => {
  context.redirect(
    `https://www.facebook.com/dialog/oauth?client_id=${APP_ID}&redirect_uri=${REDIRECT_URI}`
  );
});

router.get('/oauth2/facebook/callback', async (context ) => {
  const { code } = context.query;
  const response = await axios.get(
    `https://graph.facebook.com/v2.3/oauth/access_token?client_id=${APP_ID}` +
    `&redirect_uri=${REDIRECT_URI}&client_secret=${APP_SECRET}&code=${code}`
  );
  context.body = response.data;
});

router.get('/', async (context) => {
  await send(context, 'index.html');
});

app
  .use(bodyParser())
  .use(router.routes())
  .use(router.allowedMethods());

app.use(async (context) => {
  context.body = context.request.body;
});

export default app;
