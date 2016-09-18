import User from '../model/user';
import Boom from 'boom';
import { decorateWithBoom } from '../util/index';

export async function get(context) {
  await User.sync();
  const { id } = context.params;

  try {
    context.body = await User.findOne({
      where: { id },
    });
  } catch (error) {
    const boom = Boom.badImplementation(`Failed to fetch user with id ${id}.`, error);
    decorateWithBoom(boom, context);
  }
}
