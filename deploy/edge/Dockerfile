FROM nginx:1.27-alpine

RUN apk add --no-cache bash gettext

COPY deploy/edge/nginx.conf.template /etc/nginx/templates/nginx.conf.template
COPY deploy/edge/start-edge.sh /start-edge.sh

RUN chmod +x /start-edge.sh

EXPOSE 8080

CMD ["/start-edge.sh"]
