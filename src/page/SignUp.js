import "./SignUp.css";
import React from "react";
import $ from "jquery";
import axios from "axios";
import {DIST} from "../config";
import {Link} from "react-router-dom";

axios.defaults.withCredentials = true;
const dist = DIST;

export default class SignUp extends React.Component {

    signUp() {
        let username = $("#username").val();
        let name = $("#name").val();
        let password = $("#password").val();
        let verify = $("#verify").val();
        let msg = $("#error-message");
        let config = {
            method: 'post',
            url: "http://"+dist+"/homeBox/account/signUp",
            data: {
                username: username,
                name: name,
                password: password,
                verifyPassword: verify
            }
        };

        axios(config)
            .then((response) => {
                let code = response.data.code;
                if (code===0) {
                    // console.log(code);
                    msg.css({display: "block"});
                    msg.text("注册成功!");
                }
            })
            .catch(function (error) {
                msg.css({display: "block"});
                msg.text("无法连接到服务器.");
                console.log(error);
            });
    }

    render() {
        return (
            <div id={"sign-up-main"}>
                <div id={"sign-up-form"}>
                    <span id={"sign-up-title"}>注 册 账 号</span>
                    <div id={"error-message"}/>
                    <div className={"sign-up-item"}>
                        <label>用户名*(电话号码/电子邮箱)</label>
                        <input id={"username"}/>
                    </div>
                    <div className={"sign-up-item"}>
                        <label>名字</label>
                        <input id={"name"}/>
                    </div>
                    <div className={"sign-up-item"}>
                        <label>密码</label>
                        <input id={"password"} type={"password"}/>
                    </div>
                    <div className={"sign-up-item"}>
                        <label>再次输入密码</label>
                        <input id={"verify"} type={"password"}/>
                    </div>
                    <div id={"sign-up-button"} className={"sign-up-item"} onClick={() => this.signUp()}>
                        注&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;册
                    </div>
                </div>
                <Link className={"link"} to={"sign-in"}>登录</Link>
            </div>
        );
    }
}