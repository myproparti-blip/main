import axios from "axios";

// For local testing on the same machine as Expo
const api = axios.create({
  baseURL: "http://localhost:5000/api", // local backend
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
