"use client";
import { useMemo, useState } from "react";
import { Resource, ResourceInput } from "@/types/resource";
import OpenAI from "openai";

interface Props {
	initialData?: Resource;
	onSubmit: (data: ResourceInput) => void;
	onCancel: () => void;
}

const openai = new OpenAI({
	apiKey: "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",
	dangerouslyAllowBrowser: true,
});

// Add tags in
const TAG_OPTIONS = ["Blue", "Red", "Green", "Cat", "Dog", "Bird"] as const;

type TagOption = (typeof TAG_OPTIONS)[number];

export default function ResourceForm({
	initialData,
	onSubmit,
	onCancel,
}: Props) {
	// 1. Define your default "Empty" state for new resources
	const defaults: ResourceInput = {
		title: "",
		description: "",
		resourceType: "video",
		url: "",
		tags: [],
		difficulty: "beginner",
		saveCount: 0,
	};

	// 2. Initialize state by merging defaults with whatever initialData actually contains
	const [formData, setFormData] = useState<ResourceInput>({
		...defaults,
		...(initialData || {}),
	});

	// Optional: quick filter/search for tag list
	const [tagQuery, setTagQuery] = useState("");

	// Can add evidence tagging for console if needed
	const [autoTagLoading, setAutoTagLoading] = useState(false);
	const [autoTagEvidence, setAutoTagEvidence] = useState<string[]>([]);

	const filteredTags = useMemo(() => {
		const q = tagQuery.trim().toLowerCase();
		if (!q) return TAG_OPTIONS;
		return TAG_OPTIONS.filter((t) => t.toLowerCase().includes(q));
	}, [tagQuery]);

	const toggleTag = (tag: TagOption) => {
		setFormData((prev) => {
			const exists = prev.tags.includes(tag);
			const nextTags = exists
				? prev.tags.filter((t) => t !== tag)
				: [...prev.tags, tag];
			return { ...prev, tags: nextTags };
		});
	};

	const removeTag = (tag: string) => {
		setFormData((prev) => ({
			...prev,
			tags: prev.tags.filter((t) => t !== tag),
		}));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSubmit({ ...formData, url: formData.url.trim() });
	};

	return (
		<form
			onSubmit={handleSubmit}
			className='p-6 border border-gray-200 rounded-lg bg-white space-y-4 shadow-sm text-slate-900'
		>
			<h3 className='font-bold text-lg border-b pb-2'>
				{initialData ? "Edit Resource" : "Create New Resource"}
			</h3>

			<div className='space-y-1'>
				<label className='text-xs font-bold uppercase text-gray-500'>
					Title
				</label>
				<input
					className='w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none'
					placeholder='e.g. Unity Physics Tutorial'
					value={formData.title}
					onChange={(e) =>
						setFormData({ ...formData, title: e.target.value })
					}
					required
				/>
			</div>

			<div className='space-y-1'>
				<label className='text-xs font-bold uppercase text-gray-500'>
					Resource URL
				</label>
				<input
					type='url'
					className='w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none'
					placeholder='https://youtube.com/watch?v=...'
					value={formData.url}
					onChange={(e) =>
						setFormData({ ...formData, url: e.target.value })
					}
					required
				/>
			</div>

			<div className='space-y-1'>
				<label className='text-xs font-bold uppercase text-gray-500'>
					Description
				</label>
				<textarea
					className='w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none'
					placeholder='Briefly explain what this resource covers...'
					value={formData.description}
					onChange={(e) =>
						setFormData({
							...formData,
							description: e.target.value,
						})
					}
				/>
			</div>

			<div className='grid grid-cols-2 gap-4'>
				<div className='space-y-1'>
					<label className='text-xs font-bold uppercase text-gray-500'>
						Type
					</label>
					<select
						className='w-full p-2 border border-gray-300 rounded outline-none bg-white'
						value={formData.resourceType}
						onChange={(e) =>
							setFormData({
								...formData,
								resourceType: e.target.value as any,
							})
						}
					>
						<option value='video'>Video</option>
						<option value='guide'>Guide</option>
						<option value='audio'>Audio</option>
						<option value='model'>Model</option>
						<option value='texture'>Texture</option>
						<option value='script'>Script</option>
					</select>
				</div>

				<div className='space-y-1'>
					<label className='text-xs font-bold uppercase text-gray-500'>
						Difficulty
					</label>
					<select
						className='w-full p-2 border border-gray-300 rounded outline-none bg-white'
						value={formData.difficulty || "beginner"}
						onChange={(e) =>
							setFormData({
								...formData,
								difficulty: e.target.value as any,
							})
						}
					>
						<option value='beginner'>Beginner</option>
						<option value='intermediate'>Intermediate</option>
						<option value='advanced'>Advanced</option>
					</select>
				</div>
			</div>

			{/* Tags section */}
			<div className='space-y-2'>
				<div className='flex items-center justify-between gap-3'>
					<label className='text-xs font-bold uppercase text-gray-500'>
						Tags
					</label>

					{/* Optional search box for tags */}
					<input
						className='w-56 p-2 border border-gray-300 rounded outline-none text-sm'
						placeholder='Search tags…'
						value={tagQuery}
						onChange={(e) => setTagQuery(e.target.value)}
					/>
				</div>

				{/* Selected tags as chips */}
				{formData.tags.length > 0 && (
					<div className='flex flex-wrap gap-2'>
						{formData.tags.map((tag) => (
							<button
								key={tag}
								type='button'
								onClick={() => removeTag(tag)}
								className='px-3 py-1 rounded-full border text-sm bg-gray-50 hover:bg-gray-100'
								title='Remove tag'
							>
								#{tag}{" "}
								<span className='ml-1 text-gray-500'>×</span>
							</button>
						))}
					</div>
				)}

				{/* Tag options */}
				<div className='flex flex-wrap gap-2 p-3 border border-gray-200 rounded'>
					{filteredTags.map((tag) => {
						const selected = formData.tags.includes(tag);
						return (
							<label
								key={tag}
								className={`px-3 py-1 rounded-full border text-sm cursor-pointer select-none transition-colors ${
									selected
										? "bg-blue-600 text-white border-blue-600"
										: "bg-white hover:bg-gray-50"
								}`}
							>
								<input
									type='checkbox'
									className='hidden'
									checked={selected}
									onChange={() => toggleTag(tag)}
								/>
								#{tag}
							</label>
						);
					})}
				</div>
			</div>

			{/* Auto Tag Button */}
			<button
				type='button'
				disabled={autoTagLoading}
				onClick={async () => {
					try {
						setAutoTagLoading(true);
						setAutoTagEvidence([]);

						const res = await fetch("/api/auto-tag", {
							method: "POST",
							headers: { "Content-Type": "application/json" },
							body: JSON.stringify({
								title: formData.title,
								description: formData.description,
								url: formData.url,
								resourceType: formData.resourceType,
							}),
						});

						if (!res.ok) {
							const txt = await res.text();
							throw new Error(`HTTP ${res.status} - ${txt}`);
						}

						const data: { tags: string[]; evidence: string[] } =
							await res.json();

						// Overwrite tags with AI result (or merge if you prefer)
						setFormData((prev) => ({ ...prev, tags: data.tags }));
						setAutoTagEvidence(data.evidence ?? []);
					} catch (e: any) {
						alert(`Auto tag failed: ${e?.message ?? e}`);
					} finally {
						setAutoTagLoading(false);
					}
				}}
				className='bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded text-sm font-medium transition disabled:opacity-60'
			>
				{autoTagLoading ? "Tagging..." : "Auto Tag"}
			</button>

			{/* Save and Cancel Buttons */}
			<div className='flex gap-2 pt-4'>
				<button
					type='submit'
					className='bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-medium transition-colors hover:cursor-pointer'
				>
					Save Resource
				</button>

				<button
					type='button'
					onClick={onCancel}
					className='bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded font-medium transition-colors hover:cursor-pointer'
				>
					Cancel
				</button>
			</div>
		</form>
	);
}
