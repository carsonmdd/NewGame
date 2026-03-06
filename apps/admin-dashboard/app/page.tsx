'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { resourceApi } from '@/lib/api';
import { Resource, ResourceInput } from '@/types/resource';
import ResourceForm from '@/components/ResourceForm';
import Sidebar from '@/components/Sidebar';
import ResourceCard from '@/components/ResourceCard';
import CSVToolbar from '@/components/CSVToolbar';
import { useResourceCSV } from '@/hooks/useResourceCSV';

type TabKey = 'database' | 'review' | 'stats' | 'notifications';
type OpenDropdown = null | 'newest' | 'language' | 'tags';

export default function Home() {
	const [activeTab, setActiveTab] = useState<TabKey>('database');

	const [resources, setResources] = useState<Resource[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');

	const [editingResource, setEditingResource] = useState<
		Resource | null | 'new'
	>(null);

	const [search, setSearch] = useState('');
	const [newestOrder, setNewestOrder] = useState<'desc' | 'asc'>('desc');
	const [selectedResourceType, setSelectedResourceType] = useState<
		'all' | Resource['resourceType']
	>('all');
	const [selectedTag, setSelectedTag] = useState<'all' | string>('all');

	const [openDropdown, setOpenDropdown] = useState<OpenDropdown>(null);
	const dropdownWrapperRef = useRef<HTMLDivElement | null>(null);

	const loadResources = async () => {
		try {
			setLoading(true);
			setError('');
			const response = await resourceApi.getAll();
			setResources(response.data.data);
		} catch {
			setError('Failed to load resources.');
		} finally {
			setLoading(false);
		}
	};

	const { handleExport, handleImport } = useResourceCSV(
		resources,
		loadResources,
	);

	useEffect(() => {
		loadResources();
	}, []);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownWrapperRef.current &&
				!dropdownWrapperRef.current.contains(event.target as Node)
			) {
				setOpenDropdown(null);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	const handleCreateOrUpdate = async (input: ResourceInput) => {
		try {
			if (editingResource === 'new') {
				await resourceApi.create({ items: [input] });
			} else if (editingResource) {
				await resourceApi.update(editingResource.sk, input);
			}
			setEditingResource(null);
			loadResources();
		} catch {
			alert('Operation failed');
		}
	};

	const handleDelete = async (resource: Resource) => {
		if (!confirm(`Are you sure you want to delete ${resource.title}?`))
			return;

		try {
			await resourceApi.delete(resource.sk);
			loadResources();
		} catch {
			alert('Failed to delete resource. Check CORS and Lambda logs.');
		}
	};

	const resourceTypes = useMemo(() => {
		return Array.from(
			new Set(resources.map((r) => r.resourceType)),
		) as Resource['resourceType'][];
	}, [resources]);

	const allTags = useMemo(() => {
		return Array.from(new Set(resources.flatMap((r) => r.tags))).sort(
			(a, b) => a.localeCompare(b),
		);
	}, [resources]);

	const displayedResources = useMemo(() => {
		let result = [...resources];

		const normalizedSearch = search.trim().toLowerCase();

		if (normalizedSearch) {
			result = result.filter((resource) => {
				const title = resource.title.toLowerCase();
				const description = resource.description.toLowerCase();
				const resourceType = resource.resourceType.toLowerCase();
				const difficulty = resource.difficulty.toLowerCase();
				const tagsText = resource.tags.join(' ').toLowerCase();

				return (
					title.includes(normalizedSearch) ||
					description.includes(normalizedSearch) ||
					resourceType.includes(normalizedSearch) ||
					difficulty.includes(normalizedSearch) ||
					tagsText.includes(normalizedSearch)
				);
			});
		}

		if (selectedResourceType !== 'all') {
			result = result.filter(
				(resource) => resource.resourceType === selectedResourceType,
			);
		}

		if (selectedTag !== 'all') {
			result = result.filter((resource) =>
				resource.tags.includes(selectedTag),
			);
		}

		result.sort((a, b) => {
			const aTime = new Date(a.createdAt).getTime();
			const bTime = new Date(b.createdAt).getTime();

			if (newestOrder === 'desc') {
				return bTime - aTime;
			}

			return aTime - bTime;
		});

		return result;
	}, [resources, search, selectedResourceType, selectedTag, newestOrder]);

	const Placeholder = ({ title }: { title: string }) => (
		<div className="max-w-5xl">
			<h1 className="text-2xl font-bold text-[#333333]">{title}</h1>
			<p className="mt-2 text-slate-600">
				This section is set up for navigation, but will be implemented
				later.
			</p>
		</div>
	);

	return (
		<div className="min-h-screen bg-slate-50">
			<div className="flex">
				<Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

				<main className="flex-1 p-8">
					{activeTab === 'review' && (
						<Placeholder title="Resources for Review" />
					)}
					{activeTab === 'stats' && (
						<Placeholder title="Statistics" />
					)}
					{activeTab === 'notifications' && (
						<Placeholder title="Notifications" />
					)}

					{activeTab === 'database' && (
						<div className="max-w-6xl mx-auto" ref={dropdownWrapperRef}>
							<div className="flex items-center gap-4 flex-wrap">
								<div className="flex-1 min-w-[320px]">
									<div className="flex items-center gap-3 bg-white border rounded-2xl px-4 py-3 shadow-sm">
										<span
											className="text-slate-500"
											aria-hidden
										>
											🔍
										</span>
										<input
											value={search}
											onChange={(e) =>
												setSearch(e.target.value)
											}
											placeholder="Search for resources"
											className="w-full outline-none text-[#333333] bg-transparent"
										/>
										<button
											type="button"
											className="text-slate-500 hover:text-slate-800"
											aria-label="Clear search"
											title="Clear search"
											onClick={() => setSearch('')}
										>
											✕
										</button>
									</div>
								</div>

								<CSVToolbar
									onExport={handleExport}
									onImport={handleImport}
								/>

								<button
									type="button"
									onClick={() => setEditingResource('new')}
									className="w-14 h-14 rounded-full bg-[#B99AD5] text-[#333333] text-3xl flex items-center justify-center shadow-sm"
									aria-label="Add resource"
									title="Add resource"
								>
									+
								</button>
							</div>

							<div className="mt-6 flex gap-6">
								<div className="relative flex-1">
									<button
										type="button"
										onClick={() =>
											setOpenDropdown((prev) =>
												prev === 'newest'
													? null
													: 'newest',
											)
										}
										className="w-full bg-[#8C4D93] text-white py-3 rounded-xl font-semibold"
									>
										Sort by Newest
									</button>

									{openDropdown === 'newest' && (
										<div className="absolute top-full left-0 mt-2 w-full rounded-xl border border-[#8C4D93] bg-white shadow-lg z-30 overflow-hidden">
											<button
												type="button"
												onClick={() => {
													setNewestOrder('desc');
													setOpenDropdown(null);
												}}
												className={`w-full px-4 py-3 text-left text-[#333333] hover:bg-[#F3EAF8] ${
													newestOrder === 'desc'
														? 'bg-[#F3EAF8] font-semibold text-[#333333]'
														: ''
												}`}
											>
												Newest first
											</button>
											<button
												type="button"
												onClick={() => {
													setNewestOrder('asc');
													setOpenDropdown(null);
												}}
												className={`w-full px-4 py-3 text-left text-[#333333] hover:bg-[#F3EAF8] ${
													newestOrder === 'asc'
														? 'bg-[#F3EAF8] font-semibold text-[#333333]'
														: ''
												}`}
											>
												Oldest first
											</button>
										</div>
									)}
								</div>

								<div className="relative flex-1">
									<button
										type="button"
										onClick={() =>
											setOpenDropdown((prev) =>
												prev === 'language'
													? null
													: 'language',
											)
										}
										className="w-full bg-[#8C4D93] text-white py-3 rounded-xl font-semibold"
									>
										Sort by Language
									</button>

									{openDropdown === 'language' && (
										<div className="absolute top-full left-0 mt-2 w-full rounded-xl border border-[#8C4D93] bg-white shadow-lg z-30 overflow-hidden max-h-72 overflow-y-auto">
											<button
												type="button"
												onClick={() => {
													setSelectedResourceType('all');
													setOpenDropdown(null);
												}}
												className={`w-full px-4 py-3 text-left text-[#333333] hover:bg-[#F3EAF8] ${
													selectedResourceType === 'all'
														? 'bg-[#F3EAF8] font-semibold text-[#333333]'
														: ''
												}`}
											>
												All
											</button>

											{resourceTypes.map((type) => (
												<button
													key={type}
													type="button"
													onClick={() => {
														setSelectedResourceType(
															type,
														);
														setOpenDropdown(null);
													}}
													className={`w-full px-4 py-3 text-left text-[#333333] hover:bg-[#F3EAF8] capitalize ${
														selectedResourceType ===
														type
															? 'bg-[#F3EAF8] font-semibold text-[#333333]'
															: ''
													}`}
												>
													{type}
												</button>
											))}
										</div>
									)}
								</div>

								<div className="relative flex-1">
									<button
										type="button"
										onClick={() =>
											setOpenDropdown((prev) =>
												prev === 'tags'
													? null
													: 'tags',
											)
										}
										className="w-full bg-[#8C4D93] text-white py-3 rounded-xl font-semibold"
									>
										Sort by tags
									</button>

									{openDropdown === 'tags' && (
										<div className="absolute top-full left-0 mt-2 w-full rounded-xl border border-[#8C4D93] bg-white shadow-lg z-30 overflow-hidden max-h-72 overflow-y-auto">
											<button
												type="button"
												onClick={() => {
													setSelectedTag('all');
													setOpenDropdown(null);
												}}
												className={`w-full px-4 py-3 text-left text-[#333333] hover:bg-[#F3EAF8] ${
													selectedTag === 'all'
														? 'bg-[#F3EAF8] font-semibold text-[#333333]'
														: ''
												}`}
											>
												All
											</button>

											{allTags.map((tag) => (
												<button
													key={tag}
													type="button"
													onClick={() => {
														setSelectedTag(tag);
														setOpenDropdown(null);
													}}
													className={`w-full px-4 py-3 text-left text-[#333333] hover:bg-[#F3EAF8] ${
														selectedTag === tag
															? 'bg-[#F3EAF8] font-semibold text-[#333333]'
															: ''
													}`}
												>
													{tag}
												</button>
											))}
										</div>
									)}
								</div>
							</div>

							{loading && <div className="mt-8">Loading...</div>}
							{error && (
								<p className="text-red-600 mt-6">{error}</p>
							)}

							<div className="mt-6 rounded-2xl bg-white border p-6">
								<div className="mb-4 flex items-center justify-between text-sm text-slate-600">
									<p>
										Showing{' '}
										<span className="font-semibold">
											{displayedResources.length}
										</span>{' '}
										of{' '}
										<span className="font-semibold">
											{resources.length}
										</span>{' '}
										resources
									</p>

									<button
										type="button"
										onClick={() => {
											setSearch('');
											setNewestOrder('desc');
											setSelectedResourceType('all');
											setSelectedTag('all');
											setOpenDropdown(null);
										}}
										className="text-[#8C4D93] font-medium hover:underline"
									>
										Clear all
									</button>
								</div>

								<div className="max-h-[540px] overflow-y-auto pr-2 space-y-5">
									{displayedResources.map((r) => (
										<ResourceCard
											key={r.id}
											resource={r}
											onEdit={(res) =>
												setEditingResource(res)
											}
											onDelete={handleDelete}
										/>
									))}

									{!loading &&
										displayedResources.length === 0 &&
										resources.length > 0 && (
											<p className="text-slate-600">
												No matching resources found.
											</p>
										)}

									{!loading && resources.length === 0 && (
										<p className="text-slate-600">
											No resources yet. Click the "+"
											button to add one.
										</p>
									)}
								</div>
							</div>

							{editingResource && (
								<div className="fixed inset-0 bg-black/40 flex items-center justify-center p-6 z-50">
									<div className="w-full max-w-4xl">
										<ResourceForm
											initialData={
												editingResource === 'new'
													? undefined
													: (() => {
															const {
																pk,
																sk,
																id,
																createdAt,
																...data
															} = editingResource;
															return data;
														})()
											}
											resource={
												editingResource === 'new'
													? null
													: editingResource
											}
											isEditing={editingResource !== 'new'}
											onSubmit={handleCreateOrUpdate}
											onCancel={() =>
												setEditingResource(null)
											}
											onDelete={
												editingResource !== 'new'
													? async () => {
															await handleDelete(
																editingResource,
															);
															setEditingResource(
																null,
															);
														}
													: undefined
											}
										/>
									</div>
								</div>
							)}
						</div>
					)}
				</main>
			</div>
		</div>
	);
}