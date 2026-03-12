import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from 'radix-ui';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
	"group/button relative inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:ring-2 focus-visible:ring-accent-blue/50 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 overflow-hidden",
	{
		variants: {
			variant: {
				default:
					'bg-accent-blue text-white shadow-[0_0_0_1px_rgba(94,106,210,0.5),0_4px_12px_rgba(94,106,210,0.3),inset_0_1px_0_0_rgba(255,255,255,0.2)] hover:bg-accent-bright hover:shadow-[0_0_0_1px_rgba(94,106,210,0.6),0_8px_20px_rgba(94,106,210,0.4)]',
				outline:
					'border-white/10 bg-transparent hover:bg-white/[0.05] hover:border-white/20 text-foreground',
				secondary:
					'bg-white/[0.05] text-foreground hover:bg-white/[0.08] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]',
				ghost: 'hover:bg-white/[0.05] hover:text-foreground',
				destructive:
					'bg-destructive/20 text-destructive-foreground hover:bg-destructive/30 border-destructive/50',
				link: 'text-accent-blue underline-offset-4 hover:underline',
			},
			size: {
				default: 'h-9 px-4 py-2',
				xs: 'h-7 px-2 text-xs',
				sm: 'h-8 px-3 text-xs',
				lg: 'h-10 px-8 text-base',
				icon: 'size-9',
				'icon-xs': 'size-7',
				'icon-sm': 'size-8',
				'icon-lg': 'size-10',
			},
		},
		defaultVariants: {
			variant: 'default',
			size: 'default',
		},
	},
);

function Button({
	className,
	variant = 'default',
	size = 'default',
	asChild = false,
	...props
}: React.ComponentProps<'button'> &
	VariantProps<typeof buttonVariants> & {
		asChild?: boolean;
	}) {
	const Comp = asChild ? Slot.Root : 'button';

	return (
		<Comp
			data-slot="button"
			data-variant={variant}
			data-size={size}
			className={cn(buttonVariants({ variant, size, className }))}
			{...props}
		>
			{props.children}
			{variant === 'default' && (
				<span className="absolute inset-0 pointer-events-none bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/button:animate-[shine_1s_ease-in-out]" />
			)}
		</Comp>
	);
}

export { Button, buttonVariants };
