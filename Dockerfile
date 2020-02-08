FROM nginx:1.17.8-alpine

COPY ./dist /var/www/jjungs.kr
COPY ./nginx.conf /etc/nginx/conf.d/jjungs.kr.conf

EXPOSE 80

CMD [ "nginx", "-g", "daemon off;" ]