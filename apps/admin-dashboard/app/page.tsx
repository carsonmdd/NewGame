'use client';

import { AppSidebar } from '@/components/AppSidebar';
import CatalogView from '@/components/views/CatalogView';
import ReviewView from '@/components/views/ReviewView';
import AnalyticsView from '@/components/views/AnalyticsView';
import NotificationsView from '@/components/views/NotificationsView';
import { useState } from 'react';

type TabKey = 'catalog' | 'review' | 'analytics' | 'notifications';

export default function Home() {
	const [activeTab, setActiveTab] = useState<TabKey>('catalog');

	const renderView = () => {
		switch (activeTab) {
			case 'catalog':
				return <CatalogView />;
			case 'review':
				return <ReviewView />;
			case 'analytics':
				return <AnalyticsView />;
			case 'notifications':
				return <NotificationsView />;
			default:
				return <CatalogView />;
		}
	};

	return (
		<div className="flex w-full">
			<AppSidebar activeTab={activeTab} onTabChange={setActiveTab} />
			<main className="flex-1 overflow-auto">{renderView()}</main>
		</div>
	);
}
