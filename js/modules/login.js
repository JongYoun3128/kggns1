setTimeout(() => {
    document.getElementById('userId').value = 'test';
    document.getElementById('userPw').value = '1234';
    document.querySelector('#loginbtn').click();
}, 500);

const loginForm = document.getElementById('login-form');
const loginContainer = document.getElementById('login-container');
// const adminContainer = document.getElementById('admin-container');
const loginError = document.getElementById('login-error');
// const home = document.getElementById('home_btn');

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
