import "./Profile.css";
import React from "react";
import {Redirect} from "react-router";
import axios from "axios";
import {DIST} from "../config/config";
import $ from "jquery";
import {Link} from "react-router-dom";

axios.defaults.withCredentials = true;
const dist = DIST;

const failStyle = {
    width: "fit-content",
    "text-align": "center",
    "margin-bottom": "10px",
    "background-color": "rgba(255, 0, 0, 0.6)",
    color: "#fff",
    "border-radius": "5px",
    "box-shadow": "0 0 0 4px rgba(255, 0, 0, 0.2)",
    padding: "5px"
};

const successStyle = {
    width: "fit-content",
    "text-align": "center",
    "margin-bottom": "10px",
    "background-color": "rgba(0, 205, 0, 0.8)",
    color: "#fff",
    "border-radius": "5px",
    "box-shadow": "0 0 0 4px rgba(0, 205, 0, 0.2)",
    padding: "5px"
};

export default class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            loadingUserInfo: true,
            changePassword: false,
            editName: false,
            savingNewName: false,
            savedNewName: false,
            savingPassword: false,
            savedPassword: false,
            emptyNewName: false
        };
    }

    async getUser() {
        let config = {
            method: 'post',
            url: 'http://' + dist + '/homeBox/account/userInfo',
        };

        return await axios(config)
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                return null;
            });
    }

    async componentDidMount() {
        console.log("mount");
        const userResponse = await this.getUser();
        const user = await userResponse.data;
        this.setState({
            user: user,
            loadingUserInfo: false
        });
    }

    async startEditName() {
        await this.setState({
            editName: true
        });
        $("#user-name-input").val(this.state.user.name);
    }

    editName() {
        this.setState({
            savingNewName: true
        });
        let newName = $("#user-name-input").val();
        if (newName === "") {
            this.setState({emptyNewName: true});
            return;
        } else {
            this.setState({emptyNewName: false});
        }
        let config = {
            url: "http://" + dist + "/homeBox/account/rename?newName=" + newName,
            method: "POST"
        };

        axios(config).then(response => {
            console.log(response);
            if (response.data.code === 0) {
                this.setState({savedNewName: true});
                this.getUser().then(response => {
                    this.setState({
                        user: response.data
                    });
                });
            }

        }).catch(error => {
            console.log(error);
            this.setState({savedNewName: false});
        });

    }

    async cancelEditName() {
        this.setState({
            loadingUserInfo: false,
            editName: false,
            emptyNewName: false,
            savedNewName: false,
            savingNewName: false
        });
    }

    resetPassword() {
        let newPassword = $("#new-password").val();
        let verifyPassword = $("#verify-new-password").val();
        let message = $("#change-password-message");
        if (newPassword === "" || verifyPassword === "") {
            message.css(failStyle);
            message.text("不能为空...");
            return;
        }
        if (newPassword !== verifyPassword) {
            message.css(failStyle);
            message.text("密码不相同...");
            return;
        }

        message.text("正在更新...");

        let config = {
            url: "http://" + dist + "/homeBox/account/resetPassword?newPassword=" + newPassword,
            method: "POST"
        };

        axios(config).then(response => {
            console.log(response.data);
            if (response.data.code === 0) {
                message.css(successStyle);
                $("#change-password-message").text("更新成功!");
            } else if (response.data.code === 10001) {
                message.css(failStyle);
                $("#change-password-message").text("密码必须至少包含一个数字, 一个大写字母, 一个小写字母, 以及一个特殊符号.");
            } else {
                message.css(failStyle);
                $("#change-password-message").text("更新失败, 请稍后重试...");
            }
        }).catch(error => {
            message.css(failStyle);
            $("#change-password-message").text("更新失败, 请稍后重试...");
        });

    }

    render() {
        console.log("render");
        if (this.state.loadingUserInfo) {
            return (<div>加载中...</div>);
        }
        if (this.state.user == null) {
            return (<Redirect to={"/"}/>);
        }
        let name, changeNameState;
        if (this.state.editName) {
            name = (<input id={"user-name-input"} onChange={() => this.editName()}/>);
        } else {
            name = (<span id={"user-name-text"}>{this.state.user.name}</span>);
        }
        if (this.state.emptyNewName) {
            changeNameState = (<span id={"edit-name-state"}>不能为空...</span>);
        } else {
            if (this.state.savedNewName) {
                changeNameState = (<span id={"edit-name-state"}>已保存"{this.state.user.name}"!</span>);
            } else if (this.state.savingNewName) {
                changeNameState = (<span id={"edit-name-state"}>保存中...</span>);
            }
        }

        return (
            <div id={"profile-container"}>
                <div id={"profile"}>
                    <Link to={"/homeBox"} id={"go-back-button"}>返回</Link>
                    <h4>个人信息</h4>
                    <div>
                        <span>姓名: </span>
                        {name}
                        {!this.state.editName &&
                        <span className={"edit-button"} onClick={() => this.startEditName()}>修改</span>}
                        {this.state.editName &&
                        <span>
                                {(this.state.savedNewName || this.state.savingNewName) && changeNameState}
                            <span id={"cancel-edit-name"} className={"edit-button"}
                                  onClick={() => this.cancelEditName()}>完成</span>
                            </span>
                        }
                    </div>
                    <div>
                        <h4>修改密码</h4>
                        {!this.state.changePassword &&
                        <div id={"reset-password"} className={"edit-button"} onClick={() => this.setState({changePassword: true})}>修改</div>
                        }
                    </div>
                    {this.state.changePassword && <div id={"user-password"}>
                        <span id={"change-password-message"}/>
                        <span>输入密码</span>
                        <input id={"new-password"} className={"change-password-input"} type={"password"}/>
                        <span>再次输入</span>
                        <input id={"verify-new-password"} className={"change-password-input"} type={"password"}/>
                        {this.state.savingPassword && <span>正在保存...</span>}
                        <div id={"change-password-buttons"}>
                            <span className={"edit-button"} onClick={() => this.resetPassword()}>确认</span>
                            <span className={"edit-button"}
                                  onClick={() => this.setState({changePassword: false})}>返回</span>
                        </div>
                    </div>}
                </div>
            </div>
        );
    }
}