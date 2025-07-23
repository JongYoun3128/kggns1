$('.header_menu_list li').mouseover(function () {
    $(this).find('.sub_list').stop().slideDown();
});
$('.header_menu_list li').mouseleave(function () {
    $('.sub_list').stop().slideUp();
});
$('.hamburger a').click(function () {
    $('.hidden_menu').slideToggle();
});

$(window).scroll(function () {
    var nowscroll = $(window).scrollTop();

    if (nowscroll > 100) {
        $('.header_white').fadeIn('fast');
        $('.header').fadeOut();
    } else {
        $('.header_white').fadeOut('fast');
        $('.header').fadeIn();
    }
});
document.addEventListener('DOMContentLoaded', () => {
    const hamburgerButtons = document.querySelectorAll('.mobile-hamburger');
    const mobileNav = document.getElementById('mobile_nav');
    const closeButton = document.querySelector('.close_btn');

    const openNav = () => {
        mobileNav.classList.add('open');
    };

    const closeNav = () => {
        mobileNav.classList.remove('open');
    };

    hamburgerButtons.forEach((button) => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            openNav();
        });
    });

    if (closeButton) {
        closeButton.addEventListener('click', (e) => {
            e.preventDefault();
            closeNav();
        });
    }
});
