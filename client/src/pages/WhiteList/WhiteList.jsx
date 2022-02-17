import React, { useEffect, useState } from 'react';
import { Spinner, Button, Table, ButtonGroup, Input, InputGroup } from 'reactstrap'
import { Layout } from '../../components/Layout/Layout'
import { WhiteListTag } from '../../components/WhiteListTag/WhiteListTag';
import { useHttp } from '../../hooks/useHttp';
import './WhiteList.css';

const WhiteListItem = ({ item: { walletId, isActive }, handleChange, handleRemove, date }) => (
	<tr>
		<td>{walletId}</td>
		<td>
			<ButtonGroup>
				<Button color={isActive ? 'primary' : 'secondary'} onClick={() => handleChange(true)} active={isActive}>Enable</Button>
				<Button color={isActive ? 'secondary' : 'danger'} onClick={() => handleChange(false)} active={!isActive}>Disable</Button>
			</ButtonGroup>
		</td>
		<td>{date}</td>
		<td><Button color="danger" onClick={handleRemove}>Remove</Button></td>
	</tr>
)

export const WhiteList = () => {

	const { request } = useHttp()
	const [wl, setWl] = useState(null);
	const [isFirstLoading, setIsFirstLoading] = useState(true)
	const [addWalletId, setAddWalletId] = useState([]);

	useEffect(() => {
		const getWhiteList = async () => {
			const response = await request('/api/wl/list')

			if (response.ok) {
				setWl(response.data)
			}
		}

		getWhiteList()
		setIsFirstLoading(false)
	}, [request])

	const handleChange = (id) => async (isActive) => {
		setWl({
			...wl, [id]: {
				...wl[id],
				isActive,
			}
		})


		try {
			const response = await request('/api/wl/update', { id, isActive }, 'POST')

			if (response.ok) {
				setWl(response.data)
			}
		} catch (err) {

		}
	}

	const handleRemove = (id) => async () => {
		const conf = window.confirm('Are you sure?')

		if (conf) {
			try {
				const response = await request('/api/wl/delete', { id }, 'DELETE')

				if (response.ok) {
					setWl(response.data)
				}
			} catch (err) {

			}
		}
	}

	const handleChangeAdd = (e) => {
		const value = e.target.value;

		setAddWalletId(value.split(',').map((item) => item.trim()))
	}

	const handleRemoveTag = (id) => {
		setAddWalletId(addWalletId.filter((walletId) => walletId !== id))
	}

	const handleClickAdd = async () => {
		try {
			const response = await request('/api/wl/add', { walletId: addWalletId }, 'POST')
			if (response.ok) {
				const data = response.data;

				const newWalletIds = data.reduce((acc, item) => {
					const id = item.id;
					delete item.id;

					acc[id] = {
						...item
					}

					return acc;
				}, {})

				setAddWalletId([])
				setWl({
					...wl,
					...newWalletIds
				})
			}
		} catch (err) {

		}
	}

	return (
		<Layout title="White List">
			{isFirstLoading ? <Spinner /> : (
				<>
					<InputGroup className='mb-3'>
						<Input placeholder="Wallet ID" onChange={handleChangeAdd} value={addWalletId} onKeyUp={(e) => e.key === 'Enter' && handleClickAdd()} />
						<Button color="primary" onClick={handleClickAdd}>Add</Button>
					</InputGroup>
					<div className='whiteListContainer'>
						{addWalletId && addWalletId.map((walletId) => <WhiteListTag key={walletId} walletId={walletId} handleRemove={handleRemoveTag} />)}
					</div>
					<Table>
						<thead>
							<tr>
								<th>Wallet ID</th>
								<th>Active</th>
								<th>Last updated</th>
								<th></th>
							</tr>
						</thead>
						<tbody>
							{wl && Object.entries(wl).map(([id, item]) => {
								const date = new Date(item.updatedAt).toUTCString();

								return <WhiteListItem key={id} item={item} date={date} handleChange={handleChange(id)} handleRemove={handleRemove(id)} />
							})}
						</tbody>
					</Table >
				</>
			)}
		</Layout >

	);
};
