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
        const reader = new FileReader();
        reader.onload = function(e) {
            previewImage.src = e.target.result;
            previewImage.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
});

document.getElementById('image-size').addEventListener('input', function(event) {
    previewImage.style.width = event.target.value + 'px';
    previewImage.style.height = event.target.value + 'px';
});

document.getElementById('image-shape').addEventListener('change', function(event) {
    previewImage.style.borderRadius = event.target.value === 'circle' ? '50%' : '0';
});

// Preview text updates
characterName.addEventListener('input', () => {
    document.getElementById('preview-name').textContent = characterName.value;
});

characterAge.addEventListener('input', () => {
    document.getElementById('preview-age').textContent = characterAge.value ? `Age: ${characterAge.value}` : '';
});

// Race handling with custom option
characterRace.addEventListener('change', () => {
    if (characterRace.value === 'custom') {
        characterRaceOther.style.display = 'block';
        document.getElementById('preview-race').textContent = characterRaceOther.value ? `Race: ${characterRaceOther.value}` : 'Race: Custom';
    } else {
        characterRaceOther.style.display = 'none';
        document.getElementById('preview-race').textContent = `Race: ${characterRace.value}`;
    }
});

characterRaceOther.addEventListener('input', () => {
    if (characterRace.value === 'custom') {
        document.getElementById('preview-race').textContent = `Race: ${characterRaceOther.value}`;
    }
});

// Character details updates
characterAppearance.addEventListener('input', () => {
    document.getElementById('preview-appearance').textContent = characterAppearance.value ? `Appearance: ${characterAppearance.value}` : '';
});

characterOverview.addEventListener('input', () => {
    document.getElementById('preview-overview').textContent = characterOverview.value ? `Overview: ${characterOverview.value}` : '';
});

characterGoals.addEventListener('input', () => {
    document.getElementById('preview-goals').textContent = characterGoals.value ? `Goals: ${characterGoals.value}` : '';
});

// Style controls
cardBorderColor.addEventListener('input', () => {
    card.style.borderColor = cardBorderColor.value;
});

fontSize.addEventListener('input', (event) => {
    card.style.fontSize = `${event.target.value}px`;
});

fontColor.addEventListener('input', (event) => {
    card.style.color = event.target.value;
    // Update all preview elements to ensure consistent coloring
    const previewElements = card.getElementsByTagName('*');
    for(let element of previewElements) {
        element.style.color = event.target.value;
    }
});

fontStyle.addEventListener('change', (event) => {
    card.style.fontFamily = event.target.value;
});

// Export as PNG
document.getElementById('export-png').addEventListener('click', () => {
    html2canvas(card).then(canvas => {
        const link = document.createElement('a');
        link.download = 'character-card.png';
        link.href = canvas.toDataURL();
        link.click();
    });
});

// Export character data
exportBtn.addEventListener('click', () => {
    try {
        const characterData = {
            name: characterName.value || '',
            age: characterAge.value || '',
            race: characterRace.value === 'custom' ? characterRaceOther.value : characterRace.value,
            appearance: characterAppearance.value || '',
            overview: characterOverview.value || '',
            goals: characterGoals.value || '',
            fontSize: fontSize.value || '',
            fontColor: fontColor.value || '',
            fontStyle: fontStyle.value || '',
            borderColor: cardBorderColor.value || ''
        };

        const jsonString = JSON.stringify(characterData, null, 2);
        const downloadLink = document.createElement('a');
        downloadLink.href = 'data:application/json;charset=utf-8,' + encodeURIComponent(jsonString);
        downloadLink.download = `${characterData.name || 'character'}.json`;
        downloadLink.style.display = 'none';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    } catch (error) {
        console.error('Error exporting character data:', error);
    }
});

// Import character data
importBtn.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/json') {
        const reader = new FileReader();
        
        reader.onload = (e) => {
            try {
                const characterData = JSON.parse(e.target.result);
                
                // Populate form fields
                characterName.value = characterData.name || '';
                characterAge.value = characterData.age || '';
                
                // Handle race selection
                if (characterData.race && ['human', 'elf', 'orc'].includes(characterData.race)) {
                    characterRace.value = characterData.race;
                    characterRaceOther.style.display = 'none';
                } else {
                    characterRace.value = 'custom';
                    characterRaceOther.value = characterData.race || '';
                    characterRaceOther.style.display = 'block';
                }
                
                characterAppearance.value = characterData.appearance || '';
                characterOverview.value = characterData.overview || '';
                characterGoals.value = characterData.goals || '';
                
                // Apply styles
                if (characterData.fontSize) fontSize.value = characterData.fontSize;
                if (characterData.fontColor) fontColor.value = characterData.fontColor;
                if (characterData.fontStyle) fontStyle.value = characterData.fontStyle;
                if (characterData.borderColor) cardBorderColor.value = characterData.borderColor;
                
                // Update preview
                updatePreview();
                
                console.log('Character data imported successfully');
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

// Update preview after import
function updatePreview() {
    document.getElementById('preview-name').textContent = characterName.value;
    document.getElementById('preview-age').textContent = characterAge.value ? `Age: ${characterAge.value}` : '';
    document.getElementById('preview-race').textContent = `Race: ${characterRace.value === 'custom' ? characterRaceOther.value : characterRace.value}`;
    document.getElementById('preview-appearance').textContent = characterAppearance.value ? `Appearance: ${characterAppearance.value}` : '';
    document.getElementById('preview-overview').textContent = characterOverview.value ? `Overview: ${characterOverview.value}` : '';
    document.getElementById('preview-goals').textContent = characterGoals.value ? `Goals: ${characterGoals.value}` : '';
    
    // Apply styles
    card.style.fontSize = `${fontSize.value}px`;
    card.style.color = fontColor.value;
    card.style.fontFamily = fontStyle.value;
    card.style.borderColor = cardBorderColor.value;
}
