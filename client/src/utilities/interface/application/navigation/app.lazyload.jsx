import React, { Suspense } from 'react'
import { ErrorBoundary } from "react-error-boundary"
import { useNavigate } from "react-router-dom"
import AppErrorFallback from "../errormgmt/app.fallback"
import AppSuspense from "../errormgmt/app.suspense"

const AppLazy = ({ children }) => {
    const navigate = useNavigate()

    return (
        <ErrorBoundary FallbackComponent={AppErrorFallback} onReset={() => navigate('/dashboard')}>
            <Suspense fallback={<AppSuspense />}>
                {children}
            </Suspense>
        </ErrorBoundary>
    )
}

export default AppLazy