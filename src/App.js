import React, { Component } from 'react';
import { HashRouter, Route, Switch, Redirect } from 'react-router-dom';
// import { renderRoutes } from 'react-router-config';
import './App.scss';

import { isBrowser } from 'react-device-detect';

import * as crud from './services/crud';

const loading = () => <div className="animated fadeIn pt-3 text-center">Carregando...</div>

// Containers
const DefaultLayout = React.lazy(() => import('./containers/DefaultLayout'));

// Pages
const Login = React.lazy(() => import('./views/Login'));

class App extends Component {

  state = {
    loading: true,
  }

  access = async () => {
    if (localStorage.getItem('client_id')) {
      await crud.post('log/', {
        idUser: localStorage.getItem('client_id'),
        description: 'access'
      });
    }

    setTimeout(() => {
      this.setState({
        loading: false
      });
    }, 4000);
  }

  componentDidMount() {
    this.access();
  }

  render() {
    return (
      <HashRouter>
          <React.Suspense fallback={loading()}>
            <Switch>
              { ((!localStorage.getItem('client_token') || localStorage.getItem('client_token') == '')) 
              ? <Route path="/login" name="Login" render={props => <Login {...props} />} />
              : !this.state.loading 
              ? <Route path="/" name="Home" render={props => <DefaultLayout {...props} />} />
              : <center>
                {!isBrowser 
                ? <img style={{ width: 100 + '%' }} src={'http://www.rxconstrutora.com.br/site/wp-content/uploads/2020/06/rx_vinheta4.gif'} />
                : <img style={{ width: 70 + '%' }} src={'http://www.rxconstrutora.com.br/site/wp-content/uploads/2020/06/rx_vinheta10.gif'} />}
              </center> }
              
              <Redirect
                to={{
                  pathname: (!localStorage.getItem('client_token') || localStorage.getItem('client_token') == '') ? '/login' : '/',
                }}
              />
            </Switch>
          </React.Suspense>
      </HashRouter>
    );
  }
}

export default App;
