import axios from 'axios';
import { Resource } from '@/types/resource';

const api = axios.create({
	baseURL:
		process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:3000/api',
});

export interface DiscoverResponse {
	new: Resource[];
	trending: Resource[];
}

export const resourceApi = {
	discover: () => api.get<DiscoverResponse>('/discover'),
};
