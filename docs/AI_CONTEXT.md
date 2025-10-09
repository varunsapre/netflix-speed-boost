# AI Context Summary

## Project Overview
**Netflix Speed Boost** - A Chrome extension that allows temporary and permanent playback speed control on Netflix and HBO Max videos.

## Core Functionality

### 🚀 Temporary Speed Boost (Hold-to-Activate)
- **Hold-to-boost**: Hold anywhere on screen OR hold custom key to temporarily increase playback speed
- **Release-to-restore**: Release to instantly return to normal speed
- **Dual activation**: Both pointer events (click/hold) and customizable key hold supported
- **Cross-platform**: Works on both Netflix and HBO Max
- **Smart detection**: Only activates on video elements, not controls or input fields

### ⚡ Permanent Speed Change (Set-and-Forget)
- **HBO Max**: On-screen speed control button with dropdown menu for persistent speed changes
- **Netflix**: Uses native speed controls (already integrated)
- **No holding required**: Set once and speed stays active until changed

### ⚙️ Unified Settings
- **Customizable key binding**: Default 'L' key, user can change to any key
- **Customizable speed**: 1.25× to 5× (default: 1.5×)
- **Visual feedback**: Optional wave animations and speed indicators
- **Single popup**: One settings interface for all supported services

## Technical Architecture
- **Manifest V3** Chrome extension
- **Modular design** - Separate modules for Netflix and HBO Max
- **Service detection** - Automatically loads appropriate module based on URL
- **Unified popup** - Single settings interface for all services
- **Chrome storage sync** - Settings persist across devices
- **SPA navigation handling** - Detects route changes on both platforms

## Key Files
- `manifest.json` - Extension configuration and permissions
- `main-loader.js` - Service detection and core functionality
- `netflix-module.js` - Netflix-specific functionality
- `hbomax-module.js` - HBO Max-specific functionality (includes custom speed controls)
- `popup.html`/`popup.js` - Unified settings interface
- `assets/icons/` - Extension icons (16px, 48px, 128px)

## Technical Details
- **Permissions**: `storage` and host permissions for `https://www.netflix.com/*` and `https://play.hbomax.com/*`
- **Content script matches**: Separate entries for Netflix and HBO Max
- **Event handling**: Pointer events and keyboard events (customizable key) with hold threshold (150ms)
- **Activation methods**: 
  - **Netflix**: Hold anywhere on screen OR custom key hold
  - **HBO Max**: Hold anywhere on screen OR custom key hold OR on-screen speed button
- **Key binding system**: Simplified interface - click key field directly to change
- **Visual feedback**: CSS animations, fullscreen support, no control bar interference
- **Privacy**: No tracking, local storage only

## Development Context
- Production-ready Chrome extension
- Comprehensive documentation in `/docs/`
- Icon generation scripts in `.github/workflows/scripts/` (icons committed to repository)
- Publishing guides and checklists included
- MIT licensed, open source

## Common Development Tasks
- Modify speed boost behavior → Edit `main-loader.js`
- Update Netflix-specific features → Edit `netflix-module.js`
- Update HBO Max-specific features → Edit `hbomax-module.js`
- Update settings UI → Edit `popup.html`/`popup.js`
- Change visual feedback → Modify CSS in `main-loader.js`
- Update permissions → Edit `manifest.json`
- Regenerate icons → Run `.github/workflows/scripts/generate-icons.sh` (then commit the generated icons)
- Change key binding system → Edit key capture logic in `popup.js`
- Modify key handling → Edit `handleCustomKeyDown/Up` functions in `main-loader.js`
- Add new streaming service → Create new module file and update `main-loader.js` service detection
