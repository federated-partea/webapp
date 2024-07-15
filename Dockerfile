# Stage 1: Compile and Build angular codebase

# Use official node image as the base image
FROM node:latest as build

# Set the working directory
WORKDIR /app

# Add the source code to app
COPY ./ /app

# Install all the dependencies
RUN npm install

# Generate the build of the application
RUN npm run build:prod -- --base-href=./


# Stage 2: Serve app with nginx server

# Use official nginx image as the base image
FROM nginx:latest

# Copy the build output to replace the default nginx contents.
COPY --from=build app/dist/slife-webapp/* /usr/share/nginx/html
COPY nginx/default.conf /etc/nginx/conf.d/
COPY nginx/htpasswd /etc/nginx/htpasswd

# Expose port 80
EXPOSE 80
