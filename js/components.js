/* Maktabti Admin Portal - Shared Components Injection Engine
   Dynamically renders Sidebar and Topbar shells with active RBAC state filtering
*/

const MaktabtiComponents = {
    // 1. Unified SVG Icon Map Asset Definitions
    icons: {
        dashboard: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="9"></rect><rect x="14" y="3" width="7" height="5"></rect><rect x="14" y="12" width="7" height="9"></rect><rect x="3" y="16" width="7" height="5"></rect></svg>`,
        users: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>`,
        audit: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>`,
        categories: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="9" x2="20" y2="9"></line><line x1="4" y1="15" x2="20" y2="15"></line><line x1="10" y1="3" x2="8" y2="21"></line><line x1="16" y1="3" x2="14" y2="21"></line></svg>`,
        materials: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5z"></path></svg>`,
        exams: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>`,
        graduation: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"></path></svg>`,
        circulation: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>`,
        profile: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`,
        logout: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>`
    },

    // 2. Render and Mount Global Elements to the Active View Matrix
    renderAll: function() {
        const session = MaktabtiDB.data.currentSession;
        if (!session) return; // Halt if no operational session context is mounted

        const currentPage = window.location.pathname.substring(window.location.pathname.lastIndexOf('/') + 1);

        this.injectSidebar(session, currentPage);
        this.injectTopbar(session);
    },

    // 3. Structural Assembly of the Left-hand Navigation Drawer Shell
    injectSidebar: function(session, currentPage) {
        const sidebarNode = document.createElement('aside');
        sidebarNode.className = 'sidebar';

        let menuItemsHTML = `
            <div class="sidebar-header">
                <span class="sidebar-brand">مكتبتي Portal</span>
            </div>
            <ul class="sidebar-menu">
                <li class="sidebar-item">
                    <a href="dashboard.html" class="sidebar-link ${currentPage === 'dashboard.html' ? 'active' : ''}">
                        ${this.icons.dashboard} <span>لوحة التحكم</span>
                    </a>
                </li>
        `;

        // RBAC Conditional Evaluation Block for Super Admin Content Segregation
        if (session.role === 'super_admin') {
            menuItemsHTML += `
                <li class="sidebar-item">
                    <a href="users.html" class="sidebar-link ${currentPage === 'users.html' ? 'active' : ''}">
                        ${this.icons.users} <span>إدارة المستخدمين</span>
                    </a>
                </li>
                <li class="sidebar-item">
                    <a href="global-audit.html" class="sidebar-link ${currentPage === 'global-audit.html' ? 'active' : ''}">
                        ${this.icons.audit} <span>سجل الرقابة العام</span>
                    </a>
                </li>
            `;
        }

        // Shared Standard Operations Navigation Target Grouping
        menuItemsHTML += `
                <li class="sidebar-item">
                    <a href="categories.html" class="sidebar-link ${currentPage === 'categories.html' ? 'active' : ''}">
                        ${this.icons.categories} <span>إدارة الأقسام</span>
                    </a>
                </li>
                <li class="sidebar-item">
                    <a href="materials.html" class="sidebar-link ${currentPage === 'materials.html' ? 'active' : ''}">
                        ${this.icons.materials} <span>مخزن المواد الأكاديمية</span>
                    </a>
                </li>
                <li class="sidebar-item">
                    <a href="exams.html" class="sidebar-link ${currentPage === 'exams.html' ? 'active' : ''}">
                        ${this.icons.exams} <span>أرشيف الامتحانات</span>
                    </a>
                </li>
                <li class="sidebar-item">
                    <a href="graduation.html" class="sidebar-link ${currentPage === 'graduation.html' ? 'active' : ''}">
                        ${this.icons.graduation} <span>مشاريع التخرج</span>
                    </a>
                </li>
                <li class="sidebar-item">
                    <a href="circulation.html" class="sidebar-link ${currentPage === 'circulation.html' ? 'active' : ''}">
                        ${this.icons.circulation} <span>الاستعارة اليدوية</span>
                    </a>
                </li>
                <li class="sidebar-item" style="margin-top: 40px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 15px;">
                    <a href="profile.html" class="sidebar-link ${currentPage === 'profile.html' ? 'active' : ''}">
                        ${this.icons.profile} <span>الملف الشخصي</span>
                    </a>
                </li>
                <li class="sidebar-item">
                    <a id="lnk-system-logout" class="sidebar-link" style="color: #ff8888;">
                        ${this.icons.logout} <span>تسجيل الخروج</span>
                    </a>
                </li>
            </ul>
        `;

        sidebarNode.innerHTML = menuItemsHTML;
        document.querySelector('.app-wrapper').prepend(sidebarNode);

        // Bind Session Destroyer Context Link Event
        document.getElementById('lnk-system-logout').addEventListener('click', (e) => {
            e.preventDefault();
            if (confirm("هل أنت متأكد من رغبتك في تسجيل الخروج من النظام؟")) {
                MaktabtiDB.data.currentSession = null;
                MaktabtiDB.save();
                window.location.href = '../index.html';
            }
        });
    },

    // 4. Structural Assembly of Upper Horizontal Control Header Panel
    injectTopbar: function(session) {
        const topbarNode = document.createElement('header');
        topbarNode.className = 'topbar';

        const pageTitle = document.title.split('-')[0].trim();
        const initialLetter = session.name ? session.name.charAt(0) : "A";
        const normalizedRoleText = session.role === 'super_admin' ? 'Super Admin' : 'Supervisor';

        topbarNode.innerHTML = `
            <div class="page-title-context">
                <h2>${pageTitle}</h2>
            </div>
            <div class="admin-identity-block">
                <div class="admin-meta-info" style="text-align: right;">
                    <span class="admin-name">${session.name}</span>
                    <span class="admin-role-tag">${normalizedRoleText}</span>
                </div>
                <div class="admin-avatar">
                    ${initialLetter}
                </div>
            </div>
        `;

        document.querySelector('.main-content').prepend(topbarNode);
        
        // Add absolute layout offset safety compensation to main layout container scroll shell
        document.querySelector('.page-container').style.marginTop = 'var(--topbar-height)';
    }
};

// Bind component instantiation cycle directly to DOM layout settlement events
document.addEventListener('DOMContentLoaded', () => {
    MaktabtiComponents.renderAll();
});