import axios from "axios";

// Utility to handle errors consistently
const handleError = (error: any) => {
  if (axios.isAxiosError(error)) {
    // Log Axios-specific errors
    console.error("Axios error:", error.response?.data || error.message);
    return {
      success: false,
      error: error.response?.data || error.message,
    };
  } else {
    // General JS errors (network issues, etc)
    console.error("Unknown error:", error);
    return {
      success: false,
      error: error.message || "An unknown error occurred",
    };
  }
};

const signup = async (name: string, email: string, password: string, updateErrors: CallableFunction) => {
  axios.defaults.withCredentials = true;
  axios.defaults.withXSRFToken = true;

  try {
    const response = await axios.post(
      `${import.meta.env.VITE_SERVER_DOMAIN}/api/signup`,
      {
        name,
        email,
        password,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log("SUCCESSFULL")
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.log(error.response.data)
    if (error.response) {
      // Log the full error response if available
      const submissionErrors = {}
      for (let key in error.response.data.errors) {
        submissionErrors[key] = error.response.data.errors[key][0];
      }
      updateErrors(submissionErrors)
    }
  }
};

const getcsrf = async () => {
  axios.defaults.withCredentials = true;
  axios.defaults.withXSRFToken = true;

  try {
    const response = await axios.get(`${import.meta.env.VITE_SERVER_DOMAIN}/sanctum/csrf-cookie`);

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return error;
  }
};

export { signup, getcsrf };
