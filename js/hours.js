import { auth, db } from "./firebase-config.js";
import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDocs,
    orderBy,
    query,
    serverTimestamp,
    where
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

const form = document.getElementById("hours-form");
const entriesBody = document.getElementById("hours-entries");
const monthTotalEl = document.getElementById("total-month");
const allTotalEl = document.getElementById("total-all");
const nameEl = document.getElementById("member-name");
const logoutButton = document.getElementById("logout-button");
const messageEl = document.getElementById("hours-message");
const durationPreview = document.getElementById("duration-preview");
const adminPanel = document.getElementById("admin-panel");
const adminTotalsBody = document.getElementById("admin-totals");
const adminEntriesBody = document.getElementById("admin-entries");
const adminFilter = document.getElementById("admin-member-filter");
const adminExportButton = document.getElementById("admin-export");

const ADMIN_EMAILS = [
    "coach@example.com"
];

let adminEntries = [];
let membersById = {};

const showMessage = (text, isError = false) => {
    if (!messageEl) return;
    messageEl.textContent = text;
    messageEl.classList.toggle("error", isError);
};

const parseDuration = (start, end) => {
    if (!start || !end) return 0;
    const [startHour, startMinute] = start.split(":").map(Number);
    const [endHour, endMinute] = end.split(":").map(Number);
    const startMinutes = startHour * 60 + startMinute;
    const endMinutes = endHour * 60 + endMinute;
    const diff = endMinutes - startMinutes;
    if (diff <= 0) return 0;
    return Math.round((diff / 60) * 10) / 10;
};

const updateDurationPreview = () => {
    if (!durationPreview) return;
    const start = document.getElementById("log-start").value;
    const end = document.getElementById("log-end").value;
    const duration = parseDuration(start, end);
    durationPreview.textContent = `Duration: ${duration.toFixed(1)} hours`;
};

const renderEntries = (entries) => {
    if (!entriesBody) return;
    entriesBody.innerHTML = "";

    entries.forEach((entry) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${entry.date}</td>
            <td>${entry.start} - ${entry.end}</td>
            <td><span class="pill">${entry.category}</span></td>
            <td>${entry.duration.toFixed(1)}</td>
            <td>${entry.notes || ""}</td>
            <td><button class="link-button" data-id="${entry.id}">Delete</button></td>
        `;
        entriesBody.appendChild(row);
    });

    entriesBody.querySelectorAll("button[data-id]").forEach((button) => {
        button.addEventListener("click", async () => {
            const entryId = button.getAttribute("data-id");
            await deleteDoc(doc(db, "hours", entryId));
            await loadEntries(auth.currentUser.uid);
        });
    });
};

const updateTotals = (entries) => {
    const now = new Date();
    const currentMonth = now.toISOString().slice(0, 7);

    const monthTotal = entries
        .filter((entry) => entry.date.startsWith(currentMonth))
        .reduce((sum, entry) => sum + entry.duration, 0);
    const allTotal = entries.reduce((sum, entry) => sum + entry.duration, 0);

    monthTotalEl.textContent = monthTotal.toFixed(1);
    allTotalEl.textContent = allTotal.toFixed(1);
};

const loadEntries = async (uid) => {
    const hoursQuery = query(
        collection(db, "hours"),
        where("uid", "==", uid),
        orderBy("date", "desc")
    );

    const snapshot = await getDocs(hoursQuery);
    const entries = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data()
    }));

    renderEntries(entries);
    updateTotals(entries);
};

const isAdmin = (user) => {
    if (!user?.email) return false;
    return ADMIN_EMAILS.includes(user.email.toLowerCase());
};

const renderAdminTotals = (totals) => {
    if (!adminTotalsBody) return;
    adminTotalsBody.innerHTML = "";

    totals.forEach((item) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.month.toFixed(1)}</td>
            <td>${item.all.toFixed(1)}</td>
        `;
        adminTotalsBody.appendChild(row);
    });
};

const getAdminFilteredEntries = () => {
    const filterValue = adminFilter?.value || "all";
    return filterValue === "all"
        ? adminEntries
        : adminEntries.filter((entry) => entry.uid === filterValue);
};

const renderAdminEntries = () => {
    if (!adminEntriesBody) return;
    const filtered = getAdminFilteredEntries();

    adminEntriesBody.innerHTML = "";
    filtered.forEach((entry) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${entry.date}</td>
            <td>${entry.memberName}</td>
            <td><span class="pill">${entry.category}</span></td>
            <td>${entry.duration.toFixed(1)}</td>
            <td>${entry.notes || ""}</td>
            <td><button class="link-button" data-id="${entry.id}">Delete</button></td>
        `;
        adminEntriesBody.appendChild(row);
    });

    adminEntriesBody.querySelectorAll("button[data-id]").forEach((button) => {
        button.addEventListener("click", async () => {
            const entryId = button.getAttribute("data-id");
            await deleteDoc(doc(db, "hours", entryId));
            await loadAdminData();
        });
    });
};

const escapeCsv = (value) => {
    if (value === null || value === undefined) return "";
    const stringValue = String(value);
    if (/[",\n]/.test(stringValue)) {
        return `"${stringValue.replace(/"/g, '""')}"`;
    }
    return stringValue;
};

const downloadCsv = (rows, filename) => {
    const csvContent = rows.map((row) => row.map(escapeCsv).join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
};

const exportAdminCsv = () => {
    const filtered = getAdminFilteredEntries();
    if (filtered.length === 0) {
        showMessage("No entries to export.", true);
        return;
    }

    const filterValue = adminFilter?.value || "all";
    const filterLabel = filterValue === "all"
        ? "all-members"
        : (membersById[filterValue]?.name || membersById[filterValue]?.email || filterValue)
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9-]/g, "");

    const today = new Date().toISOString().slice(0, 10);
    const filename = `hours-${filterLabel}-${today}.csv`;

    const rows = [
        ["Date", "Member", "Category", "Start", "End", "Hours", "Notes"]
    ];

    filtered.forEach((entry) => {
        rows.push([
            entry.date,
            entry.memberName,
            entry.category,
            entry.start || "",
            entry.end || "",
            entry.duration.toFixed(1),
            entry.notes || ""
        ]);
    });

    downloadCsv(rows, filename);
    showMessage("CSV downloaded.");
};

const loadAdminData = async () => {
    const membersSnap = await getDocs(collection(db, "members"));
    membersById = {};
    const memberOptions = [
        { id: "all", label: "All members" }
    ];

    membersSnap.forEach((docSnap) => {
        const data = docSnap.data();
        membersById[docSnap.id] = data;
        memberOptions.push({
            id: docSnap.id,
            label: data.name || data.email || docSnap.id
        });
    });

    if (adminFilter) {
        adminFilter.innerHTML = "";
        memberOptions.forEach((option) => {
            const opt = document.createElement("option");
            opt.value = option.id;
            opt.textContent = option.label;
            adminFilter.appendChild(opt);
        });
    }

    const hoursSnap = await getDocs(query(collection(db, "hours"), orderBy("date", "desc")));
    adminEntries = hoursSnap.docs.map((docSnap) => {
        const data = docSnap.data();
        const member = membersById[data.uid] || {};
        return {
            id: docSnap.id,
            ...data,
            memberName: member.name || member.email || "Unknown"
        };
    });

    const currentMonth = new Date().toISOString().slice(0, 7);
    const totalsMap = {};

    adminEntries.forEach((entry) => {
        if (!totalsMap[entry.uid]) {
            totalsMap[entry.uid] = {
                name: entry.memberName,
                month: 0,
                all: 0
            };
        }
        totalsMap[entry.uid].all += entry.duration;
        if (entry.date.startsWith(currentMonth)) {
            totalsMap[entry.uid].month += entry.duration;
        }
    });

    const totals = Object.values(totalsMap).sort((a, b) => b.all - a.all);
    renderAdminTotals(totals);
    renderAdminEntries();
};

form?.addEventListener("submit", async (event) => {
    event.preventDefault();
    showMessage("");

    const date = document.getElementById("log-date").value;
    const start = document.getElementById("log-start").value;
    const end = document.getElementById("log-end").value;
    const category = document.getElementById("log-category").value;
    const notes = document.getElementById("log-notes").value.trim();
    const duration = parseDuration(start, end);

    if (duration <= 0) {
        showMessage("End time must be after start time.", true);
        return;
    }

    try {
        await addDoc(collection(db, "hours"), {
            uid: auth.currentUser.uid,
            date,
            start,
            end,
            category,
            notes,
            duration,
            createdAt: serverTimestamp()
        });

        form.reset();
        updateDurationPreview();
        showMessage("Entry saved!");
        await loadEntries(auth.currentUser.uid);
    } catch (error) {
        showMessage(error.message, true);
    }
});

logoutButton?.addEventListener("click", async () => {
    await signOut(auth);
    window.location.href = "login.html";
});

["log-start", "log-end"].forEach((id) => {
    const input = document.getElementById(id);
    input?.addEventListener("input", updateDurationPreview);
});

onAuthStateChanged(auth, async (user) => {
    if (!user) {
        window.location.href = "login.html";
        return;
    }

    nameEl.textContent = user.displayName ? `${user.displayName}'s Hours` : "Member Hours";
    updateDurationPreview();
    await loadEntries(user.uid);

    if (isAdmin(user)) {
        if (adminPanel) adminPanel.hidden = false;
        await loadAdminData();
    } else if (adminPanel) {
        adminPanel.hidden = true;
    }
});

adminFilter?.addEventListener("change", () => {
    renderAdminEntries();
});

adminExportButton?.addEventListener("click", () => {
    exportAdminCsv();
});
