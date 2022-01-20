import React, { useEffect, useState } from 'react';
import { Spinner, Table, Input } from 'reactstrap';
import { Layout } from '../../components/Layout/Layout'
import { useHttp } from '../../hooks/useHttp';

export const Settings = () => {

	const { request } = useHttp();
	const [params, setParams] = useState(null);
	const [isFirstLoading, setIsFirstLoading] = useState(true);

	useEffect(() => {
		const getParams = async () => {
			try {
				const response = await request('/api/params/list')

				if (response.ok) {
					setParams(response.data)
				}
			} catch (err) {

			} finally {
				setIsFirstLoading(false);
			}
		}

		getParams();

	}, [request])

	const handleChange = (id) => (e) => {
		const { value } = e.target

		setParams({
			...params, [id]: {
				...params[id],
				paramValue: value
			}
		})
	}

	const handleUpdate = (id) => async (e) => {
		const { value } = e.target
		const param = params[id];

		try {
			await request('/api/params/update', { ...param, paramValue: value }, 'POST')
		} catch (err) {

		}
	}

	return (
		<Layout title="Settings">
			{isFirstLoading ? <Spinner /> : (
				<Table>
					<thead>
						<tr>
							<th>Description</th>
							<th>Value</th>
						</tr>
					</thead>
					<tbody>
						{params && Object.entries(params).map(([id, item]) => {
							return (
								<tr key={id}>
									<td>{item.paramDescription}</td>
									<td><Input value={params[id].paramValue} onChange={handleChange(id)} onBlur={handleUpdate(id)} onKeyPress={(e) => e.key === 'Enter' && handleUpdate(id)(e)} /></td>
								</tr>
							)

						})}
					</tbody>
				</Table >
			)}
		</Layout>
	);
};
