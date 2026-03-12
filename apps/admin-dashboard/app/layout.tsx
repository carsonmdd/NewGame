import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { SidebarProvider } from '@/components/ui/sidebar';

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
});

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
});

export const metadata: Metadata = {
	title: 'NewGame',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang="en"
			className={`${geistSans.variable} ${geistMono.variable} dark`}
		>
			<body className="antialiased bg-bg-base relative min-h-screen overflow-x-hidden">
				{/* Background Layers */}
				<div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
					{/* Base Radial Gradient */}
					<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#0a0a0f_0%,#050506_50%,#020203_100%)]" />

					{/* Grid Overlay */}
					<div className="absolute inset-0 grid-background opacity-20" />

					{/* Animated Ambient Blobs */}
					<div
						className="absolute top-[-10%] left-[20%] w-[600px] h-[600px] rounded-full bg-accent-blue/10 blur-[120px] animate-[float_15s_ease-in-out_infinite]"
						style={{ animationDelay: '0s' }}
					/>
					<div
						className="absolute bottom-[-10%] right-[10%] w-[500px] h-[500px] rounded-full bg-purple-500/5 blur-[100px] animate-[float_12s_ease-in-out_infinite]"
						style={{ animationDelay: '-4s' }}
					/>
					<div
						className="absolute top-[30%] right-[-5%] w-[400px] h-[400px] rounded-full bg-indigo-500/5 blur-[100px] animate-[float_18s_ease-in-out_infinite]"
						style={{ animationDelay: '-8s' }}
					/>
				</div>

				<SidebarProvider>{children}</SidebarProvider>
			</body>
		</html>
	);
}
