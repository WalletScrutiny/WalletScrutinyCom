# Use Node.js 18-buster as the base image
FROM node:18-buster

# Set the working directory
WORKDIR /app

# Install required packages for building the environment
RUN apt-get update && apt-get install -y \
    openjdk-11-jdk \
    curl \
    unzip \
    git \
    build-essential \
    libssl-dev \
    libreadline-dev \
    zlib1g-dev \
    gnupg2 \
    wget \
    && rm -rf /var/lib/apt/lists/*

# Install Ruby from source
RUN wget https://cache.ruby-lang.org/pub/ruby/2.7/ruby-2.7.0.tar.gz \
    && tar -xzvf ruby-2.7.0.tar.gz \
    && cd ruby-2.7.0 \
    && ./configure \
    && make \
    && make install \
    && cd .. \
    && rm -rf ruby-2.7.0.tar.gz ruby-2.7.0

# Verify Ruby installation
RUN ruby -v

# Update RubyGems to a compatible version
RUN gem update --system 3.3.22

# Install the compatible version of ffi gem
RUN gem install ffi -v 1.17.0

# Set up Git configuration for private repository access
# NOTE: Replace <TOKEN> with your personal access token
RUN git config --global url."https://<USERNAME>:<TOKEN>@gitlab.com/".insteadOf "https://gitlab.com/"

# Install CocoaPods
RUN gem install cocoapods

# Install Android SDK dependencies
RUN mkdir -p "/home/appuser/sdk/licenses" && \
    echo "YOUR_LICENSE_HASH" > "/home/appuser/sdk/licenses/android-sdk-license"

# Download and unzip the Android command line tools
RUN wget https://dl.google.com/android/repository/commandlinetools-linux-9123335_latest.zip && \
    unzip commandlinetools-linux-9123335_latest.zip -d /home/appuser/sdk && \
    rm commandlinetools-linux-9123335_latest.zip

# Update and install required Android SDK packages
RUN yes | /home/appuser/sdk/cmdline-tools/bin/sdkmanager --sdk_root=/home/appuser/sdk \
    "platform-tools" "platforms;android-30" "build-tools;30.0.3"

# Set environment variables for Android SDK
ENV ANDROID_SDK_ROOT="/home/appuser/sdk"
ENV ANDROID_HOME="/home/appuser/sdk"

# Clone the Slavi Wallet repository
RUN git clone https://github.com/SlvLabs/slavi-wallet.git .

# Disable host key checking to prevent SSH issues
RUN mkdir -p /root/.ssh && ssh-keyscan gitlab.com >> /root/.ssh/known_hosts

# Install npm dependencies
RUN GIT_ASKPASS=echo npm install --force

# Build the project (adjust according to your build needs)
RUN npm run build

# Set the default command for the Docker container
CMD ["bash"]
