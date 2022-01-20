import React from 'react';
import { Link } from 'react-router-dom';
import { Nav, Navbar, NavItem, NavLink } from 'reactstrap';
import './NavBar.css'

export const NavBar = () => {

	const path = window.location.pathname

	return (
		<Navbar color="light" light expand="md" className='mb-3'>
			<Nav className="ml-auto" navbar>
				<NavItem>
					<Link className='tdn' to="/mints"><NavLink active={path === '/mints'} tag="p">Mints</NavLink></Link>
				</NavItem>
				<NavItem>
					<Link className='tdn' to="/white-list"><NavLink active={path === '/white-list'} tag="p">White List</NavLink></Link>
				</NavItem>
				<NavItem>
					<Link className='tdn' to="/settings"><NavLink active={path === '/settings'} tag="p">Settings</NavLink></Link>
				</NavItem>
			</Nav>
		</Navbar>
	);
};
