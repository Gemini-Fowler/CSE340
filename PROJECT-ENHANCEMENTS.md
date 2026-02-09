# Project Enhancements: Favorites & Test Drive Appointments

## Overview
This document describes the two major enhancements added to the CSE340 Motors application:
1. **Favorites/Wishlist System** - Allows users to save and manage favorite vehicles
2. **Test Drive Appointment System** - Enables users to schedule and manage test drive appointments

---

## Installation & Setup

### 1. Database Setup
Run the SQL script to create the required tables:

```sql
psql -U your_username -d your_database -f database/project-enhancements.sql
```

Or manually execute the SQL in `database/project-enhancements.sql` through your database management tool.

### 2. Dependencies
No additional npm packages are required. The enhancements use existing dependencies.

### 3. Server Restart
After pulling the code, restart your server:
```bash
npm start
```

---

## Feature 1: Favorites/Wishlist System

### Database Schema
**Table: `favorites`**
- `favorite_id` (SERIAL PRIMARY KEY)
- `account_id` (INT, FK to account table)
- `inv_id` (INT, FK to inventory table)
- `date_added` (TIMESTAMP)
- Unique constraint on (account_id, inv_id) to prevent duplicates
- Cascading deletes if account or vehicle is removed

### MVC Implementation

#### Model (`models/favorites-model.js`)
Functions:
- `addFavorite(account_id, inv_id)` - Add vehicle to favorites
- `removeFavorite(account_id, inv_id)` - Remove vehicle from favorites
- `getFavoritesByAccountId(account_id)` - Get all favorites for a user with vehicle details
- `isFavorite(account_id, inv_id)` - Check if vehicle is favorited
- `getFavoriteCount(inv_id)` - Get favorite count for a vehicle

All functions use prepared statements for SQL injection protection.

#### Controller (`controllers/favoritesController.js`)
Functions:
- `addFavorite` - Process add to favorites (returns JSON)
- `removeFavorite` - Process remove from favorites (returns JSON)
- `buildMyFavorites` - Display user's favorites page

#### Routes (`routes/favoritesRoute.js`)
- `GET /favorites/my-favorites` - View favorites (requires login)
- `POST /favorites/add` - Add to favorites (requires login)
- `POST /favorites/remove` - Remove from favorites (requires login)

#### Views
- `views/favorites/my-favorites.ejs` - Displays user's favorite vehicles in a grid

### Features
- ✅ Only logged-in users can add/remove favorites
- ✅ Duplicate prevention (one favorite per vehicle per user)
- ✅ AJAX-based add/remove (no page reload)
- ✅ Visual feedback on detail page
- ✅ Link in account management view
- ✅ Error handling and validation

### User Experience
1. On vehicle detail page, click "❤ Add to Favorites"
2. Button changes to "💔 Remove from Favorites"
3. View all favorites from account management page
4. Remove favorites from favorites page or detail page

---

## Feature 2: Test Drive Appointment System

### Database Schema
**Table: `appointments`**
- `appointment_id` (SERIAL PRIMARY KEY)
- `account_id` (INT, FK to account table)
- `inv_id` (INT, FK to inventory table)
- `appointment_date` (TIMESTAMP)
- `appointment_time` (VARCHAR)
- `status` (VARCHAR: 'scheduled', 'completed', 'cancelled')
- `notes` (TEXT, optional)
- `created_at` (TIMESTAMP)
- Cascading deletes if account or vehicle is removed

### MVC Implementation

#### Model (`models/appointment-model.js`)
Functions:
- `createAppointment(account_id, inv_id, date, time, notes)` - Create appointment
- `getAppointmentsByAccountId(account_id)` - Get user's appointments
- `getAllAppointments()` - Get all appointments (Admin/Employee)
- `getAppointmentById(appointment_id)` - Get specific appointment
- `updateAppointmentStatus(appointment_id, status)` - Update status
- `cancelAppointment(appointment_id, account_id)` - Cancel appointment
- `deleteAppointment(appointment_id, account_id)` - Delete appointment
- `checkAvailability(inv_id, date, time)` - Check time slot availability

All functions use prepared statements for SQL injection protection.

#### Controller (`controllers/appointmentController.js`)
Functions:
- `buildScheduleView` - Display scheduling form
- `scheduleAppointment` - Process appointment creation
- `buildMyAppointments` - Display user's appointments
- `buildAllAppointments` - Display all appointments (Admin/Employee)
- `cancelAppointment` - Process cancellation
- `updateAppointmentStatus` - Update status (Admin/Employee)

#### Routes (`routes/appointmentRoute.js`)
- `GET /appointments/schedule/:inv_id` - View schedule form (requires login)
- `POST /appointments/schedule` - Process scheduling (requires login)
- `GET /appointments/my-appointments` - View user's appointments (requires login)
- `POST /appointments/cancel` - Cancel appointment (requires login)
- `GET /appointments/manage` - View all appointments (requires Employee/Admin)
- `POST /appointments/update-status` - Update status (requires Employee/Admin)

#### Views
- `views/appointments/schedule.ejs` - Appointment scheduling form
- `views/appointments/my-appointments.ejs` - User's appointments list
- `views/appointments/manage-appointments.ejs` - Admin/Employee management view

### Features
- ✅ Only logged-in users can schedule appointments
- ✅ Date validation (no past dates)
- ✅ Time slot selection (9 AM - 5 PM)
- ✅ Availability checking (prevents double-booking)
- ✅ Status tracking (scheduled, completed, cancelled)
- ✅ User can cancel their own appointments
- ✅ Admin/Employee can view and manage all appointments
- ✅ Optional notes field for special requests
- ✅ Authorization middleware for admin features

### User Experience
**For Clients:**
1. On vehicle detail page, click "📅 Schedule Test Drive"
2. Select date and time from available slots
3. Add optional notes
4. Submit appointment
5. View/cancel appointments from account management page

**For Employees/Admins:**
1. Access "Manage Appointments" from inventory management
2. View all scheduled appointments
3. Update status (scheduled → completed/cancelled)
4. See customer contact information

---

## Integration Points

### Updated Files

1. **`server.js`**
   - Added routes for favorites and appointments
   ```javascript
   app.use("/favorites", favoritesRoute)
   app.use("/appointments", appointmentRoute)
   ```

2. **`views/account/account.ejs`**
   - Added "My Activities" section with links to:
     - My Favorite Vehicles
     - My Test Drive Appointments

3. **`views/inventory/detail.ejs`**
   - Added action buttons for logged-in users:
     - Add to Favorites button
     - Schedule Test Drive link
   - Included favorites.js script

4. **`controllers/invController.js`**
   - Updated `buildByInventoryId` to pass `inventoryId` to view

5. **`utilities/index.js`**
   - Added `buildFavoritesGrid()` function for displaying favorites

6. **`public/css/styles.css`**
   - Added styles for:
     - Favorites buttons and grid
     - Appointments tables and badges
     - Status indicators
     - Account links section

7. **`public/js/favorites.js`** (NEW)
   - Client-side JavaScript for AJAX favorites functionality
   - Handles add/remove without page reload
   - Dynamic UI updates

---

## Testing Checklist

### Favorites System
- [ ] Can add vehicle to favorites from detail page
- [ ] Button text/style changes when favorited
- [ ] Can view all favorites from account page
- [ ] Can remove favorites from favorites page
- [ ] Duplicate prevention works (can't favorite twice)
- [ ] Favorites page shows correct vehicle details
- [ ] Links to vehicle details work
- [ ] Must be logged in to access features
- [ ] Error messages display correctly

### Appointments System
- [ ] Can schedule appointment from detail page
- [ ] Date picker prevents past dates
- [ ] Time slot selection works
- [ ] Double-booking prevention works
- [ ] Appointment appears in "My Appointments"
- [ ] Can cancel scheduled appointments
- [ ] Status badges display correctly
- [ ] Admin can view all appointments
- [ ] Admin can update appointment status
- [ ] Must be logged in to schedule
- [ ] Email/phone validation works (if added)
- [ ] Confirmation messages display

### Authorization
- [ ] Clients cannot access admin appointment management
- [ ] Non-logged-in users see login prompt
- [ ] Employee/Admin can access management features

---

## Best Practices Demonstrated

### Database
✅ Foreign key constraints for data integrity  
✅ Unique constraints to prevent duplicates  
✅ Cascading deletes for orphan prevention  
✅ Indexed columns for query performance  
✅ Parameterized queries (prepared statements)  
✅ Proper data types and constraints  

### Security
✅ Authentication checks on all routes  
✅ Authorization middleware for admin features  
✅ SQL injection protection via prepared statements  
✅ User can only modify their own data  
✅ Input validation and sanitization  

### MVC Architecture
✅ Clear separation of concerns  
✅ Models handle all database operations  
✅ Controllers handle business logic  
✅ Views handle presentation only  
✅ Routes define application flow  

### User Experience
✅ Intuitive navigation  
✅ Clear success/error messages  
✅ Form validation (client & server-side)  
✅ Responsive design considerations  
✅ AJAX for better interactivity (favorites)  

### Code Quality
✅ Consistent naming conventions  
✅ Comprehensive error handling  
✅ DRY principle (reusable functions)  
✅ Comments explaining complex logic  
✅ Async/await for database operations  

---

## Future Enhancements

Potential improvements for future iterations:

1. **Favorites**
   - Share favorites via email
   - Compare favorited vehicles side-by-side
   - Favorite count display on classification pages
   - Email notifications for price drops

2. **Appointments**
   - Email/SMS confirmation
   - Calendar integration (iCal, Google Calendar)
   - Appointment reminders (24 hours before)
   - Rescheduling capability
   - Recurring availability checking
   - Time zone support
   - Appointment history tracking

3. **Both Features**
   - Mobile app integration
   - Analytics dashboard for admin
   - Export data to CSV/PDF
   - Advanced search and filtering

---

## Troubleshooting

### Database Issues
**Problem:** Tables not created  
**Solution:** Run the SQL script manually: `\i database/project-enhancements.sql`

**Problem:** Foreign key constraint errors  
**Solution:** Ensure account and inventory tables exist first

### Route Issues
**Problem:** 404 errors on new routes  
**Solution:** Check server.js includes the new routes and restart server

### Permission Issues
**Problem:** "Please log in" message when logged in  
**Solution:** Clear cookies and log in again; check JWT middleware

### Display Issues
**Problem:** Favorites grid not displaying  
**Solution:** Check `buildFavoritesGrid` function in utilities/index.js

---

## Support & Documentation

For questions or issues:
1. Check this README first
2. Review code comments in relevant files
3. Consult the grading matrix for requirements
4. Test in development environment before production

---

## Author Notes

These enhancements demonstrate:
- Full-stack development skills
- Database design and relationships
- Authentication and authorization
- RESTful API design
- AJAX and async JavaScript
- Responsive web design
- Security best practices

Both features follow all course requirements for the final project enhancement, including database interaction, MVC architecture, validation, error handling, and best practices.
