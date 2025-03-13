// js/main.js

// スキル円グラフの作成と更新を行う関数群
function createArc(percentage) {
    const width = 250;
    const height = 250;
    const radius = 85;
    const centerX = width / 2;
    const centerY = height / 2;
    
    const circumference = 2 * Math.PI * radius;
    const startAngle = -90;
    const endAngle = startAngle + (percentage * 360 / 100);
    
    const start = polarToCartesian(centerX, centerY, radius, startAngle);
    const end = polarToCartesian(centerX, centerY, radius, endAngle);
    
    const largeArcFlag = percentage > 50 ? "1" : "0";
    const sweepFlag = "1";
    
    const d = [
        "M", start.x, start.y,
        "A", radius, radius, 0, largeArcFlag, sweepFlag, end.x, end.y
    ].join(" ");
    
    return { path: d, circumference: circumference };
}

function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
    const angleInRadians = (angleInDegrees * Math.PI) / 180.0;
    return {
        x: centerX + (radius * Math.cos(angleInRadians)),
        y: centerY + (radius * Math.sin(angleInRadians))
    };
}

function createFullCircle() {
    const width = 250;
    const height = 250;
    const radius = 85;
    const centerX = width / 2;
    const centerY = height / 2;
    
    return `M ${centerX} ${centerY - radius} 
            A ${radius} ${radius} 0 1 1 ${centerX} ${centerY + radius}
            A ${radius} ${radius} 0 1 1 ${centerX} ${centerY - radius}`;
}

function updateSkillArcs() {
    const skillBars = document.querySelectorAll('.skill-bar');
    
    skillBars.forEach(bar => {
        const percentage = parseFloat(bar.querySelector('.skill-percentage').textContent);
        const arcBg = bar.querySelector('.arc-bg');
        const arcProgress = bar.querySelector('.arc-progress');
        
        arcBg.setAttribute('d', createFullCircle());
        
        const arcData = createArc(percentage);
        arcProgress.setAttribute('d', arcData.path);
        
        const gradientId = arcProgress.getAttribute('data-gradient');
        arcProgress.style.stroke = `url(#${gradientId})`;
    });
}

// スクロールアニメーション処理
function handleScroll() {
    const elements = document.querySelectorAll('.timeline-item, .skill-bar, .achievement-card');
    elements.forEach(element => {
        const position = element.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.3;
        
        if (position < screenPosition) {
            element.classList.add('visible');
            if (element.classList.contains('skill-bar')) {
                updateSkillArcs();
            }
        }
    });
}

// イベントリスナーの設定
document.addEventListener('DOMContentLoaded', function() {
    // 初期表示時のスキル円グラフ更新
    setTimeout(updateSkillArcs, 100);
    // 初期表示時のスクロールアニメーション
    handleScroll();
});

// スクロールイベントの監視
window.addEventListener('scroll', handleScroll);
// ウィンドウリサイズ時の再計算
window.addEventListener('resize', handleScroll);

// プロフィール画像のホバーエフェクト（オプション）
document.querySelector('.profile-image').addEventListener('mouseover', function() {
    this.style.transform = 'scale(1.02)';
});

document.querySelector('.profile-image').addEventListener('mouseout', function() {
    this.style.transform = 'scale(1)';
});

// 外部リンクの処理
document.querySelectorAll('a[target="_blank"]').forEach(link => {
    link.addEventListener('click', function(e) {
        // Google Analyticsなどのトラッキングコードをここに追加可能
        console.log('External link clicked:', this.href);
    });
});