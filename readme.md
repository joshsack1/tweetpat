
# Tweetpat 🐦

Tweetpat is a simple Electron app designed to display multiple Twitter/X 
and Mastodon pages side by side. I'm trying to replicate my own usage of 
tweetdeck, not reimplement all of its features.

## Features
- View up to eight Twitter/X or Mastodon URLs in adjacent columns.
- In-site navigation works within each column (click tweets, threads, toots).
- External links open in your default system browser.
- Columns reflow automatically when the window is resized.

## Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (with npm)

### Installation
1. Clone the repository:
   ```
   git clone https://github.com/pdennis/tweetpat.git
   ```
2. Navigate to the project directory:
   ```
   cd tweetpat
   ```
3. Install the dependencies:
   ```
   npm install
   ```

### Running the App
After installation, you can run Tweetpat using:
```
npm start
```

## Customizing URLs

To customize the URLs displayed by Tweetpat:

1. Open the `main.js` file.
2. Locate the `sites` array, which contains the default URLs:
   ```javascript
   const sites = [
       'https://twitter.com/notifications',
       // ... other URLs ...
   ];
   ```
3. Replace the existing URLs with your desired Twitter/X or Mastodon URLs. 
   Make sure to retain the structure of the array.
4. Save the file and run the app.

## Contributing

We welcome contributions! If you find a bug or would like to add a new 
feature, feel free to create a pull request.

## License

MIT License. See [LICENSE](LICENSE) for more information.
