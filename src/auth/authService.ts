//authService.ts

import api from "../api/api";
import { setAccessToken } from "./authStore";

export const login = async (id: string, password: string) => {
  const res = await api.post("/auth/login", { id, password });

  setAccessToken(res.data.accessToken);

  return res.data;
};

export const refresh = async () => {
  try {
    const res = await api.post("/auth/refresh");
    setAccessToken(res.data.accessToken);
    return res.data;
  } catch (err: any) {
    if (err.response?.status === 401 || err.response?.status === 403) {
      return null;
    }

    throw err;
  }
};
