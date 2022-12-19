function we() {
}
function vi(e) {
  return e();
}
function Ui() {
  return /* @__PURE__ */ Object.create(null);
}
function st(e) {
  e.forEach(vi);
}
function ni(e) {
  return typeof e == "function";
}
function yi(e, t) {
  return e != e ? t == t : e !== t || e && typeof e == "object" || typeof e == "function";
}
function iu(e) {
  return Object.keys(e).length === 0;
}
function ou(e, ...t) {
  if (e == null)
    return we;
  const r = e.subscribe(...t);
  return r.unsubscribe ? () => r.unsubscribe() : r;
}
function Sa(e, t, r) {
  e.$$.on_destroy.push(ou(t, r));
}
function au(e, t, r) {
  return e.set(r), t;
}
function D(e, t) {
  e.appendChild(t);
}
function ve(e, t, r) {
  e.insertBefore(t, r || null);
}
function be(e) {
  e.parentNode && e.parentNode.removeChild(e);
}
function su(e, t) {
  for (let r = 0; r < e.length; r += 1)
    e[r] && e[r].d(t);
}
function X(e) {
  return document.createElement(e);
}
function Oe(e) {
  return document.createTextNode(e);
}
function he() {
  return Oe(" ");
}
function tt(e, t, r, n) {
  return e.addEventListener(t, r, n), () => e.removeEventListener(t, r, n);
}
function Ra(e) {
  return function(t) {
    return t.preventDefault(), e.call(this, t);
  };
}
function Re(e, t, r) {
  r == null ? e.removeAttribute(t) : e.getAttribute(t) !== r && e.setAttribute(t, r);
}
function uu(e) {
  return Array.from(e.childNodes);
}
function fr(e, t) {
  t = "" + t, e.wholeText !== t && (e.data = t);
}
function Wr(e, t) {
  e.value = t ?? "";
}
function Hi(e, t) {
  for (let r = 0; r < e.options.length; r += 1) {
    const n = e.options[r];
    if (n.__value === t) {
      n.selected = !0;
      return;
    }
  }
  e.selectedIndex = -1;
}
function fu(e) {
  const t = e.querySelector(":checked") || e.options[0];
  return t && t.__value;
}
function Oa(e) {
  const t = {};
  for (const r of e)
    t[r.name] = r.value;
  return t;
}
let _r;
function lr(e) {
  _r = e;
}
function lu() {
  if (!_r)
    throw new Error("Function called outside component initialization");
  return _r;
}
function cu(e) {
  lu().$$.on_mount.push(e);
}
function hu(e, t) {
  const r = e.$$.callbacks[t.type];
  r && r.slice().forEach((n) => n.call(this, t));
}
const ur = [], $i = [], Fr = [], Wi = [], du = Promise.resolve();
let ii = !1;
function pu() {
  ii || (ii = !0, du.then(Gr));
}
function zr(e) {
  Fr.push(e);
}
const An = /* @__PURE__ */ new Set();
let Cr = 0;
function Gr() {
  const e = _r;
  do {
    for (; Cr < ur.length; ) {
      const t = ur[Cr];
      Cr++, lr(t), _u(t.$$);
    }
    for (lr(null), ur.length = 0, Cr = 0; $i.length; )
      $i.pop()();
    for (let t = 0; t < Fr.length; t += 1) {
      const r = Fr[t];
      An.has(r) || (An.add(r), r());
    }
    Fr.length = 0;
  } while (ur.length);
  for (; Wi.length; )
    Wi.pop()();
  ii = !1, An.clear(), lr(e);
}
function _u(e) {
  if (e.fragment !== null) {
    e.update(), st(e.before_update);
    const t = e.dirty;
    e.dirty = [-1], e.fragment && e.fragment.p(e.ctx, t), e.after_update.forEach(zr);
  }
}
const vu = /* @__PURE__ */ new Set();
function yu(e, t) {
  e && e.i && (vu.delete(e), e.i(t));
}
function gu(e, t, r, n) {
  const { fragment: i, after_update: a } = e.$$;
  i && i.m(t, r), n || zr(() => {
    const o = e.$$.on_mount.map(vi).filter(ni);
    e.$$.on_destroy ? e.$$.on_destroy.push(...o) : st(o), e.$$.on_mount = [];
  }), a.forEach(zr);
}
function bu(e, t) {
  const r = e.$$;
  r.fragment !== null && (st(r.on_destroy), r.fragment && r.fragment.d(t), r.on_destroy = r.fragment = null, r.ctx = []);
}
function wu(e, t) {
  e.$$.dirty[0] === -1 && (ur.push(e), pu(), e.$$.dirty.fill(0)), e.$$.dirty[t / 31 | 0] |= 1 << t % 31;
}
function Aa(e, t, r, n, i, a, o, u = [-1]) {
  const s = _r;
  lr(e);
  const f = e.$$ = {
    fragment: null,
    ctx: [],
    props: a,
    update: we,
    not_equal: i,
    bound: Ui(),
    on_mount: [],
    on_destroy: [],
    on_disconnect: [],
    before_update: [],
    after_update: [],
    context: new Map(t.context || (s ? s.$$.context : [])),
    callbacks: Ui(),
    dirty: u,
    skip_bound: !1,
    root: t.target || s.$$.root
  };
  o && o(f.root);
  let h = !1;
  if (f.ctx = r ? r(e, t.props || {}, (l, c, ...d) => {
    const p = d.length ? d[0] : c;
    return f.ctx && i(f.ctx[l], f.ctx[l] = p) && (!f.skip_bound && f.bound[l] && f.bound[l](p), h && wu(e, l)), c;
  }) : [], f.update(), h = !0, st(f.before_update), f.fragment = n ? n(f.ctx) : !1, t.target) {
    if (t.hydrate) {
      const l = uu(t.target);
      f.fragment && f.fragment.l(l), l.forEach(be);
    } else
      f.fragment && f.fragment.c();
    t.intro && yu(e.$$.fragment), gu(e, t.target, t.anchor, t.customElement), Gr();
  }
  lr(s);
}
let gi;
typeof HTMLElement == "function" && (gi = class extends HTMLElement {
  constructor() {
    super(), this.attachShadow({ mode: "open" });
  }
  connectedCallback() {
    const { on_mount: e } = this.$$;
    this.$$.on_disconnect = e.map(vi).filter(ni);
    for (const t in this.$$.slotted)
      this.appendChild(this.$$.slotted[t]);
  }
  attributeChangedCallback(e, t, r) {
    this[e] = r;
  }
  disconnectedCallback() {
    st(this.$$.on_disconnect);
  }
  $destroy() {
    bu(this, 1), this.$destroy = we;
  }
  $on(e, t) {
    if (!ni(t))
      return we;
    const r = this.$$.callbacks[e] || (this.$$.callbacks[e] = []);
    return r.push(t), () => {
      const n = r.indexOf(t);
      n !== -1 && r.splice(n, 1);
    };
  }
  $set(e) {
    this.$$set && !iu(e) && (this.$$.skip_bound = !0, this.$$set(e), this.$$.skip_bound = !1);
  }
});
const xu = {}, mu = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: xu
}, Symbol.toStringTag, { value: "Module" }));
/*! noble-secp256k1 - MIT License (c) 2019 Paul Miller (paulmillr.com) */
const H = BigInt(0), J = BigInt(1), Ke = BigInt(2), cr = BigInt(3), Eu = BigInt(8), K = Object.freeze({
  a: H,
  b: BigInt(7),
  P: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),
  n: BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),
  h: J,
  Gx: BigInt("55066263022277343669578718895168534326250603453777594175500187360389116729240"),
  Gy: BigInt("32670510020758816978083085130507043184471273380659243275938904335757337482424"),
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee")
});
function zi(e) {
  const { a: t, b: r } = K, n = T(e * e), i = T(n * e);
  return T(i + t * e + r);
}
const Mr = K.a === H;
class Ia extends Error {
  constructor(t) {
    super(t);
  }
}
class $ {
  constructor(t, r, n) {
    this.x = t, this.y = r, this.z = n;
  }
  static fromAffine(t) {
    if (!(t instanceof Q))
      throw new TypeError("JacobianPoint#fromAffine: expected Point");
    return new $(t.x, t.y, J);
  }
  static toAffineBatch(t) {
    const r = Iu(t.map((n) => n.z));
    return t.map((n, i) => n.toAffine(r[i]));
  }
  static normalizeZ(t) {
    return $.toAffineBatch(t).map($.fromAffine);
  }
  equals(t) {
    if (!(t instanceof $))
      throw new TypeError("JacobianPoint expected");
    const { x: r, y: n, z: i } = this, { x: a, y: o, z: u } = t, s = T(i * i), f = T(u * u), h = T(r * f), l = T(a * s), c = T(T(n * u) * f), d = T(T(o * i) * s);
    return h === l && c === d;
  }
  negate() {
    return new $(this.x, T(-this.y), this.z);
  }
  double() {
    const { x: t, y: r, z: n } = this, i = T(t * t), a = T(r * r), o = T(a * a), u = t + a, s = T(Ke * (T(u * u) - i - o)), f = T(cr * i), h = T(f * f), l = T(h - Ke * s), c = T(f * (s - l) - Eu * o), d = T(Ke * r * n);
    return new $(l, c, d);
  }
  add(t) {
    if (!(t instanceof $))
      throw new TypeError("JacobianPoint expected");
    const { x: r, y: n, z: i } = this, { x: a, y: o, z: u } = t;
    if (a === H || o === H)
      return this;
    if (r === H || n === H)
      return t;
    const s = T(i * i), f = T(u * u), h = T(r * f), l = T(a * s), c = T(T(n * u) * f), d = T(T(o * i) * s), p = T(l - h), y = T(d - c);
    if (p === H)
      return y === H ? this.double() : $.ZERO;
    const g = T(p * p), x = T(p * g), E = T(h * g), I = T(y * y - x - Ke * E), R = T(y * (E - I) - c * x), L = T(i * u * p);
    return new $(I, R, L);
  }
  subtract(t) {
    return this.add(t.negate());
  }
  multiplyUnsafe(t) {
    const r = $.ZERO;
    if (typeof t == "bigint" && t === H)
      return r;
    let n = Vi(t);
    if (n === J)
      return this;
    if (!Mr) {
      let l = r, c = this;
      for (; n > H; )
        n & J && (l = l.add(c)), c = c.double(), n >>= J;
      return l;
    }
    let { k1neg: i, k1: a, k2neg: o, k2: u } = Zi(n), s = r, f = r, h = this;
    for (; a > H || u > H; )
      a & J && (s = s.add(h)), u & J && (f = f.add(h)), h = h.double(), a >>= J, u >>= J;
    return i && (s = s.negate()), o && (f = f.negate()), f = new $(T(f.x * K.beta), f.y, f.z), s.add(f);
  }
  precomputeWindow(t) {
    const r = Mr ? 128 / t + 1 : 256 / t + 1, n = [];
    let i = this, a = i;
    for (let o = 0; o < r; o++) {
      a = i, n.push(a);
      for (let u = 1; u < 2 ** (t - 1); u++)
        a = a.add(i), n.push(a);
      i = a.double();
    }
    return n;
  }
  wNAF(t, r) {
    !r && this.equals($.BASE) && (r = Q.BASE);
    const n = r && r._WINDOW_SIZE || 1;
    if (256 % n)
      throw new Error("Point#wNAF: Invalid precomputation window, must be power of 2");
    let i = r && oi.get(r);
    i || (i = this.precomputeWindow(n), r && n !== 1 && (i = $.normalizeZ(i), oi.set(r, i)));
    let a = $.ZERO, o = $.ZERO;
    const u = 1 + (Mr ? 128 / n : 256 / n), s = 2 ** (n - 1), f = BigInt(2 ** n - 1), h = 2 ** n, l = BigInt(n);
    for (let c = 0; c < u; c++) {
      const d = c * s;
      let p = Number(t & f);
      if (t >>= l, p > s && (p -= h, t += J), p === 0) {
        let y = i[d];
        c % 2 && (y = y.negate()), o = o.add(y);
      } else {
        let y = i[d + Math.abs(p) - 1];
        p < 0 && (y = y.negate()), a = a.add(y);
      }
    }
    return { p: a, f: o };
  }
  multiply(t, r) {
    let n = Vi(t), i, a;
    if (Mr) {
      const { k1neg: o, k1: u, k2neg: s, k2: f } = Zi(n);
      let { p: h, f: l } = this.wNAF(u, r), { p: c, f: d } = this.wNAF(f, r);
      o && (h = h.negate()), s && (c = c.negate()), c = new $(T(c.x * K.beta), c.y, c.z), i = h.add(c), a = l.add(d);
    } else {
      const { p: o, f: u } = this.wNAF(n, r);
      i = o, a = u;
    }
    return $.normalizeZ([i, a])[0];
  }
  toAffine(t = rn(this.z)) {
    const { x: r, y: n, z: i } = this, a = t, o = T(a * a), u = T(o * a), s = T(r * o), f = T(n * u);
    if (T(i * a) !== J)
      throw new Error("invZ was invalid");
    return new Q(s, f);
  }
}
$.BASE = new $(K.Gx, K.Gy, J);
$.ZERO = new $(H, J, H);
const oi = /* @__PURE__ */ new WeakMap();
class Q {
  constructor(t, r) {
    this.x = t, this.y = r;
  }
  _setWindowSize(t) {
    this._WINDOW_SIZE = t, oi.delete(this);
  }
  hasEvenY() {
    return this.y % Ke === H;
  }
  static fromCompressedHex(t) {
    const r = t.length === 32, n = Ae(r ? t : t.subarray(1));
    if (!Nr(n))
      throw new Error("Point is not on curve");
    const i = zi(n);
    let a = Au(i);
    const o = (a & J) === J;
    r ? o && (a = T(-a)) : (t[0] & 1) === 1 !== o && (a = T(-a));
    const u = new Q(n, a);
    return u.assertValidity(), u;
  }
  static fromUncompressedHex(t) {
    const r = Ae(t.subarray(1, 33)), n = Ae(t.subarray(33, 65)), i = new Q(r, n);
    return i.assertValidity(), i;
  }
  static fromHex(t) {
    const r = ot(t), n = r.length, i = r[0];
    if (n === 32 || n === 33 && (i === 2 || i === 3))
      return this.fromCompressedHex(r);
    if (n === 65 && i === 4)
      return this.fromUncompressedHex(r);
    throw new Error(`Point.fromHex: received invalid point. Expected 32-33 compressed bytes or 65 uncompressed bytes, not ${n}`);
  }
  static fromPrivateKey(t) {
    return Q.BASE.multiply(gr(t));
  }
  static fromSignature(t, r, n) {
    t = ot(t);
    const i = Cu(t), { r: a, s: o } = Bu(r);
    if (n !== 0 && n !== 1)
      throw new Error("Cannot recover signature: invalid recovery bit");
    const u = n & 1 ? "03" : "02", s = Q.fromHex(u + Ze(a)), { n: f } = K, h = rn(a, f), l = T(-i * h, f), c = T(o * h, f), d = Q.BASE.multiplyAndAddUnsafe(s, l, c);
    if (!d)
      throw new Error("Cannot recover signature: point at infinify");
    return d.assertValidity(), d;
  }
  toRawBytes(t = !1) {
    return Xe(this.toHex(t));
  }
  toHex(t = !1) {
    const r = Ze(this.x);
    return t ? `${this.hasEvenY() ? "02" : "03"}${r}` : `04${r}${Ze(this.y)}`;
  }
  toHexX() {
    return this.toHex(!0).slice(2);
  }
  toRawX() {
    return this.toRawBytes(!0).slice(1);
  }
  assertValidity() {
    const t = "Point is not on elliptic curve", { x: r, y: n } = this;
    if (!Nr(r) || !Nr(n))
      throw new Error(t);
    const i = T(n * n), a = zi(r);
    if (T(i - a) !== H)
      throw new Error(t);
  }
  equals(t) {
    return this.x === t.x && this.y === t.y;
  }
  negate() {
    return new Q(this.x, T(-this.y));
  }
  double() {
    return $.fromAffine(this).double().toAffine();
  }
  add(t) {
    return $.fromAffine(this).add($.fromAffine(t)).toAffine();
  }
  subtract(t) {
    return this.add(t.negate());
  }
  multiply(t) {
    return $.fromAffine(this).multiply(t, this).toAffine();
  }
  multiplyAndAddUnsafe(t, r, n) {
    const i = $.fromAffine(this), a = r === H || r === J || this !== Q.BASE ? i.multiplyUnsafe(r) : i.multiply(r), o = $.fromAffine(t).multiplyUnsafe(n), u = a.add(o);
    return u.equals($.ZERO) ? void 0 : u.toAffine();
  }
}
Q.BASE = new Q(K.Gx, K.Gy);
Q.ZERO = new Q(H, H);
function Gi(e) {
  return Number.parseInt(e[0], 16) >= 8 ? "00" + e : e;
}
function Yi(e) {
  if (e.length < 2 || e[0] !== 2)
    throw new Error(`Invalid signature integer tag: ${Et(e)}`);
  const t = e[1], r = e.subarray(2, t + 2);
  if (!t || r.length !== t)
    throw new Error("Invalid signature integer: wrong length");
  if (r[0] === 0 && r[1] <= 127)
    throw new Error("Invalid signature integer: trailing length");
  return { data: Ae(r), left: e.subarray(t + 2) };
}
function Su(e) {
  if (e.length < 2 || e[0] != 48)
    throw new Error(`Invalid signature tag: ${Et(e)}`);
  if (e[1] !== e.length - 2)
    throw new Error("Invalid signature: incorrect length");
  const { data: t, left: r } = Yi(e.subarray(2)), { data: n, left: i } = Yi(r);
  if (i.length)
    throw new Error(`Invalid signature: left bytes after parsing: ${Et(i)}`);
  return { r: t, s: n };
}
class it {
  constructor(t, r) {
    this.r = t, this.s = r, this.assertValidity();
  }
  static fromCompact(t) {
    const r = t instanceof Uint8Array, n = "Signature.fromCompact";
    if (typeof t != "string" && !r)
      throw new TypeError(`${n}: Expected string or Uint8Array`);
    const i = r ? Et(t) : t;
    if (i.length !== 128)
      throw new Error(`${n}: Expected 64-byte hex`);
    return new it(Yr(i.slice(0, 64)), Yr(i.slice(64, 128)));
  }
  static fromDER(t) {
    const r = t instanceof Uint8Array;
    if (typeof t != "string" && !r)
      throw new TypeError("Signature.fromDER: Expected string or Uint8Array");
    const { r: n, s: i } = Su(r ? t : Xe(t));
    return new it(n, i);
  }
  static fromHex(t) {
    return this.fromDER(t);
  }
  assertValidity() {
    const { r: t, s: r } = this;
    if (!yr(t))
      throw new Error("Invalid Signature: r must be 0 < r < n");
    if (!yr(r))
      throw new Error("Invalid Signature: s must be 0 < s < n");
  }
  hasHighS() {
    const t = K.n >> J;
    return this.s > t;
  }
  normalizeS() {
    return this.hasHighS() ? new it(this.r, K.n - this.s) : this;
  }
  toDERRawBytes(t = !1) {
    return Xe(this.toDERHex(t));
  }
  toDERHex(t = !1) {
    const r = Gi(kt(this.s));
    if (t)
      return r;
    const n = Gi(kt(this.r)), i = kt(n.length / 2), a = kt(r.length / 2);
    return `30${kt(n.length / 2 + r.length / 2 + 4)}02${i}${n}02${a}${r}`;
  }
  toRawBytes() {
    return this.toDERRawBytes();
  }
  toHex() {
    return this.toDERHex();
  }
  toCompactRawBytes() {
    return Xe(this.toCompactHex());
  }
  toCompactHex() {
    return Ze(this.r) + Ze(this.s);
  }
}
function Bt(...e) {
  if (!e.every((n) => n instanceof Uint8Array))
    throw new Error("Uint8Array list expected");
  if (e.length === 1)
    return e[0];
  const t = e.reduce((n, i) => n + i.length, 0), r = new Uint8Array(t);
  for (let n = 0, i = 0; n < e.length; n++) {
    const a = e[n];
    r.set(a, i), i += a.length;
  }
  return r;
}
const Ru = Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function Et(e) {
  if (!(e instanceof Uint8Array))
    throw new Error("Expected Uint8Array");
  let t = "";
  for (let r = 0; r < e.length; r++)
    t += Ru[e[r]];
  return t;
}
const Ou = BigInt("0x10000000000000000000000000000000000000000000000000000000000000000");
function Ze(e) {
  if (typeof e != "bigint")
    throw new Error("Expected bigint");
  if (!(H <= e && e < Ou))
    throw new Error("Expected number < 2^256");
  return e.toString(16).padStart(64, "0");
}
function vr(e) {
  const t = Xe(Ze(e));
  if (t.length !== 32)
    throw new Error("Error: expected 32 bytes");
  return t;
}
function kt(e) {
  const t = e.toString(16);
  return t.length & 1 ? `0${t}` : t;
}
function Yr(e) {
  if (typeof e != "string")
    throw new TypeError("hexToNumber: expected string, got " + typeof e);
  return BigInt(`0x${e}`);
}
function Xe(e) {
  if (typeof e != "string")
    throw new TypeError("hexToBytes: expected string, got " + typeof e);
  if (e.length % 2)
    throw new Error("hexToBytes: received invalid unpadded hex" + e.length);
  const t = new Uint8Array(e.length / 2);
  for (let r = 0; r < t.length; r++) {
    const n = r * 2, i = e.slice(n, n + 2), a = Number.parseInt(i, 16);
    if (Number.isNaN(a) || a < 0)
      throw new Error("Invalid byte sequence");
    t[r] = a;
  }
  return t;
}
function Ae(e) {
  return Yr(Et(e));
}
function ot(e) {
  return e instanceof Uint8Array ? Uint8Array.from(e) : Xe(e);
}
function Vi(e) {
  if (typeof e == "number" && Number.isSafeInteger(e) && e > 0)
    return BigInt(e);
  if (typeof e == "bigint" && yr(e))
    return e;
  throw new TypeError("Expected valid private scalar: 0 < scalar < curve.n");
}
function T(e, t = K.P) {
  const r = e % t;
  return r >= H ? r : t + r;
}
function Ee(e, t) {
  const { P: r } = K;
  let n = e;
  for (; t-- > H; )
    n *= n, n %= r;
  return n;
}
function Au(e) {
  const { P: t } = K, r = BigInt(6), n = BigInt(11), i = BigInt(22), a = BigInt(23), o = BigInt(44), u = BigInt(88), s = e * e * e % t, f = s * s * e % t, h = Ee(f, cr) * f % t, l = Ee(h, cr) * f % t, c = Ee(l, Ke) * s % t, d = Ee(c, n) * c % t, p = Ee(d, i) * d % t, y = Ee(p, o) * p % t, g = Ee(y, u) * y % t, x = Ee(g, o) * p % t, E = Ee(x, cr) * f % t, I = Ee(E, a) * d % t, R = Ee(I, r) * s % t;
  return Ee(R, Ke);
}
function rn(e, t = K.P) {
  if (e === H || t <= H)
    throw new Error(`invert: expected positive integers, got n=${e} mod=${t}`);
  let r = T(e, t), n = t, i = H, a = J;
  for (; r !== H; ) {
    const u = n / r, s = n % r, f = i - a * u;
    n = r, r = s, i = a, a = f;
  }
  if (n !== J)
    throw new Error("invert: does not exist");
  return T(i, t);
}
function Iu(e, t = K.P) {
  const r = new Array(e.length), n = e.reduce((a, o, u) => o === H ? a : (r[u] = a, T(a * o, t)), J), i = rn(n, t);
  return e.reduceRight((a, o, u) => o === H ? a : (r[u] = T(a * r[u], t), T(a * o, t)), i), r;
}
const Ki = (e, t) => (e + t / Ke) / t, Tu = {
  a1: BigInt("0x3086d221a7d46bcde86c90e49284eb15"),
  b1: -J * BigInt("0xe4437ed6010e88286f547fa90abfe4c3"),
  a2: BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"),
  b2: BigInt("0x3086d221a7d46bcde86c90e49284eb15"),
  POW_2_128: BigInt("0x100000000000000000000000000000000")
};
function Zi(e) {
  const { n: t } = K, { a1: r, b1: n, a2: i, b2: a, POW_2_128: o } = Tu, u = Ki(a * e, t), s = Ki(-n * e, t);
  let f = T(e - u * r - s * i, t), h = T(-u * n - s * a, t);
  const l = f > o, c = h > o;
  if (l && (f = t - f), c && (h = t - h), f > o || h > o)
    throw new Error("splitScalarEndo: Endomorphism failed, k=" + e);
  return { k1neg: l, k1: f, k2neg: c, k2: h };
}
function Cu(e) {
  const { n: t } = K, n = e.length * 8 - 256;
  let i = Ae(e);
  return n > 0 && (i = i >> BigInt(n)), i >= t && (i -= t), i;
}
let wt, In;
function yr(e) {
  return H < e && e < K.n;
}
function Nr(e) {
  return H < e && e < K.P;
}
function gr(e) {
  let t;
  if (typeof e == "bigint")
    t = e;
  else if (typeof e == "number" && Number.isSafeInteger(e) && e > 0)
    t = BigInt(e);
  else if (typeof e == "string") {
    if (e.length !== 64)
      throw new Error("Expected 32 bytes of private key");
    t = Yr(e);
  } else if (e instanceof Uint8Array) {
    if (e.length !== 32)
      throw new Error("Expected 32 bytes of private key");
    t = Ae(e);
  } else
    throw new TypeError("Expected valid private key");
  if (!yr(t))
    throw new Error("Expected private key: 0 < key < n");
  return t;
}
function Mu(e) {
  return e instanceof Q ? (e.assertValidity(), e) : Q.fromHex(e);
}
function Bu(e) {
  if (e instanceof it)
    return e.assertValidity(), e;
  try {
    return it.fromDER(e);
  } catch {
    return it.fromCompact(e);
  }
}
function Vr(e) {
  return T(Ae(e), K.n);
}
class St {
  constructor(t, r) {
    this.r = t, this.s = r, this.assertValidity();
  }
  static fromHex(t) {
    const r = ot(t);
    if (r.length !== 64)
      throw new TypeError(`SchnorrSignature.fromHex: expected 64 bytes, not ${r.length}`);
    const n = Ae(r.subarray(0, 32)), i = Ae(r.subarray(32, 64));
    return new St(n, i);
  }
  assertValidity() {
    const { r: t, s: r } = this;
    if (!Nr(t) || !yr(r))
      throw new Error("Invalid signature");
  }
  toHex() {
    return Ze(this.r) + Ze(this.s);
  }
  toRawBytes() {
    return Xe(this.toHex());
  }
}
function ku(e) {
  return Q.fromPrivateKey(e).toRawX();
}
class Ta {
  constructor(t, r, n = Ce.randomBytes()) {
    if (t == null)
      throw new TypeError(`sign: Expected valid message, not "${t}"`);
    this.m = ot(t);
    const { x: i, scalar: a } = this.getScalar(gr(r));
    if (this.px = i, this.d = a, this.rand = ot(n), this.rand.length !== 32)
      throw new TypeError("sign: Expected 32 bytes of aux randomness");
  }
  getScalar(t) {
    const r = Q.fromPrivateKey(t), n = r.hasEvenY() ? t : K.n - t;
    return { point: r, scalar: n, x: r.toRawX() };
  }
  initNonce(t, r) {
    return vr(t ^ Ae(r));
  }
  finalizeNonce(t) {
    const r = T(Ae(t), K.n);
    if (r === H)
      throw new Error("sign: Creation of signature failed. k is zero");
    const { point: n, x: i, scalar: a } = this.getScalar(r);
    return { R: n, rx: i, k: a };
  }
  finalizeSig(t, r, n, i) {
    return new St(t.x, T(r + n * i, K.n)).toRawBytes();
  }
  error() {
    throw new Error("sign: Invalid signature produced");
  }
  async calc() {
    const { m: t, d: r, px: n, rand: i } = this, a = Ce.taggedHash, o = this.initNonce(r, await a(Ve.aux, i)), { R: u, rx: s, k: f } = this.finalizeNonce(await a(Ve.nonce, o, n, t)), h = Vr(await a(Ve.challenge, s, n, t)), l = this.finalizeSig(u, f, h, r);
    return await Ba(l, t, n) || this.error(), l;
  }
  calcSync() {
    const { m: t, d: r, px: n, rand: i } = this, a = Ce.taggedHashSync, o = this.initNonce(r, a(Ve.aux, i)), { R: u, rx: s, k: f } = this.finalizeNonce(a(Ve.nonce, o, n, t)), h = Vr(a(Ve.challenge, s, n, t)), l = this.finalizeSig(u, f, h, r);
    return ka(l, t, n) || this.error(), l;
  }
}
async function Lu(e, t, r) {
  return new Ta(e, t, r).calc();
}
function Pu(e, t, r) {
  return new Ta(e, t, r).calcSync();
}
function Ca(e, t, r) {
  const n = e instanceof St, i = n ? e : St.fromHex(e);
  return n && i.assertValidity(), {
    ...i,
    m: ot(t),
    P: Mu(r)
  };
}
function Ma(e, t, r, n) {
  const i = Q.BASE.multiplyAndAddUnsafe(t, gr(r), T(-n, K.n));
  return !(!i || !i.hasEvenY() || i.x !== e);
}
async function Ba(e, t, r) {
  try {
    const { r: n, s: i, m: a, P: o } = Ca(e, t, r), u = Vr(await Ce.taggedHash(Ve.challenge, vr(n), o.toRawX(), a));
    return Ma(n, o, i, u);
  } catch {
    return !1;
  }
}
function ka(e, t, r) {
  try {
    const { r: n, s: i, m: a, P: o } = Ca(e, t, r), u = Vr(Ce.taggedHashSync(Ve.challenge, vr(n), o.toRawX(), a));
    return Ma(n, o, i, u);
  } catch (n) {
    if (n instanceof Ia)
      throw n;
    return !1;
  }
}
const bi = {
  Signature: St,
  getPublicKey: ku,
  sign: Lu,
  verify: Ba,
  signSync: Pu,
  verifySync: ka
};
Q.BASE._setWindowSize(8);
const ge = {
  node: mu,
  web: typeof self == "object" && "crypto" in self ? self.crypto : void 0
}, Ve = {
  challenge: "BIP0340/challenge",
  aux: "BIP0340/aux",
  nonce: "BIP0340/nonce"
}, Br = {}, Ce = {
  bytesToHex: Et,
  hexToBytes: Xe,
  concatBytes: Bt,
  mod: T,
  invert: rn,
  isValidPrivateKey(e) {
    try {
      return gr(e), !0;
    } catch {
      return !1;
    }
  },
  _bigintTo32Bytes: vr,
  _normalizePrivateKey: gr,
  hashToPrivateKey: (e) => {
    if (e = ot(e), e.length < 40 || e.length > 1024)
      throw new Error("Expected 40-1024 bytes of private key as per FIPS 186");
    const t = T(Ae(e), K.n - J) + J;
    return vr(t);
  },
  randomBytes: (e = 32) => {
    if (ge.web)
      return ge.web.getRandomValues(new Uint8Array(e));
    if (ge.node) {
      const { randomBytes: t } = ge.node;
      return Uint8Array.from(t(e));
    } else
      throw new Error("The environment doesn't have randomBytes function");
  },
  randomPrivateKey: () => Ce.hashToPrivateKey(Ce.randomBytes(40)),
  sha256: async (...e) => {
    if (ge.web) {
      const t = await ge.web.subtle.digest("SHA-256", Bt(...e));
      return new Uint8Array(t);
    } else if (ge.node) {
      const { createHash: t } = ge.node, r = t("sha256");
      return e.forEach((n) => r.update(n)), Uint8Array.from(r.digest());
    } else
      throw new Error("The environment doesn't have sha256 function");
  },
  hmacSha256: async (e, ...t) => {
    if (ge.web) {
      const r = await ge.web.subtle.importKey("raw", e, { name: "HMAC", hash: { name: "SHA-256" } }, !1, ["sign"]), n = Bt(...t), i = await ge.web.subtle.sign("HMAC", r, n);
      return new Uint8Array(i);
    } else if (ge.node) {
      const { createHmac: r } = ge.node, n = r("sha256", e);
      return t.forEach((i) => n.update(i)), Uint8Array.from(n.digest());
    } else
      throw new Error("The environment doesn't have hmac-sha256 function");
  },
  sha256Sync: void 0,
  hmacSha256Sync: void 0,
  taggedHash: async (e, ...t) => {
    let r = Br[e];
    if (r === void 0) {
      const n = await Ce.sha256(Uint8Array.from(e, (i) => i.charCodeAt(0)));
      r = Bt(n, n), Br[e] = r;
    }
    return Ce.sha256(r, ...t);
  },
  taggedHashSync: (e, ...t) => {
    if (typeof wt != "function")
      throw new Ia("sha256Sync is undefined, you need to set it");
    let r = Br[e];
    if (r === void 0) {
      const n = wt(Uint8Array.from(e, (i) => i.charCodeAt(0)));
      r = Bt(n, n), Br[e] = r;
    }
    return wt(r, ...t);
  },
  precompute(e = 8, t = Q.BASE) {
    const r = t === Q.BASE ? t : new Q(t.x, t.y);
    return r._setWindowSize(e), r.multiply(cr), r;
  }
};
Object.defineProperties(Ce, {
  sha256Sync: {
    configurable: !1,
    get() {
      return wt;
    },
    set(e) {
      wt || (wt = e);
    }
  },
  hmacSha256Sync: {
    configurable: !1,
    get() {
      return In;
    },
    set(e) {
      In || (In = e);
    }
  }
});
const ai = typeof global < "u" ? global : typeof self < "u" ? self : typeof window < "u" ? window : {};
var je = [], Se = [], qu = typeof Uint8Array < "u" ? Uint8Array : Array, wi = !1;
function La() {
  wi = !0;
  for (var e = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", t = 0, r = e.length; t < r; ++t)
    je[t] = e[t], Se[e.charCodeAt(t)] = t;
  Se["-".charCodeAt(0)] = 62, Se["_".charCodeAt(0)] = 63;
}
function ju(e) {
  wi || La();
  var t, r, n, i, a, o, u = e.length;
  if (u % 4 > 0)
    throw new Error("Invalid string. Length must be a multiple of 4");
  a = e[u - 2] === "=" ? 2 : e[u - 1] === "=" ? 1 : 0, o = new qu(u * 3 / 4 - a), n = a > 0 ? u - 4 : u;
  var s = 0;
  for (t = 0, r = 0; t < n; t += 4, r += 3)
    i = Se[e.charCodeAt(t)] << 18 | Se[e.charCodeAt(t + 1)] << 12 | Se[e.charCodeAt(t + 2)] << 6 | Se[e.charCodeAt(t + 3)], o[s++] = i >> 16 & 255, o[s++] = i >> 8 & 255, o[s++] = i & 255;
  return a === 2 ? (i = Se[e.charCodeAt(t)] << 2 | Se[e.charCodeAt(t + 1)] >> 4, o[s++] = i & 255) : a === 1 && (i = Se[e.charCodeAt(t)] << 10 | Se[e.charCodeAt(t + 1)] << 4 | Se[e.charCodeAt(t + 2)] >> 2, o[s++] = i >> 8 & 255, o[s++] = i & 255), o;
}
function Du(e) {
  return je[e >> 18 & 63] + je[e >> 12 & 63] + je[e >> 6 & 63] + je[e & 63];
}
function Fu(e, t, r) {
  for (var n, i = [], a = t; a < r; a += 3)
    n = (e[a] << 16) + (e[a + 1] << 8) + e[a + 2], i.push(Du(n));
  return i.join("");
}
function Xi(e) {
  wi || La();
  for (var t, r = e.length, n = r % 3, i = "", a = [], o = 16383, u = 0, s = r - n; u < s; u += o)
    a.push(Fu(e, u, u + o > s ? s : u + o));
  return n === 1 ? (t = e[r - 1], i += je[t >> 2], i += je[t << 4 & 63], i += "==") : n === 2 && (t = (e[r - 2] << 8) + e[r - 1], i += je[t >> 10], i += je[t >> 4 & 63], i += je[t << 2 & 63], i += "="), a.push(i), a.join("");
}
function nn(e, t, r, n, i) {
  var a, o, u = i * 8 - n - 1, s = (1 << u) - 1, f = s >> 1, h = -7, l = r ? i - 1 : 0, c = r ? -1 : 1, d = e[t + l];
  for (l += c, a = d & (1 << -h) - 1, d >>= -h, h += u; h > 0; a = a * 256 + e[t + l], l += c, h -= 8)
    ;
  for (o = a & (1 << -h) - 1, a >>= -h, h += n; h > 0; o = o * 256 + e[t + l], l += c, h -= 8)
    ;
  if (a === 0)
    a = 1 - f;
  else {
    if (a === s)
      return o ? NaN : (d ? -1 : 1) * (1 / 0);
    o = o + Math.pow(2, n), a = a - f;
  }
  return (d ? -1 : 1) * o * Math.pow(2, a - n);
}
function Pa(e, t, r, n, i, a) {
  var o, u, s, f = a * 8 - i - 1, h = (1 << f) - 1, l = h >> 1, c = i === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0, d = n ? 0 : a - 1, p = n ? 1 : -1, y = t < 0 || t === 0 && 1 / t < 0 ? 1 : 0;
  for (t = Math.abs(t), isNaN(t) || t === 1 / 0 ? (u = isNaN(t) ? 1 : 0, o = h) : (o = Math.floor(Math.log(t) / Math.LN2), t * (s = Math.pow(2, -o)) < 1 && (o--, s *= 2), o + l >= 1 ? t += c / s : t += c * Math.pow(2, 1 - l), t * s >= 2 && (o++, s /= 2), o + l >= h ? (u = 0, o = h) : o + l >= 1 ? (u = (t * s - 1) * Math.pow(2, i), o = o + l) : (u = t * Math.pow(2, l - 1) * Math.pow(2, i), o = 0)); i >= 8; e[r + d] = u & 255, d += p, u /= 256, i -= 8)
    ;
  for (o = o << i | u, f += i; f > 0; e[r + d] = o & 255, d += p, o /= 256, f -= 8)
    ;
  e[r + d - p] |= y * 128;
}
var Nu = {}.toString, qa = Array.isArray || function(e) {
  return Nu.call(e) == "[object Array]";
};
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
var ja = 50;
m.TYPED_ARRAY_SUPPORT = ai.TYPED_ARRAY_SUPPORT !== void 0 ? ai.TYPED_ARRAY_SUPPORT : !0;
var Uu = Kr();
function Kr() {
  return m.TYPED_ARRAY_SUPPORT ? 2147483647 : 1073741823;
}
function $e(e, t) {
  if (Kr() < t)
    throw new RangeError("Invalid typed array length");
  return m.TYPED_ARRAY_SUPPORT ? (e = new Uint8Array(t), e.__proto__ = m.prototype) : (e === null && (e = new m(t)), e.length = t), e;
}
function m(e, t, r) {
  if (!m.TYPED_ARRAY_SUPPORT && !(this instanceof m))
    return new m(e, t, r);
  if (typeof e == "number") {
    if (typeof t == "string")
      throw new Error(
        "If encoding is specified then the first argument must be a string"
      );
    return xi(this, e);
  }
  return Da(this, e, t, r);
}
m.poolSize = 8192;
m._augment = function(e) {
  return e.__proto__ = m.prototype, e;
};
function Da(e, t, r, n) {
  if (typeof t == "number")
    throw new TypeError('"value" argument must not be a number');
  return typeof ArrayBuffer < "u" && t instanceof ArrayBuffer ? Wu(e, t, r, n) : typeof t == "string" ? $u(e, t, r) : zu(e, t);
}
m.from = function(e, t, r) {
  return Da(null, e, t, r);
};
m.TYPED_ARRAY_SUPPORT && (m.prototype.__proto__ = Uint8Array.prototype, m.__proto__ = Uint8Array);
function Fa(e) {
  if (typeof e != "number")
    throw new TypeError('"size" argument must be a number');
  if (e < 0)
    throw new RangeError('"size" argument must not be negative');
}
function Hu(e, t, r, n) {
  return Fa(t), t <= 0 ? $e(e, t) : r !== void 0 ? typeof n == "string" ? $e(e, t).fill(r, n) : $e(e, t).fill(r) : $e(e, t);
}
m.alloc = function(e, t, r) {
  return Hu(null, e, t, r);
};
function xi(e, t) {
  if (Fa(t), e = $e(e, t < 0 ? 0 : mi(t) | 0), !m.TYPED_ARRAY_SUPPORT)
    for (var r = 0; r < t; ++r)
      e[r] = 0;
  return e;
}
m.allocUnsafe = function(e) {
  return xi(null, e);
};
m.allocUnsafeSlow = function(e) {
  return xi(null, e);
};
function $u(e, t, r) {
  if ((typeof r != "string" || r === "") && (r = "utf8"), !m.isEncoding(r))
    throw new TypeError('"encoding" must be a valid string encoding');
  var n = Na(t, r) | 0;
  e = $e(e, n);
  var i = e.write(t, r);
  return i !== n && (e = e.slice(0, i)), e;
}
function si(e, t) {
  var r = t.length < 0 ? 0 : mi(t.length) | 0;
  e = $e(e, r);
  for (var n = 0; n < r; n += 1)
    e[n] = t[n] & 255;
  return e;
}
function Wu(e, t, r, n) {
  if (t.byteLength, r < 0 || t.byteLength < r)
    throw new RangeError("'offset' is out of bounds");
  if (t.byteLength < r + (n || 0))
    throw new RangeError("'length' is out of bounds");
  return r === void 0 && n === void 0 ? t = new Uint8Array(t) : n === void 0 ? t = new Uint8Array(t, r) : t = new Uint8Array(t, r, n), m.TYPED_ARRAY_SUPPORT ? (e = t, e.__proto__ = m.prototype) : e = si(e, t), e;
}
function zu(e, t) {
  if (Ne(t)) {
    var r = mi(t.length) | 0;
    return e = $e(e, r), e.length === 0 || t.copy(e, 0, 0, r), e;
  }
  if (t) {
    if (typeof ArrayBuffer < "u" && t.buffer instanceof ArrayBuffer || "length" in t)
      return typeof t.length != "number" || hf(t.length) ? $e(e, 0) : si(e, t);
    if (t.type === "Buffer" && qa(t.data))
      return si(e, t.data);
  }
  throw new TypeError("First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.");
}
function mi(e) {
  if (e >= Kr())
    throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + Kr().toString(16) + " bytes");
  return e | 0;
}
function Gu(e) {
  return +e != e && (e = 0), m.alloc(+e);
}
m.isBuffer = Va;
function Ne(e) {
  return !!(e != null && e._isBuffer);
}
m.compare = function(t, r) {
  if (!Ne(t) || !Ne(r))
    throw new TypeError("Arguments must be Buffers");
  if (t === r)
    return 0;
  for (var n = t.length, i = r.length, a = 0, o = Math.min(n, i); a < o; ++a)
    if (t[a] !== r[a]) {
      n = t[a], i = r[a];
      break;
    }
  return n < i ? -1 : i < n ? 1 : 0;
};
m.isEncoding = function(t) {
  switch (String(t).toLowerCase()) {
    case "hex":
    case "utf8":
    case "utf-8":
    case "ascii":
    case "latin1":
    case "binary":
    case "base64":
    case "ucs2":
    case "ucs-2":
    case "utf16le":
    case "utf-16le":
      return !0;
    default:
      return !1;
  }
};
m.concat = function(t, r) {
  if (!qa(t))
    throw new TypeError('"list" argument must be an Array of Buffers');
  if (t.length === 0)
    return m.alloc(0);
  var n;
  if (r === void 0)
    for (r = 0, n = 0; n < t.length; ++n)
      r += t[n].length;
  var i = m.allocUnsafe(r), a = 0;
  for (n = 0; n < t.length; ++n) {
    var o = t[n];
    if (!Ne(o))
      throw new TypeError('"list" argument must be an Array of Buffers');
    o.copy(i, a), a += o.length;
  }
  return i;
};
function Na(e, t) {
  if (Ne(e))
    return e.length;
  if (typeof ArrayBuffer < "u" && typeof ArrayBuffer.isView == "function" && (ArrayBuffer.isView(e) || e instanceof ArrayBuffer))
    return e.byteLength;
  typeof e != "string" && (e = "" + e);
  var r = e.length;
  if (r === 0)
    return 0;
  for (var n = !1; ; )
    switch (t) {
      case "ascii":
      case "latin1":
      case "binary":
        return r;
      case "utf8":
      case "utf-8":
      case void 0:
        return Zr(e).length;
      case "ucs2":
      case "ucs-2":
      case "utf16le":
      case "utf-16le":
        return r * 2;
      case "hex":
        return r >>> 1;
      case "base64":
        return Ya(e).length;
      default:
        if (n)
          return Zr(e).length;
        t = ("" + t).toLowerCase(), n = !0;
    }
}
m.byteLength = Na;
function Yu(e, t, r) {
  var n = !1;
  if ((t === void 0 || t < 0) && (t = 0), t > this.length || ((r === void 0 || r > this.length) && (r = this.length), r <= 0) || (r >>>= 0, t >>>= 0, r <= t))
    return "";
  for (e || (e = "utf8"); ; )
    switch (e) {
      case "hex":
        return nf(this, t, r);
      case "utf8":
      case "utf-8":
        return $a(this, t, r);
      case "ascii":
        return tf(this, t, r);
      case "latin1":
      case "binary":
        return rf(this, t, r);
      case "base64":
        return Ju(this, t, r);
      case "ucs2":
      case "ucs-2":
      case "utf16le":
      case "utf-16le":
        return of(this, t, r);
      default:
        if (n)
          throw new TypeError("Unknown encoding: " + e);
        e = (e + "").toLowerCase(), n = !0;
    }
}
m.prototype._isBuffer = !0;
function rt(e, t, r) {
  var n = e[t];
  e[t] = e[r], e[r] = n;
}
m.prototype.swap16 = function() {
  var t = this.length;
  if (t % 2 !== 0)
    throw new RangeError("Buffer size must be a multiple of 16-bits");
  for (var r = 0; r < t; r += 2)
    rt(this, r, r + 1);
  return this;
};
m.prototype.swap32 = function() {
  var t = this.length;
  if (t % 4 !== 0)
    throw new RangeError("Buffer size must be a multiple of 32-bits");
  for (var r = 0; r < t; r += 4)
    rt(this, r, r + 3), rt(this, r + 1, r + 2);
  return this;
};
m.prototype.swap64 = function() {
  var t = this.length;
  if (t % 8 !== 0)
    throw new RangeError("Buffer size must be a multiple of 64-bits");
  for (var r = 0; r < t; r += 8)
    rt(this, r, r + 7), rt(this, r + 1, r + 6), rt(this, r + 2, r + 5), rt(this, r + 3, r + 4);
  return this;
};
m.prototype.toString = function() {
  var t = this.length | 0;
  return t === 0 ? "" : arguments.length === 0 ? $a(this, 0, t) : Yu.apply(this, arguments);
};
m.prototype.equals = function(t) {
  if (!Ne(t))
    throw new TypeError("Argument must be a Buffer");
  return this === t ? !0 : m.compare(this, t) === 0;
};
m.prototype.inspect = function() {
  var t = "", r = ja;
  return this.length > 0 && (t = this.toString("hex", 0, r).match(/.{2}/g).join(" "), this.length > r && (t += " ... ")), "<Buffer " + t + ">";
};
m.prototype.compare = function(t, r, n, i, a) {
  if (!Ne(t))
    throw new TypeError("Argument must be a Buffer");
  if (r === void 0 && (r = 0), n === void 0 && (n = t ? t.length : 0), i === void 0 && (i = 0), a === void 0 && (a = this.length), r < 0 || n > t.length || i < 0 || a > this.length)
    throw new RangeError("out of range index");
  if (i >= a && r >= n)
    return 0;
  if (i >= a)
    return -1;
  if (r >= n)
    return 1;
  if (r >>>= 0, n >>>= 0, i >>>= 0, a >>>= 0, this === t)
    return 0;
  for (var o = a - i, u = n - r, s = Math.min(o, u), f = this.slice(i, a), h = t.slice(r, n), l = 0; l < s; ++l)
    if (f[l] !== h[l]) {
      o = f[l], u = h[l];
      break;
    }
  return o < u ? -1 : u < o ? 1 : 0;
};
function Ua(e, t, r, n, i) {
  if (e.length === 0)
    return -1;
  if (typeof r == "string" ? (n = r, r = 0) : r > 2147483647 ? r = 2147483647 : r < -2147483648 && (r = -2147483648), r = +r, isNaN(r) && (r = i ? 0 : e.length - 1), r < 0 && (r = e.length + r), r >= e.length) {
    if (i)
      return -1;
    r = e.length - 1;
  } else if (r < 0)
    if (i)
      r = 0;
    else
      return -1;
  if (typeof t == "string" && (t = m.from(t, n)), Ne(t))
    return t.length === 0 ? -1 : Qi(e, t, r, n, i);
  if (typeof t == "number")
    return t = t & 255, m.TYPED_ARRAY_SUPPORT && typeof Uint8Array.prototype.indexOf == "function" ? i ? Uint8Array.prototype.indexOf.call(e, t, r) : Uint8Array.prototype.lastIndexOf.call(e, t, r) : Qi(e, [t], r, n, i);
  throw new TypeError("val must be string, number or Buffer");
}
function Qi(e, t, r, n, i) {
  var a = 1, o = e.length, u = t.length;
  if (n !== void 0 && (n = String(n).toLowerCase(), n === "ucs2" || n === "ucs-2" || n === "utf16le" || n === "utf-16le")) {
    if (e.length < 2 || t.length < 2)
      return -1;
    a = 2, o /= 2, u /= 2, r /= 2;
  }
  function s(d, p) {
    return a === 1 ? d[p] : d.readUInt16BE(p * a);
  }
  var f;
  if (i) {
    var h = -1;
    for (f = r; f < o; f++)
      if (s(e, f) === s(t, h === -1 ? 0 : f - h)) {
        if (h === -1 && (h = f), f - h + 1 === u)
          return h * a;
      } else
        h !== -1 && (f -= f - h), h = -1;
  } else
    for (r + u > o && (r = o - u), f = r; f >= 0; f--) {
      for (var l = !0, c = 0; c < u; c++)
        if (s(e, f + c) !== s(t, c)) {
          l = !1;
          break;
        }
      if (l)
        return f;
    }
  return -1;
}
m.prototype.includes = function(t, r, n) {
  return this.indexOf(t, r, n) !== -1;
};
m.prototype.indexOf = function(t, r, n) {
  return Ua(this, t, r, n, !0);
};
m.prototype.lastIndexOf = function(t, r, n) {
  return Ua(this, t, r, n, !1);
};
function Vu(e, t, r, n) {
  r = Number(r) || 0;
  var i = e.length - r;
  n ? (n = Number(n), n > i && (n = i)) : n = i;
  var a = t.length;
  if (a % 2 !== 0)
    throw new TypeError("Invalid hex string");
  n > a / 2 && (n = a / 2);
  for (var o = 0; o < n; ++o) {
    var u = parseInt(t.substr(o * 2, 2), 16);
    if (isNaN(u))
      return o;
    e[r + o] = u;
  }
  return o;
}
function Ku(e, t, r, n) {
  return sn(Zr(t, e.length - r), e, r, n);
}
function Ha(e, t, r, n) {
  return sn(lf(t), e, r, n);
}
function Zu(e, t, r, n) {
  return Ha(e, t, r, n);
}
function Xu(e, t, r, n) {
  return sn(Ya(t), e, r, n);
}
function Qu(e, t, r, n) {
  return sn(cf(t, e.length - r), e, r, n);
}
m.prototype.write = function(t, r, n, i) {
  if (r === void 0)
    i = "utf8", n = this.length, r = 0;
  else if (n === void 0 && typeof r == "string")
    i = r, n = this.length, r = 0;
  else if (isFinite(r))
    r = r | 0, isFinite(n) ? (n = n | 0, i === void 0 && (i = "utf8")) : (i = n, n = void 0);
  else
    throw new Error(
      "Buffer.write(string, encoding, offset[, length]) is no longer supported"
    );
  var a = this.length - r;
  if ((n === void 0 || n > a) && (n = a), t.length > 0 && (n < 0 || r < 0) || r > this.length)
    throw new RangeError("Attempt to write outside buffer bounds");
  i || (i = "utf8");
  for (var o = !1; ; )
    switch (i) {
      case "hex":
        return Vu(this, t, r, n);
      case "utf8":
      case "utf-8":
        return Ku(this, t, r, n);
      case "ascii":
        return Ha(this, t, r, n);
      case "latin1":
      case "binary":
        return Zu(this, t, r, n);
      case "base64":
        return Xu(this, t, r, n);
      case "ucs2":
      case "ucs-2":
      case "utf16le":
      case "utf-16le":
        return Qu(this, t, r, n);
      default:
        if (o)
          throw new TypeError("Unknown encoding: " + i);
        i = ("" + i).toLowerCase(), o = !0;
    }
};
m.prototype.toJSON = function() {
  return {
    type: "Buffer",
    data: Array.prototype.slice.call(this._arr || this, 0)
  };
};
function Ju(e, t, r) {
  return t === 0 && r === e.length ? Xi(e) : Xi(e.slice(t, r));
}
function $a(e, t, r) {
  r = Math.min(e.length, r);
  for (var n = [], i = t; i < r; ) {
    var a = e[i], o = null, u = a > 239 ? 4 : a > 223 ? 3 : a > 191 ? 2 : 1;
    if (i + u <= r) {
      var s, f, h, l;
      switch (u) {
        case 1:
          a < 128 && (o = a);
          break;
        case 2:
          s = e[i + 1], (s & 192) === 128 && (l = (a & 31) << 6 | s & 63, l > 127 && (o = l));
          break;
        case 3:
          s = e[i + 1], f = e[i + 2], (s & 192) === 128 && (f & 192) === 128 && (l = (a & 15) << 12 | (s & 63) << 6 | f & 63, l > 2047 && (l < 55296 || l > 57343) && (o = l));
          break;
        case 4:
          s = e[i + 1], f = e[i + 2], h = e[i + 3], (s & 192) === 128 && (f & 192) === 128 && (h & 192) === 128 && (l = (a & 15) << 18 | (s & 63) << 12 | (f & 63) << 6 | h & 63, l > 65535 && l < 1114112 && (o = l));
      }
    }
    o === null ? (o = 65533, u = 1) : o > 65535 && (o -= 65536, n.push(o >>> 10 & 1023 | 55296), o = 56320 | o & 1023), n.push(o), i += u;
  }
  return ef(n);
}
var Ji = 4096;
function ef(e) {
  var t = e.length;
  if (t <= Ji)
    return String.fromCharCode.apply(String, e);
  for (var r = "", n = 0; n < t; )
    r += String.fromCharCode.apply(
      String,
      e.slice(n, n += Ji)
    );
  return r;
}
function tf(e, t, r) {
  var n = "";
  r = Math.min(e.length, r);
  for (var i = t; i < r; ++i)
    n += String.fromCharCode(e[i] & 127);
  return n;
}
function rf(e, t, r) {
  var n = "";
  r = Math.min(e.length, r);
  for (var i = t; i < r; ++i)
    n += String.fromCharCode(e[i]);
  return n;
}
function nf(e, t, r) {
  var n = e.length;
  (!t || t < 0) && (t = 0), (!r || r < 0 || r > n) && (r = n);
  for (var i = "", a = t; a < r; ++a)
    i += ff(e[a]);
  return i;
}
function of(e, t, r) {
  for (var n = e.slice(t, r), i = "", a = 0; a < n.length; a += 2)
    i += String.fromCharCode(n[a] + n[a + 1] * 256);
  return i;
}
m.prototype.slice = function(t, r) {
  var n = this.length;
  t = ~~t, r = r === void 0 ? n : ~~r, t < 0 ? (t += n, t < 0 && (t = 0)) : t > n && (t = n), r < 0 ? (r += n, r < 0 && (r = 0)) : r > n && (r = n), r < t && (r = t);
  var i;
  if (m.TYPED_ARRAY_SUPPORT)
    i = this.subarray(t, r), i.__proto__ = m.prototype;
  else {
    var a = r - t;
    i = new m(a, void 0);
    for (var o = 0; o < a; ++o)
      i[o] = this[o + t];
  }
  return i;
};
function ae(e, t, r) {
  if (e % 1 !== 0 || e < 0)
    throw new RangeError("offset is not uint");
  if (e + t > r)
    throw new RangeError("Trying to access beyond buffer length");
}
m.prototype.readUIntLE = function(t, r, n) {
  t = t | 0, r = r | 0, n || ae(t, r, this.length);
  for (var i = this[t], a = 1, o = 0; ++o < r && (a *= 256); )
    i += this[t + o] * a;
  return i;
};
m.prototype.readUIntBE = function(t, r, n) {
  t = t | 0, r = r | 0, n || ae(t, r, this.length);
  for (var i = this[t + --r], a = 1; r > 0 && (a *= 256); )
    i += this[t + --r] * a;
  return i;
};
m.prototype.readUInt8 = function(t, r) {
  return r || ae(t, 1, this.length), this[t];
};
m.prototype.readUInt16LE = function(t, r) {
  return r || ae(t, 2, this.length), this[t] | this[t + 1] << 8;
};
m.prototype.readUInt16BE = function(t, r) {
  return r || ae(t, 2, this.length), this[t] << 8 | this[t + 1];
};
m.prototype.readUInt32LE = function(t, r) {
  return r || ae(t, 4, this.length), (this[t] | this[t + 1] << 8 | this[t + 2] << 16) + this[t + 3] * 16777216;
};
m.prototype.readUInt32BE = function(t, r) {
  return r || ae(t, 4, this.length), this[t] * 16777216 + (this[t + 1] << 16 | this[t + 2] << 8 | this[t + 3]);
};
m.prototype.readIntLE = function(t, r, n) {
  t = t | 0, r = r | 0, n || ae(t, r, this.length);
  for (var i = this[t], a = 1, o = 0; ++o < r && (a *= 256); )
    i += this[t + o] * a;
  return a *= 128, i >= a && (i -= Math.pow(2, 8 * r)), i;
};
m.prototype.readIntBE = function(t, r, n) {
  t = t | 0, r = r | 0, n || ae(t, r, this.length);
  for (var i = r, a = 1, o = this[t + --i]; i > 0 && (a *= 256); )
    o += this[t + --i] * a;
  return a *= 128, o >= a && (o -= Math.pow(2, 8 * r)), o;
};
m.prototype.readInt8 = function(t, r) {
  return r || ae(t, 1, this.length), this[t] & 128 ? (255 - this[t] + 1) * -1 : this[t];
};
m.prototype.readInt16LE = function(t, r) {
  r || ae(t, 2, this.length);
  var n = this[t] | this[t + 1] << 8;
  return n & 32768 ? n | 4294901760 : n;
};
m.prototype.readInt16BE = function(t, r) {
  r || ae(t, 2, this.length);
  var n = this[t + 1] | this[t] << 8;
  return n & 32768 ? n | 4294901760 : n;
};
m.prototype.readInt32LE = function(t, r) {
  return r || ae(t, 4, this.length), this[t] | this[t + 1] << 8 | this[t + 2] << 16 | this[t + 3] << 24;
};
m.prototype.readInt32BE = function(t, r) {
  return r || ae(t, 4, this.length), this[t] << 24 | this[t + 1] << 16 | this[t + 2] << 8 | this[t + 3];
};
m.prototype.readFloatLE = function(t, r) {
  return r || ae(t, 4, this.length), nn(this, t, !0, 23, 4);
};
m.prototype.readFloatBE = function(t, r) {
  return r || ae(t, 4, this.length), nn(this, t, !1, 23, 4);
};
m.prototype.readDoubleLE = function(t, r) {
  return r || ae(t, 8, this.length), nn(this, t, !0, 52, 8);
};
m.prototype.readDoubleBE = function(t, r) {
  return r || ae(t, 8, this.length), nn(this, t, !1, 52, 8);
};
function ye(e, t, r, n, i, a) {
  if (!Ne(e))
    throw new TypeError('"buffer" argument must be a Buffer instance');
  if (t > i || t < a)
    throw new RangeError('"value" argument is out of bounds');
  if (r + n > e.length)
    throw new RangeError("Index out of range");
}
m.prototype.writeUIntLE = function(t, r, n, i) {
  if (t = +t, r = r | 0, n = n | 0, !i) {
    var a = Math.pow(2, 8 * n) - 1;
    ye(this, t, r, n, a, 0);
  }
  var o = 1, u = 0;
  for (this[r] = t & 255; ++u < n && (o *= 256); )
    this[r + u] = t / o & 255;
  return r + n;
};
m.prototype.writeUIntBE = function(t, r, n, i) {
  if (t = +t, r = r | 0, n = n | 0, !i) {
    var a = Math.pow(2, 8 * n) - 1;
    ye(this, t, r, n, a, 0);
  }
  var o = n - 1, u = 1;
  for (this[r + o] = t & 255; --o >= 0 && (u *= 256); )
    this[r + o] = t / u & 255;
  return r + n;
};
m.prototype.writeUInt8 = function(t, r, n) {
  return t = +t, r = r | 0, n || ye(this, t, r, 1, 255, 0), m.TYPED_ARRAY_SUPPORT || (t = Math.floor(t)), this[r] = t & 255, r + 1;
};
function on(e, t, r, n) {
  t < 0 && (t = 65535 + t + 1);
  for (var i = 0, a = Math.min(e.length - r, 2); i < a; ++i)
    e[r + i] = (t & 255 << 8 * (n ? i : 1 - i)) >>> (n ? i : 1 - i) * 8;
}
m.prototype.writeUInt16LE = function(t, r, n) {
  return t = +t, r = r | 0, n || ye(this, t, r, 2, 65535, 0), m.TYPED_ARRAY_SUPPORT ? (this[r] = t & 255, this[r + 1] = t >>> 8) : on(this, t, r, !0), r + 2;
};
m.prototype.writeUInt16BE = function(t, r, n) {
  return t = +t, r = r | 0, n || ye(this, t, r, 2, 65535, 0), m.TYPED_ARRAY_SUPPORT ? (this[r] = t >>> 8, this[r + 1] = t & 255) : on(this, t, r, !1), r + 2;
};
function an(e, t, r, n) {
  t < 0 && (t = 4294967295 + t + 1);
  for (var i = 0, a = Math.min(e.length - r, 4); i < a; ++i)
    e[r + i] = t >>> (n ? i : 3 - i) * 8 & 255;
}
m.prototype.writeUInt32LE = function(t, r, n) {
  return t = +t, r = r | 0, n || ye(this, t, r, 4, 4294967295, 0), m.TYPED_ARRAY_SUPPORT ? (this[r + 3] = t >>> 24, this[r + 2] = t >>> 16, this[r + 1] = t >>> 8, this[r] = t & 255) : an(this, t, r, !0), r + 4;
};
m.prototype.writeUInt32BE = function(t, r, n) {
  return t = +t, r = r | 0, n || ye(this, t, r, 4, 4294967295, 0), m.TYPED_ARRAY_SUPPORT ? (this[r] = t >>> 24, this[r + 1] = t >>> 16, this[r + 2] = t >>> 8, this[r + 3] = t & 255) : an(this, t, r, !1), r + 4;
};
m.prototype.writeIntLE = function(t, r, n, i) {
  if (t = +t, r = r | 0, !i) {
    var a = Math.pow(2, 8 * n - 1);
    ye(this, t, r, n, a - 1, -a);
  }
  var o = 0, u = 1, s = 0;
  for (this[r] = t & 255; ++o < n && (u *= 256); )
    t < 0 && s === 0 && this[r + o - 1] !== 0 && (s = 1), this[r + o] = (t / u >> 0) - s & 255;
  return r + n;
};
m.prototype.writeIntBE = function(t, r, n, i) {
  if (t = +t, r = r | 0, !i) {
    var a = Math.pow(2, 8 * n - 1);
    ye(this, t, r, n, a - 1, -a);
  }
  var o = n - 1, u = 1, s = 0;
  for (this[r + o] = t & 255; --o >= 0 && (u *= 256); )
    t < 0 && s === 0 && this[r + o + 1] !== 0 && (s = 1), this[r + o] = (t / u >> 0) - s & 255;
  return r + n;
};
m.prototype.writeInt8 = function(t, r, n) {
  return t = +t, r = r | 0, n || ye(this, t, r, 1, 127, -128), m.TYPED_ARRAY_SUPPORT || (t = Math.floor(t)), t < 0 && (t = 255 + t + 1), this[r] = t & 255, r + 1;
};
m.prototype.writeInt16LE = function(t, r, n) {
  return t = +t, r = r | 0, n || ye(this, t, r, 2, 32767, -32768), m.TYPED_ARRAY_SUPPORT ? (this[r] = t & 255, this[r + 1] = t >>> 8) : on(this, t, r, !0), r + 2;
};
m.prototype.writeInt16BE = function(t, r, n) {
  return t = +t, r = r | 0, n || ye(this, t, r, 2, 32767, -32768), m.TYPED_ARRAY_SUPPORT ? (this[r] = t >>> 8, this[r + 1] = t & 255) : on(this, t, r, !1), r + 2;
};
m.prototype.writeInt32LE = function(t, r, n) {
  return t = +t, r = r | 0, n || ye(this, t, r, 4, 2147483647, -2147483648), m.TYPED_ARRAY_SUPPORT ? (this[r] = t & 255, this[r + 1] = t >>> 8, this[r + 2] = t >>> 16, this[r + 3] = t >>> 24) : an(this, t, r, !0), r + 4;
};
m.prototype.writeInt32BE = function(t, r, n) {
  return t = +t, r = r | 0, n || ye(this, t, r, 4, 2147483647, -2147483648), t < 0 && (t = 4294967295 + t + 1), m.TYPED_ARRAY_SUPPORT ? (this[r] = t >>> 24, this[r + 1] = t >>> 16, this[r + 2] = t >>> 8, this[r + 3] = t & 255) : an(this, t, r, !1), r + 4;
};
function Wa(e, t, r, n, i, a) {
  if (r + n > e.length)
    throw new RangeError("Index out of range");
  if (r < 0)
    throw new RangeError("Index out of range");
}
function za(e, t, r, n, i) {
  return i || Wa(e, t, r, 4), Pa(e, t, r, n, 23, 4), r + 4;
}
m.prototype.writeFloatLE = function(t, r, n) {
  return za(this, t, r, !0, n);
};
m.prototype.writeFloatBE = function(t, r, n) {
  return za(this, t, r, !1, n);
};
function Ga(e, t, r, n, i) {
  return i || Wa(e, t, r, 8), Pa(e, t, r, n, 52, 8), r + 8;
}
m.prototype.writeDoubleLE = function(t, r, n) {
  return Ga(this, t, r, !0, n);
};
m.prototype.writeDoubleBE = function(t, r, n) {
  return Ga(this, t, r, !1, n);
};
m.prototype.copy = function(t, r, n, i) {
  if (n || (n = 0), !i && i !== 0 && (i = this.length), r >= t.length && (r = t.length), r || (r = 0), i > 0 && i < n && (i = n), i === n || t.length === 0 || this.length === 0)
    return 0;
  if (r < 0)
    throw new RangeError("targetStart out of bounds");
  if (n < 0 || n >= this.length)
    throw new RangeError("sourceStart out of bounds");
  if (i < 0)
    throw new RangeError("sourceEnd out of bounds");
  i > this.length && (i = this.length), t.length - r < i - n && (i = t.length - r + n);
  var a = i - n, o;
  if (this === t && n < r && r < i)
    for (o = a - 1; o >= 0; --o)
      t[o + r] = this[o + n];
  else if (a < 1e3 || !m.TYPED_ARRAY_SUPPORT)
    for (o = 0; o < a; ++o)
      t[o + r] = this[o + n];
  else
    Uint8Array.prototype.set.call(
      t,
      this.subarray(n, n + a),
      r
    );
  return a;
};
m.prototype.fill = function(t, r, n, i) {
  if (typeof t == "string") {
    if (typeof r == "string" ? (i = r, r = 0, n = this.length) : typeof n == "string" && (i = n, n = this.length), t.length === 1) {
      var a = t.charCodeAt(0);
      a < 256 && (t = a);
    }
    if (i !== void 0 && typeof i != "string")
      throw new TypeError("encoding must be a string");
    if (typeof i == "string" && !m.isEncoding(i))
      throw new TypeError("Unknown encoding: " + i);
  } else
    typeof t == "number" && (t = t & 255);
  if (r < 0 || this.length < r || this.length < n)
    throw new RangeError("Out of range index");
  if (n <= r)
    return this;
  r = r >>> 0, n = n === void 0 ? this.length : n >>> 0, t || (t = 0);
  var o;
  if (typeof t == "number")
    for (o = r; o < n; ++o)
      this[o] = t;
  else {
    var u = Ne(t) ? t : Zr(new m(t, i).toString()), s = u.length;
    for (o = 0; o < n - r; ++o)
      this[o + r] = u[o % s];
  }
  return this;
};
var af = /[^+\/0-9A-Za-z-_]/g;
function sf(e) {
  if (e = uf(e).replace(af, ""), e.length < 2)
    return "";
  for (; e.length % 4 !== 0; )
    e = e + "=";
  return e;
}
function uf(e) {
  return e.trim ? e.trim() : e.replace(/^\s+|\s+$/g, "");
}
function ff(e) {
  return e < 16 ? "0" + e.toString(16) : e.toString(16);
}
function Zr(e, t) {
  t = t || 1 / 0;
  for (var r, n = e.length, i = null, a = [], o = 0; o < n; ++o) {
    if (r = e.charCodeAt(o), r > 55295 && r < 57344) {
      if (!i) {
        if (r > 56319) {
          (t -= 3) > -1 && a.push(239, 191, 189);
          continue;
        } else if (o + 1 === n) {
          (t -= 3) > -1 && a.push(239, 191, 189);
          continue;
        }
        i = r;
        continue;
      }
      if (r < 56320) {
        (t -= 3) > -1 && a.push(239, 191, 189), i = r;
        continue;
      }
      r = (i - 55296 << 10 | r - 56320) + 65536;
    } else
      i && (t -= 3) > -1 && a.push(239, 191, 189);
    if (i = null, r < 128) {
      if ((t -= 1) < 0)
        break;
      a.push(r);
    } else if (r < 2048) {
      if ((t -= 2) < 0)
        break;
      a.push(
        r >> 6 | 192,
        r & 63 | 128
      );
    } else if (r < 65536) {
      if ((t -= 3) < 0)
        break;
      a.push(
        r >> 12 | 224,
        r >> 6 & 63 | 128,
        r & 63 | 128
      );
    } else if (r < 1114112) {
      if ((t -= 4) < 0)
        break;
      a.push(
        r >> 18 | 240,
        r >> 12 & 63 | 128,
        r >> 6 & 63 | 128,
        r & 63 | 128
      );
    } else
      throw new Error("Invalid code point");
  }
  return a;
}
function lf(e) {
  for (var t = [], r = 0; r < e.length; ++r)
    t.push(e.charCodeAt(r) & 255);
  return t;
}
function cf(e, t) {
  for (var r, n, i, a = [], o = 0; o < e.length && !((t -= 2) < 0); ++o)
    r = e.charCodeAt(o), n = r >> 8, i = r % 256, a.push(i), a.push(n);
  return a;
}
function Ya(e) {
  return ju(sf(e));
}
function sn(e, t, r, n) {
  for (var i = 0; i < n && !(i + r >= t.length || i >= e.length); ++i)
    t[i + r] = e[i];
  return i;
}
function hf(e) {
  return e !== e;
}
function Va(e) {
  return e != null && (!!e._isBuffer || Ka(e) || df(e));
}
function Ka(e) {
  return !!e.constructor && typeof e.constructor.isBuffer == "function" && e.constructor.isBuffer(e);
}
function df(e) {
  return typeof e.readFloatLE == "function" && typeof e.slice == "function" && Ka(e.slice(0, 0));
}
const pf = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Buffer: m,
  INSPECT_MAX_BYTES: ja,
  SlowBuffer: Gu,
  isBuffer: Va,
  kMaxLength: Uu
}, Symbol.toStringTag, { value: "Module" }));
function _f() {
  return m.from(Ce.randomPrivateKey()).toString("hex");
}
function vf(e) {
  return m.from(bi.getPublicKey(e)).toString("hex");
}
var S = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Ei(e) {
  var t = e.default;
  if (typeof t == "function") {
    var r = function() {
      return t.apply(this, arguments);
    };
    r.prototype = t.prototype;
  } else
    r = {};
  return Object.defineProperty(r, "__esModule", { value: !0 }), Object.keys(e).forEach(function(n) {
    var i = Object.getOwnPropertyDescriptor(e, n);
    Object.defineProperty(r, n, i.get ? i : {
      enumerable: !0,
      get: function() {
        return e[n];
      }
    });
  }), r;
}
var wr = {};
Object.defineProperty(wr, "__esModule", { value: !0 });
wr.is_node = void 0;
var Tn = null;
function yf() {
  return Tn === null && (Tn = typeof S == "object" && typeof S.process == "object" && typeof S.process.versions == "object" && typeof S.process.versions.node < "u"), Tn;
}
wr.is_node = yf;
var Cn = {}, Mn, eo;
function gf() {
  if (eo)
    return Mn;
  eo = 1;
  var e = function() {
    if (typeof self == "object" && self)
      return self;
    if (typeof window == "object" && window)
      return window;
    throw new Error("Unable to resolve global `this`");
  };
  return Mn = function() {
    if (this)
      return this;
    if (typeof globalThis == "object" && globalThis)
      return globalThis;
    try {
      Object.defineProperty(Object.prototype, "__global__", {
        get: function() {
          return this;
        },
        configurable: !0
      });
    } catch {
      return e();
    }
    try {
      return __global__ || e();
    } finally {
      delete Object.prototype.__global__;
    }
  }(), Mn;
}
const bf = "websocket", wf = "Websocket Client & Server Library implementing the WebSocket protocol as specified in RFC 6455.", xf = [
  "websocket",
  "websockets",
  "socket",
  "networking",
  "comet",
  "push",
  "RFC-6455",
  "realtime",
  "server",
  "client"
], mf = "Brian McKelvey <theturtle32@gmail.com> (https://github.com/theturtle32)", Ef = [
  "I\xF1aki Baz Castillo <ibc@aliax.net> (http://dev.sipdoc.net)"
], Sf = "1.0.34", Rf = {
  type: "git",
  url: "https://github.com/theturtle32/WebSocket-Node.git"
}, Of = "https://github.com/theturtle32/WebSocket-Node", Af = {
  node: ">=4.0.0"
}, If = {
  bufferutil: "^4.0.1",
  debug: "^2.2.0",
  "es5-ext": "^0.10.50",
  "typedarray-to-buffer": "^3.1.5",
  "utf-8-validate": "^5.0.2",
  yaeti: "^0.0.6"
}, Tf = {
  "buffer-equal": "^1.0.0",
  gulp: "^4.0.2",
  "gulp-jshint": "^2.0.4",
  "jshint-stylish": "^2.2.1",
  jshint: "^2.0.0",
  tape: "^4.9.1"
}, Cf = {
  verbose: !1
}, Mf = {
  test: "tape test/unit/*.js",
  gulp: "gulp"
}, Bf = "index", kf = {
  lib: "./lib"
}, Lf = "lib/browser.js", Pf = "Apache-2.0", qf = {
  name: bf,
  description: wf,
  keywords: xf,
  author: mf,
  contributors: Ef,
  version: Sf,
  repository: Rf,
  homepage: Of,
  engines: Af,
  dependencies: If,
  devDependencies: Tf,
  config: Cf,
  scripts: Mf,
  main: Bf,
  directories: kf,
  browser: Lf,
  license: Pf
};
var Bn, to;
function jf() {
  return to || (to = 1, Bn = qf.version), Bn;
}
var kn, ro;
function Df() {
  if (ro)
    return kn;
  ro = 1;
  var e;
  if (typeof globalThis == "object")
    e = globalThis;
  else
    try {
      e = gf();
    } catch {
    } finally {
      if (!e && typeof window < "u" && (e = window), !e)
        throw new Error("Could not determine global this");
    }
  var t = e.WebSocket || e.MozWebSocket, r = jf();
  function n(i, a) {
    var o;
    return a ? o = new t(i, a) : o = new t(i), o;
  }
  return t && ["CONNECTING", "OPEN", "CLOSING", "CLOSED"].forEach(function(i) {
    Object.defineProperty(n, i, {
      get: function() {
        return t[i];
      }
    });
  }), kn = {
    w3cwebsocket: t ? n : null,
    version: r
  }, kn;
}
var kr = {}, Ln = {}, Lt = {}, Pt = {}, qt = {}, jt = {}, no;
function Ff() {
  if (no)
    return jt;
  no = 1, Object.defineProperty(jt, "__esModule", { value: !0 }), jt.ForOfAdaptor = void 0;
  var e = function() {
    function t(r, n) {
      this.it_ = r, this.last_ = n;
    }
    return t.prototype.next = function() {
      if (this.it_.equals(this.last_))
        return {
          done: !0,
          value: void 0
        };
      var r = this.it_;
      return this.it_ = this.it_.next(), {
        done: !1,
        value: r.value
      };
    }, t.prototype[Symbol.iterator] = function() {
      return this;
    }, t;
  }();
  return jt.ForOfAdaptor = e, jt;
}
var io;
function Si() {
  if (io)
    return qt;
  io = 1;
  var e = S && S.__values || function(n) {
    var i = typeof Symbol == "function" && Symbol.iterator, a = i && n[i], o = 0;
    if (a)
      return a.call(n);
    if (n && typeof n.length == "number")
      return {
        next: function() {
          return n && o >= n.length && (n = void 0), { value: n && n[o++], done: !n };
        }
      };
    throw new TypeError(i ? "Object is not iterable." : "Symbol.iterator is not defined.");
  };
  Object.defineProperty(qt, "__esModule", { value: !0 }), qt.Container = void 0;
  var t = Ff(), r = function() {
    function n() {
    }
    return n.prototype.empty = function() {
      return this.size() === 0;
    }, n.prototype.rbegin = function() {
      return this.end().reverse();
    }, n.prototype.rend = function() {
      return this.begin().reverse();
    }, n.prototype[Symbol.iterator] = function() {
      return new t.ForOfAdaptor(this.begin(), this.end());
    }, n.prototype.toJSON = function() {
      var i, a, o = [];
      try {
        for (var u = e(this), s = u.next(); !s.done; s = u.next()) {
          var f = s.value;
          o.push(f);
        }
      } catch (h) {
        i = { error: h };
      } finally {
        try {
          s && !s.done && (a = u.return) && a.call(u);
        } finally {
          if (i)
            throw i.error;
        }
      }
      return o;
    }, n;
  }();
  return qt.Container = r, qt;
}
var Dt = {}, oo;
function Ri() {
  if (oo)
    return Dt;
  oo = 1;
  var e = S && S.__read || function(r, n) {
    var i = typeof Symbol == "function" && r[Symbol.iterator];
    if (!i)
      return r;
    var a = i.call(r), o, u = [], s;
    try {
      for (; (n === void 0 || n-- > 0) && !(o = a.next()).done; )
        u.push(o.value);
    } catch (f) {
      s = { error: f };
    } finally {
      try {
        o && !o.done && (i = a.return) && i.call(a);
      } finally {
        if (s)
          throw s.error;
      }
    }
    return u;
  };
  Object.defineProperty(Dt, "__esModule", { value: !0 }), Dt.NativeArrayIterator = void 0;
  var t = function() {
    function r(n, i) {
      this.data_ = n, this.index_ = i;
    }
    return r.prototype.index = function() {
      return this.index_;
    }, Object.defineProperty(r.prototype, "value", {
      get: function() {
        return this.data_[this.index_];
      },
      enumerable: !1,
      configurable: !0
    }), r.prototype.prev = function() {
      return --this.index_, this;
    }, r.prototype.next = function() {
      return ++this.index_, this;
    }, r.prototype.advance = function(n) {
      return this.index_ += n, this;
    }, r.prototype.equals = function(n) {
      return this.data_ === n.data_ && this.index_ === n.index_;
    }, r.prototype.swap = function(n) {
      var i, a;
      i = e([n.data_, this.data_], 2), this.data_ = i[0], n.data_ = i[1], a = e([n.index_, this.index_], 2), this.index_ = a[0], n.index_ = a[1];
    }, r;
  }();
  return Dt.NativeArrayIterator = t, Dt;
}
var ao;
function Nf() {
  if (ao)
    return Pt;
  ao = 1;
  var e = S && S.__extends || function() {
    var i = function(a, o) {
      return i = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(u, s) {
        u.__proto__ = s;
      } || function(u, s) {
        for (var f in s)
          Object.prototype.hasOwnProperty.call(s, f) && (u[f] = s[f]);
      }, i(a, o);
    };
    return function(a, o) {
      if (typeof o != "function" && o !== null)
        throw new TypeError("Class extends value " + String(o) + " is not a constructor or null");
      i(a, o);
      function u() {
        this.constructor = a;
      }
      a.prototype = o === null ? Object.create(o) : (u.prototype = o.prototype, new u());
    };
  }();
  Object.defineProperty(Pt, "__esModule", { value: !0 }), Pt.SetContainer = void 0;
  var t = Si(), r = Ri(), n = function(i) {
    e(a, i);
    function a(o) {
      var u = i.call(this) || this;
      return u.data_ = o(u), u;
    }
    return a.prototype.assign = function(o, u) {
      this.clear(), this.insert(o, u);
    }, a.prototype.clear = function() {
      this.data_.clear();
    }, a.prototype.begin = function() {
      return this.data_.begin();
    }, a.prototype.end = function() {
      return this.data_.end();
    }, a.prototype.has = function(o) {
      return !this.find(o).equals(this.end());
    }, a.prototype.size = function() {
      return this.data_.size();
    }, a.prototype.push = function() {
      for (var o = [], u = 0; u < arguments.length; u++)
        o[u] = arguments[u];
      if (o.length === 0)
        return this.size();
      var s = new r.NativeArrayIterator(o, 0), f = new r.NativeArrayIterator(o, o.length);
      return this._Insert_by_range(s, f), this.size();
    }, a.prototype.insert = function() {
      for (var o = [], u = 0; u < arguments.length; u++)
        o[u] = arguments[u];
      return o.length === 1 ? this._Insert_by_key(o[0]) : o[0].next instanceof Function && o[1].next instanceof Function ? this._Insert_by_range(o[0], o[1]) : this._Insert_by_hint(o[0], o[1]);
    }, a.prototype.erase = function() {
      for (var o = [], u = 0; u < arguments.length; u++)
        o[u] = arguments[u];
      return o.length === 1 && !(o[0] instanceof this.end().constructor && o[0].source() === this) ? this._Erase_by_val(o[0]) : o.length === 1 ? this._Erase_by_range(o[0]) : this._Erase_by_range(o[0], o[1]);
    }, a.prototype._Erase_by_range = function(o, u) {
      u === void 0 && (u = o.next());
      var s = this.data_.erase(o, u);
      return this._Handle_erase(o, u), s;
    }, a;
  }(t.Container);
  return Pt.SetContainer = n, Pt;
}
var Pn = {}, Ft = {}, Nt = {}, Ut = {}, so;
function Uf() {
  if (so)
    return Ut;
  so = 1;
  var e = S && S.__extends || function() {
    var r = function(n, i) {
      return r = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(a, o) {
        a.__proto__ = o;
      } || function(a, o) {
        for (var u in o)
          Object.prototype.hasOwnProperty.call(o, u) && (a[u] = o[u]);
      }, r(n, i);
    };
    return function(n, i) {
      if (typeof i != "function" && i !== null)
        throw new TypeError("Class extends value " + String(i) + " is not a constructor or null");
      r(n, i);
      function a() {
        this.constructor = n;
      }
      n.prototype = i === null ? Object.create(i) : (a.prototype = i.prototype, new a());
    };
  }();
  Object.defineProperty(Ut, "__esModule", { value: !0 }), Ut.Exception = void 0;
  var t = function(r) {
    e(n, r);
    function n(i) {
      var a = this.constructor, o = r.call(this, i) || this, u = a.prototype;
      return Object.setPrototypeOf ? Object.setPrototypeOf(o, u) : o.__proto__ = u, o;
    }
    return Object.defineProperty(n.prototype, "name", {
      get: function() {
        return this.constructor.name;
      },
      enumerable: !1,
      configurable: !0
    }), n.prototype.what = function() {
      return this.message;
    }, n.prototype.toJSON = function() {
      return {
        name: this.name,
        message: this.message,
        stack: this.stack
      };
    }, n;
  }(Error);
  return Ut.Exception = t, Ut;
}
var uo;
function Za() {
  if (uo)
    return Nt;
  uo = 1;
  var e = S && S.__extends || function() {
    var n = function(i, a) {
      return n = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(o, u) {
        o.__proto__ = u;
      } || function(o, u) {
        for (var s in u)
          Object.prototype.hasOwnProperty.call(u, s) && (o[s] = u[s]);
      }, n(i, a);
    };
    return function(i, a) {
      if (typeof a != "function" && a !== null)
        throw new TypeError("Class extends value " + String(a) + " is not a constructor or null");
      n(i, a);
      function o() {
        this.constructor = i;
      }
      i.prototype = a === null ? Object.create(a) : (o.prototype = a.prototype, new o());
    };
  }();
  Object.defineProperty(Nt, "__esModule", { value: !0 }), Nt.LogicError = void 0;
  var t = Uf(), r = function(n) {
    e(i, n);
    function i(a) {
      return n.call(this, a) || this;
    }
    return i;
  }(t.Exception);
  return Nt.LogicError = r, Nt;
}
var fo;
function Xa() {
  if (fo)
    return Ft;
  fo = 1;
  var e = S && S.__extends || function() {
    var n = function(i, a) {
      return n = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(o, u) {
        o.__proto__ = u;
      } || function(o, u) {
        for (var s in u)
          Object.prototype.hasOwnProperty.call(u, s) && (o[s] = u[s]);
      }, n(i, a);
    };
    return function(i, a) {
      if (typeof a != "function" && a !== null)
        throw new TypeError("Class extends value " + String(a) + " is not a constructor or null");
      n(i, a);
      function o() {
        this.constructor = i;
      }
      i.prototype = a === null ? Object.create(a) : (o.prototype = a.prototype, new o());
    };
  }();
  Object.defineProperty(Ft, "__esModule", { value: !0 }), Ft.InvalidArgument = void 0;
  var t = Za(), r = function(n) {
    e(i, n);
    function i(a) {
      return n.call(this, a) || this;
    }
    return i;
  }(t.LogicError);
  return Ft.InvalidArgument = r, Ft;
}
var Ht = {}, lo;
function Hf() {
  if (lo)
    return Ht;
  lo = 1;
  var e = S && S.__extends || function() {
    var n = function(i, a) {
      return n = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(o, u) {
        o.__proto__ = u;
      } || function(o, u) {
        for (var s in u)
          Object.prototype.hasOwnProperty.call(u, s) && (o[s] = u[s]);
      }, n(i, a);
    };
    return function(i, a) {
      if (typeof a != "function" && a !== null)
        throw new TypeError("Class extends value " + String(a) + " is not a constructor or null");
      n(i, a);
      function o() {
        this.constructor = i;
      }
      i.prototype = a === null ? Object.create(a) : (o.prototype = a.prototype, new o());
    };
  }();
  Object.defineProperty(Ht, "__esModule", { value: !0 }), Ht.OutOfRange = void 0;
  var t = Za(), r = function(n) {
    e(i, n);
    function i(a) {
      return n.call(this, a) || this;
    }
    return i;
  }(t.LogicError);
  return Ht.OutOfRange = r, Ht;
}
var co;
function un() {
  return co || (co = 1, function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.ErrorGenerator = void 0;
    var t = Xa(), r = Hf();
    (function(n) {
      function i(d) {
        if (typeof d == "string")
          return d;
        var p = d.constructor.name;
        return d.constructor.__MODULE && (p = "".concat(d.constructor.__MODULE, ".").concat(p)), "std.".concat(p);
      }
      n.get_class_name = i;
      function a(d, p) {
        return new r.OutOfRange("Error on ".concat(i(d), ".").concat(p, "(): it's empty container."));
      }
      n.empty = a;
      function o(d, p, y) {
        return new r.OutOfRange("Error on ".concat(i(d), ".").concat(p, "(): parametric index is negative -> (index = ").concat(y, ")."));
      }
      n.negative_index = o;
      function u(d, p, y, g) {
        return new r.OutOfRange("Error on ".concat(i(d), ".").concat(p, "(): parametric index is equal or greater than size -> (index = ").concat(y, ", size: ").concat(g, ")."));
      }
      n.excessive_index = u;
      function s(d, p) {
        return new t.InvalidArgument("Error on ".concat(i(d), ".").concat(p, "(): parametric iterator is not this container's own."));
      }
      n.not_my_iterator = s;
      function f(d, p) {
        return new t.InvalidArgument("Error on ".concat(i(d), ".").concat(p, "(): parametric iterator, it already has been erased."));
      }
      n.erased_iterator = f;
      function h(d, p, y) {
        return new r.OutOfRange("Error on ".concat(i(d), ".").concat(p, "(): parametric iterator is directing negative position -> (index = ").concat(y, ")."));
      }
      n.negative_iterator = h;
      function l(d, p) {
        p === void 0 && (p = "end");
        var y = i(d);
        return new r.OutOfRange("Error on ".concat(y, ".Iterator.value: cannot access to the ").concat(y, ".").concat(p, "().value."));
      }
      n.iterator_end_value = l;
      function c(d, p, y) {
        throw new r.OutOfRange("Error on ".concat(i(d), ".").concat(p, "(): unable to find the matched key -> ").concat(y));
      }
      n.key_nout_found = c;
    })(e.ErrorGenerator || (e.ErrorGenerator = {}));
  }(Pn)), Pn;
}
var ho;
function $f() {
  if (ho)
    return Lt;
  ho = 1;
  var e = S && S.__extends || function() {
    var o = function(u, s) {
      return o = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(f, h) {
        f.__proto__ = h;
      } || function(f, h) {
        for (var l in h)
          Object.prototype.hasOwnProperty.call(h, l) && (f[l] = h[l]);
      }, o(u, s);
    };
    return function(u, s) {
      if (typeof s != "function" && s !== null)
        throw new TypeError("Class extends value " + String(s) + " is not a constructor or null");
      o(u, s);
      function f() {
        this.constructor = u;
      }
      u.prototype = s === null ? Object.create(s) : (f.prototype = s.prototype, new f());
    };
  }(), t = S && S.__read || function(o, u) {
    var s = typeof Symbol == "function" && o[Symbol.iterator];
    if (!s)
      return o;
    var f = s.call(o), h, l = [], c;
    try {
      for (; (u === void 0 || u-- > 0) && !(h = f.next()).done; )
        l.push(h.value);
    } catch (d) {
      c = { error: d };
    } finally {
      try {
        h && !h.done && (s = f.return) && s.call(f);
      } finally {
        if (c)
          throw c.error;
      }
    }
    return l;
  }, r = S && S.__spreadArray || function(o, u, s) {
    if (s || arguments.length === 2)
      for (var f = 0, h = u.length, l; f < h; f++)
        (l || !(f in u)) && (l || (l = Array.prototype.slice.call(u, 0, f)), l[f] = u[f]);
    return o.concat(l || Array.prototype.slice.call(u));
  };
  Object.defineProperty(Lt, "__esModule", { value: !0 }), Lt.UniqueSet = void 0;
  var n = Nf(), i = un(), a = function(o) {
    e(u, o);
    function u() {
      return o !== null && o.apply(this, arguments) || this;
    }
    return u.prototype.count = function(s) {
      return this.find(s).equals(this.end()) ? 0 : 1;
    }, u.prototype.insert = function() {
      for (var s = [], f = 0; f < arguments.length; f++)
        s[f] = arguments[f];
      return o.prototype.insert.apply(this, r([], t(s), !1));
    }, u.prototype._Insert_by_range = function(s, f) {
      for (; !s.equals(f); s = s.next())
        this._Insert_by_key(s.value);
    }, u.prototype.extract = function(s) {
      return s instanceof this.end().constructor ? this._Extract_by_iterator(s) : this._Extract_by_val(s);
    }, u.prototype._Extract_by_val = function(s) {
      var f = this.find(s);
      if (f.equals(this.end()) === !0)
        throw i.ErrorGenerator.key_nout_found(this, "extract", s);
      return this._Erase_by_range(f), s;
    }, u.prototype._Extract_by_iterator = function(s) {
      return s.equals(this.end()) === !0 || this.has(s.value) === !1 ? this.end() : (this._Erase_by_range(s), s);
    }, u.prototype._Erase_by_val = function(s) {
      var f = this.find(s);
      return f.equals(this.end()) === !0 ? 0 : (this._Erase_by_range(f), 1);
    }, u.prototype.merge = function(s) {
      for (var f = s.begin(); !f.equals(s.end()); )
        this.has(f.value) === !1 ? (this.insert(f.value), f = s.erase(f)) : f = f.next();
    }, u;
  }(n.SetContainer);
  return Lt.UniqueSet = a, Lt;
}
var qn = {}, jn = {}, po;
function Wf() {
  return po || (po = 1, function(e) {
    var t = S && S.__read || function(n, i) {
      var a = typeof Symbol == "function" && n[Symbol.iterator];
      if (!a)
        return n;
      var o = a.call(n), u, s = [], f;
      try {
        for (; (i === void 0 || i-- > 0) && !(u = o.next()).done; )
          s.push(u.value);
      } catch (h) {
        f = { error: h };
      } finally {
        try {
          u && !u.done && (a = o.return) && a.call(o);
        } finally {
          if (f)
            throw f.error;
        }
      }
      return s;
    }, r = S && S.__spreadArray || function(n, i, a) {
      if (a || arguments.length === 2)
        for (var o = 0, u = i.length, s; o < u; o++)
          (s || !(o in i)) && (s || (s = Array.prototype.slice.call(i, 0, o)), s[o] = i[o]);
      return n.concat(s || Array.prototype.slice.call(i));
    };
    Object.defineProperty(e, "__esModule", { value: !0 }), e.IAssociativeContainer = void 0, function(n) {
      function i(a) {
        for (var o = [], u = 1; u < arguments.length; u++)
          o[u - 1] = arguments[u];
        var s, f;
        return o.length >= 1 && o[0] instanceof Array ? (s = function() {
          var h = o[0];
          a.push.apply(a, r([], t(h), !1));
        }, f = o.slice(1)) : o.length >= 2 && o[0].next instanceof Function && o[1].next instanceof Function ? (s = function() {
          var h = o[0], l = o[1];
          a.assign(h, l);
        }, f = o.slice(2)) : (s = null, f = o), { ramda: s, tail: f };
      }
      n.construct = i;
    }(e.IAssociativeContainer || (e.IAssociativeContainer = {}));
  }(jn)), jn;
}
var $t = {}, Wt = {}, zt = {}, _o;
function zf() {
  if (_o)
    return zt;
  _o = 1, Object.defineProperty(zt, "__esModule", { value: !0 }), zt._Get_root = void 0;
  var e = wr;
  function t() {
    return r === null && (r = (0, e.is_node)() ? S : self, r.__s_iUID === void 0 && (r.__s_iUID = 0)), r;
  }
  zt._Get_root = t;
  var r = null;
  return zt;
}
var vo;
function Qa() {
  if (vo)
    return Wt;
  vo = 1, Object.defineProperty(Wt, "__esModule", { value: !0 }), Wt.get_uid = void 0;
  var e = zf();
  function t(r) {
    if (r instanceof Object) {
      if (r.hasOwnProperty("__get_m_iUID") === !1) {
        var n = ++(0, e._Get_root)().__s_iUID;
        Object.defineProperty(r, "__get_m_iUID", {
          value: function() {
            return n;
          }
        });
      }
      return r.__get_m_iUID();
    } else
      return r === void 0 ? -1 : 0;
  }
  return Wt.get_uid = t, Wt;
}
var yo;
function Oi() {
  if (yo)
    return $t;
  yo = 1;
  var e = S && S.__values || function(s) {
    var f = typeof Symbol == "function" && Symbol.iterator, h = f && s[f], l = 0;
    if (h)
      return h.call(s);
    if (s && typeof s.length == "number")
      return {
        next: function() {
          return s && l >= s.length && (s = void 0), { value: s && s[l++], done: !s };
        }
      };
    throw new TypeError(f ? "Object is not iterable." : "Symbol.iterator is not defined.");
  };
  Object.defineProperty($t, "__esModule", { value: !0 }), $t.hash = void 0;
  var t = Qa();
  function r() {
    for (var s, f, h = [], l = 0; l < arguments.length; l++)
      h[l] = arguments[l];
    var c = o;
    try {
      for (var d = e(h), p = d.next(); !p.done; p = d.next()) {
        var y = p.value;
        y = y && y.valueOf();
        var g = typeof y;
        if (g === "boolean")
          c = n(y, c);
        else if (g === "number" || g === "bigint")
          c = i(y, c);
        else if (g === "string")
          c = a(y, c);
        else if (y instanceof Object && y.hashCode instanceof Function) {
          var x = y.hashCode();
          if (h.length === 1)
            return x;
          c = c ^ x, c *= u;
        } else
          c = i((0, t.get_uid)(y), c);
      }
    } catch (E) {
      s = { error: E };
    } finally {
      try {
        p && !p.done && (f = d.return) && f.call(d);
      } finally {
        if (s)
          throw s.error;
      }
    }
    return Math.abs(c);
  }
  $t.hash = r;
  function n(s, f) {
    return f ^= s ? 1 : 0, f *= u, f;
  }
  function i(s, f) {
    return a(s.toString(), f);
  }
  function a(s, f) {
    for (var h = 0; h < s.length; ++h)
      f ^= s.charCodeAt(h), f *= u;
    return Math.abs(f);
  }
  var o = 2166136261, u = 16777619;
  return $t;
}
var pe = {}, go;
function Ai() {
  if (go)
    return pe;
  go = 1, Object.defineProperty(pe, "__esModule", { value: !0 }), pe.greater_equal = pe.greater = pe.less_equal = pe.less = pe.not_equal_to = pe.equal_to = void 0;
  var e = Qa();
  function t(u, s) {
    return u = u && u.valueOf(), s = s && s.valueOf(), u instanceof Object && u.equals instanceof Function ? u.equals(s) : u === s;
  }
  pe.equal_to = t;
  function r(u, s) {
    return !t(u, s);
  }
  pe.not_equal_to = r;
  function n(u, s) {
    return u = u.valueOf(), s = s.valueOf(), u instanceof Object ? u.less instanceof Function ? u.less(s) : (0, e.get_uid)(u) < (0, e.get_uid)(s) : u < s;
  }
  pe.less = n;
  function i(u, s) {
    return n(u, s) || t(u, s);
  }
  pe.less_equal = i;
  function a(u, s) {
    return !i(u, s);
  }
  pe.greater = a;
  function o(u, s) {
    return !n(u, s);
  }
  return pe.greater_equal = o, pe;
}
var bo;
function Ja() {
  return bo || (bo = 1, function(e) {
    var t = S && S.__read || function(o, u) {
      var s = typeof Symbol == "function" && o[Symbol.iterator];
      if (!s)
        return o;
      var f = s.call(o), h, l = [], c;
      try {
        for (; (u === void 0 || u-- > 0) && !(h = f.next()).done; )
          l.push(h.value);
      } catch (d) {
        c = { error: d };
      } finally {
        try {
          h && !h.done && (s = f.return) && s.call(f);
        } finally {
          if (c)
            throw c.error;
        }
      }
      return l;
    }, r = S && S.__spreadArray || function(o, u, s) {
      if (s || arguments.length === 2)
        for (var f = 0, h = u.length, l; f < h; f++)
          (l || !(f in u)) && (l || (l = Array.prototype.slice.call(u, 0, f)), l[f] = u[f]);
      return o.concat(l || Array.prototype.slice.call(u));
    };
    Object.defineProperty(e, "__esModule", { value: !0 }), e.IHashContainer = void 0;
    var n = Wf(), i = Oi(), a = Ai();
    (function(o) {
      function u(s, f, h) {
        for (var l = [], c = 3; c < arguments.length; c++)
          l[c - 3] = arguments[c];
        var d = null, p = i.hash, y = a.equal_to;
        if (l.length === 1 && l[0] instanceof f) {
          var g = l[0];
          p = g.hash_function(), y = g.key_eq(), d = function() {
            var E = g.begin(), I = g.end();
            s.assign(E, I);
          };
        } else {
          var x = n.IAssociativeContainer.construct.apply(n.IAssociativeContainer, r([s], t(l), !1));
          d = x.ramda, x.tail.length >= 1 && (p = x.tail[0]), x.tail.length >= 2 && (y = x.tail[1]);
        }
        h(p, y), d !== null && d();
      }
      o.construct = u;
    })(e.IHashContainer || (e.IHashContainer = {}));
  }(qn)), qn;
}
var Dn = {}, Gt = {}, Yt = {}, wo;
function Ii() {
  if (wo)
    return Yt;
  wo = 1, Object.defineProperty(Yt, "__esModule", { value: !0 }), Yt.ListIterator = void 0;
  var e = un(), t = function() {
    function r(n, i, a) {
      this.prev_ = n, this.next_ = i, this.value_ = a;
    }
    return r._Set_prev = function(n, i) {
      n.prev_ = i;
    }, r._Set_next = function(n, i) {
      n.next_ = i;
    }, r.prototype.prev = function() {
      return this.prev_;
    }, r.prototype.next = function() {
      return this.next_;
    }, Object.defineProperty(r.prototype, "value", {
      get: function() {
        return this._Try_value(), this.value_;
      },
      enumerable: !1,
      configurable: !0
    }), r.prototype._Try_value = function() {
      if (this.value_ === void 0 && this.equals(this.source().end()) === !0)
        throw e.ErrorGenerator.iterator_end_value(this.source());
    }, r.prototype.equals = function(n) {
      return this === n;
    }, r;
  }();
  return Yt.ListIterator = t, Yt;
}
var Vt = {}, xo;
function Gf() {
  if (xo)
    return Vt;
  xo = 1, Object.defineProperty(Vt, "__esModule", { value: !0 }), Vt.Repeater = void 0;
  var e = function() {
    function t(r, n) {
      this.index_ = r, this.value_ = n;
    }
    return t.prototype.index = function() {
      return this.index_;
    }, Object.defineProperty(t.prototype, "value", {
      get: function() {
        return this.value_;
      },
      enumerable: !1,
      configurable: !0
    }), t.prototype.next = function() {
      return ++this.index_, this;
    }, t.prototype.equals = function(r) {
      return this.index_ === r.index_;
    }, t;
  }();
  return Vt.Repeater = e, Vt;
}
var _e = {}, mo;
function Yf() {
  if (mo)
    return _e;
  mo = 1, Object.defineProperty(_e, "__esModule", { value: !0 }), _e.next = _e.prev = _e.advance = _e.distance = _e.size = _e.empty = void 0;
  var e = Xa();
  function t(s) {
    return s instanceof Array ? s.length !== 0 : s.empty();
  }
  _e.empty = t;
  function r(s) {
    return s instanceof Array ? s.length : s.size();
  }
  _e.size = r;
  function n(s, f) {
    if (s.index instanceof Function)
      return i(s, f);
    for (var h = 0; !s.equals(f); s = s.next())
      ++h;
    return h;
  }
  _e.distance = n;
  function i(s, f) {
    var h = s.index(), l = f.index();
    return s.base instanceof Function ? h - l : l - h;
  }
  function a(s, f) {
    if (f === 0)
      return s;
    if (s.advance instanceof Function)
      return s.advance(f);
    var h;
    if (f < 0) {
      if (!(s.prev instanceof Function))
        throw new e.InvalidArgument("Error on std.advance(): parametric iterator is not a bi-directional iterator, thus advancing to negative direction is not possible.");
      h = function(l) {
        return l.prev();
      }, f = -f;
    } else
      h = function(l) {
        return l.next();
      };
    for (; f-- > 0; )
      s = h(s);
    return s;
  }
  _e.advance = a;
  function o(s, f) {
    return f === void 0 && (f = 1), f === 1 ? s.prev() : a(s, -f);
  }
  _e.prev = o;
  function u(s, f) {
    return f === void 0 && (f = 1), f === 1 ? s.next() : a(s, f);
  }
  return _e.next = u, _e;
}
var Eo;
function es() {
  if (Eo)
    return Gt;
  Eo = 1;
  var e = S && S.__extends || function() {
    var f = function(h, l) {
      return f = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(c, d) {
        c.__proto__ = d;
      } || function(c, d) {
        for (var p in d)
          Object.prototype.hasOwnProperty.call(d, p) && (c[p] = d[p]);
      }, f(h, l);
    };
    return function(h, l) {
      if (typeof l != "function" && l !== null)
        throw new TypeError("Class extends value " + String(l) + " is not a constructor or null");
      f(h, l);
      function c() {
        this.constructor = h;
      }
      h.prototype = l === null ? Object.create(l) : (c.prototype = l.prototype, new c());
    };
  }(), t = S && S.__read || function(f, h) {
    var l = typeof Symbol == "function" && f[Symbol.iterator];
    if (!l)
      return f;
    var c = l.call(f), d, p = [], y;
    try {
      for (; (h === void 0 || h-- > 0) && !(d = c.next()).done; )
        p.push(d.value);
    } catch (g) {
      y = { error: g };
    } finally {
      try {
        d && !d.done && (l = c.return) && l.call(c);
      } finally {
        if (y)
          throw y.error;
      }
    }
    return p;
  };
  Object.defineProperty(Gt, "__esModule", { value: !0 }), Gt.ListContainer = void 0;
  var r = Si(), n = Ii(), i = Gf(), a = Ri(), o = Yf(), u = un(), s = function(f) {
    e(h, f);
    function h() {
      var l = f.call(this) || this;
      return l.end_ = l._Create_iterator(null, null), l.clear(), l;
    }
    return h.prototype.assign = function(l, c) {
      this.clear(), this.insert(this.end(), l, c);
    }, h.prototype.clear = function() {
      n.ListIterator._Set_prev(this.end_, this.end_), n.ListIterator._Set_next(this.end_, this.end_), this.begin_ = this.end_, this.size_ = 0;
    }, h.prototype.resize = function(l) {
      var c = l - this.size();
      c > 0 ? this.insert(this.end(), c, void 0) : c < 0 && this.erase((0, o.advance)(this.end(), -c), this.end());
    }, h.prototype.begin = function() {
      return this.begin_;
    }, h.prototype.end = function() {
      return this.end_;
    }, h.prototype.size = function() {
      return this.size_;
    }, h.prototype.push_front = function(l) {
      this.insert(this.begin_, l);
    }, h.prototype.push_back = function(l) {
      this.insert(this.end_, l);
    }, h.prototype.pop_front = function() {
      if (this.empty() === !0)
        throw u.ErrorGenerator.empty(this.end_.source().constructor.name, "pop_front");
      this.erase(this.begin_);
    }, h.prototype.pop_back = function() {
      if (this.empty() === !0)
        throw u.ErrorGenerator.empty(this.end_.source().constructor.name, "pop_back");
      this.erase(this.end_.prev());
    }, h.prototype.push = function() {
      for (var l = [], c = 0; c < arguments.length; c++)
        l[c] = arguments[c];
      if (l.length === 0)
        return this.size();
      var d = new a.NativeArrayIterator(l, 0), p = new a.NativeArrayIterator(l, l.length);
      return this._Insert_by_range(this.end(), d, p), this.size();
    }, h.prototype.insert = function(l) {
      for (var c = [], d = 1; d < arguments.length; d++)
        c[d - 1] = arguments[d];
      if (l.source() !== this.end_.source())
        throw u.ErrorGenerator.not_my_iterator(this.end_.source(), "insert");
      if (l.erased_ === !0)
        throw u.ErrorGenerator.erased_iterator(this.end_.source(), "insert");
      return c.length === 1 ? this._Insert_by_repeating_val(l, 1, c[0]) : c.length === 2 && typeof c[0] == "number" ? this._Insert_by_repeating_val(l, c[0], c[1]) : this._Insert_by_range(l, c[0], c[1]);
    }, h.prototype._Insert_by_repeating_val = function(l, c, d) {
      var p = new i.Repeater(0, d), y = new i.Repeater(c);
      return this._Insert_by_range(l, p, y);
    }, h.prototype._Insert_by_range = function(l, c, d) {
      for (var p = l.prev(), y = null, g = 0, x = c; x.equals(d) === !1; x = x.next()) {
        var E = this._Create_iterator(p, null, x.value);
        g === 0 && (y = E), n.ListIterator._Set_next(p, E), p = E, ++g;
      }
      return l.equals(this.begin()) === !0 && (this.begin_ = y), n.ListIterator._Set_next(p, l), n.ListIterator._Set_prev(l, p), this.size_ += g, y;
    }, h.prototype.erase = function(l, c) {
      return c === void 0 && (c = l.next()), this._Erase_by_range(l, c);
    }, h.prototype._Erase_by_range = function(l, c) {
      if (l.source() !== this.end_.source())
        throw u.ErrorGenerator.not_my_iterator(this.end_.source(), "insert");
      if (l.erased_ === !0)
        throw u.ErrorGenerator.erased_iterator(this.end_.source(), "insert");
      if (l.equals(this.end_))
        return this.end_;
      var d = l.prev();
      n.ListIterator._Set_next(d, c), n.ListIterator._Set_prev(c, d);
      for (var p = l; !p.equals(c); p = p.next())
        p.erased_ = !0, --this.size_;
      return l.equals(this.begin_) && (this.begin_ = c), c;
    }, h.prototype.swap = function(l) {
      var c, d, p;
      c = t([l.begin_, this.begin_], 2), this.begin_ = c[0], l.begin_ = c[1], d = t([l.end_, this.end_], 2), this.end_ = d[0], l.end_ = d[1], p = t([l.size_, this.size_], 2), this.size_ = p[0], l.size_ = p[1];
    }, h;
  }(r.Container);
  return Gt.ListContainer = s, Gt;
}
var Kt = {}, So;
function ts() {
  if (So)
    return Kt;
  So = 1, Object.defineProperty(Kt, "__esModule", { value: !0 }), Kt.ReverseIterator = void 0;
  var e = function() {
    function t(r) {
      this.base_ = r.prev();
    }
    return t.prototype.source = function() {
      return this.base_.source();
    }, t.prototype.base = function() {
      return this.base_.next();
    }, Object.defineProperty(t.prototype, "value", {
      get: function() {
        return this.base_.value;
      },
      enumerable: !1,
      configurable: !0
    }), t.prototype.prev = function() {
      return this._Create_neighbor(this.base().next());
    }, t.prototype.next = function() {
      return this._Create_neighbor(this.base_);
    }, t.prototype.equals = function(r) {
      return this.base_.equals(r.base_);
    }, t;
  }();
  return Kt.ReverseIterator = e, Kt;
}
var Ro;
function Vf() {
  return Ro || (Ro = 1, function(e) {
    var t = S && S.__extends || function() {
      var u = function(s, f) {
        return u = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(h, l) {
          h.__proto__ = l;
        } || function(h, l) {
          for (var c in l)
            Object.prototype.hasOwnProperty.call(l, c) && (h[c] = l[c]);
        }, u(s, f);
      };
      return function(s, f) {
        if (typeof f != "function" && f !== null)
          throw new TypeError("Class extends value " + String(f) + " is not a constructor or null");
        u(s, f);
        function h() {
          this.constructor = s;
        }
        s.prototype = f === null ? Object.create(f) : (h.prototype = f.prototype, new h());
      };
    }(), r = S && S.__read || function(u, s) {
      var f = typeof Symbol == "function" && u[Symbol.iterator];
      if (!f)
        return u;
      var h = f.call(u), l, c = [], d;
      try {
        for (; (s === void 0 || s-- > 0) && !(l = h.next()).done; )
          c.push(l.value);
      } catch (p) {
        d = { error: p };
      } finally {
        try {
          l && !l.done && (f = h.return) && f.call(h);
        } finally {
          if (d)
            throw d.error;
        }
      }
      return c;
    };
    Object.defineProperty(e, "__esModule", { value: !0 }), e.SetElementList = void 0;
    var n = es(), i = Ii(), a = ts(), o = function(u) {
      t(s, u);
      function s(f) {
        var h = u.call(this) || this;
        return h.associative_ = f, h;
      }
      return s.prototype._Create_iterator = function(f, h, l) {
        return s.Iterator.create(this, f, h, l);
      }, s._Swap_associative = function(f, h) {
        var l;
        l = r([h.associative_, f.associative_], 2), f.associative_ = l[0], h.associative_ = l[1];
      }, s.prototype.associative = function() {
        return this.associative_;
      }, s;
    }(n.ListContainer);
    e.SetElementList = o, function(u) {
      var s = function(h) {
        t(l, h);
        function l(c, d, p, y) {
          var g = h.call(this, d, p, y) || this;
          return g.source_ = c, g;
        }
        return l.create = function(c, d, p, y) {
          return new l(c, d, p, y);
        }, l.prototype.reverse = function() {
          return new f(this);
        }, l.prototype.source = function() {
          return this.source_.associative();
        }, l;
      }(i.ListIterator);
      u.Iterator = s;
      var f = function(h) {
        t(l, h);
        function l() {
          return h !== null && h.apply(this, arguments) || this;
        }
        return l.prototype._Create_neighbor = function(c) {
          return new l(c);
        }, l;
      }(a.ReverseIterator);
      u.ReverseIterator = f;
    }(o = e.SetElementList || (e.SetElementList = {})), e.SetElementList = o;
  }(Dn)), Dn;
}
var Zt = {}, Xt = {}, Oo;
function rs() {
  if (Oo)
    return Xt;
  Oo = 1;
  var e = S && S.__values || function(i) {
    var a = typeof Symbol == "function" && Symbol.iterator, o = a && i[a], u = 0;
    if (o)
      return o.call(i);
    if (i && typeof i.length == "number")
      return {
        next: function() {
          return i && u >= i.length && (i = void 0), { value: i && i[u++], done: !i };
        }
      };
    throw new TypeError(a ? "Object is not iterable." : "Symbol.iterator is not defined.");
  };
  Object.defineProperty(Xt, "__esModule", { value: !0 }), Xt.HashBuckets = void 0;
  var t = function() {
    function i(a, o) {
      this.fetcher_ = a, this.hasher_ = o, this.max_load_factor_ = n, this.data_ = [], this.size_ = 0, this.initialize();
    }
    return i.prototype.clear = function() {
      this.data_ = [], this.size_ = 0, this.initialize();
    }, i.prototype.rehash = function(a) {
      var o, u, s, f;
      a = Math.max(a, r);
      for (var h = [], l = 0; l < a; ++l)
        h.push([]);
      try {
        for (var c = e(this.data_), d = c.next(); !d.done; d = c.next()) {
          var p = d.value;
          try {
            for (var y = (s = void 0, e(p)), g = y.next(); !g.done; g = y.next()) {
              var x = g.value, E = this.hasher_(this.fetcher_(x)) % h.length;
              h[E].push(x);
            }
          } catch (I) {
            s = { error: I };
          } finally {
            try {
              g && !g.done && (f = y.return) && f.call(y);
            } finally {
              if (s)
                throw s.error;
            }
          }
        }
      } catch (I) {
        o = { error: I };
      } finally {
        try {
          d && !d.done && (u = c.return) && u.call(c);
        } finally {
          if (o)
            throw o.error;
        }
      }
      this.data_ = h;
    }, i.prototype.reserve = function(a) {
      a > this.capacity() && (a = Math.floor(a / this.max_load_factor_), this.rehash(a));
    }, i.prototype.initialize = function() {
      for (var a = 0; a < r; ++a)
        this.data_.push([]);
    }, i.prototype.length = function() {
      return this.data_.length;
    }, i.prototype.capacity = function() {
      return this.data_.length * this.max_load_factor_;
    }, i.prototype.at = function(a) {
      return this.data_[a];
    }, i.prototype.load_factor = function() {
      return this.size_ / this.length();
    }, i.prototype.max_load_factor = function(a) {
      if (a === void 0 && (a = null), a === null)
        return this.max_load_factor_;
      this.max_load_factor_ = a;
    }, i.prototype.hash_function = function() {
      return this.hasher_;
    }, i.prototype.index = function(a) {
      return this.hasher_(this.fetcher_(a)) % this.length();
    }, i.prototype.insert = function(a) {
      var o = this.capacity();
      ++this.size_ > o && this.reserve(o * 2);
      var u = this.index(a);
      this.data_[u].push(a);
    }, i.prototype.erase = function(a) {
      for (var o = this.index(a), u = this.data_[o], s = 0; s < u.length; ++s)
        if (u[s] === a) {
          u.splice(s, 1), --this.size_;
          break;
        }
    }, i;
  }();
  Xt.HashBuckets = t;
  var r = 10, n = 1;
  return Xt;
}
var Ao;
function Kf() {
  if (Ao)
    return Zt;
  Ao = 1;
  var e = S && S.__extends || function() {
    var o = function(u, s) {
      return o = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(f, h) {
        f.__proto__ = h;
      } || function(f, h) {
        for (var l in h)
          Object.prototype.hasOwnProperty.call(h, l) && (f[l] = h[l]);
      }, o(u, s);
    };
    return function(u, s) {
      if (typeof s != "function" && s !== null)
        throw new TypeError("Class extends value " + String(s) + " is not a constructor or null");
      o(u, s);
      function f() {
        this.constructor = u;
      }
      u.prototype = s === null ? Object.create(s) : (f.prototype = s.prototype, new f());
    };
  }(), t = S && S.__read || function(o, u) {
    var s = typeof Symbol == "function" && o[Symbol.iterator];
    if (!s)
      return o;
    var f = s.call(o), h, l = [], c;
    try {
      for (; (u === void 0 || u-- > 0) && !(h = f.next()).done; )
        l.push(h.value);
    } catch (d) {
      c = { error: d };
    } finally {
      try {
        h && !h.done && (s = f.return) && s.call(f);
      } finally {
        if (c)
          throw c.error;
      }
    }
    return l;
  }, r = S && S.__values || function(o) {
    var u = typeof Symbol == "function" && Symbol.iterator, s = u && o[u], f = 0;
    if (s)
      return s.call(o);
    if (o && typeof o.length == "number")
      return {
        next: function() {
          return o && f >= o.length && (o = void 0), { value: o && o[f++], done: !o };
        }
      };
    throw new TypeError(u ? "Object is not iterable." : "Symbol.iterator is not defined.");
  };
  Object.defineProperty(Zt, "__esModule", { value: !0 }), Zt.SetHashBuckets = void 0;
  var n = rs(), i = function(o) {
    e(u, o);
    function u(s, f, h) {
      var l = o.call(this, a, f) || this;
      return l.source_ = s, l.key_eq_ = h, l;
    }
    return u._Swap_source = function(s, f) {
      var h;
      h = t([f.source_, s.source_], 2), s.source_ = h[0], f.source_ = h[1];
    }, u.prototype.key_eq = function() {
      return this.key_eq_;
    }, u.prototype.find = function(s) {
      var f, h, l = this.hash_function()(s) % this.length(), c = this.at(l);
      try {
        for (var d = r(c), p = d.next(); !p.done; p = d.next()) {
          var y = p.value;
          if (this.key_eq_(y.value, s))
            return y;
        }
      } catch (g) {
        f = { error: g };
      } finally {
        try {
          p && !p.done && (h = d.return) && h.call(d);
        } finally {
          if (f)
            throw f.error;
        }
      }
      return this.source_.end();
    }, u;
  }(n.HashBuckets);
  Zt.SetHashBuckets = i;
  function a(o) {
    return o.value;
  }
  return Zt;
}
var et = {}, Io;
function ns() {
  if (Io)
    return et;
  Io = 1, Object.defineProperty(et, "__esModule", { value: !0 }), et.make_pair = et.Pair = void 0;
  var e = Oi(), t = Ai(), r = function() {
    function i(a, o) {
      this.first = a, this.second = o;
    }
    return i.prototype.equals = function(a) {
      return (0, t.equal_to)(this.first, a.first) && (0, t.equal_to)(this.second, a.second);
    }, i.prototype.less = function(a) {
      return (0, t.equal_to)(this.first, a.first) === !1 ? (0, t.less)(this.first, a.first) : (0, t.less)(this.second, a.second);
    }, i.prototype.hashCode = function() {
      return (0, e.hash)(this.first, this.second);
    }, i;
  }();
  et.Pair = r;
  function n(i, a) {
    return new r(i, a);
  }
  return et.make_pair = n, et;
}
var To;
function Zf() {
  return To || (To = 1, function(e) {
    var t = S && S.__extends || function() {
      var h = function(l, c) {
        return h = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d, p) {
          d.__proto__ = p;
        } || function(d, p) {
          for (var y in p)
            Object.prototype.hasOwnProperty.call(p, y) && (d[y] = p[y]);
        }, h(l, c);
      };
      return function(l, c) {
        if (typeof c != "function" && c !== null)
          throw new TypeError("Class extends value " + String(c) + " is not a constructor or null");
        h(l, c);
        function d() {
          this.constructor = l;
        }
        l.prototype = c === null ? Object.create(c) : (d.prototype = c.prototype, new d());
      };
    }(), r = S && S.__read || function(h, l) {
      var c = typeof Symbol == "function" && h[Symbol.iterator];
      if (!c)
        return h;
      var d = c.call(h), p, y = [], g;
      try {
        for (; (l === void 0 || l-- > 0) && !(p = d.next()).done; )
          y.push(p.value);
      } catch (x) {
        g = { error: x };
      } finally {
        try {
          p && !p.done && (c = d.return) && c.call(d);
        } finally {
          if (g)
            throw g.error;
        }
      }
      return y;
    }, n = S && S.__spreadArray || function(h, l, c) {
      if (c || arguments.length === 2)
        for (var d = 0, p = l.length, y; d < p; d++)
          (y || !(d in l)) && (y || (y = Array.prototype.slice.call(l, 0, d)), y[d] = l[d]);
      return h.concat(y || Array.prototype.slice.call(l));
    };
    Object.defineProperty(e, "__esModule", { value: !0 }), e.HashSet = void 0;
    var i = $f(), a = Ja(), o = Vf(), u = Kf(), s = ns(), f = function(h) {
      t(l, h);
      function l() {
        for (var c = [], d = 0; d < arguments.length; d++)
          c[d] = arguments[d];
        var p = h.call(this, function(y) {
          return new o.SetElementList(y);
        }) || this;
        return a.IHashContainer.construct.apply(a.IHashContainer, n([
          p,
          l,
          function(y, g) {
            p.buckets_ = new u.SetHashBuckets(p, y, g);
          }
        ], r(c), !1)), p;
      }
      return l.prototype.clear = function() {
        this.buckets_.clear(), h.prototype.clear.call(this);
      }, l.prototype.swap = function(c) {
        var d, p;
        d = r([c.data_, this.data_], 2), this.data_ = d[0], c.data_ = d[1], o.SetElementList._Swap_associative(this.data_, c.data_), u.SetHashBuckets._Swap_source(this.buckets_, c.buckets_), p = r([c.buckets_, this.buckets_], 2), this.buckets_ = p[0], c.buckets_ = p[1];
      }, l.prototype.find = function(c) {
        return this.buckets_.find(c);
      }, l.prototype.begin = function(c) {
        return c === void 0 && (c = null), c === null ? h.prototype.begin.call(this) : this.buckets_.at(c)[0];
      }, l.prototype.end = function(c) {
        if (c === void 0 && (c = null), c === null)
          return h.prototype.end.call(this);
        var d = this.buckets_.at(c);
        return d[d.length - 1].next();
      }, l.prototype.rbegin = function(c) {
        return c === void 0 && (c = null), this.end(c).reverse();
      }, l.prototype.rend = function(c) {
        return c === void 0 && (c = null), this.begin(c).reverse();
      }, l.prototype.bucket_count = function() {
        return this.buckets_.length();
      }, l.prototype.bucket_size = function(c) {
        return this.buckets_.at(c).length;
      }, l.prototype.load_factor = function() {
        return this.buckets_.load_factor();
      }, l.prototype.hash_function = function() {
        return this.buckets_.hash_function();
      }, l.prototype.key_eq = function() {
        return this.buckets_.key_eq();
      }, l.prototype.bucket = function(c) {
        return this.hash_function()(c) % this.buckets_.length();
      }, l.prototype.max_load_factor = function(c) {
        return c === void 0 && (c = null), this.buckets_.max_load_factor(c);
      }, l.prototype.reserve = function(c) {
        this.buckets_.reserve(c);
      }, l.prototype.rehash = function(c) {
        this.buckets_.rehash(c);
      }, l.prototype._Insert_by_key = function(c) {
        var d = this.find(c);
        return d.equals(this.end()) === !1 ? new s.Pair(d, !1) : (this.data_.push(c), d = d.prev(), this._Handle_insert(d, d.next()), new s.Pair(d, !0));
      }, l.prototype._Insert_by_hint = function(c, d) {
        var p = this.find(d);
        return p.equals(this.end()) === !0 && (p = this.data_.insert(c, d), this._Handle_insert(p, p.next())), p;
      }, l.prototype._Handle_insert = function(c, d) {
        for (; !c.equals(d); c = c.next())
          this.buckets_.insert(c);
      }, l.prototype._Handle_erase = function(c, d) {
        for (; !c.equals(d); c = c.next())
          this.buckets_.erase(c);
      }, l;
    }(i.UniqueSet);
    e.HashSet = f, function(h) {
      h.Iterator = o.SetElementList.Iterator, h.ReverseIterator = o.SetElementList.ReverseIterator;
    }(f = e.HashSet || (e.HashSet = {})), e.HashSet = f;
  }(Ln)), Ln;
}
var Fn = {}, Qt = {}, Jt = {}, Co;
function Xf() {
  if (Co)
    return Jt;
  Co = 1;
  var e = S && S.__extends || function() {
    var i = function(a, o) {
      return i = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(u, s) {
        u.__proto__ = s;
      } || function(u, s) {
        for (var f in s)
          Object.prototype.hasOwnProperty.call(s, f) && (u[f] = s[f]);
      }, i(a, o);
    };
    return function(a, o) {
      if (typeof o != "function" && o !== null)
        throw new TypeError("Class extends value " + String(o) + " is not a constructor or null");
      i(a, o);
      function u() {
        this.constructor = a;
      }
      a.prototype = o === null ? Object.create(o) : (u.prototype = o.prototype, new u());
    };
  }();
  Object.defineProperty(Jt, "__esModule", { value: !0 }), Jt.MapContainer = void 0;
  var t = Si(), r = Ri(), n = function(i) {
    e(a, i);
    function a(o) {
      var u = i.call(this) || this;
      return u.data_ = o(u), u;
    }
    return a.prototype.assign = function(o, u) {
      this.clear(), this.insert(o, u);
    }, a.prototype.clear = function() {
      this.data_.clear();
    }, a.prototype.begin = function() {
      return this.data_.begin();
    }, a.prototype.end = function() {
      return this.data_.end();
    }, a.prototype.has = function(o) {
      return !this.find(o).equals(this.end());
    }, a.prototype.size = function() {
      return this.data_.size();
    }, a.prototype.push = function() {
      for (var o = [], u = 0; u < arguments.length; u++)
        o[u] = arguments[u];
      var s = new r.NativeArrayIterator(o, 0), f = new r.NativeArrayIterator(o, o.length);
      return this.insert(s, f), this.size();
    }, a.prototype.insert = function() {
      for (var o = [], u = 0; u < arguments.length; u++)
        o[u] = arguments[u];
      return o.length === 1 ? this.emplace(o[0].first, o[0].second) : o[0].next instanceof Function && o[1].next instanceof Function ? this._Insert_by_range(o[0], o[1]) : this.emplace_hint(o[0], o[1].first, o[1].second);
    }, a.prototype.erase = function() {
      for (var o = [], u = 0; u < arguments.length; u++)
        o[u] = arguments[u];
      return o.length === 1 && (!(o[0] instanceof this.end().constructor) || o[0].source() !== this) ? this._Erase_by_key(o[0]) : o.length === 1 ? this._Erase_by_range(o[0]) : this._Erase_by_range(o[0], o[1]);
    }, a.prototype._Erase_by_range = function(o, u) {
      u === void 0 && (u = o.next());
      var s = this.data_.erase(o, u);
      return this._Handle_erase(o, u), s;
    }, a;
  }(t.Container);
  return Jt.MapContainer = n, Jt;
}
var Mo;
function Qf() {
  if (Mo)
    return Qt;
  Mo = 1;
  var e = S && S.__extends || function() {
    var o = function(u, s) {
      return o = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(f, h) {
        f.__proto__ = h;
      } || function(f, h) {
        for (var l in h)
          Object.prototype.hasOwnProperty.call(h, l) && (f[l] = h[l]);
      }, o(u, s);
    };
    return function(u, s) {
      if (typeof s != "function" && s !== null)
        throw new TypeError("Class extends value " + String(s) + " is not a constructor or null");
      o(u, s);
      function f() {
        this.constructor = u;
      }
      u.prototype = s === null ? Object.create(s) : (f.prototype = s.prototype, new f());
    };
  }(), t = S && S.__read || function(o, u) {
    var s = typeof Symbol == "function" && o[Symbol.iterator];
    if (!s)
      return o;
    var f = s.call(o), h, l = [], c;
    try {
      for (; (u === void 0 || u-- > 0) && !(h = f.next()).done; )
        l.push(h.value);
    } catch (d) {
      c = { error: d };
    } finally {
      try {
        h && !h.done && (s = f.return) && s.call(f);
      } finally {
        if (c)
          throw c.error;
      }
    }
    return l;
  }, r = S && S.__spreadArray || function(o, u, s) {
    if (s || arguments.length === 2)
      for (var f = 0, h = u.length, l; f < h; f++)
        (l || !(f in u)) && (l || (l = Array.prototype.slice.call(u, 0, f)), l[f] = u[f]);
    return o.concat(l || Array.prototype.slice.call(u));
  };
  Object.defineProperty(Qt, "__esModule", { value: !0 }), Qt.UniqueMap = void 0;
  var n = Xf(), i = un(), a = function(o) {
    e(u, o);
    function u() {
      return o !== null && o.apply(this, arguments) || this;
    }
    return u.prototype.count = function(s) {
      return this.find(s).equals(this.end()) ? 0 : 1;
    }, u.prototype.get = function(s) {
      var f = this.find(s);
      if (f.equals(this.end()) === !0)
        throw i.ErrorGenerator.key_nout_found(this, "get", s);
      return f.second;
    }, u.prototype.take = function(s, f) {
      var h = this.find(s);
      return h.equals(this.end()) ? this.emplace(s, f()).first.second : h.second;
    }, u.prototype.set = function(s, f) {
      this.insert_or_assign(s, f);
    }, u.prototype.insert = function() {
      for (var s = [], f = 0; f < arguments.length; f++)
        s[f] = arguments[f];
      return o.prototype.insert.apply(this, r([], t(s), !1));
    }, u.prototype._Insert_by_range = function(s, f) {
      for (var h = s; !h.equals(f); h = h.next())
        this.emplace(h.value.first, h.value.second);
    }, u.prototype.insert_or_assign = function() {
      for (var s = [], f = 0; f < arguments.length; f++)
        s[f] = arguments[f];
      if (s.length === 2)
        return this._Insert_or_assign_with_key_value(s[0], s[1]);
      if (s.length === 3)
        return this._Insert_or_assign_with_hint(s[0], s[1], s[2]);
    }, u.prototype._Insert_or_assign_with_key_value = function(s, f) {
      var h = this.emplace(s, f);
      return h.second === !1 && (h.first.second = f), h;
    }, u.prototype._Insert_or_assign_with_hint = function(s, f, h) {
      var l = this.emplace_hint(s, f, h);
      return l.second !== h && (l.second = h), l;
    }, u.prototype.extract = function(s) {
      return s instanceof this.end().constructor ? this._Extract_by_iterator(s) : this._Extract_by_key(s);
    }, u.prototype._Extract_by_key = function(s) {
      var f = this.find(s);
      if (f.equals(this.end()) === !0)
        throw i.ErrorGenerator.key_nout_found(this, "extract", s);
      var h = f.value;
      return this._Erase_by_range(f), h;
    }, u.prototype._Extract_by_iterator = function(s) {
      return s.equals(this.end()) === !0 ? this.end() : (this._Erase_by_range(s), s);
    }, u.prototype._Erase_by_key = function(s) {
      var f = this.find(s);
      return f.equals(this.end()) === !0 ? 0 : (this._Erase_by_range(f), 1);
    }, u.prototype.merge = function(s) {
      for (var f = s.begin(); !f.equals(s.end()); )
        this.has(f.first) === !1 ? (this.insert(f.value), f = s.erase(f)) : f = f.next();
    }, u;
  }(n.MapContainer);
  return Qt.UniqueMap = a, Qt;
}
var Nn = {}, Bo;
function Jf() {
  return Bo || (Bo = 1, function(e) {
    var t = S && S.__extends || function() {
      var u = function(s, f) {
        return u = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(h, l) {
          h.__proto__ = l;
        } || function(h, l) {
          for (var c in l)
            Object.prototype.hasOwnProperty.call(l, c) && (h[c] = l[c]);
        }, u(s, f);
      };
      return function(s, f) {
        if (typeof f != "function" && f !== null)
          throw new TypeError("Class extends value " + String(f) + " is not a constructor or null");
        u(s, f);
        function h() {
          this.constructor = s;
        }
        s.prototype = f === null ? Object.create(f) : (h.prototype = f.prototype, new h());
      };
    }(), r = S && S.__read || function(u, s) {
      var f = typeof Symbol == "function" && u[Symbol.iterator];
      if (!f)
        return u;
      var h = f.call(u), l, c = [], d;
      try {
        for (; (s === void 0 || s-- > 0) && !(l = h.next()).done; )
          c.push(l.value);
      } catch (p) {
        d = { error: p };
      } finally {
        try {
          l && !l.done && (f = h.return) && f.call(h);
        } finally {
          if (d)
            throw d.error;
        }
      }
      return c;
    };
    Object.defineProperty(e, "__esModule", { value: !0 }), e.MapElementList = void 0;
    var n = es(), i = Ii(), a = ts(), o = function(u) {
      t(s, u);
      function s(f) {
        var h = u.call(this) || this;
        return h.associative_ = f, h;
      }
      return s.prototype._Create_iterator = function(f, h, l) {
        return s.Iterator.create(this, f, h, l);
      }, s._Swap_associative = function(f, h) {
        var l;
        l = r([h.associative_, f.associative_], 2), f.associative_ = l[0], h.associative_ = l[1];
      }, s.prototype.associative = function() {
        return this.associative_;
      }, s;
    }(n.ListContainer);
    e.MapElementList = o, function(u) {
      var s = function(h) {
        t(l, h);
        function l(c, d, p, y) {
          var g = h.call(this, d, p, y) || this;
          return g.list_ = c, g;
        }
        return l.create = function(c, d, p, y) {
          return new l(c, d, p, y);
        }, l.prototype.reverse = function() {
          return new f(this);
        }, l.prototype.source = function() {
          return this.list_.associative();
        }, Object.defineProperty(l.prototype, "first", {
          get: function() {
            return this.value.first;
          },
          enumerable: !1,
          configurable: !0
        }), Object.defineProperty(l.prototype, "second", {
          get: function() {
            return this.value.second;
          },
          set: function(c) {
            this.value.second = c;
          },
          enumerable: !1,
          configurable: !0
        }), l;
      }(i.ListIterator);
      u.Iterator = s;
      var f = function(h) {
        t(l, h);
        function l() {
          return h !== null && h.apply(this, arguments) || this;
        }
        return l.prototype._Create_neighbor = function(c) {
          return new l(c);
        }, Object.defineProperty(l.prototype, "first", {
          get: function() {
            return this.base_.first;
          },
          enumerable: !1,
          configurable: !0
        }), Object.defineProperty(l.prototype, "second", {
          get: function() {
            return this.base_.second;
          },
          set: function(c) {
            this.base_.second = c;
          },
          enumerable: !1,
          configurable: !0
        }), l;
      }(a.ReverseIterator);
      u.ReverseIterator = f;
    }(o = e.MapElementList || (e.MapElementList = {})), e.MapElementList = o;
  }(Nn)), Nn;
}
var er = {}, ko;
function el() {
  if (ko)
    return er;
  ko = 1;
  var e = S && S.__extends || function() {
    var o = function(u, s) {
      return o = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(f, h) {
        f.__proto__ = h;
      } || function(f, h) {
        for (var l in h)
          Object.prototype.hasOwnProperty.call(h, l) && (f[l] = h[l]);
      }, o(u, s);
    };
    return function(u, s) {
      if (typeof s != "function" && s !== null)
        throw new TypeError("Class extends value " + String(s) + " is not a constructor or null");
      o(u, s);
      function f() {
        this.constructor = u;
      }
      u.prototype = s === null ? Object.create(s) : (f.prototype = s.prototype, new f());
    };
  }(), t = S && S.__read || function(o, u) {
    var s = typeof Symbol == "function" && o[Symbol.iterator];
    if (!s)
      return o;
    var f = s.call(o), h, l = [], c;
    try {
      for (; (u === void 0 || u-- > 0) && !(h = f.next()).done; )
        l.push(h.value);
    } catch (d) {
      c = { error: d };
    } finally {
      try {
        h && !h.done && (s = f.return) && s.call(f);
      } finally {
        if (c)
          throw c.error;
      }
    }
    return l;
  }, r = S && S.__values || function(o) {
    var u = typeof Symbol == "function" && Symbol.iterator, s = u && o[u], f = 0;
    if (s)
      return s.call(o);
    if (o && typeof o.length == "number")
      return {
        next: function() {
          return o && f >= o.length && (o = void 0), { value: o && o[f++], done: !o };
        }
      };
    throw new TypeError(u ? "Object is not iterable." : "Symbol.iterator is not defined.");
  };
  Object.defineProperty(er, "__esModule", { value: !0 }), er.MapHashBuckets = void 0;
  var n = rs(), i = function(o) {
    e(u, o);
    function u(s, f, h) {
      var l = o.call(this, a, f) || this;
      return l.source_ = s, l.key_eq_ = h, l;
    }
    return u._Swap_source = function(s, f) {
      var h;
      h = t([f.source_, s.source_], 2), s.source_ = h[0], f.source_ = h[1];
    }, u.prototype.key_eq = function() {
      return this.key_eq_;
    }, u.prototype.find = function(s) {
      var f, h, l = this.hash_function()(s) % this.length(), c = this.at(l);
      try {
        for (var d = r(c), p = d.next(); !p.done; p = d.next()) {
          var y = p.value;
          if (this.key_eq_(y.first, s))
            return y;
        }
      } catch (g) {
        f = { error: g };
      } finally {
        try {
          p && !p.done && (h = d.return) && h.call(d);
        } finally {
          if (f)
            throw f.error;
        }
      }
      return this.source_.end();
    }, u;
  }(n.HashBuckets);
  er.MapHashBuckets = i;
  function a(o) {
    return o.first;
  }
  return er;
}
var tr = {}, Lo;
function tl() {
  if (Lo)
    return tr;
  Lo = 1, Object.defineProperty(tr, "__esModule", { value: !0 }), tr.Entry = void 0;
  var e = Oi(), t = Ai(), r = function() {
    function n(i, a) {
      this.first = i, this.second = a;
    }
    return n.prototype.equals = function(i) {
      return (0, t.equal_to)(this.first, i.first);
    }, n.prototype.less = function(i) {
      return (0, t.less)(this.first, i.first);
    }, n.prototype.hashCode = function() {
      return (0, e.hash)(this.first);
    }, n;
  }();
  return tr.Entry = r, tr;
}
var Po;
function rl() {
  return Po || (Po = 1, function(e) {
    var t = S && S.__extends || function() {
      var l = function(c, d) {
        return l = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(p, y) {
          p.__proto__ = y;
        } || function(p, y) {
          for (var g in y)
            Object.prototype.hasOwnProperty.call(y, g) && (p[g] = y[g]);
        }, l(c, d);
      };
      return function(c, d) {
        if (typeof d != "function" && d !== null)
          throw new TypeError("Class extends value " + String(d) + " is not a constructor or null");
        l(c, d);
        function p() {
          this.constructor = c;
        }
        c.prototype = d === null ? Object.create(d) : (p.prototype = d.prototype, new p());
      };
    }(), r = S && S.__read || function(l, c) {
      var d = typeof Symbol == "function" && l[Symbol.iterator];
      if (!d)
        return l;
      var p = d.call(l), y, g = [], x;
      try {
        for (; (c === void 0 || c-- > 0) && !(y = p.next()).done; )
          g.push(y.value);
      } catch (E) {
        x = { error: E };
      } finally {
        try {
          y && !y.done && (d = p.return) && d.call(p);
        } finally {
          if (x)
            throw x.error;
        }
      }
      return g;
    }, n = S && S.__spreadArray || function(l, c, d) {
      if (d || arguments.length === 2)
        for (var p = 0, y = c.length, g; p < y; p++)
          (g || !(p in c)) && (g || (g = Array.prototype.slice.call(c, 0, p)), g[p] = c[p]);
      return l.concat(g || Array.prototype.slice.call(c));
    };
    Object.defineProperty(e, "__esModule", { value: !0 }), e.HashMap = void 0;
    var i = Qf(), a = Ja(), o = Jf(), u = el(), s = tl(), f = ns(), h = function(l) {
      t(c, l);
      function c() {
        for (var d = [], p = 0; p < arguments.length; p++)
          d[p] = arguments[p];
        var y = l.call(this, function(g) {
          return new o.MapElementList(g);
        }) || this;
        return a.IHashContainer.construct.apply(a.IHashContainer, n([
          y,
          c,
          function(g, x) {
            y.buckets_ = new u.MapHashBuckets(y, g, x);
          }
        ], r(d), !1)), y;
      }
      return c.prototype.clear = function() {
        this.buckets_.clear(), l.prototype.clear.call(this);
      }, c.prototype.swap = function(d) {
        var p, y;
        p = r([d.data_, this.data_], 2), this.data_ = p[0], d.data_ = p[1], o.MapElementList._Swap_associative(this.data_, d.data_), u.MapHashBuckets._Swap_source(this.buckets_, d.buckets_), y = r([d.buckets_, this.buckets_], 2), this.buckets_ = y[0], d.buckets_ = y[1];
      }, c.prototype.find = function(d) {
        return this.buckets_.find(d);
      }, c.prototype.begin = function(d) {
        return d === void 0 && (d = null), d === null ? l.prototype.begin.call(this) : this.buckets_.at(d)[0];
      }, c.prototype.end = function(d) {
        if (d === void 0 && (d = null), d === null)
          return l.prototype.end.call(this);
        var p = this.buckets_.at(d);
        return p[p.length - 1].next();
      }, c.prototype.rbegin = function(d) {
        return d === void 0 && (d = null), this.end(d).reverse();
      }, c.prototype.rend = function(d) {
        return d === void 0 && (d = null), this.begin(d).reverse();
      }, c.prototype.bucket_count = function() {
        return this.buckets_.length();
      }, c.prototype.bucket_size = function(d) {
        return this.buckets_.at(d).length;
      }, c.prototype.load_factor = function() {
        return this.buckets_.load_factor();
      }, c.prototype.hash_function = function() {
        return this.buckets_.hash_function();
      }, c.prototype.key_eq = function() {
        return this.buckets_.key_eq();
      }, c.prototype.bucket = function(d) {
        return this.hash_function()(d) % this.buckets_.length();
      }, c.prototype.max_load_factor = function(d) {
        return d === void 0 && (d = null), this.buckets_.max_load_factor(d);
      }, c.prototype.reserve = function(d) {
        this.buckets_.reserve(d);
      }, c.prototype.rehash = function(d) {
        this.buckets_.rehash(d);
      }, c.prototype.emplace = function(d, p) {
        var y = this.find(d);
        return y.equals(this.end()) === !1 ? new f.Pair(y, !1) : (this.data_.push(new s.Entry(d, p)), y = y.prev(), this._Handle_insert(y, y.next()), new f.Pair(y, !0));
      }, c.prototype.emplace_hint = function(d, p, y) {
        var g = this.find(p);
        return g.equals(this.end()) === !0 && (g = this.data_.insert(d, new s.Entry(p, y)), this._Handle_insert(g, g.next())), g;
      }, c.prototype._Handle_insert = function(d, p) {
        for (; !d.equals(p); d = d.next())
          this.buckets_.insert(d);
      }, c.prototype._Handle_erase = function(d, p) {
        for (; !d.equals(p); d = d.next())
          this.buckets_.erase(d);
      }, c;
    }(i.UniqueMap);
    e.HashMap = h, function(l) {
      l.Iterator = o.MapElementList.Iterator, l.ReverseIterator = o.MapElementList.ReverseIterator;
    }(h = e.HashMap || (e.HashMap = {})), e.HashMap = h;
  }(Fn)), Fn;
}
var qo;
function nl() {
  if (qo)
    return kr;
  qo = 1;
  var e = S && S.__values || function(i) {
    var a = typeof Symbol == "function" && i[Symbol.iterator], o = 0;
    return a ? a.call(i) : {
      next: function() {
        return i && o >= i.length && (i = void 0), { value: i && i[o++], done: !i };
      }
    };
  };
  Object.defineProperty(kr, "__esModule", { value: !0 });
  var t = Zf(), r = rl(), n = function() {
    function i() {
      this.listeners_ = new r.HashMap(), this.created_at_ = new Date();
    }
    return i.prototype.dispatchEvent = function(a) {
      var o, u, s = this.listeners_.find(a.type);
      if (!s.equals(this.listeners_.end())) {
        a.target = this, a.timeStamp = new Date().getTime() - this.created_at_.getTime();
        try {
          for (var f = e(s.second), h = f.next(); !h.done; h = f.next()) {
            var l = h.value;
            l(a);
          }
        } catch (c) {
          o = { error: c };
        } finally {
          try {
            h && !h.done && (u = f.return) && u.call(f);
          } finally {
            if (o)
              throw o.error;
          }
        }
      }
    }, i.prototype.addEventListener = function(a, o) {
      var u = this.listeners_.find(a);
      u.equals(this.listeners_.end()) && (u = this.listeners_.emplace(a, new t.HashSet()).first), u.second.insert(o);
    }, i.prototype.removeEventListener = function(a, o) {
      var u = this.listeners_.find(a);
      u.equals(this.listeners_.end()) || (u.second.erase(o), u.second.empty() && this.listeners_.erase(u));
    }, i;
  }();
  return kr.EventTarget = n, kr;
}
var Lr = {}, jo;
function fn() {
  if (jo)
    return Lr;
  jo = 1, Object.defineProperty(Lr, "__esModule", { value: !0 });
  var e = function() {
    function t(r, n) {
      this.type = r, n && Object.assign(this, n);
    }
    return t;
  }();
  return Lr.Event = e, Lr;
}
var Pr = {}, Do;
function il() {
  if (Do)
    return Pr;
  Do = 1;
  var e = S && S.__extends || function() {
    var n = function(i, a) {
      return n = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(o, u) {
        o.__proto__ = u;
      } || function(o, u) {
        for (var s in u)
          u.hasOwnProperty(s) && (o[s] = u[s]);
      }, n(i, a);
    };
    return function(i, a) {
      n(i, a);
      function o() {
        this.constructor = i;
      }
      i.prototype = a === null ? Object.create(a) : (o.prototype = a.prototype, new o());
    };
  }();
  Object.defineProperty(Pr, "__esModule", { value: !0 });
  var t = fn(), r = function(n) {
    e(i, n);
    function i(a, o) {
      return n.call(this, a, o) || this;
    }
    return i;
  }(t.Event);
  return Pr.CloseEvent = r, Pr;
}
var qr = {}, Fo;
function ol() {
  if (Fo)
    return qr;
  Fo = 1;
  var e = S && S.__extends || function() {
    var n = function(i, a) {
      return n = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(o, u) {
        o.__proto__ = u;
      } || function(o, u) {
        for (var s in u)
          u.hasOwnProperty(s) && (o[s] = u[s]);
      }, n(i, a);
    };
    return function(i, a) {
      n(i, a);
      function o() {
        this.constructor = i;
      }
      i.prototype = a === null ? Object.create(a) : (o.prototype = a.prototype, new o());
    };
  }();
  Object.defineProperty(qr, "__esModule", { value: !0 });
  var t = fn(), r = function(n) {
    e(i, n);
    function i(a, o) {
      return n.call(this, a, o) || this;
    }
    return i;
  }(t.Event);
  return qr.MessageEvent = r, qr;
}
var jr = {}, No;
function al() {
  if (No)
    return jr;
  No = 1;
  var e = S && S.__extends || function() {
    var n = function(i, a) {
      return n = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(o, u) {
        o.__proto__ = u;
      } || function(o, u) {
        for (var s in u)
          u.hasOwnProperty(s) && (o[s] = u[s]);
      }, n(i, a);
    };
    return function(i, a) {
      n(i, a);
      function o() {
        this.constructor = i;
      }
      i.prototype = a === null ? Object.create(a) : (o.prototype = a.prototype, new o());
    };
  }();
  Object.defineProperty(jr, "__esModule", { value: !0 });
  var t = fn(), r = function(n) {
    e(i, n);
    function i(a, o) {
      return n.call(this, a, o) || this;
    }
    return i;
  }(t.Event);
  return jr.ErrorEvent = r, jr;
}
var Uo;
function sl() {
  return Uo || (Uo = 1, function(e) {
    var t = S && S.__extends || function() {
      var l = function(c, d) {
        return l = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(p, y) {
          p.__proto__ = y;
        } || function(p, y) {
          for (var g in y)
            y.hasOwnProperty(g) && (p[g] = y[g]);
        }, l(c, d);
      };
      return function(c, d) {
        l(c, d);
        function p() {
          this.constructor = c;
        }
        c.prototype = d === null ? Object.create(d) : (p.prototype = d.prototype, new p());
      };
    }(), r = S && S.__assign || function() {
      return r = Object.assign || function(l) {
        for (var c, d = 1, p = arguments.length; d < p; d++) {
          c = arguments[d];
          for (var y in c)
            Object.prototype.hasOwnProperty.call(c, y) && (l[y] = c[y]);
        }
        return l;
      }, r.apply(this, arguments);
    };
    Object.defineProperty(e, "__esModule", { value: !0 });
    var n = Df(), i = nl(), a = fn(), o = il(), u = ol(), s = al(), f = function(l) {
      t(c, l);
      function c(d, p) {
        var y = l.call(this) || this;
        return y.on_ = {}, y.state_ = c.CONNECTING, y.client_ = new n.client(), y.client_.on("connect", y._Handle_connect.bind(y)), y.client_.on("connectFailed", y._Handle_error.bind(y)), typeof p == "string" && (p = [p]), y.client_.connect(d, p), y;
      }
      return c.prototype.close = function(d, p) {
        this.state_ = c.CLOSING, d === void 0 ? this.connection_.sendCloseFrame() : this.connection_.sendCloseFrame(d, p, !0);
      }, c.prototype.send = function(d) {
        if (typeof d.valueOf() == "string")
          this.connection_.sendUTF(d);
        else {
          var p = void 0;
          d instanceof m ? p = d : d instanceof Blob ? p = new m(d, "blob") : d.buffer ? p = new m(d.buffer) : p = new m(d), this.connection_.sendBytes(p);
        }
      }, Object.defineProperty(c.prototype, "url", {
        get: function() {
          return this.client_.url.href;
        },
        enumerable: !0,
        configurable: !0
      }), Object.defineProperty(c.prototype, "protocol", {
        get: function() {
          return this.client_.protocols ? this.client_.protocols[0] : "";
        },
        enumerable: !0,
        configurable: !0
      }), Object.defineProperty(c.prototype, "extensions", {
        get: function() {
          return this.connection_ && this.connection_.extensions ? this.connection_.extensions[0].name : "";
        },
        enumerable: !0,
        configurable: !0
      }), Object.defineProperty(c.prototype, "readyState", {
        get: function() {
          return this.state_;
        },
        enumerable: !0,
        configurable: !0
      }), Object.defineProperty(c.prototype, "bufferedAmount", {
        get: function() {
          return this.connection_.bytesWaitingToFlush;
        },
        enumerable: !0,
        configurable: !0
      }), Object.defineProperty(c.prototype, "binaryType", {
        get: function() {
          return "arraybuffer";
        },
        enumerable: !0,
        configurable: !0
      }), Object.defineProperty(c.prototype, "onopen", {
        get: function() {
          return this.on_.open;
        },
        set: function(d) {
          this._Set_on("open", d);
        },
        enumerable: !0,
        configurable: !0
      }), Object.defineProperty(c.prototype, "onclose", {
        get: function() {
          return this.on_.close;
        },
        set: function(d) {
          this._Set_on("close", d);
        },
        enumerable: !0,
        configurable: !0
      }), Object.defineProperty(c.prototype, "onmessage", {
        get: function() {
          return this.on_.message;
        },
        set: function(d) {
          this._Set_on("message", d);
        },
        enumerable: !0,
        configurable: !0
      }), Object.defineProperty(c.prototype, "onerror", {
        get: function() {
          return this.on_.error;
        },
        set: function(d) {
          this._Set_on("error", d);
        },
        enumerable: !0,
        configurable: !0
      }), c.prototype._Set_on = function(d, p) {
        this.on_[d] && this.removeEventListener(d, this.on_[d]), this.addEventListener(d, p), this.on_[d] = p;
      }, c.prototype._Handle_connect = function(d) {
        this.connection_ = d, this.state_ = c.OPEN, this.connection_.on("message", this._Handle_message.bind(this)), this.connection_.on("error", this._Handle_error.bind(this)), this.connection_.on("close", this._Handle_close.bind(this));
        var p = new a.Event("open", h);
        this.dispatchEvent(p);
      }, c.prototype._Handle_close = function(d, p) {
        var y = new o.CloseEvent("close", r({}, h, { code: d, reason: p }));
        this.state_ = c.CLOSED, this.dispatchEvent(y);
      }, c.prototype._Handle_message = function(d) {
        var p = new u.MessageEvent("message", r({}, h, { data: d.binaryData ? d.binaryData : d.utf8Data }));
        this.dispatchEvent(p);
      }, c.prototype._Handle_error = function(d) {
        var p = new s.ErrorEvent("error", r({}, h, { error: d, message: d.message }));
        this.state_ === c.CONNECTING && (this.state_ = c.CLOSED), this.dispatchEvent(p);
      }, c;
    }(i.EventTarget);
    e.WebSocket = f, function(l) {
      l.CONNECTING = 0, l.OPEN = 1, l.CLOSING = 2, l.CLOSED = 3;
    }(f = e.WebSocket || (e.WebSocket = {})), e.WebSocket = f;
    var h = {
      bubbles: !1,
      cancelable: !1
    };
  }(Cn)), Cn;
}
var ul = wr;
ul.is_node() && (S.WebSocket = sl().WebSocket);
var oe = { exports: {} };
typeof Object.create == "function" ? oe.exports = function(t, r) {
  r && (t.super_ = r, t.prototype = Object.create(r.prototype, {
    constructor: {
      value: t,
      enumerable: !1,
      writable: !0,
      configurable: !0
    }
  }));
} : oe.exports = function(t, r) {
  if (r) {
    t.super_ = r;
    var n = function() {
    };
    n.prototype = r.prototype, t.prototype = new n(), t.prototype.constructor = t;
  }
};
var xe = { exports: {} };
const xr = /* @__PURE__ */ Ei(pf);
/*! safe-buffer. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> */
(function(e, t) {
  var r = xr, n = r.Buffer;
  function i(o, u) {
    for (var s in o)
      u[s] = o[s];
  }
  n.from && n.alloc && n.allocUnsafe && n.allocUnsafeSlow ? e.exports = r : (i(r, t), t.Buffer = a);
  function a(o, u, s) {
    return n(o, u, s);
  }
  a.prototype = Object.create(n.prototype), i(n, a), a.from = function(o, u, s) {
    if (typeof o == "number")
      throw new TypeError("Argument must not be a number");
    return n(o, u, s);
  }, a.alloc = function(o, u, s) {
    if (typeof o != "number")
      throw new TypeError("Argument must be a number");
    var f = n(o);
    return u !== void 0 ? typeof s == "string" ? f.fill(u, s) : f.fill(u) : f.fill(0), f;
  }, a.allocUnsafe = function(o) {
    if (typeof o != "number")
      throw new TypeError("Argument must be a number");
    return n(o);
  }, a.allocUnsafeSlow = function(o) {
    if (typeof o != "number")
      throw new TypeError("Argument must be a number");
    return r.SlowBuffer(o);
  };
})(xe, xe.exports);
var ui = { exports: {} }, P = { exports: {} }, re = P.exports = {}, Pe, qe;
function fi() {
  throw new Error("setTimeout has not been defined");
}
function li() {
  throw new Error("clearTimeout has not been defined");
}
(function() {
  try {
    typeof setTimeout == "function" ? Pe = setTimeout : Pe = fi;
  } catch {
    Pe = fi;
  }
  try {
    typeof clearTimeout == "function" ? qe = clearTimeout : qe = li;
  } catch {
    qe = li;
  }
})();
function is(e) {
  if (Pe === setTimeout)
    return setTimeout(e, 0);
  if ((Pe === fi || !Pe) && setTimeout)
    return Pe = setTimeout, setTimeout(e, 0);
  try {
    return Pe(e, 0);
  } catch {
    try {
      return Pe.call(null, e, 0);
    } catch {
      return Pe.call(this, e, 0);
    }
  }
}
function fl(e) {
  if (qe === clearTimeout)
    return clearTimeout(e);
  if ((qe === li || !qe) && clearTimeout)
    return qe = clearTimeout, clearTimeout(e);
  try {
    return qe(e);
  } catch {
    try {
      return qe.call(null, e);
    } catch {
      return qe.call(this, e);
    }
  }
}
var We = [], xt = !1, nt, Ur = -1;
function ll() {
  !xt || !nt || (xt = !1, nt.length ? We = nt.concat(We) : Ur = -1, We.length && os());
}
function os() {
  if (!xt) {
    var e = is(ll);
    xt = !0;
    for (var t = We.length; t; ) {
      for (nt = We, We = []; ++Ur < t; )
        nt && nt[Ur].run();
      Ur = -1, t = We.length;
    }
    nt = null, xt = !1, fl(e);
  }
}
re.nextTick = function(e) {
  var t = new Array(arguments.length - 1);
  if (arguments.length > 1)
    for (var r = 1; r < arguments.length; r++)
      t[r - 1] = arguments[r];
  We.push(new as(e, t)), We.length === 1 && !xt && is(os);
};
function as(e, t) {
  this.fun = e, this.array = t;
}
as.prototype.run = function() {
  this.fun.apply(null, this.array);
};
re.title = "browser";
re.browser = !0;
re.env = {};
re.argv = [];
re.version = "";
re.versions = {};
function Ge() {
}
re.on = Ge;
re.addListener = Ge;
re.once = Ge;
re.off = Ge;
re.removeListener = Ge;
re.removeAllListeners = Ge;
re.emit = Ge;
re.prependListener = Ge;
re.prependOnceListener = Ge;
re.listeners = function(e) {
  return [];
};
re.binding = function(e) {
  throw new Error("process.binding is not supported");
};
re.cwd = function() {
  return "/";
};
re.chdir = function(e) {
  throw new Error("process.chdir is not supported");
};
re.umask = function() {
  return 0;
};
var Ie = { exports: {} }, mt = typeof Reflect == "object" ? Reflect : null, Ho = mt && typeof mt.apply == "function" ? mt.apply : function(t, r, n) {
  return Function.prototype.apply.call(t, r, n);
}, Hr;
mt && typeof mt.ownKeys == "function" ? Hr = mt.ownKeys : Object.getOwnPropertySymbols ? Hr = function(t) {
  return Object.getOwnPropertyNames(t).concat(Object.getOwnPropertySymbols(t));
} : Hr = function(t) {
  return Object.getOwnPropertyNames(t);
};
function cl(e) {
  console && console.warn && console.warn(e);
}
var ss = Number.isNaN || function(t) {
  return t !== t;
};
function G() {
  G.init.call(this);
}
Ie.exports = G;
Ie.exports.once = _l;
G.EventEmitter = G;
G.prototype._events = void 0;
G.prototype._eventsCount = 0;
G.prototype._maxListeners = void 0;
var $o = 10;
function ln(e) {
  if (typeof e != "function")
    throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof e);
}
Object.defineProperty(G, "defaultMaxListeners", {
  enumerable: !0,
  get: function() {
    return $o;
  },
  set: function(e) {
    if (typeof e != "number" || e < 0 || ss(e))
      throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + e + ".");
    $o = e;
  }
});
G.init = function() {
  (this._events === void 0 || this._events === Object.getPrototypeOf(this)._events) && (this._events = /* @__PURE__ */ Object.create(null), this._eventsCount = 0), this._maxListeners = this._maxListeners || void 0;
};
G.prototype.setMaxListeners = function(t) {
  if (typeof t != "number" || t < 0 || ss(t))
    throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + t + ".");
  return this._maxListeners = t, this;
};
function us(e) {
  return e._maxListeners === void 0 ? G.defaultMaxListeners : e._maxListeners;
}
G.prototype.getMaxListeners = function() {
  return us(this);
};
G.prototype.emit = function(t) {
  for (var r = [], n = 1; n < arguments.length; n++)
    r.push(arguments[n]);
  var i = t === "error", a = this._events;
  if (a !== void 0)
    i = i && a.error === void 0;
  else if (!i)
    return !1;
  if (i) {
    var o;
    if (r.length > 0 && (o = r[0]), o instanceof Error)
      throw o;
    var u = new Error("Unhandled error." + (o ? " (" + o.message + ")" : ""));
    throw u.context = o, u;
  }
  var s = a[t];
  if (s === void 0)
    return !1;
  if (typeof s == "function")
    Ho(s, this, r);
  else
    for (var f = s.length, h = ds(s, f), n = 0; n < f; ++n)
      Ho(h[n], this, r);
  return !0;
};
function fs(e, t, r, n) {
  var i, a, o;
  if (ln(r), a = e._events, a === void 0 ? (a = e._events = /* @__PURE__ */ Object.create(null), e._eventsCount = 0) : (a.newListener !== void 0 && (e.emit(
    "newListener",
    t,
    r.listener ? r.listener : r
  ), a = e._events), o = a[t]), o === void 0)
    o = a[t] = r, ++e._eventsCount;
  else if (typeof o == "function" ? o = a[t] = n ? [r, o] : [o, r] : n ? o.unshift(r) : o.push(r), i = us(e), i > 0 && o.length > i && !o.warned) {
    o.warned = !0;
    var u = new Error("Possible EventEmitter memory leak detected. " + o.length + " " + String(t) + " listeners added. Use emitter.setMaxListeners() to increase limit");
    u.name = "MaxListenersExceededWarning", u.emitter = e, u.type = t, u.count = o.length, cl(u);
  }
  return e;
}
G.prototype.addListener = function(t, r) {
  return fs(this, t, r, !1);
};
G.prototype.on = G.prototype.addListener;
G.prototype.prependListener = function(t, r) {
  return fs(this, t, r, !0);
};
function hl() {
  if (!this.fired)
    return this.target.removeListener(this.type, this.wrapFn), this.fired = !0, arguments.length === 0 ? this.listener.call(this.target) : this.listener.apply(this.target, arguments);
}
function ls(e, t, r) {
  var n = { fired: !1, wrapFn: void 0, target: e, type: t, listener: r }, i = hl.bind(n);
  return i.listener = r, n.wrapFn = i, i;
}
G.prototype.once = function(t, r) {
  return ln(r), this.on(t, ls(this, t, r)), this;
};
G.prototype.prependOnceListener = function(t, r) {
  return ln(r), this.prependListener(t, ls(this, t, r)), this;
};
G.prototype.removeListener = function(t, r) {
  var n, i, a, o, u;
  if (ln(r), i = this._events, i === void 0)
    return this;
  if (n = i[t], n === void 0)
    return this;
  if (n === r || n.listener === r)
    --this._eventsCount === 0 ? this._events = /* @__PURE__ */ Object.create(null) : (delete i[t], i.removeListener && this.emit("removeListener", t, n.listener || r));
  else if (typeof n != "function") {
    for (a = -1, o = n.length - 1; o >= 0; o--)
      if (n[o] === r || n[o].listener === r) {
        u = n[o].listener, a = o;
        break;
      }
    if (a < 0)
      return this;
    a === 0 ? n.shift() : dl(n, a), n.length === 1 && (i[t] = n[0]), i.removeListener !== void 0 && this.emit("removeListener", t, u || r);
  }
  return this;
};
G.prototype.off = G.prototype.removeListener;
G.prototype.removeAllListeners = function(t) {
  var r, n, i;
  if (n = this._events, n === void 0)
    return this;
  if (n.removeListener === void 0)
    return arguments.length === 0 ? (this._events = /* @__PURE__ */ Object.create(null), this._eventsCount = 0) : n[t] !== void 0 && (--this._eventsCount === 0 ? this._events = /* @__PURE__ */ Object.create(null) : delete n[t]), this;
  if (arguments.length === 0) {
    var a = Object.keys(n), o;
    for (i = 0; i < a.length; ++i)
      o = a[i], o !== "removeListener" && this.removeAllListeners(o);
    return this.removeAllListeners("removeListener"), this._events = /* @__PURE__ */ Object.create(null), this._eventsCount = 0, this;
  }
  if (r = n[t], typeof r == "function")
    this.removeListener(t, r);
  else if (r !== void 0)
    for (i = r.length - 1; i >= 0; i--)
      this.removeListener(t, r[i]);
  return this;
};
function cs(e, t, r) {
  var n = e._events;
  if (n === void 0)
    return [];
  var i = n[t];
  return i === void 0 ? [] : typeof i == "function" ? r ? [i.listener || i] : [i] : r ? pl(i) : ds(i, i.length);
}
G.prototype.listeners = function(t) {
  return cs(this, t, !0);
};
G.prototype.rawListeners = function(t) {
  return cs(this, t, !1);
};
G.listenerCount = function(e, t) {
  return typeof e.listenerCount == "function" ? e.listenerCount(t) : hs.call(e, t);
};
G.prototype.listenerCount = hs;
function hs(e) {
  var t = this._events;
  if (t !== void 0) {
    var r = t[e];
    if (typeof r == "function")
      return 1;
    if (r !== void 0)
      return r.length;
  }
  return 0;
}
G.prototype.eventNames = function() {
  return this._eventsCount > 0 ? Hr(this._events) : [];
};
function ds(e, t) {
  for (var r = new Array(t), n = 0; n < t; ++n)
    r[n] = e[n];
  return r;
}
function dl(e, t) {
  for (; t + 1 < e.length; t++)
    e[t] = e[t + 1];
  e.pop();
}
function pl(e) {
  for (var t = new Array(e.length), r = 0; r < t.length; ++r)
    t[r] = e[r].listener || e[r];
  return t;
}
function _l(e, t) {
  return new Promise(function(r, n) {
    function i(o) {
      e.removeListener(t, a), n(o);
    }
    function a() {
      typeof e.removeListener == "function" && e.removeListener("error", i), r([].slice.call(arguments));
    }
    ps(e, t, a, { once: !0 }), t !== "error" && vl(e, i, { once: !0 });
  });
}
function vl(e, t, r) {
  typeof e.on == "function" && ps(e, "error", t, r);
}
function ps(e, t, r, n) {
  if (typeof e.on == "function")
    n.once ? e.once(t, r) : e.on(t, r);
  else if (typeof e.addEventListener == "function")
    e.addEventListener(t, function i(a) {
      n.once && e.removeEventListener(t, i), r(a);
    });
  else
    throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + typeof e);
}
var _s = Ie.exports.EventEmitter, ci;
typeof Object.create == "function" ? ci = function(t, r) {
  t.super_ = r, t.prototype = Object.create(r.prototype, {
    constructor: {
      value: t,
      enumerable: !1,
      writable: !0,
      configurable: !0
    }
  });
} : ci = function(t, r) {
  t.super_ = r;
  var n = function() {
  };
  n.prototype = r.prototype, t.prototype = new n(), t.prototype.constructor = t;
};
const Qe = ci;
var yl = /%[sdj%]/g;
function cn(e) {
  if (!Er(e)) {
    for (var t = [], r = 0; r < arguments.length; r++)
      t.push(Fe(arguments[r]));
    return t.join(" ");
  }
  for (var r = 1, n = arguments, i = n.length, a = String(e).replace(yl, function(u) {
    if (u === "%%")
      return "%";
    if (r >= i)
      return u;
    switch (u) {
      case "%s":
        return String(n[r++]);
      case "%d":
        return Number(n[r++]);
      case "%j":
        try {
          return JSON.stringify(n[r++]);
        } catch {
          return "[Circular]";
        }
      default:
        return u;
    }
  }), o = n[r]; r < i; o = n[++r])
    mr(o) || !ut(o) ? a += " " + o : a += " " + Fe(o);
  return a;
}
function hn(e, t) {
  if (De(ai.process))
    return function() {
      return hn(e, t).apply(this, arguments);
    };
  if (P.exports.noDeprecation === !0)
    return e;
  var r = !1;
  function n() {
    if (!r) {
      if (P.exports.throwDeprecation)
        throw new Error(t);
      P.exports.traceDeprecation ? console.trace(t) : console.error(t), r = !0;
    }
    return e.apply(this, arguments);
  }
  return n;
}
var Dr = {}, Un;
function Ti(e) {
  if (De(Un) && (Un = P.exports.env.NODE_DEBUG || ""), e = e.toUpperCase(), !Dr[e])
    if (new RegExp("\\b" + e + "\\b", "i").test(Un)) {
      var t = 0;
      Dr[e] = function() {
        var r = cn.apply(null, arguments);
        console.error("%s %d: %s", e, t, r);
      };
    } else
      Dr[e] = function() {
      };
  return Dr[e];
}
function Fe(e, t) {
  var r = {
    seen: [],
    stylize: bl
  };
  return arguments.length >= 3 && (r.depth = arguments[2]), arguments.length >= 4 && (r.colors = arguments[3]), dn(t) ? r.showHidden = t : t && ki(r, t), De(r.showHidden) && (r.showHidden = !1), De(r.depth) && (r.depth = 2), De(r.colors) && (r.colors = !1), De(r.customInspect) && (r.customInspect = !0), r.colors && (r.stylize = gl), Xr(r, e, r.depth);
}
Fe.colors = {
  bold: [1, 22],
  italic: [3, 23],
  underline: [4, 24],
  inverse: [7, 27],
  white: [37, 39],
  grey: [90, 39],
  black: [30, 39],
  blue: [34, 39],
  cyan: [36, 39],
  green: [32, 39],
  magenta: [35, 39],
  red: [31, 39],
  yellow: [33, 39]
};
Fe.styles = {
  special: "cyan",
  number: "yellow",
  boolean: "yellow",
  undefined: "grey",
  null: "bold",
  string: "green",
  date: "magenta",
  regexp: "red"
};
function gl(e, t) {
  var r = Fe.styles[t];
  return r ? "\x1B[" + Fe.colors[r][0] + "m" + e + "\x1B[" + Fe.colors[r][1] + "m" : e;
}
function bl(e, t) {
  return e;
}
function wl(e) {
  var t = {};
  return e.forEach(function(r, n) {
    t[r] = !0;
  }), t;
}
function Xr(e, t, r) {
  if (e.customInspect && t && pr(t.inspect) && t.inspect !== Fe && !(t.constructor && t.constructor.prototype === t)) {
    var n = t.inspect(r, e);
    return Er(n) || (n = Xr(e, n, r)), n;
  }
  var i = xl(e, t);
  if (i)
    return i;
  var a = Object.keys(t), o = wl(a);
  if (e.showHidden && (a = Object.getOwnPropertyNames(t)), dr(t) && (a.indexOf("message") >= 0 || a.indexOf("description") >= 0))
    return Hn(t);
  if (a.length === 0) {
    if (pr(t)) {
      var u = t.name ? ": " + t.name : "";
      return e.stylize("[Function" + u + "]", "special");
    }
    if (hr(t))
      return e.stylize(RegExp.prototype.toString.call(t), "regexp");
    if (Qr(t))
      return e.stylize(Date.prototype.toString.call(t), "date");
    if (dr(t))
      return Hn(t);
  }
  var s = "", f = !1, h = ["{", "}"];
  if (Ci(t) && (f = !0, h = ["[", "]"]), pr(t)) {
    var l = t.name ? ": " + t.name : "";
    s = " [Function" + l + "]";
  }
  if (hr(t) && (s = " " + RegExp.prototype.toString.call(t)), Qr(t) && (s = " " + Date.prototype.toUTCString.call(t)), dr(t) && (s = " " + Hn(t)), a.length === 0 && (!f || t.length == 0))
    return h[0] + s + h[1];
  if (r < 0)
    return hr(t) ? e.stylize(RegExp.prototype.toString.call(t), "regexp") : e.stylize("[Object]", "special");
  e.seen.push(t);
  var c;
  return f ? c = ml(e, t, r, o, a) : c = a.map(function(d) {
    return hi(e, t, r, o, d, f);
  }), e.seen.pop(), El(c, s, h);
}
function xl(e, t) {
  if (De(t))
    return e.stylize("undefined", "undefined");
  if (Er(t)) {
    var r = "'" + JSON.stringify(t).replace(/^"|"$/g, "").replace(/'/g, "\\'").replace(/\\"/g, '"') + "'";
    return e.stylize(r, "string");
  }
  if (Mi(t))
    return e.stylize("" + t, "number");
  if (dn(t))
    return e.stylize("" + t, "boolean");
  if (mr(t))
    return e.stylize("null", "null");
}
function Hn(e) {
  return "[" + Error.prototype.toString.call(e) + "]";
}
function ml(e, t, r, n, i) {
  for (var a = [], o = 0, u = t.length; o < u; ++o)
    xs(t, String(o)) ? a.push(hi(
      e,
      t,
      r,
      n,
      String(o),
      !0
    )) : a.push("");
  return i.forEach(function(s) {
    s.match(/^\d+$/) || a.push(hi(
      e,
      t,
      r,
      n,
      s,
      !0
    ));
  }), a;
}
function hi(e, t, r, n, i, a) {
  var o, u, s;
  if (s = Object.getOwnPropertyDescriptor(t, i) || { value: t[i] }, s.get ? s.set ? u = e.stylize("[Getter/Setter]", "special") : u = e.stylize("[Getter]", "special") : s.set && (u = e.stylize("[Setter]", "special")), xs(n, i) || (o = "[" + i + "]"), u || (e.seen.indexOf(s.value) < 0 ? (mr(r) ? u = Xr(e, s.value, null) : u = Xr(e, s.value, r - 1), u.indexOf(`
`) > -1 && (a ? u = u.split(`
`).map(function(f) {
    return "  " + f;
  }).join(`
`).substr(2) : u = `
` + u.split(`
`).map(function(f) {
    return "   " + f;
  }).join(`
`))) : u = e.stylize("[Circular]", "special")), De(o)) {
    if (a && i.match(/^\d+$/))
      return u;
    o = JSON.stringify("" + i), o.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/) ? (o = o.substr(1, o.length - 2), o = e.stylize(o, "name")) : (o = o.replace(/'/g, "\\'").replace(/\\"/g, '"').replace(/(^"|"$)/g, "'"), o = e.stylize(o, "string"));
  }
  return o + ": " + u;
}
function El(e, t, r) {
  var n = e.reduce(function(i, a) {
    return a.indexOf(`
`) >= 0, i + a.replace(/\u001b\[\d\d?m/g, "").length + 1;
  }, 0);
  return n > 60 ? r[0] + (t === "" ? "" : t + `
 `) + " " + e.join(`,
  `) + " " + r[1] : r[0] + t + " " + e.join(", ") + " " + r[1];
}
function Ci(e) {
  return Array.isArray(e);
}
function dn(e) {
  return typeof e == "boolean";
}
function mr(e) {
  return e === null;
}
function vs(e) {
  return e == null;
}
function Mi(e) {
  return typeof e == "number";
}
function Er(e) {
  return typeof e == "string";
}
function ys(e) {
  return typeof e == "symbol";
}
function De(e) {
  return e === void 0;
}
function hr(e) {
  return ut(e) && Bi(e) === "[object RegExp]";
}
function ut(e) {
  return typeof e == "object" && e !== null;
}
function Qr(e) {
  return ut(e) && Bi(e) === "[object Date]";
}
function dr(e) {
  return ut(e) && (Bi(e) === "[object Error]" || e instanceof Error);
}
function pr(e) {
  return typeof e == "function";
}
function gs(e) {
  return e === null || typeof e == "boolean" || typeof e == "number" || typeof e == "string" || typeof e == "symbol" || typeof e > "u";
}
function bs(e) {
  return m.isBuffer(e);
}
function Bi(e) {
  return Object.prototype.toString.call(e);
}
function $n(e) {
  return e < 10 ? "0" + e.toString(10) : e.toString(10);
}
var Sl = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec"
];
function Rl() {
  var e = new Date(), t = [
    $n(e.getHours()),
    $n(e.getMinutes()),
    $n(e.getSeconds())
  ].join(":");
  return [e.getDate(), Sl[e.getMonth()], t].join(" ");
}
function ws() {
  console.log("%s - %s", Rl(), cn.apply(null, arguments));
}
function ki(e, t) {
  if (!t || !ut(t))
    return e;
  for (var r = Object.keys(t), n = r.length; n--; )
    e[r[n]] = t[r[n]];
  return e;
}
function xs(e, t) {
  return Object.prototype.hasOwnProperty.call(e, t);
}
const Ol = {
  inherits: Qe,
  _extend: ki,
  log: ws,
  isBuffer: bs,
  isPrimitive: gs,
  isFunction: pr,
  isError: dr,
  isDate: Qr,
  isObject: ut,
  isRegExp: hr,
  isUndefined: De,
  isSymbol: ys,
  isString: Er,
  isNumber: Mi,
  isNullOrUndefined: vs,
  isNull: mr,
  isBoolean: dn,
  isArray: Ci,
  inspect: Fe,
  deprecate: hn,
  format: cn,
  debuglog: Ti
}, Al = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  format: cn,
  deprecate: hn,
  debuglog: Ti,
  inspect: Fe,
  isArray: Ci,
  isBoolean: dn,
  isNull: mr,
  isNullOrUndefined: vs,
  isNumber: Mi,
  isString: Er,
  isSymbol: ys,
  isUndefined: De,
  isRegExp: hr,
  isObject: ut,
  isDate: Qr,
  isError: dr,
  isFunction: pr,
  isPrimitive: gs,
  isBuffer: bs,
  log: ws,
  inherits: Qe,
  _extend: ki,
  default: Ol
}, Symbol.toStringTag, { value: "Module" })), ms = /* @__PURE__ */ Ei(Al);
var Wn, Wo;
function Il() {
  if (Wo)
    return Wn;
  Wo = 1;
  function e(c, d) {
    var p = Object.keys(c);
    if (Object.getOwnPropertySymbols) {
      var y = Object.getOwnPropertySymbols(c);
      d && (y = y.filter(function(g) {
        return Object.getOwnPropertyDescriptor(c, g).enumerable;
      })), p.push.apply(p, y);
    }
    return p;
  }
  function t(c) {
    for (var d = 1; d < arguments.length; d++) {
      var p = arguments[d] != null ? arguments[d] : {};
      d % 2 ? e(Object(p), !0).forEach(function(y) {
        r(c, y, p[y]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(c, Object.getOwnPropertyDescriptors(p)) : e(Object(p)).forEach(function(y) {
        Object.defineProperty(c, y, Object.getOwnPropertyDescriptor(p, y));
      });
    }
    return c;
  }
  function r(c, d, p) {
    return d in c ? Object.defineProperty(c, d, { value: p, enumerable: !0, configurable: !0, writable: !0 }) : c[d] = p, c;
  }
  function n(c, d) {
    if (!(c instanceof d))
      throw new TypeError("Cannot call a class as a function");
  }
  function i(c, d) {
    for (var p = 0; p < d.length; p++) {
      var y = d[p];
      y.enumerable = y.enumerable || !1, y.configurable = !0, "value" in y && (y.writable = !0), Object.defineProperty(c, y.key, y);
    }
  }
  function a(c, d, p) {
    return d && i(c.prototype, d), p && i(c, p), c;
  }
  var o = xr, u = o.Buffer, s = ms, f = s.inspect, h = f && f.custom || "inspect";
  function l(c, d, p) {
    u.prototype.copy.call(c, d, p);
  }
  return Wn = /* @__PURE__ */ function() {
    function c() {
      n(this, c), this.head = null, this.tail = null, this.length = 0;
    }
    return a(c, [{
      key: "push",
      value: function(p) {
        var y = {
          data: p,
          next: null
        };
        this.length > 0 ? this.tail.next = y : this.head = y, this.tail = y, ++this.length;
      }
    }, {
      key: "unshift",
      value: function(p) {
        var y = {
          data: p,
          next: this.head
        };
        this.length === 0 && (this.tail = y), this.head = y, ++this.length;
      }
    }, {
      key: "shift",
      value: function() {
        if (this.length !== 0) {
          var p = this.head.data;
          return this.length === 1 ? this.head = this.tail = null : this.head = this.head.next, --this.length, p;
        }
      }
    }, {
      key: "clear",
      value: function() {
        this.head = this.tail = null, this.length = 0;
      }
    }, {
      key: "join",
      value: function(p) {
        if (this.length === 0)
          return "";
        for (var y = this.head, g = "" + y.data; y = y.next; )
          g += p + y.data;
        return g;
      }
    }, {
      key: "concat",
      value: function(p) {
        if (this.length === 0)
          return u.alloc(0);
        for (var y = u.allocUnsafe(p >>> 0), g = this.head, x = 0; g; )
          l(g.data, y, x), x += g.data.length, g = g.next;
        return y;
      }
    }, {
      key: "consume",
      value: function(p, y) {
        var g;
        return p < this.head.data.length ? (g = this.head.data.slice(0, p), this.head.data = this.head.data.slice(p)) : p === this.head.data.length ? g = this.shift() : g = y ? this._getString(p) : this._getBuffer(p), g;
      }
    }, {
      key: "first",
      value: function() {
        return this.head.data;
      }
    }, {
      key: "_getString",
      value: function(p) {
        var y = this.head, g = 1, x = y.data;
        for (p -= x.length; y = y.next; ) {
          var E = y.data, I = p > E.length ? E.length : p;
          if (I === E.length ? x += E : x += E.slice(0, p), p -= I, p === 0) {
            I === E.length ? (++g, y.next ? this.head = y.next : this.head = this.tail = null) : (this.head = y, y.data = E.slice(I));
            break;
          }
          ++g;
        }
        return this.length -= g, x;
      }
    }, {
      key: "_getBuffer",
      value: function(p) {
        var y = u.allocUnsafe(p), g = this.head, x = 1;
        for (g.data.copy(y), p -= g.data.length; g = g.next; ) {
          var E = g.data, I = p > E.length ? E.length : p;
          if (E.copy(y, y.length - p, 0, I), p -= I, p === 0) {
            I === E.length ? (++x, g.next ? this.head = g.next : this.head = this.tail = null) : (this.head = g, g.data = E.slice(I));
            break;
          }
          ++x;
        }
        return this.length -= x, y;
      }
    }, {
      key: h,
      value: function(p, y) {
        return f(this, t({}, y, {
          depth: 0,
          customInspect: !1
        }));
      }
    }]), c;
  }(), Wn;
}
function Tl(e, t) {
  var r = this, n = this._readableState && this._readableState.destroyed, i = this._writableState && this._writableState.destroyed;
  return n || i ? (t ? t(e) : e && (this._writableState ? this._writableState.errorEmitted || (this._writableState.errorEmitted = !0, P.exports.nextTick(di, this, e)) : P.exports.nextTick(di, this, e)), this) : (this._readableState && (this._readableState.destroyed = !0), this._writableState && (this._writableState.destroyed = !0), this._destroy(e || null, function(a) {
    !t && a ? r._writableState ? r._writableState.errorEmitted ? P.exports.nextTick($r, r) : (r._writableState.errorEmitted = !0, P.exports.nextTick(zo, r, a)) : P.exports.nextTick(zo, r, a) : t ? (P.exports.nextTick($r, r), t(a)) : P.exports.nextTick($r, r);
  }), this);
}
function zo(e, t) {
  di(e, t), $r(e);
}
function $r(e) {
  e._writableState && !e._writableState.emitClose || e._readableState && !e._readableState.emitClose || e.emit("close");
}
function Cl() {
  this._readableState && (this._readableState.destroyed = !1, this._readableState.reading = !1, this._readableState.ended = !1, this._readableState.endEmitted = !1), this._writableState && (this._writableState.destroyed = !1, this._writableState.ended = !1, this._writableState.ending = !1, this._writableState.finalCalled = !1, this._writableState.prefinished = !1, this._writableState.finished = !1, this._writableState.errorEmitted = !1);
}
function di(e, t) {
  e.emit("error", t);
}
function Ml(e, t) {
  var r = e._readableState, n = e._writableState;
  r && r.autoDestroy || n && n.autoDestroy ? e.destroy(t) : e.emit("error", t);
}
var Es = {
  destroy: Tl,
  undestroy: Cl,
  errorOrDestroy: Ml
}, ft = {};
function Bl(e, t) {
  e.prototype = Object.create(t.prototype), e.prototype.constructor = e, e.__proto__ = t;
}
var Ss = {};
function Te(e, t, r) {
  r || (r = Error);
  function n(a, o, u) {
    return typeof t == "string" ? t : t(a, o, u);
  }
  var i = /* @__PURE__ */ function(a) {
    Bl(o, a);
    function o(u, s, f) {
      return a.call(this, n(u, s, f)) || this;
    }
    return o;
  }(r);
  i.prototype.name = r.name, i.prototype.code = e, Ss[e] = i;
}
function Go(e, t) {
  if (Array.isArray(e)) {
    var r = e.length;
    return e = e.map(function(n) {
      return String(n);
    }), r > 2 ? "one of ".concat(t, " ").concat(e.slice(0, r - 1).join(", "), ", or ") + e[r - 1] : r === 2 ? "one of ".concat(t, " ").concat(e[0], " or ").concat(e[1]) : "of ".concat(t, " ").concat(e[0]);
  } else
    return "of ".concat(t, " ").concat(String(e));
}
function kl(e, t, r) {
  return e.substr(!r || r < 0 ? 0 : +r, t.length) === t;
}
function Ll(e, t, r) {
  return (r === void 0 || r > e.length) && (r = e.length), e.substring(r - t.length, r) === t;
}
function Pl(e, t, r) {
  return typeof r != "number" && (r = 0), r + t.length > e.length ? !1 : e.indexOf(t, r) !== -1;
}
Te("ERR_INVALID_OPT_VALUE", function(e, t) {
  return 'The value "' + t + '" is invalid for option "' + e + '"';
}, TypeError);
Te("ERR_INVALID_ARG_TYPE", function(e, t, r) {
  var n;
  typeof t == "string" && kl(t, "not ") ? (n = "must not be", t = t.replace(/^not /, "")) : n = "must be";
  var i;
  if (Ll(e, " argument"))
    i = "The ".concat(e, " ").concat(n, " ").concat(Go(t, "type"));
  else {
    var a = Pl(e, ".") ? "property" : "argument";
    i = 'The "'.concat(e, '" ').concat(a, " ").concat(n, " ").concat(Go(t, "type"));
  }
  return i += ". Received type ".concat(typeof r), i;
}, TypeError);
Te("ERR_STREAM_PUSH_AFTER_EOF", "stream.push() after EOF");
Te("ERR_METHOD_NOT_IMPLEMENTED", function(e) {
  return "The " + e + " method is not implemented";
});
Te("ERR_STREAM_PREMATURE_CLOSE", "Premature close");
Te("ERR_STREAM_DESTROYED", function(e) {
  return "Cannot call " + e + " after a stream was destroyed";
});
Te("ERR_MULTIPLE_CALLBACK", "Callback called multiple times");
Te("ERR_STREAM_CANNOT_PIPE", "Cannot pipe, not readable");
Te("ERR_STREAM_WRITE_AFTER_END", "write after end");
Te("ERR_STREAM_NULL_VALUES", "May not write null values to stream", TypeError);
Te("ERR_UNKNOWN_ENCODING", function(e) {
  return "Unknown encoding: " + e;
}, TypeError);
Te("ERR_STREAM_UNSHIFT_AFTER_END_EVENT", "stream.unshift() after end event");
ft.codes = Ss;
var ql = ft.codes.ERR_INVALID_OPT_VALUE;
function jl(e, t, r) {
  return e.highWaterMark != null ? e.highWaterMark : t ? e[r] : null;
}
function Dl(e, t, r, n) {
  var i = jl(t, n, r);
  if (i != null) {
    if (!(isFinite(i) && Math.floor(i) === i) || i < 0) {
      var a = n ? r : "highWaterMark";
      throw new ql(a, i);
    }
    return Math.floor(i);
  }
  return e.objectMode ? 16 : 16 * 1024;
}
var Rs = {
  getHighWaterMark: Dl
}, Fl = Nl;
function Nl(e, t) {
  if (zn("noDeprecation"))
    return e;
  var r = !1;
  function n() {
    if (!r) {
      if (zn("throwDeprecation"))
        throw new Error(t);
      zn("traceDeprecation") ? console.trace(t) : console.warn(t), r = !0;
    }
    return e.apply(this, arguments);
  }
  return n;
}
function zn(e) {
  try {
    if (!S.localStorage)
      return !1;
  } catch {
    return !1;
  }
  var t = S.localStorage[e];
  return t == null ? !1 : String(t).toLowerCase() === "true";
}
var Gn, Yo;
function Os() {
  if (Yo)
    return Gn;
  Yo = 1, Gn = q;
  function e(w) {
    var b = this;
    this.next = null, this.entry = null, this.finish = function() {
      _t(b, w);
    };
  }
  var t;
  q.WritableState = j;
  var r = {
    deprecate: Fl
  }, n = _s, i = xr.Buffer, a = S.Uint8Array || function() {
  };
  function o(w) {
    return i.from(w);
  }
  function u(w) {
    return i.isBuffer(w) || w instanceof a;
  }
  var s = Es, f = Rs, h = f.getHighWaterMark, l = ft.codes, c = l.ERR_INVALID_ARG_TYPE, d = l.ERR_METHOD_NOT_IMPLEMENTED, p = l.ERR_MULTIPLE_CALLBACK, y = l.ERR_STREAM_CANNOT_PIPE, g = l.ERR_STREAM_DESTROYED, x = l.ERR_STREAM_NULL_VALUES, E = l.ERR_STREAM_WRITE_AFTER_END, I = l.ERR_UNKNOWN_ENCODING, R = s.errorOrDestroy;
  oe.exports(q, n);
  function L() {
  }
  function j(w, b, A) {
    t = t || Rt(), w = w || {}, typeof A != "boolean" && (A = b instanceof t), this.objectMode = !!w.objectMode, A && (this.objectMode = this.objectMode || !!w.writableObjectMode), this.highWaterMark = h(this, w, "writableHighWaterMark", A), this.finalCalled = !1, this.needDrain = !1, this.ending = !1, this.ended = !1, this.finished = !1, this.destroyed = !1;
    var B = w.decodeStrings === !1;
    this.decodeStrings = !B, this.defaultEncoding = w.defaultEncoding || "utf8", this.length = 0, this.writing = !1, this.corked = 0, this.sync = !0, this.bufferProcessing = !1, this.onwrite = function(N) {
      Ye(b, N);
    }, this.writecb = null, this.writelen = 0, this.bufferedRequest = null, this.lastBufferedRequest = null, this.pendingcb = 0, this.prefinished = !1, this.errorEmitted = !1, this.emitClose = w.emitClose !== !1, this.autoDestroy = !!w.autoDestroy, this.bufferedRequestCount = 0, this.corkedRequestsFree = new e(this);
  }
  j.prototype.getBuffer = function() {
    for (var b = this.bufferedRequest, A = []; b; )
      A.push(b), b = b.next;
    return A;
  }, function() {
    try {
      Object.defineProperty(j.prototype, "buffer", {
        get: r.deprecate(function() {
          return this.getBuffer();
        }, "_writableState.buffer is deprecated. Use _writableState.getBuffer instead.", "DEP0003")
      });
    } catch {
    }
  }();
  var U;
  typeof Symbol == "function" && Symbol.hasInstance && typeof Function.prototype[Symbol.hasInstance] == "function" ? (U = Function.prototype[Symbol.hasInstance], Object.defineProperty(q, Symbol.hasInstance, {
    value: function(b) {
      return U.call(this, b) ? !0 : this !== q ? !1 : b && b._writableState instanceof j;
    }
  })) : U = function(b) {
    return b instanceof this;
  };
  function q(w) {
    t = t || Rt();
    var b = this instanceof t;
    if (!b && !U.call(q, this))
      return new q(w);
    this._writableState = new j(w, this, b), this.writable = !0, w && (typeof w.write == "function" && (this._write = w.write), typeof w.writev == "function" && (this._writev = w.writev), typeof w.destroy == "function" && (this._destroy = w.destroy), typeof w.final == "function" && (this._final = w.final)), n.call(this);
  }
  q.prototype.pipe = function() {
    R(this, new y());
  };
  function k(w, b) {
    var A = new E();
    R(w, A), P.exports.nextTick(b, A);
  }
  function de(w, b, A, B) {
    var N;
    return A === null ? N = new x() : typeof A != "string" && !b.objectMode && (N = new c("chunk", ["string", "Buffer"], A)), N ? (R(w, N), P.exports.nextTick(B, N), !1) : !0;
  }
  q.prototype.write = function(w, b, A) {
    var B = this._writableState, N = !1, _ = !B.objectMode && u(w);
    return _ && !i.isBuffer(w) && (w = o(w)), typeof b == "function" && (A = b, b = null), _ ? b = "buffer" : b || (b = B.defaultEncoding), typeof A != "function" && (A = L), B.ending ? k(this, A) : (_ || de(this, B, w, A)) && (B.pendingcb++, N = ne(this, B, _, w, b, A)), N;
  }, q.prototype.cork = function() {
    this._writableState.corked++;
  }, q.prototype.uncork = function() {
    var w = this._writableState;
    w.corked && (w.corked--, !w.writing && !w.corked && !w.bufferProcessing && w.bufferedRequest && He(this, w));
  }, q.prototype.setDefaultEncoding = function(b) {
    if (typeof b == "string" && (b = b.toLowerCase()), !(["hex", "utf8", "utf-8", "ascii", "binary", "base64", "ucs2", "ucs-2", "utf16le", "utf-16le", "raw"].indexOf((b + "").toLowerCase()) > -1))
      throw new I(b);
    return this._writableState.defaultEncoding = b, this;
  }, Object.defineProperty(q.prototype, "writableBuffer", {
    enumerable: !1,
    get: function() {
      return this._writableState && this._writableState.getBuffer();
    }
  });
  function Z(w, b, A) {
    return !w.objectMode && w.decodeStrings !== !1 && typeof b == "string" && (b = i.from(b, A)), b;
  }
  Object.defineProperty(q.prototype, "writableHighWaterMark", {
    enumerable: !1,
    get: function() {
      return this._writableState.highWaterMark;
    }
  });
  function ne(w, b, A, B, N, _) {
    if (!A) {
      var v = Z(b, B, N);
      B !== v && (A = !0, N = "buffer", B = v);
    }
    var O = b.objectMode ? 1 : B.length;
    b.length += O;
    var C = b.length < b.highWaterMark;
    if (C || (b.needDrain = !0), b.writing || b.corked) {
      var te = b.lastBufferedRequest;
      b.lastBufferedRequest = {
        chunk: B,
        encoding: N,
        isBuf: A,
        callback: _,
        next: null
      }, te ? te.next = b.lastBufferedRequest : b.bufferedRequest = b.lastBufferedRequest, b.bufferedRequestCount += 1;
    } else
      M(w, b, !1, O, B, N, _);
    return C;
  }
  function M(w, b, A, B, N, _, v) {
    b.writelen = B, b.writecb = v, b.writing = !0, b.sync = !0, b.destroyed ? b.onwrite(new g("write")) : A ? w._writev(N, b.onwrite) : w._write(N, _, b.onwrite), b.sync = !1;
  }
  function Y(w, b, A, B, N) {
    --b.pendingcb, A ? (P.exports.nextTick(N, B), P.exports.nextTick(Le, w, b), w._writableState.errorEmitted = !0, R(w, B)) : (N(B), w._writableState.errorEmitted = !0, R(w, B), Le(w, b));
  }
  function z(w) {
    w.writing = !1, w.writecb = null, w.length -= w.writelen, w.writelen = 0;
  }
  function Ye(w, b) {
    var A = w._writableState, B = A.sync, N = A.writecb;
    if (typeof N != "function")
      throw new p();
    if (z(A), b)
      Y(w, A, B, b, N);
    else {
      var _ = dt(A) || w.destroyed;
      !_ && !A.corked && !A.bufferProcessing && A.bufferedRequest && He(w, A), B ? P.exports.nextTick(Ue, w, A, _, N) : Ue(w, A, _, N);
    }
  }
  function Ue(w, b, A, B) {
    A || ht(w, b), b.pendingcb--, B(), Le(w, b);
  }
  function ht(w, b) {
    b.length === 0 && b.needDrain && (b.needDrain = !1, w.emit("drain"));
  }
  function He(w, b) {
    b.bufferProcessing = !0;
    var A = b.bufferedRequest;
    if (w._writev && A && A.next) {
      var B = b.bufferedRequestCount, N = new Array(B), _ = b.corkedRequestsFree;
      _.entry = A;
      for (var v = 0, O = !0; A; )
        N[v] = A, A.isBuf || (O = !1), A = A.next, v += 1;
      N.allBuffers = O, M(w, b, !0, b.length, N, "", _.finish), b.pendingcb++, b.lastBufferedRequest = null, _.next ? (b.corkedRequestsFree = _.next, _.next = null) : b.corkedRequestsFree = new e(b), b.bufferedRequestCount = 0;
    } else {
      for (; A; ) {
        var C = A.chunk, te = A.encoding, F = A.callback, V = b.objectMode ? 1 : C.length;
        if (M(w, b, !1, V, C, te, F), A = A.next, b.bufferedRequestCount--, b.writing)
          break;
      }
      A === null && (b.lastBufferedRequest = null);
    }
    b.bufferedRequest = A, b.bufferProcessing = !1;
  }
  q.prototype._write = function(w, b, A) {
    A(new d("_write()"));
  }, q.prototype._writev = null, q.prototype.end = function(w, b, A) {
    var B = this._writableState;
    return typeof w == "function" ? (A = w, w = null, b = null) : typeof b == "function" && (A = b, b = null), w != null && this.write(w, b), B.corked && (B.corked = 1, this.uncork()), B.ending || Ct(this, B, A), this;
  }, Object.defineProperty(q.prototype, "writableLength", {
    enumerable: !1,
    get: function() {
      return this._writableState.length;
    }
  });
  function dt(w) {
    return w.ending && w.length === 0 && w.bufferedRequest === null && !w.finished && !w.writing;
  }
  function Tt(w, b) {
    w._final(function(A) {
      b.pendingcb--, A && R(w, A), b.prefinished = !0, w.emit("prefinish"), Le(w, b);
    });
  }
  function pt(w, b) {
    !b.prefinished && !b.finalCalled && (typeof w._final == "function" && !b.destroyed ? (b.pendingcb++, b.finalCalled = !0, P.exports.nextTick(Tt, w, b)) : (b.prefinished = !0, w.emit("prefinish")));
  }
  function Le(w, b) {
    var A = dt(b);
    if (A && (pt(w, b), b.pendingcb === 0 && (b.finished = !0, w.emit("finish"), b.autoDestroy))) {
      var B = w._readableState;
      (!B || B.autoDestroy && B.endEmitted) && w.destroy();
    }
    return A;
  }
  function Ct(w, b, A) {
    b.ending = !0, Le(w, b), A && (b.finished ? P.exports.nextTick(A) : w.once("finish", A)), b.ended = !0, w.writable = !1;
  }
  function _t(w, b, A) {
    var B = w.entry;
    for (w.entry = null; B; ) {
      var N = B.callback;
      b.pendingcb--, N(A), B = B.next;
    }
    b.corkedRequestsFree.next = w;
  }
  return Object.defineProperty(q.prototype, "destroyed", {
    enumerable: !1,
    get: function() {
      return this._writableState === void 0 ? !1 : this._writableState.destroyed;
    },
    set: function(b) {
      !this._writableState || (this._writableState.destroyed = b);
    }
  }), q.prototype.destroy = s.destroy, q.prototype._undestroy = s.undestroy, q.prototype._destroy = function(w, b) {
    b(w);
  }, Gn;
}
var Yn, Vo;
function Rt() {
  if (Vo)
    return Yn;
  Vo = 1;
  var e = Object.keys || function(f) {
    var h = [];
    for (var l in f)
      h.push(l);
    return h;
  };
  Yn = o;
  var t = Ts(), r = Os();
  oe.exports(o, t);
  for (var n = e(r.prototype), i = 0; i < n.length; i++) {
    var a = n[i];
    o.prototype[a] || (o.prototype[a] = r.prototype[a]);
  }
  function o(f) {
    if (!(this instanceof o))
      return new o(f);
    t.call(this, f), r.call(this, f), this.allowHalfOpen = !0, f && (f.readable === !1 && (this.readable = !1), f.writable === !1 && (this.writable = !1), f.allowHalfOpen === !1 && (this.allowHalfOpen = !1, this.once("end", u)));
  }
  Object.defineProperty(o.prototype, "writableHighWaterMark", {
    enumerable: !1,
    get: function() {
      return this._writableState.highWaterMark;
    }
  }), Object.defineProperty(o.prototype, "writableBuffer", {
    enumerable: !1,
    get: function() {
      return this._writableState && this._writableState.getBuffer();
    }
  }), Object.defineProperty(o.prototype, "writableLength", {
    enumerable: !1,
    get: function() {
      return this._writableState.length;
    }
  });
  function u() {
    this._writableState.ended || P.exports.nextTick(s, this);
  }
  function s(f) {
    f.end();
  }
  return Object.defineProperty(o.prototype, "destroyed", {
    enumerable: !1,
    get: function() {
      return this._readableState === void 0 || this._writableState === void 0 ? !1 : this._readableState.destroyed && this._writableState.destroyed;
    },
    set: function(h) {
      this._readableState === void 0 || this._writableState === void 0 || (this._readableState.destroyed = h, this._writableState.destroyed = h);
    }
  }), Yn;
}
var Jr = {}, Li = xe.exports.Buffer, Ko = Li.isEncoding || function(e) {
  switch (e = "" + e, e && e.toLowerCase()) {
    case "hex":
    case "utf8":
    case "utf-8":
    case "ascii":
    case "binary":
    case "base64":
    case "ucs2":
    case "ucs-2":
    case "utf16le":
    case "utf-16le":
    case "raw":
      return !0;
    default:
      return !1;
  }
};
function Ul(e) {
  if (!e)
    return "utf8";
  for (var t; ; )
    switch (e) {
      case "utf8":
      case "utf-8":
        return "utf8";
      case "ucs2":
      case "ucs-2":
      case "utf16le":
      case "utf-16le":
        return "utf16le";
      case "latin1":
      case "binary":
        return "latin1";
      case "base64":
      case "ascii":
      case "hex":
        return e;
      default:
        if (t)
          return;
        e = ("" + e).toLowerCase(), t = !0;
    }
}
function Hl(e) {
  var t = Ul(e);
  if (typeof t != "string" && (Li.isEncoding === Ko || !Ko(e)))
    throw new Error("Unknown encoding: " + e);
  return t || e;
}
var As = Jr.StringDecoder = Sr;
function Sr(e) {
  this.encoding = Hl(e);
  var t;
  switch (this.encoding) {
    case "utf16le":
      this.text = Vl, this.end = Kl, t = 4;
      break;
    case "utf8":
      this.fillLast = zl, t = 4;
      break;
    case "base64":
      this.text = Zl, this.end = Xl, t = 3;
      break;
    default:
      this.write = Ql, this.end = Jl;
      return;
  }
  this.lastNeed = 0, this.lastTotal = 0, this.lastChar = Li.allocUnsafe(t);
}
Sr.prototype.write = function(e) {
  if (e.length === 0)
    return "";
  var t, r;
  if (this.lastNeed) {
    if (t = this.fillLast(e), t === void 0)
      return "";
    r = this.lastNeed, this.lastNeed = 0;
  } else
    r = 0;
  return r < e.length ? t ? t + this.text(e, r) : this.text(e, r) : t || "";
};
Sr.prototype.end = Yl;
Sr.prototype.text = Gl;
Sr.prototype.fillLast = function(e) {
  if (this.lastNeed <= e.length)
    return e.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, this.lastNeed), this.lastChar.toString(this.encoding, 0, this.lastTotal);
  e.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, e.length), this.lastNeed -= e.length;
};
function Vn(e) {
  return e <= 127 ? 0 : e >> 5 === 6 ? 2 : e >> 4 === 14 ? 3 : e >> 3 === 30 ? 4 : e >> 6 === 2 ? -1 : -2;
}
function $l(e, t, r) {
  var n = t.length - 1;
  if (n < r)
    return 0;
  var i = Vn(t[n]);
  return i >= 0 ? (i > 0 && (e.lastNeed = i - 1), i) : --n < r || i === -2 ? 0 : (i = Vn(t[n]), i >= 0 ? (i > 0 && (e.lastNeed = i - 2), i) : --n < r || i === -2 ? 0 : (i = Vn(t[n]), i >= 0 ? (i > 0 && (i === 2 ? i = 0 : e.lastNeed = i - 3), i) : 0));
}
function Wl(e, t, r) {
  if ((t[0] & 192) !== 128)
    return e.lastNeed = 0, "\uFFFD";
  if (e.lastNeed > 1 && t.length > 1) {
    if ((t[1] & 192) !== 128)
      return e.lastNeed = 1, "\uFFFD";
    if (e.lastNeed > 2 && t.length > 2 && (t[2] & 192) !== 128)
      return e.lastNeed = 2, "\uFFFD";
  }
}
function zl(e) {
  var t = this.lastTotal - this.lastNeed, r = Wl(this, e);
  if (r !== void 0)
    return r;
  if (this.lastNeed <= e.length)
    return e.copy(this.lastChar, t, 0, this.lastNeed), this.lastChar.toString(this.encoding, 0, this.lastTotal);
  e.copy(this.lastChar, t, 0, e.length), this.lastNeed -= e.length;
}
function Gl(e, t) {
  var r = $l(this, e, t);
  if (!this.lastNeed)
    return e.toString("utf8", t);
  this.lastTotal = r;
  var n = e.length - (r - this.lastNeed);
  return e.copy(this.lastChar, 0, n), e.toString("utf8", t, n);
}
function Yl(e) {
  var t = e && e.length ? this.write(e) : "";
  return this.lastNeed ? t + "\uFFFD" : t;
}
function Vl(e, t) {
  if ((e.length - t) % 2 === 0) {
    var r = e.toString("utf16le", t);
    if (r) {
      var n = r.charCodeAt(r.length - 1);
      if (n >= 55296 && n <= 56319)
        return this.lastNeed = 2, this.lastTotal = 4, this.lastChar[0] = e[e.length - 2], this.lastChar[1] = e[e.length - 1], r.slice(0, -1);
    }
    return r;
  }
  return this.lastNeed = 1, this.lastTotal = 2, this.lastChar[0] = e[e.length - 1], e.toString("utf16le", t, e.length - 1);
}
function Kl(e) {
  var t = e && e.length ? this.write(e) : "";
  if (this.lastNeed) {
    var r = this.lastTotal - this.lastNeed;
    return t + this.lastChar.toString("utf16le", 0, r);
  }
  return t;
}
function Zl(e, t) {
  var r = (e.length - t) % 3;
  return r === 0 ? e.toString("base64", t) : (this.lastNeed = 3 - r, this.lastTotal = 3, r === 1 ? this.lastChar[0] = e[e.length - 1] : (this.lastChar[0] = e[e.length - 2], this.lastChar[1] = e[e.length - 1]), e.toString("base64", t, e.length - r));
}
function Xl(e) {
  var t = e && e.length ? this.write(e) : "";
  return this.lastNeed ? t + this.lastChar.toString("base64", 0, 3 - this.lastNeed) : t;
}
function Ql(e) {
  return e.toString(this.encoding);
}
function Jl(e) {
  return e && e.length ? this.write(e) : "";
}
var Zo = ft.codes.ERR_STREAM_PREMATURE_CLOSE;
function ec(e) {
  var t = !1;
  return function() {
    if (!t) {
      t = !0;
      for (var r = arguments.length, n = new Array(r), i = 0; i < r; i++)
        n[i] = arguments[i];
      e.apply(this, n);
    }
  };
}
function tc() {
}
function rc(e) {
  return e.setHeader && typeof e.abort == "function";
}
function Is(e, t, r) {
  if (typeof t == "function")
    return Is(e, null, t);
  t || (t = {}), r = ec(r || tc);
  var n = t.readable || t.readable !== !1 && e.readable, i = t.writable || t.writable !== !1 && e.writable, a = function() {
    e.writable || u();
  }, o = e._writableState && e._writableState.finished, u = function() {
    i = !1, o = !0, n || r.call(e);
  }, s = e._readableState && e._readableState.endEmitted, f = function() {
    n = !1, s = !0, i || r.call(e);
  }, h = function(p) {
    r.call(e, p);
  }, l = function() {
    var p;
    if (n && !s)
      return (!e._readableState || !e._readableState.ended) && (p = new Zo()), r.call(e, p);
    if (i && !o)
      return (!e._writableState || !e._writableState.ended) && (p = new Zo()), r.call(e, p);
  }, c = function() {
    e.req.on("finish", u);
  };
  return rc(e) ? (e.on("complete", u), e.on("abort", l), e.req ? c() : e.on("request", c)) : i && !e._writableState && (e.on("end", a), e.on("close", a)), e.on("end", f), e.on("finish", u), t.error !== !1 && e.on("error", h), e.on("close", l), function() {
    e.removeListener("complete", u), e.removeListener("abort", l), e.removeListener("request", c), e.req && e.req.removeListener("finish", u), e.removeListener("end", a), e.removeListener("close", a), e.removeListener("finish", u), e.removeListener("end", f), e.removeListener("error", h), e.removeListener("close", l);
  };
}
var Pi = Is, Kn, Xo;
function nc() {
  if (Xo)
    return Kn;
  Xo = 1;
  var e;
  function t(x, E, I) {
    return E in x ? Object.defineProperty(x, E, { value: I, enumerable: !0, configurable: !0, writable: !0 }) : x[E] = I, x;
  }
  var r = Pi, n = Symbol("lastResolve"), i = Symbol("lastReject"), a = Symbol("error"), o = Symbol("ended"), u = Symbol("lastPromise"), s = Symbol("handlePromise"), f = Symbol("stream");
  function h(x, E) {
    return {
      value: x,
      done: E
    };
  }
  function l(x) {
    var E = x[n];
    if (E !== null) {
      var I = x[f].read();
      I !== null && (x[u] = null, x[n] = null, x[i] = null, E(h(I, !1)));
    }
  }
  function c(x) {
    P.exports.nextTick(l, x);
  }
  function d(x, E) {
    return function(I, R) {
      x.then(function() {
        if (E[o]) {
          I(h(void 0, !0));
          return;
        }
        E[s](I, R);
      }, R);
    };
  }
  var p = Object.getPrototypeOf(function() {
  }), y = Object.setPrototypeOf((e = {
    get stream() {
      return this[f];
    },
    next: function() {
      var E = this, I = this[a];
      if (I !== null)
        return Promise.reject(I);
      if (this[o])
        return Promise.resolve(h(void 0, !0));
      if (this[f].destroyed)
        return new Promise(function(U, q) {
          P.exports.nextTick(function() {
            E[a] ? q(E[a]) : U(h(void 0, !0));
          });
        });
      var R = this[u], L;
      if (R)
        L = new Promise(d(R, this));
      else {
        var j = this[f].read();
        if (j !== null)
          return Promise.resolve(h(j, !1));
        L = new Promise(this[s]);
      }
      return this[u] = L, L;
    }
  }, t(e, Symbol.asyncIterator, function() {
    return this;
  }), t(e, "return", function() {
    var E = this;
    return new Promise(function(I, R) {
      E[f].destroy(null, function(L) {
        if (L) {
          R(L);
          return;
        }
        I(h(void 0, !0));
      });
    });
  }), e), p), g = function(E) {
    var I, R = Object.create(y, (I = {}, t(I, f, {
      value: E,
      writable: !0
    }), t(I, n, {
      value: null,
      writable: !0
    }), t(I, i, {
      value: null,
      writable: !0
    }), t(I, a, {
      value: null,
      writable: !0
    }), t(I, o, {
      value: E._readableState.endEmitted,
      writable: !0
    }), t(I, s, {
      value: function(j, U) {
        var q = R[f].read();
        q ? (R[u] = null, R[n] = null, R[i] = null, j(h(q, !1))) : (R[n] = j, R[i] = U);
      },
      writable: !0
    }), I));
    return R[u] = null, r(E, function(L) {
      if (L && L.code !== "ERR_STREAM_PREMATURE_CLOSE") {
        var j = R[i];
        j !== null && (R[u] = null, R[n] = null, R[i] = null, j(L)), R[a] = L;
        return;
      }
      var U = R[n];
      U !== null && (R[u] = null, R[n] = null, R[i] = null, U(h(void 0, !0))), R[o] = !0;
    }), E.on("readable", c.bind(null, R)), R;
  };
  return Kn = g, Kn;
}
var Zn, Qo;
function ic() {
  return Qo || (Qo = 1, Zn = function() {
    throw new Error("Readable.from is not available in the browser");
  }), Zn;
}
var Xn, Jo;
function Ts() {
  if (Jo)
    return Xn;
  Jo = 1, Xn = k;
  var e;
  k.ReadableState = q, Ie.exports.EventEmitter;
  var t = function(v, O) {
    return v.listeners(O).length;
  }, r = _s, n = xr.Buffer, i = S.Uint8Array || function() {
  };
  function a(_) {
    return n.from(_);
  }
  function o(_) {
    return n.isBuffer(_) || _ instanceof i;
  }
  var u = ms, s;
  u && u.debuglog ? s = u.debuglog("stream") : s = function() {
  };
  var f = Il(), h = Es, l = Rs, c = l.getHighWaterMark, d = ft.codes, p = d.ERR_INVALID_ARG_TYPE, y = d.ERR_STREAM_PUSH_AFTER_EOF, g = d.ERR_METHOD_NOT_IMPLEMENTED, x = d.ERR_STREAM_UNSHIFT_AFTER_END_EVENT, E, I, R;
  oe.exports(k, r);
  var L = h.errorOrDestroy, j = ["error", "close", "destroy", "pause", "resume"];
  function U(_, v, O) {
    if (typeof _.prependListener == "function")
      return _.prependListener(v, O);
    !_._events || !_._events[v] ? _.on(v, O) : Array.isArray(_._events[v]) ? _._events[v].unshift(O) : _._events[v] = [O, _._events[v]];
  }
  function q(_, v, O) {
    e = e || Rt(), _ = _ || {}, typeof O != "boolean" && (O = v instanceof e), this.objectMode = !!_.objectMode, O && (this.objectMode = this.objectMode || !!_.readableObjectMode), this.highWaterMark = c(this, _, "readableHighWaterMark", O), this.buffer = new f(), this.length = 0, this.pipes = null, this.pipesCount = 0, this.flowing = null, this.ended = !1, this.endEmitted = !1, this.reading = !1, this.sync = !0, this.needReadable = !1, this.emittedReadable = !1, this.readableListening = !1, this.resumeScheduled = !1, this.paused = !0, this.emitClose = _.emitClose !== !1, this.autoDestroy = !!_.autoDestroy, this.destroyed = !1, this.defaultEncoding = _.defaultEncoding || "utf8", this.awaitDrain = 0, this.readingMore = !1, this.decoder = null, this.encoding = null, _.encoding && (E || (E = Jr.StringDecoder), this.decoder = new E(_.encoding), this.encoding = _.encoding);
  }
  function k(_) {
    if (e = e || Rt(), !(this instanceof k))
      return new k(_);
    var v = this instanceof e;
    this._readableState = new q(_, this, v), this.readable = !0, _ && (typeof _.read == "function" && (this._read = _.read), typeof _.destroy == "function" && (this._destroy = _.destroy)), r.call(this);
  }
  Object.defineProperty(k.prototype, "destroyed", {
    enumerable: !1,
    get: function() {
      return this._readableState === void 0 ? !1 : this._readableState.destroyed;
    },
    set: function(v) {
      !this._readableState || (this._readableState.destroyed = v);
    }
  }), k.prototype.destroy = h.destroy, k.prototype._undestroy = h.undestroy, k.prototype._destroy = function(_, v) {
    v(_);
  }, k.prototype.push = function(_, v) {
    var O = this._readableState, C;
    return O.objectMode ? C = !0 : typeof _ == "string" && (v = v || O.defaultEncoding, v !== O.encoding && (_ = n.from(_, v), v = ""), C = !0), de(this, _, v, !1, C);
  }, k.prototype.unshift = function(_) {
    return de(this, _, null, !0, !1);
  };
  function de(_, v, O, C, te) {
    s("readableAddChunk", v);
    var F = _._readableState;
    if (v === null)
      F.reading = !1, Ye(_, F);
    else {
      var V;
      if (te || (V = ne(F, v)), V)
        L(_, V);
      else if (F.objectMode || v && v.length > 0)
        if (typeof v != "string" && !F.objectMode && Object.getPrototypeOf(v) !== n.prototype && (v = a(v)), C)
          F.endEmitted ? L(_, new x()) : Z(_, F, v, !0);
        else if (F.ended)
          L(_, new y());
        else {
          if (F.destroyed)
            return !1;
          F.reading = !1, F.decoder && !O ? (v = F.decoder.write(v), F.objectMode || v.length !== 0 ? Z(_, F, v, !1) : He(_, F)) : Z(_, F, v, !1);
        }
      else
        C || (F.reading = !1, He(_, F));
    }
    return !F.ended && (F.length < F.highWaterMark || F.length === 0);
  }
  function Z(_, v, O, C) {
    v.flowing && v.length === 0 && !v.sync ? (v.awaitDrain = 0, _.emit("data", O)) : (v.length += v.objectMode ? 1 : O.length, C ? v.buffer.unshift(O) : v.buffer.push(O), v.needReadable && Ue(_)), He(_, v);
  }
  function ne(_, v) {
    var O;
    return !o(v) && typeof v != "string" && v !== void 0 && !_.objectMode && (O = new p("chunk", ["string", "Buffer", "Uint8Array"], v)), O;
  }
  k.prototype.isPaused = function() {
    return this._readableState.flowing === !1;
  }, k.prototype.setEncoding = function(_) {
    E || (E = Jr.StringDecoder);
    var v = new E(_);
    this._readableState.decoder = v, this._readableState.encoding = this._readableState.decoder.encoding;
    for (var O = this._readableState.buffer.head, C = ""; O !== null; )
      C += v.write(O.data), O = O.next;
    return this._readableState.buffer.clear(), C !== "" && this._readableState.buffer.push(C), this._readableState.length = C.length, this;
  };
  var M = 1073741824;
  function Y(_) {
    return _ >= M ? _ = M : (_--, _ |= _ >>> 1, _ |= _ >>> 2, _ |= _ >>> 4, _ |= _ >>> 8, _ |= _ >>> 16, _++), _;
  }
  function z(_, v) {
    return _ <= 0 || v.length === 0 && v.ended ? 0 : v.objectMode ? 1 : _ !== _ ? v.flowing && v.length ? v.buffer.head.data.length : v.length : (_ > v.highWaterMark && (v.highWaterMark = Y(_)), _ <= v.length ? _ : v.ended ? v.length : (v.needReadable = !0, 0));
  }
  k.prototype.read = function(_) {
    s("read", _), _ = parseInt(_, 10);
    var v = this._readableState, O = _;
    if (_ !== 0 && (v.emittedReadable = !1), _ === 0 && v.needReadable && ((v.highWaterMark !== 0 ? v.length >= v.highWaterMark : v.length > 0) || v.ended))
      return s("read: emitReadable", v.length, v.ended), v.length === 0 && v.ended ? A(this) : Ue(this), null;
    if (_ = z(_, v), _ === 0 && v.ended)
      return v.length === 0 && A(this), null;
    var C = v.needReadable;
    s("need readable", C), (v.length === 0 || v.length - _ < v.highWaterMark) && (C = !0, s("length less than watermark", C)), v.ended || v.reading ? (C = !1, s("reading or ended", C)) : C && (s("do read"), v.reading = !0, v.sync = !0, v.length === 0 && (v.needReadable = !0), this._read(v.highWaterMark), v.sync = !1, v.reading || (_ = z(O, v)));
    var te;
    return _ > 0 ? te = b(_, v) : te = null, te === null ? (v.needReadable = v.length <= v.highWaterMark, _ = 0) : (v.length -= _, v.awaitDrain = 0), v.length === 0 && (v.ended || (v.needReadable = !0), O !== _ && v.ended && A(this)), te !== null && this.emit("data", te), te;
  };
  function Ye(_, v) {
    if (s("onEofChunk"), !v.ended) {
      if (v.decoder) {
        var O = v.decoder.end();
        O && O.length && (v.buffer.push(O), v.length += v.objectMode ? 1 : O.length);
      }
      v.ended = !0, v.sync ? Ue(_) : (v.needReadable = !1, v.emittedReadable || (v.emittedReadable = !0, ht(_)));
    }
  }
  function Ue(_) {
    var v = _._readableState;
    s("emitReadable", v.needReadable, v.emittedReadable), v.needReadable = !1, v.emittedReadable || (s("emitReadable", v.flowing), v.emittedReadable = !0, P.exports.nextTick(ht, _));
  }
  function ht(_) {
    var v = _._readableState;
    s("emitReadable_", v.destroyed, v.length, v.ended), !v.destroyed && (v.length || v.ended) && (_.emit("readable"), v.emittedReadable = !1), v.needReadable = !v.flowing && !v.ended && v.length <= v.highWaterMark, w(_);
  }
  function He(_, v) {
    v.readingMore || (v.readingMore = !0, P.exports.nextTick(dt, _, v));
  }
  function dt(_, v) {
    for (; !v.reading && !v.ended && (v.length < v.highWaterMark || v.flowing && v.length === 0); ) {
      var O = v.length;
      if (s("maybeReadMore read 0"), _.read(0), O === v.length)
        break;
    }
    v.readingMore = !1;
  }
  k.prototype._read = function(_) {
    L(this, new g("_read()"));
  }, k.prototype.pipe = function(_, v) {
    var O = this, C = this._readableState;
    switch (C.pipesCount) {
      case 0:
        C.pipes = _;
        break;
      case 1:
        C.pipes = [C.pipes, _];
        break;
      default:
        C.pipes.push(_);
        break;
    }
    C.pipesCount += 1, s("pipe count=%d opts=%j", C.pipesCount, v);
    var te = (!v || v.end !== !1) && _ !== P.exports.stdout && _ !== P.exports.stderr, F = te ? vt : Mt;
    C.endEmitted ? P.exports.nextTick(F) : O.once("end", F), _.on("unpipe", V);
    function V(yt, gt) {
      s("onunpipe"), yt === O && gt && gt.hasUnpiped === !1 && (gt.hasUnpiped = !0, nu());
    }
    function vt() {
      s("onend"), _.end();
    }
    var Tr = Tt(O);
    _.on("drain", Tr);
    var Fi = !1;
    function nu() {
      s("cleanup"), _.removeListener("close", Rn), _.removeListener("finish", On), _.removeListener("drain", Tr), _.removeListener("error", Sn), _.removeListener("unpipe", V), O.removeListener("end", vt), O.removeListener("end", Mt), O.removeListener("data", Ni), Fi = !0, C.awaitDrain && (!_._writableState || _._writableState.needDrain) && Tr();
    }
    O.on("data", Ni);
    function Ni(yt) {
      s("ondata");
      var gt = _.write(yt);
      s("dest.write", gt), gt === !1 && ((C.pipesCount === 1 && C.pipes === _ || C.pipesCount > 1 && N(C.pipes, _) !== -1) && !Fi && (s("false write response, pause", C.awaitDrain), C.awaitDrain++), O.pause());
    }
    function Sn(yt) {
      s("onerror", yt), Mt(), _.removeListener("error", Sn), t(_, "error") === 0 && L(_, yt);
    }
    U(_, "error", Sn);
    function Rn() {
      _.removeListener("finish", On), Mt();
    }
    _.once("close", Rn);
    function On() {
      s("onfinish"), _.removeListener("close", Rn), Mt();
    }
    _.once("finish", On);
    function Mt() {
      s("unpipe"), O.unpipe(_);
    }
    return _.emit("pipe", O), C.flowing || (s("pipe resume"), O.resume()), _;
  };
  function Tt(_) {
    return function() {
      var O = _._readableState;
      s("pipeOnDrain", O.awaitDrain), O.awaitDrain && O.awaitDrain--, O.awaitDrain === 0 && t(_, "data") && (O.flowing = !0, w(_));
    };
  }
  k.prototype.unpipe = function(_) {
    var v = this._readableState, O = {
      hasUnpiped: !1
    };
    if (v.pipesCount === 0)
      return this;
    if (v.pipesCount === 1)
      return _ && _ !== v.pipes ? this : (_ || (_ = v.pipes), v.pipes = null, v.pipesCount = 0, v.flowing = !1, _ && _.emit("unpipe", this, O), this);
    if (!_) {
      var C = v.pipes, te = v.pipesCount;
      v.pipes = null, v.pipesCount = 0, v.flowing = !1;
      for (var F = 0; F < te; F++)
        C[F].emit("unpipe", this, {
          hasUnpiped: !1
        });
      return this;
    }
    var V = N(v.pipes, _);
    return V === -1 ? this : (v.pipes.splice(V, 1), v.pipesCount -= 1, v.pipesCount === 1 && (v.pipes = v.pipes[0]), _.emit("unpipe", this, O), this);
  }, k.prototype.on = function(_, v) {
    var O = r.prototype.on.call(this, _, v), C = this._readableState;
    return _ === "data" ? (C.readableListening = this.listenerCount("readable") > 0, C.flowing !== !1 && this.resume()) : _ === "readable" && !C.endEmitted && !C.readableListening && (C.readableListening = C.needReadable = !0, C.flowing = !1, C.emittedReadable = !1, s("on readable", C.length, C.reading), C.length ? Ue(this) : C.reading || P.exports.nextTick(Le, this)), O;
  }, k.prototype.addListener = k.prototype.on, k.prototype.removeListener = function(_, v) {
    var O = r.prototype.removeListener.call(this, _, v);
    return _ === "readable" && P.exports.nextTick(pt, this), O;
  }, k.prototype.removeAllListeners = function(_) {
    var v = r.prototype.removeAllListeners.apply(this, arguments);
    return (_ === "readable" || _ === void 0) && P.exports.nextTick(pt, this), v;
  };
  function pt(_) {
    var v = _._readableState;
    v.readableListening = _.listenerCount("readable") > 0, v.resumeScheduled && !v.paused ? v.flowing = !0 : _.listenerCount("data") > 0 && _.resume();
  }
  function Le(_) {
    s("readable nexttick read 0"), _.read(0);
  }
  k.prototype.resume = function() {
    var _ = this._readableState;
    return _.flowing || (s("resume"), _.flowing = !_.readableListening, Ct(this, _)), _.paused = !1, this;
  };
  function Ct(_, v) {
    v.resumeScheduled || (v.resumeScheduled = !0, P.exports.nextTick(_t, _, v));
  }
  function _t(_, v) {
    s("resume", v.reading), v.reading || _.read(0), v.resumeScheduled = !1, _.emit("resume"), w(_), v.flowing && !v.reading && _.read(0);
  }
  k.prototype.pause = function() {
    return s("call pause flowing=%j", this._readableState.flowing), this._readableState.flowing !== !1 && (s("pause"), this._readableState.flowing = !1, this.emit("pause")), this._readableState.paused = !0, this;
  };
  function w(_) {
    var v = _._readableState;
    for (s("flow", v.flowing); v.flowing && _.read() !== null; )
      ;
  }
  k.prototype.wrap = function(_) {
    var v = this, O = this._readableState, C = !1;
    _.on("end", function() {
      if (s("wrapped end"), O.decoder && !O.ended) {
        var V = O.decoder.end();
        V && V.length && v.push(V);
      }
      v.push(null);
    }), _.on("data", function(V) {
      if (s("wrapped data"), O.decoder && (V = O.decoder.write(V)), !(O.objectMode && V == null) && !(!O.objectMode && (!V || !V.length))) {
        var vt = v.push(V);
        vt || (C = !0, _.pause());
      }
    });
    for (var te in _)
      this[te] === void 0 && typeof _[te] == "function" && (this[te] = function(vt) {
        return function() {
          return _[vt].apply(_, arguments);
        };
      }(te));
    for (var F = 0; F < j.length; F++)
      _.on(j[F], this.emit.bind(this, j[F]));
    return this._read = function(V) {
      s("wrapped _read", V), C && (C = !1, _.resume());
    }, this;
  }, typeof Symbol == "function" && (k.prototype[Symbol.asyncIterator] = function() {
    return I === void 0 && (I = nc()), I(this);
  }), Object.defineProperty(k.prototype, "readableHighWaterMark", {
    enumerable: !1,
    get: function() {
      return this._readableState.highWaterMark;
    }
  }), Object.defineProperty(k.prototype, "readableBuffer", {
    enumerable: !1,
    get: function() {
      return this._readableState && this._readableState.buffer;
    }
  }), Object.defineProperty(k.prototype, "readableFlowing", {
    enumerable: !1,
    get: function() {
      return this._readableState.flowing;
    },
    set: function(v) {
      this._readableState && (this._readableState.flowing = v);
    }
  }), k._fromList = b, Object.defineProperty(k.prototype, "readableLength", {
    enumerable: !1,
    get: function() {
      return this._readableState.length;
    }
  });
  function b(_, v) {
    if (v.length === 0)
      return null;
    var O;
    return v.objectMode ? O = v.buffer.shift() : !_ || _ >= v.length ? (v.decoder ? O = v.buffer.join("") : v.buffer.length === 1 ? O = v.buffer.first() : O = v.buffer.concat(v.length), v.buffer.clear()) : O = v.buffer.consume(_, v.decoder), O;
  }
  function A(_) {
    var v = _._readableState;
    s("endReadable", v.endEmitted), v.endEmitted || (v.ended = !0, P.exports.nextTick(B, v, _));
  }
  function B(_, v) {
    if (s("endReadableNT", _.endEmitted, _.length), !_.endEmitted && _.length === 0 && (_.endEmitted = !0, v.readable = !1, v.emit("end"), _.autoDestroy)) {
      var O = v._writableState;
      (!O || O.autoDestroy && O.finished) && v.destroy();
    }
  }
  typeof Symbol == "function" && (k.from = function(_, v) {
    return R === void 0 && (R = ic()), R(k, _, v);
  });
  function N(_, v) {
    for (var O = 0, C = _.length; O < C; O++)
      if (_[O] === v)
        return O;
    return -1;
  }
  return Xn;
}
var Cs = ze, pn = ft.codes, oc = pn.ERR_METHOD_NOT_IMPLEMENTED, ac = pn.ERR_MULTIPLE_CALLBACK, sc = pn.ERR_TRANSFORM_ALREADY_TRANSFORMING, uc = pn.ERR_TRANSFORM_WITH_LENGTH_0, _n = Rt();
oe.exports(ze, _n);
function fc(e, t) {
  var r = this._transformState;
  r.transforming = !1;
  var n = r.writecb;
  if (n === null)
    return this.emit("error", new ac());
  r.writechunk = null, r.writecb = null, t != null && this.push(t), n(e);
  var i = this._readableState;
  i.reading = !1, (i.needReadable || i.length < i.highWaterMark) && this._read(i.highWaterMark);
}
function ze(e) {
  if (!(this instanceof ze))
    return new ze(e);
  _n.call(this, e), this._transformState = {
    afterTransform: fc.bind(this),
    needTransform: !1,
    transforming: !1,
    writecb: null,
    writechunk: null,
    writeencoding: null
  }, this._readableState.needReadable = !0, this._readableState.sync = !1, e && (typeof e.transform == "function" && (this._transform = e.transform), typeof e.flush == "function" && (this._flush = e.flush)), this.on("prefinish", lc);
}
function lc() {
  var e = this;
  typeof this._flush == "function" && !this._readableState.destroyed ? this._flush(function(t, r) {
    ea(e, t, r);
  }) : ea(this, null, null);
}
ze.prototype.push = function(e, t) {
  return this._transformState.needTransform = !1, _n.prototype.push.call(this, e, t);
};
ze.prototype._transform = function(e, t, r) {
  r(new oc("_transform()"));
};
ze.prototype._write = function(e, t, r) {
  var n = this._transformState;
  if (n.writecb = r, n.writechunk = e, n.writeencoding = t, !n.transforming) {
    var i = this._readableState;
    (n.needTransform || i.needReadable || i.length < i.highWaterMark) && this._read(i.highWaterMark);
  }
};
ze.prototype._read = function(e) {
  var t = this._transformState;
  t.writechunk !== null && !t.transforming ? (t.transforming = !0, this._transform(t.writechunk, t.writeencoding, t.afterTransform)) : t.needTransform = !0;
};
ze.prototype._destroy = function(e, t) {
  _n.prototype._destroy.call(this, e, function(r) {
    t(r);
  });
};
function ea(e, t, r) {
  if (t)
    return e.emit("error", t);
  if (r != null && e.push(r), e._writableState.length)
    throw new uc();
  if (e._transformState.transforming)
    throw new sc();
  return e.push(null);
}
var cc = br, Ms = Cs;
oe.exports(br, Ms);
function br(e) {
  if (!(this instanceof br))
    return new br(e);
  Ms.call(this, e);
}
br.prototype._transform = function(e, t, r) {
  r(null, e);
};
var Qn;
function hc(e) {
  var t = !1;
  return function() {
    t || (t = !0, e.apply(void 0, arguments));
  };
}
var Bs = ft.codes, dc = Bs.ERR_MISSING_ARGS, pc = Bs.ERR_STREAM_DESTROYED;
function ta(e) {
  if (e)
    throw e;
}
function _c(e) {
  return e.setHeader && typeof e.abort == "function";
}
function vc(e, t, r, n) {
  n = hc(n);
  var i = !1;
  e.on("close", function() {
    i = !0;
  }), Qn === void 0 && (Qn = Pi), Qn(e, {
    readable: t,
    writable: r
  }, function(o) {
    if (o)
      return n(o);
    i = !0, n();
  });
  var a = !1;
  return function(o) {
    if (!i && !a) {
      if (a = !0, _c(e))
        return e.abort();
      if (typeof e.destroy == "function")
        return e.destroy();
      n(o || new pc("pipe"));
    }
  };
}
function ra(e) {
  e();
}
function yc(e, t) {
  return e.pipe(t);
}
function gc(e) {
  return !e.length || typeof e[e.length - 1] != "function" ? ta : e.pop();
}
function bc() {
  for (var e = arguments.length, t = new Array(e), r = 0; r < e; r++)
    t[r] = arguments[r];
  var n = gc(t);
  if (Array.isArray(t[0]) && (t = t[0]), t.length < 2)
    throw new dc("streams");
  var i, a = t.map(function(o, u) {
    var s = u < t.length - 1, f = u > 0;
    return vc(o, s, f, function(h) {
      i || (i = h), h && a.forEach(ra), !s && (a.forEach(ra), n(i));
    });
  });
  return t.reduce(yc);
}
var wc = bc;
(function(e, t) {
  t = e.exports = Ts(), t.Stream = t, t.Readable = t, t.Writable = Os(), t.Duplex = Rt(), t.Transform = Cs, t.PassThrough = cc, t.finished = Pi, t.pipeline = wc;
})(ui, ui.exports);
var en = xe.exports.Buffer, ks = ui.exports.Transform, xc = oe.exports;
function mc(e, t) {
  if (!en.isBuffer(e) && typeof e != "string")
    throw new TypeError(t + " must be a string or a buffer");
}
function Je(e) {
  ks.call(this), this._block = en.allocUnsafe(e), this._blockSize = e, this._blockOffset = 0, this._length = [0, 0, 0, 0], this._finalized = !1;
}
xc(Je, ks);
Je.prototype._transform = function(e, t, r) {
  var n = null;
  try {
    this.update(e, t);
  } catch (i) {
    n = i;
  }
  r(n);
};
Je.prototype._flush = function(e) {
  var t = null;
  try {
    this.push(this.digest());
  } catch (r) {
    t = r;
  }
  e(t);
};
Je.prototype.update = function(e, t) {
  if (mc(e, "Data"), this._finalized)
    throw new Error("Digest already called");
  en.isBuffer(e) || (e = en.from(e, t));
  for (var r = this._block, n = 0; this._blockOffset + e.length - n >= this._blockSize; ) {
    for (var i = this._blockOffset; i < this._blockSize; )
      r[i++] = e[n++];
    this._update(), this._blockOffset = 0;
  }
  for (; n < e.length; )
    r[this._blockOffset++] = e[n++];
  for (var a = 0, o = e.length * 8; o > 0; ++a)
    this._length[a] += o, o = this._length[a] / 4294967296 | 0, o > 0 && (this._length[a] -= 4294967296 * o);
  return this;
};
Je.prototype._update = function() {
  throw new Error("_update is not implemented");
};
Je.prototype.digest = function(e) {
  if (this._finalized)
    throw new Error("Digest already called");
  this._finalized = !0;
  var t = this._digest();
  e !== void 0 && (t = t.toString(e)), this._block.fill(0), this._blockOffset = 0;
  for (var r = 0; r < 4; ++r)
    this._length[r] = 0;
  return t;
};
Je.prototype._digest = function() {
  throw new Error("_digest is not implemented");
};
var Ls = Je, Ec = oe.exports, Ps = Ls, Sc = xe.exports.Buffer, Rc = new Array(16);
function vn() {
  Ps.call(this, 64), this._a = 1732584193, this._b = 4023233417, this._c = 2562383102, this._d = 271733878;
}
Ec(vn, Ps);
vn.prototype._update = function() {
  for (var e = Rc, t = 0; t < 16; ++t)
    e[t] = this._block.readInt32LE(t * 4);
  var r = this._a, n = this._b, i = this._c, a = this._d;
  r = ue(r, n, i, a, e[0], 3614090360, 7), a = ue(a, r, n, i, e[1], 3905402710, 12), i = ue(i, a, r, n, e[2], 606105819, 17), n = ue(n, i, a, r, e[3], 3250441966, 22), r = ue(r, n, i, a, e[4], 4118548399, 7), a = ue(a, r, n, i, e[5], 1200080426, 12), i = ue(i, a, r, n, e[6], 2821735955, 17), n = ue(n, i, a, r, e[7], 4249261313, 22), r = ue(r, n, i, a, e[8], 1770035416, 7), a = ue(a, r, n, i, e[9], 2336552879, 12), i = ue(i, a, r, n, e[10], 4294925233, 17), n = ue(n, i, a, r, e[11], 2304563134, 22), r = ue(r, n, i, a, e[12], 1804603682, 7), a = ue(a, r, n, i, e[13], 4254626195, 12), i = ue(i, a, r, n, e[14], 2792965006, 17), n = ue(n, i, a, r, e[15], 1236535329, 22), r = fe(r, n, i, a, e[1], 4129170786, 5), a = fe(a, r, n, i, e[6], 3225465664, 9), i = fe(i, a, r, n, e[11], 643717713, 14), n = fe(n, i, a, r, e[0], 3921069994, 20), r = fe(r, n, i, a, e[5], 3593408605, 5), a = fe(a, r, n, i, e[10], 38016083, 9), i = fe(i, a, r, n, e[15], 3634488961, 14), n = fe(n, i, a, r, e[4], 3889429448, 20), r = fe(r, n, i, a, e[9], 568446438, 5), a = fe(a, r, n, i, e[14], 3275163606, 9), i = fe(i, a, r, n, e[3], 4107603335, 14), n = fe(n, i, a, r, e[8], 1163531501, 20), r = fe(r, n, i, a, e[13], 2850285829, 5), a = fe(a, r, n, i, e[2], 4243563512, 9), i = fe(i, a, r, n, e[7], 1735328473, 14), n = fe(n, i, a, r, e[12], 2368359562, 20), r = le(r, n, i, a, e[5], 4294588738, 4), a = le(a, r, n, i, e[8], 2272392833, 11), i = le(i, a, r, n, e[11], 1839030562, 16), n = le(n, i, a, r, e[14], 4259657740, 23), r = le(r, n, i, a, e[1], 2763975236, 4), a = le(a, r, n, i, e[4], 1272893353, 11), i = le(i, a, r, n, e[7], 4139469664, 16), n = le(n, i, a, r, e[10], 3200236656, 23), r = le(r, n, i, a, e[13], 681279174, 4), a = le(a, r, n, i, e[0], 3936430074, 11), i = le(i, a, r, n, e[3], 3572445317, 16), n = le(n, i, a, r, e[6], 76029189, 23), r = le(r, n, i, a, e[9], 3654602809, 4), a = le(a, r, n, i, e[12], 3873151461, 11), i = le(i, a, r, n, e[15], 530742520, 16), n = le(n, i, a, r, e[2], 3299628645, 23), r = ce(r, n, i, a, e[0], 4096336452, 6), a = ce(a, r, n, i, e[7], 1126891415, 10), i = ce(i, a, r, n, e[14], 2878612391, 15), n = ce(n, i, a, r, e[5], 4237533241, 21), r = ce(r, n, i, a, e[12], 1700485571, 6), a = ce(a, r, n, i, e[3], 2399980690, 10), i = ce(i, a, r, n, e[10], 4293915773, 15), n = ce(n, i, a, r, e[1], 2240044497, 21), r = ce(r, n, i, a, e[8], 1873313359, 6), a = ce(a, r, n, i, e[15], 4264355552, 10), i = ce(i, a, r, n, e[6], 2734768916, 15), n = ce(n, i, a, r, e[13], 1309151649, 21), r = ce(r, n, i, a, e[4], 4149444226, 6), a = ce(a, r, n, i, e[11], 3174756917, 10), i = ce(i, a, r, n, e[2], 718787259, 15), n = ce(n, i, a, r, e[9], 3951481745, 21), this._a = this._a + r | 0, this._b = this._b + n | 0, this._c = this._c + i | 0, this._d = this._d + a | 0;
};
vn.prototype._digest = function() {
  this._block[this._blockOffset++] = 128, this._blockOffset > 56 && (this._block.fill(0, this._blockOffset, 64), this._update(), this._blockOffset = 0), this._block.fill(0, this._blockOffset, 56), this._block.writeUInt32LE(this._length[0], 56), this._block.writeUInt32LE(this._length[1], 60), this._update();
  var e = Sc.allocUnsafe(16);
  return e.writeInt32LE(this._a, 0), e.writeInt32LE(this._b, 4), e.writeInt32LE(this._c, 8), e.writeInt32LE(this._d, 12), e;
};
function yn(e, t) {
  return e << t | e >>> 32 - t;
}
function ue(e, t, r, n, i, a, o) {
  return yn(e + (t & r | ~t & n) + i + a | 0, o) + t | 0;
}
function fe(e, t, r, n, i, a, o) {
  return yn(e + (t & n | r & ~n) + i + a | 0, o) + t | 0;
}
function le(e, t, r, n, i, a, o) {
  return yn(e + (t ^ r ^ n) + i + a | 0, o) + t | 0;
}
function ce(e, t, r, n, i, a, o) {
  return yn(e + (r ^ (t | ~n)) + i + a | 0, o) + t | 0;
}
var Oc = vn, Jn = xr.Buffer, Ac = oe.exports, qs = Ls, Ic = new Array(16), rr = [
  0,
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
  7,
  4,
  13,
  1,
  10,
  6,
  15,
  3,
  12,
  0,
  9,
  5,
  2,
  14,
  11,
  8,
  3,
  10,
  14,
  4,
  9,
  15,
  8,
  1,
  2,
  7,
  0,
  6,
  13,
  11,
  5,
  12,
  1,
  9,
  11,
  10,
  0,
  8,
  12,
  4,
  13,
  3,
  7,
  15,
  14,
  5,
  6,
  2,
  4,
  0,
  5,
  9,
  7,
  12,
  2,
  10,
  14,
  1,
  3,
  8,
  11,
  6,
  15,
  13
], nr = [
  5,
  14,
  7,
  0,
  9,
  2,
  11,
  4,
  13,
  6,
  15,
  8,
  1,
  10,
  3,
  12,
  6,
  11,
  3,
  7,
  0,
  13,
  5,
  10,
  14,
  15,
  8,
  12,
  4,
  9,
  1,
  2,
  15,
  5,
  1,
  3,
  7,
  14,
  6,
  9,
  11,
  8,
  12,
  2,
  10,
  0,
  4,
  13,
  8,
  6,
  4,
  1,
  3,
  11,
  15,
  0,
  5,
  12,
  2,
  13,
  9,
  7,
  10,
  14,
  12,
  15,
  10,
  4,
  1,
  5,
  8,
  7,
  6,
  2,
  13,
  14,
  0,
  3,
  9,
  11
], ir = [
  11,
  14,
  15,
  12,
  5,
  8,
  7,
  9,
  11,
  13,
  14,
  15,
  6,
  7,
  9,
  8,
  7,
  6,
  8,
  13,
  11,
  9,
  7,
  15,
  7,
  12,
  15,
  9,
  11,
  7,
  13,
  12,
  11,
  13,
  6,
  7,
  14,
  9,
  13,
  15,
  14,
  8,
  13,
  6,
  5,
  12,
  7,
  5,
  11,
  12,
  14,
  15,
  14,
  15,
  9,
  8,
  9,
  14,
  5,
  6,
  8,
  6,
  5,
  12,
  9,
  15,
  5,
  11,
  6,
  8,
  13,
  12,
  5,
  12,
  13,
  14,
  11,
  8,
  5,
  6
], or = [
  8,
  9,
  9,
  11,
  13,
  15,
  15,
  5,
  7,
  7,
  8,
  11,
  14,
  14,
  12,
  6,
  9,
  13,
  15,
  7,
  12,
  8,
  9,
  11,
  7,
  7,
  12,
  7,
  6,
  15,
  13,
  11,
  9,
  7,
  15,
  11,
  8,
  6,
  6,
  14,
  12,
  13,
  5,
  14,
  13,
  13,
  7,
  5,
  15,
  5,
  8,
  11,
  14,
  14,
  6,
  14,
  6,
  9,
  12,
  9,
  12,
  5,
  15,
  8,
  8,
  5,
  12,
  9,
  12,
  5,
  14,
  6,
  8,
  13,
  6,
  5,
  15,
  13,
  11,
  11
], ar = [0, 1518500249, 1859775393, 2400959708, 2840853838], sr = [1352829926, 1548603684, 1836072691, 2053994217, 0];
function gn() {
  qs.call(this, 64), this._a = 1732584193, this._b = 4023233417, this._c = 2562383102, this._d = 271733878, this._e = 3285377520;
}
Ac(gn, qs);
gn.prototype._update = function() {
  for (var e = Ic, t = 0; t < 16; ++t)
    e[t] = this._block.readInt32LE(t * 4);
  for (var r = this._a | 0, n = this._b | 0, i = this._c | 0, a = this._d | 0, o = this._e | 0, u = this._a | 0, s = this._b | 0, f = this._c | 0, h = this._d | 0, l = this._e | 0, c = 0; c < 80; c += 1) {
    var d, p;
    c < 16 ? (d = na(r, n, i, a, o, e[rr[c]], ar[0], ir[c]), p = sa(u, s, f, h, l, e[nr[c]], sr[0], or[c])) : c < 32 ? (d = ia(r, n, i, a, o, e[rr[c]], ar[1], ir[c]), p = aa(u, s, f, h, l, e[nr[c]], sr[1], or[c])) : c < 48 ? (d = oa(r, n, i, a, o, e[rr[c]], ar[2], ir[c]), p = oa(u, s, f, h, l, e[nr[c]], sr[2], or[c])) : c < 64 ? (d = aa(r, n, i, a, o, e[rr[c]], ar[3], ir[c]), p = ia(u, s, f, h, l, e[nr[c]], sr[3], or[c])) : (d = sa(r, n, i, a, o, e[rr[c]], ar[4], ir[c]), p = na(u, s, f, h, l, e[nr[c]], sr[4], or[c])), r = o, o = a, a = at(i, 10), i = n, n = d, u = l, l = h, h = at(f, 10), f = s, s = p;
  }
  var y = this._b + i + h | 0;
  this._b = this._c + a + l | 0, this._c = this._d + o + u | 0, this._d = this._e + r + s | 0, this._e = this._a + n + f | 0, this._a = y;
};
gn.prototype._digest = function() {
  this._block[this._blockOffset++] = 128, this._blockOffset > 56 && (this._block.fill(0, this._blockOffset, 64), this._update(), this._blockOffset = 0), this._block.fill(0, this._blockOffset, 56), this._block.writeUInt32LE(this._length[0], 56), this._block.writeUInt32LE(this._length[1], 60), this._update();
  var e = Jn.alloc ? Jn.alloc(20) : new Jn(20);
  return e.writeInt32LE(this._a, 0), e.writeInt32LE(this._b, 4), e.writeInt32LE(this._c, 8), e.writeInt32LE(this._d, 12), e.writeInt32LE(this._e, 16), e;
};
function at(e, t) {
  return e << t | e >>> 32 - t;
}
function na(e, t, r, n, i, a, o, u) {
  return at(e + (t ^ r ^ n) + a + o | 0, u) + i | 0;
}
function ia(e, t, r, n, i, a, o, u) {
  return at(e + (t & r | ~t & n) + a + o | 0, u) + i | 0;
}
function oa(e, t, r, n, i, a, o, u) {
  return at(e + ((t | ~r) ^ n) + a + o | 0, u) + i | 0;
}
function aa(e, t, r, n, i, a, o, u) {
  return at(e + (t & n | r & ~n) + a + o | 0, u) + i | 0;
}
function sa(e, t, r, n, i, a, o, u) {
  return at(e + (t ^ (r | ~n)) + a + o | 0, u) + i | 0;
}
var Tc = gn, js = { exports: {} }, Ds = xe.exports.Buffer;
function bn(e, t) {
  this._block = Ds.alloc(e), this._finalSize = t, this._blockSize = e, this._len = 0;
}
bn.prototype.update = function(e, t) {
  typeof e == "string" && (t = t || "utf8", e = Ds.from(e, t));
  for (var r = this._block, n = this._blockSize, i = e.length, a = this._len, o = 0; o < i; ) {
    for (var u = a % n, s = Math.min(i - o, n - u), f = 0; f < s; f++)
      r[u + f] = e[o + f];
    a += s, o += s, a % n === 0 && this._update(r);
  }
  return this._len += i, this;
};
bn.prototype.digest = function(e) {
  var t = this._len % this._blockSize;
  this._block[t] = 128, this._block.fill(0, t + 1), t >= this._finalSize && (this._update(this._block), this._block.fill(0));
  var r = this._len * 8;
  if (r <= 4294967295)
    this._block.writeUInt32BE(r, this._blockSize - 4);
  else {
    var n = (r & 4294967295) >>> 0, i = (r - n) / 4294967296;
    this._block.writeUInt32BE(i, this._blockSize - 8), this._block.writeUInt32BE(n, this._blockSize - 4);
  }
  this._update(this._block);
  var a = this._hash();
  return e ? a.toString(e) : a;
};
bn.prototype._update = function() {
  throw new Error("_update must be implemented by subclass");
};
var It = bn, Cc = oe.exports, Fs = It, Mc = xe.exports.Buffer, Bc = [
  1518500249,
  1859775393,
  -1894007588,
  -899497514
], kc = new Array(80);
function Rr() {
  this.init(), this._w = kc, Fs.call(this, 64, 56);
}
Cc(Rr, Fs);
Rr.prototype.init = function() {
  return this._a = 1732584193, this._b = 4023233417, this._c = 2562383102, this._d = 271733878, this._e = 3285377520, this;
};
function Lc(e) {
  return e << 5 | e >>> 27;
}
function Pc(e) {
  return e << 30 | e >>> 2;
}
function qc(e, t, r, n) {
  return e === 0 ? t & r | ~t & n : e === 2 ? t & r | t & n | r & n : t ^ r ^ n;
}
Rr.prototype._update = function(e) {
  for (var t = this._w, r = this._a | 0, n = this._b | 0, i = this._c | 0, a = this._d | 0, o = this._e | 0, u = 0; u < 16; ++u)
    t[u] = e.readInt32BE(u * 4);
  for (; u < 80; ++u)
    t[u] = t[u - 3] ^ t[u - 8] ^ t[u - 14] ^ t[u - 16];
  for (var s = 0; s < 80; ++s) {
    var f = ~~(s / 20), h = Lc(r) + qc(f, n, i, a) + o + t[s] + Bc[f] | 0;
    o = a, a = i, i = Pc(n), n = r, r = h;
  }
  this._a = r + this._a | 0, this._b = n + this._b | 0, this._c = i + this._c | 0, this._d = a + this._d | 0, this._e = o + this._e | 0;
};
Rr.prototype._hash = function() {
  var e = Mc.allocUnsafe(20);
  return e.writeInt32BE(this._a | 0, 0), e.writeInt32BE(this._b | 0, 4), e.writeInt32BE(this._c | 0, 8), e.writeInt32BE(this._d | 0, 12), e.writeInt32BE(this._e | 0, 16), e;
};
var jc = Rr, Dc = oe.exports, Ns = It, Fc = xe.exports.Buffer, Nc = [
  1518500249,
  1859775393,
  -1894007588,
  -899497514
], Uc = new Array(80);
function Or() {
  this.init(), this._w = Uc, Ns.call(this, 64, 56);
}
Dc(Or, Ns);
Or.prototype.init = function() {
  return this._a = 1732584193, this._b = 4023233417, this._c = 2562383102, this._d = 271733878, this._e = 3285377520, this;
};
function Hc(e) {
  return e << 1 | e >>> 31;
}
function $c(e) {
  return e << 5 | e >>> 27;
}
function Wc(e) {
  return e << 30 | e >>> 2;
}
function zc(e, t, r, n) {
  return e === 0 ? t & r | ~t & n : e === 2 ? t & r | t & n | r & n : t ^ r ^ n;
}
Or.prototype._update = function(e) {
  for (var t = this._w, r = this._a | 0, n = this._b | 0, i = this._c | 0, a = this._d | 0, o = this._e | 0, u = 0; u < 16; ++u)
    t[u] = e.readInt32BE(u * 4);
  for (; u < 80; ++u)
    t[u] = Hc(t[u - 3] ^ t[u - 8] ^ t[u - 14] ^ t[u - 16]);
  for (var s = 0; s < 80; ++s) {
    var f = ~~(s / 20), h = $c(r) + zc(f, n, i, a) + o + t[s] + Nc[f] | 0;
    o = a, a = i, i = Wc(n), n = r, r = h;
  }
  this._a = r + this._a | 0, this._b = n + this._b | 0, this._c = i + this._c | 0, this._d = a + this._d | 0, this._e = o + this._e | 0;
};
Or.prototype._hash = function() {
  var e = Fc.allocUnsafe(20);
  return e.writeInt32BE(this._a | 0, 0), e.writeInt32BE(this._b | 0, 4), e.writeInt32BE(this._c | 0, 8), e.writeInt32BE(this._d | 0, 12), e.writeInt32BE(this._e | 0, 16), e;
};
var Gc = Or, Yc = oe.exports, Us = It, Vc = xe.exports.Buffer, Kc = [
  1116352408,
  1899447441,
  3049323471,
  3921009573,
  961987163,
  1508970993,
  2453635748,
  2870763221,
  3624381080,
  310598401,
  607225278,
  1426881987,
  1925078388,
  2162078206,
  2614888103,
  3248222580,
  3835390401,
  4022224774,
  264347078,
  604807628,
  770255983,
  1249150122,
  1555081692,
  1996064986,
  2554220882,
  2821834349,
  2952996808,
  3210313671,
  3336571891,
  3584528711,
  113926993,
  338241895,
  666307205,
  773529912,
  1294757372,
  1396182291,
  1695183700,
  1986661051,
  2177026350,
  2456956037,
  2730485921,
  2820302411,
  3259730800,
  3345764771,
  3516065817,
  3600352804,
  4094571909,
  275423344,
  430227734,
  506948616,
  659060556,
  883997877,
  958139571,
  1322822218,
  1537002063,
  1747873779,
  1955562222,
  2024104815,
  2227730452,
  2361852424,
  2428436474,
  2756734187,
  3204031479,
  3329325298
], Zc = new Array(64);
function Ar() {
  this.init(), this._w = Zc, Us.call(this, 64, 56);
}
Yc(Ar, Us);
Ar.prototype.init = function() {
  return this._a = 1779033703, this._b = 3144134277, this._c = 1013904242, this._d = 2773480762, this._e = 1359893119, this._f = 2600822924, this._g = 528734635, this._h = 1541459225, this;
};
function Xc(e, t, r) {
  return r ^ e & (t ^ r);
}
function Qc(e, t, r) {
  return e & t | r & (e | t);
}
function Jc(e) {
  return (e >>> 2 | e << 30) ^ (e >>> 13 | e << 19) ^ (e >>> 22 | e << 10);
}
function eh(e) {
  return (e >>> 6 | e << 26) ^ (e >>> 11 | e << 21) ^ (e >>> 25 | e << 7);
}
function th(e) {
  return (e >>> 7 | e << 25) ^ (e >>> 18 | e << 14) ^ e >>> 3;
}
function rh(e) {
  return (e >>> 17 | e << 15) ^ (e >>> 19 | e << 13) ^ e >>> 10;
}
Ar.prototype._update = function(e) {
  for (var t = this._w, r = this._a | 0, n = this._b | 0, i = this._c | 0, a = this._d | 0, o = this._e | 0, u = this._f | 0, s = this._g | 0, f = this._h | 0, h = 0; h < 16; ++h)
    t[h] = e.readInt32BE(h * 4);
  for (; h < 64; ++h)
    t[h] = rh(t[h - 2]) + t[h - 7] + th(t[h - 15]) + t[h - 16] | 0;
  for (var l = 0; l < 64; ++l) {
    var c = f + eh(o) + Xc(o, u, s) + Kc[l] + t[l] | 0, d = Jc(r) + Qc(r, n, i) | 0;
    f = s, s = u, u = o, o = a + c | 0, a = i, i = n, n = r, r = c + d | 0;
  }
  this._a = r + this._a | 0, this._b = n + this._b | 0, this._c = i + this._c | 0, this._d = a + this._d | 0, this._e = o + this._e | 0, this._f = u + this._f | 0, this._g = s + this._g | 0, this._h = f + this._h | 0;
};
Ar.prototype._hash = function() {
  var e = Vc.allocUnsafe(32);
  return e.writeInt32BE(this._a, 0), e.writeInt32BE(this._b, 4), e.writeInt32BE(this._c, 8), e.writeInt32BE(this._d, 12), e.writeInt32BE(this._e, 16), e.writeInt32BE(this._f, 20), e.writeInt32BE(this._g, 24), e.writeInt32BE(this._h, 28), e;
};
var Hs = Ar, nh = oe.exports, ih = Hs, oh = It, ah = xe.exports.Buffer, sh = new Array(64);
function wn() {
  this.init(), this._w = sh, oh.call(this, 64, 56);
}
nh(wn, ih);
wn.prototype.init = function() {
  return this._a = 3238371032, this._b = 914150663, this._c = 812702999, this._d = 4144912697, this._e = 4290775857, this._f = 1750603025, this._g = 1694076839, this._h = 3204075428, this;
};
wn.prototype._hash = function() {
  var e = ah.allocUnsafe(28);
  return e.writeInt32BE(this._a, 0), e.writeInt32BE(this._b, 4), e.writeInt32BE(this._c, 8), e.writeInt32BE(this._d, 12), e.writeInt32BE(this._e, 16), e.writeInt32BE(this._f, 20), e.writeInt32BE(this._g, 24), e;
};
var uh = wn, fh = oe.exports, $s = It, lh = xe.exports.Buffer, ua = [
  1116352408,
  3609767458,
  1899447441,
  602891725,
  3049323471,
  3964484399,
  3921009573,
  2173295548,
  961987163,
  4081628472,
  1508970993,
  3053834265,
  2453635748,
  2937671579,
  2870763221,
  3664609560,
  3624381080,
  2734883394,
  310598401,
  1164996542,
  607225278,
  1323610764,
  1426881987,
  3590304994,
  1925078388,
  4068182383,
  2162078206,
  991336113,
  2614888103,
  633803317,
  3248222580,
  3479774868,
  3835390401,
  2666613458,
  4022224774,
  944711139,
  264347078,
  2341262773,
  604807628,
  2007800933,
  770255983,
  1495990901,
  1249150122,
  1856431235,
  1555081692,
  3175218132,
  1996064986,
  2198950837,
  2554220882,
  3999719339,
  2821834349,
  766784016,
  2952996808,
  2566594879,
  3210313671,
  3203337956,
  3336571891,
  1034457026,
  3584528711,
  2466948901,
  113926993,
  3758326383,
  338241895,
  168717936,
  666307205,
  1188179964,
  773529912,
  1546045734,
  1294757372,
  1522805485,
  1396182291,
  2643833823,
  1695183700,
  2343527390,
  1986661051,
  1014477480,
  2177026350,
  1206759142,
  2456956037,
  344077627,
  2730485921,
  1290863460,
  2820302411,
  3158454273,
  3259730800,
  3505952657,
  3345764771,
  106217008,
  3516065817,
  3606008344,
  3600352804,
  1432725776,
  4094571909,
  1467031594,
  275423344,
  851169720,
  430227734,
  3100823752,
  506948616,
  1363258195,
  659060556,
  3750685593,
  883997877,
  3785050280,
  958139571,
  3318307427,
  1322822218,
  3812723403,
  1537002063,
  2003034995,
  1747873779,
  3602036899,
  1955562222,
  1575990012,
  2024104815,
  1125592928,
  2227730452,
  2716904306,
  2361852424,
  442776044,
  2428436474,
  593698344,
  2756734187,
  3733110249,
  3204031479,
  2999351573,
  3329325298,
  3815920427,
  3391569614,
  3928383900,
  3515267271,
  566280711,
  3940187606,
  3454069534,
  4118630271,
  4000239992,
  116418474,
  1914138554,
  174292421,
  2731055270,
  289380356,
  3203993006,
  460393269,
  320620315,
  685471733,
  587496836,
  852142971,
  1086792851,
  1017036298,
  365543100,
  1126000580,
  2618297676,
  1288033470,
  3409855158,
  1501505948,
  4234509866,
  1607167915,
  987167468,
  1816402316,
  1246189591
], ch = new Array(160);
function Ir() {
  this.init(), this._w = ch, $s.call(this, 128, 112);
}
fh(Ir, $s);
Ir.prototype.init = function() {
  return this._ah = 1779033703, this._bh = 3144134277, this._ch = 1013904242, this._dh = 2773480762, this._eh = 1359893119, this._fh = 2600822924, this._gh = 528734635, this._hh = 1541459225, this._al = 4089235720, this._bl = 2227873595, this._cl = 4271175723, this._dl = 1595750129, this._el = 2917565137, this._fl = 725511199, this._gl = 4215389547, this._hl = 327033209, this;
};
function fa(e, t, r) {
  return r ^ e & (t ^ r);
}
function la(e, t, r) {
  return e & t | r & (e | t);
}
function ca(e, t) {
  return (e >>> 28 | t << 4) ^ (t >>> 2 | e << 30) ^ (t >>> 7 | e << 25);
}
function ha(e, t) {
  return (e >>> 14 | t << 18) ^ (e >>> 18 | t << 14) ^ (t >>> 9 | e << 23);
}
function hh(e, t) {
  return (e >>> 1 | t << 31) ^ (e >>> 8 | t << 24) ^ e >>> 7;
}
function dh(e, t) {
  return (e >>> 1 | t << 31) ^ (e >>> 8 | t << 24) ^ (e >>> 7 | t << 25);
}
function ph(e, t) {
  return (e >>> 19 | t << 13) ^ (t >>> 29 | e << 3) ^ e >>> 6;
}
function _h(e, t) {
  return (e >>> 19 | t << 13) ^ (t >>> 29 | e << 3) ^ (e >>> 6 | t << 26);
}
function ie(e, t) {
  return e >>> 0 < t >>> 0 ? 1 : 0;
}
Ir.prototype._update = function(e) {
  for (var t = this._w, r = this._ah | 0, n = this._bh | 0, i = this._ch | 0, a = this._dh | 0, o = this._eh | 0, u = this._fh | 0, s = this._gh | 0, f = this._hh | 0, h = this._al | 0, l = this._bl | 0, c = this._cl | 0, d = this._dl | 0, p = this._el | 0, y = this._fl | 0, g = this._gl | 0, x = this._hl | 0, E = 0; E < 32; E += 2)
    t[E] = e.readInt32BE(E * 4), t[E + 1] = e.readInt32BE(E * 4 + 4);
  for (; E < 160; E += 2) {
    var I = t[E - 30], R = t[E - 15 * 2 + 1], L = hh(I, R), j = dh(R, I);
    I = t[E - 2 * 2], R = t[E - 2 * 2 + 1];
    var U = ph(I, R), q = _h(R, I), k = t[E - 7 * 2], de = t[E - 7 * 2 + 1], Z = t[E - 16 * 2], ne = t[E - 16 * 2 + 1], M = j + de | 0, Y = L + k + ie(M, j) | 0;
    M = M + q | 0, Y = Y + U + ie(M, q) | 0, M = M + ne | 0, Y = Y + Z + ie(M, ne) | 0, t[E] = Y, t[E + 1] = M;
  }
  for (var z = 0; z < 160; z += 2) {
    Y = t[z], M = t[z + 1];
    var Ye = la(r, n, i), Ue = la(h, l, c), ht = ca(r, h), He = ca(h, r), dt = ha(o, p), Tt = ha(p, o), pt = ua[z], Le = ua[z + 1], Ct = fa(o, u, s), _t = fa(p, y, g), w = x + Tt | 0, b = f + dt + ie(w, x) | 0;
    w = w + _t | 0, b = b + Ct + ie(w, _t) | 0, w = w + Le | 0, b = b + pt + ie(w, Le) | 0, w = w + M | 0, b = b + Y + ie(w, M) | 0;
    var A = He + Ue | 0, B = ht + Ye + ie(A, He) | 0;
    f = s, x = g, s = u, g = y, u = o, y = p, p = d + w | 0, o = a + b + ie(p, d) | 0, a = i, d = c, i = n, c = l, n = r, l = h, h = w + A | 0, r = b + B + ie(h, w) | 0;
  }
  this._al = this._al + h | 0, this._bl = this._bl + l | 0, this._cl = this._cl + c | 0, this._dl = this._dl + d | 0, this._el = this._el + p | 0, this._fl = this._fl + y | 0, this._gl = this._gl + g | 0, this._hl = this._hl + x | 0, this._ah = this._ah + r + ie(this._al, h) | 0, this._bh = this._bh + n + ie(this._bl, l) | 0, this._ch = this._ch + i + ie(this._cl, c) | 0, this._dh = this._dh + a + ie(this._dl, d) | 0, this._eh = this._eh + o + ie(this._el, p) | 0, this._fh = this._fh + u + ie(this._fl, y) | 0, this._gh = this._gh + s + ie(this._gl, g) | 0, this._hh = this._hh + f + ie(this._hl, x) | 0;
};
Ir.prototype._hash = function() {
  var e = lh.allocUnsafe(64);
  function t(r, n, i) {
    e.writeInt32BE(r, i), e.writeInt32BE(n, i + 4);
  }
  return t(this._ah, this._al, 0), t(this._bh, this._bl, 8), t(this._ch, this._cl, 16), t(this._dh, this._dl, 24), t(this._eh, this._el, 32), t(this._fh, this._fl, 40), t(this._gh, this._gl, 48), t(this._hh, this._hl, 56), e;
};
var Ws = Ir, vh = oe.exports, yh = Ws, gh = It, bh = xe.exports.Buffer, wh = new Array(160);
function xn() {
  this.init(), this._w = wh, gh.call(this, 128, 112);
}
vh(xn, yh);
xn.prototype.init = function() {
  return this._ah = 3418070365, this._bh = 1654270250, this._ch = 2438529370, this._dh = 355462360, this._eh = 1731405415, this._fh = 2394180231, this._gh = 3675008525, this._hh = 1203062813, this._al = 3238371032, this._bl = 914150663, this._cl = 812702999, this._dl = 4144912697, this._el = 4290775857, this._fl = 1750603025, this._gl = 1694076839, this._hl = 3204075428, this;
};
xn.prototype._hash = function() {
  var e = bh.allocUnsafe(48);
  function t(r, n, i) {
    e.writeInt32BE(r, i), e.writeInt32BE(n, i + 4);
  }
  return t(this._ah, this._al, 0), t(this._bh, this._bl, 8), t(this._ch, this._cl, 16), t(this._dh, this._dl, 24), t(this._eh, this._el, 32), t(this._fh, this._fl, 40), e;
};
var xh = xn, lt = js.exports = function(t) {
  t = t.toLowerCase();
  var r = lt[t];
  if (!r)
    throw new Error(t + " is not supported (we accept pull requests)");
  return new r();
};
lt.sha = jc;
lt.sha1 = Gc;
lt.sha224 = uh;
lt.sha256 = Hs;
lt.sha384 = xh;
lt.sha512 = Ws;
function ct() {
  this.head = null, this.tail = null, this.length = 0;
}
ct.prototype.push = function(e) {
  var t = { data: e, next: null };
  this.length > 0 ? this.tail.next = t : this.head = t, this.tail = t, ++this.length;
};
ct.prototype.unshift = function(e) {
  var t = { data: e, next: this.head };
  this.length === 0 && (this.tail = t), this.head = t, ++this.length;
};
ct.prototype.shift = function() {
  if (this.length !== 0) {
    var e = this.head.data;
    return this.length === 1 ? this.head = this.tail = null : this.head = this.head.next, --this.length, e;
  }
};
ct.prototype.clear = function() {
  this.head = this.tail = null, this.length = 0;
};
ct.prototype.join = function(e) {
  if (this.length === 0)
    return "";
  for (var t = this.head, r = "" + t.data; t = t.next; )
    r += e + t.data;
  return r;
};
ct.prototype.concat = function(e) {
  if (this.length === 0)
    return m.alloc(0);
  if (this.length === 1)
    return this.head.data;
  for (var t = m.allocUnsafe(e >>> 0), r = this.head, n = 0; r; )
    r.data.copy(t, n), n += r.data.length, r = r.next;
  return t;
};
ee.ReadableState = zs;
var W = Ti("stream");
Qe(ee, Ie.exports);
function mh(e, t, r) {
  if (typeof e.prependListener == "function")
    return e.prependListener(t, r);
  !e._events || !e._events[t] ? e.on(t, r) : Array.isArray(e._events[t]) ? e._events[t].unshift(r) : e._events[t] = [r, e._events[t]];
}
function Eh(e, t) {
  return e.listeners(t).length;
}
function zs(e, t) {
  e = e || {}, this.objectMode = !!e.objectMode, t instanceof me && (this.objectMode = this.objectMode || !!e.readableObjectMode);
  var r = e.highWaterMark, n = this.objectMode ? 16 : 16 * 1024;
  this.highWaterMark = r || r === 0 ? r : n, this.highWaterMark = ~~this.highWaterMark, this.buffer = new ct(), this.length = 0, this.pipes = null, this.pipesCount = 0, this.flowing = null, this.ended = !1, this.endEmitted = !1, this.reading = !1, this.sync = !0, this.needReadable = !1, this.emittedReadable = !1, this.readableListening = !1, this.resumeScheduled = !1, this.defaultEncoding = e.defaultEncoding || "utf8", this.ranOut = !1, this.awaitDrain = 0, this.readingMore = !1, this.decoder = null, this.encoding = null, e.encoding && (this.decoder = new As(e.encoding), this.encoding = e.encoding);
}
function ee(e) {
  if (!(this instanceof ee))
    return new ee(e);
  this._readableState = new zs(e, this), this.readable = !0, e && typeof e.read == "function" && (this._read = e.read), Ie.exports.call(this);
}
ee.prototype.push = function(e, t) {
  var r = this._readableState;
  return !r.objectMode && typeof e == "string" && (t = t || r.defaultEncoding, t !== r.encoding && (e = m.from(e, t), t = "")), Gs(this, r, e, t, !1);
};
ee.prototype.unshift = function(e) {
  var t = this._readableState;
  return Gs(this, t, e, "", !0);
};
ee.prototype.isPaused = function() {
  return this._readableState.flowing === !1;
};
function Gs(e, t, r, n, i) {
  var a = Oh(t, r);
  if (a)
    e.emit("error", a);
  else if (r === null)
    t.reading = !1, Ah(e, t);
  else if (t.objectMode || r && r.length > 0)
    if (t.ended && !i) {
      var o = new Error("stream.push() after EOF");
      e.emit("error", o);
    } else if (t.endEmitted && i) {
      var u = new Error("stream.unshift() after end event");
      e.emit("error", u);
    } else {
      var s;
      t.decoder && !i && !n && (r = t.decoder.write(r), s = !t.objectMode && r.length === 0), i || (t.reading = !1), s || (t.flowing && t.length === 0 && !t.sync ? (e.emit("data", r), e.read(0)) : (t.length += t.objectMode ? 1 : r.length, i ? t.buffer.unshift(r) : t.buffer.push(r), t.needReadable && mn(e))), Ih(e, t);
    }
  else
    i || (t.reading = !1);
  return Sh(t);
}
function Sh(e) {
  return !e.ended && (e.needReadable || e.length < e.highWaterMark || e.length === 0);
}
ee.prototype.setEncoding = function(e) {
  return this._readableState.decoder = new As(e), this._readableState.encoding = e, this;
};
var da = 8388608;
function Rh(e) {
  return e >= da ? e = da : (e--, e |= e >>> 1, e |= e >>> 2, e |= e >>> 4, e |= e >>> 8, e |= e >>> 16, e++), e;
}
function pa(e, t) {
  return e <= 0 || t.length === 0 && t.ended ? 0 : t.objectMode ? 1 : e !== e ? t.flowing && t.length ? t.buffer.head.data.length : t.length : (e > t.highWaterMark && (t.highWaterMark = Rh(e)), e <= t.length ? e : t.ended ? t.length : (t.needReadable = !0, 0));
}
ee.prototype.read = function(e) {
  W("read", e), e = parseInt(e, 10);
  var t = this._readableState, r = e;
  if (e !== 0 && (t.emittedReadable = !1), e === 0 && t.needReadable && (t.length >= t.highWaterMark || t.ended))
    return W("read: emitReadable", t.length, t.ended), t.length === 0 && t.ended ? ei(this) : mn(this), null;
  if (e = pa(e, t), e === 0 && t.ended)
    return t.length === 0 && ei(this), null;
  var n = t.needReadable;
  W("need readable", n), (t.length === 0 || t.length - e < t.highWaterMark) && (n = !0, W("length less than watermark", n)), t.ended || t.reading ? (n = !1, W("reading or ended", n)) : n && (W("do read"), t.reading = !0, t.sync = !0, t.length === 0 && (t.needReadable = !0), this._read(t.highWaterMark), t.sync = !1, t.reading || (e = pa(r, t)));
  var i;
  return e > 0 ? i = Ys(e, t) : i = null, i === null ? (t.needReadable = !0, e = 0) : t.length -= e, t.length === 0 && (t.ended || (t.needReadable = !0), r !== e && t.ended && ei(this)), i !== null && this.emit("data", i), i;
};
function Oh(e, t) {
  var r = null;
  return !m.isBuffer(t) && typeof t != "string" && t !== null && t !== void 0 && !e.objectMode && (r = new TypeError("Invalid non-string/buffer chunk")), r;
}
function Ah(e, t) {
  if (!t.ended) {
    if (t.decoder) {
      var r = t.decoder.end();
      r && r.length && (t.buffer.push(r), t.length += t.objectMode ? 1 : r.length);
    }
    t.ended = !0, mn(e);
  }
}
function mn(e) {
  var t = e._readableState;
  t.needReadable = !1, t.emittedReadable || (W("emitReadable", t.flowing), t.emittedReadable = !0, t.sync ? P.exports.nextTick(_a, e) : _a(e));
}
function _a(e) {
  W("emit readable"), e.emit("readable"), qi(e);
}
function Ih(e, t) {
  t.readingMore || (t.readingMore = !0, P.exports.nextTick(Th, e, t));
}
function Th(e, t) {
  for (var r = t.length; !t.reading && !t.flowing && !t.ended && t.length < t.highWaterMark && (W("maybeReadMore read 0"), e.read(0), r !== t.length); )
    r = t.length;
  t.readingMore = !1;
}
ee.prototype._read = function(e) {
  this.emit("error", new Error("not implemented"));
};
ee.prototype.pipe = function(e, t) {
  var r = this, n = this._readableState;
  switch (n.pipesCount) {
    case 0:
      n.pipes = e;
      break;
    case 1:
      n.pipes = [n.pipes, e];
      break;
    default:
      n.pipes.push(e);
      break;
  }
  n.pipesCount += 1, W("pipe count=%d opts=%j", n.pipesCount, t);
  var i = !t || t.end !== !1, a = i ? u : h;
  n.endEmitted ? P.exports.nextTick(a) : r.once("end", a), e.on("unpipe", o);
  function o(x) {
    W("onunpipe"), x === r && h();
  }
  function u() {
    W("onend"), e.end();
  }
  var s = Ch(r);
  e.on("drain", s);
  var f = !1;
  function h() {
    W("cleanup"), e.removeListener("close", p), e.removeListener("finish", y), e.removeListener("drain", s), e.removeListener("error", d), e.removeListener("unpipe", o), r.removeListener("end", u), r.removeListener("end", h), r.removeListener("data", c), f = !0, n.awaitDrain && (!e._writableState || e._writableState.needDrain) && s();
  }
  var l = !1;
  r.on("data", c);
  function c(x) {
    W("ondata"), l = !1;
    var E = e.write(x);
    E === !1 && !l && ((n.pipesCount === 1 && n.pipes === e || n.pipesCount > 1 && Vs(n.pipes, e) !== -1) && !f && (W("false write response, pause", r._readableState.awaitDrain), r._readableState.awaitDrain++, l = !0), r.pause());
  }
  function d(x) {
    W("onerror", x), g(), e.removeListener("error", d), Eh(e, "error") === 0 && e.emit("error", x);
  }
  mh(e, "error", d);
  function p() {
    e.removeListener("finish", y), g();
  }
  e.once("close", p);
  function y() {
    W("onfinish"), e.removeListener("close", p), g();
  }
  e.once("finish", y);
  function g() {
    W("unpipe"), r.unpipe(e);
  }
  return e.emit("pipe", r), n.flowing || (W("pipe resume"), r.resume()), e;
};
function Ch(e) {
  return function() {
    var t = e._readableState;
    W("pipeOnDrain", t.awaitDrain), t.awaitDrain && t.awaitDrain--, t.awaitDrain === 0 && e.listeners("data").length && (t.flowing = !0, qi(e));
  };
}
ee.prototype.unpipe = function(e) {
  var t = this._readableState;
  if (t.pipesCount === 0)
    return this;
  if (t.pipesCount === 1)
    return e && e !== t.pipes ? this : (e || (e = t.pipes), t.pipes = null, t.pipesCount = 0, t.flowing = !1, e && e.emit("unpipe", this), this);
  if (!e) {
    var r = t.pipes, n = t.pipesCount;
    t.pipes = null, t.pipesCount = 0, t.flowing = !1;
    for (var i = 0; i < n; i++)
      r[i].emit("unpipe", this);
    return this;
  }
  var a = Vs(t.pipes, e);
  return a === -1 ? this : (t.pipes.splice(a, 1), t.pipesCount -= 1, t.pipesCount === 1 && (t.pipes = t.pipes[0]), e.emit("unpipe", this), this);
};
ee.prototype.on = function(e, t) {
  var r = Ie.exports.prototype.on.call(this, e, t);
  if (e === "data")
    this._readableState.flowing !== !1 && this.resume();
  else if (e === "readable") {
    var n = this._readableState;
    !n.endEmitted && !n.readableListening && (n.readableListening = n.needReadable = !0, n.emittedReadable = !1, n.reading ? n.length && mn(this) : P.exports.nextTick(Mh, this));
  }
  return r;
};
ee.prototype.addListener = ee.prototype.on;
function Mh(e) {
  W("readable nexttick read 0"), e.read(0);
}
ee.prototype.resume = function() {
  var e = this._readableState;
  return e.flowing || (W("resume"), e.flowing = !0, Bh(this, e)), this;
};
function Bh(e, t) {
  t.resumeScheduled || (t.resumeScheduled = !0, P.exports.nextTick(kh, e, t));
}
function kh(e, t) {
  t.reading || (W("resume read 0"), e.read(0)), t.resumeScheduled = !1, t.awaitDrain = 0, e.emit("resume"), qi(e), t.flowing && !t.reading && e.read(0);
}
ee.prototype.pause = function() {
  return W("call pause flowing=%j", this._readableState.flowing), this._readableState.flowing !== !1 && (W("pause"), this._readableState.flowing = !1, this.emit("pause")), this;
};
function qi(e) {
  var t = e._readableState;
  for (W("flow", t.flowing); t.flowing && e.read() !== null; )
    ;
}
ee.prototype.wrap = function(e) {
  var t = this._readableState, r = !1, n = this;
  e.on("end", function() {
    if (W("wrapped end"), t.decoder && !t.ended) {
      var o = t.decoder.end();
      o && o.length && n.push(o);
    }
    n.push(null);
  }), e.on("data", function(o) {
    if (W("wrapped data"), t.decoder && (o = t.decoder.write(o)), !(t.objectMode && o == null) && !(!t.objectMode && (!o || !o.length))) {
      var u = n.push(o);
      u || (r = !0, e.pause());
    }
  });
  for (var i in e)
    this[i] === void 0 && typeof e[i] == "function" && (this[i] = function(o) {
      return function() {
        return e[o].apply(e, arguments);
      };
    }(i));
  var a = ["error", "close", "destroy", "pause", "resume"];
  return Dh(a, function(o) {
    e.on(o, n.emit.bind(n, o));
  }), n._read = function(o) {
    W("wrapped _read", o), r && (r = !1, e.resume());
  }, n;
};
ee._fromList = Ys;
function Ys(e, t) {
  if (t.length === 0)
    return null;
  var r;
  return t.objectMode ? r = t.buffer.shift() : !e || e >= t.length ? (t.decoder ? r = t.buffer.join("") : t.buffer.length === 1 ? r = t.buffer.head.data : r = t.buffer.concat(t.length), t.buffer.clear()) : r = Lh(e, t.buffer, t.decoder), r;
}
function Lh(e, t, r) {
  var n;
  return e < t.head.data.length ? (n = t.head.data.slice(0, e), t.head.data = t.head.data.slice(e)) : e === t.head.data.length ? n = t.shift() : n = r ? Ph(e, t) : qh(e, t), n;
}
function Ph(e, t) {
  var r = t.head, n = 1, i = r.data;
  for (e -= i.length; r = r.next; ) {
    var a = r.data, o = e > a.length ? a.length : e;
    if (o === a.length ? i += a : i += a.slice(0, e), e -= o, e === 0) {
      o === a.length ? (++n, r.next ? t.head = r.next : t.head = t.tail = null) : (t.head = r, r.data = a.slice(o));
      break;
    }
    ++n;
  }
  return t.length -= n, i;
}
function qh(e, t) {
  var r = m.allocUnsafe(e), n = t.head, i = 1;
  for (n.data.copy(r), e -= n.data.length; n = n.next; ) {
    var a = n.data, o = e > a.length ? a.length : e;
    if (a.copy(r, r.length - e, 0, o), e -= o, e === 0) {
      o === a.length ? (++i, n.next ? t.head = n.next : t.head = t.tail = null) : (t.head = n, n.data = a.slice(o));
      break;
    }
    ++i;
  }
  return t.length -= i, r;
}
function ei(e) {
  var t = e._readableState;
  if (t.length > 0)
    throw new Error('"endReadable()" called on non-empty stream');
  t.endEmitted || (t.ended = !0, P.exports.nextTick(jh, t, e));
}
function jh(e, t) {
  !e.endEmitted && e.length === 0 && (e.endEmitted = !0, t.readable = !1, t.emit("end"));
}
function Dh(e, t) {
  for (var r = 0, n = e.length; r < n; r++)
    t(e[r], r);
}
function Vs(e, t) {
  for (var r = 0, n = e.length; r < n; r++)
    if (e[r] === t)
      return r;
  return -1;
}
se.WritableState = ji;
Qe(se, Ie.exports.EventEmitter);
function Fh() {
}
function Nh(e, t, r) {
  this.chunk = e, this.encoding = t, this.callback = r, this.next = null;
}
function ji(e, t) {
  Object.defineProperty(this, "buffer", {
    get: hn(function() {
      return this.getBuffer();
    }, "_writableState.buffer is deprecated. Use _writableState.getBuffer instead.")
  }), e = e || {}, this.objectMode = !!e.objectMode, t instanceof me && (this.objectMode = this.objectMode || !!e.writableObjectMode);
  var r = e.highWaterMark, n = this.objectMode ? 16 : 16 * 1024;
  this.highWaterMark = r || r === 0 ? r : n, this.highWaterMark = ~~this.highWaterMark, this.needDrain = !1, this.ending = !1, this.ended = !1, this.finished = !1;
  var i = e.decodeStrings === !1;
  this.decodeStrings = !i, this.defaultEncoding = e.defaultEncoding || "utf8", this.length = 0, this.writing = !1, this.corked = 0, this.sync = !0, this.bufferProcessing = !1, this.onwrite = function(a) {
    Yh(t, a);
  }, this.writecb = null, this.writelen = 0, this.bufferedRequest = null, this.lastBufferedRequest = null, this.pendingcb = 0, this.prefinished = !1, this.errorEmitted = !1, this.bufferedRequestCount = 0, this.corkedRequestsFree = new Qs(this);
}
ji.prototype.getBuffer = function() {
  for (var t = this.bufferedRequest, r = []; t; )
    r.push(t), t = t.next;
  return r;
};
function se(e) {
  if (!(this instanceof se) && !(this instanceof me))
    return new se(e);
  this._writableState = new ji(e, this), this.writable = !0, e && (typeof e.write == "function" && (this._write = e.write), typeof e.writev == "function" && (this._writev = e.writev)), Ie.exports.EventEmitter.call(this);
}
se.prototype.pipe = function() {
  this.emit("error", new Error("Cannot pipe, not readable"));
};
function Uh(e, t) {
  var r = new Error("write after end");
  e.emit("error", r), P.exports.nextTick(t, r);
}
function Hh(e, t, r, n) {
  var i = !0, a = !1;
  return r === null ? a = new TypeError("May not write null values to stream") : !m.isBuffer(r) && typeof r != "string" && r !== void 0 && !t.objectMode && (a = new TypeError("Invalid non-string/buffer chunk")), a && (e.emit("error", a), P.exports.nextTick(n, a), i = !1), i;
}
se.prototype.write = function(e, t, r) {
  var n = this._writableState, i = !1;
  return typeof t == "function" && (r = t, t = null), m.isBuffer(e) ? t = "buffer" : t || (t = n.defaultEncoding), typeof r != "function" && (r = Fh), n.ended ? Uh(this, r) : Hh(this, n, e, r) && (n.pendingcb++, i = Wh(this, n, e, t, r)), i;
};
se.prototype.cork = function() {
  var e = this._writableState;
  e.corked++;
};
se.prototype.uncork = function() {
  var e = this._writableState;
  e.corked && (e.corked--, !e.writing && !e.corked && !e.finished && !e.bufferProcessing && e.bufferedRequest && Ks(this, e));
};
se.prototype.setDefaultEncoding = function(t) {
  if (typeof t == "string" && (t = t.toLowerCase()), !(["hex", "utf8", "utf-8", "ascii", "binary", "base64", "ucs2", "ucs-2", "utf16le", "utf-16le", "raw"].indexOf((t + "").toLowerCase()) > -1))
    throw new TypeError("Unknown encoding: " + t);
  return this._writableState.defaultEncoding = t, this;
};
function $h(e, t, r) {
  return !e.objectMode && e.decodeStrings !== !1 && typeof t == "string" && (t = m.from(t, r)), t;
}
function Wh(e, t, r, n, i) {
  r = $h(t, r, n), m.isBuffer(r) && (n = "buffer");
  var a = t.objectMode ? 1 : r.length;
  t.length += a;
  var o = t.length < t.highWaterMark;
  if (o || (t.needDrain = !0), t.writing || t.corked) {
    var u = t.lastBufferedRequest;
    t.lastBufferedRequest = new Nh(r, n, i), u ? u.next = t.lastBufferedRequest : t.bufferedRequest = t.lastBufferedRequest, t.bufferedRequestCount += 1;
  } else
    pi(e, t, !1, a, r, n, i);
  return o;
}
function pi(e, t, r, n, i, a, o) {
  t.writelen = n, t.writecb = o, t.writing = !0, t.sync = !0, r ? e._writev(i, t.onwrite) : e._write(i, a, t.onwrite), t.sync = !1;
}
function zh(e, t, r, n, i) {
  --t.pendingcb, r ? P.exports.nextTick(i, n) : i(n), e._writableState.errorEmitted = !0, e.emit("error", n);
}
function Gh(e) {
  e.writing = !1, e.writecb = null, e.length -= e.writelen, e.writelen = 0;
}
function Yh(e, t) {
  var r = e._writableState, n = r.sync, i = r.writecb;
  if (Gh(r), t)
    zh(e, r, n, t, i);
  else {
    var a = Zs(r);
    !a && !r.corked && !r.bufferProcessing && r.bufferedRequest && Ks(e, r), n ? P.exports.nextTick(va, e, r, a, i) : va(e, r, a, i);
  }
}
function va(e, t, r, n) {
  r || Vh(e, t), t.pendingcb--, n(), Xs(e, t);
}
function Vh(e, t) {
  t.length === 0 && t.needDrain && (t.needDrain = !1, e.emit("drain"));
}
function Ks(e, t) {
  t.bufferProcessing = !0;
  var r = t.bufferedRequest;
  if (e._writev && r && r.next) {
    var n = t.bufferedRequestCount, i = new Array(n), a = t.corkedRequestsFree;
    a.entry = r;
    for (var o = 0; r; )
      i[o] = r, r = r.next, o += 1;
    pi(e, t, !0, t.length, i, "", a.finish), t.pendingcb++, t.lastBufferedRequest = null, a.next ? (t.corkedRequestsFree = a.next, a.next = null) : t.corkedRequestsFree = new Qs(t);
  } else {
    for (; r; ) {
      var u = r.chunk, s = r.encoding, f = r.callback, h = t.objectMode ? 1 : u.length;
      if (pi(e, t, !1, h, u, s, f), r = r.next, t.writing)
        break;
    }
    r === null && (t.lastBufferedRequest = null);
  }
  t.bufferedRequestCount = 0, t.bufferedRequest = r, t.bufferProcessing = !1;
}
se.prototype._write = function(e, t, r) {
  r(new Error("not implemented"));
};
se.prototype._writev = null;
se.prototype.end = function(e, t, r) {
  var n = this._writableState;
  typeof e == "function" ? (r = e, e = null, t = null) : typeof t == "function" && (r = t, t = null), e != null && this.write(e, t), n.corked && (n.corked = 1, this.uncork()), !n.ending && !n.finished && Kh(this, n, r);
};
function Zs(e) {
  return e.ending && e.length === 0 && e.bufferedRequest === null && !e.finished && !e.writing;
}
function ya(e, t) {
  t.prefinished || (t.prefinished = !0, e.emit("prefinish"));
}
function Xs(e, t) {
  var r = Zs(t);
  return r && (t.pendingcb === 0 ? (ya(e, t), t.finished = !0, e.emit("finish")) : ya(e, t)), r;
}
function Kh(e, t, r) {
  t.ending = !0, Xs(e, t), r && (t.finished ? P.exports.nextTick(r) : e.once("finish", r)), t.ended = !0, e.writable = !1;
}
function Qs(e) {
  var t = this;
  this.next = null, this.entry = null, this.finish = function(r) {
    var n = t.entry;
    for (t.entry = null; n; ) {
      var i = n.callback;
      e.pendingcb--, i(r), n = n.next;
    }
    e.corkedRequestsFree ? e.corkedRequestsFree.next = t : e.corkedRequestsFree = t;
  };
}
Qe(me, ee);
var ga = Object.keys(se.prototype);
for (var ti = 0; ti < ga.length; ti++) {
  var ri = ga[ti];
  me.prototype[ri] || (me.prototype[ri] = se.prototype[ri]);
}
function me(e) {
  if (!(this instanceof me))
    return new me(e);
  ee.call(this, e), se.call(this, e), e && e.readable === !1 && (this.readable = !1), e && e.writable === !1 && (this.writable = !1), this.allowHalfOpen = !0, e && e.allowHalfOpen === !1 && (this.allowHalfOpen = !1), this.once("end", Zh);
}
function Zh() {
  this.allowHalfOpen || this._writableState.ended || P.exports.nextTick(Xh, this);
}
function Xh(e) {
  e.end();
}
Qe(Me, me);
function Qh(e) {
  this.afterTransform = function(t, r) {
    return Jh(e, t, r);
  }, this.needTransform = !1, this.transforming = !1, this.writecb = null, this.writechunk = null, this.writeencoding = null;
}
function Jh(e, t, r) {
  var n = e._transformState;
  n.transforming = !1;
  var i = n.writecb;
  if (!i)
    return e.emit("error", new Error("no writecb in Transform class"));
  n.writechunk = null, n.writecb = null, r != null && e.push(r), i(t);
  var a = e._readableState;
  a.reading = !1, (a.needReadable || a.length < a.highWaterMark) && e._read(a.highWaterMark);
}
function Me(e) {
  if (!(this instanceof Me))
    return new Me(e);
  me.call(this, e), this._transformState = new Qh(this);
  var t = this;
  this._readableState.needReadable = !0, this._readableState.sync = !1, e && (typeof e.transform == "function" && (this._transform = e.transform), typeof e.flush == "function" && (this._flush = e.flush)), this.once("prefinish", function() {
    typeof this._flush == "function" ? this._flush(function(r) {
      ba(t, r);
    }) : ba(t);
  });
}
Me.prototype.push = function(e, t) {
  return this._transformState.needTransform = !1, me.prototype.push.call(this, e, t);
};
Me.prototype._transform = function(e, t, r) {
  throw new Error("Not implemented");
};
Me.prototype._write = function(e, t, r) {
  var n = this._transformState;
  if (n.writecb = r, n.writechunk = e, n.writeencoding = t, !n.transforming) {
    var i = this._readableState;
    (n.needTransform || i.needReadable || i.length < i.highWaterMark) && this._read(i.highWaterMark);
  }
};
Me.prototype._read = function(e) {
  var t = this._transformState;
  t.writechunk !== null && t.writecb && !t.transforming ? (t.transforming = !0, this._transform(t.writechunk, t.writeencoding, t.afterTransform)) : t.needTransform = !0;
};
function ba(e, t) {
  if (t)
    return e.emit("error", t);
  var r = e._writableState, n = e._transformState;
  if (r.length)
    throw new Error("Calling transform done when ws.length != 0");
  if (n.transforming)
    throw new Error("Calling transform done when still transforming");
  return e.push(null);
}
Qe(Ot, Me);
function Ot(e) {
  if (!(this instanceof Ot))
    return new Ot(e);
  Me.call(this, e);
}
Ot.prototype._transform = function(e, t, r) {
  r(null, e);
};
Qe(Be, Ie.exports);
Be.Readable = ee;
Be.Writable = se;
Be.Duplex = me;
Be.Transform = Me;
Be.PassThrough = Ot;
Be.Stream = Be;
function Be() {
  Ie.exports.call(this);
}
Be.prototype.pipe = function(e, t) {
  var r = this;
  function n(h) {
    e.writable && e.write(h) === !1 && r.pause && r.pause();
  }
  r.on("data", n);
  function i() {
    r.readable && r.resume && r.resume();
  }
  e.on("drain", i), !e._isStdio && (!t || t.end !== !1) && (r.on("end", o), r.on("close", u));
  var a = !1;
  function o() {
    a || (a = !0, e.end());
  }
  function u() {
    a || (a = !0, typeof e.destroy == "function" && e.destroy());
  }
  function s(h) {
    if (f(), Ie.exports.listenerCount(this, "error") === 0)
      throw h;
  }
  r.on("error", s), e.on("error", s);
  function f() {
    r.removeListener("data", n), e.removeListener("drain", i), r.removeListener("end", o), r.removeListener("close", u), r.removeListener("error", s), e.removeListener("error", s), r.removeListener("end", f), r.removeListener("close", f), e.removeListener("close", f);
  }
  return r.on("end", f), r.on("close", f), e.on("close", f), e.emit("pipe", r), e;
};
const ed = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Be,
  Readable: ee,
  Writable: se,
  Duplex: me,
  Transform: Me,
  PassThrough: Ot,
  Stream: Be
}, Symbol.toStringTag, { value: "Module" })), td = /* @__PURE__ */ Ei(ed);
var Js = xe.exports.Buffer, eu = td.Transform, rd = Jr.StringDecoder, nd = oe.exports;
function ke(e) {
  eu.call(this), this.hashMode = typeof e == "string", this.hashMode ? this[e] = this._finalOrDigest : this.final = this._finalOrDigest, this._final && (this.__final = this._final, this._final = null), this._decoder = null, this._encoding = null;
}
nd(ke, eu);
ke.prototype.update = function(e, t, r) {
  typeof e == "string" && (e = Js.from(e, t));
  var n = this._update(e);
  return this.hashMode ? this : (r && (n = this._toString(n, r)), n);
};
ke.prototype.setAutoPadding = function() {
};
ke.prototype.getAuthTag = function() {
  throw new Error("trying to get auth tag in unsupported state");
};
ke.prototype.setAuthTag = function() {
  throw new Error("trying to set auth tag in unsupported state");
};
ke.prototype.setAAD = function() {
  throw new Error("trying to set aad in unsupported state");
};
ke.prototype._transform = function(e, t, r) {
  var n;
  try {
    this.hashMode ? this._update(e) : this.push(this._update(e));
  } catch (i) {
    n = i;
  } finally {
    r(n);
  }
};
ke.prototype._flush = function(e) {
  var t;
  try {
    this.push(this.__final());
  } catch (r) {
    t = r;
  }
  e(t);
};
ke.prototype._finalOrDigest = function(e) {
  var t = this.__final() || Js.alloc(0);
  return e && (t = this._toString(t, e, !0)), t;
};
ke.prototype._toString = function(e, t, r) {
  if (this._decoder || (this._decoder = new rd(t), this._encoding = t), this._encoding !== t)
    throw new Error("can't switch encodings");
  var n = this._decoder.write(e);
  return r && (n += this._decoder.end()), n;
};
var id = ke, od = oe.exports, ad = Oc, sd = Tc, ud = js.exports, tu = id;
function En(e) {
  tu.call(this, "digest"), this._hash = e;
}
od(En, tu);
En.prototype._update = function(e) {
  this._hash.update(e);
};
En.prototype._final = function() {
  return this._hash.digest();
};
var fd = function(t) {
  return t = t.toLowerCase(), t === "md5" ? new ad() : t === "rmd160" || t === "ripemd160" ? new sd() : new En(ud(t));
};
function ld(e) {
  return JSON.stringify([
    0,
    e.pubkey,
    e.created_at,
    e.kind,
    e.tags,
    e.content
  ]);
}
function Di(e) {
  let t = fd("sha256").update(m.from(ld(e))).digest();
  return m.from(t).toString("hex");
}
function cd(e) {
  if (e.id !== Di(e) || typeof e.content != "string" || typeof e.created_at != "number" || !Array.isArray(e.tags))
    return !1;
  for (let t = 0; t < e.tags.length; t++) {
    let r = e.tags[t];
    if (!Array.isArray(r))
      return !1;
    for (let n = 0; n < r.length; n++)
      if (typeof r[n] == "object")
        return !1;
  }
  return !0;
}
function ru(e) {
  return bi.verify(e.sig, e.id, e.pubkey);
}
async function hd(e, t) {
  return m.from(
    await bi.sign(Di(e), t)
  ).toString("hex");
}
function dd(e, t) {
  if (e.ids && e.ids.indexOf(t.id) === -1 || e.kinds && e.kinds.indexOf(t.kind) === -1 || e.authors && e.authors.indexOf(t.pubkey) === -1)
    return !1;
  for (let r in e)
    if (r[0] === "#" && e[r] && !t.tags.find(
      ([n, i]) => n === r.slice(1) && e[r].indexOf(i) !== -1
    ))
      return !1;
  return !(e.since && t.created_at < e.since || e.until && t.created_at >= e.until);
}
function pd(e, t) {
  for (let r = 0; r < e.length; r++)
    if (dd(e[r], t))
      return !0;
  return !1;
}
function _i(e) {
  let [t, ...r] = e.trim().split("?");
  return t.slice(0, 4) === "http" && (t = "ws" + t.slice(4)), t.slice(0, 2) !== "ws" && (t = "wss://" + t), t.length && t[t.length - 1] === "/" && (t = t.slice(0, -1)), [t, ...r].join("?");
}
function _d(e, t = () => {
}, r = () => {
}) {
  e = _i(e);
  var n, i, a, o, u = {}, s = {};
  let f = 1, h = 1;
  function l() {
    a = new Promise((g) => {
      i = g;
    });
  }
  var c = {};
  function d() {
    n = new WebSocket(e), n.onopen = () => {
      if (console.log("connected to", e), i(), o) {
        o = !1;
        for (let g in u) {
          let x = u[g], E = c[g];
          y({ cb: E, filter: x }, g);
        }
      }
    }, n.onerror = (g) => {
      console.log("error connecting to relay", e), r(g);
    }, n.onclose = () => {
      l(), f++, h += f ** 3, h > 14400 && (h = 14400), console.log(
        `relay ${e} connection closed. reconnecting in ${h} seconds.`
      ), setTimeout(async () => {
        try {
          d();
        } catch {
        }
      }, h * 1e3), o = !0;
    }, n.onmessage = async (g) => {
      var x;
      try {
        x = JSON.parse(g.data);
      } catch {
        x = g.data;
      }
      if (x.length > 1) {
        if (x[0] === "NOTICE") {
          if (x.length < 2)
            return;
          console.log("message from relay " + e + ": " + x[1]), t(x[1]);
          return;
        }
        if (x[0] === "EVENT") {
          if (x.length < 3)
            return;
          let E = x[1], I = x[2];
          cd(I) && (s[E] || ru(I)) && c[E] && pd(u[E], I) && c[E](I);
          return;
        }
      }
    };
  }
  l();
  try {
    d();
  } catch {
  }
  async function p(g) {
    let x = JSON.stringify(g);
    await a, n.send(x);
  }
  const y = ({ cb: g, filter: x, beforeSend: E, skipVerification: I }, R = Math.random().toString().slice(2)) => {
    var L = [];
    Array.isArray(x) ? L = x : L.push(x), E && (L = E({ filter: x, relay: e, channel: R }).filter), p(["REQ", R, ...L]), c[R] = g, u[R] = L, s[R] = I;
    const j = g, U = L, q = E;
    return {
      sub: ({
        cb: k = j,
        filter: de = U,
        beforeSend: Z = q
      }) => y({ cb: k, filter: de, beforeSend: Z, skipVerification: I }, R),
      unsub: () => {
        delete u[R], delete c[R], delete s[R], p(["CLOSE", R]);
      }
    };
  };
  return {
    url: e,
    sub: y,
    async publish(g, x) {
      try {
        if (await p(["EVENT", g]), x) {
          x(0);
          let { unsub: E } = y(
            {
              cb: () => {
                x(1), E(), clearTimeout(I);
              },
              filter: { ids: [g.id] }
            },
            `monitor-${g.id.slice(0, 5)}`
          ), I = setTimeout(E, 5e3);
        }
      } catch {
        x && x(-1);
      }
    },
    close() {
      n.close();
    },
    get status() {
      return n.readyState;
    }
  };
}
function vd() {
  var e, t;
  const r = {
    randomChoice: null,
    wait: !1
  }, n = {}, i = [];
  function a(s, f) {
    for (let h = 0; h < i.length; h++) {
      let { relay: l } = n[f];
      i[h](s, l);
    }
  }
  const o = {};
  return {
    sub: ({ cb: s, filter: f, beforeSend: h }, l) => {
      l || (l = Math.random().toString().slice(2));
      const c = Object.fromEntries(
        Object.values(n).filter(({ policy: R }) => R.read).map(({ relay: R }) => [
          R.url,
          R.sub({ cb: (L) => s(L, R.url), filter: f, beforeSend: h }, l)
        ])
      ), d = s, p = f, y = h, g = () => {
        Object.values(c).forEach((R) => R.unsub()), delete o[l];
      }, x = ({
        cb: R = d,
        filter: L = p,
        beforeSend: j = y
      }) => (Object.entries(c).map(([U, q]) => [
        U,
        q.sub({ cb: (k) => R(k, U), filter: L, beforeSend: j }, l)
      ]), o[l]), E = (R) => (c[R.url] = R.sub(
        { cb: (L) => s(L, R.url), filter: f, beforeSend: h },
        l
      ), o[l]), I = (R) => (R in c && (c[R].unsub(), Object.keys(c).length === 0 && g()), o[l]);
      return o[l] = {
        sub: x,
        unsub: g,
        addRelay: E,
        removeRelay: I
      }, o[l];
    },
    relays: n,
    setPrivateKey(s) {
      e = s;
    },
    registerSigningFunction(s) {
      t = s;
    },
    setPolicy(s, f) {
      r[s] = f;
    },
    addRelay(s, f = { read: !0, write: !0 }) {
      let h = _i(s);
      if (h in n)
        return;
      let l = _d(s, (c) => {
        a(c, h);
      });
      return n[h] = { relay: l, policy: f }, f.read && Object.values(o).forEach(
        (c) => c.addRelay(l)
      ), l;
    },
    removeRelay(s) {
      let f = _i(s), h = n[f];
      if (!h)
        return;
      let { relay: l } = h;
      Object.values(o).forEach(
        (c) => c.removeRelay(l)
      ), l.close(), delete n[f];
    },
    onNotice(s) {
      i.push(s);
    },
    offNotice(s) {
      let f = i.indexOf(s);
      f !== -1 && i.splice(f, 1);
    },
    async publish(s, f) {
      if (s.id = Di(s), !s.sig)
        if (s.tags = s.tags || [], e)
          s.sig = await hd(s, e);
        else if (t)
          if (s.sig = await t(s), s.sig) {
            if (!await ru(s))
              throw new Error(
                "signature provided by custom signing function is invalid."
              );
          } else
            return;
        else
          throw new Error(
            "can't publish unsigned event. either sign this event beforehand, provide a signing function or pass a private key while initializing this relay pool so it can be signed automatically."
          );
      let h = Object.values(n).filter(({ policy: d }) => d.write).sort(() => Math.random() - 0.5), l = r.randomChoice ? r.randomChoice : h.length, c = 0;
      if (r.wait)
        for (let d = 0; d < h.length; d++) {
          let { relay: p } = h[d];
          try {
            if (await new Promise(async (y, g) => {
              try {
                await p.publish(s, (x) => {
                  f && f(x, p.url), y();
                });
              } catch {
                f && f(-1, p.url);
              }
            }), c++, c >= l)
              break;
          } catch {
          }
        }
      else
        h.forEach(async ({ relay: d }) => {
          let p = f ? (y) => f(y, d.url) : null;
          d.publish(s, p);
        });
      return s;
    }
  };
}
const tn = vd();
tn.addRelay("wss://relay.nostr.info", { read: !0, write: !0 });
const bt = [];
function yd(e, t = we) {
  let r;
  const n = /* @__PURE__ */ new Set();
  function i(u) {
    if (yi(e, u) && (e = u, r)) {
      const s = !bt.length;
      for (const f of n)
        f[1](), bt.push(f, e);
      if (s) {
        for (let f = 0; f < bt.length; f += 2)
          bt[f][0](bt[f + 1]);
        bt.length = 0;
      }
    }
  }
  function a(u) {
    i(u(e));
  }
  function o(u, s = we) {
    const f = [u, s];
    return n.add(f), n.size === 1 && (r = t(i) || we), u(e), () => {
      n.delete(f), n.size === 0 && (r(), r = null);
    };
  }
  return { set: i, update: a, subscribe: o };
}
const At = yd(null);
At.subscribe((e) => {
  !e || localStorage.setItem("activeProfile", JSON.stringify(e));
});
At.set(JSON.parse(localStorage.getItem("activeProfile")));
function wa(e, t, r) {
  const n = e.slice();
  return n[9] = t[r], n;
}
function xa(e) {
  let t;
  return {
    c() {
      t = X("span"), t.textContent = "Trusted Author", Re(t, "class", "trusted");
    },
    m(r, n) {
      ve(r, t, n);
    },
    d(r) {
      r && be(t);
    }
  };
}
function ma(e) {
  let t, r, n, i = e[9].pubkey.slice(0, 7) + "", a, o, u = e[1].trustedAuthors.includes(e[9].pubkey), s, f, h, l = e[9].content + "", c, d, p, y, g = L() + "", x, E, I, R = u && xa();
  function L() {
    return e[6](e[9]);
  }
  return {
    c() {
      t = X("div"), r = X("p"), n = Oe("From: "), a = Oe(i), o = he(), R && R.c(), s = he(), f = X("p"), h = Oe("Content: "), c = Oe(l), d = he(), p = X("p"), y = Oe("Sentiment: "), x = Oe(g), E = he(), I = X("hr"), Re(t, "class", "opinion-container");
    },
    m(j, U) {
      ve(j, t, U), D(t, r), D(r, n), D(r, a), D(r, o), R && R.m(r, null), D(t, s), D(t, f), D(f, h), D(f, c), D(t, d), D(t, p), D(p, y), D(p, x), ve(j, E, U), ve(j, I, U);
    },
    p(j, U) {
      e = j, U & 4 && i !== (i = e[9].pubkey.slice(0, 7) + "") && fr(a, i), U & 6 && (u = e[1].trustedAuthors.includes(e[9].pubkey)), u ? R || (R = xa(), R.c(), R.m(r, null)) : R && (R.d(1), R = null), U & 4 && l !== (l = e[9].content + "") && fr(c, l), U & 4 && g !== (g = L() + "") && fr(x, g);
    },
    d(j) {
      j && be(t), R && R.d(), j && be(E), j && be(I);
    }
  };
}
function Ea(e) {
  let t;
  return {
    c() {
      t = X("span"), t.textContent = "not logged in";
    },
    m(r, n) {
      ve(r, t, n);
    },
    d(r) {
      r && be(t);
    }
  };
}
function gd(e) {
  let t, r, n, i, a, o, u, s, f, h, l, c, d, p, y, g, x, E, I, R, L, j, U, q, k, de = e[2], Z = [];
  for (let M = 0; M < de.length; M += 1)
    Z[M] = ma(wa(e, de, M));
  let ne = !e[4] && Ea();
  return {
    c() {
      t = X("h1"), r = Oe("Opinions for "), n = Oe(e[0]), i = he();
      for (let M = 0; M < Z.length; M += 1)
        Z[M].c();
      a = he(), o = X("h3"), o.textContent = "Create new opinion", u = he(), s = X("form"), f = X("label"), f.textContent = "Content", h = he(), l = X("input"), c = he(), d = X("label"), d.textContent = "Sentiment", p = he(), y = X("select"), g = X("option"), g.textContent = "negative", x = X("option"), x.textContent = "neutral", E = X("option"), E.textContent = "positive", I = he(), R = X("button"), L = Oe("Submit"), U = he(), ne && ne.c(), this.c = we, Re(f, "for", "content"), Re(l, "id", "content"), Re(l, "type", "text"), Re(d, "for", "sentiment"), g.__value = "-1", g.value = g.__value, x.__value = "0", x.value = x.__value, E.__value = "1", E.value = E.__value, Re(y, "name", "sentiment"), Re(y, "id", "sentiment"), e[3].sentiment === void 0 && zr(() => e[8].call(y)), Re(R, "type", "submit"), R.disabled = j = !e[4];
    },
    m(M, Y) {
      ve(M, t, Y), D(t, r), D(t, n), ve(M, i, Y);
      for (let z = 0; z < Z.length; z += 1)
        Z[z].m(M, Y);
      ve(M, a, Y), ve(M, o, Y), ve(M, u, Y), ve(M, s, Y), D(s, f), D(s, h), D(s, l), Wr(l, e[3].content), D(s, c), D(s, d), D(s, p), D(s, y), D(y, g), D(y, x), D(y, E), Hi(y, e[3].sentiment), D(s, I), D(s, R), D(R, L), D(s, U), ne && ne.m(s, null), q || (k = [
        tt(l, "input", e[7]),
        tt(y, "change", e[8]),
        tt(s, "submit", Ra(e[5]))
      ], q = !0);
    },
    p(M, [Y]) {
      if (Y & 1 && fr(n, M[0]), Y & 6) {
        de = M[2];
        let z;
        for (z = 0; z < de.length; z += 1) {
          const Ye = wa(M, de, z);
          Z[z] ? Z[z].p(Ye, Y) : (Z[z] = ma(Ye), Z[z].c(), Z[z].m(a.parentNode, a));
        }
        for (; z < Z.length; z += 1)
          Z[z].d(1);
        Z.length = de.length;
      }
      Y & 8 && l.value !== M[3].content && Wr(l, M[3].content), Y & 8 && Hi(y, M[3].sentiment), Y & 16 && j !== (j = !M[4]) && (R.disabled = j), M[4] ? ne && (ne.d(1), ne = null) : ne || (ne = Ea(), ne.c(), ne.m(s, null));
    },
    i: we,
    o: we,
    d(M) {
      M && be(t), M && be(i), su(Z, M), M && be(a), M && be(o), M && be(u), M && be(s), ne && ne.d(), q = !1, st(k);
    }
  };
}
function bd(e, t, r) {
  let n;
  Sa(e, At, (c) => r(4, n = c));
  let { name: i } = t, a, o = [], u = { content: "", sentiment: "0" };
  const s = async () => {
    if (!u.content || !n)
      return;
    const c = {
      kind: 30234,
      content: u.content,
      tags: [["d", i], ["sentiment", u.sentiment]],
      pubkey: n.pubkey,
      created_at: Math.floor(Date.now() / 1e3)
    };
    await tn.publish(c, () => {
      const d = o.findIndex((p) => p.pubkey === c.pubkey);
      d !== -1 ? r(2, o[d] = c, o) : r(2, o = [c, ...o]);
    });
  };
  cu(async () => {
    r(1, a = (await Promise.resolve().then(() => Od)).expertOpinions);
    let c = 0;
    const d = tn.sub({
      cb: (p, y) => {
        r(2, o = [...o, p]), c += 1, c > 5 && d.unsub();
      },
      filter: { kinds: [30234], "#d": [i] }
    });
    setTimeout(
      () => {
        d.unsub();
      },
      5e3
    );
  });
  const f = (c) => {
    const d = c.tags.find((p) => p[0] === "sentiment")?.[1];
    return `${d} - ${d === "-1" ? "negative" : d === "0" ? "neutral" : "positive"}`;
  };
  function h() {
    u.content = this.value, r(3, u);
  }
  function l() {
    u.sentiment = fu(this), r(3, u);
  }
  return e.$$set = (c) => {
    "name" in c && r(0, i = c.name);
  }, [
    i,
    a,
    o,
    u,
    n,
    s,
    f,
    h,
    l
  ];
}
class wd extends gi {
  constructor(t) {
    super(), this.shadowRoot.innerHTML = "<style>.trusted{color:#01b201}</style>", Aa(
      this,
      {
        target: this.shadowRoot,
        props: Oa(this.attributes),
        customElement: !0
      },
      bd,
      gd,
      yi,
      { name: 0 },
      null
    ), t && (t.target && ve(t.target, this, t.anchor), t.props && (this.$set(t.props), Gr()));
  }
  static get observedAttributes() {
    return ["name"];
  }
  get name() {
    return this.$$.ctx[0];
  }
  set name(t) {
    this.$$set({ name: t }), Gr();
  }
}
customElements.define("nostr-opinion", wd);
function xd(e) {
  let t, r, n, i = e[1]?.pubkey + "", a, o, u, s, f, h, l, c, d, p, y;
  return {
    c() {
      t = X("form"), r = X("p"), n = Oe("Logged in with pubkey: "), a = Oe(i), o = he(), u = X("label"), u.textContent = "Private Key", s = he(), f = X("input"), h = he(), l = X("button"), l.textContent = "Login", c = he(), d = X("button"), d.textContent = "Generate", this.c = we, Re(u, "for", "privkey"), Re(f, "id", "privkey"), Re(f, "type", "text");
    },
    m(g, x) {
      ve(g, t, x), D(t, r), D(r, n), D(r, a), D(t, o), D(t, u), D(t, s), D(t, f), Wr(f, e[0]), D(t, h), D(t, l), D(t, c), D(t, d), p || (y = [
        tt(f, "input", e[4]),
        tt(l, "click", e[2]),
        tt(d, "click", e[5]),
        tt(t, "submit", Ra(e[3]))
      ], p = !0);
    },
    p(g, [x]) {
      x & 2 && i !== (i = g[1]?.pubkey + "") && fr(a, i), x & 1 && f.value !== g[0] && Wr(f, g[0]);
    },
    i: we,
    o: we,
    d(g) {
      g && be(t), p = !1, st(y);
    }
  };
}
function md(e, t, r) {
  let n;
  Sa(e, At, (f) => r(1, n = f));
  let i = "";
  const a = () => {
    !i || au(At, n = { privkey: i, pubkey: vf(i) }, n);
  };
  function o(f) {
    hu.call(this, e, f);
  }
  function u() {
    i = this.value, r(0, i);
  }
  return [
    i,
    n,
    a,
    o,
    u,
    () => r(0, i = _f())
  ];
}
class Ed extends gi {
  constructor(t) {
    super(), Aa(
      this,
      {
        target: this.shadowRoot,
        props: Oa(this.attributes),
        customElement: !0
      },
      md,
      xd,
      yi,
      {},
      null
    ), t && t.target && ve(t.target, this, t.anchor);
  }
}
customElements.define("nostr-opinion-login", Ed);
class Sd {
  trustedAuthors;
  onlyTrusted = !1;
  constructor() {
    At.subscribe((t) => {
      tn.setPrivateKey(t?.privkey);
    });
  }
}
const Rd = new Sd(), Od = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  expertOpinions: Rd
}, Symbol.toStringTag, { value: "Module" }));
export {
  Rd as expertOpinions
};
