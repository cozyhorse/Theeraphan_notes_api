
const noteSchema = {
    type: "object",
    properties: {
        id: {type: "string"},
        title: {type: "string", maxLength: 50},
        text: {type: "string", maxLength: 300},


    }
}

module.exports = {noteSchema}