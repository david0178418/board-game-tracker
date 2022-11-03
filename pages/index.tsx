import type { Game } from '@common/types';

import Head from 'next/head';
import { LoginBtn } from '@components/login-btn';
import { useIsLoggedIn } from '@common/hooks';
import { GetServerSideProps } from 'next';
import { getCollection } from '@server/mongodb';
import { DbCollections, Paths } from '@common/constants';
import { getServerSession } from '@server/auth-options';
import { ObjectId } from 'mongodb';
import { dbGameToGame } from '@server/transforms';
import { CreateGameForm } from '@components/create-game.form';
import {
	Container,
	List,
	ListItem,
	ListItemButton,
	ListItemText,
} from '@mui/material';
import Link from 'next/link';
import { urlJoin } from '@common/utils';

interface Props {
	games: Game[];
}

export
const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
	const session = await getServerSession(ctx.req, ctx.res);
	const col = await getCollection(DbCollections.Games);
	const userId = session?.user.id;

	const games = userId ?
		await col.find({ ownerId: new ObjectId(userId) }).toArray() :
		[];

	return {
		props: {
			session,
			games: games.map(dbGameToGame),
		},
	};
};

export default function Home(props: Props) {
	const { games } = props;
	const isLoggedIn = useIsLoggedIn();

	return (
		<Container>
			<Head>
				<title>Board Game Tools</title>
				<meta name="description" content="Board game tools" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			{!isLoggedIn && (
				<LoginBtn />
			)}
			{isLoggedIn && (
				<>
					<CreateGameForm />
				</>
			)}
			<List>
				{games.map(g => (
					<ListItem key={g._id}>
						<Link
							shallow
							passHref
							href={urlJoin(Paths.Game, g._id)}
						>
							<ListItemButton>
								<ListItemText
									primary={`Title: ${g.title}`}
									secondary={`Description: ${g.description}`}
								/>
							</ListItemButton>
						</Link>
					</ListItem>
				))}
			</List>
		</Container>
	);
}
