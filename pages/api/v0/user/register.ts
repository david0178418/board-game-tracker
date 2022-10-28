import type { NextApiRequest, NextApiResponse } from 'next';

import { z, ZodType } from 'zod';
import { getCollection } from '@server/mongodb';
import { getServerSession } from '@server/auth-options';
import { fetchUser } from '@server/queries';
import { passwordToHash } from '@server/transforms';
import {
	DbCollections,
	PasswordMaxLength,
	PasswordMinLength,
	UsernameMaxLength,
	UsernameMinLength,
} from '@common/constants';

interface Schema {
	password: string;
	username: string;
}

const schema: ZodType<Schema> = z.object({
	username: z
		.string()
		.min(UsernameMinLength)
		.max(UsernameMaxLength)
		.regex(/^[a-z0-9]+$/i),
	password: z
		.string()
		.min(PasswordMinLength)
		.max(PasswordMaxLength),
});

export default
async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
	const session = await getServerSession(req, res);

	if(session) {
		return res.status(400).end();
	}
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

	const {
		username,
		password,
	} = result.data;

	if(await fetchUser(username)) {
		return res.send({
			ok: false,
			errors: [
				`User "${username}" already exists`,
			],
		});
	}

	await createUser(username, password);

	res.send({ ok: true });
}

export
async function createUser(username: string, password: string) {
	const usersCol = await getCollection(DbCollections.Users);
	const usersMeta = await getCollection(DbCollections.UsersMeta);
	const hash = await passwordToHash(password);
	const nowDate = new Date();
	const nowISOStr = nowDate.toISOString();

	const result = await usersCol
		.insertOne({
			username,
			hash,
		});

	await Promise.all([
		usersMeta
			.insertOne({
				userId: result.insertedId,
				created: nowISOStr,
			}),
	]);
}
