import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, UserPlus } from "lucide-react";
import type { Student } from "../types";

type StudentsTableProps = {
    students: Student[];
    loading: boolean;
    onEdit: (student: Student) => void;
    onDelete: (id: string) => void;
};

export function StudentsTable({
    students,
    loading,
    onEdit,
    onDelete,
}: StudentsTableProps) {
    const hasStudents = students.length > 0;

    return (
        <Card className="shadow-lg border-border/50">
            <CardHeader>
                <div className="flex items-start justify-between">
                    <div>
                        <CardTitle className="text-xl">All Students</CardTitle>
                        <CardDescription className="mt-1.5">
                            {hasStudents
                                ? `You currently track ${students.length} student${students.length === 1 ? "" : "s"}.`
                                : "Once you add students, they appear here with quick actions."}
                        </CardDescription>
                    </div>
                    {loading && (
                        <Badge variant="secondary" className="animate-pulse">
                            Syncing...
                        </Badge>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                {!hasStudents ? (
                    <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/50 px-6 py-12 text-center">
                        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                            <UserPlus className="h-7 w-7 text-primary" />
                        </div>
                        <h3 className="mb-2 text-lg font-semibold text-foreground">
                            No students yet
                        </h3>
                        <p className="text-sm text-muted-foreground max-w-sm">
                            Start by adding your first student using the form on the left.
                        </p>
                    </div>
                ) : (
                    <div className="rounded-md border">
                        <div className="max-h-[520px] overflow-y-auto">
                            <Table>
                                <TableHeader className="sticky top-0 bg-muted/50 backdrop-blur">
                                    <TableRow>
                                        <TableHead className="font-semibold">Name</TableHead>
                                        <TableHead className="font-semibold">Email</TableHead>
                                        <TableHead className="font-semibold">Phone</TableHead>
                                        <TableHead className="font-semibold">Notes</TableHead>
                                        <TableHead className="text-right font-semibold">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {students.map((student) => (
                                        <TableRow
                                            key={student.id}
                                            className="hover:bg-muted/50 transition-colors"
                                        >
                                            <TableCell className="font-medium">
                                                {student.firstName} {student.lastName}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {student.email || "—"}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {student.phone || "—"}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {student.notes ? (
                                                    <span className="line-clamp-2 max-w-xs">
                                                        {student.notes}
                                                    </span>
                                                ) : (
                                                    "—"
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => onEdit(student)}
                                                        className="h-8 gap-1.5"
                                                    >
                                                        <Edit className="h-3.5 w-3.5" />
                                                        <span className="hidden sm:inline">Edit</span>
                                                    </Button>
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => onDelete(student.id)}
                                                        className="h-8 gap-1.5"
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                        <span className="hidden sm:inline">Delete</span>
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
