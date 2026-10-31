
const subjects = [
    { name: "CS Fundamentals", attended: 32, total: 39 },
    { name: "DSA ", attended: 28, total: 38 },
    { name: "Data Mining", attended: 26, total: 38 },
    { name: "Discrete Maths", attended: 25, total: 35 },
    { name: "PDT", attended: 29, total: 37 },
    { name: "Web Development", attended: 28, total: 32 }
];

function getPercentage(subject) {
    return Math.round(
        (subject.attended / subject.total) * 100
    );
}

function renderSubjectProgress() {
    const container = document.getElementById("subjectProgress");

    if (!container) return;

    container.innerHTML = subjects.map(subject => {
        const percentage = getPercentage(subject);

        let status = "";

        if (percentage < 75) {
            status = "danger";
        } else if (percentage < 80) {
            status = "warning";
        }

        return `
            <div class="progress-row">
                <span>${subject.name}</span>

                <div class="progress-track">
                    <div
                        class="progress-fill ${status}"
                        style="width: ${percentage}%"
                    ></div>
                </div>

                <span class="progress-value">
                    ${percentage}%
                </span>
            </div>
        `;
    }).join("");
}

function loadStudentName() {
    const registration =
        localStorage.getItem("attendqRegistration");

    const nameElement = document.getElementById("studentName");

    if (nameElement && registration) {
        nameElement.textContent = registration;
    }
}

function logout() {
    localStorage.removeItem("attendqRegistration");
    window.location.href = "index.html";
}

document.addEventListener("DOMContentLoaded", () => {
    renderSubjectProgress();
    loadStudentName();

    const logoutButton = document.getElementById("logoutButton");

    if (logoutButton) {
        logoutButton.addEventListener("click", logout);
    }
});

/* ===== MY SUBJECTS PAGE ===== */

// Uses the same subjects array as the dashboard.

function renderMySubjects() {
    const grid = document.getElementById("subjectGrid");

    if (!grid) return;

    const searchInput = document.getElementById("subjectSearch");
    const filterSelect = document.getElementById("attendanceFilter");

    const countElement = document.getElementById("subjectCount");
    const meetingElement = document.getElementById("meetingTarget");
    const attentionElement = document.getElementById("needAttention");
    const overallElement = document.getElementById("subjectOverall");

    function drawSubjects() {
        const totalSubjects = subjects.length;

        const attended = subjects.reduce(
            (sum, subject) => sum + subject.attended, 0
        );

        const totalClasses = subjects.reduce(
            (sum, subject) => sum + subject.total, 0
        );

        const meeting = subjects.filter(
            subject => getPercentage(subject) >= 75
        ).length;

        countElement.textContent = totalSubjects;
        meetingElement.textContent = meeting;
        attentionElement.textContent = totalSubjects - meeting;

        overallElement.textContent = totalClasses
            ? Math.round(attended / totalClasses * 100) + "%"
            : "—";

        const query = searchInput.value.toLowerCase().trim();
        const filter = filterSelect.value;

        const filteredSubjects = subjects.filter(subject => {
            const percentage = getPercentage(subject);

            const matchesSearch = subject.name
                .toLowerCase()
                .includes(query);

            const matchesFilter =
                filter === "all" ||
                (filter === "safe" && percentage >= 75) ||
                (filter === "low" && percentage < 75);

            return matchesSearch && matchesFilter;
        });

        if (filteredSubjects.length === 0) {
            grid.innerHTML = `
                <div class="empty-state">
                    <h3>No subjects found</h3>
                    <p>Try changing your search or filter.</p>
                </div>
            `;
            return;
        }

        grid.innerHTML = filteredSubjects.map((subject, index) => {
            const percentage = getPercentage(subject);

            let status = "safe";
            let statusText = "Meeting attendance target";

            if (percentage < 75) {
                status = "danger";
                statusText = "Below 75% attendance";
            } else if (percentage < 80) {
                status = "warning";
                statusText = "Close to minimum target";
            }

            const missed = subject.total - subject.attended;

            return `
                <article class="subject-card">

                    <div class="subject-card-header">
                        <div class="subject-symbol">
                            ${subject.name.charAt(0)}
                        </div>

                        <div>
                            <h3>${subject.name}</h3>
                            <div class="subject-code">
                                Subject ${String(index + 1).padStart(2, "0")}
                            </div>
                        </div>
                    </div>

                    <div class="attendance-number ${status}">
                        ${percentage}%
                    </div>

                    <div class="subject-progress-track">
                        <div
                            class="subject-progress-fill ${status}"
                            style="width: ${percentage}%"
                        ></div>
                    </div>

                    <div class="subject-card-stats">
                        <div>
                            <small>Classes attended</small>
                            <b>${subject.attended}</b>
                        </div>

                        <div>
                            <small>Classes missed</small>
                            <b>${missed}</b>
                        </div>
                    </div>

                    <div class="attendance-status ${status}">
                        <span class="status-dot"></span>
                        ${statusText}
                    </div>

                </article>
            `;
        }).join("");
    }

    searchInput.addEventListener("input", drawSubjects);
    filterSelect.addEventListener("change", drawSubjects);

    drawSubjects();
}

document.addEventListener("DOMContentLoaded", renderMySubjects);

/* ===== ATTENDQ CALENDAR LOGIC ===== */

function initAttendQCalendar() {
    const calendarDays = document.getElementById("calendarDays");
    if (!calendarDays) return;

    const monthTitle = document.getElementById("monthTitle");
    const selectedDateTitle = document.getElementById("selectedDateTitle");
    const scheduleSubtitle = document.getElementById("scheduleSubtitle");
    const dailySchedule = document.getElementById("dailySchedule");

    const today = new Date();
    let displayedMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    let selectedDate = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
    );

    /*
      Demo schedule.
      The dates and times are sample data; change them to match
      your actual college timetable.
    */
    const classSchedule = {
        1: [
            { time: "09:00 AM", subject: "CS Fundamentals", room: "Lab 1" },
            { time: "11:00 AM", subject: "Discrete Maths", room: "Room 204" }
        ],
        2: [
            { time: "10:00 AM", subject: "DSA (C++)", room: "Lab 2" },
            { time: "01:00 PM", subject: "Data Mining", room: "Room 301" }
        ],
        3: [
            { time: "09:00 AM", subject: "Web Technology", room: "Lab 1" },
            { time: "12:00 PM", subject: "PDT", room: "Room 205" }
        ],
        4: [
            { time: "10:00 AM", subject: "CS Fundamentals", room: "Room 204" }
        ],
        5: [
            { time: "09:00 AM", subject: "DSA (C++)", room: "Lab 2" },
            { time: "11:00 AM", subject: "Discrete Maths", room: "Room 205" }
        ]
    };

    function sameDay(first, second) {
        return first.getFullYear() === second.getFullYear() &&
            first.getMonth() === second.getMonth() &&
            first.getDate() === second.getDate();
    }

    function getClasses(date) {
        // Weekdays only, Monday = 1 and Friday = 5.
        const dayOfWeek = date.getDay() === 0 ? 7 : date.getDay();

        if (dayOfWeek > 5) return [];

        return classSchedule[dayOfWeek] || [];
    }

    function renderCalendar() {
        const year = displayedMonth.getFullYear();
        const month = displayedMonth.getMonth();

        monthTitle.textContent = displayedMonth.toLocaleDateString(
            "en-IN",
            { month: "long", year: "numeric" }
        );

        calendarDays.innerHTML = "";

        // Convert Sunday-based JS weekday to Monday-based calendar.
        const firstWeekday = new Date(year, month, 1).getDay();
        const startOffset = (firstWeekday + 6) % 7;
        const numberOfDays = new Date(year, month + 1, 0).getDate();

        for (let i = 0; i < startOffset; i++) {
            const emptyCell = document.createElement("div");
            emptyCell.className = "calendar-day empty";
            emptyCell.setAttribute("aria-hidden", "true");
            calendarDays.appendChild(emptyCell);
        }

        for (let day = 1; day <= numberOfDays; day++) {
            const date = new Date(year, month, day);
            const button = document.createElement("button");
            button.type = "button";
            button.className = "calendar-day";
            button.textContent = day;
            button.setAttribute("aria-label", date.toDateString());

            if (sameDay(date, today)) {
                button.classList.add("today");
            }

            if (sameDay(date, selectedDate)) {
                button.classList.add("selected");
                button.setAttribute("aria-pressed", "true");
            } else {
                button.setAttribute("aria-pressed", "false");
            }

            if (getClasses(date).length > 0) {
                button.classList.add("has-classes");
            }

            button.addEventListener("click", () => {
                selectedDate = new Date(year, month, day);
                renderCalendar();
                renderDailySchedule();
            });

            calendarDays.appendChild(button);
        }
    }

    function renderDailySchedule() {
        selectedDateTitle.textContent = selectedDate.toLocaleDateString(
            "en-IN",
            {
                weekday: "long",
                day: "numeric",
                month: "long"
            }
        );

        const classes = getClasses(selectedDate);

        scheduleSubtitle.textContent = classes.length
            ? `${classes.length} class${classes.length === 1 ? "" : "es"} scheduled`
            : "No demo classes scheduled for this date.";

        if (classes.length === 0) {
            dailySchedule.innerHTML = `
                <div class="schedule-empty">
                    <p>No classes scheduled.</p>
                    <p>Enjoy your free time or update the demo timetable in app.js.</p>
                </div>
            `;
            return;
        }

        dailySchedule.innerHTML = classes.map(item => `
            <article class="schedule-item">
                <div class="schedule-time">${item.time}</div>
                <div class="schedule-details">
                    <h3>${item.subject}</h3>
                    <p>${item.room}</p>
                    <span class="schedule-tag">Scheduled class</span>
                </div>
            </article>
        `).join("");
    }

    document.getElementById("prevMonth").addEventListener("click", () => {
        displayedMonth = new Date(
            displayedMonth.getFullYear(),
            displayedMonth.getMonth() - 1,
            1
        );
        renderCalendar();
    });

    document.getElementById("nextMonth").addEventListener("click", () => {
        displayedMonth = new Date(
            displayedMonth.getFullYear(),
            displayedMonth.getMonth() + 1,
            1
        );
        renderCalendar();
    });

    document.getElementById("todayButton").addEventListener("click", () => {
        const now = new Date();
        displayedMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        selectedDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        renderCalendar();
        renderDailySchedule();
    });

    renderCalendar();
    renderDailySchedule();
}

document.addEventListener("DOMContentLoaded", initAttendQCalendar);

/* ===== ATTENDQ ATTENDANCE CALCULATOR LOGIC ===== */

function initAttendanceCalculator() {
    const form = document.getElementById("attendanceForm");
    if (!form) return;

    const subjectSelect = document.getElementById("subjectSelect");
    const attendedInput = document.getElementById("attendedInput");
    const totalInput = document.getElementById("totalInput");
    const targetInput = document.getElementById("targetInput");

    const percentageElement = document.getElementById("resultPercentage");
    const progressElement = document.getElementById("resultProgress");
    const statusElement = document.getElementById("resultStatus");
    const missedElement = document.getElementById("missedResult");
    const neededElement = document.getElementById("neededResult");
    const safeMissElement = document.getElementById("safeMissResult");
    const explanationElement = document.getElementById("resultExplanation");

    // Load the subjects from the existing dashboard data.
    if (typeof subjects !== "undefined") {
        subjects.forEach((subject, index) => {
            const option = document.createElement("option");
            option.value = index;
            option.textContent = subject.name;
            subjectSelect.appendChild(option);
        });
    }

    subjectSelect.addEventListener("change", () => {
        if (subjectSelect.value === "") return;

        const subject = subjects[Number(subjectSelect.value)];
        attendedInput.value = subject.attended;
        totalInput.value = subject.total;

        calculateResults();
    });

    [attendedInput, totalInput, targetInput].forEach(input => {
        input.addEventListener("input", () => {
            if (form.reportValidity()) calculateResults();
        });
    });

    form.addEventListener("submit", event => {
        event.preventDefault();

        if (!form.reportValidity()) return;

        calculateResults();
    });

    function calculateResults() {
        const attended = Number(attendedInput.value);
        const total = Number(totalInput.value);
        const target = Number(targetInput.value);

        if (
            !Number.isInteger(attended) ||
            !Number.isInteger(total) ||
            attended < 0 ||
            total < 1 ||
            attended > total ||
            !Number.isFinite(target) ||
            target <= 0 ||
            target > 100
        ) {
            percentageElement.textContent = "—";
            progressElement.style.width = "0%";
            statusElement.className = "result-status danger";
            statusElement.textContent =
                "Please enter valid numbers. Attended classes cannot exceed total classes.";
            missedElement.textContent = "—";
            neededElement.textContent = "—";
            safeMissElement.textContent = "—";
            explanationElement.textContent = "Correct the inputs to calculate your attendance.";
            return;
        }

        const missed = total - attended;
        const percentage = attended / total * 100;

        // Minimum additional classes to attend consecutively to reach target.
        const needed = Math.max(
            0,
            Math.ceil((target * total - 100 * attended) / (100 - target))
        );

        // Maximum future classes that can be missed while maintaining target,
        // assuming every other future class is attended.
        const safeMisses = Math.max(
            0,
            Math.floor((100 * attended / target) - total + 1e-10)
        );

        percentageElement.textContent = percentage.toFixed(2) + "%";
        progressElement.style.width = Math.min(percentage, 100) + "%";
        missedElement.textContent = missed;
        neededElement.textContent = needed;
        safeMissElement.textContent = safeMisses;

        progressElement.className = "result-progress-fill";
        statusElement.className = "result-status";

        if (percentage < target) {
            progressElement.classList.add("danger");
            statusElement.classList.add("danger");
            statusElement.textContent =
                `You are below your ${target}% target. Attend ${needed} consecutive classes without missing any to reach it.`;
        } else if (percentage < target + 5) {
            progressElement.classList.add("warning");
            statusElement.classList.add("warning");
            statusElement.textContent =
                `You meet your ${target}% target, but your buffer is small. Try to maintain a consistent attendance record.`;
        } else {
            statusElement.classList.add("safe");
            statusElement.textContent =
                `You are above your ${target}% target. Keep attending classes to maintain your buffer.`;
        }

        if (percentage >= target) {
            explanationElement.textContent =
                `You have attended ${attended} out of ${total} classes. You can miss up to ${safeMisses} additional classes in a row only if you attend all other future classes and want to maintain at least ${target}% overall attendance.`;
        } else {
            explanationElement.textContent =
                `You have attended ${attended} out of ${total} classes. Attend the next ${needed} classes consecutively to reach at least ${target}% attendance, assuming no other classes are missed.`;
        }
    }
}

document.addEventListener("DOMContentLoaded", initAttendanceCalculator);

/* ===== ATTENDQ PROFILE LOGIC ===== */

function initAttendQProfile() {
    const profileForm = document.getElementById("profileForm");
    if (!profileForm) return;

    const registration = localStorage.getItem("attendqRegistration") || "";
    const savedName = localStorage.getItem("attendqDisplayName") || "";

    const displayNameInput = document.getElementById("displayNameInput");
    const profileDisplayName = document.getElementById("profileDisplayName");
    const profileRegistration = document.getElementById("profileRegistration");
    const registrationDisplay = document.getElementById("registrationDisplay");
    const profileAvatar = document.getElementById("profileAvatar");
    const profileMessage = document.getElementById("profileMessage");

    function updateIdentity(name) {
        const displayName = name.trim() || registration || "Student";

        profileDisplayName.textContent = displayName;
        profileAvatar.textContent = displayName.charAt(0).toUpperCase();
        profileRegistration.textContent = registration
            ? "Reg. No. " + registration
            : "Registration number not set";
    }

    displayNameInput.value = savedName;
    registrationDisplay.value = registration || "Not set";

    updateIdentity(savedName);

    profileForm.addEventListener("submit", event => {
        event.preventDefault();

        const name = displayNameInput.value.trim();

        if (!name) {
            profileMessage.className = "profile-message error";
            profileMessage.textContent = "Please enter a display name.";
            return;
        }

        localStorage.setItem("attendqDisplayName", name);
        updateIdentity(name);

        profileMessage.className = "profile-message success";
        profileMessage.textContent = "Your display name has been saved.";
    });

    // Update the academic overview from the existing subject data.
    if (typeof subjects !== "undefined") {
        const totalAttended = subjects.reduce(
            (sum, subject) => sum + subject.attended, 0
        );

        const totalConducted = subjects.reduce(
            (sum, subject) => sum + subject.total, 0
        );

        const belowTarget = subjects.filter(subject =>
            subject.total > 0 &&
            (subject.attended / subject.total) * 100 < 75
        ).length;

        document.getElementById("profileSubjectCount").textContent =
            subjects.length;

        document.getElementById("profileOverallAttendance").textContent =
            totalConducted > 0
                ? Math.round(totalAttended / totalConducted * 100) + "%"
                : "—";

        document.getElementById("profileLowSubjects").textContent =
            belowTarget;
    }
}

document.addEventListener("DOMContentLoaded", initAttendQProfile);

