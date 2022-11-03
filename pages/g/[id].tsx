import type { Game } from '@common/types';

import Head from 'next/head';
import { GetServerSideProps } from 'next';
import { getServerSession } from '@server/auth-options';
import { Container } from '@mui/material';
import { getCollection } from '@server/mongodb';
import { DbCollections } from '@common/constants';
import { ObjectId } from 'mongodb';
import { dbGameToGame } from '@server/transforms';

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

	const col = await getCollection(DbCollections.Games);
	const game = await col.findOne({ _id: new ObjectId(id) });

	return {
		props: {
			session,
			game: game && dbGameToGame(game),
		},
	};
};

export default function Home(props: Props) {
	const { game } = props;

	return (
		<Container>
			<Head>
				<title>Board Game Tools</title>
				<meta name="description" content="Board game tools" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<pre>
				{JSON.stringify(game, null, 4)}
			</pre>
		</Container>
	);
}
