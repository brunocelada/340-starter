## Getting Started

This document is intended to get you started quickly in building a backend driven Node.js application complete with pages and content, backend logic and a PostgreSQL database for data storage.
## Prerequisites

The only prerequisite software required to have installed at this point is Git for version control and a code editor - we will use VS Code (VSC).

## Package Management

The foundation of the project development software is Node. While functional, Node depends on "packages" to add functionality to accomplish common tasks. This requires a package manager. Three common managers are NPM (Node Package Manager), YARN, and PNPM. While all do the same thing, they do it slightly differently. We will use PNPM for two reasons: 1) All packages are stored on your computer only once and then symlinks (system links) are created from the package to the project as needed, 2) performance is increased meaning that when the project builds, it does so faster.
You will need to either install or activate PNPM before using it. See https://pnpm.io/

## Install the Project Dependencies

1. Open the downloaded project folder (where this file is located) in VS Code (VSC).
2. Open the VSC terminal: Terminal > New Window.
3. Run the following command in the terminal:

    pnpm install

4. The first time it may take a few minutes, depending on the speed of your computer and the speed of your Internet connection. This command will instruct PNPM to read the package.json file and download and install the dependencies (packages) needed for the project. It will build a "node_modules" folder storing each dependency and its dependencies. It should also create a pnpm-lock.yaml file. This file should NEVER be altered by you. It is an internal file (think of it as an inventory) that PNPM uses to keep track of everything in the project.

## Start the Express Server

With the packages installed you're ready to run the initial test.
1. If the VSC terminal is still open use it. If it is closed, open it again using the same command as before.
2. Type the following command, then press Enter:

    pnpm run dev

3. If the command works, you should see the message "app listening on localhost:5500" in the console.
4. Open the package.json file.
5. Note the "Scripts" area? There is a line with the name of "dev", which tells the nodemon package to run the server.js file.
6. This is the command you just ran.
7. Open the server.js file.
8. Near the bottom you'll see two variables "Port" and "Host". The values for the variables are stored in the .env file.
9. These variables are used when the server starts on your local machine.

## Move the demo file

When you installed Git and cloned the remote repository in week 1, you should have created a simple web page.
1. Find and move that simple web page to the public folder. Be sure to note its name.
## Test in a browser

1. Go to http://localhost:5500 in a browser tab. Nothing should be visible as the server has not been setup to repond to that route.
2. Add "/filename.html" to the end of the URL (replacing filename with the name of the file you moved to the public folder).
3. You should see that page in the browser.


## DATOS AGREGADOS
Al utilizar una computadora distinta, abrir la carpeta donde se encuentre el proyecto
y ejecutar
    pnpm run setup
    pnpm run dev

Asegurarse que en el package.json se encuentren las siguientes línea:
    "scripts": {
    "setup": "pnpm install && pnpm rebuild",
    "start": "node server.js",
    "dev": "nodemon server.js"
    }
Esto instalará las dependencias y solucionará problemas comunes automáticamente.

Cada vez que se reinicie la base de datos, se debe cambiar el valor
DATABASE_URL="..." en el archivo .env por el valor que aparece en Render.com 
como External Database URL. 
También cambiarlo en el servidor (ws) de Render, pero con el Internal Database URL.

Verificar si se agregaron los siguientes paquetes:
pnpm add express-session connect-pg-simple express-messages connect-flash
pnpm add body-parser
pnpm add express-validator
pnpm add bcryptjs
pnpm add jsonwebtoken cookie-parser

## W06 Assignment: Final Enhancement
The new feature allows, within the detailed view of each vehicle, to generate a link that leads to a new page to compare the information of 2 vehicles simultaneously. 2 tables are dynamically built with the respective information and allows the user to visually compare the year, price, mileage, etc., of 2 vehicles selected within the inventory.
(In the README.md file you can obtain more details of the changes.)

1. Database: The getVehicleById() [line 31, inventory-model.js file] and getInventoryByClassificationId() [line 13, inventory-model.js file] functions from the models file were used to obtain data from the database.

2. Model: The inventory-model.js file was not modified, but already created functions were used. However, functionalities were added in the utilities/index.js file, on lines 80, 102, 105 and a whole new function called buildVehicleList() on line 125 of the same file.
The public/js/compare.js file was also added with functions that allow processing the changes and information necessary for the functionality of the new view.

3. Controller: the new buildCompareVehiclesView() functionality was added on line 412 of the invController.js file, and the new getVehicleJSON() functionality was added on line 448.

4. View: Two new routes were added to the inventoryRoute.js file to build the vehicle comparison view (line 102) and obtain the list of vehicles through JSON processing (line 105).
The inventory/compare.ejs file was also added to create the desired view.

5. Data Validation: Line 67 of the inventoryRoute.js file was modified to allow the vehicle comparison functionality to be available to any user, not just to users with special permissions.

6. Error Handling: All routes, processes, functions, and tools included proper error handling, allowing the necessary information to be displayed on the console or screen.
