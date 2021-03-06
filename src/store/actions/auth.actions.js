import * as actionTypes from '../action-types';
import firebase from "../../api/firebase";
import {translate} from "../../utils/translate";
import axios from "axios";

export const authStart = () => ({type: actionTypes.AUTH_START});
export const authSuccess = (token) => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        token: token
    }
};
export const authFail = (error) => ({type: actionTypes.AUTH_FAIL, error});

export const logout = () => {
    localStorage.removeItem('token');
    return {
        type: actionTypes.AUTH_LOGOUT
    };
};

export const checkAuthTimeout = (expirationTime) => {
    return dispatch => {
        setTimeout(() => {
            dispatch(logout());
        }, expirationTime * 1000);
    };
};

const getExpirationDate = (res) => {
    const expireTime = res.claims.exp - res.claims.auth_time;
    return new Date(new Date().getTime() + expireTime * 1000);
};

export const login = (values) => {
    return dispatch => {
        dispatch(authStart());

        firebase.auth().signInWithEmailAndPassword(values.email, values.password)
            .then(res => {
                res.user.getIdTokenResult()
                    .then(res => {
                        localStorage.setItem('token', res.token);
                        localStorage.setItem('expirationDate', getExpirationDate(res));
                        dispatch(authSuccess(res.token));
                        dispatch(checkAuthTimeout(res.claims.exp - res.claims.auth_time));
                    });
            })
            .catch(function (error) {
                dispatch(authFail(translate(error.code)));
            });
    };
};

export const register = (values) => {
    return dispatch => {
        dispatch(authStart());
        firebase.auth().createUserWithEmailAndPassword(values.email, values.password)
            .then(result => {
                result.user.getIdTokenResult()
                    .then(res => {
                        localStorage.setItem('token', res.token);
                        localStorage.setItem('expirationDate', getExpirationDate(res));
                        dispatch(checkAuthTimeout(res.claims.exp - res.claims.auth_time));

                        axios.post('https://ironman.coderaf.com/user', {
                            email: values.email,
                            externalId: result.user.uid
                        }, {
                            headers: {
                                'Access-Token': res.token
                            },
                        })
                            .then(function (response) {
                                dispatch(authSuccess(res.token));
                            })
                            .catch(error => {
                                dispatch(authFail(translate(error.code)));
                            });
                    });

            })
            .catch(function (error) {
                dispatch(authFail(translate(error.code)));
            });
    };
};

export const authStateCheck = () => {
    return dispatch => {
        const token = localStorage.getItem('token');
        if (!token) {
            dispatch(logout());
        } else {
            const expirationDate = new Date(localStorage.getItem('expirationDate'));
            if (expirationDate <= new Date()) {
                dispatch(logout());
            } else {
                dispatch(authSuccess(token));
                dispatch(checkAuthTimeout((expirationDate.getTime() - new Date().getTime()) / 1000))
            }
        }
    }
};

export const authClearError = () => ({type: actionTypes.AUTH_CLEAR_ERROR});
