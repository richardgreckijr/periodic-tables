const knex = require("../db/connection");

function list() {
    return knex('reservations')
        .select('*')
        .orderBy('reservation_time')
};

function listByDate(reservation_date) {
    reservation_date = new Date(reservation_date).toJSON().substring(0, 10);
    return knex("reservations")
        .select("*")
        .where({ reservation_date })
        .whereNot({ status: "finished" })
        .whereNot({ status: "cancelled" })
        .orderBy("reservation_time");
};

function read(reservation_id) {
    return knex('reservations')
        .select("*")
        .where({ reservation_id })
        .first()
};

function create(reservation) {
    return knex('reservations')
        .insert(reservation, '*')
        .then((createdRecords) => createdRecords[0])
};

function update(updatedRes) {
    return knex('reservations')
        .select('*')
        .where({ reservation_id: updatedRes.reservation_id })
        .update(updatedRes, '*')
        .then(res => res[0])
};

function updateStatus(reservation_id, status) {
    return knex('reservations')
        .where({ reservation_id })
        .update({ status })
        .then(() => read(reservation_id))
};

function search(mobile_number) {
    return knex("reservations")
        .whereRaw(
            "translate(mobile_number, '() -', '') like ?",
            `%${mobile_number.replace(/\D/g, "")}%`
        )
        .orderBy("reservation_date");
}

function destroy(reservation_id) {
    return knex('reservations')
        .select('*')
        .where({ reservation_id })
        .del()
};


module.exports = {
    list,
    listByDate,
    read,
    create,
    updateStatus,
    search,
    destroy,
    update
};