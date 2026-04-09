const { app, BrowserWindow, WebContentsView, shell, screen } = require('electron');

const sites = [
    'https://twitter.com/notifications',
    'https://twitter.com/i/lists/168108242',
    'https://twitter.com/i/lists/132220062',
    'https://twitter.com/i/lists/1060242355968770048',
    'https://twitter.com/i/lists/1571131868820512769',
    'https://indieweb.social',
    'https://indieweb.social/lists/645',
    'https://indieweb.social/lists/776',
];

const columnConfig = {
    offset: 40,
    buffer: 10,
    extraWidth: 0,
    scaleFactor: 0.8
};

const viewWebPreferences = {
    nodeIntegration: false,
    contextIsolation: true,
    sandbox: true
};

let mainWindow;
let views = [];

function computeLayout(windowWidth, windowHeight, siteCount) {
    const baseViewWidth = windowWidth / siteCount;
    const actualViewWidth = baseViewWidth + columnConfig.extraWidth + 100;
    return Array.from({ length: siteCount }, (_, index) => {
        const xPosition = (actualViewWidth - columnConfig.extraWidth) * index
            - columnConfig.offset * index
            + columnConfig.buffer * index;
        return {
            x: Math.round(xPosition),
            y: 0,
            width: Math.round(actualViewWidth + columnConfig.offset - columnConfig.buffer),
            height: windowHeight
        };
    });
}

function createMainView() {
    if (mainWindow) return;

    const primaryDisplay = screen.getPrimaryDisplay();
    const { width: screenWidth, height: screenHeight } = primaryDisplay.workAreaSize;

    mainWindow = new BrowserWindow({
        width: Math.round(screenWidth * 0.9),
        height: Math.round(screenHeight * 0.9),
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            sandbox: true
        }
    });

    mainWindow.loadFile('index.html');

    const { width: winWidth, height: winHeight } = mainWindow.getBounds();
    const bounds = computeLayout(winWidth, winHeight, sites.length);

    sites.forEach((site, index) => {
        const view = new WebContentsView({ webPreferences: viewWebPreferences });
        mainWindow.contentView.addChildView(view);

        view.setBounds(bounds[index]);
        view.webContents.loadURL(site);

        view.webContents.on('did-finish-load', () => {
            const transform = index !== 0
                ? `translateX(-${columnConfig.offset}px) scale(${columnConfig.scaleFactor})`
                : `scale(${columnConfig.scaleFactor})`;
            view.webContents.executeJavaScript(
                `document.body.style.transform = '${transform}';`
            );
        });

        // Only intercept cross-origin navigation; allow in-site clicks (tweets, toots)
        view.webContents.on('will-navigate', (event, url) => {
            try {
                const currentOrigin = new URL(view.webContents.getURL()).origin;
                const targetOrigin = new URL(url).origin;
                if (targetOrigin !== currentOrigin) {
                    event.preventDefault();
                    shell.openExternal(url);
                }
            } catch {
                // Allow navigation if URL parsing fails
            }
        });

        // Handle target="_blank" links
        view.webContents.setWindowOpenHandler(({ url }) => {
            shell.openExternal(url);
            return { action: 'deny' };
        });

        views.push(view);
    });

    mainWindow.on('resize', () => {
        const { width, height } = mainWindow.getBounds();
        const newBounds = computeLayout(width, height, sites.length);
        views.forEach((view, i) => {
            view.setBounds(newBounds[i]);
        });
    });

    mainWindow.on('closed', () => {
        views.forEach(view => {
            if (!view.webContents.isDestroyed()) {
                view.webContents.destroy();
            }
        });
        views = [];
        mainWindow = null;
    });
}

app.whenReady().then(() => {
    createMainView();
    app.on('activate', createMainView);
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
