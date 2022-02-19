const service = require('./reservations.service');
const asyncErrorBoundary = require('../errors/asyncErrorBoundary');
const hasProperties = require('../errors/hasProperties');

const hasProps = hasProperties(
  'first_name',
  'last_name',
  'mobile_number',
  'reservation_date',
  'reservation_time',
  'people',
);

const VALID_PROPERTIES = [
  'first_name',
  'last_name',
  'mobile_number',
  'reservation_date',
  'reservation_time',
  'people',
  'status'
];

const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
dayjs.extend(utc);

function hasOnlyValidProperties(req, res, next) {
  const { data = {} } = req.body;
  const invalidFields = Object.keys(data).filter(
    (field) => !VALID_PROPERTIES.includes(field)
  );

  if (invalidFields.length) {
    return next({
      status: 400,
      message: `Invalid field(s): ${invalidFields.join(", ")}`,
    });
  }
  next();
};

async function list(req, res) {
  const { date, viewDate, mobile_number } = req.query;
  if (date) {
    const data = await service.listByDate(date);
    res.json({ data });
  } else if (viewDate) {
    const data = await service.listByDate(viewDate);
    res.json({ data });
  } else if (mobile_number) {
    const data = await service.search(mobile_number);
    res.json({ data });
  } else {
    const data = await service.list();
    res.json({ data });
  }
}

function hasData(req, res, next) {
  const data = req.body.data
  if (!data) {
    return next({
      status: 400,
      message: `Request body must have data.`,
    })
  }
  next()
};

function hasValidPeople(req, res, next) {
  const { data: { people } } = req.body
  if (typeof people !== 'number' || people <= 0) {
    return next({
      status: 400,
      message: "'people' must be a number and be greater than 1"
    })
  }
  next()
};

function resMustBeInPast(req, res, next) {
  const { reservation_date, reservation_time } = req.body.data;
  const today = Date.now();
  const newReservationDate = new Date(
    `${reservation_date} ${reservation_time}`
  ).valueOf();
  if (newReservationDate > today) {
    return next();
  }
  next({
    status: 400,
    message: `reservation_time must be in the past. Please select a date in the future.`,
  });
};

function hasValidDate(req, res, next) {
  const { data: { reservation_date, reservation_time } } = req.body // UTC
  const trimmedDate = reservation_date.substring(0, 10)
  const dateInput = new Date(`${trimmedDate} ${reservation_time}`) // UTC
  const today = new Date()
  const day = dayjs(dateInput).day()
  const dateFormat = /\d\d\d\d-\d\d-\d\d/

  if (!reservation_date) {
    return next({
      status: 400,
      message: 'reservation_date is empty'
    })
  }
  if (!trimmedDate.match(dateFormat)) {
    return next({
      status: 400,
      message: `reservation_date is invalid`
    })
  }
  if (day === 2) {
    return next({
      status: 400,
      message: `The restaurant is closed on Tuesday.`
    })
  }
  if (res.locals.reservation) {
    return next()
  }
  next()
};

function hasValidTime(req, res, next) {
  const { data: { reservation_time } } = req.body
  const timeFormat = /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/
  if (!reservation_time) {
    return next({
      status: 400,
      message: `reservation_time is empty`
    })
  }
  if (!reservation_time.match(timeFormat)) {
    return next({
      status: 400,
      message: `reservation_time is invalid`
    })
  }
  if (reservation_time <= "10:30:00") {
    return next({
      status: 400,
      message: `reservation_time can't be before 10:30 AM`
    })
  }
  if (reservation_time >= "21:30:00") {
    return next({
      status: 400,
      message: `reservation_time can't be after 9:30 PM`
    })
  }
  next()
};

function hasValidStatus(req, res, next) {
  const { status } = req.body.data
  const statuses = ['booked', 'seated', 'finished', 'cancelled']
  if (statuses.includes(status)) {
    return next()
  }
  next({
    status: 400,
    message: `Unknown Status: ${status}. Status must be one of ${statuses.join(", ")}.`
  })
};

function checkBookedStatus(req, res, next) {
  const { status } = req.body.data
  if (status) {
    if (status !== 'booked') {
      next({
        status: 400,
        message: `New reservation can't have the status: ${status}`
      })
    }
  }
  next()
};

function hasFinishedStatus(req, res, next) {
  const { status } = res.locals.reservation
  if (status === 'finished') {
    return next({
      status: 400,
      message: `A finished reservation cannot be changed.`
    })
  }
  next()
};

async function reservationExists(req, res, next) {
  const { reservationId } = req.params
  const reservation = await service.read(reservationId)

  if (reservation) {
    res.locals.reservation = reservation
    return next()
  }
  next({
    status: 404,
    message: `Reservation not found '${reservationId}'.`
  })
};

// ***** CRUDL Operations ***** //
async function read(req, res) {
  const { reservation } = res.locals
  const data = await service.read(reservation.reservation_id)
  res.json({ data })
};

async function create(req, res) {
  const data = await service.create(req.body.data)
  res.status(201).json({ data })
};

async function updateStatus(req, res) {
  const { reservation_id } = res.locals.reservation
  const { status } = req.body.data
  const data = await service.updateStatus(reservation_id, status)
  res.json({ data })
};

async function update(req, res) {
  const { reservation_id } = res.locals.reservation
  const updatedReservation = {
    ...req.body.data,
    reservation_id,
  }
  const data = await service.update(updatedReservation)
  res.json({ data })
};

async function destroy() {
  const { reservation_id } = res.locals.reservation
  await service.destroy(reservation_id)
  res.sendStatus(204)
};

module.exports = {
  list: asyncErrorBoundary(list),
  read: [
    asyncErrorBoundary(reservationExists),
    asyncErrorBoundary(read)
  ],
  create: [
    hasData,
    hasOnlyValidProperties,
    hasProps,
    checkBookedStatus,
    hasValidDate,
    resMustBeInPast,
    hasValidTime,
    hasValidPeople,
    asyncErrorBoundary(create)
  ],
  updateStatus: [
    asyncErrorBoundary(reservationExists),
    hasValidStatus,
    hasFinishedStatus,
    asyncErrorBoundary(updateStatus)
  ],
  delete: [
    asyncErrorBoundary(reservationExists),
    asyncErrorBoundary(destroy)
  ],
  update: [
    asyncErrorBoundary(reservationExists),
    hasProps,
    checkBookedStatus,
    hasValidDate,
    hasValidTime,
    hasValidPeople,
    asyncErrorBoundary(update)
  ]
};