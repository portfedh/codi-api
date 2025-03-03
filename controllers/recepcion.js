// Imports
// *******

module.exports = {
  logRequestData: (req, res) => {
    console.log(req.body); // Logs the request body
    console.log(req.query); // Logs the query parameters
    console.log(req.params); // Logs the route parameters
    res.send("Request data logged");
  },
};
