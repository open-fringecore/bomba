# khamba - Share files though local network.

> A CLI tool for seamless file sharing over a local network, featuring automatic peer discovery.

## Install

```bash
$ npm install -g khamba
```

## Usage

```
$ khamba --help
$ khamba -v

Usage
    TO SEND:
      $ khamba file1.jpg ../folder02/file3.mp4

    TO RECEIVE:
      $ khamba

Options:
    -n, --name      Your preferred name
    -v, --version   Show version number

Examples:
    $ khamba --name=Jane
    ⢎⡑ Receiving...

    $ khamba -n I_AM_GROOT file1.jpg file3.mp4
    ⢎⡑ Sending...
```

## Features

- **File Transfer Over Local Network**  
Seamlessly transfer files between devices on the same local network.

- **Automatic Peer Discovery**  
Instantly find and connect with other devices without manual setup.

- **Secure Hash Verification**  
Ensure data integrity with hash checks to verify successful file transfers.

- **Customizable Peer Identification**  
Easily assign unique names to peers for clear identification.

- **Multi-Receiver Support**
Enable multiple devices to receive files from a single sender simultaneously.

- **Support for Multiple CLI Instances**  
Run multiple instances of the CLI tool concurrently without conflict.

- **Password Protected Transfer (Under Development)**  
Add an optional layer of security with password-protected transfers.


## Maintainers

- [Open FringeCore](https://github.com/open-fringecore)
- [Rifat Noor](https://github.com/rifatNR)
- [Omran Jamal](https://github.com/omranjamal)

### Thanks
> We are currently enhancing this tool and welcome your contributions to its development. [Open FringeCore](https://github.com/open-fringecore)