// frontend/src/services/authService.js

import api from "../utils/api";

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

export const signup = async (username, password, email) => {
    try {
        const { data } = await api.post("/auth/signup", { username, password, email });
        return data;
    } catch (error) {
        handleError("Signup failed", error);
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