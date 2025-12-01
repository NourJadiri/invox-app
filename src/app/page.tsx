"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Users, ArrowRight } from "lucide-react";

export default function Home() {
    const router = useRouter();

    // Auto redirect after 2 seconds, or user can click button
    useEffect(() => {
        const timer = setTimeout(() => {
            router.push("/students");
        }, 2000);

        return () => clearTimeout(timer);
    }, [router]);

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-primary/5">
            <div className="text-center space-y-6 max-w-md px-4">
                <div className="mb-8 flex justify-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 ring-4 ring-primary/20">
                        <Users className="h-10 w-10 text-primary" />
                    </div>
                </div>

                <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-medium text-muted-foreground shadow-sm">
                    <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
                    </span>
                    <span>Invox · Early prototype</span>
                </div>

                <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">
                    Welcome to Invox
                </h1>

                <p className="text-base text-muted-foreground md:text-lg">
                    A tiny student CRM for tutors. Manage students, track contacts, and streamline your tutoring business.
                </p>

                <div className="pt-4">
                    <Button
                        size="lg"
                        onClick={() => router.push("/students")}
                        className="gap-2"
                    >
                        Go to Students
                        <ArrowRight className="h-4 w-4" />
                    </Button>
                    <p className="mt-3 text-xs text-muted-foreground">
                        Redirecting automatically in 2 seconds...
                    </p>
                </div>
            </div>
        </div>
    );
}
