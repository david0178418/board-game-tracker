import { ObjectId } from 'mongodb';
import {
	SettingTypes,
	UserRoles,
} from '@common/constants';

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
