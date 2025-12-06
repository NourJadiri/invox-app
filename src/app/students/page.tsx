import { getStudents } from "@/services";
import StudentsManager from "@/features/students/components/students-manager";

export default async function StudentsPage() {
    const students = await getStudents();
    return <StudentsManager initialStudents={students} />;
}
