import React from 'react'
import EventBus from 'eventing-bus';
import { connect } from "react-redux";
import { createBrowserHistory } from "history";
import { ToastContainer, toast } from 'react-toastify';
import { HashRouter as Router, Route, Switch, Redirect } from "react-router-dom";

import Admin from "./layouts/Admin.jsx";

import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const hist = createBrowserHistory();

export class App extends React.Component {

  async componentDidMount() {
    EventBus.on('info', (e) => toast.info(e));
    EventBus.on('error', (e) => toast.error(e));
    EventBus.on('success', (e) => toast.success(e));
    EventBus.on("tokenExpired", () => this.props.logout());
  };

  render() {
    return (
      <div>
        <ToastContainer />
        <Router history={hist}>
          <Switch>
            <Route path="/home" component={props => <Admin {...props} />} />
            <Redirect from="/" to="/home" />
          </Switch>
        </Router>
      </div>
    )
  }
}
const mapDispatchToProps = { };

const mapStateToProps = ({ Auth }) => {
  let { auth } = Auth
  return { auth }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
