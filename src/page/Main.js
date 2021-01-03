import "./Main.css";
import React from "react";
import axios from "axios";
import {Add, ArrowRight, ArrowUpward, Folder, Refresh} from "@material-ui/icons";
import {DIST} from "../config";
import {Redirect} from "react-router";
import $ from "jquery";
import DownloadButton from "../DownloadButton";
import {Link} from "react-router-dom";

axios.defaults.withCredentials = true;
const dist = DIST;

export default class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            path: ["主页"],
            items: [],
            user: null,
            loadingUserInfo: true,
            loadingList: true,
            dialogOn: false,
            uploading: false,
        };
    }

    /**
     * download a file
     * @param name the file name
     */
    async download(name) {
        // this.setState({
        //     loadingDownload: true
        // });
        let path = this.getPath()+"/"+name;
        let config = {
            method: 'post',
            url: 'http://' + dist + '/homeBox/file/download?path=.'+path,
            responseType: "blob"
        };

        await axios(config).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', name); //or any other extension
            document.body.appendChild(link);
            link.click();
            // this.setState({
            //     loadingDownload: false
            // });
        });
    }


    /**
     * delete a file/directory
     * @param item
     */
    delete(item) {
        if (!this.state.dialogOn) {
            this.showDialog("删除 "+(item.name)+"?", "", false);
            this.setState({
                dialogOn: true
            });
        }
        let confirmButton = $("#confirm");
        confirmButton.unbind("click");
        confirmButton.click(() => {
            let path = this.getPath()+"/"+item.name;
            console.log("delete: "+path);
            let config = {
                method: 'delete',
                url: 'http://' + dist + '/homeBox/file/'+(item.file?"deleteFile":"rmdir")+'?path=.'+path
            };
            axios(config)
                .then(()=>{
                    this.closeDialog();
                    this.refresh();
                })
                .catch();
        });
    }

    /**
     * get the current path, e.g. "/..."
     * @returns {string} the current path
     */
    getPath() {
        if (this.state.path.length===1) {
            return "";
        }
        let result = "";
        for (let i = 1; i < this.state.path.length; i++) {
            result += "/" + this.state.path[i];
        }
        return result;
    }

    /**
     * get the path until certain index
     * @param key
     */
    async goToPath(key) {
        let newPath = [];
        for (let i=0; i<key+1; i++) {
            newPath = [...newPath, this.state.path[i]];
        }
        await this.setState({
            path: newPath,
            loadingList: true
        });
        const listResponse = await this.list();
        let data = listResponse.data;
        data = data.filter((item) => !item.name.startsWith("."));
        await this.setState({
            items: data
        });
        await this.setState({
            loadingList: false
        })
    }

    /**
     * list files in the current path
     * @returns {Promise<unknown>}
     */
    async list() {
        return await axios({
            method: 'post',
            url: 'http://' + dist + '/homeBox/file/list?path=.' + this.getPath(),
        })
            .then((response) => {
                return response.data;
            })
            .catch(() => {
                return [];
            });
    }

    /**
     * get current user info
     * @returns {Promise<unknown>}
     */
    async getUser() {
        let config = {
            method: 'post',
            url: 'http://' + dist + '/homeBox/account/userInfo',
        };

        return await axios(config)
            .then((response) => {
                // console.log(response);
                return response.data;
            })
            .catch((error) => {
                // console.log(error);
                return [];
            });
    }

    /**
     * go to the target dirname
     * @param dirName the target dirname
     * @returns {Promise<void>}
     */
    async toDir(dirName) {
        await this.setState({
            path: [...this.state.path, dirName],
            loadingList: true
        });
        const listResponse = await this.list();
        let data = listResponse.data;
        data = data.filter((item) => !item.name.startsWith("."));
        await this.setState({
            items: data
        });
        await this.setState({
            loadingList: false
        })
    }

    /**
     * refresh the current list
     * @returns {Promise<void>}
     */
    async refresh() {
        await this.setState({
            loadingList: true
        });
        const listResponse = await this.list();
        let data = listResponse.data;
        data = data.filter((item) => !item.name.startsWith("."));
        await this.setState({
            items: data
        });
        await this.setState({
            loadingList: false
        })
    }

    /**
     * open msg block
     * @param msg
     */
    showErrorMsg(msg) {
        let message = $("#message");
        message.text(msg);
        message.css({
            display: "block"
        });
    }

    /**
     * close msg block
     */
    closeErrorMsg() {
        $("#message").css({
            display: "none"
        });
    }

    /**
     * create new folder
     */
    mkdir() {
        if (!this.state.dialogOn) {
            this.showDialog("新建文件夹", "", true);
            this.setState({
                dialogOn: true
            });
        }
        let confirmButton = $("#confirm");
        confirmButton.unbind("click");
        confirmButton.click(() => {
            let dirname = $("#dialog-input").val().replace(/(^\s*)|(\s*$)/g, "");
            if (dirname==="") {
                this.showErrorMsg("文件夹名称不能为空");
                return;
            }
            let config = {
                url: "http://"+dist+"/homeBox/file/mkdir",
                method: "POST",
                data: {
                    basePath: "."+this.getPath(),
                    dirName: dirname
                }
            };
            axios(config)
                .then(()=>{
                    this.closeErrorMsg()
                    this.closeDialog();
                    this.refresh();
                })
                .catch();
        });
    }

    /**
     * upload file
     */
    upload() {
        if (!this.state.dialogOn) {
            $("#dialog-input").attr({
                type: "file"
            });
            this.showDialog("上传文件", "", true);
            this.setState({
                dialogOn: true
            });
        }
        let confirmButton = $("#confirm");
        confirmButton.unbind("click");
        confirmButton.click(()=>{
            let file = $("#dialog-input")[0].files[0];
            if (file==null) {
                this.showErrorMsg("文件不能为空");
                return;
            }
            this.setState({
                uploading: true
            });
            let formData = new FormData();
            formData.append("path", this.getPath());
            formData.append("file", file);
            let config = {
                url: "http://"+dist+"/homeBox/file/upload",
                method: "POST",
                data: formData,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            };

            axios(config)
                .then((response)=>{
                    console.log("uploaded");
                    console.log(response);
                    this.setState({
                        uploading: false
                    });
                    this.closeDialog();
                    this.closeErrorMsg();
                    this.refresh();
                });

        });
    }

    /**
     * show dialog
     * @param title the dialog title
     * @param value the input value
     * @param inputShow need input?
     */
    showDialog(title, value, inputShow) {
        $("#dialog-label").text(title);
        $("#dialog-input").val(value);
        if (!inputShow) {
            $("#dialog-input").css({
                display: "none"
            });
        } else {
            $("#dialog-input").css({
                display: "block"
            });
        }
        $("#dialog").css({
            visibility: "visible"
        });
    }

    /**
     * rename a file
     * @param item
     */
    rename(item) {
        if (!this.state.dialogOn) {
            this.showDialog("重命名", item.name, true);
            this.setState({
                dialogOn: true
            });
        }
        let confirmButton = $("#confirm");
        confirmButton.unbind("click");
        confirmButton.click(() => {
            let newName = $("#dialog-input").val().replace(/(^\s*)|(\s*$)/g, "");
            if (newName==="") {
                this.showErrorMsg("名称不能为空");
                return;
            }
            let config = {
                url: "http://"+dist+"/homeBox/file/rename",
                method: "POST",
                data: {
                    parent: "."+this.getPath(),
                    originalName: item.name,
                    newName: newName
                }
            };

            axios(config)
                .then(()=>{
                    this.closeDialog();
                    this.closeErrorMsg();
                    this.refresh();
                })
                .catch();
        });
    }

    /**
     * go to parent dir
     */
    async goBack() {
        if (this.state.path.length<=1) {
            return;
        }
        let newPath = [];
        for (let i=0; i<this.state.path.length-1; i++) {
            newPath = [...newPath, this.state.path[i]];
        }
        await this.setState({
            path: newPath,
            loadingList: true
        });
        const listResponse = await this.list();
        let data = listResponse.data;
        data = data.filter((item) => !item.name.startsWith("."));
        await this.setState({
            items: data
        });
        await this.setState({
            loadingList: false
        })
    }

    /**
     * close dialog
     */
    closeDialog() {
        $("#dialog").css({
            visibility: "hidden"
        });
        $("#dialog-input").attr({
            type: "text"
        });
        this.setState({
            dialogOn: false
        });
        this.closeErrorMsg();
    }

    /**
     * life cycle function
     * @returns {Promise<void>}
     */
    async componentDidMount() {
        console.log("mount");
        const userResponse = await this.getUser();
        const user = await userResponse.data;
        console.log(user);
        this.setState({
            user: user,
            loadingUserInfo: false
        });
        if (!this.state.loadingUserInfo && this.state.user!=null) {
            const listResponse = await this.list();
            let data = listResponse.data;
            data = data.filter((item) => !item.name.startsWith("."));
            this.setState({
                items: data,
                loadingList: false
            });
        }
    }

    render() {
        // console.log("render");
        if (this.state.loadingUserInfo) {
            return (<div><span>加载中...</span><div><span>若长时间未响应, 请</span><Link to={"sign-in"}>重新登录</Link></div></div>);
        }
        if (!this.state.user) {
            return (<Redirect to={"sign-in"}/>);
        }
        let list;
        if (this.state.loadingList) {
            list = (<div>加载中...</div>);
        } else {
            list = (
                <div id={"list"}>
                    {this.state.items.map((item, key) =>
                        <div className={"list-item"} key={key}>
                                <span
                                    className={"item-name "+(!item.file? "dir-item":"")}
                                    onClick={!item.file?()=>this.toDir(item.name):()=>{}}
                                >
                                    {!item.file && (<Folder/>)}
                                    {item.name}
                                </span>
                            <div className={"item-options"}>
                                {item.file && (
                                    <DownloadButton className={"item-option"} getPath={this.getPath.bind(this)} name={item.name}/>
                                )}
                                {this.state.loadingDownload?
                                    <span className={"disabled-item-option"}>删除</span>:<span className={"item-option"} onClick={()=>this.delete(item)}>删除</span>
                                }
                                {this.state.loadingDownload ?
                                    <span className={"item-option"}>重命名</span>:<span className={"item-option"} onClick={()=>this.rename(item)}>重命名</span>
                                }
                            </div>
                        </div>
                    )}
                </div>
            );
        }
        return (
            <div>
                <div id={"dialog"}>
                    <label id={"dialog-label"}>标题</label>
                    <div id={"message"}>错误消息</div>
                    {this.state.uploading && <div>正在上传...</div>}
                    <input id={"dialog-input"}/>
                    <div className={"dialog-buttons"}>
                        <div className={"dialog-confirm"} id={"confirm"}>确定</div>
                        <div className={"dialog-cancel"} id={"cancel"} onClick={()=>this.closeDialog()}>取消</div>
                    </div>
                </div>
                <div id={"main-nav"}>
                    <div className={"container"}>
                        <div id={"breadcrumbs"}>
                            {this.state.path.map((item, key) =>
                                <div className={"path-item"} key={key}>
                                    {key !== 0 && <ArrowRight/>}
                                    <div className={"path-item-info"} onClick={()=>this.goToPath(key)}>{item}</div>
                                </div>
                            )}
                        </div>
                        <div id={"main-user"}>
                            <Link id={"main-user-link"} to={"/profile"}>{this.state.user.name}</Link>
                        </div>
                    </div>
                </div>
                <div id={"main-body"}>
                    <div className={"container"}>
                        <div className={"main-options"}>
                            <div id={"refresh-button"} onClick={()=>this.refresh()}><Refresh/></div>
                            {
                                this.state.path.length>1 &&
                                <div id={"main-go-back-button"} onClick={()=>this.goBack()}>返回上级</div>
                            }
                        </div>
                        <div className={"main-options"}>
                            <div className={"main-option-button"} onClick={()=>this.upload()}><ArrowUpward/>上传</div>
                            <div className={"create-folder-button"} onClick={()=>this.mkdir()}><Add/>新建文件夹</div>
                        </div>
                    </div>
                    <div id={"items-info"}>共加载了{this.state.items.length}个项目</div>
                    {this.state.items.length===0 && <div id={"empty-msg"}>空空如也...</div>}
                    {list}
                </div>
            </div>
        );
    }
}