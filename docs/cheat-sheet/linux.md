# Linux

## Systemd

```bash
sudo systemctl stop caddy
sudo systemctl disable caddy
```


## Networking

```bash
sudo ss -lntp | grep -E ':80|:443'
sudo netstat -tulnp | grep -E ':(80|443)'
```

## Upgrade packages

```bash
sudo apt-get update && sudo apt-get upgrade -y
```

## Install SSH

```bash
sudo apt install openssh-server -y
sudo systemctl enable ssh
sudo systemctl start ssh
sudo systemctl status ssh
```

### Enable Root login for SSH

```bash
# Set root password
sudo passwd root
sudo -i
nano /etc/ssh/sshd_config
```

```bash title="/etc/ssh/sshd_config" hl_lines="3"
#LoginGraceTime 2m
#PermitRootLogin prohibit-password
PermitRootLogin yes
#StrictModes yes
#MaxAuthtries 6
#MaxSessions 10
```

```bash
sudo systemctl restart sshd
```