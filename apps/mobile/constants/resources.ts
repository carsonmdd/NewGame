// constants/resources.ts

export type ResourceDef = {
	rid: number;
	fileType: string;
	title: string;
	content: string;
	description: string;
	date: string;
	creator: number;
	author: string;
};

export const RESOURCE_DEFS: ResourceDef[] = [
	{
		rid: 1,
		fileType: 'txt',
		title: 'Getting Started with Godot 4',
		content:
			'Godot 4 introduces the new GDScript 2.0 and highly optimized Vulkan rendering...',
		description:
			"A comprehensive beginner's guide to the Godot Engine ecosystem.",
		date: '2024-03-01',
		creator: 101,
		author: 'Alex Rivera',
	},
	{
		rid: 2,
		fileType: 'txt',
		title: 'Unity Shader Graph Basics',
		content:
			'Shaders are programs that run on the GPU. Shader Graph allows you to build them visually...',
		description:
			'Learn how to create visual effects in Unity without writing code.',
		date: '2024-03-05',
		creator: 102,
		author: 'Jordan Smith',
	},
	{
		rid: 3,
		fileType: 'txt',
		title: 'C# Optimization for Mobile Games',
		content:
			'Memory management is critical in React Native and Unity mobile builds. Avoid frequent allocations...',
		description:
			'Technical deep-dive into garbage collection and performance profiling.',
		date: '2024-03-10',
		creator: 103,
		author: 'Casey Chen',
	},
	{
		rid: 4,
		fileType: 'txt',
		title: 'Blender 3D Modeling Workflow',
		content:
			'Start with primitive shapes. Use the Mirror modifier to ensure character symmetry...',
		description:
			'Best practices for creating low-poly assets for indie games.',
		date: '2024-03-12',
		creator: 104,
		author: 'Taylor Reed',
	},
	{
		rid: 5,
		fileType: 'txt',
		title: 'AI Prompt Engineering for Game Assets',
		content:
			'Using OpenAI or Midjourney to generate concept art requires specific keyword structuring...',
		description:
			'How to integrate AI tools into your creative workflow responsibly.',
		date: '2024-03-15',
		creator: 105,
		author: 'Morgan Lee',
	},
	{
		rid: 6,
		fileType: 'txt',
		title: 'Sound Design with Reaper',
		content:
			'Reaper is a powerful DAW for game audio. Use the Batch File/Item Converter for rapid iteration...',
		description:
			'Setting up a professional audio pipeline for small teams.',
		date: '2024-03-18',
		creator: 106,
		author: 'Riley Quinn',
	},
];
