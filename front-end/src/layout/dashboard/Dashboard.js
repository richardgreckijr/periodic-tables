import React, { useEffect, useState } from 'react';
import { listReservations, listTables } from '../../utils/api';
import { previous, next, today } from '../../utils/date-time';
import { useHistory } from 'react-router';

import ErrorAlert from '../errorHandling/ErrorAlert';
import useQuery from '../../utils/useQuery';
import Reservations from '../reservations/Reservations';
import TableList from '../tables/TableList';

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */

export default function Dashboard() {
  const query = useQuery();
  const history = useHistory();
  const dayjs = require('dayjs');
  const [tables, setTables] = useState([]);
  const [error, setError] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [date, setDate] = useState(query.get('date') || today());

  useEffect(loadDashboard, [date]);
  useEffect(loadTables, []);

  function loadTables() {
    const abortController = new AbortController();
    listTables(abortController.signal)
      .then(setTables)
      .catch(setError);
    return () => abortController.abort();
  };

  function loadDashboard() {
    const abortController = new AbortController();
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setError);
    return () => abortController.abort();
  };

  function handleDateChange({ target }) {
    setDate(target.value);
  };

  function handlePreviousDate() {
    setDate(previous(date))
    history.push(`dashboard?date=${previous(date)}`)
  };
  function handleNextDate() {
    setDate(next(date))
    history.push(`dashboard?date=${next(date)}`)
  };

  return (
    <main>
      <div className='dashboard-header text-center px-4 py-4'>
        <h1 >Dashboard</h1>
        <div>
          <label 
          className='mx-2' 
          htmlFor='reservation_date'>
            Choose date:
          </label>
          <input
            className='px-2 rounded'
            type='date'
            pattern='\d{4}-\d{2}-\d{2}'
            name='reservation_date'
            onChange={handleDateChange}
            value={date}
          />
        </div>
        <div>
          <h4>Reservations for {dayjs(date).format('YYYY-MM-DD')}</h4>
        </div>
        <div>
          <div>
            <button
              className='btn btn-dark mb-4 mr-3'
              onClick={() => handlePreviousDate(date)}
            >
              Previous
            </button>
            <button
              className='btn btn-dark mb-4 mr-3'
              onClick={() => setDate(today())}
            >
              Today
            </button>
            <button
              className='btn btn-dark mb-4 mr-3'
              onClick={() => handleNextDate(date)}
            >
              Next
            </button>
          </div>
        </div>
      </div>
      <ErrorAlert error={error} />
      <Reservations reservations={reservations} />
      <h2 className='text-center my-3'>Tables</h2>
      <TableList tables={tables} />
    </main>
  );
};

