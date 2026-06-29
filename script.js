document.addEventListener('DOMContentLoaded', () => {
    const togglePassword = document.querySelector('.toggle-password');
    const passwordInput = document.querySelector('#password');
    const phoneInput = document.querySelector('#phone');
    const roleTabs = document.querySelectorAll('.role-tab');
    let currentRole = 'student';

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
                localStorage.setItem('currentUser', JSON.stringify(student));
                window.location.href = 'student_dashboard.html';
            } else {
                alert(window.getTranslation('alert.student_not_found') || "Xato! Bunday o'quvchi topilmadi yoki parol noto'g'ri.");
            }
        } else if (currentRole === 'teacher') {
            const teacher = db ? db.teachers.find(t => t.phone === phone && t.password === password) : null;
            if (teacher) {
                localStorage.setItem('currentUser', JSON.stringify(teacher));
                window.location.href = 'teacher_dashboard.html';
            } else {
                alert(window.getTranslation('alert.teacher_not_found') || "Xato! Bunday o'qituvchi topilmadi yoki parol noto'g'ri.");
            }
        } else if (currentRole === 'admin') {
            if (phone === '+(998)-90 999-99-99' && password === adminPass) {
                localStorage.setItem('currentUser', JSON.stringify({ role: 'admin', name: 'Admin' }));
                window.location.href = 'admin.html';
            } else {
                alert(window.getTranslation('alert.admin_wrong_password') || "Xato! Admin paroli noto'g'ri.");
            }
        }
    });
});
