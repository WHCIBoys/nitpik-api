import User from '../model/user';
import Friendship from '../model/friendship';
import jsonwebtoken from 'jsonwebtoken';
import * as S from '../constant/secret';
import * as Facebook from '../util/facebook';

export async function post(context) {
  const { query } = context;
  try {
    const facebookUser = await Facebook.fetchUser(['id', 'name'], query.access_token);
    const { data: { id: facebookId, name } } = facebookUser;

    await User.sync();
    const [user] = await User.findOrCreate({ where: { facebookId }, defaults: { name } });

    const { data: { data: friends } } = await Facebook.fetchFriends(query.access_token);

    console.log(JSON.stringify({ friends }, null, 4));

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

    context.body = { jwtToken: jwt, userId: user.id };
    context.response.status = 201;
  } catch (error) {
    context.body = error.response.data;
    context.response.status = error.response.status;
  }
}
