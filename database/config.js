if (!process.env.DL_CLOUD_ADDRESS) {
    /*
     * Since we have to check if we are in production mode first, normal
     * imports will break. Dynamically import the .env file if needed.
     */
    const dotenv = await import('dotenv');
    dotenv.config();
}

const config = {
    cloud: {
        host: process.env.DL_CLOUD_HOST,
        pass: process.env.DL_CLOUD_PASS, 
        port: process.env.DL_CLOUD_PORT,
        protocol: process.env.DL_CLOUD_PROTOCOL,
        name: process.env.DL_CLOUD_NAME,
        user: process.env.DL_CLOUD_USER
    },
    local: {
        host: "127.0.0.1",
        pass: "",
        port: 27017,
        name: "library",
        user: ""
    },
    test: {
        host: "127.0.0.1",
        pass: "",
        port: 27017,
        name: "library-test",
        user: ""
    }
};

export default config;