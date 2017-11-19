import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './App';


/*
ReactDOM.render(<TreeList
    url='http://localhost:3001/api/tree'
    pollInterval={10000} />
    , document.getElementById('root'));
*/

ReactDOM.render((
    <BrowserRouter>
        <App/>
    </BrowserRouter>
), document.getElementById('root'));
