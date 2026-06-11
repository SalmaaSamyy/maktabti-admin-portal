/* Maktabti Admin Portal - Graduation Projects Module Logic Engine
   Manages dual-entry paths, validation workflows, feedback push compilation, and legacy archiving filters
*/

const MaktabtiGraduation = {
    activeViewTab: 'student', // student (Path B) or supervisor (Path A)
    selectedTargetProjectId: null,

    // 1. Core Initialization Framework
    init: function() {
        if (!window.location.pathname.includes('graduation.html')) return;
        
        this.renderProjectsList();
        this.bindGraduationEvents();
    },

    // 2. Render and Synchronize the Dual-Entry Project Views with Year Filters
    renderProjectsList: function() {
        const container = document.getElementById('div-projects-list');
        if (!container) return;

        container.innerHTML = '';

        // Fetch dynamic legacy year filter selection token value
        const yearFilterElement = document.getElementById('sel-project-year-filter');
        const selectedYear = yearFilterElement ? yearFilterElement.value : 'all';

        // Filter projects by current path tracking layer (Student Submission vs Direct Supervisor Upload)
        let filteredProjects = MaktabtiDB.data.projects.filter(p => p.path === this.activeViewTab);

        // Apply legacy chronological filtering logic safely
        if (selectedYear !== 'all') {
            filteredProjects = filteredProjects.filter(p => p.year === parseInt(selectedYear));
        }

        if (filteredProjects.length === 0) {
            container.innerHTML = `<div class="text-center" style="grid-column: span 2; background:#fff; border:1px solid var(--border-color); padding: 40px; border-radius: var(--border-radius-lg); color: var(--text-hint); font-weight:600;">لا توجد مشاريع تخرج مدرجة ضمن هذا التصنيف حالياً.</div>`;
            return;
        }

        filteredProjects.forEach(project => {
            const card = document.createElement('div');
            card.className = 'project-card-item';

            // Establish conditional status indicator configurations
            let statusBadgeClass = 'badge-pending';
            let statusText = 'قيد المراجعة والتدقيق';
            if (project.status === 'approved') {
                statusBadgeClass = 'badge-success';
                statusText = 'معتمد ومنشور';
            } else if (project.status === 'rejected') {
                statusBadgeClass = 'badge-danger';
                statusText = 'مرفوض - يحتاج تعديل';
            }

            card.innerHTML = `
                <div class="project-card-header">
                    <div class="project-title-area">
                        <span class="badge ${statusBadgeClass}" style="margin-bottom: 8px;">${statusText}</span>
                        <h3>${project.title}</h3>
                        <div class="project-metadata-row">
                            <div class="meta-field-item">سنة التخرج: <span class="highlight">${project.year}</span></div>
                            <div class="meta-field-item">التخصص: <span class="highlight">${project.major}</span></div>
                        </div>
                    </div>
                    ${project.status === 'pending' ? `
                        <div style="display: flex; gap: 8px;">
                            <button class="btn btn-primary" style="height:34px; padding:0 14px; font-size:13px;" onclick="MaktabtiGraduation.approveProject('${project.id}')">اعتماد ونشر</button>
                            <button class="btn btn-danger" style="height:34px; padding:0 14px; font-size:13px;" onclick="MaktabtiGraduation.openRejectionModal('${project.id}')">رفض الطلب</button>
                        </div>
                    ` : ''}
                </div>
                
                <p style="font-size: 14px; color: var(--text-primary); line-height: 1.5; text-align: justify;">${project.description}</p>
                
                <div class="project-roster-section">
                    <div class="roster-group">
                        <h4>فريق العمل الأكاديمي</h4>
                        <div class="roster-list">
                            ${project.teamMembers.map(email => `<span class="roster-member-tag">${email}</span>`).join('')}
                        </div>
                    </div>
                    <div class="roster-group">
                        <h4>هيئة الإشراف دكاترة</h4>
                        <div class="roster-list">
                            ${project.supervisors.map(name => `<span class="roster-member-tag" style="font-family:inherit;">${name}</span>`).join('')}
                        </div>
                    </div>
                </div>

                ${project.feedback ? `
                    <div style="background-color: rgba(239, 68, 68, 0.05); border: 1px solid rgba(239, 68, 68, 0.15); padding: 12px; border-radius: var(--border-radius-md); font-size: 13px;">
                        <strong style="color: var(--error-red);">ملاحظات الرفض المرسلة للموبايل:</strong> ${project.feedback}
                    </div>
                ` : ''}
            `;

            container.appendChild(card);
        });
    },

    // 3. Path B: Authorize and Push Project Deliverables to Mobile App Archive
    approveProject: function(id) {
        if (!confirm("هل أنت متأكد من مراجعة كافة البيانات واعتماد هذا المشروع ونشره للطلاب عبر تطبيق الموبايل؟")) return;

        const project = MaktabtiDB.data.projects.find(p => p.id === id);
        if (project) {
            const oldState = { ...project };
            project.status = 'approved';
            project.feedback = ''; // Clear stale friction logs
            
            MaktabtiDB.save();
            MaktabtiDB.logAction("اعتماد مشروع تخرج", oldState, project);
            
            this.renderProjectsList();
            alert("تم اعتماد المشروع ونشره بنجاح في الأرشيف الرقمي المتاح للطلاب.");
        }
    },

    // 4. Path B: Open Mandated Rejection Modal Context Box Layer
    openRejectionModal: function(id) {
        this.selectedTargetProjectId = id;
        const modalBackdrop = document.getElementById('modal-rejection-context');
        if (modalBackdrop) {
            modalBackdrop.classList.add('active');
            document.getElementById('txt-rejection-feedback').focus();
        }
    },

    closeRejectionModal: function() {
        const modalBackdrop = document.getElementById('modal-rejection-context');
        if (modalBackdrop) {
            modalBackdrop.classList.remove('active');
            document.getElementById('txt-rejection-feedback').value = '';
            this.selectedTargetProjectId = null;
        }
    },

    // 5. Submit Rejection Logic & Compile Push Payload Structure
    submitRejectionPayload: function() {
        const feedbackTextField = document.getElementById('txt-rejection-feedback');
        const feedbackText = feedbackTextField.value.trim();

        if (!feedbackText) {
            alert("خطأ حتمي: يجب كتابة تفاصيل التغذية الراجعة (Feedback) وتوضيح سبب الرفض ليتم إرساله للطلاب على الموبايل.");
            return;
        }

        const project = MaktabtiDB.data.projects.find(p => p.id === this.selectedTargetProjectId);
        if (project) {
            const oldState = { ...project };
            project.status = 'rejected';
            project.feedback = feedbackText;

            MaktabtiDB.save();
            
            // Log mutation inside security tracking systems
            MaktabtiDB.logAction("رفض مشروع تخرج وإرسال فيدباك", oldState, project);
            
            // Simulating API Core compilation payload for downstream Mobile App Push services
            console.log(`[PUSH ENGINE] Compiling notification token payload to team: ${JSON.stringify(project.teamMembers)}. Reason: ${feedbackText}`);

            this.closeRejectionModal();
            this.renderProjectsList();
            alert("تم تسجيل الرفض بنجاح وشحن إشعار التغذية الراجعة (Notification Feedback) مباشرة إلى هواتف الطلاب.");
        }
    },

    // 6. Connect Interface Action Bindings for Forms, Filters, and Tables
    bindGraduationEvents: function() {
        // Toggle Dual-Entry Tab Selection Controls
        const viewTabs = document.querySelectorAll('.inventory-type-tabs .inventory-tab');
        viewTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                viewTabs.forEach(t => t.classList.remove('active'));
                e.target.classList.add('active');
                this.activeViewTab = e.target.getAttribute('data-path');
                this.renderProjectsList();
            });
        });

        // Trigger Render Sequence on Chronological Legacy Year Selection Adjustments
        const yearFilter = document.getElementById('sel-project-year-filter');
        if (yearFilter) {
            yearFilter.addEventListener('change', () => this.renderProjectsList());
        }

        // Path A: Supervisor Direct Project Form Submission Engine Execution
        const uploadForm = document.getElementById('form-direct-project-upload');
        if (uploadForm) {
            uploadForm.addEventListener('submit', (e) => {
                e.preventDefault();

                // Tokenize structural team member emails delimited by spacing or text parameters
                const emailInputRaw = document.getElementById('txt-direct-team-emails').value;
                const validatedEmails = emailInputRaw.split(',').map(email => email.trim().toLowerCase()).filter(email => email.length > 0);

                if (validatedEmails.length === 0) {
                    alert("خطأ: يجب إدراج الايميل الجامعي الفريد لواحد من الطلاب على الأقل لربط أصول المجلد بحسابه تلقائياً.");
                    return;
                }

                const newProjectPayload = {
                    id: "PRJ-" + Math.floor(903 + Math.random() * 900),
                    title: document.getElementById('txt-direct-title').value,
                    teamMembers: validatedEmails, // Deterministic Account Matching Array Mapping
                    supervisors: document.getElementById('txt-direct-supervisors').value.split(',').map(s => s.trim()),
                    year: parseInt(document.getElementById('txt-direct-year').value),
                    major: document.getElementById('sel-direct-major').value,
                    description: document.getElementById('txt-direct-description').value,
                    status: "approved", // Path A direct uploads bypass evaluation pipelines automatically
                    feedback: "",
                    github: document.getElementById('txt-direct-github').value.trim(),
                    banner: "",
                    path: "supervisor"
                };

                MaktabtiDB.data.projects.push(newProjectPayload);
                MaktabtiDB.logAction("رفع مشروع تخرج مباشر (أمين مكتبة)", null, newProjectPayload);

                uploadForm.reset();
                this.renderProjectsList();
                alert("تم تسجيل ونشر مجلد مشروع التخرج مباشرة بالمنظومة بنجاح.");
            });
        }

        // Bind Centralized Asynchronous Data Grid Matrix Serialization Commands
        const exportBtn = document.getElementById('btn-export-projects');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                const headers = ["Project ID", "Title", "Academic Major", "Graduation Year", "Status", "Entry Path Source"];
                const rows = MaktabtiDB.data.projects.map(p => [p.id, p.title, p.major, p.year, p.status, p.path]);
                MaktabtiDB.exportToCSV("graduation_projects_ledger", headers, rows);
            });
        }
    }
};

// Bind initialization lifecycle directly into document load tracking engines
document.addEventListener('DOMContentLoaded', () => {
    MaktabtiGraduation.init();
});