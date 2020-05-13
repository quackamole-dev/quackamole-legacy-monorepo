# p2p-videochat-platform - backend


## Steps
### Generate ssl certs for localhost 
This will create two files: **localhost.crt** and **localhost.key**. These are required for local development only. On the server we will use letsencrypt/certbot. Those two files need to be in the root of the backend folder.
``` shell script
$ openssl req -x509 -out localhost.crt -keyout localhost.key \
  -newkey rsa:2048 -nodes -sha256 \
  -subj '/CN=localhost' -extensions EXT -config <( \
   printf "[dn]\nCN=localhost\n[req]\ndistinguished_name = dn\n[EXT]\nsubjectAltName=DNS:localhost\nkeyUsage=digitalSignature\nextendedKeyUsage=serverAuth")
```
### Start backend

```
$ npm install
$ npm run start-dev
```

## Generate SSL Certificates for the server (Ubuntu 18.04 LTS)
[See instruction for other systems](https://certbot.eff.org/instructions "Certbot")

```
sudo apt-get update
sudo apt-get install software-properties-common
sudo add-apt-repository universe
sudo add-apt-repository ppa:certbot/certbot
sudo apt-get update
```

```
sudo apt-get install certbot
```
```
# Requires you to temporary stop your running servers
sudo certbot certonly --standalone
```
