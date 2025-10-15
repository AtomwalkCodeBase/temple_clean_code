import axios from "axios";
import { loginEndpoint } from "./ConstantServies";

export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(loginEndpoint, credentials);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getUserProfile = async () => {
  try {
    const token = localStorage.getItem("userToken");
    const response = await axios.get("https://agamandira.com/auth/user/", {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const logout = () => {
  localStorage.removeItem("userToken");
  localStorage.removeItem("customerToken");
  localStorage.removeItem("username");
  localStorage.removeItem("firstName");
  localStorage.removeItem("templeId");
};

export const isAuthenticated = () => {
  return !!(
    localStorage.getItem("userToken") || localStorage.getItem("customerToken")
  );
};

export const getStoredUsername = () => {
  return localStorage.getItem("username");
};

export const getStoredFirstName = () => {
  return localStorage.getItem("firstName");
};

export const getStoredTempleId = () => {
  return localStorage.getItem("templeId");
};
