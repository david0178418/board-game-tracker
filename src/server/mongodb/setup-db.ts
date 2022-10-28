import { createUser } from '@pages/api/v0/user/register';
import { DbCollections } from '@common/constants';
import { dbClientPromise, getCollection } from '.';

export
async function setupDb() {
	const GramTextIndexName = 'gram-text-index';

	console.log('Setting up db');
	const db = await dbClientPromise;

	const collections = await db.listCollections().toArray();

	if(!collections.find(c => c.name === DbCollections.Grams)) {
		await db.createCollection(DbCollections.Grams);
	}

	const gramCol = await getCollection(DbCollections.Grams);

	if(!(await gramCol.indexExists(GramTextIndexName))) {
		console.log('Creating grams text index');
		await gramCol.createIndex({ grams: 'text' }, { name: GramTextIndexName });
	}

	// const appMetadataCol = await getCollection(DbCollections.AppMetadata);

	// if(!(await appMetadataCol.findOne({ type: SettingTypes.AwardSettings }))) {
	// 	console.log('Inserting default app metadata');
	// 	await appMetadataCol.insertOne({
	// 		type: SettingTypes.AwardSettings,
	// 		data: { foo: 'bar' },
	// 	});
	// }

	const usersCol = await getCollection(DbCollections.Users);

	if(!(await usersCol.findOne({ username: 'admin' }))) {
		console.log('Creating default admin user');
		await createUser('admin', 'password123');
	}

	console.log('Setup complete');
}
