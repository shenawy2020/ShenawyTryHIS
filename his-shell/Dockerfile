# Stage 1: Build the Angular App
FROM node:20 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# الإنتاجية: بناء التطبيق
RUN npm run build --configuration=production

# Stage 2: Serve the App with NGINX
FROM nginx:alpine
# ملاحظة هامة: في Angular 17+ المجلد الافتراضي يكون dist/PROJECT_NAME/browser
COPY --from=build /app/dist/his-shell/browser /usr/share/nginx/html
# نسخ إعدادات NGINX التي تحتوي على CORS
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
