import createRouter from 'koa-router';

import * as friendships from './friendships';
import * as nits from './nits';
import * as users from './users';
import * as TokenGrant from './token-grant';
import authenticate from '../middleware/authenticate';
import db from '../db';

const router = createRouter();

router.get('/friendships', authenticate, sync(friendships.get));
router.get('/users/me', authenticate, sync(users.getMe));
router.get('/users/:id', authenticate, sync(users.get));
router.get('/nits', authenticate, sync(nits.get));
router.post('/nits', authenticate, sync(nits.post));
router.post('/token-grant', sync(TokenGrant.post));

function sync(fn) {
  return async (...args) => {
    await db.sync();
    return fn(...args);
  };
}

export default router;
