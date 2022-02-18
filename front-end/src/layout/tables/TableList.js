import React from 'react';
import Table from './Table';

export default function TableList({ tables }) {
    return (
        <div>
            {tables && (
                <div className='container'>
                    <div className='row d-flex justify-content-center'>
                        {tables.map((table) => (
                            <div key={table.table_id} className='cols-xs-4'>
                                <Table table={table} />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};