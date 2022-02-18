import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router';
import { readReservation, updateReservation } from '../../utils/api';

import ErrorAlert from '../errorHandling/ErrorAlert';
import ReservationForm from './ReservationForm';

/**
 * 
 * @returns Reservation form to adjust and edit to the reservation.
 */

export default function EditReservation() {
    const dayjs = require('dayjs');
    const initialFormState = {
        first_name: '',
        last_name: '',
        mobile_number: '',
        reservation_date: '',
        reservation_time: '',
        people: '',
    };
    const history = useHistory();
    const { reservationId } = useParams();
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({ ...initialFormState });

    useEffect(() => {
        const abortController = new AbortController();
        async function getData() {
            try {
                if (reservationId) {
                    const res = await readReservation(reservationId, abortController.signal);
                    setFormData(res);
                } else {
                    setFormData({ ...initialFormState });
                }
            } catch (error) {
                setError(error);
            }
        } getData();
        return () => abortController.abort();
        // eslint-disable-next-line
    }, [reservationId]);

    const handleChange = ({ target }) => {
        setFormData({
            ...formData,
            [target.name]: target.value,
        });
    };

    const handleNumber = ({ target }) => {
        setFormData({
            ...formData,
            [target.name]: Number(target.value)
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault()
        const controller = new AbortController()
        try {
            const res = await updateReservation(formData, controller.signal);
            history.push(`/dashboard?date=${dayjs(formData.reservation_date).format('YYYY-MM-DD')}`);
            return res
        } catch (error) {
            setError(error);
        }
        return () => controller.abort();
    }

    return (
        <div className='m-4'>
            <h2>Edit Reservation</h2>
            <ErrorAlert error={error} />
            <ReservationForm
                handleSubmit={handleSubmit}
                handleNumber={handleNumber}
                handleChange={handleChange}
                formData={formData}
                history={history}
            />
        </div>
    )
}