const appointmentModel = require("../models/appointment-model");
const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const appointmentCont = {};

/* ***************************
 *  Build schedule appointment view
 * ************************** */
appointmentCont.buildScheduleView = async function (req, res, next) {
    const inv_id = parseInt(req.params.inv_id);
    let nav = await utilities.getNav();
    const vehicleData = await invModel.getInventoryById(inv_id);

    if (!vehicleData) {
        req.flash("notice", "Vehicle not found.");
        return res.redirect("/inv/");
    }

    const vehicleName = `${vehicleData.inv_year} ${vehicleData.inv_make} ${vehicleData.inv_model}`;

    res.render("./appointments/schedule", {
        title: `Schedule Test Drive - ${vehicleName}`,
        nav,
        vehicleData,
        errors: null,
    });
};

/* ***************************
 *  Process appointment scheduling
 * ************************** */
appointmentCont.scheduleAppointment = async function (req, res, next) {
    let nav = await utilities.getNav();
    const { inv_id, appointment_date, appointment_time, notes } = req.body;
    const account_id = res.locals.accountData.account_id;

    // Check availability
    const isAvailable = await appointmentModel.checkAvailability(
        inv_id,
        appointment_date,
        appointment_time
    );

    if (!isAvailable) {
        req.flash("notice", "Sorry, that time slot is already booked. Please choose another time.");
        const vehicleData = await invModel.getInventoryById(inv_id);
        const vehicleName = `${vehicleData.inv_year} ${vehicleData.inv_make} ${vehicleData.inv_model}`;
        return res.status(400).render("./appointments/schedule", {
            title: `Schedule Test Drive - ${vehicleName}`,
            nav,
            vehicleData,
            errors: null,
        });
    }

    const result = await appointmentModel.createAppointment(
        account_id,
        inv_id,
        appointment_date,
        appointment_time,
        notes
    );

    if (result && result.appointment_id) {
        req.flash("notice", "Test drive appointment scheduled successfully!");
        res.redirect("/appointments/my-appointments");
    } else {
        req.flash("notice", "Sorry, scheduling the appointment failed.");
        const vehicleData = await invModel.getInventoryById(inv_id);
        const vehicleName = `${vehicleData.inv_year} ${vehicleData.inv_make} ${vehicleData.inv_model}`;
        res.status(500).render("./appointments/schedule", {
            title: `Schedule Test Drive - ${vehicleName}`,
            nav,
            vehicleData,
            errors: null,
        });
    }
};

/* ***************************
 *  Build my appointments view
 * ************************** */
appointmentCont.buildMyAppointments = async function (req, res, next) {
    let nav = await utilities.getNav();
    const account_id = res.locals.accountData.account_id;

    const appointments = await appointmentModel.getAppointmentsByAccountId(account_id);

    res.render("./appointments/my-appointments", {
        title: "My Test Drive Appointments",
        nav,
        appointments: Array.isArray(appointments) ? appointments : [],
        errors: null,
    });
};

/* ***************************
 *  Build all appointments view (Admin/Employee)
 * ************************** */
appointmentCont.buildAllAppointments = async function (req, res, next) {
    let nav = await utilities.getNav();

    const appointments = await appointmentModel.getAllAppointments();

    res.render("./appointments/manage-appointments", {
        title: "Manage All Appointments",
        nav,
        appointments: Array.isArray(appointments) ? appointments : [],
        errors: null,
    });
};

/* ***************************
 *  Cancel appointment
 * ************************** */
appointmentCont.cancelAppointment = async function (req, res, next) {
    const { appointment_id } = req.body;
    const account_id = res.locals.accountData.account_id;

    const result = await appointmentModel.cancelAppointment(appointment_id, account_id);

    if (result && result.appointment_id) {
        req.flash("notice", "Appointment cancelled successfully.");
        res.redirect("/appointments/my-appointments");
    } else {
        req.flash("notice", "Sorry, cancelling the appointment failed.");
        res.redirect("/appointments/my-appointments");
    }
};

/* ***************************
 *  Update appointment status (Admin/Employee)
 * ************************** */
appointmentCont.updateAppointmentStatus = async function (req, res, next) {
    const { appointment_id, status } = req.body;

    const result = await appointmentModel.updateAppointmentStatus(appointment_id, status);

    if (result && result.appointment_id) {
        req.flash("notice", `Appointment status updated to ${status}.`);
        res.redirect("/appointments/manage");
    } else {
        req.flash("notice", "Sorry, updating the appointment failed.");
        res.redirect("/appointments/manage");
    }
};

module.exports = appointmentCont;
