"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { format, startOfMonth, endOfMonth } from "date-fns";
import { Coins, Calendar, Loader2 } from "lucide-react";
import { applyDefaultPricesAction } from "../actions";

interface ApplyDefaultPricesDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
}

export function ApplyDefaultPricesDialog({
    open,
    onOpenChange,
    onSuccess,
}: ApplyDefaultPricesDialogProps) {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [applying, setApplying] = useState(false);
    const [result, setResult] = useState<{
        updated: number;
        errors: string[];
    } | null>(null);

    // Set default date range to current month when dialog opens
    useEffect(() => {
        if (open) {
            const now = new Date();
            setStartDate(format(startOfMonth(now), "yyyy-MM-dd"));
            setEndDate(format(endOfMonth(now), "yyyy-MM-dd"));
            setResult(null);
        }
    }, [open]);

    async function handleApply() {
        if (!startDate || !endDate) return;

        setApplying(true);
        setResult(null);

        try {
            const response = await applyDefaultPricesAction({
                startDate,
                endDate,
            });

            if (response.success) {
                setResult({
                    updated: response.updated ?? 0,
                    errors: response.errors ?? [],
                });
                onSuccess?.();
            } else {
                setResult({
                    updated: 0,
                    errors: [response.error || "Failed to apply default prices"],
                });
            }
        } catch {
            setResult({
                updated: 0,
                errors: ["An unexpected error occurred"],
            });
        } finally {
            setApplying(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <Coins className="h-5 w-5 text-primary" />
                        Apply Default Prices
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    <p className="text-sm text-muted-foreground">
                        Apply each student&apos;s default lesson price to all lessons within the selected date range.
                        Only lessons with students who have a default price set will be updated.
                    </p>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="startDate" className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                Start Date
                            </Label>
                            <Input
                                id="startDate"
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="endDate" className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                End Date
                            </Label>
                            <Input
                                id="endDate"
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                        </div>
                    </div>

                    {result && (
                        <div className={`rounded-lg border p-4 space-y-2 ${
                            result.errors.length > 0 && result.updated === 0
                                ? "bg-destructive/10 border-destructive/20"
                                : "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800"
                        }`}>
                            {result.updated > 0 && (
                                <div className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-green-500" />
                                    <p className="font-medium text-green-700 dark:text-green-300">
                                        {result.updated} lesson{result.updated !== 1 ? "s" : ""} updated successfully
                                    </p>
                                </div>
                            )}
                            {result.errors.length > 0 && (
                                <div className="space-y-1">
                                    {result.errors.slice(0, 3).map((error, index) => (
                                        <p
                                            key={index}
                                            className="text-sm text-destructive dark:text-red-400"
                                        >
                                            {error}
                                        </p>
                                    ))}
                                    {result.errors.length > 3 && (
                                        <p className="text-sm text-muted-foreground">
                                            ...and {result.errors.length - 3} more errors
                                        </p>
                                    )}
                                </div>
                            )}
                            {result.updated === 0 && result.errors.length === 0 && (
                                <p className="text-sm text-muted-foreground">
                                    No lessons were updated. Make sure students have default prices set and lessons exist in the selected date range.
                                </p>
                            )}
                        </div>
                    )}
                </div>

                <DialogFooter className="gap-2">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={applying}
                    >
                        Close
                    </Button>
                    <Button
                        onClick={handleApply}
                        disabled={applying || !startDate || !endDate}
                        className="gap-2"
                    >
                        {applying ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Applying...
                            </>
                        ) : (
                            <>
                                <Coins className="h-4 w-4" />
                                Apply Prices
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
