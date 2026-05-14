import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/okr";

const apiClient = axios.create({
  baseURL: `${BASE_URL}/api/v1`,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 20000,
});

// Request interceptor — attach auth token if present
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("okr_auth_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — unwrap ApiResponse<T> envelope
apiClient.interceptors.response.use(
  (response) => {
    // Backend wraps payloads as { success, message, data }
    const payload = response.data;
    if (payload && typeof payload === "object" && "data" in payload) {
      return { ...response, data: payload.data, message: payload.message };
    }
    return response;
  },
  (error) => {
    const message =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      "Network error";
    console.error("[API error]", error?.response?.status, message);
    return Promise.reject({ status: error?.response?.status, message, raw: error });
  }
);

export default apiClient;
