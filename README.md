# Gmail Dark Mode Chrome Extension

A Chrome extension that applies a dark theme to Gmail for a more comfortable viewing experience.

## Features

- Automatic dark theme for Gmail
- Carefully crafted dark colors that are easy on the eyes
- Works with Gmail's dynamic content loading
- Clean popup interface with status information
- Lightweight and fast

## Installation

1. Clone or download this repository
2. Open Chrome and go to `chrome://extensions/` or `brave://extensions/` for Brave
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the extension folder
5. The Gmail Dark Mode extension will be added to Chrome (I promise theres no malware in this yet)

## Usage

1. Navigate to [Gmail](https://mail.google.com)
2. The dark theme will automatically be applied
3. Click the extension icon in your toolbar to see status and refresh if needed

## Files Structure

- `manifest.json` - Extension configuration
- `dark-mode.css` - Dark theme styles for Gmail
- `content.js` - Content script that applies the theme
- `popup.html` - Extension popup interface
- `popup.js` - Popup functionality
- `icons/` - Extension icons (16px, 48px, 128px)

## Development

To modify the dark theme:
1. Edit `dark-mode.css` to change colors and styling
2. Modify `content.js` for dynamic behavior
3. Update `popup.html` and `popup.js` for popup interface changes

## Colors Used

- Background: `#1a1a1a` (dark gray)
- Secondary background: `#2d2d30` (slightly lighter gray)
- Text: `#e8eaed` (light gray)
- Links: `#8ab4f8` (light blue)
- Accent: `#1f65d1` (Gmail blue)

## Browser Compatibility

This extension is designed for Chrome and Chromium-based browsers using Manifest V3.

## License

See LICENSE file for details.
