import React from 'react';
import './index.scss';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import store from './store';
import App from './components/App/App';
// eslint-disable-next-line
import adapter from 'webrtc-adapter'; // insulates app from browser webrtc implementation differences

ReactDOM.render(
  <>
    <Provider store={store}>
      <App/>
    </Provider>
  </>,
  document.getElementById('root')
);
