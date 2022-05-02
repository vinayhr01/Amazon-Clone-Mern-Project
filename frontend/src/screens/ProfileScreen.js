import React, { useContext, useReducer, useState } from 'react';
import { Store } from '../Store';
import { Helmet } from 'react-helmet-async';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { toast } from 'react-toastify';
import { getError } from '../utils';
import axios from 'axios';

const reducer = (state, action) => {
    switch (action.type) {
        case 'UPDATE_REQUEST':
            return { ...state, loadingUpdate: true };
        case 'UPDATE_SUCCESS':
            return { ...state, loadingUpdate: false };
        case 'UPDATE_FAILURE':
            return { ...state, loadingUpdate: false };
        default:
            return state;
    }
}

export default function ProfileScreen() {
    const { state, dispatch: ctxDispatch } = useContext(Store);
    const { UserInfo } = state;
    const [name, setName] = useState(UserInfo.name);
    const [email, setEmail] = useState(UserInfo.email);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [{ loadingUpdate }, dispatch] = useReducer(reducer, {
        loadingUpdate: false
    })

    const SubmitHandler = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.put('/api/users/profile', {
                name,
                email,
                password,
            },
                {
                    headers: { authorization: `Bearer ${UserInfo.token}` }
                }
            );
            dispatch({
                type: 'UPDATE_SUCCESS'
            })
            ctxDispatch({
                type: 'USER_SIGNIN', payload: data
            })
            localStorage.setItem('UserInfo', JSON.stringify(data));
            toast.success('Profile updated successfully');
        }
        catch (err) {
            dispatch({
                type: 'FETCH_FAIL',
            })
            toast.error(getError(err)); // getError is a helper function
        }
    }
    return (
        <div className='container small-container'>
            <Helmet>
                <title>Profile</title>
            </Helmet>
            <h1 className='my-3'>Profile</h1>
            <form onSubmit={SubmitHandler}>
                <Form.Group className='mb-3' controlId='name'>
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group className='mb-3' controlId='email'>
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type='email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group className='mb-3' controlId='password'>
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type='password'
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group className='mb-3' controlId='confirmpassword'>
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                        type='password'
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </Form.Group>
                <div className='mb-3'>
                    <Button type='submit'>Update</Button>
                </div>
            </form>
        </div>
    )
}
