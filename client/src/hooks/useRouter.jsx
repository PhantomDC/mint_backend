import React from 'react';
import { Navigate, Route } from 'react-router-dom';
import { Login, Mints, WhiteList, Settings } from '../pages';

export const useRouter = (isAuth) => {
    if (isAuth) {
        return (
            <>
                <Route path="/mints" element={<Mints />} />
                <Route path="/white-list" element={<WhiteList />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="*" element={<Navigate to="/mints" />} />
            </>
        )
    }

    return (
        <>
            <Route path="/" element={<Login />} />
            <Route path="*" element={<Navigate to="/" />} />
        </>
    )
}