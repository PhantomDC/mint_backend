import { useCallback, useState } from 'react';

export const useHttp = () => {
	const [isLoading, setIsLoading] = useState(false);

	const request = useCallback(async (url, body = null, method = 'GET', headers = {}) => {
		const token = localStorage.getItem('token');
		const baseURL = process.env.NODE_ENV === 'production' ? '//mint.batc-nft.com' : 'http://localhost:5000';

		headers['Content-Type'] = 'application/json';
		headers['Authorization'] = `Bearer ${token}`;

		if (body) {
			body = JSON.stringify(body);
		}

		try {
			setIsLoading(true);
			const response = await fetch(`${baseURL}${url}`, { body, headers, method });
			const data = await response.json();

			return {
				data,
				ok: response.ok,
			};
		} catch (err) {
			throw new Error(err);
		} finally {
			setIsLoading(false);
		}
	}, []);

	return { isLoading, request };
};
