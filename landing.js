// Lightbox funksiyalari
function openLightbox(imgSrc) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    lightboxImg.src = imgSrc;
    lightbox.classList.add('active');
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.classList.remove('active');
}

// Escape tugmasi bilan yopish
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeLightbox();
    }
});

document.addEventListener('DOMContentLoaded', () => {
    
    // Initialize AOS Animation Library
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        offset: 100
    });

    // Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile Menu Toggle
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
    const closeMenu = document.getElementById('close-menu');
    const mobileLinks = document.querySelectorAll('.mobile-links a');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            mobileMenu.classList.add('active');
        });
    }

    if (closeMenu) {
        closeMenu.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
        });
    }

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
        });
    });

    // Theme Toggle (Dark/Light Mode)
    const themeToggleBtn = document.getElementById('theme-toggle');
    const body = document.body;
    const icon = themeToggleBtn.querySelector('i');

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('saminovTheme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    }

    themeToggleBtn.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        if (body.classList.contains('dark-mode')) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
            localStorage.setItem('saminovTheme', 'dark');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
            localStorage.setItem('saminovTheme', 'light');
        }
    });

    // Animated Counter for Statistics
    const counters = document.querySelectorAll('.counter');
    let hasCounted = false;

    const runCounters = () => {
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const speed = 200; // lower is faster
            const inc = target / speed;
            
            let count = 0;
            const updateCount = () => {
                count += inc;
                if (count < target) {
                    counter.innerText = Math.ceil(count);
                    setTimeout(updateCount, 10);
                } else {
                    counter.innerText = target + (target > 500 ? '+' : '');
                }
            };
            updateCount();
        });
    };

    // Trigger counters when scrolled into view
    const statsSection = document.querySelector('.statistics');
    window.addEventListener('scroll', () => {
        if (!hasCounted && statsSection) {
            const rect = statsSection.getBoundingClientRect();
            if (rect.top < window.innerHeight) {
                runCounters();
                hasCounted = true;
            }
        }
    });

    // Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const navHeight = navbar.offsetHeight;
                window.scrollTo({
                    top: targetElement.offsetTop - navHeight,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Handle Admission Form Submit
    const applyForm = document.getElementById('applyForm');
    if (applyForm) {
        applyForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Show premium success animation/alert
            const btn = applyForm.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;
            
                    // Use translated submitted text if available
                const submittedText = (translations['form.submitted'] && translations['form.submitted'][localStorage.getItem('saminovLang') || 'uz']) || 'Application Submitted!';
                btn.innerHTML = '<i class="fa-solid fa-circle-check"></i> ' + submittedText;
                btn.style.backgroundColor = '#27ae60';
                btn.style.borderColor = '#27ae60';
                btn.style.color = 'white';
                
                setTimeout(() => {
                    applyForm.reset();
                    btn.innerHTML = originalText;
                    btn.style = '';
                    const alertMsg = (translations['alert.application_received'] && translations['alert.application_received'][localStorage.getItem('saminovLang') || 'uz']) || "Thank you! Your application has been received. Our admission team will contact you shortly.";
                    alert(alertMsg);
                }, 3000);
        });
    }

    // Handle Newsletter Submit
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const subMsg = (translations['alert.subscribed'] && translations['alert.subscribed'][localStorage.getItem('saminovLang') || 'uz']) || 'Subscribed successfully!';
            alert(subMsg);
        });
    }

    // Language / i18n Switcher (Uzbek / Russian / English)
    const langButtons = document.querySelectorAll('.lang-btn');
    const supportedLangs = ['uz', 'ru', 'en'];

    // Translation map for data-i18n keys
    const translations = {
        'nav.home': { uz: "Bosh sahifa", ru: "Главная", en: "Home" },
        'nav.about': { uz: "Biz haqimizda", ru: "О нас", en: "About" },
        'nav.courses': { uz: "Kurslar", ru: "Курсы", en: "Courses" },
        'nav.teachers': { uz: "O'qituvchilar", ru: "Учителя", en: "Teachers" },
        'nav.gallery': { uz: "Galereya", ru: "Галерея", en: "Gallery" },
        'nav.contact': { uz: "Kontakt", ru: "Контакт", en: "Contact" },
        'nav.login': { uz: "Kirish", ru: "Войти", en: "Login" },
        'nav.apply': { uz: "Ariza yuborish", ru: "Подать заявку", en: "Apply Now" },

        'hero.badge': { uz: "Premium Ta'lim", ru: "Премиум образование", en: "Premium Education" },
        'hero.title': { uz: "Kelajakni\nshakllantirish", ru: "Формируем\nбудущее", en: "Shaping the\nFuture of Education" },
        'hero.subtitle': { uz: "Saminov School ga xush kelibsiz.", ru: "Добро пожаловать в школу Саминов.", en: "Welcome to Saminov School, where innovation meets tradition." },
        'hero.apply': { uz: "Ariza yuborish", ru: "Подать заявку", en: "Apply Now" },
        'hero.learn': { uz: "Batafsil", ru: "Подробнее", en: "Learn More" },

        'stat.students': { uz: "Baxtli Talabalar", ru: "Довольные ученики", en: "Happy Students" },
        'stat.teachers': { uz: "Tajriba O'qituvchilar", ru: "Опытные учителя", en: "Expert Teachers" },
        'stat.awards': { uz: "Mukofotlar", ru: "Награды", en: "Awards Won" },
        'stat.years': { uz: "Yillar Tajribasi", ru: "Лет опыта", en: "Years of Excellence" },

        'about.subtitle': { uz: "Maktabimiz haqida", ru: "О нашей школе", en: "About Our School" },
        'about.title': { uz: "Sizga mos joyni kashf eting", ru: "Откройте место, где вы можете принадлежать", en: "Discover a Place Where You Can Belong" },
        'about.text': { uz: "Saminov School nafaqat akademik, balki shaxsiy rivojlanishni ham tarbiyalaydi.", ru: "Школа Саминов воспитывает не только академическое, но и личное развитие.", en: "At Saminov School, we believe in nurturing not just the academic potential, but the overall character of our students." },
        'feature.1': { uz: "Zamonaviy va interaktiv sinflar", ru: "Современные и интерактивные классы", en: "Modern & Interactive Classrooms" },
        'feature.2': { uz: "Global standartdagi o'quv dasturi", ru: "Учебная программа международного уровня", en: "Global Standard Curriculum" },
        'feature.3': { uz: "Eksklyuziv mashg'ulotlar", ru: "Акцент на внеурочной деятельности", en: "Focus on Extracurricular Activities" },

        'courses.subtitle': { uz: "Dasturimiz", ru: "Наша программа", en: "Our Curriculum" },
        'courses.title': { uz: "Tavsiya etilgan kurslar", ru: "Рекомендуемые курсы", en: "Featured Courses" },
        'course1.title': { uz: "Kompyuter Ilmi", ru: "Информатика", en: "Computer Science" },
        'course1.desc': { uz: "Zamonaviy dasturlash va veb rivojlantirish.", ru: "Современное программирование и веб-разработка.", en: "Modern programming, web development, and AI fundamentals for the digital age." },
        'course2.title': { uz: "Ilmiy Fanlar", ru: "Науки", en: "Advanced Sciences" },
        'course2.desc': { uz: "Fizika, kimyo va biologiya amaliy va nazariy.", ru: "Практическая и теоретическая физика, химия и биология.", en: "Practical and theoretical knowledge in Physics, Chemistry, and Biology." },
        'course3.title': { uz: "Tillar", ru: "Языки", en: "Global Languages" },
        'course3.desc': { uz: "Ingliz, ispan va mandarin tillari.", ru: "Английский, испанский и мандарин.", en: "Master English, Spanish, and Mandarin with native-speaking professionals." },
        'course4.title': { uz: "San'at va Dizayn", ru: "Искусство и дизайн", en: "Arts & Design" },
        'course4.desc': { uz: "Vizual san'at va dizayn.", ru: "Визуальное искусство и дизайн.", en: "Express your creativity through visual arts, digital design, and music." },

        'teachers.subtitle': { uz: "Bizning fakultet", ru: "Наш факультет", en: "Our Faculty" },
        'teachers.title': { uz: "Ekspert o'qituvchilar", ru: "Опытные преподаватели", en: "Meet Our Expert Teachers" },

        'gallery.subtitle': { uz: "Kampus hayoti", ru: "Жизнь кампуса", en: "Campus Life" },
        'gallery.title': { uz: "Foto galereya", ru: "Фотогалерея", en: "Our Photo Gallery" },

        'testimonials.subtitle': { uz: "Mijozlar fikri", ru: "Отзывы", en: "Testimonials" },
        'testimonials.title': { uz: "Ota-onalar nima deyishadi", ru: "Что говорят родители", en: "What Parents Say" },
        'testimonial.text': { uz: '"Saminov School - togri tanlov edi."', ru: '"Школа Саминов — лучший выбор."', en: '"Choosing Saminov School was the best decision for our child."' },

        'admission.title': { uz: "Bog'lanish va Qabul", ru: "Контакты и прием", en: "Contact & Admission" },
        'admission.p': { uz: "Savollaringiz bormi? Qabul jarayonida yordam beramiz.", ru: "Есть вопросы? Мы поможем вам с приемом.", en: "Have questions? We're here to help you through the admission process." },
        'contact.location': { uz: "Manzil", ru: "Адрес", en: "Location" },
        'contact.phone': { uz: "Telefon", ru: "Телефон", en: "Phone" },
        'contact.email': { uz: "Elektron pochta", ru: "Электронная почта", en: "Email" },
        'map.caption': { uz: "Bizning manzil (Xarita)", ru: "Наш адрес (Карта)", en: "Our location (Map)" },

        'form.title': { uz: "Qabul uchun ariza", ru: "Заявка на прием", en: "Apply for Admission" },
        'form.first': { uz: "Ism", ru: "Имя", en: "First Name" },
        'form.last': { uz: "Familiya", ru: "Фамилия", en: "Last Name" },
        'form.email': { uz: "Elektron pochta", ru: "Электронная почта", en: "Email Address" },
        'form.phone': { uz: "Telefon raqam", ru: "Номер телефона", en: "Phone Number" },
        'form.course': { uz: "Kursni tanlang", ru: "Выберите курс", en: "Select Course" },
        'form.message': { uz: "Xabar / Savollar", ru: "Сообщение / Вопросы", en: "Message / Questions" },
        'form.submit': { uz: "Yuborish", ru: "Отправить", en: "Submit Application" },

        'footer.quick': { uz: "Tezkor havolalar", ru: "Быстрые ссылки", en: "Quick Links" },
        'footer.resources': { uz: "Resurslar", ru: "Ресурсы", en: "Resources" },
        'footer.news': { uz: "Yangiliklar", ru: "Новости", en: "Newsletter" },
        'footer.copyright': { uz: "© 2026 Saminov School. Barcha huquqlar himoyalangan.", ru: "© 2026 Saminov School. Все права защищены.", en: "© 2026 Saminov School. All rights reserved." },

        // login & dashboard
        'login.phone_label': { uz: "Telefon raqam", ru: "Номер телефона", en: "Phone Number" },
        'login.phone_placeholder': { uz: "+(998)-_ _ _ - _ _ - _ _", ru: "+(998)-_ _ _ - _ _ - _ _", en: "+(998)-_ _ _ - _ _ - _ _" },
        'login.password_label': { uz: "Parol", ru: "Пароль", en: "Password" },
        'login.password_placeholder': { uz: "***************", ru: "***************", en: "***************" },
        'login.button': { uz: "KIRISH", ru: "ВОЙТИ", en: "LOGIN" },
        'nav.logout': { uz: "Chiqish", ru: "Выйти", en: "Logout" },
        'admin.students': { uz: "O'quvchilar", ru: "Студенты", en: "Students" },
        'dash.welcome': { uz: "Tizimga kirdingiz! (Tez kunda ishga tushadi)", ru: "Вы вошли в систему! (Скоро запустится)", en: "You are logged in! (Launching soon)" },

        // Admin UI strings
        'admin.teachers': { uz: "O'qituvchilar", ru: "Учителя", en: "Teachers" },
        'admin.groups': { uz: "Guruhlar", ru: "Группы", en: "Groups" },
        'admin.rooms': { uz: "Xonalar", ru: "Аудитории", en: "Rooms" },
        'admin.settings': { uz: "Sozlamalar", ru: "Настройки", en: "Settings" },
        'admin.students_list': { uz: "O'quvchilar ro'yxati", ru: "Список студентов", en: "Students List" },
        'admin.add_student': { uz: "O'quvchi qo'shish", ru: "Добавить студента", en: "Add Student" },
        'admin.teachers_list': { uz: "O'qituvchilar ro'yxati", ru: "Список преподавателей", en: "Teachers List" },
        'admin.add_teacher': { uz: "O'qituvchi qo'shish", ru: "Добавить преподавателя", en: "Add Teacher" },
        'admin.groups_list': { uz: "Guruhlar ro'yxati", ru: "Список групп", en: "Groups List" },
        'admin.add_group': { uz: "Guruh qo'shish", ru: "Добавить группу", en: "Add Group" },
        'admin.rooms_list': { uz: "Xonalar ro'yxati", ru: "Список аудиторий", en: "Rooms List" },
        'admin.add_room': { uz: "Xona qo'shish", ru: "Добавить аудиторию", en: "Add Room" },
        'admin.change_password': { uz: "Parolni o'zgartirish", ru: "Сменить пароль", en: "Change Password" },
        'admin.old_password': { uz: "Eski parol", ru: "Старый пароль", en: "Old Password" },
        'admin.old_password_placeholder': { uz: "Eski parolni kiriting", ru: "Введите старый пароль", en: "Enter old password" },
        'admin.new_password': { uz: "Yangi parol", ru: "Новый пароль", en: "New Password" },
        'admin.new_password_placeholder': { uz: "Yangi parolni kiriting", ru: "Введите новый пароль", en: "Enter new password" },
        'admin.new_password_confirm': { uz: "Yangi parolni takrorlang", ru: "Подтвердите новый пароль", en: "Confirm new password" },
        'admin.new_password_confirm_placeholder': { uz: "Yangi parolni qayta kiriting", ru: "Повторно введите новый пароль", en: "Re-enter new password" },
        'admin.change_btn': { uz: "O'zgartirish", ru: "Изменить", en: "Change" },
        'admin.student_name': { uz: "Ism Familiya", ru: "ФИО", en: "Name" },
        'admin.student_phone': { uz: "Telefon", ru: "Телефон", en: "Phone" },
        'admin.student_password': { uz: "Parol", ru: "Пароль", en: "Password" },
        'admin.student_password_placeholder': { uz: "Kirish uchun parol", ru: "Пароль для входа", en: "Login password" },
        'admin.student_group': { uz: "Guruhni tanlang", ru: "Выберите группу", en: "Select group" },
        'admin.save': { uz: "Saqlash", ru: "Сохранить", en: "Save" },
        'admin.teacher_name': { uz: "Ism Familiya", ru: "ФИО", en: "Name" },
        'admin.teacher_phone': { uz: "Telefon", ru: "Телефон", en: "Phone" },
        'admin.teacher_password': { uz: "Parol", ru: "Пароль", en: "Password" },
        'admin.teacher_password_placeholder': { uz: "Kirish uchun parol", ru: "Пароль для входа", en: "Login password" },
        'admin.teacher_subject': { uz: "Fan/Yo'nalish", ru: "Предмет/Направление", en: "Subject" },
        'admin.select_subject': { uz: "Fanni tanlang...", ru: "Выберите предмет...", en: "Select subject..." }
    };
    // Additional translations added programmatically
    translations['about.discover'] = { uz: "Kurslarni kashf eting", ru: "Откройте курсы", en: "Discover Courses" };
    translations['learn.more'] = { uz: "Batafsil", ru: "Подробнее", en: "Learn more" };
    translations['newsletter.placeholder'] = { uz: "Sizning email manzilingiz", ru: "Ваш адрес электронной почты", en: "Your email address" };
    translations['footer.about'] = { uz: "Biz haqimizda", ru: "О нас", en: "About Us" };
    translations['footer.student'] = { uz: "Talabalar portali", ru: "Портал студентов", en: "Student Portal" };
    translations['footer.parent'] = { uz: "Ota-onalar portali", ru: "Портал родителей", en: "Parent Portal" };
    translations['footer.calendar'] = { uz: "Akademik taqvim", ru: "Академический календарь", en: "Academic Calendar" };
    translations['footer.library'] = { uz: "Kutubxona", ru: "Библиотека", en: "Library" };
    translations['footer.resources'] = translations['footer.resources'] || { uz: "Resurslar", ru: "Ресурсы", en: "Resources" };
    // Alerts and dynamic messages
    translations['alert.subscribed'] = { uz: "Obuna muvaffaqiyatli!", ru: "Подписка успешно!", en: "Subscribed successfully!" };
    translations['alert.application_received'] = { uz: "Rahmat! Sizning arizangiz qabul qilindi. Tez orada biz bilan bog'lanamiz.", ru: "Спасибо! Ваша заявка получена. Мы свяжемся с вами скоро.", en: "Thank you! Your application has been received. Our admission team will contact you shortly." };
    translations['form.submitted'] = { uz: "Ariza yuborildi!", ru: "Заявка отправлена!", en: "Application Submitted!" };
    translations['alert.student_not_found'] = { uz: "Xato! Bunday o'quvchi topilmadi yoki parol noto'g'ri.", ru: "Ошибка! Студент не найден или неверный пароль.", en: "Error! Student not found or password is incorrect." };
    translations['alert.teacher_not_found'] = { uz: "Xato! Bunday o'qituvchi topilmadi yoki parol noto'g'ri.", ru: "Ошибка! Преподаватель не найден или неверный пароль.", en: "Error! Teacher not found or password is incorrect." };
    translations['alert.admin_wrong_password'] = { uz: "Xato! Admin paroli noto'g'ri.", ru: "Ошибка! Неверный пароль администратора.", en: "Error! Admin password is incorrect." };
    translations['alert.admin_old_password_wrong'] = { uz: "Eski parol noto'g'ri!", ru: "Старый пароль неверный!", en: "Old password is incorrect!" };
    translations['alert.admin_password_mismatch'] = { uz: "Yangi parollar mos tushmadi!", ru: "Новые пароли не совпадают!", en: "New passwords do not match!" };
    translations['alert.admin_password_changed'] = { uz: "Parol muvaffaqiyatli o'zgartirildi!", ru: "Пароль успешно изменен!", en: "Password changed successfully!" };
    // Student dashboard text
    translations['student.profile'] = { uz: "Mening profilim", ru: "Мой профиль", en: "My Profile" };
    translations['student.info'] = { uz: "Ma'lumotlaringiz", ru: "Ваша информация", en: "Your Information" };
    translations['student.group_label'] = { uz: "Guruh:", ru: "Группа:", en: "Group:" };
    translations['student.teacher_label'] = { uz: "O'qituvchi:", ru: "Преподаватель:", en: "Teacher:" };
    translations['student.payment_status'] = { uz: "Joriy oylik to'lov holati:", ru: "Текущий статус оплаты:", en: "Current payment status:" };
    translations['student.welcome_prefix'] = { uz: "O'quvchi:", ru: "Студент:", en: "Student:" };
    translations['student.unassigned'] = { uz: "Biriktirilmagan", ru: "Не назначен", en: "Unassigned" };
    translations['student.no_group'] = { uz: "Guruh yo'q", ru: "Группы нет", en: "No group" };
    translations['student.payment_paid'] = { uz: "To'langan", ru: "Оплачено", en: "Paid" };
    translations['student.payment_due'] = { uz: "To'lanmagan (Qarzdorlik mavjud)", ru: "Не оплачено (есть задолженность)", en: "Unpaid (Debt pending)" };
    // Teacher dashboard text
    translations['teacher.groups_title'] = { uz: "Mening guruhlarim", ru: "Мои группы", en: "My Groups" };
    translations['teacher.students_payments'] = { uz: "O'quvchilar va To'lovlar ro'yxati", ru: "Список учеников и оплат", en: "Students & Payments" };
    translations['teacher.student_name'] = { uz: "O'quvchi Ismi", ru: "Имя ученика", en: "Student Name" };
    translations['teacher.phone'] = { uz: "Telefon", ru: "Телефон", en: "Phone" };
    translations['teacher.group'] = { uz: "Guruh", ru: "Группа", en: "Group" };
    translations['teacher.payment_status'] = { uz: "To'lov holati", ru: "Статус оплаты", en: "Payment Status" };
    translations['teacher.welcome_prefix'] = { uz: "O'qituvchi:", ru: "Преподаватель:", en: "Teacher:" };
    translations['teacher.payment_paid'] = { uz: "To'langan", ru: "Оплачено", en: "Paid" };
    translations['teacher.payment_unpaid'] = { uz: "To'lanmagan", ru: "Не оплачено", en: "Unpaid" };
    function applyTranslations(lang) {
        // translate innerHTML for data-i18n
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            const entry = translations[key];
            if (entry && entry[lang]) {
                el.innerHTML = entry[lang];
            }
        });
        // translate placeholders
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            const entry = translations[key];
            if (entry && entry[lang]) el.placeholder = entry[lang];
        });
        // translate values (for inputs/buttons using value)
        document.querySelectorAll('[data-i18n-value]').forEach(el => {
            const key = el.getAttribute('data-i18n-value');
            const entry = translations[key];
            if (entry && entry[lang]) el.value = entry[lang];
        });
    }

    function setLanguage(lang) {
        if (!supportedLangs.includes(lang)) lang = 'uz';
        // Apply i18n translations
        applyTranslations(lang);
        // Fallback: toggle any existing [data-lang] spans (legacy)
        document.querySelectorAll('[data-lang]').forEach(el => {
            el.style.display = el.getAttribute('data-lang') === lang ? '' : 'none';
        });
        // Update navbar select if present
        const langSelect = document.getElementById('lang-select');
        if (langSelect) langSelect.value = lang;
        localStorage.setItem('saminovLang', lang);
    }

    // Wire up language buttons and initialize
    if (langButtons.length) {
        langButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const lang = btn.getAttribute('data-lang');
                setLanguage(lang);
            });
        });
    }

    // Initialize language from localStorage or default to Uzbek
    const savedLang = localStorage.getItem('saminovLang') || 'uz';
    setLanguage(savedLang);

    // If there's a navbar select, listen for changes
    const langSelect = document.getElementById('lang-select');
    if (langSelect) {
        langSelect.addEventListener('change', (e) => {
            setLanguage(e.target.value);
        });
    }

    // Also translate any placeholders or dynamic texts immediately on init
    // (applyTranslations already called in setLanguage during init)

    // Expose helper to get translated string from other scripts
    window.getTranslation = function(key) {
        const lang = localStorage.getItem('saminovLang') || 'uz';
        const entry = translations[key];
        if (entry && entry[lang]) return entry[lang];
        return '';
    };
});
