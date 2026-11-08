import { useState } from "react";
import {
  X,
  Calendar,
  Clock,
  User,
  Tag,
  Image as ImageIcon,
  Repeat,
  CalendarRange,
  Edit2,
  Plus,
  Layers,
} from "lucide-react";
import { format, addWeeks, addMonths, parseISO } from "date-fns";

const AVATAR_OPTIONS = [
  {
    label: "Lucifar",
    url: "https://wapborhan.com/wb-logo.png",
  },
  {
    label: "Michael",
    url: "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
  {
    label: "Leslie",
    url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
  {
    label: "Dries",
    url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
  {
    label: "Courtney",
    url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
  {
    label: "Tom",
    url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
];

export default function AddMeetingModal({
  isOpen,
  onClose,
  onAddMeetings,
  onUpdateMeeting,
  defaultDate,
  meetingToEdit = null,
}) {
  const isEditing = Boolean(meetingToEdit);
  const isRecurring = Boolean(meetingToEdit?.recurrenceGroupId);

  // Compute initial state from meetingToEdit or defaults
  const initialDateStr = meetingToEdit
    ? format(parseISO(meetingToEdit.startDatetime), "yyyy-MM-dd")
    : defaultDate
      ? format(defaultDate, "yyyy-MM-dd")
      : format(new Date(), "yyyy-MM-dd");

  const initialStartTime = meetingToEdit
    ? format(parseISO(meetingToEdit.startDatetime), "HH:mm")
    : "10:00";

  const initialEndTime = meetingToEdit
    ? format(parseISO(meetingToEdit.endDatetime), "HH:mm")
    : "11:00";

  const [name, setName] = useState(meetingToEdit ? meetingToEdit.name : "");
  const [title, setTitle] = useState(
    meetingToEdit ? meetingToEdit.title || "" : "",
  );
  const [date, setDate] = useState(initialDateStr);
  const [startTime, setStartTime] = useState(initialStartTime);
  const [endTime, setEndTime] = useState(initialEndTime);
  const [selectedAvatar, setSelectedAvatar] = useState(
    meetingToEdit ? meetingToEdit.imageUrl : AVATAR_OPTIONS[0].url,
  );
  const [recurrence, setRecurrence] = useState("none"); // "none" | "weekly" | "monthly"
  const [repeatCount, setRepeatCount] = useState(4); // number of repetitions
  const [editScope, setEditScope] = useState("single"); // "single" | "series"

  if (!isOpen) return null;

  function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim() || !date || !startTime || !endTime) return;

    if (isEditing) {
      const updatedData = {
        ...meetingToEdit,
        name: name.trim(),
        title: title.trim() || "General Meeting",
        imageUrl: selectedAvatar,
        date,
        startTime,
        endTime,
        startDatetime: `${date}T${startTime}:00`,
        endDatetime: `${date}T${endTime}:00`,
      };
      onUpdateMeeting(updatedData, editScope);
      onClose();
      return;
    }

    const baseDate = parseISO(`${date}T00:00:00`);
    const newMeetings = [];
    const recurrenceGroupId =
      recurrence !== "none" ? `series-${Date.now()}` : null;
    const count = recurrence === "none" ? 1 : Math.max(1, Number(repeatCount));

    for (let i = 0; i < count; i++) {
      let meetingDate = baseDate;
      if (recurrence === "weekly") {
        meetingDate = addWeeks(baseDate, i);
      } else if (recurrence === "monthly") {
        meetingDate = addMonths(baseDate, i);
      }

      const dateStr = format(meetingDate, "yyyy-MM-dd");
      newMeetings.push({
        id: `meeting-${Date.now()}-${i}`,
        name: name.trim(),
        title: title.trim() || "General Meeting",
        imageUrl: selectedAvatar,
        startDatetime: `${dateStr}T${startTime}:00`,
        endDatetime: `${dateStr}T${endTime}:00`,
        recurrence,
        recurrenceGroupId,
        recurrenceIndex: i + 1,
        totalRecurrences: count,
      });
    }

    onAddMeetings(newMeetings);
    setName("");
    setTitle("");
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs transition-opacity">
      <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl ring-1 ring-slate-100 sm:p-8 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
              {isEditing ? (
                <Edit2 className="h-4 w-4" />
              ) : (
                <Plus className="h-5 w-5" />
              )}
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                {isEditing ? "Edit Meeting" : "Add New Meeting"}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {isEditing
                  ? isRecurring
                    ? `Part of a ${meetingToEdit.recurrence} recurring schedule`
                    : "Update meeting timing and info"
                  : "Supports one-time, weekly, and monthly recurring schedules"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Edit Scope Selector (Only visible when editing a recurring meeting) */}
          {isEditing && isRecurring && (
            <div className="rounded-2xl border border-purple-200 bg-purple-50/70 p-4">
              <label className="flex items-center gap-1.5 text-xs font-bold text-purple-900 mb-2">
                <Layers className="h-3.5 w-3.5 text-purple-600" />
                How would you like to apply your edits?
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setEditScope("single")}
                  className={`rounded-xl p-2.5 text-left border transition-all ${
                    editScope === "single"
                      ? "border-purple-600 bg-white shadow-xs font-bold text-purple-900"
                      : "border-purple-200/70 bg-white/60 text-slate-600 hover:bg-white"
                  }`}
                >
                  <div className="font-bold">This day only</div>
                  <div className="text-[11px] font-normal text-slate-500 mt-0.5">
                    Update only this date ({date})
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setEditScope("series")}
                  className={`rounded-xl p-2.5 text-left border transition-all ${
                    editScope === "series"
                      ? "border-purple-600 bg-white shadow-xs font-bold text-purple-900"
                      : "border-purple-200/70 bg-white/60 text-slate-600 hover:bg-white"
                  }`}
                >
                  <div className="font-bold flex items-center gap-1">
                    <Repeat className="h-3 w-3 text-purple-600" />
                    Entire series
                  </div>
                  <div className="text-[11px] font-normal text-slate-500 mt-0.5">
                    Update all {meetingToEdit.recurrence} sessions
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Participant Name */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-1.5">
              <User className="h-3.5 w-3.5 text-purple-600" />
              Participant / Host Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Alex Morgan"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20"
            />
          </div>

          {/* Meeting Title / Topic */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-1.5">
              <Tag className="h-3.5 w-3.5 text-purple-600" />
              Meeting Title or Topic
            </label>
            <input
              type="text"
              placeholder="e.g. Weekly Strategy Sync"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20"
            />
          </div>

          {/* Date Picker (Disabled when editing entire series so dates remain on their scheduled weeks/months) */}
          <div>
            <label className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1.5">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-purple-600" />
                {isEditing ? "Meeting Date *" : "Start Date *"}
              </span>
              {isEditing && isRecurring && editScope === "series" && (
                <span className="text-[10px] text-purple-700 font-medium">
                  Series dates are preserved on each {meetingToEdit.recurrence}{" "}
                  interval
                </span>
              )}
            </label>
            <input
              type="date"
              required
              disabled={isEditing && isRecurring && editScope === "series"}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20 disabled:bg-slate-100 disabled:text-slate-500"
            />
          </div>

          {/* Time Range */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-1.5">
                <Clock className="h-3.5 w-3.5 text-purple-600" />
                Start Time *
              </label>
              <input
                type="time"
                required
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20"
              />
            </div>
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-1.5">
                <Clock className="h-3.5 w-3.5 text-purple-600" />
                End Time *
              </label>
              <input
                type="time"
                required
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20"
              />
            </div>
          </div>

          {/* Recurrence Schedule Option (Only when creating new) */}
          {!isEditing && (
            <div className="rounded-2xl border border-purple-100 bg-purple-50/50 p-4">
              <label className="flex items-center gap-1.5 text-xs font-bold text-slate-800 mb-2.5">
                <Repeat className="h-3.5 w-3.5 text-purple-600" />
                Schedule Recurrence
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setRecurrence("none")}
                  className={`rounded-xl py-2 px-3 text-xs font-semibold transition-all ${
                    recurrence === "none"
                      ? "bg-purple-600 text-white shadow-xs"
                      : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  One-time
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setRecurrence("weekly");
                    if (repeatCount < 2) setRepeatCount(4);
                  }}
                  className={`rounded-xl py-2 px-3 text-xs font-semibold transition-all flex items-center justify-center gap-1 ${
                    recurrence === "weekly"
                      ? "bg-purple-600 text-white shadow-xs"
                      : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <Repeat className="h-3 w-3" />
                  Weekly
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setRecurrence("monthly");
                    if (repeatCount < 2) setRepeatCount(3);
                  }}
                  className={`rounded-xl py-2 px-3 text-xs font-semibold transition-all flex items-center justify-center gap-1 ${
                    recurrence === "monthly"
                      ? "bg-purple-600 text-white shadow-xs"
                      : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <CalendarRange className="h-3 w-3" />
                  Monthly
                </button>
              </div>

              {/* Recurrence Repeat Count Config */}
              {recurrence !== "none" && (
                <div className="mt-3.5 pt-3 border-t border-purple-200/50 flex items-center justify-between text-xs">
                  <span className="text-slate-600 font-medium">
                    Repeat for how many{" "}
                    {recurrence === "weekly" ? "weeks" : "months"}?
                  </span>
                  <div className="flex items-center gap-2">
                    <select
                      value={repeatCount}
                      onChange={(e) => setRepeatCount(Number(e.target.value))}
                      className="rounded-lg border border-purple-200 bg-white px-2.5 py-1 text-xs font-bold text-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600/20"
                    >
                      {[2, 3, 4, 6, 8, 12, 16, 24].map((num) => (
                        <option key={num} value={num}>
                          {num} {recurrence === "weekly" ? "weeks" : "months"}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Avatar Selector */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-2">
              <ImageIcon className="h-3.5 w-3.5 text-purple-600" />
              Select Avatar
            </label>
            <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
              {AVATAR_OPTIONS.map((item) => (
                <button
                  type="button"
                  key={item.label}
                  onClick={() => setSelectedAvatar(item.url)}
                  className={`relative rounded-xl p-0.5 transition-all ${
                    selectedAvatar === item.url
                      ? "ring-2 ring-purple-600 scale-105"
                      : "opacity-70 hover:opacity-100"
                  }`}
                >
                  <img
                    src={item.url}
                    alt={item.label}
                    className="h-9 w-9 rounded-lg object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-purple-500/20 hover:from-purple-700 hover:to-indigo-700 active:scale-95 transition-all"
            >
              {isEditing
                ? isRecurring && editScope === "series"
                  ? `Update All ${meetingToEdit.recurrence} Sessions`
                  : "Update This Meeting"
                : recurrence === "none"
                  ? "Save Meeting"
                  : `Schedule ${repeatCount} ${recurrence === "weekly" ? "Weekly" : "Monthly"} Sessions`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
