const { broadcast } = require("./broadcast");

const msg = {
    ip: "199.99.9.9",
    port: "9999",
    name: "Chosen Undead",
};

broadcast(JSON.stringify(msg));
