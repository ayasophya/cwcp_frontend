import React, { createContext, useContext, useState, useEffect } from 'react'
import Cookies from 'js-cookie'
import { APIDomain } from '../Components/Constants'
//import axios from 'axios'

// @ts-ignore
const AuthContext = createContext()

// @ts-ignore
const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return Boolean(Cookies.get('isAuthenticated')) || false
    })

    const [accessToken, setAccessToken] = useState(() => {
        return (
            Cookies.get('id_token')
        )
    })

    useEffect(() => {
        setAccessToken(Cookies.get('id_token'))
    }, [accessToken])

    useEffect(() => {
        setIsAuthenticated(Boolean(Cookies.get('isAuthenticated')))
    }, [isAuthenticated])

    useEffect(() => {
        console.log('isAuthenticated: ' + Cookies.get('isAuthenticated'))
        if (Cookies.get('isAuthenticated') === undefined) {
            setIsAuthenticated(false)
        } else {
            console.log(
                'isAuthenticated: ' + Boolean(Cookies.get('isAuthenticated'))
            )
            setIsAuthenticated(Boolean(Cookies.get('isAuthenticated')))
        }
        console.log('isAuthenticated: ' + isAuthenticated)
    }, [isAuthenticated])

    const login = () => {
        window.location.href = `${APIDomain}/oauth2/authorization/okta`
    }

    const authError = (status) => {
        if (status === 401) {
            window.location.href =
                `${APIDomain}/oauth2/authorization/okta`
        } else if (status === 403) {
            window.location.href = '/403'
        } else {
            console.log('Error: ' + status)
        }
    }

    const userRoles = () => {
        if (Cookies.get('accessPermission') === undefined) {
            return []
        }
        return Cookies.get('accessPermission')
    }

    const getAccessToken = () => {
        return accessToken
    }

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                login,
                authError,
                getAccessToken,
                userRoles,
                //getUserInfo,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}

export { AuthProvider, useAuth }