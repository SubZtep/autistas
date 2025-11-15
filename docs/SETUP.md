## Backend Service (API)

Get a server, create certs and .env file.
https://console.hetzner.com/projects/2432424/servers/112628209/overview

Get a domain, add to CloudFlare, set SSL/TLS encryption mode to _Full_. Only set A record for the API, the LLM's tunnel subdomain is automatic.

#### Update compose:

```sh
curl -fsSL https://raw.githubusercontent.com/subztep/autistas/main/docker-compose.prod.yml -o /opt/autistas/docker-compose.yml
```

```sh
root@autistas-backend-1:/opt/autistas# ls -lah
total 20K
drwxr-xr-x 3 root root 4.0K Nov 14 08:42 .
drwxr-xr-x 4 root root 4.0K Nov  9 06:32 ..
drwxr-xr-x 3 root root 4.0K Nov 14 08:42 backend
-rw-r--r-- 1 root root 2.0K Nov 14 14:08 docker-compose.yml
-rw-r--r-- 1 root root  262 Nov 14 08:33 .env
root@autistas-backend-1:/opt/autistas# ls backend/certs/
origin.crt  origin.key
```

## Self-hosted LLM

Set up CloudFlare tunnel.
https://dash.cloudflare.com/d651156e85bf0a28d1258666ada491de/kaja.io

Config in My Computer with missing bits:

```sh
$ cat ~/.cloudflared/config.yml
tunnel: 0894e325-e50e-438a-af6d-b75ea324b034
credentials-file: /home/dcr/.cloudflared/0894e325-e50e-438a-af6d-b75ea324b034.json

ingress:
  - hostname: hazai.kaja.io
    service: http://localhost:11434
  - service: http_status:404

loglevel: info

$ cloudflared tunnel route dns hazai-tunnel hazai.kaja.io
```

## Deploy

https://expo.dev/accounts/subztep/projects/autistas

Source:
https://github.com/SubZtep/autistas

API Doc:
https://backend.kaja.io/ui

## Run LLM

```sh
$ OLLAMA_HOST=0.0.0.0:11434 ollama serve
$ cloudflared tunnel run hazai-tunnel
```

---

## Validate

#### API:

```sh
curl -X POST https://backend.kaja.io/api/chat/stream -H "Content-Type: application/json" -d '{"message":"Hello, how are you?"}'
```

#### LLM:

```sh
curl -X POST https://hazai.kaja.io/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "model": "smollm2",
    "prompt": "Write a short poem about a cat.",
    "max_tokens": 50
  }'
```
