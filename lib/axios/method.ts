import apiClient from "./axios";

export const POST = async (route: string, data?: any) => {
	const res = await apiClient.post(route, data);

	return res.data;
};

export const GET = async (route: string) => {
	const res = await apiClient.get(route);

	return res.data;
};
