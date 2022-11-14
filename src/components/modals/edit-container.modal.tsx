import type { ItemContainer } from '@common/types';

import { useEffect, useState } from 'react';
import {
	Button,
	Checkbox,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	FormControlLabel,
	TextField,
} from '@mui/material';

interface Props {
	selectedContainer: ItemContainer | null;
	onSave(container: ItemContainer): void;
	onClose(): void;
}

export
function EditContainerModal(props: Props) {
	const {
		onSave,
		onClose,
		selectedContainer,
	} = props;
	const [hidden, setHidden] = useState(false);
	const [label, setLabel] = useState('');
	const [description, setDescription] = useState('');

	useEffect(() => {
		setHidden(selectedContainer?.hidden || false);
		setLabel(selectedContainer?.label || '');
		setDescription(selectedContainer?.description || '');
	}, [selectedContainer]);

	function handleClose() {
		onClose();
	}

	function handleSave() {
		if(!selectedContainer) {
			return;
		}

		onSave({
			...selectedContainer,
			label,
			description,
			hidden,
		});
		handleClose();
	}

	return (
		<>
			<Dialog
				open={!!selectedContainer}
				onClose={handleClose}
			>
				<DialogTitle>Edit Container</DialogTitle>
				<DialogContent>
					<DialogContentText>
						A container to hold game stuff (such as a deck, play field, or bag of tokens).
					</DialogContentText>
					<TextField
						fullWidth
						label="Name"
						margin="dense"
						value={label}
						onChange={e => setLabel(e.target.value)}
					/>
					<TextField
						multiline
						fullWidth
						minRows={3}
						label="Description"
						margin="dense"
						value={description}
						onChange={e => setDescription(e.target.value)}
					/>
					<FormControlLabel
						label="Hidden"
						value={hidden}
						control={
							<Checkbox
								onChange={(e, newVal) => setHidden(newVal)}
								value={hidden}
							/>
						}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose}>
						Cancel
					</Button>
					<Button onClick={handleSave}>
						Save
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
}
