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

apiClient.defaults.withCredentials = true;

// apiClient.interceptors.response.use(
// 	(res) => res,
// 	(err) => {
// 		if (err.response?.status === 401) {
// 			Cookies.remove("accessToken");
//
// 			const isAdminRoutes = window.location.pathname.startsWith("/admin");
//
// 			window.location.href = isAdminRoutes
// 				? ROUTES.adminSite.signin
// 				: ROUTES.mainSite.signin;
// 		}
//
// 		return Promise.reject(err);
// 	},
// );

export default apiClient;
