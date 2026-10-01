(function (root) {
  'use strict';
  var K = 0.161; // Sabine constant, metric (s/m)
  // Typical mid-frequency (about 500 Hz) absorption coefficients; approximate, real products vary.
  var MATERIALS = {
    concrete: { name: 'Painted concrete / brick', a: 0.05 },
    gypsum: { name: 'Gypsum board / plaster wall', a: 0.06 },
    glass: { name: 'Window glass', a: 0.04 },
    wood: { name: 'Wood floor', a: 0.10 },
    tile: { name: 'Tile / stone floor', a: 0.02 },
    carpet: { name: 'Carpet on concrete', a: 0.30 },
    rug: { name: 'Thick carpet with underlay', a: 0.55 },
    acoustic: { name: 'Acoustic ceiling tile', a: 0.70 },
    curtain: { name: 'Heavy curtain, draped', a: 0.55 },
    panel: { name: 'Acoustic wall panel (50 mm)', a: 0.85 }
  };
  var PERSON = 0.45; // m2 sabins per seated person, approximate
  // Targets (seconds): classroom limits from ANSI/ASA S12.60-2010 Part 1, others are common rules of thumb.
  var TARGETS = {
    classroom: { name: 'Classroom, up to 283 m3 (ANSI S12.60)', max: 0.6 },
    classroom2: { name: 'Classroom, 283 to 566 m3 (ANSI S12.60)', max: 0.7 },
    living: { name: 'Living room or bedroom (rule of thumb)', max: 0.5 },
    office: { name: 'Meeting room or office (rule of thumb)', max: 0.6 },
    studio: { name: 'Home studio or podcast (rule of thumb)', max: 0.3 }
  };
  function volume(l, w, h) { return l * w * h; }
  function totalAbsorption(items) { var s = 0; items.forEach(function (i) { s += i.area * i.a; }); return s; }
  function totalArea(items) { var s = 0; items.forEach(function (i) { s += i.area; }); return s; }
  function sabine(V, A) { return A > 0 ? K * V / A : Infinity; }
  function eyring(V, S, A) {
    var abar = Math.min(A / S, 0.999999);
    return K * V / (-S * Math.log(1 - abar));
  }
  function absorptionNeeded(V, T) { return K * V / T; }
  // extra panel area needed so Sabine RT hits target, given panels of coefficient ap replace surface of coefficient abase
  function panelArea(V, A, T, ap, abase) {
    var need = absorptionNeeded(V, T) - A;
    if (need <= 0) return 0;
    return need / (ap - (abase || 0));
  }
  // surfaces of a rectangular room: floor, ceiling, walls (windowArea comes out of wall area)
  function roomItems(l, w, h, m, windowArea, people) {
    var wall = 2 * (l + w) * h, win = Math.min(Math.max(windowArea || 0, 0), wall);
    var items = [
      { name: 'Floor', area: l * w, a: MATERIALS[m.floor].a },
      { name: 'Ceiling', area: l * w, a: MATERIALS[m.ceiling].a },
      { name: 'Walls', area: wall - win, a: MATERIALS[m.wall].a }
    ];
    if (win > 0) items.push({ name: 'Windows', area: win, a: MATERIALS.glass.a });
    if (people > 0) items.push({ name: 'People', area: people, a: PERSON });
    return items;
  }
  var api = { K: K, MATERIALS: MATERIALS, PERSON: PERSON, TARGETS: TARGETS, volume: volume, totalAbsorption: totalAbsorption, totalArea: totalArea,
    sabine: sabine, eyring: eyring, absorptionNeeded: absorptionNeeded, panelArea: panelArea, roomItems: roomItems };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.RoomEcho = api;
})(typeof window !== 'undefined' ? window : this);
