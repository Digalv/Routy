# --- build stage ---
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app

# кэшируем зависимости
COPY pom.xml .
RUN mvn dependency:go-offline -B

# собираем приложение
COPY src ./src
RUN mvn package -DskipTests -B

# --- runtime stage ---
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
