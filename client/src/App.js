import React from 'react';
import { BrowserRouter, Routes } from 'react-router-dom';
import { useRouter } from './hooks/useRouter';
import { AuthContext } from './context/authContext';
import { useAuth } from './hooks/useAuth';

export const App = () => {
	const { login, isAuthorized, isLoading } = useAuth();
	const routes = useRouter(isAuthorized);

	return (
		<AuthContext.Provider value={{ login, isAuthorized }}>
			{!isLoading && (
				<BrowserRouter basename="/adminus">
					<Routes>{routes}</Routes>
				</BrowserRouter>
			)}
		</AuthContext.Provider>
	);
};

export default App;
