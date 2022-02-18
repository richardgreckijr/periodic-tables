import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import { createReservations } from '../../utils/api';
import ErrorAlert from '../errorHandling/ErrorAlert';
import ReservationForm from './ReservationForm';

/** 
 * Create new reservation using form input
 */

export default function NewReservation(){
   const intialFormState = {
        first_name: '',
        last_name: '',
        mobile_number: '',
        reservation_date: '',
        reservation_time: '',
        people: '', 
   };
   
   const history = useHistory();
   const [error, setError] = useState(null);
   const [formData, setFormData] = useState({ ...intialFormState });

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
        event.preventDefault();
        const controller = new AbortController();
        try {
            const res = await createReservations(formData, controller.signal);
            history.push(`/dashboard?date=${formData.reservation_date}`);
            return res;
        } catch (error) {
            setError(error);
        } return () => controller.abort();
    };

    return (
        <div className="m-4">
            <h2>New Reservation</h2>
            <ErrorAlert error={error} />
            <ReservationForm
                handleChange={handleChange}
                handleNumber={handleNumber}
                handleSubmit={handleSubmit}
                formData={formData}
                history={history}
            />
        </div>
    );
};