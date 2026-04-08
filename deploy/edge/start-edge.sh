#!/usr/bin/env bash
set -eu

: "${ACTIVE_COLOR:=blue}"

envsubst '${ACTIVE_COLOR}' \
  < /etc/nginx/templates/nginx.conf.template \
  > /etc/nginx/nginx.conf

exec nginx -g 'daemon off;'
