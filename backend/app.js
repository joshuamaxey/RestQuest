const express = require('express');
require('express-async-errors');
const morgan = require('morgan');
const cors = require('cors');
const csurf = require('csurf');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');

// Create a variable called 'isProduction' that will check if the environment is production or not by checking the 'environment' key in the configuration file

const { environment } = require('./config');
const isProduction = environment === 'production';

// Initialize the express application

const app = express();

// Connect the 'morgan' middleware for logging information about requests and responses

app.use(morgan('dev'));

// Add the 'cookie-parser' middleware for parsing cookies and the express.json middleware for parsing JSON bodies of requrests with a 'content-type' of 'application/json'

app.use(cookieParser());
app.use(express.json());

//! Security Middlewares:

// ONLY allow CORS (Cross-Origin Resource Sharing) in development using the 'cors' middlware. The React frontend will be served from a different server than the Express server. CORS isn't needed in production since all of our React and Express resources will come from the same origin.

if (!isProduction) {
    app.use(cors()); // enablse cors ONLY in development
}

// Enable better overall security with the 'helmet' middlware. Add the 'crossOriginResourcePolicy' to the 'helmet' middlware with a 'policy' of 'cross-origin'. This will allow images with URLs to render in deployment.

app.use(
    helmet.crossOriginResourcePolicy({
        policy: "cross-origin" // helmet helps set headers to better secure your app
    })
);

// Add the 'csurf' middleware and configure it to use cookies.Set the _csurf token and create req.csrfToken method

app.use(
    csurf({
        cookie: {
            secure: isProduction,
            sameSite: isProduction && "Lax",
            httpOnly: true
        }
    })
);

// This csurf middlware will add a _csrf cookie that is HTTP-only (which means it can't be read by JavaScript) to any all server responses. It also adds a method to all requrests (req.csrfToken) that will be set to another cookie (XSRF-TOKEN) later.

// These two cookies work together to provide CSRF (Cross-Site Request Forgery) protection for your application. The XSRF-TOKEN cookie value needs to be send in the header of any request with all HTTP verbes besides GET. This header will be used to validate the _csrf cookie in order to confirm that the request comes from your site and not an unauthorized site.

//^ Now we have set up all of the pre-request middlware. Next, we set up the routes for our Express application. See 'routes' directory in backend folder.

const routes = require('./routes');

app.use(routes);

module.exports = app;
