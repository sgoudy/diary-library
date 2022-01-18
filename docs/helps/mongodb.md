# MongoDB Setup & Usage

## Install

You will first need to visit [https://docs.mongodb.com/manual/installation/](https://docs.mongodb.com/manual/installation/) and install the **community version** of MongoDB for your operating system.

If your installing on Windows you should be prompted to install MongoDB Compass as well during the install. If your using a different operating system or forgot to install this you can do so here [https://www.mongodb.com/try/download/compass](https://www.mongodb.com/try/download/compass).

## Configure

You should use the standard settings for this installation. On Windows (and possibly Mac) you may be prompted to auto start the MongoDB service on login. Choose the option you prefer, I personally don't for security. I manually start the service when I need it.

On Linux you will most likely have a permissions issue preventing you from starting the service. Assuming you did a default install this will solve your issues:

```bash
sudo chown -R mongodb:mongodb /var/lib/mongodb
sudo chown mongodb:mongodb /tmp/mongodb-27017.sock
```

[Source](https://askubuntu.com/a/1103513/1041047)

## Adding Database Tables

Tables are added via schema objects. Take a look at the `userSchema` for example: `backend/schemas/userSchema.js`

This file and all other Schema files should be required in the `db.js` file. They will then be added as a table to the `library` database.

## Start & Stop

Depending on how you configured your installation, the MongoDB service may need to be manually started and stopped as desired.

### On Linux

```bash
// Start
sudo systemctl start mongod
// Check status or errors
sudo systemctl status mongod
// Stop
sudo systemctl stop mongod
// Restart
sudo systemctl restart mongod
```

or on older Linux distros:

```bash
// Start
sudo servicve start mongod
// Check status or errors
sudo servicve status mongod
// Stop
sudo servicve stop mongod
// Restart
sudo servicve restart mongod
```

### Other Operating Systems

Please refer to the _Run MongoDB Community Edition_ section of your respective manual. See Manuals section below.

## Coding

Remember for your code to work you must turn on the MongoDB service before attempting to start the application.

## Viewing the Database

**UPDATE:** We're using Mongo Cloud now. This is only needed if you use the local database configuration and want to view changes you have made to your local database.

Launch the MongoDB Compass application. The first time you use the application click on _Fill in connection fields individually_ and enter `127.0.0.1` as the hostname. The port should remain as `27017`. Next time you use MongoDB Compass the connection should be listed in the left sidebar.

Once connected you should see all Mongo Databases on your computer. Some are defaults needed by Mongo, ours is called `library`.

**REMINDER:** MongoDB Compass will not work unless you started the MongoDB service before attempting to connect to the database.

## Manuals

[Windows](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/#overview)

[Mac](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/#overview)

[Linux](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/#overview) - Ubuntu derived

[All Others](https://docs.mongodb.com/manual/tutorial/)
