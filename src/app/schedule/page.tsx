import { getLessons } from "@/services";
import ScheduleManager from "@/features/schedule/components/schedule-manager";

export default async function SchedulePage() {
    const lessons = await getLessons();
    return <ScheduleManager initialLessons={lessons} />;
}
