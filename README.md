## Description

Develop a simplified appointment system with NESTJS

## Project setup

```bash
$ pnpm install
```

## Compile and run the project

```bash
# development
$ pnpm run start
```

## Initialize

Run the following APIs in Postman:

1. `POST http://localhost:3000/operationalDays/initialize`
2. `POST http://localhost:3000/operationalTimes/initialize`
3. `POST http://localhost:3000/cron/booking-time-slots/initialize`

## Test

```bash
# test concurrency issue
$ node test/test-concurrency.js
```

## Postman

Run the following APIs in Postman:

1. `Import postman json file: MoneyMaxAppointment.postman_collection.json`
2. `API Documentation: https://documenter.getpostman.com/view/22951487/2sBYB4KSCv`

## Assumption

The following assumptions and constraints are applied to the appointment booking system:

1. **Booking Start Time**

   - Appointment start times must be in **30-minute intervals**, such as `09:00`, `09:30`, `10:00`, etc.
   - The booking duration itself can be any value of **5 minutes or more**.

2. **Time Precision**

   - Booking time is handled with **5-minute granularity** for concurrency locking.
   - The 5-minute lock slots are independent of the 30-minute appointment start-time interval.

3. **Operational Days and Times**

   - Appointments can only be booked on configured operational days.
   - Appointments can only be booked within configured operational time periods.
   - The entire appointment duration must fit within the operational time period.

4. **Unavailable Dates**

   - Administrators can configure specific dates as unavailable.
   - No booking is allowed on an unavailable date, regardless of the configured operational day or time.

5. **Maximum Booking Capacity**

   - Each appointment can define a `maxBookingPerTimeSlot`.
   - Multiple customers may book the same appointment and start time until the maximum capacity is reached.
   - Once the capacity is reached, subsequent requests are rejected.

6. **Appointment Overlap**

   - Different appointments cannot overlap for the same time period.
   - For example, if an appointment occupies `10:00–10:35`, another appointment cannot be booked during any overlapping period.
   - The overlap check considers the actual appointment duration rather than only the start time.

7. **Concurrency Scenario**

   - The system is designed to handle multiple users attempting to book the same appointment and time slot concurrently.
   - For example, if the maximum capacity is 5 and 10 concurrent requests are submitted for the same appointment and start time, only 5 requests should succeed and the remaining requests should be rejected.

8. **Concurrency Control**

   - A database transaction and row-level locking are used to prevent race conditions during concurrent booking requests.
   - 5-minute `BookingTimeSlot` records are pre-generated for a rolling 30-day period and used as locking resources.
   - The locking records are independent of operational-day and operational-time configuration changes.

9. **Booking Slot Initialization**

   - Booking time-slot records are initialized for the current day and the next 29 days.
   - A scheduled job maintains the rolling 30-day window.
   - The initialization API is provided to allow the records to be generated manually during initial system setup.

10. **Database Constraints**

    - A booking time slot is uniquely identified by its `date` and `startTime`.
    - Database-level constraints are used together with application-level validation to maintain data consistency.

11. **Time Zone**

    - The application uses **Asia/Kuala_Lumpur** as the scheduler time zone.

12. **Authentication**

    - Authentication and authorization are outside the scope of this assignment.
    - The initialization endpoints are intended for development/setup purposes and should be protected or removed in a production environment.

13. **Scope**

    - The implementation focuses on appointment scheduling, availability validation, booking capacity, and concurrent booking handling.
    - Payment processing, cancellation, rescheduling, notifications, and user authentication are outside the scope of this implementation.
