// 时间格式化
const dateFormate = (date) => {
  let time = new Date(date)
  let year = time.getFullYear()
  let month = time.getMonth()
  let day = time.getDate()

  return {year,month,day}
}

const getDate = (year, month, day) => {
  return new Date(year, month, day)
}

export {
  dateFormate,
  getDate
}