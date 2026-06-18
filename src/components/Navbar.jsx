import React from 'react';
import ThemeSwitch, { ThemeToggle } from './ThemeToggle';
import { Button } from '@heroui/react';

const Navbar = () => {
    return (
        <div>
            <Button variant='tertiary' ><ThemeToggle></ThemeToggle></Button>
            <h1 className='bg-blue-400 p-6'>hello</h1>
        </div>
    );
};

export default Navbar;