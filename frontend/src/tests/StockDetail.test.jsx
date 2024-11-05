/** StockDetail test */

import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import StockDetail from '../StockDetail';
import UserContext from '../UserContext';
import { vi } from 'vitest';
import { getStock } from '../api';

// mock API response for stock data
const mockStockData = {
    symbol: 'AAPL',
    data: [
        { date: '2024-10-10', price: 150.00 },
        { date: '2024-10-09', price: 145.00 },
    ]
};

// mock the API function to return sample stock data
vi.mock('../api', async () => ({
    getStock: vi.fn(),
    addToWatchlist: vi.fn(),
    removeFromWatchlist: vi.fn(),
    addToPortfolio: vi.fn(),
}));

test('render stock details', async () => {
    // mock API response
    getStock.mockResolvedValueOnce(mockStockData);

    render(
        <UserContext.Provider value={{ currentUser: { username: 'testuser' } }}>
            <BrowserRouter>
                <StockDetail />
            </BrowserRouter>
        </UserContext.Provider>
    );

    // wait for the data to load and render
    await waitFor(() => {
        expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });
});

test('displays error message if stock data fetch fails', async () => {
    getStock.mockRejectedValueOnce(new Error('Failed to fetch stock data'));

    render(
        <UserContext.Provider value={{ currentUser: { username: 'testuser' } }}>
            <BrowserRouter>
                <StockDetail />
            </BrowserRouter>
        </UserContext.Provider>
    );

    await waitFor(() => {
        expect(screen.getByText(/failed to fetch stock data/i)).toBeInTheDocument();
    });
});