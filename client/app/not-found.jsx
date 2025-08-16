import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center px-4">
            <h1 className="text-6xl font-bold mb-4">404</h1>
            <p className="">Page not found</p>
            <Link href="/">
                <Button className="">
                    Go Home
                </Button>
            </Link>
        </main>
    );
}
