/** @type {import('tailwindcss').Config} */
module.exports = {
	// NOTE: Update this to include the paths to all files that contain Nativewind classes.
	content: [
		'./app/**/*.{ts,tsx}',
		'./components/**/*.{ts,tsx}',
		'./node_modules/@rnr/**/*.{ts,tsx}',
	],
	presets: [require('nativewind/preset')],
	theme: {
		extend: {
			colors: {
				background: {
					deep: '#020203',
					base: '#050506',
					elevated: '#0a0a0c',
				},
				foreground: {
					DEFAULT: '#EDEDEF',
					muted: '#8A8F98',
					subtle: 'rgba(255,255,255,0.60)',
				},
				accent: {
					DEFAULT: '#5E6AD2',
					bright: '#6872D9',
					glow: 'rgba(94,106,210,0.3)',
				},
				surface: {
					DEFAULT: 'rgba(255,255,255,0.05)',
					hover: 'rgba(255,255,255,0.08)',
				},
				border: {
					default: 'rgba(255,255,255,0.06)',
					hover: 'rgba(255,255,255,0.10)',
					accent: 'rgba(94,106,210,0.30)',
				},
			},
			letterSpacing: {
				tight: '-0.02em',
				tighter: '-0.03em',
				widest: '0.1em',
			},
		},
	},
	plugins: [],
};
