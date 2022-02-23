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

	const handleChangeCheckbox = (id) => {

		const prevValue = params[id].paramValue

		setParams({
			...params, [id]: {
				...params[id],
				paramValue: !prevValue
			}
		})

		handleUpdate(id, !prevValue)
	}

	const handleUpdate = async (id, value) => {
		const paramValue = value ?? params[id].paramValue;

		try {
			await request('/api/params/update', { ...params[id], paramValue }, 'POST')
		} catch (err) {

		}
	}

	const getInputType = (id, item) => {
		switch (typeof item.paramValue) {
			case 'string':
				return <Input value={item.paramValue} onChange={handleChange(id)} onBlur={() => handleUpdate(id)} onKeyPress={(e) => e.key === 'Enter' && handleUpdate(id)} />
			case 'boolean':
				return <Input type="checkbox" checked={item.paramValue} onChange={() => handleChangeCheckbox(id)} />
			default:
				return <Input value={item.paramValue} onChange={handleChange(id)} onBlur={() => handleUpdate(id)} onKeyPress={(e) => e.key === 'Enter' && handleUpdate(id)} />
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
									<td>{getInputType(id, item)}</td>
								</tr>
							)

						})}
					</tbody>
				</Table >
			)}
		</Layout>
	);
};
