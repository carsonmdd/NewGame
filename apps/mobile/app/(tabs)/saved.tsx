import {
	Trash2,
	X,
	Search,
	Plus,
	Bookmark,
	LayoutGrid,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
	Alert,
	FlatList,
	Modal,
	ScrollView,
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
import { Background } from '@/components/Background';
import { Card } from '@/components/Card';
import { CustomText } from '@/components/CustomText';
import { Button } from '@/components/Button';

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
	const [isSearchFocused, setIsSearchFocused] = useState(false);

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
				id: resource.id,
				kind: 'resource' as const,
				resource,
			}));
		}

		return [{ id: 'add', kind: 'add' }];
	}, [openCollection, filteredSavedResources]);

	return (
		<Background>
			<SafeAreaView className="flex-1" edges={['left', 'right']}>
				<View
					className="flex-1 px-6"
					style={{ paddingTop: insets.top }}
				>
					<ScrollView
						contentContainerClassName="pb-24 pt-4"
						showsVerticalScrollIndicator={false}
					>
						<View className="mb-8">
							<CustomText
								variant="label"
								className="text-accent tracking-[0.2em] mb-1"
							>
								LIBRARY
							</CustomText>
							<CustomText variant="h1">Saved</CustomText>
						</View>

						<View className="flex-row items-center mb-6">
							<LayoutGrid size={18} color="#5E6AD2" />
							<CustomText variant="h3" className="ml-3">
								Collections
							</CustomText>
						</View>

						<View>
							{collectionRows.map((row, rowIndex) => (
								<View
									key={`row-${rowIndex}`}
									className="flex-row gap-4 mb-4"
								>
									{row.map((item) => {
										if (item.kind === 'add') {
											return (
												<TouchableOpacity
													key={item.id}
													activeOpacity={0.8}
													onPress={addCollection}
													className="flex-1"
												>
													<Card
														intensity={10}
														containerClassName="h-44 items-center justify-center border-dashed border-white/20 bg-transparent"
													>
														<View className="w-12 h-12 rounded-full bg-white/5 items-center justify-center border border-white/10 mb-2">
															<Plus
																size={24}
																color="#8A8F98"
															/>
														</View>
														<CustomText
															variant="label"
															className="text-foreground-muted"
														>
															New List
														</CustomText>
													</Card>
												</TouchableOpacity>
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
											>
												<Card
													intensity={15}
													containerClassName="h-44 justify-end p-5 border-white/5"
												>
													<View className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-accent/10 items-center justify-center border border-accent/20">
														<Bookmark
															size={14}
															color="#5E6AD2"
															fill="#5E6AD2"
														/>
													</View>
													<CustomText
														variant="h3"
														className="text-lg font-bold"
														numberOfLines={1}
													>
														{c.name}
													</CustomText>
													<CustomText
														variant="label"
														className="text-[10px] mt-1 text-foreground-subtle"
													>
														{c.id === 'recent'
															? `${savedResources.length} items`
															: 'Empty'}
													</CustomText>
												</Card>
											</TouchableOpacity>
										);
									})}

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
						<Background>
							<SafeAreaView
								className="flex-1"
								edges={['left', 'right']}
							>
								<View
									className="flex-1"
									style={{ paddingTop: insets.top }}
								>
									{/* Modal Header */}
									<View className="px-6 py-4 flex-row items-start justify-between">
										<View className="flex-1 pr-4">
											{openCollection?.id === 'recent' ? (
												<CustomText
													variant="h2"
													numberOfLines={1}
												>
													{openCollectionName}
												</CustomText>
											) : !isEditingTitle ? (
												<TouchableOpacity
													activeOpacity={0.8}
													onPress={startEditingTitle}
													className="py-1"
												>
													<CustomText
														variant="h2"
														numberOfLines={1}
													>
														{openCollectionName}
													</CustomText>
												</TouchableOpacity>
											) : (
												<View>
													<TextInput
														value={draftName}
														onChangeText={(t) =>
															setDraftName(
																sanitizeName(t),
															)
														}
														className="text-foreground text-2xl font-bold py-1 px-0 border-b border-accent"
														placeholder="Collection name"
														placeholderTextColor="#8A8F98"
														autoFocus
														maxLength={NAME_MAX}
														returnKeyType="done"
														onSubmitEditing={
															saveTitle
														}
														autoCorrect={false}
													/>
												</View>
											)}
										</View>

										<View className="flex-row gap-3 items-center">
											{openCollection?.id !==
												'recent' && (
												<TouchableOpacity
													activeOpacity={0.7}
													onPress={deleteCollection}
													className="w-10 h-10 items-center justify-center rounded-xl bg-white/5 border border-white/10"
												>
													<Trash2
														size={18}
														color="#EF4444"
													/>
												</TouchableOpacity>
											)}

											<TouchableOpacity
												activeOpacity={0.7}
												onPress={closeModal}
												className="w-10 h-10 items-center justify-center rounded-xl bg-white/5 border border-white/10"
											>
												<X size={20} color="white" />
											</TouchableOpacity>
										</View>
									</View>

									{isEditingTitle && (
										<View className="px-6 flex-row gap-3 mt-2 mb-4">
											<Button
												title="Cancel"
												onPress={() => {
													setDraftName(
														openCollectionName,
													);
													setIsEditingTitle(false);
												}}
												variant="secondary"
												style={{ flex: 1 }}
											/>
											<Button
												title="Save"
												onPress={saveTitle}
												variant="primary"
												style={{ flex: 1 }}
											/>
										</View>
									)}

									{/* Modal Search Bar */}
									<View className="px-6 flex-row items-center gap-3 mt-4">
										<View
											className={`flex-1 flex-row items-center bg-surface rounded-xl px-4 h-11 border ${isSearchFocused ? 'border-accent' : 'border-white/10'}`}
										>
											<Search
												size={16}
												color={
													isSearchFocused
														? '#5E6AD2'
														: '#8A8F98'
												}
												className="mr-2"
											/>
											<TextInput
												value={collectionSearch}
												onChangeText={
													setCollectionSearch
												}
												onFocus={() =>
													setIsSearchFocused(true)
												}
												onBlur={() =>
													setIsSearchFocused(false)
												}
												placeholder="Search your collection"
												placeholderTextColor="#8A8F98"
												className="flex-1 text-foreground text-sm font-medium py-0"
												returnKeyType="search"
											/>
										</View>
									</View>

									<FlatList
										contentContainerClassName="px-6 pt-8 pb-12"
										data={modalTiles}
										keyExtractor={(x) => x.id}
										numColumns={2}
										columnWrapperClassName="gap-4"
										renderItem={({ item }) => {
											if (item.kind === 'add') {
												return (
													<TouchableOpacity
														activeOpacity={0.8}
														onPress={() => {}}
														className="flex-1"
													>
														<Card
															intensity={10}
															containerClassName="h-40 items-center justify-center border-dashed border-white/20 bg-transparent"
														>
															<Plus
																size={32}
																color="#8A8F98"
															/>
														</Card>
													</TouchableOpacity>
												);
											}

											const resource = item.resource;

											return (
												<TouchableOpacity
													activeOpacity={0.8}
													className="flex-1"
													onPress={() =>
														router.push({
															pathname:
																'/resource/[id]',
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
													<Card
														intensity={15}
														containerClassName="h-40 justify-end p-4 border-white/5"
													>
														<CustomText
															variant="h3"
															className="text-sm font-bold leading-tight"
															numberOfLines={3}
														>
															{resource.title}
														</CustomText>
													</Card>
												</TouchableOpacity>
											);
										}}
										ListEmptyComponent={
											openCollection?.id === 'recent' ? (
												<View className="py-10 items-center">
													<CustomText
														variant="body"
														className="text-foreground-muted text-center"
													>
														No saved resources yet.
													</CustomText>
												</View>
											) : null
										}
										showsVerticalScrollIndicator={false}
									/>
								</View>
							</SafeAreaView>
						</Background>
					</Modal>
				</View>
			</SafeAreaView>
		</Background>
	);
}
