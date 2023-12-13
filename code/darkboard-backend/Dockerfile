
# Use a base image with Maven and Java
FROM eclipse-temurin:17-jdk AS build

RUN apt-get update \
  && apt-get install -y ca-certificates curl git --no-install-recommends \
  && rm -rf /var/lib/apt/lists/*

# common for all images
ENV MAVEN_HOME /usr/share/maven

COPY --from=maven:3.9.5-eclipse-temurin-11 ${MAVEN_HOME} ${MAVEN_HOME}
COPY --from=maven:3.9.5-eclipse-temurin-11 /usr/local/bin/mvn-entrypoint.sh /usr/local/bin/mvn-entrypoint.sh
COPY --from=maven:3.9.5-eclipse-temurin-11 /usr/share/maven/ref/settings-docker.xml /usr/share/maven/ref/settings-docker.xml

RUN ln -s ${MAVEN_HOME}/bin/mvn /usr/bin/mvn

ARG MAVEN_VERSION=3.9.5
ARG USER_HOME_DIR="/root"
ENV MAVEN_CONFIG "$USER_HOME_DIR/.m2"


# Set the working directory
WORKDIR /server

# Copy the pom.xml file to the working directory
COPY pom.xml .

# Download the dependencies specified in the pom.xml file
RUN mvn dependency:go-offline -B

# Copy the source code to the working directory
COPY src ./src

COPY application-prod.properties ./src/main/resources/application.properties

# Build the application
RUN mvn install

# Use a lightweight base image with Java
FROM eclipse-temurin:17-jdk

# Set the working directory
WORKDIR /server

# Copy the executable JAR file from the build stage
COPY --from=build /server/target/*.jar app.jar

# Expose the port on which the application will run
EXPOSE 8080
EXPOSE 8085

# Run the application
CMD ["java", "-jar","-Dchess-url=chess", "app.jar"]
