"use client";

import { useState } from "react";
import { Resource, ResourceInput } from "@/types/resource";

interface Props {
	initialData?: ResourceInput;
	resource?: Resource | null;
	isEditing?: boolean;
	onSubmit: (data: ResourceInput) => void;
	onCancel: () => void;
	onDelete?: () => void;
}

export default function ResourceForm({
	initialData,
	resource,
	onSubmit,
	onCancel,
	onDelete,
}: Props) {
	const defaults: ResourceInput = {
		title: "",
		description: "",
		resourceType: "video",
		url: "",
		tags: [],
		difficulty: "beginner",
		saveCount: 0,
	};

	const [formData, setFormData] = useState<ResourceInput>({
		...defaults,
		...(initialData || {}),
	});

	const [tagInput, setTagInput] = useState("");
	const [showTagInput, setShowTagInput] = useState(
		(initialData?.tags?.length ?? 0) === 0,
	);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSubmit({
			...formData,
			title: formData.title.trim(),
			url: formData.url.trim(),
			description: formData.description.trim(),
		});
	};

	const addTag = () => {
		if (!showTagInput) {
			setShowTagInput(true);
			return;
		}

		const trimmed = tagInput.trim();
		if (!trimmed) return;

		if (formData.tags.includes(trimmed)) {
			setTagInput("");
			setShowTagInput(false);
			return;
		}

		setFormData((prev) => ({
			...prev,
			tags: [...prev.tags, trimmed],
		}));
		setTagInput("");
		setShowTagInput(false);
	};

	const removeTag = (tag: string) => {
		setFormData((prev) => ({
			...prev,
			tags: prev.tags.filter((t) => t !== tag),
		}));
	};

	const formatDate = (value?: string) => {
		if (!value) return "";
		const date = new Date(value);
		if (Number.isNaN(date.getTime())) return "";
		return date.toLocaleDateString();
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="relative w-full rounded-[26px] border-2 border-[#2D9CFF] bg-white px-12 pb-10 pt-10 shadow-xl text-[#222222]"
		>
			<button
				type="button"
				onClick={onCancel}
				className="absolute right-6 top-4 text-[34px] leading-none text-black hover:opacity-70"
				aria-label="Close"
				title="Close"
			>
				✕
			</button>

			<button
				type="submit"
				className="absolute right-10 top-[88px] flex h-[52px] w-[52px] items-center justify-center rounded-full bg-[#E8DDF4] text-[34px] leading-none text-black hover:opacity-80"
				aria-label="Save"
				title="Save"
			>
				+
			</button>

			<div className="space-y-7 pr-24">
				<div>
					<label className="mb-3 block text-[19px] font-normal">
						Resource title:
					</label>
					<input
						value={formData.title}
						onChange={(e) =>
							setFormData({ ...formData, title: e.target.value })
						}
						className="h-[44px] w-full rounded-[14px] bg-[#D9D9D9] px-5 outline-none"
						required
					/>
				</div>

				<div>
					<label className="mb-3 block text-[19px] font-normal">
						Resource url:
					</label>
					<input
						type="url"
						value={formData.url}
						onChange={(e) =>
							setFormData({ ...formData, url: e.target.value })
						}
						className="h-[44px] w-full rounded-[14px] bg-[#D9D9D9] px-5 outline-none"
						required
					/>
				</div>

				<div>
					<label className="mb-3 block text-[19px] font-normal">
						Description:
					</label>
					<textarea
						value={formData.description}
						onChange={(e) =>
							setFormData({
								...formData,
								description: e.target.value,
							})
						}
						rows={6}
						className="min-h-[170px] w-full resize-none rounded-[18px] bg-[#D9D9D9] px-5 py-4 outline-none"
					/>
				</div>

				<div>
					<label className="mb-3 block text-[19px] font-normal">
						Tags:
					</label>

					<div className="flex flex-wrap items-center gap-3">
						{formData.tags.map((tag) => (
							<button
								key={tag}
								type="button"
								onClick={() => removeTag(tag)}
								className="rounded-full bg-[#D9D9D9] px-4 py-2 text-[16px] text-[#444444] hover:opacity-80"
								title="Remove tag"
							>
								{tag}
							</button>
						))}

						{showTagInput && (
							<input
								value={tagInput}
								onChange={(e) => setTagInput(e.target.value)}
								onKeyDown={(e) => {
									if (e.key === "Enter") {
										e.preventDefault();
										addTag();
									}
								}}
								placeholder="Text"
								autoFocus
								className="h-[40px] w-[170px] rounded-full bg-[#D9D9D9] px-4 outline-none"
							/>
						)}

						<button
							type="button"
							onClick={addTag}
							className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-[#D9D9D9] text-[28px] leading-none text-black hover:opacity-80"
							aria-label="Add tag"
							title="Add tag"
						>
							+
						</button>
					</div>
				</div>
			</div>

			<div className="mt-10 grid grid-cols-3 gap-10 text-left">
				<div>
					<p className="mb-3 text-[18px]">Number of saves:</p>
					<div className="h-[34px] w-[150px] rounded-[12px] bg-[#D9D9D9] px-4 py-1 text-[16px]">
						{resource?.saveCount ?? formData.saveCount ?? 0}
					</div>
				</div>

				<div>
					<p className="mb-3 text-[18px]">Date created:</p>
					<div className="h-[34px] w-[150px] rounded-[12px] bg-[#D9D9D9] px-4 py-1 text-[16px]">
						{formatDate(resource?.createdAt)}
					</div>
				</div>

				<div>
					<p className="mb-3 text-[18px]">Date last updated:</p>
					<div className="h-[34px] w-[150px] rounded-[12px] bg-[#D9D9D9] px-4 py-1 text-[16px]">
						—
					</div>
				</div>
			</div>

			<div className="mt-8">
				<button
					type="button"
					onClick={onDelete}
					className="text-[18px] text-red-500 underline hover:opacity-80"
				>
				</button>
			</div>
		</form>
	);
}