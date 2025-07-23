// 항만 시설 이미지들
const images = [
    {
        src: '../../images/info_img01.jpg',
        alt: '항만 전체 전경 - 대형 컨테이너 터미널과 하역 시설',
    },
    {
        src: '../../images/info_img02.jpg',
        alt: '컨테이너 야드 - 정렬된 컨테이너와 크레인 시설',
    },
    {
        src: '../../images/info_img03.jpg',
        alt: '항만 부두 - 선박 접안 시설과 하역 장비',
    },
    {
        src: '../../images/info_img04.jpg',
        alt: '항만 인프라 - 창고 시설과 물류 센터',
    },
];

let currentIndex = 0;

// DOM 요소들
const mainImage = document.getElementById('mainImage');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const thumbnailsContainer = document.getElementById('thumbnailsContainer');


// 초기화
function init() {
    createThumbnails();
    showImage(0);
}

// 썸네일 생성
function createThumbnails() {
    images.forEach((image, index) => {
        const thumbnail = document.createElement('div');
        thumbnail.className = 'thumbnail';
        thumbnail.onclick = () => showImage(index);

        const img = document.createElement('img');
        img.src = image.src;
        img.alt = image.alt;

        thumbnail.appendChild(img);
        thumbnailsContainer.appendChild(thumbnail);
    });
}

// 이미지 표시
function showImage(index) {
    if (index < 0 || index >= images.length) return;

    // 이미지 로드
    const img = new Image();
    img.onload = () => {
        mainImage.src = images[index].src;
        mainImage.alt = images[index].alt;
        
    };
    img.onerror = () => {
    
    };
    img.src = images[index].src;

    currentIndex = index;
    updateThumbnails();
    updateNavButtons();
}

// 썸네일 활성화 상태 업데이트
function updateThumbnails() {
    const thumbnails = document.querySelectorAll('.thumbnail');
    thumbnails.forEach((thumbnail, index) => {
        thumbnail.classList.toggle('active', index === currentIndex);
    });
}

// 네비게이션 버튼 상태 업데이트
function updateNavButtons() {
    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex === images.length - 1;
}

// 이전 이미지
function showPrevImage() {
    if (currentIndex > 0) {
        showImage(currentIndex - 1);
    }
}

// 다음 이미지
function showNextImage() {
    if (currentIndex < images.length - 1) {
        showImage(currentIndex + 1);
    }
}

// 이벤트 리스너
prevBtn.addEventListener('click', showPrevImage);
nextBtn.addEventListener('click', showNextImage);

// 키보드 네비게이션
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        showPrevImage();
    } else if (e.key === 'ArrowRight') {
        showNextImage();
    }
});

// 터치 제스처 (모바일)
let touchStartX = 0;
let touchEndX = 0;

mainImage.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
});

mainImage.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            showNextImage();
        } else {
            showPrevImage();
        }
    }
}

// 초기화
init();
