import { createGame } from '@client/api-calls';
import { useRefreshPage } from '@common/hooks';
import { Button, TextField } from '@mui/material';
import { useState } from 'react';

interface Props {
	library?: boolean;
}

export
function CreateGameForm(props: Props) {
	const { library = false } = props;
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const reload = useRefreshPage();

	const canSave = !!(title.trim() && description.trim());

	async function handleSave() {
		setIsLoading(true);

		try {
			await createGame(title.trim(), description.trim(), library);
			clear();
			await reload();
		} catch(e) {
			console.log(e);
		}

		setIsLoading(false);
	}

	function clear() {
		setTitle('');
		setDescription('');
	}

	return (
		<>
			<TextField
				label="Title"
				disabled={isLoading}
				value={title}
				onChange={e => setTitle(e.target.value)}
			/>
			<TextField
				label="Description"
				disabled={isLoading}
				value={description}
				onChange={e => setDescription(e.target.value)}
			/><br/>
			<Button disabled={!canSave} onClick={handleSave}>Create</Button>
		</>
	);
}
