# Smart Workspace Designer
Version: 1.0

---

# 1. Project Overview

Smart Workspace Designer is a web-based Decision Support System (DSS) that helps users design an ergonomic computer workspace.

Users can place common workspace objects onto a virtual desk, rearrange them using drag-and-drop, and receive automatic ergonomic recommendations based on rule-based analysis.

The system is intended for educational purposes and demonstrates how Management Information Systems can support decision making using predefined ergonomic rules rather than artificial intelligence.

---

# 2. Objectives

The system aims to:

- Design a virtual computer workspace.
- Simulate common desk layouts.
- Evaluate workspace arrangement.
- Provide ergonomic recommendations.
- Improve workspace comfort through rule-based analysis.

---

# 3. Target Users

- Students
- Office workers
- Home office users
- Anyone interested in ergonomic desk setup

---

# 4. System Scope

The application is entirely client-side.

No login system.

No database.

No cloud storage.

No AI.

No backend server.

All calculations are performed locally inside the browser.

---

# 5. Technologies

Frontend

- React
- TypeScript
- Vite
- Tailwind CSS

---

# 6. Functional Requirements

## 6.1 Workspace

The application displays a virtual desk in the center of the screen.

Available desk sizes:

- 120 × 60 cm
- 140 × 70 cm
- 160 × 80 cm

Changing desk size updates the workspace immediately.

---

## 6.2 Objects

Supported objects:

- Monitor
- Laptop
- Keyboard
- Mouse
- Chair
- Desk Lamp
- Speaker

Each object has:

- name
- position
- width
- height

Object positions use centimeters as the logical unit.

---

## 6.3 Add Object

Users may add workspace objects using the left sidebar.

Rules:

- Only one instance of each object is allowed.
- Added objects appear near the center of the desk.

---

## 6.4 Remove Object

Users can remove objects from the sidebar.

Removing an object also clears its selection.

---

## 6.5 Drag and Drop

Users may drag objects.

Dragging updates object coordinates in real time.

Objects remain inside the workspace.

---

## 6.6 Object Selection

Clicking an object selects it.

The selected object displays:

- Name
- X position
- Y position
- Width
- Height

All measurements are displayed in centimeters.

---

## 6.7 Workspace Analysis

The system continuously evaluates the workspace.

Evaluation updates automatically whenever:

- object moves
- object added
- object removed
- desk size changes

---

## 6.8 Workspace Scores

Three scores are calculated.

Workspace Score

Evaluates overall layout.

Ergonomic Score

Evaluates posture and ergonomic placement.

Comfort Score

Evaluates usability and comfort.

Each score ranges from:

0–100

---

## 6.9 Recommendations

The system generates suggestions whenever rules are violated.

Example:

- Move monitor onto the desk.
- Center monitor with chair.
- Place keyboard below monitor.
- Move mouse closer to keyboard.

---

# 7. Ergonomic Rules

## Rule 1

Monitor must be fully on the desk.

Penalty:

Workspace Score -20

---

## Rule 2

Keyboard must remain on the desk.

Penalty:

Ergonomic Score -15

---

## Rule 3

Keyboard and mouse should not overlap.

Penalty:

Comfort Score -10

---

## Rule 4

Chair should be centered with the desk.

Penalty:

Comfort Score -10

---

## Rule 5

Monitor should align with chair.

Penalty:

Ergonomic Score -10

---

## Rule 6

Keyboard should be below monitor.

Penalty:

Ergonomic Score -10

---

## Rule 7

Mouse should remain close to keyboard.

Penalty:

Comfort Score -10

---

## Rule 8

Laptop and monitor should not overlap.

Penalty:

Workspace Score -10

---

# 8. User Interface

Header

Displays project title.

Sidebar

Displays all available objects.

Users can:

- Add object
- Remove object

Workspace

Displays:

- desk
- objects
- drag interaction

Information Panel

Displays selected object information.

Analysis Panel

Displays:

- Workspace Score
- Ergonomic Score
- Comfort Score
- Recommendations

---

# 9. Non-functional Requirements

Responsive layout

Fast interaction

Real-time updates

Simple interface

Beginner-friendly

Runs entirely inside a browser

---

# 10. Constraints

No database

No authentication

No backend

No AI

No internet connection required

Rule-based decision support only

---

# 11. Future Improvements

Possible future features:

- Snap-to-grid
- Distance measurement
- Alignment guides
- Save workspace
- Load workspace
- Export layout
- Additional furniture
- Multiple monitors
- Standing desk support

---

# 12. Success Criteria

The project is considered successful if users can:

- Create a workspace
- Arrange objects
- Change desk size
- Receive ergonomic analysis
- Improve workspace score based on recommendations