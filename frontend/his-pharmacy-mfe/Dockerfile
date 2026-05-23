# Stage 1: Build the Angular App
FROM node:20 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build --configuration=production

# Stage 2: Serve the App with NGINX
FROM nginx:alpine
# نسخ مجلد البناء لموديول الصيدلية
COPY --from=build /app/dist/his-pharmacy-mfe/browser /usr/share/nginx/html
# نسخ إعدادات NGINX التي تحتوي على CORS
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
