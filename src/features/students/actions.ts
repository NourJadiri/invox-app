"use server"

import { createStudent, updateStudent, CreateStudentInput, UpdateStudentInput, deleteStudent } from "@/services"
import { revalidatePath } from "next/cache";

export const createStudentAction = async (data: CreateStudentInput) => {

    try {
       await createStudent(data);
       
       revalidatePath("/students");
       return {
           success: true,
       }
    } catch (error) {
        console.error("Server Action Error:", error);

        return {
            success: false,
            error: "Failed to create student. Please try again later."
        }
    }
}

export const updateStudentAction = async (id: string, data: UpdateStudentInput) => {
    try {
        await updateStudent(id, data);
        revalidatePath("/students");
        return {
            success: true,
        }
    } catch (error) {
        console.error("Server Action Error:", error);
        return {
            success: false,
            error: "Failed to update student. Please try again later."
        }
    }
}

export const deleteStudentAction = async (id: string) => {
    try {
        await deleteStudent(id);
        revalidatePath("/students");
        return {
            success: true,
        }
    } catch (error) {
        console.error("Server Action Error:", error);
        return {
            success: false,
            error: "Failed to delete student. Please try again later."
        }
    }
}

