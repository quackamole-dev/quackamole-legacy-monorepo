import React, {StrictMode} from 'react';
import './index.scss';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './store';
import App from './components/App/App';

ReactDOM.render(
  <StrictMode>
      <Provider store={store}>
          <App />
      </Provider>
  </StrictMode>,
  document.getElementById('root')
);
