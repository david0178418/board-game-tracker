import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import {
	useEffect,
	useState,
	useRef,
	useLayoutEffect,
	useCallback,
} from 'react';

import { UserRoles } from '@common/constants';

export
function useIsLoggedIn() {
	const { status } = useSession();

	return status === 'authenticated';
}

export
function useIsLoggedOut() {
	const { status } = useSession();
	return status === 'unauthenticated';
}

export
function useIsAdmin() {
	const { data } = useSession();

	return data?.user.role === UserRoles.Admin;
}

export
function useRefreshPage() {
	const {
		replace,
		asPath,
	} = useRouter();

	return () => replace(asPath);
}

export
function useRouteBackDefault(fallback = '/') {
	const router = useRouter();

	return () => {
		if(document.referrer.startsWith(location.origin)) {
			router.back();
		} else {
			router.replace(fallback);
		}
	};
}

export
function useDebounce<T>(value: T, delay: number) {
	const [debouncedValue, setDebouncedValue] = useState(value);

	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedValue(value);
		}, delay);

		return () => {
			clearTimeout(handler);
		};
	}, [value, delay]);

	return debouncedValue;
}

export
function useDebouncedCallback<T>(value: T, delay: number, callback: () => void,) {
	const debouncedValue = useDebounce(value, delay);

	useEffect(() => {
		callback();
	}, [debouncedValue]);
}

export
// See: https://usehooks.com/useToggle/
function useToggle(initialState = false) {
	// Initialize the state
	const [state, setState] = useState(initialState);

	// Define and memorize toggler function in case we pass down the component,
	// This function change the boolean value to it's opposite value
	const toggle = useCallback(() => setState(s => !s), []);

	return [state, toggle];
}

export
// See: https://usehooks-ts.com/react-hook/use-isomorphic-layout-effect
function useTimeout(callback: () => void, delay: number | null) {
	const savedCallback = useRef(callback);

	// Remember the latest callback if it changes.
	useLayoutEffect(() => {
		savedCallback.current = callback;
	}, [callback]);

	// Set up the timeout.
	useEffect(() => {
		// Don't schedule if no delay is specified.
		// Note: 0 is a valid value for delay.
		if (!delay && delay !== 0) {
			return;
		}

		const id = setTimeout(() => savedCallback.current(), delay);

		return () => clearTimeout(id);
	}, [delay]);
}
