const adminContainer = document.getElementById('admin-container');
const home = document.getElementById('home_btn');

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
