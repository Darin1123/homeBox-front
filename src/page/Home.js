import "./Home.css";
import React from "react";
import {Link} from "react-router-dom";

export default class Home extends React.Component {
    render() {
        return (
            <div id={"home"}>
                <div id={"home-intro"}>
                    <h4>欢迎来到 HomeBox</h4>
                    <p>HomeBox 是一个简单的家庭网盘.</p>
                </div>
                <div id={"home-links"}>
                    <span>请 <Link className={"home-link"} to={"sign-in"}>登录</Link> 或者
                    <Link className={"home-link"} to={"sign-up"}>注册</Link></span>
                </div>
            </div>
        );
    }
}