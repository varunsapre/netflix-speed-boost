#!/bin/bash

# Chrome Web Store Package Generator
# Creates a clean ZIP file for Chrome Web Store submission
# Automatically includes all necessary extension files

set -e  # Exit on error

echo "📦 Creating Chrome Web Store package..."

# Script assumes it's being called from repository root
# Get version from manifest.json
VERSION=$(grep '"version"' manifest.json | sed 's/.*"version": "\([^"]*\)".*/\1/')
PACKAGE_NAME="netflix-speed-boost-v${VERSION}.zip"

# Create temporary directory for clean package
TEMP_DIR=$(mktemp -d)
echo "📁 Using temporary directory: $TEMP_DIR"

# Copy essential files
echo "📋 Copying extension files..."

# Copy manifest.json (required)
cp manifest.json "$TEMP_DIR/"

# Copy all JavaScript files
find . -maxdepth 1 -name "*.js" -exec cp {} "$TEMP_DIR/" \;

# Copy all HTML files
find . -maxdepth 1 -name "*.html" -exec cp {} "$TEMP_DIR/" \;

# Copy README.md (good practice for Chrome Web Store)
cp README.md "$TEMP_DIR/"

# Copy assets/icons directory (required for extension)
if [ -d "assets/icons" ]; then
    mkdir -p "$TEMP_DIR/assets"
    cp -r assets/icons "$TEMP_DIR/assets/"
fi

# Copy LICENSE if it exists
if [ -f "LICENSE" ]; then
    cp LICENSE "$TEMP_DIR/"
fi

# Create ZIP from temporary directory
echo "🗜️  Creating ZIP package..."
cd "$TEMP_DIR"
zip -r "$OLDPWD/$PACKAGE_NAME" . > /dev/null
cd - > /dev/null

# Clean up temporary directory
rm -rf "$TEMP_DIR"

echo ""
echo "✅ Successfully created: $PACKAGE_NAME"
echo ""
echo "📁 Package contents:"
unzip -l "$PACKAGE_NAME" | grep -v "Archive:" | grep -v "Length" | grep -v "Name" | grep -v "^-" | grep -v "files$"
echo ""
echo "🚀 Ready for Chrome Web Store submission!"
echo ""
echo "📊 Package statistics:"
echo "   - Version: $VERSION"
echo "   - File size: $(du -h "$PACKAGE_NAME" | cut -f1)"
echo "   - File count: $(unzip -l "$PACKAGE_NAME" | tail -1 | awk '{print $2}')"
