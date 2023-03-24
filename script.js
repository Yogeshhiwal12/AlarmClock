// Get DOM elements
const clockHours = document.querySelector('.clock__hours');
const clockMinutes = document.querySelector('.clock__minutes');
const clockSeconds = document.querySelector('.clock__seconds');
const alarmForm = document.querySelector('.alarm-form');
const alarmList = document.querySelector('.alarm-list');

// Update clock display every second
setInterval(() => {
  const now = new Date();
  let hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12; // Convert to 12-hour format
  clockHours.textContent = hours;
  clockMinutes.textContent = minutes;
  clockSeconds.textContent = seconds;
  clockHours.dataset.ampm = ampm; // Set the AM/PM indicator as a data attribute
}, 1000);


// Function to delete alarm
function deleteAlarm(alarmItem) {
  clearInterval(alarmItem.intervalId); // Stop checking
  alarmList.removeChild(alarmItem); // Remove alarm from list
}

// Handle form submit to set alarm
alarmForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const hour = parseInt(alarmForm.hour.value);
  const minute = parseInt(alarmForm.minute.value);
  const second = parseInt(alarmForm.second.value);
  const ampm = alarmForm.ampm.value;
  const alarmTime = new Date();
  alarmTime.setHours(hour + (ampm === 'PM' && hour !== 12 ? 12 : 0)); // Convert to 24-hour format
  alarmTime.setMinutes(minute);
  alarmTime.setSeconds(second);
  if (alarmTime < new Date()) {
    // If alarm time is in the past, add 1 day to it
    alarmTime.setDate(alarmTime.getDate() + 1);
  }
  const alarmItem = document.createElement('li');
  alarmItem.textContent = `Alarm set for ${hour}:${minute.toString().padStart(2, '0')}:${second.toString().padStart(2, '0')} ${ampm}`;
  // Create a delete button for the alarm
  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Delete';
  deleteButton.addEventListener('click', () => {
    deleteAlarm(alarmItem);
  });
  alarmItem.appendChild(deleteButton);
  alarmList.appendChild(alarmItem);
  // Check every second if the alarm time has been reached
  const intervalId = setInterval(() => {
    if (new Date() >= alarmTime) {
      clearInterval(intervalId); // Stop checking
      // Remove delete button and mark alarm as triggered
      alarmItem.removeChild(deleteButton);
      alarmItem.classList.add('triggered');
      alert('Alarm!'); // Alert user
      deleteAlarm(alarmItem); // Automatically remove triggered alarm
    }
  }, 1000);
  alarmItem.intervalId = intervalId; // Store interval ID in the alarm item object
});
