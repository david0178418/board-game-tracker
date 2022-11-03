import type{ Game } from '@common/types';
import type { DbGame } from './db-schema';

import { PasswordSaltLength } from '@common/constants';
import { hash } from 'bcryptjs';

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
