const pool = require("../database/");

/* *****************************
 * Create new appointment
 * *************************** */
async function createAppointment(account_id, inv_id, appointment_date, appointment_time, notes = null) {
    try {
        const sql = `
      INSERT INTO appointments (account_id, inv_id, appointment_date, appointment_time, notes, status) 
      VALUES ($1, $2, $3, $4, $5, 'scheduled') 
      RETURNING *
    `;
        const result = await pool.query(sql, [account_id, inv_id, appointment_date, appointment_time, notes]);
        return result.rows[0];
    } catch (error) {
        return error.message;
    }
}

/* *****************************
 * Get all appointments for a user with vehicle details
 * *************************** */
async function getAppointmentsByAccountId(account_id) {
    try {
        const sql = `
      SELECT 
        a.appointment_id,
        a.account_id,
        a.inv_id,
        a.appointment_date,
        a.appointment_time,
        a.status,
        a.notes,
        a.created_at,
        i.inv_make,
        i.inv_model,
        i.inv_year,
        i.inv_thumbnail,
        c.classification_name
      FROM appointments a
      INNER JOIN inventory i ON a.inv_id = i.inv_id
      INNER JOIN classification c ON i.classification_id = c.classification_id
      WHERE a.account_id = $1
      ORDER BY a.appointment_date DESC, a.appointment_time DESC
    `;
        const result = await pool.query(sql, [account_id]);
        return result.rows;
    } catch (error) {
        return error.message;
    }
}

/* *****************************
 * Get all appointments (for admin/employee view)
 * *************************** */
async function getAllAppointments() {
    try {
        const sql = `
      SELECT 
        a.appointment_id,
        a.appointment_date,
        a.appointment_time,
        a.status,
        a.notes,
        a.created_at,
        i.inv_make,
        i.inv_model,
        i.inv_year,
        acc.account_firstname,
        acc.account_lastname,
        acc.account_email
      FROM appointments a
      INNER JOIN inventory i ON a.inv_id = i.inv_id
      INNER JOIN account acc ON a.account_id = acc.account_id
      ORDER BY a.appointment_date DESC, a.appointment_time DESC
    `;
        const result = await pool.query(sql);
        return result.rows;
    } catch (error) {
        return error.message;
    }
}

/* *****************************
 * Get appointment by ID
 * *************************** */
async function getAppointmentById(appointment_id) {
    try {
        const sql = `
      SELECT 
        a.*,
        i.inv_make,
        i.inv_model,
        i.inv_year,
        i.inv_thumbnail
      FROM appointments a
      INNER JOIN inventory i ON a.inv_id = i.inv_id
      WHERE a.appointment_id = $1
    `;
        const result = await pool.query(sql, [appointment_id]);
        return result.rows[0];
    } catch (error) {
        return error.message;
    }
}

/* *****************************
 * Update appointment status
 * *************************** */
async function updateAppointmentStatus(appointment_id, status) {
    try {
        const sql = "UPDATE appointments SET status = $1 WHERE appointment_id = $2 RETURNING *";
        const result = await pool.query(sql, [status, appointment_id]);
        return result.rows[0];
    } catch (error) {
        return error.message;
    }
}

/* *****************************
 * Cancel appointment (soft delete)
 * *************************** */
async function cancelAppointment(appointment_id, account_id) {
    try {
        const sql = `
      UPDATE appointments 
      SET status = 'cancelled' 
      WHERE appointment_id = $1 AND account_id = $2 
      RETURNING *
    `;
        const result = await pool.query(sql, [appointment_id, account_id]);
        return result.rows[0];
    } catch (error) {
        return error.message;
    }
}

/* *****************************
 * Delete appointment (hard delete)
 * *************************** */
async function deleteAppointment(appointment_id, account_id) {
    try {
        const sql = "DELETE FROM appointments WHERE appointment_id = $1 AND account_id = $2 RETURNING *";
        const result = await pool.query(sql, [appointment_id, account_id]);
        return result.rowCount;
    } catch (error) {
        return error.message;
    }
}

/* *****************************
 * Check for scheduling conflicts
 * *************************** */
async function checkAvailability(inv_id, appointment_date, appointment_time) {
    try {
        const sql = `
      SELECT * FROM appointments 
      WHERE inv_id = $1 
        AND appointment_date = $2 
        AND appointment_time = $3 
        AND status = 'scheduled'
    `;
        const result = await pool.query(sql, [inv_id, appointment_date, appointment_time]);
        return result.rowCount === 0; // True if available
    } catch (error) {
        return false;
    }
}

module.exports = {
    createAppointment,
    getAppointmentsByAccountId,
    getAllAppointments,
    getAppointmentById,
    updateAppointmentStatus,
    cancelAppointment,
    deleteAppointment,
    checkAvailability
};
