import { getCollection } from '@server/mongodb';
import { DbCollections } from '@common/constants';
import { DbUser } from '@server/db-schema';

export
async function fetchUser(username: string): Promise<DbUser | null> {
	const usersCol = await getCollection(DbCollections.Users);
	const result = await usersCol.aggregate<DbUser>([
		{ $match: { $expr: { $eq: [ { $toLower: '$username' }, username.toLowerCase() ] } } },
		{ $limit: 1 },
	]).toArray();

	return result[0] || null;
}
