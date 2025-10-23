# Quick Start Guide - Infrastructure & Awards Management

## 🎯 For Media Coordinators

This guide shows you how to manage the Infrastructure Highlights and Awards & Achievements sections on the About page.

## 📍 Access Your Management Pages

After logging in, navigate to these pages from your dashboard menu:

### Infrastructure Highlights Management

- **Facilities**: `/media-coordinator/facilities`
- **Additional Features**: `/media-coordinator/additional-features`
- **Campus Stats**: `/media-coordinator/campus-stats`

### Awards & Achievements Management

- **Awards**: `/media-coordinator/awards`
- **Achievement Metrics**: `/media-coordinator/achievement-metrics`
- **Student Achievements**: `/media-coordinator/student-achievements`

## 🏗️ Managing Facilities

### What are Facilities?

Major campus buildings and spaces (Science Lab, Library, Computer Lab, Sports Complex, etc.)

### How to Add a Facility

1. Go to **Facilities** page
2. Click the **Create** button (plus icon)
3. Fill in the form:
   - **Title**: Name of the facility (e.g., "Modern Science Laboratory")
   - **Description**: Detailed description of the facility
   - **Features**: List key features separated by commas
     - Example: `State-of-art equipment, Safety protocols, Research support, Interactive learning, Expert supervision`
   - **Icon**: Icon name from [Lucide Icons](https://lucide.dev)
     - Popular choices: `Microscope`, `BookOpen`, `Calculator`, `Trophy`, `Monitor`
   - **Color**: Tailwind gradient classes
     - Examples: `from-primary to-accent`, `from-blue-500 to-purple-500`
   - **Image**: Upload an image from your computer (uses Cloudinary)
   - **Display Order**: Number for sorting (10, 20, 30, etc.)
   - **Is Active**: Check to show on website
4. Click **Save**

### Tips

- Keep features concise (3-5 items)
- Use consistent icon names
- Use gaps in display order (10, 20, 30) for easy reordering

## ✨ Managing Additional Features

### What are Additional Features?

Supporting amenities and services (WiFi, Transport, Security, Canteen, etc.)

### How to Add an Additional Feature

1. Go to **Additional Features** page
2. Click **Create**
3. Fill in:
   - **Icon**: Icon name (e.g., `Bus`, `Wifi`, `Shield`, `Camera`)
   - **Title**: Feature name (e.g., "School Transport")
   - **Description**: Brief description of the feature
   - **Display Order**: Sorting number
   - **Is Active**: Toggle to show/hide
4. Click **Save**

## 📊 Managing Campus Stats

### What are Campus Stats?

Key numbers about your campus (Acres, Classrooms, Students, Teachers, etc.)

### How to Add a Campus Stat

1. Go to **Campus Stats** page
2. Click **Create**
3. Fill in:
   - **Number**: The statistic value (e.g., "15", "50+", "1000+")
   - **Label**: Description (e.g., "Acres Campus", "Classrooms", "Students")
   - **Icon**: Emoji or icon (e.g., "🏢", "📚", "👥", "👨‍🏫")
   - **Display Order**: Sorting number
   - **Is Active**: Toggle to show/hide
4. Click **Save**

### Tips

- Keep stats current and accurate
- Use emojis for visual appeal
- Typically display 4-6 stats

## 🏆 Managing Awards

### What are Awards?

School-level awards and recognitions received from organizations

### How to Add an Award

1. Go to **Awards** page
2. Click **Create**
3. Fill in:
   - **Year**: Year received (e.g., "2024", "2023")
   - **Title**: Award name (e.g., "National Education Excellence Award")
   - **Organization**: Awarding body (e.g., "Ministry of Education")
   - **Description**: What the award recognizes
   - **Category**: Type of award
     - Examples: `Academic Excellence`, `STEM Education`, `Sustainability`, `Technology`, `Sports`, `Community Service`
   - **Icon**: Icon name (`Trophy`, `Medal`, `Award`, `Star`)
   - **Color**: Tailwind gradient
     - Examples: `from-primary to-accent`, `from-yellow-500 to-orange-500`
   - **Display Order**: Sorting number
   - **Is Active**: Toggle to show/hide
4. Click **Save**

### Tips

- Update awards annually
- Include full organization names
- Use consistent categories

## 📈 Managing Achievement Metrics

### What are Achievement Metrics?

Key statistics showing school performance (Pass rates, competition winners, etc.)

### How to Add an Achievement Metric

1. Go to **Achievement Metrics** page
2. Click **Create**
3. Fill in:
   - **Metric**: The number/percentage (e.g., "98%", "150+", "25+", "100%")
   - **Description**: What the metric represents (e.g., "Board Exam Pass Rate")
   - **Detail**: Additional context (e.g., "Consistently high academic performance")
   - **Display Order**: Sorting number
   - **Is Active**: Toggle to show/hide
4. Click **Save**

### Tips

- Keep metrics updated annually
- Use + for ranges (150+)
- Use % for percentages (98%)
- Typically display 4-6 metrics

## 🥇 Managing Student Achievements

### What are Student Achievements?

Specific competitions and events where students won prizes

### How to Add a Student Achievement

1. Go to **Student Achievements** page
2. Click **Create**
3. Fill in:
   - **Name**: Competition/event name (e.g., "International Math Olympiad")
   - **Year**: Year of achievement (e.g., "2024", "2023")
   - **Winners**: What was won (e.g., "5 Gold Medals", "3 First Prizes", "State Champions")
   - **Icon**: Emoji representing the achievement
     - Examples: 🥇 (gold medal), 🔬 (science), 🌍 (global), 🤖 (robotics), 📚 (literary), 🎨 (art)
   - **Display Order**: Sorting number
   - **Is Active**: Toggle to show/hide
4. Click **Save**

### Tips

- Update after each competition
- Use descriptive winner text
- Use relevant emojis for visual impact

## 🔄 Common Operations

### Editing Existing Items

1. Find the item in the list
2. Click the **pencil icon** (✏️)
3. Make your changes
4. Click **Save**

### Deleting Items

1. Find the item in the list
2. Click the **trash icon** (🗑️)
3. Confirm deletion

### Hiding Items (Without Deleting)

1. Edit the item
2. Uncheck **Is Active**
3. Save

- Item stays in database but won't show on website
- Can be reactivated later

### Reordering Items

1. Edit items and change their **Display Order** numbers
2. Lower numbers appear first
3. Use gaps (10, 20, 30) for flexibility

### Searching

- Use the search box on each management page
- Searches titles, descriptions, and relevant fields
- Results update as you type

## 📱 Icon Resources

### Lucide Icons

Visit [lucide.dev](https://lucide.dev) to browse available icons.

**Popular icons for facilities:**

- `Microscope` - Science labs
- `BookOpen` - Libraries
- `Calculator` - Math/computer labs
- `Trophy` - Sports facilities
- `Monitor` - Tech labs
- `Palette` - Art rooms
- `Music` - Music rooms

**Popular icons for features:**

- `Bus` - Transport
- `Wifi` - Internet
- `Shield` - Security
- `Camera` - CCTV
- `Utensils` - Canteen
- `Heart` - Healthcare

**Popular icons for awards:**

- `Trophy` - Major awards
- `Medal` - Competitions
- `Award` - Recognitions
- `Star` - Excellence

### Emojis

Use emojis for campus stats and student achievements:

- 🏢 Buildings
- 📚 Books/Education
- 👥 People/Students
- 👨‍🏫 Teachers
- 🥇 Gold medals
- 🔬 Science
- 🌍 International
- 🤖 Technology
- 🎨 Arts

## 🎨 Color Gradients

Use Tailwind CSS gradient classes for visual appeal.

**Predefined color combinations:**

```
from-primary to-accent
from-primary to-secondary
from-accent to-primary
from-secondary to-accent
from-blue-500 to-purple-500
from-green-500 to-teal-500
from-red-500 to-pink-500
from-yellow-500 to-orange-500
from-indigo-500 to-purple-500
from-teal-500 to-cyan-500
```

**Pattern:**

- `from-[color]` to `to-[color]`
- Use consistent colors for similar categories

## ✅ Best Practices

### Content Quality

- ✅ Write clear, concise descriptions
- ✅ Use proper grammar and spelling
- ✅ Keep information current and accurate
- ✅ Use professional language
- ✅ Verify facts before publishing

### Organization

- ✅ Use logical display orders
- ✅ Group similar items together
- ✅ Keep categories consistent
- ✅ Review and update regularly
- ✅ Archive outdated items instead of deleting

### Visual Consistency

- ✅ Use similar icon styles throughout
- ✅ Use consistent color schemes
- ✅ Maintain image quality standards
- ✅ Use appropriate emojis
- ✅ Test on mobile devices

### Maintenance Schedule

- **Weekly**: Check for new student achievements
- **Monthly**: Review and update stats
- **Quarterly**: Update achievement metrics
- **Annually**: Review and update all awards

## 🆘 Common Issues

### "Image not uploading"

- Check file size (max 10MB recommended)
- Use common formats (JPG, PNG)
- Check your internet connection
- Try a different image

### "Icon not showing"

- Verify icon name spelling
- Check [lucide.dev](https://lucide.dev) for exact names
- Icons are case-sensitive: use `Monitor` not `monitor`
- Common fallback icons are used if name is wrong

### "Changes not appearing on website"

- Make sure **Is Active** is checked
- Clear your browser cache (Ctrl+F5)
- Wait a few seconds for server to update
- Check if you saved the changes

### "Can't find my item"

- Use the search box
- Check if you're on the correct page
- Check pagination (bottom of list)
- Item might be on another page

## 📞 Support

If you need help:

1. Check this guide first
2. Contact your administrator
3. Check the detailed documentation in `/Docs/INFRASTRUCTURE_AWARDS_DYNAMIC_SYSTEM.md`

## 🎓 Quick Reference

| Page                 | What to Add         | Key Fields                   | Update Frequency   |
| -------------------- | ------------------- | ---------------------------- | ------------------ |
| Facilities           | Buildings/Spaces    | Title, Features, Icon, Image | When renovated     |
| Additional Features  | Amenities           | Icon, Title, Description     | Annually           |
| Campus Stats         | Key Numbers         | Number, Label, Icon          | Annually           |
| Awards               | School Awards       | Year, Title, Organization    | When received      |
| Achievement Metrics  | Performance Stats   | Metric, Description          | Annually           |
| Student Achievements | Competition Results | Name, Year, Winners          | After competitions |

---

**Remember**: All changes appear on the public `/about` page immediately after saving!

**Test your changes**: Visit `/about` page to see how they look to visitors.
