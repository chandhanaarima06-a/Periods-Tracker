# DearMe backend — multi-stage Dockerfile
# Stage 1 ("build"): has Maven + JDK to compile the jar. Not shipped.
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app

# Copy the whole project and build the jar (skip tests: they run in CI/local)
COPY . .
RUN mvn -B -DskipTests package

# Stage 2 ("runtime"): only a Java runtime, no build tools.
# Smaller image + smaller attack surface.
FROM eclipse-temurin:17-jre
WORKDIR /app

# Grab just the jar from stage 1. *.jar is safe here — Spring Boot leaves the
# repackaged jar plus a *.jar.original, which this glob does NOT match.
COPY --from=build /app/target/*.jar app.jar

# Railway injects a PORT env var (default 8080). The shell form of ENTRYPOINT
# expands ${PORT} at container start so we bind the port the platform expects.
EXPOSE 8080
ENTRYPOINT ["sh", "-c", "java -jar app.jar --server.port=${PORT:-8080}"]
