import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route } from 'react-router-dom';
import App from './App';

const root = createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
        <Route component={App} />
    </BrowserRouter>
);
