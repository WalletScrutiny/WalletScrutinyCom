---
layout: archive
title: "Glossary"
permalink: /glossary/
author_profile: true
---

**build**
: A program that you can run is generated based on some source code. The process
  of generating the program from the code is called building.

**reproducible build**
: A build where a third party can verify the binary to match the source code is
  called reproducible.

**deterministic build**
: If the build process does not depend on external factors such as time or
  machine it is run on, it deterministically results in the same output for the
  same input.

**reproducible build**
: See deterministic build

**APK**
: Android apps are distributed as files with the `.apk` extension. It's an
  install package that contains all the properties of the executable app.

**version pinning**
: If an app wants to use features provided by a third party, that third party's
  software is being loaded into the app. For deterministic builds it is
  essential that the third party's "library" is specified by its exact version.
  The version has to be pinned.
