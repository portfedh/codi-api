// Home Controllers
// ****************

// Imports
// *******
module.exports = {
  temp: (req, res) => {
    console.log(req)
    res.status(200).json({ success: true, message: "Hello World" });

  },
};
