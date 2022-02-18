import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import ErrorAlert from '../errorHandling/ErrorAlert';
import { listReservations, listTables, deleteTable } from '../../utils/api';

export default function Table({ table, index }) {
    const history = useHistory();
    const [error, setError] = useState(null);
    const [reservations, setReservations] = useState([]);

    useEffect(() => {
        const abortController = new AbortController()
        function loadReservations() {
            listReservations()
                .then(setReservations)
                .catch(setError)
        } loadReservations()
        return () => abortController.abort()
    }, []);

    useEffect(() => {
        const abortController = new AbortController()

        function loadTables() {
            listTables(abortController.signal).catch(setError)
        }
        loadTables()
        return () => abortController.abort()
    }, []);

    async function handleFinish(tableId) {
        const abortController = new AbortController();
        try {
            if (window.confirm('Is this table ready to seat new guests? This action cannot be undone.')) {
                await deleteTable(tableId)
                history.go()
            }
        } catch (error) {
            setError(error)
        }
        return () => abortController.abort()
    };

    const userRes = reservations.find(res => Number(table.reservation_id) === Number(res.reservation_id));
    return (
        <div className='bg-secondary m-4 p-5 rounded'>
            <div
                className='text-center text-white'
                key={index}>
                <ErrorAlert error={error} />
                <div>
                    <h2>Table Name: {table.table_name}</h2><hr />
                    <p>Capacity: {table.capacity}</p>
                    <p data-table-id-status={`${table.table_id}`}> Status: {table.reservation_id ? 'Occupied' : 'Free'}</p>
                    {userRes && (
                        <p>{userRes.first_name} {userRes.last_name}</p>
                    )}{table.reservation_id && (
                        <button
                            className='btn btn-dark mx-1 rounded-pill shadow-none'
                            type='submit' data-table-id-finish={`${table.table_id}`}
                            onClick={() => handleFinish(table.table_id)}
                        >Finish</button>
                    )}
                </div>
            </div>
        </div>
    );
};