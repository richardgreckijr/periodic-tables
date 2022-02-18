import React, { useState } from 'react';
import { useHistory } from 'react-router';
import ErrorAlert from '../errorHandling/ErrorAlert';
import { cancelReservation } from '../../utils/api';
const dayjs = require('dayjs');
const customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(customParseFormat);

export default function Reservations({ reservations }) {
    const [error, setError] = useState(null);
    const history = useHistory();

    async function handleCancel(reservationId) {
        if (window.confirm('Do you want to cancel this reservation? This cannot be undone.')) {
            try {
                await cancelReservation(reservationId)
                history.go()
            } catch (error) {
                setError(error)
            }
        }
    };

    return (
        <div className='container'>
            <ErrorAlert error={error} />
            <div className='row d-flex justify-content-center'>
                {reservations.map(reservation => (
                    <div className='text-white cols-xs-1' key={reservation.reservation_id}>
                        {(reservation.status !== 'finished' && reservation.status !== 'cancelled') && (
                            <div className='bg-success m-4 p-3 rounded'>
                                <div className='text-center'>
                                    <p>First Name: {reservation.first_name}</p>
                                    <p>Last Name: {reservation.last_name}</p>
                                    <p>Mobile Number: {reservation.mobile_number}</p>
                                    <p>Reservation Date: {dayjs(reservation.reservation_date).format('MM/DD/YYYY')}</p>
                                    <p>Reservation Time: {reservation.reservation_time}</p>
                                    <p>People: {reservation.people}</p>
                                    <p data-reservation-id-status={`${reservation.reservation_id}`}>
                                        Status: {reservation.status}</p>
                                    <div>
                                        <a
                                            className='btn btn-dark mx-1 rounded-pill shadow-none'
                                            href={`/reservations/${reservation.reservation_id}/edit`}>
                                            Edit
                                        </a>
                                        {reservation.status === 'booked' && (
                                            <a
                                                className='btn btn-dark mx-3 rounded-pill shadow-none'
                                                href={`/reservations/${reservation.reservation_id}/seat`}>
                                                Seat
                                            </a>
                                        )}
                                        <button
                                            className='btn btn-dark mx-1 rounded-pill shadow-none'
                                            onClick={() => handleCancel(reservation.reservation_id)}
                                            data-reservation-id-cancel={reservation.reservation_id}>
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

        </div>
    );
};