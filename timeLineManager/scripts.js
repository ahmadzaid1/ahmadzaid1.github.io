let events = [];

function addEvent() {
    const date = document.getElementById('eventDate').value;
    const title = document.getElementById('eventTitle').value;
    const description = document.getElementById('eventDescription').value;
    const position = document.getElementById('eventPosition').value;
    const icon = document.querySelector('input[name="icon"]:checked').value;

    events.push({
        date: new Date(date),
        title,
        description,
        position,
        icon
    });

    events.sort(function(a, b) {
        return a.date - b.date;
    });
    renderEvents();
}

function renderEvents() {
    const container = document.getElementById('eventsContainer');
    container.innerHTML = '';

    if (events.length === 0) return;

    const timelineStart = events[0].date;//earliest date
    const timelineEnd = events[events.length - 1].date;//leatest one
    const timelineRange = timelineEnd - timelineStart;//calculate range

    events.forEach(function(event, index) {
        const eventElement = document.createElement('div');//create the event as a div
        eventElement.className = 'event ' + event.position; //link the event in the css with it

        const position = timelineRange === 0 ? 50 ://if only one exists then center
            10 + ((event.date - timelineStart) / timelineRange) * 80;//other then do between 10 and 90

        eventElement.style.left = position + '%';//place the event
        eventElement.style.transform = 'translateX(-50%)';

        eventElement.innerHTML = `
            <div class="event-icon">
                <i class="fas ${event.icon}"></i>
            </div>
            <div class="event-date">${event.date.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            })}</div>
            <div class="event-title">${event.title}</div>
            <div class="event-description">${event.description}</div>
        `;

        const dot = document.createElement('div');//the dot
        dot.className = 'event-dot';//css for dot
        dot.style.left = position + '%';

        container.appendChild(eventElement);//append to the container
        container.appendChild(dot);
    });
}

function exportJSON() {
    const timelineData = JSON.stringify(events);
    const url = 'data:application/json;charset=utf-8,' + encodeURIComponent(timelineData);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'timeline.json';
    a.click();
}

function saveJSON() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';

    input.onchange = function(e) {/*e is the event object passed by the browser*/
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onload = function(event) {
            const importedEvents = JSON.parse(event.target.result);
            events = importedEvents.map(function(event) {
                return {
                    ...event,
                    date: new Date(event.date)
                };
            });
            renderEvents();
        };

        reader.readAsText(file);
    };

    input.click();
}

function exportAsPNG() {
    const timelineContainer = document.querySelector('.timeline-container');
    const exportContainer = timelineContainer.cloneNode(true);
    exportContainer.style.backgroundColor = 'beige';
    exportContainer.style.padding = '20px';
    document.body.appendChild(exportContainer);

    html2canvas(exportContainer, {
        backgroundColor: 'beige',
        scrollX: 0,
        scrollY: -window.scrollY//to avoid wrong screenshot
    }).then(function(canvas) {
        document.body.removeChild(exportContainer);
        const link = document.createElement('a');
        link.download = 'fantasy-timeline.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    });
}
