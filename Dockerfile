FROM nginx:1.14.2-alpine

COPY ./dist /var/www/poolc.org
COPY ./nginx.conf /etc/nginx/conf.d/poolc.org.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
