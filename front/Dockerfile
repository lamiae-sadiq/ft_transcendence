# Use an official Nginx image
FROM nginx:latest

# Copy the Nginx configuration file to the container
COPY nginx.conf /etc/nginx/conf.d/default.conf

RUN chmod -R 755 /usr/share/nginx/html

# Copy the content of the current directory to the default Nginx directory
COPY . /usr/share/nginx/html

# Expose port 80 to make your application accessible
EXPOSE 80
