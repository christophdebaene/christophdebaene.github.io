# Synology

## How to get access to /var/run/docker.sock

```bash
sudo synogroup --add docker <userid>
sudo chgrp docker /var/run/docker.sock
```