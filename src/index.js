/* Author: Yordi Muñoz Vazquez */
/* Subject: Internet Programming - CUCEI / UdeG */
/* Work 07: Electron JS (Product Application) */

const { app, BrowserWindow, Menu, ipcMain } = require('electron');

const url = require('url');
const path = require('path');
const { contextIsolated } = require('process');

let mainWindow;
let newProductWindow;

var isDev = process.env.APP_DEV ? (process.env.APP_DEV.trim() == "true") : false;

if (isDev) {
    require('electron-reload')(__dirname, {
        electron: path.join(__dirname, 'node_modules', '.bin', 'electron')
    });
}


app.on('ready', () => {

    mainWindow = new BrowserWindow({
        width: 1020,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            nodeIntegrationInWorker: true, // Solutions: Require not defined
            contextIsolation: false // Solutions: Require not defined
        }
    });

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'views/index.html'),
        protocol: 'file',
        slashes: true
    }))

    const mainMenu = Menu.buildFromTemplate(templateMenu);
    Menu.setApplicationMenu(mainMenu);

    mainWindow.on('closed', () => {
        app.quit();
    });

});

// Add New Product Window
function addNewProductWindow() {
    newProductWindow = new BrowserWindow({
        width: 400,
        height: 360,
        title: 'Adding a new product',
        webPreferences: {
            nodeIntegration: true,
            nodeIntegrationInWorker: true, //Solutions: Require not defined
            contextIsolation: false //Solutions: Require not defined
        }
    });
    newProductWindow.setMenu(null);

    newProductWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'views/new-product.html'),
        protocol: 'file',
        slashes: true
    }));
    newProductWindow.on('closed', () => {
        newProductWindow = null;
    });
}

ipcMain.on('product:new', (e, newProduct) => {
    console.log(newProduct);
    mainWindow.webContents.send('product:new', newProduct);
    newProductWindow.close();
});


const templateMenu = [{
    label: 'File',
    submenu: [{
            label: 'Add a New Product',
            accelerator: 'Ctrl+N',
            click() {
                addNewProductWindow();
            }
        },
        {
            label: 'Remove All Products',
            click() {
                mainWindow.webContents.send('products:remove-all');
            }
        },
        {
            label: 'Exit',
            accelerator: process.platform == 'darwin' ? 'command+Q' : 'Ctrl+Q',
            click() {
                app.quit();
            }
        }
    ]
}];

if (process.platform === 'darwin') {
    templateMenu.unshift({
        label: app.getName(),
    });
};

if (process.env.NODE_ENV !== 'production') {
    templateMenu.push({
        label: 'DevTools',
        submenu: [{
                label: 'Show/Hide Dev Tools',
                accelerator: process.platform == 'darwin' ? 'Comand+D' : 'Ctrl+D',
                click(item, focusedWindow) {
                    focusedWindow.toggleDevTools();
                }
            },
            {
                role: 'reload'
            }
        ]
    })
}