import { Menu, Transition } from "@headlessui/react";
import {
  MoreVertical,
  Clock,
  Trash2,
  Repeat,
  CalendarRange,
  Edit2,
  User,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { Fragment, useState } from "react";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function MeetingItem({
  meeting,
  onEdit,
  onDelete,
  onDeleteSeries,
  onSelectDate,
}) {
  const [imgError, setImgError] = useState(false);
  const startDateTime = parseISO(meeting.startDatetime);
  const endDateTime = parseISO(meeting.endDatetime);

  return (
    <li className="group flex items-center space-x-3.5 rounded-2xl border border-slate-100 bg-white p-3 shadow-xs transition-all duration-150 hover:border-purple-200 hover:shadow-md hover:shadow-purple-500/5 focus-within:border-purple-200">
      {/* Avatar with fallback initials / icon */}
      {meeting.imageUrl && !imgError ? (
        <img
          src={meeting.imageUrl}
          alt={meeting.name}
          onError={() => setImgError(true)}
          className="h-11 w-11 flex-none rounded-xl object-cover ring-1 ring-slate-200/80 cursor-pointer"
          onClick={onSelectDate}
        />
      ) : (
        <div
          onClick={onSelectDate}
          className="flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 font-bold text-white text-xs ring-1 ring-slate-200/80 cursor-pointer shadow-2xs"
          title={meeting.name}
        >
          {meeting.name ? (
            meeting.name
              .split(" ")
              .map((n) => n[0])
              .slice(0, 2)
              .join("")
              .toUpperCase()
          ) : (
            <User className="h-4 w-4" />
          )}
        </div>
      )}

      <div className="flex-auto min-w-0 cursor-pointer" onClick={onSelectDate}>
        <div className="flex items-center gap-2 flex-wrap">
          <p className="font-semibold text-slate-900 text-sm truncate">
            {meeting.name}
          </p>

          {/* Recurrence Badge */}
          {meeting.recurrence === "weekly" && (
            <span className="inline-flex items-center gap-1 rounded-md bg-indigo-50 px-1.5 py-0.5 text-[10px] font-bold text-indigo-700">
              <Repeat className="h-2.5 w-2.5" />
              Weekly{" "}
              {meeting.recurrenceIndex
                ? `(${meeting.recurrenceIndex}/${meeting.totalRecurrences})`
                : ""}
            </span>
          )}

          {meeting.recurrence === "monthly" && (
            <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-1.5 py-0.5 text-[10px] font-bold text-amber-700">
              <CalendarRange className="h-2.5 w-2.5" />
              Monthly{" "}
              {meeting.recurrenceIndex
                ? `(${meeting.recurrenceIndex}/${meeting.totalRecurrences})`
                : ""}
            </span>
          )}

          {meeting.title && (
            <span className="hidden sm:inline-block rounded-md bg-purple-50 px-1.5 py-0.5 text-[10px] font-medium text-purple-700 truncate max-w-[130px]">
              {meeting.title}
            </span>
          )}
        </div>
        <p className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-500">
          <Clock className="h-3.5 w-3.5 text-purple-500 flex-shrink-0" />
          <time dateTime={meeting.startDatetime}>
            {format(startDateTime, "h:mm a")}
          </time>
          <span className="text-slate-300">–</span>
          <time dateTime={meeting.endDatetime}>
            {format(endDateTime, "h:mm a")}
          </time>
        </p>
      </div>

      <Menu
        as="div"
        className="relative opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-150"
      >
        <div>
          <Menu.Button className="-m-1.5 flex items-center rounded-xl p-2 text-slate-400 transition-all hover:bg-slate-100 hover:text-slate-700 active:scale-95 focus:outline-none focus:ring-2 focus:ring-purple-500/40">
            <span className="sr-only">Open options</span>
            <MoreVertical className="h-4 w-4" aria-hidden="true" />
          </Menu.Button>
        </div>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 z-20 mt-2 w-48 origin-top-right rounded-xl bg-white p-1 shadow-xl ring-1 ring-black/5 focus:outline-none">
            {/* Edit Option */}
            <Menu.Item>
              {({ active }) => (
                <button
                  type="button"
                  onClick={onEdit}
                  className={classNames(
                    active ? "bg-purple-50 text-purple-700" : "text-slate-700",
                    "flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors",
                  )}
                >
                  <Edit2 className="h-3.5 w-3.5 text-purple-600" />
                  Edit meeting
                </button>
              )}
            </Menu.Item>

            {/* Cancel Session */}
            <Menu.Item>
              {({ active }) => (
                <button
                  type="button"
                  onClick={() => onDelete(meeting.id)}
                  className={classNames(
                    active ? "bg-red-50 text-red-600" : "text-red-500",
                    "flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors",
                  )}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Cancel this session
                </button>
              )}
            </Menu.Item>

            {/* Cancel Series */}
            {meeting.recurrenceGroupId && (
              <Menu.Item>
                {({ active }) => (
                  <button
                    type="button"
                    onClick={() => onDeleteSeries(meeting.recurrenceGroupId)}
                    className={classNames(
                      active ? "bg-red-100 text-red-700" : "text-red-600",
                      "flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-bold transition-colors border-t border-slate-100 mt-1 pt-1.5",
                    )}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Cancel entire recurring series
                  </button>
                )}
              </Menu.Item>
            )}
          </Menu.Items>
        </Transition>
      </Menu>
    </li>
  );
}
