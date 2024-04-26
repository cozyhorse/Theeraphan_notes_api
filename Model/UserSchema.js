//userSchema acts as validation with regex rules and format rules 
const userSchema = {
    type: "object",
    properties: {
        email: {
            type: "string",
            format: "email",
    //Using regex to check if email follows "email-structure"
    //must contain @ and can't have spaces 
    //("email@email.com  ", "email@email.com  s")//false
    //("email@email.com")//true
            pattern: "^[^\s@]+@[^\s@]+\.[^\s@]+$"
        },
        password: {
            type: "string",
            //must contain atleast 1 Uppercase letter and 1 number and atleast 8 character long 
            pattern: "^(?=.*[A-Z])(?=.*\\d).{8,}$",
            
        },
    },
    required: ["email", "password"],
}

module.exports = {userSchema}