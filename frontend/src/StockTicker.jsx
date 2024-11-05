import React from "react";
import './StockTicker.css';

function StockTicker({ tickerData }) {
    return (
        <div className="stock-ticker">
            <ul>
                {tickerData.map((stock) => (
                    <li key={stock.symbol}>
                        {stock.symbol} ${stock.latest_price}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default StockTicker;