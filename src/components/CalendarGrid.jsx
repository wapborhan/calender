import {
  ChevronLeft,
  ChevronRight,
  Download,
  Sparkles,
} from "lucide-react";
import {
  format,
  isEqual,
  isSameDay,
  isSameMonth,
  isToday,
  getDay,
  parseISO,
} from "date-fns";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function CalendarGrid({
  days,
  firstDayCurrentMonth,
  selectedDay,
  today,
  meetingsList,
  onSelectDate,
  onPreviousMonth,
  onNextMonth,
  onGoToToday,
  onExportICS,
}) {
  return (
    <div className="lg:col-span-7 xl:col-span-7">
      {/* Month Header Navigation */}
      <div className="flex items-center justify-between pb-5">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
            {format(firstDayCurrentMonth, "MMMM yyyy")}
            <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-purple-50 px-2.5 py-0.5 text-xs font-semibold text-purple-700">
              <Sparkles className="h-3 w-3 text-purple-500" />
              {format(today, "yyyy")}
            </span>
          </h2>
          <p className="text-xs font-medium text-slate-400 mt-0.5">
            Click any bordered date cell to view or schedule events
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onGoToToday}
            className="inline-flex items-center rounded-xl bg-purple-50 px-3 py-1.5 text-xs font-bold text-purple-700 transition-all duration-150 hover:bg-purple-100 active:scale-95 shadow-2xs"
            title="Press 'T' for Today"
          >
            Today
          </button>
          <button
            type="button"
            onClick={onPreviousMonth}
            aria-label="Previous month"
            className="flex h-8.5 w-8.5 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition-all duration-150 hover:bg-slate-100 hover:text-slate-900 active:scale-95"
          >
            <ChevronLeft className="h-4.5 w-4.5" />
          </button>
          <button
            type="button"
            onClick={onNextMonth}
            aria-label="Next month"
            className="flex h-8.5 w-8.5 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition-all duration-150 hover:bg-slate-100 hover:text-slate-900 active:scale-95"
          >
            <ChevronRight className="h-4.5 w-4.5" />
          </button>
        </div>
      </div>

      {/* Modern Calendar Grid with Uniform Borders Between Every Date */}
      <div className="rounded-2xl border border-slate-200/90 bg-slate-200/80 p-[1px] shadow-sm overflow-hidden">
        {/* Weekday Column Headers starting on Saturday */}
        <div className="grid grid-cols-7 gap-[1px] bg-slate-200/80 pb-[1px]">
          {["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"].map(
            (dayName, idx) => (
              <div
                key={dayName}
                className={classNames(
                  "py-2.5 text-center text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-1",
                  idx === 6
                    ? "bg-rose-50/80 text-rose-600 font-extrabold"
                    : "bg-slate-50/90 text-slate-500",
                )}
              >
                <span>{dayName}</span>
                {idx === 6 && (
                  <span className="rounded-md bg-rose-100 text-rose-700 px-1 py-0.2 text-[9px] font-bold">
                    Off
                  </span>
                )}
              </div>
            ),
          )}
        </div>

        {/* Day Cells Grid */}
        <div className="grid grid-cols-7 gap-[1px]">
          {days.map((day) => {
            const dayMeetings = meetingsList.filter((meeting) =>
              isSameDay(parseISO(meeting.startDatetime), day),
            );
            const isSelected = isEqual(day, selectedDay);
            const isCurrentToday = isToday(day);
            const isInCurrentMonth = isSameMonth(day, firstDayCurrentMonth);
            const isFriday = getDay(day) === 5;
            const hasWeekly = dayMeetings.some((m) => m.recurrence === "weekly");
            const hasMonthly = dayMeetings.some(
              (m) => m.recurrence === "monthly",
            );

            return (
              <button
                key={day.toString()}
                type="button"
                onClick={() => onSelectDate(day)}
                className={classNames(
                  "group relative flex min-h-[64px] sm:min-h-[76px] flex-col justify-between p-1.5 sm:p-2 text-left transition-all duration-150",
                  isSelected
                    ? "bg-purple-50/90 ring-2 ring-inset ring-purple-600 z-10"
                    : isFriday && isInCurrentMonth
                    ? "bg-rose-50/30 hover:bg-rose-50/70"
                    : isInCurrentMonth
                    ? "bg-white hover:bg-slate-50/80"
                    : "bg-slate-50/50 hover:bg-slate-100/50",
                )}
              >
                {/* Date Number Header */}
                <div className="flex items-center justify-between w-full">
                  <span
                    className={classNames(
                      "flex h-6 w-6 items-center justify-center rounded-lg text-xs font-bold transition-transform group-hover:scale-105",
                      isCurrentToday
                        ? "bg-purple-600 text-white shadow-xs"
                        : isSelected
                        ? "text-purple-700 font-extrabold"
                        : isFriday && isInCurrentMonth
                        ? "text-rose-600 font-bold"
                        : isInCurrentMonth
                        ? "text-slate-800"
                        : "text-slate-300",
                    )}
                  >
                    <time dateTime={format(day, "yyyy-MM-dd")}>
                      {format(day, "d")}
                    </time>
                  </span>

                  <div className="flex items-center gap-1">
                    {/* Off day badge on desktop */}
                    {isFriday &&
                      isInCurrentMonth &&
                      !isCurrentToday &&
                      !isSelected && (
                        <span className="hidden sm:inline-block text-[9px] font-bold text-rose-500">
                          Off
                        </span>
                      )}

                    {/* Meeting count pill badge on desktop */}
                    {dayMeetings.length > 0 && (
                      <span
                        className={classNames(
                          "hidden sm:inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.2 text-[9px] font-bold",
                          hasMonthly
                            ? "bg-amber-100 text-amber-800"
                            : hasWeekly
                            ? "bg-indigo-100 text-indigo-800"
                            : "bg-purple-100 text-purple-800",
                        )}
                      >
                        {dayMeetings.length}
                      </span>
                    )}
                  </div>
                </div>

                {/* Meeting Indicators in the Date Cell */}
                <div className="mt-1 w-full">
                  {dayMeetings.length > 0 ? (
                    <div>
                      {/* Desktop Badge Preview */}
                      <div className="hidden sm:block">
                        <div
                          className={classNames(
                            "flex items-center gap-1 rounded-md px-1 py-0.5 text-[10px] font-semibold truncate",
                            hasMonthly
                              ? "bg-amber-50 text-amber-700 border border-amber-200/60"
                              : hasWeekly
                              ? "bg-indigo-50 text-indigo-700 border border-indigo-200/60"
                              : "bg-purple-50 text-purple-700 border border-purple-200/60",
                          )}
                        >
                          <span
                            className={classNames(
                              "h-1.5 w-1.5 rounded-full flex-shrink-0",
                              hasMonthly
                                ? "bg-amber-500"
                                : hasWeekly
                                ? "bg-indigo-500"
                                : "bg-purple-500",
                            )}
                          />
                          <span className="truncate">
                            {dayMeetings[0].title || dayMeetings[0].name}
                          </span>
                        </div>
                      </div>

                      {/* Mobile Dots */}
                      <div className="flex sm:hidden items-center justify-center gap-1 mt-1">
                        {dayMeetings.slice(0, 3).map((m, idx) => (
                          <span
                            key={idx}
                            className={classNames(
                              "h-1.5 w-1.5 rounded-full",
                              m.recurrence === "monthly"
                                ? "bg-amber-500"
                                : m.recurrence === "weekly"
                                ? "bg-indigo-500"
                                : "bg-purple-600",
                            )}
                          />
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="h-3" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Legend, Export, Shortcuts & Reset Bar */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4 text-xs text-slate-500">
        <div className="flex flex-wrap items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-purple-500" />
            Standard
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-indigo-500" />
            Weekly
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-amber-500" />
            Monthly
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-rose-500" />
            Friday (Off day)
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onExportICS}
            className="inline-flex items-center gap-1 font-semibold text-slate-600 hover:text-purple-600 transition-colors"
            title="Export schedule to .ics (Google/Apple Calendar)"
          >
            <Download className="h-3.5 w-3.5" />
            Export (.ics)
          </button>
        </div>
      </div>
    </div>
  );
}
