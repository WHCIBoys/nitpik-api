import axios from 'axios';
import {
  APP_ID,
  APP_SECRET,
} from '../constant/secret';

export async function fetchUser(fields, accessToken) {
  return await axios.get(
    `https://graph.facebook.com/me?fields=${fields}&access_token=${accessToken}`
  );
}

export async function fetchAccessToken(redirectUri, code) {
  return await axios.get(
    `https://graph.facebook.com/v2.3/oauth/access_token?client_id=${APP_ID}` +
    `&redirect_uri=${redirectUri}&client_secret=${APP_SECRET}&code=${code}`
  );
}
