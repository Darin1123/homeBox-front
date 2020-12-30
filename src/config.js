export const serverConfig = {
    tomcat: {
        ip:
        "192.168.0.101", // 书房
        // "localhost",
        // "192.168.1.107", // 客厅
        // "8.129.108.221", // 阿里云
        // "192.168.0.122", // 树莓派
        port: "8080"
    }
}

export const DIST = serverConfig.tomcat.ip+":"+serverConfig.tomcat.port;
