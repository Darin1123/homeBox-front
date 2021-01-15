export const serverConfig = {
    tomcat: {
        ip:
        // "192.168.0.101", // 书房
        "localhost",
        // "192.168.1.101", // 本机
        // "192.168.1.107", // 客厅
        // "192.168.0.122", // 树莓派
        port: "8080"
    },
    appearance: {
        shrinkFilenameLimit: 16,
        theme: { // project initial theme color
            color: 'rgba(80, 180, 80, 1)',
        }
    }
}

export const DIST = serverConfig.tomcat.ip+":"+serverConfig.tomcat.port;
