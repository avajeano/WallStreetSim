/** LoginFrom test */

import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { beforeEach, expect, vi } from 'vitest';
import LoginForm from '../LoginForm';
import UserContext from '../UserContext';

// mock API module and its methods
vi.mock('../api', () => ({
    API: {
        registerUser: vi.fn(),
    },
}));

// mock alert and navigate
const mockAlert = vi.fn();
const mockNavigate = vi.fn();
global.alert = mockAlert;

beforeEach(() => {
    // reset all mocks before each test
    vi.clearAllMocks();
    mockAlert.mockClear();
    mockNavigate.mockClear();
});

test('renders login form', () => {
    render(
        <UserContext.Provider value={{ currentUser: { username: 'testuser' } }}>
            <BrowserRouter>
                <LoginForm />
            </BrowserRouter>
        </UserContext.Provider>
    );

    // check if the form is rendered by finding the "Username" label
    expect(screen.getByText('Username')).toBeInTheDocument();
});