/** WatchList test */

import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import WatchList from '../WatchList';
import UserContext from '../UserContext';
import { vi } from "vitest";
import { getWatchlistWithPrices } from '../api';

// mock API response for watchlist data
const mockWatchlistData = {
    watchlist: ['AAPL', 'TSLA'],
    latestPrices: [
        { symbol: 'AAPL', latest_price: 150.00 },
        { symbol: 'TSLA', latest_price: 230.00 },
    ]
};

// mock the API function to return sample watchlist data
vi.mock('../api', async () => ({
    getWatchlistWithPrices: vi.fn(),
}));

test('render user watchlist', async () => {
    // mock API response
    getWatchlistWithPrices.mockResolvedValueOnce(mockWatchlistData);

    render(
        <UserContext.Provider value={{ currentUser: { username: 'testuser' }  }}>
            <BrowserRouter>
                <WatchList />
            </BrowserRouter>
        </UserContext.Provider>
    );

    // wait for the data to load and render
    await waitFor(() => {
        expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });
});
