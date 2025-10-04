# 🧪 Testing Release Workflow Locally

## Quick Test (Recommended)
```bash
# Run the comprehensive test script
./.github/workflows/scripts/test-workflow.sh
```

## Individual Component Testing

### 1. Test Icon Generation Only
```bash
# Test icon generation (creates assets/icons/ directory)
./.github/workflows/scripts/generate-icons.sh

# Check if icons were created
ls -la assets/icons/
```

### 2. Test Package Generation Only
```bash
# Test package generation
./.github/workflows/scripts/generate-chrome-pkg.sh

# Check package contents
unzip -l netflix-speed-boost-v*.zip
```

### 3. Test Changelog Extraction
```bash
# Test changelog extraction for a specific version
VERSION="1.1.0"
CHANGELOG_FILE="docs/CHANGELOG.md"
awk "/## \[$VERSION\]/{flag=1; next} /## \[/{flag=0} flag" "$CHANGELOG_FILE"
```

## Cross-Platform Icon Generation

The icon generation script supports multiple platforms:

### macOS (Local Development)
```bash
# Uses sips (built-in macOS tool)
./.github/workflows/scripts/generate-icons.sh
```

### Ubuntu/Linux (GitHub Actions)
```bash
# Requires ImageMagick installation
sudo apt-get install imagemagick
./.github/workflows/scripts/generate-icons.sh
```

### Windows (WSL/Development)
```bash
# Install ImageMagick in WSL
sudo apt-get install imagemagick
./.github/workflows/scripts/generate-icons.sh
```

## Advanced Testing Options

### Option 1: Using act (GitHub Actions locally)
```bash
# Install act (if not already installed)
# macOS: brew install act
# Linux: curl https://raw.githubusercontent.com/nektos/act/master/install.sh | sudo bash

# Test the workflow (requires Docker)
act push -e .github/workflows/test-event.json
```

### Option 2: Manual Workflow Simulation
```bash
# Simulate the exact workflow steps
export GITHUB_REF="refs/tags/v1.1.0"
export GITHUB_REPOSITORY="your-username/netflix-speed-boost"

# Run each step manually
echo "VERSION=${GITHUB_REF#refs/tags/v}"
# ... continue with other steps
```

### Option 3: Docker Testing
```bash
# Create a Docker container that mimics GitHub Actions environment
docker run -it --rm -v $(pwd):/workspace ubuntu:latest bash
cd /workspace
# Install ImageMagick
apt-get update && apt-get install -y imagemagick
# Run your tests inside the container
```

## What to Look For

### ✅ Success Indicators
- All scripts execute without errors
- Icons are generated in `assets/icons/`
- Package is created as `netflix-speed-boost-v*.zip`
- Package contains only extension files (no docs, assets, etc.)
- Changelog extraction works for your version format

### ❌ Common Issues
- Missing dependencies (sips command on macOS, ImageMagick on Ubuntu)
- Permission issues with script execution
- Path problems (scripts not found)
- Package includes unwanted files

## Pre-Release Checklist

Before pushing a tag to trigger the real workflow:

1. ✅ Run `./.github/workflows/scripts/test-workflow.sh`
2. ✅ Verify all components work locally
3. ✅ Check that your version format matches the changelog
4. ✅ Ensure all required files exist
5. ✅ Test with a dry-run tag first (e.g., `v1.1.0-test`)

## Troubleshooting

### Script Not Found
```bash
# Make sure scripts are executable
chmod +x .github/workflows/scripts/*.sh
```

### Icons Not Generated (macOS)
```bash
# Check if logo exists
ls -la assets/logo.png

# Check if sips is available (macOS)
which sips
```

### Icons Not Generated (Ubuntu/Linux)
```bash
# Check if logo exists
ls -la assets/logo.png

# Install ImageMagick if not available
sudo apt-get install imagemagick

# Check if convert is available
which convert
```

### Package Issues
```bash
# Check what's in the package
unzip -l netflix-speed-boost-v*.zip

# Verify exclusion patterns in generate-chrome-pkg.sh
```
