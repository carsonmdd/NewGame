import { useResourceCSV } from '@/hooks/useResourceCSV';
import { resourceApi } from '@/lib/api';
import { Resource, ResourceInput } from '@/types/resource';
import { useEffect, useMemo, useRef, useState } from 'react';
import CSVToolbar from '../CSVToolbar';
import ResourceCard from '../ResourceCard';
import ResourceForm from '../ResourceForm';
import SearchBar from '../SearchBar';
import { Button } from '@/components/ui/button';
import { Plus, SortAsc, Filter, Tag, X } from 'lucide-react';

type OpenDropdown = null | 'newest' | 'language' | 'tags';

const CatalogView = () => {
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

	return (
		<div
			className="max-w-7xl mx-auto p-8 lg:p-12 animate-in fade-in slide-in-from-bottom-4 duration-700"
			ref={dropdownWrapperRef}
		>
			<header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
				<div>
					<h1 className="text-4xl font-semibold tracking-tight bg-linear-to-b from-white via-white/95 to-white/70 bg-clip-text text-transparent">
						Catalog
					</h1>
					<p className="mt-2 text-muted-foreground">
						Manage resources across the platform.
					</p>
				</div>
				<div className="flex items-center gap-3">
					<CSVToolbar
						onExport={handleExport}
						onImport={handleImport}
					/>
					<Button
						onClick={() => setEditingResource('new')}
						className="rounded-full shadow-lg shadow-accent-blue/20"
						size="lg"
					>
						<Plus className="mr-2 size-5" />
						Create New
					</Button>
				</div>
			</header>

			<div className="flex flex-col gap-6">
				<div className="flex flex-col md:flex-row items-center gap-4">
					<div className="flex-1 w-full">
						<SearchBar onSearch={(term) => setSearch(term)} />
					</div>

					<div className="flex items-center gap-3 w-full md:w-auto">
						<div className="relative flex-1 md:flex-initial">
							<Button
								variant="secondary"
								onClick={() =>
									setOpenDropdown((prev) =>
										prev === 'newest' ? null : 'newest',
									)
								}
								className="w-full"
							>
								<SortAsc className="mr-2 size-4" />
								{newestOrder === 'desc'
									? 'Newest First'
									: 'Oldest First'}
							</Button>

							{openDropdown === 'newest' && (
								<div className="absolute top-full left-0 mt-2 w-48 glass rounded-xl z-30 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
									<button
										type="button"
										onClick={() => {
											setNewestOrder('desc');
											setOpenDropdown(null);
										}}
										className={`w-full px-4 py-2.5 text-left text-sm hover:bg-white/5 transition-colors ${
											newestOrder === 'desc'
												? 'text-accent-blue bg-accent-blue/5'
												: 'text-foreground'
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
										className={`w-full px-4 py-2.5 text-left text-sm hover:bg-white/5 transition-colors ${
											newestOrder === 'asc'
												? 'text-accent-blue bg-accent-blue/5'
												: 'text-foreground'
										}`}
									>
										Oldest first
									</button>
								</div>
							)}
						</div>

						<div className="relative flex-1 md:flex-initial">
							<Button
								variant="secondary"
								onClick={() =>
									setOpenDropdown((prev) =>
										prev === 'language' ? null : 'language',
									)
								}
								className="w-full"
							>
								<Filter className="mr-2 size-4" />
								{selectedResourceType === 'all'
									? 'All Types'
									: selectedResourceType}
							</Button>

							{openDropdown === 'language' && (
								<div className="absolute top-full left-0 mt-2 w-48 glass rounded-xl z-30 overflow-hidden max-h-72 overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
									<button
										type="button"
										onClick={() => {
											setSelectedResourceType('all');
											setOpenDropdown(null);
										}}
										className={`w-full px-4 py-2.5 text-left text-sm hover:bg-white/5 transition-colors ${
											selectedResourceType === 'all'
												? 'text-accent-blue bg-accent-blue/5'
												: 'text-foreground'
										}`}
									>
										All Types
									</button>

									{resourceTypes.map((type) => (
										<button
											key={type}
											type="button"
											onClick={() => {
												setSelectedResourceType(type);
												setOpenDropdown(null);
											}}
											className={`w-full px-4 py-2.5 text-left text-sm hover:bg-white/5 capitalize transition-colors ${
												selectedResourceType === type
													? 'text-accent-blue bg-accent-blue/5'
													: 'text-foreground'
											}`}
										>
											{type}
										</button>
									))}
								</div>
							)}
						</div>

						<div className="relative flex-1 md:flex-initial">
							<Button
								variant="secondary"
								onClick={() =>
									setOpenDropdown((prev) =>
										prev === 'tags' ? null : 'tags',
									)
								}
								className="w-full"
							>
								<Tag className="mr-2 size-4" />
								{selectedTag === 'all'
									? 'All Tags'
									: selectedTag}
							</Button>

							{openDropdown === 'tags' && (
								<div className="absolute top-full left-0 mt-2 w-48 glass rounded-xl z-30 overflow-hidden max-h-72 overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
									<button
										type="button"
										onClick={() => {
											setSelectedTag('all');
											setOpenDropdown(null);
										}}
										className={`w-full px-4 py-2.5 text-left text-sm hover:bg-white/5 transition-colors ${
											selectedTag === 'all'
												? 'text-accent-blue bg-accent-blue/5'
												: 'text-foreground'
										}`}
									>
										All Tags
									</button>

									{allTags.map((tag) => (
										<button
											key={tag}
											type="button"
											onClick={() => {
												setSelectedTag(tag);
												setOpenDropdown(null);
											}}
											className={`w-full px-4 py-2.5 text-left text-sm hover:bg-white/5 transition-colors ${
												selectedTag === tag
													? 'text-accent-blue bg-accent-blue/5'
													: 'text-foreground'
											}`}
										>
											{tag}
										</button>
									))}
								</div>
							)}
						</div>
					</div>
				</div>

				<div className="glass rounded-2xl p-6 md:p-8">
					<div className="mb-6 flex items-center justify-between text-sm">
						<p className="text-muted-foreground">
							Showing{' '}
							<span className="text-foreground font-semibold">
								{displayedResources.length}
							</span>{' '}
							of{' '}
							<span className="text-foreground font-semibold">
								{resources.length}
							</span>{' '}
							resources
						</p>

						{(search ||
							selectedResourceType !== 'all' ||
							selectedTag !== 'all') && (
							<Button
								variant="ghost"
								size="sm"
								onClick={() => {
									setSearch('');
									setNewestOrder('desc');
									setSelectedResourceType('all');
									setSelectedTag('all');
									setOpenDropdown(null);
								}}
								className="text-accent-blue hover:text-accent-bright"
							>
								<X className="mr-1.5 size-3" />
								Clear all filters
							</Button>
						)}
					</div>

					{loading ? (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{[1, 2, 3, 4, 5, 6].map((i) => (
								<div
									key={i}
									className="h-48 rounded-2xl bg-white/3 animate-pulse"
								/>
							))}
						</div>
					) : error ? (
						<div className="py-12 text-center">
							<p className="text-destructive">{error}</p>
							<Button
								variant="outline"
								onClick={loadResources}
								className="mt-4"
							>
								Try again
							</Button>
						</div>
					) : (
						<>
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
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
							</div>

							{displayedResources.length === 0 && (
								<div className="py-20 text-center">
									<p className="text-muted-foreground text-lg">
										{resources.length > 0
											? 'No matching resources found.'
											: 'Your catalog is empty. Create your first resource!'}
									</p>
									{resources.length === 0 && (
										<Button
											onClick={() =>
												setEditingResource('new')
											}
											className="mt-6"
										>
											<Plus className="mr-2 size-4" />
											Create First Resource
										</Button>
									)}
								</div>
							)}
						</>
					)}
				</div>
			</div>

			{editingResource && (
				<div className="fixed inset-0 bg-bg-base/80 backdrop-blur-md flex items-center justify-center p-6 z-50 animate-in fade-in duration-300">
					<div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto glass rounded-2xl p-1 shadow-2xl">
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
							onCancel={() => setEditingResource(null)}
							onDelete={
								editingResource !== 'new'
									? async () => {
											await handleDelete(editingResource);
											setEditingResource(null);
										}
									: undefined
							}
						/>
					</div>
				</div>
			)}
		</div>
	);
};

export default CatalogView;
