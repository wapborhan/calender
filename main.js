//Class Select
const monthDay = document.querySelector(".calendar-days");
let currentMonth = document.querySelector(".current-month");
//Date Make
const date = new Date();
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const genarateCalender = () => {
  const currentMonthdays = new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0
  ).getDate();

  const currentDate = new Date().getDate();

  currentMonth.innerHTML = months[date.getMonth()] + " " + date.getFullYear();

  date.setDate(1);
  //Prev Day
  const prevDay = new Date(date.getFullYear(), date.getMonth(), 0).getDate();
  const prevMonthdays = date.getDay();
  //Next Day
  const nextDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDay();
  const nextMonthdays = 7 - nextDay - 1;

  let days = "";
  //Prev Months Days
  for (let k = prevMonthdays; k > 0; k--) {
    days += `<div class="padding-day">${prevDay - k + 1}</div>`;
  }

  //Current Months Days
  for (let i = 1; i <= currentMonthdays; i++) {
    if (i === currentDate && date.getMonth() === new Date().getMonth()) {
      days += `<div class="current-day">${i}</div>`;
    } else {
      days += `<div class="month-day">${i}</div>`;
    }
  }

  //Next Months Days
  for (let j = 1; j <= nextMonthdays; j++) {
    days += `<div class="padding-day">${j}</div>`;
    monthDay.innerHTML = days;
  }
};

//
let prev = document.querySelector(".prev").addEventListener("click", () => {
  date.setMonth(date.getMonth() - 1);
  genarateCalender();
});

let next = document.querySelector(".next").addEventListener("click", () => {
  date.setMonth(date.getMonth() + 1);
  genarateCalender();
});
genarateCalender();
