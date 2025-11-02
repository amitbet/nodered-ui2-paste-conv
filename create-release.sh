#!/bin/bash

# Script to create a release package
# This creates a zip file excluding node_modules and git files

set -e

VERSION=${1:-"v1.0.0"}
RELEASE_NAME="nodered-dashboard-converter-${VERSION}"
ZIP_NAME="${RELEASE_NAME}.zip"

echo "📦 Creating release package: ${ZIP_NAME}"
echo ""

# Create temporary directory
TEMP_DIR=$(mktemp -d)
RELEASE_DIR="${TEMP_DIR}/${RELEASE_NAME}"

# Copy files (excluding node_modules, .git, etc.)
echo "📋 Copying files..."
mkdir -p "${RELEASE_DIR}"
rsync -av --exclude='node_modules' \
          --exclude='.git' \
          --exclude='.DS_Store' \
          --exclude='*.log' \
          --exclude='.github' \
          --exclude='create-release.sh' \
          --exclude='RELEASE_NOTES.md' \
          . "${RELEASE_DIR}/"

# Create a simple install instruction file
cat > "${RELEASE_DIR}/INSTALL.txt" << EOF
Node-RED Dashboard Converter v1.0.0
===================================

QUICK START:
------------

macOS/Linux:
  ./run.sh

Windows:
  run.bat

MANUAL INSTALLATION:
-------------------
  npm install
  npm start

Then open: http://localhost:3000

For more details, see README.md
EOF

# Create zip file
echo "📦 Creating zip archive..."
cd "${TEMP_DIR}"
zip -r "${ZIP_NAME}" "${RELEASE_NAME}" > /dev/null

# Move zip to current directory
mv "${ZIP_NAME}" "${OLDPWD}/"

# Cleanup
rm -rf "${TEMP_DIR}"

echo ""
echo "✅ Release package created: ${ZIP_NAME}"
echo ""
echo "Next steps:"
echo "1. Review the package"
echo "2. Push the tag: git push origin v1.0.0"
echo "3. Create a GitHub release and upload ${ZIP_NAME}"

