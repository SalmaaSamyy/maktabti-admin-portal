/* Maktabti Admin Portal - Centralized State Management Engine
   Simulates database storage, state mutations, and transactional snapshot logging
*/

const MaktabtiDB = {
    // 1. Core Core Storage Entities
    storageKey: 'maktabti_mock_db',

    data: {
        currentSession: {
            id: "ADM-2026-09",
            name: "د. أحمد محمود",
            email: "admin@library.edu.eg",
            role: "super_admin" // super_admin or supervisor
        },
        
        users: [
            { id: "ADM-2026-01", name: "أحمد محمد", email: "ahmed.m@university.edu", role: "supervisor", status: "active", joinDate: "2025-09-15" },
            { id: "ADM-2026-02", name: "فاطمة علي", email: "fatima.a@library.edu.eg", role: "supervisor", status: "active", joinDate: "2024-03-20" },
            { id: "ADM-2026-03", name: "محمود حسن", email: "mahmoud.h@university.edu", role: "supervisor", status: "inactive", joinDate: "2025-10-05" },
            { id: "ADM-2026-04", name: "سارة محمد", email: "sarah.m@university.edu", role: "supervisor", status: "blocked", joinDate: "2025-11-12" },
            { id: "ADM-2026-09", name: "د. أحمد محمود", email: "admin@library.edu.eg", role: "super_admin", status: "active", joinDate: "2023-01-10" }
        ],

        categories: [
            { id: "CAT-01", name: "ذكاء اصطناعي (AI)" },
            { id: "CAT-02", name: "تحليل البيانات (Data Analysis)" },
            { id: "CAT-03", name: "تطوير الويب (Web Development)" },
            { id: "CAT-04", name: "علوم الحاسب (Computer Science)" },
            { id: "CAT-05", name: "هندسة البرمجيات (Software Engineering)" }
        ],

        materials: [
            { id: "MAT-101", title: "Clean Code", author: "Robert C. Martin", edition: "1st Edition, Vol 2", categories: ["CAT-04", "CAT-05"], language: "English", level: "Advanced", downloads: 2100 },
            { id: "MAT-102", title: "Data Structures & Algorithms", author: "Robert Lafore", edition: "2nd Edition", categories: ["CAT-04"], language: "English", level: "Advanced", downloads: 880 },
            { id: "MAT-103", title: "Python for Data Analysis", author: "Wes McKinney", edition: "3rd Edition, 2023", categories: ["CAT-01", "CAT-02"], language: "English", level: "Intermediate", downloads: 1250 },
            { id: "MAT-104", title: "Machine Learning Basics", author: "Andrew Ng", edition: "Vol 1", categories: ["CAT-01"], language: "English", level: "Beginner", downloads: 1880 },
            { id: "MAT-105", title: "Database Design", author: "C.J. Date", edition: "8th Edition", categories: ["CAT-02", "CAT-04"], language: "English", level: "Intermediate", downloads: 750 },
            { id: "MAT-106", title: "Web Development with React", author: "Multiple Authors", edition: "2025 Revision", categories: ["CAT-03"], language: "English", level: "Intermediate", downloads: 1650 }
        ],

        exams: [
            { id: "EXM-501", courseCode: "AI-402", courseName: "ذكاء اصطناعي متقدم", categories: ["CAT-01"], category: "Final", academicYear: "4th Year", semester: "First Semester", calendarYear: 2026, instructor: "د. أحمد محمود" },
            { id: "EXM-502", courseCode: "SE-301", courseName: "هندسة البرمجيات", categories: ["CAT-05"], category: "Midterm", academicYear: "3rd Year", semester: "Second Semester", calendarYear: 2025, instructor: "د. فاطمة علي" }
        ],

        projects: [
            { id: "PRJ-901", title: "نظام إدارة المكتبة الإلكترونية", teamMembers: ["ahmed.m@university.edu", "sami@university.edu"], supervisors: ["د. أحمد محمود"], year: 2026, major: "علوم الحاسب", description: "منصة تنظيمية متكاملة لربط واجهات الويب بالموبايل ابلكيشن.", status: "pending", feedback: "", github: "https://github.com/example/library", banner: "cover.jpg", path: "student" },
            { id: "PRJ-902", title: "Python Advanced Programming", teamMembers: ["fatima.a@library.edu.eg"], supervisors: ["د. محمد علي"], year: 2025, major: "هندسة البرمجيات", description: "مشروع عملي لتبسيط هياكل البيانات المتقدمة.", status: "approved", feedback: "", github: "", banner: "", path: "supervisor" }
        ],

        circulation: [
            { id: "CIR-701", bookId: "MAT-103", studentEmail: "ahmed.m@university.edu", borrowDate: "2026-06-01", expectedReturnDate: "2026-06-08", returned: false, returnedDate: "" },
            { id: "CIR-702", bookId: "MAT-101", studentEmail: "sarah.m@university.edu", borrowDate: "2026-05-10", expectedReturnDate: "2026-05-17", returned: false, returnedDate: "" },
            { id: "CIR-703", bookId: "MAT-105", studentEmail: "mahmoud.h@university.edu", borrowDate: "2026-06-05", expectedReturnDate: "2026-06-12", returned: true, returnedDate: "2026-06-10" }
        ],

        auditLogs: [
            { id: "LOG-801", adminId: "ADM-2026-09", adminName: "د. أحمد محمود", action: "إنشاء تصنيف جديد", timestamp: "2026-06-11 09:30", oldState: "N/A", newState: "اسم القسم: تطوير الموبايل" }
        ]
    },

    // 2. Database Initialization Lifecycle
    init: function() {
        if (!localStorage.getItem(this.storageKey)) {
            this.save();
        } else {
            this.data = JSON.parse(localStorage.getItem(this.storageKey));
        }
    },

    save: function() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.data));
    },

    // 3. Immutable Security Audit Logging Engine (Snapshot Difference Capture)
    logAction: function(actionText, oldStateObj, newStateObj) {
        const logEntry = {
            id: "LOG-" + Math.floor(100000 + Math.random() * 900000),
            adminId: this.data.currentSession.id,
            adminName: this.data.currentSession.name,
            action: actionText,
            timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
            oldState: oldStateObj ? JSON.stringify(oldStateObj) : "N/A",
            newState: newStateObj ? JSON.stringify(newStateObj) : "N/A"
        };
        this.data.auditLogs.unshift(logEntry);
        this.save();
    },

    // 4. Global External Data Serialization System (CSV Generator Engine)
    exportToCSV: function(filename, headers, rows) {
        let csvContent = "data:text/csv;charset=utf-8,\uFEFF"; // Include BOM for Arabic character rendering support
        csvContent += headers.join(",") + "\r\n";
        
        rows.forEach(function(rowArray) {
            let row = rowArray.map(value => `"${String(value).replace(/"/g, '""')}"`).join(",");
            csvContent += row + "\r\n";
        });
        
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", filename + "_export_" + new Date().toISOString().substring(0,10) + ".csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
};

// Initialize DB Immediately on script runtime execution
MaktabtiDB.init();