import axios from 'axios';
import { Resource, ResourceInput } from '@/types/resource';

const api = axios.create({
	baseURL:
		process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api',
});

interface ApiResponse<T> {
	data: T;
}

export const resourceApi = {
	getAll: () => api.get<ApiResponse<Resource[]>>('/resources'),
	create: (data: { items: ResourceInput[] }) =>
		api.post<Resource[]>('/resources', data),
	update: (sk: string, data: ResourceInput) =>
		api.put<Resource>(`/resources/${sk}`, data),
	delete: (sk: string) => api.delete(`/resources/${sk}`),
};
