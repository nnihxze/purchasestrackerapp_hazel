# Purchases Tracker App

## Project Description
Purchases Tracker is a simple application that allows users to record, manage, and monitor their personal purchases. Users can create an account, log in, and keep track of their orders including the item name, price, date, and delivery status. :contentReference[oaicite:0]{index=0}

---

## Features

- User registration and login
- Add, edit, and delete purchase entries
- Mark orders as **To Receive** or **Arrived**
- Live search bar to filter purchases by item name
- Filter tabs:
  - All
  - To Receive
  - Arrived
- Dashboard showing:
  - Total Spent
  - Orders count
  - Arrived count
- Form validation:
  - Empty fields are not allowed
  - Negative prices are not allowed :contentReference[oaicite:1]{index=1}

---

# Detailed System Flow

## 1. App Launch
The app starts on the device. It checks local storage for an existing login session.

- If a session is found, the user goes directly to the Dashboard.
- If not, the Login screen is shown. :contentReference[oaicite:2]{index=2}

---

## 2. Register
A new user fills in their:

- Full Name
- Username
- Password

The app validates all fields and checks that the username is not already taken.

On success:
- The account is saved locally
- The user is redirected to the Login screen :contentReference[oaicite:3]{index=3}

---

## 3. Log In
The user enters their username and password.

The app:
- Checks the credentials against saved accounts
- Saves the session if valid
- Loads the user's purchase data
- Displays the Dashboard :contentReference[oaicite:4]{index=4}

---

## 4. Dashboard
The Dashboard displays:

### Statistics Header
- Total Amount Spent
- Total Orders
- Arrived Count

### Additional Features
- Search bar
- Filter tabs
- List of purchases sorted by date

All statistics update automatically whenever data changes. :contentReference[oaicite:5]{index=5}

---

## 5. Add Purchase
The user taps **"+ Add Purchase"**.

A form appears with:
- Item Name
- Price
- Date
- Delivery Status

All fields are validated before saving.

On success:
- The purchase is added
- Totals update immediately :contentReference[oaicite:6]{index=6}

---

## 6. Edit Purchase
The user taps **"Edit"** on any purchase card.

The form opens with existing data pre-filled.

After saving changes:
- The Dashboard updates instantly :contentReference[oaicite:7]{index=7}

---

## 7. Delete Purchase
The user taps **"Delete"** on a purchase card.

A confirmation prompt appears.

On confirmation:
- The item is removed
- Total Amount Spent recalculates automatically :contentReference[oaicite:8]{index=8}

---

## 8. Toggle Delivery Status
The user taps the status badge on any card to switch between:

- **To Receive**
- **Arrived**

This can be done without opening the edit form.

The statistics header updates instantly. :contentReference[oaicite:9]{index=9}

---

## 9. Search and Filter
The user types in the search bar to filter purchases by item name in real time.

The filter tabs:
- All
- To Receive
- Arrived

can also be combined with search to narrow down results further. :contentReference[oaicite:10]{index=10}

---

## 10. Logout
The user taps the logout button.

After confirmation:
- The session is cleared
- The app resets
- The Login screen is shown again :contentReference[oaicite:11]{index=11}
