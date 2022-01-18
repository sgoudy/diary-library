import AutoLoader from '../auto-loader.js'
import Database from '../database/database.js'
import Express from 'express'
import Path from 'path'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { dirname } from 'path'
import { fileURLToPath } from 'url'
import multer from 'multer'

const BaseServer = function (serverType) {
  // Configure the server correctly.
  serverType = serverType || 'local'
  serverType = serverType.toString().toUpperCase()
  switch (serverType) {
    case 'CLOUD':
    case 'LOCAL':
    case 'TEST':
      break
    case 'TESTING':
      serverType = 'TEST'
      break
    default:
      serverType = 'LOCAL'
  }

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const app = Express();
  const autoLoad = new AutoLoader();
  const DB = Database(serverType);
  const DBCon = DB.getConnection();
  const Multipart = multer( { dest: 'uploads/' } );
  const port =  process.env.PORT || process.env.DL_CLOUD_PORT || 3001;
  const Router = Express.Router();
  let ExpressServer = null;

  /**
   * Returns the status of the database connection.
   *
   * @return {Boolean} True connected, false disconnected.
   */
  const dbReady = function () {
    if (DB) {
      return DB.ready()
    }
    return false
  }

  /**
   * Return the Express servers listening address.
   *
   * @return {String} The Express Server's listening address.
   */
  const getAddress = function () {
    if (process.env.DL_CLOUD_ADDRESS) {
      return process.env.DL_CLOUD_ADDRESS;
    }
    return `http://127.0.0.1:${port}`
  }

  /**
   * Initialize the servers settings and load all the routes.
   */
  const initialize = async function () {
    // needed for setting cookies
    var corsOptions = {
      origin: '*',
      credentials: true,
    }

    // Setup needed middleware.
    app.use(cors(corsOptions)) // Allow cross-origin requests from all; should change later for security.
    app.use(Express.json()) // Support JSON-encoded bodies.
    app.use(Express.urlencoded({ extended: true })) // Support URL-encoded bodies.
    app.use(cookieParser('be70416c-2bb4-11ec-8d3d-0242ac130003'))

    // Load all route files from the routes directory.
    autoLoad.setDirectory(Path.join(__dirname, 'routes'))
    await autoLoad.loadModules(module => {
      if (module.default) {
        module.default(Router, DBCon, Multipart);
      }
    })

    // Prepend api to the start of all the loaded routes.
    app.use('/api', Router);

    // If in production mode and NOT requesting an API route:
    if (process.env.DL_CLOUD_ADDRESS) {

      // Attempt to server up the front-end page from React's static build.
      app.use(Express.static(Path.join(__dirname, "../client", 'build')));

      // Force users to the home page; we don't have a 404 page.
      app.use( (req, res, next) => {
        if (!req.url.match(/api\/*/g)) {
          res.sendFile(Path.join(__dirname, "../client", "build", "index.html"));
        } else {
            // This was actually an API route, let the API 404 take over.
            next();
        }
      });

    }

    // Default 404 for unanswered API requests.
    app.use((req, res, next) => {
      res.status(404)
      res.json({
        message: `Cannot ${req.method} ${req.originalUrl}`,
        status: false,
      })
    });

    // Start the Express routing server.
    ExpressServer = app.listen(port, () => {
      const mode = serverType.toLowerCase();
      let address = `http://127.0.0.1:${port}`;
      if(process.env.DL_CLOUD_ADDRESS) {
        address = process.env.DL_CLOUD_ADDRESS;
      }
      console.log(
        `Express Server (${mode} mode) listening at: ${address}`,
      )
      },
    );
  }

  /**
   * Stop the Express server.
   */
  const stop = function () {
    if (ExpressServer) {
      console.log('Express Server brought offline.')
      DB.stop()
      ExpressServer.close()
    }
  }

  /**
   * Testing only method. Allows instant wiping of the database by dropping all collections.
   */
  const wipeDatabase = async function () {
    if (serverType !== 'TEST') {
      console.log('Refused to wipe database! Database is not in testing mode.')
      return
    }
    await DBCon.db.dropDatabase()
    console.log('Successfully wiped and reset the database to a clean state.')
  }

  initialize()

  return {
    close: stop,
    dbReady,
    getAddress,
    stop,
    wipeDatabase,
  }
}

export default BaseServer
