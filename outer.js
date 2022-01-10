! function(e) {
	var n = {};

	function t(o) {
		if (n[o]) return n[o].exports;
		var r = n[o] = {
			i: o,
			l: !1,
			exports: {}
		};
		return e[o].call(r.exports, r, r.exports, t), r.l = !0, r.exports
	}
	t.m = e, t.c = n, t.d = function(e, n, o) {
		t.o(e, n) || Object.defineProperty(e, n, {
			enumerable: !0,
			get: o
		})
	}, t.r = function(e) {
		"undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
			value: "Module"
		}), Object.defineProperty(e, "__esModule", {
			value: !0
		})
	}, t.t = function(e, n) {
		if (1 & n && (e = t(e)), 8 & n) return e;
		if (4 & n && "object" == typeof e && e && e.__esModule) return e;
		var o = Object.create(null);
		if (t.r(o), Object.defineProperty(o, "default", {
				enumerable: !0,
				value: e
			}), 2 & n && "string" != typeof e)
			for (var r in e) t.d(o, r, function(n) {
				return e[n]
			}.bind(null, r));
		return o
	}, t.n = function(e) {
		var n = e && e.__esModule ? function() {
			return e.default
		} : function() {
			return e
		};
		return t.d(n, "a", n), n
	}, t.o = function(e, n) {
		return Object.prototype.hasOwnProperty.call(e, n)
	}, t.p = "", t(t.s = 1)
}([function(e, n) {
	let t = !1;
	const o = e => new Promise(n => {
		e && e.requestPermission ? e.requestPermission().then(n).catch(() => {
			n("retry")
		}) : n("granted")
	});
	e.exports = {
		showPermissionPrompt: () => {
			(() => {
				if (t) return;
				t = !0;
				const e = document.createElement("style");
				e.textContent = "\n      .prompt-box-8w-iframe {\n        font-family: 'Nunito', 'Nunito Regular', 'Varela-Round', sans-serif;\n        position: fixed;\n        left: 50%;\n        top: 50%;\n        transform: translate(-50%, -50%);\n        width: 90vmin;\n        width: 15em;\n        max-width: 100%;\n        font-size: 20px;\n        z-index: 888;\n        background-color: white;\n        filter: drop-shadow(0 0 3px #0008);\n        overflow: hidden;\n        border-radius: 0.5em;\n        padding: 0.5em;\n        background-color: #3A3B55;\n        color: #fff;\n        text-align: center;\n      }\n\n      .prompt-box-8w-iframe * {\n        font-family: inherit;\n      }\n\n      .prompt-box-8w-iframe p {\n        margin: 0.5em 0.5em 1em;\n      }\n\n      .prompt-button-container-8w-iframe {\n        display: flex;\n      }\n\n      .prompt-button-8w-iframe {\n        flex: 1 0 0;\n        min-width: 5em;\n        text-align: center;\n        color: white;\n        background-color: #8083A2;\n        font-size: inherit;\n        font-family: inherit;\n        display: block;\n        outline: none;\n        border: none;\n        margin: 0;\n        border-radius: 0.25em;\n        padding: 0.37em;\n      }\n\n      .prompt-button-8w-iframe:not(:last-child) {\n        margin-right: 0.5em;\n      }\n\n      .button-primary-8w-iframe {\n        background-color: #AD50FF;\n      }\n    ", document.head.prepend(e)
			})();
			const e = document.createElement("div");
			e.classList.add("prompt-box-8w-iframe");
			const n = document.createElement("p");
			n.textContent = "AR requires access to device motion sensors", e.appendChild(n);
			const o = document.createElement("div");
			o.classList.add("prompt-button-container-8w-iframe");
			const r = document.createElement("button");
			r.classList.add("prompt-button-8w-iframe"), r.textContent = "Cancel", o.appendChild(r);
			const i = document.createElement("button");
			return i.classList.add("prompt-button-8w-iframe", "button-primary-8w-iframe"), i.textContent = "Continue", o.appendChild(i), e.appendChild(o), document.body.appendChild(e), new Promise((n, t) => {
				r.addEventListener("click", () => {
					document.body.removeChild(e), t(new Error("User denied permission prompt"))
				}, {
					once: !0
				}), i.addEventListener("click", () => {
					document.body.removeChild(e), n()
				}, {
					once: !0
				})
			})
		},
		requestMotionPermissions: () => {
			const e = [o(window.DeviceMotionEvent), o(window.DeviceOrientationEvent)];
			return Promise.all(e).then(e => e.find(e => "granted" !== e) || "granted")
		}
	}
}, function(e, n, t) {
	"use strict";
	t.r(n);
	var o = t(0);
	let r;
	const i = e => {
		const n = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform),
			t = !!(navigator.maxTouchPoints && navigator.maxTouchPoints > 2 && /Mac/.test(navigator.platform));
		if (n || t)
			if (e) r && r.destroy(), r = (e => {
				let n = "string" == typeof e ? document.getElementById(e) : e;
				const t = () => (n || (n = document.getElementById(e)), n),
					r = n => {
						const o = t();
						o ? o.contentWindow.postMessage({
							deviceOrientation8w: {
								alpha: n.alpha,
								beta: n.beta,
								gamma: n.gamma
							}
						}, "*") : console.error("iframe not found", e)
					},
					i = n => {
						const o = t();
						if (!o) return void console.error("iframe not found", e);
						const r = {};
						n.acceleration && (r.acceleration = {
							x: n.acceleration.x,
							y: n.acceleration.y,
							z: n.acceleration.z
						}), n.rotationRate && (r.rotationRate = {
							alpha: n.rotationRate.alpha,
							beta: n.rotationRate.beta,
							gamma: n.rotationRate.gamma
						}), n.accelerationIncludingGravity && (r.accelerationIncludingGravity = {
							x: n.accelerationIncludingGravity.x,
							y: n.accelerationIncludingGravity.y,
							z: n.accelerationIncludingGravity.z
						}), o.contentWindow.postMessage({
							deviceMotion8w: r
						}, "*")
					},
					a = n => {
						if ("devicemotionrequest8w" === n.data) {
							const n = t();
							if (!n) return void console.error("iframe not found", e);
							Object(o.requestMotionPermissions)().then(e => {
								"granted" === e ? n.contentWindow.postMessage("devicemotiongranted8w", "*") : Object(o.showPermissionPrompt)().then(() => {
									Object(o.requestMotionPermissions)().then(e => {
										"granted" === e ? n.contentWindow.postMessage("devicemotiongranted8w", "*") : n.contentWindow.postMessage("devicemotiondenied8w", "*")
									})
								}).catch(() => {
									n.contentWindow.postMessage("promptdenied8w", "*")
								})
							})
						}
					};
				window.addEventListener("deviceorientation", r), window.addEventListener("devicemotion", i), window.addEventListener("message", a);
				return {
					destroy: () => {
						window.removeEventListener("deviceorientation", r), window.removeEventListener("devicemotion", i), window.removeEventListener("message", a)
					}
				}
			})(e);
			else {
				const n = "Missing iframe or ID";
				console.error(n, e)
			}
	};
	window.XRIFrame = {
		registerXRIFrame: i,
		deregisterXRIFrame: () => {
			r && (r.destroy(), r = null)
		}
	};
	const a = document.currentScript || [].find.call(document.scripts, e => /iframe(\?.*)?$/.test(e.src)),
		d = a && a.src,
		c = d && (e => new URL(e).searchParams.get("id"))(d);
	c && (document.getElementById(c) ? i(c) : window.addEventListener("load", () => {
		i(c)
	}))
}]);