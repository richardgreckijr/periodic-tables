const service = require("./tables.service");
const reservationsService = require("../reservations/reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

/**
 * Middleware 
 */

function reservationIdExists(req, res, next) {
    if (!(req.body.data) || !(req.body.data.reservation_id)) {
        return next({
            status: 400,
            message: "reservation_id must exist."
        })
    }
    next();
}

async function reservationExists(req, res, next) {
    const { reservation_id } = req.body.data;
    const data = await reservationsService.read(reservation_id);
    if (data) {
        res.locals.reservation = data;
        return next();
    }
    next({
        status: 404,
        message: `Reservation ${reservation_id} cannot be found.`
    });
}

async function tableExists(req, res, next) {
    const { table_id } = req.params;
    const data = await service.read(table_id);
    if (data) {
        res.locals.table = data;
        return next();
    }
    next({
        status: 404,
        message: `Table ${table_id} cannot be found.`
    });
}

function tableHasReservation(req, res, next) {
    const { reservation_id } = res.locals.table;
    if (!reservation_id) {
        return next({
            status: 400,
            message: `The table you selected is not occupied by any reservation.`,
        });
    }
    next();
}

function isNotOccupied(req, res, next) {
    if (res.locals.table.reservation_id) {
        return next({
            status: 400,
            message: "The table yous selected is currently occupied.",
        });
    }
    next();
}

function hasCapacity(req, res, next) {
    if (res.locals.reservation.people > res.locals.table.capacity) {
        return next({
            status: 400,
            message: "The table you selected does not have the capacity to suppport your party.",
        });
    }
    next();
}

function isValidTable(req, res, next) {
    const requiredFields = ["table_name", "capacity"]
    if (!req.body.data) {
        return next({
            status: 400,
            message: `Can not submit an empty form.`,
        });
    }
    for (const field of requiredFields) {
        if (!req.body.data[field]) {
            return next({
                status: 400,
                message: `The order must include ${field}`,
            });
        }
    }
    if (typeof req.body.data.capacity !== "number") {
        return next({
            status: 400,
            message: `The capacity entered must be numeric`,
        })
    }
    if (req.body.data.table_name.length <= 1) {
        return next({
            status: 400,
            message: `The table_name entered must be greater than one character.`,
        });
    } next();
}

function reservationNotSeated(req, res, next) {
    const { status } = res.locals.reservation;
    if (status === "seated") {
        return next({
            status: 400,
            message: "Reservation has already been seated."
        })
    } next();
}

/**
 *  CRUDL Operations
 * */

async function update(req, res) {
    const { reservation_id } = req.body.data;
    const updatedTable = {
        ...res.locals.table,
        reservation_id: reservation_id,
        status: "occupied",
    };
    res.status(200).json({ data: await service.update(updatedTable, reservation_id) });
}

async function destroy(req, res) {
    const table = await service.read(req.params.table_id);
    const { reservation_id } = res.locals.table;
    await reservationsService.updateStatus(table.reservation_id, 'finished');
    res.json({ data: await service.destroy(table.table_id, reservation_id) })
}

async function create(req, res) {
    res.status(201).json({ data: await service.create(req.body.data) });
}

async function list(req, res) {
    res.json({ data: await service.list() });
}

module.exports = {
    update: [
        reservationIdExists,
        asyncErrorBoundary(reservationExists),
        asyncErrorBoundary(tableExists),
        isNotOccupied,
        hasCapacity,
        reservationNotSeated,
        asyncErrorBoundary(update),
    ],
    create: [
        isValidTable,
        asyncErrorBoundary(create)
    ],
    list: asyncErrorBoundary(list),
    delete: [
        asyncErrorBoundary(tableExists),
        tableHasReservation,
        asyncErrorBoundary(destroy)
    ]
};