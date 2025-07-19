const pool = require("../database/");

const getVehicleById = async (invId) => {
  try {
    const sql = "SELECT * FROM inventory WHERE inv_id = $1";
    const result = await pool.query(sql, [invId]);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

module.exports = { getVehicleById };
