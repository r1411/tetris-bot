FROM nginx
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY ./frontend/ /usr/share/nginx/html
