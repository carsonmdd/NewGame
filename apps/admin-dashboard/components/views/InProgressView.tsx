import { Hammer, Sparkles } from 'lucide-react';

type Props = {
	title: string;
};

const InProgressView = ({ title }: Props) => {
	return (
		<div className="flex flex-col items-center justify-center min-h-[60vh] w-full p-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 h-full">
			<div className="relative group max-w-md w-full glass rounded-3xl p-12 flex flex-col items-center text-center shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden">
				{/* Ambient Glow */}
				<div className="absolute -top-24 -left-24 w-48 h-48 bg-accent-blue/10 blur-[80px] rounded-full group-hover:bg-accent-blue/20 transition-colors duration-700" />
				<div className="absolute -bottom-24 -right-24 w-48 h-48 bg-purple-500/10 blur-[80px] rounded-full group-hover:bg-purple-500/20 transition-colors duration-700" />

				<div className="relative mb-8">
					<div className="absolute inset-0 bg-accent-blue/20 blur-2xl rounded-full scale-150 animate-pulse" />
					<div className="relative flex items-center justify-center size-20 rounded-2xl bg-linear-to-br from-accent-blue/20 to-accent-blue/5 border border-accent-blue/30 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]">
						<Hammer className="size-10 text-accent-blue" />
						<Sparkles className="absolute -top-2 -right-2 size-5 text-accent-bright animate-bounce" />
					</div>
				</div>

				<h2 className="text-3xl font-semibold tracking-tight bg-linear-to-b from-white via-white/95 to-white/70 bg-clip-text text-transparent">
					{title}
				</h2>

				<p className="mt-4 text-muted-foreground leading-relaxed">
					This module is currently being obsessively crafted. Check
					back soon for the full experience.
				</p>

				<div className="mt-10 w-full space-y-2">
					<div className="flex items-center justify-between text-[10px] uppercase tracking-widest text-muted-foreground font-mono">
						<span>Progress</span>
					</div>
					<div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/3">
						<div className="bg-accent-blue h-full w-[42%] rounded-full shadow-[0_0_15px_rgba(94,106,210,0.5)] animate-[shine_2s_infinite]" />
					</div>
				</div>
			</div>
		</div>
	);
};

export default InProgressView;
