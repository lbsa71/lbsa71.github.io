function getFrac(r) {

  const i = Math.floor(r)
  const d = r-i

  const max = 10
  var min_b = max
  var min_t = 0
  var min_diff = max

  for(var b=max;b>2;b--)
  {
      const upper = Math.round(d*b)
      const lower = b

      const suggestion = upper/lower

      const diff = Math.abs(d-suggestion)

      if(diff <= min_diff) {
        min_b = b
        min_t = upper
        min_diff = diff
      }
  }

  return (i ? i + " " : "") + min_t + "/" + min_b
}

function calculate(start_day, now, end_day) {

const ms_per_day = 1000 * 3600 * 24
const vacation_weeks = [1, 27, 28, 29, 30, 52, 53]

var now_day = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0,0,0,0)


var start_day_ms = start_day.getTime()
var start_txt = start_day.toISOString()

var end_day_ms = end_day.getTime()
var end_day_txt = end_day.toISOString()

var today_txt = now.toISOString()

var days_ms = end_day_ms-start_day_ms
var days = days_ms / ms_per_day

var workdays = 0

var days_until_now = 0;
var days_until_vacay = 0;

for(d = 0; d < days; d++)
{
  var is_workday = true
  var as_ms = start_day_ms + d * ms_per_day
  var as_date = new Date(as_ms)

  var day = as_date.getDay()

  if(day === 0 || day === 6) is_workday = false

  var year = new Date(as_date.getFullYear(),0,1,0,0,0,0)

  var ms_into_year = as_date.getTime() - year.getTime()
  var days_into_year = ms_into_year / ms_per_day

  var week = Math.floor(days_into_year / 7) + 1

  if(vacation_weeks.includes(week)) {
     is_workday = false

     if(days_until_now && !days_until_vacay)
     {
       days_until_vacay = workdays-days_until_now
     }
   }

  if(is_workday) workdays++

  if(as_date < now_day) days_until_now = workdays;
}
var now_to_end_days = workdays - days_until_now

 return { today_txt, start_txt, end_day_txt, days, workdays, now_to_end_days, days_until_vacay }
}
