import React, {StrictMode} from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './store';
import App from './containers/App/App';

ReactDOM.render(
  <StrictMode>
      <Provider store={store}>
          <App />
      </Provider>
  </StrictMode>,
  document.getElementById('root')
);
