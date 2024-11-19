FROM nginx
COPY /game/ /var/www/html
COPY /nginx.conf /etc/nginx/conf.d/default.conf
RUN apt-get update && apt-get install -y procps