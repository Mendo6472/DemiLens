'use client'

import React, { useState } from 'react';
import axios from 'axios';
const packageJson = require('../../package.json');
const proxy = packageJson.proxy;

const YourFormComponent = () => {
    const [formData, setFormData] = useState({
        query: '',
        username: '',
        query_comment: '',
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        e.preventDefault();
        try {
            const response = await axios.post(proxy + '/api/db/add/query', formData);
                        
            alert('Form submitted successfully');
        } catch (error) {
            console.error('Error submitting form:', error.message);

            alert('Error submitting form');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Query:
                <input type="text" name="query" value={formData.query} onChange={handleChange} />
            </label>
            <label>
                Username:
                <input type="text" name="username" value={formData.username} onChange={handleChange} />
            </label>
            <label>
                Comment:
                <textarea name="query_comment" value={formData.comment} onChange={handleChange} />
            </label>
            <button type="submit">Submit</button>
        </form>
    );
};

export default YourFormComponent;
