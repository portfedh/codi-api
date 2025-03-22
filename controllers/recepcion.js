// Imports
// *******

module.exports = {
  consultaOperaciones: (req, res) => {
    console.log(req.body); // Logs the request body
    console.log(req.query); // Logs the query parameters
    console.log(req.params); // Logs the route parameters

    // Return JSON message with status 200
    res.status(200).json({
      resultado: 0, // hardcoded. Deberia depender del resultado de checks P.71
      temp_request_body: req.body,
    });
  },
};
