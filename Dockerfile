# Build stage
FROM node:16 AS build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

ENV NODE_ENV=production
ENV GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID}

RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Only expose port 8080 (Cloud Run requirement)
EXPOSE 8080

# Only one CMD instruction
CMD ["nginx", "-g", "daemon off;"] 