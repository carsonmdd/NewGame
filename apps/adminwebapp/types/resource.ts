export interface Resource {
	pk: string;
	sk: string;
	id: string;
	title: string;
	description: string;
	resourceType: "model" | "texture" | "script" | "audio" | "video";
	url: string;
	tags: string[];
	difficulty: "beginner" | "intermediate" | "advanced";
	createdAt: string;
}

export type ResourceInput = Omit<Resource, "pk" | "sk" | "id" | "createdAt">;
