# Netflix Speed Boost

A Chrome extension that allows you to temporarily boost Netflix playback speed by holding down on the video area.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Manifest](https://img.shields.io/badge/manifest-v3-green)
![License](https://img.shields.io/badge/license-MIT-blue)

## 🎯 Features

- **🚀 Instant Speed Boost**: Hold on the right side of any video to temporarily increase playback speed
- **⚙️ Fully Customizable**: Choose speeds from 1.25× to 5× (default: 1.5×)
- **🎨 Beautiful Visual Feedback**: Smooth wave animations and optional speed indicator
- **🖥️ Fullscreen Compatible**: Works seamlessly in fullscreen mode
- **🔄 Smart Detection**: Automatically finds and manages video elements
- **🎛️ Non-Intrusive**: Doesn't interfere with Netflix's native controls
- **🔒 Privacy First**: Zero tracking, zero data collection, all settings stored locally
- **☁️ Settings Sync**: Your preferences sync across all Chrome browsers

## 📦 Installation

### From Chrome Web Store (Recommended)
*[Coming soon - link will be added after publication]*

### Manual Installation (Development)
1. Clone or download this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked"
5. Select this repository folder (contains manifest.json)
6. The extension is now loaded and ready to use!

## 🎬 Usage

1. **Navigate to Netflix**: Open any Netflix video
2. **Customize Settings** (optional): Click the extension icon to set your preferred speed
3. **Boost Speed**: Click and hold on the **right third** of the video area
4. **Release**: Let go to instantly return to normal playback speed

**💡 Pro Tip**: The extension only activates on the right side of the screen, so it won't interfere with normal pause/play functionality!

## ⚙️ Settings

Click the extension icon in your Chrome toolbar to access settings:

### Speed Boost Amount
- Range: 1.25× to 5×
- Default: 1.5×
- Slider snaps to preset values for easy selection

### Visual Options
- **Wave Animation**: Smooth animated waves on the right edge (default: enabled)
- **Text Indicator**: Display speed multiplier on screen (default: disabled)

### Reset
- One-click reset to default settings

## 🔒 Privacy & Security

**We take your privacy seriously.**

- ❌ NO data collection
- ❌ NO tracking or analytics
- ❌ NO external server communication
- ✅ Settings stored locally using Chrome's sync storage
- ✅ Open source code - inspect it yourself
- ✅ Minimal permissions (only storage and Netflix access)

See [docs/PRIVACY_POLICY.md](docs/PRIVACY_POLICY.md) for complete details.

## 📁 Repository Structure

```
netflix-speed-boost/           # GitHub repository root
├── manifest.json              # Extension configuration
├── content.js                 # Main extension logic
├── popup.html                 # Settings UI
├── popup.js                   # Settings logic
├── README.md                  # This file
├── .gitignore                 # Git ignore rules
├── docs/                      # Documentation
│   ├── README.md              # Detailed documentation
│   ├── LICENSE                 # MIT License
│   ├── CHANGELOG.md           # Version history
│   ├── PRIVACY_POLICY.md      # Privacy policy
│   ├── guides/                # Step-by-step guides
│   │   ├── QUICK_START.md     # Quick reference
│   │   ├── PUBLISHING_GUIDE.md # Complete publishing guide
│   │   └── SUBMISSION_CHECKLIST.md # Pre-submission checklist
│   ├── store/                 # Chrome Web Store materials
│   │   └── STORE_LISTING.md   # Store listing content
│   └── development/           # Development resources
│       ├── PRODUCTION_READY_SUMMARY.md # Production summary
│       └── generate-icons.sh   # Icon generation script
└── assets/                    # Media assets
    ├── logo.png               # Source logo
    └── icons/                 # Extension icons
        ├── icon16.png         # Toolbar icon (16×16)
        ├── icon48.png         # Extensions page icon (48×48)
        └── icon128.png        # Store listing icon (128×128)
```

## 🚀 Quick Start

1. **Test the Extension**: Load in Chrome for testing
2. **Create Package**: See [docs/guides/QUICK_START.md](docs/guides/QUICK_START.md)
3. **Publish**: Follow [docs/guides/PUBLISHING_GUIDE.md](docs/guides/PUBLISHING_GUIDE.md)

## 📚 Documentation

- **[Complete Documentation](docs/README.md)** - Detailed user guide
- **[Quick Start Guide](docs/guides/QUICK_START.md)** - Get started quickly
- **[Publishing Guide](docs/guides/PUBLISHING_GUIDE.md)** - Chrome Web Store submission
- **[Store Listing](docs/store/STORE_LISTING.md)** - Store listing materials
- **[Privacy Policy](docs/PRIVACY_POLICY.md)** - Privacy and data handling
- **[Changelog](docs/CHANGELOG.md)** - Version history

## 🛠️ Development

### Prerequisites
- Chrome browser
- macOS/Linux (for icon generation script)
- `sips` command-line tool (included on macOS)

### Regenerating Icons
```bash
./scripts/generate-icons.sh assets/logo.png
```

### Building for Production
```bash
# Create Chrome Web Store package
./scripts/generate-chrome-pkg.sh
```

## 📋 Browser Compatibility

- ✅ Google Chrome (Manifest V3)
- ✅ Microsoft Edge (Chromium-based)
- ✅ Brave Browser
- ✅ Any Chromium-based browser with Manifest V3 support

## 🐛 Troubleshooting

### Extension not working?
1. **Refresh the page**: Press F5 or Cmd/Ctrl+R
2. **Check video is playing**: The extension only works on active videos
3. **Hold on the right side**: Remember to hold on the right third of the screen
4. **Check browser console**: Open DevTools (F12) to see if there are any errors

### Speed stuck after release?
This should never happen, but if it does:
1. Refresh the page
2. Reinstall the extension if the problem persists

### Controls not responding?
Make sure you're not holding over Netflix's control bar. The extension automatically detects and ignores control elements.

## 📝 Changelog

### Version 1.0.0 (2025-10-04)
- Initial release
- Customizable speed boost (1.25× to 5×)
- Wave animation visual feedback
- Optional text speed indicator
- Fullscreen support
- Settings sync across devices
- Smart control detection
- Production-ready code with proper error handling

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

### Development Guidelines
- Maintain Manifest V3 compliance
- Keep privacy-first approach (no tracking/analytics)
- Test on actual Netflix content
- Follow existing code style
- Update documentation for new features

## 📄 License

MIT License - feel free to use and modify as needed.

## ⚠️ Disclaimer

This extension is not affiliated with, endorsed by, or sponsored by Netflix, Inc. Netflix is a trademark of Netflix, Inc.

The extension only modifies local playback speed in your browser and does not circumvent any DRM, download content, or violate Netflix's Terms of Service.

## 🌟 Support

If you find this extension useful, please:
- ⭐ Star the repository
- 📝 Leave a review on the Chrome Web Store
- 🐛 Report bugs and suggest features via GitHub Issues
- 📢 Share with fellow Netflix users!

---

**Made with ❤️ for better Netflix viewing**
