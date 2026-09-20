import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import App from '../components/App';

const props = window.__INITIAL_PROPS__ || {};

hydrateRoot(document.getElementById('root'), React.createElement(App, props));
