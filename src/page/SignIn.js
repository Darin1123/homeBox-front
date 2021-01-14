import "./SignIn.css";
import React from "react";
import $ from "jquery";
import axios from "axios";
import {DIST} from "../config/config";
import {Link} from "react-router-dom";

axios.defaults.withCredentials = true;
const dist = DIST;

export default class SignIn extends React.Component {
    state = {
        authenticating: false
    };

    showErrorMsg(message) {
        let msg = $("#sign-in-message");
        msg.css({display: "block"});
        msg.text(message);
    }

    signIn() {
        this.closeErrorMsg();
        let username = $("#username").val();
        let password = $("#password").val();
        // let username = "13924809700";
        // let password = "Ww@772438058";
        let msg = $("#sign-in-message");
        if (username === "") {
            this.showErrorMsg("用户名不能为空")
            return;
        } else if (password === "") {
            this.showErrorMsg("密码不能为空")
            return;
        }
        this.setState({
            authenticating: true
        });
        let config = {
            method: 'post',
            url: "http://" + dist + "/homeBox/account/login",
            data: {
                username: username,
                password: password
            }
        };

        axios(config)
            .then((response) => {
                this.setState({
                    authenticating: false
                });
                let code = response.data.code;
                if (code !== 0) {
                    // console.log(code);
                    msg.css({display: "block"});
                    if (code === 20003) {
                        msg.text("用户名/密码错误.");
                    } else {
                        msg.text("登录失败, 请重试.");
                    }
                } else {
                    window.location.hash = "/homeBox";
                }
            })
            .catch((error) => {
                this.setState({
                    authenticating: false
                });
                msg.css({display: "block"});
                msg.text("无法连接到服务器.");
                console.log(error);
            });
    }

    closeErrorMsg() {
        $("#sign-in-message").css({display: "none"});
    }

    render() {
        return (
            <div id={"sign-in-main"}>
                <div id={"sign-in-form"}>
                    <span id={"sign-in-title"}>请登录</span>
                    <div id={"sign-in-message"}/>
                    {this.state.authenticating && <div>登录中...</div>}
                    <div className={"sign-in-item"}>
                        <label>用户名</label>
                        <input id={"username"} label={"Username"}/>
                    </div>
                    <div className={"sign-in-item"}>
                        <label>密码</label>
                        <input id={"password"} type={"password"} label={"Password"}/>
                    </div>
                    <div id={"sign-in-button"} className={"sign-in-item"} onClick={() => this.signIn()}>
                        登&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;录
                    </div>
                </div>
                <Link className={"link"} to={"sign-up"}>注册账号</Link>
            </div>
        );
    }
}