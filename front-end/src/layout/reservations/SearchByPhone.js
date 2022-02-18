import React, { useState } from 'react';
import ErrorAlert from '../errorHandling/ErrorAlert';
import Reservations from '../reservations/Reservations';
import { listReservations } from '../../utils/api';

export default function Search() {
    const [number, setNumber] = useState('');
    const [error, setError] = useState(null);
    const [found, setfound] = useState(false);
    const [reservations, setReservations] = useState([]);

    async function handleSubmit(event) {
        event.preventDefault()
        const abortController = new AbortController();
        setfound(false)
        try {
            const response = await listReservations({ mobile_number: number }, abortController.signal)
            setReservations(response)
            setfound(true)
            setNumber('')
        } catch (error) {
            setError(error)
        }
        return () => abortController.abort()
    };

    function handleChange({ target }) {
        setNumber(target.value)
    };

    return (
        <div className='m-4 mh-100'>
            <ErrorAlert error={error} />
            <h2 className='text-center'>Search By Phone Number</h2>
            <form
                className='d-flex m-3'
                onSubmit={handleSubmit}>
                <input
                    className='form-control'
                    type='text'
                    name='mobile_number'
                    value={number}
                    onChange={handleChange}
                    placeholder="Enter a customer's phone number"
                    required
                />
                <button
                    className='btn btn-primary mx-4'
                    type='submit'>
                    Find
                </button>
            </form>
            {reservations.length > 0 ? (
                <Reservations reservations={reservations} />
            ) : found && reservations.length === 0 ? (
                <p>No reservations found</p>
            ) : ('')}
        </div>
    );
};