# Netflix Speed Boost - Complete Documentation

This is the comprehensive documentation for the Netflix Speed Boost Chrome extension.

## 📚 Documentation Structure

### 🎯 User Documentation
- **[Quick Start Guide](guides/QUICK_START.md)** - Get up and running quickly
- **[Privacy Policy](PRIVACY_POLICY.md)** - How we handle your data
- **[Changelog](CHANGELOG.md)** - Version history and updates

### 🚀 Publishing & Store
- **[Publishing Guide](guides/PUBLISHING_GUIDE.md)** - Complete Chrome Web Store submission walkthrough
- **[Submission Checklist](guides/SUBMISSION_CHECKLIST.md)** - Pre-submission checklist
- **[Store Listing](store/STORE_LISTING.md)** - Chrome Web Store listing materials

### 🛠️ Development
- **[Production Ready Summary](development/PRODUCTION_READY_SUMMARY.md)** - What makes this production-ready
- **[Icon Generator](development/generate-icons.sh)** - Script to regenerate icons from source

## 🎬 How It Works

Netflix Speed Boost allows you to temporarily increase playback speed by holding on the right side of any Netflix video. Release to return to normal speed.

### Key Features
- **Hold to Speed**: Click and hold on the right third of the video
- **Customizable Speed**: Choose from 1.25× to 5× (default: 1.5×)
- **Visual Feedback**: Beautiful wave animations and optional speed indicator
- **Smart Detection**: Automatically finds active videos
- **Non-Intrusive**: Doesn't interfere with Netflix controls
- **Privacy First**: Zero data collection, all settings stored locally

## ⚙️ Settings

Access settings by clicking the extension icon in your Chrome toolbar:

### Speed Boost Amount
- Range: 1.25× to 5×
- Default: 1.5×
- Slider snaps to preset values

### Visual Options
- **Wave Animation**: Smooth animated waves (default: enabled)
- **Text Indicator**: Display speed multiplier (default: disabled)

## 🔒 Privacy & Security

**We take your privacy seriously.**

- ❌ NO data collection
- ❌ NO tracking or analytics  
- ❌ NO external server communication
- ✅ Settings stored locally using Chrome's sync storage
- ✅ Open source code - inspect it yourself
- ✅ Minimal permissions (only storage and Netflix access)

## 🛠️ Technical Details

- **Manifest Version**: 3 (latest Chrome extension standard)
- **Permissions**: `storage` (for saving preferences)
- **Host Permissions**: `https://www.netflix.com/*` (to interact with videos)
- **Content Script**: Runs on Netflix pages only
- **Architecture**: 
  - Smart video element detection
  - SPA navigation handling
  - Fullscreen API support
  - MutationObserver for DOM changes
  - Non-blocking event handlers

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

## 🔧 Development

### Prerequisites
- Chrome browser
- macOS/Linux (for icon generation script)
- `sips` command-line tool (included on macOS)

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