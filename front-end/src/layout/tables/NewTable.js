import React, { useState } from 'react';
import ErrorAlert from '../errorHandling/ErrorAlert';
import { useHistory } from 'react-router';
import { createTable } from '../../utils/api';

export default function NewTable() {
    const initialFormState = { table_name: '', capacity: '', };
    const [formData, setFormData] = useState({ ...initialFormState });
    const history = useHistory();
    const [error, setError] = useState(null);

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

    async function handleSubmit(event) {
        event.preventDefault();
        const abortController = new AbortController();
        try {
            await createTable(formData, abortController.signa)
            setFormData({ ...initialFormState })
            history.push('/dashboard')
        } catch (error) {
            setError(error)
        }
        return () => abortController.abort()
    };

    return (
        <div className='m-4'>
            <h2>New Table</h2>
            <ErrorAlert error={error} />
            <form onSubmit={handleSubmit}>
                <div className='form-group'>
                    <label htmlFor='table_name'>Table Name</label>
                    <input
                        type='text'
                        className='form-control'
                        id='table_name'
                        name='table_name'
                        placeholder='Table Name'
                        value={formData.table_name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className='form-group'>
                    <label htmlFor='capacity'>Capacity</label>
                    <input
                        type='number'
                        className='form-control'
                        id='capacity'
                        name='capacity'
                        min={1}
                        placeholder='1'
                        value={formData.capacity}
                        onChange={handleNumber}
                        required
                    />
                </div>
                <button
                    type='submit'
                    className='btn btn-primary mb-4 mr-3'>
                    Submit
                </button>
                <button
                    onClick={history.goBack}
                    className='btn btn-danger mb-4'>
                    Cancel
                </button>
            </form>
        </div>
    );
};