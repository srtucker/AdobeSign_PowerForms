export default {
  addDays: function(date, days) {
    // Create new date object and add the days delta to it
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  },

  format: function(date, formatStr) {
    // Create the day, month, and year variables
    let DD = date.getDate();
    let MM = date.getMonth() + 1;
    let YYYY = date.getFullYear();

    // Month under 10 add leading 0
    if (DD < 10) {
      DD = '0' + DD
    }
    if (MM < 10) {
      MM = '0' + MM
    }

    return formatStr.replace("MM", MM).replace("DD", DD).replace("YYYY", YYYY);
  }
}
