"use client";

import { useEffect, useMemo, useState } from "react";
import { resourceApi } from "@/lib/api";
import { Resource, ResourceInput } from "@/types/resource";
import ResourceForm from "@/components/ResourceForm";
import { useResourceCSV } from "@/hooks/useResourceCSV";
import CSVToolbar from "./CSVToolbar";

type SortOption =
	| "default"
	| "title-asc"
	| "title-desc"
	| "type-asc"
	| "difficulty-asc"
	| "tags-asc"
	| "tags-count";

const AdminDashboard = () => {
	const [resources, setResources] = useState<Resource[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [editingResource, setEditingResource] = useState<
		Resource | null | "new"
	>(null);

	const [searchTerm, setSearchTerm] = useState("");
	const [sortBy, setSortBy] = useState<SortOption>("default");

	const loadResources = async () => {
		try {
			setLoading(true);
			setError("");
			const response = await resourceApi.getAll();
			setResources(response.data.data);
		} catch (err) {
			setError("Failed to load resources.");
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

	const handleCreateOrUpdate = async (input: ResourceInput) => {
		try {
			if (editingResource === "new") {
				await resourceApi.create({ items: [input] });
			} else if (editingResource) {
				await resourceApi.update(editingResource.sk, input);
			}
			setEditingResource(null);
			loadResources();
		} catch (err) {
			alert("Operation failed");
		}
	};

	const handleDelete = async (resource: Resource) => {
		if (!confirm(`Are you sure you want to delete ${resource.title}?`))
			return;

		try {
			await resourceApi.delete(resource.sk);
			loadResources();
		} catch (err) {
			alert("Failed to delete resource. Check CORS and Lambda logs.");
		}
	};

	const displayedResources = useMemo(() => {
		const normalizedSearch = searchTerm.trim().toLowerCase();

		const filtered = resources.filter((resource) => {
			if (!normalizedSearch) return true;

			const title = resource.title?.toLowerCase() || "";
			const description = resource.description?.toLowerCase() || "";
			const resourceType = resource.resourceType?.toLowerCase() || "";
			const difficulty = resource.difficulty?.toLowerCase() || "";
			const tagsText = Array.isArray(resource.tags)
				? resource.tags.join(" ").toLowerCase()
				: "";

			return (
				title.includes(normalizedSearch) ||
				description.includes(normalizedSearch) ||
				resourceType.includes(normalizedSearch) ||
				difficulty.includes(normalizedSearch) ||
				tagsText.includes(normalizedSearch)
			);
		});

		const sorted = [...filtered];

		switch (sortBy) {
			case "title-asc":
				sorted.sort((a, b) => a.title.localeCompare(b.title));
				break;
			case "title-desc":
				sorted.sort((a, b) => b.title.localeCompare(a.title));
				break;
			case "type-asc":
				sorted.sort((a, b) =>
					a.resourceType.localeCompare(b.resourceType),
				);
				break;
			case "difficulty-asc":
				sorted.sort((a, b) => a.difficulty.localeCompare(b.difficulty));
				break;
			case "tags-asc":
				sorted.sort((a, b) => {
					const aTags = (a.tags || []).join(", ");
					const bTags = (b.tags || []).join(", ");
					return aTags.localeCompare(bTags);
				});
				break;
			case "tags-count":
				sorted.sort((a, b) => (b.tags?.length || 0) - (a.tags?.length || 0));
				break;
			default:
				break;
		}

		return sorted;
	}, [resources, searchTerm, sortBy]);

	if (loading) return <div className='p-8'>Loading...</div>;

	return (
		<div className='p-8 max-w-6xl mx-auto'>
			<div className='mb-6'>
				<div className='flex justify-end mb-4'>
					<CSVToolbar onExport={handleExport} onImport={handleImport} />
					<button
						onClick={() => setEditingResource("new")}
						className='bg-green-600 text-white px-4 py-2 rounded hover:cursor-pointer ml-2'
					>
						+ Add Resource
					</button>
				</div>

				<div className='flex flex-wrap gap-3'>
					<input
						type='text'
						placeholder='Search by title, description, type, difficulty, or tags...'
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className='border border-gray-300 rounded px-3 py-2 min-w-[280px]'
					/>

					<select
						value={sortBy}
						onChange={(e) => setSortBy(e.target.value as SortOption)}
						className='border border-gray-300 rounded px-3 py-2'
					>
						<option value='default'>Sort: Default</option>
						<option value='title-asc'>Sort: Title A-Z</option>
						<option value='title-desc'>Sort: Title Z-A</option>
						<option value='type-asc'>Sort: Type A-Z</option>
						<option value='difficulty-asc'>Sort: Difficulty A-Z</option>
						<option value='tags-asc'>Sort: Tags A-Z</option>
						<option value='tags-count'>Sort: Most Tags</option>
					</select>
				</div>
			</div>

			{error && <p className='text-red-500 mb-4'>{error}</p>}

			{editingResource && (
				<div className='mb-8'>
					<ResourceForm
						initialData={
							editingResource === "new"
								? undefined
								: (() => {
										const { pk, sk, id, ...data } = editingResource;
										return data;
									})()
						}
						onSubmit={handleCreateOrUpdate}
						onCancel={() => setEditingResource(null)}
					/>
				</div>
			)}

			<table className='w-full border-collapse border border-gray-200'>
				<thead className='bg-gray-100'>
					<tr>
						<th className='border p-2 text-left'>Title</th>
						<th className='border p-2 text-left'>Type</th>
						<th className='border p-2 text-left'>Tags</th>
						<th className='border p-2 text-left'>Actions</th>
					</tr>
				</thead>
				<tbody>
					{displayedResources.length > 0 ? (
						displayedResources.map((r) => (
							<tr key={r.id} className='hover:bg-gray-50'>
								<td className='border p-2'>
									<div className='font-medium'>{r.title}</div>
									<div className='text-xs text-gray-500 mt-1'>
										{r.description}
									</div>
								</td>
								<td className='border p-2 uppercase text-xs font-mono'>
									{r.resourceType}
								</td>
								<td className='border p-2 text-sm'>
									{r.tags?.length ? r.tags.join(", ") : "No tags"}
								</td>
								<td className='border p-2 space-x-2'>
									<button
										onClick={() => setEditingResource(r)}
										className='text-blue-600 hover:cursor-pointer'
									>
										Edit
									</button>
									<button
										onClick={() => handleDelete(r)}
										className='text-red-600 hover:cursor-pointer'
									>
										Delete
									</button>
								</td>
							</tr>
						))
					) : (
						<tr>
							<td
								colSpan={4}
								className='border p-4 text-center text-gray-500'
							>
								No matching resources found.
							</td>
						</tr>
					)}
				</tbody>
			</table>
		</div>
	);
};

export default AdminDashboard;