'use client';

import { useState } from 'react';
import { Resource, ResourceInput } from '@/types/resource';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Plus, Save, Trash2, Tag as TagIcon } from 'lucide-react';

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
		title: '',
		description: '',
		resourceType: 'video',
		url: '',
		tags: [],
		difficulty: 'beginner',
		saveCount: 0,
	};

	const [formData, setFormData] = useState<ResourceInput>({
		...defaults,
		...(initialData || {}),
	});

	const [tagInput, setTagInput] = useState('');
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
			setTagInput('');
			setShowTagInput(false);
			return;
		}

		setFormData((prev) => ({
			...prev,
			tags: [...prev.tags, trimmed],
		}));
		setTagInput('');
		setShowTagInput(false);
	};

	const removeTag = (tag: string) => {
		setFormData((prev) => ({
			...prev,
			tags: prev.tags.filter((t) => t !== tag),
		}));
	};

	const formatDate = (value?: string) => {
		if (!value) return '—';
		const date = new Date(value);
		if (Number.isNaN(date.getTime())) return '—';
		return date.toLocaleDateString(undefined, {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
		});
	};

	return (
		<div className="relative w-full max-w-4xl mx-auto overflow-hidden">
			<form
				onSubmit={handleSubmit}
				className="bg-bg-elevated/60 backdrop-blur-2xl rounded-2xl shadow-2xl p-8 md:p-12"
			>
				<header className="flex items-center justify-between mb-10">
					<div>
						<h2 className="text-2xl font-semibold tracking-tight text-foreground">
							{resource ? 'Edit Resource' : 'Create New Resource'}
						</h2>
						<p className="text-sm text-muted-foreground mt-1">
							Fill in the details below to update the platform
							catalog.
						</p>
					</div>
					<Button
						variant="ghost"
						size="icon"
						onClick={onCancel}
						className="rounded-full"
					>
						<X className="size-5" />
					</Button>
				</header>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
					<div className="space-y-6">
						<div className="space-y-2">
							<label className="text-sm font-medium text-foreground/80">
								Resource Title
							</label>
							<Input
								value={formData.title}
								onChange={(e) =>
									setFormData({
										...formData,
										title: e.target.value,
									})
								}
								placeholder="e.g. Intro to Quantum Computing"
								required
							/>
						</div>

						<div className="space-y-2">
							<label className="text-sm font-medium text-foreground/80">
								Resource URL
							</label>
							<Input
								type="url"
								value={formData.url}
								onChange={(e) =>
									setFormData({
										...formData,
										url: e.target.value,
									})
								}
								placeholder="https://example.com/resource"
								required
							/>
						</div>

						<div className="space-y-2">
							<label className="text-sm font-medium text-foreground/80 flex items-center gap-2">
								<TagIcon className="size-3.5" />
								Tags
							</label>

							<div className="flex flex-wrap items-center gap-2 p-3 min-h-[44px] rounded-lg border border-white/10 bg-[#0F0F12]">
								{formData.tags.map((tag) => (
									<span
										key={tag}
										className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-accent-blue/10 border border-accent-blue/20 text-accent-blue text-[11px] font-medium"
									>
										{tag}
										<button
											type="button"
											onClick={() => removeTag(tag)}
											className="hover:text-accent-bright transition-colors"
										>
											<X className="size-3" />
										</button>
									</span>
								))}

								{showTagInput ? (
									<input
										value={tagInput}
										onChange={(e) =>
											setTagInput(e.target.value)
										}
										onKeyDown={(e) => {
											if (e.key === 'Enter') {
												e.preventDefault();
												addTag();
											}
										}}
										placeholder="Add tag..."
										autoFocus
										className="flex-1 min-w-[100px] bg-transparent border-none outline-none text-sm placeholder:text-muted-foreground/30"
									/>
								) : (
									<button
										type="button"
										onClick={addTag}
										className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 ml-1"
									>
										<Plus className="size-3" />
										Add
									</button>
								)}
							</div>
						</div>
					</div>

					<div className="space-y-6">
						<div className="space-y-2">
							<label className="text-sm font-medium text-foreground/80">
								Description
							</label>
							<textarea
								value={formData.description}
								onChange={(e) =>
									setFormData({
										...formData,
										description: e.target.value,
									})
								}
								rows={7}
								placeholder="Enter a brief description of this resource..."
								className="w-full min-h-[174px] rounded-lg border border-white/10 bg-[#0F0F12] px-3 py-2 text-sm text-foreground transition-all placeholder:text-muted-foreground/30 focus:border-accent-blue/50 focus:ring-2 focus:ring-accent-blue/20 outline-none resize-none"
							/>
						</div>
					</div>
				</div>

				<div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-8 border-t border-white/10">
					<div className="space-y-1">
						<p className="text-[11px] uppercase tracking-widest text-muted-foreground font-semibold">
							Saves
						</p>
						<p className="text-lg font-mono text-foreground">
							{resource?.saveCount ?? formData.saveCount ?? 0}
						</p>
					</div>

					<div className="space-y-1">
						<p className="text-[11px] uppercase tracking-widest text-muted-foreground font-semibold">
							Created
						</p>
						<p className="text-lg text-foreground">
							{formatDate(resource?.createdAt)}
						</p>
					</div>

					<div className="space-y-1 hidden md:block">
						<p className="text-[11px] uppercase tracking-widest text-muted-foreground font-semibold">
							Type
						</p>
						<p className="text-lg text-foreground capitalize">
							{formData.resourceType}
						</p>
					</div>
				</div>

				<footer className="mt-12 flex items-center justify-between gap-4">
					<div>
						{onDelete && (
							<Button
								type="button"
								variant="ghost"
								onClick={onDelete}
								className="text-destructive hover:text-destructive hover:bg-destructive/10"
							>
								<Trash2 className="mr-2 size-4" />
								Delete Resource
							</Button>
						)}
					</div>
					<div className="flex items-center gap-3">
						<Button
							type="button"
							variant="ghost"
							onClick={onCancel}
						>
							Cancel
						</Button>
						<Button type="submit" size="lg">
							<Save className="mr-2 size-4" />
							{resource ? 'Update Resource' : 'Save Resource'}
						</Button>
					</div>
				</footer>
			</form>
		</div>
	);
}
