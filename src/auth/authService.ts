import api from "../api/api";
import { setAccessToken } from "./authStore";

export const login = async (id: string, password: string) => {
  const res = await api.post("/auth/login", { id, password });

  setAccessToken(res.data.accessToken);

  return res.data;
};

export const refresh = async () => {
  const res = await api.post("/auth/refresh");
  setAccessToken(res.data.accessToken);
};
