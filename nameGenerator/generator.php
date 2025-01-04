<?php
// Path to your SQLite database file
$db_path = '';

// Connect to SQLite database
$db = new SQLite3($db_path);


$races_query = "SELECT DISTINCT race FROM mytable ORDER BY race";
$races_result = $db->query($races_query);
$races = [];//store in array for the drop down 

while ($row = $races_result->fetchArray(SQLITE3_ASSOC)) {
    $races[] = $row['Race'];
}


$classes_query = "SELECT DISTINCT class FROM mytable ORDER BY class";
$classes_result = $db->query($classes_query);
$classes = [];//store in array for the drop down 

while ($row = $classes_result->fetchArray(SQLITE3_ASSOC)) {
    $classes[] = $row['Class'];
}

// Get all character data
$names_query = "SELECT name, race, class, gender FROM mytable";
$names_result = $db->query($names_query);
$namesData = [];

while ($row = $names_result->fetchArray(SQLITE3_ASSOC)) {
    $namesData[] = $row;
}

$db->close();

$selectedNames = [];
/***************************************************************/
// form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') { //for secutiry
    $race = $_POST['race'] ?? ''; //if then give, no then null
    $gender = $_POST['gender'] ?? '';
    $class = $_POST['class'] ?? '';

    if ($race && $gender && $class) {
        // filter names based on selection
        $matchingNames = array_filter($namesData, function($name) use ($race, $gender, $class) {
            return $name['Race'] === $race && $name['Gender'] === $gender && $name['Class'] === $class;
        });

        // Randomly select 10 names or fewer if not enough names are available
        $matchingNames = array_values($matchingNames);
        $numNames = min(10, count($matchingNames));
        $selectedNames = [];

        for ($i = 0; $i < $numNames; $i++) {
            $randomIndex = array_rand($matchingNames);
            $selectedNames[] = $matchingNames[$randomIndex];
            unset($matchingNames[$randomIndex]); //avoid redunduncy
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Fantasy Character Generator</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <h1 style="text-align: center;">Fantasy Character Generator</h1>
    <div class="container">
        <form method="POST">
            <div>
                <label for="race">Race:</label>
                <select name="race" id="race" required>
                    <option value="">--Choose a race--</option>
                    <?php foreach ($races as $race): ?>
                        <option value="<?= $race ?>" <?= (isset($race) && $race === $race) ? 'selected' : '' ?>><?= $race ?></option>
                    <?php endforeach; ?>
                </select><br><br>
                
                <label for="gender">Gender:</label>
                <select name="gender" id="gender" required>
                    <option value="">--Choose a gender--</option>
                    <option value="male" <?= (isset($gender) && $gender === 'male') ? 'selected' : '' ?>>Male</option>
                    <option value="female" <?= (isset($gender) && $gender === 'female') ? 'selected' : '' ?>>Female</option>
                </select><br><br>
                
                <label for="class">Class:</label>
                <select name="class" id="class" required>
                    <option value="">--Choose a class--</option>
                    <?php foreach ($classes as $class): ?>
                        <option value="<?= $class ?>" <?= (isset($class) && $class === $class) ? 'selected' : '' ?>><?= $class ?></option>
                    <?php endforeach; ?>
                </select><br><br>
                
                <button type="submit">Generate Names</button>
            </div>
        </form>
        
        <div id="generatedNames">
            <?php if (!empty($selectedNames)): ?>
                <h2>Generated Names:</h2>
                <?php foreach ($selectedNames as $name): ?>
                    <div><strong><?= $name['Name'] ?></strong></div>
                <?php endforeach; ?>
            <?php endif; ?>
        </div>
    </div>
</body>
</html>