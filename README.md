# World Building Site

### Homepage

We considered different color patterns for the site's theme, including:

- **Cyberpunk Theme**  
  ![Cyberpunk Theme](https://files.catbox.moe/lajs8a.png)
  
- **Minimalist Theme**  
  ![Minimalist Theme](https://files.catbox.moe/uw8qg8.png)
  
- **Medieval Theme**  
  ![Medieval Theme](https://files.catbox.moe/rx9qq5.png)

After careful consideration, **the Medieval Theme** has been chosen.

---

### Header Section

- **Main Title**: **W🌏rld Builder**  

- A "Contact Us" button that redirects to the **Contact Us** page.

---

### Main Content Areas

1. **Introduction Section**
   - **Main Heading**: **Start Building Your World Today**
   - An image created using [Krita](https://krita.org/en/).

2. **Tool Sections** (3 main tools):  
   Each tool section features:
   - A **descriptive heading**.
   - A **paragraph description** of the tool's purpose.
   - A "Get Started" button linking to the respective tool.
   - A **preview image** (e.g., the Character Card Maker preview was contributed by a friend).

   The tools are:
   - **Character Card Maker**
   - **Timeline Maker**
   - **Name Generator** **_([it doesn't work, download the SQLite database in the repo and configure your PHP to make it work](#setting-up-the-name-generator))._**

3. **Reviews Section**
   - **Section Title**: **What People Are Saying**  
     _(A longer title adds emphasis.)_
   - Includes **three review cards**:
     - Two genuine reviews.
     - An unfortunately fake one from Wes Anderson.

---

### Footer

- **Copyright Notice**  
  Clearly states ownership and copyright for the site.

- A link to **Other Sites** for related or additional resources.
---
### Setting Up the Name Generator

To make the Name Generator work, you'll need to:

1. **Download SQLite**:  
   Download and install SQLite from [sqlite.org](https://www.sqlite.org/).

2. **Install PHP SQLite Extension**:  
   Ensure that the PHP SQLite extension is installed and enabled on your server.

3. **Configure Database Path**:  
   In the `nameGenerator.php` file, set the path to your SQLite database like so:

   ```php
   <?php
   // Path to your SQLite database file
   $db_path = 'path_to_your_database.sqlite';

   // Connect to SQLite database
   $db = new SQLite3($db_path);
   ?>
**Sqlite is much more efficient compared to the bloat MySql***
---
### Acknowledgments

Thanks to [Janelle Shane's DnD Characters GitHub Repository](https://github.com/janelleshane/DnD-characters) for inspiring character names used in this project.


