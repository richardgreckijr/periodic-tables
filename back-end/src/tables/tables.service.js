const knex = require("../db/connection");

function read(tableId) {
    return knex("tables")
        .select("*")
        .where({ table_id: tableId })
        .first();
}

function update({ table_id, reservation_id }) {
    return knex.transaction((trx) => {
        return knex('reservations')
            .transacting(trx)
            .where({ reservation_id: reservation_id })
            .update({ status: 'seated' })
            .then(() => {
                return knex('tables')
                    .where({ table_id: table_id })
                    .update({ reservation_id: reservation_id })
                    .returning('*');
            })
            .then(trx.commit)
            .catch(trx.rollback);
    });
}

function create(table) {
    return knex("tables as t")
        .insert(table)
        .returning("*")
        .then((createdRecords) => createdRecords[0]);
}

function destroy(table_id) {
    knex('tables')
        .where('table_id', table_id)
        .update({ reservation_id: null, occupied: false })
        .returning('*');
}

function list() {
    return knex("tables")
        .orderBy("table_name", "asc");
}

module.exports = {
    list,
    create,
    read,
    update,
    destroy
};