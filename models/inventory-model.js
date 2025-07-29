const pool = require("../database/db-sql-code.sql");

const getVehicleById = async (invId) => {
  try {
    const sql = "SELECT * FROM inventory WHERE inv_id = $1";
    const result = await pool.query(sql, [invId]);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

async function addClassification(classification_name) {
  try {
    const sql = "INSERT INTO classification (classification_name) VALUES ($1)"
    const result = await pool.query(sql, [classification_name])
    return result.rowCount
  } catch (error) {
    console.error("Error adding classification:", error)
    return null
  }
}

const pool = require("../database");

async function addInventoryItem(vehicle) {
  try {
    const sql = `
      INSERT INTO inventory (
        inv_make, inv_model, inv_year, inv_description,
        inv_image, inv_thumbnail, inv_price,
        inv_miles, inv_color, classification_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const data = [
      vehicle.inv_make,
      vehicle.inv_model,
      vehicle.inv_year,
      vehicle.inv_description,
      vehicle.inv_image,
      vehicle.inv_thumbnail,
      vehicle.inv_price,
      vehicle.inv_miles,
      vehicle.inv_color,
      vehicle.classification_id
    ];

    const [result] = await pool.execute(sql, data);
    return result.affectedRows;
  } catch (error) {
    throw new Error("Database insertion failed: " + error.message);
  }
}







module.exports = { 
  getVehicleById,
  addClassification,
  addInventoryItem
};
