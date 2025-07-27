// 주문 관리 추가/삭제/모달
const openOrderAddModal = function () {
    document.getElementById('order-add-modal').classList.remove('hidden');
};
const closeOrderAddModal = function () {
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
