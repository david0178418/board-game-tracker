import { ObjectId } from 'mongodb';
import {
	SettingTypes,
	UserRoles,
} from '@common/constants';
import {
	Action,
	Container,
	Counter,
} from '@common/types';

export
interface DbTextGram {
	id: ObjectId;
	type: string; // Potentially becoming some sort of enum
	grams: string;
}

export
interface DbSettings {
	type: SettingTypes;
	data: any;
}

export
interface DbNotification {
	date: string;
	message: string;
	readOn?: string | null;
	userId: ObjectId;
}

export
interface DbUser {
	_id?: ObjectId;
	role?: UserRoles;
	username: string;
	hash: string;
}

export
interface DbUserMeta {
	userId: ObjectId;
	created: string;
}

export
interface DbGame {
	_id: ObjectId;
	ownerId: ObjectId;
	title: string;
	description: string;
	containers: Container[];
	counters: Counter[];
	actionHistory: Action[];
}

// const originalState: Game = {
// 	id: 'some-game',
// 	counters: [
// 		{
// 			id: 'p1-vp',
// 			label: 'Player 1 Victory Points',
// 			value: 0,
// 		}, {
// 			id: 'p2-vp',
// 			label: 'Player 2 Victory Points',
// 			value: 0,
// 		},
// 	],
// 	containers: [
// 		{
// 			id: 'player-1-deck',
// 			label: 'Player 1 Deck',
// 			items: [],
// 			itemType: 'card',
// 			hidden: true,
// 			orderedItems: [],
// 		}, {
// 			id: 'player-1-discard',
// 			label: 'Player 1 Discard',
// 			items: [],
// 			itemType: 'card',
// 			orderedItems: [],
// 		}, {
// 			id: 'player-1-hand',
// 			label: 'Player 1 hand',
// 			items: [],
// 			itemType: 'card',
// 			orderedItems: [],
// 		}, {
// 			id: 'player-2-deck',
// 			label: 'Player 2 Deck',
// 			items: [],
// 			itemType: 'card',
// 			hidden: true,
// 			orderedItems: [],
// 		}, {
// 			id: 'player-2-discard',
// 			label: 'Player 2 Discard',
// 			items: [],
// 			itemType: 'card',
// 			orderedItems: [],
// 		}, {
// 			id: 'player-2-hand',
// 			label: 'Player 2 hand',
// 			items: [],
// 			itemType: 'card',
// 			orderedItems: [],
// 		},
// 	],
// 	actionHistory: [],
// };
