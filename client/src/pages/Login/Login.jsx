import React, { useContext, useState } from 'react';
import { AuthContext } from '../../context/authContext';
import { Form, FormGroup, Label, Input, Button, Container, Row, Col, CardTitle } from 'reactstrap';


export const Login = () => {
	const { login } = useContext(AuthContext);
	const [authData, setAuthData] = useState({ login: "", password: "" });

	const handleChangeData = (e) => {
		const { name, value } = e.target;

		setAuthData({ ...authData, [name]: value })
	}

	const handleSubmit = async () => {
		if (authData.login && authData.password) {
			login(authData)
		}
	}

	return (
		<Container>
			<Row>
				<Col xs={3}></Col>
				<Col xs={6} className='p-3'>
					<CardTitle tag='h2'>Authorization</CardTitle>
					<Form inline className='mt-3'>
						<FormGroup floating>
							<Input
								name="login"
								placeholder="Login"
								onChange={handleChangeData}
								value={authData.login}
							/>
							<Label for="exampleEmail">
								Login
							</Label>
						</FormGroup>
						<FormGroup floating>
							<Input
								name="password"
								placeholder="Password"
								type="password"
								onChange={handleChangeData}
								value={authData.password}
							/>
							<Label for="examplePassword">
								Password
							</Label>
						</FormGroup>
						<Button onClick={handleSubmit}>
							Submit
						</Button>
					</Form>
				</Col>
			</Row>
		</Container>
	);
};
