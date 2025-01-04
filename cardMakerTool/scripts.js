/*const because there is a lot of them, easier to manage*/
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
const cardBackgroundColor = document.getElementById('card-background-color');

// Image handling, event listener on every change.
document.getElementById('character-image').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) { // if there is a file
        const reader = new FileReader(); // file reader is an API, for reading files, here it reads the file as a URL
        reader.onload = function(e) { // on load to update the src image in the HTML
            previewImage.src = e.target.result; // e here is a snapshot for the event, tells us what happened during the event
            previewImage.style.display = 'block';
        };
        reader.readAsDataURL(file);
        // no else, since (why?)
    }
});

/***************************Live Update*************************************/
/* input for text and ranges, change for drop downs and selection */

document.getElementById('image-size').addEventListener('input', function(event) {
    previewImage.style.width = event.target.value + 'px';
    previewImage.style.height = event.target.value + 'px';
});

document.getElementById('image-shape').addEventListener('change', function(event) {
   if (event.target.value === 'circle') {
       previewImage.style.borderRadius = '50%';
   } else {
       previewImage.style.borderRadius = '0'; /* border radius */
   }
});

// Preview text updates
characterName.addEventListener('input', function() {
    document.getElementById('preview-name').textContent = characterName.value;
});

characterAge.addEventListener('input', function() {
    document.getElementById('preview-age').textContent = characterAge.value ? `Age: ${characterAge.value}` : '';
});

cardBackgroundColor.addEventListener('input', function() {
    card.style.backgroundColor = cardBackgroundColor.value;
});

// Race handling with custom option
characterRace.addEventListener('change', function() {
    if (characterRace.value === 'custom') {
        characterRaceOther.style.display = 'block';
        document.getElementById('preview-race').textContent = characterRaceOther.value ? `Race: ${characterRaceOther.value}` : 'Race: Custom';
    } else {
        characterRaceOther.style.display = 'none';
        document.getElementById('preview-race').textContent = `Race: ${characterRace.value}`;
    }
});

characterRaceOther.addEventListener('input', function() {
    if (characterRace.value === 'custom') {
        document.getElementById('preview-race').textContent = `Race: ${characterRaceOther.value}`;
    }
});

// Character details updates
characterAppearance.addEventListener('input', function() {
    document.getElementById('preview-appearance').textContent = characterAppearance.value ? `Appearance: ${characterAppearance.value}` : '';
});

characterOverview.addEventListener('input', function() {
    document.getElementById('preview-overview').textContent = characterOverview.value ? `Overview: ${characterOverview.value}` : '';
});

characterGoals.addEventListener('input', function() {
    document.getElementById('preview-goals').textContent = characterGoals.value ? `Goals: ${characterGoals.value}` : '';
});

// Style controls
cardBorderColor.addEventListener('input', function() {
    card.style.borderColor = cardBorderColor.value;
});

fontSize.addEventListener('input', function(event) {
    card.style.fontSize = `${event.target.value}px`;
});

fontColor.addEventListener('input', function(event) {
    card.style.color = event.target.value;
    // Update all preview elements to ensure consistent coloring
    const previewElements = card.getElementsByTagName('*');
    for (let element of previewElements) {
        element.style.color = event.target.value;
    }
});

fontStyle.addEventListener('change', function(event) {
    card.style.fontFamily = event.target.value;
});

/***************************Live Update*************************************/

// Export as PNG
document.getElementById('export-png').addEventListener('click', function() {
    html2canvas(card).then(function(canvas) {
        const link = document.createElement('a');//create an <a> to trigger a download
        link.download = 'character-card.png';
        link.href = canvas.toDataURL();//to base64
        link.click();
    });
});

// Export character data
exportBtn.addEventListener('click', function() {
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
        borderColor: cardBorderColor.value || '',
        backgroundColor: cardBackgroundColor.value || ''
    };

    const jsonString = JSON.stringify(characterData);
    const downloadLink = document.createElement('a');
    downloadLink.href = 'data:application/json;charset=utf-8,' + encodeURIComponent(jsonString);
    downloadLink.download = `${characterData.name || 'character'}.json`;//use the name as a name.json
    document.body.appendChild(downloadLink);//download
    downloadLink.click();//download
});

importBtn.addEventListener('change', function(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        const characterData = JSON.parse(e.target.result);//from json to an object

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
        if (characterData.backgroundColor) cardBackgroundColor.value = characterData.backgroundColor;
        
        // Update preview
        updatePreview();
    };

    reader.readAsText(file);
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
    card.style.backgroundColor = cardBackgroundColor.value;
}
    