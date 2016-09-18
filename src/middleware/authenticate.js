import jsonwebtoken from 'jsonwebtoken';
import Boom from 'boom';
import * as S from '../constant/secret';

export default async function authenticate(context, next) {
  const token = context.request.header.authorization;
  try {
    jsonwebtoken.verify(token, S.JWT_SECRET);
    await next();
  } catch (error) {
    context.body = Boom.unauthorized('Invalid token.');
    context.response.status = 401;
  }
}
