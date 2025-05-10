import axios from "axios";

// Backend Base URL
const BASE_URL = `http://localhost:4000`;

// Create Axios Instance
export const axiosI = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json", // Default Content Type
  },
});
