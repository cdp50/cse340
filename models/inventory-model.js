const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  
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
    // I just changed this function to add classification_id to the query so I can use it at invCont.editDetailId, I think this might create an error at other functions calling this getVehiclesById
    const data = await pool.query(`SELECT inv_make, inv_model, inv_price, inv_description, inv_color, inv_miles, inv_image, inv_thumbnail, inv_year, classification_id FROM public.inventory WHERE inv_id = ${detailId};`)
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

async function updateVehicle(
  classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles , inv_color, inv_id
) {
  try{ 
    const sql = "UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_description = $3, inv_image = $4, inv_thumbnail = $5, inv_price = $6, inv_year = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *"
    return await pool.query(sql, [inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles , inv_color, classification_id, inv_id]);

  }catch (error) {
    console.error('updateVehicle error at the inventory-model' + error);
    return error.message;
  }
}

// it will delete the vehicle from the db
async function deleteVehicle(inv_id) {
  try{ 
    const sql = "DELETE FROM public.inventory WHERE inv_id = $1 RETURNING *"
    return await pool.query(sql, [inv_id]);

  }catch (error) {
    console.error('Delete error at the inventory-model' + error);
    return error.message;
  }
}

module.exports = {getClassifications, getVehiclesByClassificationId, getVehicleById, addClassification, addVehicle, updateVehicle, deleteVehicle};