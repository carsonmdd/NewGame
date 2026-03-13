import React from 'react';
import { Text, View } from 'react-native';

type Props = {
	resource: string;
};

const ResourceDetailScreen = ({ resource }: Props) => {
	return (
		<View className="flex-1 items-center justify-center bg-white">
			<Text className="text-xl font-bold text-blue-500">
				ResourceDetailScreen
			</Text>
		</View>
	);
};

export default ResourceDetailScreen;
