#Install

Assuming Node.js and MySQL are running on your machine, follow these steps to install.

* Close this repository and install npm.

```
git clone https://github.com/utilitymonster/surveyBomb.git
cd surveyBomb
npm install
```

* Create a new database in MySQL 

* Set database and port variables

Edit config.js in your text editor to match your database settings (including the database name you created in #2) and your preferred port.

* Setup database table and admin account

```
node setup.js
```

#Survey

To run app:

```
node index.js
```

Then visit http://localhost:[port], replacing "port" with the port you entered in config.js.

#Admin

To access admin area, visit http://localhost:[port]/admin, replacing "port" with the port you entered in config.js.