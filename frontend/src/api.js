import axios from "axios";

// Create an axios instance with the base URL of your Flask server
const api = axios.create({
  baseURL: "http://localhost:5000/api", // This points to your backend
});

export default api;
