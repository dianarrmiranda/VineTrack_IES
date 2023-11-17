# Use uma imagem do Maven como imagem base
FROM maven:3.8.1-openjdk-17-slim AS build

# Defina o diretório de trabalho no container
WORKDIR /vineTrack
COPY pom.xml .
COPY src ./src
# Executar mvn install no conteiner
RUN mvn clean install

# Use uma imagem do OpenJDK como imagem base para a imagem final
FROM openjdk
COPY --from=build /vineTrack/target/vineTrack-0.0.1-SNAPSHOT.jar /app.jar
ENTRYPOINT ["java","-jar","/app.jar"]
