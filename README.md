# Life Tracker Chrome Extension

A Chrome extension that helps track daily progress in different areas of life using a sidebar interface.

## Features

- Sidebar interface that can be opened from the Chrome toolbar
- Daily tracking of different life areas:
  - Work
  - Health
  - Finances
  - Relationships
  - Happiness
  - Blog
- Color coding for progress tracking:
  - Green: Positive progress
  - Red: Negative progress
  - White: Neutral/No progress
- Local storage for data persistence
- Add new entries for each day
- Edit existing entries

## Installation

1. Clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked" and select the extension directory

## Usage

1. Click the extension icon in Chrome toolbar to open the sidebar
2. Use "Add Day" button to create new entries
3. Click on cells to add text
4. Use color buttons to mark progress status

## Project Structure 

```
life-tracker-extension/
├── manifest.json
├── background.js
├── sidebar.html
├── styles.css
├── script.js
└── icons/
├── icon16.png
├── icon48.png
└── icon128.png
```

## Development

The extension is built using:
- HTML5
- CSS3
- JavaScript
- Chrome Extension APIs

## License

MIT