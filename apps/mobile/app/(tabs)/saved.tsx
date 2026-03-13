import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
	Alert,
	FlatList,
	Modal,
	ScrollView,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native';
import {
	SafeAreaView,
	useSafeAreaInsets,
} from 'react-native-safe-area-context';

import { useSavedResources } from '@/contexts/SavedResourcesContext';
import { Resource } from '@/types/resource';

type Collection = {
	id: string;
	name: string;
};

type GridItem =
	| { kind: 'collection'; collection: Collection; id: string }
	| { kind: 'add'; id: string };

type ModalTile =
	| { id: string; kind: 'add' }
	| { id: string; kind: 'resource'; resource: Resource };

const TEXT = '#F9FAFB';
const MUTED = '#9CA3AF';

const NAME_MAX = 22;

export default function SavedScreen() {
	const insets = useSafeAreaInsets();
	const router = useRouter();
	const { savedResources } = useSavedResources();

	const defaultCollections: Collection[] = useMemo(
		() => [{ id: 'recent', name: 'Recently Saved' }],
		[],
	);

	const [collections, setCollections] =
		useState<Collection[]>(defaultCollections);
	const [openCollectionId, setOpenCollectionId] = useState<string | null>(
		null,
	);

	const [isEditingTitle, setIsEditingTitle] = useState(false);
	const [draftName, setDraftName] = useState('');
	const [collectionSearch, setCollectionSearch] = useState('');

	const openCollection = useMemo(() => {
		if (!openCollectionId) return null;
		return collections.find((c) => c.id === openCollectionId) ?? null;
	}, [collections, openCollectionId]);

	const openCollectionName = openCollection?.name ?? 'Collection';

	const openModalForCollection = (c: Collection) => {
		setCollectionSearch('');
		setIsEditingTitle(false);
		setDraftName(c.name);
		setOpenCollectionId(c.id);
	};

	const closeModal = () => {
		setOpenCollectionId(null);
		setIsEditingTitle(false);
		setDraftName('');
	};

	const addCollection = () => {
		const nextNum =
			collections.filter((c) => c.id.startsWith('new-')).length + 1;
		const newCollection: Collection = {
			id: `new-${Date.now()}`,
			name: `New Collection ${nextNum}`,
		};
		setCollections((prev) => [...prev, newCollection]);
	};

	const sanitizeName = (value: string) => {
		const cleaned = value.replace(/[^a-zA-Z0-9 ]/g, '');
		const collapsed = cleaned.replace(/\s+/g, ' ');
		return collapsed.slice(0, NAME_MAX);
	};

	const startEditingTitle = () => {
		if (!openCollection) return;
		setDraftName(openCollection.name);
		setIsEditingTitle(true);
	};

	const saveTitle = () => {
		if (!openCollection) return;

		const trimmed = draftName.trim();
		const safe = sanitizeName(trimmed);

		if (!safe) {
			setDraftName(openCollection.name);
			setIsEditingTitle(false);
			return;
		}

		setCollections((prev) =>
			prev.map((c) =>
				c.id === openCollection.id ? { ...c, name: safe } : c,
			),
		);

		setIsEditingTitle(false);
	};

	const deleteCollection = () => {
		if (!openCollection) return;

		if (openCollection.id === 'recent') {
			Alert.alert(
				'Cannot delete',
				'The "Recently Saved" collection cannot be deleted.',
			);
			return;
		}

		Alert.alert(
			'Delete collection?',
			`Are you sure you want to delete "${openCollection.name}"?`,
			[
				{ text: 'No', style: 'cancel' },
				{
					text: 'Yes',
					style: 'destructive',
					onPress: () => {
						setCollections((prev) =>
							prev.filter((c) => c.id !== openCollection.id),
						);
						closeModal();
					},
				},
			],
		);
	};

	const gridData: GridItem[] = useMemo(() => {
		return [
			...collections.map((c) => ({
				kind: 'collection' as const,
				collection: c,
				id: c.id,
			})),
			{ kind: 'add' as const, id: 'add' },
		];
	}, [collections]);

	// Group into 2-column rows for ScrollView rendering
	const collectionRows = useMemo(() => {
		const rows: GridItem[][] = [];
		for (let i = 0; i < gridData.length; i += 2) {
			rows.push(gridData.slice(i, i + 2));
		}
		return rows;
	}, [gridData]);

	const filteredSavedResources = useMemo(() => {
		const q = collectionSearch.trim().toLowerCase();

		if (!q) return savedResources;

		return savedResources.filter((resource) => {
			const titleMatch = resource.title?.toLowerCase().includes(q);
			const knowledgeMatch = resource.coreKnowledge
				?.toLowerCase()
				.includes(q);
			const tagsMatch = resource.keywords?.some((keyword) =>
				keyword.toLowerCase().includes(q),
			);

			return titleMatch || knowledgeMatch || tagsMatch;
		});
	}, [savedResources, collectionSearch]);

	const modalTiles: ModalTile[] = useMemo(() => {
		if (!openCollection) return [];

		if (openCollection.id === 'recent') {
			return filteredSavedResources.map((resource) => ({
				id: resource.id || resource.id,
				kind: 'resource' as const,
				resource,
			}));
		}

		return [{ id: 'add', kind: 'add' }];
	}, [openCollection, filteredSavedResources]);

	return (
		<SafeAreaView className="flex-1 bg-[#050509]" edges={['left', 'right']}>
			<View className="flex-1 bg-[#050509] px-5" style={{ paddingTop: insets.top }}>
				<ScrollView
					contentContainerClassName="pb-6"
					showsVerticalScrollIndicator={false}
				>
					<View className="flex-row items-center justify-between mb-1.5 mt-0.5">
						<Text className="text-[#F9FAFB] text-[32px] font-extrabold tracking-tight leading-[38px]">Saved</Text>
					</View>

					<Text className="text-[#F9FAFB] text-[30px] font-extrabold mt-0 mb-3 leading-[36px]">Collections</Text>

					<View className="pb-3">
						{collectionRows.map((row, rowIndex) => (
							<View
								key={`row-${rowIndex}`}
								className="flex-row gap-[18px] mb-[18px]"
							>
								{row.map((item) => {
									if (item.kind === 'add') {
										return (
											<View
												key={item.id}
												className="flex-1 items-start"
											>
												<TouchableOpacity
													activeOpacity={0.85}
													onPress={addCollection}
													className="w-[165px] h-[165px] rounded-full bg-[#2E2E2E] items-center justify-center"
													accessibilityRole="button"
													accessibilityLabel="Create new collection"
												>
													<Text
														className="text-[#F9FAFB] text-[72px] font-extralight -mt-1.5"
													>
														+
													</Text>
												</TouchableOpacity>
											</View>
										);
									}

									const c = item.collection;
									return (
										<TouchableOpacity
											key={c.id}
											activeOpacity={0.85}
											onPress={() =>
												openModalForCollection(c)
											}
											className="flex-1"
											accessibilityRole="button"
											accessibilityLabel={`Open collection ${c.name}`}
										>
											<View
												className="w-full h-[165px] rounded-[28px] bg-[#1A1F4A] mb-2.5"
											/>
											<Text
												className="text-[#F9FAFB] text-[22px] font-bold"
												numberOfLines={1}
											>
												{c.name}
											</Text>
										</TouchableOpacity>
									);
								})}

								{/* Spacer when row has only one item */}
								{row.length === 1 ? (
									<View className="flex-1" />
								) : null}
							</View>
						))}
					</View>
				</ScrollView>

				<Modal
					visible={!!openCollection}
					animationType="slide"
					presentationStyle="fullScreen"
					onRequestClose={closeModal}
				>
					<SafeAreaView
						className="flex-1 bg-[#050509]"
						edges={['left', 'right']}
					>
						<View
							className="flex-1 bg-[#050509]"
							style={{ paddingTop: insets.top }}
						>
							<View className="px-5 pt-1 pb-2.5 flex-row items-start justify-between">
								<View className="flex-1 pr-2.5">
									{openCollection?.id === 'recent' ? (
										<Text className="text-[#F9FAFB] text-[30px] font-extrabold leading-[36px]">
											{openCollectionName}
										</Text>
									) : !isEditingTitle ? (
										<TouchableOpacity
											activeOpacity={0.8}
											onPress={startEditingTitle}
											accessibilityRole="button"
											accessibilityLabel="Edit collection name"
											className="py-1"
										>
											<Text
												className="text-[#F9FAFB] text-[30px] font-extrabold leading-[36px]"
												numberOfLines={1}
											>
												{openCollectionName}
											</Text>
										</TouchableOpacity>
									) : (
										<View className="pt-0.5">
											<TextInput
												value={draftName}
												onChangeText={(t) =>
													setDraftName(
														sanitizeName(t),
													)
												}
												className="text-[#F9FAFB] text-[28px] font-extrabold leading-[34px] py-1 px-0"
												placeholder="Collection name"
												placeholderTextColor={MUTED}
												autoFocus
												maxLength={NAME_MAX}
												returnKeyType="done"
												onSubmitEditing={saveTitle}
												autoCorrect={false}
											/>
											<Text className="text-[#9CA3AF] text-[12px] mt-1">
												Letters, numbers, spaces. Max{' '}
												{NAME_MAX} characters.
											</Text>
										</View>
									)}
								</View>

								<View className="flex-row gap-2.5 items-center">
									{openCollection?.id !== 'recent' && (
										<TouchableOpacity
											accessibilityRole="button"
											accessibilityLabel="Delete collection"
											activeOpacity={0.8}
											onPress={deleteCollection}
											className="p-2 rounded-full"
										>
											<Ionicons
												name="trash-outline"
												size={22}
												color={TEXT}
											/>
										</TouchableOpacity>
									)}

									<TouchableOpacity
										accessibilityRole="button"
										accessibilityLabel="Close collection"
										activeOpacity={0.8}
										onPress={closeModal}
										className="p-2 rounded-full"
									>
										<Ionicons
											name="close"
											size={24}
											color={TEXT}
										/>
									</TouchableOpacity>
								</View>
							</View>

							{isEditingTitle && (
								<View className="px-5 flex-row gap-2.5 mt-1 mb-1.5">
									<TouchableOpacity
										activeOpacity={0.85}
										onPress={() => {
											setDraftName(openCollectionName);
											setIsEditingTitle(false);
										}}
										className="flex-1 h-10 rounded-full items-center justify-center border border-[#F9FAFB] bg-transparent"
									>
										<Text className="text-[#F9FAFB] text-[13px] font-extrabold">
											Cancel
										</Text>
									</TouchableOpacity>

									<TouchableOpacity
										activeOpacity={0.85}
										onPress={saveTitle}
										className="flex-1 h-10 rounded-full items-center justify-center bg-[#F9FAFB]"
									>
										<Text
											className="text-[13px] font-extrabold text-[#0B0B10]"
										>
											Save
										</Text>
									</TouchableOpacity>
								</View>
							)}

							<View className="px-5 flex-row items-center gap-3 mt-2.5">
								<View className="flex-1 flex-row items-center bg-[#2A2A2A] rounded-[14px] px-3.5 h-11">
									<Ionicons
										name="search"
										size={18}
										color={MUTED}
										className="mr-2"
									/>
									<TextInput
										value={collectionSearch}
										onChangeText={setCollectionSearch}
										placeholder="Search your collection"
										placeholderTextColor={MUTED}
										className="flex-1 text-[#F9FAFB] text-base py-0"
										returnKeyType="search"
									/>
								</View>

								<TouchableOpacity
									activeOpacity={0.8}
									onPress={() => {}}
									accessibilityRole="button"
									accessibilityLabel="Collection filters (not implemented)"
									className="w-[52px] h-11 rounded-[14px] bg-[#2A2A2A] items-center justify-center"
								>
									<Ionicons
										name="options-outline"
										size={22}
										color={TEXT}
									/>
								</TouchableOpacity>
							</View>

							<FlatList
								contentContainerClassName="px-5 pt-5.5 pb-7"
								data={modalTiles}
								keyExtractor={(x) => x.id}
								numColumns={2}
								columnWrapperClassName="gap-3.5"
								renderItem={({ item }) => {
									if (item.kind === 'add') {
										return (
											<TouchableOpacity
												activeOpacity={0.8}
												onPress={() => {}}
												className="flex-1 h-[160px] rounded-[26px] bg-[#2E2E2E] items-center justify-center"
												accessibilityRole="button"
												accessibilityLabel="Add resource to collection (not implemented)"
											>
												<Text
													className="text-[#F9FAFB] text-[72px] font-extralight -mt-1.5"
												>
													+
												</Text>
											</TouchableOpacity>
										);
									}

									const resource = item.resource;

									return (
										<TouchableOpacity
											activeOpacity={0.8}
											className="flex-1 h-[160px] rounded-[26px] bg-[#2E2E2E] justify-end p-3.5"
											onPress={() =>
												router.push({
													pathname: '/resource/[id]',
													params: {
														id: resource.id,
														resource:
															JSON.stringify(
																resource,
															),
													},
												})
											}
										>
											<Text
												className="text-[#F9FAFB] text-[26px] font-extrabold"
												numberOfLines={2}
											>
												{resource.title}
											</Text>
										</TouchableOpacity>
									);
								}}
								ListEmptyComponent={
									openCollection?.id === 'recent' ? (
										<Text
											className="text-[#9CA3AF] text-base mt-2"
										>
											No saved resources yet.
										</Text>
									) : null
								}
								showsVerticalScrollIndicator={false}
							/>
						</View>
					</SafeAreaView>
				</Modal>
			</View>
		</SafeAreaView>
	);
}
