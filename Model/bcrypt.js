const bcrypt = require("bcrypt");


const hashPassword = async (password) => {
    const hashedText = await bcrypt.hash(password, 10);
    console.log("hash", hashedText)
    return hashedText;

}

const compareHash = async (password, hash) => {
    const matchedText = await bcrypt.compare(password, hash)
    return matchedText;
}

module.exports = {hashPassword, compareHash};