"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SimpleInput } from "./simple-input";
import { SimpleTextarea } from "./simple-textarea";
import { Check, X, UserPlus } from "lucide-react";
import type { StudentDraft } from "../types";

type StudentDraftCardProps = {
    draft: StudentDraft;
    loading: boolean;
    error: string | null;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onValidate: () => void;
    onCancel: () => void;
};

export function StudentDraftCard({
    draft,
    loading,
    error,
    onChange,
    onValidate,
    onCancel,
}: StudentDraftCardProps) {
    const isValid = draft.firstName.trim() && draft.lastName.trim();

    return (
        <Card className="border-2 border-primary/40 shadow-lg bg-primary/5">
            <CardHeader className="space-y-3">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 text-primary">
                            <UserPlus className="h-6 w-6" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="font-semibold text-lg text-foreground">New Student</h3>
                                <Badge variant="default" className="text-xs">Draft</Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Fill in the details and validate to add
                            </p>
                        </div>
                    </div>

                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onCancel}
                        disabled={loading}
                        className="h-8 w-8"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                {error && (
                    <div className="rounded-md bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
                        {error}
                    </div>
                )}

                <div className="grid gap-4 sm:grid-cols-2">
                    <SimpleInput
                        label="First Name"
                        name="firstName"
                        value={draft.firstName}
                        onChange={onChange}
                        placeholder="Enter first name"
                        required
                        disabled={loading}
                    />
                    <SimpleInput
                        label="Last Name"
                        name="lastName"
                        value={draft.lastName}
                        onChange={onChange}
                        placeholder="Enter last name"
                        required
                        disabled={loading}
                    />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <SimpleInput
                        label="Email"
                        name="email"
                        type="email"
                        value={draft.email}
                        onChange={onChange}
                        placeholder="student@example.com"
                        disabled={loading}
                    />
                    <SimpleInput
                        label="Phone"
                        name="phone"
                        value={draft.phone}
                        onChange={onChange}
                        placeholder="+1 (555) 123-4567"
                        disabled={loading}
                    />
                </div>

                <SimpleTextarea
                    label="Notes"
                    name="notes"
                    value={draft.notes}
                    onChange={onChange}
                    placeholder="Add any additional notes..."
                    rows={3}
                    disabled={loading}
                />

                <div className="flex justify-end gap-2 pt-2 border-t">
                    <Button
                        variant="outline"
                        onClick={onCancel}
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={onValidate}
                        disabled={loading || !isValid}
                        className="gap-2"
                    >
                        <Check className="h-4 w-4" />
                        {loading ? "Validating..." : "Validate & Add"}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
