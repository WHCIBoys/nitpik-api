import Nit from '../model/nit';
import Boom from 'boom';
import { decorateWithBoom } from '../util/index';

export async function get(context) {
  await Nit.sync();
  const { query: { authorId, userId } } = context;

  console.log({ authorId, userId });

  try {
    const nits = await Nit.findAll({
      where: { authorId, userId },
    });

    console.log({ nits });

    context.body = await Promise.all(nits.map(async (nit) => {
      return Object.assign(nit.toJSON(), {
        user: (await nit.getUser()).toJSON(),
        author: (await nit.getAuthor()).toJSON(),
      });
    }));
    context.response.status = 200;
  } catch (error) {
    console.error(error);
    const boom = Boom.badImplementation('Failed to fetch nits');
    decorateWithBoom(boom, context);
  }
}

export async function post(context) {
  await Nit.sync();
  try {
    const nit = Nit.build(context.request.body);
    try {
      await nit.save();
      context.body = nit.toJSON();
      context.response.status = 201;
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
