// Needed Resources
const express = require("express");
const router = new express.Router();
const utilities = require("../utilities");
const appointmentController = require("../controllers/appointmentController");

// Route to build schedule appointment view
router.get(
    "/schedule/:inv_id",
    utilities.checkLogin,
    utilities.handleErrors(appointmentController.buildScheduleView)
);

// Route to process appointment scheduling
router.post(
    "/schedule",
    utilities.checkLogin,
    utilities.handleErrors(appointmentController.scheduleAppointment)
);

// Route to build my appointments view
router.get(
    "/my-appointments",
    utilities.checkLogin,
    utilities.handleErrors(appointmentController.buildMyAppointments)
);

// Route to cancel appointment
router.post(
    "/cancel",
    utilities.checkLogin,
    utilities.handleErrors(appointmentController.cancelAppointment)
);

// Route to build manage all appointments view (Admin/Employee)
router.get(
    "/manage",
    utilities.checkEmployeeAdmin,
    utilities.handleErrors(appointmentController.buildAllAppointments)
);

// Route to update appointment status (Admin/Employee)
router.post(
    "/update-status",
    utilities.checkEmployeeAdmin,
    utilities.handleErrors(appointmentController.updateAppointmentStatus)
);

module.exports = router;
