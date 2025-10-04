#!/bin/bash

# Chrome Extension Icon Generator
# Usage: ./generate-icons.sh [source-image]
# Example: ./generate-icons.sh netflix-speed-boost/logo.png

set -e  # Exit on error

# Default source image
SOURCE="${1:-../assets/logo.png}"

# Check if source file exists
if [ ! -f "$SOURCE" ]; then
    echo "❌ Error: Source image '$SOURCE' not found!"
    echo "Usage: ./generate-icons.sh [source-image]"
    echo "Example: ./generate-icons.sh ../assets/logo.png"
    exit 1
fi

# Target directory for generated icons
TARGET_DIR="../assets/icons"

echo "🎨 Generating Chrome extension icons from '$SOURCE'..."
echo ""

# Generate 16x16 icon
echo "📦 Creating icon16.png (16x16)..."
sips -z 16 16 "$SOURCE" --out "$TARGET_DIR/icon16.png" > /dev/null 2>&1

# Generate 48x48 icon
echo "📦 Creating icon48.png (48x48)..."
sips -z 48 48 "$SOURCE" --out "$TARGET_DIR/icon48.png" > /dev/null 2>&1

# Generate 128x128 icon
echo "📦 Creating icon128.png (128x128)..."
sips -z 128 128 "$SOURCE" --out "$TARGET_DIR/icon128.png" > /dev/null 2>&1

echo ""
echo "✅ Successfully generated all icons in $TARGET_DIR/"
echo ""
echo "📁 Files created:"
echo "   - $TARGET_DIR/icon16.png  (16x16)   - Toolbar icon"
echo "   - $TARGET_DIR/icon48.png  (48x48)   - Extensions page & popup"
echo "   - $TARGET_DIR/icon128.png (128x128) - Chrome Web Store & options page"
echo ""
echo "🚀 Reload your extension in chrome://extensions/ to see the changes!"

