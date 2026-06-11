/* Maktabti Admin Portal - Dashboard Logic Engine (Bilingual Optimized)
   Manages real-time data binding for metrics counters, red-alert tracking, and time-filtered analytics
*/

const MaktabtiDashboard = {
    init: function() {
        this.loadMetricsCounters();
        this.loadOverdueBooksTable();
        this.renderDemandForecastChart('monthly');
        this.bindTimeFilterEvents();
    },

    loadMetricsCounters: function() {
        const totalBooks = MaktabtiDB.data.materials.length;
        const pendingProjects = MaktabtiDB.data.projects.filter(p => p.status === 'pending').length;
        const totalDownloads = MaktabtiDB.data.materials.reduce((sum, item) => sum + (item.downloads || 0), 0);

        if (document.getElementById('lbl-metric-books')) document.getElementById('lbl-metric-books').textContent = totalBooks.toLocaleString();
        if (document.getElementById('lbl-metric-projects')) document.getElementById('lbl-metric-projects').textContent = pendingProjects.toLocaleString();
        if (document.getElementById('lbl-metric-downloads')) document.getElementById('lbl-metric-downloads').textContent = totalDownloads.toLocaleString();
    },

    loadOverdueBooksTable: function() {
        const tableBody = document.getElementById('tbody-overdue-alerts');
        if (!tableBody) return;

        tableBody.innerHTML = '';
        const currentLang = MaktabtiDB.data.currentLang || 'en';
        const currentSystemDate = new Date('2026-06-11');

        const overdueTransactions = MaktabtiDB.data.circulation.filter(record => {
            if (record.returned) return false;
            return new Date(record.expectedReturnDate) < currentSystemDate;
        });

        if (overdueTransactions.length === 0) {
            const emptyTxt = currentLang === 'ar' ? 'لا توجد كتب متأخرة حالياً داخل المنظومة.' : 'No overdue references tracked inside the system.';
            tableBody.innerHTML = `<tr><td colspan="5" class="text-center" style="color: var(--text-hint); padding: 30px;">${emptyTxt}</td></tr>`;
            return;
        }

        overdueTransactions.forEach(record => {
            const bookAsset = MaktabtiDB.data.materials.find(m => m.id === record.bookId) || { title: 'Unknown Reference', author: 'N/A' };
            const expectedReturn = new Date(record.expectedReturnDate);
            const daysOverdue = Math.floor((currentSystemDate.getTime() - expectedReturn.getTime()) / (1000 * 3600 * 24));
            
            const gapTxt = currentLang === 'ar' ? `${daysOverdue} أيام تأخير` : `${daysOverdue} Days Overdue`;
            const unknownAuthorTxt = currentLang === 'ar' ? 'مؤلف غير معروف' : 'Unknown Author';

            const trRow = document.createElement('tr');
            trRow.className = 'row-red-alert-highlight';

            trRow.innerHTML = `
                <td>
                    <div style="font-weight: 700; color: var(--text-primary);">${bookAsset.title}</div>
                    <div style="font-size: 12px; color: var(--text-hint); font-weight: 600;">${bookAsset.author || unknownAuthorTxt}</div>
                </td>
                <td class="student-email-cell">${record.studentEmail}</td>
                <td style="font-family: monospace; font-weight: 600;">${record.borrowDate}</td>
                <td style="font-family: monospace; font-weight: 600; color: var(--error-red);">${record.expectedReturnDate}</td>
                <td><span class="overdue-days-token" style="color: var(--error-red); font-weight: 700;">${gapTxt}</span></td>
            `;

            tableBody.appendChild(trRow);
        });
    },

    renderDemandForecastChart: function(timeWindow) {
        const chartCanvas = document.getElementById('canvas-demand-chart');
        if (!chartCanvas) return;

        const currentLang = MaktabtiDB.data.currentLang || 'en';
        const sortedMaterials = [...MaktabtiDB.data.materials].sort((a, b) => b.downloads - a.downloads).slice(0, 3);

        // صياغة العناوين التوضيحية بناءً على اللغة لمنع الاختلاط البصري
        let windowLabel = "";
        if (currentLang === 'ar') {
            windowLabel = timeWindow === 'daily' ? "معدل يومي مباشر" : timeWindow === 'weekly' ? "معدل أسبوعي مجدول" : "تراكمي شهري";
        } else {
            windowLabel = timeWindow === 'daily' ? "Live Daily Rate" : timeWindow === 'weekly' ? "Scheduled Weekly Rate" : "Cumulative Monthly Scale";
        }

        const chartTitle = currentLang === 'ar' ? `إحصائيات الإقبال والأكثر طلباً (${windowLabel})` : `Demand Frequencies & Most Read (${windowLabel})`;

        chartCanvas.innerHTML = `
            <div style="text-align: center; width: 100%; padding: 20px;">
                <div style="font-weight: 700; color: var(--dark-blue); margin-bottom: 25px; font-size: 14px;">
                    ${chartTitle}
                </div>
                <div style="display: flex; justify-content: center; align-items: flex-end; gap: 50px; height: 160px; padding-top: 10px;">
                    ${sortedMaterials.map((item, index) => {
                        const heightPercentage = 100 - (index * 25); 
                        return `
                            <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
                                <div style="font-size: 11px; font-weight: 700; color: var(--text-secondary); font-family: monospace;">${item.downloads} u</div>
                                <div style="width: 45px; height: ${heightPercentage}px; background: var(--primary-gradient); border-radius: 8px 8px 0 0; transition: height 0.3s ease;"></div>
                                <div style="font-size: 12px; font-weight: 700; color: var(--text-primary); max-width: 110px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${item.title}">${item.title}</div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    },

    bindTimeFilterEvents: function() {
        const filterChips = document.querySelectorAll('.chart-time-filters .filter-chip');
        filterChips.forEach(chip => {
            chip.addEventListener('click', (e) => {
                filterChips.forEach(c => c.classList.remove('active'));
                e.target.classList.add('active');
                const selectedWindow = e.target.getAttribute('data-window');
                this.renderDemandForecastChart(selectedWindow);
            });
        });
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const currentPath = window.location.pathname;
    if (currentPath.includes('dashboard.html')) {
        MaktabtiDashboard.init();
    }
});