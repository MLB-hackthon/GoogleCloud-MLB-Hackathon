#!/bin/bash

# Initial certificate request
if [ ! -d "/etc/letsencrypt/live/34.56.194.81.nip.io" ]; then
    certbot certonly --standalone \
        --non-interactive \
        --agree-tos \
        --email huangjiayuan33@gmail.com \
        -d 34.56.194.81.nip.io \
        --http-01-port=80
fi

# Set up auto-renewal in background
(
    while :; do
        certbot renew --quiet
        sleep 12h
    done
) & 