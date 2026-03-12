'use client';

import { useRef } from 'react';
import { Button } from './ui/button';
import { ButtonGroup } from './ui/button-group';

type Props = {
	onExport: () => void;
	onImport: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const CSVToolbar = ({ onExport, onImport }: Props) => {
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleImportClick = () => {
		fileInputRef.current?.click();
	};

	return (
		<div className="flex space-x-2">
			<input
				type="file"
				ref={fileInputRef}
				accept=".csv"
				className="hidden"
				onChange={onImport}
			/>

			<ButtonGroup>
				<Button
					variant="outline"
					className="bg-gray-300"
					onClick={handleImportClick}
				>
					Import CSV
				</Button>
				<Button
					onClick={onExport}
					variant="outline"
					className="bg-gray-300"
				>
					Export CSV
				</Button>
			</ButtonGroup>
		</div>
	);
};

export default CSVToolbar;
