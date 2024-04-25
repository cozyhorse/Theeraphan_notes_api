//Checks if email format is correct
const isValidEmail = (email) => {
    //Using regex to check if email follows "email-structure"
    //must contain @ and can't have spaces 
    //("email@email.com  ", "email@email.com  s")//false
    //("email@email.com")//true
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

const isValidPassword = (password) => {
    //Using reqex to check if password follows the rule
    //must contain atleast 1 Uppercase letter and 1 number 
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    return passwordRegex.test(password);

}

//Checks if signup contains correct keys
const isEmailBody = async (req, res, next) => {
    const validateBody = Object.keys(req.body).filter((key) => !["email", "password"].includes(key));
    console.log("ValidateBody", validateBody)
    if(validateBody.length > 0){
        return res.status(404).json({message: "Body contained wrong values"})
    }

    next();

}



module.exports = {isValidEmail, isEmailBody, isValidPassword}