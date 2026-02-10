"use client";

import { useEffect, useState } from "react";
import { resourceApi } from "@/lib/api";
import { Resource, ResourceInput } from "@/types/resource";
import ResourceForm from "@/components/ResourceForm";
import { useResourceCSV } from "@/hooks/useResourceCSV";
import CSVToolbar from "./CSVToolbar";

type Props = {};

const AdminDashboard = (props: Props) => {
	const [resources, setResources] = useState<Resource[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [editingResource, setEditingResource] = useState<
		Resource | null | "new"
	>(null);

	const loadResources = async () => {
		try {
			setLoading(true);
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
				await resourceApi.create(input);
			} else if (editingResource) {
				await resourceApi.update(
					editingResource.pk,
					editingResource.sk,
					input,
				);
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
			await resourceApi.delete(resource.pk, resource.sk);

			loadResources();
		} catch (err) {
			alert("Failed to delete resource. Check CORS and Lambda logs.");
		}
	};

	if (loading) return <div className='p-8'>Loading...</div>;

	return (
		<div className='p-8 max-w-6xl mx-auto'>
			<div className='flex justify-end mb-6'>
				<CSVToolbar onExport={handleExport} onImport={handleImport} />
				<button
					onClick={() => setEditingResource("new")}
					className='bg-green-600 text-white px-4 py-2 rounded hover:cursor-pointer ml-2'
				>
					+ Add Resource
				</button>
			</div>

			{error && <p className='text-red-500 mb-4'>{error}</p>}

			{editingResource && (
				<div className='mb-8'>
					<ResourceForm
						initialData={
							editingResource === "new"
								? undefined
								: editingResource
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
						<th className='border p-2 text-left'>Actions</th>
					</tr>
				</thead>
				<tbody>
					{resources.map((r) => (
						<tr key={r.id} className='hover:bg-gray-50'>
							<td className='border p-2'>{r.title}</td>
							<td className='border p-2 uppercase text-xs font-mono'>
								{r.resourceType}
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
					))}
				</tbody>
			</table>
		</div>
	);
};

export default AdminDashboard;
