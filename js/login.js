// 간단한 데모용 ID/PW (실제 서비스에서는 서버 인증 필요)
const DEMO_ID = 'admin';
const DEMO_PW = '1234';

const loginForm = document.getElementById('login-form');
const loginContainer = document.getElementById('login-container');
const adminContainer = document.getElementById('admin-container');
const loginError = document.getElementById('login-error');
const home = document.getElementById('home_btn');

loginForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const id = document.getElementById('userId').value.trim();
    const pw = document.getElementById('userPw').value.trim();
    if (id === DEMO_ID && pw === DEMO_PW) {
        loginContainer.classList.add('hidden');
        adminContainer.classList.remove('hidden');
        loginError.textContent = '';
        home.style.display = 'none';
        showSection('dashboard');
    } else {
        loginError.textContent = 'ID 또는 PW가 올바르지 않습니다.';
    }
});

function showSection(section) {
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

function logout() {
    adminContainer.classList.add('hidden');
    loginContainer.classList.remove('hidden');
    loginForm.reset();
    home.style.display = 'block';
    document
        .querySelectorAll('.admin-section')
        .forEach((sec) => sec.classList.add('hidden'));
    document
        .querySelectorAll('.sidebar-btn')
        .forEach((btn) => btn.classList.remove('active'));
}

// 데모용 재고 데이터 (부서명, 직위 추가)
let inventoryData = [
    {
        code: 'A1001',
        name: '노트북',
        qty: 120,
        location: 'A-01',
        dept: 'IT',
        position: '사원',
    },
    {
        code: 'B2032',
        name: '마우스',
        qty: 340,
        location: 'B-12',
        dept: '구매',
        position: '대리',
    },
    {
        code: 'C3300',
        name: '키보드',
        qty: 210,
        location: 'C-07',
        dept: 'IT',
        position: '과장',
    },
    {
        code: 'D4002',
        name: '모니터',
        qty: 55,
        location: 'D-03',
        dept: '물류',
        position: '부장',
    },
];

let ordersData = [
    {
        no: '20240601-01',
        customer: '홍길동',
        status: '대기',
        date: '2024-06-01',
    },
    {
        no: '20240601-02',
        customer: '이순신',
        status: '처리중',
        date: '2024-06-01',
    },
    {
        no: '20240601-03',
        customer: '김철수',
        status: '완료',
        date: '2024-06-01',
    },
];

function renderInventoryTable() {
    const tbody = document.getElementById('inventory-table-body');
    tbody.innerHTML = '';
    inventoryData.forEach((item, idx) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
      <td>${item.code}</td>
      <td>${item.name}</td>
      <td>${item.qty}</td>
      <td>${item.location}</td>
      <td>${item.dept}</td>
      <td>${item.position}</td>
      <td><button class="table-edit-btn" onclick="openInventoryEditModal(${idx})">수정</button></td>
      <td><button class="table-delete-btn" onclick="deleteInventory(${idx})">삭제</button></td>
    `;
        tbody.appendChild(tr);
    });
}

// 재고 수정 모달 관련
window.openInventoryEditModal = function (idx) {
    const modal = document.getElementById('inventory-edit-modal');
    modal.classList.remove('hidden');
    document.getElementById('edit-index').value = idx;
    document.getElementById('edit-name').value = inventoryData[idx].name;
    document.getElementById('edit-qty').value = inventoryData[idx].qty;
    document.getElementById('edit-location').value =
        inventoryData[idx].location;
    document.getElementById('edit-dept').value = inventoryData[idx].dept;
    document.getElementById('edit-position').value =
        inventoryData[idx].position;
};
window.closeInventoryModal = function () {
    document.getElementById('inventory-edit-modal').classList.add('hidden');
};
document
    .getElementById('inventory-edit-form')
    .addEventListener('submit', function (e) {
        e.preventDefault();
        const idx = document.getElementById('edit-index').value;
        inventoryData[idx].name = document.getElementById('edit-name').value;
        inventoryData[idx].qty = parseInt(
            document.getElementById('edit-qty').value,
            10,
        );
        inventoryData[idx].location =
            document.getElementById('edit-location').value;
        inventoryData[idx].dept = document.getElementById('edit-dept').value;
        inventoryData[idx].position =
            document.getElementById('edit-position').value;
        renderInventoryTable();
        closeInventoryModal();
    });

// 재고 추가/삭제/모달
window.openInventoryAddModal = function () {
    document.getElementById('inventory-add-modal').classList.remove('hidden');
};
window.closeInventoryAddModal = function () {
    document.getElementById('inventory-add-modal').classList.add('hidden');
};
document
    .getElementById('inventory-add-form')
    .addEventListener('submit', function (e) {
        e.preventDefault();
        const code = document.getElementById('add-code').value;
        const name = document.getElementById('add-name').value;
        const qty = parseInt(document.getElementById('add-qty').value, 10);
        const location = document.getElementById('add-location').value;
        const dept = document.getElementById('add-dept').value;
        const position = document.getElementById('add-position').value;
        inventoryData.push({ code, name, qty, location, dept, position });
        renderInventoryTable();
        closeInventoryAddModal();
        this.reset();
    });
window.deleteInventory = function (idx) {
    if (confirm('정말 삭제하시겠습니까?')) {
        inventoryData.splice(idx, 1);
        renderInventoryTable();
    }
};

// 주문 관리 추가/삭제/모달
window.openOrderAddModal = function () {
    document.getElementById('order-add-modal').classList.remove('hidden');
};
window.closeOrderAddModal = function () {
    document.getElementById('order-add-modal').classList.add('hidden');
};
document
    .getElementById('order-add-form')
    .addEventListener('submit', function (e) {
        e.preventDefault();
        const no = document.getElementById('add-order-no').value;
        const customer = document.getElementById('add-customer').value;
        const status = document.getElementById('add-status').value;
        const date = document.getElementById('add-date').value;
        ordersData.push({ no, customer, status, date });
        renderOrdersTable();
        closeOrderAddModal();
        this.reset();
    });
window.deleteOrder = function (idx) {
    if (confirm('정말 삭제하시겠습니까?')) {
        ordersData.splice(idx, 1);
        renderOrdersTable();
    }
};
function renderOrdersTable() {
    const tbody = document.getElementById('orders-table-body');
    tbody.innerHTML = '';
    ordersData.forEach((item, idx) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
      <td>${item.no}</td>
      <td>${item.customer}</td>
      <td>${item.status}</td>
      <td>${item.date}</td>
      <td><button class="table-detail-btn" disabled>상세</button></td>
      <td><button class="table-delete-btn" onclick="deleteOrder(${idx})">삭제</button></td>
    `;
        tbody.appendChild(tr);
    });
}

// Chart.js 그래프 렌더링
let inoutChartInstance = null;
let stockBarChartInstance = null;
function renderDashboardCharts() {
    // 입출고 추이 (최근 7일)
    const days = ['6/1', '6/2', '6/3', '6/4', '6/5', '6/6', '6/7'];
    const inData = [20, 18, 22, 17, 19, 21, 23];
    const outData = [15, 16, 18, 14, 17, 15, 20];
    const inoutCtx = document.getElementById('inoutChart').getContext('2d');
    if (inoutChartInstance) inoutChartInstance.destroy();
    inoutChartInstance = new Chart(inoutCtx, {
        type: 'line',
        data: {
            labels: days,
            datasets: [
                {
                    label: '입고',
                    data: inData,
                    borderColor: '#4f8cff',
                    backgroundColor: 'rgba(79,140,255,0.08)',
                    fill: true,
                    tension: 0.3,
                },
                {
                    label: '출고',
                    data: outData,
                    borderColor: '#f87171',
                    backgroundColor: 'rgba(248,113,113,0.08)',
                    fill: true,
                    tension: 0.3,
                },
            ],
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: true, position: 'top' },
            },
            scales: {
                y: { beginAtZero: true },
            },
        },
    });

    // 품목별 재고 총합 (막대)
    const stockLabels = inventoryData.map((item) => item.name);
    const stockValues = inventoryData.map((item) => item.qty);
    const stockBarCtx = document
        .getElementById('stockBarChart')
        .getContext('2d');
    if (stockBarChartInstance) stockBarChartInstance.destroy();
    stockBarChartInstance = new Chart(stockBarCtx, {
        type: 'bar',
        data: {
            labels: stockLabels,
            datasets: [
                {
                    label: '재고 수량',
                    data: stockValues,
                    backgroundColor: '#4f8cff',
                    borderRadius: 6,
                },
            ],
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false },
            },
            scales: {
                y: { beginAtZero: true },
            },
        },
    });
}

function renderDashboard() {
    // 메인 입출고/방문자 그래프 (막대, 곡선)
    const barCtx = document.getElementById('mainBarChart').getContext('2d');
    if (window.mainBarChartInstance) window.mainBarChartInstance.destroy();
    window.mainBarChartInstance = new Chart(barCtx, {
        type: 'bar',
        data: {
            labels: [
                '1월 27일',
                '1월 28일',
                '1월 29일',
                '1월 30일',
                '1월 31일',
                '2월 1일',
                '2월 2일',
            ],
            datasets: [
                {
                    label: '입고',
                    data: [2, 1, 3, 2, 6, 1, 5],
                    backgroundColor: '#4f8cff',
                    borderRadius: 6,
                },
                {
                    label: '출고',
                    data: [1, 0, 2, 1, 3, 0, 4],
                    backgroundColor: '#f87171',
                    borderRadius: 6,
                },
            ],
        },
        options: {
            responsive: true,
            plugins: { legend: { display: true, position: 'top' } },
            scales: { y: { beginAtZero: true } },
        },
    });

    const lineCtx = document.getElementById('mainLineChart').getContext('2d');
    if (window.mainLineChartInstance) window.mainLineChartInstance.destroy();
    window.mainLineChartInstance = new Chart(lineCtx, {
        type: 'line',
        data: {
            labels: [
                '1월 27일',
                '1월 28일',
                '1월 29일',
                '1월 30일',
                '1월 31일',
                '2월 1일',
                '2월 2일',
            ],
            datasets: [
                {
                    label: '입고',
                    data: [2, 1, 3, 2, 6, 1, 5],
                    borderColor: '#4f8cff',
                    backgroundColor: 'rgba(79,140,255,0.08)',
                    fill: true,
                    tension: 0.3,
                },
                {
                    label: '출고',
                    data: [1, 0, 2, 1, 3, 0, 4],
                    borderColor: '#f87171',
                    backgroundColor: 'rgba(248,113,113,0.08)',
                    fill: true,
                    tension: 0.3,
                },
            ],
        },
        options: {
            responsive: true,
            plugins: { legend: { display: true, position: 'top' } },
            scales: { y: { beginAtZero: true } },
        },
    });

    // 오늘의 알림
    const alertList = document.getElementById('today-alert-list');
    alertList.innerHTML = '';
    [
        {
            code: '201801190005',
            desc: '와이드 롱블랙 라이트 베이지',
            status: '배송준비',
            date: '1월 19일',
        },
        {
            code: '201801190001',
            desc: '다다른 롱블랙 라이트 베이지',
            status: '입금대기',
            date: '1월 19일',
        },
    ].forEach((item) => {
        const li = document.createElement('li');
        li.innerHTML = `<b>${item.code}</b> ${item.desc} <span style='color:#6b7280;'>${item.status}</span> <span style='margin-left:auto;'>${item.date}</span>`;
        alertList.appendChild(li);
    });

    // 인기 콘텐츠
    const contentList = document.getElementById('popular-content-list');
    contentList.innerHTML = '';
    [
        { title: 'LINDA 쇼핑몰 이용방법', date: '2017년 12월 5일' },
        { title: '반품/교환 방법', date: '2017년 12월 3일' },
        { title: '비밀번호 찾기 방법', date: '2017년 11월 22일' },
    ].forEach((item) => {
        const li = document.createElement('li');
        li.innerHTML = `<span>${item.title}</span> <span style='margin-left:auto;color:#6b7280;'>${item.date}</span>`;
        contentList.appendChild(li);
    });

    // 소식
    const newsList = document.getElementById('news-list');
    newsList.innerHTML = '';
    [
        { title: '[UPDATE 8차] 대시보드 업데이트', date: '2017년 12월 1일' },
        { title: 'SMS 정책 변경 안내', date: '2017년 11월 30일' },
    ].forEach((item) => {
        const li = document.createElement('li');
        li.innerHTML = `<span>${item.title}</span> <span style='margin-left:auto;color:#6b7280;'>${item.date}</span>`;
        newsList.appendChild(li);
    });

    // 알림 상세 카드
    const alertDetail = document.getElementById('alert-detail-cards');
    alertDetail.innerHTML = '';
    [
        {
            title: '배송준비',
            desc: '201801190005 주문이 배송 준비 중입니다.',
            link: '#',
        },
        {
            title: '입금대기',
            desc: '201801190001 주문이 입금 대기 중입니다.',
            link: '#',
        },
    ].forEach((item) => {
        const card = document.createElement('div');
        card.className = 'detail-card';
        card.innerHTML = `<div class='detail-card-title'>${item.title}</div><div class='detail-card-desc'>${item.desc}</div><a class='detail-card-link' href='${item.link}'>상세보기</a>`;
        alertDetail.appendChild(card);
    });

    // 인기 콘텐츠 상세 카드
    const contentDetail = document.getElementById('content-detail-cards');
    contentDetail.innerHTML = '';
    [
        {
            title: 'LINDA 쇼핑몰 이용방법',
            desc: '쇼핑몰 이용에 대한 자세한 안내입니다.',
            link: '#',
        },
        {
            title: '반품/교환 방법',
            desc: '반품 및 교환 절차를 안내합니다.',
            link: '#',
        },
    ].forEach((item) => {
        const card = document.createElement('div');
        card.className = 'detail-card';
        card.innerHTML = `<div class='detail-card-title'>${item.title}</div><div class='detail-card-desc'>${item.desc}</div><a class='detail-card-link' href='${item.link}'>자세히</a>`;
        contentDetail.appendChild(card);
    });

    // 소식 상세 카드
    const newsDetail = document.getElementById('news-detail-cards');
    newsDetail.innerHTML = '';
    [
        {
            title: '대시보드 업데이트',
            desc: '8차 대시보드 업데이트가 적용되었습니다.',
            link: '#',
        },
        {
            title: 'SMS 정책 변경',
            desc: 'SMS 정책이 11월 30일부로 변경됩니다.',
            link: '#',
        },
    ].forEach((item) => {
        const card = document.createElement('div');
        card.className = 'detail-card';
        card.innerHTML = `<div class='detail-card-title'>${item.title}</div><div class='detail-card-desc'>${item.desc}</div><a class='detail-card-link' href='${item.link}'>공지 보기</a>`;
        newsDetail.appendChild(card);
    });
}

// 페이지 진입 시 테이블 및 대시보드 그래프 렌더링
window.addEventListener('DOMContentLoaded', () => {
    renderInventoryTable();
    renderOrdersTable();
    renderDashboard();
});

// 기본적으로 아무 섹션도 열지 않음
window.toggleAccordion = function (type) {
    const btn = {
        alert: document.querySelectorAll('.accordion-btn')[0],
        content: document.querySelectorAll('.accordion-btn')[1],
        news: document.querySelectorAll('.accordion-btn')[2],
    }[type];
    const panel = document.getElementById('accordion-' + type);
    btn.classList.toggle('active');
    panel.classList.toggle('open');
};
