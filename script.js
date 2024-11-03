
// selecting all the buttons and aother elements by their ID or classes 
const rsvpButtons = document.querySelectorAll('.rsvp-option'); // buttons for yes,no,maybe
const responseInput = document.getElementById('response'); // hidden input for after they choose an option
const confirmation = document.getElementById('confirmation'); // confirmation message showwn after suibmit
const formBox = document.getElementById('rsvpForm'); // the form container

//messages according to responses
const yesMessage = document.getElementById('yesMessage');
const noMessage = document.getElementById('noMessage');
const maybeMessage = document.getElementById('maybeMessage');

//Error Elements
const nameError = document.getElementById('nameError');
const rsvpError = document.getElementById('rsvpError');
const guestsError = document.getElementById('guestsError')

rsvpButtons.forEach(button => { // adding click event listeners to the rsrvp option buttons
    button.addEventListener('click', () => { // add event listner on click
        responseInput.value = button.getAttribute('data-response'); // set the hidden inputs value to the data-response attribute of the clicked button

        //highlight the selected button by adding the 'selected' class and remove it from others
        rsvpButtons.forEach(btn => btn.classList.remove('selected')); // clear selection all buttons
        button.classList.add('selected'); // add selection style to the clicked button 
    });
});


//Now creating the form submission handler
document.getElementById('rsvpForm').addEventListener('submit', async (event) => { // in the .addEventListener(event, callback), the following is the callback event denoted by event

    event.preventDefault(); // prevents page reload

    const name = event.target.name.value.trim(); // user name input value, trimmed for whitespace
    const response = responseInput.value; // selected response yes,no,maybe
    const guests = event.target.guests.value.trim();

    let hasError = false; //validation checks and error handling

    if (!name) {
        nameError.style.display = 'block'; // Show name error message
        hasError = true;
    } 
    else {
        nameError.style.display = 'none'; // Hide name error message
    }

    // Check if RSVP response is missing
    if (!response) {
        rsvpError.style.display = 'block'; // Show RSVP error message
        hasError = true;
    } 
    else {
        rsvpError.style.display = 'none'; // Hide RSVP error message
    }
    if (!guests || isNaN(guests) || guests < 1) {
        guestsError.style.display = 'block'; // Show guests error message
        hasError = true;
    } 
    else {
        guestsError.style.display = 'none'; // Hide guests error message
    }
    if (hasError) return; // stop form submittion in case there are errors

    formBox.style.display = 'none'; // hiode form sand show confirmation

    try {
        const res = await fetch('https://your-live-server-url.com/rsvp', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({name, guests: parseInt(guests), response})
        });
        const data = await res.json();
        setTimeout(()=>{ // adding a timeout to look better
            // general conformation message to everyone after submit
            if(res.ok){
                confirmation.classList.add('show'); // make confirmation message visibible on screen
                confirmation.textContent = 'Thank You for your RSVP';

                //Displaying speical messages based on user RSVP
                if (response === 'yes') {
                    yesMessage.classList.add('show');
                    noMessage.classList.remove('show');
                    maybeMessage.classList.remove('show');
                } 
                else if (response === 'no') {
                    noMessage.classList.add('show');
                    yesMessage.classList.remove('show');
                    maybeMessage.classList.remove('show');
                } 
                else if (response === 'maybe') {
                    maybeMessage.classList.add('show');
                    yesMessage.classList.remove('show');
                    noMessage.classList.remove('show');
                }
            }
            else {
                alert(data.error || 'Failed to save RSVP. Please try again.'); // data error handling if not saved
                formBox.style.display = 'block'; // display the frorm box if fails to save
            }
        },500);
    }
    catch(error){
        console.error('Error submitting RSVP: ', error);
        alert ('Error occurred while submitting the RSVP form.');
        formBox.style.display = 'block'; // residplay the form
    }

    //reset the form and selections after submission
    event.target.reset();//clear all the input fields of the form
    rsvpButtons.forEach(btn => btn.classList.remove('selected')); // deselect all RSVP buttons
    responseInput.value = ''; // clear the hidden input value
});