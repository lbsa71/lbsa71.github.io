var start = new Date()
var end = new Date(2029, 7, 1)

var start_txt = start.toISOString()
var end_txt = end.toISOString()

var today = new Date(start.getFullYear(), start.getMonth(), start.getDay(), 0,0,0,0)
var today_txt = end.toISOString()

var today_ms = today.getTime()
var end_ms = end.getTime()

const ms_per_day = 1000 * 3600 * 24
const vacation_weeks = [1, 27, 28, 29, 30, 52, 53]

var days_ms = end_ms-today_ms
var days = days_ms / ms_per_day

var workdays = 0

for(d = 0; d < days; d++)
{
  var is_workday = true
  var as_ms = today_ms + d * ms_per_day
  var as_date = new Date(as_ms)

  var day = as_date.getDay()

  if(day === 0 || day === 6) is_workday = false

  var year = new Date(as_date.getFullYear(),0,1,0,0,0,0)

  var ms_into_year = as_date.getTime() - year.getTime()
  var days_into_year = ms_into_year / ms_per_day

  var week = Math.floor(days_into_year / 7)

  if(vacation_weeks.includes(week)) is_workday = false

  if(is_workday) workdays++
}
