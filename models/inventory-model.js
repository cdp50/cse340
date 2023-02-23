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

async function addClassification(classification){
  try{
    const sql = `INSERT INTO public.classification (classification_name ) VALUES ($1) RETURNING *;`
    return await pool.query(sql, [classification]);

  }catch (error) {
    console.error('addClassification error at the inventory-model' + error);
    return error.message;
  }
}

async function addVehicle(
  classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles , inv_color
) {
  try{
    const sql = "INSERT INTO public.inventory (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles , inv_color, classification_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)  RETURNING *;"
    return await pool.query(sql, [inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles , inv_color, classification_id]);

  }catch (error) {
    console.error('addVehicle error at the inventory-model' + error);
    return error.message;
  }
}



module.exports = {getClassifications, getVehiclesByClassificationId, getVehicleById, addClassification, addVehicle};