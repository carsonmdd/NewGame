'use client';

import { useRef } from 'react';
import { Button } from './ui/button';
import { ButtonGroup } from './ui/button-group';
import { Download, Upload } from 'lucide-react';

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
				<Button variant="secondary" onClick={handleImportClick}>
					<Upload className="mr-2 size-4" />
					Import CSV
				</Button>
				<Button variant="secondary" onClick={onExport}>
					<Download className="mr-2 size-4" />
					Export CSV
				</Button>
			</ButtonGroup>
		</div>
	);
};

export default CSVToolbar;
