import { useCallback, useEffect, useState } from 'react';
import { useHttp } from './useHttp';

const TOKEN_KEY = 'token';

export const useAuth = () => {
	const [isAuthorized, setIsAuthorized] = useState(false);
	const { request, isLoading } = useHttp();

	const login = useCallback(
		async ({ login, password }) => {
			try {
				const response = await request('/api/auth/login', { login, password }, 'POST');

				if (response.ok) {
					localStorage.setItem(TOKEN_KEY, response.data.token);
					setIsAuthorized(true);
					return response.data.token;
				}

				setIsAuthorized(false);
			} catch (err) {
				console.error(err);

				setIsAuthorized(false);
			}
		},
		[request],
	);

	useEffect(() => {
		const token = localStorage.getItem(TOKEN_KEY);
		const check = async (token) => {
			try {
				const response = await request('/api/auth/check', { token, accept: 'admin' }, 'POST');
				if (response.ok) {
					setIsAuthorized(true);
					return;
				}

				setIsAuthorized(false);
			} catch (err) {
				setIsAuthorized(false);
			}
		};

		if (token) {
			check(token);
		}
	}, [request, setIsAuthorized]);

	return { login, isAuthorized, isLoading };
};
