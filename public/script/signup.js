function addCountryCode(input) {
    const mobileNumber = input.value;


    if (mobileNumber === '+91-' || mobileNumber.length === 0) {
        input.value = '';
        return;
    }

    if (mobileNumber.length > 0 && !mobileNumber.startsWith('+91-')) {
        input.value = '+91-' + mobileNumber;
    }
}


function validateMobileNumber(input) {
    const mobileNumber = input.value;
    
    const numberWithoutCode = mobileNumber.replace('+91-', '');
    
    if (numberWithoutCode.length !== 10 || isNaN(numberWithoutCode)) {
        console.log("Invalid mobile number");
        document.getElementById('mobile-error').style.display = 'block';
    } else {
        console.log("Valid mobile number");
        document.getElementById('mobile-error').style.display = 'none';
    }
}
//---------------------------------------------------------------------------------------------------------------//
function enforceNumericInput(event) {
    const value = event.target.value;
    event.target.value = value.replace(/[^0-9]/g, '');
}

document.querySelectorAll('.pin-input').forEach(input => {
    input.addEventListener('input', enforceNumericInput);
});



//------------------------------------------------------------------//

function togglePin(inputIdPrefix, toggleId) {
    const inputFields = [
        document.getElementById(inputIdPrefix + '1'),
        document.getElementById(inputIdPrefix + '2'),
        document.getElementById(inputIdPrefix + '3'),
        document.getElementById(inputIdPrefix + '4')
    ];

    const toggleIcon = document.getElementById(toggleId);
    
    const isPassword = inputFields[0].type === 'password';
    
    inputFields.forEach(input => {
        input.type = isPassword ? 'text' : 'password';
    });

    toggleIcon.innerText = isPassword ? '🙈' : '👁️'; 
}


function moveFocus(currentInput, nextId) {
    if (currentInput.value.length == currentInput.maxLength && nextId) {
        document.getElementById(nextId).focus();
    }

    if (currentInput.id === 'confirm-pin4') {
        checkPinMatch();
    }
}

function checkPinMatch() {
    const createdPin = [
        document.getElementById('pin1').value,
        document.getElementById('pin2').value,
        document.getElementById('pin3').value,
        document.getElementById('pin4').value
    ].join('');
    
    const confirmPin = [
        document.getElementById('confirm-pin1').value,
        document.getElementById('confirm-pin2').value,
        document.getElementById('confirm-pin3').value,
        document.getElementById('confirm-pin4').value
    ].join('');
    
    if (createdPin !== confirmPin) {
        document.getElementById('pin-mismatch-message').style.display = 'block';
    } else {
        document.getElementById('pin-mismatch-message').style.display = 'none';
    }
}

