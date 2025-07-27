// Chart.js 그래프 렌더링
let inoutChartInstance = null;
let stockBarChartInstance = null;
function renderDashboardCharts() {
    // 입출고 추이 (최근 7일)
    const days = ['6/1', '6/2', '6/3', '6/4', '6/5', '6/6', '6/7'];
    const inData = [20, 18, 22, 17, 19, 21, 23];
    const outData = [15, 16, 18, 14, 17, 15, 20];
    const inoutCtx = document.getElementById('inoutChart').getContext('2d');

    console.log('inoutCtx >>> ', inoutCtx);

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
// window.addEventListener('DOMContentLoaded', () => {
//     alert(1);
//     renderInventoryTable();
//     renderOrdersTable();
//     renderDashboard();
// });

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

renderDashboard();
