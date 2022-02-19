import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { today } from '../utils/date-time';
import Dashboard from './dashboard/Dashboard';
import NotFound from './errorHandling/NotFound';
import NewTable from './tables/NewTable';

import SeatReservation from './reservations/SeatReservation';
import SearchByPhone from './reservations/SearchByPhone';
import EditReservation from './reservations/EditReservation';
import NewReservation from './reservations/NewReservation';

/**
 * Defines all the routes for the application.
 * @returns {JSX.Element}
 */
function Routes() {
  return (
    <Switch>
      <Route exact={true} path='/'>
        <Redirect to={'/dashboard'} />
      </Route>
      <Route exact={true} path='/reservations/new'>
        <NewReservation />
      </Route>
      <Route exact={true} path='/reservations/:reservationId/seat'>
        <SeatReservation />
      </Route>
      <Route exact={true} path='/reservations/:reservationId/edit'>
        <EditReservation />
      </Route>
      <Route exact={true} path='/reservations'>
        <Redirect to={'/dashboard'} />
      </Route>
      <Route exact={true} path='/tables/new'>
        <NewTable />
      </Route>
      <Route exact={true} path='/search'>
        <SearchByPhone />
      </Route>
      <Route path='/dashboard'>
        <Dashboard date={today()} />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;