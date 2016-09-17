import axios from 'axios';
import {
  APP_ID,
  APP_SECRET,
  REDIRECT_URI,
} from '../constant/secret';

export async function fetchUser(fields, accessToken) {
  return await axios.get(
    `https://graph.facebook.com/me?fields=${fields}&access_token=${accessToken}`
  );
}

export async function fetchAccessToken(code) {
  return await axios.get(
    `https://graph.facebook.com/v2.3/oauth/access_token?client_id=${APP_ID}` +
    `&redirect_uri=${REDIRECT_URI}&client_secret=${APP_SECRET}&code=${code}`
  );
}
