import axios from "axios";
import { getAccessToken, setAccessToken } from "../auth/authStore";

//  Main API instance (used everywhere)
const api = axios.create({
  baseURL: "https://ras-new-backend.onrender.com/api",
  withCredentials: true,
});

// Separate instance for refresh (NO interceptors)
const refreshApi = axios.create({
  baseURL: "https://ras-new-backend.onrender.com/api",
  withCredentials: true,
});

// Attach access token to requests
api.interceptors.request.use((config) => {
  const token = getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Handle 401 and refresh token automatically
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    // prevent infinite loop
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/refresh")
    ) {
      originalRequest._retry = true;

      try {
        // use refreshApi (no interceptor loop)
        const res = await refreshApi.post("/auth/refresh");

        const newToken = res.data.accessToken;

        // save new access token
        setAccessToken(newToken);

        // retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        return api(originalRequest);
      } catch (err) {
        // refresh failed → user needs to login again
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
