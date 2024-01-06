const allowedWorshipDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const allowedUserRoles = ['user', 'admin'];

const allowedBookingTypes = ['Regular', 'Pre-Booking'];

const allowedServiceTypes = ['Archana', 'Homam', 'Pooja', 'Seva'];

const allowedDonationTypes = ['Grocery', 'Other'];

const PUBLIC_URL= 'http://localhost:8080/';

module.exports = {
    allowedUserRoles,
    allowedWorshipDays,
    allowedDonationTypes,
    allowedBookingTypes,
    allowedServiceTypes,
    PUBLIC_URL
}
