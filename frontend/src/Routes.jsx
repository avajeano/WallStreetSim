import React from "react";
import { Route, Routes } from "react-router-dom";
import StockDetail from "./StockDetail";
import RegisterForm from "./RegisterForm";
import LoginForm from "./LoginForm";
import Home from "./Home";
import WatchList from "./WatchList";
import Portfolio from "./Portfolio";
import NotFound from "./NotFound";

function appRoutes() {
    return (
        <Routes>
            <Route path="/stocks/:symbol" element={<StockDetail />} />
            <Route path="/users/register" element={<RegisterForm />} />
            <Route path="/users/login" element={<LoginForm />} />
            <Route path="/" element={<Home />} />
            <Route path="/users/:username/watchlist" element={<WatchList /> } />
            <Route path="/users/:username/portfolio" element={<Portfolio />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    )
}

export default appRoutes;