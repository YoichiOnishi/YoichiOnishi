// js/main.js

// ユーティリティ関数群
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

// エラーハンドリング用のユーティリティ
function handleError(error, context) {
    console.error(`Error in ${context}:`, error);
}

// アニメーション状態管理
const animationState = {
    initialized: false,
    categoriesAnimated: new Set()
};

// アニメーションと更新機能
function updateSkillArcs() {
    try {
        const skillBars = document.querySelectorAll('.skill-bar');
        
        skillBars.forEach(bar => {
            const percentage = parseFloat(bar.querySelector('.skill-percentage').textContent);
            const arcBg = bar.querySelector('.arc-bg');
            const arcProgress = bar.querySelector('.arc-progress');
            const skillName = bar.querySelector('.skill-name');
            const skillPercentage = bar.querySelector('.skill-percentage');
            
            if (!arcBg || !arcProgress) return;
            
            arcBg.setAttribute('d', createFullCircle());
            
            const arcData = createArc(percentage);
            arcProgress.setAttribute('d', arcData.path);
            
            // テキスト位置を中央に完全に合わせる
            if (skillName) {
                skillName.setAttribute('x', '125');
                skillName.setAttribute('y', '120'); // 値を調整
                skillName.setAttribute('text-anchor', 'middle');
            }
            
            if (skillPercentage) {
                skillPercentage.setAttribute('x', '125');
                skillPercentage.setAttribute('y', '150'); // 値を調整
                skillPercentage.setAttribute('text-anchor', 'middle');
            }
            
            // パーセンテージに応じてグラデーションを設定
            let gradientId;
            if (percentage >= 90) {
                gradientId = 'gradientHigh';
            } else if (percentage >= 80) {
                gradientId = 'gradientMedium';
            } else if (percentage >= 70) {
                gradientId = 'gradientRegular';
            } else {
                gradientId = 'gradientLow';
            }
            
            arcProgress.style.stroke = `url(#${gradientId})`;
        });
    } catch (error) {
        handleError(error, 'updateSkillArcs');
    }
}

function animateSkillCategory(category) {
    try {
        if (animationState.categoriesAnimated.has(category)) return;
        
        const bars = category.querySelectorAll('.skill-bar');
        let delay = 0;
        
        bars.forEach((bar) => {
            setTimeout(() => {
                // 初期状態をセット
                bar.style.transition = 'all 0.6s ease-out';
                bar.style.opacity = '0';
                bar.style.transform = 'translateY(20px)';
                
                // アニメーション開始
                requestAnimationFrame(() => {
                    bar.style.opacity = '1';
                    bar.style.transform = 'translateY(0)';
                });
                
                // スキル円グラフの更新
                const arcProgress = bar.querySelector('.arc-progress');
                if (arcProgress) {
                    setTimeout(() => {
                        updateSkillArcs();
                    }, 100);
                }
            }, delay);
            
            delay += 150; // 各バーの遅延を増加
        });
        
        animationState.categoriesAnimated.add(category);
    } catch (error) {
        handleError(error, 'animateSkillCategory');
    }
}

function handleScroll() {
    try {
        const categories = document.querySelectorAll('.skill-category');
        const timelineItems = document.querySelectorAll('.timeline-item');
        const achievementCards = document.querySelectorAll('.achievement-card');
        const videoContainers = document.querySelectorAll('.video-container');
        const galleryItems = document.querySelectorAll('.gallery-item');
        
        const screenPosition = window.innerHeight / 1.3;

        categories.forEach(category => {
            const position = category.getBoundingClientRect().top;
            if (position < screenPosition) {
                category.classList.add('visible');
                animateSkillCategory(category);
            }
        });

        timelineItems.forEach(item => {
            const position = item.getBoundingClientRect().top;
            if (position < screenPosition) {
                item.classList.add('visible');
            }
        });

        achievementCards.forEach(card => {
            const position = card.getBoundingClientRect().top;
            if (position < screenPosition) {
                card.classList.add('visible');
            }
        });
        
        videoContainers.forEach(container => {
            const position = container.getBoundingClientRect().top;
            if (position < screenPosition) {
                container.classList.add('visible');
            }
        });
        
        galleryItems.forEach(item => {
            const position = item.getBoundingClientRect().top;
            if (position < screenPosition) {
                item.classList.add('visible');
            }
        });
    } catch (error) {
        handleError(error, 'handleScroll');
    }
}

function initializeSkills() {
    try {
        if (animationState.initialized) return;
        
        const skillBars = document.querySelectorAll('.skill-bar');
        skillBars.forEach(bar => {
            bar.style.opacity = '0';
            bar.style.transform = 'translateY(20px)';
        });
        
        animationState.initialized = true;
    } catch (error) {
        handleError(error, 'initializeSkills');
    }
}

// Intersection Observer の設定
const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px'
};

const observer = new IntersectionObserver((entries) => {
    try {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                
                if (element.classList.contains('skill-category')) {
                    element.classList.add('visible');
                    animateSkillCategory(element);
                } else {
                    element.classList.add('visible');
                }
                
                // アニメーション完了後に監視を解除
                observer.unobserve(element);
            }
        });
    } catch (error) {
        handleError(error, 'intersectionObserver');
    }
}, observerOptions);

// スクロールの最適化
let scrollTimeout;
function optimizedScroll() {
    if (scrollTimeout) {
        window.cancelAnimationFrame(scrollTimeout);
    }
    
    scrollTimeout = window.requestAnimationFrame(() => {
        handleScroll();
    });
}

// リサイズの最適化
let resizeTimeout;
function optimizedResize() {
    if (resizeTimeout) {
        clearTimeout(resizeTimeout);
    }
    
    resizeTimeout = setTimeout(() => {
        handleScroll();
        updateSkillArcs();
    }, 250);
}

// DOMContentLoaded イベントリスナー
document.addEventListener('DOMContentLoaded', function() {
    try {
        // 初期化
        initializeSkills();
        
        // 少し遅延させて初期アニメーションを開始
        setTimeout(() => {
            handleScroll();
            updateSkillArcs();
        }, 100);
        
        // Intersection Observer の設定
        document.querySelectorAll('.skill-category, .timeline-item, .achievement-card, .video-container, .gallery-item, .reveal-element')
            .forEach(element => {
                observer.observe(element);
            });
        
        // スムーススクロールの設定
        document.querySelectorAll('a[data-scroll]').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    window.scrollTo({
                        top: targetSection.offsetTop - 70,
                        behavior: 'smooth'
                    });
                }
            });
        });
        
        // バックトゥトップボタン
        const backToTopBtn = document.getElementById('back-to-top');
        if (backToTopBtn) {
            window.addEventListener('scroll', function() {
                if (window.scrollY > 500) {
                    backToTopBtn.classList.add('visible');
                } else {
                    backToTopBtn.classList.remove('visible');
                }
            });
            
            backToTopBtn.addEventListener('click', function() {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
        
        // 3Dチルト効果
        if (typeof VanillaTilt !== 'undefined') {
            VanillaTilt.init(document.querySelectorAll("[data-tilt]"), {
                max: 10,
                speed: 400,
                glare: true,
                "max-glare": 0.3
            });
        }
            
    } catch (error) {
        handleError(error, 'DOMContentLoaded');
    }
});

// スクロールイベントリスナー
window.addEventListener('scroll', optimizedScroll, { passive: true });

// リサイズイベントリスナー
window.addEventListener('resize', optimizedResize);

// ページビジビリティ変更時の処理
document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'visible') {
        // ページが表示された時にアニメーションを更新
        handleScroll();
        updateSkillArcs();
    }
});

// エラー発生時のフォールバック
window.addEventListener('error', function(e) {
    handleError(e.error, 'global');
});