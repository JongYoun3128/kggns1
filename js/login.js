// const { resolveConfig } = require('prettier');

const loginForm = document.getElementById('login-form');
const loginContainer = document.getElementById('login-container');
const adminContainer = document.getElementById('admin-container');
const loginError = document.getElementById('login-error');
const home = document.getElementById('home_btn');

const getData = async (path, param, method = 'GET') => {
    const url = 'http://localhost:23000' + path;

    const _res = await fetch(url, {
        headers: {
            'Content-Type': 'application/json',
        },
        method,
        body: JSON.stringify(param),
    });

    const res = await _res.json();

    return res;
};
setTimeout(() => {
    document.getElementById('userId').value = 'test';
    document.getElementById('userPw').value = '1234';
    document.querySelector('#loginbtn').click();
}, 500);

loginForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    const id = document.getElementById('userId').value.trim();
    const pw = document.getElementById('userPw').value.trim();

    const param = {
        memberId: id,
        memberPw: pw,
    };

    const res = await getData('/api/v1/member/login', param, 'POST');

    if (res?.data) {
        loginContainer.classList.add('hidden');
        adminContainer.classList.remove('hidden');
        loginError.textContent = '';
        home.style.display = 'none';
        showSection('dashboard');
    } else {
        loginError.textContent = 'ID 또는 PW가 올바르지 않습니다.';
    }
});

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
let inventoryData = [];
let ordersData = [];

async function renderInventoryTable() {
    // 조회
    const res = await getData('/api/v1/stock/getStocks');
    inventoryData = [...res.data];

    const tbody = document.getElementById('inventory-table-body');
    tbody.innerHTML = '';
    inventoryData.forEach((item, idx) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
      <td>${item.stockCode}</td>
      <td>${item.stockName}</td>
      <td>${item.stockCounts}</td>
      <td>${item.stockPlace}</td>
      <td>${item.stockDegree}</td>
      <td>${item.stockPosition}</td>
      <td><button class="table-edit-btn" onclick="openInventoryEditModal(${idx})">수정</button></td>
      <td><button class="table-delete-btn" onclick="deleteInventory(${item.sno})">삭제</button></td>
    `;
        tbody.appendChild(tr);
    });
}

// 재고 수정 모달 관련
const openInventoryEditModal = function (idx) {
    const target = inventoryData[idx];

    const modal = document.getElementById('inventory-edit-modal');
    modal.classList.remove('hidden');
    document.getElementById('edit-index').value = target.sno;
    document.getElementById('edit-code').value = target.stockCode;
    document.getElementById('edit-name').value = target.stockName;
    document.getElementById('edit-qty').value = target.stockCounts;
    document.getElementById('edit-location').value = target.stockPlace;
    document.getElementById('edit-dept').value = target.stockDegree;
    document.getElementById('edit-position').value = target.stockPosition;
};

window.closeInventoryModal = function () {
    document.getElementById('inventory-edit-modal').classList.add('hidden');
};
document
    .getElementById('inventory-edit-form')
    .addEventListener('submit', async function (e) {
        e.preventDefault();

        let param = {};

        param.stockCode = document.getElementById('edit-code').value;
        param.sno = document.getElementById('edit-index').value;
        param.stockName = document.getElementById('edit-name').value;
        param.stockCount = ~~document.getElementById('edit-qty').value;
        param.stockPlace = document.getElementById('edit-location').value;
        param.stockDegree = document.getElementById('edit-dept').value;

        param.stockPosition = document.getElementById('edit-position').value;

        await getData('/api/v1/stock/modifyStock', param, 'POST');

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
    .addEventListener('submit', async function (e) {
        e.preventDefault();
        const code = document.getElementById('add-code').value;
        const name = document.getElementById('add-name').value;
        const qty = parseInt(document.getElementById('add-qty').value, 10);
        const location = document.getElementById('add-location').value;
        const dept = document.getElementById('add-dept').value;
        const position = document.getElementById('add-position').value;

        const param = {
            stockCode: code,
            stockName: name,
            stockCounts: qty,
            stockPlace: location,
            stockDegree: dept,
            stockPosition: position,
        };

        const res = await getData('/api/v1/stock/registStock', param, 'POST');

        renderInventoryTable();
        closeInventoryAddModal();
        this.reset();
    });
const deleteInventory = async (sno) => {
    if (confirm('정말 삭제하시겠습니까?')) {
        const res = await getData('/api/v1/stock/deleteStock', sno, 'POST');

        if (res?.data) {
            alert('삭제 성공');
        } else {
            alert('삭제 실패');
        }

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
    .addEventListener('submit', async function (e) {
        e.preventDefault();

        let param = {};
        param.orderNo = document.getElementById('add-order-no').value;
        param.orderName = document.getElementById('add-customer').value;
        param.orderStatus = document.getElementById('add-status').value;
        param.orderDate = document.getElementById('add-date').value;

        await getData('/api/v1/order/registOrder', param, 'POST');

        renderOrdersTable();
        closeOrderAddModal();
        this.reset();
    });

const deleteOrder = async (ono) => {
    if (confirm('정말 삭제하시겠습니까?')) {
        const res = await getData('/api/v1/order/deleteOrder', ono, 'POST');

        if (res?.data) {
            alert('삭제되었습니다');
        } else {
            alert('삭제실패');
        }

        renderOrdersTable();
    }
};
async function renderOrdersTable() {
    const tbody = document.getElementById('orders-table-body');
    tbody.innerHTML = '';

    const res = await getData('/api/v1/order/getOrders');
    ordersData = [...res.data];

    ordersData.forEach((item, idx) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
      <td>${item.orderNo}</td>
      <td>${item.orderName}</td>
      <td>${item.orderStatus}</td>
      <td>${item.orderDate}</td>
      <td><button class="table-detail-btn" disabled>상세</button></td>
      <td><button class="table-delete-btn" onclick="deleteOrder(${item.ono})">삭제</button></td>
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
