function calculate() {
const ms_per_day = 1000 * 3600 * 24
const vacation_weeks = [1, 27, 28, 29, 30, 52, 53]

var now = new Date()
var now_day = new Date(now.getFullYear(), now.getMonth(), now.getDay(), 0,0,0,0)

var start = new Date(1990,8,1)
var start_day = new Date(start.getFullYear(), start.getMonth(), start.getDay(), 0,0,0,0)
var start_day_ms = start_day.getTime()
var start_txt = start.toISOString()

var end_day = new Date(2029, 7, 1)
var end_day_ms = end_day.getTime()
var end_day_txt = end_day.toISOString()

var today_txt = now.toISOString()

var days_ms = end_day_ms-start_day_ms
var days = days_ms / ms_per_day

var workdays = 0

var days_until_now;

for(d = 0; d < days; d++)
{
  var is_workday = true
  var as_ms = start_day_ms + d * ms_per_day
  var as_date = new Date(as_ms)

  if(as_date < now_day) days_until_now = workdays;

  var day = as_date.getDay()

  if(day === 0 || day === 6) is_workday = false

  var year = new Date(as_date.getFullYear(),0,1,0,0,0,0)

  var ms_into_year = as_date.getTime() - year.getTime()
  var days_into_year = ms_into_year / ms_per_day

  var week = Math.floor(days_into_year / 7)

  if(vacation_weeks.includes(week)) is_workday = false

  if(is_workday) workdays++
}
var now_to_end_days = workdays - days_until_now

 return { today_txt, start_txt, end_day_txt, days, workdays, now_to_end_days }
}
