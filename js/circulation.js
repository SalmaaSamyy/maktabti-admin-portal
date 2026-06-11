/* Maktabti Admin Portal - Manual Circulation Desk Logic Engine
   Handles manual book checkouts, return verification toggles, and shift-based date filters
*/

const MaktabtiCirculation = {
    selectedStudentEmail: null,

    // 1. Core Initialization Framework
    init: function() {
        if (!window.location.pathname.includes('circulation.html')) return;

        this.renderCirculationTable();
        this.setupStudentLookup();
        this.populateBookDropdown();
        this.bindCirculationEvents();
    },

    // 2. Render and Synchronize the Manual Desk Circulation Ledger Table
    renderCirculationTable: function() {
        const tableBody = document.getElementById('tbody-circulation');
        if (!tableBody) return;

        tableBody.innerHTML = '';

        // Fetch operational shift date filter value if set
        const shiftFilterElement = document.getElementById('txt-shift-date-filter');
        const activeShiftDate = shiftFilterElement ? shiftFilterElement.value : '';

        let records = MaktabtiDB.data.circulation;

        // Apply shift chronological filtering logic
        if (activeShiftDate) {
            records = records.filter(r => r.borrowDate === activeShiftDate);
        }

        if (records.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="6" class="text-center" style="color: var(--text-hint); padding: 30px;">لا توجد حركات استعارة مسجلة مطابقة للفلاتر الحالية.</td></tr>`;
            return;
        }

        records.forEach(record => {
            const bookAsset = MaktabtiDB.data.materials.find(m => m.id === record.bookId) || { title: 'مرجع محذوف', edition: 'N/A' };
            
            const trRow = document.createElement('tr');
            
            // Highlight overdue records if the asset hasn't been returned yet
            const currentSystemDate = new Date('2026-06-11');
            const expectedReturn = new Date(record.expectedReturnDate);
            if (!record.returned && expectedReturn < currentSystemDate) {
                trRow.className = 'row-red-alert-highlight';
            }

            trRow.innerHTML = `
                <td><span style="font-family: monospace; font-weight:700;">${record.id}</span></td>
                <td>
                    <div style="font-weight: 700; color: var(--text-primary);">${bookAsset.title}</div>
                    <div style="font-size: 12px; color: var(--text-hint); font-weight: 600;">${bookAsset.edition}</div>
                </td>
                <td style="font-family: monospace; font-weight: 600; color: var(--dark-blue);">${record.studentEmail}</td>
                <td style="font-family: monospace; font-weight: 600;">${record.borrowDate}</td>
                <td style="font-family: monospace; font-weight: 600; ${!record.returned && expectedReturn < currentSystemDate ? 'color: var(--error-red);' : ''}">${record.expectedReturnDate}</td>
                <td>
                    <div class="manual-toggle-container ${record.returned ? 'returned' : ''}" onclick="MaktabtiCirculation.toggleReturnStatus('${record.id}')">
                        <div class="switch-track-shell">
                            <div class="switch-thumb-node"></div>
                        </div>
                        <span class="toggle-status-label" style="color: ${record.returned ? 'var(--teal)' : 'var(--text-hint)'};">
                            ${record.returned ? 'تم الإرجاع' : 'مستعار حالياً'}
                        </span>
                    </div>
                </td>
            `;
            tableBody.appendChild(trRow);
        });
    },

    // 3. Deterministic Student Selection Subsystem via Academic Email Filtering
    setupStudentLookup: function() {
        const searchInput = document.getElementById('txt-student-lookup');
        const resultsDropdown = document.getElementById('div-lookup-results');
        
        if (!searchInput || !resultsDropdown) return;

        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.trim().toLowerCase();
            resultsDropdown.innerHTML = '';

            if (!query) {
                resultsDropdown.classList.add('hidden');
                return;
            }

            // Filter users who match the email search queries
            const matches = MaktabtiDB.data.users.filter(u => u.email.toLowerCase().includes(query));

            if (matches.length === 0) {
                resultsDropdown.innerHTML = `<div class="lookup-result-item" style="color: var(--text-hint); cursor: default;">لا يوجد طالب بهذا البريد الإلكتروني</div>`;
                resultsDropdown.classList.remove('hidden');
                return;
            }

            matches.forEach(student => {
                const item = document.createElement('div');
                item.className = 'lookup-result-item';
                item.innerHTML = `
                    <span class="lookup-student-name">${student.name}</span>
                    <span class="lookup-student-email">${student.email}</span>
                `;
                
                item.addEventListener('click', () => {
                    searchInput.value = student.email;
                    this.selectedStudentEmail = student.email;
                    resultsDropdown.classList.add('hidden');
                });
                
                resultsDropdown.appendChild(item);
            });

            resultsDropdown.classList.remove('hidden');
        });

        // Close dropdown when clicking outside the dynamic target boundaries
        document.addEventListener('click', (e) => {
            if (!searchInput.contains(e.target) && !resultsDropdown.contains(e.target)) {
                resultsDropdown.classList.add('hidden');
            }
        });
    },

    // 4. Populate Manual Asset Selection List Component
    populateBookDropdown: function() {
        const dropdown = document.getElementById('sel-circulation-book');
        if (!dropdown) return;

        dropdown.innerHTML = '<option value="" disabled selected>اختر الكتاب أو المرجع العلمي...</option>';
        MaktabtiDB.data.materials.forEach(book => {
            dropdown.innerHTML += `<option value="${book.id}">${book.title} (${book.edition})</option>`;
        });
    },

    // 5. Manual Handshake Processing Interface (State Toggles)
    toggleReturnStatus: function(recordId) {
        const record = MaktabtiDB.data.circulation.find(r => r.id === recordId);
        if (!record) return;

        const oldState = { ...record };
        
        // Invert the physical return status flag states completely yduwy
        record.returned = !record.returned;
        record.returnedDate = record.returned ? new Date().toISOString().substring(0, 10) : "";

        MaktabtiDB.save();
        MaktabtiDB.logAction("تعديل حالة استعارة كتاب (يدوياً)", oldState, record);
        
        this.renderCirculationTable();
    },

    // 6. Connect Layout Interaction Events for Forms and Shift Queries
    bindCirculationEvents: function() {
        // Trigger render sequence on operation shift date filter changes
        const shiftFilter = document.getElementById('txt-shift-date-filter');
        if (shiftFilter) {
            shiftFilter.addEventListener('change', () => this.renderCirculationTable());
        }

        // Handle submission of manual checkout modal transactions
        const checkoutForm = document.getElementById('form-manual-checkout');
        if (checkoutForm) {
            checkoutForm.addEventListener('submit', (e) => {
                e.preventDefault();

                const lookupValue = document.getElementById('txt-student-lookup').value.trim();
                const bookIdValue = document.getElementById('sel-circulation-book').value;
                const returnDateValue = document.getElementById('txt-expected-return').value;

                // Enforce lookup verification alignment checks
                if (!this.selectedStudentEmail || lookupValue !== this.selectedStudentEmail) {
                    alert("خطأ: يجب اختيار حساب الطالب المسجل من قائمة نتائج البحث الذكية التابعة للايميل الجامعي.");
                    return;
                }

                const newCheckoutRecord = {
                    id: "CIR-" + Math.floor(704 + Math.random() * 900),
                    bookId: bookIdValue,
                    studentEmail: this.selectedStudentEmail,
                    borrowDate: new Date().toISOString().substring(0, 10), // Stamps active current operational runtime
                    expectedReturnDate: returnDateValue, // Explicit manual date assigned by calendar element selection
                    returned: false,
                    returnedDate: ""
                };

                MaktabtiDB.data.circulation.unshift(newCheckoutRecord);
                MaktabtiDB.logAction("تسجيل حركة استعارة يدوية جديدة", null, newCheckoutRecord);

                checkoutForm.reset();
                this.selectedStudentEmail = null;
                this.renderCirculationTable();
                alert("تم تسجيل حركة الإعارة بنجاح وتعيين موعد الاستلام اليدوي المجدول.");
            });
        }

        // Connect Grid Matrix Table Serialization Directives
        const exportBtn = document.getElementById('btn-export-circulation');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                const headers = ["Transaction ID", "Book ID", "Student Academic Email", "Borrow Date", "Expected Return Date", "Is Returned"];
                const rows = MaktabtiDB.data.circulation.map(c => [c.id, c.bookId, c.studentEmail, c.borrowDate, c.expectedReturnDate, c.returned ? "Yes" : "No"]);
                MaktabtiDB.exportToCSV("manual_circulation_ledger", headers, rows);
            });
        }
    }
};

// Bind initialization lifecycle directly into document load tracking engines
document.addEventListener('DOMContentLoaded', () => {
    MaktabtiCirculation.init();
});