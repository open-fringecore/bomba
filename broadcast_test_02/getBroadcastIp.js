const os = require("os");

function calculateBroadcastAddress(address, netmask) {
    const addressOctets = address.split(".").map(Number);
    const netmaskOctets = netmask.split(".").map(Number);
    const broadcastAddress = addressOctets.map((octet, index) => {
        console.log(octet);
        return octet | (~netmaskOctets[index] & 255);
    });
    console.log(netmaskOctets);
    return broadcastAddress.join(".");
}

async function getBroadcastAddresses() {
    const interfaces = await os.networkInterfaces();
    const broadcastAddresses = [];

    Object.keys(interfaces).forEach((interfaceName) => {
        interfaces[interfaceName].forEach((iface) => {
            if ("IPv4" !== iface.family || iface.internal !== false) {
                // Skip over internal (i.e., 127.0.0.1) and non-IPv4 addresses
                return;
            }

            const broadcastAddress = calculateBroadcastAddress(
                iface.address,
                iface.netmask
            );
            broadcastAddresses.push({
                interface: interfaceName,
                broadcastAddress,
            });
        });
    });

    return broadcastAddresses;
}

console.log(getBroadcastAddresses());
