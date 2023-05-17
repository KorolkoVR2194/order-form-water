import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './App';
import Specifications from './forms/Specifications';
import Projects from './forms/Projects';
import VerificationCounter from './forms/VerificationCounter';
import WorksTransport from './forms/WorksTransport';
import NoPage from './forms/NoPage';


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <BrowserRouter>
      <Routes>
        <Route >
          <Route path="/" element={<Home />} />
          <Route path="specifications" element={<Specifications />} />
          <Route path="projects" element={<Projects />} />
          <Route path="verificationcounter" element={<VerificationCounter />} />
          <Route path="workstransport" element={<WorksTransport />} />
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
);

