import React from "react";
import Signup from "./components/signup/Signup";
import Login from "./components/login/login";
import Dashboar from "./components/dashboard/Dashboard";
import {

  Switch,
  Route,
  Link

} from "react-router-dom";

function App() {

  return (
    <>
      <Switch>
        <Route exact path="/">
          <Signup />
        </Route>

        <Route path="/login">
          <Login />
        </Route>

        <Route path="/profile">
          <Dashboar />
        </Route>
      </Switch>
    </>




  );
}

export default App;
