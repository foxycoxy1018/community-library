module.exports = func => { //passes in a function
    return (req, res, next) => { //executes function
        func(req, res, next).catch(next); //catches any errors and passes them to next
    }
}