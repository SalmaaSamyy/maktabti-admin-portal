/* Maktabti Admin Portal - Dynamic i18n Translation & Injection Engine
   Handles clean layout direction alterations, active language tracking, and DOM translation passes
*/

const MaktabtiComponents = {
    // القاموس الكامل لترجمة واجهة لوحة التحكم والأشرطة المشتركة لقاعدتك البياناتية
    dictionary: {
        en: {
            portal_title: "Maktabti Portal",
            dashboard: "Dashboard",
            manage_users: "Manage Users",
            global_audit: "Global Audit Log",
            categories: "Categories Desk",
            academic_materials: "Academic Materials",
            exams_archive: "Exams Archive",
            graduation_projects: "Graduation Projects",
            manual_circulation: "Manual Circulation",
            my_profile: "My Profile",
            logout: "Logout",
            logout_confirm: "Are you sure you want to log out?",
            supervisor_tier: "Library Supervisor",
            super_admin_tier: "Super Admin",
            
            // Dashboard Translations (Dynamic Pass)
            total_books: "Total Books & References",
            pending_projects: "Pending Projects Review",
            mobile_downloads: "Mobile App Downloads",
            demand_forecast: "Demand Forecast & Top Read Analytics",
            overdue_monitor: "Overdue Books Inventory Guard",

            // ... المفاتيح السابقة ...
            daily: "Daily",
            weekly: "Weekly",
            monthly: "Monthly",
            th_book: "Target Book",
            th_email: "Student Email",
            th_checkout: "Checkout Date",
            th_expected: "Expected Return",
            th_gap: "Delay Gap"


        },
        ar: {
            portal_title: "بوابة مكتبتي",
            dashboard: "لوحة التحكم والتحليلات",
            manage_users: "إدارة طاقم العمل",
            global_audit: "سجل الرقابة العام",
            categories: "إدارة الأقسام",
            academic_materials: "مخزن المواد الرقمية",
            exams_archive: "أرشيف الامتحانات",
            graduation_projects: "مشاريع التخرج",
            manual_circulation: "الاستعارة اليدوية",
            my_profile: "الملف الشخصي",
            logout: "تسجيل الخروج",
            logout_confirm: "هل أنت متأكد من رغبتك في تسجيل الخروج؟",
            supervisor_tier: "مشرف مكتبة",
            super_admin_tier: "مدير نظام أعلى",
            
            // Dashboard Translations (Dynamic Pass)
            total_books: "إجمالي المراجع والكتب",
            pending_projects: "المشاريع قيد المراجعة",
            mobile_downloads: "تحميلات الموبايل (التفاعل)",
            demand_forecast: "مخطط التنبؤ بالطلب والأكثر قراءة",
            overdue_monitor: "مراقبة عهدة المراجع المتأخرة (إنذار فوري)",

            // ... المفاتيح السابقة ...
            daily: "يومي",
            weekly: "أسبوعي",
            monthly: "شهري",
            th_book: "الكتاب المستهدف",
            th_email: "الإيميل الجامعي للمستعير",
            th_checkout: "تاريخ خروج العهدة",
            th_expected: "تاريخ الاستلام المجدول",
            th_gap: "فجوة التأخير"

        }
    },

    icons: {
        dashboard: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="9"></rect><rect x="14" y="3" width="7" height="5"></rect><rect x="14" y="12" width="7" height="9"></rect><rect x="3" y="16" width="7" height="5"></rect></svg>`,
        users: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>`,
        audit: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>`,
        categories: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="9" x2="20" y2="9"></line><line x1="4" y1="15" x2="20" y2="15"></line><line x1="10" y1="3" x2="8" y2="21"></line><line x1="16" y1="3" x2="14" y2="21"></line></svg>`,
        materials: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5z"></path></svg>`,
        exams: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>`,
        graduation: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"></path></svg>`,
        circulation: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>`,
        profile: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`,
        logout: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>`
    },

    renderAll: function() {
        const session = MaktabtiDB.data.currentSession;
        if (!session) return;

        const currentLang = MaktabtiDB.data.currentLang || 'en';
        const words = this.dictionary[currentLang];
        const currentPage = window.location.pathname.substring(window.location.pathname.lastIndexOf('/') + 1);

        // وضع الاتجاه المباشر على هيكل المستند بالكامل لقراءة قوانين المحاذاة الجديدة
        document.body.setAttribute('dir', currentLang === 'ar' ? 'rtl' : 'ltr');

        this.injectSidebar(session, currentPage, words);
        this.injectTopbar(session, words, currentLang);
        this.translatePageContent(words);
    },

    injectSidebar: function(session, currentPage, words) {
        const sidebarNode = document.createElement('aside');
        sidebarNode.className = 'sidebar';

        let menuItemsHTML = `
            <div class="sidebar-header">
                <span class="sidebar-brand">${words.portal_title}</span>
            </div>
            <ul class="sidebar-menu">
                <li class="sidebar-item">
                    <a href="dashboard.html" class="sidebar-link ${currentPage === 'dashboard.html' ? 'active' : ''}">
                        ${this.icons.dashboard} <span>${words.dashboard}</span>
                    </a>
                </li>
        `;

        if (session.role === 'super_admin') {
            menuItemsHTML += `
                <li class="sidebar-item">
                    <a href="users.html" class="sidebar-link ${currentPage === 'users.html' ? 'active' : ''}">
                        ${this.icons.users} <span>${words.manage_users}</span>
                    </a>
                </li>
                <li class="sidebar-item">
                    <a href="global-audit.html" class="sidebar-link ${currentPage === 'global-audit.html' ? 'active' : ''}">
                        ${this.icons.audit} <span>${words.global_audit}</span>
                    </a>
                </li>
            `;
        }

        menuItemsHTML += `
                <li class="sidebar-item">
                    <a href="categories.html" class="sidebar-link ${currentPage === 'categories.html' ? 'active' : ''}">
                        ${this.icons.categories} <span>${words.categories}</span>
                    </a>
                </li>
                <li class="sidebar-item">
                    <a href="materials.html" class="sidebar-link ${currentPage === 'materials.html' ? 'active' : ''}">
                        ${this.icons.materials} <span>${words.academic_materials}</span>
                    </a>
                </li>
                <li class="sidebar-item">
                    <a href="exams.html" class="sidebar-link ${currentPage === 'exams.html' ? 'active' : ''}">
                        ${this.icons.exams} <span>${words.exams_archive}</span>
                    </a>
                </li>
                <li class="sidebar-item">
                    <a href="graduation.html" class="sidebar-link ${currentPage === 'graduation.html' ? 'active' : ''}">
                        ${this.icons.graduation} <span>${words.graduation_projects}</span>
                    </a>
                </li>
                <li class="sidebar-item">
                    <a href="circulation.html" class="sidebar-link ${currentPage === 'circulation.html' ? 'active' : ''}">
                        ${this.icons.circulation} <span>${words.manual_circulation}</span>
                    </a>
                </li>
                <li class="sidebar-item" style="margin-top: 30px; border-top: 1px solid var(--border-color); padding-top: 15px;">
                    <a href="profile.html" class="sidebar-link ${currentPage === 'profile.html' ? 'active' : ''}">
                        ${this.icons.profile} <span>${words.my_profile}</span>
                    </a>
                </li>
                <li class="sidebar-item">
                    <a id="lnk-system-logout" class="sidebar-link" style="color: var(--error-red);">
                        ${this.icons.logout} <span>${words.logout}</span>
                    </a>
                </li>
            </ul>
        `;

        sidebarNode.innerHTML = menuItemsHTML;
        document.querySelector('.app-wrapper').prepend(sidebarNode);

        document.getElementById('lnk-system-logout').addEventListener('click', (e) => {
            e.preventDefault();
            if (confirm(words.logout_confirm)) {
                MaktabtiDB.data.currentSession = null;
                MaktabtiDB.save();
                window.location.href = '../index.html';
            }
        });
    },

    injectTopbar: function(session, words, currentLang) {
        const topbarNode = document.createElement('header');
        topbarNode.className = 'topbar';

        const pageTitle = document.title.split('-')[0].trim();
        const initialLetter = session.name ? session.name.charAt(0) : "A";
        const normalizedRoleText = session.role === 'super_admin' ? words.super_admin_tier : words.supervisor_tier;

        topbarNode.innerHTML = `
            <div class="page-title-context">
                <h2>${pageTitle}</h2>
            </div>
            
            <div style="display: flex; align-items: center; gap: 24px;">
                <div class="lang-switch-pill" style="display: flex; background: var(--card-background); border: 1px solid var(--border-color); padding: 2px; border-radius: 20px; cursor: pointer; user-select: none;">
                    <span style="padding: 4px 14px; font-size: 11px; font-weight: 800; border-radius: 16px; transition: all 0.2s; ${currentLang === 'ar' ? 'background: var(--teal); color: #fff;' : 'color: var(--text-secondary);'}">AR</span>
                    <span style="padding: 4px 14px; font-size: 11px; font-weight: 800; border-radius: 16px; transition: all 0.2s; ${currentLang === 'en' ? 'background: var(--teal); color: #fff;' : 'color: var(--text-secondary);'}">EN</span>
                </div>

                <div class="admin-identity-block">
                    <div class="admin-meta-info">
                        <span class="admin-name" style="display:block; font-weight:700;">${session.name}</span>
                        <span class="admin-role-tag">${normalizedRoleText}</span>
                    </div>
                    <div class="admin-avatar">${initialLetter}</div>
                </div>
            </div>
        `;

        document.querySelector('.main-content').prepend(topbarNode);

        topbarNode.querySelector('.lang-switch-pill').addEventListener('click', () => {
            MaktabtiDB.data.currentLang = currentLang === 'en' ? 'ar' : 'en';
            MaktabtiDB.save();
            window.location.reload();
        });
    },

    // دالة البحث الديناميكي لترجمة نصوص الصفحة المرفوعة
    translatePageContent: function(words) {
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (words[key]) {
                element.textContent = words[key];
            }
        });
    }
};

document.addEventListener('DOMContentLoaded', () => {
    MaktabtiComponents.renderAll();
});