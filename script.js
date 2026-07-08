document.addEventListener('DOMContentLoaded', () => {
    const togglePassword = document.querySelector('.toggle-password');
    const passwordInput = document.querySelector('#password');
    const phoneInput = document.querySelector('#phone');
    const roleTabs = document.querySelectorAll('.role-tab');
    const registerPanel = document.getElementById('registerPanel');
    const resetPanel = document.getElementById('resetPanel');
    const registerLink = document.getElementById('registerLink');
    const forgotPasswordLink = document.getElementById('forgotPasswordLink');
    const registerBack = document.getElementById('registerBack');
    const resetBack = document.getElementById('resetBack');
    const registerForm = document.getElementById('registerForm');
    const resetForm = document.getElementById('resetForm');
    let currentRole = 'student';

    function getOrCreateDB() {
        const dbStr = localStorage.getItem('schoolDB');
        if (!dbStr) {
            const initial = { students: [], teachers: [], groups: [], rooms: [], adminPassword: 'admin', loginHistory: [] };
            localStorage.setItem('schoolDB', JSON.stringify(initial));
            return initial;
        }
        try {
            return JSON.parse(dbStr);
        } catch {
            const initial = { students: [], teachers: [], groups: [], rooms: [], adminPassword: 'admin', loginHistory: [] };
            localStorage.setItem('schoolDB', JSON.stringify(initial));
            return initial;
        }
    }

    function saveDB(db) {
        localStorage.setItem('schoolDB', JSON.stringify(db));
    }

    function showPanel(panel) {
        if (registerPanel) registerPanel.classList.add('hidden');
        if (resetPanel) resetPanel.classList.add('hidden');
        if (panel) panel.classList.remove('hidden');
    }

    function hideAllPanels() {
        showPanel(null);
    }

    // Role tabs logic
    roleTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            roleTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentRole = tab.dataset.role;
        });
    });

    // Toggle password visibility
    togglePassword.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        
        // Toggle icon
        this.classList.toggle('fa-eye');
        this.classList.toggle('fa-eye-slash');
    });

    // Simple phone number formatter (just for visual representation)
    phoneInput.addEventListener('input', function(e) {
        let val = this.value.replace(/\D/g, '');
        if (val.startsWith('998')) {
            val = val.substring(3);
        }
        
        if (val.length > 0) {
            let formatted = '+(998)-';
            if (val.length > 0) formatted += val.substring(0, 2);
            if (val.length > 2) formatted += ' ' + val.substring(2, 5);
            if (val.length > 5) formatted += '-' + val.substring(5, 7);
            if (val.length > 7) formatted += '-' + val.substring(7, 9);
            
            // Allow user to delete properly
            if (e.inputType !== 'deleteContentBackward') {
                this.value = formatted;
            }
        } else {
            this.value = '';
        }
    });

    // Register and password recovery panel toggles
    if (registerLink) {
        registerLink.addEventListener('click', (e) => {
            e.preventDefault();
            showPanel(registerPanel);
        });
    }
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', (e) => {
            e.preventDefault();
            showPanel(resetPanel);
        });
    }
    if (registerBack) {
        registerBack.addEventListener('click', () => hideAllPanels());
    }
    if (resetBack) {
        resetBack.addEventListener('click', () => hideAllPanels());
    }

    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('register-name').value.trim();
            const role = document.getElementById('register-role').value;
            const phone = document.getElementById('register-phone').value.trim();
            const password = document.getElementById('register-password').value;
            const confirmPassword = document.getElementById('register-password-confirm').value;

            if (password !== confirmPassword) {
                alert('Parollar mos emas.');
                return;
            }
            if (!name || !phone || !password) {
                alert('Iltimos, barcha maydonlarni to‘ldiring.');
                return;
            }

            const db = getOrCreateDB();
            const existingUser = [...db.students, ...db.teachers].find(user => user.phone === phone);
            if (existingUser) {
                alert('Bu telefon raqami allaqachon ishlatilgan.');
                return;
            }

            const newUser = { id: Date.now(), name, phone, password, loginTime: null };
            if (role === 'teacher') {
                newUser.subject = 'General';
                db.teachers.push(newUser);
            } else {
                newUser.groupId = null;
                newUser.payment = false;
                newUser.paymentAmount = 0;
                db.students.push(newUser);
            }
            saveDB(db);
            alert('Roʻyxatdan oʻtish muvaffaqiyatli yakunlandi. Iltimos, endi tizimga kiring.');
            registerForm.reset();
            hideAllPanels();
        });
    }

    if (resetForm) {
        resetForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const phone = document.getElementById('reset-phone').value.trim();
            const password = document.getElementById('reset-password').value;
            const confirmPassword = document.getElementById('reset-password-confirm').value;

            if (password !== confirmPassword) {
                alert('Yangi parollar mos emas.');
                return;
            }
            if (!phone || !password) {
                alert('Iltimos, barcha maydonlarni to‘ldiring.');
                return;
            }

            const db = getOrCreateDB();
            const student = db.students.find(s => s.phone === phone);
            const teacher = db.teachers.find(t => t.phone === phone);
            if (student) {
                student.password = password;
            } else if (teacher) {
                teacher.password = password;
            } else if (phone === '+(998)-90 999-99-99') {
                db.adminPassword = password;
            } else {
                alert('Bunday foydalanuvchi topilmadi.');
                return;
            }
            saveDB(db);
            alert('Parol muvaffaqiyatli yangilandi.');
            resetForm.reset();
            hideAllPanels();
        });
    }

    // Test uchun vaqtinchalik login tekshiruvi
    const loginForm = document.querySelector('#loginForm');
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault(); // Sahifa yangilanishini to'xtatish
        
        const phone = phoneInput.value;
        const password = passwordInput.value;
        
        // Parolni localStorage dan o'qib olish (agar admin o'zgartirgan bo'lsa)
        const dbStr = localStorage.getItem('schoolDB');
        const db = dbStr ? JSON.parse(dbStr) : null;
        const adminPass = db ? db.adminPassword : 'admin';

        // Rolga qarab tekshirish
        if (currentRole === 'student') {
            const student = db ? db.students.find(s => s.phone === phone && s.password === password) : null;
            if (student) {
                const loginTime = new Date().toISOString();
                const currentUser = { ...student, role: 'student', loginTime };
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                if (typeof pushAuthEvent === 'function') {
                    pushAuthEvent({ type: 'login', role: 'student', userId: student.id, name: student.name, phone: student.phone, timestamp: loginTime });
                }
                window.location.href = 'student_dashboard.html';
            } else {
                alert(window.getTranslation('alert.student_not_found') || "Xato! Bunday o'quvchi topilmadi yoki parol noto'g'ri.");
            }
        } else if (currentRole === 'teacher') {
            const teacher = db ? db.teachers.find(t => t.phone === phone && t.password === password) : null;
            if (teacher) {
                const loginTime = new Date().toISOString();
                const currentUser = { ...teacher, role: 'teacher', loginTime };
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                if (typeof pushAuthEvent === 'function') {
                    pushAuthEvent({ type: 'login', role: 'teacher', userId: teacher.id, name: teacher.name, phone: teacher.phone, timestamp: loginTime });
                }
                window.location.href = 'teacher_dashboard.html';
            } else {
                alert(window.getTranslation('alert.teacher_not_found') || "Xato! Bunday o'qituvchi topilmadi yoki parol noto'g'ri.");
            }
        } else if (currentRole === 'admin') {
            if (phone === '+(998)-90 999-99-99' && password === adminPass) {
                const loginTime = new Date().toISOString();
                const currentUser = { role: 'admin', name: 'Admin', loginTime };
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                if (typeof pushAuthEvent === 'function') {
                    pushAuthEvent({ type: 'login', role: 'admin', userId: null, name: 'Admin', phone: phone, timestamp: loginTime });
                }
                window.location.href = 'admin.html';
            } else {
                alert(window.getTranslation('alert.admin_wrong_password') || "Xato! Admin paroli noto'g'ri.");
            }
        }
    });
});
