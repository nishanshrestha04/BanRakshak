import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from "./Components/Headerx";
import "./App.css";
import Home from "./Pages/Home";
import Analytics from "./Pages/Analytics";
import Alerts from "./Pages/Alerts";
import Overview from "./Pages/Overview";

const App = () => {
    return (
        <BrowserRouter>
            <div className="font-montserrat">
                <Header />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/dashboard" element={<Overview />} />
                    <Route path="/analytics" element={<Analytics />} />
                    <Route path="/alerts" element={<Alerts />} />
                    {/* <Route path="/reports" element={<Reports />} />
                    <Route path="/settings" element={<Settings />} /> */}
                </Routes>
            </div>
        </BrowserRouter>
    );
};

export default App;
