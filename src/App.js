import React from "react";
import {HashRouter as Router} from "react-router-dom";
import {Route} from "react-router";
import SignIn from "./page/SignIn";
import Main from "./page/Main";
import SignUp from "./page/SignUp";
import Home from "./page/Home";

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
            </Router>
        );
    }
}