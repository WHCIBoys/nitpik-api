import User from '../model/user';
import jsonwebtoken from 'jsonwebtoken';
import * as S from '../constant/secret';
import * as Facebook from '../util/facebook';

export async function post(context) {
  const { query } = context;
  try {
    const facebookUser = await Facebook.fetchUser(['id', 'name'], query.access_token);
    const { data: { id: facebookId, name } } = facebookUser;

    const [user] = await User.findOrCreate({ where: { facebookId }, defaults: { name } });
    const jwt = jsonwebtoken.sign({}, S.JWT_SECRET, { subject: user.id, expiresIn: '5 days' });

    context.body = jwt;
    context.response.status = 201;
  } catch (error) {
    context.body = error.response.data;
    context.response.status = error.response.status;
  }
}

console.log(jsonwebtoken.decode('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE0NzQxNDIwOTgsImV4cCI6MTQ3NDU3NDA5OH0.XleMvFgbE1WdR2O5gi19X2sHPcxPbfPpYT0KpoB2c3E'));
