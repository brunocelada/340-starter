const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
    return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
    try {
        const data = await pool.query(
            `SELECT * FROM public.inventory AS i
            JOIN public.classification AS c
            ON i.classification_id = c.classification_id
            WHERE i.classification_id = $1`,
            [classification_id]
        )
        return data.rows
    } catch (error) {
        console.error("getclassificationbyid error" + error)
    }
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getVehicleById(id) {
    try {
        const data = await pool.query(
            `SELECT * FROM public.inventory WHERE inv_id = $1`,
            [id]
        )
        return data.rows[0]
    } catch (error) {
        console.error("Error fetching vehicle:", error)
    }
}

/* *****************************
*   Register new classification
* *************************** */
async function addNewClassification(classification_name){
    try {
        const sql = "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *"
        return await pool.query(sql, [classification_name])
    } catch (error) {
        return error.message
    }
};

/* **********************
 *   Check for existing classification
 * ********************* */
async function checkExistingClassification(classification_name){
    try {
        const sql = "SELECT * FROM classification WHERE classification_name = $1"
        const result = await pool.query(sql, [classification_name])

        if (result.rows.length === 0) {
            return null 
        }

        return true // Classification already exists
    } catch (error) {
        return error.message
    }
}

/* *****************************
*   Register new vehicle
* *************************** */
async function addNewVehicle(
        classification_id,
        inv_make,
        inv_model,
        inv_year,
        inv_price,
        inv_miles,
        inv_color,
        inv_image,
        inv_thumbnail,
        inv_description
    ){
    try {
        const sql = "INSERT INTO inventory (classification_id, inv_make, inv_model, inv_year, inv_price, inv_miles, inv_color, inv_image, inv_thumbnail, inv_description) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *"
        return await pool.query(sql, [classification_id, inv_make, inv_model, inv_year, inv_price, inv_miles, inv_color, inv_image, inv_thumbnail, inv_description])
    } catch (error) {
        return error.message
    }
};

module.exports = {getClassifications, getInventoryByClassificationId, getVehicleById, addNewClassification, checkExistingClassification, addNewVehicle };