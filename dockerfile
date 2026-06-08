FROM node:lts-alpine3.22 as build
RUN mkdir -p /opt/app
WORKDIR /opt/app
COPY ./ .
RUN npm install
RUN npm run build

# stage 2
FROM nginx:stable-alpine-perl
COPY --from=build /opt/app/dist/ProjectWorkAdmin/browser /usr/share/nginx/html
COPY ./nginx-custom.conf  /etc/nginx/conf.d/default.conf
CMD exec nginx -g 'daemon off;'