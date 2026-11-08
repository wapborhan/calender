import { format } from "date-fns";

export function exportMeetingsToICS(meetingsList) {
  let icsContent =
    "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//SR Calendar//EN\nCALSCALE:GREGORIAN\n";

  meetingsList.forEach((m) => {
    const start = m.startDatetime.replace(/[-:]/g, "").slice(0, 15);
    const end = m.endDatetime.replace(/[-:]/g, "").slice(0, 15);
    icsContent += "BEGIN:VEVENT\n";
    icsContent += `UID:${m.id}@srcalendar.local\n`;
    icsContent += `DTSTART:${start}\n`;
    icsContent += `DTEND:${end}\n`;
    icsContent += `SUMMARY:${m.title || "Meeting"} with ${m.name}\n`;
    icsContent += "END:VEVENT\n";
  });

  icsContent += "END:VCALENDAR";

  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute(
    "download",
    `sr-calendar-export-${format(new Date(), "yyyy-MM-dd")}.ics`,
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

