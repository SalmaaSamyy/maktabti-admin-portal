/* Maktabti Admin Portal - Client-Side Access Guard & Routing Engine
   Enforces Role-Based Access Control (RBAC) boundaries across pages
*/

const MaktabtiRouter = {
    // 1. Define highly sensitive admin layout boundaries
    superAdminPages: [
        'users.html',
        'global-audit.html'
    ],

    // 2. Intercept and evaluate current session clearance level
    checkAccess: function() {
        const currentPath = window.location.pathname;
        const currentPage = currentPath.substring(currentPath.lastIndexOf('/') + 1);
        
        // Fetch session data directly from our central mock engine
        const session = MaktabtiDB.data.currentSession;

        // If no active administrative session exists, force logout boundary containment
        if (!session && currentPage !== 'index.html') {
            window.location.href = '../index.html';
            return;
        }

        // Evaluate RBAC violation parameters
        if (this.superAdminPages.includes(currentPage)) {
            if (session.role !== 'super_admin') {
                // If a standard supervisor attempts breach, redirect immediately to fallback dashboard
                alert("Security Access Violation: This area is strictly reserved for Super Administrators.");
                window.location.href = 'dashboard.html';
            }
        }
    },

    // 3. Secured programmatic viewport navigation wrapper
    navigateTo: function(pageName) {
        const session = MaktabtiDB.data.currentSession;
        
        if (this.superAdminPages.includes(pageName) && session.role !== 'super_admin') {
            alert("Unauthorized Action: Your profile clearance tier is insufficient.");
            return;
        }
        
        window.location.href = pageName;
    }
};

// Execute access runtime valuation immediately upon DOM resource assembly
document.addEventListener('DOMContentLoaded', () => {
    MaktabtiRouter.checkAccess();
});