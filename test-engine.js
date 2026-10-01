var E = require('./engine.js'), n = 0, bad = 0;
function eq(a, b, m, tol) { if (a === b) { n++; return; } n++; tol = tol == null ? 1e-9 : tol; if (!(Math.abs(a - b) <= tol)) { bad++; console.log('FAIL', m, a, b); } }
// published worked example: V = 1200 m3, sum S*a = 348 => T = 0.161*1200/348 = 0.555 s
eq(E.sabine(1200, 348), 0.161 * 1200 / 348, 'montana example'); eq(E.sabine(1200, 348), 0.555, 'montana 0.56', 6e-3); eq(0.161 * 1200, 193.2, 'numerator');
eq(E.sabine(100, 0), Infinity, 'no absorption');
// volume and areas
eq(E.volume(5, 4, 2.5), 50, 'vol');
var it = E.roomItems(5, 4, 2.5, { floor: 'wood', ceiling: 'gypsum', wall: 'gypsum' }, 0, 0);
eq(E.totalArea(it), 2 * 20 + 2 * 9 * 2.5, 'surface area'); eq(E.totalArea(it), 85, 'S=85');
eq(E.totalAbsorption(it), 20 * 0.10 + 20 * 0.06 + 45 * 0.06, 'A');
// windows come out of walls
var w2 = E.roomItems(5, 4, 2.5, { floor: 'wood', ceiling: 'gypsum', wall: 'gypsum' }, 6, 0);
eq(E.totalArea(w2), 85, 'window area conserved'); eq(E.totalAbsorption(w2), E.totalAbsorption(it) - 6 * 0.06 + 6 * 0.04, 'window absorption');
var w3 = E.roomItems(5, 4, 2.5, { floor: 'wood', ceiling: 'gypsum', wall: 'gypsum' }, 999, 0); eq(w3[2].area, 0, 'window capped at wall');
// people add absorption but not surface area in S
var p = E.roomItems(5, 4, 2.5, { floor: 'wood', ceiling: 'gypsum', wall: 'gypsum' }, 0, 4);
eq(E.totalAbsorption(p) - E.totalAbsorption(it), 4 * 0.45, 'people');
// Eyring approaches Sabine for low absorption and is shorter for high absorption
var V = 50, S = 85, A = E.totalAbsorption(it);
eq(E.eyring(V, S, A) < E.sabine(V, A) ? 1 : 0, 1, 'eyring < sabine'); eq(Math.abs(E.eyring(V, S, A) - E.sabine(V, A)) / E.sabine(V, A) < 0.06 ? 1 : 0, 1, 'close at low alpha');
eq(E.eyring(V, 100, 0.001 * 100), E.sabine(V, 0.1), 'tiny alpha', 5e-2);
// Eyring exact check for alpha 0.5: T = 0.161 V / (-S ln 0.5)
eq(E.eyring(100, 100, 50), 0.161 * 100 / (100 * Math.log(2)), 'eyring alpha .5');
eq(E.eyring(100, 100, 100) > 0 ? 1 : 0, 1, 'eyring finite at alpha 1');
// absorption needed and panel area
eq(E.absorptionNeeded(50, 0.5), 16.1, 'needed'); eq(E.absorptionNeeded(1200, 0.6), 322, 'needed 1200');
eq(E.panelArea(50, 20, 0.5, 0.85, 0) * 0.85 + 20, 16.1 > 20 ? 20 : 20, 'no panel needed when already enough'); eq(E.panelArea(50, 20, 0.5, 0.85, 0), 0, 'zero');
eq(E.panelArea(50, 5, 0.5, 0.85, 0), (16.1 - 5) / 0.85, 'panel'); eq(E.panelArea(50, 5, 0.5, 0.85, 0.06), (16.1 - 5) / 0.79, 'panel replace');
// panels hit the target
var Ap = 5 + E.panelArea(50, 5, 0.5, 0.85, 0) * 0.85; eq(E.sabine(50, Ap), 0.5, 'target reached', 1e-9);
// targets
eq(E.TARGETS.classroom.max, 0.6, 'ansi 0.6'); eq(E.TARGETS.classroom2.max, 0.7, 'ansi 0.7'); eq(E.TARGETS.studio.max < E.TARGETS.living.max ? 1 : 0, 1, 'studio dead');
// monotonic: more absorption => shorter RT; bigger room => longer RT
for (var a = 1; a < 40; a++) { eq(E.sabine(60, a + 1) < E.sabine(60, a) ? 1 : 0, 1, 'mono A' + a); eq(E.sabine(60 + a, 10) > E.sabine(60 + a - 1, 10) ? 1 : 0, 1, 'mono V' + a); }
Object.keys(E.MATERIALS).forEach(function (k) { var c = E.MATERIALS[k].a; eq(c > 0 && c <= 1 ? 1 : 0, 1, 'coef ' + k); });
// bare living room sanity: 5x4x2.5, wood/gypsum/gypsum, no people => ~1.4 s (very live)
eq(E.sabine(50, A), 0.161 * 50 / 5.9, 'bare room'); eq(E.sabine(50, A), 1.364, 'bare ~1.36', 1e-3);
console.log(n + ' assertions, ' + bad + ' failed'); process.exit(bad ? 1 : 0);
