import * as React from 'react';

import { cn } from '@/lib/utils';

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
	return (
		<input
			type={type}
			data-slot="input"
			className={cn(
				'h-10 w-full min-w-0 rounded-lg border border-white/10 bg-[#0F0F12] px-3 py-2 text-sm text-foreground transition-all placeholder:text-muted-foreground/50 focus:border-accent-blue/50 focus:ring-2 focus:ring-accent-blue/20 outline-none disabled:cursor-not-allowed disabled:opacity-50 shadow-sm',
				className,
			)}
			{...props}
		/>
	);
}

export { Input };
