// services/authService.js
import api from "./api";

const handleError = (prefix, error) => {
  throw new Error(
    `${prefix}: ${error.response?.data?.message || error.message}`
  );
};

export const login = async (username, password) => {
  try {
    const { data } = await api.post("/auth/login", { username, password });
    return data;
  } catch (error) {
    handleError("Login failed", error);
  }
};

export const register = async (username, password, email) => {
  try {
    const { data } = await api.post("/auth/register", {
      username,
      password,
      email,
    });
    return data;
  } catch (error) {
    handleError("Registration failed", error);
  }
};

export const logout = async () => {
  try {
    const { data } = await api.post("/auth/logout");
    return data;
  } catch (error) {
    handleError("Logout failed", error);
  }
};

export const getCurrentUser = async () => {
  try {
    const { data } = await api.get("/auth/me");
    return data;
  } catch (error) {
    handleError("Fetching current user failed", error);
  }
};