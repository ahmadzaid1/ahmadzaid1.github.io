const previewImage = document.getElementById('preview-image');
const characterName = document.getElementById('character-name');
const characterAge = document.getElementById('character-age');
const characterRace = document.getElementById('character-race');
const characterRaceOther = document.getElementById('character-race-other');
const characterAppearance = document.getElementById('character-appearance');
const characterOverview = document.getElementById('character-overview');
const characterGoals = document.getElementById('character-goals');
const cardBorderColor = document.getElementById('card-border-color');
const fontSize = document.getElementById('font-size');
const fontColor = document.getElementById('font-color');
const fontStyle = document.getElementById('font-style');
const card = document.getElementById('card');
const exportBtn = document.getElementById('export-btn');
const importBtn = document.getElementById('import-btn');

// Image handling
document.getElementById('character-image').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        previewImage.src = URL.createObjectURL(file);
        previewImage.style.display = 'block';
    }
});

document.getElementById('image-size').addEventListener('input', function(event) {
    previewImage.style.width = event.target.value + 'px';
    previewImage.style.height = event.target.value + 'px';
});

document.getElementById('image-shape').addEventListener('change', function(event) {
    previewImage.style.borderRadius = event.target.value === 'circle' ? '50%' : '0';
});

// Update character attributes in the card preview
characterName.addEventListener('input', () => document.getElementById('preview-name').textContent = characterName.value);
characterAge.addEventListener('input', () => document.getElementById('preview-age').textContent = characterAge.value);

// Update race dynamically
characterRace.addEventListener('change', () => {
    if (characterRace.value === 'custom') {
        characterRaceOther.style.display = 'block'; // Show custom race input
        document.getElementById('preview-race').textContent = characterRaceOther.value || 'Custom Race';
    } else {
        characterRaceOther.style.display = 'none'; // Hide custom race input
        document.getElementById('preview-race').textContent = characterRace.value;
    }
});

characterRaceOther.addEventListener('input', () => {
    if (characterRace.value === 'custom') {
        document.getElementById('preview-race').textContent = characterRaceOther.value;
    }
});

characterAppearance.addEventListener('input', () => document.getElementById('preview-appearance').textContent = characterAppearance.value);
characterOverview.addEventListener('input', () => document.getElementById('preview-overview').textContent = characterOverview.value);
characterGoals.addEventListener('input', () => document.getElementById('preview-goals').textContent = characterGoals.value);

// Update card settings
cardBorderColor.addEventListener('input', () => card.style.borderColor = cardBorderColor.value);
fontSize.addEventListener('input', () => card.style.fontSize = fontSize.value + 'px');
fontColor.addEventListener('input', () => card.style.color = fontColor.value);
fontStyle.addEventListener('change', () => card.style.fontFamily = fontStyle.value);

// Export card as PNG (without the image)
document.getElementById('export-png').addEventListener('click', () => {
    html2canvas(card).then(canvas => {
        const link = document.createElement('a');
        link.download = 'character-card.png';
        link.href = canvas.toDataURL();
        link.click();
    });
});

// Export character data (without the image)
exportBtn.addEventListener('click', () => {
    try {
        // Collect character data, excluding image
        const characterData = {
            name: document.getElementById('character-name').value || '',
            age: document.getElementById('character-age').value || '',
            race: document.getElementById('character-race').value === 'custom'
                ? document.getElementById('character-race-other').value
                : document.getElementById('character-race').value,
            appearance: document.getElementById('character-appearance').value || '',
            overview: document.getElementById('character-overview').value || '',
            goals: document.getElementById('character-goals').value || '',
            fontSize: fontSize.value || '',
            fontColor: fontColor.value || '',
            fontStyle: fontStyle.value || '',
            borderColor: cardBorderColor.value || ''
        };

        // Convert data to JSON
        const jsonString = JSON.stringify(characterData, null, 2);

        // Create a temporary anchor element
        const downloadLink = document.createElement('a');
        downloadLink.href = 'data:application/json;charset=utf-8,' + encodeURIComponent(jsonString);
        downloadLink.download = `${characterData.name || 'character'}.json`;

        // Trigger download
        downloadLink.style.display = 'none';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    } catch (error) {
        console.error('Error exporting character data:', error);
    }
});

// Import Character Data from JSON
importBtn.addEventListener('change', (event) => {
    const file = event.target.files[0];

    if (file && file.type === 'application/json') {
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const characterData = JSON.parse(e.target.result);

                // Populate fields with imported data
                document.getElementById('character-name').value = characterData.name || '';
                document.getElementById('character-age').value = characterData.age || '';
                
                // Handle race and custom race logic
                const raceSelect = document.getElementById('character-race');
                const customRaceInput = document.getElementById('character-race-other');
                if (['human', 'elf', 'orc'].includes(characterData.race)) {
                    raceSelect.value = characterData.race;
                    customRaceInput.style.display = 'none';
                } else {
                    raceSelect.value = 'custom';
                    customRaceInput.value = characterData.race || '';
                    customRaceInput.style.display = 'block';
                }

                document.getElementById('character-appearance').value = characterData.appearance || '';
                document.getElementById('character-overview').value = characterData.overview || '';
                document.getElementById('character-goals').value = characterData.goals || '';

                // Update the card preview immediately after import
                updateCardPreview();
                console.log('Character data imported successfully:', characterData);
            } catch (error) {
                console.error('Error importing character data:', error);
                alert('Failed to load JSON. Please check the file format.');
            }
        };

        reader.readAsText(file);
    } else {
        alert('Please select a valid JSON file.');
    }
});

// Function to update the card preview after import
function updateCardPreview() {
    const name = document.getElementById('character-name').value;
    const age = document.getElementById('character-age').value;
    const race = document.getElementById('character-race').value;
    const appearance = document.getElementById('character-appearance').value;
    const overview = document.getElementById('character-overview').value;
    const goals = document.getElementById('character-goals').value;

    // Update the preview
    document.getElementById('preview-name').textContent = name || 'Name';
    document.getElementById('preview-age').textContent = `Age: ${age || 'N/A'}`;
    document.getElementById('preview-race').textContent = `Race: ${race || 'Unknown'}`;
    document.getElementById('preview-appearance').textContent = `Appearance: ${appearance || 'N/A'}`;
    document.getElementById('preview-overview').textContent = `Overview: ${overview || 'N/A'}`;
    document.getElementById('preview-goals').textContent = `Goals: ${goals || 'N/A'}`;

    // Update image preview if available
    const imageInput = document.getElementById('character-image');
    const previewImage = document.getElementById('preview-image');
    if (imageInput.files && imageInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            previewImage.src = e.target.result;
            previewImage.style.display = 'block';
        };
        reader.readAsDataURL(imageInput.files[0]);
    }
}

document.getElementById("card-style").addEventListener("change", function () {
    const card = document.getElementById("card");
    card.className = `card ${this.value}`;
});
