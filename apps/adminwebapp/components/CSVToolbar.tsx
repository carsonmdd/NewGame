type Props = {
	onExport: () => void;
	onImport: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const CSVToolbar = ({ onExport, onImport }: Props) => (
	<div className='flex space-x-2'>
		<button
			onClick={onExport}
			className='bg-blue-600 text-white px-3 py-1 text-sm rounded hover:bg-blue-700 cursor-pointer'
		>
			Export CSV
		</button>
		<label className='bg-orange-600 text-white px-3 py-1 text-sm rounded cursor-pointer hover:bg-orange-700 flex items-center justify-center'>
			Import CSV
			<input
				type='file'
				accept='.csv'
				className='hidden'
				onChange={onImport}
			/>
		</label>
	</div>
);

export default CSVToolbar;
