import React from "react";

export default class DownloadButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loadingDownload: false
        };
    }

    async download() {
        // alert("download");
        this.setState({
            loadingDownload: true
        });

        let response = this.props.download();
        response.then(() => {
                this.setState({
                    loadingDownload: false
                });
            }
        );
    }

    render() {
        // console.log(this.state.loadingDownload)
        if (this.state.loadingDownload) {
            return (<span>准备下载...</span>);
        } else {
            return (<span onClick={() => this.download()}>下载</span>);
        }
    }
}