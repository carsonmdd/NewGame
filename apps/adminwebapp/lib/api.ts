import axios from "axios";
import { Resource, ResourceInput } from "@/types/resource";

const api = axios.create({
	baseURL:
		process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api",
});

interface ApiResponse<T> {
	data: T;
}

export const resourceApi = {
	getAll: () => api.get<ApiResponse<Resource[]>>("/resources"),
	create: (data: ResourceInput) => api.post<Resource>("/resource", data),
	update: (pk: string, sk: string, data: ResourceInput) =>
		api.put<Resource>(`/resource/${pk}/${sk}`, data),
	delete: (pk: string, sk: string) => api.delete(`/resource/${pk}/${sk}`),
};
