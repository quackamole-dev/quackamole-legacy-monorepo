# STAGE 1: Build frontend
FROM node:14.21.3-bullseye as build
WORKDIR /usr/src/app
COPY ./frontend/package*.json ./
COPY ./frontend ./

# Workaround to be able to set vite env vars via args in the compose file for now...
ARG REACT_APP_BACKEND_URL
ENV VITE_BACKEND_API_URL=$REACT_APP_BACKEND_URL    
RUN echo "REACT_APP_BACKEND_URL is set to $REACT_APP_BACKEND_URL"

RUN npm install && npm run build

# STAGE 2: Setup nginx and copy frontend build files
FROM nginx:1.25.1-alpine
RUN apk add --no-cache openssl nano && \
    openssl dhparam -out /etc/nginx/dhparam.pem 1024 && \
    apk del openssl && \
    rm -rf /usr/share/nginx/html/*
# COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /usr/src/app/build /usr/share/nginx/html
# Regarding usage of ENTRYPOINT with nginx dockerhub image: https://github.com/nginxinc/docker-nginx/issues/422
CMD ["nginx", "-g", "daemon off;"]
