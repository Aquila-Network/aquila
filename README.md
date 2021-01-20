# AquilaHub
Load and serve ML models to compress data into latent vectors. To be used with Aquila DB.

# Install
### Debian

Run `curl -s -L https://raw.githubusercontent.com/Aquila-Network/AquilaHub/main/install.sh | /bin/bash -s -- -d 1 `.

### Docker

**You need docker installed in your system**

Build image (one time process): `docker build https://raw.githubusercontent.com/Aquila-Network/AquilaHub/main/Dockerfile -t aquilahub:local`

Run image (to deploy Aquila DB): `docker run -p 5002:5002 -d aquilahub:local`
