# App (based on node image)
FROM node:22.14.0-bullseye as build

# Set wodking directory
WORKDIR /web

# Copy dependencies
COPY packages/shared packages/shared

# Copy self
COPY packages/app packages/app

# Copy root
COPY tsconfig.json .
COPY package.json .
COPY package-lock.json .

# Build
RUN npm install
RUN npm run build-app

# Nginx (based on nginx image)
FROM nginx:1.24.0-bullseye

# Copy nginx configuration
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

# Copy app artifacts
COPY --from=build /web/packages/app/dist /usr/share/nginx/html

# Expose nginx port 
EXPOSE 80

# Run nginx when running a container
CMD ["nginx", "-g", "daemon off;"]