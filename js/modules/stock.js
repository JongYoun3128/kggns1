let inventoryData = [];

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
const openInventoryAddModal = function () {
    document.getElementById('inventory-add-modal').classList.remove('hidden');
};
const closeInventoryAddModal = function () {
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
const closeInventoryModal = function () {
    document.getElementById('inventory-edit-modal').classList.add('hidden');
};
