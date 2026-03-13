import Papa from 'papaparse';
import { Resource } from '@/types/resource';
import { resourceApi } from '@/lib/api';

export const useResourceCSV = (resources: Resource[], refresh: () => void) => {
	const handleExport = () => {
		// Map camelCase back to CSV headers for export
		const exportData = resources.map((r) => ({
			URL: r.url,
			TITLE: r.title,
			SOURCE: r.source,
			AUTHOR: r.author,
			DATE: r.date,
			LICENSE: r.license,
			CENTRAL_CLAIM: r.centralClaim,
			CORE_KNOWLEDGE: r.coreKnowledge,
			PRACTICAL_TAKEAWAY: r.practicalTakeaway,
			TOPIC_POSITION: r.topicPosition,
			OPEN_QUESTIONS: r.openQuestions,
			AUDIENCE: r.audience,
			DECISION_MOMENT: r.decisionMoment,
			EVERGREEN: r.evergreen,
			SOURCE_TYPE: r.sourceType,
			CREDIBILITY_NOTES: r.credibilityNotes,
			KEYWORDS: (r.keywords || []).join(', '),
			ADJACENT_TOPICS: (r.adjacentTopics || []).join(', '),
			SYNTHETIC_QUERY_1: r.syntheticQuery1,
			SYNTHETIC_QUERY_2: r.syntheticQuery2,
			SYNTHETIC_QUERY_3: r.syntheticQuery3,
		}));

		const csv = Papa.unparse(exportData);
		const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = url;
		link.setAttribute(
			'download',
			`catalog_${new Date().toISOString()}.csv`,
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
							return {
								url: item.URL || '',
								title: item.TITLE || '',
								source: item.SOURCE || '',
								author: item.AUTHOR || '',
								date: item.DATE || '',
								license: item.LICENSE || '',
								centralClaim: item.CENTRAL_CLAIM || '',
								coreKnowledge: item.CORE_KNOWLEDGE || '',
								practicalTakeaway: item.PRACTICAL_TAKEAWAY || '',
								topicPosition: item.TOPIC_POSITION || '',
								openQuestions: item.OPEN_QUESTIONS || '',
								audience: item.AUDIENCE || '',
								decisionMoment: item.DECISION_MOMENT || '',
								evergreen: item.EVERGREEN || '',
								sourceType: item.SOURCE_TYPE || '',
								credibilityNotes: item.CREDIBILITY_NOTES || '',
								keywords: (item.KEYWORDS || '')
									.split(',')
									.map((t: string) => t.trim())
									.filter(Boolean),
								adjacentTopics: (item.ADJACENT_TOPICS || '')
									.split(',')
									.map((t: string) => t.trim())
									.filter(Boolean),
								syntheticQuery1: item.SYNTHETIC_QUERY_1 || '',
								syntheticQuery2: item.SYNTHETIC_QUERY_2 || '',
								syntheticQuery3: item.SYNTHETIC_QUERY_3 || '',
								saveCount: 0,
							};
						});

						await resourceApi.create({
							items: formattedBatch,
						});

						console.log(
							`Batch ${index + 1}/${chunks.length} uploaded.`,
						);
					}

					alert('Import complete!');
				} catch (err) {
					console.error('Batch import failed:', err);
					alert('An error occurred. Check console for details.');
				} finally {
					refresh();
				}
			},
		});
	};

	return { handleExport, handleImport };
};
