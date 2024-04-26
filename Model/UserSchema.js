
const userSchema = {
    type: "object",
    properties: {
        email: {
            type: "string",
            format: "email",
            pattern: "^[^\s@]+@[^\s@]+\.[^\s@]+$"
        },
        password: {
            type: "string",
            pattern: "^(?=.*[A-Z])(?=.*\\d).{8,}$"
        },
    },
    required: ["email", "password"],
}

module.exports = {userSchema}