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

type TabKey = 'catalog' | 'review' | 'analytics' | 'notifications';

interface AppSidebarProps {
	activeTab: TabKey;
	onTabChange: (tab: TabKey) => void;
}

export function AppSidebar({ activeTab, onTabChange }: AppSidebarProps) {
	const items = [
		{
			title: 'Catalog',
			key: 'catalog' as TabKey,
			icon: Search,
		},
		{
			title: 'Review',
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
		<Sidebar
			variant="floating"
			collapsible="icon"
			className="border-white/10"
		>
			<SidebarContent className="bg-bg-base/40 backdrop-blur-xl border-r border-white/5">
				<SidebarGroup>
					<SidebarGroupContent className="mt-4">
						<SidebarMenu>
							{items.map((item) => (
								<SidebarMenuItem
									key={item.title}
									className="mb-1"
								>
									<SidebarMenuButton
										className="h-10 px-4 gap-3 cursor-pointer transition-all duration-200"
										onClick={() => onTabChange(item.key)}
										isActive={activeTab === item.key}
									>
										<item.icon
											className={`size-4 transition-colors ${activeTab === item.key ? 'text-accent-blue' : 'text-muted-foreground'}`}
										/>
										<span
											className={`text-[13px] font-medium transition-colors ${activeTab === item.key ? 'text-foreground' : 'text-muted-foreground'}`}
										>
											{item.title}
										</span>
										{activeTab === item.key && (
											<div className="absolute left-0 w-1 h-4 bg-accent-blue rounded-r-full shadow-[0_0_8px_rgba(94,106,210,0.8)]" />
										)}
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
