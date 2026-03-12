import { Hammer } from 'lucide-react';

type Props = {
	title: string;
};

const InProgressView = ({ title }: Props) => {
	return (
		<div className="flex flex-col items-center justify-center h-screen w-full bg-slate-50 text-slate-500">
			<div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center">
				<div className="bg-red-50 p-4 rounded-full mb-4">
					<Hammer className="size-12 text-red-400" />
				</div>
				<h2 className="text-2xl font-bold text-slate-800">{title}</h2>
				<p className="mt-2 text-center max-w-xs">
					This module is currently under construction.
				</p>
				<div className="mt-6 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
					<div className="bg-red-400 h-full w-1/3 animate-pulse" />
				</div>
			</div>
		</div>
	);
};

export default InProgressView;
