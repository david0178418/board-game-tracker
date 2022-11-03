import type { NextApiRequest, NextApiResponse } from 'next';

import { getCollection } from '@server/mongodb';
import { getServerSession } from '@server/auth-options';
import { z } from 'zod';
import { ObjectId } from 'mongodb';
import {
	DbCollections,
	GameDescriptionMaxLength,
	GameDescriptionMinLength,
	GameTitleMaxLength,
	GameTitleMinLength,
	NotLoggedInErrMsg,
} from '@common/constants';

const schema = z.object({
	title: z
		.string()
		.min(GameTitleMinLength)
		.max(GameTitleMaxLength),
	description: z
		.string()
		.min(GameDescriptionMinLength)
		.max(GameDescriptionMaxLength),
});

export
async function gameCreate(req: NextApiRequest, res: NextApiResponse<any>) {
	const { user } = await getServerSession(req, res) || {};

	const result = await schema.safeParseAsync(req.body);

	if(!result.success) {
		return res
			.status(400)
			.send({
				ok: false,
				errors: result
					.error
					.errors
					.map(e => e.message),
			});
	}

	if(!user) {
		return res.status(401).send(NotLoggedInErrMsg);
	}

	const {
		title,
		description,
	} = result.data;

	res.send({
		ok: true,
		data: { id: await createGame(user.id, title, description) },
	});
}

async function createGame(ownerId: string, title: string, description: string) {
	const col = await getCollection(DbCollections.Games);
	const _id = new ObjectId();

	await col.insertOne({
		_id,
		ownerId: new ObjectId(ownerId),
		title,
		description,
		containers: [],
		counters: [],
		actionHistory: [],
	});

	return _id;
}
