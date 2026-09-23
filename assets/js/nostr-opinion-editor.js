import { A as e, C as t, D as n, E as r, O as i, S as a, T as o, _ as s, a as c, b as l, c as u, d, f, g as p, h as m, i as h, k as g, l as _, m as v, n as y, o as b, p as x, r as S, s as ee, t as te, u as ne, v as re, w as C, x as ie, y as ae } from "./nostr-opinion.js";
//#region node_modules/orderedmap/dist/index.js
function w(e) {
	this.content = e;
}
w.prototype = {
	constructor: w,
	find: function(e) {
		for (var t = 0; t < this.content.length; t += 2) if (this.content[t] === e) return t;
		return -1;
	},
	get: function(e) {
		var t = this.find(e);
		return t == -1 ? void 0 : this.content[t + 1];
	},
	update: function(e, t, n) {
		var r = n && n != e ? this.remove(n) : this, i = r.find(e), a = r.content.slice();
		return i == -1 ? a.push(n || e, t) : (a[i + 1] = t, n && (a[i] = n)), new w(a);
	},
	remove: function(e) {
		var t = this.find(e);
		if (t == -1) return this;
		var n = this.content.slice();
		return n.splice(t, 2), new w(n);
	},
	addToStart: function(e, t) {
		return new w([e, t].concat(this.remove(e).content));
	},
	addToEnd: function(e, t) {
		var n = this.remove(e).content.slice();
		return n.push(e, t), new w(n);
	},
	addBefore: function(e, t, n) {
		var r = this.remove(t), i = r.content.slice(), a = r.find(e);
		return i.splice(a == -1 ? i.length : a, 0, t, n), new w(i);
	},
	forEach: function(e) {
		for (var t = 0; t < this.content.length; t += 2) e(this.content[t], this.content[t + 1]);
	},
	prepend: function(e) {
		return e = w.from(e), e.size ? new w(e.content.concat(this.subtract(e).content)) : this;
	},
	append: function(e) {
		return e = w.from(e), e.size ? new w(this.subtract(e).content.concat(e.content)) : this;
	},
	subtract: function(e) {
		var t = this;
		e = w.from(e);
		for (var n = 0; n < e.content.length; n += 2) t = t.remove(e.content[n]);
		return t;
	},
	toObject: function() {
		var e = {};
		return this.forEach(function(t, n) {
			e[t] = n;
		}), e;
	},
	get size() {
		return this.content.length >> 1;
	}
}, w.from = function(e) {
	if (e instanceof w) return e;
	var t = [];
	if (e) for (var n in e) t.push(n, e[n]);
	return new w(t);
};
//#endregion
//#region node_modules/prosemirror-model/dist/index.js
function oe(e, t, n) {
	for (let r = 0;; r++) {
		if (r == e.childCount || r == t.childCount) return e.childCount == t.childCount ? null : n;
		let i = e.child(r), a = t.child(r);
		if (i == a) {
			n += i.nodeSize;
			continue;
		}
		if (!i.sameMarkup(a)) return n;
		if (i.isText && i.text != a.text) {
			for (let e = 0; i.text[e] == a.text[e]; e++) n++;
			return n;
		}
		if (i.content.size || a.content.size) {
			let e = oe(i.content, a.content, n + 1);
			if (e != null) return e;
		}
		n += i.nodeSize;
	}
}
function se(e, t, n, r) {
	for (let i = e.childCount, a = t.childCount;;) {
		if (i == 0 || a == 0) return i == a ? null : {
			a: n,
			b: r
		};
		let o = e.child(--i), s = t.child(--a), c = o.nodeSize;
		if (o == s) {
			n -= c, r -= c;
			continue;
		}
		if (!o.sameMarkup(s)) return {
			a: n,
			b: r
		};
		if (o.isText && o.text != s.text) {
			let e = 0, t = Math.min(o.text.length, s.text.length);
			for (; e < t && o.text[o.text.length - e - 1] == s.text[s.text.length - e - 1];) e++, n--, r--;
			return {
				a: n,
				b: r
			};
		}
		if (o.content.size || s.content.size) {
			let e = se(o.content, s.content, n - 1, r - 1);
			if (e) return e;
		}
		n -= c, r -= c;
	}
}
var T = class e {
	constructor(e, t) {
		if (this.content = e, this.size = t || 0, t == null) for (let t = 0; t < e.length; t++) this.size += e[t].nodeSize;
	}
	nodesBetween(e, t, n, r = 0, i) {
		for (let a = 0, o = 0; o < t; a++) {
			let s = this.content[a], c = o + s.nodeSize;
			if (c > e && n(s, r + o, i || null, a) !== !1 && s.content.size) {
				let i = o + 1;
				s.nodesBetween(Math.max(0, e - i), Math.min(s.content.size, t - i), n, r + i);
			}
			o = c;
		}
	}
	descendants(e) {
		this.nodesBetween(0, this.size, e);
	}
	textBetween(e, t, n, r) {
		let i = "", a = !0;
		return this.nodesBetween(e, t, (o, s) => {
			let c = o.isText ? o.text.slice(Math.max(e, s) - s, t - s) : o.isLeaf ? r ? typeof r == "function" ? r(o) : r : o.type.spec.leafText ? o.type.spec.leafText(o) : "" : "";
			o.isBlock && (o.isLeaf && c || o.isTextblock) && n && (a ? a = !1 : i += n), i += c;
		}, 0), i;
	}
	append(t) {
		if (!t.size) return this;
		if (!this.size) return t;
		let n = this.lastChild, r = t.firstChild, i = this.content.slice(), a = 0;
		for (n.isText && n.sameMarkup(r) && (i[i.length - 1] = n.withText(n.text + r.text), a = 1); a < t.content.length; a++) i.push(t.content[a]);
		return new e(i, this.size + t.size);
	}
	cut(t, n = this.size) {
		if (t == 0 && n == this.size) return this;
		let r = [], i = 0;
		if (n > t) for (let e = 0, a = 0; a < n; e++) {
			let o = this.content[e], s = a + o.nodeSize;
			s > t && ((a < t || s > n) && (o = o.isText ? o.cut(Math.max(0, t - a), Math.min(o.text.length, n - a)) : o.cut(Math.max(0, t - a - 1), Math.min(o.content.size, n - a - 1))), r.push(o), i += o.nodeSize), a = s;
		}
		return new e(r, i);
	}
	cutByIndex(t, n) {
		return t == n ? e.empty : t == 0 && n == this.content.length ? this : new e(this.content.slice(t, n));
	}
	replaceChild(t, n) {
		let r = this.content[t];
		if (r == n) return this;
		let i = this.content.slice(), a = this.size + n.nodeSize - r.nodeSize;
		return i[t] = n, new e(i, a);
	}
	addToStart(t) {
		return new e([t].concat(this.content), this.size + t.nodeSize);
	}
	addToEnd(t) {
		return new e(this.content.concat(t), this.size + t.nodeSize);
	}
	eq(e) {
		if (this.content.length != e.content.length) return !1;
		for (let t = 0; t < this.content.length; t++) if (!this.content[t].eq(e.content[t])) return !1;
		return !0;
	}
	get firstChild() {
		return this.content.length ? this.content[0] : null;
	}
	get lastChild() {
		return this.content.length ? this.content[this.content.length - 1] : null;
	}
	get childCount() {
		return this.content.length;
	}
	child(e) {
		let t = this.content[e];
		if (!t) throw RangeError("Index " + e + " out of range for " + this);
		return t;
	}
	maybeChild(e) {
		return this.content[e] || null;
	}
	forEach(e) {
		for (let t = 0, n = 0; t < this.content.length; t++) {
			let r = this.content[t];
			e(r, n, t), n += r.nodeSize;
		}
	}
	findDiffStart(e, t = 0) {
		return oe(this, e, t);
	}
	findDiffEnd(e, t = this.size, n = e.size) {
		return se(this, e, t, n);
	}
	findIndex(e) {
		if (e == 0) return le(0, e);
		if (e == this.size) return le(this.content.length, e);
		if (e > this.size || e < 0) throw RangeError(`Position ${e} outside of fragment (${this})`);
		for (let t = 0, n = 0;; t++) {
			let r = this.child(t), i = n + r.nodeSize;
			if (i >= e) return i == e ? le(t + 1, i) : le(t, n);
			n = i;
		}
	}
	toString() {
		return "<" + this.toStringInner() + ">";
	}
	toStringInner() {
		return this.content.join(", ");
	}
	toJSON() {
		return this.content.length ? this.content.map((e) => e.toJSON()) : null;
	}
	static fromJSON(t, n) {
		if (!n) return e.empty;
		if (!Array.isArray(n)) throw RangeError("Invalid input for Fragment.fromJSON");
		return new e(n.map(t.nodeFromJSON));
	}
	static fromArray(t) {
		if (!t.length) return e.empty;
		let n, r = 0;
		for (let e = 0; e < t.length; e++) {
			let i = t[e];
			r += i.nodeSize, e && i.isText && t[e - 1].sameMarkup(i) ? (n || (n = t.slice(0, e)), n[n.length - 1] = i.withText(n[n.length - 1].text + i.text)) : n && n.push(i);
		}
		return new e(n || t, r);
	}
	static from(t) {
		if (!t) return e.empty;
		if (t instanceof e) return t;
		if (Array.isArray(t)) return this.fromArray(t);
		if (t.attrs) return new e([t], t.nodeSize);
		throw RangeError("Can not convert " + t + " to a Fragment" + (t.nodesBetween ? " (looks like multiple versions of prosemirror-model were loaded)" : ""));
	}
};
T.empty = new T([], 0);
var ce = {
	index: 0,
	offset: 0
};
function le(e, t) {
	return ce.index = e, ce.offset = t, ce;
}
function ue(e, t) {
	if (e === t) return !0;
	if (!(e && typeof e == "object") || !(t && typeof t == "object")) return !1;
	let n = Array.isArray(e);
	if (Array.isArray(t) != n) return !1;
	if (n) {
		if (e.length != t.length) return !1;
		for (let n = 0; n < e.length; n++) if (!ue(e[n], t[n])) return !1;
	} else {
		for (let n in e) if (!(n in t) || !ue(e[n], t[n])) return !1;
		for (let n in t) if (!(n in e)) return !1;
	}
	return !0;
}
var E = class e {
	constructor(e, t) {
		this.type = e, this.attrs = t;
	}
	addToSet(e) {
		let t, n = !1;
		for (let r = 0; r < e.length; r++) {
			let i = e[r];
			if (this.eq(i)) return e;
			if (this.type.excludes(i.type)) t || (t = e.slice(0, r));
			else if (i.type.excludes(this.type)) return e;
			else !n && i.type.rank > this.type.rank && (t || (t = e.slice(0, r)), t.push(this), n = !0), t && t.push(i);
		}
		return t || (t = e.slice()), n || t.push(this), t;
	}
	removeFromSet(e) {
		for (let t = 0; t < e.length; t++) if (this.eq(e[t])) return e.slice(0, t).concat(e.slice(t + 1));
		return e;
	}
	isInSet(e) {
		for (let t = 0; t < e.length; t++) if (this.eq(e[t])) return !0;
		return !1;
	}
	eq(e) {
		return this == e || this.type == e.type && ue(this.attrs, e.attrs);
	}
	toJSON() {
		let e = { type: this.type.name };
		for (let t in this.attrs) {
			e.attrs = this.attrs;
			break;
		}
		return e;
	}
	static fromJSON(e, t) {
		if (!t) throw RangeError("Invalid input for Mark.fromJSON");
		let n = e.marks[t.type];
		if (!n) throw RangeError(`There is no mark type ${t.type} in this schema`);
		let r = n.create(t.attrs);
		return n.checkAttrs(r.attrs), r;
	}
	static sameSet(e, t) {
		if (e == t) return !0;
		if (e.length != t.length) return !1;
		for (let n = 0; n < e.length; n++) if (!e[n].eq(t[n])) return !1;
		return !0;
	}
	static setFrom(t) {
		if (!t || Array.isArray(t) && t.length == 0) return e.none;
		if (t instanceof e) return [t];
		let n = t.slice();
		return n.sort((e, t) => e.type.rank - t.type.rank), n;
	}
};
E.none = [];
var de = class extends Error {}, D = class e {
	constructor(e, t, n) {
		this.content = e, this.openStart = t, this.openEnd = n;
	}
	get size() {
		return this.content.size - this.openStart - this.openEnd;
	}
	insertAt(t, n) {
		let r = O(this.content, t + this.openStart, n);
		return r && new e(r, this.openStart, this.openEnd);
	}
	removeBetween(t, n) {
		return new e(fe(this.content, t + this.openStart, n + this.openStart), this.openStart, this.openEnd);
	}
	eq(e) {
		return this.content.eq(e.content) && this.openStart == e.openStart && this.openEnd == e.openEnd;
	}
	toString() {
		return this.content + "(" + this.openStart + "," + this.openEnd + ")";
	}
	toJSON() {
		if (!this.content.size) return null;
		let e = { content: this.content.toJSON() };
		return this.openStart > 0 && (e.openStart = this.openStart), this.openEnd > 0 && (e.openEnd = this.openEnd), e;
	}
	static fromJSON(t, n) {
		if (!n) return e.empty;
		let r = n.openStart || 0, i = n.openEnd || 0;
		if (typeof r != "number" || typeof i != "number") throw RangeError("Invalid input for Slice.fromJSON");
		return new e(T.fromJSON(t, n.content), r, i);
	}
	static maxOpen(t, n = !0) {
		let r = 0, i = 0;
		for (let e = t.firstChild; e && !e.isLeaf && (n || !e.type.spec.isolating); e = e.firstChild) r++;
		for (let e = t.lastChild; e && !e.isLeaf && (n || !e.type.spec.isolating); e = e.lastChild) i++;
		return new e(t, r, i);
	}
};
D.empty = new D(T.empty, 0, 0);
function fe(e, t, n) {
	let { index: r, offset: i } = e.findIndex(t), a = e.maybeChild(r), { index: o, offset: s } = e.findIndex(n);
	if (i == t || a.isText) {
		if (s != n && !e.child(o).isText) throw RangeError("Removing non-flat range");
		return e.cut(0, t).append(e.cut(n));
	}
	if (r != o) throw RangeError("Removing non-flat range");
	return e.replaceChild(r, a.copy(fe(a.content, t - i - 1, n - i - 1)));
}
function O(e, t, n, r) {
	let { index: i, offset: a } = e.findIndex(t), o = e.maybeChild(i);
	if (a == t || o.isText) return r && !r.canReplace(i, i, n) ? null : e.cut(0, t).append(n).append(e.cut(t));
	let s = O(o.content, t - a - 1, n, o);
	return s && e.replaceChild(i, o.copy(s));
}
function pe(e, t, n) {
	if (n.openStart > e.depth) throw new de("Inserted content deeper than insertion position");
	if (e.depth - n.openStart != t.depth - n.openEnd) throw new de("Inconsistent open depths");
	return me(e, t, n, 0);
}
function me(e, t, n, r) {
	let i = e.index(r), a = e.node(r);
	if (i == t.index(r) && r < e.depth - n.openStart) {
		let o = me(e, t, n, r + 1);
		return a.copy(a.content.replaceChild(i, o));
	}
	if (!n.content.size) return ye(a, xe(e, t, r));
	if (!n.openStart && !n.openEnd && e.depth == r && t.depth == r) {
		let r = e.parent, i = r.content;
		return ye(r, i.cut(0, e.parentOffset).append(n.content).append(i.cut(t.parentOffset)));
	}
	{
		let { start: i, end: o } = Se(n, e);
		return ye(a, be(e, i, o, t, r));
	}
}
function he(e, t) {
	if (!t.type.compatibleContent(e.type)) throw new de("Cannot join " + t.type.name + " onto " + e.type.name);
}
function ge(e, t, n) {
	let r = e.node(n);
	return he(r, t.node(n)), r;
}
function _e(e, t) {
	let n = t.length - 1;
	n >= 0 && e.isText && e.sameMarkup(t[n]) ? t[n] = e.withText(t[n].text + e.text) : t.push(e);
}
function ve(e, t, n, r) {
	let i = (t || e).node(n), a = 0, o = t ? t.index(n) : i.childCount;
	e && (a = e.index(n), e.depth > n ? a++ : e.textOffset && (_e(e.nodeAfter, r), a++));
	for (let e = a; e < o; e++) _e(i.child(e), r);
	t && t.depth == n && t.textOffset && _e(t.nodeBefore, r);
}
function ye(e, t) {
	return e.type.checkContent(t), e.copy(t);
}
function be(e, t, n, r, i) {
	let a = e.depth > i && ge(e, t, i + 1), o = r.depth > i && ge(n, r, i + 1), s = [];
	return ve(null, e, i, s), a && o && t.index(i) == n.index(i) ? (he(a, o), _e(ye(a, be(e, t, n, r, i + 1)), s)) : (a && _e(ye(a, xe(e, t, i + 1)), s), ve(t, n, i, s), o && _e(ye(o, xe(n, r, i + 1)), s)), ve(r, null, i, s), new T(s);
}
function xe(e, t, n) {
	let r = [];
	return ve(null, e, n, r), e.depth > n && _e(ye(ge(e, t, n + 1), xe(e, t, n + 1)), r), ve(t, null, n, r), new T(r);
}
function Se(e, t) {
	let n = t.depth - e.openStart, r = t.node(n).copy(e.content);
	for (let e = n - 1; e >= 0; e--) r = t.node(e).copy(T.from(r));
	return {
		start: r.resolveNoCache(e.openStart + n),
		end: r.resolveNoCache(r.content.size - e.openEnd - n)
	};
}
var Ce = class e {
	constructor(e, t, n) {
		this.pos = e, this.path = t, this.parentOffset = n, this.depth = t.length / 3 - 1;
	}
	resolveDepth(e) {
		return e == null ? this.depth : e < 0 ? this.depth + e : e;
	}
	get parent() {
		return this.node(this.depth);
	}
	get doc() {
		return this.node(0);
	}
	node(e) {
		return this.path[this.resolveDepth(e) * 3];
	}
	index(e) {
		return this.path[this.resolveDepth(e) * 3 + 1];
	}
	indexAfter(e) {
		return e = this.resolveDepth(e), this.index(e) + (e == this.depth && !this.textOffset ? 0 : 1);
	}
	start(e) {
		return e = this.resolveDepth(e), e == 0 ? 0 : this.path[e * 3 - 1] + 1;
	}
	end(e) {
		return e = this.resolveDepth(e), this.start(e) + this.node(e).content.size;
	}
	before(e) {
		if (e = this.resolveDepth(e), !e) throw RangeError("There is no position before the top-level node");
		return e == this.depth + 1 ? this.pos : this.path[e * 3 - 1];
	}
	after(e) {
		if (e = this.resolveDepth(e), !e) throw RangeError("There is no position after the top-level node");
		return e == this.depth + 1 ? this.pos : this.path[e * 3 - 1] + this.path[e * 3].nodeSize;
	}
	get textOffset() {
		return this.pos - this.path[this.path.length - 1];
	}
	get nodeAfter() {
		let e = this.parent, t = this.index(this.depth);
		if (t == e.childCount) return null;
		let n = this.pos - this.path[this.path.length - 1], r = e.child(t);
		return n ? e.child(t).cut(n) : r;
	}
	get nodeBefore() {
		let e = this.index(this.depth), t = this.pos - this.path[this.path.length - 1];
		return t ? this.parent.child(e).cut(0, t) : e == 0 ? null : this.parent.child(e - 1);
	}
	posAtIndex(e, t) {
		t = this.resolveDepth(t);
		let n = this.path[t * 3], r = t == 0 ? 0 : this.path[t * 3 - 1] + 1;
		for (let t = 0; t < e; t++) r += n.child(t).nodeSize;
		return r;
	}
	marks() {
		let e = this.parent, t = this.index();
		if (e.content.size == 0) return E.none;
		if (this.textOffset) return e.child(t).marks;
		let n = e.maybeChild(t - 1), r = e.maybeChild(t);
		if (!n) {
			let e = n;
			n = r, r = e;
		}
		let i = n.marks;
		for (var a = 0; a < i.length; a++) i[a].type.spec.inclusive === !1 && (!r || !i[a].isInSet(r.marks)) && (i = i[a--].removeFromSet(i));
		return i;
	}
	marksAcross(e) {
		let t = this.parent.maybeChild(this.index());
		if (!t || !t.isInline) return null;
		let n = t.marks, r = e.parent.maybeChild(e.index());
		for (var i = 0; i < n.length; i++) n[i].type.spec.inclusive === !1 && (!r || !n[i].isInSet(r.marks)) && (n = n[i--].removeFromSet(n));
		return n;
	}
	sharedDepth(e) {
		for (let t = this.depth; t > 0; t--) if (this.start(t) <= e && this.end(t) >= e) return t;
		return 0;
	}
	blockRange(e = this, t) {
		if (e.pos < this.pos) return e.blockRange(this);
		for (let n = this.depth - (this.parent.inlineContent || this.pos == e.pos ? 1 : 0); n >= 0; n--) if (e.pos <= this.end(n) && (!t || t(this.node(n)))) return new De(this, e, n);
		return null;
	}
	sameParent(e) {
		return this.pos - this.parentOffset == e.pos - e.parentOffset;
	}
	max(e) {
		return e.pos > this.pos ? e : this;
	}
	min(e) {
		return e.pos < this.pos ? e : this;
	}
	toString() {
		let e = "";
		for (let t = 1; t <= this.depth; t++) e += (e ? "/" : "") + this.node(t).type.name + "_" + this.index(t - 1);
		return e + ":" + this.parentOffset;
	}
	static resolve(t, n) {
		if (!(n >= 0 && n <= t.content.size)) throw RangeError("Position " + n + " out of range");
		let r = [], i = 0, a = n;
		for (let e = t;;) {
			let { index: t, offset: n } = e.content.findIndex(a), o = a - n;
			if (r.push(e, t, i + n), !o || (e = e.child(t), e.isText)) break;
			a = o - 1, i += n + 1;
		}
		return new e(n, r, a);
	}
	static resolveCached(t, n) {
		let r = Ee.get(t);
		if (r) for (let e = 0; e < r.elts.length; e++) {
			let t = r.elts[e];
			if (t.pos == n) return t;
		}
		else Ee.set(t, r = new we());
		let i = r.elts[r.i] = e.resolve(t, n);
		return r.i = (r.i + 1) % Te, i;
	}
}, we = class {
	constructor() {
		this.elts = [], this.i = 0;
	}
}, Te = 12, Ee = /* @__PURE__ */ new WeakMap(), De = class {
	constructor(e, t, n) {
		this.$from = e, this.$to = t, this.depth = n;
	}
	get start() {
		return this.$from.before(this.depth + 1);
	}
	get end() {
		return this.$to.after(this.depth + 1);
	}
	get parent() {
		return this.$from.node(this.depth);
	}
	get startIndex() {
		return this.$from.index(this.depth);
	}
	get endIndex() {
		return this.$to.indexAfter(this.depth);
	}
}, Oe = Object.create(null), ke = class e {
	constructor(e, t, n, r = E.none) {
		this.type = e, this.attrs = t, this.marks = r, this.content = n || T.empty;
	}
	get children() {
		return this.content.content;
	}
	get nodeSize() {
		return this.isLeaf ? 1 : 2 + this.content.size;
	}
	get childCount() {
		return this.content.childCount;
	}
	child(e) {
		return this.content.child(e);
	}
	maybeChild(e) {
		return this.content.maybeChild(e);
	}
	forEach(e) {
		this.content.forEach(e);
	}
	nodesBetween(e, t, n, r = 0) {
		this.content.nodesBetween(e, t, n, r, this);
	}
	descendants(e) {
		this.nodesBetween(0, this.content.size, e);
	}
	get textContent() {
		return this.isLeaf && this.type.spec.leafText ? this.type.spec.leafText(this) : this.textBetween(0, this.content.size, "");
	}
	textBetween(e, t, n, r) {
		return this.content.textBetween(e, t, n, r);
	}
	get firstChild() {
		return this.content.firstChild;
	}
	get lastChild() {
		return this.content.lastChild;
	}
	eq(e) {
		return this == e || this.sameMarkup(e) && this.content.eq(e.content);
	}
	sameMarkup(e) {
		return this.hasMarkup(e.type, e.attrs, e.marks);
	}
	hasMarkup(e, t, n) {
		return this.type == e && ue(this.attrs, t || e.defaultAttrs || Oe) && E.sameSet(this.marks, n || E.none);
	}
	copy(t = null) {
		return t == this.content ? this : new e(this.type, this.attrs, t, this.marks);
	}
	mark(t) {
		return t == this.marks ? this : new e(this.type, this.attrs, this.content, t);
	}
	cut(e, t = this.content.size) {
		return e == 0 && t == this.content.size ? this : this.copy(this.content.cut(e, t));
	}
	slice(e, t = this.content.size, n = !1) {
		if (e == t) return D.empty;
		let r = this.resolve(e), i = this.resolve(t), a = n ? 0 : r.sharedDepth(t), o = r.start(a);
		return new D(r.node(a).content.cut(r.pos - o, i.pos - o), r.depth - a, i.depth - a);
	}
	replace(e, t, n) {
		return pe(this.resolve(e), this.resolve(t), n);
	}
	nodeAt(e) {
		for (let t = this;;) {
			let { index: n, offset: r } = t.content.findIndex(e);
			if (t = t.maybeChild(n), !t) return null;
			if (r == e || t.isText) return t;
			e -= r + 1;
		}
	}
	childAfter(e) {
		let { index: t, offset: n } = this.content.findIndex(e);
		return {
			node: this.content.maybeChild(t),
			index: t,
			offset: n
		};
	}
	childBefore(e) {
		if (e == 0) return {
			node: null,
			index: 0,
			offset: 0
		};
		let { index: t, offset: n } = this.content.findIndex(e);
		if (n < e) return {
			node: this.content.child(t),
			index: t,
			offset: n
		};
		let r = this.content.child(t - 1);
		return {
			node: r,
			index: t - 1,
			offset: n - r.nodeSize
		};
	}
	resolve(e) {
		return Ce.resolveCached(this, e);
	}
	resolveNoCache(e) {
		return Ce.resolve(this, e);
	}
	rangeHasMark(e, t, n) {
		let r = !1;
		return t > e && this.nodesBetween(e, t, (e) => (n.isInSet(e.marks) && (r = !0), !r)), r;
	}
	get isBlock() {
		return this.type.isBlock;
	}
	get isTextblock() {
		return this.type.isTextblock;
	}
	get inlineContent() {
		return this.type.inlineContent;
	}
	get isInline() {
		return this.type.isInline;
	}
	get isText() {
		return this.type.isText;
	}
	get isLeaf() {
		return this.type.isLeaf;
	}
	get isAtom() {
		return this.type.isAtom;
	}
	toString() {
		if (this.type.spec.toDebugString) return this.type.spec.toDebugString(this);
		let e = this.type.name;
		return this.content.size && (e += "(" + this.content.toStringInner() + ")"), je(this.marks, e);
	}
	contentMatchAt(e) {
		let t = this.type.contentMatch.matchFragment(this.content, 0, e);
		if (!t) throw Error("Called contentMatchAt on a node with invalid content");
		return t;
	}
	canReplace(e, t, n = T.empty, r = 0, i = n.childCount) {
		let a = this.contentMatchAt(e).matchFragment(n, r, i), o = a && a.matchFragment(this.content, t);
		if (!o || !o.validEnd) return !1;
		for (let e = r; e < i; e++) if (!this.type.allowsMarks(n.child(e).marks)) return !1;
		return !0;
	}
	canReplaceWith(e, t, n, r) {
		if (r && !this.type.allowsMarks(r)) return !1;
		let i = this.contentMatchAt(e).matchType(n), a = i && i.matchFragment(this.content, t);
		return a ? a.validEnd : !1;
	}
	canAppend(e) {
		return e.content.size ? this.canReplace(this.childCount, this.childCount, e.content) : this.type.compatibleContent(e.type);
	}
	check() {
		this.type.checkContent(this.content), this.type.checkAttrs(this.attrs);
		let e = E.none;
		for (let t = 0; t < this.marks.length; t++) {
			let n = this.marks[t];
			n.type.checkAttrs(n.attrs), e = n.addToSet(e);
		}
		if (!E.sameSet(e, this.marks)) throw RangeError(`Invalid collection of marks for node ${this.type.name}: ${this.marks.map((e) => e.type.name)}`);
		this.content.forEach((e) => e.check());
	}
	toJSON() {
		let e = { type: this.type.name };
		for (let t in this.attrs) {
			e.attrs = this.attrs;
			break;
		}
		return this.content.size && (e.content = this.content.toJSON()), this.marks.length && (e.marks = this.marks.map((e) => e.toJSON())), e;
	}
	static fromJSON(e, t) {
		if (!t) throw RangeError("Invalid input for Node.fromJSON");
		let n;
		if (t.marks) {
			if (!Array.isArray(t.marks)) throw RangeError("Invalid mark data for Node.fromJSON");
			n = t.marks.map(e.markFromJSON);
		}
		if (t.type == "text") {
			if (typeof t.text != "string") throw RangeError("Invalid text node in JSON");
			return e.text(t.text, n);
		}
		let r = T.fromJSON(e, t.content), i = e.nodeType(t.type).create(t.attrs, r, n);
		return i.type.checkAttrs(i.attrs), i;
	}
};
ke.prototype.text = void 0;
var Ae = class e extends ke {
	constructor(e, t, n, r) {
		if (super(e, t, null, r), !n) throw RangeError("Empty text nodes are not allowed");
		this.text = n;
	}
	toString() {
		return this.type.spec.toDebugString ? this.type.spec.toDebugString(this) : je(this.marks, JSON.stringify(this.text));
	}
	get textContent() {
		return this.text;
	}
	textBetween(e, t) {
		return this.text.slice(e, t);
	}
	get nodeSize() {
		return this.text.length;
	}
	mark(t) {
		return t == this.marks ? this : new e(this.type, this.attrs, this.text, t);
	}
	withText(t) {
		return t == this.text ? this : new e(this.type, this.attrs, t, this.marks);
	}
	cut(e = 0, t = this.text.length) {
		return e == 0 && t == this.text.length ? this : this.withText(this.text.slice(e, t));
	}
	eq(e) {
		return this.sameMarkup(e) && this.text == e.text;
	}
	toJSON() {
		let e = super.toJSON();
		return e.text = this.text, e;
	}
};
function je(e, t) {
	for (let n = e.length - 1; n >= 0; n--) t = e[n].type.name + "(" + t + ")";
	return t;
}
var Me = class e {
	constructor(e) {
		this.validEnd = e, this.next = [], this.wrapCache = [];
	}
	static parse(t, n) {
		let r = new Ne(t, n);
		if (r.next == null) return e.empty;
		let i = Pe(r);
		r.next && r.err("Unexpected trailing text");
		let a = We(Ve(i));
		return Ge(a, r), a;
	}
	matchType(e) {
		for (let t = 0; t < this.next.length; t++) if (this.next[t].type == e) return this.next[t].next;
		return null;
	}
	matchFragment(e, t = 0, n = e.childCount) {
		let r = this;
		for (let i = t; r && i < n; i++) r = r.matchType(e.child(i).type);
		return r;
	}
	get inlineContent() {
		return this.next.length != 0 && this.next[0].type.isInline;
	}
	get defaultType() {
		for (let e = 0; e < this.next.length; e++) {
			let { type: t } = this.next[e];
			if (!(t.isText || t.hasRequiredAttrs())) return t;
		}
		return null;
	}
	compatible(e) {
		for (let t = 0; t < this.next.length; t++) for (let n = 0; n < e.next.length; n++) if (this.next[t].type == e.next[n].type) return !0;
		return !1;
	}
	fillBefore(e, t = !1, n = 0) {
		let r = [this];
		function i(a, o) {
			let s = a.matchFragment(e, n);
			if (s && (!t || s.validEnd)) return T.from(o.map((e) => e.createAndFill()));
			for (let e = 0; e < a.next.length; e++) {
				let { type: t, next: n } = a.next[e];
				if (!(t.isText || t.hasRequiredAttrs()) && r.indexOf(n) == -1) {
					r.push(n);
					let e = i(n, o.concat(t));
					if (e) return e;
				}
			}
			return null;
		}
		return i(this, []);
	}
	findWrapping(e) {
		for (let t = 0; t < this.wrapCache.length; t += 2) if (this.wrapCache[t] == e) return this.wrapCache[t + 1];
		let t = this.computeWrapping(e);
		return this.wrapCache.push(e, t), t;
	}
	computeWrapping(e) {
		let t = Object.create(null), n = [{
			match: this,
			type: null,
			via: null
		}];
		for (; n.length;) {
			let r = n.shift(), i = r.match;
			if (i.matchType(e)) {
				let e = [];
				for (let t = r; t.type; t = t.via) e.push(t.type);
				return e.reverse();
			}
			for (let e = 0; e < i.next.length; e++) {
				let { type: a, next: o } = i.next[e];
				!a.isLeaf && !a.hasRequiredAttrs() && !(a.name in t) && (!r.type || o.validEnd) && (n.push({
					match: a.contentMatch,
					type: a,
					via: r
				}), t[a.name] = !0);
			}
		}
		return null;
	}
	get edgeCount() {
		return this.next.length;
	}
	edge(e) {
		if (e >= this.next.length) throw RangeError(`There's no ${e}th edge in this content match`);
		return this.next[e];
	}
	toString() {
		let e = [];
		function t(n) {
			e.push(n);
			for (let r = 0; r < n.next.length; r++) e.indexOf(n.next[r].next) == -1 && t(n.next[r].next);
		}
		return t(this), e.map((t, n) => {
			let r = n + (t.validEnd ? "*" : " ") + " ";
			for (let n = 0; n < t.next.length; n++) r += (n ? ", " : "") + t.next[n].type.name + "->" + e.indexOf(t.next[n].next);
			return r;
		}).join("\n");
	}
};
Me.empty = new Me(!0);
var Ne = class {
	constructor(e, t) {
		this.string = e, this.nodeTypes = t, this.inline = null, this.pos = 0, this.tokens = e.split(/\s*(?=\b|\W|$)/), this.tokens[this.tokens.length - 1] == "" && this.tokens.pop(), this.tokens[0] == "" && this.tokens.shift();
	}
	get next() {
		return this.tokens[this.pos];
	}
	eat(e) {
		return this.next == e && (this.pos++ || !0);
	}
	err(e) {
		throw SyntaxError(e + " (in content expression '" + this.string + "')");
	}
};
function Pe(e) {
	let t = [];
	do
		t.push(Fe(e));
	while (e.eat("|"));
	return t.length == 1 ? t[0] : {
		type: "choice",
		exprs: t
	};
}
function Fe(e) {
	let t = [];
	do
		t.push(Ie(e));
	while (e.next && e.next != ")" && e.next != "|");
	return t.length == 1 ? t[0] : {
		type: "seq",
		exprs: t
	};
}
function Ie(e) {
	let t = Be(e);
	for (;;) if (e.eat("+")) t = {
		type: "plus",
		expr: t
	};
	else if (e.eat("*")) t = {
		type: "star",
		expr: t
	};
	else if (e.eat("?")) t = {
		type: "opt",
		expr: t
	};
	else if (e.eat("{")) t = Re(e, t);
	else break;
	return t;
}
function Le(e) {
	/\D/.test(e.next) && e.err("Expected number, got '" + e.next + "'");
	let t = Number(e.next);
	return e.pos++, t;
}
function Re(e, t) {
	let n = Le(e), r = n;
	return e.eat(",") && (r = e.next == "}" ? -1 : Le(e)), e.eat("}") || e.err("Unclosed braced range"), {
		type: "range",
		min: n,
		max: r,
		expr: t
	};
}
function ze(e, t) {
	let n = e.nodeTypes, r = n[t];
	if (r) return [r];
	let i = [];
	for (let e in n) {
		let r = n[e];
		r.isInGroup(t) && i.push(r);
	}
	return i.length == 0 && e.err("No node type or group '" + t + "' found"), i;
}
function Be(e) {
	if (e.eat("(")) {
		let t = Pe(e);
		return e.eat(")") || e.err("Missing closing paren"), t;
	}
	if (/\W/.test(e.next)) e.err("Unexpected token '" + e.next + "'");
	else {
		let t = ze(e, e.next).map((t) => (e.inline == null ? e.inline = t.isInline : e.inline != t.isInline && e.err("Mixing inline and block content"), {
			type: "name",
			value: t
		}));
		return e.pos++, t.length == 1 ? t[0] : {
			type: "choice",
			exprs: t
		};
	}
}
function Ve(e) {
	let t = [[]];
	return i(a(e, 0), n()), t;
	function n() {
		return t.push([]) - 1;
	}
	function r(e, n, r) {
		let i = {
			term: r,
			to: n
		};
		return t[e].push(i), i;
	}
	function i(e, t) {
		e.forEach((e) => e.to = t);
	}
	function a(e, t) {
		if (e.type == "choice") return e.exprs.reduce((e, n) => e.concat(a(n, t)), []);
		if (e.type == "seq") for (let r = 0;; r++) {
			let o = a(e.exprs[r], t);
			if (r == e.exprs.length - 1) return o;
			i(o, t = n());
		}
		else if (e.type == "star") {
			let o = n();
			return r(t, o), i(a(e.expr, o), o), [r(o)];
		} else if (e.type == "plus") {
			let o = n();
			return i(a(e.expr, t), o), i(a(e.expr, o), o), [r(o)];
		} else if (e.type == "opt") return [r(t)].concat(a(e.expr, t));
		else if (e.type == "range") {
			let o = t;
			for (let t = 0; t < e.min; t++) {
				let t = n();
				i(a(e.expr, o), t), o = t;
			}
			if (e.max == -1) i(a(e.expr, o), o);
			else for (let t = e.min; t < e.max; t++) {
				let t = n();
				r(o, t), i(a(e.expr, o), t), o = t;
			}
			return [r(o)];
		} else if (e.type == "name") return [r(t, void 0, e.value)];
		else throw Error("Unknown expr type");
	}
}
function He(e, t) {
	return t - e;
}
function Ue(e, t) {
	let n = [];
	return r(t), n.sort(He);
	function r(t) {
		let i = e[t];
		if (i.length == 1 && !i[0].term) return r(i[0].to);
		n.push(t);
		for (let e = 0; e < i.length; e++) {
			let { term: t, to: a } = i[e];
			!t && n.indexOf(a) == -1 && r(a);
		}
	}
}
function We(e) {
	let t = Object.create(null);
	return n(Ue(e, 0));
	function n(r) {
		let i = [];
		r.forEach((t) => {
			e[t].forEach(({ term: t, to: n }) => {
				if (!t) return;
				let r;
				for (let e = 0; e < i.length; e++) i[e][0] == t && (r = i[e][1]);
				Ue(e, n).forEach((e) => {
					r || i.push([t, r = []]), r.indexOf(e) == -1 && r.push(e);
				});
			});
		});
		let a = t[r.join(",")] = new Me(r.indexOf(e.length - 1) > -1);
		for (let e = 0; e < i.length; e++) {
			let r = i[e][1].sort(He);
			a.next.push({
				type: i[e][0],
				next: t[r.join(",")] || n(r)
			});
		}
		return a;
	}
}
function Ge(e, t) {
	for (let n = 0, r = [e]; n < r.length; n++) {
		let e = r[n], i = !e.validEnd, a = [];
		for (let t = 0; t < e.next.length; t++) {
			let { type: n, next: o } = e.next[t];
			a.push(n.name), i && !(n.isText || n.hasRequiredAttrs()) && (i = !1), r.indexOf(o) == -1 && r.push(o);
		}
		i && t.err("Only non-generatable nodes (" + a.join(", ") + ") in a required position (see https://prosemirror.net/docs/guide/#generatable)");
	}
}
function Ke(e) {
	let t = Object.create(null);
	for (let n in e) {
		let r = e[n];
		if (!r.hasDefault) return null;
		t[n] = r.default;
	}
	return t;
}
function qe(e, t) {
	let n = Object.create(null);
	for (let r in e) {
		let i = t && t[r];
		if (i === void 0) {
			let t = e[r];
			if (t.hasDefault) i = t.default;
			else throw RangeError("No value supplied for attribute " + r);
		}
		n[r] = i;
	}
	return n;
}
function Je(e, t, n, r) {
	for (let r in t) if (!(r in e)) throw RangeError(`Unsupported attribute ${r} for ${n} of type ${r}`);
	for (let n in e) {
		let r = e[n];
		r.validate && r.validate(t[n]);
	}
}
function Ye(e, t) {
	let n = Object.create(null);
	if (t) for (let r in t) n[r] = new Ze(e, r, t[r]);
	return n;
}
var Xe = class e {
	constructor(e, t, n) {
		this.name = e, this.schema = t, this.spec = n, this.markSet = null, this.groups = n.group ? n.group.split(" ") : [], this.attrs = Ye(e, n.attrs), this.defaultAttrs = Ke(this.attrs), this.contentMatch = null, this.inlineContent = null, this.isBlock = !(n.inline || e == "text"), this.isText = e == "text";
	}
	get isInline() {
		return !this.isBlock;
	}
	get isTextblock() {
		return this.isBlock && this.inlineContent;
	}
	get isLeaf() {
		return this.contentMatch == Me.empty;
	}
	get isAtom() {
		return this.isLeaf || !!this.spec.atom;
	}
	isInGroup(e) {
		return this.groups.indexOf(e) > -1;
	}
	get whitespace() {
		return this.spec.whitespace || (this.spec.code ? "pre" : "normal");
	}
	hasRequiredAttrs() {
		for (let e in this.attrs) if (this.attrs[e].isRequired) return !0;
		return !1;
	}
	compatibleContent(e) {
		return this == e || this.contentMatch.compatible(e.contentMatch);
	}
	computeAttrs(e) {
		return !e && this.defaultAttrs ? this.defaultAttrs : qe(this.attrs, e);
	}
	create(e = null, t, n) {
		if (this.isText) throw Error("NodeType.create can't construct text nodes");
		return new ke(this, this.computeAttrs(e), T.from(t), E.setFrom(n));
	}
	createChecked(e = null, t, n) {
		return t = T.from(t), this.checkContent(t), new ke(this, this.computeAttrs(e), t, E.setFrom(n));
	}
	createAndFill(e = null, t, n) {
		if (e = this.computeAttrs(e), t = T.from(t), t.size) {
			let e = this.contentMatch.fillBefore(t);
			if (!e) return null;
			t = e.append(t);
		}
		let r = this.contentMatch.matchFragment(t), i = r && r.fillBefore(T.empty, !0);
		return i ? new ke(this, e, t.append(i), E.setFrom(n)) : null;
	}
	validContent(e) {
		let t = this.contentMatch.matchFragment(e);
		if (!t || !t.validEnd) return !1;
		for (let t = 0; t < e.childCount; t++) if (!this.allowsMarks(e.child(t).marks)) return !1;
		return !0;
	}
	checkContent(e) {
		if (!this.validContent(e)) throw RangeError(`Invalid content for node ${this.name}: ${e.toString().slice(0, 50)}`);
	}
	checkAttrs(e) {
		Je(this.attrs, e, "node", this.name);
	}
	allowsMarkType(e) {
		return this.markSet == null || this.markSet.indexOf(e) > -1;
	}
	allowsMarks(e) {
		if (this.markSet == null) return !0;
		for (let t = 0; t < e.length; t++) if (!this.allowsMarkType(e[t].type)) return !1;
		return !0;
	}
	allowedMarks(e) {
		if (this.markSet == null) return e;
		let t;
		for (let n = 0; n < e.length; n++) this.allowsMarkType(e[n].type) ? t && t.push(e[n]) : t || (t = e.slice(0, n));
		return t ? t.length ? t : E.none : e;
	}
	static compile(t, n) {
		let r = Object.create(null);
		t.forEach((t, i) => r[t] = new e(t, n, i));
		let i = n.spec.topNode || "doc";
		if (!r[i]) throw RangeError("Schema is missing its top node type ('" + i + "')");
		if (!r.text) throw RangeError("Every schema needs a 'text' type");
		for (let e in r.text.attrs) throw RangeError("The text node type should not have attributes");
		return r;
	}
};
function k(e, t, n) {
	let r = n.split("|");
	return (n) => {
		let i = n === null ? "null" : typeof n;
		if (r.indexOf(i) < 0) throw RangeError(`Expected value of type ${r} for attribute ${t} on type ${e}, got ${i}`);
	};
}
var Ze = class {
	constructor(e, t, n) {
		this.hasDefault = Object.prototype.hasOwnProperty.call(n, "default"), this.default = n.default, this.validate = typeof n.validate == "string" ? k(e, t, n.validate) : n.validate;
	}
	get isRequired() {
		return !this.hasDefault;
	}
}, Qe = class e {
	constructor(e, t, n, r) {
		this.name = e, this.rank = t, this.schema = n, this.spec = r, this.attrs = Ye(e, r.attrs), this.excluded = null;
		let i = Ke(this.attrs);
		this.instance = i ? new E(this, i) : null;
	}
	create(e = null) {
		return !e && this.instance ? this.instance : new E(this, qe(this.attrs, e));
	}
	static compile(t, n) {
		let r = Object.create(null), i = 0;
		return t.forEach((t, a) => r[t] = new e(t, i++, n, a)), r;
	}
	removeFromSet(e) {
		for (var t = 0; t < e.length; t++) e[t].type == this && (e = e.slice(0, t).concat(e.slice(t + 1)), t--);
		return e;
	}
	isInSet(e) {
		for (let t = 0; t < e.length; t++) if (e[t].type == this) return e[t];
	}
	checkAttrs(e) {
		Je(this.attrs, e, "mark", this.name);
	}
	excludes(e) {
		return this.excluded.indexOf(e) > -1;
	}
}, $e = class {
	constructor(e) {
		this.linebreakReplacement = null, this.cached = Object.create(null);
		let t = this.spec = {};
		for (let n in e) t[n] = e[n];
		t.nodes = w.from(e.nodes), t.marks = w.from(e.marks || {}), this.nodes = Xe.compile(this.spec.nodes, this), this.marks = Qe.compile(this.spec.marks, this);
		let n = Object.create(null);
		for (let e in this.nodes) {
			if (e in this.marks) throw RangeError(e + " can not be both a node and a mark");
			let t = this.nodes[e], r = t.spec.content || "", i = t.spec.marks;
			if (t.contentMatch = n[r] || (n[r] = Me.parse(r, this.nodes)), t.inlineContent = t.contentMatch.inlineContent, t.spec.linebreakReplacement) {
				if (this.linebreakReplacement) throw RangeError("Multiple linebreak nodes defined");
				if (!t.isInline || !t.isLeaf) throw RangeError("Linebreak replacement nodes must be inline leaf nodes");
				this.linebreakReplacement = t;
			}
			t.markSet = i == "_" ? null : i ? et(this, i.split(" ")) : i == "" || !t.inlineContent ? [] : null;
		}
		for (let e in this.marks) {
			let t = this.marks[e], n = t.spec.excludes;
			t.excluded = n == null ? [t] : n == "" ? [] : et(this, n.split(" "));
		}
		this.nodeFromJSON = (e) => ke.fromJSON(this, e), this.markFromJSON = (e) => E.fromJSON(this, e), this.topNodeType = this.nodes[this.spec.topNode || "doc"], this.cached.wrappings = Object.create(null);
	}
	node(e, t = null, n, r) {
		if (typeof e == "string") e = this.nodeType(e);
		else if (!(e instanceof Xe)) throw RangeError("Invalid node type: " + e);
		else if (e.schema != this) throw RangeError("Node type from different schema used (" + e.name + ")");
		return e.createChecked(t, n, r);
	}
	text(e, t) {
		let n = this.nodes.text;
		return new Ae(n, n.defaultAttrs, e, E.setFrom(t));
	}
	mark(e, t) {
		return typeof e == "string" && (e = this.marks[e]), e.create(t);
	}
	nodeType(e) {
		let t = this.nodes[e];
		if (!t) throw RangeError("Unknown node type: " + e);
		return t;
	}
};
function et(e, t) {
	let n = [];
	for (let r = 0; r < t.length; r++) {
		let i = t[r], a = e.marks[i], o = a;
		if (a) n.push(a);
		else for (let t in e.marks) {
			let r = e.marks[t];
			(i == "_" || r.spec.group && r.spec.group.split(" ").indexOf(i) > -1) && n.push(o = r);
		}
		if (!o) throw SyntaxError("Unknown mark type: '" + t[r] + "'");
	}
	return n;
}
function tt(e) {
	return e.tag != null;
}
function nt(e) {
	return e.style != null;
}
var rt = class e {
	constructor(e, t) {
		this.schema = e, this.rules = t, this.tags = [], this.styles = [];
		let n = this.matchedStyles = [];
		t.forEach((e) => {
			if (tt(e)) this.tags.push(e);
			else if (nt(e)) {
				let t = /[^=]*/.exec(e.style)[0];
				n.indexOf(t) < 0 && n.push(t), this.styles.push(e);
			}
		}), this.normalizeLists = !this.tags.some((t) => {
			if (!/^(ul|ol)\b/.test(t.tag) || !t.node) return !1;
			let n = e.nodes[t.node];
			return n.contentMatch.matchType(n);
		});
	}
	parse(e, t = {}) {
		let n = new ft(this, t, !1);
		return n.addAll(e, E.none, t.from, t.to), n.finish();
	}
	parseSlice(e, t = {}) {
		let n = new ft(this, t, !0);
		return n.addAll(e, E.none, t.from, t.to), D.maxOpen(n.finish());
	}
	matchTag(e, t, n) {
		for (let r = n ? this.tags.indexOf(n) + 1 : 0; r < this.tags.length; r++) {
			let n = this.tags[r];
			if (mt(e, n.tag) && (n.namespace === void 0 || e.namespaceURI == n.namespace) && (!n.context || t.matchesContext(n.context))) {
				if (n.getAttrs) {
					let t = n.getAttrs(e);
					if (t === !1) continue;
					n.attrs = t || void 0;
				}
				return n;
			}
		}
	}
	matchStyle(e, t, n, r) {
		for (let i = r ? this.styles.indexOf(r) + 1 : 0; i < this.styles.length; i++) {
			let r = this.styles[i], a = r.style;
			if (!(a.indexOf(e) != 0 || r.context && !n.matchesContext(r.context) || a.length > e.length && (a.charCodeAt(e.length) != 61 || a.slice(e.length + 1) != t))) {
				if (r.getAttrs) {
					let e = r.getAttrs(t);
					if (e === !1) continue;
					r.attrs = e || void 0;
				}
				return r;
			}
		}
	}
	static schemaRules(e) {
		let t = [];
		function n(e) {
			let n = e.priority == null ? 50 : e.priority, r = 0;
			for (; r < t.length; r++) {
				let e = t[r];
				if ((e.priority == null ? 50 : e.priority) < n) break;
			}
			t.splice(r, 0, e);
		}
		for (let t in e.marks) {
			let r = e.marks[t].spec.parseDOM;
			r && r.forEach((e) => {
				n(e = ht(e)), e.mark || e.ignore || e.clearMark || (e.mark = t);
			});
		}
		for (let t in e.nodes) {
			let r = e.nodes[t].spec.parseDOM;
			r && r.forEach((e) => {
				n(e = ht(e)), e.node || e.ignore || e.mark || (e.node = t);
			});
		}
		return t;
	}
	static fromSchema(t) {
		return t.cached.domParser || (t.cached.domParser = new e(t, e.schemaRules(t)));
	}
}, it = {
	address: !0,
	article: !0,
	aside: !0,
	blockquote: !0,
	canvas: !0,
	dd: !0,
	div: !0,
	dl: !0,
	fieldset: !0,
	figcaption: !0,
	figure: !0,
	footer: !0,
	form: !0,
	h1: !0,
	h2: !0,
	h3: !0,
	h4: !0,
	h5: !0,
	h6: !0,
	header: !0,
	hgroup: !0,
	hr: !0,
	li: !0,
	noscript: !0,
	ol: !0,
	output: !0,
	p: !0,
	pre: !0,
	section: !0,
	table: !0,
	tfoot: !0,
	ul: !0
}, at = {
	head: !0,
	noscript: !0,
	object: !0,
	script: !0,
	style: !0,
	title: !0
}, ot = {
	ol: !0,
	ul: !0
}, st = 1, ct = 2, lt = 4;
function ut(e, t, n) {
	return t == null ? e && e.whitespace == "pre" ? 3 : n & -5 : (t ? st : 0) | (t === "full" ? ct : 0);
}
var dt = class {
	constructor(e, t, n, r, i, a) {
		this.type = e, this.attrs = t, this.marks = n, this.solid = r, this.options = a, this.content = [], this.activeMarks = E.none, this.match = i || (a & lt ? null : e.contentMatch);
	}
	findWrapping(e) {
		if (!this.match) {
			if (!this.type) return [];
			let t = this.type.contentMatch.fillBefore(T.from(e));
			if (t) this.match = this.type.contentMatch.matchFragment(t);
			else {
				let t = this.type.contentMatch, n;
				return (n = t.findWrapping(e.type)) ? (this.match = t, n) : null;
			}
		}
		return this.match.findWrapping(e.type);
	}
	finish(e) {
		if (!(this.options & st)) {
			let e = this.content[this.content.length - 1], t;
			if (e && e.isText && (t = /[ \t\r\n\u000c]+$/.exec(e.text))) {
				let n = e;
				e.text.length == t[0].length ? this.content.pop() : this.content[this.content.length - 1] = n.withText(n.text.slice(0, n.text.length - t[0].length));
			}
		}
		let t = T.from(this.content);
		return !e && this.match && (t = t.append(this.match.fillBefore(T.empty, !0))), this.type ? this.type.create(this.attrs, t, this.marks) : t;
	}
	inlineContext(e) {
		return this.type ? this.type.inlineContent : this.content.length ? this.content[0].isInline : e.parentNode && !it.hasOwnProperty(e.parentNode.nodeName.toLowerCase());
	}
}, ft = class {
	constructor(e, t, n) {
		this.parser = e, this.options = t, this.isOpen = n, this.open = 0, this.localPreserveWS = !1;
		let r = t.topNode, i, a = ut(null, t.preserveWhitespace, 0) | (n ? lt : 0);
		i = r ? new dt(r.type, r.attrs, E.none, !0, t.topMatch || r.type.contentMatch, a) : n ? new dt(null, null, E.none, !0, null, a) : new dt(e.schema.topNodeType, null, E.none, !0, null, a), this.nodes = [i], this.find = t.findPositions, this.needsBlock = !1;
	}
	get top() {
		return this.nodes[this.open];
	}
	addDOM(e, t) {
		e.nodeType == 3 ? this.addTextNode(e, t) : e.nodeType == 1 && this.addElement(e, t);
	}
	addTextNode(e, t) {
		let n = e.nodeValue, r = this.top, i = r.options & ct ? "full" : this.localPreserveWS || (r.options & st) > 0, { schema: a } = this.parser;
		if (i === "full" || r.inlineContext(e) || /[^ \t\r\n\u000c]/.test(n)) {
			if (!i) {
				if (n = n.replace(/[ \t\r\n\u000c]+/g, " "), /^[ \t\r\n\u000c]/.test(n) && this.open == this.nodes.length - 1) {
					let t = r.content[r.content.length - 1], i = e.previousSibling;
					(!t || i && i.nodeName == "BR" || t.isText && /[ \t\r\n\u000c]$/.test(t.text)) && (n = n.slice(1));
				}
			} else if (i === "full") n = n.replace(/\r\n?/g, "\n");
			else if (a.linebreakReplacement && /[\r\n]/.test(n) && this.top.findWrapping(a.linebreakReplacement.create())) {
				let e = n.split(/\r?\n|\r/);
				for (let n = 0; n < e.length; n++) n && this.insertNode(a.linebreakReplacement.create(), t, !0), e[n] && this.insertNode(a.text(e[n]), t, !/\S/.test(e[n]));
				n = "";
			} else n = n.replace(/\r?\n|\r/g, " ");
			n && this.insertNode(a.text(n), t, !/\S/.test(n)), this.findInText(e);
		} else this.findInside(e);
	}
	addElement(e, t, n) {
		let r = this.localPreserveWS, i = this.top;
		(e.tagName == "PRE" || /pre/.test(e.style && e.style.whiteSpace)) && (this.localPreserveWS = !0);
		let a = e.nodeName.toLowerCase(), o;
		ot.hasOwnProperty(a) && this.parser.normalizeLists && pt(e);
		let s = this.options.ruleFromNode && this.options.ruleFromNode(e) || (o = this.parser.matchTag(e, this, n));
		out: if (s ? s.ignore : at.hasOwnProperty(a)) this.findInside(e), this.ignoreFallback(e, t);
		else if (!s || s.skip || s.closeParent) {
			s && s.closeParent ? this.open = Math.max(0, this.open - 1) : s && s.skip.nodeType && (e = s.skip);
			let n, r = this.needsBlock;
			if (it.hasOwnProperty(a)) i.content.length && i.content[0].isInline && this.open && (this.open--, i = this.top), n = !0, i.type || (this.needsBlock = !0);
			else if (!e.firstChild) {
				this.leafFallback(e, t);
				break out;
			}
			let o = s && s.skip ? t : this.readStyles(e, t);
			o && this.addAll(e, o), n && this.sync(i), this.needsBlock = r;
		} else {
			let n = this.readStyles(e, t);
			n && this.addElementByRule(e, s, n, s.consuming === !1 ? o : void 0);
		}
		this.localPreserveWS = r;
	}
	leafFallback(e, t) {
		e.nodeName == "BR" && this.top.type && this.top.type.inlineContent && this.addTextNode(e.ownerDocument.createTextNode("\n"), t);
	}
	ignoreFallback(e, t) {
		e.nodeName == "BR" && (!this.top.type || !this.top.type.inlineContent) && this.findPlace(this.parser.schema.text("-"), t, !0);
	}
	readStyles(e, t) {
		let n = e.style;
		if (n && n.length) for (let e = 0; e < this.parser.matchedStyles.length; e++) {
			let r = this.parser.matchedStyles[e], i = n.getPropertyValue(r);
			if (i) for (let e;;) {
				let n = this.parser.matchStyle(r, i, this, e);
				if (!n) break;
				if (n.ignore) return null;
				if (t = n.clearMark ? t.filter((e) => !n.clearMark(e)) : t.concat(this.parser.schema.marks[n.mark].create(n.attrs)), n.consuming === !1) e = n;
				else break;
			}
		}
		return t;
	}
	addElementByRule(e, t, n, r) {
		let i, a;
		if (t.node) {
			if (a = this.parser.schema.nodes[t.node], a.isLeaf) this.insertNode(a.create(t.attrs), n, e.nodeName == "BR") || this.leafFallback(e, n);
			else {
				let e = this.enter(a, t.attrs || null, n, t.preserveWhitespace);
				e && (i = !0, n = e);
			}
		} else {
			let e = this.parser.schema.marks[t.mark];
			n = n.concat(e.create(t.attrs));
		}
		let o = this.top;
		if (a && a.isLeaf) this.findInside(e);
		else if (r) this.addElement(e, n, r);
		else if (t.getContent) this.findInside(e), t.getContent(e, this.parser.schema).forEach((e) => this.insertNode(e, n, !1));
		else {
			let r = e;
			typeof t.contentElement == "string" ? r = e.querySelector(t.contentElement) : typeof t.contentElement == "function" ? r = t.contentElement(e) : t.contentElement && (r = t.contentElement), this.findAround(e, r, !0), this.addAll(r, n), this.findAround(e, r, !1);
		}
		i && this.sync(o) && this.open--;
	}
	addAll(e, t, n, r) {
		let i = n || 0;
		for (let a = n ? e.childNodes[n] : e.firstChild, o = r == null ? null : e.childNodes[r]; a != o; a = a.nextSibling, ++i) this.findAtPoint(e, i), this.addDOM(a, t);
		this.findAtPoint(e, i);
	}
	findPlace(e, t, n) {
		let r, i;
		for (let t = this.open, a = 0; t >= 0; t--) {
			let o = this.nodes[t], s = o.findWrapping(e);
			if (s && (!r || r.length > s.length + a) && (r = s, i = o, !s.length)) break;
			if (o.solid) {
				if (n) break;
				a += 2;
			}
		}
		if (!r) return null;
		this.sync(i);
		for (let e = 0; e < r.length; e++) t = this.enterInner(r[e], null, t, !1);
		return t;
	}
	insertNode(e, t, n) {
		if (e.isInline && this.needsBlock && !this.top.type) {
			let e = this.textblockFromContext();
			e && (t = this.enterInner(e, null, t));
		}
		let r = this.findPlace(e, t, n);
		if (r) {
			this.closeExtra();
			let t = this.top;
			t.match && (t.match = t.match.matchType(e.type));
			let n = E.none;
			for (let i of r.concat(e.marks)) (t.type ? t.type.allowsMarkType(i.type) : gt(i.type, e.type)) && (n = i.addToSet(n));
			return t.content.push(e.mark(n)), !0;
		}
		return !1;
	}
	enter(e, t, n, r) {
		let i = this.findPlace(e.create(t), n, !1);
		return i && (i = this.enterInner(e, t, n, !0, r)), i;
	}
	enterInner(e, t, n, r = !1, i) {
		this.closeExtra();
		let a = this.top;
		a.match = a.match && a.match.matchType(e);
		let o = ut(e, i, a.options);
		a.options & lt && a.content.length == 0 && (o |= lt);
		let s = E.none;
		return n = n.filter((t) => !(a.type ? a.type.allowsMarkType(t.type) : gt(t.type, e)) || (s = t.addToSet(s), !1)), this.nodes.push(new dt(e, t, s, r, null, o)), this.open++, n;
	}
	closeExtra(e = !1) {
		let t = this.nodes.length - 1;
		if (t > this.open) {
			for (; t > this.open; t--) this.nodes[t - 1].content.push(this.nodes[t].finish(e));
			this.nodes.length = this.open + 1;
		}
	}
	finish() {
		return this.open = 0, this.closeExtra(this.isOpen), this.nodes[0].finish(!!(this.isOpen || this.options.topOpen));
	}
	sync(e) {
		for (let t = this.open; t >= 0; t--) if (this.nodes[t] == e) return this.open = t, !0;
		else this.localPreserveWS && (this.nodes[t].options |= st);
		return !1;
	}
	get currentPos() {
		this.closeExtra();
		let e = 0;
		for (let t = this.open; t >= 0; t--) {
			let n = this.nodes[t].content;
			for (let t = n.length - 1; t >= 0; t--) e += n[t].nodeSize;
			t && e++;
		}
		return e;
	}
	findAtPoint(e, t) {
		if (this.find) for (let n = 0; n < this.find.length; n++) this.find[n].node == e && this.find[n].offset == t && (this.find[n].pos = this.currentPos);
	}
	findInside(e) {
		if (this.find) for (let t = 0; t < this.find.length; t++) this.find[t].pos == null && e.nodeType == 1 && e.contains(this.find[t].node) && (this.find[t].pos = this.currentPos);
	}
	findAround(e, t, n) {
		if (e != t && this.find) for (let r = 0; r < this.find.length; r++) this.find[r].pos == null && e.nodeType == 1 && e.contains(this.find[r].node) && t.compareDocumentPosition(this.find[r].node) & (n ? 2 : 4) && (this.find[r].pos = this.currentPos);
	}
	findInText(e) {
		if (this.find) for (let t = 0; t < this.find.length; t++) this.find[t].node == e && (this.find[t].pos = this.currentPos - (e.nodeValue.length - this.find[t].offset));
	}
	matchesContext(e) {
		if (e.indexOf("|") > -1) return e.split(/\s*\|\s*/).some(this.matchesContext, this);
		let t = e.split("/"), n = this.options.context, r = !this.isOpen && (!n || n.parent.type == this.nodes[0].type), i = -(n ? n.depth + 1 : 0) + +!r, a = (e, o) => {
			for (; e >= 0; e--) {
				let s = t[e];
				if (s == "") {
					if (e == t.length - 1 || e == 0) continue;
					for (; o >= i; o--) if (a(e - 1, o)) return !0;
					return !1;
				}
				{
					let e = o > 0 || o == 0 && r ? this.nodes[o].type : n && o >= i ? n.node(o - i).type : null;
					if (!e || e.name != s && !e.isInGroup(s)) return !1;
					o--;
				}
			}
			return !0;
		};
		return a(t.length - 1, this.open);
	}
	textblockFromContext() {
		let e = this.options.context;
		if (e) for (let t = e.depth; t >= 0; t--) {
			let n = e.node(t).contentMatchAt(e.indexAfter(t)).defaultType;
			if (n && n.isTextblock && n.defaultAttrs) return n;
		}
		for (let e in this.parser.schema.nodes) {
			let t = this.parser.schema.nodes[e];
			if (t.isTextblock && t.defaultAttrs) return t;
		}
	}
};
function pt(e) {
	for (let t = e.firstChild, n = null; t; t = t.nextSibling) {
		let e = t.nodeType == 1 ? t.nodeName.toLowerCase() : null;
		e && ot.hasOwnProperty(e) && n ? (n.appendChild(t), t = n) : e == "li" ? n = t : e && (n = null);
	}
}
function mt(e, t) {
	return (e.matches || e.msMatchesSelector || e.webkitMatchesSelector || e.mozMatchesSelector).call(e, t);
}
function ht(e) {
	let t = {};
	for (let n in e) t[n] = e[n];
	return t;
}
function gt(e, t) {
	let n = t.schema.nodes;
	for (let r in n) {
		let i = n[r];
		if (!i.allowsMarkType(e)) continue;
		let a = [], o = (e) => {
			a.push(e);
			for (let n = 0; n < e.edgeCount; n++) {
				let { type: r, next: i } = e.edge(n);
				if (r == t || a.indexOf(i) < 0 && o(i)) return !0;
			}
		};
		if (o(i.contentMatch)) return !0;
	}
}
var _t = class e {
	constructor(e, t) {
		this.nodes = e, this.marks = t;
	}
	serializeFragment(e, t = {}, n) {
		n || (n = yt(t).createDocumentFragment());
		let r = n, i = [];
		return e.forEach((e) => {
			if (i.length || e.marks.length) {
				let n = 0, a = 0;
				for (; n < i.length && a < e.marks.length;) {
					let t = e.marks[a];
					if (!this.marks[t.type.name]) {
						a++;
						continue;
					}
					if (!t.eq(i[n][0]) || t.type.spec.spanning === !1) break;
					n++, a++;
				}
				for (; n < i.length;) r = i.pop()[1];
				for (; a < e.marks.length;) {
					let n = e.marks[a++], o = this.serializeMark(n, e.isInline, t);
					o && (i.push([n, r]), r.appendChild(o.dom), r = o.contentDOM || o.dom);
				}
			}
			r.appendChild(this.serializeNodeInner(e, t));
		}), n;
	}
	serializeNodeInner(e, t) {
		let { dom: n, contentDOM: r } = Ct(yt(t), this.nodes[e.type.name](e), null, e.attrs);
		if (r) {
			if (e.isLeaf) throw RangeError("Content hole not allowed in a leaf node spec");
			this.serializeFragment(e.content, t, r);
		}
		return n;
	}
	serializeNode(e, t = {}) {
		let n = this.serializeNodeInner(e, t);
		for (let r = e.marks.length - 1; r >= 0; r--) {
			let i = this.serializeMark(e.marks[r], e.isInline, t);
			i && ((i.contentDOM || i.dom).appendChild(n), n = i.dom);
		}
		return n;
	}
	serializeMark(e, t, n = {}) {
		let r = this.marks[e.type.name];
		return r && Ct(yt(n), r(e, t), null, e.attrs);
	}
	static renderSpec(e, t, n = null, r) {
		return Ct(e, t, n, r);
	}
	static fromSchema(t) {
		return t.cached.domSerializer || (t.cached.domSerializer = new e(this.nodesFromSchema(t), this.marksFromSchema(t)));
	}
	static nodesFromSchema(e) {
		let t = vt(e.nodes);
		return t.text || (t.text = (e) => e.text), t;
	}
	static marksFromSchema(e) {
		return vt(e.marks);
	}
};
function vt(e) {
	let t = {};
	for (let n in e) {
		let r = e[n].spec.toDOM;
		r && (t[n] = r);
	}
	return t;
}
function yt(e) {
	return e.document || window.document;
}
var bt = /* @__PURE__ */ new WeakMap();
function xt(e) {
	let t = bt.get(e);
	return t === void 0 && bt.set(e, t = St(e)), t;
}
function St(e) {
	let t = null;
	function n(e) {
		if (e && typeof e == "object") {
			if (Array.isArray(e)) {
				if (typeof e[0] == "string") t || (t = []), t.push(e);
				else for (let t = 0; t < e.length; t++) n(e[t]);
			} else for (let t in e) n(e[t]);
		}
	}
	return n(e), t;
}
function Ct(e, t, n, r) {
	if (typeof t == "string") return { dom: e.createTextNode(t) };
	if (t.nodeType != null) return { dom: t };
	if (t.dom && t.dom.nodeType != null) return t;
	let i = t[0], a;
	if (typeof i != "string") throw RangeError("Invalid array passed to renderSpec");
	if (r && (a = xt(r)) && a.indexOf(t) > -1) throw RangeError("Using an array from an attribute object as a DOM spec. This may be an attempted cross site scripting attack.");
	let o = i.indexOf(" ");
	o > 0 && (n = i.slice(0, o), i = i.slice(o + 1));
	let s, c = n ? e.createElementNS(n, i) : e.createElement(i), l = t[1], u = 1;
	if (l && typeof l == "object" && l.nodeType == null && !Array.isArray(l)) {
		u = 2;
		for (let e in l) if (l[e] != null) {
			let t = e.indexOf(" ");
			t > 0 ? c.setAttributeNS(e.slice(0, t), e.slice(t + 1), l[e]) : e == "style" && c.style ? c.style.cssText = l[e] : c.setAttribute(e, l[e]);
		}
	}
	for (let i = u; i < t.length; i++) {
		let a = t[i];
		if (a === 0) {
			if (i < t.length - 1 || i > u) throw RangeError("Content hole must be the only child of its parent node");
			return {
				dom: c,
				contentDOM: c
			};
		}
		{
			let { dom: t, contentDOM: i } = Ct(e, a, n, r);
			if (c.appendChild(t), i) {
				if (s) throw RangeError("Multiple content holes");
				s = i;
			}
		}
	}
	return {
		dom: c,
		contentDOM: s
	};
}
//#endregion
//#region node_modules/prosemirror-transform/dist/index.js
var wt = 65535, Tt = 2 ** 16;
function Et(e, t) {
	return e + t * Tt;
}
function Dt(e) {
	return e & wt;
}
function Ot(e) {
	return (e - (e & wt)) / Tt;
}
var kt = 1, At = 2, jt = 4, Mt = 8, Nt = class {
	constructor(e, t, n) {
		this.pos = e, this.delInfo = t, this.recover = n;
	}
	get deleted() {
		return (this.delInfo & Mt) > 0;
	}
	get deletedBefore() {
		return (this.delInfo & 5) > 0;
	}
	get deletedAfter() {
		return (this.delInfo & 6) > 0;
	}
	get deletedAcross() {
		return (this.delInfo & jt) > 0;
	}
}, Pt = class e {
	constructor(t, n = !1) {
		if (this.ranges = t, this.inverted = n, !t.length && e.empty) return e.empty;
	}
	recover(e) {
		let t = 0, n = Dt(e);
		if (!this.inverted) for (let e = 0; e < n; e++) t += this.ranges[e * 3 + 2] - this.ranges[e * 3 + 1];
		return this.ranges[n * 3] + t + Ot(e);
	}
	mapResult(e, t = 1) {
		return this._map(e, t, !1);
	}
	map(e, t = 1) {
		return this._map(e, t, !0);
	}
	_map(e, t, n) {
		let r = 0, i = this.inverted ? 2 : 1, a = this.inverted ? 1 : 2;
		for (let o = 0; o < this.ranges.length; o += 3) {
			let s = this.ranges[o] - (this.inverted ? r : 0);
			if (s > e) break;
			let c = this.ranges[o + i], l = this.ranges[o + a], u = s + c;
			if (e <= u) {
				let i = c ? e == s ? -1 : e == u ? 1 : t : t, a = s + r + (i < 0 ? 0 : l);
				if (n) return a;
				let d = e == (t < 0 ? s : u) ? null : Et(o / 3, e - s), f = e == s ? At : e == u ? kt : jt;
				return (t < 0 ? e != s : e != u) && (f |= Mt), new Nt(a, f, d);
			}
			r += l - c;
		}
		return n ? e + r : new Nt(e + r, 0, null);
	}
	touches(e, t) {
		let n = 0, r = Dt(t), i = this.inverted ? 2 : 1, a = this.inverted ? 1 : 2;
		for (let t = 0; t < this.ranges.length; t += 3) {
			let o = this.ranges[t] - (this.inverted ? n : 0);
			if (o > e) break;
			let s = this.ranges[t + i];
			if (e <= o + s && t == r * 3) return !0;
			n += this.ranges[t + a] - s;
		}
		return !1;
	}
	forEach(e) {
		let t = this.inverted ? 2 : 1, n = this.inverted ? 1 : 2;
		for (let r = 0, i = 0; r < this.ranges.length; r += 3) {
			let a = this.ranges[r], o = a - (this.inverted ? i : 0), s = a + (this.inverted ? 0 : i), c = this.ranges[r + t], l = this.ranges[r + n];
			e(o, o + c, s, s + l), i += l - c;
		}
	}
	invert() {
		return new e(this.ranges, !this.inverted);
	}
	toString() {
		return (this.inverted ? "-" : "") + JSON.stringify(this.ranges);
	}
	static offset(t) {
		return t == 0 ? e.empty : new e(t < 0 ? [
			0,
			-t,
			0
		] : [
			0,
			0,
			t
		]);
	}
};
Pt.empty = new Pt([]);
var Ft = class e {
	constructor(e, t, n = 0, r = e ? e.length : 0) {
		this.mirror = t, this.from = n, this.to = r, this._maps = e || [], this.ownData = !(e || t);
	}
	get maps() {
		return this._maps;
	}
	slice(t = 0, n = this.maps.length) {
		return new e(this._maps, this.mirror, t, n);
	}
	appendMap(e, t) {
		this.ownData || (this._maps = this._maps.slice(), this.mirror = this.mirror && this.mirror.slice(), this.ownData = !0), this.to = this._maps.push(e), t != null && this.setMirror(this._maps.length - 1, t);
	}
	appendMapping(e) {
		for (let t = 0, n = this._maps.length; t < e._maps.length; t++) {
			let r = e.getMirror(t);
			this.appendMap(e._maps[t], r != null && r < t ? n + r : void 0);
		}
	}
	getMirror(e) {
		if (this.mirror) {
			for (let t = 0; t < this.mirror.length; t++) if (this.mirror[t] == e) return this.mirror[t + (t % 2 ? -1 : 1)];
		}
	}
	setMirror(e, t) {
		this.mirror || (this.mirror = []), this.mirror.push(e, t);
	}
	appendMappingInverted(e) {
		for (let t = e.maps.length - 1, n = this._maps.length + e._maps.length; t >= 0; t--) {
			let r = e.getMirror(t);
			this.appendMap(e._maps[t].invert(), r != null && r > t ? n - r - 1 : void 0);
		}
	}
	invert() {
		let t = new e();
		return t.appendMappingInverted(this), t;
	}
	map(e, t = 1) {
		if (this.mirror) return this._map(e, t, !0);
		for (let n = this.from; n < this.to; n++) e = this._maps[n].map(e, t);
		return e;
	}
	mapResult(e, t = 1) {
		return this._map(e, t, !1);
	}
	_map(e, t, n) {
		let r = 0;
		for (let n = this.from; n < this.to; n++) {
			let i = this._maps[n].mapResult(e, t);
			if (i.recover != null) {
				let t = this.getMirror(n);
				if (t != null && t > n && t < this.to) {
					n = t, e = this._maps[t].recover(i.recover);
					continue;
				}
			}
			r |= i.delInfo, e = i.pos;
		}
		return n ? e : new Nt(e, r, null);
	}
}, It = Object.create(null), Lt = class {
	getMap() {
		return Pt.empty;
	}
	merge(e) {
		return null;
	}
	static fromJSON(e, t) {
		if (!t || !t.stepType) throw RangeError("Invalid input for Step.fromJSON");
		let n = It[t.stepType];
		if (!n) throw RangeError(`No step type ${t.stepType} defined`);
		return n.fromJSON(e, t);
	}
	static jsonID(e, t) {
		if (e in It) throw RangeError("Duplicate use of step JSON ID " + e);
		return It[e] = t, t.prototype.jsonID = e, t;
	}
}, Rt = class e {
	constructor(e, t) {
		this.doc = e, this.failed = t;
	}
	static ok(t) {
		return new e(t, null);
	}
	static fail(t) {
		return new e(null, t);
	}
	static fromReplace(t, n, r, i) {
		try {
			return e.ok(t.replace(n, r, i));
		} catch (t) {
			if (t instanceof de) return e.fail(t.message);
			throw t;
		}
	}
};
function zt(e, t, n) {
	let r = [];
	for (let i = 0; i < e.childCount; i++) {
		let a = e.child(i);
		a.content.size && (a = a.copy(zt(a.content, t, a))), a.isInline && (a = t(a, n, i)), r.push(a);
	}
	return T.fromArray(r);
}
var Bt = class e extends Lt {
	constructor(e, t, n) {
		super(), this.from = e, this.to = t, this.mark = n;
	}
	apply(e) {
		let t = e.slice(this.from, this.to), n = e.resolve(this.from), r = n.node(n.sharedDepth(this.to)), i = new D(zt(t.content, (e, t) => !e.isAtom || !t.type.allowsMarkType(this.mark.type) ? e : e.mark(this.mark.addToSet(e.marks)), r), t.openStart, t.openEnd);
		return Rt.fromReplace(e, this.from, this.to, i);
	}
	invert() {
		return new Vt(this.from, this.to, this.mark);
	}
	map(t) {
		let n = t.mapResult(this.from, 1), r = t.mapResult(this.to, -1);
		return n.deleted && r.deleted || n.pos >= r.pos ? null : new e(n.pos, r.pos, this.mark);
	}
	merge(t) {
		return t instanceof e && t.mark.eq(this.mark) && this.from <= t.to && this.to >= t.from ? new e(Math.min(this.from, t.from), Math.max(this.to, t.to), this.mark) : null;
	}
	toJSON() {
		return {
			stepType: "addMark",
			mark: this.mark.toJSON(),
			from: this.from,
			to: this.to
		};
	}
	static fromJSON(t, n) {
		if (typeof n.from != "number" || typeof n.to != "number") throw RangeError("Invalid input for AddMarkStep.fromJSON");
		return new e(n.from, n.to, t.markFromJSON(n.mark));
	}
};
Lt.jsonID("addMark", Bt);
var Vt = class e extends Lt {
	constructor(e, t, n) {
		super(), this.from = e, this.to = t, this.mark = n;
	}
	apply(e) {
		let t = e.slice(this.from, this.to), n = new D(zt(t.content, (e) => e.mark(this.mark.removeFromSet(e.marks)), e), t.openStart, t.openEnd);
		return Rt.fromReplace(e, this.from, this.to, n);
	}
	invert() {
		return new Bt(this.from, this.to, this.mark);
	}
	map(t) {
		let n = t.mapResult(this.from, 1), r = t.mapResult(this.to, -1);
		return n.deleted && r.deleted || n.pos >= r.pos ? null : new e(n.pos, r.pos, this.mark);
	}
	merge(t) {
		return t instanceof e && t.mark.eq(this.mark) && this.from <= t.to && this.to >= t.from ? new e(Math.min(this.from, t.from), Math.max(this.to, t.to), this.mark) : null;
	}
	toJSON() {
		return {
			stepType: "removeMark",
			mark: this.mark.toJSON(),
			from: this.from,
			to: this.to
		};
	}
	static fromJSON(t, n) {
		if (typeof n.from != "number" || typeof n.to != "number") throw RangeError("Invalid input for RemoveMarkStep.fromJSON");
		return new e(n.from, n.to, t.markFromJSON(n.mark));
	}
};
Lt.jsonID("removeMark", Vt);
var Ht = class e extends Lt {
	constructor(e, t) {
		super(), this.pos = e, this.mark = t;
	}
	apply(e) {
		let t = e.nodeAt(this.pos);
		if (!t) return Rt.fail("No node at mark step's position");
		let n = t.type.create(t.attrs, null, this.mark.addToSet(t.marks));
		return Rt.fromReplace(e, this.pos, this.pos + 1, new D(T.from(n), 0, +!t.isLeaf));
	}
	invert(t) {
		let n = t.nodeAt(this.pos);
		if (n) {
			let t = this.mark.addToSet(n.marks);
			if (t.length == n.marks.length) {
				for (let r = 0; r < n.marks.length; r++) if (!n.marks[r].isInSet(t)) return new e(this.pos, n.marks[r]);
				return new e(this.pos, this.mark);
			}
		}
		return new Ut(this.pos, this.mark);
	}
	map(t) {
		let n = t.mapResult(this.pos, 1);
		return n.deletedAfter ? null : new e(n.pos, this.mark);
	}
	toJSON() {
		return {
			stepType: "addNodeMark",
			pos: this.pos,
			mark: this.mark.toJSON()
		};
	}
	static fromJSON(t, n) {
		if (typeof n.pos != "number") throw RangeError("Invalid input for AddNodeMarkStep.fromJSON");
		return new e(n.pos, t.markFromJSON(n.mark));
	}
};
Lt.jsonID("addNodeMark", Ht);
var Ut = class e extends Lt {
	constructor(e, t) {
		super(), this.pos = e, this.mark = t;
	}
	apply(e) {
		let t = e.nodeAt(this.pos);
		if (!t) return Rt.fail("No node at mark step's position");
		let n = t.type.create(t.attrs, null, this.mark.removeFromSet(t.marks));
		return Rt.fromReplace(e, this.pos, this.pos + 1, new D(T.from(n), 0, +!t.isLeaf));
	}
	invert(e) {
		let t = e.nodeAt(this.pos);
		return !t || !this.mark.isInSet(t.marks) ? this : new Ht(this.pos, this.mark);
	}
	map(t) {
		let n = t.mapResult(this.pos, 1);
		return n.deletedAfter ? null : new e(n.pos, this.mark);
	}
	toJSON() {
		return {
			stepType: "removeNodeMark",
			pos: this.pos,
			mark: this.mark.toJSON()
		};
	}
	static fromJSON(t, n) {
		if (typeof n.pos != "number") throw RangeError("Invalid input for RemoveNodeMarkStep.fromJSON");
		return new e(n.pos, t.markFromJSON(n.mark));
	}
};
Lt.jsonID("removeNodeMark", Ut);
var Wt = class e extends Lt {
	constructor(e, t, n, r = !1) {
		super(), this.from = e, this.to = t, this.slice = n, this.structure = r;
	}
	apply(e) {
		return this.structure && Kt(e, this.from, this.to) ? Rt.fail("Structure replace would overwrite content") : Rt.fromReplace(e, this.from, this.to, this.slice);
	}
	getMap() {
		return new Pt([
			this.from,
			this.to - this.from,
			this.slice.size
		]);
	}
	invert(t) {
		return new e(this.from, this.from + this.slice.size, t.slice(this.from, this.to));
	}
	map(t) {
		let n = t.mapResult(this.to, -1), r = this.from == this.to && e.MAP_BIAS < 0 ? n : t.mapResult(this.from, 1);
		return r.deletedAcross && n.deletedAcross ? null : new e(r.pos, Math.max(r.pos, n.pos), this.slice, this.structure);
	}
	merge(t) {
		if (!(t instanceof e) || t.structure || this.structure) return null;
		if (this.from + this.slice.size == t.from && !this.slice.openEnd && !t.slice.openStart) {
			let n = this.slice.size + t.slice.size == 0 ? D.empty : new D(this.slice.content.append(t.slice.content), this.slice.openStart, t.slice.openEnd);
			return new e(this.from, this.to + (t.to - t.from), n, this.structure);
		}
		if (t.to == this.from && !this.slice.openStart && !t.slice.openEnd) {
			let n = this.slice.size + t.slice.size == 0 ? D.empty : new D(t.slice.content.append(this.slice.content), t.slice.openStart, this.slice.openEnd);
			return new e(t.from, this.to, n, this.structure);
		}
		return null;
	}
	toJSON() {
		let e = {
			stepType: "replace",
			from: this.from,
			to: this.to
		};
		return this.slice.size && (e.slice = this.slice.toJSON()), this.structure && (e.structure = !0), e;
	}
	static fromJSON(t, n) {
		if (typeof n.from != "number" || typeof n.to != "number") throw RangeError("Invalid input for ReplaceStep.fromJSON");
		return new e(n.from, n.to, D.fromJSON(t, n.slice), !!n.structure);
	}
};
Wt.MAP_BIAS = 1, Lt.jsonID("replace", Wt);
var Gt = class e extends Lt {
	constructor(e, t, n, r, i, a, o = !1) {
		super(), this.from = e, this.to = t, this.gapFrom = n, this.gapTo = r, this.slice = i, this.insert = a, this.structure = o;
	}
	apply(e) {
		if (this.structure && (Kt(e, this.from, this.gapFrom) || Kt(e, this.gapTo, this.to))) return Rt.fail("Structure gap-replace would overwrite content");
		let t = e.slice(this.gapFrom, this.gapTo);
		if (t.openStart || t.openEnd) return Rt.fail("Gap is not a flat range");
		let n = this.slice.insertAt(this.insert, t.content);
		return n ? Rt.fromReplace(e, this.from, this.to, n) : Rt.fail("Content does not fit in gap");
	}
	getMap() {
		return new Pt([
			this.from,
			this.gapFrom - this.from,
			this.insert,
			this.gapTo,
			this.to - this.gapTo,
			this.slice.size - this.insert
		]);
	}
	invert(t) {
		let n = this.gapTo - this.gapFrom;
		return new e(this.from, this.from + this.slice.size + n, this.from + this.insert, this.from + this.insert + n, t.slice(this.from, this.to).removeBetween(this.gapFrom - this.from, this.gapTo - this.from), this.gapFrom - this.from, this.structure);
	}
	map(t) {
		let n = t.mapResult(this.from, 1), r = t.mapResult(this.to, -1), i = this.from == this.gapFrom ? n.pos : t.map(this.gapFrom, -1), a = this.to == this.gapTo ? r.pos : t.map(this.gapTo, 1);
		return n.deletedAcross && r.deletedAcross || i < n.pos || a > r.pos ? null : new e(n.pos, r.pos, i, a, this.slice, this.insert, this.structure);
	}
	toJSON() {
		let e = {
			stepType: "replaceAround",
			from: this.from,
			to: this.to,
			gapFrom: this.gapFrom,
			gapTo: this.gapTo,
			insert: this.insert
		};
		return this.slice.size && (e.slice = this.slice.toJSON()), this.structure && (e.structure = !0), e;
	}
	static fromJSON(t, n) {
		if (typeof n.from != "number" || typeof n.to != "number" || typeof n.gapFrom != "number" || typeof n.gapTo != "number" || typeof n.insert != "number") throw RangeError("Invalid input for ReplaceAroundStep.fromJSON");
		return new e(n.from, n.to, n.gapFrom, n.gapTo, D.fromJSON(t, n.slice), n.insert, !!n.structure);
	}
};
Lt.jsonID("replaceAround", Gt);
function Kt(e, t, n) {
	let r = e.resolve(t), i = n - t, a = r.depth;
	for (; i > 0 && a > 0 && r.indexAfter(a) == r.node(a).childCount;) a--, i--;
	if (i > 0) {
		let e = r.node(a).maybeChild(r.indexAfter(a));
		for (; i > 0;) {
			if (!e || e.isLeaf) return !0;
			e = e.firstChild, i--;
		}
	}
	return !1;
}
function qt(e, t, n, r) {
	let i = [], a = [], o, s;
	e.doc.nodesBetween(t, n, (e, c, l) => {
		if (!e.isInline) return;
		let u = e.marks;
		if (!r.isInSet(u) && l.type.allowsMarkType(r.type)) {
			let l = Math.max(c, t), d = Math.min(c + e.nodeSize, n), f = r.addToSet(u);
			for (let e = 0; e < u.length; e++) u[e].isInSet(f) || (o && o.to == l && o.mark.eq(u[e]) ? o.to = d : i.push(o = new Vt(l, d, u[e])));
			s && s.to == l ? s.to = d : a.push(s = new Bt(l, d, r));
		}
	}), i.forEach((t) => e.step(t)), a.forEach((t) => e.step(t));
}
function Jt(e, t, n, r) {
	let i = [], a = 0;
	e.doc.nodesBetween(t, n, (e, o) => {
		if (!e.isInline) return;
		a++;
		let s = null;
		if (r instanceof Qe) {
			let t = e.marks, n;
			for (; n = r.isInSet(t);) (s || (s = [])).push(n), t = n.removeFromSet(t);
		} else r ? r.isInSet(e.marks) && (s = [r]) : s = e.marks;
		if (s && s.length) {
			let r = Math.min(o + e.nodeSize, n);
			for (let e = 0; e < s.length; e++) {
				let n = s[e], c;
				for (let e = 0; e < i.length; e++) {
					let t = i[e];
					t.step == a - 1 && n.eq(i[e].style) && (c = t);
				}
				c ? (c.to = r, c.step = a) : i.push({
					style: n,
					from: Math.max(o, t),
					to: r,
					step: a
				});
			}
		}
	}), i.forEach((t) => e.step(new Vt(t.from, t.to, t.style)));
}
function Yt(e, t, n, r = n.contentMatch, i = !0) {
	let a = e.doc.nodeAt(t), o = [], s = t + 1;
	for (let t = 0; t < a.childCount; t++) {
		let c = a.child(t), l = s + c.nodeSize, u = r.matchType(c.type);
		if (!u) o.push(new Wt(s, l, D.empty));
		else {
			r = u;
			for (let t = 0; t < c.marks.length; t++) n.allowsMarkType(c.marks[t].type) || e.step(new Vt(s, l, c.marks[t]));
			if (i && c.isText && n.whitespace != "pre") {
				let e, t = /\r?\n|\r/g, r;
				for (; e = t.exec(c.text);) r || (r = new D(T.from(n.schema.text(" ", n.allowedMarks(c.marks))), 0, 0)), o.push(new Wt(s + e.index, s + e.index + e[0].length, r));
			}
		}
		s = l;
	}
	if (!r.validEnd) {
		let t = r.fillBefore(T.empty, !0);
		e.replace(s, s, new D(t, 0, 0));
	}
	for (let t = o.length - 1; t >= 0; t--) e.step(o[t]);
}
function Xt(e, t, n) {
	return (t == 0 || e.canReplace(t, e.childCount)) && (n == e.childCount || e.canReplace(0, n));
}
function Zt(e) {
	let t = e.parent.content.cutByIndex(e.startIndex, e.endIndex);
	for (let n = e.depth, r = 0, i = 0;; --n) {
		let a = e.$from.node(n), o = e.$from.index(n) + r, s = e.$to.indexAfter(n) - i;
		if (n < e.depth && a.canReplace(o, s, t)) return n;
		if (n == 0 || a.type.spec.isolating || !Xt(a, o, s)) break;
		o && (r = 1), s < a.childCount && (i = 1);
	}
	return null;
}
function Qt(e, t, n) {
	let { $from: r, $to: i, depth: a } = t, o = r.before(a + 1), s = i.after(a + 1), c = o, l = s, u = T.empty, d = 0;
	for (let e = a, t = !1; e > n; e--) t || r.index(e) > 0 ? (t = !0, u = T.from(r.node(e).copy(u)), d++) : c--;
	let f = T.empty, p = 0;
	for (let e = a, t = !1; e > n; e--) t || i.after(e + 1) < i.end(e) ? (t = !0, f = T.from(i.node(e).copy(f)), p++) : l++;
	e.step(new Gt(c, l, o, s, new D(u.append(f), d, p), u.size - d, !0));
}
function $t(e, t, n = null, r = e) {
	let i = tn(e, t), a = i && nn(r, t);
	return a ? i.map(en).concat({
		type: t,
		attrs: n
	}).concat(a.map(en)) : null;
}
function en(e) {
	return {
		type: e,
		attrs: null
	};
}
function tn(e, t) {
	let { parent: n, startIndex: r, endIndex: i } = e, a = n.contentMatchAt(r).findWrapping(t);
	if (!a) return null;
	let o = a.length ? a[0] : t;
	return n.canReplaceWith(r, i, o) ? a : null;
}
function nn(e, t) {
	let { parent: n, startIndex: r, endIndex: i } = e, a = n.child(r), o = t.contentMatch.findWrapping(a.type);
	if (!o) return null;
	let s = (o.length ? o[o.length - 1] : t).contentMatch;
	for (let e = r; s && e < i; e++) s = s.matchType(n.child(e).type);
	return !s || !s.validEnd ? null : o;
}
function rn(e, t, n) {
	let r = T.empty;
	for (let e = n.length - 1; e >= 0; e--) {
		if (r.size) {
			let t = n[e].type.contentMatch.matchFragment(r);
			if (!t || !t.validEnd) throw RangeError("Wrapper type given to Transform.wrap does not form valid content of its parent wrapper");
		}
		r = T.from(n[e].type.create(n[e].attrs, r));
	}
	let i = t.start, a = t.end;
	e.step(new Gt(i, a, i, a, new D(r, 0, 0), n.length, !0));
}
function an(e, t, n, r, i) {
	if (!r.isTextblock) throw RangeError("Type given to setBlockType should be a textblock");
	let a = e.steps.length;
	e.doc.nodesBetween(t, n, (t, n) => {
		let o = typeof i == "function" ? i(t) : i;
		if (t.isTextblock && !t.hasMarkup(r, o) && cn(e.doc, e.mapping.slice(a).map(n), r)) {
			let i = null;
			if (r.schema.linebreakReplacement) {
				let e = r.whitespace == "pre", t = !!r.contentMatch.matchType(r.schema.linebreakReplacement);
				e && !t ? i = !1 : !e && t && (i = !0);
			}
			i === !1 && sn(e, t, n, a), Yt(e, e.mapping.slice(a).map(n, 1), r, void 0, i === null);
			let s = e.mapping.slice(a), c = s.map(n, 1), l = s.map(n + t.nodeSize, 1);
			return e.step(new Gt(c, l, c + 1, l - 1, new D(T.from(r.create(o, null, t.marks)), 0, 0), 1, !0)), i === !0 && on(e, t, n, a), !1;
		}
	});
}
function on(e, t, n, r) {
	t.forEach((i, a) => {
		if (i.isText) {
			let o, s = /\r?\n|\r/g;
			for (; o = s.exec(i.text);) {
				let i = e.mapping.slice(r).map(n + 1 + a + o.index);
				e.replaceWith(i, i + 1, t.type.schema.linebreakReplacement.create());
			}
		}
	});
}
function sn(e, t, n, r) {
	t.forEach((i, a) => {
		if (i.type == i.type.schema.linebreakReplacement) {
			let i = e.mapping.slice(r).map(n + 1 + a);
			e.replaceWith(i, i + 1, t.type.schema.text("\n"));
		}
	});
}
function cn(e, t, n) {
	let r = e.resolve(t), i = r.index();
	return r.parent.canReplaceWith(i, i + 1, n);
}
function ln(e, t, n, r, i) {
	let a = e.doc.nodeAt(t);
	if (!a) throw RangeError("No node at given position");
	n || (n = a.type);
	let o = n.create(r, null, i || a.marks);
	if (a.isLeaf) return e.replaceWith(t, t + a.nodeSize, o);
	if (!n.validContent(a.content)) throw RangeError("Invalid content for node type " + n.name);
	e.step(new Gt(t, t + a.nodeSize, t + 1, t + a.nodeSize - 1, new D(T.from(o), 0, 0), 1, !0));
}
function un(e, t, n = 1, r) {
	let i = e.resolve(t), a = i.depth - n, o = r && r[r.length - 1] || i.parent;
	if (a < 0 || i.parent.type.spec.isolating || !i.parent.canReplace(i.index(), i.parent.childCount) || !o.type.validContent(i.parent.content.cutByIndex(i.index(), i.parent.childCount))) return !1;
	for (let e = i.depth - 1, t = n - 2; e > a; e--, t--) {
		let n = i.node(e), a = i.index(e);
		if (n.type.spec.isolating) return !1;
		let o = n.content.cutByIndex(a, n.childCount), s = r && r[t + 1];
		s && (o = o.replaceChild(0, s.type.create(s.attrs)));
		let c = r && r[t] || n;
		if (!n.canReplace(a + 1, n.childCount) || !c.type.validContent(o)) return !1;
	}
	let s = i.indexAfter(a), c = r && r[0];
	return i.node(a).canReplaceWith(s, s, c ? c.type : i.node(a + 1).type);
}
function dn(e, t, n = 1, r) {
	let i = e.doc.resolve(t), a = T.empty, o = T.empty;
	for (let e = i.depth, t = i.depth - n, s = n - 1; e > t; e--, s--) {
		a = T.from(i.node(e).copy(a));
		let t = r && r[s];
		o = T.from(t ? t.type.create(t.attrs, o) : i.node(e).copy(o));
	}
	e.step(new Wt(t, t, new D(a.append(o), n, n), !0));
}
function fn(e, t) {
	let n = e.resolve(t), r = n.index();
	return mn(n.nodeBefore, n.nodeAfter) && n.parent.canReplace(r, r + 1);
}
function pn(e, t) {
	t.content.size || e.type.compatibleContent(t.type);
	let n = e.contentMatchAt(e.childCount), { linebreakReplacement: r } = e.type.schema;
	for (let i = 0; i < t.childCount; i++) {
		let a = t.child(i), o = a.type == r ? e.type.schema.nodes.text : a.type;
		if (n = n.matchType(o), !n || !e.type.allowsMarks(a.marks)) return !1;
	}
	return n.validEnd;
}
function mn(e, t) {
	return !!(e && t && !e.isLeaf && pn(e, t));
}
function hn(e, t, n) {
	let r = null, { linebreakReplacement: i } = e.doc.type.schema, a = e.doc.resolve(t - n), o = a.node().type;
	if (i && o.inlineContent) {
		let e = o.whitespace == "pre", t = !!o.contentMatch.matchType(i);
		e && !t ? r = !1 : !e && t && (r = !0);
	}
	let s = e.steps.length;
	if (r === !1) {
		let r = e.doc.resolve(t + n);
		sn(e, r.node(), r.before(), s);
	}
	o.inlineContent && Yt(e, t + n - 1, o, a.node().contentMatchAt(a.index()), r == null);
	let c = e.mapping.slice(s), l = c.map(t - n);
	if (e.step(new Wt(l, c.map(t + n, -1), D.empty, !0)), r === !0) {
		let t = e.doc.resolve(l);
		on(e, t.node(), t.before(), e.steps.length);
	}
	return e;
}
function gn(e, t, n) {
	let r = e.resolve(t);
	if (r.parent.canReplaceWith(r.index(), r.index(), n)) return t;
	if (r.parentOffset == 0) for (let e = r.depth - 1; e >= 0; e--) {
		let t = r.index(e);
		if (r.node(e).canReplaceWith(t, t, n)) return r.before(e + 1);
		if (t > 0) return null;
	}
	if (r.parentOffset == r.parent.content.size) for (let e = r.depth - 1; e >= 0; e--) {
		let t = r.indexAfter(e);
		if (r.node(e).canReplaceWith(t, t, n)) return r.after(e + 1);
		if (t < r.node(e).childCount) return null;
	}
	return null;
}
function _n(e, t, n) {
	let r = e.resolve(t);
	if (!n.content.size) return t;
	let i = n.content;
	for (let e = 0; e < n.openStart; e++) i = i.firstChild.content;
	for (let e = 1; e <= (n.openStart == 0 && n.size ? 2 : 1); e++) for (let t = r.depth; t >= 0; t--) {
		let n = t == r.depth ? 0 : r.pos <= (r.start(t + 1) + r.end(t + 1)) / 2 ? -1 : 1, a = r.index(t) + +(n > 0), o = r.node(t), s = !1;
		if (e == 1) s = o.canReplace(a, a, i);
		else {
			let e = o.contentMatchAt(a).findWrapping(i.firstChild.type);
			s = e && o.canReplaceWith(a, a, e[0]);
		}
		if (s) return n == 0 ? r.pos : n < 0 ? r.before(t + 1) : r.after(t + 1);
	}
	return null;
}
function vn(e, t, n = t, r = D.empty) {
	if (t == n && !r.size) return null;
	let i = e.resolve(t), a = e.resolve(n);
	return yn(i, a, r) ? new Wt(t, n, r) : new bn(i, a, r).fit();
}
function yn(e, t, n) {
	return !n.openStart && !n.openEnd && e.start() == t.start() && e.parent.canReplace(e.index(), t.index(), n.content);
}
var bn = class {
	constructor(e, t, n) {
		this.$from = e, this.$to = t, this.unplaced = n, this.frontier = [], this.placed = T.empty;
		for (let t = 0; t <= e.depth; t++) {
			let n = e.node(t);
			this.frontier.push({
				type: n.type,
				match: n.contentMatchAt(e.indexAfter(t))
			});
		}
		for (let t = e.depth; t > 0; t--) this.placed = T.from(e.node(t).copy(this.placed));
	}
	get depth() {
		return this.frontier.length - 1;
	}
	fit() {
		for (; this.unplaced.size;) {
			let e = this.findFittable();
			e ? this.placeNodes(e) : this.openMore() || this.dropNode();
		}
		let e = this.mustMoveInline(), t = this.placed.size - this.depth - this.$from.depth, n = this.$from, r = this.close(e < 0 ? this.$to : n.doc.resolve(e));
		if (!r) return null;
		let i = this.placed, a = n.depth, o = r.depth;
		for (; a && o && i.childCount == 1;) i = i.firstChild.content, a--, o--;
		let s = new D(i, a, o);
		return e > -1 ? new Gt(n.pos, e, this.$to.pos, this.$to.end(), s, t) : s.size || n.pos != this.$to.pos ? new Wt(n.pos, r.pos, s) : null;
	}
	findFittable() {
		let e = this.unplaced.openStart;
		for (let t = this.unplaced.content, n = 0, r = this.unplaced.openEnd; n < e; n++) {
			let i = t.firstChild;
			if (t.childCount > 1 && (r = 0), i.type.spec.isolating && r <= n) {
				e = n;
				break;
			}
			t = i.content;
		}
		for (let t = 1; t <= 2; t++) for (let n = t == 1 ? e : this.unplaced.openStart; n >= 0; n--) {
			let e, r = null;
			n ? (r = Cn(this.unplaced.content, n - 1).firstChild, e = r.content) : e = this.unplaced.content;
			let i = e.firstChild;
			for (let e = this.depth; e >= 0; e--) {
				let { type: a, match: o } = this.frontier[e], s, c = null;
				if (t == 1 && (i ? o.matchType(i.type) || (c = o.fillBefore(T.from(i), !1)) : r && a.compatibleContent(r.type))) return {
					sliceDepth: n,
					frontierDepth: e,
					parent: r,
					inject: c
				};
				if (t == 2 && i && (s = o.findWrapping(i.type))) return {
					sliceDepth: n,
					frontierDepth: e,
					parent: r,
					wrap: s
				};
				if (r && o.matchType(r.type)) break;
			}
		}
	}
	openMore() {
		let { content: e, openStart: t, openEnd: n } = this.unplaced, r = Cn(e, t);
		return !r.childCount || r.firstChild.isLeaf ? !1 : (this.unplaced = new D(e, t + 1, Math.max(n, r.size + t >= e.size - n ? t + 1 : 0)), !0);
	}
	dropNode() {
		let { content: e, openStart: t, openEnd: n } = this.unplaced, r = Cn(e, t);
		if (r.childCount <= 1 && t > 0) {
			let i = e.size - t <= t + r.size;
			this.unplaced = new D(xn(e, t - 1, 1), t - 1, i ? t - 1 : n);
		} else this.unplaced = new D(xn(e, t, 1), t, n);
	}
	placeNodes({ sliceDepth: e, frontierDepth: t, parent: n, inject: r, wrap: i }) {
		for (; this.depth > t;) this.closeFrontierNode();
		if (i) for (let e = 0; e < i.length; e++) this.openFrontierNode(i[e]);
		let a = this.unplaced, o = n ? n.content : a.content, s = a.openStart - e, c = 0, l = [], { match: u, type: d } = this.frontier[t];
		if (r) {
			for (let e = 0; e < r.childCount; e++) l.push(r.child(e));
			u = u.matchFragment(r);
		}
		let f = o.size + e - (a.content.size - a.openEnd);
		for (; c < o.childCount;) {
			let e = o.child(c), t = u.matchType(e.type);
			if (!t) break;
			c++, (c > 1 || s == 0 || e.content.size) && (u = t, l.push(wn(e.mark(d.allowedMarks(e.marks)), c == 1 ? s : 0, c == o.childCount ? f : -1)));
		}
		let p = c == o.childCount;
		p || (f = -1), this.placed = Sn(this.placed, t, T.from(l)), this.frontier[t].match = u, p && f < 0 && n && n.type == this.frontier[this.depth].type && this.frontier.length > 1 && this.closeFrontierNode();
		for (let e = 0, t = o; e < f; e++) {
			let e = t.lastChild;
			this.frontier.push({
				type: e.type,
				match: e.contentMatchAt(e.childCount)
			}), t = e.content;
		}
		this.unplaced = p ? e == 0 ? D.empty : new D(xn(a.content, e - 1, 1), e - 1, f < 0 ? a.openEnd : e - 1) : new D(xn(a.content, e, c), a.openStart, a.openEnd);
	}
	mustMoveInline() {
		if (!this.$to.parent.isTextblock) return -1;
		let e = this.frontier[this.depth], t;
		if (!e.type.isTextblock || !Tn(this.$to, this.$to.depth, e.type, e.match, !1) || this.$to.depth == this.depth && (t = this.findCloseLevel(this.$to)) && t.depth == this.depth) return -1;
		let { depth: n } = this.$to, r = this.$to.after(n);
		for (; n > 1 && r == this.$to.end(--n);) ++r;
		return r;
	}
	findCloseLevel(e) {
		scan: for (let t = Math.min(this.depth, e.depth); t >= 0; t--) {
			let { match: n, type: r } = this.frontier[t], i = t < e.depth && e.end(t + 1) == e.pos + (e.depth - (t + 1)), a = Tn(e, t, r, n, i);
			if (a) {
				for (let n = t - 1; n >= 0; n--) {
					let { match: t, type: r } = this.frontier[n], i = Tn(e, n, r, t, !0);
					if (!i || i.childCount) continue scan;
				}
				return {
					depth: t,
					fit: a,
					move: i ? e.doc.resolve(e.after(t + 1)) : e
				};
			}
		}
	}
	close(e) {
		let t = this.findCloseLevel(e);
		if (!t) return null;
		for (; this.depth > t.depth;) this.closeFrontierNode();
		t.fit.childCount && (this.placed = Sn(this.placed, t.depth, t.fit)), e = t.move;
		for (let n = t.depth + 1; n <= e.depth; n++) {
			let t = e.node(n), r = t.type.contentMatch.fillBefore(t.content, !0, e.index(n));
			this.openFrontierNode(t.type, t.attrs, r);
		}
		return e;
	}
	openFrontierNode(e, t = null, n) {
		let r = this.frontier[this.depth];
		r.match = r.match.matchType(e), this.placed = Sn(this.placed, this.depth, T.from(e.create(t, n))), this.frontier.push({
			type: e,
			match: e.contentMatch
		});
	}
	closeFrontierNode() {
		let e = this.frontier.pop().match.fillBefore(T.empty, !0);
		e.childCount && (this.placed = Sn(this.placed, this.frontier.length, e));
	}
};
function xn(e, t, n) {
	return t == 0 ? e.cutByIndex(n, e.childCount) : e.replaceChild(0, e.firstChild.copy(xn(e.firstChild.content, t - 1, n)));
}
function Sn(e, t, n) {
	return t == 0 ? e.append(n) : e.replaceChild(e.childCount - 1, e.lastChild.copy(Sn(e.lastChild.content, t - 1, n)));
}
function Cn(e, t) {
	for (let n = 0; n < t; n++) e = e.firstChild.content;
	return e;
}
function wn(e, t, n) {
	if (t <= 0) return e;
	let r = e.content;
	return t > 1 && (r = r.replaceChild(0, wn(r.firstChild, t - 1, r.childCount == 1 ? n - 1 : 0))), t > 0 && (r = e.type.contentMatch.fillBefore(r).append(r), n <= 0 && (r = r.append(e.type.contentMatch.matchFragment(r).fillBefore(T.empty, !0)))), e.copy(r);
}
function Tn(e, t, n, r, i) {
	let a = e.node(t), o = i ? e.indexAfter(t) : e.index(t);
	if (o == a.childCount && !n.compatibleContent(a.type)) return null;
	let s = r.fillBefore(a.content, !0, o);
	return s && !En(n, a.content, o) ? s : null;
}
function En(e, t, n) {
	for (let r = n; r < t.childCount; r++) if (!e.allowsMarks(t.child(r).marks)) return !0;
	return !1;
}
function Dn(e) {
	return e.spec.defining || e.spec.definingForContent;
}
function On(e, t, n, r) {
	if (!r.size) return e.deleteRange(t, n);
	let i = e.doc.resolve(t), a = e.doc.resolve(n);
	if (yn(i, a, r)) return e.step(new Wt(t, n, r));
	let o = Mn(i, a);
	o[o.length - 1] == 0 && o.pop();
	let s = -(i.depth + 1);
	o.unshift(s);
	for (let e = i.depth, t = i.pos - 1; e > 0; e--, t--) {
		let n = i.node(e).type.spec;
		if (n.defining || n.definingAsContext || n.isolating) break;
		o.indexOf(e) > -1 ? s = e : i.before(e) == t && o.splice(1, 0, -e);
	}
	let c = o.indexOf(s), l = [], u = r.openStart;
	for (let e = r.content, t = 0;; t++) {
		let n = e.firstChild;
		if (l.push(n), t == r.openStart) break;
		e = n.content;
	}
	for (let e = u - 1; e >= 0; e--) {
		let t = l[e], n = Dn(t.type);
		if (n && !t.sameMarkup(i.node(Math.abs(s) - 1))) u = e;
		else if (n || !t.type.isTextblock) break;
	}
	for (let t = r.openStart; t >= 0; t--) {
		let s = (t + u + 1) % (r.openStart + 1), d = l[s];
		if (d) for (let t = 0; t < o.length; t++) {
			let l = o[(t + c) % o.length], u = !0;
			l < 0 && (u = !1, l = -l);
			let f = i.node(l - 1), p = i.index(l - 1);
			if (f.canReplaceWith(p, p, d.type, d.marks)) return e.replace(i.before(l), u ? a.after(l) : n, new D(kn(r.content, 0, r.openStart, s), s, r.openEnd));
		}
	}
	let d = e.steps.length;
	for (let s = o.length - 1; s >= 0 && (e.replace(t, n, r), !(e.steps.length > d)); s--) {
		let e = o[s];
		e < 0 || (t = i.before(e), n = a.after(e));
	}
}
function kn(e, t, n, r, i) {
	if (t < n) {
		let i = e.firstChild;
		e = e.replaceChild(0, i.copy(kn(i.content, t + 1, n, r, i)));
	}
	if (t > r) {
		let t = i.contentMatchAt(0), n = t.fillBefore(e).append(e);
		e = n.append(t.matchFragment(n).fillBefore(T.empty, !0));
	}
	return e;
}
function An(e, t, n, r) {
	if (!r.isInline && t == n && e.doc.resolve(t).parent.content.size) {
		let i = gn(e.doc, t, r.type);
		i != null && (t = n = i);
	}
	e.replaceRange(t, n, new D(T.from(r), 0, 0));
}
function jn(e, t, n) {
	let r = e.doc.resolve(t), i = e.doc.resolve(n);
	if (r.parent.isTextblock && i.parent.isTextblock && r.start() != i.start() && r.parentOffset == 0 && i.parentOffset == 0) {
		let a = r.sharedDepth(n), o = !1;
		for (let e = r.depth; e > a; e--) r.node(e).type.spec.isolating && (o = !0);
		for (let e = i.depth; e > a; e--) i.node(e).type.spec.isolating && (o = !0);
		if (!o) {
			for (let e = r.depth; e > 0 && t == r.start(e); e--) t = r.before(e);
			for (let e = i.depth; e > 0 && n == i.start(e); e--) n = i.before(e);
			r = e.doc.resolve(t), i = e.doc.resolve(n);
		}
	}
	let a = Mn(r, i);
	for (let t = 0; t < a.length; t++) {
		let n = a[t], o = t == a.length - 1;
		if (o && n == 0 || r.node(n).type.contentMatch.validEnd) return e.delete(r.start(n), i.end(n));
		if (n > 0 && (o || r.node(n - 1).canReplace(r.index(n - 1), i.indexAfter(n - 1)))) return e.delete(r.before(n), i.after(n));
	}
	for (let a = 1; a <= r.depth && a <= i.depth; a++) if (t - r.start(a) == r.depth - a && n > r.end(a) && i.end(a) - n != i.depth - a && r.start(a - 1) == i.start(a - 1) && r.node(a - 1).canReplace(r.index(a - 1), i.index(a - 1))) return e.delete(r.before(a), n);
	e.delete(t, n);
}
function Mn(e, t) {
	let n = [], r = Math.min(e.depth, t.depth);
	for (let i = r; i >= 0; i--) {
		let r = e.start(i);
		if (r < e.pos - (e.depth - i) || t.end(i) > t.pos + (t.depth - i) || e.node(i).type.spec.isolating || t.node(i).type.spec.isolating) break;
		(r == t.start(i) || i == e.depth && i == t.depth && e.parent.inlineContent && t.parent.inlineContent && i && t.start(i - 1) == r - 1) && n.push(i);
	}
	return n;
}
var Nn = class e extends Lt {
	constructor(e, t, n) {
		super(), this.pos = e, this.attr = t, this.value = n;
	}
	apply(e) {
		let t = e.nodeAt(this.pos);
		if (!t) return Rt.fail("No node at attribute step's position");
		let n = Object.create(null);
		for (let e in t.attrs) n[e] = t.attrs[e];
		n[this.attr] = this.value;
		let r = t.type.create(n, null, t.marks);
		return Rt.fromReplace(e, this.pos, this.pos + 1, new D(T.from(r), 0, +!t.isLeaf));
	}
	getMap() {
		return Pt.empty;
	}
	invert(t) {
		return new e(this.pos, this.attr, t.nodeAt(this.pos).attrs[this.attr]);
	}
	map(t) {
		let n = t.mapResult(this.pos, 1);
		return n.deletedAfter ? null : new e(n.pos, this.attr, this.value);
	}
	toJSON() {
		return {
			stepType: "attr",
			pos: this.pos,
			attr: this.attr,
			value: this.value
		};
	}
	static fromJSON(t, n) {
		if (typeof n.pos != "number" || typeof n.attr != "string") throw RangeError("Invalid input for AttrStep.fromJSON");
		return new e(n.pos, n.attr, n.value);
	}
};
Lt.jsonID("attr", Nn);
var Pn = class e extends Lt {
	constructor(e, t) {
		super(), this.attr = e, this.value = t;
	}
	apply(e) {
		let t = Object.create(null);
		for (let n in e.attrs) t[n] = e.attrs[n];
		t[this.attr] = this.value;
		let n = e.type.create(t, e.content, e.marks);
		return Rt.ok(n);
	}
	getMap() {
		return Pt.empty;
	}
	invert(t) {
		return new e(this.attr, t.attrs[this.attr]);
	}
	map(e) {
		return this;
	}
	toJSON() {
		return {
			stepType: "docAttr",
			attr: this.attr,
			value: this.value
		};
	}
	static fromJSON(t, n) {
		if (typeof n.attr != "string") throw RangeError("Invalid input for DocAttrStep.fromJSON");
		return new e(n.attr, n.value);
	}
};
Lt.jsonID("docAttr", Pn);
var Fn = class extends Error {};
Fn = function e(t) {
	let n = Error.call(this, t);
	return n.__proto__ = e.prototype, n;
}, Fn.prototype = Object.create(Error.prototype), Fn.prototype.constructor = Fn, Fn.prototype.name = "TransformError";
var In = class {
	constructor(e) {
		this.doc = e, this.steps = [], this.docs = [], this.mapping = new Ft();
	}
	get before() {
		return this.docs.length ? this.docs[0] : this.doc;
	}
	step(e) {
		let t = this.maybeStep(e);
		if (t.failed) throw new Fn(t.failed);
		return this;
	}
	maybeStep(e) {
		let t = e.apply(this.doc);
		return t.failed || this.addStep(e, t.doc), t;
	}
	get docChanged() {
		return this.steps.length > 0;
	}
	changedRange() {
		let e = 1e9, t = -1e9;
		for (let n = 0; n < this.mapping.maps.length; n++) {
			let r = this.mapping.maps[n];
			n && (e = r.map(e, 1), t = r.map(t, -1)), r.forEach((n, r, i, a) => {
				e = Math.min(e, i), t = Math.max(t, a);
			});
		}
		return e == 1e9 ? null : {
			from: e,
			to: t
		};
	}
	addStep(e, t) {
		this.docs.push(this.doc), this.steps.push(e), this.mapping.appendMap(e.getMap()), this.doc = t;
	}
	replace(e, t = e, n = D.empty) {
		let r = vn(this.doc, e, t, n);
		return r && this.step(r), this;
	}
	replaceWith(e, t, n) {
		return this.replace(e, t, new D(T.from(n), 0, 0));
	}
	delete(e, t) {
		return this.replace(e, t, D.empty);
	}
	insert(e, t) {
		return this.replaceWith(e, e, t);
	}
	replaceRange(e, t, n) {
		return On(this, e, t, n), this;
	}
	replaceRangeWith(e, t, n) {
		return An(this, e, t, n), this;
	}
	deleteRange(e, t) {
		return jn(this, e, t), this;
	}
	lift(e, t) {
		return Qt(this, e, t), this;
	}
	join(e, t = 1) {
		return hn(this, e, t), this;
	}
	wrap(e, t) {
		return rn(this, e, t), this;
	}
	setBlockType(e, t = e, n, r = null) {
		return an(this, e, t, n, r), this;
	}
	setNodeMarkup(e, t, n = null, r) {
		return ln(this, e, t, n, r), this;
	}
	setNodeAttribute(e, t, n) {
		return this.step(new Nn(e, t, n)), this;
	}
	setDocAttribute(e, t) {
		return this.step(new Pn(e, t)), this;
	}
	addNodeMark(e, t) {
		return this.step(new Ht(e, t)), this;
	}
	removeNodeMark(e, t) {
		let n = this.doc.nodeAt(e);
		if (!n) throw RangeError("No node at position " + e);
		if (t instanceof E) t.isInSet(n.marks) && this.step(new Ut(e, t));
		else {
			let r = n.marks, i, a = [];
			for (; i = t.isInSet(r);) a.push(new Ut(e, i)), r = i.removeFromSet(r);
			for (let e = a.length - 1; e >= 0; e--) this.step(a[e]);
		}
		return this;
	}
	split(e, t = 1, n) {
		return dn(this, e, t, n), this;
	}
	addMark(e, t, n) {
		return qt(this, e, t, n), this;
	}
	removeMark(e, t, n) {
		return Jt(this, e, t, n), this;
	}
	clearIncompatible(e, t, n) {
		return Yt(this, e, t, n), this;
	}
}, Ln = Object.create(null), A = class {
	constructor(e, t, n) {
		this.$anchor = e, this.$head = t, this.ranges = n || [new Rn(e.min(t), e.max(t))];
	}
	get anchor() {
		return this.$anchor.pos;
	}
	get head() {
		return this.$head.pos;
	}
	get from() {
		return this.$from.pos;
	}
	get to() {
		return this.$to.pos;
	}
	get $from() {
		return this.ranges[0].$from;
	}
	get $to() {
		return this.ranges[0].$to;
	}
	get empty() {
		let e = this.ranges;
		for (let t = 0; t < e.length; t++) if (e[t].$from.pos != e[t].$to.pos) return !1;
		return !0;
	}
	content() {
		return this.$from.doc.slice(this.from, this.to, !0);
	}
	replace(e, t = D.empty) {
		let n = t.content.lastChild, r = null;
		for (let e = 0; e < t.openEnd; e++) r = n, n = n.lastChild;
		let i = e.steps.length, a = this.ranges;
		for (let o = 0; o < a.length; o++) {
			let { $from: s, $to: c } = a[o], l = e.mapping.slice(i);
			e.replaceRange(l.map(s.pos), l.map(c.pos), o ? D.empty : t), o == 0 && Kn(e, i, (n ? n.isInline : r && r.isTextblock) ? -1 : 1);
		}
	}
	replaceWith(e, t) {
		let n = e.steps.length, r = this.ranges;
		for (let i = 0; i < r.length; i++) {
			let { $from: a, $to: o } = r[i], s = e.mapping.slice(n), c = s.map(a.pos), l = s.map(o.pos);
			i ? e.deleteRange(c, l) : (e.replaceRangeWith(c, l, t), Kn(e, n, t.isInline ? -1 : 1));
		}
	}
	static findFrom(e, t, n = !1) {
		let r = e.parent.inlineContent ? new j(e) : Gn(e.node(0), e.parent, e.pos, e.index(), t, n);
		if (r) return r;
		for (let r = e.depth - 1; r >= 0; r--) {
			let i = t < 0 ? Gn(e.node(0), e.node(r), e.before(r + 1), e.index(r), t, n) : Gn(e.node(0), e.node(r), e.after(r + 1), e.index(r) + 1, t, n);
			if (i) return i;
		}
		return null;
	}
	static near(e, t = 1) {
		return this.findFrom(e, t) || this.findFrom(e, -t) || new Un(e.node(0));
	}
	static atStart(e) {
		return Gn(e, e, 0, 0, 1) || new Un(e);
	}
	static atEnd(e) {
		return Gn(e, e, e.content.size, e.childCount, -1) || new Un(e);
	}
	static fromJSON(e, t) {
		if (!t || !t.type) throw RangeError("Invalid input for Selection.fromJSON");
		let n = Ln[t.type];
		if (!n) throw RangeError(`No selection type ${t.type} defined`);
		return n.fromJSON(e, t);
	}
	static jsonID(e, t) {
		if (e in Ln) throw RangeError("Duplicate use of selection JSON ID " + e);
		return Ln[e] = t, t.prototype.jsonID = e, t;
	}
	getBookmark() {
		return j.between(this.$anchor, this.$head).getBookmark();
	}
};
A.prototype.visible = !0;
var Rn = class {
	constructor(e, t) {
		this.$from = e, this.$to = t;
	}
}, zn = !1;
function Bn(e) {
	!zn && !e.parent.inlineContent && (zn = !0, console.warn("TextSelection endpoint not pointing into a node with inline content (" + e.parent.type.name + ")"));
}
var j = class e extends A {
	constructor(e, t = e) {
		Bn(e), Bn(t), super(e, t);
	}
	get $cursor() {
		return this.$anchor.pos == this.$head.pos ? this.$head : null;
	}
	map(t, n) {
		let r = t.resolve(n.map(this.head));
		if (!r.parent.inlineContent) return A.near(r);
		let i = t.resolve(n.map(this.anchor));
		return new e(i.parent.inlineContent ? i : r, r);
	}
	replace(e, t = D.empty) {
		if (super.replace(e, t), t == D.empty) {
			let t = this.$from.marksAcross(this.$to);
			t && e.ensureMarks(t);
		}
	}
	eq(t) {
		return t instanceof e && t.anchor == this.anchor && t.head == this.head;
	}
	getBookmark() {
		return new Vn(this.anchor, this.head);
	}
	toJSON() {
		return {
			type: "text",
			anchor: this.anchor,
			head: this.head
		};
	}
	static fromJSON(t, n) {
		if (typeof n.anchor != "number" || typeof n.head != "number") throw RangeError("Invalid input for TextSelection.fromJSON");
		return new e(t.resolve(n.anchor), t.resolve(n.head));
	}
	static create(e, t, n = t) {
		let r = e.resolve(t);
		return new this(r, n == t ? r : e.resolve(n));
	}
	static between(t, n, r) {
		let i = t.pos - n.pos;
		if ((!r || i) && (r = i >= 0 ? 1 : -1), !n.parent.inlineContent) {
			let e = A.findFrom(n, r, !0) || A.findFrom(n, -r, !0);
			if (e) n = e.$head;
			else return A.near(n, r);
		}
		return t.parent.inlineContent || (i == 0 ? t = n : (t = (A.findFrom(t, -r, !0) || A.findFrom(t, r, !0)).$anchor, t.pos < n.pos != i < 0 && (t = n))), new e(t, n);
	}
};
A.jsonID("text", j);
var Vn = class e {
	constructor(e, t) {
		this.anchor = e, this.head = t;
	}
	map(t) {
		return new e(t.map(this.anchor), t.map(this.head));
	}
	resolve(e) {
		return j.between(e.resolve(this.anchor), e.resolve(this.head));
	}
}, M = class e extends A {
	constructor(e) {
		let t = e.nodeAfter, n = e.node(0).resolve(e.pos + t.nodeSize);
		super(e, n), this.node = t;
	}
	map(t, n) {
		let { deleted: r, pos: i } = n.mapResult(this.anchor), a = t.resolve(i);
		return r ? A.near(a) : new e(a);
	}
	content() {
		return new D(T.from(this.node), 0, 0);
	}
	eq(t) {
		return t instanceof e && t.anchor == this.anchor;
	}
	toJSON() {
		return {
			type: "node",
			anchor: this.anchor
		};
	}
	getBookmark() {
		return new Hn(this.anchor);
	}
	static fromJSON(t, n) {
		if (typeof n.anchor != "number") throw RangeError("Invalid input for NodeSelection.fromJSON");
		return new e(t.resolve(n.anchor));
	}
	static create(t, n) {
		return new e(t.resolve(n));
	}
	static isSelectable(e) {
		return !e.isText && e.type.spec.selectable !== !1;
	}
};
M.prototype.visible = !1, A.jsonID("node", M);
var Hn = class e {
	constructor(e) {
		this.anchor = e;
	}
	map(t) {
		let { deleted: n, pos: r } = t.mapResult(this.anchor);
		return n ? new Vn(r, r) : new e(r);
	}
	resolve(e) {
		let t = e.resolve(this.anchor), n = t.nodeAfter;
		return n && M.isSelectable(n) ? new M(t) : A.near(t);
	}
}, Un = class e extends A {
	constructor(e) {
		super(e.resolve(0), e.resolve(e.content.size));
	}
	replace(e, t = D.empty) {
		if (t == D.empty) {
			e.delete(0, e.doc.content.size);
			let t = A.atStart(e.doc);
			t.eq(e.selection) || e.setSelection(t);
		} else super.replace(e, t);
	}
	toJSON() {
		return { type: "all" };
	}
	static fromJSON(t) {
		return new e(t);
	}
	map(t) {
		return new e(t);
	}
	eq(t) {
		return t instanceof e;
	}
	getBookmark() {
		return Wn;
	}
};
A.jsonID("all", Un);
var Wn = {
	map() {
		return this;
	},
	resolve(e) {
		return new Un(e);
	}
};
function Gn(e, t, n, r, i, a = !1) {
	if (t.inlineContent) return j.create(e, n);
	for (let o = r - (i > 0 ? 0 : 1); i > 0 ? o < t.childCount : o >= 0; o += i) {
		let r = t.child(o);
		if (!r.isAtom) {
			let t = Gn(e, r, n + i, i < 0 ? r.childCount : 0, i, a);
			if (t) return t;
		} else if (!a && M.isSelectable(r)) return M.create(e, n - (i < 0 ? r.nodeSize : 0));
		n += r.nodeSize * i;
	}
	return null;
}
function Kn(e, t, n) {
	let r = e.steps.length - 1;
	if (r < t) return;
	let i = e.steps[r];
	if (!(i instanceof Wt || i instanceof Gt)) return;
	let a = e.mapping.maps[r], o;
	a.forEach((e, t, n, r) => {
		o == null && (o = r);
	}), e.setSelection(A.near(e.doc.resolve(o), n));
}
var qn = 1, Jn = 2, Yn = 4, Xn = class extends In {
	constructor(e) {
		super(e.doc), this.curSelectionFor = 0, this.updated = 0, this.meta = Object.create(null), this.time = Date.now(), this.curSelection = e.selection, this.storedMarks = e.storedMarks;
	}
	get selection() {
		return this.curSelectionFor < this.steps.length && (this.curSelection = this.curSelection.map(this.doc, this.mapping.slice(this.curSelectionFor)), this.curSelectionFor = this.steps.length), this.curSelection;
	}
	setSelection(e) {
		if (e.$from.doc != this.doc) throw RangeError("Selection passed to setSelection must point at the current document");
		return this.curSelection = e, this.curSelectionFor = this.steps.length, this.updated = (this.updated | qn) & -3, this.storedMarks = null, this;
	}
	get selectionSet() {
		return (this.updated & qn) > 0;
	}
	setStoredMarks(e) {
		return this.storedMarks = e, this.updated |= Jn, this;
	}
	ensureMarks(e) {
		return E.sameSet(this.storedMarks || this.selection.$from.marks(), e) || this.setStoredMarks(e), this;
	}
	addStoredMark(e) {
		return this.ensureMarks(e.addToSet(this.storedMarks || this.selection.$head.marks()));
	}
	removeStoredMark(e) {
		return this.ensureMarks(e.removeFromSet(this.storedMarks || this.selection.$head.marks()));
	}
	get storedMarksSet() {
		return (this.updated & Jn) > 0;
	}
	addStep(e, t) {
		super.addStep(e, t), this.updated &= -3, this.storedMarks = null;
	}
	setTime(e) {
		return this.time = e, this;
	}
	replaceSelection(e) {
		return this.selection.replace(this, e), this;
	}
	replaceSelectionWith(e, t = !0) {
		let n = this.selection;
		return t && (e = e.mark(this.storedMarks || (n.empty ? n.$from.marks() : n.$from.marksAcross(n.$to) || E.none))), n.replaceWith(this, e), this;
	}
	deleteSelection() {
		return this.selection.replace(this), this;
	}
	insertText(e, t, n) {
		let r = this.doc.type.schema;
		if (t == null) return e ? this.replaceSelectionWith(r.text(e), !0) : this.deleteSelection();
		{
			if (n == null && (n = t), !e) return this.deleteRange(t, n);
			let i = this.storedMarks;
			if (!i) {
				let e = this.doc.resolve(t);
				i = n == t ? e.marks() : e.marksAcross(this.doc.resolve(n));
			}
			return this.replaceRangeWith(t, n, r.text(e, i)), !this.selection.empty && this.selection.to == t + e.length && this.setSelection(A.near(this.selection.$to)), this;
		}
	}
	setMeta(e, t) {
		return this.meta[typeof e == "string" ? e : e.key] = t, this;
	}
	getMeta(e) {
		return this.meta[typeof e == "string" ? e : e.key];
	}
	get isGeneric() {
		for (let e in this.meta) return !1;
		return !0;
	}
	scrollIntoView() {
		return this.updated |= Yn, this;
	}
	get scrolledIntoView() {
		return (this.updated & Yn) > 0;
	}
};
function Zn(e, t) {
	return !t || !e ? e : e.bind(t);
}
var Qn = class {
	constructor(e, t, n) {
		this.name = e, this.init = Zn(t.init, n), this.apply = Zn(t.apply, n);
	}
}, $n = [
	new Qn("doc", {
		init(e) {
			return e.doc || e.schema.topNodeType.createAndFill();
		},
		apply(e) {
			return e.doc;
		}
	}),
	new Qn("selection", {
		init(e, t) {
			return e.selection || A.atStart(t.doc);
		},
		apply(e) {
			return e.selection;
		}
	}),
	new Qn("storedMarks", {
		init(e) {
			return e.storedMarks || null;
		},
		apply(e, t, n, r) {
			return r.selection.$cursor ? e.storedMarks : null;
		}
	}),
	new Qn("scrollToSelection", {
		init() {
			return 0;
		},
		apply(e, t) {
			return e.scrolledIntoView ? t + 1 : t;
		}
	})
], er = class {
	constructor(e, t) {
		this.schema = e, this.plugins = [], this.pluginsByKey = Object.create(null), this.fields = $n.slice(), t && t.forEach((e) => {
			if (this.pluginsByKey[e.key]) throw RangeError("Adding different instances of a keyed plugin (" + e.key + ")");
			this.plugins.push(e), this.pluginsByKey[e.key] = e, e.spec.state && this.fields.push(new Qn(e.key, e.spec.state, e));
		});
	}
}, tr = class e {
	constructor(e) {
		this.config = e;
	}
	get schema() {
		return this.config.schema;
	}
	get plugins() {
		return this.config.plugins;
	}
	apply(e) {
		return this.applyTransaction(e).state;
	}
	filterTransaction(e, t = -1) {
		for (let n = 0; n < this.config.plugins.length; n++) if (n != t) {
			let t = this.config.plugins[n];
			if (t.spec.filterTransaction && !t.spec.filterTransaction.call(t, e, this)) return !1;
		}
		return !0;
	}
	applyTransaction(e) {
		if (!this.filterTransaction(e)) return {
			state: this,
			transactions: []
		};
		let t = [e], n = this.applyInner(e), r = null;
		for (;;) {
			let i = !1;
			for (let a = 0; a < this.config.plugins.length; a++) {
				let o = this.config.plugins[a];
				if (o.spec.appendTransaction) {
					let s = r ? r[a].n : 0, c = r ? r[a].state : this, l = s < t.length && o.spec.appendTransaction.call(o, s ? t.slice(s) : t, c, n);
					if (l && n.filterTransaction(l, a)) {
						if (l.setMeta("appendedTransaction", e), !r) {
							r = [];
							for (let e = 0; e < this.config.plugins.length; e++) r.push(e < a ? {
								state: n,
								n: t.length
							} : {
								state: this,
								n: 0
							});
						}
						t.push(l), n = n.applyInner(l), i = !0;
					}
					r && (r[a] = {
						state: n,
						n: t.length
					});
				}
			}
			if (!i) return {
				state: n,
				transactions: t
			};
		}
	}
	applyInner(t) {
		if (!t.before.eq(this.doc)) throw RangeError("Applying a mismatched transaction");
		let n = new e(this.config), r = this.config.fields;
		for (let e = 0; e < r.length; e++) {
			let i = r[e];
			n[i.name] = i.apply(t, this[i.name], this, n);
		}
		return n;
	}
	get tr() {
		return new Xn(this);
	}
	static create(t) {
		let n = new er(t.doc ? t.doc.type.schema : t.schema, t.plugins), r = new e(n);
		for (let e = 0; e < n.fields.length; e++) r[n.fields[e].name] = n.fields[e].init(t, r);
		return r;
	}
	reconfigure(t) {
		let n = new er(this.schema, t.plugins), r = n.fields, i = new e(n);
		for (let e = 0; e < r.length; e++) {
			let n = r[e].name;
			i[n] = this.hasOwnProperty(n) ? this[n] : r[e].init(t, i);
		}
		return i;
	}
	toJSON(e) {
		let t = {
			doc: this.doc.toJSON(),
			selection: this.selection.toJSON()
		};
		if (this.storedMarks && (t.storedMarks = this.storedMarks.map((e) => e.toJSON())), e && typeof e == "object") for (let n in e) {
			if (n == "doc" || n == "selection") throw RangeError("The JSON fields `doc` and `selection` are reserved");
			let r = e[n], i = r.spec.state;
			i && i.toJSON && (t[n] = i.toJSON.call(r, this[r.key]));
		}
		return t;
	}
	static fromJSON(t, n, r) {
		if (!n) throw RangeError("Invalid input for EditorState.fromJSON");
		if (!t.schema) throw RangeError("Required config field 'schema' missing");
		let i = new er(t.schema, t.plugins), a = new e(i);
		return i.fields.forEach((e) => {
			if (e.name == "doc") a.doc = ke.fromJSON(t.schema, n.doc);
			else if (e.name == "selection") a.selection = A.fromJSON(a.doc, n.selection);
			else if (e.name == "storedMarks") n.storedMarks && (a.storedMarks = n.storedMarks.map(t.schema.markFromJSON));
			else {
				if (r) for (let i in r) {
					let o = r[i], s = o.spec.state;
					if (o.key == e.name && s && s.fromJSON && Object.prototype.hasOwnProperty.call(n, i)) {
						a[e.name] = s.fromJSON.call(o, t, n[i], a);
						return;
					}
				}
				a[e.name] = e.init(t, a);
			}
		}), a;
	}
};
function nr(e, t, n) {
	for (let r in e) {
		let i = e[r];
		i instanceof Function ? i = i.bind(t) : r == "handleDOMEvents" && (i = nr(i, t, {})), n[r] = i;
	}
	return n;
}
var rr = class {
	constructor(e) {
		this.spec = e, this.props = {}, e.props && nr(e.props, this, this.props), this.key = e.key ? e.key.key : ar("plugin");
	}
	getState(e) {
		return e[this.key];
	}
}, ir = Object.create(null);
function ar(e) {
	return e in ir ? e + "$" + ++ir[e] : (ir[e] = 0, e + "$");
}
var or = class {
	constructor(e = "key") {
		this.key = ar(e);
	}
	get(e) {
		return e.config.pluginsByKey[this.key];
	}
	getState(e) {
		return e[this.key];
	}
}, sr = function(e) {
	for (var t = 0;; t++) if (e = e.previousSibling, !e) return t;
}, cr = function(e) {
	let t = e.assignedSlot || e.parentNode;
	return t && t.nodeType == 11 ? t.host : t;
}, lr = null, ur = function(e, t, n) {
	let r = lr || (lr = document.createRange());
	return r.setEnd(e, n == null ? e.nodeValue.length : n), r.setStart(e, t || 0), r;
}, dr = function() {
	lr = null;
}, fr = function(e, t, n, r) {
	return n && (mr(e, t, n, r, -1) || mr(e, t, n, r, 1));
}, pr = /^(img|br|input|textarea|hr)$/i;
function mr(e, t, n, r, i) {
	for (var a;;) {
		if (e == n && t == r) return !0;
		if (t == (i < 0 ? 0 : hr(e))) {
			let n = e.parentNode;
			if (!n || n.nodeType != 1 || yr(e) || pr.test(e.nodeName) || e.contentEditable == "false") return !1;
			t = sr(e) + (i < 0 ? 0 : 1), e = n;
		} else if (e.nodeType == 1) {
			let n = e.childNodes[t + (i < 0 ? -1 : 0)];
			if (n.nodeType == 1 && n.contentEditable == "false") {
				if ((a = n.pmViewDesc) != null && a.ignoreForSelection) t += i;
				else return !1;
			} else e = n, t = i < 0 ? hr(e) : 0;
		} else return !1;
	}
}
function hr(e) {
	return e.nodeType == 3 ? e.nodeValue.length : e.childNodes.length;
}
function gr(e, t) {
	for (;;) {
		if (e.nodeType == 3 && t) return e;
		if (e.nodeType == 1 && t > 0) {
			if (e.contentEditable == "false") return null;
			e = e.childNodes[t - 1], t = hr(e);
		} else if (e.parentNode && !yr(e)) t = sr(e), e = e.parentNode;
		else return null;
	}
}
function _r(e, t) {
	for (;;) {
		if (e.nodeType == 3 && t < e.nodeValue.length) return e;
		if (e.nodeType == 1 && t < e.childNodes.length) {
			if (e.contentEditable == "false") return null;
			e = e.childNodes[t], t = 0;
		} else if (e.parentNode && !yr(e)) t = sr(e) + 1, e = e.parentNode;
		else return null;
	}
}
function vr(e, t, n) {
	for (let r = t == 0, i = t == hr(e); r || i;) {
		if (e == n) return !0;
		let t = sr(e);
		if (e = e.parentNode, !e) return !1;
		r = r && t == 0, i = i && t == hr(e);
	}
}
function yr(e) {
	let t;
	for (let n = e; n && !(t = n.pmViewDesc); n = n.parentNode);
	return t && t.node && t.node.isBlock && (t.dom == e || t.contentDOM == e);
}
var br = function(e) {
	return e.focusNode && fr(e.focusNode, e.focusOffset, e.anchorNode, e.anchorOffset);
};
function xr(e, t) {
	let n = document.createEvent("Event");
	return n.initEvent("keydown", !0, !0), n.keyCode = e, n.key = n.code = t, n;
}
function Sr(e) {
	let t = e.activeElement;
	for (; t && t.shadowRoot;) t = t.shadowRoot.activeElement;
	return t;
}
function Cr(e, t, n) {
	if (e.caretPositionFromPoint) try {
		let r = e.caretPositionFromPoint(t, n);
		if (r) return {
			node: r.offsetNode,
			offset: Math.min(hr(r.offsetNode), r.offset)
		};
	} catch (e) {}
	if (e.caretRangeFromPoint) {
		let r = e.caretRangeFromPoint(t, n);
		if (r) return {
			node: r.startContainer,
			offset: Math.min(hr(r.startContainer), r.startOffset)
		};
	}
}
var wr = typeof navigator < "u" ? navigator : null, Tr = typeof document < "u" ? document : null, Er = wr && wr.userAgent || "", Dr = /Edge\/(\d+)/.exec(Er), Or = /MSIE \d/.exec(Er), kr = /Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(Er), Ar = !!(Or || kr || Dr), jr = Or ? document.documentMode : kr ? +kr[1] : Dr ? +Dr[1] : 0, Mr = !Ar && /gecko\/(\d+)/i.test(Er);
Mr && +(/Firefox\/(\d+)/.exec(Er) || [0, 0])[1];
var Nr = !Ar && /Chrome\/(\d+)/.exec(Er), Pr = !!Nr, Fr = Nr ? +Nr[1] : 0, Ir = !Ar && !!wr && /Apple Computer/.test(wr.vendor), Lr = Ir && (/Mobile\/\w+/.test(Er) || !!wr && wr.maxTouchPoints > 2), Rr = Lr || (wr ? /Mac/.test(wr.platform) : !1), zr = wr ? /Win/.test(wr.platform) : !1, Br = /Android \d/.test(Er), Vr = !!Tr && "webkitFontSmoothing" in Tr.documentElement.style, Hr = Vr ? +(/\bAppleWebKit\/(\d+)/.exec(navigator.userAgent) || [0, 0])[1] : 0;
function Ur(e) {
	let t = e.defaultView && e.defaultView.visualViewport;
	return t ? {
		left: 0,
		right: t.width,
		top: 0,
		bottom: t.height
	} : {
		left: 0,
		right: e.documentElement.clientWidth,
		top: 0,
		bottom: e.documentElement.clientHeight
	};
}
function Wr(e, t) {
	return typeof e == "number" ? e : e[t];
}
function Gr(e) {
	let t = e.getBoundingClientRect(), n = t.width / e.offsetWidth || 1, r = t.height / e.offsetHeight || 1;
	return {
		left: t.left,
		right: t.left + e.clientWidth * n,
		top: t.top,
		bottom: t.top + e.clientHeight * r
	};
}
function Kr(e, t, n) {
	let r = e.someProp("scrollThreshold") || 0, i = e.someProp("scrollMargin") || 5, a = e.dom.ownerDocument;
	for (let o = n || e.dom; o;) {
		if (o.nodeType != 1) {
			o = cr(o);
			continue;
		}
		let e = o, n = e == a.body, s = n ? Ur(a) : Gr(e), c = 0, l = 0;
		if (t.top < s.top + Wr(r, "top") ? l = -(s.top - t.top + Wr(i, "top")) : t.bottom > s.bottom - Wr(r, "bottom") && (l = t.bottom - t.top > s.bottom - s.top ? t.top + Wr(i, "top") - s.top : t.bottom - s.bottom + Wr(i, "bottom")), t.left < s.left + Wr(r, "left") ? c = -(s.left - t.left + Wr(i, "left")) : t.right > s.right - Wr(r, "right") && (c = t.right - s.right + Wr(i, "right")), c || l) {
			if (n) a.defaultView.scrollBy(c, l);
			else {
				let n = e.scrollLeft, r = e.scrollTop;
				l && (e.scrollTop += l), c && (e.scrollLeft += c);
				let i = e.scrollLeft - n, a = e.scrollTop - r;
				t = {
					left: t.left - i,
					top: t.top - a,
					right: t.right - i,
					bottom: t.bottom - a
				};
			}
		}
		let u = n ? "fixed" : getComputedStyle(o).position;
		if (/^(fixed|sticky)$/.test(u)) break;
		o = u == "absolute" ? o.offsetParent : cr(o);
	}
}
function qr(e) {
	let t = e.dom.getBoundingClientRect(), n = Math.max(0, t.top), r, i;
	for (let a = (t.left + t.right) / 2, o = n + 1; o < Math.min(innerHeight, t.bottom); o += 5) {
		let t = e.root.elementFromPoint(a, o);
		if (!t || t == e.dom || !e.dom.contains(t)) continue;
		let s = t.getBoundingClientRect();
		if (s.top >= n - 20) {
			r = t, i = s.top;
			break;
		}
	}
	return {
		refDOM: r,
		refTop: i,
		stack: Jr(e.dom)
	};
}
function Jr(e) {
	let t = [], n = e.ownerDocument;
	for (let r = e; r && (t.push({
		dom: r,
		top: r.scrollTop,
		left: r.scrollLeft
	}), e != n); r = cr(r));
	return t;
}
function Yr({ refDOM: e, refTop: t, stack: n }) {
	let r = e ? e.getBoundingClientRect().top : 0;
	Xr(n, r == 0 ? 0 : r - t);
}
function Xr(e, t) {
	for (let n = 0; n < e.length; n++) {
		let { dom: r, top: i, left: a } = e[n];
		r.scrollTop != i + t && (r.scrollTop = i + t), r.scrollLeft != a && (r.scrollLeft = a);
	}
}
var Zr = null;
function Qr(e) {
	if (e.setActive) return e.setActive();
	if (Zr) return e.focus(Zr);
	let t = Jr(e);
	e.focus(Zr == null ? { get preventScroll() {
		return Zr = { preventScroll: !0 }, !0;
	} } : void 0), Zr || (Zr = !1, Xr(t, 0));
}
function $r(e, t) {
	let n, r = 2e8, i, a = 0, o = t.top, s = t.top, c, l;
	for (let u = e.firstChild, d = 0; u; u = u.nextSibling, d++) {
		let e;
		if (u.nodeType == 1) e = u.getClientRects();
		else if (u.nodeType == 3) e = ur(u).getClientRects();
		else continue;
		for (let f = 0; f < e.length; f++) {
			let p = e[f];
			if (p.top <= o && p.bottom >= s) {
				o = Math.max(p.bottom, o), s = Math.min(p.top, s);
				let e = p.left > t.left ? p.left - t.left : p.right < t.left ? t.left - p.right : 0;
				if (e < r) {
					n = u, r = e, i = e && n.nodeType == 3 ? {
						left: p.right < t.left ? p.right : p.left,
						top: t.top
					} : t, u.nodeType == 1 && e && (a = d + +(t.left >= (p.left + p.right) / 2));
					continue;
				}
			} else p.top > t.top && !c && p.left <= t.left && p.right >= t.left && (c = u, l = {
				left: Math.max(p.left, Math.min(p.right, t.left)),
				top: p.top
			});
			!n && (t.left >= p.right && t.top >= p.top || t.left >= p.left && t.top >= p.bottom) && (a = d + 1);
		}
	}
	return !n && c && (n = c, i = l, r = 0), n && n.nodeType == 3 ? ei(n, i) : !n || r && n.nodeType == 1 ? {
		node: e,
		offset: a
	} : $r(n, i);
}
function ei(e, t) {
	let n = e.nodeValue.length, r = document.createRange(), i;
	for (let a = 0; a < n; a++) {
		r.setEnd(e, a + 1), r.setStart(e, a);
		let n = ci(r, 1);
		if (n.top != n.bottom && ti(t, n)) {
			i = {
				node: e,
				offset: a + +(t.left >= (n.left + n.right) / 2)
			};
			break;
		}
	}
	return r.detach(), i || {
		node: e,
		offset: 0
	};
}
function ti(e, t) {
	return e.left >= t.left - 1 && e.left <= t.right + 1 && e.top >= t.top - 1 && e.top <= t.bottom + 1;
}
function ni(e, t) {
	let n = e.parentNode;
	return n && /^li$/i.test(n.nodeName) && t.left < e.getBoundingClientRect().left ? n : e;
}
function ri(e, t, n) {
	let { node: r, offset: i } = $r(t, n), a = -1;
	if (r.nodeType == 1 && !r.firstChild) {
		let e = r.getBoundingClientRect();
		a = e.left != e.right && n.left > (e.left + e.right) / 2 ? 1 : -1;
	}
	return e.docView.posFromDOM(r, i, a);
}
function ii(e, t, n, r) {
	let i = -1;
	for (let n = t, a = !1; n != e.dom;) {
		let t = e.docView.nearestDesc(n, !0), o;
		if (!t) return null;
		if (t.dom.nodeType == 1 && (t.node.isBlock && t.parent || !t.contentDOM) && ((o = t.dom.getBoundingClientRect()).width || o.height) && (t.node.isBlock && t.parent && !/^T(R|BODY|HEAD|FOOT)$/.test(t.dom.nodeName) && (!a && o.left > r.left || o.top > r.top ? i = t.posBefore : (!a && o.right < r.left || o.bottom < r.top) && (i = t.posAfter), a = !0), !t.contentDOM && i < 0 && !t.node.isText)) return (t.node.isBlock ? r.top < (o.top + o.bottom) / 2 : r.left < (o.left + o.right) / 2) ? t.posBefore : t.posAfter;
		n = t.dom.parentNode;
	}
	return i > -1 ? i : e.docView.posFromDOM(t, n, -1);
}
function ai(e, t, n) {
	let r = e.childNodes.length;
	if (r && n.top < n.bottom) for (let i = Math.max(0, Math.min(r - 1, Math.floor(r * (t.top - n.top) / (n.bottom - n.top)) - 2)), a = i;;) {
		let n = e.childNodes[a];
		if (n.nodeType == 1) {
			let e = n.getClientRects();
			for (let r = 0; r < e.length; r++) {
				let i = e[r];
				if (ti(t, i)) return ai(n, t, i);
			}
		}
		if ((a = (a + 1) % r) == i) break;
	}
	return e;
}
function oi(e, t) {
	let n = e.dom.ownerDocument, r, i = 0, a = Cr(n, t.left, t.top);
	a && ({node: r, offset: i} = a);
	let o = (e.root.elementFromPoint ? e.root : n).elementFromPoint(t.left, t.top), s;
	if (!o || !e.dom.contains(o.nodeType == 1 ? o : o.parentNode)) {
		let n = e.dom.getBoundingClientRect();
		if (!ti(t, n) || (o = ai(e.dom, t, n), !o)) return null;
	}
	if (Ir) for (let e = o; r && e; e = cr(e)) e.draggable && (r = void 0);
	if (o = ni(o, t), r) {
		if (Mr && r.nodeType == 1 && (i = Math.min(i, r.childNodes.length), i < r.childNodes.length)) {
			let e = r.childNodes[i], n;
			e.nodeName == "IMG" && (n = e.getBoundingClientRect()).right <= t.left && n.bottom > t.top && i++;
		}
		let n;
		Vr && i && r.nodeType == 1 && (n = r.childNodes[i - 1]).nodeType == 1 && n.contentEditable == "false" && n.getBoundingClientRect().top >= t.top && i--, r == e.dom && i == r.childNodes.length - 1 && r.lastChild.nodeType == 1 && t.top > r.lastChild.getBoundingClientRect().bottom ? s = e.state.doc.content.size : (i == 0 || r.nodeType != 1 || r.childNodes[i - 1].nodeName != "BR") && (s = ii(e, r, i, t));
	}
	s == null && (s = ri(e, o, t));
	let c = e.docView.nearestDesc(o, !0);
	return {
		pos: s,
		inside: c ? c.posAtStart - c.border : -1
	};
}
function si(e) {
	return e.top < e.bottom || e.left < e.right;
}
function ci(e, t) {
	let n = e.getClientRects();
	if (n.length) {
		let e = n[t < 0 ? 0 : n.length - 1];
		if (si(e)) return e;
	}
	return Array.prototype.find.call(n, si) || e.getBoundingClientRect();
}
var li = /[\u0590-\u05f4\u0600-\u06ff\u0700-\u08ac]/;
function ui(e, t, n) {
	let { node: r, offset: i, atom: a } = e.docView.domFromPos(t, n < 0 ? -1 : 1), o = Vr || Mr;
	if (r.nodeType == 3) {
		if (o && (li.test(r.nodeValue) || (n < 0 ? !i : i == r.nodeValue.length))) {
			let e = ci(ur(r, i, i), n);
			if (Mr && i && /\s/.test(r.nodeValue[i - 1]) && i < r.nodeValue.length) {
				let t = ci(ur(r, i - 1, i - 1), -1);
				if (t.top == e.top) {
					let n = ci(ur(r, i, i + 1), -1);
					if (n.top != e.top) return di(n, n.left < t.left);
				}
			}
			return e;
		}
		{
			let e = i, t = i, a = n < 0 ? 1 : -1;
			return n < 0 && !i ? (t++, a = -1) : n >= 0 && i == r.nodeValue.length ? (e--, a = 1) : n < 0 ? e-- : t++, di(ci(ur(r, e, t), a), a < 0);
		}
	}
	if (!e.state.doc.resolve(t - (a || 0)).parent.inlineContent) {
		if (a == null && i && (n < 0 || i == hr(r))) {
			let e = r.childNodes[i - 1];
			if (e.nodeType == 1) return fi(e.getBoundingClientRect(), !1);
		}
		if (a == null && i < hr(r)) {
			let e = r.childNodes[i];
			if (e.nodeType == 1) return fi(e.getBoundingClientRect(), !0);
		}
		return fi(r.getBoundingClientRect(), n >= 0);
	}
	if (a == null && i && (n < 0 || i == hr(r))) {
		let e = r.childNodes[i - 1], t = e.nodeType == 3 ? ur(e, hr(e) - +!o) : e.nodeType == 1 && (e.nodeName != "BR" || !e.nextSibling) ? e : null;
		if (t) return di(ci(t, 1), !1);
	}
	if (a == null && i < hr(r)) {
		let e = r.childNodes[i];
		for (; e.pmViewDesc && e.pmViewDesc.ignoreForCoords;) e = e.nextSibling;
		let t = e ? e.nodeType == 3 ? ur(e, 0, +!o) : e.nodeType == 1 ? e : null : null;
		if (t) return di(ci(t, -1), !0);
	}
	return di(ci(r.nodeType == 3 ? ur(r) : r, -n), n >= 0);
}
function di(e, t) {
	if (e.width == 0) return e;
	let n = t ? e.left : e.right;
	return {
		top: e.top,
		bottom: e.bottom,
		left: n,
		right: n
	};
}
function fi(e, t) {
	if (e.height == 0) return e;
	let n = t ? e.top : e.bottom;
	return {
		top: n,
		bottom: n,
		left: e.left,
		right: e.right
	};
}
function pi(e, t, n) {
	let r = e.state, i = e.root.activeElement;
	r != t && e.updateState(t), i != e.dom && e.focus();
	try {
		return n();
	} finally {
		r != t && e.updateState(r), i != e.dom && i && i.focus();
	}
}
function mi(e, t, n) {
	let r = t.selection, i = n == "up" ? r.$from : r.$to;
	return pi(e, t, () => {
		let { node: t } = e.docView.domFromPos(i.pos, n == "up" ? -1 : 1);
		for (;;) {
			let n = e.docView.nearestDesc(t, !0);
			if (!n) break;
			if (n.node.isBlock) {
				t = n.contentDOM || n.dom;
				break;
			}
			t = n.dom.parentNode;
		}
		let r = ui(e, i.pos, 1);
		for (let e = t.firstChild; e; e = e.nextSibling) {
			let t;
			if (e.nodeType == 1) t = e.getClientRects();
			else if (e.nodeType == 3) t = ur(e, 0, e.nodeValue.length).getClientRects();
			else continue;
			for (let e = 0; e < t.length; e++) {
				let i = t[e];
				if (i.bottom > i.top + 1 && (n == "up" ? r.top - i.top > (i.bottom - r.top) * 2 : i.bottom - r.bottom > (r.bottom - i.top) * 2)) return !1;
			}
		}
		return !0;
	});
}
var hi = /[\u0590-\u08ac]/;
function gi(e, t, n) {
	let { $head: r } = t.selection;
	if (!r.parent.isTextblock) return !1;
	let i = r.parentOffset, a = !i, o = i == r.parent.content.size, s = e.domSelection();
	return s ? !hi.test(r.parent.textContent) || !s.modify ? n == "left" || n == "backward" ? a : o : pi(e, t, () => {
		let { focusNode: t, focusOffset: i, anchorNode: a, anchorOffset: o } = e.domSelectionRange(), c = s.caretBidiLevel;
		s.modify("move", n, "character");
		let l = r.depth ? e.docView.domAfterPos(r.before()) : e.dom, { focusNode: u, focusOffset: d } = e.domSelectionRange(), f = u && !l.contains(u.nodeType == 1 ? u : u.parentNode) || t == u && i == d;
		try {
			s.collapse(a, o), t && (t != a || i != o) && s.extend && s.extend(t, i);
		} catch (e) {}
		return c != null && (s.caretBidiLevel = c), f;
	}) : r.pos == r.start() || r.pos == r.end();
}
var _i = null, vi = null, yi = !1;
function bi(e, t, n) {
	return _i == t && vi == n ? yi : (_i = t, vi = n, yi = n == "up" || n == "down" ? mi(e, t, n) : gi(e, t, n));
}
var xi = 0, Si = 1, Ci = 2, wi = 3, Ti = class {
	constructor(e, t, n, r) {
		this.parent = e, this.children = t, this.dom = n, this.contentDOM = r, this.dirty = xi, n.pmViewDesc = this;
	}
	matchesWidget(e) {
		return !1;
	}
	matchesMark(e) {
		return !1;
	}
	matchesNode(e, t, n) {
		return !1;
	}
	matchesHack(e) {
		return !1;
	}
	parseRule() {
		return null;
	}
	stopEvent(e) {
		return !1;
	}
	get size() {
		let e = 0;
		for (let t = 0; t < this.children.length; t++) e += this.children[t].size;
		return e;
	}
	get border() {
		return 0;
	}
	destroy() {
		this.parent = void 0, this.dom.pmViewDesc == this && (this.dom.pmViewDesc = void 0);
		for (let e = 0; e < this.children.length; e++) this.children[e].destroy();
	}
	posBeforeChild(e) {
		for (let t = 0, n = this.posAtStart;; t++) {
			let r = this.children[t];
			if (r == e) return n;
			n += r.size;
		}
	}
	get posBefore() {
		return this.parent.posBeforeChild(this);
	}
	get posAtStart() {
		return this.parent ? this.parent.posBeforeChild(this) + this.border : 0;
	}
	get posAfter() {
		return this.posBefore + this.size;
	}
	get posAtEnd() {
		return this.posAtStart + this.size - 2 * this.border;
	}
	localPosFromDOM(e, t, n) {
		if (this.contentDOM && this.contentDOM.contains(e.nodeType == 1 ? e : e.parentNode)) {
			if (n < 0) {
				let n, r;
				if (e == this.contentDOM) n = e.childNodes[t - 1];
				else {
					for (; e.parentNode != this.contentDOM;) e = e.parentNode;
					n = e.previousSibling;
				}
				for (; n && !((r = n.pmViewDesc) && r.parent == this);) n = n.previousSibling;
				return n ? this.posBeforeChild(r) + r.size : this.posAtStart;
			}
			{
				let n, r;
				if (e == this.contentDOM) n = e.childNodes[t];
				else {
					for (; e.parentNode != this.contentDOM;) e = e.parentNode;
					n = e.nextSibling;
				}
				for (; n && !((r = n.pmViewDesc) && r.parent == this);) n = n.nextSibling;
				return n ? this.posBeforeChild(r) : this.posAtEnd;
			}
		}
		let r;
		if (e == this.dom && this.contentDOM) r = t > sr(this.contentDOM);
		else if (this.contentDOM && this.contentDOM != this.dom && this.dom.contains(this.contentDOM)) r = e.compareDocumentPosition(this.contentDOM) & 2;
		else if (this.dom.firstChild) {
			if (t == 0) for (let t = e;; t = t.parentNode) {
				if (t == this.dom) {
					r = !1;
					break;
				}
				if (t.previousSibling) break;
			}
			if (r == null && t == e.childNodes.length) for (let t = e;; t = t.parentNode) {
				if (t == this.dom) {
					r = !0;
					break;
				}
				if (t.nextSibling) break;
			}
		}
		return (r == null ? n > 0 : r) ? this.posAtEnd : this.posAtStart;
	}
	nearestDesc(e, t = !1) {
		for (let n = !0, r = e; r; r = r.parentNode) {
			let i = this.getDesc(r), a;
			if (i && (!t || i.node)) {
				if (n && (a = i.nodeDOM) && !(a.nodeType == 1 ? a.contains(e.nodeType == 1 ? e : e.parentNode) : a == e)) n = !1;
				else return i;
			}
		}
	}
	getDesc(e) {
		let t = e.pmViewDesc;
		for (let e = t; e; e = e.parent) if (e == this) return t;
	}
	posFromDOM(e, t, n) {
		for (let r = e; r; r = r.parentNode) {
			let i = this.getDesc(r);
			if (i) return i.localPosFromDOM(e, t, n);
		}
		return -1;
	}
	descAt(e) {
		for (let t = 0, n = 0; t < this.children.length; t++) {
			let r = this.children[t], i = n + r.size;
			if (n == e && i != n) {
				for (; !r.border && r.children.length;) for (let e = 0; e < r.children.length; e++) {
					let t = r.children[e];
					if (t.size) {
						r = t;
						break;
					}
				}
				return r;
			}
			if (e < i) return r.descAt(e - n - r.border);
			n = i;
		}
	}
	domFromPos(e, t) {
		if (!this.contentDOM) return {
			node: this.dom,
			offset: 0,
			atom: e + 1
		};
		let n = 0, r = 0;
		for (let t = 0; n < this.children.length; n++) {
			let i = this.children[n], a = t + i.size;
			if (a > e || i instanceof Mi) {
				r = e - t;
				break;
			}
			t = a;
		}
		if (r) return this.children[n].domFromPos(r - this.children[n].border, t);
		for (let e; n && !(e = this.children[n - 1]).size && e instanceof Ei && e.side >= 0; n--);
		if (t <= 0) {
			let e, r = !0;
			for (; e = n ? this.children[n - 1] : null, !(!e || e.dom.parentNode == this.contentDOM); n--, r = !1);
			return e && t && r && !e.border && !e.domAtom ? e.domFromPos(e.size, t) : {
				node: this.contentDOM,
				offset: e ? sr(e.dom) + 1 : 0
			};
		}
		{
			let e, r = !0;
			for (; e = n < this.children.length ? this.children[n] : null, !(!e || e.dom.parentNode == this.contentDOM); n++, r = !1);
			return e && r && !e.border && !e.domAtom ? e.domFromPos(0, t) : {
				node: this.contentDOM,
				offset: e ? sr(e.dom) : this.contentDOM.childNodes.length
			};
		}
	}
	parseRange(e, t, n = 0) {
		if (this.children.length == 0) return {
			node: this.contentDOM,
			from: e,
			to: t,
			fromOffset: 0,
			toOffset: this.contentDOM.childNodes.length
		};
		let r = -1, i = -1;
		for (let a = n, o = 0;; o++) {
			let n = this.children[o], s = a + n.size;
			if (r == -1 && e <= s) {
				let i = a + n.border;
				if (e >= i && t <= s - n.border && n.node && n.contentDOM && this.contentDOM.contains(n.contentDOM)) return n.parseRange(e, t, i);
				e = a;
				for (let t = o; t > 0; t--) {
					let n = this.children[t - 1];
					if (n.size && n.dom.parentNode == this.contentDOM && !n.emptyChildAt(1)) {
						r = sr(n.dom) + 1;
						break;
					}
					e -= n.size;
				}
				r == -1 && (r = 0);
			}
			if (r > -1 && (s > t || o == this.children.length - 1)) {
				t = s;
				for (let e = o + 1; e < this.children.length; e++) {
					let n = this.children[e];
					if (n.size && n.dom.parentNode == this.contentDOM && !n.emptyChildAt(-1)) {
						i = sr(n.dom);
						break;
					}
					t += n.size;
				}
				i == -1 && (i = this.contentDOM.childNodes.length);
				break;
			}
			a = s;
		}
		return {
			node: this.contentDOM,
			from: e,
			to: t,
			fromOffset: r,
			toOffset: i
		};
	}
	emptyChildAt(e) {
		if (this.border || !this.contentDOM || !this.children.length) return !1;
		let t = this.children[e < 0 ? 0 : this.children.length - 1];
		return t.size == 0 || t.emptyChildAt(e);
	}
	domAfterPos(e) {
		let { node: t, offset: n } = this.domFromPos(e, 0);
		if (t.nodeType != 1 || n == t.childNodes.length) throw RangeError("No node after pos " + e);
		return t.childNodes[n];
	}
	setSelection(e, t, n, r = !1) {
		let i = Math.min(e, t), a = Math.max(e, t);
		for (let o = 0, s = 0; o < this.children.length; o++) {
			let c = this.children[o], l = s + c.size;
			if (i > s && a < l) return c.setSelection(e - s - c.border, t - s - c.border, n, r);
			s = l;
		}
		let o = this.domFromPos(e, e ? -1 : 1), s = t == e ? o : this.domFromPos(t, t ? -1 : 1), c = n.root.getSelection(), l = n.domSelectionRange(), u = !1;
		if ((Mr || Ir) && e == t) {
			let { node: e, offset: t } = o;
			if (e.nodeType == 3) {
				if (u = !!(t && e.nodeValue[t - 1] == "\n"), u && t == e.nodeValue.length) for (let t = e, n; t; t = t.parentNode) {
					if (n = t.nextSibling) {
						n.nodeName == "BR" && (o = s = {
							node: n.parentNode,
							offset: sr(n) + 1
						});
						break;
					}
					let e = t.pmViewDesc;
					if (e && e.node && e.node.isBlock) break;
				}
			} else {
				let n = e.childNodes[t - 1];
				u = n && (n.nodeName == "BR" || n.contentEditable == "false");
			}
		}
		if (Mr && l.focusNode && l.focusNode != s.node && l.focusNode.nodeType == 1) {
			let e = l.focusNode.childNodes[l.focusOffset];
			e && e.contentEditable == "false" && (r = !0);
		}
		if (!(r || u && Ir) && fr(o.node, o.offset, l.anchorNode, l.anchorOffset) && fr(s.node, s.offset, l.focusNode, l.focusOffset)) return;
		let d = !1;
		if ((c.extend || e == t) && !(u && Mr)) {
			c.collapse(o.node, o.offset);
			try {
				e != t && c.extend(s.node, s.offset), d = !0;
			} catch (e) {}
		}
		if (!d) {
			if (e > t) {
				let e = o;
				o = s, s = e;
			}
			let n = document.createRange();
			n.setEnd(s.node, s.offset), n.setStart(o.node, o.offset), c.removeAllRanges(), c.addRange(n);
		}
	}
	ignoreMutation(e) {
		return !this.contentDOM && e.type != "selection";
	}
	get contentLost() {
		return this.contentDOM && this.contentDOM != this.dom && !this.dom.contains(this.contentDOM);
	}
	markDirty(e, t) {
		for (let n = 0, r = 0; r < this.children.length; r++) {
			let i = this.children[r], a = n + i.size;
			if (n == a ? e <= a && t >= n : e < a && t > n) {
				let r = n + i.border, o = a - i.border;
				if (e >= r && t <= o) {
					this.dirty = e == n || t == a ? Ci : Si, e == r && t == o && (i.contentLost || i.dom.parentNode != this.contentDOM) ? i.dirty = wi : i.markDirty(e - r, t - r);
					return;
				}
				i.dirty = i.dom == i.contentDOM && i.dom.parentNode == this.contentDOM && !i.children.length ? Ci : wi;
			}
			n = a;
		}
		this.dirty = Ci;
	}
	markParentsDirty() {
		let e = 1;
		for (let t = this.parent; t; t = t.parent, e++) {
			let n = e == 1 ? Ci : Si;
			t.dirty < n && (t.dirty = n);
		}
	}
	get domAtom() {
		return !1;
	}
	get ignoreForCoords() {
		return !1;
	}
	get ignoreForSelection() {
		return !1;
	}
	isText(e) {
		return !1;
	}
}, Ei = class extends Ti {
	constructor(e, t, n, r) {
		let i, a = t.type.toDOM;
		if (typeof a == "function" && (a = a(n, () => {
			if (!i) return r;
			if (i.parent) return i.parent.posBeforeChild(i);
		})), !t.type.spec.raw) {
			if (a.nodeType != 1) {
				let e = document.createElement("span");
				e.appendChild(a), a = e;
			}
			a.contentEditable = "false", a.classList.add("ProseMirror-widget");
		}
		super(e, [], a, null), this.widget = t, this.widget = t, i = this;
	}
	matchesWidget(e) {
		return this.dirty == xi && e.type.eq(this.widget.type);
	}
	parseRule() {
		return { ignore: !0 };
	}
	stopEvent(e) {
		let t = this.widget.spec.stopEvent;
		return t ? t(e) : !1;
	}
	ignoreMutation(e) {
		return e.type != "selection" || this.widget.spec.ignoreSelection;
	}
	destroy() {
		this.widget.type.destroy(this.dom), super.destroy();
	}
	get domAtom() {
		return !0;
	}
	get ignoreForSelection() {
		return !!this.widget.type.spec.relaxedSide;
	}
	get side() {
		return this.widget.type.side;
	}
}, Di = class extends Ti {
	constructor(e, t, n, r) {
		super(e, [], t, null), this.textDOM = n, this.text = r;
	}
	get size() {
		return this.text.length;
	}
	localPosFromDOM(e, t) {
		return e == this.textDOM ? this.posAtStart + t : this.posAtStart + (t ? this.size : 0);
	}
	domFromPos(e) {
		return {
			node: this.textDOM,
			offset: e
		};
	}
	ignoreMutation(e) {
		return e.type === "characterData" && e.target.nodeValue == e.oldValue;
	}
}, Oi = class e extends Ti {
	constructor(e, t, n, r, i) {
		super(e, [], n, r), this.mark = t, this.spec = i;
	}
	static create(t, n, r, i) {
		let a = i.nodeViews[n.type.name], o = a && a(n, i, r);
		return (!o || !o.dom) && (o = _t.renderSpec(document, n.type.spec.toDOM(n, r), null, n.attrs)), new e(t, n, o.dom, o.contentDOM || o.dom, o);
	}
	parseRule() {
		return this.dirty & wi || this.mark.type.spec.reparseInView ? null : {
			mark: this.mark.type.name,
			attrs: this.mark.attrs,
			contentElement: this.contentDOM
		};
	}
	matchesMark(e) {
		return this.dirty != wi && this.mark.eq(e);
	}
	markDirty(e, t) {
		if (super.markDirty(e, t), this.dirty != xi) {
			let e = this.parent;
			for (; !e.node;) e = e.parent;
			e.dirty < this.dirty && (e.dirty = this.dirty), this.dirty = xi;
		}
	}
	slice(t, n, r) {
		let i = e.create(this.parent, this.mark, !0, r), a = this.children, o = this.size;
		n < o && (a = Yi(a, n, o, r)), t > 0 && (a = Yi(a, 0, t, r));
		for (let e = 0; e < a.length; e++) a[e].parent = i;
		return i.children = a, i;
	}
	ignoreMutation(e) {
		return this.spec.ignoreMutation ? this.spec.ignoreMutation(e) : super.ignoreMutation(e);
	}
	destroy() {
		this.spec.destroy && this.spec.destroy(), super.destroy();
	}
}, ki = class e extends Ti {
	constructor(e, t, n, r, i, a, o, s, c) {
		super(e, [], i, a), this.node = t, this.outerDeco = n, this.innerDeco = r, this.nodeDOM = o;
	}
	static create(t, n, r, i, a, o) {
		let s = a.nodeViews[n.type.name], c, l = s && s(n, a, () => {
			if (!c) return o;
			if (c.parent) return c.parent.posBeforeChild(c);
		}, r, i), u = l && l.dom, d = l && l.contentDOM;
		if (n.isText) {
			if (!u) u = document.createTextNode(n.text);
			else if (u.nodeType != 3) throw RangeError("Text must be rendered as a DOM text node");
		} else if (!u) {
			let e = _t.renderSpec(document, n.type.spec.toDOM(n), null, n.attrs);
			({dom: u, contentDOM: d} = e);
		}
		!d && !n.isText && u.nodeName != "BR" && (u.hasAttribute("contenteditable") || (u.contentEditable = "false"), n.type.spec.draggable && (u.draggable = !0));
		let f = u;
		return u = Bi(u, r, n), l ? c = new Ni(t, n, r, i, u, d || null, f, l, a, o + 1) : n.isText ? new ji(t, n, r, i, u, f, a) : new e(t, n, r, i, u, d || null, f, a, o + 1);
	}
	parseRule() {
		if (this.node.type.spec.reparseInView) return null;
		let e = {
			node: this.node.type.name,
			attrs: this.node.attrs
		};
		if (this.node.type.whitespace == "pre" && (e.preserveWhitespace = "full"), !this.contentDOM) e.getContent = () => this.node.content;
		else if (!this.contentLost) e.contentElement = this.contentDOM;
		else {
			for (let t = this.children.length - 1; t >= 0; t--) {
				let n = this.children[t];
				if (this.dom.contains(n.dom.parentNode)) {
					e.contentElement = n.dom.parentNode;
					break;
				}
			}
			e.contentElement || (e.getContent = () => T.empty);
		}
		return e;
	}
	matchesNode(e, t, n) {
		return this.dirty == xi && e.eq(this.node) && Vi(t, this.outerDeco) && n.eq(this.innerDeco);
	}
	get size() {
		return this.node.nodeSize;
	}
	get border() {
		return +!this.node.isLeaf;
	}
	updateChildren(e, t) {
		let n = this.node.inlineContent, r = t, i = e.composing ? this.localCompositionInfo(e, t) : null, a = i && i.pos > -1 ? i : null, o = i && i.pos < 0, s = new Ui(this, a && a.node, e);
		Ki(this.node, this.innerDeco, (t, i, a) => {
			t.spec.marks ? s.syncToMarks(t.spec.marks, n, e, i) : t.type.side >= 0 && !a && s.syncToMarks(i == this.node.childCount ? E.none : this.node.child(i).marks, n, e, i), s.placeWidget(t, e, r);
		}, (t, a, c, l) => {
			s.syncToMarks(t.marks, n, e, l);
			let u;
			s.findNodeMatch(t, a, c, l) || o && e.state.selection.from > r && e.state.selection.to < r + t.nodeSize && (u = s.findIndexWithChild(i.node)) > -1 && s.updateNodeAt(t, a, c, u, e) || s.updateNextNode(t, a, c, e, l, r) || s.addNode(t, a, c, e, r), r += t.nodeSize;
		}), s.syncToMarks([], n, e, 0), this.node.isTextblock && s.addTextblockHacks(), s.destroyRest(), (s.changed || this.dirty == Ci) && (a && this.protectLocalComposition(e, a), Pi(this.contentDOM, this.children, e), Lr && qi(this.dom));
	}
	localCompositionInfo(e, t) {
		let { from: n, to: r } = e.state.selection;
		if (!(e.state.selection instanceof j) || n < t || r > t + this.node.content.size) return null;
		let i = e.input.compositionNode;
		if (!i || !this.dom.contains(i.parentNode)) return null;
		if (this.node.inlineContent) {
			let e = i.nodeValue, a = Ji(this.node.content, e, n - t, r - t);
			return a < 0 ? null : {
				node: i,
				pos: a,
				text: e
			};
		}
		return {
			node: i,
			pos: -1,
			text: ""
		};
	}
	protectLocalComposition(e, { node: t, pos: n, text: r }) {
		if (this.getDesc(t)) return;
		let i = t;
		for (; i.parentNode != this.contentDOM; i = i.parentNode) {
			for (; i.previousSibling;) i.parentNode.removeChild(i.previousSibling);
			for (; i.nextSibling;) i.parentNode.removeChild(i.nextSibling);
			i.pmViewDesc && (i.pmViewDesc = void 0);
		}
		let a = new Di(this, i, t, r);
		e.input.compositionNodes.push(a), this.children = Yi(this.children, n, n + r.length, e, a);
	}
	update(e, t, n, r) {
		return this.dirty == wi || !e.sameMarkup(this.node) ? !1 : (this.updateInner(e, t, n, r), !0);
	}
	updateInner(e, t, n, r) {
		this.updateOuterDeco(t), this.node = e, this.innerDeco = n, this.contentDOM && this.updateChildren(r, this.posAtStart), this.dirty = xi;
	}
	updateOuterDeco(e) {
		if (Vi(e, this.outerDeco)) return;
		let t = this.nodeDOM.nodeType != 1, n = this.dom;
		this.dom = Ri(this.dom, this.nodeDOM, Li(this.outerDeco, this.node, t), Li(e, this.node, t)), this.dom != n && (n.pmViewDesc = void 0, this.dom.pmViewDesc = this), this.outerDeco = e;
	}
	selectNode() {
		this.nodeDOM.nodeType == 1 && (this.nodeDOM.classList.add("ProseMirror-selectednode"), (this.contentDOM || !this.node.type.spec.draggable) && (this.nodeDOM.draggable = !0));
	}
	deselectNode() {
		this.nodeDOM.nodeType == 1 && (this.nodeDOM.classList.remove("ProseMirror-selectednode"), (this.contentDOM || !this.node.type.spec.draggable) && this.nodeDOM.removeAttribute("draggable"));
	}
	get domAtom() {
		return this.node.isAtom;
	}
};
function Ai(e, t, n, r, i) {
	Bi(r, t, e);
	let a = new ki(void 0, e, t, n, r, r, r, i, 0);
	return a.contentDOM && a.updateChildren(i, 0), a;
}
var ji = class e extends ki {
	constructor(e, t, n, r, i, a, o) {
		super(e, t, n, r, i, null, a, o, 0);
	}
	parseRule() {
		let e = this.nodeDOM.parentNode;
		for (; e && e != this.dom && !e.pmIsDeco;) e = e.parentNode;
		return { skip: e || !0 };
	}
	update(e, t, n, r) {
		return this.dirty == wi || this.dirty != xi && !this.inParent() || !e.sameMarkup(this.node) ? !1 : (this.updateOuterDeco(t), (this.dirty != xi || e.text != this.node.text) && e.text != this.nodeDOM.nodeValue && (this.nodeDOM.nodeValue = e.text, r.trackWrites == this.nodeDOM && (r.trackWrites = null)), this.node = e, this.dirty = xi, !0);
	}
	inParent() {
		let e = this.parent.contentDOM;
		for (let t = this.nodeDOM; t; t = t.parentNode) if (t == e) return !0;
		return !1;
	}
	domFromPos(e) {
		return {
			node: this.nodeDOM,
			offset: e
		};
	}
	localPosFromDOM(e, t, n) {
		return e == this.nodeDOM ? this.posAtStart + Math.min(t, this.node.text.length) : super.localPosFromDOM(e, t, n);
	}
	ignoreMutation(e) {
		return e.type != "characterData" && e.type != "selection";
	}
	slice(t, n, r) {
		let i = this.node.cut(t, n), a = document.createTextNode(i.text);
		return new e(this.parent, i, this.outerDeco, this.innerDeco, a, a, r);
	}
	markDirty(e, t) {
		super.markDirty(e, t), this.dom != this.nodeDOM && (e == 0 || t == this.nodeDOM.nodeValue.length) && (this.dirty = wi);
	}
	get domAtom() {
		return !1;
	}
	isText(e) {
		return this.node.text == e;
	}
}, Mi = class extends Ti {
	parseRule() {
		return { ignore: !0 };
	}
	matchesHack(e) {
		return this.dirty == xi && this.dom.nodeName == e;
	}
	get domAtom() {
		return !0;
	}
	get ignoreForCoords() {
		return this.dom.nodeName == "IMG";
	}
}, Ni = class extends ki {
	constructor(e, t, n, r, i, a, o, s, c, l) {
		super(e, t, n, r, i, a, o, c, l), this.spec = s;
	}
	update(e, t, n, r) {
		if (this.dirty == wi) return !1;
		if (this.spec.update && (this.node.type == e.type || this.spec.multiType)) {
			let i = this.spec.update(e, t, n);
			return i && this.updateInner(e, t, n, r), i;
		}
		return !this.contentDOM && !e.isLeaf ? !1 : super.update(e, t, n, r);
	}
	selectNode() {
		this.spec.selectNode ? this.spec.selectNode() : super.selectNode();
	}
	deselectNode() {
		this.spec.deselectNode ? this.spec.deselectNode() : super.deselectNode();
	}
	setSelection(e, t, n, r) {
		this.spec.setSelection ? this.spec.setSelection(e, t, n.root) : super.setSelection(e, t, n, r);
	}
	destroy() {
		this.spec.destroy && this.spec.destroy(), super.destroy();
	}
	stopEvent(e) {
		return this.spec.stopEvent ? this.spec.stopEvent(e) : !1;
	}
	ignoreMutation(e) {
		return this.spec.ignoreMutation ? this.spec.ignoreMutation(e) : super.ignoreMutation(e);
	}
};
function Pi(e, t, n) {
	let r = e.firstChild, i = !1;
	for (let a = 0; a < t.length; a++) {
		let o = t[a], s = o.dom;
		if (s.parentNode == e) {
			for (; s != r;) r = Hi(r), i = !0;
			r = r.nextSibling;
		} else i = !0, e.insertBefore(s, r);
		if (o instanceof Oi) {
			let t = r ? r.previousSibling : e.lastChild;
			Pi(o.contentDOM, o.children, n), r = t ? t.nextSibling : e.firstChild;
		}
	}
	for (; r;) r = Hi(r), i = !0;
	i && n.trackWrites == e && (n.trackWrites = null);
}
var Fi = function(e) {
	e && (this.nodeName = e);
};
Fi.prototype = Object.create(null);
var Ii = [new Fi()];
function Li(e, t, n) {
	if (e.length == 0) return Ii;
	let r = n ? Ii[0] : new Fi(), i = [r];
	for (let a = 0; a < e.length; a++) {
		let o = e[a].type.attrs;
		if (o) {
			o.nodeName && i.push(r = new Fi(o.nodeName));
			for (let e in o) {
				let a = o[e];
				a != null && (n && i.length == 1 && i.push(r = new Fi(t.isInline ? "span" : "div")), e == "class" ? r.class = (r.class ? r.class + " " : "") + a : e == "style" ? r.style = (r.style ? r.style + ";" : "") + a : e != "nodeName" && (r[e] = a));
			}
		}
	}
	return i;
}
function Ri(e, t, n, r) {
	if (n == Ii && r == Ii) return t;
	let i = t;
	for (let t = 0; t < r.length; t++) {
		let a = r[t], o = n[t];
		if (t) {
			let t;
			o && o.nodeName == a.nodeName && i != e && (t = i.parentNode) && t.nodeName.toLowerCase() == a.nodeName ? i = t : (t = document.createElement(a.nodeName), t.pmIsDeco = !0, t.appendChild(i), o = Ii[0], i = t);
		}
		zi(i, o || Ii[0], a);
	}
	return i;
}
function zi(e, t, n) {
	for (let r in t) r != "class" && r != "style" && r != "nodeName" && !(r in n) && e.removeAttribute(r);
	for (let r in n) r != "class" && r != "style" && r != "nodeName" && n[r] != t[r] && e.setAttribute(r, n[r]);
	if (t.class != n.class) {
		let r = t.class ? t.class.split(" ").filter(Boolean) : [], i = n.class ? n.class.split(" ").filter(Boolean) : [];
		for (let t = 0; t < r.length; t++) i.indexOf(r[t]) == -1 && e.classList.remove(r[t]);
		for (let t = 0; t < i.length; t++) r.indexOf(i[t]) == -1 && e.classList.add(i[t]);
		e.classList.length == 0 && e.removeAttribute("class");
	}
	if (t.style != n.style) {
		if (t.style) {
			let n = /\s*([\w\-\xa1-\uffff]+)\s*:(?:"(?:\\.|[^"])*"|'(?:\\.|[^'])*'|\(.*?\)|[^;])*/g, r;
			for (; r = n.exec(t.style);) e.style.removeProperty(r[1]);
		}
		n.style && (e.style.cssText += n.style);
	}
}
function Bi(e, t, n) {
	return Ri(e, e, Ii, Li(t, n, e.nodeType != 1));
}
function Vi(e, t) {
	if (e.length != t.length) return !1;
	for (let n = 0; n < e.length; n++) if (!e[n].type.eq(t[n].type)) return !1;
	return !0;
}
function Hi(e) {
	let t = e.nextSibling;
	return e.parentNode.removeChild(e), t;
}
var Ui = class {
	constructor(e, t, n) {
		this.lock = t, this.view = n, this.index = 0, this.stack = [], this.changed = !1, this.top = e, this.preMatch = Wi(e.node.content, e);
	}
	destroyBetween(e, t) {
		if (e != t) {
			for (let n = e; n < t; n++) this.top.children[n].destroy();
			this.top.children.splice(e, t - e), this.changed = !0;
		}
	}
	destroyRest() {
		this.destroyBetween(this.index, this.top.children.length);
	}
	syncToMarks(e, t, n, r) {
		let i = 0, a = this.stack.length >> 1, o = Math.min(a, e.length);
		for (; i < o && (i == a - 1 ? this.top : this.stack[i + 1 << 1]).matchesMark(e[i]) && e[i].type.spec.spanning !== !1;) i++;
		for (; i < a;) this.destroyRest(), this.top.dirty = xi, this.index = this.stack.pop(), this.top = this.stack.pop(), a--;
		for (; a < e.length;) {
			this.stack.push(this.top, this.index + 1);
			let i = -1, o = this.top.children.length;
			r < this.preMatch.index && (o = Math.min(this.index + 3, o));
			for (let t = this.index; t < o; t++) {
				let n = this.top.children[t];
				if (n.matchesMark(e[a]) && !this.isLocked(n.dom)) {
					i = t;
					break;
				}
			}
			if (i > -1) i > this.index && (this.changed = !0, this.destroyBetween(this.index, i)), this.top = this.top.children[this.index];
			else {
				let r = Oi.create(this.top, e[a], t, n);
				this.top.children.splice(this.index, 0, r), this.top = r, this.changed = !0;
			}
			this.index = 0, a++;
		}
	}
	findNodeMatch(e, t, n, r) {
		let i = -1, a;
		if (r >= this.preMatch.index && (a = this.preMatch.matches[r - this.preMatch.index]).parent == this.top && a.matchesNode(e, t, n)) i = this.top.children.indexOf(a, this.index);
		else for (let r = this.index, a = Math.min(this.top.children.length, r + 5); r < a; r++) {
			let a = this.top.children[r];
			if (a.matchesNode(e, t, n) && !this.preMatch.matched.has(a)) {
				i = r;
				break;
			}
		}
		return i < 0 ? !1 : (this.destroyBetween(this.index, i), this.index++, !0);
	}
	updateNodeAt(e, t, n, r, i) {
		let a = this.top.children[r];
		return a.dirty == wi && a.dom == a.contentDOM && (a.dirty = Ci), a.update(e, t, n, i) ? (this.destroyBetween(this.index, r), this.index++, !0) : !1;
	}
	findIndexWithChild(e) {
		for (;;) {
			let t = e.parentNode;
			if (!t) return -1;
			if (t == this.top.contentDOM) {
				let t = e.pmViewDesc;
				if (t) {
					for (let e = this.index; e < this.top.children.length; e++) if (this.top.children[e] == t) return e;
				}
				return -1;
			}
			e = t;
		}
	}
	updateNextNode(e, t, n, r, i, a) {
		for (let o = this.index; o < this.top.children.length; o++) {
			let s = this.top.children[o];
			if (s instanceof ki) {
				let c = this.preMatch.matched.get(s);
				if (c != null && c != i) return !1;
				let l = s.dom, u, d = this.isLocked(l) && !(e.isText && s.node && s.node.isText && s.nodeDOM.nodeValue == e.text && s.dirty != wi && Vi(t, s.outerDeco));
				if (!d && s.update(e, t, n, r)) return this.destroyBetween(this.index, o), s.dom != l && (this.changed = !0), this.index++, !0;
				if (!d && (u = this.recreateWrapper(s, e, t, n, r, a))) return this.destroyBetween(this.index, o), this.top.children[this.index] = u, u.contentDOM && (u.dirty = Ci, u.updateChildren(r, a + 1), u.dirty = xi), this.changed = !0, this.index++, !0;
				break;
			}
		}
		return !1;
	}
	recreateWrapper(e, t, n, r, i, a) {
		if (e.dirty || t.isAtom || !e.children.length || !e.node.content.eq(t.content) || !Vi(n, e.outerDeco) || !r.eq(e.innerDeco)) return null;
		let o = ki.create(this.top, t, n, r, i, a);
		if (o.contentDOM) {
			o.children = e.children, e.children = [];
			for (let e of o.children) e.parent = o;
		}
		return e.destroy(), o;
	}
	addNode(e, t, n, r, i) {
		let a = ki.create(this.top, e, t, n, r, i);
		a.contentDOM && a.updateChildren(r, i + 1), this.top.children.splice(this.index++, 0, a), this.changed = !0;
	}
	placeWidget(e, t, n) {
		let r = this.index < this.top.children.length ? this.top.children[this.index] : null;
		if (r && r.matchesWidget(e) && (e == r.widget || !r.widget.type.toDOM.parentNode)) this.index++;
		else {
			let r = new Ei(this.top, e, t, n);
			this.top.children.splice(this.index++, 0, r), this.changed = !0;
		}
	}
	addTextblockHacks() {
		let e = this.top.children[this.index - 1], t = this.top;
		for (; e instanceof Oi;) t = e, e = t.children[t.children.length - 1];
		(!e || !(e instanceof ji) || /\n$/.test(e.node.text) || this.view.requiresGeckoHackNode && /\s$/.test(e.node.text)) && ((Ir || Pr) && e && e.dom.contentEditable == "false" && this.addHackNode("IMG", t), this.addHackNode("BR", this.top));
	}
	addHackNode(e, t) {
		if (t == this.top && this.index < t.children.length && t.children[this.index].matchesHack(e)) this.index++;
		else {
			let n = document.createElement(e);
			e == "IMG" && (n.className = "ProseMirror-separator", n.alt = ""), e == "BR" && (n.className = "ProseMirror-trailingBreak");
			let r = new Mi(this.top, [], n, null);
			t == this.top ? t.children.splice(this.index++, 0, r) : t.children.push(r), this.changed = !0;
		}
	}
	isLocked(e) {
		return this.lock && (e == this.lock || e.nodeType == 1 && e.contains(this.lock.parentNode));
	}
};
function Wi(e, t) {
	let n = t, r = n.children.length, i = e.childCount, a = /* @__PURE__ */ new Map(), o = [];
	outer: for (; i > 0;) {
		let s;
		for (;;) if (r) {
			let e = n.children[r - 1];
			if (e instanceof Oi) n = e, r = e.children.length;
			else {
				s = e, r--;
				break;
			}
		} else if (n == t) break outer;
		else r = n.parent.children.indexOf(n), n = n.parent;
		let c = s.node;
		if (c) {
			if (c != e.child(i - 1)) break;
			--i, a.set(s, i), o.push(s);
		}
	}
	return {
		index: i,
		matched: a,
		matches: o.reverse()
	};
}
function Gi(e, t) {
	return e.type.side - t.type.side;
}
function Ki(e, t, n, r) {
	let i = t.locals(e), a = 0;
	if (i.length == 0) {
		for (let n = 0; n < e.childCount; n++) {
			let o = e.child(n);
			r(o, i, t.forChild(a, o), n), a += o.nodeSize;
		}
		return;
	}
	let o = 0, s = [], c = null;
	for (let l = 0;;) {
		let u, d;
		for (; o < i.length && i[o].to == a;) {
			let e = i[o++];
			e.widget && (u ? (d || (d = [u])).push(e) : u = e);
		}
		if (u) {
			if (d) {
				d.sort(Gi);
				for (let e = 0; e < d.length; e++) n(d[e], l, !!c);
			} else n(u, l, !!c);
		}
		let f, p;
		if (c) p = -1, f = c, c = null;
		else if (l < e.childCount) p = l, f = e.child(l++);
		else break;
		for (let e = 0; e < s.length; e++) s[e].to <= a && s.splice(e--, 1);
		for (; o < i.length && i[o].from <= a && i[o].to > a;) s.push(i[o++]);
		let m = a + f.nodeSize;
		if (f.isText) {
			let e = m;
			o < i.length && i[o].from < e && (e = i[o].from);
			for (let t = 0; t < s.length; t++) s[t].to < e && (e = s[t].to);
			e < m && (c = f.cut(e - a), f = f.cut(0, e - a), m = e, p = -1);
		} else for (; o < i.length && i[o].to < m;) o++;
		let h = f.isInline && !f.isLeaf ? s.filter((e) => !e.inline) : s.slice();
		r(f, h, t.forChild(a, f), p), a = m;
	}
}
function qi(e) {
	if (e.nodeName == "UL" || e.nodeName == "OL") {
		let t = e.style.cssText;
		e.style.cssText = t + "; list-style: square !important", window.getComputedStyle(e).listStyle, e.style.cssText = t;
	}
}
function Ji(e, t, n, r) {
	for (let i = 0, a = 0; i < e.childCount && a <= r;) {
		let o = e.child(i++), s = a;
		if (a += o.nodeSize, !o.isText) continue;
		let c = o.text;
		for (; i < e.childCount;) {
			let t = e.child(i++);
			if (a += t.nodeSize, !t.isText) break;
			c += t.text;
		}
		if (a >= n) {
			if (a >= r && c.slice(r - t.length - s, r - s) == t) return r - t.length;
			let e = s < r ? c.lastIndexOf(t, r - s - 1) : -1;
			if (e >= 0 && e + t.length + s >= n) return s + e;
			if (n == r && c.length >= r + t.length - s && c.slice(r - s, r - s + t.length) == t) return r;
		}
	}
	return -1;
}
function Yi(e, t, n, r, i) {
	let a = [];
	for (let o = 0, s = 0; o < e.length; o++) {
		let c = e[o], l = s, u = s += c.size;
		l >= n || u <= t ? a.push(c) : (l < t && a.push(c.slice(0, t - l, r)), i && (a.push(i), i = void 0), u > n && a.push(c.slice(n - l, c.size, r)));
	}
	return a;
}
function Xi(e, t = null) {
	let n = e.domSelectionRange(), r = e.state.doc;
	if (!n.focusNode) return null;
	let i = e.docView.nearestDesc(n.focusNode), a = i && i.size == 0, o = e.docView.posFromDOM(n.focusNode, n.focusOffset, 1);
	if (o < 0) return null;
	let s = r.resolve(o), c, l;
	if (br(n)) {
		for (c = o; i && !i.node;) i = i.parent;
		let e = i.node;
		if (i && e.isAtom && M.isSelectable(e) && i.parent && !(e.isInline && vr(n.focusNode, n.focusOffset, i.dom))) {
			let e = i.posBefore;
			l = new M(o == e ? s : r.resolve(e));
		}
	} else {
		if (n instanceof e.dom.ownerDocument.defaultView.Selection && n.rangeCount > 1) {
			let t = o, i = o;
			for (let r = 0; r < n.rangeCount; r++) {
				let a = n.getRangeAt(r);
				t = Math.min(t, e.docView.posFromDOM(a.startContainer, a.startOffset, 1)), i = Math.max(i, e.docView.posFromDOM(a.endContainer, a.endOffset, -1));
			}
			if (t < 0) return null;
			[c, o] = i == e.state.selection.anchor ? [i, t] : [t, i], s = r.resolve(o);
		} else c = e.docView.posFromDOM(n.anchorNode, n.anchorOffset, 1);
		if (c < 0) return null;
	}
	let u = r.resolve(c);
	if (!l) {
		let n = t == "pointer" || e.state.selection.head < s.pos && !a ? 1 : -1;
		l = sa(e, u, s, n);
	}
	return l;
}
function Zi(e) {
	return e.editable ? e.hasFocus() : la(e) && document.activeElement && document.activeElement.contains(e.dom);
}
function Qi(e, t = !1) {
	let n = e.state.selection;
	if (aa(e, n), Zi(e)) {
		if (!t && e.input.mouseDown && e.input.mouseDown.allowDefault && Pr) {
			let t = e.domSelectionRange(), n = e.domObserver.currentSelection;
			if (t.anchorNode && n.anchorNode && fr(t.anchorNode, t.anchorOffset, n.anchorNode, n.anchorOffset)) {
				e.input.mouseDown.delayedSelectionSync = !0, e.domObserver.setCurSelection();
				return;
			}
		}
		if (e.domObserver.disconnectSelection(), e.cursorWrapper) ia(e);
		else {
			let { anchor: r, head: i } = n, a, o;
			$i && !(n instanceof j) && (n.$from.parent.inlineContent || (a = ea(e, n.from)), !n.empty && !n.$from.parent.inlineContent && (o = ea(e, n.to))), e.docView.setSelection(r, i, e, t), $i && (a && na(a), o && na(o)), n.visible ? e.dom.classList.remove("ProseMirror-hideselection") : (e.dom.classList.add("ProseMirror-hideselection"), "onselectionchange" in document && ra(e));
		}
		e.domObserver.setCurSelection(), e.domObserver.connectSelection();
	}
}
var $i = Ir || Pr && Fr < 63;
function ea(e, t) {
	let { node: n, offset: r } = e.docView.domFromPos(t, 0), i = r < n.childNodes.length ? n.childNodes[r] : null, a = r ? n.childNodes[r - 1] : null;
	if (Ir && i && i.contentEditable == "false") return ta(i);
	if ((!i || i.contentEditable == "false") && (!a || a.contentEditable == "false")) {
		if (i) return ta(i);
		if (a) return ta(a);
	}
}
function ta(e) {
	return e.contentEditable = "true", Ir && e.draggable && (e.draggable = !1, e.wasDraggable = !0), e;
}
function na(e) {
	e.contentEditable = "false", e.wasDraggable && (e.draggable = !0, e.wasDraggable = null);
}
function ra(e) {
	let t = e.dom.ownerDocument;
	t.removeEventListener("selectionchange", e.input.hideSelectionGuard);
	let n = e.domSelectionRange(), r = n.anchorNode, i = n.anchorOffset;
	t.addEventListener("selectionchange", e.input.hideSelectionGuard = () => {
		(n.anchorNode != r || n.anchorOffset != i) && (t.removeEventListener("selectionchange", e.input.hideSelectionGuard), setTimeout(() => {
			(!Zi(e) || e.state.selection.visible) && e.dom.classList.remove("ProseMirror-hideselection");
		}, 20));
	});
}
function ia(e) {
	let t = e.domSelection();
	if (!t) return;
	let n = e.cursorWrapper.dom, r = n.nodeName == "IMG";
	r ? t.collapse(n.parentNode, sr(n) + 1) : t.collapse(n, 0), !r && !e.state.selection.visible && Ar && jr <= 11 && (n.disabled = !0, n.disabled = !1);
}
function aa(e, t) {
	if (t instanceof M) {
		let n = e.docView.descAt(t.from);
		n != e.lastSelectedViewDesc && (oa(e), n && n.selectNode(), e.lastSelectedViewDesc = n);
	} else oa(e);
}
function oa(e) {
	e.lastSelectedViewDesc && (e.lastSelectedViewDesc.parent && e.lastSelectedViewDesc.deselectNode(), e.lastSelectedViewDesc = void 0);
}
function sa(e, t, n, r) {
	return e.someProp("createSelectionBetween", (r) => r(e, t, n)) || j.between(t, n, r);
}
function ca(e) {
	return e.editable && !e.hasFocus() ? !1 : la(e);
}
function la(e) {
	let t = e.domSelectionRange();
	if (!t.anchorNode) return !1;
	try {
		return e.dom.contains(t.anchorNode.nodeType == 3 ? t.anchorNode.parentNode : t.anchorNode) && (e.editable || e.dom.contains(t.focusNode.nodeType == 3 ? t.focusNode.parentNode : t.focusNode));
	} catch (e) {
		return !1;
	}
}
function ua(e) {
	let t = e.docView.domFromPos(e.state.selection.anchor, 0), n = e.domSelectionRange();
	return fr(t.node, t.offset, n.anchorNode, n.anchorOffset);
}
function da(e, t) {
	let { $anchor: n, $head: r } = e.selection, i = t > 0 ? n.max(r) : n.min(r), a = i.parent.inlineContent ? i.depth ? e.doc.resolve(t > 0 ? i.after() : i.before()) : null : i;
	return a && A.findFrom(a, t);
}
function fa(e, t) {
	return e.dispatch(e.state.tr.setSelection(t).scrollIntoView()), !0;
}
function pa(e, t, n) {
	let r = e.state.selection;
	if (r instanceof j) {
		if (n.indexOf("s") > -1) {
			let { $head: n } = r, i = n.textOffset ? null : t < 0 ? n.nodeBefore : n.nodeAfter;
			if (!i || i.isText || !i.isLeaf) return !1;
			let a = e.state.doc.resolve(n.pos + i.nodeSize * (t < 0 ? -1 : 1));
			return fa(e, new j(r.$anchor, a));
		}
		if (!r.empty) return !1;
		if (e.endOfTextblock(t > 0 ? "forward" : "backward")) {
			let n = da(e.state, t);
			return n && n instanceof M ? fa(e, n) : !1;
		}
		if (!(Rr && n.indexOf("m") > -1)) {
			let n = r.$head, i = n.textOffset ? null : t < 0 ? n.nodeBefore : n.nodeAfter, a;
			if (!i || i.isText) return !1;
			let o = t < 0 ? n.pos - i.nodeSize : n.pos;
			return i.isAtom || (a = e.docView.descAt(o)) && !a.contentDOM ? M.isSelectable(i) ? fa(e, new M(t < 0 ? e.state.doc.resolve(n.pos - i.nodeSize) : n)) : Vr ? fa(e, new j(e.state.doc.resolve(t < 0 ? o : o + i.nodeSize))) : !1 : !1;
		}
	} else if (r instanceof M && r.node.isInline) return fa(e, new j(t > 0 ? r.$to : r.$from));
	else {
		let n = da(e.state, t);
		return n ? fa(e, n) : !1;
	}
}
function ma(e) {
	return e.nodeType == 3 ? e.nodeValue.length : e.childNodes.length;
}
function ha(e, t) {
	let n = e.pmViewDesc;
	return n && n.size == 0 && (t < 0 || e.nextSibling || e.nodeName != "BR");
}
function ga(e, t) {
	return t < 0 ? _a(e) : va(e);
}
function _a(e) {
	let t = e.domSelectionRange(), n = t.focusNode, r = t.focusOffset;
	if (!n) return;
	let i, a, o = !1;
	for (Mr && n.nodeType == 1 && r < ma(n) && ha(n.childNodes[r], -1) && (o = !0);;) if (r > 0) {
		if (n.nodeType != 1) break;
		{
			let e = n.childNodes[r - 1];
			if (ha(e, -1)) i = n, a = --r;
			else if (e.nodeType == 3) n = e, r = n.nodeValue.length;
			else break;
		}
	} else if (ya(n)) break;
	else {
		let t = n.previousSibling;
		for (; t && ha(t, -1);) i = n.parentNode, a = sr(t), t = t.previousSibling;
		if (t) n = t, r = ma(n);
		else {
			if (n = n.parentNode, n == e.dom) break;
			r = 0;
		}
	}
	o ? Sa(e, n, r) : i && Sa(e, i, a);
}
function va(e) {
	let t = e.domSelectionRange(), n = t.focusNode, r = t.focusOffset;
	if (!n) return;
	let i = ma(n), a, o;
	for (;;) if (r < i) {
		if (n.nodeType != 1) break;
		let e = n.childNodes[r];
		if (ha(e, 1)) a = n, o = ++r;
		else break;
	} else if (ya(n)) break;
	else {
		let t = n.nextSibling;
		for (; t && ha(t, 1);) a = t.parentNode, o = sr(t) + 1, t = t.nextSibling;
		if (t) n = t, r = 0, i = ma(n);
		else {
			if (n = n.parentNode, n == e.dom) break;
			r = i = 0;
		}
	}
	a && Sa(e, a, o);
}
function ya(e) {
	let t = e.pmViewDesc;
	return t && t.node && t.node.isBlock;
}
function ba(e, t) {
	for (; e && t == e.childNodes.length && !yr(e);) t = sr(e) + 1, e = e.parentNode;
	for (; e && t < e.childNodes.length;) {
		let n = e.childNodes[t];
		if (n.nodeType == 3) return n;
		if (n.nodeType == 1 && n.contentEditable == "false") break;
		e = n, t = 0;
	}
}
function xa(e, t) {
	for (; e && !t && !yr(e);) t = sr(e), e = e.parentNode;
	for (; e && t;) {
		let n = e.childNodes[t - 1];
		if (n.nodeType == 3) return n;
		if (n.nodeType == 1 && n.contentEditable == "false") break;
		e = n, t = e.childNodes.length;
	}
}
function Sa(e, t, n) {
	if (t.nodeType != 3) {
		let e, r;
		(r = ba(t, n)) ? (t = r, n = 0) : (e = xa(t, n)) && (t = e, n = e.nodeValue.length);
	}
	let r = e.domSelection();
	if (!r) return;
	if (br(r)) {
		let e = document.createRange();
		e.setEnd(t, n), e.setStart(t, n), r.removeAllRanges(), r.addRange(e);
	} else r.extend && r.extend(t, n);
	e.domObserver.setCurSelection();
	let { state: i } = e;
	setTimeout(() => {
		e.state == i && Qi(e);
	}, 50);
}
function Ca(e, t) {
	let n = e.state.doc.resolve(t);
	if (!(Pr || zr) && n.parent.inlineContent) {
		let r = e.coordsAtPos(t);
		if (t > n.start()) {
			let n = e.coordsAtPos(t - 1), i = (n.top + n.bottom) / 2;
			if (i > r.top && i < r.bottom && Math.abs(n.left - r.left) > 1) return n.left < r.left ? "ltr" : "rtl";
		}
		if (t < n.end()) {
			let n = e.coordsAtPos(t + 1), i = (n.top + n.bottom) / 2;
			if (i > r.top && i < r.bottom && Math.abs(n.left - r.left) > 1) return n.left > r.left ? "ltr" : "rtl";
		}
	}
	return getComputedStyle(e.dom).direction == "rtl" ? "rtl" : "ltr";
}
function wa(e, t, n) {
	let r = e.state.selection;
	if (r instanceof j && !r.empty || n.indexOf("s") > -1 || Rr && n.indexOf("m") > -1) return !1;
	let { $from: i, $to: a } = r;
	if (!i.parent.inlineContent || e.endOfTextblock(t < 0 ? "up" : "down")) {
		let n = da(e.state, t);
		if (n && n instanceof M) return fa(e, n);
	}
	if (!i.parent.inlineContent) {
		let n = t < 0 ? i : a, o = r instanceof Un ? A.near(n, t) : A.findFrom(n, t);
		return o ? fa(e, o) : !1;
	}
	return !1;
}
function Ta(e, t) {
	if (!(e.state.selection instanceof j)) return !0;
	let { $head: n, $anchor: r, empty: i } = e.state.selection;
	if (!n.sameParent(r)) return !0;
	if (!i) return !1;
	if (e.endOfTextblock(t > 0 ? "forward" : "backward")) return !0;
	let a = !n.textOffset && (t < 0 ? n.nodeBefore : n.nodeAfter);
	if (a && !a.isText) {
		let r = e.state.tr;
		return t < 0 ? r.delete(n.pos - a.nodeSize, n.pos) : r.delete(n.pos, n.pos + a.nodeSize), e.dispatch(r), !0;
	}
	return !1;
}
function Ea(e, t, n) {
	e.domObserver.stop(), t.contentEditable = n, e.domObserver.start();
}
function Da(e) {
	if (!Ir || e.state.selection.$head.parentOffset > 0) return !1;
	let { focusNode: t, focusOffset: n } = e.domSelectionRange();
	if (t && t.nodeType == 1 && n == 0 && t.firstChild && t.firstChild.contentEditable == "false") {
		let n = t.firstChild;
		Ea(e, n, "true"), setTimeout(() => Ea(e, n, "false"), 20);
	}
	return !1;
}
function Oa(e) {
	let t = "";
	return e.ctrlKey && (t += "c"), e.metaKey && (t += "m"), e.altKey && (t += "a"), e.shiftKey && (t += "s"), t;
}
function ka(e, t) {
	let n = t.keyCode, r = Oa(t);
	if (n == 8 || Rr && n == 72 && r == "c") return Ta(e, -1) || ga(e, -1);
	if (n == 46 && !t.shiftKey || Rr && n == 68 && r == "c") return Ta(e, 1) || ga(e, 1);
	if (n == 13 || n == 27) return !0;
	if (n == 37 || Rr && n == 66 && r == "c") {
		let t = n == 37 ? Ca(e, e.state.selection.from) == "ltr" ? -1 : 1 : -1;
		return pa(e, t, r) || ga(e, t);
	}
	if (n == 39 || Rr && n == 70 && r == "c") {
		let t = n == 39 ? Ca(e, e.state.selection.from) == "ltr" ? 1 : -1 : 1;
		return pa(e, t, r) || ga(e, t);
	}
	return n == 38 || Rr && n == 80 && r == "c" ? wa(e, -1, r) || ga(e, -1) : n == 40 || Rr && n == 78 && r == "c" ? Da(e) || wa(e, 1, r) || ga(e, 1) : !(r != (Rr ? "m" : "c") || n != 66 && n != 73 && n != 89 && n != 90);
}
function Aa(e, t) {
	e.someProp("transformCopied", (n) => {
		t = n(t, e);
	});
	let n = [], { content: r, openStart: i, openEnd: a } = t;
	for (; i > 1 && a > 1 && r.childCount == 1 && r.firstChild.childCount == 1;) {
		i--, a--;
		let e = r.firstChild;
		n.push(e.type.name, e.attrs == e.type.defaultAttrs ? null : e.attrs), r = e.content;
	}
	let o = e.someProp("clipboardSerializer") || _t.fromSchema(e.state.schema), s = Va(), c = s.createElement("div");
	c.appendChild(o.serializeFragment(r, { document: s }));
	let l = c.firstChild, u, d = 0;
	for (; l && l.nodeType == 1 && (u = za[l.nodeName.toLowerCase()]);) {
		for (let e = u.length - 1; e >= 0; e--) {
			let t = s.createElement(u[e]);
			for (; c.firstChild;) t.appendChild(c.firstChild);
			c.appendChild(t), d++;
		}
		l = c.firstChild;
	}
	return l && l.nodeType == 1 && l.setAttribute("data-pm-slice", `${i} ${a}${d ? ` -${d}` : ""} ${JSON.stringify(n)}`), {
		dom: c,
		text: e.someProp("clipboardTextSerializer", (n) => n(t, e)) || t.content.textBetween(0, t.content.size, "\n\n"),
		slice: t
	};
}
function ja(e, t, n, r, i) {
	let a = i.parent.type.spec.code, o, s;
	if (!n && !t) return null;
	let c = !!t && (r || a || !n);
	if (c) {
		if (e.someProp("transformPastedText", (n) => {
			t = n(t, a || r, e);
		}), a) return s = new D(T.from(e.state.schema.text(t.replace(/\r\n?/g, "\n"))), 0, 0), e.someProp("transformPasted", (t) => {
			s = t(s, e, !0);
		}), s;
		let n = e.someProp("clipboardTextParser", (n) => n(t, i, r, e));
		if (n) s = n;
		else {
			let n = i.marks(), { schema: r } = e.state, a = _t.fromSchema(r);
			o = document.createElement("div"), t.split(/(?:\r\n?|\n)+/).forEach((e) => {
				let t = o.appendChild(document.createElement("p"));
				e && t.appendChild(a.serializeNode(r.text(e, n)));
			});
		}
	} else e.someProp("transformPastedHTML", (t) => {
		n = t(n, e);
	}), o = Wa(n), Vr && Ga(o);
	let l = o && o.querySelector("[data-pm-slice]"), u = l && /^(\d+) (\d+)(?: -(\d+))? (.*)/.exec(l.getAttribute("data-pm-slice") || "");
	if (u && u[3]) for (let e = +u[3]; e > 0; e--) {
		let e = o.firstChild;
		for (; e && e.nodeType != 1;) e = e.nextSibling;
		if (!e) break;
		o = e;
	}
	if (s || (s = (e.someProp("clipboardParser") || e.someProp("domParser") || rt.fromSchema(e.state.schema)).parseSlice(o, {
		preserveWhitespace: !!(c || u),
		context: i,
		ruleFromNode(e) {
			return e.nodeName == "BR" && !e.nextSibling && e.parentNode && !Ma.test(e.parentNode.nodeName) ? { ignore: !0 } : null;
		}
	})), u) s = Ka(Ra(s, +u[1], +u[2]), u[4]);
	else if (s = D.maxOpen(Na(s.content, i), !0), s.openStart || s.openEnd) {
		let e = 0, t = 0;
		for (let t = s.content.firstChild; e < s.openStart && !t.type.spec.isolating; e++, t = t.firstChild);
		for (let e = s.content.lastChild; t < s.openEnd && !e.type.spec.isolating; t++, e = e.lastChild);
		s = Ra(s, e, t);
	}
	return e.someProp("transformPasted", (t) => {
		s = t(s, e, c);
	}), s;
}
var Ma = /^(a|abbr|acronym|b|cite|code|del|em|i|ins|kbd|label|output|q|ruby|s|samp|span|strong|sub|sup|time|u|tt|var)$/i;
function Na(e, t) {
	if (e.childCount < 2) return e;
	for (let n = t.depth; n >= 0; n--) {
		let r = t.node(n).contentMatchAt(t.index(n)), i, a = [];
		if (e.forEach((e) => {
			if (!a) return;
			let t = r.findWrapping(e.type), n;
			if (!t) return a = null;
			if (n = a.length && i.length && Fa(t, i, e, a[a.length - 1], 0)) a[a.length - 1] = n;
			else {
				a.length && (a[a.length - 1] = Ia(a[a.length - 1], i.length));
				let n = Pa(e, t);
				a.push(n), r = r.matchType(n.type), i = t;
			}
		}), a) return T.from(a);
	}
	return e;
}
function Pa(e, t, n = 0) {
	for (let r = t.length - 1; r >= n; r--) e = t[r].create(null, T.from(e));
	return e;
}
function Fa(e, t, n, r, i) {
	if (i < e.length && i < t.length && e[i] == t[i]) {
		let a = Fa(e, t, n, r.lastChild, i + 1);
		if (a) return r.copy(r.content.replaceChild(r.childCount - 1, a));
		if (r.contentMatchAt(r.childCount).matchType(i == e.length - 1 ? n.type : e[i + 1])) return r.copy(r.content.append(T.from(Pa(n, e, i + 1))));
	}
}
function Ia(e, t) {
	if (t == 0) return e;
	let n = e.content.replaceChild(e.childCount - 1, Ia(e.lastChild, t - 1)), r = e.contentMatchAt(e.childCount).fillBefore(T.empty, !0);
	return e.copy(n.append(r));
}
function La(e, t, n, r, i, a) {
	let o = t < 0 ? e.firstChild : e.lastChild, s = o.content;
	return e.childCount > 1 && (a = 0), i < r - 1 && (s = La(s, t, n, r, i + 1, a)), i >= n && (s = t < 0 ? o.contentMatchAt(0).fillBefore(s, a <= i).append(s) : s.append(o.contentMatchAt(o.childCount).fillBefore(T.empty, !0))), e.replaceChild(t < 0 ? 0 : e.childCount - 1, o.copy(s));
}
function Ra(e, t, n) {
	return t < e.openStart && (e = new D(La(e.content, -1, t, e.openStart, 0, e.openEnd), t, e.openEnd)), n < e.openEnd && (e = new D(La(e.content, 1, n, e.openEnd, 0, 0), e.openStart, n)), e;
}
var za = {
	thead: ["table"],
	tbody: ["table"],
	tfoot: ["table"],
	caption: ["table"],
	colgroup: ["table"],
	col: ["table", "colgroup"],
	tr: ["table", "tbody"],
	td: [
		"table",
		"tbody",
		"tr"
	],
	th: [
		"table",
		"tbody",
		"tr"
	]
}, Ba = null;
function Va() {
	return Ba || (Ba = document.implementation.createHTMLDocument("title"));
}
var Ha = null;
function Ua(e) {
	let t = window.trustedTypes;
	return t ? (Ha || (Ha = t.defaultPolicy || t.createPolicy("ProseMirrorClipboard", { createHTML: (e) => e })), Ha.createHTML(e)) : e;
}
function Wa(e) {
	let t = /^(\s*<meta [^>]*>)*/.exec(e);
	t && (e = e.slice(t[0].length));
	let n = Va().createElement("div"), r = /<([a-z][^>\s]+)/i.exec(e), i;
	if ((i = r && za[r[1].toLowerCase()]) && (e = i.map((e) => "<" + e + ">").join("") + e + i.map((e) => "</" + e + ">").reverse().join("")), n.innerHTML = Ua(e), i) for (let e = 0; e < i.length; e++) n = n.querySelector(i[e]) || n;
	return n;
}
function Ga(e) {
	let t = e.querySelectorAll(Pr ? "span:not([class]):not([style])" : "span.Apple-converted-space");
	for (let n = 0; n < t.length; n++) {
		let r = t[n];
		r.childNodes.length == 1 && r.textContent == "\xA0" && r.parentNode && r.parentNode.replaceChild(e.ownerDocument.createTextNode(" "), r);
	}
}
function Ka(e, t) {
	if (!e.size) return e;
	let n = e.content.firstChild.type.schema, r;
	try {
		r = JSON.parse(t);
	} catch (t) {
		return e;
	}
	let { content: i, openStart: a, openEnd: o } = e;
	for (let e = r.length - 2; e >= 0; e -= 2) {
		let t = n.nodes[r[e]];
		if (!t || t.hasRequiredAttrs()) break;
		i = T.from(t.create(r[e + 1], i)), a++, o++;
	}
	return new D(i, a, o);
}
var qa = {}, Ja = {}, Ya = {
	touchstart: !0,
	touchmove: !0
}, Xa = class {
	constructor() {
		this.shiftKey = !1, this.mouseDown = null, this.lastKeyCode = null, this.lastKeyCodeTime = 0, this.lastClick = {
			time: 0,
			x: 0,
			y: 0,
			type: "",
			button: 0
		}, this.lastSelectionOrigin = null, this.lastSelectionTime = 0, this.lastIOSEnter = 0, this.lastIOSEnterFallbackTimeout = -1, this.lastFocus = 0, this.lastTouch = 0, this.lastChromeDelete = 0, this.composing = !1, this.compositionNode = null, this.composingTimeout = -1, this.compositionNodes = [], this.compositionEndedAt = -2e8, this.compositionID = 1, this.badSafariComposition = !1, this.compositionPendingChanges = 0, this.domChangeCount = 0, this.eventHandlers = Object.create(null), this.hideSelectionGuard = null;
	}
};
function Za(e) {
	for (let t in qa) {
		let n = qa[t];
		e.dom.addEventListener(t, e.input.eventHandlers[t] = (t) => {
			no(e, t) && !to(e, t) && (e.editable || !(t.type in Ja)) && n(e, t);
		}, Ya[t] ? { passive: !0 } : void 0);
	}
	Ir && e.dom.addEventListener("input", () => null), eo(e);
}
function Qa(e, t) {
	e.input.lastSelectionOrigin = t, e.input.lastSelectionTime = Date.now();
}
function $a(e) {
	e.domObserver.stop();
	for (let t in e.input.eventHandlers) e.dom.removeEventListener(t, e.input.eventHandlers[t]);
	clearTimeout(e.input.composingTimeout), clearTimeout(e.input.lastIOSEnterFallbackTimeout);
}
function eo(e) {
	e.someProp("handleDOMEvents", (t) => {
		for (let n in t) e.input.eventHandlers[n] || e.dom.addEventListener(n, e.input.eventHandlers[n] = (t) => to(e, t));
	});
}
function to(e, t) {
	return e.someProp("handleDOMEvents", (n) => {
		let r = n[t.type];
		return r ? r(e, t) || t.defaultPrevented : !1;
	});
}
function no(e, t) {
	if (!t.bubbles) return !0;
	if (t.defaultPrevented) return !1;
	for (let n = t.target; n != e.dom; n = n.parentNode) if (!n || n.nodeType == 11 || n.pmViewDesc && n.pmViewDesc.stopEvent(t)) return !1;
	return !0;
}
function ro(e, t) {
	!to(e, t) && qa[t.type] && (e.editable || !(t.type in Ja)) && qa[t.type](e, t);
}
Ja.keydown = (e, t) => {
	let n = t;
	if (e.input.shiftKey = n.keyCode == 16 || n.shiftKey, !vo(e, n) && (e.input.lastKeyCode = n.keyCode, e.input.lastKeyCodeTime = Date.now(), !(Br && Pr && n.keyCode == 13))) {
		if (n.keyCode != 229 && e.domObserver.forceFlush(), Lr && n.keyCode == 13 && !n.ctrlKey && !n.altKey && !n.metaKey) {
			let t = Date.now();
			e.input.lastIOSEnter = t, e.input.lastIOSEnterFallbackTimeout = setTimeout(() => {
				e.input.lastIOSEnter == t && (e.someProp("handleKeyDown", (t) => t(e, xr(13, "Enter"))), e.input.lastIOSEnter = 0);
			}, 200);
		} else e.someProp("handleKeyDown", (t) => t(e, n)) || ka(e, n) ? n.preventDefault() : Qa(e, "key");
	}
}, Ja.keyup = (e, t) => {
	t.keyCode == 16 && (e.input.shiftKey = !1);
}, Ja.keypress = (e, t) => {
	let n = t;
	if (vo(e, n) || !n.charCode || n.ctrlKey && !n.altKey || Rr && n.metaKey) return;
	if (e.someProp("handleKeyPress", (t) => t(e, n))) {
		n.preventDefault();
		return;
	}
	let r = e.state.selection;
	if (!(r instanceof j) || !r.$from.sameParent(r.$to)) {
		let t = String.fromCharCode(n.charCode), i = () => e.state.tr.insertText(t).scrollIntoView();
		!/[\r\n]/.test(t) && !e.someProp("handleTextInput", (n) => n(e, r.$from.pos, r.$to.pos, t, i)) && e.dispatch(i()), n.preventDefault();
	}
};
function io(e) {
	return {
		left: e.clientX,
		top: e.clientY
	};
}
function ao(e, t) {
	let n = t.x - e.clientX, r = t.y - e.clientY;
	return n * n + r * r < 100;
}
function oo(e, t, n, r, i) {
	if (r == -1) return !1;
	let a = e.state.doc.resolve(r);
	for (let r = a.depth + 1; r > 0; r--) if (e.someProp(t, (t) => r > a.depth ? t(e, n, a.nodeAfter, a.before(r), i, !0) : t(e, n, a.node(r), a.before(r), i, !1))) return !0;
	return !1;
}
function so(e, t, n) {
	if (e.focused || e.focus(), e.state.selection.eq(t)) return;
	let r = e.state.tr.setSelection(t);
	n == "pointer" && r.setMeta("pointer", !0), e.dispatch(r);
}
function co(e, t) {
	if (t == -1) return !1;
	let n = e.state.doc.resolve(t), r = n.nodeAfter;
	return r && r.isAtom && M.isSelectable(r) ? (so(e, new M(n), "pointer"), !0) : !1;
}
function lo(e, t) {
	if (t == -1) return !1;
	let n = e.state.selection, r, i;
	n instanceof M && (r = n.node);
	let a = e.state.doc.resolve(t);
	for (let e = a.depth + 1; e > 0; e--) {
		let t = e > a.depth ? a.nodeAfter : a.node(e);
		if (M.isSelectable(t)) {
			i = r && n.$from.depth > 0 && e >= n.$from.depth && a.before(n.$from.depth + 1) == n.$from.pos ? a.before(n.$from.depth) : a.before(e);
			break;
		}
	}
	return i != null && (so(e, M.create(e.state.doc, i), "pointer"), !0);
}
function uo(e, t, n, r, i) {
	return oo(e, "handleClickOn", t, n, r) || e.someProp("handleClick", (n) => n(e, t, r)) || (i ? lo(e, n) : co(e, n));
}
function fo(e, t, n, r) {
	return oo(e, "handleDoubleClickOn", t, n, r) || e.someProp("handleDoubleClick", (n) => n(e, t, r));
}
function po(e, t, n, r) {
	return oo(e, "handleTripleClickOn", t, n, r) || e.someProp("handleTripleClick", (n) => n(e, t, r)) || mo(e, n, r);
}
function mo(e, t, n) {
	if (n.button != 0) return !1;
	let r = e.state.doc;
	if (t == -1) return r.inlineContent ? (so(e, j.create(r, 0, r.content.size), "pointer"), !0) : !1;
	let i = r.resolve(t);
	for (let t = i.depth + 1; t > 0; t--) {
		let n = t > i.depth ? i.nodeAfter : i.node(t), a = i.before(t);
		if (n.inlineContent) so(e, j.create(r, a + 1, a + 1 + n.content.size), "pointer");
		else if (M.isSelectable(n)) so(e, M.create(r, a), "pointer");
		else continue;
		return !0;
	}
}
function ho(e) {
	return To(e);
}
var go = Rr ? "metaKey" : "ctrlKey";
qa.mousedown = (e, t) => {
	let n = t;
	e.input.shiftKey = n.shiftKey;
	let r = ho(e), i = Date.now(), a = "singleClick";
	i - e.input.lastClick.time < 500 && ao(n, e.input.lastClick) && !n[go] && e.input.lastClick.button == n.button && (e.input.lastClick.type == "singleClick" ? a = "doubleClick" : e.input.lastClick.type == "doubleClick" && (a = "tripleClick")), e.input.lastClick = {
		time: i,
		x: n.clientX,
		y: n.clientY,
		type: a,
		button: n.button
	};
	let o = e.posAtCoords(io(n));
	o && (a == "singleClick" ? (e.input.mouseDown && e.input.mouseDown.done(), e.input.mouseDown = new _o(e, o, n, !!r)) : (a == "doubleClick" ? fo : po)(e, o.pos, o.inside, n) ? n.preventDefault() : Qa(e, "pointer"));
};
var _o = class {
	constructor(e, t, n, r) {
		this.view = e, this.pos = t, this.event = n, this.flushed = r, this.delayedSelectionSync = !1, this.mightDrag = null, this.startDoc = e.state.doc, this.selectNode = !!n[go], this.allowDefault = n.shiftKey;
		let i, a;
		if (t.inside > -1) i = e.state.doc.nodeAt(t.inside), a = t.inside;
		else {
			let n = e.state.doc.resolve(t.pos);
			i = n.parent, a = n.depth ? n.before() : 0;
		}
		let o = r ? null : n.target, s = o ? e.docView.nearestDesc(o, !0) : null;
		this.target = s && s.nodeDOM.nodeType == 1 ? s.nodeDOM : null;
		let { selection: c } = e.state;
		n.button == 0 && (i.type.spec.draggable && i.type.spec.selectable !== !1 || c instanceof M && c.from <= a && c.to > a) && (this.mightDrag = {
			node: i,
			pos: a,
			addAttr: !!(this.target && !this.target.draggable),
			setUneditable: !!(this.target && Mr && !this.target.hasAttribute("contentEditable"))
		}), this.target && this.mightDrag && (this.mightDrag.addAttr || this.mightDrag.setUneditable) && (this.view.domObserver.stop(), this.mightDrag.addAttr && (this.target.draggable = !0), this.mightDrag.setUneditable && setTimeout(() => {
			this.view.input.mouseDown == this && this.target.setAttribute("contentEditable", "false");
		}, 20), this.view.domObserver.start()), e.root.addEventListener("mouseup", this.up = this.up.bind(this)), e.root.addEventListener("mousemove", this.move = this.move.bind(this)), Qa(e, "pointer");
	}
	done() {
		this.view.root.removeEventListener("mouseup", this.up), this.view.root.removeEventListener("mousemove", this.move), this.mightDrag && this.target && (this.view.domObserver.stop(), this.mightDrag.addAttr && this.target.removeAttribute("draggable"), this.mightDrag.setUneditable && this.target.removeAttribute("contentEditable"), this.view.domObserver.start()), this.delayedSelectionSync && setTimeout(() => Qi(this.view)), this.view.input.mouseDown = null;
	}
	up(e) {
		if (this.done(), !this.view.dom.contains(e.target)) return;
		let t = this.pos;
		this.view.state.doc != this.startDoc && (t = this.view.posAtCoords(io(e))), this.updateAllowDefault(e), this.allowDefault || !t ? Qa(this.view, "pointer") : uo(this.view, t.pos, t.inside, e, this.selectNode) ? e.preventDefault() : e.button == 0 && (this.flushed || Ir && this.mightDrag && !this.mightDrag.node.isAtom || Pr && !this.view.state.selection.visible && Math.min(Math.abs(t.pos - this.view.state.selection.from), Math.abs(t.pos - this.view.state.selection.to)) <= 2) ? (so(this.view, A.near(this.view.state.doc.resolve(t.pos)), "pointer"), e.preventDefault()) : Qa(this.view, "pointer");
	}
	move(e) {
		this.updateAllowDefault(e), Qa(this.view, "pointer"), e.buttons == 0 && this.done();
	}
	updateAllowDefault(e) {
		!this.allowDefault && (Math.abs(this.event.x - e.clientX) > 4 || Math.abs(this.event.y - e.clientY) > 4) && (this.allowDefault = !0);
	}
};
qa.touchstart = (e) => {
	e.input.lastTouch = Date.now(), ho(e), Qa(e, "pointer");
}, qa.touchmove = (e) => {
	e.input.lastTouch = Date.now(), Qa(e, "pointer");
}, qa.contextmenu = (e) => ho(e);
function vo(e, t) {
	return e.composing ? !0 : Ir && Math.abs(t.timeStamp - e.input.compositionEndedAt) < 500 ? (e.input.compositionEndedAt = -2e8, !0) : !1;
}
var yo = Br ? 5e3 : -1;
Ja.compositionstart = Ja.compositionupdate = (e) => {
	if (!e.composing) {
		e.domObserver.flush();
		let { state: t } = e, n = t.selection.$to;
		if (t.selection instanceof j && (t.storedMarks || !n.textOffset && n.parentOffset && n.nodeBefore.marks.some((e) => e.type.spec.inclusive === !1) || Pr && zr && bo(e))) e.markCursor = e.state.storedMarks || n.marks(), To(e, !0), e.markCursor = null;
		else if (To(e, !t.selection.empty), Mr && t.selection.empty && n.parentOffset && !n.textOffset && n.nodeBefore.marks.length) {
			let t = e.domSelectionRange();
			for (let n = t.focusNode, r = t.focusOffset; n && n.nodeType == 1 && r != 0;) {
				let t = r < 0 ? n.lastChild : n.childNodes[r - 1];
				if (!t) break;
				if (t.nodeType == 3) {
					let n = e.domSelection();
					n && n.collapse(t, t.nodeValue.length);
					break;
				}
				n = t, r = -1;
			}
		}
		e.input.composing = !0;
	}
	xo(e, yo);
};
function bo(e) {
	let { focusNode: t, focusOffset: n } = e.domSelectionRange();
	if (!t || t.nodeType != 1 || n >= t.childNodes.length) return !1;
	let r = t.childNodes[n];
	return r.nodeType == 1 && r.contentEditable == "false";
}
Ja.compositionend = (e, t) => {
	e.composing && (e.input.composing = !1, e.input.compositionEndedAt = t.timeStamp, e.input.compositionPendingChanges = e.domObserver.pendingRecords().length ? e.input.compositionID : 0, e.input.compositionNode = null, e.input.badSafariComposition ? e.domObserver.forceFlush() : e.input.compositionPendingChanges && Promise.resolve().then(() => e.domObserver.flush()), e.input.compositionID++, xo(e, 20));
};
function xo(e, t) {
	clearTimeout(e.input.composingTimeout), t > -1 && (e.input.composingTimeout = setTimeout(() => To(e), t));
}
function So(e) {
	for (e.composing && (e.input.composing = !1, e.input.compositionEndedAt = wo()); e.input.compositionNodes.length > 0;) e.input.compositionNodes.pop().markParentsDirty();
}
function Co(e) {
	let t = e.domSelectionRange();
	if (!t.focusNode) return null;
	let n = gr(t.focusNode, t.focusOffset), r = _r(t.focusNode, t.focusOffset);
	if (n && r && n != r) {
		let t = r.pmViewDesc, i = e.domObserver.lastChangedTextNode;
		if (n == i || r == i) return i;
		if (!t || !t.isText(r.nodeValue)) return r;
		if (e.input.compositionNode == r) {
			let e = n.pmViewDesc;
			if (!(!e || !e.isText(n.nodeValue))) return r;
		}
	}
	return n || r;
}
function wo() {
	let e = document.createEvent("Event");
	return e.initEvent("event", !0, !0), e.timeStamp;
}
function To(e, t = !1) {
	if (!(Br && e.domObserver.flushingSoon >= 0)) {
		if (e.domObserver.forceFlush(), So(e), t || e.docView && e.docView.dirty) {
			let n = Xi(e), r = e.state.selection;
			return n && !n.eq(r) ? e.dispatch(e.state.tr.setSelection(n)) : (e.markCursor || t) && !r.$from.node(r.$from.sharedDepth(r.to)).inlineContent ? e.dispatch(e.state.tr.deleteSelection()) : e.updateState(e.state), !0;
		}
		return !1;
	}
}
function Eo(e, t) {
	if (!e.dom.parentNode) return;
	let n = e.dom.parentNode.appendChild(document.createElement("div"));
	n.appendChild(t), n.style.cssText = "position: fixed; left: -10000px; top: 10px";
	let r = getSelection(), i = document.createRange();
	i.selectNodeContents(t), e.dom.blur(), r.removeAllRanges(), r.addRange(i), setTimeout(() => {
		n.parentNode && n.parentNode.removeChild(n), e.focus();
	}, 50);
}
var Do = Ar && jr < 15 || Lr && Hr < 604;
qa.copy = Ja.cut = (e, t) => {
	let n = t, r = e.state.selection, i = n.type == "cut";
	if (r.empty) return;
	let a = Do ? null : n.clipboardData, { dom: o, text: s } = Aa(e, r.content());
	a ? (n.preventDefault(), a.clearData(), a.setData("text/html", o.innerHTML), a.setData("text/plain", s)) : Eo(e, o), i && e.dispatch(e.state.tr.deleteSelection().scrollIntoView().setMeta("uiEvent", "cut"));
};
function Oo(e) {
	return e.openStart == 0 && e.openEnd == 0 && e.content.childCount == 1 ? e.content.firstChild : null;
}
function ko(e, t) {
	if (!e.dom.parentNode) return;
	let n = e.input.shiftKey || e.state.selection.$from.parent.type.spec.code, r = e.dom.parentNode.appendChild(document.createElement(n ? "textarea" : "div"));
	n || (r.contentEditable = "true"), r.style.cssText = "position: fixed; left: -10000px; top: 10px", r.focus();
	let i = e.input.shiftKey && e.input.lastKeyCode != 45;
	setTimeout(() => {
		e.focus(), r.parentNode && r.parentNode.removeChild(r), n ? Ao(e, r.value, null, i, t) : Ao(e, r.textContent, r.innerHTML, i, t);
	}, 50);
}
function Ao(e, t, n, r, i) {
	let a = ja(e, t, n, r, e.state.selection.$from);
	if (e.someProp("handlePaste", (t) => t(e, i, a || D.empty))) return !0;
	if (!a) return !1;
	let o = Oo(a), s = o ? e.state.tr.replaceSelectionWith(o, r) : e.state.tr.replaceSelection(a);
	return e.dispatch(s.scrollIntoView().setMeta("paste", !0).setMeta("uiEvent", "paste")), !0;
}
function jo(e) {
	let t = e.getData("text/plain") || e.getData("Text");
	if (t) return t;
	let n = e.getData("text/uri-list");
	return n ? n.replace(/\r?\n/g, " ") : "";
}
Ja.paste = (e, t) => {
	let n = t;
	if (e.composing && !Br) return;
	let r = Do ? null : n.clipboardData, i = e.input.shiftKey && e.input.lastKeyCode != 45;
	r && Ao(e, jo(r), r.getData("text/html"), i, n) ? n.preventDefault() : ko(e, n);
};
var Mo = class {
	constructor(e, t, n) {
		this.slice = e, this.move = t, this.node = n;
	}
}, No = Rr ? "altKey" : "ctrlKey";
function Po(e, t) {
	let n;
	return e.someProp("dragCopies", (e) => {
		n = n || e(t);
	}), n == null ? !t[No] : !n;
}
qa.dragstart = (e, t) => {
	let n = t, r = e.input.mouseDown;
	if (r && r.done(), !n.dataTransfer) return;
	let i = e.state.selection, a = i.empty ? null : e.posAtCoords(io(n)), o;
	if (!(a && a.pos >= i.from && a.pos <= (i instanceof M ? i.to - 1 : i.to))) {
		if (r && r.mightDrag) o = M.create(e.state.doc, r.mightDrag.pos);
		else if (n.target && n.target.nodeType == 1) {
			let t = e.docView.nearestDesc(n.target, !0);
			t && t.node.type.spec.draggable && t != e.docView && (o = M.create(e.state.doc, t.posBefore));
		}
	}
	let { dom: s, text: c, slice: l } = Aa(e, (o || e.state.selection).content());
	(!n.dataTransfer.files.length || !Pr || Fr > 120) && n.dataTransfer.clearData(), n.dataTransfer.setData(Do ? "Text" : "text/html", s.innerHTML), n.dataTransfer.effectAllowed = "copyMove", Do || n.dataTransfer.setData("text/plain", c), e.dragging = new Mo(l, Po(e, n), o);
}, qa.dragend = (e) => {
	let t = e.dragging;
	window.setTimeout(() => {
		e.dragging == t && (e.dragging = null);
	}, 50);
}, Ja.dragover = Ja.dragenter = (e, t) => t.preventDefault(), Ja.drop = (e, t) => {
	try {
		Fo(e, t, e.dragging);
	} finally {
		e.dragging = null;
	}
};
function Fo(e, t, n) {
	if (!t.dataTransfer) return;
	let r = e.posAtCoords(io(t));
	if (!r) return;
	let i = e.state.doc.resolve(r.pos), a = n && n.slice;
	a ? e.someProp("transformPasted", (t) => {
		a = t(a, e, !1);
	}) : a = ja(e, jo(t.dataTransfer), Do ? null : t.dataTransfer.getData("text/html"), !1, i);
	let o = !!(n && Po(e, t));
	if (e.someProp("handleDrop", (n) => n(e, t, a || D.empty, o))) {
		t.preventDefault();
		return;
	}
	if (!a) return;
	t.preventDefault();
	let s = a ? _n(e.state.doc, i.pos, a) : i.pos;
	s == null && (s = i.pos);
	let c = e.state.tr;
	if (o) {
		let { node: e } = n;
		e ? e.replace(c) : c.deleteSelection();
	}
	let l = c.mapping.map(s), u = a.openStart == 0 && a.openEnd == 0 && a.content.childCount == 1, d = c.doc;
	if (u ? c.replaceRangeWith(l, l, a.content.firstChild) : c.replaceRange(l, l, a), c.doc.eq(d)) return;
	let f = c.doc.resolve(l);
	if (u && M.isSelectable(a.content.firstChild) && f.nodeAfter && f.nodeAfter.sameMarkup(a.content.firstChild)) c.setSelection(new M(f));
	else {
		let t = c.mapping.map(s);
		c.mapping.maps[c.mapping.maps.length - 1].forEach((e, n, r, i) => t = i), c.setSelection(sa(e, f, c.doc.resolve(t)));
	}
	e.focus(), e.dispatch(c.setMeta("uiEvent", "drop"));
}
qa.focus = (e) => {
	e.input.lastFocus = Date.now(), e.focused || (e.domObserver.stop(), e.dom.classList.add("ProseMirror-focused"), e.domObserver.start(), e.focused = !0, setTimeout(() => {
		e.docView && e.hasFocus() && !e.domObserver.currentSelection.eq(e.domSelectionRange()) && Qi(e);
	}, 20));
}, qa.blur = (e, t) => {
	let n = t;
	e.focused && (e.domObserver.stop(), e.dom.classList.remove("ProseMirror-focused"), e.domObserver.start(), n.relatedTarget && e.dom.contains(n.relatedTarget) && e.domObserver.currentSelection.clear(), e.focused = !1);
}, qa.beforeinput = (e, t) => {
	if (Pr && Br && t.inputType == "deleteContentBackward") {
		e.domObserver.flushSoon();
		let { domChangeCount: t } = e.input;
		setTimeout(() => {
			if (e.input.domChangeCount != t || (e.dom.blur(), e.focus(), e.someProp("handleKeyDown", (t) => t(e, xr(8, "Backspace"))))) return;
			let { $cursor: n } = e.state.selection;
			n && n.pos > 0 && e.dispatch(e.state.tr.delete(n.pos - 1, n.pos).scrollIntoView());
		}, 50);
	}
};
for (let e in Ja) qa[e] = Ja[e];
function Io(e, t) {
	if (e == t) return !0;
	for (let n in e) if (e[n] !== t[n]) return !1;
	for (let n in t) if (!(n in e)) return !1;
	return !0;
}
var Lo = class e {
	constructor(e, t) {
		this.toDOM = e, this.spec = t || Ho, this.side = this.spec.side || 0;
	}
	map(e, t, n, r) {
		let { pos: i, deleted: a } = e.mapResult(t.from + r, this.side < 0 ? -1 : 1);
		return a ? null : new Bo(i - n, i - n, this);
	}
	valid() {
		return !0;
	}
	eq(t) {
		return this == t || t instanceof e && (this.spec.key && this.spec.key == t.spec.key || this.toDOM == t.toDOM && Io(this.spec, t.spec));
	}
	destroy(e) {
		this.spec.destroy && this.spec.destroy(e);
	}
}, Ro = class e {
	constructor(e, t) {
		this.attrs = e, this.spec = t || Ho;
	}
	map(e, t, n, r) {
		let i = e.map(t.from + r, this.spec.inclusiveStart ? -1 : 1) - n, a = e.map(t.to + r, this.spec.inclusiveEnd ? 1 : -1) - n;
		return i >= a ? null : new Bo(i, a, this);
	}
	valid(e, t) {
		return t.from < t.to;
	}
	eq(t) {
		return this == t || t instanceof e && Io(this.attrs, t.attrs) && Io(this.spec, t.spec);
	}
	static is(t) {
		return t.type instanceof e;
	}
	destroy() {}
}, zo = class e {
	constructor(e, t) {
		this.attrs = e, this.spec = t || Ho;
	}
	map(e, t, n, r) {
		let i = e.mapResult(t.from + r, 1);
		if (i.deleted) return null;
		let a = e.mapResult(t.to + r, -1);
		return a.deleted || a.pos <= i.pos ? null : new Bo(i.pos - n, a.pos - n, this);
	}
	valid(e, t) {
		let { index: n, offset: r } = e.content.findIndex(t.from), i;
		return r == t.from && !(i = e.child(n)).isText && r + i.nodeSize == t.to;
	}
	eq(t) {
		return this == t || t instanceof e && Io(this.attrs, t.attrs) && Io(this.spec, t.spec);
	}
	destroy() {}
}, Bo = class e {
	constructor(e, t, n) {
		this.from = e, this.to = t, this.type = n;
	}
	copy(t, n) {
		return new e(t, n, this.type);
	}
	eq(e, t = 0) {
		return this.type.eq(e.type) && this.from + t == e.from && this.to + t == e.to;
	}
	map(e, t, n) {
		return this.type.map(e, this, t, n);
	}
	static widget(t, n, r) {
		return new e(t, t, new Lo(n, r));
	}
	static inline(t, n, r, i) {
		return new e(t, n, new Ro(r, i));
	}
	static node(t, n, r, i) {
		return new e(t, n, new zo(r, i));
	}
	get spec() {
		return this.type.spec;
	}
	get inline() {
		return this.type instanceof Ro;
	}
	get widget() {
		return this.type instanceof Lo;
	}
}, Vo = [], Ho = {}, Uo = class e {
	constructor(e, t) {
		this.local = e.length ? e : Vo, this.children = t.length ? t : Vo;
	}
	static create(e, t) {
		return t.length ? Zo(t, e, 0, Ho) : Wo;
	}
	find(e, t, n) {
		let r = [];
		return this.findInner(e == null ? 0 : e, t == null ? 1e9 : t, r, 0, n), r;
	}
	findInner(e, t, n, r, i) {
		for (let a = 0; a < this.local.length; a++) {
			let o = this.local[a];
			o.from <= t && o.to >= e && (!i || i(o.spec)) && n.push(o.copy(o.from + r, o.to + r));
		}
		for (let a = 0; a < this.children.length; a += 3) if (this.children[a] < t && this.children[a + 1] > e) {
			let o = this.children[a] + 1;
			this.children[a + 2].findInner(e - o, t - o, n, r + o, i);
		}
	}
	map(e, t, n) {
		return this == Wo || e.maps.length == 0 ? this : this.mapInner(e, t, 0, 0, n || Ho);
	}
	mapInner(t, n, r, i, a) {
		let o;
		for (let e = 0; e < this.local.length; e++) {
			let s = this.local[e].map(t, r, i);
			s && s.type.valid(n, s) ? (o || (o = [])).push(s) : a.onRemove && a.onRemove(this.local[e].spec);
		}
		return this.children.length ? Ko(this.children, o || [], t, n, r, i, a) : o ? new e(o.sort(Qo), Vo) : Wo;
	}
	add(t, n) {
		return n.length ? this == Wo ? e.create(t, n) : this.addInner(t, n, 0) : this;
	}
	addInner(t, n, r) {
		let i, a = 0;
		t.forEach((e, t) => {
			let o = t + r, s;
			if (s = Yo(n, e, o)) {
				for (i || (i = this.children.slice()); a < i.length && i[a] < t;) a += 3;
				i[a] == t ? i[a + 2] = i[a + 2].addInner(e, s, o + 1) : i.splice(a, 0, t, t + e.nodeSize, Zo(s, e, o + 1, Ho)), a += 3;
			}
		});
		let o = qo(a ? Xo(n) : n, -r);
		for (let e = 0; e < o.length; e++) o[e].type.valid(t, o[e]) || o.splice(e--, 1);
		return new e(o.length ? this.local.concat(o).sort(Qo) : this.local, i || this.children);
	}
	remove(e) {
		return e.length == 0 || this == Wo ? this : this.removeInner(e, 0);
	}
	removeInner(t, n) {
		let r = this.children, i = this.local;
		for (let e = 0; e < r.length; e += 3) {
			let i, a = r[e] + n, o = r[e + 1] + n;
			for (let e = 0, n; e < t.length; e++) (n = t[e]) && n.from > a && n.to < o && (t[e] = null, (i || (i = [])).push(n));
			if (!i) continue;
			r == this.children && (r = this.children.slice());
			let s = r[e + 2].removeInner(i, a + 1);
			s == Wo ? (r.splice(e, 3), e -= 3) : r[e + 2] = s;
		}
		if (i.length) {
			for (let e = 0, r; e < t.length; e++) if (r = t[e]) for (let e = 0; e < i.length; e++) i[e].eq(r, n) && (i == this.local && (i = this.local.slice()), i.splice(e--, 1));
		}
		return r == this.children && i == this.local ? this : i.length || r.length ? new e(i, r) : Wo;
	}
	forChild(t, n) {
		if (this == Wo) return this;
		if (n.isLeaf) return e.empty;
		let r, i;
		for (let e = 0; e < this.children.length; e += 3) if (this.children[e] >= t) {
			this.children[e] == t && (r = this.children[e + 2]);
			break;
		}
		let a = t + 1, o = a + n.content.size;
		for (let e = 0; e < this.local.length; e++) {
			let t = this.local[e];
			if (t.from < o && t.to > a && t.type instanceof Ro) {
				let e = Math.max(a, t.from) - a, n = Math.min(o, t.to) - a;
				e < n && (i || (i = [])).push(t.copy(e, n));
			}
		}
		if (i) {
			let t = new e(i.sort(Qo), Vo);
			return r ? new Go([t, r]) : t;
		}
		return r || Wo;
	}
	eq(t) {
		if (this == t) return !0;
		if (!(t instanceof e) || this.local.length != t.local.length || this.children.length != t.children.length) return !1;
		for (let e = 0; e < this.local.length; e++) if (!this.local[e].eq(t.local[e])) return !1;
		for (let e = 0; e < this.children.length; e += 3) if (this.children[e] != t.children[e] || this.children[e + 1] != t.children[e + 1] || !this.children[e + 2].eq(t.children[e + 2])) return !1;
		return !0;
	}
	locals(e) {
		return $o(this.localsInner(e));
	}
	localsInner(e) {
		if (this == Wo) return Vo;
		if (e.inlineContent || !this.local.some(Ro.is)) return this.local;
		let t = [];
		for (let e = 0; e < this.local.length; e++) this.local[e].type instanceof Ro || t.push(this.local[e]);
		return t;
	}
	forEachSet(e) {
		e(this);
	}
};
Uo.empty = new Uo([], []), Uo.removeOverlap = $o;
var Wo = Uo.empty, Go = class e {
	constructor(e) {
		this.members = e;
	}
	map(t, n) {
		let r = this.members.map((e) => e.map(t, n, Ho));
		return e.from(r);
	}
	forChild(t, n) {
		if (n.isLeaf) return Uo.empty;
		let r = [];
		for (let i = 0; i < this.members.length; i++) {
			let a = this.members[i].forChild(t, n);
			a != Wo && (a instanceof e ? r = r.concat(a.members) : r.push(a));
		}
		return e.from(r);
	}
	eq(t) {
		if (!(t instanceof e) || t.members.length != this.members.length) return !1;
		for (let e = 0; e < this.members.length; e++) if (!this.members[e].eq(t.members[e])) return !1;
		return !0;
	}
	locals(e) {
		let t, n = !0;
		for (let r = 0; r < this.members.length; r++) {
			let i = this.members[r].localsInner(e);
			if (i.length) {
				if (!t) t = i;
				else {
					n && (t = t.slice(), n = !1);
					for (let e = 0; e < i.length; e++) t.push(i[e]);
				}
			}
		}
		return t ? $o(n ? t : t.sort(Qo)) : Vo;
	}
	static from(t) {
		switch (t.length) {
			case 0: return Wo;
			case 1: return t[0];
			default: return new e(t.every((e) => e instanceof Uo) ? t : t.reduce((e, t) => e.concat(t instanceof Uo ? t : t.members), []));
		}
	}
	forEachSet(e) {
		for (let t = 0; t < this.members.length; t++) this.members[t].forEachSet(e);
	}
};
function Ko(e, t, n, r, i, a, o) {
	let s = e.slice();
	for (let e = 0, t = a; e < n.maps.length; e++) {
		let r = 0;
		n.maps[e].forEach((e, n, i, a) => {
			let o = a - i - (n - e);
			for (let i = 0; i < s.length; i += 3) {
				let a = s[i + 1];
				if (a < 0 || e > a + t - r) continue;
				let c = s[i] + t - r;
				n >= c ? s[i + 1] = e <= c ? -2 : -1 : e >= t && o && (s[i] += o, s[i + 1] += o);
			}
			r += o;
		}), t = n.maps[e].map(t, -1);
	}
	let c = !1;
	for (let t = 0; t < s.length; t += 3) if (s[t + 1] < 0) {
		if (s[t + 1] == -2) {
			c = !0, s[t + 1] = -1;
			continue;
		}
		let l = n.map(e[t] + a), u = l - i;
		if (u < 0 || u >= r.content.size) {
			c = !0;
			continue;
		}
		let d = n.map(e[t + 1] + a, -1) - i, { index: f, offset: p } = r.content.findIndex(u), m = r.maybeChild(f);
		if (m && p == u && p + m.nodeSize == d) {
			let r = s[t + 2].mapInner(n, m, l + 1, e[t] + a + 1, o);
			r == Wo ? (s[t + 1] = -2, c = !0) : (s[t] = u, s[t + 1] = d, s[t + 2] = r);
		} else c = !0;
	}
	if (c) {
		let c = Zo(Jo(s, e, t, n, i, a, o), r, 0, o);
		t = c.local;
		for (let e = 0; e < s.length; e += 3) s[e + 1] < 0 && (s.splice(e, 3), e -= 3);
		for (let e = 0, t = 0; e < c.children.length; e += 3) {
			let n = c.children[e];
			for (; t < s.length && s[t] < n;) t += 3;
			s.splice(t, 0, c.children[e], c.children[e + 1], c.children[e + 2]);
		}
	}
	return new Uo(t.sort(Qo), s);
}
function qo(e, t) {
	if (!t || !e.length) return e;
	let n = [];
	for (let r = 0; r < e.length; r++) {
		let i = e[r];
		n.push(new Bo(i.from + t, i.to + t, i.type));
	}
	return n;
}
function Jo(e, t, n, r, i, a, o) {
	function s(e, t) {
		for (let a = 0; a < e.local.length; a++) {
			let s = e.local[a].map(r, i, t);
			s ? n.push(s) : o.onRemove && o.onRemove(e.local[a].spec);
		}
		for (let n = 0; n < e.children.length; n += 3) s(e.children[n + 2], e.children[n] + t + 1);
	}
	for (let n = 0; n < e.length; n += 3) e[n + 1] == -1 && s(e[n + 2], t[n] + a + 1);
	return n;
}
function Yo(e, t, n) {
	if (t.isLeaf) return null;
	let r = n + t.nodeSize, i = null;
	for (let t = 0, a; t < e.length; t++) (a = e[t]) && a.from > n && a.to < r && ((i || (i = [])).push(a), e[t] = null);
	return i;
}
function Xo(e) {
	let t = [];
	for (let n = 0; n < e.length; n++) e[n] != null && t.push(e[n]);
	return t;
}
function Zo(e, t, n, r) {
	let i = [], a = !1;
	t.forEach((t, o) => {
		let s = Yo(e, t, o + n);
		if (s) {
			a = !0;
			let e = Zo(s, t, n + o + 1, r);
			e != Wo && i.push(o, o + t.nodeSize, e);
		}
	});
	let o = qo(a ? Xo(e) : e, -n).sort(Qo);
	for (let e = 0; e < o.length; e++) o[e].type.valid(t, o[e]) || (r.onRemove && r.onRemove(o[e].spec), o.splice(e--, 1));
	return o.length || i.length ? new Uo(o, i) : Wo;
}
function Qo(e, t) {
	return e.from - t.from || e.to - t.to;
}
function $o(e) {
	let t = e;
	for (let n = 0; n < t.length - 1; n++) {
		let r = t[n];
		if (r.from != r.to) for (let i = n + 1; i < t.length; i++) {
			let a = t[i];
			if (a.from == r.from) {
				a.to != r.to && (t == e && (t = e.slice()), t[i] = a.copy(a.from, r.to), es(t, i + 1, a.copy(r.to, a.to)));
				continue;
			}
			a.from < r.to && (t == e && (t = e.slice()), t[n] = r.copy(r.from, a.from), es(t, i, r.copy(a.from, r.to)));
			break;
		}
	}
	return t;
}
function es(e, t, n) {
	for (; t < e.length && Qo(n, e[t]) > 0;) t++;
	e.splice(t, 0, n);
}
function ts(e) {
	let t = [];
	return e.someProp("decorations", (n) => {
		let r = n(e.state);
		r && r != Wo && t.push(r);
	}), e.cursorWrapper && t.push(Uo.create(e.state.doc, [e.cursorWrapper.deco])), Go.from(t);
}
var ns = {
	childList: !0,
	characterData: !0,
	characterDataOldValue: !0,
	attributes: !0,
	attributeOldValue: !0,
	subtree: !0
}, rs = Ar && jr <= 11, is = class {
	constructor() {
		this.anchorNode = null, this.anchorOffset = 0, this.focusNode = null, this.focusOffset = 0;
	}
	set(e) {
		this.anchorNode = e.anchorNode, this.anchorOffset = e.anchorOffset, this.focusNode = e.focusNode, this.focusOffset = e.focusOffset;
	}
	clear() {
		this.anchorNode = this.focusNode = null;
	}
	eq(e) {
		return e.anchorNode == this.anchorNode && e.anchorOffset == this.anchorOffset && e.focusNode == this.focusNode && e.focusOffset == this.focusOffset;
	}
}, as = class {
	constructor(e, t) {
		this.view = e, this.handleDOMChange = t, this.queue = [], this.flushingSoon = -1, this.observer = null, this.currentSelection = new is(), this.onCharData = null, this.suppressingSelectionUpdates = !1, this.lastChangedTextNode = null, this.observer = window.MutationObserver && new window.MutationObserver((t) => {
			for (let e = 0; e < t.length; e++) this.queue.push(t[e]);
			Ar && jr <= 11 && t.some((e) => e.type == "childList" && e.removedNodes.length || e.type == "characterData" && e.oldValue.length > e.target.nodeValue.length) ? this.flushSoon() : Ir && e.composing && t.some((e) => e.type == "childList" && e.target.nodeName == "TR") ? (e.input.badSafariComposition = !0, this.flushSoon()) : this.flush();
		}), rs && (this.onCharData = (e) => {
			this.queue.push({
				target: e.target,
				type: "characterData",
				oldValue: e.prevValue
			}), this.flushSoon();
		}), this.onSelectionChange = this.onSelectionChange.bind(this);
	}
	flushSoon() {
		this.flushingSoon < 0 && (this.flushingSoon = window.setTimeout(() => {
			this.flushingSoon = -1, this.flush();
		}, 20));
	}
	forceFlush() {
		this.flushingSoon > -1 && (window.clearTimeout(this.flushingSoon), this.flushingSoon = -1, this.flush());
	}
	start() {
		this.observer && (this.observer.takeRecords(), this.observer.observe(this.view.dom, ns)), this.onCharData && this.view.dom.addEventListener("DOMCharacterDataModified", this.onCharData), this.connectSelection();
	}
	stop() {
		if (this.observer) {
			let e = this.observer.takeRecords();
			if (e.length) {
				for (let t = 0; t < e.length; t++) this.queue.push(e[t]);
				window.setTimeout(() => this.flush(), 20);
			}
			this.observer.disconnect();
		}
		this.onCharData && this.view.dom.removeEventListener("DOMCharacterDataModified", this.onCharData), this.disconnectSelection();
	}
	connectSelection() {
		this.view.dom.ownerDocument.addEventListener("selectionchange", this.onSelectionChange);
	}
	disconnectSelection() {
		this.view.dom.ownerDocument.removeEventListener("selectionchange", this.onSelectionChange);
	}
	suppressSelectionUpdates() {
		this.suppressingSelectionUpdates = !0, setTimeout(() => this.suppressingSelectionUpdates = !1, 50);
	}
	onSelectionChange() {
		if (ca(this.view)) {
			if (this.suppressingSelectionUpdates) return Qi(this.view);
			if (Ar && jr <= 11 && !this.view.state.selection.empty) {
				let e = this.view.domSelectionRange();
				if (e.focusNode && fr(e.focusNode, e.focusOffset, e.anchorNode, e.anchorOffset)) return this.flushSoon();
			}
			this.flush();
		}
	}
	setCurSelection() {
		this.currentSelection.set(this.view.domSelectionRange());
	}
	ignoreSelectionChange(e) {
		if (!e.focusNode) return !0;
		let t = /* @__PURE__ */ new Set(), n;
		for (let n = e.focusNode; n; n = cr(n)) t.add(n);
		for (let r = e.anchorNode; r; r = cr(r)) if (t.has(r)) {
			n = r;
			break;
		}
		let r = n && this.view.docView.nearestDesc(n);
		if (r && r.ignoreMutation({
			type: "selection",
			target: n.nodeType == 3 ? n.parentNode : n
		})) return this.setCurSelection(), !0;
	}
	pendingRecords() {
		if (this.observer) for (let e of this.observer.takeRecords()) this.queue.push(e);
		return this.queue;
	}
	flush() {
		let { view: e } = this;
		if (!e.docView || this.flushingSoon > -1) return;
		let t = this.pendingRecords();
		t.length && (this.queue = []);
		let n = e.domSelectionRange(), r = !this.suppressingSelectionUpdates && !this.currentSelection.eq(n) && ca(e) && !this.ignoreSelectionChange(n), i = -1, a = -1, o = !1, s = [];
		if (e.editable) for (let e = 0; e < t.length; e++) {
			let n = this.registerMutation(t[e], s);
			n && (i = i < 0 ? n.from : Math.min(n.from, i), a = a < 0 ? n.to : Math.max(n.to, a), n.typeOver && (o = !0));
		}
		if (s.some((e) => e.nodeName == "BR") && (e.input.lastKeyCode == 8 || e.input.lastKeyCode == 46)) {
			for (let e of s) if (e.nodeName == "BR" && e.parentNode) {
				let t = e.nextSibling;
				for (; t && t.nodeType == 1;) {
					if (t.contentEditable == "false") {
						e.parentNode.removeChild(e);
						break;
					}
					t = t.firstChild;
				}
			}
		} else if (Mr && s.length) {
			let t = s.filter((e) => e.nodeName == "BR");
			if (t.length == 2) {
				let [e, n] = t;
				e.parentNode && e.parentNode.parentNode == n.parentNode ? n.remove() : e.remove();
			} else {
				let { focusNode: n } = this.currentSelection;
				for (let r of t) {
					let t = r.parentNode;
					t && t.nodeName == "LI" && (!n || fs(e, n) != t) && r.remove();
				}
			}
		}
		let c = null;
		i < 0 && r && e.input.lastFocus > Date.now() - 200 && Math.max(e.input.lastTouch, e.input.lastClick.time) < Date.now() - 300 && br(n) && (c = Xi(e)) && c.eq(A.near(e.state.doc.resolve(0), 1)) ? (e.input.lastFocus = 0, Qi(e), this.currentSelection.set(n), e.scrollToSelection()) : (i > -1 || r) && (i > -1 && (e.docView.markDirty(i, a), ls(e)), e.input.badSafariComposition && (e.input.badSafariComposition = !1, ps(e, s)), this.handleDOMChange(i, a, o, s), e.docView && e.docView.dirty ? e.updateState(e.state) : this.currentSelection.eq(n) || Qi(e), this.currentSelection.set(n));
	}
	registerMutation(e, t) {
		if (t.indexOf(e.target) > -1) return null;
		let n = this.view.docView.nearestDesc(e.target);
		if (e.type == "attributes" && (n == this.view.docView || e.attributeName == "contenteditable" || e.attributeName == "style" && !e.oldValue && !e.target.getAttribute("style")) || !n || n.ignoreMutation(e)) return null;
		if (e.type == "childList") {
			for (let n = 0; n < e.addedNodes.length; n++) {
				let r = e.addedNodes[n];
				t.push(r), r.nodeType == 3 && (this.lastChangedTextNode = r);
			}
			if (n.contentDOM && n.contentDOM != n.dom && !n.contentDOM.contains(e.target)) return {
				from: n.posBefore,
				to: n.posAfter
			};
			let r = e.previousSibling, i = e.nextSibling;
			if (Ar && jr <= 11 && e.addedNodes.length) for (let t = 0; t < e.addedNodes.length; t++) {
				let { previousSibling: n, nextSibling: a } = e.addedNodes[t];
				(!n || Array.prototype.indexOf.call(e.addedNodes, n) < 0) && (r = n), (!a || Array.prototype.indexOf.call(e.addedNodes, a) < 0) && (i = a);
			}
			let a = r && r.parentNode == e.target ? sr(r) + 1 : 0, o = n.localPosFromDOM(e.target, a, -1), s = i && i.parentNode == e.target ? sr(i) : e.target.childNodes.length;
			return {
				from: o,
				to: n.localPosFromDOM(e.target, s, 1)
			};
		}
		return e.type == "attributes" ? {
			from: n.posAtStart - n.border,
			to: n.posAtEnd + n.border
		} : (this.lastChangedTextNode = e.target, {
			from: n.posAtStart,
			to: n.posAtEnd,
			typeOver: e.target.nodeValue == e.oldValue
		});
	}
}, ss = /* @__PURE__ */ new WeakMap(), cs = !1;
function ls(e) {
	if (!ss.has(e) && (ss.set(e, null), [
		"normal",
		"nowrap",
		"pre-line"
	].indexOf(getComputedStyle(e.dom).whiteSpace) !== -1)) {
		if (e.requiresGeckoHackNode = Mr, cs) return;
		console.warn("ProseMirror expects the CSS white-space property to be set, preferably to 'pre-wrap'. It is recommended to load style/prosemirror.css from the prosemirror-view package."), cs = !0;
	}
}
function us(e, t) {
	let n = t.startContainer, r = t.startOffset, i = t.endContainer, a = t.endOffset, o = e.domAtPos(e.state.selection.anchor);
	return fr(o.node, o.offset, i, a) && ([n, r, i, a] = [
		i,
		a,
		n,
		r
	]), {
		anchorNode: n,
		anchorOffset: r,
		focusNode: i,
		focusOffset: a
	};
}
function ds(e, t) {
	if (t.getComposedRanges) {
		let n = t.getComposedRanges(e.root)[0];
		if (n) return us(e, n);
	}
	let n;
	function r(e) {
		e.preventDefault(), e.stopImmediatePropagation(), n = e.getTargetRanges()[0];
	}
	return e.dom.addEventListener("beforeinput", r, !0), document.execCommand("indent"), e.dom.removeEventListener("beforeinput", r, !0), n ? us(e, n) : null;
}
function fs(e, t) {
	for (let n = t.parentNode; n && n != e.dom; n = n.parentNode) {
		let t = e.docView.nearestDesc(n, !0);
		if (t && t.node.isBlock) return n;
	}
	return null;
}
function ps(e, t) {
	var n;
	let { focusNode: r, focusOffset: i } = e.domSelectionRange();
	for (let a of t) if (((n = a.parentNode) == null ? void 0 : n.nodeName) == "TR") {
		let t = a.nextSibling;
		for (; t && t.nodeName != "TD" && t.nodeName != "TH";) t = t.nextSibling;
		if (t) {
			let n = t;
			for (;;) {
				let e = n.firstChild;
				if (!e || e.nodeType != 1 || e.contentEditable == "false" || /^(BR|IMG)$/.test(e.nodeName)) break;
				n = e;
			}
			n.insertBefore(a, n.firstChild), r == a && e.domSelection().collapse(a, i);
		} else a.parentNode.removeChild(a);
	}
}
function ms(e, t, n) {
	let { node: r, fromOffset: i, toOffset: a, from: o, to: s } = e.docView.parseRange(t, n), c = e.domSelectionRange(), l, u = c.anchorNode;
	if (u && e.dom.contains(u.nodeType == 1 ? u : u.parentNode) && (l = [{
		node: u,
		offset: c.anchorOffset
	}], br(c) || l.push({
		node: c.focusNode,
		offset: c.focusOffset
	})), Pr && e.input.lastKeyCode === 8) for (let e = a; e > i; e--) {
		let t = r.childNodes[e - 1], n = t.pmViewDesc;
		if (t.nodeName == "BR" && !n) {
			a = e;
			break;
		}
		if (!n || n.size) break;
	}
	let d = e.state.doc, f = e.someProp("domParser") || rt.fromSchema(e.state.schema), p = d.resolve(o), m = null, h = f.parse(r, {
		topNode: p.parent,
		topMatch: p.parent.contentMatchAt(p.index()),
		topOpen: !0,
		from: i,
		to: a,
		preserveWhitespace: p.parent.type.whitespace != "pre" || "full",
		findPositions: l,
		ruleFromNode: hs,
		context: p
	});
	if (l && l[0].pos != null) {
		let e = l[0].pos, t = l[1] && l[1].pos;
		t == null && (t = e), m = {
			anchor: e + o,
			head: t + o
		};
	}
	return {
		doc: h,
		sel: m,
		from: o,
		to: s
	};
}
function hs(e) {
	let t = e.pmViewDesc;
	if (t) return t.parseRule();
	if (e.nodeName == "BR" && e.parentNode) {
		if (Ir && /^(ul|ol)$/i.test(e.parentNode.nodeName)) {
			let e = document.createElement("div");
			return e.appendChild(document.createElement("li")), { skip: e };
		}
		if (e.parentNode.lastChild == e || Ir && /^(tr|table)$/i.test(e.parentNode.nodeName)) return { ignore: !0 };
	} else if (e.nodeName == "IMG" && e.getAttribute("mark-placeholder")) return { ignore: !0 };
	return null;
}
var gs = /^(a|abbr|acronym|b|bd[io]|big|br|button|cite|code|data(list)?|del|dfn|em|i|img|ins|kbd|label|map|mark|meter|output|q|ruby|s|samp|small|span|strong|su[bp]|time|u|tt|var)$/i;
function _s(e, t, n, r, i) {
	let a = e.input.compositionPendingChanges || (e.composing ? e.input.compositionID : 0);
	if (e.input.compositionPendingChanges = 0, t < 0) {
		let t = e.input.lastSelectionTime > Date.now() - 50 ? e.input.lastSelectionOrigin : null, n = Xi(e, t);
		if (n && !e.state.selection.eq(n)) {
			if (Pr && Br && e.input.lastKeyCode === 13 && Date.now() - 100 < e.input.lastKeyCodeTime && e.someProp("handleKeyDown", (t) => t(e, xr(13, "Enter")))) return;
			let r = e.state.tr.setSelection(n);
			t == "pointer" ? r.setMeta("pointer", !0) : t == "key" && r.scrollIntoView(), a && r.setMeta("composition", a), e.dispatch(r);
		}
		return;
	}
	let o = e.state.doc.resolve(t), s = o.sharedDepth(n);
	t = o.before(s + 1), n = e.state.doc.resolve(n).after(s + 1);
	let c = e.state.selection, l = ms(e, t, n), u = e.state.doc, d = u.slice(l.from, l.to), f, p;
	e.input.lastKeyCode === 8 && Date.now() - 100 < e.input.lastKeyCodeTime ? (f = e.state.selection.to, p = "end") : (f = e.state.selection.from, p = "start"), e.input.lastKeyCode = null;
	let m = Ss(d.content, l.doc.content, l.from, f, p);
	if (m && e.input.domChangeCount++, (Lr && e.input.lastIOSEnter > Date.now() - 225 || Br) && i.some((e) => e.nodeType == 1 && !gs.test(e.nodeName)) && (!m || m.endA >= m.endB) && e.someProp("handleKeyDown", (t) => t(e, xr(13, "Enter")))) {
		e.input.lastIOSEnter = 0;
		return;
	}
	if (!m) {
		if (r && c instanceof j && !c.empty && c.$head.sameParent(c.$anchor) && !e.composing && !(l.sel && l.sel.anchor != l.sel.head)) m = {
			start: c.from,
			endA: c.to,
			endB: c.to
		};
		else {
			if (l.sel) {
				let t = vs(e, e.state.doc, l.sel);
				if (t && !t.eq(e.state.selection)) {
					let n = e.state.tr.setSelection(t);
					a && n.setMeta("composition", a), e.dispatch(n);
				}
			}
			return;
		}
	}
	e.state.selection.from < e.state.selection.to && m.start == m.endB && e.state.selection instanceof j && (m.start > e.state.selection.from && m.start <= e.state.selection.from + 2 && e.state.selection.from >= l.from ? m.start = e.state.selection.from : m.endA < e.state.selection.to && m.endA >= e.state.selection.to - 2 && e.state.selection.to <= l.to && (m.endB += e.state.selection.to - m.endA, m.endA = e.state.selection.to)), Ar && jr <= 11 && m.endB == m.start + 1 && m.endA == m.start && m.start > l.from && l.doc.textBetween(m.start - l.from - 1, m.start - l.from + 1) == " \xA0" && (m.start--, m.endA--, m.endB--);
	let h = l.doc.resolveNoCache(m.start - l.from), g = l.doc.resolveNoCache(m.endB - l.from), _ = u.resolve(m.start), v = h.sameParent(g) && h.parent.inlineContent && _.end() >= m.endA;
	if ((Lr && e.input.lastIOSEnter > Date.now() - 225 && (!v || i.some((e) => e.nodeName == "DIV" || e.nodeName == "P")) || !v && h.pos < l.doc.content.size && (!h.sameParent(g) || !h.parent.inlineContent) && h.pos < g.pos && !/\S/.test(l.doc.textBetween(h.pos, g.pos, "", ""))) && e.someProp("handleKeyDown", (t) => t(e, xr(13, "Enter")))) {
		e.input.lastIOSEnter = 0;
		return;
	}
	if (e.state.selection.anchor > m.start && bs(u, m.start, m.endA, h, g) && e.someProp("handleKeyDown", (t) => t(e, xr(8, "Backspace")))) {
		Br && Pr && e.domObserver.suppressSelectionUpdates();
		return;
	}
	Pr && m.endB == m.start && (e.input.lastChromeDelete = Date.now()), Br && !v && h.start() != g.start() && g.parentOffset == 0 && h.depth == g.depth && l.sel && l.sel.anchor == l.sel.head && l.sel.head == m.endA && (m.endB -= 2, g = l.doc.resolveNoCache(m.endB - l.from), setTimeout(() => {
		e.someProp("handleKeyDown", function(t) {
			return t(e, xr(13, "Enter"));
		});
	}, 20));
	let y = m.start, b = m.endA, x = (t) => {
		let n = t || e.state.tr.replace(y, b, l.doc.slice(m.start - l.from, m.endB - l.from));
		if (l.sel) {
			let t = vs(e, n.doc, l.sel);
			t && !(Pr && e.composing && t.empty && (m.start != m.endB || e.input.lastChromeDelete < Date.now() - 100) && (t.head == y || t.head == n.mapping.map(b) - 1) || Ar && t.empty && t.head == y) && n.setSelection(t);
		}
		return a && n.setMeta("composition", a), n.scrollIntoView();
	}, S;
	if (v) {
		if (h.pos == g.pos) {
			Ar && jr <= 11 && h.parentOffset == 0 && (e.domObserver.suppressSelectionUpdates(), setTimeout(() => Qi(e), 20));
			let t = x(e.state.tr.delete(y, b)), n = u.resolve(m.start).marksAcross(u.resolve(m.endA));
			n && t.ensureMarks(n), e.dispatch(t);
		} else if (m.endA == m.endB && (S = ys(h.parent.content.cut(h.parentOffset, g.parentOffset), _.parent.content.cut(_.parentOffset, m.endA - _.start())))) {
			let t = x(e.state.tr);
			S.type == "add" ? t.addMark(y, b, S.mark) : t.removeMark(y, b, S.mark), e.dispatch(t);
		} else if (h.parent.child(h.index()).isText && h.index() == g.index() - +!g.textOffset) {
			let t = h.parent.textBetween(h.parentOffset, g.parentOffset), n = () => x(e.state.tr.insertText(t, y, b));
			e.someProp("handleTextInput", (r) => r(e, y, b, t, n)) || e.dispatch(n());
		} else e.dispatch(x());
	} else e.dispatch(x());
}
function vs(e, t, n) {
	return Math.max(n.anchor, n.head) > t.content.size ? null : sa(e, t.resolve(n.anchor), t.resolve(n.head));
}
function ys(e, t) {
	let n = e.firstChild.marks, r = t.firstChild.marks, i = n, a = r, o, s, c;
	for (let e = 0; e < r.length; e++) i = r[e].removeFromSet(i);
	for (let e = 0; e < n.length; e++) a = n[e].removeFromSet(a);
	if (i.length == 1 && a.length == 0) s = i[0], o = "add", c = (e) => e.mark(s.addToSet(e.marks));
	else if (i.length == 0 && a.length == 1) s = a[0], o = "remove", c = (e) => e.mark(s.removeFromSet(e.marks));
	else return null;
	let l = [];
	for (let e = 0; e < t.childCount; e++) l.push(c(t.child(e)));
	if (T.from(l).eq(e)) return {
		mark: s,
		type: o
	};
}
function bs(e, t, n, r, i) {
	if (n - t <= i.pos - r.pos || xs(r, !0, !1) < i.pos) return !1;
	let a = e.resolve(t);
	if (!r.parent.isTextblock) {
		let e = a.nodeAfter;
		return e != null && n == t + e.nodeSize;
	}
	if (a.parentOffset < a.parent.content.size || !a.parent.isTextblock) return !1;
	let o = e.resolve(xs(a, !0, !0));
	return !o.parent.isTextblock || o.pos > n || xs(o, !0, !1) < n ? !1 : r.parent.content.cut(r.parentOffset).eq(o.parent.content);
}
function xs(e, t, n) {
	let r = e.depth, i = t ? e.end() : e.pos;
	for (; r > 0 && (t || e.indexAfter(r) == e.node(r).childCount);) r--, i++, t = !1;
	if (n) {
		let t = e.node(r).maybeChild(e.indexAfter(r));
		for (; t && !t.isLeaf;) t = t.firstChild, i++;
	}
	return i;
}
function Ss(e, t, n, r, i) {
	let a = e.findDiffStart(t, n);
	if (a == null) return null;
	let { a: o, b: s } = e.findDiffEnd(t, n + e.size, n + t.size);
	if (i == "end") {
		let e = Math.max(0, a - Math.min(o, s));
		r -= o + e - a;
	}
	if (o < a && e.size < t.size) {
		let e = r <= a && r >= o ? a - r : 0;
		a -= e, a && a < t.size && Cs(t.textBetween(a - 1, a + 1)) && (a += e ? 1 : -1), s = a + (s - o), o = a;
	} else if (s < a) {
		let t = r <= a && r >= s ? a - r : 0;
		a -= t, a && a < e.size && Cs(e.textBetween(a - 1, a + 1)) && (a += t ? 1 : -1), o = a + (o - s), s = a;
	}
	return {
		start: a,
		endA: o,
		endB: s
	};
}
function Cs(e) {
	if (e.length != 2) return !1;
	let t = e.charCodeAt(0), n = e.charCodeAt(1);
	return t >= 56320 && t <= 57343 && n >= 55296 && n <= 56319;
}
var ws = class {
	constructor(e, t) {
		this._root = null, this.focused = !1, this.trackWrites = null, this.mounted = !1, this.markCursor = null, this.cursorWrapper = null, this.lastSelectedViewDesc = void 0, this.input = new Xa(), this.prevDirectPlugins = [], this.pluginViews = [], this.requiresGeckoHackNode = !1, this.dragging = null, this._props = t, this.state = t.state, this.directPlugins = t.plugins || [], this.directPlugins.forEach(js), this.dispatch = this.dispatch.bind(this), this.dom = e && e.mount || document.createElement("div"), e && (e.appendChild ? e.appendChild(this.dom) : typeof e == "function" ? e(this.dom) : e.mount && (this.mounted = !0)), this.editable = Ds(this), Es(this), this.nodeViews = ks(this), this.docView = Ai(this.state.doc, Ts(this), ts(this), this.dom, this), this.domObserver = new as(this, (e, t, n, r) => _s(this, e, t, n, r)), this.domObserver.start(), Za(this), this.updatePluginViews();
	}
	get composing() {
		return this.input.composing;
	}
	get props() {
		if (this._props.state != this.state) {
			let e = this._props;
			this._props = {};
			for (let t in e) this._props[t] = e[t];
			this._props.state = this.state;
		}
		return this._props;
	}
	update(e) {
		e.handleDOMEvents != this._props.handleDOMEvents && eo(this);
		let t = this._props;
		this._props = e, e.plugins && (e.plugins.forEach(js), this.directPlugins = e.plugins), this.updateStateInner(e.state, t);
	}
	setProps(e) {
		let t = {};
		for (let e in this._props) t[e] = this._props[e];
		t.state = this.state;
		for (let n in e) t[n] = e[n];
		this.update(t);
	}
	updateState(e) {
		this.updateStateInner(e, this._props);
	}
	updateStateInner(e, t) {
		var n;
		let r = this.state, i = !1, a = !1;
		e.storedMarks && this.composing && (So(this), a = !0), this.state = e;
		let o = r.plugins != e.plugins || this._props.plugins != t.plugins;
		if (o || this._props.plugins != t.plugins || this._props.nodeViews != t.nodeViews) {
			let e = ks(this);
			As(e, this.nodeViews) && (this.nodeViews = e, i = !0);
		}
		(o || t.handleDOMEvents != this._props.handleDOMEvents) && eo(this), this.editable = Ds(this), Es(this);
		let s = ts(this), c = Ts(this), l = r.plugins != e.plugins && !r.doc.eq(e.doc) ? "reset" : e.scrollToSelection > r.scrollToSelection ? "to selection" : "preserve", u = i || !this.docView.matchesNode(e.doc, c, s);
		(u || !e.selection.eq(r.selection)) && (a = !0);
		let d = l == "preserve" && a && this.dom.style.overflowAnchor == null && qr(this);
		if (a) {
			this.domObserver.stop();
			let t = u && (Ar || Pr) && !this.composing && !r.selection.empty && !e.selection.empty && Os(r.selection, e.selection);
			if (u) {
				let n = Pr ? this.trackWrites = this.domSelectionRange().focusNode : null;
				this.composing && (this.input.compositionNode = Co(this)), (i || !this.docView.update(e.doc, c, s, this)) && (this.docView.updateOuterDeco(c), this.docView.destroy(), this.docView = Ai(e.doc, c, s, this.dom, this)), n && (!this.trackWrites || !this.dom.contains(this.trackWrites)) && (t = !0);
			}
			t || !(this.input.mouseDown && this.domObserver.currentSelection.eq(this.domSelectionRange()) && ua(this)) ? Qi(this, t) : (aa(this, e.selection), this.domObserver.setCurSelection()), this.domObserver.start();
		}
		this.updatePluginViews(r), (n = this.dragging) != null && n.node && !r.doc.eq(e.doc) && this.updateDraggedNode(this.dragging, r), l == "reset" ? this.dom.scrollTop = 0 : l == "to selection" ? this.scrollToSelection() : d && Yr(d);
	}
	scrollToSelection() {
		let e = this.domSelectionRange().focusNode;
		if (!(!e || !this.dom.contains(e.nodeType == 1 ? e : e.parentNode)) && !this.someProp("handleScrollToSelection", (e) => e(this))) {
			if (this.state.selection instanceof M) {
				let t = this.docView.domAfterPos(this.state.selection.from);
				t.nodeType == 1 && Kr(this, t.getBoundingClientRect(), e);
			} else Kr(this, this.coordsAtPos(this.state.selection.head, 1), e);
		}
	}
	destroyPluginViews() {
		let e;
		for (; e = this.pluginViews.pop();) e.destroy && e.destroy();
	}
	updatePluginViews(e) {
		if (!e || e.plugins != this.state.plugins || this.directPlugins != this.prevDirectPlugins) {
			this.prevDirectPlugins = this.directPlugins, this.destroyPluginViews();
			for (let e = 0; e < this.directPlugins.length; e++) {
				let t = this.directPlugins[e];
				t.spec.view && this.pluginViews.push(t.spec.view(this));
			}
			for (let e = 0; e < this.state.plugins.length; e++) {
				let t = this.state.plugins[e];
				t.spec.view && this.pluginViews.push(t.spec.view(this));
			}
		} else for (let t = 0; t < this.pluginViews.length; t++) {
			let n = this.pluginViews[t];
			n.update && n.update(this, e);
		}
	}
	updateDraggedNode(e, t) {
		let n = e.node, r = -1;
		if (n.from < this.state.doc.content.size && this.state.doc.nodeAt(n.from) == n.node) r = n.from;
		else {
			let e = n.from + (this.state.doc.content.size - t.doc.content.size);
			(e > 0 && e < this.state.doc.content.size && this.state.doc.nodeAt(e)) == n.node && (r = e);
		}
		this.dragging = new Mo(e.slice, e.move, r < 0 ? void 0 : M.create(this.state.doc, r));
	}
	someProp(e, t) {
		let n = this._props && this._props[e], r;
		if (n != null && (r = t ? t(n) : n)) return r;
		for (let n = 0; n < this.directPlugins.length; n++) {
			let i = this.directPlugins[n].props[e];
			if (i != null && (r = t ? t(i) : i)) return r;
		}
		let i = this.state.plugins;
		if (i) for (let n = 0; n < i.length; n++) {
			let a = i[n].props[e];
			if (a != null && (r = t ? t(a) : a)) return r;
		}
	}
	hasFocus() {
		if (Ar) {
			let e = this.root.activeElement;
			if (e == this.dom) return !0;
			if (!e || !this.dom.contains(e)) return !1;
			for (; e && this.dom != e && this.dom.contains(e);) {
				if (e.contentEditable == "false") return !1;
				e = e.parentElement;
			}
			return !0;
		}
		return this.root.activeElement == this.dom;
	}
	focus() {
		this.domObserver.stop(), this.editable && Qr(this.dom), Qi(this), this.domObserver.start();
	}
	get root() {
		let e = this._root;
		if (e == null) {
			for (let e = this.dom.parentNode; e; e = e.parentNode) if (e.nodeType == 9 || e.nodeType == 11 && e.host) return e.getSelection || (Object.getPrototypeOf(e).getSelection = () => e.ownerDocument.getSelection()), this._root = e;
		}
		return e || document;
	}
	updateRoot() {
		this._root = null;
	}
	posAtCoords(e) {
		return oi(this, e);
	}
	coordsAtPos(e, t = 1) {
		return ui(this, e, t);
	}
	domAtPos(e, t = 0) {
		return this.docView.domFromPos(e, t);
	}
	nodeDOM(e) {
		let t = this.docView.descAt(e);
		return t ? t.nodeDOM : null;
	}
	posAtDOM(e, t, n = -1) {
		let r = this.docView.posFromDOM(e, t, n);
		if (r == null) throw RangeError("DOM position not inside the editor");
		return r;
	}
	endOfTextblock(e, t) {
		return bi(this, t || this.state, e);
	}
	pasteHTML(e, t) {
		return Ao(this, "", e, !1, t || new ClipboardEvent("paste"));
	}
	pasteText(e, t) {
		return Ao(this, e, null, !0, t || new ClipboardEvent("paste"));
	}
	serializeForClipboard(e) {
		return Aa(this, e);
	}
	destroy() {
		this.docView && ($a(this), this.destroyPluginViews(), this.mounted ? (this.docView.update(this.state.doc, [], ts(this), this), this.dom.textContent = "") : this.dom.parentNode && this.dom.parentNode.removeChild(this.dom), this.docView.destroy(), this.docView = null, dr());
	}
	get isDestroyed() {
		return this.docView == null;
	}
	dispatchEvent(e) {
		return ro(this, e);
	}
	domSelectionRange() {
		let e = this.domSelection();
		return e ? Ir && this.root.nodeType === 11 && Sr(this.dom.ownerDocument) == this.dom && ds(this, e) || e : {
			focusNode: null,
			focusOffset: 0,
			anchorNode: null,
			anchorOffset: 0
		};
	}
	domSelection() {
		return this.root.getSelection();
	}
};
ws.prototype.dispatch = function(e) {
	let t = this._props.dispatchTransaction;
	t ? t.call(this, e) : this.updateState(this.state.apply(e));
};
function Ts(e) {
	let t = Object.create(null);
	return t.class = "ProseMirror", t.contenteditable = String(e.editable), e.someProp("attributes", (n) => {
		if (typeof n == "function" && (n = n(e.state)), n) for (let e in n) e == "class" ? t.class += " " + n[e] : e == "style" ? t.style = (t.style ? t.style + ";" : "") + n[e] : !t[e] && e != "contenteditable" && e != "nodeName" && (t[e] = String(n[e]));
	}), t.translate || (t.translate = "no"), [Bo.node(0, e.state.doc.content.size, t)];
}
function Es(e) {
	if (e.markCursor) {
		let t = document.createElement("img");
		t.className = "ProseMirror-separator", t.setAttribute("mark-placeholder", "true"), t.setAttribute("alt", ""), e.cursorWrapper = {
			dom: t,
			deco: Bo.widget(e.state.selection.from, t, {
				raw: !0,
				marks: e.markCursor
			})
		};
	} else e.cursorWrapper = null;
}
function Ds(e) {
	return !e.someProp("editable", (t) => t(e.state) === !1);
}
function Os(e, t) {
	let n = Math.min(e.$anchor.sharedDepth(e.head), t.$anchor.sharedDepth(t.head));
	return e.$anchor.start(n) != t.$anchor.start(n);
}
function ks(e) {
	let t = Object.create(null);
	function n(e) {
		for (let n in e) Object.prototype.hasOwnProperty.call(t, n) || (t[n] = e[n]);
	}
	return e.someProp("nodeViews", n), e.someProp("markViews", n), t;
}
function As(e, t) {
	let n = 0, r = 0;
	for (let r in e) {
		if (e[r] != t[r]) return !0;
		n++;
	}
	for (let e in t) r++;
	return n != r;
}
function js(e) {
	if (e.spec.state || e.spec.filterTransaction || e.spec.appendTransaction) throw RangeError("Plugins passed directly to the view must not have a state component");
}
for (var Ms = {
	8: "Backspace",
	9: "Tab",
	10: "Enter",
	12: "NumLock",
	13: "Enter",
	16: "Shift",
	17: "Control",
	18: "Alt",
	20: "CapsLock",
	27: "Escape",
	32: " ",
	33: "PageUp",
	34: "PageDown",
	35: "End",
	36: "Home",
	37: "ArrowLeft",
	38: "ArrowUp",
	39: "ArrowRight",
	40: "ArrowDown",
	44: "PrintScreen",
	45: "Insert",
	46: "Delete",
	59: ";",
	61: "=",
	91: "Meta",
	92: "Meta",
	106: "*",
	107: "+",
	108: ",",
	109: "-",
	110: ".",
	111: "/",
	144: "NumLock",
	145: "ScrollLock",
	160: "Shift",
	161: "Shift",
	162: "Control",
	163: "Control",
	164: "Alt",
	165: "Alt",
	173: "-",
	186: ";",
	187: "=",
	188: ",",
	189: "-",
	190: ".",
	191: "/",
	192: "`",
	219: "[",
	220: "\\",
	221: "]",
	222: "'"
}, Ns = {
	48: ")",
	49: "!",
	50: "@",
	51: "#",
	52: "$",
	53: "%",
	54: "^",
	55: "&",
	56: "*",
	57: "(",
	59: ":",
	61: "+",
	173: "_",
	186: ":",
	187: "+",
	188: "<",
	189: "_",
	190: ">",
	191: "?",
	192: "~",
	219: "{",
	220: "|",
	221: "}",
	222: "\""
}, Ps = typeof navigator < "u" && /Mac/.test(navigator.platform), Fs = typeof navigator < "u" && /MSIE \d|Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(navigator.userAgent), Is = 0; Is < 10; Is++) Ms[48 + Is] = Ms[96 + Is] = String(Is);
for (var Is = 1; Is <= 24; Is++) Ms[Is + 111] = "F" + Is;
for (var Is = 65; Is <= 90; Is++) Ms[Is] = String.fromCharCode(Is + 32), Ns[Is] = String.fromCharCode(Is);
for (var Ls in Ms) Ns.hasOwnProperty(Ls) || (Ns[Ls] = Ms[Ls]);
function Rs(e) {
	var t = !(Ps && e.metaKey && e.shiftKey && !e.ctrlKey && !e.altKey || Fs && e.shiftKey && e.key && e.key.length == 1 || e.key == "Unidentified") && e.key || (e.shiftKey ? Ns : Ms)[e.keyCode] || e.key || "Unidentified";
	return t == "Esc" && (t = "Escape"), t == "Del" && (t = "Delete"), t == "Left" && (t = "ArrowLeft"), t == "Up" && (t = "ArrowUp"), t == "Right" && (t = "ArrowRight"), t == "Down" && (t = "ArrowDown"), t;
}
//#endregion
//#region node_modules/prosemirror-keymap/dist/index.js
var zs = typeof navigator < "u" && /Mac|iP(hone|[oa]d)/.test(navigator.platform), Bs = typeof navigator < "u" && /Win/.test(navigator.platform);
function Vs(e) {
	let t = e.split(/-(?!$)/), n = t[t.length - 1];
	n == "Space" && (n = " ");
	let r, i, a, o;
	for (let e = 0; e < t.length - 1; e++) {
		let n = t[e];
		if (/^(cmd|meta|m)$/i.test(n)) o = !0;
		else if (/^a(lt)?$/i.test(n)) r = !0;
		else if (/^(c|ctrl|control)$/i.test(n)) i = !0;
		else if (/^s(hift)?$/i.test(n)) a = !0;
		else if (/^mod$/i.test(n)) zs ? o = !0 : i = !0;
		else throw Error("Unrecognized modifier name: " + n);
	}
	return r && (n = "Alt-" + n), i && (n = "Ctrl-" + n), o && (n = "Meta-" + n), a && (n = "Shift-" + n), n;
}
function Hs(e) {
	let t = Object.create(null);
	for (let n in e) t[Vs(n)] = e[n];
	return t;
}
function Us(e, t, n = !0) {
	return t.altKey && (e = "Alt-" + e), t.ctrlKey && (e = "Ctrl-" + e), t.metaKey && (e = "Meta-" + e), n && t.shiftKey && (e = "Shift-" + e), e;
}
function Ws(e) {
	return new rr({ props: { handleKeyDown: Gs(e) } });
}
function Gs(e) {
	let t = Hs(e);
	return function(e, n) {
		let r = Rs(n), i, a = t[Us(r, n)];
		if (a && a(e.state, e.dispatch, e)) return !0;
		if (r.length == 1 && r != " ") {
			if (n.shiftKey) {
				let i = t[Us(r, n, !1)];
				if (i && i(e.state, e.dispatch, e)) return !0;
			}
			if ((n.altKey || n.metaKey || n.ctrlKey) && !(Bs && n.ctrlKey && n.altKey) && (i = Ms[n.keyCode]) && i != r) {
				let r = t[Us(i, n)];
				if (r && r(e.state, e.dispatch, e)) return !0;
			}
		}
		return !1;
	};
}
//#endregion
//#region node_modules/prosemirror-commands/dist/index.js
var Ks = (e, t) => !e.selection.empty && (t && t(e.tr.deleteSelection().scrollIntoView()), !0);
function qs(e, t) {
	let { $cursor: n } = e.selection;
	return !n || (t ? !t.endOfTextblock("backward", e) : n.parentOffset > 0) ? null : n;
}
var Js = (e, t, n) => {
	let r = qs(e, n);
	if (!r) return !1;
	let i = Zs(r);
	if (!i) {
		let n = r.blockRange(), i = n && Zt(n);
		return i != null && (t && t(e.tr.lift(n, i).scrollIntoView()), !0);
	}
	let a = i.nodeBefore;
	if (dc(e, i, t, -1)) return !0;
	if (r.parent.content.size == 0 && (Ys(a, "end") || M.isSelectable(a))) for (let n = r.depth;; n--) {
		let o = vn(e.doc, r.before(n), r.after(n), D.empty);
		if (o && o.slice.size < o.to - o.from) {
			if (t) {
				let n = e.tr.step(o);
				n.setSelection(Ys(a, "end") ? A.findFrom(n.doc.resolve(n.mapping.map(i.pos, -1)), -1) : M.create(n.doc, i.pos - a.nodeSize)), t(n.scrollIntoView());
			}
			return !0;
		}
		if (n == 1 || r.node(n - 1).childCount > 1) break;
	}
	return a.isAtom && i.depth == r.depth - 1 ? (t && t(e.tr.delete(i.pos - a.nodeSize, i.pos).scrollIntoView()), !0) : !1;
};
function Ys(e, t, n = !1) {
	for (let r = e; r; r = t == "start" ? r.firstChild : r.lastChild) {
		if (r.isTextblock) return !0;
		if (n && r.childCount != 1) return !1;
	}
	return !1;
}
var Xs = (e, t, n) => {
	let { $head: r, empty: i } = e.selection, a = r;
	if (!i) return !1;
	if (r.parent.isTextblock) {
		if (n ? !n.endOfTextblock("backward", e) : r.parentOffset > 0) return !1;
		a = Zs(r);
	}
	let o = a && a.nodeBefore;
	return !o || !M.isSelectable(o) ? !1 : (t && t(e.tr.setSelection(M.create(e.doc, a.pos - o.nodeSize)).scrollIntoView()), !0);
};
function Zs(e) {
	if (!e.parent.type.spec.isolating) for (let t = e.depth - 1; t >= 0; t--) {
		if (e.index(t) > 0) return e.doc.resolve(e.before(t + 1));
		if (e.node(t).type.spec.isolating) break;
	}
	return null;
}
function Qs(e, t) {
	let { $cursor: n } = e.selection;
	return !n || (t ? !t.endOfTextblock("forward", e) : n.parentOffset < n.parent.content.size) ? null : n;
}
var $s = (e, t, n) => {
	let r = Qs(e, n);
	if (!r) return !1;
	let i = tc(r);
	if (!i) return !1;
	let a = i.nodeAfter;
	if (dc(e, i, t, 1)) return !0;
	if (r.parent.content.size == 0 && (Ys(a, "start") || M.isSelectable(a))) {
		let n = vn(e.doc, r.before(), r.after(), D.empty);
		if (n && n.slice.size < n.to - n.from) {
			if (t) {
				let r = e.tr.step(n);
				r.setSelection(Ys(a, "start") ? A.findFrom(r.doc.resolve(r.mapping.map(i.pos)), 1) : M.create(r.doc, r.mapping.map(i.pos))), t(r.scrollIntoView());
			}
			return !0;
		}
	}
	return a.isAtom && i.depth == r.depth - 1 ? (t && t(e.tr.delete(i.pos, i.pos + a.nodeSize).scrollIntoView()), !0) : !1;
}, ec = (e, t, n) => {
	let { $head: r, empty: i } = e.selection, a = r;
	if (!i) return !1;
	if (r.parent.isTextblock) {
		if (n ? !n.endOfTextblock("forward", e) : r.parentOffset < r.parent.content.size) return !1;
		a = tc(r);
	}
	let o = a && a.nodeAfter;
	return !o || !M.isSelectable(o) ? !1 : (t && t(e.tr.setSelection(M.create(e.doc, a.pos)).scrollIntoView()), !0);
};
function tc(e) {
	if (!e.parent.type.spec.isolating) for (let t = e.depth - 1; t >= 0; t--) {
		let n = e.node(t);
		if (e.index(t) + 1 < n.childCount) return e.doc.resolve(e.after(t + 1));
		if (n.type.spec.isolating) break;
	}
	return null;
}
var nc = (e, t) => {
	let { $head: n, $anchor: r } = e.selection;
	return !n.parent.type.spec.code || !n.sameParent(r) ? !1 : (t && t(e.tr.insertText("\n").scrollIntoView()), !0);
};
function rc(e) {
	for (let t = 0; t < e.edgeCount; t++) {
		let { type: n } = e.edge(t);
		if (n.isTextblock && !n.hasRequiredAttrs()) return n;
	}
	return null;
}
var ic = (e, t) => {
	let { $head: n, $anchor: r } = e.selection;
	if (!n.parent.type.spec.code || !n.sameParent(r)) return !1;
	let i = n.node(-1), a = n.indexAfter(-1), o = rc(i.contentMatchAt(a));
	if (!o || !i.canReplaceWith(a, a, o)) return !1;
	if (t) {
		let r = n.after(), i = e.tr.replaceWith(r, r, o.createAndFill());
		i.setSelection(A.near(i.doc.resolve(r), 1)), t(i.scrollIntoView());
	}
	return !0;
}, ac = (e, t) => {
	let n = e.selection, { $from: r, $to: i } = n;
	if (n instanceof Un || r.parent.inlineContent || i.parent.inlineContent) return !1;
	let a = rc(i.parent.contentMatchAt(i.indexAfter()));
	if (!a || !a.isTextblock) return !1;
	if (t) {
		let n = (!r.parentOffset && i.index() < i.parent.childCount ? r : i).pos, o = e.tr.insert(n, a.createAndFill());
		o.setSelection(j.create(o.doc, n + 1)), t(o.scrollIntoView());
	}
	return !0;
}, oc = (e, t) => {
	let { $cursor: n } = e.selection;
	if (!n || n.parent.content.size) return !1;
	if (n.depth > 1 && n.after() != n.end(-1)) {
		let r = n.before();
		if (un(e.doc, r)) return t && t(e.tr.split(r).scrollIntoView()), !0;
	}
	let r = n.blockRange(), i = r && Zt(r);
	return i != null && (t && t(e.tr.lift(r, i).scrollIntoView()), !0);
};
function sc(e) {
	return (t, n) => {
		let { $from: r, $to: i } = t.selection;
		if (t.selection instanceof M && t.selection.node.isBlock) return !r.parentOffset || !un(t.doc, r.pos) ? !1 : (n && n(t.tr.split(r.pos).scrollIntoView()), !0);
		if (!r.depth) return !1;
		let a = [], o, s, c = !1, l = !1;
		for (let t = r.depth;; t--) if (r.node(t).isBlock) {
			c = r.end(t) == r.pos + (r.depth - t), l = r.start(t) == r.pos - (r.depth - t), s = rc(r.node(t - 1).contentMatchAt(r.indexAfter(t - 1)));
			let n = e && e(i.parent, c, r);
			a.unshift(n || (c && s ? { type: s } : null)), o = t;
			break;
		} else {
			if (t == 1) return !1;
			a.unshift(null);
		}
		let u = t.tr;
		(t.selection instanceof j || t.selection instanceof Un) && u.deleteSelection();
		let d = u.mapping.map(r.pos), f = un(u.doc, d, a.length, a);
		if (f || (a[0] = s ? { type: s } : null, f = un(u.doc, d, a.length, a)), !f) return !1;
		if (u.split(d, a.length, a), !c && l && r.node(o).type != s) {
			let e = u.mapping.map(r.before(o)), t = u.doc.resolve(e);
			s && r.node(o - 1).canReplaceWith(t.index(), t.index() + 1, s) && u.setNodeMarkup(u.mapping.map(r.before(o)), s);
		}
		return n && n(u.scrollIntoView()), !0;
	};
}
var cc = sc(), lc = (e, t) => (t && t(e.tr.setSelection(new Un(e.doc))), !0);
function uc(e, t, n) {
	let r = t.nodeBefore, i = t.nodeAfter, a = t.index();
	return !r || !i || !r.type.compatibleContent(i.type) ? !1 : !r.content.size && t.parent.canReplace(a - 1, a) ? (n && n(e.tr.delete(t.pos - r.nodeSize, t.pos).scrollIntoView()), !0) : !t.parent.canReplace(a, a + 1) || !(i.isTextblock || fn(e.doc, t.pos)) ? !1 : (n && n(e.tr.join(t.pos).scrollIntoView()), !0);
}
function dc(e, t, n, r) {
	let i = t.nodeBefore, a = t.nodeAfter, o, s, c = i.type.spec.isolating || a.type.spec.isolating;
	if (!c && uc(e, t, n)) return !0;
	let l = !c && t.parent.canReplace(t.index(), t.index() + 1);
	if (l && (o = (s = i.contentMatchAt(i.childCount)).findWrapping(a.type)) && s.matchType(o[0] || a.type).validEnd) {
		if (n) {
			let r = t.pos + a.nodeSize, s = T.empty;
			for (let e = o.length - 1; e >= 0; e--) s = T.from(o[e].create(null, s));
			s = T.from(i.copy(s));
			let c = e.tr.step(new Gt(t.pos - 1, r, t.pos, r, new D(s, 1, 0), o.length, !0)), l = c.doc.resolve(r + 2 * o.length);
			l.nodeAfter && l.nodeAfter.type == i.type && fn(c.doc, l.pos) && c.join(l.pos), n(c.scrollIntoView());
		}
		return !0;
	}
	let u = a.type.spec.isolating || r > 0 && c ? null : A.findFrom(t, 1), d = u && u.$from.blockRange(u.$to), f = d && Zt(d);
	if (f != null && f >= t.depth) return n && n(e.tr.lift(d, f).scrollIntoView()), !0;
	if (l && Ys(a, "start", !0) && Ys(i, "end")) {
		let r = i, o = [];
		for (; o.push(r), !r.isTextblock;) r = r.lastChild;
		let s = a, c = 1;
		for (; !s.isTextblock; s = s.firstChild) c++;
		if (r.canReplace(r.childCount, r.childCount, s.content)) {
			if (n) {
				let r = T.empty;
				for (let e = o.length - 1; e >= 0; e--) r = T.from(o[e].copy(r));
				n(e.tr.step(new Gt(t.pos - o.length, t.pos + a.nodeSize, t.pos + c, t.pos + a.nodeSize - c, new D(r, o.length, 0), 0, !0)).scrollIntoView());
			}
			return !0;
		}
	}
	return !1;
}
function fc(e) {
	return function(t, n) {
		let r = t.selection, i = e < 0 ? r.$from : r.$to, a = i.depth;
		for (; i.node(a).isInline;) {
			if (!a) return !1;
			a--;
		}
		return i.node(a).isTextblock ? (n && n(t.tr.setSelection(j.create(t.doc, e < 0 ? i.start(a) : i.end(a)))), !0) : !1;
	};
}
var pc = fc(-1), mc = fc(1);
function hc(e, t = null) {
	return function(n, r) {
		let { $from: i, $to: a } = n.selection, o = i.blockRange(a), s = o && $t(o, e, t);
		return s ? (r && r(n.tr.wrap(o, s).scrollIntoView()), !0) : !1;
	};
}
function gc(e, t = null) {
	return function(n, r) {
		let i = !1;
		for (let r = 0; r < n.selection.ranges.length && !i; r++) {
			let { $from: { pos: a }, $to: { pos: o } } = n.selection.ranges[r];
			n.doc.nodesBetween(a, o, (r, a) => {
				if (i) return !1;
				if (!(!r.isTextblock || r.hasMarkup(e, t))) {
					if (r.type == e) i = !0;
					else {
						let t = n.doc.resolve(a), r = t.index();
						i = t.parent.canReplaceWith(r, r + 1, e);
					}
				}
			});
		}
		if (!i) return !1;
		if (r) {
			let i = n.tr;
			for (let r = 0; r < n.selection.ranges.length; r++) {
				let { $from: { pos: a }, $to: { pos: o } } = n.selection.ranges[r];
				i.setBlockType(a, o, e, t);
			}
			r(i.scrollIntoView());
		}
		return !0;
	};
}
function _c(e, t, n, r) {
	for (let i = 0; i < t.length; i++) {
		let { $from: a, $to: o } = t[i], s = a.depth == 0 && e.inlineContent && e.type.allowsMarkType(n);
		if (e.nodesBetween(a.pos, o.pos, (e, t) => {
			if (s || !r && e.isAtom && e.isInline && t >= a.pos && t + e.nodeSize <= o.pos) return !1;
			s = e.inlineContent && e.type.allowsMarkType(n);
		}), s) return !0;
	}
	return !1;
}
function vc(e) {
	let t = [];
	for (let n = 0; n < e.length; n++) {
		let { $from: r, $to: i } = e[n];
		r.doc.nodesBetween(r.pos, i.pos, (e, n) => {
			if (e.isAtom && e.content.size && e.isInline && n >= r.pos && n + e.nodeSize <= i.pos) return n + 1 > r.pos && t.push(new Rn(r, r.doc.resolve(n + 1))), r = r.doc.resolve(n + 1 + e.content.size), !1;
		}), r.pos < i.pos && t.push(new Rn(r, i));
	}
	return t;
}
function yc(e, t = null, n) {
	let r = (n && n.removeWhenPresent) !== !1, i = (n && n.enterInlineAtoms) !== !1, a = !(n && n.includeWhitespace);
	return function(n, o) {
		let { empty: s, $cursor: c, ranges: l } = n.selection;
		if (s && !c || !_c(n.doc, l, e, i)) return !1;
		if (o) {
			if (c) e.isInSet(n.storedMarks || c.marks()) ? o(n.tr.removeStoredMark(e)) : o(n.tr.addStoredMark(e.create(t)));
			else {
				let s, c = n.tr;
				i || (l = vc(l)), s = r ? !l.some((t) => n.doc.rangeHasMark(t.$from.pos, t.$to.pos, e)) : !l.every((t) => {
					let n = !1;
					return c.doc.nodesBetween(t.$from.pos, t.$to.pos, (r, i, a) => {
						if (n) return !1;
						n = !e.isInSet(r.marks) && !!a && a.type.allowsMarkType(e) && !(r.isText && /^\s*$/.test(r.textBetween(Math.max(0, t.$from.pos - i), Math.min(r.nodeSize, t.$to.pos - i))));
					}), !n;
				});
				for (let n = 0; n < l.length; n++) {
					let { $from: r, $to: i } = l[n];
					if (!s) c.removeMark(r.pos, i.pos, e);
					else {
						let n = r.pos, o = i.pos, s = r.nodeAfter, l = i.nodeBefore, u = a && s && s.isText ? /^\s*/.exec(s.text)[0].length : 0, d = a && l && l.isText ? /\s*$/.exec(l.text)[0].length : 0;
						n + u < o && (n += u, o -= d), c.addMark(n, o, e.create(t));
					}
				}
				o(c.scrollIntoView());
			}
		}
		return !0;
	};
}
function bc(...e) {
	return function(t, n, r) {
		for (let i = 0; i < e.length; i++) if (e[i](t, n, r)) return !0;
		return !1;
	};
}
var xc = bc(Ks, Js, Xs), Sc = bc(Ks, $s, ec), Cc = {
	Enter: bc(nc, ac, oc, cc),
	"Mod-Enter": ic,
	Backspace: xc,
	"Mod-Backspace": xc,
	"Shift-Backspace": xc,
	Delete: Sc,
	"Mod-Delete": Sc,
	"Mod-a": lc
}, wc = {
	"Ctrl-h": Cc.Backspace,
	"Alt-Backspace": Cc["Mod-Backspace"],
	"Ctrl-d": Cc.Delete,
	"Ctrl-Alt-Backspace": Cc["Mod-Delete"],
	"Alt-Delete": Cc["Mod-Delete"],
	"Alt-d": Cc["Mod-Delete"],
	"Ctrl-a": pc,
	"Ctrl-e": mc
};
for (let e in Cc) wc[e] = Cc[e];
var Tc = (typeof navigator < "u" ? /Mac|iP(hone|[oa]d)/.test(navigator.platform) : typeof os < "u" && os.platform && os.platform() == "darwin") ? wc : Cc, Ec = class {
	constructor(e, t, n = {}) {
		this.match = e, this.match = e, this.handler = typeof t == "string" ? Dc(t) : t, this.undoable = n.undoable !== !1, this.inCode = n.inCode || !1, this.inCodeMark = n.inCodeMark !== !1;
	}
};
function Dc(e) {
	return function(t, n, r, i) {
		let a = e;
		if (n[1]) {
			let e = n[0].lastIndexOf(n[1]);
			a += n[0].slice(e + n[1].length), r += e;
			let t = r - i;
			t > 0 && (a = n[0].slice(e - t, e) + a, r = i);
		}
		return t.tr.insertText(a, r, i);
	};
}
var Oc = 500;
function kc({ rules: e }) {
	let t = new rr({
		state: {
			init() {
				return null;
			},
			apply(e, t) {
				return e.getMeta(this) || (e.selectionSet || e.docChanged ? null : t);
			}
		},
		props: {
			handleTextInput(n, r, i, a) {
				return Ac(n, r, i, a, e, t);
			},
			handleDOMEvents: { compositionend: (n) => {
				setTimeout(() => {
					let { $cursor: r } = n.state.selection;
					r && Ac(n, r.pos, r.pos, "", e, t);
				});
			} }
		},
		isInputRules: !0
	});
	return t;
}
function Ac(e, t, n, r, i, a) {
	if (e.composing) return !1;
	let o = e.state, s = o.doc.resolve(t), c = s.parent.textBetween(Math.max(0, s.parentOffset - Oc), s.parentOffset, null, "￼") + r;
	for (let l = 0; l < i.length; l++) {
		let u = i[l];
		if (!u.inCodeMark && s.marks().some((e) => e.type.spec.code)) continue;
		if (s.parent.type.spec.code) {
			if (!u.inCode) continue;
		} else if (u.inCode === "only") continue;
		let d = u.match.exec(c);
		if (!d || d[0].length < r.length) continue;
		let f = t - (d[0].length - r.length);
		if (!u.inCodeMark) {
			let e = !1;
			if (o.doc.nodesBetween(f, s.pos, (t) => {
				t.isInline && t.marks.some((e) => e.type.spec.code) && (e = !0);
			}), e) continue;
		}
		let p = u.handler(o, d, f, n);
		if (p) return u.undoable && p.setMeta(a, {
			transform: p,
			from: t,
			to: n,
			text: r
		}), e.dispatch(p), !0;
	}
	return !1;
}
var jc = (e, t) => {
	let n = e.plugins;
	for (let r = 0; r < n.length; r++) {
		let i = n[r], a;
		if (i.spec.isInputRules && (a = i.getState(e))) {
			if (t) {
				let n = e.tr, r = a.transform;
				for (let e = r.steps.length - 1; e >= 0; e--) n.step(r.steps[e].invert(r.docs[e]));
				if (a.text) {
					let t = n.doc.resolve(a.from).marks();
					n.replaceWith(a.from, a.to, e.schema.text(a.text, t));
				} else n.delete(a.from, a.to);
				t(n);
			}
			return !0;
		}
	}
	return !1;
};
new Ec(/--$/, "—", { inCodeMark: !1 }), new Ec(/\.\.\.$/, "…", { inCodeMark: !1 }), new Ec(/(?:^|[\s\{\[\(\<'"\u2018\u201C])(")$/, "“", { inCodeMark: !1 }), new Ec(/"$/, "”", { inCodeMark: !1 }), new Ec(/(?:^|[\s\{\[\(\<'"\u2018\u201C])(')$/, "‘", { inCodeMark: !1 }), new Ec(/'$/, "’", { inCodeMark: !1 });
//#endregion
//#region node_modules/rope-sequence/dist/index.js
var Mc = 200, N = function() {};
N.prototype.append = function(e) {
	return e.length ? (e = N.from(e), !this.length && e || e.length < Mc && this.leafAppend(e) || this.length < Mc && e.leafPrepend(this) || this.appendInner(e)) : this;
}, N.prototype.prepend = function(e) {
	return e.length ? N.from(e).append(this) : this;
}, N.prototype.appendInner = function(e) {
	return new Pc(this, e);
}, N.prototype.slice = function(e, t) {
	return e === void 0 && (e = 0), t === void 0 && (t = this.length), e >= t ? N.empty : this.sliceInner(Math.max(0, e), Math.min(this.length, t));
}, N.prototype.get = function(e) {
	if (!(e < 0 || e >= this.length)) return this.getInner(e);
}, N.prototype.forEach = function(e, t, n) {
	t === void 0 && (t = 0), n === void 0 && (n = this.length), t <= n ? this.forEachInner(e, t, n, 0) : this.forEachInvertedInner(e, t, n, 0);
}, N.prototype.map = function(e, t, n) {
	t === void 0 && (t = 0), n === void 0 && (n = this.length);
	var r = [];
	return this.forEach(function(t, n) {
		return r.push(e(t, n));
	}, t, n), r;
}, N.from = function(e) {
	return e instanceof N ? e : e && e.length ? new Nc(e) : N.empty;
};
var Nc = /* @__PURE__ */ function(e) {
	function t(t) {
		e.call(this), this.values = t;
	}
	e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t;
	var n = {
		length: { configurable: !0 },
		depth: { configurable: !0 }
	};
	return t.prototype.flatten = function() {
		return this.values;
	}, t.prototype.sliceInner = function(e, n) {
		return e == 0 && n == this.length ? this : new t(this.values.slice(e, n));
	}, t.prototype.getInner = function(e) {
		return this.values[e];
	}, t.prototype.forEachInner = function(e, t, n, r) {
		for (var i = t; i < n; i++) if (e(this.values[i], r + i) === !1) return !1;
	}, t.prototype.forEachInvertedInner = function(e, t, n, r) {
		for (var i = t - 1; i >= n; i--) if (e(this.values[i], r + i) === !1) return !1;
	}, t.prototype.leafAppend = function(e) {
		if (this.length + e.length <= Mc) return new t(this.values.concat(e.flatten()));
	}, t.prototype.leafPrepend = function(e) {
		if (this.length + e.length <= Mc) return new t(e.flatten().concat(this.values));
	}, n.length.get = function() {
		return this.values.length;
	}, n.depth.get = function() {
		return 0;
	}, Object.defineProperties(t.prototype, n), t;
}(N);
N.empty = new Nc([]);
var Pc = /* @__PURE__ */ function(e) {
	function t(t, n) {
		e.call(this), this.left = t, this.right = n, this.length = t.length + n.length, this.depth = Math.max(t.depth, n.depth) + 1;
	}
	return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t.prototype.flatten = function() {
		return this.left.flatten().concat(this.right.flatten());
	}, t.prototype.getInner = function(e) {
		return e < this.left.length ? this.left.get(e) : this.right.get(e - this.left.length);
	}, t.prototype.forEachInner = function(e, t, n, r) {
		var i = this.left.length;
		if (t < i && this.left.forEachInner(e, t, Math.min(n, i), r) === !1 || n > i && this.right.forEachInner(e, Math.max(t - i, 0), Math.min(this.length, n) - i, r + i) === !1) return !1;
	}, t.prototype.forEachInvertedInner = function(e, t, n, r) {
		var i = this.left.length;
		if (t > i && this.right.forEachInvertedInner(e, t - i, Math.max(n, i) - i, r + i) === !1 || n < i && this.left.forEachInvertedInner(e, Math.min(t, i), n, r) === !1) return !1;
	}, t.prototype.sliceInner = function(e, t) {
		if (e == 0 && t == this.length) return this;
		var n = this.left.length;
		return t <= n ? this.left.slice(e, t) : e >= n ? this.right.slice(e - n, t - n) : this.left.slice(e, n).append(this.right.slice(0, t - n));
	}, t.prototype.leafAppend = function(e) {
		var n = this.right.leafAppend(e);
		if (n) return new t(this.left, n);
	}, t.prototype.leafPrepend = function(e) {
		var n = this.left.leafPrepend(e);
		if (n) return new t(n, this.right);
	}, t.prototype.appendInner = function(e) {
		return this.left.depth >= Math.max(this.right.depth, e.depth) + 1 ? new t(this.left, new t(this.right, e)) : new t(this, e);
	}, t;
}(N), Fc = 500, Ic = class e {
	constructor(e, t) {
		this.items = e, this.eventCount = t;
	}
	popEvent(t, n) {
		if (this.eventCount == 0) return null;
		let r = this.items.length;
		for (;; r--) if (this.items.get(r - 1).selection) {
			--r;
			break;
		}
		let i, a;
		n && (i = this.remapping(r, this.items.length), a = i.maps.length);
		let o = t.tr, s, c, l = [], u = [];
		return this.items.forEach((t, n) => {
			if (!t.step) {
				i || (i = this.remapping(r, n + 1), a = i.maps.length), a--, u.push(t);
				return;
			}
			if (i) {
				u.push(new Rc(t.map));
				let e = t.step.map(i.slice(a)), n;
				e && o.maybeStep(e).doc && (n = o.mapping.maps[o.mapping.maps.length - 1], l.push(new Rc(n, void 0, void 0, l.length + u.length))), a--, n && i.appendMap(n, a);
			} else o.maybeStep(t.step);
			if (t.selection) return s = i ? t.selection.map(i.slice(a)) : t.selection, c = new e(this.items.slice(0, r).append(u.reverse().concat(l)), this.eventCount - 1), !1;
		}, this.items.length, 0), {
			remaining: c,
			transform: o,
			selection: s
		};
	}
	addTransform(t, n, r, i) {
		let a = [], o = this.eventCount, s = this.items, c = !i && s.length ? s.get(s.length - 1) : null;
		for (let e = 0; e < t.steps.length; e++) {
			let r = t.steps[e].invert(t.docs[e]), l = new Rc(t.mapping.maps[e], r, n), u;
			(u = c && c.merge(l)) && (l = u, e ? a.pop() : s = s.slice(0, s.length - 1)), a.push(l), n && (o++, n = void 0), i || (c = l);
		}
		let l = o - r.depth;
		return l > Bc && (s = Lc(s, l), o -= l), new e(s.append(a), o);
	}
	remapping(e, t) {
		let n = new Ft();
		return this.items.forEach((t, r) => {
			let i = t.mirrorOffset != null && r - t.mirrorOffset >= e ? n.maps.length - t.mirrorOffset : void 0;
			n.appendMap(t.map, i);
		}, e, t), n;
	}
	addMaps(t) {
		return this.eventCount == 0 ? this : new e(this.items.append(t.map((e) => new Rc(e))), this.eventCount);
	}
	rebased(t, n) {
		if (!this.eventCount) return this;
		let r = [], i = Math.max(0, this.items.length - n), a = t.mapping, o = t.steps.length, s = this.eventCount;
		this.items.forEach((e) => {
			e.selection && s--;
		}, i);
		let c = n;
		this.items.forEach((e) => {
			let n = a.getMirror(--c);
			if (n == null) return;
			o = Math.min(o, n);
			let i = a.maps[n];
			if (e.step) {
				let o = t.steps[n].invert(t.docs[n]), l = e.selection && e.selection.map(a.slice(c + 1, n));
				l && s++, r.push(new Rc(i, o, l));
			} else r.push(new Rc(i));
		}, i);
		let l = [];
		for (let e = n; e < o; e++) l.push(new Rc(a.maps[e]));
		let u = this.items.slice(0, i).append(l).append(r), d = new e(u, s);
		return d.emptyItemCount() > Fc && (d = d.compress(this.items.length - r.length)), d;
	}
	emptyItemCount() {
		let e = 0;
		return this.items.forEach((t) => {
			t.step || e++;
		}), e;
	}
	compress(t = this.items.length) {
		let n = this.remapping(0, t), r = n.maps.length, i = [], a = 0;
		return this.items.forEach((e, o) => {
			if (o >= t) i.push(e), e.selection && a++;
			else if (e.step) {
				let t = e.step.map(n.slice(r)), o = t && t.getMap();
				if (r--, o && n.appendMap(o, r), t) {
					let s = e.selection && e.selection.map(n.slice(r));
					s && a++;
					let c = new Rc(o.invert(), t, s), l, u = i.length - 1;
					(l = i.length && i[u].merge(c)) ? i[u] = l : i.push(c);
				}
			} else e.map && r--;
		}, this.items.length, 0), new e(N.from(i.reverse()), a);
	}
};
Ic.empty = new Ic(N.empty, 0);
function Lc(e, t) {
	let n;
	return e.forEach((e, r) => {
		if (e.selection && t-- == 0) return n = r, !1;
	}), e.slice(n);
}
var Rc = class e {
	constructor(e, t, n, r) {
		this.map = e, this.step = t, this.selection = n, this.mirrorOffset = r;
	}
	merge(t) {
		if (this.step && t.step && !t.selection) {
			let n = t.step.merge(this.step);
			if (n) return new e(n.getMap().invert(), n, this.selection);
		}
	}
}, zc = class {
	constructor(e, t, n, r, i) {
		this.done = e, this.undone = t, this.prevRanges = n, this.prevTime = r, this.prevComposition = i;
	}
}, Bc = 20;
function Vc(e, t, n, r) {
	let i = n.getMeta(Yc), a;
	if (i) return i.historyState;
	n.getMeta(Xc) && (e = new zc(e.done, e.undone, null, 0, -1));
	let o = n.getMeta("appendedTransaction");
	if (n.steps.length == 0) return e;
	if (o && o.getMeta(Yc)) return o.getMeta(Yc).redo ? new zc(e.done.addTransform(n, void 0, r, Jc(t)), e.undone, Uc(n.mapping.maps), e.prevTime, e.prevComposition) : new zc(e.done, e.undone.addTransform(n, void 0, r, Jc(t)), null, e.prevTime, e.prevComposition);
	if (n.getMeta("addToHistory") !== !1 && !(o && o.getMeta("addToHistory") === !1)) {
		let i = n.getMeta("composition"), a = e.prevTime == 0 || !o && e.prevComposition != i && (e.prevTime < (n.time || 0) - r.newGroupDelay || !Hc(n, e.prevRanges)), s = o ? Wc(e.prevRanges, n.mapping) : Uc(n.mapping.maps);
		return new zc(e.done.addTransform(n, a ? t.selection.getBookmark() : void 0, r, Jc(t)), Ic.empty, s, n.time, i == null ? e.prevComposition : i);
	}
	return (a = n.getMeta("rebased")) ? new zc(e.done.rebased(n, a), e.undone.rebased(n, a), Wc(e.prevRanges, n.mapping), e.prevTime, e.prevComposition) : new zc(e.done.addMaps(n.mapping.maps), e.undone.addMaps(n.mapping.maps), Wc(e.prevRanges, n.mapping), e.prevTime, e.prevComposition);
}
function Hc(e, t) {
	if (!t) return !1;
	if (!e.docChanged) return !0;
	let n = !1;
	return e.mapping.maps[0].forEach((e, r) => {
		for (let i = 0; i < t.length; i += 2) e <= t[i + 1] && r >= t[i] && (n = !0);
	}), n;
}
function Uc(e) {
	let t = [];
	for (let n = e.length - 1; n >= 0 && t.length == 0; n--) e[n].forEach((e, n, r, i) => t.push(r, i));
	return t;
}
function Wc(e, t) {
	if (!e) return null;
	let n = [];
	for (let r = 0; r < e.length; r += 2) {
		let i = t.map(e[r], 1), a = t.map(e[r + 1], -1);
		i <= a && n.push(i, a);
	}
	return n;
}
function Gc(e, t, n) {
	let r = Jc(t), i = Yc.get(t).spec.config, a = (n ? e.undone : e.done).popEvent(t, r);
	if (!a) return null;
	let o = a.selection.resolve(a.transform.doc), s = (n ? e.done : e.undone).addTransform(a.transform, t.selection.getBookmark(), i, r), c = new zc(n ? s : a.remaining, n ? a.remaining : s, null, 0, -1);
	return a.transform.setSelection(o).setMeta(Yc, {
		redo: n,
		historyState: c
	});
}
var Kc = !1, qc = null;
function Jc(e) {
	let t = e.plugins;
	if (qc != t) {
		Kc = !1, qc = t;
		for (let e = 0; e < t.length; e++) if (t[e].spec.historyPreserveItems) {
			Kc = !0;
			break;
		}
	}
	return Kc;
}
var Yc = new or("history"), Xc = new or("closeHistory");
function Zc(e = {}) {
	return e = {
		depth: e.depth || 100,
		newGroupDelay: e.newGroupDelay || 500
	}, new rr({
		key: Yc,
		state: {
			init() {
				return new zc(Ic.empty, Ic.empty, null, 0, -1);
			},
			apply(t, n, r) {
				return Vc(n, r, t, e);
			}
		},
		config: e,
		props: { handleDOMEvents: { beforeinput(e, t) {
			let n = t.inputType, r = n == "historyUndo" ? $c : n == "historyRedo" ? el : null;
			return !r || !e.editable ? !1 : (t.preventDefault(), r(e.state, e.dispatch));
		} } }
	});
}
function Qc(e, t) {
	return (n, r) => {
		let i = Yc.getState(n);
		if (!i || (e ? i.undone : i.done).eventCount == 0) return !1;
		if (r) {
			let a = Gc(i, n, e);
			a && r(t ? a.scrollIntoView() : a);
		}
		return !0;
	};
}
var $c = Qc(!1, !0), el = Qc(!0, !0);
function tl(e) {
	let t = Yc.getState(e);
	return t ? t.done.eventCount : 0;
}
//#endregion
//#region node_modules/@drenso-toast-ui/editor/dist/esm/index.js
var nl = function(e, t) {
	return nl = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(e, t) {
		e.__proto__ = t;
	} || function(e, t) {
		for (var n in t) Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n]);
	}, nl(e, t);
};
function P(e, t) {
	if (typeof t != "function" && t !== null) throw TypeError("Class extends value " + String(t) + " is not a constructor or null");
	nl(e, t);
	function n() {
		this.constructor = e;
	}
	e.prototype = t === null ? Object.create(t) : (n.prototype = t.prototype, new n());
}
var F = function() {
	return F = Object.assign || function(e) {
		for (var t, n = 1, r = arguments.length; n < r; n++) for (var i in t = arguments[n], t) Object.prototype.hasOwnProperty.call(t, i) && (e[i] = t[i]);
		return e;
	}, F.apply(this, arguments);
};
function rl(e, t, n) {
	if (n || arguments.length === 2) for (var r = 0, i = t.length, a; r < i; r++) (a || !(r in t)) && (a || (a = Array.prototype.slice.call(t, 0, r)), a[r] = t[r]);
	return e.concat(a || Array.prototype.slice.call(t));
}
function I(e, t) {
	return Object.defineProperty ? Object.defineProperty(e, "raw", { value: t }) : e.raw = t, e;
}
function il(e, t, n) {
	for (var r in n = n || null, e) if (e.hasOwnProperty(r) && t.call(n, e[r], r, e) === !1) break;
}
var al = il;
function ol(e, t) {
	var n = Object.prototype.hasOwnProperty, r, i, a, o;
	for (a = 1, o = arguments.length; a < o; a += 1) for (i in r = arguments[a], r) n.call(r, i) && (e[i] = r[i]);
	return e;
}
var sl = ol;
function cl(e) {
	return typeof e == "string" || e instanceof String;
}
var ll = cl;
function ul(e) {
	return e instanceof Array;
}
var dl = ul;
function fl(e, t, n) {
	var r = 0, i = e.length;
	for (n = n || null; r < i && t.call(n, e[r], r, e) !== !1; r += 1);
}
var pl = fl, ml = dl, hl = pl, gl = al;
function _l(e, t, n) {
	ml(e) ? hl(e, t, n) : gl(e, t, n);
}
var vl = _l, yl = ll, bl = vl;
function xl(e, t, n) {
	var r = e.style;
	if (yl(t)) {
		r[t] = n;
		return;
	}
	bl(t, function(e, t) {
		r[t] = e;
	});
}
var Sl = xl, Cl = dl;
function wl(e, t, n) {
	var r, i;
	if (n = n || 0, !Cl(t)) return -1;
	if (Array.prototype.indexOf) return Array.prototype.indexOf.call(t, e, n);
	for (i = t.length, r = n; n >= 0 && r < i; r += 1) if (t[r] === e) return r;
	return -1;
}
var Tl = wl;
function El(e) {
	return e === void 0;
}
var Dl = El, Ol = Dl;
function kl(e) {
	return !e || !e.className ? "" : Ol(e.className.baseVal) ? e.className : e.className.baseVal;
}
var Al = kl, jl = dl, Ml = Dl;
function Nl(e, t) {
	if (t = jl(t) ? t.join(" ") : t, t = t.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, ""), Ml(e.className.baseVal)) {
		e.className = t;
		return;
	}
	e.className.baseVal = t;
}
var Pl = Nl, Fl = vl, Il = Tl, Ll = Al, Rl = Pl;
function zl(e) {
	var t = Array.prototype.slice.call(arguments, 1), n = e.classList, r = [], i;
	if (n) {
		Fl(t, function(t) {
			e.classList.add(t);
		});
		return;
	}
	i = Ll(e), i && (t = [].concat(i.split(/\s+/), t)), Fl(t, function(e) {
		Il(e, r) < 0 && r.push(e);
	}), Rl(e, r);
}
var Bl = zl, Vl = pl, Hl = Tl, Ul = Al, Wl = Pl;
function Gl(e) {
	var t = Array.prototype.slice.call(arguments, 1), n = e.classList, r, i;
	if (n) {
		Vl(t, function(e) {
			n.remove(e);
		});
		return;
	}
	r = Ul(e).split(/\s+/), i = [], Vl(r, function(e) {
		Hl(e, t) < 0 && i.push(e);
	}), Wl(e, i);
}
var Kl = Gl;
function ql(e) {
	return typeof e == "number" || e instanceof Number;
}
var Jl = ql;
function Yl(e) {
	return e === null;
}
var Xl = Yl, Zl = al;
function Ql(e, t) {
	var n = document.createElement("img"), r = "";
	return Zl(t, function(e, t) {
		r += "&" + t + "=" + e;
	}), r = r.substring(1), n.src = e + "?" + r, n.style.display = "none", document.body.appendChild(n), document.body.removeChild(n), n;
}
var $l = Ql, eu = Dl, tu = $l, nu = 6048e5;
function ru(e) {
	return (/* @__PURE__ */ new Date()).getTime() - e > nu;
}
function iu(e, t) {
	var n = location.hostname, r = "event", i = "use", a = "TOAST UI " + e + " for " + n + ": Statistics", o = window.localStorage.getItem(a);
	!eu(window.tui) && window.tui.usageStatistics === !1 || o && !ru(o) || (window.localStorage.setItem(a, (/* @__PURE__ */ new Date()).getTime()), setTimeout(function() {
		(document.readyState === "interactive" || document.readyState === "complete") && tu("https://www.google-analytics.com/collect", {
			v: 1,
			t: r,
			tid: t,
			cid: n,
			dp: n,
			dh: e,
			el: e,
			ec: i
		});
	}, 1e3));
}
var au = iu;
/Mac/.test(navigator.platform);
var ou = /[\u0020]+/g, su = /[>(){}[\]+-.!#|]/g, cu = /<([a-zA-Z_][a-zA-Z0-9\-._]*)(\s|[^\\>])*\/?>|<(\/)([a-zA-Z_][a-zA-Z0-9\-._]*)\s*\/?>|<!--[^-]+-->|<([a-zA-Z_][a-zA-Z0-9\-.:/]*)>/g, lu = /\\[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~\\]/g, uu = /[*_~`]/g, du = /!\[.*\]\(.*\)/g, fu = /[[\]]/g, pu = /(?:^|[^\\])\\(?!\\)/g, mu = /* @__PURE__ */ RegExp("[&<>\"]", "g");
function hu(e) {
	switch (e) {
		case "&": return "&amp;";
		case "<": return "&lt;";
		case ">": return "&gt;";
		case "\"": return "&quot;";
		default: return e;
	}
}
function gu(e) {
	return mu.test(e) ? e.replace(mu, hu) : e;
}
function _u() {
	au("editor", "UA-129966929-1");
}
function L(e, t) {
	return e.indexOf(t) !== -1;
}
var vu = [
	"rel",
	"target",
	"hreflang",
	"type"
], yu = {
	codeblock: /(^ {4}[^\n]+\n*)+/,
	thematicBreak: /^ *((\* *){3,}|(- *){3,} *|(_ *){3,}) */,
	atxHeading: /^(#{1,6}) +[\s\S]+/,
	seTextheading: /^([^\n]+)\n *(=|-){2,} */,
	blockquote: /^( *>[^\n]+.*)+/,
	list: /^ *(\*+|-+|\d+\.) [\s\S]+/,
	def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +["(]([^\n]+)[")])? */,
	link: /!?\[.*\]\(.*\)/,
	reflink: /!?\[.*\]\s*\[([^\]]*)\]/,
	verticalBar: /\u007C/,
	fencedCodeblock: /^((`|~){3,})/
};
function bu(e) {
	if (!e) return null;
	var t = {};
	return vu.forEach(function(n) {
		Dl(e[n]) || (t[n] = e[n]);
	}), t;
}
function xu(e, t) {
	for (var n = "", r = 0; r < t; r += 1) n += e;
	return n;
}
function Su(e) {
	var t = !1;
	return al(yu, function(n) {
		return n.test(e) && (t = !0), !t;
	}), t;
}
function Cu(e) {
	for (var t = [], n = du.exec(e); n;) t.push([n.index, n.index + n[0].length]), n = du.exec(e);
	return e.replace(fu, function(e, n) {
		return t.some(function(e) {
			return n > e[0] && n < e[1];
		}) ? e : `\\${e}`;
	});
}
function wu(e) {
	var t = function(e) {
		return `\\${e}`;
	}, n = function(e) {
		return `${e}\\`;
	}, r = e.replace(ou, " ");
	return lu.test(r) && (r = r.replace(lu, t)), pu.test(r) && (r = r.replace(pu, n)), r = r.replace(uu, t), cu.test(r) && (r = r.replace(cu, t)), Su(r) && (r = r.replace(su, t)), r;
}
function Tu(e) {
	var t = e.indexOf("\"") === -1 ? "\"\"" : e.indexOf("'") === -1 ? "''" : "()";
	return t[0] + e + t[1];
}
function Eu(e) {
	return Xl(e) || Dl(e);
}
function Du(e, t) {
	if (e === null && e === t) return !0;
	if (typeof e != "object" || typeof t != "object" || Eu(e) || Eu(t)) return e === t;
	for (var n in e) if (e[n] !== t[n]) return !1;
	for (var n in t) if (!(n in e)) return !1;
	return !0;
}
function Ou(e) {
	return e[e.length - 1];
}
function ku(e, t, n) {
	return e >= t && e <= n;
}
function Au(e) {
	return typeof e == "object" && !!e;
}
function ju(e, t) {
	var n = F({}, e);
	return e && t && Object.keys(t).forEach(function(e) {
		n[e] = Au(n[e]) ? Array.isArray(t[e]) ? Mu(t[e]) : n.hasOwnProperty(e) ? ju(n[e], t[e]) : Nu(t[e]) : t[e];
	}), n;
}
function Mu(e) {
	return e.map(function(e) {
		return Au(e) ? Array.isArray(e) ? Mu(e) : Nu(e) : e;
	});
}
function Nu(e) {
	var t = Object.keys(e);
	return t.length ? t.reduce(function(t, n) {
		return t[n] = Au(e[n]) ? Array.isArray(e[n]) ? Mu(e[n]) : Nu(e[n]) : e[n], t;
	}, {}) : e;
}
function Pu(e, t) {
	return t === void 0 && (t = {}), Object.keys(t).forEach(function(n) {
		e.hasOwnProperty(n) && typeof e[n] == "object" ? Array.isArray(t[n]) ? e[n] = t[n] : Pu(e[n], t[n]) : e[n] = t[n];
	}), e;
}
function Fu(e, t) {
	return e > t ? [t, e] : [e, t];
}
var Iu = pl;
function Lu(e) {
	var t;
	try {
		t = Array.prototype.slice.call(e);
	} catch (n) {
		t = [], Iu(e, function(e) {
			t.push(e);
		});
	}
	return t;
}
var Ru = Lu;
function zu(e, t) {
	var n = e.nodes.paragraph;
	return t ? n.create(null, ll(t) ? e.text(t) : t) : n.createAndFill();
}
function R(e, t, n) {
	return e.text(t, n);
}
function z(e, t, n) {
	n === void 0 && (n = t);
	var r = e.doc.content.size, i = r > 0 ? r - 1 : 1;
	return j.create(e.doc, Math.min(t, i), Math.min(n, i));
}
function Bu(e, t, n) {
	var r = t.pos;
	return e.replaceWith(r, r, zu(n)), e.setSelection(z(e, r + 1));
}
function Vu(e) {
	for (var t = e.state, n = e.from, r = e.startIndex, i = e.endIndex, a = e.createText, o = t.tr, s = t.doc, c = t.schema, l = r; l <= i; l += 1) {
		var u = s.child(l), d = u.nodeSize, f = u.textContent, p = u.content, m = a(f), h = m ? R(c, m) : T.empty, g = o.mapping.map(n), _ = g + p.size;
		o.replaceWith(g, _, h), n += d;
	}
	return o;
}
function Hu(e, t, n, r) {
	var i = n.length;
	e.split(t).delete(t - i, t).insert(e.mapping.map(t), r).setSelection(z(e, e.mapping.map(t) - i));
}
function Uu(e) {
	return e.sourcepos[0][0];
}
function Wu(e) {
	return e.sourcepos[1][0];
}
function Gu(e) {
	return e.sourcepos[0][1];
}
function Ku(e) {
	return e.sourcepos[1][1];
}
function qu(e) {
	var t = e.type;
	return t === "htmlBlock" || t === "htmlInline";
}
function Ju(e) {
	var t = e.type;
	return t === "strike" || t === "strong" || t === "emph" || t === "code" || t === "link" || t === "image";
}
function Yu(e) {
	return e && e.type === "codeBlock";
}
function Xu(e) {
	return e && (e.type === "item" || e.type === "list");
}
function Zu(e) {
	return Xu(e) && e.listData.type === "ordered";
}
function Qu(e) {
	return Xu(e) && e.listData.type !== "ordered";
}
function $u(e) {
	return e && (e.type === "tableCell" || e.type === "tableDelimCell");
}
function ed(e) {
	switch (e.type) {
		case "code":
		case "text":
		case "emph":
		case "strong":
		case "strike":
		case "link":
		case "image":
		case "htmlInline":
		case "linebreak":
		case "softbreak":
		case "customInline": return !0;
		default: return !1;
	}
}
function td(e, t, n) {
	for (n === void 0 && (n = !0), e = n ? e : e.parent; e && e.type !== "document";) {
		if (t(e)) return e;
		e = e.parent;
	}
	return null;
}
function nd(e, t, n) {
	for (n === void 0 && (n = !0), e = n ? e : e.parent; e && e.type !== "document";) t(e), e = e.parent;
}
function B(e, t) {
	return [e[0], e[1] + t];
}
function rd(e, t) {
	return [e[0], t];
}
function id(e) {
	var t = e.firstChild.literal;
	switch (e.type) {
		case "emph": return `*${t}*`;
		case "strong": return `**${t}**`;
		case "strike": return `~~${t}~~`;
		case "code": return `\`${t}\``;
		case "link":
		case "image":
			var n = e, r = n.destination, i = n.title;
			return `${e.type === "link" ? "" : "!"}[${t}](${r}${i ? ` "${i}"` : ""})`;
		default: return null;
	}
}
function ad(e) {
	switch (e.type) {
		case "document":
		case "blockQuote":
		case "list":
		case "item":
		case "paragraph":
		case "heading":
		case "emph":
		case "strong":
		case "strike":
		case "link":
		case "image":
		case "table":
		case "tableHead":
		case "tableBody":
		case "tableRow":
		case "tableCell":
		case "tableDelimRow":
		case "customInline": return !0;
		default: return !1;
	}
}
function od(e) {
	for (var t = [], n = e.walker(), r = null; r = n.next();) {
		var i = r.node;
		i.type === "text" && t.push(i.literal);
	}
	return t.join("");
}
var sd = [], cd = {}, ld = /\$\$widget\d+\s/;
function ud(e) {
	var t = e.search(ld);
	if (t !== -1) {
		var n = e.substring(t).replace(ld, "").replace("$$", "");
		e = e.substring(0, t), e += ud(n);
	}
	return e;
}
function dd(e, t) {
	return `\$\$${e} ${t}\$\$`;
}
function fd(e, t) {
	var n = cd[e], r = n.rule, i = n.toDOM, a = ud(t).match(r);
	return a && (t = a[0]), i(t);
}
function pd() {
	return sd;
}
function md(e) {
	sd = e, sd.forEach(function(e, t) {
		cd[`widget${t}`] = e;
	});
}
function hd(e, t, n, r) {
	return e.concat(gd(t, n, r));
}
function gd(e, t, n) {
	n === void 0 && (n = 0);
	var r = [], i = (sd[n] || {}).rule, a = n + 1;
	if (e = ud(e), i && i.test(e)) {
		for (var o = void 0; (o = e.search(i)) !== -1;) {
			var s = e.substring(0, o);
			s && (r = hd(r, s, t, a)), e = e.substring(o);
			var c = e.match(i)[0], l = `widget${n}`;
			r.push(t.nodes.widget.create({ info: l }, t.text(dd(l, c)))), e = e.substring(c.length);
		}
		e && (r = hd(r, e, t, a));
	} else e && (r = n < sd.length - 1 ? hd(r, e, t, a) : [t.text(e)]);
	return r;
}
function _d(e) {
	for (var t, n = "", r = e.walker(); t = r.next();) {
		var i = t.node;
		t.entering && (i !== e && i.type !== "text" ? (n += id(i), r.resumeAt(e, !1), r.next()) : i.type === "text" && (n += i.literal));
	}
	return n;
}
function vd() {
	return {
		deleteSelection: function() {
			return Ks;
		},
		selectAll: function() {
			return lc;
		},
		undo: function() {
			return $c;
		},
		redo: function() {
			return el;
		}
	};
}
function yd(e) {
	return new rr({ props: { decorations: function(t) {
		var n = t.doc;
		if (e.text && n.childCount === 1 && n.firstChild.isTextblock && n.firstChild.content.size === 0) {
			var r = document.createElement("span");
			return Bl(r, "placeholder"), e.className && Bl(r, e.className), r.textContent = e.text, Uo.create(n, [Bo.widget(1, r)]);
		}
		return null;
	} } });
}
var bd = Tl, xd = Al;
function Sd(e, t) {
	var n;
	return e.classList ? e.classList.contains(t) : (n = xd(e).split(/\s+/), bd(t, n) > -1);
}
var Cd = Sd, wd = Tl, Td = Ru, Ed = Element.prototype, Dd = Ed.matches || Ed.webkitMatchesSelector || Ed.mozMatchesSelector || Ed.msMatchesSelector || function(e) {
	var t = this.document || this.ownerDocument;
	return wd(this, Td(t.querySelectorAll(e))) > -1;
};
function Od(e, t) {
	return Dd.call(e, t);
}
var kd = Od, Ad = "[A-Za-z][A-Za-z0-9-]*", jd = "(?:\\s+[a-zA-Z_:][a-zA-Z0-9:._-]*(?:\\s*=\\s*(?:[^\"'=<>`\\x00-\\x20]+|'[^']*'|\"[^\"]*\"))?)", Md = `<(${Ad})(${jd})*\\s*/?>`, Nd = `(?:${Md}|${`</(${Ad})\\s*[>]`})`, Pd = RegExp(`^${Nd}`, "i"), Fd = /<br\s*\/*>/i, Id = /<! ---->|<!--(?:-?[^>-])(?:-?[^-])*-->/, Ld = "</p><p>";
function Rd(e, t, n) {
	var r = parseInt(e.left, 10), i = parseInt(e.top, 10), a = parseInt(e.width, 10) + parseInt(e.paddingLeft, 10) + parseInt(e.paddingRight, 10), o = parseInt(e.height, 10) + parseInt(e.paddingTop, 10) + parseInt(e.paddingBottom, 10);
	return t >= r && t <= r + a && n >= i && n <= i + o;
}
var zd = "toastui-editor-";
function V() {
	for (var e = [...arguments], t = [], n = 0, r = e; n < r.length; n++) {
		var i = r[n], a = void 0;
		a = Array.isArray(i) ? i[0] ? i[1] : null : i, a && t.push(`${zd}${a}`);
	}
	return t.join(" ");
}
function H() {
	return [...arguments].map(function(e) {
		return `${zd}md-${e}`;
	}).join(" ");
}
function Bd(e) {
	return (e == null ? void 0 : e.nodeType) === Node.TEXT_NODE;
}
function Vd(e) {
	return e && e.nodeType === Node.ELEMENT_NODE;
}
function Hd(e, t) {
	var n = Ru(e.querySelectorAll(t));
	return n.length ? n : [];
}
function Ud(e, t) {
	t = dl(t) ? Ru(t) : [t], t.forEach(function(t) {
		e.appendChild(t);
	});
}
function Wd(e, t) {
	t.parentNode && t.parentNode.insertBefore(e, t);
}
function Gd(e) {
	e.parentNode && e.parentNode.removeChild(e);
}
function Kd(e) {
	for (var t = []; e.firstChild;) t.push(e.firstChild), e.parentNode && e.parentNode.insertBefore(e.firstChild, e);
	return Gd(e), t;
}
function qd(e, t, n) {
	Dl(n) && (n = !Cd(e, t)), (n ? Bl : Kl)(e, t);
}
function Jd(e, t) {
	var n = document.createElement("div");
	ll(e) ? n.innerHTML = e : n.appendChild(e);
	var r = n.firstChild;
	return t && t.appendChild(r), r;
}
function Yd(e) {
	var t = window.getComputedStyle(e);
	return ["margin-left", "margin-right"].reduce(function(e, n) {
		return e + parseInt(t.getPropertyValue(n), 10);
	}, 0) + e.offsetWidth;
}
function Xd(e, t) {
	for (var n = ll(t) ? function(e) {
		return kd(e, t);
	} : function(e) {
		return e === t;
	}; e && e !== document;) {
		if (Vd(e) && n(e)) return e;
		e = e.parentNode;
	}
	return null;
}
function Zd(e, t) {
	for (var n = 0, r = 0; e && e !== t;) {
		var i = e.offsetTop, a = e.offsetLeft, o = e.offsetParent;
		if (n += i, r += a, o === t.offsetParent) break;
		e = e.offsetParent;
	}
	return {
		offsetTop: n,
		offsetLeft: r
	};
}
function Qd(e, t) {
	Object.keys(e).forEach(function(n) {
		Eu(e[n]) ? t.removeAttribute(n) : t.setAttribute(n, e[n]);
	});
}
function $d(e) {
	var t = e.replace(/<p><br\s*\/*><\/p>/gi, "<p></p>"), n = new RegExp(Nd, "ig"), r = t.match(n);
	return r == null || r.forEach(function(e, n) {
		if (Fd.test(e)) {
			var i = Ld;
			if (n) {
				var a = r[n - 1].match(Md);
				if (a && !/br/i.test(a[1])) {
					var o = a[1];
					i = `</${o}><${o}>`;
				}
			}
			t = t.replace(Fd, i);
		}
	}), t;
}
function ef(e) {
	var t = /<img class="ProseMirror-separator" alt="">/g, n = / class="ProseMirror-trailingBreak"/g, r = e;
	return r = r.replace(t, ""), r = r.replace(n, ""), r;
}
var tf = new or("widget"), nf = 5, rf = function() {
	function e(e, t) {
		var n = this;
		this.popup = null, this.removeWidget = function() {
			n.popup && (n.rootEl.removeChild(n.popup), n.popup = null);
		}, this.rootEl = e.dom.parentElement, this.eventEmitter = t, this.eventEmitter.listen("blur", this.removeWidget), this.eventEmitter.listen("loadUI", function() {
			n.rootEl = Xd(e.dom.parentElement, `.${V("defaultUI")}`);
		}), this.eventEmitter.listen("removePopupWidget", this.removeWidget);
	}
	return e.prototype.update = function(e) {
		var t = tf.getState(e.state);
		if (this.removeWidget(), t) {
			var n = t.node, r = t.style, i = e.coordsAtPos(t.pos), a = i.top, o = i.left, s = i.bottom - a, c = this.rootEl.getBoundingClientRect(), l = a - c.top;
			Sl(n, { opacity: "0" }), this.rootEl.appendChild(n), Sl(n, {
				position: "absolute",
				left: `${o - c.left + nf}px`,
				top: `${r === "bottom" ? l + s - nf : l - s}px`,
				opacity: "1"
			}), this.popup = n, e.focus();
		}
	}, e.prototype.destroy = function() {
		this.eventEmitter.removeEventHandler("blur", this.removeWidget);
	}, e;
}();
function af(e) {
	return new rr({
		key: tf,
		state: {
			init: function() {
				return null;
			},
			apply: function(e) {
				return e.getMeta("widget");
			}
		},
		view: function(t) {
			return new rf(t, e);
		}
	});
}
function of(e) {
	e.listen("addImageBlobHook", function(e, t) {
		var n = new FileReader();
		n.onload = function(e) {
			var n = e.target;
			return t(n.result);
		}, n.readAsDataURL(e);
	});
}
function sf(e, t, n) {
	e.emit("addImageBlobHook", t, function(n, r) {
		e.emit("command", "addImage", {
			imageUrl: n,
			altText: r || t.name || "image"
		});
	}, n);
}
function cf(e) {
	var t = Ru(e).filter(function(e) {
		return e.type.indexOf("image") !== -1;
	});
	if (t.length === 1) {
		var n = t[0];
		if (n) return n.getAsFile();
	}
	return null;
}
function lf(e) {
	var t = e.eventEmitter;
	return new rr({ props: { handleDOMEvents: { drop: function(e, n) {
		var r, i = (r = n.dataTransfer) == null ? void 0 : r.files;
		return i && pl(i, function(e) {
			return e.type.indexOf("image") === -1 || (n.preventDefault(), n.stopPropagation(), sf(t, e, n.type), !1);
		}), !0;
	} } } });
}
var U = function() {
	function e() {}
	return Object.defineProperty(e.prototype, "type", {
		get: function() {
			return "node";
		},
		enumerable: !1,
		configurable: !0
	}), e.prototype.setContext = function(e) {
		this.context = e;
	}, e;
}();
function uf(e) {
	var t = document.createElement("span"), n = fd(e.attrs.info, e.textContent);
	return t.className = "tui-widget", t.appendChild(n), { dom: t };
}
function df(e) {
	return e.type.name === "widget";
}
var ff = function(e) {
	P(t, e);
	function t() {
		return e !== null && e.apply(this, arguments) || this;
	}
	return Object.defineProperty(t.prototype, "name", {
		get: function() {
			return "widget";
		},
		enumerable: !1,
		configurable: !0
	}), Object.defineProperty(t.prototype, "schema", {
		get: function() {
			return {
				attrs: { info: { default: null } },
				group: "inline",
				inline: !0,
				content: "text*",
				selectable: !1,
				atom: !0,
				toDOM: function() {
					return [
						"span",
						{ class: "tui-widget" },
						0
					];
				},
				parseDOM: [{
					tag: "span.tui-widget",
					getAttrs: function(e) {
						return { info: e.textContent.match(/\$\$(widget\d+)/)[1] };
					}
				}]
			};
		},
		enumerable: !1,
		configurable: !0
	}), t;
}(U), pf = function() {
	function e(e) {
		this.timer = null, this.el = document.createElement("div"), this.el.className = "toastui-editor", this.eventEmitter = e, this.placeholder = { text: "" };
	}
	return e.prototype.createState = function() {
		return tr.create({
			schema: this.schema,
			plugins: this.createPlugins()
		});
	}, e.prototype.initEvent = function() {
		var e = this, t = e.eventEmitter, n = e.view, r = e.editorType;
		n.dom.addEventListener("focus", function() {
			return t.emit("focus", r);
		}), n.dom.addEventListener("blur", function() {
			return t.emit("blur", r);
		});
	}, e.prototype.emitChangeEvent = function(e) {
		this.eventEmitter.emit("caretChange", this.editorType), e.docChanged && this.eventEmitter.emit("change", this.editorType);
	}, Object.defineProperty(e.prototype, "defaultPlugins", {
		get: function() {
			var e = this.createInputRules(), t = rl(rl([], this.keymaps, !0), [
				Ws(F({ "Shift-Enter": Tc.Enter }, Tc)),
				Zc(),
				yd(this.placeholder),
				af(this.eventEmitter),
				lf(this.context)
			], !1);
			return e ? t.concat(e) : t;
		},
		enumerable: !1,
		configurable: !0
	}), e.prototype.createInputRules = function() {
		var e = pd().map(function(e) {
			var t = e.rule;
			return new Ec(t, function(e, n, r, i) {
				var a = e.schema, o = e.tr, s = e.doc, c = n.input.match(new RegExp(t, "g")), l = s.resolve(r), u = l.parent, d = 0;
				if (df(u) && (u = l.node(l.depth - 1)), u.forEach(function(e) {
					return df(e) && (d += 1);
				}), c.length > d) {
					var f = Ou(c), p = gd(f, a);
					return o.replaceWith(i - f.length + 1, i, p);
				}
				return null;
			});
		});
		return e.length ? kc({ rules: e }) : null;
	}, e.prototype.clearTimer = function() {
		this.timer && (clearTimeout(this.timer), this.timer = null);
	}, e.prototype.createSchema = function() {
		return new $e({
			nodes: this.specs.nodes,
			marks: this.specs.marks
		});
	}, e.prototype.createKeymaps = function(e) {
		var t = vd(), n = t.undo, r = t.redo, i = this.specs.keymaps(e), a = {
			"Mod-z": n(),
			"Shift-Mod-z": r()
		};
		return e ? i.concat(Ws(a)) : i;
	}, e.prototype.createCommands = function() {
		return this.specs.commands(this.view);
	}, e.prototype.createPluginProps = function() {
		var e = this;
		return this.extraPlugins.map(function(t) {
			return t(e.eventEmitter);
		});
	}, e.prototype.focus = function() {
		var e = this;
		this.clearTimer(), this.timer = setTimeout(function() {
			e.view.focus(), e.view.dispatch(e.view.state.tr.scrollIntoView());
		});
	}, e.prototype.blur = function() {
		this.view.dom.blur();
	}, e.prototype.destroy = function() {
		var e = this;
		this.clearTimer(), this.view.destroy(), Object.keys(this).forEach(function(t) {
			delete e[t];
		});
	}, e.prototype.moveCursorToStart = function(e) {
		var t = this.view.state.tr;
		this.view.dispatch(t.setSelection(z(t, 1)).scrollIntoView()), e && this.focus();
	}, e.prototype.moveCursorToEnd = function(e) {
		var t = this.view.state.tr;
		this.view.dispatch(t.setSelection(z(t, t.doc.content.size - 1)).scrollIntoView()), e && this.focus();
	}, e.prototype.setScrollTop = function(e) {
		this.view.dom.scrollTop = e;
	}, e.prototype.getScrollTop = function() {
		return this.view.dom.scrollTop;
	}, e.prototype.setPlaceholder = function(e) {
		this.placeholder.text = e, this.view.dispatch(this.view.state.tr.scrollIntoView());
	}, e.prototype.setHeight = function(e) {
		Sl(this.el, { height: `${e}px` });
	}, e.prototype.setMinHeight = function(e) {
		Sl(this.el, { minHeight: `${e}px` });
	}, e.prototype.getElement = function() {
		return this.el;
	}, e;
}();
function mf(e) {
	return e instanceof Function;
}
var hf = mf, gf = [
	"Enter",
	"Shift-Enter",
	"Mod-Enter",
	"Tab",
	"Shift-Tab",
	"Delete",
	"Backspace",
	"Mod-Delete",
	"Mod-Backspace",
	"ArrowUp",
	"ArrowDown",
	"ArrowLeft",
	"ArrowRight",
	"Mod-d",
	"Mod-D",
	"Alt-ArrowUp",
	"Alt-ArrowDown"
];
function _f(e, t, n) {
	return e.focus(), t(n)(e.state, e.dispatch, e);
}
var vf = function() {
	function e(e) {
		this.specs = e;
	}
	return Object.defineProperty(e.prototype, "nodes", {
		get: function() {
			return this.specs.filter(function(e) {
				return e.type === "node";
			}).reduce(function(e, t) {
				var n, r = t.name, i = t.schema;
				return F(F({}, e), (n = {}, n[r] = i, n));
			}, {});
		},
		enumerable: !1,
		configurable: !0
	}), Object.defineProperty(e.prototype, "marks", {
		get: function() {
			return this.specs.filter(function(e) {
				return e.type === "mark";
			}).reduce(function(e, t) {
				var n, r = t.name, i = t.schema;
				return F(F({}, e), (n = {}, n[r] = i, n));
			}, {});
		},
		enumerable: !1,
		configurable: !0
	}), e.prototype.commands = function(e, t) {
		var n = this.specs.filter(function(e) {
			return e.commands;
		}).reduce(function(t, n) {
			var r = {}, i = n.commands();
			return hf(i) ? r[n.name] = function(t) {
				return _f(e, i, t);
			} : Object.keys(i).forEach(function(t) {
				r[t] = function(n) {
					return _f(e, i[t], n);
				};
			}), F(F({}, t), r);
		}, {}), r = vd();
		return Object.keys(r).forEach(function(t) {
			n[t] = function(n) {
				return _f(e, r[t], n);
			};
		}), t && Object.keys(t).forEach(function(r) {
			n[r] = function(n) {
				return _f(e, t[r], n);
			};
		}), n;
	}, e.prototype.keymaps = function(e) {
		return this.specs.filter(function(e) {
			return e.keymaps;
		}).map(function(e) {
			return e.keymaps();
		}).map(function(t) {
			return e || Object.keys(t).forEach(function(e) {
				L(gf, e) || delete t[e];
			}), Ws(t);
		});
	}, e.prototype.setContext = function(e) {
		this.specs.forEach(function(t) {
			t.setContext(e);
		});
	}, e;
}();
function yf(e) {
	var t = e.from, n = e.to;
	return e instanceof Un ? [t + 1, n - 1] : [t, n];
}
function bf(e) {
	return e.index(0) + 1;
}
function xf(e, t, n) {
	n === void 0 && (n = 1);
	var r = 0;
	return e.forEach(function(e, i) {
		df(e) && i + 2 < t && (r += 2 * n);
	}), r;
}
function Sf(e, t, n) {
	n === void 0 && (n = t);
	var r = t === n, i = e.resolve(t), a = bf(i), o = a, s = i.start(1), c = s;
	if (!r) {
		var l = e.resolve(n === e.content.size ? n - 1 : n);
		c = l.start(1), o = bf(l), l.pos === e.content.size && (n = e.content.size - 2);
	}
	var u = Math.max(t - s + 1, 1), d = Math.max(n - c + 1, 1);
	return [[a, u + xf(e.child(a - 1), u, -1)], [o, d + xf(e.child(o - 1), d, -1)]];
}
function Cf(e, t) {
	for (var n = [], r = 0, i = 0; r < t; r += 1) {
		var a = e.child(r);
		n[r] = i, i += a.nodeSize;
	}
	return n;
}
function wf(e, t, n) {
	var r = Cf(e, n[0]), i = t[0] - 1, a = n[0] - 1, o = e.child(i), s = e.child(a), c = r[i], l = r[a];
	return c += t[1] + xf(o, t[1] - 1), l += n[1] + xf(s, n[1] - 1), [c, Math.min(l, e.content.size)];
}
function W(e) {
	var t = e.$from, n = e.$to, r = e.from, i = e.to, a = t.doc;
	return e instanceof Un && (t = a.resolve(r + 1), n = a.resolve(i - 1)), t.depth === 0 && (t = a.resolve(r - 1), n = t), {
		startFromOffset: t.start(1),
		endFromOffset: n.start(1),
		startToOffset: t.end(1),
		endToOffset: n.end(1),
		startIndex: t.index(0),
		endIndex: n.index(0),
		from: t.pos,
		to: n.pos
	};
}
function Tf(e, t) {
	for (var n = 1, r = 1, i = 0, a = 0; i < e.childCount; i += 1) {
		var o = e.child(i).nodeSize;
		if (n = a + 1, r = a + o - 1, i === t) break;
		a += o;
	}
	return {
		startOffset: n,
		endOffset: r
	};
}
var Ef = "heading", Df = "blockQuote", Of = "listItem", kf = "table", Af = "tableCell", jf = "codeBlock", Mf = "thematicBreak", Nf = "link", Pf = "code", Ff = "meta", If = "delimiter", Lf = "taskDelimiter", Rf = "markedText", zf = "html", Bf = "customBlock", Vf = {
	strong: 2,
	emph: 1,
	strike: 2
};
function G(e, t, n, r) {
	return {
		start: e,
		end: t,
		spec: {
			type: n,
			attrs: r
		}
	};
}
function Hf(e, t, n) {
	var r = e.level, i = e.headingType, a = [G(t, n, Ef, { level: r })];
	return i === "atx" ? a.push(G(t, B(t, r), If)) : a.push(G(rd(n, 0), n, Ef, { seText: !0 })), a;
}
function Uf(e, t, n) {
	var r = e.type, i = B(t, Vf[r]), a = B(n, -Vf[r]);
	return [
		G(i, a, r),
		G(t, i, If),
		G(a, n, If)
	];
}
function Wf(e, t, n, r) {
	return [
		G(e, t, Nf),
		G(rd(e, n[1] + 1), rd(t, r), Nf, { desc: !0 }),
		G(rd(t, r + 2), B(t, -1), Nf, { url: !0 })
	];
}
function Gf(e, t, n) {
	var r = e.lastChild, i = r ? Ku(r) + 1 : 3, a = B(t, 1);
	return rl([G(t, a, Ff)], Wf(t, n, a, i), !0);
}
function Kf(e, t, n) {
	var r = e.lastChild, i = e.extendedAutolink, a = r ? Ku(r) + 1 : 2;
	return i ? [G(t, n, Nf, { desc: !0 })] : Wf(t, n, t, a);
}
function qf(e, t, n) {
	var r = e.tickCount, i = B(t, r), a = B(n, -r);
	return [
		G(t, n, Pf),
		G(t, i, Pf, { start: !0 }),
		G(i, a, Pf, { marked: !0 }),
		G(a, n, Pf, { end: !0 })
	];
}
function Jf(e, t, n, r) {
	var i = {
		start: t,
		end: n,
		spec: { attrs: {
			className: `${r}-line-background`,
			codeStart: t[0],
			codeEnd: n[0]
		} },
		lineBackground: !0
	};
	return e.type !== "item" && e.type !== "blockQuote" ? [F(F({}, i), {
		end: t,
		spec: { attrs: { className: `${r}-line-background start` } }
	}), F(F({}, i), { start: [Math.min(t[0] + 1, n[0]), t[1]] })] : null;
}
function Yf(e, t, n, r) {
	var i = e.fenceOffset, a = e.fenceLength, o = e.fenceChar, s = e.info, c = e.infoPadding, l = e.parent, u = i + a, d = [G(rd(t, 1), n, jf)];
	o && d.push(G(t, B(t, u), If)), s && d.push(G(B(t, a), B(t, a + c + s.length), Ff));
	var f = `^(\\s{0,4})(${o}{${a},})`;
	new RegExp(f).test(r) && d.push(G(rd(n, 1), n, If));
	var p = Jf(l, t, n, "code-block");
	return p ? d.concat(p) : d;
}
function Xf(e, t, n) {
	var r = e, i = r.offset, a = r.syntaxLength, o = r.info, s = r.parent, c = i + a, l = [G(rd(t, 1), n, Bf)];
	l.push(G(t, B(t, c), If)), o && l.push(G(B(t, c), B(t, a + o.length), Ff)), l.push(G(rd(n, 1), n, If));
	var u = Jf(s, t, n, "custom-block");
	return u ? l.concat(u) : l;
}
function Zf(e, t) {
	for (var n = []; e;) {
		var r = e.type;
		(r === "paragraph" || r === "codeBlock") && n.push(G([Uu(e), Gu(e) - 1], [Wu(e), Ku(e) + 1], t)), e = e.next;
	}
	return n;
}
function Qf(e) {
	for (var t = []; e;) t.push(G([Uu(e), Gu(e)], [Wu(e), Ku(e) + 1], Rf)), e = e.next;
	return t;
}
function $f(e, t, n) {
	var r = e.parent && e.parent.type !== "blockQuote" ? [G(t, n, Df)] : [];
	if (e.firstChild) {
		var i = [];
		e.firstChild.type === "paragraph" ? i = Qf(e.firstChild.firstChild) : e.firstChild.type === "list" && (i = Zf(e.firstChild, Rf)), r = rl(rl([], r, !0), i, !0);
	}
	return r;
}
function ep(e) {
	for (var t = 0; e.parent.parent && e.parent.parent.type === "item";) e = e.parent.parent, t += 1;
	var n = [{ odd: !0 }, { even: !0 }][t % 2];
	return [Of, F(F({}, n), { listStyle: !0 })];
}
function tp(e, t) {
	var n = e.listData, r = n.padding, i = n.task, a = ep(e), o = [G.apply(void 0, rl([t, B(t, r)], a, !1))];
	return i && (o.push(G(B(t, r), B(t, r + 3), Lf)), o.push(G(B(t, r + 1), B(t, r + 2), Ff))), o.concat(Zf(e.firstChild, Rf));
}
var np = {
	heading: Hf,
	strong: Uf,
	emph: Uf,
	strike: Uf,
	link: Kf,
	image: Gf,
	code: qf,
	codeBlock: Yf,
	blockQuote: $f,
	item: tp,
	customBlock: Xf
}, rp = {
	thematicBreak: Mf,
	table: kf,
	tableCell: Af,
	htmlInline: zf
};
function ip(e, t, n, r) {
	var i = e.type;
	return hf(np[i]) ? np[i](e, t, n, r) : rp[i] ? [G(t, n, rp[i])] : null;
}
var ap = {};
function op(e) {
	var t = e.schema, n = e.toastMark;
	return new rr({ appendTransaction: function(e, r, i) {
		var a = e[0], o = i.tr;
		if (a.docChanged) {
			var s = [];
			a.getMeta("editResult").forEach(function(e) {
				var t = e.nodes, r = e.removedNodeRange;
				if (t.length) {
					s = s.concat(fp(o, t));
					for (var i = 0, a = t; i < a.length; i++) for (var c = a[i].walker(), l = c.next(); l;) {
						var u = l.node;
						l.entering && (s = s.concat(pp(u, n))), l = c.next();
					}
				} else if (r) for (var d = o.doc.childCount - 1, f = r.line, p = f[0], m = f[1], h = Math.min(p, d), g = Math.min(m, d), _ = h; _ <= g; _ += 1) ap[_] = !0;
			}), lp(o, t, s);
		}
		return o.setMeta("widget", a.getMeta("widget"));
	} });
}
function sp(e, t, n) {
	return Object.keys(n).some(function(r) {
		return n[r] !== e.child(t).attrs[r];
	});
}
function cp(e, t, n, r, i) {
	i === void 0 && (i = {});
	for (var a = r.startIndex, o = r.endIndex, s = r.from, c = r.to, l = !1, u = a; u <= o; u += 1) delete ap[u], l = sp(t, u, i);
	l && e.setBlockType(s, c, n, i);
}
function lp(e, t, n) {
	var r = e.doc, i = t.nodes.paragraph, a = Cf(r, r.childCount);
	n.forEach(function(n) {
		var o = n.start, s = n.end, c = n.spec, l = n.lineBackground, u = Math.min(o[0], r.childCount) - 1, d = Math.min(s[0], r.childCount) - 1, f = r.child(u), p = r.child(d), m = a[u], h = a[d];
		m += o[1] + xf(f, o[1] - 1), h += s[1] + xf(p, s[1] - 1), c ? l ? cp(e, r, i, {
			from: m,
			to: h,
			startIndex: u,
			endIndex: d
		}, c.attrs) : e.addMark(m, h, t.mark(c.type, c.attrs)) : e.removeMark(m, h);
	}), up(e, a, i);
}
function up(e, t, n) {
	Object.keys(ap).forEach(function(r) {
		var i = Number(r), a = Math.min(Number(r) + 1, e.doc.childCount - 1), o = t[i], s = t[a] - 1;
		i === a && (s += 2), e.setBlockType(o, s, n);
	});
}
function dp(e, t, n) {
	var r = [];
	ap = {};
	for (var i = t[0] - 1; i < n[0]; i += 1) {
		var a = e.child(i), o = a.attrs.codeEnd, s = a.attrs.codeStart;
		if (s && o && !L(r, s)) {
			r.push(s), o = Math.min(o, e.childCount);
			for (var c = s - 1, l = n[0], u = c; u < l; u += 1) ap[u] = !0;
		}
	}
}
function fp(e, t) {
	var n = e.doc, r = t[0].sourcepos[0], i = Ou(t).sourcepos[1], a = [r[0], r[1]], o = [i[0], i[1] + 1], s = [];
	return dp(n, r, i), s.push({
		start: a,
		end: o
	}), s;
}
function pp(e, t) {
	var n = t.getLineTexts(), r = [Uu(e), Gu(e)], i = [Wu(e), Ku(e) + 1], a = ip(e, r, i, n[i[0] - 1]);
	return a == null ? [] : a;
}
var mp = [
	"taskList",
	"orderedList",
	"bulletList",
	"table",
	"strong",
	"emph",
	"strike",
	"heading",
	"thematicBreak",
	"blockQuote",
	"code",
	"codeBlock",
	"indent",
	"outdent"
];
function hp(e) {
	var t = e.type;
	return Xu(e) ? e.listData.task ? "taskList" : e.listData.type === "ordered" ? "orderedList" : "bulletList" : t.indexOf("table") === -1 ? L(mp, t) ? t : null : "table";
}
function gp(e) {
	var t = {
		indent: {
			active: !1,
			disabled: !0
		},
		outdent: {
			active: !1,
			disabled: !0
		}
	}, n = !0;
	return nd(e, function(e) {
		var r = hp(e);
		r && (r === "bulletList" || r === "orderedList" ? n && (t[r] = { active: !0 }, t.indent.disabled = !1, t.outdent.disabled = !1, n = !1) : t[r] = { active: !0 });
	}), t;
}
function _p(e) {
	var t = e.toastMark, n = e.eventEmitter;
	return new rr({ view: function() {
		return { update: function(e, r) {
			var i = e.state, a = i.doc, o = i.selection;
			if (!(r && r.doc.eq(a) && r.selection.eq(o))) {
				var s = o.from, c = i.doc.resolve(s).start(), l = i.doc.content.findIndex(s).index + 1, u = s - c;
				s === c && (u += 1);
				var d = [l, u], f = t.findNodeAtPosition(d), p = gp(f);
				n.emit("changeToolbarState", {
					cursorPos: d,
					mdNode: f,
					toolbarState: p
				}), n.emit("setFocusedNode", f);
			}
		} };
	} });
}
var vp = function(e) {
	P(t, e);
	function t() {
		return e !== null && e.apply(this, arguments) || this;
	}
	return Object.defineProperty(t.prototype, "name", {
		get: function() {
			return "doc";
		},
		enumerable: !1,
		configurable: !0
	}), Object.defineProperty(t.prototype, "schema", {
		get: function() {
			return { content: "block+" };
		},
		enumerable: !1,
		configurable: !0
	}), t;
}(U), K = function() {
	function e() {}
	return Object.defineProperty(e.prototype, "type", {
		get: function() {
			return "mark";
		},
		enumerable: !1,
		configurable: !0
	}), e.prototype.setContext = function(e) {
		this.context = e;
	}, e;
}();
function yp(e, t) {
	return bp(e, t - 1);
}
function bp(e, t) {
	return e.child(t).textContent;
}
var xp = /^\s*> ?/, Sp = function(e) {
	P(t, e);
	function t() {
		return e !== null && e.apply(this, arguments) || this;
	}
	return Object.defineProperty(t.prototype, "name", {
		get: function() {
			return "blockQuote";
		},
		enumerable: !1,
		configurable: !0
	}), Object.defineProperty(t.prototype, "schema", {
		get: function() {
			return { toDOM: function() {
				return [
					"span",
					{ class: H("block-quote") },
					0
				];
			} };
		},
		enumerable: !1,
		configurable: !0
	}), t.prototype.createBlockQuoteText = function(e, t) {
		return t ? e.replace(xp, "").trim() : `> ${e.trim()}`;
	}, t.prototype.extendBlockQuote = function() {
		var e = this;
		return function(t, n) {
			var r = t.selection, i = t.doc, a = t.tr, o = t.schema, s = W(r), c = s.endFromOffset, l = s.endToOffset, u = s.endIndex, d = s.to, f = bp(i, u);
			if (xp.test(f) && d > c && r.empty) {
				if (!f.replace(xp, "").trim()) a.deleteRange(c, l).split(a.mapping.map(l));
				else {
					var p = f.slice(d - c).trim();
					Hu(a, l, p, R(o, e.createBlockQuoteText(p)));
				}
				return n(a), !0;
			}
			return !1;
		};
	}, t.prototype.commands = function() {
		var e = this;
		return function() {
			return function(t, n) {
				var r = t.selection, i = t.doc, a = W(r), o = a.startFromOffset, s = a.endToOffset, c = a.startIndex, l = a.endIndex, u = xp.test(bp(i, c)), d = Vu({
					state: t,
					startIndex: c,
					endIndex: l,
					from: o,
					createText: function(t) {
						return e.createBlockQuoteText(t, u);
					}
				});
				return n(d.setSelection(z(d, d.mapping.map(s)))), !0;
			};
		};
	}, t.prototype.keymaps = function() {
		var e = this.commands()();
		return {
			"alt-q": e,
			"alt-Q": e,
			Enter: this.extendBlockQuote()
		};
	}, t;
}(K), Cp = /(^\s*)([-*+] |[\d]+\. )/, wp = /(^\s*)([\d])+\.( \[[ xX]])? /, Tp = /^(\s*)((\d+)([.)]\s(?:\[(?:x|\s)\]\s)?))(.*)/, Ep = /(^\s*)([-*+]|[\d]+\.)( \[[ xX]])? /, Dp = /^(\s*)([-*+]+(\s(?:\[(?:x|\s)\]\s)?))(.*)/, Op = /(^\s*)([-*+] |[\d]+\. )(\[[ xX]] )/, kp = /(^\s*)([-*+])( \[[ xX]]) /;
function Ap(e) {
	return wp.test(e) ? "ordered" : "bullet";
}
function jp(e) {
	for (var t = 0; e && e.type !== "document";) e.type === "list" && (t += 1), e = e.parent;
	return t;
}
function Mp(e, t, n, r) {
	for (var i = e.getLineTexts().length, a = [], o = t; r ? o < i : o > 1;) {
		o = r ? o + 1 : o - 1;
		var s = e.findFirstNodeAtLine(o), c = jp(s);
		if (c === n) a.push({
			line: o,
			depth: n,
			mdNode: s
		});
		else if (c < n) break;
	}
	return a;
}
function Np(e) {
	var t = e.toastMark, n = e.mdNode, r = e.line, i = jp(n), a = Mp(t, r, i, !1).reverse(), o = Mp(t, r, i, !0);
	return a.concat([{
		line: r,
		depth: i,
		mdNode: n
	}]).concat(o);
}
function Pp(e) {
	if (!Cp.test(e)) return `* ${e}`;
	var t = Ap(e);
	return t === "bullet" && Ep.test(e) ? e = e.replace(kp, "$1$2 ") : t === "ordered" && (e = e.replace(wp, "$1* ")), e;
}
function Fp(e, t) {
	if (!Cp.test(e)) return `${t}. ${e}`;
	var n = Ap(e);
	if (n === "bullet" || n === "ordered" && Ep.test(e)) e = e.replace(Ep, `\$1${t}. `);
	else if (n === "ordered") {
		var r = Tp.exec(e)[3];
		Number(r) !== t && (e = e.replace(wp, `\$1${t}. `));
	}
	return e;
}
function Ip(e, t, n, r) {
	r === void 0 && (r = 0);
	var i = Number.MAX_VALUE, a = 0;
	return {
		changedResults: t.map(function(t, o) {
			var s = t.line;
			i = Math.min(s - 1, i), a = Math.max(s - 1, a);
			var c = yp(e, s);
			return c = n === "bullet" ? Pp(c) : Fp(c, o + 1 + r), {
				text: c,
				line: s
			};
		}),
		firstIndex: i,
		lastIndex: a
	};
}
function Lp(e, t) {
	var n = Np(t);
	return Ip(t.doc, n, e);
}
var Rp = {
	bullet: function(e) {
		return Lp("bullet", e);
	},
	ordered: function(e) {
		return Lp("ordered", e);
	},
	task: function(e) {
		var t = e.mdNode, n = e.doc, r = e.line, i = yp(n, r);
		return t.listData.task ? i = i.replace(Op, "$1$2") : Xu(t) && (i = i.replace(Cp, "$1$2[ ] ")), { changedResults: [{
			text: i,
			line: r
		}] };
	}
}, zp = {
	bullet: function(e) {
		var t = e.doc, n = e.line;
		return { changedResults: [{
			text: `* ${yp(t, n)}`,
			line: n
		}] };
	},
	ordered: function(e) {
		for (var t = e.toastMark, n = e.doc, r = e.line, i = e.startLine, a = yp(n, r), o = 1, s = i, c = 0, l = i - 1; l > 0; --l) {
			var u = t.findFirstNodeAtLine(l), d = yp(n, l) && !!td(u, function(e) {
				return Xu(e);
			}), f = Tp.exec(yp(n, l));
			if (!f && !d) break;
			if (!f && d) {
				c += 1;
				continue;
			}
			var p = f, m = p[1], h = p[3];
			if (!m) {
				o = Number(h), s = l;
				break;
			}
		}
		return { changedResults: [{
			text: `${o + r - s - c}. ${a}`,
			line: r
		}] };
	},
	task: function(e) {
		var t = e.doc, n = e.line;
		return { changedResults: [{
			text: `* [ ] ${yp(t, n)}`,
			line: n
		}] };
	}
}, Bp = {
	bullet: function(e) {
		var t = e.line, n = e.doc, r = yp(n, t), i = Dp.exec(r);
		return { listSyntax: `${i[1]}${i[2]}` };
	},
	ordered: function(e) {
		var t = e.toastMark, n = e.line, r = e.mdNode, i = e.doc, a = jp(r), o = yp(i, n), s = Tp.exec(o), c = s[1], l = s[3], u = s[4], d = Number(l) + 1, f = `${c}${d}${u}`, p = Mp(t, n, a, !0).filter(function(e) {
			var t = Tp.exec(yp(i, e.line));
			return t && t[1].length === c.length && !!td(e.mdNode, function(e) {
				return Zu(e);
			});
		});
		return F({ listSyntax: f }, Ip(i, p, "ordered", d));
	}
};
function Vp(e, t, n, r, i) {
	for (var a = [], o = yp(e, n), s = Tp.exec(o); s;) {
		var c = s[1], l = s[4], u = s[5], d = c.length;
		if (d === i) a.push(R(t, `${c}${r}${l}${u}`)), r += 1, n += 1;
		else if (d > i) {
			var f = Vp(e, t, n, 1, d);
			n = f.line, a = a.concat(f.nodes);
		}
		if (d < i || n > e.childCount) break;
		o = yp(e, n), s = Tp.exec(o);
	}
	return {
		nodes: a,
		line: n
	};
}
var Hp = /(^\s{1,4})(.*)/;
function Up(e, t, n) {
	return e < t || Cp.test(n) || xp.test(n);
}
function Wp(e, t, n) {
	var r = n.$from;
	r.depth === 0 && (r = e.resolve(r.pos - 1));
	var i = r.node(1), a = r.start(1), o = i.content.size;
	return i.rangeHasMark(0, o, t.marks.table) && r.pos - a !== o && r.pos !== a;
}
function Gp(e, t) {
	var n = t.from, r = t.to;
	if (t.type === "indent") {
		var i = 4;
		n += i, r += (t.lineLen + 1) * i;
	} else {
		var a = t.spaceLenList;
		n -= a[0];
		for (var o = 0; o < a.length; o += 1) r -= a[o];
	}
	return z(e, n, r);
}
var Kp = function(e) {
	P(t, e);
	function t() {
		return e !== null && e.apply(this, arguments) || this;
	}
	return Object.defineProperty(t.prototype, "name", {
		get: function() {
			return "paragraph";
		},
		enumerable: !1,
		configurable: !0
	}), Object.defineProperty(t.prototype, "schema", {
		get: function() {
			return {
				content: "inline*",
				attrs: {
					className: { default: null },
					codeStart: { default: null },
					codeEnd: { default: null }
				},
				selectable: !1,
				group: "block",
				parseDOM: [{ tag: "div" }],
				toDOM: function(e) {
					var t = e.attrs;
					return t.className ? [
						"div",
						{ class: H(t.className) },
						0
					] : ["div", 0];
				}
			};
		},
		enumerable: !1,
		configurable: !0
	}), t.prototype.reorderList = function(e, t) {
		for (var n = this.context, r = n.view, i = n.toastMark, a = n.schema, o = r.state, s = o.tr, c = o.selection, l = o.doc, u = i.findFirstNodeAtLine(e), d = u; u && !Qu(u) && u.parent.type !== "document";) if (u = u.parent, Zu(u)) {
			d = u;
			break;
		}
		d && (e = d.sourcepos[0][0]);
		var f = Tp.exec(yp(l, e)), p = f[1], m = f[3], h = p.length, g = Vp(l, a, e, Number(m), h), _ = g.line, v = g.nodes;
		t = Math.max(t, _ - 1);
		for (var y = Tf(l, e - 1).startOffset, b = e - 1; b <= t - 1; b += 1) {
			var x = l.child(b), S = x.nodeSize, ee = x.content, te = s.mapping.map(y), ne = te + ee.size;
			s.replaceWith(te, ne, v[b - e + 1]), y += S;
		}
		var re = z(s, c.from, c.to);
		r.dispatch(s.setSelection(re));
	}, t.prototype.indent = function(e) {
		var t = this;
		return e === void 0 && (e = !1), function() {
			return function(n, r) {
				var i = n.schema, a = n.selection, o = n.doc, s = W(a), c = s.from, l = s.to, u = s.startFromOffset, d = s.startIndex, f = s.endIndex;
				if (e && Wp(o, i, a)) return !1;
				var p = bp(o, d);
				if (e && Up(c, l, p) || !e && Cp.test(p)) {
					var m = Vu({
						state: n,
						from: u,
						startIndex: d,
						endIndex: f,
						createText: function(e) {
							return `    ${e}`;
						}
					}), h = {
						type: "indent",
						from: c,
						to: l,
						lineLen: f - d
					};
					r(m.setSelection(Gp(m, h))), Tp.test(p) && t.reorderList(d + 1, f + 1);
				} else e && r(n.tr.insert(l, R(i, "    ")));
				return !0;
			};
		};
	}, t.prototype.outdent = function(e) {
		var t = this;
		return e === void 0 && (e = !1), function() {
			return function(n, r) {
				var i = n.selection, a = n.doc, o = n.schema, s = W(i), c = s.from, l = s.to, u = s.startFromOffset, d = s.startIndex, f = s.endIndex;
				if (e && Wp(a, o, i)) return !1;
				var p = bp(a, d);
				if (e && Up(c, l, p) || !e && Cp.test(p)) {
					var m = [], h = Vu({
						state: n,
						from: u,
						startIndex: d,
						endIndex: f,
						createText: function(e) {
							var t = Hp.exec(e);
							return m.push(t ? t[1].length : 0), e.replace(Hp, "$2");
						}
					}), g = {
						type: "outdent",
						from: c,
						to: l,
						spaceLenList: m
					};
					r(h.setSelection(Gp(h, g))), Tp.test(p) && t.reorderList(d + 1, f + 1);
				} else if (e) {
					var _ = p.slice(0, l - u), v = _.replace(/\s{1,4}$/, ""), y = l - (_.length - v.length);
					r(n.tr.delete(y, l));
				}
				return !0;
			};
		};
	}, t.prototype.deleteLines = function() {
		var e = this;
		return function(t, n) {
			var r = e.context.view, i = W(t.selection), a = i.startFromOffset, o = i.endToOffset;
			return bc(function() {
				return n(t.tr.deleteRange(a, o)), !0;
			}, $s)(t, n, r);
		};
	}, t.prototype.moveDown = function() {
		return function(e, t) {
			var n = e.doc, r = e.tr, i = e.selection, a = e.schema, o = W(i), s = o.startFromOffset, c = o.endToOffset, l = o.endIndex;
			if (l < n.content.childCount - 1) {
				var u = n.child(l + 1), d = u.nodeSize, f = u.textContent;
				return r.delete(c, c + d).split(s).insert(r.mapping.map(s) - 2, R(a, f)), t(r), !0;
			}
			return !1;
		};
	}, t.prototype.moveUp = function() {
		return function(e, t) {
			var n = e.tr, r = e.doc, i = e.selection, a = e.schema, o = W(i), s = o.startFromOffset, c = o.endToOffset, l = o.startIndex;
			if (l > 0) {
				var u = r.child(l - 1), d = u.nodeSize, f = u.textContent;
				return n.delete(s - d, s).split(n.mapping.map(c)).insert(n.mapping.map(c), R(a, f)), t(n), !0;
			}
			return !1;
		};
	}, t.prototype.commands = function() {
		return {
			indent: this.indent(),
			outdent: this.outdent()
		};
	}, t.prototype.keymaps = function() {
		return {
			Tab: this.indent(!0)(),
			"Shift-Tab": this.outdent(!0)(),
			"Mod-d": this.deleteLines(),
			"Mod-D": this.deleteLines(),
			"Alt-ArrowUp": this.moveUp(),
			"Alt-ArrowDown": this.moveDown()
		};
	}, t;
}(U), qp = function(e) {
	P(t, e);
	function t() {
		return e !== null && e.apply(this, arguments) || this;
	}
	return Object.defineProperty(t.prototype, "name", {
		get: function() {
			return "text";
		},
		enumerable: !1,
		configurable: !0
	}), Object.defineProperty(t.prototype, "schema", {
		get: function() {
			return { group: "inline" };
		},
		enumerable: !1,
		configurable: !0
	}), t;
}(U), Jp = /^#{1,6}\s/, Yp = function(e) {
	P(t, e);
	function t() {
		return e !== null && e.apply(this, arguments) || this;
	}
	return Object.defineProperty(t.prototype, "name", {
		get: function() {
			return "heading";
		},
		enumerable: !1,
		configurable: !0
	}), Object.defineProperty(t.prototype, "schema", {
		get: function() {
			return {
				attrs: {
					level: { default: 1 },
					seText: { default: !1 }
				},
				toDOM: function(e) {
					var t = e.attrs, n = t.level, r = t.seText, i = `heading|heading${n}`;
					return r && (i += "|delimiter|setext"), [
						"span",
						{ class: H.apply(void 0, i.split("|")) },
						0
					];
				}
			};
		},
		enumerable: !1,
		configurable: !0
	}), t.prototype.createHeadingText = function(e, t, n) {
		for (var r = t.replace(n, "").trim(), i = ""; e > 0;) i += "#", --e;
		return `${i} ${r}`;
	}, t.prototype.commands = function() {
		var e = this;
		return function(t) {
			return function(n, r) {
				var i = t.level, a = W(n.selection), o = a.startFromOffset, s = a.endToOffset, c = a.startIndex, l = a.endIndex, u = Vu({
					state: n,
					from: o,
					startIndex: c,
					endIndex: l,
					createText: function(t) {
						var n = t.match(Jp), r = n ? n[0] : "";
						return e.createHeadingText(i, t, r);
					}
				});
				return r(u.setSelection(z(u, u.mapping.map(s)))), !0;
			};
		};
	}, t;
}(K), Xp = "```", Zp = function(e) {
	P(t, e);
	function t() {
		return e !== null && e.apply(this, arguments) || this;
	}
	return Object.defineProperty(t.prototype, "name", {
		get: function() {
			return "codeBlock";
		},
		enumerable: !1,
		configurable: !0
	}), Object.defineProperty(t.prototype, "schema", {
		get: function() {
			return { toDOM: function() {
				return [
					"span",
					{ class: H("code-block") },
					0
				];
			} };
		},
		enumerable: !1,
		configurable: !0
	}), t.prototype.commands = function() {
		return function() {
			return function(e, t) {
				var n = e.selection, r = e.schema, i = e.tr, a = W(n), o = a.startFromOffset, s = a.endToOffset, c = R(r, Xp);
				return i.insert(o, c).split(o + Xp.length), i.split(i.mapping.map(s)).insert(i.mapping.map(s), c), t(i.setSelection(z(i, i.mapping.map(s) - (Xp.length + 2)))), !0;
			};
		};
	}, t.prototype.keepIndentation = function() {
		var e = this;
		return function(t, n) {
			var r = t.selection, i = t.tr, a = t.doc, o = t.schema, s = e.context.toastMark, c = W(r), l = c.startFromOffset, u = c.endToOffset, d = c.endIndex, f = c.from, p = c.to, m = bp(a, d);
			if (f === p && m.trim()) {
				var h = m.match(/^\s+/);
				if (Yu(s.findFirstNodeAtLine(d + 1)) && h) {
					var g = h[0], _ = m.slice(p - l);
					return Hu(i, u, _, R(o, g + _)), n(i), !0;
				}
			}
			return !1;
		};
	}, t.prototype.keymaps = function() {
		var e = this.commands()();
		return {
			"Shift-Mod-p": e,
			"Shift-Mod-P": e,
			Enter: this.keepIndentation()
		};
	}, t;
}(K), Qp = /\||\s/g;
function $p(e) {
	return [tm(e), tm(e, !0)];
}
function em(e, t) {
	for (var n = [], r = 0; r < t; r += 1) n.push(tm(e));
	return n;
}
function tm(e, t) {
	for (var n = "|", r = 0; r < e; r += 1) n += t ? " --- |" : "  |";
	return n;
}
function nm(e) {
	return e ? {
		type: "next",
		parentType: "tableHead",
		childType: "firstChild"
	} : {
		type: "prev",
		parentType: "tableBody",
		childType: "lastChild"
	};
}
var rm = function(e) {
	P(t, e);
	function t() {
		return e !== null && e.apply(this, arguments) || this;
	}
	return Object.defineProperty(t.prototype, "name", {
		get: function() {
			return "table";
		},
		enumerable: !1,
		configurable: !0
	}), Object.defineProperty(t.prototype, "schema", {
		get: function() {
			return { toDOM: function() {
				return [
					"span",
					{ class: H("table") },
					0
				];
			} };
		},
		enumerable: !1,
		configurable: !0
	}), t.prototype.extendTable = function() {
		var e = this;
		return function(t, n) {
			var r = t.selection, i = t.doc, a = t.tr, o = t.schema;
			if (!r.empty) return !1;
			var s = W(r), c = s.endFromOffset, l = s.endToOffset, u = s.endIndex, d = s.to, f = bp(i, u), p = [u + 1, d - c + 1], m = td(e.context.toastMark.findNodeAtPosition(p), function(e) {
				return $u(e) && (e.parent.type === "tableDelimRow" || e.parent.parent.type === "tableBody");
			});
			if (m) {
				var h = !f.replace(Qp, "").trim(), g = m.parent.parent.parent.columns.length, _ = tm(g);
				return h ? a.deleteRange(c, l).split(a.mapping.map(l)) : a.split(l).insert(a.mapping.map(l), R(o, _)).setSelection(z(a, a.mapping.map(l) - 2)), n(a), !0;
			}
			return !1;
		};
	}, t.prototype.moveTableCell = function(e) {
		var t = this;
		return function(n, r) {
			var i = n.selection, a = n.tr, o = W(i), s = o.endFromOffset, c = o.endIndex, l = o.to, u = [c + 1, l - s], d = td(t.context.toastMark.findNodeAtPosition(u), function(e) {
				return $u(e);
			});
			if (d) {
				var f = d.parent, p = nm(e), m = p.type, h = p.parentType, g = p.childType, _ = Ku(d);
				if (d[m]) _ = Ku(d[m]) - 1;
				else {
					var v = !f[m] && f.parent.type === h ? f.parent[m][g] : f[m];
					if (m === "next") {
						var y = v ? Ku(v[g]) : 0;
						_ += y + 2;
					} else m === "prev" && (_ = v ? -4 : 0);
				}
				return r(a.setSelection(z(a, s + _))), !0;
			}
			return !1;
		};
	}, t.prototype.addTable = function() {
		return function(e) {
			return function(t, n) {
				var r = t.selection, i = t.tr, a = t.schema, o = e, s = o.columnCount, c = o.rowCount, l = W(r).endToOffset, u = $p(s), d = em(s, c - 1);
				return rl(rl([], u, !0), d, !0).forEach(function(e) {
					i.split(i.mapping.map(l)).insert(i.mapping.map(l), R(a, e));
				}), n(i.setSelection(z(i, l + 4))), !0;
			};
		};
	}, t.prototype.commands = function() {
		return { addTable: this.addTable() };
	}, t.prototype.keymaps = function() {
		return {
			Enter: this.extendTable(),
			Tab: this.moveTableCell(!0),
			"Shift-Tab": this.moveTableCell(!1)
		};
	}, t;
}(K), im = "***", am = function(e) {
	P(t, e);
	function t() {
		return e !== null && e.apply(this, arguments) || this;
	}
	return Object.defineProperty(t.prototype, "name", {
		get: function() {
			return "thematicBreak";
		},
		enumerable: !1,
		configurable: !0
	}), Object.defineProperty(t.prototype, "schema", {
		get: function() {
			return { toDOM: function() {
				return [
					"span",
					{ class: H("thematic-break") },
					0
				];
			} };
		},
		enumerable: !1,
		configurable: !0
	}), t.prototype.hr = function() {
		return function() {
			return function(e, t) {
				var n = e.selection, r = e.schema, i = e.tr, a = W(n), o = a.from, s = a.to, c = a.endToOffset, l = R(r, im);
				return i.split(o).replaceWith(i.mapping.map(o), i.mapping.map(s), l).split(i.mapping.map(s)).setSelection(z(i, i.mapping.map(c))), t(i), !0;
			};
		};
	}, t.prototype.commands = function() {
		return { hr: this.hr() };
	}, t.prototype.keymaps = function() {
		var e = this.hr()();
		return {
			"Mod-l": e,
			"Mod-L": e
		};
	}, t;
}(K);
function om(e, t) {
	var n = e.type;
	return t <= e.sourcepos[0][0] && (n === "codeBlock" || n === "heading" || n.match("table"));
}
var sm = function(e) {
	P(t, e);
	function t() {
		return e !== null && e.apply(this, arguments) || this;
	}
	return Object.defineProperty(t.prototype, "name", {
		get: function() {
			return "listItem";
		},
		enumerable: !1,
		configurable: !0
	}), Object.defineProperty(t.prototype, "schema", {
		get: function() {
			return {
				attrs: {
					odd: { default: !1 },
					even: { default: !1 },
					listStyle: { default: !1 }
				},
				toDOM: function(e) {
					var t = e.attrs, n = t.odd, r = t.even, i = t.listStyle, a = "list-item";
					return i && (a += "|list-item-style"), n && (a += "|list-item-odd"), r && (a += "|list-item-even"), [
						"span",
						{ class: H.apply(void 0, a.split("|")) },
						0
					];
				}
			};
		},
		enumerable: !1,
		configurable: !0
	}), t.prototype.extendList = function() {
		var e = this;
		return function(t, n) {
			var r = t.selection, i = t.doc, a = t.schema, o = t.tr, s = e.context.toastMark, c = W(r), l = c.to, u = c.startFromOffset, d = c.endFromOffset, f = c.endIndex, p = c.endToOffset, m = bp(i, f);
			if (!Cp.test(m) || r.from === u || !r.empty) return !1;
			if (!m.replace(Ep, "").trim()) o.deleteRange(d, p).split(o.mapping.map(p));
			else {
				var h = Ap(m), g = s.findFirstNodeAtLine(f + 1), _ = m.slice(l - d), v = {
					toastMark: s,
					mdNode: g,
					doc: i,
					line: f + 1
				}, y = Bp[h](v), b = y.listSyntax, x = y.changedResults;
				if (x != null && x.length) {
					o.split(l), x.unshift({
						text: b + _,
						line: f + 1
					}), e.changeToListPerLine(o, x, {
						from: l,
						startLine: x[0].line,
						endLine: Ou(x).line
					});
					var S = o.mapping.map(p) - _.length;
					o.setSelection(z(o, S));
				} else Hu(o, p, _, R(a, b + _));
			}
			return n(o), !0;
		};
	}, t.prototype.toList = function(e) {
		var t = this;
		return function() {
			return function(n, r) {
				for (var i = n.doc, a = n.tr, o = n.selection, s = t.context.toastMark, c = W(o), l = c.startIndex + 1, u = c.endIndex + 1, d = c.endToOffset, f = [], p = l; p <= u; p += 1) {
					var m = s.findFirstNodeAtLine(p);
					if (m && om(m, p)) break;
					if (f.indexOf(p) === -1) {
						var h = {
							toastMark: s,
							mdNode: m,
							doc: i,
							line: p,
							startLine: l
						}, g = (Xu(m) ? Rp[e](h) : zp[e](h)).changedResults, _ = t.changeToListPerLine(a, g, {
							from: Tf(i, g[0].line - 1).startOffset,
							startLine: g[0].line,
							endLine: Ou(g).line,
							indexDiff: 1
						});
						d = Math.max(_, d), g && (f = f.concat(g.map(function(e) {
							return e.line;
						})));
					}
				}
				return r(a.setSelection(z(a, a.mapping.map(d)))), !0;
			};
		};
	}, t.prototype.changeToListPerLine = function(e, t, n) {
		for (var r = n.from, i = n.startLine, a = n.endLine, o = n.indexDiff, s = o === void 0 ? 0 : o, c = 0, l = function(n) {
			var i = e.doc.child(n), a = i.nodeSize, o = i.content, l = e.mapping.map(r), d = l + o.size, f = t.filter(function(e) {
				return e.line - s === n;
			})[0];
			f && (e.replaceWith(l, d, R(u.context.schema, f.text)), c = Math.max(c, r + o.size)), r += a;
		}, u = this, d = i - s; d <= a - s; d += 1) l(d);
		return c;
	}, t.prototype.toggleTask = function() {
		var e = this;
		return function(t, n) {
			for (var r = t.selection, i = t.tr, a = t.doc, o = t.schema, s = e.context.toastMark, c = W(r), l = c.startIndex, u = c.endIndex, d = null, f = l; f <= u; f += 1) {
				var p = s.findFirstNodeAtLine(f + 1);
				if (Xu(p) && p.listData.task) {
					var m = p.listData, h = m.checked, g = m.padding, _ = h ? " " : "x", v = p.sourcepos[0], y = Tf(a, v[0] - 1).startOffset;
					y += v[1] + g, d = i.replaceWith(y, y + 1, o.text(_));
				}
			}
			return d ? (n(d), !0) : !1;
		};
	}, t.prototype.commands = function() {
		return {
			bulletList: this.toList("bullet"),
			orderedList: this.toList("ordered"),
			taskList: this.toList("task")
		};
	}, t.prototype.keymaps = function() {
		var e = this.toList("bullet")(), t = this.toList("ordered")(), n = this.toList("task")(), r = this.toggleTask();
		return {
			"Mod-u": e,
			"Mod-U": e,
			"Mod-o": t,
			"Mod-O": t,
			"alt-t": n,
			"alt-T": n,
			"Shift-Ctrl-x": r,
			"Shift-Ctrl-X": r,
			Enter: this.extendList()
		};
	}, t;
}(K);
function cm(e, t) {
	return function() {
		return function(n, r) {
			var i = n.tr, a = n.selection, o = hf(e) ? e : function(t) {
				return e.test(t);
			}, s = t.length, c = i.doc, l = yf(a), u = l[0], d = l[1], f = Math.max(u - s, 1), p = Math.min(d + s, c.content.size - 1), m = a.content(), h = m.content.textBetween(0, m.content.size, "\n"), g = c.textBetween(f, u, "\n"), _ = c.textBetween(d, p, "\n");
			if (h = `${g}${h}${_}`, g && _ && o(h)) i.delete(p - s, p).delete(f, f + s);
			else {
				i.insertText(t, d).insertText(t, u);
				var v = a.empty ? z(i, u + s) : z(i, u + s, d + s);
				i.setSelection(v);
			}
			return r(i), !0;
		};
	};
}
var lm = /^(\*{2}|_{2}).*([\s\S]*)\1$/m, um = "**", dm = function(e) {
	P(t, e);
	function t() {
		return e !== null && e.apply(this, arguments) || this;
	}
	return Object.defineProperty(t.prototype, "name", {
		get: function() {
			return "strong";
		},
		enumerable: !1,
		configurable: !0
	}), Object.defineProperty(t.prototype, "schema", {
		get: function() {
			return { toDOM: function() {
				return [
					"span",
					{ class: H("strong") },
					0
				];
			} };
		},
		enumerable: !1,
		configurable: !0
	}), t.prototype.bold = function() {
		return cm(lm, um);
	}, t.prototype.commands = function() {
		return { bold: this.bold() };
	}, t.prototype.keymaps = function() {
		var e = this.bold()();
		return {
			"Mod-b": e,
			"Mod-B": e
		};
	}, t;
}(K), fm = /^(~{2}).*([\s\S]*)\1$/m, pm = "~~", mm = function(e) {
	P(t, e);
	function t() {
		return e !== null && e.apply(this, arguments) || this;
	}
	return Object.defineProperty(t.prototype, "name", {
		get: function() {
			return "strike";
		},
		enumerable: !1,
		configurable: !0
	}), Object.defineProperty(t.prototype, "schema", {
		get: function() {
			return { toDOM: function() {
				return [
					"span",
					{ class: H("strike") },
					0
				];
			} };
		},
		enumerable: !1,
		configurable: !0
	}), t.prototype.commands = function() {
		return cm(fm, pm);
	}, t.prototype.keymaps = function() {
		var e = this.commands()();
		return {
			"Mod-s": e,
			"Mod-S": e
		};
	}, t;
}(K), hm = /^(\*|_).*([\s\S]*)\1$/m, gm = "*", _m = function(e) {
	P(t, e);
	function t() {
		return e !== null && e.apply(this, arguments) || this;
	}
	return Object.defineProperty(t.prototype, "name", {
		get: function() {
			return "emph";
		},
		enumerable: !1,
		configurable: !0
	}), Object.defineProperty(t.prototype, "schema", {
		get: function() {
			return { toDOM: function() {
				return [
					"span",
					{ class: H("emph") },
					0
				];
			} };
		},
		enumerable: !1,
		configurable: !0
	}), t.prototype.italic = function() {
		return cm(hm, gm);
	}, t.prototype.commands = function() {
		return { italic: this.italic() };
	}, t.prototype.keymaps = function() {
		var e = this.italic()();
		return {
			"Mod-i": e,
			"Mod-I": e
		};
	}, t;
}(K), vm = /^(`).*([\s\S]*)\1$/m, ym = "`", bm = function(e) {
	P(t, e);
	function t() {
		return e !== null && e.apply(this, arguments) || this;
	}
	return Object.defineProperty(t.prototype, "name", {
		get: function() {
			return "code";
		},
		enumerable: !1,
		configurable: !0
	}), Object.defineProperty(t.prototype, "schema", {
		get: function() {
			return {
				attrs: {
					start: { default: !1 },
					end: { default: !1 },
					marked: { default: !1 }
				},
				toDOM: function(e) {
					var t = e.attrs, n = t.start, r = t.end, i = t.marked, a = "code";
					return n && (a += "|delimiter|start"), r && (a += "|delimiter|end"), i && (a += "|marked-text"), [
						"span",
						{ class: H.apply(void 0, a.split("|")) },
						0
					];
				}
			};
		},
		enumerable: !1,
		configurable: !0
	}), t.prototype.commands = function() {
		return cm(vm, ym);
	}, t.prototype.keymaps = function() {
		var e = this.commands()();
		return {
			"Shift-Mod-c": e,
			"Shift-Mod-C": e
		};
	}, t;
}(K), xm = function(e) {
	P(t, e);
	function t() {
		return e !== null && e.apply(this, arguments) || this;
	}
	return Object.defineProperty(t.prototype, "name", {
		get: function() {
			return "link";
		},
		enumerable: !1,
		configurable: !0
	}), Object.defineProperty(t.prototype, "schema", {
		get: function() {
			return {
				attrs: {
					url: { default: !1 },
					desc: { default: !1 }
				},
				toDOM: function(e) {
					var t = e.attrs, n = t.url, r = t.desc, i = "link";
					return n && (i += "|link-url|marked-text"), r && (i += "|link-desc|marked-text"), [
						"span",
						{ class: H.apply(void 0, i.split("|")) },
						0
					];
				}
			};
		},
		enumerable: !1,
		configurable: !0
	}), t.prototype.addLinkOrImage = function(e) {
		return function(t) {
			return function(n, r) {
				var i = n.selection, a = n.tr, o = n.schema, s = yf(i), c = s[0], l = s[1], u = t, d = u.linkText, f = u.altText, p = u.linkUrl, m = u.imageUrl, h = d, g = p, _ = "";
				return e === "image" && (h = f, g = m, _ = "!"), h = Cu(h), _ += `[${h}](${g})`, r(a.replaceWith(c, l, R(o, _))), !0;
			};
		};
	}, t.prototype.commands = function() {
		return {
			addImage: this.addLinkOrImage("image"),
			addLink: this.addLinkOrImage("link")
		};
	}, t;
}(K), Sm = function(e) {
	P(t, e);
	function t() {
		return e !== null && e.apply(this, arguments) || this;
	}
	return Object.defineProperty(t.prototype, "name", {
		get: function() {
			return "taskDelimiter";
		},
		enumerable: !1,
		configurable: !0
	}), Object.defineProperty(t.prototype, "schema", {
		get: function() {
			return { toDOM: function() {
				return [
					"span",
					{ class: H("delimiter", "list-item") },
					0
				];
			} };
		},
		enumerable: !1,
		configurable: !0
	}), t;
}(K), Cm = function(e) {
	P(t, e);
	function t() {
		return e !== null && e.apply(this, arguments) || this;
	}
	return Object.defineProperty(t.prototype, "name", {
		get: function() {
			return "delimiter";
		},
		enumerable: !1,
		configurable: !0
	}), Object.defineProperty(t.prototype, "schema", {
		get: function() {
			return { toDOM: function() {
				return [
					"span",
					{ class: H("delimiter") },
					0
				];
			} };
		},
		enumerable: !1,
		configurable: !0
	}), t;
}(K), wm = function(e) {
	P(t, e);
	function t() {
		return e !== null && e.apply(this, arguments) || this;
	}
	return Object.defineProperty(t.prototype, "name", {
		get: function() {
			return "meta";
		},
		enumerable: !1,
		configurable: !0
	}), Object.defineProperty(t.prototype, "schema", {
		get: function() {
			return { toDOM: function() {
				return [
					"span",
					{ class: H("meta") },
					0
				];
			} };
		},
		enumerable: !1,
		configurable: !0
	}), t;
}(K), Tm = function(e) {
	P(t, e);
	function t() {
		return e !== null && e.apply(this, arguments) || this;
	}
	return Object.defineProperty(t.prototype, "name", {
		get: function() {
			return "markedText";
		},
		enumerable: !1,
		configurable: !0
	}), Object.defineProperty(t.prototype, "schema", {
		get: function() {
			return { toDOM: function() {
				return [
					"span",
					{ class: H("marked-text") },
					0
				];
			} };
		},
		enumerable: !1,
		configurable: !0
	}), t;
}(K), Em = function(e) {
	P(t, e);
	function t() {
		return e !== null && e.apply(this, arguments) || this;
	}
	return Object.defineProperty(t.prototype, "name", {
		get: function() {
			return "tableCell";
		},
		enumerable: !1,
		configurable: !0
	}), Object.defineProperty(t.prototype, "schema", {
		get: function() {
			return { toDOM: function() {
				return [
					"span",
					{ class: H("table-cell") },
					0
				];
			} };
		},
		enumerable: !1,
		configurable: !0
	}), t;
}(K), Dm = function(e) {
	P(t, e);
	function t() {
		return e !== null && e.apply(this, arguments) || this;
	}
	return Object.defineProperty(t.prototype, "name", {
		get: function() {
			return "html";
		},
		enumerable: !1,
		configurable: !0
	}), Object.defineProperty(t.prototype, "schema", {
		get: function() {
			return { toDOM: function() {
				return [
					"span",
					{ class: H("html") },
					0
				];
			} };
		},
		enumerable: !1,
		configurable: !0
	}), t;
}(K), Om = "$$", km = function(e) {
	P(t, e);
	function t() {
		return e !== null && e.apply(this, arguments) || this;
	}
	return Object.defineProperty(t.prototype, "name", {
		get: function() {
			return "customBlock";
		},
		enumerable: !1,
		configurable: !0
	}), Object.defineProperty(t.prototype, "schema", {
		get: function() {
			return { toDOM: function() {
				return [
					"span",
					{ class: H("custom-block") },
					0
				];
			} };
		},
		enumerable: !1,
		configurable: !0
	}), t.prototype.commands = function() {
		return function(e) {
			return function(t, n) {
				var r = t.selection, i = t.schema, a = t.tr, o = W(r), s = o.startFromOffset, c = o.endToOffset;
				if (!(e != null && e.info)) return !1;
				var l = `${Om}${e.info}`, u = R(i, l), d = R(i, Om);
				return a.insert(s, u).split(s + l.length), a.split(a.mapping.map(c)).insert(a.mapping.map(c), d), n(a.setSelection(z(a, a.mapping.map(c) - (Om.length + 2)))), !0;
			};
		};
	}, t;
}(K), Am = /x|backspace/i, jm = /^\[(\s*)(x?)(\s*)\](?:\s+)/i;
function Mm(e) {
	var t = e.schema, n = e.toastMark;
	return new rr({ props: { handleDOMEvents: { keyup: function(e, r) {
		var i, a = e.state, o = a.doc, s = a.tr, c = a.selection;
		if (c.empty && Am.test(r.key)) {
			var l = W(c), u = l.startIndex, d = l.startFromOffset, f = l.from, p = [u + 1, f - d + 1], m = td(n.findNodeAtPosition(p), function(e) {
				var t;
				return e.type === "paragraph" && ((t = e.parent) == null ? void 0 : t.type) === "item";
			});
			if ((i = m == null ? void 0 : m.firstChild) != null && i.literal) {
				var h = m.firstChild, g = h.literal.match(jm);
				if (g) {
					var _ = h.sourcepos[0], v = g[1], y = g[2], b = g[3], x = v.length + b.length, S = Tf(o, _[0] - 1).startOffset, ee = _[1] + S;
					if (y) {
						var te = x ? x + 1 : 0;
						s.replaceWith(ee, te + ee, t.text(y)), e.dispatch(s);
					} else x || (s.insertText(" ", ee), e.dispatch(s));
				}
			}
		}
		return !1;
	} } } });
}
var Nm = "cut", Pm = /\r\n|\n|\r/, Fm = function(e) {
	P(t, e);
	function t(t, n) {
		var r = e.call(this, t) || this, i = n.toastMark, a = n.useCommandShortcut, o = a === void 0 || a, s = n.mdPlugins, c = s === void 0 ? [] : s;
		return r.editorType = "markdown", r.el.classList.add("md-mode"), r.toastMark = i, r.extraPlugins = c, r.specs = r.createSpecs(), r.schema = r.createSchema(), r.context = r.createContext(), r.keymaps = r.createKeymaps(o), r.view = r.createView(), r.commands = r.createCommands(), r.specs.setContext(F(F({}, r.context), { view: r.view })), r.createClipboard(), r.eventEmitter.listen("changePreviewTabWrite", function(e) {
			return r.toggleActive(!0, e);
		}), r.eventEmitter.listen("changePreviewTabPreview", function() {
			return r.toggleActive(!1);
		}), r.initEvent(), r;
	}
	return t.prototype.toggleActive = function(e, t) {
		qd(this.el, "active", e), e ? t || this.focus() : this.blur();
	}, t.prototype.createClipboard = function() {
		var e = this;
		this.clipboard = document.createElement("textarea"), this.clipboard.className = V("pseudo-clipboard"), this.clipboard.addEventListener("paste", function(t) {
			var n = t.clipboardData || window.clipboardData, r = n && n.items;
			if (r && !Ru(r).some(function(e) {
				return e.kind === "string" && e.type === "text/rtf";
			})) {
				var i = cf(r);
				i && (t.preventDefault(), sf(e.eventEmitter, i, t.type));
			}
		}), this.clipboard.addEventListener("input", function(t) {
			var n = t.target.value;
			e.replaceSelection(n), t.preventDefault(), t.target.value = "";
		}), this.el.insertBefore(this.clipboard, this.view.dom);
	}, t.prototype.createContext = function() {
		return {
			toastMark: this.toastMark,
			schema: this.schema,
			eventEmitter: this.eventEmitter
		};
	}, t.prototype.createSpecs = function() {
		return new vf([
			new vp(),
			new Kp(),
			new ff(),
			new qp(),
			new Yp(),
			new Sp(),
			new Zp(),
			new km(),
			new rm(),
			new Em(),
			new am(),
			new sm(),
			new dm(),
			new mm(),
			new _m(),
			new bm(),
			new xm(),
			new Cm(),
			new Sm(),
			new Tm(),
			new wm(),
			new Dm()
		]);
	}, t.prototype.createPlugins = function() {
		return rl([
			op(this.context),
			_p(this.context),
			Mm(this.context)
		], this.createPluginProps(), !0).concat(this.defaultPlugins);
	}, t.prototype.createView = function() {
		var e = this;
		return new ws(this.el, {
			state: this.createState(),
			dispatchTransaction: function(t) {
				e.updateMarkdown(t);
				var n = e.view.state.applyTransaction(t).state;
				e.view.updateState(n), e.emitChangeEvent(t);
			},
			handleKeyDown: function(t, n) {
				return (n.metaKey || n.ctrlKey) && n.key.toUpperCase() === "V" && e.clipboard.focus(), e.eventEmitter.emit("keydown", e.editorType, n), !1;
			},
			handleDOMEvents: {
				copy: function(t, n) {
					return e.captureCopy(n);
				},
				cut: function(t, n) {
					return e.captureCopy(n, Nm);
				},
				scroll: function() {
					return e.eventEmitter.emit("scroll", "editor"), !0;
				},
				keyup: function(t, n) {
					return e.eventEmitter.emit("keyup", e.editorType, n), !1;
				}
			},
			nodeViews: { widget: uf }
		});
	}, t.prototype.createCommands = function() {
		return this.specs.commands(this.view);
	}, t.prototype.captureCopy = function(e, t) {
		e.preventDefault();
		var n = this.view.state, r = n.selection, i = n.tr;
		if (r.empty) return !0;
		var a = this.getChanged(r.content());
		return e.clipboardData ? e.clipboardData.setData("text/plain", a) : window.clipboardData.setData("Text", a), t === Nm && this.view.dispatch(i.deleteSelection().scrollIntoView().setMeta("uiEvent", Nm)), !0;
	}, t.prototype.updateMarkdown = function(e) {
		var t = this;
		e.docChanged && e.steps.forEach(function(n, r) {
			if (n.slice && !(n instanceof Gt)) {
				var i = e.docs[r], a = [n.from, n.to], o = a[0], s = a[1], c = Sf(i, o, s), l = c[0], u = c[1], d = t.getChanged(n.slice);
				l[0] === u[0] && l[1] === u[1] && d === "" && (d = "\n");
				var f = t.toastMark.editMarkdown(l, u, d);
				t.eventEmitter.emit("updatePreview", f), e.setMeta("editResult", f).scrollIntoView();
			}
		});
	}, t.prototype.getChanged = function(e) {
		var t = "", n = 0, r = e.content.size;
		return e.content.nodesBetween(n, r, function(e, i) {
			e.isText ? t += e.text.slice(Math.max(n, i) - i, r - i) : e.isBlock && i > 0 && (t += "\n");
		}), t;
	}, t.prototype.setSelection = function(e, t) {
		t === void 0 && (t = e);
		var n = this.view.state.tr, r = wf(n.doc, e, t), i = r[0], a = r[1];
		this.view.dispatch(n.setSelection(z(n, i, a)).scrollIntoView());
	}, t.prototype.replaceSelection = function(e, t, n) {
		var r, i = this.view.state, a = i.tr, o = i.schema, s = i.doc, c = e.split(Pm).map(function(e) {
			return zu(o, gd(e, o));
		}), l = new D(T.from(c), 1, 1);
		if (this.focus(), t && n) {
			var u = wf(s, t, n), d = u[0], f = u[1];
			r = a.replaceRange(d, f, l);
		} else r = a.replaceSelection(l);
		this.view.dispatch(r.scrollIntoView());
	}, t.prototype.deleteSelection = function(e, t) {
		var n, r = this.view.state, i = r.tr, a = r.doc;
		if (e && t) {
			var o = wf(a, e, t), s = o[0], c = o[1];
			n = i.deleteRange(s, c);
		} else n = i.deleteSelection();
		this.view.dispatch(n.scrollIntoView());
	}, t.prototype.getSelectedText = function(e, t) {
		var n = this.view.state, r = n.doc, i = n.selection, a = i.from, o = i.to;
		if (e && t) {
			var s = wf(r, e, t);
			a = s[0], o = s[1];
		}
		return r.textBetween(a, o, "\n");
	}, t.prototype.getSelection = function() {
		var e = this.view.state.selection, t = e.from, n = e.to;
		return Sf(this.view.state.tr.doc, t, n);
	}, t.prototype.setMarkdown = function(e, t) {
		t === void 0 && (t = !0);
		var n = e.split(Pm), r = this.view.state, i = r.tr, a = r.doc, o = r.schema, s = n.map(function(e) {
			return zu(o, gd(e, o));
		});
		this.view.dispatch(i.replaceWith(0, a.content.size, s)), t && this.moveCursorToEnd(!0);
	}, t.prototype.addWidget = function(e, t, n) {
		var r = this.view.state, i = r.tr, a = r.doc, o = r.selection, s = n ? wf(a, n, n)[0] : o.to;
		this.view.dispatch(i.setMeta("widget", {
			pos: s,
			node: e,
			style: t
		}));
	}, t.prototype.replaceWithWidget = function(e, t, n) {
		var r = this.view.state, i = r.tr, a = r.schema, o = r.doc, s = wf(o, e, t), c = gd(n, a);
		this.view.dispatch(i.replaceWith(s[0], s[1], c));
	}, t.prototype.getRangeInfoOfNode = function(e) {
		var t = this.view.state, n = t.doc, r = t.selection, i = e || Sf(n, r.from)[0], a = this.toastMark.findNodeAtPosition(i);
		return a.type === "text" && a.parent.type !== "paragraph" && (a = a.parent), a.sourcepos[1][1] += 1, {
			range: a.sourcepos,
			type: a.type
		};
	}, t.prototype.getMarkdown = function() {
		return this.toastMark.getLineTexts().map(function(e) {
			return ud(e);
		}).join("\n");
	}, t.prototype.getToastMark = function() {
		return this.toastMark;
	}, t;
}(pf), Im = "_feEventKey";
function Lm(e, t) {
	var n = e[Im], r;
	return n || (n = e[Im] = {}), r = n[t], r || (r = n[t] = []), r;
}
var Rm = Lm, zm = ll, Bm = vl, Vm = Rm;
function Hm(e, t, n) {
	if (zm(t)) {
		Bm(t.split(/\s+/g), function(t) {
			Um(e, t, n);
		});
		return;
	}
	Bm(t, function(t, n) {
		Um(e, n, t);
	});
}
function Um(e, t, n) {
	var r = Vm(e, t), i;
	n ? (Bm(r, function(r, a) {
		return n !== r.handler || (Wm(e, t, r.wrappedHandler), i = a, !1);
	}), r.splice(i, 1)) : (Bm(r, function(n) {
		Wm(e, t, n.wrappedHandler);
	}), r.splice(0, r.length));
}
function Wm(e, t, n) {
	"removeEventListener" in e ? e.removeEventListener(t, n) : "detachEvent" in e && e.detachEvent("on" + t, n);
}
var Gm = Hm, Km = ll, qm = vl, Jm = Rm;
function Ym(e, t, n, r) {
	if (Km(t)) {
		qm(t.split(/\s+/g), function(t) {
			Xm(e, t, n, r);
		});
		return;
	}
	qm(t, function(t, r) {
		Xm(e, r, t, n);
	});
}
function Xm(e, t, n, r) {
	function i(t) {
		n.call(r || e, t || window.event);
	}
	"addEventListener" in e ? e.addEventListener(t, i) : "attachEvent" in e && e.attachEvent("on" + t, i), Zm(e, t, n, i);
}
function Zm(e, t, n, r) {
	var i = Jm(e, t), a = !1;
	qm(i, function(e) {
		return e.handler !== n || (a = !0, !1);
	}), a || i.push({
		handler: n,
		wrappedHandler: r
	});
}
var Qm = Ym, $m = function(e, t) {
	return $m = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(e, t) {
		e.__proto__ = t;
	} || function(e, t) {
		for (var n in t) Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n]);
	}, $m(e, t);
};
function eh(e, t) {
	if (typeof t != "function" && t !== null) throw TypeError("Class extends value " + String(t) + " is not a constructor or null");
	$m(e, t);
	function n() {
		this.constructor = e;
	}
	e.prototype = t === null ? Object.create(t) : (n.prototype = t.prototype, new n());
}
var th = function() {
	return th = Object.assign || function(e) {
		for (var t, n = 1, r = arguments.length; n < r; n++) for (var i in t = arguments[n], t) Object.prototype.hasOwnProperty.call(t, i) && (e[i] = t[i]);
		return e;
	}, th.apply(this, arguments);
};
function nh(e, t, n) {
	if (n || arguments.length === 2) for (var r = 0, i = t.length, a; r < i; r++) (a || !(r in t)) && (a || (a = Array.prototype.slice.call(t, 0, r)), a[r] = t[r]);
	return e.concat(a || Array.prototype.slice.call(t));
}
var rh = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {}, ih = {};
function ah(e) {
	var t, n, r = ih[e];
	if (r) return r;
	for (r = ih[e] = [], t = 0; t < 128; t++) n = String.fromCharCode(t), /^[0-9a-z]$/i.test(n) ? r.push(n) : r.push("%" + ("0" + t.toString(16).toUpperCase()).slice(-2));
	for (t = 0; t < e.length; t++) r[e.charCodeAt(t)] = e[t];
	return r;
}
function oh(e, t, n) {
	var r, i, a, o, s, c = "";
	for (typeof t != "string" && (n = t, t = oh.defaultChars), n === void 0 && (n = !0), s = ah(t), r = 0, i = e.length; r < i; r++) {
		if (a = e.charCodeAt(r), n && a === 37 && r + 2 < i && /^[0-9a-f]{2}$/i.test(e.slice(r + 1, r + 3))) {
			c += e.slice(r, r + 3), r += 2;
			continue;
		}
		if (a < 128) {
			c += s[a];
			continue;
		}
		if (a >= 55296 && a <= 57343) {
			if (a >= 55296 && a <= 56319 && r + 1 < i && (o = e.charCodeAt(r + 1), o >= 56320 && o <= 57343)) {
				c += encodeURIComponent(e[r] + e[r + 1]), r++;
				continue;
			}
			c += "%EF%BF%BD";
			continue;
		}
		c += encodeURIComponent(e[r]);
	}
	return c;
}
oh.defaultChars = ";/?:@&=+$,-_.!~*'()#", oh.componentChars = "-_.!~*'()";
var sh = oh, ch = {}, lh = {}, uh = {
	Aacute: "Á",
	aacute: "á",
	Abreve: "Ă",
	abreve: "ă",
	ac: "∾",
	acd: "∿",
	acE: "∾̳",
	Acirc: "Â",
	acirc: "â",
	acute: "´",
	Acy: "А",
	acy: "а",
	AElig: "Æ",
	aelig: "æ",
	af: "⁡",
	Afr: "𝔄",
	afr: "𝔞",
	Agrave: "À",
	agrave: "à",
	alefsym: "ℵ",
	aleph: "ℵ",
	Alpha: "Α",
	alpha: "α",
	Amacr: "Ā",
	amacr: "ā",
	amalg: "⨿",
	amp: "&",
	AMP: "&",
	andand: "⩕",
	And: "⩓",
	and: "∧",
	andd: "⩜",
	andslope: "⩘",
	andv: "⩚",
	ang: "∠",
	ange: "⦤",
	angle: "∠",
	angmsdaa: "⦨",
	angmsdab: "⦩",
	angmsdac: "⦪",
	angmsdad: "⦫",
	angmsdae: "⦬",
	angmsdaf: "⦭",
	angmsdag: "⦮",
	angmsdah: "⦯",
	angmsd: "∡",
	angrt: "∟",
	angrtvb: "⊾",
	angrtvbd: "⦝",
	angsph: "∢",
	angst: "Å",
	angzarr: "⍼",
	Aogon: "Ą",
	aogon: "ą",
	Aopf: "𝔸",
	aopf: "𝕒",
	apacir: "⩯",
	ap: "≈",
	apE: "⩰",
	ape: "≊",
	apid: "≋",
	apos: "'",
	ApplyFunction: "⁡",
	approx: "≈",
	approxeq: "≊",
	Aring: "Å",
	aring: "å",
	Ascr: "𝒜",
	ascr: "𝒶",
	Assign: "≔",
	ast: "*",
	asymp: "≈",
	asympeq: "≍",
	Atilde: "Ã",
	atilde: "ã",
	Auml: "Ä",
	auml: "ä",
	awconint: "∳",
	awint: "⨑",
	backcong: "≌",
	backepsilon: "϶",
	backprime: "‵",
	backsim: "∽",
	backsimeq: "⋍",
	Backslash: "∖",
	Barv: "⫧",
	barvee: "⊽",
	barwed: "⌅",
	Barwed: "⌆",
	barwedge: "⌅",
	bbrk: "⎵",
	bbrktbrk: "⎶",
	bcong: "≌",
	Bcy: "Б",
	bcy: "б",
	bdquo: "„",
	becaus: "∵",
	because: "∵",
	Because: "∵",
	bemptyv: "⦰",
	bepsi: "϶",
	bernou: "ℬ",
	Bernoullis: "ℬ",
	Beta: "Β",
	beta: "β",
	beth: "ℶ",
	between: "≬",
	Bfr: "𝔅",
	bfr: "𝔟",
	bigcap: "⋂",
	bigcirc: "◯",
	bigcup: "⋃",
	bigodot: "⨀",
	bigoplus: "⨁",
	bigotimes: "⨂",
	bigsqcup: "⨆",
	bigstar: "★",
	bigtriangledown: "▽",
	bigtriangleup: "△",
	biguplus: "⨄",
	bigvee: "⋁",
	bigwedge: "⋀",
	bkarow: "⤍",
	blacklozenge: "⧫",
	blacksquare: "▪",
	blacktriangle: "▴",
	blacktriangledown: "▾",
	blacktriangleleft: "◂",
	blacktriangleright: "▸",
	blank: "␣",
	blk12: "▒",
	blk14: "░",
	blk34: "▓",
	block: "█",
	bne: "=⃥",
	bnequiv: "≡⃥",
	bNot: "⫭",
	bnot: "⌐",
	Bopf: "𝔹",
	bopf: "𝕓",
	bot: "⊥",
	bottom: "⊥",
	bowtie: "⋈",
	boxbox: "⧉",
	boxdl: "┐",
	boxdL: "╕",
	boxDl: "╖",
	boxDL: "╗",
	boxdr: "┌",
	boxdR: "╒",
	boxDr: "╓",
	boxDR: "╔",
	boxh: "─",
	boxH: "═",
	boxhd: "┬",
	boxHd: "╤",
	boxhD: "╥",
	boxHD: "╦",
	boxhu: "┴",
	boxHu: "╧",
	boxhU: "╨",
	boxHU: "╩",
	boxminus: "⊟",
	boxplus: "⊞",
	boxtimes: "⊠",
	boxul: "┘",
	boxuL: "╛",
	boxUl: "╜",
	boxUL: "╝",
	boxur: "└",
	boxuR: "╘",
	boxUr: "╙",
	boxUR: "╚",
	boxv: "│",
	boxV: "║",
	boxvh: "┼",
	boxvH: "╪",
	boxVh: "╫",
	boxVH: "╬",
	boxvl: "┤",
	boxvL: "╡",
	boxVl: "╢",
	boxVL: "╣",
	boxvr: "├",
	boxvR: "╞",
	boxVr: "╟",
	boxVR: "╠",
	bprime: "‵",
	breve: "˘",
	Breve: "˘",
	brvbar: "¦",
	bscr: "𝒷",
	Bscr: "ℬ",
	bsemi: "⁏",
	bsim: "∽",
	bsime: "⋍",
	bsolb: "⧅",
	bsol: "\\",
	bsolhsub: "⟈",
	bull: "•",
	bullet: "•",
	bump: "≎",
	bumpE: "⪮",
	bumpe: "≏",
	Bumpeq: "≎",
	bumpeq: "≏",
	Cacute: "Ć",
	cacute: "ć",
	capand: "⩄",
	capbrcup: "⩉",
	capcap: "⩋",
	cap: "∩",
	Cap: "⋒",
	capcup: "⩇",
	capdot: "⩀",
	CapitalDifferentialD: "ⅅ",
	caps: "∩︀",
	caret: "⁁",
	caron: "ˇ",
	Cayleys: "ℭ",
	ccaps: "⩍",
	Ccaron: "Č",
	ccaron: "č",
	Ccedil: "Ç",
	ccedil: "ç",
	Ccirc: "Ĉ",
	ccirc: "ĉ",
	Cconint: "∰",
	ccups: "⩌",
	ccupssm: "⩐",
	Cdot: "Ċ",
	cdot: "ċ",
	cedil: "¸",
	Cedilla: "¸",
	cemptyv: "⦲",
	cent: "¢",
	centerdot: "·",
	CenterDot: "·",
	cfr: "𝔠",
	Cfr: "ℭ",
	CHcy: "Ч",
	chcy: "ч",
	check: "✓",
	checkmark: "✓",
	Chi: "Χ",
	chi: "χ",
	circ: "ˆ",
	circeq: "≗",
	circlearrowleft: "↺",
	circlearrowright: "↻",
	circledast: "⊛",
	circledcirc: "⊚",
	circleddash: "⊝",
	CircleDot: "⊙",
	circledR: "®",
	circledS: "Ⓢ",
	CircleMinus: "⊖",
	CirclePlus: "⊕",
	CircleTimes: "⊗",
	cir: "○",
	cirE: "⧃",
	cire: "≗",
	cirfnint: "⨐",
	cirmid: "⫯",
	cirscir: "⧂",
	ClockwiseContourIntegral: "∲",
	CloseCurlyDoubleQuote: "”",
	CloseCurlyQuote: "’",
	clubs: "♣",
	clubsuit: "♣",
	colon: ":",
	Colon: "∷",
	Colone: "⩴",
	colone: "≔",
	coloneq: "≔",
	comma: ",",
	commat: "@",
	comp: "∁",
	compfn: "∘",
	complement: "∁",
	complexes: "ℂ",
	cong: "≅",
	congdot: "⩭",
	Congruent: "≡",
	conint: "∮",
	Conint: "∯",
	ContourIntegral: "∮",
	copf: "𝕔",
	Copf: "ℂ",
	coprod: "∐",
	Coproduct: "∐",
	copy: "©",
	COPY: "©",
	copysr: "℗",
	CounterClockwiseContourIntegral: "∳",
	crarr: "↵",
	cross: "✗",
	Cross: "⨯",
	Cscr: "𝒞",
	cscr: "𝒸",
	csub: "⫏",
	csube: "⫑",
	csup: "⫐",
	csupe: "⫒",
	ctdot: "⋯",
	cudarrl: "⤸",
	cudarrr: "⤵",
	cuepr: "⋞",
	cuesc: "⋟",
	cularr: "↶",
	cularrp: "⤽",
	cupbrcap: "⩈",
	cupcap: "⩆",
	CupCap: "≍",
	cup: "∪",
	Cup: "⋓",
	cupcup: "⩊",
	cupdot: "⊍",
	cupor: "⩅",
	cups: "∪︀",
	curarr: "↷",
	curarrm: "⤼",
	curlyeqprec: "⋞",
	curlyeqsucc: "⋟",
	curlyvee: "⋎",
	curlywedge: "⋏",
	curren: "¤",
	curvearrowleft: "↶",
	curvearrowright: "↷",
	cuvee: "⋎",
	cuwed: "⋏",
	cwconint: "∲",
	cwint: "∱",
	cylcty: "⌭",
	dagger: "†",
	Dagger: "‡",
	daleth: "ℸ",
	darr: "↓",
	Darr: "↡",
	dArr: "⇓",
	dash: "‐",
	Dashv: "⫤",
	dashv: "⊣",
	dbkarow: "⤏",
	dblac: "˝",
	Dcaron: "Ď",
	dcaron: "ď",
	Dcy: "Д",
	dcy: "д",
	ddagger: "‡",
	ddarr: "⇊",
	DD: "ⅅ",
	dd: "ⅆ",
	DDotrahd: "⤑",
	ddotseq: "⩷",
	deg: "°",
	Del: "∇",
	Delta: "Δ",
	delta: "δ",
	demptyv: "⦱",
	dfisht: "⥿",
	Dfr: "𝔇",
	dfr: "𝔡",
	dHar: "⥥",
	dharl: "⇃",
	dharr: "⇂",
	DiacriticalAcute: "´",
	DiacriticalDot: "˙",
	DiacriticalDoubleAcute: "˝",
	DiacriticalGrave: "`",
	DiacriticalTilde: "˜",
	diam: "⋄",
	diamond: "⋄",
	Diamond: "⋄",
	diamondsuit: "♦",
	diams: "♦",
	die: "¨",
	DifferentialD: "ⅆ",
	digamma: "ϝ",
	disin: "⋲",
	div: "÷",
	divide: "÷",
	divideontimes: "⋇",
	divonx: "⋇",
	DJcy: "Ђ",
	djcy: "ђ",
	dlcorn: "⌞",
	dlcrop: "⌍",
	dollar: "$",
	Dopf: "𝔻",
	dopf: "𝕕",
	Dot: "¨",
	dot: "˙",
	DotDot: "⃜",
	doteq: "≐",
	doteqdot: "≑",
	DotEqual: "≐",
	dotminus: "∸",
	dotplus: "∔",
	dotsquare: "⊡",
	doublebarwedge: "⌆",
	DoubleContourIntegral: "∯",
	DoubleDot: "¨",
	DoubleDownArrow: "⇓",
	DoubleLeftArrow: "⇐",
	DoubleLeftRightArrow: "⇔",
	DoubleLeftTee: "⫤",
	DoubleLongLeftArrow: "⟸",
	DoubleLongLeftRightArrow: "⟺",
	DoubleLongRightArrow: "⟹",
	DoubleRightArrow: "⇒",
	DoubleRightTee: "⊨",
	DoubleUpArrow: "⇑",
	DoubleUpDownArrow: "⇕",
	DoubleVerticalBar: "∥",
	DownArrowBar: "⤓",
	downarrow: "↓",
	DownArrow: "↓",
	Downarrow: "⇓",
	DownArrowUpArrow: "⇵",
	DownBreve: "̑",
	downdownarrows: "⇊",
	downharpoonleft: "⇃",
	downharpoonright: "⇂",
	DownLeftRightVector: "⥐",
	DownLeftTeeVector: "⥞",
	DownLeftVectorBar: "⥖",
	DownLeftVector: "↽",
	DownRightTeeVector: "⥟",
	DownRightVectorBar: "⥗",
	DownRightVector: "⇁",
	DownTeeArrow: "↧",
	DownTee: "⊤",
	drbkarow: "⤐",
	drcorn: "⌟",
	drcrop: "⌌",
	Dscr: "𝒟",
	dscr: "𝒹",
	DScy: "Ѕ",
	dscy: "ѕ",
	dsol: "⧶",
	Dstrok: "Đ",
	dstrok: "đ",
	dtdot: "⋱",
	dtri: "▿",
	dtrif: "▾",
	duarr: "⇵",
	duhar: "⥯",
	dwangle: "⦦",
	DZcy: "Џ",
	dzcy: "џ",
	dzigrarr: "⟿",
	Eacute: "É",
	eacute: "é",
	easter: "⩮",
	Ecaron: "Ě",
	ecaron: "ě",
	Ecirc: "Ê",
	ecirc: "ê",
	ecir: "≖",
	ecolon: "≕",
	Ecy: "Э",
	ecy: "э",
	eDDot: "⩷",
	Edot: "Ė",
	edot: "ė",
	eDot: "≑",
	ee: "ⅇ",
	efDot: "≒",
	Efr: "𝔈",
	efr: "𝔢",
	eg: "⪚",
	Egrave: "È",
	egrave: "è",
	egs: "⪖",
	egsdot: "⪘",
	el: "⪙",
	Element: "∈",
	elinters: "⏧",
	ell: "ℓ",
	els: "⪕",
	elsdot: "⪗",
	Emacr: "Ē",
	emacr: "ē",
	empty: "∅",
	emptyset: "∅",
	EmptySmallSquare: "◻",
	emptyv: "∅",
	EmptyVerySmallSquare: "▫",
	emsp13: " ",
	emsp14: " ",
	emsp: " ",
	ENG: "Ŋ",
	eng: "ŋ",
	ensp: " ",
	Eogon: "Ę",
	eogon: "ę",
	Eopf: "𝔼",
	eopf: "𝕖",
	epar: "⋕",
	eparsl: "⧣",
	eplus: "⩱",
	epsi: "ε",
	Epsilon: "Ε",
	epsilon: "ε",
	epsiv: "ϵ",
	eqcirc: "≖",
	eqcolon: "≕",
	eqsim: "≂",
	eqslantgtr: "⪖",
	eqslantless: "⪕",
	Equal: "⩵",
	equals: "=",
	EqualTilde: "≂",
	equest: "≟",
	Equilibrium: "⇌",
	equiv: "≡",
	equivDD: "⩸",
	eqvparsl: "⧥",
	erarr: "⥱",
	erDot: "≓",
	escr: "ℯ",
	Escr: "ℰ",
	esdot: "≐",
	Esim: "⩳",
	esim: "≂",
	Eta: "Η",
	eta: "η",
	ETH: "Ð",
	eth: "ð",
	Euml: "Ë",
	euml: "ë",
	euro: "€",
	excl: "!",
	exist: "∃",
	Exists: "∃",
	expectation: "ℰ",
	exponentiale: "ⅇ",
	ExponentialE: "ⅇ",
	fallingdotseq: "≒",
	Fcy: "Ф",
	fcy: "ф",
	female: "♀",
	ffilig: "ﬃ",
	fflig: "ﬀ",
	ffllig: "ﬄ",
	Ffr: "𝔉",
	ffr: "𝔣",
	filig: "ﬁ",
	FilledSmallSquare: "◼",
	FilledVerySmallSquare: "▪",
	fjlig: "fj",
	flat: "♭",
	fllig: "ﬂ",
	fltns: "▱",
	fnof: "ƒ",
	Fopf: "𝔽",
	fopf: "𝕗",
	forall: "∀",
	ForAll: "∀",
	fork: "⋔",
	forkv: "⫙",
	Fouriertrf: "ℱ",
	fpartint: "⨍",
	frac12: "½",
	frac13: "⅓",
	frac14: "¼",
	frac15: "⅕",
	frac16: "⅙",
	frac18: "⅛",
	frac23: "⅔",
	frac25: "⅖",
	frac34: "¾",
	frac35: "⅗",
	frac38: "⅜",
	frac45: "⅘",
	frac56: "⅚",
	frac58: "⅝",
	frac78: "⅞",
	frasl: "⁄",
	frown: "⌢",
	fscr: "𝒻",
	Fscr: "ℱ",
	gacute: "ǵ",
	Gamma: "Γ",
	gamma: "γ",
	Gammad: "Ϝ",
	gammad: "ϝ",
	gap: "⪆",
	Gbreve: "Ğ",
	gbreve: "ğ",
	Gcedil: "Ģ",
	Gcirc: "Ĝ",
	gcirc: "ĝ",
	Gcy: "Г",
	gcy: "г",
	Gdot: "Ġ",
	gdot: "ġ",
	ge: "≥",
	gE: "≧",
	gEl: "⪌",
	gel: "⋛",
	geq: "≥",
	geqq: "≧",
	geqslant: "⩾",
	gescc: "⪩",
	ges: "⩾",
	gesdot: "⪀",
	gesdoto: "⪂",
	gesdotol: "⪄",
	gesl: "⋛︀",
	gesles: "⪔",
	Gfr: "𝔊",
	gfr: "𝔤",
	gg: "≫",
	Gg: "⋙",
	ggg: "⋙",
	gimel: "ℷ",
	GJcy: "Ѓ",
	gjcy: "ѓ",
	gla: "⪥",
	gl: "≷",
	glE: "⪒",
	glj: "⪤",
	gnap: "⪊",
	gnapprox: "⪊",
	gne: "⪈",
	gnE: "≩",
	gneq: "⪈",
	gneqq: "≩",
	gnsim: "⋧",
	Gopf: "𝔾",
	gopf: "𝕘",
	grave: "`",
	GreaterEqual: "≥",
	GreaterEqualLess: "⋛",
	GreaterFullEqual: "≧",
	GreaterGreater: "⪢",
	GreaterLess: "≷",
	GreaterSlantEqual: "⩾",
	GreaterTilde: "≳",
	Gscr: "𝒢",
	gscr: "ℊ",
	gsim: "≳",
	gsime: "⪎",
	gsiml: "⪐",
	gtcc: "⪧",
	gtcir: "⩺",
	gt: ">",
	GT: ">",
	Gt: "≫",
	gtdot: "⋗",
	gtlPar: "⦕",
	gtquest: "⩼",
	gtrapprox: "⪆",
	gtrarr: "⥸",
	gtrdot: "⋗",
	gtreqless: "⋛",
	gtreqqless: "⪌",
	gtrless: "≷",
	gtrsim: "≳",
	gvertneqq: "≩︀",
	gvnE: "≩︀",
	Hacek: "ˇ",
	hairsp: " ",
	half: "½",
	hamilt: "ℋ",
	HARDcy: "Ъ",
	hardcy: "ъ",
	harrcir: "⥈",
	harr: "↔",
	hArr: "⇔",
	harrw: "↭",
	Hat: "^",
	hbar: "ℏ",
	Hcirc: "Ĥ",
	hcirc: "ĥ",
	hearts: "♥",
	heartsuit: "♥",
	hellip: "…",
	hercon: "⊹",
	hfr: "𝔥",
	Hfr: "ℌ",
	HilbertSpace: "ℋ",
	hksearow: "⤥",
	hkswarow: "⤦",
	hoarr: "⇿",
	homtht: "∻",
	hookleftarrow: "↩",
	hookrightarrow: "↪",
	hopf: "𝕙",
	Hopf: "ℍ",
	horbar: "―",
	HorizontalLine: "─",
	hscr: "𝒽",
	Hscr: "ℋ",
	hslash: "ℏ",
	Hstrok: "Ħ",
	hstrok: "ħ",
	HumpDownHump: "≎",
	HumpEqual: "≏",
	hybull: "⁃",
	hyphen: "‐",
	Iacute: "Í",
	iacute: "í",
	ic: "⁣",
	Icirc: "Î",
	icirc: "î",
	Icy: "И",
	icy: "и",
	Idot: "İ",
	IEcy: "Е",
	iecy: "е",
	iexcl: "¡",
	iff: "⇔",
	ifr: "𝔦",
	Ifr: "ℑ",
	Igrave: "Ì",
	igrave: "ì",
	ii: "ⅈ",
	iiiint: "⨌",
	iiint: "∭",
	iinfin: "⧜",
	iiota: "℩",
	IJlig: "Ĳ",
	ijlig: "ĳ",
	Imacr: "Ī",
	imacr: "ī",
	image: "ℑ",
	ImaginaryI: "ⅈ",
	imagline: "ℐ",
	imagpart: "ℑ",
	imath: "ı",
	Im: "ℑ",
	imof: "⊷",
	imped: "Ƶ",
	Implies: "⇒",
	incare: "℅",
	in: "∈",
	infin: "∞",
	infintie: "⧝",
	inodot: "ı",
	intcal: "⊺",
	int: "∫",
	Int: "∬",
	integers: "ℤ",
	Integral: "∫",
	intercal: "⊺",
	Intersection: "⋂",
	intlarhk: "⨗",
	intprod: "⨼",
	InvisibleComma: "⁣",
	InvisibleTimes: "⁢",
	IOcy: "Ё",
	iocy: "ё",
	Iogon: "Į",
	iogon: "į",
	Iopf: "𝕀",
	iopf: "𝕚",
	Iota: "Ι",
	iota: "ι",
	iprod: "⨼",
	iquest: "¿",
	iscr: "𝒾",
	Iscr: "ℐ",
	isin: "∈",
	isindot: "⋵",
	isinE: "⋹",
	isins: "⋴",
	isinsv: "⋳",
	isinv: "∈",
	it: "⁢",
	Itilde: "Ĩ",
	itilde: "ĩ",
	Iukcy: "І",
	iukcy: "і",
	Iuml: "Ï",
	iuml: "ï",
	Jcirc: "Ĵ",
	jcirc: "ĵ",
	Jcy: "Й",
	jcy: "й",
	Jfr: "𝔍",
	jfr: "𝔧",
	jmath: "ȷ",
	Jopf: "𝕁",
	jopf: "𝕛",
	Jscr: "𝒥",
	jscr: "𝒿",
	Jsercy: "Ј",
	jsercy: "ј",
	Jukcy: "Є",
	jukcy: "є",
	Kappa: "Κ",
	kappa: "κ",
	kappav: "ϰ",
	Kcedil: "Ķ",
	kcedil: "ķ",
	Kcy: "К",
	kcy: "к",
	Kfr: "𝔎",
	kfr: "𝔨",
	kgreen: "ĸ",
	KHcy: "Х",
	khcy: "х",
	KJcy: "Ќ",
	kjcy: "ќ",
	Kopf: "𝕂",
	kopf: "𝕜",
	Kscr: "𝒦",
	kscr: "𝓀",
	lAarr: "⇚",
	Lacute: "Ĺ",
	lacute: "ĺ",
	laemptyv: "⦴",
	lagran: "ℒ",
	Lambda: "Λ",
	lambda: "λ",
	lang: "⟨",
	Lang: "⟪",
	langd: "⦑",
	langle: "⟨",
	lap: "⪅",
	Laplacetrf: "ℒ",
	laquo: "«",
	larrb: "⇤",
	larrbfs: "⤟",
	larr: "←",
	Larr: "↞",
	lArr: "⇐",
	larrfs: "⤝",
	larrhk: "↩",
	larrlp: "↫",
	larrpl: "⤹",
	larrsim: "⥳",
	larrtl: "↢",
	latail: "⤙",
	lAtail: "⤛",
	lat: "⪫",
	late: "⪭",
	lates: "⪭︀",
	lbarr: "⤌",
	lBarr: "⤎",
	lbbrk: "❲",
	lbrace: "{",
	lbrack: "[",
	lbrke: "⦋",
	lbrksld: "⦏",
	lbrkslu: "⦍",
	Lcaron: "Ľ",
	lcaron: "ľ",
	Lcedil: "Ļ",
	lcedil: "ļ",
	lceil: "⌈",
	lcub: "{",
	Lcy: "Л",
	lcy: "л",
	ldca: "⤶",
	ldquo: "“",
	ldquor: "„",
	ldrdhar: "⥧",
	ldrushar: "⥋",
	ldsh: "↲",
	le: "≤",
	lE: "≦",
	LeftAngleBracket: "⟨",
	LeftArrowBar: "⇤",
	leftarrow: "←",
	LeftArrow: "←",
	Leftarrow: "⇐",
	LeftArrowRightArrow: "⇆",
	leftarrowtail: "↢",
	LeftCeiling: "⌈",
	LeftDoubleBracket: "⟦",
	LeftDownTeeVector: "⥡",
	LeftDownVectorBar: "⥙",
	LeftDownVector: "⇃",
	LeftFloor: "⌊",
	leftharpoondown: "↽",
	leftharpoonup: "↼",
	leftleftarrows: "⇇",
	leftrightarrow: "↔",
	LeftRightArrow: "↔",
	Leftrightarrow: "⇔",
	leftrightarrows: "⇆",
	leftrightharpoons: "⇋",
	leftrightsquigarrow: "↭",
	LeftRightVector: "⥎",
	LeftTeeArrow: "↤",
	LeftTee: "⊣",
	LeftTeeVector: "⥚",
	leftthreetimes: "⋋",
	LeftTriangleBar: "⧏",
	LeftTriangle: "⊲",
	LeftTriangleEqual: "⊴",
	LeftUpDownVector: "⥑",
	LeftUpTeeVector: "⥠",
	LeftUpVectorBar: "⥘",
	LeftUpVector: "↿",
	LeftVectorBar: "⥒",
	LeftVector: "↼",
	lEg: "⪋",
	leg: "⋚",
	leq: "≤",
	leqq: "≦",
	leqslant: "⩽",
	lescc: "⪨",
	les: "⩽",
	lesdot: "⩿",
	lesdoto: "⪁",
	lesdotor: "⪃",
	lesg: "⋚︀",
	lesges: "⪓",
	lessapprox: "⪅",
	lessdot: "⋖",
	lesseqgtr: "⋚",
	lesseqqgtr: "⪋",
	LessEqualGreater: "⋚",
	LessFullEqual: "≦",
	LessGreater: "≶",
	lessgtr: "≶",
	LessLess: "⪡",
	lesssim: "≲",
	LessSlantEqual: "⩽",
	LessTilde: "≲",
	lfisht: "⥼",
	lfloor: "⌊",
	Lfr: "𝔏",
	lfr: "𝔩",
	lg: "≶",
	lgE: "⪑",
	lHar: "⥢",
	lhard: "↽",
	lharu: "↼",
	lharul: "⥪",
	lhblk: "▄",
	LJcy: "Љ",
	ljcy: "љ",
	llarr: "⇇",
	ll: "≪",
	Ll: "⋘",
	llcorner: "⌞",
	Lleftarrow: "⇚",
	llhard: "⥫",
	lltri: "◺",
	Lmidot: "Ŀ",
	lmidot: "ŀ",
	lmoustache: "⎰",
	lmoust: "⎰",
	lnap: "⪉",
	lnapprox: "⪉",
	lne: "⪇",
	lnE: "≨",
	lneq: "⪇",
	lneqq: "≨",
	lnsim: "⋦",
	loang: "⟬",
	loarr: "⇽",
	lobrk: "⟦",
	longleftarrow: "⟵",
	LongLeftArrow: "⟵",
	Longleftarrow: "⟸",
	longleftrightarrow: "⟷",
	LongLeftRightArrow: "⟷",
	Longleftrightarrow: "⟺",
	longmapsto: "⟼",
	longrightarrow: "⟶",
	LongRightArrow: "⟶",
	Longrightarrow: "⟹",
	looparrowleft: "↫",
	looparrowright: "↬",
	lopar: "⦅",
	Lopf: "𝕃",
	lopf: "𝕝",
	loplus: "⨭",
	lotimes: "⨴",
	lowast: "∗",
	lowbar: "_",
	LowerLeftArrow: "↙",
	LowerRightArrow: "↘",
	loz: "◊",
	lozenge: "◊",
	lozf: "⧫",
	lpar: "(",
	lparlt: "⦓",
	lrarr: "⇆",
	lrcorner: "⌟",
	lrhar: "⇋",
	lrhard: "⥭",
	lrm: "‎",
	lrtri: "⊿",
	lsaquo: "‹",
	lscr: "𝓁",
	Lscr: "ℒ",
	lsh: "↰",
	Lsh: "↰",
	lsim: "≲",
	lsime: "⪍",
	lsimg: "⪏",
	lsqb: "[",
	lsquo: "‘",
	lsquor: "‚",
	Lstrok: "Ł",
	lstrok: "ł",
	ltcc: "⪦",
	ltcir: "⩹",
	lt: "<",
	LT: "<",
	Lt: "≪",
	ltdot: "⋖",
	lthree: "⋋",
	ltimes: "⋉",
	ltlarr: "⥶",
	ltquest: "⩻",
	ltri: "◃",
	ltrie: "⊴",
	ltrif: "◂",
	ltrPar: "⦖",
	lurdshar: "⥊",
	luruhar: "⥦",
	lvertneqq: "≨︀",
	lvnE: "≨︀",
	macr: "¯",
	male: "♂",
	malt: "✠",
	maltese: "✠",
	Map: "⤅",
	map: "↦",
	mapsto: "↦",
	mapstodown: "↧",
	mapstoleft: "↤",
	mapstoup: "↥",
	marker: "▮",
	mcomma: "⨩",
	Mcy: "М",
	mcy: "м",
	mdash: "—",
	mDDot: "∺",
	measuredangle: "∡",
	MediumSpace: " ",
	Mellintrf: "ℳ",
	Mfr: "𝔐",
	mfr: "𝔪",
	mho: "℧",
	micro: "µ",
	midast: "*",
	midcir: "⫰",
	mid: "∣",
	middot: "·",
	minusb: "⊟",
	minus: "−",
	minusd: "∸",
	minusdu: "⨪",
	MinusPlus: "∓",
	mlcp: "⫛",
	mldr: "…",
	mnplus: "∓",
	models: "⊧",
	Mopf: "𝕄",
	mopf: "𝕞",
	mp: "∓",
	mscr: "𝓂",
	Mscr: "ℳ",
	mstpos: "∾",
	Mu: "Μ",
	mu: "μ",
	multimap: "⊸",
	mumap: "⊸",
	nabla: "∇",
	Nacute: "Ń",
	nacute: "ń",
	nang: "∠⃒",
	nap: "≉",
	napE: "⩰̸",
	napid: "≋̸",
	napos: "ŉ",
	napprox: "≉",
	natural: "♮",
	naturals: "ℕ",
	natur: "♮",
	nbsp: "\xA0",
	nbump: "≎̸",
	nbumpe: "≏̸",
	ncap: "⩃",
	Ncaron: "Ň",
	ncaron: "ň",
	Ncedil: "Ņ",
	ncedil: "ņ",
	ncong: "≇",
	ncongdot: "⩭̸",
	ncup: "⩂",
	Ncy: "Н",
	ncy: "н",
	ndash: "–",
	nearhk: "⤤",
	nearr: "↗",
	neArr: "⇗",
	nearrow: "↗",
	ne: "≠",
	nedot: "≐̸",
	NegativeMediumSpace: "​",
	NegativeThickSpace: "​",
	NegativeThinSpace: "​",
	NegativeVeryThinSpace: "​",
	nequiv: "≢",
	nesear: "⤨",
	nesim: "≂̸",
	NestedGreaterGreater: "≫",
	NestedLessLess: "≪",
	NewLine: "\n",
	nexist: "∄",
	nexists: "∄",
	Nfr: "𝔑",
	nfr: "𝔫",
	ngE: "≧̸",
	nge: "≱",
	ngeq: "≱",
	ngeqq: "≧̸",
	ngeqslant: "⩾̸",
	nges: "⩾̸",
	nGg: "⋙̸",
	ngsim: "≵",
	nGt: "≫⃒",
	ngt: "≯",
	ngtr: "≯",
	nGtv: "≫̸",
	nharr: "↮",
	nhArr: "⇎",
	nhpar: "⫲",
	ni: "∋",
	nis: "⋼",
	nisd: "⋺",
	niv: "∋",
	NJcy: "Њ",
	njcy: "њ",
	nlarr: "↚",
	nlArr: "⇍",
	nldr: "‥",
	nlE: "≦̸",
	nle: "≰",
	nleftarrow: "↚",
	nLeftarrow: "⇍",
	nleftrightarrow: "↮",
	nLeftrightarrow: "⇎",
	nleq: "≰",
	nleqq: "≦̸",
	nleqslant: "⩽̸",
	nles: "⩽̸",
	nless: "≮",
	nLl: "⋘̸",
	nlsim: "≴",
	nLt: "≪⃒",
	nlt: "≮",
	nltri: "⋪",
	nltrie: "⋬",
	nLtv: "≪̸",
	nmid: "∤",
	NoBreak: "⁠",
	NonBreakingSpace: "\xA0",
	nopf: "𝕟",
	Nopf: "ℕ",
	Not: "⫬",
	not: "¬",
	NotCongruent: "≢",
	NotCupCap: "≭",
	NotDoubleVerticalBar: "∦",
	NotElement: "∉",
	NotEqual: "≠",
	NotEqualTilde: "≂̸",
	NotExists: "∄",
	NotGreater: "≯",
	NotGreaterEqual: "≱",
	NotGreaterFullEqual: "≧̸",
	NotGreaterGreater: "≫̸",
	NotGreaterLess: "≹",
	NotGreaterSlantEqual: "⩾̸",
	NotGreaterTilde: "≵",
	NotHumpDownHump: "≎̸",
	NotHumpEqual: "≏̸",
	notin: "∉",
	notindot: "⋵̸",
	notinE: "⋹̸",
	notinva: "∉",
	notinvb: "⋷",
	notinvc: "⋶",
	NotLeftTriangleBar: "⧏̸",
	NotLeftTriangle: "⋪",
	NotLeftTriangleEqual: "⋬",
	NotLess: "≮",
	NotLessEqual: "≰",
	NotLessGreater: "≸",
	NotLessLess: "≪̸",
	NotLessSlantEqual: "⩽̸",
	NotLessTilde: "≴",
	NotNestedGreaterGreater: "⪢̸",
	NotNestedLessLess: "⪡̸",
	notni: "∌",
	notniva: "∌",
	notnivb: "⋾",
	notnivc: "⋽",
	NotPrecedes: "⊀",
	NotPrecedesEqual: "⪯̸",
	NotPrecedesSlantEqual: "⋠",
	NotReverseElement: "∌",
	NotRightTriangleBar: "⧐̸",
	NotRightTriangle: "⋫",
	NotRightTriangleEqual: "⋭",
	NotSquareSubset: "⊏̸",
	NotSquareSubsetEqual: "⋢",
	NotSquareSuperset: "⊐̸",
	NotSquareSupersetEqual: "⋣",
	NotSubset: "⊂⃒",
	NotSubsetEqual: "⊈",
	NotSucceeds: "⊁",
	NotSucceedsEqual: "⪰̸",
	NotSucceedsSlantEqual: "⋡",
	NotSucceedsTilde: "≿̸",
	NotSuperset: "⊃⃒",
	NotSupersetEqual: "⊉",
	NotTilde: "≁",
	NotTildeEqual: "≄",
	NotTildeFullEqual: "≇",
	NotTildeTilde: "≉",
	NotVerticalBar: "∤",
	nparallel: "∦",
	npar: "∦",
	nparsl: "⫽⃥",
	npart: "∂̸",
	npolint: "⨔",
	npr: "⊀",
	nprcue: "⋠",
	nprec: "⊀",
	npreceq: "⪯̸",
	npre: "⪯̸",
	nrarrc: "⤳̸",
	nrarr: "↛",
	nrArr: "⇏",
	nrarrw: "↝̸",
	nrightarrow: "↛",
	nRightarrow: "⇏",
	nrtri: "⋫",
	nrtrie: "⋭",
	nsc: "⊁",
	nsccue: "⋡",
	nsce: "⪰̸",
	Nscr: "𝒩",
	nscr: "𝓃",
	nshortmid: "∤",
	nshortparallel: "∦",
	nsim: "≁",
	nsime: "≄",
	nsimeq: "≄",
	nsmid: "∤",
	nspar: "∦",
	nsqsube: "⋢",
	nsqsupe: "⋣",
	nsub: "⊄",
	nsubE: "⫅̸",
	nsube: "⊈",
	nsubset: "⊂⃒",
	nsubseteq: "⊈",
	nsubseteqq: "⫅̸",
	nsucc: "⊁",
	nsucceq: "⪰̸",
	nsup: "⊅",
	nsupE: "⫆̸",
	nsupe: "⊉",
	nsupset: "⊃⃒",
	nsupseteq: "⊉",
	nsupseteqq: "⫆̸",
	ntgl: "≹",
	Ntilde: "Ñ",
	ntilde: "ñ",
	ntlg: "≸",
	ntriangleleft: "⋪",
	ntrianglelefteq: "⋬",
	ntriangleright: "⋫",
	ntrianglerighteq: "⋭",
	Nu: "Ν",
	nu: "ν",
	num: "#",
	numero: "№",
	numsp: " ",
	nvap: "≍⃒",
	nvdash: "⊬",
	nvDash: "⊭",
	nVdash: "⊮",
	nVDash: "⊯",
	nvge: "≥⃒",
	nvgt: ">⃒",
	nvHarr: "⤄",
	nvinfin: "⧞",
	nvlArr: "⤂",
	nvle: "≤⃒",
	nvlt: "<⃒",
	nvltrie: "⊴⃒",
	nvrArr: "⤃",
	nvrtrie: "⊵⃒",
	nvsim: "∼⃒",
	nwarhk: "⤣",
	nwarr: "↖",
	nwArr: "⇖",
	nwarrow: "↖",
	nwnear: "⤧",
	Oacute: "Ó",
	oacute: "ó",
	oast: "⊛",
	Ocirc: "Ô",
	ocirc: "ô",
	ocir: "⊚",
	Ocy: "О",
	ocy: "о",
	odash: "⊝",
	Odblac: "Ő",
	odblac: "ő",
	odiv: "⨸",
	odot: "⊙",
	odsold: "⦼",
	OElig: "Œ",
	oelig: "œ",
	ofcir: "⦿",
	Ofr: "𝔒",
	ofr: "𝔬",
	ogon: "˛",
	Ograve: "Ò",
	ograve: "ò",
	ogt: "⧁",
	ohbar: "⦵",
	ohm: "Ω",
	oint: "∮",
	olarr: "↺",
	olcir: "⦾",
	olcross: "⦻",
	oline: "‾",
	olt: "⧀",
	Omacr: "Ō",
	omacr: "ō",
	Omega: "Ω",
	omega: "ω",
	Omicron: "Ο",
	omicron: "ο",
	omid: "⦶",
	ominus: "⊖",
	Oopf: "𝕆",
	oopf: "𝕠",
	opar: "⦷",
	OpenCurlyDoubleQuote: "“",
	OpenCurlyQuote: "‘",
	operp: "⦹",
	oplus: "⊕",
	orarr: "↻",
	Or: "⩔",
	or: "∨",
	ord: "⩝",
	order: "ℴ",
	orderof: "ℴ",
	ordf: "ª",
	ordm: "º",
	origof: "⊶",
	oror: "⩖",
	orslope: "⩗",
	orv: "⩛",
	oS: "Ⓢ",
	Oscr: "𝒪",
	oscr: "ℴ",
	Oslash: "Ø",
	oslash: "ø",
	osol: "⊘",
	Otilde: "Õ",
	otilde: "õ",
	otimesas: "⨶",
	Otimes: "⨷",
	otimes: "⊗",
	Ouml: "Ö",
	ouml: "ö",
	ovbar: "⌽",
	OverBar: "‾",
	OverBrace: "⏞",
	OverBracket: "⎴",
	OverParenthesis: "⏜",
	para: "¶",
	parallel: "∥",
	par: "∥",
	parsim: "⫳",
	parsl: "⫽",
	part: "∂",
	PartialD: "∂",
	Pcy: "П",
	pcy: "п",
	percnt: "%",
	period: ".",
	permil: "‰",
	perp: "⊥",
	pertenk: "‱",
	Pfr: "𝔓",
	pfr: "𝔭",
	Phi: "Φ",
	phi: "φ",
	phiv: "ϕ",
	phmmat: "ℳ",
	phone: "☎",
	Pi: "Π",
	pi: "π",
	pitchfork: "⋔",
	piv: "ϖ",
	planck: "ℏ",
	planckh: "ℎ",
	plankv: "ℏ",
	plusacir: "⨣",
	plusb: "⊞",
	pluscir: "⨢",
	plus: "+",
	plusdo: "∔",
	plusdu: "⨥",
	pluse: "⩲",
	PlusMinus: "±",
	plusmn: "±",
	plussim: "⨦",
	plustwo: "⨧",
	pm: "±",
	Poincareplane: "ℌ",
	pointint: "⨕",
	popf: "𝕡",
	Popf: "ℙ",
	pound: "£",
	prap: "⪷",
	Pr: "⪻",
	pr: "≺",
	prcue: "≼",
	precapprox: "⪷",
	prec: "≺",
	preccurlyeq: "≼",
	Precedes: "≺",
	PrecedesEqual: "⪯",
	PrecedesSlantEqual: "≼",
	PrecedesTilde: "≾",
	preceq: "⪯",
	precnapprox: "⪹",
	precneqq: "⪵",
	precnsim: "⋨",
	pre: "⪯",
	prE: "⪳",
	precsim: "≾",
	prime: "′",
	Prime: "″",
	primes: "ℙ",
	prnap: "⪹",
	prnE: "⪵",
	prnsim: "⋨",
	prod: "∏",
	Product: "∏",
	profalar: "⌮",
	profline: "⌒",
	profsurf: "⌓",
	prop: "∝",
	Proportional: "∝",
	Proportion: "∷",
	propto: "∝",
	prsim: "≾",
	prurel: "⊰",
	Pscr: "𝒫",
	pscr: "𝓅",
	Psi: "Ψ",
	psi: "ψ",
	puncsp: " ",
	Qfr: "𝔔",
	qfr: "𝔮",
	qint: "⨌",
	qopf: "𝕢",
	Qopf: "ℚ",
	qprime: "⁗",
	Qscr: "𝒬",
	qscr: "𝓆",
	quaternions: "ℍ",
	quatint: "⨖",
	quest: "?",
	questeq: "≟",
	quot: "\"",
	QUOT: "\"",
	rAarr: "⇛",
	race: "∽̱",
	Racute: "Ŕ",
	racute: "ŕ",
	radic: "√",
	raemptyv: "⦳",
	rang: "⟩",
	Rang: "⟫",
	rangd: "⦒",
	range: "⦥",
	rangle: "⟩",
	raquo: "»",
	rarrap: "⥵",
	rarrb: "⇥",
	rarrbfs: "⤠",
	rarrc: "⤳",
	rarr: "→",
	Rarr: "↠",
	rArr: "⇒",
	rarrfs: "⤞",
	rarrhk: "↪",
	rarrlp: "↬",
	rarrpl: "⥅",
	rarrsim: "⥴",
	Rarrtl: "⤖",
	rarrtl: "↣",
	rarrw: "↝",
	ratail: "⤚",
	rAtail: "⤜",
	ratio: "∶",
	rationals: "ℚ",
	rbarr: "⤍",
	rBarr: "⤏",
	RBarr: "⤐",
	rbbrk: "❳",
	rbrace: "}",
	rbrack: "]",
	rbrke: "⦌",
	rbrksld: "⦎",
	rbrkslu: "⦐",
	Rcaron: "Ř",
	rcaron: "ř",
	Rcedil: "Ŗ",
	rcedil: "ŗ",
	rceil: "⌉",
	rcub: "}",
	Rcy: "Р",
	rcy: "р",
	rdca: "⤷",
	rdldhar: "⥩",
	rdquo: "”",
	rdquor: "”",
	rdsh: "↳",
	real: "ℜ",
	realine: "ℛ",
	realpart: "ℜ",
	reals: "ℝ",
	Re: "ℜ",
	rect: "▭",
	reg: "®",
	REG: "®",
	ReverseElement: "∋",
	ReverseEquilibrium: "⇋",
	ReverseUpEquilibrium: "⥯",
	rfisht: "⥽",
	rfloor: "⌋",
	rfr: "𝔯",
	Rfr: "ℜ",
	rHar: "⥤",
	rhard: "⇁",
	rharu: "⇀",
	rharul: "⥬",
	Rho: "Ρ",
	rho: "ρ",
	rhov: "ϱ",
	RightAngleBracket: "⟩",
	RightArrowBar: "⇥",
	rightarrow: "→",
	RightArrow: "→",
	Rightarrow: "⇒",
	RightArrowLeftArrow: "⇄",
	rightarrowtail: "↣",
	RightCeiling: "⌉",
	RightDoubleBracket: "⟧",
	RightDownTeeVector: "⥝",
	RightDownVectorBar: "⥕",
	RightDownVector: "⇂",
	RightFloor: "⌋",
	rightharpoondown: "⇁",
	rightharpoonup: "⇀",
	rightleftarrows: "⇄",
	rightleftharpoons: "⇌",
	rightrightarrows: "⇉",
	rightsquigarrow: "↝",
	RightTeeArrow: "↦",
	RightTee: "⊢",
	RightTeeVector: "⥛",
	rightthreetimes: "⋌",
	RightTriangleBar: "⧐",
	RightTriangle: "⊳",
	RightTriangleEqual: "⊵",
	RightUpDownVector: "⥏",
	RightUpTeeVector: "⥜",
	RightUpVectorBar: "⥔",
	RightUpVector: "↾",
	RightVectorBar: "⥓",
	RightVector: "⇀",
	ring: "˚",
	risingdotseq: "≓",
	rlarr: "⇄",
	rlhar: "⇌",
	rlm: "‏",
	rmoustache: "⎱",
	rmoust: "⎱",
	rnmid: "⫮",
	roang: "⟭",
	roarr: "⇾",
	robrk: "⟧",
	ropar: "⦆",
	ropf: "𝕣",
	Ropf: "ℝ",
	roplus: "⨮",
	rotimes: "⨵",
	RoundImplies: "⥰",
	rpar: ")",
	rpargt: "⦔",
	rppolint: "⨒",
	rrarr: "⇉",
	Rrightarrow: "⇛",
	rsaquo: "›",
	rscr: "𝓇",
	Rscr: "ℛ",
	rsh: "↱",
	Rsh: "↱",
	rsqb: "]",
	rsquo: "’",
	rsquor: "’",
	rthree: "⋌",
	rtimes: "⋊",
	rtri: "▹",
	rtrie: "⊵",
	rtrif: "▸",
	rtriltri: "⧎",
	RuleDelayed: "⧴",
	ruluhar: "⥨",
	rx: "℞",
	Sacute: "Ś",
	sacute: "ś",
	sbquo: "‚",
	scap: "⪸",
	Scaron: "Š",
	scaron: "š",
	Sc: "⪼",
	sc: "≻",
	sccue: "≽",
	sce: "⪰",
	scE: "⪴",
	Scedil: "Ş",
	scedil: "ş",
	Scirc: "Ŝ",
	scirc: "ŝ",
	scnap: "⪺",
	scnE: "⪶",
	scnsim: "⋩",
	scpolint: "⨓",
	scsim: "≿",
	Scy: "С",
	scy: "с",
	sdotb: "⊡",
	sdot: "⋅",
	sdote: "⩦",
	searhk: "⤥",
	searr: "↘",
	seArr: "⇘",
	searrow: "↘",
	sect: "§",
	semi: ";",
	seswar: "⤩",
	setminus: "∖",
	setmn: "∖",
	sext: "✶",
	Sfr: "𝔖",
	sfr: "𝔰",
	sfrown: "⌢",
	sharp: "♯",
	SHCHcy: "Щ",
	shchcy: "щ",
	SHcy: "Ш",
	shcy: "ш",
	ShortDownArrow: "↓",
	ShortLeftArrow: "←",
	shortmid: "∣",
	shortparallel: "∥",
	ShortRightArrow: "→",
	ShortUpArrow: "↑",
	shy: "­",
	Sigma: "Σ",
	sigma: "σ",
	sigmaf: "ς",
	sigmav: "ς",
	sim: "∼",
	simdot: "⩪",
	sime: "≃",
	simeq: "≃",
	simg: "⪞",
	simgE: "⪠",
	siml: "⪝",
	simlE: "⪟",
	simne: "≆",
	simplus: "⨤",
	simrarr: "⥲",
	slarr: "←",
	SmallCircle: "∘",
	smallsetminus: "∖",
	smashp: "⨳",
	smeparsl: "⧤",
	smid: "∣",
	smile: "⌣",
	smt: "⪪",
	smte: "⪬",
	smtes: "⪬︀",
	SOFTcy: "Ь",
	softcy: "ь",
	solbar: "⌿",
	solb: "⧄",
	sol: "/",
	Sopf: "𝕊",
	sopf: "𝕤",
	spades: "♠",
	spadesuit: "♠",
	spar: "∥",
	sqcap: "⊓",
	sqcaps: "⊓︀",
	sqcup: "⊔",
	sqcups: "⊔︀",
	Sqrt: "√",
	sqsub: "⊏",
	sqsube: "⊑",
	sqsubset: "⊏",
	sqsubseteq: "⊑",
	sqsup: "⊐",
	sqsupe: "⊒",
	sqsupset: "⊐",
	sqsupseteq: "⊒",
	square: "□",
	Square: "□",
	SquareIntersection: "⊓",
	SquareSubset: "⊏",
	SquareSubsetEqual: "⊑",
	SquareSuperset: "⊐",
	SquareSupersetEqual: "⊒",
	SquareUnion: "⊔",
	squarf: "▪",
	squ: "□",
	squf: "▪",
	srarr: "→",
	Sscr: "𝒮",
	sscr: "𝓈",
	ssetmn: "∖",
	ssmile: "⌣",
	sstarf: "⋆",
	Star: "⋆",
	star: "☆",
	starf: "★",
	straightepsilon: "ϵ",
	straightphi: "ϕ",
	strns: "¯",
	sub: "⊂",
	Sub: "⋐",
	subdot: "⪽",
	subE: "⫅",
	sube: "⊆",
	subedot: "⫃",
	submult: "⫁",
	subnE: "⫋",
	subne: "⊊",
	subplus: "⪿",
	subrarr: "⥹",
	subset: "⊂",
	Subset: "⋐",
	subseteq: "⊆",
	subseteqq: "⫅",
	SubsetEqual: "⊆",
	subsetneq: "⊊",
	subsetneqq: "⫋",
	subsim: "⫇",
	subsub: "⫕",
	subsup: "⫓",
	succapprox: "⪸",
	succ: "≻",
	succcurlyeq: "≽",
	Succeeds: "≻",
	SucceedsEqual: "⪰",
	SucceedsSlantEqual: "≽",
	SucceedsTilde: "≿",
	succeq: "⪰",
	succnapprox: "⪺",
	succneqq: "⪶",
	succnsim: "⋩",
	succsim: "≿",
	SuchThat: "∋",
	sum: "∑",
	Sum: "∑",
	sung: "♪",
	sup1: "¹",
	sup2: "²",
	sup3: "³",
	sup: "⊃",
	Sup: "⋑",
	supdot: "⪾",
	supdsub: "⫘",
	supE: "⫆",
	supe: "⊇",
	supedot: "⫄",
	Superset: "⊃",
	SupersetEqual: "⊇",
	suphsol: "⟉",
	suphsub: "⫗",
	suplarr: "⥻",
	supmult: "⫂",
	supnE: "⫌",
	supne: "⊋",
	supplus: "⫀",
	supset: "⊃",
	Supset: "⋑",
	supseteq: "⊇",
	supseteqq: "⫆",
	supsetneq: "⊋",
	supsetneqq: "⫌",
	supsim: "⫈",
	supsub: "⫔",
	supsup: "⫖",
	swarhk: "⤦",
	swarr: "↙",
	swArr: "⇙",
	swarrow: "↙",
	swnwar: "⤪",
	szlig: "ß",
	Tab: "	",
	target: "⌖",
	Tau: "Τ",
	tau: "τ",
	tbrk: "⎴",
	Tcaron: "Ť",
	tcaron: "ť",
	Tcedil: "Ţ",
	tcedil: "ţ",
	Tcy: "Т",
	tcy: "т",
	tdot: "⃛",
	telrec: "⌕",
	Tfr: "𝔗",
	tfr: "𝔱",
	there4: "∴",
	therefore: "∴",
	Therefore: "∴",
	Theta: "Θ",
	theta: "θ",
	thetasym: "ϑ",
	thetav: "ϑ",
	thickapprox: "≈",
	thicksim: "∼",
	ThickSpace: "  ",
	ThinSpace: " ",
	thinsp: " ",
	thkap: "≈",
	thksim: "∼",
	THORN: "Þ",
	thorn: "þ",
	tilde: "˜",
	Tilde: "∼",
	TildeEqual: "≃",
	TildeFullEqual: "≅",
	TildeTilde: "≈",
	timesbar: "⨱",
	timesb: "⊠",
	times: "×",
	timesd: "⨰",
	tint: "∭",
	toea: "⤨",
	topbot: "⌶",
	topcir: "⫱",
	top: "⊤",
	Topf: "𝕋",
	topf: "𝕥",
	topfork: "⫚",
	tosa: "⤩",
	tprime: "‴",
	trade: "™",
	TRADE: "™",
	triangle: "▵",
	triangledown: "▿",
	triangleleft: "◃",
	trianglelefteq: "⊴",
	triangleq: "≜",
	triangleright: "▹",
	trianglerighteq: "⊵",
	tridot: "◬",
	trie: "≜",
	triminus: "⨺",
	TripleDot: "⃛",
	triplus: "⨹",
	trisb: "⧍",
	tritime: "⨻",
	trpezium: "⏢",
	Tscr: "𝒯",
	tscr: "𝓉",
	TScy: "Ц",
	tscy: "ц",
	TSHcy: "Ћ",
	tshcy: "ћ",
	Tstrok: "Ŧ",
	tstrok: "ŧ",
	twixt: "≬",
	twoheadleftarrow: "↞",
	twoheadrightarrow: "↠",
	Uacute: "Ú",
	uacute: "ú",
	uarr: "↑",
	Uarr: "↟",
	uArr: "⇑",
	Uarrocir: "⥉",
	Ubrcy: "Ў",
	ubrcy: "ў",
	Ubreve: "Ŭ",
	ubreve: "ŭ",
	Ucirc: "Û",
	ucirc: "û",
	Ucy: "У",
	ucy: "у",
	udarr: "⇅",
	Udblac: "Ű",
	udblac: "ű",
	udhar: "⥮",
	ufisht: "⥾",
	Ufr: "𝔘",
	ufr: "𝔲",
	Ugrave: "Ù",
	ugrave: "ù",
	uHar: "⥣",
	uharl: "↿",
	uharr: "↾",
	uhblk: "▀",
	ulcorn: "⌜",
	ulcorner: "⌜",
	ulcrop: "⌏",
	ultri: "◸",
	Umacr: "Ū",
	umacr: "ū",
	uml: "¨",
	UnderBar: "_",
	UnderBrace: "⏟",
	UnderBracket: "⎵",
	UnderParenthesis: "⏝",
	Union: "⋃",
	UnionPlus: "⊎",
	Uogon: "Ų",
	uogon: "ų",
	Uopf: "𝕌",
	uopf: "𝕦",
	UpArrowBar: "⤒",
	uparrow: "↑",
	UpArrow: "↑",
	Uparrow: "⇑",
	UpArrowDownArrow: "⇅",
	updownarrow: "↕",
	UpDownArrow: "↕",
	Updownarrow: "⇕",
	UpEquilibrium: "⥮",
	upharpoonleft: "↿",
	upharpoonright: "↾",
	uplus: "⊎",
	UpperLeftArrow: "↖",
	UpperRightArrow: "↗",
	upsi: "υ",
	Upsi: "ϒ",
	upsih: "ϒ",
	Upsilon: "Υ",
	upsilon: "υ",
	UpTeeArrow: "↥",
	UpTee: "⊥",
	upuparrows: "⇈",
	urcorn: "⌝",
	urcorner: "⌝",
	urcrop: "⌎",
	Uring: "Ů",
	uring: "ů",
	urtri: "◹",
	Uscr: "𝒰",
	uscr: "𝓊",
	utdot: "⋰",
	Utilde: "Ũ",
	utilde: "ũ",
	utri: "▵",
	utrif: "▴",
	uuarr: "⇈",
	Uuml: "Ü",
	uuml: "ü",
	uwangle: "⦧",
	vangrt: "⦜",
	varepsilon: "ϵ",
	varkappa: "ϰ",
	varnothing: "∅",
	varphi: "ϕ",
	varpi: "ϖ",
	varpropto: "∝",
	varr: "↕",
	vArr: "⇕",
	varrho: "ϱ",
	varsigma: "ς",
	varsubsetneq: "⊊︀",
	varsubsetneqq: "⫋︀",
	varsupsetneq: "⊋︀",
	varsupsetneqq: "⫌︀",
	vartheta: "ϑ",
	vartriangleleft: "⊲",
	vartriangleright: "⊳",
	vBar: "⫨",
	Vbar: "⫫",
	vBarv: "⫩",
	Vcy: "В",
	vcy: "в",
	vdash: "⊢",
	vDash: "⊨",
	Vdash: "⊩",
	VDash: "⊫",
	Vdashl: "⫦",
	veebar: "⊻",
	vee: "∨",
	Vee: "⋁",
	veeeq: "≚",
	vellip: "⋮",
	verbar: "|",
	Verbar: "‖",
	vert: "|",
	Vert: "‖",
	VerticalBar: "∣",
	VerticalLine: "|",
	VerticalSeparator: "❘",
	VerticalTilde: "≀",
	VeryThinSpace: " ",
	Vfr: "𝔙",
	vfr: "𝔳",
	vltri: "⊲",
	vnsub: "⊂⃒",
	vnsup: "⊃⃒",
	Vopf: "𝕍",
	vopf: "𝕧",
	vprop: "∝",
	vrtri: "⊳",
	Vscr: "𝒱",
	vscr: "𝓋",
	vsubnE: "⫋︀",
	vsubne: "⊊︀",
	vsupnE: "⫌︀",
	vsupne: "⊋︀",
	Vvdash: "⊪",
	vzigzag: "⦚",
	Wcirc: "Ŵ",
	wcirc: "ŵ",
	wedbar: "⩟",
	wedge: "∧",
	Wedge: "⋀",
	wedgeq: "≙",
	weierp: "℘",
	Wfr: "𝔚",
	wfr: "𝔴",
	Wopf: "𝕎",
	wopf: "𝕨",
	wp: "℘",
	wr: "≀",
	wreath: "≀",
	Wscr: "𝒲",
	wscr: "𝓌",
	xcap: "⋂",
	xcirc: "◯",
	xcup: "⋃",
	xdtri: "▽",
	Xfr: "𝔛",
	xfr: "𝔵",
	xharr: "⟷",
	xhArr: "⟺",
	Xi: "Ξ",
	xi: "ξ",
	xlarr: "⟵",
	xlArr: "⟸",
	xmap: "⟼",
	xnis: "⋻",
	xodot: "⨀",
	Xopf: "𝕏",
	xopf: "𝕩",
	xoplus: "⨁",
	xotime: "⨂",
	xrarr: "⟶",
	xrArr: "⟹",
	Xscr: "𝒳",
	xscr: "𝓍",
	xsqcup: "⨆",
	xuplus: "⨄",
	xutri: "△",
	xvee: "⋁",
	xwedge: "⋀",
	Yacute: "Ý",
	yacute: "ý",
	YAcy: "Я",
	yacy: "я",
	Ycirc: "Ŷ",
	ycirc: "ŷ",
	Ycy: "Ы",
	ycy: "ы",
	yen: "¥",
	Yfr: "𝔜",
	yfr: "𝔶",
	YIcy: "Ї",
	yicy: "ї",
	Yopf: "𝕐",
	yopf: "𝕪",
	Yscr: "𝒴",
	yscr: "𝓎",
	YUcy: "Ю",
	yucy: "ю",
	yuml: "ÿ",
	Yuml: "Ÿ",
	Zacute: "Ź",
	zacute: "ź",
	Zcaron: "Ž",
	zcaron: "ž",
	Zcy: "З",
	zcy: "з",
	Zdot: "Ż",
	zdot: "ż",
	zeetrf: "ℨ",
	ZeroWidthSpace: "​",
	Zeta: "Ζ",
	zeta: "ζ",
	zfr: "𝔷",
	Zfr: "ℨ",
	ZHcy: "Ж",
	zhcy: "ж",
	zigrarr: "⇝",
	zopf: "𝕫",
	Zopf: "ℤ",
	Zscr: "𝒵",
	zscr: "𝓏",
	zwj: "‍",
	zwnj: "‌"
}, dh = {
	Aacute: "Á",
	aacute: "á",
	Acirc: "Â",
	acirc: "â",
	acute: "´",
	AElig: "Æ",
	aelig: "æ",
	Agrave: "À",
	agrave: "à",
	amp: "&",
	AMP: "&",
	Aring: "Å",
	aring: "å",
	Atilde: "Ã",
	atilde: "ã",
	Auml: "Ä",
	auml: "ä",
	brvbar: "¦",
	Ccedil: "Ç",
	ccedil: "ç",
	cedil: "¸",
	cent: "¢",
	copy: "©",
	COPY: "©",
	curren: "¤",
	deg: "°",
	divide: "÷",
	Eacute: "É",
	eacute: "é",
	Ecirc: "Ê",
	ecirc: "ê",
	Egrave: "È",
	egrave: "è",
	ETH: "Ð",
	eth: "ð",
	Euml: "Ë",
	euml: "ë",
	frac12: "½",
	frac14: "¼",
	frac34: "¾",
	gt: ">",
	GT: ">",
	Iacute: "Í",
	iacute: "í",
	Icirc: "Î",
	icirc: "î",
	iexcl: "¡",
	Igrave: "Ì",
	igrave: "ì",
	iquest: "¿",
	Iuml: "Ï",
	iuml: "ï",
	laquo: "«",
	lt: "<",
	LT: "<",
	macr: "¯",
	micro: "µ",
	middot: "·",
	nbsp: "\xA0",
	not: "¬",
	Ntilde: "Ñ",
	ntilde: "ñ",
	Oacute: "Ó",
	oacute: "ó",
	Ocirc: "Ô",
	ocirc: "ô",
	Ograve: "Ò",
	ograve: "ò",
	ordf: "ª",
	ordm: "º",
	Oslash: "Ø",
	oslash: "ø",
	Otilde: "Õ",
	otilde: "õ",
	Ouml: "Ö",
	ouml: "ö",
	para: "¶",
	plusmn: "±",
	pound: "£",
	quot: "\"",
	QUOT: "\"",
	raquo: "»",
	reg: "®",
	REG: "®",
	sect: "§",
	shy: "­",
	sup1: "¹",
	sup2: "²",
	sup3: "³",
	szlig: "ß",
	THORN: "Þ",
	thorn: "þ",
	times: "×",
	Uacute: "Ú",
	uacute: "ú",
	Ucirc: "Û",
	ucirc: "û",
	Ugrave: "Ù",
	ugrave: "ù",
	uml: "¨",
	Uuml: "Ü",
	uuml: "ü",
	Yacute: "Ý",
	yacute: "ý",
	yen: "¥",
	yuml: "ÿ"
}, fh = {
	amp: "&",
	apos: "'",
	gt: ">",
	lt: "<",
	quot: "\""
}, ph = {}, mh = {
	0: 65533,
	128: 8364,
	130: 8218,
	131: 402,
	132: 8222,
	133: 8230,
	134: 8224,
	135: 8225,
	136: 710,
	137: 8240,
	138: 352,
	139: 8249,
	140: 338,
	142: 381,
	145: 8216,
	146: 8217,
	147: 8220,
	148: 8221,
	149: 8226,
	150: 8211,
	151: 8212,
	152: 732,
	153: 8482,
	154: 353,
	155: 8250,
	156: 339,
	158: 382,
	159: 376
}, hh = rh && rh.__importDefault || function(e) {
	return e && e.__esModule ? e : { default: e };
};
Object.defineProperty(ph, "__esModule", { value: !0 });
var gh = hh(mh), _h = String.fromCodePoint || function(e) {
	var t = "";
	return e > 65535 && (e -= 65536, t += String.fromCharCode(e >>> 10 & 1023 | 55296), e = 56320 | e & 1023), t += String.fromCharCode(e), t;
};
function vh(e) {
	return e >= 55296 && e <= 57343 || e > 1114111 ? "�" : (e in gh.default && (e = gh.default[e]), _h(e));
}
ph.default = vh;
var yh = rh && rh.__importDefault || function(e) {
	return e && e.__esModule ? e : { default: e };
};
Object.defineProperty(lh, "__esModule", { value: !0 }), lh.decodeHTML = lh.decodeHTMLStrict = lh.decodeXML = void 0;
var bh = yh(uh), xh = yh(dh), Sh = yh(fh), Ch = yh(ph), wh = /&(?:[a-zA-Z0-9]+|#[xX][\da-fA-F]+|#\d+);/g;
lh.decodeXML = Th(Sh.default), lh.decodeHTMLStrict = Th(bh.default);
function Th(e) {
	var t = Dh(e);
	return function(e) {
		return String(e).replace(wh, t);
	};
}
var Eh = function(e, t) {
	return e < t ? 1 : -1;
};
lh.decodeHTML = (function() {
	for (var e = Object.keys(xh.default).sort(Eh), t = Object.keys(bh.default).sort(Eh), n = 0, r = 0; n < t.length; n++) e[r] === t[n] ? (t[n] += ";?", r++) : t[n] += ";";
	var i = RegExp("&(?:" + t.join("|") + "|#[xX][\\da-fA-F]+;?|#\\d+;?)", "g"), a = Dh(bh.default);
	function o(e) {
		return e.substr(-1) !== ";" && (e += ";"), a(e);
	}
	return function(e) {
		return String(e).replace(i, o);
	};
})();
function Dh(e) {
	return function(t) {
		if (t.charAt(1) === "#") {
			var n = t.charAt(2);
			return n === "X" || n === "x" ? Ch.default(parseInt(t.substr(3), 16)) : Ch.default(parseInt(t.substr(2), 10));
		}
		return e[t.slice(1, -1)] || t;
	};
}
var Oh = {}, kh = rh && rh.__importDefault || function(e) {
	return e && e.__esModule ? e : { default: e };
};
Object.defineProperty(Oh, "__esModule", { value: !0 }), Oh.escapeUTF8 = Oh.escape = Oh.encodeNonAsciiHTML = Oh.encodeHTML = Oh.encodeXML = void 0;
var Ah = Nh(kh(fh).default), jh = Ph(Ah);
Oh.encodeXML = Hh(Ah);
var Mh = Nh(kh(uh).default);
Oh.encodeHTML = Rh(Mh, Ph(Mh)), Oh.encodeNonAsciiHTML = Hh(Mh);
function Nh(e) {
	return Object.keys(e).sort().reduce(function(t, n) {
		return t[e[n]] = "&" + n + ";", t;
	}, {});
}
function Ph(e) {
	for (var t = [], n = [], r = 0, i = Object.keys(e); r < i.length; r++) {
		var a = i[r];
		a.length === 1 ? t.push("\\" + a) : n.push(a);
	}
	t.sort();
	for (var o = 0; o < t.length - 1; o++) {
		for (var s = o; s < t.length - 1 && t[s].charCodeAt(1) + 1 === t[s + 1].charCodeAt(1);) s += 1;
		var c = 1 + s - o;
		c < 3 || t.splice(o, c, t[o] + "-" + t[s]);
	}
	return n.unshift("[" + t.join("") + "]"), new RegExp(n.join("|"), "g");
}
var Fh = /(?:[\x80-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])/g, Ih = String.prototype.codePointAt == null ? function(e) {
	return (e.charCodeAt(0) - 55296) * 1024 + e.charCodeAt(1) - 56320 + 65536;
} : function(e) {
	return e.codePointAt(0);
};
function Lh(e) {
	return "&#x" + (e.length > 1 ? Ih(e) : e.charCodeAt(0)).toString(16).toUpperCase() + ";";
}
function Rh(e, t) {
	return function(n) {
		return n.replace(t, function(t) {
			return e[t];
		}).replace(Fh, Lh);
	};
}
var zh = RegExp(jh.source + "|" + Fh.source, "g");
function Bh(e) {
	return e.replace(zh, Lh);
}
Oh.escape = Bh;
function Vh(e) {
	return e.replace(jh, Lh);
}
Oh.escapeUTF8 = Vh;
function Hh(e) {
	return function(t) {
		return t.replace(zh, function(t) {
			return e[t] || Lh(t);
		});
	};
}
(function(e) {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.decodeXMLStrict = e.decodeHTML5Strict = e.decodeHTML4Strict = e.decodeHTML5 = e.decodeHTML4 = e.decodeHTMLStrict = e.decodeHTML = e.decodeXML = e.encodeHTML5 = e.encodeHTML4 = e.escapeUTF8 = e.escape = e.encodeNonAsciiHTML = e.encodeHTML = e.encodeXML = e.encode = e.decodeStrict = e.decode = void 0;
	var t = lh, n = Oh;
	function r(e, n) {
		return (!n || n <= 0 ? t.decodeXML : t.decodeHTML)(e);
	}
	e.decode = r;
	function i(e, n) {
		return (!n || n <= 0 ? t.decodeXML : t.decodeHTMLStrict)(e);
	}
	e.decodeStrict = i;
	function a(e, t) {
		return (!t || t <= 0 ? n.encodeXML : n.encodeHTML)(e);
	}
	e.encode = a;
	var o = Oh;
	Object.defineProperty(e, "encodeXML", {
		enumerable: !0,
		get: function() {
			return o.encodeXML;
		}
	}), Object.defineProperty(e, "encodeHTML", {
		enumerable: !0,
		get: function() {
			return o.encodeHTML;
		}
	}), Object.defineProperty(e, "encodeNonAsciiHTML", {
		enumerable: !0,
		get: function() {
			return o.encodeNonAsciiHTML;
		}
	}), Object.defineProperty(e, "escape", {
		enumerable: !0,
		get: function() {
			return o.escape;
		}
	}), Object.defineProperty(e, "escapeUTF8", {
		enumerable: !0,
		get: function() {
			return o.escapeUTF8;
		}
	}), Object.defineProperty(e, "encodeHTML4", {
		enumerable: !0,
		get: function() {
			return o.encodeHTML;
		}
	}), Object.defineProperty(e, "encodeHTML5", {
		enumerable: !0,
		get: function() {
			return o.encodeHTML;
		}
	});
	var s = lh;
	Object.defineProperty(e, "decodeXML", {
		enumerable: !0,
		get: function() {
			return s.decodeXML;
		}
	}), Object.defineProperty(e, "decodeHTML", {
		enumerable: !0,
		get: function() {
			return s.decodeHTML;
		}
	}), Object.defineProperty(e, "decodeHTMLStrict", {
		enumerable: !0,
		get: function() {
			return s.decodeHTMLStrict;
		}
	}), Object.defineProperty(e, "decodeHTML4", {
		enumerable: !0,
		get: function() {
			return s.decodeHTML;
		}
	}), Object.defineProperty(e, "decodeHTML5", {
		enumerable: !0,
		get: function() {
			return s.decodeHTML;
		}
	}), Object.defineProperty(e, "decodeHTML4Strict", {
		enumerable: !0,
		get: function() {
			return s.decodeHTMLStrict;
		}
	}), Object.defineProperty(e, "decodeHTML5Strict", {
		enumerable: !0,
		get: function() {
			return s.decodeHTMLStrict;
		}
	}), Object.defineProperty(e, "decodeXMLStrict", {
		enumerable: !0,
		get: function() {
			return s.decodeXML;
		}
	});
})(ch);
var Uh = "&(?:#x[a-f0-9]{1,6}|#[0-9]{1,7}|[a-z][a-z0-9]{1,31});", Wh = 92, Gh = /[\\&]/, Kh = "[!\"#$%&'()*+,./:;<=>?@[\\\\\\]^_`{|}~-]", qh = RegExp(`\\\\${Kh}|${Uh}`, "gi"), Jh = /* @__PURE__ */ RegExp("[&<>\"]", "g"), Yh = function(e) {
	return e.charCodeAt(0) === Wh ? e.charAt(1) : ch.decodeHTML(e);
};
function Xh(e) {
	return Gh.test(e) ? e.replace(qh, Yh) : e;
}
function Zh(e) {
	try {
		return sh(e);
	} catch (t) {
		return e;
	}
}
function Qh(e) {
	switch (e) {
		case "&": return "&amp;";
		case "<": return "&lt;";
		case ">": return "&gt;";
		case "\"": return "&quot;";
		default: return e;
	}
}
function $h(e) {
	return Jh.test(e) ? e.replace(Jh, Qh) : e;
}
function eg(e, t) {
	for (var n = [], r = 0; r < t; r++) n.push(e);
	return n.join("");
}
function tg(e) {
	return !e || !/[^ \t]+/.test(e);
}
var ng = function() {
	function e(e) {
		this.current = e, this.root = e, this.entering = !0;
	}
	return e.prototype.next = function() {
		var e = this.current, t = this.entering;
		if (e === null) return null;
		var n = rg(e);
		return t && n ? e.firstChild ? (this.current = e.firstChild, this.entering = !0) : this.entering = !1 : e === this.root ? this.current = null : e.next === null ? (this.current = e.parent, this.entering = !1) : (this.current = e.next, this.entering = !0), {
			entering: t,
			node: e
		};
	}, e.prototype.resumeAt = function(e, t) {
		this.current = e, this.entering = t === !0;
	}, e;
}();
function rg(e) {
	switch (e.type) {
		case "document":
		case "blockQuote":
		case "list":
		case "item":
		case "paragraph":
		case "heading":
		case "emph":
		case "strong":
		case "strike":
		case "link":
		case "image":
		case "table":
		case "tableHead":
		case "tableBody":
		case "tableRow":
		case "tableCell":
		case "tableDelimRow":
		case "customInline": return !0;
		default: return !1;
	}
}
var ig = 1, ag = {};
function og(e) {
	return ag[e];
}
function sg(e) {
	delete ag[e];
}
function cg() {
	ag = {};
}
var lg = function() {
	function e(e, t) {
		this.parent = null, this.prev = null, this.next = null, this.firstChild = null, this.lastChild = null, this.literal = null, this.id = e === "document" ? -1 : ig++, this.type = e, this.sourcepos = t, ag[this.id] = this;
	}
	return e.prototype.isContainer = function() {
		return rg(this);
	}, e.prototype.unlink = function() {
		this.prev ? this.prev.next = this.next : this.parent && (this.parent.firstChild = this.next), this.next ? this.next.prev = this.prev : this.parent && (this.parent.lastChild = this.prev), this.parent = null, this.next = null, this.prev = null;
	}, e.prototype.replaceWith = function(e) {
		this.insertBefore(e), this.unlink();
	}, e.prototype.insertAfter = function(e) {
		e.unlink(), e.next = this.next, e.next && (e.next.prev = e), e.prev = this, this.next = e, this.parent && (e.parent = this.parent, e.next || (e.parent.lastChild = e));
	}, e.prototype.insertBefore = function(e) {
		e.unlink(), e.prev = this.prev, e.prev && (e.prev.next = e), e.next = this, this.prev = e, e.parent = this.parent, e.prev || (e.parent.firstChild = e);
	}, e.prototype.appendChild = function(e) {
		e.unlink(), e.parent = this, this.lastChild ? (this.lastChild.next = e, e.prev = this.lastChild, this.lastChild = e) : (this.firstChild = e, this.lastChild = e);
	}, e.prototype.prependChild = function(e) {
		e.unlink(), e.parent = this, this.firstChild ? (this.firstChild.prev = e, e.next = this.firstChild, this.firstChild = e) : (this.firstChild = e, this.lastChild = e);
	}, e.prototype.walker = function() {
		return new ng(this);
	}, e;
}(), ug = function(e) {
	eh(t, e);
	function t(t, n) {
		var r = e.call(this, t, n) || this;
		return r.open = !0, r.lineOffsets = null, r.stringContent = null, r.lastLineBlank = !1, r.lastLineChecked = !1, r.type = t, r;
	}
	return t;
}(lg), dg = function(e) {
	eh(t, e);
	function t() {
		var t = e !== null && e.apply(this, arguments) || this;
		return t.listData = null, t;
	}
	return t;
}(ug), fg = function(e) {
	eh(t, e);
	function t() {
		var t = e !== null && e.apply(this, arguments) || this;
		return t.level = 0, t.headingType = "atx", t;
	}
	return t;
}(ug), pg = function(e) {
	eh(t, e);
	function t() {
		var t = e !== null && e.apply(this, arguments) || this;
		return t.isFenced = !1, t.fenceChar = null, t.fenceLength = 0, t.fenceOffset = -1, t.info = null, t.infoPadding = 0, t;
	}
	return t;
}(ug), mg = function(e) {
	eh(t, e);
	function t() {
		var t = e !== null && e.apply(this, arguments) || this;
		return t.columns = [], t;
	}
	return t;
}(ug), hg = function(e) {
	eh(t, e);
	function t() {
		var t = e !== null && e.apply(this, arguments) || this;
		return t.startIdx = 0, t.endIdx = 0, t.paddingLeft = 0, t.paddingRight = 0, t.ignored = !1, t;
	}
	return t;
}(ug), gg = function(e) {
	eh(t, e);
	function t() {
		var t = e !== null && e.apply(this, arguments) || this;
		return t.title = "", t.dest = "", t.label = "", t;
	}
	return t;
}(ug), _g = function(e) {
	eh(t, e);
	function t() {
		var t = e !== null && e.apply(this, arguments) || this;
		return t.syntaxLength = 0, t.offset = -1, t.info = "", t;
	}
	return t;
}(ug), vg = function(e) {
	eh(t, e);
	function t() {
		var t = e !== null && e.apply(this, arguments) || this;
		return t.htmlBlockType = -1, t;
	}
	return t;
}(ug), yg = function(e) {
	eh(t, e);
	function t() {
		var t = e !== null && e.apply(this, arguments) || this;
		return t.destination = null, t.title = null, t.extendedAutolink = !1, t;
	}
	return t;
}(lg), bg = function(e) {
	eh(t, e);
	function t() {
		var t = e !== null && e.apply(this, arguments) || this;
		return t.tickCount = 0, t;
	}
	return t;
}(lg), xg = function(e) {
	eh(t, e);
	function t() {
		var t = e !== null && e.apply(this, arguments) || this;
		return t.info = "", t;
	}
	return t;
}(lg);
function q(e, t) {
	switch (e) {
		case "heading": return new fg(e, t);
		case "list":
		case "item": return new dg(e, t);
		case "link":
		case "image": return new yg(e, t);
		case "codeBlock": return new pg(e, t);
		case "htmlBlock": return new vg(e, t);
		case "table": return new mg(e, t);
		case "tableCell": return new hg(e, t);
		case "document":
		case "paragraph":
		case "blockQuote":
		case "thematicBreak":
		case "tableRow":
		case "tableBody":
		case "tableHead":
		case "frontMatter": return new ug(e, t);
		case "code": return new bg(e, t);
		case "refDef": return new gg(e, t);
		case "customBlock": return new _g(e, t);
		case "customInline": return new xg(e, t);
		default: return new lg(e, t);
	}
}
function Sg(e) {
	return e.type === "codeBlock";
}
function Cg(e) {
	return e.type === "htmlBlock";
}
function wg(e) {
	return e.type === "heading";
}
function Tg(e) {
	return e.type === "list";
}
function Eg(e) {
	return e.type === "table";
}
function Dg(e) {
	return e.type === "refDef";
}
function Og(e) {
	return e.type === "customBlock";
}
function kg(e) {
	return e.type === "customInline";
}
function J(e, t) {
	var n = q("text", t);
	return n.literal = e, n;
}
var Ag = "[A-Za-z][A-Za-z0-9-]*", jg = `<${Ag}(?:\\s+[a-zA-Z_:][a-zA-Z0-9:._-]*(?:\\s*=\\s*(?:[^"'=<>\`\\x00-\\x20]+|'[^']*'|"[^"]*"))?)*\\s*/?>`, Mg = `</${Ag}\\s*[>]`, Ng = `(?:${jg}|${Mg}|<!---->|<!--(?:-?[^>-])(?:-?[^-])*-->|[<][?].*?[?][>]|<![A-Z]+\\s+[^>]*>|<!\\[CDATA\\[[\\s\\S]*?\\]\\]>)`, Pg = RegExp(`^${Ng}`, "i"), Fg;
if (String.fromCodePoint) Fg = function(e) {
	try {
		return String.fromCodePoint(e);
	} catch (e) {
		if (e instanceof RangeError) return "�";
		throw e;
	}
};
else {
	var Ig = String.fromCharCode, Lg = Math.floor;
	Fg = function() {
		var e = [...arguments], t = 16384, n = [], r, i, a = -1, o = e.length;
		if (!o) return "";
		for (var s = ""; ++a < o;) {
			var c = Number(e[a]);
			if (!isFinite(c) || c < 0 || c > 1114111 || Lg(c) !== c) return "�";
			c <= 65535 ? n.push(c) : (c -= 65536, r = (c >> 10) + 55296, i = c % 1024 + 56320, n.push(r, i)), (a + 1 === o || n.length > t) && (s += Ig.apply(void 0, n), n.length = 0);
		}
		return s;
	};
}
var Rg = Fg, zg = "(?:[w-]+.)*[A-Za-z0-9-]+.[A-Za-z0-9-]+", Bg = "[^<\\s]*[^<?!.,:*_?~\\s]", Vg = "[\\w.+-]+@(?:[\\w-]+\\.)+[\\w-]+";
function Hg(e) {
	var t = /\)+$/.exec(e);
	if (t) {
		for (var n = 0, r = 0, i = e; r < i.length; r++) {
			var a = i[r];
			a === "(" ? n < 0 ? n = 1 : n += 1 : a === ")" && --n;
		}
		if (n < 0) {
			var o = Math.min(-n, t[0].length);
			return e.substring(0, e.length - o);
		}
	}
	return e;
}
function Ug(e) {
	return e.replace(/&[A-Za-z0-9]+;$/, "");
}
function Wg(e) {
	for (var t = new RegExp(Vg, "g"), n = [], r; r = t.exec(e);) {
		var i = r[0];
		/[_-]+$/.test(i) || n.push({
			text: i,
			range: [r.index, r.index + i.length - 1],
			url: `mailto:${i}`
		});
	}
	return n;
}
function Gg(e) {
	for (var t = RegExp(`(www|https?://).${zg}${Bg}`, "g"), n = [], r; r = t.exec(e);) {
		var i = Ug(Hg(r[0])), a = r[1] === "www" ? "http://" : "";
		n.push({
			text: i,
			range: [r.index, r.index + i.length - 1],
			url: `${a}${i}`
		});
	}
	return n;
}
function Kg(e) {
	return nh(nh([], Gg(e), !0), Wg(e), !0).sort(function(e, t) {
		return e.range[0] - t.range[0];
	});
}
function qg(e, t) {
	typeof t == "boolean" && (t = Kg);
	for (var n, r = function() {
		var e = n.entering, r = n.node;
		if (e && r.type === "text" && r.parent.type !== "link") {
			var i = r.literal, a = t(i);
			if (!a || !a.length) return "continue";
			for (var o = 0, s = r.sourcepos[0], c = s[0], l = s[1], u = function(e, t) {
				return [[c, l + e], [c, l + t]];
			}, d = [], f = 0, p = a; f < p.length; f++) {
				var m = p[f], h = m.range, g = m.url, _ = m.text;
				h[0] > o && d.push(J(i.substring(o, h[0]), u(o, h[0] - 1)));
				var v = q("link", u.apply(void 0, h));
				v.appendChild(J(_, u.apply(void 0, h))), v.destination = g, v.extendedAutolink = !0, d.push(v), o = h[1] + 1;
			}
			o < i.length && d.push(J(i.substring(o), u(o, i.length - 1)));
			for (var y = 0, b = d; y < b.length; y++) {
				var x = b[y];
				r.insertBefore(x);
			}
			r.unlink();
		}
	}; n = e.next();) r();
}
function Jg(e) {
	return e[e.length - 1];
}
function Yg(e) {
	return e.slice(1, e.length - 1).trim().replace(/[ \t\r\n]+/, " ").toLowerCase().toUpperCase();
}
function Xg(e, t) {
	Object.keys(e).forEach(function(n) {
		t(n, e[n]);
	});
}
function Zg(e) {
	var t = [...arguments].slice(1), n = th({}, e);
	return t.forEach(function(e) {
		delete n[e];
	}), n;
}
function Qg(e) {
	return !Object.keys(e).length;
}
function $g(e) {
	Object.keys(e).forEach(function(t) {
		delete e[t];
	});
}
var e_ = 10, t_ = 42, n_ = 95, r_ = 96, i_ = 91, a_ = 93, o_ = 126, s_ = 60, c_ = 33, l_ = 92, u_ = 38, d_ = 40, f_ = 41, p_ = 58, m_ = 39, h_ = 34, g_ = 36, __ = `\\\\${Kh}`, v_ = /* @__PURE__ */ new RegExp(/[!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~\xA1\xA7\xAB\xB6\xB7\xBB\xBF\u037E\u0387\u055A-\u055F\u0589\u058A\u05BE\u05C0\u05C3\u05C6\u05F3\u05F4\u0609\u060A\u060C\u060D\u061B\u061E\u061F\u066A-\u066D\u06D4\u0700-\u070D\u07F7-\u07F9\u0830-\u083E\u085E\u0964\u0965\u0970\u0AF0\u0DF4\u0E4F\u0E5A\u0E5B\u0F04-\u0F12\u0F14\u0F3A-\u0F3D\u0F85\u0FD0-\u0FD4\u0FD9\u0FDA\u104A-\u104F\u10FB\u1360-\u1368\u1400\u166D\u166E\u169B\u169C\u16EB-\u16ED\u1735\u1736\u17D4-\u17D6\u17D8-\u17DA\u1800-\u180A\u1944\u1945\u1A1E\u1A1F\u1AA0-\u1AA6\u1AA8-\u1AAD\u1B5A-\u1B60\u1BFC-\u1BFF\u1C3B-\u1C3F\u1C7E\u1C7F\u1CC0-\u1CC7\u1CD3\u2010-\u2027\u2030-\u2043\u2045-\u2051\u2053-\u205E\u207D\u207E\u208D\u208E\u2308-\u230B\u2329\u232A\u2768-\u2775\u27C5\u27C6\u27E6-\u27EF\u2983-\u2998\u29D8-\u29DB\u29FC\u29FD\u2CF9-\u2CFC\u2CFE\u2CFF\u2D70\u2E00-\u2E2E\u2E30-\u2E42\u3001-\u3003\u3008-\u3011\u3014-\u301F\u3030\u303D\u30A0\u30FB\uA4FE\uA4FF\uA60D-\uA60F\uA673\uA67E\uA6F2-\uA6F7\uA874-\uA877\uA8CE\uA8CF\uA8F8-\uA8FA\uA8FC\uA92E\uA92F\uA95F\uA9C1-\uA9CD\uA9DE\uA9DF\uAA5C-\uAA5F\uAADE\uAADF\uAAF0\uAAF1\uABEB\uFD3E\uFD3F\uFE10-\uFE19\uFE30-\uFE52\uFE54-\uFE61\uFE63\uFE68\uFE6A\uFE6B\uFF01-\uFF03\uFF05-\uFF0A\uFF0C-\uFF0F\uFF1A\uFF1B\uFF1F\uFF20\uFF3B-\uFF3D\uFF3F\uFF5B\uFF5D\uFF5F-\uFF65]|\uD800[\uDD00-\uDD02\uDF9F\uDFD0]|\uD801\uDD6F|\uD802[\uDC57\uDD1F\uDD3F\uDE50-\uDE58\uDE7F\uDEF0-\uDEF6\uDF39-\uDF3F\uDF99-\uDF9C]|\uD804[\uDC47-\uDC4D\uDCBB\uDCBC\uDCBE-\uDCC1\uDD40-\uDD43\uDD74\uDD75\uDDC5-\uDDC9\uDDCD\uDDDB\uDDDD-\uDDDF\uDE38-\uDE3D\uDEA9]|\uD805[\uDCC6\uDDC1-\uDDD7\uDE41-\uDE43\uDF3C-\uDF3E]|\uD809[\uDC70-\uDC74]|\uD81A[\uDE6E\uDE6F\uDEF5\uDF37-\uDF3B\uDF44]|\uD82F\uDC9F|\uD836[\uDE87-\uDE8B]/), y_ = RegExp(`^(?:"(${__}|[^"\\x00])*"|'(${__}|[^'\\x00])*'|\\((${__}|[^()\\x00])*\\))`), b_ = /^(?:<(?:[^<>\n\\\x00]|\\.)*>)/, x_ = RegExp(`^${Kh}`), S_ = RegExp(`^${Uh}`, "i"), C_ = /`+/, w_ = /^`+/, T_ = /\.\.\./g, E_ = /--+/g, D_ = /^<([a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*)>/, O_ = /^<[A-Za-z][A-Za-z0-9.+-]{1,31}:[^<>\x00-\x20]*>/i, k_ = /^ *(?:\n *)?/, A_ = /^[ \t\n\x0b\x0c\x0d]/, j_ = /^\s/, M_ = / *$/, N_ = /^ */, P_ = /^ *(?:\n|$)/, F_ = /^\[(?:[^\\\[\]]|\\.){0,1000}\]/, I_ = /^[^\n`\[\]\\!<&*_'"~$]+/m, L_ = function() {
	function e(e) {
		this.subject = "", this.delimiters = null, this.brackets = null, this.pos = 0, this.lineStartNum = 0, this.lineIdx = 0, this.lineOffsets = [0], this.linePosOffset = 0, this.refMap = {}, this.refLinkCandidateMap = {}, this.refDefCandidateMap = {}, this.options = e;
	}
	return e.prototype.sourcepos = function(e, t) {
		var n = this.linePosOffset + this.lineOffsets[this.lineIdx], r = this.lineStartNum + this.lineIdx, i = [r, e + n];
		return typeof t == "number" ? [i, [r, t + n]] : i;
	}, e.prototype.nextLine = function() {
		this.lineIdx += 1, this.linePosOffset = -this.pos;
	}, e.prototype.match = function(e) {
		var t = e.exec(this.subject.slice(this.pos));
		return t === null ? null : (this.pos += t.index + t[0].length, t[0]);
	}, e.prototype.peek = function() {
		return this.pos < this.subject.length ? this.subject.charCodeAt(this.pos) : -1;
	}, e.prototype.spnl = function() {
		return this.match(k_), !0;
	}, e.prototype.parseBackticks = function(e) {
		var t = this.pos + 1, n = this.match(w_);
		if (n === null) return !1;
		for (var r = this.pos, i; (i = this.match(C_)) !== null;) if (i === n) {
			var a = this.subject.slice(r, this.pos - n.length), o = this.sourcepos(t, this.pos), s = a.split("\n");
			if (s.length > 1) {
				var c = Jg(s);
				this.lineIdx += s.length - 1, this.linePosOffset = -(this.pos - c.length - n.length), o[1] = this.sourcepos(this.pos), a = s.join(" ");
			}
			var l = q("code", o);
			return l.literal = a.length > 0 && a.match(/[^ ]/) !== null && a[0] == " " && a[a.length - 1] == " " ? a.slice(1, a.length - 1) : a, l.tickCount = n.length, e.appendChild(l), !0;
		}
		return this.pos = r, e.appendChild(J(n, this.sourcepos(t, this.pos - 1))), !0;
	}, e.prototype.parseBackslash = function(e) {
		var t = this.subject, n;
		this.pos += 1;
		var r = this.pos;
		return this.peek() === e_ ? (this.pos += 1, n = q("linebreak", this.sourcepos(this.pos - 1, this.pos)), e.appendChild(n), this.nextLine()) : x_.test(t.charAt(this.pos)) ? (e.appendChild(J(t.charAt(this.pos), this.sourcepos(r, this.pos))), this.pos += 1) : e.appendChild(J("\\", this.sourcepos(r, r))), !0;
	}, e.prototype.parseAutolink = function(e) {
		var t, n, r, i = this.pos + 1;
		return (t = this.match(D_)) ? (n = t.slice(1, t.length - 1), r = q("link", this.sourcepos(i, this.pos)), r.destination = Zh(`mailto:${n}`), r.title = "", r.appendChild(J(n, this.sourcepos(i + 1, this.pos - 1))), e.appendChild(r), !0) : (t = this.match(O_)) ? (n = t.slice(1, t.length - 1), r = q("link", this.sourcepos(i, this.pos)), r.destination = Zh(n), r.title = "", r.appendChild(J(n, this.sourcepos(i + 1, this.pos - 1))), e.appendChild(r), !0) : !1;
	}, e.prototype.parseHtmlTag = function(e) {
		var t = this.pos + 1, n = this.match(Pg);
		if (n === null) return !1;
		var r = q("htmlInline", this.sourcepos(t, this.pos));
		return r.literal = n, e.appendChild(r), !0;
	}, e.prototype.scanDelims = function(e) {
		var t = 0, n = this.pos;
		if (e === m_ || e === h_) t++, this.pos++;
		else for (; this.peek() === e;) t++, this.pos++;
		if (t === 0 || t < 2 && (e === o_ || e === g_)) return this.pos = n, null;
		var r = n === 0 ? "\n" : this.subject.charAt(n - 1), i = this.peek(), a = i === -1 ? "\n" : Rg(i), o = j_.test(a), s = v_.test(a), c = j_.test(r), l = v_.test(r), u = !o && (!s || c || l), d = !c && (!l || o || s), f, p;
		return e === n_ ? (f = u && (!d || l), p = d && (!u || s)) : e === m_ || e === h_ ? (f = u && !d, p = d) : e === g_ ? (f = !o, p = !c) : (f = u, p = d), this.pos = n, {
			numdelims: t,
			canOpen: f,
			canClose: p
		};
	}, e.prototype.handleDelim = function(e, t) {
		var n = this.scanDelims(e);
		if (!n) return !1;
		var r = n.numdelims, i = this.pos + 1, a;
		this.pos += r, a = e === m_ ? "’" : e === h_ ? "“" : this.subject.slice(i - 1, this.pos);
		var o = J(a, this.sourcepos(i, this.pos));
		return t.appendChild(o), (n.canOpen || n.canClose) && (this.options.smart || e !== m_ && e !== h_) && (this.delimiters = {
			cc: e,
			numdelims: r,
			origdelims: r,
			node: o,
			previous: this.delimiters,
			next: null,
			canOpen: n.canOpen,
			canClose: n.canClose
		}, this.delimiters.previous && (this.delimiters.previous.next = this.delimiters)), !0;
	}, e.prototype.removeDelimiter = function(e) {
		e.previous !== null && (e.previous.next = e.next), e.next === null ? this.delimiters = e.previous : e.next.previous = e.previous;
	}, e.prototype.removeDelimitersBetween = function(e, t) {
		e.next !== t && (e.next = t, t.previous = e);
	}, e.prototype.processEmphasis = function(e) {
		var t, n, r, i, a, o, s, c = !1, l = (t = {}, t[n_] = [
			e,
			e,
			e
		], t[t_] = [
			e,
			e,
			e
		], t[m_] = [e], t[h_] = [e], t[o_] = [e], t[g_] = [e], t);
		for (r = this.delimiters; r !== null && r.previous !== e;) r = r.previous;
		for (; r !== null;) {
			var u = r.cc, d = u === n_ || u === t_;
			if (!r.canClose) r = r.next;
			else {
				for (n = r.previous, s = !1; n !== null && n !== e && n !== l[u][d ? r.origdelims % 3 : 0];) {
					if (c = d && (r.canOpen || n.canClose) && r.origdelims % 3 != 0 && (n.origdelims + r.origdelims) % 3 == 0, n.cc === r.cc && n.canOpen && !c) {
						s = !0;
						break;
					}
					n = n.previous;
				}
				if (i = r, d || u === o_ || u === g_) {
					if (!s) r = r.next;
					else if (n) {
						var f = r.numdelims >= 2 && n.numdelims >= 2 ? 2 : 1, p = +!d;
						a = n.node, o = r.node;
						var m = d ? f === 1 ? "emph" : "strong" : "strike";
						u === g_ && (m = "customInline");
						var h = q(m), g = a.sourcepos[1], _ = o.sourcepos[0];
						h.sourcepos = [[g[0], g[1] - f + 1], [_[0], _[1] + f - 1]], a.sourcepos[1][1] -= f, o.sourcepos[0][1] += f, a.literal = a.literal.slice(f), o.literal = o.literal.slice(f), n.numdelims -= f, r.numdelims -= f;
						for (var v = a.next, y = void 0; v && v !== o;) y = v.next, v.unlink(), h.appendChild(v), v = y;
						if (u === g_) {
							var b = h.firstChild, x = b.literal || "", S = x.split(/\s/)[0];
							h.info = S, x.length <= S.length ? b.unlink() : (b.sourcepos[0][1] += S.length, b.literal = x.replace(`${S} `, ""));
						}
						if (a.insertAfter(h), this.removeDelimitersBetween(n, r), n.numdelims <= p && (n.numdelims === 0 && a.unlink(), this.removeDelimiter(n)), r.numdelims <= p) {
							r.numdelims === 0 && o.unlink();
							var ee = r.next;
							this.removeDelimiter(r), r = ee;
						}
					}
				} else u === m_ ? (r.node.literal = "’", s && (n.node.literal = "‘"), r = r.next) : u === h_ && (r.node.literal = "”", s && (n.node.literal = "“"), r = r.next);
				s || (l[u][d ? i.origdelims % 3 : 0] = i.previous, i.canOpen || this.removeDelimiter(i));
			}
		}
		for (; this.delimiters !== null && this.delimiters !== e;) this.removeDelimiter(this.delimiters);
	}, e.prototype.parseLinkTitle = function() {
		var e = this.match(y_);
		return e === null ? null : Xh(e.substr(1, e.length - 2));
	}, e.prototype.parseLinkDestination = function() {
		var e = this.match(b_);
		if (e === null) {
			if (this.peek() === s_) return null;
			for (var t = this.pos, n = 0, r = void 0; (r = this.peek()) !== -1;) if (r === l_ && x_.test(this.subject.charAt(this.pos + 1))) this.pos += 1, this.peek() !== -1 && (this.pos += 1);
			else if (r === d_) this.pos += 1, n += 1;
			else if (r === f_) {
				if (n < 1) break;
				this.pos += 1, --n;
			} else if (A_.exec(Rg(r)) !== null) break;
			else this.pos += 1;
			return this.pos === t && r !== f_ || n !== 0 ? null : (e = this.subject.substr(t, this.pos - t), Zh(Xh(e)));
		}
		return Zh(Xh(e.substr(1, e.length - 2)));
	}, e.prototype.parseLinkLabel = function() {
		var e = this.match(F_);
		return e === null || e.length > 1001 ? 0 : e.length;
	}, e.prototype.parseOpenBracket = function(e) {
		var t = this.pos;
		this.pos += 1;
		var n = J("[", this.sourcepos(this.pos, this.pos));
		return e.appendChild(n), this.addBracket(n, t, !1), !0;
	}, e.prototype.parseBang = function(e) {
		var t = this.pos;
		if (this.pos += 1, this.peek() === i_) {
			this.pos += 1;
			var n = J("![", this.sourcepos(this.pos - 1, this.pos));
			e.appendChild(n), this.addBracket(n, t + 1, !0);
		} else {
			var n = J("!", this.sourcepos(this.pos, this.pos));
			e.appendChild(n);
		}
		return !0;
	}, e.prototype.parseCloseBracket = function(e) {
		var t = null, n = null, r = !1;
		this.pos += 1;
		var i = this.pos, a = this.brackets;
		if (a === null) return e.appendChild(J("]", this.sourcepos(i, i))), !0;
		if (!a.active) return e.appendChild(J("]", this.sourcepos(i, i))), this.removeBracket(), !0;
		var o = a.image, s = this.pos;
		this.peek() === d_ && (this.pos++, this.spnl() && (t = this.parseLinkDestination()) !== null && this.spnl() && (A_.test(this.subject.charAt(this.pos - 1)) && (n = this.parseLinkTitle()) || !0) && this.spnl() && this.peek() === f_ ? (this.pos += 1, r = !0) : this.pos = s);
		var c = "";
		if (!r) {
			var l = this.pos, u = this.parseLinkLabel();
			if (u > 2 ? c = this.subject.slice(l, l + u) : a.bracketAfter || (c = this.subject.slice(a.index, i)), u === 0 && (this.pos = s), c) {
				c = Yg(c);
				var d = this.refMap[c];
				d && (t = d.destination, n = d.title, r = !0);
			}
		}
		if (r) {
			var f = q(o ? "image" : "link");
			f.destination = t, f.title = n || "", f.sourcepos = [a.startpos, this.sourcepos(this.pos)];
			for (var p = a.node.next, m = void 0; p;) m = p.next, p.unlink(), f.appendChild(p), p = m;
			if (e.appendChild(f), this.processEmphasis(a.previousDelimiter), this.removeBracket(), a.node.unlink(), !o) for (a = this.brackets; a !== null;) a.image || (a.active = !1), a = a.previous;
			return this.options.referenceDefinition && (this.refLinkCandidateMap[e.id] = {
				node: e,
				refLabel: c
			}), !0;
		}
		return this.removeBracket(), this.pos = i, e.appendChild(J("]", this.sourcepos(i, i))), this.options.referenceDefinition && (this.refLinkCandidateMap[e.id] = {
			node: e,
			refLabel: c
		}), !0;
	}, e.prototype.addBracket = function(e, t, n) {
		this.brackets !== null && (this.brackets.bracketAfter = !0), this.brackets = {
			node: e,
			startpos: this.sourcepos(t + +!n),
			previous: this.brackets,
			previousDelimiter: this.delimiters,
			index: t,
			image: n,
			active: !0
		};
	}, e.prototype.removeBracket = function() {
		this.brackets && (this.brackets = this.brackets.previous);
	}, e.prototype.parseEntity = function(e) {
		var t, n = this.pos + 1;
		return (t = this.match(S_)) ? (e.appendChild(J(ch.decodeHTML(t), this.sourcepos(n, this.pos))), !0) : !1;
	}, e.prototype.parseString = function(e) {
		var t, n = this.pos + 1;
		if (t = this.match(I_)) {
			if (this.options.smart) {
				var r = t.replace(T_, "…").replace(E_, function(e) {
					var t = 0, n = 0;
					return e.length % 3 == 0 ? n = e.length / 3 : e.length % 2 == 0 ? t = e.length / 2 : e.length % 3 == 2 ? (t = 1, n = (e.length - 2) / 3) : (t = 2, n = (e.length - 4) / 3), eg("—", n) + eg("–", t);
				});
				e.appendChild(J(r, this.sourcepos(n, this.pos)));
			} else {
				var i = J(t, this.sourcepos(n, this.pos));
				e.appendChild(i);
			}
			return !0;
		}
		return !1;
	}, e.prototype.parseNewline = function(e) {
		this.pos += 1;
		var t = e.lastChild;
		if (t && t.type === "text" && t.literal[t.literal.length - 1] === " ") {
			var n = t.literal[t.literal.length - 2] === " ", r = t.literal.length;
			t.literal = t.literal.replace(M_, "");
			var i = r - t.literal.length;
			t.sourcepos[1][1] -= i, e.appendChild(q(n ? "linebreak" : "softbreak", this.sourcepos(this.pos - i, this.pos)));
		} else e.appendChild(q("softbreak", this.sourcepos(this.pos, this.pos)));
		return this.nextLine(), this.match(N_), !0;
	}, e.prototype.parseReference = function(e, t) {
		if (!this.options.referenceDefinition) return 0;
		this.subject = e.stringContent, this.pos = 0;
		var n = null, r = this.pos, i = this.parseLinkLabel();
		if (i === 0) return 0;
		var a = this.subject.substr(0, i);
		if (this.peek() === p_) this.pos++;
		else return this.pos = r, 0;
		this.spnl();
		var o = this.parseLinkDestination();
		if (o === null) return this.pos = r, 0;
		var s = this.pos;
		this.spnl(), this.pos !== s && (n = this.parseLinkTitle()), n === null && (n = "", this.pos = s);
		var c = !0;
		if (this.match(P_) === null && (n === "" ? c = !1 : (n = "", this.pos = s, c = this.match(P_) !== null)), !c) return this.pos = r, 0;
		var l = Yg(a);
		if (l === "") return this.pos = r, 0;
		var u = this.getReferenceDefSourcepos(e);
		e.sourcepos[0][0] = u[1][0] + 1;
		var d = q("refDef", u);
		return d.title = n, d.dest = o, d.label = l, e.insertBefore(d), t[l] ? this.refDefCandidateMap[d.id] = d : t[l] = ny(d), this.pos - r;
	}, e.prototype.mergeTextNodes = function(e) {
		for (var t, n = []; t = e.next();) {
			var r = t.entering, i = t.node;
			if (r && i.type === "text") n.push(i);
			else if (n.length === 1) n = [];
			else if (n.length > 1) {
				var a = n[0], o = n[n.length - 1];
				a.sourcepos && o.sourcepos && (a.sourcepos[1] = o.sourcepos[1]), a.next = o.next, a.next && (a.next.prev = a);
				for (var s = 1; s < n.length; s += 1) a.literal += n[s].literal, n[s].unlink();
				n = [];
			}
		}
	}, e.prototype.getReferenceDefSourcepos = function(e) {
		for (var t = e.stringContent.split(/\n|\r\n/), n = !1, r = 0, i = {
			line: 0,
			ch: 0
		}, a = 0; a < t.length; a += 1) {
			var o = t[a];
			if (A_.test(o)) break;
			if (/\:/.test(o) && r === 0) {
				if (n) break;
				var s = o.indexOf(":") === o.length - 1 ? a + 1 : a;
				i = {
					line: s,
					ch: t[s].length
				}, n = !0;
			}
			var c = o.match(/'|"/g);
			if (c && (r += c.length), r === 2) {
				i = {
					line: a,
					ch: o.length
				};
				break;
			}
		}
		return [[e.sourcepos[0][0], e.sourcepos[0][1]], [e.sourcepos[0][0] + i.line, i.ch]];
	}, e.prototype.parseInline = function(e) {
		var t, n = !1, r = this.peek();
		if (r === -1) return !1;
		switch (r) {
			case e_:
				n = this.parseNewline(e);
				break;
			case l_:
				n = this.parseBackslash(e);
				break;
			case r_:
				n = this.parseBackticks(e);
				break;
			case t_:
			case n_:
			case o_:
			case g_:
				n = this.handleDelim(r, e);
				break;
			case m_:
			case h_:
				n = !!((t = this.options) != null && t.smart) && this.handleDelim(r, e);
				break;
			case i_:
				n = this.parseOpenBracket(e);
				break;
			case c_:
				n = this.parseBang(e);
				break;
			case a_:
				n = this.parseCloseBracket(e);
				break;
			case s_:
				n = this.parseAutolink(e) || this.parseHtmlTag(e);
				break;
			case u_:
				e.disabledEntityParse || (n = this.parseEntity(e));
				break;
			default: n = this.parseString(e);
		}
		return n || (this.pos += 1, e.appendChild(J(Rg(r), this.sourcepos(this.pos, this.pos + 1)))), !0;
	}, e.prototype.parse = function(e) {
		for (this.subject = e.stringContent.trim(), this.pos = 0, this.delimiters = null, this.brackets = null, this.lineOffsets = e.lineOffsets || [0], this.lineIdx = 0, this.linePosOffset = 0, this.lineStartNum = e.sourcepos[0][0], wg(e) && (this.lineOffsets[0] += e.level + 1); this.parseInline(e););
		e.stringContent = null, this.processEmphasis(null), this.mergeTextNodes(e.walker());
		var t = this.options, n = t.extendedAutolinks, r = t.customParser;
		if (n && qg(e.walker(), n), r && e.firstChild) for (var i, a = e.firstChild.walker(); i = a.next();) {
			var o = i.node, s = i.entering;
			r[o.type] && r[o.type](o, {
				entering: s,
				options: this.options
			});
		}
	}, e;
}(), R_ = /^\[([ \txX])\][ \t]+/;
function z_(e, t) {
	if (t.firstChild && t.firstChild.type === "paragraph") {
		var n = t.firstChild, r = n.stringContent.match(R_);
		if (r) {
			var i = r[0].length;
			n.stringContent = n.stringContent.substring(i - 1), n.sourcepos[0][1] += i, n.lineOffsets[0] += i, t.listData.task = !0, t.listData.checked = /[xX]/.test(r[1]);
		}
	}
}
var B_ = {
	continue: function() {
		return 0;
	},
	finalize: function() {},
	canContain: function(e) {
		return e === "tableHead" || e === "tableBody";
	},
	acceptsLines: !1
}, V_ = {
	continue: function() {
		return 0;
	},
	finalize: function() {},
	canContain: function(e) {
		return e === "tableRow";
	},
	acceptsLines: !1
}, H_ = {
	continue: function() {
		return 1;
	},
	finalize: function() {},
	canContain: function(e) {
		return e === "tableRow" || e === "tableDelimRow";
	},
	acceptsLines: !1
}, U_ = {
	continue: function() {
		return 1;
	},
	finalize: function() {},
	canContain: function(e) {
		return e === "tableDelimCell";
	},
	acceptsLines: !1
}, W_ = {
	continue: function() {
		return 1;
	},
	finalize: function() {},
	canContain: function() {
		return !1;
	},
	acceptsLines: !1
}, G_ = {
	continue: function() {
		return 1;
	},
	finalize: function() {},
	canContain: function(e) {
		return e === "tableCell";
	},
	acceptsLines: !1
}, K_ = {
	continue: function() {
		return 1;
	},
	finalize: function() {},
	canContain: function() {
		return !1;
	},
	acceptsLines: !1
}, q_ = 4, J_ = 9, Y_ = 62, X_ = 60, Z_ = 32, Q_ = 91, $_ = /[^ \t\f\v\r\n]/, ev = /^(?:`{3,}|~{3,})(?= *$)/;
function tv(e) {
	for (var t = e; t;) {
		if (t.lastLineBlank) return !0;
		var n = t.type;
		if (!t.lastLineChecked && (n === "list" || n === "item")) t.lastLineChecked = !0, t = t.lastChild;
		else {
			t.lastLineChecked = !0;
			break;
		}
	}
	return !1;
}
function nv(e, t) {
	return t < e.length ? e.charCodeAt(t) : -1;
}
function rv(e) {
	return !$_.test(e);
}
function iv(e) {
	return e === Z_ || e === J_;
}
var av = /^\$\$$/, ov = {
	continue: function(e, t) {
		var n = e.currentLine, r = n.match(av);
		if (r) return e.lastLineLength = r[0].length, e.finalize(t, e.lineNumber), 2;
		for (var i = t.offset; i > 0 && iv(nv(n, e.offset));) e.advanceOffset(1, !0), i--;
		return 0;
	},
	finalize: function(e, t) {
		if (t.stringContent !== null) {
			var n = t.stringContent, r = n.indexOf("\n"), i = n.slice(0, r), a = n.slice(r + 1);
			t.info = Xh(i.match(/^(\s*)(.*)/)[2].trim()), t.literal = a, t.stringContent = null;
		}
	},
	canContain: function() {
		return !1;
	},
	acceptsLines: !0
}, sv = {
	continue: function() {
		return 1;
	},
	finalize: function() {},
	canContain: function() {
		return !1;
	},
	acceptsLines: !0
}, cv = {
	document: {
		continue: function() {
			return 0;
		},
		finalize: function() {},
		canContain: function(e) {
			return e !== "item";
		},
		acceptsLines: !1
	},
	list: {
		continue: function() {
			return 0;
		},
		finalize: function(e, t) {
			for (var n = t.firstChild; n;) {
				if (tv(n) && n.next) {
					t.listData.tight = !1;
					break;
				}
				for (var r = n.firstChild; r;) {
					if (tv(r) && (n.next || r.next)) {
						t.listData.tight = !1;
						break;
					}
					r = r.next;
				}
				n = n.next;
			}
		},
		canContain: function(e) {
			return e === "item";
		},
		acceptsLines: !1
	},
	blockQuote: {
		continue: function(e) {
			var t = e.currentLine;
			if (!e.indented && nv(t, e.nextNonspace) === Y_) e.advanceNextNonspace(), e.advanceOffset(1, !1), iv(nv(t, e.offset)) && e.advanceOffset(1, !0);
			else return 1;
			return 0;
		},
		finalize: function() {},
		canContain: function(e) {
			return e !== "item";
		},
		acceptsLines: !1
	},
	item: {
		continue: function(e, t) {
			if (e.blank) {
				if (t.firstChild === null) return 1;
				e.advanceNextNonspace();
			} else if (e.indent >= t.listData.markerOffset + t.listData.padding) e.advanceOffset(t.listData.markerOffset + t.listData.padding, !0);
			else return 1;
			return 0;
		},
		finalize: z_,
		canContain: function(e) {
			return e !== "item";
		},
		acceptsLines: !1
	},
	heading: {
		continue: function() {
			return 1;
		},
		finalize: function() {},
		canContain: function() {
			return !1;
		},
		acceptsLines: !1
	},
	thematicBreak: {
		continue: function() {
			return 1;
		},
		finalize: function() {},
		canContain: function() {
			return !1;
		},
		acceptsLines: !1
	},
	codeBlock: {
		continue: function(e, t) {
			var n = e.currentLine, r = e.indent;
			if (t.isFenced) {
				var i = r <= 3 && n.charAt(e.nextNonspace) === t.fenceChar && n.slice(e.nextNonspace).match(ev);
				if (i && i[0].length >= t.fenceLength) return e.lastLineLength = e.offset + r + i[0].length, e.finalize(t, e.lineNumber), 2;
				for (var a = t.fenceOffset; a > 0 && iv(nv(n, e.offset));) e.advanceOffset(1, !0), a--;
			} else if (r >= q_) e.advanceOffset(q_, !0);
			else if (e.blank) e.advanceNextNonspace();
			else return 1;
			return 0;
		},
		finalize: function(e, t) {
			var n;
			if (t.stringContent !== null) {
				if (t.isFenced) {
					var r = t.stringContent, i = r.indexOf("\n"), a = r.slice(0, i), o = r.slice(i + 1), s = a.match(/^(\s*)(.*)/);
					t.infoPadding = s[1].length, t.info = Xh(s[2].trim()), t.literal = o;
				} else t.literal = (n = t.stringContent) == null ? void 0 : n.replace(/(\n *)+$/, "\n");
				t.stringContent = null;
			}
		},
		canContain: function() {
			return !1;
		},
		acceptsLines: !0
	},
	htmlBlock: {
		continue: function(e, t) {
			return e.blank && (t.htmlBlockType === 6 || t.htmlBlockType === 7) ? 1 : 0;
		},
		finalize: function(e, t) {
			var n;
			t.literal = ((n = t.stringContent) == null ? void 0 : n.replace(/(\n *)+$/, "")) || null, t.stringContent = null;
		},
		canContain: function() {
			return !1;
		},
		acceptsLines: !0
	},
	paragraph: {
		continue: function(e) {
			return +!!e.blank;
		},
		finalize: function(e, t) {
			if (t.stringContent !== null) {
				for (var n, r = !1; nv(t.stringContent, 0) === Q_ && (n = e.inlineParser.parseReference(t, e.refMap));) t.stringContent = t.stringContent.slice(n), r = !0;
				r && rv(t.stringContent) && t.unlink();
			}
		},
		canContain: function() {
			return !1;
		},
		acceptsLines: !0
	},
	table: B_,
	tableBody: V_,
	tableHead: H_,
	tableRow: G_,
	tableCell: K_,
	tableDelimRow: U_,
	tableDelimCell: W_,
	refDef: sv,
	customBlock: ov,
	frontMatter: sv
};
function lv(e) {
	for (var t = 0, n = 0, r = [], i = 0; i < e.length; i += 1) if (e[i] === "|" && e[i - 1] !== "\\") {
		var a = e.substring(t, i);
		t === 0 && tg(a) ? n = i + 1 : r.push(a), t = i + 1;
	}
	if (t < e.length) {
		var a = e.substring(t, e.length);
		tg(a) || r.push(a);
	}
	return [n, r];
}
function uv(e, t, n, r) {
	for (var i = [], a = 0, o = t; a < o.length; a++) {
		var s = o[a], c = s.match(/^[ \t]+/), l = c ? c[0].length : 0, u = void 0, d = void 0;
		if (l === s.length) l = 0, u = 0, d = "";
		else {
			var f = s.match(/[ \t]+$/);
			u = f ? f[0].length : 0, d = s.slice(l, s.length - u);
		}
		var p = r + l, m = q(e, [[n, r], [n, r + s.length - 1]]);
		m.stringContent = d.replace(/\\\|/g, "|"), m.startIdx = i.length, m.endIdx = i.length, m.lineOffsets = [p - 1], m.paddingLeft = l, m.paddingRight = u, i.push(m), r += s.length + 1;
	}
	return i;
}
function dv(e) {
	var t = null, n = e.stringContent, r = n[0];
	return n[n.length - 1] === ":" ? t = r === ":" ? "center" : "right" : r === ":" && (t = "left"), { align: t };
}
var fv = function(e, t) {
	var n = t.stringContent;
	if (t.type === "paragraph" && !e.indented && !e.blank) {
		var r = n.length - 1, i = n.lastIndexOf("\n", r - 1) + 1, a = n.slice(i, r), o = e.currentLine.slice(e.nextNonspace), s = lv(a), c = s[0], l = s[1], u = lv(o), d = u[0], f = u[1], p = /^[ \t]*:?-+:?[ \t]*$/;
		if (!l.length || !f.length || f.some(function(e) {
			return !p.test(e);
		}) || f.length === 1 && o.indexOf("|") !== 0) return 0;
		var m = t.lineOffsets, h = e.lineNumber - 1, g = Jg(m) + 1, _ = q("table", [[h, g], [e.lineNumber, e.offset]]);
		if (_.columns = f.map(function() {
			return { align: null };
		}), t.insertAfter(_), m.length === 1) t.unlink();
		else {
			t.stringContent = n.slice(0, i);
			var v = i - (n.lastIndexOf("\n", i - 2) + 1) - 1;
			e.lastLineLength = m[m.length - 2] + v, e.finalize(t, h - 1);
		}
		e.advanceOffset(e.currentLine.length - e.offset, !1);
		var y = q("tableHead", [[h, g], [e.lineNumber, e.offset]]);
		_.appendChild(y);
		var b = q("tableRow", [[h, g], [h, g + a.length - 1]]), x = q("tableDelimRow", [[e.lineNumber, e.nextNonspace + 1], [e.lineNumber, e.offset]]);
		y.appendChild(b), y.appendChild(x), uv("tableCell", l, h, g + c).forEach(function(e) {
			b.appendChild(e);
		});
		var S = uv("tableDelimCell", f, e.lineNumber, e.nextNonspace + 1 + d);
		return S.forEach(function(e) {
			x.appendChild(e);
		}), _.columns = S.map(dv), e.tip = _, 2;
	}
	return 0;
}, pv = function(e, t) {
	if (t.type !== "table" && t.type !== "tableBody" || !e.blank && e.currentLine.indexOf("|") === -1) return 0;
	if (e.advanceOffset(e.currentLine.length - e.offset, !1), e.blank) {
		var n = t;
		return t.type === "tableBody" && (n = t.parent, e.finalize(t, e.lineNumber - 1)), e.finalize(n, e.lineNumber - 1), 0;
	}
	var r = t;
	t.type === "table" && (r = e.addChild("tableBody", e.nextNonspace), r.stringContent = null);
	var i = q("tableRow", [[e.lineNumber, e.nextNonspace + 1], [e.lineNumber, e.currentLine.length]]);
	r.appendChild(i);
	var a = r.parent, o = lv(e.currentLine.slice(e.nextNonspace)), s = o[0], c = o[1];
	return uv("tableCell", c, e.lineNumber, e.nextNonspace + 1 + s).forEach(function(e, t) {
		t >= a.columns.length && (e.ignored = !0), i.appendChild(e);
	}), 2;
}, mv = /^(\$\$)(\s*[a-zA-Z])+/, hv = /^(\$\$)(\s*[a-zA-Z])+.*(\$\$)/, gv = function(e) {
	var t;
	if (!e.indented && !hv.test(e.currentLine) && (t = e.currentLine.match(mv))) {
		var n = t[1].length;
		e.closeUnmatchedBlocks();
		var r = e.addChild("customBlock", e.nextNonspace);
		return r.syntaxLength = n, r.offset = e.indent, e.advanceNextNonspace(), e.advanceOffset(n, !1), 2;
	}
	return 0;
}, _v = /^`{3,}(?!.*`)|^~{3,}/, vv = [
	/./,
	/^<(?:script|pre|style)(?:\s|>|$)/i,
	/^<!--/,
	/^<[?]/,
	/^<![A-Z]/,
	/^<!\[CDATA\[/,
	/^<[/]?(?:address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[123456]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|nav|noframes|ol|optgroup|option|p|param|section|source|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul)(?:\s|[/]?[>]|$)/i,
	RegExp(`^(?:${jg}|${Mg})\\s*\$`, "i")
], yv = /^(?:=+|-+)[ \t]*$/, bv = /^#{1,6}(?:[ \t]+|$)/, xv = /^(?:(?:\*[ \t]*){3,}|(?:_[ \t]*){3,}|(?:-[ \t]*){3,})[ \t]*$/, Sv = /^[*+-]/, Cv = /^(\d{1,9})([.)])/;
function wv(e, t) {
	var n = e.currentLine.slice(e.nextNonspace), r, i, a = {
		type: "bullet",
		tight: !0,
		bulletChar: "",
		start: 0,
		delimiter: "",
		padding: 0,
		markerOffset: e.indent,
		task: !1,
		checked: !1
	};
	if (e.indent >= 4) return null;
	if (r = n.match(Sv)) a.type = "bullet", a.bulletChar = r[0][0];
	else if ((r = n.match(Cv)) && (t.type !== "paragraph" || r[1] === "1")) a.type = "ordered", a.start = parseInt(r[1], 10), a.delimiter = r[2];
	else return null;
	if (i = nv(e.currentLine, e.nextNonspace + r[0].length), i !== -1 && i !== J_ && i !== Z_ || t.type === "paragraph" && !e.currentLine.slice(e.nextNonspace + r[0].length).match($_)) return null;
	e.advanceNextNonspace(), e.advanceOffset(r[0].length, !0);
	var o = e.column, s = e.offset;
	do
		e.advanceOffset(1, !0), i = nv(e.currentLine, e.offset);
	while (e.column - o < 5 && iv(i));
	var c = nv(e.currentLine, e.offset) === -1, l = e.column - o;
	return l >= 5 || l < 1 || c ? (a.padding = r[0].length + 1, e.column = o, e.offset = s, iv(nv(e.currentLine, e.offset)) && e.advanceOffset(1, !0)) : a.padding = r[0].length + l, a;
}
function Tv(e, t) {
	return e.type === t.type && e.delimiter === t.delimiter && e.bulletChar === t.bulletChar;
}
function Ev(e, t) {
	return e.options.disallowDeepHeading && (t.type === "blockQuote" || t.type === "item");
}
var Dv = [
	function(e) {
		return !e.indented && nv(e.currentLine, e.nextNonspace) === Y_ ? (e.advanceNextNonspace(), e.advanceOffset(1, !1), iv(nv(e.currentLine, e.offset)) && e.advanceOffset(1, !0), e.closeUnmatchedBlocks(), e.addChild("blockQuote", e.nextNonspace), 1) : 0;
	},
	function(e, t) {
		var n;
		if (!e.indented && !Ev(e, t) && (n = e.currentLine.slice(e.nextNonspace).match(bv))) {
			e.advanceNextNonspace(), e.advanceOffset(n[0].length, !1), e.closeUnmatchedBlocks();
			var r = e.addChild("heading", e.nextNonspace);
			return r.level = n[0].trim().length, r.headingType = "atx", r.stringContent = e.currentLine.slice(e.offset).replace(/^[ \t]*#+[ \t]*$/, "").replace(/[ \t]+#+[ \t]*$/, ""), e.advanceOffset(e.currentLine.length - e.offset), 2;
		}
		return 0;
	},
	function(e) {
		var t;
		if (!e.indented && (t = e.currentLine.slice(e.nextNonspace).match(_v))) {
			var n = t[0].length;
			e.closeUnmatchedBlocks();
			var r = e.addChild("codeBlock", e.nextNonspace);
			return r.isFenced = !0, r.fenceLength = n, r.fenceChar = t[0][0], r.fenceOffset = e.indent, e.advanceNextNonspace(), e.advanceOffset(n, !1), 2;
		}
		return 0;
	},
	function(e, t) {
		if (!e.indented && nv(e.currentLine, e.nextNonspace) === X_) {
			var n = e.currentLine.slice(e.nextNonspace), r = e.options.disallowedHtmlBlockTags, i = void 0;
			for (i = 1; i <= 7; i++) {
				var a = n.match(vv[i]);
				if (a) {
					if (i === 7 && (t.type === "paragraph" || r.length > 0 && RegExp(`</?(?:${r.join("|")})`, "i").test(a[0]))) return 0;
					e.closeUnmatchedBlocks();
					var o = e.addChild("htmlBlock", e.offset);
					return o.htmlBlockType = i, 2;
				}
			}
		}
		return 0;
	},
	function(e, t) {
		var n;
		if (t.stringContent !== null && !e.indented && t.type === "paragraph" && !Ev(e, t.parent) && (n = e.currentLine.slice(e.nextNonspace).match(yv))) {
			e.closeUnmatchedBlocks();
			for (var r = void 0; nv(t.stringContent, 0) === Q_ && (r = e.inlineParser.parseReference(t, e.refMap));) t.stringContent = t.stringContent.slice(r);
			if (t.stringContent.length > 0) {
				var i = q("heading", t.sourcepos);
				return i.level = n[0][0] === "=" ? 1 : 2, i.headingType = "setext", i.stringContent = t.stringContent, t.insertAfter(i), t.unlink(), e.tip = i, e.advanceOffset(e.currentLine.length - e.offset, !1), 2;
			}
			return 0;
		}
		return 0;
	},
	function(e) {
		return !e.indented && xv.test(e.currentLine.slice(e.nextNonspace)) ? (e.closeUnmatchedBlocks(), e.addChild("thematicBreak", e.nextNonspace), e.advanceOffset(e.currentLine.length - e.offset, !1), 2) : 0;
	},
	function(e, t) {
		var n, r = t;
		return (!e.indented || t.type === "list") && (n = wv(e, r)) ? (e.closeUnmatchedBlocks(), (e.tip.type !== "list" || !Tv(r.listData, n)) && (r = e.addChild("list", e.nextNonspace), r.listData = n), r = e.addChild("item", e.nextNonspace), r.listData = n, 1) : 0;
	},
	function(e) {
		return e.indented && e.tip.type !== "paragraph" && !e.blank ? (e.advanceOffset(q_, !0), e.closeUnmatchedBlocks(), e.addChild("codeBlock", e.offset), 2) : 0;
	},
	fv,
	pv,
	gv
], Ov = /^(-{3}|\+{3}|;{3})$/, kv = function(e, t) {
	var n = e.currentLine, r = e.lineNumber, i = e.indented;
	if (r === 1 && !i && t.type === "document" && Ov.test(n)) {
		e.closeUnmatchedBlocks();
		var a = e.addChild("frontMatter", e.nextNonspace);
		return a.stringContent = n, e.advanceNextNonspace(), e.advanceOffset(n.length, !1), 2;
	}
	return 0;
}, Av = {
	continue: function(e, t) {
		var n = e.currentLine, r = n.match(Ov);
		return t.type === "frontMatter" && r ? (t.stringContent += n, e.lastLineLength = r[0].length, e.finalize(t, e.lineNumber), 2) : 0;
	},
	finalize: function(e, t) {
		t.stringContent !== null && (t.literal = t.stringContent, t.stringContent = null);
	},
	canContain: function() {
		return !1;
	},
	acceptsLines: !0
}, jv = [
	/./,
	/<\/(?:script|pre|style)>/i,
	/-->/,
	/\?>/,
	/>/,
	/\]\]>/
], Mv = /^[#`~*+_=<>0-9-;$]/, Nv = /\r\n|\n|\r/;
function Pv() {
	return q("document", [[1, 1], [0, 0]]);
}
var Fv = {
	smart: !1,
	tagFilter: !1,
	extendedAutolinks: !1,
	disallowedHtmlBlockTags: [],
	referenceDefinition: !1,
	disallowDeepHeading: !1,
	customParser: null,
	frontMatter: !1
}, Iv = function() {
	function e(e) {
		this.options = th(th({}, Fv), e), this.doc = Pv(), this.tip = this.doc, this.oldtip = this.doc, this.lineNumber = 0, this.offset = 0, this.column = 0, this.nextNonspace = 0, this.nextNonspaceColumn = 0, this.indent = 0, this.currentLine = "", this.indented = !1, this.blank = !1, this.partiallyConsumedTab = !1, this.allClosed = !0, this.lastMatchedContainer = this.doc, this.refMap = {}, this.refLinkCandidateMap = {}, this.refDefCandidateMap = {}, this.lastLineLength = 0, this.lines = [], this.options.frontMatter && (cv.frontMatter = Av, Dv.unshift(kv)), this.inlineParser = new L_(this.options);
	}
	return e.prototype.advanceOffset = function(e, t) {
		t === void 0 && (t = !1);
		for (var n = this.currentLine, r, i, a; e > 0 && (a = n[this.offset]);) a === "	" ? (r = 4 - this.column % 4, t ? (this.partiallyConsumedTab = r > e, i = r > e ? e : r, this.column += i, this.offset += +!this.partiallyConsumedTab, e -= i) : (this.partiallyConsumedTab = !1, this.column += r, this.offset += 1, --e)) : (this.partiallyConsumedTab = !1, this.offset += 1, this.column += 1, --e);
	}, e.prototype.advanceNextNonspace = function() {
		this.offset = this.nextNonspace, this.column = this.nextNonspaceColumn, this.partiallyConsumedTab = !1;
	}, e.prototype.findNextNonspace = function() {
		for (var e = this.currentLine, t = this.offset, n = this.column, r; (r = e.charAt(t)) !== "";) if (r === " ") t++, n++;
		else if (r === "	") t++, n += 4 - n % 4;
		else break;
		this.blank = r === "\n" || r === "\r" || r === "", this.nextNonspace = t, this.nextNonspaceColumn = n, this.indent = this.nextNonspaceColumn - this.column, this.indented = this.indent >= q_;
	}, e.prototype.addLine = function() {
		if (this.partiallyConsumedTab) {
			this.offset += 1;
			var e = 4 - this.column % 4;
			this.tip.stringContent += eg(" ", e);
		}
		this.tip.lineOffsets ? this.tip.lineOffsets.push(this.offset) : this.tip.lineOffsets = [this.offset], this.tip.stringContent += `${this.currentLine.slice(this.offset)}
`;
	}, e.prototype.addChild = function(e, t) {
		for (; !cv[this.tip.type].canContain(e);) this.finalize(this.tip, this.lineNumber - 1);
		var n = t + 1, r = q(e, [[this.lineNumber, n], [0, 0]]);
		return r.stringContent = "", this.tip.appendChild(r), this.tip = r, r;
	}, e.prototype.closeUnmatchedBlocks = function() {
		if (!this.allClosed) {
			for (; this.oldtip !== this.lastMatchedContainer;) {
				var e = this.oldtip.parent;
				this.finalize(this.oldtip, this.lineNumber - 1), this.oldtip = e;
			}
			this.allClosed = !0;
		}
	}, e.prototype.finalize = function(e, t) {
		var n = e.parent;
		e.open = !1, e.sourcepos[1] = [t, this.lastLineLength], cv[e.type].finalize(this, e), this.tip = n;
	}, e.prototype.processInlines = function(e) {
		var t, n = this.options.customParser, r = e.walker();
		for (this.inlineParser.refMap = this.refMap, this.inlineParser.refLinkCandidateMap = this.refLinkCandidateMap, this.inlineParser.refDefCandidateMap = this.refDefCandidateMap, this.inlineParser.options = this.options; t = r.next();) {
			var i = t.node, a = t.entering, o = i.type;
			n && n[o] && n[o](i, {
				entering: a,
				options: this.options
			}), !a && (o === "paragraph" || o === "heading" || o === "tableCell" && !i.ignored) && this.inlineParser.parse(i);
		}
	}, e.prototype.incorporateLine = function(e) {
		var t = this.doc;
		this.oldtip = this.tip, this.offset = 0, this.column = 0, this.blank = !1, this.partiallyConsumedTab = !1, this.lineNumber += 1, e.indexOf("\0") !== -1 && (e = e.replace(/\0/g, "�")), this.currentLine = e;
		for (var n = !0, r; (r = t.lastChild) && r.open;) {
			switch (t = r, this.findNextNonspace(), cv[t.type].continue(this, t)) {
				case 0: break;
				case 1:
					n = !1;
					break;
				case 2:
					this.lastLineLength = e.length;
					return;
				default: throw Error("continue returned illegal value, must be 0, 1, or 2");
			}
			if (!n) {
				t = t.parent;
				break;
			}
		}
		this.allClosed = t === this.oldtip, this.lastMatchedContainer = t;
		for (var i = t.type !== "paragraph" && cv[t.type].acceptsLines, a = Dv.length; !i;) {
			if (this.findNextNonspace(), t.type !== "table" && t.type !== "tableBody" && t.type !== "paragraph" && !this.indented && !Mv.test(e.slice(this.nextNonspace))) {
				this.advanceNextNonspace();
				break;
			}
			for (var o = 0; o < a;) {
				var s = Dv[o](this, t);
				if (s === 1) {
					t = this.tip;
					break;
				}
				if (s === 2) {
					t = this.tip, i = !0;
					break;
				}
				o++;
			}
			if (o === a) {
				this.advanceNextNonspace();
				break;
			}
		}
		if (!this.allClosed && !this.blank && this.tip.type === "paragraph") this.addLine();
		else {
			this.closeUnmatchedBlocks(), this.blank && t.lastChild && (t.lastChild.lastLineBlank = !0);
			for (var c = t.type, l = this.blank && !(c === "blockQuote" || Sg(t) && t.isFenced || c === "item" && !t.firstChild && t.sourcepos[0][0] === this.lineNumber), u = t; u;) u.lastLineBlank = l, u = u.parent;
			cv[c].acceptsLines ? (this.addLine(), Cg(t) && t.htmlBlockType >= 1 && t.htmlBlockType <= 5 && jv[t.htmlBlockType].test(this.currentLine.slice(this.offset)) && (this.lastLineLength = e.length, this.finalize(t, this.lineNumber))) : this.offset < e.length && !this.blank && (t = this.addChild("paragraph", this.offset), this.advanceNextNonspace(), this.addLine());
		}
		this.lastLineLength = e.length;
	}, e.prototype.parse = function(e, t) {
		this.doc = Pv(), this.tip = this.doc, this.lineNumber = 0, this.lastLineLength = 0, this.offset = 0, this.column = 0, this.lastMatchedContainer = this.doc, this.currentLine = "";
		var n = e.split(Nv), r = n.length;
		this.lines = t || n, this.options.referenceDefinition && this.clearRefMaps(), e.charCodeAt(e.length - 1) === e_ && --r;
		for (var i = 0; i < r; i++) this.incorporateLine(n[i]);
		for (; this.tip;) this.finalize(this.tip, r);
		return this.processInlines(this.doc), this.doc;
	}, e.prototype.partialParseStart = function(e, t) {
		this.doc = Pv(), this.tip = this.doc, this.lineNumber = e - 1, this.lastLineLength = 0, this.offset = 0, this.column = 0, this.lastMatchedContainer = this.doc, this.currentLine = "";
		for (var n = t.length, r = 0; r < n; r++) this.incorporateLine(t[r]);
		return this.doc;
	}, e.prototype.partialParseExtends = function(e) {
		for (var t = 0; t < e.length; t++) this.incorporateLine(e[t]);
	}, e.prototype.partialParseFinish = function() {
		for (; this.tip;) this.finalize(this.tip, this.lineNumber);
		this.processInlines(this.doc);
	}, e.prototype.setRefMaps = function(e, t, n) {
		this.refMap = e, this.refLinkCandidateMap = t, this.refDefCandidateMap = n;
	}, e.prototype.clearRefMaps = function() {
		[
			this.refMap,
			this.refLinkCandidateMap,
			this.refDefCandidateMap
		].forEach(function(e) {
			$g(e);
		});
	}, e;
}();
function Lv(e, t) {
	return e[0] < t[0] ? 1 : e[0] > t[0] ? -1 : e[1] < t[1] ? 1 : e[1] > t[1] ? -1 : 0;
}
function Rv(e, t) {
	var n = e[0], r = e[1];
	return Lv(r, t) === 1 ? 1 : Lv(n, t) === -1 ? -1 : 0;
}
function zv(e, t) {
	if (e.parent === t.parent && e !== t) {
		for (var n = e.next; n && n !== t;) {
			for (var r = n.next, i = 0, a = [
				"parent",
				"prev",
				"next"
			]; i < a.length; i++) {
				var o = a[i];
				n[o] && (sg(n[o].id), n[o] = null);
			}
			n = r;
		}
		e.next = t.next, t.next ? t.next.prev = e : e.parent.lastChild = e;
	}
}
function Bv(e) {
	for (var t = [], n = e.firstChild; n;) t.push(n), n = n.next;
	return t;
}
function Vv(e, t) {
	for (var n = 0, r = t; n < r.length; n++) {
		var i = r[n];
		e.insertBefore(i);
	}
}
function Hv(e, t) {
	for (var n = t.length - 1; n >= 0; --n) e.prependChild(t[n]);
}
function Uv(e, t) {
	if (!(!e || !e.parent || t === 0)) {
		var n = e.parent.walker();
		n.resumeAt(e, !0);
		for (var r; r = n.next();) {
			var i = r.node;
			r.entering && (i.sourcepos[0][0] += t, i.sourcepos[1][0] += t);
		}
	}
}
function Wv(e, t) {
	var n = e[0];
	return e[1][0] < t ? 1 : n[0] > t ? -1 : 0;
}
function Gv(e, t) {
	for (var n = e.firstChild; n;) {
		var r = Wv(n.sourcepos, t);
		if (r === 0) return n;
		if (r === -1) return n.prev || n;
		n = n.next;
	}
	return e.lastChild;
}
function Kv(e) {
	for (; e.lastChild;) e = e.lastChild;
	return e;
}
function qv(e) {
	for (; e.parent && e.parent.type !== "document" && e.parent.sourcepos[0][0] === e.sourcepos[0][0];) e = e.parent;
	return e;
}
function Jv(e, t) {
	for (var n = e.firstChild, r = null; n;) {
		var i = Wv(n.sourcepos, t);
		if (i === 0) {
			if (n.sourcepos[0][0] === t || !n.firstChild) return n;
			r = n, n = n.firstChild;
		} else if (i === -1) break;
		else r = n, n = n.next;
	}
	return r ? qv(Kv(r)) : null;
}
function Yv(e, t) {
	for (var n = e, r = null; n;) {
		var i = Rv(n.sourcepos, t);
		if (i === 0) {
			if (n.firstChild) r = n, n = n.firstChild;
			else return n;
		} else if (i === -1) return r;
		else if (n.next) n = n.next;
		else return r;
	}
	return n;
}
function Xv(e) {
	return og(e) || null;
}
function Zv(e, t, n) {
	if (n === void 0 && (n = null), t) for (var r = t.walker(); t && t !== n;) {
		e(t);
		var i = r.next();
		if (i) t = i.node;
		else break;
	}
}
function Qv(e) {
	var t = Xv(e);
	if (!t) return !0;
	for (; t && t.type !== "document";) {
		if (!t.parent && !t.prev && !t.next) return !0;
		t = t.parent;
	}
	return !1;
}
var $v = /\r\n|\n|\r/;
function ey(e) {
	var t = e.match(/^[ \t]+/);
	if (t && (t[0].length >= 2 || /\t/.test(t[0]))) return !0;
	var n = t ? e.slice(t.length) : e;
	return Sv.test(n) || Cv.test(n);
}
function ty(e) {
	return !rv(e) && e.indexOf("|") !== -1;
}
function ny(e) {
	return {
		id: e.id,
		title: e.title,
		sourcepos: e.sourcepos,
		unlinked: !1,
		destination: e.dest
	};
}
var ry = function() {
	function e(e, t) {
		this.refMap = {}, this.refLinkCandidateMap = {}, this.refDefCandidateMap = {}, this.referenceDefinition = !!(t != null && t.referenceDefinition), this.parser = new Iv(t), this.parser.setRefMaps(this.refMap, this.refLinkCandidateMap, this.refDefCandidateMap), this.eventHandlerMap = { change: [] }, e = e || "", this.lineTexts = e.split($v), this.root = this.parser.parse(e, this.lineTexts);
	}
	return e.prototype.updateLineTexts = function(e, t, n) {
		var r, i = e[0], a = e[1], o = t[0], s = t[1], c = n.split($v), l = c.length, u = this.lineTexts[i - 1], d = this.lineTexts[o - 1];
		c[0] = u.slice(0, a - 1) + c[0], c[l - 1] = c[l - 1] + d.slice(s - 1);
		var f = o - i + 1;
		return (r = this.lineTexts).splice.apply(r, nh([i - 1, f], c, !1)), l - f;
	}, e.prototype.updateRootNodeState = function() {
		if (this.lineTexts.length === 1 && this.lineTexts[0] === "") {
			this.root.lastLineBlank = !0, this.root.sourcepos = [[1, 1], [1, 0]];
			return;
		}
		this.root.lastChild && (this.root.lastLineBlank = this.root.lastChild.lastLineBlank);
		for (var e = this.lineTexts, t = e.length - 1; e[t] === "";) --t;
		e.length - 2 > t && (t += 1), this.root.sourcepos[1] = [t + 1, e[t].length];
	}, e.prototype.replaceRangeNodes = function(e, t, n) {
		e ? (Vv(e, n), zv(e, t), [e.id, t.id].forEach(function(e) {
			return sg(e);
		}), e.unlink()) : t ? (Vv(t, n), sg(t.id), t.unlink()) : Hv(this.root, n);
	}, e.prototype.getNodeRange = function(e, t) {
		var n = Gv(this.root, e[0]), r = Gv(this.root, t[0]);
		return r && r.next && t[0] + 1 === r.next.sourcepos[0][0] && (r = r.next), [n, r];
	}, e.prototype.trigger = function(e, t) {
		this.eventHandlerMap[e].forEach(function(e) {
			e(t);
		});
	}, e.prototype.extendEndLine = function(e) {
		for (; this.lineTexts[e] === "";) e += 1;
		return e;
	}, e.prototype.parseRange = function(e, t, n, r) {
		e && e.prev && (Tg(e.prev) && ey(this.lineTexts[n - 1]) || Eg(e.prev) && ty(this.lineTexts[n - 1])) && (e = e.prev, n = e.sourcepos[0][0]);
		for (var i = this.lineTexts.slice(n - 1, r), a = this.parser.partialParseStart(n, i), o = t ? t.next : this.root.firstChild, s = a.lastChild, c = s && Sg(s) && s.open, l = s && Og(s) && s.open, u = s && Tg(s); (c || l) && o || u && o && (o.type === "list" || o.sourcepos[0][1] >= 2);) {
			var d = this.extendEndLine(o.sourcepos[1][0]);
			this.parser.partialParseExtends(this.lineTexts.slice(r, d)), e || (e = t), t = o, r = d, o = o.next;
		}
		return this.parser.partialParseFinish(), {
			newNodes: Bv(a),
			extStartNode: e,
			extEndNode: t
		};
	}, e.prototype.getRemovedNodeRange = function(e, t) {
		return !e || e && Dg(e) || t && Dg(t) ? null : {
			id: [e.id, t.id],
			line: [e.sourcepos[0][0] - 1, t.sourcepos[1][0] - 1]
		};
	}, e.prototype.markDeletedRefMap = function(e, t) {
		var n = this;
		if (!Qg(this.refMap)) {
			var r = function(e) {
				if (Dg(e)) {
					var t = n.refMap[e.label];
					t && e.id === t.id && (t.unlinked = !0);
				}
			};
			e && Zv(r, e.parent, t), t && Zv(r, t);
		}
	}, e.prototype.replaceWithNewRefDefState = function(e) {
		var t = this;
		if (!Qg(this.refMap)) {
			var n = function(e) {
				if (Dg(e)) {
					var n = e.label, r = t.refMap[n];
					(!r || r.unlinked) && (t.refMap[n] = ny(e));
				}
			};
			e.forEach(function(e) {
				Zv(n, e);
			});
		}
	}, e.prototype.replaceWithRefDefCandidate = function() {
		var e = this;
		Qg(this.refDefCandidateMap) || Xg(this.refDefCandidateMap, function(t, n) {
			var r = n.label, i = n.sourcepos, a = e.refMap[r];
			(!a || a.unlinked || a.sourcepos[0][0] > i[0][0]) && (e.refMap[r] = ny(n));
		});
	}, e.prototype.getRangeWithRefDef = function(e, t, n, r, i) {
		if (this.referenceDefinition && !Qg(this.refMap)) {
			var a = Gv(this.root, e - 1), o = Gv(this.root, t + 1);
			a && Dg(a) && a !== n && a !== r && (n = a, e = n.sourcepos[0][0]), o && Dg(o) && o !== n && o !== r && (r = o, t = this.extendEndLine(r.sourcepos[1][0] + i));
		}
		return [
			n,
			r,
			e,
			t
		];
	}, e.prototype.parse = function(e, t, n) {
		n === void 0 && (n = 0);
		var r = this.getNodeRange(e, t), i = r[0], a = r[1], o = i ? Math.min(i.sourcepos[0][0], e[0]) : e[0], s = this.extendEndLine((a ? Math.max(a.sourcepos[1][0], t[0]) : t[0]) + n), c = this.parseRange.apply(this, this.getRangeWithRefDef(o, s, i, a, n)), l = c.newNodes, u = c.extStartNode, d = c.extEndNode, f = this.getRemovedNodeRange(u, d), p = d ? d.next : this.root.firstChild;
		return this.referenceDefinition ? (this.markDeletedRefMap(u, d), this.replaceRangeNodes(u, d, l), this.replaceWithNewRefDefState(l)) : this.replaceRangeNodes(u, d, l), {
			nodes: l,
			removedNodeRange: f,
			nextNode: p
		};
	}, e.prototype.parseRefLink = function() {
		var e = this, t = [];
		return Qg(this.refMap) || Xg(this.refMap, function(n, r) {
			r.unlinked && delete e.refMap[n], Xg(e.refLinkCandidateMap, function(r, i) {
				var a = i.node;
				i.refLabel === n && t.push(e.parse(a.sourcepos[0], a.sourcepos[1]));
			});
		}), t;
	}, e.prototype.removeUnlinkedCandidate = function() {
		Qg(this.refDefCandidateMap) || [this.refLinkCandidateMap, this.refDefCandidateMap].forEach(function(e) {
			Xg(e, function(t) {
				Qv(t) && delete e[t];
			});
		});
	}, e.prototype.editMarkdown = function(e, t, n) {
		var r = this.updateLineTexts(e, t, n), i = this.parse(e, t, r), a = Zg(i, "nextNode");
		Uv(i.nextNode, r), this.updateRootNodeState();
		var o = [a];
		return this.referenceDefinition && (this.removeUnlinkedCandidate(), this.replaceWithRefDefCandidate(), o = o.concat(this.parseRefLink())), this.trigger("change", o), o;
	}, e.prototype.getLineTexts = function() {
		return this.lineTexts;
	}, e.prototype.getRootNode = function() {
		return this.root;
	}, e.prototype.findNodeAtPosition = function(e) {
		var t = Yv(this.root, e);
		return !t || t === this.root ? null : t;
	}, e.prototype.findFirstNodeAtLine = function(e) {
		return Jv(this.root, e);
	}, e.prototype.on = function(e, t) {
		this.eventHandlerMap[e].push(t);
	}, e.prototype.off = function(e, t) {
		var n = this.eventHandlerMap[e], r = n.indexOf(t);
		n.splice(r, 1);
	}, e.prototype.findNodeById = function(e) {
		return Xv(e);
	}, e.prototype.removeAllNode = function() {
		cg();
	}, e;
}(), iy = RegExp(`<(/?(?:${[
	"title",
	"textarea",
	"style",
	"xmp",
	"iframe",
	"noembed",
	"noframes",
	"script",
	"plaintext"
].join("|")})[^>]*>)`, "ig");
function ay(e) {
	return iy.test(e) ? e.replace(iy, function(e, t) {
		return `&lt;${t}`;
	}) : e;
}
var oy = {
	heading: function(e, t) {
		return {
			type: t.entering ? "openTag" : "closeTag",
			tagName: `h${e.level}`,
			outerNewLine: !0
		};
	},
	text: function(e) {
		return {
			type: "text",
			content: e.literal
		};
	},
	softbreak: function(e, t) {
		return {
			type: "html",
			content: t.options.softbreak
		};
	},
	linebreak: function() {
		return {
			type: "html",
			content: "<br />\n"
		};
	},
	emph: function(e, t) {
		return {
			type: t.entering ? "openTag" : "closeTag",
			tagName: "em"
		};
	},
	strong: function(e, t) {
		return {
			type: t.entering ? "openTag" : "closeTag",
			tagName: "strong"
		};
	},
	paragraph: function(e, t) {
		var n, r = t.entering, i = (n = e.parent) == null ? void 0 : n.parent;
		return i && i.type === "list" && i.listData.tight ? null : {
			type: r ? "openTag" : "closeTag",
			tagName: "p",
			outerNewLine: !0
		};
	},
	thematicBreak: function() {
		return {
			type: "openTag",
			tagName: "hr",
			outerNewLine: !0,
			selfClose: !0
		};
	},
	blockQuote: function(e, t) {
		return {
			type: t.entering ? "openTag" : "closeTag",
			tagName: "blockquote",
			outerNewLine: !0,
			innerNewLine: !0
		};
	},
	list: function(e, t) {
		var n = t.entering, r = e.listData, i = r.type, a = r.start, o = i === "bullet" ? "ul" : "ol", s = {};
		return o === "ol" && a !== null && a !== 1 && (s.start = a.toString()), {
			type: n ? "openTag" : "closeTag",
			tagName: o,
			attributes: s,
			outerNewLine: !0
		};
	},
	item: function(e, t) {
		return {
			type: t.entering ? "openTag" : "closeTag",
			tagName: "li",
			outerNewLine: !0
		};
	},
	htmlInline: function(e, t) {
		return {
			type: "html",
			content: t.options.tagFilter ? ay(e.literal) : e.literal
		};
	},
	htmlBlock: function(e, t) {
		var n = t.options, r = n.tagFilter ? ay(e.literal) : e.literal;
		return n.nodeId ? [
			{
				type: "openTag",
				tagName: "div",
				outerNewLine: !0
			},
			{
				type: "html",
				content: r
			},
			{
				type: "closeTag",
				tagName: "div",
				outerNewLine: !0
			}
		] : {
			type: "html",
			content: r,
			outerNewLine: !0
		};
	},
	code: function(e) {
		return [
			{
				type: "openTag",
				tagName: "code"
			},
			{
				type: "text",
				content: e.literal
			},
			{
				type: "closeTag",
				tagName: "code"
			}
		];
	},
	codeBlock: function(e) {
		var t = e.info, n = t ? t.split(/\s+/) : [], r = [];
		return n.length > 0 && n[0].length > 0 && r.push(`language-${$h(n[0])}`), [
			{
				type: "openTag",
				tagName: "pre",
				outerNewLine: !0
			},
			{
				type: "openTag",
				tagName: "code",
				classNames: r
			},
			{
				type: "text",
				content: e.literal
			},
			{
				type: "closeTag",
				tagName: "code"
			},
			{
				type: "closeTag",
				tagName: "pre",
				outerNewLine: !0
			}
		];
	},
	link: function(e, t) {
		if (t.entering) {
			var n = e, r = n.title, i = n.destination;
			return {
				type: "openTag",
				tagName: "a",
				attributes: th({ href: $h(i) }, r && { title: $h(r) })
			};
		}
		return {
			type: "closeTag",
			tagName: "a"
		};
	},
	image: function(e, t) {
		var n = t.getChildrenText, r = t.skipChildren, i = e, a = i.title, o = i.destination;
		return r(), {
			type: "openTag",
			tagName: "img",
			selfClose: !0,
			attributes: th({
				src: $h(o),
				alt: n(e)
			}, a && { title: $h(a) })
		};
	},
	customBlock: function(e, t, n) {
		var r = e.info.trim().toLowerCase(), i = n[r];
		if (i) try {
			return i(e, t);
		} catch (e) {
			console.warn(`[@drenso-toast-ui/editor] - The error occurred when ${r} block node was parsed in markdown renderer: ${e}`);
		}
		return [
			{
				type: "openTag",
				tagName: "div",
				outerNewLine: !0
			},
			{
				type: "text",
				content: e.literal
			},
			{
				type: "closeTag",
				tagName: "div",
				outerNewLine: !0
			}
		];
	},
	frontMatter: function(e) {
		return [
			{
				type: "openTag",
				tagName: "div",
				outerNewLine: !0,
				attributes: { style: "white-space: pre; display: none;" }
			},
			{
				type: "text",
				content: e.literal
			},
			{
				type: "closeTag",
				tagName: "div",
				outerNewLine: !0
			}
		];
	},
	customInline: function(e, t, n) {
		var r = e, i = r.info, a = r.firstChild, o = i.trim().toLowerCase(), s = n[o], c = t.entering;
		if (s) try {
			return s(e, t);
		} catch (e) {
			console.warn(`[@drenso-toast-ui/editor] - The error occurred when ${o} inline node was parsed in markdown renderer: ${e}`);
		}
		return c ? [{
			type: "openTag",
			tagName: "span"
		}, {
			type: "text",
			content: `\$\$${i}${a ? " " : ""}`
		}] : [{
			type: "text",
			content: "$$"
		}, {
			type: "closeTag",
			tagName: "span"
		}];
	}
}, sy = {
	strike: function(e, t) {
		return {
			type: t.entering ? "openTag" : "closeTag",
			tagName: "del"
		};
	},
	item: function(e, t) {
		var n = t.entering, r = e.listData, i = r.checked, a = r.task;
		if (n) {
			var o = {
				type: "openTag",
				tagName: "li",
				outerNewLine: !0
			};
			return a ? [
				o,
				{
					type: "openTag",
					tagName: "input",
					selfClose: !0,
					attributes: th(th({}, i && { checked: "" }), {
						disabled: "",
						type: "checkbox"
					})
				},
				{
					type: "text",
					content: " "
				}
			] : o;
		}
		return {
			type: "closeTag",
			tagName: "li",
			outerNewLine: !0
		};
	},
	table: function(e, t) {
		return {
			type: t.entering ? "openTag" : "closeTag",
			tagName: "table",
			outerNewLine: !0
		};
	},
	tableHead: function(e, t) {
		return {
			type: t.entering ? "openTag" : "closeTag",
			tagName: "thead",
			outerNewLine: !0
		};
	},
	tableBody: function(e, t) {
		return {
			type: t.entering ? "openTag" : "closeTag",
			tagName: "tbody",
			outerNewLine: !0
		};
	},
	tableRow: function(e, t) {
		if (t.entering) return {
			type: "openTag",
			tagName: "tr",
			outerNewLine: !0
		};
		var n = [];
		if (e.lastChild) for (var r = e.parent.parent.columns.length, i = e.lastChild.endIdx + 1; i < r; i += 1) n.push({
			type: "openTag",
			tagName: "td",
			outerNewLine: !0
		}, {
			type: "closeTag",
			tagName: "td",
			outerNewLine: !0
		});
		return n.push({
			type: "closeTag",
			tagName: "tr",
			outerNewLine: !0
		}), n;
	},
	tableCell: function(e, t) {
		var n = t.entering;
		if (e.ignored) return {
			type: "text",
			content: ""
		};
		var r = e.parent.parent, i = r.type === "tableHead" ? "th" : "td", a = r.parent.columns[e.startIdx], o = a != null && a.align ? { align: a.align } : null;
		return n ? th({
			type: "openTag",
			tagName: i,
			outerNewLine: !0
		}, o && { attributes: o }) : {
			type: "closeTag",
			tagName: i,
			outerNewLine: !0
		};
	}
}, cy = {
	softbreak: "\n",
	gfm: !1,
	tagFilter: !1,
	nodeId: !1
};
function ly(e) {
	for (var t = [], n = e.walker(), r = null; r = n.next();) {
		var i = r.node;
		i.type === "text" && t.push(i.literal);
	}
	return t.join("");
}
var uy = function() {
	function e(e) {
		this.buffer = [], this.options = th(th({}, cy), e), this.convertors = this.createConvertors(), delete this.options.convertors;
	}
	return e.prototype.createConvertors = function() {
		var e = th({}, oy);
		if (this.options.gfm && (e = th(th({}, e), sy)), this.options.convertors) {
			var t = this.options.convertors, n = Object.keys(t), r = th(th({}, oy), sy);
			n.forEach(function(n) {
				var i = e[n], a = t[n], o = Object.keys(r).indexOf(n) === -1 ? n.toLowerCase() : n;
				i ? e[o] = function(e, t, n) {
					return t.origin = function() {
						return i(e, t, n);
					}, a(e, t);
				} : e[o] = a;
			});
		}
		return e;
	}, e.prototype.getConvertors = function() {
		return this.convertors;
	}, e.prototype.getOptions = function() {
		return this.options;
	}, e.prototype.render = function(e) {
		var t = this;
		this.buffer = [];
		for (var n = e.walker(), r = null, i = function() {
			var e = r.node, i = r.entering, o = a.convertors[e.type];
			if (!o) return "continue";
			var s = !1, c = {
				entering: i,
				leaf: !rg(e),
				options: a.options,
				getChildrenText: ly,
				skipChildren: function() {
					s = !0;
				}
			}, l = Og(e) || kg(e) ? o(e, c, a.convertors) : o(e, c);
			l && ((Array.isArray(l) ? l : [l]).forEach(function(n, r) {
				n.type === "openTag" && t.options.nodeId && r === 0 && (n.attributes || (n.attributes = {}), n.attributes["data-nodeid"] = String(e.id)), t.renderHTMLNode(n);
			}), s && (n.resumeAt(e, !1), n.next()));
		}, a = this; r = n.next();) i();
		return this.addNewLine(), this.buffer.join("");
	}, e.prototype.renderHTMLNode = function(e) {
		switch (e.type) {
			case "openTag":
			case "closeTag":
				this.renderElementNode(e);
				break;
			case "text":
				this.renderTextNode(e);
				break;
			case "html": this.renderRawHtmlNode(e);
		}
	}, e.prototype.generateOpenTagString = function(e) {
		var t = this, n = e.tagName, r = e.classNames, i = e.attributes;
		this.buffer.push(`<${n}`), r && r.length > 0 && this.buffer.push(` class="${r.join(" ")}"`), i && Object.keys(i).forEach(function(e) {
			var n = i[e];
			t.buffer.push(` ${e}="${n}"`);
		}), e.selfClose && this.buffer.push(" /"), this.buffer.push(">");
	}, e.prototype.generateCloseTagString = function(e) {
		var t = e.tagName;
		this.buffer.push(`</${t}>`);
	}, e.prototype.addNewLine = function() {
		this.buffer.length && Jg(Jg(this.buffer)) !== "\n" && this.buffer.push("\n");
	}, e.prototype.addOuterNewLine = function(e) {
		e.outerNewLine && this.addNewLine();
	}, e.prototype.addInnerNewLine = function(e) {
		e.innerNewLine && this.addNewLine();
	}, e.prototype.renderTextNode = function(e) {
		this.buffer.push($h(e.content));
	}, e.prototype.renderRawHtmlNode = function(e) {
		this.addOuterNewLine(e), this.buffer.push(e.content), this.addOuterNewLine(e);
	}, e.prototype.renderElementNode = function(e) {
		e.type === "openTag" ? (this.addOuterNewLine(e), this.generateOpenTagString(e), e.selfClose ? this.addOuterNewLine(e) : this.addInnerNewLine(e)) : (this.addInnerNewLine(e), this.generateCloseTagString(e), this.addOuterNewLine(e));
	}, e;
}(), { entries: dy, setPrototypeOf: fy, isFrozen: py, getPrototypeOf: my, getOwnPropertyDescriptor: hy } = Object, { freeze: gy, seal: _y, create: vy } = Object, { apply: yy, construct: by } = typeof Reflect < "u" && Reflect;
gy || (gy = function(e) {
	return e;
}), _y || (_y = function(e) {
	return e;
}), yy || (yy = function(e, t) {
	var n = [...arguments].slice(2);
	return e.apply(t, n);
}), by || (by = function(e) {
	return new e(...[...arguments].slice(1));
});
var xy = Fy(Array.prototype.forEach), Sy = Fy(Array.prototype.lastIndexOf), Cy = Fy(Array.prototype.pop), wy = Fy(Array.prototype.push), Ty = Fy(Array.prototype.splice), Ey = Fy(String.prototype.toLowerCase), Dy = Fy(String.prototype.toString), Oy = Fy(String.prototype.match), ky = Fy(String.prototype.replace), Ay = Fy(String.prototype.indexOf), jy = Fy(String.prototype.trim), My = Fy(Object.prototype.hasOwnProperty), Ny = Fy(RegExp.prototype.test), Py = Iy(TypeError);
function Fy(e) {
	return function(t) {
		t instanceof RegExp && (t.lastIndex = 0);
		var n = [...arguments].slice(1);
		return yy(e, t, n);
	};
}
function Iy(e) {
	return function() {
		return by(e, [...arguments]);
	};
}
function Y(e, t) {
	let n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : Ey;
	fy && fy(e, null);
	let r = t.length;
	for (; r--;) {
		let i = t[r];
		if (typeof i == "string") {
			let e = n(i);
			e !== i && (py(t) || (t[r] = e), i = e);
		}
		e[i] = !0;
	}
	return e;
}
function Ly(e) {
	for (let t = 0; t < e.length; t++) My(e, t) || (e[t] = null);
	return e;
}
function Ry(e) {
	let t = vy(null);
	for (let [n, r] of dy(e)) My(e, n) && (t[n] = Array.isArray(r) ? Ly(r) : r && typeof r == "object" && r.constructor === Object ? Ry(r) : r);
	return t;
}
function zy(e, t) {
	for (; e !== null;) {
		let n = hy(e, t);
		if (n) {
			if (n.get) return Fy(n.get);
			if (typeof n.value == "function") return Fy(n.value);
		}
		e = my(e);
	}
	function n() {
		return null;
	}
	return n;
}
var By = gy(/* @__PURE__ */ "a.abbr.acronym.address.area.article.aside.audio.b.bdi.bdo.big.blink.blockquote.body.br.button.canvas.caption.center.cite.code.col.colgroup.content.data.datalist.dd.decorator.del.details.dfn.dialog.dir.div.dl.dt.element.em.fieldset.figcaption.figure.font.footer.form.h1.h2.h3.h4.h5.h6.head.header.hgroup.hr.html.i.img.input.ins.kbd.label.legend.li.main.map.mark.marquee.menu.menuitem.meter.nav.nobr.ol.optgroup.option.output.p.picture.pre.progress.q.rp.rt.ruby.s.samp.search.section.select.shadow.slot.small.source.spacer.span.strike.strong.style.sub.summary.sup.table.tbody.td.template.textarea.tfoot.th.thead.time.tr.track.tt.u.ul.var.video.wbr".split(".")), Vy = gy(/* @__PURE__ */ "svg.a.altglyph.altglyphdef.altglyphitem.animatecolor.animatemotion.animatetransform.circle.clippath.defs.desc.ellipse.enterkeyhint.exportparts.filter.font.g.glyph.glyphref.hkern.image.inputmode.line.lineargradient.marker.mask.metadata.mpath.part.path.pattern.polygon.polyline.radialgradient.rect.stop.style.switch.symbol.text.textpath.title.tref.tspan.view.vkern".split(".")), Hy = gy([
	"feBlend",
	"feColorMatrix",
	"feComponentTransfer",
	"feComposite",
	"feConvolveMatrix",
	"feDiffuseLighting",
	"feDisplacementMap",
	"feDistantLight",
	"feDropShadow",
	"feFlood",
	"feFuncA",
	"feFuncB",
	"feFuncG",
	"feFuncR",
	"feGaussianBlur",
	"feImage",
	"feMerge",
	"feMergeNode",
	"feMorphology",
	"feOffset",
	"fePointLight",
	"feSpecularLighting",
	"feSpotLight",
	"feTile",
	"feTurbulence"
]), Uy = gy([
	"animate",
	"color-profile",
	"cursor",
	"discard",
	"font-face",
	"font-face-format",
	"font-face-name",
	"font-face-src",
	"font-face-uri",
	"foreignobject",
	"hatch",
	"hatchpath",
	"mesh",
	"meshgradient",
	"meshpatch",
	"meshrow",
	"missing-glyph",
	"script",
	"set",
	"solidcolor",
	"unknown",
	"use"
]), Wy = gy(/* @__PURE__ */ "math.menclose.merror.mfenced.mfrac.mglyph.mi.mlabeledtr.mmultiscripts.mn.mo.mover.mpadded.mphantom.mroot.mrow.ms.mspace.msqrt.mstyle.msub.msup.msubsup.mtable.mtd.mtext.mtr.munder.munderover.mprescripts".split(".")), Gy = gy([
	"maction",
	"maligngroup",
	"malignmark",
	"mlongdiv",
	"mscarries",
	"mscarry",
	"msgroup",
	"mstack",
	"msline",
	"msrow",
	"semantics",
	"annotation",
	"annotation-xml",
	"mprescripts",
	"none"
]), Ky = gy(["#text"]), qy = gy(/* @__PURE__ */ "accept.action.align.alt.autocapitalize.autocomplete.autopictureinpicture.autoplay.background.bgcolor.border.capture.cellpadding.cellspacing.checked.cite.class.clear.color.cols.colspan.controls.controlslist.coords.crossorigin.datetime.decoding.default.dir.disabled.disablepictureinpicture.disableremoteplayback.download.draggable.enctype.enterkeyhint.exportparts.face.for.headers.height.hidden.high.href.hreflang.id.inert.inputmode.integrity.ismap.kind.label.lang.list.loading.loop.low.max.maxlength.media.method.min.minlength.multiple.muted.name.nonce.noshade.novalidate.nowrap.open.optimum.part.pattern.placeholder.playsinline.popover.popovertarget.popovertargetaction.poster.preload.pubdate.radiogroup.readonly.rel.required.rev.reversed.role.rows.rowspan.spellcheck.scope.selected.shape.size.sizes.slot.span.srclang.start.src.srcset.step.style.summary.tabindex.title.translate.type.usemap.valign.value.width.wrap.xmlns.slot".split(".")), Jy = gy(/* @__PURE__ */ "accent-height.accumulate.additive.alignment-baseline.amplitude.ascent.attributename.attributetype.azimuth.basefrequency.baseline-shift.begin.bias.by.class.clip.clippathunits.clip-path.clip-rule.color.color-interpolation.color-interpolation-filters.color-profile.color-rendering.cx.cy.d.dx.dy.diffuseconstant.direction.display.divisor.dur.edgemode.elevation.end.exponent.fill.fill-opacity.fill-rule.filter.filterunits.flood-color.flood-opacity.font-family.font-size.font-size-adjust.font-stretch.font-style.font-variant.font-weight.fx.fy.g1.g2.glyph-name.glyphref.gradientunits.gradienttransform.height.href.id.image-rendering.in.in2.intercept.k.k1.k2.k3.k4.kerning.keypoints.keysplines.keytimes.lang.lengthadjust.letter-spacing.kernelmatrix.kernelunitlength.lighting-color.local.marker-end.marker-mid.marker-start.markerheight.markerunits.markerwidth.maskcontentunits.maskunits.max.mask.mask-type.media.method.mode.min.name.numoctaves.offset.operator.opacity.order.orient.orientation.origin.overflow.paint-order.path.pathlength.patterncontentunits.patterntransform.patternunits.points.preservealpha.preserveaspectratio.primitiveunits.r.rx.ry.radius.refx.refy.repeatcount.repeatdur.restart.result.rotate.scale.seed.shape-rendering.slope.specularconstant.specularexponent.spreadmethod.startoffset.stddeviation.stitchtiles.stop-color.stop-opacity.stroke-dasharray.stroke-dashoffset.stroke-linecap.stroke-linejoin.stroke-miterlimit.stroke-opacity.stroke.stroke-width.style.surfacescale.systemlanguage.tabindex.tablevalues.targetx.targety.transform.transform-origin.text-anchor.text-decoration.text-rendering.textlength.type.u1.u2.unicode.values.viewbox.visibility.version.vert-adv-y.vert-origin-x.vert-origin-y.width.word-spacing.wrap.writing-mode.xchannelselector.ychannelselector.x.x1.x2.xmlns.y.y1.y2.z.zoomandpan".split(".")), Yy = gy(/* @__PURE__ */ "accent.accentunder.align.bevelled.close.columnsalign.columnlines.columnspan.denomalign.depth.dir.display.displaystyle.encoding.fence.frame.height.href.id.largeop.length.linethickness.lspace.lquote.mathbackground.mathcolor.mathsize.mathvariant.maxsize.minsize.movablelimits.notation.numalign.open.rowalign.rowlines.rowspacing.rowspan.rspace.rquote.scriptlevel.scriptminsize.scriptsizemultiplier.selection.separator.separators.stretchy.subscriptshift.supscriptshift.symmetric.voffset.width.xmlns".split(".")), Xy = gy([
	"xlink:href",
	"xml:id",
	"xlink:title",
	"xml:space",
	"xmlns:xlink"
]), Zy = _y(/\{\{[\w\W]*|[\w\W]*\}\}/gm), Qy = _y(/<%[\w\W]*|[\w\W]*%>/gm), $y = _y(/\$\{[\w\W]*/gm), eb = _y(/^data-[\-\w.\u00B7-\uFFFF]+$/), tb = _y(/^aria-[\-\w]+$/), nb = _y(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i), rb = _y(/^(?:\w+script|data):/i), ib = _y(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g), ab = _y(/^html$/i), ob = _y(/^[a-z][.\w]*(-[.\w]+)+$/i), sb = /*#__PURE__*/ Object.freeze({
	__proto__: null,
	ARIA_ATTR: tb,
	ATTR_WHITESPACE: ib,
	CUSTOM_ELEMENT: ob,
	DATA_ATTR: eb,
	DOCTYPE_NAME: ab,
	ERB_EXPR: Qy,
	IS_ALLOWED_URI: nb,
	IS_SCRIPT_OR_DATA: rb,
	MUSTACHE_EXPR: Zy,
	TMPLIT_EXPR: $y
}), cb = {
	element: 1,
	attribute: 2,
	text: 3,
	cdataSection: 4,
	entityReference: 5,
	entityNode: 6,
	progressingInstruction: 7,
	comment: 8,
	document: 9,
	documentType: 10,
	documentFragment: 11,
	notation: 12
}, lb = function() {
	return typeof window > "u" ? null : window;
}, ub = function(e, t) {
	if (typeof e != "object" || typeof e.createPolicy != "function") return null;
	let n = null, r = "data-tt-policy-suffix";
	t && t.hasAttribute(r) && (n = t.getAttribute(r));
	let i = "dompurify" + (n ? "#" + n : "");
	try {
		return e.createPolicy(i, {
			createHTML(e) {
				return e;
			},
			createScriptURL(e) {
				return e;
			}
		});
	} catch (e) {
		return console.warn("TrustedTypes policy " + i + " could not be created."), null;
	}
}, db = function() {
	return {
		afterSanitizeAttributes: [],
		afterSanitizeElements: [],
		afterSanitizeShadowDOM: [],
		beforeSanitizeAttributes: [],
		beforeSanitizeElements: [],
		beforeSanitizeShadowDOM: [],
		uponSanitizeAttribute: [],
		uponSanitizeElement: [],
		uponSanitizeShadowNode: []
	};
};
function fb() {
	let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : lb(), t = (e) => fb(e);
	if (t.version = "3.3.3", t.removed = [], !e || !e.document || e.document.nodeType !== cb.document || !e.Element) return t.isSupported = !1, t;
	let { document: n } = e, r = n, i = r.currentScript, { DocumentFragment: a, HTMLTemplateElement: o, Node: s, Element: c, NodeFilter: l, NamedNodeMap: u = e.NamedNodeMap || e.MozNamedAttrMap, HTMLFormElement: d, DOMParser: f, trustedTypes: p } = e, m = c.prototype, h = zy(m, "cloneNode"), g = zy(m, "remove"), _ = zy(m, "nextSibling"), v = zy(m, "childNodes"), y = zy(m, "parentNode");
	if (typeof o == "function") {
		let e = n.createElement("template");
		e.content && e.content.ownerDocument && (n = e.content.ownerDocument);
	}
	let b, x = "", { implementation: S, createNodeIterator: ee, createDocumentFragment: te, getElementsByTagName: ne } = n, { importNode: re } = r, C = db();
	t.isSupported = typeof dy == "function" && typeof y == "function" && S && S.createHTMLDocument !== void 0;
	let { MUSTACHE_EXPR: ie, ERB_EXPR: ae, TMPLIT_EXPR: w, DATA_ATTR: oe, ARIA_ATTR: se, IS_SCRIPT_OR_DATA: T, ATTR_WHITESPACE: ce, CUSTOM_ELEMENT: le } = sb, { IS_ALLOWED_URI: ue } = sb, E = null, de = Y({}, [
		...By,
		...Vy,
		...Hy,
		...Wy,
		...Ky
	]), D = null, fe = Y({}, [
		...qy,
		...Jy,
		...Yy,
		...Xy
	]), O = Object.seal(vy(null, {
		tagNameCheck: {
			writable: !0,
			configurable: !1,
			enumerable: !0,
			value: null
		},
		attributeNameCheck: {
			writable: !0,
			configurable: !1,
			enumerable: !0,
			value: null
		},
		allowCustomizedBuiltInElements: {
			writable: !0,
			configurable: !1,
			enumerable: !0,
			value: !1
		}
	})), pe = null, me = null, he = Object.seal(vy(null, {
		tagCheck: {
			writable: !0,
			configurable: !1,
			enumerable: !0,
			value: null
		},
		attributeCheck: {
			writable: !0,
			configurable: !1,
			enumerable: !0,
			value: null
		}
	})), ge = !0, _e = !0, ve = !1, ye = !0, be = !1, xe = !0, Se = !1, Ce = !1, we = !1, Te = !1, Ee = !1, De = !1, Oe = !0, ke = !1, Ae = !0, je = !1, Me = {}, Ne = null, Pe = Y({}, [
		"annotation-xml",
		"audio",
		"colgroup",
		"desc",
		"foreignobject",
		"head",
		"iframe",
		"math",
		"mi",
		"mn",
		"mo",
		"ms",
		"mtext",
		"noembed",
		"noframes",
		"noscript",
		"plaintext",
		"script",
		"style",
		"svg",
		"template",
		"thead",
		"title",
		"video",
		"xmp"
	]), Fe = null, Ie = Y({}, [
		"audio",
		"video",
		"img",
		"source",
		"image",
		"track"
	]), Le = null, Re = Y({}, [
		"alt",
		"class",
		"for",
		"id",
		"label",
		"name",
		"pattern",
		"placeholder",
		"role",
		"summary",
		"title",
		"value",
		"style",
		"xmlns"
	]), ze = "http://www.w3.org/1998/Math/MathML", Be = "http://www.w3.org/2000/svg", Ve = "http://www.w3.org/1999/xhtml", He = Ve, Ue = !1, We = null, Ge = Y({}, [
		ze,
		Be,
		Ve
	], Dy), Ke = Y({}, [
		"mi",
		"mo",
		"mn",
		"ms",
		"mtext"
	]), qe = Y({}, ["annotation-xml"]), Je = Y({}, [
		"title",
		"style",
		"font",
		"a",
		"script"
	]), Ye = null, Xe = ["application/xhtml+xml", "text/html"], k = null, Ze = null, Qe = n.createElement("form"), $e = function(e) {
		return e instanceof RegExp || e instanceof Function;
	}, et = function() {
		let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
		if (!(Ze && Ze === e)) {
			if ((!e || typeof e != "object") && (e = {}), e = Ry(e), Ye = Xe.indexOf(e.PARSER_MEDIA_TYPE) === -1 ? "text/html" : e.PARSER_MEDIA_TYPE, k = Ye === "application/xhtml+xml" ? Dy : Ey, E = My(e, "ALLOWED_TAGS") ? Y({}, e.ALLOWED_TAGS, k) : de, D = My(e, "ALLOWED_ATTR") ? Y({}, e.ALLOWED_ATTR, k) : fe, We = My(e, "ALLOWED_NAMESPACES") ? Y({}, e.ALLOWED_NAMESPACES, Dy) : Ge, Le = My(e, "ADD_URI_SAFE_ATTR") ? Y(Ry(Re), e.ADD_URI_SAFE_ATTR, k) : Re, Fe = My(e, "ADD_DATA_URI_TAGS") ? Y(Ry(Ie), e.ADD_DATA_URI_TAGS, k) : Ie, Ne = My(e, "FORBID_CONTENTS") ? Y({}, e.FORBID_CONTENTS, k) : Pe, pe = My(e, "FORBID_TAGS") ? Y({}, e.FORBID_TAGS, k) : Ry({}), me = My(e, "FORBID_ATTR") ? Y({}, e.FORBID_ATTR, k) : Ry({}), Me = My(e, "USE_PROFILES") ? e.USE_PROFILES : !1, ge = e.ALLOW_ARIA_ATTR !== !1, _e = e.ALLOW_DATA_ATTR !== !1, ve = e.ALLOW_UNKNOWN_PROTOCOLS || !1, ye = e.ALLOW_SELF_CLOSE_IN_ATTR !== !1, be = e.SAFE_FOR_TEMPLATES || !1, xe = e.SAFE_FOR_XML !== !1, Se = e.WHOLE_DOCUMENT || !1, Te = e.RETURN_DOM || !1, Ee = e.RETURN_DOM_FRAGMENT || !1, De = e.RETURN_TRUSTED_TYPE || !1, we = e.FORCE_BODY || !1, Oe = e.SANITIZE_DOM !== !1, ke = e.SANITIZE_NAMED_PROPS || !1, Ae = e.KEEP_CONTENT !== !1, je = e.IN_PLACE || !1, ue = e.ALLOWED_URI_REGEXP || nb, He = e.NAMESPACE || Ve, Ke = e.MATHML_TEXT_INTEGRATION_POINTS || Ke, qe = e.HTML_INTEGRATION_POINTS || qe, O = e.CUSTOM_ELEMENT_HANDLING || {}, e.CUSTOM_ELEMENT_HANDLING && $e(e.CUSTOM_ELEMENT_HANDLING.tagNameCheck) && (O.tagNameCheck = e.CUSTOM_ELEMENT_HANDLING.tagNameCheck), e.CUSTOM_ELEMENT_HANDLING && $e(e.CUSTOM_ELEMENT_HANDLING.attributeNameCheck) && (O.attributeNameCheck = e.CUSTOM_ELEMENT_HANDLING.attributeNameCheck), e.CUSTOM_ELEMENT_HANDLING && typeof e.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements == "boolean" && (O.allowCustomizedBuiltInElements = e.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements), be && (_e = !1), Ee && (Te = !0), Me && (E = Y({}, Ky), D = vy(null), Me.html === !0 && (Y(E, By), Y(D, qy)), Me.svg === !0 && (Y(E, Vy), Y(D, Jy), Y(D, Xy)), Me.svgFilters === !0 && (Y(E, Hy), Y(D, Jy), Y(D, Xy)), Me.mathMl === !0 && (Y(E, Wy), Y(D, Yy), Y(D, Xy))), My(e, "ADD_TAGS") || (he.tagCheck = null), My(e, "ADD_ATTR") || (he.attributeCheck = null), e.ADD_TAGS && (typeof e.ADD_TAGS == "function" ? he.tagCheck = e.ADD_TAGS : (E === de && (E = Ry(E)), Y(E, e.ADD_TAGS, k))), e.ADD_ATTR && (typeof e.ADD_ATTR == "function" ? he.attributeCheck = e.ADD_ATTR : (D === fe && (D = Ry(D)), Y(D, e.ADD_ATTR, k))), e.ADD_URI_SAFE_ATTR && Y(Le, e.ADD_URI_SAFE_ATTR, k), e.FORBID_CONTENTS && (Ne === Pe && (Ne = Ry(Ne)), Y(Ne, e.FORBID_CONTENTS, k)), e.ADD_FORBID_CONTENTS && (Ne === Pe && (Ne = Ry(Ne)), Y(Ne, e.ADD_FORBID_CONTENTS, k)), Ae && (E["#text"] = !0), Se && Y(E, [
				"html",
				"head",
				"body"
			]), E.table && (Y(E, ["tbody"]), delete pe.tbody), e.TRUSTED_TYPES_POLICY) {
				if (typeof e.TRUSTED_TYPES_POLICY.createHTML != "function") throw Py("TRUSTED_TYPES_POLICY configuration option must provide a \"createHTML\" hook.");
				if (typeof e.TRUSTED_TYPES_POLICY.createScriptURL != "function") throw Py("TRUSTED_TYPES_POLICY configuration option must provide a \"createScriptURL\" hook.");
				b = e.TRUSTED_TYPES_POLICY, x = b.createHTML("");
			} else b === void 0 && (b = ub(p, i)), b !== null && typeof x == "string" && (x = b.createHTML(""));
			gy && gy(e), Ze = e;
		}
	}, tt = Y({}, [
		...Vy,
		...Hy,
		...Uy
	]), nt = Y({}, [...Wy, ...Gy]), rt = function(e) {
		let t = y(e);
		(!t || !t.tagName) && (t = {
			namespaceURI: He,
			tagName: "template"
		});
		let n = Ey(e.tagName), r = Ey(t.tagName);
		return We[e.namespaceURI] ? e.namespaceURI === Be ? t.namespaceURI === Ve ? n === "svg" : t.namespaceURI === ze ? n === "svg" && (r === "annotation-xml" || Ke[r]) : !!tt[n] : e.namespaceURI === ze ? t.namespaceURI === Ve ? n === "math" : t.namespaceURI === Be ? n === "math" && qe[r] : !!nt[n] : e.namespaceURI === Ve ? t.namespaceURI === Be && !qe[r] || t.namespaceURI === ze && !Ke[r] ? !1 : !nt[n] && (Je[n] || !tt[n]) : !!(Ye === "application/xhtml+xml" && We[e.namespaceURI]) : !1;
	}, it = function(e) {
		wy(t.removed, { element: e });
		try {
			y(e).removeChild(e);
		} catch (t) {
			g(e);
		}
	}, at = function(e, n) {
		try {
			wy(t.removed, {
				attribute: n.getAttributeNode(e),
				from: n
			});
		} catch (e) {
			wy(t.removed, {
				attribute: null,
				from: n
			});
		}
		if (n.removeAttribute(e), e === "is") {
			if (Te || Ee) try {
				it(n);
			} catch (e) {}
			else try {
				n.setAttribute(e, "");
			} catch (e) {}
		}
	}, ot = function(e) {
		let t = null, r = null;
		if (we) e = "<remove></remove>" + e;
		else {
			let t = Oy(e, /^[\r\n\t ]+/);
			r = t && t[0];
		}
		Ye === "application/xhtml+xml" && He === Ve && (e = "<html xmlns=\"http://www.w3.org/1999/xhtml\"><head></head><body>" + e + "</body></html>");
		let i = b ? b.createHTML(e) : e;
		if (He === Ve) try {
			t = new f().parseFromString(i, Ye);
		} catch (e) {}
		if (!t || !t.documentElement) {
			t = S.createDocument(He, "template", null);
			try {
				t.documentElement.innerHTML = Ue ? x : i;
			} catch (e) {}
		}
		let a = t.body || t.documentElement;
		return e && r && a.insertBefore(n.createTextNode(r), a.childNodes[0] || null), He === Ve ? ne.call(t, Se ? "html" : "body")[0] : Se ? t.documentElement : a;
	}, st = function(e) {
		return ee.call(e.ownerDocument || e, e, l.SHOW_ELEMENT | l.SHOW_COMMENT | l.SHOW_TEXT | l.SHOW_PROCESSING_INSTRUCTION | l.SHOW_CDATA_SECTION, null);
	}, ct = function(e) {
		return e instanceof d && (typeof e.nodeName != "string" || typeof e.textContent != "string" || typeof e.removeChild != "function" || !(e.attributes instanceof u) || typeof e.removeAttribute != "function" || typeof e.setAttribute != "function" || typeof e.namespaceURI != "string" || typeof e.insertBefore != "function" || typeof e.hasChildNodes != "function");
	}, lt = function(e) {
		return typeof s == "function" && e instanceof s;
	};
	function ut(e, n, r) {
		xy(e, (e) => {
			e.call(t, n, r, Ze);
		});
	}
	let dt = function(e) {
		let n = null;
		if (ut(C.beforeSanitizeElements, e, null), ct(e)) return it(e), !0;
		let r = k(e.nodeName);
		if (ut(C.uponSanitizeElement, e, {
			tagName: r,
			allowedTags: E
		}), xe && e.hasChildNodes() && !lt(e.firstElementChild) && Ny(/<[/\w!]/g, e.innerHTML) && Ny(/<[/\w!]/g, e.textContent) || e.nodeType === cb.progressingInstruction || xe && e.nodeType === cb.comment && Ny(/<[/\w]/g, e.data)) return it(e), !0;
		if (!(he.tagCheck instanceof Function && he.tagCheck(r)) && (!E[r] || pe[r])) {
			if (!pe[r] && pt(r) && (O.tagNameCheck instanceof RegExp && Ny(O.tagNameCheck, r) || O.tagNameCheck instanceof Function && O.tagNameCheck(r))) return !1;
			if (Ae && !Ne[r]) {
				let t = y(e) || e.parentNode, n = v(e) || e.childNodes;
				if (n && t) {
					let r = n.length;
					for (let i = r - 1; i >= 0; --i) {
						let r = h(n[i], !0);
						r.__removalCount = (e.__removalCount || 0) + 1, t.insertBefore(r, _(e));
					}
				}
			}
			return it(e), !0;
		}
		return e instanceof c && !rt(e) || (r === "noscript" || r === "noembed" || r === "noframes") && Ny(/<\/no(script|embed|frames)/i, e.innerHTML) ? (it(e), !0) : (be && e.nodeType === cb.text && (n = e.textContent, xy([
			ie,
			ae,
			w
		], (e) => {
			n = ky(n, e, " ");
		}), e.textContent !== n && (wy(t.removed, { element: e.cloneNode() }), e.textContent = n)), ut(C.afterSanitizeElements, e, null), !1);
	}, ft = function(e, t, r) {
		if (me[t] || Oe && (t === "id" || t === "name") && (r in n || r in Qe)) return !1;
		if (!(_e && !me[t] && Ny(oe, t)) && !(ge && Ny(se, t)) && !(he.attributeCheck instanceof Function && he.attributeCheck(t, e))) {
			if (!D[t] || me[t]) {
				if (!(pt(e) && (O.tagNameCheck instanceof RegExp && Ny(O.tagNameCheck, e) || O.tagNameCheck instanceof Function && O.tagNameCheck(e)) && (O.attributeNameCheck instanceof RegExp && Ny(O.attributeNameCheck, t) || O.attributeNameCheck instanceof Function && O.attributeNameCheck(t, e)) || t === "is" && O.allowCustomizedBuiltInElements && (O.tagNameCheck instanceof RegExp && Ny(O.tagNameCheck, r) || O.tagNameCheck instanceof Function && O.tagNameCheck(r)))) return !1;
			} else if (!Le[t] && !Ny(ue, ky(r, ce, "")) && !((t === "src" || t === "xlink:href" || t === "href") && e !== "script" && Ay(r, "data:") === 0 && Fe[e]) && !(ve && !Ny(T, ky(r, ce, ""))) && r) return !1;
		}
		return !0;
	}, pt = function(e) {
		return e !== "annotation-xml" && Oy(e, le);
	}, mt = function(e) {
		ut(C.beforeSanitizeAttributes, e, null);
		let { attributes: n } = e;
		if (!n || ct(e)) return;
		let r = {
			attrName: "",
			attrValue: "",
			keepAttr: !0,
			allowedAttributes: D,
			forceKeepAttr: void 0
		}, i = n.length;
		for (; i--;) {
			let { name: a, namespaceURI: o, value: s } = n[i], c = k(a), l = s, u = a === "value" ? l : jy(l);
			if (r.attrName = c, r.attrValue = u, r.keepAttr = !0, r.forceKeepAttr = void 0, ut(C.uponSanitizeAttribute, e, r), u = r.attrValue, ke && (c === "id" || c === "name") && (at(a, e), u = "user-content-" + u), xe && Ny(/((--!?|])>)|<\/(style|script|title|xmp|textarea|noscript|iframe|noembed|noframes)/i, u)) {
				at(a, e);
				continue;
			}
			if (c === "attributename" && Oy(u, "href")) {
				at(a, e);
				continue;
			}
			if (r.forceKeepAttr) continue;
			if (!r.keepAttr) {
				at(a, e);
				continue;
			}
			if (!ye && Ny(/\/>/i, u)) {
				at(a, e);
				continue;
			}
			be && xy([
				ie,
				ae,
				w
			], (e) => {
				u = ky(u, e, " ");
			});
			let d = k(e.nodeName);
			if (!ft(d, c, u)) {
				at(a, e);
				continue;
			}
			if (b && typeof p == "object" && typeof p.getAttributeType == "function" && !o) switch (p.getAttributeType(d, c)) {
				case "TrustedHTML":
					u = b.createHTML(u);
					break;
				case "TrustedScriptURL": u = b.createScriptURL(u);
			}
			if (u !== l) try {
				o ? e.setAttributeNS(o, a, u) : e.setAttribute(a, u), ct(e) ? it(e) : Cy(t.removed);
			} catch (t) {
				at(a, e);
			}
		}
		ut(C.afterSanitizeAttributes, e, null);
	}, ht = function e(t) {
		let n = null, r = st(t);
		for (ut(C.beforeSanitizeShadowDOM, t, null); n = r.nextNode();) ut(C.uponSanitizeShadowNode, n, null), dt(n), mt(n), n.content instanceof a && e(n.content);
		ut(C.afterSanitizeShadowDOM, t, null);
	};
	return t.sanitize = function(e) {
		let n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, i = null, o = null, c = null, l = null;
		if (Ue = !e, Ue && (e = "<!-->"), typeof e != "string" && !lt(e)) {
			if (typeof e.toString == "function") {
				if (e = e.toString(), typeof e != "string") throw Py("dirty is not a string, aborting");
			} else throw Py("toString is not a function");
		}
		if (!t.isSupported) return e;
		if (Ce || et(n), t.removed = [], typeof e == "string" && (je = !1), je) {
			if (e.nodeName) {
				let t = k(e.nodeName);
				if (!E[t] || pe[t]) throw Py("root node is forbidden and cannot be sanitized in-place");
			}
		} else if (e instanceof s) i = ot("<!---->"), o = i.ownerDocument.importNode(e, !0), o.nodeType === cb.element && o.nodeName === "BODY" || o.nodeName === "HTML" ? i = o : i.appendChild(o);
		else {
			if (!Te && !be && !Se && e.indexOf("<") === -1) return b && De ? b.createHTML(e) : e;
			if (i = ot(e), !i) return Te ? null : De ? x : "";
		}
		i && we && it(i.firstChild);
		let u = st(je ? e : i);
		for (; c = u.nextNode();) dt(c), mt(c), c.content instanceof a && ht(c.content);
		if (je) return e;
		if (Te) {
			if (Ee) for (l = te.call(i.ownerDocument); i.firstChild;) l.appendChild(i.firstChild);
			else l = i;
			return (D.shadowroot || D.shadowrootmode) && (l = re.call(r, l, !0)), l;
		}
		let d = Se ? i.outerHTML : i.innerHTML;
		return Se && E["!doctype"] && i.ownerDocument && i.ownerDocument.doctype && i.ownerDocument.doctype.name && Ny(ab, i.ownerDocument.doctype.name) && (d = "<!DOCTYPE " + i.ownerDocument.doctype.name + ">\n" + d), be && xy([
			ie,
			ae,
			w
		], (e) => {
			d = ky(d, e, " ");
		}), b && De ? b.createHTML(d) : d;
	}, t.setConfig = function() {
		let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
		et(e), Ce = !0;
	}, t.clearConfig = function() {
		Ze = null, Ce = !1;
	}, t.isValidAttribute = function(e, t, n) {
		Ze || et({});
		let r = k(e), i = k(t);
		return ft(r, i, n);
	}, t.addHook = function(e, t) {
		typeof t == "function" && wy(C[e], t);
	}, t.removeHook = function(e, t) {
		if (t !== void 0) {
			let n = Sy(C[e], t);
			return n === -1 ? void 0 : Ty(C[e], n, 1)[0];
		}
		return Cy(C[e]);
	}, t.removeHooks = function(e) {
		C[e] = [];
	}, t.removeAllHooks = function() {
		C = db();
	}, t;
}
var pb = fb(), mb = ["iframe", "embed"], hb = [];
function gb(e) {
	L(mb, e) && hb.push(e.toLowerCase());
}
function _b(e, t) {
	return pb.sanitize(e, F({
		ADD_TAGS: hb,
		ADD_ATTR: [
			"rel",
			"target",
			"hreflang",
			"type"
		],
		FORBID_TAGS: [
			"input",
			"script",
			"textarea",
			"form",
			"button",
			"select",
			"meta",
			"style",
			"link",
			"title",
			"object",
			"base"
		]
	}, t));
}
function vb(e, t) {
	return e.literal.replace(RegExp(`(<\\s*${t}[^>]*>)|(</${t}\\s*[>])`, "ig"), "").trim();
}
function yb(e) {
	e = e.match(Pd)[0];
	var t = e.match(new RegExp(jd, "g"));
	return t ? t.reduce(function(e, t) {
		var n = t.trim().split("="), r = n[0], i = n.slice(1);
		return i.length && (e[r] = i.join("=").replace(/'|"/g, "").trim()), e;
	}, {}) : {};
}
function bb(e) {
	return Ru(e.attributes).reduce(function(e, t) {
		return e[t.nodeName] = t.nodeValue, e;
	}, {});
}
function xb(e, t, n, r) {
	var i = r.getToDOMNode(t)(e), a = n(i.outerHTML), o = document.createElement("div");
	o.innerHTML = a, i = o.firstChild;
	var s = bb(i);
	return {
		dom: i,
		htmlAttrs: s
	};
}
var Sb = {
	htmlBlock: function(e, t, n) {
		return {
			atom: !0,
			content: "block+",
			group: "block",
			attrs: {
				htmlAttrs: { default: {} },
				childrenHTML: { default: "" },
				htmlBlock: { default: !0 }
			},
			parseDOM: [{
				tag: e,
				getAttrs: function(e) {
					return {
						htmlAttrs: bb(e),
						childrenHTML: e.innerHTML
					};
				}
			}],
			toDOM: function(r) {
				var i = xb(r, e, t, n), a = i.dom, o = i.htmlAttrs;
				return o.class = o.class ? `${o.class} html-block` : "html-block", rl([e, o], Ru(a.childNodes), !0);
			}
		};
	},
	htmlInline: function(e, t, n) {
		return {
			attrs: {
				htmlAttrs: { default: {} },
				htmlInline: { default: !0 }
			},
			parseDOM: [{
				tag: e,
				getAttrs: function(e) {
					return { htmlAttrs: bb(e) };
				}
			}],
			toDOM: function(r) {
				return [
					e,
					xb(r, e, t, n).htmlAttrs,
					0
				];
			}
		};
	}
};
function Cb(e, t, n) {
	var r = {
		nodes: {},
		marks: {}
	};
	return ["htmlBlock", "htmlInline"].forEach(function(i) {
		e[i] && Object.keys(e[i]).forEach(function(e) {
			var a = i === "htmlBlock" ? "nodes" : "marks";
			gb(e), r[a][e] = Sb[i](e, t, n);
		});
	}), r;
}
var wb = /^\s*<\s*\//, Tb = {
	paragraph: function(e, t) {
		var n = t.entering, r = t.origin;
		return t.options.nodeId ? {
			type: n ? "openTag" : "closeTag",
			outerNewLine: !0,
			tagName: "p"
		} : r();
	},
	softbreak: function(e) {
		return {
			type: "html",
			content: e.prev && e.prev.type === "htmlInline" && /<br ?\/?>/.test(e.prev.literal) ? "\n" : "<br>\n"
		};
	},
	item: function(e, t) {
		if (t.entering) {
			var n = {}, r = [];
			return e.listData.task && (n["data-task"] = "", r.push("task-list-item"), e.listData.checked && (r.push("checked"), n["data-task-checked"] = "")), {
				type: "openTag",
				tagName: "li",
				classNames: r,
				attributes: n,
				outerNewLine: !0
			};
		}
		return {
			type: "closeTag",
			tagName: "li",
			outerNewLine: !0
		};
	},
	code: function(e) {
		return [
			{
				type: "openTag",
				tagName: "code",
				attributes: { "data-backticks": String(e.tickCount) }
			},
			{
				type: "text",
				content: e.literal
			},
			{
				type: "closeTag",
				tagName: "code"
			}
		];
	},
	codeBlock: function(e) {
		var t = e, n = t.fenceLength, r = t.info, i = r ? r.split(/\s+/) : [], a = [], o = {};
		if (n > 3 && (o["data-backticks"] = n), i.length > 0 && i[0].length > 0) {
			var s = i[0];
			a.push(`lang-${s}`), o["data-language"] = s;
		}
		return [
			{
				type: "openTag",
				tagName: "pre",
				classNames: a
			},
			{
				type: "openTag",
				tagName: "code",
				attributes: o
			},
			{
				type: "text",
				content: e.literal
			},
			{
				type: "closeTag",
				tagName: "code"
			},
			{
				type: "closeTag",
				tagName: "pre"
			}
		];
	},
	customInline: function(e, t) {
		var n = t.origin, r = t.entering, i = t.skipChildren, a = e.info;
		return a.indexOf("widget") !== -1 && r ? (i(), [
			{
				type: "openTag",
				tagName: "span",
				classNames: ["tui-widget"]
			},
			{
				type: "html",
				content: fd(a, _d(e)).outerHTML
			},
			{
				type: "closeTag",
				tagName: "span"
			}
		]) : n();
	}
};
function Eb(e, t) {
	var n = F({}, Tb);
	return e && (n.link = function(t, n) {
		var r = n.entering, i = n.origin, a = i();
		return r && (a.attributes = F(F({}, a.attributes), e)), a;
	}), t && Object.keys(t).forEach(function(e) {
		var r = n[e], i = t[e];
		n[e] = r && hf(i) ? function(e, t) {
			var n = F({}, t);
			return n.origin = function() {
				return r(e, t);
			}, i(e, n);
		} : L(["htmlBlock", "htmlInline"], e) && !hf(i) ? function(e, t) {
			var n = e.literal.match(Pd);
			if (n) {
				var r = n[0], a = n[1], o = n[3], s = (a || o).toLowerCase(), c = i[s], l = vb(e, s);
				if (c) {
					var u = F({}, e);
					return u.attrs = yb(r), u.childrenHTML = l, u.type = s, t.entering = !wb.test(e.literal), c(u, t);
				}
			}
			return t.origin();
		} : i;
	}), n;
}
var Db = [
	"list",
	"item",
	"blockQuote"
], Ob = [
	"UL",
	"OL",
	"BLOCKQUOTE"
];
function kb(e, t) {
	var n, r = e.child(t);
	return !r.childCount || r.childCount === 1 && !((n = r.firstChild.text) != null && n.trim());
}
function Ab(e, t, n) {
	var r = Uu(t) - 1, i = Wu(t) - 1, a = n[r].getBoundingClientRect(), o = n[i].offsetTop - n[r].offsetTop + n[i].clientHeight;
	return {
		height: o <= 0 ? n[r].clientHeight : o + jb(e, n, Math.min(i + 1, e.childCount - 1)),
		rect: a
	};
}
function jb(e, t, n) {
	for (var r = e.childCount - 1, i = 0; n <= r && kb(e, n);) i += t[n].clientHeight, n += 1;
	return i;
}
function Mb(e, t) {
	for (; !e.getAttribute("data-nodeid") && e.parentElement !== t;) e = e.parentElement;
	return e;
}
function Nb(e, t) {
	for (var n = 0; e && e !== t && (L(Ob, e.tagName) || (n += e.offsetTop), e.offsetParent !== t.offsetParent);) e = e.parentElement;
	return n;
}
function Pb(e, t) {
	for (var n = t, r = null; n;) {
		var i = n.firstElementChild;
		if (!i) break;
		var a = Fb(i, e, Nb(n, t));
		r = n, n = a;
	}
	var o = n || r;
	return o === t ? null : o;
}
function Fb(e, t, n) {
	return e && t > n + e.offsetTop ? Fb(e.nextElementSibling, t, n) || e : null;
}
function Ib(e, t, n, r) {
	return Math.min((e - t) / n, 1) * r;
}
function Lb(e, t) {
	for (var n = e.querySelector(`[data-nodeid="${t.id}"]`); !n || Ju(t);) t = t.parent, n = e.querySelector(`[data-nodeid="${t.id}"]`);
	return Rb({
		mdNode: t,
		el: n
	});
}
function Rb(e) {
	for (var t = e.mdNode, n = e.el; (L(Db, t.type) || t.type === "table") && t.firstChild;) t = t.firstChild, n = n.firstElementChild;
	return {
		mdNode: t,
		el: n
	};
}
var zb = {};
function Bb(e, t) {
	zb[e] = zb[e] || {}, zb[e].height = t;
}
function Vb(e, t) {
	zb[e] = zb[e] || {}, zb[e].offsetTop = t;
}
function Hb(e) {
	return zb[e] && zb[e].height;
}
function Ub(e) {
	return zb[e] && zb[e].offsetTop;
}
function Wb(e) {
	e && (delete zb[Number(e.getAttribute("data-nodeid"))], Ru(e.children).forEach(function(e) {
		Wb(e);
	}));
}
function Gb(e, t, n) {
	var r = Hb(n), i = Ub(n), a = r || e.clientHeight, o = i || Nb(e, t) || e.offsetTop;
	return r || Bb(n, a), i || Vb(n, o), {
		nodeHeight: a,
		offsetTop: o
	};
}
var Kb = V("md-preview-highlight");
function qb(e, t) {
	for (var n = e.firstChild; n && n.next && !(Gu(n.next) > t + 1);) n = n.next;
	return n;
}
var Jb = function() {
	function e(e, t) {
		var n = document.createElement("div");
		this.el = n, this.eventEmitter = e, this.isViewer = !!t.isViewer, this.el.className = V("md-preview");
		var r = t.linkAttributes, i = t.customHTMLRenderer, a = t.sanitizer, o = t.highlight, s = o !== void 0 && o;
		this.renderer = new uy({
			gfm: !0,
			nodeId: !0,
			convertors: Eb(r, i)
		}), this.cursorNodeId = null, this.sanitizer = a, this.initEvent(s), this.initContentSection(), this.isViewer && (this.previewContent.style.overflowWrap = "break-word");
	}
	return e.prototype.initContentSection = function() {
		this.previewContent = Jd(`<div class="${V("contents")}"></div>`), this.isViewer || this.el.appendChild(this.previewContent);
	}, e.prototype.toggleActive = function(e) {
		qd(this.el, "active", e);
	}, e.prototype.initEvent = function(e) {
		var t = this;
		this.eventEmitter.listen("updatePreview", this.update.bind(this)), !this.isViewer && (e && (this.eventEmitter.listen("changeToolbarState", function(e) {
			var n = e.mdNode, r = e.cursorPos;
			t.updateCursorNode(n, r);
		}), this.eventEmitter.listen("blur", function() {
			t.removeHighlight();
		})), Qm(this.el, "scroll", function(e) {
			t.eventEmitter.emit("scroll", "preview", Pb(e.target.scrollTop, t.previewContent));
		}), this.eventEmitter.listen("changePreviewTabPreview", function() {
			return t.toggleActive(!0);
		}), this.eventEmitter.listen("changePreviewTabWrite", function() {
			return t.toggleActive(!1);
		}));
	}, e.prototype.removeHighlight = function() {
		if (this.cursorNodeId) {
			var e = this.getElementByNodeId(this.cursorNodeId);
			e && Kl(e, Kb);
		}
	}, e.prototype.updateCursorNode = function(e, t) {
		e && (e = td(e, function(e) {
			return !ed(e);
		}), e.type === "tableRow" ? e = qb(e, t[1]) : e.type === "tableBody" && (e = null));
		var n = e ? e.id : null;
		if (this.cursorNodeId !== n) {
			var r = this.getElementByNodeId(this.cursorNodeId), i = this.getElementByNodeId(n);
			r && Kl(r, Kb), i && Bl(i, Kb), this.cursorNodeId = n;
		}
	}, e.prototype.getElementByNodeId = function(e) {
		return e ? this.previewContent.querySelector(`[data-nodeid="${e}"]`) : null;
	}, e.prototype.update = function(e) {
		var t = this;
		e.forEach(function(e) {
			return t.replaceRangeNodes(e);
		}), this.eventEmitter.emit("afterPreviewRender", this);
	}, e.prototype.replaceRangeNodes = function(e) {
		var t = this, n = e.nodes, r = e.removedNodeRange, i = this.previewContent, a = this.eventEmitter.emitReduce("beforePreviewRender", this.sanitizer(n.map(function(e) {
			return t.renderer.render(e);
		}).join("")));
		if (!r) i.insertAdjacentHTML("afterbegin", a);
		else {
			var o = r.id, s = o[0], c = o[1], l = this.getElementByNodeId(s), u = this.getElementByNodeId(c);
			if (l) {
				l.insertAdjacentHTML("beforebegin", a);
				for (var d = l; d && d !== u;) {
					var f = d.nextElementSibling;
					Gd(d), Wb(d), d = f;
				}
				d != null && d.parentNode && (Gd(d), Wb(d));
			}
		}
	}, e.prototype.getRenderer = function() {
		return this.renderer;
	}, e.prototype.destroy = function() {
		Gm(this.el, "scroll"), this.el = null;
	}, e.prototype.getElement = function() {
		return this.el;
	}, e.prototype.getHTML = function() {
		return ef(this.previewContent.innerHTML);
	}, e.prototype.setHTML = function(e) {
		this.previewContent.innerHTML = e;
	}, e.prototype.setHeight = function(e) {
		Sl(this.el, { height: `${e}px` });
	}, e.prototype.setMinHeight = function(e) {
		Sl(this.el, { minHeight: `${e}px` });
	}, e;
}();
function Yb(e, t) {
	for (var n = e.depth; n;) {
		var r = e.node(n);
		if (t(r, n)) return {
			node: r,
			depth: n,
			offset: n > 0 ? e.before(n) : 0
		};
		--n;
	}
	return null;
}
function Xb(e) {
	return !!Yb(e, function(e) {
		var t = e.type;
		return t.name === "listItem" || t.name === "bulletList" || t.name === "orderedList";
	});
}
function Zb(e) {
	return !!Yb(e, function(e) {
		var t = e.type;
		return t.name === "tableHeadCell" || t.name === "tableBodyCell";
	});
}
function Qb(e) {
	return Yb(e, function(e) {
		return e.type.name === "listItem";
	});
}
function $b(e) {
	return {
		tag: e,
		getAttrs: function(e) {
			var t = e.getAttribute("data-raw-html");
			return F({}, t && { rawHTML: t });
		}
	};
}
function ex(e) {
	return Object.keys(e).reduce(function(t, n) {
		return n !== "rawHTML" && e[n] && (n = n === "className" ? "class" : n, t[n] = e[n]), t;
	}, {});
}
function tx(e) {
	return {
		tag: e,
		getAttrs: function(e) {
			return [
				"rawHTML",
				"colspan",
				"rowspan",
				"extended"
			].reduce(function(t, n) {
				var r = n === "rawHTML" ? "data-raw-html" : n, i = e.getAttribute(r);
				return i && (t[n] = L(["rawHTML", "extended"], n) ? i : Number(i)), t;
			}, {});
		}
	};
}
function X() {
	return {
		htmlAttrs: { default: null },
		classNames: { default: null }
	};
}
function Z(e) {
	var t = e.htmlAttrs, n = e.classNames;
	return F(F({}, t), { class: n ? n.join(" ") : null });
}
function nx(e, t) {
	var n = e.parent, r = e.startIndex, i = e.endIndex, a = n.contentMatchAt(r).findWrapping(t);
	if (a) {
		var o = a.length ? a[0] : t;
		return n.canReplaceWith(r, i, o) ? a : null;
	}
	return null;
}
function rx(e, t) {
	var n = e.parent, r = e.startIndex, i = e.endIndex, a = n.child(r), o = t.contentMatch.findWrapping(a.type);
	if (o) {
		for (var s = (o.length ? o[o.length - 1] : t).contentMatch, c = r; s && c < i; c += 1) s = s.matchType(n.child(c).type);
		if (s && s.validEnd) return o;
	}
	return null;
}
function ix(e, t, n, r) {
	var i = nx(e, n), a = rx(t, n);
	if (i && a) {
		var o = i.map(function(e) {
			return { type: e };
		}), s = a.map(function(e) {
			return {
				type: e,
				attrs: r
			};
		});
		return o.concat({ type: n }).concat(s);
	}
	return null;
}
function ax(e, t, n, r, i) {
	for (var a = t.start, o = t.end, s = t.startIndex, c = t.endIndex, l = t.parent, u = T.empty, d = n.length - 1; d >= 0; --d) u = T.from(n[d].type.create(n[d].attrs, u));
	e.step(new Gt(a - (r ? 2 : 0), o, a, o, new D(u, 0, 0), n.length, !0));
	for (var f = 0, d = 0; d < n.length; d += 1) if (n[d].type === i) {
		f = d + 1;
		break;
	}
	for (var p = n.length - f, m = a + n.length - (r ? 2 : 0), d = s, h = c; d < h; d += 1) d !== s && un(e.doc, m, p) && (e.split(m, p), m += p * 2), m += l.child(d).nodeSize;
	return e;
}
function ox(e, t, n, r) {
	var i = t.$from, a = t.$to, o = t.depth, s = t, c = !1;
	if (o >= 2 && i.node(o - 1).type.compatibleContent(n) && t.startIndex === 0 && i.index(o - 1)) {
		var l = e.doc.resolve(t.start - 2);
		s = new De(l, l, o), t.endIndex < t.parent.childCount && (t = new De(i, e.doc.resolve(a.end(o)), o)), c = !0;
	}
	var u = ix(s, t, n, r);
	return u ? ax(e, t, u, c, n) : e;
}
function sx(e, t) {
	for (var n = e.resolve(t); n.node().type.name !== "paragraph";) t -= 2, n = e.resolve(t);
	return Qb(n);
}
function cx(e, t) {
	var n = t.$from, r = t.$to, i = Qb(n), a = Qb(r);
	if (i && a) for (; a;) {
		var o = a.offset, s = {
			task: !a.node.attrs.task,
			checked: !1
		};
		if (e.setNodeMarkup(o, null, s), o === i.offset) break;
		a = sx(e.doc, o);
	}
	return e;
}
function lx(e, t, n) {
	var r = t.$from, i = t.$to, a = Qb(r), o = Qb(i);
	if (a && o) for (; o;) {
		var s = o.offset, c = o.node, l = o.depth;
		c.attrs.task && e.setNodeMarkup(s, null, {
			task: !1,
			checked: !1
		});
		var u = e.doc.resolve(s);
		if (u.parent.type !== n) {
			var d = u.before(l - 1);
			e.setNodeMarkup(d, n);
		}
		if (s === a.offset) break;
		o = sx(e.doc, s);
	}
	return e;
}
function ux(e) {
	return function(t, n) {
		var r = t.selection, i = t.tr, a = r.$from, o = r.$to, s = a.blockRange(o);
		return s ? (n(Xb(a) ? lx(i, s, e) : ox(i, s, e)), !0) : !1;
	};
}
function dx() {
	return function(e, t) {
		var n = e.selection, r = e.tr, i = e.schema, a = n.$from, o = n.$to, s = a.blockRange(o);
		return s ? (t(Xb(a) ? cx(r, s) : ox(r, s, i.nodes.bulletList, { task: !0 })), !0) : !1;
	};
}
function fx(e) {
	return function(t, n) {
		var r = t.tr, i = t.selection, a = i.$from, o = i.$to, s = a.blockRange(o, function(t) {
			var n = t.childCount, r = t.firstChild;
			return !!n && r.type === e;
		});
		if (s && s.startIndex > 0) {
			var c = s.parent, l = c.child(s.startIndex - 1);
			if (l.type !== e) return !1;
			var u = l.lastChild && l.lastChild.type === c.type, d = u ? T.from(e.create()) : null, f = new D(T.from(e.create(null, T.from(c.type.create(null, d)))), u ? 3 : 1, 0), p = s.start, m = s.end;
			return r.step(new Gt(p - (u ? 3 : 1), m, p, m, f, 1, !0)), n(r), !0;
		}
		return !1;
	};
}
function px(e, t, n) {
	var r = t.$from, i = t.$to, a = t.end, o = t.depth, s = t.parent, c = i.end(o);
	return a < c && (e.step(new Gt(a - 1, c, a, c, new D(T.from(n.create(null, s.copy())), 1, 0), 1, !0)), t = new De(e.doc.resolve(r.pos), e.doc.resolve(c), o)), e.lift(t, Zt(t)), e;
}
function mx(e, t) {
	for (var n = t.parent, r = t.end, i = t.endIndex - 1, a = t.startIndex; i > a; --i) r -= n.child(i).nodeSize, e.delete(r - 1, r + 1);
	var o = e.doc.resolve(t.start), s = o.nodeAfter, c = t.startIndex === 0, l = t.endIndex === n.childCount, u = o.node(-1), d = o.index(-1), f = u.canReplace(d + +!c, d + 1, s == null ? void 0 : s.content.append(l ? T.empty : T.from(n)));
	if (s && f) {
		var p = o.pos, m = p + s.nodeSize;
		e.step(new Gt(p - +!!c, m + +!!l, p + 1, m - 1, new D((c ? T.empty : T.from(n.copy(T.empty))).append(l ? T.empty : T.from(n.copy(T.empty))), +!c, +!l), +!c));
	}
	return e;
}
function hx(e) {
	return function(t, n) {
		var r = t.tr, i = t.selection, a = i.$from, o = i.$to, s = a.blockRange(o, function(t) {
			var n = t.childCount, r = t.firstChild;
			return !!n && r.type === e;
		});
		return s ? (n(a.node(s.depth - 1).type === e ? px(r, s, e) : mx(r, s)), !0) : !1;
	};
}
function gx(e) {
	return function(t, n) {
		var r = t.tr, i = t.selection, a = i.$from, o = i.$to;
		if (a.depth < 2 || !a.sameParent(o)) return !1;
		var s = a.node(-1);
		if (s.type !== e) return !1;
		if (a.parent.content.size === 0 && a.node(-1).childCount === a.indexAfter(-1)) {
			if (a.depth === 2 || a.node(-3).type !== e || a.index(-2) !== a.node(-2).childCount - 1) return !1;
			for (var c = a.index(-1) > 0, l = T.empty, u = a.depth - (c ? 1 : 2); u >= a.depth - 3; --u) l = T.from(a.node(u).copy(l));
			return l = l.append(T.from(e.createAndFill())), r.replace(c ? a.before() : a.before(-1), a.after(-3), new D(l, c ? 3 : 2, 2)), r.setSelection(A.near(r.doc.resolve(a.pos + (c ? 3 : 2)))), n(r), !0;
		}
		var d = o.pos === a.end() ? s.contentMatchAt(0).defaultType : null, f = d && [null, { type: d }];
		return r.delete(a.pos, o.pos), un(r.doc, a.pos, 2, f) ? (r.split(a.pos, 2, f), n(r), !0) : !1;
	};
}
function _x() {
	return function() {
		return function(e, t) {
			var n = e.selection, r = e.schema, i = n.$from, a = n.$to;
			return i.blockRange(a) && Xb(i) ? fx(r.nodes.listItem)(e, t) : !1;
		};
	};
}
function vx() {
	return function() {
		return function(e, t) {
			var n = e.selection, r = e.schema, i = n.$from, a = n.$to;
			return i.blockRange(a) && Xb(i) ? hx(r.nodes.listItem)(e, t) : !1;
		};
	};
}
function yx() {
	return {
		indent: _x(),
		outdent: vx()
	};
}
var bx = /* @__PURE__ */ new Map(), xx = function() {
	function e(e, t, n, r) {
		this.table = e, this.tableRows = t, this.tableStartPos = n, this.rowInfo = r;
	}
	return e.create = function(t) {
		var n = Yb(t, function(e) {
			return e.type.name === "table";
		});
		if (n) {
			var r = n.node, i = n.depth, a = n.offset, o = bx.get(r);
			if ((o == null ? void 0 : o.tableStartPos) === a + 1) return o;
			var s = [], c = t.start(i), l = r.child(0), u = r.child(1), d = Sx(l, c), f = Sx(u, c + l.nodeSize);
			l.forEach(function(e) {
				return s.push(e);
			}), u.forEach(function(e) {
				return s.push(e);
			});
			var p = new e(r, s, c, d.concat(f));
			return bx.set(r, p), p;
		}
		return null;
	}, Object.defineProperty(e.prototype, "totalRowCount", {
		get: function() {
			return this.rowInfo.length;
		},
		enumerable: !1,
		configurable: !0
	}), Object.defineProperty(e.prototype, "totalColumnCount", {
		get: function() {
			return this.rowInfo[0].length;
		},
		enumerable: !1,
		configurable: !0
	}), Object.defineProperty(e.prototype, "tableStartOffset", {
		get: function() {
			return this.tableStartPos;
		},
		enumerable: !1,
		configurable: !0
	}), Object.defineProperty(e.prototype, "tableEndOffset", {
		get: function() {
			return this.tableStartPos + this.table.nodeSize - 1;
		},
		enumerable: !1,
		configurable: !0
	}), e.prototype.getCellInfo = function(e, t) {
		return this.rowInfo[e][t];
	}, e.prototype.posAt = function(e, t) {
		for (var n = 0, r = this.tableStartPos;; n += 1) {
			var i = r + this.tableRows[n].nodeSize;
			if (n === e) {
				for (var a = t; a < this.totalColumnCount && this.rowInfo[n][a].offset < r;) a += 1;
				return a === this.totalColumnCount ? i : this.rowInfo[n][a].offset;
			}
			r = i;
		}
	}, e.prototype.getNodeAndPos = function(e, t) {
		var n = this.rowInfo[e][t];
		return {
			node: this.table.nodeAt(n.offset - this.tableStartOffset),
			pos: n.offset
		};
	}, e.prototype.extendedRowspan = function(e, t) {
		return !1;
	}, e.prototype.extendedColspan = function(e, t) {
		return !1;
	}, e.prototype.getRowspanCount = function(e, t) {
		return 0;
	}, e.prototype.getColspanCount = function(e, t) {
		return 0;
	}, e.prototype.decreaseColspanCount = function(e, t) {
		return 0;
	}, e.prototype.decreaseRowspanCount = function(e, t) {
		return 0;
	}, e.prototype.getColspanStartInfo = function(e, t) {
		return null;
	}, e.prototype.getRowspanStartInfo = function(e, t) {
		return null;
	}, e.prototype.getCellStartOffset = function(e, t) {
		var n = this.rowInfo[e][t].offset;
		return this.extendedRowspan(e, t) ? this.posAt(e, t) : n;
	}, e.prototype.getCellEndOffset = function(e, t) {
		var n = this.rowInfo[e][t], r = n.offset, i = n.nodeSize;
		return this.extendedRowspan(e, t) ? this.posAt(e, t) : r + i;
	}, e.prototype.getCellIndex = function(e) {
		for (var t = 0; t < this.totalRowCount; t += 1) for (var n = this.rowInfo[t], r = 0; r < this.totalColumnCount; r += 1) if (n[r].offset + 1 > e.pos) return [t, r];
		return [0, 0];
	}, e.prototype.getRectOffsets = function(e, t) {
		var n, r, i;
		t === void 0 && (t = e), e.pos > t.pos && (n = [t, e], e = n[0], t = n[1]);
		var a = this.getCellIndex(e), o = a[0], s = a[1], c = this.getCellIndex(t), l = c[0], u = c[1];
		return r = Fu(o, l), o = r[0], l = r[1], i = Fu(s, u), s = i[0], u = i[1], this.getSpannedOffsets({
			startRowIdx: o,
			startColIdx: s,
			endRowIdx: l,
			endColIdx: u
		});
	}, e.prototype.getSpannedOffsets = function(e) {
		return e;
	}, e;
}(), Sx = function(e, t) {
	var n = [];
	return e.forEach(function(e, r) {
		var i = {
			rowspanMap: {},
			colspanMap: {},
			length: 0
		};
		e.forEach(function(e, n) {
			for (var a = e.nodeSize, o = 0; i[o];) o += 1;
			i[o] = {
				offset: t + r + n + 2,
				nodeSize: a
			}, i.length += 1;
		}), n.push(i);
	}), n;
};
function Cx(e, t) {
	return Pu(xx.prototype, e), Sx = t, xx;
}
function wx(e, t, n) {
	for (var r = n.startRowIdx, i = n.startColIdx, a = n.endRowIdx, o = n.endColIdx, s = [], c = r; c <= a; c += 1) for (var l = i; l <= o; l += 1) {
		var u = t.getCellInfo(c, l), d = u.offset, f = u.nodeSize;
		s.push(new Rn(e.resolve(d + 1), e.resolve(d + f - 1)));
	}
	return s;
}
function Tx(e, t) {
	var n = [];
	return e.childCount && n.push(e), t.childCount && n.push(t), T.from(n);
}
var Ex = function(e) {
	P(t, e);
	function t(t, n) {
		n === void 0 && (n = t);
		var r = this, i = t.node(0), a = xx.create(t), o = wx(i, a, a.getRectOffsets(t, n));
		return r = e.call(this, o[0].$from, o[0].$to, o) || this, r.startCell = t, r.endCell = n, r.offsetMap = a, r.isCellSelection = !0, r.visible = !1, r;
	}
	return t.prototype.map = function(e, n) {
		var r = this.startCell.pos, i = this.endCell.pos, a = e.resolve(n.map(r)), o = e.resolve(n.map(i)), s = xx.create(a);
		if (this.offsetMap.totalColumnCount > s.totalColumnCount || this.offsetMap.totalRowCount > s.totalRowCount) {
			var c = {
				tableBody: 1,
				tableRow: 2,
				tableCell: 3,
				paragraph: 4
			}[o.parent.type.name], l = o.end(o.depth - c), u = Math.min(l - 4, o.pos);
			return j.create(e, u);
		}
		return new t(a, o);
	}, t.prototype.eq = function(e) {
		return e instanceof t && e.startCell.pos === this.startCell.pos && e.endCell.pos === this.endCell.pos;
	}, t.prototype.content = function() {
		for (var e = this.startCell.node(-2), t = this.startCell.start(-2), n = e.child(1).firstChild, r = e.child(0).type.create(), i = e.child(1).type.create(), a = xx.create(this.startCell), o = a.getRectOffsets(this.startCell, this.endCell), s = o.startRowIdx, c = o.startColIdx, l = o.endRowIdx, u = o.endColIdx, d = !1, f = s; f <= l; f += 1) {
			for (var p = [], m = c; m <= u; m += 1) {
				var h = a.getCellInfo(f, m).offset, g = e.nodeAt(h - t);
				g && (d = g.type.name === "tableHeadCell", a.extendedRowspan(f, m) || a.extendedColspan(f, m) ? p.push(g.type.create({ extended: !0 })) : p.push(g.copy(g.content)));
			}
			var _ = n.copy(T.from(p)), v = d ? r : i;
			v.content = v.content.append(T.from(_));
		}
		return new D(Tx(r, i), 1, 1);
	}, t.prototype.toJSON = function() {
		return JSON.stringify(this);
	}, t;
}(A);
function Dx(e, t, n) {
	for (var r = t.nodes, i = r.tableRow, a = r.tableHeadCell, o = r.paragraph, s = [], c = 0; c < e; c += 1) {
		var l = n && n[c], u = o.create(null, l ? t.text(l) : []);
		s.push(a.create(null, u));
	}
	return [i.create(null, s)];
}
function Ox(e, t, n, r) {
	for (var i = n.nodes, a = i.tableRow, o = i.tableBodyCell, s = i.paragraph, c = [], l = 0; l < e; l += 1) {
		for (var u = [], d = 0; d < t; d += 1) {
			var f = r && r[l * t + d], p = s.create(null, f ? n.text(f) : []);
			u.push(o.create(null, p));
		}
		c.push(a.create(null, u));
	}
	return c;
}
function kx(e, t, n, r) {
	r === void 0 && (r = null);
	for (var i = n.nodes, a = i.tableHeadCell, o = i.tableBodyCell, s = i.paragraph, c = t === 0 ? a : o, l = [], u = 0; u < e; u += 1) l.push(c.create(r, s.create()));
	return l;
}
function Ax(e, t) {
	for (; e && e !== t;) {
		if (e.nodeName === "TD" || e.nodeName === "TH") return e;
		e = e.parentNode;
	}
	return null;
}
function jx(e) {
	return Yb(e, function(e) {
		var t = e.type;
		return t.name === "tableHeadCell" || t.name === "tableBodyCell";
	});
}
function Mx(e) {
	if (e instanceof j) {
		var t = e.$anchor, n = jx(t);
		if (n) {
			var r = t.node(0).resolve(t.before(n.depth));
			return {
				anchor: r,
				head: r
			};
		}
	}
	var i = e;
	return {
		anchor: i.startCell,
		head: i.endCell
	};
}
function Nx(e) {
	var t;
	if (e.size) {
		var n = e.content, r = e.openStart, i = e.openEnd;
		if (n.childCount !== 1) return null;
		for (; n.childCount === 1 && (r > 0 && i > 0 || ((t = n.firstChild) == null ? void 0 : t.type.name) === "table");) --r, --i, n = n.firstChild.content;
		if (n.firstChild.type.name === "tableHead" || n.firstChild.type.name === "tableBody") return n;
	}
	return null;
}
function Px(e) {
	var t = e.startRowIdx, n = e.startColIdx, r = e.endRowIdx, i = e.endColIdx;
	return {
		rowCount: r - t + 1,
		columnCount: i - n + 1
	};
}
function Fx(e, t) {
	return F(F({}, e.attrs), t);
}
var Ix = new or("cellSelection"), Lx = 2, Rx = function() {
	function e(e) {
		this.view = e, this.handlers = {
			mousedown: this.handleMousedown.bind(this),
			mousemove: this.handleMousemove.bind(this),
			mouseup: this.handleMouseup.bind(this)
		}, this.startCellPos = null, this.init();
	}
	return e.prototype.init = function() {
		this.view.dom.addEventListener("mousedown", this.handlers.mousedown);
	}, e.prototype.handleMousedown = function(e) {
		var t = Ax(e.target, this.view.dom);
		if (e.button === Lx) {
			e.preventDefault();
			return;
		}
		if (t) {
			var n = this.getCellPos(e);
			n && (this.startCellPos = n), this.bindEvent();
		}
	}, e.prototype.handleMousemove = function(e) {
		var t = Ix.getState(this.view.state), n = this.getCellPos(e), r = this.startCellPos, i;
		t ? i = this.view.state.doc.resolve(t) : r !== n && (i = r), i && r && n && this.setCellSelection(r, n);
	}, e.prototype.handleMouseup = function() {
		this.startCellPos = null, this.unbindEvent(), Ix.getState(this.view.state) !== null && this.view.dispatch(this.view.state.tr.setMeta(Ix, -1));
	}, e.prototype.bindEvent = function() {
		var e = this.view.dom;
		e.addEventListener("mousemove", this.handlers.mousemove), e.addEventListener("mouseup", this.handlers.mouseup);
	}, e.prototype.unbindEvent = function() {
		var e = this.view.dom;
		e.removeEventListener("mousemove", this.handlers.mousemove), e.removeEventListener("mouseup", this.handlers.mouseup);
	}, e.prototype.getCellPos = function(e) {
		var t = e.clientX, n = e.clientY, r = this.view.posAtCoords({
			left: t,
			top: n
		});
		if (r) {
			var i = this.view.state.doc, a = i.resolve(r.pos), o = jx(a);
			if (o) {
				var s = a.before(o.depth);
				return i.resolve(s);
			}
		}
		return null;
	}, e.prototype.setCellSelection = function(e, t) {
		var n = this.view.state, r = n.selection, i = n.tr, a = Ix.getState(this.view.state) === null, o = new Ex(e, t);
		if (a || !r.eq(o)) {
			var s = i.setSelection(o);
			a && s.setMeta(Ix, t.pos), this.view.dispatch(s);
		}
	}, e.prototype.destroy = function() {
		this.view.dom.removeEventListener("mousedown", this.handlers.mousedown);
	}, e;
}(), zx = V("cell-selected");
function Bx(e) {
	var t = e.selection, n = e.doc;
	if (t instanceof Ex) {
		var r = [];
		return t.ranges.forEach(function(e) {
			var t = e.$from, n = e.$to;
			r.push(Bo.node(t.pos - 1, n.pos + 1, { class: zx }));
		}), Uo.create(n, r);
	}
	return null;
}
function Vx() {
	return new rr({
		key: Ix,
		state: {
			init: function() {
				return null;
			},
			apply: function(e, t) {
				var n = e.getMeta(Ix);
				if (n) return n === -1 ? null : n;
				if (Xl(t) || !e.docChanged) return t;
				var r = e.mapping.mapResult(t), i = r.deleted, a = r.pos;
				return i ? null : a;
			}
		},
		props: {
			decorations: Bx,
			createSelectionBetween: function(e) {
				var t = e.state;
				return Xl(Ix.getState(t)) ? null : t.selection;
			}
		},
		view: function(e) {
			return new Rx(e);
		}
	});
}
var Hx = function() {
	function e() {
		this.keys = [], this.values = [];
	}
	return e.prototype.getKeyIndex = function(e) {
		return Tl(e, this.keys);
	}, e.prototype.get = function(e) {
		return this.values[this.getKeyIndex(e)];
	}, e.prototype.set = function(e, t) {
		var n = this.getKeyIndex(e);
		return n > -1 ? this.values[n] = t : (this.keys.push(e), this.values.push(t)), this;
	}, e.prototype.has = function(e) {
		return this.getKeyIndex(e) > -1;
	}, e.prototype.delete = function(e) {
		var t = this.getKeyIndex(e);
		return t > -1 && (this.keys.splice(t, 1), this.values.splice(t, 1), !0);
	}, e.prototype.forEach = function(e, t) {
		var n = this;
		t === void 0 && (t = this), this.values.forEach(function(r, i) {
			r && n.keys[i] && e.call(t, r, n.keys[i], n);
		});
	}, e.prototype.clear = function() {
		this.keys = [], this.values = [];
	}, e;
}(), Ux = "en-US", Q = new (function() {
	function e() {
		this.code = Ux, this.langs = new Hx();
	}
	return e.prototype.setCode = function(e) {
		this.code = e || Ux;
	}, e.prototype.setLanguage = function(e, t) {
		var n = this;
		e = [].concat(e), e.forEach(function(e) {
			if (!n.langs.has(e)) n.langs.set(e, t);
			else {
				var r = n.langs.get(e);
				n.langs.set(e, sl(r, t));
			}
		});
	}, e.prototype.get = function(e, t) {
		t || (t = this.code);
		var n = this.langs.get(t);
		n || (n = this.langs.get(Ux));
		var r = n[e];
		if (!r) throw Error(`There is no text key "${e}" in ${t}`);
		return r;
	}, e;
}())(), Wx = [
	[
		{
			action: "Add row to up",
			command: "addRowToUp",
			disableInThead: !0,
			className: "add-row-up"
		},
		{
			action: "Add row to down",
			command: "addRowToDown",
			disableInThead: !0,
			className: "add-row-down"
		},
		{
			action: "Remove row",
			command: "removeRow",
			disableInThead: !0,
			className: "remove-row"
		}
	],
	[
		{
			action: "Add column to left",
			command: "addColumnToLeft",
			className: "add-column-left"
		},
		{
			action: "Add column to right",
			command: "addColumnToRight",
			className: "add-column-right"
		},
		{
			action: "Remove column",
			command: "removeColumn",
			className: "remove-column"
		}
	],
	[
		{
			action: "Align column to left",
			command: "alignColumn",
			payload: { align: "left" },
			className: "align-column-left"
		},
		{
			action: "Align column to center",
			command: "alignColumn",
			payload: { align: "center" },
			className: "align-column-center"
		},
		{
			action: "Align column to right",
			command: "alignColumn",
			payload: { align: "right" },
			className: "align-column-right"
		}
	],
	[{
		action: "Remove table",
		command: "removeTable",
		className: "remove-table"
	}]
];
function Gx(e, t) {
	return Wx.map(function(n) {
		return n.map(function(n) {
			var r = n.action, i = n.command, a = n.payload, o = n.disableInThead, s = n.className;
			return {
				label: Q.get(r),
				onClick: function() {
					e.emit("command", i, a);
				},
				disabled: t && !!o,
				className: s
			};
		});
	}).concat();
}
function Kx(e) {
	return new rr({ props: { handleDOMEvents: { contextmenu: function(t, n) {
		var r = Ax(n.target, t.dom);
		if (r) {
			n.preventDefault();
			var i = n, a = i.clientX, o = i.clientY, s = t.dom.parentNode.getBoundingClientRect(), c = s.left, l = s.top, u = r.nodeName === "TH";
			return e.emit("contextmenu", {
				pos: {
					left: `${a - c + 10}px`,
					top: `${o - l + 30}px`
				},
				menuGroups: Gx(e, u),
				tableCell: r
			}), !0;
		}
		return !1;
	} } } });
}
function qx() {
	return new rr({ props: { handleDOMEvents: { mousedown: function(e, t) {
		var n = t, r = n.clientX, i = n.clientY, a = e.posAtCoords({
			left: r,
			top: i
		});
		if (a) {
			var o = e.state, s = o.doc, c = o.tr, l = s.resolve(a.pos), u = Qb(l), d = t.target, f = getComputedStyle(d, ":before"), p = t, m = p.offsetX, h = p.offsetY;
			if (!u || !Rd(f, m, h)) return !1;
			t.preventDefault();
			var g = l.before(u.depth), _ = u.node.attrs;
			return c.setNodeMarkup(g, null, F(F({}, _), { checked: !_.checked })), e.dispatch(c), !0;
		}
		return !1;
	} } } });
}
var Jx = [
	"image",
	"link",
	"customBlock",
	"frontMatter"
], Yx = [
	"strong",
	"strike",
	"emph",
	"code"
], Xx = [
	"bulletList",
	"orderedList",
	"taskList"
];
function Zx(e, t) {
	var n = e.type.name;
	return n === "listItem" ? e.attrs.task ? "taskList" : t.type.name : n.indexOf("table") === -1 ? n : "table";
}
function Qx(e, t) {
	t[e] = { active: !0 }, Xx.filter(function(t) {
		return t !== e;
	}).forEach(function(e) {
		t[e] && delete t[e];
	});
}
function $x(e, t, n, r) {
	Yx.forEach(function(i) {
		var a = n.marks[i], o = e.marksAcross(t) || [];
		a.isInSet(o) && (r[i] = { active: !0 });
	});
}
function eS(e, t, n) {
	var r = e.$from, i = e.$to, a = e.from, o = e.to, s = {
		indent: {
			active: !1,
			disabled: !0
		},
		outdent: {
			active: !1,
			disabled: !0
		}
	};
	return t.nodesBetween(a, o, function(e, t, a) {
		var o = Zx(e, a);
		L(Jx, o) || (L(Xx, o) ? (Qx(o, s), s.indent.disabled = !1, s.outdent.disabled = !1) : o === "paragraph" || o === "text" ? $x(r, i, n, s) : s[o] = { active: !0 });
	}), s;
}
function tS(e) {
	return new rr({ view: function() {
		return { update: function(t) {
			var n = t.state, r = n.selection, i = n.doc, a = n.schema;
			e.emit("changeToolbarState", { toolbarState: eS(r, i, a) });
		} };
	} });
}
var nS = function() {
	function e(e, t, n, r) {
		var i = this;
		this.openEditor = function() {
			if (i.innerEditorView) throw Error("The editor is already opened.");
			i.dom.draggable = !1, i.wrapper.style.display = "none", i.innerViewContainer.style.display = "block", i.innerEditorView = new ws(i.innerViewContainer, {
				state: tr.create({
					doc: i.node,
					plugins: [Ws({
						"Mod-z": function() {
							return $c(i.innerEditorView.state, i.innerEditorView.dispatch);
						},
						"Shift-Mod-z": function() {
							return el(i.innerEditorView.state, i.innerEditorView.dispatch);
						},
						Tab: function(e, t) {
							return t(e.tr.insertText("	")), !0;
						},
						Enter: nc,
						Escape: function() {
							return i.cancelEditing(), !0;
						},
						"Ctrl-Enter": function() {
							return i.saveAndFinishEditing(), !0;
						}
					}), Zc()]
				}),
				dispatchTransaction: function(e) {
					return i.dispatchInner(e);
				},
				handleDOMEvents: {
					mousedown: function() {
						return i.editorView.hasFocus() && i.innerEditorView.focus(), !0;
					},
					blur: function() {
						return i.saveAndFinishEditing(), !0;
					}
				}
			}), i.innerEditorView.focus();
		}, this.node = e, this.editorView = t, this.getPos = n, this.toDOMAdaptor = r, this.innerEditorView = null, this.canceled = !1, this.dom = document.createElement("div"), this.dom.className = V("custom-block"), this.wrapper = document.createElement("div"), this.wrapper.className = V("custom-block-view"), this.createInnerViewContainer(), this.renderCustomBlock(), this.dom.appendChild(this.innerViewContainer), this.dom.appendChild(this.wrapper);
	}
	return e.prototype.renderToolArea = function() {
		var e = this, t = document.createElement("div"), n = document.createElement("span"), r = document.createElement("button");
		t.className = "tool", n.textContent = this.node.attrs.info, n.className = "info", r.type = "button", r.addEventListener("click", function() {
			return e.openEditor();
		}), t.appendChild(n), t.appendChild(r), this.wrapper.appendChild(t);
	}, e.prototype.renderCustomBlock = function() {
		var e = this.toDOMAdaptor.getToDOMNode(this.node.attrs.info);
		if (e) {
			for (var t = e(this.node); this.wrapper.hasChildNodes();) this.wrapper.removeChild(this.wrapper.lastChild);
			t && this.wrapper.appendChild(t), this.renderToolArea();
		}
	}, e.prototype.createInnerViewContainer = function() {
		this.innerViewContainer = document.createElement("div"), this.innerViewContainer.className = V("custom-block-editor"), this.innerViewContainer.style.display = "none";
	}, e.prototype.closeEditor = function() {
		this.innerEditorView && (this.innerEditorView.destroy(), this.innerEditorView = null, this.innerViewContainer.style.display = "none"), this.wrapper.style.display = "block";
	}, e.prototype.saveAndFinishEditing = function() {
		var e = this.editorView.state.selection.to, t = this.editorView.state;
		this.editorView.dispatch(t.tr.setSelection(z(t.tr, e))), this.editorView.focus(), this.renderCustomBlock(), this.closeEditor();
	}, e.prototype.cancelEditing = function() {
		var e = tl(this.innerEditorView.state);
		for (this.canceled = !0; e--;) $c(this.innerEditorView.state, this.innerEditorView.dispatch), $c(this.editorView.state, this.editorView.dispatch);
		this.canceled = !1;
		var t = this.editorView.state.selection.to, n = this.editorView.state;
		this.editorView.dispatch(n.tr.setSelection(j.create(n.doc, t))), this.editorView.focus(), this.closeEditor();
	}, e.prototype.dispatchInner = function(e) {
		var t = this.innerEditorView.state.applyTransaction(e), n = t.state, r = t.transactions;
		if (this.innerEditorView.updateState(n), !this.canceled && hf(this.getPos)) {
			for (var i = this.editorView.state.tr, a = Pt.offset(this.getPos() + 1), o = 0; o < r.length; o += 1) for (var s = r[o].steps, c = 0; c < s.length; c += 1) i.step(s[c].map(a));
			i.docChanged && this.editorView.dispatch(i);
		}
	}, e.prototype.update = function(e) {
		return e.sameMarkup(this.node) ? (this.node = e, this.innerEditorView || this.renderCustomBlock(), !0) : !1;
	}, e.prototype.stopEvent = function(e) {
		return !!this.innerEditorView && !!e.target && this.innerEditorView.dom.contains(e.target);
	}, e.prototype.ignoreMutation = function() {
		return !0;
	}, e.prototype.destroy = function() {
		this.dom.removeEventListener("dblclick", this.openEditor), this.closeEditor();
	}, e;
}(), rS = "image-link", iS = function() {
	function e(e, t, n, r) {
		var i = this, a;
		this.handleMousedown = function(e) {
			e.preventDefault();
			var t = e.target, n = e.offsetX, r = e.offsetY;
			if (i.imageLink && hf(i.getPos) && Cd(t, rS)) {
				var a = getComputedStyle(t, ":before");
				if (e.stopPropagation(), Rd(a, n, r)) {
					var o = i.view.state.tr, s = i.getPos();
					o.setSelection(z(o, s, s + 1)), i.view.dispatch(o), i.eventEmitter.emit("openPopup", "link", i.imageLink.attrs);
				}
			}
		}, this.node = e, this.view = t, this.getPos = n, this.eventEmitter = r, this.imageLink = (a = e.marks.filter(function(e) {
			return e.type.name === "link";
		})[0]) == null ? null : a, this.dom = this.createElement(), this.bindEvent();
	}
	return e.prototype.createElement = function() {
		var e = this.createImageElement(this.node);
		if (this.imageLink) {
			var t = document.createElement("span");
			return t.className = rS, t.appendChild(e), t;
		}
		return e;
	}, e.prototype.createImageElement = function(e) {
		var t = document.createElement("img"), n = e.attrs, r = n.imageUrl, i = n.altText, a = Z(e.attrs);
		return t.src = r, i && (t.alt = i), Qd(a, t), t;
	}, e.prototype.bindEvent = function() {
		this.imageLink && this.dom.addEventListener("mousedown", this.handleMousedown);
	}, e.prototype.stopEvent = function() {
		return !0;
	}, e.prototype.destroy = function() {
		this.imageLink && this.dom.removeEventListener("mousedown", this.handleMousedown);
	}, e;
}(), aS = "toastui-editor-ww-code-block", oS = "toastui-editor-ww-code-block-language", sS = function() {
	function e(e, t, n, r) {
		var i = this;
		this.contentDOM = null, this.input = null, this.timer = null, this.handleMousedown = function(e) {
			var t = e.target;
			if (getComputedStyle(t, ":after").backgroundImage !== "none" && hf(i.getPos)) {
				var n = i.view.coordsAtPos(i.getPos()), r = n.top, a = n.right;
				i.createLanguageEditor({
					top: r,
					right: a
				});
			}
		}, this.handleKeydown = function(e) {
			e.key === "Enter" && i.input && (e.preventDefault(), i.changeLanguage());
		}, this.node = e, this.view = t, this.getPos = n, this.eventEmitter = r, this.createElement(), this.bindDOMEvent(), this.bindEvent();
	}
	return e.prototype.createElement = function() {
		var e = this.node.attrs.language, t = document.createElement("div");
		t.setAttribute("data-language", e || "text"), t.className = aS;
		var n = this.createCodeBlockElement(), r = n.firstChild;
		t.appendChild(n), this.dom = t, this.contentDOM = r;
	}, e.prototype.createCodeBlockElement = function() {
		var e = document.createElement("pre"), t = document.createElement("code"), n = this.node.attrs.language, r = Z(this.node.attrs);
		return n && t.setAttribute("data-language", n), Qd(r, e), e.appendChild(t), e;
	}, e.prototype.createLanguageEditor = function(e) {
		var t = this, n = e.top, r = e.right, i = document.createElement("span");
		i.className = oS;
		var a = document.createElement("input");
		a.type = "text", a.value = this.node.attrs.language, i.appendChild(a), this.view.dom.parentElement.appendChild(i);
		var o = i.clientWidth;
		Sl(i, {
			top: `${n + 10}px`,
			left: `${r - o - 10}px`,
			width: `${o}px`
		}), this.input = a, this.input.addEventListener("blur", function() {
			return t.changeLanguage();
		}), this.input.addEventListener("keydown", this.handleKeydown), this.clearTimer(), this.timer = setTimeout(function() {
			t.input.focus();
		});
	}, e.prototype.bindDOMEvent = function() {
		this.dom && this.dom.addEventListener("click", this.handleMousedown);
	}, e.prototype.bindEvent = function() {
		var e = this;
		this.eventEmitter.listen("scroll", function() {
			e.input && e.reset();
		});
	}, e.prototype.changeLanguage = function() {
		if (this.input && hf(this.getPos)) {
			var e = this.input.value;
			this.reset();
			var t = this.getPos(), n = this.view.state.tr;
			n.setNodeMarkup(t, null, { language: e }), this.view.dispatch(n);
		}
	}, e.prototype.reset = function() {
		var e;
		if ((e = this.input) != null && e.parentElement) {
			var t = this.input.parentElement;
			this.input = null, Gd(t);
		}
	}, e.prototype.clearTimer = function() {
		this.timer && (clearTimeout(this.timer), this.timer = null);
	}, e.prototype.stopEvent = function() {
		return !0;
	}, e.prototype.update = function(e) {
		return e.sameMarkup(this.node) ? (this.node = e, !0) : !1;
	}, e.prototype.destroy = function() {
		this.reset(), this.clearTimer(), this.dom && this.dom.removeEventListener("click", this.handleMousedown);
	}, e;
}(), cS = /MsoListParagraph/, lS = /style=(.|\n)*mso-/, uS = /mso-list:(.*)/, dS = /O:P/, fS = /^(n|u|l)/, pS = "p.MsoListParagraph";
function mS(e) {
	return lS.test(e);
}
function hS(e) {
	for (var t = [], n = document.createTreeWalker(e, 1, null); n.nextNode();) {
		var r = n.currentNode;
		if (Vd(r)) {
			var i = r, a = i.outerHTML, o = i.textContent, s = lS.test(a), c = uS.test(a);
			s && !c && o ? t.push([r, !0]) : (dS.test(r.nodeName) || s && !o || c) && t.push([r, !1]);
		}
	}
	return t.forEach(function(e) {
		var t = e[0];
		e[1] ? Kd(t) : Gd(t);
	}), e.innerHTML.trim();
}
function gS(e, t) {
	var n = e.getAttribute("style");
	if (n) {
		var r = n.match(uS)[1].trim().split(" ")[1];
		return {
			id: t,
			level: parseInt(r.replace("level", ""), 10),
			prev: null,
			parent: null,
			children: [],
			unordered: fS.test(e.textContent || ""),
			contents: hS(e)
		};
	}
	return null;
}
function _S(e, t) {
	if (t.level < e.level) t.children.push(e), e.parent = t;
	else {
		for (; t && t.level !== e.level;) t = t.parent;
		t && (e.prev = t, e.parent = t.parent, e.parent && e.parent.children.push(e));
	}
}
function vS(e) {
	var t = [];
	return e.forEach(function(e, n) {
		var r = t[n - 1], i = gS(e, n);
		i && (r && _S(i, r), t.push(i));
	}), t;
}
function yS(e) {
	var t = e[0].unordered ? "ul" : "ol", n = document.createElement(t);
	return e.forEach(function(e) {
		var t = e.children, r = e.contents, i = document.createElement("li");
		i.innerHTML = r, n.appendChild(i), t.length && n.appendChild(yS(t));
	}), n;
}
function bS(e) {
	return yS(vS(e).filter(function(e) {
		return !e.parent;
	}));
}
function xS(e) {
	for (; e && !Vd(e);) e = e.nextSibling;
	return !e || !cS.test(e.className);
}
function SS(e) {
	var t = document.createElement("div");
	t.innerHTML = e;
	var n = [], r = Hd(t, pS);
	return r.forEach(function(e) {
		var r = xS(e.nextSibling);
		if (n.push(e), r) {
			var i = bS(n), a = e.nextSibling;
			a ? Wd(i, a) : Ud(t, i), n = [];
		}
		Gd(e);
	}), `${r.length ? "<p></p>" : ""}${t.innerHTML}`;
}
var CS = "<!--StartFragment-->", wS = "<!--EndFragment-->";
function TS(e) {
	var t = e.indexOf(CS), n = e.lastIndexOf(wS);
	return t > -1 && n > -1 && (e = e.slice(t + CS.length, n)), e.replace(/<br[^>]*>/g, Ld);
}
function ES(e) {
	return /<\/td>((?!<\/tr>)[\s\S])*$/i.test(e) && (e = `<tr>${e}</tr>`), /<\/tr>((?!<\/table>)[\s\S])*$/i.test(e) && (e = `<table>${e}</table>`), e;
}
function DS(e) {
	return e = TS(e), e = ES(e), mS(e) && (e = SS(e)), e;
}
function OS(e) {
	return e.reduce(function(e, t) {
		return e.childCount > t.childCount ? e : t;
	}).childCount;
}
function kS(e, t, n) {
	for (var r = [], i = e.childCount, a = 0; a < i; a += 1) if (!e.child(a).attrs.extended) {
		var o = a < i ? n.create(e.child(a).attrs, e.child(a).content) : n.createAndFill();
		r.push(o);
	}
	return r;
}
function AS(e, t, n) {
	var r = n.nodes, i = r.tableRow, a = r.tableHeadCell, o = kS(e, t, a);
	return i.create(null, o);
}
function jS(e, t, n) {
	var r = n.nodes, i = r.tableRow, a = r.tableBodyCell, o = kS(e, t, a);
	return i.create(null, o);
}
function MS(e, t) {
	for (var n = t.nodes, r = n.tableRow, i = n.tableBodyCell, a = [], o = 0; o < e; o += 1) {
		var s = i.createAndFill();
		a.push(s);
	}
	return r.create({ dummyRowForPasting: !0 }, a);
}
function NS(e) {
	var t = [], n = [];
	return e.firstChild.type.name === "tableHead" && e.firstChild.forEach(function(e) {
		return t.push(e);
	}), e.lastChild.type.name === "tableBody" && e.lastChild.forEach(function(e) {
		return n.push(e);
	}), rl(rl([], t, !0), n, !0);
}
function PS(e, t, n) {
	var r = AS(e, t, n);
	return n.nodes.tableHead.create(null, r);
}
function FS(e, t, n) {
	var r = e.map(function(e) {
		return jS(e, t, n);
	});
	if (!e.length) {
		var i = MS(t, n);
		r.push(i);
	}
	return n.nodes.tableBody.create(null, r);
}
function IS(e, t, n, r) {
	var i = OS(e);
	if (n && r) return t.nodes.table.create(null, [FS(e, i, t)]);
	var a = e[0], o = e.slice(1), s = [PS(a, i, t)];
	return o.length && s.push(FS(o, i, t)), t.nodes.table.create(null, s);
}
function LS(e, t, n) {
	var r = [], i = e.content, a = e.openStart, o = e.openEnd;
	return i.forEach(function(e) {
		if (e.type.name === "table") {
			var i = Nx(new D(T.from(e), 0, 0));
			if (i) {
				var a = IS(NS(i), t, i.firstChild.type.name === "tableBody", n);
				r.push(a);
			}
		} else r.push(e);
	}), new D(T.from(r), a, o);
}
var RS = 4, zS = 2;
function BS(e) {
	return e * RS;
}
function VS(e, t, n) {
	var r = [], i = NS(e), a = i[0].childCount, o = i.length, s = t.startRowIdx === 0, c = i.slice(0, o);
	if (s) {
		var l = c.shift();
		if (l) {
			var u = AS(l, a, n).content;
			r.push(u);
		}
	}
	return c.forEach(function(e) {
		if (!e.attrs.dummyRowForPasting) {
			var t = jS(e, a, n).content;
			r.push(t);
		}
	}), r;
}
function HS(e, t, n) {
	for (var r = t.startRowIdx, i = t.startColIdx, a = n.length, o = 0, s = function(e) {
		var t = n[e].childCount;
		n[e].forEach(function(e) {
			var n = e.attrs.colspan;
			n > 1 && (t += n - 1);
		}), o = Math.max(o, t);
	}, c = 0; c < a; c += 1) s(c);
	var l = r + a - 1, u = i + o - 1;
	return {
		startRowIdx: r,
		startColIdx: i,
		endRowIdx: l,
		endColIdx: u,
		addedRowCount: Math.max(l + 1 - e.totalRowCount, 0),
		addedColumnCount: Math.max(u + 1 - e.totalColumnCount, 0)
	};
}
function US(e, t) {
	for (var n = e.startRowIdx, r = e.startColIdx, i = e.endRowIdx, a = e.endColIdx, o = e.addedRowCount, s = e.addedColumnCount, c = n; c <= i - o; c += 1) t.push({
		rowIdx: c,
		startColIdx: r,
		endColIdx: a - s
	});
}
function WS(e, t, n, r, i) {
	for (var a = r.startRowIdx, o = r.startColIdx, s = r.endRowIdx, c = r.endColIdx, l = r.addedRowCount, u = r.addedColumnCount, d = n.totalRowCount, f = 0, p = 0; p < d; p += 1) {
		var m = n.getCellInfo(p, c - u), h = m.offset, g = m.nodeSize, _ = e.mapping.map(h + g), v = kx(u, p, t);
		if (e.insert(_, v), p >= a && p <= s - l) {
			var y = n.getCellInfo(p, c - u), b = e.mapping.map(y.offset), x = _ + BS(u);
			i[f] = {
				rowIdx: p,
				startColIdx: o,
				endColIdx: c,
				dummyOffsets: [b, x]
			}, f += 1;
		}
	}
}
function GS(e, t, n, r, i) {
	var a = r.addedRowCount, o = r.addedColumnCount, s = r.startColIdx, c = r.endColIdx, l = e.mapping.maps.length, u = n.tableEndOffset - 2, d = Ox(a, n.totalColumnCount + o, t), f = u;
	e.insert(e.mapping.slice(l).map(f), d);
	for (var p = 0; p < a; p += 1) {
		var m = f + BS(s) + 1, h = f + BS(c + 1) + 1, g = f + BS(n.totalColumnCount + o) + zS;
		i.push({
			rowIdx: p + n.totalRowCount,
			startColIdx: s,
			endColIdx: c,
			dummyOffsets: [m, h]
		}), f = g;
	}
}
function KS(e, t, n, r) {
	var i = e.mapping.maps.length;
	n.forEach(function(n, a) {
		var o = n.rowIdx, s = n.startColIdx, c = n.endColIdx, l = n.dummyOffsets, u = e.mapping.slice(i), d = new D(t[a], 0, 0), f = l ? l[0] : r.getCellStartOffset(o, s), p = l ? l[1] : r.getCellEndOffset(o, c);
		e.replace(u.map(f), u.map(p), d);
	});
}
function qS(e, t) {
	var n = e.state, r = n.selection, i = n.schema, a = n.tr, o = Mx(r), s = o.anchor, c = o.head;
	if (s && c) {
		var l = Nx(t);
		if (!l) return !1;
		var u = xx.create(s), d = u.getRectOffsets(s, c), f = VS(l, d, i), p = HS(u, d, f), m = [];
		return YS(u, p) && (US(p, m), p.addedColumnCount && WS(a, i, u, p, m), p.addedRowCount && GS(a, i, u, p, m), KS(a, f, m, u), e.dispatch(a), JS(e, m, u.getCellInfo(0, 0).offset)), !0;
	}
	return !1;
}
function JS(e, t, n) {
	var r = e.state, i = r.tr, a = r.doc, o = xx.create(a.resolve(n)), s = t[0], c = s.rowIdx, l = s.startColIdx, u = Ou(t), d = u.rowIdx, f = u.endColIdx, p = o.getCellInfo(c, l).offset, m = o.getCellInfo(d, f).offset;
	e.dispatch(i.setSelection(new Ex(a.resolve(p), a.resolve(m))));
}
function YS(e, t) {
	var n = Px(e.getSpannedOffsets(t)), r = n.rowCount, i = n.columnCount, a = Px(t), o = a.rowCount, s = a.columnCount;
	return r === o && i === s;
}
var XS = function(e) {
	P(t, e);
	function t() {
		return e !== null && e.apply(this, arguments) || this;
	}
	return Object.defineProperty(t.prototype, "name", {
		get: function() {
			return "doc";
		},
		enumerable: !1,
		configurable: !0
	}), Object.defineProperty(t.prototype, "schema", {
		get: function() {
			return { content: "block+" };
		},
		enumerable: !1,
		configurable: !0
	}), t;
}(U), ZS = function(e) {
	P(t, e);
	function t() {
		return e !== null && e.apply(this, arguments) || this;
	}
	return Object.defineProperty(t.prototype, "name", {
		get: function() {
			return "paragraph";
		},
		enumerable: !1,
		configurable: !0
	}), Object.defineProperty(t.prototype, "schema", {
		get: function() {
			return {
				content: "inline*",
				group: "block",
				attrs: F({}, X()),
				parseDOM: [{ tag: "p" }],
				toDOM: function(e) {
					var t = e.attrs;
					return [
						"p",
						Z(t),
						0
					];
				}
			};
		},
		enumerable: !1,
		configurable: !0
	}), t;
}(U), QS = /\s{1,4}$/, $S = function(e) {
	P(t, e);
	function t() {
		return e !== null && e.apply(this, arguments) || this;
	}
	return Object.defineProperty(t.prototype, "name", {
		get: function() {
			return "text";
		},
		enumerable: !1,
		configurable: !0
	}), Object.defineProperty(t.prototype, "schema", {
		get: function() {
			return { group: "inline" };
		},
		enumerable: !1,
		configurable: !0
	}), t.prototype.addSpaces = function() {
		return function(e, t) {
			var n = e.selection, r = e.tr, i = n.$from, a = n.$to;
			return i.blockRange(a) && !Xb(i) && !Zb(i) ? (t(r.insertText("    ", i.pos, a.pos)), !0) : !1;
		};
	}, t.prototype.removeSpaces = function() {
		return function(e, t) {
			var n = e.selection, r = e.tr, i = n.$from, a = n.$to, o = n.from;
			if (i.blockRange(a) && !Xb(i) && !Zb(i)) {
				var s = i.nodeBefore;
				if (s && s.isText) {
					var c = s.text, l = c.replace(QS, ""), u = c.length - l.length;
					return t(r.delete(o - u, o)), !0;
				}
			}
			return !1;
		};
	}, t.prototype.keymaps = function() {
		return {
			Tab: this.addSpaces(),
			"Shift-Tab": this.removeSpaces()
		};
	}, t;
}(U), eC = function(e) {
	P(t, e);
	function t() {
		return e !== null && e.apply(this, arguments) || this;
	}
	return Object.defineProperty(t.prototype, "name", {
		get: function() {
			return "heading";
		},
		enumerable: !1,
		configurable: !0
	}), Object.defineProperty(t.prototype, "levels", {
		get: function() {
			return [
				1,
				2,
				3,
				4,
				5,
				6
			];
		},
		enumerable: !1,
		configurable: !0
	}), Object.defineProperty(t.prototype, "schema", {
		get: function() {
			var e = this.levels.map(function(e) {
				return {
					tag: `h${e}`,
					getAttrs: function(t) {
						var n = t.getAttribute("data-raw-html");
						return F({ level: e }, n && { rawHTML: n });
					}
				};
			});
			return {
				attrs: F({
					level: { default: 1 },
					headingType: { default: "atx" },
					rawHTML: { default: null }
				}, X()),
				content: "inline*",
				group: "block",
				defining: !0,
				parseDOM: e,
				toDOM: function(e) {
					var t = e.attrs;
					return [
						`h${t.level}`,
						Z(t),
						0
					];
				}
			};
		},
		enumerable: !1,
		configurable: !0
	}), t.prototype.commands = function() {
		return function(e) {
			return function(t, n) {
				var r = t.schema.nodes[e.level ? "heading" : "paragraph"];
				return gc(r, e)(t, n);
			};
		};
	}, t;
}(U), tC = function(e) {
	P(t, e);
	function t() {
		return e !== null && e.apply(this, arguments) || this;
	}
	return Object.defineProperty(t.prototype, "name", {
		get: function() {
			return "codeBlock";
		},
		enumerable: !1,
		configurable: !0
	}), Object.defineProperty(t.prototype, "schema", {
		get: function() {
			return {
				content: "text*",
				group: "block",
				attrs: F({
					language: { default: null },
					rawHTML: { default: null }
				}, X()),
				code: !0,
				defining: !0,
				marks: "",
				parseDOM: [{
					tag: "pre",
					preserveWhitespace: "full",
					getAttrs: function(e) {
						var t = e.getAttribute("data-raw-html"), n = e.firstElementChild;
						return F({ language: (n == null ? void 0 : n.getAttribute("data-language")) || null }, t && { rawHTML: t });
					}
				}],
				toDOM: function(e) {
					var t = e.attrs;
					return [t.rawHTML || "pre", [
						"code",
						F({ "data-language": t.language }, Z(t)),
						0
					]];
				}
			};
		},
		enumerable: !1,
		configurable: !0
	}), t.prototype.commands = function() {
		return function() {
			return function(e, t) {
				return gc(e.schema.nodes.codeBlock)(e, t);
			};
		};
	}, t.prototype.moveCursor = function(e) {
		var t = this;
		return function(n, r) {
			var i = n.tr, a = n.doc, o = n.schema, s = n.selection.$from;
			if (t.context.view.endOfTextblock(e) && s.node().type.name === "codeBlock") {
				var c = s.parent.textContent.split("\n"), l = e === "up" ? s.start() : s.end(), u = e === "up" ? [l, c[0].length + l] : [l - Ou(c).length, l], d = a.resolve(e === "up" ? s.before() : s.after()), f = e === "up" ? d.nodeBefore : d.nodeAfter;
				if (ku(s.pos, u[0], u[1]) && !f) {
					var p = Bu(i, d, o);
					if (p) return r(p), !0;
				}
			}
			return !1;
		};
	}, t.prototype.keymaps = function() {
		var e = this.commands()();
		return {
			"Shift-Mod-p": e,
			"Shift-Mod-P": e,
			ArrowUp: this.moveCursor("up"),
			ArrowDown: this.moveCursor("down")
		};
	}, t;
}(U), nC = function(e) {
	P(t, e);
	function t() {
		return e !== null && e.apply(this, arguments) || this;
	}
	return Object.defineProperty(t.prototype, "name", {
		get: function() {
			return "bulletList";
		},
		enumerable: !1,
		configurable: !0
	}), Object.defineProperty(t.prototype, "schema", {
		get: function() {
			return {
				content: "listItem+",
				group: "block",
				attrs: F({ rawHTML: { default: null } }, X()),
				parseDOM: [$b("ul")],
				toDOM: function(e) {
					var t = e.attrs;
					return [
						"ul",
						Z(t),
						0
					];
				}
			};
		},
		enumerable: !1,
		configurable: !0
	}), t.prototype.changeList = function() {
		return function(e, t) {
			return ux(e.schema.nodes.bulletList)(e, t);
		};
	}, t.prototype.commands = function() {
		return {
			bulletList: this.changeList,
			taskList: dx
		};
	}, t.prototype.keymaps = function() {
		var e = this.changeList(), t = yx(), n = t.indent, r = t.outdent;
		return {
			"Mod-u": e,
			"Mod-U": e,
			Tab: n(),
			"Shift-Tab": r()
		};
	}, t;
}(U), rC = function(e) {
	P(t, e);
	function t() {
		return e !== null && e.apply(this, arguments) || this;
	}
	return Object.defineProperty(t.prototype, "name", {
		get: function() {
			return "orderedList";
		},
		enumerable: !1,
		configurable: !0
	}), Object.defineProperty(t.prototype, "schema", {
		get: function() {
			return {
				content: "listItem+",
				group: "block",
				attrs: F({
					order: { default: 1 },
					rawHTML: { default: null }
				}, X()),
				parseDOM: [{
					tag: "ol",
					getAttrs: function(e) {
						var t = e.getAttribute("start"), n = e.getAttribute("data-raw-html");
						return F({ order: e.hasAttribute("start") ? Number(t) : 1 }, n && { rawHTML: n });
					}
				}],
				toDOM: function(e) {
					var t = e.attrs;
					return [
						t.rawHTML || "ol",
						F({ start: t.order === 1 ? null : t.order }, Z(t)),
						0
					];
				}
			};
		},
		enumerable: !1,
		configurable: !0
	}), t.prototype.commands = function() {
		return function() {
			return function(e, t) {
				return ux(e.schema.nodes.orderedList)(e, t);
			};
		};
	}, t.prototype.keymaps = function() {
		var e = this.commands()(), t = yx(), n = t.indent, r = t.outdent;
		return {
			"Mod-o": e,
			"Mod-O": e,
			Tab: n(),
			"Shift-Tab": r()
		};
	}, t;
}(U), iC = function(e) {
	P(t, e);
	function t() {
		return e !== null && e.apply(this, arguments) || this;
	}
	return Object.defineProperty(t.prototype, "name", {
		get: function() {
			return "listItem";
		},
		enumerable: !1,
		configurable: !0
	}), Object.defineProperty(t.prototype, "schema", {
		get: function() {
			return {
				content: "paragraph block*",
				selectable: !1,
				attrs: {
					task: { default: !1 },
					checked: { default: !1 },
					rawHTML: { default: null }
				},
				defining: !0,
				parseDOM: [{
					tag: "li",
					getAttrs: function(e) {
						var t = e.getAttribute("data-raw-html");
						return F({
							task: e.hasAttribute("data-task"),
							checked: e.hasAttribute("data-task-checked")
						}, t && { rawHTML: t });
					}
				}],
				toDOM: function(e) {
					var t = e.attrs, n = t.task, r = t.checked;
					if (!n) return [t.rawHTML || "li", 0];
					var i = ["task-list-item"];
					return r && i.push("checked"), [
						t.rawHTML || "li",
						F({
							class: i.join(" "),
							"data-task": n
						}, r && { "data-task-checked": r }),
						0
					];
				}
			};
		},
		enumerable: !1,
		configurable: !0
	}), t.prototype.liftToPrevListItem = function() {
		return function(e, t) {
			var n = e.selection, r = e.tr, i = e.schema, a = n.$from, o = n.empty, s = i.nodes.listItem, c = a.parent, l = a.node(-1);
			if (o && !c.childCount && l.type === s) {
				if (a.index(-2) >= 1) return r.delete(a.start(-1) - 1, a.end(-1)), t(r), !0;
				if (a.node(-3).type === s) return r.delete(a.start(-2) - 1, a.end(-1)), t(r), !0;
			}
			return !1;
		};
	}, t.prototype.keymaps = function() {
		return {
			Backspace: this.liftToPrevListItem(),
			Enter: function(e, t) {
				return gx(e.schema.nodes.listItem)(e, t);
			}
		};
	}, t;
}(U), aC = function(e) {
	P(t, e);
	function t() {
		return e !== null && e.apply(this, arguments) || this;
	}
	return Object.defineProperty(t.prototype, "name", {
		get: function() {
			return "blockQuote";
		},
		enumerable: !1,
		configurable: !0
	}), Object.defineProperty(t.prototype, "schema", {
		get: function() {
			return {
				attrs: F({ rawHTML: { default: null } }, X()),
				content: "block+",
				group: "block",
				parseDOM: [$b("blockquote")],
				toDOM: function(e) {
					var t = e.attrs;
					return [
						"blockquote",
						Z(t),
						0
					];
				}
			};
		},
		enumerable: !1,
		configurable: !0
	}), t.prototype.commands = function() {
		return function() {
			return function(e, t) {
				return hc(e.schema.nodes.blockQuote)(e, t);
			};
		};
	}, t.prototype.keymaps = function() {
		var e = this.commands()();
		return {
			"Alt-q": e,
			"Alt-Q": e
		};
	}, t;
}(U), oC = {
	left: gC,
	right: hC,
	up: _C,
	down: vC
};
function sC(e, t, n) {
	var r = n[0], i = n[1], a = t.resolve(e.before(r - 1));
	return i === r && !a.nodeBefore;
}
function cC(e) {
	for (var t, n = e.depth, r; n && (r = e.node(n), r.type.name !== "tableBodyCell");) {
		if (r.type.name === "listItem") {
			var i = e.node(n - 1).lastChild === r, a = ((t = r.lastChild) == null ? void 0 : t.type.name) !== "paragraph";
			return i ? !a : !1;
		}
		--n;
	}
	return !1;
}
function lC(e, t, n, r, i) {
	var a = t[0], o = t[1], s = t[2];
	if (e === "left" || e === "up") {
		if (i && !sC(n, r, [a, o])) return !1;
		var c = n.before(s);
		if (r.resolve(c).nodeBefore) return !1;
	}
	return !0;
}
function uC(e, t, n, r, i) {
	if (e === "right" || e === "down") {
		if (i && !cC(n)) return !1;
		var a = n.after(t);
		if (r.resolve(a).nodeAfter) return !1;
	}
	return !0;
}
function dC(e, t, n, r) {
	var i = t[0], a = t[1], o = i + 3, s = a >= o, c = s ? i + 1 : a, l = lC(e, [
		a,
		o,
		c
	], n, r, s), u = uC(e, c, n, r, s);
	return l && u;
}
function fC(e, t, n) {
	var r = n[0], i = n[1], a = t.getRowspanStartInfo(r, i), o = e === "up" && r === 0, s = e === "down" && ((a == null ? void 0 : a.count) > 1 ? r + a.count - 1 : r) === t.totalRowCount - 1;
	return o || s;
}
function pC(e, t, n) {
	var r = e.doc.resolve(t.tableStartOffset - 1);
	return r.nodeBefore ? e.setSelection(A.near(r, -1)) : Bu(e, r, n);
}
function mC(e, t, n, r) {
	r === void 0 && (r = !1);
	var i = e.doc.resolve(t.tableEndOffset);
	return r || !i.nodeAfter ? Bu(e, i, n) : e.setSelection(A.near(i, 1));
}
function hC(e, t) {
	var n = e[0], r = e[1], i = t.totalRowCount, a = t.totalColumnCount, o = r === a - 1;
	if (!(n === i - 1 && o)) {
		var s = r + 1, c = t.getColspanStartInfo(n, r);
		return (c == null ? void 0 : c.count) > 1 && (s += c.count - 1), (o || s === a) && (n += 1, s = 0), t.getCellInfo(n, s).offset + 2;
	}
	return null;
}
function gC(e, t) {
	var n = e[0], r = e[1], i = t.totalColumnCount, a = r === 0;
	if (!(n === 0 && a)) {
		--r, a && (--n, r = i - 1);
		var o = t.getCellInfo(n, r);
		return o.offset + o.nodeSize - 2;
	}
	return null;
}
function _C(e, t) {
	var n = e[0], r = e[1];
	if (n > 0) {
		var i = t.getCellInfo(n - 1, r);
		return i.offset + i.nodeSize - 2;
	}
	return null;
}
function vC(e, t) {
	var n = e[0], r = e[1];
	if (n < t.totalRowCount - 1) {
		var i = n + 1, a = t.getRowspanStartInfo(n, r);
		return (a == null ? void 0 : a.count) > 1 && (i += a.count - 1), t.getCellInfo(i, r).offset + 2;
	}
	return null;
}
function yC(e, t, n, r) {
	var i = oC[e], a = i(n, r);
	if (a) {
		var o = e === "right" || e === "down" ? 1 : -1;
		return t.setSelection(A.near(t.doc.resolve(a), o));
	}
	return null;
}
function bC(e, t, n) {
	var r = n[0], i = n[1];
	if (e === "up" || e === "down") return !1;
	var a = t.tableStartOffset, o = t.tableEndOffset, s = t.getCellInfo(r, i), c = s.offset, l = s.nodeSize;
	return (e === "left" ? a : o) === (e === "left" ? c - 2 : c + l + 3);
}
function xC(e, t, n) {
	var r = e.doc.resolve(t.before(n - 3));
	return e.setSelection(new M(r));
}
function SC(e, t, n) {
	var r, i, a;
	return e === "up" ? (r = n.startRowIdx, i = 0, a = -1) : (r = n.endRowIdx, i = t.totalColumnCount - 1, a = t.getCellInfo(r, i).nodeSize + 1), {
		targetRowIdx: r,
		insertColIdx: i,
		nodeSize: a
	};
}
function CC(e, t, n) {
	var r = e.getCellInfo(t, 0).offset, i = e.getCellInfo(t, n - 1);
	return {
		from: r,
		to: i.offset + i.nodeSize
	};
}
var wC = function(e) {
	P(t, e);
	function t() {
		return e !== null && e.apply(this, arguments) || this;
	}
	return Object.defineProperty(t.prototype, "name", {
		get: function() {
			return "table";
		},
		enumerable: !1,
		configurable: !0
	}), Object.defineProperty(t.prototype, "schema", {
		get: function() {
			return {
				content: "tableHead{1} tableBody{1}",
				group: "block",
				attrs: F({ rawHTML: { default: null } }, X()),
				parseDOM: [$b("table")],
				toDOM: function(e) {
					var t = e.attrs;
					return [
						"table",
						Z(t),
						0
					];
				}
			};
		},
		enumerable: !1,
		configurable: !0
	}), t.prototype.addTable = function() {
		return function(e) {
			return e === void 0 && (e = {
				rowCount: 2,
				columnCount: 1,
				data: []
			}), function(t, n) {
				var r = e.rowCount, i = e.columnCount, a = e.data, o = t.schema, s = t.selection, c = t.tr, l = s.from, u = s.to, d = s.$from;
				if (l === u && !Zb(d)) {
					var f = o.nodes, p = f.tableHead, m = f.tableBody, h = a == null ? void 0 : a.slice(0, i), g = a == null ? void 0 : a.slice(i, a.length), _ = Dx(i, o, h), v = Ox(r - 1, i, o, g), y = o.nodes.table.create(null, [p.create(null, _), m.create(null, v)]);
					return n(c.replaceSelectionWith(y)), !0;
				}
				return !1;
			};
		};
	}, t.prototype.removeTable = function() {
		return function() {
			return function(e, t) {
				var n = e.selection, r = e.tr, i = xx.create(n.$anchor);
				if (i) {
					var a = i.tableStartOffset, o = i.tableEndOffset, s = a - 1, c = z(r.delete(s, o), s);
					return t(r.setSelection(c)), !0;
				}
				return !1;
			};
		};
	}, t.prototype.addColumn = function(e) {
		return function() {
			return function(t, n) {
				var r = t.selection, i = t.tr, a = t.schema, o = Mx(r), s = o.anchor, c = o.head;
				if (s && c) {
					for (var l = xx.create(s), u = l.getRectOffsets(s, c), d = e === "left" ? u.startColIdx : u.endColIdx + 1, f = Px(u).columnCount, p = l.totalRowCount, m = 0; m < p; m += 1) {
						var h = kx(f, m, a);
						i.insert(i.mapping.map(l.posAt(m, d)), h);
					}
					return n(i), !0;
				}
				return !1;
			};
		};
	}, t.prototype.removeColumn = function() {
		return function() {
			return function(e, t) {
				var n = e.selection, r = e.tr, i = Mx(n), a = i.anchor, o = i.head;
				if (a && o) {
					var s = xx.create(a), c = s.getRectOffsets(a, o), l = s.totalColumnCount, u = s.totalRowCount;
					if (Px(c).columnCount === l) return !1;
					for (var d = c.startColIdx, f = c.endColIdx, p = r.mapping.maps.length, m = 0; m < u; m += 1) for (var h = f; h >= d; --h) {
						var g = s.getCellInfo(m, h), _ = g.offset, v = g.nodeSize, y = r.mapping.slice(p).map(_), b = y + v;
						r.delete(y, b);
					}
					return t(r), !0;
				}
				return !1;
			};
		};
	}, t.prototype.addRow = function(e) {
		return function() {
			return function(t, n) {
				var r = t.selection, i = t.schema, a = t.tr, o = Mx(r), s = o.anchor, c = o.head;
				if (s && c) {
					var l = xx.create(s), u = l.totalColumnCount, d = l.getRectOffsets(s, c), f = Px(d).rowCount, p = SC(e, l, d), m = p.targetRowIdx, h = p.insertColIdx, g = p.nodeSize;
					if (m !== 0) {
						for (var _ = [], v = a.mapping.map(l.posAt(m, h)) + g, y = [], b = 0; b < u; b += 1) y = y.concat(kx(1, m, i));
						for (var x = 0; x < f; x += 1) _.push(i.nodes.tableRow.create(null, y));
						return n(a.insert(v, _)), !0;
					}
				}
				return !1;
			};
		};
	}, t.prototype.removeRow = function() {
		return function() {
			return function(e, t) {
				var n = e.selection, r = e.tr, i = Mx(n), a = i.anchor, o = i.head;
				if (a && o) {
					var s = xx.create(a), c = s.totalRowCount, l = s.totalColumnCount, u = s.getRectOffsets(a, o), d = Px(u).rowCount, f = u.startRowIdx, p = u.endRowIdx, m = f === 0;
					if (d === c - 1 || m) return !1;
					for (var h = p; h >= f; --h) {
						var g = CC(s, h, l), _ = g.from, v = g.to;
						r.delete(_ - 1, v + 1);
					}
					return t(r), !0;
				}
				return !1;
			};
		};
	}, t.prototype.alignColumn = function() {
		return function(e) {
			return e === void 0 && (e = { align: "center" }), function(t, n) {
				var r = e.align, i = t.selection, a = t.tr, o = Mx(i), s = o.anchor, c = o.head;
				if (s && c) {
					for (var l = xx.create(s), u = l.totalRowCount, d = l.getRectOffsets(s, c), f = d.startColIdx, p = d.endColIdx, m = 0; m < u; m += 1) for (var h = f; h <= p; h += 1) if (!l.extendedRowspan(m, h) && !l.extendedColspan(m, h)) {
						var g = l.getNodeAndPos(m, h), _ = g.node, v = g.pos, y = Fx(_, { align: r });
						a.setNodeMarkup(v, null, y);
					}
					return n(a), !0;
				}
				return !1;
			};
		};
	}, t.prototype.moveToCell = function(e) {
		return function(t, n) {
			var r = t.selection, i = t.tr, a = t.schema, o = Mx(r), s = o.anchor, c = o.head;
			if (s && c) {
				var l = xx.create(s), u = l.getCellIndex(s), d = void 0;
				if (d = fC(e, l, u) ? mC(i, l, a) : yC(e, i, u, l), d) return n(d), !0;
			}
			return !1;
		};
	}, t.prototype.moveInCell = function(e) {
		var t = this;
		return function(n, r) {
			var i = n.selection, a = n.tr, o = n.doc, s = n.schema, c = i.$from;
			if (!t.context.view.endOfTextblock(e)) return !1;
			var l = Yb(c, function(e) {
				var t = e.type;
				return t.name === "tableHeadCell" || t.name === "tableBodyCell";
			});
			if (l) {
				var u = Yb(c, function(e) {
					return e.type.name === "paragraph";
				}), d = l.depth;
				if (u && dC(e, [d, u.depth], c, o)) {
					var f = Mx(i).anchor, p = xx.create(f), m = p.getCellIndex(f), h = void 0;
					if (bC(e, p, m) ? h = xC(a, c, d) : fC(e, p, m) ? e === "up" ? h = pC(a, p, s) : e === "down" && (h = mC(a, p, s)) : h = yC(e, a, m, p), h) return r(h), !0;
				}
			}
			return !1;
		};
	}, t.prototype.deleteCells = function() {
		return function(e, t) {
			var n = e.schema, r = e.selection, i = e.tr, a = Mx(r), o = a.anchor, s = a.head, c = r instanceof j;
			if (o && s && !c) {
				for (var l = xx.create(o), u = l.getRectOffsets(o, s), d = u.startRowIdx, f = u.startColIdx, p = u.endRowIdx, m = u.endColIdx, h = d; h <= p; h += 1) for (var g = f; g <= m; g += 1) if (!l.extendedRowspan(h, g) && !l.extendedColspan(h, g)) {
					var _ = l.getNodeAndPos(h, g), v = _.node, y = _.pos, b = kx(1, h, n, v.attrs);
					i.replaceWith(i.mapping.map(y), i.mapping.map(y + v.nodeSize), b);
				}
				return t(i), !0;
			}
			return !1;
		};
	}, t.prototype.exitTable = function() {
		return function(e, t) {
			var n = e.selection, r = e.tr, i = e.schema, a = n.$from;
			if (Yb(a, function(e) {
				var t = e.type;
				return t.name === "tableHeadCell" || t.name === "tableBodyCell";
			}) && Yb(a, function(e) {
				return e.type.name === "paragraph";
			})) {
				var o = Mx(n).anchor;
				return t(mC(r, xx.create(o), i, !0)), !0;
			}
			return !1;
		};
	}, t.prototype.commands = function() {
		return {
			addTable: this.addTable(),
			removeTable: this.removeTable(),
			addColumnToLeft: this.addColumn("left"),
			addColumnToRight: this.addColumn("right"),
			removeColumn: this.removeColumn(),
			addRowToUp: this.addRow("up"),
			addRowToDown: this.addRow("down"),
			removeRow: this.removeRow(),
			alignColumn: this.alignColumn()
		};
	}, t.prototype.keymaps = function() {
		var e = this.deleteCells();
		return {
			Tab: this.moveToCell("right"),
			"Shift-Tab": this.moveToCell("left"),
			ArrowUp: this.moveInCell("up"),
			ArrowDown: this.moveInCell("down"),
			ArrowLeft: this.moveInCell("left"),
			ArrowRight: this.moveInCell("right"),
			Backspace: e,
			"Mod-Backspace": e,
			Delete: e,
			"Mod-Delete": e,
			"Mod-Enter": this.exitTable()
		};
	}, t;
}(U), TC = function(e) {
	P(t, e);
	function t() {
		return e !== null && e.apply(this, arguments) || this;
	}
	return Object.defineProperty(t.prototype, "name", {
		get: function() {
			return "tableHead";
		},
		enumerable: !1,
		configurable: !0
	}), Object.defineProperty(t.prototype, "schema", {
		get: function() {
			return {
				content: "tableRow{1}",
				attrs: F({ rawHTML: { default: null } }, X()),
				parseDOM: [$b("thead")],
				toDOM: function(e) {
					var t = e.attrs;
					return [
						"thead",
						Z(t),
						0
					];
				}
			};
		},
		enumerable: !1,
		configurable: !0
	}), t;
}(U), EC = function(e) {
	P(t, e);
	function t() {
		return e !== null && e.apply(this, arguments) || this;
	}
	return Object.defineProperty(t.prototype, "name", {
		get: function() {
			return "tableBody";
		},
		enumerable: !1,
		configurable: !0
	}), Object.defineProperty(t.prototype, "schema", {
		get: function() {
			return {
				content: "tableRow+",
				attrs: F({ rawHTML: { default: null } }, X()),
				parseDOM: [{
					tag: "tbody",
					getAttrs: function(e) {
						var t = e.querySelectorAll("tr")[0].children.length, n = e.getAttribute("data-raw-html");
						return t ? F({}, n && { rawHTML: n }) : !1;
					}
				}],
				toDOM: function(e) {
					var t = e.attrs;
					return [
						"tbody",
						Z(t),
						0
					];
				}
			};
		},
		enumerable: !1,
		configurable: !0
	}), t;
}(U), DC = function(e) {
	P(t, e);
	function t() {
		return e !== null && e.apply(this, arguments) || this;
	}
	return Object.defineProperty(t.prototype, "name", {
		get: function() {
			return "tableRow";
		},
		enumerable: !1,
		configurable: !0
	}), Object.defineProperty(t.prototype, "schema", {
		get: function() {
			return {
				content: "(tableHeadCell | tableBodyCell)*",
				attrs: F({ rawHTML: { default: null } }, X()),
				parseDOM: [{
					tag: "tr",
					getAttrs: function(e) {
						var t = e.children.length, n = e.getAttribute("data-raw-html");
						return t ? F({}, n && { rawHTML: n }) : !1;
					}
				}],
				toDOM: function(e) {
					var t = e.attrs;
					return [
						"tr",
						Z(t),
						0
					];
				}
			};
		},
		enumerable: !1,
		configurable: !0
	}), t;
}(U), OC = function(e) {
	P(t, e);
	function t() {
		return e !== null && e.apply(this, arguments) || this;
	}
	return Object.defineProperty(t.prototype, "name", {
		get: function() {
			return "tableHeadCell";
		},
		enumerable: !1,
		configurable: !0
	}), Object.defineProperty(t.prototype, "schema", {
		get: function() {
			return {
				content: "paragraph+",
				attrs: F({
					align: { default: null },
					className: { default: null },
					rawHTML: { default: null },
					colspan: { default: null },
					extended: { default: null }
				}, X()),
				isolating: !0,
				parseDOM: [tx("th")],
				toDOM: function(e) {
					var t = e.attrs, n = ex(t);
					return [
						"th",
						F(F({}, n), Z(t)),
						0
					];
				}
			};
		},
		enumerable: !1,
		configurable: !0
	}), t;
}(U), kC = function(e) {
	P(t, e);
	function t() {
		return e !== null && e.apply(this, arguments) || this;
	}
	return Object.defineProperty(t.prototype, "name", {
		get: function() {
			return "tableBodyCell";
		},
		enumerable: !1,
		configurable: !0
	}), Object.defineProperty(t.prototype, "schema", {
		get: function() {
			return {
				content: "(paragraph | bulletList | orderedList)+",
				attrs: {
					align: { default: null },
					className: { default: null },
					rawHTML: { default: null },
					colspan: { default: null },
					rowspan: { default: null },
					extended: { default: null }
				},
				isolating: !0,
				parseDOM: [tx("td")],
				toDOM: function(e) {
					var t = e.attrs;
					return [
						"td",
						ex(t),
						0
					];
				}
			};
		},
		enumerable: !1,
		configurable: !0
	}), t;
}(U), AC = function(e) {
	P(t, e);
	function t() {
		return e !== null && e.apply(this, arguments) || this;
	}
	return Object.defineProperty(t.prototype, "name", {
		get: function() {
			return "image";
		},
		enumerable: !1,
		configurable: !0
	}), Object.defineProperty(t.prototype, "schema", {
		get: function() {
			return {
				inline: !0,
				attrs: F({
					imageUrl: { default: "" },
					altText: { default: null },
					rawHTML: { default: null }
				}, X()),
				group: "inline",
				selectable: !1,
				parseDOM: [{
					tag: "img[src]",
					getAttrs: function(e) {
						var t = _b(e, { RETURN_DOM_FRAGMENT: !0 }).firstChild, n = t.getAttribute("src") || "", r = t.getAttribute("data-raw-html"), i = t.getAttribute("alt");
						return F({
							imageUrl: n,
							altText: i
						}, r && { rawHTML: r });
					}
				}],
				toDOM: function(e) {
					var t = e.attrs;
					return [t.rawHTML || "img", F(F({ src: gu(t.imageUrl) }, t.altText && { alt: t.altText }), Z(t))];
				}
			};
		},
		enumerable: !1,
		configurable: !0
	}), t.prototype.addImage = function() {
		return function(e) {
			return function(t, n) {
				var r = t.schema, i = t.tr, a = e, o = a.imageUrl, s = a.altText;
				if (!o) return !1;
				var c = r.nodes.image.createAndFill(F({ imageUrl: o }, s && { altText: s }));
				return n(i.replaceSelectionWith(c).scrollIntoView()), !0;
			};
		};
	}, t.prototype.commands = function() {
		return { addImage: this.addImage() };
	}, t;
}(U), jC = 1, MC = function(e) {
	P(t, e);
	function t() {
		return e !== null && e.apply(this, arguments) || this;
	}
	return Object.defineProperty(t.prototype, "name", {
		get: function() {
			return "thematicBreak";
		},
		enumerable: !1,
		configurable: !0
	}), Object.defineProperty(t.prototype, "schema", {
		get: function() {
			return {
				attrs: F({ rawHTML: { default: null } }, X()),
				group: "block",
				parseDOM: [{ tag: "hr" }],
				selectable: !1,
				toDOM: function(e) {
					var t = e.attrs;
					return [
						"div",
						Z(t),
						[t.rawHTML || "hr"]
					];
				}
			};
		},
		enumerable: !1,
		configurable: !0
	}), t.prototype.hr = function() {
		var e = this;
		return function() {
			return function(t, n) {
				var r, i = t.selection, a = i.$from;
				if (a === i.$to) {
					var o = t.doc, s = t.schema.nodes, c = s.thematicBreak, l = s.paragraph, u = [c.create()], d = a.node(jC), f = o.child(o.childCount - 1) === d, p = o.resolve(a.after(jC)), m = ((r = a.nodeAfter) == null ? void 0 : r.type.name) === e.name;
					return (f || m) && u.push(l.create()), n(t.tr.insert(p.pos, u).scrollIntoView()), !0;
				}
				return !1;
			};
		};
	}, t.prototype.commands = function() {
		return { hr: this.hr() };
	}, t.prototype.keymaps = function() {
		var e = this.hr()();
		return {
			"Mod-l": e,
			"Mod-L": e
		};
	}, t;
}(U), NC = function(e) {
	P(t, e);
	function t() {
		return e !== null && e.apply(this, arguments) || this;
	}
	return Object.defineProperty(t.prototype, "name", {
		get: function() {
			return "strong";
		},
		enumerable: !1,
		configurable: !0
	}), Object.defineProperty(t.prototype, "schema", {
		get: function() {
			var e = ["b", "strong"].map(function(e) {
				return {
					tag: e,
					getAttrs: function(e) {
						var t = e.getAttribute("data-raw-html");
						return F({}, t && { rawHTML: t });
					}
				};
			});
			return {
				attrs: F({ rawHTML: { default: null } }, X()),
				parseDOM: e,
				toDOM: function(e) {
					var t = e.attrs;
					return [t.rawHTML || "strong", Z(t)];
				}
			};
		},
		enumerable: !1,
		configurable: !0
	}), t.prototype.bold = function() {
		return function() {
			return function(e, t) {
				return yc(e.schema.marks.strong)(e, t);
			};
		};
	}, t.prototype.commands = function() {
		return { bold: this.bold() };
	}, t.prototype.keymaps = function() {
		var e = this.bold()();
		return {
			"Mod-b": e,
			"Mod-B": e
		};
	}, t;
}(K), PC = function(e) {
	P(t, e);
	function t() {
		return e !== null && e.apply(this, arguments) || this;
	}
	return Object.defineProperty(t.prototype, "name", {
		get: function() {
			return "emph";
		},
		enumerable: !1,
		configurable: !0
	}), Object.defineProperty(t.prototype, "schema", {
		get: function() {
			var e = ["i", "em"].map(function(e) {
				return {
					tag: e,
					getAttrs: function(e) {
						var t = e.getAttribute("data-raw-html");
						return F({}, t && { rawHTML: t });
					}
				};
			});
			return {
				attrs: F({ rawHTML: { default: null } }, X()),
				parseDOM: e,
				toDOM: function(e) {
					var t = e.attrs;
					return [t.rawHTML || "em", Z(t)];
				}
			};
		},
		enumerable: !1,
		configurable: !0
	}), t.prototype.italic = function() {
		return function() {
			return function(e, t) {
				return yc(e.schema.marks.emph)(e, t);
			};
		};
	}, t.prototype.commands = function() {
		return { italic: this.italic() };
	}, t.prototype.keymaps = function() {
		var e = this.italic()();
		return {
			"Mod-i": e,
			"Mod-I": e
		};
	}, t;
}(K), FC = function(e) {
	P(t, e);
	function t() {
		return e !== null && e.apply(this, arguments) || this;
	}
	return Object.defineProperty(t.prototype, "name", {
		get: function() {
			return "strike";
		},
		enumerable: !1,
		configurable: !0
	}), Object.defineProperty(t.prototype, "schema", {
		get: function() {
			var e = ["s", "del"].map(function(e) {
				return {
					tag: e,
					getAttrs: function(e) {
						var t = e.getAttribute("data-raw-html");
						return F({}, t && { rawHTML: t });
					}
				};
			});
			return {
				attrs: F({ rawHTML: { default: null } }, X()),
				parseDOM: e,
				toDOM: function(e) {
					var t = e.attrs;
					return [t.rawHTML || "del", Z(t)];
				}
			};
		},
		enumerable: !1,
		configurable: !0
	}), t.prototype.commands = function() {
		return function() {
			return function(e, t) {
				return yc(e.schema.marks.strike)(e, t);
			};
		};
	}, t.prototype.keymaps = function() {
		var e = this.commands()();
		return {
			"Mod-s": e,
			"Mod-S": e
		};
	}, t;
}(K), IC = function(e) {
	P(t, e);
	function t(t) {
		var n = e.call(this) || this;
		return n.linkAttributes = t, n;
	}
	return Object.defineProperty(t.prototype, "name", {
		get: function() {
			return "link";
		},
		enumerable: !1,
		configurable: !0
	}), Object.defineProperty(t.prototype, "schema", {
		get: function() {
			var e = this;
			return {
				attrs: F({
					linkUrl: { default: "" },
					title: { default: null },
					rawHTML: { default: null }
				}, X()),
				inclusive: !1,
				parseDOM: [{
					tag: "a[href]",
					getAttrs: function(e) {
						var t = _b(e, { RETURN_DOM_FRAGMENT: !0 }).firstChild, n = t.getAttribute("href") || "", r = t.getAttribute("title") || "", i = t.getAttribute("data-raw-html");
						return F({
							linkUrl: n,
							title: r
						}, i && { rawHTML: i });
					}
				}],
				toDOM: function(t) {
					var n = t.attrs;
					return [n.rawHTML || "a", F(F({ href: gu(n.linkUrl) }, e.linkAttributes), Z(n))];
				}
			};
		},
		enumerable: !1,
		configurable: !0
	}), t.prototype.addLink = function() {
		return function(e) {
			return function(t, n) {
				var r = e, i = r.linkUrl, a = r.linkText, o = a === void 0 ? "" : a, s = t.schema, c = t.tr, l = t.selection, u = l.empty, d = l.from, f = l.to;
				if (d && f && i) {
					var p = { linkUrl: i }, m = s.mark("link", p);
					if (u && o) {
						var h = R(s, o, m);
						c.replaceRangeWith(d, f, h);
					} else c.addMark(d, f, m);
					return n(c.scrollIntoView()), !0;
				}
				return !1;
			};
		};
	}, t.prototype.toggleLink = function() {
		return function(e) {
			return function(t, n) {
				return yc(t.schema.marks.link, e)(t, n);
			};
		};
	}, t.prototype.commands = function() {
		return {
			addLink: this.addLink(),
			toggleLink: this.toggleLink()
		};
	}, t;
}(K), LC = function(e) {
	P(t, e);
	function t() {
		return e !== null && e.apply(this, arguments) || this;
	}
	return Object.defineProperty(t.prototype, "name", {
		get: function() {
			return "code";
		},
		enumerable: !1,
		configurable: !0
	}), Object.defineProperty(t.prototype, "schema", {
		get: function() {
			return {
				attrs: F({ rawHTML: { default: null } }, X()),
				parseDOM: [{
					tag: "code",
					getAttrs: function(e) {
						var t = e.getAttribute("data-raw-html");
						return F({}, t && { rawHTML: t });
					}
				}],
				toDOM: function(e) {
					var t = e.attrs;
					return [t.rawHTML || "code", Z(t)];
				}
			};
		},
		enumerable: !1,
		configurable: !0
	}), t.prototype.commands = function() {
		return function() {
			return function(e, t) {
				return yc(e.schema.marks.code)(e, t);
			};
		};
	}, t.prototype.keymaps = function() {
		var e = this.commands()();
		return {
			"Shift-Mod-c": e,
			"Shift-Mod-C": e
		};
	}, t;
}(K), RC = function(e) {
	P(t, e);
	function t() {
		return e !== null && e.apply(this, arguments) || this;
	}
	return Object.defineProperty(t.prototype, "name", {
		get: function() {
			return "customBlock";
		},
		enumerable: !1,
		configurable: !0
	}), Object.defineProperty(t.prototype, "schema", {
		get: function() {
			return {
				content: "text*",
				group: "block",
				attrs: { info: { default: null } },
				atom: !0,
				code: !0,
				defining: !0,
				parseDOM: [{
					tag: "div[data-custom-info]",
					getAttrs: function(e) {
						return { info: e.getAttribute("data-custom-info") };
					}
				}],
				toDOM: function(e) {
					return [
						"div",
						{ "data-custom-info": e.attrs.info || null },
						0
					];
				}
			};
		},
		enumerable: !1,
		configurable: !0
	}), t.prototype.commands = function() {
		return function(e) {
			return function(t, n) {
				return e != null && e.info ? gc(t.schema.nodes.customBlock, e)(t, n) : !1;
			};
		};
	}, t;
}(U), zC = function(e) {
	P(t, e);
	function t() {
		return e !== null && e.apply(this, arguments) || this;
	}
	return Object.defineProperty(t.prototype, "name", {
		get: function() {
			return "frontMatter";
		},
		enumerable: !1,
		configurable: !0
	}), Object.defineProperty(t.prototype, "schema", {
		get: function() {
			return {
				content: "text*",
				group: "block",
				code: !0,
				defining: !0,
				parseDOM: [{
					preserveWhitespace: "full",
					tag: "div[data-front-matter]"
				}],
				toDOM: function() {
					return [
						"div",
						{ "data-front-matter": "true" },
						0
					];
				}
			};
		},
		enumerable: !1,
		configurable: !0
	}), t.prototype.commands = function() {
		return function() {
			return function(e, t, n) {
				var r = e.selection.$from;
				return n.endOfTextblock("down") && r.node().type.name === "frontMatter" ? ic(e, t) : !1;
			};
		};
	}, t.prototype.keymaps = function() {
		return { Enter: this.commands()() };
	}, t;
}(U), BC = function(e) {
	P(t, e);
	function t() {
		return e !== null && e.apply(this, arguments) || this;
	}
	return Object.defineProperty(t.prototype, "name", {
		get: function() {
			return "htmlComment";
		},
		enumerable: !1,
		configurable: !0
	}), Object.defineProperty(t.prototype, "schema", {
		get: function() {
			return {
				content: "text*",
				group: "block",
				code: !0,
				defining: !0,
				parseDOM: [{
					preserveWhitespace: "full",
					tag: "div[data-html-comment]"
				}],
				toDOM: function() {
					return [
						"div",
						{ "data-html-comment": "true" },
						0
					];
				}
			};
		},
		enumerable: !1,
		configurable: !0
	}), t.prototype.commands = function() {
		return function() {
			return function(e, t, n) {
				var r = e.selection.$from;
				return n.endOfTextblock("down") && r.node().type.name === "htmlComment" ? ic(e, t) : !1;
			};
		};
	}, t.prototype.keymaps = function() {
		return { Enter: this.commands()() };
	}, t;
}(U);
function VC(e) {
	return new vf([
		new XS(),
		new ZS(),
		new $S(),
		new eC(),
		new tC(),
		new nC(),
		new rC(),
		new iC(),
		new aC(),
		new wC(),
		new TC(),
		new EC(),
		new DC(),
		new OC(),
		new kC(),
		new AC(),
		new MC(),
		new NC(),
		new PC(),
		new FC(),
		new IC(e),
		new LC(),
		new RC(),
		new zC(),
		new ff(),
		new BC()
	]);
}
var HC = V("contents"), UC = function(e) {
	P(t, e);
	function t(t, n) {
		var r = e.call(this, t) || this, i = n.toDOMAdaptor, a = n.htmlSchemaMap, o = a === void 0 ? {} : a, s = n.linkAttributes, c = s === void 0 ? {} : s, l = n.useCommandShortcut, u = l === void 0 || l, d = n.wwPlugins, f = d === void 0 ? [] : d, p = n.wwNodeViews, m = p === void 0 ? {} : p;
		return r.editorType = "wysiwyg", r.el.classList.add("ww-mode"), r.toDOMAdaptor = i, r.linkAttributes = c, r.extraPlugins = f, r.pluginNodeViews = m, r.specs = r.createSpecs(), r.schema = r.createSchema(o), r.context = r.createContext(), r.keymaps = r.createKeymaps(u), r.view = r.createView(), r.commands = r.createCommands(), r.specs.setContext(F(F({}, r.context), { view: r.view })), r.initEvent(), r;
	}
	return t.prototype.createSpecs = function() {
		return VC(this.linkAttributes);
	}, t.prototype.createContext = function() {
		return {
			schema: this.schema,
			eventEmitter: this.eventEmitter
		};
	}, t.prototype.createSchema = function(e) {
		return new $e({
			nodes: F(F({}, this.specs.nodes), e.nodes),
			marks: F(F({}, this.specs.marks), e.marks)
		});
	}, t.prototype.createPlugins = function() {
		return rl([
			Vx(),
			Kx(this.eventEmitter),
			qx(),
			tS(this.eventEmitter)
		], this.createPluginProps(), !0).concat(this.defaultPlugins);
	}, t.prototype.createPluginNodeViews = function() {
		var e = this, t = e.eventEmitter, n = e.pluginNodeViews, r = {};
		return n && Object.keys(n).forEach(function(e) {
			r[e] = function(r, i, a) {
				return n[e](r, i, a, t);
			};
		}), r;
	}, t.prototype.createView = function() {
		var e = this, t = this, n = t.toDOMAdaptor, r = t.eventEmitter;
		return new ws(this.el, {
			state: this.createState(),
			attributes: { class: HC },
			nodeViews: F({
				customBlock: function(e, t, r) {
					return new nS(e, t, r, n);
				},
				image: function(e, t, n) {
					return new iS(e, t, n, r);
				},
				codeBlock: function(e, t, n) {
					return new sS(e, t, n, r);
				},
				widget: uf
			}, this.createPluginNodeViews()),
			dispatchTransaction: function(t) {
				var n = e.view.state.applyTransaction(t).state;
				e.view.updateState(n), e.emitChangeEvent(t.scrollIntoView()), e.eventEmitter.emit("setFocusedNode", n.selection.$from.node(1));
			},
			transformPastedHTML: DS,
			transformPasted: function(t) {
				return LS(t, e.schema, Zb(e.view.state.selection.$from));
			},
			handlePaste: function(e, t, n) {
				return qS(e, n);
			},
			handleKeyDown: function(t, n) {
				return e.eventEmitter.emit("keydown", e.editorType, n), !1;
			},
			handleDOMEvents: {
				paste: function(t, n) {
					var r = n.clipboardData || window.clipboardData, i = r == null ? void 0 : r.items;
					if (i && !Ru(i).some(function(e) {
						return e.kind === "string" && e.type === "text/rtf";
					})) {
						var a = cf(i);
						a && (n.preventDefault(), sf(e.eventEmitter, a, n.type));
					}
					return !1;
				},
				keyup: function(t, n) {
					return e.eventEmitter.emit("keyup", e.editorType, n), !1;
				},
				scroll: function() {
					return e.eventEmitter.emit("scroll", "editor"), !0;
				}
			}
		});
	}, t.prototype.createCommands = function() {
		return this.specs.commands(this.view, yx());
	}, t.prototype.getHTML = function() {
		return ef(this.view.dom.innerHTML);
	}, t.prototype.getModel = function() {
		return this.view.state.doc;
	}, t.prototype.getSelection = function() {
		var e = this.view.state.selection;
		return [e.from, e.to];
	}, t.prototype.getSchema = function() {
		return this.view.state.schema;
	}, t.prototype.replaceSelection = function(e, t, n) {
		var r = this.view.state, i = r.schema, a = r.tr, o = e.split("\n").map(function(e) {
			return zu(i, gd(e, i));
		}), s = new D(T.from(o), 1, 1), c = Jl(t) && Jl(n) ? a.replaceRange(t, n, s) : a.replaceSelection(s);
		this.view.dispatch(c), this.focus();
	}, t.prototype.deleteSelection = function(e, t) {
		var n = this.view.state.tr, r = Jl(e) && Jl(t) ? n.deleteRange(e, t) : n.deleteSelection();
		this.view.dispatch(r.scrollIntoView());
	}, t.prototype.getSelectedText = function(e, t) {
		var n = this.view.state, r = n.doc, i = n.selection, a = i.from, o = i.to;
		return Jl(e) && Jl(t) && (a = e, o = t), r.textBetween(a, o, "\n");
	}, t.prototype.setModel = function(e, t) {
		t === void 0 && (t = !1);
		var n = this.view.state, r = n.tr, i = n.doc;
		this.view.dispatch(r.replaceWith(0, i.content.size, e)), t && this.moveCursorToEnd(!0);
	}, t.prototype.setSelection = function(e, t) {
		t === void 0 && (t = e);
		var n = this.view.state.tr, r = z(n, e, t);
		this.view.dispatch(n.setSelection(r).scrollIntoView());
	}, t.prototype.addWidget = function(e, t, n) {
		var r = this.view, i = r.dispatch, a = r.state;
		i(a.tr.setMeta("widget", {
			pos: n == null ? a.selection.to : n,
			node: e,
			style: t
		}));
	}, t.prototype.replaceWithWidget = function(e, t, n) {
		var r = this.view.state, i = r.tr, a = r.schema, o = gd(n, a);
		this.view.dispatch(i.replaceWith(e, t, o));
	}, t.prototype.getRangeInfoOfNode = function(e) {
		var t = this.view.state, n = t.doc, r = t.selection, i = e ? n.resolve(e) : r.$from, a = i.marks(), o = i.node(), s = i.start(), c = i.end(), l = o.type.name;
		if (a.length || l === "paragraph") {
			var u = a[a.length - 1], d = function(e) {
				return !e.length || L(e, u);
			};
			l = u ? u.type.name : "text", o.forEach(function(e, t) {
				var n = e.isText, r = e.nodeSize, a = e.marks, o = i.pos - s;
				n && t <= o && t + r >= o && d(a) && (s += t, c = s + r);
			});
		}
		return {
			range: [s, c],
			type: l
		};
	}, t;
}(pf), WC = Dl, GC = Xl;
function KC(e) {
	return !WC(e) && !GC(e);
}
var qC = KC;
function JC(e) {
	return qC(e) && e !== !1;
}
var YC = JC;
function XC(e) {
	return !YC(e);
}
var ZC = XC, QC = /* @__PURE__ */ "afterPreviewRender.updatePreview.changeMode.needChangeMode.command.changePreviewStyle.changePreviewTabPreview.changePreviewTabWrite.scroll.contextmenu.show.hide.changeLanguage.changeToolbarState.toggleScrollSync.mixinTableOffsetMapPrototype.setFocusedNode.removePopupWidget.query.openPopup.closePopup.addImageBlobHook.beforePreviewRender.beforeConvertWysiwygToMarkdown.load.loadUI.change.caretChange.destroy.focus.blur.keydown.keyup".split("."), $C = function() {
	function e() {
		var e = this;
		this.events = new Hx(), this.eventTypes = QC.reduce(function(e, t) {
			return F(F({}, e), { type: t });
		}, {}), this.hold = !1, QC.forEach(function(t) {
			e.addEventType(t);
		});
	}
	return e.prototype.listen = function(e, t) {
		var n = this.getTypeInfo(e), r = this.events.get(n.type) || [];
		if (!this.hasEventType(n.type)) throw Error(`There is no event type ${n.type}`);
		n.namespace && (t.namespace = n.namespace), r.push(t), this.events.set(n.type, r);
	}, e.prototype.emit = function(e) {
		var t = [...arguments].slice(1), n = this.getTypeInfo(e), r = this.events.get(n.type), i = [];
		return !this.hold && r && r.forEach(function(e) {
			var n = e.apply(void 0, t);
			Dl(n) || i.push(n);
		}), i;
	}, e.prototype.emitReduce = function(e, t) {
		var n = [...arguments].slice(2), r = this.events.get(e);
		return !this.hold && r && r.forEach(function(e) {
			var r = e.apply(void 0, rl([t], n, !1));
			ZC(r) || (t = r);
		}), t;
	}, e.prototype.getTypeInfo = function(e) {
		var t = e.split(".");
		return {
			type: t[0],
			namespace: t[1]
		};
	}, e.prototype.hasEventType = function(e) {
		return !Dl(this.eventTypes[this.getTypeInfo(e).type]);
	}, e.prototype.addEventType = function(e) {
		if (this.hasEventType(e)) throw Error(`There is already have event type ${e}`);
		this.eventTypes[e] = e;
	}, e.prototype.removeEventHandler = function(e, t) {
		var n = this, r = this.getTypeInfo(e), i = r.type, a = r.namespace;
		i && t ? this.removeEventHandlerWithHandler(i, t) : i && !a ? this.events.delete(i) : !i && a ? this.events.forEach(function(e, t) {
			n.removeEventHandlerWithTypeInfo(t, a);
		}) : i && a && this.removeEventHandlerWithTypeInfo(i, a);
	}, e.prototype.removeEventHandlerWithHandler = function(e, t) {
		var n = this.events.get(e);
		if (n) {
			var r = n.indexOf(t);
			n.indexOf(t) >= 0 && n.splice(r, 1);
		}
	}, e.prototype.removeEventHandlerWithTypeInfo = function(e, t) {
		var n = [], r = this.events.get(e);
		r && (r.map(function(e) {
			return e.namespace !== t && n.push(e), null;
		}), this.events.set(e, n));
	}, e.prototype.getEvents = function() {
		return this.events;
	}, e.prototype.holdEventInvoke = function(e) {
		this.hold = !0, e(), this.hold = !1;
	}, e;
}(), ew = function() {
	function e(e, t, n, r) {
		this.eventEmitter = e, this.mdCommands = t, this.wwCommands = n, this.getEditorType = r, this.initEvent();
	}
	return e.prototype.initEvent = function() {
		var e = this;
		this.eventEmitter.listen("command", function(t, n) {
			e.exec(t, n);
		});
	}, e.prototype.addCommand = function(e, t, n) {
		e === "markdown" ? this.mdCommands[t] = n : this.wwCommands[t] = n;
	}, e.prototype.deleteCommand = function(e, t) {
		e === "markdown" ? delete this.mdCommands[t] : delete this.wwCommands[t];
	}, e.prototype.exec = function(e, t) {
		this.getEditorType() === "markdown" ? this.mdCommands[e](t) : this.wwCommands[e](t);
	}, e;
}();
function tw(e) {
	return e[e.length - 1] === "\n" ? e.slice(0, e.length - 1) : e;
}
function nw(e, t) {
	var n = e.schema, r = t.literal.match(Pd);
	if (r) {
		var i = r[1], a = r[3], o = (i || a).toLowerCase();
		return t.type === "htmlInline" && !!(n.marks[o] || n.nodes[o]);
	}
	return !1;
}
function rw(e) {
	var t = e.type;
	return L([
		"text",
		"strong",
		"emph",
		"strike",
		"image",
		"link",
		"code"
	], t);
}
function iw(e) {
	return (e == null ? void 0 : e.type) === "softbreak";
}
function aw(e) {
	var t = e.type, n = e.literal, r = t === "htmlInline" && n.match(Pd);
	if (r) {
		var i = r[1], a = r[3], o = i || a;
		if (o) return L([
			"ul",
			"ol",
			"li"
		], o.toLowerCase());
	}
	return !1;
}
function ow(e) {
	var t = e.literal;
	return {
		task: /data-task/.test(t),
		checked: /data-task-checked/.test(t)
	};
}
function sw(e) {
	var t = [...arguments].slice(1), n = document.createElement("div");
	n.innerHTML = _b(e);
	var r = n.firstChild;
	return t.map(function(e) {
		return r.getAttribute(e) || "";
	});
}
function cw(e) {
	var t = {};
	return Object.keys(e).forEach(function(n) {
		n.split(", ").forEach(function(r) {
			var i = r.toLowerCase();
			t[i] = e[n];
		});
	}), t;
}
var lw = cw({
	"b, strong": function(e, t, n) {
		var r = e.schema.marks.strong;
		n ? e.openMark(r.create({ rawHTML: n })) : e.closeMark(r);
	},
	"i, em": function(e, t, n) {
		var r = e.schema.marks.emph;
		n ? e.openMark(r.create({ rawHTML: n })) : e.closeMark(r);
	},
	"s, del": function(e, t, n) {
		var r = e.schema.marks.strike;
		n ? e.openMark(r.create({ rawHTML: n })) : e.closeMark(r);
	},
	code: function(e, t, n) {
		var r = e.schema.marks.code;
		n ? e.openMark(r.create({ rawHTML: n })) : e.closeMark(r);
	},
	a: function(e, t, n) {
		var r = t.literal, i = e.schema.marks.link;
		if (n) {
			var a = sw(r, "href")[0];
			e.openMark(i.create({
				linkUrl: a,
				rawHTML: n
			}));
		} else e.closeMark(i);
	},
	img: function(e, t, n) {
		var r = t.literal;
		if (n) {
			var i = sw(r, "src", "alt"), a = i[0], o = i[1], s = e.schema.nodes.image;
			e.addNode(s, F({
				rawHTML: n,
				imageUrl: a
			}, o && { altText: o }));
		}
	},
	hr: function(e, t, n) {
		e.addNode(e.schema.nodes.thematicBreak, { rawHTML: n });
	},
	br: function(e, t) {
		var n = e.schema.nodes.paragraph, r = t.parent, i = t.prev, a = t.next;
		(r == null ? void 0 : r.type) === "paragraph" ? (iw(i) && e.openNode(n), iw(a) ? e.closeNode() : a && (e.closeNode(), e.openNode(n))) : (r == null ? void 0 : r.type) === "tableCell" && (i && (rw(i) || nw(e, i)) && e.closeNode(), a && (rw(a) || nw(e, a)) && e.openNode(n));
	},
	pre: function(e, t, n) {
		var r, i, a = document.createElement("div");
		a.innerHTML = t.literal;
		var o = (i = (r = a.firstChild) == null ? void 0 : r.firstChild) == null ? void 0 : i.textContent;
		e.openNode(e.schema.nodes.codeBlock, { rawHTML: n }), e.addText(tw(o)), e.closeNode();
	},
	"ul, ol": function(e, t, n) {
		if (t.parent.type === "tableCell") {
			var r = e.schema.nodes, i = r.bulletList, a = r.orderedList, o = r.paragraph, s = n === "ul" ? i : a;
			n ? (t.prev && !aw(t.prev) && e.closeNode(), e.openNode(s, { rawHTML: n })) : (e.closeNode(), t.next && !aw(t.next) && e.openNode(o));
		}
	},
	li: function(e, t, n) {
		var r;
		if (((r = t.parent) == null ? void 0 : r.type) === "tableCell") {
			var i = e.schema.nodes, a = i.listItem, o = i.paragraph;
			if (n) {
				var s = ow(t);
				t.prev && !aw(t.prev) && e.closeNode(), e.openNode(a, F({ rawHTML: n }, s)), t.next && !aw(t.next) && e.openNode(o);
			} else t.prev && !aw(t.prev) && e.closeNode(), e.closeNode();
		}
	}
});
function uw(e) {
	return e.type === "htmlInline" && Fd.test(e.literal);
}
function dw(e) {
	Ru(e.childNodes).forEach(function(e) {
		if (Vd(e)) {
			var t = e.nodeName.toLowerCase();
			e.setAttribute("data-raw-html", t), e.childNodes && dw(e);
		}
	});
}
var fw = {
	text: function(e, t) {
		e.addText(t.literal || "");
	},
	paragraph: function(e, t, n, r) {
		var i;
		if (n.entering) {
			var a = e.schema.nodes.paragraph;
			((i = t.prev) == null ? void 0 : i.type) === "paragraph" && (e.openNode(a, r), e.closeNode()), e.openNode(a, r);
		} else e.closeNode();
	},
	heading: function(e, t, n, r) {
		if (n.entering) {
			var i = t, a = i.level, o = i.headingType;
			e.openNode(e.schema.nodes.heading, F({
				level: a,
				headingType: o
			}, r));
		} else e.closeNode();
	},
	codeBlock: function(e, t, n) {
		var r = e.schema.nodes.codeBlock, i = t, a = i.info, o = i.literal;
		e.openNode(r, F({ language: a }, n)), e.addText(tw(o || "")), e.closeNode();
	},
	list: function(e, t, n, r) {
		if (n.entering) {
			var i = e.schema.nodes, a = i.bulletList, o = i.orderedList, s = t.listData, c = s.type, l = s.start;
			c === "bullet" ? e.openNode(a, r) : e.openNode(o, F({ order: l }, r));
		} else e.closeNode();
	},
	item: function(e, t, n, r) {
		var i = n.entering, a = e.schema.nodes.listItem, o = t.listData, s = o.task, c = o.checked;
		if (i) {
			var l = F(F(F({}, s && { task: s }), c && { checked: c }), r);
			e.openNode(a, l);
		} else e.closeNode();
	},
	blockQuote: function(e, t, n, r) {
		n.entering ? e.openNode(e.schema.nodes.blockQuote, r) : e.closeNode();
	},
	image: function(e, t, n, r) {
		var i = n.entering, a = n.skipChildren, o = e.schema.nodes.image, s = t, c = s.destination, l = s.firstChild;
		i && a && a(), e.addNode(o, F(F({ imageUrl: c }, l && { altText: l.literal }), r));
	},
	thematicBreak: function(e, t, n, r) {
		e.addNode(e.schema.nodes.thematicBreak, r);
	},
	strong: function(e, t, n, r) {
		var i = n.entering, a = e.schema.marks.strong;
		i ? e.openMark(a.create(r)) : e.closeMark(a);
	},
	emph: function(e, t, n, r) {
		var i = n.entering, a = e.schema.marks.emph;
		i ? e.openMark(a.create(r)) : e.closeMark(a);
	},
	link: function(e, t, n, r) {
		var i = n.entering, a = e.schema.marks.link, o = t, s = o.destination, c = o.title;
		if (i) {
			var l = F({
				linkUrl: s,
				title: c
			}, r);
			e.openMark(a.create(l));
		} else e.closeMark(a);
	},
	softbreak: function(e, t) {
		if (t.parent.type === "paragraph") {
			var n = t.prev, r = t.next;
			n && !uw(n) && e.closeNode(), r && !uw(r) && e.openNode(e.schema.nodes.paragraph);
		}
	},
	table: function(e, t, n, r) {
		n.entering ? e.openNode(e.schema.nodes.table, r) : e.closeNode();
	},
	tableHead: function(e, t, n, r) {
		n.entering ? e.openNode(e.schema.nodes.tableHead, r) : e.closeNode();
	},
	tableBody: function(e, t, n, r) {
		n.entering ? e.openNode(e.schema.nodes.tableBody, r) : e.closeNode();
	},
	tableRow: function(e, t, n, r) {
		n.entering ? e.openNode(e.schema.nodes.tableRow, r) : e.closeNode();
	},
	tableCell: function(e, t, n) {
		var r = n.entering;
		if (!t.ignored) {
			var i = function(t) {
				return t && (rw(t) || nw(e, t));
			};
			if (r) {
				var a = e.schema.nodes, o = a.tableHeadCell, s = a.tableBodyCell, c = a.paragraph, l = t.parent.parent, u = l.type === "tableHead" ? o : s, d = (l.parent.columns[t.startIdx] || {}).align, f = F({}, t.attrs);
				d && (f.align = d), e.openNode(u, f), i(t.firstChild) && e.openNode(c);
			} else i(t.lastChild) && e.closeNode(), e.closeNode();
		}
	},
	strike: function(e, t, n, r) {
		var i = n.entering, a = e.schema.marks.strike;
		i ? e.openMark(a.create(r)) : e.closeMark(a);
	},
	code: function(e, t, n, r) {
		var i = e.schema.marks.code;
		e.openMark(i.create(r)), e.addText(tw(t.literal || "")), e.closeMark(i);
	},
	customBlock: function(e, t) {
		var n = e.schema.nodes, r = n.customBlock, i = n.paragraph, a = t, o = a.info, s = a.literal;
		e.openNode(r, { info: o }), e.addText(tw(s || "")), e.closeNode(), t.next || (e.openNode(i), e.closeNode());
	},
	frontMatter: function(e, t) {
		e.openNode(e.schema.nodes.frontMatter), e.addText(t.literal), e.closeNode();
	},
	htmlInline: function(e, t) {
		var n = t.literal, r = n.match(Pd), i = r[1], a = r[3], o = (i || a).toLowerCase(), s = e.schema.marks[o], c = _b(n);
		if (s != null && s.spec.attrs.htmlInline) {
			if (i) {
				var l = yb(c);
				e.openMark(s.create({ htmlAttrs: l }));
			} else e.closeMark(s);
		} else {
			var u = lw[o];
			u && u(e, t, i);
		}
	},
	htmlBlock: function(e, t) {
		var n = t.literal, r = document.createElement("div");
		if (Id.test(n)) e.openNode(e.schema.nodes.htmlComment), e.addText(t.literal), e.closeNode();
		else {
			var i = n.match(Pd), a = i[1], o = i[3], s = (a || o).toLowerCase(), c = e.schema.nodes[s], l = _b(n);
			if (c != null && c.spec.attrs.htmlBlock) {
				var u = yb(l), d = vb(t, s);
				e.addNode(c, {
					htmlAttrs: u,
					childrenHTML: d
				});
			} else r.innerHTML = l, dw(r), e.convertByDOMParser(r);
		}
	},
	customInline: function(e, t, n) {
		var r = n.entering, i = n.skipChildren, a = t, o = a.info, s = a.firstChild, c = e.schema;
		if (o.indexOf("widget") !== -1 && r) {
			var l = _d(t);
			i(), e.addNode(c.nodes.widget, { info: o }, [c.text(dd(o, l))]);
		} else {
			var u = "$$";
			r && (u += s ? `${o} ` : o), e.addText(u);
		}
	}
};
function pw(e) {
	var t = Object.keys(e), n = F({}, fw), r = new uy({
		gfm: !0,
		nodeId: !0,
		convertors: e
	}).getConvertors();
	return t.forEach(function(t) {
		var i = fw[t];
		i && !L(["htmlBlock", "htmlInline"], t) && (n[t] = function(n, a, o) {
			o.origin = function() {
				return r[t](a, o, r);
			};
			var s = e[t](a, o), c;
			if (s) {
				var l = Array.isArray(s) ? s[0] : s;
				c = {
					htmlAttrs: l.attributes,
					classNames: l.classNames
				};
			}
			i(n, a, o, c);
		});
	}), n;
}
function mw(e, t) {
	return e.isText && t.isText && E.sameSet(e.marks, t.marks) ? e.withText(e.text + t.text) : !1;
}
var hw = function() {
	function e(e, t) {
		this.schema = e, this.convertors = t, this.stack = [{
			type: this.schema.topNodeType,
			attrs: null,
			content: []
		}], this.marks = E.none;
	}
	return e.prototype.top = function() {
		return Ou(this.stack);
	}, e.prototype.push = function(e) {
		this.stack.length && this.top().content.push(e);
	}, e.prototype.addText = function(e) {
		if (e) {
			var t = this.top().content, n = Ou(t), r = this.schema.text(e, this.marks), i = n && mw(n, r);
			i ? t[t.length - 1] = i : t.push(r);
		}
	}, e.prototype.openMark = function(e) {
		this.marks = e.addToSet(this.marks);
	}, e.prototype.closeMark = function(e) {
		this.marks = e.removeFromSet(this.marks);
	}, e.prototype.addNode = function(e, t, n) {
		var r = e.createAndFill(t, n, this.marks);
		return r ? (this.push(r), r) : null;
	}, e.prototype.openNode = function(e, t) {
		this.stack.push({
			type: e,
			attrs: t,
			content: []
		});
	}, e.prototype.closeNode = function() {
		this.marks.length && (this.marks = E.none);
		var e = this.stack.pop(), t = e.type, n = e.attrs, r = e.content;
		return this.addNode(t, n, r);
	}, e.prototype.convertByDOMParser = function(e) {
		var t = this;
		rt.fromSchema(this.schema).parse(e).content.forEach(function(e) {
			return t.push(e);
		});
	}, e.prototype.closeUnmatchedHTMLInline = function(e, t) {
		var n;
		if (!t && e.type !== "htmlInline") for (var r = this.stack.length - 1; r >= 0; --r) {
			var i = this.stack[r];
			if ((n = i.attrs) != null && n.rawHTML) i.content.length ? this.closeNode() : this.stack.pop();
			else break;
		}
	}, e.prototype.convert = function(e, t) {
		for (var n = e.walker(), r = n.next(), i = function() {
			var e = r.node, i = r.entering, o = a.convertors[e.type], s = !1;
			if (o) {
				var c = {
					entering: i,
					leaf: !ad(e),
					getChildrenText: od,
					options: {
						gfm: !0,
						nodeId: !1,
						tagFilter: !1,
						softbreak: "\n"
					},
					skipChildren: function() {
						s = !0;
					}
				};
				if (a.closeUnmatchedHTMLInline(e, i), o(a, e, c), (t == null ? void 0 : t.node) === e) {
					var l = a.stack.reduce(function(e, t) {
						return e + t.content.reduce(function(e, t) {
							return e + t.nodeSize;
						}, 0);
					}, 0) + 1;
					t.setMappedPos(l);
				}
			}
			s && (n.resumeAt(e, !1), n.next()), r = n.next();
		}, a = this; r;) i();
	}, e.prototype.convertNode = function(e, t) {
		return this.convert(e, t), this.stack.length ? this.closeNode() : null;
	}, e;
}();
function gw(e, t, n) {
	var r = n[0], i = n[1];
	e.write(r), e.convertInline(t), e.write(i);
}
function _w(e, t, n) {
	var r = t.node, i = t.parent, a = n[0], o = n[1];
	e.stopNewline = !0, e.write(a), e.convertNode(r), e.write(o), (i == null ? void 0 : i.type.name) === "doc" && (e.closeBlock(r), e.stopNewline = !1);
}
function vw(e, t) {
	var n = e.length, r = "", i = "";
	return t === "left" ? (r = ":", --n) : t === "right" ? (i = ":", --n) : t === "center" && (r = ":", i = ":", n -= 2), `${r}${xu("-", Math.max(n, 3))}${i}`;
}
var yw = {
	text: function(e, t) {
		var n, r = t.node, i = (n = r.text) == null ? "" : n;
		(r.marks || []).some(function(e) {
			return e.type.name === "link";
		}) ? e.text(Cu(i), !1) : e.text(i);
	},
	paragraph: function(e, t) {
		var n = t.node, r = t.parent, i = t.index, a = i === void 0 ? 0 : i;
		if (e.stopNewline) e.convertInline(n);
		else {
			var o = a === 0, s = !o && r.child(a - 1), c = s && s.childCount === 0, l = a < r.childCount - 1 && r.child(a + 1), u = l && l.type.name === "paragraph", d = n.childCount === 0;
			if (d && c) e.write("<br>\n");
			else if (d && !c && !o) {
				if ((r == null ? void 0 : r.type.name) === "listItem") {
					var f = e.getDelim();
					e.setDelim(""), e.write("<br>"), e.setDelim(f);
				}
				e.write("\n");
			} else e.convertInline(n), u ? e.write("\n") : e.closeBlock(n);
		}
	},
	heading: function(e, t, n) {
		var r = t.node, i = n.delim;
		r.attrs.headingType === "atx" ? (e.write(`${i} `), e.convertInline(r), e.closeBlock(r)) : (e.convertInline(r), e.ensureNewLine(), e.write(i), e.closeBlock(r));
	},
	codeBlock: function(e, t, n) {
		var r = t.node, i = n.delim, a = n.text, o = i, s = o[0], c = o[1];
		e.write(s), e.ensureNewLine(), e.text(a, !1), e.ensureNewLine(), e.write(c), e.closeBlock(r);
	},
	blockQuote: function(e, t, n) {
		var r = t.node, i = t.parent, a = n.delim;
		(i == null ? void 0 : i.type.name) === r.type.name && e.flushClose(1), e.wrapBlock(a, null, r, function() {
			return e.convertNode(r);
		});
	},
	bulletList: function(e, t, n) {
		var r = t.node, i = n.delim;
		e.convertList(r, xu(" ", 4), function() {
			return `${i} `;
		});
	},
	orderedList: function(e, t) {
		var n = t.node, r = n.attrs.order || 1;
		e.convertList(n, xu(" ", 4), function(e) {
			return `${String(r + e)}. `;
		});
	},
	listItem: function(e, t) {
		var n = t.node, r = n.attrs, i = r.task, a = r.checked;
		i && e.write(`[${a ? "x" : " "}] `), e.convertNode(n);
	},
	image: function(e, t, n) {
		var r = n.attrs;
		e.write(`![${r == null ? void 0 : r.altText}](${r == null ? void 0 : r.imageUrl})`);
	},
	thematicBreak: function(e, t, n) {
		var r = t.node, i = n.delim;
		e.write(i), e.closeBlock(r);
	},
	table: function(e, t) {
		var n = t.node;
		e.convertNode(n), e.closeBlock(n);
	},
	tableHead: function(e, t, n) {
		var r = t.node, i = n.delim, a = r.firstChild;
		e.convertNode(r);
		var o = i == null ? "" : i;
		!i && a && a.forEach(function(e) {
			var t = e.textContent, n = e.attrs, r = vw(t, n.align);
			o += `| ${r} `;
		}), e.write(`${o}|`), e.ensureNewLine();
	},
	tableBody: function(e, t) {
		var n = t.node;
		e.convertNode(n);
	},
	tableRow: function(e, t) {
		var n = t.node;
		e.convertNode(n), e.write("|"), e.ensureNewLine();
	},
	tableHeadCell: function(e, t, n) {
		var r = t.node, i = n.delim, a = i === void 0 ? "| " : i;
		e.write(a), e.convertTableCell(r), e.write(" ");
	},
	tableBodyCell: function(e, t, n) {
		var r = t.node, i = n.delim, a = i === void 0 ? "| " : i;
		e.write(a), e.convertTableCell(r), e.write(" ");
	},
	customBlock: function(e, t, n) {
		var r = t.node, i = n.delim, a = n.text, o = i, s = o[0], c = o[1];
		e.write(s), e.ensureNewLine(), e.text(a, !1), e.ensureNewLine(), e.write(c), e.closeBlock(r);
	},
	frontMatter: function(e, t, n) {
		var r = t.node, i = n.text;
		e.text(i, !1), e.closeBlock(r);
	},
	widget: function(e, t, n) {
		var r = n.text;
		e.write(r);
	},
	html: function(e, t, n) {
		var r = t.node, i = n.text;
		e.write(i), r.attrs.htmlBlock && e.closeBlock(r);
	},
	htmlComment: function(e, t, n) {
		var r = t.node, i = n.text;
		e.write(i), e.closeBlock(r);
	}
};
function bw(e, t) {
	var n = t.state, r = t.nodeInfo, i = t.params, a = i.rawHTML;
	a ? Tl(e, ["heading", "codeBlock"]) > -1 ? gw(n, r.node, a) : Tl(e, ["image", "thematicBreak"]) > -1 ? n.write(a) : _w(n, r, a) : yw[e](n, r, i);
}
function xw(e, t) {
	var n = e.text, r = /`+/g, i = 0;
	if (e.isText && n) for (var a = r.exec(n); a;) i = Math.max(i, a[0].length), a = r.exec(n);
	for (var o = i > 0 && t > 0 ? " `" : "`", s = 0; s < i; s += 1) o += "`";
	return i > 0 && t < 0 && (o += " "), o;
}
function Sw(e) {
	return e ? [`<${e}>`, `</${e}>`] : null;
}
function Cw(e) {
	return e ? `<${e}>` : null;
}
function ww(e) {
	return e ? `</${e}>` : null;
}
var Tw = {
	heading: function(e) {
		var t = e.node.attrs, n = t.level, r = xu("#", n);
		return t.headingType === "setext" && (r = n === 1 ? "===" : "---"), {
			delim: r,
			rawHTML: Sw(t.rawHTML)
		};
	},
	codeBlock: function(e) {
		var t = e.node, n = t.attrs, r = t.textContent;
		return {
			delim: [`\`\`\`${n.language || ""}`, "```"],
			rawHTML: Sw(n.rawHTML),
			text: r
		};
	},
	blockQuote: function(e) {
		var t = e.node;
		return {
			delim: "> ",
			rawHTML: Sw(t.attrs.rawHTML)
		};
	},
	bulletList: function(e, t) {
		var n = e.node, r = t.inTable, i = n.attrs.rawHTML;
		return r && (i = i || "ul"), {
			delim: "*",
			rawHTML: Sw(i)
		};
	},
	orderedList: function(e, t) {
		var n = e.node, r = t.inTable, i = n.attrs.rawHTML;
		return r && (i = i || "ol"), { rawHTML: Sw(i) };
	},
	listItem: function(e, t) {
		var n = e.node, r = t.inTable, i = n.attrs, a = i.task, o = i.checked, s = n.attrs.rawHTML;
		return r && (s = s || "li"), { rawHTML: s ? [`<${s}${a ? ` class="task-list-item${o ? " checked" : ""}"` : ""}${a ? ` data-task${o ? " data-task-checked" : ""}` : ""}>`, `</${s}>`] : null };
	},
	table: function(e) {
		var t = e.node;
		return { rawHTML: Sw(t.attrs.rawHTML) };
	},
	tableHead: function(e) {
		var t = e.node;
		return { rawHTML: Sw(t.attrs.rawHTML) };
	},
	tableBody: function(e) {
		var t = e.node;
		return { rawHTML: Sw(t.attrs.rawHTML) };
	},
	tableRow: function(e) {
		var t = e.node;
		return { rawHTML: Sw(t.attrs.rawHTML) };
	},
	tableHeadCell: function(e) {
		var t = e.node;
		return { rawHTML: Sw(t.attrs.rawHTML) };
	},
	tableBodyCell: function(e) {
		var t = e.node;
		return { rawHTML: Sw(t.attrs.rawHTML) };
	},
	image: function(e) {
		var t = e.node.attrs, n = t.rawHTML, r = t.altText, i = t.imageUrl.replace(/&amp;/g, "&"), a = r ? ` alt="${gu(r)}"` : "";
		return {
			rawHTML: n ? `<${n} src="${gu(i)}"${a}>` : null,
			attrs: {
				altText: Cu(r || ""),
				imageUrl: i
			}
		};
	},
	thematicBreak: function(e) {
		var t = e.node;
		return {
			delim: "***",
			rawHTML: Cw(t.attrs.rawHTML)
		};
	},
	customBlock: function(e) {
		var t = e.node, n = t.attrs, r = t.textContent;
		return {
			delim: [`\$\$${n.info}`, "$$"],
			text: r
		};
	},
	frontMatter: function(e) {
		return { text: e.node.textContent };
	},
	widget: function(e) {
		return { text: e.node.textContent };
	},
	strong: function(e, t) {
		var n = e.node, r = t.entering, i = n.attrs.rawHTML;
		return {
			delim: "**",
			rawHTML: r ? Cw(i) : ww(i)
		};
	},
	emph: function(e, t) {
		var n = e.node, r = t.entering, i = n.attrs.rawHTML;
		return {
			delim: "*",
			rawHTML: r ? Cw(i) : ww(i)
		};
	},
	strike: function(e, t) {
		var n = e.node, r = t.entering, i = n.attrs.rawHTML;
		return {
			delim: "~~",
			rawHTML: r ? Cw(i) : ww(i)
		};
	},
	link: function(e, t) {
		var n = e.node, r = t.entering, i = n.attrs, a = i.title, o = i.rawHTML, s = i.linkUrl.replace(/&amp;/g, "&"), c = a ? ` title="${gu(a)}"` : "";
		return r ? {
			delim: "[",
			rawHTML: o ? `<${o} href="${gu(s)}"${c}>` : null
		} : {
			delim: `](${s}${a ? ` ${Tu(Cu(a))}` : ""})`,
			rawHTML: ww(o)
		};
	},
	code: function(e, t) {
		var n = e.node, r = e.parent, i = e.index, a = i === void 0 ? 0 : i, o = t.entering;
		return {
			delim: o ? xw(r.child(a), -1) : xw(r.child(a - 1), 1),
			rawHTML: o ? Cw(n.attrs.rawHTML) : ww(n.attrs.rawHTML)
		};
	},
	htmlComment: function(e) {
		return { text: e.node.textContent };
	},
	html: function(e, t) {
		var n = e.node, r = t.entering, i = n.type.name, a = n.attrs.htmlAttrs, o = `<${i}`, s = `</${i}>`;
		return Object.keys(a).forEach(function(e) {
			o += ` ${e}="${a[e].replace(/"/g, "'")}"`;
		}), o += ">", n.attrs.htmlInline ? { rawHTML: r ? o : s } : { text: `${o}${n.attrs.childrenHTML}${s}` };
	}
}, Ew = {
	strong: {
		mixable: !0,
		removedEnclosingWhitespace: !0
	},
	emph: {
		mixable: !0,
		removedEnclosingWhitespace: !0
	},
	strike: {
		mixable: !0,
		removedEnclosingWhitespace: !0
	},
	code: { escape: !1 },
	link: null,
	html: null
};
function Dw(e) {
	var t = {};
	return Object.keys(yw).forEach(function(n) {
		t[n] = function(t, r) {
			if (yw[n]) {
				var i = e[n];
				bw(n, {
					state: t,
					nodeInfo: r,
					params: i ? i(r, { inTable: t.inTable }) : {}
				});
			}
		};
	}), t;
}
function Ow(e) {
	var t = {};
	return Object.keys(Ew).forEach(function(n) {
		t[n] = function(t, r) {
			var i = Ew[n], a = e[n], o = a && t && !Dl(r) ? a(t, { entering: r }) : {};
			return F(F({}, o), i);
		};
	}), t;
}
function kw(e) {
	return Object.keys(e).forEach(function(t) {
		var n = Tw[t], r = e[t];
		Tw[t] = n ? function(e, t) {
			return t.origin = function() {
				return n(e, t);
			}, r(e, t);
		} : r, delete e[t];
	}), {
		nodeTypeConvertors: Dw(Tw),
		markTypeConvertors: Ow(Tw)
	};
}
var Aw = function() {
	function e(e) {
		var t = e.nodeTypeConvertors, n = e.markTypeConvertors;
		this.nodeTypeConvertors = t, this.markTypeConvertors = n, this.delim = "", this.result = "", this.closed = !1, this.tightList = !1, this.stopNewline = !1, this.inTable = !1;
	}
	return e.prototype.getMarkConvertor = function(e) {
		var t = e.attrs.htmlInline ? "html" : e.type.name;
		return this.markTypeConvertors[t];
	}, e.prototype.isInBlank = function() {
		return /(^|\n)$/.test(this.result);
	}, e.prototype.markText = function(e, t, n, r) {
		var i = this.getMarkConvertor(e);
		if (i) {
			var a = i({
				node: e,
				parent: n,
				index: r
			}, t), o = a.delim;
			return a.rawHTML || o;
		}
		return "";
	}, e.prototype.setDelim = function(e) {
		this.delim = e;
	}, e.prototype.getDelim = function() {
		return this.delim;
	}, e.prototype.flushClose = function(e) {
		if (!this.stopNewline && this.closed) {
			if (this.isInBlank() || (this.result += "\n"), e || (e = 2), e > 1) {
				var t = this.delim, n = /\s+$/.exec(t);
				n && (t = t.slice(0, t.length - n[0].length));
				for (var r = 1; r < e; r += 1) this.result += `${t}
`;
			}
			this.closed = !1;
		}
	}, e.prototype.wrapBlock = function(e, t, n, r) {
		var i = this.getDelim();
		this.write(t || e), this.setDelim(this.getDelim() + e), r(), this.setDelim(i), this.closeBlock(n);
	}, e.prototype.ensureNewLine = function() {
		this.isInBlank() || (this.result += "\n");
	}, e.prototype.write = function(e) {
		e === void 0 && (e = ""), this.flushClose(), this.delim && this.isInBlank() && (this.result += this.delim), e && (this.result += e);
	}, e.prototype.closeBlock = function(e) {
		this.closed = e;
	}, e.prototype.text = function(e, t) {
		t === void 0 && (t = !0);
		for (var n = e.split("\n"), r = 0; r < n.length; r += 1) this.write(), this.result += t ? wu(n[r]) : n[r], r !== n.length - 1 && (this.result += "\n");
	}, e.prototype.convertBlock = function(e, t, n) {
		var r = e.type.name, i = this.nodeTypeConvertors[r], a = {
			node: e,
			parent: t,
			index: n
		};
		e.attrs.htmlBlock ? this.nodeTypeConvertors.html(this, a) : i && i(this, a);
	}, e.prototype.convertInline = function(e) {
		var t = this, n = [], r = "", i = function(i, a, o) {
			var s = i ? i.marks : [], c = r;
			if (r = "", i && i.isText && s.some(function(e) {
				var n = t.getMarkConvertor(e), r = n && n();
				return r && r.removedEnclosingWhitespace;
			}) && i && i.text) {
				var l = /^(\s*)(.*?)(\s*)$/m.exec(i.text), u = l[1], d = l[2], f = l[3];
				c += u, r = f, (u || f) && (i = d ? i.withText(d) : null, i || (s = n));
			}
			for (var p = s.length && Ou(s), m = p && t.getMarkConvertor(p), h = m && m(), g = h && h.escape === !1, _ = s.length - +!!g, v = 0; v < _; v += 1) {
				var d = s[v];
				if (h && !h.mixable) break;
				for (var y = 0; y < n.length; y += 1) {
					var b = n[y];
					if (h && !h.mixable) break;
					if (d.eq(b)) {
						v > y ? s = s.slice(0, y).concat(d).concat(s.slice(y, v)).concat(s.slice(v + 1, _)) : y > v && (s = s.slice(0, v).concat(s.slice(v + 1, y)).concat(d).concat(s.slice(y, _)));
						break;
					}
				}
			}
			for (var x = 0; x < Math.min(n.length, _) && s[x].eq(n[x]);) x += 1;
			for (; x < n.length;) {
				var S = n.pop();
				S && t.text(t.markText(S, !1, e, o), !1);
			}
			if (c && t.text(c), i) {
				for (; n.length < _;) {
					var d = s[n.length];
					n.push(d), t.text(t.markText(d, !0, e, o), !1);
				}
				g && i.isText ? t.text(t.markText(p, !0, e, o) + i.text + t.markText(p, !1, e, o + 1), !1) : t.convertBlock(i, e, o);
			}
		};
		e.forEach(i), i(null, null, e.childCount);
	}, e.prototype.convertList = function(e, t, n) {
		var r = this, i;
		this.closed && this.closed.type === e.type ? this.flushClose(3) : this.tightList && this.flushClose(1);
		var a = (i = e.attrs.tight) == null || i, o = this.tightList;
		this.tightList = a, e.forEach(function(i, o, s) {
			s && a && r.flushClose(1), r.wrapBlock(t, n(s), e, function() {
				return r.convertBlock(i, e, s);
			});
		}), this.tightList = o;
	}, e.prototype.convertTableCell = function(e) {
		var t = this;
		this.stopNewline = !0, this.inTable = !0, e.forEach(function(n, r, i) {
			L(["bulletList", "orderedList"], n.type.name) ? (t.convertBlock(n, e, i), t.closed = !1) : (t.convertInline(n), i < e.childCount - 1 && e.child(i + 1).type.name === "paragraph" && t.write("<br>"));
		}), this.stopNewline = !1, this.inTable = !1;
	}, e.prototype.convertNode = function(e, t) {
		var n = this;
		return e.forEach(function(r, i, a) {
			if (n.convertBlock(r, e, a), (t == null ? void 0 : t.node) === r) {
				var o = n.result.split("\n");
				t.setMappedPos([o.length, Ou(o).length + 1]);
			}
		}), this.result;
	}, e;
}(), jw = function() {
	function e(e, t, n, r) {
		var i = this;
		this.setMappedPos = function(e) {
			i.mappedPosWhenConverting = e;
		}, this.schema = e, this.eventEmitter = r, this.focusedNode = null, this.mappedPosWhenConverting = null, this.toWwConvertors = pw(n), this.toMdConvertors = kw(t || {}), this.eventEmitter.listen("setFocusedNode", function(e) {
			return i.focusedNode = e;
		});
	}
	return e.prototype.getMappedPos = function() {
		return this.mappedPosWhenConverting;
	}, e.prototype.getInfoForPosSync = function() {
		return {
			node: this.focusedNode,
			setMappedPos: this.setMappedPos
		};
	}, e.prototype.toWysiwygModel = function(e) {
		return new hw(this.schema, this.toWwConvertors).convertNode(e, this.getInfoForPosSync());
	}, e.prototype.toMarkdownText = function(e) {
		var t = new Aw(this.toMdConvertors).convertNode(e, this.getInfoForPosSync());
		return t = this.eventEmitter.emitReduce("beforeConvertWysiwygToMarkdown", t), t;
	}, e;
}();
function Mw(e) {
	var t = e.plugin, n = {
		eventEmitter: e.eventEmitter,
		usageStatistics: e.usageStatistics,
		instance: e.instance,
		pmState: {
			Plugin: rr,
			PluginKey: or,
			Selection: A,
			TextSelection: j
		},
		pmView: {
			Decoration: Bo,
			DecorationSet: Uo
		},
		pmModel: { Fragment: T },
		pmRules: {
			InputRule: Ec,
			inputRules: kc,
			undoInputRule: jc
		},
		pmKeymap: { keymap: Ws },
		i18n: Q
	};
	if (dl(t)) {
		var r = t[0], i = t[1];
		return r(n, i === void 0 ? {} : i);
	}
	return t(n);
}
function Nw(e) {
	var t = e.plugins, n = e.eventEmitter, r = e.usageStatistics, i = e.instance;
	return n.listen("mixinTableOffsetMapPrototype", Cx), (t == null ? [] : t).reduce(function(e, t) {
		var a = Mw({
			plugin: t,
			eventEmitter: n,
			usageStatistics: r,
			instance: i
		});
		if (!a) throw Error("The return value of the executed plugin is empty.");
		var o = a.markdownParsers, s = a.toHTMLRenderers, c = a.toMarkdownRenderers, l = a.markdownPlugins, u = a.wysiwygPlugins, d = a.wysiwygNodeViews, f = a.markdownCommands, p = a.wysiwygCommands, m = a.toolbarItems;
		return s && (e.toHTMLRenderers = ju(e.toHTMLRenderers, s)), c && (e.toMarkdownRenderers = ju(e.toMarkdownRenderers, c)), l && (e.mdPlugins = e.mdPlugins.concat(l)), u && (e.wwPlugins = e.wwPlugins.concat(u)), d && (e.wwNodeViews = F(F({}, e.wwNodeViews), d)), f && (e.mdCommands = F(F({}, e.mdCommands), f)), p && (e.wwCommands = F(F({}, e.wwCommands), p)), m && (e.toolbarItems = e.toolbarItems.concat(m)), o && (e.markdownParsers = F(F({}, e.markdownParsers), o)), e;
	}, {
		toHTMLRenderers: {},
		toMarkdownRenderers: {},
		mdPlugins: [],
		wwPlugins: [],
		wwNodeViews: {},
		mdCommands: {},
		wwCommands: {},
		toolbarItems: [],
		markdownParsers: {}
	});
}
var Pw = "data-task", Fw = "data-task-disabled", Iw = "checked";
function Lw(e) {
	["htmlBlock", "htmlInline"].forEach(function(t) {
		e[t] && Object.keys(e[t]).forEach(function(e) {
			return gb(e);
		});
	});
}
var Rw = function() {
	function e(e) {
		var t = this;
		this.options = sl({
			linkAttributes: null,
			extendedAutolinks: !1,
			customHTMLRenderer: null,
			referenceDefinition: !1,
			customHTMLSanitizer: null,
			frontMatter: !1,
			usageStatistics: !0,
			theme: "light"
		}, e), this.eventEmitter = new $C();
		var n = bu(this.options.linkAttributes), r = Nw({
			plugins: this.options.plugins,
			eventEmitter: this.eventEmitter,
			usageStatistics: this.options.usageStatistics,
			instance: this
		}) || {}, i = r.toHTMLRenderers, a = r.markdownParsers, o = this.options, s = o.customHTMLRenderer, c = o.extendedAutolinks, l = o.referenceDefinition, u = o.frontMatter, d = o.customHTMLSanitizer, f = {
			linkAttributes: n,
			customHTMLRenderer: F(F({}, i), s),
			extendedAutolinks: c,
			referenceDefinition: l,
			frontMatter: u,
			sanitizer: d || _b
		};
		Lw(f.customHTMLRenderer), this.options.events && al(this.options.events, function(e, n) {
			t.on(n, e);
		});
		var p = this.options, m = p.el, h = p.initialValue, g = p.theme, _ = m.innerHTML;
		g !== "light" && m.classList.add(V(g)), m.innerHTML = "", this.toastMark = new ry("", {
			disallowedHtmlBlockTags: ["br", "img"],
			extendedAutolinks: c,
			referenceDefinition: l,
			disallowDeepHeading: !0,
			frontMatter: u,
			customParser: a
		}), this.preview = new Jb(this.eventEmitter, F(F({}, f), { isViewer: !0 })), Qm(this.preview.previewContent, "mousedown", this.toggleTask.bind(this)), h ? this.setMarkdown(h) : _ && this.preview.setHTML(_), m.appendChild(this.preview.previewContent), this.eventEmitter.emit("load", this);
	}
	return e.prototype.toggleTask = function(e) {
		var t = e.target, n = getComputedStyle(t, ":before");
		!t.hasAttribute(Fw) && t.hasAttribute(Pw) && Rd(n, e.offsetX, e.offsetY) && (qd(t, Iw), this.eventEmitter.emit("change", {
			source: "viewer",
			date: e
		}));
	}, e.prototype.setMarkdown = function(e) {
		var t = this.toastMark.getLineTexts(), n = [t.length, Ou(t).length + 1], r = this.toastMark.editMarkdown([1, 1], n, e || "");
		this.eventEmitter.emit("updatePreview", r);
	}, e.prototype.on = function(e, t) {
		this.eventEmitter.listen(e, t);
	}, e.prototype.off = function(e) {
		this.eventEmitter.removeEventHandler(e);
	}, e.prototype.addHook = function(e, t) {
		this.eventEmitter.removeEventHandler(e), this.eventEmitter.listen(e, t);
	}, e.prototype.destroy = function() {
		Gm(this.preview.el, "mousedown", this.toggleTask.bind(this)), this.preview.destroy(), this.eventEmitter.emit("destroy");
	}, e.prototype.isViewer = function() {
		return !0;
	}, e.prototype.isMarkdownMode = function() {
		return !1;
	}, e.prototype.isWysiwygMode = function() {
		return !1;
	}, e;
}();
function zw(e) {
	return e instanceof ke;
}
function Bw(e) {
	return L([
		"document",
		"blockQuote",
		"bulletList",
		"orderedList",
		"listItem",
		"paragraph",
		"heading",
		"emph",
		"strong",
		"strike",
		"link",
		"image",
		"table",
		"tableHead",
		"tableBody",
		"tableRow",
		"tableHeadCell",
		"tableBodyCell"
	], e);
}
function Vw(e) {
	var t = e.attrs, n = e.type.name, r = {
		type: n,
		wysiwygNode: !0,
		literal: !Bw(n) && zw(e) ? e.textContent : null
	}, i = {
		heading: { level: t.level },
		link: {
			destination: t.linkUrl,
			title: t.title
		},
		image: { destination: t.imageUrl },
		codeBlock: { info: t.language },
		bulletList: {
			type: "list",
			listData: { type: "bullet" }
		},
		orderedList: {
			type: "list",
			listData: {
				type: "ordered",
				start: t.order
			}
		},
		listItem: {
			type: "item",
			listData: {
				task: t.task,
				checked: t.checked
			}
		},
		tableHeadCell: {
			type: "tableCell",
			cellType: "head",
			align: t.align
		},
		tableBodyCell: {
			type: "tableCell",
			cellType: "body",
			align: t.align
		},
		customBlock: { info: t.info }
	}[n], a = F(F({}, r), i), o = e.attrs, s = o.htmlAttrs, c = o.childrenHTML;
	return s ? F(F({}, a), {
		attrs: s,
		childrenHTML: c
	}) : a;
}
var Hw = {
	openTag: function(e, t) {
		var n = e, r = n.tagName, i = n.classNames, a = n.attributes, o = document.createElement(r), s = {};
		i && (o.className = i.join(" ")), a && (s = F(F({}, s), a)), Qd(s, o), t.push(o);
	},
	closeTag: function(e, t) {
		if (t.length > 1) {
			var n = t.pop();
			Ou(t).appendChild(n);
		}
	},
	html: function(e, t) {
		Ou(t).insertAdjacentHTML("beforeend", e.content);
	},
	text: function(e, t) {
		var n = document.createTextNode(e.content);
		Ou(t).appendChild(n);
	}
}, Uw = function() {
	function e(e, t) {
		var n = Eb(e, t), r = F(F({}, t.htmlBlock), t.htmlInline);
		this.customConvertorKeys = Object.keys(t).concat(Object.keys(r)), this.renderer = new uy({
			gfm: !0,
			convertors: F(F({}, n), r)
		}), this.convertors = this.renderer.getConvertors();
	}
	return e.prototype.generateTokens = function(e) {
		var t = Vw(e), n = {
			entering: !0,
			leaf: zw(e) ? e.isLeaf : !1,
			options: this.renderer.getOptions(),
			getChildrenText: function() {
				return zw(e) ? e.textContent : "";
			},
			skipChildren: function() {
				return !1;
			}
		}, r = this.convertors[e.type.name], i = r(t, n, this.convertors), a = dl(i) ? i : [i];
		return (Bw(e.type.name) || e.attrs.htmlInline) && (n.entering = !1, a.push({
			type: "text",
			content: zw(e) ? e.textContent : ""
		}), a = a.concat(r(t, n, this.convertors))), a;
	}, e.prototype.toDOMNode = function(e) {
		var t = this.generateTokens(e), n = [];
		return t.forEach(function(e) {
			return Hw[e.type](e, n);
		}), n[0];
	}, e.prototype.getToDOMNode = function(e) {
		return L(this.customConvertorKeys, e) ? this.toDOMNode.bind(this) : null;
	}, e;
}(), Ww = 100, Gw = 15, Kw = null, qw = null;
function Jw(e, t) {
	var n = t.syncScrollTop, r = t.releaseEventBlock;
	qw && clearTimeout(qw), n(e), qw = setTimeout(function() {
		r();
	}, Gw);
}
function Yw(e, t, n) {
	var r = t - e, i = Date.now(), a = function() {
		var o = (Date.now() - i) / Ww, s;
		Kw && clearTimeout(Kw), o < 1 ? (s = e + r * Math.cos((1 - o) * Math.PI / 2), Jw(Math.ceil(s), n), Kw = setTimeout(a, 1)) : (Jw(t, n), Kw = null);
	};
	a();
}
var Xw = 18, Zw = function() {
	function e(e, t, n) {
		this.latestEditorScrollTop = null, this.latestPreviewScrollTop = null, this.blockedScroll = null, this.active = !0, this.timer = null;
		var r = t.previewContent, i = t.el;
		this.previewRoot = r, this.previewEl = i, this.mdEditor = e, this.editorView = e.view, this.toastMark = e.getToastMark(), this.eventEmitter = n, this.addScrollSyncEvent();
	}
	return e.prototype.addScrollSyncEvent = function() {
		var e = this;
		this.eventEmitter.listen("afterPreviewRender", function() {
			e.clearTimer(), e.timer = setTimeout(function() {
				e.syncPreviewScrollTop(!0);
			}, 200);
		}), this.eventEmitter.listen("scroll", function(t, n) {
			e.active && (t === "editor" && e.blockedScroll !== "editor" ? e.syncPreviewScrollTop() : t === "preview" && e.blockedScroll !== "preview" && e.syncEditorScrollTop(n));
		}), this.eventEmitter.listen("toggleScrollSync", function(t) {
			e.active = t;
		});
	}, e.prototype.getMdNodeAtPos = function(e, t) {
		var n = e.content.findIndex(t.pos).index;
		return this.toastMark.findFirstNodeAtLine(n + 1);
	}, e.prototype.getScrollTopByCaretPos = function() {
		var e = this.mdEditor.getSelection(), t = this.toastMark.findFirstNodeAtLine(e[0][0]), n = this.previewEl.clientHeight, r = Lb(this.previewRoot, t).el, i = (Nb(r, this.previewRoot) || r.offsetTop) + r.clientHeight - n * .5;
		return this.latestEditorScrollTop = null, r.getBoundingClientRect().top - this.previewEl.getBoundingClientRect().top < n ? null : i;
	}, e.prototype.syncPreviewScrollTop = function(e) {
		e === void 0 && (e = !1);
		var t = this, n = t.editorView, r = t.previewEl, i = t.previewRoot, a = n.dom.getBoundingClientRect(), o = a.left, s = a.top, c = n.posAtCoords({
			left: o,
			top: s
		}), l = n.state.doc, u = this.getMdNodeAtPos(l, c);
		if (!(!u || qu(u))) {
			var d = r.scrollTop, f = n.dom, p = f.scrollTop, m = f.scrollHeight, h = f.clientHeight, g = f.children, _ = m - p <= h + Xw, v = _ ? r.scrollHeight : 0;
			if (p && !_) {
				if (e) {
					var y = this.getScrollTopByCaretPos();
					if (!y) return;
					v = y;
				} else {
					var b = Lb(this.previewRoot, u), x = b.el, S = b.mdNode, ee = Ab(l, S, g), te = ee.height, ne = ee.rect;
					v = (Nb(x, i) || x.offsetTop) + x.clientHeight * (s > ne.top ? Math.min((s - ne.top) / te, 1) : 0);
				}
				v = this.getResolvedScrollTop("editor", p, v, d), this.latestEditorScrollTop = p;
			}
			v !== d && this.run("editor", v, d);
		}
	}, e.prototype.syncEditorScrollTop = function(e) {
		var t = this, n = t.toastMark, r = t.editorView, i = t.previewRoot, a = t.previewEl, o = r.dom, s = r.state, c = a.scrollTop, l = a.clientHeight, u = a.scrollHeight - c <= l, d = o.scrollTop, f = u ? o.scrollHeight : 0;
		if (c && e && !u) {
			if (e = Mb(e, i), !e.getAttribute("data-nodeid")) return;
			var p = o.children, m = Number(e.getAttribute("data-nodeid")), h = Lb(this.previewRoot, n.findNodeById(m)), g = h.mdNode, _ = h.el;
			f = p[Uu(g) - 1].offsetTop;
			var v = Ab(s.doc, g, p).height, y = Gb(_, i, m), b = y.nodeHeight, x = y.offsetTop;
			f += Ib(c, x, b, v), f = this.getResolvedScrollTop("preview", c, f, d), this.latestPreviewScrollTop = c;
		}
		f !== d && this.run("preview", f, d);
	}, e.prototype.getResolvedScrollTop = function(e, t, n, r) {
		var i = e === "editor" ? this.latestEditorScrollTop : this.latestPreviewScrollTop;
		return i === null ? n : i < t ? Math.max(n, r) : Math.min(n, r);
	}, e.prototype.run = function(e, t, n) {
		var r = this, i;
		e === "editor" ? (i = this.previewEl, this.blockedScroll = "preview") : (i = this.editorView.dom, this.blockedScroll = "editor"), Yw(n, t, {
			syncScrollTop: function(e) {
				return i.scrollTop = e;
			},
			releaseEventBlock: function() {
				return r.blockedScroll = null;
			}
		});
	}, e.prototype.clearTimer = function() {
		this.timer && (clearTimeout(this.timer), this.timer = null);
	}, e.prototype.destroy = function() {
		this.clearTimer(), this.eventEmitter.removeEventHandler("scroll"), this.eventEmitter.removeEventHandler("afterPreviewRender");
	}, e;
}(), Qw = { getPopupInitialValues: function(e, t) {
	return t.popupName === "link" ? { linkText: e.getSelectedText() } : {};
} };
function $w(e) {
	e.eventEmitter.listen("query", function(t, n) {
		return Qw[t](e, n);
	});
}
var eT = function() {
	function e(e) {
		var t = this;
		this.initialHTML = e.el.innerHTML, e.el.innerHTML = "", this.options = sl({
			previewStyle: "tab",
			previewHighlight: !0,
			initialEditType: "markdown",
			height: "300px",
			minHeight: "200px",
			language: "en-US",
			useCommandShortcut: !0,
			usageStatistics: !0,
			toolbarItems: [
				[
					"heading",
					"bold",
					"italic",
					"strike"
				],
				["hr", "quote"],
				[
					"ul",
					"ol",
					"task",
					"indent",
					"outdent"
				],
				[
					"table",
					"image",
					"link"
				],
				["code", "codeblock"],
				["scrollSync"]
			],
			hideModeSwitch: !1,
			linkAttributes: null,
			extendedAutolinks: !1,
			customHTMLRenderer: null,
			customMarkdownRenderer: null,
			referenceDefinition: !1,
			customHTMLSanitizer: null,
			frontMatter: !1,
			widgetRules: [],
			theme: "light",
			autofocus: !0
		}, e);
		var n = this.options, r = n.customHTMLRenderer, i = n.extendedAutolinks, a = n.referenceDefinition, o = n.frontMatter, s = n.customMarkdownRenderer, c = n.useCommandShortcut, l = n.initialEditType, u = n.widgetRules, d = n.customHTMLSanitizer;
		this.mode = l || "markdown", this.mdPreviewStyle = this.options.previewStyle, this.i18n = Q, this.i18n.setCode(this.options.language), this.eventEmitter = new $C(), md(u);
		var f = bu(this.options.linkAttributes);
		this.pluginInfo = Nw({
			plugins: this.options.plugins,
			eventEmitter: this.eventEmitter,
			usageStatistics: this.options.usageStatistics,
			instance: this
		});
		var p = this.pluginInfo, m = p.toHTMLRenderers, h = p.toMarkdownRenderers, g = p.mdPlugins, _ = p.wwPlugins, v = p.wwNodeViews, y = p.mdCommands, b = p.wwCommands, x = p.markdownParsers, S = {
			linkAttributes: f,
			customHTMLRenderer: ju(m, r),
			extendedAutolinks: i,
			referenceDefinition: a,
			frontMatter: o,
			sanitizer: d || _b
		}, ee = new Uw(f, S.customHTMLRenderer), te = Cb(S.customHTMLRenderer, S.sanitizer, ee);
		this.toastMark = new ry("", {
			disallowedHtmlBlockTags: ["br", "img"],
			extendedAutolinks: i,
			referenceDefinition: a,
			disallowDeepHeading: !0,
			frontMatter: o,
			customParser: x
		}), this.mdEditor = new Fm(this.eventEmitter, {
			toastMark: this.toastMark,
			useCommandShortcut: c,
			mdPlugins: g
		}), this.preview = new Jb(this.eventEmitter, F(F({}, S), {
			isViewer: !1,
			highlight: this.options.previewHighlight
		})), this.wwEditor = new UC(this.eventEmitter, {
			toDOMAdaptor: ee,
			useCommandShortcut: c,
			htmlSchemaMap: te,
			linkAttributes: f,
			wwPlugins: _,
			wwNodeViews: v
		}), this.convertor = new jw(this.wwEditor.getSchema(), F(F({}, h), s), Eb(f, S.customHTMLRenderer), this.eventEmitter), this.setMinHeight(this.options.minHeight), this.setHeight(this.options.height), this.setMarkdown(this.options.initialValue, !1), this.options.placeholder && this.setPlaceholder(this.options.placeholder), this.options.initialValue || this.setHTML(this.initialHTML, !1), this.commandManager = new ew(this.eventEmitter, this.mdEditor.commands, this.wwEditor.commands, function() {
			return t.mode;
		}), this.options.usageStatistics && _u(), this.scrollSync = new Zw(this.mdEditor, this.preview, this.eventEmitter), this.addInitEvent(), this.addInitCommand(y, b), $w(this), this.options.hooks && al(this.options.hooks, function(e, n) {
			return t.addHook(n, e);
		}), this.options.events && al(this.options.events, function(e, n) {
			return t.on(n, e);
		}), this.eventEmitter.emit("load", this), this.moveCursorToStart(this.options.autofocus);
	}
	return e.prototype.addInitEvent = function() {
		var e = this;
		this.on("needChangeMode", this.changeMode.bind(this)), this.on("loadUI", function() {
			if (e.height !== "auto") {
				var t = `${Math.min(parseInt(e.minHeight, 10), parseInt(e.height, 10) - 75)}px`;
				e.setMinHeight(t);
			}
		}), of(this.eventEmitter);
	}, e.prototype.addInitCommand = function(e, t) {
		var n = this, r = function(e, t) {
			Object.keys(t).forEach(function(r) {
				n.addCommand(e, r, t[r]);
			});
		};
		this.addCommand("markdown", "toggleScrollSync", function(e) {
			return n.eventEmitter.emit("toggleScrollSync", e.active), !0;
		}), r("markdown", e), r("wysiwyg", t);
	}, e.prototype.getCurrentModeEditor = function() {
		return this.isMarkdownMode() ? this.mdEditor : this.wwEditor;
	}, e.factory = function(t) {
		return t.viewer ? new Rw(t) : new e(t);
	}, e.setLanguage = function(e, t) {
		Q.setLanguage(e, t);
	}, e.prototype.changePreviewStyle = function(e) {
		this.mdPreviewStyle !== e && (this.mdPreviewStyle = e, this.eventEmitter.emit("changePreviewStyle", e));
	}, e.prototype.exec = function(e, t) {
		this.commandManager.exec(e, t);
	}, e.prototype.addCommand = function(e, t, n) {
		var r = this;
		this.commandManager.addCommand(e, t, function(t) {
			t === void 0 && (t = {});
			var i = (e === "markdown" ? r.mdEditor : r.wwEditor).view;
			n(t, i.state, i.dispatch, i);
		});
	}, e.prototype.on = function(e, t) {
		this.eventEmitter.listen(e, t);
	}, e.prototype.off = function(e) {
		this.eventEmitter.removeEventHandler(e);
	}, e.prototype.addHook = function(e, t) {
		this.eventEmitter.removeEventHandler(e), this.eventEmitter.listen(e, t);
	}, e.prototype.removeHook = function(e) {
		this.eventEmitter.removeEventHandler(e);
	}, e.prototype.focus = function() {
		this.getCurrentModeEditor().focus();
	}, e.prototype.blur = function() {
		this.getCurrentModeEditor().blur();
	}, e.prototype.moveCursorToEnd = function(e) {
		e === void 0 && (e = !0), this.getCurrentModeEditor().moveCursorToEnd(e);
	}, e.prototype.moveCursorToStart = function(e) {
		e === void 0 && (e = !0), this.getCurrentModeEditor().moveCursorToStart(e);
	}, e.prototype.setMarkdown = function(e, t) {
		if (e === void 0 && (e = ""), t === void 0 && (t = !0), this.mdEditor.setMarkdown(e, t), this.isWysiwygMode()) {
			var n = this.toastMark.getRootNode(), r = this.convertor.toWysiwygModel(n);
			this.wwEditor.setModel(r, t);
		}
	}, e.prototype.setHTML = function(e, t) {
		e === void 0 && (e = ""), t === void 0 && (t = !0);
		var n = document.createElement("div");
		n.innerHTML = $d(e);
		var r = rt.fromSchema(this.wwEditor.schema).parse(n);
		this.isMarkdownMode() ? this.mdEditor.setMarkdown(this.convertor.toMarkdownText(r), t) : this.wwEditor.setModel(r, t);
	}, e.prototype.getMarkdown = function() {
		return this.isMarkdownMode() ? this.mdEditor.getMarkdown() : this.convertor.toMarkdownText(this.wwEditor.getModel());
	}, e.prototype.getHTML = function() {
		var e = this;
		this.eventEmitter.holdEventInvoke(function() {
			if (e.isMarkdownMode()) {
				var t = e.toastMark.getRootNode(), n = e.convertor.toWysiwygModel(t);
				e.wwEditor.setModel(n);
			}
		});
		var t = ef(this.wwEditor.view.dom.innerHTML);
		if (this.placeholder) {
			var n = RegExp(`<span class="placeholder[^>]+>${this.placeholder}</span>`, "i");
			return t.replace(n, "");
		}
		return t;
	}, e.prototype.insertText = function(e) {
		this.getCurrentModeEditor().replaceSelection(e);
	}, e.prototype.setSelection = function(e, t) {
		this.getCurrentModeEditor().setSelection(e, t);
	}, e.prototype.replaceSelection = function(e, t, n) {
		this.getCurrentModeEditor().replaceSelection(e, t, n);
	}, e.prototype.deleteSelection = function(e, t) {
		this.getCurrentModeEditor().deleteSelection(e, t);
	}, e.prototype.getSelectedText = function(e, t) {
		return this.getCurrentModeEditor().getSelectedText(e, t);
	}, e.prototype.getRangeInfoOfNode = function(e) {
		return this.getCurrentModeEditor().getRangeInfoOfNode(e);
	}, e.prototype.addWidget = function(e, t, n) {
		this.getCurrentModeEditor().addWidget(e, t, n);
	}, e.prototype.replaceWithWidget = function(e, t, n) {
		this.getCurrentModeEditor().replaceWithWidget(e, t, n);
	}, e.prototype.setHeight = function(e) {
		var t = this.options.el;
		ll(e) && (e === "auto" ? Bl(t, "auto-height") : Kl(t, "auto-height"), this.setMinHeight(this.getMinHeight())), Sl(t, { height: e }), this.height = e;
	}, e.prototype.getHeight = function() {
		return this.height;
	}, e.prototype.setMinHeight = function(e) {
		if (e !== this.minHeight) {
			var t = this.height || this.options.height;
			t !== "auto" && this.options.el.querySelector(`.${V("main")}`) && (e = `${Math.min(parseInt(e, 10), parseInt(t, 10) - 75)}px`);
			var n = parseInt(e, 10);
			this.minHeight = e, this.wwEditor.setMinHeight(n), this.mdEditor.setMinHeight(n), this.preview.setMinHeight(n);
		}
	}, e.prototype.getMinHeight = function() {
		return this.minHeight;
	}, e.prototype.isMarkdownMode = function() {
		return this.mode === "markdown";
	}, e.prototype.isWysiwygMode = function() {
		return this.mode === "wysiwyg";
	}, e.prototype.isViewer = function() {
		return !1;
	}, e.prototype.getCurrentPreviewStyle = function() {
		return this.mdPreviewStyle;
	}, e.prototype.changeMode = function(e, t) {
		if (this.mode !== e) {
			if (this.mode = e, this.isWysiwygMode()) {
				var n = this.toastMark.getRootNode(), r = this.convertor.toWysiwygModel(n);
				this.wwEditor.setModel(r);
			} else {
				var r = this.wwEditor.getModel();
				this.mdEditor.setMarkdown(this.convertor.toMarkdownText(r), !t);
			}
			if (this.eventEmitter.emit("removePopupWidget"), this.eventEmitter.emit("changeMode", e), !t) {
				var i = this.convertor.getMappedPos();
				this.focus(), this.isWysiwygMode() && Jl(i) ? this.wwEditor.setSelection(i) : Array.isArray(i) && this.mdEditor.setSelection(i);
			}
		}
	}, e.prototype.destroy = function() {
		var e = this;
		this.wwEditor.destroy(), this.mdEditor.destroy(), this.preview.destroy(), this.scrollSync.destroy(), this.eventEmitter.emit("destroy"), this.eventEmitter.getEvents().forEach(function(t, n) {
			return e.off(n);
		});
	}, e.prototype.hide = function() {
		this.eventEmitter.emit("hide");
	}, e.prototype.show = function() {
		this.eventEmitter.emit("show");
	}, e.prototype.setScrollTop = function(e) {
		this.getCurrentModeEditor().setScrollTop(e);
	}, e.prototype.getScrollTop = function() {
		return this.getCurrentModeEditor().getScrollTop();
	}, e.prototype.reset = function() {
		this.wwEditor.setModel([]), this.mdEditor.setMarkdown("");
	}, e.prototype.getSelection = function() {
		return this.getCurrentModeEditor().getSelection();
	}, e.prototype.setPlaceholder = function(e) {
		this.placeholder = e, this.mdEditor.setPlaceholder(e), this.wwEditor.setPlaceholder(e);
	}, e.prototype.getEditorElements = function() {
		return {
			mdEditor: this.mdEditor.getElement(),
			mdPreview: this.preview.getElement(),
			wwEditor: this.wwEditor.getElement()
		};
	}, e.prototype.convertPosToMatchEditorMode = function(e, t, n) {
		var r, i;
		t === void 0 && (t = e), n === void 0 && (n = this.mode);
		var a = this.mdEditor.view.state.doc, o = Array.isArray(e), s = Array.isArray(t), c = e, l = t;
		if (o !== s) throw Error("Types of arguments must be same");
		return n === "markdown" && !o && !s ? (r = Sf(a, e, t), c = r[0], l = r[1]) : n === "wysiwyg" && o && s && (i = wf(a, e, t), c = i[0], l = i[1]), [c, l];
	}, e;
}();
function tT(e) {
	for (var t, n, r = arguments, i = 1, a = "", o = "", s = [0], c = function(e) {
		i === 1 && (e || (a = a.replace(/^\s*\n\s*|\s*\n\s*$/g, ""))) ? s.push(e ? r[e] : a) : i === 3 && (e || a) ? (s[1] = e ? r[e] : a, i = 2) : i === 2 && a === "..." && e ? s[2] = Pu(s[2] || {}, r[e]) : i === 2 && a && !e ? (s[2] = s[2] || {})[a] = !0 : i >= 5 && (i === 5 ? ((s[2] = s[2] || {})[n] = e ? a ? a + r[e] : r[e] : a, i = 6) : (e || a) && (s[2][n] += e ? a + r[e] : a)), a = "";
	}, l = 0; l < e.length; l++) {
		l && (i === 1 && c(), c(l));
		for (let r = 0; r < e[l].length; r++) t = e[l][r], i === 1 ? t === "<" ? (c(), s = [
			s,
			"",
			null
		], i = 3) : a += t : i === 4 ? a === "--" && t === ">" ? (i = 1, a = "") : a = t + a[0] : o ? t === o ? o = "" : a += t : t === "\"" || t === "'" ? o = t : t === ">" ? (c(), i = 1) : i && (t === "=" ? (i = 5, n = a, a = "") : t === "/" && (i < 5 || e[l][r + 1] === ">") ? (c(), i === 3 && (s = s[0]), i = s, (s = s[0]).push(this.apply(null, i.slice(1))), i = 0) : t === " " || t === "	" || t === "\n" || t === "\r" ? (c(), i = 2) : a += t), i === 3 && a === "!--" && (i = 4, s = s[0]);
	}
	return c(), s.length > 2 ? s.slice(1) : s[1];
}
function nT(e) {
	return typeof e == "boolean" || e instanceof Boolean;
}
var rT = nT, iT = function() {
	function e(e) {
		this.current = e, this.root = e, this.entering = !0;
	}
	return e.prototype.walk = function() {
		var e = this, t = e.entering, n = e.current;
		return n ? (t ? n.firstChild ? (this.current = n.firstChild, this.entering = !0) : this.entering = !1 : n === this.root ? this.current = null : n.next ? (this.current = n.next, this.entering = !0) : (this.current = n.parent, this.entering = !1), {
			vnode: n,
			entering: t
		}) : null;
	}, e;
}(), aT = function() {
	function e(e, t, n) {
		this.parent = null, this.old = null, this.firstChild = null, this.next = null, this.skip = !1, this.type = e, this.props = t, this.children = n, this.props.children = n, t.ref && (this.ref = t.ref, delete t.ref), t.key && (this.key = t.key, delete t.key);
	}
	return e.prototype.walker = function() {
		return new iT(this);
	}, e.removalNodes = [], e;
}();
function oT(e) {
	return new aT("TEXT_NODE", { nodeValue: e }, []);
}
function sT(e, t) {
	var n = e;
	rT(e) || e == null ? n = null : (ll(e) || Jl(e)) && (n = oT(String(e))), n && t.push(n);
}
function cT(e, t) {
	var n = [...arguments].slice(2), r = [];
	return n.forEach(function(e) {
		Array.isArray(e) ? e.forEach(function(e) {
			sT(e, r);
		}) : sT(e, r);
	}), new aT(e, t || {}, r);
}
var $ = tT.bind(cT);
function lT(e) {
	return e === Object(e);
}
var uT = lT;
function dT(e) {
	var t;
	return e.type === "TEXT_NODE" ? t = document.createTextNode(e.props.nodeValue) : (t = document.createElement(e.type), hT(t, {}, e.props)), t;
}
function fT(e, t) {
	e.node ? t.removeChild(e.node) : fT(e.firstChild, t);
}
function pT(e, t, n) {
	Object.keys(t).forEach(function(r) {
		if (/^on/.test(r)) {
			if (!n[r] || t[r] !== n[r]) {
				var i = r.slice(2).toLowerCase();
				e.removeEventListener(i, t[r]);
			}
		} else r !== "children" && !n[r] && !Bd(e) && e.removeAttribute(r);
	}), hT(e, t, n, function(e) {
		return !Du(t[e], n[e]);
	});
}
var mT = /acit|ex(?:s|g|n|p|$)|rph|ows|mnc|ntw|ine[ch]|zoo|^ord/i;
function hT(e, t, n, r) {
	Object.keys(n).forEach(function(i) {
		if (!r || r(i)) {
			if (/^on/.test(i)) {
				var a = i.slice(2).toLowerCase();
				e.addEventListener(a, n[i]);
			} else i === "nodeValue" ? e[i] = n[i] : i === "style" && uT(n[i]) ? gT(e, t[i], n[i]) : i !== "children" && (n[i] === !1 ? e.removeAttribute(i) : e.setAttribute(i, n[i]));
		}
	});
}
function gT(e, t, n) {
	t && Object.keys(t).forEach(function(t) {
		e.style[t] = "";
	}), Object.keys(n).forEach(function(t) {
		var r = n[t];
		e.style[t] = Jl(r) && !mT.test(t) ? `${r}px` : r;
	});
}
function _T(e) {
	if (aT.removalNodes.forEach(function(e) {
		return yT(e);
	}), e) {
		for (var t = void 0, n = e.walker(); t = n.walk();) if (e = t.vnode, t.entering) yT(e);
		else if (hf(e.type)) {
			var r = e.component;
			if (!e.old && r.mounted && r.mounted(), e.old && r.updated) {
				var i = r.prevProps || {};
				r.updated(i);
			}
		}
	}
}
function vT(e) {
	for (var t = e.parent; !t.node;) t = t.parent;
	return t.node;
}
function yT(e) {
	if (!(!e || !e.parent)) {
		if (e.node) {
			var t = vT(e);
			e.effect === "A" ? t.appendChild(e.node) : e.effect === "U" && pT(e.node, e.old.props, e.props);
		}
		if (e.effect === "D") {
			for (var n = void 0, r = e.walker(); n = r.walk();) if (e = n.vnode, !n.entering) {
				if (hf(e.type)) {
					var i = e.component;
					i.beforeDestroy && i.beforeDestroy();
				} else {
					var t = vT(e);
					fT(e, t);
				}
			}
		}
		e.ref && (e.component ? e.ref(e.component) : e.node && e.ref(e.node));
	}
}
function bT(e, t) {
	var n = t.props, r = t.component;
	return r ? (r.prevProps = r.props, r.props = t.props, r) : new e(n);
}
function xT(e) {
	for (var t = e; e && !e.skip;) {
		if (hf(e.type)) {
			var n = bT(e.type, e);
			n.vnode = e, e.component = n, e.props.children = e.children = [n.render()], CT(e);
		} else e.node || (e.node = dT(e)), CT(e);
		if (e.firstChild) e = e.firstChild;
		else {
			for (; e && e.parent && !e.next && (e = e.parent, e !== t););
			e = e.next;
		}
	}
}
function ST(e, t) {
	return e && t && t.type === e.type && (!t.key || t.key === e.key);
}
function CT(e) {
	var t = e.children, n = e.old ? e.old.firstChild : null, r = null;
	t.forEach(function(t, i) {
		var a = ST(n, t);
		a && (t.old = n, t.parent = e, t.node = n.node, t.component = n.component, t.effect = "U"), t && !a && (t.old = null, t.parent = e, t.node = null, t.effect = "A"), n && !a && (aT.removalNodes.push(n), n.effect = "D"), n && (n = n.next), i === 0 ? e.firstChild = t : t && (r.next = t), r = t;
	});
	var i = Ou(t);
	if (!t.length) for (; n;) aT.removalNodes.push(n), n.effect = "D", n = n.next;
	for (; n && i;) n && i.old !== n && (aT.removalNodes.push(n), n.effect = "D", n = n.next);
}
function wT(e) {
	e.effect = "D", aT.removalNodes = [e], _T(), aT.removalNodes = [];
}
function TT(e) {
	var t = e.vnode;
	t.effect = "U", t.old = t, t.next && (t.next.skip = !0), aT.removalNodes = [], xT(t), _T(t), t.next && (t.next.skip = !1);
}
function ET(e, t) {
	var n = new aT(e.tagName.toLowerCase(), {}, [t]);
	return n.node = e, aT.removalNodes = [], xT(n), _T(n), function() {
		return wT(n.firstChild);
	};
}
var DT = function() {
	function e(e) {
		this.props = e, this.state = {}, this.refs = {};
	}
	return e.prototype.setState = function(e) {
		var t = F(F({}, this.state), e);
		Du(this.state, t) || (this.state = t, TT(this));
	}, e;
}(), OT = function(e) {
	P(t, e);
	function t(t) {
		var n = e.call(this, t) || this;
		return n.state = { hide: !1 }, n;
	}
	return t.prototype.show = function() {
		this.setState({ hide: !1 });
	}, t.prototype.hide = function() {
		this.setState({ hide: !0 });
	}, t.prototype.render = function() {
		var e = this.props, t = e.editorType, n = e.eventEmitter;
		return $(kT || (kT = I([
			"\n      <div class=\"",
			"\" style=\"display: ",
			"\">\n        <div\n          class=\"tab-item",
			"\"\n          onClick=",
			"\n        >\n          ",
			"\n        </div>\n        <div\n          class=\"tab-item",
			"\"\n          onClick=",
			"\n        >\n          ",
			"\n        </div>\n      </div>\n    "
		], [
			"\n      <div class=\"",
			"\" style=\"display: ",
			"\">\n        <div\n          class=\"tab-item",
			"\"\n          onClick=",
			"\n        >\n          ",
			"\n        </div>\n        <div\n          class=\"tab-item",
			"\"\n          onClick=",
			"\n        >\n          ",
			"\n        </div>\n      </div>\n    "
		])), V("mode-switch"), this.state.hide ? "none" : "block", t === "markdown" ? " active" : "", function() {
			n.emit("needChangeMode", "markdown");
		}, Q.get("Markdown"), t === "wysiwyg" ? " active" : "", function() {
			n.emit("needChangeMode", "wysiwyg");
		}, Q.get("WYSIWYG"));
	}, t;
}(DT), kT;
function AT(e, t) {
	var n, r;
	/* istanbul ignore next */
	t = t || 0;
	function i() {
		r = Array.prototype.slice.call(arguments), window.clearTimeout(n), n = window.setTimeout(function() {
			e.apply(null, r);
		}, t);
	}
	return i;
}
var jT = AT;
function MT(e, t) {
	var n, r = !0, i = function(t) {
		e.apply(null, t), n = null;
	}, a, o, s;
	t = t || 0, a = jT(i, t);
	function c() {
		if (s = Array.prototype.slice.call(arguments), r) {
			i(s), r = !1;
			return;
		}
		o = Number(/* @__PURE__ */ new Date()), n = n || o, a(s), o - n >= t && i(s);
	}
	function l() {
		r = !0, n = null;
	}
	return c.reset = l, c;
}
var NT = MT, PT = (function() {
	if (typeof Map < "u") return Map;
	function e(e, t) {
		var n = -1;
		return e.some(function(e, r) {
			return e[0] === t && (n = r, !0);
		}), n;
	}
	return function() {
		function t() {
			this.__entries__ = [];
		}
		return Object.defineProperty(t.prototype, "size", {
			get: function() {
				return this.__entries__.length;
			},
			enumerable: !0,
			configurable: !0
		}), t.prototype.get = function(t) {
			var n = e(this.__entries__, t), r = this.__entries__[n];
			return r && r[1];
		}, t.prototype.set = function(t, n) {
			var r = e(this.__entries__, t);
			~r ? this.__entries__[r][1] = n : this.__entries__.push([t, n]);
		}, t.prototype.delete = function(t) {
			var n = this.__entries__, r = e(n, t);
			~r && n.splice(r, 1);
		}, t.prototype.has = function(t) {
			return !!~e(this.__entries__, t);
		}, t.prototype.clear = function() {
			this.__entries__.splice(0);
		}, t.prototype.forEach = function(e, t) {
			t === void 0 && (t = null);
			for (var n = 0, r = this.__entries__; n < r.length; n++) {
				var i = r[n];
				e.call(t, i[1], i[0]);
			}
		}, t;
	}();
})(), FT = typeof window < "u" && typeof document < "u" && window.document === document, IT = (function() {
	return typeof global < "u" && global.Math === Math ? global : typeof self < "u" && self.Math === Math ? self : typeof window < "u" && window.Math === Math ? window : Function("return this")();
})(), LT = (function() {
	return typeof requestAnimationFrame == "function" ? requestAnimationFrame.bind(IT) : function(e) {
		return setTimeout(function() {
			return e(Date.now());
		}, 1e3 / 60);
	};
})(), RT = 2;
function zT(e, t) {
	var n = !1, r = !1, i = 0;
	function a() {
		n && (n = !1, e()), r && s();
	}
	function o() {
		LT(a);
	}
	function s() {
		var e = Date.now();
		if (n) {
			if (e - i < RT) return;
			r = !0;
		} else n = !0, r = !1, setTimeout(o, t);
		i = e;
	}
	return s;
}
var BT = 20, VT = [
	"top",
	"right",
	"bottom",
	"left",
	"width",
	"height",
	"size",
	"weight"
], HT = typeof MutationObserver < "u", UT = function() {
	function e() {
		this.connected_ = !1, this.mutationEventsAdded_ = !1, this.mutationsObserver_ = null, this.observers_ = [], this.onTransitionEnd_ = this.onTransitionEnd_.bind(this), this.refresh = zT(this.refresh.bind(this), BT);
	}
	return e.prototype.addObserver = function(e) {
		~this.observers_.indexOf(e) || this.observers_.push(e), this.connected_ || this.connect_();
	}, e.prototype.removeObserver = function(e) {
		var t = this.observers_, n = t.indexOf(e);
		~n && t.splice(n, 1), !t.length && this.connected_ && this.disconnect_();
	}, e.prototype.refresh = function() {
		this.updateObservers_() && this.refresh();
	}, e.prototype.updateObservers_ = function() {
		var e = this.observers_.filter(function(e) {
			return e.gatherActive(), e.hasActive();
		});
		return e.forEach(function(e) {
			return e.broadcastActive();
		}), e.length > 0;
	}, e.prototype.connect_ = function() {
		!FT || this.connected_ || (document.addEventListener("transitionend", this.onTransitionEnd_), window.addEventListener("resize", this.refresh), HT ? (this.mutationsObserver_ = new MutationObserver(this.refresh), this.mutationsObserver_.observe(document, {
			attributes: !0,
			childList: !0,
			characterData: !0,
			subtree: !0
		})) : (document.addEventListener("DOMSubtreeModified", this.refresh), this.mutationEventsAdded_ = !0), this.connected_ = !0);
	}, e.prototype.disconnect_ = function() {
		!FT || !this.connected_ || (document.removeEventListener("transitionend", this.onTransitionEnd_), window.removeEventListener("resize", this.refresh), this.mutationsObserver_ && this.mutationsObserver_.disconnect(), this.mutationEventsAdded_ && document.removeEventListener("DOMSubtreeModified", this.refresh), this.mutationsObserver_ = null, this.mutationEventsAdded_ = !1, this.connected_ = !1);
	}, e.prototype.onTransitionEnd_ = function(e) {
		var t = e.propertyName, n = t === void 0 ? "" : t;
		VT.some(function(e) {
			return !!~n.indexOf(e);
		}) && this.refresh();
	}, e.getInstance = function() {
		return this.instance_ || (this.instance_ = new e()), this.instance_;
	}, e.instance_ = null, e;
}(), WT = (function(e, t) {
	for (var n = 0, r = Object.keys(t); n < r.length; n++) {
		var i = r[n];
		Object.defineProperty(e, i, {
			value: t[i],
			enumerable: !1,
			writable: !1,
			configurable: !0
		});
	}
	return e;
}), GT = (function(e) {
	return e && e.ownerDocument && e.ownerDocument.defaultView || IT;
}), KT = nE(0, 0, 0, 0);
function qT(e) {
	return parseFloat(e) || 0;
}
function JT(e) {
	return [...arguments].slice(1).reduce(function(t, n) {
		var r = e["border-" + n + "-width"];
		return t + qT(r);
	}, 0);
}
function YT(e) {
	for (var t = [
		"top",
		"right",
		"bottom",
		"left"
	], n = {}, r = 0, i = t; r < i.length; r++) {
		var a = i[r], o = e["padding-" + a];
		n[a] = qT(o);
	}
	return n;
}
function XT(e) {
	var t = e.getBBox();
	return nE(0, 0, t.width, t.height);
}
function ZT(e) {
	var t = e.clientWidth, n = e.clientHeight;
	if (!t && !n) return KT;
	var r = GT(e).getComputedStyle(e), i = YT(r), a = i.left + i.right, o = i.top + i.bottom, s = qT(r.width), c = qT(r.height);
	if (r.boxSizing === "border-box" && (Math.round(s + a) !== t && (s -= JT(r, "left", "right") + a), Math.round(c + o) !== n && (c -= JT(r, "top", "bottom") + o)), !$T(e)) {
		var l = Math.round(s + a) - t, u = Math.round(c + o) - n;
		Math.abs(l) !== 1 && (s -= l), Math.abs(u) !== 1 && (c -= u);
	}
	return nE(i.left, i.top, s, c);
}
var QT = (function() {
	return typeof SVGGraphicsElement < "u" ? function(e) {
		return e instanceof GT(e).SVGGraphicsElement;
	} : function(e) {
		return e instanceof GT(e).SVGElement && typeof e.getBBox == "function";
	};
})();
function $T(e) {
	return e === GT(e).document.documentElement;
}
function eE(e) {
	return FT ? QT(e) ? XT(e) : ZT(e) : KT;
}
function tE(e) {
	var t = e.x, n = e.y, r = e.width, i = e.height, a = Object.create((typeof DOMRectReadOnly < "u" ? DOMRectReadOnly : Object).prototype);
	return WT(a, {
		x: t,
		y: n,
		width: r,
		height: i,
		top: n,
		right: t + r,
		bottom: i + n,
		left: t
	}), a;
}
function nE(e, t, n, r) {
	return {
		x: e,
		y: t,
		width: n,
		height: r
	};
}
var rE = function() {
	function e(e) {
		this.broadcastWidth = 0, this.broadcastHeight = 0, this.contentRect_ = nE(0, 0, 0, 0), this.target = e;
	}
	return e.prototype.isActive = function() {
		var e = eE(this.target);
		return this.contentRect_ = e, e.width !== this.broadcastWidth || e.height !== this.broadcastHeight;
	}, e.prototype.broadcastRect = function() {
		var e = this.contentRect_;
		return this.broadcastWidth = e.width, this.broadcastHeight = e.height, e;
	}, e;
}(), iE = function() {
	function e(e, t) {
		var n = tE(t);
		WT(this, {
			target: e,
			contentRect: n
		});
	}
	return e;
}(), aE = function() {
	function e(e, t, n) {
		if (this.activeObservations_ = [], this.observations_ = new PT(), typeof e != "function") throw TypeError("The callback provided as parameter 1 is not a function.");
		this.callback_ = e, this.controller_ = t, this.callbackCtx_ = n;
	}
	return e.prototype.observe = function(e) {
		if (!arguments.length) throw TypeError("1 argument required, but only 0 present.");
		if (!(typeof Element > "u" || !(Element instanceof Object))) {
			if (!(e instanceof GT(e).Element)) throw TypeError("parameter 1 is not of type \"Element\".");
			var t = this.observations_;
			t.has(e) || (t.set(e, new rE(e)), this.controller_.addObserver(this), this.controller_.refresh());
		}
	}, e.prototype.unobserve = function(e) {
		if (!arguments.length) throw TypeError("1 argument required, but only 0 present.");
		if (!(typeof Element > "u" || !(Element instanceof Object))) {
			if (!(e instanceof GT(e).Element)) throw TypeError("parameter 1 is not of type \"Element\".");
			var t = this.observations_;
			t.has(e) && (t.delete(e), t.size || this.controller_.removeObserver(this));
		}
	}, e.prototype.disconnect = function() {
		this.clearActive(), this.observations_.clear(), this.controller_.removeObserver(this);
	}, e.prototype.gatherActive = function() {
		var e = this;
		this.clearActive(), this.observations_.forEach(function(t) {
			t.isActive() && e.activeObservations_.push(t);
		});
	}, e.prototype.broadcastActive = function() {
		if (this.hasActive()) {
			var e = this.callbackCtx_, t = this.activeObservations_.map(function(e) {
				return new iE(e.target, e.broadcastRect());
			});
			this.callback_.call(e, t, e), this.clearActive();
		}
	}, e.prototype.clearActive = function() {
		this.activeObservations_.splice(0);
	}, e.prototype.hasActive = function() {
		return this.activeObservations_.length > 0;
	}, e;
}(), oE = typeof WeakMap < "u" ? /* @__PURE__ */ new WeakMap() : new PT(), sE = function() {
	function e(t) {
		if (!(this instanceof e)) throw TypeError("Cannot call a class as a function.");
		if (!arguments.length) throw TypeError("1 argument required, but only 0 present.");
		var n = new aE(t, UT.getInstance(), this);
		oE.set(this, n);
	}
	return e;
}();
[
	"observe",
	"unobserve",
	"disconnect"
].forEach(function(e) {
	sE.prototype[e] = function() {
		var t;
		return (t = oE.get(this))[e].apply(t, arguments);
	};
});
var cE = (function() {
	return IT.ResizeObserver === void 0 ? sE : IT.ResizeObserver;
})(), lE = function(e) {
	P(t, e);
	function t() {
		return e !== null && e.apply(this, arguments) || this;
	}
	return t.prototype.execCommand = function(e) {
		var t = Xd(e.target, "li");
		this.props.execCommand("heading", { level: Number(t.getAttribute("data-level")) });
	}, t.prototype.render = function() {
		var e = this;
		return $(dE || (dE = I([
			"\n      <ul\n        onClick=",
			"\n        aria-role=\"menu\"\n        aria-label=\"",
			"\"\n      >\n        ",
			"\n        <li data-type=\"Paragraph\" aria-role=\"menuitem\">\n          <div>",
			"</div>\n        </li>\n      </ul>\n    "
		], [
			"\n      <ul\n        onClick=",
			"\n        aria-role=\"menu\"\n        aria-label=\"",
			"\"\n      >\n        ",
			"\n        <li data-type=\"Paragraph\" aria-role=\"menuitem\">\n          <div>",
			"</div>\n        </li>\n      </ul>\n    "
		])), function(t) {
			return e.execCommand(t);
		}, Q.get("Headings"), [
			1,
			2,
			3,
			4,
			5,
			6
		].map(function(e) {
			return $(uE || (uE = I([
				"\n              <li data-level=\"",
				"\" data-type=\"Heading\" aria-role=\"menuitem\">\n                <",
				">",
				" ",
				"</$>\n              </li>\n            "
			], [
				"\n              <li data-level=\"",
				"\" data-type=\"Heading\" aria-role=\"menuitem\">\n                <",
				">",
				" ",
				"</$>\n              </li>\n            "
			])), e, `h${e}`, Q.get("Heading"), e);
		}), Q.get("Paragraph"));
	}, t;
}(DT), uE, dE, fE = function(e) {
	P(t, e);
	function t() {
		return e !== null && e.apply(this, arguments) || this;
	}
	return t.prototype.toggleTab = function(e, t) {
		this.props.onClick(e, t);
	}, t.prototype.render = function() {
		var e = this;
		return $(mE || (mE = I([
			"\n      <div class=\"",
			"\" aria-role=\"tabpanel\">\n        ",
			"\n      </div>\n    "
		], [
			"\n      <div class=\"",
			"\" aria-role=\"tabpanel\">\n        ",
			"\n      </div>\n    "
		])), V("tabs"), this.props.tabs.map(function(t) {
			var n = t.name, r = t.text, i = e.props.activeTab === n;
			return $(pE || (pE = I([
				"\n            <div\n              class=\"tab-item",
				"\"\n              onClick=",
				"\n              aria-role=\"tab\"\n              aria-label=\"",
				"\"\n              aria-selected=\"",
				"\"\n              tabindex=\"",
				"\"\n            >\n              ",
				"\n            </div>\n          "
			], [
				"\n            <div\n              class=\"tab-item",
				"\"\n              onClick=",
				"\n              aria-role=\"tab\"\n              aria-label=\"",
				"\"\n              aria-selected=\"",
				"\"\n              tabindex=\"",
				"\"\n            >\n              ",
				"\n            </div>\n          "
			])), i ? " active" : "", function(t) {
				return e.toggleTab(t, n);
			}, Q.get(r), i ? "true" : "false", i ? "0" : "-1", Q.get(r));
		}));
	}, t;
}(DT), pE, mE, hE = "ui", gE = function(e) {
	P(t, e);
	function t(t) {
		var n = e.call(this, t) || this;
		return n.initialize = function(e) {
			e === void 0 && (e = "file");
			var t = n.refs.url;
			t.value = "", n.refs.altText.value = "", n.refs.file.value = "", Kl(t, "wrong"), n.setState({
				activeTab: e,
				file: null,
				fileNameElClassName: ""
			});
		}, n.execCommand = function() {
			n.state.activeTab === "file" ? n.emitAddImageBlob() : n.emitAddImage();
		}, n.toggleTab = function(e, t) {
			t !== n.state.activeTab && n.initialize(t);
		}, n.showFileSelectBox = function() {
			n.refs.file.click();
		}, n.changeFile = function(e) {
			var t = e.target.files;
			t != null && t.length && n.setState({ file: t[0] });
		}, n.state = {
			activeTab: "file",
			file: null,
			fileNameElClassName: ""
		}, n.tabs = [{
			name: "file",
			text: "File"
		}, {
			name: "url",
			text: "URL"
		}], n;
	}
	return t.prototype.emitAddImageBlob = function() {
		var e = this, t = this.refs.file.files, n = this.refs.altText, r = " wrong";
		if (t != null && t.length) {
			r = "";
			var i = t.item(0);
			this.props.eventEmitter.emit("addImageBlobHook", i, function(t, r) {
				return e.props.execCommand("addImage", {
					imageUrl: t,
					altText: r || n.value
				});
			}, hE);
		}
		this.setState({ fileNameElClassName: r });
	}, t.prototype.emitAddImage = function() {
		var e = this.refs.url, t = this.refs.altText, n = e.value, r = t.value || "image";
		if (Kl(e, "wrong"), !n.length) {
			Bl(e, "wrong");
			return;
		}
		n && this.props.execCommand("addImage", {
			imageUrl: n,
			altText: r
		});
	}, t.prototype.preventSelectStart = function(e) {
		e.preventDefault();
	}, t.prototype.updated = function() {
		this.props.show || this.initialize();
	}, t.prototype.render = function() {
		var e = this, t = this.state, n = t.activeTab, r = t.file, i = t.fileNameElClassName;
		return $(_E || (_E = I(/* @__PURE__ */ "\n      <div aria-label=\".\">\n        <. tabs=. activeTab=. onClick=. />\n        <div style=\"display:.\">\n          <label for=\"toastuiImageUrlInput\">.</label>\n          <input\n            id=\"toastuiImageUrlInput\"\n            type=\"text\"\n            ref=.\n          />\n        </div>\n        <div style=\"display:.;position: relative;\">\n          <label for=\"toastuiImageFileInput\">.</label>\n          <span\n            class=\"..\"\n            onClick=.\n            onSelectstart=.\n          >\n            .\n          </span>\n          <button\n            type=\"button\"\n            class=\".\"\n            onClick=.\n          >\n            .\n          </button>\n          <input\n            id=\"toastuiImageFileInput\"\n            type=\"file\"\n            accept=\"image/*\"\n            onChange=.\n            ref=.\n          />\n        </div>\n        <label for=\"toastuiAltTextInput\">.</label>\n        <input\n          id=\"toastuiAltTextInput\"\n          type=\"text\"\n          ref=.\n        />\n        <div class=\".\">\n          <button type=\"button\" class=\".\" onClick=.>\n            .\n          </button>\n          <button type=\"button\" class=\".\" onClick=.>\n            .\n          </button>\n        </div>\n      </div>\n    ".split("."), /* @__PURE__ */ "\n      <div aria-label=\".\">\n        <. tabs=. activeTab=. onClick=. />\n        <div style=\"display:.\">\n          <label for=\"toastuiImageUrlInput\">.</label>\n          <input\n            id=\"toastuiImageUrlInput\"\n            type=\"text\"\n            ref=.\n          />\n        </div>\n        <div style=\"display:.;position: relative;\">\n          <label for=\"toastuiImageFileInput\">.</label>\n          <span\n            class=\"..\"\n            onClick=.\n            onSelectstart=.\n          >\n            .\n          </span>\n          <button\n            type=\"button\"\n            class=\".\"\n            onClick=.\n          >\n            .\n          </button>\n          <input\n            id=\"toastuiImageFileInput\"\n            type=\"file\"\n            accept=\"image/*\"\n            onChange=.\n            ref=.\n          />\n        </div>\n        <label for=\"toastuiAltTextInput\">.</label>\n        <input\n          id=\"toastuiAltTextInput\"\n          type=\"text\"\n          ref=.\n        />\n        <div class=\".\">\n          <button type=\"button\" class=\".\" onClick=.>\n            .\n          </button>\n          <button type=\"button\" class=\".\" onClick=.>\n            .\n          </button>\n        </div>\n      </div>\n    ".split("."))), Q.get("Insert image"), fE, this.tabs, n, this.toggleTab, n === "url" ? "block" : "none", Q.get("Image URL"), function(t) {
			return e.refs.url = t;
		}, n === "file" ? "block" : "none", Q.get("Select image file"), V("file-name"), r ? " has-file" : i, this.showFileSelectBox, this.preventSelectStart, r ? r.name : Q.get("No file"), V("file-select-button"), this.showFileSelectBox, Q.get("Choose a file"), this.changeFile, function(t) {
			return e.refs.file = t;
		}, Q.get("Description"), function(t) {
			return e.refs.altText = t;
		}, V("button-container"), V("close-button"), this.props.hidePopup, Q.get("Cancel"), V("ok-button"), this.execCommand, Q.get("OK"));
	}, t;
}(DT), _E, vE = function(e) {
	P(t, e);
	function t() {
		var t = e !== null && e.apply(this, arguments) || this;
		return t.execCommand = function() {
			var e = t.refs.url, n = t.refs.text;
			if (Kl(e, "wrong"), Kl(n, "wrong"), e.value.length < 1) {
				Bl(e, "wrong");
				return;
			}
			if (Dl(t.props.initialValues.linkUrl) && n.value.length < 1) {
				Bl(n, "wrong");
				return;
			}
			t.props.execCommand("addLink", {
				linkUrl: e.value,
				linkText: n.value
			});
		}, t;
	}
	return t.prototype.initialize = function() {
		var e = this.props.initialValues, t = e.linkUrl, n = e.linkText, r = this.refs.url, i = this.refs.text;
		Kl(r, "wrong"), Kl(i, "wrong", "disabled"), i.removeAttribute("disabled"), t && (Bl(i, "disabled"), i.setAttribute("disabled", "disabled")), r.value = t || "", i.value = n || "";
	}, t.prototype.mounted = function() {
		this.initialize();
	}, t.prototype.updated = function(e) {
		!e.show && this.props.show && this.initialize();
	}, t.prototype.render = function() {
		var e = this;
		return $(yE || (yE = I([
			"\n      <div aria-label=\"",
			"\">\n        <label for=\"toastuiLinkUrlInput\">",
			"</label>\n        <input\n          id=\"toastuiLinkUrlInput\"\n          type=\"text\"\n          ref=",
			"\n        />\n        <label for=\"toastuiLinkTextInput\">",
			"</label>\n        <input\n          id=\"toastuiLinkTextInput\"\n          type=\"text\"\n          ref=",
			"\n        />\n        <div class=\"",
			"\">\n          <button type=\"button\" class=\"",
			"\" onClick=",
			">\n            ",
			"\n          </button>\n          <button type=\"button\" class=\"",
			"\" onClick=",
			">\n            ",
			"\n          </button>\n        </div>\n      </div>\n    "
		], [
			"\n      <div aria-label=\"",
			"\">\n        <label for=\"toastuiLinkUrlInput\">",
			"</label>\n        <input\n          id=\"toastuiLinkUrlInput\"\n          type=\"text\"\n          ref=",
			"\n        />\n        <label for=\"toastuiLinkTextInput\">",
			"</label>\n        <input\n          id=\"toastuiLinkTextInput\"\n          type=\"text\"\n          ref=",
			"\n        />\n        <div class=\"",
			"\">\n          <button type=\"button\" class=\"",
			"\" onClick=",
			">\n            ",
			"\n          </button>\n          <button type=\"button\" class=\"",
			"\" onClick=",
			">\n            ",
			"\n          </button>\n        </div>\n      </div>\n    "
		])), Q.get("Insert link"), Q.get("URL"), function(t) {
			return e.refs.url = t;
		}, Q.get("Link text"), function(t) {
			return e.refs.text = t;
		}, V("button-container"), V("close-button"), this.props.hidePopup, Q.get("Cancel"), V("ok-button"), this.execCommand, Q.get("OK"));
	}, t;
}(DT), yE, bE = 20, xE = 20, SE = 5, CE = 14, wE = 5, TE = 9, EE = 1, DE = 1, OE = 1, kE = function(e) {
	P(t, e);
	function t(t) {
		var n = e.call(this, t) || this;
		return n.extendSelectionRange = function(e) {
			var t = e.pageX, r = e.pageY, i = t - n.offsetRect.left, a = r - n.offsetRect.top, o = n.getSelectionRangeByOffset(i, a);
			n.setState(F({}, o));
		}, n.execCommand = function() {
			n.props.execCommand("addTable", {
				rowCount: n.state.rowIdx + 1,
				columnCount: n.state.colIdx + 1
			});
		}, n.state = {
			rowIdx: -1,
			colIdx: -1
		}, n;
	}
	return t.prototype.getDescription = function() {
		return this.state.colIdx === -1 ? "" : `${this.state.colIdx + 1} x ${this.state.rowIdx + 1}`;
	}, t.prototype.getBoundByRange = function(e, t) {
		return {
			width: (e + 1) * bE,
			height: (t + 1) * xE
		};
	}, t.prototype.getRangeByOffset = function(e, t) {
		return {
			colIdx: Math.floor(e / bE),
			rowIdx: Math.floor(t / xE)
		};
	}, t.prototype.getTableRange = function() {
		var e = this.state, t = e.colIdx, n = e.rowIdx, r = Math.max(t, wE), i = Math.max(n, SE);
		return t >= wE && r < TE && (r += 1), n >= SE && i < CE && (i += 1), {
			colIdx: r + 1,
			rowIdx: i + 1
		};
	}, t.prototype.getSelectionAreaBound = function() {
		var e = this.getBoundByRange(this.state.colIdx, this.state.rowIdx), t = e.width, n = e.height;
		return !t && !n ? { display: "none" } : {
			width: t - OE,
			height: n - OE,
			display: "block"
		};
	}, t.prototype.getSelectionRangeByOffset = function(e, t) {
		var n = this.getRangeByOffset(e, t);
		return n.rowIdx = Math.min(Math.max(n.rowIdx, EE), CE), n.colIdx = Math.min(Math.max(n.colIdx, DE), TE), n;
	}, t.prototype.updated = function() {
		if (!this.props.show) this.setState({
			colIdx: -1,
			rowIdx: -1
		});
		else if (this.state.colIdx === -1 && this.state.rowIdx === -1) {
			var e = this.refs.tableEl.getBoundingClientRect(), t = e.left, n = e.top;
			this.offsetRect = {
				left: window.pageXOffset + t,
				top: window.pageYOffset + n
			};
		}
	}, t.prototype.createTableArea = function(e) {
		for (var t = e.colIdx, n = e.rowIdx, r = [], i = 0; i < n; i += 1) {
			for (var a = [], o = 0; o < t; o += 1) {
				var s = `${V("table-cell")}${i > 0 ? "" : " header"}`;
				a.push($(AE || (AE = I(["<div class=\"", "\"></div>"], ["<div class=\"", "\"></div>"])), s));
			}
			r.push($(jE || (jE = I([
				"<div class=\"",
				"\">",
				"</div>"
			], [
				"<div class=\"",
				"\">",
				"</div>"
			])), V("table-row"), a));
		}
		return $(ME || (ME = I([
			"<div class=\"",
			"\">",
			"</div>"
		], [
			"<div class=\"",
			"\">",
			"</div>"
		])), V("table"), r);
	}, t.prototype.render = function() {
		var e = this, t = this.getTableRange(), n = this.getSelectionAreaBound();
		return $(NE || (NE = I([
			"\n      <div aria-label=\"",
			"\">\n        <div\n          class=\"",
			"\"\n          ref=",
			"\n          onMousemove=",
			"\n          onClick=",
			"\n        >\n          ",
			"\n          <div class=\"",
			"\" style=",
			"></div>\n        </div>\n        <p class=\"",
			"\">",
			"</p>\n      </div>\n    "
		], [
			"\n      <div aria-label=\"",
			"\">\n        <div\n          class=\"",
			"\"\n          ref=",
			"\n          onMousemove=",
			"\n          onClick=",
			"\n        >\n          ",
			"\n          <div class=\"",
			"\" style=",
			"></div>\n        </div>\n        <p class=\"",
			"\">",
			"</p>\n      </div>\n    "
		])), Q.get("Insert table"), V("table-selection"), function(t) {
			return e.refs.tableEl = t;
		}, this.extendSelectionRange, this.execCommand, this.createTableArea(t), V("table-selection-layer"), n, V("table-description"), this.getDescription());
	}, t;
}(DT), AE, jE, ME, NE, PE = function(e) {
	P(t, e);
	function t() {
		return e !== null && e.apply(this, arguments) || this;
	}
	return t.prototype.mounted = function() {
		this.refs.el.appendChild(this.props.body);
	}, t.prototype.updated = function(e) {
		this.refs.el.replaceChild(this.props.body, e.body);
	}, t.prototype.render = function() {
		var e = this;
		return $(FE || (FE = I(["<div ref=", "></div>"], ["<div ref=", "></div>"])), function(t) {
			return e.refs.el = t;
		});
	}, t;
}(DT), FE;
function IE(e) {
	return ll(e) ? RE(e) : e;
}
function LE() {
	var e = document.createElement("label"), t = document.createElement("input"), n = document.createElement("span");
	return e.className = "scroll-sync active", t.type = "checkbox", t.checked = !0, n.className = "switch", e.appendChild(t), e.appendChild(n), {
		name: "scrollSync",
		el: e,
		onMounted: function(n) {
			return t.addEventListener("change", function(t) {
				var r = t.target.checked;
				r ? Bl(e, "active") : Kl(e, "active"), n("toggleScrollSync", { active: r });
			});
		}
	};
}
function RE(e) {
	var t;
	switch (e) {
		case "heading":
			t = {
				name: "heading",
				className: "heading",
				tooltip: Q.get("Headings"),
				state: "heading"
			};
			break;
		case "bold":
			t = {
				name: "bold",
				className: "bold",
				command: "bold",
				tooltip: Q.get("Bold"),
				state: "strong"
			};
			break;
		case "italic":
			t = {
				name: "italic",
				className: "italic",
				command: "italic",
				tooltip: Q.get("Italic"),
				state: "emph"
			};
			break;
		case "strike":
			t = {
				name: "strike",
				className: "strike",
				command: "strike",
				tooltip: Q.get("Strike"),
				state: "strike"
			};
			break;
		case "hr":
			t = {
				name: "hr",
				className: "hrline",
				command: "hr",
				tooltip: Q.get("Line"),
				state: "thematicBreak"
			};
			break;
		case "quote":
			t = {
				name: "quote",
				className: "quote",
				command: "blockQuote",
				tooltip: Q.get("Blockquote"),
				state: "blockQuote"
			};
			break;
		case "ul":
			t = {
				name: "ul",
				className: "bullet-list",
				command: "bulletList",
				tooltip: Q.get("Unordered list"),
				state: "bulletList"
			};
			break;
		case "ol":
			t = {
				name: "ol",
				className: "ordered-list",
				command: "orderedList",
				tooltip: Q.get("Ordered list"),
				state: "orderedList"
			};
			break;
		case "task":
			t = {
				name: "task",
				className: "task-list",
				command: "taskList",
				tooltip: Q.get("Task"),
				state: "taskList"
			};
			break;
		case "table":
			t = {
				name: "table",
				className: "table",
				tooltip: Q.get("Insert table"),
				state: "table"
			};
			break;
		case "image":
			t = {
				name: "image",
				className: "image",
				tooltip: Q.get("Insert image")
			};
			break;
		case "link":
			t = {
				name: "link",
				className: "link",
				tooltip: Q.get("Insert link")
			};
			break;
		case "code":
			t = {
				name: "code",
				className: "code",
				command: "code",
				tooltip: Q.get("Code"),
				state: "code"
			};
			break;
		case "codeblock":
			t = {
				name: "codeblock",
				className: "codeblock",
				command: "codeBlock",
				tooltip: Q.get("Insert CodeBlock"),
				state: "codeBlock"
			};
			break;
		case "indent":
			t = {
				name: "indent",
				className: "indent",
				command: "indent",
				tooltip: Q.get("Indent"),
				state: "indent"
			};
			break;
		case "outdent":
			t = {
				name: "outdent",
				className: "outdent",
				command: "outdent",
				tooltip: Q.get("Outdent"),
				state: "outdent"
			};
			break;
		case "scrollSync":
			t = LE();
			break;
		case "more": t = {
			name: "more",
			className: "more",
			tooltip: Q.get("More")
		};
	}
	return t.name !== "scrollSync" && (t.className += ` ${V("toolbar-icons")}`), t;
}
function zE(e, t) {
	var n = t.el, r = t.pos, i = t.popup, a = t.initialValues;
	switch (e) {
		case "heading": return {
			render: function(e) {
				return $(UE || (UE = I([
					"<",
					" ...",
					" />"
				], [
					"<",
					" ...",
					" />"
				])), lE, e);
			},
			className: V("popup-add-heading"),
			fromEl: n,
			pos: r
		};
		case "link": return {
			render: function(e) {
				return $(WE || (WE = I([
					"<",
					" ...",
					" />"
				], [
					"<",
					" ...",
					" />"
				])), vE, e);
			},
			className: V("popup-add-link"),
			fromEl: n,
			pos: r,
			initialValues: a
		};
		case "image": return {
			render: function(e) {
				return $(GE || (GE = I([
					"<",
					" ...",
					" />"
				], [
					"<",
					" ...",
					" />"
				])), gE, e);
			},
			className: V("popup-add-image"),
			fromEl: n,
			pos: r
		};
		case "table": return {
			render: function(e) {
				return $(KE || (KE = I([
					"<",
					" ...",
					" />"
				], [
					"<",
					" ...",
					" />"
				])), kE, e);
			},
			className: V("popup-add-table"),
			fromEl: n,
			pos: r
		};
		case "customPopupBody": return i ? F({
			render: function(e) {
				return $(qE || (qE = I([
					"<",
					" ...",
					" body=",
					" />"
				], [
					"<",
					" ...",
					" body=",
					" />"
				])), PE, e, i.body);
			},
			fromEl: n,
			pos: r
		}, i) : null;
		default: return null;
	}
}
function BE(e) {
	e.hidden = e.length === e.filter(function(e) {
		return e.hidden;
	}).length;
}
function VE(e, t) {
	var n = function(e) {
		return e.hidden = e.name === "scrollSync" && t, e;
	};
	return e.reduce(function(e, t) {
		e.push(t.map(function(e) {
			return n(IE(e));
		}));
		var r = e[(e.length || 1) - 1];
		return r && BE(r), e;
	}, []);
}
function HE(e, t) {
	e.forEach(function(e) {
		e.forEach(function(e) {
			return e.hidden = e.name === "scrollSync" && t;
		}), BE(e);
	});
}
var UE, WE, GE, KE, qE, JE = 20, YE = function(e) {
	P(t, e);
	function t() {
		var t = e !== null && e.apply(this, arguments) || this;
		return t.handleMousedown = function(e) {
			!Xd(e.target, `.${V("popup")}`) && !Xd(e.target, t.props.info.fromEl) && t.props.hidePopup();
		}, t;
	}
	return t.prototype.mounted = function() {
		document.addEventListener("mousedown", this.handleMousedown), this.props.eventEmitter.listen("closePopup", this.props.hidePopup);
	}, t.prototype.beforeDestroy = function() {
		document.removeEventListener("mousedown", this.handleMousedown);
	}, t.prototype.updated = function(e) {
		var t = this.props, n = t.show, r = t.info;
		if (n && r.pos && e.show !== n) {
			var i = F({}, r.pos), a = this.refs.el.offsetWidth, o = Xd(this.refs.el, `.${V("toolbar")}`).offsetWidth;
			i.left + a >= o && (i.left = o - a - JE), Du(this.state.popupPos, i) || this.setState({ popupPos: i });
		}
	}, t.prototype.render = function() {
		var e = this, t = this.props, n = t.info, r = t.show, i = t.hidePopup, a = t.eventEmitter, o = t.execCommand, s = n || {}, c = s.className, l = c === void 0 ? "" : c, u = s.style, d = s.render, f = s.initialValues, p = f === void 0 ? {} : f, m = F(F({ display: r ? "block" : "none" }, u), this.state.popupPos);
		return $(XE || (XE = I([
			"\n      <div\n        class=\"",
			" ",
			"\"\n        style=",
			"\n        ref=",
			"\n        aria-role=\"dialog\"\n      >\n        <div class=\"",
			"\">\n          ",
			"\n        </div>\n      </div>\n    "
		], [
			"\n      <div\n        class=\"",
			" ",
			"\"\n        style=",
			"\n        ref=",
			"\n        aria-role=\"dialog\"\n      >\n        <div class=\"",
			"\">\n          ",
			"\n        </div>\n      </div>\n    "
		])), V("popup"), l, m, function(t) {
			return e.refs.el = t;
		}, V("popup-body"), d && d({
			eventEmitter: a,
			show: r,
			hidePopup: i,
			execCommand: o,
			initialValues: p
		}));
	}, t;
}(DT), XE, ZE = 6;
function QE(e) {
	return function(t) {
		P(n, t);
		function n(e) {
			var n = t.call(this, e) || this;
			return n.showTooltip = function(e) {
				var t = n.props.item.tooltip;
				if (!n.props.disabled && t) {
					var r = n.getBound(e), i = `${r.left + ZE}px`, a = `${r.top + ZE}px`;
					Sl(n.props.tooltipRef.current, {
						display: "block",
						left: i,
						top: a
					}), n.props.tooltipRef.current.querySelector(".text").textContent = t;
				}
			}, n.hideTooltip = function() {
				Sl(n.props.tooltipRef.current, "display", "none");
			}, n.state = {
				active: !1,
				disabled: e.disabled
			}, n.addEvent(), n;
		}
		return n.prototype.addEvent = function() {
			var e = this, t = this.props, n = t.item, r = t.eventEmitter;
			n.state && r.listen("changeToolbarState", function(t) {
				var r, i = (r = t.toolbarState[n.state]) == null ? {} : r, a = i.active, o = i.disabled;
				e.setState({
					active: !!a,
					disabled: o == null ? e.props.disabled : o
				});
			});
		}, n.prototype.getBound = function(e) {
			var t = Zd(e, Xd(e, `.${V("toolbar")}`)), n = t.offsetLeft, r = t.offsetTop;
			return {
				left: n,
				top: e.offsetHeight + r
			};
		}, n.prototype.render = function() {
			return $($E || ($E = I([
				"\n        <",
				"\n          ...",
				"\n          active=",
				"\n          showTooltip=",
				"\n          hideTooltip=",
				"\n          getBound=",
				"\n          disabled=",
				"\n        />\n      "
			], [
				"\n        <",
				"\n          ...",
				"\n          active=",
				"\n          showTooltip=",
				"\n          hideTooltip=",
				"\n          getBound=",
				"\n          disabled=",
				"\n        />\n      "
			])), e, this.props, this.state.active, this.showTooltip, this.hideTooltip, this.getBound, this.state.disabled || this.props.disabled);
		}, n;
	}(DT);
}
var $E, eD = 80, tD = QE(function(e) {
	P(t, e);
	function t() {
		var t = e !== null && e.apply(this, arguments) || this;
		return t.showTooltip = function() {
			t.props.showTooltip(t.refs.el);
		}, t.execCommand = function() {
			var e = t.props, n = e.item, r = e.execCommand, i = e.setPopupInfo, a = e.getBound, o = e.eventEmitter, s = n.command, c = n.name, l = n.popup;
			if (s) r(s);
			else {
				var u = l ? "customPopupBody" : c, d = o.emit("query", "getPopupInitialValues", { popupName: u })[0], f = zE(u, {
					el: t.refs.el,
					pos: a(t.refs.el),
					popup: l,
					initialValues: d
				});
				f && i(f);
			}
		}, t;
	}
	return t.prototype.mounted = function() {
		this.setItemWidth();
	}, t.prototype.updated = function(e) {
		e.item.name !== this.props.item.name && this.setItemWidth();
	}, t.prototype.setItemWidth = function() {
		var e = this.props, t = e.setItemWidth, n = e.item;
		t && t(n.name, Yd(this.refs.el) + (n.hidden ? eD : 0));
	}, t.prototype.render = function() {
		var e = this, t = this.props, n = t.hideTooltip, r = t.disabled, i = t.item, a = t.active, o = F({ display: i.hidden ? "none" : null }, i.style), s = `${i.className || ""}${a ? " active" : ""}`;
		return $(nD || (nD = I([
			"\n      <button\n        ref=",
			"\n        type=\"button\"\n        style=",
			"\n        class=",
			"\n        onClick=",
			"\n        onMouseover=",
			"\n        onMouseout=",
			"\n        disabled=",
			"\n        aria-label=",
			"\n      >\n        ",
			"\n      </button>\n    "
		], [
			"\n      <button\n        ref=",
			"\n        type=\"button\"\n        style=",
			"\n        class=",
			"\n        onClick=",
			"\n        onMouseover=",
			"\n        onMouseout=",
			"\n        disabled=",
			"\n        aria-label=",
			"\n      >\n        ",
			"\n      </button>\n    "
		])), function(t) {
			return e.refs.el = t;
		}, o, s, this.execCommand, this.showTooltip, n, !!r, i.text || i.tooltip || "", i.text || "");
	}, t;
}(DT)), nD, rD = QE(function(e) {
	P(t, e);
	function t() {
		var t = e !== null && e.apply(this, arguments) || this;
		return t.showTooltip = function() {
			t.props.showTooltip(t.refs.el);
		}, t.showPopup = function() {
			var e = zE("customPopupBody", {
				el: t.refs.el,
				pos: t.props.getBound(t.refs.el),
				popup: t.props.item.popup
			});
			e && t.props.setPopupInfo(e);
		}, t;
	}
	return t.prototype.mounted = function() {
		var e = this.props, t = e.setItemWidth, n = e.item;
		this.refs.el.appendChild(n.el), t && t(n.name, Yd(this.refs.el)), n.onMounted && n.onMounted(this.props.execCommand);
	}, t.prototype.updated = function(e) {
		var t, n = this.props, r = n.item, i = n.active, a = n.disabled;
		(e.active !== i || e.disabled !== a) && ((t = r.onUpdated) == null || t.call(r, {
			active: i,
			disabled: a
		}));
	}, t.prototype.render = function() {
		var e = this, t = this.props, n = t.disabled, r = { display: t.item.hidden ? "none" : "inline-block" }, i = function(e) {
			return n ? null : e;
		};
		return $(iD || (iD = I([
			"\n      <div\n        ref=",
			"\n        style=",
			"\n        class=",
			"\n        onClick=",
			"\n        onMouseover=",
			"\n        onMouseout=",
			"\n      ></div>\n    "
		], [
			"\n      <div\n        ref=",
			"\n        style=",
			"\n        class=",
			"\n        onClick=",
			"\n        onMouseover=",
			"\n        onMouseout=",
			"\n      ></div>\n    "
		])), function(t) {
			return e.refs.el = t;
		}, r, V("toolbar-item-wrapper"), i(this.showPopup), i(this.showTooltip), i(this.props.hideTooltip));
	}, t;
}(DT)), iD, aD = function(e) {
	P(t, e);
	function t() {
		return e !== null && e.apply(this, arguments) || this;
	}
	return t.prototype.render = function() {
		var e = this, t = this.props, n = t.group, r = t.hiddenDivider, i = n.hidden ? { display: "none" } : null, a = r ? { display: "none" } : null;
		return $(sD || (sD = I([
			"\n      <div class=\"",
			"\" style=",
			">\n        ",
			"\n        <div class=\"",
			"\" style=",
			"></div>\n      </div>\n    "
		], [
			"\n      <div class=\"",
			"\" style=",
			">\n        ",
			"\n        <div class=\"",
			"\" style=",
			"></div>\n      </div>\n    "
		])), V("toolbar-group"), i, n.map(function(t) {
			var n = t.el ? rD : tD;
			return $(oD || (oD = I([
				"<",
				" key=",
				" ...",
				" item=",
				" />"
			], [
				"<",
				" key=",
				" ...",
				" item=",
				" />"
			])), n, t.name, e.props, t);
		}), V("toolbar-divider"), a);
	}, t;
}(DT), oD, sD, cD = 4, lD = QE(function(e) {
	P(t, e);
	function t(t) {
		var n = e.call(this, t) || this;
		return n.handleClickDocument = function(e) {
			var t = e.target;
			!Xd(t, `.${V("dropdown-toolbar")}`) && !Xd(t, ".more") && n.setState({
				showDropdown: !1,
				dropdownPos: null
			});
		}, n.showTooltip = function() {
			n.props.showTooltip(n.refs.el);
		}, n.state = {
			showDropdown: !1,
			dropdownPos: null
		}, n;
	}
	return t.prototype.getBound = function() {
		var e = this.props.getBound(this.refs.el);
		return e.top += cD, F(F({}, e), {
			left: null,
			right: 10
		});
	}, t.prototype.mounted = function() {
		document.addEventListener("click", this.handleClickDocument);
	}, t.prototype.updated = function() {
		this.state.showDropdown && !this.state.dropdownPos && this.setState({ dropdownPos: this.getBound() });
	}, t.prototype.beforeDestroy = function() {
		document.removeEventListener("click", this.handleClickDocument);
	}, t.prototype.render = function() {
		var e = this, t = this.state, n = t.showDropdown, r = t.dropdownPos, i = this.props, a = i.disabled, o = i.item, s = i.items, c = i.hideTooltip, l = s.filter(function(e) {
			return !e.hidden;
		}), u = l.length ? null : { display: "none" }, d = n ? null : { display: "none" };
		return $(dD || (dD = I([
			"\n      <div class=\"",
			"\" style=",
			">\n        <button\n          ref=",
			"\n          type=\"button\"\n          class=",
			"\n          onClick=",
			"\n          onMouseover=",
			"\n          onMouseout=",
			"\n          disabled=",
			"\n        ></button>\n        <div\n          class=\"",
			"\"\n          style=",
			"\n          ref=",
			"\n        >\n          ",
			"\n        </div>\n      </div>\n    "
		], [
			"\n      <div class=\"",
			"\" style=",
			">\n        <button\n          ref=",
			"\n          type=\"button\"\n          class=",
			"\n          onClick=",
			"\n          onMouseover=",
			"\n          onMouseout=",
			"\n          disabled=",
			"\n        ></button>\n        <div\n          class=\"",
			"\"\n          style=",
			"\n          ref=",
			"\n        >\n          ",
			"\n        </div>\n      </div>\n    "
		])), V("toolbar-group"), u, function(t) {
			return e.refs.el = t;
		}, o.className, function() {
			return e.setState({ showDropdown: !0 });
		}, this.showTooltip, c, a, V("dropdown-toolbar"), F(F({}, d), r), function(t) {
			return e.refs.dropdownEl = t;
		}, l.length ? l.map(function(t, n) {
			var r;
			return $(uD || (uD = I([
				"\n                  <",
				"\n                    group=",
				"\n                    hiddenDivider=",
				"\n                    ...",
				"\n                  />\n                "
			], [
				"\n                  <",
				"\n                    group=",
				"\n                    hiddenDivider=",
				"\n                    ...",
				"\n                  />\n                "
			])), aD, t, n === l.length - 1 || ((r = l[n + 1]) == null ? void 0 : r.hidden), e.props);
		}) : null);
	}, t;
}(DT)), uD, dD, fD = 50, pD = function(e) {
	P(t, e);
	function t(t) {
		var n = e.call(this, t) || this;
		return n.toggleTab = function(e, t) {
			var r = n.props.eventEmitter;
			if (n.state.activeTab !== t) {
				var i = t === "write" ? "changePreviewTabWrite" : "changePreviewTabPreview";
				r.emit(i), n.setState({ activeTab: t });
			}
		}, n.setItemWidth = function(e, t) {
			n.itemWidthMap[e] = t;
		}, n.setPopupInfo = function(e) {
			n.setState({
				showPopup: !0,
				popupInfo: e
			});
		}, n.openPopup = function(e, t) {
			t === void 0 && (t = {});
			var r = n.refs.el.querySelector(`.${V("toolbar-group")} .${e}`);
			if (r) {
				var i = Zd(r, Xd(r, `.${V("toolbar")}`)), a = i.offsetLeft, o = i.offsetTop, s = zE(e, {
					el: r,
					pos: {
						left: a,
						top: r.offsetHeight + o
					},
					initialValues: t
				});
				s && n.setPopupInfo(s);
			}
		}, n.hidePopup = function() {
			n.state.showPopup && n.setState({ showPopup: !1 });
		}, n.execCommand = function(e, t) {
			n.props.eventEmitter.emit("command", e, t), n.hidePopup();
		}, n.tabs = [{
			name: "write",
			text: "Write"
		}, {
			name: "preview",
			text: "Preview"
		}], n.itemWidthMap = {}, n.initialItems = VE(t.toolbarItems || [], n.hiddenScrollSync()), n.state = {
			items: n.initialItems,
			dropdownItems: [],
			showPopup: !1,
			popupInfo: {},
			activeTab: "write"
		}, n.tooltipRef = { current: null }, n.resizeObserver = new cE(function() {
			return n.handleResize();
		}), n.addEvent(), n;
	}
	return t.prototype.insertToolbarItem = function(e, t) {
		var n = e.groupIndex, r = e.itemIndex, i = this.initialItems[n];
		t = IE(t), i ? i.splice(r, 0, t) : this.initialItems.push([t]), this.setState(this.classifyToolbarItems());
	}, t.prototype.removeToolbarItem = function(e) {
		var t = this;
		pl(this.initialItems, function(n) {
			var r = !1;
			return pl(n, function(i, a) {
				return i.name !== e || (r = !0, n.splice(a, 1), t.setState(t.classifyToolbarItems()), !1);
			}), !r;
		});
	}, t.prototype.addEvent = function() {
		var e = this, t = this.props.eventEmitter;
		this.handleResize = NT(function() {
			e.setState({
				items: e.initialItems,
				dropdownItems: []
			}), e.setState(e.classifyToolbarItems());
		}, 200), t.listen("openPopup", this.openPopup);
	}, t.prototype.appendTooltipToRoot = function() {
		var e = `<div class="${V("tooltip")}" style="display:none">
        <div class="arrow"></div>
        <span class="text"></span>
      </div>`;
		this.tooltipRef.current = Jd(e, this.refs.el);
	}, t.prototype.hiddenScrollSync = function() {
		return this.props.editorType === "wysiwyg" || this.props.previewStyle === "tab";
	}, t.prototype.movePrevItemToDropdownToolbar = function(e, t, n, r) {
		var i = function(e) {
			var t = e.pop();
			t && r.push(t);
		};
		if (e > 1) i(n);
		else {
			var a = Ou(t);
			a && i(a);
		}
	}, t.prototype.classifyToolbarItems = function() {
		var e = this, t = 0, n = this.refs.el.clientWidth, r = this.refs.el.querySelector(`.${V("toolbar-divider")}`), i = r ? Yd(r) : 0, a = [], o = [], s = !1;
		return this.initialItems.forEach(function(r, c) {
			var l = [], u = [];
			r.forEach(function(r, i) {
				r.hidden || (t += e.itemWidthMap[r.name], t > n - fD ? (s || (e.movePrevItemToDropdownToolbar(i, a, l, u), s = !0), u.push(r)) : l.push(r));
			}), l.length && (BE(l), a.push(l)), u.length && (BE(u), o.push(u)), c < e.state.items.length - 1 && (t += i);
		}), {
			items: a,
			dropdownItems: o
		};
	}, t.prototype.mounted = function() {
		this.props.previewStyle === "tab" && this.props.eventEmitter.emit("changePreviewTabWrite", !0), this.setState(this.classifyToolbarItems()), this.appendTooltipToRoot(), this.resizeObserver.observe(this.refs.el);
	}, t.prototype.updated = function(e) {
		var t = this.props, n = t.editorType, r = t.previewStyle, i = t.eventEmitter, a = r !== e.previewStyle, o = n !== e.editorType;
		if (a || o) {
			HE(this.initialItems, this.hiddenScrollSync());
			var s = this.classifyToolbarItems();
			(a || r === "tab" && n === "markdown") && (i.emit("changePreviewTabWrite"), s.activeTab = "write"), this.setState(s);
		}
	}, t.prototype.beforeDestroy = function() {
		window.removeEventListener("resize", this.handleResize), this.resizeObserver.disconnect(), Gd(this.tooltipRef.current);
	}, t.prototype.render = function() {
		var e = this, t = this.props, n = t.previewStyle, r = t.eventEmitter, i = t.editorType, a = this.state, o = a.popupInfo, s = a.showPopup, c = a.activeTab, l = a.items, u = a.dropdownItems, d = {
			eventEmitter: r,
			tooltipRef: this.tooltipRef,
			disabled: i === "markdown" && n === "tab" && c === "preview",
			execCommand: this.execCommand,
			setPopupInfo: this.setPopupInfo
		}, f = n === "tab" ? { borderTopLeftRadius: 0 } : null;
		return $(hD || (hD = I([
			"\n      <div class=\"",
			"\">\n        <div\n          class=\"",
			"\"\n          style=\"display: ",
			"\"\n        >\n          <",
			" tabs=",
			" activeTab=",
			" onClick=",
			" />\n        </div>\n        <div\n          class=\"",
			"\"\n          ref=",
			"\n          style=",
			"\n        >\n          ",
			"\n          <",
			"\n            item=",
			"\n            items=",
			"\n            ...",
			"\n          />\n        </div>\n        <",
			"\n          info=",
			"\n          show=",
			"\n          eventEmitter=",
			"\n          hidePopup=",
			"\n          execCommand=",
			"\n        />\n      </div>\n    "
		], [
			"\n      <div class=\"",
			"\">\n        <div\n          class=\"",
			"\"\n          style=\"display: ",
			"\"\n        >\n          <",
			" tabs=",
			" activeTab=",
			" onClick=",
			" />\n        </div>\n        <div\n          class=\"",
			"\"\n          ref=",
			"\n          style=",
			"\n        >\n          ",
			"\n          <",
			"\n            item=",
			"\n            items=",
			"\n            ...",
			"\n          />\n        </div>\n        <",
			"\n          info=",
			"\n          show=",
			"\n          eventEmitter=",
			"\n          hidePopup=",
			"\n          execCommand=",
			"\n        />\n      </div>\n    "
		])), V("toolbar"), V("md-tab-container"), i === "wysiwyg" || n === "vertical" ? "none" : "block", fE, this.tabs, c, this.toggleTab, V("defaultUI-toolbar"), function(t) {
			return e.refs.el = t;
		}, f, l.map(function(t, n) {
			var r;
			return $(mD || (mD = I([
				"\n              <",
				"\n                group=",
				"\n                hiddenDivider=",
				"\n                setItemWidth=",
				"\n                ...",
				"\n              />\n            "
			], [
				"\n              <",
				"\n                group=",
				"\n                hiddenDivider=",
				"\n                setItemWidth=",
				"\n                ...",
				"\n              />\n            "
			])), aD, t, n === l.length - 1 || ((r = l[n + 1]) == null ? void 0 : r.hidden), e.setItemWidth, d);
		}), lD, IE("more"), u, d, YE, o, s, r, this.hidePopup, this.execCommand);
	}, t;
}(DT), mD, hD, gD = function(e) {
	P(t, e);
	function t(t) {
		var n = e.call(this, t) || this;
		return n.handleClickDocument = function(e) {
			Xd(e.target, `.${V("context-menu")}`) || n.setState({ pos: null });
		}, n.state = {
			pos: null,
			menuGroups: []
		}, n.addEvent(), n;
	}
	return t.prototype.addEvent = function() {
		var e = this;
		this.props.eventEmitter.listen("contextmenu", function(t) {
			var n = t.pos, r = t.menuGroups;
			e.setState({
				pos: n,
				menuGroups: r
			});
		});
	}, t.prototype.mounted = function() {
		document.addEventListener("click", this.handleClickDocument);
	}, t.prototype.beforeDestroy = function() {
		document.removeEventListener("click", this.handleClickDocument);
	}, t.prototype.getMenuGroupElements = function() {
		var e = this, t = this.state, n = t.pos, r = t.menuGroups;
		return n ? r.reduce(function(t, n) {
			var r = [];
			return n.forEach(function(t) {
				var n = t.label, i = t.className, a = i !== void 0 && i, o = t.disabled, s = t.onClick;
				r.push($(_D || (_D = I([
					"\n                <li\n                  onClick=",
					"\n                  class=\"menu-item",
					"\"\n                  aria-role=\"menuitem\"\n                >\n                  <span class=\"",
					"\">",
					"</span>\n                </li>\n              "
				], [
					"\n                <li\n                  onClick=",
					"\n                  class=\"menu-item",
					"\"\n                  aria-role=\"menuitem\"\n                >\n                  <span class=\"",
					"\">",
					"</span>\n                </li>\n              "
				])), function() {
					o || (s(), e.setState({ pos: null }));
				}, o ? " disabled" : "", a, n));
			}), t.push($(vD || (vD = I(["<ul class=\"menu-group\">\n              ", "\n            </ul>"], ["<ul class=\"menu-group\">\n              ", "\n            </ul>"])), r)), t;
		}, []) : [];
	}, t.prototype.render = function() {
		var e = F({ display: this.state.pos ? "block" : "none" }, this.state.pos);
		return $(yD || (yD = I([
			"<div class=\"",
			"\" style=",
			" aria-role=\"menu\">\n      ",
			"\n    </div>"
		], [
			"<div class=\"",
			"\" style=",
			" aria-role=\"menu\">\n      ",
			"\n    </div>"
		])), V("context-menu"), e, this.getMenuGroupElements());
	}, t;
}(DT), _D, vD, yD, bD = function(e) {
	P(t, e);
	function t(t) {
		var n = e.call(this, t) || this;
		return n.changeMode = function(e) {
			e !== n.state.editorType && n.setState({ editorType: e });
		}, n.changePreviewStyle = function(e) {
			e !== n.state.previewStyle && n.setState({ previewStyle: e });
		}, n.hide = function() {
			n.setState({ hide: !0 });
		}, n.show = function() {
			n.setState({ hide: !1 });
		}, n.state = {
			editorType: t.editorType,
			previewStyle: t.previewStyle,
			hide: !1
		}, n.addEvent(), n;
	}
	return t.prototype.mounted = function() {
		var e = this.props.slots, t = e.wwEditor, n = e.mdEditor, r = e.mdPreview;
		this.refs.wwContainer.appendChild(t), this.refs.mdContainer.insertAdjacentElement("afterbegin", n), this.refs.mdContainer.appendChild(r);
	}, t.prototype.insertToolbarItem = function(e, t) {
		this.toolbar.insertToolbarItem(e, t);
	}, t.prototype.removeToolbarItem = function(e) {
		this.toolbar.removeToolbarItem(e);
	}, t.prototype.render = function() {
		var e = this, t = this.props, n = t.eventEmitter, r = t.hideModeSwitch, i = t.toolbarItems, a = t.theme, o = this.state, s = o.hide, c = o.previewStyle, l = o.editorType, u = s ? " hidden" : "", d = V(l === "markdown" ? "md-mode" : "ww-mode"), f = `${V("md")}-${c}-style`, p = V([a !== "light", `${a} `]);
		return $(SD || (SD = I([
			"\n      <div\n        class=\"",
			"",
			"",
			"\"\n        ref=",
			"\n      >\n        <",
			"\n          ref=",
			"\n          eventEmitter=",
			"\n          previewStyle=",
			"\n          toolbarItems=",
			"\n          editorType=",
			"\n        />\n        <div\n          class=\"",
			" ",
			"\"\n          ref=",
			"\n        >\n          <div class=\"",
			"\">\n            <div\n              class=\"",
			" ",
			"\"\n              ref=",
			"\n            >\n              <div class=\"",
			"\"></div>\n            </div>\n            <div\n              class=\"",
			"\"\n              ref=",
			"\n            />\n          </div>\n        </div>\n        ",
			"\n        <",
			" eventEmitter=",
			" />\n      </div>\n    "
		], [
			"\n      <div\n        class=\"",
			"",
			"",
			"\"\n        ref=",
			"\n      >\n        <",
			"\n          ref=",
			"\n          eventEmitter=",
			"\n          previewStyle=",
			"\n          toolbarItems=",
			"\n          editorType=",
			"\n        />\n        <div\n          class=\"",
			" ",
			"\"\n          ref=",
			"\n        >\n          <div class=\"",
			"\">\n            <div\n              class=\"",
			" ",
			"\"\n              ref=",
			"\n            >\n              <div class=\"",
			"\"></div>\n            </div>\n            <div\n              class=\"",
			"\"\n              ref=",
			"\n            />\n          </div>\n        </div>\n        ",
			"\n        <",
			" eventEmitter=",
			" />\n      </div>\n    "
		])), p, V("defaultUI"), u, function(t) {
			return e.refs.el = t;
		}, pD, function(t) {
			return e.toolbar = t;
		}, n, c, i, l, V("main"), d, function(t) {
			return e.refs.editorSection = t;
		}, V("main-container"), V("md-container"), f, function(t) {
			return e.refs.mdContainer = t;
		}, V("md-splitter"), V("ww-container"), function(t) {
			return e.refs.wwContainer = t;
		}, !r && $(xD || (xD = I([
			"<",
			" eventEmitter=",
			" editorType=",
			" />"
		], [
			"<",
			" eventEmitter=",
			" editorType=",
			" />"
		])), OT, n, l), gD, n);
	}, t.prototype.addEvent = function() {
		var e = this.props.eventEmitter;
		e.listen("hide", this.hide), e.listen("show", this.show), e.listen("changeMode", this.changeMode), e.listen("changePreviewStyle", this.changePreviewStyle);
	}, t;
}(DT), xD, SD, CD = function(e) {
	P(t, e);
	function t(t) {
		var n = this, r;
		n = e.call(this, t) || this;
		var i, a = ET(n.options.el, $(wD || (wD = I([
			"\n        <",
			"\n          ref=",
			"\n          eventEmitter=",
			"\n          slots=",
			"\n          hideModeSwitch=",
			"\n          toolbarItems=",
			"\n          previewStyle=",
			"\n          editorType=",
			"\n          theme=",
			"\n        />\n      "
		], [
			"\n        <",
			"\n          ref=",
			"\n          eventEmitter=",
			"\n          slots=",
			"\n          hideModeSwitch=",
			"\n          toolbarItems=",
			"\n          previewStyle=",
			"\n          editorType=",
			"\n          theme=",
			"\n        />\n      "
		])), bD, function(e) {
			return i = e;
		}, n.eventEmitter, n.getEditorElements(), n.options.hideModeSwitch, n.options.toolbarItems, n.options.previewStyle, n.options.initialEditType, n.options.theme));
		return n.setMinHeight(n.options.minHeight), n.setHeight(n.options.height), n.defaultUI = {
			insertToolbarItem: i.insertToolbarItem.bind(i),
			removeToolbarItem: i.removeToolbarItem.bind(i),
			destroy: a
		}, (r = n.pluginInfo.toolbarItems) == null || r.forEach(function(e) {
			var t = e.groupIndex, r = e.itemIndex, i = e.item;
			n.defaultUI.insertToolbarItem({
				groupIndex: t,
				itemIndex: r
			}, i);
		}), n.eventEmitter.emit("loadUI", n), n;
	}
	return t.factory = function(e) {
		return e.viewer ? new Rw(e) : new t(e);
	}, t.prototype.insertToolbarItem = function(e, t) {
		this.defaultUI.insertToolbarItem(e, t);
	}, t.prototype.removeToolbarItem = function(e) {
		this.defaultUI.removeToolbarItem(e);
	}, t.prototype.destroy = function() {
		e.prototype.destroy.call(this), this.defaultUI.destroy();
	}, t;
}(eT), wD;
eT.setLanguage(["en", "en-US"], {
	Markdown: "Markdown",
	WYSIWYG: "WYSIWYG",
	Write: "Write",
	Preview: "Preview",
	Headings: "Headings",
	Paragraph: "Paragraph",
	Bold: "Bold",
	Italic: "Italic",
	Strike: "Strike",
	Code: "Inline code",
	Line: "Line",
	Blockquote: "Blockquote",
	"Unordered list": "Unordered list",
	"Ordered list": "Ordered list",
	Task: "Task",
	Indent: "Indent",
	Outdent: "Outdent",
	"Insert link": "Insert link",
	"Insert CodeBlock": "Insert codeBlock",
	"Insert table": "Insert table",
	"Insert image": "Insert image",
	Heading: "Heading",
	"Image URL": "Image URL",
	"Select image file": "Select image file",
	"Choose a file": "Choose a file",
	"No file": "No file",
	Description: "Description",
	OK: "OK",
	More: "More",
	Cancel: "Cancel",
	File: "File",
	URL: "URL",
	"Link text": "Link text",
	"Add row to up": "Add row to up",
	"Add row to down": "Add row to down",
	"Add column to left": "Add column to left",
	"Add column to right": "Add column to right",
	"Remove row": "Remove row",
	"Remove column": "Remove column",
	"Align column to left": "Align column to left",
	"Align column to center": "Align column to center",
	"Align column to right": "Align column to right",
	"Remove table": "Remove table",
	"Would you like to paste as table?": "Would you like to paste as table?",
	"Text color": "Text color",
	"Auto scroll enabled": "Auto scroll enabled",
	"Auto scroll disabled": "Auto scroll disabled",
	"Choose language": "Choose language"
});
//#endregion
//#region node_modules/@drenso-toast-ui/editor/dist/toastui-editor.css?inline
var TD = "/*!\n * @drenso-toast-ui/editor\n * @version 3.4.1 | Thu Mar 12 2026\n * @author NHN Cloud FE Development Lab <dl_javascript@nhn.com>\n * @license MIT\n */\n.ProseMirror{word-wrap:break-word;white-space:pre-wrap;white-space:break-spaces;-webkit-font-variant-ligatures:none;font-variant-ligatures:none;font-feature-settings:\"liga\" 0;position:relative}.ProseMirror pre{white-space:pre-wrap}.ProseMirror li{position:relative}.ProseMirror-hideselection ::-moz-selection{background:0 0}.ProseMirror-hideselection ::selection{background:0 0}.ProseMirror-hideselection{caret-color:#0000}.ProseMirror-selectednode{outline:2px solid #8cf}li.ProseMirror-selectednode{outline:none}li.ProseMirror-selectednode:after{content:\"\";pointer-events:none;border:2px solid #8cf;position:absolute;top:-2px;bottom:-2px;left:-32px;right:-2px}img.ProseMirror-separator{border:none!important;margin:0!important;display:inline!important}.auto-height,.auto-height .toastui-editor-defaultUI{height:auto}.auto-height .toastui-editor-md-container{position:relative}:not(.auto-height)>.toastui-editor-defaultUI,:not(.auto-height)>.toastui-editor-defaultUI>.toastui-editor-main{flex-direction:column;display:flex}:not(.auto-height)>.toastui-editor-defaultUI>.toastui-editor-main{flex:1}.toastui-editor-md-container:after,.toastui-editor-defaultUI-toolbar:after{content:\"\";clear:both;height:0;display:block}.toastui-editor-main{min-height:0;height:inherit;box-sizing:border-box;position:relative}.toastui-editor-md-container{height:100%;display:none;overflow:hidden}.toastui-editor-md-container .toastui-editor{line-height:1.5;position:relative}.toastui-editor-md-container .toastui-editor,.toastui-editor-md-container .toastui-editor-md-preview{box-sizing:border-box;height:inherit;padding:0}.toastui-editor-md-container .toastui-editor-md-preview{height:100%;padding:0 25px;overflow:auto}.toastui-editor-md-container .toastui-editor-md-preview>p:first-child{margin-top:0!important}.toastui-editor-md-container .toastui-editor-md-preview .toastui-editor-contents{padding-top:8px}.toastui-editor-main .toastui-editor-md-tab-style>.toastui-editor,.toastui-editor-main .toastui-editor-md-tab-style>.toastui-editor-md-preview{width:100%;display:none}.toastui-editor-main .toastui-editor-md-tab-style>.active{display:block}.toastui-editor-main .toastui-editor-md-vertical-style>.toastui-editor-tabs{display:none}.toastui-editor-main .toastui-editor-md-tab-style>.toastui-editor-tabs{display:block}.toastui-editor-main .toastui-editor-md-vertical-style .toastui-editor,.toastui-editor-main .toastui-editor-md-vertical-style .toastui-editor-md-preview{width:50%}.toastui-editor-main .toastui-editor-md-splitter{background-color:#ebedf2;width:1px;height:100%;display:none;position:absolute;left:50%}.toastui-editor-main .toastui-editor-md-vertical-style .toastui-editor-md-splitter{display:block}.toastui-editor-ww-container{height:inherit;background-color:#fff;display:none;overflow:hidden}.auto-height .toastui-editor-main-container{position:relative}.toastui-editor-main-container{color:#222;width:100%;height:inherit;line-height:1;position:absolute}.toastui-editor-ww-container>.toastui-editor{height:inherit;width:100%;position:relative}.toastui-editor-ww-container .toastui-editor-contents{box-sizing:border-box;height:inherit;margin:0;padding:16px 25px 0;overflow:auto}.toastui-editor-ww-container .toastui-editor-contents p{margin:0}.toastui-editor-md-mode .toastui-editor-md-container,.toastui-editor-ww-mode .toastui-editor-ww-container{z-index:20;display:block}.toastui-editor-md-mode .toastui-editor-md-vertical-style{display:flex}.toastui-editor-main.hidden,.toastui-editor-defaultUI.hidden{display:none}.toastui-editor-defaultUI .ProseMirror{padding:18px 25px}.toastui-editor-defaultUI{border:1px solid #dadde6;border-radius:4px;height:100%;font-family:Open Sans,Helvetica Neue,Helvetica,Arial,나눔바른고딕,Nanum Barun Gothic,맑은고딕,Malgun Gothic,sans-serif;position:relative}.toastui-editor-defaultUI button{color:#333;cursor:pointer;border:none;border-radius:2px;height:28px;font-size:13px}.toastui-editor-defaultUI .toastui-editor-ok-button{color:#fff;background-color:#00a9ff;outline-color:#009bf2;min-width:63px;height:32px}.toastui-editor-defaultUI .toastui-editor-ok-button:hover{background-color:#009bf2}.toastui-editor-defaultUI .toastui-editor-close-button{background-color:#f7f9fc;border:1px solid #dadde6;outline-color:#cbcfdb;min-width:63px;height:32px;margin-right:5px}.toastui-editor-defaultUI .toastui-editor-close-button:hover{border-color:#cbcfdb}.toastui-editor-mode-switch{text-align:right;background-color:#fff;border-top:1px solid #dadde6;border-radius:0 0 3px 3px;height:28px;padding-right:10px;font-size:12px}.toastui-editor-mode-switch .tab-item{text-align:center;color:#969aa5;cursor:pointer;box-sizing:border-box;background:#f7f9fc;border:1px solid #dadde6;border-radius:0 0 4px 4px;width:96px;height:24px;margin-top:-1px;margin-right:-1px;font-weight:500;line-height:24px;display:inline-block}.toastui-editor-mode-switch .tab-item.active{color:#555;background-color:#fff;border-top:1px solid #fff}.toastui-editor-defaultUI .toastui-editor-md-tab-container{float:left;background:#f7f9fc;border-bottom:1px solid #ebedf2;border-top-left-radius:3px;height:45px;font-size:13px}.toastui-editor-md-tab-container .toastui-editor-tabs{height:100%;margin-left:15px}.toastui-editor-md-tab-container .tab-item{text-align:center;color:#969aa5;cursor:pointer;box-sizing:border-box;background:#eaedf1;border:1px solid #dadde6;border-radius:4px 4px 0 0;width:70px;height:33px;margin-top:13px;font-size:12px;font-weight:500;line-height:33px;display:inline-block}.toastui-editor-md-tab-container .tab-item.active{color:#555;background-color:#fff;border-bottom:1px solid #fff}.toastui-editor-md-tab-container .tab-item:last-child{margin-left:-1px}.toastui-editor-defaultUI-toolbar{background-color:#f7f9fc;border-bottom:1px solid #ebedf2;border-radius:3px 3px 0 0;height:45px;padding:0 25px;display:flex}.toastui-editor-toolbar{box-sizing:border-box;height:46px}.toastui-editor-toolbar-divider{background-color:#e1e3e9;width:1px;height:18px;margin:14px 12px;display:inline-block}.toastui-editor-toolbar-group{display:flex}.toastui-editor-defaultUI-toolbar button{box-sizing:border-box;cursor:pointer;border:1px solid #f7f9fc;border-radius:3px;width:32px;height:32px;margin:7px 5px;padding:0}.toastui-editor-defaultUI-toolbar button:not(:disabled):hover{background-color:#fff;border:1px solid #e4e7ee}.toastui-editor-defaultUI-toolbar .scroll-sync{text-align:center;color:#81858f;cursor:pointer;width:70px;height:10px;line-height:10px;display:inline-block;position:relative}.toastui-editor-defaultUI-toolbar .scroll-sync:before{content:\"Scroll\";font-size:14px;position:absolute;left:0}.toastui-editor-defaultUI-toolbar .scroll-sync.active:before{color:#00a9ff}.toastui-editor-defaultUI-toolbar .scroll-sync input{opacity:0;width:0;height:0}.toastui-editor-defaultUI-toolbar .switch{background-color:#d6d8de;border-radius:50px;transition:all .4s;position:absolute;top:0;bottom:0;left:45px;right:0}.toastui-editor-defaultUI-toolbar input:checked+.switch{background-color:#acddfa}.toastui-editor-defaultUI-toolbar .switch:before{content:\"\";background-color:#94979f;border-radius:50%;width:14px;height:14px;transition:all .4s;position:absolute;bottom:-2px;left:0}.toastui-editor-defaultUI-toolbar input:checked+.switch:before{background-color:#00a9ff;transform:translate(12px)}.toastui-editor-dropdown-toolbar .scroll-sync{margin:0 5px}.toastui-editor-dropdown-toolbar{z-index:30;background-color:#f7f9fc;border:1px solid #dadde6;border-radius:2px;height:46px;display:flex;position:absolute;box-shadow:0 2px 4px #00000014}.toastui-editor-toolbar-item-wrapper{height:32px;margin:7px 5px;line-height:32px}.toastui-editor-popup{z-index:30;background:#fff;border:1px solid #dadde6;border-radius:2px;width:400px;margin-right:auto;position:absolute;box-shadow:0 2px 4px #00000014}.toastui-editor-popup-body{padding:15px;font-size:12px}.toastui-editor-popup-body label{color:#555;margin:20px 0 5px;font-weight:600;display:block}.toastui-editor-popup-body .toastui-editor-button-container{text-align:right;margin-top:20px}.toastui-editor-popup-body input[type=text]{color:#333;border:1px solid #e1e3e9;border-radius:2px;width:calc(100% - 26px);height:30px;padding:0 12px}.toastui-editor-popup-body input[type=text]:focus{border-color:#0000;outline:1px solid #00a9ff}.toastui-editor-popup-body input[type=text].disabled{color:#969aa5;background-color:#f7f9fc;border-color:#e1e3e9}.toastui-editor-popup-body input[type=file]{opacity:0;border:none;width:1px;height:1px;position:absolute;top:0;left:0}.toastui-editor-popup-body input.wrong,.toastui-editor-popup-body span.wrong{border-color:#fa2828}.toastui-editor-popup-add-link .toastui-editor-popup-body,.toastui-editor-popup-add-image .toastui-editor-popup-body{padding:0 20px 20px}.toastui-editor-popup-add-image .toastui-editor-tabs{margin:5px 0 10px}.toastui-editor-popup-add-image .toastui-editor-tabs .tab-item{color:#333;text-align:center;cursor:pointer;box-sizing:border-box;border-bottom:1px solid #dadde6;width:60px;height:40px;font-size:13px;font-weight:600;line-height:40px;display:inline-block}.toastui-editor-popup-add-image .toastui-editor-tabs .tab-item:hover{border-bottom:1px solid #cbcfdb}.toastui-editor-popup-add-image .toastui-editor-tabs .tab-item.active{color:#00a9ff;border-bottom:2px solid #00a9ff}.toastui-editor-popup-add-image .toastui-editor-file-name{color:#dadde6;text-overflow:ellipsis;white-space:nowrap;cursor:pointer;border:1px solid #e1e3e9;border-radius:2px;width:58%;height:30px;padding:0 12px;line-height:30px;display:inline-block;overflow:hidden}.toastui-editor-popup-add-image .toastui-editor-file-name.has-file{color:#333}.toastui-editor-popup-add-image .toastui-editor-file-select-button{vertical-align:top;background-color:#f7f9fc;border:1px solid #dadde6;border-radius:2px;width:33%;height:32px;margin-left:5px}.toastui-editor-popup-add-image .toastui-editor-file-select-button:hover{border-color:#cbcfdb}.toastui-editor-popup-add-table{width:auto}.toastui-editor-popup-add-table .toastui-editor-table-selection{position:relative}.toastui-editor-popup-add-table .toastui-editor-table-cell{box-sizing:border-box;background:#fff;border:1px solid #e1e3e9;width:20px;height:20px;display:table-cell}.toastui-editor-popup-add-table .toastui-editor-table-cell.header{background:#f7f9fc}.toastui-editor-popup-add-table .toastui-editor-table-row{display:table-row}.toastui-editor-popup-add-table .toastui-editor-table{border-collapse:collapse;display:table}.toastui-editor-popup-add-table .toastui-editor-table-selection-layer{z-index:30;background:#00a9ff1a;border:1px solid #00a9ff;position:absolute;top:0;left:0}.toastui-editor-popup-add-table .toastui-editor-table-description{text-align:center;color:#333;margin:5px 0 0}.toastui-editor-popup-add-heading{width:auto}.toastui-editor-popup-add-heading .toastui-editor-popup-body{padding:0}.toastui-editor-popup-add-heading h1,.toastui-editor-popup-add-heading h2,.toastui-editor-popup-add-heading h3,.toastui-editor-popup-add-heading h4,.toastui-editor-popup-add-heading h5,.toastui-editor-popup-add-heading h6,.toastui-editor-popup-add-heading ul,.toastui-editor-popup-add-heading p{margin:0;padding:0}.toastui-editor-popup-add-heading ul{padding:5px 0;list-style:none}.toastui-editor-popup-add-heading ul li{cursor:pointer;padding:4px 12px}.toastui-editor-popup-add-heading ul li:hover{background-color:#dff4ff}.toastui-editor-popup-add-heading h1{font-size:24px}.toastui-editor-popup-add-heading h2{font-size:22px}.toastui-editor-popup-add-heading h3{font-size:20px}.toastui-editor-popup-add-heading h4{font-size:18px}.toastui-editor-popup-add-heading h5{font-size:16px}.toastui-editor-popup-add-heading h6{font-size:14px}.toastui-editor-context-menu{color:#333;z-index:30;background-color:#fff;border:1px solid #dadde6;border-radius:2px;width:auto;min-width:197px;padding:5px 0;position:absolute;box-shadow:0 2px 4px #00000014}.toastui-editor-context-menu .menu-group{border-bottom:1px solid #ebedf2;margin:0;padding:0;font-size:13px;list-style:none}.toastui-editor-context-menu .menu-group:last-child{border-bottom:none!important}.toastui-editor-context-menu .menu-item{cursor:pointer;height:32px;padding:0 14px;line-height:32px}.toastui-editor-context-menu span{display:inline-block}.toastui-editor-context-menu span:before{content:\"\";vertical-align:middle;background:url(data:image/png;base64,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) 0 0/466px 146px no-repeat;width:20px;height:20px;margin-right:10px;display:inline-block}.toastui-editor-context-menu .add-row-up:before{background-position:3px -104px}.toastui-editor-context-menu .add-row-down:before{background-position:-19px -104px}.toastui-editor-context-menu .remove-row:before{background-position:-41px -104px}.toastui-editor-context-menu .add-column-left:before{background-position:-63px -104px}.toastui-editor-context-menu .add-column-right:before{background-position:-85px -104px}.toastui-editor-context-menu .remove-column:before{background-position:-111px -104px}.toastui-editor-context-menu .align-column-left:before{background-position:-129px -104px}.toastui-editor-context-menu .align-column-center:before{background-position:-151px -104px}.toastui-editor-context-menu .align-column-right:before{background-position:-173px -104px}.toastui-editor-context-menu .remove-table:before{background-position:-197px -104px}.toastui-editor-context-menu .disabled span:before{opacity:.3}.toastui-editor-context-menu li:not(.disabled):hover{background-color:#dff4ff}.toastui-editor-context-menu li.disabled{color:#c9ccd5}.toastui-editor-tooltip{z-index:40;color:#fff;background-color:#444;border-radius:3px;padding:4px 7px;font-family:Open Sans,Helvetica Neue,Helvetica,Arial,나눔바른고딕,Nanum Barun Gothic,맑은고딕,Malgun Gothic,sans-serif;font-size:12px;position:absolute}.toastui-editor-tooltip .arrow{content:\"\";z-index:-1;background-color:#444;width:10px;height:10px;display:inline-block;position:absolute;top:-3px;left:6px;transform:rotate(45deg)}.toastui-editor-toolbar-icons{background:url(data:image/png;base64,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) 0 0/466px 146px no-repeat}@media only screen and (-webkit-min-device-pixel-ratio:2),only screen and (min--moz-device-pixel-ratio:2),only screen and (-o-min-device-pixel-ratio:2),only screen and (min-device-pixel-ratio:2),only screen and (min-resolution:192dpi),only screen and (min-resolution:2dppx){.toastui-editor-toolbar-icons,.toastui-editor-context-menu span:before{background:url(data:image/png;base64,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P0A9dgflJJi2Szl5led4F57jlvpECs/6vuTjuhR3dAo961VP9UoRby5eaGBuxz2Zy/3pyiWBlJEiA/s5FHaEnU170tGmBChvV5O1/Zske9dQ3upqiLdbfuL3hTpvY+q8m3ELRkrj1xLs36Md8A17jhOutYwTnYufJw89tLmvbxmhJagIVEmgaoW0yvjlXQREQASakkA77LJL42wfGmdpGiktpZBagaFRfQqNsDNGSykNldFTUQ6+3ZQFWEJlRsA6pVmzZjML1sks0hoiosy9vMoqq2wVjg7VEMNQkHbLTzEI7tOqdCoeTd1nn7dK2tjwf2F5Gsro3cVhdS4CItCcBKSQNud9kVQiIAIikIqAjZLSQNu8lGeujZiyW8pvs7mHI6W2tb/tlF28jigvcRfSmLUpw+doZDQvxM0Xb40zpbLKiE03nWtLiOpVRp1A7ZYfl6+4yTPqo5hO4nndFPt4fi+OHTv2Qb5x/Y+4P9lFQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAREQAQ6mYDfyZlX3kVABESgnQgc/WRhlf5F3j6Dvjdw6UT/mnbKm/IiAiIgAiIgAiLQngSkkLbnfVWuREAEOohA7+OFsc8v8w4peN43yfZGlnW/y9t/9kT/2g7CoKyKgAiIgAiIgAi0IIGeFpRZIouACIhA3QSOm1fY4A3f28MiWqXg/fyCyf7CuiMdhQiOmFc4YOEy7zsk/fZhyRe89ww7b8GTI+YXthv0vBO9gjcZ8TdoUBYWer43r8vzzpk1yb+vQWkqmVEmcPQjhY36+rzv0amzI6I0qqy5XC9kdGDumDHeSRdv5T/n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vaXiGC338PM8x9WSftjWO6CWsArTOAKhollR2UwjEc9wdYeNvhHCevQvqneamUs5jzhd3GlMemI2KtUTUyq89dBYDwAArSK8cWt+zbJmtNII6bA8tdAI6TC5wxP7rtbACm97tkR/K+ssVude9DBm+gqV+JM9a3q/rfW7Vklpya19CNCr94HCAFOk3LRd33u1u8vbhSlgLfWJFJ71famHrqt0Z6ivplBf17v2qFIymV1n07LtaITNJW+jus8B3NjU09sxzQZqmWVeETWcACNtV1PespspVUcOKG/XMLpUV0O83fITx3nEo4WNB1d4N+O2Rdw9yc7z+z1GRr/RrCOjSTInuTHq+3naNz3U4dcnXZebCLQDAeo+HSIgAiLQeQTaYZfdI+YV9qGhUrGR0moKqZVGlG2bxnzGaCmloTJ6Ksrotzvv6eisHFunNGvWHiHX64xyzl8eO8bbKhwdqlmUdstPMYjgqwH/9I6mQ/F4OhKYzTvi+F82kzjtksn+3SOuyEEERKApCUghbcrbIqFEQAREIB0BGyXF5+ZlfCdN2S3jvXku2UgpCveJNDxtp+xh64hylNKm/s1jaPYcjYzmSLnJoq5lplSGWVhIY2yuLSGqVxl1MrVbfly+4qZtXnT0Q96kPs/btKvgjUc5fbHH9x6cMdG39Ws6REAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAEREAERAACviiIgAiIgAgMJ7DPPvvshMuNoeueN9xww5zhPnQmAiIgAiIgAiIgAiKQBYGeLCJRHCIgAiLQTgR839++UCiMtzyZHUMKaTvd4AzzctBBB627bNmydxDl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UvksxkDZi5yw9xKm1xzi5RjlMLe10HTi3YPCeTZ1ZPD5F2TYieT/wnPzFPb+vr6+zTDdxmA2a0Yjo3aDdIiACIiACIhADgS6ysRpa5gadTQyrUblqSHp0GgyZTTYwCghwWBNqflJuNZop2rucTV+S+Wjmjiq8VsqvbzdU8tIebDNVtxuusEGRjTArcPi2piQ+9Eg3yN2LqsI1EMgdflMmwhK4ADldgr+o3JLXRaN+DMD5GyU1prXQjMKfarF4eQhbp/fppy/FzOujM4kHU3TdaBkioAIiIAIiEDGBEoqpLaGibQyb2QkyD8qa8Ro7Ng60cX2C+0JojW/E0qF7aAbrRslL2faLyb57qGfmFPjrVWUp0zKQ6PTy5toFfmx0ZzbkMfKdqCMWqMdt+LG/XN8f/E3dch9axjWpgW33QGvtqgfKtyYzO5hNeWzgkzDLlu55XcEv1eHXchgLTRxFsJnYwfsd/GL775rQ7j2fHwGpfgorg1bX1oki05FQAREQAREQAREoHMJMBp2s02Rsx/2MxwJs8fctcuuA9MhJpuxbMrvU8XZtZEfysZetkau+JrORaDZCFBex1OP/drVZUXmNfGRzHpl57lYm867iTw32y5atGi9euNTeBEQAREQAREQgXQEgo+Dp/MqX81IgAbUm2iUXYBs8+nJvyguIw2sYzifRO/+cYwEBN8AiV+XXQREQASalYApo9Rh5dZCm+jX2rTe+Ohms+ZHcomACIiACIiACIiACIiACIiACLQIAUZDvx4fEaXz7SwbEcXtmrg7SuueLZIliSkCIiACIiACIpBAoOQa0gS/chIBERABERCBhhBg1LMRa6EbkhclIgIiIAIiIAIiIAIiIAIiIAIi0GIEtBa6xW6YxBUBERABERABERABERABERABERABERABERABERCBViHw/wHIAHUN1iL6RwAAAABJRU5ErkJggg==) 0 0/466px 146px no-repeat}}.toastui-editor-toolbar-icons{background-position-y:3px}.toastui-editor-toolbar-icons:disabled{opacity:.3}.toastui-editor-toolbar-icons.heading{background-position-x:3px}.toastui-editor-toolbar-icons.bold{background-position-x:-23px}.toastui-editor-toolbar-icons.italic{background-position-x:-49px}.toastui-editor-toolbar-icons.strike{background-position-x:-75px}.toastui-editor-toolbar-icons.hrline{background-position-x:-101px}.toastui-editor-toolbar-icons.quote{background-position-x:-127px}.toastui-editor-toolbar-icons.bullet-list{background-position-x:-153px}.toastui-editor-toolbar-icons.ordered-list{background-position-x:-179px}.toastui-editor-toolbar-icons.task-list{background-position-x:-205px}.toastui-editor-toolbar-icons.indent{background-position-x:-231px}.toastui-editor-toolbar-icons.outdent{background-position-x:-257px}.toastui-editor-toolbar-icons.table{background-position-x:-283px}.toastui-editor-toolbar-icons.image{background-position-x:-309px}.toastui-editor-toolbar-icons.link{background-position-x:-334px}.toastui-editor-toolbar-icons.code{background-position-x:-361px}.toastui-editor-toolbar-icons.codeblock{background-position-x:-388px}.toastui-editor-toolbar-icons.more{background-position-x:-412px}.toastui-editor-toolbar-icons:not(:disabled).active{background-position-y:-23px}@media only screen and (max-width:480px){.toastui-editor-popup{max-width:300px;margin-left:-150px}.toastui-editor-dropdown-toolbar{max-width:none}}.ProseMirror{color:#222;height:calc(100% - 36px);font-family:Open Sans,Helvetica Neue,Helvetica,Arial,나눔바른고딕,Nanum Barun Gothic,맑은고딕,Malgun Gothic,sans-serif;font-size:13px;overflow-x:hidden;overflow-y:auto}.ProseMirror .placeholder{color:#999}.ProseMirror:focus,.ProseMirror-selectednode{outline:none}table.ProseMirror-selectednode,.html-block.ProseMirror-selectednode{border-radius:2px;outline:2px solid #00a9ff}.toastui-editor-contents{z-index:20;margin:0;padding:0;font-family:Open Sans,Helvetica Neue,Helvetica,Arial,나눔바른고딕,Nanum Barun Gothic,맑은고딕,Malgun Gothic,sans-serif;font-size:13px}.toastui-editor-contents :not(table){box-sizing:content-box;line-height:160%}.toastui-editor-contents i,.toastui-editor-contents cite,.toastui-editor-contents em,.toastui-editor-contents var,.toastui-editor-contents address,.toastui-editor-contents dfn{font-style:italic}.toastui-editor-contents strong{font-weight:700}.toastui-editor-contents p{color:#222;margin:10px 0}.toastui-editor-contents>h1:first-of-type,.toastui-editor-contents>div>div:first-of-type h1{margin-top:14px}.toastui-editor-contents h1,.toastui-editor-contents h2,.toastui-editor-contents h3,.toastui-editor-contents h4,.toastui-editor-contents h5,.toastui-editor-contents h6{color:#222;font-weight:700}.toastui-editor-contents h1{border-bottom:3px double #999;margin:52px 0 15px;padding-bottom:7px;font-size:24px;line-height:28px}.toastui-editor-contents h2{border-bottom:1px solid #dbdbdb;margin:20px 0 13px;padding-bottom:7px;font-size:22px;line-height:23px}.toastui-editor-contents h3{margin:18px 0 2px;font-size:20px}.toastui-editor-contents h4{margin:10px 0 2px;font-size:18px}.toastui-editor-contents h3,.toastui-editor-contents h4{line-height:18px}.toastui-editor-contents h5{font-size:16px}.toastui-editor-contents h6{font-size:14px}.toastui-editor-contents h5,.toastui-editor-contents h6{margin:9px 0 -4px;line-height:17px}.toastui-editor-contents del{color:#999}.toastui-editor-contents blockquote{color:#999;border-left:4px solid #e5e5e5;margin:14px 0;padding:0 16px}.toastui-editor-contents blockquote p,.toastui-editor-contents blockquote ul,.toastui-editor-contents blockquote ol{color:#999}.toastui-editor-contents blockquote>:first-child{margin-top:0}.toastui-editor-contents blockquote>:last-child{margin-bottom:0}.toastui-editor-contents pre,.toastui-editor-contents code{border:0;border-radius:0;font-family:Consolas,Courier,Apple SD 산돌고딕 Neo,-apple-system,Lucida Grande,Apple SD Gothic Neo,맑은 고딕,Malgun Gothic,Segoe UI,돋움,dotum,sans-serif}.toastui-editor-contents pre{background-color:#f4f7f8;margin:2px 0 8px;padding:18px}.toastui-editor-contents code{color:#c1798b;letter-spacing:-.3px;background-color:#f9f2f4;border-radius:2px;padding:2px 3px}.toastui-editor-contents pre code{color:inherit;white-space:pre-wrap;background-color:#0000;padding:0}.toastui-editor-contents img{box-sizing:border-box;vertical-align:top;max-width:100%;margin:4px 0 10px}.toastui-editor-contents table{color:#222;border-collapse:collapse;box-sizing:border-box;border:1px solid #0000001a;width:auto;margin:12px 0 14px}.toastui-editor-contents table th,.toastui-editor-contents table td{border:1px solid #0000001a;height:32px;padding:5px 14px 5px 12px}.toastui-editor-contents table th{color:#fff;background-color:#555;padding-top:6px;font-weight:300}.toastui-editor-contents th p{color:#fff;margin:0}.toastui-editor-contents td p{margin:0;padding:0 2px}.toastui-editor-contents td.toastui-editor-cell-selected{background-color:#d8dfec}.toastui-editor-contents th.toastui-editor-cell-selected{background-color:#908f8f}.toastui-editor-contents ul,.toastui-editor-contents menu,.toastui-editor-contents ol,.toastui-editor-contents dir{color:#222;margin:6px 0 10px;padding-left:24px;list-style-type:none;display:block}.toastui-editor-contents ol{counter-reset:li;list-style-type:none}.toastui-editor-contents ol>li{counter-increment:li}.toastui-editor-contents ul>li:before,.toastui-editor-contents ol>li:before{display:inline-block;position:absolute}.toastui-editor-contents ul>li:before{content:\"\";background-color:#ccc;border-radius:50%;width:5px;height:5px;margin-top:6px;margin-left:-17px}.toastui-editor-contents ol>li:before{content:\".\" counter(li);text-align:right;color:#aaa;direction:rtl;width:24px;margin-left:-28px}.toastui-editor-contents ul ul,.toastui-editor-contents ul ol,.toastui-editor-contents ol ol,.toastui-editor-contents ol ul{margin-top:0!important;margin-bottom:0!important}.toastui-editor-contents ul li,.toastui-editor-contents ol li{position:relative}.toastui-editor-contents ul p,.toastui-editor-contents ol p{margin:0}.toastui-editor-contents hr{border-top:1px solid #eee;margin:16px 0}.toastui-editor-contents a{color:#4b96e6;text-decoration:underline}.toastui-editor-contents a:hover{color:#1f70de}.toastui-editor-contents .image-link{position:relative}.toastui-editor-contents .image-link:hover:before{content:\"\";cursor:pointer;background:#fff url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIj4KICAgIDxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIj4KICAgICAgICA8ZyBzdHJva2U9IiM1NTUiIHN0cm9rZS13aWR0aD0iMS41Ij4KICAgICAgICAgICAgPGc+CiAgICAgICAgICAgICAgICA8Zz4KICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNNy42NjUgMTUuMDdsLTEuODE5LS4wMDJjLTEuNDg2IDAtMi42OTItMS4yMjgtMi42OTItMi43NDR2LS4xOTJjMC0xLjUxNSAxLjIwNi0yLjc0NCAyLjY5Mi0yLjc0NGgzLjg0NmMxLjQ4NyAwIDIuNjkyIDEuMjI5IDIuNjkyIDIuNzQ0di4xOTIiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xMDAwIC00NTgxKSB0cmFuc2xhdGUoOTk1IDQ1NzYpIHRyYW5zbGF0ZSg1IDUpIHNjYWxlKDEgLTEpIHJvdGF0ZSg0NSAzNy4yOTMgMCkiLz4KICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMTIuMzI2IDQuOTM0bDEuODIyLjAwMmMxLjQ4NyAwIDIuNjkzIDEuMjI4IDIuNjkzIDIuNzQ0di4xOTJjMCAxLjUxNS0xLjIwNiAyLjc0NC0yLjY5MyAyLjc0NGgtMy44NDVjLTEuNDg3IDAtMi42OTItMS4yMjktMi42OTItMi43NDRWNy42OCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTEwMDAgLTQ1ODEpIHRyYW5zbGF0ZSg5OTUgNDU3NikgdHJhbnNsYXRlKDUgNSkgc2NhbGUoMSAtMSkgcm90YXRlKDQ1IDMwLjk5NiAwKSIvPgogICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICA8L2c+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4K) 50% no-repeat;border:1px solid #c9ccd5;border-radius:50%;width:30px;height:30px;position:absolute;right:0;box-shadow:0 2px 4px #00000014}.toastui-editor-contents .task-list-item{border:0;margin-left:-24px;padding-left:24px;list-style:none}.toastui-editor-contents .task-list-item:before{content:\"\";cursor:pointer;background:url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxOCIgaGVpZ2h0PSIxOCIgdmlld0JveD0iMCAwIDE4IDE4Ij4KICAgIDxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgZmlsbD0iI0ZGRiIgc3Ryb2tlPSIjQ0NDIj4KICAgICAgICAgICAgPGc+CiAgICAgICAgICAgICAgICA8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMTAzMCAtMjk2KSB0cmFuc2xhdGUoNzg4IDE5MikgdHJhbnNsYXRlKDI0MiAxMDQpIj4KICAgICAgICAgICAgICAgICAgICA8cmVjdCB3aWR0aD0iMTciIGhlaWdodD0iMTciIHg9Ii41IiB5PSIuNSIgcng9IjIiLz4KICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgPC9nPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+Cg==);border-radius:2px;width:18px;height:18px;margin-top:0;margin-left:0;position:absolute;top:1px;left:0}.toastui-editor-contents .task-list-item.checked:before{background-image:url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxOCIgaGVpZ2h0PSIxOCIgdmlld0JveD0iMCAwIDE4IDE4Ij4KICAgIDxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgZmlsbD0iIzRCOTZFNiI+CiAgICAgICAgICAgIDxnPgogICAgICAgICAgICAgICAgPGc+CiAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTE2IDBjMS4xMDUgMCAyIC44OTUgMiAydjE0YzAgMS4xMDUtLjg5NSAyLTIgMkgyYy0xLjEwNSAwLTItLjg5NS0yLTJWMkMwIC44OTUuODk1IDAgMiAwaDE0em0tMS43OTMgNS4yOTNjLS4zOS0uMzktMS4wMjQtLjM5LTEuNDE0IDBMNy41IDEwLjU4NSA1LjIwNyA4LjI5M2wtLjA5NC0uMDgzYy0uMzkyLS4zMDUtLjk2LS4yNzgtMS4zMi4wODMtLjM5LjM5LS4zOSAxLjAyNCAwIDEuNDE0bDMgMyAuMDk0LjA4M2MuMzkyLjMwNS45Ni4yNzggMS4zMi0uMDgzbDYtNiAuMDgzLS4wOTRjLjMwNS0uMzkyLjI3OC0uOTYtLjA4My0xLjMyeiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTEwNTAgLTI5NikgdHJhbnNsYXRlKDc4OCAxOTIpIHRyYW5zbGF0ZSgyNjIgMTA0KSIvPgogICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICA8L2c+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4K)}.toastui-editor-custom-block .toastui-editor-custom-block-editor{color:#452d6b;background:#f9f7fd;border:1px solid #dbd4ea}.toastui-editor-custom-block .toastui-editor-custom-block-view{padding:9px 13px 8px 12px;position:relative}.toastui-editor-custom-block.ProseMirror-selectednode .toastui-editor-custom-block-view{border:1px solid #dbd4ea;border-radius:2px}.toastui-editor-custom-block .toastui-editor-custom-block-view .tool{display:none;position:absolute;top:7px;right:10px}.toastui-editor-custom-block.ProseMirror-selectednode .toastui-editor-custom-block-view .tool{display:block}.toastui-editor-custom-block-view button{vertical-align:middle;background:url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDI1LjIuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IuugiOydtOyWtF8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiCgkgeT0iMHB4IiB2aWV3Qm94PSIwIDAgMzAgMzAiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDMwIDMwOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+Cgkuc3Qwe2ZpbGwtcnVsZTpldmVub2RkO2NsaXAtcnVsZTpldmVub2RkO2ZpbGw6IzU1NTU1NTt9Cjwvc3R5bGU+CjxnPgoJPGc+CgkJPGc+CgkJCTxnPgoJCQkJPGc+CgkJCQkJPHBhdGggY2xhc3M9InN0MCIgZD0iTTE1LjUsMTIuNWwyLDJMMTIsMjBoLTJ2LTJMMTUuNSwxMi41eiBNMTgsMTBsMiwybC0xLjUsMS41bC0yLTJMMTgsMTB6Ii8+CgkJCQk8L2c+CgkJCTwvZz4KCQk8L2c+Cgk8L2c+CjwvZz4KPC9zdmc+Cg==) 50%/30px 30px no-repeat;border:1px solid #ccc;width:15px;height:15px;margin-left:8px;padding:3px}.toastui-editor-custom-block-view .info{color:#5200d0;vertical-align:middle;font-size:13px;font-weight:700}.toastui-editor-contents .toastui-editor-ww-code-block{position:relative}.toastui-editor-contents .toastui-editor-ww-code-block:after{content:attr(data-language);color:#333;cursor:pointer;background:#e5e9ea url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDI1LjIuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IuugiOydtOyWtF8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiCgkgeT0iMHB4IiB2aWV3Qm94PSIwIDAgMzAgMzAiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDMwIDMwOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+Cgkuc3Qwe2ZpbGwtcnVsZTpldmVub2RkO2NsaXAtcnVsZTpldmVub2RkO2ZpbGw6IzU1NTU1NTt9Cjwvc3R5bGU+CjxnPgoJPGc+CgkJPGc+CgkJCTxnPgoJCQkJPGc+CgkJCQkJPHBhdGggY2xhc3M9InN0MCIgZD0iTTE1LjUsMTIuNWwyLDJMMTIsMjBoLTJ2LTJMMTUuNSwxMi41eiBNMTgsMTBsMiwybC0xLjUsMS41bC0yLTJMMTgsMTB6Ii8+CgkJCQk8L2c+CgkJCTwvZz4KCQk8L2c+Cgk8L2c+CjwvZz4KPC9zdmc+Cg==) 100%/30px 30px no-repeat;border-radius:2px;height:24px;padding:3px 35px 0 10px;font-size:13px;font-weight:700;display:inline-block;position:absolute;top:10px;right:10px}.toastui-editor-ww-code-block-language{z-index:30;background-color:#fff;border:1px solid #ccc;border-radius:2px;width:100px;height:27px;display:inline-block;position:fixed;right:35px}.toastui-editor-ww-code-block-language input{box-sizing:border-box;background-color:#0000;border:none;outline:none;width:100%;height:100%;margin:0;padding:0 10px}.toastui-editor-contents-placeholder:before{content:attr(data-placeholder);color:gray;line-height:160%;position:absolute}.toastui-editor-md-preview .toastui-editor-contents h1{min-height:28px}.toastui-editor-md-preview .toastui-editor-contents h2{min-height:23px}.toastui-editor-md-preview .toastui-editor-contents blockquote{min-height:20px}.toastui-editor-md-preview .toastui-editor-contents li{min-height:22px}.toastui-editor-pseudo-clipboard{opacity:0;z-index:-1;width:0;height:0;position:fixed;top:-1000px;left:-1000px}.toastui-editor-contents .toastui-editor-md-preview-highlight{z-index:0;position:relative}.toastui-editor-contents .toastui-editor-md-preview-highlight:after{content:\"\";z-index:-1;background-color:#fff58380;border-radius:4px;position:absolute;top:-4px;bottom:-4px;left:-4px;right:-4px}.toastui-editor-contents h1.toastui-editor-md-preview-highlight:after,.toastui-editor-contents h2.toastui-editor-md-preview-highlight:after{bottom:0}.toastui-editor-contents td.toastui-editor-md-preview-highlight:after,.toastui-editor-contents th.toastui-editor-md-preview-highlight:after{display:none}.toastui-editor-contents th.toastui-editor-md-preview-highlight,.toastui-editor-contents td.toastui-editor-md-preview-highlight{background-color:#fff58380}.toastui-editor-contents th.toastui-editor-md-preview-highlight{color:#222}.toastui-editor-md-heading1{font-size:24px}.toastui-editor-md-heading2{font-size:22px}.toastui-editor-md-heading3{font-size:20px}.toastui-editor-md-heading4{font-size:18px}.toastui-editor-md-heading5{font-size:16px}.toastui-editor-md-heading6{font-size:14px}.toastui-editor-md-heading.toastui-editor-md-delimiter.setext{line-height:15px}.toastui-editor-md-strong,.toastui-editor-md-heading,.toastui-editor-md-list-item-style,.toastui-editor-md-list-item .toastui-editor-md-meta{font-weight:700}.toastui-editor-md-emph{font-style:italic}.toastui-editor-md-strike{text-decoration:line-through}.toastui-editor-md-strike.toastui-editor-md-delimiter{text-decoration:none}.toastui-editor-md-delimiter,.toastui-editor-md-thematic-break,.toastui-editor-md-link,.toastui-editor-md-table,.toastui-editor-md-block-quote{color:#ccc}.toastui-editor-md-code.toastui-editor-md-delimiter{color:#aaa}.toastui-editor-md-meta,.toastui-editor-md-html,.toastui-editor-md-link.toastui-editor-md-link-url.toastui-editor-md-marked-text{color:#999}.toastui-editor-md-block-quote .toastui-editor-md-marked-text,.toastui-editor-md-list-item .toastui-editor-md-meta{color:#555}.toastui-editor-md-table .toastui-editor-md-table-cell{color:#222}.toastui-editor-md-link.toastui-editor-md-link-desc.toastui-editor-md-marked-text,.toastui-editor-md-list-item-style.toastui-editor-md-list-item-odd{color:#4b96e6}.toastui-editor-md-list-item-style.toastui-editor-md-list-item-even{color:#cb4848}.toastui-editor-md-code.toastui-editor-md-marked-text{color:#c1798b}.toastui-editor-md-code{letter-spacing:-.3px;background-color:#f3e5e980;padding:2px 0}.toastui-editor-md-code.toastui-editor-md-start{border-top-left-radius:2px;border-bottom-left-radius:2px;padding-left:2px}.toastui-editor-md-code.toastui-editor-md-end{border-top-right-radius:2px;border-bottom-right-radius:2px;padding-right:2px}.toastui-editor-md-code-block-line-background{background-color:#f5f7f8}.toastui-editor-md-code-block-line-background.start,.toastui-editor-md-custom-block-line-background.start{margin-top:2px}.toastui-editor-md-code,.toastui-editor-md-code-block{font-family:Consolas,Courier,Lucida Grande,나눔바른고딕,Nanum Barun Gothic,맑은고딕,Malgun Gothic,sans-serif}.toastui-editor-md-custom-block{color:#452d6b}.toastui-editor-md-custom-block-line-background{background-color:#f9f7fd}.toastui-editor-md-custom-block .toastui-editor-md-delimiter{color:#b8b3c0}.toastui-editor-md-custom-block .toastui-editor-md-meta{color:#5200d0}", ED = ae("<div id=\"toast-ui-editor-container\"></div>");
function DD(d, ae) {
	if (new.target) return s({
		component: DD,
		...d
	});
	e(ae, !1);
	let w = () => i(_, "$localStore", T), oe = () => i(u, "$ndk", T), se = () => i(ne, "$theme", T), [T, ce] = n(), le = C(), ue = f(ae, "opinionContent", 12), E = f(ae, "fileArray", 12), de = C(null), D = C(!1), fe = ue().replace(h, "").replace(S, ""), O = /\.([\w]{1,7})$/i, pe = (e) => e.replace(/(?<!\]\()https?:\/\/\S*\.(jpg|jpeg|png|gif|svg|webp)(?!\))/g, (e) => e.startsWith("![](") ? e : `![](${e})`), me = async (e) => {
		let t = w().pk;
		t ? !oe().signer && await ee(t) : !oe().signer && await b();
		let n = await y(e);
		if (n.ok) {
			var r, i, a, o;
			let t = e.name.match(O);
			((r = n.file) == null || (r = r.metadata) == null ? void 0 : r.mimeType) === "image/webp" && (t = ["", "webp"]);
			let s = (i = (a = n.file) == null || (a = a.metadata) == null ? void 0 : a.url) == null ? `${c}/d/${(o = n.file) == null ? void 0 : o.id}${t ? `.${t[1]}` : ""}` : i;
			return E([...E(), {
				files: e,
				url: s
			}]), s;
		}
		return "";
	};
	function he() {
		t(de) && (o(D, !0), ue(t(de).getMarkdown()));
	}
	function ge(e, t) {
		return new CD({
			el: e,
			height: "300px",
			initialEditType: "markdown",
			previewStyle: "tab",
			theme: t.theme,
			initialValue: t.initialValue,
			autofocus: !0,
			events: { change: () => t.onContentChange() },
			hooks: { addImageBlobHook: async (e, n) => {
				let r = await t.uploadImageFn(e);
				r && n(r, "image");
			} },
			extendedAutolinks: !0
		});
	}
	function _e(e, t) {
		if (!t) return;
		let n = null, r = e.getRootNode();
		(r instanceof ShadowRoot || r === document) && (n = document.createElement("style"), n.setAttribute("data-toast-ui-editor-injected", ""), n.textContent = TD + "\n" + te, r instanceof ShadowRoot ? r.insertBefore(n, r.firstChild) : document.head.appendChild(n));
		let i = ge(e, t);
		return t.setEditor(i), {
			update(n) {
				n.theme !== t.theme && (i.destroy(), t.setEditor(null), i = ge(e, n), n.setEditor(i), t = n);
			},
			destroy() {
				i.destroy(), t.setEditor(null), n != null && n.parentNode && n.remove();
			}
		};
	}
	l(() => se(), () => {
		o(le, {
			initialValue: fe,
			theme: se(),
			setEditor: (e) => o(de, e),
			onContentChange: he,
			uploadImageFn: me
		});
	}), l(() => (t(de), t(D), a(ue())), () => {
		if (t(de) && !t(D)) {
			let e = t(de).getMarkdown();
			ue() !== e && (ue(pe(ue())), t(de).setMarkdown(ue()));
		}
		o(D, !1);
	}), ie();
	var ve = {
		get opinionContent() {
			return ue();
		},
		set opinionContent(e) {
			ue(e), r();
		},
		get fileArray() {
			return E();
		},
		set fileArray(e) {
			E(e), r();
		},
		$set: v,
		$on: (e, t) => x(ae, e, t)
	};
	m();
	var ye = ED();
	p(ye, (e, t) => _e == null ? void 0 : _e(e, t), () => t(le)), re(d, ye);
	var be = g(ve);
	return ce(), be;
}
d(DD, {
	opinionContent: {},
	fileArray: {}
}, [], [], { mode: "open" });
//#endregion
export { DD as default };
