'use client';

import { Resource } from '@/types/resource';
import { Button } from '@/components/ui/button';
import { Edit2, Trash2, Link as LinkIcon, User, BookOpen } from 'lucide-react';
import { useState, useRef, MouseEvent } from 'react';

export default function ResourceCard({
	resource,
	onEdit,
	onDelete,
}: {
	resource: Resource;
	onEdit: (resource: Resource) => void;
	onDelete: (resource: Resource) => void;
}) {
	const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
	const cardRef = useRef<HTMLDivElement>(null);

	const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
		if (!cardRef.current) return;
		const rect = cardRef.current.getBoundingClientRect();
		setMousePosition({
			x: e.clientX - rect.left,
			y: e.clientY - rect.top,
		});
	};

	return (
		<div
			ref={cardRef}
			onMouseMove={handleMouseMove}
			className="group relative rounded-2xl border border-white/10 bg-white/3 p-6 transition-all duration-300 hover:border-white/20 hover:bg-white/5 shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_2px_20px_rgba(0,0,0,0.4)] hover:shadow-[0_0_0_1px_rgba(255,255,255,0.1),0_8px_40px_rgba(0,0,0,0.5),0_0_80px_rgba(94,106,210,0.1)] overflow-hidden"
		>
			{/* Spotlight Effect */}
			<div
				className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
				style={{
					background: `radial-gradient(400px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(94,106,210,0.15), transparent 80%)`,
				}}
			/>

			<div className="relative flex flex-col h-full">
				<div className="flex items-start justify-between gap-4 mb-4">
					<div className="min-w-0">
						<h3 className="text-lg font-semibold text-foreground tracking-tight leading-snug">
							{resource.title || 'Untitled Resource'}
						</h3>
						<div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-muted-foreground">
							<span className="flex items-center gap-1">
								<User className="size-3" />
								{resource.author || 'Unknown Author'}
							</span>
							<span className="flex items-center gap-1">
								<BookOpen className="size-3" />
								{resource.source || 'Unknown Source'}
							</span>
						</div>
					</div>

					<div className="flex items-center gap-1 shrink-0">
						<a
							href={resource.url}
							target="_blank"
							rel="noopener noreferrer"
							className="p-2 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-foreground transition-colors"
						>
							<LinkIcon className="size-4" />
						</a>
						<Button
							variant="ghost"
							size="icon-sm"
							onClick={() => onEdit(resource)}
							title="Edit"
						>
							<Edit2 className="size-4" />
						</Button>
					</div>
				</div>

				<div className="flex-1">
					<p className="text-sm text-muted-foreground/90 leading-relaxed line-clamp-3 italic">
						{`"${resource.centralClaim}"`}
					</p>
				</div>

				<div className="mt-6 flex flex-wrap items-center gap-1.5">
					{(resource.keywords ?? []).slice(0, 3).map((t) => (
						<span
							key={t}
							className="px-2 py-0.5 rounded-md bg-accent-blue/5 border border-accent-blue/10 text-accent-blue/80 text-[10px] font-medium tracking-wide"
						>
							{t}
						</span>
					))}
					<Button
						variant="ghost"
						size="icon-xs"
						onClick={() => onDelete(resource)}
						className="ml-auto text-muted-foreground/40 hover:text-destructive hover:bg-destructive/10 transition-all"
					>
						<Trash2 className="size-4" />
					</Button>
				</div>
			</div>
		</div>
	);
}
