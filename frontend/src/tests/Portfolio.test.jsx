/** Portfolio test */

import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Portfolio from '../Portfolio';
import UserContext from '../UserContext';
import { vi } from 'vitest';
import { getPortfolio } from '../api';

// mock API response for portfolio data
const mockPortfolioData = [
    { stock_symbol: 'AAPL', quantity: 10, purchase_price: 150.00, latest_price: 170.00 },
    { stock_symbol: 'TSLA', quantity: 5, purchase_price: 230.00, latest_price: 275.00 },
];

// mock the API function to return sample portfolio data
vi.mock('../api', async () => ({
    getPortfolio: vi.fn(),
}));

test('render user portfolio', async () => {
    // mock API response
    getPortfolio.mockResolvedValueOnce(mockPortfolioData);

    render(
        <UserContext.Provider value={{ currentuser: { username: 'testuser' } }}>
            <BrowserRouter>
                <Portfolio />
            </BrowserRouter>
        </UserContext.Provider>
    );

    // wait for the data to load and render
    await waitFor(() => {
        expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });
});