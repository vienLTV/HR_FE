"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Spinner } from "../components/Spinner";

const LoginPage = () => {
    const [accountEmail, setAccountEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        setIsLoading(true);
        setIsSubmitting(true);
        e.preventDefault();
        setError('');

        try {
            const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ accountEmail, password }),
            });

            if (response.ok) {
                const data = await response.json();
                // Here you might want to store the user's token or other data
                console.log('Login successful', data);

                // Set local storate
                localStorage.setItem('token', data.data.token);
                localStorage.setItem('accountEmail', data.data.accountEmail);
                localStorage.setItem('firstName', data.data.firstName);
                localStorage.setItem('lastName', data.data.lastName);
                localStorage.setItem('employeeId', data.data.employeeId);
                localStorage.setItem('role', data.data.role);

                router.push('/home'); // Redirect to dashboard or home page
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            setError('An error occurred. Please try again.');
        } finally {
            setIsLoading(false)
            setIsSubmitting(false)
        }
    };

    if (isLoading) {
        return <Spinner />
    }

    return (
        <div className="flex justify-center mt-[200px]">
            <div className="flex flex-col w-[500px] p-10 gap-6 rounded-xl border border-gray-300 bg-white shadow-2xl">
                <h1 className="font-bold text-2xl">Sign in to your account</h1>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                        <label htmlFor="email" className="font-medium">Email</label>
                        <input 
                            id="email"
                            className="border-gray-300 bg-white border p-2 rounded-lg" 
                            type="email" 
                            placeholder="name@email.com"
                            value={accountEmail}
                            onChange={(e) => setAccountEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="password" className="font-medium">Password</label>
                        <input 
                            id="password"
                            className="border-gray-300 bg-white border p-2 rounded-lg" 
                            type="password" 
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error && <p className="text-red-500">{error}</p>}

                    <button type="submit" className="bg-black rounded-lg text-white p-3 mt-3" disabled={isSubmitting}>
                    {isSubmitting ? "Sign in..." : "Sign in"}
                    </button>
                </form>

                <p className="text-gray-500">
                    Do not have an account yet?
                    <Link href='/register' className="m-1 font-medium text-black">Sign up</Link>
                </p>
            </div>
        </div>
    );
}

export default LoginPage;