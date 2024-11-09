const User = require('../model/user.model');
const authUtil = require('../util/authentication');
const validation = require('../util/validation');
const userDetailsAreValid = require('../util/validation');
const sessionFlash = require('../util/session-flash');

function getSignup(req, res) {
    let sessionData = sessionFlash.getSessionData(req);

    if (!sessionData) {
        sessionData = {
            mobile: '',
            pin1: '',
            pin2: '',
            pin3: '',
            pin4: '',
            confirmPin1: '',
            confirmPin2: '',
            confirmPin3: '',
            confirmPin4: ''

        };
    }
    res.render('client/auth/signup', { inputData: sessionData });
}

async function signup(req, res, next) {
    console.log(req.body);

    const enteredData = {
        mobile: req.body.mobile,
        pin: (req.body.pin1 || '') + (req.body.pin2 || '') + (req.body.pin3 || '') + (req.body.pin4 || ''),
        confirmPin: (req.body.confirmPin1 || '') + (req.body.confirmPin2 || '') + (req.body.confirmPin3 || '') + (req.body.confirmPin4 || '')

    };

    if (
        !validation.userDetailsAreValid(
            req.body.mobile,
            (req.body.pin1 || '') + (req.body.pin2 || '') + (req.body.pin3 || '') + (req.body.pin4 || '')

        ) || !validation.pinIsConfirmed(
            (req.body.pin1 || '') + (req.body.pin2 || '') + (req.body.pin3 || '') + (req.body.pin4 || ''),
            (req.body.confirmPin1 || '') + (req.body.confirmPin2 || '') + (req.body.confirmPin3 || '') + (req.body.confirmPin4 || '')
        )
    ) {
        sessionFlash.flashDataToSession(req, {
            errorMessage: 
                'Please check your input.',
            ...enteredData,
        }, function() {
            res.redirect('/signup');
        });
        return;
    }

    const user = new User(
        req.body.mobile,
        (req.body.pin1 || '') + (req.body.pin2 || '') + (req.body.pin3 || '') + (req.body.pin4 || ''),
        (req.body.confirmPin1 || '') + (req.body.confirmPin2 || '') + (req.body.confirmPin3 || '') + (req.body.confirmPin4 || '')

    );

    try {
        const existsAlready = await user.existsAlready();

        if (existsAlready) {
            sessionFlash.flashDataToSession(req, {
                errorMessage: 'User exists already! Try logging instead!',
                ...enteredData,
            }, function() {
                res.redirect('/signup');
            });
            return;
        }

        await user.signup();
    } catch (error) {
        next(error);
        return;
    }

    res.redirect('/login');
}

function getLogin(req, res) {
    let sessionData = sessionFlash.getSessionData(req);

    if (!sessionData) {
        sessionData = {
            mobile: '',
            pin1: '',
            pin2: '',
            pin3: '',
            pin4: ''
        };
    }

    res.render('client/auth/login', { inputData: sessionData } );
}

async function login(req, res, next) {
    const user = new User(
        req.body.mobile,
        (req.body.pin1 || '') + (req.body.pin2 || '') + (req.body.pin3 || '') + (req.body.pin4 || '')
    );

    let existingUser;
    try {
        existingUser = await user.getUserWithSameMobile();
    } catch (error) {
        next(error);
        return;
    }

    const sessionErrorData = {
        errorMessage: 'Invalid credentials - please double check your mobile and pin',
        mobile: user.mobile,
        pin: user.pin
    };

    if (!existingUser) {
        sessionFlash.flashDataToSession(req, sessionErrorData, function() {
            res.redirect('/login');
        });
        return;
    }

    const pinIsCorrect = await user.hasMatchingPin(existingUser.pin);

    if (!pinIsCorrect) {
        sessionFlash.flashDataToSession(req, sessionErrorData, function() {
            res.redirect('/login');
        });
        return;
    }

    authUtil.createUserSession(req, existingUser, function() {
        res.redirect('/');
    });
}

function logout(req, res) {
    authUtil.destroyUserAuthSession(req);
    res.redirect('/');
}

module.exports = {
    getSignup: getSignup,
    signup: signup,
    getLogin: getLogin,
    login: login,
    logout: logout
};
