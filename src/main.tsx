import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { BrowserRouter, Route } from 'react-router-dom';
import App from './App';

ReactDOM.render(
    <BrowserRouter>
        <Route component={App} />
    </BrowserRouter>,
    document.getElementById('root')
);
