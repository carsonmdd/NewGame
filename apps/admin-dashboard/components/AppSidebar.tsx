import { Search, ClipboardCheck, BarChart3, Bell } from 'lucide-react';
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from '@/components/ui/sidebar';

type TabKey = 'database' | 'review' | 'analytics' | 'notifications';

interface AppSidebarProps {
	activeTab: TabKey;
	onTabChange: (tab: TabKey) => void;
}

export function AppSidebar({ activeTab, onTabChange }: AppSidebarProps) {
	const items = [
		{
			title: 'Database Search',
			key: 'database' as TabKey,
			icon: Search,
		},
		{
			title: 'Resources for Review',
			key: 'review' as TabKey,
			icon: ClipboardCheck,
		},
		{
			title: 'Analytics',
			key: 'analytics' as TabKey,
			icon: BarChart3,
		},
		{
			title: 'Notifications',
			key: 'notifications' as TabKey,
			icon: Bell,
		},
	];

	return (
		<Sidebar variant="floating" collapsible="icon">
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupContent>
						<SidebarMenu>
							{items.map((item) => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton
										className="p-8 gap-4 cursor-pointer"
										onClick={() => onTabChange(item.key)}
										isActive={activeTab === item.key}
									>
										<item.icon className="size-5!" />
										<span className="text-[14px]">
											{item.title}
										</span>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
		</Sidebar>
	);
}
