let events = [];
        let scrollPosition = 0;

        function addEvent() {
            const date = document.getElementById('eventDate').value;
            const title = document.getElementById('eventTitle').value;
            const description = document.getElementById('eventDescription').value;
            const position = document.getElementById('eventPosition').value;
            const icon = document.querySelector('input[name="icon"]:checked').value;

            if (!date || !title || !description) {
                alert('Please fill in all fields of your chronicle');
                return;
            }

            events.push({
                date: new Date(date),
                title,
                description,
                position,
                icon
            });

            events.sort((a, b) => a.date - b.date);
            renderEvents();
            clearForm();
        }

        function renderEvents() {
            const container = document.getElementById('eventsContainer');
            container.innerHTML = '';

            if (events.length === 0) return;

            const timelineStart = events[0].date;
            const timelineEnd = events[events.length - 1].date;
            const timelineRange = timelineEnd - timelineStart;

            events.forEach((event, index) => {
                const eventElement = document.createElement('div');
                eventElement.className = `event ${event.position}`;

                const position = timelineRange === 0 ? 50 :
                    10 + ((event.date - timelineStart) / timelineRange) * 80;

                eventElement.style.left = `${position}%`;
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

                const dot = document.createElement('div');
                dot.className = 'event-dot';
                dot.style.left = `${position}%`;

                container.appendChild(eventElement);
                container.appendChild(dot);
            });
        }

        function clearForm() {
            document.getElementById('eventDate').value = '';
            document.getElementById('eventTitle').value = '';
            document.getElementById('eventDescription').value = '';
        }

        function clearEvents() {
            if (confirm('Are you sure you wish to clear all chronicles from the timeline?')) {
                events = [];
                renderEvents();
            }
        }

        function scrollTimeline(direction) {
            const container = document.querySelector('.timeline-container');
            const scrollAmount = 300;
            
            if (direction === 'left') {
                scrollPosition = Math.max(0, scrollPosition - scrollAmount);
            } else {
                scrollPosition += scrollAmount;
            }
            
            container.scrollTo({
                left: scrollPosition,
                behavior: 'smooth'
            });
        }

 // Save timeline to localStorage whenever it changes
        function saveToLocalStorage() {
            localStorage.setItem('fantasyTimeline', JSON.stringify(events));
        }

        // Load timeline from localStorage on page load
        function loadFromLocalStorage() {
            const savedTimeline = localStorage.getItem('fantasyTimeline');
            if (savedTimeline) {
                events = JSON.parse(savedTimeline).map(event => ({
                    ...event,
                    date: new Date(event.date)
                }));
                renderEvents();
            }
        }

        // Export timeline to JSON file
        function saveToFile() {
            const timelineData = JSON.stringify(events, null, 2);
            const blob = new Blob([timelineData], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'fantasy-timeline.json';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }

        // Import timeline from JSON file
        function loadFromFile() {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json';
            
            input.onchange = e => {
                const file = e.target.files[0];
                const reader = new FileReader();
                
                reader.onload = function(event) {
                    try {
                        const importedEvents = JSON.parse(event.target.result);
                        // Validate the imported data
                        if (Array.isArray(importedEvents) && importedEvents.every(event => 
                            event.date && event.title && event.description && event.position && event.icon
                        )) {
                            events = importedEvents.map(event => ({
                                ...event,
                                date: new Date(event.date)
                            }));
                            saveToLocalStorage();
                            renderEvents();
                            alert('Timeline imported successfully!');
                        } else {
                            alert('Invalid timeline file format');
                        }
                    } catch (error) {
                        alert('Error importing timeline: ' + error.message);
                    }
                };
                
                reader.readAsText(file);
            };
            
            input.click();
        }

        // Update existing functions to auto-save
        const originalAddEvent = addEvent;
        addEvent = function() {
            originalAddEvent();
            saveToLocalStorage();
        };

        const originalClearEvents = clearEvents;
        clearEvents = function() {
            if (confirm('Are you sure you wish to clear all chronicles from the timeline?')) {
                events = [];
                renderEvents();
                saveToLocalStorage();
            }
        };

        // Initialize timeline on page load
        document.addEventListener('DOMContentLoaded', function() {
            loadFromLocalStorage();
            addFloatingDecorations();
        });
