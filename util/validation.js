function userDetailsAreValid(mobile, pin) {
    return ( 
        mobile && 
        mobile.trim().length >= 14 && 
        pin && 
        pin.trim().length >= 4 
    );
}

function pinIsConfirmed(pin, confirmPin) {
    return pin === confirmPin;
}

module.exports = {
    userDetailsAreValid: userDetailsAreValid,
    pinIsConfirmed: pinIsConfirmed
};