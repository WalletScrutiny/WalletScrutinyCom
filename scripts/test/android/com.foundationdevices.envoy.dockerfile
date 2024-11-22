# Dockerfile for running bundletool to generate split APKs
FROM openjdk:11-jre-slim

# Install necessary tools
RUN apt-get update && apt-get install -y wget unzip && rm -rf /var/lib/apt/lists/*

# Download and add bundletool
RUN wget https://github.com/google/bundletool/releases/download/1.17.2/bundletool-all-1.17.2.jar -O /usr/local/bin/bundletool.jar

# Add execution permissions
RUN chmod +x /usr/local/bin/bundletool.jar

# Create working directory
WORKDIR /workspace

# Default command
CMD ["java", "-jar", "/usr/local/bin/bundletool.jar"]