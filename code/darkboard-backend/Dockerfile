
# Use a base image with Maven and Java
FROM maven:3.8.4-openjdk-17slim AS build

# Set the working directory
WORKDIR /server

# Copy the pom.xml file to the working directory
COPY pom.xml .

COPY application-prod.properties ./src/main/resources/application.properties

# Download the dependencies specified in the pom.xml file
RUN mvn dependency:go-offline -B

# Copy the source code to the working directory
COPY src ./src

# Build the application
RUN mvn install

# Use a lightweight base image with Java
FROM openjdk:17-jre-slim

# Set the working directory
WORKDIR /server

# Copy the executable JAR file from the build stage
COPY --from=build /server/target/*.jar app.jar

# Expose the port on which the application will run
EXPOSE 8080
EXPOSE 8085

# Run the application
CMD ["java", "-jar", "app.jar"]
