import styles from './assets/scss/main.scss'

import React from 'react';
import { render } from 'react-dom';

import Repositories from './components/app';

render(<Repositories username="Ocramius" perPage={8} />, document.getElementById('app'));
