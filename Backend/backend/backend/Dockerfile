# DearMe backend — multi-stage Dockerfile
# Stage 1 ("build"): has Maven + JDK to compile the jar. Not shipped.
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app

# Render's build context is the repo root, but pom.xml lives at
# Backend/backend/backend/pom.xml. Copy that subtree into the container.
COPY Backend/backend/backend/ .

# Build the jar (skip tests: they run in CI/local)
RUN mvn -B -DskipTests package

# Stage 2 ("runtime"): only a Java runtime, no build tools.
# Smaller image + smaller attack surface.
FROM eclipse-temurin:17-jre
WORKDIR /app

# Grab just the jar from stage 1. COPY --from resolves against the stage's
# filesystem root (not its WORKDIR), and the build stage's WORKDIR is /app,
# so the jar lives at /app/target/*.jar. *.jar is safe here — Spring Boot
# leaves the repackaged jar plus a *.jar.original, which this glob does NOT match.
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["sh", "-c", "java -jar app.jar --server.port=${PORT:-8080}"]
