export interface Resource {
	pk: string;
	sk: string;
	id: string;
	url: string;
	title: string;
	source: string;
	author: string;
	date: string;
	license: string;
	centralClaim: string;
	coreKnowledge: string;
	practicalTakeaway: string;
	topicPosition: string;
	openQuestions: string;
	audience: string;
	decisionMoment: string;
	evergreen: string;
	sourceType: string;
	credibilityNotes: string;
	keywords: string[];
	adjacentTopics: string[];
	syntheticQuery1: string;
	syntheticQuery2: string;
	syntheticQuery3: string;
	createdAt: string;
	saveCount: number;
}
