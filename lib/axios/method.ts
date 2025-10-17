import { AxiosResponse } from "axios";
import apiClient from "./axios";

export type ApiResponse<T = unknown> = {
	data: T;
	status: number;
	res: AxiosResponse<T>;
};

export const POST = async <TResponse = unknown, TBody = unknown>(
	route: string,
	data: TBody,
): Promise<ApiResponse<TResponse>> => {
	const res: AxiosResponse<TResponse> = await apiClient.post(route, data);

	return {
		data: res.data,
		status: res.status,
		res,
	};
};

export const GET = async <T = unknown>(
	route: string,
): Promise<ApiResponse<T>> => {
	const res: AxiosResponse<T> = await apiClient.get(route);

	return {
		data: res.data,
		status: res.status,
		res,
	};
};

export const DEL = async <TResponse = unknown, TBody = unknown>(
	route: string,
	data?: TBody,
): Promise<ApiResponse<TResponse>> => {
	const res: AxiosResponse<TResponse> = await apiClient.delete(route, { data });

	return {
		data: res.data,
		status: res.status,
		res,
	};
};

export const PUT = async <TResponse = unknown, TBody = unknown>(
	route: string,
	data?: TBody,
): Promise<ApiResponse<TResponse>> => {
	const res: AxiosResponse<TResponse> = await apiClient.put(route, { data });

	return {
		data: res.data,
		status: res.status,
		res,
	};
};

export const PATCH = async <TResponse = unknown, TBody = unknown>(
	route: string,
	data?: TBody,
): Promise<ApiResponse<TResponse>> => {
	const res: AxiosResponse<TResponse> = await apiClient.put(route, { data });

	return {
		data: res.data,
		status: res.status,
		res,
	};
};
