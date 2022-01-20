import React from 'react'
import { Container, Row, Col } from 'reactstrap'
import { NavBar } from '../../components/NavBar/NavBar'

export const Layout = ({ title, children }) => {
    return (
        <>
            <NavBar />
            <Container>
                <Row>
                    <Col xs={12}>
                        <h2 className='mb-3'>{title}</h2>
                        {children}
                    </Col>
                </Row>
            </Container>
        </>)
}