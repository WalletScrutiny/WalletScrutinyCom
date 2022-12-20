function be() {
}
function _i(e) {
  return e();
}
function Fi() {
  return /* @__PURE__ */ Object.create(null);
}
function st(e) {
  e.forEach(_i);
}
function ri(e) {
  return typeof e == "function";
}
function vi(e, t) {
  return e != e ? t == t : e !== t || e && typeof e == "object" || typeof e == "function";
}
function nu(e) {
  return Object.keys(e).length === 0;
}
function iu(e, ...t) {
  if (e == null)
    return be;
  const r = e.subscribe(...t);
  return r.unsubscribe ? () => r.unsubscribe() : r;
}
function Ea(e, t, r) {
  e.$$.on_destroy.push(iu(t, r));
}
function ou(e, t, r) {
  return e.set(r), t;
}
function q(e, t) {
  e.appendChild(t);
}
function de(e, t, r) {
  e.insertBefore(t, r || null);
}
function ve(e) {
  e.parentNode && e.parentNode.removeChild(e);
}
function au(e, t) {
  for (let r = 0; r < e.length; r += 1)
    e[r] && e[r].d(t);
}
function Y(e) {
  return document.createElement(e);
}
function ce(e) {
  return document.createTextNode(e);
}
function he() {
  return ce(" ");
}
function su() {
  return ce("");
}
function tt(e, t, r, n) {
  return e.addEventListener(t, r, n), () => e.removeEventListener(t, r, n);
}
function Sa(e) {
  return function(t) {
    return t.preventDefault(), e.call(this, t);
  };
}
function ge(e, t, r) {
  r == null ? e.removeAttribute(t) : e.getAttribute(t) !== r && e.setAttribute(t, r);
}
function uu(e) {
  return Array.from(e.childNodes);
}
function et(e, t) {
  t = "" + t, e.wholeText !== t && (e.data = t);
}
function Wr(e, t) {
  e.value = t ?? "";
}
function Ui(e, t) {
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
function Ra(e) {
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
const fr = [], Hi = [], Nr = [], $i = [], du = Promise.resolve();
let ni = !1;
function pu() {
  ni || (ni = !0, du.then(Gr));
}
function zr(e) {
  Nr.push(e);
}
const On = /* @__PURE__ */ new Set();
let Cr = 0;
function Gr() {
  const e = _r;
  do {
    for (; Cr < fr.length; ) {
      const t = fr[Cr];
      Cr++, lr(t), _u(t.$$);
    }
    for (lr(null), fr.length = 0, Cr = 0; Hi.length; )
      Hi.pop()();
    for (let t = 0; t < Nr.length; t += 1) {
      const r = Nr[t];
      On.has(r) || (On.add(r), r());
    }
    Nr.length = 0;
  } while (fr.length);
  for (; $i.length; )
    $i.pop()();
  ni = !1, On.clear(), lr(e);
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
  const { fragment: i, after_update: o } = e.$$;
  i && i.m(t, r), n || zr(() => {
    const a = e.$$.on_mount.map(_i).filter(ri);
    e.$$.on_destroy ? e.$$.on_destroy.push(...a) : st(a), e.$$.on_mount = [];
  }), o.forEach(zr);
}
function bu(e, t) {
  const r = e.$$;
  r.fragment !== null && (st(r.on_destroy), r.fragment && r.fragment.d(t), r.on_destroy = r.fragment = null, r.ctx = []);
}
function wu(e, t) {
  e.$$.dirty[0] === -1 && (fr.push(e), pu(), e.$$.dirty.fill(0)), e.$$.dirty[t / 31 | 0] |= 1 << t % 31;
}
function Oa(e, t, r, n, i, o, a, u = [-1]) {
  const s = _r;
  lr(e);
  const f = e.$$ = {
    fragment: null,
    ctx: [],
    props: o,
    update: be,
    not_equal: i,
    bound: Fi(),
    on_mount: [],
    on_destroy: [],
    on_disconnect: [],
    before_update: [],
    after_update: [],
    context: new Map(t.context || (s ? s.$$.context : [])),
    callbacks: Fi(),
    dirty: u,
    skip_bound: !1,
    root: t.target || s.$$.root
  };
  a && a(f.root);
  let h = !1;
  if (f.ctx = r ? r(e, t.props || {}, (l, c, ...d) => {
    const p = d.length ? d[0] : c;
    return f.ctx && i(f.ctx[l], f.ctx[l] = p) && (!f.skip_bound && f.bound[l] && f.bound[l](p), h && wu(e, l)), c;
  }) : [], f.update(), h = !0, st(f.before_update), f.fragment = n ? n(f.ctx) : !1, t.target) {
    if (t.hydrate) {
      const l = uu(t.target);
      f.fragment && f.fragment.l(l), l.forEach(ve);
    } else
      f.fragment && f.fragment.c();
    t.intro && yu(e.$$.fragment), gu(e, t.target, t.anchor, t.customElement), Gr();
  }
  lr(s);
}
let yi;
typeof HTMLElement == "function" && (yi = class extends HTMLElement {
  constructor() {
    super(), this.attachShadow({ mode: "open" });
  }
  connectedCallback() {
    const { on_mount: e } = this.$$;
    this.$$.on_disconnect = e.map(_i).filter(ri);
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
    bu(this, 1), this.$destroy = be;
  }
  $on(e, t) {
    if (!ri(t))
      return be;
    const r = this.$$.callbacks[e] || (this.$$.callbacks[e] = []);
    return r.push(t), () => {
      const n = r.indexOf(t);
      n !== -1 && r.splice(n, 1);
    };
  }
  $set(e) {
    this.$$set && !nu(e) && (this.$$.skip_bound = !0, this.$$set(e), this.$$.skip_bound = !1);
  }
});
const bt = [];
function xu(e, t = be) {
  let r;
  const n = /* @__PURE__ */ new Set();
  function i(u) {
    if (vi(e, u) && (e = u, r)) {
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
  function o(u) {
    i(u(e));
  }
  function a(u, s = be) {
    const f = [u, s];
    return n.add(f), n.size === 1 && (r = t(i) || be), u(e), () => {
      n.delete(f), n.size === 0 && (r(), r = null);
    };
  }
  return { set: i, update: o, subscribe: a };
}
const Et = xu(null);
Et.subscribe((e) => {
  !e || localStorage.setItem("activeProfile", JSON.stringify(e));
});
Et.set(JSON.parse(localStorage.getItem("activeProfile")));
function Wi(e, t, r) {
  const n = e.slice();
  return n[12] = t[r], n;
}
function mu(e) {
  let t, r, n, i, o, a, u, s, f, h, l, c, d, p, _, g, m, x, A, T, k, j = e[2], P = [];
  for (let I = 0; I < j.length; I += 1)
    P[I] = Gi(Wi(e, j, I));
  let B = !e[6] && Yi();
  return {
    c() {
      for (let I = 0; I < P.length; I += 1)
        P[I].c();
      t = he(), r = Y("h3"), r.textContent = "Create new opinion", n = he(), i = Y("form"), o = Y("label"), o.textContent = "Content", a = he(), u = Y("input"), s = he(), f = Y("label"), f.textContent = "Sentiment", h = he(), l = Y("select"), c = Y("option"), c.textContent = "negative", d = Y("option"), d.textContent = "neutral", p = Y("option"), p.textContent = "positive", _ = he(), g = Y("button"), m = ce("Submit"), A = he(), B && B.c(), ge(o, "for", "content"), ge(u, "id", "content"), ge(u, "type", "text"), ge(f, "for", "sentiment"), c.__value = "-1", c.value = c.__value, d.__value = "0", d.value = d.__value, p.__value = "1", p.value = p.__value, ge(l, "name", "sentiment"), ge(l, "id", "sentiment"), e[4].sentiment === void 0 && zr(() => e[10].call(l)), ge(g, "type", "submit"), g.disabled = x = !e[6];
    },
    m(I, V) {
      for (let N = 0; N < P.length; N += 1)
        P[N].m(I, V);
      de(I, t, V), de(I, r, V), de(I, n, V), de(I, i, V), q(i, o), q(i, a), q(i, u), Wr(u, e[4].content), q(i, s), q(i, f), q(i, h), q(i, l), q(l, c), q(l, d), q(l, p), Ui(l, e[4].sentiment), q(i, _), q(i, g), q(g, m), q(i, A), B && B.m(i, null), T || (k = [
        tt(u, "input", e[9]),
        tt(l, "change", e[10]),
        tt(i, "submit", Sa(e[7]))
      ], T = !0);
    },
    p(I, V) {
      if (V & 14) {
        j = I[2];
        let N;
        for (N = 0; N < j.length; N += 1) {
          const ye = Wi(I, j, N);
          P[N] ? P[N].p(ye, V) : (P[N] = Gi(ye), P[N].c(), P[N].m(t.parentNode, t));
        }
        for (; N < P.length; N += 1)
          P[N].d(1);
        P.length = j.length;
      }
      V & 16 && u.value !== I[4].content && Wr(u, I[4].content), V & 16 && Ui(l, I[4].sentiment), V & 64 && x !== (x = !I[6]) && (g.disabled = x), I[6] ? B && (B.d(1), B = null) : B || (B = Yi(), B.c(), B.m(i, null));
    },
    d(I) {
      au(P, I), I && ve(t), I && ve(r), I && ve(n), I && ve(i), B && B.d(), T = !1, st(k);
    }
  };
}
function Eu(e) {
  let t;
  return {
    c() {
      t = Y("p"), t.textContent = "Loading...";
    },
    m(r, n) {
      de(r, t, n);
    },
    p: be,
    d(r) {
      r && ve(t);
    }
  };
}
function zi(e) {
  let t;
  return {
    c() {
      t = Y("span"), t.textContent = "Trusted Author", ge(t, "class", "trusted");
    },
    m(r, n) {
      de(r, t, n);
    },
    d(r) {
      r && ve(t);
    }
  };
}
function Gi(e) {
  let t, r, n, i, o = (e[3][e[12].pubkey] || "") + "", a, u, s = e[12].pubkey.slice(0, 7) + "", f, h, l = e[1].trustedAuthors.includes(e[12].pubkey), c, d, p, _ = ye() + "", g, m, x, A = e[12].content + "", T, k, j, P = new Date(e[12].created_at * 1e3).toLocaleDateString() + "", B, I, V, N = l && zi();
  function ye() {
    return e[8](e[12]);
  }
  return {
    c() {
      t = Y("div"), r = Y("p"), n = ce(`From:
				`), i = Y("strong"), a = ce(o), u = ce(`
				(`), f = ce(s), h = ce(`)
				`), N && N.c(), c = he(), d = Y("p"), p = ce("Sentiment: "), g = ce(_), m = he(), x = Y("p"), T = ce(A), k = he(), j = Y("p"), B = ce(P), I = he(), V = Y("hr"), ge(x, "class", "content"), ge(j, "class", "date"), ge(t, "class", "opinion-container");
    },
    m($, ee) {
      de($, t, ee), q(t, r), q(r, n), q(r, i), q(i, a), q(r, u), q(r, f), q(r, h), N && N.m(r, null), q(t, c), q(t, d), q(d, p), q(d, g), q(t, m), q(t, x), q(x, T), q(t, k), q(t, j), q(j, B), de($, I, ee), de($, V, ee);
    },
    p($, ee) {
      e = $, ee & 12 && o !== (o = (e[3][e[12].pubkey] || "") + "") && et(a, o), ee & 4 && s !== (s = e[12].pubkey.slice(0, 7) + "") && et(f, s), ee & 6 && (l = e[1].trustedAuthors.includes(e[12].pubkey)), l ? N || (N = zi(), N.c(), N.m(r, null)) : N && (N.d(1), N = null), ee & 4 && _ !== (_ = ye() + "") && et(g, _), ee & 4 && A !== (A = e[12].content + "") && et(T, A), ee & 4 && P !== (P = new Date(e[12].created_at * 1e3).toLocaleDateString() + "") && et(B, P);
    },
    d($) {
      $ && ve(t), N && N.d(), $ && ve(I), $ && ve(V);
    }
  };
}
function Yi(e) {
  let t;
  return {
    c() {
      t = Y("span"), t.textContent = "not logged in";
    },
    m(r, n) {
      de(r, t, n);
    },
    d(r) {
      r && ve(t);
    }
  };
}
function Su(e) {
  let t, r, n, i, o;
  function a(f, h) {
    return f[5] ? Eu : mu;
  }
  let u = a(e), s = u(e);
  return {
    c() {
      t = Y("h1"), r = ce("Opinions for "), n = ce(e[0]), i = he(), s.c(), o = su(), this.c = be;
    },
    m(f, h) {
      de(f, t, h), q(t, r), q(t, n), de(f, i, h), s.m(f, h), de(f, o, h);
    },
    p(f, [h]) {
      h & 1 && et(n, f[0]), u === (u = a(f)) && s ? s.p(f, h) : (s.d(1), s = u(f), s && (s.c(), s.m(o.parentNode, o)));
    },
    i: be,
    o: be,
    d(f) {
      f && ve(t), f && ve(i), s.d(f), f && ve(o);
    }
  };
}
function Ru(e, t, r) {
  let n;
  Ea(e, Et, (_) => r(6, n = _));
  let { name: i } = t, o, a = [], u = {}, s = { content: "", sentiment: "0" }, f = !0;
  const h = async () => {
    if (!s.content || !n)
      return;
    const _ = {
      kind: 30234,
      content: s.content,
      tags: [["d", i], ["sentiment", s.sentiment]],
      pubkey: n.pubkey,
      created_at: Math.floor(Date.now() / 1e3)
    };
    await o.nostr.publish(_, () => {
      const g = a.findIndex((m) => m.pubkey === _.pubkey);
      g !== -1 ? r(2, a[g] = _, a) : r(2, a = [_, ...a]), l();
    });
  }, l = () => {
    r(2, a = a.sort((_, g) => {
      const m = o.trustedAuthors.includes(_.pubkey), x = o.trustedAuthors.includes(g.pubkey);
      return m && !x ? -1 : !m && x ? 1 : _.created_at > g.created_at ? -1 : _.created_at < g.created_at ? 1 : 0;
    }));
  };
  cu(async () => {
    r(1, o = (await Promise.resolve().then(() => Id)).expertOpinions), await o.onReady, r(5, f = !1);
    const _ = o.nostr.sub(
      {
        cb: (g) => {
          r(2, a = [...a, g]), console.log(a);
          let m = o.nostr.sub(
            {
              cb: (x) => {
                const A = JSON.parse(x.content);
                r(3, u[g.pubkey] = A.name, u);
              },
              filter: {
                kinds: [0],
                authors: [g.pubkey],
                limit: 1
              }
            },
            null,
            () => {
              m.unsub();
            }
          );
        },
        filter: { kinds: [30234], "#d": [i], limit: 5 }
      },
      null,
      () => {
        l(), _.unsub();
      }
    );
  });
  const c = (_) => {
    const g = _.tags.find((m) => m[0] === "sentiment")?.[1];
    return `${g === "-1" ? "Negative \u{1F641}" : g === "0" ? "Neutral \u{1F610}" : "Positive \u{1F642}"}`;
  };
  function d() {
    s.content = this.value, r(4, s);
  }
  function p() {
    s.sentiment = fu(this), r(4, s);
  }
  return e.$$set = (_) => {
    "name" in _ && r(0, i = _.name);
  }, [
    i,
    o,
    a,
    u,
    s,
    f,
    n,
    h,
    c,
    d,
    p
  ];
}
class Ou extends yi {
  constructor(t) {
    super(), this.shadowRoot.innerHTML = "<style>.trusted{color:#01b201}.content{font-size:1.3rem}.date{font-size:0.8rem}</style>", Oa(
      this,
      {
        target: this.shadowRoot,
        props: Ra(this.attributes),
        customElement: !0
      },
      Ru,
      Su,
      vi,
      { name: 0 },
      null
    ), t && (t.target && de(t.target, this, t.anchor), t.props && (this.$set(t.props), Gr()));
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
customElements.define("nostr-opinion", Ou);
const Au = {}, Iu = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Au
}, Symbol.toStringTag, { value: "Module" }));
/*! noble-secp256k1 - MIT License (c) 2019 Paul Miller (paulmillr.com) */
const H = BigInt(0), Q = BigInt(1), Ve = BigInt(2), cr = BigInt(3), Tu = BigInt(8), Z = Object.freeze({
  a: H,
  b: BigInt(7),
  P: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),
  n: BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),
  h: Q,
  Gx: BigInt("55066263022277343669578718895168534326250603453777594175500187360389116729240"),
  Gy: BigInt("32670510020758816978083085130507043184471273380659243275938904335757337482424"),
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee")
});
function Vi(e) {
  const { a: t, b: r } = Z, n = C(e * e), i = C(n * e);
  return C(i + t * e + r);
}
const Mr = Z.a === H;
class Aa extends Error {
  constructor(t) {
    super(t);
  }
}
class W {
  constructor(t, r, n) {
    this.x = t, this.y = r, this.z = n;
  }
  static fromAffine(t) {
    if (!(t instanceof X))
      throw new TypeError("JacobianPoint#fromAffine: expected Point");
    return new W(t.x, t.y, Q);
  }
  static toAffineBatch(t) {
    const r = Lu(t.map((n) => n.z));
    return t.map((n, i) => n.toAffine(r[i]));
  }
  static normalizeZ(t) {
    return W.toAffineBatch(t).map(W.fromAffine);
  }
  equals(t) {
    if (!(t instanceof W))
      throw new TypeError("JacobianPoint expected");
    const { x: r, y: n, z: i } = this, { x: o, y: a, z: u } = t, s = C(i * i), f = C(u * u), h = C(r * f), l = C(o * s), c = C(C(n * u) * f), d = C(C(a * i) * s);
    return h === l && c === d;
  }
  negate() {
    return new W(this.x, C(-this.y), this.z);
  }
  double() {
    const { x: t, y: r, z: n } = this, i = C(t * t), o = C(r * r), a = C(o * o), u = t + o, s = C(Ve * (C(u * u) - i - a)), f = C(cr * i), h = C(f * f), l = C(h - Ve * s), c = C(f * (s - l) - Tu * a), d = C(Ve * r * n);
    return new W(l, c, d);
  }
  add(t) {
    if (!(t instanceof W))
      throw new TypeError("JacobianPoint expected");
    const { x: r, y: n, z: i } = this, { x: o, y: a, z: u } = t;
    if (o === H || a === H)
      return this;
    if (r === H || n === H)
      return t;
    const s = C(i * i), f = C(u * u), h = C(r * f), l = C(o * s), c = C(C(n * u) * f), d = C(C(a * i) * s), p = C(l - h), _ = C(d - c);
    if (p === H)
      return _ === H ? this.double() : W.ZERO;
    const g = C(p * p), m = C(p * g), x = C(h * g), A = C(_ * _ - m - Ve * x), T = C(_ * (x - A) - c * m), k = C(i * u * p);
    return new W(A, T, k);
  }
  subtract(t) {
    return this.add(t.negate());
  }
  multiplyUnsafe(t) {
    const r = W.ZERO;
    if (typeof t == "bigint" && t === H)
      return r;
    let n = Xi(t);
    if (n === Q)
      return this;
    if (!Mr) {
      let l = r, c = this;
      for (; n > H; )
        n & Q && (l = l.add(c)), c = c.double(), n >>= Q;
      return l;
    }
    let { k1neg: i, k1: o, k2neg: a, k2: u } = Ji(n), s = r, f = r, h = this;
    for (; o > H || u > H; )
      o & Q && (s = s.add(h)), u & Q && (f = f.add(h)), h = h.double(), o >>= Q, u >>= Q;
    return i && (s = s.negate()), a && (f = f.negate()), f = new W(C(f.x * Z.beta), f.y, f.z), s.add(f);
  }
  precomputeWindow(t) {
    const r = Mr ? 128 / t + 1 : 256 / t + 1, n = [];
    let i = this, o = i;
    for (let a = 0; a < r; a++) {
      o = i, n.push(o);
      for (let u = 1; u < 2 ** (t - 1); u++)
        o = o.add(i), n.push(o);
      i = o.double();
    }
    return n;
  }
  wNAF(t, r) {
    !r && this.equals(W.BASE) && (r = X.BASE);
    const n = r && r._WINDOW_SIZE || 1;
    if (256 % n)
      throw new Error("Point#wNAF: Invalid precomputation window, must be power of 2");
    let i = r && ii.get(r);
    i || (i = this.precomputeWindow(n), r && n !== 1 && (i = W.normalizeZ(i), ii.set(r, i)));
    let o = W.ZERO, a = W.ZERO;
    const u = 1 + (Mr ? 128 / n : 256 / n), s = 2 ** (n - 1), f = BigInt(2 ** n - 1), h = 2 ** n, l = BigInt(n);
    for (let c = 0; c < u; c++) {
      const d = c * s;
      let p = Number(t & f);
      if (t >>= l, p > s && (p -= h, t += Q), p === 0) {
        let _ = i[d];
        c % 2 && (_ = _.negate()), a = a.add(_);
      } else {
        let _ = i[d + Math.abs(p) - 1];
        p < 0 && (_ = _.negate()), o = o.add(_);
      }
    }
    return { p: o, f: a };
  }
  multiply(t, r) {
    let n = Xi(t), i, o;
    if (Mr) {
      const { k1neg: a, k1: u, k2neg: s, k2: f } = Ji(n);
      let { p: h, f: l } = this.wNAF(u, r), { p: c, f: d } = this.wNAF(f, r);
      a && (h = h.negate()), s && (c = c.negate()), c = new W(C(c.x * Z.beta), c.y, c.z), i = h.add(c), o = l.add(d);
    } else {
      const { p: a, f: u } = this.wNAF(n, r);
      i = a, o = u;
    }
    return W.normalizeZ([i, o])[0];
  }
  toAffine(t = tn(this.z)) {
    const { x: r, y: n, z: i } = this, o = t, a = C(o * o), u = C(a * o), s = C(r * a), f = C(n * u);
    if (C(i * o) !== Q)
      throw new Error("invZ was invalid");
    return new X(s, f);
  }
}
W.BASE = new W(Z.Gx, Z.Gy, Q);
W.ZERO = new W(H, Q, H);
const ii = /* @__PURE__ */ new WeakMap();
class X {
  constructor(t, r) {
    this.x = t, this.y = r;
  }
  _setWindowSize(t) {
    this._WINDOW_SIZE = t, ii.delete(this);
  }
  hasEvenY() {
    return this.y % Ve === H;
  }
  static fromCompressedHex(t) {
    const r = t.length === 32, n = Oe(r ? t : t.subarray(1));
    if (!Fr(n))
      throw new Error("Point is not on curve");
    const i = Vi(n);
    let o = Bu(i);
    const a = (o & Q) === Q;
    r ? a && (o = C(-o)) : (t[0] & 1) === 1 !== a && (o = C(-o));
    const u = new X(n, o);
    return u.assertValidity(), u;
  }
  static fromUncompressedHex(t) {
    const r = Oe(t.subarray(1, 33)), n = Oe(t.subarray(33, 65)), i = new X(r, n);
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
    return X.BASE.multiply(gr(t));
  }
  static fromSignature(t, r, n) {
    t = ot(t);
    const i = qu(t), { r: o, s: a } = ju(r);
    if (n !== 0 && n !== 1)
      throw new Error("Cannot recover signature: invalid recovery bit");
    const u = n & 1 ? "03" : "02", s = X.fromHex(u + Ke(o)), { n: f } = Z, h = tn(o, f), l = C(-i * h, f), c = C(a * h, f), d = X.BASE.multiplyAndAddUnsafe(s, l, c);
    if (!d)
      throw new Error("Cannot recover signature: point at infinify");
    return d.assertValidity(), d;
  }
  toRawBytes(t = !1) {
    return Ze(this.toHex(t));
  }
  toHex(t = !1) {
    const r = Ke(this.x);
    return t ? `${this.hasEvenY() ? "02" : "03"}${r}` : `04${r}${Ke(this.y)}`;
  }
  toHexX() {
    return this.toHex(!0).slice(2);
  }
  toRawX() {
    return this.toRawBytes(!0).slice(1);
  }
  assertValidity() {
    const t = "Point is not on elliptic curve", { x: r, y: n } = this;
    if (!Fr(r) || !Fr(n))
      throw new Error(t);
    const i = C(n * n), o = Vi(r);
    if (C(i - o) !== H)
      throw new Error(t);
  }
  equals(t) {
    return this.x === t.x && this.y === t.y;
  }
  negate() {
    return new X(this.x, C(-this.y));
  }
  double() {
    return W.fromAffine(this).double().toAffine();
  }
  add(t) {
    return W.fromAffine(this).add(W.fromAffine(t)).toAffine();
  }
  subtract(t) {
    return this.add(t.negate());
  }
  multiply(t) {
    return W.fromAffine(this).multiply(t, this).toAffine();
  }
  multiplyAndAddUnsafe(t, r, n) {
    const i = W.fromAffine(this), o = r === H || r === Q || this !== X.BASE ? i.multiplyUnsafe(r) : i.multiply(r), a = W.fromAffine(t).multiplyUnsafe(n), u = o.add(a);
    return u.equals(W.ZERO) ? void 0 : u.toAffine();
  }
}
X.BASE = new X(Z.Gx, Z.Gy);
X.ZERO = new X(H, H);
function Ki(e) {
  return Number.parseInt(e[0], 16) >= 8 ? "00" + e : e;
}
function Zi(e) {
  if (e.length < 2 || e[0] !== 2)
    throw new Error(`Invalid signature integer tag: ${St(e)}`);
  const t = e[1], r = e.subarray(2, t + 2);
  if (!t || r.length !== t)
    throw new Error("Invalid signature integer: wrong length");
  if (r[0] === 0 && r[1] <= 127)
    throw new Error("Invalid signature integer: trailing length");
  return { data: Oe(r), left: e.subarray(t + 2) };
}
function Cu(e) {
  if (e.length < 2 || e[0] != 48)
    throw new Error(`Invalid signature tag: ${St(e)}`);
  if (e[1] !== e.length - 2)
    throw new Error("Invalid signature: incorrect length");
  const { data: t, left: r } = Zi(e.subarray(2)), { data: n, left: i } = Zi(r);
  if (i.length)
    throw new Error(`Invalid signature: left bytes after parsing: ${St(i)}`);
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
    const i = r ? St(t) : t;
    if (i.length !== 128)
      throw new Error(`${n}: Expected 64-byte hex`);
    return new it(Yr(i.slice(0, 64)), Yr(i.slice(64, 128)));
  }
  static fromDER(t) {
    const r = t instanceof Uint8Array;
    if (typeof t != "string" && !r)
      throw new TypeError("Signature.fromDER: Expected string or Uint8Array");
    const { r: n, s: i } = Cu(r ? t : Ze(t));
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
    const t = Z.n >> Q;
    return this.s > t;
  }
  normalizeS() {
    return this.hasHighS() ? new it(this.r, Z.n - this.s) : this;
  }
  toDERRawBytes(t = !1) {
    return Ze(this.toDERHex(t));
  }
  toDERHex(t = !1) {
    const r = Ki(Lt(this.s));
    if (t)
      return r;
    const n = Ki(Lt(this.r)), i = Lt(n.length / 2), o = Lt(r.length / 2);
    return `30${Lt(n.length / 2 + r.length / 2 + 4)}02${i}${n}02${o}${r}`;
  }
  toRawBytes() {
    return this.toDERRawBytes();
  }
  toHex() {
    return this.toDERHex();
  }
  toCompactRawBytes() {
    return Ze(this.toCompactHex());
  }
  toCompactHex() {
    return Ke(this.r) + Ke(this.s);
  }
}
function Bt(...e) {
  if (!e.every((n) => n instanceof Uint8Array))
    throw new Error("Uint8Array list expected");
  if (e.length === 1)
    return e[0];
  const t = e.reduce((n, i) => n + i.length, 0), r = new Uint8Array(t);
  for (let n = 0, i = 0; n < e.length; n++) {
    const o = e[n];
    r.set(o, i), i += o.length;
  }
  return r;
}
const Mu = Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function St(e) {
  if (!(e instanceof Uint8Array))
    throw new Error("Expected Uint8Array");
  let t = "";
  for (let r = 0; r < e.length; r++)
    t += Mu[e[r]];
  return t;
}
const ku = BigInt("0x10000000000000000000000000000000000000000000000000000000000000000");
function Ke(e) {
  if (typeof e != "bigint")
    throw new Error("Expected bigint");
  if (!(H <= e && e < ku))
    throw new Error("Expected number < 2^256");
  return e.toString(16).padStart(64, "0");
}
function vr(e) {
  const t = Ze(Ke(e));
  if (t.length !== 32)
    throw new Error("Error: expected 32 bytes");
  return t;
}
function Lt(e) {
  const t = e.toString(16);
  return t.length & 1 ? `0${t}` : t;
}
function Yr(e) {
  if (typeof e != "string")
    throw new TypeError("hexToNumber: expected string, got " + typeof e);
  return BigInt(`0x${e}`);
}
function Ze(e) {
  if (typeof e != "string")
    throw new TypeError("hexToBytes: expected string, got " + typeof e);
  if (e.length % 2)
    throw new Error("hexToBytes: received invalid unpadded hex" + e.length);
  const t = new Uint8Array(e.length / 2);
  for (let r = 0; r < t.length; r++) {
    const n = r * 2, i = e.slice(n, n + 2), o = Number.parseInt(i, 16);
    if (Number.isNaN(o) || o < 0)
      throw new Error("Invalid byte sequence");
    t[r] = o;
  }
  return t;
}
function Oe(e) {
  return Yr(St(e));
}
function ot(e) {
  return e instanceof Uint8Array ? Uint8Array.from(e) : Ze(e);
}
function Xi(e) {
  if (typeof e == "number" && Number.isSafeInteger(e) && e > 0)
    return BigInt(e);
  if (typeof e == "bigint" && yr(e))
    return e;
  throw new TypeError("Expected valid private scalar: 0 < scalar < curve.n");
}
function C(e, t = Z.P) {
  const r = e % t;
  return r >= H ? r : t + r;
}
function Se(e, t) {
  const { P: r } = Z;
  let n = e;
  for (; t-- > H; )
    n *= n, n %= r;
  return n;
}
function Bu(e) {
  const { P: t } = Z, r = BigInt(6), n = BigInt(11), i = BigInt(22), o = BigInt(23), a = BigInt(44), u = BigInt(88), s = e * e * e % t, f = s * s * e % t, h = Se(f, cr) * f % t, l = Se(h, cr) * f % t, c = Se(l, Ve) * s % t, d = Se(c, n) * c % t, p = Se(d, i) * d % t, _ = Se(p, a) * p % t, g = Se(_, u) * _ % t, m = Se(g, a) * p % t, x = Se(m, cr) * f % t, A = Se(x, o) * d % t, T = Se(A, r) * s % t;
  return Se(T, Ve);
}
function tn(e, t = Z.P) {
  if (e === H || t <= H)
    throw new Error(`invert: expected positive integers, got n=${e} mod=${t}`);
  let r = C(e, t), n = t, i = H, o = Q;
  for (; r !== H; ) {
    const u = n / r, s = n % r, f = i - o * u;
    n = r, r = s, i = o, o = f;
  }
  if (n !== Q)
    throw new Error("invert: does not exist");
  return C(i, t);
}
function Lu(e, t = Z.P) {
  const r = new Array(e.length), n = e.reduce((o, a, u) => a === H ? o : (r[u] = o, C(o * a, t)), Q), i = tn(n, t);
  return e.reduceRight((o, a, u) => a === H ? o : (r[u] = C(o * r[u], t), C(o * a, t)), i), r;
}
const Qi = (e, t) => (e + t / Ve) / t, Pu = {
  a1: BigInt("0x3086d221a7d46bcde86c90e49284eb15"),
  b1: -Q * BigInt("0xe4437ed6010e88286f547fa90abfe4c3"),
  a2: BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"),
  b2: BigInt("0x3086d221a7d46bcde86c90e49284eb15"),
  POW_2_128: BigInt("0x100000000000000000000000000000000")
};
function Ji(e) {
  const { n: t } = Z, { a1: r, b1: n, a2: i, b2: o, POW_2_128: a } = Pu, u = Qi(o * e, t), s = Qi(-n * e, t);
  let f = C(e - u * r - s * i, t), h = C(-u * n - s * o, t);
  const l = f > a, c = h > a;
  if (l && (f = t - f), c && (h = t - h), f > a || h > a)
    throw new Error("splitScalarEndo: Endomorphism failed, k=" + e);
  return { k1neg: l, k1: f, k2neg: c, k2: h };
}
function qu(e) {
  const { n: t } = Z, n = e.length * 8 - 256;
  let i = Oe(e);
  return n > 0 && (i = i >> BigInt(n)), i >= t && (i -= t), i;
}
let wt, An;
function yr(e) {
  return H < e && e < Z.n;
}
function Fr(e) {
  return H < e && e < Z.P;
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
    t = Oe(e);
  } else
    throw new TypeError("Expected valid private key");
  if (!yr(t))
    throw new Error("Expected private key: 0 < key < n");
  return t;
}
function Du(e) {
  return e instanceof X ? (e.assertValidity(), e) : X.fromHex(e);
}
function ju(e) {
  if (e instanceof it)
    return e.assertValidity(), e;
  try {
    return it.fromDER(e);
  } catch {
    return it.fromCompact(e);
  }
}
function Vr(e) {
  return C(Oe(e), Z.n);
}
class Rt {
  constructor(t, r) {
    this.r = t, this.s = r, this.assertValidity();
  }
  static fromHex(t) {
    const r = ot(t);
    if (r.length !== 64)
      throw new TypeError(`SchnorrSignature.fromHex: expected 64 bytes, not ${r.length}`);
    const n = Oe(r.subarray(0, 32)), i = Oe(r.subarray(32, 64));
    return new Rt(n, i);
  }
  assertValidity() {
    const { r: t, s: r } = this;
    if (!Fr(t) || !yr(r))
      throw new Error("Invalid signature");
  }
  toHex() {
    return Ke(this.r) + Ke(this.s);
  }
  toRawBytes() {
    return Ze(this.toHex());
  }
}
function Nu(e) {
  return X.fromPrivateKey(e).toRawX();
}
class Ia {
  constructor(t, r, n = Ce.randomBytes()) {
    if (t == null)
      throw new TypeError(`sign: Expected valid message, not "${t}"`);
    this.m = ot(t);
    const { x: i, scalar: o } = this.getScalar(gr(r));
    if (this.px = i, this.d = o, this.rand = ot(n), this.rand.length !== 32)
      throw new TypeError("sign: Expected 32 bytes of aux randomness");
  }
  getScalar(t) {
    const r = X.fromPrivateKey(t), n = r.hasEvenY() ? t : Z.n - t;
    return { point: r, scalar: n, x: r.toRawX() };
  }
  initNonce(t, r) {
    return vr(t ^ Oe(r));
  }
  finalizeNonce(t) {
    const r = C(Oe(t), Z.n);
    if (r === H)
      throw new Error("sign: Creation of signature failed. k is zero");
    const { point: n, x: i, scalar: o } = this.getScalar(r);
    return { R: n, rx: i, k: o };
  }
  finalizeSig(t, r, n, i) {
    return new Rt(t.x, C(r + n * i, Z.n)).toRawBytes();
  }
  error() {
    throw new Error("sign: Invalid signature produced");
  }
  async calc() {
    const { m: t, d: r, px: n, rand: i } = this, o = Ce.taggedHash, a = this.initNonce(r, await o(Ye.aux, i)), { R: u, rx: s, k: f } = this.finalizeNonce(await o(Ye.nonce, a, n, t)), h = Vr(await o(Ye.challenge, s, n, t)), l = this.finalizeSig(u, f, h, r);
    return await Ma(l, t, n) || this.error(), l;
  }
  calcSync() {
    const { m: t, d: r, px: n, rand: i } = this, o = Ce.taggedHashSync, a = this.initNonce(r, o(Ye.aux, i)), { R: u, rx: s, k: f } = this.finalizeNonce(o(Ye.nonce, a, n, t)), h = Vr(o(Ye.challenge, s, n, t)), l = this.finalizeSig(u, f, h, r);
    return ka(l, t, n) || this.error(), l;
  }
}
async function Fu(e, t, r) {
  return new Ia(e, t, r).calc();
}
function Uu(e, t, r) {
  return new Ia(e, t, r).calcSync();
}
function Ta(e, t, r) {
  const n = e instanceof Rt, i = n ? e : Rt.fromHex(e);
  return n && i.assertValidity(), {
    ...i,
    m: ot(t),
    P: Du(r)
  };
}
function Ca(e, t, r, n) {
  const i = X.BASE.multiplyAndAddUnsafe(t, gr(r), C(-n, Z.n));
  return !(!i || !i.hasEvenY() || i.x !== e);
}
async function Ma(e, t, r) {
  try {
    const { r: n, s: i, m: o, P: a } = Ta(e, t, r), u = Vr(await Ce.taggedHash(Ye.challenge, vr(n), a.toRawX(), o));
    return Ca(n, a, i, u);
  } catch {
    return !1;
  }
}
function ka(e, t, r) {
  try {
    const { r: n, s: i, m: o, P: a } = Ta(e, t, r), u = Vr(Ce.taggedHashSync(Ye.challenge, vr(n), a.toRawX(), o));
    return Ca(n, a, i, u);
  } catch (n) {
    if (n instanceof Aa)
      throw n;
    return !1;
  }
}
const gi = {
  Signature: Rt,
  getPublicKey: Nu,
  sign: Fu,
  verify: Ma,
  signSync: Uu,
  verifySync: ka
};
X.BASE._setWindowSize(8);
const xe = {
  node: Iu,
  web: typeof self == "object" && "crypto" in self ? self.crypto : void 0
}, Ye = {
  challenge: "BIP0340/challenge",
  aux: "BIP0340/aux",
  nonce: "BIP0340/nonce"
}, kr = {}, Ce = {
  bytesToHex: St,
  hexToBytes: Ze,
  concatBytes: Bt,
  mod: C,
  invert: tn,
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
    const t = C(Oe(e), Z.n - Q) + Q;
    return vr(t);
  },
  randomBytes: (e = 32) => {
    if (xe.web)
      return xe.web.getRandomValues(new Uint8Array(e));
    if (xe.node) {
      const { randomBytes: t } = xe.node;
      return Uint8Array.from(t(e));
    } else
      throw new Error("The environment doesn't have randomBytes function");
  },
  randomPrivateKey: () => Ce.hashToPrivateKey(Ce.randomBytes(40)),
  sha256: async (...e) => {
    if (xe.web) {
      const t = await xe.web.subtle.digest("SHA-256", Bt(...e));
      return new Uint8Array(t);
    } else if (xe.node) {
      const { createHash: t } = xe.node, r = t("sha256");
      return e.forEach((n) => r.update(n)), Uint8Array.from(r.digest());
    } else
      throw new Error("The environment doesn't have sha256 function");
  },
  hmacSha256: async (e, ...t) => {
    if (xe.web) {
      const r = await xe.web.subtle.importKey("raw", e, { name: "HMAC", hash: { name: "SHA-256" } }, !1, ["sign"]), n = Bt(...t), i = await xe.web.subtle.sign("HMAC", r, n);
      return new Uint8Array(i);
    } else if (xe.node) {
      const { createHmac: r } = xe.node, n = r("sha256", e);
      return t.forEach((i) => n.update(i)), Uint8Array.from(n.digest());
    } else
      throw new Error("The environment doesn't have hmac-sha256 function");
  },
  sha256Sync: void 0,
  hmacSha256Sync: void 0,
  taggedHash: async (e, ...t) => {
    let r = kr[e];
    if (r === void 0) {
      const n = await Ce.sha256(Uint8Array.from(e, (i) => i.charCodeAt(0)));
      r = Bt(n, n), kr[e] = r;
    }
    return Ce.sha256(r, ...t);
  },
  taggedHashSync: (e, ...t) => {
    if (typeof wt != "function")
      throw new Aa("sha256Sync is undefined, you need to set it");
    let r = kr[e];
    if (r === void 0) {
      const n = wt(Uint8Array.from(e, (i) => i.charCodeAt(0)));
      r = Bt(n, n), kr[e] = r;
    }
    return wt(r, ...t);
  },
  precompute(e = 8, t = X.BASE) {
    const r = t === X.BASE ? t : new X(t.x, t.y);
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
      return An;
    },
    set(e) {
      An || (An = e);
    }
  }
});
const oi = typeof global < "u" ? global : typeof self < "u" ? self : typeof window < "u" ? window : {};
var De = [], Re = [], Hu = typeof Uint8Array < "u" ? Uint8Array : Array, bi = !1;
function Ba() {
  bi = !0;
  for (var e = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", t = 0, r = e.length; t < r; ++t)
    De[t] = e[t], Re[e.charCodeAt(t)] = t;
  Re["-".charCodeAt(0)] = 62, Re["_".charCodeAt(0)] = 63;
}
function $u(e) {
  bi || Ba();
  var t, r, n, i, o, a, u = e.length;
  if (u % 4 > 0)
    throw new Error("Invalid string. Length must be a multiple of 4");
  o = e[u - 2] === "=" ? 2 : e[u - 1] === "=" ? 1 : 0, a = new Hu(u * 3 / 4 - o), n = o > 0 ? u - 4 : u;
  var s = 0;
  for (t = 0, r = 0; t < n; t += 4, r += 3)
    i = Re[e.charCodeAt(t)] << 18 | Re[e.charCodeAt(t + 1)] << 12 | Re[e.charCodeAt(t + 2)] << 6 | Re[e.charCodeAt(t + 3)], a[s++] = i >> 16 & 255, a[s++] = i >> 8 & 255, a[s++] = i & 255;
  return o === 2 ? (i = Re[e.charCodeAt(t)] << 2 | Re[e.charCodeAt(t + 1)] >> 4, a[s++] = i & 255) : o === 1 && (i = Re[e.charCodeAt(t)] << 10 | Re[e.charCodeAt(t + 1)] << 4 | Re[e.charCodeAt(t + 2)] >> 2, a[s++] = i >> 8 & 255, a[s++] = i & 255), a;
}
function Wu(e) {
  return De[e >> 18 & 63] + De[e >> 12 & 63] + De[e >> 6 & 63] + De[e & 63];
}
function zu(e, t, r) {
  for (var n, i = [], o = t; o < r; o += 3)
    n = (e[o] << 16) + (e[o + 1] << 8) + e[o + 2], i.push(Wu(n));
  return i.join("");
}
function eo(e) {
  bi || Ba();
  for (var t, r = e.length, n = r % 3, i = "", o = [], a = 16383, u = 0, s = r - n; u < s; u += a)
    o.push(zu(e, u, u + a > s ? s : u + a));
  return n === 1 ? (t = e[r - 1], i += De[t >> 2], i += De[t << 4 & 63], i += "==") : n === 2 && (t = (e[r - 2] << 8) + e[r - 1], i += De[t >> 10], i += De[t >> 4 & 63], i += De[t << 2 & 63], i += "="), o.push(i), o.join("");
}
function rn(e, t, r, n, i) {
  var o, a, u = i * 8 - n - 1, s = (1 << u) - 1, f = s >> 1, h = -7, l = r ? i - 1 : 0, c = r ? -1 : 1, d = e[t + l];
  for (l += c, o = d & (1 << -h) - 1, d >>= -h, h += u; h > 0; o = o * 256 + e[t + l], l += c, h -= 8)
    ;
  for (a = o & (1 << -h) - 1, o >>= -h, h += n; h > 0; a = a * 256 + e[t + l], l += c, h -= 8)
    ;
  if (o === 0)
    o = 1 - f;
  else {
    if (o === s)
      return a ? NaN : (d ? -1 : 1) * (1 / 0);
    a = a + Math.pow(2, n), o = o - f;
  }
  return (d ? -1 : 1) * a * Math.pow(2, o - n);
}
function La(e, t, r, n, i, o) {
  var a, u, s, f = o * 8 - i - 1, h = (1 << f) - 1, l = h >> 1, c = i === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0, d = n ? 0 : o - 1, p = n ? 1 : -1, _ = t < 0 || t === 0 && 1 / t < 0 ? 1 : 0;
  for (t = Math.abs(t), isNaN(t) || t === 1 / 0 ? (u = isNaN(t) ? 1 : 0, a = h) : (a = Math.floor(Math.log(t) / Math.LN2), t * (s = Math.pow(2, -a)) < 1 && (a--, s *= 2), a + l >= 1 ? t += c / s : t += c * Math.pow(2, 1 - l), t * s >= 2 && (a++, s /= 2), a + l >= h ? (u = 0, a = h) : a + l >= 1 ? (u = (t * s - 1) * Math.pow(2, i), a = a + l) : (u = t * Math.pow(2, l - 1) * Math.pow(2, i), a = 0)); i >= 8; e[r + d] = u & 255, d += p, u /= 256, i -= 8)
    ;
  for (a = a << i | u, f += i; f > 0; e[r + d] = a & 255, d += p, a /= 256, f -= 8)
    ;
  e[r + d - p] |= _ * 128;
}
var Gu = {}.toString, Pa = Array.isArray || function(e) {
  return Gu.call(e) == "[object Array]";
};
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
var qa = 50;
E.TYPED_ARRAY_SUPPORT = oi.TYPED_ARRAY_SUPPORT !== void 0 ? oi.TYPED_ARRAY_SUPPORT : !0;
var Yu = Kr();
function Kr() {
  return E.TYPED_ARRAY_SUPPORT ? 2147483647 : 1073741823;
}
function $e(e, t) {
  if (Kr() < t)
    throw new RangeError("Invalid typed array length");
  return E.TYPED_ARRAY_SUPPORT ? (e = new Uint8Array(t), e.__proto__ = E.prototype) : (e === null && (e = new E(t)), e.length = t), e;
}
function E(e, t, r) {
  if (!E.TYPED_ARRAY_SUPPORT && !(this instanceof E))
    return new E(e, t, r);
  if (typeof e == "number") {
    if (typeof t == "string")
      throw new Error(
        "If encoding is specified then the first argument must be a string"
      );
    return wi(this, e);
  }
  return Da(this, e, t, r);
}
E.poolSize = 8192;
E._augment = function(e) {
  return e.__proto__ = E.prototype, e;
};
function Da(e, t, r, n) {
  if (typeof t == "number")
    throw new TypeError('"value" argument must not be a number');
  return typeof ArrayBuffer < "u" && t instanceof ArrayBuffer ? Zu(e, t, r, n) : typeof t == "string" ? Ku(e, t, r) : Xu(e, t);
}
E.from = function(e, t, r) {
  return Da(null, e, t, r);
};
E.TYPED_ARRAY_SUPPORT && (E.prototype.__proto__ = Uint8Array.prototype, E.__proto__ = Uint8Array);
function ja(e) {
  if (typeof e != "number")
    throw new TypeError('"size" argument must be a number');
  if (e < 0)
    throw new RangeError('"size" argument must not be negative');
}
function Vu(e, t, r, n) {
  return ja(t), t <= 0 ? $e(e, t) : r !== void 0 ? typeof n == "string" ? $e(e, t).fill(r, n) : $e(e, t).fill(r) : $e(e, t);
}
E.alloc = function(e, t, r) {
  return Vu(null, e, t, r);
};
function wi(e, t) {
  if (ja(t), e = $e(e, t < 0 ? 0 : xi(t) | 0), !E.TYPED_ARRAY_SUPPORT)
    for (var r = 0; r < t; ++r)
      e[r] = 0;
  return e;
}
E.allocUnsafe = function(e) {
  return wi(null, e);
};
E.allocUnsafeSlow = function(e) {
  return wi(null, e);
};
function Ku(e, t, r) {
  if ((typeof r != "string" || r === "") && (r = "utf8"), !E.isEncoding(r))
    throw new TypeError('"encoding" must be a valid string encoding');
  var n = Na(t, r) | 0;
  e = $e(e, n);
  var i = e.write(t, r);
  return i !== n && (e = e.slice(0, i)), e;
}
function ai(e, t) {
  var r = t.length < 0 ? 0 : xi(t.length) | 0;
  e = $e(e, r);
  for (var n = 0; n < r; n += 1)
    e[n] = t[n] & 255;
  return e;
}
function Zu(e, t, r, n) {
  if (t.byteLength, r < 0 || t.byteLength < r)
    throw new RangeError("'offset' is out of bounds");
  if (t.byteLength < r + (n || 0))
    throw new RangeError("'length' is out of bounds");
  return r === void 0 && n === void 0 ? t = new Uint8Array(t) : n === void 0 ? t = new Uint8Array(t, r) : t = new Uint8Array(t, r, n), E.TYPED_ARRAY_SUPPORT ? (e = t, e.__proto__ = E.prototype) : e = ai(e, t), e;
}
function Xu(e, t) {
  if (Fe(t)) {
    var r = xi(t.length) | 0;
    return e = $e(e, r), e.length === 0 || t.copy(e, 0, 0, r), e;
  }
  if (t) {
    if (typeof ArrayBuffer < "u" && t.buffer instanceof ArrayBuffer || "length" in t)
      return typeof t.length != "number" || gf(t.length) ? $e(e, 0) : ai(e, t);
    if (t.type === "Buffer" && Pa(t.data))
      return ai(e, t.data);
  }
  throw new TypeError("First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.");
}
function xi(e) {
  if (e >= Kr())
    throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + Kr().toString(16) + " bytes");
  return e | 0;
}
function Qu(e) {
  return +e != e && (e = 0), E.alloc(+e);
}
E.isBuffer = Ya;
function Fe(e) {
  return !!(e != null && e._isBuffer);
}
E.compare = function(t, r) {
  if (!Fe(t) || !Fe(r))
    throw new TypeError("Arguments must be Buffers");
  if (t === r)
    return 0;
  for (var n = t.length, i = r.length, o = 0, a = Math.min(n, i); o < a; ++o)
    if (t[o] !== r[o]) {
      n = t[o], i = r[o];
      break;
    }
  return n < i ? -1 : i < n ? 1 : 0;
};
E.isEncoding = function(t) {
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
E.concat = function(t, r) {
  if (!Pa(t))
    throw new TypeError('"list" argument must be an Array of Buffers');
  if (t.length === 0)
    return E.alloc(0);
  var n;
  if (r === void 0)
    for (r = 0, n = 0; n < t.length; ++n)
      r += t[n].length;
  var i = E.allocUnsafe(r), o = 0;
  for (n = 0; n < t.length; ++n) {
    var a = t[n];
    if (!Fe(a))
      throw new TypeError('"list" argument must be an Array of Buffers');
    a.copy(i, o), o += a.length;
  }
  return i;
};
function Na(e, t) {
  if (Fe(e))
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
        return Ga(e).length;
      default:
        if (n)
          return Zr(e).length;
        t = ("" + t).toLowerCase(), n = !0;
    }
}
E.byteLength = Na;
function Ju(e, t, r) {
  var n = !1;
  if ((t === void 0 || t < 0) && (t = 0), t > this.length || ((r === void 0 || r > this.length) && (r = this.length), r <= 0) || (r >>>= 0, t >>>= 0, r <= t))
    return "";
  for (e || (e = "utf8"); ; )
    switch (e) {
      case "hex":
        return lf(this, t, r);
      case "utf8":
      case "utf-8":
        return Ha(this, t, r);
      case "ascii":
        return uf(this, t, r);
      case "latin1":
      case "binary":
        return ff(this, t, r);
      case "base64":
        return af(this, t, r);
      case "ucs2":
      case "ucs-2":
      case "utf16le":
      case "utf-16le":
        return cf(this, t, r);
      default:
        if (n)
          throw new TypeError("Unknown encoding: " + e);
        e = (e + "").toLowerCase(), n = !0;
    }
}
E.prototype._isBuffer = !0;
function rt(e, t, r) {
  var n = e[t];
  e[t] = e[r], e[r] = n;
}
E.prototype.swap16 = function() {
  var t = this.length;
  if (t % 2 !== 0)
    throw new RangeError("Buffer size must be a multiple of 16-bits");
  for (var r = 0; r < t; r += 2)
    rt(this, r, r + 1);
  return this;
};
E.prototype.swap32 = function() {
  var t = this.length;
  if (t % 4 !== 0)
    throw new RangeError("Buffer size must be a multiple of 32-bits");
  for (var r = 0; r < t; r += 4)
    rt(this, r, r + 3), rt(this, r + 1, r + 2);
  return this;
};
E.prototype.swap64 = function() {
  var t = this.length;
  if (t % 8 !== 0)
    throw new RangeError("Buffer size must be a multiple of 64-bits");
  for (var r = 0; r < t; r += 8)
    rt(this, r, r + 7), rt(this, r + 1, r + 6), rt(this, r + 2, r + 5), rt(this, r + 3, r + 4);
  return this;
};
E.prototype.toString = function() {
  var t = this.length | 0;
  return t === 0 ? "" : arguments.length === 0 ? Ha(this, 0, t) : Ju.apply(this, arguments);
};
E.prototype.equals = function(t) {
  if (!Fe(t))
    throw new TypeError("Argument must be a Buffer");
  return this === t ? !0 : E.compare(this, t) === 0;
};
E.prototype.inspect = function() {
  var t = "", r = qa;
  return this.length > 0 && (t = this.toString("hex", 0, r).match(/.{2}/g).join(" "), this.length > r && (t += " ... ")), "<Buffer " + t + ">";
};
E.prototype.compare = function(t, r, n, i, o) {
  if (!Fe(t))
    throw new TypeError("Argument must be a Buffer");
  if (r === void 0 && (r = 0), n === void 0 && (n = t ? t.length : 0), i === void 0 && (i = 0), o === void 0 && (o = this.length), r < 0 || n > t.length || i < 0 || o > this.length)
    throw new RangeError("out of range index");
  if (i >= o && r >= n)
    return 0;
  if (i >= o)
    return -1;
  if (r >= n)
    return 1;
  if (r >>>= 0, n >>>= 0, i >>>= 0, o >>>= 0, this === t)
    return 0;
  for (var a = o - i, u = n - r, s = Math.min(a, u), f = this.slice(i, o), h = t.slice(r, n), l = 0; l < s; ++l)
    if (f[l] !== h[l]) {
      a = f[l], u = h[l];
      break;
    }
  return a < u ? -1 : u < a ? 1 : 0;
};
function Fa(e, t, r, n, i) {
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
  if (typeof t == "string" && (t = E.from(t, n)), Fe(t))
    return t.length === 0 ? -1 : to(e, t, r, n, i);
  if (typeof t == "number")
    return t = t & 255, E.TYPED_ARRAY_SUPPORT && typeof Uint8Array.prototype.indexOf == "function" ? i ? Uint8Array.prototype.indexOf.call(e, t, r) : Uint8Array.prototype.lastIndexOf.call(e, t, r) : to(e, [t], r, n, i);
  throw new TypeError("val must be string, number or Buffer");
}
function to(e, t, r, n, i) {
  var o = 1, a = e.length, u = t.length;
  if (n !== void 0 && (n = String(n).toLowerCase(), n === "ucs2" || n === "ucs-2" || n === "utf16le" || n === "utf-16le")) {
    if (e.length < 2 || t.length < 2)
      return -1;
    o = 2, a /= 2, u /= 2, r /= 2;
  }
  function s(d, p) {
    return o === 1 ? d[p] : d.readUInt16BE(p * o);
  }
  var f;
  if (i) {
    var h = -1;
    for (f = r; f < a; f++)
      if (s(e, f) === s(t, h === -1 ? 0 : f - h)) {
        if (h === -1 && (h = f), f - h + 1 === u)
          return h * o;
      } else
        h !== -1 && (f -= f - h), h = -1;
  } else
    for (r + u > a && (r = a - u), f = r; f >= 0; f--) {
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
E.prototype.includes = function(t, r, n) {
  return this.indexOf(t, r, n) !== -1;
};
E.prototype.indexOf = function(t, r, n) {
  return Fa(this, t, r, n, !0);
};
E.prototype.lastIndexOf = function(t, r, n) {
  return Fa(this, t, r, n, !1);
};
function ef(e, t, r, n) {
  r = Number(r) || 0;
  var i = e.length - r;
  n ? (n = Number(n), n > i && (n = i)) : n = i;
  var o = t.length;
  if (o % 2 !== 0)
    throw new TypeError("Invalid hex string");
  n > o / 2 && (n = o / 2);
  for (var a = 0; a < n; ++a) {
    var u = parseInt(t.substr(a * 2, 2), 16);
    if (isNaN(u))
      return a;
    e[r + a] = u;
  }
  return a;
}
function tf(e, t, r, n) {
  return an(Zr(t, e.length - r), e, r, n);
}
function Ua(e, t, r, n) {
  return an(vf(t), e, r, n);
}
function rf(e, t, r, n) {
  return Ua(e, t, r, n);
}
function nf(e, t, r, n) {
  return an(Ga(t), e, r, n);
}
function of(e, t, r, n) {
  return an(yf(t, e.length - r), e, r, n);
}
E.prototype.write = function(t, r, n, i) {
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
  var o = this.length - r;
  if ((n === void 0 || n > o) && (n = o), t.length > 0 && (n < 0 || r < 0) || r > this.length)
    throw new RangeError("Attempt to write outside buffer bounds");
  i || (i = "utf8");
  for (var a = !1; ; )
    switch (i) {
      case "hex":
        return ef(this, t, r, n);
      case "utf8":
      case "utf-8":
        return tf(this, t, r, n);
      case "ascii":
        return Ua(this, t, r, n);
      case "latin1":
      case "binary":
        return rf(this, t, r, n);
      case "base64":
        return nf(this, t, r, n);
      case "ucs2":
      case "ucs-2":
      case "utf16le":
      case "utf-16le":
        return of(this, t, r, n);
      default:
        if (a)
          throw new TypeError("Unknown encoding: " + i);
        i = ("" + i).toLowerCase(), a = !0;
    }
};
E.prototype.toJSON = function() {
  return {
    type: "Buffer",
    data: Array.prototype.slice.call(this._arr || this, 0)
  };
};
function af(e, t, r) {
  return t === 0 && r === e.length ? eo(e) : eo(e.slice(t, r));
}
function Ha(e, t, r) {
  r = Math.min(e.length, r);
  for (var n = [], i = t; i < r; ) {
    var o = e[i], a = null, u = o > 239 ? 4 : o > 223 ? 3 : o > 191 ? 2 : 1;
    if (i + u <= r) {
      var s, f, h, l;
      switch (u) {
        case 1:
          o < 128 && (a = o);
          break;
        case 2:
          s = e[i + 1], (s & 192) === 128 && (l = (o & 31) << 6 | s & 63, l > 127 && (a = l));
          break;
        case 3:
          s = e[i + 1], f = e[i + 2], (s & 192) === 128 && (f & 192) === 128 && (l = (o & 15) << 12 | (s & 63) << 6 | f & 63, l > 2047 && (l < 55296 || l > 57343) && (a = l));
          break;
        case 4:
          s = e[i + 1], f = e[i + 2], h = e[i + 3], (s & 192) === 128 && (f & 192) === 128 && (h & 192) === 128 && (l = (o & 15) << 18 | (s & 63) << 12 | (f & 63) << 6 | h & 63, l > 65535 && l < 1114112 && (a = l));
      }
    }
    a === null ? (a = 65533, u = 1) : a > 65535 && (a -= 65536, n.push(a >>> 10 & 1023 | 55296), a = 56320 | a & 1023), n.push(a), i += u;
  }
  return sf(n);
}
var ro = 4096;
function sf(e) {
  var t = e.length;
  if (t <= ro)
    return String.fromCharCode.apply(String, e);
  for (var r = "", n = 0; n < t; )
    r += String.fromCharCode.apply(
      String,
      e.slice(n, n += ro)
    );
  return r;
}
function uf(e, t, r) {
  var n = "";
  r = Math.min(e.length, r);
  for (var i = t; i < r; ++i)
    n += String.fromCharCode(e[i] & 127);
  return n;
}
function ff(e, t, r) {
  var n = "";
  r = Math.min(e.length, r);
  for (var i = t; i < r; ++i)
    n += String.fromCharCode(e[i]);
  return n;
}
function lf(e, t, r) {
  var n = e.length;
  (!t || t < 0) && (t = 0), (!r || r < 0 || r > n) && (r = n);
  for (var i = "", o = t; o < r; ++o)
    i += _f(e[o]);
  return i;
}
function cf(e, t, r) {
  for (var n = e.slice(t, r), i = "", o = 0; o < n.length; o += 2)
    i += String.fromCharCode(n[o] + n[o + 1] * 256);
  return i;
}
E.prototype.slice = function(t, r) {
  var n = this.length;
  t = ~~t, r = r === void 0 ? n : ~~r, t < 0 ? (t += n, t < 0 && (t = 0)) : t > n && (t = n), r < 0 ? (r += n, r < 0 && (r = 0)) : r > n && (r = n), r < t && (r = t);
  var i;
  if (E.TYPED_ARRAY_SUPPORT)
    i = this.subarray(t, r), i.__proto__ = E.prototype;
  else {
    var o = r - t;
    i = new E(o, void 0);
    for (var a = 0; a < o; ++a)
      i[a] = this[a + t];
  }
  return i;
};
function oe(e, t, r) {
  if (e % 1 !== 0 || e < 0)
    throw new RangeError("offset is not uint");
  if (e + t > r)
    throw new RangeError("Trying to access beyond buffer length");
}
E.prototype.readUIntLE = function(t, r, n) {
  t = t | 0, r = r | 0, n || oe(t, r, this.length);
  for (var i = this[t], o = 1, a = 0; ++a < r && (o *= 256); )
    i += this[t + a] * o;
  return i;
};
E.prototype.readUIntBE = function(t, r, n) {
  t = t | 0, r = r | 0, n || oe(t, r, this.length);
  for (var i = this[t + --r], o = 1; r > 0 && (o *= 256); )
    i += this[t + --r] * o;
  return i;
};
E.prototype.readUInt8 = function(t, r) {
  return r || oe(t, 1, this.length), this[t];
};
E.prototype.readUInt16LE = function(t, r) {
  return r || oe(t, 2, this.length), this[t] | this[t + 1] << 8;
};
E.prototype.readUInt16BE = function(t, r) {
  return r || oe(t, 2, this.length), this[t] << 8 | this[t + 1];
};
E.prototype.readUInt32LE = function(t, r) {
  return r || oe(t, 4, this.length), (this[t] | this[t + 1] << 8 | this[t + 2] << 16) + this[t + 3] * 16777216;
};
E.prototype.readUInt32BE = function(t, r) {
  return r || oe(t, 4, this.length), this[t] * 16777216 + (this[t + 1] << 16 | this[t + 2] << 8 | this[t + 3]);
};
E.prototype.readIntLE = function(t, r, n) {
  t = t | 0, r = r | 0, n || oe(t, r, this.length);
  for (var i = this[t], o = 1, a = 0; ++a < r && (o *= 256); )
    i += this[t + a] * o;
  return o *= 128, i >= o && (i -= Math.pow(2, 8 * r)), i;
};
E.prototype.readIntBE = function(t, r, n) {
  t = t | 0, r = r | 0, n || oe(t, r, this.length);
  for (var i = r, o = 1, a = this[t + --i]; i > 0 && (o *= 256); )
    a += this[t + --i] * o;
  return o *= 128, a >= o && (a -= Math.pow(2, 8 * r)), a;
};
E.prototype.readInt8 = function(t, r) {
  return r || oe(t, 1, this.length), this[t] & 128 ? (255 - this[t] + 1) * -1 : this[t];
};
E.prototype.readInt16LE = function(t, r) {
  r || oe(t, 2, this.length);
  var n = this[t] | this[t + 1] << 8;
  return n & 32768 ? n | 4294901760 : n;
};
E.prototype.readInt16BE = function(t, r) {
  r || oe(t, 2, this.length);
  var n = this[t + 1] | this[t] << 8;
  return n & 32768 ? n | 4294901760 : n;
};
E.prototype.readInt32LE = function(t, r) {
  return r || oe(t, 4, this.length), this[t] | this[t + 1] << 8 | this[t + 2] << 16 | this[t + 3] << 24;
};
E.prototype.readInt32BE = function(t, r) {
  return r || oe(t, 4, this.length), this[t] << 24 | this[t + 1] << 16 | this[t + 2] << 8 | this[t + 3];
};
E.prototype.readFloatLE = function(t, r) {
  return r || oe(t, 4, this.length), rn(this, t, !0, 23, 4);
};
E.prototype.readFloatBE = function(t, r) {
  return r || oe(t, 4, this.length), rn(this, t, !1, 23, 4);
};
E.prototype.readDoubleLE = function(t, r) {
  return r || oe(t, 8, this.length), rn(this, t, !0, 52, 8);
};
E.prototype.readDoubleBE = function(t, r) {
  return r || oe(t, 8, this.length), rn(this, t, !1, 52, 8);
};
function we(e, t, r, n, i, o) {
  if (!Fe(e))
    throw new TypeError('"buffer" argument must be a Buffer instance');
  if (t > i || t < o)
    throw new RangeError('"value" argument is out of bounds');
  if (r + n > e.length)
    throw new RangeError("Index out of range");
}
E.prototype.writeUIntLE = function(t, r, n, i) {
  if (t = +t, r = r | 0, n = n | 0, !i) {
    var o = Math.pow(2, 8 * n) - 1;
    we(this, t, r, n, o, 0);
  }
  var a = 1, u = 0;
  for (this[r] = t & 255; ++u < n && (a *= 256); )
    this[r + u] = t / a & 255;
  return r + n;
};
E.prototype.writeUIntBE = function(t, r, n, i) {
  if (t = +t, r = r | 0, n = n | 0, !i) {
    var o = Math.pow(2, 8 * n) - 1;
    we(this, t, r, n, o, 0);
  }
  var a = n - 1, u = 1;
  for (this[r + a] = t & 255; --a >= 0 && (u *= 256); )
    this[r + a] = t / u & 255;
  return r + n;
};
E.prototype.writeUInt8 = function(t, r, n) {
  return t = +t, r = r | 0, n || we(this, t, r, 1, 255, 0), E.TYPED_ARRAY_SUPPORT || (t = Math.floor(t)), this[r] = t & 255, r + 1;
};
function nn(e, t, r, n) {
  t < 0 && (t = 65535 + t + 1);
  for (var i = 0, o = Math.min(e.length - r, 2); i < o; ++i)
    e[r + i] = (t & 255 << 8 * (n ? i : 1 - i)) >>> (n ? i : 1 - i) * 8;
}
E.prototype.writeUInt16LE = function(t, r, n) {
  return t = +t, r = r | 0, n || we(this, t, r, 2, 65535, 0), E.TYPED_ARRAY_SUPPORT ? (this[r] = t & 255, this[r + 1] = t >>> 8) : nn(this, t, r, !0), r + 2;
};
E.prototype.writeUInt16BE = function(t, r, n) {
  return t = +t, r = r | 0, n || we(this, t, r, 2, 65535, 0), E.TYPED_ARRAY_SUPPORT ? (this[r] = t >>> 8, this[r + 1] = t & 255) : nn(this, t, r, !1), r + 2;
};
function on(e, t, r, n) {
  t < 0 && (t = 4294967295 + t + 1);
  for (var i = 0, o = Math.min(e.length - r, 4); i < o; ++i)
    e[r + i] = t >>> (n ? i : 3 - i) * 8 & 255;
}
E.prototype.writeUInt32LE = function(t, r, n) {
  return t = +t, r = r | 0, n || we(this, t, r, 4, 4294967295, 0), E.TYPED_ARRAY_SUPPORT ? (this[r + 3] = t >>> 24, this[r + 2] = t >>> 16, this[r + 1] = t >>> 8, this[r] = t & 255) : on(this, t, r, !0), r + 4;
};
E.prototype.writeUInt32BE = function(t, r, n) {
  return t = +t, r = r | 0, n || we(this, t, r, 4, 4294967295, 0), E.TYPED_ARRAY_SUPPORT ? (this[r] = t >>> 24, this[r + 1] = t >>> 16, this[r + 2] = t >>> 8, this[r + 3] = t & 255) : on(this, t, r, !1), r + 4;
};
E.prototype.writeIntLE = function(t, r, n, i) {
  if (t = +t, r = r | 0, !i) {
    var o = Math.pow(2, 8 * n - 1);
    we(this, t, r, n, o - 1, -o);
  }
  var a = 0, u = 1, s = 0;
  for (this[r] = t & 255; ++a < n && (u *= 256); )
    t < 0 && s === 0 && this[r + a - 1] !== 0 && (s = 1), this[r + a] = (t / u >> 0) - s & 255;
  return r + n;
};
E.prototype.writeIntBE = function(t, r, n, i) {
  if (t = +t, r = r | 0, !i) {
    var o = Math.pow(2, 8 * n - 1);
    we(this, t, r, n, o - 1, -o);
  }
  var a = n - 1, u = 1, s = 0;
  for (this[r + a] = t & 255; --a >= 0 && (u *= 256); )
    t < 0 && s === 0 && this[r + a + 1] !== 0 && (s = 1), this[r + a] = (t / u >> 0) - s & 255;
  return r + n;
};
E.prototype.writeInt8 = function(t, r, n) {
  return t = +t, r = r | 0, n || we(this, t, r, 1, 127, -128), E.TYPED_ARRAY_SUPPORT || (t = Math.floor(t)), t < 0 && (t = 255 + t + 1), this[r] = t & 255, r + 1;
};
E.prototype.writeInt16LE = function(t, r, n) {
  return t = +t, r = r | 0, n || we(this, t, r, 2, 32767, -32768), E.TYPED_ARRAY_SUPPORT ? (this[r] = t & 255, this[r + 1] = t >>> 8) : nn(this, t, r, !0), r + 2;
};
E.prototype.writeInt16BE = function(t, r, n) {
  return t = +t, r = r | 0, n || we(this, t, r, 2, 32767, -32768), E.TYPED_ARRAY_SUPPORT ? (this[r] = t >>> 8, this[r + 1] = t & 255) : nn(this, t, r, !1), r + 2;
};
E.prototype.writeInt32LE = function(t, r, n) {
  return t = +t, r = r | 0, n || we(this, t, r, 4, 2147483647, -2147483648), E.TYPED_ARRAY_SUPPORT ? (this[r] = t & 255, this[r + 1] = t >>> 8, this[r + 2] = t >>> 16, this[r + 3] = t >>> 24) : on(this, t, r, !0), r + 4;
};
E.prototype.writeInt32BE = function(t, r, n) {
  return t = +t, r = r | 0, n || we(this, t, r, 4, 2147483647, -2147483648), t < 0 && (t = 4294967295 + t + 1), E.TYPED_ARRAY_SUPPORT ? (this[r] = t >>> 24, this[r + 1] = t >>> 16, this[r + 2] = t >>> 8, this[r + 3] = t & 255) : on(this, t, r, !1), r + 4;
};
function $a(e, t, r, n, i, o) {
  if (r + n > e.length)
    throw new RangeError("Index out of range");
  if (r < 0)
    throw new RangeError("Index out of range");
}
function Wa(e, t, r, n, i) {
  return i || $a(e, t, r, 4), La(e, t, r, n, 23, 4), r + 4;
}
E.prototype.writeFloatLE = function(t, r, n) {
  return Wa(this, t, r, !0, n);
};
E.prototype.writeFloatBE = function(t, r, n) {
  return Wa(this, t, r, !1, n);
};
function za(e, t, r, n, i) {
  return i || $a(e, t, r, 8), La(e, t, r, n, 52, 8), r + 8;
}
E.prototype.writeDoubleLE = function(t, r, n) {
  return za(this, t, r, !0, n);
};
E.prototype.writeDoubleBE = function(t, r, n) {
  return za(this, t, r, !1, n);
};
E.prototype.copy = function(t, r, n, i) {
  if (n || (n = 0), !i && i !== 0 && (i = this.length), r >= t.length && (r = t.length), r || (r = 0), i > 0 && i < n && (i = n), i === n || t.length === 0 || this.length === 0)
    return 0;
  if (r < 0)
    throw new RangeError("targetStart out of bounds");
  if (n < 0 || n >= this.length)
    throw new RangeError("sourceStart out of bounds");
  if (i < 0)
    throw new RangeError("sourceEnd out of bounds");
  i > this.length && (i = this.length), t.length - r < i - n && (i = t.length - r + n);
  var o = i - n, a;
  if (this === t && n < r && r < i)
    for (a = o - 1; a >= 0; --a)
      t[a + r] = this[a + n];
  else if (o < 1e3 || !E.TYPED_ARRAY_SUPPORT)
    for (a = 0; a < o; ++a)
      t[a + r] = this[a + n];
  else
    Uint8Array.prototype.set.call(
      t,
      this.subarray(n, n + o),
      r
    );
  return o;
};
E.prototype.fill = function(t, r, n, i) {
  if (typeof t == "string") {
    if (typeof r == "string" ? (i = r, r = 0, n = this.length) : typeof n == "string" && (i = n, n = this.length), t.length === 1) {
      var o = t.charCodeAt(0);
      o < 256 && (t = o);
    }
    if (i !== void 0 && typeof i != "string")
      throw new TypeError("encoding must be a string");
    if (typeof i == "string" && !E.isEncoding(i))
      throw new TypeError("Unknown encoding: " + i);
  } else
    typeof t == "number" && (t = t & 255);
  if (r < 0 || this.length < r || this.length < n)
    throw new RangeError("Out of range index");
  if (n <= r)
    return this;
  r = r >>> 0, n = n === void 0 ? this.length : n >>> 0, t || (t = 0);
  var a;
  if (typeof t == "number")
    for (a = r; a < n; ++a)
      this[a] = t;
  else {
    var u = Fe(t) ? t : Zr(new E(t, i).toString()), s = u.length;
    for (a = 0; a < n - r; ++a)
      this[a + r] = u[a % s];
  }
  return this;
};
var hf = /[^+\/0-9A-Za-z-_]/g;
function df(e) {
  if (e = pf(e).replace(hf, ""), e.length < 2)
    return "";
  for (; e.length % 4 !== 0; )
    e = e + "=";
  return e;
}
function pf(e) {
  return e.trim ? e.trim() : e.replace(/^\s+|\s+$/g, "");
}
function _f(e) {
  return e < 16 ? "0" + e.toString(16) : e.toString(16);
}
function Zr(e, t) {
  t = t || 1 / 0;
  for (var r, n = e.length, i = null, o = [], a = 0; a < n; ++a) {
    if (r = e.charCodeAt(a), r > 55295 && r < 57344) {
      if (!i) {
        if (r > 56319) {
          (t -= 3) > -1 && o.push(239, 191, 189);
          continue;
        } else if (a + 1 === n) {
          (t -= 3) > -1 && o.push(239, 191, 189);
          continue;
        }
        i = r;
        continue;
      }
      if (r < 56320) {
        (t -= 3) > -1 && o.push(239, 191, 189), i = r;
        continue;
      }
      r = (i - 55296 << 10 | r - 56320) + 65536;
    } else
      i && (t -= 3) > -1 && o.push(239, 191, 189);
    if (i = null, r < 128) {
      if ((t -= 1) < 0)
        break;
      o.push(r);
    } else if (r < 2048) {
      if ((t -= 2) < 0)
        break;
      o.push(
        r >> 6 | 192,
        r & 63 | 128
      );
    } else if (r < 65536) {
      if ((t -= 3) < 0)
        break;
      o.push(
        r >> 12 | 224,
        r >> 6 & 63 | 128,
        r & 63 | 128
      );
    } else if (r < 1114112) {
      if ((t -= 4) < 0)
        break;
      o.push(
        r >> 18 | 240,
        r >> 12 & 63 | 128,
        r >> 6 & 63 | 128,
        r & 63 | 128
      );
    } else
      throw new Error("Invalid code point");
  }
  return o;
}
function vf(e) {
  for (var t = [], r = 0; r < e.length; ++r)
    t.push(e.charCodeAt(r) & 255);
  return t;
}
function yf(e, t) {
  for (var r, n, i, o = [], a = 0; a < e.length && !((t -= 2) < 0); ++a)
    r = e.charCodeAt(a), n = r >> 8, i = r % 256, o.push(i), o.push(n);
  return o;
}
function Ga(e) {
  return $u(df(e));
}
function an(e, t, r, n) {
  for (var i = 0; i < n && !(i + r >= t.length || i >= e.length); ++i)
    t[i + r] = e[i];
  return i;
}
function gf(e) {
  return e !== e;
}
function Ya(e) {
  return e != null && (!!e._isBuffer || Va(e) || bf(e));
}
function Va(e) {
  return !!e.constructor && typeof e.constructor.isBuffer == "function" && e.constructor.isBuffer(e);
}
function bf(e) {
  return typeof e.readFloatLE == "function" && typeof e.slice == "function" && Va(e.slice(0, 0));
}
const wf = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Buffer: E,
  INSPECT_MAX_BYTES: qa,
  SlowBuffer: Qu,
  isBuffer: Ya,
  kMaxLength: Yu
}, Symbol.toStringTag, { value: "Module" }));
function xf() {
  return E.from(Ce.randomPrivateKey()).toString("hex");
}
function mf(e) {
  return E.from(gi.getPublicKey(e)).toString("hex");
}
var S = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function mi(e) {
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
var In = null;
function Ef() {
  return In === null && (In = typeof S == "object" && typeof S.process == "object" && typeof S.process.versions == "object" && typeof S.process.versions.node < "u"), In;
}
wr.is_node = Ef;
var Tn = {}, Cn, no;
function Sf() {
  if (no)
    return Cn;
  no = 1;
  var e = function() {
    if (typeof self == "object" && self)
      return self;
    if (typeof window == "object" && window)
      return window;
    throw new Error("Unable to resolve global `this`");
  };
  return Cn = function() {
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
  }(), Cn;
}
const Rf = "websocket", Of = "Websocket Client & Server Library implementing the WebSocket protocol as specified in RFC 6455.", Af = [
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
], If = "Brian McKelvey <theturtle32@gmail.com> (https://github.com/theturtle32)", Tf = [
  "I\xF1aki Baz Castillo <ibc@aliax.net> (http://dev.sipdoc.net)"
], Cf = "1.0.34", Mf = {
  type: "git",
  url: "https://github.com/theturtle32/WebSocket-Node.git"
}, kf = "https://github.com/theturtle32/WebSocket-Node", Bf = {
  node: ">=4.0.0"
}, Lf = {
  bufferutil: "^4.0.1",
  debug: "^2.2.0",
  "es5-ext": "^0.10.50",
  "typedarray-to-buffer": "^3.1.5",
  "utf-8-validate": "^5.0.2",
  yaeti: "^0.0.6"
}, Pf = {
  "buffer-equal": "^1.0.0",
  gulp: "^4.0.2",
  "gulp-jshint": "^2.0.4",
  "jshint-stylish": "^2.2.1",
  jshint: "^2.0.0",
  tape: "^4.9.1"
}, qf = {
  verbose: !1
}, Df = {
  test: "tape test/unit/*.js",
  gulp: "gulp"
}, jf = "index", Nf = {
  lib: "./lib"
}, Ff = "lib/browser.js", Uf = "Apache-2.0", Hf = {
  name: Rf,
  description: Of,
  keywords: Af,
  author: If,
  contributors: Tf,
  version: Cf,
  repository: Mf,
  homepage: kf,
  engines: Bf,
  dependencies: Lf,
  devDependencies: Pf,
  config: qf,
  scripts: Df,
  main: jf,
  directories: Nf,
  browser: Ff,
  license: Uf
};
var Mn, io;
function $f() {
  return io || (io = 1, Mn = Hf.version), Mn;
}
var kn, oo;
function Wf() {
  if (oo)
    return kn;
  oo = 1;
  var e;
  if (typeof globalThis == "object")
    e = globalThis;
  else
    try {
      e = Sf();
    } catch {
    } finally {
      if (!e && typeof window < "u" && (e = window), !e)
        throw new Error("Could not determine global this");
    }
  var t = e.WebSocket || e.MozWebSocket, r = $f();
  function n(i, o) {
    var a;
    return o ? a = new t(i, o) : a = new t(i), a;
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
var Br = {}, Bn = {}, Pt = {}, qt = {}, Dt = {}, jt = {}, ao;
function zf() {
  if (ao)
    return jt;
  ao = 1, Object.defineProperty(jt, "__esModule", { value: !0 }), jt.ForOfAdaptor = void 0;
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
var so;
function Ei() {
  if (so)
    return Dt;
  so = 1;
  var e = S && S.__values || function(n) {
    var i = typeof Symbol == "function" && Symbol.iterator, o = i && n[i], a = 0;
    if (o)
      return o.call(n);
    if (n && typeof n.length == "number")
      return {
        next: function() {
          return n && a >= n.length && (n = void 0), { value: n && n[a++], done: !n };
        }
      };
    throw new TypeError(i ? "Object is not iterable." : "Symbol.iterator is not defined.");
  };
  Object.defineProperty(Dt, "__esModule", { value: !0 }), Dt.Container = void 0;
  var t = zf(), r = function() {
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
      var i, o, a = [];
      try {
        for (var u = e(this), s = u.next(); !s.done; s = u.next()) {
          var f = s.value;
          a.push(f);
        }
      } catch (h) {
        i = { error: h };
      } finally {
        try {
          s && !s.done && (o = u.return) && o.call(u);
        } finally {
          if (i)
            throw i.error;
        }
      }
      return a;
    }, n;
  }();
  return Dt.Container = r, Dt;
}
var Nt = {}, uo;
function Si() {
  if (uo)
    return Nt;
  uo = 1;
  var e = S && S.__read || function(r, n) {
    var i = typeof Symbol == "function" && r[Symbol.iterator];
    if (!i)
      return r;
    var o = i.call(r), a, u = [], s;
    try {
      for (; (n === void 0 || n-- > 0) && !(a = o.next()).done; )
        u.push(a.value);
    } catch (f) {
      s = { error: f };
    } finally {
      try {
        a && !a.done && (i = o.return) && i.call(o);
      } finally {
        if (s)
          throw s.error;
      }
    }
    return u;
  };
  Object.defineProperty(Nt, "__esModule", { value: !0 }), Nt.NativeArrayIterator = void 0;
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
      var i, o;
      i = e([n.data_, this.data_], 2), this.data_ = i[0], n.data_ = i[1], o = e([n.index_, this.index_], 2), this.index_ = o[0], n.index_ = o[1];
    }, r;
  }();
  return Nt.NativeArrayIterator = t, Nt;
}
var fo;
function Gf() {
  if (fo)
    return qt;
  fo = 1;
  var e = S && S.__extends || function() {
    var i = function(o, a) {
      return i = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(u, s) {
        u.__proto__ = s;
      } || function(u, s) {
        for (var f in s)
          Object.prototype.hasOwnProperty.call(s, f) && (u[f] = s[f]);
      }, i(o, a);
    };
    return function(o, a) {
      if (typeof a != "function" && a !== null)
        throw new TypeError("Class extends value " + String(a) + " is not a constructor or null");
      i(o, a);
      function u() {
        this.constructor = o;
      }
      o.prototype = a === null ? Object.create(a) : (u.prototype = a.prototype, new u());
    };
  }();
  Object.defineProperty(qt, "__esModule", { value: !0 }), qt.SetContainer = void 0;
  var t = Ei(), r = Si(), n = function(i) {
    e(o, i);
    function o(a) {
      var u = i.call(this) || this;
      return u.data_ = a(u), u;
    }
    return o.prototype.assign = function(a, u) {
      this.clear(), this.insert(a, u);
    }, o.prototype.clear = function() {
      this.data_.clear();
    }, o.prototype.begin = function() {
      return this.data_.begin();
    }, o.prototype.end = function() {
      return this.data_.end();
    }, o.prototype.has = function(a) {
      return !this.find(a).equals(this.end());
    }, o.prototype.size = function() {
      return this.data_.size();
    }, o.prototype.push = function() {
      for (var a = [], u = 0; u < arguments.length; u++)
        a[u] = arguments[u];
      if (a.length === 0)
        return this.size();
      var s = new r.NativeArrayIterator(a, 0), f = new r.NativeArrayIterator(a, a.length);
      return this._Insert_by_range(s, f), this.size();
    }, o.prototype.insert = function() {
      for (var a = [], u = 0; u < arguments.length; u++)
        a[u] = arguments[u];
      return a.length === 1 ? this._Insert_by_key(a[0]) : a[0].next instanceof Function && a[1].next instanceof Function ? this._Insert_by_range(a[0], a[1]) : this._Insert_by_hint(a[0], a[1]);
    }, o.prototype.erase = function() {
      for (var a = [], u = 0; u < arguments.length; u++)
        a[u] = arguments[u];
      return a.length === 1 && !(a[0] instanceof this.end().constructor && a[0].source() === this) ? this._Erase_by_val(a[0]) : a.length === 1 ? this._Erase_by_range(a[0]) : this._Erase_by_range(a[0], a[1]);
    }, o.prototype._Erase_by_range = function(a, u) {
      u === void 0 && (u = a.next());
      var s = this.data_.erase(a, u);
      return this._Handle_erase(a, u), s;
    }, o;
  }(t.Container);
  return qt.SetContainer = n, qt;
}
var Ln = {}, Ft = {}, Ut = {}, Ht = {}, lo;
function Yf() {
  if (lo)
    return Ht;
  lo = 1;
  var e = S && S.__extends || function() {
    var r = function(n, i) {
      return r = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(o, a) {
        o.__proto__ = a;
      } || function(o, a) {
        for (var u in a)
          Object.prototype.hasOwnProperty.call(a, u) && (o[u] = a[u]);
      }, r(n, i);
    };
    return function(n, i) {
      if (typeof i != "function" && i !== null)
        throw new TypeError("Class extends value " + String(i) + " is not a constructor or null");
      r(n, i);
      function o() {
        this.constructor = n;
      }
      n.prototype = i === null ? Object.create(i) : (o.prototype = i.prototype, new o());
    };
  }();
  Object.defineProperty(Ht, "__esModule", { value: !0 }), Ht.Exception = void 0;
  var t = function(r) {
    e(n, r);
    function n(i) {
      var o = this.constructor, a = r.call(this, i) || this, u = o.prototype;
      return Object.setPrototypeOf ? Object.setPrototypeOf(a, u) : a.__proto__ = u, a;
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
  return Ht.Exception = t, Ht;
}
var co;
function Ka() {
  if (co)
    return Ut;
  co = 1;
  var e = S && S.__extends || function() {
    var n = function(i, o) {
      return n = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(a, u) {
        a.__proto__ = u;
      } || function(a, u) {
        for (var s in u)
          Object.prototype.hasOwnProperty.call(u, s) && (a[s] = u[s]);
      }, n(i, o);
    };
    return function(i, o) {
      if (typeof o != "function" && o !== null)
        throw new TypeError("Class extends value " + String(o) + " is not a constructor or null");
      n(i, o);
      function a() {
        this.constructor = i;
      }
      i.prototype = o === null ? Object.create(o) : (a.prototype = o.prototype, new a());
    };
  }();
  Object.defineProperty(Ut, "__esModule", { value: !0 }), Ut.LogicError = void 0;
  var t = Yf(), r = function(n) {
    e(i, n);
    function i(o) {
      return n.call(this, o) || this;
    }
    return i;
  }(t.Exception);
  return Ut.LogicError = r, Ut;
}
var ho;
function Za() {
  if (ho)
    return Ft;
  ho = 1;
  var e = S && S.__extends || function() {
    var n = function(i, o) {
      return n = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(a, u) {
        a.__proto__ = u;
      } || function(a, u) {
        for (var s in u)
          Object.prototype.hasOwnProperty.call(u, s) && (a[s] = u[s]);
      }, n(i, o);
    };
    return function(i, o) {
      if (typeof o != "function" && o !== null)
        throw new TypeError("Class extends value " + String(o) + " is not a constructor or null");
      n(i, o);
      function a() {
        this.constructor = i;
      }
      i.prototype = o === null ? Object.create(o) : (a.prototype = o.prototype, new a());
    };
  }();
  Object.defineProperty(Ft, "__esModule", { value: !0 }), Ft.InvalidArgument = void 0;
  var t = Ka(), r = function(n) {
    e(i, n);
    function i(o) {
      return n.call(this, o) || this;
    }
    return i;
  }(t.LogicError);
  return Ft.InvalidArgument = r, Ft;
}
var $t = {}, po;
function Vf() {
  if (po)
    return $t;
  po = 1;
  var e = S && S.__extends || function() {
    var n = function(i, o) {
      return n = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(a, u) {
        a.__proto__ = u;
      } || function(a, u) {
        for (var s in u)
          Object.prototype.hasOwnProperty.call(u, s) && (a[s] = u[s]);
      }, n(i, o);
    };
    return function(i, o) {
      if (typeof o != "function" && o !== null)
        throw new TypeError("Class extends value " + String(o) + " is not a constructor or null");
      n(i, o);
      function a() {
        this.constructor = i;
      }
      i.prototype = o === null ? Object.create(o) : (a.prototype = o.prototype, new a());
    };
  }();
  Object.defineProperty($t, "__esModule", { value: !0 }), $t.OutOfRange = void 0;
  var t = Ka(), r = function(n) {
    e(i, n);
    function i(o) {
      return n.call(this, o) || this;
    }
    return i;
  }(t.LogicError);
  return $t.OutOfRange = r, $t;
}
var _o;
function sn() {
  return _o || (_o = 1, function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.ErrorGenerator = void 0;
    var t = Za(), r = Vf();
    (function(n) {
      function i(d) {
        if (typeof d == "string")
          return d;
        var p = d.constructor.name;
        return d.constructor.__MODULE && (p = "".concat(d.constructor.__MODULE, ".").concat(p)), "std.".concat(p);
      }
      n.get_class_name = i;
      function o(d, p) {
        return new r.OutOfRange("Error on ".concat(i(d), ".").concat(p, "(): it's empty container."));
      }
      n.empty = o;
      function a(d, p, _) {
        return new r.OutOfRange("Error on ".concat(i(d), ".").concat(p, "(): parametric index is negative -> (index = ").concat(_, ")."));
      }
      n.negative_index = a;
      function u(d, p, _, g) {
        return new r.OutOfRange("Error on ".concat(i(d), ".").concat(p, "(): parametric index is equal or greater than size -> (index = ").concat(_, ", size: ").concat(g, ")."));
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
      function h(d, p, _) {
        return new r.OutOfRange("Error on ".concat(i(d), ".").concat(p, "(): parametric iterator is directing negative position -> (index = ").concat(_, ")."));
      }
      n.negative_iterator = h;
      function l(d, p) {
        p === void 0 && (p = "end");
        var _ = i(d);
        return new r.OutOfRange("Error on ".concat(_, ".Iterator.value: cannot access to the ").concat(_, ".").concat(p, "().value."));
      }
      n.iterator_end_value = l;
      function c(d, p, _) {
        throw new r.OutOfRange("Error on ".concat(i(d), ".").concat(p, "(): unable to find the matched key -> ").concat(_));
      }
      n.key_nout_found = c;
    })(e.ErrorGenerator || (e.ErrorGenerator = {}));
  }(Ln)), Ln;
}
var vo;
function Kf() {
  if (vo)
    return Pt;
  vo = 1;
  var e = S && S.__extends || function() {
    var a = function(u, s) {
      return a = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(f, h) {
        f.__proto__ = h;
      } || function(f, h) {
        for (var l in h)
          Object.prototype.hasOwnProperty.call(h, l) && (f[l] = h[l]);
      }, a(u, s);
    };
    return function(u, s) {
      if (typeof s != "function" && s !== null)
        throw new TypeError("Class extends value " + String(s) + " is not a constructor or null");
      a(u, s);
      function f() {
        this.constructor = u;
      }
      u.prototype = s === null ? Object.create(s) : (f.prototype = s.prototype, new f());
    };
  }(), t = S && S.__read || function(a, u) {
    var s = typeof Symbol == "function" && a[Symbol.iterator];
    if (!s)
      return a;
    var f = s.call(a), h, l = [], c;
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
  }, r = S && S.__spreadArray || function(a, u, s) {
    if (s || arguments.length === 2)
      for (var f = 0, h = u.length, l; f < h; f++)
        (l || !(f in u)) && (l || (l = Array.prototype.slice.call(u, 0, f)), l[f] = u[f]);
    return a.concat(l || Array.prototype.slice.call(u));
  };
  Object.defineProperty(Pt, "__esModule", { value: !0 }), Pt.UniqueSet = void 0;
  var n = Gf(), i = sn(), o = function(a) {
    e(u, a);
    function u() {
      return a !== null && a.apply(this, arguments) || this;
    }
    return u.prototype.count = function(s) {
      return this.find(s).equals(this.end()) ? 0 : 1;
    }, u.prototype.insert = function() {
      for (var s = [], f = 0; f < arguments.length; f++)
        s[f] = arguments[f];
      return a.prototype.insert.apply(this, r([], t(s), !1));
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
  return Pt.UniqueSet = o, Pt;
}
var Pn = {}, qn = {}, yo;
function Zf() {
  return yo || (yo = 1, function(e) {
    var t = S && S.__read || function(n, i) {
      var o = typeof Symbol == "function" && n[Symbol.iterator];
      if (!o)
        return n;
      var a = o.call(n), u, s = [], f;
      try {
        for (; (i === void 0 || i-- > 0) && !(u = a.next()).done; )
          s.push(u.value);
      } catch (h) {
        f = { error: h };
      } finally {
        try {
          u && !u.done && (o = a.return) && o.call(a);
        } finally {
          if (f)
            throw f.error;
        }
      }
      return s;
    }, r = S && S.__spreadArray || function(n, i, o) {
      if (o || arguments.length === 2)
        for (var a = 0, u = i.length, s; a < u; a++)
          (s || !(a in i)) && (s || (s = Array.prototype.slice.call(i, 0, a)), s[a] = i[a]);
      return n.concat(s || Array.prototype.slice.call(i));
    };
    Object.defineProperty(e, "__esModule", { value: !0 }), e.IAssociativeContainer = void 0, function(n) {
      function i(o) {
        for (var a = [], u = 1; u < arguments.length; u++)
          a[u - 1] = arguments[u];
        var s, f;
        return a.length >= 1 && a[0] instanceof Array ? (s = function() {
          var h = a[0];
          o.push.apply(o, r([], t(h), !1));
        }, f = a.slice(1)) : a.length >= 2 && a[0].next instanceof Function && a[1].next instanceof Function ? (s = function() {
          var h = a[0], l = a[1];
          o.assign(h, l);
        }, f = a.slice(2)) : (s = null, f = a), { ramda: s, tail: f };
      }
      n.construct = i;
    }(e.IAssociativeContainer || (e.IAssociativeContainer = {}));
  }(qn)), qn;
}
var Wt = {}, zt = {}, Gt = {}, go;
function Xf() {
  if (go)
    return Gt;
  go = 1, Object.defineProperty(Gt, "__esModule", { value: !0 }), Gt._Get_root = void 0;
  var e = wr;
  function t() {
    return r === null && (r = (0, e.is_node)() ? S : self, r.__s_iUID === void 0 && (r.__s_iUID = 0)), r;
  }
  Gt._Get_root = t;
  var r = null;
  return Gt;
}
var bo;
function Xa() {
  if (bo)
    return zt;
  bo = 1, Object.defineProperty(zt, "__esModule", { value: !0 }), zt.get_uid = void 0;
  var e = Xf();
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
  return zt.get_uid = t, zt;
}
var wo;
function Ri() {
  if (wo)
    return Wt;
  wo = 1;
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
  Object.defineProperty(Wt, "__esModule", { value: !0 }), Wt.hash = void 0;
  var t = Xa();
  function r() {
    for (var s, f, h = [], l = 0; l < arguments.length; l++)
      h[l] = arguments[l];
    var c = a;
    try {
      for (var d = e(h), p = d.next(); !p.done; p = d.next()) {
        var _ = p.value;
        _ = _ && _.valueOf();
        var g = typeof _;
        if (g === "boolean")
          c = n(_, c);
        else if (g === "number" || g === "bigint")
          c = i(_, c);
        else if (g === "string")
          c = o(_, c);
        else if (_ instanceof Object && _.hashCode instanceof Function) {
          var m = _.hashCode();
          if (h.length === 1)
            return m;
          c = c ^ m, c *= u;
        } else
          c = i((0, t.get_uid)(_), c);
      }
    } catch (x) {
      s = { error: x };
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
  Wt.hash = r;
  function n(s, f) {
    return f ^= s ? 1 : 0, f *= u, f;
  }
  function i(s, f) {
    return o(s.toString(), f);
  }
  function o(s, f) {
    for (var h = 0; h < s.length; ++h)
      f ^= s.charCodeAt(h), f *= u;
    return Math.abs(f);
  }
  var a = 2166136261, u = 16777619;
  return Wt;
}
var pe = {}, xo;
function Oi() {
  if (xo)
    return pe;
  xo = 1, Object.defineProperty(pe, "__esModule", { value: !0 }), pe.greater_equal = pe.greater = pe.less_equal = pe.less = pe.not_equal_to = pe.equal_to = void 0;
  var e = Xa();
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
  function o(u, s) {
    return !i(u, s);
  }
  pe.greater = o;
  function a(u, s) {
    return !n(u, s);
  }
  return pe.greater_equal = a, pe;
}
var mo;
function Qa() {
  return mo || (mo = 1, function(e) {
    var t = S && S.__read || function(a, u) {
      var s = typeof Symbol == "function" && a[Symbol.iterator];
      if (!s)
        return a;
      var f = s.call(a), h, l = [], c;
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
    }, r = S && S.__spreadArray || function(a, u, s) {
      if (s || arguments.length === 2)
        for (var f = 0, h = u.length, l; f < h; f++)
          (l || !(f in u)) && (l || (l = Array.prototype.slice.call(u, 0, f)), l[f] = u[f]);
      return a.concat(l || Array.prototype.slice.call(u));
    };
    Object.defineProperty(e, "__esModule", { value: !0 }), e.IHashContainer = void 0;
    var n = Zf(), i = Ri(), o = Oi();
    (function(a) {
      function u(s, f, h) {
        for (var l = [], c = 3; c < arguments.length; c++)
          l[c - 3] = arguments[c];
        var d = null, p = i.hash, _ = o.equal_to;
        if (l.length === 1 && l[0] instanceof f) {
          var g = l[0];
          p = g.hash_function(), _ = g.key_eq(), d = function() {
            var x = g.begin(), A = g.end();
            s.assign(x, A);
          };
        } else {
          var m = n.IAssociativeContainer.construct.apply(n.IAssociativeContainer, r([s], t(l), !1));
          d = m.ramda, m.tail.length >= 1 && (p = m.tail[0]), m.tail.length >= 2 && (_ = m.tail[1]);
        }
        h(p, _), d !== null && d();
      }
      a.construct = u;
    })(e.IHashContainer || (e.IHashContainer = {}));
  }(Pn)), Pn;
}
var Dn = {}, Yt = {}, Vt = {}, Eo;
function Ai() {
  if (Eo)
    return Vt;
  Eo = 1, Object.defineProperty(Vt, "__esModule", { value: !0 }), Vt.ListIterator = void 0;
  var e = sn(), t = function() {
    function r(n, i, o) {
      this.prev_ = n, this.next_ = i, this.value_ = o;
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
  return Vt.ListIterator = t, Vt;
}
var Kt = {}, So;
function Qf() {
  if (So)
    return Kt;
  So = 1, Object.defineProperty(Kt, "__esModule", { value: !0 }), Kt.Repeater = void 0;
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
  return Kt.Repeater = e, Kt;
}
var _e = {}, Ro;
function Jf() {
  if (Ro)
    return _e;
  Ro = 1, Object.defineProperty(_e, "__esModule", { value: !0 }), _e.next = _e.prev = _e.advance = _e.distance = _e.size = _e.empty = void 0;
  var e = Za();
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
  function o(s, f) {
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
  _e.advance = o;
  function a(s, f) {
    return f === void 0 && (f = 1), f === 1 ? s.prev() : o(s, -f);
  }
  _e.prev = a;
  function u(s, f) {
    return f === void 0 && (f = 1), f === 1 ? s.next() : o(s, f);
  }
  return _e.next = u, _e;
}
var Oo;
function Ja() {
  if (Oo)
    return Yt;
  Oo = 1;
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
    var c = l.call(f), d, p = [], _;
    try {
      for (; (h === void 0 || h-- > 0) && !(d = c.next()).done; )
        p.push(d.value);
    } catch (g) {
      _ = { error: g };
    } finally {
      try {
        d && !d.done && (l = c.return) && l.call(c);
      } finally {
        if (_)
          throw _.error;
      }
    }
    return p;
  };
  Object.defineProperty(Yt, "__esModule", { value: !0 }), Yt.ListContainer = void 0;
  var r = Ei(), n = Ai(), i = Qf(), o = Si(), a = Jf(), u = sn(), s = function(f) {
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
      c > 0 ? this.insert(this.end(), c, void 0) : c < 0 && this.erase((0, a.advance)(this.end(), -c), this.end());
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
      var d = new o.NativeArrayIterator(l, 0), p = new o.NativeArrayIterator(l, l.length);
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
      var p = new i.Repeater(0, d), _ = new i.Repeater(c);
      return this._Insert_by_range(l, p, _);
    }, h.prototype._Insert_by_range = function(l, c, d) {
      for (var p = l.prev(), _ = null, g = 0, m = c; m.equals(d) === !1; m = m.next()) {
        var x = this._Create_iterator(p, null, m.value);
        g === 0 && (_ = x), n.ListIterator._Set_next(p, x), p = x, ++g;
      }
      return l.equals(this.begin()) === !0 && (this.begin_ = _), n.ListIterator._Set_next(p, l), n.ListIterator._Set_prev(l, p), this.size_ += g, _;
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
  return Yt.ListContainer = s, Yt;
}
var Zt = {}, Ao;
function es() {
  if (Ao)
    return Zt;
  Ao = 1, Object.defineProperty(Zt, "__esModule", { value: !0 }), Zt.ReverseIterator = void 0;
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
  return Zt.ReverseIterator = e, Zt;
}
var Io;
function el() {
  return Io || (Io = 1, function(e) {
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
    var n = Ja(), i = Ai(), o = es(), a = function(u) {
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
    e.SetElementList = a, function(u) {
      var s = function(h) {
        t(l, h);
        function l(c, d, p, _) {
          var g = h.call(this, d, p, _) || this;
          return g.source_ = c, g;
        }
        return l.create = function(c, d, p, _) {
          return new l(c, d, p, _);
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
      }(o.ReverseIterator);
      u.ReverseIterator = f;
    }(a = e.SetElementList || (e.SetElementList = {})), e.SetElementList = a;
  }(Dn)), Dn;
}
var Xt = {}, Qt = {}, To;
function ts() {
  if (To)
    return Qt;
  To = 1;
  var e = S && S.__values || function(i) {
    var o = typeof Symbol == "function" && Symbol.iterator, a = o && i[o], u = 0;
    if (a)
      return a.call(i);
    if (i && typeof i.length == "number")
      return {
        next: function() {
          return i && u >= i.length && (i = void 0), { value: i && i[u++], done: !i };
        }
      };
    throw new TypeError(o ? "Object is not iterable." : "Symbol.iterator is not defined.");
  };
  Object.defineProperty(Qt, "__esModule", { value: !0 }), Qt.HashBuckets = void 0;
  var t = function() {
    function i(o, a) {
      this.fetcher_ = o, this.hasher_ = a, this.max_load_factor_ = n, this.data_ = [], this.size_ = 0, this.initialize();
    }
    return i.prototype.clear = function() {
      this.data_ = [], this.size_ = 0, this.initialize();
    }, i.prototype.rehash = function(o) {
      var a, u, s, f;
      o = Math.max(o, r);
      for (var h = [], l = 0; l < o; ++l)
        h.push([]);
      try {
        for (var c = e(this.data_), d = c.next(); !d.done; d = c.next()) {
          var p = d.value;
          try {
            for (var _ = (s = void 0, e(p)), g = _.next(); !g.done; g = _.next()) {
              var m = g.value, x = this.hasher_(this.fetcher_(m)) % h.length;
              h[x].push(m);
            }
          } catch (A) {
            s = { error: A };
          } finally {
            try {
              g && !g.done && (f = _.return) && f.call(_);
            } finally {
              if (s)
                throw s.error;
            }
          }
        }
      } catch (A) {
        a = { error: A };
      } finally {
        try {
          d && !d.done && (u = c.return) && u.call(c);
        } finally {
          if (a)
            throw a.error;
        }
      }
      this.data_ = h;
    }, i.prototype.reserve = function(o) {
      o > this.capacity() && (o = Math.floor(o / this.max_load_factor_), this.rehash(o));
    }, i.prototype.initialize = function() {
      for (var o = 0; o < r; ++o)
        this.data_.push([]);
    }, i.prototype.length = function() {
      return this.data_.length;
    }, i.prototype.capacity = function() {
      return this.data_.length * this.max_load_factor_;
    }, i.prototype.at = function(o) {
      return this.data_[o];
    }, i.prototype.load_factor = function() {
      return this.size_ / this.length();
    }, i.prototype.max_load_factor = function(o) {
      if (o === void 0 && (o = null), o === null)
        return this.max_load_factor_;
      this.max_load_factor_ = o;
    }, i.prototype.hash_function = function() {
      return this.hasher_;
    }, i.prototype.index = function(o) {
      return this.hasher_(this.fetcher_(o)) % this.length();
    }, i.prototype.insert = function(o) {
      var a = this.capacity();
      ++this.size_ > a && this.reserve(a * 2);
      var u = this.index(o);
      this.data_[u].push(o);
    }, i.prototype.erase = function(o) {
      for (var a = this.index(o), u = this.data_[a], s = 0; s < u.length; ++s)
        if (u[s] === o) {
          u.splice(s, 1), --this.size_;
          break;
        }
    }, i;
  }();
  Qt.HashBuckets = t;
  var r = 10, n = 1;
  return Qt;
}
var Co;
function tl() {
  if (Co)
    return Xt;
  Co = 1;
  var e = S && S.__extends || function() {
    var a = function(u, s) {
      return a = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(f, h) {
        f.__proto__ = h;
      } || function(f, h) {
        for (var l in h)
          Object.prototype.hasOwnProperty.call(h, l) && (f[l] = h[l]);
      }, a(u, s);
    };
    return function(u, s) {
      if (typeof s != "function" && s !== null)
        throw new TypeError("Class extends value " + String(s) + " is not a constructor or null");
      a(u, s);
      function f() {
        this.constructor = u;
      }
      u.prototype = s === null ? Object.create(s) : (f.prototype = s.prototype, new f());
    };
  }(), t = S && S.__read || function(a, u) {
    var s = typeof Symbol == "function" && a[Symbol.iterator];
    if (!s)
      return a;
    var f = s.call(a), h, l = [], c;
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
  }, r = S && S.__values || function(a) {
    var u = typeof Symbol == "function" && Symbol.iterator, s = u && a[u], f = 0;
    if (s)
      return s.call(a);
    if (a && typeof a.length == "number")
      return {
        next: function() {
          return a && f >= a.length && (a = void 0), { value: a && a[f++], done: !a };
        }
      };
    throw new TypeError(u ? "Object is not iterable." : "Symbol.iterator is not defined.");
  };
  Object.defineProperty(Xt, "__esModule", { value: !0 }), Xt.SetHashBuckets = void 0;
  var n = ts(), i = function(a) {
    e(u, a);
    function u(s, f, h) {
      var l = a.call(this, o, f) || this;
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
          var _ = p.value;
          if (this.key_eq_(_.value, s))
            return _;
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
  Xt.SetHashBuckets = i;
  function o(a) {
    return a.value;
  }
  return Xt;
}
var Je = {}, Mo;
function rs() {
  if (Mo)
    return Je;
  Mo = 1, Object.defineProperty(Je, "__esModule", { value: !0 }), Je.make_pair = Je.Pair = void 0;
  var e = Ri(), t = Oi(), r = function() {
    function i(o, a) {
      this.first = o, this.second = a;
    }
    return i.prototype.equals = function(o) {
      return (0, t.equal_to)(this.first, o.first) && (0, t.equal_to)(this.second, o.second);
    }, i.prototype.less = function(o) {
      return (0, t.equal_to)(this.first, o.first) === !1 ? (0, t.less)(this.first, o.first) : (0, t.less)(this.second, o.second);
    }, i.prototype.hashCode = function() {
      return (0, e.hash)(this.first, this.second);
    }, i;
  }();
  Je.Pair = r;
  function n(i, o) {
    return new r(i, o);
  }
  return Je.make_pair = n, Je;
}
var ko;
function rl() {
  return ko || (ko = 1, function(e) {
    var t = S && S.__extends || function() {
      var h = function(l, c) {
        return h = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d, p) {
          d.__proto__ = p;
        } || function(d, p) {
          for (var _ in p)
            Object.prototype.hasOwnProperty.call(p, _) && (d[_] = p[_]);
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
      var d = c.call(h), p, _ = [], g;
      try {
        for (; (l === void 0 || l-- > 0) && !(p = d.next()).done; )
          _.push(p.value);
      } catch (m) {
        g = { error: m };
      } finally {
        try {
          p && !p.done && (c = d.return) && c.call(d);
        } finally {
          if (g)
            throw g.error;
        }
      }
      return _;
    }, n = S && S.__spreadArray || function(h, l, c) {
      if (c || arguments.length === 2)
        for (var d = 0, p = l.length, _; d < p; d++)
          (_ || !(d in l)) && (_ || (_ = Array.prototype.slice.call(l, 0, d)), _[d] = l[d]);
      return h.concat(_ || Array.prototype.slice.call(l));
    };
    Object.defineProperty(e, "__esModule", { value: !0 }), e.HashSet = void 0;
    var i = Kf(), o = Qa(), a = el(), u = tl(), s = rs(), f = function(h) {
      t(l, h);
      function l() {
        for (var c = [], d = 0; d < arguments.length; d++)
          c[d] = arguments[d];
        var p = h.call(this, function(_) {
          return new a.SetElementList(_);
        }) || this;
        return o.IHashContainer.construct.apply(o.IHashContainer, n([
          p,
          l,
          function(_, g) {
            p.buckets_ = new u.SetHashBuckets(p, _, g);
          }
        ], r(c), !1)), p;
      }
      return l.prototype.clear = function() {
        this.buckets_.clear(), h.prototype.clear.call(this);
      }, l.prototype.swap = function(c) {
        var d, p;
        d = r([c.data_, this.data_], 2), this.data_ = d[0], c.data_ = d[1], a.SetElementList._Swap_associative(this.data_, c.data_), u.SetHashBuckets._Swap_source(this.buckets_, c.buckets_), p = r([c.buckets_, this.buckets_], 2), this.buckets_ = p[0], c.buckets_ = p[1];
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
      h.Iterator = a.SetElementList.Iterator, h.ReverseIterator = a.SetElementList.ReverseIterator;
    }(f = e.HashSet || (e.HashSet = {})), e.HashSet = f;
  }(Bn)), Bn;
}
var jn = {}, Jt = {}, er = {}, Bo;
function nl() {
  if (Bo)
    return er;
  Bo = 1;
  var e = S && S.__extends || function() {
    var i = function(o, a) {
      return i = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(u, s) {
        u.__proto__ = s;
      } || function(u, s) {
        for (var f in s)
          Object.prototype.hasOwnProperty.call(s, f) && (u[f] = s[f]);
      }, i(o, a);
    };
    return function(o, a) {
      if (typeof a != "function" && a !== null)
        throw new TypeError("Class extends value " + String(a) + " is not a constructor or null");
      i(o, a);
      function u() {
        this.constructor = o;
      }
      o.prototype = a === null ? Object.create(a) : (u.prototype = a.prototype, new u());
    };
  }();
  Object.defineProperty(er, "__esModule", { value: !0 }), er.MapContainer = void 0;
  var t = Ei(), r = Si(), n = function(i) {
    e(o, i);
    function o(a) {
      var u = i.call(this) || this;
      return u.data_ = a(u), u;
    }
    return o.prototype.assign = function(a, u) {
      this.clear(), this.insert(a, u);
    }, o.prototype.clear = function() {
      this.data_.clear();
    }, o.prototype.begin = function() {
      return this.data_.begin();
    }, o.prototype.end = function() {
      return this.data_.end();
    }, o.prototype.has = function(a) {
      return !this.find(a).equals(this.end());
    }, o.prototype.size = function() {
      return this.data_.size();
    }, o.prototype.push = function() {
      for (var a = [], u = 0; u < arguments.length; u++)
        a[u] = arguments[u];
      var s = new r.NativeArrayIterator(a, 0), f = new r.NativeArrayIterator(a, a.length);
      return this.insert(s, f), this.size();
    }, o.prototype.insert = function() {
      for (var a = [], u = 0; u < arguments.length; u++)
        a[u] = arguments[u];
      return a.length === 1 ? this.emplace(a[0].first, a[0].second) : a[0].next instanceof Function && a[1].next instanceof Function ? this._Insert_by_range(a[0], a[1]) : this.emplace_hint(a[0], a[1].first, a[1].second);
    }, o.prototype.erase = function() {
      for (var a = [], u = 0; u < arguments.length; u++)
        a[u] = arguments[u];
      return a.length === 1 && (!(a[0] instanceof this.end().constructor) || a[0].source() !== this) ? this._Erase_by_key(a[0]) : a.length === 1 ? this._Erase_by_range(a[0]) : this._Erase_by_range(a[0], a[1]);
    }, o.prototype._Erase_by_range = function(a, u) {
      u === void 0 && (u = a.next());
      var s = this.data_.erase(a, u);
      return this._Handle_erase(a, u), s;
    }, o;
  }(t.Container);
  return er.MapContainer = n, er;
}
var Lo;
function il() {
  if (Lo)
    return Jt;
  Lo = 1;
  var e = S && S.__extends || function() {
    var a = function(u, s) {
      return a = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(f, h) {
        f.__proto__ = h;
      } || function(f, h) {
        for (var l in h)
          Object.prototype.hasOwnProperty.call(h, l) && (f[l] = h[l]);
      }, a(u, s);
    };
    return function(u, s) {
      if (typeof s != "function" && s !== null)
        throw new TypeError("Class extends value " + String(s) + " is not a constructor or null");
      a(u, s);
      function f() {
        this.constructor = u;
      }
      u.prototype = s === null ? Object.create(s) : (f.prototype = s.prototype, new f());
    };
  }(), t = S && S.__read || function(a, u) {
    var s = typeof Symbol == "function" && a[Symbol.iterator];
    if (!s)
      return a;
    var f = s.call(a), h, l = [], c;
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
  }, r = S && S.__spreadArray || function(a, u, s) {
    if (s || arguments.length === 2)
      for (var f = 0, h = u.length, l; f < h; f++)
        (l || !(f in u)) && (l || (l = Array.prototype.slice.call(u, 0, f)), l[f] = u[f]);
    return a.concat(l || Array.prototype.slice.call(u));
  };
  Object.defineProperty(Jt, "__esModule", { value: !0 }), Jt.UniqueMap = void 0;
  var n = nl(), i = sn(), o = function(a) {
    e(u, a);
    function u() {
      return a !== null && a.apply(this, arguments) || this;
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
      return a.prototype.insert.apply(this, r([], t(s), !1));
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
  return Jt.UniqueMap = o, Jt;
}
var Nn = {}, Po;
function ol() {
  return Po || (Po = 1, function(e) {
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
    var n = Ja(), i = Ai(), o = es(), a = function(u) {
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
    e.MapElementList = a, function(u) {
      var s = function(h) {
        t(l, h);
        function l(c, d, p, _) {
          var g = h.call(this, d, p, _) || this;
          return g.list_ = c, g;
        }
        return l.create = function(c, d, p, _) {
          return new l(c, d, p, _);
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
      }(o.ReverseIterator);
      u.ReverseIterator = f;
    }(a = e.MapElementList || (e.MapElementList = {})), e.MapElementList = a;
  }(Nn)), Nn;
}
var tr = {}, qo;
function al() {
  if (qo)
    return tr;
  qo = 1;
  var e = S && S.__extends || function() {
    var a = function(u, s) {
      return a = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(f, h) {
        f.__proto__ = h;
      } || function(f, h) {
        for (var l in h)
          Object.prototype.hasOwnProperty.call(h, l) && (f[l] = h[l]);
      }, a(u, s);
    };
    return function(u, s) {
      if (typeof s != "function" && s !== null)
        throw new TypeError("Class extends value " + String(s) + " is not a constructor or null");
      a(u, s);
      function f() {
        this.constructor = u;
      }
      u.prototype = s === null ? Object.create(s) : (f.prototype = s.prototype, new f());
    };
  }(), t = S && S.__read || function(a, u) {
    var s = typeof Symbol == "function" && a[Symbol.iterator];
    if (!s)
      return a;
    var f = s.call(a), h, l = [], c;
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
  }, r = S && S.__values || function(a) {
    var u = typeof Symbol == "function" && Symbol.iterator, s = u && a[u], f = 0;
    if (s)
      return s.call(a);
    if (a && typeof a.length == "number")
      return {
        next: function() {
          return a && f >= a.length && (a = void 0), { value: a && a[f++], done: !a };
        }
      };
    throw new TypeError(u ? "Object is not iterable." : "Symbol.iterator is not defined.");
  };
  Object.defineProperty(tr, "__esModule", { value: !0 }), tr.MapHashBuckets = void 0;
  var n = ts(), i = function(a) {
    e(u, a);
    function u(s, f, h) {
      var l = a.call(this, o, f) || this;
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
          var _ = p.value;
          if (this.key_eq_(_.first, s))
            return _;
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
  tr.MapHashBuckets = i;
  function o(a) {
    return a.first;
  }
  return tr;
}
var rr = {}, Do;
function sl() {
  if (Do)
    return rr;
  Do = 1, Object.defineProperty(rr, "__esModule", { value: !0 }), rr.Entry = void 0;
  var e = Ri(), t = Oi(), r = function() {
    function n(i, o) {
      this.first = i, this.second = o;
    }
    return n.prototype.equals = function(i) {
      return (0, t.equal_to)(this.first, i.first);
    }, n.prototype.less = function(i) {
      return (0, t.less)(this.first, i.first);
    }, n.prototype.hashCode = function() {
      return (0, e.hash)(this.first);
    }, n;
  }();
  return rr.Entry = r, rr;
}
var jo;
function ul() {
  return jo || (jo = 1, function(e) {
    var t = S && S.__extends || function() {
      var l = function(c, d) {
        return l = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(p, _) {
          p.__proto__ = _;
        } || function(p, _) {
          for (var g in _)
            Object.prototype.hasOwnProperty.call(_, g) && (p[g] = _[g]);
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
      var p = d.call(l), _, g = [], m;
      try {
        for (; (c === void 0 || c-- > 0) && !(_ = p.next()).done; )
          g.push(_.value);
      } catch (x) {
        m = { error: x };
      } finally {
        try {
          _ && !_.done && (d = p.return) && d.call(p);
        } finally {
          if (m)
            throw m.error;
        }
      }
      return g;
    }, n = S && S.__spreadArray || function(l, c, d) {
      if (d || arguments.length === 2)
        for (var p = 0, _ = c.length, g; p < _; p++)
          (g || !(p in c)) && (g || (g = Array.prototype.slice.call(c, 0, p)), g[p] = c[p]);
      return l.concat(g || Array.prototype.slice.call(c));
    };
    Object.defineProperty(e, "__esModule", { value: !0 }), e.HashMap = void 0;
    var i = il(), o = Qa(), a = ol(), u = al(), s = sl(), f = rs(), h = function(l) {
      t(c, l);
      function c() {
        for (var d = [], p = 0; p < arguments.length; p++)
          d[p] = arguments[p];
        var _ = l.call(this, function(g) {
          return new a.MapElementList(g);
        }) || this;
        return o.IHashContainer.construct.apply(o.IHashContainer, n([
          _,
          c,
          function(g, m) {
            _.buckets_ = new u.MapHashBuckets(_, g, m);
          }
        ], r(d), !1)), _;
      }
      return c.prototype.clear = function() {
        this.buckets_.clear(), l.prototype.clear.call(this);
      }, c.prototype.swap = function(d) {
        var p, _;
        p = r([d.data_, this.data_], 2), this.data_ = p[0], d.data_ = p[1], a.MapElementList._Swap_associative(this.data_, d.data_), u.MapHashBuckets._Swap_source(this.buckets_, d.buckets_), _ = r([d.buckets_, this.buckets_], 2), this.buckets_ = _[0], d.buckets_ = _[1];
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
        var _ = this.find(d);
        return _.equals(this.end()) === !1 ? new f.Pair(_, !1) : (this.data_.push(new s.Entry(d, p)), _ = _.prev(), this._Handle_insert(_, _.next()), new f.Pair(_, !0));
      }, c.prototype.emplace_hint = function(d, p, _) {
        var g = this.find(p);
        return g.equals(this.end()) === !0 && (g = this.data_.insert(d, new s.Entry(p, _)), this._Handle_insert(g, g.next())), g;
      }, c.prototype._Handle_insert = function(d, p) {
        for (; !d.equals(p); d = d.next())
          this.buckets_.insert(d);
      }, c.prototype._Handle_erase = function(d, p) {
        for (; !d.equals(p); d = d.next())
          this.buckets_.erase(d);
      }, c;
    }(i.UniqueMap);
    e.HashMap = h, function(l) {
      l.Iterator = a.MapElementList.Iterator, l.ReverseIterator = a.MapElementList.ReverseIterator;
    }(h = e.HashMap || (e.HashMap = {})), e.HashMap = h;
  }(jn)), jn;
}
var No;
function fl() {
  if (No)
    return Br;
  No = 1;
  var e = S && S.__values || function(i) {
    var o = typeof Symbol == "function" && i[Symbol.iterator], a = 0;
    return o ? o.call(i) : {
      next: function() {
        return i && a >= i.length && (i = void 0), { value: i && i[a++], done: !i };
      }
    };
  };
  Object.defineProperty(Br, "__esModule", { value: !0 });
  var t = rl(), r = ul(), n = function() {
    function i() {
      this.listeners_ = new r.HashMap(), this.created_at_ = new Date();
    }
    return i.prototype.dispatchEvent = function(o) {
      var a, u, s = this.listeners_.find(o.type);
      if (!s.equals(this.listeners_.end())) {
        o.target = this, o.timeStamp = new Date().getTime() - this.created_at_.getTime();
        try {
          for (var f = e(s.second), h = f.next(); !h.done; h = f.next()) {
            var l = h.value;
            l(o);
          }
        } catch (c) {
          a = { error: c };
        } finally {
          try {
            h && !h.done && (u = f.return) && u.call(f);
          } finally {
            if (a)
              throw a.error;
          }
        }
      }
    }, i.prototype.addEventListener = function(o, a) {
      var u = this.listeners_.find(o);
      u.equals(this.listeners_.end()) && (u = this.listeners_.emplace(o, new t.HashSet()).first), u.second.insert(a);
    }, i.prototype.removeEventListener = function(o, a) {
      var u = this.listeners_.find(o);
      u.equals(this.listeners_.end()) || (u.second.erase(a), u.second.empty() && this.listeners_.erase(u));
    }, i;
  }();
  return Br.EventTarget = n, Br;
}
var Lr = {}, Fo;
function un() {
  if (Fo)
    return Lr;
  Fo = 1, Object.defineProperty(Lr, "__esModule", { value: !0 });
  var e = function() {
    function t(r, n) {
      this.type = r, n && Object.assign(this, n);
    }
    return t;
  }();
  return Lr.Event = e, Lr;
}
var Pr = {}, Uo;
function ll() {
  if (Uo)
    return Pr;
  Uo = 1;
  var e = S && S.__extends || function() {
    var n = function(i, o) {
      return n = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(a, u) {
        a.__proto__ = u;
      } || function(a, u) {
        for (var s in u)
          u.hasOwnProperty(s) && (a[s] = u[s]);
      }, n(i, o);
    };
    return function(i, o) {
      n(i, o);
      function a() {
        this.constructor = i;
      }
      i.prototype = o === null ? Object.create(o) : (a.prototype = o.prototype, new a());
    };
  }();
  Object.defineProperty(Pr, "__esModule", { value: !0 });
  var t = un(), r = function(n) {
    e(i, n);
    function i(o, a) {
      return n.call(this, o, a) || this;
    }
    return i;
  }(t.Event);
  return Pr.CloseEvent = r, Pr;
}
var qr = {}, Ho;
function cl() {
  if (Ho)
    return qr;
  Ho = 1;
  var e = S && S.__extends || function() {
    var n = function(i, o) {
      return n = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(a, u) {
        a.__proto__ = u;
      } || function(a, u) {
        for (var s in u)
          u.hasOwnProperty(s) && (a[s] = u[s]);
      }, n(i, o);
    };
    return function(i, o) {
      n(i, o);
      function a() {
        this.constructor = i;
      }
      i.prototype = o === null ? Object.create(o) : (a.prototype = o.prototype, new a());
    };
  }();
  Object.defineProperty(qr, "__esModule", { value: !0 });
  var t = un(), r = function(n) {
    e(i, n);
    function i(o, a) {
      return n.call(this, o, a) || this;
    }
    return i;
  }(t.Event);
  return qr.MessageEvent = r, qr;
}
var Dr = {}, $o;
function hl() {
  if ($o)
    return Dr;
  $o = 1;
  var e = S && S.__extends || function() {
    var n = function(i, o) {
      return n = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(a, u) {
        a.__proto__ = u;
      } || function(a, u) {
        for (var s in u)
          u.hasOwnProperty(s) && (a[s] = u[s]);
      }, n(i, o);
    };
    return function(i, o) {
      n(i, o);
      function a() {
        this.constructor = i;
      }
      i.prototype = o === null ? Object.create(o) : (a.prototype = o.prototype, new a());
    };
  }();
  Object.defineProperty(Dr, "__esModule", { value: !0 });
  var t = un(), r = function(n) {
    e(i, n);
    function i(o, a) {
      return n.call(this, o, a) || this;
    }
    return i;
  }(t.Event);
  return Dr.ErrorEvent = r, Dr;
}
var Wo;
function dl() {
  return Wo || (Wo = 1, function(e) {
    var t = S && S.__extends || function() {
      var l = function(c, d) {
        return l = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(p, _) {
          p.__proto__ = _;
        } || function(p, _) {
          for (var g in _)
            _.hasOwnProperty(g) && (p[g] = _[g]);
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
          for (var _ in c)
            Object.prototype.hasOwnProperty.call(c, _) && (l[_] = c[_]);
        }
        return l;
      }, r.apply(this, arguments);
    };
    Object.defineProperty(e, "__esModule", { value: !0 });
    var n = Wf(), i = fl(), o = un(), a = ll(), u = cl(), s = hl(), f = function(l) {
      t(c, l);
      function c(d, p) {
        var _ = l.call(this) || this;
        return _.on_ = {}, _.state_ = c.CONNECTING, _.client_ = new n.client(), _.client_.on("connect", _._Handle_connect.bind(_)), _.client_.on("connectFailed", _._Handle_error.bind(_)), typeof p == "string" && (p = [p]), _.client_.connect(d, p), _;
      }
      return c.prototype.close = function(d, p) {
        this.state_ = c.CLOSING, d === void 0 ? this.connection_.sendCloseFrame() : this.connection_.sendCloseFrame(d, p, !0);
      }, c.prototype.send = function(d) {
        if (typeof d.valueOf() == "string")
          this.connection_.sendUTF(d);
        else {
          var p = void 0;
          d instanceof E ? p = d : d instanceof Blob ? p = new E(d, "blob") : d.buffer ? p = new E(d.buffer) : p = new E(d), this.connection_.sendBytes(p);
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
        var p = new o.Event("open", h);
        this.dispatchEvent(p);
      }, c.prototype._Handle_close = function(d, p) {
        var _ = new a.CloseEvent("close", r({}, h, { code: d, reason: p }));
        this.state_ = c.CLOSED, this.dispatchEvent(_);
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
  }(Tn)), Tn;
}
var pl = wr;
pl.is_node() && (S.WebSocket = dl().WebSocket);
var ie = { exports: {} };
typeof Object.create == "function" ? ie.exports = function(t, r) {
  r && (t.super_ = r, t.prototype = Object.create(r.prototype, {
    constructor: {
      value: t,
      enumerable: !1,
      writable: !0,
      configurable: !0
    }
  }));
} : ie.exports = function(t, r) {
  if (r) {
    t.super_ = r;
    var n = function() {
    };
    n.prototype = r.prototype, t.prototype = new n(), t.prototype.constructor = t;
  }
};
var me = { exports: {} };
const xr = /* @__PURE__ */ mi(wf);
/*! safe-buffer. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> */
(function(e, t) {
  var r = xr, n = r.Buffer;
  function i(a, u) {
    for (var s in a)
      u[s] = a[s];
  }
  n.from && n.alloc && n.allocUnsafe && n.allocUnsafeSlow ? e.exports = r : (i(r, t), t.Buffer = o);
  function o(a, u, s) {
    return n(a, u, s);
  }
  o.prototype = Object.create(n.prototype), i(n, o), o.from = function(a, u, s) {
    if (typeof a == "number")
      throw new TypeError("Argument must not be a number");
    return n(a, u, s);
  }, o.alloc = function(a, u, s) {
    if (typeof a != "number")
      throw new TypeError("Argument must be a number");
    var f = n(a);
    return u !== void 0 ? typeof s == "string" ? f.fill(u, s) : f.fill(u) : f.fill(0), f;
  }, o.allocUnsafe = function(a) {
    if (typeof a != "number")
      throw new TypeError("Argument must be a number");
    return n(a);
  }, o.allocUnsafeSlow = function(a) {
    if (typeof a != "number")
      throw new TypeError("Argument must be a number");
    return r.SlowBuffer(a);
  };
})(me, me.exports);
var si = { exports: {} }, D = { exports: {} }, re = D.exports = {}, Pe, qe;
function ui() {
  throw new Error("setTimeout has not been defined");
}
function fi() {
  throw new Error("clearTimeout has not been defined");
}
(function() {
  try {
    typeof setTimeout == "function" ? Pe = setTimeout : Pe = ui;
  } catch {
    Pe = ui;
  }
  try {
    typeof clearTimeout == "function" ? qe = clearTimeout : qe = fi;
  } catch {
    qe = fi;
  }
})();
function ns(e) {
  if (Pe === setTimeout)
    return setTimeout(e, 0);
  if ((Pe === ui || !Pe) && setTimeout)
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
function _l(e) {
  if (qe === clearTimeout)
    return clearTimeout(e);
  if ((qe === fi || !qe) && clearTimeout)
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
function vl() {
  !xt || !nt || (xt = !1, nt.length ? We = nt.concat(We) : Ur = -1, We.length && is());
}
function is() {
  if (!xt) {
    var e = ns(vl);
    xt = !0;
    for (var t = We.length; t; ) {
      for (nt = We, We = []; ++Ur < t; )
        nt && nt[Ur].run();
      Ur = -1, t = We.length;
    }
    nt = null, xt = !1, _l(e);
  }
}
re.nextTick = function(e) {
  var t = new Array(arguments.length - 1);
  if (arguments.length > 1)
    for (var r = 1; r < arguments.length; r++)
      t[r - 1] = arguments[r];
  We.push(new os(e, t)), We.length === 1 && !xt && ns(is);
};
function os(e, t) {
  this.fun = e, this.array = t;
}
os.prototype.run = function() {
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
var Ae = { exports: {} }, mt = typeof Reflect == "object" ? Reflect : null, zo = mt && typeof mt.apply == "function" ? mt.apply : function(t, r, n) {
  return Function.prototype.apply.call(t, r, n);
}, Hr;
mt && typeof mt.ownKeys == "function" ? Hr = mt.ownKeys : Object.getOwnPropertySymbols ? Hr = function(t) {
  return Object.getOwnPropertyNames(t).concat(Object.getOwnPropertySymbols(t));
} : Hr = function(t) {
  return Object.getOwnPropertyNames(t);
};
function yl(e) {
  console && console.warn && console.warn(e);
}
var as = Number.isNaN || function(t) {
  return t !== t;
};
function G() {
  G.init.call(this);
}
Ae.exports = G;
Ae.exports.once = xl;
G.EventEmitter = G;
G.prototype._events = void 0;
G.prototype._eventsCount = 0;
G.prototype._maxListeners = void 0;
var Go = 10;
function fn(e) {
  if (typeof e != "function")
    throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof e);
}
Object.defineProperty(G, "defaultMaxListeners", {
  enumerable: !0,
  get: function() {
    return Go;
  },
  set: function(e) {
    if (typeof e != "number" || e < 0 || as(e))
      throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + e + ".");
    Go = e;
  }
});
G.init = function() {
  (this._events === void 0 || this._events === Object.getPrototypeOf(this)._events) && (this._events = /* @__PURE__ */ Object.create(null), this._eventsCount = 0), this._maxListeners = this._maxListeners || void 0;
};
G.prototype.setMaxListeners = function(t) {
  if (typeof t != "number" || t < 0 || as(t))
    throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + t + ".");
  return this._maxListeners = t, this;
};
function ss(e) {
  return e._maxListeners === void 0 ? G.defaultMaxListeners : e._maxListeners;
}
G.prototype.getMaxListeners = function() {
  return ss(this);
};
G.prototype.emit = function(t) {
  for (var r = [], n = 1; n < arguments.length; n++)
    r.push(arguments[n]);
  var i = t === "error", o = this._events;
  if (o !== void 0)
    i = i && o.error === void 0;
  else if (!i)
    return !1;
  if (i) {
    var a;
    if (r.length > 0 && (a = r[0]), a instanceof Error)
      throw a;
    var u = new Error("Unhandled error." + (a ? " (" + a.message + ")" : ""));
    throw u.context = a, u;
  }
  var s = o[t];
  if (s === void 0)
    return !1;
  if (typeof s == "function")
    zo(s, this, r);
  else
    for (var f = s.length, h = hs(s, f), n = 0; n < f; ++n)
      zo(h[n], this, r);
  return !0;
};
function us(e, t, r, n) {
  var i, o, a;
  if (fn(r), o = e._events, o === void 0 ? (o = e._events = /* @__PURE__ */ Object.create(null), e._eventsCount = 0) : (o.newListener !== void 0 && (e.emit(
    "newListener",
    t,
    r.listener ? r.listener : r
  ), o = e._events), a = o[t]), a === void 0)
    a = o[t] = r, ++e._eventsCount;
  else if (typeof a == "function" ? a = o[t] = n ? [r, a] : [a, r] : n ? a.unshift(r) : a.push(r), i = ss(e), i > 0 && a.length > i && !a.warned) {
    a.warned = !0;
    var u = new Error("Possible EventEmitter memory leak detected. " + a.length + " " + String(t) + " listeners added. Use emitter.setMaxListeners() to increase limit");
    u.name = "MaxListenersExceededWarning", u.emitter = e, u.type = t, u.count = a.length, yl(u);
  }
  return e;
}
G.prototype.addListener = function(t, r) {
  return us(this, t, r, !1);
};
G.prototype.on = G.prototype.addListener;
G.prototype.prependListener = function(t, r) {
  return us(this, t, r, !0);
};
function gl() {
  if (!this.fired)
    return this.target.removeListener(this.type, this.wrapFn), this.fired = !0, arguments.length === 0 ? this.listener.call(this.target) : this.listener.apply(this.target, arguments);
}
function fs(e, t, r) {
  var n = { fired: !1, wrapFn: void 0, target: e, type: t, listener: r }, i = gl.bind(n);
  return i.listener = r, n.wrapFn = i, i;
}
G.prototype.once = function(t, r) {
  return fn(r), this.on(t, fs(this, t, r)), this;
};
G.prototype.prependOnceListener = function(t, r) {
  return fn(r), this.prependListener(t, fs(this, t, r)), this;
};
G.prototype.removeListener = function(t, r) {
  var n, i, o, a, u;
  if (fn(r), i = this._events, i === void 0)
    return this;
  if (n = i[t], n === void 0)
    return this;
  if (n === r || n.listener === r)
    --this._eventsCount === 0 ? this._events = /* @__PURE__ */ Object.create(null) : (delete i[t], i.removeListener && this.emit("removeListener", t, n.listener || r));
  else if (typeof n != "function") {
    for (o = -1, a = n.length - 1; a >= 0; a--)
      if (n[a] === r || n[a].listener === r) {
        u = n[a].listener, o = a;
        break;
      }
    if (o < 0)
      return this;
    o === 0 ? n.shift() : bl(n, o), n.length === 1 && (i[t] = n[0]), i.removeListener !== void 0 && this.emit("removeListener", t, u || r);
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
    var o = Object.keys(n), a;
    for (i = 0; i < o.length; ++i)
      a = o[i], a !== "removeListener" && this.removeAllListeners(a);
    return this.removeAllListeners("removeListener"), this._events = /* @__PURE__ */ Object.create(null), this._eventsCount = 0, this;
  }
  if (r = n[t], typeof r == "function")
    this.removeListener(t, r);
  else if (r !== void 0)
    for (i = r.length - 1; i >= 0; i--)
      this.removeListener(t, r[i]);
  return this;
};
function ls(e, t, r) {
  var n = e._events;
  if (n === void 0)
    return [];
  var i = n[t];
  return i === void 0 ? [] : typeof i == "function" ? r ? [i.listener || i] : [i] : r ? wl(i) : hs(i, i.length);
}
G.prototype.listeners = function(t) {
  return ls(this, t, !0);
};
G.prototype.rawListeners = function(t) {
  return ls(this, t, !1);
};
G.listenerCount = function(e, t) {
  return typeof e.listenerCount == "function" ? e.listenerCount(t) : cs.call(e, t);
};
G.prototype.listenerCount = cs;
function cs(e) {
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
function hs(e, t) {
  for (var r = new Array(t), n = 0; n < t; ++n)
    r[n] = e[n];
  return r;
}
function bl(e, t) {
  for (; t + 1 < e.length; t++)
    e[t] = e[t + 1];
  e.pop();
}
function wl(e) {
  for (var t = new Array(e.length), r = 0; r < t.length; ++r)
    t[r] = e[r].listener || e[r];
  return t;
}
function xl(e, t) {
  return new Promise(function(r, n) {
    function i(a) {
      e.removeListener(t, o), n(a);
    }
    function o() {
      typeof e.removeListener == "function" && e.removeListener("error", i), r([].slice.call(arguments));
    }
    ds(e, t, o, { once: !0 }), t !== "error" && ml(e, i, { once: !0 });
  });
}
function ml(e, t, r) {
  typeof e.on == "function" && ds(e, "error", t, r);
}
function ds(e, t, r, n) {
  if (typeof e.on == "function")
    n.once ? e.once(t, r) : e.on(t, r);
  else if (typeof e.addEventListener == "function")
    e.addEventListener(t, function i(o) {
      n.once && e.removeEventListener(t, i), r(o);
    });
  else
    throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + typeof e);
}
var ps = Ae.exports.EventEmitter, li;
typeof Object.create == "function" ? li = function(t, r) {
  t.super_ = r, t.prototype = Object.create(r.prototype, {
    constructor: {
      value: t,
      enumerable: !1,
      writable: !0,
      configurable: !0
    }
  });
} : li = function(t, r) {
  t.super_ = r;
  var n = function() {
  };
  n.prototype = r.prototype, t.prototype = new n(), t.prototype.constructor = t;
};
const Xe = li;
var El = /%[sdj%]/g;
function ln(e) {
  if (!Er(e)) {
    for (var t = [], r = 0; r < arguments.length; r++)
      t.push(Ne(arguments[r]));
    return t.join(" ");
  }
  for (var r = 1, n = arguments, i = n.length, o = String(e).replace(El, function(u) {
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
  }), a = n[r]; r < i; a = n[++r])
    mr(a) || !ut(a) ? o += " " + a : o += " " + Ne(a);
  return o;
}
function cn(e, t) {
  if (je(oi.process))
    return function() {
      return cn(e, t).apply(this, arguments);
    };
  if (D.exports.noDeprecation === !0)
    return e;
  var r = !1;
  function n() {
    if (!r) {
      if (D.exports.throwDeprecation)
        throw new Error(t);
      D.exports.traceDeprecation ? console.trace(t) : console.error(t), r = !0;
    }
    return e.apply(this, arguments);
  }
  return n;
}
var jr = {}, Fn;
function Ii(e) {
  if (je(Fn) && (Fn = D.exports.env.NODE_DEBUG || ""), e = e.toUpperCase(), !jr[e])
    if (new RegExp("\\b" + e + "\\b", "i").test(Fn)) {
      var t = 0;
      jr[e] = function() {
        var r = ln.apply(null, arguments);
        console.error("%s %d: %s", e, t, r);
      };
    } else
      jr[e] = function() {
      };
  return jr[e];
}
function Ne(e, t) {
  var r = {
    seen: [],
    stylize: Rl
  };
  return arguments.length >= 3 && (r.depth = arguments[2]), arguments.length >= 4 && (r.colors = arguments[3]), hn(t) ? r.showHidden = t : t && ki(r, t), je(r.showHidden) && (r.showHidden = !1), je(r.depth) && (r.depth = 2), je(r.colors) && (r.colors = !1), je(r.customInspect) && (r.customInspect = !0), r.colors && (r.stylize = Sl), Xr(r, e, r.depth);
}
Ne.colors = {
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
Ne.styles = {
  special: "cyan",
  number: "yellow",
  boolean: "yellow",
  undefined: "grey",
  null: "bold",
  string: "green",
  date: "magenta",
  regexp: "red"
};
function Sl(e, t) {
  var r = Ne.styles[t];
  return r ? "\x1B[" + Ne.colors[r][0] + "m" + e + "\x1B[" + Ne.colors[r][1] + "m" : e;
}
function Rl(e, t) {
  return e;
}
function Ol(e) {
  var t = {};
  return e.forEach(function(r, n) {
    t[r] = !0;
  }), t;
}
function Xr(e, t, r) {
  if (e.customInspect && t && pr(t.inspect) && t.inspect !== Ne && !(t.constructor && t.constructor.prototype === t)) {
    var n = t.inspect(r, e);
    return Er(n) || (n = Xr(e, n, r)), n;
  }
  var i = Al(e, t);
  if (i)
    return i;
  var o = Object.keys(t), a = Ol(o);
  if (e.showHidden && (o = Object.getOwnPropertyNames(t)), dr(t) && (o.indexOf("message") >= 0 || o.indexOf("description") >= 0))
    return Un(t);
  if (o.length === 0) {
    if (pr(t)) {
      var u = t.name ? ": " + t.name : "";
      return e.stylize("[Function" + u + "]", "special");
    }
    if (hr(t))
      return e.stylize(RegExp.prototype.toString.call(t), "regexp");
    if (Qr(t))
      return e.stylize(Date.prototype.toString.call(t), "date");
    if (dr(t))
      return Un(t);
  }
  var s = "", f = !1, h = ["{", "}"];
  if (Ti(t) && (f = !0, h = ["[", "]"]), pr(t)) {
    var l = t.name ? ": " + t.name : "";
    s = " [Function" + l + "]";
  }
  if (hr(t) && (s = " " + RegExp.prototype.toString.call(t)), Qr(t) && (s = " " + Date.prototype.toUTCString.call(t)), dr(t) && (s = " " + Un(t)), o.length === 0 && (!f || t.length == 0))
    return h[0] + s + h[1];
  if (r < 0)
    return hr(t) ? e.stylize(RegExp.prototype.toString.call(t), "regexp") : e.stylize("[Object]", "special");
  e.seen.push(t);
  var c;
  return f ? c = Il(e, t, r, a, o) : c = o.map(function(d) {
    return ci(e, t, r, a, d, f);
  }), e.seen.pop(), Tl(c, s, h);
}
function Al(e, t) {
  if (je(t))
    return e.stylize("undefined", "undefined");
  if (Er(t)) {
    var r = "'" + JSON.stringify(t).replace(/^"|"$/g, "").replace(/'/g, "\\'").replace(/\\"/g, '"') + "'";
    return e.stylize(r, "string");
  }
  if (Ci(t))
    return e.stylize("" + t, "number");
  if (hn(t))
    return e.stylize("" + t, "boolean");
  if (mr(t))
    return e.stylize("null", "null");
}
function Un(e) {
  return "[" + Error.prototype.toString.call(e) + "]";
}
function Il(e, t, r, n, i) {
  for (var o = [], a = 0, u = t.length; a < u; ++a)
    ws(t, String(a)) ? o.push(ci(
      e,
      t,
      r,
      n,
      String(a),
      !0
    )) : o.push("");
  return i.forEach(function(s) {
    s.match(/^\d+$/) || o.push(ci(
      e,
      t,
      r,
      n,
      s,
      !0
    ));
  }), o;
}
function ci(e, t, r, n, i, o) {
  var a, u, s;
  if (s = Object.getOwnPropertyDescriptor(t, i) || { value: t[i] }, s.get ? s.set ? u = e.stylize("[Getter/Setter]", "special") : u = e.stylize("[Getter]", "special") : s.set && (u = e.stylize("[Setter]", "special")), ws(n, i) || (a = "[" + i + "]"), u || (e.seen.indexOf(s.value) < 0 ? (mr(r) ? u = Xr(e, s.value, null) : u = Xr(e, s.value, r - 1), u.indexOf(`
`) > -1 && (o ? u = u.split(`
`).map(function(f) {
    return "  " + f;
  }).join(`
`).substr(2) : u = `
` + u.split(`
`).map(function(f) {
    return "   " + f;
  }).join(`
`))) : u = e.stylize("[Circular]", "special")), je(a)) {
    if (o && i.match(/^\d+$/))
      return u;
    a = JSON.stringify("" + i), a.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/) ? (a = a.substr(1, a.length - 2), a = e.stylize(a, "name")) : (a = a.replace(/'/g, "\\'").replace(/\\"/g, '"').replace(/(^"|"$)/g, "'"), a = e.stylize(a, "string"));
  }
  return a + ": " + u;
}
function Tl(e, t, r) {
  var n = e.reduce(function(i, o) {
    return o.indexOf(`
`) >= 0, i + o.replace(/\u001b\[\d\d?m/g, "").length + 1;
  }, 0);
  return n > 60 ? r[0] + (t === "" ? "" : t + `
 `) + " " + e.join(`,
  `) + " " + r[1] : r[0] + t + " " + e.join(", ") + " " + r[1];
}
function Ti(e) {
  return Array.isArray(e);
}
function hn(e) {
  return typeof e == "boolean";
}
function mr(e) {
  return e === null;
}
function _s(e) {
  return e == null;
}
function Ci(e) {
  return typeof e == "number";
}
function Er(e) {
  return typeof e == "string";
}
function vs(e) {
  return typeof e == "symbol";
}
function je(e) {
  return e === void 0;
}
function hr(e) {
  return ut(e) && Mi(e) === "[object RegExp]";
}
function ut(e) {
  return typeof e == "object" && e !== null;
}
function Qr(e) {
  return ut(e) && Mi(e) === "[object Date]";
}
function dr(e) {
  return ut(e) && (Mi(e) === "[object Error]" || e instanceof Error);
}
function pr(e) {
  return typeof e == "function";
}
function ys(e) {
  return e === null || typeof e == "boolean" || typeof e == "number" || typeof e == "string" || typeof e == "symbol" || typeof e > "u";
}
function gs(e) {
  return E.isBuffer(e);
}
function Mi(e) {
  return Object.prototype.toString.call(e);
}
function Hn(e) {
  return e < 10 ? "0" + e.toString(10) : e.toString(10);
}
var Cl = [
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
function Ml() {
  var e = new Date(), t = [
    Hn(e.getHours()),
    Hn(e.getMinutes()),
    Hn(e.getSeconds())
  ].join(":");
  return [e.getDate(), Cl[e.getMonth()], t].join(" ");
}
function bs() {
  console.log("%s - %s", Ml(), ln.apply(null, arguments));
}
function ki(e, t) {
  if (!t || !ut(t))
    return e;
  for (var r = Object.keys(t), n = r.length; n--; )
    e[r[n]] = t[r[n]];
  return e;
}
function ws(e, t) {
  return Object.prototype.hasOwnProperty.call(e, t);
}
const kl = {
  inherits: Xe,
  _extend: ki,
  log: bs,
  isBuffer: gs,
  isPrimitive: ys,
  isFunction: pr,
  isError: dr,
  isDate: Qr,
  isObject: ut,
  isRegExp: hr,
  isUndefined: je,
  isSymbol: vs,
  isString: Er,
  isNumber: Ci,
  isNullOrUndefined: _s,
  isNull: mr,
  isBoolean: hn,
  isArray: Ti,
  inspect: Ne,
  deprecate: cn,
  format: ln,
  debuglog: Ii
}, Bl = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  format: ln,
  deprecate: cn,
  debuglog: Ii,
  inspect: Ne,
  isArray: Ti,
  isBoolean: hn,
  isNull: mr,
  isNullOrUndefined: _s,
  isNumber: Ci,
  isString: Er,
  isSymbol: vs,
  isUndefined: je,
  isRegExp: hr,
  isObject: ut,
  isDate: Qr,
  isError: dr,
  isFunction: pr,
  isPrimitive: ys,
  isBuffer: gs,
  log: bs,
  inherits: Xe,
  _extend: ki,
  default: kl
}, Symbol.toStringTag, { value: "Module" })), xs = /* @__PURE__ */ mi(Bl);
var $n, Yo;
function Ll() {
  if (Yo)
    return $n;
  Yo = 1;
  function e(c, d) {
    var p = Object.keys(c);
    if (Object.getOwnPropertySymbols) {
      var _ = Object.getOwnPropertySymbols(c);
      d && (_ = _.filter(function(g) {
        return Object.getOwnPropertyDescriptor(c, g).enumerable;
      })), p.push.apply(p, _);
    }
    return p;
  }
  function t(c) {
    for (var d = 1; d < arguments.length; d++) {
      var p = arguments[d] != null ? arguments[d] : {};
      d % 2 ? e(Object(p), !0).forEach(function(_) {
        r(c, _, p[_]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(c, Object.getOwnPropertyDescriptors(p)) : e(Object(p)).forEach(function(_) {
        Object.defineProperty(c, _, Object.getOwnPropertyDescriptor(p, _));
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
      var _ = d[p];
      _.enumerable = _.enumerable || !1, _.configurable = !0, "value" in _ && (_.writable = !0), Object.defineProperty(c, _.key, _);
    }
  }
  function o(c, d, p) {
    return d && i(c.prototype, d), p && i(c, p), c;
  }
  var a = xr, u = a.Buffer, s = xs, f = s.inspect, h = f && f.custom || "inspect";
  function l(c, d, p) {
    u.prototype.copy.call(c, d, p);
  }
  return $n = /* @__PURE__ */ function() {
    function c() {
      n(this, c), this.head = null, this.tail = null, this.length = 0;
    }
    return o(c, [{
      key: "push",
      value: function(p) {
        var _ = {
          data: p,
          next: null
        };
        this.length > 0 ? this.tail.next = _ : this.head = _, this.tail = _, ++this.length;
      }
    }, {
      key: "unshift",
      value: function(p) {
        var _ = {
          data: p,
          next: this.head
        };
        this.length === 0 && (this.tail = _), this.head = _, ++this.length;
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
        for (var _ = this.head, g = "" + _.data; _ = _.next; )
          g += p + _.data;
        return g;
      }
    }, {
      key: "concat",
      value: function(p) {
        if (this.length === 0)
          return u.alloc(0);
        for (var _ = u.allocUnsafe(p >>> 0), g = this.head, m = 0; g; )
          l(g.data, _, m), m += g.data.length, g = g.next;
        return _;
      }
    }, {
      key: "consume",
      value: function(p, _) {
        var g;
        return p < this.head.data.length ? (g = this.head.data.slice(0, p), this.head.data = this.head.data.slice(p)) : p === this.head.data.length ? g = this.shift() : g = _ ? this._getString(p) : this._getBuffer(p), g;
      }
    }, {
      key: "first",
      value: function() {
        return this.head.data;
      }
    }, {
      key: "_getString",
      value: function(p) {
        var _ = this.head, g = 1, m = _.data;
        for (p -= m.length; _ = _.next; ) {
          var x = _.data, A = p > x.length ? x.length : p;
          if (A === x.length ? m += x : m += x.slice(0, p), p -= A, p === 0) {
            A === x.length ? (++g, _.next ? this.head = _.next : this.head = this.tail = null) : (this.head = _, _.data = x.slice(A));
            break;
          }
          ++g;
        }
        return this.length -= g, m;
      }
    }, {
      key: "_getBuffer",
      value: function(p) {
        var _ = u.allocUnsafe(p), g = this.head, m = 1;
        for (g.data.copy(_), p -= g.data.length; g = g.next; ) {
          var x = g.data, A = p > x.length ? x.length : p;
          if (x.copy(_, _.length - p, 0, A), p -= A, p === 0) {
            A === x.length ? (++m, g.next ? this.head = g.next : this.head = this.tail = null) : (this.head = g, g.data = x.slice(A));
            break;
          }
          ++m;
        }
        return this.length -= m, _;
      }
    }, {
      key: h,
      value: function(p, _) {
        return f(this, t({}, _, {
          depth: 0,
          customInspect: !1
        }));
      }
    }]), c;
  }(), $n;
}
function Pl(e, t) {
  var r = this, n = this._readableState && this._readableState.destroyed, i = this._writableState && this._writableState.destroyed;
  return n || i ? (t ? t(e) : e && (this._writableState ? this._writableState.errorEmitted || (this._writableState.errorEmitted = !0, D.exports.nextTick(hi, this, e)) : D.exports.nextTick(hi, this, e)), this) : (this._readableState && (this._readableState.destroyed = !0), this._writableState && (this._writableState.destroyed = !0), this._destroy(e || null, function(o) {
    !t && o ? r._writableState ? r._writableState.errorEmitted ? D.exports.nextTick($r, r) : (r._writableState.errorEmitted = !0, D.exports.nextTick(Vo, r, o)) : D.exports.nextTick(Vo, r, o) : t ? (D.exports.nextTick($r, r), t(o)) : D.exports.nextTick($r, r);
  }), this);
}
function Vo(e, t) {
  hi(e, t), $r(e);
}
function $r(e) {
  e._writableState && !e._writableState.emitClose || e._readableState && !e._readableState.emitClose || e.emit("close");
}
function ql() {
  this._readableState && (this._readableState.destroyed = !1, this._readableState.reading = !1, this._readableState.ended = !1, this._readableState.endEmitted = !1), this._writableState && (this._writableState.destroyed = !1, this._writableState.ended = !1, this._writableState.ending = !1, this._writableState.finalCalled = !1, this._writableState.prefinished = !1, this._writableState.finished = !1, this._writableState.errorEmitted = !1);
}
function hi(e, t) {
  e.emit("error", t);
}
function Dl(e, t) {
  var r = e._readableState, n = e._writableState;
  r && r.autoDestroy || n && n.autoDestroy ? e.destroy(t) : e.emit("error", t);
}
var ms = {
  destroy: Pl,
  undestroy: ql,
  errorOrDestroy: Dl
}, ft = {};
function jl(e, t) {
  e.prototype = Object.create(t.prototype), e.prototype.constructor = e, e.__proto__ = t;
}
var Es = {};
function Ie(e, t, r) {
  r || (r = Error);
  function n(o, a, u) {
    return typeof t == "string" ? t : t(o, a, u);
  }
  var i = /* @__PURE__ */ function(o) {
    jl(a, o);
    function a(u, s, f) {
      return o.call(this, n(u, s, f)) || this;
    }
    return a;
  }(r);
  i.prototype.name = r.name, i.prototype.code = e, Es[e] = i;
}
function Ko(e, t) {
  if (Array.isArray(e)) {
    var r = e.length;
    return e = e.map(function(n) {
      return String(n);
    }), r > 2 ? "one of ".concat(t, " ").concat(e.slice(0, r - 1).join(", "), ", or ") + e[r - 1] : r === 2 ? "one of ".concat(t, " ").concat(e[0], " or ").concat(e[1]) : "of ".concat(t, " ").concat(e[0]);
  } else
    return "of ".concat(t, " ").concat(String(e));
}
function Nl(e, t, r) {
  return e.substr(!r || r < 0 ? 0 : +r, t.length) === t;
}
function Fl(e, t, r) {
  return (r === void 0 || r > e.length) && (r = e.length), e.substring(r - t.length, r) === t;
}
function Ul(e, t, r) {
  return typeof r != "number" && (r = 0), r + t.length > e.length ? !1 : e.indexOf(t, r) !== -1;
}
Ie("ERR_INVALID_OPT_VALUE", function(e, t) {
  return 'The value "' + t + '" is invalid for option "' + e + '"';
}, TypeError);
Ie("ERR_INVALID_ARG_TYPE", function(e, t, r) {
  var n;
  typeof t == "string" && Nl(t, "not ") ? (n = "must not be", t = t.replace(/^not /, "")) : n = "must be";
  var i;
  if (Fl(e, " argument"))
    i = "The ".concat(e, " ").concat(n, " ").concat(Ko(t, "type"));
  else {
    var o = Ul(e, ".") ? "property" : "argument";
    i = 'The "'.concat(e, '" ').concat(o, " ").concat(n, " ").concat(Ko(t, "type"));
  }
  return i += ". Received type ".concat(typeof r), i;
}, TypeError);
Ie("ERR_STREAM_PUSH_AFTER_EOF", "stream.push() after EOF");
Ie("ERR_METHOD_NOT_IMPLEMENTED", function(e) {
  return "The " + e + " method is not implemented";
});
Ie("ERR_STREAM_PREMATURE_CLOSE", "Premature close");
Ie("ERR_STREAM_DESTROYED", function(e) {
  return "Cannot call " + e + " after a stream was destroyed";
});
Ie("ERR_MULTIPLE_CALLBACK", "Callback called multiple times");
Ie("ERR_STREAM_CANNOT_PIPE", "Cannot pipe, not readable");
Ie("ERR_STREAM_WRITE_AFTER_END", "write after end");
Ie("ERR_STREAM_NULL_VALUES", "May not write null values to stream", TypeError);
Ie("ERR_UNKNOWN_ENCODING", function(e) {
  return "Unknown encoding: " + e;
}, TypeError);
Ie("ERR_STREAM_UNSHIFT_AFTER_END_EVENT", "stream.unshift() after end event");
ft.codes = Es;
var Hl = ft.codes.ERR_INVALID_OPT_VALUE;
function $l(e, t, r) {
  return e.highWaterMark != null ? e.highWaterMark : t ? e[r] : null;
}
function Wl(e, t, r, n) {
  var i = $l(t, n, r);
  if (i != null) {
    if (!(isFinite(i) && Math.floor(i) === i) || i < 0) {
      var o = n ? r : "highWaterMark";
      throw new Hl(o, i);
    }
    return Math.floor(i);
  }
  return e.objectMode ? 16 : 16 * 1024;
}
var Ss = {
  getHighWaterMark: Wl
}, zl = Gl;
function Gl(e, t) {
  if (Wn("noDeprecation"))
    return e;
  var r = !1;
  function n() {
    if (!r) {
      if (Wn("throwDeprecation"))
        throw new Error(t);
      Wn("traceDeprecation") ? console.trace(t) : console.warn(t), r = !0;
    }
    return e.apply(this, arguments);
  }
  return n;
}
function Wn(e) {
  try {
    if (!S.localStorage)
      return !1;
  } catch {
    return !1;
  }
  var t = S.localStorage[e];
  return t == null ? !1 : String(t).toLowerCase() === "true";
}
var zn, Zo;
function Rs() {
  if (Zo)
    return zn;
  Zo = 1, zn = B;
  function e(w) {
    var b = this;
    this.next = null, this.entry = null, this.finish = function() {
      _t(b, w);
    };
  }
  var t;
  B.WritableState = j;
  var r = {
    deprecate: zl
  }, n = ps, i = xr.Buffer, o = S.Uint8Array || function() {
  };
  function a(w) {
    return i.from(w);
  }
  function u(w) {
    return i.isBuffer(w) || w instanceof o;
  }
  var s = ms, f = Ss, h = f.getHighWaterMark, l = ft.codes, c = l.ERR_INVALID_ARG_TYPE, d = l.ERR_METHOD_NOT_IMPLEMENTED, p = l.ERR_MULTIPLE_CALLBACK, _ = l.ERR_STREAM_CANNOT_PIPE, g = l.ERR_STREAM_DESTROYED, m = l.ERR_STREAM_NULL_VALUES, x = l.ERR_STREAM_WRITE_AFTER_END, A = l.ERR_UNKNOWN_ENCODING, T = s.errorOrDestroy;
  ie.exports(B, n);
  function k() {
  }
  function j(w, b, O) {
    t = t || Ot(), w = w || {}, typeof O != "boolean" && (O = b instanceof t), this.objectMode = !!w.objectMode, O && (this.objectMode = this.objectMode || !!w.writableObjectMode), this.highWaterMark = h(this, w, "writableHighWaterMark", O), this.finalCalled = !1, this.needDrain = !1, this.ending = !1, this.ended = !1, this.finished = !1, this.destroyed = !1;
    var L = w.decodeStrings === !1;
    this.decodeStrings = !L, this.defaultEncoding = w.defaultEncoding || "utf8", this.length = 0, this.writing = !1, this.corked = 0, this.sync = !0, this.bufferProcessing = !1, this.onwrite = function(U) {
      Tt(b, U);
    }, this.writecb = null, this.writelen = 0, this.bufferedRequest = null, this.lastBufferedRequest = null, this.pendingcb = 0, this.prefinished = !1, this.errorEmitted = !1, this.emitClose = w.emitClose !== !1, this.autoDestroy = !!w.autoDestroy, this.bufferedRequestCount = 0, this.corkedRequestsFree = new e(this);
  }
  j.prototype.getBuffer = function() {
    for (var b = this.bufferedRequest, O = []; b; )
      O.push(b), b = b.next;
    return O;
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
  var P;
  typeof Symbol == "function" && Symbol.hasInstance && typeof Function.prototype[Symbol.hasInstance] == "function" ? (P = Function.prototype[Symbol.hasInstance], Object.defineProperty(B, Symbol.hasInstance, {
    value: function(b) {
      return P.call(this, b) ? !0 : this !== B ? !1 : b && b._writableState instanceof j;
    }
  })) : P = function(b) {
    return b instanceof this;
  };
  function B(w) {
    t = t || Ot();
    var b = this instanceof t;
    if (!b && !P.call(B, this))
      return new B(w);
    this._writableState = new j(w, this, b), this.writable = !0, w && (typeof w.write == "function" && (this._write = w.write), typeof w.writev == "function" && (this._writev = w.writev), typeof w.destroy == "function" && (this._destroy = w.destroy), typeof w.final == "function" && (this._final = w.final)), n.call(this);
  }
  B.prototype.pipe = function() {
    T(this, new _());
  };
  function I(w, b) {
    var O = new x();
    T(w, O), D.exports.nextTick(b, O);
  }
  function V(w, b, O, L) {
    var U;
    return O === null ? U = new m() : typeof O != "string" && !b.objectMode && (U = new c("chunk", ["string", "Buffer"], O)), U ? (T(w, U), D.exports.nextTick(L, U), !1) : !0;
  }
  B.prototype.write = function(w, b, O) {
    var L = this._writableState, U = !1, v = !L.objectMode && u(w);
    return v && !i.isBuffer(w) && (w = a(w)), typeof b == "function" && (O = b, b = null), v ? b = "buffer" : b || (b = L.defaultEncoding), typeof O != "function" && (O = k), L.ending ? I(this, O) : (v || V(this, L, w, O)) && (L.pendingcb++, U = ye(this, L, v, w, b, O)), U;
  }, B.prototype.cork = function() {
    this._writableState.corked++;
  }, B.prototype.uncork = function() {
    var w = this._writableState;
    w.corked && (w.corked--, !w.writing && !w.corked && !w.bufferProcessing && w.bufferedRequest && He(this, w));
  }, B.prototype.setDefaultEncoding = function(b) {
    if (typeof b == "string" && (b = b.toLowerCase()), !(["hex", "utf8", "utf-8", "ascii", "binary", "base64", "ucs2", "ucs-2", "utf16le", "utf-16le", "raw"].indexOf((b + "").toLowerCase()) > -1))
      throw new A(b);
    return this._writableState.defaultEncoding = b, this;
  }, Object.defineProperty(B.prototype, "writableBuffer", {
    enumerable: !1,
    get: function() {
      return this._writableState && this._writableState.getBuffer();
    }
  });
  function N(w, b, O) {
    return !w.objectMode && w.decodeStrings !== !1 && typeof b == "string" && (b = i.from(b, O)), b;
  }
  Object.defineProperty(B.prototype, "writableHighWaterMark", {
    enumerable: !1,
    get: function() {
      return this._writableState.highWaterMark;
    }
  });
  function ye(w, b, O, L, U, v) {
    if (!O) {
      var y = N(b, L, U);
      L !== y && (O = !0, U = "buffer", L = y);
    }
    var R = b.objectMode ? 1 : L.length;
    b.length += R;
    var M = b.length < b.highWaterMark;
    if (M || (b.needDrain = !0), b.writing || b.corked) {
      var te = b.lastBufferedRequest;
      b.lastBufferedRequest = {
        chunk: L,
        encoding: U,
        isBuf: O,
        callback: v,
        next: null
      }, te ? te.next = b.lastBufferedRequest : b.bufferedRequest = b.lastBufferedRequest, b.bufferedRequestCount += 1;
    } else
      $(w, b, !1, R, L, U, v);
    return M;
  }
  function $(w, b, O, L, U, v, y) {
    b.writelen = L, b.writecb = y, b.writing = !0, b.sync = !0, b.destroyed ? b.onwrite(new g("write")) : O ? w._writev(U, b.onwrite) : w._write(U, v, b.onwrite), b.sync = !1;
  }
  function ee(w, b, O, L, U) {
    --b.pendingcb, O ? (D.exports.nextTick(U, L), D.exports.nextTick(Le, w, b), w._writableState.errorEmitted = !0, T(w, L)) : (U(L), w._writableState.errorEmitted = !0, T(w, L), Le(w, b));
  }
  function Te(w) {
    w.writing = !1, w.writecb = null, w.length -= w.writelen, w.writelen = 0;
  }
  function Tt(w, b) {
    var O = w._writableState, L = O.sync, U = O.writecb;
    if (typeof U != "function")
      throw new p();
    if (Te(O), b)
      ee(w, O, L, b, U);
    else {
      var v = dt(O) || w.destroyed;
      !v && !O.corked && !O.bufferProcessing && O.bufferedRequest && He(w, O), L ? D.exports.nextTick(Ue, w, O, v, U) : Ue(w, O, v, U);
    }
  }
  function Ue(w, b, O, L) {
    O || ht(w, b), b.pendingcb--, L(), Le(w, b);
  }
  function ht(w, b) {
    b.length === 0 && b.needDrain && (b.needDrain = !1, w.emit("drain"));
  }
  function He(w, b) {
    b.bufferProcessing = !0;
    var O = b.bufferedRequest;
    if (w._writev && O && O.next) {
      var L = b.bufferedRequestCount, U = new Array(L), v = b.corkedRequestsFree;
      v.entry = O;
      for (var y = 0, R = !0; O; )
        U[y] = O, O.isBuf || (R = !1), O = O.next, y += 1;
      U.allBuffers = R, $(w, b, !0, b.length, U, "", v.finish), b.pendingcb++, b.lastBufferedRequest = null, v.next ? (b.corkedRequestsFree = v.next, v.next = null) : b.corkedRequestsFree = new e(b), b.bufferedRequestCount = 0;
    } else {
      for (; O; ) {
        var M = O.chunk, te = O.encoding, F = O.callback, K = b.objectMode ? 1 : M.length;
        if ($(w, b, !1, K, M, te, F), O = O.next, b.bufferedRequestCount--, b.writing)
          break;
      }
      O === null && (b.lastBufferedRequest = null);
    }
    b.bufferedRequest = O, b.bufferProcessing = !1;
  }
  B.prototype._write = function(w, b, O) {
    O(new d("_write()"));
  }, B.prototype._writev = null, B.prototype.end = function(w, b, O) {
    var L = this._writableState;
    return typeof w == "function" ? (O = w, w = null, b = null) : typeof b == "function" && (O = b, b = null), w != null && this.write(w, b), L.corked && (L.corked = 1, this.uncork()), L.ending || Mt(this, L, O), this;
  }, Object.defineProperty(B.prototype, "writableLength", {
    enumerable: !1,
    get: function() {
      return this._writableState.length;
    }
  });
  function dt(w) {
    return w.ending && w.length === 0 && w.bufferedRequest === null && !w.finished && !w.writing;
  }
  function Ct(w, b) {
    w._final(function(O) {
      b.pendingcb--, O && T(w, O), b.prefinished = !0, w.emit("prefinish"), Le(w, b);
    });
  }
  function pt(w, b) {
    !b.prefinished && !b.finalCalled && (typeof w._final == "function" && !b.destroyed ? (b.pendingcb++, b.finalCalled = !0, D.exports.nextTick(Ct, w, b)) : (b.prefinished = !0, w.emit("prefinish")));
  }
  function Le(w, b) {
    var O = dt(b);
    if (O && (pt(w, b), b.pendingcb === 0 && (b.finished = !0, w.emit("finish"), b.autoDestroy))) {
      var L = w._readableState;
      (!L || L.autoDestroy && L.endEmitted) && w.destroy();
    }
    return O;
  }
  function Mt(w, b, O) {
    b.ending = !0, Le(w, b), O && (b.finished ? D.exports.nextTick(O) : w.once("finish", O)), b.ended = !0, w.writable = !1;
  }
  function _t(w, b, O) {
    var L = w.entry;
    for (w.entry = null; L; ) {
      var U = L.callback;
      b.pendingcb--, U(O), L = L.next;
    }
    b.corkedRequestsFree.next = w;
  }
  return Object.defineProperty(B.prototype, "destroyed", {
    enumerable: !1,
    get: function() {
      return this._writableState === void 0 ? !1 : this._writableState.destroyed;
    },
    set: function(b) {
      !this._writableState || (this._writableState.destroyed = b);
    }
  }), B.prototype.destroy = s.destroy, B.prototype._undestroy = s.undestroy, B.prototype._destroy = function(w, b) {
    b(w);
  }, zn;
}
var Gn, Xo;
function Ot() {
  if (Xo)
    return Gn;
  Xo = 1;
  var e = Object.keys || function(f) {
    var h = [];
    for (var l in f)
      h.push(l);
    return h;
  };
  Gn = a;
  var t = Is(), r = Rs();
  ie.exports(a, t);
  for (var n = e(r.prototype), i = 0; i < n.length; i++) {
    var o = n[i];
    a.prototype[o] || (a.prototype[o] = r.prototype[o]);
  }
  function a(f) {
    if (!(this instanceof a))
      return new a(f);
    t.call(this, f), r.call(this, f), this.allowHalfOpen = !0, f && (f.readable === !1 && (this.readable = !1), f.writable === !1 && (this.writable = !1), f.allowHalfOpen === !1 && (this.allowHalfOpen = !1, this.once("end", u)));
  }
  Object.defineProperty(a.prototype, "writableHighWaterMark", {
    enumerable: !1,
    get: function() {
      return this._writableState.highWaterMark;
    }
  }), Object.defineProperty(a.prototype, "writableBuffer", {
    enumerable: !1,
    get: function() {
      return this._writableState && this._writableState.getBuffer();
    }
  }), Object.defineProperty(a.prototype, "writableLength", {
    enumerable: !1,
    get: function() {
      return this._writableState.length;
    }
  });
  function u() {
    this._writableState.ended || D.exports.nextTick(s, this);
  }
  function s(f) {
    f.end();
  }
  return Object.defineProperty(a.prototype, "destroyed", {
    enumerable: !1,
    get: function() {
      return this._readableState === void 0 || this._writableState === void 0 ? !1 : this._readableState.destroyed && this._writableState.destroyed;
    },
    set: function(h) {
      this._readableState === void 0 || this._writableState === void 0 || (this._readableState.destroyed = h, this._writableState.destroyed = h);
    }
  }), Gn;
}
var Jr = {}, Bi = me.exports.Buffer, Qo = Bi.isEncoding || function(e) {
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
function Yl(e) {
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
function Vl(e) {
  var t = Yl(e);
  if (typeof t != "string" && (Bi.isEncoding === Qo || !Qo(e)))
    throw new Error("Unknown encoding: " + e);
  return t || e;
}
var Os = Jr.StringDecoder = Sr;
function Sr(e) {
  this.encoding = Vl(e);
  var t;
  switch (this.encoding) {
    case "utf16le":
      this.text = ec, this.end = tc, t = 4;
      break;
    case "utf8":
      this.fillLast = Xl, t = 4;
      break;
    case "base64":
      this.text = rc, this.end = nc, t = 3;
      break;
    default:
      this.write = ic, this.end = oc;
      return;
  }
  this.lastNeed = 0, this.lastTotal = 0, this.lastChar = Bi.allocUnsafe(t);
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
Sr.prototype.end = Jl;
Sr.prototype.text = Ql;
Sr.prototype.fillLast = function(e) {
  if (this.lastNeed <= e.length)
    return e.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, this.lastNeed), this.lastChar.toString(this.encoding, 0, this.lastTotal);
  e.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, e.length), this.lastNeed -= e.length;
};
function Yn(e) {
  return e <= 127 ? 0 : e >> 5 === 6 ? 2 : e >> 4 === 14 ? 3 : e >> 3 === 30 ? 4 : e >> 6 === 2 ? -1 : -2;
}
function Kl(e, t, r) {
  var n = t.length - 1;
  if (n < r)
    return 0;
  var i = Yn(t[n]);
  return i >= 0 ? (i > 0 && (e.lastNeed = i - 1), i) : --n < r || i === -2 ? 0 : (i = Yn(t[n]), i >= 0 ? (i > 0 && (e.lastNeed = i - 2), i) : --n < r || i === -2 ? 0 : (i = Yn(t[n]), i >= 0 ? (i > 0 && (i === 2 ? i = 0 : e.lastNeed = i - 3), i) : 0));
}
function Zl(e, t, r) {
  if ((t[0] & 192) !== 128)
    return e.lastNeed = 0, "\uFFFD";
  if (e.lastNeed > 1 && t.length > 1) {
    if ((t[1] & 192) !== 128)
      return e.lastNeed = 1, "\uFFFD";
    if (e.lastNeed > 2 && t.length > 2 && (t[2] & 192) !== 128)
      return e.lastNeed = 2, "\uFFFD";
  }
}
function Xl(e) {
  var t = this.lastTotal - this.lastNeed, r = Zl(this, e);
  if (r !== void 0)
    return r;
  if (this.lastNeed <= e.length)
    return e.copy(this.lastChar, t, 0, this.lastNeed), this.lastChar.toString(this.encoding, 0, this.lastTotal);
  e.copy(this.lastChar, t, 0, e.length), this.lastNeed -= e.length;
}
function Ql(e, t) {
  var r = Kl(this, e, t);
  if (!this.lastNeed)
    return e.toString("utf8", t);
  this.lastTotal = r;
  var n = e.length - (r - this.lastNeed);
  return e.copy(this.lastChar, 0, n), e.toString("utf8", t, n);
}
function Jl(e) {
  var t = e && e.length ? this.write(e) : "";
  return this.lastNeed ? t + "\uFFFD" : t;
}
function ec(e, t) {
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
function tc(e) {
  var t = e && e.length ? this.write(e) : "";
  if (this.lastNeed) {
    var r = this.lastTotal - this.lastNeed;
    return t + this.lastChar.toString("utf16le", 0, r);
  }
  return t;
}
function rc(e, t) {
  var r = (e.length - t) % 3;
  return r === 0 ? e.toString("base64", t) : (this.lastNeed = 3 - r, this.lastTotal = 3, r === 1 ? this.lastChar[0] = e[e.length - 1] : (this.lastChar[0] = e[e.length - 2], this.lastChar[1] = e[e.length - 1]), e.toString("base64", t, e.length - r));
}
function nc(e) {
  var t = e && e.length ? this.write(e) : "";
  return this.lastNeed ? t + this.lastChar.toString("base64", 0, 3 - this.lastNeed) : t;
}
function ic(e) {
  return e.toString(this.encoding);
}
function oc(e) {
  return e && e.length ? this.write(e) : "";
}
var Jo = ft.codes.ERR_STREAM_PREMATURE_CLOSE;
function ac(e) {
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
function sc() {
}
function uc(e) {
  return e.setHeader && typeof e.abort == "function";
}
function As(e, t, r) {
  if (typeof t == "function")
    return As(e, null, t);
  t || (t = {}), r = ac(r || sc);
  var n = t.readable || t.readable !== !1 && e.readable, i = t.writable || t.writable !== !1 && e.writable, o = function() {
    e.writable || u();
  }, a = e._writableState && e._writableState.finished, u = function() {
    i = !1, a = !0, n || r.call(e);
  }, s = e._readableState && e._readableState.endEmitted, f = function() {
    n = !1, s = !0, i || r.call(e);
  }, h = function(p) {
    r.call(e, p);
  }, l = function() {
    var p;
    if (n && !s)
      return (!e._readableState || !e._readableState.ended) && (p = new Jo()), r.call(e, p);
    if (i && !a)
      return (!e._writableState || !e._writableState.ended) && (p = new Jo()), r.call(e, p);
  }, c = function() {
    e.req.on("finish", u);
  };
  return uc(e) ? (e.on("complete", u), e.on("abort", l), e.req ? c() : e.on("request", c)) : i && !e._writableState && (e.on("end", o), e.on("close", o)), e.on("end", f), e.on("finish", u), t.error !== !1 && e.on("error", h), e.on("close", l), function() {
    e.removeListener("complete", u), e.removeListener("abort", l), e.removeListener("request", c), e.req && e.req.removeListener("finish", u), e.removeListener("end", o), e.removeListener("close", o), e.removeListener("finish", u), e.removeListener("end", f), e.removeListener("error", h), e.removeListener("close", l);
  };
}
var Li = As, Vn, ea;
function fc() {
  if (ea)
    return Vn;
  ea = 1;
  var e;
  function t(m, x, A) {
    return x in m ? Object.defineProperty(m, x, { value: A, enumerable: !0, configurable: !0, writable: !0 }) : m[x] = A, m;
  }
  var r = Li, n = Symbol("lastResolve"), i = Symbol("lastReject"), o = Symbol("error"), a = Symbol("ended"), u = Symbol("lastPromise"), s = Symbol("handlePromise"), f = Symbol("stream");
  function h(m, x) {
    return {
      value: m,
      done: x
    };
  }
  function l(m) {
    var x = m[n];
    if (x !== null) {
      var A = m[f].read();
      A !== null && (m[u] = null, m[n] = null, m[i] = null, x(h(A, !1)));
    }
  }
  function c(m) {
    D.exports.nextTick(l, m);
  }
  function d(m, x) {
    return function(A, T) {
      m.then(function() {
        if (x[a]) {
          A(h(void 0, !0));
          return;
        }
        x[s](A, T);
      }, T);
    };
  }
  var p = Object.getPrototypeOf(function() {
  }), _ = Object.setPrototypeOf((e = {
    get stream() {
      return this[f];
    },
    next: function() {
      var x = this, A = this[o];
      if (A !== null)
        return Promise.reject(A);
      if (this[a])
        return Promise.resolve(h(void 0, !0));
      if (this[f].destroyed)
        return new Promise(function(P, B) {
          D.exports.nextTick(function() {
            x[o] ? B(x[o]) : P(h(void 0, !0));
          });
        });
      var T = this[u], k;
      if (T)
        k = new Promise(d(T, this));
      else {
        var j = this[f].read();
        if (j !== null)
          return Promise.resolve(h(j, !1));
        k = new Promise(this[s]);
      }
      return this[u] = k, k;
    }
  }, t(e, Symbol.asyncIterator, function() {
    return this;
  }), t(e, "return", function() {
    var x = this;
    return new Promise(function(A, T) {
      x[f].destroy(null, function(k) {
        if (k) {
          T(k);
          return;
        }
        A(h(void 0, !0));
      });
    });
  }), e), p), g = function(x) {
    var A, T = Object.create(_, (A = {}, t(A, f, {
      value: x,
      writable: !0
    }), t(A, n, {
      value: null,
      writable: !0
    }), t(A, i, {
      value: null,
      writable: !0
    }), t(A, o, {
      value: null,
      writable: !0
    }), t(A, a, {
      value: x._readableState.endEmitted,
      writable: !0
    }), t(A, s, {
      value: function(j, P) {
        var B = T[f].read();
        B ? (T[u] = null, T[n] = null, T[i] = null, j(h(B, !1))) : (T[n] = j, T[i] = P);
      },
      writable: !0
    }), A));
    return T[u] = null, r(x, function(k) {
      if (k && k.code !== "ERR_STREAM_PREMATURE_CLOSE") {
        var j = T[i];
        j !== null && (T[u] = null, T[n] = null, T[i] = null, j(k)), T[o] = k;
        return;
      }
      var P = T[n];
      P !== null && (T[u] = null, T[n] = null, T[i] = null, P(h(void 0, !0))), T[a] = !0;
    }), x.on("readable", c.bind(null, T)), T;
  };
  return Vn = g, Vn;
}
var Kn, ta;
function lc() {
  return ta || (ta = 1, Kn = function() {
    throw new Error("Readable.from is not available in the browser");
  }), Kn;
}
var Zn, ra;
function Is() {
  if (ra)
    return Zn;
  ra = 1, Zn = I;
  var e;
  I.ReadableState = B, Ae.exports.EventEmitter;
  var t = function(y, R) {
    return y.listeners(R).length;
  }, r = ps, n = xr.Buffer, i = S.Uint8Array || function() {
  };
  function o(v) {
    return n.from(v);
  }
  function a(v) {
    return n.isBuffer(v) || v instanceof i;
  }
  var u = xs, s;
  u && u.debuglog ? s = u.debuglog("stream") : s = function() {
  };
  var f = Ll(), h = ms, l = Ss, c = l.getHighWaterMark, d = ft.codes, p = d.ERR_INVALID_ARG_TYPE, _ = d.ERR_STREAM_PUSH_AFTER_EOF, g = d.ERR_METHOD_NOT_IMPLEMENTED, m = d.ERR_STREAM_UNSHIFT_AFTER_END_EVENT, x, A, T;
  ie.exports(I, r);
  var k = h.errorOrDestroy, j = ["error", "close", "destroy", "pause", "resume"];
  function P(v, y, R) {
    if (typeof v.prependListener == "function")
      return v.prependListener(y, R);
    !v._events || !v._events[y] ? v.on(y, R) : Array.isArray(v._events[y]) ? v._events[y].unshift(R) : v._events[y] = [R, v._events[y]];
  }
  function B(v, y, R) {
    e = e || Ot(), v = v || {}, typeof R != "boolean" && (R = y instanceof e), this.objectMode = !!v.objectMode, R && (this.objectMode = this.objectMode || !!v.readableObjectMode), this.highWaterMark = c(this, v, "readableHighWaterMark", R), this.buffer = new f(), this.length = 0, this.pipes = null, this.pipesCount = 0, this.flowing = null, this.ended = !1, this.endEmitted = !1, this.reading = !1, this.sync = !0, this.needReadable = !1, this.emittedReadable = !1, this.readableListening = !1, this.resumeScheduled = !1, this.paused = !0, this.emitClose = v.emitClose !== !1, this.autoDestroy = !!v.autoDestroy, this.destroyed = !1, this.defaultEncoding = v.defaultEncoding || "utf8", this.awaitDrain = 0, this.readingMore = !1, this.decoder = null, this.encoding = null, v.encoding && (x || (x = Jr.StringDecoder), this.decoder = new x(v.encoding), this.encoding = v.encoding);
  }
  function I(v) {
    if (e = e || Ot(), !(this instanceof I))
      return new I(v);
    var y = this instanceof e;
    this._readableState = new B(v, this, y), this.readable = !0, v && (typeof v.read == "function" && (this._read = v.read), typeof v.destroy == "function" && (this._destroy = v.destroy)), r.call(this);
  }
  Object.defineProperty(I.prototype, "destroyed", {
    enumerable: !1,
    get: function() {
      return this._readableState === void 0 ? !1 : this._readableState.destroyed;
    },
    set: function(y) {
      !this._readableState || (this._readableState.destroyed = y);
    }
  }), I.prototype.destroy = h.destroy, I.prototype._undestroy = h.undestroy, I.prototype._destroy = function(v, y) {
    y(v);
  }, I.prototype.push = function(v, y) {
    var R = this._readableState, M;
    return R.objectMode ? M = !0 : typeof v == "string" && (y = y || R.defaultEncoding, y !== R.encoding && (v = n.from(v, y), y = ""), M = !0), V(this, v, y, !1, M);
  }, I.prototype.unshift = function(v) {
    return V(this, v, null, !0, !1);
  };
  function V(v, y, R, M, te) {
    s("readableAddChunk", y);
    var F = v._readableState;
    if (y === null)
      F.reading = !1, Tt(v, F);
    else {
      var K;
      if (te || (K = ye(F, y)), K)
        k(v, K);
      else if (F.objectMode || y && y.length > 0)
        if (typeof y != "string" && !F.objectMode && Object.getPrototypeOf(y) !== n.prototype && (y = o(y)), M)
          F.endEmitted ? k(v, new m()) : N(v, F, y, !0);
        else if (F.ended)
          k(v, new _());
        else {
          if (F.destroyed)
            return !1;
          F.reading = !1, F.decoder && !R ? (y = F.decoder.write(y), F.objectMode || y.length !== 0 ? N(v, F, y, !1) : He(v, F)) : N(v, F, y, !1);
        }
      else
        M || (F.reading = !1, He(v, F));
    }
    return !F.ended && (F.length < F.highWaterMark || F.length === 0);
  }
  function N(v, y, R, M) {
    y.flowing && y.length === 0 && !y.sync ? (y.awaitDrain = 0, v.emit("data", R)) : (y.length += y.objectMode ? 1 : R.length, M ? y.buffer.unshift(R) : y.buffer.push(R), y.needReadable && Ue(v)), He(v, y);
  }
  function ye(v, y) {
    var R;
    return !a(y) && typeof y != "string" && y !== void 0 && !v.objectMode && (R = new p("chunk", ["string", "Buffer", "Uint8Array"], y)), R;
  }
  I.prototype.isPaused = function() {
    return this._readableState.flowing === !1;
  }, I.prototype.setEncoding = function(v) {
    x || (x = Jr.StringDecoder);
    var y = new x(v);
    this._readableState.decoder = y, this._readableState.encoding = this._readableState.decoder.encoding;
    for (var R = this._readableState.buffer.head, M = ""; R !== null; )
      M += y.write(R.data), R = R.next;
    return this._readableState.buffer.clear(), M !== "" && this._readableState.buffer.push(M), this._readableState.length = M.length, this;
  };
  var $ = 1073741824;
  function ee(v) {
    return v >= $ ? v = $ : (v--, v |= v >>> 1, v |= v >>> 2, v |= v >>> 4, v |= v >>> 8, v |= v >>> 16, v++), v;
  }
  function Te(v, y) {
    return v <= 0 || y.length === 0 && y.ended ? 0 : y.objectMode ? 1 : v !== v ? y.flowing && y.length ? y.buffer.head.data.length : y.length : (v > y.highWaterMark && (y.highWaterMark = ee(v)), v <= y.length ? v : y.ended ? y.length : (y.needReadable = !0, 0));
  }
  I.prototype.read = function(v) {
    s("read", v), v = parseInt(v, 10);
    var y = this._readableState, R = v;
    if (v !== 0 && (y.emittedReadable = !1), v === 0 && y.needReadable && ((y.highWaterMark !== 0 ? y.length >= y.highWaterMark : y.length > 0) || y.ended))
      return s("read: emitReadable", y.length, y.ended), y.length === 0 && y.ended ? O(this) : Ue(this), null;
    if (v = Te(v, y), v === 0 && y.ended)
      return y.length === 0 && O(this), null;
    var M = y.needReadable;
    s("need readable", M), (y.length === 0 || y.length - v < y.highWaterMark) && (M = !0, s("length less than watermark", M)), y.ended || y.reading ? (M = !1, s("reading or ended", M)) : M && (s("do read"), y.reading = !0, y.sync = !0, y.length === 0 && (y.needReadable = !0), this._read(y.highWaterMark), y.sync = !1, y.reading || (v = Te(R, y)));
    var te;
    return v > 0 ? te = b(v, y) : te = null, te === null ? (y.needReadable = y.length <= y.highWaterMark, v = 0) : (y.length -= v, y.awaitDrain = 0), y.length === 0 && (y.ended || (y.needReadable = !0), R !== v && y.ended && O(this)), te !== null && this.emit("data", te), te;
  };
  function Tt(v, y) {
    if (s("onEofChunk"), !y.ended) {
      if (y.decoder) {
        var R = y.decoder.end();
        R && R.length && (y.buffer.push(R), y.length += y.objectMode ? 1 : R.length);
      }
      y.ended = !0, y.sync ? Ue(v) : (y.needReadable = !1, y.emittedReadable || (y.emittedReadable = !0, ht(v)));
    }
  }
  function Ue(v) {
    var y = v._readableState;
    s("emitReadable", y.needReadable, y.emittedReadable), y.needReadable = !1, y.emittedReadable || (s("emitReadable", y.flowing), y.emittedReadable = !0, D.exports.nextTick(ht, v));
  }
  function ht(v) {
    var y = v._readableState;
    s("emitReadable_", y.destroyed, y.length, y.ended), !y.destroyed && (y.length || y.ended) && (v.emit("readable"), y.emittedReadable = !1), y.needReadable = !y.flowing && !y.ended && y.length <= y.highWaterMark, w(v);
  }
  function He(v, y) {
    y.readingMore || (y.readingMore = !0, D.exports.nextTick(dt, v, y));
  }
  function dt(v, y) {
    for (; !y.reading && !y.ended && (y.length < y.highWaterMark || y.flowing && y.length === 0); ) {
      var R = y.length;
      if (s("maybeReadMore read 0"), v.read(0), R === y.length)
        break;
    }
    y.readingMore = !1;
  }
  I.prototype._read = function(v) {
    k(this, new g("_read()"));
  }, I.prototype.pipe = function(v, y) {
    var R = this, M = this._readableState;
    switch (M.pipesCount) {
      case 0:
        M.pipes = v;
        break;
      case 1:
        M.pipes = [M.pipes, v];
        break;
      default:
        M.pipes.push(v);
        break;
    }
    M.pipesCount += 1, s("pipe count=%d opts=%j", M.pipesCount, y);
    var te = (!y || y.end !== !1) && v !== D.exports.stdout && v !== D.exports.stderr, F = te ? vt : kt;
    M.endEmitted ? D.exports.nextTick(F) : R.once("end", F), v.on("unpipe", K);
    function K(yt, gt) {
      s("onunpipe"), yt === R && gt && gt.hasUnpiped === !1 && (gt.hasUnpiped = !0, ru());
    }
    function vt() {
      s("onend"), v.end();
    }
    var Tr = Ct(R);
    v.on("drain", Tr);
    var ji = !1;
    function ru() {
      s("cleanup"), v.removeListener("close", Sn), v.removeListener("finish", Rn), v.removeListener("drain", Tr), v.removeListener("error", En), v.removeListener("unpipe", K), R.removeListener("end", vt), R.removeListener("end", kt), R.removeListener("data", Ni), ji = !0, M.awaitDrain && (!v._writableState || v._writableState.needDrain) && Tr();
    }
    R.on("data", Ni);
    function Ni(yt) {
      s("ondata");
      var gt = v.write(yt);
      s("dest.write", gt), gt === !1 && ((M.pipesCount === 1 && M.pipes === v || M.pipesCount > 1 && U(M.pipes, v) !== -1) && !ji && (s("false write response, pause", M.awaitDrain), M.awaitDrain++), R.pause());
    }
    function En(yt) {
      s("onerror", yt), kt(), v.removeListener("error", En), t(v, "error") === 0 && k(v, yt);
    }
    P(v, "error", En);
    function Sn() {
      v.removeListener("finish", Rn), kt();
    }
    v.once("close", Sn);
    function Rn() {
      s("onfinish"), v.removeListener("close", Sn), kt();
    }
    v.once("finish", Rn);
    function kt() {
      s("unpipe"), R.unpipe(v);
    }
    return v.emit("pipe", R), M.flowing || (s("pipe resume"), R.resume()), v;
  };
  function Ct(v) {
    return function() {
      var R = v._readableState;
      s("pipeOnDrain", R.awaitDrain), R.awaitDrain && R.awaitDrain--, R.awaitDrain === 0 && t(v, "data") && (R.flowing = !0, w(v));
    };
  }
  I.prototype.unpipe = function(v) {
    var y = this._readableState, R = {
      hasUnpiped: !1
    };
    if (y.pipesCount === 0)
      return this;
    if (y.pipesCount === 1)
      return v && v !== y.pipes ? this : (v || (v = y.pipes), y.pipes = null, y.pipesCount = 0, y.flowing = !1, v && v.emit("unpipe", this, R), this);
    if (!v) {
      var M = y.pipes, te = y.pipesCount;
      y.pipes = null, y.pipesCount = 0, y.flowing = !1;
      for (var F = 0; F < te; F++)
        M[F].emit("unpipe", this, {
          hasUnpiped: !1
        });
      return this;
    }
    var K = U(y.pipes, v);
    return K === -1 ? this : (y.pipes.splice(K, 1), y.pipesCount -= 1, y.pipesCount === 1 && (y.pipes = y.pipes[0]), v.emit("unpipe", this, R), this);
  }, I.prototype.on = function(v, y) {
    var R = r.prototype.on.call(this, v, y), M = this._readableState;
    return v === "data" ? (M.readableListening = this.listenerCount("readable") > 0, M.flowing !== !1 && this.resume()) : v === "readable" && !M.endEmitted && !M.readableListening && (M.readableListening = M.needReadable = !0, M.flowing = !1, M.emittedReadable = !1, s("on readable", M.length, M.reading), M.length ? Ue(this) : M.reading || D.exports.nextTick(Le, this)), R;
  }, I.prototype.addListener = I.prototype.on, I.prototype.removeListener = function(v, y) {
    var R = r.prototype.removeListener.call(this, v, y);
    return v === "readable" && D.exports.nextTick(pt, this), R;
  }, I.prototype.removeAllListeners = function(v) {
    var y = r.prototype.removeAllListeners.apply(this, arguments);
    return (v === "readable" || v === void 0) && D.exports.nextTick(pt, this), y;
  };
  function pt(v) {
    var y = v._readableState;
    y.readableListening = v.listenerCount("readable") > 0, y.resumeScheduled && !y.paused ? y.flowing = !0 : v.listenerCount("data") > 0 && v.resume();
  }
  function Le(v) {
    s("readable nexttick read 0"), v.read(0);
  }
  I.prototype.resume = function() {
    var v = this._readableState;
    return v.flowing || (s("resume"), v.flowing = !v.readableListening, Mt(this, v)), v.paused = !1, this;
  };
  function Mt(v, y) {
    y.resumeScheduled || (y.resumeScheduled = !0, D.exports.nextTick(_t, v, y));
  }
  function _t(v, y) {
    s("resume", y.reading), y.reading || v.read(0), y.resumeScheduled = !1, v.emit("resume"), w(v), y.flowing && !y.reading && v.read(0);
  }
  I.prototype.pause = function() {
    return s("call pause flowing=%j", this._readableState.flowing), this._readableState.flowing !== !1 && (s("pause"), this._readableState.flowing = !1, this.emit("pause")), this._readableState.paused = !0, this;
  };
  function w(v) {
    var y = v._readableState;
    for (s("flow", y.flowing); y.flowing && v.read() !== null; )
      ;
  }
  I.prototype.wrap = function(v) {
    var y = this, R = this._readableState, M = !1;
    v.on("end", function() {
      if (s("wrapped end"), R.decoder && !R.ended) {
        var K = R.decoder.end();
        K && K.length && y.push(K);
      }
      y.push(null);
    }), v.on("data", function(K) {
      if (s("wrapped data"), R.decoder && (K = R.decoder.write(K)), !(R.objectMode && K == null) && !(!R.objectMode && (!K || !K.length))) {
        var vt = y.push(K);
        vt || (M = !0, v.pause());
      }
    });
    for (var te in v)
      this[te] === void 0 && typeof v[te] == "function" && (this[te] = function(vt) {
        return function() {
          return v[vt].apply(v, arguments);
        };
      }(te));
    for (var F = 0; F < j.length; F++)
      v.on(j[F], this.emit.bind(this, j[F]));
    return this._read = function(K) {
      s("wrapped _read", K), M && (M = !1, v.resume());
    }, this;
  }, typeof Symbol == "function" && (I.prototype[Symbol.asyncIterator] = function() {
    return A === void 0 && (A = fc()), A(this);
  }), Object.defineProperty(I.prototype, "readableHighWaterMark", {
    enumerable: !1,
    get: function() {
      return this._readableState.highWaterMark;
    }
  }), Object.defineProperty(I.prototype, "readableBuffer", {
    enumerable: !1,
    get: function() {
      return this._readableState && this._readableState.buffer;
    }
  }), Object.defineProperty(I.prototype, "readableFlowing", {
    enumerable: !1,
    get: function() {
      return this._readableState.flowing;
    },
    set: function(y) {
      this._readableState && (this._readableState.flowing = y);
    }
  }), I._fromList = b, Object.defineProperty(I.prototype, "readableLength", {
    enumerable: !1,
    get: function() {
      return this._readableState.length;
    }
  });
  function b(v, y) {
    if (y.length === 0)
      return null;
    var R;
    return y.objectMode ? R = y.buffer.shift() : !v || v >= y.length ? (y.decoder ? R = y.buffer.join("") : y.buffer.length === 1 ? R = y.buffer.first() : R = y.buffer.concat(y.length), y.buffer.clear()) : R = y.buffer.consume(v, y.decoder), R;
  }
  function O(v) {
    var y = v._readableState;
    s("endReadable", y.endEmitted), y.endEmitted || (y.ended = !0, D.exports.nextTick(L, y, v));
  }
  function L(v, y) {
    if (s("endReadableNT", v.endEmitted, v.length), !v.endEmitted && v.length === 0 && (v.endEmitted = !0, y.readable = !1, y.emit("end"), v.autoDestroy)) {
      var R = y._writableState;
      (!R || R.autoDestroy && R.finished) && y.destroy();
    }
  }
  typeof Symbol == "function" && (I.from = function(v, y) {
    return T === void 0 && (T = lc()), T(I, v, y);
  });
  function U(v, y) {
    for (var R = 0, M = v.length; R < M; R++)
      if (v[R] === y)
        return R;
    return -1;
  }
  return Zn;
}
var Ts = ze, dn = ft.codes, cc = dn.ERR_METHOD_NOT_IMPLEMENTED, hc = dn.ERR_MULTIPLE_CALLBACK, dc = dn.ERR_TRANSFORM_ALREADY_TRANSFORMING, pc = dn.ERR_TRANSFORM_WITH_LENGTH_0, pn = Ot();
ie.exports(ze, pn);
function _c(e, t) {
  var r = this._transformState;
  r.transforming = !1;
  var n = r.writecb;
  if (n === null)
    return this.emit("error", new hc());
  r.writechunk = null, r.writecb = null, t != null && this.push(t), n(e);
  var i = this._readableState;
  i.reading = !1, (i.needReadable || i.length < i.highWaterMark) && this._read(i.highWaterMark);
}
function ze(e) {
  if (!(this instanceof ze))
    return new ze(e);
  pn.call(this, e), this._transformState = {
    afterTransform: _c.bind(this),
    needTransform: !1,
    transforming: !1,
    writecb: null,
    writechunk: null,
    writeencoding: null
  }, this._readableState.needReadable = !0, this._readableState.sync = !1, e && (typeof e.transform == "function" && (this._transform = e.transform), typeof e.flush == "function" && (this._flush = e.flush)), this.on("prefinish", vc);
}
function vc() {
  var e = this;
  typeof this._flush == "function" && !this._readableState.destroyed ? this._flush(function(t, r) {
    na(e, t, r);
  }) : na(this, null, null);
}
ze.prototype.push = function(e, t) {
  return this._transformState.needTransform = !1, pn.prototype.push.call(this, e, t);
};
ze.prototype._transform = function(e, t, r) {
  r(new cc("_transform()"));
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
  pn.prototype._destroy.call(this, e, function(r) {
    t(r);
  });
};
function na(e, t, r) {
  if (t)
    return e.emit("error", t);
  if (r != null && e.push(r), e._writableState.length)
    throw new pc();
  if (e._transformState.transforming)
    throw new dc();
  return e.push(null);
}
var yc = br, Cs = Ts;
ie.exports(br, Cs);
function br(e) {
  if (!(this instanceof br))
    return new br(e);
  Cs.call(this, e);
}
br.prototype._transform = function(e, t, r) {
  r(null, e);
};
var Xn;
function gc(e) {
  var t = !1;
  return function() {
    t || (t = !0, e.apply(void 0, arguments));
  };
}
var Ms = ft.codes, bc = Ms.ERR_MISSING_ARGS, wc = Ms.ERR_STREAM_DESTROYED;
function ia(e) {
  if (e)
    throw e;
}
function xc(e) {
  return e.setHeader && typeof e.abort == "function";
}
function mc(e, t, r, n) {
  n = gc(n);
  var i = !1;
  e.on("close", function() {
    i = !0;
  }), Xn === void 0 && (Xn = Li), Xn(e, {
    readable: t,
    writable: r
  }, function(a) {
    if (a)
      return n(a);
    i = !0, n();
  });
  var o = !1;
  return function(a) {
    if (!i && !o) {
      if (o = !0, xc(e))
        return e.abort();
      if (typeof e.destroy == "function")
        return e.destroy();
      n(a || new wc("pipe"));
    }
  };
}
function oa(e) {
  e();
}
function Ec(e, t) {
  return e.pipe(t);
}
function Sc(e) {
  return !e.length || typeof e[e.length - 1] != "function" ? ia : e.pop();
}
function Rc() {
  for (var e = arguments.length, t = new Array(e), r = 0; r < e; r++)
    t[r] = arguments[r];
  var n = Sc(t);
  if (Array.isArray(t[0]) && (t = t[0]), t.length < 2)
    throw new bc("streams");
  var i, o = t.map(function(a, u) {
    var s = u < t.length - 1, f = u > 0;
    return mc(a, s, f, function(h) {
      i || (i = h), h && o.forEach(oa), !s && (o.forEach(oa), n(i));
    });
  });
  return t.reduce(Ec);
}
var Oc = Rc;
(function(e, t) {
  t = e.exports = Is(), t.Stream = t, t.Readable = t, t.Writable = Rs(), t.Duplex = Ot(), t.Transform = Ts, t.PassThrough = yc, t.finished = Li, t.pipeline = Oc;
})(si, si.exports);
var en = me.exports.Buffer, ks = si.exports.Transform, Ac = ie.exports;
function Ic(e, t) {
  if (!en.isBuffer(e) && typeof e != "string")
    throw new TypeError(t + " must be a string or a buffer");
}
function Qe(e) {
  ks.call(this), this._block = en.allocUnsafe(e), this._blockSize = e, this._blockOffset = 0, this._length = [0, 0, 0, 0], this._finalized = !1;
}
Ac(Qe, ks);
Qe.prototype._transform = function(e, t, r) {
  var n = null;
  try {
    this.update(e, t);
  } catch (i) {
    n = i;
  }
  r(n);
};
Qe.prototype._flush = function(e) {
  var t = null;
  try {
    this.push(this.digest());
  } catch (r) {
    t = r;
  }
  e(t);
};
Qe.prototype.update = function(e, t) {
  if (Ic(e, "Data"), this._finalized)
    throw new Error("Digest already called");
  en.isBuffer(e) || (e = en.from(e, t));
  for (var r = this._block, n = 0; this._blockOffset + e.length - n >= this._blockSize; ) {
    for (var i = this._blockOffset; i < this._blockSize; )
      r[i++] = e[n++];
    this._update(), this._blockOffset = 0;
  }
  for (; n < e.length; )
    r[this._blockOffset++] = e[n++];
  for (var o = 0, a = e.length * 8; a > 0; ++o)
    this._length[o] += a, a = this._length[o] / 4294967296 | 0, a > 0 && (this._length[o] -= 4294967296 * a);
  return this;
};
Qe.prototype._update = function() {
  throw new Error("_update is not implemented");
};
Qe.prototype.digest = function(e) {
  if (this._finalized)
    throw new Error("Digest already called");
  this._finalized = !0;
  var t = this._digest();
  e !== void 0 && (t = t.toString(e)), this._block.fill(0), this._blockOffset = 0;
  for (var r = 0; r < 4; ++r)
    this._length[r] = 0;
  return t;
};
Qe.prototype._digest = function() {
  throw new Error("_digest is not implemented");
};
var Bs = Qe, Tc = ie.exports, Ls = Bs, Cc = me.exports.Buffer, Mc = new Array(16);
function _n() {
  Ls.call(this, 64), this._a = 1732584193, this._b = 4023233417, this._c = 2562383102, this._d = 271733878;
}
Tc(_n, Ls);
_n.prototype._update = function() {
  for (var e = Mc, t = 0; t < 16; ++t)
    e[t] = this._block.readInt32LE(t * 4);
  var r = this._a, n = this._b, i = this._c, o = this._d;
  r = se(r, n, i, o, e[0], 3614090360, 7), o = se(o, r, n, i, e[1], 3905402710, 12), i = se(i, o, r, n, e[2], 606105819, 17), n = se(n, i, o, r, e[3], 3250441966, 22), r = se(r, n, i, o, e[4], 4118548399, 7), o = se(o, r, n, i, e[5], 1200080426, 12), i = se(i, o, r, n, e[6], 2821735955, 17), n = se(n, i, o, r, e[7], 4249261313, 22), r = se(r, n, i, o, e[8], 1770035416, 7), o = se(o, r, n, i, e[9], 2336552879, 12), i = se(i, o, r, n, e[10], 4294925233, 17), n = se(n, i, o, r, e[11], 2304563134, 22), r = se(r, n, i, o, e[12], 1804603682, 7), o = se(o, r, n, i, e[13], 4254626195, 12), i = se(i, o, r, n, e[14], 2792965006, 17), n = se(n, i, o, r, e[15], 1236535329, 22), r = ue(r, n, i, o, e[1], 4129170786, 5), o = ue(o, r, n, i, e[6], 3225465664, 9), i = ue(i, o, r, n, e[11], 643717713, 14), n = ue(n, i, o, r, e[0], 3921069994, 20), r = ue(r, n, i, o, e[5], 3593408605, 5), o = ue(o, r, n, i, e[10], 38016083, 9), i = ue(i, o, r, n, e[15], 3634488961, 14), n = ue(n, i, o, r, e[4], 3889429448, 20), r = ue(r, n, i, o, e[9], 568446438, 5), o = ue(o, r, n, i, e[14], 3275163606, 9), i = ue(i, o, r, n, e[3], 4107603335, 14), n = ue(n, i, o, r, e[8], 1163531501, 20), r = ue(r, n, i, o, e[13], 2850285829, 5), o = ue(o, r, n, i, e[2], 4243563512, 9), i = ue(i, o, r, n, e[7], 1735328473, 14), n = ue(n, i, o, r, e[12], 2368359562, 20), r = fe(r, n, i, o, e[5], 4294588738, 4), o = fe(o, r, n, i, e[8], 2272392833, 11), i = fe(i, o, r, n, e[11], 1839030562, 16), n = fe(n, i, o, r, e[14], 4259657740, 23), r = fe(r, n, i, o, e[1], 2763975236, 4), o = fe(o, r, n, i, e[4], 1272893353, 11), i = fe(i, o, r, n, e[7], 4139469664, 16), n = fe(n, i, o, r, e[10], 3200236656, 23), r = fe(r, n, i, o, e[13], 681279174, 4), o = fe(o, r, n, i, e[0], 3936430074, 11), i = fe(i, o, r, n, e[3], 3572445317, 16), n = fe(n, i, o, r, e[6], 76029189, 23), r = fe(r, n, i, o, e[9], 3654602809, 4), o = fe(o, r, n, i, e[12], 3873151461, 11), i = fe(i, o, r, n, e[15], 530742520, 16), n = fe(n, i, o, r, e[2], 3299628645, 23), r = le(r, n, i, o, e[0], 4096336452, 6), o = le(o, r, n, i, e[7], 1126891415, 10), i = le(i, o, r, n, e[14], 2878612391, 15), n = le(n, i, o, r, e[5], 4237533241, 21), r = le(r, n, i, o, e[12], 1700485571, 6), o = le(o, r, n, i, e[3], 2399980690, 10), i = le(i, o, r, n, e[10], 4293915773, 15), n = le(n, i, o, r, e[1], 2240044497, 21), r = le(r, n, i, o, e[8], 1873313359, 6), o = le(o, r, n, i, e[15], 4264355552, 10), i = le(i, o, r, n, e[6], 2734768916, 15), n = le(n, i, o, r, e[13], 1309151649, 21), r = le(r, n, i, o, e[4], 4149444226, 6), o = le(o, r, n, i, e[11], 3174756917, 10), i = le(i, o, r, n, e[2], 718787259, 15), n = le(n, i, o, r, e[9], 3951481745, 21), this._a = this._a + r | 0, this._b = this._b + n | 0, this._c = this._c + i | 0, this._d = this._d + o | 0;
};
_n.prototype._digest = function() {
  this._block[this._blockOffset++] = 128, this._blockOffset > 56 && (this._block.fill(0, this._blockOffset, 64), this._update(), this._blockOffset = 0), this._block.fill(0, this._blockOffset, 56), this._block.writeUInt32LE(this._length[0], 56), this._block.writeUInt32LE(this._length[1], 60), this._update();
  var e = Cc.allocUnsafe(16);
  return e.writeInt32LE(this._a, 0), e.writeInt32LE(this._b, 4), e.writeInt32LE(this._c, 8), e.writeInt32LE(this._d, 12), e;
};
function vn(e, t) {
  return e << t | e >>> 32 - t;
}
function se(e, t, r, n, i, o, a) {
  return vn(e + (t & r | ~t & n) + i + o | 0, a) + t | 0;
}
function ue(e, t, r, n, i, o, a) {
  return vn(e + (t & n | r & ~n) + i + o | 0, a) + t | 0;
}
function fe(e, t, r, n, i, o, a) {
  return vn(e + (t ^ r ^ n) + i + o | 0, a) + t | 0;
}
function le(e, t, r, n, i, o, a) {
  return vn(e + (r ^ (t | ~n)) + i + o | 0, a) + t | 0;
}
var kc = _n, Qn = xr.Buffer, Bc = ie.exports, Ps = Bs, Lc = new Array(16), nr = [
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
], ir = [
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
], or = [
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
], ar = [
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
], sr = [0, 1518500249, 1859775393, 2400959708, 2840853838], ur = [1352829926, 1548603684, 1836072691, 2053994217, 0];
function yn() {
  Ps.call(this, 64), this._a = 1732584193, this._b = 4023233417, this._c = 2562383102, this._d = 271733878, this._e = 3285377520;
}
Bc(yn, Ps);
yn.prototype._update = function() {
  for (var e = Lc, t = 0; t < 16; ++t)
    e[t] = this._block.readInt32LE(t * 4);
  for (var r = this._a | 0, n = this._b | 0, i = this._c | 0, o = this._d | 0, a = this._e | 0, u = this._a | 0, s = this._b | 0, f = this._c | 0, h = this._d | 0, l = this._e | 0, c = 0; c < 80; c += 1) {
    var d, p;
    c < 16 ? (d = aa(r, n, i, o, a, e[nr[c]], sr[0], or[c]), p = la(u, s, f, h, l, e[ir[c]], ur[0], ar[c])) : c < 32 ? (d = sa(r, n, i, o, a, e[nr[c]], sr[1], or[c]), p = fa(u, s, f, h, l, e[ir[c]], ur[1], ar[c])) : c < 48 ? (d = ua(r, n, i, o, a, e[nr[c]], sr[2], or[c]), p = ua(u, s, f, h, l, e[ir[c]], ur[2], ar[c])) : c < 64 ? (d = fa(r, n, i, o, a, e[nr[c]], sr[3], or[c]), p = sa(u, s, f, h, l, e[ir[c]], ur[3], ar[c])) : (d = la(r, n, i, o, a, e[nr[c]], sr[4], or[c]), p = aa(u, s, f, h, l, e[ir[c]], ur[4], ar[c])), r = a, a = o, o = at(i, 10), i = n, n = d, u = l, l = h, h = at(f, 10), f = s, s = p;
  }
  var _ = this._b + i + h | 0;
  this._b = this._c + o + l | 0, this._c = this._d + a + u | 0, this._d = this._e + r + s | 0, this._e = this._a + n + f | 0, this._a = _;
};
yn.prototype._digest = function() {
  this._block[this._blockOffset++] = 128, this._blockOffset > 56 && (this._block.fill(0, this._blockOffset, 64), this._update(), this._blockOffset = 0), this._block.fill(0, this._blockOffset, 56), this._block.writeUInt32LE(this._length[0], 56), this._block.writeUInt32LE(this._length[1], 60), this._update();
  var e = Qn.alloc ? Qn.alloc(20) : new Qn(20);
  return e.writeInt32LE(this._a, 0), e.writeInt32LE(this._b, 4), e.writeInt32LE(this._c, 8), e.writeInt32LE(this._d, 12), e.writeInt32LE(this._e, 16), e;
};
function at(e, t) {
  return e << t | e >>> 32 - t;
}
function aa(e, t, r, n, i, o, a, u) {
  return at(e + (t ^ r ^ n) + o + a | 0, u) + i | 0;
}
function sa(e, t, r, n, i, o, a, u) {
  return at(e + (t & r | ~t & n) + o + a | 0, u) + i | 0;
}
function ua(e, t, r, n, i, o, a, u) {
  return at(e + ((t | ~r) ^ n) + o + a | 0, u) + i | 0;
}
function fa(e, t, r, n, i, o, a, u) {
  return at(e + (t & n | r & ~n) + o + a | 0, u) + i | 0;
}
function la(e, t, r, n, i, o, a, u) {
  return at(e + (t ^ (r | ~n)) + o + a | 0, u) + i | 0;
}
var Pc = yn, qs = { exports: {} }, Ds = me.exports.Buffer;
function gn(e, t) {
  this._block = Ds.alloc(e), this._finalSize = t, this._blockSize = e, this._len = 0;
}
gn.prototype.update = function(e, t) {
  typeof e == "string" && (t = t || "utf8", e = Ds.from(e, t));
  for (var r = this._block, n = this._blockSize, i = e.length, o = this._len, a = 0; a < i; ) {
    for (var u = o % n, s = Math.min(i - a, n - u), f = 0; f < s; f++)
      r[u + f] = e[a + f];
    o += s, a += s, o % n === 0 && this._update(r);
  }
  return this._len += i, this;
};
gn.prototype.digest = function(e) {
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
  var o = this._hash();
  return e ? o.toString(e) : o;
};
gn.prototype._update = function() {
  throw new Error("_update must be implemented by subclass");
};
var It = gn, qc = ie.exports, js = It, Dc = me.exports.Buffer, jc = [
  1518500249,
  1859775393,
  -1894007588,
  -899497514
], Nc = new Array(80);
function Rr() {
  this.init(), this._w = Nc, js.call(this, 64, 56);
}
qc(Rr, js);
Rr.prototype.init = function() {
  return this._a = 1732584193, this._b = 4023233417, this._c = 2562383102, this._d = 271733878, this._e = 3285377520, this;
};
function Fc(e) {
  return e << 5 | e >>> 27;
}
function Uc(e) {
  return e << 30 | e >>> 2;
}
function Hc(e, t, r, n) {
  return e === 0 ? t & r | ~t & n : e === 2 ? t & r | t & n | r & n : t ^ r ^ n;
}
Rr.prototype._update = function(e) {
  for (var t = this._w, r = this._a | 0, n = this._b | 0, i = this._c | 0, o = this._d | 0, a = this._e | 0, u = 0; u < 16; ++u)
    t[u] = e.readInt32BE(u * 4);
  for (; u < 80; ++u)
    t[u] = t[u - 3] ^ t[u - 8] ^ t[u - 14] ^ t[u - 16];
  for (var s = 0; s < 80; ++s) {
    var f = ~~(s / 20), h = Fc(r) + Hc(f, n, i, o) + a + t[s] + jc[f] | 0;
    a = o, o = i, i = Uc(n), n = r, r = h;
  }
  this._a = r + this._a | 0, this._b = n + this._b | 0, this._c = i + this._c | 0, this._d = o + this._d | 0, this._e = a + this._e | 0;
};
Rr.prototype._hash = function() {
  var e = Dc.allocUnsafe(20);
  return e.writeInt32BE(this._a | 0, 0), e.writeInt32BE(this._b | 0, 4), e.writeInt32BE(this._c | 0, 8), e.writeInt32BE(this._d | 0, 12), e.writeInt32BE(this._e | 0, 16), e;
};
var $c = Rr, Wc = ie.exports, Ns = It, zc = me.exports.Buffer, Gc = [
  1518500249,
  1859775393,
  -1894007588,
  -899497514
], Yc = new Array(80);
function Or() {
  this.init(), this._w = Yc, Ns.call(this, 64, 56);
}
Wc(Or, Ns);
Or.prototype.init = function() {
  return this._a = 1732584193, this._b = 4023233417, this._c = 2562383102, this._d = 271733878, this._e = 3285377520, this;
};
function Vc(e) {
  return e << 1 | e >>> 31;
}
function Kc(e) {
  return e << 5 | e >>> 27;
}
function Zc(e) {
  return e << 30 | e >>> 2;
}
function Xc(e, t, r, n) {
  return e === 0 ? t & r | ~t & n : e === 2 ? t & r | t & n | r & n : t ^ r ^ n;
}
Or.prototype._update = function(e) {
  for (var t = this._w, r = this._a | 0, n = this._b | 0, i = this._c | 0, o = this._d | 0, a = this._e | 0, u = 0; u < 16; ++u)
    t[u] = e.readInt32BE(u * 4);
  for (; u < 80; ++u)
    t[u] = Vc(t[u - 3] ^ t[u - 8] ^ t[u - 14] ^ t[u - 16]);
  for (var s = 0; s < 80; ++s) {
    var f = ~~(s / 20), h = Kc(r) + Xc(f, n, i, o) + a + t[s] + Gc[f] | 0;
    a = o, o = i, i = Zc(n), n = r, r = h;
  }
  this._a = r + this._a | 0, this._b = n + this._b | 0, this._c = i + this._c | 0, this._d = o + this._d | 0, this._e = a + this._e | 0;
};
Or.prototype._hash = function() {
  var e = zc.allocUnsafe(20);
  return e.writeInt32BE(this._a | 0, 0), e.writeInt32BE(this._b | 0, 4), e.writeInt32BE(this._c | 0, 8), e.writeInt32BE(this._d | 0, 12), e.writeInt32BE(this._e | 0, 16), e;
};
var Qc = Or, Jc = ie.exports, Fs = It, eh = me.exports.Buffer, th = [
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
], rh = new Array(64);
function Ar() {
  this.init(), this._w = rh, Fs.call(this, 64, 56);
}
Jc(Ar, Fs);
Ar.prototype.init = function() {
  return this._a = 1779033703, this._b = 3144134277, this._c = 1013904242, this._d = 2773480762, this._e = 1359893119, this._f = 2600822924, this._g = 528734635, this._h = 1541459225, this;
};
function nh(e, t, r) {
  return r ^ e & (t ^ r);
}
function ih(e, t, r) {
  return e & t | r & (e | t);
}
function oh(e) {
  return (e >>> 2 | e << 30) ^ (e >>> 13 | e << 19) ^ (e >>> 22 | e << 10);
}
function ah(e) {
  return (e >>> 6 | e << 26) ^ (e >>> 11 | e << 21) ^ (e >>> 25 | e << 7);
}
function sh(e) {
  return (e >>> 7 | e << 25) ^ (e >>> 18 | e << 14) ^ e >>> 3;
}
function uh(e) {
  return (e >>> 17 | e << 15) ^ (e >>> 19 | e << 13) ^ e >>> 10;
}
Ar.prototype._update = function(e) {
  for (var t = this._w, r = this._a | 0, n = this._b | 0, i = this._c | 0, o = this._d | 0, a = this._e | 0, u = this._f | 0, s = this._g | 0, f = this._h | 0, h = 0; h < 16; ++h)
    t[h] = e.readInt32BE(h * 4);
  for (; h < 64; ++h)
    t[h] = uh(t[h - 2]) + t[h - 7] + sh(t[h - 15]) + t[h - 16] | 0;
  for (var l = 0; l < 64; ++l) {
    var c = f + ah(a) + nh(a, u, s) + th[l] + t[l] | 0, d = oh(r) + ih(r, n, i) | 0;
    f = s, s = u, u = a, a = o + c | 0, o = i, i = n, n = r, r = c + d | 0;
  }
  this._a = r + this._a | 0, this._b = n + this._b | 0, this._c = i + this._c | 0, this._d = o + this._d | 0, this._e = a + this._e | 0, this._f = u + this._f | 0, this._g = s + this._g | 0, this._h = f + this._h | 0;
};
Ar.prototype._hash = function() {
  var e = eh.allocUnsafe(32);
  return e.writeInt32BE(this._a, 0), e.writeInt32BE(this._b, 4), e.writeInt32BE(this._c, 8), e.writeInt32BE(this._d, 12), e.writeInt32BE(this._e, 16), e.writeInt32BE(this._f, 20), e.writeInt32BE(this._g, 24), e.writeInt32BE(this._h, 28), e;
};
var Us = Ar, fh = ie.exports, lh = Us, ch = It, hh = me.exports.Buffer, dh = new Array(64);
function bn() {
  this.init(), this._w = dh, ch.call(this, 64, 56);
}
fh(bn, lh);
bn.prototype.init = function() {
  return this._a = 3238371032, this._b = 914150663, this._c = 812702999, this._d = 4144912697, this._e = 4290775857, this._f = 1750603025, this._g = 1694076839, this._h = 3204075428, this;
};
bn.prototype._hash = function() {
  var e = hh.allocUnsafe(28);
  return e.writeInt32BE(this._a, 0), e.writeInt32BE(this._b, 4), e.writeInt32BE(this._c, 8), e.writeInt32BE(this._d, 12), e.writeInt32BE(this._e, 16), e.writeInt32BE(this._f, 20), e.writeInt32BE(this._g, 24), e;
};
var ph = bn, _h = ie.exports, Hs = It, vh = me.exports.Buffer, ca = [
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
], yh = new Array(160);
function Ir() {
  this.init(), this._w = yh, Hs.call(this, 128, 112);
}
_h(Ir, Hs);
Ir.prototype.init = function() {
  return this._ah = 1779033703, this._bh = 3144134277, this._ch = 1013904242, this._dh = 2773480762, this._eh = 1359893119, this._fh = 2600822924, this._gh = 528734635, this._hh = 1541459225, this._al = 4089235720, this._bl = 2227873595, this._cl = 4271175723, this._dl = 1595750129, this._el = 2917565137, this._fl = 725511199, this._gl = 4215389547, this._hl = 327033209, this;
};
function ha(e, t, r) {
  return r ^ e & (t ^ r);
}
function da(e, t, r) {
  return e & t | r & (e | t);
}
function pa(e, t) {
  return (e >>> 28 | t << 4) ^ (t >>> 2 | e << 30) ^ (t >>> 7 | e << 25);
}
function _a(e, t) {
  return (e >>> 14 | t << 18) ^ (e >>> 18 | t << 14) ^ (t >>> 9 | e << 23);
}
function gh(e, t) {
  return (e >>> 1 | t << 31) ^ (e >>> 8 | t << 24) ^ e >>> 7;
}
function bh(e, t) {
  return (e >>> 1 | t << 31) ^ (e >>> 8 | t << 24) ^ (e >>> 7 | t << 25);
}
function wh(e, t) {
  return (e >>> 19 | t << 13) ^ (t >>> 29 | e << 3) ^ e >>> 6;
}
function xh(e, t) {
  return (e >>> 19 | t << 13) ^ (t >>> 29 | e << 3) ^ (e >>> 6 | t << 26);
}
function ne(e, t) {
  return e >>> 0 < t >>> 0 ? 1 : 0;
}
Ir.prototype._update = function(e) {
  for (var t = this._w, r = this._ah | 0, n = this._bh | 0, i = this._ch | 0, o = this._dh | 0, a = this._eh | 0, u = this._fh | 0, s = this._gh | 0, f = this._hh | 0, h = this._al | 0, l = this._bl | 0, c = this._cl | 0, d = this._dl | 0, p = this._el | 0, _ = this._fl | 0, g = this._gl | 0, m = this._hl | 0, x = 0; x < 32; x += 2)
    t[x] = e.readInt32BE(x * 4), t[x + 1] = e.readInt32BE(x * 4 + 4);
  for (; x < 160; x += 2) {
    var A = t[x - 30], T = t[x - 15 * 2 + 1], k = gh(A, T), j = bh(T, A);
    A = t[x - 2 * 2], T = t[x - 2 * 2 + 1];
    var P = wh(A, T), B = xh(T, A), I = t[x - 7 * 2], V = t[x - 7 * 2 + 1], N = t[x - 16 * 2], ye = t[x - 16 * 2 + 1], $ = j + V | 0, ee = k + I + ne($, j) | 0;
    $ = $ + B | 0, ee = ee + P + ne($, B) | 0, $ = $ + ye | 0, ee = ee + N + ne($, ye) | 0, t[x] = ee, t[x + 1] = $;
  }
  for (var Te = 0; Te < 160; Te += 2) {
    ee = t[Te], $ = t[Te + 1];
    var Tt = da(r, n, i), Ue = da(h, l, c), ht = pa(r, h), He = pa(h, r), dt = _a(a, p), Ct = _a(p, a), pt = ca[Te], Le = ca[Te + 1], Mt = ha(a, u, s), _t = ha(p, _, g), w = m + Ct | 0, b = f + dt + ne(w, m) | 0;
    w = w + _t | 0, b = b + Mt + ne(w, _t) | 0, w = w + Le | 0, b = b + pt + ne(w, Le) | 0, w = w + $ | 0, b = b + ee + ne(w, $) | 0;
    var O = He + Ue | 0, L = ht + Tt + ne(O, He) | 0;
    f = s, m = g, s = u, g = _, u = a, _ = p, p = d + w | 0, a = o + b + ne(p, d) | 0, o = i, d = c, i = n, c = l, n = r, l = h, h = w + O | 0, r = b + L + ne(h, w) | 0;
  }
  this._al = this._al + h | 0, this._bl = this._bl + l | 0, this._cl = this._cl + c | 0, this._dl = this._dl + d | 0, this._el = this._el + p | 0, this._fl = this._fl + _ | 0, this._gl = this._gl + g | 0, this._hl = this._hl + m | 0, this._ah = this._ah + r + ne(this._al, h) | 0, this._bh = this._bh + n + ne(this._bl, l) | 0, this._ch = this._ch + i + ne(this._cl, c) | 0, this._dh = this._dh + o + ne(this._dl, d) | 0, this._eh = this._eh + a + ne(this._el, p) | 0, this._fh = this._fh + u + ne(this._fl, _) | 0, this._gh = this._gh + s + ne(this._gl, g) | 0, this._hh = this._hh + f + ne(this._hl, m) | 0;
};
Ir.prototype._hash = function() {
  var e = vh.allocUnsafe(64);
  function t(r, n, i) {
    e.writeInt32BE(r, i), e.writeInt32BE(n, i + 4);
  }
  return t(this._ah, this._al, 0), t(this._bh, this._bl, 8), t(this._ch, this._cl, 16), t(this._dh, this._dl, 24), t(this._eh, this._el, 32), t(this._fh, this._fl, 40), t(this._gh, this._gl, 48), t(this._hh, this._hl, 56), e;
};
var $s = Ir, mh = ie.exports, Eh = $s, Sh = It, Rh = me.exports.Buffer, Oh = new Array(160);
function wn() {
  this.init(), this._w = Oh, Sh.call(this, 128, 112);
}
mh(wn, Eh);
wn.prototype.init = function() {
  return this._ah = 3418070365, this._bh = 1654270250, this._ch = 2438529370, this._dh = 355462360, this._eh = 1731405415, this._fh = 2394180231, this._gh = 3675008525, this._hh = 1203062813, this._al = 3238371032, this._bl = 914150663, this._cl = 812702999, this._dl = 4144912697, this._el = 4290775857, this._fl = 1750603025, this._gl = 1694076839, this._hl = 3204075428, this;
};
wn.prototype._hash = function() {
  var e = Rh.allocUnsafe(48);
  function t(r, n, i) {
    e.writeInt32BE(r, i), e.writeInt32BE(n, i + 4);
  }
  return t(this._ah, this._al, 0), t(this._bh, this._bl, 8), t(this._ch, this._cl, 16), t(this._dh, this._dl, 24), t(this._eh, this._el, 32), t(this._fh, this._fl, 40), e;
};
var Ah = wn, lt = qs.exports = function(t) {
  t = t.toLowerCase();
  var r = lt[t];
  if (!r)
    throw new Error(t + " is not supported (we accept pull requests)");
  return new r();
};
lt.sha = $c;
lt.sha1 = Qc;
lt.sha224 = ph;
lt.sha256 = Us;
lt.sha384 = Ah;
lt.sha512 = $s;
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
    return E.alloc(0);
  if (this.length === 1)
    return this.head.data;
  for (var t = E.allocUnsafe(e >>> 0), r = this.head, n = 0; r; )
    r.data.copy(t, n), n += r.data.length, r = r.next;
  return t;
};
J.ReadableState = Ws;
var z = Ii("stream");
Xe(J, Ae.exports);
function Ih(e, t, r) {
  if (typeof e.prependListener == "function")
    return e.prependListener(t, r);
  !e._events || !e._events[t] ? e.on(t, r) : Array.isArray(e._events[t]) ? e._events[t].unshift(r) : e._events[t] = [r, e._events[t]];
}
function Th(e, t) {
  return e.listeners(t).length;
}
function Ws(e, t) {
  e = e || {}, this.objectMode = !!e.objectMode, t instanceof Ee && (this.objectMode = this.objectMode || !!e.readableObjectMode);
  var r = e.highWaterMark, n = this.objectMode ? 16 : 16 * 1024;
  this.highWaterMark = r || r === 0 ? r : n, this.highWaterMark = ~~this.highWaterMark, this.buffer = new ct(), this.length = 0, this.pipes = null, this.pipesCount = 0, this.flowing = null, this.ended = !1, this.endEmitted = !1, this.reading = !1, this.sync = !0, this.needReadable = !1, this.emittedReadable = !1, this.readableListening = !1, this.resumeScheduled = !1, this.defaultEncoding = e.defaultEncoding || "utf8", this.ranOut = !1, this.awaitDrain = 0, this.readingMore = !1, this.decoder = null, this.encoding = null, e.encoding && (this.decoder = new Os(e.encoding), this.encoding = e.encoding);
}
function J(e) {
  if (!(this instanceof J))
    return new J(e);
  this._readableState = new Ws(e, this), this.readable = !0, e && typeof e.read == "function" && (this._read = e.read), Ae.exports.call(this);
}
J.prototype.push = function(e, t) {
  var r = this._readableState;
  return !r.objectMode && typeof e == "string" && (t = t || r.defaultEncoding, t !== r.encoding && (e = E.from(e, t), t = "")), zs(this, r, e, t, !1);
};
J.prototype.unshift = function(e) {
  var t = this._readableState;
  return zs(this, t, e, "", !0);
};
J.prototype.isPaused = function() {
  return this._readableState.flowing === !1;
};
function zs(e, t, r, n, i) {
  var o = kh(t, r);
  if (o)
    e.emit("error", o);
  else if (r === null)
    t.reading = !1, Bh(e, t);
  else if (t.objectMode || r && r.length > 0)
    if (t.ended && !i) {
      var a = new Error("stream.push() after EOF");
      e.emit("error", a);
    } else if (t.endEmitted && i) {
      var u = new Error("stream.unshift() after end event");
      e.emit("error", u);
    } else {
      var s;
      t.decoder && !i && !n && (r = t.decoder.write(r), s = !t.objectMode && r.length === 0), i || (t.reading = !1), s || (t.flowing && t.length === 0 && !t.sync ? (e.emit("data", r), e.read(0)) : (t.length += t.objectMode ? 1 : r.length, i ? t.buffer.unshift(r) : t.buffer.push(r), t.needReadable && xn(e))), Lh(e, t);
    }
  else
    i || (t.reading = !1);
  return Ch(t);
}
function Ch(e) {
  return !e.ended && (e.needReadable || e.length < e.highWaterMark || e.length === 0);
}
J.prototype.setEncoding = function(e) {
  return this._readableState.decoder = new Os(e), this._readableState.encoding = e, this;
};
var va = 8388608;
function Mh(e) {
  return e >= va ? e = va : (e--, e |= e >>> 1, e |= e >>> 2, e |= e >>> 4, e |= e >>> 8, e |= e >>> 16, e++), e;
}
function ya(e, t) {
  return e <= 0 || t.length === 0 && t.ended ? 0 : t.objectMode ? 1 : e !== e ? t.flowing && t.length ? t.buffer.head.data.length : t.length : (e > t.highWaterMark && (t.highWaterMark = Mh(e)), e <= t.length ? e : t.ended ? t.length : (t.needReadable = !0, 0));
}
J.prototype.read = function(e) {
  z("read", e), e = parseInt(e, 10);
  var t = this._readableState, r = e;
  if (e !== 0 && (t.emittedReadable = !1), e === 0 && t.needReadable && (t.length >= t.highWaterMark || t.ended))
    return z("read: emitReadable", t.length, t.ended), t.length === 0 && t.ended ? Jn(this) : xn(this), null;
  if (e = ya(e, t), e === 0 && t.ended)
    return t.length === 0 && Jn(this), null;
  var n = t.needReadable;
  z("need readable", n), (t.length === 0 || t.length - e < t.highWaterMark) && (n = !0, z("length less than watermark", n)), t.ended || t.reading ? (n = !1, z("reading or ended", n)) : n && (z("do read"), t.reading = !0, t.sync = !0, t.length === 0 && (t.needReadable = !0), this._read(t.highWaterMark), t.sync = !1, t.reading || (e = ya(r, t)));
  var i;
  return e > 0 ? i = Gs(e, t) : i = null, i === null ? (t.needReadable = !0, e = 0) : t.length -= e, t.length === 0 && (t.ended || (t.needReadable = !0), r !== e && t.ended && Jn(this)), i !== null && this.emit("data", i), i;
};
function kh(e, t) {
  var r = null;
  return !E.isBuffer(t) && typeof t != "string" && t !== null && t !== void 0 && !e.objectMode && (r = new TypeError("Invalid non-string/buffer chunk")), r;
}
function Bh(e, t) {
  if (!t.ended) {
    if (t.decoder) {
      var r = t.decoder.end();
      r && r.length && (t.buffer.push(r), t.length += t.objectMode ? 1 : r.length);
    }
    t.ended = !0, xn(e);
  }
}
function xn(e) {
  var t = e._readableState;
  t.needReadable = !1, t.emittedReadable || (z("emitReadable", t.flowing), t.emittedReadable = !0, t.sync ? D.exports.nextTick(ga, e) : ga(e));
}
function ga(e) {
  z("emit readable"), e.emit("readable"), Pi(e);
}
function Lh(e, t) {
  t.readingMore || (t.readingMore = !0, D.exports.nextTick(Ph, e, t));
}
function Ph(e, t) {
  for (var r = t.length; !t.reading && !t.flowing && !t.ended && t.length < t.highWaterMark && (z("maybeReadMore read 0"), e.read(0), r !== t.length); )
    r = t.length;
  t.readingMore = !1;
}
J.prototype._read = function(e) {
  this.emit("error", new Error("not implemented"));
};
J.prototype.pipe = function(e, t) {
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
  n.pipesCount += 1, z("pipe count=%d opts=%j", n.pipesCount, t);
  var i = !t || t.end !== !1, o = i ? u : h;
  n.endEmitted ? D.exports.nextTick(o) : r.once("end", o), e.on("unpipe", a);
  function a(m) {
    z("onunpipe"), m === r && h();
  }
  function u() {
    z("onend"), e.end();
  }
  var s = qh(r);
  e.on("drain", s);
  var f = !1;
  function h() {
    z("cleanup"), e.removeListener("close", p), e.removeListener("finish", _), e.removeListener("drain", s), e.removeListener("error", d), e.removeListener("unpipe", a), r.removeListener("end", u), r.removeListener("end", h), r.removeListener("data", c), f = !0, n.awaitDrain && (!e._writableState || e._writableState.needDrain) && s();
  }
  var l = !1;
  r.on("data", c);
  function c(m) {
    z("ondata"), l = !1;
    var x = e.write(m);
    x === !1 && !l && ((n.pipesCount === 1 && n.pipes === e || n.pipesCount > 1 && Ys(n.pipes, e) !== -1) && !f && (z("false write response, pause", r._readableState.awaitDrain), r._readableState.awaitDrain++, l = !0), r.pause());
  }
  function d(m) {
    z("onerror", m), g(), e.removeListener("error", d), Th(e, "error") === 0 && e.emit("error", m);
  }
  Ih(e, "error", d);
  function p() {
    e.removeListener("finish", _), g();
  }
  e.once("close", p);
  function _() {
    z("onfinish"), e.removeListener("close", p), g();
  }
  e.once("finish", _);
  function g() {
    z("unpipe"), r.unpipe(e);
  }
  return e.emit("pipe", r), n.flowing || (z("pipe resume"), r.resume()), e;
};
function qh(e) {
  return function() {
    var t = e._readableState;
    z("pipeOnDrain", t.awaitDrain), t.awaitDrain && t.awaitDrain--, t.awaitDrain === 0 && e.listeners("data").length && (t.flowing = !0, Pi(e));
  };
}
J.prototype.unpipe = function(e) {
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
  var o = Ys(t.pipes, e);
  return o === -1 ? this : (t.pipes.splice(o, 1), t.pipesCount -= 1, t.pipesCount === 1 && (t.pipes = t.pipes[0]), e.emit("unpipe", this), this);
};
J.prototype.on = function(e, t) {
  var r = Ae.exports.prototype.on.call(this, e, t);
  if (e === "data")
    this._readableState.flowing !== !1 && this.resume();
  else if (e === "readable") {
    var n = this._readableState;
    !n.endEmitted && !n.readableListening && (n.readableListening = n.needReadable = !0, n.emittedReadable = !1, n.reading ? n.length && xn(this) : D.exports.nextTick(Dh, this));
  }
  return r;
};
J.prototype.addListener = J.prototype.on;
function Dh(e) {
  z("readable nexttick read 0"), e.read(0);
}
J.prototype.resume = function() {
  var e = this._readableState;
  return e.flowing || (z("resume"), e.flowing = !0, jh(this, e)), this;
};
function jh(e, t) {
  t.resumeScheduled || (t.resumeScheduled = !0, D.exports.nextTick(Nh, e, t));
}
function Nh(e, t) {
  t.reading || (z("resume read 0"), e.read(0)), t.resumeScheduled = !1, t.awaitDrain = 0, e.emit("resume"), Pi(e), t.flowing && !t.reading && e.read(0);
}
J.prototype.pause = function() {
  return z("call pause flowing=%j", this._readableState.flowing), this._readableState.flowing !== !1 && (z("pause"), this._readableState.flowing = !1, this.emit("pause")), this;
};
function Pi(e) {
  var t = e._readableState;
  for (z("flow", t.flowing); t.flowing && e.read() !== null; )
    ;
}
J.prototype.wrap = function(e) {
  var t = this._readableState, r = !1, n = this;
  e.on("end", function() {
    if (z("wrapped end"), t.decoder && !t.ended) {
      var a = t.decoder.end();
      a && a.length && n.push(a);
    }
    n.push(null);
  }), e.on("data", function(a) {
    if (z("wrapped data"), t.decoder && (a = t.decoder.write(a)), !(t.objectMode && a == null) && !(!t.objectMode && (!a || !a.length))) {
      var u = n.push(a);
      u || (r = !0, e.pause());
    }
  });
  for (var i in e)
    this[i] === void 0 && typeof e[i] == "function" && (this[i] = function(a) {
      return function() {
        return e[a].apply(e, arguments);
      };
    }(i));
  var o = ["error", "close", "destroy", "pause", "resume"];
  return Wh(o, function(a) {
    e.on(a, n.emit.bind(n, a));
  }), n._read = function(a) {
    z("wrapped _read", a), r && (r = !1, e.resume());
  }, n;
};
J._fromList = Gs;
function Gs(e, t) {
  if (t.length === 0)
    return null;
  var r;
  return t.objectMode ? r = t.buffer.shift() : !e || e >= t.length ? (t.decoder ? r = t.buffer.join("") : t.buffer.length === 1 ? r = t.buffer.head.data : r = t.buffer.concat(t.length), t.buffer.clear()) : r = Fh(e, t.buffer, t.decoder), r;
}
function Fh(e, t, r) {
  var n;
  return e < t.head.data.length ? (n = t.head.data.slice(0, e), t.head.data = t.head.data.slice(e)) : e === t.head.data.length ? n = t.shift() : n = r ? Uh(e, t) : Hh(e, t), n;
}
function Uh(e, t) {
  var r = t.head, n = 1, i = r.data;
  for (e -= i.length; r = r.next; ) {
    var o = r.data, a = e > o.length ? o.length : e;
    if (a === o.length ? i += o : i += o.slice(0, e), e -= a, e === 0) {
      a === o.length ? (++n, r.next ? t.head = r.next : t.head = t.tail = null) : (t.head = r, r.data = o.slice(a));
      break;
    }
    ++n;
  }
  return t.length -= n, i;
}
function Hh(e, t) {
  var r = E.allocUnsafe(e), n = t.head, i = 1;
  for (n.data.copy(r), e -= n.data.length; n = n.next; ) {
    var o = n.data, a = e > o.length ? o.length : e;
    if (o.copy(r, r.length - e, 0, a), e -= a, e === 0) {
      a === o.length ? (++i, n.next ? t.head = n.next : t.head = t.tail = null) : (t.head = n, n.data = o.slice(a));
      break;
    }
    ++i;
  }
  return t.length -= i, r;
}
function Jn(e) {
  var t = e._readableState;
  if (t.length > 0)
    throw new Error('"endReadable()" called on non-empty stream');
  t.endEmitted || (t.ended = !0, D.exports.nextTick($h, t, e));
}
function $h(e, t) {
  !e.endEmitted && e.length === 0 && (e.endEmitted = !0, t.readable = !1, t.emit("end"));
}
function Wh(e, t) {
  for (var r = 0, n = e.length; r < n; r++)
    t(e[r], r);
}
function Ys(e, t) {
  for (var r = 0, n = e.length; r < n; r++)
    if (e[r] === t)
      return r;
  return -1;
}
ae.WritableState = qi;
Xe(ae, Ae.exports.EventEmitter);
function zh() {
}
function Gh(e, t, r) {
  this.chunk = e, this.encoding = t, this.callback = r, this.next = null;
}
function qi(e, t) {
  Object.defineProperty(this, "buffer", {
    get: cn(function() {
      return this.getBuffer();
    }, "_writableState.buffer is deprecated. Use _writableState.getBuffer instead.")
  }), e = e || {}, this.objectMode = !!e.objectMode, t instanceof Ee && (this.objectMode = this.objectMode || !!e.writableObjectMode);
  var r = e.highWaterMark, n = this.objectMode ? 16 : 16 * 1024;
  this.highWaterMark = r || r === 0 ? r : n, this.highWaterMark = ~~this.highWaterMark, this.needDrain = !1, this.ending = !1, this.ended = !1, this.finished = !1;
  var i = e.decodeStrings === !1;
  this.decodeStrings = !i, this.defaultEncoding = e.defaultEncoding || "utf8", this.length = 0, this.writing = !1, this.corked = 0, this.sync = !0, this.bufferProcessing = !1, this.onwrite = function(o) {
    Jh(t, o);
  }, this.writecb = null, this.writelen = 0, this.bufferedRequest = null, this.lastBufferedRequest = null, this.pendingcb = 0, this.prefinished = !1, this.errorEmitted = !1, this.bufferedRequestCount = 0, this.corkedRequestsFree = new Xs(this);
}
qi.prototype.getBuffer = function() {
  for (var t = this.bufferedRequest, r = []; t; )
    r.push(t), t = t.next;
  return r;
};
function ae(e) {
  if (!(this instanceof ae) && !(this instanceof Ee))
    return new ae(e);
  this._writableState = new qi(e, this), this.writable = !0, e && (typeof e.write == "function" && (this._write = e.write), typeof e.writev == "function" && (this._writev = e.writev)), Ae.exports.EventEmitter.call(this);
}
ae.prototype.pipe = function() {
  this.emit("error", new Error("Cannot pipe, not readable"));
};
function Yh(e, t) {
  var r = new Error("write after end");
  e.emit("error", r), D.exports.nextTick(t, r);
}
function Vh(e, t, r, n) {
  var i = !0, o = !1;
  return r === null ? o = new TypeError("May not write null values to stream") : !E.isBuffer(r) && typeof r != "string" && r !== void 0 && !t.objectMode && (o = new TypeError("Invalid non-string/buffer chunk")), o && (e.emit("error", o), D.exports.nextTick(n, o), i = !1), i;
}
ae.prototype.write = function(e, t, r) {
  var n = this._writableState, i = !1;
  return typeof t == "function" && (r = t, t = null), E.isBuffer(e) ? t = "buffer" : t || (t = n.defaultEncoding), typeof r != "function" && (r = zh), n.ended ? Yh(this, r) : Vh(this, n, e, r) && (n.pendingcb++, i = Zh(this, n, e, t, r)), i;
};
ae.prototype.cork = function() {
  var e = this._writableState;
  e.corked++;
};
ae.prototype.uncork = function() {
  var e = this._writableState;
  e.corked && (e.corked--, !e.writing && !e.corked && !e.finished && !e.bufferProcessing && e.bufferedRequest && Vs(this, e));
};
ae.prototype.setDefaultEncoding = function(t) {
  if (typeof t == "string" && (t = t.toLowerCase()), !(["hex", "utf8", "utf-8", "ascii", "binary", "base64", "ucs2", "ucs-2", "utf16le", "utf-16le", "raw"].indexOf((t + "").toLowerCase()) > -1))
    throw new TypeError("Unknown encoding: " + t);
  return this._writableState.defaultEncoding = t, this;
};
function Kh(e, t, r) {
  return !e.objectMode && e.decodeStrings !== !1 && typeof t == "string" && (t = E.from(t, r)), t;
}
function Zh(e, t, r, n, i) {
  r = Kh(t, r, n), E.isBuffer(r) && (n = "buffer");
  var o = t.objectMode ? 1 : r.length;
  t.length += o;
  var a = t.length < t.highWaterMark;
  if (a || (t.needDrain = !0), t.writing || t.corked) {
    var u = t.lastBufferedRequest;
    t.lastBufferedRequest = new Gh(r, n, i), u ? u.next = t.lastBufferedRequest : t.bufferedRequest = t.lastBufferedRequest, t.bufferedRequestCount += 1;
  } else
    di(e, t, !1, o, r, n, i);
  return a;
}
function di(e, t, r, n, i, o, a) {
  t.writelen = n, t.writecb = a, t.writing = !0, t.sync = !0, r ? e._writev(i, t.onwrite) : e._write(i, o, t.onwrite), t.sync = !1;
}
function Xh(e, t, r, n, i) {
  --t.pendingcb, r ? D.exports.nextTick(i, n) : i(n), e._writableState.errorEmitted = !0, e.emit("error", n);
}
function Qh(e) {
  e.writing = !1, e.writecb = null, e.length -= e.writelen, e.writelen = 0;
}
function Jh(e, t) {
  var r = e._writableState, n = r.sync, i = r.writecb;
  if (Qh(r), t)
    Xh(e, r, n, t, i);
  else {
    var o = Ks(r);
    !o && !r.corked && !r.bufferProcessing && r.bufferedRequest && Vs(e, r), n ? D.exports.nextTick(ba, e, r, o, i) : ba(e, r, o, i);
  }
}
function ba(e, t, r, n) {
  r || ed(e, t), t.pendingcb--, n(), Zs(e, t);
}
function ed(e, t) {
  t.length === 0 && t.needDrain && (t.needDrain = !1, e.emit("drain"));
}
function Vs(e, t) {
  t.bufferProcessing = !0;
  var r = t.bufferedRequest;
  if (e._writev && r && r.next) {
    var n = t.bufferedRequestCount, i = new Array(n), o = t.corkedRequestsFree;
    o.entry = r;
    for (var a = 0; r; )
      i[a] = r, r = r.next, a += 1;
    di(e, t, !0, t.length, i, "", o.finish), t.pendingcb++, t.lastBufferedRequest = null, o.next ? (t.corkedRequestsFree = o.next, o.next = null) : t.corkedRequestsFree = new Xs(t);
  } else {
    for (; r; ) {
      var u = r.chunk, s = r.encoding, f = r.callback, h = t.objectMode ? 1 : u.length;
      if (di(e, t, !1, h, u, s, f), r = r.next, t.writing)
        break;
    }
    r === null && (t.lastBufferedRequest = null);
  }
  t.bufferedRequestCount = 0, t.bufferedRequest = r, t.bufferProcessing = !1;
}
ae.prototype._write = function(e, t, r) {
  r(new Error("not implemented"));
};
ae.prototype._writev = null;
ae.prototype.end = function(e, t, r) {
  var n = this._writableState;
  typeof e == "function" ? (r = e, e = null, t = null) : typeof t == "function" && (r = t, t = null), e != null && this.write(e, t), n.corked && (n.corked = 1, this.uncork()), !n.ending && !n.finished && td(this, n, r);
};
function Ks(e) {
  return e.ending && e.length === 0 && e.bufferedRequest === null && !e.finished && !e.writing;
}
function wa(e, t) {
  t.prefinished || (t.prefinished = !0, e.emit("prefinish"));
}
function Zs(e, t) {
  var r = Ks(t);
  return r && (t.pendingcb === 0 ? (wa(e, t), t.finished = !0, e.emit("finish")) : wa(e, t)), r;
}
function td(e, t, r) {
  t.ending = !0, Zs(e, t), r && (t.finished ? D.exports.nextTick(r) : e.once("finish", r)), t.ended = !0, e.writable = !1;
}
function Xs(e) {
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
Xe(Ee, J);
var xa = Object.keys(ae.prototype);
for (var ei = 0; ei < xa.length; ei++) {
  var ti = xa[ei];
  Ee.prototype[ti] || (Ee.prototype[ti] = ae.prototype[ti]);
}
function Ee(e) {
  if (!(this instanceof Ee))
    return new Ee(e);
  J.call(this, e), ae.call(this, e), e && e.readable === !1 && (this.readable = !1), e && e.writable === !1 && (this.writable = !1), this.allowHalfOpen = !0, e && e.allowHalfOpen === !1 && (this.allowHalfOpen = !1), this.once("end", rd);
}
function rd() {
  this.allowHalfOpen || this._writableState.ended || D.exports.nextTick(nd, this);
}
function nd(e) {
  e.end();
}
Xe(Me, Ee);
function id(e) {
  this.afterTransform = function(t, r) {
    return od(e, t, r);
  }, this.needTransform = !1, this.transforming = !1, this.writecb = null, this.writechunk = null, this.writeencoding = null;
}
function od(e, t, r) {
  var n = e._transformState;
  n.transforming = !1;
  var i = n.writecb;
  if (!i)
    return e.emit("error", new Error("no writecb in Transform class"));
  n.writechunk = null, n.writecb = null, r != null && e.push(r), i(t);
  var o = e._readableState;
  o.reading = !1, (o.needReadable || o.length < o.highWaterMark) && e._read(o.highWaterMark);
}
function Me(e) {
  if (!(this instanceof Me))
    return new Me(e);
  Ee.call(this, e), this._transformState = new id(this);
  var t = this;
  this._readableState.needReadable = !0, this._readableState.sync = !1, e && (typeof e.transform == "function" && (this._transform = e.transform), typeof e.flush == "function" && (this._flush = e.flush)), this.once("prefinish", function() {
    typeof this._flush == "function" ? this._flush(function(r) {
      ma(t, r);
    }) : ma(t);
  });
}
Me.prototype.push = function(e, t) {
  return this._transformState.needTransform = !1, Ee.prototype.push.call(this, e, t);
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
function ma(e, t) {
  if (t)
    return e.emit("error", t);
  var r = e._writableState, n = e._transformState;
  if (r.length)
    throw new Error("Calling transform done when ws.length != 0");
  if (n.transforming)
    throw new Error("Calling transform done when still transforming");
  return e.push(null);
}
Xe(At, Me);
function At(e) {
  if (!(this instanceof At))
    return new At(e);
  Me.call(this, e);
}
At.prototype._transform = function(e, t, r) {
  r(null, e);
};
Xe(ke, Ae.exports);
ke.Readable = J;
ke.Writable = ae;
ke.Duplex = Ee;
ke.Transform = Me;
ke.PassThrough = At;
ke.Stream = ke;
function ke() {
  Ae.exports.call(this);
}
ke.prototype.pipe = function(e, t) {
  var r = this;
  function n(h) {
    e.writable && e.write(h) === !1 && r.pause && r.pause();
  }
  r.on("data", n);
  function i() {
    r.readable && r.resume && r.resume();
  }
  e.on("drain", i), !e._isStdio && (!t || t.end !== !1) && (r.on("end", a), r.on("close", u));
  var o = !1;
  function a() {
    o || (o = !0, e.end());
  }
  function u() {
    o || (o = !0, typeof e.destroy == "function" && e.destroy());
  }
  function s(h) {
    if (f(), Ae.exports.listenerCount(this, "error") === 0)
      throw h;
  }
  r.on("error", s), e.on("error", s);
  function f() {
    r.removeListener("data", n), e.removeListener("drain", i), r.removeListener("end", a), r.removeListener("close", u), r.removeListener("error", s), e.removeListener("error", s), r.removeListener("end", f), r.removeListener("close", f), e.removeListener("close", f);
  }
  return r.on("end", f), r.on("close", f), e.on("close", f), e.emit("pipe", r), e;
};
const ad = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ke,
  Readable: J,
  Writable: ae,
  Duplex: Ee,
  Transform: Me,
  PassThrough: At,
  Stream: ke
}, Symbol.toStringTag, { value: "Module" })), sd = /* @__PURE__ */ mi(ad);
var Qs = me.exports.Buffer, Js = sd.Transform, ud = Jr.StringDecoder, fd = ie.exports;
function Be(e) {
  Js.call(this), this.hashMode = typeof e == "string", this.hashMode ? this[e] = this._finalOrDigest : this.final = this._finalOrDigest, this._final && (this.__final = this._final, this._final = null), this._decoder = null, this._encoding = null;
}
fd(Be, Js);
Be.prototype.update = function(e, t, r) {
  typeof e == "string" && (e = Qs.from(e, t));
  var n = this._update(e);
  return this.hashMode ? this : (r && (n = this._toString(n, r)), n);
};
Be.prototype.setAutoPadding = function() {
};
Be.prototype.getAuthTag = function() {
  throw new Error("trying to get auth tag in unsupported state");
};
Be.prototype.setAuthTag = function() {
  throw new Error("trying to set auth tag in unsupported state");
};
Be.prototype.setAAD = function() {
  throw new Error("trying to set aad in unsupported state");
};
Be.prototype._transform = function(e, t, r) {
  var n;
  try {
    this.hashMode ? this._update(e) : this.push(this._update(e));
  } catch (i) {
    n = i;
  } finally {
    r(n);
  }
};
Be.prototype._flush = function(e) {
  var t;
  try {
    this.push(this.__final());
  } catch (r) {
    t = r;
  }
  e(t);
};
Be.prototype._finalOrDigest = function(e) {
  var t = this.__final() || Qs.alloc(0);
  return e && (t = this._toString(t, e, !0)), t;
};
Be.prototype._toString = function(e, t, r) {
  if (this._decoder || (this._decoder = new ud(t), this._encoding = t), this._encoding !== t)
    throw new Error("can't switch encodings");
  var n = this._decoder.write(e);
  return r && (n += this._decoder.end()), n;
};
var ld = Be, cd = ie.exports, hd = kc, dd = Pc, pd = qs.exports, eu = ld;
function mn(e) {
  eu.call(this, "digest"), this._hash = e;
}
cd(mn, eu);
mn.prototype._update = function(e) {
  this._hash.update(e);
};
mn.prototype._final = function() {
  return this._hash.digest();
};
var _d = function(t) {
  return t = t.toLowerCase(), t === "md5" ? new hd() : t === "rmd160" || t === "ripemd160" ? new dd() : new mn(pd(t));
};
function vd(e) {
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
  let t = _d("sha256").update(E.from(vd(e))).digest();
  return E.from(t).toString("hex");
}
function yd(e) {
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
function tu(e) {
  return gi.verify(e.sig, e.id, e.pubkey);
}
async function gd(e, t) {
  return E.from(
    await gi.sign(Di(e), t)
  ).toString("hex");
}
function bd(e, t) {
  if (e.ids && e.ids.indexOf(t.id) === -1 || e.kinds && e.kinds.indexOf(t.kind) === -1 || e.authors && e.authors.indexOf(t.pubkey) === -1)
    return !1;
  for (let r in e)
    if (r[0] === "#" && e[r] && !t.tags.find(
      ([n, i]) => n === r.slice(1) && e[r].indexOf(i) !== -1
    ))
      return !1;
  return !(e.since && t.created_at < e.since || e.until && t.created_at >= e.until);
}
function wd(e, t) {
  for (let r = 0; r < e.length; r++)
    if (bd(e[r], t))
      return !0;
  return !1;
}
function pi(e) {
  let [t, ...r] = e.trim().split("?");
  return t.slice(0, 4) === "http" && (t = "ws" + t.slice(4)), t.slice(0, 2) !== "ws" && (t = "wss://" + t), t.length && t[t.length - 1] === "/" && (t = t.slice(0, -1)), [t, ...r].join("?");
}
function xd(e, t = () => {
}, r = () => {
}) {
  e = pi(e);
  var n, i, o, a, u = {}, s = {};
  let f = 1, h = 1;
  function l() {
    o = new Promise((m) => {
      i = m;
    });
  }
  var c = {}, d = {};
  function p() {
    n = new WebSocket(e), n.onopen = () => {
      if (console.log("connected to", e), i(), a) {
        a = !1;
        for (let m in u) {
          let x = u[m], A = c[m], T = d[m];
          g({ eventCb: A, filter: x }, m, T);
        }
      }
    }, n.onerror = (m) => {
      console.log("error connecting to relay", e), r(m);
    }, n.onclose = () => {
      l(), f++, h += f ** 3, h > 14400 && (h = 14400), console.log(
        `relay ${e} connection closed. reconnecting in ${h} seconds.`
      ), setTimeout(async () => {
        try {
          p();
        } catch {
        }
      }, h * 1e3), a = !0;
    }, n.onmessage = async (m) => {
      var x;
      try {
        x = JSON.parse(m.data);
      } catch {
        x = m.data;
      }
      if (x.length >= 1)
        switch (x[0]) {
          case "NOTICE":
            if (x.length != 2)
              return;
            console.log(`message from relay ${e}: ${x[1]}`), t(x[1]);
            return;
          case "EOSE":
            if (x.length != 2)
              return;
            console.log(`Channel ${x[1]}: End-of-stored-events`), d[x[1]] && d[x[1]]();
            return;
          case "EVENT":
            if (x.length != 3)
              return;
            let A = x[1], T = x[2];
            yd(T) && (s[A] || tu(T)) && c[A] && wd(u[A], T) && c[A](T);
            return;
        }
    };
  }
  l();
  try {
    p();
  } catch {
  }
  async function _(m) {
    let x = JSON.stringify(m);
    await o, n.send(x);
  }
  const g = ({ cb: m, filter: x, beforeSend: A, skipVerification: T }, k = Math.random().toString().slice(2), j) => {
    var P = [];
    Array.isArray(x) ? P = x : P.push(x), A && (P = A({ filter: x, relay: e, channel: k }).filter), _(["REQ", k, ...P]), c[k] = m, d[k] = j, u[k] = P, s[k] = T;
    const B = m, I = P, V = A;
    return {
      sub: ({
        cb: N = B,
        filter: ye = I,
        beforeSend: $ = V
      }) => g({ cb: N, filter: ye, beforeSend: $, skipVerification: T }, k),
      unsub: () => {
        delete u[k], delete c[k], delete d[k], delete s[k], _(["CLOSE", k]);
      }
    };
  };
  return {
    url: e,
    sub: g,
    async publish(m, x) {
      try {
        if (await _(["EVENT", m]), x) {
          x(0);
          let { unsub: A } = g(
            {
              cb: () => {
                x(1), A(), clearTimeout(T);
              },
              filter: { ids: [m.id] }
            },
            `monitor-${m.id.slice(0, 5)}`
          ), T = setTimeout(A, 5e3);
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
function md() {
  var e, t;
  const r = {
    randomChoice: null,
    wait: !1
  }, n = {}, i = [];
  function o(s, f) {
    for (let h = 0; h < i.length; h++) {
      let { relay: l } = n[f];
      i[h](s, l);
    }
  }
  const a = {};
  return {
    sub: ({ cb: s, filter: f, beforeSend: h }, l, c) => {
      l || (l = Math.random().toString().slice(2));
      const d = Object.fromEntries(
        Object.values(n).filter(({ policy: k }) => k.read).map(({ relay: k }) => [
          k.url,
          k.sub(
            { cb: (j) => s(j, k.url), filter: f, beforeSend: h },
            l,
            c
          )
        ])
      ), p = s, _ = f, g = h, m = () => {
        Object.values(d).forEach((k) => k.unsub()), delete a[l];
      }, x = ({
        cb: k = p,
        filter: j = _,
        beforeSend: P = g
      }) => (Object.entries(d).map(([B, I]) => [
        B,
        I.sub({ cb: (V) => k(V, B), filter: j, beforeSend: P }, l)
      ]), a[l]), A = (k) => (d[k.url] = k.sub(
        { cb: (j) => s(j, k.url), filter: f, beforeSend: h },
        l,
        () => c(k.url)
      ), a[l]), T = (k) => (k in d && (d[k].unsub(), Object.keys(d).length === 0 && m()), a[l]);
      return a[l] = {
        sub: x,
        unsub: m,
        addRelay: A,
        removeRelay: T
      }, a[l];
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
      let h = pi(s);
      if (h in n)
        return;
      let l = xd(s, (c) => {
        o(c, h);
      });
      return n[h] = { relay: l, policy: f }, f.read && Object.values(a).forEach(
        (c) => c.addRelay(l)
      ), l;
    },
    removeRelay(s) {
      let f = pi(s), h = n[f];
      if (!h)
        return;
      let { relay: l } = h;
      Object.values(a).forEach(
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
          s.sig = await gd(s, e);
        else if (t)
          if (s.sig = await t(s), s.sig) {
            if (!await tu(s))
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
            if (await new Promise(async (_, g) => {
              try {
                await p.publish(s, (m) => {
                  f && f(m, p.url), _();
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
          let p = f ? (_) => f(_, d.url) : null;
          d.publish(s, p);
        });
      return s;
    }
  };
}
function Ed(e) {
  let t, r, n, i = e[1]?.pubkey + "", o, a, u, s, f, h, l, c, d, p, _;
  return {
    c() {
      t = Y("form"), r = Y("p"), n = ce("Logged in with pubkey: "), o = ce(i), a = he(), u = Y("label"), u.textContent = "Private Key", s = he(), f = Y("input"), h = he(), l = Y("button"), l.textContent = "Login", c = he(), d = Y("button"), d.textContent = "Generate", this.c = be, ge(u, "for", "privkey"), ge(f, "id", "privkey"), ge(f, "type", "text");
    },
    m(g, m) {
      de(g, t, m), q(t, r), q(r, n), q(r, o), q(t, a), q(t, u), q(t, s), q(t, f), Wr(f, e[0]), q(t, h), q(t, l), q(t, c), q(t, d), p || (_ = [
        tt(f, "input", e[4]),
        tt(l, "click", e[2]),
        tt(d, "click", e[5]),
        tt(t, "submit", Sa(e[3]))
      ], p = !0);
    },
    p(g, [m]) {
      m & 2 && i !== (i = g[1]?.pubkey + "") && et(o, i), m & 1 && f.value !== g[0] && Wr(f, g[0]);
    },
    i: be,
    o: be,
    d(g) {
      g && ve(t), p = !1, st(_);
    }
  };
}
function Sd(e, t, r) {
  let n;
  Ea(e, Et, (f) => r(1, n = f));
  let i = "";
  const o = () => {
    !i || ou(Et, n = { privkey: i, pubkey: mf(i) }, n);
  };
  function a(f) {
    hu.call(this, e, f);
  }
  function u() {
    i = this.value, r(0, i);
  }
  return [
    i,
    n,
    o,
    a,
    u,
    () => r(0, i = xf())
  ];
}
class Rd extends yi {
  constructor(t) {
    super(), Oa(
      this,
      {
        target: this.shadowRoot,
        props: Ra(this.attributes),
        customElement: !0
      },
      Sd,
      Ed,
      vi,
      {},
      null
    ), t && t.target && de(t.target, this, t.anchor);
  }
}
customElements.define("nostr-opinion-login", Rd);
class Od {
  trustedAuthors;
  onlyTrusted = !1;
  nostr;
  onReady;
  onReadyResolve;
  constructor() {
    this.nostr = md(), Et.subscribe((t) => {
      this.nostr.setPrivateKey(t?.privkey);
    }), this.onReady = new Promise((t) => {
      this.onReadyResolve = t;
    });
  }
  setRelay(t = "wss://relay.nostr.info") {
    this.nostr.addRelay(t, { read: !0, write: !0 });
  }
  setReady() {
    this.onReadyResolve();
  }
}
const Ad = new Od(), Id = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  expertOpinions: Ad
}, Symbol.toStringTag, { value: "Module" }));
export {
  Ad as expertOpinions
};
