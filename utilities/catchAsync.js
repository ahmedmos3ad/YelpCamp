//express async error handling helper function

module.exports = fn => {
    //accepts a function and executes the function catching any error and sending it to the next error handling middleware
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    }
}