# AI Context Summary

## Project Overview
**Netflix Speed Boost** - A Chrome extension that allows temporary playback speed boosting on Netflix videos by holding down on the right side of the video area.

## Core Functionality
- **Hold-to-boost**: Hold on right 1/3 of video area OR hold custom key to temporarily increase playback speed
- **Release-to-restore**: Release to instantly return to normal speed
- **Dual activation**: Both pointer events (click/hold) and customizable key hold supported
- **Customizable key binding**: Default 'L' key, user can change to any key
- **Customizable speed**: 1.25× to 5× (default: 1.5×)
- **Visual feedback**: Optional wave animations and speed indicators
- **Smart detection**: Only activates on video elements, not controls or input fields

## Technical Architecture
- **Manifest V3** Chrome extension
- **Content script** (`content.js`) - Main logic injected into Netflix pages
- **Popup interface** (`popup.html`/`popup.js`) - Settings UI
- **Chrome storage sync** - Settings persist across devices
- **SPA navigation handling** - Detects Netflix route changes

## Key Files
- `manifest.json` - Extension configuration and permissions
- `content.js` - Core functionality (video detection, hold/release logic, visual feedback)
- `popup.html`/`popup.js` - Settings interface
- `assets/icons/` - Extension icons (16px, 48px, 128px)

## Technical Details
- **Permissions**: Only `storage` and `https://www.netflix.com/*` host permission
- **Content script matches**: `https://www.netflix.com/watch/*`
- **Event handling**: Pointer events and keyboard events (customizable key) with hold threshold (150ms)
- **Activation methods**: Right-click hold OR custom key hold (user configurable, default: 'L')
- **Key binding system**: Interactive key capture in popup interface
- **Visual feedback**: CSS animations, fullscreen support
- **Privacy**: No tracking, local storage only

## Development Context
- Production-ready Chrome extension
- Comprehensive documentation in `/docs/`
- Icon generation scripts in `/scripts/`
- Publishing guides and checklists included
- MIT licensed, open source

## Common Development Tasks
- Modify speed boost behavior → Edit `content.js`
- Update settings UI → Edit `popup.html`/`popup.js`
- Change visual feedback → Modify CSS in `content.js`
- Update permissions → Edit `manifest.json`
- Regenerate icons → Run `scripts/generate-icons.sh`
- Change key binding system → Edit key capture logic in `popup.js`
- Modify key handling → Edit `handleCustomKeyDown/Up` functions in `content.js`
