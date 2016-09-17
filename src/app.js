import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import createRouter from 'koa-router';
import send from 'koa-send';
import jsonwebtoken from 'jsonwebtoken';

import User from './model/user';
import * as Facebook from './util/facebook';

import * as S from './constant/secret';

import api from './api/index';
const router = createRouter();

const app = new Koa();

router.get('/oauth2/facebook', async (context ) => {
  context.redirect(
    `https://www.facebook.com/dialog/oauth?client_id=${S.APP_ID}&redirect_uri=${S.REDIRECT_URI}`
  );
});

router.get('/oauth2/facebook/callback', async (context) => {
  const { query } = context;
  try {
    const { data: { access_token: accessToken } } = await Facebook.fetchAccessToken(query.code);
    const { data: facebookUser } = await Facebook.fetchUser(['id', 'name'], accessToken);
    const { id: facebookId, name } = facebookUser;

    const [user] = await User.findOrCreate({ where: { facebookId }, defaults: { name } });
    const jwt = jsonwebtoken.sign({}, S.JWT_SECRET, { subject: user.id, expiresIn: '5 days' });

    context.body = { jwt, access_token: accessToken };
    context.response.status = 200;
  } catch (error) {
    context.body = error.response.data;
    context.response.status = error.response.status;
  }
});

router.get('/', async (context) => {
  await send(context, 'index.html');
});

app
  .use(bodyParser())
  .use(api.routes())
  .use(api.allowedMethods())
  .use(router.routes())
  .use(router.allowedMethods());

app.use(async (context) => {
  context.body = context.request.body;
});

export default app;
