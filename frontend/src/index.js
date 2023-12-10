import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import store from './App/store';
import { Provider } from 'react-redux';
import Dashboard from './page/Dashboard';
import './bootstrap.min.css'
import '@fortawesome/fontawesome-free/css/all.min.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <App />
     </Provider>
);


reportWebVitals();
