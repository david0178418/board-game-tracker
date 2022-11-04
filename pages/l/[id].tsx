import type { Game, ItemContainer } from '@common/types';

import Head from 'next/head';
import { GetServerSideProps } from 'next';
import { getServerSession } from '@server/auth-options';
import { getCollection } from '@server/mongodb';
import { DbCollections } from '@common/constants';
import { ObjectId } from 'mongodb';
import { dbGameToGame } from '@server/transforms';
import { AddIcon } from '@components/icons';
import { useState } from 'react';
import { uuid } from '@common/utils';
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
	FormControlLabel,
	List,
	ListItem,
	ListItemText,
	ListSubheader,
	TextField,
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

	function addContainer(newContainer: ItemContainer) {
		if(!game) {
			return;
		}

		setGame({
			...game,
			containers: [
				...game.containers,
				newContainer,
			],
		});
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
					<List subheader={
						<ListSubheader>
							Containers
						</ListSubheader>
					}>
						{game.containers.map(c => (
							<ListItem key={c.id}>
								<ListItemText
									primary={c.label}
									secondary={c.description}
								/>
							</ListItem>
						))}
					</List>
				</>
			)}
			<Foo onSave={addContainer} />
			<Debug game={game} />
		</Container>
	);
}

interface FooProps {
	onSave(container: ItemContainer): void;
}

function Foo(props: FooProps) {
	const { onSave } = props;
	const [open, setOpen] = useState(false);
	const [hidden, setHidden] = useState(false);
	const [label, setLabel] = useState('');
	const [description, setDescription] = useState('');

	function handleClose() {
		setOpen(false);
	}

	function handleSave() {
		onSave({
			id: uuid(),
			items: [],
			label,
			description,
			informedPlayers: [],
			hidden,
			orderedItems: [],

			itemType: '',
		});
		handleClose();
	}

	return (
		<>
			<Button startIcon={<AddIcon/>} onClick={() => setOpen(true)}>
				Add Container
			</Button>
			<Dialog open={open} onClose={handleClose}>
				<DialogTitle>New Container</DialogTitle>
				<DialogContent>
					<DialogContentText>
						A container to hold game stuff (such as a deck, play field, or bag of tokens).
					</DialogContentText>
					<TextField
						fullWidth
						label="Container Name"
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
								value={hidden} />
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
	const[hidden, setHidden] = useState(false);

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
