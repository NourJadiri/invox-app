"use server"

import { createLesson, CreateLessonInput, updateLesson, UpdateLessonInput, deleteLesson } from "@/services";
import { revalidatePath } from "next/cache";

export const createLessonAction = async (data: CreateLessonInput) => {
    try {
        await createLesson(data);

        revalidatePath("/schedule");

        return { success: true };
    }    
    catch (error) {
        console.error("Server Action Error:", error);
        return { 
            success: false, 
            error: "Failed to create lesson. Please try again later."
        };
    }
}

export const updateLessonAction = async (id: string, data: UpdateLessonInput) => {
    try {
        await updateLesson(id, data);

        revalidatePath("/schedule");

        return { success: true };
    }    
    catch (error) {
        console.error("Server Action Error:", error);
        return { 
            success: false, 
            error: "Failed to update lesson. Please try again later."
        };
    }
}

export const deleteLessonAction = async (id: string) => {
    try {
        await deleteLesson(id);

        revalidatePath("/schedule");

        return { success: true };
    }    
    catch (error) {
        console.error("Server Action Error:", error);
        return { 
            success: false, 
            error: "Failed to delete lesson. Please try again later."
        };
    }
}
