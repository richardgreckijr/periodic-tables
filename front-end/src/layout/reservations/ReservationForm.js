import React from 'react';

export default function
    ReservationForm({ handleSubmit, handleNumber, handleChange, formData, history,
    }) {
    const date = `${formData.reservation_date}`.substring(0, 10)
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="first_name">First Name</label>
                    <input
                        type='text'
                        className='form-control'
                        id='first_name'
                        name='first_name'
                        placeholder='First Name'
                        value={formData.first_name}
                        onChange={handleChange}
                        required />
                </div>
                <div className="form-group">
                    <label htmlFor="last_name">Last Name</label>
                    <input
                        type='text'
                        className='form-control'
                        id='last_name'
                        name='last_name'
                        placeholder='Last Name'
                        value={formData.last_name}
                        onChange={handleChange}
                        required />
                </div>
                <div className="form-group">
                    <label htmlFor="mobile_number">Mobile Number</label>
                    <input
                        type='tel'
                        className='form-control'
                        id='mobile_number'
                        name='mobile_number'
                        placeholder='123-456-7890'
                        value={formData.mobile_number}
                        onChange={handleChange}
                        required />
                </div>
                <div className="form-group">
                    <label htmlFor="reservation_date">Reservation Date</label>
                    <input
                        type='date'
                        className='form-control'
                        id='reservation_date'
                        name='reservation_date'
                        pattern='\d{4}-\d{2}-\d{2}'
                        value={date}
                        onChange={handleChange}
                        required />
                </div>
                <div className="form-group">
                    <label htmlFor="reservation_time">Reservation Time</label>
                    <input
                        type='time'
                        className='form-control'
                        id='reservation_time'
                        name='reservation_time'
                        pattern='[0-9]{2}:[0-9]{2}'
                        value={formData.reservation_time}
                        onChange={handleChange}
                        required />
                </div>
                <div className="form-group">
                    <label htmlFor="people">Party Size</label>
                    <input
                        type='number'
                        className='form-control'
                        id='people'
                        name='people'
                        min={1}
                        placeholder="1"
                        value={formData.people}
                        onChange={handleNumber}
                        required />
                </div>
                <div className="mt-4">
                    <button
                        type='submit'
                        className="btn btn-primary mb-4 mr-3">
                        Submit
                    </button>
                    <button
                        type="button"
                        onClick={() => history.goBack()}
                        className="btn btn-danger mb-4 mr-3">
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    )
}