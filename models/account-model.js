const pool = require("../database/index");


/* ***************************
 *  Register new client
 * ************************** */
async function registerClient(
    client_firstname,
    client_lastname,
    client_email,
    client_password
) {
    try {
        const sql = "INSERT INTO client (client_firstname, client_lastname, client_email, client_password, client_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
        return await pool.query(sql, [
            client_firstname,
            client_lastname,
            client_email,
            client_password
        ])
    } catch (error) {
        return error.message
    }
}

/* **********************
 *   Check for existing email
 * ********************* */
async function checkExistingEmail(client_email){
    try {
      const sql = "SELECT * FROM client WHERE client_email = $1"
      const email = await pool.query(sql, [client_email])
 
      return email.rowCount
    } catch (error) {
      return error.message
    }
}

/* *****************************
* Return client data using email address
* ***************************** */
async function getClientByEmail (client_email) {
  try {
    const result = await pool.query(
      'SELECT client_firstname, client_lastname, client_email, client_type, client_password, client_id FROM client WHERE client_email = $1',
      [client_email])
    return result.rows[0]
  } catch (error) {
    console.error(error)
  }
}

/* *****************************
* Return client data using client_id
* ***************************** */
async function getClientById (client_id) { // I just found that I'm not passing the id correctly I need to see why
  try {
    const result = await pool.query(
      'SELECT client_firstname, client_lastname, client_email, client_type, client_password FROM client WHERE client_id = $1',
      [client_id])
    // console.log(result)
    console.log(result.rows[0])
    return result.rows[0]
  } catch (error) {
    console.error(error)
  }
}

/* *****************************
* update the client info
* ***************************** */
async function accountUpdate (client_firstname,client_lastname,client_email,client_id) { 
  try {
    const sql = "UPDATE public.client SET client_firstname = $1, client_lastname = $2, client_email = $3 WHERE client_id = $4 RETURNING *";
      return await pool.query(sql,[client_firstname, client_lastname, client_email, client_id]);
    
    }catch (error) {
      console.error('updateInformation error at the account-model' + error);
      return error.message;
    }
}

/* *****************************
* update the client password
* ***************************** */
async function ChangePassword (client_password, client_id) { // if I just save it here I don't think is going to be hashed.
  try {
    const sql = "UPDATE public.client SET client_password = $1 WHERE client_id = $2 RETURNING *";
      return await pool.query(sql,[client_password, client_id]);
    
    }catch (error) {
      console.error('changePassword error at the account-model' + error);
      return error.message;
    }
}

module.exports = { registerClient, checkExistingEmail, getClientByEmail, getClientById, accountUpdate, ChangePassword };