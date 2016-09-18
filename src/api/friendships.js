import Boom from 'boom';
import { decorateWithBoom } from '../util';
import Friendship from '../model/friendship';

export async function get(context) {
  await Friendship.sync();
  try {
    const friendships = await Friendship.findAll({
      where: {
        userId: context.user.id,
      },
    });
    context.body = await Promise.all(friendships.map(async (friendship) => {
      return Object.assign(friendship.toJSON(), {
        user: Object.assign({}, (await friendship.getUser()).toJSON()),
        friend: Object.assign({}, (await friendship.getFriend()).toJSON()),
      });
    }));
  } catch (error) {
    console.error(error);
    const boom = Boom.badImplementation('Failed to fetch friendships for logged in user.');
    decorateWithBoom(boom, context);
  }
}
