import type { NextApiRequest, NextApiResponse } from 'next';

import { getServerSession } from '@server/auth-options';
import {
	z,
	ZodType,
} from 'zod';
import {
	ItemContainer,
	Game,
	Item,
} from '@common/types';
import {
	GameDescriptionMaxLength,
	GameDescriptionMinLength,
	GameTitleMaxLength,
	GameTitleMinLength,
	NotLoggedInErrMsg,
} from '@common/constants';

const MongoObjectId = z
	.string()
	.trim()
	.length(24);

const UuidSchema = z.string().length(36);

const CounterSchema = z.object({
	id: UuidSchema,
	label: z.string().max(100),
	value: z.number(),
});

const ItemSchema: ZodType<Item> = z.object({
	id: UuidSchema,
	type: z.string().max(100),
	label: z.string().max(100),
	statusNote: z.string().max(500),
	parentItems: z.array(UuidSchema),
	childItems: z.array(UuidSchema),
	description: z.string().max(500),
	counters: z.array(CounterSchema),
});

const ContainerSchema: ZodType<ItemContainer> = z.object({
	id: MongoObjectId,
	label: z
		.string()
		.min(3)
		.max(50),
	description: z
		.string()
		.max(500),
	items: z.array(ItemSchema),
	itemType: z.string().max(50),
	owner: MongoObjectId.optional(),
	hidden: z.boolean().optional(),
	informedPlayers: z.array(MongoObjectId),
	orderedItems: z.array(UuidSchema.or(z.string().length(0))),
});

type Foo = Omit<Game, 'actionHistory'>;

const schema: ZodType<Foo> = z.object({
	_id: MongoObjectId,
	ownerId: MongoObjectId,
	title: z
		.string()
		.min(GameTitleMinLength)
		.max(GameTitleMaxLength),
	description: z
		.string()
		.min(GameDescriptionMinLength)
		.max(GameDescriptionMaxLength),
	containers: z.array(ContainerSchema),
	counters: z.array(CounterSchema),
});

export
async function gameUpdate(req: NextApiRequest, res: NextApiResponse<any>) {
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

	const game = result.data;

	res.send({
		ok: true,
		game,
		// data: { id: await updateGame(game) },
	});
}

// async function updateGame(ownerId: string, title: string, description: string, library: boolean) {
// 	const colType = library ? DbCollections.Library : DbCollections.Games;
// 	const col = await getCollection(colType);
// 	const _id = new ObjectId();

// 	await col.insertOne({
// 		_id,
// 		ownerId: new ObjectId(ownerId),
// 		title,
// 		description,
// 		containers: [],
// 		counters: [],
// 		actionHistory: [],
// 	});

// 	return _id;
// }
