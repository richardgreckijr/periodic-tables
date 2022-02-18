/**
 * Defines the base URL for the API.
 * The default values is overridden by the `API_BASE_URL` environment variable.
 */
import formatReservationDate from "./format-reservation-date";
import formatReservationTime from "./format-reservation-date";
const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

/**
 * Defines the default headers for these functions to work with `json-server`
 */
const headers = new Headers();
headers.append("Content-Type", "application/json");

/**
 * Fetch `json` from the specified URL and handle error status codes and ignore `AbortError`s
 *
 * This function is NOT exported because it is not needed outside of this file.
 *
 * @param url
 *  the url for the requst.
 * @param options
 *  any options for fetch
 * @param onCancel
 *  value to return if fetch call is aborted. Default value is undefined.
 * @returns {Promise<Error|any>}
 *  a promise that resolves to the `json` data or an error.
 *  If the response is not in the 200 - 399 range the promise is rejected.
 */
async function fetchJson(url, options, onCancel) {
  try {
    const response = await fetch(url, options);

    if (response.status === 204) {
      return null;
    }

    const payload = await response.json();

    if (payload.error) {
      return Promise.reject({ message: payload.error });
    }
    return payload.data;
  } catch (error) {
    if (error.name !== "AbortError") {
      console.error(error.stack);
      throw error;
    }
    return Promise.resolve(onCancel);
  }
};

/**
 * Retrieves all existing reservation.
 * @returns {Promise<[reservation]>}
 *  a promise that resolves to a possibly empty array of reservation saved in the database.
 */
export async function listReservations(params, signal) {
  if (params) {
    const url = new URL(`${API_BASE_URL}/reservations`);
    Object.entries(params).forEach(([key, value]) =>
      url.searchParams.append(key, value.toString())
    );
    return await fetchJson(url, { headers, signal }, [])
      .then(formatReservationDate)
      .then(formatReservationTime);
  } else {
    const url = `${API_BASE_URL}/reservations`;
    return await fetchJson(url, { headers, signal }, []);
  }
};

/**
 * POST
 * Creates and adds a new reservation to the database.
 * @param reservation the new data to be added
 * @param signal AbortController incase of cancelled fetch.
 * @returns {Promise<Reservation>} a promise that resolves the saved reservation.
 */
export async function createReservations(reservation, signal) {
  const url = `${API_BASE_URL}/reservations`
  const options = {
    method: 'POST',
    headers,
    body: JSON.stringify({ data: reservation }),
    signal,
  }
  return await fetchJson(url, options, {})
};

/**
 * GET
 * Retrieves a reservation from the database.
 * @param reservationId The id of reservation thats being requested.
 * @param signal AbortController incase of cancelled fetch.
 * @returns {Promise<Reservation>} a promise that resolves the saved reservation.
 */
export async function readReservation(reservationId, signal) {
  const url = `${API_BASE_URL}/reservations/${reservationId}`
  const options = {
    method: 'GET',
    headers,
    signal,
  }
  return await fetchJson(url, options)
};

/**
 * PUT
 * Updates a reservation in the database.
 * @param reservation The reservation to be updated.
 * @param signal AbortController incase of cancelled fetch.
 * @returns {Promise<Reservation>} a promise that resolves the saved/updated reservation.
 */
export async function updateReservation(reservation, signal) {
  const url = `${API_BASE_URL}/reservations/${reservation.reservation_id}`
  const options = {
    method: 'PUT',
    headers,
    body: JSON.stringify({ data: reservation }),
    signal,
  }
  return await fetchJson(url, options, reservation)
};

/**
 * PUT
 * Changes status of a reservation in the database.
 * @param reservationId The reservation to be updated.
 * @param signal AbortController incase of cancelled fetch.
 * @returns {Promise<Reservation>} a promise that resolves the saved/updated reservation.
 */
export async function cancelReservation(reservationId, signal) {
  const url = `${API_BASE_URL}/reservations/${reservationId}/status`
  const options = {
    method: 'PUT',
    headers,
    body: JSON.stringify({ data: { status: 'cancelled' } }),
    signal
  }
  return await fetchJson(url, options)
};

/**
 * DELETE
 * Removes a reservation from the database.
 * @param reservationId 
 */
export async function deleteReservation(reservationId) {
  const url = `${API_BASE_URL}/reservations/${reservationId}`
  const options = {
    method: 'DELETE'
  }
  return await fetchJson(url, options)
};

/**
 * GET
 * Request to retrieve all existing tables.
 * @param signal AbortController incase of cancelled fetch.
 * @returns {Promsise<Table>}
 */
export async function listTables(signal) {
  const url = `${API_BASE_URL}/tables`
  return await fetchJson(url, { signal })
};

/**
 * POST
 * Request to create a new table in the database.
 * @param table Table to be created.
 * @param signal AbortController incase of cancelled fetch.
 * @returns {Promise<Table>}
 */
export async function createTable(table, signal) {
  const url = `${API_BASE_URL}/tables`
  const options = {
    method: 'POST',
    headers,
    body: JSON.stringify({ data: table }),
    signal
  }
  return await fetchJson(url, options)
};

/**
 * PUT
 * Request to update an existing table's reservation_id in the database
 * @param reservationId reservation_id to be updated to table.
 * @param tableId Table to be updated.
 * @param signal AbortController incase of cancelled fetch.
 * @returns {Promise<Table>}
 */
export async function updateTable(reservationId, tableId, signal) {
  const url = `${API_BASE_URL}/tables/${tableId}/seat`
  const options = {
    method: 'PUT',
    headers,
    body: JSON.stringify({ data: { reservation_id: reservationId }, }),
    signal,
  }
  return await fetchJson(url, options)
};

/**
 * DELETE
 * Request to delete an existing table from the database.
 * @param tableId Table to be removed.
 */
export async function deleteTable(tableId) {
  const url = `${API_BASE_URL}/tables/${tableId}/seat`
  const options = {
    method: 'DELETE'
  }
  return await fetchJson(url, options)
};