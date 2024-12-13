document.addEventListener('DOMContentLoaded', () => {
  const timelineContainer = document.getElementById('timeline-container');
  const addEventBtn = document.getElementById('add-event-btn');
  const exportBtn = document.getElementById('export-btn');
  const feedbackMessage = document.getElementById('feedback-message');

  let draggedEvent = null;

  // Add a new event
  addEventBtn.addEventListener('click', () => {
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const date = document.getElementById('date').value;

    if (title && description && date) {
      const eventDiv = document.createElement('div');
      eventDiv.classList.add('event');
      eventDiv.setAttribute('draggable', 'true');
      eventDiv.innerHTML = `
        <div class="event-title">${title}</div>
        <div class="event-description">${description}</div>
        <div class="event-date">Date: ${new Date(date).toLocaleDateString()}</div>
      `;

      // Add drag-and-drop event listeners
      eventDiv.addEventListener('dragstart', handleDragStart);
      eventDiv.addEventListener('dragend', handleDragEnd);

      timelineContainer.appendChild(eventDiv);
      feedbackMessage.textContent = 'Event Added! Drag it to the timeline.';
      feedbackMessage.style.color = 'green';

      // Reset form
      document.getElementById('event-form').reset();
    } else {
      feedbackMessage.textContent = 'Please fill out all fields!';
      feedbackMessage.style.color = 'red';
    }
  });

  // Drag-and-drop handlers
  function handleDragStart(event) {
    draggedEvent = event.target;
    draggedEvent.classList.add('dragging');
  }

  function handleDragEnd(event) {
    draggedEvent.classList.remove('dragging');
    draggedEvent = null;
  }

  // Allow dropping on the timeline container
  timelineContainer.addEventListener('dragover', (event) => {
    event.preventDefault(); // Allow drop
  });

  timelineContainer.addEventListener('drop', (event) => {
    event.preventDefault();
    if (draggedEvent) {
      // Position the event where it was dropped
      const rect = timelineContainer.getBoundingClientRect();
      const offsetX = event.clientX - rect.left;
      const offsetY = event.clientY - rect.top;

      draggedEvent.style.left = `${offsetX - draggedEvent.offsetWidth / 2}px`;
      draggedEvent.style.top = `${offsetY - draggedEvent.offsetHeight / 2}px`;
    }
  });

  // Export timeline as PNG
  exportBtn.addEventListener('click', () => {
    html2canvas(timelineContainer).then(canvas => {
      const link = document.createElement('a');
      link.href = canvas.toDataURL();
      link.download = 'timeline.png';
      link.click();
    });
  });
});
