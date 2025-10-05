# Changelog

All notable changes to Netflix Speed Boost will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.2] - 2025-01-27

### Fixed
- **Scope Restriction**: Extension now only works on Netflix watch pages, not browse pages
- **Browse Page Interference**: Prevented extension from triggering on video previews/trailers on browse pages

### Technical
- Added URL validation to ensure extension only initializes on `/watch/*` pages
- Enhanced route change handling to respect page type boundaries
- Improved DOM observer to only run on watch pages

## [1.1.1] - 2025-01-27

### Added
- **Automatic Settings Initialization**: Extension now works immediately after installation without requiring popup interaction
- **Playback State Validation**: Speed boost is now blocked when video is paused for better user experience

### Fixed
- **First Install Issue**: Resolved problem where extension required opening popup to activate on first install
- **Paused Video Handling**: Prevented accidental speed boost activation on paused videos

### Technical
- Added automatic default settings persistence to Chrome storage on first run
- Implemented video playback state checking in both mouse and keyboard handlers
- Enhanced initialization flow for seamless first-time user experience

## [1.1.0] - 2025-10-04

### Added
- **Customizable Key Binding System**: Set any key as your speed boost trigger (default: 'L' key)
- **Interactive Key Capture Interface**: Click "Set Key" to capture any key press in settings
- **Netflix Key Conflict Prevention**: Smart validation prevents selecting Netflix's native keys
- **Key Conflict Warning**: Visual feedback when attempting to use conflicting keys
- **Dual Activation Methods**: Both click-and-hold and custom key hold supported simultaneously

### Changed
- Replaced spacebar activation with customizable key binding to avoid Netflix play/pause conflict
- Improved settings UI with key binding section
- Enhanced user experience with flexible key binding options

### Fixed
- Resolved conflict with Netflix's spacebar play/pause functionality
- Improved key validation to prevent conflicts with input fields and modifier keys

### Technical
- Added key capture system with global event listeners
- Implemented dynamic event binding for custom keys
- Added Netflix native key detection and validation
- Real-time settings updates without page reload

## [1.0.0] - 2025-10-04

### Added
- Initial release of Netflix Speed Boost
- Hold-to-speed-boost functionality on right third of video area
- Customizable speed boost from 1.25× to 5×
- Beautiful wave animation visual feedback
- Optional text speed indicator
- Modern, responsive settings popup
- Fullscreen mode support
- Smart control detection to avoid interfering with Netflix UI
- SPA navigation handling for seamless experience
- Settings sync across Chrome browsers
- Production-ready error handling
- Comprehensive privacy policy
- Chrome Web Store listing materials
- Complete documentation

### Technical
- Manifest V3 compliance
- Content script injection on Netflix pages only
- Chrome storage sync API for settings
- MutationObserver for dynamic video detection
- Event delegation for optimal performance
- Non-blocking event handlers

### Privacy
- Zero data collection
- Zero tracking or analytics
- Zero external network requests
- All settings stored locally

## Future Considerations

Potential features for future releases:
- Keyboard shortcuts for speed control
- Per-show speed preferences
- Additional visual feedback styles
- Support for other streaming platforms
- Gesture customization options

---

**Note:** This extension is not affiliated with Netflix, Inc.

