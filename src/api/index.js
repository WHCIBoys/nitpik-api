import createRouter from 'koa-router';

import * as friendships from './friendships';
import * as nits from './nits';
import * as users from './users';
import * as TokenGrant from './token-grant';
import db from '../db';

const router = createRouter();

router.get('/friendships', sync(friendships.get));
router.get('/users/:id', sync(users.get));
router.post('/users', sync(users.post));
router.get('/nits', sync(nits.get));
router.post('/nits', sync(nits.post));
router.put('/nits/:id', sync(nits.put));
router.post('/token-grant', sync(TokenGrant.post));

function sync(fn) {
  return async (...args) => {
    await db.sync();
    return fn(...args);
  };
}

export default router;
