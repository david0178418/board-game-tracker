import type { Item, ItemContainer } from './types';
import { uuid } from './utils';

export
function createItemContainer(): ItemContainer {
	return {
		id: uuid(),
		items: [],
		label: '',
		description: '',
		informedPlayers: [],
		hidden: false,
		orderedItems: [],
		itemType: '',
	};
}

export
function createItem(): Item {
	return {
		id: uuid(),
		label: '',
		description: '',
		hidden: false,
		type: '',
		statusNote: '',
		parentItems: [],
		childItems: [],
		counters: [],
	};
}

export
function createPlayerTemplate(): any {
	return {};
}
