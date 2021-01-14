import {serverConfig} from "../config/config";

const shrinkFilenameLimit = serverConfig.appearance.shrinkFilenameLimit;
export function preProcessFileName(filename) {
    if (filename.length>shrinkFilenameLimit) {
        let left = Math.floor(shrinkFilenameLimit/2);
        let right = Math.ceil(shrinkFilenameLimit/2);
        let N = filename.length;
        return filename.substr(0, left)+"..."+filename.substr(N-right, right);
    }
    return filename;
}