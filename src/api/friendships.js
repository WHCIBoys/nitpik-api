import Boom from 'boom';
import { decorateWithBoom } from '../util';
import Friendship from '../model/friendship';

export async function get(context) {
  await Friendship.sync();
  try {
    context.body = await Friendship.findAll({
      where: {
        userId: context.user.id,
      },
    });
  } catch (error) {
    const boom = Boom.badImplementation('Failed to fetch friendships for logged in user.');
    decorateWithBoom(boom, context);
  }
}
