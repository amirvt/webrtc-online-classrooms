/* eslint-disable */
(function (b, a) {
    b.version = "0.9.6";
    b.protocol = 1;
    b.transports = [];
    b.j = [];
    b.sockets = {};
    b.connect = function (c, d) {
        var f = b.util.parseUri(c), g, i;
        a && a.location && (f.protocol = f.protocol || a.location.protocol.slice(0, -1), f.host = f.host || (a.document ? a.document.domain : a.location.hostname), f.port = f.port || a.location.port);
        g = b.util.uniqueUri(f);
        var k = {
            host: f.host,
            secure: "https" == f.protocol,
            port: f.port || ("https" == f.protocol ? 443 : 80),
            query: f.query || ""
        };
        b.util.merge(k, d);
        if (k["force new connection"] || !b.sockets[g])i = new b.Socket(k);
        !k["force new connection"] && i && (b.sockets[g] = i);
        i = i || b.sockets[g];
        return i.of(1 < f.path.length ? f.path : "")
    }
})("object" === typeof module ? module.exports : this.io = {}, this);
(function (b, a) {
    var c = b.util = {}, d = /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/, f = "source,protocol,authority,userInfo,user,password,host,port,relative,path,directory,file,query,anchor".split(",");
    c.parseUri = function (a) {
        for (var a = d.exec(a || ""), b = {}, e = 14; e--;)b[f[e]] = a[e] || "";
        return b
    };
    c.uniqueUri = function (b) {
        var d = b.protocol, e = b.host, b = b.port;
        "document" in
        a ? (e = e || document.domain, b = b || ("https" == d && "https:" !== document.location.protocol ? 443 : document.location.port)) : (e = e || "localhost", !b && "https" == d && (b = 443));
        return (d || "http") + "://" + e + ":" + (b || 80)
    };
    c.query = function (a, b) {
        var e = c.chunkQuery(a || ""), j = [];
        c.merge(e, c.chunkQuery(b || ""));
        for (var d in e)e.hasOwnProperty(d) && j.push(d + "=" + e[d]);
        return j.length ? "?" + j.join("&") : ""
    };
    c.chunkQuery = function (a) {
        for (var b = {}, a = a.split("&"), e = 0, j = a.length, d; e < j; ++e)d = a[e].split("="), d[0] && (b[d[0]] = d[1]);
        return b
    };
    var g = !1;
    c.load = function (b) {
        if ("document" in a && "complete" === document.readyState || g)return b();
        c.on(a, "load", b, !1)
    };
    c.on = function (a, b, e, j) {
        a.attachEvent ? a.attachEvent("on" + b, e) : a.addEventListener && a.addEventListener(b, e, j)
    };
    c.request = function (a) {
        if (a && "undefined" != typeof XDomainRequest)return new XDomainRequest;
        if ("undefined" != typeof XMLHttpRequest && (!a || c.ua.hasCORS))return new XMLHttpRequest;
        if (!a)try {
            return new (window[["Active"].concat("Object").join("X")])("Microsoft.XMLHTTP")
        } catch (b) {
        }
        return null
    };
    "undefined" != typeof window && c.load(function () {
        g = !0
    });
    c.defer = function (a) {
        if (!c.ua.webkit || "undefined" != typeof importScripts)return a();
        c.load(function () {
            setTimeout(a, 100)
        })
    };
    c.merge = function (a, b, e, j) {
        var j = j || [], e = "undefined" == typeof e ? 2 : e, d;
        for (d in b)b.hasOwnProperty(d) && 0 > c.indexOf(j, d) && ("object" !== typeof a[d] || !e ? (a[d] = b[d], j.push(b[d])) : c.merge(a[d], b[d], e - 1, j));
        return a
    };
    c.mixin = function (a, b) {
        c.merge(a.prototype, b.prototype)
    };
    c.inherit = function (a, b) {
        function e() {
        }

        e.prototype = b.prototype;
        a.prototype = new e
    };
    c.isArray = Array.isArray || function (a) {
            return "[object Array]" === Object.prototype.toString.call(a)
        };
    c.intersect = function (a, b) {
        for (var e = [], j = a.length > b.length ? a : b, d = a.length > b.length ? b : a, f = 0, g = d.length; f < g; f++)~c.indexOf(j, d[f]) && e.push(d[f]);
        return e
    };
    c.indexOf = function (a, b, e) {
        for (var j = a.length, e = 0 > e ? 0 > e + j ? 0 : e + j : e || 0; e < j && a[e] !== b; e++);
        return j <= e ? -1 : e
    };
    c.toArray = function (a) {
        for (var b = [], e = 0, j = a.length; e < j; e++)b.push(a[e]);
        return b
    };
    c.ua = {};
    c.ua.hasCORS = "undefined" != typeof XMLHttpRequest && function () {
            try {
                var a =
                    new XMLHttpRequest
            } catch (b) {
                return !1
            }
            return void 0 != a.withCredentials
        }();
    c.ua.webkit = "undefined" != typeof navigator && /webkit/i.test(navigator.userAgent)
})("undefined" != typeof io ? io : module.exports, this);
(function (b, a) {
    function c() {
    }

    b.EventEmitter = c;
    c.prototype.on = function (b, c) {
        this.$events || (this.$events = {});
        this.$events[b] ? a.util.isArray(this.$events[b]) ? this.$events[b].push(c) : this.$events[b] = [this.$events[b], c] : this.$events[b] = c;
        return this
    };
    c.prototype.addListener = c.prototype.on;
    c.prototype.once = function (a, b) {
        function c() {
            i.removeListener(a, c);
            b.apply(this, arguments)
        }

        var i = this;
        c.listener = b;
        this.on(a, c);
        return this
    };
    c.prototype.removeListener = function (b, c) {
        if (this.$events && this.$events[b]) {
            var g =
                this.$events[b];
            if (a.util.isArray(g)) {
                for (var i = -1, k = 0, e = g.length; k < e; k++)if (g[k] === c || g[k].listener && g[k].listener === c) {
                    i = k;
                    break
                }
                if (0 > i)return this;
                g.splice(i, 1);
                g.length || delete this.$events[b]
            } else(g === c || g.listener && g.listener === c) && delete this.$events[b]
        }
        return this
    };
    c.prototype.removeAllListeners = function (a) {
        this.$events && this.$events[a] && (this.$events[a] = null);
        return this
    };
    c.prototype.listeners = function (b) {
        this.$events || (this.$events = {});
        this.$events[b] || (this.$events[b] = []);
        a.util.isArray(this.$events[b]) ||
        (this.$events[b] = [this.$events[b]]);
        return this.$events[b]
    };
    c.prototype.emit = function (b) {
        if (!this.$events)return !1;
        var c = this.$events[b];
        if (!c)return !1;
        var g = Array.prototype.slice.call(arguments, 1);
        if ("function" == typeof c)c.apply(this, g); else if (a.util.isArray(c))for (var c = c.slice(), i = 0, k = c.length; i < k; i++)c[i].apply(this, g); else return !1;
        return !0
    }
})("undefined" != typeof io ? io : module.exports, "undefined" != typeof io ? io : module.parent.exports);
(function (b, a) {
    function c(a) {
        return 10 > a ? "0" + a : a
    }

    function d(a) {
        k.lastIndex = 0;
        return k.test(a) ? '"' + a.replace(k, function (a) {
            var e = h[a];
            return "string" === typeof e ? e : "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4)
        }) + '"' : '"' + a + '"'
    }

    function f(a, b) {
        var h, g, i, k, n = e, s, r = b[a];
        r instanceof Date && (r = isFinite(a.valueOf()) ? a.getUTCFullYear() + "-" + c(a.getUTCMonth() + 1) + "-" + c(a.getUTCDate()) + "T" + c(a.getUTCHours()) + ":" + c(a.getUTCMinutes()) + ":" + c(a.getUTCSeconds()) + "Z" : null);
        "function" === typeof o && (r = o.call(b, a,
            r));
        switch (typeof r) {
            case "string":
                return d(r);
            case "number":
                return isFinite(r) ? "" + r : "null";
            case "boolean":
            case "null":
                return "" + r;
            case "object":
                if (!r)return "null";
                e += j;
                s = [];
                if ("[object Array]" === Object.prototype.toString.apply(r)) {
                    k = r.length;
                    for (h = 0; h < k; h += 1)s[h] = f(h, r) || "null";
                    i = 0 === s.length ? "[]" : e ? "[\n" + e + s.join(",\n" + e) + "\n" + n + "]" : "[" + s.join(",") + "]";
                    e = n;
                    return i
                }
                if (o && "object" === typeof o) {
                    k = o.length;
                    for (h = 0; h < k; h += 1)"string" === typeof o[h] && (g = o[h], (i = f(g, r)) && s.push(d(g) + (e ? ": " : ":") + i))
                } else for (g in r)Object.prototype.hasOwnProperty.call(r,
                    g) && (i = f(g, r)) && s.push(d(g) + (e ? ": " : ":") + i);
                i = 0 === s.length ? "{}" : e ? "{\n" + e + s.join(",\n" + e) + "\n" + n + "}" : "{" + s.join(",") + "}";
                e = n;
                return i
        }
    }

    if (a && a.parse)return b.JSON = {parse: a.parse, stringify: a.stringify};
    var g = b.JSON = {}, i = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, k = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, e, j, h = {
        "\u0008": "\\b", "\t": "\\t", "\n": "\\n", "\u000c": "\\f",
        "\r": "\\r", '"': '\\"', "\\": "\\\\"
    }, o;
    g.stringify = function (a, b, c) {
        var d;
        j = e = "";
        if ("number" === typeof c)for (d = 0; d < c; d += 1)j += " "; else"string" === typeof c && (j = c);
        if ((o = b) && "function" !== typeof b && ("object" !== typeof b || "number" !== typeof b.length))throw Error("JSON.stringify");
        return f("", {"": a})
    };
    g.parse = function (a, e) {
        function b(a, j) {
            var c, d, h = a[j];
            if (h && "object" === typeof h)for (c in h)Object.prototype.hasOwnProperty.call(h, c) && (d = b(h, c), void 0 !== d ? h[c] = d : delete h[c]);
            return e.call(a, j, h)
        }

        var j, a = "" + a;
        i.lastIndex =
            0;
        i.test(a) && (a = a.replace(i, function (a) {
            return "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4)
        }));
        if (/^[\],:{}\s]*$/.test(a.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, "")))return j = eval("(" + a + ")"), "function" === typeof e ? b({"": j}, "") : j;
        throw new SyntaxError("JSON.parse");
    }
})("undefined" != typeof io ? io : module.exports, "undefined" !== typeof JSON ? JSON : void 0);
(function (b, a) {
    var c = b.parser = {}, d = c.packets = "disconnect,connect,heartbeat,message,json,event,ack,error,noop".split(","), f = c.reasons = ["transport not supported", "client not handshaken", "unauthorized"], g = c.advice = ["reconnect"], i = a.JSON, k = a.util.indexOf;
    c.encodePacket = function (a) {
        var e = k(d, a.type), b = a.id || "", c = a.endpoint || "", q = a.ack, p = null;
        switch (a.type) {
            case "error":
                var u = a.reason ? k(f, a.reason) : "", a = a.advice ? k(g, a.advice) : "";
                if ("" !== u || "" !== a)p = u + ("" !== a ? "+" + a : "");
                break;
            case "message":
                "" !== a.data &&
                (p = a.data);
                break;
            case "event":
                p = {name: a.name};
                a.args && a.args.length && (p.args = a.args);
                p = i.stringify(p);
                break;
            case "json":
                p = i.stringify(a.data);
                break;
            case "connect":
                a.qs && (p = a.qs);
                break;
            case "ack":
                p = a.ackId + (a.args && a.args.length ? "+" + i.stringify(a.args) : "")
        }
        e = [e, b + ("data" == q ? "+" : ""), c];
        null !== p && void 0 !== p && e.push(p);
        return e.join(":")
    };
    c.encodePayload = function (a) {
        var e = "";
        if (1 == a.length)return a[0];
        for (var b = 0, c = a.length; b < c; b++)e += "\ufffd" + a[b].length + "\ufffd" + a[b];
        return e
    };
    var e = /([^:]+):([0-9]+)?(\+)?:([^:]+)?:?([\s\S]*)?/;
    c.decodePacket = function (a) {
        var b = a.match(e);
        if (!b)return {};
        var c = b[2] || "", a = b[5] || "", k = {type: d[b[1]], endpoint: b[4] || ""};
        c && (k.id = c, k.ack = b[3] ? "data" : !0);
        switch (k.type) {
            case "error":
                b = a.split("+");
                k.reason = f[b[0]] || "";
                k.advice = g[b[1]] || "";
                break;
            case "message":
                k.data = a || "";
                break;
            case "event":
                try {
                    var q = i.parse(a);
                    k.name = q.name;
                    k.args = q.args
                } catch (p) {
                }
                k.args = k.args || [];
                break;
            case "json":
                try {
                    k.data = i.parse(a)
                } catch (u) {
                }
                break;
            case "connect":
                k.qs = a || "";
                break;
            case "ack":
                if (b = a.match(/^([0-9]+)(\+)?(.*)/))if (k.ackId =
                        b[1], k.args = [], b[3])try {
                    k.args = b[3] ? i.parse(b[3]) : []
                } catch (v) {
                }
        }
        return k
    };
    c.decodePayload = function (a) {
        if ("\ufffd" == a.charAt(0)) {
            for (var e = [], b = 1, d = ""; b < a.length; b++)"\ufffd" == a.charAt(b) ? (e.push(c.decodePacket(a.substr(b + 1).substr(0, d))), b += Number(d) + 1, d = "") : d += a.charAt(b);
            return e
        }
        return [c.decodePacket(a)]
    }
})("undefined" != typeof io ? io : module.exports, "undefined" != typeof io ? io : module.parent.exports);
(function (b, a) {
    function c(a, b) {
        this.socket = a;
        this.sessid = b
    }

    b.Transport = c;
    a.util.mixin(c, a.EventEmitter);
    c.prototype.onData = function (b) {
        this.clearCloseTimeout();
        (this.socket.connected || this.socket.connecting || this.socket.reconnecting) && this.setCloseTimeout();
        if ("" !== b && (b = a.parser.decodePayload(b)) && b.length)for (var c = 0, g = b.length; c < g; c++)this.onPacket(b[c]);
        return this
    };
    c.prototype.onPacket = function (a) {
        this.socket.setHeartbeatTimeout();
        if ("heartbeat" == a.type)return this.onHeartbeat();
        if ("connect" ==
            a.type && "" == a.endpoint)this.onConnect();
        "error" == a.type && "reconnect" == a.advice && (this.open = !1);
        this.socket.onPacket(a);
        return this
    };
    c.prototype.setCloseTimeout = function () {
        if (!this.closeTimeout) {
            var a = this;
            this.closeTimeout = setTimeout(function () {
                a.onDisconnect()
            }, this.socket.closeTimeout)
        }
    };
    c.prototype.onDisconnect = function () {
        this.close && this.open && this.close();
        this.clearTimeouts();
        this.socket.onDisconnect();
        return this
    };
    c.prototype.onConnect = function () {
        this.socket.onConnect();
        return this
    };
    c.prototype.clearCloseTimeout =
        function () {
            this.closeTimeout && (clearTimeout(this.closeTimeout), this.closeTimeout = null)
        };
    c.prototype.clearTimeouts = function () {
        this.clearCloseTimeout();
        this.reopenTimeout && clearTimeout(this.reopenTimeout)
    };
    c.prototype.packet = function (b) {
        this.send(a.parser.encodePacket(b))
    };
    c.prototype.onHeartbeat = function () {
        this.packet({type: "heartbeat"})
    };
    c.prototype.onOpen = function () {
        this.open = !0;
        this.clearCloseTimeout();
        this.socket.onOpen()
    };
    c.prototype.onClose = function () {
        this.open = !1;
        this.socket.onClose();
        this.onDisconnect()
    };
    c.prototype.prepareUrl = function () {
        var b = this.socket.options;
        return this.scheme() + "://" + b.host + ":" + b.port + "/" + b.resource + "/" + a.protocol + "/" + this.name + "/" + this.sessid
    };
    c.prototype.ready = function (a, b) {
        b.call(this)
    }
})("undefined" != typeof io ? io : module.exports, "undefined" != typeof io ? io : module.parent.exports);
(function (b, a, c) {
    function d(b) {
        this.options = {
            port: 80,
            secure: !1,
            document: "document" in c ? document : !1,
            resource: "socket.io",
            transports: a.transports,
            "connect timeout": 1E4,
            "try multiple transports": !0,
            reconnect: !0,
            "reconnection delay": 500,
            "reconnection limit": Infinity,
            "reopen delay": 3E3,
            "max reconnection attempts": 10,
            "sync disconnect on unload": !0,
            "auto connect": !0,
            "flash policy port": 10843
        };
        a.util.merge(this.options, b);
        this.reconnecting = this.connecting = this.open = this.connected = !1;
        this.namespaces = {};
        this.buffer =
            [];
        this.doBuffer = !1;
        if (this.options["sync disconnect on unload"] && (!this.isXDomain() || a.util.ua.hasCORS)) {
            var d = this;
            a.util.on(c, "unload", function () {
                d.disconnectSync()
            }, !1)
        }
        this.options["auto connect"] && this.connect()
    }

    function f() {
    }

    b.Socket = d;
    a.util.mixin(d, a.EventEmitter);
    d.prototype.of = function (b) {
        this.namespaces[b] || (this.namespaces[b] = new a.SocketNamespace(this, b), "" !== b && this.namespaces[b].packet({type: "connect"}));
        return this.namespaces[b]
    };
    d.prototype.publish = function () {
        this.emit.apply(this,
            arguments);
        var a, b;
        for (b in this.namespaces)this.namespaces.hasOwnProperty(b) && (a = this.of(b), a.$emit.apply(a, arguments))
    };
    d.prototype.handshake = function (b) {
        function c(a) {
            if (a instanceof Error)d.onError(a.message); else b.apply(null, a.split(":"))
        }

        var d = this, e = this.options, e = ["http" + (e.secure ? "s" : "") + ":/", e.host + ":" + e.port, e.resource, a.protocol, a.util.query(this.options.query, "t=" + +new Date)].join("/");
        if (this.isXDomain() && !a.util.ua.hasCORS) {
            var j = document.getElementsByTagName("script")[0], h = document.createElement("script");
            h.src = e + "&jsonp=" + a.j.length;
            j.parentNode.insertBefore(h, j);
            a.j.push(function (a) {
                c(a);
                h.parentNode.removeChild(h)
            })
        } else {
            var o = a.util.request();
            o.open("GET", e, !0);
            o.withCredentials = !0;
            o.onreadystatechange = function () {
                4 == o.readyState && (o.onreadystatechange = f, 200 == o.status ? c(o.responseText) : !d.reconnecting && d.onError(o.responseText))
            };
            o.send(null)
        }
    };
    d.prototype.getTransport = function (b) {
        for (var b = b || this.transports, c = 0, d; d = b[c]; c++)if (a.Transport[d] && a.Transport[d].check(this) && (!this.isXDomain() || a.Transport[d].xdomainCheck()))return new a.Transport[d](this,
            this.sessionid);
        return null
    };
    d.prototype.connect = function (b) {
        if (this.connecting)return this;
        var c = this;
        this.handshake(function (d, e, j, h) {
            function f(a) {
                c.transport && c.transport.clearTimeouts();
                c.transport = c.getTransport(a);
                if (!c.transport)return c.publish("connect_failed");
                c.transport.ready(c, function () {
                    c.connecting = !0;
                    c.publish("connecting", c.transport.name);
                    c.transport.open();
                    c.options["connect timeout"] && (c.connectTimeoutTimer = setTimeout(function () {
                        if (!c.connected && (c.connecting = !1, c.options["try multiple transports"])) {
                            c.remainingTransports ||
                            (c.remainingTransports = c.transports.slice(0));
                            for (var a = c.remainingTransports; 0 < a.length && a.splice(0, 1)[0] != c.transport.name;);
                            a.length ? f(a) : c.publish("connect_failed")
                        }
                    }, c.options["connect timeout"]))
                })
            }

            c.sessionid = d;
            c.closeTimeout = 1E3 * j;
            c.heartbeatTimeout = 1E3 * e;
            c.transports = h ? a.util.intersect(h.split(","), c.options.transports) : c.options.transports;
            c.setHeartbeatTimeout();
            f(c.transports);
            c.once("connect", function () {
                clearTimeout(c.connectTimeoutTimer);
                b && "function" == typeof b && b()
            })
        });
        return this
    };
    d.prototype.setHeartbeatTimeout = function () {
        clearTimeout(this.heartbeatTimeoutTimer);
        var a = this;
        this.heartbeatTimeoutTimer = setTimeout(function () {
            a.transport.onClose()
        }, this.heartbeatTimeout)
    };
    d.prototype.packet = function (a) {
        this.connected && !this.doBuffer ? this.transport.packet(a) : this.buffer.push(a);
        return this
    };
    d.prototype.setBuffer = function (a) {
        this.doBuffer = a;
        !a && this.connected && this.buffer.length && (this.transport.payload(this.buffer), this.buffer = [])
    };
    d.prototype.disconnect = function () {
        if (this.connected ||
            this.connecting)this.open && this.of("").packet({type: "disconnect"}), this.onDisconnect("booted");
        return this
    };
    d.prototype.disconnectSync = function () {
        a.util.request().open("GET", this.resource + "/" + a.protocol + "/" + this.sessionid, !0);
        this.onDisconnect("booted")
    };
    d.prototype.isXDomain = function () {
        var a = c.location.port || ("https:" == c.location.protocol ? 443 : 80);
        return this.options.host !== c.location.hostname || this.options.port != a
    };
    d.prototype.onConnect = function () {
        this.connected || (this.connected = !0, this.connecting = !1, this.doBuffer || this.setBuffer(!1), this.emit("connect"))
    };
    d.prototype.onOpen = function () {
        this.open = !0
    };
    d.prototype.onClose = function () {
        this.open = !1;
        clearTimeout(this.heartbeatTimeoutTimer)
    };
    d.prototype.onPacket = function (a) {
        this.of(a.endpoint).onPacket(a)
    };
    d.prototype.onError = function (a) {
        if (a && a.advice && "reconnect" === a.advice && (this.connected || this.connecting))this.disconnect(), this.options.reconnect && this.reconnect();
        this.publish("error", a && a.reason ? a.reason : a)
    };
    d.prototype.onDisconnect = function (a) {
        var b =
            this.connected, c = this.connecting;
        this.open = this.connecting = this.connected = !1;
        if (b || c)this.transport.close(), this.transport.clearTimeouts(), b && (this.publish("disconnect", a), "booted" != a && this.options.reconnect && !this.reconnecting && this.reconnect())
    };
    d.prototype.reconnect = function () {
        function a() {
            if (c.connected) {
                for (var e in c.namespaces)c.namespaces.hasOwnProperty(e) && "" !== e && c.namespaces[e].packet({type: "connect"});
                c.publish("reconnect", c.transport.name, c.reconnectionAttempts)
            }
            clearTimeout(c.reconnectionTimer);
            c.removeListener("connect_failed", b);
            c.removeListener("connect", b);
            c.reconnecting = !1;
            delete c.reconnectionAttempts;
            delete c.reconnectionDelay;
            delete c.reconnectionTimer;
            delete c.redoTransports;
            c.options["try multiple transports"] = d
        }

        function b() {
            if (c.reconnecting) {
                if (c.connected)return a();
                if (c.connecting && c.reconnecting)return c.reconnectionTimer = setTimeout(b, 1E3);
                c.reconnectionAttempts++ >= e ? c.redoTransports ? (c.publish("reconnect_failed"), a()) : (c.on("connect_failed", b), c.options["try multiple transports"] = !0, c.transport = c.getTransport(), c.redoTransports = !0, c.connect()) : (c.reconnectionDelay < h && (c.reconnectionDelay *= 2), c.connect(), c.publish("reconnecting", c.reconnectionDelay, c.reconnectionAttempts), c.reconnectionTimer = setTimeout(b, c.reconnectionDelay))
            }
        }

        this.reconnecting = !0;
        this.reconnectionAttempts = 0;
        this.reconnectionDelay = this.options["reconnection delay"];
        var c = this, e = this.options["max reconnection attempts"], d = this.options["try multiple transports"], h = this.options["reconnection limit"];
        this.options["try multiple transports"] = !1;
        this.reconnectionTimer = setTimeout(b, this.reconnectionDelay);
        this.on("connect", b)
    }
})("undefined" != typeof io ? io : module.exports, "undefined" != typeof io ? io : module.parent.exports, this);
(function (b, a) {
    function c(a, b) {
        this.socket = a;
        this.name = b || "";
        this.flags = {};
        this.json = new d(this, "json");
        this.ackPackets = 0;
        this.acks = {}
    }

    function d(a, b) {
        this.namespace = a;
        this.name = b
    }

    b.SocketNamespace = c;
    a.util.mixin(c, a.EventEmitter);
    c.prototype.$emit = a.EventEmitter.prototype.emit;
    c.prototype.of = function () {
        return this.socket.of.apply(this.socket, arguments)
    };
    c.prototype.packet = function (a) {
        a.endpoint = this.name;
        this.socket.packet(a);
        this.flags = {};
        return this
    };
    c.prototype.send = function (a, b) {
        var c = {
            type: this.flags.json ?
                "json" : "message", data: a
        };
        "function" == typeof b && (c.id = ++this.ackPackets, c.ack = !0, this.acks[c.id] = b);
        return this.packet(c)
    };
    c.prototype.emit = function (a) {
        var b = Array.prototype.slice.call(arguments, 1), c = b[b.length - 1], d = {type: "event", name: a};
        "function" == typeof c && (d.id = ++this.ackPackets, d.ack = "data", this.acks[d.id] = c, b = b.slice(0, b.length - 1));
        d.args = b;
        return this.packet(d)
    };
    c.prototype.disconnect = function () {
        "" === this.name ? this.socket.disconnect() : (this.packet({type: "disconnect"}), this.$emit("disconnect"));
        return this
    };
    c.prototype.onPacket = function (b) {
        function c() {
            d.packet({type: "ack", args: a.util.toArray(arguments), ackId: b.id})
        }

        var d = this;
        switch (b.type) {
            case "connect":
                this.$emit("connect");
                break;
            case "disconnect":
                if ("" === this.name)this.socket.onDisconnect(b.reason || "booted"); else this.$emit("disconnect", b.reason);
                break;
            case "message":
            case "json":
                var k = ["message", b.data];
                "data" == b.ack ? k.push(c) : b.ack && this.packet({type: "ack", ackId: b.id});
                this.$emit.apply(this, k);
                break;
            case "event":
                k = [b.name].concat(b.args);
                "data" == b.ack && k.push(c);
                this.$emit.apply(this, k);
                break;
            case "ack":
                this.acks[b.ackId] && (this.acks[b.ackId].apply(this, b.args), delete this.acks[b.ackId]);
                break;
            case "error":
                if (b.advice)this.socket.onError(b); else"unauthorized" == b.reason ? this.$emit("connect_failed", b.reason) : this.$emit("error", b.reason)
        }
    };
    d.prototype.send = function () {
        this.namespace.flags[this.name] = !0;
        this.namespace.send.apply(this.namespace, arguments)
    };
    d.prototype.emit = function () {
        this.namespace.flags[this.name] = !0;
        this.namespace.emit.apply(this.namespace,
            arguments)
    }
})("undefined" != typeof io ? io : module.exports, "undefined" != typeof io ? io : module.parent.exports);
(function (b, a, c) {
    function d(b) {
        a.Transport.apply(this, arguments)
    }

    b.websocket = d;
    a.util.inherit(d, a.Transport);
    d.prototype.name = "websocket";
    d.prototype.open = function () {
        var b = a.util.query(this.socket.options.query), d = this, i;
        i || (i = c.MozWebSocket || c.WebSocket);
        this.websocket = new i(this.prepareUrl() + b);
        this.websocket.onopen = function () {
            d.onOpen();
            d.socket.setBuffer(!1)
        };
        this.websocket.onmessage = function (a) {
            d.onData(a.data)
        };
        this.websocket.onclose = function () {
            d.onClose();
            d.socket.setBuffer(!0)
        };
        this.websocket.onerror =
            function (a) {
                d.onError(a)
            };
        return this
    };
    d.prototype.send = function (a) {
        this.websocket.send(a);
        return this
    };
    d.prototype.payload = function (a) {
        for (var b = 0, c = a.length; b < c; b++)this.packet(a[b]);
        return this
    };
    d.prototype.close = function () {
        this.websocket.close();
        return this
    };
    d.prototype.onError = function (a) {
        this.socket.onError(a)
    };
    d.prototype.scheme = function () {
        return this.socket.options.secure ? "wss" : "ws"
    };
    d.check = function () {
        return "WebSocket" in c && !("__addTask" in WebSocket) || "MozWebSocket" in c
    };
    d.xdomainCheck = function () {
        return !0
    };
    a.transports.push("websocket")
})("undefined" != typeof io ? io.Transport : module.exports, "undefined" != typeof io ? io : module.parent.exports, this);
(function (b, a) {
    function c() {
        a.Transport.websocket.apply(this, arguments)
    }

    b.flashsocket = c;
    a.util.inherit(c, a.Transport.websocket);
    c.prototype.name = "flashsocket";
    c.prototype.open = function () {
        var b = this, c = arguments;
        WebSocket.__addTask(function () {
            a.Transport.websocket.prototype.open.apply(b, c)
        });
        return this
    };
    c.prototype.send = function () {
        var b = this, c = arguments;
        WebSocket.__addTask(function () {
            a.Transport.websocket.prototype.send.apply(b, c)
        });
        return this
    };
    c.prototype.close = function () {
        WebSocket.__tasks.length =
            0;
        a.Transport.websocket.prototype.close.call(this);
        return this
    };
    c.prototype.ready = function (b, f) {
        function g() {
            var a = b.options, e = a["flash policy port"], j = ["http" + (a.secure ? "s" : "") + ":/", a.host + ":" + a.port, a.resource, "static/flashsocket", "WebSocketMain" + (b.isXDomain() ? "Insecure" : "") + ".swf"];
            c.loaded || ("undefined" === typeof WEB_SOCKET_SWF_LOCATION && (WEB_SOCKET_SWF_LOCATION = j.join("/")), 843 !== e && WebSocket.loadFlashPolicyFile("xmlsocket://" + a.host + ":" + e), WebSocket.__initialize(), c.loaded = !0);
            f.call(i)
        }

        var i =
            this;
        if (document.body)return g();
        a.util.load(g)
    };
    c.check = function () {
        return "undefined" == typeof WebSocket || !("__initialize" in WebSocket) || !swfobject ? !1 : 10 <= swfobject.getFlashPlayerVersion().major
    };
    c.xdomainCheck = function () {
        return !0
    };
    "undefined" != typeof window && (WEB_SOCKET_DISABLE_AUTO_INITIALIZATION = !0);
    a.transports.push("flashsocket")
})("undefined" != typeof io ? io.Transport : module.exports, "undefined" != typeof io ? io : module.parent.exports);
if ("undefined" != typeof window)var swfobject = function () {
    function b() {
        if (!B) {
            try {
                var a = m.getElementsByTagName("body")[0].appendChild(m.createElement("span"));
                a.parentNode.removeChild(a)
            } catch (b) {
                return
            }
            B = !0;
            for (var a = E.length, e = 0; e < a; e++)E[e]()
        }
    }

    function a(a) {
        B ? a() : E[E.length] = a
    }

    function c(a) {
        if (typeof x.addEventListener != n)x.addEventListener("load", a, !1); else if (typeof m.addEventListener != n)m.addEventListener("load", a, !1); else if (typeof x.attachEvent != n)q(x, "onload", a); else if ("function" == typeof x.onload) {
            var b =
                x.onload;
            x.onload = function () {
                b();
                a()
            }
        } else x.onload = a
    }

    function d() {
        var a = m.getElementsByTagName("body")[0], b = m.createElement(s);
        b.setAttribute("type", r);
        var e = a.appendChild(b);
        if (e) {
            var c = 0;
            (function () {
                if (typeof e.GetVariable != n) {
                    var d = e.GetVariable("$version");
                    d && (d = d.split(" ")[1].split(","), l.pv = [parseInt(d[0], 10), parseInt(d[1], 10), parseInt(d[2], 10)])
                } else if (10 > c) {
                    c++;
                    setTimeout(arguments.callee, 10);
                    return
                }
                a.removeChild(b);
                e = null;
                f()
            })()
        } else f()
    }

    function f() {
        var a = z.length;
        if (0 < a)for (var b = 0; b <
        a; b++) {
            var c = z[b].id, d = z[b].callbackFn, j = {success: !1, id: c};
            if (0 < l.pv[0]) {
                var h = t(c);
                if (h)if (p(z[b].swfVersion) && !(l.wk && 312 > l.wk))v(c, !0), d && (j.success = !0, j.ref = g(c), d(j)); else if (z[b].expressInstall && i()) {
                    j = {};
                    j.data = z[b].expressInstall;
                    j.width = h.getAttribute("width") || "0";
                    j.height = h.getAttribute("height") || "0";
                    h.getAttribute("class") && (j.styleclass = h.getAttribute("class"));
                    h.getAttribute("align") && (j.align = h.getAttribute("align"));
                    for (var f = {}, h = h.getElementsByTagName("param"), o = h.length, q = 0; q <
                    o; q++)"movie" != h[q].getAttribute("name").toLowerCase() && (f[h[q].getAttribute("name")] = h[q].getAttribute("value"));
                    k(j, f, c, d)
                } else e(h), d && d(j)
            } else if (v(c, !0), d) {
                if ((c = g(c)) && typeof c.SetVariable != n)j.success = !0, j.ref = c;
                d(j)
            }
        }
    }

    function g(a) {
        var b = null;
        if ((a = t(a)) && "OBJECT" == a.nodeName)typeof a.SetVariable != n ? b = a : (a = a.getElementsByTagName(s)[0]) && (b = a);
        return b
    }

    function i() {
        return !F && p("6.0.65") && (l.win || l.mac) && !(l.wk && 312 > l.wk)
    }

    function k(a, b, e, c) {
        F = !0;
        I = c || null;
        K = {success: !1, id: e};
        var d = t(e);
        if (d) {
            "OBJECT" ==
            d.nodeName ? (D = j(d), G = null) : (D = d, G = e);
            a.id = M;
            if (typeof a.width == n || !/%$/.test(a.width) && 310 > parseInt(a.width, 10))a.width = "310";
            if (typeof a.height == n || !/%$/.test(a.height) && 137 > parseInt(a.height, 10))a.height = "137";
            m.title = m.title.slice(0, 47) + " - Flash Player Installation";
            c = l.ie && l.win ? ["Active"].concat("").join("X") : "PlugIn";
            c = "MMredirectURL=" + x.location.toString().replace(/&/g, "%26") + "&MMplayerType=" + c + "&MMdoctitle=" + m.title;
            b.flashvars = typeof b.flashvars != n ? b.flashvars + ("&" + c) : c;
            l.ie && l.win && 4 !=
            d.readyState && (c = m.createElement("div"), e += "SWFObjectNew", c.setAttribute("id", e), d.parentNode.insertBefore(c, d), d.style.display = "none", function () {
                d.readyState == 4 ? d.parentNode.removeChild(d) : setTimeout(arguments.callee, 10)
            }());
            h(a, b, e)
        }
    }

    function e(a) {
        if (l.ie && l.win && 4 != a.readyState) {
            var b = m.createElement("div");
            a.parentNode.insertBefore(b, a);
            b.parentNode.replaceChild(j(a), b);
            a.style.display = "none";
            (function () {
                4 == a.readyState ? a.parentNode.removeChild(a) : setTimeout(arguments.callee, 10)
            })()
        } else a.parentNode.replaceChild(j(a),
            a)
    }

    function j(a) {
        var b = m.createElement("div");
        if (l.win && l.ie)b.innerHTML = a.innerHTML; else if (a = a.getElementsByTagName(s)[0])if (a = a.childNodes)for (var e = a.length, c = 0; c < e; c++)!(1 == a[c].nodeType && "PARAM" == a[c].nodeName) && 8 != a[c].nodeType && b.appendChild(a[c].cloneNode(!0));
        return b
    }

    function h(a, b, e) {
        var c, d = t(e);
        if (l.wk && 312 > l.wk)return c;
        if (d)if (typeof a.id == n && (a.id = e), l.ie && l.win) {
            var j = "", h;
            for (h in a)a[h] != Object.prototype[h] && ("data" == h.toLowerCase() ? b.movie = a[h] : "styleclass" == h.toLowerCase() ? j +=
                ' class="' + a[h] + '"' : "classid" != h.toLowerCase() && (j += " " + h + '="' + a[h] + '"'));
            h = "";
            for (var f in b)b[f] != Object.prototype[f] && (h += '<param name="' + f + '" value="' + b[f] + '" />');
            d.outerHTML = '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"' + j + ">" + h + "</object>";
            H[H.length] = a.id;
            c = t(a.id)
        } else {
            f = m.createElement(s);
            f.setAttribute("type", r);
            for (var g in a)a[g] != Object.prototype[g] && ("styleclass" == g.toLowerCase() ? f.setAttribute("class", a[g]) : "classid" != g.toLowerCase() && f.setAttribute(g, a[g]));
            for (j in b)b[j] !=
            Object.prototype[j] && "movie" != j.toLowerCase() && (a = f, h = j, g = b[j], e = m.createElement("param"), e.setAttribute("name", h), e.setAttribute("value", g), a.appendChild(e));
            d.parentNode.replaceChild(f, d);
            c = f
        }
        return c
    }

    function o(a) {
        var b = t(a);
        b && "OBJECT" == b.nodeName && (l.ie && l.win ? (b.style.display = "none", function () {
            if (4 == b.readyState) {
                var e = t(a);
                if (e) {
                    for (var c in e)"function" == typeof e[c] && (e[c] = null);
                    e.parentNode.removeChild(e)
                }
            } else setTimeout(arguments.callee, 10)
        }()) : b.parentNode.removeChild(b))
    }

    function t(a) {
        var b =
            null;
        try {
            b = m.getElementById(a)
        } catch (e) {
        }
        return b
    }

    function q(a, b, e) {
        a.attachEvent(b, e);
        C[C.length] = [a, b, e]
    }

    function p(a) {
        var b = l.pv, a = a.split(".");
        a[0] = parseInt(a[0], 10);
        a[1] = parseInt(a[1], 10) || 0;
        a[2] = parseInt(a[2], 10) || 0;
        return b[0] > a[0] || b[0] == a[0] && b[1] > a[1] || b[0] == a[0] && b[1] == a[1] && b[2] >= a[2] ? !0 : !1
    }

    function u(a, b, e, c) {
        if (!l.ie || !l.mac) {
            var d = m.getElementsByTagName("head")[0];
            if (d) {
                e = e && "string" == typeof e ? e : "screen";
                c && (J = y = null);
                if (!y || J != e)c = m.createElement("style"), c.setAttribute("type", "text/css"),
                    c.setAttribute("media", e), y = d.appendChild(c), l.ie && l.win && typeof m.styleSheets != n && 0 < m.styleSheets.length && (y = m.styleSheets[m.styleSheets.length - 1]), J = e;
                l.ie && l.win ? y && typeof y.addRule == s && y.addRule(a, b) : y && typeof m.createTextNode != n && y.appendChild(m.createTextNode(a + " {" + b + "}"))
            }
        }
    }

    function v(a, b) {
        if (N) {
            var e = b ? "visible" : "hidden";
            B && t(a) ? t(a).style.visibility = e : u("#" + a, "visibility:" + e)
        }
    }

    function w(a) {
        return null != /[\\\"<>\.;]/.exec(a) && typeof encodeURIComponent != n ? encodeURIComponent(a) : a
    }

    var n = "undefined",
        s = "object", r = "application/x-shockwave-flash", M = "SWFObjectExprInst", x = window, m = document, A = navigator, O = !1, E = [function () {
            O ? d() : f()
        }], z = [], H = [], C = [], D, G, I, K, B = !1, F = !1, y, J, N = !0, l = function () {
            var a = typeof m.getElementById != n && typeof m.getElementsByTagName != n && typeof m.createElement != n, b = A.userAgent.toLowerCase(), e = A.platform.toLowerCase(), c = e ? /win/.test(e) : /win/.test(b), e = e ? /mac/.test(e) : /mac/.test(b), b = /webkit/.test(b) ? parseFloat(b.replace(/^.*webkit\/(\d+(\.\d+)?).*$/, "$1")) : !1, d = !+"\v1", j = [0, 0, 0], h = null;
            if (typeof A.plugins != n && typeof A.plugins["Shockwave Flash"] == s) {
                if ((h = A.plugins["Shockwave Flash"].description) && !(typeof A.mimeTypes != n && A.mimeTypes[r] && !A.mimeTypes[r].enabledPlugin))O = !0, d = !1, h = h.replace(/^.*\s+(\S+\s+\S+$)/, "$1"), j[0] = parseInt(h.replace(/^(.*)\..*$/, "$1"), 10), j[1] = parseInt(h.replace(/^.*\.(.*)\s.*$/, "$1"), 10), j[2] = /[a-zA-Z]/.test(h) ? parseInt(h.replace(/^.*[a-zA-Z]+(.*)$/, "$1"), 10) : 0
            } else if (typeof x[["Active"].concat("Object").join("X")] != n)try {
                var f = new (window[["Active"].concat("Object").join("X")])("ShockwaveFlash.ShockwaveFlash");
                if (f && (h = f.GetVariable("$version")))d = !0, h = h.split(" ")[1].split(","), j = [parseInt(h[0], 10), parseInt(h[1], 10), parseInt(h[2], 10)]
            } catch (g) {
            }
            return {w3: a, pv: j, wk: b, ie: d, win: c, mac: e}
        }();
    (function () {
        l.w3 && ((typeof m.readyState != n && "complete" == m.readyState || typeof m.readyState == n && (m.getElementsByTagName("body")[0] || m.body)) && b(), B || (typeof m.addEventListener != n && m.addEventListener("DOMContentLoaded", b, !1), l.ie && l.win && (m.attachEvent("onreadystatechange", function () {
            "complete" == m.readyState && (m.detachEvent("onreadystatechange",
                arguments.callee), b())
        }), x == top && function () {
            if (!B) {
                try {
                    m.documentElement.doScroll("left")
                } catch (a) {
                    setTimeout(arguments.callee, 0);
                    return
                }
                b()
            }
        }()), l.wk && function () {
            B || (/loaded|complete/.test(m.readyState) ? b() : setTimeout(arguments.callee, 0))
        }(), c(b)))
    })();
    (function () {
        l.ie && l.win && window.attachEvent("onunload", function () {
            for (var a = C.length, b = 0; b < a; b++)C[b][0].detachEvent(C[b][1], C[b][2]);
            a = H.length;
            for (b = 0; b < a; b++)o(H[b]);
            for (var e in l)l[e] = null;
            l = null;
            for (var c in swfobject)swfobject[c] = null;
            swfobject =
                null
        })
    })();
    return {
        registerObject: function (a, b, e, c) {
            if (l.w3 && a && b) {
                var d = {};
                d.id = a;
                d.swfVersion = b;
                d.expressInstall = e;
                d.callbackFn = c;
                z[z.length] = d;
                v(a, !1)
            } else c && c({success: !1, id: a})
        }, getObjectById: function (a) {
            if (l.w3)return g(a)
        }, embedSWF: function (b, e, c, d, j, f, g, t, q, o) {
            var m = {success: !1, id: e};
            l.w3 && !(l.wk && 312 > l.wk) && b && e && c && d && j ? (v(e, !1), a(function () {
                c += "";
                d += "";
                var a = {};
                if (q && typeof q === s)for (var l in q)a[l] = q[l];
                a.data = b;
                a.width = c;
                a.height = d;
                l = {};
                if (t && typeof t === s)for (var u in t)l[u] = t[u];
                if (g &&
                    typeof g === s)for (var r in g)l.flashvars = typeof l.flashvars != n ? l.flashvars + ("&" + r + "=" + g[r]) : r + "=" + g[r];
                if (p(j))u = h(a, l, e), a.id == e && v(e, !0), m.success = !0, m.ref = u; else {
                    if (f && i()) {
                        a.data = f;
                        k(a, l, e, o);
                        return
                    }
                    v(e, !0)
                }
                o && o(m)
            })) : o && o(m)
        }, switchOffAutoHideShow: function () {
            N = !1
        }, ua: l, getFlashPlayerVersion: function () {
            return {major: l.pv[0], minor: l.pv[1], release: l.pv[2]}
        }, hasFlashPlayerVersion: p, createSWF: function (a, b, e) {
            if (l.w3)return h(a, b, e)
        }, showExpressInstall: function (a, b, e, c) {
            l.w3 && i() && k(a, b, e, c)
        }, removeSWF: function (a) {
            l.w3 &&
            o(a)
        }, createCSS: function (a, b, e, c) {
            l.w3 && u(a, b, e, c)
        }, addDomLoadEvent: a, addLoadEvent: c, getQueryParamValue: function (a) {
            var b = m.location.search || m.location.hash;
            if (b) {
                /\?/.test(b) && (b = b.split("?")[1]);
                if (null == a)return w(b);
                for (var b = b.split("&"), e = 0; e < b.length; e++)if (b[e].substring(0, b[e].indexOf("=")) == a)return w(b[e].substring(b[e].indexOf("=") + 1))
            }
            return ""
        }, expressInstallCallback: function () {
            if (F) {
                var a = t(M);
                a && D && (a.parentNode.replaceChild(D, a), G && (v(G, !0), l.ie && l.win && (D.style.display = "block")),
                I && I(K));
                F = !1
            }
        }
    }
}();
(function () {
    if (!("undefined" == typeof window || window.WebSocket)) {
        var b = window.console;
        if (!b || !b.log || !b.error)b = {
            log: function () {
            }, error: function () {
            }
        };
        swfobject.hasFlashPlayerVersion("10.0.0") ? ("file:" == location.protocol && b.error("WARNING: web-socket-js doesn't work in file:///... URL unless you set Flash Security Settings properly. Open the page via Web server i.e. http://..."), WebSocket = function (a, b, d, f, g) {
            var i = this;
            i.__id = WebSocket.__nextId++;
            WebSocket.__instances[i.__id] = i;
            i.readyState = WebSocket.CONNECTING;
            i.bufferedAmount = 0;
            i.__events = {};
            b ? "string" == typeof b && (b = [b]) : b = [];
            setTimeout(function () {
                WebSocket.__addTask(function () {
                    WebSocket.__flash.create(i.__id, a, b, d || null, f || 0, g || null)
                })
            }, 0)
        }, WebSocket.prototype.send = function (a) {
            if (this.readyState == WebSocket.CONNECTING)throw"INVALID_STATE_ERR: Web Socket connection has not been established";
            a = WebSocket.__flash.send(this.__id, encodeURIComponent(a));
            if (0 > a)return !0;
            this.bufferedAmount += a;
            return !1
        }, WebSocket.prototype.close = function () {
            this.readyState == WebSocket.CLOSED ||
            this.readyState == WebSocket.CLOSING || (this.readyState = WebSocket.CLOSING, WebSocket.__flash.close(this.__id))
        }, WebSocket.prototype.addEventListener = function (a, b) {
            a in this.__events || (this.__events[a] = []);
            this.__events[a].push(b)
        }, WebSocket.prototype.removeEventListener = function (a, b) {
            if (a in this.__events)for (var d = this.__events[a], f = d.length - 1; 0 <= f; --f)if (d[f] === b) {
                d.splice(f, 1);
                break
            }
        }, WebSocket.prototype.dispatchEvent = function (a) {
            for (var b = this.__events[a.type] || [], d = 0; d < b.length; ++d)b[d](a);
            (b = this["on" +
            a.type]) && b(a)
        }, WebSocket.prototype.__handleEvent = function (a) {
            "readyState" in a && (this.readyState = a.readyState);
            "protocol" in a && (this.protocol = a.protocol);
            if ("open" == a.type || "error" == a.type)a = this.__createSimpleEvent(a.type); else if ("close" == a.type)a = this.__createSimpleEvent("close"); else if ("message" == a.type)a = this.__createMessageEvent("message", decodeURIComponent(a.message)); else throw"unknown event type: " + a.type;
            this.dispatchEvent(a)
        }, WebSocket.prototype.__createSimpleEvent = function (a) {
            if (document.createEvent &&
                window.Event) {
                var b = document.createEvent("Event");
                b.initEvent(a, !1, !1);
                return b
            }
            return {type: a, bubbles: !1, cancelable: !1}
        }, WebSocket.prototype.__createMessageEvent = function (a, b) {
            if (document.createEvent && window.MessageEvent && !window.opera) {
                var d = document.createEvent("MessageEvent");
                d.initMessageEvent("message", !1, !1, b, null, null, window, null);
                return d
            }
            return {type: a, data: b, bubbles: !1, cancelable: !1}
        }, WebSocket.CONNECTING = 0, WebSocket.OPEN = 1, WebSocket.CLOSING = 2, WebSocket.CLOSED = 3, WebSocket.__flash = null, WebSocket.__instances =
        {}, WebSocket.__tasks = [], WebSocket.__nextId = 0, WebSocket.loadFlashPolicyFile = function (a) {
            WebSocket.__addTask(function () {
                WebSocket.__flash.loadManualPolicyFile(a)
            })
        }, WebSocket.__initialize = function () {
            if (!WebSocket.__flash)if (WebSocket.__swfLocation && (window.WEB_SOCKET_SWF_LOCATION = WebSocket.__swfLocation), window.WEB_SOCKET_SWF_LOCATION) {
                var a = document.createElement("div");
                a.id = "webSocketContainer";
                a.style.position = "absolute";
                WebSocket.__isFlashLite() ? (a.style.left = "0px", a.style.top = "0px") : (a.style.left =
                    "-100px", a.style.top = "-100px");
                var c = document.createElement("div");
                c.id = "webSocketFlash";
                a.appendChild(c);
                document.body.appendChild(a);
                swfobject.embedSWF(WEB_SOCKET_SWF_LOCATION, "webSocketFlash", "1", "1", "10.0.0", null, null, {
                    hasPriority: !0,
                    swliveconnect: !0,
                    allowScriptAccess: "always"
                }, null, function (a) {
                    a.success || b.error("[WebSocket] swfobject.embedSWF failed")
                })
            } else b.error("[WebSocket] set WEB_SOCKET_SWF_LOCATION to location of WebSocketMain.swf")
        }, WebSocket.__onFlashInitialized = function () {
            setTimeout(function () {
                WebSocket.__flash =
                    document.getElementById("webSocketFlash");
                WebSocket.__flash.setCallerUrl(location.href);
                WebSocket.__flash.setDebug(!!window.WEB_SOCKET_DEBUG);
                for (var a = 0; a < WebSocket.__tasks.length; ++a)WebSocket.__tasks[a]();
                WebSocket.__tasks = []
            }, 0)
        }, WebSocket.__onFlashEvent = function () {
            setTimeout(function () {
                try {
                    for (var a = WebSocket.__flash.receiveEvents(), c = 0; c < a.length; ++c)WebSocket.__instances[a[c].webSocketId].__handleEvent(a[c])
                } catch (d) {
                    b.error(d)
                }
            }, 0);
            return !0
        }, WebSocket.__log = function (a) {
            b.log(decodeURIComponent(a))
        },
            WebSocket.__error = function (a) {
                b.error(decodeURIComponent(a))
            }, WebSocket.__addTask = function (a) {
            WebSocket.__flash ? a() : WebSocket.__tasks.push(a)
        }, WebSocket.__isFlashLite = function () {
            if (!window.navigator || !window.navigator.mimeTypes)return !1;
            var a = window.navigator.mimeTypes["application/x-shockwave-flash"];
            return !a || !a.enabledPlugin || !a.enabledPlugin.filename ? !1 : a.enabledPlugin.filename.match(/flashlite/i) ? !0 : !1
        }, window.WEB_SOCKET_DISABLE_AUTO_INITIALIZATION || (window.addEventListener ? window.addEventListener("load",
            function () {
                WebSocket.__initialize()
            }, !1) : window.attachEvent("onload", function () {
            WebSocket.__initialize()
        }))) : b.error("Flash Player >= 10.0.0 is required.")
    }
})();
(function (b, a, c) {
    function d(b) {
        b && (a.Transport.apply(this, arguments), this.sendBuffer = [])
    }

    function f() {
    }

    b.XHR = d;
    a.util.inherit(d, a.Transport);
    d.prototype.open = function () {
        this.socket.setBuffer(!1);
        this.onOpen();
        this.get();
        this.setCloseTimeout();
        return this
    };
    d.prototype.payload = function (b) {
        for (var c = [], d = 0, e = b.length; d < e; d++)c.push(a.parser.encodePacket(b[d]));
        this.send(a.parser.encodePayload(c))
    };
    d.prototype.send = function (a) {
        this.post(a);
        return this
    };
    d.prototype.post = function (a) {
        function b() {
            if (4 ==
                this.readyState)if (this.onreadystatechange = f, e.posting = !1, 200 == this.status)e.socket.setBuffer(!1); else e.onClose()
        }

        function d() {
            this.onload = f;
            e.socket.setBuffer(!1)
        }

        var e = this;
        this.socket.setBuffer(!0);
        this.sendXHR = this.request("POST");
        c.XDomainRequest && this.sendXHR instanceof XDomainRequest ? this.sendXHR.onload = this.sendXHR.onerror = d : this.sendXHR.onreadystatechange = b;
        this.sendXHR.send(a)
    };
    d.prototype.close = function () {
        this.onClose();
        return this
    };
    d.prototype.request = function (b) {
        var c = a.util.request(this.socket.isXDomain()),
            d = a.util.query(this.socket.options.query, "t=" + +new Date);
        c.open(b || "GET", this.prepareUrl() + d, !0);
        if ("POST" == b)try {
            c.setRequestHeader ? c.setRequestHeader("Content-type", "text/plain;charset=UTF-8") : c.contentType = "text/plain"
        } catch (e) {
        }
        return c
    };
    d.prototype.scheme = function () {
        return this.socket.options.secure ? "https" : "http"
    };
    d.check = function (b, d) {
        try {
            var f = a.util.request(d), e = c.XDomainRequest && f instanceof XDomainRequest, j = (b && b.options && b.options.secure ? "https:" : "http:") != c.location.protocol;
            if (f && (!e || !j))return !0
        } catch (h) {
        }
        return !1
    };
    d.xdomainCheck = function () {
        return d.check(null, !0)
    }
})("undefined" != typeof io ? io.Transport : module.exports, "undefined" != typeof io ? io : module.parent.exports, this);
(function (b, a) {
    function c(b) {
        a.Transport.XHR.apply(this, arguments)
    }

    b.htmlfile = c;
    a.util.inherit(c, a.Transport.XHR);
    c.prototype.name = "htmlfile";
    c.prototype.get = function () {
        this.doc = new (window[["Active"].concat("Object").join("X")])("htmlfile");
        this.doc.open();
        this.doc.write("<html></html>");
        this.doc.close();
        this.doc.parentWindow.s = this;
        var b = this.doc.createElement("div");
        b.className = "socketio";
        this.doc.body.appendChild(b);
        this.iframe = this.doc.createElement("iframe");
        b.appendChild(this.iframe);
        var c =
            this, b = a.util.query(this.socket.options.query, "t=" + +new Date);
        this.iframe.src = this.prepareUrl() + b;
        a.util.on(window, "unload", function () {
            c.destroy()
        })
    };
    c.prototype._ = function (a, b) {
        this.onData(a);
        try {
            var c = b.getElementsByTagName("script")[0];
            c.parentNode.removeChild(c)
        } catch (i) {
        }
    };
    c.prototype.destroy = function () {
        if (this.iframe) {
            try {
                this.iframe.src = "about:blank"
            } catch (a) {
            }
            this.doc = null;
            this.iframe.parentNode.removeChild(this.iframe);
            this.iframe = null;
            CollectGarbage()
        }
    };
    c.prototype.close = function () {
        this.destroy();
        return a.Transport.XHR.prototype.close.call(this)
    };
    c.check = function () {
        if ("undefined" != typeof window && ["Active"].concat("Object").join("X") in window)try {
            return new (window[["Active"].concat("Object").join("X")])("htmlfile") && a.Transport.XHR.check()
        } catch (b) {
        }
        return !1
    };
    c.xdomainCheck = function () {
        return !1
    };
    a.transports.push("htmlfile")
})("undefined" != typeof io ? io.Transport : module.exports, "undefined" != typeof io ? io : module.parent.exports);
(function (b, a, c) {
    function d() {
        a.Transport.XHR.apply(this, arguments)
    }

    function f() {
    }

    b["xhr-polling"] = d;
    a.util.inherit(d, a.Transport.XHR);
    a.util.merge(d, a.Transport.XHR);
    d.prototype.name = "xhr-polling";
    d.prototype.open = function () {
        a.Transport.XHR.prototype.open.call(this);
        return !1
    };
    d.prototype.get = function () {
        function a() {
            if (4 == this.readyState)if (this.onreadystatechange = f, 200 == this.status)e.onData(this.responseText), e.get(); else e.onClose()
        }

        function b() {
            this.onerror = this.onload = f;
            e.onData(this.responseText);
            e.get()
        }

        function d() {
            e.onClose()
        }

        if (this.open) {
            var e = this;
            this.xhr = this.request();
            c.XDomainRequest && this.xhr instanceof XDomainRequest ? (this.xhr.onload = b, this.xhr.onerror = d) : this.xhr.onreadystatechange = a;
            this.xhr.send(null)
        }
    };
    d.prototype.onClose = function () {
        a.Transport.XHR.prototype.onClose.call(this);
        if (this.xhr) {
            this.xhr.onreadystatechange = this.xhr.onload = this.xhr.onerror = f;
            try {
                this.xhr.abort()
            } catch (b) {
            }
            this.xhr = null
        }
    };
    d.prototype.ready = function (b, c) {
        var d = this;
        a.util.defer(function () {
            c.call(d)
        })
    };
    a.transports.push("xhr-polling")
})("undefined" != typeof io ? io.Transport : module.exports, "undefined" != typeof io ? io : module.parent.exports, this);
(function (b, a, c) {
    function d(b) {
        a.Transport["xhr-polling"].apply(this, arguments);
        this.index = a.j.length;
        var c = this;
        a.j.push(function (a) {
            c._(a)
        })
    }

    var f = c.document && "MozAppearance" in c.document.documentElement.style;
    b["jsonp-polling"] = d;
    a.util.inherit(d, a.Transport["xhr-polling"]);
    d.prototype.name = "jsonp-polling";
    d.prototype.post = function (b) {
        function c() {
            d();
            e.socket.setBuffer(!1)
        }

        function d() {
            e.iframe && e.form.removeChild(e.iframe);
            try {
                q = document.createElement('<iframe name="' + e.iframeId + '">')
            } catch (a) {
                q =
                    document.createElement("iframe"), q.name = e.iframeId
            }
            q.id = e.iframeId;
            e.form.appendChild(q);
            e.iframe = q
        }

        var e = this, j = a.util.query(this.socket.options.query, "t=" + +new Date + "&i=" + this.index);
        if (!this.form) {
            var h = document.createElement("form"), f = document.createElement("textarea"), t = this.iframeId = "socketio_iframe_" + this.index, q;
            h.className = "socketio";
            h.style.position = "absolute";
            h.style.top = "0px";
            h.style.left = "0px";
            h.style.display = "none";
            h.target = t;
            h.method = "POST";
            h.setAttribute("accept-charset", "utf-8");
            f.name = "d";
            h.appendChild(f);
            document.body.appendChild(h);
            this.form = h;
            this.area = f
        }
        this.form.action = this.prepareUrl() + j;
        d();
        this.area.value = a.JSON.stringify(b);
        try {
            this.form.submit()
        } catch (p) {
        }
        this.iframe.attachEvent ? q.onreadystatechange = function () {
            "complete" == e.iframe.readyState && c()
        } : this.iframe.onload = c;
        this.socket.setBuffer(!0)
    };
    d.prototype.get = function () {
        var b = this, c = document.createElement("script"), d = a.util.query(this.socket.options.query, "t=" + +new Date + "&i=" + this.index);
        this.script && (this.script.parentNode.removeChild(this.script),
            this.script = null);
        c.async = !0;
        c.src = this.prepareUrl() + d;
        c.onerror = function () {
            b.onClose()
        };
        d = document.getElementsByTagName("script")[0];
        d.parentNode.insertBefore(c, d);
        this.script = c;
        f && setTimeout(function () {
            var a = document.createElement("iframe");
            document.body.appendChild(a);
            document.body.removeChild(a)
        }, 100)
    };
    d.prototype._ = function (a) {
        this.onData(a);
        this.open && this.get();
        return this
    };
    d.prototype.ready = function (b, c) {
        var d = this;
        if (!f)return c.call(this);
        a.util.load(function () {
            c.call(d)
        })
    };
    d.check = function () {
        return "document" in
            c
    };
    d.xdomainCheck = function () {
        return !0
    };
    a.transports.push("jsonp-polling")
})("undefined" != typeof io ? io.Transport : module.exports, "undefined" != typeof io ? io : module.parent.exports, this);
var Erizo = Erizo || {};
Erizo.EventDispatcher = function (b) {
    var a = {};
    b.dispatcher = {};
    b.dispatcher.eventListeners = {};
    a.addEventListener = function (a, d) {
        void 0 === b.dispatcher.eventListeners[a] && (b.dispatcher.eventListeners[a] = []);
        b.dispatcher.eventListeners[a].push(d)
    };
    a.removeEventListener = function (a, d) {
        var f;
        f = b.dispatcher.eventListeners[a].indexOf(d);
        -1 !== f && b.dispatcher.eventListeners[a].splice(f, 1)
    };
    a.dispatchEvent = function (a) {
        var d;
        L.Logger.debug("Event: " + a.type);
        for (d in b.dispatcher.eventListeners[a.type])if (b.dispatcher.eventListeners[a.type].hasOwnProperty(d))b.dispatcher.eventListeners[a.type][d](a)
    };
    return a
};
Erizo.LicodeEvent = function (b) {
    var a = {};
    a.type = b.type;
    return a
};
Erizo.RoomEvent = function (b) {
    var a = Erizo.LicodeEvent(b);
    a.streams = b.streams;
    a.message = b.message;
    return a
};
Erizo.StreamEvent = function (b) {
    var a = Erizo.LicodeEvent(b);
    a.stream = b.stream;
    a.msg = b.msg;
    a.bandwidth = b.bandwidth;
    return a
};
Erizo.PublisherEvent = function (b) {
    return Erizo.LicodeEvent(b)
};
Erizo = Erizo || {};
Erizo.FcStack = function (b) {
    var a = {
        pc_config: {}, peerConnection: {}, desc: {}, signalCallback: void 0, close: function () {
            console.log("Close FcStack")
        }, createOffer: function () {
            console.log("FCSTACK: CreateOffer")
        }, addStream: function (a) {
            console.log("FCSTACK: addStream", a)
        }, processSignalingMessage: function (b) {
            console.log("FCSTACK: processSignaling", b);
            void 0 !== a.signalCallback && a.signalCallback(b)
        }, sendSignalingMessage: function (a) {
            console.log("FCSTACK: Sending signaling Message", a);
            b.callback(a)
        }, setSignalingCallback: function (b) {
            console.log("FCSTACK: Setting signalling callback");
            a.signalCallback = b
        }
    };
    return a
};
Erizo = Erizo || {};
Erizo.BowserStack = function (b) {
    var a = {}, c = webkitRTCPeerConnection;
    a.pc_config = {iceServers: []};
    a.con = {optional: [{DtlsSrtpKeyAgreement: !0}]};
    void 0 !== b.stunServerUrl && a.pc_config.iceServers.push({url: b.stunServerUrl});
    (b.turnServer || {}).url && a.pc_config.iceServers.push({
        username: b.turnServer.username,
        credential: b.turnServer.password,
        url: b.turnServer.url
    });
    void 0 === b.audio && (b.audio = !0);
    void 0 === b.video && (b.video = !0);
    a.mediaConstraints = {offerToReceiveVideo: b.video, offerToReceiveAudio: b.audio};
    a.peerConnection =
        new c(a.pc_config, a.con);
    b.remoteDescriptionSet = !1;
    var d = function (a) {
        if (b.maxVideoBW) {
            var c = a.match(/m=video.*\r\n/);
            c == null && (c = a.match(/m=video.*\n/));
            if (c && c.length > 0)var d = c[0] + "b=AS:" + b.maxVideoBW + "\r\n", a = a.replace(c[0], d)
        }
        if (b.maxAudioBW) {
            c = a.match(/m=audio.*\r\n/);
            c == null && (c = a.match(/m=audio.*\n/));
            if (c && c.length > 0) {
                d = c[0] + "b=AS:" + b.maxAudioBW + "\r\n";
                a = a.replace(c[0], d)
            }
        }
        return a
    };
    a.close = function () {
        a.state = "closed";
        a.peerConnection.close()
    };
    b.localCandidates = [];
    a.peerConnection.onicecandidate =
        function (e) {
            if (e.candidate) {
                if (!e.candidate.candidate.match(/a=/))e.candidate.candidate = "a=" + e.candidate.candidate;
                b.remoteDescriptionSet ? b.callback({
                    type: "candidate",
                    candidate: e.candidate
                }) : b.localCandidates.push(e.candidate)
            } else console.log("End of candidates.", a.peerConnection.localDescription)
        };
    a.peerConnection.onaddstream = function (b) {
        if (a.onaddstream)a.onaddstream(b)
    };
    a.peerConnection.onremovestream = function (b) {
        if (a.onremovestream)a.onremovestream(b)
    };
    var f = function (a) {
        console.log("Error in Stack ",
            a)
    }, g, i = function (e) {
        e.sdp = d(e.sdp);
        console.log("Set local description", e.sdp);
        g = e;
        a.peerConnection.setLocalDescription(g, function () {
            console.log("The final LocalDesc", a.peerConnection.localDescription);
            b.callback(a.peerConnection.localDescription)
        }, f)
    }, k = function (e) {
        e.sdp = d(e.sdp);
        b.callback(e);
        g = e;
        a.peerConnection.setLocalDescription(e)
    };
    a.createOffer = function (b) {
        b === true ? a.peerConnection.createOffer(i, f, a.mediaConstraints) : a.peerConnection.createOffer(i, f)
    };
    a.addStream = function (b) {
        a.peerConnection.addStream(b)
    };
    b.remoteCandidates = [];
    a.processSignalingMessage = function (e) {
        console.log("Process Signaling Message", e);
        if (e.type === "offer") {
            e.sdp = d(e.sdp);
            a.peerConnection.setRemoteDescription(new RTCSessionDescription(e));
            a.peerConnection.createAnswer(k, null, a.mediaConstraints);
            b.remoteDescriptionSet = true
        } else if (e.type === "answer") {
            console.log("Set remote description", e.sdp);
            e.sdp = d(e.sdp);
            a.peerConnection.setRemoteDescription(new RTCSessionDescription(e), function () {
                b.remoteDescriptionSet = true;
                for (console.log("Candidates to be added: ",
                    b.remoteCandidates.length); b.remoteCandidates.length > 0;) {
                    console.log("Candidate :", b.remoteCandidates[b.remoteCandidates.length - 1]);
                    a.peerConnection.addIceCandidate(b.remoteCandidates.shift(), function () {
                    }, f)
                }
                for (; b.localCandidates.length > 0;)b.callback({
                    type: "candidate",
                    candidate: b.localCandidates.shift()
                })
            }, function () {
                console.log("Error Setting Remote Description")
            })
        } else if (e.type === "candidate") {
            console.log("Message with candidate");
            try {
                var c;
                c = typeof e.candidate === "object" ? e.candidate : JSON.parse(e.candidate);
                c.candidate = c.candidate.replace(/a=/g, "");
                c.sdpMLineIndex = parseInt(c.sdpMLineIndex);
                c.sdpMLineIndex = c.sdpMid == "audio" ? 0 : 1;
                var h = new RTCIceCandidate(c);
                console.log("Remote Candidate", h);
                b.remoteDescriptionSet ? a.peerConnection.addIceCandidate(h, function () {
                }, f) : b.remoteCandidates.push(h)
            } catch (g) {
                L.Logger.error("Error parsing candidate", e.candidate)
            }
        }
    };
    return a
};
Erizo = Erizo || {};
Erizo.FirefoxStack = function (b) {
    var a = {}, c = mozRTCSessionDescription, d = mozRTCIceCandidate;
    a.pc_config = {iceServers: []};
    void 0 !== b.iceServers && (a.pc_config.iceServers = b.iceServers);
    void 0 === b.audio && (b.audio = !0);
    void 0 === b.video && (b.video = !0);
    a.mediaConstraints = {offerToReceiveAudio: b.audio, offerToReceiveVideo: b.video, mozDontOfferDataChannel: !0};
    var f = function (a) {
        L.Logger.error("Error in Stack ", a)
    }, g = !1;
    a.peerConnection = new mozRTCPeerConnection(a.pc_config, a.con);
    b.localCandidates = [];
    a.peerConnection.onicecandidate =
        function (a) {
            if (a.candidate) {
                g = true;
                if (!a.candidate.candidate.match(/a=/))a.candidate.candidate = "a=" + a.candidate.candidate;
                if (b.remoteDescriptionSet)b.callback({type: "candidate", candidate: a.candidate}); else {
                    b.localCandidates.push(a.candidate);
                    L.Logger.debug("Local Candidates stored: ", b.localCandidates.length, b.localCandidates)
                }
            } else L.Logger.debug("Gathered all candidates for this pc")
        };
    a.peerConnection.onaddstream = function (b) {
        if (a.onaddstream)a.onaddstream(b)
    };
    a.peerConnection.onremovestream = function (b) {
        if (a.onremovestream)a.onremovestream(b)
    };
    var i = function (a) {
        if (b.video && b.maxVideoBW) {
            var e = a.match(/m=video.*\r\n/);
            e == null && (e = a.match(/m=video.*\n/));
            if (e && e.length > 0)var c = e[0] + "b=AS:" + b.maxVideoBW + "\r\n", a = a.replace(e[0], c)
        }
        if (b.audio && b.maxAudioBW) {
            e = a.match(/m=audio.*\r\n/);
            e == null && (e = a.match(/m=audio.*\n/));
            if (e && e.length > 0) {
                c = e[0] + "b=AS:" + b.maxAudioBW + "\r\n";
                a = a.replace(e[0], c)
            }
        }
        return a
    }, k, e = function (a) {
        a.sdp = i(a.sdp);
        a.sdp = a.sdp.replace(/a=ice-options:google-ice\r\n/g, "");
        b.callback(a);
        k = a
    }, j = function (e) {
        e.sdp = i(e.sdp);
        e.sdp =
            e.sdp.replace(/a=ice-options:google-ice\r\n/g, "");
        b.callback(e);
        k = e;
        a.peerConnection.setLocalDescription(k)
    };
    a.updateSpec = function (a) {
        if (a.minVideoBW || a.slideShowMode !== void 0) {
            L.Logger.debug("MinVideo Changed to ", a.minVideoBW);
            L.Logger.debug("SlideShowMode Changed to ", a.slideShowMode);
            b.callback({type: "updatestream", config: a})
        }
    };
    a.createOffer = function (b) {
        b === true ? a.peerConnection.createOffer(e, f, a.mediaConstraints) : a.peerConnection.createOffer(e, f)
    };
    a.addStream = function (b) {
        a.peerConnection.addStream(b)
    };
    b.remoteCandidates = [];
    b.remoteDescriptionSet = !1;
    a.close = function () {
        a.state = "closed";
        a.peerConnection.close()
    };
    a.processSignalingMessage = function (e) {
        if (e.type === "offer") {
            e.sdp = i(e.sdp);
            a.peerConnection.setRemoteDescription(new c(e), function () {
                a.peerConnection.createAnswer(j, function (a) {
                    L.Logger.error("Error", a)
                }, a.mediaConstraints);
                b.remoteDescriptionSet = true
            }, function (a) {
                L.Logger.error("Error setting Remote Description", a)
            })
        } else if (e.type === "answer") {
            L.Logger.info("Set remote and local description");
            L.Logger.debug("Local Description to set", k.sdp);
            L.Logger.debug("Remote Description to set", e.sdp);
            e.sdp = i(e.sdp);
            a.peerConnection.setLocalDescription(k, function () {
                a.peerConnection.setRemoteDescription(new c(e), function () {
                    b.remoteDescriptionSet = true;
                    for (L.Logger.info("Remote Description successfully set"); b.remoteCandidates.length > 0 && g;) {
                        L.Logger.info("Setting stored remote candidates");
                        a.peerConnection.addIceCandidate(b.remoteCandidates.shift())
                    }
                    for (; b.localCandidates.length > 0;) {
                        L.Logger.info("Sending Candidate from list");
                        b.callback({type: "candidate", candidate: b.localCandidates.shift()})
                    }
                }, function (a) {
                    L.Logger.error("Error Setting Remote Description", a)
                })
            }, function (a) {
                L.Logger.error("Failure setting Local Description", a)
            })
        } else if (e.type === "candidate")try {
            var f;
            f = typeof e.candidate === "object" ? e.candidate : JSON.parse(e.candidate);
            f.candidate = f.candidate.replace(/ generation 0/g, "");
            f.candidate = f.candidate.replace(/ udp /g, " UDP ");
            f.sdpMLineIndex = parseInt(f.sdpMLineIndex);
            var t = new d(f);
            if (b.remoteDescriptionSet && g)for (a.peerConnection.addIceCandidate(t); b.remoteCandidates.length >
            0;) {
                L.Logger.info("Setting stored remote candidates");
                a.peerConnection.addIceCandidate(b.remoteCandidates.shift())
            } else b.remoteCandidates.push(t)
        } catch (q) {
            L.Logger.error("Error parsing candidate", e.candidate, q)
        }
    };
    return a
};
Erizo = Erizo || {};
Erizo.ChromeStableStack = function (b) {
    var a = {pc_config: {iceServers: []}, con: {optional: [{DtlsSrtpKeyAgreement: !0}]}};
    void 0 !== b.iceServers && (a.pc_config.iceServers = b.iceServers);
    void 0 === b.audio && (b.audio = !0);
    void 0 === b.video && (b.video = !0);
    a.mediaConstraints = {mandatory: {OfferToReceiveVideo: b.video, OfferToReceiveAudio: b.audio}};
    var c = function (a) {
        L.Logger.error("Error in Stack ", a)
    };
    a.peerConnection = new webkitRTCPeerConnection(a.pc_config, a.con);
    var d = function (a) {
        if (b.video && b.maxVideoBW) {
            var a = a.replace(/b=AS:.*\r\n/g,
                ""), c = a.match(/m=video.*\r\n/);
            c == null && (c = a.match(/m=video.*\n/));
            if (c && c.length > 0)var d = c[0] + "b=AS:" + b.maxVideoBW + "\r\n", a = a.replace(c[0], d)
        }
        if (b.audio && b.maxAudioBW) {
            c = a.match(/m=audio.*\r\n/);
            c == null && (c = a.match(/m=audio.*\n/));
            if (c && c.length > 0) {
                d = c[0] + "b=AS:" + b.maxAudioBW + "\r\n";
                a = a.replace(c[0], d)
            }
        }
        return a
    };
    a.close = function () {
        a.state = "closed";
        a.peerConnection.close()
    };
    b.localCandidates = [];
    a.peerConnection.onicecandidate = function (a) {
        if (a.candidate) {
            if (!a.candidate.candidate.match(/a=/))a.candidate.candidate =
                "a=" + a.candidate.candidate;
            a = {
                sdpMLineIndex: a.candidate.sdpMLineIndex,
                sdpMid: a.candidate.sdpMid,
                candidate: a.candidate.candidate
            };
            if (b.remoteDescriptionSet)b.callback({type: "candidate", candidate: a}); else {
                b.localCandidates.push(a);
                L.Logger.info("Storing candidate: ", b.localCandidates.length, a)
            }
        } else L.Logger.info("Gathered all candidates.")
    };
    a.peerConnection.onaddstream = function (b) {
        if (a.onaddstream)a.onaddstream(b)
    };
    a.peerConnection.onremovestream = function (b) {
        if (a.onremovestream)a.onremovestream(b)
    };
    a.peerConnection.oniceconnectionstatechange = function (b) {
        if (a.oniceconnectionstatechange)a.oniceconnectionstatechange(b)
    };
    var f, g, i = function (a) {
        a.sdp = d(a.sdp);
        a.sdp = a.sdp.replace(/a=ice-options:google-ice\r\n/g, "");
        b.callback({type: a.type, sdp: a.sdp});
        f = a
    }, k = function (e) {
        e.sdp = d(e.sdp);
        b.callback({type: e.type, sdp: e.sdp});
        f = e;
        a.peerConnection.setLocalDescription(e)
    };
    a.updateSpec = function (e, c) {
        if (e.maxVideoBW || e.maxAudioBW) {
            if (e.maxVideoBW) {
                L.Logger.debug("Maxvideo Requested", e.maxVideoBW, "limit", b.limitMaxVideoBW);
                if (e.maxVideoBW > b.limitMaxVideoBW)e.maxVideoBW = b.limitMaxVideoBW;
                b.maxVideoBW = e.maxVideoBW;
                L.Logger.debug("Result", b.maxVideoBW)
            }
            if (e.maxAudioBW) {
                if (e.maxAudioBW > b.limitMaxAudioBW)e.maxAudioBW = b.limitMaxAudioBW;
                b.maxAudioBW = e.maxAudioBW
            }
            f.sdp = d(f.sdp);
            a.peerConnection.setLocalDescription(f, function () {
                g.sdp = d(g.sdp);
                a.peerConnection.setRemoteDescription(new RTCSessionDescription(g), function () {
                    b.remoteDescriptionSet = true;
                    b.callback({type: "updatestream", sdp: f.sdp})
                })
            }, function (a) {
                L.Logger.error("Error updating configuration",
                    a);
                c("error")
            })
        }
        if (e.minVideoBW || e.slideShowMode !== void 0) {
            L.Logger.debug("MinVideo Changed to ", e.minVideoBW);
            L.Logger.debug("SlideShowMode Changed to ", e.slideShowMode);
            b.callback({type: "updatestream", config: e})
        }
    };
    a.createOffer = function (b) {
        b === true ? a.peerConnection.createOffer(i, c, a.mediaConstraints) : a.peerConnection.createOffer(i, c)
    };
    a.addStream = function (b) {
        a.peerConnection.addStream(b)
    };
    b.remoteCandidates = [];
    b.remoteDescriptionSet = !1;
    a.processSignalingMessage = function (e) {
        if (e.type === "offer") {
            e.sdp =
                d(e.sdp);
            a.peerConnection.setRemoteDescription(new RTCSessionDescription(e), function () {
                a.peerConnection.createAnswer(k, function (a) {
                    L.Logger.error("Error: ", a)
                }, a.mediaConstraints);
                b.remoteDescriptionSet = true
            }, function (a) {
                L.Logger.error("Error setting Remote Description", a)
            })
        } else if (e.type === "answer") {
            L.Logger.info("Set remote and local description");
            L.Logger.debug("Remote Description", e.sdp);
            L.Logger.debug("Local Description", f.sdp);
            e.sdp = d(e.sdp);
            g = e;
            a.peerConnection.setLocalDescription(f, function () {
                a.peerConnection.setRemoteDescription(new RTCSessionDescription(e),
                    function () {
                        b.remoteDescriptionSet = true;
                        for (L.Logger.info("Candidates to be added: ", b.remoteCandidates.length, b.remoteCandidates); b.remoteCandidates.length > 0;)a.peerConnection.addIceCandidate(b.remoteCandidates.shift());
                        for (L.Logger.info("Local candidates to send:", b.localCandidates.length); b.localCandidates.length > 0;)b.callback({
                            type: "candidate",
                            candidate: b.localCandidates.shift()
                        })
                    })
            })
        } else if (e.type === "candidate")try {
            var c;
            c = typeof e.candidate === "object" ? e.candidate : JSON.parse(e.candidate);
            c.candidate =
                c.candidate.replace(/a=/g, "");
            c.sdpMLineIndex = parseInt(c.sdpMLineIndex);
            var h = new RTCIceCandidate(c);
            b.remoteDescriptionSet ? a.peerConnection.addIceCandidate(h) : b.remoteCandidates.push(h)
        } catch (i) {
            L.Logger.error("Error parsing candidate", e.candidate)
        }
    };
    return a
};
Erizo = Erizo || {};
Erizo.ChromeCanaryStack = function (b) {
    var a = {}, c = webkitRTCPeerConnection;
    a.pc_config = {iceServers: []};
    a.con = {optional: [{DtlsSrtpKeyAgreement: !0}]};
    void 0 !== b.stunServerUrl && a.pc_config.iceServers.push({url: b.stunServerUrl});
    (b.turnServer || {}).url && a.pc_config.iceServers.push({
        username: b.turnServer.username,
        credential: b.turnServer.password,
        url: b.turnServer.url
    });
    if (void 0 === b.audio || b.nop2p)b.audio = !0;
    if (void 0 === b.video || b.nop2p)b.video = !0;
    a.mediaConstraints = {mandatory: {OfferToReceiveVideo: b.video, OfferToReceiveAudio: b.audio}};
    a.roapSessionId = 103;
    a.peerConnection = new c(a.pc_config, a.con);
    a.peerConnection.onicecandidate = function (c) {
        L.Logger.debug("PeerConnection: ", b.session_id);
        if (c.candidate)a.iceCandidateCount += 1; else if (L.Logger.debug("State: " + a.peerConnection.iceGatheringState), void 0 === a.ices && (a.ices = 0), a.ices += 1, 1 <= a.ices && a.moreIceComing)a.moreIceComing = !1, a.markActionNeeded()
    };
    var d = function (a) {
        if (b.maxVideoBW) {
            var c = a.match(/m=video.*\r\n/);
            if (c && 0 < c.length)var d = c[0] + "b=AS:" + b.maxVideoBW + "\r\n", a = a.replace(c[0],
                d)
        }
        if (b.maxAudioBW && (c = a.match(/m=audio.*\r\n/)) && 0 < c.length)d = c[0] + "b=AS:" + b.maxAudioBW + "\r\n", a = a.replace(c[0], d);
        return a
    };
    a.processSignalingMessage = function (b) {
        L.Logger.debug("Activity on conn " + a.sessionId);
        b = JSON.parse(b);
        a.incomingMessage = b;
        "new" === a.state ? "OFFER" === b.messageType ? (b = {
            sdp: b.sdp,
            type: "offer"
        }, a.peerConnection.setRemoteDescription(new RTCSessionDescription(b)), a.state = "offer-received", a.markActionNeeded()) : a.error("Illegal message for this state: " + b.messageType + " in state " +
            a.state) : "offer-sent" === a.state ? "ANSWER" === b.messageType ? (b = {
            sdp: b.sdp,
            type: "answer"
        }, L.Logger.debug("Received ANSWER: ", b.sdp), b.sdp = d(b.sdp), a.peerConnection.setRemoteDescription(new RTCSessionDescription(b)), a.sendOK(), a.state = "established") : "pr-answer" === b.messageType ? (b = {
            sdp: b.sdp,
            type: "pr-answer"
        }, a.peerConnection.setRemoteDescription(new RTCSessionDescription(b))) : "offer" === b.messageType ? a.error("Not written yet") : a.error("Illegal message for this state: " + b.messageType + " in state " + a.state) :
        "established" === a.state && ("OFFER" === b.messageType ? (b = {
            sdp: b.sdp,
            type: "offer"
        }, a.peerConnection.setRemoteDescription(new RTCSessionDescription(b)), a.state = "offer-received", a.markActionNeeded()) : a.error("Illegal message for this state: " + b.messageType + " in state " + a.state))
    };
    a.addStream = function (b) {
        a.peerConnection.addStream(b);
        a.markActionNeeded()
    };
    a.removeStream = function () {
        a.markActionNeeded()
    };
    a.close = function () {
        a.state = "closed";
        a.peerConnection.close()
    };
    a.markActionNeeded = function () {
        a.actionNeeded = !0;
        a.doLater(function () {
            a.onstablestate()
        })
    };
    a.doLater = function (a) {
        window.setTimeout(a, 1)
    };
    a.onstablestate = function () {
        var b;
        if (a.actionNeeded) {
            if ("new" === a.state || "established" === a.state)a.peerConnection.createOffer(function (b) {
                b.sdp = d(b.sdp);
                L.Logger.debug("Changed", b.sdp);
                b.sdp !== a.prevOffer ? (a.peerConnection.setLocalDescription(b), a.state = "preparing-offer", a.markActionNeeded()) : L.Logger.debug("Not sending a new offer")
            }, null, a.mediaConstraints); else if ("preparing-offer" === a.state) {
                if (a.moreIceComing)return;
                a.prevOffer = a.peerConnection.localDescription.sdp;
                L.Logger.debug("Sending OFFER: " + a.prevOffer);
                a.sendMessage("OFFER", a.prevOffer);
                a.state = "offer-sent"
            } else if ("offer-received" === a.state)a.peerConnection.createAnswer(function (b) {
                a.peerConnection.setLocalDescription(b);
                a.state = "offer-received-preparing-answer";
                a.iceStarted ? a.markActionNeeded() : (L.Logger.debug((new Date).getTime() + ": Starting ICE in responder"), a.iceStarted = !0)
            }, null, a.mediaConstraints); else if ("offer-received-preparing-answer" === a.state) {
                if (a.moreIceComing)return;
                b = a.peerConnection.localDescription.sdp;
                a.sendMessage("ANSWER", b);
                a.state = "established"
            } else a.error("Dazed and confused in state " + a.state + ", stopping here");
            a.actionNeeded = !1
        }
    };
    a.sendOK = function () {
        a.sendMessage("OK")
    };
    a.sendMessage = function (b, c) {
        var d = {};
        d.messageType = b;
        d.sdp = c;
        "OFFER" === b ? (d.offererSessionId = a.sessionId, d.answererSessionId = a.otherSessionId, d.seq = a.sequenceNumber += 1, d.tiebreaker = Math.floor(429496723 * Math.random() + 1)) : (d.offererSessionId = a.incomingMessage.offererSessionId, d.answererSessionId =
            a.sessionId, d.seq = a.incomingMessage.seq);
        a.onsignalingmessage(JSON.stringify(d))
    };
    a.error = function (a) {
        throw"Error in RoapOnJsep: " + a;
    };
    a.sessionId = a.roapSessionId += 1;
    a.sequenceNumber = 0;
    a.actionNeeded = !1;
    a.iceStarted = !1;
    a.moreIceComing = !0;
    a.iceCandidateCount = 0;
    a.onsignalingmessage = b.callback;
    a.peerConnection.onopen = function () {
        if (a.onopen)a.onopen()
    };
    a.peerConnection.onaddstream = function (b) {
        if (a.onaddstream)a.onaddstream(b)
    };
    a.peerConnection.onremovestream = function (b) {
        if (a.onremovestream)a.onremovestream(b)
    };
    a.peerConnection.oniceconnectionstatechange = function (b) {
        if (a.oniceconnectionstatechange)a.oniceconnectionstatechange(b.currentTarget.iceConnectionState)
    };
    a.onaddstream = null;
    a.onremovestream = null;
    a.state = "new";
    a.markActionNeeded();
    return a
};
Erizo = Erizo || {};
Erizo.sessionId = 103;
Erizo.Connection = function (b) {
    var a = {};
    b.session_id = Erizo.sessionId += 1;
    a.browser = Erizo.getBrowser();
    if ("fake" === a.browser)L.Logger.warn("Publish/subscribe video/audio streams not supported in erizofc yet"), a = Erizo.FcStack(b); else if ("mozilla" === a.browser)L.Logger.debug("Firefox Stack"), a = Erizo.FirefoxStack(b); else if ("bowser" === a.browser)L.Logger.debug("Bowser Stack"), a = Erizo.BowserStack(b); else if ("chrome-stable" === a.browser)L.Logger.debug("Chrome Stable Stack"), a = Erizo.ChromeStableStack(b); else throw L.Logger.error("No stack available for this browser"),
        "WebRTC stack not available";
    a.updateSpec || (a.updateSpec = function (a, b) {
        L.Logger.error("Update Configuration not implemented in this browser");
        b && b("unimplemented")
    });
    return a
};
Erizo.getBrowser = function () {
    var b = "none";
    "undefined" !== typeof module && module.exports ? b = "fake" : null !== window.navigator.userAgent.match("Firefox") ? b = "mozilla" : null !== window.navigator.userAgent.match("Bowser") ? b = "bowser" : null !== window.navigator.userAgent.match("Chrome") ? 26 <= window.navigator.appVersion.match(/Chrome\/([\w\W]*?)\./)[1] && (b = "chrome-stable") : null !== window.navigator.userAgent.match("Safari") ? b = "bowser" : null !== window.navigator.userAgent.match("AppleWebKit") && (b = "bowser");
    return b
};
Erizo.GetUserMedia = function (b, a, c) {
    navigator.getMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
    if (b.screen)switch (L.Logger.debug("Screen access requested"), Erizo.getBrowser()) {
        case "mozilla":
            L.Logger.debug("Screen sharing in Firefox");
            var d = {};
            void 0 != b.video.mandatory ? (d.video = b.video, d.video.mediaSource = "window") : d = {
                audio: b.audio,
                video: {mediaSource: "window"}
            };
            navigator.getMedia(d, a, c);
            break;
        case "chrome-stable":
            L.Logger.debug("Screen sharing in Chrome");
            d = "okeephmleflklcdebijnponpabbmmgeo";
            b.extensionId && (L.Logger.debug("extensionId supplied, using " + b.extensionId), d = b.extensionId);
            L.Logger.debug("Screen access on chrome stable, looking for extension");
            try {
                chrome.runtime.sendMessage(d, {getStream: !0}, function (d) {
                    var f = {};
                    if (d == void 0) {
                        L.Logger.error("Access to screen denied");
                        c({code: "Access to screen denied"})
                    } else {
                        d = d.streamId;
                        if (b.video.mandatory != void 0) {
                            f.video = b.video;
                            f.video.mandatory.chromeMediaSource = "desktop";
                            f.video.mandatory.chromeMediaSourceId =
                                d
                        } else f = {video: {mandatory: {chromeMediaSource: "desktop", chromeMediaSourceId: d}}};
                        navigator.getMedia(f, a, c)
                    }
                })
            } catch (f) {
                L.Logger.debug("Screensharing plugin is not accessible ");
                c({code: "no_plugin_present"});
                break
            }
            break;
        default:
            L.Logger.error("This browser does not support ScreenSharing")
    } else"undefined" !== typeof module && module.exports ? L.Logger.error("Video/audio streams not supported in erizofc yet") : navigator.getMedia(b, a, c)
};
Erizo = Erizo || {};
Erizo.Stream = function (b) {
    var a = Erizo.EventDispatcher(b), c;
    a.stream = b.stream;
    a.url = b.url;
    a.recording = b.recording;
    a.room = void 0;
    a.showing = !1;
    a.local = !1;
    a.video = b.video;
    a.audio = b.audio;
    a.screen = b.screen;
    a.videoSize = b.videoSize;
    a.extensionId = b.extensionId;
    if (void 0 !== a.videoSize && (!(a.videoSize instanceof Array) || 4 != a.videoSize.length))throw Error("Invalid Video Size");
    if (void 0 === b.local || !0 === b.local)a.local = !0;
    a.getID = function () {
        return b.streamID
    };
    a.getAttributes = function () {
        return b.attributes
    };
    a.setAttributes =
        function () {
            L.Logger.error("Failed to set attributes data. This Stream object has not been published.")
        };
    a.updateLocalAttributes = function (a) {
        b.attributes = a
    };
    a.hasAudio = function () {
        return b.audio
    };
    a.hasVideo = function () {
        return b.video
    };
    a.hasData = function () {
        return b.data
    };
    a.hasScreen = function () {
        return b.screen
    };
    a.sendData = function () {
        L.Logger.error("Failed to send data. This Stream object has not that channel enabled.")
    };
    a.init = function () {
        try {
            if ((b.audio || b.video || b.screen) && void 0 === b.url) {
                L.Logger.info("Requested access to local media");
                var c = b.video;
                (!0 == c || !0 == b.screen) && void 0 !== a.videoSize ? c = {
                    mandatory: {
                        minWidth: a.videoSize[0],
                        minHeight: a.videoSize[1],
                        maxWidth: a.videoSize[2],
                        maxHeight: a.videoSize[3]
                    }
                } : !0 == b.screen && void 0 === c && (c = !0);
                var f = {video: c, audio: b.audio, fake: b.fake, screen: b.screen, extensionId: a.extensionId};
                L.Logger.debug(f);
                Erizo.GetUserMedia(f, function (b) {
                    L.Logger.info("User has granted access to local media.");
                    a.stream = b;
                    b = Erizo.StreamEvent({type: "access-accepted"});
                    a.dispatchEvent(b)
                }, function (b) {
                    L.Logger.error("Failed to get access to local media. Error code was " +
                        b.code + ".");
                    b = Erizo.StreamEvent({type: "access-denied", msg: b});
                    a.dispatchEvent(b)
                })
            } else {
                var g = Erizo.StreamEvent({type: "access-accepted"});
                a.dispatchEvent(g)
            }
        } catch (i) {
            L.Logger.error("Failed to get access to local media. Error was " + i + "."), g = Erizo.StreamEvent({
                type: "access-denied",
                msg: i
            }), a.dispatchEvent(g)
        }
    };
    a.close = function () {
        a.local && (void 0 !== a.room && a.room.unpublish(a), a.hide(), void 0 !== a.stream && a.stream.getTracks().forEach(function (a) {
            a.stop()
        }), a.stream = void 0)
    };
    a.play = function (b, c) {
        c = c || {};
        a.elementID = b;
        if (a.hasVideo() || this.hasScreen()) {
            if (void 0 !== b) {
                var g = new Erizo.VideoPlayer({id: a.getID(), stream: a, elementID: b, options: c});
                a.player = g;
                a.showing = !0
            }
        } else a.hasAudio && (g = new Erizo.AudioPlayer({
            id: a.getID(),
            stream: a,
            elementID: b,
            options: c
        }), a.player = g, a.showing = !0)
    };
    a.stop = function () {
        a.showing && void 0 !== a.player && (a.player.destroy(), a.showing = !1)
    };
    a.show = a.play;
    a.hide = a.stop;
    c = function () {
        if (void 0 !== a.player && void 0 !== a.stream) {
            var b = a.player.video, c = document.defaultView.getComputedStyle(b),
                g = parseInt(c.getPropertyValue("width"), 10), i = parseInt(c.getPropertyValue("height"), 10), k = parseInt(c.getPropertyValue("left"), 10), c = parseInt(c.getPropertyValue("top"), 10), e = document.getElementById(a.elementID), j = document.defaultView.getComputedStyle(e), e = parseInt(j.getPropertyValue("width"), 10), j = parseInt(j.getPropertyValue("height"), 10), h = document.createElement("canvas");
            h.id = "testing";
            h.width = e;
            h.height = j;
            h.setAttribute("style", "display: none");
            h.getContext("2d").drawImage(b, k, c, g, i);
            return h
        }
        return null
    };
    a.getVideoFrameURL = function (a) {
        var b = c();
        return null !== b ? a ? b.toDataURL(a) : b.toDataURL() : null
    };
    a.getVideoFrame = function () {
        var a = c();
        return null !== a ? a.getContext("2d").getImageData(0, 0, a.width, a.height) : null
    };
    a.checkOptions = function (b, c) {
        if (!0 === c) {
            if (b.video || b.audio || b.screen)L.Logger.warning("Cannot update type of subscription"), b.video = void 0, b.audio = void 0, b.screen = void 0
        } else if (!1 === a.local && (!0 === b.video && !1 === a.hasVideo() && (L.Logger.warning("Trying to subscribe to video when there is no video, won't subscribe to video"),
                b.video = !1), !0 === b.audio && !1 === a.hasAudio()))L.Logger.warning("Trying to subscribe to audio when there is no audio, won't subscribe to audio"), b.audio = !1;
        !1 === a.local && !a.hasVideo() && !0 === b.slideShowMode && (L.Logger.warning("Cannot enable slideShowMode if it is not a video subscription, please check your parameters"), b.slideShowMode = !1)
    };
    a.updateConfiguration = function (b, c) {
        if (void 0 !== b)if (a.pc)a.checkOptions(b, !0), a.pc.updateSpec(b, c); else return "This stream has no peerConnection attached, ignoring"
    };
    return a
};
Erizo = Erizo || {};
Erizo.Room = function (b) {
    var a = Erizo.EventDispatcher(b), c, d, f, g, i, k;
    a.remoteStreams = {};
    a.localStreams = {};
    a.roomID = "";
    a.socket = {};
    a.state = 0;
    a.p2p = !1;
    a.addEventListener("room-disconnected", function () {
        var b, c;
        a.state = 0;
        for (b in a.remoteStreams)a.remoteStreams.hasOwnProperty(b) && (c = a.remoteStreams[b], k(c), delete a.remoteStreams[b], c = Erizo.StreamEvent({
            type: "stream-removed",
            stream: c
        }), a.dispatchEvent(c));
        a.remoteStreams = {};
        for (b in a.localStreams)a.localStreams.hasOwnProperty(b) && (c = a.localStreams[b], c.pc.close(),
            delete a.localStreams[b]);
        try {
            a.socket.disconnect()
        } catch (d) {
            L.Logger.debug("Socket already disconnected")
        }
        a.socket = void 0
    });
    k = function (a) {
        void 0 !== a.stream && (a.hide(), a.pc && a.pc.close(), a.local && a.stream.stop())
    };
    g = function (a, b) {
        a.local ? d("sendDataStream", {
            id: a.getID(),
            msg: b
        }) : L.Logger.error("You can not send data through a remote stream")
    };
    i = function (a, b) {
        a.local ? (a.updateLocalAttributes(b), d("updateStreamAttributes", {
            id: a.getID(),
            attrs: b
        })) : L.Logger.error("You can not update attributes in a remote stream")
    };
    c = function (c, j, h) {
        a.socket = io.connect(c.host, {reconnect: !1, secure: c.secure, "force new connection": !0});
        a.socket.on("onAddStream", function (b) {
            var c = Erizo.Stream({
                streamID: b.id,
                local: !1,
                audio: b.audio,
                video: b.video,
                data: b.data,
                screen: b.screen,
                attributes: b.attributes
            });
            a.remoteStreams[b.id] = c;
            b = Erizo.StreamEvent({type: "stream-added", stream: c});
            a.dispatchEvent(b)
        });
        a.socket.on("signaling_message_erizo", function (b) {
            var c;
            (c = b.peerId ? a.remoteStreams[b.peerId] : a.localStreams[b.streamId]) && c.pc.processSignalingMessage(b.mess)
        });
        a.socket.on("signaling_message_peer", function (b) {
            var c = a.localStreams[b.streamId];
            c ? c.pc[b.peerSocket].processSignalingMessage(b.msg) : (c = a.remoteStreams[b.streamId], c.pc || g(c, b.peerSocket), c.pc.processSignalingMessage(b.msg))
        });
        a.socket.on("publish_me", function (b) {
            var c = a.localStreams[b.streamId];
            void 0 === c.pc && (c.pc = {});
            c.pc[b.peerSocket] = Erizo.Connection({
                callback: function (a) {
                    f("signaling_message", {streamId: b.streamId, peerSocket: b.peerSocket, msg: a})
                }, audio: c.hasAudio(), video: c.hasVideo(), iceServers: a.iceServers
            });
            c.pc[b.peerSocket].oniceconnectionstatechange = function (a) {
                if (a === "disconnected") {
                    c.pc[b.peerSocket].close();
                    delete c.pc[b.peerSocket]
                }
            };
            c.pc[b.peerSocket].addStream(c.stream);
            c.pc[b.peerSocket].createOffer()
        });
        var g = function (c, e) {
            c.pc = Erizo.Connection({
                callback: function (a) {
                    f("signaling_message", {streamId: c.getID(), peerSocket: e, msg: a})
                },
                iceServers: a.iceServers,
                maxAudioBW: b.maxAudioBW,
                maxVideoBW: b.maxVideoBW,
                limitMaxAudioBW: b.maxAudioBW,
                limitMaxVideoBW: b.maxVideoBW
            });
            c.pc.onaddstream = function (b) {
                L.Logger.info("Stream subscribed");
                c.stream = b.stream;
                b = Erizo.StreamEvent({type: "stream-subscribed", stream: c});
                a.dispatchEvent(b)
            }
        };
        a.socket.on("onBandwidthAlert", function (b) {
            L.Logger.info("Bandwidth Alert on", b.streamID, "message", b.message, "BW:", b.bandwidth);
            if (b.streamID) {
                var c = a.remoteStreams[b.streamID];
                c && (b = Erizo.StreamEvent({
                    type: "bandwidth-alert",
                    stream: c,
                    msg: b.message,
                    bandwidth: b.bandwidth
                }), c.dispatchEvent(b))
            }
        });
        a.socket.on("onDataStream", function (b) {
            var c = a.remoteStreams[b.id], b = Erizo.StreamEvent({
                type: "stream-data", msg: b.msg,
                stream: c
            });
            c.dispatchEvent(b)
        });
        a.socket.on("onUpdateAttributeStream", function (b) {
            var c = a.remoteStreams[b.id], e = Erizo.StreamEvent({
                type: "stream-attributes-update",
                attrs: b.attrs,
                stream: c
            });
            c.updateLocalAttributes(b.attrs);
            c.dispatchEvent(e)
        });
        a.socket.on("onRemoveStream", function (b) {
            var c = a.remoteStreams[b.id];
            delete a.remoteStreams[b.id];
            k(c);
            b = Erizo.StreamEvent({type: "stream-removed", stream: c});
            a.dispatchEvent(b)
        });
        a.socket.on("disconnect", function () {
            L.Logger.info("Socket disconnected, lost connection to ErizoController");
            if (0 !== a.state) {
                L.Logger.error("Unexpected disconnection from ErizoController");
                var b = Erizo.RoomEvent({type: "room-disconnected", message: "unexpected-disconnection"});
                a.dispatchEvent(b)
            }
        });
        a.socket.on("connection_failed", function (b) {
            "publish" === b.type ? (L.Logger.error("ICE Connection Failed on publishing, disconnecting"), 0 !== a.state && (b = Erizo.RoomEvent({
                type: "stream-failed",
                message: "Publishing local stream failed ICE Checks, disconnecting client"
            }), a.dispatchEvent(b))) : (L.Logger.error("ICE Connection Failed on subscribe, alerting"),
            0 !== a.state && (b = Erizo.RoomEvent({
                type: "stream-failed",
                message: "Subscriber failed the ICE Checks, cannot reach Licode for media"
            }), a.dispatchEvent(b)))
        });
        a.socket.on("error", function (a) {
            h("Cannot connect to ErizoController (socket.io error)", a)
        });
        d("token", c, j, h)
    };
    d = function (b, c, d, f) {
        a.socket.emit(b, c, function (a, b) {
            "success" === a ? void 0 !== d && d(b) : "error" === a ? void 0 !== f && f(b) : void 0 !== d && d(a, b)
        })
    };
    f = function (b, c, d, f) {
        a.socket.emit(b, c, d, function (a, b) {
            void 0 !== f && f(a, b)
        })
    };
    a.connect = function () {
        var e =
            L.Base64.decodeBase64(b.token);
        0 !== a.state && L.Logger.warn("Room already connected");
        a.state = 1;
        c(JSON.parse(e), function (c) {
            var e = 0, d = [], f, g, i;
            f = c.streams || [];
            a.p2p = c.p2p;
            g = c.id;
            a.iceServers = c.iceServers;
            a.state = 2;
            b.defaultVideoBW = c.defaultVideoBW;
            b.maxVideoBW = c.maxVideoBW;
            for (e in f)f.hasOwnProperty(e) && (i = f[e], c = Erizo.Stream({
                streamID: i.id,
                local: !1,
                audio: i.audio,
                video: i.video,
                data: i.data,
                screen: i.screen,
                attributes: i.attributes
            }), d.push(c), a.remoteStreams[i.id] = c);
            a.roomID = g;
            L.Logger.info("Connected to room " +
                a.roomID);
            e = Erizo.RoomEvent({type: "room-connected", streams: d});
            a.dispatchEvent(e)
        }, function (b) {
            L.Logger.error("Not Connected! Error: " + b);
            b = Erizo.RoomEvent({type: "room-error", message: b});
            a.dispatchEvent(b)
        })
    };
    a.disconnect = function () {
        L.Logger.debug("Disconnection requested");
        var b = Erizo.RoomEvent({type: "room-disconnected", message: "expected-disconnection"});
        a.dispatchEvent(b)
    };
    a.publish = function (c, d, h) {
        d = d || {};
        d.maxVideoBW = d.maxVideoBW || b.defaultVideoBW;
        d.maxVideoBW > b.maxVideoBW && (d.maxVideoBW = b.maxVideoBW);
        void 0 === d.minVideoBW && (d.minVideoBW = 0);
        d.minVideoBW > b.defaultVideoBW && (d.minVideoBW = b.defaultVideoBW);
        if (c.local && void 0 === a.localStreams[c.getID()])if (c.hasAudio() || c.hasVideo() || c.hasScreen())if (void 0 !== c.url || void 0 !== c.recording) {
            var k, t;
            c.url ? (k = "url", t = c.url) : (k = "recording", t = c.recording);
            L.Logger.info("Checking publish options for", c.getID());
            c.checkOptions(d);
            f("publish", {
                    state: k,
                    data: c.hasData(),
                    audio: c.hasAudio(),
                    video: c.hasVideo(),
                    attributes: c.getAttributes(),
                    createOffer: d.createOffer
                },
                t, function (b, d) {
                    if (b !== null) {
                        L.Logger.info("Stream published");
                        c.getID = function () {
                            return b
                        };
                        c.sendData = function (a) {
                            g(c, a)
                        };
                        c.setAttributes = function (a) {
                            i(c, a)
                        };
                        a.localStreams[b] = c;
                        c.room = a;
                        h && h(b)
                    } else {
                        L.Logger.error("Error when publishing stream", d);
                        h && h(void 0, d)
                    }
                })
        } else a.p2p ? (b.maxAudioBW = d.maxAudioBW, b.maxVideoBW = d.maxVideoBW, f("publish", {
            state: "p2p",
            data: c.hasData(),
            audio: c.hasAudio(),
            video: c.hasVideo(),
            screen: c.hasScreen(),
            attributes: c.getAttributes()
        }, void 0, function (b, d) {
            if (b === null) {
                L.Logger.error("Error when publishing the stream",
                    d);
                h && h(void 0, d)
            }
            L.Logger.info("Stream published");
            c.getID = function () {
                return b
            };
            if (c.hasData())c.sendData = function (a) {
                g(c, a)
            };
            c.setAttributes = function (a) {
                i(c, a)
            };
            a.localStreams[b] = c;
            c.room = a
        })) : (L.Logger.info("Publishing to Erizo Normally, is createOffer", d.createOffer), f("publish", {
            state: "erizo",
            data: c.hasData(),
            audio: c.hasAudio(),
            video: c.hasVideo(),
            screen: c.hasScreen(),
            minVideoBW: d.minVideoBW,
            attributes: c.getAttributes(),
            createOffer: d.createOffer
        }, void 0, function (k, o) {
            if (k === null) {
                L.Logger.error("Error when publishing the stream: ",
                    o);
                h && h(void 0, o)
            } else {
                L.Logger.info("Stream assigned an Id, starting the publish process");
                c.getID = function () {
                    return k
                };
                if (c.hasData())c.sendData = function (a) {
                    g(c, a)
                };
                c.setAttributes = function (a) {
                    i(c, a)
                };
                a.localStreams[k] = c;
                c.room = a;
                c.pc = Erizo.Connection({
                    callback: function (a) {
                        L.Logger.debug("Sending message", a);
                        f("signaling_message", {streamId: c.getID(), msg: a}, void 0, function () {
                        })
                    },
                    iceServers: a.iceServers,
                    maxAudioBW: d.maxAudioBW,
                    maxVideoBW: d.maxVideoBW,
                    limitMaxAudioBW: b.maxAudioBW,
                    limitMaxVideoBW: b.maxVideoBW,
                    audio: c.hasAudio(),
                    video: c.hasVideo()
                });
                c.pc.addStream(c.stream);
                d.createOffer || c.pc.createOffer();
                h && h(k)
            }
        })); else c.hasData() && f("publish", {
            state: "data",
            data: c.hasData(),
            audio: !1,
            video: !1,
            screen: !1,
            attributes: c.getAttributes()
        }, void 0, function (b, d) {
            if (b === null) {
                L.Logger.error("Error publishing stream ", d);
                h && h(void 0, d)
            } else {
                L.Logger.info("Stream published");
                c.getID = function () {
                    return b
                };
                c.sendData = function (a) {
                    g(c, a)
                };
                c.setAttributes = function (a) {
                    i(c, a)
                };
                a.localStreams[b] = c;
                c.room = a;
                h && h(b)
            }
        })
    };
    a.startRecording =
        function (a, b) {
            L.Logger.debug("Start Recording stream: " + a.getID());
            d("startRecorder", {to: a.getID()}, function (a, c) {
                null === a ? (L.Logger.error("Error on start recording", c), b && b(void 0, c)) : (L.Logger.info("Start recording", a), b && b(a))
            })
        };
    a.stopRecording = function (a, b) {
        d("stopRecorder", {id: a}, function (c, d) {
            null === c ? (L.Logger.error("Error on stop recording", d), b && b(void 0, d)) : (L.Logger.info("Stop recording", a), b && b(!0))
        })
    };
    a.unpublish = function (b, c) {
        if (b.local) {
            d("unpublish", b.getID(), function (a, b) {
                null ===
                a ? (L.Logger.error("Error unpublishing stream", b), c && c(void 0, b)) : (L.Logger.info("Stream unpublished"), c && c(!0))
            });
            var h = b.room.p2p;
            b.room = void 0;
            if ((b.hasAudio() || b.hasVideo() || b.hasScreen()) && void 0 === b.url && !h)b.pc.close(), b.pc = void 0;
            delete a.localStreams[b.getID()];
            b.getID = function () {
            };
            b.sendData = function () {
            };
            b.setAttributes = function () {
            }
        } else L.Logger.error("Cannot unpublish, stream does not exist or is not local"), c && c(void 0, error)
    };
    a.subscribe = function (b, c, d) {
        c = c || {};
        if (!b.local) {
            if (b.hasVideo() ||
                b.hasAudio() || b.hasScreen())a.p2p ? (f("subscribe", {streamId: b.getID()}), d && d(!0)) : (L.Logger.info("Checking subscribe options for", b.getID()), b.checkOptions(c), f("subscribe", {
                streamId: b.getID(),
                audio: c.audio,
                video: c.video,
                data: c.data,
                browser: Erizo.getBrowser(),
                createOffer: c.createOffer,
                slideShowMode: c.slideShowMode
            }, void 0, function (g, i) {
                null === g ? (L.Logger.error("Error subscribing to stream ", i), d && d(void 0, i)) : (L.Logger.info("Subscriber added"), b.pc = Erizo.Connection({
                    callback: function (a) {
                        L.Logger.info("Sending message",
                            a);
                        f("signaling_message", {
                            streamId: b.getID(),
                            msg: a,
                            browser: b.pc.browser
                        }, void 0, function () {
                        })
                    }, nop2p: !0, audio: c.audio, video: c.video, iceServers: a.iceServers
                }), b.pc.onaddstream = function (c) {
                    L.Logger.info("Stream subscribed");
                    b.stream = c.stream;
                    c = Erizo.StreamEvent({type: "stream-subscribed", stream: b});
                    a.dispatchEvent(c)
                }, b.pc.createOffer(!0), d && d(!0))
            })); else if (b.hasData() && !1 !== c.data)f("subscribe", {
                streamId: b.getID(),
                data: c.data
            }, void 0, function (c, j) {
                if (null === c)L.Logger.error("Error subscribing to stream ",
                    j), d && d(void 0, j); else {
                    L.Logger.info("Stream subscribed");
                    var f = Erizo.StreamEvent({type: "stream-subscribed", stream: b});
                    a.dispatchEvent(f);
                    d && d(!0)
                }
            }); else {
                L.Logger.info("Subscribing to anything");
                return
            }
            L.Logger.info("Subscribing to: " + b.getID())
        }
    };
    a.unsubscribe = function (b, c) {
        void 0 !== a.socket && (b.local || d("unsubscribe", b.getID(), function (a, d) {
            null === a ? c && c(void 0, d) : (k(b), c && c(!0))
        }, function () {
            L.Logger.error("Error calling unsubscribe.")
        }))
    };
    a.getStreamsByAttribute = function (b, c) {
        var d = [], f, g;
        for (f in a.remoteStreams)a.remoteStreams.hasOwnProperty(f) &&
        (g = a.remoteStreams[f], void 0 !== g.getAttributes() && void 0 !== g.getAttributes()[b] && g.getAttributes()[b] === c && d.push(g));
        return d
    };
    return a
};
var L = L || {};
L.Logger = function (b) {
    return {
        DEBUG: 0, TRACE: 1, INFO: 2, WARNING: 3, ERROR: 4, NONE: 5, enableLogPanel: function () {
            b.Logger.panel = document.createElement("textarea");
            b.Logger.panel.setAttribute("id", "licode-logs");
            b.Logger.panel.setAttribute("style", "width: 100%; height: 100%; display: none");
            b.Logger.panel.setAttribute("rows", 20);
            b.Logger.panel.setAttribute("cols", 20);
            b.Logger.panel.setAttribute("readOnly", !0);
            document.body.appendChild(b.Logger.panel)
        }, setLogLevel: function (a) {
            a > b.Logger.NONE ? a = b.Logger.NONE : a <
            b.Logger.DEBUG && (a = b.Logger.DEBUG);
            b.Logger.logLevel = a
        }, log: function (a) {
            var c = "";
            if (!(a < b.Logger.logLevel)) {
                a === b.Logger.DEBUG ? c += "DEBUG" : a === b.Logger.TRACE ? c += "TRACE" : a === b.Logger.INFO ? c += "INFO" : a === b.Logger.WARNING ? c += "WARNING" : a === b.Logger.ERROR && (c += "ERROR");
                for (var c = c + ": ", d = [], f = 0; f < arguments.length; f++)d[f] = arguments[f];
                d = d.slice(1);
                d = [c].concat(d);
                if (void 0 !== b.Logger.panel) {
                    c = "";
                    for (f = 0; f < d.length; f++)c += d[f];
                    b.Logger.panel.value = b.Logger.panel.value + "\n" + c
                } else console.log.apply(console,
                    d)
            }
        }, debug: function () {
            for (var a = [], c = 0; c < arguments.length; c++)a[c] = arguments[c];
            b.Logger.log.apply(b.Logger, [b.Logger.DEBUG].concat(a))
        }, trace: function () {
            for (var a = [], c = 0; c < arguments.length; c++)a[c] = arguments[c];
            b.Logger.log.apply(b.Logger, [b.Logger.TRACE].concat(a))
        }, info: function () {
            for (var a = [], c = 0; c < arguments.length; c++)a[c] = arguments[c];
            b.Logger.log.apply(b.Logger, [b.Logger.INFO].concat(a))
        }, warning: function () {
            for (var a = [], c = 0; c < arguments.length; c++)a[c] = arguments[c];
            b.Logger.log.apply(b.Logger,
                [b.Logger.WARNING].concat(a))
        }, error: function () {
            for (var a = [], c = 0; c < arguments.length; c++)a[c] = arguments[c];
            b.Logger.log.apply(b.Logger, [b.Logger.ERROR].concat(a))
        }
    }
}(L);
L = L || {};
L.Base64 = function () {
    var b, a, c, d, f, g, i, k, e;
    b = "A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z,a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,0,1,2,3,4,5,6,7,8,9,+,/".split(",");
    a = [];
    for (f = 0; f < b.length; f += 1)a[b[f]] = f;
    g = function (a) {
        c = a;
        d = 0
    };
    i = function () {
        var a;
        if (!c || d >= c.length)return -1;
        a = c.charCodeAt(d) & 255;
        d += 1;
        return a
    };
    k = function () {
        if (!c)return -1;
        for (; ;) {
            if (d >= c.length)return -1;
            var b = c.charAt(d);
            d += 1;
            if (a[b])return a[b];
            if ("A" === b)return 0
        }
    };
    e = function (a) {
        a = a.toString(16);
        1 === a.length && (a =
            "0" + a);
        return unescape("%" + a)
    };
    return {
        encodeBase64: function (a) {
            var c, e, d;
            g(a);
            a = "";
            c = Array(3);
            e = 0;
            for (d = !1; !d && -1 !== (c[0] = i());)if (c[1] = i(), c[2] = i(), a += b[c[0] >> 2], -1 !== c[1] ? (a += b[c[0] << 4 & 48 | c[1] >> 4], -1 !== c[2] ? (a += b[c[1] << 2 & 60 | c[2] >> 6], a += b[c[2] & 63]) : (a += b[c[1] << 2 & 60], a += "=", d = !0)) : (a += b[c[0] << 4 & 48], a += "=", a += "=", d = !0), e += 4, 76 <= e)a += "\n", e = 0;
            return a
        }, decodeBase64: function (a) {
            var b, c;
            g(a);
            a = "";
            b = Array(4);
            for (c = !1; !c && -1 !== (b[0] = k()) && -1 !== (b[1] = k());)b[2] = k(), b[3] = k(), a += e(b[0] << 2 & 255 | b[1] >> 4), -1 !==
            b[2] ? (a += e(b[1] << 4 & 255 | b[2] >> 2), -1 !== b[3] ? a += e(b[2] << 6 & 255 | b[3]) : c = !0) : c = !0;
            return a
        }
    }
}(L);
(function () {
    function b() {
        (new L.ElementQueries).init()
    }

    this.L = this.L || {};
    this.L.ElementQueries = function () {
        function a(a) {
            a || (a = document.documentElement);
            a = getComputedStyle(a, "fontSize");
            return parseFloat(a) || 16
        }

        function b(c, d) {
            var f = d.replace(/[0-9]*/, ""), d = parseFloat(d);
            switch (f) {
                case "px":
                    return d;
                case "em":
                    return d * a(c);
                case "rem":
                    return d * a();
                case "vw":
                    return d * document.documentElement.clientWidth / 100;
                case "vh":
                    return d * document.documentElement.clientHeight / 100;
                case "vmin":
                case "vmax":
                    return d *
                        (0, Math["vmin" === f ? "min" : "max"])(document.documentElement.clientWidth / 100, document.documentElement.clientHeight / 100);
                default:
                    return d
            }
        }

        function d(a) {
            this.element = a;
            this.options = [];
            var d, f, g, i = 0, k = 0, p, u, v, w, n;
            this.addOption = function (a) {
                this.options.push(a)
            };
            var s = ["min-width", "min-height", "max-width", "max-height"];
            this.call = function () {
                i = this.element.offsetWidth;
                k = this.element.offsetHeight;
                v = {};
                d = 0;
                for (f = this.options.length; d < f; d++)g = this.options[d], p = b(this.element, g.value), u = "width" == g.property ? i :
                    k, n = g.mode + "-" + g.property, w = "", "min" == g.mode && u >= p && (w += g.value), "max" == g.mode && u <= p && (w += g.value), v[n] || (v[n] = ""), w && -1 === (" " + v[n] + " ").indexOf(" " + w + " ") && (v[n] += " " + w);
                for (var a in s)v[s[a]] ? this.element.setAttribute(s[a], v[s[a]].substr(1)) : this.element.removeAttribute(s[a])
            }
        }

        function f(a, b) {
            a.elementQueriesSetupInformation ? a.elementQueriesSetupInformation.addOption(b) : (a.elementQueriesSetupInformation = new d(a), a.elementQueriesSetupInformation.addOption(b), new ResizeSensor(a, function () {
                a.elementQueriesSetupInformation.call()
            }));
            a.elementQueriesSetupInformation.call()
        }

        function g(a) {
            for (var b, a = a.replace(/'/g, '"'); null !== (b = k.exec(a));)if (5 < b.length) {
                var c = b[1] || b[5], d = b[2], g = b[3];
                b = b[4];
                var i = void 0;
                document.querySelectorAll && (i = document.querySelectorAll.bind(document));
                !i && "undefined" !== typeof $$ && (i = $$);
                !i && "undefined" !== typeof jQuery && (i = jQuery);
                if (!i)throw"No document.querySelectorAll, jQuery or Mootools's $$ found.";
                for (var c = i(c), i = 0, p = c.length; i < p; i++)f(c[i], {mode: d, property: g, value: b})
            }
        }

        function i(a) {
            var b = "";
            if (a)if ("string" === typeof a)a = a.toLowerCase(), (-1 !== a.indexOf("min-width") || -1 !== a.indexOf("max-width")) && g(a); else for (var c = 0, d = a.length; c < d; c++)1 === a[c].type ? (b = a[c].selectorText || a[c].cssText, -1 !== b.indexOf("min-height") || -1 !== b.indexOf("max-height") ? g(b) : (-1 !== b.indexOf("min-width") || -1 !== b.indexOf("max-width")) && g(b)) : 4 === a[c].type && i(a[c].cssRules || a[c].rules)
        }

        var k = /,?([^,\n]*)\[[\s\t]*(min|max)-(width|height)[\s\t]*[~$\^]?=[\s\t]*"([^"]*)"[\s\t]*]([^\n\s\{]*)/mgi;
        this.init = function () {
            for (var a = 0, b = document.styleSheets.length; a <
            b; a++)i(document.styleSheets[a].cssText || document.styleSheets[a].cssRules || document.styleSheets[a].rules)
        }
    };
    window.addEventListener ? window.addEventListener("load", b, !1) : window.attachEvent("onload", b);
    this.L.ResizeSensor = function (a, b) {
        function d(a, b) {
            window.OverflowEvent ? a.addEventListener("overflowchanged", function (a) {
                b.call(this, a)
            }) : (a.addEventListener("overflow", function (a) {
                b.call(this, a)
            }), a.addEventListener("underflow", function (a) {
                b.call(this, a)
            }))
        }

        function f() {
            this.q = [];
            this.add = function (a) {
                this.q.push(a)
            };
            var a, b;
            this.call = function () {
                a = 0;
                for (b = this.q.length; a < b; a++)this.q[a].call()
            }
        }

        function g(a, b) {
            function c() {
                var b = !1, d = a.resizeSensor.offsetWidth, f = a.resizeSensor.offsetHeight;
                i != d && (p.width = d - 1 + "px", u.width = d + 1 + "px", b = !0, i = d);
                k != f && (p.height = f - 1 + "px", u.height = f + 1 + "px", b = !0, k = f);
                return b
            }

            if (a.resizedAttached) {
                if (a.resizedAttached) {
                    a.resizedAttached.add(b);
                    return
                }
            } else a.resizedAttached = new f, a.resizedAttached.add(b);
            var g = function () {
                c() && a.resizedAttached.call()
            };
            a.resizeSensor = document.createElement("div");
            a.resizeSensor.className = "resize-sensor";
            a.resizeSensor.style.cssText = "position: absolute; left: 0; top: 0; right: 0; bottom: 0; overflow: hidden; z-index: -1;";
            a.resizeSensor.innerHTML = '<div class="resize-sensor-overflow" style="position: absolute; left: 0; top: 0; right: 0; bottom: 0; overflow: hidden; z-index: -1;"><div></div></div><div class="resize-sensor-underflow" style="position: absolute; left: 0; top: 0; right: 0; bottom: 0; overflow: hidden; z-index: -1;"><div></div></div>';
            a.appendChild(a.resizeSensor);
            if ("absolute" !== (a.currentStyle ? a.currentStyle.position : window.getComputedStyle ? window.getComputedStyle(a, null).getPropertyValue("position") : a.style.position))a.style.position = "relative";
            var i = -1, k = -1, p = a.resizeSensor.firstElementChild.firstChild.style, u = a.resizeSensor.lastElementChild.firstChild.style;
            c();
            d(a.resizeSensor, g);
            d(a.resizeSensor.firstElementChild, g);
            d(a.resizeSensor.lastElementChild, g)
        }

        if ("array" === typeof a || "undefined" !== typeof jQuery && a instanceof jQuery || "undefined" !== typeof Elements &&
            a instanceof Elements)for (var i = 0, k = a.length; i < k; i++)g(a[i], b); else g(a, b)
    }
})();
Erizo = Erizo || {};
Erizo.View = function () {
    var b = Erizo.EventDispatcher({});
    b.url = "http://chotis2.dit.upm.es:3000";
    return b
};
Erizo = Erizo || {};
Erizo.VideoPlayer = function (b) {
    var a = Erizo.View({});
    a.id = b.id;
    a.stream = b.stream.stream;
    a.elementID = b.elementID;
    a.destroy = function () {
        a.video.pause();
        delete a.resizer;
        a.parentNode.removeChild(a.div)
    };
    a.resize = function () {
        var c = a.container.offsetWidth, d = a.container.offsetHeight;
        if (b.stream.screen || !1 === b.options.crop)0.5625 * c < d ? (a.video.style.width = c + "px", a.video.style.height = 0.5625 * c + "px", a.video.style.top = -(0.5625 * c / 2 - d / 2) + "px", a.video.style.left = "0px") : (a.video.style.height = d + "px", a.video.style.width = 16 /
            9 * d + "px", a.video.style.left = -(16 / 9 * d / 2 - c / 2) + "px", a.video.style.top = "0px"); else if (c !== a.containerWidth || d !== a.containerHeight)0.75 * c > d ? (a.video.style.width = c + "px", a.video.style.height = 0.75 * c + "px", a.video.style.top = -(0.75 * c / 2 - d / 2) + "px", a.video.style.left = "0px") : (a.video.style.height = d + "px", a.video.style.width = 4 / 3 * d + "px", a.video.style.left = -(4 / 3 * d / 2 - c / 2) + "px", a.video.style.top = "0px");
        a.containerWidth = c;
        a.containerHeight = d
    };
    L.Logger.debug("Creating URL from stream " + a.stream);
    a.stream_url = (window.URL ||
    webkitURL).createObjectURL(a.stream);
    a.div = document.createElement("div");
    a.div.setAttribute("id", "player_" + a.id);
    a.div.setAttribute("style", "width: 100%; height: 100%; position: relative; background-color: black; overflow: hidden;");
    a.loader = document.createElement("img");
    a.loader.setAttribute("style", "width: 16px; height: 16px; position: absolute; top: 50%; left: 50%; margin-top: -8px; margin-left: -8px");
    a.loader.setAttribute("id", "back_" + a.id);
    a.loader.setAttribute("src", a.url + "/assets/loader.gif");
    a.video = document.createElement("video");
    a.video.setAttribute("id", "stream" + a.id);
    a.video.setAttribute("style", "width: 100%; height: 100%; position: absolute");
    a.video.setAttribute("autoplay", "autoplay");
    b.stream.local && (a.video.volume = 0);
    void 0 !== a.elementID ? (document.getElementById(a.elementID).appendChild(a.div), a.container = document.getElementById(a.elementID)) : (document.body.appendChild(a.div), a.container = document.body);
    a.parentNode = a.div.parentNode;
    a.div.appendChild(a.loader);
    a.div.appendChild(a.video);
    a.containerWidth = 0;
    a.containerHeight = 0;
    a.resizer = new L.ResizeSensor(a.container, a.resize);
    a.resize();
    a.bar = new Erizo.Bar({
        elementID: "player_" + a.id,
        id: a.id,
        stream: b.stream,
        media: a.video,
        options: b.options
    });
    a.div.onmouseover = function () {
        a.bar.display()
    };
    a.div.onmouseout = function () {
        a.bar.hide()
    };
    a.video.src = a.stream_url;
    return a
};
Erizo = Erizo || {};
Erizo.AudioPlayer = function (b) {
    var a = Erizo.View({}), c, d;
    a.id = b.id;
    a.stream = b.stream.stream;
    a.elementID = b.elementID;
    L.Logger.debug("Creating URL from stream " + a.stream);
    a.stream_url = (window.URL || webkitURL).createObjectURL(a.stream);
    a.audio = document.createElement("audio");
    a.audio.setAttribute("id", "stream" + a.id);
    a.audio.setAttribute("style", "width: 100%; height: 100%; position: absolute");
    a.audio.setAttribute("autoplay", "autoplay");
    b.stream.local && (a.audio.volume = 0);
    b.stream.local && (a.audio.volume = 0);
    void 0 !== a.elementID ? (a.destroy = function () {
        a.audio.pause();
        a.parentNode.removeChild(a.div)
    }, c = function () {
        a.bar.display()
    }, d = function () {
        a.bar.hide()
    }, a.div = document.createElement("div"), a.div.setAttribute("id", "player_" + a.id), a.div.setAttribute("style", "width: 100%; height: 100%; position: relative; overflow: hidden;"), document.getElementById(a.elementID).appendChild(a.div), a.container = document.getElementById(a.elementID), a.parentNode = a.div.parentNode, a.div.appendChild(a.audio), a.bar = new Erizo.Bar({
        elementID: "player_" +
        a.id, id: a.id, stream: b.stream, media: a.audio, options: b.options
    }), a.div.onmouseover = c, a.div.onmouseout = d) : (a.destroy = function () {
        a.audio.pause();
        a.parentNode.removeChild(a.audio)
    }, document.body.appendChild(a.audio), a.parentNode = document.body);
    a.audio.src = a.stream_url;
    return a
};
Erizo = Erizo || {};
Erizo.Bar = function (b) {
    var a = Erizo.View({}), c, d;
    a.elementID = b.elementID;
    a.id = b.id;
    a.div = document.createElement("div");
    a.div.setAttribute("id", "bar_" + a.id);
    a.bar = document.createElement("div");
    a.bar.setAttribute("style", "width: 100%; height: 15%; max-height: 30px; position: absolute; bottom: 0; right: 0; background-color: rgba(255,255,255,0.62)");
    a.bar.setAttribute("id", "subbar_" + a.id);
    a.link = document.createElement("a");
    a.link.setAttribute("href", "http://www.lynckia.com/");
    a.link.setAttribute("target", "_blank");
    a.logo = document.createElement("img");
    a.logo.setAttribute("style", "width: 100%; height: 100%; max-width: 30px; position: absolute; top: 0; left: 2px;");
    a.logo.setAttribute("alt", "Lynckia");
    a.logo.setAttribute("src", a.url + "/assets/star.svg");
    d = function (b) {
        "block" !== b ? b = "none" : clearTimeout(c);
        a.div.setAttribute("style", "width: 100%; height: 100%; position: relative; bottom: 0; right: 0; display:" + b)
    };
    a.display = function () {
        d("block")
    };
    a.hide = function () {
        c = setTimeout(d, 1E3)
    };
    document.getElementById(a.elementID).appendChild(a.div);
    a.div.appendChild(a.bar);
    a.bar.appendChild(a.link);
    a.link.appendChild(a.logo);
    if (!b.stream.screen && (void 0 === b.options || void 0 === b.options.speaker || !0 === b.options.speaker))a.speaker = new Erizo.Speaker({
        elementID: "subbar_" + a.id,
        id: a.id,
        stream: b.stream,
        media: b.media
    });
    a.display();
    a.hide();
    return a
};
Erizo = Erizo || {};
Erizo.Speaker = function (b) {
    var a = Erizo.View({}), c, d, f, g = 50;
    a.elementID = b.elementID;
    a.media = b.media;
    a.id = b.id;
    a.stream = b.stream;
    a.div = document.createElement("div");
    a.div.setAttribute("style", "width: 40%; height: 100%; max-width: 32px; position: absolute; right: 0;z-index:0;");
    a.icon = document.createElement("img");
    a.icon.setAttribute("id", "volume_" + a.id);
    a.icon.setAttribute("src", a.url + "/assets/sound48.png");
    a.icon.setAttribute("style", "width: 80%; height: 100%; position: absolute;");
    a.div.appendChild(a.icon);
    a.stream.local ? (d = function () {
        a.media.muted = !0;
        a.icon.setAttribute("src", a.url + "/assets/mute48.png");
        a.stream.stream.getAudioTracks()[0].enabled = !1
    }, f = function () {
        a.media.muted = !1;
        a.icon.setAttribute("src", a.url + "/assets/sound48.png");
        a.stream.stream.getAudioTracks()[0].enabled = !0
    }, a.icon.onclick = function () {
        a.media.muted ? f() : d()
    }) : (a.picker = document.createElement("input"), a.picker.setAttribute("id", "picker_" + a.id), a.picker.type = "range", a.picker.min = 0, a.picker.max = 100, a.picker.step = 10, a.picker.value =
        g, a.picker.setAttribute("orient", "vertical"), a.div.appendChild(a.picker), a.media.volume = a.picker.value / 100, a.media.muted = !1, a.picker.oninput = function () {
        0 < a.picker.value ? (a.media.muted = !1, a.icon.setAttribute("src", a.url + "/assets/sound48.png")) : (a.media.muted = !0, a.icon.setAttribute("src", a.url + "/assets/mute48.png"));
        a.media.volume = a.picker.value / 100
    }, c = function (b) {
        a.picker.setAttribute("style", "background: transparent; width: 32px; height: 100px; position: absolute; bottom: 90%; z-index: 1;" + a.div.offsetHeight +
            "px; right: 0px; -webkit-appearance: slider-vertical; display: " + b)
    }, d = function () {
        a.icon.setAttribute("src", a.url + "/assets/mute48.png");
        g = a.picker.value;
        a.picker.value = 0;
        a.media.volume = 0;
        a.media.muted = !0
    }, f = function () {
        a.icon.setAttribute("src", a.url + "/assets/sound48.png");
        a.picker.value = g;
        a.media.volume = a.picker.value / 100;
        a.media.muted = !1
    }, a.icon.onclick = function () {
        a.media.muted ? f() : d()
    }, a.div.onmouseover = function () {
        c("block")
    }, a.div.onmouseout = function () {
        c("none")
    }, c("none"));
    document.getElementById(a.elementID).appendChild(a.div);
    return a
};
