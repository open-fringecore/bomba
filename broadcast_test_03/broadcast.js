const broadcast = (server, BROADCAST_ADDR, PORT, msg) => {
    const MESSAGE = Buffer.from(msg);

    server.send(
        MESSAGE,
        0,
        MESSAGE.length,
        PORT,
        BROADCAST_ADDR,
        function (err) {
            if (err) throw err;
            console.log(
                "BROADCAST message sent to " + BROADCAST_ADDR + ":" + PORT
            );
            // server.close();
        }
    );
};

module.exports = {
    broadcast,
};
