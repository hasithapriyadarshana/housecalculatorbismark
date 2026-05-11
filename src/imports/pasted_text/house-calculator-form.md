House Calculator

I am creating house building cost calculator. we need form for it.

Frist of all user start registration components>> W
What is your full name?
What is your phone number?
What is your email address?
Where is your building located?
Next Component >>>>>>>>>>>>>>>>>>>>>>>>>
first of all we need to calculate land size, so that we need to get input land size> How many  perchs are there? Then we can calculate how many sqft are available (1 Perch = 272.25 square feet).This is reqired
When we use that land for building a house we can use 60% form total sqft count from the land.
After the next components we can load> we can  add How many stories does your house have? (Max 3)
•	If it is one total sqft is same as before calculation
•	If it is two total sqft is multiplied by 2
•	If it is three total sqft is multiplied by 3
So that we can show how many sqft we can use for our constructing.(LandSizeAfter60Reduced)
Next Component >>>>>>>>>>>>>>>>>>>>>>>>>
If it is 1 story house  you can show below component>>>
Then, we can add what we want how many form them, use dropdowns for this..
•	Living area -350 sqft >>How many lining areas need for you ? etc
•	Dining area – 180 sqft
•	Pantry – 195sqft
•	Kitchen area – 180 sqft
•	Parking for vehicle – 144sqft
•	Room – 144sqft
•	Bathroom – 40sqft
We can   calculate total size that user enterd. Add 5% present to total value.  If it is higher than LandSizeAfter60Reduced >> show message >> like that message “you cannot add. Your land size exceeded”
When user adding must calculate live remaing sqfts, cost..etc ( cost for 1sqft = 10982LKR)

Next Component >>>>>>>>>>>>>>>>>>>>>>>>>
If it is two  story then  We need to render two componets like this..frist for ground floor..another for frist floar
Next Component >>>>>>>>>>>>>>>>>>>>>>>>>
If it is three story house then  We need to render three componets like this..frist for ground floor..second one  for frist floar.. thris one for second floar..

Next Component >>>>>>>>>>>>>>>>>>>>>>>>>
After that  component  we need to get details about house roof. 
Full timber roof>> no additional cost
Full concrete slab>> 3 300 000 Lkr
50% concrete slab >> 2 200 000 Lkr
Clay tiles for the roof >> 11090 for per sqft

When adding one  by one cost must me update real time.. use colur theme as ED9420 and suitable ui.
use suitable pleace holders for all including drop downs




House Building Cost Calculator – Detailed Form & System Description
Project Overview
Create a modern multi-step house building cost calculator with a clean UI using the primary color theme:
•	Primary Color: #ED9420 
•	Secondary Colors: White, Light Gray, Dark Gray 
•	Style: Modern card-based UI with live calculations and responsive design. 
The calculator should help users:
•	Register and provide contact details 
•	Calculate usable land size 
•	Select house stories 
•	Design room layout floor-by-floor 
•	Calculate remaining space in real time 
•	Estimate total construction cost 
•	Add roof type costs dynamically 
Step 1 — User Registration Component
Component Title
“Let’s Start Your House Estimation”
Required Input Fields
Full Name
•	Type: Text Input 
•	Placeholder:
"Enter your full name" 
Phone Number
•	Type: Tel Input 
•	Placeholder:
"07X XXX XXXX" 
Email Address
•	Type: Email Input 
•	Placeholder:
"example@gmail.com" 
Building Location
•	Type: Text Input / Google Places Autocomplete 
•	Placeholder:
"Enter your building location" 
UI Notes
•	Use large rounded input fields 
•	Add icons inside inputs 
•	Show step progress bar at top 
•	“Next” button fixed at bottom 
Step 2 — Land Size Calculation Component
Component Title
“Calculate Your Land Size”
Main Input
Land Size in Perches
•	Type: Number Input 
•	Placeholder:
"Enter land size in perches" 
Land Calculation Logic
Formula 1 — Convert Perches to Square Feet
1 Perch = 272.25 sqft
Calculation
TotalLandSqft = Perches × 272.25
Formula 2 — Building Allowance (60%)
Only 60% of the land can be used for construction.
Calculation
UsableLandSqft = TotalLandSqft × 0.60
Real-Time Display Cards
Show live updating cards:
Total Land Size
Example:
2,722 sqft
Buildable Area (60%)
Example:
1,633 sqft
Step 3 — House Story Selection
Component Title
“Select House Stories”
Story Options
Use cards or dropdown.
Options
•	1 Story 
•	2 Stories 
•	3 Stories 
Maximum allowed:
3 Stories
Story Calculation Logic
If 1 Story
LandSizeAfter60Reduced = UsableLandSqft
If 2 Stories
LandSizeAfter60Reduced = UsableLandSqft × 2
If 3 Stories
LandSizeAfter60Reduced = UsableLandSqft × 3
Live Result Display
Show
Total Allowed Construction Area
Example:
3,266 sqft available for construction
Step 4 — House Space Planning Component
This section changes dynamically based on selected story count.
Common Area Sizes
Area Type	Default Size
Living Area	350 sqft
Dining Area	180 sqft
Pantry	195 sqft
Kitchen	180 sqft
Parking	144 sqft
Room	144 sqft
Bathroom	40 sqft

Input Method
Use:
•	Plus/Minus Quantity Selectors 
•	Real-time counters 
Example:
Living Area
How many living areas do you need?
Plus/Minus Quantity Selectors  (0-5)
Do same for all areas.
Area Calculation Logic
Example:
LivingAreaTotal = Quantity × 350
Do same for all areas.
Total Floor Size Formula
TotalSelectedSqft = (All Selected Area Totals Combined)
Add Additional 5%
After calculation:
FinalSqft = TotalSelectedSqft + 5%
OR
FinalSqft = TotalSelectedSqft × 1.05
Validation Logic
If User Exceeds Allowed Space
When:
FinalSqft > LandSizeAfter60Reduced
Show warning instantly.
Warning Message
Error Alert
“You cannot add more areas. Your land size limit has been exceeded.”
Use:
•	Red border 
•	Warning icon 
•	Shake animation 
Disable further additions until corrected.

Live Remaining Space System
Show Live Statistics Cards
Used Space
Example:
1,200 sqft used
Remaining Space
Example:
433 sqft remaining
Usage Percentage
Example:
73% utilized
Construction Cost Calculation
Cost Per Square Foot
1 sqft = 10,982 LKR
Formula
ConstructionCost =
FinalSqft × 10,982
Live Cost Display
Example
Estimated Cost:
LKR 18,450,000
Update instantly while user changes inputs.
Dynamic Floor Rendering
If 1 Story
Render:
•	Ground Floor Component only 
If 2 Stories
Render:
1.	Ground Floor Component 
2.	First Floor Component 
Each floor should:
•	Have separate room planning 
•	Separate sqft calculations 
•	Combined total at bottom 
If 3 Stories
Render:
1.	Ground Floor 
2.	First Floor 
3.	Second Floor 
Each floor:
•	Separate area controls 
•	Separate statistics 
•	Combined final calculation 
Step 5 — Roof Selection Component
Component Title
“Select Your Roof Type”
Roof Options
1. Full Timber Roof
Additional Cost
0 LKR

2. Full Concrete Slab
Additional Cost
3,300,000 LKR
3. 50% Concrete Slab
Additional Cost
2,200,000 LKR
________________________________________
4. Clay Tile Roof
Cost Formula
11,090 LKR × Total house  Sqft
________________________________________
Roof Cost Logic
TotalProjectCost = ConstructionCost + RoofCost
________________________________________
Final Summary Component
Show Final Project Summary
User Information
•	Name 
•	Phone 
•	Email 
•	Location 
Land Details
•	Perches 
•	Total Land Sqft 
•	Buildable Sqft 
House Details
•	Story Count 
•	Total Construction Sqft 
•	Remaining Sqft 
Roof Details
•	Selected Roof Type 
•	Roof Cost 
Final Estimated Cost
Large highlighted card:
Total Estimated Budget:
LKR XX,XXX,XXX
________________________________________
UI/UX Recommendations
Design Style
•	Minimal modern interface 
•	Card layout 
•	Smooth animations 
•	Step-by-step wizard 
•	Sticky summary sidebar (desktop) 
________________________________________
Recommended UI Components
Inputs
•	Rounded corners (5px)
•	Floating labels 
•	Orange focus borders 
________________________________________
Buttons
Primary Button
Background:
#ED9420
Hover:
#d67f12
Bordader rad= 5 px

Progress Indicator
Example:
Step 1 of 5
With animated progress bar.

Admin Dashboard
View submitted calculations.
Email Quotation
Automatically send estimate to user.
Currency Formatter
Auto-format:
1,000,000 LKR
Mobile Responsive
Fully optimized for mobile users.
________________________________________
Suggested Tech Stack
Frontend
•	React.js / Next.js 
•	Tailwind CSS 
•	Framer Motion 
Backend
•	Node.js 
Database
•	MySQL / Firebase 
Live Summary Sidebar
Always visible summary:
•	Land Size
Allowed Sqft
Used Sqft
Remaining Sqft
Roof Cost
Total Cost
Update instantly while user edits data.
