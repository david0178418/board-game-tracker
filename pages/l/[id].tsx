import type {
	Game,
	Item,
	ItemContainer,
} from '@common/types';

import Head from 'next/head';
import { GetServerSideProps } from 'next';
import { getServerSession } from '@server/auth-options';
import { getCollection } from '@server/mongodb';
import { DbCollections } from '@common/constants';
import { ObjectId } from 'mongodb';
import { dbGameToGame } from '@server/transforms';
import { useEffect, useState } from 'react';
import { uuid } from '@common/utils';
import { DropdownMenu } from '@components/dropdown-menu';
import { createItemContainer } from '@common/factories';
import {
	AddIcon,
	DeleteIcon,
	EditIcon,
} from '@components/icons';
import {
	Box,
	Button,
	Checkbox,
	Container,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Divider,
	FormControl,
	FormControlLabel,
	InputLabel,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	ListSubheader,
	Menu,
	MenuItem,
	Select,
	TextField,
	Typography,
} from '@mui/material';

interface Props {
	game: Game | null;
}

export
const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
	const session = await getServerSession(ctx.req, ctx.res);
	// const userId = session?.user.id;

	const { id = '' } = ctx.params || {};

	if(typeof id !== 'string' && id) {
		return {
			props: {
				session,
				game: null,
			},
		};
	}

	const col = await getCollection(DbCollections.Library);
	const game = await col.findOne({ _id: new ObjectId(id) });

	return {
		props: {
			session,
			game: game && dbGameToGame(game),
		},
	};
};

export default function Home(props: Props) {
	const { game: rawGame } = props;
	const [game, setGame] = useState(rawGame);
	const [activeContainer, setActiveContainer] = useState<ItemContainer | null>(null);
	const [itemModalOpen, setItemModalOpen] = useState(false);

	function addContainer(newContainer: ItemContainer) {
		if(!game) {
			return;
		}

		setGame({
			...game,
			containers: [
				...game.containers.filter(c => c.id !== newContainer.id),
				newContainer,
			],
		});
	}

	function saveItem(newItem: Item, containerId: string) {
		if(!game) {
			return;
		}

		setGame({
			...game,
			containers: game.containers.map(c => {
				if(c.id === containerId) {
					c.items = [
						...c.items.filter(i => i.id !== newItem.id),
						newItem,
					];
				}

				return c;
			}),
		});
	}

	function handleSelect(type: any) {
		if(type === 'container') {
			setActiveContainer(createItemContainer());
		}
	}

	return (
		<Container>
			<Head>
				<title>Board Game Tools - Library</title>
				<meta name="description" content="Board game tools" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			{game && (
				<>
					<Typography>
						{game.title}
					</Typography>
					<Bar
						onSelect={handleSelect}
						hasContainers={!!game?.containers.length}
					/>
					<List subheader={
						<ListSubheader>
							Containers
						</ListSubheader>
					}>
						{game.containers.map(c => (
							<ListItem
								key={c.id}
								secondaryAction={
									<DropdownMenu>
										<MenuItem>
											<ListItemIcon>
												<AddIcon/>
											</ListItemIcon>
											Add Item
										</MenuItem>
										<MenuItem onClick={() => setActiveContainer(c)}>
											<ListItemIcon>
												<EditIcon/>
											</ListItemIcon>
											Edit
										</MenuItem>
										<Divider/>
										<MenuItem>
											<ListItemIcon>
												<DeleteIcon/>
											</ListItemIcon>
											Delete
										</MenuItem>
									</DropdownMenu>
								}
							>
								<ListItemText
									primary={c.label}
									secondary={c.description}
								/>
							</ListItem>
						))}
					</List>
					<NewContainerModal
						selectedContainer={activeContainer}
						onSave={addContainer}
						onClose={() => setActiveContainer(null)}
					/>
					<NewItemModal
						open={itemModalOpen}
						containers={game.containers}
						onSave={saveItem}
						onClose={() => setItemModalOpen(false)}
					/>
				</>
			)}
			<Debug game={game} />
		</Container>
	);
}

interface NewContainerModalProps {
	selectedContainer: ItemContainer | null;
	onSave(container: ItemContainer): void;
	onClose(): void;
}

function NewContainerModal(props: NewContainerModalProps) {
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

interface NewItemModalProps {
	open: boolean;
	containers: ItemContainer[];
	onSave(item: Item, containerId: string): void;
	onClose(): void;
}

function NewItemModal(props: NewItemModalProps) {
	const {
		onSave,
		onClose,
		containers,
		open,
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
			<Dialog open={open} onClose={handleClose}>
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

interface DebugProps {
	game: Game | null;
}

function Debug(props: DebugProps) {
	const { game } = props;
	const[hidden, setHidden] = useState(true);

	return (
		<Box>
			<Button onClick={() => setHidden(!hidden)}>
				Debug
			</Button>
			{!hidden && (
				<pre>
					{JSON.stringify(game, null, 4)}
				</pre>
			)}
		</Box>
	);
}

interface BarProps {
	hasContainers?: boolean;
	onSelect(type: any): void;
}

function Bar(props: BarProps) {
	const {
		onSelect,
		hasContainers,
	} = props;
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const open = !!anchorEl;

	function handleClose(type?: any) {
		type && onSelect(type);
		setAnchorEl(null);
	}

	return (
		<div>
			<Button
				startIcon={<AddIcon/>}
				onClick={e => setAnchorEl(e.currentTarget)}
			>
				Add
			</Button>
			<Menu
				anchorEl={anchorEl}
				open={open}
				onClose={() => handleClose()}
			>
				<MenuItem
					onClick={() => handleClose('container')}
				>
					Add Container
				</MenuItem>
				<MenuItem
					disabled={!hasContainers}
					onClick={() => handleClose('item')}
				>
					Add Item
				</MenuItem>
			</Menu>
		</div>
	);
}
