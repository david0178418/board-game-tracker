import type {
	ApiResponse,
	Notification,
} from '@common/types';

import { signIn, signOut } from 'next-auth/react';
import { get, post } from '@client/client-utils';
import { urlJoin } from '@common/utils';
import { ApiUrl } from '@common/constants';

export
async function login(username: string, password: string) {
	let success = false;

	const result: any = await signIn('credentials', {
		username,
		password,
		redirect: false,
	});

	success = !!result?.ok;

	return success;
}

export
function register(username: string, password: string) {
	return apiPost<ApiResponse>('/user/register', {
		username,
		password,
	});
}

export
function updatePassword(password: string) {
	return apiPost<ApiResponse>('/user/update-password', { password });
}

export
async function logout() {
	await signOut();
}

export
async function getNotificaitons(): Promise<Notification[]> {
	const result = await apiGet<ApiResponse<{notifications: Notification[]}>>('/user/notifications');

	return result?.data?.notifications || [];
}

export
async function dismissNotification(id: string): Promise<void> {
	await apiGet('/user/notifications/dismiss', { id });
}

export
function createGame(title: string, description: string) {
	return apiPost('/game/create', {
		title,
		description,
	});
}

function apiPost<T = any>(path: string, requestBody?: any) {
	return post<T>(urlJoin(ApiUrl, path), requestBody);
}

function apiGet<T = any>(path: string, params?: any, signal?: AbortSignal) {
	return get<T>(urlJoin(ApiUrl, path), params, signal);
}
