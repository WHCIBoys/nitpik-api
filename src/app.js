import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import createRouter from 'koa-router';
import send from 'koa-send';
import jsonwebtoken from 'jsonwebtoken';

import User from './model/user';
import Friendship from './model/friendship';
import * as Facebook from './util/facebook';

import * as C from './constant';
import * as S from './constant/secret';

import api from './api/index';
const router = createRouter();

const app = new Koa();

const RELATIVE_REDIRECT_URI = 'oauth2/facebook/callback';
const REDIRECT_URI = `${C.API}/${RELATIVE_REDIRECT_URI}/`;

router.get('/oauth2/facebook', async (context) => {
  context.redirect(
    `https://www.facebook.com/dialog/oauth?client_id=${S.APP_ID}&redirect_uri=${REDIRECT_URI}`
  );
});

router.get(`/${RELATIVE_REDIRECT_URI}`, async (context) => {
  const { query } = context;
  try {
    const { data: tokenInfo } = await Facebook.fetchAccessToken(REDIRECT_URI, query.code);
    const { access_token: accessToken } = tokenInfo;
    const { data: facebookUser } = await Facebook.fetchUser(['id', 'name'], accessToken);
    const { id: facebookId, name } = facebookUser;

    await User.sync();
    const [user] = await User.findOrCreate({ where: { facebookId }, defaults: { name } });

    const { data: { data: friends } } = await Facebook.fetchFriends(accessToken);

    console.log({ facebookFriends: friends });

    const friendships = friends.map(async (friend) => {
      const friendUser = await User.findOne({ where: { facebookId: friend.id } });
      return Friendship.findOrCreate({
        where: {
          userId: user.id,
          friendId: friendUser.id,
        },
      });
    });

    await Promise.all(friendships);
    const jwt = jsonwebtoken.sign({}, S.JWT_SECRET, { subject: user.id, expiresIn: '5 days' });

    context.redirect(`${C.FRONT_END}/login/facebook?access_token=${accessToken}&jwt=${jwt}`);
  } catch (error) {
    console.log(error);
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
