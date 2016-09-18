import Nit from '../model/nit';
import Boom from 'boom';
import { decorateWithBoom } from '../util/index';

export async function get(context) {
  await Nit.sync();
  const { query: { authorId, userId } } = context;

  try {
    const nits = await Nit.findAll({
      where: { authorId, userId },
    });

    context.body = await Promise.all(nits.map(async (nit) => {
      return Object.assign(nit.toJSON(), {
        user: (await nit.getUser()).toJSON(),
        author: (await nit.getAuthor()).toJSON(),
      });
    }));
    context.response.status = 200;
  } catch (error) {
    const boom = Boom.badImplementation('Failed to fetch nits');
    decorateWithBoom(boom, context);
  }
}

export async function post(context) {
  await Nit.sync();
  try {
    const nit = Nit.build(context.body);
    try {
      await nit.save();
    } catch (error) {
      const boom = Boom.badImplementation('Failed to save Nit to database.', { nit, error });
      decorateWithBoom(boom, context);
    }
  } catch (error) {
    const message = 'Failed build the Nit.';
    const boom = Boom.unauthorized(message, error);
    decorateWithBoom(boom, context);
  }
}
