import { addDays, format, subDays } from "date-fns";

export function generateInitialMeetings() {
  const today = new Date();

  return [
    {
      id: "meeting-2",
      name: "Michael Foster",
      title: "Design System Review",
      imageUrl:
        "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      startDatetime: `${format(today, "yyyy-MM-dd")}T14:00:00`,
      endDatetime: `${format(today, "yyyy-MM-dd")}T15:00:00`,
    },
    {
      id: "meeting-3",
      name: "Leslie Alexander",
      title: "Product Roadmap Q4",
      imageUrl:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      startDatetime: `${format(addDays(today, 2), "yyyy-MM-dd")}T11:00:00`,
      endDatetime: `${format(addDays(today, 2), "yyyy-MM-dd")}T12:00:00`,
    },
    {
      id: "meeting-4",
      name: "Dries Vincent",
      title: "Backend API Sync",
      imageUrl:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      startDatetime: `${format(addDays(today, 5), "yyyy-MM-dd")}T16:00:00`,
      endDatetime: `${format(addDays(today, 5), "yyyy-MM-dd")}T17:30:00`,
    },
    {
      id: "meeting-5",
      name: "Courtney Henry",
      title: "Client Feedback Session",
      imageUrl:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      startDatetime: `${format(addDays(today, 8), "yyyy-MM-dd")}T10:00:00`,
      endDatetime: `${format(addDays(today, 8), "yyyy-MM-dd")}T11:15:00`,
    },
    {
      id: "meeting-6",
      name: "Tom Cook",
      title: "Retrospective",
      imageUrl:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      startDatetime: `${format(subDays(today, 2), "yyyy-MM-dd")}T15:30:00`,
      endDatetime: `${format(subDays(today, 2), "yyyy-MM-dd")}T16:30:00`,
    },
  ];
}

const meetings = generateInitialMeetings();
export default meetings;
