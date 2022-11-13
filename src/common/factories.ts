import type { ItemContainer } from './types';
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
function createPlayerTemplate(): any {
	return {};
}
