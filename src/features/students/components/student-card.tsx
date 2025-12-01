"use client";

import { motion } from "motion/react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Edit, Trash2, Mail, Phone, FileText, MoreVertical } from "lucide-react";
import type { Student } from "../types";

type StudentCardProps = {
    student: Student;
    onEdit: (student: Student) => void;
    onDelete: (id: string) => void;
};

export function StudentCard({ student, onEdit, onDelete }: StudentCardProps) {
    const fullName = `${student.firstName} ${student.lastName}`;
    const initials = `${student.firstName[0]}${student.lastName[0]}`.toUpperCase();

    const handleDelete = () => {
        onDelete(student.id);
    };

    const handleEdit = () => {
        onEdit(student);
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
        >
            <Card className="group hover:shadow-lg transition-all duration-200 border-border/50 hover:border-primary/30">
                <CardHeader className="space-y-3">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                                {initials}
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg text-foreground">{fullName}</h3>
                                <p className="text-xs text-muted-foreground">
                                    Added {new Date(student.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        </div>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onSelect={handleEdit}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onSelect={handleDelete}
                                    className="text-destructive focus:text-destructive"
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </CardHeader>

                <CardContent className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        {student.email ? (
                            <a
                                href={`mailto:${student.email}`}
                                className="hover:text-primary transition-colors"
                            >
                                {student.email}
                            </a>
                        ) : (
                            <span className="text-muted-foreground/50 italic text-xs">No email</span>
                        )}
                    </div>

                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="h-4 w-4" />
                        {student.phone ? (
                            <a
                                href={`tel:${student.phone}`}
                                className="hover:text-primary transition-colors"
                            >
                                {student.phone}
                            </a>
                        ) : (
                            <span className="text-muted-foreground/50 italic text-xs">No phone</span>
                        )}
                    </div>

                    <div className="flex items-start gap-2 text-muted-foreground">
                        <FileText className="h-4 w-4 mt-0.5" />
                        {student.notes ? (
                            <p className="line-clamp-2 text-xs">{student.notes}</p>
                        ) : (
                            <span className="text-muted-foreground/50 italic text-xs">No notes</span>
                        )}
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
