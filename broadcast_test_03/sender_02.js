const { broadcast } = require("./broadcast");

const msg = {
    ip: "188.88.8.8",
    port: "8888",
    name: "Ashen One",
};

broadcast(JSON.stringify(msg));
