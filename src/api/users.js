import User from '../model/user';

export async function get(context) {
  await User.sync();
  const { id } = context.params;
  context.body = await User.findOne({
    where: { id },
  });
}

export async function post(context) {
  await User.sync();
  context.body = await User.create(context.request.body);
}
