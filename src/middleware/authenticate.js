import jsonwebtoken from 'jsonwebtoken';
import User from '../model/user';
import Boom from 'boom';
import { decorateWithBoom } from '../util';
import * as S from '../constant/secret';

export default async function authenticate(context, next) {
  const token = context.request.header.authorization;
  try {
    const decoded = jsonwebtoken.verify(token, S.JWT_SECRET);
    const { sub: id } = decoded;
    context.user = await User.findOne({ where: { id } });

    if (context.user === null) {
      throw new Error('User does not exist.');
    }

    await next();
  } catch (error) {
    const boom = Boom.unauthorized(`Failed to authenticate. ${error.message}`);
    decorateWithBoom(boom, context);
  }
}
