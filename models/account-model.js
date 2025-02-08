const pool = require("../database/")
const bcrypt = require("bcryptjs")

/* *****************************
*   Register new account
* *************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password){
    try {
        const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
        return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])
    } catch (error) {
        return error.message
    }
};

/* **********************
 *   Check for existing email
 * ********************* */
async function checkExistingEmail(account_email){
    try {
      const sql = "SELECT * FROM account WHERE account_email = $1"
      const email = await pool.query(sql, [account_email])
      return email.rowCount
    } catch (error) {
      return error.message
    }
}

/* *****************************
*   Check login account
* *************************** */
async function loginAccount(account_email, account_password){
    try {
        const sql = "SELECT * FROM account  WHERE account_email = $1"
        const result = await pool.query(sql, [account_email])

        if (result.rows.length === 0) {
            return null // User not found
        }

        const user = result.rows[0]

        // Compare the passwords
        const passwordMatch = await bcrypt.compare(account_password, user.account_password)

        if (!passwordMatch) {
            return null // Incorrect password
        }

        return user // Return user if everything is correct
    } catch (error) {
        return error.message
    }
};

module.exports = { registerAccount, checkExistingEmail, loginAccount };