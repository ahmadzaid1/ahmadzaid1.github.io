const previewImage = document.getElementById('preview-image');
    const characterName = document.getElementById('character-name');
    const characterAge = document.getElementById('character-age');
    const characterRace = document.getElementById('character-race');
    const characterAppearance = document.getElementById('character-appearance');
    const characterOverview = document.getElementById('character-overview');
    const characterGoals = document.getElementById('character-goals');
    const cardBorderColor = document.getElementById('card-border-color');
    const fontSize = document.getElementById('font-size');
    const fontColor = document.getElementById('font-color');
    const fontStyle = document.getElementById('font-style');
    const card = document.getElementById('card');

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
    characterRace.addEventListener('input', () => document.getElementById('preview-race').textContent = characterRace.value);
    characterAppearance.addEventListener('input', () => document.getElementById('preview-appearance').textContent = characterAppearance.value);
    characterOverview.addEventListener('input', () => document.getElementById('preview-overview').textContent = characterOverview.value);
    characterGoals.addEventListener('input', () => document.getElementById('preview-goals').textContent = characterGoals.value);

    // Update card settings
    cardBorderColor.addEventListener('input', () => card.style.borderColor = cardBorderColor.value);
    fontSize.addEventListener('input', () => card.style.fontSize = fontSize.value + 'px');
    fontColor.addEventListener('input', () => card.style.color = fontColor.value);
    fontStyle.addEventListener('change', () => card.style.fontFamily = fontStyle.value);
    