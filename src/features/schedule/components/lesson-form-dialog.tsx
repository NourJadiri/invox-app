"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Lesson } from "@/features/schedule/types";
import type { Student } from "@/features/students/types";
import { format } from "date-fns";

type LessonFormDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    lesson: Lesson | null;
    onSave: () => void;
};

export function LessonFormDialog({ open, onOpenChange, lesson, onSave }: LessonFormDialogProps) {
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Form state
    const [studentId, setStudentId] = useState("");
    const [date, setDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [title, setTitle] = useState("");
    const [notes, setNotes] = useState("");
    const [price, setPrice] = useState<number | null>(null);
    const [recurrent, setRecurrent] = useState(false);

    useEffect(() => {
        if (open) {
            void loadStudents();
            if (lesson) {
                // Edit mode: pre-fill form
                setStudentId(lesson.studentId);
                const start = new Date(lesson.start);
                const end = new Date(lesson.end);
                setDate(format(start, "yyyy-MM-dd"));
                setStartTime(format(start, "HH:mm"));
                setEndTime(format(end, "HH:mm"));
                setTitle(lesson.title || "");
                setNotes(lesson.notes || "");
                setPrice(lesson.price);
                setRecurrent(lesson.recurrent);
            } else {
                // Create mode: reset form
                setStudentId("");
                const now = new Date();
                setDate(format(now, "yyyy-MM-dd"));
                setStartTime(format(now, "HH:mm"));
                const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
                setEndTime(format(oneHourLater, "HH:mm"));
                setTitle("");
                setNotes("");
                setPrice(null);
                setRecurrent(false);
            }
            setError(null);
        }
    }, [open, lesson]);

    async function loadStudents() {
        try {
            const res = await fetch("/api/students");
            if (res.ok) {
                const data = await res.json();
                setStudents(data);
            }
        } catch (error) {
            console.error("Failed to load students:", error);
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const startDateTime = new Date(`${date}T${startTime}`);
            const endDateTime = new Date(`${date}T${endTime}`);

            const payload = {
                studentId,
                title: title || null,
                start: startDateTime.toISOString(),
                end: endDateTime.toISOString(),
                notes: notes || null,
                price: price,
                recurrent: recurrent,
            };

            const url = lesson ? `/api/lessons/${lesson.id}` : "/api/lessons";
            const method = lesson ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                throw new Error("Failed to save lesson");
            }

            onSave();
        } catch (_err) {
            setError("Failed to save lesson. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete() {
        if (!lesson || !confirm("Are you sure you want to delete this lesson?")) return;

        setLoading(true);
        try {
            const res = await fetch(`/api/lessons/${lesson.id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Failed to delete lesson");
            onSave();
        } catch (_err) {
            setError("Failed to delete lesson");
            setLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{lesson ? "Edit Lesson" : "New Lesson"}</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    {error && (
                        <div className="text-sm text-destructive bg-destructive/10 p-2 rounded">
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="student">Student</Label>
                        <Select value={studentId} onValueChange={setStudentId} required>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a student" />
                            </SelectTrigger>
                            <SelectContent>
                                {students.map((student) => (
                                    <SelectItem key={student.id} value={student.id}>
                                        {student.firstName} {student.lastName}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="title">Title (Optional)</Label>
                        <Input
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. Piano Lesson"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="date">Date</Label>
                            <Input
                                id="date"
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="startTime">Start Time</Label>
                            <Input
                                id="startTime"
                                type="time"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="endTime">End Time</Label>
                            <Input
                                id="endTime"
                                type="time"
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="price">Price (€)</Label>
                        <Input
                            id="price"
                            type="number"
                            step="0.01"
                            min="0"
                            value={price ?? ""}
                            onChange={(e) => setPrice(e.target.value ? parseFloat(e.target.value) : null)}
                            placeholder="e.g. 50.00"
                        />
                    </div>

                    <div className="flex items-center space-x-2">
                        <input
                            id="recurrent"
                            type="checkbox"
                            checked={recurrent}
                            onChange={(e) => setRecurrent(e.target.checked)}
                            className="h-4 w-4 rounded border-gray-300"
                        />
                        <Label htmlFor="recurrent" className="cursor-pointer">
                            Recurring weekly lesson
                        </Label>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="notes">Notes</Label>
                        <Textarea
                            id="notes"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Lesson notes..."
                            rows={3}
                        />
                    </div>

                    <DialogFooter className="flex justify-between sm:justify-between">
                        {lesson && (
                            <Button
                                type="button"
                                variant="destructive"
                                onClick={handleDelete}
                                disabled={loading}
                            >
                                Delete
                            </Button>
                        )}
                        <div className="flex gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                                disabled={loading}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={loading}>
                                {loading ? "Saving..." : "Save"}
                            </Button>
                        </div>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
