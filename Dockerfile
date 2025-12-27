FROM nginx:alpine

# Copy static files to nginx
COPY index.html /usr/share/nginx/html/
COPY css/ /usr/share/nginx/html/css/
COPY js/ /usr/share/nginx/html/js/
COPY lang/*.json /usr/share/nginx/html/lang/
COPY img/ /usr/share/nginx/html/img/
COPY data/ /usr/share/nginx/html/data/
COPY downloads/ /usr/share/nginx/html/downloads/

# Custom nginx config for SPA routing
RUN echo 'server { \
    listen 80; \
    root /usr/share/nginx/html; \
    index index.html; \
    \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
    \
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ { \
        expires 1y; \
        add_header Cache-Control "public, immutable"; \
    } \
    \
    location ~* \.json$ { \
        expires 1h; \
        add_header Cache-Control "public"; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
