# AquilaHub
Load and serve ML models to compress data into latent vectors. To be used with Aquila DB.

# Technology

Aquila Hub automates the process of encoding information with the help of ML models. Here is where Aquila Hub fits in the entire ecosystem:
<div align="center">
  <img
    src="https://user-images.githubusercontent.com/19545678/133918439-e08f314b-ad15-441e-a605-2fd2ec37a509.png"
    alt="Aquila Hub Architecture"
    height="400"
  />
 <br/>
</div>

# Install
### Debian

Run `curl -s -L https://raw.githubusercontent.com/Aquila-Network/AquilaHub/main/install.sh | /bin/bash -s -- -d 1 `.

### Docker

**You need docker installed in your system**

Build image (one time process): `docker build https://raw.githubusercontent.com/Aquila-Network/AquilaHub/main/Dockerfile -t aquilahub:local`

Run image (to deploy Aquila DB): `docker run -p 5002:5002 -d aquilahub:local`
