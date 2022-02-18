import React, { useEffect, useState } from 'react';
import { listTables, updateTable } from '../../utils/api';
import { useHistory, useParams } from 'react-router';
import ErrorAlert from '../errorHandling/ErrorAlert';

export default function SeatReservation() {
    const history = useHistory();
    const { reservationId } = useParams();
    const [tables, setTables] = useState([]);
    const [error, setError] = useState(null);
    const [selectOptions, setSelectOptions] = useState('');

    useEffect(() => {
        const abortController = new AbortController();
        setError(null);
        async function loadTables() {
            try {
                const res = await listTables(abortController.signal)
                setTables(res)
            } catch (error) {
                setError(error)
            }
        }
        loadTables()
        return () => abortController.abort();
    }, [])

    function changeHandler({ target }) {
        setSelectOptions({
            [target.name]: target.value
        });
    };

    function handleSubmit(event) {
        event.preventDefault();
        const abortController = new AbortController();
        updateTable(reservationId, Number(selectOptions.table_id), abortController.signal)
            .then(() => history.push('/dashboard'))
            .catch(setError)
        return () => abortController.abort()
    };

    return (
        <div className='text-center m-4'>
            <ErrorAlert error={error} />
            <h1>Seat Reservation</h1>
            <form onSubmit={handleSubmit}>
                <h2>Table name - Table capacity</h2>
                {tables && (
                    <div>
                        <select
                            className='rounded m-4'
                            name='table_id'
                            required
                            onChange={changeHandler}>
                            <option value=''>Choose a Table</option>
                            {tables.map(table => (
                                <option value={table.table_id} key={table.table_id}>
                                    {table.table_name} - {table.capacity}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
                <button
                    className='btn btn-primary mx-2'
                    type='submit'>
                    Submit</button>
                <button
                    className='btn btn-danger mx-2'
                    onClick={history.goBack}>
                    Cancel</button>
            </form>
        </div>
    );
};