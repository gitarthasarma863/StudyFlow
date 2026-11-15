# StudyFlow
Student Study Planner is a simple and responsive web application that helps students organize their study tasks, manage deadlines, track progress, and improve productivity.
# StudyFlow — Student Study Planner

**A simple and responsive web application that helps students organize academic tasks, assignments, projects, and exam preparation.**

## Project overview

StudyFlow is a browser-based student productivity tool. Students can create tasks, set due dates and priorities, organize tasks by category, and track their completion progress from a dashboard.

This project is built with beginner-friendly web technologies and does not require a backend server or database.

## Features

- Dashboard showing total, completed, pending, and due-today tasks
- Visual progress ring and completion percentage
- Add new tasks with title, due date, priority, and category
- Edit existing tasks
- Delete tasks
- Mark tasks as completed or pending
- Filter tasks by All, Due Today, Pending, and Completed
- Search tasks by title or category
- Save tasks in browser Local Storage
- Responsive design for desktop, tablet, and mobile screens
- Sample tasks on the first launch to demonstrate the application

## Technologies used

| Technology | Purpose |
|---|---|
| HTML5 | Structure of the website |
| CSS3 | Styling, layout, and responsive design |
| JavaScript | Task operations, filters, search, and dashboard calculations |
| Local Storage | Save task information in the browser |
| GitHub | Version control and project hosting |

## How to run

1. Download or clone this repository.
2. Open the project folder.
3. Double-click `index.html` to open it in a modern web browser.
4. Use **Add new task** to create your own study tasks.

No installation, server, or database setup is needed.

## Folder structure

```text
Student-Study-Planner/
├── index.html
├── style.css
├── script.js
└── README.md
```

## How the application works

1. The user fills in the task form.
2. JavaScript reads the title, date, priority, and category.
3. A task object is created and added to the task list.
4. The task list is saved as JSON in browser Local Storage.
5. When the page is opened again, saved tasks are loaded from Local Storage.
6. Dashboard values are calculated from the current task list.
7. Search and filter controls display only matching tasks.

## Testing checklist

- [ ] Add a task with all fields.
- [ ] Edit a task and save the changes.
- [ ] Mark a task as completed and pending.
- [ ] Search by task title and category.
- [ ] Filter tasks by status and due date.
- [ ] Delete a task.
- [ ] Refresh the browser and confirm tasks remain saved.
- [ ] Open the website on a mobile-sized screen.

## Limitations

- Tasks are saved only in the browser and device where they were created.
- There is no user login or cloud synchronization.
- Clearing browser site data may remove saved tasks.

## Future improvements

- Student accounts and secure login
- Cloud database and synchronization across devices
- Email or push notifications for approaching deadlines
- Weekly study timetable and calendar view
- Export tasks as PDF or CSV

## Academic project

**Project title:** Student Study Planner — Smart Task Management System  
**Project type:** Front-end web application  
**Prepared for:** Summer Project Evaluation, 2026
