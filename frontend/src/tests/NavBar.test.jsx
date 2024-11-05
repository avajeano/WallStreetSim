/** frontend NavBar tests */

import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { expect, vi } from 'vitest';
import NavBar from '../NavBar';
import UserContext from '../UserContext';

//** navbar functionality when user is logged in */
test('renders NavBar with user loggedin', () => {
    const mockLogout = vi.fn();

    // mock UserContext
    render(
        <UserContext.Provider value={{ currentUser: { username: 'testuser' }, logout: mockLogout }}>
            <BrowserRouter>
                <NavBar />
            </BrowserRouter>
        </UserContext.Provider>
    )

    // check if watchlist and portfolio links render
    expect(screen.getByText(/Portfolio/i)).toBeInTheDocument();
    expect(screen.getByText(/Watchlist/i)).toBeInTheDocument();
    
    // simulate logout click
    fireEvent.click(screen.getByText(/Logout/i));
    expect(mockLogout).toHaveBeenCalled();
});

//** navbar functionality with no logged in user */
test('renders NavBar with no loggedin user', () => {
    render (
        <UserContext.Provider value={{ currentUser: null, logout: vi.fn() }}>
            <BrowserRouter>
                <NavBar />
            </BrowserRouter>
        </UserContext.Provider>
    );

    // check for login and register links 
    expect(screen.getByText(/Login/i)).toBeInTheDocument();
    expect(screen.getByText(/Register/i)).toBeInTheDocument();
});
