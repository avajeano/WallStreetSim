/** frontend Home page test */

import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Home from '../Home';
import UserContext from '../UserContext';

test('renders homepage content', () => {
    render (
        <UserContext.Provider value={{ currentUser: { username: 'testuser' }}}>
            <BrowserRouter>
                <Home />
            </BrowserRouter>
        </UserContext.Provider>
    );

    // check if content renders
    expect(screen.getByText('NYSE Simulator')).toBeInTheDocument();
})