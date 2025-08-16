"use client";

import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export default function Error({ error, reset }) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <main className="flex min-h-screen flex-col items-center justify-center px-4">
            <h1 className="text-4xl font-bold mb-4">Something went wrong</h1>
            <p className="text-gray-300 mb-8">{error.message || "Unexpected error occurred"}</p>
            <div className="flex gap-2">
                <Button
                    onClick={() => reset()}
                    className=""
                >
                    Try Again
                </Button>
                <Button
                    variant="outline"
                    className=""
                    onClick={() => (window.location.href = "/")}
                >
                    Go Home
                </Button>
            </div>
        </main>
    );
}
