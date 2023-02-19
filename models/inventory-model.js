const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  // console.log(await pool.query("SELECT * FROM public.classification ORDER BY classification_name"))
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}


async function getVehiclesByClassificationId(classificationId){
  try{
    const data = await pool.query("SELECT * FROM public.inventory AS i JOIN public.classification AS c ON i.classification_id = c.classification_id WHERE i.classification_id = $1",
    [classificationId])
    return data.rows
  } catch (error) {
    console.error('get classifications by id error' + error)
  }
}

async function getVehicleById(detailId){
  try{
    const data = await pool.query(`SELECT inv_make, inv_model, inv_price, inv_description, inv_color, inv_miles, inv_image, inv_year FROM public.inventory WHERE inv_id = ${detailId};`)
    return data.rows
  }catch (error) {
    console.error('get details by id error' + error)
  }
}



module.exports = {getClassifications, getVehiclesByClassificationId, getVehicleById};