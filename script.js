/* =========================================================
   DSA PRACTICE TRACKER
   Vanilla JavaScript
========================================================= */


/* =========================================================
   TOPICS
========================================================= */

const topics = [
    "Arrays",
    "Strings",
    "Linked Lists",
    "Stacks",
    "Queues",
    "Trees",
    "Binary Search Trees",
    "Heaps",
    "Graphs",
    "Recursion",
    "Backtracking",
    "Dynamic Programming",
    "Greedy",
    "Sorting",
    "Searching",
    "Hashing",
    "Bit Manipulation",
    "Sliding Window",
    "Two Pointers",
    "Tries"
];


/* =========================================================
   DATA
========================================================= */

let problems =
    JSON.parse(localStorage.getItem("dsaProblems")) || [];

let studyLogs =
    JSON.parse(localStorage.getItem("studyLogs")) || [];


/* =========================================================
   DOM ELEMENTS
========================================================= */

const modal = document.getElementById("problemModal");

const problemForm =
    document.getElementById("problemForm");

const topicsGrid =
    document.getElementById("topicsGrid");

const problemTable =
    document.getElementById("problemTable");

const emptyState =
    document.getElementById("emptyState");

const topicFilter =
    document.getElementById("topicFilter");

const searchInput =
    document.getElementById("searchInput");

const difficultyFilter =
    document.getElementById("difficultyFilter");

const statusFilter =
    document.getElementById("statusFilter");

const problemTopic =
    document.getElementById("problemTopic");


/* =========================================================
   SAVE DATA
========================================================= */

function saveData() {

    localStorage.setItem(
        "dsaProblems",
        JSON.stringify(problems)
    );

    localStorage.setItem(
        "studyLogs",
        JSON.stringify(studyLogs)
    );
}


/* =========================================================
   INITIALIZE TOPICS
========================================================= */

function initializeTopics() {

    problemTopic.innerHTML =
        '<option value="">Select topic</option>';

    topicFilter.innerHTML =
        '<option value="">All Topics</option>';

    topics.forEach(topic => {

        problemTopic.innerHTML += `
            <option value="${topic}">
                ${topic}
            </option>
        `;

        topicFilter.innerHTML += `
            <option value="${topic}">
                ${topic}
            </option>
        `;
    });
}


/* =========================================================
   RENDER TOPICS
========================================================= */

function renderTopics() {

    topicsGrid.innerHTML = "";

    topics.forEach(topic => {

        const topicProblems =
            problems.filter(p => p.topic === topic);

        const solved =
            topicProblems.filter(
                p => p.status === "Solved"
            ).length;

        const total =
            topicProblems.length;

        const percentage =
            total > 0
                ? Math.round((solved / total) * 100)
                : 0;


        const easy =
            topicProblems.filter(
                p => p.difficulty === "Easy"
            ).length;

        const medium =
            topicProblems.filter(
                p => p.difficulty === "Medium"
            ).length;

        const hard =
            topicProblems.filter(
                p => p.difficulty === "Hard"
            ).length;


        const card = document.createElement("div");

        card.className = "topic-card";

        card.innerHTML = `

            <div class="topic-card-header">

                <h3>${topic}</h3>

                <p>${percentage}%</p>

            </div>

            <p>
                ${solved} solved / ${total} problems
            </p>

            <div class="progress-bar">

                <div
                    class="progress-fill"
                    style="width:${percentage}%"
                ></div>

            </div>

            <div class="difficulty-tags">

                <span class="tag easy">
                    E ${easy}
                </span>

                <span class="tag medium">
                    M ${medium}
                </span>

                <span class="tag hard">
                    H ${hard}
                </span>

            </div>

        `;


        card.addEventListener("click", () => {

            topicFilter.value = topic;

            renderProblems();

            document
                .getElementById("problems")
                .scrollIntoView({
                    behavior: "smooth"
                });

        });


        topicsGrid.appendChild(card);

    });
}


/* =========================================================
   RENDER PROBLEMS
========================================================= */

function renderProblems() {

    const search =
        searchInput.value.toLowerCase();

    const topic =
        topicFilter.value;

    const difficulty =
        difficultyFilter.value;

    const status =
        statusFilter.value;


    const filtered =
        problems.filter(problem => {

            const matchesSearch =
                problem.name
                    .toLowerCase()
                    .includes(search);

            const matchesTopic =
                !topic ||
                problem.topic === topic;

            const matchesDifficulty =
                !difficulty ||
                problem.difficulty === difficulty;

            const matchesStatus =
                !status ||
                problem.status === status;

            return (
                matchesSearch &&
                matchesTopic &&
                matchesDifficulty &&
                matchesStatus
            );

        });


    problemTable.innerHTML = "";


    if (filtered.length === 0) {

        emptyState.style.display = "block";

        return;

    }

    emptyState.style.display = "none";


    filtered.forEach(problem => {

        const row =
            document.createElement("tr");


        let difficultyClass =
            problem.difficulty.toLowerCase();

        let statusClass =
            problem.status.toLowerCase();


        row.innerHTML = `

            <td class="problem-name">
                ${escapeHTML(problem.name)}
            </td>

            <td>
                ${escapeHTML(problem.topic)}
            </td>

            <td>
                <span class="tag ${difficultyClass}">
                    ${problem.difficulty}
                </span>
            </td>

            <td>
                ${escapeHTML(problem.platform)}
            </td>

            <td>
                ${problem.date}
            </td>

            <td>
                ${problem.time || 0} min
            </td>

            <td>
                <span class="status status-${statusClass}">
                    ${problem.status}
                </span>
            </td>

            <td>

                <button
                    class="action-btn"
                    onclick="editProblem(${problem.id})"
                    title="Edit"
                >
                    <i class="fa-solid fa-pen"></i>
                </button>

                <button
                    class="action-btn delete-btn"
                    onclick="deleteProblem(${problem.id})"
                    title="Delete"
                >
                    <i class="fa-solid fa-trash"></i>
                </button>

            </td>

        `;

        problemTable.appendChild(row);

    });

}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}


/* =========================================================
   ADD / EDIT PROBLEM
========================================================= */

problemForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const id =
            document.getElementById("editId").value;


        const problemData = {

            id:
                id
                    ? Number(id)
                    : Date.now(),

            name:
                document.getElementById(
                    "problemName"
                ).value.trim(),

            topic:
                document.getElementById(
                    "problemTopic"
                ).value,

            difficulty:
                document.getElementById(
                    "problemDifficulty"
                ).value,

            platform:
                document.getElementById(
                    "problemPlatform"
                ).value,

            date:
                document.getElementById(
                    "problemDate"
                ).value,

            time:
                Number(
                    document.getElementById(
                        "problemTime"
                    ).value
                ) || 0,

            status:
                document.getElementById(
                    "problemStatus"
                ).value,

            notes:
                document.getElementById(
                    "problemNotes"
                ).value.trim()

        };


        if (id) {

            const index =
                problems.findIndex(
                    p => p.id === Number(id)
                );

            if (index !== -1) {

                problems[index] =
                    problemData;

            }

        } else {

            problems.push(problemData);

        }


        saveData();

        renderEverything();

        closeModal();

    }
);


/* =========================================================
   EDIT PROBLEM
========================================================= */

function editProblem(id) {

    const problem =
        problems.find(p => p.id === id);

    if (!problem) return;


    document.getElementById("editId").value =
        problem.id;

    document.getElementById("problemName").value =
        problem.name;

    document.getElementById("problemTopic").value =
        problem.topic;

    document.getElementById("problemDifficulty").value =
        problem.difficulty;

    document.getElementById("problemPlatform").value =
        problem.platform;

    document.getElementById("problemDate").value =
        problem.date;

    document.getElementById("problemTime").value =
        problem.time;

    document.getElementById("problemStatus").value =
        problem.status;

    document.getElementById("problemNotes").value =
        problem.notes || "";


    document.getElementById("modalTitle").textContent =
        "Edit Problem";


    modal.classList.add("active");

}


/* =========================================================
   DELETE PROBLEM
========================================================= */

function deleteProblem(id) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this problem?"
        );

    if (!confirmDelete) return;


    problems =
        problems.filter(
            problem => problem.id !== id
        );


    saveData();

    renderEverything();

}


/* =========================================================
   MODAL
========================================================= */

function openModal() {

    problemForm.reset();

    document.getElementById("editId").value = "";

    document.getElementById("modalTitle").textContent =
        "Add Problem";


    document.getElementById("problemDate").value =
        new Date().toISOString().split("T")[0];


    modal.classList.add("active");

}


function closeModal() {

    modal.classList.remove("active");

}


document
    .getElementById("openModal")
    .addEventListener(
        "click",
        openModal
    );


document
    .getElementById("openModal2")
    .addEventListener(
        "click",
        openModal
    );


document
    .getElementById("closeModal")
    .addEventListener(
        "click",
        closeModal
    );


document
    .getElementById("cancelModal")
    .addEventListener(
        "click",
        closeModal
    );


modal.addEventListener(
    "click",
    event => {

        if (event.target === modal) {
            closeModal();
        }

    }
);


/* =========================================================
   FILTERS
========================================================= */

searchInput.addEventListener(
    "input",
    renderProblems
);

topicFilter.addEventListener(
    "change",
    renderProblems
);

difficultyFilter.addEventListener(
    "change",
    renderProblems
);

statusFilter.addEventListener(
    "change",
    renderProblems
);


/* =========================================================
   DASHBOARD
========================================================= */

function updateDashboard() {

    const solved =
        problems.filter(
            p => p.status === "Solved"
        ).length;


    document.getElementById(
        "totalSolved"
    ).textContent = solved;


    const totalMinutes =
        studyLogs.reduce(
            (sum, log) =>
                sum + Number(log.minutes),
            0
        );


    document.getElementById(
        "totalHours"
    ).textContent =
        (totalMinutes / 60).toFixed(1);


    let mastered = 0;


    topics.forEach(topic => {

        const topicProblems =
            problems.filter(
                p => p.topic === topic
            );

        if (
            topicProblems.length >= 5 &&
            topicProblems.filter(
                p => p.status === "Solved"
            ).length /
            topicProblems.length >= 0.8
        ) {

            mastered++;

        }

    });


    document.getElementById(
        "topicsMastered"
    ).textContent = mastered;


    document.getElementById(
        "currentStreak"
    ).textContent =
        calculateStreak();

}


/* =========================================================
   STREAK
========================================================= */

function calculateStreak() {

    if (studyLogs.length === 0) {
        return 0;
    }


    const dates =
        [...new Set(
            studyLogs.map(log => log.date)
        )]
        .sort()
        .reverse();


    let streak = 0;

    let current =
        new Date();


    for (let dateString of dates) {

        const logDate =
            new Date(dateString);


        const diff =
            Math.floor(
                (
                    current - logDate
                ) /
                (1000 * 60 * 60 * 24)
            );


        if (diff === 0) {

            streak++;

            current.setDate(
                current.getDate() - 1
            );

        } else if (diff === 1) {

            streak++;

            current =
                new Date(logDate);

        } else {

            break;

        }

    }

    return streak;
}


/* =========================================================
   STUDY TIME LOG
========================================================= */

document
    .getElementById("logTimeBtn")
    .addEventListener(
        "click",
        function () {

            const minutes =
                Number(
                    document.getElementById(
                        "studyMinutes"
                    ).value
                );


            if (!minutes || minutes <= 0) {

                alert(
                    "Please enter a valid study time."
                );

                return;

            }


            const today =
                new Date()
                    .toISOString()
                    .split("T")[0];


            const existing =
                studyLogs.find(
                    log => log.date === today
                );


            if (existing) {

                existing.minutes += minutes;

            } else {

                studyLogs.push({
                    date: today,
                    minutes: minutes
                });

            }


            document.getElementById(
                "studyMinutes"
            ).value = "";


            saveData();

            renderEverything();

        }
    );


/* =========================================================
   HEATMAP
========================================================= */

function renderHeatmap() {

    const heatmap =
        document.getElementById("heatmap");

    heatmap.innerHTML = "";


    const today =
        new Date();


    const year =
        today.getFullYear();

    const month =
        today.getMonth();


    const monthName =
        today.toLocaleString(
            "default",
            {
                month: "long",
                year: "numeric"
            }
        );


    document.getElementById(
        "currentMonth"
    ).textContent = monthName;


    const days =
        new Date(
            year,
            month + 1,
            0
        ).getDate();


    for (
        let day = 1;
        day <= days;
        day++
    ) {

        const date =
            `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;


        const log =
            studyLogs.find(
                l => l.date === date
            );


        const minutes =
            log ? log.minutes : 0;


        let level = 0;


        if (minutes > 0)
            level = 1;

        if (minutes >= 30)
            level = 2;

        if (minutes >= 60)
            level = 3;

        if (minutes >= 120)
            level = 4;


        const cell =
            document.createElement("div");

        cell.className =
            `heat level-${level}`;

        cell.title =
            `${date}: ${minutes} minutes`;


        heatmap.appendChild(cell);

    }

}


/* =========================================================
   CHARTS
========================================================= */

let timeChart;
let monthlyChart;
let difficultyChart;


function createCharts() {

    createTimeChart();

    createMonthlyChart();

    createDifficultyChart();

}


/* =========================================================
   TIME CHART
========================================================= */

function createTimeChart() {

    const canvas =
        document.getElementById(
            "timeChart"
        );


    if (timeChart) {
        timeChart.destroy();
    }


    const labels = [];

    const values = [];


    for (
        let i = 29;
        i >= 0;
        i--
    ) {

        const date =
            new Date();

        date.setDate(
            date.getDate() - i
        );


        const dateString =
            date.toISOString()
                .split("T")[0];


        labels.push(
            date.toLocaleDateString(
                "en",
                {
                    day: "numeric",
                    month: "short"
                }
            )
        );


        const log =
            studyLogs.find(
                l => l.date === dateString
            );


        values.push(
            log ? log.minutes : 0
        );

    }


    timeChart =
        new Chart(
            canvas,
            {

                type: "line",

                data: {

                    labels: labels,

                    datasets: [

                        {

                            label:
                                "Minutes",

                            data:
                                values,

                            borderColor:
                                "#4f46e5",

                            backgroundColor:
                                "rgba(79,70,229,0.1)",

                            fill: true,

                            tension: 0.35,

                            borderWidth: 2

                        }

                    ]

                },

                options: {

                    responsive: true,

                    plugins: {
                        legend: {
                            display: false
                        }
                    },

                    scales: {

                        y: {
                            beginAtZero: true
                        }

                    }

                }

            }
        );

}


/* =========================================================
   MONTHLY CHART
========================================================= */

function createMonthlyChart() {

    const canvas =
        document.getElementById(
            "monthlyChart"
        );


    if (monthlyChart) {
        monthlyChart.destroy();
    }


    const labels = [];

    const values = [];


    for (
        let i = 5;
        i >= 0;
        i--
    ) {

        const date =
            new Date();

        date.setMonth(
            date.getMonth() - i
        );


        const month =
            date.getMonth();

        const year =
            date.getFullYear();


        labels.push(
            date.toLocaleString(
                "default",
                {
                    month: "short"
                }
            )
        );


        const count =
            problems.filter(p => {

                if (
                    p.status !== "Solved"
                )
                    return false;


                const d =
                    new Date(p.date);


                return (
                    d.getMonth() === month &&
                    d.getFullYear() === year
                );

            }).length;


        values.push(count);

    }


    monthlyChart =
        new Chart(
            canvas,
            {

                type: "bar",

                data: {

                    labels: labels,

                    datasets: [

                        {

                            label:
                                "Problems Solved",

                            data:
                                values,

                            backgroundColor:
                                "#6366f1",

                            borderRadius: 6

                        }

                    ]

                },

                options: {

                    responsive: true,

                    plugins: {
                        legend: {
                            display: false
                        }
                    },

                    scales: {

                        y: {
                            beginAtZero: true
                        }

                    }

                }

            }
        );

}


/* =========================================================
   DIFFICULTY CHART
========================================================= */

function createDifficultyChart() {

    const canvas =
        document.getElementById(
            "difficultyChart"
        );


    if (difficultyChart) {
        difficultyChart.destroy();
    }


    const easy =
        problems.filter(
            p =>
                p.status === "Solved" &&
                p.difficulty === "Easy"
        ).length;


    const medium =
        problems.filter(
            p =>
                p.status === "Solved" &&
                p.difficulty === "Medium"
        ).length;


    const hard =
        problems.filter(
            p =>
                p.status === "Solved" &&
                p.difficulty === "Hard"
        ).length;


    difficultyChart =
        new Chart(
            canvas,
            {

                type: "doughnut",

                data: {

                    labels: [
                        "Easy",
                        "Medium",
                        "Hard"
                    ],

                    datasets: [

                        {

                            data: [
                                easy,
                                medium,
                                hard
                            ],

                            backgroundColor: [
                                "#22c55e",
                                "#f97316",
                                "#ef4444"
                            ]

                        }

                    ]

                },

                options: {

                    responsive: true,

                    plugins: {

                        legend: {
                            position: "bottom"
                        }

                    }

                }

            }
        );

}


/* =========================================================
   MONTHLY COMPARISON
========================================================= */

function updateComparison() {

    const today =
        new Date();


    const currentMonth =
        today.getMonth();

    const currentYear =
        today.getFullYear();


    const previous =
        new Date(
            currentYear,
            currentMonth - 1,
            1
        );


    const previousMonth =
        previous.getMonth();

    const previousYear =
        previous.getFullYear();


    const currentCount =
        problems.filter(p => {

            if (p.status !== "Solved")
                return false;


            const date =
                new Date(p.date);


            return (
                date.getMonth() === currentMonth &&
                date.getFullYear() === currentYear
            );

        }).length;


    const previousCount =
        problems.filter(p => {

            if (p.status !== "Solved")
                return false;


            const date =
                new Date(p.date);


            return (
                date.getMonth() === previousMonth &&
                date.getFullYear() === previousYear
            );

        }).length;


    const difference =
        currentCount - previousCount;


    let text;


    if (difference > 0) {

        text =
            `🔥 You solved ${difference} more problem${difference > 1 ? "s" : ""} than last month!`;

    } else if (difference < 0) {

        text =
            `You solved ${Math.abs(difference)} fewer problem${Math.abs(difference) > 1 ? "s" : ""} than last month. Keep going!`;

    } else {

        text =
            "You solved the same number of problems as last month.";

    }


    document.getElementById(
        "comparisonText"
    ).textContent = text;

}


/* =========================================================
   DARK / LIGHT MODE
========================================================= */

const themeToggle =
    document.getElementById(
        "themeToggle"
    );


function updateThemeIcon() {

    if (
        document.body.classList.contains(
            "dark"
        )
    ) {

        themeToggle.innerHTML =
            '<i class="fa-solid fa-sun"></i>';

    } else {

        themeToggle.innerHTML =
            '<i class="fa-solid fa-moon"></i>';

    }

}


themeToggle.addEventListener(
    "click",
    () => {

        document.body.classList.toggle(
            "dark"
        );


        const dark =
            document.body.classList.contains(
                "dark"
            );


        localStorage.setItem(
            "darkMode",
            dark
        );


        updateThemeIcon();

    }
);


/* =========================================================
   LOAD THEME
========================================================= */

if (
    localStorage.getItem(
        "darkMode"
    ) === "true"
) {

    document.body.classList.add(
        "dark"
    );

}

updateThemeIcon();


/* =========================================================
   RENDER EVERYTHING
========================================================= */

function renderEverything() {

    renderTopics();

    renderProblems();

    updateDashboard();

    renderHeatmap();

    createCharts();

    updateComparison();

}


/* =========================================================
   START APPLICATION
========================================================= */

initializeTopics();

renderEverything();