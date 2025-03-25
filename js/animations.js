// js/animations.js

document.addEventListener('DOMContentLoaded', function() {
    // ナビゲーション関連のアニメーション
    const navAnimation = {
        nav: document.querySelector('.main-nav'),
        navLinks: document.querySelectorAll('.nav-links li'),
        burger: document.querySelector('.burger'),
        navLinks_ul: document.querySelector('.nav-links'),
        
        init: function() {
            // バーガーメニューのクリックイベント
            this.burger.addEventListener('click', () => {
                this.toggleMenu();
            });
            
            // スクロールイベント
            window.addEventListener('scroll', () => {
                this.scrollNav();
            });
            
            // スムーススクロール
            this.smoothScroll();
        },
        
        toggleMenu: function() {
            // ナビゲーションメニューの開閉
            this.navLinks_ul.classList.toggle('nav-active');
            this.burger.classList.toggle('toggle');
            
            // メニュー項目のアニメーション
            this.navLinks.forEach((link, index) => {
                if (link.style.animation) {
                    link.style.animation = '';
                } else {
                    link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
                }
            });
        },
        
        scrollNav: function() {
            // スクロール時のナビゲーションスタイル変更
            if (window.scrollY > 100) {
                this.nav.classList.add('scrolled');
            } else {
                this.nav.classList.remove('scrolled');
            }
        },
        
        smoothScroll: function() {
            // スムーススクロールの設定
            const scrollLinks = document.querySelectorAll('a[data-scroll]');
            
            scrollLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    
                    // リンク先のIDを取得
                    const targetId = link.getAttribute('href');
                    const targetSection = document.querySelector(targetId);
                    
                    if (targetSection) {
                        // メニューを閉じる
                        if (this.navLinks_ul.classList.contains('nav-active')) {
                            this.toggleMenu();
                        }
                        
                        // スムーススクロール
                        window.scrollTo({
                            top: targetSection.offsetTop - 70,
                            behavior: 'smooth'
                        });
                    }
                });
            });
        }
    };
    
    // スクロールアニメーション
    const scrollAnimation = {
        revealElements: document.querySelectorAll('.reveal-element'),
        backToTopBtn: document.getElementById('back-to-top'),
        
        init: function() {
            // スクロール時の監視
            window.addEventListener('scroll', () => {
                this.revealOnScroll();
                this.showBackToTopButton();
            });
            
            // 「トップに戻る」ボタンのクリックイベント
            if (this.backToTopBtn) {
                this.backToTopBtn.addEventListener('click', () => {
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                });
            }
            
            // 初期表示時にも実行
            this.revealOnScroll();
        },
        
        revealOnScroll: function() {
            // 要素が画面内に入った時の表示アニメーション
            const windowHeight = window.innerHeight;
            const revealPoint = 150;
            
            this.revealElements.forEach(element => {
                const elementTop = element.getBoundingClientRect().top;
                const delay = element.getAttribute('data-delay') || 0;
                
                if (elementTop < windowHeight - revealPoint) {
                    setTimeout(() => {
                        element.classList.add('visible');
                    }, delay * 1000);
                }
            });
        },
        
        showBackToTopButton: function() {
            // スクロール位置に応じて「トップに戻る」ボタンの表示/非表示
            if (this.backToTopBtn) {
                if (window.scrollY > 500) {
                    this.backToTopBtn.classList.add('visible');
                } else {
                    this.backToTopBtn.classList.remove('visible');
                }
            }
        }
    };
    
    // 3Dチルト効果
    const tiltEffect = {
        init: function() {
            // VanillaTiltライブラリを使用した3Dチルト効果
            if (typeof VanillaTilt !== 'undefined') {
                VanillaTilt.init(document.querySelectorAll("[data-tilt]"), {
                    max: 10,
                    speed: 400,
                    glare: true,
                    "max-glare": 0.3
                });
            }
        }
    };
    
    // スキルグラフアニメーション
    const skillAnimation = {
        skillBars: document.querySelectorAll('.skill-bar'),
        
        init: function() {
            this.updateSkillArcs();
        },
        
        updateSkillArcs: function() {
            this.skillBars.forEach(bar => {
                const percentage = parseFloat(bar.getAttribute('data-percentage'));
                const arcBg = bar.querySelector('.arc-bg');
                const arcProgress = bar.querySelector('.arc-progress');
                
                if (!arcBg || !arcProgress) return;
                
                arcBg.setAttribute('d', this.createFullCircle());
                
                const arcData = this.createArc(percentage);
                arcProgress.setAttribute('d', arcData.path);
                
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
        },
        
        createArc: function(percentage) {
            const width = 250;
            const height = 250;
            const radius = 85;
            const centerX = width / 2;
            const centerY = height / 2;
            
            const circumference = 2 * Math.PI * radius;
            const startAngle = -90;
            const endAngle = startAngle + (percentage * 360 / 100);
            
            const start = this.polarToCartesian(centerX, centerY, radius, startAngle);
            const end = this.polarToCartesian(centerX, centerY, radius, endAngle);
            
            const largeArcFlag = percentage > 50 ? "1" : "0";
            const sweepFlag = "1";
            
            const d = [
                "M", start.x, start.y,
                "A", radius, radius, 0, largeArcFlag, sweepFlag, end.x, end.y
            ].join(" ");
            
            return { path: d, circumference: circumference };
        },
        
        polarToCartesian: function(centerX, centerY, radius, angleInDegrees) {
            const angleInRadians = (angleInDegrees * Math.PI) / 180.0;
            return {
                x: centerX + (radius * Math.cos(angleInRadians)),
                y: centerY + (radius * Math.sin(angleInRadians))
            };
        },
        
        createFullCircle: function() {
            const width = 250; 
            const height = 250;
            const radius = 85;
            const centerX = width / 2;
            const centerY = height / 2;
            
            return `M ${centerX} ${centerY - radius} 
                    A ${radius} ${radius} 0 1 1 ${centerX} ${centerY + radius}
                    A ${radius} ${radius} 0 1 1 ${centerX} ${centerY - radius}`;
        }
    };
    
    // グリッチテキストエフェクト
    const glitchEffect = {
        glitchTexts: document.querySelectorAll('.glitch-text'),
        
        init: function() {
            // グリッチエフェクトを適用
            this.glitchTexts.forEach(text => {
                const content = text.textContent;
                text.setAttribute('data-text', content);
            });
        }
    };

    // タイプライターエフェクト
    const typewriterEffect = {
        elements: document.querySelectorAll('.typewriter'),
        
        init: function() {
            this.elements.forEach(element => {
                const text = element.getAttribute('data-text');
                if (!text) return;
                
                element.textContent = '';
                this.typeText(element, text, 0);
            });
        },
        
        typeText: function(element, text, index) {
            if (index < text.length) {
                element.textContent += text.charAt(index);
                setTimeout(() => {
                    this.typeText(element, text, index + 1);
                }, 100);
            }
        }
    };

    // スクロールトリガーアニメーション
    const scrollTrigger = {
        elements: document.querySelectorAll('[data-scroll-trigger]'),
        
        init: function() {
            window.addEventListener('scroll', () => {
                this.checkVisibility();
            });
            
            // 初期チェック
            this.checkVisibility();
        },
        
        checkVisibility: function() {
            const windowHeight = window.innerHeight;
            
            this.elements.forEach(element => {
                const elementTop = element.getBoundingClientRect().top;
                const triggerPoint = element.getAttribute('data-trigger-point') || 0.8;
                const animationClass = element.getAttribute('data-animation') || 'animate';
                
                if (elementTop < windowHeight * triggerPoint) {
                    element.classList.add(animationClass);
                }
            });
        }
    };

    // パララックスエフェクト
    const parallaxEffect = {
        parallaxItems: document.querySelectorAll('.parallax'),
        
        init: function() {
            window.addEventListener('scroll', () => {
                this.updateParallax();
            });
            
            // 初期設定
            this.updateParallax();
        },
        
        updateParallax: function() {
            const scrollTop = window.scrollY;
            
            this.parallaxItems.forEach(item => {
                const speed = item.getAttribute('data-parallax-speed') || 0.5;
                const yPos = -(scrollTop * speed);
                
                item.style.transform = `translate3d(0, ${yPos}px, 0)`;
            });
        }
    };
    
    // 初期化
    navAnimation.init();
    scrollAnimation.init();
    tiltEffect.init();
    skillAnimation.init();
    glitchEffect.init();
    typewriterEffect.init();
    scrollTrigger.init();
    parallaxEffect.init();
});