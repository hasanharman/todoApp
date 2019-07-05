const electron = require('electron');
const url = require('url');
const path = require('path');

const {
    app,
    BrowserWindow,
    Menu,
    ipcMain
} = electron;

let mainWindow, addWindow;
let todoList = [];

app.on('ready', () => {

    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        },
    });

    mainWindow.setResizable(false);

    mainWindow.loadURL(
        url.format({
            pathname: path.join(__dirname, "pages/mainWindow.html"),
            protocol: "file:",
            slashes: true
        })
    );

    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    Menu.setApplicationMenu(mainMenu);

    // Exit Btn
    ipcMain.on("todo:close", () => {
        app.quit();
        addWindow = null;
    });

    //New TODO Pencere Eventleri
    ipcMain.on("newTodo:close", () => {
        addWindow.close();
        addWindow = null;
    });

    ipcMain.on("newTodo:save", (err, data) => {
        if (data) {
            let todo = {
                id: todoList.length + 1,
                text: data.todoValue
            };
            todoList.push(todo)

            mainWindow.webContents.send('todo:addItem', todo)

            if (data.ref == 'new') {
                addWindow.close();
                addWindow = null;
            }

        }
    });
});


const mainMenuTemplate = [{
    label: "File",
    submenu: [{
            label: "add new todo",
            click() {
                createWindow();
            }
        },
        {
            label: "delete all",
        },
        {
            label: "exit",
            accelerator: process.platform == "darwin" ? "Command+Q" : "Ctrl+Q",
            role: "quit"
        }
    ]
}, ]

if (process.platform == "darwin") {
    mainMenuTemplate.unshift({
        label: app.getName(),
        role: "TODO"
    })
}

if (process.env.NODE_ENV !== "production") {
    mainMenuTemplate.push({
        label: "Dev Tools",
        submenu: [{
                label: "Open Dev Tools",
                click(item, focusedWindow) {
                    focusedWindow.toggleDevTools();
                }
            },
            {
                label: "Reload",
                accelerator: process.platform == "darwin" ? "Command+R" : "Ctrl+R",
                role: "reload"
            }
        ]
    })
}

function createWindow() {
    addWindow = new BrowserWindow({
        width: 480,
        height: 178,
        title: "New window",
        frame: false,
    });

    addWindow.setResizable(false);

    addWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'pages/newTodo.html'),
        protocol: 'file',
        slashes: true
    }));

    addWindow.on('close', () => {
        addWindow = null;
    })

}

function getTodoList() {
    //return todoList;
    console.log(todoList);
}