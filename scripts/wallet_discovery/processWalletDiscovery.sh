#!/bin/bash

# Process Bitcoin Wallet Discovery Results
# This script runs the interactive tool to review discovered wallets

node processWalletDiscovery.mjs
echo "updating images. This may take some time..."
cd ../../
./updateImages.sh
