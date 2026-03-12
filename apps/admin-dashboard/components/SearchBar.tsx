import { Input } from './ui/input';
import { Field } from './ui/field';

type Props = {
	onSearch: (term: string) => void;
};

const SearchBar = ({ onSearch }: Props) => {
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		onSearch(e.target.value);
	};

	return (
		<Field orientation="horizontal">
			<Input
				type="search"
				placeholder="Search..."
				onChange={handleChange}
			/>
		</Field>
	);
};

export default SearchBar;
