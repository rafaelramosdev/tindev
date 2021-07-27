import { BrowserRouter, Route, Switch } from 'react-router-dom';

import { Login } from './pages/Login';
import { Main } from './pages/Main';

export function Routes() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={Login} />
        <Route path="/dev/:_id" component={Main} />
      </Switch>
    </BrowserRouter>
  );
}