## Your Money Management Toolkit: Personal Budget API

**PersonalBudget** is your one-stop shop for taking charge of your finances! This Node.js app, built with Express and MySQL, lets you create an account, set up budgets, and track your spending with ease.

### Boss Your Budget with These Features:

- **New User? Sign Up!** Create a new account to get started.
- **Welcome Back!** Log in using your email and password.
- **Budgeting Made Simple:** Create, view, and remove budgets as needed.
- **Track Every Penny:** Record and manage your expenses to stay on top of your spending.

### API Shortcuts to Financial Freedom:

- **Sign Up Party** (`POST /api/signup`): Create a brand new account.
- **Unlock Your Budget** (`POST /api/login`): Log in to grab your authorization token (like a secret key!).
- **Peace Out** (`POST /api/logout`): Log out and ditch your authorization token.
- **Refresh Your Access** (`POST /api/refreshToken`): Get a new authorization token when yours expires.
- **Peek at Your Budgets** (`GET /api/budgets`): See all the budgets you've created.
- **Budget Blitz** (`POST /api/add-budget`): Create a spankin' new budget.
- **Budget Buh-Bye** (`DELETE /api/delete-budget/:budgetId`): Delete a budget you don't need anymore.
- **Expense Extravaganza** (`POST /api/addExpense`): Record a new expense (don't forget the details!).
- **Expense Expedition** (`GET /api/getExpenses`): Find specific expenses by date.
- **Expense Extermination** (`DELETE /api/deleteExpense/:expenseId`): Delete an expense you regret (we all have them).

### MySQL: Your Budget's Backstage Pass

The app needs a MySQL database to store your info. You'll need to set up your MySQL connection details in the main `app.js` file.

### Testing, Testing... 1, 2, 3!

The app comes with built-in unit tests to make sure everything works smoothly, from signing up to avoiding duplicate accounts.

This version uses a more casual and friendly tone, with simpler terms and a focus on the user benefits.
