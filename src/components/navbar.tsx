"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Users, Calendar, Home } from "lucide-react";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

const navItems = [
    {
        name: "Home",
        href: "/",
        icon: Home,
    },
    {
        name: "Students",
        href: "/students",
        icon: Users,
    },
    {
        name: "Schedule",
        href: "/schedule",
        icon: Calendar,
    },
];

export function Navbar() {
    const pathname = usePathname();

    return (
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center gap-6">
                        <Link href="/" className="flex items-center gap-2 mr-4">
                            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground font-bold">
                                I
                            </div>
                            <span className="font-semibold text-lg">Invox</span>
                        </Link>

                        <NavigationMenu>
                            <NavigationMenuList>
                                {navItems.map((item) => {
                                    const isActive = pathname === item.href;
                                    const Icon = item.icon;

                                    return (
                                        <NavigationMenuItem key={item.href}>
                                            <NavigationMenuLink
                                                asChild
                                                className={cn(
                                                    navigationMenuTriggerStyle(),
                                                    "bg-transparent",
                                                    isActive && "bg-accent text-accent-foreground"
                                                )}
                                            >
                                                <Link href={item.href}>
                                                    <Icon className="mr-2 h-4 w-4" />
                                                    {item.name}
                                                </Link>
                                            </NavigationMenuLink>
                                        </NavigationMenuItem>
                                    );
                                })}
                            </NavigationMenuList>
                        </NavigationMenu>
                    </div>
                </div>
            </div>
        </div>
    );
}
