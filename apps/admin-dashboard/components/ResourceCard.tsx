'use client';

import { Resource } from '@/types/resource';
import { Button } from '@/components/ui/button';
import { Edit2, Trash2 } from 'lucide-react';
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

			<div className="relative flex items-start justify-between gap-4">
				<div className="min-w-0">
					<div className="flex items-center gap-3">
						<h3 className="text-lg font-semibold text-foreground tracking-tight truncate">
							{resource.title || 'Untitled Resource'}
						</h3>
					</div>

					<p className="mt-3 text-sm text-muted-foreground leading-relaxed line-clamp-2">
						{resource.description ||
							'No description provided for this resource.'}
					</p>
				</div>

				<Button
					variant="ghost"
					size="icon-sm"
					onClick={() => onEdit(resource)}
					className="opacity-0 group-hover:opacity-100 transition-opacity"
					title="Edit"
				>
					<Edit2 className="size-4" />
				</Button>
			</div>

			<div className="relative mt-6 flex flex-wrap items-center gap-2">
				{(resource.tags ?? []).slice(0, 4).map((t) => (
					<span
						key={t}
						className="px-2.5 py-0.5 rounded-full bg-accent-blue/10 border border-accent-blue/20 text-accent-blue text-[10px] font-mono tracking-wider uppercase"
					>
						{t}
					</span>
				))}
				<Button
					variant="ghost"
					size="xs"
					onClick={() => onDelete(resource)}
					className="ml-auto text-destructive hover:text-destructive hover:bg-destructive/10"
				>
					<Trash2 className="size-3 mr-1" />
					Delete
				</Button>
			</div>
		</div>
	);
}
