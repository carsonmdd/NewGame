import React from 'react';
import { Text, TextProps } from 'react-native';

interface CustomTextProps extends TextProps {
	variant?: 'display' | 'h1' | 'h2' | 'h3' | 'body' | 'body-large' | 'label';
	gradient?: boolean;
	children: React.ReactNode;
}

export function CustomText({
	variant = 'body',
	gradient = false,
	children,
	style,
	className,
	...props
}: CustomTextProps) {
	const variantStyles: Record<string, string> = {
		display:
			'text-7xl font-semibold tracking-tighter leading-tight text-foreground',
		h1: 'text-3xl font-semibold tracking-tight leading-tight text-foreground',
		h2: 'text-xl font-semibold tracking-tight leading-snug text-foreground',
		h3: 'text-lg font-semibold tracking-tight leading-normal text-foreground',
		'body-large': 'text-lg font-normal leading-relaxed text-foreground',
		body: 'text-base font-normal leading-relaxed text-foreground',
		label: 'text-xs font-mono tracking-widest uppercase text-foreground-muted',
	};

	const baseClass = variantStyles[variant] || variantStyles.body;
	const combinedClassName = `${baseClass} ${className || ''}`;

	return (
		<Text {...props} className={combinedClassName} style={style}>
			{children}
		</Text>
	);
}
