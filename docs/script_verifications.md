# Scripts for Reproducible Verifications

We need to agree on a set of standards for the scripts used to reproduce verifications to achieve these 2 goals:

1. Verifications need to be reproducible themselves, so they need to be able to be run in our users' computers.
2. We need to be able to run the scripts automatically on the build server when a new version is released.

## Verifications need to be reproducible themselves
Scripts need to be able to be run in our users' computers so they can verify the verifications. The users would think something like this: "Ah, new version of Zeus got released, let's see if WalletScrutiny got it. Yes, they got it! I'll try to repeat the verification of this guy to see if I can get the same result, by downloading his script and running it on my own computer".

While it's impossible to make a script that works on all the computers in the world, we can increase the odds by following some rules:

## Scripts should be able to run automatically on the build server when a new version is released

We need to be able to run the scripts automatically on the build server when a new version is released. This is important because we need to be able to verify the verifications automatically and in a reproducible way when a new version is released.


# Rules

1. Scripts need to be `run as a user`, not root
2. Scripts should `use the directory in which they are executed` as much as possible, so we don't pollute users' computers. If not possible for any reason, we should use standard temporary directories like /tmp, not something like /var/shared
3. We should make it as easy as possible for our users to repeat the verification
4. Users shouldn't need to install dependencies besides `docker/podman`. That way, we can install everything inside the container, so users don't need to install anything else
5. We `cannot rely on our build server` utilities or scripts, as people won't have access to it
6. We `cannot rely on scripts` that are `in the WS gitlab repo`
7. We should use `as little files as possible`, typically only one script per verification, but if needed, all the other assets (Dockerfile, etc) should be uploaded to the verification
8. The result of the execution of the script should both
  - be `shown on the screen` ("Hash of the binary = xxxx, Hash of the compiled = yyyyy, It matches. / These are the differences between the binary and the compiled") for human verifiers
  - `use a return code` of 0 if the verification is reproducible, and 1 if it's not.
9. The parameters of the script should be:

   `-v`: version of the app (without the v prefix)

   `-t`: (optional) type of the app (bitcoin, multi, etc)

   `-a`: (optional) apk file of the app if it's provided by the user, instead of downloading it from the github/homepage of the app

10. If a smartphone connected to the computer is needed, notify the user at the beginning of the script so he knows what to do
