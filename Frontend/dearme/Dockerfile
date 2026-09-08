# DearMe frontend — multi-stage Dockerfile
# Stage 1 ("build"): Node compiles the React app into static files.
FROM node:22-alpine AS build
WORKDIR /app

# Build-time config. CRA INLINES every REACT_APP_* var into the JS at build time,
# so they must exist BEFORE `npm run build` — they are not read at runtime.
# Railway passes service env vars as Docker build args, so setting these on the
# Railway service is enough. The Clerk key below is a PUBLIC publishable key
# (safe to commit, see CLAUDE.md); the default is a fallback so the build never
# silently ships without auth.
ARG REACT_APP_CLERK_PUBLISHABLE_KEY=pk_test_dGVuZGVyLW9yY2EtNDUxMi5jbGVyay5hY2NvdW50cy5kZXYk
ARG REACT_APP_API_BASE_URL
ENV REACT_APP_CLERK_PUBLISHABLE_KEY=$REACT_APP_CLERK_PUBLISHABLE_KEY \
    REACT_APP_API_BASE_URL=$REACT_APP_API_BASE_URL

# npm ci installs EXACTLY what package-lock.json pins (deterministic builds).
COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2 ("runtime"): a minimal web server (nginx) serves the static files.
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Railway's default PORT is 8080 — nginx must listen there (not the default 80).
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
