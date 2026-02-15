import Papa from "papaparse";
import { Resource, ResourceInput } from "@/types/resource";
import { resourceApi } from "@/lib/api";

export const useResourceCSV = (resources: Resource[], refresh: () => void) => {
	const handleExport = () => {
		const csv = Papa.unparse(resources);
		const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.setAttribute(
			"download",
			`resources_${new Date().toISOString()}.csv`,
		);
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (!file) return;

		Papa.parse(file, {
			header: true,
			skipEmptyLines: true,
			complete: async (results) => {
				const allItems = results.data as any[];
				const CHUNK_SIZE = 25;

				const chunks = [];
				for (let i = 0; i < allItems.length; i += CHUNK_SIZE) {
					chunks.push(allItems.slice(i, i + CHUNK_SIZE));
				}

				console.log(`Starting import of ${chunks.length} batches...`);

				try {
					for (const [index, batch] of chunks.entries()) {
						const formattedBatch = batch.map((item) => {
							const formattedItem = { ...item };

							// Automatically handle tags if the column exists and is a string
							if (
								formattedItem.tags &&
								typeof formattedItem.tags === "string"
							) {
								formattedItem.tags = formattedItem.tags
									.split("|")
									.map((t: string) => t.trim());
							}

							// Convert numeric strings to actual numbers hello world
							Object.keys(formattedItem).forEach((key) => {
								if (
									typeof formattedItem[key] === "string" &&
									formattedItem[key].trim() !== "" &&
									!isNaN(Number(formattedItem[key]))
								) {
									formattedItem[key] = Number(
										formattedItem[key],
									);
								}
							});

							return formattedItem;
						});

						await resourceApi.create({
							items: formattedBatch,
						});

						console.log(
							`Batch ${index + 1}/${chunks.length} uploaded.`,
						);
					}

					alert("Import complete!");
				} catch (err) {
					console.error("Batch import failed:", err);
					alert("An error occurred. Check console for details.");
				} finally {
					refresh();
				}
			},
		});
	};

	return { handleExport, handleImport };
};
