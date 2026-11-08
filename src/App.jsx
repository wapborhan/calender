import {
  add,
  eachDayOfInterval,
  endOfMonth,
  format,
  isSameDay,
  isSameMonth,
  isSameWeek,
  parse,
  parseISO,
  startOfToday,
  startOfWeek,
  endOfWeek,
} from "date-fns";
import { Fragment, useState, useEffect } from "react";
import NavBar from "./components/NavBar";
import CalendarGrid from "./components/CalendarGrid";
import ScheduleSection from "./components/ScheduleSection";
import AddMeetingModal from "./components/AddMeetingModal";
import Toast from "./components/Toast";
import { generateInitialMeetings } from "./assets/meetings";
import { exportMeetingsToICS } from "./utils/icsExport";

const LOCAL_STORAGE_KEY = "sr_calendar_meetings";

export default function App() {
  const today = startOfToday();
  const [selectedDay, setSelectedDay] = useState(today);
  const [currentMonth, setCurrentMonth] = useState(format(today, "MMM-yyyy"));
  const [viewMode, setViewMode] = useState("selected"); // "selected" | "week" | "month" | "all"
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [meetingToEdit, setMeetingToEdit] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [toast, setToast] = useState(null);

  function showToast(message, type = "success") {
    setToast({ message, type });
  }

  // Toast auto-dismiss
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  // Load meetings from localStorage or fallback to initial demo meetings
  const [meetingsList, setMeetingsList] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (err) {
      console.error("Failed to read meetings from localStorage:", err);
    }
    return generateInitialMeetings();
  });

  // Sync meetings to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(meetingsList));
    } catch (err) {
      console.error("Failed to write meetings to localStorage:", err);
    }
  }, [meetingsList]);

  const firstDayCurrentMonth = parse(currentMonth, "MMM-yyyy", new Date());

  // Generate full rectangular grid starting on Saturday (weekStartsOn: 6)
  const monthStart = firstDayCurrentMonth;
  const monthEnd = endOfMonth(monthStart);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 6 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 6 });

  const days = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd,
  });

  function previousMonth() {
    const firstDayNextMonth = add(firstDayCurrentMonth, { months: -1 });
    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"));
  }

  function nextMonth() {
    const firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 });
    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"));
  }

  function goToToday() {
    setSelectedDay(today);
    setCurrentMonth(format(today, "MMM-yyyy"));
  }

  function handleSelectDate(day) {
    setSelectedDay(day);
    if (!isSameMonth(day, firstDayCurrentMonth)) {
      setCurrentMonth(format(day, "MMM-yyyy"));
    }
  }

  // Keyboard navigation shortcuts (T = Today, A = Add Meeting)
  useEffect(() => {
    function handleKeyDown(e) {
      if (
        ["INPUT", "TEXTAREA", "SELECT"].includes(
          document.activeElement?.tagName,
        )
      ) {
        return;
      }
      if (e.key === "t" || e.key === "T") {
        setSelectedDay(today);
        setCurrentMonth(format(today, "MMM-yyyy"));
        setToast({ message: "Jumped to Today", type: "info" });
      } else if (e.key === "a" || e.key === "A") {
        setMeetingToEdit(null);
        setIsAddModalOpen(true);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [today]);

  // Filtered meetings based on viewMode
  let viewMeetings = meetingsList;
  if (viewMode === "selected") {
    viewMeetings = meetingsList.filter((m) =>
      isSameDay(parseISO(m.startDatetime), selectedDay),
    );
  } else if (viewMode === "week") {
    viewMeetings = meetingsList.filter((m) =>
      isSameWeek(parseISO(m.startDatetime), selectedDay, { weekStartsOn: 6 }),
    );
  } else if (viewMode === "month") {
    viewMeetings = meetingsList.filter((m) =>
      isSameMonth(parseISO(m.startDatetime), firstDayCurrentMonth),
    );
  }

  // Filter with live search query
  const query = searchQuery.trim().toLowerCase();
  const activeMeetings = query
    ? viewMeetings.filter(
        (m) =>
          m.name.toLowerCase().includes(query) ||
          (m.title && m.title.toLowerCase().includes(query)),
      )
    : viewMeetings;

  // Group active meetings by date in chronological order
  const sortedMeetings = [...activeMeetings].sort((a, b) =>
    a.startDatetime.localeCompare(b.startDatetime),
  );

  const groupedActiveMeetings = {};
  for (const meeting of sortedMeetings) {
    const dateKey = format(parseISO(meeting.startDatetime), "yyyy-MM-dd");
    if (!groupedActiveMeetings[dateKey]) {
      groupedActiveMeetings[dateKey] = [];
    }
    groupedActiveMeetings[dateKey].push(meeting);
  }

  // Add meetings (single or recurring series)
  function handleAddMeetings(newMeetingsArray) {
    setMeetingsList((prev) => [...prev, ...newMeetingsArray]);
    if (newMeetingsArray.length > 0) {
      const firstDate = parseISO(newMeetingsArray[0].startDatetime);
      setSelectedDay(firstDate);
      setCurrentMonth(format(firstDate, "MMM-yyyy"));
      if (newMeetingsArray.length > 1) {
        showToast(
          `Scheduled ${newMeetingsArray.length} recurring sessions!`,
          "success",
        );
      } else {
        showToast("Meeting scheduled successfully!", "success");
      }
    }
  }

  // Update meeting (supports editing "this day only" or "entire recurring series")
  function handleUpdateMeeting(updatedData, editScope = "single") {
    if (editScope === "series" && updatedData.recurrenceGroupId) {
      setMeetingsList((prev) =>
        prev.map((m) => {
          if (m.recurrenceGroupId === updatedData.recurrenceGroupId) {
            const dateStr = format(parseISO(m.startDatetime), "yyyy-MM-dd");
            return {
              ...m,
              name: updatedData.name,
              title: updatedData.title,
              imageUrl: updatedData.imageUrl,
              startDatetime: `${dateStr}T${updatedData.startTime}:00`,
              endDatetime: `${dateStr}T${updatedData.endTime}:00`,
            };
          }
          return m;
        }),
      );
      showToast("Updated all sessions in recurring series!", "success");
    } else {
      setMeetingsList((prev) =>
        prev.map((m) => (m.id === updatedData.id ? updatedData : m)),
      );
      const updatedDate = parseISO(updatedData.startDatetime);
      setSelectedDay(updatedDate);
      showToast("Meeting details updated!", "success");
    }
  }

  // Delete single meeting session
  function handleDeleteMeeting(meetingId) {
    setMeetingsList((prev) => prev.filter((m) => m.id !== meetingId));
    showToast("Meeting session cancelled", "info");
  }

  // Delete all recurring sessions in a series
  function handleDeleteSeries(seriesId) {
    setMeetingsList((prev) =>
      prev.filter((m) => m.recurrenceGroupId !== seriesId),
    );
    showToast("All sessions in recurring series cancelled", "info");
  }

  // Export schedule to .ics
  function handleExportICS() {
    exportMeetingsToICS(meetingsList);
    showToast("Schedule exported to .ics file!", "success");
  }

  return (
    <Fragment>
      <NavBar />
      <main className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-3xl bg-white p-5 shadow-2xl shadow-slate-200/50 ring-1 ring-slate-100 sm:p-7 lg:p-9">
          <div className="lg:grid lg:grid-cols-12 lg:gap-x-10">
            {/* Bordered Calendar Grid Component */}
            <CalendarGrid
              days={days}
              firstDayCurrentMonth={firstDayCurrentMonth}
              selectedDay={selectedDay}
              today={today}
              meetingsList={meetingsList}
              onSelectDate={(day) => {
                handleSelectDate(day);
                setViewMode("selected");
              }}
              onPreviousMonth={previousMonth}
              onNextMonth={nextMonth}
              onGoToToday={goToToday}
              onExportICS={handleExportICS}
            />

            {/* Schedule & Meetings Section Component */}
            <ScheduleSection
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              selectedDay={selectedDay}
              firstDayCurrentMonth={firstDayCurrentMonth}
              activeMeetings={activeMeetings}
              groupedActiveMeetings={groupedActiveMeetings}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onOpenAddModal={() => {
                setMeetingToEdit(null);
                setIsAddModalOpen(true);
              }}
              onSelectDate={handleSelectDate}
              onEditMeeting={(meeting) => {
                setMeetingToEdit(meeting);
                setIsAddModalOpen(true);
              }}
              onDeleteMeeting={handleDeleteMeeting}
              onDeleteSeries={handleDeleteSeries}
            />
          </div>
        </div>
      </main>

      {/* Add / Edit Meeting Modal with Recurrence & Scope Controls */}
      <AddMeetingModal
        key={
          isAddModalOpen
            ? meetingToEdit
              ? `edit-${meetingToEdit.id}`
              : `add-${selectedDay.toISOString()}`
            : "closed"
        }
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setMeetingToEdit(null);
        }}
        onAddMeetings={handleAddMeetings}
        onUpdateMeeting={handleUpdateMeeting}
        defaultDate={selectedDay}
        meetingToEdit={meetingToEdit}
      />

      {/* Toast Notification Pill */}
      <Toast toast={toast} />
    </Fragment>
  );
}
