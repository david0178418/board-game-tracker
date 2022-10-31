import type { ReactNode } from 'react';
import { UserRoles } from './constants';

export
interface ToastMesssage {
	message: ReactNode;
	delay?: number;
	onClose?(): void;
}

export
interface Settings {
	foo: 'bar';
}

interface User {
	id: string;
	username: string;
	role: UserRoles;
}

declare module 'next-auth' {
	interface Session {
		user: User;
	}

}

declare module 'next-auth/jwt' {
	interface JWT {
		user: User;
	}
}

// Utility types
export
type AsyncFnReturnType<T extends (...args: any[]) => Promise<any>> = Awaited<ReturnType<T>>;

export
type Nullable<T> = T | null;

type Invalid<T> = ['Needs to be all of', T];

export
// Source https://stackoverflow.com/a/73457231
function arrayOfAll<T extends keyof any>() {
	return (
		<U extends T[]>(
			...array: U & ([T] extends [U[number]] ? unknown : Invalid<T>[])
		) => array
	);
}

/// sketching

export
interface Counter {
	id: string;
	label: string;
	value: number;
}

export
interface Container {
	id: string;
	label: string;
	items: Item[];
	itemType: string;
	owner?: string;
	hidden?: boolean;
	informedPlayers?: string[];
	orderedItems: string[];
}

export
interface Item {
	id: string;
	type: string;
	label: string;
	statusNote: string;
	description: string;
	childItems?: Item[];
	counters?: Counter[];
}

export
interface Action {
	player: string;
	description: string;
	movement?: {
		itemId: string;
		type: 'container' | 'position';
	};
}
