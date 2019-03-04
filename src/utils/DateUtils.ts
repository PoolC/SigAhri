function getTimeDiff(_date1: string | number, _date2: string | number) : number {
  /*******
   *
   * Gets 2 dates and returns difference in seconds
   * ex)
   * date1 = "2019-01-01T12:05:00Z"
   * date2 = "2019-01-01T12:00:00Z"
   *
   * getTimeDiff(date1, date2) // returns 300
   *
   */
  const _MILLISECONDS = 1000;

  const date1 = new Date(_date1);
  const date2 = new Date(_date2);

  const utc1 = Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate(), date1.getHours(), date1.getMinutes(), date1.getSeconds());
  const utc2 = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate(), date2.getHours(), date2.getMinutes(), date2.getSeconds());

  return Math.floor((utc1 - utc2) / _MILLISECONDS);
}

function ParseDate(dt: string | number, format: string) : string {
  /******
   *
   * Parses a ISO formatted date to local time with format YYYY-MM-DD HH:mm:SS
   * Currently accepted formats are "YYYY-MM-DD HH:mm:SS" and "ISO"
   * ex1) date1 = "2019-01-01T12:00:00Z"
   * ParseDate(date1) // returns 2019-01-01 21:00:00
   *
   * ex2) date2 = "2019-01-01T12:00:00+09:00"
   * ParseDate(date2) // returns 2019-01-01 12:00:00
   *
   */

  if(format === 'ISO') {
    format = 'YYYY-MM-DDTHH:mm:SS+09:00'
  } else if(format === 'YYYY-MM-DD HH:mm:SS') {
    // Don't do anything
  } else if(format === 'YYYY-MM-DD') {
    // Don't do anything
  } else {
    // Not yet implemented or invalid format
    return;
  }

  const appendZeroInFront = (literal: string | number) => {
    return `0${literal}`.slice(-2);
  };

  const date = new Date(dt);
  const year: string = date.getFullYear().toString();
  const month: string = appendZeroInFront(date.getMonth() + 1);
  const day: string = appendZeroInFront(date.getDate());
  const hours: string = appendZeroInFront(date.getHours());
  const minutes: string = appendZeroInFront(date.getMinutes());
  const seconds: string = appendZeroInFront(date.getSeconds());
  const fullDate = year + '-' + month + '-' + day;
  const fullTime = hours + ':' + minutes + ':' + seconds;

  let finalForm = format.replace('YYYY-MM-DD', fullDate);
  finalForm = finalForm.replace('HH:mm:SS', fullTime);
  return finalForm;
}

const dateUtils = {
  getTimeDiff: getTimeDiff,
  ParseDate: ParseDate
};

export default dateUtils;