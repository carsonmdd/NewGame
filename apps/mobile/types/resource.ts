export enum Difficulty {
	BEGINNER = 'BEGINNER',
	INTERMEDIATE = 'INTERMEDIATE',
	ADVANCED = 'ADVANCED',
}

export enum ResourceCategory {
	ARTICLE = 'ARTICLE',
	VIDEO = 'VIDEO',
	DOCUMENTATION = 'DOCUMENTATION',
	COURSE = 'COURSE',
}

export interface Resource {
	id: string;
	objectID: string;
	pk: 'RESOURCE';
	sk: string;
	title: string;
	description: string;
	url: string;
	difficulty: Difficulty;
	resourceType: ResourceCategory;
	tags: string[];
	saveCount: number;
	createdAt: string;
	updatedAt: string;
}
