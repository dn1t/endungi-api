import _ from 'axios';
import { wrapper } from 'axios-cookiejar-support';
import { CookieJar } from 'tough-cookie';
import { FileCookieStore } from 'tough-cookie-file-store';

const jar = new CookieJar(new FileCookieStore('./cookie.json'));
const axios = wrapper(_.create({ jar, baseURL: 'https://playentry.org' }));

export default axios;
