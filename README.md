
---

*This project was developed using Cursor and represents a first trial of using an all-AI coding environment for complete software development.*

---
# Netflix Speed Boost

<div align="center">
  <img src="assets/logo.png" alt="Netflix Speed Boost Logo" width="128" height="128">
</div>

A Chrome extension that allows you to temporarily boost Netflix playback speed by holding down on the video area.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Manifest](https://img.shields.io/badge/manifest-v3-green)
![License](https://img.shields.io/badge/license-MIT-blue)

## 🎯 Features

- **🚀 Instant Speed Boost**: Hold on the right side of any video OR hold a custom key to temporarily increase playback speed
- **⌨️ Customizable Key Binding**: Set any key as your speed boost trigger (default: 'L' key)
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
2. **Customize Settings** (optional): Click the extension icon to set your preferred speed and key binding
3. **Boost Speed**: Either:
   - Click and hold on the **right third** of the video area, OR
   - Hold your custom key (default: 'L')
4. **Release**: Let go to instantly return to normal playback speed

**💡 Pro Tip**: The extension only activates on the right side of the screen or with your custom key, so it won't interfere with normal pause/play functionality!

## ⚙️ Settings

Click the extension icon in your Chrome toolbar to access settings:

### Speed Boost Amount
- Range: 1.25× to 5×
- Default: 1.5×
- Slider snaps to preset values for easy selection

### Key Binding
- **Custom Key**: Set any key as your speed boost trigger (default: 'L')
- **Interactive Setup**: Click "Set Key" to capture any key press
- **Smart Validation**: Prevents conflicts with input fields and modifier keys

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


## 🚀 Quick Start

1. **Test the Extension**: Load in Chrome for testing
2. **Install**: Follow the manual installation steps above
3. **Customize**: Click the extension icon to set your preferred speed and key binding

## 📚 Documentation

- **[AI Context](docs/AI_CONTEXT.md)** - Development context for AI tools
- **[Privacy Policy](docs/PRIVACY_POLICY.md)** - Privacy and data handling
- **[Changelog](docs/CHANGELOG.md)** - Version history

## 🛠️ Development

### Prerequisites
- Chrome browser
- macOS/Linux (for icon generation script)
- `sips` command-line tool (included on macOS)

### Key Binding Development
- **Key Capture Logic**: `popup.js` - Interactive key binding system
- **Key Handling**: `content.js` - Custom key event handlers
- **Settings Management**: Chrome sync storage for key preferences

## 📋 Browser Compatibility

- ✅ Google Chrome (Manifest V3)
- ✅ Microsoft Edge (Chromium-based)
- ✅ Brave Browser
- ✅ Any Chromium-based browser with Manifest V3 support

## 🐛 Troubleshooting

### Extension not working?
1. **Refresh the page**: Press F5 or Cmd/Ctrl+R
2. **Check video is playing**: The extension only works on active videos
3. **Try both methods**: Hold on the right third of the screen OR hold your custom key
4. **Check key binding**: Make sure your custom key is set correctly in settings
5. **Check browser console**: Open DevTools (F12) to see if there are any errors

### Speed stuck after release?
This should never happen, but if it does:
1. Refresh the page
2. Reinstall the extension if the problem persists

### Controls not responding?
Make sure you're not holding over Netflix's control bar. The extension automatically detects and ignores control elements.

## 📝 Changelog

### Version 1.1.0 (Latest)
- **NEW**: Customizable key binding system (default: 'L' key)
- **NEW**: Interactive key capture interface in settings
- **NEW**: Smart key validation to prevent conflicts
- **IMPROVED**: Dual activation methods (click + key hold)
- **IMPROVED**: Better user experience with flexible key options
- **FIXED**: Resolved conflict with Netflix's spacebar play/pause functionality

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

