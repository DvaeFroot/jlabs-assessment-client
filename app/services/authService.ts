import axiosInstance from "~/axiosInstance";
import axios from "axios";

const handleError = (error: any) => {
  if (axios.isAxiosError(error)) {
    console.error("Axios error:", error.response?.data || error.message);
    return {
      success: false,
      data: null,
      error: error.response?.data || error.message,
    };
  } else {
    console.error("Unknown error:", error);
    return {
      success: false,
      data: null,
      error: error.message || "An unknown error occurred",
    };
  }
};

const signup = async (name: string, email: string, password: string, updateErrors: CallableFunction) => {
  try {
    const response = await axiosInstance.post("/api/signup", {
      name,
      email,
      password,
    });
    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    updateErrors(error.response.data.errors)
    return handleError(error);
  }
};

const login = async (email: string, password: string, updateErrors: CallableFunction) => {
  try {
    const response = await axiosInstance.post("/api/login", {
      email,
      password,
    });
    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    updateErrors(error.response.data.errors)
    return handleError(error);
  }
};

const getcsrf = async () => {
  try {
    const response = await axiosInstance.get("/sanctum/csrf-cookie");
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return handleError(error);
  }
};

const getUser = async (token_type: string, access_token: string) => {
  try {
    const response = await axiosInstance.get("/api/me", {
      headers: {
        Authorization: `${token_type} ${access_token}`,
      },
    });
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return handleError(error);
  }
};

const logout = async (token_type: string, access_token: string) => {
  try {
    const response = await axiosInstance.post("/api/logout", {}, {
      headers: {
        Authorization: `${token_type} ${access_token}`,
      },
    });
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return handleError(error);
  }
};

export { signup, login, getcsrf, getUser, logout };
