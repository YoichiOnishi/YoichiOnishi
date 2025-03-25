// js/cursor.js

document.addEventListener('DOMContentLoaded', function() {
    // カーソルフォロワーの初期化
    const cursor = {
        dot: document.querySelector('.cursor-dot'),
        follower: document.querySelector('.cursor-follower'),
        links: document.querySelectorAll('a, button, .skill-arc, .project-card, .video-container, .profile-image'),
        
        init: function() {
            // カーソルの移動
            document.addEventListener('mousemove', (e) => {
                this.moveCursor(e);
            });
            
            // ホバー効果
            this.addHoverEffects();
            
            // タッチデバイスではカーソルを非表示
            this.checkDevice();
            
            // ウィンドウがリサイズされたときに再チェック
            window.addEventListener('resize', () => {
                this.checkDevice();
            });
        },
        
        moveCursor: function(e) {
            // 滑らかなカーソル移動
            this.dot.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
        },
        
        addHoverEffects: function() {
            // リンクにホバーしたときのエフェクト
            this.links.forEach(link => {
                link.addEventListener('mouseenter', () => {
                    this.dot.style.transform = 'scale(3)';
                    this.dot.style.opacity = '0.5';
                });
                
                link.addEventListener('mouseleave', () => {
                    this.dot.style.transform = 'scale(1)';
                    this.dot.style.opacity = '1';
                });
            });
        },
        
        checkDevice: function() {
            // タッチデバイスかどうかをチェック
            if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
                this.follower.style.display = 'none';
            } else {
                this.follower.style.display = 'block';
            }
        }
    };
    
    // カーソルフォロワーを初期化
    cursor.init();
});