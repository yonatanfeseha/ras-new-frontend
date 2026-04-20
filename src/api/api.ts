import axios from "axios";
import { getAccessToken, setAccessToken } from "../auth/authStore";

const api = axios.create({
  baseURL: "https://ras-new-backend.onrender.com/api",
  withCredentials: true,
});

// attach token
api.interceptors.request.use((config) => {
  const token = getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// auto refresh
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const res = await axios.post(
          "/auth/refresh",
          {},
          { withCredentials: true },
        );

        const newToken = res.data.accessToken;

        setAccessToken(newToken);

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (err) {
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
