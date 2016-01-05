#Install

Assuming Node.js and MySQL are running on your machine, follow these steps to install.

1. Close this repository and install npm.

```
git clone https://github.com/utilitymonster/surveyBomb.git
cd surveyBomb
npm install
```

2. Create a new database in MySQL 

3. Set database and port variables

Edit config.js in your text editor to match your database settings (including the database name you created in #2) and your preferred port.

4. Setup database table and admin account

```
node setup.js
```

#Survey

To run app:

```
node index.js
```

#Admin

To access admin area, visit http://localhost:[port]/admin, replacing "port" with the port you entered in config.js.