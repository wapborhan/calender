import {
  Calendar,
  CalendarDays,
  CalendarRange,
  CalendarCheck2,
  Plus,
  Repeat,
  Search,
  X,
} from "lucide-react";
import { format, parseISO, isToday, isSameDay } from "date-fns";
import MeetingItem from "./MeetingItem";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function ScheduleSection({
  viewMode,
  onViewModeChange,
  selectedDay,
  firstDayCurrentMonth,
  activeMeetings,
  groupedActiveMeetings,
  searchQuery,
  onSearchChange,
  onOpenAddModal,
  onSelectDate,
  onEditMeeting,
  onDeleteMeeting,
  onDeleteSeries,
}) {
  return (
    <section className="mt-10 lg:mt-0 lg:col-span-5 xl:col-span-5 lg:border-l lg:border-slate-100 lg:pl-8">
      {/* Header Controls */}
      <div className="flex flex-col gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center justify-between flex-wrap gap-2">
          {/* View Mode Switcher */}
          <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-1 text-xs font-semibold">
            <button
              type="button"
              onClick={() => onViewModeChange("selected")}
              className={classNames(
                viewMode === "selected"
                  ? "bg-white text-purple-700 shadow-xs"
                  : "text-slate-600 hover:text-slate-900",
                "rounded-lg px-2.5 py-1.5 transition-all duration-150 flex items-center gap-1",
              )}
            >
              <Calendar className="h-3.5 w-3.5" />
              <span>Day</span>
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange("week")}
              className={classNames(
                viewMode === "week"
                  ? "bg-white text-purple-700 shadow-xs"
                  : "text-slate-600 hover:text-slate-900",
                "rounded-lg px-2.5 py-1.5 transition-all duration-150 flex items-center gap-1",
              )}
            >
              <Repeat className="h-3.5 w-3.5" />
              <span>Week</span>
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange("month")}
              className={classNames(
                viewMode === "month"
                  ? "bg-white text-purple-700 shadow-xs"
                  : "text-slate-600 hover:text-slate-900",
                "rounded-lg px-2.5 py-1.5 transition-all duration-150 flex items-center gap-1",
              )}
            >
              <CalendarRange className="h-3.5 w-3.5" />
              <span>Month</span>
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange("all")}
              className={classNames(
                viewMode === "all"
                  ? "bg-white text-purple-700 shadow-xs"
                  : "text-slate-600 hover:text-slate-900",
                "rounded-lg px-2.5 py-1.5 transition-all duration-150 flex items-center gap-1",
              )}
            >
              <CalendarDays className="h-3.5 w-3.5" />
              <span>All</span>
            </button>
          </div>

          {/* Add Meeting Button */}
          <button
            type="button"
            onClick={onOpenAddModal}
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm shadow-purple-500/20 hover:from-purple-700 hover:to-indigo-700 active:scale-95 transition-all"
            title="Press 'A' to add meeting"
          >
            <Plus className="h-4 w-4" />
            <span>Add Meeting</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search meetings by name or topic..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 pl-8.5 pr-8 text-xs text-slate-900 placeholder:text-slate-400 focus:border-purple-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-600/20 transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Subtitle description */}
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>
            {viewMode === "selected" && (
              <>
                Schedule for{" "}
                <strong className="text-slate-800">
                  {format(selectedDay, "MMM dd, yyyy")}
                </strong>
              </>
            )}
            {viewMode === "week" && <>Weekly schedule for selected week</>}
            {viewMode === "month" && (
              <>
                Monthly schedule for{" "}
                <strong className="text-slate-800">
                  {format(firstDayCurrentMonth, "MMMM yyyy")}
                </strong>
              </>
            )}
            {viewMode === "all" && <>All meetings organized date-wise</>}
          </span>
          <span className="font-semibold text-purple-600">
            {activeMeetings.length}{" "}
            {activeMeetings.length === 1 ? "meeting" : "meetings"}
          </span>
        </div>
      </div>

      {/* Grouped Meeting List Render */}
      <div className="mt-4 max-h-[500px] overflow-y-auto pr-1">
        {Object.keys(groupedActiveMeetings).length > 0 ? (
          <div className="space-y-5">
            {Object.entries(groupedActiveMeetings).map(([dateStr, meetings]) => {
              const groupDate = parseISO(dateStr);
              const isCurrentDay = isToday(groupDate);
              const isCurrentlySelected = isSameDay(groupDate, selectedDay);

              return (
                <div key={dateStr} className="space-y-2">
                  {/* Date Group Header */}
                  <div
                    onClick={() => onSelectDate(groupDate)}
                    className={classNames(
                      isCurrentlySelected
                        ? "bg-purple-50 border-purple-200 text-purple-900"
                        : "bg-slate-50 border-slate-200/80 text-slate-700",
                      "cursor-pointer flex items-center justify-between rounded-xl border px-3 py-1.5 transition-all hover:border-purple-300",
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3.5 w-3.5 text-purple-600" />
                      <span className="text-xs font-bold">
                        {format(groupDate, "EEEE, MMM dd, yyyy")}
                      </span>
                      {isCurrentDay && (
                        <span className="rounded-full bg-purple-600 px-2 py-0.5 text-[10px] font-bold text-white">
                          Today
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] font-semibold text-slate-400">
                      {meetings.length}{" "}
                      {meetings.length === 1 ? "event" : "events"}
                    </span>
                  </div>

                  {/* Meeting Items under this date */}
                  <ol className="space-y-2 pl-1">
                    {meetings.map((meeting) => (
                      <MeetingItem
                        key={meeting.id}
                        meeting={meeting}
                        onEdit={() => onEditMeeting(meeting)}
                        onDelete={onDeleteMeeting}
                        onDeleteSeries={onDeleteSeries}
                        onSelectDate={() => onSelectDate(groupDate)}
                      />
                    ))}
                  </ol>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 py-10 px-4 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
              <CalendarCheck2 className="h-6 w-6" />
            </div>
            <p className="mt-3 text-sm font-semibold text-slate-800">
              {searchQuery
                ? `No meetings matching "${searchQuery}"`
                : "No meetings found in this view"}
            </p>
            <p className="mt-1 text-xs text-slate-400 max-w-xs">
              {searchQuery
                ? "Try adjusting your search terms or clear the filter."
                : "Schedule one-time, weekly, or monthly meetings with the button below."}
            </p>
            {searchQuery ? (
              <button
                type="button"
                onClick={() => onSearchChange("")}
                className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-purple-50 px-3.5 py-2 text-xs font-semibold text-purple-700 hover:bg-purple-100 transition-colors"
              >
                Clear search
              </button>
            ) : (
              <button
                type="button"
                onClick={onOpenAddModal}
                className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-purple-50 px-3.5 py-2 text-xs font-semibold text-purple-700 hover:bg-purple-100 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Add meeting
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

