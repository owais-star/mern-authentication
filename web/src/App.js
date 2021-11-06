import React from "react";
import Signup from "./components/signup/Signup";
import Login from "./components/login/login";
import Dashboar from "./components/dashboard/Dashboard";
import { useEffect, useContext } from "react"
import { GlobalContext } from './components/context/Context';
import axios from 'axios';
import { baseUrl } from "./core";
import Splash from './components/splash/Splash'
import {

  Switch,
  Route,
} from "react-router-dom";

function App() {
  let { state, dispatch } = useContext(GlobalContext);

  useEffect(() => {

    axios.get(`${baseUrl}/api/v1/profile`, {
      withCredentials: true
    })
      .then((res) => {

        if (res.data.email) {

          dispatch({
            type: "USER_LOGIN",
            payload: {
              firstName: res.data.firstName,
              lastName: res.data.lastName,
              email: res.data.email,
              _id: res.data._id
            }
          })
        } else {
          dispatch({ type: "USER_LOGOUT" })
        }
      }).catch((e) => {
        dispatch({ type: "USER_LOGOUT" })
      })

    return () => {
    };
  }, []);

  return (
    <>
      {(state.user === undefined) ?
        <Switch>
          <Route exact path="/">
            <Splash />
          </Route>
          {/* <Redirect to="/" /> */}
        </Switch>
        : null}

      {(state.user === null) ?
        <Switch>
          <Route exact path="/" component={Login} />
          <Route path="/signup" component={Signup} />

          {/* <Redirect to="/" /> */}
        </Switch> : null
      }

      {(state.user) ?
        <Switch>
          <Route exact path="/">
            <Dashboar />
          </Route>

          {/* <Redirect to="/" /> */}
        </Switch>
        : null}
    </>




  );
}

export default App;
