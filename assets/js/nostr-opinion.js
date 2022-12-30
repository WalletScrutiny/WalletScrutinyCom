function Z() {
}
function Bi(t) {
  return t();
}
function no() {
  return /* @__PURE__ */ Object.create(null);
}
function _t(t) {
  t.forEach(Bi);
}
function wi(t) {
  return typeof t == "function";
}
function Ct(t, e) {
  return t != t ? e == e : t !== e || t && typeof t == "object" || typeof t == "function";
}
function bu(t) {
  return Object.keys(t).length === 0;
}
function wu(t, ...e) {
  if (t == null)
    return Z;
  const r = t.subscribe(...e);
  return r.unsubscribe ? () => r.unsubscribe() : r;
}
function Fa(t, e, r) {
  t.$$.on_destroy.push(wu(e, r));
}
function mu(t, e, r) {
  return t.set(r), e;
}
function I(t, e) {
  t.appendChild(e);
}
function ee(t, e, r) {
  t.insertBefore(e, r || null);
}
function ue(t) {
  t.parentNode && t.parentNode.removeChild(t);
}
function xu(t, e) {
  for (let r = 0; r < t.length; r += 1)
    t[r] && t[r].d(e);
}
function W(t) {
  return document.createElement(t);
}
function Ie(t) {
  return document.createElementNS("http://www.w3.org/2000/svg", t);
}
function ge(t) {
  return document.createTextNode(t);
}
function ne() {
  return ge(" ");
}
function Eu() {
  return ge("");
}
function nt(t, e, r, n) {
  return t.addEventListener(e, r, n), () => t.removeEventListener(e, r, n);
}
function $a(t) {
  return function(e) {
    return e.preventDefault(), t.call(this, e);
  };
}
function A(t, e, r) {
  r == null ? t.removeAttribute(e) : t.getAttribute(e) !== r && t.setAttribute(e, r);
}
function Su(t) {
  return Array.from(t.childNodes);
}
function at(t, e) {
  e = "" + e, t.wholeText !== e && (t.data = e);
}
function sn(t, e) {
  t.value = e ?? "";
}
function io(t, e) {
  for (let r = 0; r < t.options.length; r += 1) {
    const n = t.options[r];
    if (n.__value === e) {
      n.selected = !0;
      return;
    }
  }
  t.selectedIndex = -1;
}
function Ru(t) {
  const e = t.querySelector(":checked") || t.options[0];
  return e && e.__value;
}
function Wr(t, e, r) {
  t.classList[r ? "add" : "remove"](e);
}
function Ut(t) {
  const e = {};
  for (const r of t)
    e[r.name] = r.value;
  return e;
}
let Mr;
function Rr(t) {
  Mr = t;
}
function Cu() {
  if (!Mr)
    throw new Error("Function called outside component initialization");
  return Mr;
}
function Ou(t) {
  Cu().$$.on_mount.push(t);
}
function Au(t, e) {
  const r = t.$$.callbacks[e.type];
  r && r.slice().forEach((n) => n.call(this, e));
}
const Sr = [], oo = [], en = [], ao = [], ku = Promise.resolve();
let mi = !1;
function Mu() {
  mi || (mi = !0, ku.then(fn));
}
function un(t) {
  en.push(t);
}
const Wn = /* @__PURE__ */ new Set();
let zr = 0;
function fn() {
  const t = Mr;
  do {
    for (; zr < Sr.length; ) {
      const e = Sr[zr];
      zr++, Rr(e), Iu(e.$$);
    }
    for (Rr(null), Sr.length = 0, zr = 0; oo.length; )
      oo.pop()();
    for (let e = 0; e < en.length; e += 1) {
      const r = en[e];
      Wn.has(r) || (Wn.add(r), r());
    }
    en.length = 0;
  } while (Sr.length);
  for (; ao.length; )
    ao.pop()();
  mi = !1, Wn.clear(), Rr(t);
}
function Iu(t) {
  if (t.fragment !== null) {
    t.update(), _t(t.before_update);
    const e = t.dirty;
    t.dirty = [-1], t.fragment && t.fragment.p(t.ctx, e), t.after_update.forEach(un);
  }
}
const tn = /* @__PURE__ */ new Set();
let bt;
function ln() {
  bt = {
    r: 0,
    c: [],
    p: bt
  };
}
function cn() {
  bt.r || _t(bt.c), bt = bt.p;
}
function be(t, e) {
  t && t.i && (tn.delete(t), t.i(e));
}
function ke(t, e, r, n) {
  if (t && t.o) {
    if (tn.has(t))
      return;
    tn.add(t), bt.c.push(() => {
      tn.delete(t), n && (r && t.d(1), n());
    }), t.o(e);
  } else
    n && n();
}
function xt(t) {
  t && t.c();
}
function ct(t, e, r, n) {
  const { fragment: i, after_update: o } = t.$$;
  i && i.m(e, r), n || un(() => {
    const a = t.$$.on_mount.map(Bi).filter(wi);
    t.$$.on_destroy ? t.$$.on_destroy.push(...a) : _t(a), t.$$.on_mount = [];
  }), o.forEach(un);
}
function ht(t, e) {
  const r = t.$$;
  r.fragment !== null && (_t(r.on_destroy), r.fragment && r.fragment.d(e), r.on_destroy = r.fragment = null, r.ctx = []);
}
function Tu(t, e) {
  t.$$.dirty[0] === -1 && (Sr.push(t), Mu(), t.$$.dirty.fill(0)), t.$$.dirty[e / 31 | 0] |= 1 << e % 31;
}
function Wt(t, e, r, n, i, o, a, u = [-1]) {
  const s = Mr;
  Rr(t);
  const f = t.$$ = {
    fragment: null,
    ctx: [],
    props: o,
    update: Z,
    not_equal: i,
    bound: no(),
    on_mount: [],
    on_destroy: [],
    on_disconnect: [],
    before_update: [],
    after_update: [],
    context: new Map(e.context || (s ? s.$$.context : [])),
    callbacks: no(),
    dirty: u,
    skip_bound: !1,
    root: e.target || s.$$.root
  };
  a && a(f.root);
  let c = !1;
  if (f.ctx = r ? r(t, e.props || {}, (l, h, ...d) => {
    const p = d.length ? d[0] : h;
    return f.ctx && i(f.ctx[l], f.ctx[l] = p) && (!f.skip_bound && f.bound[l] && f.bound[l](p), c && Tu(t, l)), h;
  }) : [], f.update(), c = !0, _t(f.before_update), f.fragment = n ? n(f.ctx) : !1, e.target) {
    if (e.hydrate) {
      const l = Su(e.target);
      f.fragment && f.fragment.l(l), l.forEach(ue);
    } else
      f.fragment && f.fragment.c();
    e.intro && be(t.$$.fragment), ct(t, e.target, e.anchor, e.customElement), fn();
  }
  Rr(s);
}
let Ot;
typeof HTMLElement == "function" && (Ot = class extends HTMLElement {
  constructor() {
    super(), this.attachShadow({ mode: "open" });
  }
  connectedCallback() {
    const { on_mount: t } = this.$$;
    this.$$.on_disconnect = t.map(Bi).filter(wi);
    for (const e in this.$$.slotted)
      this.appendChild(this.$$.slotted[e]);
  }
  attributeChangedCallback(t, e, r) {
    this[t] = r;
  }
  disconnectedCallback() {
    _t(this.$$.on_disconnect);
  }
  $destroy() {
    ht(this, 1), this.$destroy = Z;
  }
  $on(t, e) {
    if (!wi(e))
      return Z;
    const r = this.$$.callbacks[t] || (this.$$.callbacks[t] = []);
    return r.push(e), () => {
      const n = r.indexOf(e);
      n !== -1 && r.splice(n, 1);
    };
  }
  $set(t) {
    this.$$set && !bu(t) && (this.$$.skip_bound = !0, this.$$set(t), this.$$.skip_bound = !1);
  }
});
const Lt = [];
function Bu(t, e = Z) {
  let r;
  const n = /* @__PURE__ */ new Set();
  function i(u) {
    if (Ct(t, u) && (t = u, r)) {
      const s = !Lt.length;
      for (const f of n)
        f[1](), Lt.push(f, t);
      if (s) {
        for (let f = 0; f < Lt.length; f += 2)
          Lt[f][0](Lt[f + 1]);
        Lt.length = 0;
      }
    }
  }
  function o(u) {
    i(u(t));
  }
  function a(u, s = Z) {
    const f = [u, s];
    return n.add(f), n.size === 1 && (r = e(i) || Z), u(t), () => {
      n.delete(f), n.size === 0 && (r(), r = null);
    };
  }
  return { set: i, update: o, subscribe: a };
}
const Dt = Bu(null);
Dt.subscribe((t) => {
  !t || localStorage.setItem("activeProfile", JSON.stringify(t));
});
Dt.set(JSON.parse(localStorage.getItem("activeProfile")));
function Lu(t) {
  let e, r, n;
  return {
    c() {
      e = Ie("svg"), r = Ie("path"), n = Ie("path"), this.c = Z, A(r, "fill-rule", "evenodd"), A(r, "clip-rule", "evenodd"), A(r, "d", "M24 9.77734C24 8.86867 23.3874 8.0742 22.5087 7.8431L16.0087 6.13376C15.6752 6.04607 15.3248 6.04607 14.9913 6.13376L8.49134 7.8431C7.61255 8.0742 7 8.86867 7 9.77734V16V16C7.00002 20.8032 10.7627 24.7276 15.5013 24.9864C20.2387 24.7263 24 20.8025 24 16.0001V16V9.77734Z"), A(r, "fill", "#4DA84D"), A(n, "d", "M12 16.2553L14.8661 19L19 12"), A(n, "stroke", "white"), A(n, "stroke-width", "1.5"), A(n, "stroke-linecap", "round"), A(n, "stroke-linejoin", "round"), A(e, "width", "30"), A(e, "height", "30"), A(e, "viewBox", "0 0 30 30"), A(e, "fill", "none"), A(e, "xmlns", "http://www.w3.org/2000/svg");
    },
    m(i, o) {
      ee(i, e, o), I(e, r), I(e, n);
    },
    p: Z,
    i: Z,
    o: Z,
    d(i) {
      i && ue(e);
    }
  };
}
class Li extends Ot {
  constructor(e) {
    super(), Wt(
      this,
      {
        target: this.shadowRoot,
        props: Ut(this.attributes),
        customElement: !0
      },
      null,
      Lu,
      Ct,
      {},
      null
    ), e && e.target && ee(e.target, this, e.anchor);
  }
}
customElements.define("nostr-opinion-positive", Li);
function Pu(t) {
  let e, r, n, i;
  return {
    c() {
      e = Ie("svg"), r = Ie("path"), n = Ie("path"), i = Ie("path"), this.c = Z, A(r, "fill-rule", "evenodd"), A(r, "clip-rule", "evenodd"), A(r, "d", "M24 9.77734C24 8.86867 23.3874 8.0742 22.5087 7.8431L16.0087 6.13376C15.6752 6.04607 15.3248 6.04607 14.9913 6.13376L8.49134 7.8431C7.61255 8.0742 7 8.86867 7 9.77734V16V16C7.00002 20.8032 10.7627 24.7276 15.5013 24.9864C20.2387 24.7263 24 20.8025 24 16.0001V16V9.77734Z"), A(r, "fill", "#42BDD8"), A(n, "d", "M12.8661 17H18.5"), A(n, "stroke", "white"), A(n, "stroke-width", "1.5"), A(n, "stroke-linecap", "round"), A(n, "stroke-linejoin", "round"), A(i, "d", "M12.8661 13H18.5"), A(i, "stroke", "white"), A(i, "stroke-width", "1.5"), A(i, "stroke-linecap", "round"), A(i, "stroke-linejoin", "round"), A(e, "width", "30"), A(e, "height", "30"), A(e, "viewBox", "0 0 30 30"), A(e, "fill", "none"), A(e, "xmlns", "http://www.w3.org/2000/svg");
    },
    m(o, a) {
      ee(o, e, a), I(e, r), I(e, n), I(e, i);
    },
    p: Z,
    i: Z,
    o: Z,
    d(o) {
      o && ue(e);
    }
  };
}
class Pi extends Ot {
  constructor(e) {
    super(), Wt(
      this,
      {
        target: this.shadowRoot,
        props: Ut(this.attributes),
        customElement: !0
      },
      null,
      Pu,
      Ct,
      {},
      null
    ), e && e.target && ee(e.target, this, e.anchor);
  }
}
customElements.define("nostr-opinion-neutral", Pi);
function Hu(t) {
  let e, r, n, i;
  return {
    c() {
      e = Ie("svg"), r = Ie("path"), n = Ie("path"), i = Ie("path"), this.c = Z, A(r, "fill-rule", "evenodd"), A(r, "clip-rule", "evenodd"), A(r, "d", "M24 9.77734C24 8.86867 23.3874 8.0742 22.5087 7.8431L16.0087 6.13376C15.6752 6.04607 15.3248 6.04607 14.9913 6.13376L8.49134 7.8431C7.61255 8.0742 7 8.86867 7 9.77734V16V16C7.00002 20.8032 10.7627 24.7276 15.5013 24.9864C20.2387 24.7263 24 20.8025 24 16.0001V16V9.77734Z"), A(r, "fill", "#ED1B24"), A(n, "d", "M12 11.5L19 18.5"), A(n, "stroke", "white"), A(n, "stroke-width", "1.3125"), A(n, "stroke-linecap", "round"), A(i, "d", "M19 11.5L12 18.5"), A(i, "stroke", "white"), A(i, "stroke-width", "1.3125"), A(i, "stroke-linecap", "round"), A(e, "width", "30"), A(e, "height", "30"), A(e, "viewBox", "0 0 30 30"), A(e, "fill", "none"), A(e, "xmlns", "http://www.w3.org/2000/svg");
    },
    m(o, a) {
      ee(o, e, a), I(e, r), I(e, n), I(e, i);
    },
    p: Z,
    i: Z,
    o: Z,
    d(o) {
      o && ue(e);
    }
  };
}
class Hi extends Ot {
  constructor(e) {
    super(), Wt(
      this,
      {
        target: this.shadowRoot,
        props: Ut(this.attributes),
        customElement: !0
      },
      null,
      Hu,
      Ct,
      {},
      null
    ), e && e.target && ee(e.target, this, e.anchor);
  }
}
customElements.define("nostr-opinion-negative", Hi);
function qu(t) {
  let e, r, n;
  return {
    c() {
      e = Ie("svg"), r = Ie("rect"), n = Ie("path"), this.c = Z, A(r, "y", "0.5"), A(r, "width", "106"), A(r, "height", "17"), A(r, "rx", "3"), A(r, "fill", "#F7931A"), A(n, "d", "M9.1985 10.07L8.3075 7.703C8.2355 7.52 8.162 7.2875 8.087 7.0055C8.054 7.1465 8.018 7.277 7.979 7.397C7.94 7.514 7.904 7.6175 7.871 7.7075L6.98 10.07H9.1985ZM11.192 12.5H10.3775C10.2845 12.5 10.2095 12.4775 10.1525 12.4325C10.0955 12.3845 10.052 12.326 10.022 12.257L9.482 10.826H6.692L6.152 12.257C6.128 12.317 6.086 12.3725 6.026 12.4235C5.966 12.4745 5.891 12.5 5.801 12.5H4.9865L7.556 6.02H8.6225L11.192 12.5ZM13.9642 9.323C14.1982 9.323 14.4037 9.293 14.5807 9.233C14.7607 9.173 14.9092 9.089 15.0262 8.981C15.1462 8.87 15.2362 8.7365 15.2962 8.5805C15.3562 8.4245 15.3862 8.2505 15.3862 8.0585C15.3862 7.8695 15.3562 7.7 15.2962 7.55C15.2392 7.4 15.1522 7.2725 15.0352 7.1675C14.9182 7.0625 14.7697 6.983 14.5897 6.929C14.4127 6.872 14.2042 6.8435 13.9642 6.8435H13.0012V9.323H13.9642ZM13.9642 6.02C14.3872 6.02 14.7532 6.0695 15.0622 6.1685C15.3742 6.2675 15.6307 6.407 15.8317 6.587C16.0357 6.764 16.1872 6.9785 16.2862 7.2305C16.3852 7.4795 16.4347 7.7555 16.4347 8.0585C16.4347 8.3675 16.3822 8.651 16.2772 8.909C16.1722 9.164 16.0162 9.3845 15.8092 9.5705C15.6022 9.7535 15.3442 9.8975 15.0352 10.0025C14.7292 10.1045 14.3722 10.1555 13.9642 10.1555H13.0012V12.5H11.9482V6.02H13.9642ZM19.4574 9.323C19.6914 9.323 19.8969 9.293 20.0739 9.233C20.2539 9.173 20.4024 9.089 20.5194 8.981C20.6394 8.87 20.7294 8.7365 20.7894 8.5805C20.8494 8.4245 20.8794 8.2505 20.8794 8.0585C20.8794 7.8695 20.8494 7.7 20.7894 7.55C20.7324 7.4 20.6454 7.2725 20.5284 7.1675C20.4114 7.0625 20.2629 6.983 20.0829 6.929C19.9059 6.872 19.6974 6.8435 19.4574 6.8435H18.4944V9.323H19.4574ZM19.4574 6.02C19.8804 6.02 20.2464 6.0695 20.5554 6.1685C20.8674 6.2675 21.1239 6.407 21.3249 6.587C21.5289 6.764 21.6804 6.9785 21.7794 7.2305C21.8784 7.4795 21.9279 7.7555 21.9279 8.0585C21.9279 8.3675 21.8754 8.651 21.7704 8.909C21.6654 9.164 21.5094 9.3845 21.3024 9.5705C21.0954 9.7535 20.8374 9.8975 20.5284 10.0025C20.2224 10.1045 19.8654 10.1555 19.4574 10.1555H18.4944V12.5H17.4414V6.02H19.4574ZM24.8155 9.125C25.0555 9.125 25.2655 9.0965 25.4455 9.0395C25.6255 8.9795 25.7755 8.897 25.8955 8.792C26.0155 8.687 26.1055 8.5625 26.1655 8.4185C26.2255 8.2715 26.2555 8.1095 26.2555 7.9325C26.2555 7.5785 26.1385 7.3085 25.9045 7.1225C25.6705 6.9365 25.3165 6.8435 24.8425 6.8435H23.9875V9.125H24.8155ZM27.8665 12.5H26.926C26.74 12.5 26.605 12.428 26.521 12.284L25.009 10.1015C24.958 10.0265 24.9025 9.9725 24.8425 9.9395C24.7825 9.9065 24.6925 9.89 24.5725 9.89H23.9875V12.5H22.9345V6.02H24.8425C25.2685 6.02 25.6345 6.0635 25.9405 6.1505C26.2495 6.2375 26.503 6.362 26.701 6.524C26.899 6.683 27.0445 6.875 27.1375 7.1C27.2335 7.325 27.2815 7.5755 27.2815 7.8515C27.2815 8.0765 27.247 8.2865 27.178 8.4815C27.112 8.6765 27.0145 8.8535 26.8855 9.0125C26.7595 9.1715 26.6035 9.3095 26.4175 9.4265C26.2315 9.5435 26.02 9.635 25.783 9.701C25.912 9.779 26.023 9.8885 26.116 10.0295L27.8665 12.5ZM34.6568 9.26C34.6568 9.74 34.5788 10.1825 34.4228 10.5875C34.2668 10.9925 34.0463 11.342 33.7613 11.636C33.4793 11.927 33.1388 12.155 32.7398 12.32C32.3438 12.485 31.9028 12.5675 31.4168 12.5675C30.9338 12.5675 30.4928 12.485 30.0938 12.32C29.6978 12.155 29.3573 11.927 29.0723 11.636C28.7873 11.342 28.5668 10.9925 28.4108 10.5875C28.2548 10.1825 28.1768 9.74 28.1768 9.26C28.1768 8.78 28.2548 8.3375 28.4108 7.9325C28.5668 7.5275 28.7873 7.178 29.0723 6.884C29.3573 6.59 29.6978 6.3605 30.0938 6.1955C30.4928 6.0305 30.9338 5.948 31.4168 5.948C31.9028 5.948 32.3438 6.0305 32.7398 6.1955C33.1388 6.3605 33.4793 6.59 33.7613 6.884C34.0463 7.178 34.2668 7.5275 34.4228 7.9325C34.5788 8.3375 34.6568 8.78 34.6568 9.26ZM33.5813 9.26C33.5813 8.888 33.5303 8.5535 33.4283 8.2565C33.3293 7.9595 33.1853 7.7075 32.9963 7.5005C32.8103 7.2935 32.5838 7.1345 32.3168 7.0235C32.0498 6.9125 31.7498 6.857 31.4168 6.857C31.0868 6.857 30.7883 6.9125 30.5213 7.0235C30.2543 7.1345 30.0263 7.2935 29.8373 7.5005C29.6483 7.7075 29.5028 7.9595 29.4008 8.2565C29.2988 8.5535 29.2478 8.888 29.2478 9.26C29.2478 9.635 29.2988 9.971 29.4008 10.268C29.5028 10.565 29.6483 10.817 29.8373 11.024C30.0263 11.228 30.2543 11.3855 30.5213 11.4965C30.7883 11.6045 31.0868 11.6585 31.4168 11.6585C31.7498 11.6585 32.0498 11.6045 32.3168 11.4965C32.5838 11.3855 32.8103 11.228 32.9963 11.024C33.1853 10.817 33.3293 10.565 33.4283 10.268C33.5303 9.971 33.5813 9.635 33.5813 9.26ZM41.0309 6.02L38.4029 12.5H37.4534L34.8254 6.02H35.6669C35.7599 6.02 35.8349 6.044 35.8919 6.092C35.9489 6.137 35.9924 6.194 36.0224 6.263L37.6919 10.4885C37.7819 10.7255 37.8644 10.9985 37.9394 11.3075C37.9724 11.1545 38.0069 11.009 38.0429 10.871C38.0819 10.733 38.1239 10.6055 38.1689 10.4885L39.8339 6.263C39.8579 6.203 39.8999 6.1475 39.9599 6.0965C40.0199 6.0455 40.0949 6.02 40.1849 6.02H41.0309ZM45.8326 11.6495L45.8281 12.5H41.7871V6.02H45.8281V6.8705H42.8446V8.8235H45.2296V9.647H42.8446V11.6495H45.8326ZM52.6606 9.26C52.6606 9.74 52.5826 10.1795 52.4266 10.5785C52.2706 10.9745 52.0501 11.315 51.7651 11.6C51.4831 11.885 51.1426 12.107 50.7436 12.266C50.3476 12.422 49.9066 12.5 49.4206 12.5H46.9726V6.02H49.4206C49.9066 6.02 50.3476 6.0995 50.7436 6.2585C51.1426 6.4145 51.4831 6.635 51.7651 6.92C52.0501 7.205 52.2706 7.547 52.4266 7.946C52.5826 8.342 52.6606 8.78 52.6606 9.26ZM51.5851 9.26C51.5851 8.888 51.5341 8.5535 51.4321 8.2565C51.3331 7.9595 51.1891 7.709 51.0001 7.505C50.8141 7.301 50.5876 7.145 50.3206 7.037C50.0536 6.926 49.7536 6.8705 49.4206 6.8705H48.0301V11.6495H49.4206C49.7536 11.6495 50.0536 11.5955 50.3206 11.4875C50.5876 11.3795 50.8141 11.2235 51.0001 11.0195C51.1891 10.8125 51.3331 10.562 51.4321 10.268C51.5341 9.971 51.5851 9.635 51.5851 9.26ZM57.9415 9.125C58.1815 9.125 58.3915 9.0965 58.5715 9.0395C58.7515 8.9795 58.9015 8.897 59.0215 8.792C59.1415 8.687 59.2315 8.5625 59.2915 8.4185C59.3515 8.2715 59.3815 8.1095 59.3815 7.9325C59.3815 7.5785 59.2645 7.3085 59.0305 7.1225C58.7965 6.9365 58.4425 6.8435 57.9685 6.8435H57.1135V9.125H57.9415ZM60.9925 12.5H60.052C59.866 12.5 59.731 12.428 59.647 12.284L58.135 10.1015C58.084 10.0265 58.0285 9.9725 57.9685 9.9395C57.9085 9.9065 57.8185 9.89 57.6985 9.89H57.1135V12.5H56.0605V6.02H57.9685C58.3945 6.02 58.7605 6.0635 59.0665 6.1505C59.3755 6.2375 59.629 6.362 59.827 6.524C60.025 6.683 60.1705 6.875 60.2635 7.1C60.3595 7.325 60.4075 7.5755 60.4075 7.8515C60.4075 8.0765 60.373 8.2865 60.304 8.4815C60.238 8.6765 60.1405 8.8535 60.0115 9.0125C59.8855 9.1715 59.7295 9.3095 59.5435 9.4265C59.3575 9.5435 59.146 9.635 58.909 9.701C59.038 9.779 59.149 9.8885 59.242 10.0295L60.9925 12.5ZM65.8189 11.6495L65.8144 12.5H61.7734V6.02H65.8144V6.8705H62.8309V8.8235H65.2159V9.647H62.8309V11.6495H65.8189ZM72.3815 6.02L69.7535 12.5H68.804L66.176 6.02H67.0175C67.1105 6.02 67.1855 6.044 67.2425 6.092C67.2995 6.137 67.343 6.194 67.373 6.263L69.0425 10.4885C69.1325 10.7255 69.215 10.9985 69.29 11.3075C69.323 11.1545 69.3575 11.009 69.3935 10.871C69.4325 10.733 69.4745 10.6055 69.5195 10.4885L71.1845 6.263C71.2085 6.203 71.2505 6.1475 71.3105 6.0965C71.3705 6.0455 71.4455 6.02 71.5355 6.02H72.3815ZM74.1952 12.5H73.1377V6.02H74.1952V12.5ZM79.7759 11.6495L79.7714 12.5H75.7304V6.02H79.7714V6.8705H76.7879V8.8235H79.1729V9.647H76.7879V11.6495H79.7759ZM89.4345 6.02L87.4185 12.5H86.469L84.948 7.847C84.93 7.796 84.912 7.7405 84.894 7.6805C84.879 7.6205 84.864 7.556 84.849 7.487C84.834 7.556 84.8175 7.6205 84.7995 7.6805C84.7845 7.7405 84.768 7.796 84.75 7.847L83.2155 12.5H82.266L80.25 6.02H81.132C81.222 6.02 81.297 6.0425 81.357 6.0875C81.42 6.1295 81.462 6.188 81.483 6.263L82.698 10.4165C82.722 10.5065 82.7445 10.604 82.7655 10.709C82.7865 10.814 82.8075 10.9235 82.8285 11.0375C82.8495 10.9235 82.872 10.814 82.896 10.709C82.923 10.601 82.9515 10.5035 82.9815 10.4165L84.372 6.263C84.393 6.203 84.435 6.1475 84.498 6.0965C84.561 6.0455 84.636 6.02 84.723 6.02H85.029C85.122 6.02 85.197 6.044 85.254 6.092C85.311 6.137 85.3545 6.194 85.3845 6.263L86.7705 10.4165C86.8005 10.5035 86.8275 10.598 86.8515 10.7C86.8785 10.799 86.9025 10.904 86.9235 11.015C86.9445 10.904 86.964 10.799 86.982 10.7C87.003 10.598 87.0255 10.5035 87.0495 10.4165L88.26 6.263C88.278 6.197 88.3185 6.14 88.3815 6.092C88.4475 6.044 88.524 6.02 88.611 6.02H89.4345ZM94.357 11.6495L94.3525 12.5H90.3115V6.02H94.3525V6.8705H91.369V8.8235H93.754V9.647H91.369V11.6495H94.357ZM97.378 9.125C97.618 9.125 97.828 9.0965 98.008 9.0395C98.188 8.9795 98.338 8.897 98.458 8.792C98.578 8.687 98.668 8.5625 98.728 8.4185C98.788 8.2715 98.818 8.1095 98.818 7.9325C98.818 7.5785 98.701 7.3085 98.467 7.1225C98.233 6.9365 97.879 6.8435 97.405 6.8435H96.55V9.125H97.378ZM100.429 12.5H99.4885C99.3025 12.5 99.1675 12.428 99.0835 12.284L97.5715 10.1015C97.5205 10.0265 97.465 9.9725 97.405 9.9395C97.345 9.9065 97.255 9.89 97.135 9.89H96.55V12.5H95.497V6.02H97.405C97.831 6.02 98.197 6.0635 98.503 6.1505C98.812 6.2375 99.0655 6.362 99.2635 6.524C99.4615 6.683 99.607 6.875 99.7 7.1C99.796 7.325 99.844 7.5755 99.844 7.8515C99.844 8.0765 99.8095 8.2865 99.7405 8.4815C99.6745 8.6765 99.577 8.8535 99.448 9.0125C99.322 9.1715 99.166 9.3095 98.98 9.4265C98.794 9.5435 98.5825 9.635 98.3455 9.701C98.4745 9.779 98.5855 9.8885 98.6785 10.0295L100.429 12.5Z"), A(n, "fill", "white"), A(e, "width", "106"), A(e, "height", "18"), A(e, "viewBox", "0 0 106 18"), A(e, "fill", "none"), A(e, "xmlns", "http://www.w3.org/2000/svg");
    },
    m(i, o) {
      ee(i, e, o), I(e, r), I(e, n);
    },
    p: Z,
    i: Z,
    o: Z,
    d(i) {
      i && ue(e);
    }
  };
}
class Ua extends Ot {
  constructor(e) {
    super(), Wt(
      this,
      {
        target: this.shadowRoot,
        props: Ut(this.attributes),
        customElement: !0
      },
      null,
      qu,
      Ct,
      {},
      null
    ), e && e.target && ee(e.target, this, e.anchor);
  }
}
customElements.define("nostr-opinion-approved", Ua);
function so(t, e, r) {
  const n = t.slice();
  return n[16] = e[r], n;
}
function Du(t) {
  let e, r, n, i, o, a = t[6][1] + "", u, s, f, c, l, h, d = t[6][0] + "", p, y, g, m, x, S, k = t[6][-1] + "", M, F, z, P, H, he, le, re, j, $, G, ie, Me, et, ve, tt, Ge, rt, ce, qe, Be, b, w, O, D, U, v, _, R, T;
  i = new Li({}), l = new Pi({}), x = new Hi({});
  let Y = t[2], L = [];
  for (let q = 0; q < Y.length; q += 1)
    L[q] = lo(so(t, Y, q));
  const J = (q) => ke(L[q], 1, 1, () => {
    L[q] = null;
  });
  let _e = !t[8] && co();
  return {
    c() {
      e = W("nav"), r = W("div"), n = W("span"), xt(i.$$.fragment), o = ne(), u = ge(a), s = ge(" positive"), f = ne(), c = W("span"), xt(l.$$.fragment), h = ne(), p = ge(d), y = ge(" neutral"), g = ne(), m = W("span"), xt(x.$$.fragment), S = ne(), M = ge(k), F = ge(" negative"), z = ne(), P = W("div"), H = W("button"), H.textContent = "Approved", he = ne(), le = W("button"), le.textContent = "All opinions", re = ne();
      for (let q = 0; q < L.length; q += 1)
        L[q].c();
      j = ne(), $ = W("h3"), $.textContent = "Create new opinion", G = ne(), ie = W("form"), Me = W("label"), Me.textContent = "Content", et = ne(), ve = W("input"), tt = ne(), Ge = W("label"), Ge.textContent = "Sentiment", rt = ne(), ce = W("select"), qe = W("option"), qe.textContent = "negative", Be = W("option"), Be.textContent = "neutral", b = W("option"), b.textContent = "positive", w = ne(), O = W("button"), D = ge("Submit"), v = ne(), _e && _e.c(), A(n, "class", "nav-count"), A(c, "class", "nav-count"), A(m, "class", "nav-count"), A(r, "class", "count-container"), A(H, "class", "blank-btn filter-btn"), A(H, "aria-label", "filter by approved"), Wr(H, "filter-active", t[7] === "approved"), A(le, "class", "blank-btn filter-btn"), A(le, "aria-label", "filter by all"), Wr(le, "filter-active", t[7] === "all"), A(P, "class", "filter-container"), A(e, "class", "top-nav"), A(Me, "for", "content"), A(ve, "id", "content"), A(ve, "type", "text"), A(Ge, "for", "sentiment"), qe.__value = "-1", qe.value = qe.__value, Be.__value = "0", Be.value = Be.__value, b.__value = "1", b.value = b.__value, A(ce, "name", "sentiment"), A(ce, "id", "sentiment"), t[4].sentiment === void 0 && un(() => t[15].call(ce)), A(O, "type", "submit"), O.disabled = U = !t[8];
    },
    m(q, K) {
      ee(q, e, K), I(e, r), I(r, n), ct(i, n, null), I(n, o), I(n, u), I(n, s), I(r, f), I(r, c), ct(l, c, null), I(c, h), I(c, p), I(c, y), I(r, g), I(r, m), ct(x, m, null), I(m, S), I(m, M), I(m, F), I(e, z), I(e, P), I(P, H), I(P, he), I(P, le), ee(q, re, K);
      for (let de = 0; de < L.length; de += 1)
        L[de].m(q, K);
      ee(q, j, K), ee(q, $, K), ee(q, G, K), ee(q, ie, K), I(ie, Me), I(ie, et), I(ie, ve), sn(ve, t[4].content), I(ie, tt), I(ie, Ge), I(ie, rt), I(ie, ce), I(ce, qe), I(ce, Be), I(ce, b), io(ce, t[4].sentiment), I(ie, w), I(ie, O), I(O, D), I(ie, v), _e && _e.m(ie, null), _ = !0, R || (T = [
        nt(H, "click", t[12]),
        nt(le, "click", t[13]),
        nt(ve, "input", t[14]),
        nt(ce, "change", t[15]),
        nt(ie, "submit", $a(t[9]))
      ], R = !0);
    },
    p(q, K) {
      if ((!_ || K & 64) && a !== (a = q[6][1] + "") && at(u, a), (!_ || K & 64) && d !== (d = q[6][0] + "") && at(p, d), (!_ || K & 64) && k !== (k = q[6][-1] + "") && at(M, k), (!_ || K & 128) && Wr(H, "filter-active", q[7] === "approved"), (!_ || K & 128) && Wr(le, "filter-active", q[7] === "all"), K & 13) {
        Y = q[2];
        let de;
        for (de = 0; de < Y.length; de += 1) {
          const Vt = so(q, Y, de);
          L[de] ? (L[de].p(Vt, K), be(L[de], 1)) : (L[de] = lo(Vt), L[de].c(), be(L[de], 1), L[de].m(j.parentNode, j));
        }
        for (ln(), de = Y.length; de < L.length; de += 1)
          J(de);
        cn();
      }
      K & 16 && ve.value !== q[4].content && sn(ve, q[4].content), K & 16 && io(ce, q[4].sentiment), (!_ || K & 256 && U !== (U = !q[8])) && (O.disabled = U), q[8] ? _e && (_e.d(1), _e = null) : _e || (_e = co(), _e.c(), _e.m(ie, null));
    },
    i(q) {
      if (!_) {
        be(i.$$.fragment, q), be(l.$$.fragment, q), be(x.$$.fragment, q);
        for (let K = 0; K < Y.length; K += 1)
          be(L[K]);
        _ = !0;
      }
    },
    o(q) {
      ke(i.$$.fragment, q), ke(l.$$.fragment, q), ke(x.$$.fragment, q), L = L.filter(Boolean);
      for (let K = 0; K < L.length; K += 1)
        ke(L[K]);
      _ = !1;
    },
    d(q) {
      q && ue(e), ht(i), ht(l), ht(x), q && ue(re), xu(L, q), q && ue(j), q && ue($), q && ue(G), q && ue(ie), _e && _e.d(), R = !1, _t(T);
    }
  };
}
function ju(t) {
  let e;
  return {
    c() {
      e = W("p"), e.textContent = "Loading...";
    },
    m(r, n) {
      ee(r, e, n);
    },
    p: Z,
    i: Z,
    o: Z,
    d(r) {
      r && ue(e);
    }
  };
}
function Nu(t) {
  let e, r;
  return e = new Li({}), {
    c() {
      xt(e.$$.fragment);
    },
    m(n, i) {
      ct(e, n, i), r = !0;
    },
    i(n) {
      r || (be(e.$$.fragment, n), r = !0);
    },
    o(n) {
      ke(e.$$.fragment, n), r = !1;
    },
    d(n) {
      ht(e, n);
    }
  };
}
function Fu(t) {
  let e, r;
  return e = new Pi({}), {
    c() {
      xt(e.$$.fragment);
    },
    m(n, i) {
      ct(e, n, i), r = !0;
    },
    i(n) {
      r || (be(e.$$.fragment, n), r = !0);
    },
    o(n) {
      ke(e.$$.fragment, n), r = !1;
    },
    d(n) {
      ht(e, n);
    }
  };
}
function $u(t) {
  let e, r;
  return e = new Hi({}), {
    c() {
      xt(e.$$.fragment);
    },
    m(n, i) {
      ct(e, n, i), r = !0;
    },
    i(n) {
      r || (be(e.$$.fragment, n), r = !0);
    },
    o(n) {
      ke(e.$$.fragment, n), r = !1;
    },
    d(n) {
      ht(e, n);
    }
  };
}
function uo(t) {
  let e, r = t[3][t[16].pubkey] + "", n;
  return {
    c() {
      e = W("strong"), n = ge(r);
    },
    m(i, o) {
      ee(i, e, o), I(e, n);
    },
    p(i, o) {
      o & 12 && r !== (r = i[3][i[16].pubkey] + "") && at(n, r);
    },
    d(i) {
      i && ue(e);
    }
  };
}
function fo(t) {
  let e, r;
  return e = new Ua({}), {
    c() {
      xt(e.$$.fragment);
    },
    m(n, i) {
      ct(e, n, i), r = !0;
    },
    i(n) {
      r || (be(e.$$.fragment, n), r = !0);
    },
    o(n) {
      ke(e.$$.fragment, n), r = !1;
    },
    d(n) {
      ht(e, n);
    }
  };
}
function lo(t) {
  let e, r, n, i, o, a, u, s, f, c = t[16].pubkey.slice(0, 7) + "", l, h, d = t[0].trustedAuthors.includes(t[16].pubkey), p, y, g = new Date(t[16].created_at * 1e3).toLocaleDateString() + "", m, x, S, k = t[16].content + "", M, F, z, P;
  const H = [$u, Fu, Nu], he = [];
  function le($, G) {
    return G & 4 && (i = null), G & 4 && (o = null), i == null && (i = $[16].tags.find(Wu)?.[1] === "-1"), i ? 0 : (o == null && (o = $[16].tags.find(zu)?.[1] === "0"), o ? 1 : 2);
  }
  a = le(t, -1), u = he[a] = H[a](t);
  let re = t[3][t[16].pubkey] && uo(t), j = d && fo();
  return {
    c() {
      e = W("div"), r = W("div"), n = W("p"), u.c(), s = ne(), re && re.c(), f = ne(), l = ge(c), h = ne(), j && j.c(), p = ne(), y = W("p"), m = ge(g), x = ne(), S = W("p"), M = ge(k), F = ne(), z = W("hr"), A(n, "class", "pubkey"), A(y, "class", "date"), A(r, "class", "opinion-top"), A(S, "class", "content"), A(e, "class", "opinion-container");
    },
    m($, G) {
      ee($, e, G), I(e, r), I(r, n), he[a].m(n, null), I(n, s), re && re.m(n, null), I(n, f), I(n, l), I(n, h), j && j.m(n, null), I(r, p), I(r, y), I(y, m), I(e, x), I(e, S), I(S, M), ee($, F, G), ee($, z, G), P = !0;
    },
    p($, G) {
      let ie = a;
      a = le($, G), a !== ie && (ln(), ke(he[ie], 1, 1, () => {
        he[ie] = null;
      }), cn(), u = he[a], u || (u = he[a] = H[a]($), u.c()), be(u, 1), u.m(n, s)), $[3][$[16].pubkey] ? re ? re.p($, G) : (re = uo($), re.c(), re.m(n, f)) : re && (re.d(1), re = null), (!P || G & 4) && c !== (c = $[16].pubkey.slice(0, 7) + "") && at(l, c), G & 5 && (d = $[0].trustedAuthors.includes($[16].pubkey)), d ? j ? G & 5 && be(j, 1) : (j = fo(), j.c(), be(j, 1), j.m(n, null)) : j && (ln(), ke(j, 1, 1, () => {
        j = null;
      }), cn()), (!P || G & 4) && g !== (g = new Date($[16].created_at * 1e3).toLocaleDateString() + "") && at(m, g), (!P || G & 4) && k !== (k = $[16].content + "") && at(M, k);
    },
    i($) {
      P || (be(u), be(j), P = !0);
    },
    o($) {
      ke(u), ke(j), P = !1;
    },
    d($) {
      $ && ue(e), he[a].d(), re && re.d(), j && j.d(), $ && ue(F), $ && ue(z);
    }
  };
}
function co(t) {
  let e;
  return {
    c() {
      e = W("span"), e.textContent = "not logged in";
    },
    m(r, n) {
      ee(r, e, n);
    },
    d(r) {
      r && ue(e);
    }
  };
}
function Uu(t) {
  let e, r, n = (t[1]?.length || "0") + "", i, o, a, u, s, f, c, l, h;
  const d = [ju, Du], p = [];
  function y(g, m) {
    return g[5] ? 0 : 1;
  }
  return f = y(t), c = p[f] = d[f](t), {
    c() {
      e = W("h1"), r = ge("Community opinions ("), i = ge(n), o = ge(")"), a = ne(), u = W("p"), u.textContent = `These comments are contributed by members of the Wallet Scrutiny community like you. Thank you for
	helping review wallets for security issues and enabling more people to secure and custody their
	bitcoin.`, s = ne(), c.c(), l = Eu(), this.c = Z, A(u, "class", "description");
    },
    m(g, m) {
      ee(g, e, m), I(e, r), I(e, i), I(e, o), ee(g, a, m), ee(g, u, m), ee(g, s, m), p[f].m(g, m), ee(g, l, m), h = !0;
    },
    p(g, [m]) {
      (!h || m & 2) && n !== (n = (g[1]?.length || "0") + "") && at(i, n);
      let x = f;
      f = y(g), f === x ? p[f].p(g, m) : (ln(), ke(p[x], 1, 1, () => {
        p[x] = null;
      }), cn(), c = p[f], c ? c.p(g, m) : (c = p[f] = d[f](g), c.c()), be(c, 1), c.m(l.parentNode, l));
    },
    i(g) {
      h || (be(c), h = !0);
    },
    o(g) {
      ke(c), h = !1;
    },
    d(g) {
      g && ue(e), g && ue(a), g && ue(u), g && ue(s), p[f].d(g), g && ue(l);
    }
  };
}
const Wu = (t) => t[0] === "sentiment", zu = (t) => t[0] === "sentiment";
function Vu(t, e, r) {
  let n;
  Fa(t, Dt, (S) => r(8, n = S));
  let { name: i } = e, o, a = [], u = [], s = {}, f = { content: "", sentiment: "0" }, c = !0, l = { "-1": 0, 0: 0, 1: 0 }, h = "approved";
  const d = async () => {
    if (!f.content || !n)
      return;
    const S = {
      kind: 30234,
      content: f.content,
      tags: [["d", i], ["sentiment", f.sentiment]],
      pubkey: n.pubkey,
      created_at: Math.floor(Date.now() / 1e3)
    };
    await o.nostr.publish(S, () => {
      const k = a.findIndex((M) => M.pubkey === S.pubkey);
      k !== -1 ? r(1, a[k] = S, a) : r(1, a = [S, ...a]), p();
    });
  }, p = () => {
    r(6, l = { "-1": 0, 0: 0, 1: 0 }), r(2, u = a.filter((S) => {
      if (h === "approved" && !o.trustedAuthors.includes(S.pubkey))
        return !1;
      const k = S.tags.find((M) => M[0] === "sentiment")?.[1];
      return k && r(6, l[k] += 1, l), !0;
    })), r(2, u = u.sort((S, k) => {
      const M = o.trustedAuthors.includes(S.pubkey), F = o.trustedAuthors.includes(k.pubkey);
      return M && !F ? -1 : !M && F ? 1 : S.created_at > k.created_at ? -1 : S.created_at < k.created_at ? 1 : 0;
    }));
  };
  Ou(async () => {
    r(0, o = (await Promise.resolve().then(() => Zd)).expertOpinions), await o.onReady, r(5, c = !1);
    const S = o.nostr.sub(
      {
        cb: (k) => {
          r(1, a = [...a, k]);
          let M = o.nostr.sub(
            {
              cb: (F) => {
                const z = JSON.parse(F.content);
                r(3, s[k.pubkey] = z.name, s);
              },
              filter: {
                kinds: [0],
                authors: [k.pubkey],
                limit: 1
              }
            },
            null,
            () => {
              M.unsub();
            }
          );
        },
        filter: { kinds: [30234], "#d": [i] }
      },
      null,
      () => {
        p(), S.unsub();
      }
    );
  });
  const y = () => r(7, h = "approved") && p(), g = () => r(7, h = "all") && p();
  function m() {
    f.content = this.value, r(4, f);
  }
  function x() {
    f.sentiment = Ru(this), r(4, f);
  }
  return t.$$set = (S) => {
    "name" in S && r(11, i = S.name);
  }, [
    o,
    a,
    u,
    s,
    f,
    c,
    l,
    h,
    n,
    d,
    p,
    i,
    y,
    g,
    m,
    x
  ];
}
class Gu extends Ot {
  constructor(e) {
    super(), this.shadowRoot.innerHTML = "<style>:host{--border-color:#dedede;--content-text-color:#606060;--pubkey-text-color:#000000;--date-text-color:#808080;--description-text-color:#808080;--filter-active-color:#000000;--filter-inactive-color:#808080;font-family:'Lato'}h1{margin:5px 0}hr{height:1px;background-color:var(--border-color);border:none}.content{color:var(--content-text-color);margin:2px 0 10px 0}.pubkey{color:var(--pubkey-text-color);font-weight:600;display:flex;align-items:center;gap:10px;margin:2px 0}.date{font-style:italic;color:var(--date-text-color)}.top-nav{display:flex;justify-content:space-between;border-top:var(--border-color) 1px solid;border-bottom:var(--border-color) 1px solid;padding:20px 0}.nav-count{display:flex;align-items:center}.count-container{display:flex;flex-direction:row;color:var(--content-text-color)}.opinion-top{display:flex;justify-content:space-between}.description{color:var(--description-text-color);margin:10px 0}.blank-btn{background-color:transparent;border:none;cursor:pointer}.filter-container{display:flex;flex-direction:row}.filter-container>.filter-active{color:var(--filter-active-color)}.filter-btn{color:var(--filter-inactive-color)}</style>", Wt(
      this,
      {
        target: this.shadowRoot,
        props: Ut(this.attributes),
        customElement: !0
      },
      Vu,
      Uu,
      Ct,
      { name: 11 },
      null
    ), e && (e.target && ee(e.target, this, e.anchor), e.props && (this.$set(e.props), fn()));
  }
  static get observedAttributes() {
    return ["name"];
  }
  get name() {
    return this.$$.ctx[11];
  }
  set name(e) {
    this.$$set({ name: e }), fn();
  }
}
customElements.define("nostr-opinion", Gu);
const Yu = {}, Zu = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Yu
}, Symbol.toStringTag, { value: "Module" }));
/*! noble-secp256k1 - MIT License (c) 2019 Paul Miller (paulmillr.com) */
const V = BigInt(0), se = BigInt(1), lt = BigInt(2), Cr = BigInt(3), Ku = BigInt(8), oe = Object.freeze({
  a: V,
  b: BigInt(7),
  P: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),
  n: BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),
  h: se,
  Gx: BigInt("55066263022277343669578718895168534326250603453777594175500187360389116729240"),
  Gy: BigInt("32670510020758816978083085130507043184471273380659243275938904335757337482424"),
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee")
});
function ho(t) {
  const { a: e, b: r } = oe, n = B(t * t), i = B(n * t);
  return B(i + e * t + r);
}
const Vr = oe.a === V;
class Wa extends Error {
  constructor(e) {
    super(e);
  }
}
class X {
  constructor(e, r, n) {
    this.x = e, this.y = r, this.z = n;
  }
  static fromAffine(e) {
    if (!(e instanceof ae))
      throw new TypeError("JacobianPoint#fromAffine: expected Point");
    return new X(e.x, e.y, se);
  }
  static toAffineBatch(e) {
    const r = tf(e.map((n) => n.z));
    return e.map((n, i) => n.toAffine(r[i]));
  }
  static normalizeZ(e) {
    return X.toAffineBatch(e).map(X.fromAffine);
  }
  equals(e) {
    if (!(e instanceof X))
      throw new TypeError("JacobianPoint expected");
    const { x: r, y: n, z: i } = this, { x: o, y: a, z: u } = e, s = B(i * i), f = B(u * u), c = B(r * f), l = B(o * s), h = B(B(n * u) * f), d = B(B(a * i) * s);
    return c === l && h === d;
  }
  negate() {
    return new X(this.x, B(-this.y), this.z);
  }
  double() {
    const { x: e, y: r, z: n } = this, i = B(e * e), o = B(r * r), a = B(o * o), u = e + o, s = B(lt * (B(u * u) - i - a)), f = B(Cr * i), c = B(f * f), l = B(c - lt * s), h = B(f * (s - l) - Ku * a), d = B(lt * r * n);
    return new X(l, h, d);
  }
  add(e) {
    if (!(e instanceof X))
      throw new TypeError("JacobianPoint expected");
    const { x: r, y: n, z: i } = this, { x: o, y: a, z: u } = e;
    if (o === V || a === V)
      return this;
    if (r === V || n === V)
      return e;
    const s = B(i * i), f = B(u * u), c = B(r * f), l = B(o * s), h = B(B(n * u) * f), d = B(B(a * i) * s), p = B(l - c), y = B(d - h);
    if (p === V)
      return y === V ? this.double() : X.ZERO;
    const g = B(p * p), m = B(p * g), x = B(c * g), S = B(y * y - m - lt * x), k = B(y * (x - S) - h * m), M = B(i * u * p);
    return new X(S, k, M);
  }
  subtract(e) {
    return this.add(e.negate());
  }
  multiplyUnsafe(e) {
    const r = X.ZERO;
    if (typeof e == "bigint" && e === V)
      return r;
    let n = vo(e);
    if (n === se)
      return this;
    if (!Vr) {
      let l = r, h = this;
      for (; n > V; )
        n & se && (l = l.add(h)), h = h.double(), n >>= se;
      return l;
    }
    let { k1neg: i, k1: o, k2neg: a, k2: u } = go(n), s = r, f = r, c = this;
    for (; o > V || u > V; )
      o & se && (s = s.add(c)), u & se && (f = f.add(c)), c = c.double(), o >>= se, u >>= se;
    return i && (s = s.negate()), a && (f = f.negate()), f = new X(B(f.x * oe.beta), f.y, f.z), s.add(f);
  }
  precomputeWindow(e) {
    const r = Vr ? 128 / e + 1 : 256 / e + 1, n = [];
    let i = this, o = i;
    for (let a = 0; a < r; a++) {
      o = i, n.push(o);
      for (let u = 1; u < 2 ** (e - 1); u++)
        o = o.add(i), n.push(o);
      i = o.double();
    }
    return n;
  }
  wNAF(e, r) {
    !r && this.equals(X.BASE) && (r = ae.BASE);
    const n = r && r._WINDOW_SIZE || 1;
    if (256 % n)
      throw new Error("Point#wNAF: Invalid precomputation window, must be power of 2");
    let i = r && xi.get(r);
    i || (i = this.precomputeWindow(n), r && n !== 1 && (i = X.normalizeZ(i), xi.set(r, i)));
    let o = X.ZERO, a = X.ZERO;
    const u = 1 + (Vr ? 128 / n : 256 / n), s = 2 ** (n - 1), f = BigInt(2 ** n - 1), c = 2 ** n, l = BigInt(n);
    for (let h = 0; h < u; h++) {
      const d = h * s;
      let p = Number(e & f);
      if (e >>= l, p > s && (p -= c, e += se), p === 0) {
        let y = i[d];
        h % 2 && (y = y.negate()), a = a.add(y);
      } else {
        let y = i[d + Math.abs(p) - 1];
        p < 0 && (y = y.negate()), o = o.add(y);
      }
    }
    return { p: o, f: a };
  }
  multiply(e, r) {
    let n = vo(e), i, o;
    if (Vr) {
      const { k1neg: a, k1: u, k2neg: s, k2: f } = go(n);
      let { p: c, f: l } = this.wNAF(u, r), { p: h, f: d } = this.wNAF(f, r);
      a && (c = c.negate()), s && (h = h.negate()), h = new X(B(h.x * oe.beta), h.y, h.z), i = c.add(h), o = l.add(d);
    } else {
      const { p: a, f: u } = this.wNAF(n, r);
      i = a, o = u;
    }
    return X.normalizeZ([i, o])[0];
  }
  toAffine(e = wn(this.z)) {
    const { x: r, y: n, z: i } = this, o = e, a = B(o * o), u = B(a * o), s = B(r * a), f = B(n * u);
    if (B(i * o) !== se)
      throw new Error("invZ was invalid");
    return new ae(s, f);
  }
}
X.BASE = new X(oe.Gx, oe.Gy, se);
X.ZERO = new X(V, se, V);
const xi = /* @__PURE__ */ new WeakMap();
class ae {
  constructor(e, r) {
    this.x = e, this.y = r;
  }
  _setWindowSize(e) {
    this._WINDOW_SIZE = e, xi.delete(this);
  }
  hasEvenY() {
    return this.y % lt === V;
  }
  static fromCompressedHex(e) {
    const r = e.length === 32, n = Ne(r ? e : e.subarray(1));
    if (!rn(n))
      throw new Error("Point is not on curve");
    const i = ho(n);
    let o = ef(i);
    const a = (o & se) === se;
    r ? a && (o = B(-o)) : (e[0] & 1) === 1 !== a && (o = B(-o));
    const u = new ae(n, o);
    return u.assertValidity(), u;
  }
  static fromUncompressedHex(e) {
    const r = Ne(e.subarray(1, 33)), n = Ne(e.subarray(33, 65)), i = new ae(r, n);
    return i.assertValidity(), i;
  }
  static fromHex(e) {
    const r = St(e), n = r.length, i = r[0];
    if (n === 32 || n === 33 && (i === 2 || i === 3))
      return this.fromCompressedHex(r);
    if (n === 65 && i === 4)
      return this.fromUncompressedHex(r);
    throw new Error(`Point.fromHex: received invalid point. Expected 32-33 compressed bytes or 65 uncompressed bytes, not ${n}`);
  }
  static fromPrivateKey(e) {
    return ae.BASE.multiply(Br(e));
  }
  static fromSignature(e, r, n) {
    e = St(e);
    const i = nf(e), { r: o, s: a } = af(r);
    if (n !== 0 && n !== 1)
      throw new Error("Cannot recover signature: invalid recovery bit");
    const u = n & 1 ? "03" : "02", s = ae.fromHex(u + dt(o)), { n: f } = oe, c = wn(o, f), l = B(-i * c, f), h = B(a * c, f), d = ae.BASE.multiplyAndAddUnsafe(s, l, h);
    if (!d)
      throw new Error("Cannot recover signature: point at infinify");
    return d.assertValidity(), d;
  }
  toRawBytes(e = !1) {
    return pt(this.toHex(e));
  }
  toHex(e = !1) {
    const r = dt(this.x);
    return e ? `${this.hasEvenY() ? "02" : "03"}${r}` : `04${r}${dt(this.y)}`;
  }
  toHexX() {
    return this.toHex(!0).slice(2);
  }
  toRawX() {
    return this.toRawBytes(!0).slice(1);
  }
  assertValidity() {
    const e = "Point is not on elliptic curve", { x: r, y: n } = this;
    if (!rn(r) || !rn(n))
      throw new Error(e);
    const i = B(n * n), o = ho(r);
    if (B(i - o) !== V)
      throw new Error(e);
  }
  equals(e) {
    return this.x === e.x && this.y === e.y;
  }
  negate() {
    return new ae(this.x, B(-this.y));
  }
  double() {
    return X.fromAffine(this).double().toAffine();
  }
  add(e) {
    return X.fromAffine(this).add(X.fromAffine(e)).toAffine();
  }
  subtract(e) {
    return this.add(e.negate());
  }
  multiply(e) {
    return X.fromAffine(this).multiply(e, this).toAffine();
  }
  multiplyAndAddUnsafe(e, r, n) {
    const i = X.fromAffine(this), o = r === V || r === se || this !== ae.BASE ? i.multiplyUnsafe(r) : i.multiply(r), a = X.fromAffine(e).multiplyUnsafe(n), u = o.add(a);
    return u.equals(X.ZERO) ? void 0 : u.toAffine();
  }
}
ae.BASE = new ae(oe.Gx, oe.Gy);
ae.ZERO = new ae(V, V);
function po(t) {
  return Number.parseInt(t[0], 16) >= 8 ? "00" + t : t;
}
function _o(t) {
  if (t.length < 2 || t[0] !== 2)
    throw new Error(`Invalid signature integer tag: ${jt(t)}`);
  const e = t[1], r = t.subarray(2, e + 2);
  if (!e || r.length !== e)
    throw new Error("Invalid signature integer: wrong length");
  if (r[0] === 0 && r[1] <= 127)
    throw new Error("Invalid signature integer: trailing length");
  return { data: Ne(r), left: t.subarray(e + 2) };
}
function Xu(t) {
  if (t.length < 2 || t[0] != 48)
    throw new Error(`Invalid signature tag: ${jt(t)}`);
  if (t[1] !== t.length - 2)
    throw new Error("Invalid signature: incorrect length");
  const { data: e, left: r } = _o(t.subarray(2)), { data: n, left: i } = _o(r);
  if (i.length)
    throw new Error(`Invalid signature: left bytes after parsing: ${jt(i)}`);
  return { r: e, s: n };
}
class Et {
  constructor(e, r) {
    this.r = e, this.s = r, this.assertValidity();
  }
  static fromCompact(e) {
    const r = e instanceof Uint8Array, n = "Signature.fromCompact";
    if (typeof e != "string" && !r)
      throw new TypeError(`${n}: Expected string or Uint8Array`);
    const i = r ? jt(e) : e;
    if (i.length !== 128)
      throw new Error(`${n}: Expected 64-byte hex`);
    return new Et(hn(i.slice(0, 64)), hn(i.slice(64, 128)));
  }
  static fromDER(e) {
    const r = e instanceof Uint8Array;
    if (typeof e != "string" && !r)
      throw new TypeError("Signature.fromDER: Expected string or Uint8Array");
    const { r: n, s: i } = Xu(r ? e : pt(e));
    return new Et(n, i);
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
    const e = oe.n >> se;
    return this.s > e;
  }
  normalizeS() {
    return this.hasHighS() ? new Et(this.r, oe.n - this.s) : this;
  }
  toDERRawBytes(e = !1) {
    return pt(this.toDERHex(e));
  }
  toDERHex(e = !1) {
    const r = po(Zt(this.s));
    if (e)
      return r;
    const n = po(Zt(this.r)), i = Zt(n.length / 2), o = Zt(r.length / 2);
    return `30${Zt(n.length / 2 + r.length / 2 + 4)}02${i}${n}02${o}${r}`;
  }
  toRawBytes() {
    return this.toDERRawBytes();
  }
  toHex() {
    return this.toDERHex();
  }
  toCompactRawBytes() {
    return pt(this.toCompactHex());
  }
  toCompactHex() {
    return dt(this.r) + dt(this.s);
  }
}
function Yt(...t) {
  if (!t.every((n) => n instanceof Uint8Array))
    throw new Error("Uint8Array list expected");
  if (t.length === 1)
    return t[0];
  const e = t.reduce((n, i) => n + i.length, 0), r = new Uint8Array(e);
  for (let n = 0, i = 0; n < t.length; n++) {
    const o = t[n];
    r.set(o, i), i += o.length;
  }
  return r;
}
const Qu = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function jt(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Expected Uint8Array");
  let e = "";
  for (let r = 0; r < t.length; r++)
    e += Qu[t[r]];
  return e;
}
const Ju = BigInt("0x10000000000000000000000000000000000000000000000000000000000000000");
function dt(t) {
  if (typeof t != "bigint")
    throw new Error("Expected bigint");
  if (!(V <= t && t < Ju))
    throw new Error("Expected number < 2^256");
  return t.toString(16).padStart(64, "0");
}
function Ir(t) {
  const e = pt(dt(t));
  if (e.length !== 32)
    throw new Error("Error: expected 32 bytes");
  return e;
}
function Zt(t) {
  const e = t.toString(16);
  return e.length & 1 ? `0${e}` : e;
}
function hn(t) {
  if (typeof t != "string")
    throw new TypeError("hexToNumber: expected string, got " + typeof t);
  return BigInt(`0x${t}`);
}
function pt(t) {
  if (typeof t != "string")
    throw new TypeError("hexToBytes: expected string, got " + typeof t);
  if (t.length % 2)
    throw new Error("hexToBytes: received invalid unpadded hex" + t.length);
  const e = new Uint8Array(t.length / 2);
  for (let r = 0; r < e.length; r++) {
    const n = r * 2, i = t.slice(n, n + 2), o = Number.parseInt(i, 16);
    if (Number.isNaN(o) || o < 0)
      throw new Error("Invalid byte sequence");
    e[r] = o;
  }
  return e;
}
function Ne(t) {
  return hn(jt(t));
}
function St(t) {
  return t instanceof Uint8Array ? Uint8Array.from(t) : pt(t);
}
function vo(t) {
  if (typeof t == "number" && Number.isSafeInteger(t) && t > 0)
    return BigInt(t);
  if (typeof t == "bigint" && Tr(t))
    return t;
  throw new TypeError("Expected valid private scalar: 0 < scalar < curve.n");
}
function B(t, e = oe.P) {
  const r = t % e;
  return r >= V ? r : e + r;
}
function De(t, e) {
  const { P: r } = oe;
  let n = t;
  for (; e-- > V; )
    n *= n, n %= r;
  return n;
}
function ef(t) {
  const { P: e } = oe, r = BigInt(6), n = BigInt(11), i = BigInt(22), o = BigInt(23), a = BigInt(44), u = BigInt(88), s = t * t * t % e, f = s * s * t % e, c = De(f, Cr) * f % e, l = De(c, Cr) * f % e, h = De(l, lt) * s % e, d = De(h, n) * h % e, p = De(d, i) * d % e, y = De(p, a) * p % e, g = De(y, u) * y % e, m = De(g, a) * p % e, x = De(m, Cr) * f % e, S = De(x, o) * d % e, k = De(S, r) * s % e;
  return De(k, lt);
}
function wn(t, e = oe.P) {
  if (t === V || e <= V)
    throw new Error(`invert: expected positive integers, got n=${t} mod=${e}`);
  let r = B(t, e), n = e, i = V, o = se;
  for (; r !== V; ) {
    const u = n / r, s = n % r, f = i - o * u;
    n = r, r = s, i = o, o = f;
  }
  if (n !== se)
    throw new Error("invert: does not exist");
  return B(i, e);
}
function tf(t, e = oe.P) {
  const r = new Array(t.length), n = t.reduce((o, a, u) => a === V ? o : (r[u] = o, B(o * a, e)), se), i = wn(n, e);
  return t.reduceRight((o, a, u) => a === V ? o : (r[u] = B(o * r[u], e), B(o * a, e)), i), r;
}
const yo = (t, e) => (t + e / lt) / e, rf = {
  a1: BigInt("0x3086d221a7d46bcde86c90e49284eb15"),
  b1: -se * BigInt("0xe4437ed6010e88286f547fa90abfe4c3"),
  a2: BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"),
  b2: BigInt("0x3086d221a7d46bcde86c90e49284eb15"),
  POW_2_128: BigInt("0x100000000000000000000000000000000")
};
function go(t) {
  const { n: e } = oe, { a1: r, b1: n, a2: i, b2: o, POW_2_128: a } = rf, u = yo(o * t, e), s = yo(-n * t, e);
  let f = B(t - u * r - s * i, e), c = B(-u * n - s * o, e);
  const l = f > a, h = c > a;
  if (l && (f = e - f), h && (c = e - c), f > a || c > a)
    throw new Error("splitScalarEndo: Endomorphism failed, k=" + t);
  return { k1neg: l, k1: f, k2neg: h, k2: c };
}
function nf(t) {
  const { n: e } = oe, n = t.length * 8 - 256;
  let i = Ne(t);
  return n > 0 && (i = i >> BigInt(n)), i >= e && (i -= e), i;
}
let Pt, zn;
function Tr(t) {
  return V < t && t < oe.n;
}
function rn(t) {
  return V < t && t < oe.P;
}
function Br(t) {
  let e;
  if (typeof t == "bigint")
    e = t;
  else if (typeof t == "number" && Number.isSafeInteger(t) && t > 0)
    e = BigInt(t);
  else if (typeof t == "string") {
    if (t.length !== 64)
      throw new Error("Expected 32 bytes of private key");
    e = hn(t);
  } else if (t instanceof Uint8Array) {
    if (t.length !== 32)
      throw new Error("Expected 32 bytes of private key");
    e = Ne(t);
  } else
    throw new TypeError("Expected valid private key");
  if (!Tr(e))
    throw new Error("Expected private key: 0 < key < n");
  return e;
}
function of(t) {
  return t instanceof ae ? (t.assertValidity(), t) : ae.fromHex(t);
}
function af(t) {
  if (t instanceof Et)
    return t.assertValidity(), t;
  try {
    return Et.fromDER(t);
  } catch {
    return Et.fromCompact(t);
  }
}
function dn(t) {
  return B(Ne(t), oe.n);
}
class Nt {
  constructor(e, r) {
    this.r = e, this.s = r, this.assertValidity();
  }
  static fromHex(e) {
    const r = St(e);
    if (r.length !== 64)
      throw new TypeError(`SchnorrSignature.fromHex: expected 64 bytes, not ${r.length}`);
    const n = Ne(r.subarray(0, 32)), i = Ne(r.subarray(32, 64));
    return new Nt(n, i);
  }
  assertValidity() {
    const { r: e, s: r } = this;
    if (!rn(e) || !Tr(r))
      throw new Error("Invalid signature");
  }
  toHex() {
    return dt(this.r) + dt(this.s);
  }
  toRawBytes() {
    return pt(this.toHex());
  }
}
function sf(t) {
  return ae.fromPrivateKey(t).toRawX();
}
class za {
  constructor(e, r, n = Ue.randomBytes()) {
    if (e == null)
      throw new TypeError(`sign: Expected valid message, not "${e}"`);
    this.m = St(e);
    const { x: i, scalar: o } = this.getScalar(Br(r));
    if (this.px = i, this.d = o, this.rand = St(n), this.rand.length !== 32)
      throw new TypeError("sign: Expected 32 bytes of aux randomness");
  }
  getScalar(e) {
    const r = ae.fromPrivateKey(e), n = r.hasEvenY() ? e : oe.n - e;
    return { point: r, scalar: n, x: r.toRawX() };
  }
  initNonce(e, r) {
    return Ir(e ^ Ne(r));
  }
  finalizeNonce(e) {
    const r = B(Ne(e), oe.n);
    if (r === V)
      throw new Error("sign: Creation of signature failed. k is zero");
    const { point: n, x: i, scalar: o } = this.getScalar(r);
    return { R: n, rx: i, k: o };
  }
  finalizeSig(e, r, n, i) {
    return new Nt(e.x, B(r + n * i, oe.n)).toRawBytes();
  }
  error() {
    throw new Error("sign: Invalid signature produced");
  }
  async calc() {
    const { m: e, d: r, px: n, rand: i } = this, o = Ue.taggedHash, a = this.initNonce(r, await o(ft.aux, i)), { R: u, rx: s, k: f } = this.finalizeNonce(await o(ft.nonce, a, n, e)), c = dn(await o(ft.challenge, s, n, e)), l = this.finalizeSig(u, f, c, r);
    return await Ya(l, e, n) || this.error(), l;
  }
  calcSync() {
    const { m: e, d: r, px: n, rand: i } = this, o = Ue.taggedHashSync, a = this.initNonce(r, o(ft.aux, i)), { R: u, rx: s, k: f } = this.finalizeNonce(o(ft.nonce, a, n, e)), c = dn(o(ft.challenge, s, n, e)), l = this.finalizeSig(u, f, c, r);
    return Za(l, e, n) || this.error(), l;
  }
}
async function uf(t, e, r) {
  return new za(t, e, r).calc();
}
function ff(t, e, r) {
  return new za(t, e, r).calcSync();
}
function Va(t, e, r) {
  const n = t instanceof Nt, i = n ? t : Nt.fromHex(t);
  return n && i.assertValidity(), {
    ...i,
    m: St(e),
    P: of(r)
  };
}
function Ga(t, e, r, n) {
  const i = ae.BASE.multiplyAndAddUnsafe(e, Br(r), B(-n, oe.n));
  return !(!i || !i.hasEvenY() || i.x !== t);
}
async function Ya(t, e, r) {
  try {
    const { r: n, s: i, m: o, P: a } = Va(t, e, r), u = dn(await Ue.taggedHash(ft.challenge, Ir(n), a.toRawX(), o));
    return Ga(n, a, i, u);
  } catch {
    return !1;
  }
}
function Za(t, e, r) {
  try {
    const { r: n, s: i, m: o, P: a } = Va(t, e, r), u = dn(Ue.taggedHashSync(ft.challenge, Ir(n), a.toRawX(), o));
    return Ga(n, a, i, u);
  } catch (n) {
    if (n instanceof Wa)
      throw n;
    return !1;
  }
}
const qi = {
  Signature: Nt,
  getPublicKey: sf,
  sign: uf,
  verify: Ya,
  signSync: ff,
  verifySync: Za
};
ae.BASE._setWindowSize(8);
const Le = {
  node: Zu,
  web: typeof self == "object" && "crypto" in self ? self.crypto : void 0
}, ft = {
  challenge: "BIP0340/challenge",
  aux: "BIP0340/aux",
  nonce: "BIP0340/nonce"
}, Gr = {}, Ue = {
  bytesToHex: jt,
  hexToBytes: pt,
  concatBytes: Yt,
  mod: B,
  invert: wn,
  isValidPrivateKey(t) {
    try {
      return Br(t), !0;
    } catch {
      return !1;
    }
  },
  _bigintTo32Bytes: Ir,
  _normalizePrivateKey: Br,
  hashToPrivateKey: (t) => {
    if (t = St(t), t.length < 40 || t.length > 1024)
      throw new Error("Expected 40-1024 bytes of private key as per FIPS 186");
    const e = B(Ne(t), oe.n - se) + se;
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
  randomPrivateKey: () => Ue.hashToPrivateKey(Ue.randomBytes(40)),
  sha256: async (...t) => {
    if (Le.web) {
      const e = await Le.web.subtle.digest("SHA-256", Yt(...t));
      return new Uint8Array(e);
    } else if (Le.node) {
      const { createHash: e } = Le.node, r = e("sha256");
      return t.forEach((n) => r.update(n)), Uint8Array.from(r.digest());
    } else
      throw new Error("The environment doesn't have sha256 function");
  },
  hmacSha256: async (t, ...e) => {
    if (Le.web) {
      const r = await Le.web.subtle.importKey("raw", t, { name: "HMAC", hash: { name: "SHA-256" } }, !1, ["sign"]), n = Yt(...e), i = await Le.web.subtle.sign("HMAC", r, n);
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
      const n = await Ue.sha256(Uint8Array.from(t, (i) => i.charCodeAt(0)));
      r = Yt(n, n), Gr[t] = r;
    }
    return Ue.sha256(r, ...e);
  },
  taggedHashSync: (t, ...e) => {
    if (typeof Pt != "function")
      throw new Wa("sha256Sync is undefined, you need to set it");
    let r = Gr[t];
    if (r === void 0) {
      const n = Pt(Uint8Array.from(t, (i) => i.charCodeAt(0)));
      r = Yt(n, n), Gr[t] = r;
    }
    return Pt(r, ...e);
  },
  precompute(t = 8, e = ae.BASE) {
    const r = e === ae.BASE ? e : new ae(e.x, e.y);
    return r._setWindowSize(t), r.multiply(Cr), r;
  }
};
Object.defineProperties(Ue, {
  sha256Sync: {
    configurable: !1,
    get() {
      return Pt;
    },
    set(t) {
      Pt || (Pt = t);
    }
  },
  hmacSha256Sync: {
    configurable: !1,
    get() {
      return zn;
    },
    set(t) {
      zn || (zn = t);
    }
  }
});
const Ei = typeof global < "u" ? global : typeof self < "u" ? self : typeof window < "u" ? window : {};
var Ke = [], je = [], lf = typeof Uint8Array < "u" ? Uint8Array : Array, Di = !1;
function Ka() {
  Di = !0;
  for (var t = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", e = 0, r = t.length; e < r; ++e)
    Ke[e] = t[e], je[t.charCodeAt(e)] = e;
  je["-".charCodeAt(0)] = 62, je["_".charCodeAt(0)] = 63;
}
function cf(t) {
  Di || Ka();
  var e, r, n, i, o, a, u = t.length;
  if (u % 4 > 0)
    throw new Error("Invalid string. Length must be a multiple of 4");
  o = t[u - 2] === "=" ? 2 : t[u - 1] === "=" ? 1 : 0, a = new lf(u * 3 / 4 - o), n = o > 0 ? u - 4 : u;
  var s = 0;
  for (e = 0, r = 0; e < n; e += 4, r += 3)
    i = je[t.charCodeAt(e)] << 18 | je[t.charCodeAt(e + 1)] << 12 | je[t.charCodeAt(e + 2)] << 6 | je[t.charCodeAt(e + 3)], a[s++] = i >> 16 & 255, a[s++] = i >> 8 & 255, a[s++] = i & 255;
  return o === 2 ? (i = je[t.charCodeAt(e)] << 2 | je[t.charCodeAt(e + 1)] >> 4, a[s++] = i & 255) : o === 1 && (i = je[t.charCodeAt(e)] << 10 | je[t.charCodeAt(e + 1)] << 4 | je[t.charCodeAt(e + 2)] >> 2, a[s++] = i >> 8 & 255, a[s++] = i & 255), a;
}
function hf(t) {
  return Ke[t >> 18 & 63] + Ke[t >> 12 & 63] + Ke[t >> 6 & 63] + Ke[t & 63];
}
function df(t, e, r) {
  for (var n, i = [], o = e; o < r; o += 3)
    n = (t[o] << 16) + (t[o + 1] << 8) + t[o + 2], i.push(hf(n));
  return i.join("");
}
function bo(t) {
  Di || Ka();
  for (var e, r = t.length, n = r % 3, i = "", o = [], a = 16383, u = 0, s = r - n; u < s; u += a)
    o.push(df(t, u, u + a > s ? s : u + a));
  return n === 1 ? (e = t[r - 1], i += Ke[e >> 2], i += Ke[e << 4 & 63], i += "==") : n === 2 && (e = (t[r - 2] << 8) + t[r - 1], i += Ke[e >> 10], i += Ke[e >> 4 & 63], i += Ke[e << 2 & 63], i += "="), o.push(i), o.join("");
}
function mn(t, e, r, n, i) {
  var o, a, u = i * 8 - n - 1, s = (1 << u) - 1, f = s >> 1, c = -7, l = r ? i - 1 : 0, h = r ? -1 : 1, d = t[e + l];
  for (l += h, o = d & (1 << -c) - 1, d >>= -c, c += u; c > 0; o = o * 256 + t[e + l], l += h, c -= 8)
    ;
  for (a = o & (1 << -c) - 1, o >>= -c, c += n; c > 0; a = a * 256 + t[e + l], l += h, c -= 8)
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
function Xa(t, e, r, n, i, o) {
  var a, u, s, f = o * 8 - i - 1, c = (1 << f) - 1, l = c >> 1, h = i === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0, d = n ? 0 : o - 1, p = n ? 1 : -1, y = e < 0 || e === 0 && 1 / e < 0 ? 1 : 0;
  for (e = Math.abs(e), isNaN(e) || e === 1 / 0 ? (u = isNaN(e) ? 1 : 0, a = c) : (a = Math.floor(Math.log(e) / Math.LN2), e * (s = Math.pow(2, -a)) < 1 && (a--, s *= 2), a + l >= 1 ? e += h / s : e += h * Math.pow(2, 1 - l), e * s >= 2 && (a++, s /= 2), a + l >= c ? (u = 0, a = c) : a + l >= 1 ? (u = (e * s - 1) * Math.pow(2, i), a = a + l) : (u = e * Math.pow(2, l - 1) * Math.pow(2, i), a = 0)); i >= 8; t[r + d] = u & 255, d += p, u /= 256, i -= 8)
    ;
  for (a = a << i | u, f += i; f > 0; t[r + d] = a & 255, d += p, a /= 256, f -= 8)
    ;
  t[r + d - p] |= y * 128;
}
var pf = {}.toString, Qa = Array.isArray || function(t) {
  return pf.call(t) == "[object Array]";
};
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
var Ja = 50;
E.TYPED_ARRAY_SUPPORT = Ei.TYPED_ARRAY_SUPPORT !== void 0 ? Ei.TYPED_ARRAY_SUPPORT : !0;
var _f = pn();
function pn() {
  return E.TYPED_ARRAY_SUPPORT ? 2147483647 : 1073741823;
}
function it(t, e) {
  if (pn() < e)
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
    return ji(this, t);
  }
  return es(this, t, e, r);
}
E.poolSize = 8192;
E._augment = function(t) {
  return t.__proto__ = E.prototype, t;
};
function es(t, e, r, n) {
  if (typeof e == "number")
    throw new TypeError('"value" argument must not be a number');
  return typeof ArrayBuffer < "u" && e instanceof ArrayBuffer ? gf(t, e, r, n) : typeof e == "string" ? yf(t, e, r) : bf(t, e);
}
E.from = function(t, e, r) {
  return es(null, t, e, r);
};
E.TYPED_ARRAY_SUPPORT && (E.prototype.__proto__ = Uint8Array.prototype, E.__proto__ = Uint8Array);
function ts(t) {
  if (typeof t != "number")
    throw new TypeError('"size" argument must be a number');
  if (t < 0)
    throw new RangeError('"size" argument must not be negative');
}
function vf(t, e, r, n) {
  return ts(e), e <= 0 ? it(t, e) : r !== void 0 ? typeof n == "string" ? it(t, e).fill(r, n) : it(t, e).fill(r) : it(t, e);
}
E.alloc = function(t, e, r) {
  return vf(null, t, e, r);
};
function ji(t, e) {
  if (ts(e), t = it(t, e < 0 ? 0 : Ni(e) | 0), !E.TYPED_ARRAY_SUPPORT)
    for (var r = 0; r < e; ++r)
      t[r] = 0;
  return t;
}
E.allocUnsafe = function(t) {
  return ji(null, t);
};
E.allocUnsafeSlow = function(t) {
  return ji(null, t);
};
function yf(t, e, r) {
  if ((typeof r != "string" || r === "") && (r = "utf8"), !E.isEncoding(r))
    throw new TypeError('"encoding" must be a valid string encoding');
  var n = rs(e, r) | 0;
  t = it(t, n);
  var i = t.write(e, r);
  return i !== n && (t = t.slice(0, i)), t;
}
function Si(t, e) {
  var r = e.length < 0 ? 0 : Ni(e.length) | 0;
  t = it(t, r);
  for (var n = 0; n < r; n += 1)
    t[n] = e[n] & 255;
  return t;
}
function gf(t, e, r, n) {
  if (e.byteLength, r < 0 || e.byteLength < r)
    throw new RangeError("'offset' is out of bounds");
  if (e.byteLength < r + (n || 0))
    throw new RangeError("'length' is out of bounds");
  return r === void 0 && n === void 0 ? e = new Uint8Array(e) : n === void 0 ? e = new Uint8Array(e, r) : e = new Uint8Array(e, r, n), E.TYPED_ARRAY_SUPPORT ? (t = e, t.__proto__ = E.prototype) : t = Si(t, e), t;
}
function bf(t, e) {
  if (Je(e)) {
    var r = Ni(e.length) | 0;
    return t = it(t, r), t.length === 0 || e.copy(t, 0, 0, r), t;
  }
  if (e) {
    if (typeof ArrayBuffer < "u" && e.buffer instanceof ArrayBuffer || "length" in e)
      return typeof e.length != "number" || jf(e.length) ? it(t, 0) : Si(t, e);
    if (e.type === "Buffer" && Qa(e.data))
      return Si(t, e.data);
  }
  throw new TypeError("First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.");
}
function Ni(t) {
  if (t >= pn())
    throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + pn().toString(16) + " bytes");
  return t | 0;
}
function wf(t) {
  return +t != t && (t = 0), E.alloc(+t);
}
E.isBuffer = ls;
function Je(t) {
  return !!(t != null && t._isBuffer);
}
E.compare = function(e, r) {
  if (!Je(e) || !Je(r))
    throw new TypeError("Arguments must be Buffers");
  if (e === r)
    return 0;
  for (var n = e.length, i = r.length, o = 0, a = Math.min(n, i); o < a; ++o)
    if (e[o] !== r[o]) {
      n = e[o], i = r[o];
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
  if (!Qa(e))
    throw new TypeError('"list" argument must be an Array of Buffers');
  if (e.length === 0)
    return E.alloc(0);
  var n;
  if (r === void 0)
    for (r = 0, n = 0; n < e.length; ++n)
      r += e[n].length;
  var i = E.allocUnsafe(r), o = 0;
  for (n = 0; n < e.length; ++n) {
    var a = e[n];
    if (!Je(a))
      throw new TypeError('"list" argument must be an Array of Buffers');
    a.copy(i, o), o += a.length;
  }
  return i;
};
function rs(t, e) {
  if (Je(t))
    return t.length;
  if (typeof ArrayBuffer < "u" && typeof ArrayBuffer.isView == "function" && (ArrayBuffer.isView(t) || t instanceof ArrayBuffer))
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
        return _n(t).length;
      case "ucs2":
      case "ucs-2":
      case "utf16le":
      case "utf-16le":
        return r * 2;
      case "hex":
        return r >>> 1;
      case "base64":
        return fs(t).length;
      default:
        if (n)
          return _n(t).length;
        e = ("" + e).toLowerCase(), n = !0;
    }
}
E.byteLength = rs;
function mf(t, e, r) {
  var n = !1;
  if ((e === void 0 || e < 0) && (e = 0), e > this.length || ((r === void 0 || r > this.length) && (r = this.length), r <= 0) || (r >>>= 0, e >>>= 0, r <= e))
    return "";
  for (t || (t = "utf8"); ; )
    switch (t) {
      case "hex":
        return If(this, e, r);
      case "utf8":
      case "utf-8":
        return os(this, e, r);
      case "ascii":
        return kf(this, e, r);
      case "latin1":
      case "binary":
        return Mf(this, e, r);
      case "base64":
        return Of(this, e, r);
      case "ucs2":
      case "ucs-2":
      case "utf16le":
      case "utf-16le":
        return Tf(this, e, r);
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
  return e === 0 ? "" : arguments.length === 0 ? os(this, 0, e) : mf.apply(this, arguments);
};
E.prototype.equals = function(e) {
  if (!Je(e))
    throw new TypeError("Argument must be a Buffer");
  return this === e ? !0 : E.compare(this, e) === 0;
};
E.prototype.inspect = function() {
  var e = "", r = Ja;
  return this.length > 0 && (e = this.toString("hex", 0, r).match(/.{2}/g).join(" "), this.length > r && (e += " ... ")), "<Buffer " + e + ">";
};
E.prototype.compare = function(e, r, n, i, o) {
  if (!Je(e))
    throw new TypeError("Argument must be a Buffer");
  if (r === void 0 && (r = 0), n === void 0 && (n = e ? e.length : 0), i === void 0 && (i = 0), o === void 0 && (o = this.length), r < 0 || n > e.length || i < 0 || o > this.length)
    throw new RangeError("out of range index");
  if (i >= o && r >= n)
    return 0;
  if (i >= o)
    return -1;
  if (r >= n)
    return 1;
  if (r >>>= 0, n >>>= 0, i >>>= 0, o >>>= 0, this === e)
    return 0;
  for (var a = o - i, u = n - r, s = Math.min(a, u), f = this.slice(i, o), c = e.slice(r, n), l = 0; l < s; ++l)
    if (f[l] !== c[l]) {
      a = f[l], u = c[l];
      break;
    }
  return a < u ? -1 : u < a ? 1 : 0;
};
function ns(t, e, r, n, i) {
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
  if (typeof e == "string" && (e = E.from(e, n)), Je(e))
    return e.length === 0 ? -1 : wo(t, e, r, n, i);
  if (typeof e == "number")
    return e = e & 255, E.TYPED_ARRAY_SUPPORT && typeof Uint8Array.prototype.indexOf == "function" ? i ? Uint8Array.prototype.indexOf.call(t, e, r) : Uint8Array.prototype.lastIndexOf.call(t, e, r) : wo(t, [e], r, n, i);
  throw new TypeError("val must be string, number or Buffer");
}
function wo(t, e, r, n, i) {
  var o = 1, a = t.length, u = e.length;
  if (n !== void 0 && (n = String(n).toLowerCase(), n === "ucs2" || n === "ucs-2" || n === "utf16le" || n === "utf-16le")) {
    if (t.length < 2 || e.length < 2)
      return -1;
    o = 2, a /= 2, u /= 2, r /= 2;
  }
  function s(d, p) {
    return o === 1 ? d[p] : d.readUInt16BE(p * o);
  }
  var f;
  if (i) {
    var c = -1;
    for (f = r; f < a; f++)
      if (s(t, f) === s(e, c === -1 ? 0 : f - c)) {
        if (c === -1 && (c = f), f - c + 1 === u)
          return c * o;
      } else
        c !== -1 && (f -= f - c), c = -1;
  } else
    for (r + u > a && (r = a - u), f = r; f >= 0; f--) {
      for (var l = !0, h = 0; h < u; h++)
        if (s(t, f + h) !== s(e, h)) {
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
  return ns(this, e, r, n, !0);
};
E.prototype.lastIndexOf = function(e, r, n) {
  return ns(this, e, r, n, !1);
};
function xf(t, e, r, n) {
  r = Number(r) || 0;
  var i = t.length - r;
  n ? (n = Number(n), n > i && (n = i)) : n = i;
  var o = e.length;
  if (o % 2 !== 0)
    throw new TypeError("Invalid hex string");
  n > o / 2 && (n = o / 2);
  for (var a = 0; a < n; ++a) {
    var u = parseInt(e.substr(a * 2, 2), 16);
    if (isNaN(u))
      return a;
    t[r + a] = u;
  }
  return a;
}
function Ef(t, e, r, n) {
  return Sn(_n(e, t.length - r), t, r, n);
}
function is(t, e, r, n) {
  return Sn(qf(e), t, r, n);
}
function Sf(t, e, r, n) {
  return is(t, e, r, n);
}
function Rf(t, e, r, n) {
  return Sn(fs(e), t, r, n);
}
function Cf(t, e, r, n) {
  return Sn(Df(e, t.length - r), t, r, n);
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
  var o = this.length - r;
  if ((n === void 0 || n > o) && (n = o), e.length > 0 && (n < 0 || r < 0) || r > this.length)
    throw new RangeError("Attempt to write outside buffer bounds");
  i || (i = "utf8");
  for (var a = !1; ; )
    switch (i) {
      case "hex":
        return xf(this, e, r, n);
      case "utf8":
      case "utf-8":
        return Ef(this, e, r, n);
      case "ascii":
        return is(this, e, r, n);
      case "latin1":
      case "binary":
        return Sf(this, e, r, n);
      case "base64":
        return Rf(this, e, r, n);
      case "ucs2":
      case "ucs-2":
      case "utf16le":
      case "utf-16le":
        return Cf(this, e, r, n);
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
function Of(t, e, r) {
  return e === 0 && r === t.length ? bo(t) : bo(t.slice(e, r));
}
function os(t, e, r) {
  r = Math.min(t.length, r);
  for (var n = [], i = e; i < r; ) {
    var o = t[i], a = null, u = o > 239 ? 4 : o > 223 ? 3 : o > 191 ? 2 : 1;
    if (i + u <= r) {
      var s, f, c, l;
      switch (u) {
        case 1:
          o < 128 && (a = o);
          break;
        case 2:
          s = t[i + 1], (s & 192) === 128 && (l = (o & 31) << 6 | s & 63, l > 127 && (a = l));
          break;
        case 3:
          s = t[i + 1], f = t[i + 2], (s & 192) === 128 && (f & 192) === 128 && (l = (o & 15) << 12 | (s & 63) << 6 | f & 63, l > 2047 && (l < 55296 || l > 57343) && (a = l));
          break;
        case 4:
          s = t[i + 1], f = t[i + 2], c = t[i + 3], (s & 192) === 128 && (f & 192) === 128 && (c & 192) === 128 && (l = (o & 15) << 18 | (s & 63) << 12 | (f & 63) << 6 | c & 63, l > 65535 && l < 1114112 && (a = l));
      }
    }
    a === null ? (a = 65533, u = 1) : a > 65535 && (a -= 65536, n.push(a >>> 10 & 1023 | 55296), a = 56320 | a & 1023), n.push(a), i += u;
  }
  return Af(n);
}
var mo = 4096;
function Af(t) {
  var e = t.length;
  if (e <= mo)
    return String.fromCharCode.apply(String, t);
  for (var r = "", n = 0; n < e; )
    r += String.fromCharCode.apply(
      String,
      t.slice(n, n += mo)
    );
  return r;
}
function kf(t, e, r) {
  var n = "";
  r = Math.min(t.length, r);
  for (var i = e; i < r; ++i)
    n += String.fromCharCode(t[i] & 127);
  return n;
}
function Mf(t, e, r) {
  var n = "";
  r = Math.min(t.length, r);
  for (var i = e; i < r; ++i)
    n += String.fromCharCode(t[i]);
  return n;
}
function If(t, e, r) {
  var n = t.length;
  (!e || e < 0) && (e = 0), (!r || r < 0 || r > n) && (r = n);
  for (var i = "", o = e; o < r; ++o)
    i += Hf(t[o]);
  return i;
}
function Tf(t, e, r) {
  for (var n = t.slice(e, r), i = "", o = 0; o < n.length; o += 2)
    i += String.fromCharCode(n[o] + n[o + 1] * 256);
  return i;
}
E.prototype.slice = function(e, r) {
  var n = this.length;
  e = ~~e, r = r === void 0 ? n : ~~r, e < 0 ? (e += n, e < 0 && (e = 0)) : e > n && (e = n), r < 0 ? (r += n, r < 0 && (r = 0)) : r > n && (r = n), r < e && (r = e);
  var i;
  if (E.TYPED_ARRAY_SUPPORT)
    i = this.subarray(e, r), i.__proto__ = E.prototype;
  else {
    var o = r - e;
    i = new E(o, void 0);
    for (var a = 0; a < o; ++a)
      i[a] = this[a + e];
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
  for (var i = this[e], o = 1, a = 0; ++a < r && (o *= 256); )
    i += this[e + a] * o;
  return i;
};
E.prototype.readUIntBE = function(e, r, n) {
  e = e | 0, r = r | 0, n || me(e, r, this.length);
  for (var i = this[e + --r], o = 1; r > 0 && (o *= 256); )
    i += this[e + --r] * o;
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
  for (var i = this[e], o = 1, a = 0; ++a < r && (o *= 256); )
    i += this[e + a] * o;
  return o *= 128, i >= o && (i -= Math.pow(2, 8 * r)), i;
};
E.prototype.readIntBE = function(e, r, n) {
  e = e | 0, r = r | 0, n || me(e, r, this.length);
  for (var i = r, o = 1, a = this[e + --i]; i > 0 && (o *= 256); )
    a += this[e + --i] * o;
  return o *= 128, a >= o && (a -= Math.pow(2, 8 * r)), a;
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
  return r || me(e, 4, this.length), mn(this, e, !0, 23, 4);
};
E.prototype.readFloatBE = function(e, r) {
  return r || me(e, 4, this.length), mn(this, e, !1, 23, 4);
};
E.prototype.readDoubleLE = function(e, r) {
  return r || me(e, 8, this.length), mn(this, e, !0, 52, 8);
};
E.prototype.readDoubleBE = function(e, r) {
  return r || me(e, 8, this.length), mn(this, e, !1, 52, 8);
};
function Te(t, e, r, n, i, o) {
  if (!Je(t))
    throw new TypeError('"buffer" argument must be a Buffer instance');
  if (e > i || e < o)
    throw new RangeError('"value" argument is out of bounds');
  if (r + n > t.length)
    throw new RangeError("Index out of range");
}
E.prototype.writeUIntLE = function(e, r, n, i) {
  if (e = +e, r = r | 0, n = n | 0, !i) {
    var o = Math.pow(2, 8 * n) - 1;
    Te(this, e, r, n, o, 0);
  }
  var a = 1, u = 0;
  for (this[r] = e & 255; ++u < n && (a *= 256); )
    this[r + u] = e / a & 255;
  return r + n;
};
E.prototype.writeUIntBE = function(e, r, n, i) {
  if (e = +e, r = r | 0, n = n | 0, !i) {
    var o = Math.pow(2, 8 * n) - 1;
    Te(this, e, r, n, o, 0);
  }
  var a = n - 1, u = 1;
  for (this[r + a] = e & 255; --a >= 0 && (u *= 256); )
    this[r + a] = e / u & 255;
  return r + n;
};
E.prototype.writeUInt8 = function(e, r, n) {
  return e = +e, r = r | 0, n || Te(this, e, r, 1, 255, 0), E.TYPED_ARRAY_SUPPORT || (e = Math.floor(e)), this[r] = e & 255, r + 1;
};
function xn(t, e, r, n) {
  e < 0 && (e = 65535 + e + 1);
  for (var i = 0, o = Math.min(t.length - r, 2); i < o; ++i)
    t[r + i] = (e & 255 << 8 * (n ? i : 1 - i)) >>> (n ? i : 1 - i) * 8;
}
E.prototype.writeUInt16LE = function(e, r, n) {
  return e = +e, r = r | 0, n || Te(this, e, r, 2, 65535, 0), E.TYPED_ARRAY_SUPPORT ? (this[r] = e & 255, this[r + 1] = e >>> 8) : xn(this, e, r, !0), r + 2;
};
E.prototype.writeUInt16BE = function(e, r, n) {
  return e = +e, r = r | 0, n || Te(this, e, r, 2, 65535, 0), E.TYPED_ARRAY_SUPPORT ? (this[r] = e >>> 8, this[r + 1] = e & 255) : xn(this, e, r, !1), r + 2;
};
function En(t, e, r, n) {
  e < 0 && (e = 4294967295 + e + 1);
  for (var i = 0, o = Math.min(t.length - r, 4); i < o; ++i)
    t[r + i] = e >>> (n ? i : 3 - i) * 8 & 255;
}
E.prototype.writeUInt32LE = function(e, r, n) {
  return e = +e, r = r | 0, n || Te(this, e, r, 4, 4294967295, 0), E.TYPED_ARRAY_SUPPORT ? (this[r + 3] = e >>> 24, this[r + 2] = e >>> 16, this[r + 1] = e >>> 8, this[r] = e & 255) : En(this, e, r, !0), r + 4;
};
E.prototype.writeUInt32BE = function(e, r, n) {
  return e = +e, r = r | 0, n || Te(this, e, r, 4, 4294967295, 0), E.TYPED_ARRAY_SUPPORT ? (this[r] = e >>> 24, this[r + 1] = e >>> 16, this[r + 2] = e >>> 8, this[r + 3] = e & 255) : En(this, e, r, !1), r + 4;
};
E.prototype.writeIntLE = function(e, r, n, i) {
  if (e = +e, r = r | 0, !i) {
    var o = Math.pow(2, 8 * n - 1);
    Te(this, e, r, n, o - 1, -o);
  }
  var a = 0, u = 1, s = 0;
  for (this[r] = e & 255; ++a < n && (u *= 256); )
    e < 0 && s === 0 && this[r + a - 1] !== 0 && (s = 1), this[r + a] = (e / u >> 0) - s & 255;
  return r + n;
};
E.prototype.writeIntBE = function(e, r, n, i) {
  if (e = +e, r = r | 0, !i) {
    var o = Math.pow(2, 8 * n - 1);
    Te(this, e, r, n, o - 1, -o);
  }
  var a = n - 1, u = 1, s = 0;
  for (this[r + a] = e & 255; --a >= 0 && (u *= 256); )
    e < 0 && s === 0 && this[r + a + 1] !== 0 && (s = 1), this[r + a] = (e / u >> 0) - s & 255;
  return r + n;
};
E.prototype.writeInt8 = function(e, r, n) {
  return e = +e, r = r | 0, n || Te(this, e, r, 1, 127, -128), E.TYPED_ARRAY_SUPPORT || (e = Math.floor(e)), e < 0 && (e = 255 + e + 1), this[r] = e & 255, r + 1;
};
E.prototype.writeInt16LE = function(e, r, n) {
  return e = +e, r = r | 0, n || Te(this, e, r, 2, 32767, -32768), E.TYPED_ARRAY_SUPPORT ? (this[r] = e & 255, this[r + 1] = e >>> 8) : xn(this, e, r, !0), r + 2;
};
E.prototype.writeInt16BE = function(e, r, n) {
  return e = +e, r = r | 0, n || Te(this, e, r, 2, 32767, -32768), E.TYPED_ARRAY_SUPPORT ? (this[r] = e >>> 8, this[r + 1] = e & 255) : xn(this, e, r, !1), r + 2;
};
E.prototype.writeInt32LE = function(e, r, n) {
  return e = +e, r = r | 0, n || Te(this, e, r, 4, 2147483647, -2147483648), E.TYPED_ARRAY_SUPPORT ? (this[r] = e & 255, this[r + 1] = e >>> 8, this[r + 2] = e >>> 16, this[r + 3] = e >>> 24) : En(this, e, r, !0), r + 4;
};
E.prototype.writeInt32BE = function(e, r, n) {
  return e = +e, r = r | 0, n || Te(this, e, r, 4, 2147483647, -2147483648), e < 0 && (e = 4294967295 + e + 1), E.TYPED_ARRAY_SUPPORT ? (this[r] = e >>> 24, this[r + 1] = e >>> 16, this[r + 2] = e >>> 8, this[r + 3] = e & 255) : En(this, e, r, !1), r + 4;
};
function as(t, e, r, n, i, o) {
  if (r + n > t.length)
    throw new RangeError("Index out of range");
  if (r < 0)
    throw new RangeError("Index out of range");
}
function ss(t, e, r, n, i) {
  return i || as(t, e, r, 4), Xa(t, e, r, n, 23, 4), r + 4;
}
E.prototype.writeFloatLE = function(e, r, n) {
  return ss(this, e, r, !0, n);
};
E.prototype.writeFloatBE = function(e, r, n) {
  return ss(this, e, r, !1, n);
};
function us(t, e, r, n, i) {
  return i || as(t, e, r, 8), Xa(t, e, r, n, 52, 8), r + 8;
}
E.prototype.writeDoubleLE = function(e, r, n) {
  return us(this, e, r, !0, n);
};
E.prototype.writeDoubleBE = function(e, r, n) {
  return us(this, e, r, !1, n);
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
  var o = i - n, a;
  if (this === e && n < r && r < i)
    for (a = o - 1; a >= 0; --a)
      e[a + r] = this[a + n];
  else if (o < 1e3 || !E.TYPED_ARRAY_SUPPORT)
    for (a = 0; a < o; ++a)
      e[a + r] = this[a + n];
  else
    Uint8Array.prototype.set.call(
      e,
      this.subarray(n, n + o),
      r
    );
  return o;
};
E.prototype.fill = function(e, r, n, i) {
  if (typeof e == "string") {
    if (typeof r == "string" ? (i = r, r = 0, n = this.length) : typeof n == "string" && (i = n, n = this.length), e.length === 1) {
      var o = e.charCodeAt(0);
      o < 256 && (e = o);
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
  var a;
  if (typeof e == "number")
    for (a = r; a < n; ++a)
      this[a] = e;
  else {
    var u = Je(e) ? e : _n(new E(e, i).toString()), s = u.length;
    for (a = 0; a < n - r; ++a)
      this[a + r] = u[a % s];
  }
  return this;
};
var Bf = /[^+\/0-9A-Za-z-_]/g;
function Lf(t) {
  if (t = Pf(t).replace(Bf, ""), t.length < 2)
    return "";
  for (; t.length % 4 !== 0; )
    t = t + "=";
  return t;
}
function Pf(t) {
  return t.trim ? t.trim() : t.replace(/^\s+|\s+$/g, "");
}
function Hf(t) {
  return t < 16 ? "0" + t.toString(16) : t.toString(16);
}
function _n(t, e) {
  e = e || 1 / 0;
  for (var r, n = t.length, i = null, o = [], a = 0; a < n; ++a) {
    if (r = t.charCodeAt(a), r > 55295 && r < 57344) {
      if (!i) {
        if (r > 56319) {
          (e -= 3) > -1 && o.push(239, 191, 189);
          continue;
        } else if (a + 1 === n) {
          (e -= 3) > -1 && o.push(239, 191, 189);
          continue;
        }
        i = r;
        continue;
      }
      if (r < 56320) {
        (e -= 3) > -1 && o.push(239, 191, 189), i = r;
        continue;
      }
      r = (i - 55296 << 10 | r - 56320) + 65536;
    } else
      i && (e -= 3) > -1 && o.push(239, 191, 189);
    if (i = null, r < 128) {
      if ((e -= 1) < 0)
        break;
      o.push(r);
    } else if (r < 2048) {
      if ((e -= 2) < 0)
        break;
      o.push(
        r >> 6 | 192,
        r & 63 | 128
      );
    } else if (r < 65536) {
      if ((e -= 3) < 0)
        break;
      o.push(
        r >> 12 | 224,
        r >> 6 & 63 | 128,
        r & 63 | 128
      );
    } else if (r < 1114112) {
      if ((e -= 4) < 0)
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
function qf(t) {
  for (var e = [], r = 0; r < t.length; ++r)
    e.push(t.charCodeAt(r) & 255);
  return e;
}
function Df(t, e) {
  for (var r, n, i, o = [], a = 0; a < t.length && !((e -= 2) < 0); ++a)
    r = t.charCodeAt(a), n = r >> 8, i = r % 256, o.push(i), o.push(n);
  return o;
}
function fs(t) {
  return cf(Lf(t));
}
function Sn(t, e, r, n) {
  for (var i = 0; i < n && !(i + r >= e.length || i >= t.length); ++i)
    e[i + r] = t[i];
  return i;
}
function jf(t) {
  return t !== t;
}
function ls(t) {
  return t != null && (!!t._isBuffer || cs(t) || Nf(t));
}
function cs(t) {
  return !!t.constructor && typeof t.constructor.isBuffer == "function" && t.constructor.isBuffer(t);
}
function Nf(t) {
  return typeof t.readFloatLE == "function" && typeof t.slice == "function" && cs(t.slice(0, 0));
}
const Ff = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Buffer: E,
  INSPECT_MAX_BYTES: Ja,
  SlowBuffer: wf,
  isBuffer: ls,
  kMaxLength: _f
}, Symbol.toStringTag, { value: "Module" }));
function $f() {
  return E.from(Ue.randomPrivateKey()).toString("hex");
}
function Uf(t) {
  return E.from(qi.getPublicKey(t)).toString("hex");
}
var C = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Fi(t) {
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
var Vn = null;
function Wf() {
  return Vn === null && (Vn = typeof C == "object" && typeof C.process == "object" && typeof C.process.versions == "object" && typeof C.process.versions.node < "u"), Vn;
}
Pr.is_node = Wf;
var Gn = {}, Yn, xo;
function zf() {
  if (xo)
    return Yn;
  xo = 1;
  var t = function() {
    if (typeof self == "object" && self)
      return self;
    if (typeof window == "object" && window)
      return window;
    throw new Error("Unable to resolve global `this`");
  };
  return Yn = function() {
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
      return t();
    }
    try {
      return __global__ || t();
    } finally {
      delete Object.prototype.__global__;
    }
  }(), Yn;
}
const Vf = "websocket", Gf = "Websocket Client & Server Library implementing the WebSocket protocol as specified in RFC 6455.", Yf = [
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
], Zf = "Brian McKelvey <theturtle32@gmail.com> (https://github.com/theturtle32)", Kf = [
  "I\xF1aki Baz Castillo <ibc@aliax.net> (http://dev.sipdoc.net)"
], Xf = "1.0.34", Qf = {
  type: "git",
  url: "https://github.com/theturtle32/WebSocket-Node.git"
}, Jf = "https://github.com/theturtle32/WebSocket-Node", el = {
  node: ">=4.0.0"
}, tl = {
  bufferutil: "^4.0.1",
  debug: "^2.2.0",
  "es5-ext": "^0.10.50",
  "typedarray-to-buffer": "^3.1.5",
  "utf-8-validate": "^5.0.2",
  yaeti: "^0.0.6"
}, rl = {
  "buffer-equal": "^1.0.0",
  gulp: "^4.0.2",
  "gulp-jshint": "^2.0.4",
  "jshint-stylish": "^2.2.1",
  jshint: "^2.0.0",
  tape: "^4.9.1"
}, nl = {
  verbose: !1
}, il = {
  test: "tape test/unit/*.js",
  gulp: "gulp"
}, ol = "index", al = {
  lib: "./lib"
}, sl = "lib/browser.js", ul = "Apache-2.0", fl = {
  name: Vf,
  description: Gf,
  keywords: Yf,
  author: Zf,
  contributors: Kf,
  version: Xf,
  repository: Qf,
  homepage: Jf,
  engines: el,
  dependencies: tl,
  devDependencies: rl,
  config: nl,
  scripts: il,
  main: ol,
  directories: al,
  browser: sl,
  license: ul
};
var Zn, Eo;
function ll() {
  return Eo || (Eo = 1, Zn = fl.version), Zn;
}
var Kn, So;
function cl() {
  if (So)
    return Kn;
  So = 1;
  var t;
  if (typeof globalThis == "object")
    t = globalThis;
  else
    try {
      t = zf();
    } catch {
    } finally {
      if (!t && typeof window < "u" && (t = window), !t)
        throw new Error("Could not determine global this");
    }
  var e = t.WebSocket || t.MozWebSocket, r = ll();
  function n(i, o) {
    var a;
    return o ? a = new e(i, o) : a = new e(i), a;
  }
  return e && ["CONNECTING", "OPEN", "CLOSING", "CLOSED"].forEach(function(i) {
    Object.defineProperty(n, i, {
      get: function() {
        return e[i];
      }
    });
  }), Kn = {
    w3cwebsocket: e ? n : null,
    version: r
  }, Kn;
}
var Yr = {}, Xn = {}, Kt = {}, Xt = {}, Qt = {}, Jt = {}, Ro;
function hl() {
  if (Ro)
    return Jt;
  Ro = 1, Object.defineProperty(Jt, "__esModule", { value: !0 }), Jt.ForOfAdaptor = void 0;
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
var Co;
function $i() {
  if (Co)
    return Qt;
  Co = 1;
  var t = C && C.__values || function(n) {
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
  Object.defineProperty(Qt, "__esModule", { value: !0 }), Qt.Container = void 0;
  var e = hl(), r = function() {
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
      var i, o, a = [];
      try {
        for (var u = t(this), s = u.next(); !s.done; s = u.next()) {
          var f = s.value;
          a.push(f);
        }
      } catch (c) {
        i = { error: c };
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
  return Qt.Container = r, Qt;
}
var er = {}, Oo;
function Ui() {
  if (Oo)
    return er;
  Oo = 1;
  var t = C && C.__read || function(r, n) {
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
      var i, o;
      i = t([n.data_, this.data_], 2), this.data_ = i[0], n.data_ = i[1], o = t([n.index_, this.index_], 2), this.index_ = o[0], n.index_ = o[1];
    }, r;
  }();
  return er.NativeArrayIterator = e, er;
}
var Ao;
function dl() {
  if (Ao)
    return Xt;
  Ao = 1;
  var t = C && C.__extends || function() {
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
  Object.defineProperty(Xt, "__esModule", { value: !0 }), Xt.SetContainer = void 0;
  var e = $i(), r = Ui(), n = function(i) {
    t(o, i);
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
  }(e.Container);
  return Xt.SetContainer = n, Xt;
}
var Qn = {}, tr = {}, rr = {}, nr = {}, ko;
function pl() {
  if (ko)
    return nr;
  ko = 1;
  var t = C && C.__extends || function() {
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
  Object.defineProperty(nr, "__esModule", { value: !0 }), nr.Exception = void 0;
  var e = function(r) {
    t(n, r);
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
  return nr.Exception = e, nr;
}
var Mo;
function hs() {
  if (Mo)
    return rr;
  Mo = 1;
  var t = C && C.__extends || function() {
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
  Object.defineProperty(rr, "__esModule", { value: !0 }), rr.LogicError = void 0;
  var e = pl(), r = function(n) {
    t(i, n);
    function i(o) {
      return n.call(this, o) || this;
    }
    return i;
  }(e.Exception);
  return rr.LogicError = r, rr;
}
var Io;
function ds() {
  if (Io)
    return tr;
  Io = 1;
  var t = C && C.__extends || function() {
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
  Object.defineProperty(tr, "__esModule", { value: !0 }), tr.InvalidArgument = void 0;
  var e = hs(), r = function(n) {
    t(i, n);
    function i(o) {
      return n.call(this, o) || this;
    }
    return i;
  }(e.LogicError);
  return tr.InvalidArgument = r, tr;
}
var ir = {}, To;
function _l() {
  if (To)
    return ir;
  To = 1;
  var t = C && C.__extends || function() {
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
  Object.defineProperty(ir, "__esModule", { value: !0 }), ir.OutOfRange = void 0;
  var e = hs(), r = function(n) {
    t(i, n);
    function i(o) {
      return n.call(this, o) || this;
    }
    return i;
  }(e.LogicError);
  return ir.OutOfRange = r, ir;
}
var Bo;
function Rn() {
  return Bo || (Bo = 1, function(t) {
    Object.defineProperty(t, "__esModule", { value: !0 }), t.ErrorGenerator = void 0;
    var e = ds(), r = _l();
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
      function a(d, p, y) {
        return new r.OutOfRange("Error on ".concat(i(d), ".").concat(p, "(): parametric index is negative -> (index = ").concat(y, ")."));
      }
      n.negative_index = a;
      function u(d, p, y, g) {
        return new r.OutOfRange("Error on ".concat(i(d), ".").concat(p, "(): parametric index is equal or greater than size -> (index = ").concat(y, ", size: ").concat(g, ")."));
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
      function c(d, p, y) {
        return new r.OutOfRange("Error on ".concat(i(d), ".").concat(p, "(): parametric iterator is directing negative position -> (index = ").concat(y, ")."));
      }
      n.negative_iterator = c;
      function l(d, p) {
        p === void 0 && (p = "end");
        var y = i(d);
        return new r.OutOfRange("Error on ".concat(y, ".Iterator.value: cannot access to the ").concat(y, ".").concat(p, "().value."));
      }
      n.iterator_end_value = l;
      function h(d, p, y) {
        throw new r.OutOfRange("Error on ".concat(i(d), ".").concat(p, "(): unable to find the matched key -> ").concat(y));
      }
      n.key_nout_found = h;
    })(t.ErrorGenerator || (t.ErrorGenerator = {}));
  }(Qn)), Qn;
}
var Lo;
function vl() {
  if (Lo)
    return Kt;
  Lo = 1;
  var t = C && C.__extends || function() {
    var a = function(u, s) {
      return a = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(f, c) {
        f.__proto__ = c;
      } || function(f, c) {
        for (var l in c)
          Object.prototype.hasOwnProperty.call(c, l) && (f[l] = c[l]);
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
  }(), e = C && C.__read || function(a, u) {
    var s = typeof Symbol == "function" && a[Symbol.iterator];
    if (!s)
      return a;
    var f = s.call(a), c, l = [], h;
    try {
      for (; (u === void 0 || u-- > 0) && !(c = f.next()).done; )
        l.push(c.value);
    } catch (d) {
      h = { error: d };
    } finally {
      try {
        c && !c.done && (s = f.return) && s.call(f);
      } finally {
        if (h)
          throw h.error;
      }
    }
    return l;
  }, r = C && C.__spreadArray || function(a, u, s) {
    if (s || arguments.length === 2)
      for (var f = 0, c = u.length, l; f < c; f++)
        (l || !(f in u)) && (l || (l = Array.prototype.slice.call(u, 0, f)), l[f] = u[f]);
    return a.concat(l || Array.prototype.slice.call(u));
  };
  Object.defineProperty(Kt, "__esModule", { value: !0 }), Kt.UniqueSet = void 0;
  var n = dl(), i = Rn(), o = function(a) {
    t(u, a);
    function u() {
      return a !== null && a.apply(this, arguments) || this;
    }
    return u.prototype.count = function(s) {
      return this.find(s).equals(this.end()) ? 0 : 1;
    }, u.prototype.insert = function() {
      for (var s = [], f = 0; f < arguments.length; f++)
        s[f] = arguments[f];
      return a.prototype.insert.apply(this, r([], e(s), !1));
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
  return Kt.UniqueSet = o, Kt;
}
var Jn = {}, ei = {}, Po;
function yl() {
  return Po || (Po = 1, function(t) {
    var e = C && C.__read || function(n, i) {
      var o = typeof Symbol == "function" && n[Symbol.iterator];
      if (!o)
        return n;
      var a = o.call(n), u, s = [], f;
      try {
        for (; (i === void 0 || i-- > 0) && !(u = a.next()).done; )
          s.push(u.value);
      } catch (c) {
        f = { error: c };
      } finally {
        try {
          u && !u.done && (o = a.return) && o.call(a);
        } finally {
          if (f)
            throw f.error;
        }
      }
      return s;
    }, r = C && C.__spreadArray || function(n, i, o) {
      if (o || arguments.length === 2)
        for (var a = 0, u = i.length, s; a < u; a++)
          (s || !(a in i)) && (s || (s = Array.prototype.slice.call(i, 0, a)), s[a] = i[a]);
      return n.concat(s || Array.prototype.slice.call(i));
    };
    Object.defineProperty(t, "__esModule", { value: !0 }), t.IAssociativeContainer = void 0, function(n) {
      function i(o) {
        for (var a = [], u = 1; u < arguments.length; u++)
          a[u - 1] = arguments[u];
        var s, f;
        return a.length >= 1 && a[0] instanceof Array ? (s = function() {
          var c = a[0];
          o.push.apply(o, r([], e(c), !1));
        }, f = a.slice(1)) : a.length >= 2 && a[0].next instanceof Function && a[1].next instanceof Function ? (s = function() {
          var c = a[0], l = a[1];
          o.assign(c, l);
        }, f = a.slice(2)) : (s = null, f = a), { ramda: s, tail: f };
      }
      n.construct = i;
    }(t.IAssociativeContainer || (t.IAssociativeContainer = {}));
  }(ei)), ei;
}
var or = {}, ar = {}, sr = {}, Ho;
function gl() {
  if (Ho)
    return sr;
  Ho = 1, Object.defineProperty(sr, "__esModule", { value: !0 }), sr._Get_root = void 0;
  var t = Pr;
  function e() {
    return r === null && (r = (0, t.is_node)() ? C : self, r.__s_iUID === void 0 && (r.__s_iUID = 0)), r;
  }
  sr._Get_root = e;
  var r = null;
  return sr;
}
var qo;
function ps() {
  if (qo)
    return ar;
  qo = 1, Object.defineProperty(ar, "__esModule", { value: !0 }), ar.get_uid = void 0;
  var t = gl();
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
var Do;
function Wi() {
  if (Do)
    return or;
  Do = 1;
  var t = C && C.__values || function(s) {
    var f = typeof Symbol == "function" && Symbol.iterator, c = f && s[f], l = 0;
    if (c)
      return c.call(s);
    if (s && typeof s.length == "number")
      return {
        next: function() {
          return s && l >= s.length && (s = void 0), { value: s && s[l++], done: !s };
        }
      };
    throw new TypeError(f ? "Object is not iterable." : "Symbol.iterator is not defined.");
  };
  Object.defineProperty(or, "__esModule", { value: !0 }), or.hash = void 0;
  var e = ps();
  function r() {
    for (var s, f, c = [], l = 0; l < arguments.length; l++)
      c[l] = arguments[l];
    var h = a;
    try {
      for (var d = t(c), p = d.next(); !p.done; p = d.next()) {
        var y = p.value;
        y = y && y.valueOf();
        var g = typeof y;
        if (g === "boolean")
          h = n(y, h);
        else if (g === "number" || g === "bigint")
          h = i(y, h);
        else if (g === "string")
          h = o(y, h);
        else if (y instanceof Object && y.hashCode instanceof Function) {
          var m = y.hashCode();
          if (c.length === 1)
            return m;
          h = h ^ m, h *= u;
        } else
          h = i((0, e.get_uid)(y), h);
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
    return Math.abs(h);
  }
  or.hash = r;
  function n(s, f) {
    return f ^= s ? 1 : 0, f *= u, f;
  }
  function i(s, f) {
    return o(s.toString(), f);
  }
  function o(s, f) {
    for (var c = 0; c < s.length; ++c)
      f ^= s.charCodeAt(c), f *= u;
    return Math.abs(f);
  }
  var a = 2166136261, u = 16777619;
  return or;
}
var Oe = {}, jo;
function zi() {
  if (jo)
    return Oe;
  jo = 1, Object.defineProperty(Oe, "__esModule", { value: !0 }), Oe.greater_equal = Oe.greater = Oe.less_equal = Oe.less = Oe.not_equal_to = Oe.equal_to = void 0;
  var t = ps();
  function e(u, s) {
    return u = u && u.valueOf(), s = s && s.valueOf(), u instanceof Object && u.equals instanceof Function ? u.equals(s) : u === s;
  }
  Oe.equal_to = e;
  function r(u, s) {
    return !e(u, s);
  }
  Oe.not_equal_to = r;
  function n(u, s) {
    return u = u.valueOf(), s = s.valueOf(), u instanceof Object ? u.less instanceof Function ? u.less(s) : (0, t.get_uid)(u) < (0, t.get_uid)(s) : u < s;
  }
  Oe.less = n;
  function i(u, s) {
    return n(u, s) || e(u, s);
  }
  Oe.less_equal = i;
  function o(u, s) {
    return !i(u, s);
  }
  Oe.greater = o;
  function a(u, s) {
    return !n(u, s);
  }
  return Oe.greater_equal = a, Oe;
}
var No;
function _s() {
  return No || (No = 1, function(t) {
    var e = C && C.__read || function(a, u) {
      var s = typeof Symbol == "function" && a[Symbol.iterator];
      if (!s)
        return a;
      var f = s.call(a), c, l = [], h;
      try {
        for (; (u === void 0 || u-- > 0) && !(c = f.next()).done; )
          l.push(c.value);
      } catch (d) {
        h = { error: d };
      } finally {
        try {
          c && !c.done && (s = f.return) && s.call(f);
        } finally {
          if (h)
            throw h.error;
        }
      }
      return l;
    }, r = C && C.__spreadArray || function(a, u, s) {
      if (s || arguments.length === 2)
        for (var f = 0, c = u.length, l; f < c; f++)
          (l || !(f in u)) && (l || (l = Array.prototype.slice.call(u, 0, f)), l[f] = u[f]);
      return a.concat(l || Array.prototype.slice.call(u));
    };
    Object.defineProperty(t, "__esModule", { value: !0 }), t.IHashContainer = void 0;
    var n = yl(), i = Wi(), o = zi();
    (function(a) {
      function u(s, f, c) {
        for (var l = [], h = 3; h < arguments.length; h++)
          l[h - 3] = arguments[h];
        var d = null, p = i.hash, y = o.equal_to;
        if (l.length === 1 && l[0] instanceof f) {
          var g = l[0];
          p = g.hash_function(), y = g.key_eq(), d = function() {
            var x = g.begin(), S = g.end();
            s.assign(x, S);
          };
        } else {
          var m = n.IAssociativeContainer.construct.apply(n.IAssociativeContainer, r([s], e(l), !1));
          d = m.ramda, m.tail.length >= 1 && (p = m.tail[0]), m.tail.length >= 2 && (y = m.tail[1]);
        }
        c(p, y), d !== null && d();
      }
      a.construct = u;
    })(t.IHashContainer || (t.IHashContainer = {}));
  }(Jn)), Jn;
}
var ti = {}, ur = {}, fr = {}, Fo;
function Vi() {
  if (Fo)
    return fr;
  Fo = 1, Object.defineProperty(fr, "__esModule", { value: !0 }), fr.ListIterator = void 0;
  var t = Rn(), e = function() {
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
        throw t.ErrorGenerator.iterator_end_value(this.source());
    }, r.prototype.equals = function(n) {
      return this === n;
    }, r;
  }();
  return fr.ListIterator = e, fr;
}
var lr = {}, $o;
function bl() {
  if ($o)
    return lr;
  $o = 1, Object.defineProperty(lr, "__esModule", { value: !0 }), lr.Repeater = void 0;
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
var Ae = {}, Uo;
function wl() {
  if (Uo)
    return Ae;
  Uo = 1, Object.defineProperty(Ae, "__esModule", { value: !0 }), Ae.next = Ae.prev = Ae.advance = Ae.distance = Ae.size = Ae.empty = void 0;
  var t = ds();
  function e(s) {
    return s instanceof Array ? s.length !== 0 : s.empty();
  }
  Ae.empty = e;
  function r(s) {
    return s instanceof Array ? s.length : s.size();
  }
  Ae.size = r;
  function n(s, f) {
    if (s.index instanceof Function)
      return i(s, f);
    for (var c = 0; !s.equals(f); s = s.next())
      ++c;
    return c;
  }
  Ae.distance = n;
  function i(s, f) {
    var c = s.index(), l = f.index();
    return s.base instanceof Function ? c - l : l - c;
  }
  function o(s, f) {
    if (f === 0)
      return s;
    if (s.advance instanceof Function)
      return s.advance(f);
    var c;
    if (f < 0) {
      if (!(s.prev instanceof Function))
        throw new t.InvalidArgument("Error on std.advance(): parametric iterator is not a bi-directional iterator, thus advancing to negative direction is not possible.");
      c = function(l) {
        return l.prev();
      }, f = -f;
    } else
      c = function(l) {
        return l.next();
      };
    for (; f-- > 0; )
      s = c(s);
    return s;
  }
  Ae.advance = o;
  function a(s, f) {
    return f === void 0 && (f = 1), f === 1 ? s.prev() : o(s, -f);
  }
  Ae.prev = a;
  function u(s, f) {
    return f === void 0 && (f = 1), f === 1 ? s.next() : o(s, f);
  }
  return Ae.next = u, Ae;
}
var Wo;
function vs() {
  if (Wo)
    return ur;
  Wo = 1;
  var t = C && C.__extends || function() {
    var f = function(c, l) {
      return f = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(h, d) {
        h.__proto__ = d;
      } || function(h, d) {
        for (var p in d)
          Object.prototype.hasOwnProperty.call(d, p) && (h[p] = d[p]);
      }, f(c, l);
    };
    return function(c, l) {
      if (typeof l != "function" && l !== null)
        throw new TypeError("Class extends value " + String(l) + " is not a constructor or null");
      f(c, l);
      function h() {
        this.constructor = c;
      }
      c.prototype = l === null ? Object.create(l) : (h.prototype = l.prototype, new h());
    };
  }(), e = C && C.__read || function(f, c) {
    var l = typeof Symbol == "function" && f[Symbol.iterator];
    if (!l)
      return f;
    var h = l.call(f), d, p = [], y;
    try {
      for (; (c === void 0 || c-- > 0) && !(d = h.next()).done; )
        p.push(d.value);
    } catch (g) {
      y = { error: g };
    } finally {
      try {
        d && !d.done && (l = h.return) && l.call(h);
      } finally {
        if (y)
          throw y.error;
      }
    }
    return p;
  };
  Object.defineProperty(ur, "__esModule", { value: !0 }), ur.ListContainer = void 0;
  var r = $i(), n = Vi(), i = bl(), o = Ui(), a = wl(), u = Rn(), s = function(f) {
    t(c, f);
    function c() {
      var l = f.call(this) || this;
      return l.end_ = l._Create_iterator(null, null), l.clear(), l;
    }
    return c.prototype.assign = function(l, h) {
      this.clear(), this.insert(this.end(), l, h);
    }, c.prototype.clear = function() {
      n.ListIterator._Set_prev(this.end_, this.end_), n.ListIterator._Set_next(this.end_, this.end_), this.begin_ = this.end_, this.size_ = 0;
    }, c.prototype.resize = function(l) {
      var h = l - this.size();
      h > 0 ? this.insert(this.end(), h, void 0) : h < 0 && this.erase((0, a.advance)(this.end(), -h), this.end());
    }, c.prototype.begin = function() {
      return this.begin_;
    }, c.prototype.end = function() {
      return this.end_;
    }, c.prototype.size = function() {
      return this.size_;
    }, c.prototype.push_front = function(l) {
      this.insert(this.begin_, l);
    }, c.prototype.push_back = function(l) {
      this.insert(this.end_, l);
    }, c.prototype.pop_front = function() {
      if (this.empty() === !0)
        throw u.ErrorGenerator.empty(this.end_.source().constructor.name, "pop_front");
      this.erase(this.begin_);
    }, c.prototype.pop_back = function() {
      if (this.empty() === !0)
        throw u.ErrorGenerator.empty(this.end_.source().constructor.name, "pop_back");
      this.erase(this.end_.prev());
    }, c.prototype.push = function() {
      for (var l = [], h = 0; h < arguments.length; h++)
        l[h] = arguments[h];
      if (l.length === 0)
        return this.size();
      var d = new o.NativeArrayIterator(l, 0), p = new o.NativeArrayIterator(l, l.length);
      return this._Insert_by_range(this.end(), d, p), this.size();
    }, c.prototype.insert = function(l) {
      for (var h = [], d = 1; d < arguments.length; d++)
        h[d - 1] = arguments[d];
      if (l.source() !== this.end_.source())
        throw u.ErrorGenerator.not_my_iterator(this.end_.source(), "insert");
      if (l.erased_ === !0)
        throw u.ErrorGenerator.erased_iterator(this.end_.source(), "insert");
      return h.length === 1 ? this._Insert_by_repeating_val(l, 1, h[0]) : h.length === 2 && typeof h[0] == "number" ? this._Insert_by_repeating_val(l, h[0], h[1]) : this._Insert_by_range(l, h[0], h[1]);
    }, c.prototype._Insert_by_repeating_val = function(l, h, d) {
      var p = new i.Repeater(0, d), y = new i.Repeater(h);
      return this._Insert_by_range(l, p, y);
    }, c.prototype._Insert_by_range = function(l, h, d) {
      for (var p = l.prev(), y = null, g = 0, m = h; m.equals(d) === !1; m = m.next()) {
        var x = this._Create_iterator(p, null, m.value);
        g === 0 && (y = x), n.ListIterator._Set_next(p, x), p = x, ++g;
      }
      return l.equals(this.begin()) === !0 && (this.begin_ = y), n.ListIterator._Set_next(p, l), n.ListIterator._Set_prev(l, p), this.size_ += g, y;
    }, c.prototype.erase = function(l, h) {
      return h === void 0 && (h = l.next()), this._Erase_by_range(l, h);
    }, c.prototype._Erase_by_range = function(l, h) {
      if (l.source() !== this.end_.source())
        throw u.ErrorGenerator.not_my_iterator(this.end_.source(), "insert");
      if (l.erased_ === !0)
        throw u.ErrorGenerator.erased_iterator(this.end_.source(), "insert");
      if (l.equals(this.end_))
        return this.end_;
      var d = l.prev();
      n.ListIterator._Set_next(d, h), n.ListIterator._Set_prev(h, d);
      for (var p = l; !p.equals(h); p = p.next())
        p.erased_ = !0, --this.size_;
      return l.equals(this.begin_) && (this.begin_ = h), h;
    }, c.prototype.swap = function(l) {
      var h, d, p;
      h = e([l.begin_, this.begin_], 2), this.begin_ = h[0], l.begin_ = h[1], d = e([l.end_, this.end_], 2), this.end_ = d[0], l.end_ = d[1], p = e([l.size_, this.size_], 2), this.size_ = p[0], l.size_ = p[1];
    }, c;
  }(r.Container);
  return ur.ListContainer = s, ur;
}
var cr = {}, zo;
function ys() {
  if (zo)
    return cr;
  zo = 1, Object.defineProperty(cr, "__esModule", { value: !0 }), cr.ReverseIterator = void 0;
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
var Vo;
function ml() {
  return Vo || (Vo = 1, function(t) {
    var e = C && C.__extends || function() {
      var u = function(s, f) {
        return u = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(c, l) {
          c.__proto__ = l;
        } || function(c, l) {
          for (var h in l)
            Object.prototype.hasOwnProperty.call(l, h) && (c[h] = l[h]);
        }, u(s, f);
      };
      return function(s, f) {
        if (typeof f != "function" && f !== null)
          throw new TypeError("Class extends value " + String(f) + " is not a constructor or null");
        u(s, f);
        function c() {
          this.constructor = s;
        }
        s.prototype = f === null ? Object.create(f) : (c.prototype = f.prototype, new c());
      };
    }(), r = C && C.__read || function(u, s) {
      var f = typeof Symbol == "function" && u[Symbol.iterator];
      if (!f)
        return u;
      var c = f.call(u), l, h = [], d;
      try {
        for (; (s === void 0 || s-- > 0) && !(l = c.next()).done; )
          h.push(l.value);
      } catch (p) {
        d = { error: p };
      } finally {
        try {
          l && !l.done && (f = c.return) && f.call(c);
        } finally {
          if (d)
            throw d.error;
        }
      }
      return h;
    };
    Object.defineProperty(t, "__esModule", { value: !0 }), t.SetElementList = void 0;
    var n = vs(), i = Vi(), o = ys(), a = function(u) {
      e(s, u);
      function s(f) {
        var c = u.call(this) || this;
        return c.associative_ = f, c;
      }
      return s.prototype._Create_iterator = function(f, c, l) {
        return s.Iterator.create(this, f, c, l);
      }, s._Swap_associative = function(f, c) {
        var l;
        l = r([c.associative_, f.associative_], 2), f.associative_ = l[0], c.associative_ = l[1];
      }, s.prototype.associative = function() {
        return this.associative_;
      }, s;
    }(n.ListContainer);
    t.SetElementList = a, function(u) {
      var s = function(c) {
        e(l, c);
        function l(h, d, p, y) {
          var g = c.call(this, d, p, y) || this;
          return g.source_ = h, g;
        }
        return l.create = function(h, d, p, y) {
          return new l(h, d, p, y);
        }, l.prototype.reverse = function() {
          return new f(this);
        }, l.prototype.source = function() {
          return this.source_.associative();
        }, l;
      }(i.ListIterator);
      u.Iterator = s;
      var f = function(c) {
        e(l, c);
        function l() {
          return c !== null && c.apply(this, arguments) || this;
        }
        return l.prototype._Create_neighbor = function(h) {
          return new l(h);
        }, l;
      }(o.ReverseIterator);
      u.ReverseIterator = f;
    }(a = t.SetElementList || (t.SetElementList = {})), t.SetElementList = a;
  }(ti)), ti;
}
var hr = {}, dr = {}, Go;
function gs() {
  if (Go)
    return dr;
  Go = 1;
  var t = C && C.__values || function(i) {
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
  Object.defineProperty(dr, "__esModule", { value: !0 }), dr.HashBuckets = void 0;
  var e = function() {
    function i(o, a) {
      this.fetcher_ = o, this.hasher_ = a, this.max_load_factor_ = n, this.data_ = [], this.size_ = 0, this.initialize();
    }
    return i.prototype.clear = function() {
      this.data_ = [], this.size_ = 0, this.initialize();
    }, i.prototype.rehash = function(o) {
      var a, u, s, f;
      o = Math.max(o, r);
      for (var c = [], l = 0; l < o; ++l)
        c.push([]);
      try {
        for (var h = t(this.data_), d = h.next(); !d.done; d = h.next()) {
          var p = d.value;
          try {
            for (var y = (s = void 0, t(p)), g = y.next(); !g.done; g = y.next()) {
              var m = g.value, x = this.hasher_(this.fetcher_(m)) % c.length;
              c[x].push(m);
            }
          } catch (S) {
            s = { error: S };
          } finally {
            try {
              g && !g.done && (f = y.return) && f.call(y);
            } finally {
              if (s)
                throw s.error;
            }
          }
        }
      } catch (S) {
        a = { error: S };
      } finally {
        try {
          d && !d.done && (u = h.return) && u.call(h);
        } finally {
          if (a)
            throw a.error;
        }
      }
      this.data_ = c;
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
  dr.HashBuckets = e;
  var r = 10, n = 1;
  return dr;
}
var Yo;
function xl() {
  if (Yo)
    return hr;
  Yo = 1;
  var t = C && C.__extends || function() {
    var a = function(u, s) {
      return a = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(f, c) {
        f.__proto__ = c;
      } || function(f, c) {
        for (var l in c)
          Object.prototype.hasOwnProperty.call(c, l) && (f[l] = c[l]);
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
  }(), e = C && C.__read || function(a, u) {
    var s = typeof Symbol == "function" && a[Symbol.iterator];
    if (!s)
      return a;
    var f = s.call(a), c, l = [], h;
    try {
      for (; (u === void 0 || u-- > 0) && !(c = f.next()).done; )
        l.push(c.value);
    } catch (d) {
      h = { error: d };
    } finally {
      try {
        c && !c.done && (s = f.return) && s.call(f);
      } finally {
        if (h)
          throw h.error;
      }
    }
    return l;
  }, r = C && C.__values || function(a) {
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
  Object.defineProperty(hr, "__esModule", { value: !0 }), hr.SetHashBuckets = void 0;
  var n = gs(), i = function(a) {
    t(u, a);
    function u(s, f, c) {
      var l = a.call(this, o, f) || this;
      return l.source_ = s, l.key_eq_ = c, l;
    }
    return u._Swap_source = function(s, f) {
      var c;
      c = e([f.source_, s.source_], 2), s.source_ = c[0], f.source_ = c[1];
    }, u.prototype.key_eq = function() {
      return this.key_eq_;
    }, u.prototype.find = function(s) {
      var f, c, l = this.hash_function()(s) % this.length(), h = this.at(l);
      try {
        for (var d = r(h), p = d.next(); !p.done; p = d.next()) {
          var y = p.value;
          if (this.key_eq_(y.value, s))
            return y;
        }
      } catch (g) {
        f = { error: g };
      } finally {
        try {
          p && !p.done && (c = d.return) && c.call(d);
        } finally {
          if (f)
            throw f.error;
        }
      }
      return this.source_.end();
    }, u;
  }(n.HashBuckets);
  hr.SetHashBuckets = i;
  function o(a) {
    return a.value;
  }
  return hr;
}
var gt = {}, Zo;
function bs() {
  if (Zo)
    return gt;
  Zo = 1, Object.defineProperty(gt, "__esModule", { value: !0 }), gt.make_pair = gt.Pair = void 0;
  var t = Wi(), e = zi(), r = function() {
    function i(o, a) {
      this.first = o, this.second = a;
    }
    return i.prototype.equals = function(o) {
      return (0, e.equal_to)(this.first, o.first) && (0, e.equal_to)(this.second, o.second);
    }, i.prototype.less = function(o) {
      return (0, e.equal_to)(this.first, o.first) === !1 ? (0, e.less)(this.first, o.first) : (0, e.less)(this.second, o.second);
    }, i.prototype.hashCode = function() {
      return (0, t.hash)(this.first, this.second);
    }, i;
  }();
  gt.Pair = r;
  function n(i, o) {
    return new r(i, o);
  }
  return gt.make_pair = n, gt;
}
var Ko;
function El() {
  return Ko || (Ko = 1, function(t) {
    var e = C && C.__extends || function() {
      var c = function(l, h) {
        return c = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d, p) {
          d.__proto__ = p;
        } || function(d, p) {
          for (var y in p)
            Object.prototype.hasOwnProperty.call(p, y) && (d[y] = p[y]);
        }, c(l, h);
      };
      return function(l, h) {
        if (typeof h != "function" && h !== null)
          throw new TypeError("Class extends value " + String(h) + " is not a constructor or null");
        c(l, h);
        function d() {
          this.constructor = l;
        }
        l.prototype = h === null ? Object.create(h) : (d.prototype = h.prototype, new d());
      };
    }(), r = C && C.__read || function(c, l) {
      var h = typeof Symbol == "function" && c[Symbol.iterator];
      if (!h)
        return c;
      var d = h.call(c), p, y = [], g;
      try {
        for (; (l === void 0 || l-- > 0) && !(p = d.next()).done; )
          y.push(p.value);
      } catch (m) {
        g = { error: m };
      } finally {
        try {
          p && !p.done && (h = d.return) && h.call(d);
        } finally {
          if (g)
            throw g.error;
        }
      }
      return y;
    }, n = C && C.__spreadArray || function(c, l, h) {
      if (h || arguments.length === 2)
        for (var d = 0, p = l.length, y; d < p; d++)
          (y || !(d in l)) && (y || (y = Array.prototype.slice.call(l, 0, d)), y[d] = l[d]);
      return c.concat(y || Array.prototype.slice.call(l));
    };
    Object.defineProperty(t, "__esModule", { value: !0 }), t.HashSet = void 0;
    var i = vl(), o = _s(), a = ml(), u = xl(), s = bs(), f = function(c) {
      e(l, c);
      function l() {
        for (var h = [], d = 0; d < arguments.length; d++)
          h[d] = arguments[d];
        var p = c.call(this, function(y) {
          return new a.SetElementList(y);
        }) || this;
        return o.IHashContainer.construct.apply(o.IHashContainer, n([
          p,
          l,
          function(y, g) {
            p.buckets_ = new u.SetHashBuckets(p, y, g);
          }
        ], r(h), !1)), p;
      }
      return l.prototype.clear = function() {
        this.buckets_.clear(), c.prototype.clear.call(this);
      }, l.prototype.swap = function(h) {
        var d, p;
        d = r([h.data_, this.data_], 2), this.data_ = d[0], h.data_ = d[1], a.SetElementList._Swap_associative(this.data_, h.data_), u.SetHashBuckets._Swap_source(this.buckets_, h.buckets_), p = r([h.buckets_, this.buckets_], 2), this.buckets_ = p[0], h.buckets_ = p[1];
      }, l.prototype.find = function(h) {
        return this.buckets_.find(h);
      }, l.prototype.begin = function(h) {
        return h === void 0 && (h = null), h === null ? c.prototype.begin.call(this) : this.buckets_.at(h)[0];
      }, l.prototype.end = function(h) {
        if (h === void 0 && (h = null), h === null)
          return c.prototype.end.call(this);
        var d = this.buckets_.at(h);
        return d[d.length - 1].next();
      }, l.prototype.rbegin = function(h) {
        return h === void 0 && (h = null), this.end(h).reverse();
      }, l.prototype.rend = function(h) {
        return h === void 0 && (h = null), this.begin(h).reverse();
      }, l.prototype.bucket_count = function() {
        return this.buckets_.length();
      }, l.prototype.bucket_size = function(h) {
        return this.buckets_.at(h).length;
      }, l.prototype.load_factor = function() {
        return this.buckets_.load_factor();
      }, l.prototype.hash_function = function() {
        return this.buckets_.hash_function();
      }, l.prototype.key_eq = function() {
        return this.buckets_.key_eq();
      }, l.prototype.bucket = function(h) {
        return this.hash_function()(h) % this.buckets_.length();
      }, l.prototype.max_load_factor = function(h) {
        return h === void 0 && (h = null), this.buckets_.max_load_factor(h);
      }, l.prototype.reserve = function(h) {
        this.buckets_.reserve(h);
      }, l.prototype.rehash = function(h) {
        this.buckets_.rehash(h);
      }, l.prototype._Insert_by_key = function(h) {
        var d = this.find(h);
        return d.equals(this.end()) === !1 ? new s.Pair(d, !1) : (this.data_.push(h), d = d.prev(), this._Handle_insert(d, d.next()), new s.Pair(d, !0));
      }, l.prototype._Insert_by_hint = function(h, d) {
        var p = this.find(d);
        return p.equals(this.end()) === !0 && (p = this.data_.insert(h, d), this._Handle_insert(p, p.next())), p;
      }, l.prototype._Handle_insert = function(h, d) {
        for (; !h.equals(d); h = h.next())
          this.buckets_.insert(h);
      }, l.prototype._Handle_erase = function(h, d) {
        for (; !h.equals(d); h = h.next())
          this.buckets_.erase(h);
      }, l;
    }(i.UniqueSet);
    t.HashSet = f, function(c) {
      c.Iterator = a.SetElementList.Iterator, c.ReverseIterator = a.SetElementList.ReverseIterator;
    }(f = t.HashSet || (t.HashSet = {})), t.HashSet = f;
  }(Xn)), Xn;
}
var ri = {}, pr = {}, _r = {}, Xo;
function Sl() {
  if (Xo)
    return _r;
  Xo = 1;
  var t = C && C.__extends || function() {
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
  Object.defineProperty(_r, "__esModule", { value: !0 }), _r.MapContainer = void 0;
  var e = $i(), r = Ui(), n = function(i) {
    t(o, i);
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
  }(e.Container);
  return _r.MapContainer = n, _r;
}
var Qo;
function Rl() {
  if (Qo)
    return pr;
  Qo = 1;
  var t = C && C.__extends || function() {
    var a = function(u, s) {
      return a = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(f, c) {
        f.__proto__ = c;
      } || function(f, c) {
        for (var l in c)
          Object.prototype.hasOwnProperty.call(c, l) && (f[l] = c[l]);
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
  }(), e = C && C.__read || function(a, u) {
    var s = typeof Symbol == "function" && a[Symbol.iterator];
    if (!s)
      return a;
    var f = s.call(a), c, l = [], h;
    try {
      for (; (u === void 0 || u-- > 0) && !(c = f.next()).done; )
        l.push(c.value);
    } catch (d) {
      h = { error: d };
    } finally {
      try {
        c && !c.done && (s = f.return) && s.call(f);
      } finally {
        if (h)
          throw h.error;
      }
    }
    return l;
  }, r = C && C.__spreadArray || function(a, u, s) {
    if (s || arguments.length === 2)
      for (var f = 0, c = u.length, l; f < c; f++)
        (l || !(f in u)) && (l || (l = Array.prototype.slice.call(u, 0, f)), l[f] = u[f]);
    return a.concat(l || Array.prototype.slice.call(u));
  };
  Object.defineProperty(pr, "__esModule", { value: !0 }), pr.UniqueMap = void 0;
  var n = Sl(), i = Rn(), o = function(a) {
    t(u, a);
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
      var c = this.find(s);
      return c.equals(this.end()) ? this.emplace(s, f()).first.second : c.second;
    }, u.prototype.set = function(s, f) {
      this.insert_or_assign(s, f);
    }, u.prototype.insert = function() {
      for (var s = [], f = 0; f < arguments.length; f++)
        s[f] = arguments[f];
      return a.prototype.insert.apply(this, r([], e(s), !1));
    }, u.prototype._Insert_by_range = function(s, f) {
      for (var c = s; !c.equals(f); c = c.next())
        this.emplace(c.value.first, c.value.second);
    }, u.prototype.insert_or_assign = function() {
      for (var s = [], f = 0; f < arguments.length; f++)
        s[f] = arguments[f];
      if (s.length === 2)
        return this._Insert_or_assign_with_key_value(s[0], s[1]);
      if (s.length === 3)
        return this._Insert_or_assign_with_hint(s[0], s[1], s[2]);
    }, u.prototype._Insert_or_assign_with_key_value = function(s, f) {
      var c = this.emplace(s, f);
      return c.second === !1 && (c.first.second = f), c;
    }, u.prototype._Insert_or_assign_with_hint = function(s, f, c) {
      var l = this.emplace_hint(s, f, c);
      return l.second !== c && (l.second = c), l;
    }, u.prototype.extract = function(s) {
      return s instanceof this.end().constructor ? this._Extract_by_iterator(s) : this._Extract_by_key(s);
    }, u.prototype._Extract_by_key = function(s) {
      var f = this.find(s);
      if (f.equals(this.end()) === !0)
        throw i.ErrorGenerator.key_nout_found(this, "extract", s);
      var c = f.value;
      return this._Erase_by_range(f), c;
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
  return pr.UniqueMap = o, pr;
}
var ni = {}, Jo;
function Cl() {
  return Jo || (Jo = 1, function(t) {
    var e = C && C.__extends || function() {
      var u = function(s, f) {
        return u = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(c, l) {
          c.__proto__ = l;
        } || function(c, l) {
          for (var h in l)
            Object.prototype.hasOwnProperty.call(l, h) && (c[h] = l[h]);
        }, u(s, f);
      };
      return function(s, f) {
        if (typeof f != "function" && f !== null)
          throw new TypeError("Class extends value " + String(f) + " is not a constructor or null");
        u(s, f);
        function c() {
          this.constructor = s;
        }
        s.prototype = f === null ? Object.create(f) : (c.prototype = f.prototype, new c());
      };
    }(), r = C && C.__read || function(u, s) {
      var f = typeof Symbol == "function" && u[Symbol.iterator];
      if (!f)
        return u;
      var c = f.call(u), l, h = [], d;
      try {
        for (; (s === void 0 || s-- > 0) && !(l = c.next()).done; )
          h.push(l.value);
      } catch (p) {
        d = { error: p };
      } finally {
        try {
          l && !l.done && (f = c.return) && f.call(c);
        } finally {
          if (d)
            throw d.error;
        }
      }
      return h;
    };
    Object.defineProperty(t, "__esModule", { value: !0 }), t.MapElementList = void 0;
    var n = vs(), i = Vi(), o = ys(), a = function(u) {
      e(s, u);
      function s(f) {
        var c = u.call(this) || this;
        return c.associative_ = f, c;
      }
      return s.prototype._Create_iterator = function(f, c, l) {
        return s.Iterator.create(this, f, c, l);
      }, s._Swap_associative = function(f, c) {
        var l;
        l = r([c.associative_, f.associative_], 2), f.associative_ = l[0], c.associative_ = l[1];
      }, s.prototype.associative = function() {
        return this.associative_;
      }, s;
    }(n.ListContainer);
    t.MapElementList = a, function(u) {
      var s = function(c) {
        e(l, c);
        function l(h, d, p, y) {
          var g = c.call(this, d, p, y) || this;
          return g.list_ = h, g;
        }
        return l.create = function(h, d, p, y) {
          return new l(h, d, p, y);
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
          set: function(h) {
            this.value.second = h;
          },
          enumerable: !1,
          configurable: !0
        }), l;
      }(i.ListIterator);
      u.Iterator = s;
      var f = function(c) {
        e(l, c);
        function l() {
          return c !== null && c.apply(this, arguments) || this;
        }
        return l.prototype._Create_neighbor = function(h) {
          return new l(h);
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
          set: function(h) {
            this.base_.second = h;
          },
          enumerable: !1,
          configurable: !0
        }), l;
      }(o.ReverseIterator);
      u.ReverseIterator = f;
    }(a = t.MapElementList || (t.MapElementList = {})), t.MapElementList = a;
  }(ni)), ni;
}
var vr = {}, ea;
function Ol() {
  if (ea)
    return vr;
  ea = 1;
  var t = C && C.__extends || function() {
    var a = function(u, s) {
      return a = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(f, c) {
        f.__proto__ = c;
      } || function(f, c) {
        for (var l in c)
          Object.prototype.hasOwnProperty.call(c, l) && (f[l] = c[l]);
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
  }(), e = C && C.__read || function(a, u) {
    var s = typeof Symbol == "function" && a[Symbol.iterator];
    if (!s)
      return a;
    var f = s.call(a), c, l = [], h;
    try {
      for (; (u === void 0 || u-- > 0) && !(c = f.next()).done; )
        l.push(c.value);
    } catch (d) {
      h = { error: d };
    } finally {
      try {
        c && !c.done && (s = f.return) && s.call(f);
      } finally {
        if (h)
          throw h.error;
      }
    }
    return l;
  }, r = C && C.__values || function(a) {
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
  Object.defineProperty(vr, "__esModule", { value: !0 }), vr.MapHashBuckets = void 0;
  var n = gs(), i = function(a) {
    t(u, a);
    function u(s, f, c) {
      var l = a.call(this, o, f) || this;
      return l.source_ = s, l.key_eq_ = c, l;
    }
    return u._Swap_source = function(s, f) {
      var c;
      c = e([f.source_, s.source_], 2), s.source_ = c[0], f.source_ = c[1];
    }, u.prototype.key_eq = function() {
      return this.key_eq_;
    }, u.prototype.find = function(s) {
      var f, c, l = this.hash_function()(s) % this.length(), h = this.at(l);
      try {
        for (var d = r(h), p = d.next(); !p.done; p = d.next()) {
          var y = p.value;
          if (this.key_eq_(y.first, s))
            return y;
        }
      } catch (g) {
        f = { error: g };
      } finally {
        try {
          p && !p.done && (c = d.return) && c.call(d);
        } finally {
          if (f)
            throw f.error;
        }
      }
      return this.source_.end();
    }, u;
  }(n.HashBuckets);
  vr.MapHashBuckets = i;
  function o(a) {
    return a.first;
  }
  return vr;
}
var yr = {}, ta;
function Al() {
  if (ta)
    return yr;
  ta = 1, Object.defineProperty(yr, "__esModule", { value: !0 }), yr.Entry = void 0;
  var t = Wi(), e = zi(), r = function() {
    function n(i, o) {
      this.first = i, this.second = o;
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
var ra;
function kl() {
  return ra || (ra = 1, function(t) {
    var e = C && C.__extends || function() {
      var l = function(h, d) {
        return l = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(p, y) {
          p.__proto__ = y;
        } || function(p, y) {
          for (var g in y)
            Object.prototype.hasOwnProperty.call(y, g) && (p[g] = y[g]);
        }, l(h, d);
      };
      return function(h, d) {
        if (typeof d != "function" && d !== null)
          throw new TypeError("Class extends value " + String(d) + " is not a constructor or null");
        l(h, d);
        function p() {
          this.constructor = h;
        }
        h.prototype = d === null ? Object.create(d) : (p.prototype = d.prototype, new p());
      };
    }(), r = C && C.__read || function(l, h) {
      var d = typeof Symbol == "function" && l[Symbol.iterator];
      if (!d)
        return l;
      var p = d.call(l), y, g = [], m;
      try {
        for (; (h === void 0 || h-- > 0) && !(y = p.next()).done; )
          g.push(y.value);
      } catch (x) {
        m = { error: x };
      } finally {
        try {
          y && !y.done && (d = p.return) && d.call(p);
        } finally {
          if (m)
            throw m.error;
        }
      }
      return g;
    }, n = C && C.__spreadArray || function(l, h, d) {
      if (d || arguments.length === 2)
        for (var p = 0, y = h.length, g; p < y; p++)
          (g || !(p in h)) && (g || (g = Array.prototype.slice.call(h, 0, p)), g[p] = h[p]);
      return l.concat(g || Array.prototype.slice.call(h));
    };
    Object.defineProperty(t, "__esModule", { value: !0 }), t.HashMap = void 0;
    var i = Rl(), o = _s(), a = Cl(), u = Ol(), s = Al(), f = bs(), c = function(l) {
      e(h, l);
      function h() {
        for (var d = [], p = 0; p < arguments.length; p++)
          d[p] = arguments[p];
        var y = l.call(this, function(g) {
          return new a.MapElementList(g);
        }) || this;
        return o.IHashContainer.construct.apply(o.IHashContainer, n([
          y,
          h,
          function(g, m) {
            y.buckets_ = new u.MapHashBuckets(y, g, m);
          }
        ], r(d), !1)), y;
      }
      return h.prototype.clear = function() {
        this.buckets_.clear(), l.prototype.clear.call(this);
      }, h.prototype.swap = function(d) {
        var p, y;
        p = r([d.data_, this.data_], 2), this.data_ = p[0], d.data_ = p[1], a.MapElementList._Swap_associative(this.data_, d.data_), u.MapHashBuckets._Swap_source(this.buckets_, d.buckets_), y = r([d.buckets_, this.buckets_], 2), this.buckets_ = y[0], d.buckets_ = y[1];
      }, h.prototype.find = function(d) {
        return this.buckets_.find(d);
      }, h.prototype.begin = function(d) {
        return d === void 0 && (d = null), d === null ? l.prototype.begin.call(this) : this.buckets_.at(d)[0];
      }, h.prototype.end = function(d) {
        if (d === void 0 && (d = null), d === null)
          return l.prototype.end.call(this);
        var p = this.buckets_.at(d);
        return p[p.length - 1].next();
      }, h.prototype.rbegin = function(d) {
        return d === void 0 && (d = null), this.end(d).reverse();
      }, h.prototype.rend = function(d) {
        return d === void 0 && (d = null), this.begin(d).reverse();
      }, h.prototype.bucket_count = function() {
        return this.buckets_.length();
      }, h.prototype.bucket_size = function(d) {
        return this.buckets_.at(d).length;
      }, h.prototype.load_factor = function() {
        return this.buckets_.load_factor();
      }, h.prototype.hash_function = function() {
        return this.buckets_.hash_function();
      }, h.prototype.key_eq = function() {
        return this.buckets_.key_eq();
      }, h.prototype.bucket = function(d) {
        return this.hash_function()(d) % this.buckets_.length();
      }, h.prototype.max_load_factor = function(d) {
        return d === void 0 && (d = null), this.buckets_.max_load_factor(d);
      }, h.prototype.reserve = function(d) {
        this.buckets_.reserve(d);
      }, h.prototype.rehash = function(d) {
        this.buckets_.rehash(d);
      }, h.prototype.emplace = function(d, p) {
        var y = this.find(d);
        return y.equals(this.end()) === !1 ? new f.Pair(y, !1) : (this.data_.push(new s.Entry(d, p)), y = y.prev(), this._Handle_insert(y, y.next()), new f.Pair(y, !0));
      }, h.prototype.emplace_hint = function(d, p, y) {
        var g = this.find(p);
        return g.equals(this.end()) === !0 && (g = this.data_.insert(d, new s.Entry(p, y)), this._Handle_insert(g, g.next())), g;
      }, h.prototype._Handle_insert = function(d, p) {
        for (; !d.equals(p); d = d.next())
          this.buckets_.insert(d);
      }, h.prototype._Handle_erase = function(d, p) {
        for (; !d.equals(p); d = d.next())
          this.buckets_.erase(d);
      }, h;
    }(i.UniqueMap);
    t.HashMap = c, function(l) {
      l.Iterator = a.MapElementList.Iterator, l.ReverseIterator = a.MapElementList.ReverseIterator;
    }(c = t.HashMap || (t.HashMap = {})), t.HashMap = c;
  }(ri)), ri;
}
var na;
function Ml() {
  if (na)
    return Yr;
  na = 1;
  var t = C && C.__values || function(i) {
    var o = typeof Symbol == "function" && i[Symbol.iterator], a = 0;
    return o ? o.call(i) : {
      next: function() {
        return i && a >= i.length && (i = void 0), { value: i && i[a++], done: !i };
      }
    };
  };
  Object.defineProperty(Yr, "__esModule", { value: !0 });
  var e = El(), r = kl(), n = function() {
    function i() {
      this.listeners_ = new r.HashMap(), this.created_at_ = new Date();
    }
    return i.prototype.dispatchEvent = function(o) {
      var a, u, s = this.listeners_.find(o.type);
      if (!s.equals(this.listeners_.end())) {
        o.target = this, o.timeStamp = new Date().getTime() - this.created_at_.getTime();
        try {
          for (var f = t(s.second), c = f.next(); !c.done; c = f.next()) {
            var l = c.value;
            l(o);
          }
        } catch (h) {
          a = { error: h };
        } finally {
          try {
            c && !c.done && (u = f.return) && u.call(f);
          } finally {
            if (a)
              throw a.error;
          }
        }
      }
    }, i.prototype.addEventListener = function(o, a) {
      var u = this.listeners_.find(o);
      u.equals(this.listeners_.end()) && (u = this.listeners_.emplace(o, new e.HashSet()).first), u.second.insert(a);
    }, i.prototype.removeEventListener = function(o, a) {
      var u = this.listeners_.find(o);
      u.equals(this.listeners_.end()) || (u.second.erase(a), u.second.empty() && this.listeners_.erase(u));
    }, i;
  }();
  return Yr.EventTarget = n, Yr;
}
var Zr = {}, ia;
function Cn() {
  if (ia)
    return Zr;
  ia = 1, Object.defineProperty(Zr, "__esModule", { value: !0 });
  var t = function() {
    function e(r, n) {
      this.type = r, n && Object.assign(this, n);
    }
    return e;
  }();
  return Zr.Event = t, Zr;
}
var Kr = {}, oa;
function Il() {
  if (oa)
    return Kr;
  oa = 1;
  var t = C && C.__extends || function() {
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
  Object.defineProperty(Kr, "__esModule", { value: !0 });
  var e = Cn(), r = function(n) {
    t(i, n);
    function i(o, a) {
      return n.call(this, o, a) || this;
    }
    return i;
  }(e.Event);
  return Kr.CloseEvent = r, Kr;
}
var Xr = {}, aa;
function Tl() {
  if (aa)
    return Xr;
  aa = 1;
  var t = C && C.__extends || function() {
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
  Object.defineProperty(Xr, "__esModule", { value: !0 });
  var e = Cn(), r = function(n) {
    t(i, n);
    function i(o, a) {
      return n.call(this, o, a) || this;
    }
    return i;
  }(e.Event);
  return Xr.MessageEvent = r, Xr;
}
var Qr = {}, sa;
function Bl() {
  if (sa)
    return Qr;
  sa = 1;
  var t = C && C.__extends || function() {
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
  Object.defineProperty(Qr, "__esModule", { value: !0 });
  var e = Cn(), r = function(n) {
    t(i, n);
    function i(o, a) {
      return n.call(this, o, a) || this;
    }
    return i;
  }(e.Event);
  return Qr.ErrorEvent = r, Qr;
}
var ua;
function Ll() {
  return ua || (ua = 1, function(t) {
    var e = C && C.__extends || function() {
      var l = function(h, d) {
        return l = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(p, y) {
          p.__proto__ = y;
        } || function(p, y) {
          for (var g in y)
            y.hasOwnProperty(g) && (p[g] = y[g]);
        }, l(h, d);
      };
      return function(h, d) {
        l(h, d);
        function p() {
          this.constructor = h;
        }
        h.prototype = d === null ? Object.create(d) : (p.prototype = d.prototype, new p());
      };
    }(), r = C && C.__assign || function() {
      return r = Object.assign || function(l) {
        for (var h, d = 1, p = arguments.length; d < p; d++) {
          h = arguments[d];
          for (var y in h)
            Object.prototype.hasOwnProperty.call(h, y) && (l[y] = h[y]);
        }
        return l;
      }, r.apply(this, arguments);
    };
    Object.defineProperty(t, "__esModule", { value: !0 });
    var n = cl(), i = Ml(), o = Cn(), a = Il(), u = Tl(), s = Bl(), f = function(l) {
      e(h, l);
      function h(d, p) {
        var y = l.call(this) || this;
        return y.on_ = {}, y.state_ = h.CONNECTING, y.client_ = new n.client(), y.client_.on("connect", y._Handle_connect.bind(y)), y.client_.on("connectFailed", y._Handle_error.bind(y)), typeof p == "string" && (p = [p]), y.client_.connect(d, p), y;
      }
      return h.prototype.close = function(d, p) {
        this.state_ = h.CLOSING, d === void 0 ? this.connection_.sendCloseFrame() : this.connection_.sendCloseFrame(d, p, !0);
      }, h.prototype.send = function(d) {
        if (typeof d.valueOf() == "string")
          this.connection_.sendUTF(d);
        else {
          var p = void 0;
          d instanceof E ? p = d : d instanceof Blob ? p = new E(d, "blob") : d.buffer ? p = new E(d.buffer) : p = new E(d), this.connection_.sendBytes(p);
        }
      }, Object.defineProperty(h.prototype, "url", {
        get: function() {
          return this.client_.url.href;
        },
        enumerable: !0,
        configurable: !0
      }), Object.defineProperty(h.prototype, "protocol", {
        get: function() {
          return this.client_.protocols ? this.client_.protocols[0] : "";
        },
        enumerable: !0,
        configurable: !0
      }), Object.defineProperty(h.prototype, "extensions", {
        get: function() {
          return this.connection_ && this.connection_.extensions ? this.connection_.extensions[0].name : "";
        },
        enumerable: !0,
        configurable: !0
      }), Object.defineProperty(h.prototype, "readyState", {
        get: function() {
          return this.state_;
        },
        enumerable: !0,
        configurable: !0
      }), Object.defineProperty(h.prototype, "bufferedAmount", {
        get: function() {
          return this.connection_.bytesWaitingToFlush;
        },
        enumerable: !0,
        configurable: !0
      }), Object.defineProperty(h.prototype, "binaryType", {
        get: function() {
          return "arraybuffer";
        },
        enumerable: !0,
        configurable: !0
      }), Object.defineProperty(h.prototype, "onopen", {
        get: function() {
          return this.on_.open;
        },
        set: function(d) {
          this._Set_on("open", d);
        },
        enumerable: !0,
        configurable: !0
      }), Object.defineProperty(h.prototype, "onclose", {
        get: function() {
          return this.on_.close;
        },
        set: function(d) {
          this._Set_on("close", d);
        },
        enumerable: !0,
        configurable: !0
      }), Object.defineProperty(h.prototype, "onmessage", {
        get: function() {
          return this.on_.message;
        },
        set: function(d) {
          this._Set_on("message", d);
        },
        enumerable: !0,
        configurable: !0
      }), Object.defineProperty(h.prototype, "onerror", {
        get: function() {
          return this.on_.error;
        },
        set: function(d) {
          this._Set_on("error", d);
        },
        enumerable: !0,
        configurable: !0
      }), h.prototype._Set_on = function(d, p) {
        this.on_[d] && this.removeEventListener(d, this.on_[d]), this.addEventListener(d, p), this.on_[d] = p;
      }, h.prototype._Handle_connect = function(d) {
        this.connection_ = d, this.state_ = h.OPEN, this.connection_.on("message", this._Handle_message.bind(this)), this.connection_.on("error", this._Handle_error.bind(this)), this.connection_.on("close", this._Handle_close.bind(this));
        var p = new o.Event("open", c);
        this.dispatchEvent(p);
      }, h.prototype._Handle_close = function(d, p) {
        var y = new a.CloseEvent("close", r({}, c, { code: d, reason: p }));
        this.state_ = h.CLOSED, this.dispatchEvent(y);
      }, h.prototype._Handle_message = function(d) {
        var p = new u.MessageEvent("message", r({}, c, { data: d.binaryData ? d.binaryData : d.utf8Data }));
        this.dispatchEvent(p);
      }, h.prototype._Handle_error = function(d) {
        var p = new s.ErrorEvent("error", r({}, c, { error: d, message: d.message }));
        this.state_ === h.CONNECTING && (this.state_ = h.CLOSED), this.dispatchEvent(p);
      }, h;
    }(i.EventTarget);
    t.WebSocket = f, function(l) {
      l.CONNECTING = 0, l.OPEN = 1, l.CLOSING = 2, l.CLOSED = 3;
    }(f = t.WebSocket || (t.WebSocket = {})), t.WebSocket = f;
    var c = {
      bubbles: !1,
      cancelable: !1
    };
  }(Gn)), Gn;
}
var Pl = Pr;
Pl.is_node() && (C.WebSocket = Ll().WebSocket);
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
var Pe = { exports: {} };
const Hr = /* @__PURE__ */ Fi(Ff);
/*! safe-buffer. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> */
(function(t, e) {
  var r = Hr, n = r.Buffer;
  function i(a, u) {
    for (var s in a)
      u[s] = a[s];
  }
  n.from && n.alloc && n.allocUnsafe && n.allocUnsafeSlow ? t.exports = r : (i(r, e), e.Buffer = o);
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
})(Pe, Pe.exports);
var Ri = { exports: {} }, N = { exports: {} }, pe = N.exports = {}, Ye, Ze;
function Ci() {
  throw new Error("setTimeout has not been defined");
}
function Oi() {
  throw new Error("clearTimeout has not been defined");
}
(function() {
  try {
    typeof setTimeout == "function" ? Ye = setTimeout : Ye = Ci;
  } catch {
    Ye = Ci;
  }
  try {
    typeof clearTimeout == "function" ? Ze = clearTimeout : Ze = Oi;
  } catch {
    Ze = Oi;
  }
})();
function ws(t) {
  if (Ye === setTimeout)
    return setTimeout(t, 0);
  if ((Ye === Ci || !Ye) && setTimeout)
    return Ye = setTimeout, setTimeout(t, 0);
  try {
    return Ye(t, 0);
  } catch {
    try {
      return Ye.call(null, t, 0);
    } catch {
      return Ye.call(this, t, 0);
    }
  }
}
function Hl(t) {
  if (Ze === clearTimeout)
    return clearTimeout(t);
  if ((Ze === Oi || !Ze) && clearTimeout)
    return Ze = clearTimeout, clearTimeout(t);
  try {
    return Ze(t);
  } catch {
    try {
      return Ze.call(null, t);
    } catch {
      return Ze.call(this, t);
    }
  }
}
var ot = [], Ht = !1, mt, nn = -1;
function ql() {
  !Ht || !mt || (Ht = !1, mt.length ? ot = mt.concat(ot) : nn = -1, ot.length && ms());
}
function ms() {
  if (!Ht) {
    var t = ws(ql);
    Ht = !0;
    for (var e = ot.length; e; ) {
      for (mt = ot, ot = []; ++nn < e; )
        mt && mt[nn].run();
      nn = -1, e = ot.length;
    }
    mt = null, Ht = !1, Hl(t);
  }
}
pe.nextTick = function(t) {
  var e = new Array(arguments.length - 1);
  if (arguments.length > 1)
    for (var r = 1; r < arguments.length; r++)
      e[r - 1] = arguments[r];
  ot.push(new xs(t, e)), ot.length === 1 && !Ht && ws(ms);
};
function xs(t, e) {
  this.fun = t, this.array = e;
}
xs.prototype.run = function() {
  this.fun.apply(null, this.array);
};
pe.title = "browser";
pe.browser = !0;
pe.env = {};
pe.argv = [];
pe.version = "";
pe.versions = {};
function ut() {
}
pe.on = ut;
pe.addListener = ut;
pe.once = ut;
pe.off = ut;
pe.removeListener = ut;
pe.removeAllListeners = ut;
pe.emit = ut;
pe.prependListener = ut;
pe.prependOnceListener = ut;
pe.listeners = function(t) {
  return [];
};
pe.binding = function(t) {
  throw new Error("process.binding is not supported");
};
pe.cwd = function() {
  return "/";
};
pe.chdir = function(t) {
  throw new Error("process.chdir is not supported");
};
pe.umask = function() {
  return 0;
};
var Fe = { exports: {} }, qt = typeof Reflect == "object" ? Reflect : null, fa = qt && typeof qt.apply == "function" ? qt.apply : function(e, r, n) {
  return Function.prototype.apply.call(e, r, n);
}, on;
qt && typeof qt.ownKeys == "function" ? on = qt.ownKeys : Object.getOwnPropertySymbols ? on = function(e) {
  return Object.getOwnPropertyNames(e).concat(Object.getOwnPropertySymbols(e));
} : on = function(e) {
  return Object.getOwnPropertyNames(e);
};
function Dl(t) {
  console && console.warn && console.warn(t);
}
var Es = Number.isNaN || function(e) {
  return e !== e;
};
function te() {
  te.init.call(this);
}
Fe.exports = te;
Fe.exports.once = $l;
te.EventEmitter = te;
te.prototype._events = void 0;
te.prototype._eventsCount = 0;
te.prototype._maxListeners = void 0;
var la = 10;
function On(t) {
  if (typeof t != "function")
    throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof t);
}
Object.defineProperty(te, "defaultMaxListeners", {
  enumerable: !0,
  get: function() {
    return la;
  },
  set: function(t) {
    if (typeof t != "number" || t < 0 || Es(t))
      throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + t + ".");
    la = t;
  }
});
te.init = function() {
  (this._events === void 0 || this._events === Object.getPrototypeOf(this)._events) && (this._events = /* @__PURE__ */ Object.create(null), this._eventsCount = 0), this._maxListeners = this._maxListeners || void 0;
};
te.prototype.setMaxListeners = function(e) {
  if (typeof e != "number" || e < 0 || Es(e))
    throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + e + ".");
  return this._maxListeners = e, this;
};
function Ss(t) {
  return t._maxListeners === void 0 ? te.defaultMaxListeners : t._maxListeners;
}
te.prototype.getMaxListeners = function() {
  return Ss(this);
};
te.prototype.emit = function(e) {
  for (var r = [], n = 1; n < arguments.length; n++)
    r.push(arguments[n]);
  var i = e === "error", o = this._events;
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
  var s = o[e];
  if (s === void 0)
    return !1;
  if (typeof s == "function")
    fa(s, this, r);
  else
    for (var f = s.length, c = ks(s, f), n = 0; n < f; ++n)
      fa(c[n], this, r);
  return !0;
};
function Rs(t, e, r, n) {
  var i, o, a;
  if (On(r), o = t._events, o === void 0 ? (o = t._events = /* @__PURE__ */ Object.create(null), t._eventsCount = 0) : (o.newListener !== void 0 && (t.emit(
    "newListener",
    e,
    r.listener ? r.listener : r
  ), o = t._events), a = o[e]), a === void 0)
    a = o[e] = r, ++t._eventsCount;
  else if (typeof a == "function" ? a = o[e] = n ? [r, a] : [a, r] : n ? a.unshift(r) : a.push(r), i = Ss(t), i > 0 && a.length > i && !a.warned) {
    a.warned = !0;
    var u = new Error("Possible EventEmitter memory leak detected. " + a.length + " " + String(e) + " listeners added. Use emitter.setMaxListeners() to increase limit");
    u.name = "MaxListenersExceededWarning", u.emitter = t, u.type = e, u.count = a.length, Dl(u);
  }
  return t;
}
te.prototype.addListener = function(e, r) {
  return Rs(this, e, r, !1);
};
te.prototype.on = te.prototype.addListener;
te.prototype.prependListener = function(e, r) {
  return Rs(this, e, r, !0);
};
function jl() {
  if (!this.fired)
    return this.target.removeListener(this.type, this.wrapFn), this.fired = !0, arguments.length === 0 ? this.listener.call(this.target) : this.listener.apply(this.target, arguments);
}
function Cs(t, e, r) {
  var n = { fired: !1, wrapFn: void 0, target: t, type: e, listener: r }, i = jl.bind(n);
  return i.listener = r, n.wrapFn = i, i;
}
te.prototype.once = function(e, r) {
  return On(r), this.on(e, Cs(this, e, r)), this;
};
te.prototype.prependOnceListener = function(e, r) {
  return On(r), this.prependListener(e, Cs(this, e, r)), this;
};
te.prototype.removeListener = function(e, r) {
  var n, i, o, a, u;
  if (On(r), i = this._events, i === void 0)
    return this;
  if (n = i[e], n === void 0)
    return this;
  if (n === r || n.listener === r)
    --this._eventsCount === 0 ? this._events = /* @__PURE__ */ Object.create(null) : (delete i[e], i.removeListener && this.emit("removeListener", e, n.listener || r));
  else if (typeof n != "function") {
    for (o = -1, a = n.length - 1; a >= 0; a--)
      if (n[a] === r || n[a].listener === r) {
        u = n[a].listener, o = a;
        break;
      }
    if (o < 0)
      return this;
    o === 0 ? n.shift() : Nl(n, o), n.length === 1 && (i[e] = n[0]), i.removeListener !== void 0 && this.emit("removeListener", e, u || r);
  }
  return this;
};
te.prototype.off = te.prototype.removeListener;
te.prototype.removeAllListeners = function(e) {
  var r, n, i;
  if (n = this._events, n === void 0)
    return this;
  if (n.removeListener === void 0)
    return arguments.length === 0 ? (this._events = /* @__PURE__ */ Object.create(null), this._eventsCount = 0) : n[e] !== void 0 && (--this._eventsCount === 0 ? this._events = /* @__PURE__ */ Object.create(null) : delete n[e]), this;
  if (arguments.length === 0) {
    var o = Object.keys(n), a;
    for (i = 0; i < o.length; ++i)
      a = o[i], a !== "removeListener" && this.removeAllListeners(a);
    return this.removeAllListeners("removeListener"), this._events = /* @__PURE__ */ Object.create(null), this._eventsCount = 0, this;
  }
  if (r = n[e], typeof r == "function")
    this.removeListener(e, r);
  else if (r !== void 0)
    for (i = r.length - 1; i >= 0; i--)
      this.removeListener(e, r[i]);
  return this;
};
function Os(t, e, r) {
  var n = t._events;
  if (n === void 0)
    return [];
  var i = n[e];
  return i === void 0 ? [] : typeof i == "function" ? r ? [i.listener || i] : [i] : r ? Fl(i) : ks(i, i.length);
}
te.prototype.listeners = function(e) {
  return Os(this, e, !0);
};
te.prototype.rawListeners = function(e) {
  return Os(this, e, !1);
};
te.listenerCount = function(t, e) {
  return typeof t.listenerCount == "function" ? t.listenerCount(e) : As.call(t, e);
};
te.prototype.listenerCount = As;
function As(t) {
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
te.prototype.eventNames = function() {
  return this._eventsCount > 0 ? on(this._events) : [];
};
function ks(t, e) {
  for (var r = new Array(e), n = 0; n < e; ++n)
    r[n] = t[n];
  return r;
}
function Nl(t, e) {
  for (; e + 1 < t.length; e++)
    t[e] = t[e + 1];
  t.pop();
}
function Fl(t) {
  for (var e = new Array(t.length), r = 0; r < e.length; ++r)
    e[r] = t[r].listener || t[r];
  return e;
}
function $l(t, e) {
  return new Promise(function(r, n) {
    function i(a) {
      t.removeListener(e, o), n(a);
    }
    function o() {
      typeof t.removeListener == "function" && t.removeListener("error", i), r([].slice.call(arguments));
    }
    Ms(t, e, o, { once: !0 }), e !== "error" && Ul(t, i, { once: !0 });
  });
}
function Ul(t, e, r) {
  typeof t.on == "function" && Ms(t, "error", e, r);
}
function Ms(t, e, r, n) {
  if (typeof t.on == "function")
    n.once ? t.once(e, r) : t.on(e, r);
  else if (typeof t.addEventListener == "function")
    t.addEventListener(e, function i(o) {
      n.once && t.removeEventListener(e, i), r(o);
    });
  else
    throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + typeof t);
}
var Is = Fe.exports.EventEmitter, Ai;
typeof Object.create == "function" ? Ai = function(e, r) {
  e.super_ = r, e.prototype = Object.create(r.prototype, {
    constructor: {
      value: e,
      enumerable: !1,
      writable: !0,
      configurable: !0
    }
  });
} : Ai = function(e, r) {
  e.super_ = r;
  var n = function() {
  };
  n.prototype = r.prototype, e.prototype = new n(), e.prototype.constructor = e;
};
const vt = Ai;
var Wl = /%[sdj%]/g;
function An(t) {
  if (!Dr(t)) {
    for (var e = [], r = 0; r < arguments.length; r++)
      e.push(Qe(arguments[r]));
    return e.join(" ");
  }
  for (var r = 1, n = arguments, i = n.length, o = String(t).replace(Wl, function(u) {
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
    qr(a) || !At(a) ? o += " " + a : o += " " + Qe(a);
  return o;
}
function kn(t, e) {
  if (Xe(Ei.process))
    return function() {
      return kn(t, e).apply(this, arguments);
    };
  if (N.exports.noDeprecation === !0)
    return t;
  var r = !1;
  function n() {
    if (!r) {
      if (N.exports.throwDeprecation)
        throw new Error(e);
      N.exports.traceDeprecation ? console.trace(e) : console.error(e), r = !0;
    }
    return t.apply(this, arguments);
  }
  return n;
}
var Jr = {}, ii;
function Gi(t) {
  if (Xe(ii) && (ii = N.exports.env.NODE_DEBUG || ""), t = t.toUpperCase(), !Jr[t])
    if (new RegExp("\\b" + t + "\\b", "i").test(ii)) {
      var e = 0;
      Jr[t] = function() {
        var r = An.apply(null, arguments);
        console.error("%s %d: %s", t, e, r);
      };
    } else
      Jr[t] = function() {
      };
  return Jr[t];
}
function Qe(t, e) {
  var r = {
    seen: [],
    stylize: Vl
  };
  return arguments.length >= 3 && (r.depth = arguments[2]), arguments.length >= 4 && (r.colors = arguments[3]), Mn(e) ? r.showHidden = e : e && Xi(r, e), Xe(r.showHidden) && (r.showHidden = !1), Xe(r.depth) && (r.depth = 2), Xe(r.colors) && (r.colors = !1), Xe(r.customInspect) && (r.customInspect = !0), r.colors && (r.stylize = zl), vn(r, t, r.depth);
}
Qe.colors = {
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
Qe.styles = {
  special: "cyan",
  number: "yellow",
  boolean: "yellow",
  undefined: "grey",
  null: "bold",
  string: "green",
  date: "magenta",
  regexp: "red"
};
function zl(t, e) {
  var r = Qe.styles[e];
  return r ? "\x1B[" + Qe.colors[r][0] + "m" + t + "\x1B[" + Qe.colors[r][1] + "m" : t;
}
function Vl(t, e) {
  return t;
}
function Gl(t) {
  var e = {};
  return t.forEach(function(r, n) {
    e[r] = !0;
  }), e;
}
function vn(t, e, r) {
  if (t.customInspect && e && kr(e.inspect) && e.inspect !== Qe && !(e.constructor && e.constructor.prototype === e)) {
    var n = e.inspect(r, t);
    return Dr(n) || (n = vn(t, n, r)), n;
  }
  var i = Yl(t, e);
  if (i)
    return i;
  var o = Object.keys(e), a = Gl(o);
  if (t.showHidden && (o = Object.getOwnPropertyNames(e)), Ar(e) && (o.indexOf("message") >= 0 || o.indexOf("description") >= 0))
    return oi(e);
  if (o.length === 0) {
    if (kr(e)) {
      var u = e.name ? ": " + e.name : "";
      return t.stylize("[Function" + u + "]", "special");
    }
    if (Or(e))
      return t.stylize(RegExp.prototype.toString.call(e), "regexp");
    if (yn(e))
      return t.stylize(Date.prototype.toString.call(e), "date");
    if (Ar(e))
      return oi(e);
  }
  var s = "", f = !1, c = ["{", "}"];
  if (Yi(e) && (f = !0, c = ["[", "]"]), kr(e)) {
    var l = e.name ? ": " + e.name : "";
    s = " [Function" + l + "]";
  }
  if (Or(e) && (s = " " + RegExp.prototype.toString.call(e)), yn(e) && (s = " " + Date.prototype.toUTCString.call(e)), Ar(e) && (s = " " + oi(e)), o.length === 0 && (!f || e.length == 0))
    return c[0] + s + c[1];
  if (r < 0)
    return Or(e) ? t.stylize(RegExp.prototype.toString.call(e), "regexp") : t.stylize("[Object]", "special");
  t.seen.push(e);
  var h;
  return f ? h = Zl(t, e, r, a, o) : h = o.map(function(d) {
    return ki(t, e, r, a, d, f);
  }), t.seen.pop(), Kl(h, s, c);
}
function Yl(t, e) {
  if (Xe(e))
    return t.stylize("undefined", "undefined");
  if (Dr(e)) {
    var r = "'" + JSON.stringify(e).replace(/^"|"$/g, "").replace(/'/g, "\\'").replace(/\\"/g, '"') + "'";
    return t.stylize(r, "string");
  }
  if (Zi(e))
    return t.stylize("" + e, "number");
  if (Mn(e))
    return t.stylize("" + e, "boolean");
  if (qr(e))
    return t.stylize("null", "null");
}
function oi(t) {
  return "[" + Error.prototype.toString.call(t) + "]";
}
function Zl(t, e, r, n, i) {
  for (var o = [], a = 0, u = e.length; a < u; ++a)
    qs(e, String(a)) ? o.push(ki(
      t,
      e,
      r,
      n,
      String(a),
      !0
    )) : o.push("");
  return i.forEach(function(s) {
    s.match(/^\d+$/) || o.push(ki(
      t,
      e,
      r,
      n,
      s,
      !0
    ));
  }), o;
}
function ki(t, e, r, n, i, o) {
  var a, u, s;
  if (s = Object.getOwnPropertyDescriptor(e, i) || { value: e[i] }, s.get ? s.set ? u = t.stylize("[Getter/Setter]", "special") : u = t.stylize("[Getter]", "special") : s.set && (u = t.stylize("[Setter]", "special")), qs(n, i) || (a = "[" + i + "]"), u || (t.seen.indexOf(s.value) < 0 ? (qr(r) ? u = vn(t, s.value, null) : u = vn(t, s.value, r - 1), u.indexOf(`
`) > -1 && (o ? u = u.split(`
`).map(function(f) {
    return "  " + f;
  }).join(`
`).substr(2) : u = `
` + u.split(`
`).map(function(f) {
    return "   " + f;
  }).join(`
`))) : u = t.stylize("[Circular]", "special")), Xe(a)) {
    if (o && i.match(/^\d+$/))
      return u;
    a = JSON.stringify("" + i), a.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/) ? (a = a.substr(1, a.length - 2), a = t.stylize(a, "name")) : (a = a.replace(/'/g, "\\'").replace(/\\"/g, '"').replace(/(^"|"$)/g, "'"), a = t.stylize(a, "string"));
  }
  return a + ": " + u;
}
function Kl(t, e, r) {
  var n = t.reduce(function(i, o) {
    return o.indexOf(`
`) >= 0, i + o.replace(/\u001b\[\d\d?m/g, "").length + 1;
  }, 0);
  return n > 60 ? r[0] + (e === "" ? "" : e + `
 `) + " " + t.join(`,
  `) + " " + r[1] : r[0] + e + " " + t.join(", ") + " " + r[1];
}
function Yi(t) {
  return Array.isArray(t);
}
function Mn(t) {
  return typeof t == "boolean";
}
function qr(t) {
  return t === null;
}
function Ts(t) {
  return t == null;
}
function Zi(t) {
  return typeof t == "number";
}
function Dr(t) {
  return typeof t == "string";
}
function Bs(t) {
  return typeof t == "symbol";
}
function Xe(t) {
  return t === void 0;
}
function Or(t) {
  return At(t) && Ki(t) === "[object RegExp]";
}
function At(t) {
  return typeof t == "object" && t !== null;
}
function yn(t) {
  return At(t) && Ki(t) === "[object Date]";
}
function Ar(t) {
  return At(t) && (Ki(t) === "[object Error]" || t instanceof Error);
}
function kr(t) {
  return typeof t == "function";
}
function Ls(t) {
  return t === null || typeof t == "boolean" || typeof t == "number" || typeof t == "string" || typeof t == "symbol" || typeof t > "u";
}
function Ps(t) {
  return E.isBuffer(t);
}
function Ki(t) {
  return Object.prototype.toString.call(t);
}
function ai(t) {
  return t < 10 ? "0" + t.toString(10) : t.toString(10);
}
var Xl = [
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
function Ql() {
  var t = new Date(), e = [
    ai(t.getHours()),
    ai(t.getMinutes()),
    ai(t.getSeconds())
  ].join(":");
  return [t.getDate(), Xl[t.getMonth()], e].join(" ");
}
function Hs() {
  console.log("%s - %s", Ql(), An.apply(null, arguments));
}
function Xi(t, e) {
  if (!e || !At(e))
    return t;
  for (var r = Object.keys(e), n = r.length; n--; )
    t[r[n]] = e[r[n]];
  return t;
}
function qs(t, e) {
  return Object.prototype.hasOwnProperty.call(t, e);
}
const Jl = {
  inherits: vt,
  _extend: Xi,
  log: Hs,
  isBuffer: Ps,
  isPrimitive: Ls,
  isFunction: kr,
  isError: Ar,
  isDate: yn,
  isObject: At,
  isRegExp: Or,
  isUndefined: Xe,
  isSymbol: Bs,
  isString: Dr,
  isNumber: Zi,
  isNullOrUndefined: Ts,
  isNull: qr,
  isBoolean: Mn,
  isArray: Yi,
  inspect: Qe,
  deprecate: kn,
  format: An,
  debuglog: Gi
}, ec = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  format: An,
  deprecate: kn,
  debuglog: Gi,
  inspect: Qe,
  isArray: Yi,
  isBoolean: Mn,
  isNull: qr,
  isNullOrUndefined: Ts,
  isNumber: Zi,
  isString: Dr,
  isSymbol: Bs,
  isUndefined: Xe,
  isRegExp: Or,
  isObject: At,
  isDate: yn,
  isError: Ar,
  isFunction: kr,
  isPrimitive: Ls,
  isBuffer: Ps,
  log: Hs,
  inherits: vt,
  _extend: Xi,
  default: Jl
}, Symbol.toStringTag, { value: "Module" })), Ds = /* @__PURE__ */ Fi(ec);
var si, ca;
function tc() {
  if (ca)
    return si;
  ca = 1;
  function t(h, d) {
    var p = Object.keys(h);
    if (Object.getOwnPropertySymbols) {
      var y = Object.getOwnPropertySymbols(h);
      d && (y = y.filter(function(g) {
        return Object.getOwnPropertyDescriptor(h, g).enumerable;
      })), p.push.apply(p, y);
    }
    return p;
  }
  function e(h) {
    for (var d = 1; d < arguments.length; d++) {
      var p = arguments[d] != null ? arguments[d] : {};
      d % 2 ? t(Object(p), !0).forEach(function(y) {
        r(h, y, p[y]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(h, Object.getOwnPropertyDescriptors(p)) : t(Object(p)).forEach(function(y) {
        Object.defineProperty(h, y, Object.getOwnPropertyDescriptor(p, y));
      });
    }
    return h;
  }
  function r(h, d, p) {
    return d in h ? Object.defineProperty(h, d, { value: p, enumerable: !0, configurable: !0, writable: !0 }) : h[d] = p, h;
  }
  function n(h, d) {
    if (!(h instanceof d))
      throw new TypeError("Cannot call a class as a function");
  }
  function i(h, d) {
    for (var p = 0; p < d.length; p++) {
      var y = d[p];
      y.enumerable = y.enumerable || !1, y.configurable = !0, "value" in y && (y.writable = !0), Object.defineProperty(h, y.key, y);
    }
  }
  function o(h, d, p) {
    return d && i(h.prototype, d), p && i(h, p), h;
  }
  var a = Hr, u = a.Buffer, s = Ds, f = s.inspect, c = f && f.custom || "inspect";
  function l(h, d, p) {
    u.prototype.copy.call(h, d, p);
  }
  return si = /* @__PURE__ */ function() {
    function h() {
      n(this, h), this.head = null, this.tail = null, this.length = 0;
    }
    return o(h, [{
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
        for (var y = u.allocUnsafe(p >>> 0), g = this.head, m = 0; g; )
          l(g.data, y, m), m += g.data.length, g = g.next;
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
        var y = this.head, g = 1, m = y.data;
        for (p -= m.length; y = y.next; ) {
          var x = y.data, S = p > x.length ? x.length : p;
          if (S === x.length ? m += x : m += x.slice(0, p), p -= S, p === 0) {
            S === x.length ? (++g, y.next ? this.head = y.next : this.head = this.tail = null) : (this.head = y, y.data = x.slice(S));
            break;
          }
          ++g;
        }
        return this.length -= g, m;
      }
    }, {
      key: "_getBuffer",
      value: function(p) {
        var y = u.allocUnsafe(p), g = this.head, m = 1;
        for (g.data.copy(y), p -= g.data.length; g = g.next; ) {
          var x = g.data, S = p > x.length ? x.length : p;
          if (x.copy(y, y.length - p, 0, S), p -= S, p === 0) {
            S === x.length ? (++m, g.next ? this.head = g.next : this.head = this.tail = null) : (this.head = g, g.data = x.slice(S));
            break;
          }
          ++m;
        }
        return this.length -= m, y;
      }
    }, {
      key: c,
      value: function(p, y) {
        return f(this, e({}, y, {
          depth: 0,
          customInspect: !1
        }));
      }
    }]), h;
  }(), si;
}
function rc(t, e) {
  var r = this, n = this._readableState && this._readableState.destroyed, i = this._writableState && this._writableState.destroyed;
  return n || i ? (e ? e(t) : t && (this._writableState ? this._writableState.errorEmitted || (this._writableState.errorEmitted = !0, N.exports.nextTick(Mi, this, t)) : N.exports.nextTick(Mi, this, t)), this) : (this._readableState && (this._readableState.destroyed = !0), this._writableState && (this._writableState.destroyed = !0), this._destroy(t || null, function(o) {
    !e && o ? r._writableState ? r._writableState.errorEmitted ? N.exports.nextTick(an, r) : (r._writableState.errorEmitted = !0, N.exports.nextTick(ha, r, o)) : N.exports.nextTick(ha, r, o) : e ? (N.exports.nextTick(an, r), e(o)) : N.exports.nextTick(an, r);
  }), this);
}
function ha(t, e) {
  Mi(t, e), an(t);
}
function an(t) {
  t._writableState && !t._writableState.emitClose || t._readableState && !t._readableState.emitClose || t.emit("close");
}
function nc() {
  this._readableState && (this._readableState.destroyed = !1, this._readableState.reading = !1, this._readableState.ended = !1, this._readableState.endEmitted = !1), this._writableState && (this._writableState.destroyed = !1, this._writableState.ended = !1, this._writableState.ending = !1, this._writableState.finalCalled = !1, this._writableState.prefinished = !1, this._writableState.finished = !1, this._writableState.errorEmitted = !1);
}
function Mi(t, e) {
  t.emit("error", e);
}
function ic(t, e) {
  var r = t._readableState, n = t._writableState;
  r && r.autoDestroy || n && n.autoDestroy ? t.destroy(e) : t.emit("error", e);
}
var js = {
  destroy: rc,
  undestroy: nc,
  errorOrDestroy: ic
}, kt = {};
function oc(t, e) {
  t.prototype = Object.create(e.prototype), t.prototype.constructor = t, t.__proto__ = e;
}
var Ns = {};
function $e(t, e, r) {
  r || (r = Error);
  function n(o, a, u) {
    return typeof e == "string" ? e : e(o, a, u);
  }
  var i = /* @__PURE__ */ function(o) {
    oc(a, o);
    function a(u, s, f) {
      return o.call(this, n(u, s, f)) || this;
    }
    return a;
  }(r);
  i.prototype.name = r.name, i.prototype.code = t, Ns[t] = i;
}
function da(t, e) {
  if (Array.isArray(t)) {
    var r = t.length;
    return t = t.map(function(n) {
      return String(n);
    }), r > 2 ? "one of ".concat(e, " ").concat(t.slice(0, r - 1).join(", "), ", or ") + t[r - 1] : r === 2 ? "one of ".concat(e, " ").concat(t[0], " or ").concat(t[1]) : "of ".concat(e, " ").concat(t[0]);
  } else
    return "of ".concat(e, " ").concat(String(t));
}
function ac(t, e, r) {
  return t.substr(!r || r < 0 ? 0 : +r, e.length) === e;
}
function sc(t, e, r) {
  return (r === void 0 || r > t.length) && (r = t.length), t.substring(r - e.length, r) === e;
}
function uc(t, e, r) {
  return typeof r != "number" && (r = 0), r + e.length > t.length ? !1 : t.indexOf(e, r) !== -1;
}
$e("ERR_INVALID_OPT_VALUE", function(t, e) {
  return 'The value "' + e + '" is invalid for option "' + t + '"';
}, TypeError);
$e("ERR_INVALID_ARG_TYPE", function(t, e, r) {
  var n;
  typeof e == "string" && ac(e, "not ") ? (n = "must not be", e = e.replace(/^not /, "")) : n = "must be";
  var i;
  if (sc(t, " argument"))
    i = "The ".concat(t, " ").concat(n, " ").concat(da(e, "type"));
  else {
    var o = uc(t, ".") ? "property" : "argument";
    i = 'The "'.concat(t, '" ').concat(o, " ").concat(n, " ").concat(da(e, "type"));
  }
  return i += ". Received type ".concat(typeof r), i;
}, TypeError);
$e("ERR_STREAM_PUSH_AFTER_EOF", "stream.push() after EOF");
$e("ERR_METHOD_NOT_IMPLEMENTED", function(t) {
  return "The " + t + " method is not implemented";
});
$e("ERR_STREAM_PREMATURE_CLOSE", "Premature close");
$e("ERR_STREAM_DESTROYED", function(t) {
  return "Cannot call " + t + " after a stream was destroyed";
});
$e("ERR_MULTIPLE_CALLBACK", "Callback called multiple times");
$e("ERR_STREAM_CANNOT_PIPE", "Cannot pipe, not readable");
$e("ERR_STREAM_WRITE_AFTER_END", "write after end");
$e("ERR_STREAM_NULL_VALUES", "May not write null values to stream", TypeError);
$e("ERR_UNKNOWN_ENCODING", function(t) {
  return "Unknown encoding: " + t;
}, TypeError);
$e("ERR_STREAM_UNSHIFT_AFTER_END_EVENT", "stream.unshift() after end event");
kt.codes = Ns;
var fc = kt.codes.ERR_INVALID_OPT_VALUE;
function lc(t, e, r) {
  return t.highWaterMark != null ? t.highWaterMark : e ? t[r] : null;
}
function cc(t, e, r, n) {
  var i = lc(e, n, r);
  if (i != null) {
    if (!(isFinite(i) && Math.floor(i) === i) || i < 0) {
      var o = n ? r : "highWaterMark";
      throw new fc(o, i);
    }
    return Math.floor(i);
  }
  return t.objectMode ? 16 : 16 * 1024;
}
var Fs = {
  getHighWaterMark: cc
}, hc = dc;
function dc(t, e) {
  if (ui("noDeprecation"))
    return t;
  var r = !1;
  function n() {
    if (!r) {
      if (ui("throwDeprecation"))
        throw new Error(e);
      ui("traceDeprecation") ? console.trace(e) : console.warn(e), r = !0;
    }
    return t.apply(this, arguments);
  }
  return n;
}
function ui(t) {
  try {
    if (!C.localStorage)
      return !1;
  } catch {
    return !1;
  }
  var e = C.localStorage[t];
  return e == null ? !1 : String(e).toLowerCase() === "true";
}
var fi, pa;
function $s() {
  if (pa)
    return fi;
  pa = 1, fi = P;
  function t(b) {
    var w = this;
    this.next = null, this.entry = null, this.finish = function() {
      Be(w, b);
    };
  }
  var e;
  P.WritableState = F;
  var r = {
    deprecate: hc
  }, n = Is, i = Hr.Buffer, o = C.Uint8Array || function() {
  };
  function a(b) {
    return i.from(b);
  }
  function u(b) {
    return i.isBuffer(b) || b instanceof o;
  }
  var s = js, f = Fs, c = f.getHighWaterMark, l = kt.codes, h = l.ERR_INVALID_ARG_TYPE, d = l.ERR_METHOD_NOT_IMPLEMENTED, p = l.ERR_MULTIPLE_CALLBACK, y = l.ERR_STREAM_CANNOT_PIPE, g = l.ERR_STREAM_DESTROYED, m = l.ERR_STREAM_NULL_VALUES, x = l.ERR_STREAM_WRITE_AFTER_END, S = l.ERR_UNKNOWN_ENCODING, k = s.errorOrDestroy;
  we.exports(P, n);
  function M() {
  }
  function F(b, w, O) {
    e = e || Ft(), b = b || {}, typeof O != "boolean" && (O = w instanceof e), this.objectMode = !!b.objectMode, O && (this.objectMode = this.objectMode || !!b.writableObjectMode), this.highWaterMark = c(this, b, "writableHighWaterMark", O), this.finalCalled = !1, this.needDrain = !1, this.ending = !1, this.ended = !1, this.finished = !1, this.destroyed = !1;
    var D = b.decodeStrings === !1;
    this.decodeStrings = !D, this.defaultEncoding = b.defaultEncoding || "utf8", this.length = 0, this.writing = !1, this.corked = 0, this.sync = !0, this.bufferProcessing = !1, this.onwrite = function(U) {
      ie(w, U);
    }, this.writecb = null, this.writelen = 0, this.bufferedRequest = null, this.lastBufferedRequest = null, this.pendingcb = 0, this.prefinished = !1, this.errorEmitted = !1, this.emitClose = b.emitClose !== !1, this.autoDestroy = !!b.autoDestroy, this.bufferedRequestCount = 0, this.corkedRequestsFree = new t(this);
  }
  F.prototype.getBuffer = function() {
    for (var w = this.bufferedRequest, O = []; w; )
      O.push(w), w = w.next;
    return O;
  }, function() {
    try {
      Object.defineProperty(F.prototype, "buffer", {
        get: r.deprecate(function() {
          return this.getBuffer();
        }, "_writableState.buffer is deprecated. Use _writableState.getBuffer instead.", "DEP0003")
      });
    } catch {
    }
  }();
  var z;
  typeof Symbol == "function" && Symbol.hasInstance && typeof Function.prototype[Symbol.hasInstance] == "function" ? (z = Function.prototype[Symbol.hasInstance], Object.defineProperty(P, Symbol.hasInstance, {
    value: function(w) {
      return z.call(this, w) ? !0 : this !== P ? !1 : w && w._writableState instanceof F;
    }
  })) : z = function(w) {
    return w instanceof this;
  };
  function P(b) {
    e = e || Ft();
    var w = this instanceof e;
    if (!w && !z.call(P, this))
      return new P(b);
    this._writableState = new F(b, this, w), this.writable = !0, b && (typeof b.write == "function" && (this._write = b.write), typeof b.writev == "function" && (this._writev = b.writev), typeof b.destroy == "function" && (this._destroy = b.destroy), typeof b.final == "function" && (this._final = b.final)), n.call(this);
  }
  P.prototype.pipe = function() {
    k(this, new y());
  };
  function H(b, w) {
    var O = new x();
    k(b, O), N.exports.nextTick(w, O);
  }
  function he(b, w, O, D) {
    var U;
    return O === null ? U = new m() : typeof O != "string" && !w.objectMode && (U = new h("chunk", ["string", "Buffer"], O)), U ? (k(b, U), N.exports.nextTick(D, U), !1) : !0;
  }
  P.prototype.write = function(b, w, O) {
    var D = this._writableState, U = !1, v = !D.objectMode && u(b);
    return v && !i.isBuffer(b) && (b = a(b)), typeof w == "function" && (O = w, w = null), v ? w = "buffer" : w || (w = D.defaultEncoding), typeof O != "function" && (O = M), D.ending ? H(this, O) : (v || he(this, D, b, O)) && (D.pendingcb++, U = re(this, D, v, b, w, O)), U;
  }, P.prototype.cork = function() {
    this._writableState.corked++;
  }, P.prototype.uncork = function() {
    var b = this._writableState;
    b.corked && (b.corked--, !b.writing && !b.corked && !b.bufferProcessing && b.bufferedRequest && ve(this, b));
  }, P.prototype.setDefaultEncoding = function(w) {
    if (typeof w == "string" && (w = w.toLowerCase()), !(["hex", "utf8", "utf-8", "ascii", "binary", "base64", "ucs2", "ucs-2", "utf16le", "utf-16le", "raw"].indexOf((w + "").toLowerCase()) > -1))
      throw new S(w);
    return this._writableState.defaultEncoding = w, this;
  }, Object.defineProperty(P.prototype, "writableBuffer", {
    enumerable: !1,
    get: function() {
      return this._writableState && this._writableState.getBuffer();
    }
  });
  function le(b, w, O) {
    return !b.objectMode && b.decodeStrings !== !1 && typeof w == "string" && (w = i.from(w, O)), w;
  }
  Object.defineProperty(P.prototype, "writableHighWaterMark", {
    enumerable: !1,
    get: function() {
      return this._writableState.highWaterMark;
    }
  });
  function re(b, w, O, D, U, v) {
    if (!O) {
      var _ = le(w, D, U);
      D !== _ && (O = !0, U = "buffer", D = _);
    }
    var R = w.objectMode ? 1 : D.length;
    w.length += R;
    var T = w.length < w.highWaterMark;
    if (T || (w.needDrain = !0), w.writing || w.corked) {
      var Y = w.lastBufferedRequest;
      w.lastBufferedRequest = {
        chunk: D,
        encoding: U,
        isBuf: O,
        callback: v,
        next: null
      }, Y ? Y.next = w.lastBufferedRequest : w.bufferedRequest = w.lastBufferedRequest, w.bufferedRequestCount += 1;
    } else
      j(b, w, !1, R, D, U, v);
    return T;
  }
  function j(b, w, O, D, U, v, _) {
    w.writelen = D, w.writecb = _, w.writing = !0, w.sync = !0, w.destroyed ? w.onwrite(new g("write")) : O ? b._writev(U, w.onwrite) : b._write(U, v, w.onwrite), w.sync = !1;
  }
  function $(b, w, O, D, U) {
    --w.pendingcb, O ? (N.exports.nextTick(U, D), N.exports.nextTick(ce, b, w), b._writableState.errorEmitted = !0, k(b, D)) : (U(D), b._writableState.errorEmitted = !0, k(b, D), ce(b, w));
  }
  function G(b) {
    b.writing = !1, b.writecb = null, b.length -= b.writelen, b.writelen = 0;
  }
  function ie(b, w) {
    var O = b._writableState, D = O.sync, U = O.writecb;
    if (typeof U != "function")
      throw new p();
    if (G(O), w)
      $(b, O, D, w, U);
    else {
      var v = tt(O) || b.destroyed;
      !v && !O.corked && !O.bufferProcessing && O.bufferedRequest && ve(b, O), D ? N.exports.nextTick(Me, b, O, v, U) : Me(b, O, v, U);
    }
  }
  function Me(b, w, O, D) {
    O || et(b, w), w.pendingcb--, D(), ce(b, w);
  }
  function et(b, w) {
    w.length === 0 && w.needDrain && (w.needDrain = !1, b.emit("drain"));
  }
  function ve(b, w) {
    w.bufferProcessing = !0;
    var O = w.bufferedRequest;
    if (b._writev && O && O.next) {
      var D = w.bufferedRequestCount, U = new Array(D), v = w.corkedRequestsFree;
      v.entry = O;
      for (var _ = 0, R = !0; O; )
        U[_] = O, O.isBuf || (R = !1), O = O.next, _ += 1;
      U.allBuffers = R, j(b, w, !0, w.length, U, "", v.finish), w.pendingcb++, w.lastBufferedRequest = null, v.next ? (w.corkedRequestsFree = v.next, v.next = null) : w.corkedRequestsFree = new t(w), w.bufferedRequestCount = 0;
    } else {
      for (; O; ) {
        var T = O.chunk, Y = O.encoding, L = O.callback, J = w.objectMode ? 1 : T.length;
        if (j(b, w, !1, J, T, Y, L), O = O.next, w.bufferedRequestCount--, w.writing)
          break;
      }
      O === null && (w.lastBufferedRequest = null);
    }
    w.bufferedRequest = O, w.bufferProcessing = !1;
  }
  P.prototype._write = function(b, w, O) {
    O(new d("_write()"));
  }, P.prototype._writev = null, P.prototype.end = function(b, w, O) {
    var D = this._writableState;
    return typeof b == "function" ? (O = b, b = null, w = null) : typeof w == "function" && (O = w, w = null), b != null && this.write(b, w), D.corked && (D.corked = 1, this.uncork()), D.ending || qe(this, D, O), this;
  }, Object.defineProperty(P.prototype, "writableLength", {
    enumerable: !1,
    get: function() {
      return this._writableState.length;
    }
  });
  function tt(b) {
    return b.ending && b.length === 0 && b.bufferedRequest === null && !b.finished && !b.writing;
  }
  function Ge(b, w) {
    b._final(function(O) {
      w.pendingcb--, O && k(b, O), w.prefinished = !0, b.emit("prefinish"), ce(b, w);
    });
  }
  function rt(b, w) {
    !w.prefinished && !w.finalCalled && (typeof b._final == "function" && !w.destroyed ? (w.pendingcb++, w.finalCalled = !0, N.exports.nextTick(Ge, b, w)) : (w.prefinished = !0, b.emit("prefinish")));
  }
  function ce(b, w) {
    var O = tt(w);
    if (O && (rt(b, w), w.pendingcb === 0 && (w.finished = !0, b.emit("finish"), w.autoDestroy))) {
      var D = b._readableState;
      (!D || D.autoDestroy && D.endEmitted) && b.destroy();
    }
    return O;
  }
  function qe(b, w, O) {
    w.ending = !0, ce(b, w), O && (w.finished ? N.exports.nextTick(O) : b.once("finish", O)), w.ended = !0, b.writable = !1;
  }
  function Be(b, w, O) {
    var D = b.entry;
    for (b.entry = null; D; ) {
      var U = D.callback;
      w.pendingcb--, U(O), D = D.next;
    }
    w.corkedRequestsFree.next = b;
  }
  return Object.defineProperty(P.prototype, "destroyed", {
    enumerable: !1,
    get: function() {
      return this._writableState === void 0 ? !1 : this._writableState.destroyed;
    },
    set: function(w) {
      !this._writableState || (this._writableState.destroyed = w);
    }
  }), P.prototype.destroy = s.destroy, P.prototype._undestroy = s.undestroy, P.prototype._destroy = function(b, w) {
    w(b);
  }, fi;
}
var li, _a;
function Ft() {
  if (_a)
    return li;
  _a = 1;
  var t = Object.keys || function(f) {
    var c = [];
    for (var l in f)
      c.push(l);
    return c;
  };
  li = a;
  var e = zs(), r = $s();
  we.exports(a, e);
  for (var n = t(r.prototype), i = 0; i < n.length; i++) {
    var o = n[i];
    a.prototype[o] || (a.prototype[o] = r.prototype[o]);
  }
  function a(f) {
    if (!(this instanceof a))
      return new a(f);
    e.call(this, f), r.call(this, f), this.allowHalfOpen = !0, f && (f.readable === !1 && (this.readable = !1), f.writable === !1 && (this.writable = !1), f.allowHalfOpen === !1 && (this.allowHalfOpen = !1, this.once("end", u)));
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
    this._writableState.ended || N.exports.nextTick(s, this);
  }
  function s(f) {
    f.end();
  }
  return Object.defineProperty(a.prototype, "destroyed", {
    enumerable: !1,
    get: function() {
      return this._readableState === void 0 || this._writableState === void 0 ? !1 : this._readableState.destroyed && this._writableState.destroyed;
    },
    set: function(c) {
      this._readableState === void 0 || this._writableState === void 0 || (this._readableState.destroyed = c, this._writableState.destroyed = c);
    }
  }), li;
}
var gn = {}, Qi = Pe.exports.Buffer, va = Qi.isEncoding || function(t) {
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
function pc(t) {
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
function _c(t) {
  var e = pc(t);
  if (typeof e != "string" && (Qi.isEncoding === va || !va(t)))
    throw new Error("Unknown encoding: " + t);
  return e || t;
}
var Us = gn.StringDecoder = jr;
function jr(t) {
  this.encoding = _c(t);
  var e;
  switch (this.encoding) {
    case "utf16le":
      this.text = mc, this.end = xc, e = 4;
      break;
    case "utf8":
      this.fillLast = gc, e = 4;
      break;
    case "base64":
      this.text = Ec, this.end = Sc, e = 3;
      break;
    default:
      this.write = Rc, this.end = Cc;
      return;
  }
  this.lastNeed = 0, this.lastTotal = 0, this.lastChar = Qi.allocUnsafe(e);
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
jr.prototype.end = wc;
jr.prototype.text = bc;
jr.prototype.fillLast = function(t) {
  if (this.lastNeed <= t.length)
    return t.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, this.lastNeed), this.lastChar.toString(this.encoding, 0, this.lastTotal);
  t.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, t.length), this.lastNeed -= t.length;
};
function ci(t) {
  return t <= 127 ? 0 : t >> 5 === 6 ? 2 : t >> 4 === 14 ? 3 : t >> 3 === 30 ? 4 : t >> 6 === 2 ? -1 : -2;
}
function vc(t, e, r) {
  var n = e.length - 1;
  if (n < r)
    return 0;
  var i = ci(e[n]);
  return i >= 0 ? (i > 0 && (t.lastNeed = i - 1), i) : --n < r || i === -2 ? 0 : (i = ci(e[n]), i >= 0 ? (i > 0 && (t.lastNeed = i - 2), i) : --n < r || i === -2 ? 0 : (i = ci(e[n]), i >= 0 ? (i > 0 && (i === 2 ? i = 0 : t.lastNeed = i - 3), i) : 0));
}
function yc(t, e, r) {
  if ((e[0] & 192) !== 128)
    return t.lastNeed = 0, "\uFFFD";
  if (t.lastNeed > 1 && e.length > 1) {
    if ((e[1] & 192) !== 128)
      return t.lastNeed = 1, "\uFFFD";
    if (t.lastNeed > 2 && e.length > 2 && (e[2] & 192) !== 128)
      return t.lastNeed = 2, "\uFFFD";
  }
}
function gc(t) {
  var e = this.lastTotal - this.lastNeed, r = yc(this, t);
  if (r !== void 0)
    return r;
  if (this.lastNeed <= t.length)
    return t.copy(this.lastChar, e, 0, this.lastNeed), this.lastChar.toString(this.encoding, 0, this.lastTotal);
  t.copy(this.lastChar, e, 0, t.length), this.lastNeed -= t.length;
}
function bc(t, e) {
  var r = vc(this, t, e);
  if (!this.lastNeed)
    return t.toString("utf8", e);
  this.lastTotal = r;
  var n = t.length - (r - this.lastNeed);
  return t.copy(this.lastChar, 0, n), t.toString("utf8", e, n);
}
function wc(t) {
  var e = t && t.length ? this.write(t) : "";
  return this.lastNeed ? e + "\uFFFD" : e;
}
function mc(t, e) {
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
function xc(t) {
  var e = t && t.length ? this.write(t) : "";
  if (this.lastNeed) {
    var r = this.lastTotal - this.lastNeed;
    return e + this.lastChar.toString("utf16le", 0, r);
  }
  return e;
}
function Ec(t, e) {
  var r = (t.length - e) % 3;
  return r === 0 ? t.toString("base64", e) : (this.lastNeed = 3 - r, this.lastTotal = 3, r === 1 ? this.lastChar[0] = t[t.length - 1] : (this.lastChar[0] = t[t.length - 2], this.lastChar[1] = t[t.length - 1]), t.toString("base64", e, t.length - r));
}
function Sc(t) {
  var e = t && t.length ? this.write(t) : "";
  return this.lastNeed ? e + this.lastChar.toString("base64", 0, 3 - this.lastNeed) : e;
}
function Rc(t) {
  return t.toString(this.encoding);
}
function Cc(t) {
  return t && t.length ? this.write(t) : "";
}
var ya = kt.codes.ERR_STREAM_PREMATURE_CLOSE;
function Oc(t) {
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
function Ac() {
}
function kc(t) {
  return t.setHeader && typeof t.abort == "function";
}
function Ws(t, e, r) {
  if (typeof e == "function")
    return Ws(t, null, e);
  e || (e = {}), r = Oc(r || Ac);
  var n = e.readable || e.readable !== !1 && t.readable, i = e.writable || e.writable !== !1 && t.writable, o = function() {
    t.writable || u();
  }, a = t._writableState && t._writableState.finished, u = function() {
    i = !1, a = !0, n || r.call(t);
  }, s = t._readableState && t._readableState.endEmitted, f = function() {
    n = !1, s = !0, i || r.call(t);
  }, c = function(p) {
    r.call(t, p);
  }, l = function() {
    var p;
    if (n && !s)
      return (!t._readableState || !t._readableState.ended) && (p = new ya()), r.call(t, p);
    if (i && !a)
      return (!t._writableState || !t._writableState.ended) && (p = new ya()), r.call(t, p);
  }, h = function() {
    t.req.on("finish", u);
  };
  return kc(t) ? (t.on("complete", u), t.on("abort", l), t.req ? h() : t.on("request", h)) : i && !t._writableState && (t.on("end", o), t.on("close", o)), t.on("end", f), t.on("finish", u), e.error !== !1 && t.on("error", c), t.on("close", l), function() {
    t.removeListener("complete", u), t.removeListener("abort", l), t.removeListener("request", h), t.req && t.req.removeListener("finish", u), t.removeListener("end", o), t.removeListener("close", o), t.removeListener("finish", u), t.removeListener("end", f), t.removeListener("error", c), t.removeListener("close", l);
  };
}
var Ji = Ws, hi, ga;
function Mc() {
  if (ga)
    return hi;
  ga = 1;
  var t;
  function e(m, x, S) {
    return x in m ? Object.defineProperty(m, x, { value: S, enumerable: !0, configurable: !0, writable: !0 }) : m[x] = S, m;
  }
  var r = Ji, n = Symbol("lastResolve"), i = Symbol("lastReject"), o = Symbol("error"), a = Symbol("ended"), u = Symbol("lastPromise"), s = Symbol("handlePromise"), f = Symbol("stream");
  function c(m, x) {
    return {
      value: m,
      done: x
    };
  }
  function l(m) {
    var x = m[n];
    if (x !== null) {
      var S = m[f].read();
      S !== null && (m[u] = null, m[n] = null, m[i] = null, x(c(S, !1)));
    }
  }
  function h(m) {
    N.exports.nextTick(l, m);
  }
  function d(m, x) {
    return function(S, k) {
      m.then(function() {
        if (x[a]) {
          S(c(void 0, !0));
          return;
        }
        x[s](S, k);
      }, k);
    };
  }
  var p = Object.getPrototypeOf(function() {
  }), y = Object.setPrototypeOf((t = {
    get stream() {
      return this[f];
    },
    next: function() {
      var x = this, S = this[o];
      if (S !== null)
        return Promise.reject(S);
      if (this[a])
        return Promise.resolve(c(void 0, !0));
      if (this[f].destroyed)
        return new Promise(function(z, P) {
          N.exports.nextTick(function() {
            x[o] ? P(x[o]) : z(c(void 0, !0));
          });
        });
      var k = this[u], M;
      if (k)
        M = new Promise(d(k, this));
      else {
        var F = this[f].read();
        if (F !== null)
          return Promise.resolve(c(F, !1));
        M = new Promise(this[s]);
      }
      return this[u] = M, M;
    }
  }, e(t, Symbol.asyncIterator, function() {
    return this;
  }), e(t, "return", function() {
    var x = this;
    return new Promise(function(S, k) {
      x[f].destroy(null, function(M) {
        if (M) {
          k(M);
          return;
        }
        S(c(void 0, !0));
      });
    });
  }), t), p), g = function(x) {
    var S, k = Object.create(y, (S = {}, e(S, f, {
      value: x,
      writable: !0
    }), e(S, n, {
      value: null,
      writable: !0
    }), e(S, i, {
      value: null,
      writable: !0
    }), e(S, o, {
      value: null,
      writable: !0
    }), e(S, a, {
      value: x._readableState.endEmitted,
      writable: !0
    }), e(S, s, {
      value: function(F, z) {
        var P = k[f].read();
        P ? (k[u] = null, k[n] = null, k[i] = null, F(c(P, !1))) : (k[n] = F, k[i] = z);
      },
      writable: !0
    }), S));
    return k[u] = null, r(x, function(M) {
      if (M && M.code !== "ERR_STREAM_PREMATURE_CLOSE") {
        var F = k[i];
        F !== null && (k[u] = null, k[n] = null, k[i] = null, F(M)), k[o] = M;
        return;
      }
      var z = k[n];
      z !== null && (k[u] = null, k[n] = null, k[i] = null, z(c(void 0, !0))), k[a] = !0;
    }), x.on("readable", h.bind(null, k)), k;
  };
  return hi = g, hi;
}
var di, ba;
function Ic() {
  return ba || (ba = 1, di = function() {
    throw new Error("Readable.from is not available in the browser");
  }), di;
}
var pi, wa;
function zs() {
  if (wa)
    return pi;
  wa = 1, pi = H;
  var t;
  H.ReadableState = P, Fe.exports.EventEmitter;
  var e = function(_, R) {
    return _.listeners(R).length;
  }, r = Is, n = Hr.Buffer, i = C.Uint8Array || function() {
  };
  function o(v) {
    return n.from(v);
  }
  function a(v) {
    return n.isBuffer(v) || v instanceof i;
  }
  var u = Ds, s;
  u && u.debuglog ? s = u.debuglog("stream") : s = function() {
  };
  var f = tc(), c = js, l = Fs, h = l.getHighWaterMark, d = kt.codes, p = d.ERR_INVALID_ARG_TYPE, y = d.ERR_STREAM_PUSH_AFTER_EOF, g = d.ERR_METHOD_NOT_IMPLEMENTED, m = d.ERR_STREAM_UNSHIFT_AFTER_END_EVENT, x, S, k;
  we.exports(H, r);
  var M = c.errorOrDestroy, F = ["error", "close", "destroy", "pause", "resume"];
  function z(v, _, R) {
    if (typeof v.prependListener == "function")
      return v.prependListener(_, R);
    !v._events || !v._events[_] ? v.on(_, R) : Array.isArray(v._events[_]) ? v._events[_].unshift(R) : v._events[_] = [R, v._events[_]];
  }
  function P(v, _, R) {
    t = t || Ft(), v = v || {}, typeof R != "boolean" && (R = _ instanceof t), this.objectMode = !!v.objectMode, R && (this.objectMode = this.objectMode || !!v.readableObjectMode), this.highWaterMark = h(this, v, "readableHighWaterMark", R), this.buffer = new f(), this.length = 0, this.pipes = null, this.pipesCount = 0, this.flowing = null, this.ended = !1, this.endEmitted = !1, this.reading = !1, this.sync = !0, this.needReadable = !1, this.emittedReadable = !1, this.readableListening = !1, this.resumeScheduled = !1, this.paused = !0, this.emitClose = v.emitClose !== !1, this.autoDestroy = !!v.autoDestroy, this.destroyed = !1, this.defaultEncoding = v.defaultEncoding || "utf8", this.awaitDrain = 0, this.readingMore = !1, this.decoder = null, this.encoding = null, v.encoding && (x || (x = gn.StringDecoder), this.decoder = new x(v.encoding), this.encoding = v.encoding);
  }
  function H(v) {
    if (t = t || Ft(), !(this instanceof H))
      return new H(v);
    var _ = this instanceof t;
    this._readableState = new P(v, this, _), this.readable = !0, v && (typeof v.read == "function" && (this._read = v.read), typeof v.destroy == "function" && (this._destroy = v.destroy)), r.call(this);
  }
  Object.defineProperty(H.prototype, "destroyed", {
    enumerable: !1,
    get: function() {
      return this._readableState === void 0 ? !1 : this._readableState.destroyed;
    },
    set: function(_) {
      !this._readableState || (this._readableState.destroyed = _);
    }
  }), H.prototype.destroy = c.destroy, H.prototype._undestroy = c.undestroy, H.prototype._destroy = function(v, _) {
    _(v);
  }, H.prototype.push = function(v, _) {
    var R = this._readableState, T;
    return R.objectMode ? T = !0 : typeof v == "string" && (_ = _ || R.defaultEncoding, _ !== R.encoding && (v = n.from(v, _), _ = ""), T = !0), he(this, v, _, !1, T);
  }, H.prototype.unshift = function(v) {
    return he(this, v, null, !0, !1);
  };
  function he(v, _, R, T, Y) {
    s("readableAddChunk", _);
    var L = v._readableState;
    if (_ === null)
      L.reading = !1, ie(v, L);
    else {
      var J;
      if (Y || (J = re(L, _)), J)
        M(v, J);
      else if (L.objectMode || _ && _.length > 0)
        if (typeof _ != "string" && !L.objectMode && Object.getPrototypeOf(_) !== n.prototype && (_ = o(_)), T)
          L.endEmitted ? M(v, new m()) : le(v, L, _, !0);
        else if (L.ended)
          M(v, new y());
        else {
          if (L.destroyed)
            return !1;
          L.reading = !1, L.decoder && !R ? (_ = L.decoder.write(_), L.objectMode || _.length !== 0 ? le(v, L, _, !1) : ve(v, L)) : le(v, L, _, !1);
        }
      else
        T || (L.reading = !1, ve(v, L));
    }
    return !L.ended && (L.length < L.highWaterMark || L.length === 0);
  }
  function le(v, _, R, T) {
    _.flowing && _.length === 0 && !_.sync ? (_.awaitDrain = 0, v.emit("data", R)) : (_.length += _.objectMode ? 1 : R.length, T ? _.buffer.unshift(R) : _.buffer.push(R), _.needReadable && Me(v)), ve(v, _);
  }
  function re(v, _) {
    var R;
    return !a(_) && typeof _ != "string" && _ !== void 0 && !v.objectMode && (R = new p("chunk", ["string", "Buffer", "Uint8Array"], _)), R;
  }
  H.prototype.isPaused = function() {
    return this._readableState.flowing === !1;
  }, H.prototype.setEncoding = function(v) {
    x || (x = gn.StringDecoder);
    var _ = new x(v);
    this._readableState.decoder = _, this._readableState.encoding = this._readableState.decoder.encoding;
    for (var R = this._readableState.buffer.head, T = ""; R !== null; )
      T += _.write(R.data), R = R.next;
    return this._readableState.buffer.clear(), T !== "" && this._readableState.buffer.push(T), this._readableState.length = T.length, this;
  };
  var j = 1073741824;
  function $(v) {
    return v >= j ? v = j : (v--, v |= v >>> 1, v |= v >>> 2, v |= v >>> 4, v |= v >>> 8, v |= v >>> 16, v++), v;
  }
  function G(v, _) {
    return v <= 0 || _.length === 0 && _.ended ? 0 : _.objectMode ? 1 : v !== v ? _.flowing && _.length ? _.buffer.head.data.length : _.length : (v > _.highWaterMark && (_.highWaterMark = $(v)), v <= _.length ? v : _.ended ? _.length : (_.needReadable = !0, 0));
  }
  H.prototype.read = function(v) {
    s("read", v), v = parseInt(v, 10);
    var _ = this._readableState, R = v;
    if (v !== 0 && (_.emittedReadable = !1), v === 0 && _.needReadable && ((_.highWaterMark !== 0 ? _.length >= _.highWaterMark : _.length > 0) || _.ended))
      return s("read: emitReadable", _.length, _.ended), _.length === 0 && _.ended ? O(this) : Me(this), null;
    if (v = G(v, _), v === 0 && _.ended)
      return _.length === 0 && O(this), null;
    var T = _.needReadable;
    s("need readable", T), (_.length === 0 || _.length - v < _.highWaterMark) && (T = !0, s("length less than watermark", T)), _.ended || _.reading ? (T = !1, s("reading or ended", T)) : T && (s("do read"), _.reading = !0, _.sync = !0, _.length === 0 && (_.needReadable = !0), this._read(_.highWaterMark), _.sync = !1, _.reading || (v = G(R, _)));
    var Y;
    return v > 0 ? Y = w(v, _) : Y = null, Y === null ? (_.needReadable = _.length <= _.highWaterMark, v = 0) : (_.length -= v, _.awaitDrain = 0), _.length === 0 && (_.ended || (_.needReadable = !0), R !== v && _.ended && O(this)), Y !== null && this.emit("data", Y), Y;
  };
  function ie(v, _) {
    if (s("onEofChunk"), !_.ended) {
      if (_.decoder) {
        var R = _.decoder.end();
        R && R.length && (_.buffer.push(R), _.length += _.objectMode ? 1 : R.length);
      }
      _.ended = !0, _.sync ? Me(v) : (_.needReadable = !1, _.emittedReadable || (_.emittedReadable = !0, et(v)));
    }
  }
  function Me(v) {
    var _ = v._readableState;
    s("emitReadable", _.needReadable, _.emittedReadable), _.needReadable = !1, _.emittedReadable || (s("emitReadable", _.flowing), _.emittedReadable = !0, N.exports.nextTick(et, v));
  }
  function et(v) {
    var _ = v._readableState;
    s("emitReadable_", _.destroyed, _.length, _.ended), !_.destroyed && (_.length || _.ended) && (v.emit("readable"), _.emittedReadable = !1), _.needReadable = !_.flowing && !_.ended && _.length <= _.highWaterMark, b(v);
  }
  function ve(v, _) {
    _.readingMore || (_.readingMore = !0, N.exports.nextTick(tt, v, _));
  }
  function tt(v, _) {
    for (; !_.reading && !_.ended && (_.length < _.highWaterMark || _.flowing && _.length === 0); ) {
      var R = _.length;
      if (s("maybeReadMore read 0"), v.read(0), R === _.length)
        break;
    }
    _.readingMore = !1;
  }
  H.prototype._read = function(v) {
    M(this, new g("_read()"));
  }, H.prototype.pipe = function(v, _) {
    var R = this, T = this._readableState;
    switch (T.pipesCount) {
      case 0:
        T.pipes = v;
        break;
      case 1:
        T.pipes = [T.pipes, v];
        break;
      default:
        T.pipes.push(v);
        break;
    }
    T.pipesCount += 1, s("pipe count=%d opts=%j", T.pipesCount, _);
    var Y = (!_ || _.end !== !1) && v !== N.exports.stdout && v !== N.exports.stderr, L = Y ? _e : Gt;
    T.endEmitted ? N.exports.nextTick(L) : R.once("end", L), v.on("unpipe", J);
    function J(Tt, Bt) {
      s("onunpipe"), Tt === R && Bt && Bt.hasUnpiped === !1 && (Bt.hasUnpiped = !0, de());
    }
    function _e() {
      s("onend"), v.end();
    }
    var q = Ge(R);
    v.on("drain", q);
    var K = !1;
    function de() {
      s("cleanup"), v.removeListener("close", $n), v.removeListener("finish", Un), v.removeListener("drain", q), v.removeListener("error", Fn), v.removeListener("unpipe", J), R.removeListener("end", _e), R.removeListener("end", Gt), R.removeListener("data", Vt), K = !0, T.awaitDrain && (!v._writableState || v._writableState.needDrain) && q();
    }
    R.on("data", Vt);
    function Vt(Tt) {
      s("ondata");
      var Bt = v.write(Tt);
      s("dest.write", Bt), Bt === !1 && ((T.pipesCount === 1 && T.pipes === v || T.pipesCount > 1 && U(T.pipes, v) !== -1) && !K && (s("false write response, pause", T.awaitDrain), T.awaitDrain++), R.pause());
    }
    function Fn(Tt) {
      s("onerror", Tt), Gt(), v.removeListener("error", Fn), e(v, "error") === 0 && M(v, Tt);
    }
    z(v, "error", Fn);
    function $n() {
      v.removeListener("finish", Un), Gt();
    }
    v.once("close", $n);
    function Un() {
      s("onfinish"), v.removeListener("close", $n), Gt();
    }
    v.once("finish", Un);
    function Gt() {
      s("unpipe"), R.unpipe(v);
    }
    return v.emit("pipe", R), T.flowing || (s("pipe resume"), R.resume()), v;
  };
  function Ge(v) {
    return function() {
      var R = v._readableState;
      s("pipeOnDrain", R.awaitDrain), R.awaitDrain && R.awaitDrain--, R.awaitDrain === 0 && e(v, "data") && (R.flowing = !0, b(v));
    };
  }
  H.prototype.unpipe = function(v) {
    var _ = this._readableState, R = {
      hasUnpiped: !1
    };
    if (_.pipesCount === 0)
      return this;
    if (_.pipesCount === 1)
      return v && v !== _.pipes ? this : (v || (v = _.pipes), _.pipes = null, _.pipesCount = 0, _.flowing = !1, v && v.emit("unpipe", this, R), this);
    if (!v) {
      var T = _.pipes, Y = _.pipesCount;
      _.pipes = null, _.pipesCount = 0, _.flowing = !1;
      for (var L = 0; L < Y; L++)
        T[L].emit("unpipe", this, {
          hasUnpiped: !1
        });
      return this;
    }
    var J = U(_.pipes, v);
    return J === -1 ? this : (_.pipes.splice(J, 1), _.pipesCount -= 1, _.pipesCount === 1 && (_.pipes = _.pipes[0]), v.emit("unpipe", this, R), this);
  }, H.prototype.on = function(v, _) {
    var R = r.prototype.on.call(this, v, _), T = this._readableState;
    return v === "data" ? (T.readableListening = this.listenerCount("readable") > 0, T.flowing !== !1 && this.resume()) : v === "readable" && !T.endEmitted && !T.readableListening && (T.readableListening = T.needReadable = !0, T.flowing = !1, T.emittedReadable = !1, s("on readable", T.length, T.reading), T.length ? Me(this) : T.reading || N.exports.nextTick(ce, this)), R;
  }, H.prototype.addListener = H.prototype.on, H.prototype.removeListener = function(v, _) {
    var R = r.prototype.removeListener.call(this, v, _);
    return v === "readable" && N.exports.nextTick(rt, this), R;
  }, H.prototype.removeAllListeners = function(v) {
    var _ = r.prototype.removeAllListeners.apply(this, arguments);
    return (v === "readable" || v === void 0) && N.exports.nextTick(rt, this), _;
  };
  function rt(v) {
    var _ = v._readableState;
    _.readableListening = v.listenerCount("readable") > 0, _.resumeScheduled && !_.paused ? _.flowing = !0 : v.listenerCount("data") > 0 && v.resume();
  }
  function ce(v) {
    s("readable nexttick read 0"), v.read(0);
  }
  H.prototype.resume = function() {
    var v = this._readableState;
    return v.flowing || (s("resume"), v.flowing = !v.readableListening, qe(this, v)), v.paused = !1, this;
  };
  function qe(v, _) {
    _.resumeScheduled || (_.resumeScheduled = !0, N.exports.nextTick(Be, v, _));
  }
  function Be(v, _) {
    s("resume", _.reading), _.reading || v.read(0), _.resumeScheduled = !1, v.emit("resume"), b(v), _.flowing && !_.reading && v.read(0);
  }
  H.prototype.pause = function() {
    return s("call pause flowing=%j", this._readableState.flowing), this._readableState.flowing !== !1 && (s("pause"), this._readableState.flowing = !1, this.emit("pause")), this._readableState.paused = !0, this;
  };
  function b(v) {
    var _ = v._readableState;
    for (s("flow", _.flowing); _.flowing && v.read() !== null; )
      ;
  }
  H.prototype.wrap = function(v) {
    var _ = this, R = this._readableState, T = !1;
    v.on("end", function() {
      if (s("wrapped end"), R.decoder && !R.ended) {
        var J = R.decoder.end();
        J && J.length && _.push(J);
      }
      _.push(null);
    }), v.on("data", function(J) {
      if (s("wrapped data"), R.decoder && (J = R.decoder.write(J)), !(R.objectMode && J == null) && !(!R.objectMode && (!J || !J.length))) {
        var _e = _.push(J);
        _e || (T = !0, v.pause());
      }
    });
    for (var Y in v)
      this[Y] === void 0 && typeof v[Y] == "function" && (this[Y] = function(_e) {
        return function() {
          return v[_e].apply(v, arguments);
        };
      }(Y));
    for (var L = 0; L < F.length; L++)
      v.on(F[L], this.emit.bind(this, F[L]));
    return this._read = function(J) {
      s("wrapped _read", J), T && (T = !1, v.resume());
    }, this;
  }, typeof Symbol == "function" && (H.prototype[Symbol.asyncIterator] = function() {
    return S === void 0 && (S = Mc()), S(this);
  }), Object.defineProperty(H.prototype, "readableHighWaterMark", {
    enumerable: !1,
    get: function() {
      return this._readableState.highWaterMark;
    }
  }), Object.defineProperty(H.prototype, "readableBuffer", {
    enumerable: !1,
    get: function() {
      return this._readableState && this._readableState.buffer;
    }
  }), Object.defineProperty(H.prototype, "readableFlowing", {
    enumerable: !1,
    get: function() {
      return this._readableState.flowing;
    },
    set: function(_) {
      this._readableState && (this._readableState.flowing = _);
    }
  }), H._fromList = w, Object.defineProperty(H.prototype, "readableLength", {
    enumerable: !1,
    get: function() {
      return this._readableState.length;
    }
  });
  function w(v, _) {
    if (_.length === 0)
      return null;
    var R;
    return _.objectMode ? R = _.buffer.shift() : !v || v >= _.length ? (_.decoder ? R = _.buffer.join("") : _.buffer.length === 1 ? R = _.buffer.first() : R = _.buffer.concat(_.length), _.buffer.clear()) : R = _.buffer.consume(v, _.decoder), R;
  }
  function O(v) {
    var _ = v._readableState;
    s("endReadable", _.endEmitted), _.endEmitted || (_.ended = !0, N.exports.nextTick(D, _, v));
  }
  function D(v, _) {
    if (s("endReadableNT", v.endEmitted, v.length), !v.endEmitted && v.length === 0 && (v.endEmitted = !0, _.readable = !1, _.emit("end"), v.autoDestroy)) {
      var R = _._writableState;
      (!R || R.autoDestroy && R.finished) && _.destroy();
    }
  }
  typeof Symbol == "function" && (H.from = function(v, _) {
    return k === void 0 && (k = Ic()), k(H, v, _);
  });
  function U(v, _) {
    for (var R = 0, T = v.length; R < T; R++)
      if (v[R] === _)
        return R;
    return -1;
  }
  return pi;
}
var Vs = st, In = kt.codes, Tc = In.ERR_METHOD_NOT_IMPLEMENTED, Bc = In.ERR_MULTIPLE_CALLBACK, Lc = In.ERR_TRANSFORM_ALREADY_TRANSFORMING, Pc = In.ERR_TRANSFORM_WITH_LENGTH_0, Tn = Ft();
we.exports(st, Tn);
function Hc(t, e) {
  var r = this._transformState;
  r.transforming = !1;
  var n = r.writecb;
  if (n === null)
    return this.emit("error", new Bc());
  r.writechunk = null, r.writecb = null, e != null && this.push(e), n(t);
  var i = this._readableState;
  i.reading = !1, (i.needReadable || i.length < i.highWaterMark) && this._read(i.highWaterMark);
}
function st(t) {
  if (!(this instanceof st))
    return new st(t);
  Tn.call(this, t), this._transformState = {
    afterTransform: Hc.bind(this),
    needTransform: !1,
    transforming: !1,
    writecb: null,
    writechunk: null,
    writeencoding: null
  }, this._readableState.needReadable = !0, this._readableState.sync = !1, t && (typeof t.transform == "function" && (this._transform = t.transform), typeof t.flush == "function" && (this._flush = t.flush)), this.on("prefinish", qc);
}
function qc() {
  var t = this;
  typeof this._flush == "function" && !this._readableState.destroyed ? this._flush(function(e, r) {
    ma(t, e, r);
  }) : ma(this, null, null);
}
st.prototype.push = function(t, e) {
  return this._transformState.needTransform = !1, Tn.prototype.push.call(this, t, e);
};
st.prototype._transform = function(t, e, r) {
  r(new Tc("_transform()"));
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
  Tn.prototype._destroy.call(this, t, function(r) {
    e(r);
  });
};
function ma(t, e, r) {
  if (e)
    return t.emit("error", e);
  if (r != null && t.push(r), t._writableState.length)
    throw new Pc();
  if (t._transformState.transforming)
    throw new Lc();
  return t.push(null);
}
var Dc = Lr, Gs = Vs;
we.exports(Lr, Gs);
function Lr(t) {
  if (!(this instanceof Lr))
    return new Lr(t);
  Gs.call(this, t);
}
Lr.prototype._transform = function(t, e, r) {
  r(null, t);
};
var _i;
function jc(t) {
  var e = !1;
  return function() {
    e || (e = !0, t.apply(void 0, arguments));
  };
}
var Ys = kt.codes, Nc = Ys.ERR_MISSING_ARGS, Fc = Ys.ERR_STREAM_DESTROYED;
function xa(t) {
  if (t)
    throw t;
}
function $c(t) {
  return t.setHeader && typeof t.abort == "function";
}
function Uc(t, e, r, n) {
  n = jc(n);
  var i = !1;
  t.on("close", function() {
    i = !0;
  }), _i === void 0 && (_i = Ji), _i(t, {
    readable: e,
    writable: r
  }, function(a) {
    if (a)
      return n(a);
    i = !0, n();
  });
  var o = !1;
  return function(a) {
    if (!i && !o) {
      if (o = !0, $c(t))
        return t.abort();
      if (typeof t.destroy == "function")
        return t.destroy();
      n(a || new Fc("pipe"));
    }
  };
}
function Ea(t) {
  t();
}
function Wc(t, e) {
  return t.pipe(e);
}
function zc(t) {
  return !t.length || typeof t[t.length - 1] != "function" ? xa : t.pop();
}
function Vc() {
  for (var t = arguments.length, e = new Array(t), r = 0; r < t; r++)
    e[r] = arguments[r];
  var n = zc(e);
  if (Array.isArray(e[0]) && (e = e[0]), e.length < 2)
    throw new Nc("streams");
  var i, o = e.map(function(a, u) {
    var s = u < e.length - 1, f = u > 0;
    return Uc(a, s, f, function(c) {
      i || (i = c), c && o.forEach(Ea), !s && (o.forEach(Ea), n(i));
    });
  });
  return e.reduce(Wc);
}
var Gc = Vc;
(function(t, e) {
  e = t.exports = zs(), e.Stream = e, e.Readable = e, e.Writable = $s(), e.Duplex = Ft(), e.Transform = Vs, e.PassThrough = Dc, e.finished = Ji, e.pipeline = Gc;
})(Ri, Ri.exports);
var bn = Pe.exports.Buffer, Zs = Ri.exports.Transform, Yc = we.exports;
function Zc(t, e) {
  if (!bn.isBuffer(t) && typeof t != "string")
    throw new TypeError(e + " must be a string or a buffer");
}
function yt(t) {
  Zs.call(this), this._block = bn.allocUnsafe(t), this._blockSize = t, this._blockOffset = 0, this._length = [0, 0, 0, 0], this._finalized = !1;
}
Yc(yt, Zs);
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
  if (Zc(t, "Data"), this._finalized)
    throw new Error("Digest already called");
  bn.isBuffer(t) || (t = bn.from(t, e));
  for (var r = this._block, n = 0; this._blockOffset + t.length - n >= this._blockSize; ) {
    for (var i = this._blockOffset; i < this._blockSize; )
      r[i++] = t[n++];
    this._update(), this._blockOffset = 0;
  }
  for (; n < t.length; )
    r[this._blockOffset++] = t[n++];
  for (var o = 0, a = t.length * 8; a > 0; ++o)
    this._length[o] += a, a = this._length[o] / 4294967296 | 0, a > 0 && (this._length[o] -= 4294967296 * a);
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
var Ks = yt, Kc = we.exports, Xs = Ks, Xc = Pe.exports.Buffer, Qc = new Array(16);
function Bn() {
  Xs.call(this, 64), this._a = 1732584193, this._b = 4023233417, this._c = 2562383102, this._d = 271733878;
}
Kc(Bn, Xs);
Bn.prototype._update = function() {
  for (var t = Qc, e = 0; e < 16; ++e)
    t[e] = this._block.readInt32LE(e * 4);
  var r = this._a, n = this._b, i = this._c, o = this._d;
  r = Ee(r, n, i, o, t[0], 3614090360, 7), o = Ee(o, r, n, i, t[1], 3905402710, 12), i = Ee(i, o, r, n, t[2], 606105819, 17), n = Ee(n, i, o, r, t[3], 3250441966, 22), r = Ee(r, n, i, o, t[4], 4118548399, 7), o = Ee(o, r, n, i, t[5], 1200080426, 12), i = Ee(i, o, r, n, t[6], 2821735955, 17), n = Ee(n, i, o, r, t[7], 4249261313, 22), r = Ee(r, n, i, o, t[8], 1770035416, 7), o = Ee(o, r, n, i, t[9], 2336552879, 12), i = Ee(i, o, r, n, t[10], 4294925233, 17), n = Ee(n, i, o, r, t[11], 2304563134, 22), r = Ee(r, n, i, o, t[12], 1804603682, 7), o = Ee(o, r, n, i, t[13], 4254626195, 12), i = Ee(i, o, r, n, t[14], 2792965006, 17), n = Ee(n, i, o, r, t[15], 1236535329, 22), r = Se(r, n, i, o, t[1], 4129170786, 5), o = Se(o, r, n, i, t[6], 3225465664, 9), i = Se(i, o, r, n, t[11], 643717713, 14), n = Se(n, i, o, r, t[0], 3921069994, 20), r = Se(r, n, i, o, t[5], 3593408605, 5), o = Se(o, r, n, i, t[10], 38016083, 9), i = Se(i, o, r, n, t[15], 3634488961, 14), n = Se(n, i, o, r, t[4], 3889429448, 20), r = Se(r, n, i, o, t[9], 568446438, 5), o = Se(o, r, n, i, t[14], 3275163606, 9), i = Se(i, o, r, n, t[3], 4107603335, 14), n = Se(n, i, o, r, t[8], 1163531501, 20), r = Se(r, n, i, o, t[13], 2850285829, 5), o = Se(o, r, n, i, t[2], 4243563512, 9), i = Se(i, o, r, n, t[7], 1735328473, 14), n = Se(n, i, o, r, t[12], 2368359562, 20), r = Re(r, n, i, o, t[5], 4294588738, 4), o = Re(o, r, n, i, t[8], 2272392833, 11), i = Re(i, o, r, n, t[11], 1839030562, 16), n = Re(n, i, o, r, t[14], 4259657740, 23), r = Re(r, n, i, o, t[1], 2763975236, 4), o = Re(o, r, n, i, t[4], 1272893353, 11), i = Re(i, o, r, n, t[7], 4139469664, 16), n = Re(n, i, o, r, t[10], 3200236656, 23), r = Re(r, n, i, o, t[13], 681279174, 4), o = Re(o, r, n, i, t[0], 3936430074, 11), i = Re(i, o, r, n, t[3], 3572445317, 16), n = Re(n, i, o, r, t[6], 76029189, 23), r = Re(r, n, i, o, t[9], 3654602809, 4), o = Re(o, r, n, i, t[12], 3873151461, 11), i = Re(i, o, r, n, t[15], 530742520, 16), n = Re(n, i, o, r, t[2], 3299628645, 23), r = Ce(r, n, i, o, t[0], 4096336452, 6), o = Ce(o, r, n, i, t[7], 1126891415, 10), i = Ce(i, o, r, n, t[14], 2878612391, 15), n = Ce(n, i, o, r, t[5], 4237533241, 21), r = Ce(r, n, i, o, t[12], 1700485571, 6), o = Ce(o, r, n, i, t[3], 2399980690, 10), i = Ce(i, o, r, n, t[10], 4293915773, 15), n = Ce(n, i, o, r, t[1], 2240044497, 21), r = Ce(r, n, i, o, t[8], 1873313359, 6), o = Ce(o, r, n, i, t[15], 4264355552, 10), i = Ce(i, o, r, n, t[6], 2734768916, 15), n = Ce(n, i, o, r, t[13], 1309151649, 21), r = Ce(r, n, i, o, t[4], 4149444226, 6), o = Ce(o, r, n, i, t[11], 3174756917, 10), i = Ce(i, o, r, n, t[2], 718787259, 15), n = Ce(n, i, o, r, t[9], 3951481745, 21), this._a = this._a + r | 0, this._b = this._b + n | 0, this._c = this._c + i | 0, this._d = this._d + o | 0;
};
Bn.prototype._digest = function() {
  this._block[this._blockOffset++] = 128, this._blockOffset > 56 && (this._block.fill(0, this._blockOffset, 64), this._update(), this._blockOffset = 0), this._block.fill(0, this._blockOffset, 56), this._block.writeUInt32LE(this._length[0], 56), this._block.writeUInt32LE(this._length[1], 60), this._update();
  var t = Xc.allocUnsafe(16);
  return t.writeInt32LE(this._a, 0), t.writeInt32LE(this._b, 4), t.writeInt32LE(this._c, 8), t.writeInt32LE(this._d, 12), t;
};
function Ln(t, e) {
  return t << e | t >>> 32 - e;
}
function Ee(t, e, r, n, i, o, a) {
  return Ln(t + (e & r | ~e & n) + i + o | 0, a) + e | 0;
}
function Se(t, e, r, n, i, o, a) {
  return Ln(t + (e & n | r & ~n) + i + o | 0, a) + e | 0;
}
function Re(t, e, r, n, i, o, a) {
  return Ln(t + (e ^ r ^ n) + i + o | 0, a) + e | 0;
}
function Ce(t, e, r, n, i, o, a) {
  return Ln(t + (r ^ (e | ~n)) + i + o | 0, a) + e | 0;
}
var Jc = Bn, vi = Hr.Buffer, eh = we.exports, Qs = Ks, th = new Array(16), gr = [
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
function Pn() {
  Qs.call(this, 64), this._a = 1732584193, this._b = 4023233417, this._c = 2562383102, this._d = 271733878, this._e = 3285377520;
}
eh(Pn, Qs);
Pn.prototype._update = function() {
  for (var t = th, e = 0; e < 16; ++e)
    t[e] = this._block.readInt32LE(e * 4);
  for (var r = this._a | 0, n = this._b | 0, i = this._c | 0, o = this._d | 0, a = this._e | 0, u = this._a | 0, s = this._b | 0, f = this._c | 0, c = this._d | 0, l = this._e | 0, h = 0; h < 80; h += 1) {
    var d, p;
    h < 16 ? (d = Sa(r, n, i, o, a, t[gr[h]], xr[0], wr[h]), p = Aa(u, s, f, c, l, t[br[h]], Er[0], mr[h])) : h < 32 ? (d = Ra(r, n, i, o, a, t[gr[h]], xr[1], wr[h]), p = Oa(u, s, f, c, l, t[br[h]], Er[1], mr[h])) : h < 48 ? (d = Ca(r, n, i, o, a, t[gr[h]], xr[2], wr[h]), p = Ca(u, s, f, c, l, t[br[h]], Er[2], mr[h])) : h < 64 ? (d = Oa(r, n, i, o, a, t[gr[h]], xr[3], wr[h]), p = Ra(u, s, f, c, l, t[br[h]], Er[3], mr[h])) : (d = Aa(r, n, i, o, a, t[gr[h]], xr[4], wr[h]), p = Sa(u, s, f, c, l, t[br[h]], Er[4], mr[h])), r = a, a = o, o = Rt(i, 10), i = n, n = d, u = l, l = c, c = Rt(f, 10), f = s, s = p;
  }
  var y = this._b + i + c | 0;
  this._b = this._c + o + l | 0, this._c = this._d + a + u | 0, this._d = this._e + r + s | 0, this._e = this._a + n + f | 0, this._a = y;
};
Pn.prototype._digest = function() {
  this._block[this._blockOffset++] = 128, this._blockOffset > 56 && (this._block.fill(0, this._blockOffset, 64), this._update(), this._blockOffset = 0), this._block.fill(0, this._blockOffset, 56), this._block.writeUInt32LE(this._length[0], 56), this._block.writeUInt32LE(this._length[1], 60), this._update();
  var t = vi.alloc ? vi.alloc(20) : new vi(20);
  return t.writeInt32LE(this._a, 0), t.writeInt32LE(this._b, 4), t.writeInt32LE(this._c, 8), t.writeInt32LE(this._d, 12), t.writeInt32LE(this._e, 16), t;
};
function Rt(t, e) {
  return t << e | t >>> 32 - e;
}
function Sa(t, e, r, n, i, o, a, u) {
  return Rt(t + (e ^ r ^ n) + o + a | 0, u) + i | 0;
}
function Ra(t, e, r, n, i, o, a, u) {
  return Rt(t + (e & r | ~e & n) + o + a | 0, u) + i | 0;
}
function Ca(t, e, r, n, i, o, a, u) {
  return Rt(t + ((e | ~r) ^ n) + o + a | 0, u) + i | 0;
}
function Oa(t, e, r, n, i, o, a, u) {
  return Rt(t + (e & n | r & ~n) + o + a | 0, u) + i | 0;
}
function Aa(t, e, r, n, i, o, a, u) {
  return Rt(t + (e ^ (r | ~n)) + o + a | 0, u) + i | 0;
}
var rh = Pn, Js = { exports: {} }, eu = Pe.exports.Buffer;
function Hn(t, e) {
  this._block = eu.alloc(t), this._finalSize = e, this._blockSize = t, this._len = 0;
}
Hn.prototype.update = function(t, e) {
  typeof t == "string" && (e = e || "utf8", t = eu.from(t, e));
  for (var r = this._block, n = this._blockSize, i = t.length, o = this._len, a = 0; a < i; ) {
    for (var u = o % n, s = Math.min(i - a, n - u), f = 0; f < s; f++)
      r[u + f] = t[a + f];
    o += s, a += s, o % n === 0 && this._update(r);
  }
  return this._len += i, this;
};
Hn.prototype.digest = function(t) {
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
  var o = this._hash();
  return t ? o.toString(t) : o;
};
Hn.prototype._update = function() {
  throw new Error("_update must be implemented by subclass");
};
var zt = Hn, nh = we.exports, tu = zt, ih = Pe.exports.Buffer, oh = [
  1518500249,
  1859775393,
  -1894007588,
  -899497514
], ah = new Array(80);
function Nr() {
  this.init(), this._w = ah, tu.call(this, 64, 56);
}
nh(Nr, tu);
Nr.prototype.init = function() {
  return this._a = 1732584193, this._b = 4023233417, this._c = 2562383102, this._d = 271733878, this._e = 3285377520, this;
};
function sh(t) {
  return t << 5 | t >>> 27;
}
function uh(t) {
  return t << 30 | t >>> 2;
}
function fh(t, e, r, n) {
  return t === 0 ? e & r | ~e & n : t === 2 ? e & r | e & n | r & n : e ^ r ^ n;
}
Nr.prototype._update = function(t) {
  for (var e = this._w, r = this._a | 0, n = this._b | 0, i = this._c | 0, o = this._d | 0, a = this._e | 0, u = 0; u < 16; ++u)
    e[u] = t.readInt32BE(u * 4);
  for (; u < 80; ++u)
    e[u] = e[u - 3] ^ e[u - 8] ^ e[u - 14] ^ e[u - 16];
  for (var s = 0; s < 80; ++s) {
    var f = ~~(s / 20), c = sh(r) + fh(f, n, i, o) + a + e[s] + oh[f] | 0;
    a = o, o = i, i = uh(n), n = r, r = c;
  }
  this._a = r + this._a | 0, this._b = n + this._b | 0, this._c = i + this._c | 0, this._d = o + this._d | 0, this._e = a + this._e | 0;
};
Nr.prototype._hash = function() {
  var t = ih.allocUnsafe(20);
  return t.writeInt32BE(this._a | 0, 0), t.writeInt32BE(this._b | 0, 4), t.writeInt32BE(this._c | 0, 8), t.writeInt32BE(this._d | 0, 12), t.writeInt32BE(this._e | 0, 16), t;
};
var lh = Nr, ch = we.exports, ru = zt, hh = Pe.exports.Buffer, dh = [
  1518500249,
  1859775393,
  -1894007588,
  -899497514
], ph = new Array(80);
function Fr() {
  this.init(), this._w = ph, ru.call(this, 64, 56);
}
ch(Fr, ru);
Fr.prototype.init = function() {
  return this._a = 1732584193, this._b = 4023233417, this._c = 2562383102, this._d = 271733878, this._e = 3285377520, this;
};
function _h(t) {
  return t << 1 | t >>> 31;
}
function vh(t) {
  return t << 5 | t >>> 27;
}
function yh(t) {
  return t << 30 | t >>> 2;
}
function gh(t, e, r, n) {
  return t === 0 ? e & r | ~e & n : t === 2 ? e & r | e & n | r & n : e ^ r ^ n;
}
Fr.prototype._update = function(t) {
  for (var e = this._w, r = this._a | 0, n = this._b | 0, i = this._c | 0, o = this._d | 0, a = this._e | 0, u = 0; u < 16; ++u)
    e[u] = t.readInt32BE(u * 4);
  for (; u < 80; ++u)
    e[u] = _h(e[u - 3] ^ e[u - 8] ^ e[u - 14] ^ e[u - 16]);
  for (var s = 0; s < 80; ++s) {
    var f = ~~(s / 20), c = vh(r) + gh(f, n, i, o) + a + e[s] + dh[f] | 0;
    a = o, o = i, i = yh(n), n = r, r = c;
  }
  this._a = r + this._a | 0, this._b = n + this._b | 0, this._c = i + this._c | 0, this._d = o + this._d | 0, this._e = a + this._e | 0;
};
Fr.prototype._hash = function() {
  var t = hh.allocUnsafe(20);
  return t.writeInt32BE(this._a | 0, 0), t.writeInt32BE(this._b | 0, 4), t.writeInt32BE(this._c | 0, 8), t.writeInt32BE(this._d | 0, 12), t.writeInt32BE(this._e | 0, 16), t;
};
var bh = Fr, wh = we.exports, nu = zt, mh = Pe.exports.Buffer, xh = [
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
], Eh = new Array(64);
function $r() {
  this.init(), this._w = Eh, nu.call(this, 64, 56);
}
wh($r, nu);
$r.prototype.init = function() {
  return this._a = 1779033703, this._b = 3144134277, this._c = 1013904242, this._d = 2773480762, this._e = 1359893119, this._f = 2600822924, this._g = 528734635, this._h = 1541459225, this;
};
function Sh(t, e, r) {
  return r ^ t & (e ^ r);
}
function Rh(t, e, r) {
  return t & e | r & (t | e);
}
function Ch(t) {
  return (t >>> 2 | t << 30) ^ (t >>> 13 | t << 19) ^ (t >>> 22 | t << 10);
}
function Oh(t) {
  return (t >>> 6 | t << 26) ^ (t >>> 11 | t << 21) ^ (t >>> 25 | t << 7);
}
function Ah(t) {
  return (t >>> 7 | t << 25) ^ (t >>> 18 | t << 14) ^ t >>> 3;
}
function kh(t) {
  return (t >>> 17 | t << 15) ^ (t >>> 19 | t << 13) ^ t >>> 10;
}
$r.prototype._update = function(t) {
  for (var e = this._w, r = this._a | 0, n = this._b | 0, i = this._c | 0, o = this._d | 0, a = this._e | 0, u = this._f | 0, s = this._g | 0, f = this._h | 0, c = 0; c < 16; ++c)
    e[c] = t.readInt32BE(c * 4);
  for (; c < 64; ++c)
    e[c] = kh(e[c - 2]) + e[c - 7] + Ah(e[c - 15]) + e[c - 16] | 0;
  for (var l = 0; l < 64; ++l) {
    var h = f + Oh(a) + Sh(a, u, s) + xh[l] + e[l] | 0, d = Ch(r) + Rh(r, n, i) | 0;
    f = s, s = u, u = a, a = o + h | 0, o = i, i = n, n = r, r = h + d | 0;
  }
  this._a = r + this._a | 0, this._b = n + this._b | 0, this._c = i + this._c | 0, this._d = o + this._d | 0, this._e = a + this._e | 0, this._f = u + this._f | 0, this._g = s + this._g | 0, this._h = f + this._h | 0;
};
$r.prototype._hash = function() {
  var t = mh.allocUnsafe(32);
  return t.writeInt32BE(this._a, 0), t.writeInt32BE(this._b, 4), t.writeInt32BE(this._c, 8), t.writeInt32BE(this._d, 12), t.writeInt32BE(this._e, 16), t.writeInt32BE(this._f, 20), t.writeInt32BE(this._g, 24), t.writeInt32BE(this._h, 28), t;
};
var iu = $r, Mh = we.exports, Ih = iu, Th = zt, Bh = Pe.exports.Buffer, Lh = new Array(64);
function qn() {
  this.init(), this._w = Lh, Th.call(this, 64, 56);
}
Mh(qn, Ih);
qn.prototype.init = function() {
  return this._a = 3238371032, this._b = 914150663, this._c = 812702999, this._d = 4144912697, this._e = 4290775857, this._f = 1750603025, this._g = 1694076839, this._h = 3204075428, this;
};
qn.prototype._hash = function() {
  var t = Bh.allocUnsafe(28);
  return t.writeInt32BE(this._a, 0), t.writeInt32BE(this._b, 4), t.writeInt32BE(this._c, 8), t.writeInt32BE(this._d, 12), t.writeInt32BE(this._e, 16), t.writeInt32BE(this._f, 20), t.writeInt32BE(this._g, 24), t;
};
var Ph = qn, Hh = we.exports, ou = zt, qh = Pe.exports.Buffer, ka = [
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
], Dh = new Array(160);
function Ur() {
  this.init(), this._w = Dh, ou.call(this, 128, 112);
}
Hh(Ur, ou);
Ur.prototype.init = function() {
  return this._ah = 1779033703, this._bh = 3144134277, this._ch = 1013904242, this._dh = 2773480762, this._eh = 1359893119, this._fh = 2600822924, this._gh = 528734635, this._hh = 1541459225, this._al = 4089235720, this._bl = 2227873595, this._cl = 4271175723, this._dl = 1595750129, this._el = 2917565137, this._fl = 725511199, this._gl = 4215389547, this._hl = 327033209, this;
};
function Ma(t, e, r) {
  return r ^ t & (e ^ r);
}
function Ia(t, e, r) {
  return t & e | r & (t | e);
}
function Ta(t, e) {
  return (t >>> 28 | e << 4) ^ (e >>> 2 | t << 30) ^ (e >>> 7 | t << 25);
}
function Ba(t, e) {
  return (t >>> 14 | e << 18) ^ (t >>> 18 | e << 14) ^ (e >>> 9 | t << 23);
}
function jh(t, e) {
  return (t >>> 1 | e << 31) ^ (t >>> 8 | e << 24) ^ t >>> 7;
}
function Nh(t, e) {
  return (t >>> 1 | e << 31) ^ (t >>> 8 | e << 24) ^ (t >>> 7 | e << 25);
}
function Fh(t, e) {
  return (t >>> 19 | e << 13) ^ (e >>> 29 | t << 3) ^ t >>> 6;
}
function $h(t, e) {
  return (t >>> 19 | e << 13) ^ (e >>> 29 | t << 3) ^ (t >>> 6 | e << 26);
}
function ye(t, e) {
  return t >>> 0 < e >>> 0 ? 1 : 0;
}
Ur.prototype._update = function(t) {
  for (var e = this._w, r = this._ah | 0, n = this._bh | 0, i = this._ch | 0, o = this._dh | 0, a = this._eh | 0, u = this._fh | 0, s = this._gh | 0, f = this._hh | 0, c = this._al | 0, l = this._bl | 0, h = this._cl | 0, d = this._dl | 0, p = this._el | 0, y = this._fl | 0, g = this._gl | 0, m = this._hl | 0, x = 0; x < 32; x += 2)
    e[x] = t.readInt32BE(x * 4), e[x + 1] = t.readInt32BE(x * 4 + 4);
  for (; x < 160; x += 2) {
    var S = e[x - 30], k = e[x - 15 * 2 + 1], M = jh(S, k), F = Nh(k, S);
    S = e[x - 2 * 2], k = e[x - 2 * 2 + 1];
    var z = Fh(S, k), P = $h(k, S), H = e[x - 7 * 2], he = e[x - 7 * 2 + 1], le = e[x - 16 * 2], re = e[x - 16 * 2 + 1], j = F + he | 0, $ = M + H + ye(j, F) | 0;
    j = j + P | 0, $ = $ + z + ye(j, P) | 0, j = j + re | 0, $ = $ + le + ye(j, re) | 0, e[x] = $, e[x + 1] = j;
  }
  for (var G = 0; G < 160; G += 2) {
    $ = e[G], j = e[G + 1];
    var ie = Ia(r, n, i), Me = Ia(c, l, h), et = Ta(r, c), ve = Ta(c, r), tt = Ba(a, p), Ge = Ba(p, a), rt = ka[G], ce = ka[G + 1], qe = Ma(a, u, s), Be = Ma(p, y, g), b = m + Ge | 0, w = f + tt + ye(b, m) | 0;
    b = b + Be | 0, w = w + qe + ye(b, Be) | 0, b = b + ce | 0, w = w + rt + ye(b, ce) | 0, b = b + j | 0, w = w + $ + ye(b, j) | 0;
    var O = ve + Me | 0, D = et + ie + ye(O, ve) | 0;
    f = s, m = g, s = u, g = y, u = a, y = p, p = d + b | 0, a = o + w + ye(p, d) | 0, o = i, d = h, i = n, h = l, n = r, l = c, c = b + O | 0, r = w + D + ye(c, b) | 0;
  }
  this._al = this._al + c | 0, this._bl = this._bl + l | 0, this._cl = this._cl + h | 0, this._dl = this._dl + d | 0, this._el = this._el + p | 0, this._fl = this._fl + y | 0, this._gl = this._gl + g | 0, this._hl = this._hl + m | 0, this._ah = this._ah + r + ye(this._al, c) | 0, this._bh = this._bh + n + ye(this._bl, l) | 0, this._ch = this._ch + i + ye(this._cl, h) | 0, this._dh = this._dh + o + ye(this._dl, d) | 0, this._eh = this._eh + a + ye(this._el, p) | 0, this._fh = this._fh + u + ye(this._fl, y) | 0, this._gh = this._gh + s + ye(this._gl, g) | 0, this._hh = this._hh + f + ye(this._hl, m) | 0;
};
Ur.prototype._hash = function() {
  var t = qh.allocUnsafe(64);
  function e(r, n, i) {
    t.writeInt32BE(r, i), t.writeInt32BE(n, i + 4);
  }
  return e(this._ah, this._al, 0), e(this._bh, this._bl, 8), e(this._ch, this._cl, 16), e(this._dh, this._dl, 24), e(this._eh, this._el, 32), e(this._fh, this._fl, 40), e(this._gh, this._gl, 48), e(this._hh, this._hl, 56), t;
};
var au = Ur, Uh = we.exports, Wh = au, zh = zt, Vh = Pe.exports.Buffer, Gh = new Array(160);
function Dn() {
  this.init(), this._w = Gh, zh.call(this, 128, 112);
}
Uh(Dn, Wh);
Dn.prototype.init = function() {
  return this._ah = 3418070365, this._bh = 1654270250, this._ch = 2438529370, this._dh = 355462360, this._eh = 1731405415, this._fh = 2394180231, this._gh = 3675008525, this._hh = 1203062813, this._al = 3238371032, this._bl = 914150663, this._cl = 812702999, this._dl = 4144912697, this._el = 4290775857, this._fl = 1750603025, this._gl = 1694076839, this._hl = 3204075428, this;
};
Dn.prototype._hash = function() {
  var t = Vh.allocUnsafe(48);
  function e(r, n, i) {
    t.writeInt32BE(r, i), t.writeInt32BE(n, i + 4);
  }
  return e(this._ah, this._al, 0), e(this._bh, this._bl, 8), e(this._ch, this._cl, 16), e(this._dh, this._dl, 24), e(this._eh, this._el, 32), e(this._fh, this._fl, 40), t;
};
var Yh = Dn, Mt = Js.exports = function(e) {
  e = e.toLowerCase();
  var r = Mt[e];
  if (!r)
    throw new Error(e + " is not supported (we accept pull requests)");
  return new r();
};
Mt.sha = lh;
Mt.sha1 = bh;
Mt.sha224 = Ph;
Mt.sha256 = iu;
Mt.sha384 = Yh;
Mt.sha512 = au;
function It() {
  this.head = null, this.tail = null, this.length = 0;
}
It.prototype.push = function(t) {
  var e = { data: t, next: null };
  this.length > 0 ? this.tail.next = e : this.head = e, this.tail = e, ++this.length;
};
It.prototype.unshift = function(t) {
  var e = { data: t, next: this.head };
  this.length === 0 && (this.tail = e), this.head = e, ++this.length;
};
It.prototype.shift = function() {
  if (this.length !== 0) {
    var t = this.head.data;
    return this.length === 1 ? this.head = this.tail = null : this.head = this.head.next, --this.length, t;
  }
};
It.prototype.clear = function() {
  this.head = this.tail = null, this.length = 0;
};
It.prototype.join = function(t) {
  if (this.length === 0)
    return "";
  for (var e = this.head, r = "" + e.data; e = e.next; )
    r += t + e.data;
  return r;
};
It.prototype.concat = function(t) {
  if (this.length === 0)
    return E.alloc(0);
  if (this.length === 1)
    return this.head.data;
  for (var e = E.allocUnsafe(t >>> 0), r = this.head, n = 0; r; )
    r.data.copy(e, n), n += r.data.length, r = r.next;
  return e;
};
fe.ReadableState = su;
var Q = Gi("stream");
vt(fe, Fe.exports);
function Zh(t, e, r) {
  if (typeof t.prependListener == "function")
    return t.prependListener(e, r);
  !t._events || !t._events[e] ? t.on(e, r) : Array.isArray(t._events[e]) ? t._events[e].unshift(r) : t._events[e] = [r, t._events[e]];
}
function Kh(t, e) {
  return t.listeners(e).length;
}
function su(t, e) {
  t = t || {}, this.objectMode = !!t.objectMode, e instanceof He && (this.objectMode = this.objectMode || !!t.readableObjectMode);
  var r = t.highWaterMark, n = this.objectMode ? 16 : 16 * 1024;
  this.highWaterMark = r || r === 0 ? r : n, this.highWaterMark = ~~this.highWaterMark, this.buffer = new It(), this.length = 0, this.pipes = null, this.pipesCount = 0, this.flowing = null, this.ended = !1, this.endEmitted = !1, this.reading = !1, this.sync = !0, this.needReadable = !1, this.emittedReadable = !1, this.readableListening = !1, this.resumeScheduled = !1, this.defaultEncoding = t.defaultEncoding || "utf8", this.ranOut = !1, this.awaitDrain = 0, this.readingMore = !1, this.decoder = null, this.encoding = null, t.encoding && (this.decoder = new Us(t.encoding), this.encoding = t.encoding);
}
function fe(t) {
  if (!(this instanceof fe))
    return new fe(t);
  this._readableState = new su(t, this), this.readable = !0, t && typeof t.read == "function" && (this._read = t.read), Fe.exports.call(this);
}
fe.prototype.push = function(t, e) {
  var r = this._readableState;
  return !r.objectMode && typeof t == "string" && (e = e || r.defaultEncoding, e !== r.encoding && (t = E.from(t, e), e = "")), uu(this, r, t, e, !1);
};
fe.prototype.unshift = function(t) {
  var e = this._readableState;
  return uu(this, e, t, "", !0);
};
fe.prototype.isPaused = function() {
  return this._readableState.flowing === !1;
};
function uu(t, e, r, n, i) {
  var o = Jh(e, r);
  if (o)
    t.emit("error", o);
  else if (r === null)
    e.reading = !1, ed(t, e);
  else if (e.objectMode || r && r.length > 0)
    if (e.ended && !i) {
      var a = new Error("stream.push() after EOF");
      t.emit("error", a);
    } else if (e.endEmitted && i) {
      var u = new Error("stream.unshift() after end event");
      t.emit("error", u);
    } else {
      var s;
      e.decoder && !i && !n && (r = e.decoder.write(r), s = !e.objectMode && r.length === 0), i || (e.reading = !1), s || (e.flowing && e.length === 0 && !e.sync ? (t.emit("data", r), t.read(0)) : (e.length += e.objectMode ? 1 : r.length, i ? e.buffer.unshift(r) : e.buffer.push(r), e.needReadable && jn(t))), td(t, e);
    }
  else
    i || (e.reading = !1);
  return Xh(e);
}
function Xh(t) {
  return !t.ended && (t.needReadable || t.length < t.highWaterMark || t.length === 0);
}
fe.prototype.setEncoding = function(t) {
  return this._readableState.decoder = new Us(t), this._readableState.encoding = t, this;
};
var La = 8388608;
function Qh(t) {
  return t >= La ? t = La : (t--, t |= t >>> 1, t |= t >>> 2, t |= t >>> 4, t |= t >>> 8, t |= t >>> 16, t++), t;
}
function Pa(t, e) {
  return t <= 0 || e.length === 0 && e.ended ? 0 : e.objectMode ? 1 : t !== t ? e.flowing && e.length ? e.buffer.head.data.length : e.length : (t > e.highWaterMark && (e.highWaterMark = Qh(t)), t <= e.length ? t : e.ended ? e.length : (e.needReadable = !0, 0));
}
fe.prototype.read = function(t) {
  Q("read", t), t = parseInt(t, 10);
  var e = this._readableState, r = t;
  if (t !== 0 && (e.emittedReadable = !1), t === 0 && e.needReadable && (e.length >= e.highWaterMark || e.ended))
    return Q("read: emitReadable", e.length, e.ended), e.length === 0 && e.ended ? yi(this) : jn(this), null;
  if (t = Pa(t, e), t === 0 && e.ended)
    return e.length === 0 && yi(this), null;
  var n = e.needReadable;
  Q("need readable", n), (e.length === 0 || e.length - t < e.highWaterMark) && (n = !0, Q("length less than watermark", n)), e.ended || e.reading ? (n = !1, Q("reading or ended", n)) : n && (Q("do read"), e.reading = !0, e.sync = !0, e.length === 0 && (e.needReadable = !0), this._read(e.highWaterMark), e.sync = !1, e.reading || (t = Pa(r, e)));
  var i;
  return t > 0 ? i = fu(t, e) : i = null, i === null ? (e.needReadable = !0, t = 0) : e.length -= t, e.length === 0 && (e.ended || (e.needReadable = !0), r !== t && e.ended && yi(this)), i !== null && this.emit("data", i), i;
};
function Jh(t, e) {
  var r = null;
  return !E.isBuffer(e) && typeof e != "string" && e !== null && e !== void 0 && !t.objectMode && (r = new TypeError("Invalid non-string/buffer chunk")), r;
}
function ed(t, e) {
  if (!e.ended) {
    if (e.decoder) {
      var r = e.decoder.end();
      r && r.length && (e.buffer.push(r), e.length += e.objectMode ? 1 : r.length);
    }
    e.ended = !0, jn(t);
  }
}
function jn(t) {
  var e = t._readableState;
  e.needReadable = !1, e.emittedReadable || (Q("emitReadable", e.flowing), e.emittedReadable = !0, e.sync ? N.exports.nextTick(Ha, t) : Ha(t));
}
function Ha(t) {
  Q("emit readable"), t.emit("readable"), eo(t);
}
function td(t, e) {
  e.readingMore || (e.readingMore = !0, N.exports.nextTick(rd, t, e));
}
function rd(t, e) {
  for (var r = e.length; !e.reading && !e.flowing && !e.ended && e.length < e.highWaterMark && (Q("maybeReadMore read 0"), t.read(0), r !== e.length); )
    r = e.length;
  e.readingMore = !1;
}
fe.prototype._read = function(t) {
  this.emit("error", new Error("not implemented"));
};
fe.prototype.pipe = function(t, e) {
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
  n.pipesCount += 1, Q("pipe count=%d opts=%j", n.pipesCount, e);
  var i = !e || e.end !== !1, o = i ? u : c;
  n.endEmitted ? N.exports.nextTick(o) : r.once("end", o), t.on("unpipe", a);
  function a(m) {
    Q("onunpipe"), m === r && c();
  }
  function u() {
    Q("onend"), t.end();
  }
  var s = nd(r);
  t.on("drain", s);
  var f = !1;
  function c() {
    Q("cleanup"), t.removeListener("close", p), t.removeListener("finish", y), t.removeListener("drain", s), t.removeListener("error", d), t.removeListener("unpipe", a), r.removeListener("end", u), r.removeListener("end", c), r.removeListener("data", h), f = !0, n.awaitDrain && (!t._writableState || t._writableState.needDrain) && s();
  }
  var l = !1;
  r.on("data", h);
  function h(m) {
    Q("ondata"), l = !1;
    var x = t.write(m);
    x === !1 && !l && ((n.pipesCount === 1 && n.pipes === t || n.pipesCount > 1 && lu(n.pipes, t) !== -1) && !f && (Q("false write response, pause", r._readableState.awaitDrain), r._readableState.awaitDrain++, l = !0), r.pause());
  }
  function d(m) {
    Q("onerror", m), g(), t.removeListener("error", d), Kh(t, "error") === 0 && t.emit("error", m);
  }
  Zh(t, "error", d);
  function p() {
    t.removeListener("finish", y), g();
  }
  t.once("close", p);
  function y() {
    Q("onfinish"), t.removeListener("close", p), g();
  }
  t.once("finish", y);
  function g() {
    Q("unpipe"), r.unpipe(t);
  }
  return t.emit("pipe", r), n.flowing || (Q("pipe resume"), r.resume()), t;
};
function nd(t) {
  return function() {
    var e = t._readableState;
    Q("pipeOnDrain", e.awaitDrain), e.awaitDrain && e.awaitDrain--, e.awaitDrain === 0 && t.listeners("data").length && (e.flowing = !0, eo(t));
  };
}
fe.prototype.unpipe = function(t) {
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
  var o = lu(e.pipes, t);
  return o === -1 ? this : (e.pipes.splice(o, 1), e.pipesCount -= 1, e.pipesCount === 1 && (e.pipes = e.pipes[0]), t.emit("unpipe", this), this);
};
fe.prototype.on = function(t, e) {
  var r = Fe.exports.prototype.on.call(this, t, e);
  if (t === "data")
    this._readableState.flowing !== !1 && this.resume();
  else if (t === "readable") {
    var n = this._readableState;
    !n.endEmitted && !n.readableListening && (n.readableListening = n.needReadable = !0, n.emittedReadable = !1, n.reading ? n.length && jn(this) : N.exports.nextTick(id, this));
  }
  return r;
};
fe.prototype.addListener = fe.prototype.on;
function id(t) {
  Q("readable nexttick read 0"), t.read(0);
}
fe.prototype.resume = function() {
  var t = this._readableState;
  return t.flowing || (Q("resume"), t.flowing = !0, od(this, t)), this;
};
function od(t, e) {
  e.resumeScheduled || (e.resumeScheduled = !0, N.exports.nextTick(ad, t, e));
}
function ad(t, e) {
  e.reading || (Q("resume read 0"), t.read(0)), e.resumeScheduled = !1, e.awaitDrain = 0, t.emit("resume"), eo(t), e.flowing && !e.reading && t.read(0);
}
fe.prototype.pause = function() {
  return Q("call pause flowing=%j", this._readableState.flowing), this._readableState.flowing !== !1 && (Q("pause"), this._readableState.flowing = !1, this.emit("pause")), this;
};
function eo(t) {
  var e = t._readableState;
  for (Q("flow", e.flowing); e.flowing && t.read() !== null; )
    ;
}
fe.prototype.wrap = function(t) {
  var e = this._readableState, r = !1, n = this;
  t.on("end", function() {
    if (Q("wrapped end"), e.decoder && !e.ended) {
      var a = e.decoder.end();
      a && a.length && n.push(a);
    }
    n.push(null);
  }), t.on("data", function(a) {
    if (Q("wrapped data"), e.decoder && (a = e.decoder.write(a)), !(e.objectMode && a == null) && !(!e.objectMode && (!a || !a.length))) {
      var u = n.push(a);
      u || (r = !0, t.pause());
    }
  });
  for (var i in t)
    this[i] === void 0 && typeof t[i] == "function" && (this[i] = function(a) {
      return function() {
        return t[a].apply(t, arguments);
      };
    }(i));
  var o = ["error", "close", "destroy", "pause", "resume"];
  return cd(o, function(a) {
    t.on(a, n.emit.bind(n, a));
  }), n._read = function(a) {
    Q("wrapped _read", a), r && (r = !1, t.resume());
  }, n;
};
fe._fromList = fu;
function fu(t, e) {
  if (e.length === 0)
    return null;
  var r;
  return e.objectMode ? r = e.buffer.shift() : !t || t >= e.length ? (e.decoder ? r = e.buffer.join("") : e.buffer.length === 1 ? r = e.buffer.head.data : r = e.buffer.concat(e.length), e.buffer.clear()) : r = sd(t, e.buffer, e.decoder), r;
}
function sd(t, e, r) {
  var n;
  return t < e.head.data.length ? (n = e.head.data.slice(0, t), e.head.data = e.head.data.slice(t)) : t === e.head.data.length ? n = e.shift() : n = r ? ud(t, e) : fd(t, e), n;
}
function ud(t, e) {
  var r = e.head, n = 1, i = r.data;
  for (t -= i.length; r = r.next; ) {
    var o = r.data, a = t > o.length ? o.length : t;
    if (a === o.length ? i += o : i += o.slice(0, t), t -= a, t === 0) {
      a === o.length ? (++n, r.next ? e.head = r.next : e.head = e.tail = null) : (e.head = r, r.data = o.slice(a));
      break;
    }
    ++n;
  }
  return e.length -= n, i;
}
function fd(t, e) {
  var r = E.allocUnsafe(t), n = e.head, i = 1;
  for (n.data.copy(r), t -= n.data.length; n = n.next; ) {
    var o = n.data, a = t > o.length ? o.length : t;
    if (o.copy(r, r.length - t, 0, a), t -= a, t === 0) {
      a === o.length ? (++i, n.next ? e.head = n.next : e.head = e.tail = null) : (e.head = n, n.data = o.slice(a));
      break;
    }
    ++i;
  }
  return e.length -= i, r;
}
function yi(t) {
  var e = t._readableState;
  if (e.length > 0)
    throw new Error('"endReadable()" called on non-empty stream');
  e.endEmitted || (e.ended = !0, N.exports.nextTick(ld, e, t));
}
function ld(t, e) {
  !t.endEmitted && t.length === 0 && (t.endEmitted = !0, e.readable = !1, e.emit("end"));
}
function cd(t, e) {
  for (var r = 0, n = t.length; r < n; r++)
    e(t[r], r);
}
function lu(t, e) {
  for (var r = 0, n = t.length; r < n; r++)
    if (t[r] === e)
      return r;
  return -1;
}
xe.WritableState = to;
vt(xe, Fe.exports.EventEmitter);
function hd() {
}
function dd(t, e, r) {
  this.chunk = t, this.encoding = e, this.callback = r, this.next = null;
}
function to(t, e) {
  Object.defineProperty(this, "buffer", {
    get: kn(function() {
      return this.getBuffer();
    }, "_writableState.buffer is deprecated. Use _writableState.getBuffer instead.")
  }), t = t || {}, this.objectMode = !!t.objectMode, e instanceof He && (this.objectMode = this.objectMode || !!t.writableObjectMode);
  var r = t.highWaterMark, n = this.objectMode ? 16 : 16 * 1024;
  this.highWaterMark = r || r === 0 ? r : n, this.highWaterMark = ~~this.highWaterMark, this.needDrain = !1, this.ending = !1, this.ended = !1, this.finished = !1;
  var i = t.decodeStrings === !1;
  this.decodeStrings = !i, this.defaultEncoding = t.defaultEncoding || "utf8", this.length = 0, this.writing = !1, this.corked = 0, this.sync = !0, this.bufferProcessing = !1, this.onwrite = function(o) {
    wd(e, o);
  }, this.writecb = null, this.writelen = 0, this.bufferedRequest = null, this.lastBufferedRequest = null, this.pendingcb = 0, this.prefinished = !1, this.errorEmitted = !1, this.bufferedRequestCount = 0, this.corkedRequestsFree = new pu(this);
}
to.prototype.getBuffer = function() {
  for (var e = this.bufferedRequest, r = []; e; )
    r.push(e), e = e.next;
  return r;
};
function xe(t) {
  if (!(this instanceof xe) && !(this instanceof He))
    return new xe(t);
  this._writableState = new to(t, this), this.writable = !0, t && (typeof t.write == "function" && (this._write = t.write), typeof t.writev == "function" && (this._writev = t.writev)), Fe.exports.EventEmitter.call(this);
}
xe.prototype.pipe = function() {
  this.emit("error", new Error("Cannot pipe, not readable"));
};
function pd(t, e) {
  var r = new Error("write after end");
  t.emit("error", r), N.exports.nextTick(e, r);
}
function _d(t, e, r, n) {
  var i = !0, o = !1;
  return r === null ? o = new TypeError("May not write null values to stream") : !E.isBuffer(r) && typeof r != "string" && r !== void 0 && !e.objectMode && (o = new TypeError("Invalid non-string/buffer chunk")), o && (t.emit("error", o), N.exports.nextTick(n, o), i = !1), i;
}
xe.prototype.write = function(t, e, r) {
  var n = this._writableState, i = !1;
  return typeof e == "function" && (r = e, e = null), E.isBuffer(t) ? e = "buffer" : e || (e = n.defaultEncoding), typeof r != "function" && (r = hd), n.ended ? pd(this, r) : _d(this, n, t, r) && (n.pendingcb++, i = yd(this, n, t, e, r)), i;
};
xe.prototype.cork = function() {
  var t = this._writableState;
  t.corked++;
};
xe.prototype.uncork = function() {
  var t = this._writableState;
  t.corked && (t.corked--, !t.writing && !t.corked && !t.finished && !t.bufferProcessing && t.bufferedRequest && cu(this, t));
};
xe.prototype.setDefaultEncoding = function(e) {
  if (typeof e == "string" && (e = e.toLowerCase()), !(["hex", "utf8", "utf-8", "ascii", "binary", "base64", "ucs2", "ucs-2", "utf16le", "utf-16le", "raw"].indexOf((e + "").toLowerCase()) > -1))
    throw new TypeError("Unknown encoding: " + e);
  return this._writableState.defaultEncoding = e, this;
};
function vd(t, e, r) {
  return !t.objectMode && t.decodeStrings !== !1 && typeof e == "string" && (e = E.from(e, r)), e;
}
function yd(t, e, r, n, i) {
  r = vd(e, r, n), E.isBuffer(r) && (n = "buffer");
  var o = e.objectMode ? 1 : r.length;
  e.length += o;
  var a = e.length < e.highWaterMark;
  if (a || (e.needDrain = !0), e.writing || e.corked) {
    var u = e.lastBufferedRequest;
    e.lastBufferedRequest = new dd(r, n, i), u ? u.next = e.lastBufferedRequest : e.bufferedRequest = e.lastBufferedRequest, e.bufferedRequestCount += 1;
  } else
    Ii(t, e, !1, o, r, n, i);
  return a;
}
function Ii(t, e, r, n, i, o, a) {
  e.writelen = n, e.writecb = a, e.writing = !0, e.sync = !0, r ? t._writev(i, e.onwrite) : t._write(i, o, e.onwrite), e.sync = !1;
}
function gd(t, e, r, n, i) {
  --e.pendingcb, r ? N.exports.nextTick(i, n) : i(n), t._writableState.errorEmitted = !0, t.emit("error", n);
}
function bd(t) {
  t.writing = !1, t.writecb = null, t.length -= t.writelen, t.writelen = 0;
}
function wd(t, e) {
  var r = t._writableState, n = r.sync, i = r.writecb;
  if (bd(r), e)
    gd(t, r, n, e, i);
  else {
    var o = hu(r);
    !o && !r.corked && !r.bufferProcessing && r.bufferedRequest && cu(t, r), n ? N.exports.nextTick(qa, t, r, o, i) : qa(t, r, o, i);
  }
}
function qa(t, e, r, n) {
  r || md(t, e), e.pendingcb--, n(), du(t, e);
}
function md(t, e) {
  e.length === 0 && e.needDrain && (e.needDrain = !1, t.emit("drain"));
}
function cu(t, e) {
  e.bufferProcessing = !0;
  var r = e.bufferedRequest;
  if (t._writev && r && r.next) {
    var n = e.bufferedRequestCount, i = new Array(n), o = e.corkedRequestsFree;
    o.entry = r;
    for (var a = 0; r; )
      i[a] = r, r = r.next, a += 1;
    Ii(t, e, !0, e.length, i, "", o.finish), e.pendingcb++, e.lastBufferedRequest = null, o.next ? (e.corkedRequestsFree = o.next, o.next = null) : e.corkedRequestsFree = new pu(e);
  } else {
    for (; r; ) {
      var u = r.chunk, s = r.encoding, f = r.callback, c = e.objectMode ? 1 : u.length;
      if (Ii(t, e, !1, c, u, s, f), r = r.next, e.writing)
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
  typeof t == "function" ? (r = t, t = null, e = null) : typeof e == "function" && (r = e, e = null), t != null && this.write(t, e), n.corked && (n.corked = 1, this.uncork()), !n.ending && !n.finished && xd(this, n, r);
};
function hu(t) {
  return t.ending && t.length === 0 && t.bufferedRequest === null && !t.finished && !t.writing;
}
function Da(t, e) {
  e.prefinished || (e.prefinished = !0, t.emit("prefinish"));
}
function du(t, e) {
  var r = hu(e);
  return r && (e.pendingcb === 0 ? (Da(t, e), e.finished = !0, t.emit("finish")) : Da(t, e)), r;
}
function xd(t, e, r) {
  e.ending = !0, du(t, e), r && (e.finished ? N.exports.nextTick(r) : t.once("finish", r)), e.ended = !0, t.writable = !1;
}
function pu(t) {
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
vt(He, fe);
var ja = Object.keys(xe.prototype);
for (var gi = 0; gi < ja.length; gi++) {
  var bi = ja[gi];
  He.prototype[bi] || (He.prototype[bi] = xe.prototype[bi]);
}
function He(t) {
  if (!(this instanceof He))
    return new He(t);
  fe.call(this, t), xe.call(this, t), t && t.readable === !1 && (this.readable = !1), t && t.writable === !1 && (this.writable = !1), this.allowHalfOpen = !0, t && t.allowHalfOpen === !1 && (this.allowHalfOpen = !1), this.once("end", Ed);
}
function Ed() {
  this.allowHalfOpen || this._writableState.ended || N.exports.nextTick(Sd, this);
}
function Sd(t) {
  t.end();
}
vt(We, He);
function Rd(t) {
  this.afterTransform = function(e, r) {
    return Cd(t, e, r);
  }, this.needTransform = !1, this.transforming = !1, this.writecb = null, this.writechunk = null, this.writeencoding = null;
}
function Cd(t, e, r) {
  var n = t._transformState;
  n.transforming = !1;
  var i = n.writecb;
  if (!i)
    return t.emit("error", new Error("no writecb in Transform class"));
  n.writechunk = null, n.writecb = null, r != null && t.push(r), i(e);
  var o = t._readableState;
  o.reading = !1, (o.needReadable || o.length < o.highWaterMark) && t._read(o.highWaterMark);
}
function We(t) {
  if (!(this instanceof We))
    return new We(t);
  He.call(this, t), this._transformState = new Rd(this);
  var e = this;
  this._readableState.needReadable = !0, this._readableState.sync = !1, t && (typeof t.transform == "function" && (this._transform = t.transform), typeof t.flush == "function" && (this._flush = t.flush)), this.once("prefinish", function() {
    typeof this._flush == "function" ? this._flush(function(r) {
      Na(e, r);
    }) : Na(e);
  });
}
We.prototype.push = function(t, e) {
  return this._transformState.needTransform = !1, He.prototype.push.call(this, t, e);
};
We.prototype._transform = function(t, e, r) {
  throw new Error("Not implemented");
};
We.prototype._write = function(t, e, r) {
  var n = this._transformState;
  if (n.writecb = r, n.writechunk = t, n.writeencoding = e, !n.transforming) {
    var i = this._readableState;
    (n.needTransform || i.needReadable || i.length < i.highWaterMark) && this._read(i.highWaterMark);
  }
};
We.prototype._read = function(t) {
  var e = this._transformState;
  e.writechunk !== null && e.writecb && !e.transforming ? (e.transforming = !0, this._transform(e.writechunk, e.writeencoding, e.afterTransform)) : e.needTransform = !0;
};
function Na(t, e) {
  if (e)
    return t.emit("error", e);
  var r = t._writableState, n = t._transformState;
  if (r.length)
    throw new Error("Calling transform done when ws.length != 0");
  if (n.transforming)
    throw new Error("Calling transform done when still transforming");
  return t.push(null);
}
vt($t, We);
function $t(t) {
  if (!(this instanceof $t))
    return new $t(t);
  We.call(this, t);
}
$t.prototype._transform = function(t, e, r) {
  r(null, t);
};
vt(ze, Fe.exports);
ze.Readable = fe;
ze.Writable = xe;
ze.Duplex = He;
ze.Transform = We;
ze.PassThrough = $t;
ze.Stream = ze;
function ze() {
  Fe.exports.call(this);
}
ze.prototype.pipe = function(t, e) {
  var r = this;
  function n(c) {
    t.writable && t.write(c) === !1 && r.pause && r.pause();
  }
  r.on("data", n);
  function i() {
    r.readable && r.resume && r.resume();
  }
  t.on("drain", i), !t._isStdio && (!e || e.end !== !1) && (r.on("end", a), r.on("close", u));
  var o = !1;
  function a() {
    o || (o = !0, t.end());
  }
  function u() {
    o || (o = !0, typeof t.destroy == "function" && t.destroy());
  }
  function s(c) {
    if (f(), Fe.exports.listenerCount(this, "error") === 0)
      throw c;
  }
  r.on("error", s), t.on("error", s);
  function f() {
    r.removeListener("data", n), t.removeListener("drain", i), r.removeListener("end", a), r.removeListener("close", u), r.removeListener("error", s), t.removeListener("error", s), r.removeListener("end", f), r.removeListener("close", f), t.removeListener("close", f);
  }
  return r.on("end", f), r.on("close", f), t.on("close", f), t.emit("pipe", r), t;
};
const Od = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ze,
  Readable: fe,
  Writable: xe,
  Duplex: He,
  Transform: We,
  PassThrough: $t,
  Stream: ze
}, Symbol.toStringTag, { value: "Module" })), Ad = /* @__PURE__ */ Fi(Od);
var _u = Pe.exports.Buffer, vu = Ad.Transform, kd = gn.StringDecoder, Md = we.exports;
function Ve(t) {
  vu.call(this), this.hashMode = typeof t == "string", this.hashMode ? this[t] = this._finalOrDigest : this.final = this._finalOrDigest, this._final && (this.__final = this._final, this._final = null), this._decoder = null, this._encoding = null;
}
Md(Ve, vu);
Ve.prototype.update = function(t, e, r) {
  typeof t == "string" && (t = _u.from(t, e));
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
  var e = this.__final() || _u.alloc(0);
  return t && (e = this._toString(e, t, !0)), e;
};
Ve.prototype._toString = function(t, e, r) {
  if (this._decoder || (this._decoder = new kd(e), this._encoding = e), this._encoding !== e)
    throw new Error("can't switch encodings");
  var n = this._decoder.write(t);
  return r && (n += this._decoder.end()), n;
};
var Id = Ve, Td = we.exports, Bd = Jc, Ld = rh, Pd = Js.exports, yu = Id;
function Nn(t) {
  yu.call(this, "digest"), this._hash = t;
}
Td(Nn, yu);
Nn.prototype._update = function(t) {
  this._hash.update(t);
};
Nn.prototype._final = function() {
  return this._hash.digest();
};
var Hd = function(e) {
  return e = e.toLowerCase(), e === "md5" ? new Bd() : e === "rmd160" || e === "ripemd160" ? new Ld() : new Nn(Pd(e));
};
function qd(t) {
  return JSON.stringify([
    0,
    t.pubkey,
    t.created_at,
    t.kind,
    t.tags,
    t.content
  ]);
}
function ro(t) {
  let e = Hd("sha256").update(E.from(qd(t))).digest();
  return E.from(e).toString("hex");
}
function Dd(t) {
  if (t.id !== ro(t) || typeof t.content != "string" || typeof t.created_at != "number" || !Array.isArray(t.tags))
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
function gu(t) {
  return qi.verify(t.sig, t.id, t.pubkey);
}
async function jd(t, e) {
  return E.from(
    await qi.sign(ro(t), e)
  ).toString("hex");
}
function Nd(t, e) {
  if (t.ids && t.ids.indexOf(e.id) === -1 || t.kinds && t.kinds.indexOf(e.kind) === -1 || t.authors && t.authors.indexOf(e.pubkey) === -1)
    return !1;
  for (let r in t)
    if (r[0] === "#" && t[r] && !e.tags.find(
      ([n, i]) => n === r.slice(1) && t[r].indexOf(i) !== -1
    ))
      return !1;
  return !(t.since && e.created_at < t.since || t.until && e.created_at >= t.until);
}
function Fd(t, e) {
  for (let r = 0; r < t.length; r++)
    if (Nd(t[r], e))
      return !0;
  return !1;
}
function Ti(t) {
  let [e, ...r] = t.trim().split("?");
  return e.slice(0, 4) === "http" && (e = "ws" + e.slice(4)), e.slice(0, 2) !== "ws" && (e = "wss://" + e), e.length && e[e.length - 1] === "/" && (e = e.slice(0, -1)), [e, ...r].join("?");
}
function $d(t, e = () => {
}, r = () => {
}) {
  t = Ti(t);
  var n, i, o, a, u = {}, s = {};
  let f = 1, c = 1;
  function l() {
    o = new Promise((m) => {
      i = m;
    });
  }
  var h = {}, d = {};
  function p() {
    n = new WebSocket(t), n.onopen = () => {
      if (console.log("connected to", t), i(), a) {
        a = !1;
        for (let m in u) {
          let x = u[m], S = h[m], k = d[m];
          g({ eventCb: S, filter: x }, m, k);
        }
      }
    }, n.onerror = (m) => {
      console.log("error connecting to relay", t), r(m);
    }, n.onclose = () => {
      l(), f++, c += f ** 3, c > 14400 && (c = 14400), console.log(
        `relay ${t} connection closed. reconnecting in ${c} seconds.`
      ), setTimeout(async () => {
        try {
          p();
        } catch {
        }
      }, c * 1e3), a = !0;
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
            console.log(`message from relay ${t}: ${x[1]}`), e(x[1]);
            return;
          case "EOSE":
            if (x.length != 2)
              return;
            console.log(`Channel ${x[1]}: End-of-stored-events`), d[x[1]] && d[x[1]]();
            return;
          case "EVENT":
            if (x.length != 3)
              return;
            let S = x[1], k = x[2];
            Dd(k) && (s[S] || gu(k)) && h[S] && Fd(u[S], k) && h[S](k);
            return;
        }
    };
  }
  l();
  try {
    p();
  } catch {
  }
  async function y(m) {
    let x = JSON.stringify(m);
    await o, n.send(x);
  }
  const g = ({ cb: m, filter: x, beforeSend: S, skipVerification: k }, M = Math.random().toString().slice(2), F) => {
    var z = [];
    Array.isArray(x) ? z = x : z.push(x), S && (z = S({ filter: x, relay: t, channel: M }).filter), y(["REQ", M, ...z]), h[M] = m, d[M] = F, u[M] = z, s[M] = k;
    const P = m, H = z, he = S;
    return {
      sub: ({
        cb: le = P,
        filter: re = H,
        beforeSend: j = he
      }) => g({ cb: le, filter: re, beforeSend: j, skipVerification: k }, M),
      unsub: () => {
        delete u[M], delete h[M], delete d[M], delete s[M], y(["CLOSE", M]);
      }
    };
  };
  return {
    url: t,
    sub: g,
    async publish(m, x) {
      try {
        if (await y(["EVENT", m]), x) {
          x(0);
          let { unsub: S } = g(
            {
              cb: () => {
                x(1), S(), clearTimeout(k);
              },
              filter: { ids: [m.id] }
            },
            `monitor-${m.id.slice(0, 5)}`
          ), k = setTimeout(S, 5e3);
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
function Ud() {
  var t, e;
  const r = {
    randomChoice: null,
    wait: !1
  }, n = {}, i = [];
  function o(s, f) {
    for (let c = 0; c < i.length; c++) {
      let { relay: l } = n[f];
      i[c](s, l);
    }
  }
  const a = {};
  return {
    sub: ({ cb: s, filter: f, beforeSend: c }, l, h) => {
      l || (l = Math.random().toString().slice(2));
      const d = Object.fromEntries(
        Object.values(n).filter(({ policy: M }) => M.read).map(({ relay: M }) => [
          M.url,
          M.sub(
            { cb: (F) => s(F, M.url), filter: f, beforeSend: c },
            l,
            h
          )
        ])
      ), p = s, y = f, g = c, m = () => {
        Object.values(d).forEach((M) => M.unsub()), delete a[l];
      }, x = ({
        cb: M = p,
        filter: F = y,
        beforeSend: z = g
      }) => (Object.entries(d).map(([P, H]) => [
        P,
        H.sub({ cb: (he) => M(he, P), filter: F, beforeSend: z }, l)
      ]), a[l]), S = (M) => (d[M.url] = M.sub(
        { cb: (F) => s(F, M.url), filter: f, beforeSend: c },
        l,
        () => h(M.url)
      ), a[l]), k = (M) => (M in d && (d[M].unsub(), Object.keys(d).length === 0 && m()), a[l]);
      return a[l] = {
        sub: x,
        unsub: m,
        addRelay: S,
        removeRelay: k
      }, a[l];
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
      let c = Ti(s);
      if (c in n)
        return;
      let l = $d(s, (h) => {
        o(h, c);
      });
      return n[c] = { relay: l, policy: f }, f.read && Object.values(a).forEach(
        (h) => h.addRelay(l)
      ), l;
    },
    removeRelay(s) {
      let f = Ti(s), c = n[f];
      if (!c)
        return;
      let { relay: l } = c;
      Object.values(a).forEach(
        (h) => h.removeRelay(l)
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
      if (s.id = ro(s), !s.sig)
        if (s.tags = s.tags || [], t)
          s.sig = await jd(s, t);
        else if (e)
          if (s.sig = await e(s), s.sig) {
            if (!await gu(s))
              throw new Error(
                "signature provided by custom signing function is invalid."
              );
          } else
            return;
        else
          throw new Error(
            "can't publish unsigned event. either sign this event beforehand, provide a signing function or pass a private key while initializing this relay pool so it can be signed automatically."
          );
      let c = Object.values(n).filter(({ policy: d }) => d.write).sort(() => Math.random() - 0.5), l = r.randomChoice ? r.randomChoice : c.length, h = 0;
      if (r.wait)
        for (let d = 0; d < c.length; d++) {
          let { relay: p } = c[d];
          try {
            if (await new Promise(async (y, g) => {
              try {
                await p.publish(s, (m) => {
                  f && f(m, p.url), y();
                });
              } catch {
                f && f(-1, p.url);
              }
            }), h++, h >= l)
              break;
          } catch {
          }
        }
      else
        c.forEach(async ({ relay: d }) => {
          let p = f ? (y) => f(y, d.url) : null;
          d.publish(s, p);
        });
      return s;
    }
  };
}
function Wd(t) {
  let e, r, n, i = t[1]?.pubkey + "", o, a, u, s, f, c, l, h, d, p, y;
  return {
    c() {
      e = W("form"), r = W("p"), n = ge("Logged in with pubkey: "), o = ge(i), a = ne(), u = W("label"), u.textContent = "Private Key", s = ne(), f = W("input"), c = ne(), l = W("button"), l.textContent = "Login", h = ne(), d = W("button"), d.textContent = "Generate", this.c = Z, A(u, "for", "privkey"), A(f, "id", "privkey"), A(f, "type", "text");
    },
    m(g, m) {
      ee(g, e, m), I(e, r), I(r, n), I(r, o), I(e, a), I(e, u), I(e, s), I(e, f), sn(f, t[0]), I(e, c), I(e, l), I(e, h), I(e, d), p || (y = [
        nt(f, "input", t[4]),
        nt(l, "click", t[2]),
        nt(d, "click", t[5]),
        nt(e, "submit", $a(t[3]))
      ], p = !0);
    },
    p(g, [m]) {
      m & 2 && i !== (i = g[1]?.pubkey + "") && at(o, i), m & 1 && f.value !== g[0] && sn(f, g[0]);
    },
    i: Z,
    o: Z,
    d(g) {
      g && ue(e), p = !1, _t(y);
    }
  };
}
function zd(t, e, r) {
  let n;
  Fa(t, Dt, (f) => r(1, n = f));
  let i = "";
  const o = () => {
    !i || mu(Dt, n = { privkey: i, pubkey: Uf(i) }, n);
  };
  function a(f) {
    Au.call(this, t, f);
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
    () => r(0, i = $f())
  ];
}
class Vd extends Ot {
  constructor(e) {
    super(), Wt(
      this,
      {
        target: this.shadowRoot,
        props: Ut(this.attributes),
        customElement: !0
      },
      zd,
      Wd,
      Ct,
      {},
      null
    ), e && e.target && ee(e.target, this, e.anchor);
  }
}
customElements.define("nostr-opinion-login", Vd);
class Gd {
  trustedAuthors;
  onlyTrusted = !1;
  nostr;
  onReady;
  onReadyResolve;
  constructor() {
    this.nostr = Ud(), Dt.subscribe((e) => {
      this.nostr.setPrivateKey(e?.privkey);
    }), this.onReady = new Promise((e) => {
      this.onReadyResolve = e;
    });
  }
  setRelay(e = "wss://relay.nostr.info") {
    this.nostr.addRelay(e, { read: !0, write: !0 });
  }
  setReady() {
    this.onReadyResolve();
  }
}
const Yd = new Gd(), Zd = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  expertOpinions: Yd
}, Symbol.toStringTag, { value: "Module" }));
export {
  Yd as expertOpinions
};
