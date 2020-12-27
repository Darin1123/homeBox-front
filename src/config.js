const serverConfig = {
    tomcat: {
        // ip: "192.168.0.101", // study_room
        // ip: "localhost",
        ip: "192.168.1.107", // living,
        // ip: "8.129.108.221", // aliyun
        // ip: "192.168.0.122", //pi
        port: "8080"
    },
    react: {
        ip: "localhost",
        port: "3000"
    }
}

export const DIST = serverConfig.tomcat.ip+":"+serverConfig.tomcat.port;
