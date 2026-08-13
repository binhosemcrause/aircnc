import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import New from './pages/New';

export default function Routers() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/dashboards" element={<Dashboard />} />
                <Route path="/new" element={<New />} />
            </Routes>
        </BrowserRouter>
    )
}