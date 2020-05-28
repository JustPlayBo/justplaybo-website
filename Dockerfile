
FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY  dist/justplaybo-website-new /usr/share/nginx/html
