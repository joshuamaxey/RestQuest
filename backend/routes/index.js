// Here we will create an Express router, create a test route, and export the router at the bottom of the file.

const express = require('express');
const router = express.Router();
const apiRouter = require('./api');

//! Test route used to verify that server is set up correctly

// router.get('/hello/world', function (req, res) {
    //     res.cookie('XSRF-TOKEN', req.csrfToken());
    //     res.send('Hello World!');
    // });

    //! Route to allow any developer to re-set the CSRF token cookie 'XSRF-TOKEN'

    router.get("/api/csrf/restore", (req, res) => {
        const csrfToken = req.csrfToken();
        res.cookie("XSRF-TOKEN", csrfToken);
        res.status(200).json({
            'XSRF-Token': csrfToken
        });
    });

router.use('/api', apiRouter);

module.exports = router;

// In this test route, we are setting a cookie on the response object with the name of 'XSRF-TOKEN' to the value of the req.csrfToken method's return value. Then we send the text 'Hello World!' as the body of the request.

//^ Next, add the routes to the Express application by importing with the other imports in backend/app.js and connecting the exported router to app after all the middlwares. (see app.js)
