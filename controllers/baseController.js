const utilities = require("../utilities/")
const baseController = {}
// do I need to add the "req" parameter if I'm not going to use it?
baseController.buildHome = async function(req, res){
  // const nav = await utilities.getNav()
  res.render("index", {title: "Home", nav})
}

module.exports = baseController