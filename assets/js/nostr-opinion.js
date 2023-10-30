var Au = Object.defineProperty;
var ku = (t, e, r) => e in t ? Au(t, e, { enumerable: !0, configurable: !0, writable: !0, value: r }) : t[e] = r;
var Ht = (t, e, r) => (ku(t, typeof e != "symbol" ? e + "" : e, r), r);
function K() {
}
function Ti(t) {
  return t();
}
function so() {
  return /* @__PURE__ */ Object.create(null);
}
function ze(t) {
  t.forEach(Ti);
}
function gi(t) {
  return typeof t == "function";
}
function pt(t, e) {
  return t != t ? e == e : t !== e || t && typeof t == "object" || typeof t == "function";
}
function Mu(t) {
  return Object.keys(t).length === 0;
}
function Iu(t, ...e) {
  if (t == null)
    return K;
  const r = t.subscribe(...e);
  return r.unsubscribe ? () => r.unsubscribe() : r;
}
function Li(t, e, r) {
  t.$$.on_destroy.push(Iu(e, r));
}
function bi(t, e, r) {
  return t.set(r), e;
}
function M(t, e) {
  t.appendChild(e);
}
function $(t, e, r) {
  t.insertBefore(e, r || null);
}
function z(t) {
  t.parentNode && t.parentNode.removeChild(t);
}
function Tu(t, e) {
  for (let r = 0; r < t.length; r += 1)
    t[r] && t[r].d(e);
}
function j(t) {
  return document.createElement(t);
}
function Ie(t) {
  return document.createElementNS("http://www.w3.org/2000/svg", t);
}
function ve(t) {
  return document.createTextNode(t);
}
function Y() {
  return ve(" ");
}
function Bi() {
  return ve("");
}
function Oe(t, e, r, n) {
  return t.addEventListener(e, r, n), () => t.removeEventListener(e, r, n);
}
function Pi(t) {
  return function(e) {
    return e.preventDefault(), t.call(this, e);
  };
}
function C(t, e, r) {
  r == null ? t.removeAttribute(e) : t.getAttribute(e) !== r && t.setAttribute(e, r);
}
function Lu(t) {
  return Array.from(t.childNodes);
}
function Qe(t, e) {
  e = "" + e, t.wholeText !== e && (t.data = e);
}
function Ft(t, e) {
  t.value = e == null ? "" : e;
}
function uo(t, e) {
  for (let r = 0; r < t.options.length; r += 1) {
    const n = t.options[r];
    if (n.__value === e) {
      n.selected = !0;
      return;
    }
  }
  t.selectedIndex = -1;
}
function Bu(t) {
  const e = t.querySelector(":checked") || t.options[0];
  return e && e.__value;
}
function zr(t, e, r) {
  t.classList[r ? "add" : "remove"](e);
}
function Ot(t) {
  const e = {};
  for (const r of t)
    e[r.name] = r.value;
  return e;
}
let Mr;
function Rr(t) {
  Mr = t;
}
function Pu() {
  if (!Mr)
    throw new Error("Function called outside component initialization");
  return Mr;
}
function Va(t) {
  Pu().$$.on_mount.push(t);
}
function Ya(t, e) {
  const r = t.$$.callbacks[e.type];
  r && r.slice().forEach((n) => n.call(this, e));
}
const Sr = [], fo = [], tn = [], lo = [], Hu = Promise.resolve();
let wi = !1;
function qu() {
  wi || (wi = !0, Hu.then(fn));
}
function un(t) {
  tn.push(t);
}
const $n = /* @__PURE__ */ new Set();
let Vr = 0;
function fn() {
  const t = Mr;
  do {
    for (; Vr < Sr.length; ) {
      const e = Sr[Vr];
      Vr++, Rr(e), Du(e.$$);
    }
    for (Rr(null), Sr.length = 0, Vr = 0; fo.length; )
      fo.pop()();
    for (let e = 0; e < tn.length; e += 1) {
      const r = tn[e];
      $n.has(r) || ($n.add(r), r());
    }
    tn.length = 0;
  } while (Sr.length);
  for (; lo.length; )
    lo.pop()();
  wi = !1, $n.clear(), Rr(t);
}
function Du(t) {
  if (t.fragment !== null) {
    t.update(), ze(t.before_update);
    const e = t.dirty;
    t.dirty = [-1], t.fragment && t.fragment.p(t.ctx, e), t.after_update.forEach(un);
  }
}
const rn = /* @__PURE__ */ new Set();
let bt;
function Et() {
  bt = {
    r: 0,
    c: [],
    p: bt
  };
}
function St() {
  bt.r || ze(bt.c), bt = bt.p;
}
function se(t, e) {
  t && t.i && (rn.delete(t), t.i(e));
}
function he(t, e, r, n) {
  if (t && t.o) {
    if (rn.has(t))
      return;
    rn.add(t), bt.c.push(() => {
      rn.delete(t), n && (r && t.d(1), n());
    }), t.o(e);
  } else
    n && n();
}
function at(t) {
  t && t.c();
}
function Je(t, e, r, n) {
  const { fragment: i, after_update: a } = t.$$;
  i && i.m(e, r), n || un(() => {
    const o = t.$$.on_mount.map(Ti).filter(gi);
    t.$$.on_destroy ? t.$$.on_destroy.push(...o) : ze(o), t.$$.on_mount = [];
  }), a.forEach(un);
}
function et(t, e) {
  const r = t.$$;
  r.fragment !== null && (ze(r.on_destroy), r.fragment && r.fragment.d(e), r.on_destroy = r.fragment = null, r.ctx = []);
}
function ju(t, e) {
  t.$$.dirty[0] === -1 && (Sr.push(t), qu(), t.$$.dirty.fill(0)), t.$$.dirty[e / 31 | 0] |= 1 << e % 31;
}
function At(t, e, r, n, i, a, o, u = [-1]) {
  const s = Mr;
  Rr(t);
  const f = t.$$ = {
    fragment: null,
    ctx: [],
    props: a,
    update: K,
    not_equal: i,
    bound: so(),
    on_mount: [],
    on_destroy: [],
    on_disconnect: [],
    before_update: [],
    after_update: [],
    context: new Map(e.context || (s ? s.$$.context : [])),
    callbacks: so(),
    dirty: u,
    skip_bound: !1,
    root: e.target || s.$$.root
  };
  o && o(f.root);
  let h = !1;
  if (f.ctx = r ? r(t, e.props || {}, (l, c, ...d) => {
    const p = d.length ? d[0] : c;
    return f.ctx && i(f.ctx[l], f.ctx[l] = p) && (!f.skip_bound && f.bound[l] && f.bound[l](p), h && ju(t, l)), c;
  }) : [], f.update(), h = !0, ze(f.before_update), f.fragment = n ? n(f.ctx) : !1, e.target) {
    if (e.hydrate) {
      const l = Lu(e.target);
      f.fragment && f.fragment.l(l), l.forEach(z);
    } else
      f.fragment && f.fragment.c();
    e.intro && se(t.$$.fragment), Je(t, e.target, e.anchor, e.customElement), fn();
  }
  Rr(s);
}
let _t;
typeof HTMLElement == "function" && (_t = class extends HTMLElement {
  constructor() {
    super(), this.attachShadow({ mode: "open" });
  }
  connectedCallback() {
    const { on_mount: t } = this.$$;
    this.$$.on_disconnect = t.map(Ti).filter(gi);
    for (const e in this.$$.slotted)
      this.appendChild(this.$$.slotted[e]);
  }
  attributeChangedCallback(t, e, r) {
    this[t] = r;
  }
  disconnectedCallback() {
    ze(this.$$.on_disconnect);
  }
  $destroy() {
    et(this, 1), this.$destroy = K;
  }
  $on(t, e) {
    if (!gi(e))
      return K;
    const r = this.$$.callbacks[t] || (this.$$.callbacks[t] = []);
    return r.push(e), () => {
      const n = r.indexOf(e);
      n !== -1 && r.splice(n, 1);
    };
  }
  $set(t) {
    this.$$set && !Mu(t) && (this.$$.skip_bound = !0, this.$$set(t), this.$$.skip_bound = !1);
  }
});
const qt = [];
function Nu(t, e = K) {
  let r;
  const n = /* @__PURE__ */ new Set();
  function i(u) {
    if (pt(t, u) && (t = u, r)) {
      const s = !qt.length;
      for (const f of n)
        f[1](), qt.push(f, t);
      if (s) {
        for (let f = 0; f < qt.length; f += 2)
          qt[f][0](qt[f + 1]);
        qt.length = 0;
      }
    }
  }
  function a(u) {
    i(u(t));
  }
  function o(u, s = K) {
    const f = [u, s];
    return n.add(f), n.size === 1 && (r = e(i) || K), u(t), () => {
      n.delete(f), n.size === 0 && (r(), r = null);
    };
  }
  return { set: i, update: a, subscribe: o };
}
const tt = Nu(null);
tt.subscribe((t) => {
  !t || localStorage.setItem("activeProfile", JSON.stringify(t));
});
tt.set(JSON.parse(localStorage.getItem("activeProfile")));
function Fu(t) {
  let e, r, n;
  return {
    c() {
      e = Ie("svg"), r = Ie("path"), n = Ie("path"), this.c = K, C(r, "fill-rule", "evenodd"), C(r, "clip-rule", "evenodd"), C(r, "d", "M24 9.77734C24 8.86867 23.3874 8.0742 22.5087 7.8431L16.0087 6.13376C15.6752 6.04607 15.3248 6.04607 14.9913 6.13376L8.49134 7.8431C7.61255 8.0742 7 8.86867 7 9.77734V16V16C7.00002 20.8032 10.7627 24.7276 15.5013 24.9864C20.2387 24.7263 24 20.8025 24 16.0001V16V9.77734Z"), C(r, "fill", "#4DA84D"), C(n, "d", "M12 16.2553L14.8661 19L19 12"), C(n, "stroke", "white"), C(n, "stroke-width", "1.5"), C(n, "stroke-linecap", "round"), C(n, "stroke-linejoin", "round"), C(e, "width", "30"), C(e, "height", "30"), C(e, "viewBox", "0 0 30 30"), C(e, "fill", "none"), C(e, "xmlns", "http://www.w3.org/2000/svg");
    },
    m(i, a) {
      $(i, e, a), M(e, r), M(e, n);
    },
    p: K,
    i: K,
    o: K,
    d(i) {
      i && z(e);
    }
  };
}
class Hi extends _t {
  constructor(e) {
    super(), At(
      this,
      {
        target: this.shadowRoot,
        props: Ot(this.attributes),
        customElement: !0
      },
      null,
      Fu,
      pt,
      {},
      null
    ), e && e.target && $(e.target, this, e.anchor);
  }
}
customElements.define("nostr-opinion-positive", Hi);
function $u(t) {
  let e, r, n, i;
  return {
    c() {
      e = Ie("svg"), r = Ie("path"), n = Ie("path"), i = Ie("path"), this.c = K, C(r, "fill-rule", "evenodd"), C(r, "clip-rule", "evenodd"), C(r, "d", "M24 9.77734C24 8.86867 23.3874 8.0742 22.5087 7.8431L16.0087 6.13376C15.6752 6.04607 15.3248 6.04607 14.9913 6.13376L8.49134 7.8431C7.61255 8.0742 7 8.86867 7 9.77734V16V16C7.00002 20.8032 10.7627 24.7276 15.5013 24.9864C20.2387 24.7263 24 20.8025 24 16.0001V16V9.77734Z"), C(r, "fill", "#42BDD8"), C(n, "d", "M12.8661 17H18.5"), C(n, "stroke", "white"), C(n, "stroke-width", "1.5"), C(n, "stroke-linecap", "round"), C(n, "stroke-linejoin", "round"), C(i, "d", "M12.8661 13H18.5"), C(i, "stroke", "white"), C(i, "stroke-width", "1.5"), C(i, "stroke-linecap", "round"), C(i, "stroke-linejoin", "round"), C(e, "width", "30"), C(e, "height", "30"), C(e, "viewBox", "0 0 30 30"), C(e, "fill", "none"), C(e, "xmlns", "http://www.w3.org/2000/svg");
    },
    m(a, o) {
      $(a, e, o), M(e, r), M(e, n), M(e, i);
    },
    p: K,
    i: K,
    o: K,
    d(a) {
      a && z(e);
    }
  };
}
class qi extends _t {
  constructor(e) {
    super(), At(
      this,
      {
        target: this.shadowRoot,
        props: Ot(this.attributes),
        customElement: !0
      },
      null,
      $u,
      pt,
      {},
      null
    ), e && e.target && $(e.target, this, e.anchor);
  }
}
customElements.define("nostr-opinion-neutral", qi);
function Uu(t) {
  let e, r, n, i;
  return {
    c() {
      e = Ie("svg"), r = Ie("path"), n = Ie("path"), i = Ie("path"), this.c = K, C(r, "fill-rule", "evenodd"), C(r, "clip-rule", "evenodd"), C(r, "d", "M24 9.77734C24 8.86867 23.3874 8.0742 22.5087 7.8431L16.0087 6.13376C15.6752 6.04607 15.3248 6.04607 14.9913 6.13376L8.49134 7.8431C7.61255 8.0742 7 8.86867 7 9.77734V16V16C7.00002 20.8032 10.7627 24.7276 15.5013 24.9864C20.2387 24.7263 24 20.8025 24 16.0001V16V9.77734Z"), C(r, "fill", "#ED1B24"), C(n, "d", "M12 11.5L19 18.5"), C(n, "stroke", "white"), C(n, "stroke-width", "1.3125"), C(n, "stroke-linecap", "round"), C(i, "d", "M19 11.5L12 18.5"), C(i, "stroke", "white"), C(i, "stroke-width", "1.3125"), C(i, "stroke-linecap", "round"), C(e, "width", "30"), C(e, "height", "30"), C(e, "viewBox", "0 0 30 30"), C(e, "fill", "none"), C(e, "xmlns", "http://www.w3.org/2000/svg");
    },
    m(a, o) {
      $(a, e, o), M(e, r), M(e, n), M(e, i);
    },
    p: K,
    i: K,
    o: K,
    d(a) {
      a && z(e);
    }
  };
}
class Di extends _t {
  constructor(e) {
    super(), At(
      this,
      {
        target: this.shadowRoot,
        props: Ot(this.attributes),
        customElement: !0
      },
      null,
      Uu,
      pt,
      {},
      null
    ), e && e.target && $(e.target, this, e.anchor);
  }
}
customElements.define("nostr-opinion-negative", Di);
function Wu(t) {
  let e, r, n;
  return {
    c() {
      e = Ie("svg"), r = Ie("rect"), n = Ie("path"), this.c = K, C(r, "y", "0.5"), C(r, "width", "106"), C(r, "height", "17"), C(r, "rx", "3"), C(r, "fill", "#F7931A"), C(n, "d", "M9.1985 10.07L8.3075 7.703C8.2355 7.52 8.162 7.2875 8.087 7.0055C8.054 7.1465 8.018 7.277 7.979 7.397C7.94 7.514 7.904 7.6175 7.871 7.7075L6.98 10.07H9.1985ZM11.192 12.5H10.3775C10.2845 12.5 10.2095 12.4775 10.1525 12.4325C10.0955 12.3845 10.052 12.326 10.022 12.257L9.482 10.826H6.692L6.152 12.257C6.128 12.317 6.086 12.3725 6.026 12.4235C5.966 12.4745 5.891 12.5 5.801 12.5H4.9865L7.556 6.02H8.6225L11.192 12.5ZM13.9642 9.323C14.1982 9.323 14.4037 9.293 14.5807 9.233C14.7607 9.173 14.9092 9.089 15.0262 8.981C15.1462 8.87 15.2362 8.7365 15.2962 8.5805C15.3562 8.4245 15.3862 8.2505 15.3862 8.0585C15.3862 7.8695 15.3562 7.7 15.2962 7.55C15.2392 7.4 15.1522 7.2725 15.0352 7.1675C14.9182 7.0625 14.7697 6.983 14.5897 6.929C14.4127 6.872 14.2042 6.8435 13.9642 6.8435H13.0012V9.323H13.9642ZM13.9642 6.02C14.3872 6.02 14.7532 6.0695 15.0622 6.1685C15.3742 6.2675 15.6307 6.407 15.8317 6.587C16.0357 6.764 16.1872 6.9785 16.2862 7.2305C16.3852 7.4795 16.4347 7.7555 16.4347 8.0585C16.4347 8.3675 16.3822 8.651 16.2772 8.909C16.1722 9.164 16.0162 9.3845 15.8092 9.5705C15.6022 9.7535 15.3442 9.8975 15.0352 10.0025C14.7292 10.1045 14.3722 10.1555 13.9642 10.1555H13.0012V12.5H11.9482V6.02H13.9642ZM19.4574 9.323C19.6914 9.323 19.8969 9.293 20.0739 9.233C20.2539 9.173 20.4024 9.089 20.5194 8.981C20.6394 8.87 20.7294 8.7365 20.7894 8.5805C20.8494 8.4245 20.8794 8.2505 20.8794 8.0585C20.8794 7.8695 20.8494 7.7 20.7894 7.55C20.7324 7.4 20.6454 7.2725 20.5284 7.1675C20.4114 7.0625 20.2629 6.983 20.0829 6.929C19.9059 6.872 19.6974 6.8435 19.4574 6.8435H18.4944V9.323H19.4574ZM19.4574 6.02C19.8804 6.02 20.2464 6.0695 20.5554 6.1685C20.8674 6.2675 21.1239 6.407 21.3249 6.587C21.5289 6.764 21.6804 6.9785 21.7794 7.2305C21.8784 7.4795 21.9279 7.7555 21.9279 8.0585C21.9279 8.3675 21.8754 8.651 21.7704 8.909C21.6654 9.164 21.5094 9.3845 21.3024 9.5705C21.0954 9.7535 20.8374 9.8975 20.5284 10.0025C20.2224 10.1045 19.8654 10.1555 19.4574 10.1555H18.4944V12.5H17.4414V6.02H19.4574ZM24.8155 9.125C25.0555 9.125 25.2655 9.0965 25.4455 9.0395C25.6255 8.9795 25.7755 8.897 25.8955 8.792C26.0155 8.687 26.1055 8.5625 26.1655 8.4185C26.2255 8.2715 26.2555 8.1095 26.2555 7.9325C26.2555 7.5785 26.1385 7.3085 25.9045 7.1225C25.6705 6.9365 25.3165 6.8435 24.8425 6.8435H23.9875V9.125H24.8155ZM27.8665 12.5H26.926C26.74 12.5 26.605 12.428 26.521 12.284L25.009 10.1015C24.958 10.0265 24.9025 9.9725 24.8425 9.9395C24.7825 9.9065 24.6925 9.89 24.5725 9.89H23.9875V12.5H22.9345V6.02H24.8425C25.2685 6.02 25.6345 6.0635 25.9405 6.1505C26.2495 6.2375 26.503 6.362 26.701 6.524C26.899 6.683 27.0445 6.875 27.1375 7.1C27.2335 7.325 27.2815 7.5755 27.2815 7.8515C27.2815 8.0765 27.247 8.2865 27.178 8.4815C27.112 8.6765 27.0145 8.8535 26.8855 9.0125C26.7595 9.1715 26.6035 9.3095 26.4175 9.4265C26.2315 9.5435 26.02 9.635 25.783 9.701C25.912 9.779 26.023 9.8885 26.116 10.0295L27.8665 12.5ZM34.6568 9.26C34.6568 9.74 34.5788 10.1825 34.4228 10.5875C34.2668 10.9925 34.0463 11.342 33.7613 11.636C33.4793 11.927 33.1388 12.155 32.7398 12.32C32.3438 12.485 31.9028 12.5675 31.4168 12.5675C30.9338 12.5675 30.4928 12.485 30.0938 12.32C29.6978 12.155 29.3573 11.927 29.0723 11.636C28.7873 11.342 28.5668 10.9925 28.4108 10.5875C28.2548 10.1825 28.1768 9.74 28.1768 9.26C28.1768 8.78 28.2548 8.3375 28.4108 7.9325C28.5668 7.5275 28.7873 7.178 29.0723 6.884C29.3573 6.59 29.6978 6.3605 30.0938 6.1955C30.4928 6.0305 30.9338 5.948 31.4168 5.948C31.9028 5.948 32.3438 6.0305 32.7398 6.1955C33.1388 6.3605 33.4793 6.59 33.7613 6.884C34.0463 7.178 34.2668 7.5275 34.4228 7.9325C34.5788 8.3375 34.6568 8.78 34.6568 9.26ZM33.5813 9.26C33.5813 8.888 33.5303 8.5535 33.4283 8.2565C33.3293 7.9595 33.1853 7.7075 32.9963 7.5005C32.8103 7.2935 32.5838 7.1345 32.3168 7.0235C32.0498 6.9125 31.7498 6.857 31.4168 6.857C31.0868 6.857 30.7883 6.9125 30.5213 7.0235C30.2543 7.1345 30.0263 7.2935 29.8373 7.5005C29.6483 7.7075 29.5028 7.9595 29.4008 8.2565C29.2988 8.5535 29.2478 8.888 29.2478 9.26C29.2478 9.635 29.2988 9.971 29.4008 10.268C29.5028 10.565 29.6483 10.817 29.8373 11.024C30.0263 11.228 30.2543 11.3855 30.5213 11.4965C30.7883 11.6045 31.0868 11.6585 31.4168 11.6585C31.7498 11.6585 32.0498 11.6045 32.3168 11.4965C32.5838 11.3855 32.8103 11.228 32.9963 11.024C33.1853 10.817 33.3293 10.565 33.4283 10.268C33.5303 9.971 33.5813 9.635 33.5813 9.26ZM41.0309 6.02L38.4029 12.5H37.4534L34.8254 6.02H35.6669C35.7599 6.02 35.8349 6.044 35.8919 6.092C35.9489 6.137 35.9924 6.194 36.0224 6.263L37.6919 10.4885C37.7819 10.7255 37.8644 10.9985 37.9394 11.3075C37.9724 11.1545 38.0069 11.009 38.0429 10.871C38.0819 10.733 38.1239 10.6055 38.1689 10.4885L39.8339 6.263C39.8579 6.203 39.8999 6.1475 39.9599 6.0965C40.0199 6.0455 40.0949 6.02 40.1849 6.02H41.0309ZM45.8326 11.6495L45.8281 12.5H41.7871V6.02H45.8281V6.8705H42.8446V8.8235H45.2296V9.647H42.8446V11.6495H45.8326ZM52.6606 9.26C52.6606 9.74 52.5826 10.1795 52.4266 10.5785C52.2706 10.9745 52.0501 11.315 51.7651 11.6C51.4831 11.885 51.1426 12.107 50.7436 12.266C50.3476 12.422 49.9066 12.5 49.4206 12.5H46.9726V6.02H49.4206C49.9066 6.02 50.3476 6.0995 50.7436 6.2585C51.1426 6.4145 51.4831 6.635 51.7651 6.92C52.0501 7.205 52.2706 7.547 52.4266 7.946C52.5826 8.342 52.6606 8.78 52.6606 9.26ZM51.5851 9.26C51.5851 8.888 51.5341 8.5535 51.4321 8.2565C51.3331 7.9595 51.1891 7.709 51.0001 7.505C50.8141 7.301 50.5876 7.145 50.3206 7.037C50.0536 6.926 49.7536 6.8705 49.4206 6.8705H48.0301V11.6495H49.4206C49.7536 11.6495 50.0536 11.5955 50.3206 11.4875C50.5876 11.3795 50.8141 11.2235 51.0001 11.0195C51.1891 10.8125 51.3331 10.562 51.4321 10.268C51.5341 9.971 51.5851 9.635 51.5851 9.26ZM57.9415 9.125C58.1815 9.125 58.3915 9.0965 58.5715 9.0395C58.7515 8.9795 58.9015 8.897 59.0215 8.792C59.1415 8.687 59.2315 8.5625 59.2915 8.4185C59.3515 8.2715 59.3815 8.1095 59.3815 7.9325C59.3815 7.5785 59.2645 7.3085 59.0305 7.1225C58.7965 6.9365 58.4425 6.8435 57.9685 6.8435H57.1135V9.125H57.9415ZM60.9925 12.5H60.052C59.866 12.5 59.731 12.428 59.647 12.284L58.135 10.1015C58.084 10.0265 58.0285 9.9725 57.9685 9.9395C57.9085 9.9065 57.8185 9.89 57.6985 9.89H57.1135V12.5H56.0605V6.02H57.9685C58.3945 6.02 58.7605 6.0635 59.0665 6.1505C59.3755 6.2375 59.629 6.362 59.827 6.524C60.025 6.683 60.1705 6.875 60.2635 7.1C60.3595 7.325 60.4075 7.5755 60.4075 7.8515C60.4075 8.0765 60.373 8.2865 60.304 8.4815C60.238 8.6765 60.1405 8.8535 60.0115 9.0125C59.8855 9.1715 59.7295 9.3095 59.5435 9.4265C59.3575 9.5435 59.146 9.635 58.909 9.701C59.038 9.779 59.149 9.8885 59.242 10.0295L60.9925 12.5ZM65.8189 11.6495L65.8144 12.5H61.7734V6.02H65.8144V6.8705H62.8309V8.8235H65.2159V9.647H62.8309V11.6495H65.8189ZM72.3815 6.02L69.7535 12.5H68.804L66.176 6.02H67.0175C67.1105 6.02 67.1855 6.044 67.2425 6.092C67.2995 6.137 67.343 6.194 67.373 6.263L69.0425 10.4885C69.1325 10.7255 69.215 10.9985 69.29 11.3075C69.323 11.1545 69.3575 11.009 69.3935 10.871C69.4325 10.733 69.4745 10.6055 69.5195 10.4885L71.1845 6.263C71.2085 6.203 71.2505 6.1475 71.3105 6.0965C71.3705 6.0455 71.4455 6.02 71.5355 6.02H72.3815ZM74.1952 12.5H73.1377V6.02H74.1952V12.5ZM79.7759 11.6495L79.7714 12.5H75.7304V6.02H79.7714V6.8705H76.7879V8.8235H79.1729V9.647H76.7879V11.6495H79.7759ZM89.4345 6.02L87.4185 12.5H86.469L84.948 7.847C84.93 7.796 84.912 7.7405 84.894 7.6805C84.879 7.6205 84.864 7.556 84.849 7.487C84.834 7.556 84.8175 7.6205 84.7995 7.6805C84.7845 7.7405 84.768 7.796 84.75 7.847L83.2155 12.5H82.266L80.25 6.02H81.132C81.222 6.02 81.297 6.0425 81.357 6.0875C81.42 6.1295 81.462 6.188 81.483 6.263L82.698 10.4165C82.722 10.5065 82.7445 10.604 82.7655 10.709C82.7865 10.814 82.8075 10.9235 82.8285 11.0375C82.8495 10.9235 82.872 10.814 82.896 10.709C82.923 10.601 82.9515 10.5035 82.9815 10.4165L84.372 6.263C84.393 6.203 84.435 6.1475 84.498 6.0965C84.561 6.0455 84.636 6.02 84.723 6.02H85.029C85.122 6.02 85.197 6.044 85.254 6.092C85.311 6.137 85.3545 6.194 85.3845 6.263L86.7705 10.4165C86.8005 10.5035 86.8275 10.598 86.8515 10.7C86.8785 10.799 86.9025 10.904 86.9235 11.015C86.9445 10.904 86.964 10.799 86.982 10.7C87.003 10.598 87.0255 10.5035 87.0495 10.4165L88.26 6.263C88.278 6.197 88.3185 6.14 88.3815 6.092C88.4475 6.044 88.524 6.02 88.611 6.02H89.4345ZM94.357 11.6495L94.3525 12.5H90.3115V6.02H94.3525V6.8705H91.369V8.8235H93.754V9.647H91.369V11.6495H94.357ZM97.378 9.125C97.618 9.125 97.828 9.0965 98.008 9.0395C98.188 8.9795 98.338 8.897 98.458 8.792C98.578 8.687 98.668 8.5625 98.728 8.4185C98.788 8.2715 98.818 8.1095 98.818 7.9325C98.818 7.5785 98.701 7.3085 98.467 7.1225C98.233 6.9365 97.879 6.8435 97.405 6.8435H96.55V9.125H97.378ZM100.429 12.5H99.4885C99.3025 12.5 99.1675 12.428 99.0835 12.284L97.5715 10.1015C97.5205 10.0265 97.465 9.9725 97.405 9.9395C97.345 9.9065 97.255 9.89 97.135 9.89H96.55V12.5H95.497V6.02H97.405C97.831 6.02 98.197 6.0635 98.503 6.1505C98.812 6.2375 99.0655 6.362 99.2635 6.524C99.4615 6.683 99.607 6.875 99.7 7.1C99.796 7.325 99.844 7.5755 99.844 7.8515C99.844 8.0765 99.8095 8.2865 99.7405 8.4815C99.6745 8.6765 99.577 8.8535 99.448 9.0125C99.322 9.1715 99.166 9.3095 98.98 9.4265C98.794 9.5435 98.5825 9.635 98.3455 9.701C98.4745 9.779 98.5855 9.8885 98.6785 10.0295L100.429 12.5Z"), C(n, "fill", "white"), C(e, "width", "106"), C(e, "height", "18"), C(e, "viewBox", "0 0 106 18"), C(e, "fill", "none"), C(e, "xmlns", "http://www.w3.org/2000/svg");
    },
    m(i, a) {
      $(i, e, a), M(e, r), M(e, n);
    },
    p: K,
    i: K,
    o: K,
    d(i) {
      i && z(e);
    }
  };
}
class Ga extends _t {
  constructor(e) {
    super(), At(
      this,
      {
        target: this.shadowRoot,
        props: Ot(this.attributes),
        customElement: !0
      },
      null,
      Wu,
      pt,
      {},
      null
    ), e && e.target && $(e.target, this, e.anchor);
  }
}
customElements.define("nostr-opinion-approved", Ga);
const zu = {}, Vu = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: zu
}, Symbol.toStringTag, { value: "Module" }));
/*! noble-secp256k1 - MIT License (c) 2019 Paul Miller (paulmillr.com) */
const ee = BigInt(0), ce = BigInt(1), ct = BigInt(2), Cr = BigInt(3), Yu = BigInt(8), fe = Object.freeze({
  a: ee,
  b: BigInt(7),
  P: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),
  n: BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),
  h: ce,
  Gx: BigInt("55066263022277343669578718895168534326250603453777594175500187360389116729240"),
  Gy: BigInt("32670510020758816978083085130507043184471273380659243275938904335757337482424"),
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee")
});
function co(t) {
  const { a: e, b: r } = fe, n = B(t * t), i = B(n * t);
  return B(i + e * t + r);
}
const Yr = fe.a === ee;
class Za extends Error {
  constructor(e) {
    super(e);
  }
}
class ne {
  constructor(e, r, n) {
    this.x = e, this.y = r, this.z = n;
  }
  static fromAffine(e) {
    if (!(e instanceof le))
      throw new TypeError("JacobianPoint#fromAffine: expected Point");
    return new ne(e.x, e.y, ce);
  }
  static toAffineBatch(e) {
    const r = Qu(e.map((n) => n.z));
    return e.map((n, i) => n.toAffine(r[i]));
  }
  static normalizeZ(e) {
    return ne.toAffineBatch(e).map(ne.fromAffine);
  }
  equals(e) {
    if (!(e instanceof ne))
      throw new TypeError("JacobianPoint expected");
    const { x: r, y: n, z: i } = this, { x: a, y: o, z: u } = e, s = B(i * i), f = B(u * u), h = B(r * f), l = B(a * s), c = B(B(n * u) * f), d = B(B(o * i) * s);
    return h === l && c === d;
  }
  negate() {
    return new ne(this.x, B(-this.y), this.z);
  }
  double() {
    const { x: e, y: r, z: n } = this, i = B(e * e), a = B(r * r), o = B(a * a), u = e + a, s = B(ct * (B(u * u) - i - o)), f = B(Cr * i), h = B(f * f), l = B(h - ct * s), c = B(f * (s - l) - Yu * o), d = B(ct * r * n);
    return new ne(l, c, d);
  }
  add(e) {
    if (!(e instanceof ne))
      throw new TypeError("JacobianPoint expected");
    const { x: r, y: n, z: i } = this, { x: a, y: o, z: u } = e;
    if (a === ee || o === ee)
      return this;
    if (r === ee || n === ee)
      return e;
    const s = B(i * i), f = B(u * u), h = B(r * f), l = B(a * s), c = B(B(n * u) * f), d = B(B(o * i) * s), p = B(l - h), _ = B(d - c);
    if (p === ee)
      return _ === ee ? this.double() : ne.ZERO;
    const m = B(p * p), b = B(p * m), w = B(h * m), S = B(_ * _ - b - ct * w), A = B(_ * (w - S) - c * b), T = B(i * u * p);
    return new ne(S, A, T);
  }
  subtract(e) {
    return this.add(e.negate());
  }
  multiplyUnsafe(e) {
    const r = ne.ZERO;
    if (typeof e == "bigint" && e === ee)
      return r;
    let n = _o(e);
    if (n === ce)
      return this;
    if (!Yr) {
      let l = r, c = this;
      for (; n > ee; )
        n & ce && (l = l.add(c)), c = c.double(), n >>= ce;
      return l;
    }
    let { k1neg: i, k1: a, k2neg: o, k2: u } = yo(n), s = r, f = r, h = this;
    for (; a > ee || u > ee; )
      a & ce && (s = s.add(h)), u & ce && (f = f.add(h)), h = h.double(), a >>= ce, u >>= ce;
    return i && (s = s.negate()), o && (f = f.negate()), f = new ne(B(f.x * fe.beta), f.y, f.z), s.add(f);
  }
  precomputeWindow(e) {
    const r = Yr ? 128 / e + 1 : 256 / e + 1, n = [];
    let i = this, a = i;
    for (let o = 0; o < r; o++) {
      a = i, n.push(a);
      for (let u = 1; u < 2 ** (e - 1); u++)
        a = a.add(i), n.push(a);
      i = a.double();
    }
    return n;
  }
  wNAF(e, r) {
    !r && this.equals(ne.BASE) && (r = le.BASE);
    const n = r && r._WINDOW_SIZE || 1;
    if (256 % n)
      throw new Error("Point#wNAF: Invalid precomputation window, must be power of 2");
    let i = r && mi.get(r);
    i || (i = this.precomputeWindow(n), r && n !== 1 && (i = ne.normalizeZ(i), mi.set(r, i)));
    let a = ne.ZERO, o = ne.ZERO;
    const u = 1 + (Yr ? 128 / n : 256 / n), s = 2 ** (n - 1), f = BigInt(2 ** n - 1), h = 2 ** n, l = BigInt(n);
    for (let c = 0; c < u; c++) {
      const d = c * s;
      let p = Number(e & f);
      if (e >>= l, p > s && (p -= h, e += ce), p === 0) {
        let _ = i[d];
        c % 2 && (_ = _.negate()), o = o.add(_);
      } else {
        let _ = i[d + Math.abs(p) - 1];
        p < 0 && (_ = _.negate()), a = a.add(_);
      }
    }
    return { p: a, f: o };
  }
  multiply(e, r) {
    let n = _o(e), i, a;
    if (Yr) {
      const { k1neg: o, k1: u, k2neg: s, k2: f } = yo(n);
      let { p: h, f: l } = this.wNAF(u, r), { p: c, f: d } = this.wNAF(f, r);
      o && (h = h.negate()), s && (c = c.negate()), c = new ne(B(c.x * fe.beta), c.y, c.z), i = h.add(c), a = l.add(d);
    } else {
      const { p: o, f: u } = this.wNAF(n, r);
      i = o, a = u;
    }
    return ne.normalizeZ([i, a])[0];
  }
  toAffine(e = gn(this.z)) {
    const { x: r, y: n, z: i } = this, a = e, o = B(a * a), u = B(o * a), s = B(r * o), f = B(n * u);
    if (B(i * a) !== ce)
      throw new Error("invZ was invalid");
    return new le(s, f);
  }
}
ne.BASE = new ne(fe.Gx, fe.Gy, ce);
ne.ZERO = new ne(ee, ce, ee);
const mi = /* @__PURE__ */ new WeakMap();
class le {
  constructor(e, r) {
    this.x = e, this.y = r;
  }
  _setWindowSize(e) {
    this._WINDOW_SIZE = e, mi.delete(this);
  }
  hasEvenY() {
    return this.y % ct === ee;
  }
  static fromCompressedHex(e) {
    const r = e.length === 32, n = je(r ? e : e.subarray(1));
    if (!nn(n))
      throw new Error("Point is not on curve");
    const i = co(n);
    let a = Xu(i);
    const o = (a & ce) === ce;
    r ? o && (a = B(-a)) : (e[0] & 1) === 1 !== o && (a = B(-a));
    const u = new le(n, a);
    return u.assertValidity(), u;
  }
  static fromUncompressedHex(e) {
    const r = je(e.subarray(1, 33)), n = je(e.subarray(33, 65)), i = new le(r, n);
    return i.assertValidity(), i;
  }
  static fromHex(e) {
    const r = Rt(e), n = r.length, i = r[0];
    if (n === 32 || n === 33 && (i === 2 || i === 3))
      return this.fromCompressedHex(r);
    if (n === 65 && i === 4)
      return this.fromUncompressedHex(r);
    throw new Error(`Point.fromHex: received invalid point. Expected 32-33 compressed bytes or 65 uncompressed bytes, not ${n}`);
  }
  static fromPrivateKey(e) {
    return le.BASE.multiply(Lr(e));
  }
  static fromSignature(e, r, n) {
    e = Rt(e);
    const i = ef(e), { r: a, s: o } = rf(r);
    if (n !== 0 && n !== 1)
      throw new Error("Cannot recover signature: invalid recovery bit");
    const u = n & 1 ? "03" : "02", s = le.fromHex(u + ht(a)), { n: f } = fe, h = gn(a, f), l = B(-i * h, f), c = B(o * h, f), d = le.BASE.multiplyAndAddUnsafe(s, l, c);
    if (!d)
      throw new Error("Cannot recover signature: point at infinify");
    return d.assertValidity(), d;
  }
  toRawBytes(e = !1) {
    return dt(this.toHex(e));
  }
  toHex(e = !1) {
    const r = ht(this.x);
    return e ? `${this.hasEvenY() ? "02" : "03"}${r}` : `04${r}${ht(this.y)}`;
  }
  toHexX() {
    return this.toHex(!0).slice(2);
  }
  toRawX() {
    return this.toRawBytes(!0).slice(1);
  }
  assertValidity() {
    const e = "Point is not on elliptic curve", { x: r, y: n } = this;
    if (!nn(r) || !nn(n))
      throw new Error(e);
    const i = B(n * n), a = co(r);
    if (B(i - a) !== ee)
      throw new Error(e);
  }
  equals(e) {
    return this.x === e.x && this.y === e.y;
  }
  negate() {
    return new le(this.x, B(-this.y));
  }
  double() {
    return ne.fromAffine(this).double().toAffine();
  }
  add(e) {
    return ne.fromAffine(this).add(ne.fromAffine(e)).toAffine();
  }
  subtract(e) {
    return this.add(e.negate());
  }
  multiply(e) {
    return ne.fromAffine(this).multiply(e, this).toAffine();
  }
  multiplyAndAddUnsafe(e, r, n) {
    const i = ne.fromAffine(this), a = r === ee || r === ce || this !== le.BASE ? i.multiplyUnsafe(r) : i.multiply(r), o = ne.fromAffine(e).multiplyUnsafe(n), u = a.add(o);
    return u.equals(ne.ZERO) ? void 0 : u.toAffine();
  }
}
le.BASE = new le(fe.Gx, fe.Gy);
le.ZERO = new le(ee, ee);
function ho(t) {
  return Number.parseInt(t[0], 16) >= 8 ? "00" + t : t;
}
function po(t) {
  if (t.length < 2 || t[0] !== 2)
    throw new Error(`Invalid signature integer tag: ${$t(t)}`);
  const e = t[1], r = t.subarray(2, e + 2);
  if (!e || r.length !== e)
    throw new Error("Invalid signature integer: wrong length");
  if (r[0] === 0 && r[1] <= 127)
    throw new Error("Invalid signature integer: trailing length");
  return { data: je(r), left: t.subarray(e + 2) };
}
function Gu(t) {
  if (t.length < 2 || t[0] != 48)
    throw new Error(`Invalid signature tag: ${$t(t)}`);
  if (t[1] !== t.length - 2)
    throw new Error("Invalid signature: incorrect length");
  const { data: e, left: r } = po(t.subarray(2)), { data: n, left: i } = po(r);
  if (i.length)
    throw new Error(`Invalid signature: left bytes after parsing: ${$t(i)}`);
  return { r: e, s: n };
}
class xt {
  constructor(e, r) {
    this.r = e, this.s = r, this.assertValidity();
  }
  static fromCompact(e) {
    const r = e instanceof Uint8Array, n = "Signature.fromCompact";
    if (typeof e != "string" && !r)
      throw new TypeError(`${n}: Expected string or Uint8Array`);
    const i = r ? $t(e) : e;
    if (i.length !== 128)
      throw new Error(`${n}: Expected 64-byte hex`);
    return new xt(ln(i.slice(0, 64)), ln(i.slice(64, 128)));
  }
  static fromDER(e) {
    const r = e instanceof Uint8Array;
    if (typeof e != "string" && !r)
      throw new TypeError("Signature.fromDER: Expected string or Uint8Array");
    const { r: n, s: i } = Gu(r ? e : dt(e));
    return new xt(n, i);
  }
  static fromHex(e) {
    return this.fromDER(e);
  }
  assertValidity() {
    const { r: e, s: r } = this;
    if (!Tr(e))
      throw new Error("Invalid Signature: r must be 0 < r < n");
    if (!Tr(r))
      throw new Error("Invalid Signature: s must be 0 < s < n");
  }
  hasHighS() {
    const e = fe.n >> ce;
    return this.s > e;
  }
  normalizeS() {
    return this.hasHighS() ? new xt(this.r, fe.n - this.s) : this;
  }
  toDERRawBytes(e = !1) {
    return dt(this.toDERHex(e));
  }
  toDERHex(e = !1) {
    const r = ho(Zt(this.s));
    if (e)
      return r;
    const n = ho(Zt(this.r)), i = Zt(n.length / 2), a = Zt(r.length / 2);
    return `30${Zt(n.length / 2 + r.length / 2 + 4)}02${i}${n}02${a}${r}`;
  }
  toRawBytes() {
    return this.toDERRawBytes();
  }
  toHex() {
    return this.toDERHex();
  }
  toCompactRawBytes() {
    return dt(this.toCompactHex());
  }
  toCompactHex() {
    return ht(this.r) + ht(this.s);
  }
}
function Gt(...t) {
  if (!t.every((n) => n instanceof Uint8Array))
    throw new Error("Uint8Array list expected");
  if (t.length === 1)
    return t[0];
  const e = t.reduce((n, i) => n + i.length, 0), r = new Uint8Array(e);
  for (let n = 0, i = 0; n < t.length; n++) {
    const a = t[n];
    r.set(a, i), i += a.length;
  }
  return r;
}
const Zu = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function $t(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Expected Uint8Array");
  let e = "";
  for (let r = 0; r < t.length; r++)
    e += Zu[t[r]];
  return e;
}
const Ku = BigInt("0x10000000000000000000000000000000000000000000000000000000000000000");
function ht(t) {
  if (typeof t != "bigint")
    throw new Error("Expected bigint");
  if (!(ee <= t && t < Ku))
    throw new Error("Expected number < 2^256");
  return t.toString(16).padStart(64, "0");
}
function Ir(t) {
  const e = dt(ht(t));
  if (e.length !== 32)
    throw new Error("Error: expected 32 bytes");
  return e;
}
function Zt(t) {
  const e = t.toString(16);
  return e.length & 1 ? `0${e}` : e;
}
function ln(t) {
  if (typeof t != "string")
    throw new TypeError("hexToNumber: expected string, got " + typeof t);
  return BigInt(`0x${t}`);
}
function dt(t) {
  if (typeof t != "string")
    throw new TypeError("hexToBytes: expected string, got " + typeof t);
  if (t.length % 2)
    throw new Error("hexToBytes: received invalid unpadded hex" + t.length);
  const e = new Uint8Array(t.length / 2);
  for (let r = 0; r < e.length; r++) {
    const n = r * 2, i = t.slice(n, n + 2), a = Number.parseInt(i, 16);
    if (Number.isNaN(a) || a < 0)
      throw new Error("Invalid byte sequence");
    e[r] = a;
  }
  return e;
}
function je(t) {
  return ln($t(t));
}
function Rt(t) {
  return t instanceof Uint8Array ? Uint8Array.from(t) : dt(t);
}
function _o(t) {
  if (typeof t == "number" && Number.isSafeInteger(t) && t > 0)
    return BigInt(t);
  if (typeof t == "bigint" && Tr(t))
    return t;
  throw new TypeError("Expected valid private scalar: 0 < scalar < curve.n");
}
function B(t, e = fe.P) {
  const r = t % e;
  return r >= ee ? r : e + r;
}
function qe(t, e) {
  const { P: r } = fe;
  let n = t;
  for (; e-- > ee; )
    n *= n, n %= r;
  return n;
}
function Xu(t) {
  const { P: e } = fe, r = BigInt(6), n = BigInt(11), i = BigInt(22), a = BigInt(23), o = BigInt(44), u = BigInt(88), s = t * t * t % e, f = s * s * t % e, h = qe(f, Cr) * f % e, l = qe(h, Cr) * f % e, c = qe(l, ct) * s % e, d = qe(c, n) * c % e, p = qe(d, i) * d % e, _ = qe(p, o) * p % e, m = qe(_, u) * _ % e, b = qe(m, o) * p % e, w = qe(b, Cr) * f % e, S = qe(w, a) * d % e, A = qe(S, r) * s % e;
  return qe(A, ct);
}
function gn(t, e = fe.P) {
  if (t === ee || e <= ee)
    throw new Error(`invert: expected positive integers, got n=${t} mod=${e}`);
  let r = B(t, e), n = e, i = ee, a = ce;
  for (; r !== ee; ) {
    const u = n / r, s = n % r, f = i - a * u;
    n = r, r = s, i = a, a = f;
  }
  if (n !== ce)
    throw new Error("invert: does not exist");
  return B(i, e);
}
function Qu(t, e = fe.P) {
  const r = new Array(t.length), n = t.reduce((a, o, u) => o === ee ? a : (r[u] = a, B(a * o, e)), ce), i = gn(n, e);
  return t.reduceRight((a, o, u) => o === ee ? a : (r[u] = B(a * r[u], e), B(a * o, e)), i), r;
}
const vo = (t, e) => (t + e / ct) / e, Ju = {
  a1: BigInt("0x3086d221a7d46bcde86c90e49284eb15"),
  b1: -ce * BigInt("0xe4437ed6010e88286f547fa90abfe4c3"),
  a2: BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"),
  b2: BigInt("0x3086d221a7d46bcde86c90e49284eb15"),
  POW_2_128: BigInt("0x100000000000000000000000000000000")
};
function yo(t) {
  const { n: e } = fe, { a1: r, b1: n, a2: i, b2: a, POW_2_128: o } = Ju, u = vo(a * t, e), s = vo(-n * t, e);
  let f = B(t - u * r - s * i, e), h = B(-u * n - s * a, e);
  const l = f > o, c = h > o;
  if (l && (f = e - f), c && (h = e - h), f > o || h > o)
    throw new Error("splitScalarEndo: Endomorphism failed, k=" + t);
  return { k1neg: l, k1: f, k2neg: c, k2: h };
}
function ef(t) {
  const { n: e } = fe, n = t.length * 8 - 256;
  let i = je(t);
  return n > 0 && (i = i >> BigInt(n)), i >= e && (i -= e), i;
}
let Dt, Un;
function Tr(t) {
  return ee < t && t < fe.n;
}
function nn(t) {
  return ee < t && t < fe.P;
}
function Lr(t) {
  let e;
  if (typeof t == "bigint")
    e = t;
  else if (typeof t == "number" && Number.isSafeInteger(t) && t > 0)
    e = BigInt(t);
  else if (typeof t == "string") {
    if (t.length !== 64)
      throw new Error("Expected 32 bytes of private key");
    e = ln(t);
  } else if (t instanceof Uint8Array) {
    if (t.length !== 32)
      throw new Error("Expected 32 bytes of private key");
    e = je(t);
  } else
    throw new TypeError("Expected valid private key");
  if (!Tr(e))
    throw new Error("Expected private key: 0 < key < n");
  return e;
}
function tf(t) {
  return t instanceof le ? (t.assertValidity(), t) : le.fromHex(t);
}
function rf(t) {
  if (t instanceof xt)
    return t.assertValidity(), t;
  try {
    return xt.fromDER(t);
  } catch (e) {
    return xt.fromCompact(t);
  }
}
function cn(t) {
  return B(je(t), fe.n);
}
class Ut {
  constructor(e, r) {
    this.r = e, this.s = r, this.assertValidity();
  }
  static fromHex(e) {
    const r = Rt(e);
    if (r.length !== 64)
      throw new TypeError(`SchnorrSignature.fromHex: expected 64 bytes, not ${r.length}`);
    const n = je(r.subarray(0, 32)), i = je(r.subarray(32, 64));
    return new Ut(n, i);
  }
  assertValidity() {
    const { r: e, s: r } = this;
    if (!nn(e) || !Tr(r))
      throw new Error("Invalid signature");
  }
  toHex() {
    return ht(this.r) + ht(this.s);
  }
  toRawBytes() {
    return dt(this.toHex());
  }
}
function nf(t) {
  return le.fromPrivateKey(t).toRawX();
}
class Ka {
  constructor(e, r, n = $e.randomBytes()) {
    if (e == null)
      throw new TypeError(`sign: Expected valid message, not "${e}"`);
    this.m = Rt(e);
    const { x: i, scalar: a } = this.getScalar(Lr(r));
    if (this.px = i, this.d = a, this.rand = Rt(n), this.rand.length !== 32)
      throw new TypeError("sign: Expected 32 bytes of aux randomness");
  }
  getScalar(e) {
    const r = le.fromPrivateKey(e), n = r.hasEvenY() ? e : fe.n - e;
    return { point: r, scalar: n, x: r.toRawX() };
  }
  initNonce(e, r) {
    return Ir(e ^ je(r));
  }
  finalizeNonce(e) {
    const r = B(je(e), fe.n);
    if (r === ee)
      throw new Error("sign: Creation of signature failed. k is zero");
    const { point: n, x: i, scalar: a } = this.getScalar(r);
    return { R: n, rx: i, k: a };
  }
  finalizeSig(e, r, n, i) {
    return new Ut(e.x, B(r + n * i, fe.n)).toRawBytes();
  }
  error() {
    throw new Error("sign: Invalid signature produced");
  }
  async calc() {
    const { m: e, d: r, px: n, rand: i } = this, a = $e.taggedHash, o = this.initNonce(r, await a(lt.aux, i)), { R: u, rx: s, k: f } = this.finalizeNonce(await a(lt.nonce, o, n, e)), h = cn(await a(lt.challenge, s, n, e)), l = this.finalizeSig(u, f, h, r);
    return await Ja(l, e, n) || this.error(), l;
  }
  calcSync() {
    const { m: e, d: r, px: n, rand: i } = this, a = $e.taggedHashSync, o = this.initNonce(r, a(lt.aux, i)), { R: u, rx: s, k: f } = this.finalizeNonce(a(lt.nonce, o, n, e)), h = cn(a(lt.challenge, s, n, e)), l = this.finalizeSig(u, f, h, r);
    return es(l, e, n) || this.error(), l;
  }
}
async function of(t, e, r) {
  return new Ka(t, e, r).calc();
}
function af(t, e, r) {
  return new Ka(t, e, r).calcSync();
}
function Xa(t, e, r) {
  const n = t instanceof Ut, i = n ? t : Ut.fromHex(t);
  return n && i.assertValidity(), {
    ...i,
    m: Rt(e),
    P: tf(r)
  };
}
function Qa(t, e, r, n) {
  const i = le.BASE.multiplyAndAddUnsafe(e, Lr(r), B(-n, fe.n));
  return !(!i || !i.hasEvenY() || i.x !== t);
}
async function Ja(t, e, r) {
  try {
    const { r: n, s: i, m: a, P: o } = Xa(t, e, r), u = cn(await $e.taggedHash(lt.challenge, Ir(n), o.toRawX(), a));
    return Qa(n, o, i, u);
  } catch (n) {
    return !1;
  }
}
function es(t, e, r) {
  try {
    const { r: n, s: i, m: a, P: o } = Xa(t, e, r), u = cn($e.taggedHashSync(lt.challenge, Ir(n), o.toRawX(), a));
    return Qa(n, o, i, u);
  } catch (n) {
    if (n instanceof Za)
      throw n;
    return !1;
  }
}
const ji = {
  Signature: Ut,
  getPublicKey: nf,
  sign: of,
  verify: Ja,
  signSync: af,
  verifySync: es
};
le.BASE._setWindowSize(8);
const Le = {
  node: Vu,
  web: typeof self == "object" && "crypto" in self ? self.crypto : void 0
}, lt = {
  challenge: "BIP0340/challenge",
  aux: "BIP0340/aux",
  nonce: "BIP0340/nonce"
}, Gr = {}, $e = {
  bytesToHex: $t,
  hexToBytes: dt,
  concatBytes: Gt,
  mod: B,
  invert: gn,
  isValidPrivateKey(t) {
    try {
      return Lr(t), !0;
    } catch (e) {
      return !1;
    }
  },
  _bigintTo32Bytes: Ir,
  _normalizePrivateKey: Lr,
  hashToPrivateKey: (t) => {
    if (t = Rt(t), t.length < 40 || t.length > 1024)
      throw new Error("Expected 40-1024 bytes of private key as per FIPS 186");
    const e = B(je(t), fe.n - ce) + ce;
    return Ir(e);
  },
  randomBytes: (t = 32) => {
    if (Le.web)
      return Le.web.getRandomValues(new Uint8Array(t));
    if (Le.node) {
      const { randomBytes: e } = Le.node;
      return Uint8Array.from(e(t));
    } else
      throw new Error("The environment doesn't have randomBytes function");
  },
  randomPrivateKey: () => $e.hashToPrivateKey($e.randomBytes(40)),
  sha256: async (...t) => {
    if (Le.web) {
      const e = await Le.web.subtle.digest("SHA-256", Gt(...t));
      return new Uint8Array(e);
    } else if (Le.node) {
      const { createHash: e } = Le.node, r = e("sha256");
      return t.forEach((n) => r.update(n)), Uint8Array.from(r.digest());
    } else
      throw new Error("The environment doesn't have sha256 function");
  },
  hmacSha256: async (t, ...e) => {
    if (Le.web) {
      const r = await Le.web.subtle.importKey("raw", t, { name: "HMAC", hash: { name: "SHA-256" } }, !1, ["sign"]), n = Gt(...e), i = await Le.web.subtle.sign("HMAC", r, n);
      return new Uint8Array(i);
    } else if (Le.node) {
      const { createHmac: r } = Le.node, n = r("sha256", t);
      return e.forEach((i) => n.update(i)), Uint8Array.from(n.digest());
    } else
      throw new Error("The environment doesn't have hmac-sha256 function");
  },
  sha256Sync: void 0,
  hmacSha256Sync: void 0,
  taggedHash: async (t, ...e) => {
    let r = Gr[t];
    if (r === void 0) {
      const n = await $e.sha256(Uint8Array.from(t, (i) => i.charCodeAt(0)));
      r = Gt(n, n), Gr[t] = r;
    }
    return $e.sha256(r, ...e);
  },
  taggedHashSync: (t, ...e) => {
    if (typeof Dt != "function")
      throw new Za("sha256Sync is undefined, you need to set it");
    let r = Gr[t];
    if (r === void 0) {
      const n = Dt(Uint8Array.from(t, (i) => i.charCodeAt(0)));
      r = Gt(n, n), Gr[t] = r;
    }
    return Dt(r, ...e);
  },
  precompute(t = 8, e = le.BASE) {
    const r = e === le.BASE ? e : new le(e.x, e.y);
    return r._setWindowSize(t), r.multiply(Cr), r;
  }
};
Object.defineProperties($e, {
  sha256Sync: {
    configurable: !1,
    get() {
      return Dt;
    },
    set(t) {
      Dt || (Dt = t);
    }
  },
  hmacSha256Sync: {
    configurable: !1,
    get() {
      return Un;
    },
    set(t) {
      Un || (Un = t);
    }
  }
});
const xi = typeof global != "undefined" ? global : typeof self != "undefined" ? self : typeof window != "undefined" ? window : {};
var Ke = [], De = [], sf = typeof Uint8Array != "undefined" ? Uint8Array : Array, Ni = !1;
function ts() {
  Ni = !0;
  for (var t = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", e = 0, r = t.length; e < r; ++e)
    Ke[e] = t[e], De[t.charCodeAt(e)] = e;
  De["-".charCodeAt(0)] = 62, De["_".charCodeAt(0)] = 63;
}
function uf(t) {
  Ni || ts();
  var e, r, n, i, a, o, u = t.length;
  if (u % 4 > 0)
    throw new Error("Invalid string. Length must be a multiple of 4");
  a = t[u - 2] === "=" ? 2 : t[u - 1] === "=" ? 1 : 0, o = new sf(u * 3 / 4 - a), n = a > 0 ? u - 4 : u;
  var s = 0;
  for (e = 0, r = 0; e < n; e += 4, r += 3)
    i = De[t.charCodeAt(e)] << 18 | De[t.charCodeAt(e + 1)] << 12 | De[t.charCodeAt(e + 2)] << 6 | De[t.charCodeAt(e + 3)], o[s++] = i >> 16 & 255, o[s++] = i >> 8 & 255, o[s++] = i & 255;
  return a === 2 ? (i = De[t.charCodeAt(e)] << 2 | De[t.charCodeAt(e + 1)] >> 4, o[s++] = i & 255) : a === 1 && (i = De[t.charCodeAt(e)] << 10 | De[t.charCodeAt(e + 1)] << 4 | De[t.charCodeAt(e + 2)] >> 2, o[s++] = i >> 8 & 255, o[s++] = i & 255), o;
}
function ff(t) {
  return Ke[t >> 18 & 63] + Ke[t >> 12 & 63] + Ke[t >> 6 & 63] + Ke[t & 63];
}
function lf(t, e, r) {
  for (var n, i = [], a = e; a < r; a += 3)
    n = (t[a] << 16) + (t[a + 1] << 8) + t[a + 2], i.push(ff(n));
  return i.join("");
}
function go(t) {
  Ni || ts();
  for (var e, r = t.length, n = r % 3, i = "", a = [], o = 16383, u = 0, s = r - n; u < s; u += o)
    a.push(lf(t, u, u + o > s ? s : u + o));
  return n === 1 ? (e = t[r - 1], i += Ke[e >> 2], i += Ke[e << 4 & 63], i += "==") : n === 2 && (e = (t[r - 2] << 8) + t[r - 1], i += Ke[e >> 10], i += Ke[e >> 4 & 63], i += Ke[e << 2 & 63], i += "="), a.push(i), a.join("");
}
function bn(t, e, r, n, i) {
  var a, o, u = i * 8 - n - 1, s = (1 << u) - 1, f = s >> 1, h = -7, l = r ? i - 1 : 0, c = r ? -1 : 1, d = t[e + l];
  for (l += c, a = d & (1 << -h) - 1, d >>= -h, h += u; h > 0; a = a * 256 + t[e + l], l += c, h -= 8)
    ;
  for (o = a & (1 << -h) - 1, a >>= -h, h += n; h > 0; o = o * 256 + t[e + l], l += c, h -= 8)
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
function rs(t, e, r, n, i, a) {
  var o, u, s, f = a * 8 - i - 1, h = (1 << f) - 1, l = h >> 1, c = i === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0, d = n ? 0 : a - 1, p = n ? 1 : -1, _ = e < 0 || e === 0 && 1 / e < 0 ? 1 : 0;
  for (e = Math.abs(e), isNaN(e) || e === 1 / 0 ? (u = isNaN(e) ? 1 : 0, o = h) : (o = Math.floor(Math.log(e) / Math.LN2), e * (s = Math.pow(2, -o)) < 1 && (o--, s *= 2), o + l >= 1 ? e += c / s : e += c * Math.pow(2, 1 - l), e * s >= 2 && (o++, s /= 2), o + l >= h ? (u = 0, o = h) : o + l >= 1 ? (u = (e * s - 1) * Math.pow(2, i), o = o + l) : (u = e * Math.pow(2, l - 1) * Math.pow(2, i), o = 0)); i >= 8; t[r + d] = u & 255, d += p, u /= 256, i -= 8)
    ;
  for (o = o << i | u, f += i; f > 0; t[r + d] = o & 255, d += p, o /= 256, f -= 8)
    ;
  t[r + d - p] |= _ * 128;
}
var cf = {}.toString, ns = Array.isArray || function(t) {
  return cf.call(t) == "[object Array]";
};
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
var is = 50;
E.TYPED_ARRAY_SUPPORT = xi.TYPED_ARRAY_SUPPORT !== void 0 ? xi.TYPED_ARRAY_SUPPORT : !0;
var hf = hn();
function hn() {
  return E.TYPED_ARRAY_SUPPORT ? 2147483647 : 1073741823;
}
function it(t, e) {
  if (hn() < e)
    throw new RangeError("Invalid typed array length");
  return E.TYPED_ARRAY_SUPPORT ? (t = new Uint8Array(e), t.__proto__ = E.prototype) : (t === null && (t = new E(e)), t.length = e), t;
}
function E(t, e, r) {
  if (!E.TYPED_ARRAY_SUPPORT && !(this instanceof E))
    return new E(t, e, r);
  if (typeof t == "number") {
    if (typeof e == "string")
      throw new Error(
        "If encoding is specified then the first argument must be a string"
      );
    return Fi(this, t);
  }
  return os(this, t, e, r);
}
E.poolSize = 8192;
E._augment = function(t) {
  return t.__proto__ = E.prototype, t;
};
function os(t, e, r, n) {
  if (typeof e == "number")
    throw new TypeError('"value" argument must not be a number');
  return typeof ArrayBuffer != "undefined" && e instanceof ArrayBuffer ? _f(t, e, r, n) : typeof e == "string" ? pf(t, e, r) : vf(t, e);
}
E.from = function(t, e, r) {
  return os(null, t, e, r);
};
E.TYPED_ARRAY_SUPPORT && (E.prototype.__proto__ = Uint8Array.prototype, E.__proto__ = Uint8Array);
function as(t) {
  if (typeof t != "number")
    throw new TypeError('"size" argument must be a number');
  if (t < 0)
    throw new RangeError('"size" argument must not be negative');
}
function df(t, e, r, n) {
  return as(e), e <= 0 ? it(t, e) : r !== void 0 ? typeof n == "string" ? it(t, e).fill(r, n) : it(t, e).fill(r) : it(t, e);
}
E.alloc = function(t, e, r) {
  return df(null, t, e, r);
};
function Fi(t, e) {
  if (as(e), t = it(t, e < 0 ? 0 : $i(e) | 0), !E.TYPED_ARRAY_SUPPORT)
    for (var r = 0; r < e; ++r)
      t[r] = 0;
  return t;
}
E.allocUnsafe = function(t) {
  return Fi(null, t);
};
E.allocUnsafeSlow = function(t) {
  return Fi(null, t);
};
function pf(t, e, r) {
  if ((typeof r != "string" || r === "") && (r = "utf8"), !E.isEncoding(r))
    throw new TypeError('"encoding" must be a valid string encoding');
  var n = ss(e, r) | 0;
  t = it(t, n);
  var i = t.write(e, r);
  return i !== n && (t = t.slice(0, i)), t;
}
function Ei(t, e) {
  var r = e.length < 0 ? 0 : $i(e.length) | 0;
  t = it(t, r);
  for (var n = 0; n < r; n += 1)
    t[n] = e[n] & 255;
  return t;
}
function _f(t, e, r, n) {
  if (e.byteLength, r < 0 || e.byteLength < r)
    throw new RangeError("'offset' is out of bounds");
  if (e.byteLength < r + (n || 0))
    throw new RangeError("'length' is out of bounds");
  return r === void 0 && n === void 0 ? e = new Uint8Array(e) : n === void 0 ? e = new Uint8Array(e, r) : e = new Uint8Array(e, r, n), E.TYPED_ARRAY_SUPPORT ? (t = e, t.__proto__ = E.prototype) : t = Ei(t, e), t;
}
function vf(t, e) {
  if (nt(e)) {
    var r = $i(e.length) | 0;
    return t = it(t, r), t.length === 0 || e.copy(t, 0, 0, r), t;
  }
  if (e) {
    if (typeof ArrayBuffer != "undefined" && e.buffer instanceof ArrayBuffer || "length" in e)
      return typeof e.length != "number" || Hf(e.length) ? it(t, 0) : Ei(t, e);
    if (e.type === "Buffer" && ns(e.data))
      return Ei(t, e.data);
  }
  throw new TypeError("First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.");
}
function $i(t) {
  if (t >= hn())
    throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + hn().toString(16) + " bytes");
  return t | 0;
}
function yf(t) {
  return +t != t && (t = 0), E.alloc(+t);
}
E.isBuffer = _s;
function nt(t) {
  return !!(t != null && t._isBuffer);
}
E.compare = function(e, r) {
  if (!nt(e) || !nt(r))
    throw new TypeError("Arguments must be Buffers");
  if (e === r)
    return 0;
  for (var n = e.length, i = r.length, a = 0, o = Math.min(n, i); a < o; ++a)
    if (e[a] !== r[a]) {
      n = e[a], i = r[a];
      break;
    }
  return n < i ? -1 : i < n ? 1 : 0;
};
E.isEncoding = function(e) {
  switch (String(e).toLowerCase()) {
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
E.concat = function(e, r) {
  if (!ns(e))
    throw new TypeError('"list" argument must be an Array of Buffers');
  if (e.length === 0)
    return E.alloc(0);
  var n;
  if (r === void 0)
    for (r = 0, n = 0; n < e.length; ++n)
      r += e[n].length;
  var i = E.allocUnsafe(r), a = 0;
  for (n = 0; n < e.length; ++n) {
    var o = e[n];
    if (!nt(o))
      throw new TypeError('"list" argument must be an Array of Buffers');
    o.copy(i, a), a += o.length;
  }
  return i;
};
function ss(t, e) {
  if (nt(t))
    return t.length;
  if (typeof ArrayBuffer != "undefined" && typeof ArrayBuffer.isView == "function" && (ArrayBuffer.isView(t) || t instanceof ArrayBuffer))
    return t.byteLength;
  typeof t != "string" && (t = "" + t);
  var r = t.length;
  if (r === 0)
    return 0;
  for (var n = !1; ; )
    switch (e) {
      case "ascii":
      case "latin1":
      case "binary":
        return r;
      case "utf8":
      case "utf-8":
      case void 0:
        return dn(t).length;
      case "ucs2":
      case "ucs-2":
      case "utf16le":
      case "utf-16le":
        return r * 2;
      case "hex":
        return r >>> 1;
      case "base64":
        return ps(t).length;
      default:
        if (n)
          return dn(t).length;
        e = ("" + e).toLowerCase(), n = !0;
    }
}
E.byteLength = ss;
function gf(t, e, r) {
  var n = !1;
  if ((e === void 0 || e < 0) && (e = 0), e > this.length || ((r === void 0 || r > this.length) && (r = this.length), r <= 0) || (r >>>= 0, e >>>= 0, r <= e))
    return "";
  for (t || (t = "utf8"); ; )
    switch (t) {
      case "hex":
        return Af(this, e, r);
      case "utf8":
      case "utf-8":
        return ls(this, e, r);
      case "ascii":
        return Cf(this, e, r);
      case "latin1":
      case "binary":
        return Of(this, e, r);
      case "base64":
        return Sf(this, e, r);
      case "ucs2":
      case "ucs-2":
      case "utf16le":
      case "utf-16le":
        return kf(this, e, r);
      default:
        if (n)
          throw new TypeError("Unknown encoding: " + t);
        t = (t + "").toLowerCase(), n = !0;
    }
}
E.prototype._isBuffer = !0;
function wt(t, e, r) {
  var n = t[e];
  t[e] = t[r], t[r] = n;
}
E.prototype.swap16 = function() {
  var e = this.length;
  if (e % 2 !== 0)
    throw new RangeError("Buffer size must be a multiple of 16-bits");
  for (var r = 0; r < e; r += 2)
    wt(this, r, r + 1);
  return this;
};
E.prototype.swap32 = function() {
  var e = this.length;
  if (e % 4 !== 0)
    throw new RangeError("Buffer size must be a multiple of 32-bits");
  for (var r = 0; r < e; r += 4)
    wt(this, r, r + 3), wt(this, r + 1, r + 2);
  return this;
};
E.prototype.swap64 = function() {
  var e = this.length;
  if (e % 8 !== 0)
    throw new RangeError("Buffer size must be a multiple of 64-bits");
  for (var r = 0; r < e; r += 8)
    wt(this, r, r + 7), wt(this, r + 1, r + 6), wt(this, r + 2, r + 5), wt(this, r + 3, r + 4);
  return this;
};
E.prototype.toString = function() {
  var e = this.length | 0;
  return e === 0 ? "" : arguments.length === 0 ? ls(this, 0, e) : gf.apply(this, arguments);
};
E.prototype.equals = function(e) {
  if (!nt(e))
    throw new TypeError("Argument must be a Buffer");
  return this === e ? !0 : E.compare(this, e) === 0;
};
E.prototype.inspect = function() {
  var e = "", r = is;
  return this.length > 0 && (e = this.toString("hex", 0, r).match(/.{2}/g).join(" "), this.length > r && (e += " ... ")), "<Buffer " + e + ">";
};
E.prototype.compare = function(e, r, n, i, a) {
  if (!nt(e))
    throw new TypeError("Argument must be a Buffer");
  if (r === void 0 && (r = 0), n === void 0 && (n = e ? e.length : 0), i === void 0 && (i = 0), a === void 0 && (a = this.length), r < 0 || n > e.length || i < 0 || a > this.length)
    throw new RangeError("out of range index");
  if (i >= a && r >= n)
    return 0;
  if (i >= a)
    return -1;
  if (r >= n)
    return 1;
  if (r >>>= 0, n >>>= 0, i >>>= 0, a >>>= 0, this === e)
    return 0;
  for (var o = a - i, u = n - r, s = Math.min(o, u), f = this.slice(i, a), h = e.slice(r, n), l = 0; l < s; ++l)
    if (f[l] !== h[l]) {
      o = f[l], u = h[l];
      break;
    }
  return o < u ? -1 : u < o ? 1 : 0;
};
function us(t, e, r, n, i) {
  if (t.length === 0)
    return -1;
  if (typeof r == "string" ? (n = r, r = 0) : r > 2147483647 ? r = 2147483647 : r < -2147483648 && (r = -2147483648), r = +r, isNaN(r) && (r = i ? 0 : t.length - 1), r < 0 && (r = t.length + r), r >= t.length) {
    if (i)
      return -1;
    r = t.length - 1;
  } else if (r < 0)
    if (i)
      r = 0;
    else
      return -1;
  if (typeof e == "string" && (e = E.from(e, n)), nt(e))
    return e.length === 0 ? -1 : bo(t, e, r, n, i);
  if (typeof e == "number")
    return e = e & 255, E.TYPED_ARRAY_SUPPORT && typeof Uint8Array.prototype.indexOf == "function" ? i ? Uint8Array.prototype.indexOf.call(t, e, r) : Uint8Array.prototype.lastIndexOf.call(t, e, r) : bo(t, [e], r, n, i);
  throw new TypeError("val must be string, number or Buffer");
}
function bo(t, e, r, n, i) {
  var a = 1, o = t.length, u = e.length;
  if (n !== void 0 && (n = String(n).toLowerCase(), n === "ucs2" || n === "ucs-2" || n === "utf16le" || n === "utf-16le")) {
    if (t.length < 2 || e.length < 2)
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
      if (s(t, f) === s(e, h === -1 ? 0 : f - h)) {
        if (h === -1 && (h = f), f - h + 1 === u)
          return h * a;
      } else
        h !== -1 && (f -= f - h), h = -1;
  } else
    for (r + u > o && (r = o - u), f = r; f >= 0; f--) {
      for (var l = !0, c = 0; c < u; c++)
        if (s(t, f + c) !== s(e, c)) {
          l = !1;
          break;
        }
      if (l)
        return f;
    }
  return -1;
}
E.prototype.includes = function(e, r, n) {
  return this.indexOf(e, r, n) !== -1;
};
E.prototype.indexOf = function(e, r, n) {
  return us(this, e, r, n, !0);
};
E.prototype.lastIndexOf = function(e, r, n) {
  return us(this, e, r, n, !1);
};
function bf(t, e, r, n) {
  r = Number(r) || 0;
  var i = t.length - r;
  n ? (n = Number(n), n > i && (n = i)) : n = i;
  var a = e.length;
  if (a % 2 !== 0)
    throw new TypeError("Invalid hex string");
  n > a / 2 && (n = a / 2);
  for (var o = 0; o < n; ++o) {
    var u = parseInt(e.substr(o * 2, 2), 16);
    if (isNaN(u))
      return o;
    t[r + o] = u;
  }
  return o;
}
function wf(t, e, r, n) {
  return xn(dn(e, t.length - r), t, r, n);
}
function fs(t, e, r, n) {
  return xn(Bf(e), t, r, n);
}
function mf(t, e, r, n) {
  return fs(t, e, r, n);
}
function xf(t, e, r, n) {
  return xn(ps(e), t, r, n);
}
function Ef(t, e, r, n) {
  return xn(Pf(e, t.length - r), t, r, n);
}
E.prototype.write = function(e, r, n, i) {
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
  if ((n === void 0 || n > a) && (n = a), e.length > 0 && (n < 0 || r < 0) || r > this.length)
    throw new RangeError("Attempt to write outside buffer bounds");
  i || (i = "utf8");
  for (var o = !1; ; )
    switch (i) {
      case "hex":
        return bf(this, e, r, n);
      case "utf8":
      case "utf-8":
        return wf(this, e, r, n);
      case "ascii":
        return fs(this, e, r, n);
      case "latin1":
      case "binary":
        return mf(this, e, r, n);
      case "base64":
        return xf(this, e, r, n);
      case "ucs2":
      case "ucs-2":
      case "utf16le":
      case "utf-16le":
        return Ef(this, e, r, n);
      default:
        if (o)
          throw new TypeError("Unknown encoding: " + i);
        i = ("" + i).toLowerCase(), o = !0;
    }
};
E.prototype.toJSON = function() {
  return {
    type: "Buffer",
    data: Array.prototype.slice.call(this._arr || this, 0)
  };
};
function Sf(t, e, r) {
  return e === 0 && r === t.length ? go(t) : go(t.slice(e, r));
}
function ls(t, e, r) {
  r = Math.min(t.length, r);
  for (var n = [], i = e; i < r; ) {
    var a = t[i], o = null, u = a > 239 ? 4 : a > 223 ? 3 : a > 191 ? 2 : 1;
    if (i + u <= r) {
      var s, f, h, l;
      switch (u) {
        case 1:
          a < 128 && (o = a);
          break;
        case 2:
          s = t[i + 1], (s & 192) === 128 && (l = (a & 31) << 6 | s & 63, l > 127 && (o = l));
          break;
        case 3:
          s = t[i + 1], f = t[i + 2], (s & 192) === 128 && (f & 192) === 128 && (l = (a & 15) << 12 | (s & 63) << 6 | f & 63, l > 2047 && (l < 55296 || l > 57343) && (o = l));
          break;
        case 4:
          s = t[i + 1], f = t[i + 2], h = t[i + 3], (s & 192) === 128 && (f & 192) === 128 && (h & 192) === 128 && (l = (a & 15) << 18 | (s & 63) << 12 | (f & 63) << 6 | h & 63, l > 65535 && l < 1114112 && (o = l));
      }
    }
    o === null ? (o = 65533, u = 1) : o > 65535 && (o -= 65536, n.push(o >>> 10 & 1023 | 55296), o = 56320 | o & 1023), n.push(o), i += u;
  }
  return Rf(n);
}
var wo = 4096;
function Rf(t) {
  var e = t.length;
  if (e <= wo)
    return String.fromCharCode.apply(String, t);
  for (var r = "", n = 0; n < e; )
    r += String.fromCharCode.apply(
      String,
      t.slice(n, n += wo)
    );
  return r;
}
function Cf(t, e, r) {
  var n = "";
  r = Math.min(t.length, r);
  for (var i = e; i < r; ++i)
    n += String.fromCharCode(t[i] & 127);
  return n;
}
function Of(t, e, r) {
  var n = "";
  r = Math.min(t.length, r);
  for (var i = e; i < r; ++i)
    n += String.fromCharCode(t[i]);
  return n;
}
function Af(t, e, r) {
  var n = t.length;
  (!e || e < 0) && (e = 0), (!r || r < 0 || r > n) && (r = n);
  for (var i = "", a = e; a < r; ++a)
    i += Lf(t[a]);
  return i;
}
function kf(t, e, r) {
  for (var n = t.slice(e, r), i = "", a = 0; a < n.length; a += 2)
    i += String.fromCharCode(n[a] + n[a + 1] * 256);
  return i;
}
E.prototype.slice = function(e, r) {
  var n = this.length;
  e = ~~e, r = r === void 0 ? n : ~~r, e < 0 ? (e += n, e < 0 && (e = 0)) : e > n && (e = n), r < 0 ? (r += n, r < 0 && (r = 0)) : r > n && (r = n), r < e && (r = e);
  var i;
  if (E.TYPED_ARRAY_SUPPORT)
    i = this.subarray(e, r), i.__proto__ = E.prototype;
  else {
    var a = r - e;
    i = new E(a, void 0);
    for (var o = 0; o < a; ++o)
      i[o] = this[o + e];
  }
  return i;
};
function me(t, e, r) {
  if (t % 1 !== 0 || t < 0)
    throw new RangeError("offset is not uint");
  if (t + e > r)
    throw new RangeError("Trying to access beyond buffer length");
}
E.prototype.readUIntLE = function(e, r, n) {
  e = e | 0, r = r | 0, n || me(e, r, this.length);
  for (var i = this[e], a = 1, o = 0; ++o < r && (a *= 256); )
    i += this[e + o] * a;
  return i;
};
E.prototype.readUIntBE = function(e, r, n) {
  e = e | 0, r = r | 0, n || me(e, r, this.length);
  for (var i = this[e + --r], a = 1; r > 0 && (a *= 256); )
    i += this[e + --r] * a;
  return i;
};
E.prototype.readUInt8 = function(e, r) {
  return r || me(e, 1, this.length), this[e];
};
E.prototype.readUInt16LE = function(e, r) {
  return r || me(e, 2, this.length), this[e] | this[e + 1] << 8;
};
E.prototype.readUInt16BE = function(e, r) {
  return r || me(e, 2, this.length), this[e] << 8 | this[e + 1];
};
E.prototype.readUInt32LE = function(e, r) {
  return r || me(e, 4, this.length), (this[e] | this[e + 1] << 8 | this[e + 2] << 16) + this[e + 3] * 16777216;
};
E.prototype.readUInt32BE = function(e, r) {
  return r || me(e, 4, this.length), this[e] * 16777216 + (this[e + 1] << 16 | this[e + 2] << 8 | this[e + 3]);
};
E.prototype.readIntLE = function(e, r, n) {
  e = e | 0, r = r | 0, n || me(e, r, this.length);
  for (var i = this[e], a = 1, o = 0; ++o < r && (a *= 256); )
    i += this[e + o] * a;
  return a *= 128, i >= a && (i -= Math.pow(2, 8 * r)), i;
};
E.prototype.readIntBE = function(e, r, n) {
  e = e | 0, r = r | 0, n || me(e, r, this.length);
  for (var i = r, a = 1, o = this[e + --i]; i > 0 && (a *= 256); )
    o += this[e + --i] * a;
  return a *= 128, o >= a && (o -= Math.pow(2, 8 * r)), o;
};
E.prototype.readInt8 = function(e, r) {
  return r || me(e, 1, this.length), this[e] & 128 ? (255 - this[e] + 1) * -1 : this[e];
};
E.prototype.readInt16LE = function(e, r) {
  r || me(e, 2, this.length);
  var n = this[e] | this[e + 1] << 8;
  return n & 32768 ? n | 4294901760 : n;
};
E.prototype.readInt16BE = function(e, r) {
  r || me(e, 2, this.length);
  var n = this[e + 1] | this[e] << 8;
  return n & 32768 ? n | 4294901760 : n;
};
E.prototype.readInt32LE = function(e, r) {
  return r || me(e, 4, this.length), this[e] | this[e + 1] << 8 | this[e + 2] << 16 | this[e + 3] << 24;
};
E.prototype.readInt32BE = function(e, r) {
  return r || me(e, 4, this.length), this[e] << 24 | this[e + 1] << 16 | this[e + 2] << 8 | this[e + 3];
};
E.prototype.readFloatLE = function(e, r) {
  return r || me(e, 4, this.length), bn(this, e, !0, 23, 4);
};
E.prototype.readFloatBE = function(e, r) {
  return r || me(e, 4, this.length), bn(this, e, !1, 23, 4);
};
E.prototype.readDoubleLE = function(e, r) {
  return r || me(e, 8, this.length), bn(this, e, !0, 52, 8);
};
E.prototype.readDoubleBE = function(e, r) {
  return r || me(e, 8, this.length), bn(this, e, !1, 52, 8);
};
function Te(t, e, r, n, i, a) {
  if (!nt(t))
    throw new TypeError('"buffer" argument must be a Buffer instance');
  if (e > i || e < a)
    throw new RangeError('"value" argument is out of bounds');
  if (r + n > t.length)
    throw new RangeError("Index out of range");
}
E.prototype.writeUIntLE = function(e, r, n, i) {
  if (e = +e, r = r | 0, n = n | 0, !i) {
    var a = Math.pow(2, 8 * n) - 1;
    Te(this, e, r, n, a, 0);
  }
  var o = 1, u = 0;
  for (this[r] = e & 255; ++u < n && (o *= 256); )
    this[r + u] = e / o & 255;
  return r + n;
};
E.prototype.writeUIntBE = function(e, r, n, i) {
  if (e = +e, r = r | 0, n = n | 0, !i) {
    var a = Math.pow(2, 8 * n) - 1;
    Te(this, e, r, n, a, 0);
  }
  var o = n - 1, u = 1;
  for (this[r + o] = e & 255; --o >= 0 && (u *= 256); )
    this[r + o] = e / u & 255;
  return r + n;
};
E.prototype.writeUInt8 = function(e, r, n) {
  return e = +e, r = r | 0, n || Te(this, e, r, 1, 255, 0), E.TYPED_ARRAY_SUPPORT || (e = Math.floor(e)), this[r] = e & 255, r + 1;
};
function wn(t, e, r, n) {
  e < 0 && (e = 65535 + e + 1);
  for (var i = 0, a = Math.min(t.length - r, 2); i < a; ++i)
    t[r + i] = (e & 255 << 8 * (n ? i : 1 - i)) >>> (n ? i : 1 - i) * 8;
}
E.prototype.writeUInt16LE = function(e, r, n) {
  return e = +e, r = r | 0, n || Te(this, e, r, 2, 65535, 0), E.TYPED_ARRAY_SUPPORT ? (this[r] = e & 255, this[r + 1] = e >>> 8) : wn(this, e, r, !0), r + 2;
};
E.prototype.writeUInt16BE = function(e, r, n) {
  return e = +e, r = r | 0, n || Te(this, e, r, 2, 65535, 0), E.TYPED_ARRAY_SUPPORT ? (this[r] = e >>> 8, this[r + 1] = e & 255) : wn(this, e, r, !1), r + 2;
};
function mn(t, e, r, n) {
  e < 0 && (e = 4294967295 + e + 1);
  for (var i = 0, a = Math.min(t.length - r, 4); i < a; ++i)
    t[r + i] = e >>> (n ? i : 3 - i) * 8 & 255;
}
E.prototype.writeUInt32LE = function(e, r, n) {
  return e = +e, r = r | 0, n || Te(this, e, r, 4, 4294967295, 0), E.TYPED_ARRAY_SUPPORT ? (this[r + 3] = e >>> 24, this[r + 2] = e >>> 16, this[r + 1] = e >>> 8, this[r] = e & 255) : mn(this, e, r, !0), r + 4;
};
E.prototype.writeUInt32BE = function(e, r, n) {
  return e = +e, r = r | 0, n || Te(this, e, r, 4, 4294967295, 0), E.TYPED_ARRAY_SUPPORT ? (this[r] = e >>> 24, this[r + 1] = e >>> 16, this[r + 2] = e >>> 8, this[r + 3] = e & 255) : mn(this, e, r, !1), r + 4;
};
E.prototype.writeIntLE = function(e, r, n, i) {
  if (e = +e, r = r | 0, !i) {
    var a = Math.pow(2, 8 * n - 1);
    Te(this, e, r, n, a - 1, -a);
  }
  var o = 0, u = 1, s = 0;
  for (this[r] = e & 255; ++o < n && (u *= 256); )
    e < 0 && s === 0 && this[r + o - 1] !== 0 && (s = 1), this[r + o] = (e / u >> 0) - s & 255;
  return r + n;
};
E.prototype.writeIntBE = function(e, r, n, i) {
  if (e = +e, r = r | 0, !i) {
    var a = Math.pow(2, 8 * n - 1);
    Te(this, e, r, n, a - 1, -a);
  }
  var o = n - 1, u = 1, s = 0;
  for (this[r + o] = e & 255; --o >= 0 && (u *= 256); )
    e < 0 && s === 0 && this[r + o + 1] !== 0 && (s = 1), this[r + o] = (e / u >> 0) - s & 255;
  return r + n;
};
E.prototype.writeInt8 = function(e, r, n) {
  return e = +e, r = r | 0, n || Te(this, e, r, 1, 127, -128), E.TYPED_ARRAY_SUPPORT || (e = Math.floor(e)), e < 0 && (e = 255 + e + 1), this[r] = e & 255, r + 1;
};
E.prototype.writeInt16LE = function(e, r, n) {
  return e = +e, r = r | 0, n || Te(this, e, r, 2, 32767, -32768), E.TYPED_ARRAY_SUPPORT ? (this[r] = e & 255, this[r + 1] = e >>> 8) : wn(this, e, r, !0), r + 2;
};
E.prototype.writeInt16BE = function(e, r, n) {
  return e = +e, r = r | 0, n || Te(this, e, r, 2, 32767, -32768), E.TYPED_ARRAY_SUPPORT ? (this[r] = e >>> 8, this[r + 1] = e & 255) : wn(this, e, r, !1), r + 2;
};
E.prototype.writeInt32LE = function(e, r, n) {
  return e = +e, r = r | 0, n || Te(this, e, r, 4, 2147483647, -2147483648), E.TYPED_ARRAY_SUPPORT ? (this[r] = e & 255, this[r + 1] = e >>> 8, this[r + 2] = e >>> 16, this[r + 3] = e >>> 24) : mn(this, e, r, !0), r + 4;
};
E.prototype.writeInt32BE = function(e, r, n) {
  return e = +e, r = r | 0, n || Te(this, e, r, 4, 2147483647, -2147483648), e < 0 && (e = 4294967295 + e + 1), E.TYPED_ARRAY_SUPPORT ? (this[r] = e >>> 24, this[r + 1] = e >>> 16, this[r + 2] = e >>> 8, this[r + 3] = e & 255) : mn(this, e, r, !1), r + 4;
};
function cs(t, e, r, n, i, a) {
  if (r + n > t.length)
    throw new RangeError("Index out of range");
  if (r < 0)
    throw new RangeError("Index out of range");
}
function hs(t, e, r, n, i) {
  return i || cs(t, e, r, 4), rs(t, e, r, n, 23, 4), r + 4;
}
E.prototype.writeFloatLE = function(e, r, n) {
  return hs(this, e, r, !0, n);
};
E.prototype.writeFloatBE = function(e, r, n) {
  return hs(this, e, r, !1, n);
};
function ds(t, e, r, n, i) {
  return i || cs(t, e, r, 8), rs(t, e, r, n, 52, 8), r + 8;
}
E.prototype.writeDoubleLE = function(e, r, n) {
  return ds(this, e, r, !0, n);
};
E.prototype.writeDoubleBE = function(e, r, n) {
  return ds(this, e, r, !1, n);
};
E.prototype.copy = function(e, r, n, i) {
  if (n || (n = 0), !i && i !== 0 && (i = this.length), r >= e.length && (r = e.length), r || (r = 0), i > 0 && i < n && (i = n), i === n || e.length === 0 || this.length === 0)
    return 0;
  if (r < 0)
    throw new RangeError("targetStart out of bounds");
  if (n < 0 || n >= this.length)
    throw new RangeError("sourceStart out of bounds");
  if (i < 0)
    throw new RangeError("sourceEnd out of bounds");
  i > this.length && (i = this.length), e.length - r < i - n && (i = e.length - r + n);
  var a = i - n, o;
  if (this === e && n < r && r < i)
    for (o = a - 1; o >= 0; --o)
      e[o + r] = this[o + n];
  else if (a < 1e3 || !E.TYPED_ARRAY_SUPPORT)
    for (o = 0; o < a; ++o)
      e[o + r] = this[o + n];
  else
    Uint8Array.prototype.set.call(
      e,
      this.subarray(n, n + a),
      r
    );
  return a;
};
E.prototype.fill = function(e, r, n, i) {
  if (typeof e == "string") {
    if (typeof r == "string" ? (i = r, r = 0, n = this.length) : typeof n == "string" && (i = n, n = this.length), e.length === 1) {
      var a = e.charCodeAt(0);
      a < 256 && (e = a);
    }
    if (i !== void 0 && typeof i != "string")
      throw new TypeError("encoding must be a string");
    if (typeof i == "string" && !E.isEncoding(i))
      throw new TypeError("Unknown encoding: " + i);
  } else
    typeof e == "number" && (e = e & 255);
  if (r < 0 || this.length < r || this.length < n)
    throw new RangeError("Out of range index");
  if (n <= r)
    return this;
  r = r >>> 0, n = n === void 0 ? this.length : n >>> 0, e || (e = 0);
  var o;
  if (typeof e == "number")
    for (o = r; o < n; ++o)
      this[o] = e;
  else {
    var u = nt(e) ? e : dn(new E(e, i).toString()), s = u.length;
    for (o = 0; o < n - r; ++o)
      this[o + r] = u[o % s];
  }
  return this;
};
var Mf = /[^+\/0-9A-Za-z-_]/g;
function If(t) {
  if (t = Tf(t).replace(Mf, ""), t.length < 2)
    return "";
  for (; t.length % 4 !== 0; )
    t = t + "=";
  return t;
}
function Tf(t) {
  return t.trim ? t.trim() : t.replace(/^\s+|\s+$/g, "");
}
function Lf(t) {
  return t < 16 ? "0" + t.toString(16) : t.toString(16);
}
function dn(t, e) {
  e = e || 1 / 0;
  for (var r, n = t.length, i = null, a = [], o = 0; o < n; ++o) {
    if (r = t.charCodeAt(o), r > 55295 && r < 57344) {
      if (!i) {
        if (r > 56319) {
          (e -= 3) > -1 && a.push(239, 191, 189);
          continue;
        } else if (o + 1 === n) {
          (e -= 3) > -1 && a.push(239, 191, 189);
          continue;
        }
        i = r;
        continue;
      }
      if (r < 56320) {
        (e -= 3) > -1 && a.push(239, 191, 189), i = r;
        continue;
      }
      r = (i - 55296 << 10 | r - 56320) + 65536;
    } else
      i && (e -= 3) > -1 && a.push(239, 191, 189);
    if (i = null, r < 128) {
      if ((e -= 1) < 0)
        break;
      a.push(r);
    } else if (r < 2048) {
      if ((e -= 2) < 0)
        break;
      a.push(
        r >> 6 | 192,
        r & 63 | 128
      );
    } else if (r < 65536) {
      if ((e -= 3) < 0)
        break;
      a.push(
        r >> 12 | 224,
        r >> 6 & 63 | 128,
        r & 63 | 128
      );
    } else if (r < 1114112) {
      if ((e -= 4) < 0)
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
function Bf(t) {
  for (var e = [], r = 0; r < t.length; ++r)
    e.push(t.charCodeAt(r) & 255);
  return e;
}
function Pf(t, e) {
  for (var r, n, i, a = [], o = 0; o < t.length && !((e -= 2) < 0); ++o)
    r = t.charCodeAt(o), n = r >> 8, i = r % 256, a.push(i), a.push(n);
  return a;
}
function ps(t) {
  return uf(If(t));
}
function xn(t, e, r, n) {
  for (var i = 0; i < n && !(i + r >= e.length || i >= t.length); ++i)
    e[i + r] = t[i];
  return i;
}
function Hf(t) {
  return t !== t;
}
function _s(t) {
  return t != null && (!!t._isBuffer || vs(t) || qf(t));
}
function vs(t) {
  return !!t.constructor && typeof t.constructor.isBuffer == "function" && t.constructor.isBuffer(t);
}
function qf(t) {
  return typeof t.readFloatLE == "function" && typeof t.slice == "function" && vs(t.slice(0, 0));
}
const Df = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Buffer: E,
  INSPECT_MAX_BYTES: is,
  SlowBuffer: yf,
  isBuffer: _s,
  kMaxLength: hf
}, Symbol.toStringTag, { value: "Module" }));
function jf() {
  return E.from($e.randomPrivateKey()).toString("hex");
}
function ys(t) {
  return E.from(ji.getPublicKey(t)).toString("hex");
}
var R = typeof globalThis != "undefined" ? globalThis : typeof window != "undefined" ? window : typeof global != "undefined" ? global : typeof self != "undefined" ? self : {};
function Ui(t) {
  var e = t.default;
  if (typeof e == "function") {
    var r = function() {
      return e.apply(this, arguments);
    };
    r.prototype = e.prototype;
  } else
    r = {};
  return Object.defineProperty(r, "__esModule", { value: !0 }), Object.keys(t).forEach(function(n) {
    var i = Object.getOwnPropertyDescriptor(t, n);
    Object.defineProperty(r, n, i.get ? i : {
      enumerable: !0,
      get: function() {
        return t[n];
      }
    });
  }), r;
}
var Pr = {};
Object.defineProperty(Pr, "__esModule", { value: !0 });
Pr.is_node = void 0;
var Wn = null;
function Nf() {
  return Wn === null && (Wn = typeof R == "object" && typeof R.process == "object" && typeof R.process.versions == "object" && typeof R.process.versions.node != "undefined"), Wn;
}
Pr.is_node = Nf;
var zn = {}, Vn, mo;
function Ff() {
  if (mo)
    return Vn;
  mo = 1;
  var t = function() {
    if (typeof self == "object" && self)
      return self;
    if (typeof window == "object" && window)
      return window;
    throw new Error("Unable to resolve global `this`");
  };
  return Vn = function() {
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
    } catch (e) {
      return t();
    }
    try {
      return __global__ || t();
    } finally {
      delete Object.prototype.__global__;
    }
  }(), Vn;
}
const $f = "websocket", Uf = "Websocket Client & Server Library implementing the WebSocket protocol as specified in RFC 6455.", Wf = [
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
], zf = "Brian McKelvey <theturtle32@gmail.com> (https://github.com/theturtle32)", Vf = [
  "I\xF1aki Baz Castillo <ibc@aliax.net> (http://dev.sipdoc.net)"
], Yf = "1.0.34", Gf = {
  type: "git",
  url: "https://github.com/theturtle32/WebSocket-Node.git"
}, Zf = "https://github.com/theturtle32/WebSocket-Node", Kf = {
  node: ">=4.0.0"
}, Xf = {
  bufferutil: "^4.0.1",
  debug: "^2.2.0",
  "es5-ext": "^0.10.50",
  "typedarray-to-buffer": "^3.1.5",
  "utf-8-validate": "^5.0.2",
  yaeti: "^0.0.6"
}, Qf = {
  "buffer-equal": "^1.0.0",
  gulp: "^4.0.2",
  "gulp-jshint": "^2.0.4",
  "jshint-stylish": "^2.2.1",
  jshint: "^2.0.0",
  tape: "^4.9.1"
}, Jf = {
  verbose: !1
}, el = {
  test: "tape test/unit/*.js",
  gulp: "gulp"
}, tl = "index", rl = {
  lib: "./lib"
}, nl = "lib/browser.js", il = "Apache-2.0", ol = {
  name: $f,
  description: Uf,
  keywords: Wf,
  author: zf,
  contributors: Vf,
  version: Yf,
  repository: Gf,
  homepage: Zf,
  engines: Kf,
  dependencies: Xf,
  devDependencies: Qf,
  config: Jf,
  scripts: el,
  main: tl,
  directories: rl,
  browser: nl,
  license: il
};
var Yn, xo;
function al() {
  return xo || (xo = 1, Yn = ol.version), Yn;
}
var Gn, Eo;
function sl() {
  if (Eo)
    return Gn;
  Eo = 1;
  var t;
  if (typeof globalThis == "object")
    t = globalThis;
  else
    try {
      t = Ff();
    } catch (i) {
    } finally {
      if (!t && typeof window != "undefined" && (t = window), !t)
        throw new Error("Could not determine global this");
    }
  var e = t.WebSocket || t.MozWebSocket, r = al();
  function n(i, a) {
    var o;
    return a ? o = new e(i, a) : o = new e(i), o;
  }
  return e && ["CONNECTING", "OPEN", "CLOSING", "CLOSED"].forEach(function(i) {
    Object.defineProperty(n, i, {
      get: function() {
        return e[i];
      }
    });
  }), Gn = {
    w3cwebsocket: e ? n : null,
    version: r
  }, Gn;
}
var Zr = {}, Zn = {}, Kt = {}, Xt = {}, Qt = {}, Jt = {}, So;
function ul() {
  if (So)
    return Jt;
  So = 1, Object.defineProperty(Jt, "__esModule", { value: !0 }), Jt.ForOfAdaptor = void 0;
  var t = function() {
    function e(r, n) {
      this.it_ = r, this.last_ = n;
    }
    return e.prototype.next = function() {
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
    }, e.prototype[Symbol.iterator] = function() {
      return this;
    }, e;
  }();
  return Jt.ForOfAdaptor = t, Jt;
}
var Ro;
function Wi() {
  if (Ro)
    return Qt;
  Ro = 1;
  var t = R && R.__values || function(n) {
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
  Object.defineProperty(Qt, "__esModule", { value: !0 }), Qt.Container = void 0;
  var e = ul(), r = function() {
    function n() {
    }
    return n.prototype.empty = function() {
      return this.size() === 0;
    }, n.prototype.rbegin = function() {
      return this.end().reverse();
    }, n.prototype.rend = function() {
      return this.begin().reverse();
    }, n.prototype[Symbol.iterator] = function() {
      return new e.ForOfAdaptor(this.begin(), this.end());
    }, n.prototype.toJSON = function() {
      var i, a, o = [];
      try {
        for (var u = t(this), s = u.next(); !s.done; s = u.next()) {
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
  return Qt.Container = r, Qt;
}
var er = {}, Co;
function zi() {
  if (Co)
    return er;
  Co = 1;
  var t = R && R.__read || function(r, n) {
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
  Object.defineProperty(er, "__esModule", { value: !0 }), er.NativeArrayIterator = void 0;
  var e = function() {
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
      i = t([n.data_, this.data_], 2), this.data_ = i[0], n.data_ = i[1], a = t([n.index_, this.index_], 2), this.index_ = a[0], n.index_ = a[1];
    }, r;
  }();
  return er.NativeArrayIterator = e, er;
}
var Oo;
function fl() {
  if (Oo)
    return Xt;
  Oo = 1;
  var t = R && R.__extends || function() {
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
  Object.defineProperty(Xt, "__esModule", { value: !0 }), Xt.SetContainer = void 0;
  var e = Wi(), r = zi(), n = function(i) {
    t(a, i);
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
  }(e.Container);
  return Xt.SetContainer = n, Xt;
}
var Kn = {}, tr = {}, rr = {}, nr = {}, Ao;
function ll() {
  if (Ao)
    return nr;
  Ao = 1;
  var t = R && R.__extends || function() {
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
  Object.defineProperty(nr, "__esModule", { value: !0 }), nr.Exception = void 0;
  var e = function(r) {
    t(n, r);
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
  return nr.Exception = e, nr;
}
var ko;
function gs() {
  if (ko)
    return rr;
  ko = 1;
  var t = R && R.__extends || function() {
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
  Object.defineProperty(rr, "__esModule", { value: !0 }), rr.LogicError = void 0;
  var e = ll(), r = function(n) {
    t(i, n);
    function i(a) {
      return n.call(this, a) || this;
    }
    return i;
  }(e.Exception);
  return rr.LogicError = r, rr;
}
var Mo;
function bs() {
  if (Mo)
    return tr;
  Mo = 1;
  var t = R && R.__extends || function() {
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
  Object.defineProperty(tr, "__esModule", { value: !0 }), tr.InvalidArgument = void 0;
  var e = gs(), r = function(n) {
    t(i, n);
    function i(a) {
      return n.call(this, a) || this;
    }
    return i;
  }(e.LogicError);
  return tr.InvalidArgument = r, tr;
}
var ir = {}, Io;
function cl() {
  if (Io)
    return ir;
  Io = 1;
  var t = R && R.__extends || function() {
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
  Object.defineProperty(ir, "__esModule", { value: !0 }), ir.OutOfRange = void 0;
  var e = gs(), r = function(n) {
    t(i, n);
    function i(a) {
      return n.call(this, a) || this;
    }
    return i;
  }(e.LogicError);
  return ir.OutOfRange = r, ir;
}
var To;
function En() {
  return To || (To = 1, function(t) {
    Object.defineProperty(t, "__esModule", { value: !0 }), t.ErrorGenerator = void 0;
    var e = bs(), r = cl();
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
      function o(d, p, _) {
        return new r.OutOfRange("Error on ".concat(i(d), ".").concat(p, "(): parametric index is negative -> (index = ").concat(_, ")."));
      }
      n.negative_index = o;
      function u(d, p, _, m) {
        return new r.OutOfRange("Error on ".concat(i(d), ".").concat(p, "(): parametric index is equal or greater than size -> (index = ").concat(_, ", size: ").concat(m, ")."));
      }
      n.excessive_index = u;
      function s(d, p) {
        return new e.InvalidArgument("Error on ".concat(i(d), ".").concat(p, "(): parametric iterator is not this container's own."));
      }
      n.not_my_iterator = s;
      function f(d, p) {
        return new e.InvalidArgument("Error on ".concat(i(d), ".").concat(p, "(): parametric iterator, it already has been erased."));
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
    })(t.ErrorGenerator || (t.ErrorGenerator = {}));
  }(Kn)), Kn;
}
var Lo;
function hl() {
  if (Lo)
    return Kt;
  Lo = 1;
  var t = R && R.__extends || function() {
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
  }(), e = R && R.__read || function(o, u) {
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
  }, r = R && R.__spreadArray || function(o, u, s) {
    if (s || arguments.length === 2)
      for (var f = 0, h = u.length, l; f < h; f++)
        (l || !(f in u)) && (l || (l = Array.prototype.slice.call(u, 0, f)), l[f] = u[f]);
    return o.concat(l || Array.prototype.slice.call(u));
  };
  Object.defineProperty(Kt, "__esModule", { value: !0 }), Kt.UniqueSet = void 0;
  var n = fl(), i = En(), a = function(o) {
    t(u, o);
    function u() {
      return o !== null && o.apply(this, arguments) || this;
    }
    return u.prototype.count = function(s) {
      return this.find(s).equals(this.end()) ? 0 : 1;
    }, u.prototype.insert = function() {
      for (var s = [], f = 0; f < arguments.length; f++)
        s[f] = arguments[f];
      return o.prototype.insert.apply(this, r([], e(s), !1));
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
  return Kt.UniqueSet = a, Kt;
}
var Xn = {}, Qn = {}, Bo;
function dl() {
  return Bo || (Bo = 1, function(t) {
    var e = R && R.__read || function(n, i) {
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
    }, r = R && R.__spreadArray || function(n, i, a) {
      if (a || arguments.length === 2)
        for (var o = 0, u = i.length, s; o < u; o++)
          (s || !(o in i)) && (s || (s = Array.prototype.slice.call(i, 0, o)), s[o] = i[o]);
      return n.concat(s || Array.prototype.slice.call(i));
    };
    Object.defineProperty(t, "__esModule", { value: !0 }), t.IAssociativeContainer = void 0, function(n) {
      function i(a) {
        for (var o = [], u = 1; u < arguments.length; u++)
          o[u - 1] = arguments[u];
        var s, f;
        return o.length >= 1 && o[0] instanceof Array ? (s = function() {
          var h = o[0];
          a.push.apply(a, r([], e(h), !1));
        }, f = o.slice(1)) : o.length >= 2 && o[0].next instanceof Function && o[1].next instanceof Function ? (s = function() {
          var h = o[0], l = o[1];
          a.assign(h, l);
        }, f = o.slice(2)) : (s = null, f = o), { ramda: s, tail: f };
      }
      n.construct = i;
    }(t.IAssociativeContainer || (t.IAssociativeContainer = {}));
  }(Qn)), Qn;
}
var or = {}, ar = {}, sr = {}, Po;
function pl() {
  if (Po)
    return sr;
  Po = 1, Object.defineProperty(sr, "__esModule", { value: !0 }), sr._Get_root = void 0;
  var t = Pr;
  function e() {
    return r === null && (r = (0, t.is_node)() ? R : self, r.__s_iUID === void 0 && (r.__s_iUID = 0)), r;
  }
  sr._Get_root = e;
  var r = null;
  return sr;
}
var Ho;
function ws() {
  if (Ho)
    return ar;
  Ho = 1, Object.defineProperty(ar, "__esModule", { value: !0 }), ar.get_uid = void 0;
  var t = pl();
  function e(r) {
    if (r instanceof Object) {
      if (r.hasOwnProperty("__get_m_iUID") === !1) {
        var n = ++(0, t._Get_root)().__s_iUID;
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
  return ar.get_uid = e, ar;
}
var qo;
function Vi() {
  if (qo)
    return or;
  qo = 1;
  var t = R && R.__values || function(s) {
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
  Object.defineProperty(or, "__esModule", { value: !0 }), or.hash = void 0;
  var e = ws();
  function r() {
    for (var s, f, h = [], l = 0; l < arguments.length; l++)
      h[l] = arguments[l];
    var c = o;
    try {
      for (var d = t(h), p = d.next(); !p.done; p = d.next()) {
        var _ = p.value;
        _ = _ && _.valueOf();
        var m = typeof _;
        if (m === "boolean")
          c = n(_, c);
        else if (m === "number" || m === "bigint")
          c = i(_, c);
        else if (m === "string")
          c = a(_, c);
        else if (_ instanceof Object && _.hashCode instanceof Function) {
          var b = _.hashCode();
          if (h.length === 1)
            return b;
          c = c ^ b, c *= u;
        } else
          c = i((0, e.get_uid)(_), c);
      }
    } catch (w) {
      s = { error: w };
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
  or.hash = r;
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
  return or;
}
var Ae = {}, Do;
function Yi() {
  if (Do)
    return Ae;
  Do = 1, Object.defineProperty(Ae, "__esModule", { value: !0 }), Ae.greater_equal = Ae.greater = Ae.less_equal = Ae.less = Ae.not_equal_to = Ae.equal_to = void 0;
  var t = ws();
  function e(u, s) {
    return u = u && u.valueOf(), s = s && s.valueOf(), u instanceof Object && u.equals instanceof Function ? u.equals(s) : u === s;
  }
  Ae.equal_to = e;
  function r(u, s) {
    return !e(u, s);
  }
  Ae.not_equal_to = r;
  function n(u, s) {
    return u = u.valueOf(), s = s.valueOf(), u instanceof Object ? u.less instanceof Function ? u.less(s) : (0, t.get_uid)(u) < (0, t.get_uid)(s) : u < s;
  }
  Ae.less = n;
  function i(u, s) {
    return n(u, s) || e(u, s);
  }
  Ae.less_equal = i;
  function a(u, s) {
    return !i(u, s);
  }
  Ae.greater = a;
  function o(u, s) {
    return !n(u, s);
  }
  return Ae.greater_equal = o, Ae;
}
var jo;
function ms() {
  return jo || (jo = 1, function(t) {
    var e = R && R.__read || function(o, u) {
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
    }, r = R && R.__spreadArray || function(o, u, s) {
      if (s || arguments.length === 2)
        for (var f = 0, h = u.length, l; f < h; f++)
          (l || !(f in u)) && (l || (l = Array.prototype.slice.call(u, 0, f)), l[f] = u[f]);
      return o.concat(l || Array.prototype.slice.call(u));
    };
    Object.defineProperty(t, "__esModule", { value: !0 }), t.IHashContainer = void 0;
    var n = dl(), i = Vi(), a = Yi();
    (function(o) {
      function u(s, f, h) {
        for (var l = [], c = 3; c < arguments.length; c++)
          l[c - 3] = arguments[c];
        var d = null, p = i.hash, _ = a.equal_to;
        if (l.length === 1 && l[0] instanceof f) {
          var m = l[0];
          p = m.hash_function(), _ = m.key_eq(), d = function() {
            var w = m.begin(), S = m.end();
            s.assign(w, S);
          };
        } else {
          var b = n.IAssociativeContainer.construct.apply(n.IAssociativeContainer, r([s], e(l), !1));
          d = b.ramda, b.tail.length >= 1 && (p = b.tail[0]), b.tail.length >= 2 && (_ = b.tail[1]);
        }
        h(p, _), d !== null && d();
      }
      o.construct = u;
    })(t.IHashContainer || (t.IHashContainer = {}));
  }(Xn)), Xn;
}
var Jn = {}, ur = {}, fr = {}, No;
function Gi() {
  if (No)
    return fr;
  No = 1, Object.defineProperty(fr, "__esModule", { value: !0 }), fr.ListIterator = void 0;
  var t = En(), e = function() {
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
        throw t.ErrorGenerator.iterator_end_value(this.source());
    }, r.prototype.equals = function(n) {
      return this === n;
    }, r;
  }();
  return fr.ListIterator = e, fr;
}
var lr = {}, Fo;
function _l() {
  if (Fo)
    return lr;
  Fo = 1, Object.defineProperty(lr, "__esModule", { value: !0 }), lr.Repeater = void 0;
  var t = function() {
    function e(r, n) {
      this.index_ = r, this.value_ = n;
    }
    return e.prototype.index = function() {
      return this.index_;
    }, Object.defineProperty(e.prototype, "value", {
      get: function() {
        return this.value_;
      },
      enumerable: !1,
      configurable: !0
    }), e.prototype.next = function() {
      return ++this.index_, this;
    }, e.prototype.equals = function(r) {
      return this.index_ === r.index_;
    }, e;
  }();
  return lr.Repeater = t, lr;
}
var ke = {}, $o;
function vl() {
  if ($o)
    return ke;
  $o = 1, Object.defineProperty(ke, "__esModule", { value: !0 }), ke.next = ke.prev = ke.advance = ke.distance = ke.size = ke.empty = void 0;
  var t = bs();
  function e(s) {
    return s instanceof Array ? s.length !== 0 : s.empty();
  }
  ke.empty = e;
  function r(s) {
    return s instanceof Array ? s.length : s.size();
  }
  ke.size = r;
  function n(s, f) {
    if (s.index instanceof Function)
      return i(s, f);
    for (var h = 0; !s.equals(f); s = s.next())
      ++h;
    return h;
  }
  ke.distance = n;
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
        throw new t.InvalidArgument("Error on std.advance(): parametric iterator is not a bi-directional iterator, thus advancing to negative direction is not possible.");
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
  ke.advance = a;
  function o(s, f) {
    return f === void 0 && (f = 1), f === 1 ? s.prev() : a(s, -f);
  }
  ke.prev = o;
  function u(s, f) {
    return f === void 0 && (f = 1), f === 1 ? s.next() : a(s, f);
  }
  return ke.next = u, ke;
}
var Uo;
function xs() {
  if (Uo)
    return ur;
  Uo = 1;
  var t = R && R.__extends || function() {
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
  }(), e = R && R.__read || function(f, h) {
    var l = typeof Symbol == "function" && f[Symbol.iterator];
    if (!l)
      return f;
    var c = l.call(f), d, p = [], _;
    try {
      for (; (h === void 0 || h-- > 0) && !(d = c.next()).done; )
        p.push(d.value);
    } catch (m) {
      _ = { error: m };
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
  Object.defineProperty(ur, "__esModule", { value: !0 }), ur.ListContainer = void 0;
  var r = Wi(), n = Gi(), i = _l(), a = zi(), o = vl(), u = En(), s = function(f) {
    t(h, f);
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
      var p = new i.Repeater(0, d), _ = new i.Repeater(c);
      return this._Insert_by_range(l, p, _);
    }, h.prototype._Insert_by_range = function(l, c, d) {
      for (var p = l.prev(), _ = null, m = 0, b = c; b.equals(d) === !1; b = b.next()) {
        var w = this._Create_iterator(p, null, b.value);
        m === 0 && (_ = w), n.ListIterator._Set_next(p, w), p = w, ++m;
      }
      return l.equals(this.begin()) === !0 && (this.begin_ = _), n.ListIterator._Set_next(p, l), n.ListIterator._Set_prev(l, p), this.size_ += m, _;
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
      c = e([l.begin_, this.begin_], 2), this.begin_ = c[0], l.begin_ = c[1], d = e([l.end_, this.end_], 2), this.end_ = d[0], l.end_ = d[1], p = e([l.size_, this.size_], 2), this.size_ = p[0], l.size_ = p[1];
    }, h;
  }(r.Container);
  return ur.ListContainer = s, ur;
}
var cr = {}, Wo;
function Es() {
  if (Wo)
    return cr;
  Wo = 1, Object.defineProperty(cr, "__esModule", { value: !0 }), cr.ReverseIterator = void 0;
  var t = function() {
    function e(r) {
      this.base_ = r.prev();
    }
    return e.prototype.source = function() {
      return this.base_.source();
    }, e.prototype.base = function() {
      return this.base_.next();
    }, Object.defineProperty(e.prototype, "value", {
      get: function() {
        return this.base_.value;
      },
      enumerable: !1,
      configurable: !0
    }), e.prototype.prev = function() {
      return this._Create_neighbor(this.base().next());
    }, e.prototype.next = function() {
      return this._Create_neighbor(this.base_);
    }, e.prototype.equals = function(r) {
      return this.base_.equals(r.base_);
    }, e;
  }();
  return cr.ReverseIterator = t, cr;
}
var zo;
function yl() {
  return zo || (zo = 1, function(t) {
    var e = R && R.__extends || function() {
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
    }(), r = R && R.__read || function(u, s) {
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
    Object.defineProperty(t, "__esModule", { value: !0 }), t.SetElementList = void 0;
    var n = xs(), i = Gi(), a = Es(), o = function(u) {
      e(s, u);
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
    t.SetElementList = o, function(u) {
      var s = function(h) {
        e(l, h);
        function l(c, d, p, _) {
          var m = h.call(this, d, p, _) || this;
          return m.source_ = c, m;
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
        e(l, h);
        function l() {
          return h !== null && h.apply(this, arguments) || this;
        }
        return l.prototype._Create_neighbor = function(c) {
          return new l(c);
        }, l;
      }(a.ReverseIterator);
      u.ReverseIterator = f;
    }(o = t.SetElementList || (t.SetElementList = {})), t.SetElementList = o;
  }(Jn)), Jn;
}
var hr = {}, dr = {}, Vo;
function Ss() {
  if (Vo)
    return dr;
  Vo = 1;
  var t = R && R.__values || function(i) {
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
  Object.defineProperty(dr, "__esModule", { value: !0 }), dr.HashBuckets = void 0;
  var e = function() {
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
        for (var c = t(this.data_), d = c.next(); !d.done; d = c.next()) {
          var p = d.value;
          try {
            for (var _ = (s = void 0, t(p)), m = _.next(); !m.done; m = _.next()) {
              var b = m.value, w = this.hasher_(this.fetcher_(b)) % h.length;
              h[w].push(b);
            }
          } catch (S) {
            s = { error: S };
          } finally {
            try {
              m && !m.done && (f = _.return) && f.call(_);
            } finally {
              if (s)
                throw s.error;
            }
          }
        }
      } catch (S) {
        o = { error: S };
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
  dr.HashBuckets = e;
  var r = 10, n = 1;
  return dr;
}
var Yo;
function gl() {
  if (Yo)
    return hr;
  Yo = 1;
  var t = R && R.__extends || function() {
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
  }(), e = R && R.__read || function(o, u) {
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
  }, r = R && R.__values || function(o) {
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
  Object.defineProperty(hr, "__esModule", { value: !0 }), hr.SetHashBuckets = void 0;
  var n = Ss(), i = function(o) {
    t(u, o);
    function u(s, f, h) {
      var l = o.call(this, a, f) || this;
      return l.source_ = s, l.key_eq_ = h, l;
    }
    return u._Swap_source = function(s, f) {
      var h;
      h = e([f.source_, s.source_], 2), s.source_ = h[0], f.source_ = h[1];
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
      } catch (m) {
        f = { error: m };
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
  hr.SetHashBuckets = i;
  function a(o) {
    return o.value;
  }
  return hr;
}
var gt = {}, Go;
function Rs() {
  if (Go)
    return gt;
  Go = 1, Object.defineProperty(gt, "__esModule", { value: !0 }), gt.make_pair = gt.Pair = void 0;
  var t = Vi(), e = Yi(), r = function() {
    function i(a, o) {
      this.first = a, this.second = o;
    }
    return i.prototype.equals = function(a) {
      return (0, e.equal_to)(this.first, a.first) && (0, e.equal_to)(this.second, a.second);
    }, i.prototype.less = function(a) {
      return (0, e.equal_to)(this.first, a.first) === !1 ? (0, e.less)(this.first, a.first) : (0, e.less)(this.second, a.second);
    }, i.prototype.hashCode = function() {
      return (0, t.hash)(this.first, this.second);
    }, i;
  }();
  gt.Pair = r;
  function n(i, a) {
    return new r(i, a);
  }
  return gt.make_pair = n, gt;
}
var Zo;
function bl() {
  return Zo || (Zo = 1, function(t) {
    var e = R && R.__extends || function() {
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
    }(), r = R && R.__read || function(h, l) {
      var c = typeof Symbol == "function" && h[Symbol.iterator];
      if (!c)
        return h;
      var d = c.call(h), p, _ = [], m;
      try {
        for (; (l === void 0 || l-- > 0) && !(p = d.next()).done; )
          _.push(p.value);
      } catch (b) {
        m = { error: b };
      } finally {
        try {
          p && !p.done && (c = d.return) && c.call(d);
        } finally {
          if (m)
            throw m.error;
        }
      }
      return _;
    }, n = R && R.__spreadArray || function(h, l, c) {
      if (c || arguments.length === 2)
        for (var d = 0, p = l.length, _; d < p; d++)
          (_ || !(d in l)) && (_ || (_ = Array.prototype.slice.call(l, 0, d)), _[d] = l[d]);
      return h.concat(_ || Array.prototype.slice.call(l));
    };
    Object.defineProperty(t, "__esModule", { value: !0 }), t.HashSet = void 0;
    var i = hl(), a = ms(), o = yl(), u = gl(), s = Rs(), f = function(h) {
      e(l, h);
      function l() {
        for (var c = [], d = 0; d < arguments.length; d++)
          c[d] = arguments[d];
        var p = h.call(this, function(_) {
          return new o.SetElementList(_);
        }) || this;
        return a.IHashContainer.construct.apply(a.IHashContainer, n([
          p,
          l,
          function(_, m) {
            p.buckets_ = new u.SetHashBuckets(p, _, m);
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
    t.HashSet = f, function(h) {
      h.Iterator = o.SetElementList.Iterator, h.ReverseIterator = o.SetElementList.ReverseIterator;
    }(f = t.HashSet || (t.HashSet = {})), t.HashSet = f;
  }(Zn)), Zn;
}
var ei = {}, pr = {}, _r = {}, Ko;
function wl() {
  if (Ko)
    return _r;
  Ko = 1;
  var t = R && R.__extends || function() {
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
  Object.defineProperty(_r, "__esModule", { value: !0 }), _r.MapContainer = void 0;
  var e = Wi(), r = zi(), n = function(i) {
    t(a, i);
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
  }(e.Container);
  return _r.MapContainer = n, _r;
}
var Xo;
function ml() {
  if (Xo)
    return pr;
  Xo = 1;
  var t = R && R.__extends || function() {
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
  }(), e = R && R.__read || function(o, u) {
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
  }, r = R && R.__spreadArray || function(o, u, s) {
    if (s || arguments.length === 2)
      for (var f = 0, h = u.length, l; f < h; f++)
        (l || !(f in u)) && (l || (l = Array.prototype.slice.call(u, 0, f)), l[f] = u[f]);
    return o.concat(l || Array.prototype.slice.call(u));
  };
  Object.defineProperty(pr, "__esModule", { value: !0 }), pr.UniqueMap = void 0;
  var n = wl(), i = En(), a = function(o) {
    t(u, o);
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
      return o.prototype.insert.apply(this, r([], e(s), !1));
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
  return pr.UniqueMap = a, pr;
}
var ti = {}, Qo;
function xl() {
  return Qo || (Qo = 1, function(t) {
    var e = R && R.__extends || function() {
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
    }(), r = R && R.__read || function(u, s) {
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
    Object.defineProperty(t, "__esModule", { value: !0 }), t.MapElementList = void 0;
    var n = xs(), i = Gi(), a = Es(), o = function(u) {
      e(s, u);
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
    t.MapElementList = o, function(u) {
      var s = function(h) {
        e(l, h);
        function l(c, d, p, _) {
          var m = h.call(this, d, p, _) || this;
          return m.list_ = c, m;
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
        e(l, h);
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
    }(o = t.MapElementList || (t.MapElementList = {})), t.MapElementList = o;
  }(ti)), ti;
}
var vr = {}, Jo;
function El() {
  if (Jo)
    return vr;
  Jo = 1;
  var t = R && R.__extends || function() {
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
  }(), e = R && R.__read || function(o, u) {
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
  }, r = R && R.__values || function(o) {
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
  Object.defineProperty(vr, "__esModule", { value: !0 }), vr.MapHashBuckets = void 0;
  var n = Ss(), i = function(o) {
    t(u, o);
    function u(s, f, h) {
      var l = o.call(this, a, f) || this;
      return l.source_ = s, l.key_eq_ = h, l;
    }
    return u._Swap_source = function(s, f) {
      var h;
      h = e([f.source_, s.source_], 2), s.source_ = h[0], f.source_ = h[1];
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
      } catch (m) {
        f = { error: m };
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
  vr.MapHashBuckets = i;
  function a(o) {
    return o.first;
  }
  return vr;
}
var yr = {}, ea;
function Sl() {
  if (ea)
    return yr;
  ea = 1, Object.defineProperty(yr, "__esModule", { value: !0 }), yr.Entry = void 0;
  var t = Vi(), e = Yi(), r = function() {
    function n(i, a) {
      this.first = i, this.second = a;
    }
    return n.prototype.equals = function(i) {
      return (0, e.equal_to)(this.first, i.first);
    }, n.prototype.less = function(i) {
      return (0, e.less)(this.first, i.first);
    }, n.prototype.hashCode = function() {
      return (0, t.hash)(this.first);
    }, n;
  }();
  return yr.Entry = r, yr;
}
var ta;
function Rl() {
  return ta || (ta = 1, function(t) {
    var e = R && R.__extends || function() {
      var l = function(c, d) {
        return l = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(p, _) {
          p.__proto__ = _;
        } || function(p, _) {
          for (var m in _)
            Object.prototype.hasOwnProperty.call(_, m) && (p[m] = _[m]);
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
    }(), r = R && R.__read || function(l, c) {
      var d = typeof Symbol == "function" && l[Symbol.iterator];
      if (!d)
        return l;
      var p = d.call(l), _, m = [], b;
      try {
        for (; (c === void 0 || c-- > 0) && !(_ = p.next()).done; )
          m.push(_.value);
      } catch (w) {
        b = { error: w };
      } finally {
        try {
          _ && !_.done && (d = p.return) && d.call(p);
        } finally {
          if (b)
            throw b.error;
        }
      }
      return m;
    }, n = R && R.__spreadArray || function(l, c, d) {
      if (d || arguments.length === 2)
        for (var p = 0, _ = c.length, m; p < _; p++)
          (m || !(p in c)) && (m || (m = Array.prototype.slice.call(c, 0, p)), m[p] = c[p]);
      return l.concat(m || Array.prototype.slice.call(c));
    };
    Object.defineProperty(t, "__esModule", { value: !0 }), t.HashMap = void 0;
    var i = ml(), a = ms(), o = xl(), u = El(), s = Sl(), f = Rs(), h = function(l) {
      e(c, l);
      function c() {
        for (var d = [], p = 0; p < arguments.length; p++)
          d[p] = arguments[p];
        var _ = l.call(this, function(m) {
          return new o.MapElementList(m);
        }) || this;
        return a.IHashContainer.construct.apply(a.IHashContainer, n([
          _,
          c,
          function(m, b) {
            _.buckets_ = new u.MapHashBuckets(_, m, b);
          }
        ], r(d), !1)), _;
      }
      return c.prototype.clear = function() {
        this.buckets_.clear(), l.prototype.clear.call(this);
      }, c.prototype.swap = function(d) {
        var p, _;
        p = r([d.data_, this.data_], 2), this.data_ = p[0], d.data_ = p[1], o.MapElementList._Swap_associative(this.data_, d.data_), u.MapHashBuckets._Swap_source(this.buckets_, d.buckets_), _ = r([d.buckets_, this.buckets_], 2), this.buckets_ = _[0], d.buckets_ = _[1];
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
        var m = this.find(p);
        return m.equals(this.end()) === !0 && (m = this.data_.insert(d, new s.Entry(p, _)), this._Handle_insert(m, m.next())), m;
      }, c.prototype._Handle_insert = function(d, p) {
        for (; !d.equals(p); d = d.next())
          this.buckets_.insert(d);
      }, c.prototype._Handle_erase = function(d, p) {
        for (; !d.equals(p); d = d.next())
          this.buckets_.erase(d);
      }, c;
    }(i.UniqueMap);
    t.HashMap = h, function(l) {
      l.Iterator = o.MapElementList.Iterator, l.ReverseIterator = o.MapElementList.ReverseIterator;
    }(h = t.HashMap || (t.HashMap = {})), t.HashMap = h;
  }(ei)), ei;
}
var ra;
function Cl() {
  if (ra)
    return Zr;
  ra = 1;
  var t = R && R.__values || function(i) {
    var a = typeof Symbol == "function" && i[Symbol.iterator], o = 0;
    return a ? a.call(i) : {
      next: function() {
        return i && o >= i.length && (i = void 0), { value: i && i[o++], done: !i };
      }
    };
  };
  Object.defineProperty(Zr, "__esModule", { value: !0 });
  var e = bl(), r = Rl(), n = function() {
    function i() {
      this.listeners_ = new r.HashMap(), this.created_at_ = new Date();
    }
    return i.prototype.dispatchEvent = function(a) {
      var o, u, s = this.listeners_.find(a.type);
      if (!s.equals(this.listeners_.end())) {
        a.target = this, a.timeStamp = new Date().getTime() - this.created_at_.getTime();
        try {
          for (var f = t(s.second), h = f.next(); !h.done; h = f.next()) {
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
      u.equals(this.listeners_.end()) && (u = this.listeners_.emplace(a, new e.HashSet()).first), u.second.insert(o);
    }, i.prototype.removeEventListener = function(a, o) {
      var u = this.listeners_.find(a);
      u.equals(this.listeners_.end()) || (u.second.erase(o), u.second.empty() && this.listeners_.erase(u));
    }, i;
  }();
  return Zr.EventTarget = n, Zr;
}
var Kr = {}, na;
function Sn() {
  if (na)
    return Kr;
  na = 1, Object.defineProperty(Kr, "__esModule", { value: !0 });
  var t = function() {
    function e(r, n) {
      this.type = r, n && Object.assign(this, n);
    }
    return e;
  }();
  return Kr.Event = t, Kr;
}
var Xr = {}, ia;
function Ol() {
  if (ia)
    return Xr;
  ia = 1;
  var t = R && R.__extends || function() {
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
  Object.defineProperty(Xr, "__esModule", { value: !0 });
  var e = Sn(), r = function(n) {
    t(i, n);
    function i(a, o) {
      return n.call(this, a, o) || this;
    }
    return i;
  }(e.Event);
  return Xr.CloseEvent = r, Xr;
}
var Qr = {}, oa;
function Al() {
  if (oa)
    return Qr;
  oa = 1;
  var t = R && R.__extends || function() {
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
  Object.defineProperty(Qr, "__esModule", { value: !0 });
  var e = Sn(), r = function(n) {
    t(i, n);
    function i(a, o) {
      return n.call(this, a, o) || this;
    }
    return i;
  }(e.Event);
  return Qr.MessageEvent = r, Qr;
}
var Jr = {}, aa;
function kl() {
  if (aa)
    return Jr;
  aa = 1;
  var t = R && R.__extends || function() {
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
  Object.defineProperty(Jr, "__esModule", { value: !0 });
  var e = Sn(), r = function(n) {
    t(i, n);
    function i(a, o) {
      return n.call(this, a, o) || this;
    }
    return i;
  }(e.Event);
  return Jr.ErrorEvent = r, Jr;
}
var sa;
function Ml() {
  return sa || (sa = 1, function(t) {
    var e = R && R.__extends || function() {
      var l = function(c, d) {
        return l = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(p, _) {
          p.__proto__ = _;
        } || function(p, _) {
          for (var m in _)
            _.hasOwnProperty(m) && (p[m] = _[m]);
        }, l(c, d);
      };
      return function(c, d) {
        l(c, d);
        function p() {
          this.constructor = c;
        }
        c.prototype = d === null ? Object.create(d) : (p.prototype = d.prototype, new p());
      };
    }(), r = R && R.__assign || function() {
      return r = Object.assign || function(l) {
        for (var c, d = 1, p = arguments.length; d < p; d++) {
          c = arguments[d];
          for (var _ in c)
            Object.prototype.hasOwnProperty.call(c, _) && (l[_] = c[_]);
        }
        return l;
      }, r.apply(this, arguments);
    };
    Object.defineProperty(t, "__esModule", { value: !0 });
    var n = sl(), i = Cl(), a = Sn(), o = Ol(), u = Al(), s = kl(), f = function(l) {
      e(c, l);
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
        var p = new a.Event("open", h);
        this.dispatchEvent(p);
      }, c.prototype._Handle_close = function(d, p) {
        var _ = new o.CloseEvent("close", r({}, h, { code: d, reason: p }));
        this.state_ = c.CLOSED, this.dispatchEvent(_);
      }, c.prototype._Handle_message = function(d) {
        var p = new u.MessageEvent("message", r({}, h, { data: d.binaryData ? d.binaryData : d.utf8Data }));
        this.dispatchEvent(p);
      }, c.prototype._Handle_error = function(d) {
        var p = new s.ErrorEvent("error", r({}, h, { error: d, message: d.message }));
        this.state_ === c.CONNECTING && (this.state_ = c.CLOSED), this.dispatchEvent(p);
      }, c;
    }(i.EventTarget);
    t.WebSocket = f, function(l) {
      l.CONNECTING = 0, l.OPEN = 1, l.CLOSING = 2, l.CLOSED = 3;
    }(f = t.WebSocket || (t.WebSocket = {})), t.WebSocket = f;
    var h = {
      bubbles: !1,
      cancelable: !1
    };
  }(zn)), zn;
}
var Il = Pr;
Il.is_node() && (R.WebSocket = Ml().WebSocket);
var we = { exports: {} };
typeof Object.create == "function" ? we.exports = function(e, r) {
  r && (e.super_ = r, e.prototype = Object.create(r.prototype, {
    constructor: {
      value: e,
      enumerable: !1,
      writable: !0,
      configurable: !0
    }
  }));
} : we.exports = function(e, r) {
  if (r) {
    e.super_ = r;
    var n = function() {
    };
    n.prototype = r.prototype, e.prototype = new n(), e.prototype.constructor = e;
  }
};
var Be = { exports: {} };
const Hr = /* @__PURE__ */ Ui(Df);
/*! safe-buffer. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> */
(function(t, e) {
  var r = Hr, n = r.Buffer;
  function i(o, u) {
    for (var s in o)
      u[s] = o[s];
  }
  n.from && n.alloc && n.allocUnsafe && n.allocUnsafeSlow ? t.exports = r : (i(r, e), e.Buffer = a);
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
})(Be, Be.exports);
var Si = { exports: {} }, W = { exports: {} }, ye = W.exports = {}, Ge, Ze;
function Ri() {
  throw new Error("setTimeout has not been defined");
}
function Ci() {
  throw new Error("clearTimeout has not been defined");
}
(function() {
  try {
    typeof setTimeout == "function" ? Ge = setTimeout : Ge = Ri;
  } catch (t) {
    Ge = Ri;
  }
  try {
    typeof clearTimeout == "function" ? Ze = clearTimeout : Ze = Ci;
  } catch (t) {
    Ze = Ci;
  }
})();
function Cs(t) {
  if (Ge === setTimeout)
    return setTimeout(t, 0);
  if ((Ge === Ri || !Ge) && setTimeout)
    return Ge = setTimeout, setTimeout(t, 0);
  try {
    return Ge(t, 0);
  } catch (e) {
    try {
      return Ge.call(null, t, 0);
    } catch (r) {
      return Ge.call(this, t, 0);
    }
  }
}
function Tl(t) {
  if (Ze === clearTimeout)
    return clearTimeout(t);
  if ((Ze === Ci || !Ze) && clearTimeout)
    return Ze = clearTimeout, clearTimeout(t);
  try {
    return Ze(t);
  } catch (e) {
    try {
      return Ze.call(null, t);
    } catch (r) {
      return Ze.call(this, t);
    }
  }
}
var ot = [], jt = !1, mt, on = -1;
function Ll() {
  !jt || !mt || (jt = !1, mt.length ? ot = mt.concat(ot) : on = -1, ot.length && Os());
}
function Os() {
  if (!jt) {
    var t = Cs(Ll);
    jt = !0;
    for (var e = ot.length; e; ) {
      for (mt = ot, ot = []; ++on < e; )
        mt && mt[on].run();
      on = -1, e = ot.length;
    }
    mt = null, jt = !1, Tl(t);
  }
}
ye.nextTick = function(t) {
  var e = new Array(arguments.length - 1);
  if (arguments.length > 1)
    for (var r = 1; r < arguments.length; r++)
      e[r - 1] = arguments[r];
  ot.push(new As(t, e)), ot.length === 1 && !jt && Cs(Os);
};
function As(t, e) {
  this.fun = t, this.array = e;
}
As.prototype.run = function() {
  this.fun.apply(null, this.array);
};
ye.title = "browser";
ye.browser = !0;
ye.env = {};
ye.argv = [];
ye.version = "";
ye.versions = {};
function ut() {
}
ye.on = ut;
ye.addListener = ut;
ye.once = ut;
ye.off = ut;
ye.removeListener = ut;
ye.removeAllListeners = ut;
ye.emit = ut;
ye.prependListener = ut;
ye.prependOnceListener = ut;
ye.listeners = function(t) {
  return [];
};
ye.binding = function(t) {
  throw new Error("process.binding is not supported");
};
ye.cwd = function() {
  return "/";
};
ye.chdir = function(t) {
  throw new Error("process.chdir is not supported");
};
ye.umask = function() {
  return 0;
};
var Ne = { exports: {} }, Nt = typeof Reflect == "object" ? Reflect : null, ua = Nt && typeof Nt.apply == "function" ? Nt.apply : function(e, r, n) {
  return Function.prototype.apply.call(e, r, n);
}, an;
Nt && typeof Nt.ownKeys == "function" ? an = Nt.ownKeys : Object.getOwnPropertySymbols ? an = function(e) {
  return Object.getOwnPropertyNames(e).concat(Object.getOwnPropertySymbols(e));
} : an = function(e) {
  return Object.getOwnPropertyNames(e);
};
function Bl(t) {
  console && console.warn && console.warn(t);
}
var ks = Number.isNaN || function(e) {
  return e !== e;
};
function oe() {
  oe.init.call(this);
}
Ne.exports = oe;
Ne.exports.once = Dl;
oe.EventEmitter = oe;
oe.prototype._events = void 0;
oe.prototype._eventsCount = 0;
oe.prototype._maxListeners = void 0;
var fa = 10;
function Rn(t) {
  if (typeof t != "function")
    throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof t);
}
Object.defineProperty(oe, "defaultMaxListeners", {
  enumerable: !0,
  get: function() {
    return fa;
  },
  set: function(t) {
    if (typeof t != "number" || t < 0 || ks(t))
      throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + t + ".");
    fa = t;
  }
});
oe.init = function() {
  (this._events === void 0 || this._events === Object.getPrototypeOf(this)._events) && (this._events = /* @__PURE__ */ Object.create(null), this._eventsCount = 0), this._maxListeners = this._maxListeners || void 0;
};
oe.prototype.setMaxListeners = function(e) {
  if (typeof e != "number" || e < 0 || ks(e))
    throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + e + ".");
  return this._maxListeners = e, this;
};
function Ms(t) {
  return t._maxListeners === void 0 ? oe.defaultMaxListeners : t._maxListeners;
}
oe.prototype.getMaxListeners = function() {
  return Ms(this);
};
oe.prototype.emit = function(e) {
  for (var r = [], n = 1; n < arguments.length; n++)
    r.push(arguments[n]);
  var i = e === "error", a = this._events;
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
  var s = a[e];
  if (s === void 0)
    return !1;
  if (typeof s == "function")
    ua(s, this, r);
  else
    for (var f = s.length, h = Ps(s, f), n = 0; n < f; ++n)
      ua(h[n], this, r);
  return !0;
};
function Is(t, e, r, n) {
  var i, a, o;
  if (Rn(r), a = t._events, a === void 0 ? (a = t._events = /* @__PURE__ */ Object.create(null), t._eventsCount = 0) : (a.newListener !== void 0 && (t.emit(
    "newListener",
    e,
    r.listener ? r.listener : r
  ), a = t._events), o = a[e]), o === void 0)
    o = a[e] = r, ++t._eventsCount;
  else if (typeof o == "function" ? o = a[e] = n ? [r, o] : [o, r] : n ? o.unshift(r) : o.push(r), i = Ms(t), i > 0 && o.length > i && !o.warned) {
    o.warned = !0;
    var u = new Error("Possible EventEmitter memory leak detected. " + o.length + " " + String(e) + " listeners added. Use emitter.setMaxListeners() to increase limit");
    u.name = "MaxListenersExceededWarning", u.emitter = t, u.type = e, u.count = o.length, Bl(u);
  }
  return t;
}
oe.prototype.addListener = function(e, r) {
  return Is(this, e, r, !1);
};
oe.prototype.on = oe.prototype.addListener;
oe.prototype.prependListener = function(e, r) {
  return Is(this, e, r, !0);
};
function Pl() {
  if (!this.fired)
    return this.target.removeListener(this.type, this.wrapFn), this.fired = !0, arguments.length === 0 ? this.listener.call(this.target) : this.listener.apply(this.target, arguments);
}
function Ts(t, e, r) {
  var n = { fired: !1, wrapFn: void 0, target: t, type: e, listener: r }, i = Pl.bind(n);
  return i.listener = r, n.wrapFn = i, i;
}
oe.prototype.once = function(e, r) {
  return Rn(r), this.on(e, Ts(this, e, r)), this;
};
oe.prototype.prependOnceListener = function(e, r) {
  return Rn(r), this.prependListener(e, Ts(this, e, r)), this;
};
oe.prototype.removeListener = function(e, r) {
  var n, i, a, o, u;
  if (Rn(r), i = this._events, i === void 0)
    return this;
  if (n = i[e], n === void 0)
    return this;
  if (n === r || n.listener === r)
    --this._eventsCount === 0 ? this._events = /* @__PURE__ */ Object.create(null) : (delete i[e], i.removeListener && this.emit("removeListener", e, n.listener || r));
  else if (typeof n != "function") {
    for (a = -1, o = n.length - 1; o >= 0; o--)
      if (n[o] === r || n[o].listener === r) {
        u = n[o].listener, a = o;
        break;
      }
    if (a < 0)
      return this;
    a === 0 ? n.shift() : Hl(n, a), n.length === 1 && (i[e] = n[0]), i.removeListener !== void 0 && this.emit("removeListener", e, u || r);
  }
  return this;
};
oe.prototype.off = oe.prototype.removeListener;
oe.prototype.removeAllListeners = function(e) {
  var r, n, i;
  if (n = this._events, n === void 0)
    return this;
  if (n.removeListener === void 0)
    return arguments.length === 0 ? (this._events = /* @__PURE__ */ Object.create(null), this._eventsCount = 0) : n[e] !== void 0 && (--this._eventsCount === 0 ? this._events = /* @__PURE__ */ Object.create(null) : delete n[e]), this;
  if (arguments.length === 0) {
    var a = Object.keys(n), o;
    for (i = 0; i < a.length; ++i)
      o = a[i], o !== "removeListener" && this.removeAllListeners(o);
    return this.removeAllListeners("removeListener"), this._events = /* @__PURE__ */ Object.create(null), this._eventsCount = 0, this;
  }
  if (r = n[e], typeof r == "function")
    this.removeListener(e, r);
  else if (r !== void 0)
    for (i = r.length - 1; i >= 0; i--)
      this.removeListener(e, r[i]);
  return this;
};
function Ls(t, e, r) {
  var n = t._events;
  if (n === void 0)
    return [];
  var i = n[e];
  return i === void 0 ? [] : typeof i == "function" ? r ? [i.listener || i] : [i] : r ? ql(i) : Ps(i, i.length);
}
oe.prototype.listeners = function(e) {
  return Ls(this, e, !0);
};
oe.prototype.rawListeners = function(e) {
  return Ls(this, e, !1);
};
oe.listenerCount = function(t, e) {
  return typeof t.listenerCount == "function" ? t.listenerCount(e) : Bs.call(t, e);
};
oe.prototype.listenerCount = Bs;
function Bs(t) {
  var e = this._events;
  if (e !== void 0) {
    var r = e[t];
    if (typeof r == "function")
      return 1;
    if (r !== void 0)
      return r.length;
  }
  return 0;
}
oe.prototype.eventNames = function() {
  return this._eventsCount > 0 ? an(this._events) : [];
};
function Ps(t, e) {
  for (var r = new Array(e), n = 0; n < e; ++n)
    r[n] = t[n];
  return r;
}
function Hl(t, e) {
  for (; e + 1 < t.length; e++)
    t[e] = t[e + 1];
  t.pop();
}
function ql(t) {
  for (var e = new Array(t.length), r = 0; r < e.length; ++r)
    e[r] = t[r].listener || t[r];
  return e;
}
function Dl(t, e) {
  return new Promise(function(r, n) {
    function i(o) {
      t.removeListener(e, a), n(o);
    }
    function a() {
      typeof t.removeListener == "function" && t.removeListener("error", i), r([].slice.call(arguments));
    }
    Hs(t, e, a, { once: !0 }), e !== "error" && jl(t, i, { once: !0 });
  });
}
function jl(t, e, r) {
  typeof t.on == "function" && Hs(t, "error", e, r);
}
function Hs(t, e, r, n) {
  if (typeof t.on == "function")
    n.once ? t.once(e, r) : t.on(e, r);
  else if (typeof t.addEventListener == "function")
    t.addEventListener(e, function i(a) {
      n.once && t.removeEventListener(e, i), r(a);
    });
  else
    throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + typeof t);
}
var qs = Ne.exports.EventEmitter, Oi;
typeof Object.create == "function" ? Oi = function(e, r) {
  e.super_ = r, e.prototype = Object.create(r.prototype, {
    constructor: {
      value: e,
      enumerable: !1,
      writable: !0,
      configurable: !0
    }
  });
} : Oi = function(e, r) {
  e.super_ = r;
  var n = function() {
  };
  n.prototype = r.prototype, e.prototype = new n(), e.prototype.constructor = e;
};
const vt = Oi;
var Nl = /%[sdj%]/g;
function Cn(t) {
  if (!Dr(t)) {
    for (var e = [], r = 0; r < arguments.length; r++)
      e.push(rt(arguments[r]));
    return e.join(" ");
  }
  for (var r = 1, n = arguments, i = n.length, a = String(t).replace(Nl, function(u) {
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
        } catch (s) {
          return "[Circular]";
        }
      default:
        return u;
    }
  }), o = n[r]; r < i; o = n[++r])
    qr(o) || !kt(o) ? a += " " + o : a += " " + rt(o);
  return a;
}
function On(t, e) {
  if (Xe(xi.process))
    return function() {
      return On(t, e).apply(this, arguments);
    };
  if (W.exports.noDeprecation === !0)
    return t;
  var r = !1;
  function n() {
    if (!r) {
      if (W.exports.throwDeprecation)
        throw new Error(e);
      W.exports.traceDeprecation ? console.trace(e) : console.error(e), r = !0;
    }
    return t.apply(this, arguments);
  }
  return n;
}
var en = {}, ri;
function Zi(t) {
  if (Xe(ri) && (ri = W.exports.env.NODE_DEBUG || ""), t = t.toUpperCase(), !en[t])
    if (new RegExp("\\b" + t + "\\b", "i").test(ri)) {
      var e = 0;
      en[t] = function() {
        var r = Cn.apply(null, arguments);
        console.error("%s %d: %s", t, e, r);
      };
    } else
      en[t] = function() {
      };
  return en[t];
}
function rt(t, e) {
  var r = {
    seen: [],
    stylize: $l
  };
  return arguments.length >= 3 && (r.depth = arguments[2]), arguments.length >= 4 && (r.colors = arguments[3]), An(e) ? r.showHidden = e : e && Ji(r, e), Xe(r.showHidden) && (r.showHidden = !1), Xe(r.depth) && (r.depth = 2), Xe(r.colors) && (r.colors = !1), Xe(r.customInspect) && (r.customInspect = !0), r.colors && (r.stylize = Fl), pn(r, t, r.depth);
}
rt.colors = {
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
rt.styles = {
  special: "cyan",
  number: "yellow",
  boolean: "yellow",
  undefined: "grey",
  null: "bold",
  string: "green",
  date: "magenta",
  regexp: "red"
};
function Fl(t, e) {
  var r = rt.styles[e];
  return r ? "\x1B[" + rt.colors[r][0] + "m" + t + "\x1B[" + rt.colors[r][1] + "m" : t;
}
function $l(t, e) {
  return t;
}
function Ul(t) {
  var e = {};
  return t.forEach(function(r, n) {
    e[r] = !0;
  }), e;
}
function pn(t, e, r) {
  if (t.customInspect && e && kr(e.inspect) && e.inspect !== rt && !(e.constructor && e.constructor.prototype === e)) {
    var n = e.inspect(r, t);
    return Dr(n) || (n = pn(t, n, r)), n;
  }
  var i = Wl(t, e);
  if (i)
    return i;
  var a = Object.keys(e), o = Ul(a);
  if (t.showHidden && (a = Object.getOwnPropertyNames(e)), Ar(e) && (a.indexOf("message") >= 0 || a.indexOf("description") >= 0))
    return ni(e);
  if (a.length === 0) {
    if (kr(e)) {
      var u = e.name ? ": " + e.name : "";
      return t.stylize("[Function" + u + "]", "special");
    }
    if (Or(e))
      return t.stylize(RegExp.prototype.toString.call(e), "regexp");
    if (_n(e))
      return t.stylize(Date.prototype.toString.call(e), "date");
    if (Ar(e))
      return ni(e);
  }
  var s = "", f = !1, h = ["{", "}"];
  if (Ki(e) && (f = !0, h = ["[", "]"]), kr(e)) {
    var l = e.name ? ": " + e.name : "";
    s = " [Function" + l + "]";
  }
  if (Or(e) && (s = " " + RegExp.prototype.toString.call(e)), _n(e) && (s = " " + Date.prototype.toUTCString.call(e)), Ar(e) && (s = " " + ni(e)), a.length === 0 && (!f || e.length == 0))
    return h[0] + s + h[1];
  if (r < 0)
    return Or(e) ? t.stylize(RegExp.prototype.toString.call(e), "regexp") : t.stylize("[Object]", "special");
  t.seen.push(e);
  var c;
  return f ? c = zl(t, e, r, o, a) : c = a.map(function(d) {
    return Ai(t, e, r, o, d, f);
  }), t.seen.pop(), Vl(c, s, h);
}
function Wl(t, e) {
  if (Xe(e))
    return t.stylize("undefined", "undefined");
  if (Dr(e)) {
    var r = "'" + JSON.stringify(e).replace(/^"|"$/g, "").replace(/'/g, "\\'").replace(/\\"/g, '"') + "'";
    return t.stylize(r, "string");
  }
  if (Xi(e))
    return t.stylize("" + e, "number");
  if (An(e))
    return t.stylize("" + e, "boolean");
  if (qr(e))
    return t.stylize("null", "null");
}
function ni(t) {
  return "[" + Error.prototype.toString.call(t) + "]";
}
function zl(t, e, r, n, i) {
  for (var a = [], o = 0, u = e.length; o < u; ++o)
    Us(e, String(o)) ? a.push(Ai(
      t,
      e,
      r,
      n,
      String(o),
      !0
    )) : a.push("");
  return i.forEach(function(s) {
    s.match(/^\d+$/) || a.push(Ai(
      t,
      e,
      r,
      n,
      s,
      !0
    ));
  }), a;
}
function Ai(t, e, r, n, i, a) {
  var o, u, s;
  if (s = Object.getOwnPropertyDescriptor(e, i) || { value: e[i] }, s.get ? s.set ? u = t.stylize("[Getter/Setter]", "special") : u = t.stylize("[Getter]", "special") : s.set && (u = t.stylize("[Setter]", "special")), Us(n, i) || (o = "[" + i + "]"), u || (t.seen.indexOf(s.value) < 0 ? (qr(r) ? u = pn(t, s.value, null) : u = pn(t, s.value, r - 1), u.indexOf(`
`) > -1 && (a ? u = u.split(`
`).map(function(f) {
    return "  " + f;
  }).join(`
`).substr(2) : u = `
` + u.split(`
`).map(function(f) {
    return "   " + f;
  }).join(`
`))) : u = t.stylize("[Circular]", "special")), Xe(o)) {
    if (a && i.match(/^\d+$/))
      return u;
    o = JSON.stringify("" + i), o.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/) ? (o = o.substr(1, o.length - 2), o = t.stylize(o, "name")) : (o = o.replace(/'/g, "\\'").replace(/\\"/g, '"').replace(/(^"|"$)/g, "'"), o = t.stylize(o, "string"));
  }
  return o + ": " + u;
}
function Vl(t, e, r) {
  var n = t.reduce(function(i, a) {
    return a.indexOf(`
`) >= 0, i + a.replace(/\u001b\[\d\d?m/g, "").length + 1;
  }, 0);
  return n > 60 ? r[0] + (e === "" ? "" : e + `
 `) + " " + t.join(`,
  `) + " " + r[1] : r[0] + e + " " + t.join(", ") + " " + r[1];
}
function Ki(t) {
  return Array.isArray(t);
}
function An(t) {
  return typeof t == "boolean";
}
function qr(t) {
  return t === null;
}
function Ds(t) {
  return t == null;
}
function Xi(t) {
  return typeof t == "number";
}
function Dr(t) {
  return typeof t == "string";
}
function js(t) {
  return typeof t == "symbol";
}
function Xe(t) {
  return t === void 0;
}
function Or(t) {
  return kt(t) && Qi(t) === "[object RegExp]";
}
function kt(t) {
  return typeof t == "object" && t !== null;
}
function _n(t) {
  return kt(t) && Qi(t) === "[object Date]";
}
function Ar(t) {
  return kt(t) && (Qi(t) === "[object Error]" || t instanceof Error);
}
function kr(t) {
  return typeof t == "function";
}
function Ns(t) {
  return t === null || typeof t == "boolean" || typeof t == "number" || typeof t == "string" || typeof t == "symbol" || typeof t == "undefined";
}
function Fs(t) {
  return E.isBuffer(t);
}
function Qi(t) {
  return Object.prototype.toString.call(t);
}
function ii(t) {
  return t < 10 ? "0" + t.toString(10) : t.toString(10);
}
var Yl = [
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
function Gl() {
  var t = new Date(), e = [
    ii(t.getHours()),
    ii(t.getMinutes()),
    ii(t.getSeconds())
  ].join(":");
  return [t.getDate(), Yl[t.getMonth()], e].join(" ");
}
function $s() {
  console.log("%s - %s", Gl(), Cn.apply(null, arguments));
}
function Ji(t, e) {
  if (!e || !kt(e))
    return t;
  for (var r = Object.keys(e), n = r.length; n--; )
    t[r[n]] = e[r[n]];
  return t;
}
function Us(t, e) {
  return Object.prototype.hasOwnProperty.call(t, e);
}
const Zl = {
  inherits: vt,
  _extend: Ji,
  log: $s,
  isBuffer: Fs,
  isPrimitive: Ns,
  isFunction: kr,
  isError: Ar,
  isDate: _n,
  isObject: kt,
  isRegExp: Or,
  isUndefined: Xe,
  isSymbol: js,
  isString: Dr,
  isNumber: Xi,
  isNullOrUndefined: Ds,
  isNull: qr,
  isBoolean: An,
  isArray: Ki,
  inspect: rt,
  deprecate: On,
  format: Cn,
  debuglog: Zi
}, Kl = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  format: Cn,
  deprecate: On,
  debuglog: Zi,
  inspect: rt,
  isArray: Ki,
  isBoolean: An,
  isNull: qr,
  isNullOrUndefined: Ds,
  isNumber: Xi,
  isString: Dr,
  isSymbol: js,
  isUndefined: Xe,
  isRegExp: Or,
  isObject: kt,
  isDate: _n,
  isError: Ar,
  isFunction: kr,
  isPrimitive: Ns,
  isBuffer: Fs,
  log: $s,
  inherits: vt,
  _extend: Ji,
  default: Zl
}, Symbol.toStringTag, { value: "Module" })), Ws = /* @__PURE__ */ Ui(Kl);
var oi, la;
function Xl() {
  if (la)
    return oi;
  la = 1;
  function t(c, d) {
    var p = Object.keys(c);
    if (Object.getOwnPropertySymbols) {
      var _ = Object.getOwnPropertySymbols(c);
      d && (_ = _.filter(function(m) {
        return Object.getOwnPropertyDescriptor(c, m).enumerable;
      })), p.push.apply(p, _);
    }
    return p;
  }
  function e(c) {
    for (var d = 1; d < arguments.length; d++) {
      var p = arguments[d] != null ? arguments[d] : {};
      d % 2 ? t(Object(p), !0).forEach(function(_) {
        r(c, _, p[_]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(c, Object.getOwnPropertyDescriptors(p)) : t(Object(p)).forEach(function(_) {
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
  function a(c, d, p) {
    return d && i(c.prototype, d), p && i(c, p), c;
  }
  var o = Hr, u = o.Buffer, s = Ws, f = s.inspect, h = f && f.custom || "inspect";
  function l(c, d, p) {
    u.prototype.copy.call(c, d, p);
  }
  return oi = /* @__PURE__ */ function() {
    function c() {
      n(this, c), this.head = null, this.tail = null, this.length = 0;
    }
    return a(c, [{
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
        for (var _ = this.head, m = "" + _.data; _ = _.next; )
          m += p + _.data;
        return m;
      }
    }, {
      key: "concat",
      value: function(p) {
        if (this.length === 0)
          return u.alloc(0);
        for (var _ = u.allocUnsafe(p >>> 0), m = this.head, b = 0; m; )
          l(m.data, _, b), b += m.data.length, m = m.next;
        return _;
      }
    }, {
      key: "consume",
      value: function(p, _) {
        var m;
        return p < this.head.data.length ? (m = this.head.data.slice(0, p), this.head.data = this.head.data.slice(p)) : p === this.head.data.length ? m = this.shift() : m = _ ? this._getString(p) : this._getBuffer(p), m;
      }
    }, {
      key: "first",
      value: function() {
        return this.head.data;
      }
    }, {
      key: "_getString",
      value: function(p) {
        var _ = this.head, m = 1, b = _.data;
        for (p -= b.length; _ = _.next; ) {
          var w = _.data, S = p > w.length ? w.length : p;
          if (S === w.length ? b += w : b += w.slice(0, p), p -= S, p === 0) {
            S === w.length ? (++m, _.next ? this.head = _.next : this.head = this.tail = null) : (this.head = _, _.data = w.slice(S));
            break;
          }
          ++m;
        }
        return this.length -= m, b;
      }
    }, {
      key: "_getBuffer",
      value: function(p) {
        var _ = u.allocUnsafe(p), m = this.head, b = 1;
        for (m.data.copy(_), p -= m.data.length; m = m.next; ) {
          var w = m.data, S = p > w.length ? w.length : p;
          if (w.copy(_, _.length - p, 0, S), p -= S, p === 0) {
            S === w.length ? (++b, m.next ? this.head = m.next : this.head = this.tail = null) : (this.head = m, m.data = w.slice(S));
            break;
          }
          ++b;
        }
        return this.length -= b, _;
      }
    }, {
      key: h,
      value: function(p, _) {
        return f(this, e({}, _, {
          depth: 0,
          customInspect: !1
        }));
      }
    }]), c;
  }(), oi;
}
function Ql(t, e) {
  var r = this, n = this._readableState && this._readableState.destroyed, i = this._writableState && this._writableState.destroyed;
  return n || i ? (e ? e(t) : t && (this._writableState ? this._writableState.errorEmitted || (this._writableState.errorEmitted = !0, W.exports.nextTick(ki, this, t)) : W.exports.nextTick(ki, this, t)), this) : (this._readableState && (this._readableState.destroyed = !0), this._writableState && (this._writableState.destroyed = !0), this._destroy(t || null, function(a) {
    !e && a ? r._writableState ? r._writableState.errorEmitted ? W.exports.nextTick(sn, r) : (r._writableState.errorEmitted = !0, W.exports.nextTick(ca, r, a)) : W.exports.nextTick(ca, r, a) : e ? (W.exports.nextTick(sn, r), e(a)) : W.exports.nextTick(sn, r);
  }), this);
}
function ca(t, e) {
  ki(t, e), sn(t);
}
function sn(t) {
  t._writableState && !t._writableState.emitClose || t._readableState && !t._readableState.emitClose || t.emit("close");
}
function Jl() {
  this._readableState && (this._readableState.destroyed = !1, this._readableState.reading = !1, this._readableState.ended = !1, this._readableState.endEmitted = !1), this._writableState && (this._writableState.destroyed = !1, this._writableState.ended = !1, this._writableState.ending = !1, this._writableState.finalCalled = !1, this._writableState.prefinished = !1, this._writableState.finished = !1, this._writableState.errorEmitted = !1);
}
function ki(t, e) {
  t.emit("error", e);
}
function ec(t, e) {
  var r = t._readableState, n = t._writableState;
  r && r.autoDestroy || n && n.autoDestroy ? t.destroy(e) : t.emit("error", e);
}
var zs = {
  destroy: Ql,
  undestroy: Jl,
  errorOrDestroy: ec
}, Mt = {};
function tc(t, e) {
  t.prototype = Object.create(e.prototype), t.prototype.constructor = t, t.__proto__ = e;
}
var Vs = {};
function Fe(t, e, r) {
  r || (r = Error);
  function n(a, o, u) {
    return typeof e == "string" ? e : e(a, o, u);
  }
  var i = /* @__PURE__ */ function(a) {
    tc(o, a);
    function o(u, s, f) {
      return a.call(this, n(u, s, f)) || this;
    }
    return o;
  }(r);
  i.prototype.name = r.name, i.prototype.code = t, Vs[t] = i;
}
function ha(t, e) {
  if (Array.isArray(t)) {
    var r = t.length;
    return t = t.map(function(n) {
      return String(n);
    }), r > 2 ? "one of ".concat(e, " ").concat(t.slice(0, r - 1).join(", "), ", or ") + t[r - 1] : r === 2 ? "one of ".concat(e, " ").concat(t[0], " or ").concat(t[1]) : "of ".concat(e, " ").concat(t[0]);
  } else
    return "of ".concat(e, " ").concat(String(t));
}
function rc(t, e, r) {
  return t.substr(!r || r < 0 ? 0 : +r, e.length) === e;
}
function nc(t, e, r) {
  return (r === void 0 || r > t.length) && (r = t.length), t.substring(r - e.length, r) === e;
}
function ic(t, e, r) {
  return typeof r != "number" && (r = 0), r + e.length > t.length ? !1 : t.indexOf(e, r) !== -1;
}
Fe("ERR_INVALID_OPT_VALUE", function(t, e) {
  return 'The value "' + e + '" is invalid for option "' + t + '"';
}, TypeError);
Fe("ERR_INVALID_ARG_TYPE", function(t, e, r) {
  var n;
  typeof e == "string" && rc(e, "not ") ? (n = "must not be", e = e.replace(/^not /, "")) : n = "must be";
  var i;
  if (nc(t, " argument"))
    i = "The ".concat(t, " ").concat(n, " ").concat(ha(e, "type"));
  else {
    var a = ic(t, ".") ? "property" : "argument";
    i = 'The "'.concat(t, '" ').concat(a, " ").concat(n, " ").concat(ha(e, "type"));
  }
  return i += ". Received type ".concat(typeof r), i;
}, TypeError);
Fe("ERR_STREAM_PUSH_AFTER_EOF", "stream.push() after EOF");
Fe("ERR_METHOD_NOT_IMPLEMENTED", function(t) {
  return "The " + t + " method is not implemented";
});
Fe("ERR_STREAM_PREMATURE_CLOSE", "Premature close");
Fe("ERR_STREAM_DESTROYED", function(t) {
  return "Cannot call " + t + " after a stream was destroyed";
});
Fe("ERR_MULTIPLE_CALLBACK", "Callback called multiple times");
Fe("ERR_STREAM_CANNOT_PIPE", "Cannot pipe, not readable");
Fe("ERR_STREAM_WRITE_AFTER_END", "write after end");
Fe("ERR_STREAM_NULL_VALUES", "May not write null values to stream", TypeError);
Fe("ERR_UNKNOWN_ENCODING", function(t) {
  return "Unknown encoding: " + t;
}, TypeError);
Fe("ERR_STREAM_UNSHIFT_AFTER_END_EVENT", "stream.unshift() after end event");
Mt.codes = Vs;
var oc = Mt.codes.ERR_INVALID_OPT_VALUE;
function ac(t, e, r) {
  return t.highWaterMark != null ? t.highWaterMark : e ? t[r] : null;
}
function sc(t, e, r, n) {
  var i = ac(e, n, r);
  if (i != null) {
    if (!(isFinite(i) && Math.floor(i) === i) || i < 0) {
      var a = n ? r : "highWaterMark";
      throw new oc(a, i);
    }
    return Math.floor(i);
  }
  return t.objectMode ? 16 : 16 * 1024;
}
var Ys = {
  getHighWaterMark: sc
}, uc = fc;
function fc(t, e) {
  if (ai("noDeprecation"))
    return t;
  var r = !1;
  function n() {
    if (!r) {
      if (ai("throwDeprecation"))
        throw new Error(e);
      ai("traceDeprecation") ? console.trace(e) : console.warn(e), r = !0;
    }
    return t.apply(this, arguments);
  }
  return n;
}
function ai(t) {
  try {
    if (!R.localStorage)
      return !1;
  } catch (r) {
    return !1;
  }
  var e = R.localStorage[t];
  return e == null ? !1 : String(e).toLowerCase() === "true";
}
var si, da;
function Gs() {
  if (da)
    return si;
  da = 1, si = H;
  function t(g) {
    var x = this;
    this.next = null, this.entry = null, this.finish = function() {
      J(x, g);
    };
  }
  var e;
  H.WritableState = U;
  var r = {
    deprecate: uc
  }, n = qs, i = Hr.Buffer, a = R.Uint8Array || function() {
  };
  function o(g) {
    return i.from(g);
  }
  function u(g) {
    return i.isBuffer(g) || g instanceof a;
  }
  var s = zs, f = Ys, h = f.getHighWaterMark, l = Mt.codes, c = l.ERR_INVALID_ARG_TYPE, d = l.ERR_METHOD_NOT_IMPLEMENTED, p = l.ERR_MULTIPLE_CALLBACK, _ = l.ERR_STREAM_CANNOT_PIPE, m = l.ERR_STREAM_DESTROYED, b = l.ERR_STREAM_NULL_VALUES, w = l.ERR_STREAM_WRITE_AFTER_END, S = l.ERR_UNKNOWN_ENCODING, A = s.errorOrDestroy;
  we.exports(H, n);
  function T() {
  }
  function U(g, x, k) {
    e = e || Wt(), g = g || {}, typeof k != "boolean" && (k = x instanceof e), this.objectMode = !!g.objectMode, k && (this.objectMode = this.objectMode || !!g.writableObjectMode), this.highWaterMark = h(this, g, "writableHighWaterMark", k), this.finalCalled = !1, this.needDrain = !1, this.ending = !1, this.ended = !1, this.finished = !1, this.destroyed = !1;
    var F = g.decodeStrings === !1;
    this.decodeStrings = !F, this.defaultEncoding = g.defaultEncoding || "utf8", this.length = 0, this.writing = !1, this.corked = 0, this.sync = !0, this.bufferProcessing = !1, this.onwrite = function(Q) {
      ge(x, Q);
    }, this.writecb = null, this.writelen = 0, this.bufferedRequest = null, this.lastBufferedRequest = null, this.pendingcb = 0, this.prefinished = !1, this.errorEmitted = !1, this.emitClose = g.emitClose !== !1, this.autoDestroy = !!g.autoDestroy, this.bufferedRequestCount = 0, this.corkedRequestsFree = new t(this);
  }
  U.prototype.getBuffer = function() {
    for (var x = this.bufferedRequest, k = []; x; )
      k.push(x), x = x.next;
    return k;
  }, function() {
    try {
      Object.defineProperty(U.prototype, "buffer", {
        get: r.deprecate(function() {
          return this.getBuffer();
        }, "_writableState.buffer is deprecated. Use _writableState.getBuffer instead.", "DEP0003")
      });
    } catch (g) {
    }
  }();
  var G;
  typeof Symbol == "function" && Symbol.hasInstance && typeof Function.prototype[Symbol.hasInstance] == "function" ? (G = Function.prototype[Symbol.hasInstance], Object.defineProperty(H, Symbol.hasInstance, {
    value: function(x) {
      return G.call(this, x) ? !0 : this !== H ? !1 : x && x._writableState instanceof U;
    }
  })) : G = function(x) {
    return x instanceof this;
  };
  function H(g) {
    e = e || Wt();
    var x = this instanceof e;
    if (!x && !G.call(H, this))
      return new H(g);
    this._writableState = new U(g, this, x), this.writable = !0, g && (typeof g.write == "function" && (this._write = g.write), typeof g.writev == "function" && (this._writev = g.writev), typeof g.destroy == "function" && (this._destroy = g.destroy), typeof g.final == "function" && (this._final = g.final)), n.call(this);
  }
  H.prototype.pipe = function() {
    A(this, new _());
  };
  function I(g, x) {
    var k = new w();
    A(g, k), W.exports.nextTick(x, k);
  }
  function V(g, x, k, F) {
    var Q;
    return k === null ? Q = new b() : typeof k != "string" && !x.objectMode && (Q = new c("chunk", ["string", "Buffer"], k)), Q ? (A(g, Q), W.exports.nextTick(F, Q), !1) : !0;
  }
  H.prototype.write = function(g, x, k) {
    var F = this._writableState, Q = !1, v = !F.objectMode && u(g);
    return v && !i.isBuffer(g) && (g = o(g)), typeof x == "function" && (k = x, x = null), v ? x = "buffer" : x || (x = F.defaultEncoding), typeof k != "function" && (k = T), F.ending ? I(this, k) : (v || V(this, F, g, k)) && (F.pendingcb++, Q = N(this, F, v, g, x, k)), Q;
  }, H.prototype.cork = function() {
    this._writableState.corked++;
  }, H.prototype.uncork = function() {
    var g = this._writableState;
    g.corked && (g.corked--, !g.writing && !g.corked && !g.bufferProcessing && g.bufferedRequest && He(this, g));
  }, H.prototype.setDefaultEncoding = function(x) {
    if (typeof x == "string" && (x = x.toLowerCase()), !(["hex", "utf8", "utf-8", "ascii", "binary", "base64", "ucs2", "ucs-2", "utf16le", "utf-16le", "raw"].indexOf((x + "").toLowerCase()) > -1))
      throw new S(x);
    return this._writableState.defaultEncoding = x, this;
  }, Object.defineProperty(H.prototype, "writableBuffer", {
    enumerable: !1,
    get: function() {
      return this._writableState && this._writableState.getBuffer();
    }
  });
  function X(g, x, k) {
    return !g.objectMode && g.decodeStrings !== !1 && typeof x == "string" && (x = i.from(x, k)), x;
  }
  Object.defineProperty(H.prototype, "writableHighWaterMark", {
    enumerable: !1,
    get: function() {
      return this._writableState.highWaterMark;
    }
  });
  function N(g, x, k, F, Q, v) {
    if (!k) {
      var y = X(x, F, Q);
      F !== y && (k = !0, Q = "buffer", F = y);
    }
    var O = x.objectMode ? 1 : F.length;
    x.length += O;
    var P = x.length < x.highWaterMark;
    if (P || (x.needDrain = !0), x.writing || x.corked) {
      var _e = x.lastBufferedRequest;
      x.lastBufferedRequest = {
        chunk: F,
        encoding: Q,
        isBuf: k,
        callback: v,
        next: null
      }, _e ? _e.next = x.lastBufferedRequest : x.bufferedRequest = x.lastBufferedRequest, x.bufferedRequestCount += 1;
    } else
      L(g, x, !1, O, F, Q, v);
    return P;
  }
  function L(g, x, k, F, Q, v, y) {
    x.writelen = F, x.writecb = y, x.writing = !0, x.sync = !0, x.destroyed ? x.onwrite(new m("write")) : k ? g._writev(Q, x.onwrite) : g._write(Q, v, x.onwrite), x.sync = !1;
  }
  function q(g, x, k, F, Q) {
    --x.pendingcb, k ? (W.exports.nextTick(Q, F), W.exports.nextTick(re, g, x), g._writableState.errorEmitted = !0, A(g, F)) : (Q(F), g._writableState.errorEmitted = !0, A(g, F), re(g, x));
  }
  function te(g) {
    g.writing = !1, g.writecb = null, g.length -= g.writelen, g.writelen = 0;
  }
  function ge(g, x) {
    var k = g._writableState, F = k.sync, Q = k.writecb;
    if (typeof Q != "function")
      throw new p();
    if (te(k), x)
      q(g, k, F, x, Q);
    else {
      var v = Me(k) || g.destroyed;
      !v && !k.corked && !k.bufferProcessing && k.bufferedRequest && He(g, k), F ? W.exports.nextTick(pe, g, k, v, Q) : pe(g, k, v, Q);
    }
  }
  function pe(g, x, k, F) {
    k || Ye(g, x), x.pendingcb--, F(), re(g, x);
  }
  function Ye(g, x) {
    x.length === 0 && x.needDrain && (x.needDrain = !1, g.emit("drain"));
  }
  function He(g, x) {
    x.bufferProcessing = !0;
    var k = x.bufferedRequest;
    if (g._writev && k && k.next) {
      var F = x.bufferedRequestCount, Q = new Array(F), v = x.corkedRequestsFree;
      v.entry = k;
      for (var y = 0, O = !0; k; )
        Q[y] = k, k.isBuf || (O = !1), k = k.next, y += 1;
      Q.allBuffers = O, L(g, x, !0, x.length, Q, "", v.finish), x.pendingcb++, x.lastBufferedRequest = null, v.next ? (x.corkedRequestsFree = v.next, v.next = null) : x.corkedRequestsFree = new t(x), x.bufferedRequestCount = 0;
    } else {
      for (; k; ) {
        var P = k.chunk, _e = k.encoding, Z = k.callback, ue = x.objectMode ? 1 : P.length;
        if (L(g, x, !1, ue, P, _e, Z), k = k.next, x.bufferedRequestCount--, x.writing)
          break;
      }
      k === null && (x.lastBufferedRequest = null);
    }
    x.bufferedRequest = k, x.bufferProcessing = !1;
  }
  H.prototype._write = function(g, x, k) {
    k(new d("_write()"));
  }, H.prototype._writev = null, H.prototype.end = function(g, x, k) {
    var F = this._writableState;
    return typeof g == "function" ? (k = g, g = null, x = null) : typeof x == "function" && (k = x, x = null), g != null && this.write(g, x), F.corked && (F.corked = 1, this.uncork()), F.ending || D(this, F, k), this;
  }, Object.defineProperty(H.prototype, "writableLength", {
    enumerable: !1,
    get: function() {
      return this._writableState.length;
    }
  });
  function Me(g) {
    return g.ending && g.length === 0 && g.bufferedRequest === null && !g.finished && !g.writing;
  }
  function ae(g, x) {
    g._final(function(k) {
      x.pendingcb--, k && A(g, k), x.prefinished = !0, g.emit("prefinish"), re(g, x);
    });
  }
  function ft(g, x) {
    !x.prefinished && !x.finalCalled && (typeof g._final == "function" && !x.destroyed ? (x.pendingcb++, x.finalCalled = !0, W.exports.nextTick(ae, g, x)) : (x.prefinished = !0, g.emit("prefinish")));
  }
  function re(g, x) {
    var k = Me(x);
    if (k && (ft(g, x), x.pendingcb === 0 && (x.finished = !0, g.emit("finish"), x.autoDestroy))) {
      var F = g._readableState;
      (!F || F.autoDestroy && F.endEmitted) && g.destroy();
    }
    return k;
  }
  function D(g, x, k) {
    x.ending = !0, re(g, x), k && (x.finished ? W.exports.nextTick(k) : g.once("finish", k)), x.ended = !0, g.writable = !1;
  }
  function J(g, x, k) {
    var F = g.entry;
    for (g.entry = null; F; ) {
      var Q = F.callback;
      x.pendingcb--, Q(k), F = F.next;
    }
    x.corkedRequestsFree.next = g;
  }
  return Object.defineProperty(H.prototype, "destroyed", {
    enumerable: !1,
    get: function() {
      return this._writableState === void 0 ? !1 : this._writableState.destroyed;
    },
    set: function(x) {
      !this._writableState || (this._writableState.destroyed = x);
    }
  }), H.prototype.destroy = s.destroy, H.prototype._undestroy = s.undestroy, H.prototype._destroy = function(g, x) {
    x(g);
  }, si;
}
var ui, pa;
function Wt() {
  if (pa)
    return ui;
  pa = 1;
  var t = Object.keys || function(f) {
    var h = [];
    for (var l in f)
      h.push(l);
    return h;
  };
  ui = o;
  var e = Xs(), r = Gs();
  we.exports(o, e);
  for (var n = t(r.prototype), i = 0; i < n.length; i++) {
    var a = n[i];
    o.prototype[a] || (o.prototype[a] = r.prototype[a]);
  }
  function o(f) {
    if (!(this instanceof o))
      return new o(f);
    e.call(this, f), r.call(this, f), this.allowHalfOpen = !0, f && (f.readable === !1 && (this.readable = !1), f.writable === !1 && (this.writable = !1), f.allowHalfOpen === !1 && (this.allowHalfOpen = !1, this.once("end", u)));
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
    this._writableState.ended || W.exports.nextTick(s, this);
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
  }), ui;
}
var vn = {}, eo = Be.exports.Buffer, _a = eo.isEncoding || function(t) {
  switch (t = "" + t, t && t.toLowerCase()) {
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
function lc(t) {
  if (!t)
    return "utf8";
  for (var e; ; )
    switch (t) {
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
        return t;
      default:
        if (e)
          return;
        t = ("" + t).toLowerCase(), e = !0;
    }
}
function cc(t) {
  var e = lc(t);
  if (typeof e != "string" && (eo.isEncoding === _a || !_a(t)))
    throw new Error("Unknown encoding: " + t);
  return e || t;
}
var Zs = vn.StringDecoder = jr;
function jr(t) {
  this.encoding = cc(t);
  var e;
  switch (this.encoding) {
    case "utf16le":
      this.text = yc, this.end = gc, e = 4;
      break;
    case "utf8":
      this.fillLast = pc, e = 4;
      break;
    case "base64":
      this.text = bc, this.end = wc, e = 3;
      break;
    default:
      this.write = mc, this.end = xc;
      return;
  }
  this.lastNeed = 0, this.lastTotal = 0, this.lastChar = eo.allocUnsafe(e);
}
jr.prototype.write = function(t) {
  if (t.length === 0)
    return "";
  var e, r;
  if (this.lastNeed) {
    if (e = this.fillLast(t), e === void 0)
      return "";
    r = this.lastNeed, this.lastNeed = 0;
  } else
    r = 0;
  return r < t.length ? e ? e + this.text(t, r) : this.text(t, r) : e || "";
};
jr.prototype.end = vc;
jr.prototype.text = _c;
jr.prototype.fillLast = function(t) {
  if (this.lastNeed <= t.length)
    return t.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, this.lastNeed), this.lastChar.toString(this.encoding, 0, this.lastTotal);
  t.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, t.length), this.lastNeed -= t.length;
};
function fi(t) {
  return t <= 127 ? 0 : t >> 5 === 6 ? 2 : t >> 4 === 14 ? 3 : t >> 3 === 30 ? 4 : t >> 6 === 2 ? -1 : -2;
}
function hc(t, e, r) {
  var n = e.length - 1;
  if (n < r)
    return 0;
  var i = fi(e[n]);
  return i >= 0 ? (i > 0 && (t.lastNeed = i - 1), i) : --n < r || i === -2 ? 0 : (i = fi(e[n]), i >= 0 ? (i > 0 && (t.lastNeed = i - 2), i) : --n < r || i === -2 ? 0 : (i = fi(e[n]), i >= 0 ? (i > 0 && (i === 2 ? i = 0 : t.lastNeed = i - 3), i) : 0));
}
function dc(t, e, r) {
  if ((e[0] & 192) !== 128)
    return t.lastNeed = 0, "\uFFFD";
  if (t.lastNeed > 1 && e.length > 1) {
    if ((e[1] & 192) !== 128)
      return t.lastNeed = 1, "\uFFFD";
    if (t.lastNeed > 2 && e.length > 2 && (e[2] & 192) !== 128)
      return t.lastNeed = 2, "\uFFFD";
  }
}
function pc(t) {
  var e = this.lastTotal - this.lastNeed, r = dc(this, t);
  if (r !== void 0)
    return r;
  if (this.lastNeed <= t.length)
    return t.copy(this.lastChar, e, 0, this.lastNeed), this.lastChar.toString(this.encoding, 0, this.lastTotal);
  t.copy(this.lastChar, e, 0, t.length), this.lastNeed -= t.length;
}
function _c(t, e) {
  var r = hc(this, t, e);
  if (!this.lastNeed)
    return t.toString("utf8", e);
  this.lastTotal = r;
  var n = t.length - (r - this.lastNeed);
  return t.copy(this.lastChar, 0, n), t.toString("utf8", e, n);
}
function vc(t) {
  var e = t && t.length ? this.write(t) : "";
  return this.lastNeed ? e + "\uFFFD" : e;
}
function yc(t, e) {
  if ((t.length - e) % 2 === 0) {
    var r = t.toString("utf16le", e);
    if (r) {
      var n = r.charCodeAt(r.length - 1);
      if (n >= 55296 && n <= 56319)
        return this.lastNeed = 2, this.lastTotal = 4, this.lastChar[0] = t[t.length - 2], this.lastChar[1] = t[t.length - 1], r.slice(0, -1);
    }
    return r;
  }
  return this.lastNeed = 1, this.lastTotal = 2, this.lastChar[0] = t[t.length - 1], t.toString("utf16le", e, t.length - 1);
}
function gc(t) {
  var e = t && t.length ? this.write(t) : "";
  if (this.lastNeed) {
    var r = this.lastTotal - this.lastNeed;
    return e + this.lastChar.toString("utf16le", 0, r);
  }
  return e;
}
function bc(t, e) {
  var r = (t.length - e) % 3;
  return r === 0 ? t.toString("base64", e) : (this.lastNeed = 3 - r, this.lastTotal = 3, r === 1 ? this.lastChar[0] = t[t.length - 1] : (this.lastChar[0] = t[t.length - 2], this.lastChar[1] = t[t.length - 1]), t.toString("base64", e, t.length - r));
}
function wc(t) {
  var e = t && t.length ? this.write(t) : "";
  return this.lastNeed ? e + this.lastChar.toString("base64", 0, 3 - this.lastNeed) : e;
}
function mc(t) {
  return t.toString(this.encoding);
}
function xc(t) {
  return t && t.length ? this.write(t) : "";
}
var va = Mt.codes.ERR_STREAM_PREMATURE_CLOSE;
function Ec(t) {
  var e = !1;
  return function() {
    if (!e) {
      e = !0;
      for (var r = arguments.length, n = new Array(r), i = 0; i < r; i++)
        n[i] = arguments[i];
      t.apply(this, n);
    }
  };
}
function Sc() {
}
function Rc(t) {
  return t.setHeader && typeof t.abort == "function";
}
function Ks(t, e, r) {
  if (typeof e == "function")
    return Ks(t, null, e);
  e || (e = {}), r = Ec(r || Sc);
  var n = e.readable || e.readable !== !1 && t.readable, i = e.writable || e.writable !== !1 && t.writable, a = function() {
    t.writable || u();
  }, o = t._writableState && t._writableState.finished, u = function() {
    i = !1, o = !0, n || r.call(t);
  }, s = t._readableState && t._readableState.endEmitted, f = function() {
    n = !1, s = !0, i || r.call(t);
  }, h = function(p) {
    r.call(t, p);
  }, l = function() {
    var p;
    if (n && !s)
      return (!t._readableState || !t._readableState.ended) && (p = new va()), r.call(t, p);
    if (i && !o)
      return (!t._writableState || !t._writableState.ended) && (p = new va()), r.call(t, p);
  }, c = function() {
    t.req.on("finish", u);
  };
  return Rc(t) ? (t.on("complete", u), t.on("abort", l), t.req ? c() : t.on("request", c)) : i && !t._writableState && (t.on("end", a), t.on("close", a)), t.on("end", f), t.on("finish", u), e.error !== !1 && t.on("error", h), t.on("close", l), function() {
    t.removeListener("complete", u), t.removeListener("abort", l), t.removeListener("request", c), t.req && t.req.removeListener("finish", u), t.removeListener("end", a), t.removeListener("close", a), t.removeListener("finish", u), t.removeListener("end", f), t.removeListener("error", h), t.removeListener("close", l);
  };
}
var to = Ks, li, ya;
function Cc() {
  if (ya)
    return li;
  ya = 1;
  var t;
  function e(b, w, S) {
    return w in b ? Object.defineProperty(b, w, { value: S, enumerable: !0, configurable: !0, writable: !0 }) : b[w] = S, b;
  }
  var r = to, n = Symbol("lastResolve"), i = Symbol("lastReject"), a = Symbol("error"), o = Symbol("ended"), u = Symbol("lastPromise"), s = Symbol("handlePromise"), f = Symbol("stream");
  function h(b, w) {
    return {
      value: b,
      done: w
    };
  }
  function l(b) {
    var w = b[n];
    if (w !== null) {
      var S = b[f].read();
      S !== null && (b[u] = null, b[n] = null, b[i] = null, w(h(S, !1)));
    }
  }
  function c(b) {
    W.exports.nextTick(l, b);
  }
  function d(b, w) {
    return function(S, A) {
      b.then(function() {
        if (w[o]) {
          S(h(void 0, !0));
          return;
        }
        w[s](S, A);
      }, A);
    };
  }
  var p = Object.getPrototypeOf(function() {
  }), _ = Object.setPrototypeOf((t = {
    get stream() {
      return this[f];
    },
    next: function() {
      var w = this, S = this[a];
      if (S !== null)
        return Promise.reject(S);
      if (this[o])
        return Promise.resolve(h(void 0, !0));
      if (this[f].destroyed)
        return new Promise(function(G, H) {
          W.exports.nextTick(function() {
            w[a] ? H(w[a]) : G(h(void 0, !0));
          });
        });
      var A = this[u], T;
      if (A)
        T = new Promise(d(A, this));
      else {
        var U = this[f].read();
        if (U !== null)
          return Promise.resolve(h(U, !1));
        T = new Promise(this[s]);
      }
      return this[u] = T, T;
    }
  }, e(t, Symbol.asyncIterator, function() {
    return this;
  }), e(t, "return", function() {
    var w = this;
    return new Promise(function(S, A) {
      w[f].destroy(null, function(T) {
        if (T) {
          A(T);
          return;
        }
        S(h(void 0, !0));
      });
    });
  }), t), p), m = function(w) {
    var S, A = Object.create(_, (S = {}, e(S, f, {
      value: w,
      writable: !0
    }), e(S, n, {
      value: null,
      writable: !0
    }), e(S, i, {
      value: null,
      writable: !0
    }), e(S, a, {
      value: null,
      writable: !0
    }), e(S, o, {
      value: w._readableState.endEmitted,
      writable: !0
    }), e(S, s, {
      value: function(U, G) {
        var H = A[f].read();
        H ? (A[u] = null, A[n] = null, A[i] = null, U(h(H, !1))) : (A[n] = U, A[i] = G);
      },
      writable: !0
    }), S));
    return A[u] = null, r(w, function(T) {
      if (T && T.code !== "ERR_STREAM_PREMATURE_CLOSE") {
        var U = A[i];
        U !== null && (A[u] = null, A[n] = null, A[i] = null, U(T)), A[a] = T;
        return;
      }
      var G = A[n];
      G !== null && (A[u] = null, A[n] = null, A[i] = null, G(h(void 0, !0))), A[o] = !0;
    }), w.on("readable", c.bind(null, A)), A;
  };
  return li = m, li;
}
var ci, ga;
function Oc() {
  return ga || (ga = 1, ci = function() {
    throw new Error("Readable.from is not available in the browser");
  }), ci;
}
var hi, ba;
function Xs() {
  if (ba)
    return hi;
  ba = 1, hi = I;
  var t;
  I.ReadableState = H, Ne.exports.EventEmitter;
  var e = function(y, O) {
    return y.listeners(O).length;
  }, r = qs, n = Hr.Buffer, i = R.Uint8Array || function() {
  };
  function a(v) {
    return n.from(v);
  }
  function o(v) {
    return n.isBuffer(v) || v instanceof i;
  }
  var u = Ws, s;
  u && u.debuglog ? s = u.debuglog("stream") : s = function() {
  };
  var f = Xl(), h = zs, l = Ys, c = l.getHighWaterMark, d = Mt.codes, p = d.ERR_INVALID_ARG_TYPE, _ = d.ERR_STREAM_PUSH_AFTER_EOF, m = d.ERR_METHOD_NOT_IMPLEMENTED, b = d.ERR_STREAM_UNSHIFT_AFTER_END_EVENT, w, S, A;
  we.exports(I, r);
  var T = h.errorOrDestroy, U = ["error", "close", "destroy", "pause", "resume"];
  function G(v, y, O) {
    if (typeof v.prependListener == "function")
      return v.prependListener(y, O);
    !v._events || !v._events[y] ? v.on(y, O) : Array.isArray(v._events[y]) ? v._events[y].unshift(O) : v._events[y] = [O, v._events[y]];
  }
  function H(v, y, O) {
    t = t || Wt(), v = v || {}, typeof O != "boolean" && (O = y instanceof t), this.objectMode = !!v.objectMode, O && (this.objectMode = this.objectMode || !!v.readableObjectMode), this.highWaterMark = c(this, v, "readableHighWaterMark", O), this.buffer = new f(), this.length = 0, this.pipes = null, this.pipesCount = 0, this.flowing = null, this.ended = !1, this.endEmitted = !1, this.reading = !1, this.sync = !0, this.needReadable = !1, this.emittedReadable = !1, this.readableListening = !1, this.resumeScheduled = !1, this.paused = !0, this.emitClose = v.emitClose !== !1, this.autoDestroy = !!v.autoDestroy, this.destroyed = !1, this.defaultEncoding = v.defaultEncoding || "utf8", this.awaitDrain = 0, this.readingMore = !1, this.decoder = null, this.encoding = null, v.encoding && (w || (w = vn.StringDecoder), this.decoder = new w(v.encoding), this.encoding = v.encoding);
  }
  function I(v) {
    if (t = t || Wt(), !(this instanceof I))
      return new I(v);
    var y = this instanceof t;
    this._readableState = new H(v, this, y), this.readable = !0, v && (typeof v.read == "function" && (this._read = v.read), typeof v.destroy == "function" && (this._destroy = v.destroy)), r.call(this);
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
    var O = this._readableState, P;
    return O.objectMode ? P = !0 : typeof v == "string" && (y = y || O.defaultEncoding, y !== O.encoding && (v = n.from(v, y), y = ""), P = !0), V(this, v, y, !1, P);
  }, I.prototype.unshift = function(v) {
    return V(this, v, null, !0, !1);
  };
  function V(v, y, O, P, _e) {
    s("readableAddChunk", y);
    var Z = v._readableState;
    if (y === null)
      Z.reading = !1, ge(v, Z);
    else {
      var ue;
      if (_e || (ue = N(Z, y)), ue)
        T(v, ue);
      else if (Z.objectMode || y && y.length > 0)
        if (typeof y != "string" && !Z.objectMode && Object.getPrototypeOf(y) !== n.prototype && (y = a(y)), P)
          Z.endEmitted ? T(v, new b()) : X(v, Z, y, !0);
        else if (Z.ended)
          T(v, new _());
        else {
          if (Z.destroyed)
            return !1;
          Z.reading = !1, Z.decoder && !O ? (y = Z.decoder.write(y), Z.objectMode || y.length !== 0 ? X(v, Z, y, !1) : He(v, Z)) : X(v, Z, y, !1);
        }
      else
        P || (Z.reading = !1, He(v, Z));
    }
    return !Z.ended && (Z.length < Z.highWaterMark || Z.length === 0);
  }
  function X(v, y, O, P) {
    y.flowing && y.length === 0 && !y.sync ? (y.awaitDrain = 0, v.emit("data", O)) : (y.length += y.objectMode ? 1 : O.length, P ? y.buffer.unshift(O) : y.buffer.push(O), y.needReadable && pe(v)), He(v, y);
  }
  function N(v, y) {
    var O;
    return !o(y) && typeof y != "string" && y !== void 0 && !v.objectMode && (O = new p("chunk", ["string", "Buffer", "Uint8Array"], y)), O;
  }
  I.prototype.isPaused = function() {
    return this._readableState.flowing === !1;
  }, I.prototype.setEncoding = function(v) {
    w || (w = vn.StringDecoder);
    var y = new w(v);
    this._readableState.decoder = y, this._readableState.encoding = this._readableState.decoder.encoding;
    for (var O = this._readableState.buffer.head, P = ""; O !== null; )
      P += y.write(O.data), O = O.next;
    return this._readableState.buffer.clear(), P !== "" && this._readableState.buffer.push(P), this._readableState.length = P.length, this;
  };
  var L = 1073741824;
  function q(v) {
    return v >= L ? v = L : (v--, v |= v >>> 1, v |= v >>> 2, v |= v >>> 4, v |= v >>> 8, v |= v >>> 16, v++), v;
  }
  function te(v, y) {
    return v <= 0 || y.length === 0 && y.ended ? 0 : y.objectMode ? 1 : v !== v ? y.flowing && y.length ? y.buffer.head.data.length : y.length : (v > y.highWaterMark && (y.highWaterMark = q(v)), v <= y.length ? v : y.ended ? y.length : (y.needReadable = !0, 0));
  }
  I.prototype.read = function(v) {
    s("read", v), v = parseInt(v, 10);
    var y = this._readableState, O = v;
    if (v !== 0 && (y.emittedReadable = !1), v === 0 && y.needReadable && ((y.highWaterMark !== 0 ? y.length >= y.highWaterMark : y.length > 0) || y.ended))
      return s("read: emitReadable", y.length, y.ended), y.length === 0 && y.ended ? k(this) : pe(this), null;
    if (v = te(v, y), v === 0 && y.ended)
      return y.length === 0 && k(this), null;
    var P = y.needReadable;
    s("need readable", P), (y.length === 0 || y.length - v < y.highWaterMark) && (P = !0, s("length less than watermark", P)), y.ended || y.reading ? (P = !1, s("reading or ended", P)) : P && (s("do read"), y.reading = !0, y.sync = !0, y.length === 0 && (y.needReadable = !0), this._read(y.highWaterMark), y.sync = !1, y.reading || (v = te(O, y)));
    var _e;
    return v > 0 ? _e = x(v, y) : _e = null, _e === null ? (y.needReadable = y.length <= y.highWaterMark, v = 0) : (y.length -= v, y.awaitDrain = 0), y.length === 0 && (y.ended || (y.needReadable = !0), O !== v && y.ended && k(this)), _e !== null && this.emit("data", _e), _e;
  };
  function ge(v, y) {
    if (s("onEofChunk"), !y.ended) {
      if (y.decoder) {
        var O = y.decoder.end();
        O && O.length && (y.buffer.push(O), y.length += y.objectMode ? 1 : O.length);
      }
      y.ended = !0, y.sync ? pe(v) : (y.needReadable = !1, y.emittedReadable || (y.emittedReadable = !0, Ye(v)));
    }
  }
  function pe(v) {
    var y = v._readableState;
    s("emitReadable", y.needReadable, y.emittedReadable), y.needReadable = !1, y.emittedReadable || (s("emitReadable", y.flowing), y.emittedReadable = !0, W.exports.nextTick(Ye, v));
  }
  function Ye(v) {
    var y = v._readableState;
    s("emitReadable_", y.destroyed, y.length, y.ended), !y.destroyed && (y.length || y.ended) && (v.emit("readable"), y.emittedReadable = !1), y.needReadable = !y.flowing && !y.ended && y.length <= y.highWaterMark, g(v);
  }
  function He(v, y) {
    y.readingMore || (y.readingMore = !0, W.exports.nextTick(Me, v, y));
  }
  function Me(v, y) {
    for (; !y.reading && !y.ended && (y.length < y.highWaterMark || y.flowing && y.length === 0); ) {
      var O = y.length;
      if (s("maybeReadMore read 0"), v.read(0), O === y.length)
        break;
    }
    y.readingMore = !1;
  }
  I.prototype._read = function(v) {
    T(this, new m("_read()"));
  }, I.prototype.pipe = function(v, y) {
    var O = this, P = this._readableState;
    switch (P.pipesCount) {
      case 0:
        P.pipes = v;
        break;
      case 1:
        P.pipes = [P.pipes, v];
        break;
      default:
        P.pipes.push(v);
        break;
    }
    P.pipesCount += 1, s("pipe count=%d opts=%j", P.pipesCount, y);
    var _e = (!y || y.end !== !1) && v !== W.exports.stdout && v !== W.exports.stderr, Z = _e ? Lt : Yt;
    P.endEmitted ? W.exports.nextTick(Z) : O.once("end", Z), v.on("unpipe", ue);
    function ue(Bt, Pt) {
      s("onunpipe"), Bt === O && Pt && Pt.hasUnpiped === !1 && (Pt.hasUnpiped = !0, Ou());
    }
    function Lt() {
      s("onend"), v.end();
    }
    var Wr = ae(O);
    v.on("drain", Wr);
    var oo = !1;
    function Ou() {
      s("cleanup"), v.removeListener("close", Nn), v.removeListener("finish", Fn), v.removeListener("drain", Wr), v.removeListener("error", jn), v.removeListener("unpipe", ue), O.removeListener("end", Lt), O.removeListener("end", Yt), O.removeListener("data", ao), oo = !0, P.awaitDrain && (!v._writableState || v._writableState.needDrain) && Wr();
    }
    O.on("data", ao);
    function ao(Bt) {
      s("ondata");
      var Pt = v.write(Bt);
      s("dest.write", Pt), Pt === !1 && ((P.pipesCount === 1 && P.pipes === v || P.pipesCount > 1 && Q(P.pipes, v) !== -1) && !oo && (s("false write response, pause", P.awaitDrain), P.awaitDrain++), O.pause());
    }
    function jn(Bt) {
      s("onerror", Bt), Yt(), v.removeListener("error", jn), e(v, "error") === 0 && T(v, Bt);
    }
    G(v, "error", jn);
    function Nn() {
      v.removeListener("finish", Fn), Yt();
    }
    v.once("close", Nn);
    function Fn() {
      s("onfinish"), v.removeListener("close", Nn), Yt();
    }
    v.once("finish", Fn);
    function Yt() {
      s("unpipe"), O.unpipe(v);
    }
    return v.emit("pipe", O), P.flowing || (s("pipe resume"), O.resume()), v;
  };
  function ae(v) {
    return function() {
      var O = v._readableState;
      s("pipeOnDrain", O.awaitDrain), O.awaitDrain && O.awaitDrain--, O.awaitDrain === 0 && e(v, "data") && (O.flowing = !0, g(v));
    };
  }
  I.prototype.unpipe = function(v) {
    var y = this._readableState, O = {
      hasUnpiped: !1
    };
    if (y.pipesCount === 0)
      return this;
    if (y.pipesCount === 1)
      return v && v !== y.pipes ? this : (v || (v = y.pipes), y.pipes = null, y.pipesCount = 0, y.flowing = !1, v && v.emit("unpipe", this, O), this);
    if (!v) {
      var P = y.pipes, _e = y.pipesCount;
      y.pipes = null, y.pipesCount = 0, y.flowing = !1;
      for (var Z = 0; Z < _e; Z++)
        P[Z].emit("unpipe", this, {
          hasUnpiped: !1
        });
      return this;
    }
    var ue = Q(y.pipes, v);
    return ue === -1 ? this : (y.pipes.splice(ue, 1), y.pipesCount -= 1, y.pipesCount === 1 && (y.pipes = y.pipes[0]), v.emit("unpipe", this, O), this);
  }, I.prototype.on = function(v, y) {
    var O = r.prototype.on.call(this, v, y), P = this._readableState;
    return v === "data" ? (P.readableListening = this.listenerCount("readable") > 0, P.flowing !== !1 && this.resume()) : v === "readable" && !P.endEmitted && !P.readableListening && (P.readableListening = P.needReadable = !0, P.flowing = !1, P.emittedReadable = !1, s("on readable", P.length, P.reading), P.length ? pe(this) : P.reading || W.exports.nextTick(re, this)), O;
  }, I.prototype.addListener = I.prototype.on, I.prototype.removeListener = function(v, y) {
    var O = r.prototype.removeListener.call(this, v, y);
    return v === "readable" && W.exports.nextTick(ft, this), O;
  }, I.prototype.removeAllListeners = function(v) {
    var y = r.prototype.removeAllListeners.apply(this, arguments);
    return (v === "readable" || v === void 0) && W.exports.nextTick(ft, this), y;
  };
  function ft(v) {
    var y = v._readableState;
    y.readableListening = v.listenerCount("readable") > 0, y.resumeScheduled && !y.paused ? y.flowing = !0 : v.listenerCount("data") > 0 && v.resume();
  }
  function re(v) {
    s("readable nexttick read 0"), v.read(0);
  }
  I.prototype.resume = function() {
    var v = this._readableState;
    return v.flowing || (s("resume"), v.flowing = !v.readableListening, D(this, v)), v.paused = !1, this;
  };
  function D(v, y) {
    y.resumeScheduled || (y.resumeScheduled = !0, W.exports.nextTick(J, v, y));
  }
  function J(v, y) {
    s("resume", y.reading), y.reading || v.read(0), y.resumeScheduled = !1, v.emit("resume"), g(v), y.flowing && !y.reading && v.read(0);
  }
  I.prototype.pause = function() {
    return s("call pause flowing=%j", this._readableState.flowing), this._readableState.flowing !== !1 && (s("pause"), this._readableState.flowing = !1, this.emit("pause")), this._readableState.paused = !0, this;
  };
  function g(v) {
    var y = v._readableState;
    for (s("flow", y.flowing); y.flowing && v.read() !== null; )
      ;
  }
  I.prototype.wrap = function(v) {
    var y = this, O = this._readableState, P = !1;
    v.on("end", function() {
      if (s("wrapped end"), O.decoder && !O.ended) {
        var ue = O.decoder.end();
        ue && ue.length && y.push(ue);
      }
      y.push(null);
    }), v.on("data", function(ue) {
      if (s("wrapped data"), O.decoder && (ue = O.decoder.write(ue)), !(O.objectMode && ue == null) && !(!O.objectMode && (!ue || !ue.length))) {
        var Lt = y.push(ue);
        Lt || (P = !0, v.pause());
      }
    });
    for (var _e in v)
      this[_e] === void 0 && typeof v[_e] == "function" && (this[_e] = function(Lt) {
        return function() {
          return v[Lt].apply(v, arguments);
        };
      }(_e));
    for (var Z = 0; Z < U.length; Z++)
      v.on(U[Z], this.emit.bind(this, U[Z]));
    return this._read = function(ue) {
      s("wrapped _read", ue), P && (P = !1, v.resume());
    }, this;
  }, typeof Symbol == "function" && (I.prototype[Symbol.asyncIterator] = function() {
    return S === void 0 && (S = Cc()), S(this);
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
  }), I._fromList = x, Object.defineProperty(I.prototype, "readableLength", {
    enumerable: !1,
    get: function() {
      return this._readableState.length;
    }
  });
  function x(v, y) {
    if (y.length === 0)
      return null;
    var O;
    return y.objectMode ? O = y.buffer.shift() : !v || v >= y.length ? (y.decoder ? O = y.buffer.join("") : y.buffer.length === 1 ? O = y.buffer.first() : O = y.buffer.concat(y.length), y.buffer.clear()) : O = y.buffer.consume(v, y.decoder), O;
  }
  function k(v) {
    var y = v._readableState;
    s("endReadable", y.endEmitted), y.endEmitted || (y.ended = !0, W.exports.nextTick(F, y, v));
  }
  function F(v, y) {
    if (s("endReadableNT", v.endEmitted, v.length), !v.endEmitted && v.length === 0 && (v.endEmitted = !0, y.readable = !1, y.emit("end"), v.autoDestroy)) {
      var O = y._writableState;
      (!O || O.autoDestroy && O.finished) && y.destroy();
    }
  }
  typeof Symbol == "function" && (I.from = function(v, y) {
    return A === void 0 && (A = Oc()), A(I, v, y);
  });
  function Q(v, y) {
    for (var O = 0, P = v.length; O < P; O++)
      if (v[O] === y)
        return O;
    return -1;
  }
  return hi;
}
var Qs = st, kn = Mt.codes, Ac = kn.ERR_METHOD_NOT_IMPLEMENTED, kc = kn.ERR_MULTIPLE_CALLBACK, Mc = kn.ERR_TRANSFORM_ALREADY_TRANSFORMING, Ic = kn.ERR_TRANSFORM_WITH_LENGTH_0, Mn = Wt();
we.exports(st, Mn);
function Tc(t, e) {
  var r = this._transformState;
  r.transforming = !1;
  var n = r.writecb;
  if (n === null)
    return this.emit("error", new kc());
  r.writechunk = null, r.writecb = null, e != null && this.push(e), n(t);
  var i = this._readableState;
  i.reading = !1, (i.needReadable || i.length < i.highWaterMark) && this._read(i.highWaterMark);
}
function st(t) {
  if (!(this instanceof st))
    return new st(t);
  Mn.call(this, t), this._transformState = {
    afterTransform: Tc.bind(this),
    needTransform: !1,
    transforming: !1,
    writecb: null,
    writechunk: null,
    writeencoding: null
  }, this._readableState.needReadable = !0, this._readableState.sync = !1, t && (typeof t.transform == "function" && (this._transform = t.transform), typeof t.flush == "function" && (this._flush = t.flush)), this.on("prefinish", Lc);
}
function Lc() {
  var t = this;
  typeof this._flush == "function" && !this._readableState.destroyed ? this._flush(function(e, r) {
    wa(t, e, r);
  }) : wa(this, null, null);
}
st.prototype.push = function(t, e) {
  return this._transformState.needTransform = !1, Mn.prototype.push.call(this, t, e);
};
st.prototype._transform = function(t, e, r) {
  r(new Ac("_transform()"));
};
st.prototype._write = function(t, e, r) {
  var n = this._transformState;
  if (n.writecb = r, n.writechunk = t, n.writeencoding = e, !n.transforming) {
    var i = this._readableState;
    (n.needTransform || i.needReadable || i.length < i.highWaterMark) && this._read(i.highWaterMark);
  }
};
st.prototype._read = function(t) {
  var e = this._transformState;
  e.writechunk !== null && !e.transforming ? (e.transforming = !0, this._transform(e.writechunk, e.writeencoding, e.afterTransform)) : e.needTransform = !0;
};
st.prototype._destroy = function(t, e) {
  Mn.prototype._destroy.call(this, t, function(r) {
    e(r);
  });
};
function wa(t, e, r) {
  if (e)
    return t.emit("error", e);
  if (r != null && t.push(r), t._writableState.length)
    throw new Ic();
  if (t._transformState.transforming)
    throw new Mc();
  return t.push(null);
}
var Bc = Br, Js = Qs;
we.exports(Br, Js);
function Br(t) {
  if (!(this instanceof Br))
    return new Br(t);
  Js.call(this, t);
}
Br.prototype._transform = function(t, e, r) {
  r(null, t);
};
var di;
function Pc(t) {
  var e = !1;
  return function() {
    e || (e = !0, t.apply(void 0, arguments));
  };
}
var eu = Mt.codes, Hc = eu.ERR_MISSING_ARGS, qc = eu.ERR_STREAM_DESTROYED;
function ma(t) {
  if (t)
    throw t;
}
function Dc(t) {
  return t.setHeader && typeof t.abort == "function";
}
function jc(t, e, r, n) {
  n = Pc(n);
  var i = !1;
  t.on("close", function() {
    i = !0;
  }), di === void 0 && (di = to), di(t, {
    readable: e,
    writable: r
  }, function(o) {
    if (o)
      return n(o);
    i = !0, n();
  });
  var a = !1;
  return function(o) {
    if (!i && !a) {
      if (a = !0, Dc(t))
        return t.abort();
      if (typeof t.destroy == "function")
        return t.destroy();
      n(o || new qc("pipe"));
    }
  };
}
function xa(t) {
  t();
}
function Nc(t, e) {
  return t.pipe(e);
}
function Fc(t) {
  return !t.length || typeof t[t.length - 1] != "function" ? ma : t.pop();
}
function $c() {
  for (var t = arguments.length, e = new Array(t), r = 0; r < t; r++)
    e[r] = arguments[r];
  var n = Fc(e);
  if (Array.isArray(e[0]) && (e = e[0]), e.length < 2)
    throw new Hc("streams");
  var i, a = e.map(function(o, u) {
    var s = u < e.length - 1, f = u > 0;
    return jc(o, s, f, function(h) {
      i || (i = h), h && a.forEach(xa), !s && (a.forEach(xa), n(i));
    });
  });
  return e.reduce(Nc);
}
var Uc = $c;
(function(t, e) {
  e = t.exports = Xs(), e.Stream = e, e.Readable = e, e.Writable = Gs(), e.Duplex = Wt(), e.Transform = Qs, e.PassThrough = Bc, e.finished = to, e.pipeline = Uc;
})(Si, Si.exports);
var yn = Be.exports.Buffer, tu = Si.exports.Transform, Wc = we.exports;
function zc(t, e) {
  if (!yn.isBuffer(t) && typeof t != "string")
    throw new TypeError(e + " must be a string or a buffer");
}
function yt(t) {
  tu.call(this), this._block = yn.allocUnsafe(t), this._blockSize = t, this._blockOffset = 0, this._length = [0, 0, 0, 0], this._finalized = !1;
}
Wc(yt, tu);
yt.prototype._transform = function(t, e, r) {
  var n = null;
  try {
    this.update(t, e);
  } catch (i) {
    n = i;
  }
  r(n);
};
yt.prototype._flush = function(t) {
  var e = null;
  try {
    this.push(this.digest());
  } catch (r) {
    e = r;
  }
  t(e);
};
yt.prototype.update = function(t, e) {
  if (zc(t, "Data"), this._finalized)
    throw new Error("Digest already called");
  yn.isBuffer(t) || (t = yn.from(t, e));
  for (var r = this._block, n = 0; this._blockOffset + t.length - n >= this._blockSize; ) {
    for (var i = this._blockOffset; i < this._blockSize; )
      r[i++] = t[n++];
    this._update(), this._blockOffset = 0;
  }
  for (; n < t.length; )
    r[this._blockOffset++] = t[n++];
  for (var a = 0, o = t.length * 8; o > 0; ++a)
    this._length[a] += o, o = this._length[a] / 4294967296 | 0, o > 0 && (this._length[a] -= 4294967296 * o);
  return this;
};
yt.prototype._update = function() {
  throw new Error("_update is not implemented");
};
yt.prototype.digest = function(t) {
  if (this._finalized)
    throw new Error("Digest already called");
  this._finalized = !0;
  var e = this._digest();
  t !== void 0 && (e = e.toString(t)), this._block.fill(0), this._blockOffset = 0;
  for (var r = 0; r < 4; ++r)
    this._length[r] = 0;
  return e;
};
yt.prototype._digest = function() {
  throw new Error("_digest is not implemented");
};
var ru = yt, Vc = we.exports, nu = ru, Yc = Be.exports.Buffer, Gc = new Array(16);
function In() {
  nu.call(this, 64), this._a = 1732584193, this._b = 4023233417, this._c = 2562383102, this._d = 271733878;
}
Vc(In, nu);
In.prototype._update = function() {
  for (var t = Gc, e = 0; e < 16; ++e)
    t[e] = this._block.readInt32LE(e * 4);
  var r = this._a, n = this._b, i = this._c, a = this._d;
  r = Ee(r, n, i, a, t[0], 3614090360, 7), a = Ee(a, r, n, i, t[1], 3905402710, 12), i = Ee(i, a, r, n, t[2], 606105819, 17), n = Ee(n, i, a, r, t[3], 3250441966, 22), r = Ee(r, n, i, a, t[4], 4118548399, 7), a = Ee(a, r, n, i, t[5], 1200080426, 12), i = Ee(i, a, r, n, t[6], 2821735955, 17), n = Ee(n, i, a, r, t[7], 4249261313, 22), r = Ee(r, n, i, a, t[8], 1770035416, 7), a = Ee(a, r, n, i, t[9], 2336552879, 12), i = Ee(i, a, r, n, t[10], 4294925233, 17), n = Ee(n, i, a, r, t[11], 2304563134, 22), r = Ee(r, n, i, a, t[12], 1804603682, 7), a = Ee(a, r, n, i, t[13], 4254626195, 12), i = Ee(i, a, r, n, t[14], 2792965006, 17), n = Ee(n, i, a, r, t[15], 1236535329, 22), r = Se(r, n, i, a, t[1], 4129170786, 5), a = Se(a, r, n, i, t[6], 3225465664, 9), i = Se(i, a, r, n, t[11], 643717713, 14), n = Se(n, i, a, r, t[0], 3921069994, 20), r = Se(r, n, i, a, t[5], 3593408605, 5), a = Se(a, r, n, i, t[10], 38016083, 9), i = Se(i, a, r, n, t[15], 3634488961, 14), n = Se(n, i, a, r, t[4], 3889429448, 20), r = Se(r, n, i, a, t[9], 568446438, 5), a = Se(a, r, n, i, t[14], 3275163606, 9), i = Se(i, a, r, n, t[3], 4107603335, 14), n = Se(n, i, a, r, t[8], 1163531501, 20), r = Se(r, n, i, a, t[13], 2850285829, 5), a = Se(a, r, n, i, t[2], 4243563512, 9), i = Se(i, a, r, n, t[7], 1735328473, 14), n = Se(n, i, a, r, t[12], 2368359562, 20), r = Re(r, n, i, a, t[5], 4294588738, 4), a = Re(a, r, n, i, t[8], 2272392833, 11), i = Re(i, a, r, n, t[11], 1839030562, 16), n = Re(n, i, a, r, t[14], 4259657740, 23), r = Re(r, n, i, a, t[1], 2763975236, 4), a = Re(a, r, n, i, t[4], 1272893353, 11), i = Re(i, a, r, n, t[7], 4139469664, 16), n = Re(n, i, a, r, t[10], 3200236656, 23), r = Re(r, n, i, a, t[13], 681279174, 4), a = Re(a, r, n, i, t[0], 3936430074, 11), i = Re(i, a, r, n, t[3], 3572445317, 16), n = Re(n, i, a, r, t[6], 76029189, 23), r = Re(r, n, i, a, t[9], 3654602809, 4), a = Re(a, r, n, i, t[12], 3873151461, 11), i = Re(i, a, r, n, t[15], 530742520, 16), n = Re(n, i, a, r, t[2], 3299628645, 23), r = Ce(r, n, i, a, t[0], 4096336452, 6), a = Ce(a, r, n, i, t[7], 1126891415, 10), i = Ce(i, a, r, n, t[14], 2878612391, 15), n = Ce(n, i, a, r, t[5], 4237533241, 21), r = Ce(r, n, i, a, t[12], 1700485571, 6), a = Ce(a, r, n, i, t[3], 2399980690, 10), i = Ce(i, a, r, n, t[10], 4293915773, 15), n = Ce(n, i, a, r, t[1], 2240044497, 21), r = Ce(r, n, i, a, t[8], 1873313359, 6), a = Ce(a, r, n, i, t[15], 4264355552, 10), i = Ce(i, a, r, n, t[6], 2734768916, 15), n = Ce(n, i, a, r, t[13], 1309151649, 21), r = Ce(r, n, i, a, t[4], 4149444226, 6), a = Ce(a, r, n, i, t[11], 3174756917, 10), i = Ce(i, a, r, n, t[2], 718787259, 15), n = Ce(n, i, a, r, t[9], 3951481745, 21), this._a = this._a + r | 0, this._b = this._b + n | 0, this._c = this._c + i | 0, this._d = this._d + a | 0;
};
In.prototype._digest = function() {
  this._block[this._blockOffset++] = 128, this._blockOffset > 56 && (this._block.fill(0, this._blockOffset, 64), this._update(), this._blockOffset = 0), this._block.fill(0, this._blockOffset, 56), this._block.writeUInt32LE(this._length[0], 56), this._block.writeUInt32LE(this._length[1], 60), this._update();
  var t = Yc.allocUnsafe(16);
  return t.writeInt32LE(this._a, 0), t.writeInt32LE(this._b, 4), t.writeInt32LE(this._c, 8), t.writeInt32LE(this._d, 12), t;
};
function Tn(t, e) {
  return t << e | t >>> 32 - e;
}
function Ee(t, e, r, n, i, a, o) {
  return Tn(t + (e & r | ~e & n) + i + a | 0, o) + e | 0;
}
function Se(t, e, r, n, i, a, o) {
  return Tn(t + (e & n | r & ~n) + i + a | 0, o) + e | 0;
}
function Re(t, e, r, n, i, a, o) {
  return Tn(t + (e ^ r ^ n) + i + a | 0, o) + e | 0;
}
function Ce(t, e, r, n, i, a, o) {
  return Tn(t + (r ^ (e | ~n)) + i + a | 0, o) + e | 0;
}
var Zc = In, pi = Hr.Buffer, Kc = we.exports, iu = ru, Xc = new Array(16), gr = [
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
], br = [
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
], wr = [
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
], mr = [
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
], xr = [0, 1518500249, 1859775393, 2400959708, 2840853838], Er = [1352829926, 1548603684, 1836072691, 2053994217, 0];
function Ln() {
  iu.call(this, 64), this._a = 1732584193, this._b = 4023233417, this._c = 2562383102, this._d = 271733878, this._e = 3285377520;
}
Kc(Ln, iu);
Ln.prototype._update = function() {
  for (var t = Xc, e = 0; e < 16; ++e)
    t[e] = this._block.readInt32LE(e * 4);
  for (var r = this._a | 0, n = this._b | 0, i = this._c | 0, a = this._d | 0, o = this._e | 0, u = this._a | 0, s = this._b | 0, f = this._c | 0, h = this._d | 0, l = this._e | 0, c = 0; c < 80; c += 1) {
    var d, p;
    c < 16 ? (d = Ea(r, n, i, a, o, t[gr[c]], xr[0], wr[c]), p = Oa(u, s, f, h, l, t[br[c]], Er[0], mr[c])) : c < 32 ? (d = Sa(r, n, i, a, o, t[gr[c]], xr[1], wr[c]), p = Ca(u, s, f, h, l, t[br[c]], Er[1], mr[c])) : c < 48 ? (d = Ra(r, n, i, a, o, t[gr[c]], xr[2], wr[c]), p = Ra(u, s, f, h, l, t[br[c]], Er[2], mr[c])) : c < 64 ? (d = Ca(r, n, i, a, o, t[gr[c]], xr[3], wr[c]), p = Sa(u, s, f, h, l, t[br[c]], Er[3], mr[c])) : (d = Oa(r, n, i, a, o, t[gr[c]], xr[4], wr[c]), p = Ea(u, s, f, h, l, t[br[c]], Er[4], mr[c])), r = o, o = a, a = Ct(i, 10), i = n, n = d, u = l, l = h, h = Ct(f, 10), f = s, s = p;
  }
  var _ = this._b + i + h | 0;
  this._b = this._c + a + l | 0, this._c = this._d + o + u | 0, this._d = this._e + r + s | 0, this._e = this._a + n + f | 0, this._a = _;
};
Ln.prototype._digest = function() {
  this._block[this._blockOffset++] = 128, this._blockOffset > 56 && (this._block.fill(0, this._blockOffset, 64), this._update(), this._blockOffset = 0), this._block.fill(0, this._blockOffset, 56), this._block.writeUInt32LE(this._length[0], 56), this._block.writeUInt32LE(this._length[1], 60), this._update();
  var t = pi.alloc ? pi.alloc(20) : new pi(20);
  return t.writeInt32LE(this._a, 0), t.writeInt32LE(this._b, 4), t.writeInt32LE(this._c, 8), t.writeInt32LE(this._d, 12), t.writeInt32LE(this._e, 16), t;
};
function Ct(t, e) {
  return t << e | t >>> 32 - e;
}
function Ea(t, e, r, n, i, a, o, u) {
  return Ct(t + (e ^ r ^ n) + a + o | 0, u) + i | 0;
}
function Sa(t, e, r, n, i, a, o, u) {
  return Ct(t + (e & r | ~e & n) + a + o | 0, u) + i | 0;
}
function Ra(t, e, r, n, i, a, o, u) {
  return Ct(t + ((e | ~r) ^ n) + a + o | 0, u) + i | 0;
}
function Ca(t, e, r, n, i, a, o, u) {
  return Ct(t + (e & n | r & ~n) + a + o | 0, u) + i | 0;
}
function Oa(t, e, r, n, i, a, o, u) {
  return Ct(t + (e ^ (r | ~n)) + a + o | 0, u) + i | 0;
}
var Qc = Ln, ou = { exports: {} }, au = Be.exports.Buffer;
function Bn(t, e) {
  this._block = au.alloc(t), this._finalSize = e, this._blockSize = t, this._len = 0;
}
Bn.prototype.update = function(t, e) {
  typeof t == "string" && (e = e || "utf8", t = au.from(t, e));
  for (var r = this._block, n = this._blockSize, i = t.length, a = this._len, o = 0; o < i; ) {
    for (var u = a % n, s = Math.min(i - o, n - u), f = 0; f < s; f++)
      r[u + f] = t[o + f];
    a += s, o += s, a % n === 0 && this._update(r);
  }
  return this._len += i, this;
};
Bn.prototype.digest = function(t) {
  var e = this._len % this._blockSize;
  this._block[e] = 128, this._block.fill(0, e + 1), e >= this._finalSize && (this._update(this._block), this._block.fill(0));
  var r = this._len * 8;
  if (r <= 4294967295)
    this._block.writeUInt32BE(r, this._blockSize - 4);
  else {
    var n = (r & 4294967295) >>> 0, i = (r - n) / 4294967296;
    this._block.writeUInt32BE(i, this._blockSize - 8), this._block.writeUInt32BE(n, this._blockSize - 4);
  }
  this._update(this._block);
  var a = this._hash();
  return t ? a.toString(t) : a;
};
Bn.prototype._update = function() {
  throw new Error("_update must be implemented by subclass");
};
var Vt = Bn, Jc = we.exports, su = Vt, eh = Be.exports.Buffer, th = [
  1518500249,
  1859775393,
  -1894007588,
  -899497514
], rh = new Array(80);
function Nr() {
  this.init(), this._w = rh, su.call(this, 64, 56);
}
Jc(Nr, su);
Nr.prototype.init = function() {
  return this._a = 1732584193, this._b = 4023233417, this._c = 2562383102, this._d = 271733878, this._e = 3285377520, this;
};
function nh(t) {
  return t << 5 | t >>> 27;
}
function ih(t) {
  return t << 30 | t >>> 2;
}
function oh(t, e, r, n) {
  return t === 0 ? e & r | ~e & n : t === 2 ? e & r | e & n | r & n : e ^ r ^ n;
}
Nr.prototype._update = function(t) {
  for (var e = this._w, r = this._a | 0, n = this._b | 0, i = this._c | 0, a = this._d | 0, o = this._e | 0, u = 0; u < 16; ++u)
    e[u] = t.readInt32BE(u * 4);
  for (; u < 80; ++u)
    e[u] = e[u - 3] ^ e[u - 8] ^ e[u - 14] ^ e[u - 16];
  for (var s = 0; s < 80; ++s) {
    var f = ~~(s / 20), h = nh(r) + oh(f, n, i, a) + o + e[s] + th[f] | 0;
    o = a, a = i, i = ih(n), n = r, r = h;
  }
  this._a = r + this._a | 0, this._b = n + this._b | 0, this._c = i + this._c | 0, this._d = a + this._d | 0, this._e = o + this._e | 0;
};
Nr.prototype._hash = function() {
  var t = eh.allocUnsafe(20);
  return t.writeInt32BE(this._a | 0, 0), t.writeInt32BE(this._b | 0, 4), t.writeInt32BE(this._c | 0, 8), t.writeInt32BE(this._d | 0, 12), t.writeInt32BE(this._e | 0, 16), t;
};
var ah = Nr, sh = we.exports, uu = Vt, uh = Be.exports.Buffer, fh = [
  1518500249,
  1859775393,
  -1894007588,
  -899497514
], lh = new Array(80);
function Fr() {
  this.init(), this._w = lh, uu.call(this, 64, 56);
}
sh(Fr, uu);
Fr.prototype.init = function() {
  return this._a = 1732584193, this._b = 4023233417, this._c = 2562383102, this._d = 271733878, this._e = 3285377520, this;
};
function ch(t) {
  return t << 1 | t >>> 31;
}
function hh(t) {
  return t << 5 | t >>> 27;
}
function dh(t) {
  return t << 30 | t >>> 2;
}
function ph(t, e, r, n) {
  return t === 0 ? e & r | ~e & n : t === 2 ? e & r | e & n | r & n : e ^ r ^ n;
}
Fr.prototype._update = function(t) {
  for (var e = this._w, r = this._a | 0, n = this._b | 0, i = this._c | 0, a = this._d | 0, o = this._e | 0, u = 0; u < 16; ++u)
    e[u] = t.readInt32BE(u * 4);
  for (; u < 80; ++u)
    e[u] = ch(e[u - 3] ^ e[u - 8] ^ e[u - 14] ^ e[u - 16]);
  for (var s = 0; s < 80; ++s) {
    var f = ~~(s / 20), h = hh(r) + ph(f, n, i, a) + o + e[s] + fh[f] | 0;
    o = a, a = i, i = dh(n), n = r, r = h;
  }
  this._a = r + this._a | 0, this._b = n + this._b | 0, this._c = i + this._c | 0, this._d = a + this._d | 0, this._e = o + this._e | 0;
};
Fr.prototype._hash = function() {
  var t = uh.allocUnsafe(20);
  return t.writeInt32BE(this._a | 0, 0), t.writeInt32BE(this._b | 0, 4), t.writeInt32BE(this._c | 0, 8), t.writeInt32BE(this._d | 0, 12), t.writeInt32BE(this._e | 0, 16), t;
};
var _h = Fr, vh = we.exports, fu = Vt, yh = Be.exports.Buffer, gh = [
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
], bh = new Array(64);
function $r() {
  this.init(), this._w = bh, fu.call(this, 64, 56);
}
vh($r, fu);
$r.prototype.init = function() {
  return this._a = 1779033703, this._b = 3144134277, this._c = 1013904242, this._d = 2773480762, this._e = 1359893119, this._f = 2600822924, this._g = 528734635, this._h = 1541459225, this;
};
function wh(t, e, r) {
  return r ^ t & (e ^ r);
}
function mh(t, e, r) {
  return t & e | r & (t | e);
}
function xh(t) {
  return (t >>> 2 | t << 30) ^ (t >>> 13 | t << 19) ^ (t >>> 22 | t << 10);
}
function Eh(t) {
  return (t >>> 6 | t << 26) ^ (t >>> 11 | t << 21) ^ (t >>> 25 | t << 7);
}
function Sh(t) {
  return (t >>> 7 | t << 25) ^ (t >>> 18 | t << 14) ^ t >>> 3;
}
function Rh(t) {
  return (t >>> 17 | t << 15) ^ (t >>> 19 | t << 13) ^ t >>> 10;
}
$r.prototype._update = function(t) {
  for (var e = this._w, r = this._a | 0, n = this._b | 0, i = this._c | 0, a = this._d | 0, o = this._e | 0, u = this._f | 0, s = this._g | 0, f = this._h | 0, h = 0; h < 16; ++h)
    e[h] = t.readInt32BE(h * 4);
  for (; h < 64; ++h)
    e[h] = Rh(e[h - 2]) + e[h - 7] + Sh(e[h - 15]) + e[h - 16] | 0;
  for (var l = 0; l < 64; ++l) {
    var c = f + Eh(o) + wh(o, u, s) + gh[l] + e[l] | 0, d = xh(r) + mh(r, n, i) | 0;
    f = s, s = u, u = o, o = a + c | 0, a = i, i = n, n = r, r = c + d | 0;
  }
  this._a = r + this._a | 0, this._b = n + this._b | 0, this._c = i + this._c | 0, this._d = a + this._d | 0, this._e = o + this._e | 0, this._f = u + this._f | 0, this._g = s + this._g | 0, this._h = f + this._h | 0;
};
$r.prototype._hash = function() {
  var t = yh.allocUnsafe(32);
  return t.writeInt32BE(this._a, 0), t.writeInt32BE(this._b, 4), t.writeInt32BE(this._c, 8), t.writeInt32BE(this._d, 12), t.writeInt32BE(this._e, 16), t.writeInt32BE(this._f, 20), t.writeInt32BE(this._g, 24), t.writeInt32BE(this._h, 28), t;
};
var lu = $r, Ch = we.exports, Oh = lu, Ah = Vt, kh = Be.exports.Buffer, Mh = new Array(64);
function Pn() {
  this.init(), this._w = Mh, Ah.call(this, 64, 56);
}
Ch(Pn, Oh);
Pn.prototype.init = function() {
  return this._a = 3238371032, this._b = 914150663, this._c = 812702999, this._d = 4144912697, this._e = 4290775857, this._f = 1750603025, this._g = 1694076839, this._h = 3204075428, this;
};
Pn.prototype._hash = function() {
  var t = kh.allocUnsafe(28);
  return t.writeInt32BE(this._a, 0), t.writeInt32BE(this._b, 4), t.writeInt32BE(this._c, 8), t.writeInt32BE(this._d, 12), t.writeInt32BE(this._e, 16), t.writeInt32BE(this._f, 20), t.writeInt32BE(this._g, 24), t;
};
var Ih = Pn, Th = we.exports, cu = Vt, Lh = Be.exports.Buffer, Aa = [
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
], Bh = new Array(160);
function Ur() {
  this.init(), this._w = Bh, cu.call(this, 128, 112);
}
Th(Ur, cu);
Ur.prototype.init = function() {
  return this._ah = 1779033703, this._bh = 3144134277, this._ch = 1013904242, this._dh = 2773480762, this._eh = 1359893119, this._fh = 2600822924, this._gh = 528734635, this._hh = 1541459225, this._al = 4089235720, this._bl = 2227873595, this._cl = 4271175723, this._dl = 1595750129, this._el = 2917565137, this._fl = 725511199, this._gl = 4215389547, this._hl = 327033209, this;
};
function ka(t, e, r) {
  return r ^ t & (e ^ r);
}
function Ma(t, e, r) {
  return t & e | r & (t | e);
}
function Ia(t, e) {
  return (t >>> 28 | e << 4) ^ (e >>> 2 | t << 30) ^ (e >>> 7 | t << 25);
}
function Ta(t, e) {
  return (t >>> 14 | e << 18) ^ (t >>> 18 | e << 14) ^ (e >>> 9 | t << 23);
}
function Ph(t, e) {
  return (t >>> 1 | e << 31) ^ (t >>> 8 | e << 24) ^ t >>> 7;
}
function Hh(t, e) {
  return (t >>> 1 | e << 31) ^ (t >>> 8 | e << 24) ^ (t >>> 7 | e << 25);
}
function qh(t, e) {
  return (t >>> 19 | e << 13) ^ (e >>> 29 | t << 3) ^ t >>> 6;
}
function Dh(t, e) {
  return (t >>> 19 | e << 13) ^ (e >>> 29 | t << 3) ^ (t >>> 6 | e << 26);
}
function be(t, e) {
  return t >>> 0 < e >>> 0 ? 1 : 0;
}
Ur.prototype._update = function(t) {
  for (var e = this._w, r = this._ah | 0, n = this._bh | 0, i = this._ch | 0, a = this._dh | 0, o = this._eh | 0, u = this._fh | 0, s = this._gh | 0, f = this._hh | 0, h = this._al | 0, l = this._bl | 0, c = this._cl | 0, d = this._dl | 0, p = this._el | 0, _ = this._fl | 0, m = this._gl | 0, b = this._hl | 0, w = 0; w < 32; w += 2)
    e[w] = t.readInt32BE(w * 4), e[w + 1] = t.readInt32BE(w * 4 + 4);
  for (; w < 160; w += 2) {
    var S = e[w - 30], A = e[w - 15 * 2 + 1], T = Ph(S, A), U = Hh(A, S);
    S = e[w - 2 * 2], A = e[w - 2 * 2 + 1];
    var G = qh(S, A), H = Dh(A, S), I = e[w - 7 * 2], V = e[w - 7 * 2 + 1], X = e[w - 16 * 2], N = e[w - 16 * 2 + 1], L = U + V | 0, q = T + I + be(L, U) | 0;
    L = L + H | 0, q = q + G + be(L, H) | 0, L = L + N | 0, q = q + X + be(L, N) | 0, e[w] = q, e[w + 1] = L;
  }
  for (var te = 0; te < 160; te += 2) {
    q = e[te], L = e[te + 1];
    var ge = Ma(r, n, i), pe = Ma(h, l, c), Ye = Ia(r, h), He = Ia(h, r), Me = Ta(o, p), ae = Ta(p, o), ft = Aa[te], re = Aa[te + 1], D = ka(o, u, s), J = ka(p, _, m), g = b + ae | 0, x = f + Me + be(g, b) | 0;
    g = g + J | 0, x = x + D + be(g, J) | 0, g = g + re | 0, x = x + ft + be(g, re) | 0, g = g + L | 0, x = x + q + be(g, L) | 0;
    var k = He + pe | 0, F = Ye + ge + be(k, He) | 0;
    f = s, b = m, s = u, m = _, u = o, _ = p, p = d + g | 0, o = a + x + be(p, d) | 0, a = i, d = c, i = n, c = l, n = r, l = h, h = g + k | 0, r = x + F + be(h, g) | 0;
  }
  this._al = this._al + h | 0, this._bl = this._bl + l | 0, this._cl = this._cl + c | 0, this._dl = this._dl + d | 0, this._el = this._el + p | 0, this._fl = this._fl + _ | 0, this._gl = this._gl + m | 0, this._hl = this._hl + b | 0, this._ah = this._ah + r + be(this._al, h) | 0, this._bh = this._bh + n + be(this._bl, l) | 0, this._ch = this._ch + i + be(this._cl, c) | 0, this._dh = this._dh + a + be(this._dl, d) | 0, this._eh = this._eh + o + be(this._el, p) | 0, this._fh = this._fh + u + be(this._fl, _) | 0, this._gh = this._gh + s + be(this._gl, m) | 0, this._hh = this._hh + f + be(this._hl, b) | 0;
};
Ur.prototype._hash = function() {
  var t = Lh.allocUnsafe(64);
  function e(r, n, i) {
    t.writeInt32BE(r, i), t.writeInt32BE(n, i + 4);
  }
  return e(this._ah, this._al, 0), e(this._bh, this._bl, 8), e(this._ch, this._cl, 16), e(this._dh, this._dl, 24), e(this._eh, this._el, 32), e(this._fh, this._fl, 40), e(this._gh, this._gl, 48), e(this._hh, this._hl, 56), t;
};
var hu = Ur, jh = we.exports, Nh = hu, Fh = Vt, $h = Be.exports.Buffer, Uh = new Array(160);
function Hn() {
  this.init(), this._w = Uh, Fh.call(this, 128, 112);
}
jh(Hn, Nh);
Hn.prototype.init = function() {
  return this._ah = 3418070365, this._bh = 1654270250, this._ch = 2438529370, this._dh = 355462360, this._eh = 1731405415, this._fh = 2394180231, this._gh = 3675008525, this._hh = 1203062813, this._al = 3238371032, this._bl = 914150663, this._cl = 812702999, this._dl = 4144912697, this._el = 4290775857, this._fl = 1750603025, this._gl = 1694076839, this._hl = 3204075428, this;
};
Hn.prototype._hash = function() {
  var t = $h.allocUnsafe(48);
  function e(r, n, i) {
    t.writeInt32BE(r, i), t.writeInt32BE(n, i + 4);
  }
  return e(this._ah, this._al, 0), e(this._bh, this._bl, 8), e(this._ch, this._cl, 16), e(this._dh, this._dl, 24), e(this._eh, this._el, 32), e(this._fh, this._fl, 40), t;
};
var Wh = Hn, It = ou.exports = function(e) {
  e = e.toLowerCase();
  var r = It[e];
  if (!r)
    throw new Error(e + " is not supported (we accept pull requests)");
  return new r();
};
It.sha = ah;
It.sha1 = _h;
It.sha224 = Ih;
It.sha256 = lu;
It.sha384 = Wh;
It.sha512 = hu;
function Tt() {
  this.head = null, this.tail = null, this.length = 0;
}
Tt.prototype.push = function(t) {
  var e = { data: t, next: null };
  this.length > 0 ? this.tail.next = e : this.head = e, this.tail = e, ++this.length;
};
Tt.prototype.unshift = function(t) {
  var e = { data: t, next: this.head };
  this.length === 0 && (this.tail = e), this.head = e, ++this.length;
};
Tt.prototype.shift = function() {
  if (this.length !== 0) {
    var t = this.head.data;
    return this.length === 1 ? this.head = this.tail = null : this.head = this.head.next, --this.length, t;
  }
};
Tt.prototype.clear = function() {
  this.head = this.tail = null, this.length = 0;
};
Tt.prototype.join = function(t) {
  if (this.length === 0)
    return "";
  for (var e = this.head, r = "" + e.data; e = e.next; )
    r += t + e.data;
  return r;
};
Tt.prototype.concat = function(t) {
  if (this.length === 0)
    return E.alloc(0);
  if (this.length === 1)
    return this.head.data;
  for (var e = E.allocUnsafe(t >>> 0), r = this.head, n = 0; r; )
    r.data.copy(e, n), n += r.data.length, r = r.next;
  return e;
};
de.ReadableState = du;
var ie = Zi("stream");
vt(de, Ne.exports);
function zh(t, e, r) {
  if (typeof t.prependListener == "function")
    return t.prependListener(e, r);
  !t._events || !t._events[e] ? t.on(e, r) : Array.isArray(t._events[e]) ? t._events[e].unshift(r) : t._events[e] = [r, t._events[e]];
}
function Vh(t, e) {
  return t.listeners(e).length;
}
function du(t, e) {
  t = t || {}, this.objectMode = !!t.objectMode, e instanceof Pe && (this.objectMode = this.objectMode || !!t.readableObjectMode);
  var r = t.highWaterMark, n = this.objectMode ? 16 : 16 * 1024;
  this.highWaterMark = r || r === 0 ? r : n, this.highWaterMark = ~~this.highWaterMark, this.buffer = new Tt(), this.length = 0, this.pipes = null, this.pipesCount = 0, this.flowing = null, this.ended = !1, this.endEmitted = !1, this.reading = !1, this.sync = !0, this.needReadable = !1, this.emittedReadable = !1, this.readableListening = !1, this.resumeScheduled = !1, this.defaultEncoding = t.defaultEncoding || "utf8", this.ranOut = !1, this.awaitDrain = 0, this.readingMore = !1, this.decoder = null, this.encoding = null, t.encoding && (this.decoder = new Zs(t.encoding), this.encoding = t.encoding);
}
function de(t) {
  if (!(this instanceof de))
    return new de(t);
  this._readableState = new du(t, this), this.readable = !0, t && typeof t.read == "function" && (this._read = t.read), Ne.exports.call(this);
}
de.prototype.push = function(t, e) {
  var r = this._readableState;
  return !r.objectMode && typeof t == "string" && (e = e || r.defaultEncoding, e !== r.encoding && (t = E.from(t, e), e = "")), pu(this, r, t, e, !1);
};
de.prototype.unshift = function(t) {
  var e = this._readableState;
  return pu(this, e, t, "", !0);
};
de.prototype.isPaused = function() {
  return this._readableState.flowing === !1;
};
function pu(t, e, r, n, i) {
  var a = Zh(e, r);
  if (a)
    t.emit("error", a);
  else if (r === null)
    e.reading = !1, Kh(t, e);
  else if (e.objectMode || r && r.length > 0)
    if (e.ended && !i) {
      var o = new Error("stream.push() after EOF");
      t.emit("error", o);
    } else if (e.endEmitted && i) {
      var u = new Error("stream.unshift() after end event");
      t.emit("error", u);
    } else {
      var s;
      e.decoder && !i && !n && (r = e.decoder.write(r), s = !e.objectMode && r.length === 0), i || (e.reading = !1), s || (e.flowing && e.length === 0 && !e.sync ? (t.emit("data", r), t.read(0)) : (e.length += e.objectMode ? 1 : r.length, i ? e.buffer.unshift(r) : e.buffer.push(r), e.needReadable && qn(t))), Xh(t, e);
    }
  else
    i || (e.reading = !1);
  return Yh(e);
}
function Yh(t) {
  return !t.ended && (t.needReadable || t.length < t.highWaterMark || t.length === 0);
}
de.prototype.setEncoding = function(t) {
  return this._readableState.decoder = new Zs(t), this._readableState.encoding = t, this;
};
var La = 8388608;
function Gh(t) {
  return t >= La ? t = La : (t--, t |= t >>> 1, t |= t >>> 2, t |= t >>> 4, t |= t >>> 8, t |= t >>> 16, t++), t;
}
function Ba(t, e) {
  return t <= 0 || e.length === 0 && e.ended ? 0 : e.objectMode ? 1 : t !== t ? e.flowing && e.length ? e.buffer.head.data.length : e.length : (t > e.highWaterMark && (e.highWaterMark = Gh(t)), t <= e.length ? t : e.ended ? e.length : (e.needReadable = !0, 0));
}
de.prototype.read = function(t) {
  ie("read", t), t = parseInt(t, 10);
  var e = this._readableState, r = t;
  if (t !== 0 && (e.emittedReadable = !1), t === 0 && e.needReadable && (e.length >= e.highWaterMark || e.ended))
    return ie("read: emitReadable", e.length, e.ended), e.length === 0 && e.ended ? _i(this) : qn(this), null;
  if (t = Ba(t, e), t === 0 && e.ended)
    return e.length === 0 && _i(this), null;
  var n = e.needReadable;
  ie("need readable", n), (e.length === 0 || e.length - t < e.highWaterMark) && (n = !0, ie("length less than watermark", n)), e.ended || e.reading ? (n = !1, ie("reading or ended", n)) : n && (ie("do read"), e.reading = !0, e.sync = !0, e.length === 0 && (e.needReadable = !0), this._read(e.highWaterMark), e.sync = !1, e.reading || (t = Ba(r, e)));
  var i;
  return t > 0 ? i = _u(t, e) : i = null, i === null ? (e.needReadable = !0, t = 0) : e.length -= t, e.length === 0 && (e.ended || (e.needReadable = !0), r !== t && e.ended && _i(this)), i !== null && this.emit("data", i), i;
};
function Zh(t, e) {
  var r = null;
  return !E.isBuffer(e) && typeof e != "string" && e !== null && e !== void 0 && !t.objectMode && (r = new TypeError("Invalid non-string/buffer chunk")), r;
}
function Kh(t, e) {
  if (!e.ended) {
    if (e.decoder) {
      var r = e.decoder.end();
      r && r.length && (e.buffer.push(r), e.length += e.objectMode ? 1 : r.length);
    }
    e.ended = !0, qn(t);
  }
}
function qn(t) {
  var e = t._readableState;
  e.needReadable = !1, e.emittedReadable || (ie("emitReadable", e.flowing), e.emittedReadable = !0, e.sync ? W.exports.nextTick(Pa, t) : Pa(t));
}
function Pa(t) {
  ie("emit readable"), t.emit("readable"), ro(t);
}
function Xh(t, e) {
  e.readingMore || (e.readingMore = !0, W.exports.nextTick(Qh, t, e));
}
function Qh(t, e) {
  for (var r = e.length; !e.reading && !e.flowing && !e.ended && e.length < e.highWaterMark && (ie("maybeReadMore read 0"), t.read(0), r !== e.length); )
    r = e.length;
  e.readingMore = !1;
}
de.prototype._read = function(t) {
  this.emit("error", new Error("not implemented"));
};
de.prototype.pipe = function(t, e) {
  var r = this, n = this._readableState;
  switch (n.pipesCount) {
    case 0:
      n.pipes = t;
      break;
    case 1:
      n.pipes = [n.pipes, t];
      break;
    default:
      n.pipes.push(t);
      break;
  }
  n.pipesCount += 1, ie("pipe count=%d opts=%j", n.pipesCount, e);
  var i = !e || e.end !== !1, a = i ? u : h;
  n.endEmitted ? W.exports.nextTick(a) : r.once("end", a), t.on("unpipe", o);
  function o(b) {
    ie("onunpipe"), b === r && h();
  }
  function u() {
    ie("onend"), t.end();
  }
  var s = Jh(r);
  t.on("drain", s);
  var f = !1;
  function h() {
    ie("cleanup"), t.removeListener("close", p), t.removeListener("finish", _), t.removeListener("drain", s), t.removeListener("error", d), t.removeListener("unpipe", o), r.removeListener("end", u), r.removeListener("end", h), r.removeListener("data", c), f = !0, n.awaitDrain && (!t._writableState || t._writableState.needDrain) && s();
  }
  var l = !1;
  r.on("data", c);
  function c(b) {
    ie("ondata"), l = !1;
    var w = t.write(b);
    w === !1 && !l && ((n.pipesCount === 1 && n.pipes === t || n.pipesCount > 1 && vu(n.pipes, t) !== -1) && !f && (ie("false write response, pause", r._readableState.awaitDrain), r._readableState.awaitDrain++, l = !0), r.pause());
  }
  function d(b) {
    ie("onerror", b), m(), t.removeListener("error", d), Vh(t, "error") === 0 && t.emit("error", b);
  }
  zh(t, "error", d);
  function p() {
    t.removeListener("finish", _), m();
  }
  t.once("close", p);
  function _() {
    ie("onfinish"), t.removeListener("close", p), m();
  }
  t.once("finish", _);
  function m() {
    ie("unpipe"), r.unpipe(t);
  }
  return t.emit("pipe", r), n.flowing || (ie("pipe resume"), r.resume()), t;
};
function Jh(t) {
  return function() {
    var e = t._readableState;
    ie("pipeOnDrain", e.awaitDrain), e.awaitDrain && e.awaitDrain--, e.awaitDrain === 0 && t.listeners("data").length && (e.flowing = !0, ro(t));
  };
}
de.prototype.unpipe = function(t) {
  var e = this._readableState;
  if (e.pipesCount === 0)
    return this;
  if (e.pipesCount === 1)
    return t && t !== e.pipes ? this : (t || (t = e.pipes), e.pipes = null, e.pipesCount = 0, e.flowing = !1, t && t.emit("unpipe", this), this);
  if (!t) {
    var r = e.pipes, n = e.pipesCount;
    e.pipes = null, e.pipesCount = 0, e.flowing = !1;
    for (var i = 0; i < n; i++)
      r[i].emit("unpipe", this);
    return this;
  }
  var a = vu(e.pipes, t);
  return a === -1 ? this : (e.pipes.splice(a, 1), e.pipesCount -= 1, e.pipesCount === 1 && (e.pipes = e.pipes[0]), t.emit("unpipe", this), this);
};
de.prototype.on = function(t, e) {
  var r = Ne.exports.prototype.on.call(this, t, e);
  if (t === "data")
    this._readableState.flowing !== !1 && this.resume();
  else if (t === "readable") {
    var n = this._readableState;
    !n.endEmitted && !n.readableListening && (n.readableListening = n.needReadable = !0, n.emittedReadable = !1, n.reading ? n.length && qn(this) : W.exports.nextTick(ed, this));
  }
  return r;
};
de.prototype.addListener = de.prototype.on;
function ed(t) {
  ie("readable nexttick read 0"), t.read(0);
}
de.prototype.resume = function() {
  var t = this._readableState;
  return t.flowing || (ie("resume"), t.flowing = !0, td(this, t)), this;
};
function td(t, e) {
  e.resumeScheduled || (e.resumeScheduled = !0, W.exports.nextTick(rd, t, e));
}
function rd(t, e) {
  e.reading || (ie("resume read 0"), t.read(0)), e.resumeScheduled = !1, e.awaitDrain = 0, t.emit("resume"), ro(t), e.flowing && !e.reading && t.read(0);
}
de.prototype.pause = function() {
  return ie("call pause flowing=%j", this._readableState.flowing), this._readableState.flowing !== !1 && (ie("pause"), this._readableState.flowing = !1, this.emit("pause")), this;
};
function ro(t) {
  var e = t._readableState;
  for (ie("flow", e.flowing); e.flowing && t.read() !== null; )
    ;
}
de.prototype.wrap = function(t) {
  var e = this._readableState, r = !1, n = this;
  t.on("end", function() {
    if (ie("wrapped end"), e.decoder && !e.ended) {
      var o = e.decoder.end();
      o && o.length && n.push(o);
    }
    n.push(null);
  }), t.on("data", function(o) {
    if (ie("wrapped data"), e.decoder && (o = e.decoder.write(o)), !(e.objectMode && o == null) && !(!e.objectMode && (!o || !o.length))) {
      var u = n.push(o);
      u || (r = !0, t.pause());
    }
  });
  for (var i in t)
    this[i] === void 0 && typeof t[i] == "function" && (this[i] = function(o) {
      return function() {
        return t[o].apply(t, arguments);
      };
    }(i));
  var a = ["error", "close", "destroy", "pause", "resume"];
  return sd(a, function(o) {
    t.on(o, n.emit.bind(n, o));
  }), n._read = function(o) {
    ie("wrapped _read", o), r && (r = !1, t.resume());
  }, n;
};
de._fromList = _u;
function _u(t, e) {
  if (e.length === 0)
    return null;
  var r;
  return e.objectMode ? r = e.buffer.shift() : !t || t >= e.length ? (e.decoder ? r = e.buffer.join("") : e.buffer.length === 1 ? r = e.buffer.head.data : r = e.buffer.concat(e.length), e.buffer.clear()) : r = nd(t, e.buffer, e.decoder), r;
}
function nd(t, e, r) {
  var n;
  return t < e.head.data.length ? (n = e.head.data.slice(0, t), e.head.data = e.head.data.slice(t)) : t === e.head.data.length ? n = e.shift() : n = r ? id(t, e) : od(t, e), n;
}
function id(t, e) {
  var r = e.head, n = 1, i = r.data;
  for (t -= i.length; r = r.next; ) {
    var a = r.data, o = t > a.length ? a.length : t;
    if (o === a.length ? i += a : i += a.slice(0, t), t -= o, t === 0) {
      o === a.length ? (++n, r.next ? e.head = r.next : e.head = e.tail = null) : (e.head = r, r.data = a.slice(o));
      break;
    }
    ++n;
  }
  return e.length -= n, i;
}
function od(t, e) {
  var r = E.allocUnsafe(t), n = e.head, i = 1;
  for (n.data.copy(r), t -= n.data.length; n = n.next; ) {
    var a = n.data, o = t > a.length ? a.length : t;
    if (a.copy(r, r.length - t, 0, o), t -= o, t === 0) {
      o === a.length ? (++i, n.next ? e.head = n.next : e.head = e.tail = null) : (e.head = n, n.data = a.slice(o));
      break;
    }
    ++i;
  }
  return e.length -= i, r;
}
function _i(t) {
  var e = t._readableState;
  if (e.length > 0)
    throw new Error('"endReadable()" called on non-empty stream');
  e.endEmitted || (e.ended = !0, W.exports.nextTick(ad, e, t));
}
function ad(t, e) {
  !t.endEmitted && t.length === 0 && (t.endEmitted = !0, e.readable = !1, e.emit("end"));
}
function sd(t, e) {
  for (var r = 0, n = t.length; r < n; r++)
    e(t[r], r);
}
function vu(t, e) {
  for (var r = 0, n = t.length; r < n; r++)
    if (t[r] === e)
      return r;
  return -1;
}
xe.WritableState = no;
vt(xe, Ne.exports.EventEmitter);
function ud() {
}
function fd(t, e, r) {
  this.chunk = t, this.encoding = e, this.callback = r, this.next = null;
}
function no(t, e) {
  Object.defineProperty(this, "buffer", {
    get: On(function() {
      return this.getBuffer();
    }, "_writableState.buffer is deprecated. Use _writableState.getBuffer instead.")
  }), t = t || {}, this.objectMode = !!t.objectMode, e instanceof Pe && (this.objectMode = this.objectMode || !!t.writableObjectMode);
  var r = t.highWaterMark, n = this.objectMode ? 16 : 16 * 1024;
  this.highWaterMark = r || r === 0 ? r : n, this.highWaterMark = ~~this.highWaterMark, this.needDrain = !1, this.ending = !1, this.ended = !1, this.finished = !1;
  var i = t.decodeStrings === !1;
  this.decodeStrings = !i, this.defaultEncoding = t.defaultEncoding || "utf8", this.length = 0, this.writing = !1, this.corked = 0, this.sync = !0, this.bufferProcessing = !1, this.onwrite = function(a) {
    vd(e, a);
  }, this.writecb = null, this.writelen = 0, this.bufferedRequest = null, this.lastBufferedRequest = null, this.pendingcb = 0, this.prefinished = !1, this.errorEmitted = !1, this.bufferedRequestCount = 0, this.corkedRequestsFree = new wu(this);
}
no.prototype.getBuffer = function() {
  for (var e = this.bufferedRequest, r = []; e; )
    r.push(e), e = e.next;
  return r;
};
function xe(t) {
  if (!(this instanceof xe) && !(this instanceof Pe))
    return new xe(t);
  this._writableState = new no(t, this), this.writable = !0, t && (typeof t.write == "function" && (this._write = t.write), typeof t.writev == "function" && (this._writev = t.writev)), Ne.exports.EventEmitter.call(this);
}
xe.prototype.pipe = function() {
  this.emit("error", new Error("Cannot pipe, not readable"));
};
function ld(t, e) {
  var r = new Error("write after end");
  t.emit("error", r), W.exports.nextTick(e, r);
}
function cd(t, e, r, n) {
  var i = !0, a = !1;
  return r === null ? a = new TypeError("May not write null values to stream") : !E.isBuffer(r) && typeof r != "string" && r !== void 0 && !e.objectMode && (a = new TypeError("Invalid non-string/buffer chunk")), a && (t.emit("error", a), W.exports.nextTick(n, a), i = !1), i;
}
xe.prototype.write = function(t, e, r) {
  var n = this._writableState, i = !1;
  return typeof e == "function" && (r = e, e = null), E.isBuffer(t) ? e = "buffer" : e || (e = n.defaultEncoding), typeof r != "function" && (r = ud), n.ended ? ld(this, r) : cd(this, n, t, r) && (n.pendingcb++, i = dd(this, n, t, e, r)), i;
};
xe.prototype.cork = function() {
  var t = this._writableState;
  t.corked++;
};
xe.prototype.uncork = function() {
  var t = this._writableState;
  t.corked && (t.corked--, !t.writing && !t.corked && !t.finished && !t.bufferProcessing && t.bufferedRequest && yu(this, t));
};
xe.prototype.setDefaultEncoding = function(e) {
  if (typeof e == "string" && (e = e.toLowerCase()), !(["hex", "utf8", "utf-8", "ascii", "binary", "base64", "ucs2", "ucs-2", "utf16le", "utf-16le", "raw"].indexOf((e + "").toLowerCase()) > -1))
    throw new TypeError("Unknown encoding: " + e);
  return this._writableState.defaultEncoding = e, this;
};
function hd(t, e, r) {
  return !t.objectMode && t.decodeStrings !== !1 && typeof e == "string" && (e = E.from(e, r)), e;
}
function dd(t, e, r, n, i) {
  r = hd(e, r, n), E.isBuffer(r) && (n = "buffer");
  var a = e.objectMode ? 1 : r.length;
  e.length += a;
  var o = e.length < e.highWaterMark;
  if (o || (e.needDrain = !0), e.writing || e.corked) {
    var u = e.lastBufferedRequest;
    e.lastBufferedRequest = new fd(r, n, i), u ? u.next = e.lastBufferedRequest : e.bufferedRequest = e.lastBufferedRequest, e.bufferedRequestCount += 1;
  } else
    Mi(t, e, !1, a, r, n, i);
  return o;
}
function Mi(t, e, r, n, i, a, o) {
  e.writelen = n, e.writecb = o, e.writing = !0, e.sync = !0, r ? t._writev(i, e.onwrite) : t._write(i, a, e.onwrite), e.sync = !1;
}
function pd(t, e, r, n, i) {
  --e.pendingcb, r ? W.exports.nextTick(i, n) : i(n), t._writableState.errorEmitted = !0, t.emit("error", n);
}
function _d(t) {
  t.writing = !1, t.writecb = null, t.length -= t.writelen, t.writelen = 0;
}
function vd(t, e) {
  var r = t._writableState, n = r.sync, i = r.writecb;
  if (_d(r), e)
    pd(t, r, n, e, i);
  else {
    var a = gu(r);
    !a && !r.corked && !r.bufferProcessing && r.bufferedRequest && yu(t, r), n ? W.exports.nextTick(Ha, t, r, a, i) : Ha(t, r, a, i);
  }
}
function Ha(t, e, r, n) {
  r || yd(t, e), e.pendingcb--, n(), bu(t, e);
}
function yd(t, e) {
  e.length === 0 && e.needDrain && (e.needDrain = !1, t.emit("drain"));
}
function yu(t, e) {
  e.bufferProcessing = !0;
  var r = e.bufferedRequest;
  if (t._writev && r && r.next) {
    var n = e.bufferedRequestCount, i = new Array(n), a = e.corkedRequestsFree;
    a.entry = r;
    for (var o = 0; r; )
      i[o] = r, r = r.next, o += 1;
    Mi(t, e, !0, e.length, i, "", a.finish), e.pendingcb++, e.lastBufferedRequest = null, a.next ? (e.corkedRequestsFree = a.next, a.next = null) : e.corkedRequestsFree = new wu(e);
  } else {
    for (; r; ) {
      var u = r.chunk, s = r.encoding, f = r.callback, h = e.objectMode ? 1 : u.length;
      if (Mi(t, e, !1, h, u, s, f), r = r.next, e.writing)
        break;
    }
    r === null && (e.lastBufferedRequest = null);
  }
  e.bufferedRequestCount = 0, e.bufferedRequest = r, e.bufferProcessing = !1;
}
xe.prototype._write = function(t, e, r) {
  r(new Error("not implemented"));
};
xe.prototype._writev = null;
xe.prototype.end = function(t, e, r) {
  var n = this._writableState;
  typeof t == "function" ? (r = t, t = null, e = null) : typeof e == "function" && (r = e, e = null), t != null && this.write(t, e), n.corked && (n.corked = 1, this.uncork()), !n.ending && !n.finished && gd(this, n, r);
};
function gu(t) {
  return t.ending && t.length === 0 && t.bufferedRequest === null && !t.finished && !t.writing;
}
function qa(t, e) {
  e.prefinished || (e.prefinished = !0, t.emit("prefinish"));
}
function bu(t, e) {
  var r = gu(e);
  return r && (e.pendingcb === 0 ? (qa(t, e), e.finished = !0, t.emit("finish")) : qa(t, e)), r;
}
function gd(t, e, r) {
  e.ending = !0, bu(t, e), r && (e.finished ? W.exports.nextTick(r) : t.once("finish", r)), e.ended = !0, t.writable = !1;
}
function wu(t) {
  var e = this;
  this.next = null, this.entry = null, this.finish = function(r) {
    var n = e.entry;
    for (e.entry = null; n; ) {
      var i = n.callback;
      t.pendingcb--, i(r), n = n.next;
    }
    t.corkedRequestsFree ? t.corkedRequestsFree.next = e : t.corkedRequestsFree = e;
  };
}
vt(Pe, de);
var Da = Object.keys(xe.prototype);
for (var vi = 0; vi < Da.length; vi++) {
  var yi = Da[vi];
  Pe.prototype[yi] || (Pe.prototype[yi] = xe.prototype[yi]);
}
function Pe(t) {
  if (!(this instanceof Pe))
    return new Pe(t);
  de.call(this, t), xe.call(this, t), t && t.readable === !1 && (this.readable = !1), t && t.writable === !1 && (this.writable = !1), this.allowHalfOpen = !0, t && t.allowHalfOpen === !1 && (this.allowHalfOpen = !1), this.once("end", bd);
}
function bd() {
  this.allowHalfOpen || this._writableState.ended || W.exports.nextTick(wd, this);
}
function wd(t) {
  t.end();
}
vt(Ue, Pe);
function md(t) {
  this.afterTransform = function(e, r) {
    return xd(t, e, r);
  }, this.needTransform = !1, this.transforming = !1, this.writecb = null, this.writechunk = null, this.writeencoding = null;
}
function xd(t, e, r) {
  var n = t._transformState;
  n.transforming = !1;
  var i = n.writecb;
  if (!i)
    return t.emit("error", new Error("no writecb in Transform class"));
  n.writechunk = null, n.writecb = null, r != null && t.push(r), i(e);
  var a = t._readableState;
  a.reading = !1, (a.needReadable || a.length < a.highWaterMark) && t._read(a.highWaterMark);
}
function Ue(t) {
  if (!(this instanceof Ue))
    return new Ue(t);
  Pe.call(this, t), this._transformState = new md(this);
  var e = this;
  this._readableState.needReadable = !0, this._readableState.sync = !1, t && (typeof t.transform == "function" && (this._transform = t.transform), typeof t.flush == "function" && (this._flush = t.flush)), this.once("prefinish", function() {
    typeof this._flush == "function" ? this._flush(function(r) {
      ja(e, r);
    }) : ja(e);
  });
}
Ue.prototype.push = function(t, e) {
  return this._transformState.needTransform = !1, Pe.prototype.push.call(this, t, e);
};
Ue.prototype._transform = function(t, e, r) {
  throw new Error("Not implemented");
};
Ue.prototype._write = function(t, e, r) {
  var n = this._transformState;
  if (n.writecb = r, n.writechunk = t, n.writeencoding = e, !n.transforming) {
    var i = this._readableState;
    (n.needTransform || i.needReadable || i.length < i.highWaterMark) && this._read(i.highWaterMark);
  }
};
Ue.prototype._read = function(t) {
  var e = this._transformState;
  e.writechunk !== null && e.writecb && !e.transforming ? (e.transforming = !0, this._transform(e.writechunk, e.writeencoding, e.afterTransform)) : e.needTransform = !0;
};
function ja(t, e) {
  if (e)
    return t.emit("error", e);
  var r = t._writableState, n = t._transformState;
  if (r.length)
    throw new Error("Calling transform done when ws.length != 0");
  if (n.transforming)
    throw new Error("Calling transform done when still transforming");
  return t.push(null);
}
vt(zt, Ue);
function zt(t) {
  if (!(this instanceof zt))
    return new zt(t);
  Ue.call(this, t);
}
zt.prototype._transform = function(t, e, r) {
  r(null, t);
};
vt(We, Ne.exports);
We.Readable = de;
We.Writable = xe;
We.Duplex = Pe;
We.Transform = Ue;
We.PassThrough = zt;
We.Stream = We;
function We() {
  Ne.exports.call(this);
}
We.prototype.pipe = function(t, e) {
  var r = this;
  function n(h) {
    t.writable && t.write(h) === !1 && r.pause && r.pause();
  }
  r.on("data", n);
  function i() {
    r.readable && r.resume && r.resume();
  }
  t.on("drain", i), !t._isStdio && (!e || e.end !== !1) && (r.on("end", o), r.on("close", u));
  var a = !1;
  function o() {
    a || (a = !0, t.end());
  }
  function u() {
    a || (a = !0, typeof t.destroy == "function" && t.destroy());
  }
  function s(h) {
    if (f(), Ne.exports.listenerCount(this, "error") === 0)
      throw h;
  }
  r.on("error", s), t.on("error", s);
  function f() {
    r.removeListener("data", n), t.removeListener("drain", i), r.removeListener("end", o), r.removeListener("close", u), r.removeListener("error", s), t.removeListener("error", s), r.removeListener("end", f), r.removeListener("close", f), t.removeListener("close", f);
  }
  return r.on("end", f), r.on("close", f), t.on("close", f), t.emit("pipe", r), t;
};
const Ed = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: We,
  Readable: de,
  Writable: xe,
  Duplex: Pe,
  Transform: Ue,
  PassThrough: zt,
  Stream: We
}, Symbol.toStringTag, { value: "Module" })), Sd = /* @__PURE__ */ Ui(Ed);
var mu = Be.exports.Buffer, xu = Sd.Transform, Rd = vn.StringDecoder, Cd = we.exports;
function Ve(t) {
  xu.call(this), this.hashMode = typeof t == "string", this.hashMode ? this[t] = this._finalOrDigest : this.final = this._finalOrDigest, this._final && (this.__final = this._final, this._final = null), this._decoder = null, this._encoding = null;
}
Cd(Ve, xu);
Ve.prototype.update = function(t, e, r) {
  typeof t == "string" && (t = mu.from(t, e));
  var n = this._update(t);
  return this.hashMode ? this : (r && (n = this._toString(n, r)), n);
};
Ve.prototype.setAutoPadding = function() {
};
Ve.prototype.getAuthTag = function() {
  throw new Error("trying to get auth tag in unsupported state");
};
Ve.prototype.setAuthTag = function() {
  throw new Error("trying to set auth tag in unsupported state");
};
Ve.prototype.setAAD = function() {
  throw new Error("trying to set aad in unsupported state");
};
Ve.prototype._transform = function(t, e, r) {
  var n;
  try {
    this.hashMode ? this._update(t) : this.push(this._update(t));
  } catch (i) {
    n = i;
  } finally {
    r(n);
  }
};
Ve.prototype._flush = function(t) {
  var e;
  try {
    this.push(this.__final());
  } catch (r) {
    e = r;
  }
  t(e);
};
Ve.prototype._finalOrDigest = function(t) {
  var e = this.__final() || mu.alloc(0);
  return t && (e = this._toString(e, t, !0)), e;
};
Ve.prototype._toString = function(t, e, r) {
  if (this._decoder || (this._decoder = new Rd(e), this._encoding = e), this._encoding !== e)
    throw new Error("can't switch encodings");
  var n = this._decoder.write(t);
  return r && (n += this._decoder.end()), n;
};
var Od = Ve, Ad = we.exports, kd = Zc, Md = Qc, Id = ou.exports, Eu = Od;
function Dn(t) {
  Eu.call(this, "digest"), this._hash = t;
}
Ad(Dn, Eu);
Dn.prototype._update = function(t) {
  this._hash.update(t);
};
Dn.prototype._final = function() {
  return this._hash.digest();
};
var Td = function(e) {
  return e = e.toLowerCase(), e === "md5" ? new kd() : e === "rmd160" || e === "ripemd160" ? new Md() : new Dn(Id(e));
};
function Ld(t) {
  return JSON.stringify([
    0,
    t.pubkey,
    t.created_at,
    t.kind,
    t.tags,
    t.content
  ]);
}
function io(t) {
  let e = Td("sha256").update(E.from(Ld(t))).digest();
  return E.from(e).toString("hex");
}
function Bd(t) {
  if (t.id !== io(t) || typeof t.content != "string" || typeof t.created_at != "number" || !Array.isArray(t.tags))
    return !1;
  for (let e = 0; e < t.tags.length; e++) {
    let r = t.tags[e];
    if (!Array.isArray(r))
      return !1;
    for (let n = 0; n < r.length; n++)
      if (typeof r[n] == "object")
        return !1;
  }
  return !0;
}
function Su(t) {
  return ji.verify(t.sig, t.id, t.pubkey);
}
async function Pd(t, e) {
  return E.from(
    await ji.sign(io(t), e)
  ).toString("hex");
}
function Hd(t, e) {
  if (t.ids && t.ids.indexOf(e.id) === -1 || t.kinds && t.kinds.indexOf(e.kind) === -1 || t.authors && t.authors.indexOf(e.pubkey) === -1)
    return !1;
  for (let r in t)
    if (r[0] === "#" && t[r] && !e.tags.find(
      ([n, i]) => n === r.slice(1) && t[r].indexOf(i) !== -1
    ))
      return !1;
  return !(t.since && e.created_at < t.since || t.until && e.created_at >= t.until);
}
function qd(t, e) {
  for (let r = 0; r < t.length; r++)
    if (Hd(t[r], e))
      return !0;
  return !1;
}
function Ii(t) {
  let [e, ...r] = t.trim().split("?");
  return e.slice(0, 4) === "http" && (e = "ws" + e.slice(4)), e.slice(0, 2) !== "ws" && (e = "wss://" + e), e.length && e[e.length - 1] === "/" && (e = e.slice(0, -1)), [e, ...r].join("?");
}
function Dd(t, e = () => {
}, r = () => {
}) {
  t = Ii(t);
  var n, i, a, o, u = {}, s = {};
  let f = 1, h = 1;
  function l() {
    a = new Promise((b) => {
      i = b;
    });
  }
  var c = {}, d = {};
  function p() {
    n = new WebSocket(t), n.onopen = () => {
      if (console.log("connected to", t), i(), o) {
        o = !1;
        for (let b in u) {
          let w = u[b], S = c[b], A = d[b];
          m({ eventCb: S, filter: w }, b, A);
        }
      }
    }, n.onerror = (b) => {
      console.log("error connecting to relay", t), r(b);
    }, n.onclose = () => {
      l(), f++, h += f ** 3, h > 14400 && (h = 14400), console.log(
        `relay ${t} connection closed. reconnecting in ${h} seconds.`
      ), setTimeout(async () => {
        try {
          p();
        } catch (b) {
        }
      }, h * 1e3), o = !0;
    }, n.onmessage = async (b) => {
      var w;
      try {
        w = JSON.parse(b.data);
      } catch (S) {
        w = b.data;
      }
      if (w.length >= 1)
        switch (w[0]) {
          case "NOTICE":
            if (w.length != 2)
              return;
            console.log(`message from relay ${t}: ${w[1]}`), e(w[1]);
            return;
          case "EOSE":
            if (w.length != 2)
              return;
            console.log(`Channel ${w[1]}: End-of-stored-events`), d[w[1]] && d[w[1]]();
            return;
          case "EVENT":
            if (w.length != 3)
              return;
            let S = w[1], A = w[2];
            Bd(A) && (s[S] || Su(A)) && c[S] && qd(u[S], A) && c[S](A);
            return;
        }
    };
  }
  l();
  try {
    p();
  } catch (b) {
  }
  async function _(b) {
    let w = JSON.stringify(b);
    await a, n.send(w);
  }
  const m = ({ cb: b, filter: w, beforeSend: S, skipVerification: A }, T = Math.random().toString().slice(2), U) => {
    var G = [];
    Array.isArray(w) ? G = w : G.push(w), S && (G = S({ filter: w, relay: t, channel: T }).filter), _(["REQ", T, ...G]), c[T] = b, d[T] = U, u[T] = G, s[T] = A;
    const H = b, I = G, V = S;
    return {
      sub: ({
        cb: X = H,
        filter: N = I,
        beforeSend: L = V
      }) => m({ cb: X, filter: N, beforeSend: L, skipVerification: A }, T),
      unsub: () => {
        delete u[T], delete c[T], delete d[T], delete s[T], _(["CLOSE", T]);
      }
    };
  };
  return {
    url: t,
    sub: m,
    async publish(b, w) {
      try {
        if (await _(["EVENT", b]), w) {
          w(0);
          let { unsub: S } = m(
            {
              cb: () => {
                w(1), S(), clearTimeout(A);
              },
              filter: { ids: [b.id] }
            },
            `monitor-${b.id.slice(0, 5)}`
          ), A = setTimeout(S, 5e3);
        }
      } catch (S) {
        w && w(-1);
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
function jd() {
  var t, e;
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
    sub: ({ cb: s, filter: f, beforeSend: h }, l, c) => {
      l || (l = Math.random().toString().slice(2));
      const d = Object.fromEntries(
        Object.values(n).filter(({ policy: T }) => T.read).map(({ relay: T }) => [
          T.url,
          T.sub(
            { cb: (U) => s(U, T.url), filter: f, beforeSend: h },
            l,
            c
          )
        ])
      ), p = s, _ = f, m = h, b = () => {
        Object.values(d).forEach((T) => T.unsub()), delete o[l];
      }, w = ({
        cb: T = p,
        filter: U = _,
        beforeSend: G = m
      }) => (Object.entries(d).map(([H, I]) => [
        H,
        I.sub({ cb: (V) => T(V, H), filter: U, beforeSend: G }, l)
      ]), o[l]), S = (T) => (d[T.url] = T.sub(
        { cb: (U) => s(U, T.url), filter: f, beforeSend: h },
        l,
        () => c(T.url)
      ), o[l]), A = (T) => (T in d && (d[T].unsub(), Object.keys(d).length === 0 && b()), o[l]);
      return o[l] = {
        sub: w,
        unsub: b,
        addRelay: S,
        removeRelay: A
      }, o[l];
    },
    relays: n,
    setPrivateKey(s) {
      t = s;
    },
    registerSigningFunction(s) {
      e = s;
    },
    setPolicy(s, f) {
      r[s] = f;
    },
    addRelay(s, f = { read: !0, write: !0 }) {
      let h = Ii(s);
      if (h in n)
        return;
      let l = Dd(s, (c) => {
        a(c, h);
      });
      return n[h] = { relay: l, policy: f }, f.read && Object.values(o).forEach(
        (c) => c.addRelay(l)
      ), l;
    },
    removeRelay(s) {
      let f = Ii(s), h = n[f];
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
      if (s.id = io(s), !s.sig)
        if (s.tags = s.tags || [], t)
          s.sig = await Pd(s, t);
        else if (e)
          if (s.sig = await e(s), s.sig) {
            if (!await Su(s))
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
            if (await new Promise(async (_, m) => {
              try {
                await p.publish(s, (b) => {
                  f && f(b, p.url), _();
                });
              } catch (b) {
                f && f(-1, p.url);
              }
            }), c++, c >= l)
              break;
          } catch (_) {
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
function Nd(t) {
  let e, r, n, i, a, o, u, s, f, h;
  return {
    c() {
      e = j("h3"), e.textContent = "Register", r = Y(), n = j("form"), i = j("p"), i.textContent = `We use Nostr to store opinions. You can post and access your posts via a unique private key.
		Copy your key and keep it in a safe place.`, a = Y(), o = j("input"), u = Y(), s = j("button"), s.textContent = "Continue", this.c = K, C(o, "id", "privkey"), C(o, "type", "text");
    },
    m(l, c) {
      $(l, e, c), $(l, r, c), $(l, n, c), M(n, i), M(n, a), M(n, o), Ft(o, t[0]), M(n, u), M(n, s), f || (h = [
        Oe(o, "input", t[3]),
        Oe(s, "click", t[1]),
        Oe(n, "submit", Pi(t[2]))
      ], f = !0);
    },
    p(l, [c]) {
      c & 1 && o.value !== l[0] && Ft(o, l[0]);
    },
    i: K,
    o: K,
    d(l) {
      l && z(e), l && z(r), l && z(n), f = !1, ze(h);
    }
  };
}
function Fd(t, e, r) {
  let n;
  Li(t, tt, (s) => r(4, n = s));
  let i = "";
  const a = () => {
    !i || bi(tt, n = { privkey: i, pubkey: ys(i) }, n);
  };
  Va(() => {
    r(0, i = jf());
  });
  function o(s) {
    Ya.call(this, t, s);
  }
  function u() {
    i = this.value, r(0, i);
  }
  return [i, a, o, u];
}
class Ru extends _t {
  constructor(e) {
    super(), At(
      this,
      {
        target: this.shadowRoot,
        props: Ot(this.attributes),
        customElement: !0
      },
      Fd,
      Nd,
      pt,
      {},
      null
    ), e && e.target && $(e.target, this, e.anchor);
  }
}
customElements.define("nostr-opinion-register", Ru);
function $d(t) {
  let e, r, n;
  return {
    c() {
      e = j("button"), e.textContent = "Log in with browser extension";
    },
    m(i, a) {
      $(i, e, a), r || (n = Oe(e, "click", t[2]), r = !0);
    },
    p: K,
    d(i) {
      i && z(e), r = !1, n();
    }
  };
}
function Ud(t) {
  let e, r, n, i, a, o, u, s, f, h, l, c = window.nostr && $d(t);
  return {
    c() {
      e = j("h3"), e.textContent = "Log in", r = Y(), n = j("form"), i = j("p"), i.textContent = "Enter your Nostr private key below to be able to post an opinion. Don't have a key? Register.", a = Y(), o = j("input"), u = Y(), s = j("button"), s.textContent = "Login", f = Y(), c && c.c(), this.c = K, C(o, "id", "privkey"), C(o, "type", "text");
    },
    m(d, p) {
      $(d, e, p), $(d, r, p), $(d, n, p), M(n, i), M(n, a), M(n, o), Ft(o, t[0]), M(n, u), M(n, s), M(n, f), c && c.m(n, null), h || (l = [
        Oe(o, "input", t[4]),
        Oe(s, "click", t[1]),
        Oe(n, "submit", Pi(t[3]))
      ], h = !0);
    },
    p(d, [p]) {
      p & 1 && o.value !== d[0] && Ft(o, d[0]), window.nostr && c.p(d, p);
    },
    i: K,
    o: K,
    d(d) {
      d && z(e), d && z(r), d && z(n), c && c.d(), h = !1, ze(l);
    }
  };
}
function Wd(t, e, r) {
  let n;
  Li(t, tt, (f) => r(5, n = f));
  let i = "";
  const a = () => {
    !i || bi(tt, n = { privkey: i, pubkey: ys(i) }, n);
  }, o = async () => {
    if (!window.nostr)
      return;
    const f = await window.nostr.getPublicKey();
    !f || bi(tt, n = { pubkey: f }, n);
  };
  function u(f) {
    Ya.call(this, t, f);
  }
  function s() {
    i = this.value, r(0, i);
  }
  return [i, a, o, u, s];
}
class Cu extends _t {
  constructor(e) {
    super(), At(
      this,
      {
        target: this.shadowRoot,
        props: Ot(this.attributes),
        customElement: !0
      },
      Wd,
      Ud,
      pt,
      {},
      null
    ), e && e.target && $(e.target, this, e.anchor);
  }
}
customElements.define("nostr-opinion-login", Cu);
function Na(t, e, r) {
  const n = t.slice();
  return n[22] = e[r], n;
}
function zd(t) {
  let e, r, n, i, a, o = t[7][1] + "", u, s, f, h, l, c, d = t[7][0] + "", p, _, m, b, w, S, A = t[7][-1] + "", T, U, G, H, I, V, X, N, L, q, te, ge, pe, Ye, He;
  i = new Hi({}), l = new qi({}), w = new Di({});
  let Me = t[3], ae = [];
  for (let D = 0; D < Me.length; D += 1)
    ae[D] = Ua(Na(t, Me, D));
  const ft = (D) => he(ae[D], 1, 1, () => {
    ae[D] = null;
  });
  let re = t[9] && Wa(t);
  return {
    c() {
      e = j("nav"), r = j("div"), n = j("span"), at(i.$$.fragment), a = Y(), u = ve(o), s = ve(" positive"), f = Y(), h = j("span"), at(l.$$.fragment), c = Y(), p = ve(d), _ = ve(" neutral"), m = Y(), b = j("span"), at(w.$$.fragment), S = Y(), T = ve(A), U = ve(" negative"), G = Y(), H = j("div"), I = j("button"), I.textContent = "Approved", V = Y(), X = j("button"), X.textContent = "All opinions", N = Y();
      for (let D = 0; D < ae.length; D += 1)
        ae[D].c();
      L = Y(), q = j("button"), q.textContent = "Add your opinion", te = Y(), re && re.c(), ge = Bi(), C(n, "class", "nav-count"), C(h, "class", "nav-count"), C(b, "class", "nav-count"), C(r, "class", "count-container"), C(I, "class", "blank-btn filter-btn"), C(I, "aria-label", "filter by approved"), zr(I, "filter-active", t[8] === "approved"), C(X, "class", "blank-btn filter-btn"), C(X, "aria-label", "filter by all"), zr(X, "filter-active", t[8] === "all"), C(H, "class", "filter-container"), C(e, "class", "top-nav"), C(q, "class", "primary-btn");
    },
    m(D, J) {
      $(D, e, J), M(e, r), M(r, n), Je(i, n, null), M(n, a), M(n, u), M(n, s), M(r, f), M(r, h), Je(l, h, null), M(h, c), M(h, p), M(h, _), M(r, m), M(r, b), Je(w, b, null), M(b, S), M(b, T), M(b, U), M(e, G), M(e, H), M(H, I), M(H, V), M(H, X), $(D, N, J);
      for (let g = 0; g < ae.length; g += 1)
        ae[g].m(D, J);
      $(D, L, J), $(D, q, J), $(D, te, J), re && re.m(D, J), $(D, ge, J), pe = !0, Ye || (He = [
        Oe(I, "click", t[15]),
        Oe(X, "click", t[16]),
        Oe(q, "click", t[17])
      ], Ye = !0);
    },
    p(D, J) {
      if ((!pe || J & 128) && o !== (o = D[7][1] + "") && Qe(u, o), (!pe || J & 128) && d !== (d = D[7][0] + "") && Qe(p, d), (!pe || J & 128) && A !== (A = D[7][-1] + "") && Qe(T, A), (!pe || J & 256) && zr(I, "filter-active", D[8] === "approved"), (!pe || J & 256) && zr(X, "filter-active", D[8] === "all"), J & 26) {
        Me = D[3];
        let g;
        for (g = 0; g < Me.length; g += 1) {
          const x = Na(D, Me, g);
          ae[g] ? (ae[g].p(x, J), se(ae[g], 1)) : (ae[g] = Ua(x), ae[g].c(), se(ae[g], 1), ae[g].m(L.parentNode, L));
        }
        for (Et(), g = Me.length; g < ae.length; g += 1)
          ft(g);
        St();
      }
      D[9] ? re ? (re.p(D, J), J & 512 && se(re, 1)) : (re = Wa(D), re.c(), se(re, 1), re.m(ge.parentNode, ge)) : re && (Et(), he(re, 1, 1, () => {
        re = null;
      }), St());
    },
    i(D) {
      if (!pe) {
        se(i.$$.fragment, D), se(l.$$.fragment, D), se(w.$$.fragment, D);
        for (let J = 0; J < Me.length; J += 1)
          se(ae[J]);
        se(re), pe = !0;
      }
    },
    o(D) {
      he(i.$$.fragment, D), he(l.$$.fragment, D), he(w.$$.fragment, D), ae = ae.filter(Boolean);
      for (let J = 0; J < ae.length; J += 1)
        he(ae[J]);
      he(re), pe = !1;
    },
    d(D) {
      D && z(e), et(i), et(l), et(w), D && z(N), Tu(ae, D), D && z(L), D && z(q), D && z(te), re && re.d(D), D && z(ge), Ye = !1, ze(He);
    }
  };
}
function Vd(t) {
  let e;
  return {
    c() {
      e = j("p"), e.textContent = "Loading...";
    },
    m(r, n) {
      $(r, e, n);
    },
    p: K,
    i: K,
    o: K,
    d(r) {
      r && z(e);
    }
  };
}
function Yd(t) {
  let e, r;
  return e = new Hi({}), {
    c() {
      at(e.$$.fragment);
    },
    m(n, i) {
      Je(e, n, i), r = !0;
    },
    i(n) {
      r || (se(e.$$.fragment, n), r = !0);
    },
    o(n) {
      he(e.$$.fragment, n), r = !1;
    },
    d(n) {
      et(e, n);
    }
  };
}
function Gd(t) {
  let e, r;
  return e = new qi({}), {
    c() {
      at(e.$$.fragment);
    },
    m(n, i) {
      Je(e, n, i), r = !0;
    },
    i(n) {
      r || (se(e.$$.fragment, n), r = !0);
    },
    o(n) {
      he(e.$$.fragment, n), r = !1;
    },
    d(n) {
      et(e, n);
    }
  };
}
function Zd(t) {
  let e, r;
  return e = new Di({}), {
    c() {
      at(e.$$.fragment);
    },
    m(n, i) {
      Je(e, n, i), r = !0;
    },
    i(n) {
      r || (se(e.$$.fragment, n), r = !0);
    },
    o(n) {
      he(e.$$.fragment, n), r = !1;
    },
    d(n) {
      et(e, n);
    }
  };
}
function Fa(t) {
  let e, r = t[4][t[22].pubkey] + "", n;
  return {
    c() {
      e = j("strong"), n = ve(r);
    },
    m(i, a) {
      $(i, e, a), M(e, n);
    },
    p(i, a) {
      a & 24 && r !== (r = i[4][i[22].pubkey] + "") && Qe(n, r);
    },
    d(i) {
      i && z(e);
    }
  };
}
function $a(t) {
  let e, r;
  return e = new Ga({}), {
    c() {
      at(e.$$.fragment);
    },
    m(n, i) {
      Je(e, n, i), r = !0;
    },
    i(n) {
      r || (se(e.$$.fragment, n), r = !0);
    },
    o(n) {
      he(e.$$.fragment, n), r = !1;
    },
    d(n) {
      et(e, n);
    }
  };
}
function Ua(t) {
  let e, r, n, i, a, o, u, s, f, h = t[22].pubkey.slice(0, 7) + "", l, c, d = t[1].trustedAuthors.includes(t[22].pubkey), p, _, m = new Date(t[22].created_at * 1e3).toLocaleDateString() + "", b, w, S, A = t[22].content + "", T, U, G, H;
  const I = [Zd, Gd, Yd], V = [];
  function X(q, te) {
    var ge, pe;
    return te & 8 && (i = null), te & 8 && (a = null), i == null && (i = ((ge = q[22].tags.find(t0)) == null ? void 0 : ge[1]) === "-1"), i ? 0 : (a == null && (a = ((pe = q[22].tags.find(r0)) == null ? void 0 : pe[1]) === "0"), a ? 1 : 2);
  }
  o = X(t, -1), u = V[o] = I[o](t);
  let N = t[4][t[22].pubkey] && Fa(t), L = d && $a();
  return {
    c() {
      e = j("div"), r = j("div"), n = j("p"), u.c(), s = Y(), N && N.c(), f = Y(), l = ve(h), c = Y(), L && L.c(), p = Y(), _ = j("p"), b = ve(m), w = Y(), S = j("p"), T = ve(A), U = Y(), G = j("hr"), C(n, "class", "pubkey"), C(_, "class", "date"), C(r, "class", "opinion-top"), C(S, "class", "content"), C(e, "class", "opinion-container");
    },
    m(q, te) {
      $(q, e, te), M(e, r), M(r, n), V[o].m(n, null), M(n, s), N && N.m(n, null), M(n, f), M(n, l), M(n, c), L && L.m(n, null), M(r, p), M(r, _), M(_, b), M(e, w), M(e, S), M(S, T), $(q, U, te), $(q, G, te), H = !0;
    },
    p(q, te) {
      let ge = o;
      o = X(q, te), o !== ge && (Et(), he(V[ge], 1, 1, () => {
        V[ge] = null;
      }), St(), u = V[o], u || (u = V[o] = I[o](q), u.c()), se(u, 1), u.m(n, s)), q[4][q[22].pubkey] ? N ? N.p(q, te) : (N = Fa(q), N.c(), N.m(n, f)) : N && (N.d(1), N = null), (!H || te & 8) && h !== (h = q[22].pubkey.slice(0, 7) + "") && Qe(l, h), te & 10 && (d = q[1].trustedAuthors.includes(q[22].pubkey)), d ? L ? te & 10 && se(L, 1) : (L = $a(), L.c(), se(L, 1), L.m(n, null)) : L && (Et(), he(L, 1, 1, () => {
        L = null;
      }), St()), (!H || te & 8) && m !== (m = new Date(q[22].created_at * 1e3).toLocaleDateString() + "") && Qe(b, m), (!H || te & 8) && A !== (A = q[22].content + "") && Qe(T, A);
    },
    i(q) {
      H || (se(u), se(L), H = !0);
    },
    o(q) {
      he(u), he(L), H = !1;
    },
    d(q) {
      q && z(e), V[o].d(), N && N.d(), L && L.d(), q && z(U), q && z(G);
    }
  };
}
function Wa(t) {
  let e, r, n, i, a, o, u, s, f, h, l, c, d, p;
  const _ = [Xd, Kd], m = [];
  function b(w, S) {
    return w[11] ? 0 : 1;
  }
  return c = b(t), d = m[c] = _[c](t), {
    c() {
      e = j("div"), r = j("h3"), r.textContent = "Add your opinion", n = Y(), i = j("div"), a = j("p"), o = ve("Thank you for contributing your security review of "), u = ve(t[0]), s = ve(`. Please make sure to follow
					these guidelines:`), f = Y(), h = j("ul"), h.innerHTML = `<li>Stay objective in your review Focus on security-related aspects</li> 
					<li>that&#39;s what we&#39;re about here Consider contributing a full review</li> 
					<li>see our methodology</li>`, l = Y(), d.c(), C(i, "class", "description"), C(e, "class", "add-opinion-init");
    },
    m(w, S) {
      $(w, e, S), M(e, r), M(e, n), M(e, i), M(i, a), M(a, o), M(a, u), M(a, s), M(i, f), M(i, h), M(e, l), m[c].m(e, null), p = !0;
    },
    p(w, S) {
      (!p || S & 1) && Qe(u, w[0]);
      let A = c;
      c = b(w), c === A ? m[c].p(w, S) : (Et(), he(m[A], 1, 1, () => {
        m[A] = null;
      }), St(), d = m[c], d ? d.p(w, S) : (d = m[c] = _[c](w), d.c()), se(d, 1), d.m(e, null));
    },
    i(w) {
      p || (se(d), p = !0);
    },
    o(w) {
      he(d), p = !1;
    },
    d(w) {
      w && z(e), m[c].d();
    }
  };
}
function Kd(t) {
  let e, r, n, i, a, o, u, s, f, h;
  const l = [Jd, Qd], c = [];
  function d(p, _) {
    return p[10] === "login" ? 0 : p[10] === "register" ? 1 : -1;
  }
  return ~(a = d(t)) && (o = c[a] = l[a](t)), {
    c() {
      e = j("button"), e.textContent = "Log in", r = Y(), n = j("button"), n.textContent = "Register", i = Y(), o && o.c(), u = Bi(), C(e, "class", "primary-btn"), C(n, "class", "primary-btn");
    },
    m(p, _) {
      $(p, e, _), $(p, r, _), $(p, n, _), $(p, i, _), ~a && c[a].m(p, _), $(p, u, _), s = !0, f || (h = [
        Oe(e, "click", t[20]),
        Oe(n, "click", t[21])
      ], f = !0);
    },
    p(p, _) {
      let m = a;
      a = d(p), a !== m && (o && (Et(), he(c[m], 1, 1, () => {
        c[m] = null;
      }), St()), ~a ? (o = c[a], o || (o = c[a] = l[a](p), o.c()), se(o, 1), o.m(u.parentNode, u)) : o = null);
    },
    i(p) {
      s || (se(o), s = !0);
    },
    o(p) {
      he(o), s = !1;
    },
    d(p) {
      p && z(e), p && z(r), p && z(n), p && z(i), ~a && c[a].d(p), p && z(u), f = !1, ze(h);
    }
  };
}
function Xd(t) {
  let e, r, n = t[11].pubkey + "", i, a, o, u, s, f, h, l, c, d, p, _, m, b, w, S, A, T, U, G, H, I, V, X, N = !t[11] && za();
  return {
    c() {
      e = j("p"), r = ve("Logged in as "), i = ve(n), a = Y(), o = j("button"), o.textContent = "Logout", u = Y(), s = j("h3"), s.textContent = "Create new opinion", f = Y(), h = j("form"), l = j("label"), l.textContent = "Content", c = Y(), d = j("input"), p = Y(), _ = j("label"), _.textContent = "Sentiment", m = Y(), b = j("select"), w = j("option"), w.textContent = "negative", S = j("option"), S.textContent = "neutral", A = j("option"), A.textContent = "positive", T = Y(), U = j("button"), G = ve("Submit"), I = Y(), N && N.c(), C(o, "class", "primary-btn"), C(l, "for", "content"), C(d, "id", "content"), C(d, "type", "text"), C(_, "for", "sentiment"), w.__value = "-1", w.value = w.__value, S.__value = "0", S.value = S.__value, A.__value = "1", A.value = A.__value, C(b, "name", "sentiment"), C(b, "id", "sentiment"), t[5].sentiment === void 0 && un(() => t[19].call(b)), C(U, "class", "primary-btn"), C(U, "type", "submit"), U.disabled = H = !t[11];
    },
    m(L, q) {
      $(L, e, q), M(e, r), M(e, i), $(L, a, q), $(L, o, q), $(L, u, q), $(L, s, q), $(L, f, q), $(L, h, q), M(h, l), M(h, c), M(h, d), Ft(d, t[5].content), M(h, p), M(h, _), M(h, m), M(h, b), M(b, w), M(b, S), M(b, A), uo(b, t[5].sentiment), M(h, T), M(h, U), M(U, G), M(h, I), N && N.m(h, null), V || (X = [
        Oe(o, "click", t[14]),
        Oe(d, "input", t[18]),
        Oe(b, "change", t[19]),
        Oe(h, "submit", Pi(t[12]))
      ], V = !0);
    },
    p(L, q) {
      q & 2048 && n !== (n = L[11].pubkey + "") && Qe(i, n), q & 32 && d.value !== L[5].content && Ft(d, L[5].content), q & 32 && uo(b, L[5].sentiment), q & 2048 && H !== (H = !L[11]) && (U.disabled = H), L[11] ? N && (N.d(1), N = null) : N || (N = za(), N.c(), N.m(h, null));
    },
    i: K,
    o: K,
    d(L) {
      L && z(e), L && z(a), L && z(o), L && z(u), L && z(s), L && z(f), L && z(h), N && N.d(), V = !1, ze(X);
    }
  };
}
function Qd(t) {
  let e, r;
  return e = new Ru({}), {
    c() {
      at(e.$$.fragment);
    },
    m(n, i) {
      Je(e, n, i), r = !0;
    },
    i(n) {
      r || (se(e.$$.fragment, n), r = !0);
    },
    o(n) {
      he(e.$$.fragment, n), r = !1;
    },
    d(n) {
      et(e, n);
    }
  };
}
function Jd(t) {
  let e, r;
  return e = new Cu({}), {
    c() {
      at(e.$$.fragment);
    },
    m(n, i) {
      Je(e, n, i), r = !0;
    },
    i(n) {
      r || (se(e.$$.fragment, n), r = !0);
    },
    o(n) {
      he(e.$$.fragment, n), r = !1;
    },
    d(n) {
      et(e, n);
    }
  };
}
function za(t) {
  let e;
  return {
    c() {
      e = j("span"), e.textContent = "not logged in";
    },
    m(r, n) {
      $(r, e, n);
    },
    d(r) {
      r && z(e);
    }
  };
}
function e0(t) {
  var m;
  let e, r, n = (((m = t[2]) == null ? void 0 : m.length) || "0") + "", i, a, o, u, s, f, h, l, c;
  const d = [Vd, zd], p = [];
  function _(b, w) {
    return b[6] ? 0 : 1;
  }
  return f = _(t), h = p[f] = d[f](t), {
    c() {
      e = j("h1"), r = ve("Community opinions ("), i = ve(n), a = ve(")"), o = Y(), u = j("p"), u.textContent = `These comments are contributed by members of the Wallet Scrutiny community like you. Thank you for
	helping review wallets for security issues and enabling more people to secure and custody their
	bitcoin.`, s = Y(), h.c(), l = Bi(), this.c = K, C(u, "class", "description");
    },
    m(b, w) {
      $(b, e, w), M(e, r), M(e, i), M(e, a), $(b, o, w), $(b, u, w), $(b, s, w), p[f].m(b, w), $(b, l, w), c = !0;
    },
    p(b, [w]) {
      var A;
      (!c || w & 4) && n !== (n = (((A = b[2]) == null ? void 0 : A.length) || "0") + "") && Qe(i, n);
      let S = f;
      f = _(b), f === S ? p[f].p(b, w) : (Et(), he(p[S], 1, 1, () => {
        p[S] = null;
      }), St(), h = p[f], h ? h.p(b, w) : (h = p[f] = d[f](b), h.c()), se(h, 1), h.m(l.parentNode, l));
    },
    i(b) {
      c || (se(h), c = !0);
    },
    o(b) {
      he(h), c = !1;
    },
    d(b) {
      b && z(e), b && z(o), b && z(u), b && z(s), p[f].d(b), b && z(l);
    }
  };
}
const t0 = (t) => t[0] === "sentiment", r0 = (t) => t[0] === "sentiment";
function n0(t, e, r) {
  let n;
  Li(t, tt, (I) => r(11, n = I));
  let { name: i } = e, a, o = [], u = [], s = {}, f = { content: "", sentiment: "0" }, h = !0, l = { "-1": 0, 0: 0, 1: 0 }, c = "approved", d = !1, p = !1;
  const _ = async () => {
    if (!f.content || !n)
      return;
    let I = {
      kind: 30234,
      content: f.content,
      tags: [["d", i], ["sentiment", f.sentiment]],
      pubkey: n.pubkey,
      created_at: Math.floor(Date.now() / 1e3)
    };
    !n.privkey && await window.nostr.getPublicKey() === n.pubkey && (I = await window.nostr.signEvent(I)), await a.nostr.publish(I, () => {
      const V = o.findIndex((X) => X.pubkey === I.pubkey);
      V !== -1 ? r(2, o[V] = I, o) : r(2, o = [I, ...o]), m();
    });
  }, m = () => {
    r(7, l = { "-1": 0, 0: 0, 1: 0 }), r(3, u = o.filter((I) => {
      var X;
      if (c === "approved" && !a.trustedAuthors.includes(I.pubkey))
        return !1;
      const V = (X = I.tags.find((N) => N[0] === "sentiment")) == null ? void 0 : X[1];
      return V && r(7, l[V] += 1, l), !0;
    })), r(3, u = u.sort((I, V) => {
      const X = a.trustedAuthors.includes(I.pubkey), N = a.trustedAuthors.includes(V.pubkey);
      return X && !N ? -1 : !X && N ? 1 : I.created_at > V.created_at ? -1 : I.created_at < V.created_at ? 1 : 0;
    }));
  };
  Va(async () => {
    r(1, a = (await Promise.resolve().then(() => s0)).expertOpinions), await a.onReady, r(6, h = !1);
    const I = a.nostr.sub(
      {
        cb: (V) => {
          r(2, o = [...o, V]);
          let X = a.nostr.sub(
            {
              cb: (N) => {
                const L = JSON.parse(N.content);
                r(4, s[V.pubkey] = L.name, s);
              },
              filter: {
                kinds: [0],
                authors: [V.pubkey],
                limit: 1
              }
            },
            null,
            () => {
              X.unsub();
            }
          );
        },
        filter: { kinds: [30234], "#d": [i], limit: 20 }
      },
      null,
      () => {
        m(), I.unsub();
      }
    );
  });
  const b = () => {
    tt.set(null), localStorage.removeItem("activeProfile");
  }, w = () => r(8, c = "approved") && m(), S = () => r(8, c = "all") && m(), A = () => r(9, d = !d);
  function T() {
    f.content = this.value, r(5, f);
  }
  function U() {
    f.sentiment = Bu(this), r(5, f);
  }
  const G = () => r(10, p = "login"), H = () => r(10, p = "register");
  return t.$$set = (I) => {
    "name" in I && r(0, i = I.name);
  }, [
    i,
    a,
    o,
    u,
    s,
    f,
    h,
    l,
    c,
    d,
    p,
    n,
    _,
    m,
    b,
    w,
    S,
    A,
    T,
    U,
    G,
    H
  ];
}
class i0 extends _t {
  constructor(e) {
    super(), this.shadowRoot.innerHTML = "<style>:host{--border-color:#dedede;--content-text-color:#606060;--pubkey-text-color:#000000;--date-text-color:#808080;--description-text-color:#808080;--filter-active-color:#000000;--filter-inactive-color:#808080;--button-text-color:#ffffff;--button-background-color:#000000;font-family:'Lato'}h1{margin:5px 0}hr{height:1px;background-color:var(--border-color);border:none}.content{color:var(--content-text-color);margin:2px 0 10px 0}.pubkey{color:var(--pubkey-text-color);font-weight:600;display:flex;align-items:center;gap:10px;margin:2px 0}.date{font-style:italic;color:var(--date-text-color)}.top-nav{display:flex;justify-content:space-between;border-top:var(--border-color) 1px solid;border-bottom:var(--border-color) 1px solid;padding:20px 0}.nav-count{display:flex;align-items:center}.count-container{display:flex;flex-direction:row;color:var(--content-text-color)}.opinion-top{display:flex;justify-content:space-between}.description{color:var(--description-text-color);margin:10px 0}.blank-btn{background-color:transparent;border:none;cursor:pointer}.filter-container{display:flex;flex-direction:row}.filter-container>.filter-active{color:var(--filter-active-color)}.filter-btn{color:var(--filter-inactive-color)}.primary-btn{color:var(--button-text-color);background-color:var(--button-background-color);padding:7px 20px;border-radius:3px;cursor:pointer;border:none}</style>", At(
      this,
      {
        target: this.shadowRoot,
        props: Ot(this.attributes),
        customElement: !0
      },
      n0,
      e0,
      pt,
      { name: 0 },
      null
    ), e && (e.target && $(e.target, this, e.anchor), e.props && (this.$set(e.props), fn()));
  }
  static get observedAttributes() {
    return ["name"];
  }
  get name() {
    return this.$$.ctx[0];
  }
  set name(e) {
    this.$$set({ name: e }), fn();
  }
}
customElements.define("nostr-opinion", i0);
class o0 {
  constructor() {
    Ht(this, "trustedAuthors");
    Ht(this, "onlyTrusted", !1);
    Ht(this, "nostr");
    Ht(this, "onReady");
    Ht(this, "onReadyResolve");
    this.nostr = jd(), tt.subscribe((e) => {
      this.nostr.setPrivateKey(e == null ? void 0 : e.privkey);
    }), this.onReady = new Promise((e) => {
      this.onReadyResolve = e;
    });
  }
  setRelay(e = "wss://nos.lol") {
    this.nostr.addRelay(e, { read: !0, write: !0 });
  }
  setReady() {
    this.onReadyResolve();
  }
}
const a0 = new o0(), s0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  expertOpinions: a0
}, Symbol.toStringTag, { value: "Module" }));
export {
  a0 as expertOpinions
};
