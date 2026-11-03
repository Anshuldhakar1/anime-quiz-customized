var PORTRAITS_ONLINE = true;
var $ = function (id) { return document.getElementById(id); };
var SAVE_KEY = "anime-quiz-v3-progress";
var picks = [], index = 0, locked = false, lastShare = "", current = null;

function esc(s) {
  return String(s).replace(/[&<>"]/g, function (ch) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[ch]; });
}
function kanjiNumber(n) {
  var d = ["", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
  if (n < 10) return d[n];
  var tens = Math.floor(n / 10), ones = n % 10;
  return (tens > 1 ? d[tens] : "") + "十" + d[ones];
}

function save() {
  try { localStorage.setItem(SAVE_KEY, JSON.stringify({ n: SLOTS.length, picks: picks, index: index })); } catch (e) {}
}
function clearSave() {
  try { localStorage.removeItem(SAVE_KEY); } catch (e) {}
}
function loadSave() {
  try {
    var s = JSON.parse(localStorage.getItem(SAVE_KEY));
    if (s && s.n === SLOTS.length && Array.isArray(s.picks) && s.index > 0 && s.index < SLOTS.length) return s;
  } catch (e) {}
  return null;
}

function drawBurst() {
  try {
    var size = 1000, cv = document.createElement("canvas");
    cv.width = cv.height = size;
    var x = cv.getContext("2d"), m = size / 2, angle = 0;
    x.fillStyle = "#000";
    while (angle < Math.PI * 2) {
      var width = .004 + Math.random() * .016;
      var inner = m * (.5 + Math.random() * .3);
      var mid = angle + width / 2;
      x.beginPath();
      x.moveTo(m + Math.cos(mid) * inner, m + Math.sin(mid) * inner);
      x.lineTo(m + Math.cos(angle) * m * 1.5, m + Math.sin(angle) * m * 1.5);
      x.lineTo(m + Math.cos(angle + width) * m * 1.5, m + Math.sin(angle + width) * m * 1.5);
      x.closePath();
      x.fill();
      angle += width + .012 + Math.random() * .03;
    }
    document.documentElement.style.setProperty("--burst", "url(" + cv.toDataURL("image/png") + ")");
    document.querySelectorAll(".burst").forEach(function (el) { el.classList.add("ready"); });
  } catch (e) { /* The page reads fine without the lines. */ }
}

/* ================= Splash art ================= */
function seeded(str) {
  var h = 2166136261;
  for (var i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
  return function () {
    h += 0x6D2B79F5; var t = h;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
function rgb(hex) { hex = hex.replace("#", ""); return [0, 2, 4].map(function (i) { return parseInt(hex.substr(i, 2), 16); }); }
function mix(a, b, t) {
  var A = rgb(a), B = rgb(b);
  return "#" + A.map(function (v, i) { var n = Math.round(v + (B[i] - v) * t); return (n < 16 ? "0" : "") + n.toString(16); }).join("");
}
function rgba(hex, a) { return "rgba(" + rgb(hex).join(",") + "," + a + ")"; }

function heartPath(x, cx, cy, s) {
  x.beginPath();
  x.moveTo(cx, cy + s * .55);
  x.bezierCurveTo(cx - s * 1.05, cy - s * .05, cx - s * .55, cy - s * .95, cx, cy - s * .38);
  x.bezierCurveTo(cx + s * .55, cy - s * .95, cx + s * 1.05, cy - s * .05, cx, cy + s * .55);
  x.closePath();
}
function starPath(x, cx, cy, r1, r2, n, rot) {
  x.beginPath();
  for (var i = 0; i < n * 2; i++) {
    var r = i % 2 ? r2 : r1, a = rot + i * Math.PI / n;
    x[i ? "lineTo" : "moveTo"](cx + Math.cos(a) * r, cy + Math.sin(a) * r);
  }
  x.closePath();
}
/* Manga-style emblem: hard ink shadow, then fill, then outline. */
function inked(x, pathFn, fill, ink, lw, off) {
  x.save(); x.translate(off, off); pathFn(); x.fillStyle = ink; x.fill(); x.restore();
  pathFn(); x.fillStyle = fill; x.fill();
  x.lineWidth = lw; x.strokeStyle = ink; x.lineJoin = "round"; x.stroke();
}

function drawSplash(cv, c, T, fw, fh) {
  var w = fw || cv.clientWidth, h = fh || cv.clientHeight;
  if (!w || !h) return;
  var dpr = fw ? 2 : Math.min(2, window.devicePixelRatio || 1);
  cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
  var x = cv.getContext("2d");
  x.setTransform(dpr, 0, 0, dpr, 0, 0);
  var R = seeded(c.name), W = w, H = h, M = Math.min(W, H), wide = W > H * 1.1;
  var ink = "#101218", paper = "#fffaf2";
  var silo = mix(T.sky[0], "#000000", .55);
  var i, n;

  /* sky */
  var sky = x.createLinearGradient(0, 0, 0, H);
  sky.addColorStop(0, T.sky[0]);
  sky.addColorStop(.6, mix(T.sky[1], c.spot, .3));
  sky.addColorStop(1, mix(T.sky[1], c.spot, .65));
  x.fillStyle = sky; x.fillRect(0, 0, W, H);

  var ox = W * (wide ? .64 : .55), oy = H * (wide ? .4 : .34), or = M * (wide ? .25 : .27);
  var horizon = H * (wide ? .7 : .66);

  /* light rays from the orb */
  x.fillStyle = T.orb === "eclipse" ? "rgba(255,255,255,.07)" : "rgba(255,255,255,.13)";
  for (var a = 0; a < Math.PI * 2;) {
    var wdt = .02 + R() * .05;
    x.beginPath(); x.moveTo(ox, oy);
    x.lineTo(ox + Math.cos(a) * W * 2, oy + Math.sin(a) * W * 2);
    x.lineTo(ox + Math.cos(a + wdt) * W * 2, oy + Math.sin(a + wdt) * W * 2);
    x.fill();
    a += wdt + .05 + R() * .12;
  }

  var art = getArt(c.name);
  if (art) {
    var sc0 = Math.max(W / art.naturalWidth, H / art.naturalHeight);
    var iw = art.naturalWidth * sc0, ih = art.naturalHeight * sc0;
    x.drawImage(art, (W - iw) / 2, Math.min(0, (H - ih) * .25), iw, ih);
    var shade = x.createLinearGradient(0, H * .45, 0, H);
    shade.addColorStop(0, "rgba(0,0,0,0)"); shade.addColorStop(1, rgba(mix(c.spot, "#000000", .55), .75));
    x.fillStyle = shade; x.fillRect(0, 0, W, H);
  } else {
  /* sun, moon or eclipse */
  if (T.orb === "sun") {
    var glow = x.createRadialGradient(ox, oy, or * .2, ox, oy, or * 1.9);
    glow.addColorStop(0, "rgba(255,255,240,.95)"); glow.addColorStop(.45, rgba(mix(c.spot, "#ffffff", .5), .45)); glow.addColorStop(1, "rgba(255,255,255,0)");
    x.fillStyle = glow; x.beginPath(); x.arc(ox, oy, or * 1.9, 0, 7); x.fill();
    x.fillStyle = "rgba(255,252,236,.92)"; x.beginPath(); x.arc(ox, oy, or, 0, 7); x.fill();
  } else if (T.orb === "moon") {
    var mg = x.createRadialGradient(ox, oy, or * .5, ox, oy, or * 2);
    mg.addColorStop(0, "rgba(255,255,255,.35)"); mg.addColorStop(1, "rgba(255,255,255,0)");
    x.fillStyle = mg; x.beginPath(); x.arc(ox, oy, or * 2, 0, 7); x.fill();
    x.fillStyle = T.name === "Yandere" ? "#ffd6dc" : "#fff6dd"; x.beginPath(); x.arc(ox, oy, or, 0, 7); x.fill();
    x.fillStyle = "rgba(0,0,0,.06)";
    for (i = 0; i < 6; i++) { x.beginPath(); x.arc(ox + (R() - .5) * or * 1.2, oy + (R() - .5) * or * 1.2, or * (.08 + R() * .14), 0, 7); x.fill(); }
  } else if (T.orb === "eclipse") {
    x.save(); x.shadowColor = mix(c.spot, "#ffffff", .4); x.shadowBlur = M * .08;
    x.strokeStyle = mix(c.spot, "#ffffff", .6); x.lineWidth = M * .012;
    x.beginPath(); x.arc(ox, oy, or * 1.02, 0, 7); x.stroke(); x.restore();
    x.fillStyle = "#07060c"; x.beginPath(); x.arc(ox, oy, or, 0, 7); x.fill();
  }

  /* emblem, sitting in front of the orb */
  var s = or * .95, lw = Math.max(2.5, M * .011), off = Math.max(3, M * .014);
  var E = fw || !(current && current.portrait && current.c === c) ? T.emblem : "none";
  if (E === "heart" || E === "crackheart" || E === "dripheart") {
    var hc = E === "dripheart" ? "#d81b4a" : E === "crackheart" ? mix(c.spot, "#ff3b6b", .35) : mix(c.spot, "#ff6f9c", .3);
    inked(x, function () { heartPath(x, ox, oy, s); }, hc, ink, lw, off);
    if (E === "crackheart") {
      x.beginPath(); x.moveTo(ox, oy - s * .38);
      x.lineTo(ox - s * .12, oy - s * .15); x.lineTo(ox + s * .1, oy + .02 * s); x.lineTo(ox - s * .08, oy + s * .2); x.lineTo(ox + s * .03, oy + s * .52);
      x.lineWidth = lw * 1.6; x.strokeStyle = ink; x.stroke();
    }
    if (E === "dripheart") {
      x.fillStyle = "#d81b4a"; x.strokeStyle = ink; x.lineWidth = lw * .8;
      [[-.32, .9], [.05, 1.25], [.3, .75]].forEach(function (d) {
        var dx = ox + d[0] * s, top = oy + s * .2 - Math.abs(d[0]) * s * .4, len = s * d[1] * .5;
        x.beginPath(); x.moveTo(dx - s * .05, top); x.lineTo(dx - s * .05, top + len);
        x.arc(dx, top + len, s * .05, Math.PI, 0, true); x.lineTo(dx + s * .05, top); x.fill(); x.stroke();
      });
    }
    x.fillStyle = "rgba(255,255,255,.75)"; x.beginPath(); x.ellipse(ox - s * .42, oy - s * .38, s * .12, s * .07, -.6, 0, 7); x.fill();
  } else if (E === "snowflake") {
    var arm = function (col, width) {
      x.strokeStyle = col; x.lineWidth = width; x.lineCap = "round";
      for (var k = 0; k < 6; k++) {
        var an = k * Math.PI / 3 - Math.PI / 2, ca = Math.cos(an), sa = Math.sin(an);
        x.beginPath(); x.moveTo(ox, oy); x.lineTo(ox + ca * s * .85, oy + sa * s * .85); x.stroke();
        [.4, .62].forEach(function (p) {
          var bx = ox + ca * s * p, by = oy + sa * s * p, bl = s * .22;
          [-.6, .6].forEach(function (d) {
            x.beginPath(); x.moveTo(bx, by); x.lineTo(bx + Math.cos(an + d) * bl, by + Math.sin(an + d) * bl); x.stroke();
          });
        });
      }
    };
    arm(ink, lw * 4.2); arm("#ffffff", lw * 1.9);
  } else if (E === "crown") {
    inked(x, function () {
      x.beginPath();
      x.moveTo(ox - s * .8, oy + s * .45); x.lineTo(ox - s * .9, oy - s * .35);
      x.lineTo(ox - s * .45, oy + s * .02); x.lineTo(ox, oy - s * .6); x.lineTo(ox + s * .45, oy + s * .02);
      x.lineTo(ox + s * .9, oy - s * .35); x.lineTo(ox + s * .8, oy + s * .45); x.closePath();
    }, "#ffd54a", ink, lw, off);
    [[-.9, -.35], [0, -.6], [.9, -.35]].forEach(function (p) { inked(x, function () { x.beginPath(); x.arc(ox + p[0] * s, oy + p[1] * s - s * .08, s * .1, 0, 7); }, "#fff4c2", ink, lw, 0); });
    [-.4, 0, .4].forEach(function (p, k) { inked(x, function () { x.beginPath(); x.arc(ox + p * s, oy + s * .25, s * .08, 0, 7); }, k === 1 ? c.spot : "#ff5a7a", ink, lw * .8, 0); });
  } else if (E === "halo") {
    x.save(); x.shadowColor = "#ffe9a8"; x.shadowBlur = M * .05;
    x.strokeStyle = "#ffe9a8"; x.lineWidth = s * .13;
    x.beginPath(); x.ellipse(ox, oy - s * .1, s * .95, s * .3, 0, 0, 7); x.stroke(); x.restore();
    x.strokeStyle = "#fffaf0"; x.lineWidth = s * .04;
    x.beginPath(); x.ellipse(ox, oy - s * .1, s * .95, s * .3, 0, 0, 7); x.stroke();
  } else if (E === "smirk") {
    inked(x, function () {
      x.beginPath();
      x.moveTo(ox - s * .85, oy - s * .15);
      x.quadraticCurveTo(ox, oy + s * .95, ox + s * .85, oy - s * .3);
      x.quadraticCurveTo(ox, oy + s * .5, ox - s * .85, oy - s * .15);
      x.closePath();
    }, paper, ink, lw, off);
    inked(x, function () { x.beginPath(); x.moveTo(ox + s * .28, oy + s * .23); x.lineTo(ox + s * .4, oy + s * .5); x.lineTo(ox + s * .47, oy + s * .17); x.closePath(); }, "#ffffff", ink, lw * .8, 0);
    x.strokeStyle = ink; x.lineWidth = lw * 1.4; x.lineCap = "round";
    x.beginPath(); x.moveTo(ox - s * .55, oy - s * .62); x.quadraticCurveTo(ox - s * .35, oy - s * .78, ox - s * .15, oy - s * .62); x.stroke();
    x.beginPath(); x.moveTo(ox + s * .15, oy - s * .66); x.lineTo(ox + s * .55, oy - s * .66); x.stroke();
  } else if (E === "spiral") {
    var sp = function (col, width) {
      x.beginPath(); x.strokeStyle = col; x.lineWidth = width; x.lineCap = "round";
      for (var t = 0; t < 20; t += .1) { var rr = s * .045 * t; x[t ? "lineTo" : "moveTo"](ox + Math.cos(t) * rr, oy + Math.sin(t) * rr); }
      x.stroke();
    };
    sp(ink, lw * 3.6); sp("#ffffff", lw * 1.6);
  } else if (E === "sun") {
    inked(x, function () { starPath(x, ox, oy, s * .95, s * .62, 14, R()); }, "#fff2a0", ink, lw, off);
    inked(x, function () { x.beginPath(); x.arc(ox, oy, s * .45, 0, 7); }, "#ffb03a", ink, lw, 0);
    x.strokeStyle = ink; x.lineWidth = lw * 1.2; x.lineCap = "round";
    x.beginPath(); x.arc(ox - s * .15, oy - s * .05, s * .07, Math.PI, 0); x.stroke();
    x.beginPath(); x.arc(ox + s * .15, oy - s * .05, s * .07, Math.PI, 0); x.stroke();
    x.beginPath(); x.arc(ox, oy + s * .08, s * .16, .2, Math.PI - .2); x.stroke();
  } else if (E === "flame") {
    var fg = x.createLinearGradient(0, oy - s, 0, oy + s * .7);
    fg.addColorStop(0, "#fff3a0"); fg.addColorStop(.5, "#ff9a1f"); fg.addColorStop(1, "#e8301c");
    inked(x, function () {
      x.beginPath(); x.moveTo(ox, oy + s * .7);
      x.bezierCurveTo(ox - s * .85, oy + s * .6, ox - s * .7, oy - s * .2, ox - s * .2, oy - s * .45);
      x.bezierCurveTo(ox - s * .3, oy - s * .1, ox - s * .05, oy - s * .1, ox, oy - s * 1.05);
      x.bezierCurveTo(ox + s * .3, oy - s * .5, ox + s * .85, oy - s * .1, ox + s * .55, oy + s * .4);
      x.bezierCurveTo(ox + s * .45, oy + s * .62, ox + s * .2, oy + s * .72, ox, oy + s * .7);
      x.closePath();
    }, fg, ink, lw, off);
  } else if (E === "circle") {
    var col = mix(c.spot, "#ffffff", .55);
    x.save(); x.shadowColor = col; x.shadowBlur = M * .04; x.strokeStyle = col; x.lineWidth = lw;
    [1, .82, .3].forEach(function (k) { x.beginPath(); x.arc(ox, oy, s * k, 0, 7); x.stroke(); });
    for (var tri = 0; tri < 2; tri++) {
      x.beginPath();
      for (i = 0; i < 3; i++) { var ta = (tri ? Math.PI / 2 : -Math.PI / 2) + i * Math.PI * 2 / 3; x[i ? "lineTo" : "moveTo"](ox + Math.cos(ta) * s * .82, oy + Math.sin(ta) * s * .82); }
      x.closePath(); x.stroke();
    }
    x.fillStyle = col; x.font = Math.round(s * .11) + "px " + "\"Dela Gothic One\", sans-serif"; x.textAlign = "center"; x.textBaseline = "middle";
    var runes = "封印解放闇炎契約永遠運命魔眼";
    for (i = 0; i < 14; i++) {
      var ra = i / 14 * Math.PI * 2;
      x.save(); x.translate(ox + Math.cos(ra) * s * .91, oy + Math.sin(ra) * s * .91); x.rotate(ra + Math.PI / 2); x.fillText(runes[i], 0, 0); x.restore();
    }
    x.restore();
  } else if (E === "book") {
    inked(x, function () {
      x.beginPath(); x.moveTo(ox, oy - s * .35);
      x.quadraticCurveTo(ox - s * .45, oy - s * .6, ox - s * .95, oy - s * .4);
      x.lineTo(ox - s * .95, oy + s * .45); x.quadraticCurveTo(ox - s * .45, oy + s * .25, ox, oy + s * .5);
      x.quadraticCurveTo(ox + s * .45, oy + s * .25, ox + s * .95, oy + s * .45);
      x.lineTo(ox + s * .95, oy - s * .4); x.quadraticCurveTo(ox + s * .45, oy - s * .6, ox, oy - s * .35);
      x.closePath();
    }, paper, ink, lw, off);
    x.strokeStyle = ink; x.lineWidth = lw * .9;
    x.beginPath(); x.moveTo(ox, oy - s * .35); x.lineTo(ox, oy + s * .5); x.stroke();
    x.lineWidth = lw * .5; x.strokeStyle = rgba(ink, .45);
    for (i = 0; i < 5; i++) {
      var ly = oy - s * .2 + i * s * .13;
      x.beginPath(); x.moveTo(ox - s * .8, ly); x.quadraticCurveTo(ox - s * .4, ly - s * .12, ox - s * .1, ly); x.stroke();
      x.beginPath(); x.moveTo(ox + s * .1, ly); x.quadraticCurveTo(ox + s * .4, ly - s * .12, ox + s * .8, ly); x.stroke();
    }
    inked(x, function () { heartPath(x, ox + s * .55, oy - s * .62, s * .2); }, mix(c.spot, "#ff6f9c", .4), ink, lw * .7, 0);
  } else if (E === "mask") {
    inked(x, function () { x.beginPath(); x.ellipse(ox, oy, s * .62, s * .8, 0, 0, 7); }, paper, ink, lw, off);
    x.strokeStyle = ink; x.lineWidth = lw * 1.5; x.lineCap = "round";
    x.beginPath(); x.arc(ox - s * .24, oy - s * .1, s * .13, Math.PI * 1.1, Math.PI * 1.9); x.stroke();
    x.beginPath(); x.arc(ox + s * .24, oy - s * .1, s * .13, Math.PI * 1.1, Math.PI * 1.9); x.stroke();
    x.beginPath(); x.arc(ox, oy + s * .12, s * .32, .25, Math.PI - .25); x.stroke();
    x.fillStyle = rgba(c.spot, .55);
    x.beginPath(); x.ellipse(ox - s * .38, oy + s * .14, s * .1, s * .05, 0, 0, 7); x.fill();
    x.beginPath(); x.ellipse(ox + s * .38, oy + s * .14, s * .1, s * .05, 0, 0, 7); x.fill();
    x.strokeStyle = ink; x.lineWidth = lw * .8;
    x.beginPath(); x.moveTo(ox + s * .2, oy - s * .78); x.lineTo(ox + s * .12, oy - s * .5); x.lineTo(ox + s * .22, oy - s * .36); x.stroke();
  } else if (E === "target") {
    var ring = function (col, width) {
      x.strokeStyle = col; x.lineWidth = width;
      [.9, .6, .3].forEach(function (k) { x.beginPath(); x.arc(ox, oy, s * k, 0, 7); x.stroke(); });
      x.beginPath(); x.moveTo(ox - s * 1.25, oy); x.lineTo(ox + s * 1.25, oy); x.moveTo(ox, oy - s * 1.25); x.lineTo(ox, oy + s * 1.25); x.stroke();
    };
    ring(rgba(ink, .7), lw * 3); ring("#e6fffb", lw * 1.2);
    x.fillStyle = "#ff3b4f"; x.beginPath(); x.arc(ox, oy, s * .08, 0, 7); x.fill();
  } else if (E === "blade") {
    x.save(); x.translate(ox, oy); x.rotate(-.75);
    x.fillStyle = "rgba(255,255,255,.35)"; x.fillRect(-s * 1.6, -s * .03, s * 3.2, s * .06);
    inked(x, function () { x.beginPath(); x.moveTo(-s * .55, -s * .05); x.lineTo(s * 1.25, -s * .07); x.quadraticCurveTo(s * 1.4, -s * .02, s * 1.3, s * .06); x.lineTo(-s * .55, s * .06); x.closePath(); }, "#eef3ff", ink, lw, off);
    inked(x, function () { x.beginPath(); x.ellipse(-s * .58, 0, s * .06, s * .2, 0, 0, 7); }, "#c9a24a", ink, lw, 0);
    inked(x, function () { x.beginPath(); x.rect(-s * 1.15, -s * .07, s * .55, s * .14); }, "#20232c", ink, lw, 0);
    x.strokeStyle = mix(c.spot, "#ffffff", .3); x.lineWidth = lw * .8;
    for (i = 0; i < 5; i++) { var hx = -s * 1.1 + i * s * .1; x.beginPath(); x.moveTo(hx, -s * .07); x.lineTo(hx + s * .05, s * .07); x.stroke(); }
    x.restore();
  }

  /* scenery */
  x.lineCap = "butt";
  var sc = T.scene;
  var ridge = function (y0, amp, col, steps) {
    x.fillStyle = col; x.beginPath(); x.moveTo(0, H);
    for (var k = 0; k <= steps; k++) x.lineTo(W * k / steps, y0 - Math.sin(k * 1.7 + R() * 2) * amp - R() * amp);
    x.lineTo(W, H); x.closePath(); x.fill();
  };
  var skyline = function (base, col, minH, maxH, windows) {
    for (var bx = -10; bx < W;) {
      var bw = M * (.05 + R() * .1), bh = H * (minH + R() * (maxH - minH));
      x.fillStyle = col; x.fillRect(bx, base - bh, bw, H);
      if (windows) {
        x.fillStyle = rgba(mix(c.spot, "#fff3b0", .5), .8);
        for (var wy = base - bh + 8; wy < base - 6; wy += 12) for (var wx = bx + 5; wx < bx + bw - 6; wx += 10) if (R() < .3) x.fillRect(wx, wy, 4, 6);
      }
      bx += bw + 2;
    }
  };
  if (sc === "city" || sc === "room") {
    skyline(horizon + H * .04, mix(silo, T.sky[1], .35), .1, .28, false);
    skyline(horizon + H * .14, silo, .06, .2, true);
    if (sc === "city") {
      x.fillStyle = silo; x.fillRect(0, H * .9, W, H);
      x.strokeStyle = silo; x.lineWidth = Math.max(2, M * .008);
      x.beginPath(); x.moveTo(0, H * .84); x.lineTo(W, H * .84); x.stroke();
      for (var fx = 6; fx < W; fx += M * .045) { x.beginPath(); x.moveTo(fx, H * .84); x.lineTo(fx, H * .9); x.stroke(); }
    } else {
      var frame = mix("#fff4e6", c.spot, .12), fw = Math.max(8, M * .035);
      x.fillStyle = frame;
      x.fillRect(0, 0, W, fw); x.fillRect(0, H * .88, W, H * .12);
      x.fillRect(0, 0, fw, H); x.fillRect(W - fw, 0, fw, H);
      x.fillRect(W * (wide ? .3 : .22) - fw / 2, 0, fw, H * .88);
      x.fillRect(0, H * .2 - fw / 2, W, fw * .8);
      x.strokeStyle = rgba(ink, .5); x.lineWidth = 2;
      x.strokeRect(fw, fw, W - fw * 2, H * .88 - fw);
      var cur = x.createLinearGradient(W - W * .16, 0, W, 0);
      cur.addColorStop(0, "rgba(255,255,255,.9)"); cur.addColorStop(1, rgba(mix("#ffffff", c.spot, .3), .95));
      x.fillStyle = cur; x.beginPath(); x.moveTo(W, 0); x.lineTo(W - W * .12, 0);
      for (var cy = 0; cy <= H * .88; cy += H * .08) x.quadraticCurveTo(W - W * (.17 + R() * .03), cy + H * .04, W - W * (.12 + cy / H * .06), cy + H * .08);
      x.lineTo(W, H * .88); x.closePath(); x.fill();
    }
  } else if (sc === "hills") {
    ridge(horizon - H * .02, H * .05, mix(silo, T.sky[1], .55), 9);
    ridge(horizon + H * .08, H * .05, mix(silo, T.sky[1], .3), 7);
    ridge(horizon + H * .18, H * .04, silo, 6);
  } else if (sc === "sea") {
    var sea = x.createLinearGradient(0, horizon, 0, H);
    sea.addColorStop(0, mix(T.sky[0], "#0a4f7a", .4)); sea.addColorStop(1, mix(T.sky[0], "#0a2540", .75));
    x.fillStyle = sea; x.fillRect(0, horizon, W, H);
    x.fillStyle = "rgba(255,255,255,.75)";
    for (i = 0; i < 14; i++) { var yy = horizon + 6 + i * (H - horizon) / 14, ww = or * (1.2 - i * .05) * (.5 + R() * .6); x.fillRect(ox - ww / 2, yy, ww, 2.5); }
    x.strokeStyle = "rgba(255,255,255,.35)"; x.lineWidth = 2;
    for (i = 0; i < 26; i++) { var wx2 = R() * W, wy2 = horizon + 10 + R() * (H - horizon); x.beginPath(); x.arc(wx2, wy2, 8 + R() * 10, Math.PI * 1.15, Math.PI * 1.85); x.stroke(); }
    x.fillStyle = "#ffe7b0"; x.beginPath(); x.moveTo(0, H); x.lineTo(0, H * .86); x.quadraticCurveTo(W * .25, H * .82, W * .45, H); x.fill();
  } else if (sc === "garden") {
    ridge(horizon + H * .06, H * .03, mix(silo, T.sky[1], .25), 8);
    x.fillStyle = silo; x.fillRect(0, H * .86, W, H);
    for (i = 0; i < 46; i++) {
      var rx = R() * W, ry = H * (.74 + R() * .2), rr2 = M * (.02 + R() * .03);
      x.fillStyle = silo; x.beginPath(); x.arc(rx, ry + rr2, rr2 * 1.6, 0, 7); x.fill();
      var rc = R() < .6 ? mix(c.spot, "#c2103c", .55) : mix(c.spot, "#ffffff", .2);
      x.fillStyle = rc; x.beginPath(); x.arc(rx, ry, rr2, 0, 7); x.fill();
      x.strokeStyle = rgba("#000000", .35); x.lineWidth = 1.2; x.beginPath();
      for (var t2 = 0; t2 < 9; t2 += .3) { var r3 = rr2 * .1 * t2; x[t2 ? "lineTo" : "moveTo"](rx + Math.cos(t2) * r3, ry + Math.sin(t2) * r3); }
      x.stroke();
    }
  } else if (sc === "void") {
    var fl = x.createLinearGradient(0, horizon, 0, H);
    fl.addColorStop(0, rgba(silo, .7)); fl.addColorStop(1, silo);
    x.fillStyle = fl; x.fillRect(0, horizon, W, H);
    x.strokeStyle = rgba(mix(c.spot, "#ffffff", .3), .5); x.lineWidth = 1.5;
    for (i = -12; i <= 12; i++) { x.beginPath(); x.moveTo(W / 2, horizon); x.lineTo(W / 2 + i * W * .18, H * 1.4); x.stroke(); }
    for (i = 1; i < 10; i++) { var gy = horizon + (H - horizon) * Math.pow(i / 9, 2); x.beginPath(); x.moveTo(0, gy); x.lineTo(W, gy); x.stroke(); }
    if (T.name === "Kamidere") {
      inked(x, function () {
        var tx = ox, ty = H * .92, tw = M * .22;
        x.beginPath(); x.moveTo(tx - tw, ty); x.lineTo(tx - tw * .8, ty - M * .18); x.lineTo(tx - tw * .55, ty - M * .18);
        x.lineTo(tx - tw * .55, ty - M * .34); x.lineTo(tx, ty - M * .42); x.lineTo(tx + tw * .55, ty - M * .34);
        x.lineTo(tx + tw * .55, ty - M * .18); x.lineTo(tx + tw * .8, ty - M * .18); x.lineTo(tx + tw, ty); x.closePath();
      }, "#2a1f4a", "#000000", lw, 0);
    }
  } else if (sc === "stage") {
    x.fillStyle = silo; x.fillRect(0, H * .84, W, H);
    x.fillStyle = "rgba(255,255,255,.14)";
    [[W * .25, 0], [W * .8, 0]].forEach(function (p) {
      x.beginPath(); x.moveTo(p[0] - 10, p[1]); x.lineTo(p[0] + 10, p[1]); x.lineTo(ox + or, H * .9); x.lineTo(ox - or, H * .9); x.fill();
    });
    x.fillStyle = "rgba(255,255,255,.22)"; x.beginPath(); x.ellipse(ox, H * .9, or * 1.1, H * .03, 0, 0, 7); x.fill();
    var cw = W * (wide ? .14 : .16), curtain = mix(c.spot, "#4a0020", .55);
    [0, 1].forEach(function (side) {
      var gx = side ? W - cw : 0, cg = x.createLinearGradient(gx, 0, gx + cw, 0);
      for (var k = 0; k <= 6; k++) cg.addColorStop(k / 6, k % 2 ? curtain : mix(curtain, "#000000", .35));
      x.fillStyle = cg; x.beginPath();
      if (!side) { x.moveTo(0, 0); x.lineTo(cw, 0); x.quadraticCurveTo(cw * .4, H * .45, cw * .7, H); x.lineTo(0, H); }
      else { x.moveTo(W, 0); x.lineTo(W - cw, 0); x.quadraticCurveTo(W - cw * .4, H * .45, W - cw * .7, H); x.lineTo(W, H); }
      x.fill();
    });
    x.fillStyle = curtain; x.fillRect(0, 0, W, H * .07);
    x.fillStyle = "#e8c35a"; for (var vx = 0; vx < W; vx += M * .06) { x.beginPath(); x.arc(vx + M * .03, H * .07, M * .03, 0, Math.PI); x.fill(); }
  } else if (sc === "flames") {
    x.fillStyle = silo; x.fillRect(0, H * .9, W, H);
    ["#c81e10", "#ff6a1f", "#ffc23a"].forEach(function (col2, layer) {
      x.fillStyle = col2;
      for (var bx2 = -20; bx2 < W + 20;) {
        var fw2 = M * (.08 + R() * .08), fh = H * (.18 + R() * .3) * (1 - layer * .25);
        x.beginPath(); x.moveTo(bx2, H);
        x.quadraticCurveTo(bx2 - fw2 * .1, H - fh * .6, bx2 + fw2 * .5, H - fh);
        x.quadraticCurveTo(bx2 + fw2 * .5, H - fh * .4, bx2 + fw2 * 1.1, H);
        x.fill();
        bx2 += fw2 * .7;
      }
    });
  } else if (sc === "festival") {
    ridge(horizon + H * .05, H * .03, mix(silo, T.sky[1], .35), 8);
    for (var row = 0; row < 2; row++) {
      var y0 = H * (.12 + row * .14), sag = H * .08;
      x.strokeStyle = rgba(ink, .7); x.lineWidth = 1.5; x.beginPath();
      for (var lx = 0; lx <= W; lx += 8) { var ly2 = y0 + Math.sin(lx / W * Math.PI) * sag; x[lx ? "lineTo" : "moveTo"](lx, ly2); } x.stroke();
      for (var lx2 = 20 + row * 25; lx2 < W; lx2 += M * .11) {
        var lyy = y0 + Math.sin(lx2 / W * Math.PI) * sag + M * .035;
        x.save(); x.shadowColor = "#ffb347"; x.shadowBlur = M * .04;
        x.fillStyle = R() < .5 ? "#ff4d3d" : "#ffad3d"; x.beginPath(); x.ellipse(lx2, lyy, M * .024, M * .032, 0, 0, 7); x.fill(); x.restore();
        x.fillStyle = "rgba(255,255,220,.6)"; x.beginPath(); x.ellipse(lx2, lyy, M * .01, M * .022, 0, 0, 7); x.fill();
      }
    }
    for (var st = 0; st < 4; st++) {
      var sx = W * (st / 4) + 6, sw = W / 4 - 12, sy = H * .82;
      x.fillStyle = silo; x.fillRect(sx + sw * .1, sy, sw * .8, H);
      x.beginPath(); x.moveTo(sx, sy); x.lineTo(sx + sw * .15, sy - H * .07); x.lineTo(sx + sw * .85, sy - H * .07); x.lineTo(sx + sw, sy); x.fillStyle = st % 2 ? c.spot : "#f4efe6"; x.fill();
      x.fillStyle = st % 2 ? "#f4efe6" : c.spot;
      for (var sb = 0; sb < 5; sb += 2) x.fillRect(sx + sw * (.15 + sb * .14), sy - H * .07, sw * .14, H * .07);
    }
  } else if (sc === "clouds") {
    var puff = function (cx2, cy2, sz, alpha) {
      x.fillStyle = "rgba(255,255,255," + alpha + ")";
      for (var k = 0; k < 7; k++) { x.beginPath(); x.arc(cx2 + (k - 3) * sz * .5, cy2 - Math.sin(k / 6 * Math.PI) * sz * .5, sz * (.45 + R() * .25), 0, 7); x.fill(); }
    };
    puff(W * .18, H * .25, M * .1, .7); puff(W * .85, H * .18, M * .08, .6);
    for (var cx3 = -20; cx3 < W + 40; cx3 += M * .14) puff(cx3, H * (.9 + R() * .05), M * .12, .95);
  } else if (sc === "shrine") {
    ridge(horizon - H * .02, H * .06, mix(silo, T.sky[1], .55), 8);
    x.fillStyle = silo; x.fillRect(0, H * .88, W, H);
    var tx2 = W * (wide ? .22 : .2), tw2 = M * .26, th = M * .5, base2 = H * .88, red = "#c8372a";
    inked(x, function () {
      x.beginPath();
      x.rect(tx2 - tw2 * .62, base2 - th, tw2 * .14, th);
      x.rect(tx2 + tw2 * .48, base2 - th, tw2 * .14, th);
      x.rect(tx2 - tw2 * .85, base2 - th * .78, tw2 * 1.7, th * .07);
      x.moveTo(tx2 - tw2 * 1.08, base2 - th * 1.04);
      x.quadraticCurveTo(tx2, base2 - th * .9, tx2 + tw2 * 1.08, base2 - th * 1.04);
      x.lineTo(tx2 + tw2 * .95, base2 - th * .9);
      x.quadraticCurveTo(tx2, base2 - th * .8, tx2 - tw2 * .95, base2 - th * .9);
      x.closePath();
    }, red, ink, lw * .8, 0);
  }

  }
  /* particles */
  var count = art ? 14 : 34 + Math.floor(R() * 14);
  for (n = 0; n < count; n++) {
    var px = R() * W, py = R() * H, ps = M * (.012 + R() * .025), rot = R() * Math.PI * 2;
    x.save(); x.translate(px, py); x.rotate(rot);
    switch (T.fx) {
      case "petals":
        x.fillStyle = R() < .7 ? "#ffd1e3" : mix(c.spot, "#ffffff", .5);
        x.beginPath(); x.ellipse(0, 0, ps, ps * .5, 0, 0, 7); x.fill(); break;
      case "snow":
        x.fillStyle = "rgba(255,255,255," + (.5 + R() * .5) + ")";
        x.beginPath(); x.arc(0, 0, ps * .3, 0, 7); x.fill(); break;
      case "hearts":
        x.globalAlpha = .55 + R() * .4; heartPath(x, 0, 0, ps * .9); x.fillStyle = R() < .5 ? "#ffffff" : mix(c.spot, "#ff4f86", .4); x.fill(); break;
      case "sparkles": case "stars":
        x.fillStyle = "rgba(255,255,255," + (.6 + R() * .4) + ")";
        if (R() < .55) { starPath(x, 0, 0, ps, ps * .22, 4, 0); x.fill(); } else { x.beginPath(); x.arc(0, 0, ps * .15, 0, 7); x.fill(); }
        break;
      case "embers":
        x.shadowColor = "#ff6a00"; x.shadowBlur = 8; x.fillStyle = R() < .5 ? "#ffd27a" : "#ff8a3d";
        x.beginPath(); x.arc(0, 0, ps * .22, 0, 7); x.fill(); break;
      case "cards":
        if (n % 3) break;
        x.fillStyle = "#ffffff"; x.strokeStyle = ink; x.lineWidth = 1.5;
        x.beginPath(); x.rect(-ps * .8, -ps * 1.1, ps * 1.6, ps * 2.2); x.fill(); x.stroke();
        x.fillStyle = R() < .5 ? "#d81b4a" : ink; x.font = Math.round(ps * 1.3) + "px serif"; x.textAlign = "center"; x.textBaseline = "middle";
        x.fillText("♠♥♦♣"[Math.floor(R() * 4)], 0, ps * .05); break;
      case "zzz":
        if (n % 3) break;
        x.rotate(-rot - .2); x.font = Math.round(ps * 2.6) + "px \"Dela Gothic One\", Impact, sans-serif";
        x.lineWidth = 4; x.strokeStyle = ink; x.strokeText("Z", 0, 0); x.fillStyle = "#ffffff"; x.fillText("Z", 0, 0); break;
      case "leaves":
        x.fillStyle = ["#ff9a3c", "#e0612f", "#ffc857"][Math.floor(R() * 3)];
        x.beginPath(); x.ellipse(0, 0, ps, ps * .45, 0, 0, 7); x.fill();
        x.strokeStyle = "rgba(0,0,0,.3)"; x.lineWidth = 1; x.beginPath(); x.moveTo(-ps, 0); x.lineTo(ps, 0); x.stroke(); break;
      case "wind":
        if (n % 2) break;
        x.rotate(-rot); x.strokeStyle = "rgba(255,255,255,.35)"; x.lineWidth = 1.5;
        x.beginPath(); x.moveTo(-ps * 6, 0); x.quadraticCurveTo(0, -ps * 1.2, ps * 6, 0); x.stroke(); break;
    }
    x.restore();
  }

  /* manga focus lines around the edges */
  x.fillStyle = rgba(ink, .55);
  var cxm = W / 2, cym = H / 2, far = Math.hypot(W, H);
  for (n = 0; n < 120; n++) {
    var fa = R() * Math.PI * 2, inner = Math.hypot(W, H) * (.36 + R() * .1), wd = .003 + R() * .006;
    x.beginPath();
    x.moveTo(cxm + Math.cos(fa) * inner, cym + Math.sin(fa) * inner);
    x.lineTo(cxm + Math.cos(fa - wd) * far, cym + Math.sin(fa - wd) * far);
    x.lineTo(cxm + Math.cos(fa + wd) * far, cym + Math.sin(fa + wd) * far);
    x.fill();
  }

  /* screentone in the top corner */
  x.fillStyle = rgba(ink, .22);
  var step = Math.max(6, M * .016);
  for (var hy = 0; hy < H * .5; hy += step) for (var hx2 = 0; hx2 < W * .45; hx2 += step) {
    var d = 1 - Math.hypot(hx2 / (W * .45), hy / (H * .5));
    if (d > 0) { x.beginPath(); x.arc(hx2 + (hy / step % 2) * step / 2, hy, step * .45 * d, 0, 7); x.fill(); }
  }

  /* sound effect lettering */
  var fs = Math.round(M * (T.sfx.length > 4 ? .1 : .14));
  x.save(); x.translate(W * .05, H * (wide ? .2 : .16)); x.rotate(-.1);
  x.font = fs + "px \"Dela Gothic One\", Impact, sans-serif"; x.textBaseline = "middle";
  x.lineJoin = "round"; x.lineWidth = Math.max(5, fs * .16); x.strokeStyle = ink; x.strokeText(T.sfx, 0, 0);
  x.fillStyle = "#ffffff"; x.fillText(T.sfx, 0, 0);
  x.restore();
}

function paintSplash() {
  if (!current) return;
  try { drawSplash($("splash"), current.c, TYPES[current.c.type]); } catch (e) { /* The caption still reads without the art. */ }
}


/* ================= Your own splash art =================
   Pictures the viewer adds stay in their own browser (localStorage), keyed by character. */
var ART_PREFIX = "anime-quiz-art:";
var artStatusId = "artStatus";
var artCache = {};
function getArt(name) {
  if (artCache[name] === undefined) {
    artCache[name] = null;
    var data = null;
    try { data = localStorage.getItem(ART_PREFIX + name); } catch (e) {}
    if (data) loadArt(name, data, false);
  }
  return artCache[name] && artCache[name].complete && artCache[name].naturalWidth ? artCache[name] : null;
}
function loadArt(name, dataURL, persist) {
  var img = new Image();
  img.onload = function () {
    artCache[name] = img;
    Object.keys(thumbCache).forEach(function (k) { if (k.indexOf(name + "|") === 0) delete thumbCache[k]; });
    if (persist) {
      try { localStorage.setItem(ART_PREFIX + name, dataURL); }
      catch (e) { if ($(artStatusId)) $(artStatusId).textContent = "Added. Your browser is out of space to save it, so it will only last until you close this page."; }
    }
    if (!$("resultView").hidden && lastPicks) renderResult(false);
  };
  img.src = dataURL;
}
function removeArt(name) {
  delete artCache[name];
  artCache[name] = null;
  try { localStorage.removeItem(ART_PREFIX + name); } catch (e) {}
  Object.keys(thumbCache).forEach(function (k) { if (k.indexOf(name + "|") === 0) delete thumbCache[k]; });
  if (!$("resultView").hidden && lastPicks) renderResult(false);
}
/* Shrink the picture so it saves quickly and fits in browser storage. */
function useImageFile(file, name) {
  if (!file || !/^image\//.test(file.type)) { $(artStatusId).textContent = "That isn't an image. Copy a picture, or choose a JPG, PNG or WebP file."; return; }
  var url = URL.createObjectURL(file), img = new Image();
  img.onload = function () {
    var max = 1100, k = Math.min(1, max / Math.max(img.naturalWidth, img.naturalHeight));
    var cv = document.createElement("canvas");
    cv.width = Math.round(img.naturalWidth * k); cv.height = Math.round(img.naturalHeight * k);
    cv.getContext("2d").drawImage(img, 0, 0, cv.width, cv.height);
    URL.revokeObjectURL(url);
    var data;
    try { data = cv.toDataURL("image/jpeg", .82); } catch (e) { $(artStatusId).textContent = "That picture couldn't be read. Try saving it to your device and choosing the file."; return; }
    $(artStatusId).textContent = "Splash art added for " + name + ".";
    loadArt(name, data, true);
  };
  img.onerror = function () { URL.revokeObjectURL(url); $(artStatusId).textContent = "That picture couldn't be opened. Try a JPG or PNG."; };
  img.src = url;
}

/* ================= After-show analysis ================= */
var CHEM = {
  tsun: ["dere", "They're patient enough to wait out the tsun.", "sado", "They know exactly which buttons to push."],
  kuu: ["genki", "They talk enough for both of you.", "baka", "The noise. The constant noise."],
  dan: ["mentor", "They notice you without making a fuss.", "hime", "They need the spotlight, you need a hiding spot."],
  yan: ["dan", "They never wander off.", "sado", "They flirt with everyone, and you keep a list."],
  dere: ["tsun", "You're the only one who sees through the act.", "doro", "Your sunshine can't reach their basement."],
  hime: ["dere", "They treat you like royalty for free.", "kami", "There's only room for one throne."],
  kami: ["strat", "Finally, a worthy chess opponent.", "nekketsu", "They keep punching through your grand plans."],
  sado: ["tsun", "The reactions are just too good.", "kuu", "You can't get a rise out of them. You've tried."],
  baka: ["kuu", "They quietly clean up after you.", "strat", "You ruin every plan they make."],
  daru: ["genki", "They drag you outside, and you secretly like it.", "nekketsu", "They want to train at 5 a.m. Absolutely not."],
  doro: ["dere", "Their sunshine almost reaches your basement.", "strat", "They see straight through your smile."],
  genki: ["daru", "You've got enough energy for two.", "lone", "They keep walking off mid-conversation."],
  nekketsu: ["mentor", "Someone to finally channel all that fire.", "daru", "They nap through your best speeches."],
  chuuni: ["baka", "They believe every word of your lore.", "kuu", "One raised eyebrow destroys your whole backstory."],
  strat: ["lone", "They follow the plan without needing it explained.", "baka", "They are the variable you can't account for."],
  mentor: ["nekketsu", "The student you've been waiting for.", "kami", "They think they don't need a teacher."],
  lone: ["dere", "They keep showing up until you let them in.", "genki", "Too much. Too loud. Too close."]
};
var MERCH = {
  tsun: "A plushie with a permanent pout", kuu: "A minimalist acrylic stand", dan: "A tiny keychain you can hide in a pocket",
  yan: "A heart-shaped locket. Do not open it.", dere: "A hug-sized plushie", hime: "A limited-edition gold-plated figure",
  kami: "A huge scale figure of you on a throne", sado: "A sticker pack of your smug faces", baka: "A plushie of you holding snacks",
  daru: "A pillow shaped like you, asleep", doro: "A cute figure with a slightly wrong smile", genki: "A light-up keychain that never turns off",
  nekketsu: "A full-size replica of your weapon", chuuni: "An eye patch with a 40-page lore booklet", strat: "A chess set with your face on the king",
  mentor: "A calendar of your wise quotes", lone: "Your black jacket. Sold out in four minutes."
};
var ADJ = { g: "Unbreakable", h: "Gentle", b: "Calculated", c: "Silent", x: "Chaotic", d: "Endless", s: "Crimson", e: "Shining", t: "Stubborn", q: "Whispered" };
var NOUN = { g: "Fist", h: "Promise", b: "Equation", c: "Moonlight", x: "Fireworks", d: "Horizon", s: "Shadow", e: "Spotlight", t: "Heartbeat", q: "Letter" };
var BANDS = ["Neon Kitsune", "The Midnight Ramen", "Seven Paper Cranes", "Lost Umbrella Club", "Blue Signal", "Starlight Delivery", "Moonlit Vending Machine", "Paper Lantern Riot"];

function normTraits(tot) {
  var n = {};
  TKEYS.forEach(function (k) { n[k] = tot[k] / (NORM[k] * SLOTS.length); });
  return n;
}

function pickEnding(n) {
  if (n.s > Math.max(n.h * 1.2, 1.45)) return ["Villain ending", "You won. Everyone else did not. The final shot is you on a throne, in the rain."];
  if (n.t >= 1.45) return ["Romcom ending", "You finally admit it. Sort of. The series ends with you yelling \"I-idiot!\" at someone you love."];
  if (n.h >= 1.2 && n.s < .9) return ["True ending", "Everyone lives. There's a beach episode as an epilogue. Fans cry happy tears."];
  if (n.x >= 1.3) return ["Gag ending", "The final battle gets interrupted by a cooking contest. You win it. Nobody knows how."];
  if (n.c >= 1.3 || n.q >= 1.35) return ["Open ending", "You walk off into the distance. The fandom argues about what it meant for ten years."];
  if (n.d >= 1.2 || n.g >= 1.2) return ["Season two cliffhanger", "Just as you win, a stronger enemy appears. Season two confirmed."];
  return ["Bittersweet ending", "You won, but something was lost. The ending song plays over a montage of old photos."];
}

function renderAnalysis(w, picksUsed, me, order) {
  var n = normTraits(w.tot), T = TYPES[me.type];
  var ranked = TKEYS.slice().sort(function (a, b) { return n[b] - n[a]; });
  var seed = seeded(me.name + ranked.join(""));
  var ending = pickEnding(n);
  var band = BANDS[Math.floor(seed() * BANDS.length)], band2 = BANDS[Math.floor(seed() * BANDS.length)];
  var op = ADJ[ranked[0]] + " " + NOUN[ranked[1]];
  var ed = "Goodbye, " + NOUN[ranked[ranked.length - 1]];
  var pop = (n.e * 1.4 + n.h + n.x + n.c * .8 + n.s * .6) / 2.5;
  var rankNo = Math.max(1, Math.min(99, Math.round(100 / Math.pow(1 + pop, 2))));
  var popNote = rankNo <= 3 ? "Top three. Your face is on every tote bag." : rankNo <= 10 ? "Solid fan favourite. Your merch restocks weekly." : rankNo <= 20 ? "Underrated, and your fans are very loud about it." : "Cult classic. The few fans you have would fight for you.";
  var chem = CHEM[me.type];
  var bestEx = firstWhere(order, function (x) { return x.type === chem[0]; }, [me]);
  var clashEx = firstWhere(order.slice().reverse(), function (x) { return x.type === chem[2]; }, [me]);

  var cards = [
    { cls: "ending wide", k: "Your ending", v: ending[0], n: ending[1] },
    { k: "Opening theme", v: "“" + op + "”", n: "by " + band + ". " + T.ost },
    { k: "Ending theme", v: "“" + ed + "”", n: "by " + (band2 === band ? "Quiet Hours" : band2) + ". Plays over a slow pan of the sunset." },
    { k: "Popularity poll", v: "#" + rankNo, n: popNote, big: true },
    { k: "Best-selling merch", v: MERCH[me.type] },
    { cls: "chem good", k: "Best chemistry", v: TYPES[chem[0]].name, n: chem[1] + (bestEx ? " Like " + bestEx.name + "." : "") },
    { cls: "chem bad", k: "Natural enemy", v: TYPES[chem[2]].name, n: chem[3] + (clashEx ? " Like " + clashEx.name + "." : "") }
  ];
  $("analysis").innerHTML = cards.map(function (c) {
    return '<div class="acard' + (c.cls ? " " + c.cls : "") + '"><p class="ak">' + esc(c.k) + '</p><p class="av' + (c.big ? " big" : "") + '">' + esc(c.v) + "</p>" + (c.n ? '<p class="an">' + esc(c.n) + "</p>" : "") + "</div>";
  }).join("");

}

/* ================= Official portraits (GitHub Pages build) =================
   Asks AniList's public API for each character's profile picture. Images are shown straight
   from AniList's servers with a credit link; nothing is copied into this site. If the API
   can't be reached, the generated splash art is used instead. */
var PORTRAIT_KEY = "anime-quiz-portraits-v1";
var portraits = {};
var portraitPending = {}, portraitOff = !PORTRAITS_ONLINE;
try { portraits = JSON.parse(localStorage.getItem(PORTRAIT_KEY)) || {}; } catch (e) { portraits = {}; }
function savePortraits() { try { localStorage.setItem(PORTRAIT_KEY, JSON.stringify(portraits)); } catch (e) {} }

function slug(s) { return String(s).toLowerCase().normalize("NFKD").replace(/[^a-z0-9]/g, ""); }
function seriesMatch(series, titles) {
  var want = slug(series).slice(0, 7);
  return titles.some(function (t) { var s = slug(t || ""); return s && (s.indexOf(want) >= 0 || want.indexOf(s.slice(0, 7)) >= 0); });
}
var SEARCH_AS = { "L": "L Lawliet", "Louise": "Louise Francoise", "Goku": "Son Goku", "Takagi": "Takagi", "Ram": "Ram", "Rem": "Rem", "Power": "Power", "Kamina": "Kamina", "Holo": "Holo", "Aqua": "Aqua", "Frieza": "Frieza", "Dio Brando": "Dio Brando" };

function portraitOf(c) { var p = portraits[c.name]; return p && p.img ? p : null; }
function avatarURL(c, size) {
  if (getArt(c.name)) return thumbURL(c, size);
  var p = portraitOf(c);
  return p ? p.img : thumbURL(c, size);
}

var portraitTimer = null;
function ensurePortraits(list) {
  if (portraitOff) return;
  var need = list.filter(function (c) { return c && portraits[c.name] === undefined && !portraitPending[c.name]; });
  if (!need.length) return;
  need = need.slice(0, 12);
  need.forEach(function (c) { portraitPending[c.name] = true; });
  var fields = "{ name { full } siteUrl image { large } media(perPage: 4, sort: POPULARITY_DESC) { nodes { title { romaji english } } } }";
  var query = "query {" + need.map(function (c, i) {
    return " a" + i + ": Page(perPage: 6) { characters(search: " + JSON.stringify(SEARCH_AS[c.name] || c.name) + ") " + fields + " }";
  }).join("") + " }";
  fetch("https://graphql.anilist.co", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Accept": "application/json" },
    body: JSON.stringify({ query: query })
  }).then(function (r) {
    if (r.status === 429) { throw new Error("rate"); }
    return r.json();
  }).then(function (j) {
    need.forEach(function (c, i) {
      delete portraitPending[c.name];
      var page = j && j.data && j.data["a" + i], hits = page && page.characters || [];
      var pick = hits.filter(function (h) {
        var titles = (h.media && h.media.nodes || []).reduce(function (a, n) { return a.concat([n.title.romaji, n.title.english]); }, []);
        return seriesMatch(c.series, titles);
      })[0];
      portraits[c.name] = pick && pick.image && pick.image.large ? { img: pick.image.large, site: pick.siteUrl } : null;
    });
    savePortraits();
    clearTimeout(portraitTimer);
    portraitTimer = setTimeout(function () { if (!$("resultView").hidden && lastPicks) renderResult(false); }, 60);
  }).catch(function (err) {
    need.forEach(function (c) { delete portraitPending[c.name]; });
    if (!err || err.message !== "rate") portraitOff = true;
  });
}

function showPortrait(me) {
  var p = getArt(me.name) ? null : portraitOf(me), img = $("resPortrait"), credit = $("resCredit");
  current.portrait = !!p;
  if (p) {
    if (img.getAttribute("src") !== p.img) img.src = p.img;
    img.alt = "Official portrait of " + me.name;
    img.hidden = false;
    credit.innerHTML = 'Portrait from <a href="' + esc(p.site) + '" target="_blank" rel="noopener">AniList</a>';
    credit.hidden = false;
    $("resPics").href = p.site;
  } else {
    img.hidden = true; img.removeAttribute("src");
    credit.hidden = true;
  }
}

/* ================= Shared helpers ================= */
var thumbCache = {};
function thumbURL(c, size) {
  var key = c.name + "|" + size;
  if (thumbCache[key]) return thumbCache[key];
  try {
    var cv = document.createElement("canvas");
    drawSplash(cv, c, TYPES[c.type], size, size);
    thumbCache[key] = cv.toDataURL("image/jpeg", .86);
  } catch (e) { thumbCache[key] = ""; }
  return thumbCache[key];
}
function picsURL(c) { return "https://www.google.com/search?tbm=isch&q=" + encodeURIComponent(c.name + " " + c.series + " anime"); }
function anilistURL(c) { return "https://anilist.co/search/characters?search=" + encodeURIComponent(c.name); }
function malURL(c) { return "https://myanimelist.net/character.php?cat=character&q=" + encodeURIComponent(c.name); }
function svgEl(tag, attrs, text) {
  var el = document.createElementNS("http://www.w3.org/2000/svg", tag);
  Object.keys(attrs || {}).forEach(function (k) { el.setAttribute(k, attrs[k]); });
  if (text != null) el.textContent = text;
  return el;
}

var POOL_KEY = "anime-quiz-pool";
var pool = "any";
try { var sp = localStorage.getItem(POOL_KEY); if (POOLS[sp]) pool = sp; } catch (e) {}
function setPool(p) {
  pool = p;
  try { localStorage.setItem(POOL_KEY, p); } catch (e) {}
  document.querySelectorAll("[data-pool]").forEach(function (b) { b.setAttribute("aria-pressed", b.getAttribute("data-pool") === p ? "true" : "false"); });
}

/* ================= Story clock ================= */
var clockAbs = null;
(function () {
  var g = $("clockTicks");
  for (var i = 0; i < 12; i++) {
    var a = i * Math.PI / 6, r1 = i % 3 ? 24 : 21;
    g.appendChild(svgEl("line", { x1: 32 + Math.sin(a) * r1, y1: 32 - Math.cos(a) * r1, x2: 32 + Math.sin(a) * 26, y2: 32 - Math.cos(a) * 26, class: "cf-tick" }));
  }
})();
var clockIndex = -1;
function setClock(at) {
  var mins = at[0] * 60 + at[1];
  if (clockAbs === null) clockAbs = mins;
  else {
    var d = mins - (((clockAbs % 1440) + 1440) % 1440);
    if (index >= clockIndex && d < 0) d += 1440;
    if (index < clockIndex && d > 0) d -= 1440;
    clockAbs += d;
  }
  clockIndex = index;
  $("hHand").style.transform = "rotate(" + (clockAbs / 2) + "deg)";
  $("mHand").style.transform = "rotate(" + (clockAbs * 6) + "deg)";
  var h = at[0], m = at[1], h12 = h % 12 || 12;
  $("clockTime").textContent = h12 + ":" + (m < 10 ? "0" : "") + m + (h < 12 ? " AM" : " PM");
  $("clockDay").textContent = at[2];
  $("clock").classList.toggle("night", h >= 19 || h < 6);
  $("clock").setAttribute("aria-label", "Story time: " + at[2] + ", " + $("clockTime").textContent);
}

/* ================= Quiz flow ================= */
function show(view) {
  ["coverView", "chapterView", "resultView"].forEach(function (id) { $(id).hidden = id !== view; });
  window.scrollTo(0, 0);
}

function renderChapter() {
  var w = walk(picks, index), item = w.shown[index], arc = ARCS[SLOTS[index].arc];
  document.documentElement.style.setProperty("--spot", arc.color);
  $("chapterNo").textContent = "第" + kanjiNumber(index + 1) + "話";
  $("chapterOf").textContent = "Chapter " + (index + 1) + " of " + SLOTS.length;
  $("arcName").textContent = arc.name + " · " + arc.sub;
  setClock(item.at || SLOTS[index].at);
  $("ticks").innerHTML = SLOTS.map(function (s, i) {
    var cls = (i <= index ? "on" : "") + (i > 0 && SLOTS[i - 1].arc !== s.arc ? " arc-start" : "");
    return '<i class="' + cls + '"' + (i <= index ? ' style="background:' + ARCS[s.arc].color + '"' : "") + "></i>";
  }).join("");
  var tag = $("routeTag");
  if (item.tag) {
    tag.innerHTML = '<b lang="ja">分岐</b><span>Branch: ' + esc(item.tag) + "</span>";
    tag.hidden = false;
  } else tag.hidden = true;
  $("question").textContent = item.q;
  var box = $("panels");
  box.textContent = "";
  item.a.forEach(function (ans, i) {
    var b = document.createElement("button");
    b.type = "button";
    b.className = "panel";
    b.id = "answer-" + index + "-" + i;
    b.setAttribute("aria-pressed", picks[index] === i ? "true" : "false");
    var s = document.createElement("span");
    s.textContent = ans.t;
    b.appendChild(s);
    b.addEventListener("click", function () { choose(i, b); });
    box.appendChild(b);
  });
  $("backBtn").hidden = index === 0;
  var page = $("page");
  page.classList.remove("turn");
  void page.offsetWidth;
  page.classList.add("turn");
  $("question").focus({ preventScroll: true });
}

function choose(i, button) {
  if (locked) return;
  locked = true;
  if (picks[index] !== i) picks.length = index;
  picks[index] = i;
  button.setAttribute("aria-pressed", "true");
  setTimeout(function () {
    locked = false;
    if (index < SLOTS.length - 1) {
      index++; save(); renderChapter(); window.scrollTo(0, 0);
    } else {
      clearSave(); renderResult(true);
    }
  }, 200);
}

function firstWhere(order, test, skip) {
  for (var i = 0; i < order.length; i++) {
    var c = order[i].c;
    if (test(c) && skip.indexOf(c) < 0) return c;
  }
}

/* ================= Databook visuals ================= */
function statBlock(tot) {
  var n = {};
  TKEYS.forEach(function (k) { n[k] = tot[k] / (NORM[k] * SLOTS.length); });
  return [
    ["Power", n.g * .7 + n.d * .3],
    ["Brains", n.b],
    ["Charm", n.e * .5 + n.h * .5],
    ["Aura", n.c * .6 + n.s * .4],
    ["Chaos", n.x],
    ["Menace", n.s * .75 + n.t * .25],
    ["Plot armor", n.d * .4 + n.h * .3 + n.e * .3],
    ["Tsun", n.t]
  ];
}
function grade(v) { return v >= 1.7 ? "S" : v >= 1.3 ? "A" : v >= 1 ? "B" : v >= .7 ? "C" : v >= .4 ? "D" : "E"; }

function drawRadar(stats) {
  var box = $("radar"); box.textContent = "";
  var W = 360, H = 340, cx = 180, cy = 172, R = 112, N = stats.length;
  var svg = svgEl("svg", { viewBox: "0 0 " + W + " " + H, role: "img", "aria-label": "Battle stats radar chart: " + stats.map(function (s) { return s[0] + " " + grade(s[1]); }).join(", ") });
  var pt = function (i, r) { var a = -Math.PI / 2 + i * Math.PI * 2 / N; return [cx + Math.cos(a) * r, cy + Math.sin(a) * r]; };
  [1, .75, .5, .25].forEach(function (k, j) {
    svg.appendChild(svgEl("polygon", { points: stats.map(function (_, i) { return pt(i, R * k).join(","); }).join(" "), class: "r-ring" + (j === 0 ? " outer" : "") }));
  });
  stats.forEach(function (_, i) { var p = pt(i, R); svg.appendChild(svgEl("line", { x1: cx, y1: cy, x2: p[0], y2: p[1], class: "r-axis" })); });
  var shape = stats.map(function (s, i) { return pt(i, R * Math.max(.08, Math.min(1, s[1] / 2))).join(","); }).join(" ");
  svg.appendChild(svgEl("polygon", { points: shape, class: "r-shape" }));
  stats.forEach(function (s, i) {
    var p = pt(i, R * Math.max(.08, Math.min(1, s[1] / 2)));
    svg.appendChild(svgEl("circle", { cx: p[0], cy: p[1], r: 4, class: "r-dot" }));
    var q = pt(i, R + 30), g = grade(s[1]);
    var anchor = Math.abs(q[0] - cx) < 8 ? "middle" : q[0] > cx ? "start" : "end";
    var dx = anchor === "start" ? -12 : anchor === "end" ? 12 : 0;
    svg.appendChild(svgEl("rect", { x: q[0] + dx - 13 + (anchor === "start" ? 13 : anchor === "end" ? -13 : 0), y: q[1] - 26, width: 26, height: 26, class: "r-badge" + (g === "S" ? " s" : "") }));
    svg.appendChild(svgEl("text", { x: q[0] + dx + (anchor === "start" ? 13 : anchor === "end" ? -13 : 0), y: q[1] - 7, "text-anchor": "middle", class: "r-grade" }, g));
    svg.appendChild(svgEl("text", { x: q[0] + dx + (anchor === "start" ? 13 : anchor === "end" ? -13 : 0), y: q[1] + 12, "text-anchor": "middle", class: "r-label" }, s[0]));
  });
  box.appendChild(svg);
}

function drawGauges(tot) {
  var n = {};
  TKEYS.forEach(function (k) { n[k] = tot[k] / (NORM[k] * SLOTS.length); });
  var clamp = function (v) { return Math.max(.03, Math.min(.98, v)); };
  var list = [
    ["Main character energy", clamp((n.e + n.d + n.g) / 3 / 1.8)],
    ["Villain arc risk", clamp(n.s / ((n.s + n.h) || 1))],
    ["Rizz", clamp((n.e * .35 + n.h * .35 + n.c * .3 - n.q * .25) / 1.5)],
    ["Social battery", clamp(1 - n.q / ((n.q + n.e + n.x * .5) || 1))],
    ["Death flag risk", clamp((n.h * .4 + n.g * .4 + n.d * .2) / 1.7)],
    ["Fan-favourite potential", clamp((n.x * .3 + n.e * .3 + n.c * .2 + n.h * .2) / 1.4)]
  ];
  var box = $("gauges"); box.textContent = "";
  list.forEach(function (g) {
    var wrap = document.createElement("div"); wrap.className = "gauge";
    var svg = svgEl("svg", { viewBox: "0 0 120 74", role: "img", "aria-label": g[0] + ": " + Math.round(g[1] * 100) + " percent" });
    var arc = function (from, to) {
      var a0 = Math.PI * (1 + from), a1 = Math.PI * (1 + to);
      return "M" + (60 + Math.cos(a0) * 48) + " " + (64 + Math.sin(a0) * 48) + " A48 48 0 0 1 " + (60 + Math.cos(a1) * 48) + " " + (64 + Math.sin(a1) * 48);
    };
    svg.appendChild(svgEl("path", { d: arc(0, 1), class: "g-track" }));
    svg.appendChild(svgEl("path", { d: arc(0, g[1]), class: "g-fill" }));
    for (var t = 0; t <= 10; t++) {
      var a = Math.PI * (1 + t / 10);
      svg.appendChild(svgEl("line", { x1: 60 + Math.cos(a) * 36, y1: 64 + Math.sin(a) * 36, x2: 60 + Math.cos(a) * (t % 5 ? 39 : 33), y2: 64 + Math.sin(a) * (t % 5 ? 39 : 33), class: "g-tick" }));
    }
    var na = Math.PI * (1 + g[1]);
    svg.appendChild(svgEl("line", { x1: 60, y1: 64, x2: 60 + Math.cos(na) * 40, y2: 64 + Math.sin(na) * 40, class: "g-needle" }));
    svg.appendChild(svgEl("circle", { cx: 60, cy: 64, r: 5, class: "g-hub" }));
    wrap.appendChild(svg);
    var lab = document.createElement("p");
    lab.innerHTML = "<b>" + Math.round(g[1] * 100) + "%</b><span>" + esc(g[0]) + "</span>";
    wrap.appendChild(lab);
    box.appendChild(wrap);
  });
}

/* ================= Relationship web ================= */
function drawWeb(me, links) {
  var box = $("web"); box.textContent = "";
  var narrow = box.clientWidth < 560;
  var W = narrow ? 380 : 720, H = narrow ? 600 : 470, cx = W / 2, cy = H / 2;
  var rx = narrow ? 138 : 280, ry = narrow ? 232 : 165, nodeR = narrow ? 32 : 36;
  var svg = svgEl("svg", { viewBox: "0 0 " + W + " " + H, role: "img", "aria-label": "Your relationship web: " + links.map(function (l) { return l.label + ", " + l.c.name; }).join("; ") });
  var defs = svgEl("defs");
  svg.appendChild(defs);
  var clip = function (id, x, y, r) { var cp = svgEl("clipPath", { id: id }); cp.appendChild(svgEl("circle", { cx: x, cy: y, r: r })); defs.appendChild(cp); };
  var pos = links.map(function (l, i) {
    var a = -Math.PI / 2 + i * Math.PI * 2 / links.length;
    return [cx + Math.cos(a) * rx, cy + Math.sin(a) * ry];
  });
  links.forEach(function (l, i) {
    var p = pos[i], cls = "w-edge " + l.kind;
    if (l.kind === "rival") {
      var d = "M" + cx + " " + cy, seg = 7;
      for (var k = 1; k <= seg; k++) {
        var t = k / seg, x = cx + (p[0] - cx) * t, y = cy + (p[1] - cy) * t;
        var nx = -(p[1] - cy), ny = p[0] - cx, len = Math.hypot(nx, ny) || 1, off = k < seg ? (k % 2 ? 9 : -9) : 0;
        d += " L" + (x + nx / len * off) + " " + (y + ny / len * off);
      }
      svg.appendChild(svgEl("path", { d: d, class: cls }));
    } else svg.appendChild(svgEl("line", { x1: cx, y1: cy, x2: p[0], y2: p[1], class: cls }));
  });
  var node = function (c, x, y, r, id, label, isMe) {
    clip(id, x, y, r);
    var g = svgEl("g", { class: "w-node" + (isMe ? " me" : "") });
    g.appendChild(svgEl("circle", { cx: x + 4, cy: y + 4, r: r, class: "w-shadow" }));
    var url = avatarURL(c, 160);
    if (url) g.appendChild(svgEl("image", { href: url, x: x - r, y: y - r, width: r * 2, height: r * 2, "clip-path": "url(#" + id + ")", preserveAspectRatio: "xMidYMid slice" }));
    g.appendChild(svgEl("circle", { cx: x, cy: y, r: r, class: "w-ring" }));
    var ty = y + r + 16;
    if (label) g.appendChild(svgEl("text", { x: x, y: ty, "text-anchor": "middle", class: "w-rel" }, label));
    g.appendChild(svgEl("text", { x: x, y: ty + (label ? 16 : 2), "text-anchor": "middle", class: "w-name" }, isMe ? "You · " + c.name : c.name));
    svg.appendChild(g);
  };
  links.forEach(function (l, i) { node(l.c, pos[i][0], pos[i][1], nodeR, "wc" + i, l.label.toUpperCase(), false); });
  node(me, cx, cy, nodeR * 1.55, "wme", null, true);
  box.appendChild(svg);
}

/* ================= Result ================= */
var lastPicks = null;
function renderResult(fresh) {
  if (fresh) lastPicks = picks.slice();
  var w = walk(lastPicks), profile = w.profile, order = rank(profile, pool);
  var me = order[0].c, crew = order[1].c, rival = order[order.length - 1].c, T = TYPES[me.type];
  var sync = Math.max(1, Math.round(order[0].r * 100));
  var tier = sync >= 80 ? "SSR" : sync >= 62 ? "SR" : "R";
  current = { c: me };
  if (fresh) show("resultView");

  document.documentElement.style.setProperty("--spot", me.spot);
  $("resRole").textContent = ROLES[me.role] + " · " + T.name;
  $("resName").textContent = me.name;
  $("resSeries").textContent = "from " + me.series;
  $("resJp").textContent = me.jp;
  $("resTier").textContent = tier;
  $("resWho").textContent = me.who;
  $("resPics").href = anilistURL(me);
  $("resPics").textContent = "Official portrait of " + me.name + " (AniList)";
  $("resMal").href = malURL(me);
  $("resMore").href = picsURL(me);
  $("resBlurb").textContent = me.blurb;
  var hasArt = !!getArt(me.name);
  $("artTitle").textContent = hasArt ? "Your splash art for " + me.name : "Make the splash art yours";
  $("artRemove").hidden = !hasArt;
  $("resFlaw").textContent = me.flaw;

  /* character file */
  var pw = Math.round((profile[0] * 3 + profile[5] * 2.5 + profile[6] * 1.5 + profile[2] * 1.2 + profile[1] + profile[3] + profile[4] + profile[7] + profile[8] + profile[9] * .5) * 43 + seeded(me.name)() * 97);
  var facts = [
    { k: "Your type", v: esc(T.name) + ' <span lang="ja">' + esc(T.jp) + "</span>", n: T.gist, cls: "type" },
    { k: "Sync rate", v: sync + "% · " + tier, n: "How closely your answers match " + me.name + ".", big: true },
    { k: "Power level", v: pw.toLocaleString("en-US"), n: pw > 9000 ? "It's over 9,000. Scouters everywhere are exploding." : "Measured by a slightly broken scouter.", big: true },
    { k: "Signature item", v: esc(me.item) },
    { k: "Theme song energy", v: esc(T.ost) },
    { k: "Natural habitat", v: esc(T.habitat) }
  ];
  $("facts").innerHTML = facts.map(function (f) {
    return '<div class="fact' + (f.cls ? " " + f.cls : "") + '"><dt>' + f.k + "</dt><dd" + (f.big ? ' class="big"' : "") + ">" + f.v + "</dd>" +
      (f.n ? "<dd><small>" + esc(f.n) + "</small></dd>" : "") + "</div>";
  }).join("");
  $("resLove").textContent = T.love;

  /* databook */
  var stats = statBlock(w.tot);
  drawRadar(stats);
  $("statList").innerHTML = stats.map(function (st) {
    var g = grade(st[1]), pct = Math.round(Math.max(.05, Math.min(1, st[1] / 2)) * 100);
    return '<li><span>' + esc(st[0]) + '</span><span class="gr' + (g === "S" ? " s" : "") + '">' + g + '</span><span class="bar" role="img" aria-label="' + esc(st[0]) + " grade " + g + '"><i style="width:' + pct + '%"></i></span></li>';
  }).join("");
  drawGauges(w.tot);
  renderAnalysis(w, lastPicks, me, order);
  var tsun = profile[8] / NORM.t, dere = profile[1] / NORM.h, tp = Math.round(tsun / ((tsun + dere) || 1) * 100);
  $("meterBar").innerHTML = '<i class="tsun" style="flex:' + tp + ' 0 0"></i><i class="dere" style="flex:' + (100 - tp) + ' 0 0"></i>';
  $("meterTsun").textContent = tp + "% tsun";
  $("meterDere").textContent = (100 - tp) + "% dere";

  /* web + cast */
  var used = [me, crew, rival], links = [];
  var add = function (label, kind, c, note) { if (!c) return; used.push(c); links.push({ label: label, kind: kind, c: c, note: note }); };
  links.push({ label: "Crewmate", kind: "crew", c: crew, note: "Your closest match after " + me.name + "." });
  var mentor = firstWhere(order, function (x) { return x.type === "mentor"; }, used);
  if (me.type !== "mentor") add("Mentor", "mentor", mentor, "The teacher who'd take you on.");
  ["P", "V", "S"].filter(function (r) { return r !== me.role; }).forEach(function (r) {
    add({ P: "Hero route", V: "Villain route", S: "Sidekick route" }[r], "route", firstWhere(order, function (x) { return x.role === r; }, used), "Your closest " + ROLES[r].toLowerCase() + ".");
  });
  links.splice(Math.floor(links.length / 2) + 1, 0, { label: "Rival", kind: "rival", c: rival, note: "Your opposite in almost every way." });
  add("Same type", "type", firstWhere(order, function (x) { return x.type === me.type; }, used), "A fellow " + T.name.toLowerCase() + " from another show.");
  var bonusType = me.type === "tsun" ? "yan" : "tsun";
  add(TYPES[bonusType].name + " route", "route", firstWhere(order, function (x) { return x.type === bonusType; }, used), "Who you'd be if you leaned that way.");
  add("Comic relief", "route", firstWhere(order, function (x) { return x.type === "baka" || x.type === "genki"; }, used), "The one who'd keep you laughing.");
  ensurePortraits([me].concat(links.map(function (l) { return l.c; })));
  showPortrait(me);
  drawWeb(me, links);

  var box = $("others");
  box.textContent = "";
  links.forEach(function (l) {
    var c = l.c, d = document.createElement("article");
    d.className = "other";
    var url = avatarURL(c, 160);
    d.innerHTML = (url ? '<img src="' + url + '" alt="" width="80" height="80">' : '<span class="noimg"></span>') +
      '<div><small>' + esc(l.label) + "</small><strong>" + esc(c.name) + "</strong>" +
      '<span class="meta">' + esc(c.series) + " · " + esc(TYPES[c.type].name) + " · " + esc(ROLES[c.role]) + "</span>" +
      "<p>" + esc(c.who) + "</p>" +
      '<div class="card-links"><a href="' + anilistURL(c) + '" target="_blank" rel="noopener">Official portrait</a>' +
      '<label class="mini">' + (getArt(c.name) ? "Change picture" : "Add picture") + '<input type="file" accept="image/*" class="sr-only" data-art="' + esc(c.name) + '"></label>' +
      '<button type="button" class="mini" data-paste="' + esc(c.name) + '">Paste copied image</button>' +
      (getArt(c.name) ? '<button type="button" class="mini" data-unart="' + esc(c.name) + '">Remove</button>' : "") + "</div></div>";
    box.appendChild(d);
  });

  var counts = { P: 0, S: 0, V: 0 }, tcount = {};
  order.slice(0, 12).forEach(function (o) { counts[o.c.role]++; tcount[o.c.type] = (tcount[o.c.type] || 0) + 1; });
  $("splitBar").innerHTML = ["P", "S", "V"].map(function (r) {
    return '<i class="' + r + '" style="flex:' + counts[r] + ' 0 0"></i>';
  }).join("");
  $("splitKeys").innerHTML = ["P", "S", "V"].map(function (r) {
    return '<li><i class="' + r + '"></i><span>' + ROLES[r] + "</span><span>" + counts[r] + " of 12</span></li>";
  }).join("");
  $("typeSpread").innerHTML = Object.keys(tcount).sort(function (a, b) { return tcount[b] - tcount[a]; }).map(function (k) {
    return '<li class="chip' + (k === me.type ? " mine" : "") + '">' + esc(TYPES[k].name) + " <b>" + tcount[k] + "</b></li>";
  }).join("");

  lastShare = "I got " + me.name + " (" + T.name + ", " + ROLES[me.role].toLowerCase() + ", " + me.series + ") with a " + sync + "% sync rate on the Which Anime Character Are You? quiz. My crewmate is " + crew.name + " and my rival is " + rival.name + ".";
  $("status").textContent = "";
  lastNarrow = $("web").clientWidth < 560;
  paintSplash();
  var reveal = $("reveal");
  reveal.classList.remove("slam");
  void reveal.offsetWidth;
  reveal.classList.add("slam");
  if (fresh) $("resName").focus({ preventScroll: true });
}

function begin() {
  picks = []; index = 0; locked = false; current = null; clockAbs = null; clockIndex = -1;
  clearSave();
  show("chapterView");
  renderChapter();
}

document.querySelectorAll("[data-pool]").forEach(function (b) {
  b.addEventListener("click", function () {
    setPool(b.getAttribute("data-pool"));
    if (!$("resultView").hidden && lastPicks) renderResult(false);
  });
});
setPool(pool);
$("startBtn").addEventListener("click", begin);
$("againBtn").addEventListener("click", function () {
  document.documentElement.style.removeProperty("--spot");
  show("coverView");
});
$("resumeBtn").addEventListener("click", function () {
  var s = loadSave();
  if (!s) return begin();
  picks = s.picks; index = s.index;
  show("chapterView");
  renderChapter();
});
$("backBtn").addEventListener("click", function () {
  if (index > 0 && !locked) { index--; save(); renderChapter(); }
});
$("copyBtn").addEventListener("click", function () {
  var fallback = function () { $("status").textContent = lastShare; };
  if (!navigator.clipboard) return fallback();
  navigator.clipboard.writeText(lastShare).then(function () {
    $("status").textContent = "Copied. Paste it to your friends.";
  }, fallback);
});
$("artFile").addEventListener("change", function (e) {
  artStatusId = "artStatus";
  if (current && e.target.files[0]) useImageFile(e.target.files[0], current.c.name);
  e.target.value = "";
});
$("artRemove").addEventListener("click", function () {
  if (!current) return;
  artStatusId = "artStatus";
  removeArt(current.c.name);
  $("artStatus").textContent = "Picture removed. Back to the generated art.";
});
document.addEventListener("paste", function (e) {
  if ($("resultView").hidden || !current) return;
  var items = (e.clipboardData && e.clipboardData.items) || [];
  for (var i = 0; i < items.length; i++) {
    if (items[i].type.indexOf("image/") === 0) {
      e.preventDefault();
      artStatusId = pasteTarget ? "castStatus" : "artStatus";
      useImageFile(items[i].getAsFile(), pasteTarget || current.c.name);
      pasteTarget = null;
      return;
    }
  }
  $("artStatus").textContent = "No picture found on your clipboard. Right-click an image and choose Copy image, then paste again.";
});
$("artPaste").addEventListener("click", function () {
  if (!current) return;
  artStatusId = "artStatus"; pasteTarget = null;
  var name = current.c.name;
  var hint = function () { $("artStatus").textContent = "Your browser blocked reading the clipboard from this button. Press Ctrl+V (Cmd+V on Mac) anywhere on the page instead, or on a phone, choose the picture as a file."; };
  if (!navigator.clipboard || !navigator.clipboard.read) return hint();
  navigator.clipboard.read().then(function (list) {
    for (var i = 0; i < list.length; i++) {
      var t = list[i].types.filter(function (ty) { return ty.indexOf("image/") === 0; })[0];
      if (t) return list[i].getType(t).then(function (blob) { useImageFile(blob, name); });
    }
    $("artStatus").textContent = "No picture found on your clipboard. Copy an image first.";
  }, hint);
});
var box0 = $("artBox");
["dragenter", "dragover"].forEach(function (ev) { box0.addEventListener(ev, function (e) { e.preventDefault(); box0.classList.add("drag"); }); });
["dragleave", "drop"].forEach(function (ev) { box0.addEventListener(ev, function (e) { e.preventDefault(); box0.classList.remove("drag"); }); });
box0.addEventListener("drop", function (e) {
  var f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
  if (f && current) useImageFile(f, current.c.name);
});
var pasteTarget = null;
$("others").addEventListener("change", function (e) {
  var name = e.target.getAttribute && e.target.getAttribute("data-art");
  if (!name || !e.target.files[0]) return;
  artStatusId = "castStatus";
  useImageFile(e.target.files[0], name);
});
$("others").addEventListener("click", function (e) {
  var t = e.target.closest ? e.target.closest("[data-paste],[data-unart]") : null;
  if (!t) return;
  artStatusId = "castStatus";
  if (t.hasAttribute("data-unart")) { removeArt(t.getAttribute("data-unart")); $("castStatus").textContent = "Picture removed."; return; }
  var name = t.getAttribute("data-paste");
  pasteTarget = name;
  var hint = function () { $("castStatus").textContent = "Ready for " + name + ". Press Ctrl+V (Cmd+V on Mac) to paste the copied image, or use Add picture."; };
  if (!navigator.clipboard || !navigator.clipboard.read) return hint();
  navigator.clipboard.read().then(function (list) {
    for (var i = 0; i < list.length; i++) {
      var ty = list[i].types.filter(function (x) { return x.indexOf("image/") === 0; })[0];
      if (ty) { pasteTarget = null; return list[i].getType(ty).then(function (blob) { useImageFile(blob, name); }); }
    }
    hint();
  }, hint);
});
var resizeTimer, lastNarrow = null;
window.addEventListener("resize", function () {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(function () {
    if ($("resultView").hidden || !lastPicks) return;
    paintSplash();
    var narrow = $("web").clientWidth < 560;
    if (narrow !== lastNarrow) { lastNarrow = narrow; renderResult(false); }
  }, 150);
});
if (document.fonts && document.fonts.load) {
  document.fonts.load('40px "Dela Gothic One"').then(function () {
    thumbCache = {};
    if (!$("resultView").hidden && lastPicks) renderResult(false);
  }, function () {});
}

var seriesCount = new Set(CHARACTERS.map(function (c) { return c.series; })).size;
var typeKeys = Object.keys(TYPES);
$("coverCount").textContent = CHARACTERS.length + " characters, " + typeKeys.length + " types, " + seriesCount + " series";
var branchCount = SLOTS.reduce(function (n, s) { return n + s.qs.length; }, 0);
$("pitch").textContent = "Live through " + ARCS.length + " story arcs and " + SLOTS.length + " chapters, from real-life moments to boss fights. The story branches as you answer, with " + branchCount + " possible scenes, so two runs rarely look the same.";
var roleCount = { P: 0, V: 0, S: 0 };
CHARACTERS.forEach(function (c) { roleCount[c.role]++; });
$("castRoles").innerHTML = "<strong>" + roleCount.P + " protagonists, " + roleCount.V + " villains and " + roleCount.S + " side characters</strong>, sorted into these types:";
var typeCount = {};
CHARACTERS.forEach(function (c) { typeCount[c.type] = (typeCount[c.type] || 0) + 1; });
$("castTypes").innerHTML = typeKeys.sort(function (a, b) { return typeCount[b] - typeCount[a]; }).map(function (k) {
  return '<li class="chip">' + esc(TYPES[k].name) + ' <small lang="ja">' + esc(TYPES[k].jp) + "</small> <b>" + typeCount[k] + "</b></li>";
}).join("");
var saved = loadSave();
if (saved) {
  $("resumeBtn").hidden = false;
  $("resumeBtn").textContent = "Continue from chapter " + (saved.index + 1);
}
drawBurst();
