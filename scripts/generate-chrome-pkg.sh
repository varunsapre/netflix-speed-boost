#!/bin/bash

# Chrome Web Store Package Generator
# Creates a clean ZIP file for Chrome Web Store submission

set -e  # Exit on error

echo "📦 Creating Chrome Web Store package..."

cd ..

# Get version from manifest.json
VERSION=$(grep '"version"' manifest.json | sed 's/.*"version": "\([^"]*\)".*/\1/')
PACKAGE_NAME="netflix-speed-boost-v${VERSION}.zip"

# Create ZIP with only extension files
zip -r "$PACKAGE_NAME" . \
  -x "*.git*" \
  -x "*.DS_Store" \
  -x "assets/*" \
  -x "docs/*" \
  -x "scripts/*" \
  -x "*.md" \
  -x "README.md"

echo ""
echo "✅ Successfully created: $PACKAGE_NAME"
echo ""
echo "📁 Package contents:"
unzip -l "$PACKAGE_NAME" | grep -E "\.(js|html|json|png)$" | head -10
echo ""
echo "🚀 Ready for Chrome Web Store submission!"