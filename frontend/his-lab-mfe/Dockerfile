# Stage 2: Serve the App with NGINX
FROM nginx:alpine
# Copy the pre-built app from the host dist directory directly into Nginx
COPY dist/his-lab-mfe/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
