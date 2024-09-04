import React from 'react';
import Whiteboard from './components/Whiteboard';
import Toolbar from './components/Toolbar';
import UserList from './components/UserList';
import { Container } from '@mui/material';

function App() {
    return (
        <Container>
            <Toolbar />
            <Whiteboard />
            <UserList />
        </Container>
    );
}

export default App;
