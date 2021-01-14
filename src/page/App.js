import React from "react";
import {HashRouter as Router} from "react-router-dom";
import {Route} from "react-router";
import SignIn from "./SignIn";
import Main from "./Main";
import SignUp from "./SignUp";
import Home from "./Home";
import Profile from "./Profile";

export default class App extends React.Component {

    render() {
        return (
            <Router>
                <Route exact path={"/sign-in"}>
                    <SignIn/>
                </Route>
                <Route exact path={"/homeBox"}>
                    <Main/>
                </Route>
                <Route exact path={"/sign-up"}>
                    <SignUp/>
                </Route>
                <Route exact path={"/"}>
                    <Home/>
                </Route>
                <Route exact path={"/profile"}>
                    <Profile/>
                </Route>
            </Router>
        );
    }
}