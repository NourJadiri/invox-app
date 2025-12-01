import type React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import type { StudentFormValues } from "../types";

type StudentFormProps = {
  form: StudentFormValues;
  editingId: string | null;
  loading: boolean;
  error: string | null;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
};

export function StudentForm({
  form,
  editingId,
  loading,
  error,
  onChange,
  onSubmit,
  onCancel,
}: StudentFormProps) {
  return (
    <Card className="shadow-lg border-border/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">
              {editingId ? "Edit Student" : "Add Student"}
            </CardTitle>
            <CardDescription className="mt-1.5">
              Keep your roster clean and up to date. You can always change these
              details later.
            </CardDescription>
          </div>
          <Badge variant={editingId ? "secondary" : "default"}>
            {editingId ? "Editing" : "New"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">
                First Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="firstName"
                name="firstName"
                value={form.firstName}
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
                value={form.lastName}
                onChange={onChange}
                required
                placeholder="Enter last name"
                className="transition-all"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                name="email"
                value={form.email}
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
                value={form.phone}
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
              value={form.notes}
              onChange={onChange}
              rows={3}
              placeholder="Add any additional notes about the student..."
              className="resize-none transition-all"
            />
          </div>

          <div className="flex items-center justify-between gap-3 pt-2">
            <div className="flex gap-3">
              <Button type="submit" disabled={loading}>
                {loading
                  ? editingId
                    ? "Saving..."
                    : "Adding..."
                  : editingId
                    ? "Save Changes"
                    : "Add Student"}
              </Button>
              {editingId && (
                <Button
                  type="button"
                  onClick={onCancel}
                  variant="outline"
                >
                  Cancel
                </Button>
              )}
            </div>
            <p className="hidden text-xs text-muted-foreground md:block">
              Students sync instantly. No separate save step.
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
