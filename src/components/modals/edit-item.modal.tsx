import type {
	Item,
	ItemContainer,
} from '@common/types';

import { useEffect, useState } from 'react';
import { uuid } from '@common/utils';
import {
	Button,
	Checkbox,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	FormControl,
	FormControlLabel,
	InputLabel,
	MenuItem,
	Select,
	TextField,
} from '@mui/material';

interface Props {
	selectedItem: Item | null;
	containers: ItemContainer[];
	onSave(item: Item, containerId: string): void;
	onClose(): void;
}

export
function EditItemModal(props: Props) {
	const {
		onSave,
		onClose,
		containers,
		selectedItem,
	} = props;
	const [hidden, setHidden] = useState(false);
	const [label, setLabel] = useState('');
	const [description, setDescription] = useState('');
	const [selectedContainerId, setSelectedContainerId] = useState(containers[0]?.id);

	useEffect(() => {
		setSelectedContainerId(containers[0]?.id);
	}, [containers[0]?.id]);

	function handleClose() {
		onClose();
	}

	function handleSave() {
		onSave({
			id: uuid(),
			type: '',
			statusNote: '',
			label,
			description,
			parentItems: [],
			childItems: [],
			counters: [],
		}, selectedContainerId);
		handleClose();
	}

	return (
		<>
			<Dialog
				open={!!selectedItem}
				onClose={handleClose}
			>
				<DialogTitle>New Item</DialogTitle>
				<DialogContent>
					<DialogContentText>
						A Game Item.
					</DialogContentText>
					<FormControl fullWidth margin="dense">
						<InputLabel>Container</InputLabel>
						<Select
							label="Parent Container"
							value={selectedContainerId}
							onChange={e => setSelectedContainerId(e.target.value)}
						>
							{containers.map(c => (
								<MenuItem
									key={c.id}
									value={c.id}
								>
									{c.label}
								</MenuItem>
							))}
						</Select>
					</FormControl>
					<TextField
						fullWidth
						label="Name"
						margin="dense"
						onChange={e => setLabel(e.target.value)}
					/>
					<TextField
						multiline
						fullWidth
						minRows={3}
						label="Description"
						margin="dense"
						onChange={e => setDescription(e.target.value)}
					/>
					<FormControlLabel
						label="Hidden"
						control={
							<Checkbox
								onChange={(e, newVal) => setHidden(newVal)}
								value={hidden}
							/>
						}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose}>Cancel</Button>
					<Button onClick={handleSave}>Save</Button>
				</DialogActions>
			</Dialog>
		</>
	);
}
