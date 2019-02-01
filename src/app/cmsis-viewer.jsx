import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App/App';
const div = document.createElement('div');
document.body.appendChild(div);
div.className = 'cmsis-viewer-root';
ReactDOM.render(<App/>, div);
