import React, {
	createContext,
	ReactNode,
	useContext,
	useMemo,
	useState,
} from 'react';
import { Resource } from '@/types/resource';

type SavedResourcesContextType = {
	savedResources: Resource[];
	saveResource: (resource: Resource) => void;
	unsaveResource: (resourceId: string) => void;
	isSaved: (resourceId: string) => boolean;
};

const SavedResourcesContext = createContext<
	SavedResourcesContextType | undefined
>(undefined);

export function SavedResourcesProvider({ children }: { children: ReactNode }) {
	const [savedResources, setSavedResources] = useState<Resource[]>([]);

	const saveResource = (resource: Resource) => {
		const id = resource.id;

		setSavedResources((prev) => {
			const alreadySaved = prev.some((r) => r.id === id);
			if (alreadySaved) return prev;
			return [resource, ...prev];
		});
	};

	const unsaveResource = (resourceId: string) => {
		setSavedResources((prev) => prev.filter((r) => r.id !== resourceId));
	};

	const value = useMemo(() => {
		const isSaved = (resourceId: string) =>
			savedResources.some((r) => r.id === resourceId);

		return { savedResources, saveResource, unsaveResource, isSaved };
	}, [savedResources]);

	return (
		<SavedResourcesContext.Provider value={value}>
			{children}
		</SavedResourcesContext.Provider>
	);
}

export function useSavedResources() {
	const context = useContext(SavedResourcesContext);
	if (!context) {
		throw new Error(
			'useSavedResources must be used within SavedResourcesProvider',
		);
	}
	return context;
}
