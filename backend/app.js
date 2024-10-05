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
const routes = require('./routes');
const { ValidationError } = require('sequelize');

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

app.use(routes);

//! Error Handlers (Note that our error-handing middleware goes BELOW our route handlers [below the app.use(routes)])

//& 404 Error Handler

//^ "Resource Not Found ErrorHandler" this doesn't actualy take in an error- it's just regular middlware. It will catch any requests that do not match the routes defiend in app.js and create a server error with a status code of 404. Again- this middlware doesn't take in an error, it takes in requests that are NOT otherwise being handled!

app.use((_req, _res, next) => { // note the underscores here, which mean that we are actually NOT using these arguments in this callback function
    const err = new Error("The requested resource couldn't be found.");
    err.title = "Resource Not Found";
    err.errors = ["The requested resource couldn't be found"]; // any uncaught errors will be pushed into this array
    err.status = 404;
    next(err);
});

//& Sequelize Error Handler

//^ It is often the case that when we attempt to create a record in Sequelize with issues we will often throw a 'ValidationError'. This middleware is intended specifically to catch these errors. It will iterate over the error object and create an array of the relevant error messages.

app.use((err, _req, _res, next) => {
    // Check if the error is a Sequelize error (validationError)
    if (err instanceof ValidationError) {
        err.errors = err.errors.map((e) => e.message); // map our error messages into an array
        err.title = 'Validation error';
    }
    next(err);
})

//& Error Formatter

//^ This error handler will format and send our error response back to the client. Note that this goes at the very end of the file, after all of the error handlers (which in turn are placed after our middlewares, which come after our route handlers)

app.use((err, _req, res, _next) => {
    res.status(err.status || 500);
    console.error(err); // console.log for debugging, comment this out in production
    res.json({
        title: err.title || 'Server Error',
        message: err.message,
        errors: err.errors, // an array of error messages
        stack: isProduction ? null : err.stack // If we're in a production environment, set the 'stack' to null (do not show the stack trace). Otherwise, show the err.stack (show the stack trace)
    });
});

module.exports = app;
