const pool = require("../database/");

/* *****************************
 * Add vehicle to favorites
 * *************************** */
async function addFavorite(account_id, inv_id) {
    try {
        const sql = "INSERT INTO favorites (account_id, inv_id) VALUES ($1, $2) RETURNING *";
        const result = await pool.query(sql, [account_id, inv_id]);
        return result.rows[0];
    } catch (error) {
        // Handle duplicate favorite error
        if (error.code === '23505') {
            return null; // Already exists
        }
        return error.message;
    }
}

/* *****************************
 * Remove vehicle from favorites
 * *************************** */
async function removeFavorite(account_id, inv_id) {
    try {
        const sql = "DELETE FROM favorites WHERE account_id = $1 AND inv_id = $2 RETURNING *";
        const result = await pool.query(sql, [account_id, inv_id]);
        return result.rowCount;
    } catch (error) {
        return error.message;
    }
}

/* *****************************
 * Get all favorites for a user with vehicle details
 * *************************** */
async function getFavoritesByAccountId(account_id) {
    try {
        const sql = `
      SELECT 
        f.favorite_id,
        f.account_id,
        f.inv_id,
        f.date_added,
        i.inv_make,
        i.inv_model,
        i.inv_year,
        i.inv_price,
        i.inv_miles,
        i.inv_color,
        i.inv_thumbnail,
        i.classification_id,
        c.classification_name
      FROM favorites f
      INNER JOIN inventory i ON f.inv_id = i.inv_id
      INNER JOIN classification c ON i.classification_id = c.classification_id
      WHERE f.account_id = $1
      ORDER BY f.date_added DESC
    `;
        const result = await pool.query(sql, [account_id]);
        return result.rows;
    } catch (error) {
        return error.message;
    }
}

/* *****************************
 * Check if vehicle is in user's favorites
 * *************************** */
async function isFavorite(account_id, inv_id) {
    try {
        const sql = "SELECT * FROM favorites WHERE account_id = $1 AND inv_id = $2";
        const result = await pool.query(sql, [account_id, inv_id]);
        return result.rowCount > 0;
    } catch (error) {
        return false;
    }
}

/* *****************************
 * Get favorite count for a vehicle
 * *************************** */
async function getFavoriteCount(inv_id) {
    try {
        const sql = "SELECT COUNT(*) as count FROM favorites WHERE inv_id = $1";
        const result = await pool.query(sql, [inv_id]);
        return parseInt(result.rows[0].count);
    } catch (error) {
        return 0;
    }
}

module.exports = {
    addFavorite,
    removeFavorite,
    getFavoritesByAccountId,
    isFavorite,
    getFavoriteCount
};
