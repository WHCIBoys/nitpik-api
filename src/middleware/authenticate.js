import jsonwebtoken from 'jsonwebtoken';
import User from '../model/user';
import Boom from 'boom';
import * as S from '../constant/secret';

export default async function authenticate(context, next) {
  const token = context.request.header.authorization;
  try {
    const decoded = jsonwebtoken.verify(token, S.JWT_SECRET);
    const { sub: id } = decoded;
    context.user = await User.findOne({ where: { id } });
    await next();
  } catch (error) {
    context.body = Boom.unauthorized('Failed to authorize. Token could be invalid.');
    context.response.status = 401;
  }
}
