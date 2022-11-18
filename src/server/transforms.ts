import type{ Game } from '@common/types';
import type { DbGame } from './db-schema';

import { PasswordSaltLength } from '@common/constants';
import { hash } from 'bcryptjs';
import { ObjectId } from 'mongodb';

export
function passwordToHash(password: string) {
	return hash(password, PasswordSaltLength);
}

export
function dbGameToGame(game: DbGame): Game {
	return {
		...game,
		ownerId: game.ownerId.toString(),
		_id: game._id.toString(),
	};
}

export
function gameToDbGame(game: Game): DbGame {
	return {
		...game,
		ownerId: new ObjectId(game.ownerId),
		_id: new ObjectId(game._id),
	};
}
