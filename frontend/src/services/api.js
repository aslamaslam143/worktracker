// import axios from 'axios';

// const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// const api = axios.create({
//   baseURL: API_BASE_URL,
// });

// export const setAuthTokenGetter = (tokenGetter) => {
//   api.interceptors.request.use(async (config) => {
//     try {
//       const token = await tokenGetter();
//       if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//       }
//     } catch (error) {
//       console.error('Error fetching auth token:', error);
//     }
//     return config;
//   });
// };

// export default api;

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://worktracker-pdeo.vercel.app/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor-ai global-a start-laye register panni vechidanum
let tokenGetterFn = null;

export const setAuthTokenGetter = (tokenGetter) => {
  tokenGetterFn = tokenGetter;
};

// Request pogum ovvoru thadavaiyum dynamic-a check panni wait pannum
api.interceptors.request.use(
  async (config) => {
    try {
      if (tokenGetterFn) {
        const token = await tokenGetterFn();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    } catch (error) {
      console.error('Error fetching auth token:', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;