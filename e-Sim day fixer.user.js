// ==UserScript==
// @name         Jetta's day fixer
// @version      1.0
// @description  Add game days to timestmaps/n-time ago (if possible)
// @author       Jetta
// @match        http://*.e-sim.org/*
// @match        https://*.e-sim.org/*
// @iconURL      https://cdn.e-sim.org//img/favicon.png
// @grant        none
// @downloadURL  https://github.com/Jettucis/esim-day-fixer/raw/main/e-Sim%20day%20fixer.user.js
// @updateURL    https://github.com/Jettucis/esim-day-fixer/raw/main/e-Sim%20day%20fixer.user.js
// ==/UserScript==

/* Not doable for:
  *inboxMessages.html
  *pendingCitizenReports.html
  *inviteFriends.html 
*/
$(document).ready(function() {
  const currentDay = document.querySelector('.sidebar-clock b:nth-child(3)').textContent.split(' ')[1];
  const currentDayMatch = document.querySelector('.time').textContent.match(/\d{2}-\d{2}-\d{4}/);
  /**
  * Main function for processing.
  * @param {RegExp} matchRegex - Used regexp.
  * @param {String} format - What date format is used 422 (YYYY-MM-DD) or 244 (DD-MM-YYYY).
  */
  function processTextNodes(matchRegex, format) {
    $('body *:not(style):not(script):not(.time)').contents().filter(function() {
      return this.nodeType === 3 && matchRegex.test(this.nodeValue);
    }).each(function() {
      const initialText = $(this).text().trim();
      const dayMatch = initialText.match(matchRegex);
      if (!dayMatch) return;
      $(this).replaceWith(`<b>Day ${getDayFunction(dayMatch[0], format)}</b><br>${initialText}`)
    });
  }
  /**
  * Returns timestamps game day.
  * @param {String} match - Parsed timestamp DD-MM-YYYY or YYYY-MM-DD.
  * @param {String} format - What format is used.
  */
  function getDayFunction(match, format) {
    const [dayNow,monthNow,yearNow] = currentDayMatch[0].split('-').map(Number);
    let [dayTarget, monthTarget, yearTarget] = match.split('-').map(Number);
    if (format === '422') [yearTarget, monthTarget, dayTarget] = match.split('-').map(Number);
    const todaysDate = new Date(yearNow, monthNow - 1, dayNow);
    const targetDate = new Date(yearTarget, monthTarget - 1, dayTarget);
    const timeDifference = todaysDate - targetDate;
    return currentDay - (timeDifference/(1000*60*60*24)).toFixed(0);
  }

  processTextNodes(/\d{2}-\d{2}-\d{4}/, '224');
  processTextNodes(/\d{4}-\d{2}-\d{2}/, '422');
});