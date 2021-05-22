# AquilaX-CE
Aquila X Community Edition.

# Install
Follow below steps and you are all set.

Alternatively, follow this [video tutorial](https://chrome-ext-aquila.s3-ap-southeast-1.amazonaws.com/aquila+network+-+setup+Aquila+X.mov).
## Step 1. Chrome extension
### Install from chrome web store (recommended)
[![addtochrome](https://user-images.githubusercontent.com/68724239/111738541-92476300-88a7-11eb-8444-3f2baa515b9c.png)](https://chrome.google.com/webstore/detail/aquila-x/albdahjdcmldbcpjmbnbcbckgndaibnk)
### Install from source code
- `git clone https://github.com/Aquila-Network/AquilaX-browser-extension`
- in Chrome / Chromium / Brave browser, go to `chrome://extensions/` and enable "developer mode"
- click "Load unpacked" button and select "chrome" directory from the cloned repository above. You can make sure the extension gets installed when https://aquila.network website is opened automatically.
## Step 2. Server (Debian / Ubuntu)
> Prerequisites: You need [Docker and Docker-compose already installed](https://gist.github.com/freakeinstein/23360053b2c33630b4417549f8e82577) in your system (4G RAM min. recommended).

Now, run below command and wait a few minutes:
```
wget -O - https://raw.githubusercontent.com/Aquila-Network/AquilaX-CE/main/setup_aquilax.sh | /bin/bash
```
Once the installation is completed, visit `http://<localhost / server IP>`

In chrome extension, set the endpoint to `http://<localhost / server IP>/api/`

# Considerations
## 1. Security
This software is still in its alpha version. Any wire security measures (inc. ssl, vpn) should be concern of and must be employed by the user.
## 2. Changes
Current implementations of Aquila Network Modules comply with latest draft specifications. Changes are subject to specification updates.
