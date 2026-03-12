'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { resourceApi } from '@/lib/api';
import { Resource, ResourceInput } from '@/types/resource';
import ResourceForm from '@/components/ResourceForm';
import ResourceCard from '@/components/ResourceCard';
import CSVToolbar from '@/components/CSVToolbar';
import { useResourceCSV } from '@/hooks/useResourceCSV';
import { AppSidebar } from '@/components/AppSidebar';
import DatabaseView from '@/components/tabs/DatabaseView';
import ReviewView from '@/components/tabs/ReviewView';
import AnalyticsView from '@/components/tabs/AnalyticsView';
import NotificationsView from '@/components/tabs/NotificationsView';

type TabKey = 'database' | 'review' | 'analytics' | 'notifications';

export default function Home() {
	const [activeTab, setActiveTab] = useState<TabKey>('database');

	const renderView = () => {
		switch (activeTab) {
			case 'database':
				return <DatabaseView />;
			case 'review':
				return <ReviewView />;
			case 'analytics':
				return <AnalyticsView />;
			case 'notifications':
				return <NotificationsView />;
			default:
				return <DatabaseView />;
		}
	};

	return (
		<div className="flex w-full">
			<AppSidebar activeTab={activeTab} onTabChange={setActiveTab} />
			<main className="flex-1 overflow-auto">{renderView()}</main>
		</div>
	);
}
