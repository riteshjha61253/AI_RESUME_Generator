import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL;

if (!baseURL) {
  throw new Error("VITE_API_URL is not defined");
}

export const axiosInstance = axios.create({
  baseURL,
});

export const generateResume = async (description) => {
  const token = localStorage.getItem("token");

  const response = await axiosInstance.post(
    "/api/v1/resume/generate",
    { userDescription: description },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};
