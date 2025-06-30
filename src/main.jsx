import React from "react";
import ReactDOM from "react-dom/client";
import App from "./LandingPage";
import ScrollToTop from './ScrollToTop';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MaestroHub from "./CoursePage";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ScrollToTop/>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/course/:id" element={<MaestroHub />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
