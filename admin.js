document.addEventListener('DOMContentLoaded', () => {
    // Local storage helpers
    function parseJSON(key, fallback = null) {
        const value = localStorage.getItem(key);
        if (!value) return fallback;
        try {
            return JSON.parse(value);
        } catch {
            return fallback;
        }
    }

    function getStoredDB() {
        return parseJSON('schoolDB');
    }

    // Initial State & DB Simulation
    let db = getStoredDB() || {
        students: [
            { id: 1, name: "Ali Valiyev", phone: "+(998)-90 123-45-67", password: "student", groupId: 1, payment: false, paymentAmount: 0 }
        ],
        teachers: [
            { id: 1, name: "Aziza Karimova", phone: "+(998)-90 765-43-21", password: "teacher", subject: "Ingliz tili" }
        ],
        groups: [
            { id: 1, name: "Ingliz Tili Beginner", teacherId: 1, roomId: 1 }
        ],
        rooms: [
            { id: 1, name: "12-xona", capacity: 20 }
        ],
        adminPassword: "admin",
        loginHistory: []
    };

    function saveDB() {
        localStorage.setItem('schoolDB', JSON.stringify(db));
    }

    function pruneLoginHistory(store) {
        if (!store || !Array.isArray(store.loginHistory)) return;
        const maxAgeMs = 10 * 60 * 1000;
        const cutoff = Date.now() - maxAgeMs;
        store.loginHistory = store.loginHistory.filter(item => {
            const time = new Date(item.timestamp).getTime();
            return !Number.isNaN(time) && time >= cutoff;
        });
    }

    function pushAuthEvent(event) {
        const store = getStoredDB() || db;
        if (!Array.isArray(store.loginHistory)) store.loginHistory = [];
        store.loginHistory.unshift(event);
        pruneLoginHistory(store);
        if (store.loginHistory.length > 20) store.loginHistory = store.loginHistory.slice(0, 20);
        localStorage.setItem('schoolDB', JSON.stringify(store));
    }

    window.logout = function(e) {
        if (e && typeof e.preventDefault === 'function') e.preventDefault();
        const currentUser = parseJSON('currentUser');
        if (currentUser) {
                pushAuthEvent({
                type: 'logout',
                role: currentUser.role || 'user',
                userId: currentUser.id || null,
                    name: currentUser.name || "Noma'lum",
                phone: currentUser.phone || '',
                timestamp: new Date().toISOString()
            });
            localStorage.removeItem('currentUser');
        }
        window.location.href = 'login.html';
    };

    const currentUser = parseJSON('currentUser');
    if (!currentUser || currentUser.role !== 'admin') {
        window.location.href = 'login.html';
        return;
    }

    // Navigation Logic
    const navLinks = document.querySelectorAll('.nav-link[data-target]');
    const sections = document.querySelectorAll('.content-section');
    const pageTitle = document.getElementById('pageTitle');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            if(link.classList.contains('logout-btn')) return;
            e.preventDefault();
            // Active class toggling
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            // Section toggling
            const targetId = link.getAttribute('data-target');
            sections.forEach(sec => {
                sec.style.display = sec.id === targetId ? 'block' : 'none';
            });
            
            pageTitle.textContent = link.textContent.trim();
        });
    });

    // Render Functions
    function renderStudents() {
        const tbody = document.getElementById('studentsTableBody');
        tbody.innerHTML = '';
        db.students.forEach(st => {
            const group = db.groups.find(g => g.id == st.groupId);
            const groupName = group ? group.name : "Biriktirilmagan";
            const paymentBtn = st.payment 
                ? `<button onclick="togglePayment(${st.id})" style="background:#27ae60; color:white; border:none; padding:5px 10px; border-radius:4px; cursor:pointer;">To'langan</button>` 
                : `<button onclick="togglePayment(${st.id})" style="background:#e74c3c; color:white; border:none; padding:5px 10px; border-radius:4px; cursor:pointer;">To'lanmagan</button>`;
            const paymentAmount = st.paymentAmount ? `${st.paymentAmount} so'm` : `0 so'm`;
            tbody.innerHTML += `
                <tr>
                    <td>${st.name}</td>
                    <td>${st.phone}</td>
                    <td>${st.password || 'student'}</td>
                    <td><span class="role-badge role-student">${groupName}</span></td>
                    <td>${paymentAmount}</td>
                    <td>${paymentBtn}</td>
                    <td>
                        <button class="btn-danger" onclick="deleteRecord('students', ${st.id})"><i class="fa-solid fa-trash"></i></button>
                    </td>
                </tr>
            `;
        });
    }

    window.togglePayment = function(id) {
        const student = db.students.find(s => s.id === id);
        if(student) {
            student.payment = !student.payment;
            saveDB();
            updateAllViews();
        }
    };

    function renderTeachers() {
        const tbody = document.getElementById('teachersTableBody');
        tbody.innerHTML = '';
        db.teachers.forEach(tc => {
            tbody.innerHTML += `
                <tr>
                    <td>${tc.name}</td>
                    <td>${tc.phone}</td>
                    <td>${tc.password || 'teacher'}</td>
                    <td>${tc.subject}</td>
                    <td>
                        <button class="btn-danger" onclick="deleteRecord('teachers', ${tc.id})"><i class="fa-solid fa-trash"></i></button>
                    </td>
                </tr>
            `;
        });
    }

    function renderGroups() {
        const tbody = document.getElementById('groupsTableBody');
        tbody.innerHTML = '';
        db.groups.forEach(gr => {
            const teacher = db.teachers.find(t => t.id == gr.teacherId);
            const room = db.rooms.find(r => r.id == gr.roomId);
            tbody.innerHTML += `
                <tr>
                    <td><strong>${gr.name}</strong></td>
                    <td>${teacher ? teacher.name : "Biriktirilmagan"}</td>
                    <td>${room ? room.name : "Tanlanmagan"}</td>
                    <td>
                        <button class="btn-danger" onclick="deleteRecord('groups', ${gr.id})"><i class="fa-solid fa-trash"></i></button>
                    </td>
                </tr>
            `;
        });
    }

    function renderRooms() {
        const tbody = document.getElementById('roomsTableBody');
        tbody.innerHTML = '';
        db.rooms.forEach(rm => {
            tbody.innerHTML += `
                <tr>
                    <td>${rm.name}</td>
                    <td>${rm.capacity} kishi</td>
                    <td>
                        <button class="btn-danger" onclick="deleteRecord('rooms', ${rm.id})"><i class="fa-solid fa-trash"></i></button>
                    </td>
                </tr>
            `;
        });
    }

    function renderLoginHistory() {
        const historyList = document.getElementById('loginHistoryList');
        if (!historyList) return;
        historyList.innerHTML = '';
        const history = db.loginHistory || [];
        if (!history.length) {
            historyList.innerHTML = '<li>Hech qanday kirish/chiqish yozuvi mavjud emas.</li>';
            return;
        }
        history.slice(0, 8).forEach(item => {
            const time = new Date(item.timestamp);
            const formatted = time.toLocaleString('uz-UZ', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
            const action = item.type === 'login' ? 'kirdi' : 'chiqdi';
            historyList.innerHTML += `
                <li><strong>${item.name}</strong> (${item.role}) ${action} — ${formatted}</li>
            `;
        });
    }

    // Populate Select Dropdowns for Modals
    function populateSelects() {
        // Student form -> Select Group
        const sGroup = document.getElementById('studentGroup');
        sGroup.innerHTML = '<option value="">Guruhni tanlang...</option>';
        db.groups.forEach(g => sGroup.innerHTML += `<option value="${g.id}">${g.name}</option>`);

        // Group form -> Select Teacher & Room
        const gTeacher = document.getElementById('groupTeacher');
        gTeacher.innerHTML = '<option value="">O\'qituvchini tanlang...</option>';
        db.teachers.forEach(t => gTeacher.innerHTML += `<option value="${t.id}">${t.name}</option>`);

        const gRoom = document.getElementById('groupRoom');
        gRoom.innerHTML = '<option value="">Xonani tanlang...</option>';
        db.rooms.forEach(r => gRoom.innerHTML += `<option value="${r.id}">${r.name}</option>`);
    }

    function updateAllViews() {
        renderStudents();
        renderTeachers();
        renderGroups();
        renderRooms();
        renderLoginHistory();
        populateSelects();
        saveDB();
    }

    // Global Modal Functions
    window.openModal = function(modalId) {
        document.getElementById(modalId).classList.add('show');
    };
    window.closeModal = function(modalId) {
        document.getElementById(modalId).classList.remove('show');
    };

    // Global Delete
    window.deleteRecord = function(table, id) {
        if(confirm("Rostdan ham o'chirmoqchimisiz?")) {
            db[table] = db[table].filter(item => item.id !== id);
            
            if(table === 'groups') {
                db.students.forEach(s => { if(s.groupId == id) s.groupId = null; });
            }
            updateAllViews();
        }
    };

    // Form Submits
    document.getElementById('studentForm').addEventListener('submit', (e) => {
        e.preventDefault();
        db.students.push({
            id: Date.now(),
            name: document.getElementById('studentName').value,
            phone: document.getElementById('studentPhone').value,
            password: document.getElementById('studentPassword').value,
            groupId: document.getElementById('studentGroup').value,
            payment: false,
            paymentAmount: parseFloat(document.getElementById('studentPaymentAmount').value) || 0
        });
        e.target.reset();
        closeModal('studentModal');
        updateAllViews();
    });

    document.getElementById('teacherForm').addEventListener('submit', (e) => {
        e.preventDefault();
        db.teachers.push({
            id: Date.now(),
            name: document.getElementById('teacherName').value,
            phone: document.getElementById('teacherPhone').value,
            password: document.getElementById('teacherPassword').value,
            subject: document.getElementById('teacherSubject').value
        });
        e.target.reset();
        closeModal('teacherModal');
        updateAllViews();
    });

    document.getElementById('groupForm').addEventListener('submit', (e) => {
        e.preventDefault();
        db.groups.push({
            id: Date.now(),
            name: document.getElementById('groupName').value,
            teacherId: document.getElementById('groupTeacher').value,
            roomId: document.getElementById('groupRoom').value
        });
        e.target.reset();
        closeModal('groupModal');
        updateAllViews();
    });

    document.getElementById('roomForm').addEventListener('submit', (e) => {
        e.preventDefault();
        db.rooms.push({
            id: Date.now(),
            name: document.getElementById('roomName').value,
            capacity: document.getElementById('roomCapacity').value
        });
        e.target.reset();
        closeModal('roomModal');
        updateAllViews();
    });

    // Change Password
    document.getElementById('changePasswordForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const oldP = document.getElementById('oldPassword').value;
        const newP = document.getElementById('newPassword').value;
        const confP = document.getElementById('confirmNewPassword').value;

        if (oldP !== db.adminPassword) {
            alert(window.getTranslation ? window.getTranslation('alert.admin_old_password_wrong') : "Eski parol noto'g'ri!");
            return;
        }
        if (newP !== confP) {
            alert(window.getTranslation ? window.getTranslation('alert.admin_password_mismatch') : "Yangi parollar mos tushmadi!");
            return;
        }
        db.adminPassword = newP;
        saveDB();
        alert(window.getTranslation ? window.getTranslation('alert.admin_password_changed') : "Parol muvaffaqiyatli o'zgartirildi!");
        e.target.reset();
    });

    // Initial render
    updateAllViews();
});
