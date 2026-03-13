import {
	Trash2,
	X,
	Search,
	Plus,
	Bookmark,
	LayoutGrid,
	ArrowUpRight,
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
import { Background } from '@/components/Background';
import { Card } from '@/components/Card';
import { CustomText } from '@/components/CustomText';
import { Button } from '@/components/Button';
import { LinearGradient } from 'expo-linear-gradient';
import { ResourceCard } from '@/components/ResourceCard';
import { Resource } from '@/types/resource';

type Collection = {
	id: string;
	name: string;
};

const NAME_MAX = 22;

export default function SavedScreen() {
	const insets = useSafeAreaInsets();
	const router = useRouter();
	const { savedResources } = useSavedResources();

	const [collections, setCollections] = useState<Collection[]>([
		{ id: 'recent', name: 'Recently Saved' },
	]);
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

	const otherCollections = useMemo(
		() => collections.filter((c) => c.id !== 'recent'),
		[collections],
	);

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

	const handleResourcePress = (item: Resource) => {
		closeModal();

		router.push({
			pathname: '/resource/[id]',
			params: {
				id: item.id,
				resource: JSON.stringify(item),
			},
		});
	};

	return (
		<Background>
			<SafeAreaView className="flex-1" edges={['left', 'right']}>
				<View
					className="flex-1 px-6"
					style={{ paddingTop: insets.top }}
				>
					<ScrollView
						contentContainerClassName="pb-32 pt-4"
						showsVerticalScrollIndicator={false}
					>
						<View className="mb-10">
							<CustomText
								variant="label"
								className="text-accent tracking-[0.2em] mb-2"
							>
								LIBRARY
							</CustomText>
							<CustomText variant="h1" className="text-4xl">
								Saved
							</CustomText>
						</View>

						{/* Hero Card: Recently Saved */}
						<View className="mb-8">
							<TouchableOpacity
								activeOpacity={0.9}
								onPress={() =>
									openModalForCollection(collections[0])
								}
							>
								<Card
									intensity={25}
									containerClassName="h-64 p-0 border-accent/30 overflow-hidden shadow-2xl shadow-accent/20"
								>
									<LinearGradient
										colors={[
											'#5E6AD2',
											'#4F46E5',
											'#312E81',
										]}
										start={{ x: 0, y: 0 }}
										end={{ x: 1, y: 1 }}
										className="absolute inset-0 opacity-20"
									/>
									<View className="flex-1 p-7 justify-between">
										<View className="flex-row justify-between items-start">
											<View className="w-11 h-11 rounded-full bg-white/5 items-center justify-center border border-white/10">
												<ArrowUpRight
													size={22}
													color="rgba(255,255,255,0.6)"
												/>
											</View>
											<View className="size-14 rounded-2xl bg-accent items-center justify-center border border-white/20 shadow-lg shadow-accent/40">
												<Bookmark
													size={28}
													color="white"
													fill="white"
												/>
											</View>
										</View>

										<View>
											<CustomText
												variant="h2"
												className="mb-2"
											>
												Recently Saved
											</CustomText>
											<View className="flex-row items-center">
												<View className="bg-white/10 px-3 py-1 rounded-full border border-white/10">
													<CustomText
														variant="label"
														className="text-white text-[10px]"
													>
														{savedResources.length}{' '}
														items collected
													</CustomText>
												</View>
											</View>
										</View>
									</View>
								</Card>
							</TouchableOpacity>
						</View>

						{/* Grid for other collections */}
						<View className="flex-row items-center mb-6 justify-between">
							<View className="flex-row items-center">
								<LayoutGrid size={18} color="#5E6AD2" />
								<CustomText
									variant="h3"
									className="ml-3 font-semibold"
								>
									Collections
								</CustomText>
							</View>
							<TouchableOpacity
								onPress={addCollection}
								className="bg-accent/10 px-4 py-2 rounded-xl border border-accent/20"
							>
								<View className="flex-row items-center">
									<View className="mr-2">
										<Plus size={20} color="#5E6AD2" />
									</View>
									<CustomText className="text-accent text-[11px] font-bold">
										New
									</CustomText>
								</View>
							</TouchableOpacity>
						</View>

						<View className="flex-row flex-wrap gap-4">
							{otherCollections.map((c) => (
								<TouchableOpacity
									key={c.id}
									activeOpacity={0.85}
									onPress={() => openModalForCollection(c)}
									style={{ width: '47.5%' }}
								>
									<Card
										intensity={18}
										containerClassName="h-44 justify-between p-5 border-white/5 bg-white/[0.03]"
									>
										<View className="flex-row justify-between items-start">
											<View className="w-8 h-8 rounded-lg bg-white/5 items-center justify-center border border-white/10">
												<LayoutGrid
													size={14}
													color="rgba(255,255,255,0.4)"
												/>
											</View>
											<View className="w-8 h-8 rounded-lg bg-accent/20 items-center justify-center border border-accent/30">
												<Bookmark
													size={14}
													color="#5E6AD2"
													fill="#5E6AD2"
												/>
											</View>
										</View>
										<View>
											<CustomText
												variant="h3"
												className="text-[15px] font-bold leading-tight mb-1"
												numberOfLines={2}
											>
												{c.name}
											</CustomText>
											<CustomText
												variant="label"
												className="text-[9px] text-foreground-subtle tracking-widest"
											>
												0 ITEMS
											</CustomText>
										</View>
									</Card>
								</TouchableOpacity>
							))}
						</View>
					</ScrollView>

					{/* Collection Detail Modal */}
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
									<View className="px-6 py-6 flex-row items-center justify-between">
										<TouchableOpacity
											onPress={closeModal}
											className="w-11 h-11 items-center justify-center rounded-xl bg-white/5 border border-white/10"
										>
											<X size={22} color="white" />
										</TouchableOpacity>

										<View className="flex-1 px-4 items-center">
											{openCollection?.id === 'recent' ? (
												<CustomText
													variant="h3"
													className="text-xl font-bold"
													numberOfLines={1}
												>
													{openCollectionName}
												</CustomText>
											) : !isEditingTitle ? (
												<TouchableOpacity
													onPress={startEditingTitle}
												>
													<CustomText
														variant="h3"
														className="text-xl font-bold"
														numberOfLines={1}
													>
														{openCollectionName}
													</CustomText>
												</TouchableOpacity>
											) : (
												<TextInput
													value={draftName}
													onChangeText={(t) =>
														setDraftName(
															sanitizeName(t),
														)
													}
													className="text-foreground text-xl font-bold py-0 text-center border-b border-accent"
													placeholder="Collection name"
													placeholderTextColor="#8A8F98"
													autoFocus
													maxLength={NAME_MAX}
													returnKeyType="done"
													onSubmitEditing={saveTitle}
													autoCorrect={false}
												/>
											)}
										</View>

										{openCollection?.id !== 'recent' ? (
											<TouchableOpacity
												onPress={deleteCollection}
												className="w-11 h-11 items-center justify-center rounded-xl bg-red-500/10 border border-red-500/20"
											>
												<Trash2
													size={20}
													color="#EF4444"
												/>
											</TouchableOpacity>
										) : (
											<View className="w-11" />
										)}
									</View>

									{isEditingTitle && (
										<View className="px-6 flex-row gap-3 mb-6">
											<Button
												title="Cancel"
												onPress={() =>
													setIsEditingTitle(false)
												}
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

									<View className="px-6 mb-6">
										<View className="flex-row items-center bg-surface rounded-2xl px-4 h-14 border border-white/10">
											<Search size={20} color="#8A8F98" />
											<TextInput
												value={collectionSearch}
												onChangeText={
													setCollectionSearch
												}
												placeholder="Search items..."
												placeholderTextColor="#8A8F98"
												className="flex-1 text-foreground text-base ml-3 font-medium"
												returnKeyType="search"
											/>
										</View>
									</View>

									<FlatList
										contentContainerClassName="px-6 pb-24"
										data={
											openCollection?.id === 'recent'
												? filteredSavedResources
												: []
										}
										keyExtractor={(item) => item.id}
										numColumns={2}
										columnWrapperClassName="justify-between"
										renderItem={({ item }) => (
											<ResourceCard
												key={item.id}
												item={item}
												onPress={handleResourcePress}
											/>
										)}
										ListEmptyComponent={
											<View className="py-24 items-center">
												<View className="w-20 h-20 rounded-3xl bg-white/5 items-center justify-center border border-white/10 mb-6">
													<Bookmark
														size={40}
														color="rgba(255,255,255,0.15)"
													/>
												</View>
												<CustomText
													variant="h3"
													className="text-foreground-muted text-center mb-1"
												>
													Nothing here yet
												</CustomText>
												<CustomText
													variant="body"
													className="text-foreground-muted/60 text-center text-sm px-10"
												>
													{openCollection?.id ===
													'recent'
														? 'Start saving resources to see them here in your library.'
														: 'Add items to this collection to keep them organized.'}
												</CustomText>
											</View>
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
