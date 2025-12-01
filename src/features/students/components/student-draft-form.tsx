"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, UserPlus, X } from "lucide-react";
import type { StudentDraft } from "../types";

type StudentDraftFormProps = {
    draft: StudentDraft;
    loading: boolean;
    error: string | null;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onSave: (e: React.FormEvent) => void;
    onCancel: () => void;
};

export function StudentDraftForm({
    draft,
    loading,
    error,
    onChange,
    onSave,
    onCancel,
}: StudentDraftFormProps) {
    const isValid = draft.firstName.trim() && draft.lastName.trim();

    return (
        <Card className="shadow-lg border-border/50 max-w-2xl mx-auto">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                            <UserPlus className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <CardTitle className="text-xl">New Student Draft</CardTitle>
                            <CardDescription className="mt-1">
                                Fill in the details below and validate to add the student.
                            </CardDescription>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onCancel}
                        disabled={loading}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            </CardHeader>

            <CardContent>
                {error && (
                    <Alert variant="destructive" className="mb-4">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                <form onSubmit={onSave} className="space-y-5">
                    <div className="grid gap-5 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="firstName">
                                First Name <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="firstName"
                                name="firstName"
                                value={draft.firstName}
                                onChange={onChange}
                                required
                                placeholder="Enter first name"
                                className="transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName">
                                Last Name <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="lastName"
                                name="lastName"
                                value={draft.lastName}
                                onChange={onChange}
                                required
                                placeholder="Enter last name"
                                className="transition-all"
                            />
                        </div>
                    </div>

                    <div className="grid gap-5 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                name="email"
                                value={draft.email}
                                onChange={onChange}
                                placeholder="student@example.com"
                                className="transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone</Label>
                            <Input
                                id="phone"
                                name="phone"
                                value={draft.phone}
                                onChange={onChange}
                                placeholder="+1 (555) 123-4567"
                                className="transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="notes">Notes</Label>
                        <Textarea
                            id="notes"
                            name="notes"
                            value={draft.notes}
                            onChange={onChange}
                            rows={4}
                            placeholder="Add any additional notes about the student..."
                            className="resize-none transition-all"
                        />
                    </div>

                    <div className="flex items-center justify-between gap-3 pt-4 border-t">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onCancel}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <div className="flex gap-3">
                            <Button
                                type="submit"
                                disabled={loading || !isValid}
                                className="gap-2"
                            >
                                <UserPlus className="h-4 w-4" />
                                {loading ? "Validating..." : "Validate & Add Student"}
                            </Button>
                        </div>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
