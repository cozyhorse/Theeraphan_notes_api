//Checks if email format is correct
//old
const isValidEmail = (email) => {
    //Using regex to check if email follows "email-structure"
    //must contain @ and can't have spaces 
    //("email@email.com  ", "email@email.com  s")//false
    //("email@email.com")//true
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
//old
const isValidPassword = (password) => {
    //Using reqex to check if password follows the rule
    //must contain atleast 1 Uppercase letter and 1 number 
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    return passwordRegex.test(password);

}

//Checks if signup contains correct keys
const isRegisterBody = async (req, res, next) => {
    const validateBody = Object.keys(req.body).filter((key) => !["email", "password"].includes(key));
    console.log("ValidateBody", validateBody)
    if(validateBody.length > 0){
        return res.status(404).json({message: "Body contained wrong values"})
    }

    next();

}

//testing
const sendErrors = (validate, res) => {
        if(validate.errors[0].dataPath === ".password"){
            return res.status(400).json(
                {
                    message: "Invalid data", 
                    errors: validate.errors[0].message = "Must contain 1 uppercase, 1 number and min 8 character long"
                })
        }else{

            return res.status(400).json(
                {
                    message: "Invalid data", 
                    errors: validate.errors[0].message = "Invalid email format"
                })
        }
}



module.exports = {isValidEmail, isRegisterBody, isValidPassword, sendErrors}