/* Maktabti Admin Portal - Academic Materials & Examinations Log Engine
   Manages item classification, entry mutations, course code validation, and file exports
*/

const MaktabtiMaterials = {
    activeTab: 'all', // all, books, documents

    // 1. Core Initialization Framework
    init: function() {
        const currentPath = window.location.pathname;
        
        if (currentPath.includes('materials.html')) {
            this.renderCategoryCheckboxes('div-form-categories');
            this.renderMaterialsTable();
            this.bindMaterialEvents();
        } else if (currentPath.includes('exams.html')) {
            this.renderCategoryCheckboxes('div-exam-categories');
            this.renderExamsTable();
            this.bindExamEvents();
        }
    },

    // 2. Render Dynamic Checkbox Matrix for Many-to-Many Layouts
    renderCategoryCheckboxes: function(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = MaktabtiDB.data.categories.map(cat => `
            <label class="checkbox-token-item">
                <input type="checkbox" name="categories" value="${cat.id}">
                <span>${cat.name}</span>
            </label>
        `).join('');
    },

    // 3. Render and Synchronize the General Materials Data Grid Matrix
    renderMaterialsTable: function() {
        const tableBody = document.getElementById('tbody-materials');
        if (!tableBody) return;

        tableBody.innerHTML = '';

        // Filter inventory records based on chosen secondary category layout tabs
        let filteredData = MaktabtiDB.data.materials;
        if (this.activeTab === 'books') {
            filteredData = MaktabtiDB.data.materials.filter(m => m.level !== 'N/A'); // Materials with active levels simulate textbooks
        } else if (this.activeTab === 'documents') {
            filteredData = MaktabtiDB.data.materials.filter(m => m.level === 'N/A' || m.edition.includes('وثيقة'));
        }

        if (filteredData.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="6" class="text-center" style="color: var(--text-hint); padding: 30px;">لا توجد مواد أكاديمية مسجلة حالياً.</td></tr>`;
            return;
        }

        filteredData.forEach(item => {
            // Map structural category tags to physical readable strings
            const assetTags = item.categories.map(catId => {
                const lookup = MaktabtiDB.data.categories.find(c => c.id === catId);
                return lookup ? `<span class="pill-tag-token">${lookup.name}</span>` : '';
            }).join(' ');

            const trRow = document.createElement('tr');
            trRow.innerHTML = `
                <td><span style="font-family: monospace; font-weight:700;">${item.id}</span></td>
                <td>
                    <div style="font-weight: 700; color: var(--text-primary);">${item.title}</div>
                    <div style="font-size: 12px; color: var(--text-hint); font-weight: 600;">${item.edition}</div>
                </td>
                <td><div style="font-weight: 600;">${item.author}</div></td>
                <td><div class="tag-cloud-display">${assetTags}</div></td>
                <td><span class="badge ${item.level === 'Advanced' ? 'badge-danger' : 'badge-success'}">${item.level}</span></td>
                <td>
                    <div style="display:flex; gap:8px;">
                        <button class="btn btn-secondary" style="height:32px; padding:0 12px; font-size:12px;" onclick="MaktabtiMaterials.deleteMaterial('${item.id}')">حذف</button>
                    </div>
                </td>
            `;
            tableBody.appendChild(trRow);
        });
    },

    // 4. Handle Asset Item Removal Mutations
    deleteMaterial: function(id) {
        if (!confirm("هل أنت متأكد من رغبتك في حذف هذه المادة نهائياً من العهدة الرقمية؟")) return;

        const oldState = MaktabtiDB.data.materials.find(m => m.id === id);
        MaktabtiDB.data.materials = MaktabtiDB.data.materials.filter(m => m.id !== id);
        
        // Persist change and document transaction payload inside the audit trace system
        MaktabtiDB.logAction("حذف مادة أكاديمية", oldState, null);
        this.renderMaterialsTable();
    },

    // 5. Connect Dynamic Event Selectors for Materials Management Frontends
    bindMaterialEvents: function() {
        // Bind Sub-Navigation Filter Tabs
        const inventoryTabs = document.querySelectorAll('.inventory-type-tabs .inventory-tab');
        inventoryTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                inventoryTabs.forEach(t => t.classList.remove('active'));
                e.target.classList.add('active');
                this.activeTab = e.target.getAttribute('data-type');
                this.renderMaterialsTable();
            });
        });

        // Bind Data Creation Form Executions
        const form = document.getElementById('form-add-material');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                
                const checkedBoxes = document.querySelectorAll('#div-form-categories input[type="checkbox"]:checked');
                const selectedCategories = Array.from(checkedBoxes).map(cb => cb.value);

                if (selectedCategories.length === 0) {
                    alert("خطأ: يجب ربط المادة بقسم أكاديمي واحد على الأقل لتأمين ظهورها على الموبايل ابلكيشن.");
                    return;
                }

                const newMaterial = {
                    id: "MAT-" + Math.floor(107 + Math.random() * 900),
                    title: document.getElementById('txt-material-title').value,
                    author: document.getElementById('txt-material-author').value,
                    edition: document.getElementById('txt-material-edition').value, // Explicit Edition and Volume Field
                    categories: selectedCategories,
                    language: document.getElementById('sel-material-lang').value,
                    level: document.getElementById('sel-material-level').value,
                    downloads: 0
                };

                MaktabtiDB.data.materials.push(newMaterial);
                MaktabtiDB.logAction("إضافة مادة أكاديمية جديدة", null, newMaterial);
                
                form.reset();
                this.renderMaterialsTable();
                alert("تم تسجيل المادة بنجاح في العهدة الرقمية للمنصة.");
            });
        }

        // Bind CSV Export Action Link Elements
        const exportBtn = document.getElementById('btn-export-materials');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                const headers = ["ID", "Title", "Author", "Edition/Volume", "Language", "Skill Level", "Downloads"];
                const rows = MaktabtiDB.data.materials.map(m => [m.id, m.title, m.author, m.edition, m.language, m.level, m.downloads]);
                MaktabtiDB.exportToCSV("academic_materials", headers, rows);
            });
        }
    },

    // 6. Render and Synchronize the Examination Archive Layout View matrix
    renderExamsTable: function() {
        const tableBody = document.getElementById('tbody-exams');
        if (!tableBody) return;

        tableBody.innerHTML = '';

        if (MaktabtiDB.data.exams.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="7" class="text-center" style="color: var(--text-hint); padding: 30px;">لا توجد امتحانات مؤرشفة حالياً.</td></tr>`;
            return;
        }

        MaktabtiDB.data.exams.forEach(exam => {
            const trRow = document.createElement('tr');
            trRow.innerHTML = `
                <td><span style="font-family: monospace; font-weight:700; color: var(--text-secondary);">${exam.courseCode}</span></td>
                <td><div style="font-weight: 700;">${exam.courseName}</div></td>
                <td><span class="badge badge-success">${exam.category}</span></td>
                <td><div style="font-weight: 600;">${exam.academicYear} - ${exam.semester === 'First Semester' ? 'ترم أول' : 'ترم ثاني'}</div></td>
                <td><span style="font-family: monospace; font-weight:600;">${exam.calendarYear}</span></td>
                <td><div style="font-size: 13px; font-weight: 600;">${exam.instructor}</div></td>
                <td>
                    <button class="btn btn-secondary" style="height:32px; padding:0 12px; font-size:12px;" onclick="MaktabtiMaterials.deleteExam('${exam.id}')">حذف</button>
                </td>
            `;
            tableBody.appendChild(trRow);
        });
    },

    // 7. Handle Examination Destruction Mutations
    deleteExam: function(id) {
        if (!confirm("هل أنت متأكد من رغبتك في حذف هذا الامتحان نهائياً من الأرشيف التعليمي؟")) return;

        const oldState = MaktabtiDB.data.exams.find(e => e.id === id);
        MaktabtiDB.data.exams = MaktabtiDB.data.exams.filter(e => e.id !== id);
        
        MaktabtiDB.logAction("حذف امتحان من الأرشيف", oldState, null);
        this.renderExamsTable();
    },

    // 8. Connect Event Elements for the Exam Archiving Form Layout Interface
    bindExamEvents: function() {
        const form = document.getElementById('form-add-exam');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();

                const checkedBoxes = document.querySelectorAll('#div-exam-categories input[type="checkbox"]:checked');
                const selectedCategories = Array.from(checkedBoxes).map(cb => cb.value);
                const courseCodeValue = document.getElementById('txt-exam-code').value.trim().toUpperCase();

                if (selectedCategories.length === 0) {
                    alert("خطأ: يجب تعيين قسم أكاديمي واحد للمادة على الأقل.");
                    return;
                }

                // Construct and register new examination payload entry
                const newExam = {
                    id: "EXM-" + Math.floor(503 + Math.random() * 900),
                    courseCode: courseCodeValue, // Rigid Institutional Unique Identifier Code Check
                    courseName: document.getElementById('txt-exam-name').value,
                    categories: selectedCategories,
                    category: document.getElementById('sel-exam-type').value,
                    academicYear: document.getElementById('sel-exam-year').value,
                    semester: document.getElementById('sel-exam-semester').value,
                    calendarYear: parseInt(document.getElementById('txt-exam-cal-year').value),
                    instructor: document.getElementById('txt-exam-instructor').value
                };

                MaktabtiDB.data.exams.push(newExam);
                MaktabtiDB.logAction("أرشفة امتحان مادة جديد", null, newExam);

                form.reset();
                this.renderExamsTable();
                alert("تمت أرشفة وتثبيت أوراق الامتحان بنجاح داخل المستودع المركزي.");
            });
        }

        // Bind Examination Data Export Script Commands
        const exportBtn = document.getElementById('btn-export-exams');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                const headers = ["Course Code", "Subject Name", "Category", "Academic Year", "Semester", "Administered Year", "Instructor Professor"];
                const rows = MaktabtiDB.data.exams.map(e => [e.courseCode, e.courseName, e.category, e.academicYear, e.semester, e.calendarYear, e.instructor]);
                MaktabtiDB.exportToCSV("examinations_archive", headers, rows);
            });
        }
    }
};

// Bind execution sequences cleanly to DOM readiness events
document.addEventListener('DOMContentLoaded', () => {
    MaktabtiMaterials.init();
});