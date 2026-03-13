import { Ionicons } from '@expo/vector-icons';
import { useAudioPlayer } from 'expo-audio';
import { Image } from 'expo-image';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { Resource } from '@/types/resource';
import {
	getDisplayKind,
	getStableId,
	getYouTubeThumb,
	isYouTubeUrl,
} from '@/utils/resourceRender';

type Props = {
	item: Resource;
	onOpenText: (id: string) => void;
	onOpenPdf: (id: string) => void;
	onOpenExternal: (url: string) => void;
};

function AudioButton({ url }: { url: string }) {
	const player = useAudioPlayer({ uri: url });

	return (
		<TouchableOpacity
			className="mt-2.5 flex-row items-center self-start bg-white/14 px-2.5 py-2 rounded-full gap-1.5"
			onPress={() => {
				if (player.playing) {
					player.pause();
				} else {
					player.play();
				}
			}}
		>
			<Ionicons
				name={player.playing ? 'pause' : 'play'}
				size={18}
				color="#fff"
			/>
			<Text className="text-white text-[12px] font-bold">
				{player.playing ? 'Pause' : 'Play'}
			</Text>
		</TouchableOpacity>
	);
}

export function ResourceCard({ item, onOpenText, onOpenPdf }: Props) {
	const kind = getDisplayKind(item);
	const id = getStableId(item);

	let previewUrl: string | null = null;

	if (kind === 'IMAGE' && item.url) {
		previewUrl = item.url;
	} else if (kind === 'VIDEO' && item.url && isYouTubeUrl(item.url)) {
		previewUrl = getYouTubeThumb(item.url);
	}

	const handlePress = () => {
		onOpenText(id);

		if (kind === 'TEXT') {
			onOpenText(id);
			return;
		}

		if (kind === 'PDF') {
			onOpenPdf(id);
			return;
		}

		onOpenText(id);
	};

	return (
		<TouchableOpacity
			className="bg-[#17133A] rounded-[18px] p-3 mb-3.5 w-[48%] min-h-[180px] justify-end overflow-hidden"
			activeOpacity={0.75}
			onPress={kind === 'AUDIO' ? undefined : handlePress}
		>
			{previewUrl ? (
				<Image
					source={previewUrl}
					className="absolute top-0 left-0 right-0 h-24"
					contentFit="cover"
				/>
			) : null}

			<View className="absolute top-2.5 right-2.5 w-[30px] h-[30px] rounded-[10px] bg-black/35 items-center justify-center">
				{kind === 'TEXT' && (
					<Ionicons name="document-text" size={16} color="#fff" />
				)}
				{kind === 'PDF' && (
					<Ionicons name="document" size={16} color="#fff" />
				)}
				{kind === 'AUDIO' && (
					<Ionicons name="musical-notes" size={16} color="#fff" />
				)}
				{kind === 'VIDEO' && (
					<Ionicons name="logo-youtube" size={16} color="#fff" />
				)}
				{kind === 'IMAGE' && (
					<Ionicons name="image" size={16} color="#fff" />
				)}
				{kind === 'LINK' && (
					<Ionicons name="open-outline" size={16} color="#fff" />
				)}
			</View>

			{item.evergreen && (
				<View className="absolute top-2.5 left-2.5 w-6 h-6 rounded-lg bg-black/35 items-center justify-center">
					<Ionicons name="leaf" size={12} color="#4ADE80" />
				</View>
			)}

			<Text className="text-white text-base font-black leading-5" numberOfLines={2}>
				{item.title}
			</Text>

			{kind === 'AUDIO' && item.url ? (
				<AudioButton url={item.url} />
			) : (
				<Text className="mt-1.5 text-white/75 text-[12px] font-bold" numberOfLines={1}>
					{kind}
				</Text>
			)}
		</TouchableOpacity>
	);
}
