import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route } from 'react-router-dom';
import App from './App';

const container = document.getElementById('root');

if (!container) {
    throw new Error('Root container missing');
}

const root = createRoot(container);

root.render(
    <BrowserRouter>
        <Route component={App} />
    </BrowserRouter>
);
