require('dotenv').config();
const path = require('path');
const express = require('express');
const expressSession = require('express-session');
const csrf = require('csurf');

const createSessionConfig = require('./config/session');
const db = require('./data/database');
const { connectToDatabase } = require('./data/database');
const addCsrfTokenMiddleware = require('./middlewares/csrf-token');
const errorHandlerMiddleware = require('./middlewares/error-handler');
const checkAuthStatusMiddleware = require('./middlewares/check-auth');
const authRoutes = require('./routes/auth.routes');
const homeRoutes = require('./routes/home.routes');
const adminRoutes = require('./routes/admin.routes');


const app = express();


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static('public'));
app.use('/products/assets', express.static('product-data'));
app.use(express.urlencoded( { extended: false }));

const sessionConfig = createSessionConfig();

app.use(expressSession(sessionConfig));
app.use(csrf());

app.use(addCsrfTokenMiddleware);
app.use(checkAuthStatusMiddleware);

app.use(authRoutes);
app.use(homeRoutes);
app.use('/admin', adminRoutes);

app.use(errorHandlerMiddleware);

db.connectToDatabase()
    .then(function () {
        const PORT = process.env.PORT;
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch(function(error) {
        console.log('Failed to connect to the database!');
        console.log('error');
    });