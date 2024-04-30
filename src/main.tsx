import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route } from 'react-router-dom';
import App from './App';
import JsonBase64Converter from './ui/json-base64-converter';

ReactDOM.render(
    <BrowserRouter>
        <Route path="/app" component={App} />
        <Route path="/dev/codec" component={JsonBase64Converter} />
    </BrowserRouter>,
    document.getElementById('root')
);
