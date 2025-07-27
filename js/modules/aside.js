async function showSection(section) {
    document
        .querySelectorAll('.admin-section')
        .forEach((sec) => sec.classList.add('hidden'));
    document.getElementById('section-' + section).classList.remove('hidden');
    // 사이드바 버튼 활성화
    document
        .querySelectorAll('.sidebar-btn')
        .forEach((btn) => btn.classList.remove('active'));
    const btnMap = {
        dashboard: 0,
        inventory: 1,
        orders: 2,
        settings: 3,
    };
    document
        .querySelectorAll('.sidebar-btn')
        [btnMap[section]].classList.add('active');
    if (section === 'dashboard') {
        renderDashboardCharts();
    }
    if (section === 'inventory') {
        renderInventoryTable();
    }
    if (section === 'orders') {
        renderOrdersTable();
    }
}
