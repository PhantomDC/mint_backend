import React from 'react';
import { ButtonGroup, Button } from 'reactstrap'


export const SwitchButton = ({ isActive, handleChange }) => (
    <ButtonGroup>
        <Button color={isActive ? 'primary' : 'secondary'} onClick={() => handleChange(true)} active={isActive}>
            Enable
        </Button>
        <Button color={isActive ? 'secondary' : 'danger'} onClick={() => handleChange(false)} active={!isActive}>
            Disable
        </Button>
    </ButtonGroup>
)