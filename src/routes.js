import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './components/App';
import NotFoundPage from './components/NotFoundPage.js';
import MainPage from "./containers/MainPage";

export default (
  <Route path="/" component={App}>
    <IndexRoute component={MainPage}/>
    <Route path="*" component={NotFoundPage}/>
  </Route>
);
