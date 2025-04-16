// import axios from 'axios';

// const axiosInstance = axios.create({
//   withCredentials: false,
// });

// axiosInstance.interceptors.request.use(
//   (config) => {
//     // Only attach token if config has `auth: true`
//     console.log('config', config);
//     if (typeof window !== 'undefined' && config.headers?.['auth'] === 'true') {
//       const token = localStorage.getItem('user_token');
//       if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//       }
//     }

//     // Delete custom flags before sending
//     delete config.headers['auth'];

//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// axiosInstance.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       localStorage.clear();
//       // Redirect to home
//       window.location.href = '/';
//     }
//     return Promise.reject(error);
//   }
// );

// export default axiosInstance;
