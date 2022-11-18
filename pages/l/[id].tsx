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
import { Fragment, useState } from 'react';
import { DropdownMenu } from '@components/dropdown-menu';
import { createItem, createItemContainer } from '@common/factories';
import { EditContainerModal } from '@components/modals/edit-container.modal';
import { EditItemModal } from '@components/modals/edit-item.modal';
import { Debug } from '@components/debug';
import SubDirIcon from '@mui/icons-material/SubdirectoryArrowRight';
import {
	AddIcon,
	DeleteIcon,
	EditIcon,
} from '@components/icons';
import {
	Button,
	Container,
	Divider,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	ListSubheader,
	Menu,
	MenuItem,
	Typography,
} from '@mui/material';
import { saveGame } from '@client/api-calls';

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
	const [activeItem, setActiveItem] = useState<Item | null>(null);
	const [itemContainer, setItemContainer] = useState('');

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

	function openItemEdit(parentContainer: string) {
		setItemContainer(parentContainer);
		setActiveItem(createItem());
	}

	function handleSelect(type: any) {
		if(type === 'container') {
			setActiveContainer(createItemContainer());
		}
	}

	function handleSave() {
		if(!game) {
			return;
		}

		saveGame(game);
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
					<Button onClick={handleSave}>
						Save
					</Button>
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
							<Fragment key={c.id}>
								<ListItem
									key={c.id}
									secondaryAction={
										<DropdownMenu>
											<MenuItem onClick={() => openItemEdit(c.id)}>
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
								{!!c.items.length && (
									<List disablePadding>
										{c.items.map(i => (
											<ListItem key={i.id}>
												<ListItemIcon>
													<SubDirIcon />
												</ListItemIcon>
												<ListItemText
													primary={i.label}
													secondary={i.description}
												/>
											</ListItem>
										))}
									</List>
								)}
							</Fragment>
						))}
					</List>
					<EditContainerModal
						selectedContainer={activeContainer}
						onSave={addContainer}
						onClose={() => setActiveContainer(null)}
					/>
					<EditItemModal
						container={itemContainer}
						selectedItem={activeItem}
						containers={game.containers}
						onSave={saveItem}
						onClose={() => setActiveItem(null)}
					/>
				</>
			)}
			<Debug obj={game} />
		</Container>
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
