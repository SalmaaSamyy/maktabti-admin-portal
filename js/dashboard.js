/* Maktabti Admin Portal - Dashboard Logic Engine
   Manages real-time data binding for metrics counters, red-alert tracking, and time-filtered analytics
*/

const MaktabtiDashboard = {
    // 1. Core Initialization Routine
    init: function() {
        this.loadMetricsCounters();
        this.loadOverdueBooksTable();
        this.renderDemandForecastChart('monthly'); // Default window
        this.bindTimeFilterEvents();
    },

    // 2. Compute and Display Administrative Totals and Mobile Interaction Metrics
    loadMetricsCounters: function() {
        const totalBooks = MaktabtiDB.data.materials.length;
        const pendingProjects = MaktabtiDB.data.projects.filter(p => p.status === 'pending').length;
        
        // Accumulate mobile downloads telemetry dynamically from asset inventory tracking
        const totalDownloads = MaktabtiDB.data.materials.reduce((sum, item) => sum + (item.downloads || 0), 0);

        // Bind data values directly to DOM nodes if they exist in the viewport template
        if (document.getElementById('lbl-metric-books')) {
            document.getElementById('lbl-metric-books').textContent = totalBooks.toLocaleString();
        }
        if (document.getElementById('lbl-metric-projects')) {
            document.getElementById('lbl-metric-projects').textContent = pendingProjects.toLocaleString();
        }
        if (document.getElementById('lbl-metric-downloads')) {
            document.getElementById('lbl-metric-downloads').textContent = totalDownloads.toLocaleString();
        }
    },

    // 3. Build Real-Time Physical Overdue Book Logs with Mandatory Red Alerts
    loadOverdueBooksTable: function() {
        const tableBody = document.getElementById('tbody-overdue-alerts');
        if (!tableBody) return;

        tableBody.innerHTML = '';
        
        // Define operational system current timestamp boundary (Set explicitly to June 11, 2026)
        const currentSystemDate = new Date('2026-06-11');

        // Filter out non-returned checkout cycles that have breached their manually assigned return date
        const overdueTransactions = MaktabtiDB.data.circulation.filter(record => {
            if (record.returned) return false;
            const expectedReturn = new Date(record.expectedReturnDate);
            return expectedReturn < currentSystemDate;
        });

        if (overdueTransactions.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="5" class="text-center" style="color: var(--text-hint); padding: 30px;">لا توجد كتب متأخرة حالياً داخل المنظومة.</td></tr>`;
            return;
        }

        // Render matching rows with the strict red alert CSS layout rule
        overdueTransactions.forEach(record => {
            const bookAsset = MaktabtiDB.data.materials.find(m => m.id === record.bookId) || { title: 'مرجع غير معروف', author: 'N/A' };
            const expectedReturn = new Date(record.expectedReturnDate);
            
            // Calculate total elapsed days overdue
            const timeDifference = currentSystemDate.getTime() - expectedReturn.getTime();
            const daysOverdue = Math.floor(timeDifference / (1000 * 3600 * 24));

            const trRow = document.createElement('tr');
            trRow.className = 'row-red-alert-highlight'; // Enforcement of visual alert guardrail

            trRow.innerHTML = `
                <td>
                    <div style="font-weight: 700; color: var(--text-primary);">${bookAsset.title}</div>
                    <div style="font-size: 12px; color: var(--text-hint);">${bookAsset.author}</div>
                </td>
                <td class="student-email-cell">${record.studentEmail}</td>
                <td style="font-family: monospace; font-weight: 600;">${record.borrowDate}</td>
                <td style="font-family: monospace; font-weight: 600; color: var(--error-red);">${record.expectedReturnDate}</td>
                <td><span class="overdue-days-token">${daysOverdue} أيام تأخير</span></td>
            `;

            tableBody.appendChild(trRow);
        });
    },

    // 4. Render Dynamic Mock Chart Visualization Based on Selected Metric Windows
    renderDemandForecastChart: function(timeWindow) {
        const chartCanvas = document.getElementById('canvas-demand-chart');
        if (!chartCanvas) return;

        // Sort books based on download traffic frequencies to simulate localized institutional demand
        const sortedMaterials = [...MaktabtiDB.data.materials]
            .sort((a, b) => b.downloads - a.downloads)
            .slice(0, 3);

        let windowLabelModifier = "تراكمي شهري";
        if (timeWindow === 'daily') windowLabelModifier = "معدل يومي مباشر";
        if (timeWindow === 'weekly') windowLabelModifier = "معدل أسبوعي مجدول";

        chartCanvas.innerHTML = `
            <div style="text-align: center; width: 100%; padding: 20px;">
                <div style="font-weight: 700; color: var(--dark-blue); margin-bottom: 15px; font-size: 15px;">
                    إحصائيات الإقبال والأكثر طلباً (${windowLabelModifier})
                </div>
                <div style="display: flex; justify-content: center; align-items: flex-end; gap: 40px; height: 160px; padding-top: 10px;">
                    ${sortedMaterials.map((item, index) => {
                        // Dynamically compute visual bar heights proportional to demand scale
                        const heightPercentage = 100 - (index * 25); 
                        return `
                            <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
                                <div style="font-size: 11px; font-weight: 700; color: var(--text-secondary); font-family: monospace;">${item.downloads} u</div>
                                <div style="width: 45px; height: ${heightPercentage}px; background: var(--primary-gradient); border-radius: 4px 4px 0 0; transition: height 0.3s ease;"></div>
                                <div style="font-size: 12px; font-weight: 600; color: var(--text-primary); max-width: 90px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${item.title}">${item.title}</div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    },

    // 5. Connect Toggle Filters to Chart Rendering Engine Elements
    bindTimeFilterEvents: function() {
        const filterChips = document.querySelectorAll('.chart-time-filters .filter-chip');
        filterChips.forEach(chip => {
            chip.addEventListener('click', (e) => {
                // Remove active styling context from parallel components
                filterChips.forEach(c => c.classList.remove('active'));
                
                // Mount target active visual structure
                e.target.classList.add('active');
                
                const selectedWindow = e.target.getAttribute('data-window');
                this.renderDemandForecastChart(selectedWindow);
            });
        });
    }
};

// Auto-execute logic binding immediately upon DOM content preparation loops
document.addEventListener('DOMContentLoaded', () => {
    const currentPath = window.location.pathname;
    if (currentPath.includes('dashboard.html')) {
        MaktabtiDashboard.init();
    }
});