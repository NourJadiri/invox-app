"use client";

import { useEffect, useState } from "react";
import { createLessonAction, updateLessonAction, deleteLessonAction } from "@/features/schedule/actions";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Lesson } from "@/features/schedule/types";
import type { Student } from "@/features/students/types";
import { format } from "date-fns";
import { BookOpen, Edit3, User, FileText, Calendar, Clock, DollarSign, RefreshCw, StickyNote, AlertCircle, Trash2, Palette } from "lucide-react";

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
    const [color, setColor] = useState<string | null>(null);

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
                setColor(lesson.color);
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
                setColor(null);
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
                title: title || undefined,
                start: startDateTime.toISOString(),
                end: endDateTime.toISOString(),
                notes: notes || undefined,
                price: price ?? undefined,
                recurrent: recurrent,
                color: color || undefined,
            };

            // Use server actions instead of fetch!
            const result = lesson
                ? await updateLessonAction(lesson.id, payload)
                : await createLessonAction(payload);

            if (!result.success) {
                setError(result.error || "Failed to save lesson");
                return;
            }

            // Success! Close the dialog
            onSave();
        } catch (err) {
            console.error("Unexpected error:", err);
            setError("An unexpected error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete() {
        if (!lesson || !confirm("Are you sure you want to delete this lesson?")) return;

        setLoading(true);
        setError(null);

        try {
            const result = await deleteLessonAction(lesson.id);

            if (!result.success) {
                setError(result.error || "Failed to delete lesson");
                return;
            }

            onSave();
        } catch (err) {
            console.error("Unexpected error:", err);
            setError("Failed to delete lesson. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[520px]">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold flex items-center gap-2">
                        {lesson ? <Edit3 className="h-5 w-5" /> : <BookOpen className="h-5 w-5" />}
                        {lesson ? "Edit Lesson" : "New Lesson"}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-5 mt-4">
                    {error && (
                        <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 p-3 rounded-lg flex items-start gap-2">
                            <AlertCircle className="h-4 w-4 mt-0.5" />
                            <span className="flex-1">{error}</span>
                        </div>
                    )}

                    {/* Student Selection */}
                    <div className="space-y-2">
                        <Label htmlFor="student" className="text-sm font-medium flex items-center gap-2">
                            <User className="h-4 w-4" />
                            Student
                        </Label>
                        <Select value={studentId} onValueChange={setStudentId} required>
                            <SelectTrigger className="h-10">
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

                    {/* Lesson Title */}
                    <div className="space-y-2">
                        <Label htmlFor="title" className="text-sm font-medium flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            Lesson Title <span className="text-muted-foreground text-xs font-normal">(optional)</span>
                        </Label>
                        <Input
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. Piano Lesson, Guitar Practice..."
                            className="h-10"
                        />
                    </div>

                    {/* Schedule Section */}
                    <div className="space-y-3 p-4 rounded-lg bg-muted/30 border border-border">
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <h3 className="font-medium text-sm">Schedule</h3>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="date" className="text-sm">Date</Label>
                            <Input
                                id="date"
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="h-10"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-2">
                                <Label htmlFor="startTime" className="text-sm flex items-center gap-1.5">
                                    <Clock className="h-3.5 w-3.5" />
                                    Start
                                </Label>
                                <Input
                                    id="startTime"
                                    type="time"
                                    value={startTime}
                                    onChange={(e) => setStartTime(e.target.value)}
                                    className="h-10"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="endTime" className="text-sm flex items-center gap-1.5">
                                    <Clock className="h-3.5 w-3.5" />
                                    End
                                </Label>
                                <Input
                                    id="endTime"
                                    type="time"
                                    value={endTime}
                                    onChange={(e) => setEndTime(e.target.value)}
                                    className="h-10"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Price */}
                    <div className="space-y-2">
                        <Label htmlFor="price" className="text-sm font-medium flex items-center gap-2">
                            <DollarSign className="h-4 w-4" />
                            Hourly Rate <span className="text-muted-foreground text-xs font-normal">(optional)</span>
                        </Label>
                        <div className="relative">
                            <Input
                                id="price"
                                type="number"
                                step="0.01"
                                min="0"
                                value={price ?? ""}
                                onChange={(e) => setPrice(e.target.value ? parseFloat(e.target.value) : null)}
                                placeholder="50.00"
                                className="h-10 pl-7"
                            />
                        </div>
                    </div>

                    {/* Color Picker */}
                    <div className="space-y-2">
                        <Label htmlFor="color" className="text-sm font-medium flex items-center gap-2">
                            <Palette className="h-4 w-4" />
                            Color
                        </Label>
                        <div className="space-y-3">
                            {/* Predefined colors */}
                            <div className="flex flex-wrap gap-2">
                                {[
                                    { name: 'Blue', value: '#3b82f6' },
                                    { name: 'Green', value: '#22c55e' },
                                    { name: 'Purple', value: '#a855f7' },
                                    { name: 'Orange', value: '#f97316' },
                                    { name: 'Pink', value: '#ec4899' },
                                    { name: 'Teal', value: '#14b8a6' },
                                    { name: 'Red', value: '#ef4444' },
                                    { name: 'Yellow', value: '#eab308' },
                                ].map((colorOption) => (
                                    <button
                                        key={colorOption.value}
                                        type="button"
                                        onClick={() => setColor(colorOption.value)}
                                        className={`w-8 h-8 rounded-md border-2 transition-all hover:scale-110 ${color === colorOption.value ? 'border-foreground ring-2 ring-offset-2 ring-foreground' : 'border-border'
                                            }`}
                                        style={{ backgroundColor: colorOption.value }}
                                        title={colorOption.name}
                                    />
                                ))}
                            </div>
                            {/* Custom color input */}
                            <div className="flex gap-2 items-center">
                                <Input
                                    id="color"
                                    type="color"
                                    value={color || '#3b82f6'}
                                    onChange={(e) => setColor(e.target.value)}
                                    className="w-16 h-10 p-1 cursor-pointer"
                                />
                                <Input
                                    type="text"
                                    value={color || ''}
                                    onChange={(e) => setColor(e.target.value)}
                                    placeholder="#3b82f6"
                                    className="h-10 flex-1 font-mono text-sm"
                                />
                                {color && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setColor(null)}
                                        className="h-10"
                                    >
                                        Clear
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Recurring Toggle */}
                    <div className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-muted/30 transition-colors">
                        <RefreshCw className="h-4 w-4 text-muted-foreground" />
                        <input
                            id="recurrent"
                            type="checkbox"
                            checked={recurrent}
                            onChange={(e) => setRecurrent(e.target.checked)}
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-2 focus:ring-primary/20 cursor-pointer"
                        />
                        <Label htmlFor="recurrent" className="cursor-pointer flex-1 font-normal">
                            Recurring weekly lesson
                        </Label>
                    </div>

                    {/* Notes */}
                    <div className="space-y-2">
                        <Label htmlFor="notes" className="text-sm font-medium flex items-center gap-2">
                            <StickyNote className="h-4 w-4" />
                            Notes
                        </Label>
                        <Textarea
                            id="notes"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Add any additional notes..."
                            rows={3}
                            className="resize-none"
                        />
                    </div>

                    {/* Footer Actions */}
                    <DialogFooter className="flex-col sm:flex-row gap-2 pt-2">
                        {lesson && (
                            <Button
                                type="button"
                                variant="destructive"
                                onClick={handleDelete}
                                disabled={loading}
                                size="sm"
                                className="sm:mr-auto"
                            >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                            </Button>
                        )}
                        <div className="flex gap-2 w-full sm:w-auto">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                                disabled={loading}
                                className="flex-1 sm:flex-initial"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={loading}
                                className="flex-1 sm:flex-initial"
                            >
                                {loading ? "Saving..." : (lesson ? "Update" : "Create")}
                            </Button>
                        </div>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
