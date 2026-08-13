(function () {
'use strict';
var root = document.documentElement;
var reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
function reveal() {
window.__zefirRevealed = true;          // гасим инлайновую страховку
var items = document.querySelectorAll('[data-anim]');
if (reduced || !('IntersectionObserver' in window)) {
for (var i = 0; i < items.length; i++) items[i].classList.add('is-in');
return;
}
var io = new IntersectionObserver(function (es, o) {
es.forEach(function (e) {
if (e.isIntersecting) { e.target.classList.add('is-in'); o.unobserve(e.target); }
});
}, { rootMargin: '0px 0px -5% 0px' });
for (var j = 0; j < items.length; j++) io.observe(items[j]);
}
(function () {
var head = document.getElementById('head');
if (!head) return;
var t = 0;
function frame() {
t = 0;
head.style.setProperty('--p', Math.min(1, scrollY / 120).toFixed(3));
}
addEventListener('scroll', function () {
if (!t) t = requestAnimationFrame(frame);
}, { passive: true });
frame();
})();
(function () {
var cur = document.getElementById('cur');
var mark = document.getElementById('curMark');
var word = cur && cur.querySelector('.cur__word');
var target = document.getElementById('headMark');
if (!cur) return;
var done = false;
var timers = [];
var guard;
function at(ms, fn) { timers.push(setTimeout(fn, ms)); }
function kill() {
if (done) return;
done = true;
try {
clearTimeout(guard);
timers.forEach(clearTimeout);
root.classList.remove('cur-on', 'cur-go', 'cur-part', 'cur-fly');
root.classList.add('cur-off');
} catch (e) {  }
if (cur.parentNode) cur.parentNode.removeChild(cur);
}
guard = setTimeout(kill, 4600);
window.__zefirCurtainOwned = true;
if (reduced || !target) { kill(); return; }
function skip() { kill(); }
['wheel', 'touchstart', 'pointerdown', 'keydown'].forEach(function (t) {
addEventListener(t, skip, { once: true, passive: true });
});
at(80, function () { root.classList.add('cur-go'); });
at(500, function () { root.classList.add('cur-part'); });
at(2060, function () {
var w = word.getBoundingClientRect();
var t = target.getBoundingClientRect();
var m = mark.getBoundingClientRect();
if (!w.width || !t.width) { kill(); return; }
var s = t.width / w.width;
var mx = m.left + m.width / 2, my = m.top + m.height / 2;
var wx = w.left + w.width / 2, wy = w.top + w.height / 2;
var tx = t.left + t.width / 2, ty = t.top + t.height / 2;
mark.style.setProperty('--fx', (tx - mx - (wx - mx) * s).toFixed(1) + 'px');
mark.style.setProperty('--fy', (ty - my - (wy - my) * s).toFixed(1) + 'px');
mark.style.setProperty('--fs', s.toFixed(4));
root.classList.add('cur-fly');
root.classList.remove('cur-on');          // страница отпирается
root.classList.add('cur-off');            // шапка и первый экран проявляются
});
at(2890, kill);
})();
var yr = document.getElementById('yr');
if (yr) yr.textContent = new Date().getFullYear();
reveal();
})();