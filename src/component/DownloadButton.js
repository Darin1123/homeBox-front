import React from "react";
import axios from "axios";
import {DIST} from "../config/config";

axios.defaults.withCredentials = true;
const dist = DIST;

export default class DownloadButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loadingDownload: false
        };
    }

    download() {
        this.setState({
            loadingDownload: true
        });
        let name = this.props.name;
        let path = this.props.getPath()+"/"+name;
        let config = {
            method: 'post',
            url: 'http://' + dist + '/homeBox/file/download?path=.'+path,
            responseType: "blob"
        };

        axios(config).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', this.props.name); //or any other extension
            document.body.appendChild(link);
            link.click();
            this.setState({
                loadingDownload: false
            });
        });
    }

    render() {
        // console.log(this.state.loadingDownload)
        if (this.state.loadingDownload) {
            return (<span>准备下载...</span>);
        } else {
            return (<span onClick={() => this.download()} className={"item-option"}>下载</span>);
        }
    }
}