const isValidEmail = (email) => {
    //Using regex to check if email follows "email-struckture"
    //must contain @ and can't have spaces and such 
    //("email@email.com  ", "email@email.com  s")//false
    //("email@email.com")//true
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

module.exports = {isValidEmail}