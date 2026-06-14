/*=================================================
//    ハンバーガーメニュー
===================================================*/

$(function () {
    $('.hamburger').on('click', function () {
        $('.header-nav').toggleClass('open');
    });

    $('.mask, nav a, main').on('click', function () {
        $('.header-nav').removeClass('open');
    });
});



/*=================================================
//    fadein
===================================================*/
$(window).on('load scroll', function () {
    $(".fadein").each(function () {
        let scroll = $(window).scrollTop();
        let target = $(this).offset().top;
        let windowHeight = $(window).height();

        if (scroll > target - windowHeight + 100) {
            $(this).addClass("show");
        }
    });
});



/*=================================================
//    cursor
===================================================*/

// const dot = document.getElementById('cursor-dot');
// const ring = document.getElementById('cursor-ring');

// document.addEventListener('mousemove', function (e) {
//     dot.style.left = e.clientX + 'px';
//     dot.style.top = e.clientY + 'px';
//     ring.style.left = e.clientX + 'px';
//     ring.style.top = e.clientY + 'px';
// });

// document.querySelectorAll('a, button').forEach(function (el) {
//     el.addEventListener('mouseenter', function () {
//         ring.style.width = '44px';
//         ring.style.height = '44px';
//         ring.style.opacity = '0.4';
//     });
//     el.addEventListener('mouseleave', function () {
//         ring.style.width = '28px';
//         ring.style.height = '28px';
//         ring.style.opacity = '0.6';
//     });
// });

const dot = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');

document.addEventListener('mousemove', function (e) {
    // 💡タブレットサイズ以下の時は処理をスキップ
    if (window.innerWidth <= 1024) return;

    dot.style.left = e.clientX + 'px';
    dot.style.top = e.clientY + 'px';
    ring.style.left = e.clientX + 'px';
    ring.style.top = e.clientY + 'px';
});

document.querySelectorAll('a, button').forEach(function (el) {
    el.addEventListener('mouseenter', function () {
        // 💡タブレットサイズ以下の時は処理をスキップ
        if (window.innerWidth <= 1024) return;

        ring.style.width = '44px';
        ring.style.height = '44px';
        ring.style.opacity = '0.4';
    });
    el.addEventListener('mouseleave', function () {
        // 💡タブレットサイズ以下の時は処理をスキップ
        if (window.innerWidth <= 1024) return;

        ring.style.width = '28px';
        ring.style.height = '28px';
        ring.style.opacity = '0.6';
    });
});

/*=================================================
//    ripple
===================================================*/

(function () {
    const BG_COLOR = '#FFFFFF';
    const RIPPLE_RGB = [180, 160, 140];
    const WAVE_COLOR = 'rgba(180,164,146,0.055)';
    const WAVE_SPACING = 32;
    const WAVE_SPEED = 0.004;
    const AUTO_INTERVAL = 2400;
    const MOUSE_COOLDOWN = 280;

    const canvas = document.getElementById('ripple-canvas');
    const ctx = canvas.getContext('2d');

    let W, H;

    function resizeCanvas() {
        W = window.innerWidth;
        H = window.innerHeight;
        canvas.width = W;
        canvas.height = H;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);


    /* ── Ripple クラス ── */
    function Ripple(x, y, isAuto) {
        this.x = x;
        this.y = y;
        this.r = 0;
        this.maxR = isAuto ? 55 + Math.random() * 45 : 90 + Math.random() * 60;
        this.alpha = isAuto ? 0.14 : 0.25;
        this.speed = isAuto ? 0.6 + Math.random() * 0.5 : 1.1 + Math.random() * 0.4;
        this.rings = isAuto ? 2 : 3;
    }

    Ripple.prototype.draw = function () {
        for (var i = 0; i < this.rings; i++) {
            var r = this.r - i * 20;
            if (r < 0) continue;
            var fade = 1 - r / this.maxR;
            var a = this.alpha * fade * fade;
            if (a <= 0.002) continue;
            ctx.beginPath();
            ctx.arc(this.x, this.y, r, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(' + RIPPLE_RGB[0] + ',' + RIPPLE_RGB[1] + ',' + RIPPLE_RGB[2] + ',' + a + ')';
            ctx.lineWidth = 0.7;
            ctx.stroke();
        }
        this.r += this.speed;
    };

    Ripple.prototype.isDone = function () {
        return this.r > this.maxR + this.rings * 20;
    };


    /* ── 波紋リスト & イベント ── */
    var ripples = [];
    var lastRippleAt = 0;

    document.addEventListener('mousemove', function (e) {
        var now = Date.now();
        if (now - lastRippleAt < MOUSE_COOLDOWN) return;
        ripples.push(new Ripple(e.clientX, e.clientY, false));
        lastRippleAt = now;
    });

    document.addEventListener('click', function (e) {
        ripples.push(new Ripple(e.clientX, e.clientY, false));
    });


    /* ── 自動波紋 ── */
    function spawnAutoRipple() {
        ripples.push(new Ripple(
            80 + Math.random() * (W - 160),
            80 + Math.random() * (H - 160),
            true
        ));
    }
    setTimeout(spawnAutoRipple, 800);
    setTimeout(spawnAutoRipple, 1600);
    setInterval(spawnAutoRipple, AUTO_INTERVAL);


    /* ── 水面ゆらぎ描画 ── */
    var waveTime = 0;

    function drawWater() {
        // ctx.fillStyle = BG_COLOR;
        ctx.clearRect(0, 0, W, H);
        for (var y = 0; y <= H + WAVE_SPACING; y += WAVE_SPACING) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            for (var x = 0; x <= W; x += 3) {
                var wave =
                    Math.sin(x * 0.011 + waveTime) * 2.2
                    + Math.sin(x * 0.006 - waveTime * 1.4) * 1.4
                    + Math.sin(x * 0.019 + waveTime * 0.7) * 0.7;
                ctx.lineTo(x, y + wave);
            }
            ctx.strokeStyle = WAVE_COLOR;
            ctx.lineWidth = 0.5;
            ctx.stroke();
        }
        waveTime += WAVE_SPEED;
    }


    /* ── メインループ ── */
    function loop() {
        drawWater();
        ripples = ripples.filter(function (r) { return !r.isDone(); });
        ripples.forEach(function (r) { r.draw(); });
        requestAnimationFrame(loop);
    }
    loop();

})();


/*=================================================
//    fv gradient background (autonomous)
===================================================*/

(function () {
    const blobs = [...document.querySelectorAll('.fv-blob')];
    if (!blobs.length) return;

    const states = blobs.map(() => ({
        x: 0, y: 0,
        tx: 0, ty: 0,
        vx: 0, vy: 0,
        waitUntil: 0,
    }));

    const ranges = [100, 80, 120, 70, 90];

    function nextTarget(state, range) {
        state.tx = (Math.random() - 0.5) * 2 * range;
        state.ty = (Math.random() - 0.5) * 2 * range;
        state.waitUntil = Date.now() + 3000 + Math.random() * 5000;
    }

    states.forEach((state, i) => {
        state.waitUntil = Date.now() + i * 800;
    });

    function tick() {
        const now = Date.now();
        states.forEach((state, i) => {
            if (now >= state.waitUntil) {
                nextTarget(state, ranges[i] ?? 90);
            }
            state.vx += (state.tx - state.x) * 0.012;
            state.vy += (state.ty - state.y) * 0.012;
            state.vx *= 0.92;
            state.vy *= 0.92;
            state.x += state.vx;
            state.y += state.vy;
            blobs[i].style.setProperty('--px', `${state.x.toFixed(2)}px`);
            blobs[i].style.setProperty('--py', `${state.y.toFixed(2)}px`);
        });
        requestAnimationFrame(tick);
    }

    tick();
})();