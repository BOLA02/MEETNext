"use client" // Add this if using App Router
import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Loader2 } from "lucide-react" // Optional: for loading spinner

export default function AuthCallback() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [status, setStatus] = useState("Processing login...")
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const handleAuthCallback = async () => {
            try {
                // Extract auth data from URL parameters
                const token = searchParams.get("token")
                const userId = searchParams.get("userId")
                const role = searchParams.get("role")
                const staySignedIn = searchParams.get("staySignedIn") === "true"
                const returnUrl = searchParams.get("returnUrl") || "/dashboard"

                console.log("Auth callback received:", { token: !!token, userId, role })

                // Validate required parameters
                if (!token || !userId || !role) {
                    throw new Error("Missing authentication data")
                }

                // // Optional: Validate token with your backend
                // const isValidToken = await validateToken(token)
                // if (!isValidToken) {
                //     throw new Error("Invalid authentication token")
                // }

                // Store authentication data in localStorage
                localStorage.setItem("authToken", token)
                localStorage.setItem("userId", userId)
                localStorage.setItem("userRole", role)
                localStorage.setItem("loggedIn", "true")
                
                if (staySignedIn) {
                    localStorage.setItem("staySignedIn", "true")
                }

                setStatus("Login successful! Redirecting...")
                console.log("Auth data stored successfully")

                // Optional: Set user context or trigger auth state update
                // Example: updateAuthContext({ token, userId, role })

                // Redirect to the intended page after a short delay
                setTimeout(() => {
                    router.push(returnUrl)
                }, 1500)

            } catch (error) {
                console.error("Auth callback error:", error)
                setStatus("Authentication failed. Redirecting to login...")
                
                // Redirect back to login page after error
                setTimeout(() => {
                    // Replace with your hosted landing page login URL
                    window.location.href = "https://meet.jazyen.com/login?error=auth_failed"
                }, 2000)
            } finally {
                setIsLoading(false)
            }
        }

        handleAuthCallback()
    }, [searchParams, router])

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md w-full mx-4">
                {isLoading && (
                    <div className="flex justify-center mb-4">
                        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
                    </div>
                )}
                
                <h1 className="text-xl font-semibold mb-2 text-gray-800">
                    {isLoading ? "Completing Login" : "Authentication Status"}
                </h1>
                
                <p className="text-gray-600 mb-4">{status}</p>
                
                {!isLoading && (
                    <div className="text-sm text-gray-500">
                        Please wait while we redirect you...
                    </div>
                )}
            </div>
        </div>
    )
}

// // Optional: Token validation function
// const validateToken = async (token: string): Promise<boolean> => {
//     try {
//         // Make a request to your backend to validate the token
//         const response = await fetch("https://meetio.jazyen.com/validate-token", {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//                 "Authorization": `Bearer ${token}`
//             }
//         })
        
//         return response.ok
//     } catch (error) {
//         console.error("Token validation error:", error)
//         return false
//     }
// }
