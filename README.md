**Smart Expense Tracker**
*Project Description*

Smart Expense Tracker is a front-end web application designed to help users manage and split group expenses in a simple and organized manner.

The application allows users to add participants, record multiple contributions for an expense, preview a detailed summary before finalizing, and store completed expenses as history. Each expense is treated as a separate session, making it easy to manage multiple group expenses without mixing data.

This project focuses on building a real-world user flow using only core web technologies, without relying on external libraries or frameworks.

**Tech Stack**
*HTML*

HTML is used to define the structure of the application, including input forms, expense lists, summary sections, modal layouts, and history cards.

*CSS*

CSS is responsible for layout, styling, and responsiveness. Flexbox is used to align elements properly, while card-based UI and spacing are applied to improve readability. Visual indicators such as color-coded balances help users quickly understand who owes or receives money.

*JavaScript*

JavaScript powers the complete functionality of the application. It handles user interactions, manages application state, performs calculations, updates the UI dynamically, and controls modal behavior.

**Use of localStorage**
localStorage is used to store completed expense sessions and history data.
This ensures that:
*Expense history remains available even after refreshing the page.
*No backend or database is required.
*The application behaves like a real-world product.

Using localStorage keeps the project simple while still demonstrating persistence and state management.

**Event Handling**
Event listeners are used to handle user actions such as adding people, adding expenses, editing or deleting entries, opening the summary modal, and finalizing expenses.
Event delegation is implemented for dynamically created elements like expense rows. This approach reduces the number of event listeners and keeps the code clean and efficient.

**DOM Manipulation**
The application relies heavily on DOM manipulation to update the interface in real time.
JavaScript dynamically:
*Creates and removes expense rows
*Updates summary values
*Shows and hides the summary modal
*Renders expense history cards
*Resets the UI when an expense is completed or cleared
This ensures the UI always reflects the current state of the application.

**Expense Summary Logic**
The summary calculation follows a simple and clear approach:
*The total expense is calculated by summing all contributions
*The total is divided equally among all participants
*Each participant’s balance is calculated as:
Amount Paid − Equal Share
*A positive balance means the person should receive money
*A negative balance means the person owes money
The results are displayed using clear text and color indicators for better understanding.

