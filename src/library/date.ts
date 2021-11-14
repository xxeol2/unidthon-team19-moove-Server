function stringToDate(str: String) {
  var dateParts = str.split("-");

  return new Date(
    parseInt(dateParts[0]),
    parseInt(dateParts[1]) - 1,
    parseInt(dateParts[2])
  );
}

function stringToEndDate(str: String) {
  var dateParts = str.split("-");

  return new Date(
    parseInt(dateParts[0]),
    parseInt(dateParts[1]) - 1,
    parseInt(dateParts[2]),
    23,
    59,
    59
  );
}

function dateToNumber(Dt: Date) {
  return new Date(Dt).getTime();
}

// 두 날짜 차이
function period(start: Date, end: Date) {
  var diff = Math.abs(end.getTime() - start.getTime());
  diff = Math.ceil(diff / (1000 * 3600 * 24));

  return diff;
}

// Date to String
function dateToString(dt: Date) {
  var date = new Date();
  var year = date.getFullYear();

  var month = new String(date.getMonth() + 1);
  month = Number(month) >= 10 ? month : "0" + month; // month 두자리로 저장
  var day = new String(date.getDate());
  day = Number(day) >= 10 ? day : "0" + day;
  var hour = new String(date.getHours());
  hour = Number(hour) >= 10 ? hour : "0" + hour;
  var minute = new String(date.getMinutes());
  minute = Number(minute) >= 10 ? minute : "0" + minute;
  var second = new String(date.getSeconds());
  second = Number(second) >= 10 ? second : "0" + minute;
  return (
    year + "/" + month + "/" + day + " " + hour + ":" + minute + ":" + second
  );
}

const date = {
  stringToDate,
  stringToEndDate,
  dateToNumber,
  dateToString,
  period,
};

export default date;
