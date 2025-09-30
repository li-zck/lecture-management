import axios from "axios";
import { BACKEND_URL } from "../utils";

const apiClient = axios.create({
	baseURL: BACKEND_URL,
	timeout: 10000,
	headers: {
		"Content-Type": "application/json",
		Accept: "application/json",
	},
	// withCredentials: true,
});

apiClient.interceptors.response.use((config) => {
	const accessToken = localStorage.getItem("accessToken");

	if (accessToken) {
		config.headers.Authorization = `Bearer ${accessToken}`;
	}

	return config;
});

export default apiClient;
