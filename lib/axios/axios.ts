import axios from "axios";
import Cookies from "js-cookie";
import { BACKEND_URL, ROUTES } from "../utils";

const apiClient = axios.create({
	baseURL: BACKEND_URL,
	timeout: 10000,
	headers: {
		"Content-Type": "application/json",
		Accept: "application/json",
	},
	withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
	const accessToken = Cookies.get("accessToken");

	if (accessToken) {
		config.headers.Authorization = `Bearer ${accessToken}`;
	}

	return config;
});

apiClient.interceptors.response.use(
	(res) => res,
	(err) => {
		if (err.response?.status === 401) {
			Cookies.remove("accessToken");

			window.location.href = ROUTES.signin;
		}

		return Promise.reject(err);
	},
);

export default apiClient;
