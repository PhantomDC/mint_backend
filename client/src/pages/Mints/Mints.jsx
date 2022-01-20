import React, { useEffect, useState } from 'react';
import { Spinner, Table, Input, Button } from 'reactstrap'
import { Layout } from '../../components/Layout/Layout'
import { useHttp } from '../../hooks/useHttp';

const MintItem = ({ item: { walletId, mintsCount, availableMints }, handleUpdate, handleChange, date }) => (
	<tr>
		<td>{walletId}</td>
		<td><Input value={mintsCount} onChange={handleChange} onBlur={handleUpdate} /></td>
		<td>{availableMints}</td>
		<td>{date}</td>
	</tr>
)

export const Mints = () => {

	const { request, isLoading } = useHttp()
	const [mints, setMints] = useState(null)

	useEffect(() => {

		const getMintsList = async () => {
			const response = await request('/api/mint/list');

			if (response.ok) {
				setMints(response.data)
			}
		}

		getMintsList();

	}, [request])

	const handleUpdate = (id) => {
		return async (e) => {
			const count = Number(e.target.value);

			try {
				if (mints[id].mintsCount !== count) {
					const response = await request('/api/mint/updateMints', { id, count }, 'POST')
					if (response.ok) {
						setMints(response.data)
					}
				}


			} catch (err) { }
		}
	}

	const handleChange = (id) => {
		return (e) => {
			const value = e.target.value;
			setMints({
				...mints, [id]: {
					...mints[id],
					mintsCount: value
				}
			})
		}
	}

	const handleClean = async () => {
		const conf = window.confirm('Are you sure?')

		try {
			if (conf) {
				const response = await request('/api/mint/cleanMints', null, 'POST');

				if (response.ok) {
					setMints(response.data)
				}
			}
		} catch (err) {

		}
	}

	return (
		<Layout title="Mints">
			{isLoading && !mints ? <Spinner /> : (
				<>
					<Button className='mb-3' color='danger' onClick={handleClean}>Clean all mints</Button>
					<Table>
						<thead>
							<tr>
								<th>Wallet ID</th>
								<th>Mints Count</th>
								<th>Available Mints</th>
								<th>Last Mint</th>
							</tr>
						</thead>
						<tbody>
							{mints && Object.entries(mints).map(([id, item]) => {
								const date = new Date(item.lastUpdateAt).toUTCString()
								return <MintItem date={date} key={id} item={item} handleUpdate={handleUpdate(id)} handleChange={handleChange(id)} />
							})}
						</tbody>
					</Table >
				</>
			)}
		</Layout >
	);
};
