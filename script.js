document.addEventListener("DOMContentLoaded", () => {
    const themeToggle = document.getElementById("theme-toggle");

    // 🌙 Theme Toggle
    themeToggle.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
        localStorage.setItem("theme", document.body.classList.contains("dark-mode") ? "dark" : "light");
    });

    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark-mode");
    }

    // 📌 Load and Check Reminders
    loadReminders();
    
    // 🚀 Fix: Check reminders every 10 seconds
    setInterval(checkReminders, 10000); 

    document.getElementById("add-reminder").addEventListener("click", addReminder);

    function addReminder() {
        let text = document.getElementById("reminder-text").value.trim();
        let dateTime = document.getElementById("reminder-datetime").value;

        if (!text || !dateTime) {
            alert("⚠ Please enter both reminder text and date-time.");
            return;
        }

        let reminders = JSON.parse(localStorage.getItem("reminders")) || [];
        reminders.push({ text, dateTime, notified: false });  // 🚀 Fix: Added `notified` flag
        localStorage.setItem("reminders", JSON.stringify(reminders));

        document.getElementById("reminder-text").value = "";
        document.getElementById("reminder-datetime").value = "";

        loadReminders();
    }

    function loadReminders() {
        let reminders = JSON.parse(localStorage.getItem("reminders")) || [];
        let list = document.getElementById("reminder-list");
        list.innerHTML = "";

        reminders.forEach((reminder, index) => {
            let li = document.createElement("li");
            li.innerHTML = `📚 ${reminder.text} - <strong>${formatDateTime(reminder.dateTime)}</strong> 
                            <button class="delete-btn" data-index="${index}">❌</button>`;
            list.appendChild(li);
        });

        // Add event listener for delete buttons
        document.querySelectorAll(".delete-btn").forEach(button => {
            button.addEventListener("click", function () {
                deleteReminder(this.getAttribute("data-index"));
            });
        });
    }

    function deleteReminder(index) {
        let reminders = JSON.parse(localStorage.getItem("reminders")) || [];
        reminders.splice(index, 1);
        localStorage.setItem("reminders", JSON.stringify(reminders));
        loadReminders();
    }

    function checkReminders() {
        let reminders = JSON.parse(localStorage.getItem("reminders")) || [];
        let now = new Date().getTime();

        reminders.forEach((reminder, index) => {
            let reminderTime = new Date(reminder.dateTime).getTime();

            if (reminderTime <= now && !reminder.notified) {
                showPopup(`📚 Time to Study: ${reminder.text}`);

                // Mark as notified to prevent multiple alerts
                reminders[index].notified = true;
                localStorage.setItem("reminders", JSON.stringify(reminders));
            }
        });
    }

    // 🛑 Popup Alert Function
    function showPopup(message) {
        const popup = document.getElementById("popup");
        const popupText = document.getElementById("popup-text");

        popupText.innerHTML = message;
        popup.style.display = "block";

        setTimeout(() => {
            popup.style.display = "none";
        }, 5000); // Hide after 5 seconds
    }

    // 📅 Format Date-Time (Readable Format)
    function formatDateTime(dateTime) {
        let date = new Date(dateTime);
        return date.toLocaleString();
    }
});
