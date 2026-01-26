"use client";
import { useState } from "react";
import { Resource, ResourceInput } from "@/types/resource";

interface Props {
	initialData?: Resource;
	onSubmit: (data: ResourceInput) => void;
	onCancel: () => void;
}

export default function ResourceForm({
	initialData,
	onSubmit,
	onCancel,
}: Props) {
	const [formData, setFormData] = useState<ResourceInput>({
		title: "",
		description: "",
		resourceType: "video",
		url: "",
		tags: [],
		difficulty: "beginner",
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		// Just to be safe, trim the URL to remove accidental whitespace
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

			<div className='flex gap-2 pt-4'>
				<button
					type='submit'
					className='bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-medium transition-colors'
				>
					Save Resource
				</button>
				<button
					type='button'
					onClick={onCancel}
					className='bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded font-medium transition-colors'
				>
					Cancel
				</button>
			</div>
		</form>
	);
}
