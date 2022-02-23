import React from 'react';
import { Button } from 'reactstrap'
import { SwitchButton } from '../../components/SwitchButton/SwitchButton'


export const WhiteListItem = ({ item: { walletId, isActive }, handleChange, handleRemove, date }) => (
	<tr>
		<td>{walletId}</td>
		<td>
			<SwitchButton isActive={isActive} handleChange={handleChange} />
		</td>
		<td>{date}</td>
		<td>
			<Button color="danger" onClick={handleRemove}>
				Remove
			</Button>
		</td>
	</tr>
);
