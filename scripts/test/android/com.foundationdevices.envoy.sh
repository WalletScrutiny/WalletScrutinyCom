# #!/bin/bash

repo=https://github.com/Foundation-Devices/envoy
tag="v$versionName"
builtApk=$workDir/app-release-unsigned.apk

docker_image='envoy'

test() {
  podman rmi $docker_image -f || true

  podman build \
    --tag $docker_image \
    --cgroup-manager cgroupfs \
    --ulimit nofile=16384:16384 \
    --memory=6g \
    --build-arg UID=$(id -u) \
    --build-arg TAG=$tag \
    --file Dockerfile \
    --file $SCRIPT_DIR/test/android/com.foundationdevices.envoy.dockerfile

  podman run \
    -it \
    --volume $workDir:/mnt \
    --rm \
    -u root \
    $docker_image \
    bash -c \
      'cp /Users/runner/work/1/s/android/app/build/outputs/apk/release/*.apk /mnt/'

    podman rmi $docker_image -f
    podman image prune -f
}