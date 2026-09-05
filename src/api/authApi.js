import axiosInstance from "./axiosInstance";


export const registerUser = (data) => axiosInstance.post("/Auth/register", data);
export const loginUser = (data) => axiosInstance.post("/Auth/login", data);
export const logoutUser = (refreshToken) =>  axiosInstance.post("/Auth/logout", { refreshToken });
export const forgotPassword = (email) =>  axiosInstance.post("/Auth/forgot-password", { email });
export const resetPassword = (data) => axiosInstance.post("/Auth/reset-password", data);
export const refreshAccessToken = (refreshToken) =>  axiosInstance.post("/Auth/refresh-token", { refreshToken });


