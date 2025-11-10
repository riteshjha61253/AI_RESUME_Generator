// ✅ ResumeService.js
import axios from "axios";

export const baseURLL = "http://localhost:8080";

// ✅ Create instance FIRST
export const axiosInstance = axios.create({
  baseURL: baseURLL,
});

export const generateResume = async (description) => {
  const token = localStorage.getItem("token");

  // ✅ axiosInstance must exist before generateResume
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
