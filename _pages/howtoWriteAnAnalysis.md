---
title: "How to Write an Analysis"
permalink: /howtoWriteAnAnalysis/
---
WalletScrutiny uses Jekyll to manage its static site, where each product is represented by a text file (for description, links, and data) and an image file. For example, the first open-source Android wallet is defined by its Analysis file and its logo.
### Adding New Android Apps

    **Prepare Your Environment:** Ensure your local instance is up-to-date with the master branch.
    **Get the App ID:** Use the Google Play URL to identify the app's ID.
    **Create a New Branch:** Name it appropriately for the new app.
    **Add the App:** Run the appropriate node script to add the app.
    **Update Images:** Use the provided script to add the app’s icon images.

### Adding New iPhone Apps

    **Obtain the Apple Store ID:** Use the Apple Store URL to find the app's country code and ID.
    **Add the App:** Run the node script with the app’s ID and country code.
    **Update Images:** Similar to Android, update the images using the script.

### Reviewing Apps

Once added, you can review the apps by editing the corresponding .md files. The structure of these files is consistent, ensuring that all necessary details, from wsId to verdict, are properly documented.

For more detailed instructions, including field definitions and advanced procedures, please refer to the comprehensive version here.