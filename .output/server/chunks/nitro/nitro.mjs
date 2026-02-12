import process from 'node:process';globalThis._importMeta_=globalThis._importMeta_||{url:"file:///_entry.js",env:process.env};import http, { Server as Server$1 } from 'node:http';
import https, { Server } from 'node:https';
import { EventEmitter } from 'node:events';
import { Buffer as Buffer$1 } from 'node:buffer';
import { promises, existsSync } from 'node:fs';
import { resolve as resolve$1, dirname as dirname$1, join } from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'module';

const suspectProtoRx = /"(?:_|\\u0{2}5[Ff]){2}(?:p|\\u0{2}70)(?:r|\\u0{2}72)(?:o|\\u0{2}6[Ff])(?:t|\\u0{2}74)(?:o|\\u0{2}6[Ff])(?:_|\\u0{2}5[Ff]){2}"\s*:/;
const suspectConstructorRx = /"(?:c|\\u0063)(?:o|\\u006[Ff])(?:n|\\u006[Ee])(?:s|\\u0073)(?:t|\\u0074)(?:r|\\u0072)(?:u|\\u0075)(?:c|\\u0063)(?:t|\\u0074)(?:o|\\u006[Ff])(?:r|\\u0072)"\s*:/;
const JsonSigRx = /^\s*["[{]|^\s*-?\d{1,16}(\.\d{1,17})?([Ee][+-]?\d+)?\s*$/;
function jsonParseTransform(key, value) {
  if (key === "__proto__" || key === "constructor" && value && typeof value === "object" && "prototype" in value) {
    warnKeyDropped(key);
    return;
  }
  return value;
}
function warnKeyDropped(key) {
  console.warn(`[destr] Dropping "${key}" key to prevent prototype pollution.`);
}
function destr(value, options = {}) {
  if (typeof value !== "string") {
    return value;
  }
  if (value[0] === '"' && value[value.length - 1] === '"' && value.indexOf("\\") === -1) {
    return value.slice(1, -1);
  }
  const _value = value.trim();
  if (_value.length <= 9) {
    switch (_value.toLowerCase()) {
      case "true": {
        return true;
      }
      case "false": {
        return false;
      }
      case "undefined": {
        return void 0;
      }
      case "null": {
        return null;
      }
      case "nan": {
        return Number.NaN;
      }
      case "infinity": {
        return Number.POSITIVE_INFINITY;
      }
      case "-infinity": {
        return Number.NEGATIVE_INFINITY;
      }
    }
  }
  if (!JsonSigRx.test(value)) {
    if (options.strict) {
      throw new SyntaxError("[destr] Invalid JSON");
    }
    return value;
  }
  try {
    if (suspectProtoRx.test(value) || suspectConstructorRx.test(value)) {
      if (options.strict) {
        throw new Error("[destr] Possible prototype pollution");
      }
      return JSON.parse(value, jsonParseTransform);
    }
    return JSON.parse(value);
  } catch (error) {
    if (options.strict) {
      throw error;
    }
    return value;
  }
}

const HASH_RE = /#/g;
const AMPERSAND_RE = /&/g;
const SLASH_RE = /\//g;
const EQUAL_RE = /=/g;
const PLUS_RE = /\+/g;
const ENC_CARET_RE = /%5e/gi;
const ENC_BACKTICK_RE = /%60/gi;
const ENC_PIPE_RE = /%7c/gi;
const ENC_SPACE_RE = /%20/gi;
const ENC_SLASH_RE = /%2f/gi;
function encode(text) {
  return encodeURI("" + text).replace(ENC_PIPE_RE, "|");
}
function encodeQueryValue(input) {
  return encode(typeof input === "string" ? input : JSON.stringify(input)).replace(PLUS_RE, "%2B").replace(ENC_SPACE_RE, "+").replace(HASH_RE, "%23").replace(AMPERSAND_RE, "%26").replace(ENC_BACKTICK_RE, "`").replace(ENC_CARET_RE, "^").replace(SLASH_RE, "%2F");
}
function encodeQueryKey(text) {
  return encodeQueryValue(text).replace(EQUAL_RE, "%3D");
}
function decode$1(text = "") {
  try {
    return decodeURIComponent("" + text);
  } catch {
    return "" + text;
  }
}
function decodePath(text) {
  return decode$1(text.replace(ENC_SLASH_RE, "%252F"));
}
function decodeQueryKey(text) {
  return decode$1(text.replace(PLUS_RE, " "));
}
function decodeQueryValue(text) {
  return decode$1(text.replace(PLUS_RE, " "));
}

function parseQuery(parametersString = "") {
  const object = /* @__PURE__ */ Object.create(null);
  if (parametersString[0] === "?") {
    parametersString = parametersString.slice(1);
  }
  for (const parameter of parametersString.split("&")) {
    const s = parameter.match(/([^=]+)=?(.*)/) || [];
    if (s.length < 2) {
      continue;
    }
    const key = decodeQueryKey(s[1]);
    if (key === "__proto__" || key === "constructor") {
      continue;
    }
    const value = decodeQueryValue(s[2] || "");
    if (object[key] === void 0) {
      object[key] = value;
    } else if (Array.isArray(object[key])) {
      object[key].push(value);
    } else {
      object[key] = [object[key], value];
    }
  }
  return object;
}
function encodeQueryItem(key, value) {
  if (typeof value === "number" || typeof value === "boolean") {
    value = String(value);
  }
  if (!value) {
    return encodeQueryKey(key);
  }
  if (Array.isArray(value)) {
    return value.map(
      (_value) => `${encodeQueryKey(key)}=${encodeQueryValue(_value)}`
    ).join("&");
  }
  return `${encodeQueryKey(key)}=${encodeQueryValue(value)}`;
}
function stringifyQuery(query) {
  return Object.keys(query).filter((k) => query[k] !== void 0).map((k) => encodeQueryItem(k, query[k])).filter(Boolean).join("&");
}

const PROTOCOL_STRICT_REGEX = /^[\s\w\0+.-]{2,}:([/\\]{1,2})/;
const PROTOCOL_REGEX = /^[\s\w\0+.-]{2,}:([/\\]{2})?/;
const PROTOCOL_RELATIVE_REGEX = /^([/\\]\s*){2,}[^/\\]/;
const PROTOCOL_SCRIPT_RE = /^[\s\0]*(blob|data|javascript|vbscript):$/i;
const TRAILING_SLASH_RE = /\/$|\/\?|\/#/;
const JOIN_LEADING_SLASH_RE = /^\.?\//;
function hasProtocol(inputString, opts = {}) {
  if (typeof opts === "boolean") {
    opts = { acceptRelative: opts };
  }
  if (opts.strict) {
    return PROTOCOL_STRICT_REGEX.test(inputString);
  }
  return PROTOCOL_REGEX.test(inputString) || (opts.acceptRelative ? PROTOCOL_RELATIVE_REGEX.test(inputString) : false);
}
function isScriptProtocol(protocol) {
  return !!protocol && PROTOCOL_SCRIPT_RE.test(protocol);
}
function hasTrailingSlash(input = "", respectQueryAndFragment) {
  if (!respectQueryAndFragment) {
    return input.endsWith("/");
  }
  return TRAILING_SLASH_RE.test(input);
}
function withoutTrailingSlash(input = "", respectQueryAndFragment) {
  if (!respectQueryAndFragment) {
    return (hasTrailingSlash(input) ? input.slice(0, -1) : input) || "/";
  }
  if (!hasTrailingSlash(input, true)) {
    return input || "/";
  }
  let path = input;
  let fragment = "";
  const fragmentIndex = input.indexOf("#");
  if (fragmentIndex !== -1) {
    path = input.slice(0, fragmentIndex);
    fragment = input.slice(fragmentIndex);
  }
  const [s0, ...s] = path.split("?");
  const cleanPath = s0.endsWith("/") ? s0.slice(0, -1) : s0;
  return (cleanPath || "/") + (s.length > 0 ? `?${s.join("?")}` : "") + fragment;
}
function withTrailingSlash(input = "", respectQueryAndFragment) {
  if (!respectQueryAndFragment) {
    return input.endsWith("/") ? input : input + "/";
  }
  if (hasTrailingSlash(input, true)) {
    return input || "/";
  }
  let path = input;
  let fragment = "";
  const fragmentIndex = input.indexOf("#");
  if (fragmentIndex !== -1) {
    path = input.slice(0, fragmentIndex);
    fragment = input.slice(fragmentIndex);
    if (!path) {
      return fragment;
    }
  }
  const [s0, ...s] = path.split("?");
  return s0 + "/" + (s.length > 0 ? `?${s.join("?")}` : "") + fragment;
}
function hasLeadingSlash(input = "") {
  return input.startsWith("/");
}
function withLeadingSlash(input = "") {
  return hasLeadingSlash(input) ? input : "/" + input;
}
function withBase(input, base) {
  if (isEmptyURL(base) || hasProtocol(input)) {
    return input;
  }
  const _base = withoutTrailingSlash(base);
  if (input.startsWith(_base)) {
    const nextChar = input[_base.length];
    if (!nextChar || nextChar === "/" || nextChar === "?") {
      return input;
    }
  }
  return joinURL(_base, input);
}
function withoutBase(input, base) {
  if (isEmptyURL(base)) {
    return input;
  }
  const _base = withoutTrailingSlash(base);
  if (!input.startsWith(_base)) {
    return input;
  }
  const nextChar = input[_base.length];
  if (nextChar && nextChar !== "/" && nextChar !== "?") {
    return input;
  }
  const trimmed = input.slice(_base.length);
  return trimmed[0] === "/" ? trimmed : "/" + trimmed;
}
function withQuery(input, query) {
  const parsed = parseURL(input);
  const mergedQuery = { ...parseQuery(parsed.search), ...query };
  parsed.search = stringifyQuery(mergedQuery);
  return stringifyParsedURL(parsed);
}
function getQuery$1(input) {
  return parseQuery(parseURL(input).search);
}
function isEmptyURL(url) {
  return !url || url === "/";
}
function isNonEmptyURL(url) {
  return url && url !== "/";
}
function joinURL(base, ...input) {
  let url = base || "";
  for (const segment of input.filter((url2) => isNonEmptyURL(url2))) {
    if (url) {
      const _segment = segment.replace(JOIN_LEADING_SLASH_RE, "");
      url = withTrailingSlash(url) + _segment;
    } else {
      url = segment;
    }
  }
  return url;
}
function joinRelativeURL(..._input) {
  const JOIN_SEGMENT_SPLIT_RE = /\/(?!\/)/;
  const input = _input.filter(Boolean);
  const segments = [];
  let segmentsDepth = 0;
  for (const i of input) {
    if (!i || i === "/") {
      continue;
    }
    for (const [sindex, s] of i.split(JOIN_SEGMENT_SPLIT_RE).entries()) {
      if (!s || s === ".") {
        continue;
      }
      if (s === "..") {
        if (segments.length === 1 && hasProtocol(segments[0])) {
          continue;
        }
        segments.pop();
        segmentsDepth--;
        continue;
      }
      if (sindex === 1 && segments[segments.length - 1]?.endsWith(":/")) {
        segments[segments.length - 1] += "/" + s;
        continue;
      }
      segments.push(s);
      segmentsDepth++;
    }
  }
  let url = segments.join("/");
  if (segmentsDepth >= 0) {
    if (input[0]?.startsWith("/") && !url.startsWith("/")) {
      url = "/" + url;
    } else if (input[0]?.startsWith("./") && !url.startsWith("./")) {
      url = "./" + url;
    }
  } else {
    url = "../".repeat(-1 * segmentsDepth) + url;
  }
  if (input[input.length - 1]?.endsWith("/") && !url.endsWith("/")) {
    url += "/";
  }
  return url;
}

const protocolRelative = Symbol.for("ufo:protocolRelative");
function parseURL(input = "", defaultProto) {
  const _specialProtoMatch = input.match(
    /^[\s\0]*(blob:|data:|javascript:|vbscript:)(.*)/i
  );
  if (_specialProtoMatch) {
    const [, _proto, _pathname = ""] = _specialProtoMatch;
    return {
      protocol: _proto.toLowerCase(),
      pathname: _pathname,
      href: _proto + _pathname,
      auth: "",
      host: "",
      search: "",
      hash: ""
    };
  }
  if (!hasProtocol(input, { acceptRelative: true })) {
    return parsePath(input);
  }
  const [, protocol = "", auth, hostAndPath = ""] = input.replace(/\\/g, "/").match(/^[\s\0]*([\w+.-]{2,}:)?\/\/([^/@]+@)?(.*)/) || [];
  let [, host = "", path = ""] = hostAndPath.match(/([^#/?]*)(.*)?/) || [];
  if (protocol === "file:") {
    path = path.replace(/\/(?=[A-Za-z]:)/, "");
  }
  const { pathname, search, hash } = parsePath(path);
  return {
    protocol: protocol.toLowerCase(),
    auth: auth ? auth.slice(0, Math.max(0, auth.length - 1)) : "",
    host,
    pathname,
    search,
    hash,
    [protocolRelative]: !protocol
  };
}
function parsePath(input = "") {
  const [pathname = "", search = "", hash = ""] = (input.match(/([^#?]*)(\?[^#]*)?(#.*)?/) || []).splice(1);
  return {
    pathname,
    search,
    hash
  };
}
function stringifyParsedURL(parsed) {
  const pathname = parsed.pathname || "";
  const search = parsed.search ? (parsed.search.startsWith("?") ? "" : "?") + parsed.search : "";
  const hash = parsed.hash || "";
  const auth = parsed.auth ? parsed.auth + "@" : "";
  const host = parsed.host || "";
  const proto = parsed.protocol || parsed[protocolRelative] ? (parsed.protocol || "") + "//" : "";
  return proto + auth + host + pathname + search + hash;
}

function parse(str, options) {
  if (typeof str !== "string") {
    throw new TypeError("argument str must be a string");
  }
  const obj = {};
  const opt = {};
  const dec = opt.decode || decode;
  let index = 0;
  while (index < str.length) {
    const eqIdx = str.indexOf("=", index);
    if (eqIdx === -1) {
      break;
    }
    let endIdx = str.indexOf(";", index);
    if (endIdx === -1) {
      endIdx = str.length;
    } else if (endIdx < eqIdx) {
      index = str.lastIndexOf(";", eqIdx - 1) + 1;
      continue;
    }
    const key = str.slice(index, eqIdx).trim();
    if (opt?.filter && !opt?.filter(key)) {
      index = endIdx + 1;
      continue;
    }
    if (void 0 === obj[key]) {
      let val = str.slice(eqIdx + 1, endIdx).trim();
      if (val.codePointAt(0) === 34) {
        val = val.slice(1, -1);
      }
      obj[key] = tryDecode(val, dec);
    }
    index = endIdx + 1;
  }
  return obj;
}
function decode(str) {
  return str.includes("%") ? decodeURIComponent(str) : str;
}
function tryDecode(str, decode2) {
  try {
    return decode2(str);
  } catch {
    return str;
  }
}

const fieldContentRegExp = /^[\u0009\u0020-\u007E\u0080-\u00FF]+$/;
function serialize$2(name, value, options) {
  const opt = options || {};
  const enc = opt.encode || encodeURIComponent;
  if (typeof enc !== "function") {
    throw new TypeError("option encode is invalid");
  }
  if (!fieldContentRegExp.test(name)) {
    throw new TypeError("argument name is invalid");
  }
  const encodedValue = enc(value);
  if (encodedValue && !fieldContentRegExp.test(encodedValue)) {
    throw new TypeError("argument val is invalid");
  }
  let str = name + "=" + encodedValue;
  if (void 0 !== opt.maxAge && opt.maxAge !== null) {
    const maxAge = opt.maxAge - 0;
    if (Number.isNaN(maxAge) || !Number.isFinite(maxAge)) {
      throw new TypeError("option maxAge is invalid");
    }
    str += "; Max-Age=" + Math.floor(maxAge);
  }
  if (opt.domain) {
    if (!fieldContentRegExp.test(opt.domain)) {
      throw new TypeError("option domain is invalid");
    }
    str += "; Domain=" + opt.domain;
  }
  if (opt.path) {
    if (!fieldContentRegExp.test(opt.path)) {
      throw new TypeError("option path is invalid");
    }
    str += "; Path=" + opt.path;
  }
  if (opt.expires) {
    if (!isDate(opt.expires) || Number.isNaN(opt.expires.valueOf())) {
      throw new TypeError("option expires is invalid");
    }
    str += "; Expires=" + opt.expires.toUTCString();
  }
  if (opt.httpOnly) {
    str += "; HttpOnly";
  }
  if (opt.secure) {
    str += "; Secure";
  }
  if (opt.priority) {
    const priority = typeof opt.priority === "string" ? opt.priority.toLowerCase() : opt.priority;
    switch (priority) {
      case "low": {
        str += "; Priority=Low";
        break;
      }
      case "medium": {
        str += "; Priority=Medium";
        break;
      }
      case "high": {
        str += "; Priority=High";
        break;
      }
      default: {
        throw new TypeError("option priority is invalid");
      }
    }
  }
  if (opt.sameSite) {
    const sameSite = typeof opt.sameSite === "string" ? opt.sameSite.toLowerCase() : opt.sameSite;
    switch (sameSite) {
      case true: {
        str += "; SameSite=Strict";
        break;
      }
      case "lax": {
        str += "; SameSite=Lax";
        break;
      }
      case "strict": {
        str += "; SameSite=Strict";
        break;
      }
      case "none": {
        str += "; SameSite=None";
        break;
      }
      default: {
        throw new TypeError("option sameSite is invalid");
      }
    }
  }
  if (opt.partitioned) {
    str += "; Partitioned";
  }
  return str;
}
function isDate(val) {
  return Object.prototype.toString.call(val) === "[object Date]" || val instanceof Date;
}

function parseSetCookie(setCookieValue, options) {
  const parts = (setCookieValue || "").split(";").filter((str) => typeof str === "string" && !!str.trim());
  const nameValuePairStr = parts.shift() || "";
  const parsed = _parseNameValuePair(nameValuePairStr);
  const name = parsed.name;
  let value = parsed.value;
  try {
    value = options?.decode === false ? value : (options?.decode || decodeURIComponent)(value);
  } catch {
  }
  const cookie = {
    name,
    value
  };
  for (const part of parts) {
    const sides = part.split("=");
    const partKey = (sides.shift() || "").trimStart().toLowerCase();
    const partValue = sides.join("=");
    switch (partKey) {
      case "expires": {
        cookie.expires = new Date(partValue);
        break;
      }
      case "max-age": {
        cookie.maxAge = Number.parseInt(partValue, 10);
        break;
      }
      case "secure": {
        cookie.secure = true;
        break;
      }
      case "httponly": {
        cookie.httpOnly = true;
        break;
      }
      case "samesite": {
        cookie.sameSite = partValue;
        break;
      }
      default: {
        cookie[partKey] = partValue;
      }
    }
  }
  return cookie;
}
function _parseNameValuePair(nameValuePairStr) {
  let name = "";
  let value = "";
  const nameValueArr = nameValuePairStr.split("=");
  if (nameValueArr.length > 1) {
    name = nameValueArr.shift();
    value = nameValueArr.join("=");
  } else {
    value = nameValuePairStr;
  }
  return { name, value };
}

const NODE_TYPES = {
  NORMAL: 0,
  WILDCARD: 1,
  PLACEHOLDER: 2
};

function createRouter$1(options = {}) {
  const ctx = {
    options,
    rootNode: createRadixNode(),
    staticRoutesMap: {}
  };
  const normalizeTrailingSlash = (p) => options.strictTrailingSlash ? p : p.replace(/\/$/, "") || "/";
  if (options.routes) {
    for (const path in options.routes) {
      insert(ctx, normalizeTrailingSlash(path), options.routes[path]);
    }
  }
  return {
    ctx,
    lookup: (path) => lookup(ctx, normalizeTrailingSlash(path)),
    insert: (path, data) => insert(ctx, normalizeTrailingSlash(path), data),
    remove: (path) => remove(ctx, normalizeTrailingSlash(path))
  };
}
function lookup(ctx, path) {
  const staticPathNode = ctx.staticRoutesMap[path];
  if (staticPathNode) {
    return staticPathNode.data;
  }
  const sections = path.split("/");
  const params = {};
  let paramsFound = false;
  let wildcardNode = null;
  let node = ctx.rootNode;
  let wildCardParam = null;
  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];
    if (node.wildcardChildNode !== null) {
      wildcardNode = node.wildcardChildNode;
      wildCardParam = sections.slice(i).join("/");
    }
    const nextNode = node.children.get(section);
    if (nextNode === void 0) {
      if (node && node.placeholderChildren.length > 1) {
        const remaining = sections.length - i;
        node = node.placeholderChildren.find((c) => c.maxDepth === remaining) || null;
      } else {
        node = node.placeholderChildren[0] || null;
      }
      if (!node) {
        break;
      }
      if (node.paramName) {
        params[node.paramName] = section;
      }
      paramsFound = true;
    } else {
      node = nextNode;
    }
  }
  if ((node === null || node.data === null) && wildcardNode !== null) {
    node = wildcardNode;
    params[node.paramName || "_"] = wildCardParam;
    paramsFound = true;
  }
  if (!node) {
    return null;
  }
  if (paramsFound) {
    return {
      ...node.data,
      params: paramsFound ? params : void 0
    };
  }
  return node.data;
}
function insert(ctx, path, data) {
  let isStaticRoute = true;
  const sections = path.split("/");
  let node = ctx.rootNode;
  let _unnamedPlaceholderCtr = 0;
  const matchedNodes = [node];
  for (const section of sections) {
    let childNode;
    if (childNode = node.children.get(section)) {
      node = childNode;
    } else {
      const type = getNodeType(section);
      childNode = createRadixNode({ type, parent: node });
      node.children.set(section, childNode);
      if (type === NODE_TYPES.PLACEHOLDER) {
        childNode.paramName = section === "*" ? `_${_unnamedPlaceholderCtr++}` : section.slice(1);
        node.placeholderChildren.push(childNode);
        isStaticRoute = false;
      } else if (type === NODE_TYPES.WILDCARD) {
        node.wildcardChildNode = childNode;
        childNode.paramName = section.slice(
          3
          /* "**:" */
        ) || "_";
        isStaticRoute = false;
      }
      matchedNodes.push(childNode);
      node = childNode;
    }
  }
  for (const [depth, node2] of matchedNodes.entries()) {
    node2.maxDepth = Math.max(matchedNodes.length - depth, node2.maxDepth || 0);
  }
  node.data = data;
  if (isStaticRoute === true) {
    ctx.staticRoutesMap[path] = node;
  }
  return node;
}
function remove(ctx, path) {
  let success = false;
  const sections = path.split("/");
  let node = ctx.rootNode;
  for (const section of sections) {
    node = node.children.get(section);
    if (!node) {
      return success;
    }
  }
  if (node.data) {
    const lastSection = sections.at(-1) || "";
    node.data = null;
    if (Object.keys(node.children).length === 0 && node.parent) {
      node.parent.children.delete(lastSection);
      node.parent.wildcardChildNode = null;
      node.parent.placeholderChildren = [];
    }
    success = true;
  }
  return success;
}
function createRadixNode(options = {}) {
  return {
    type: options.type || NODE_TYPES.NORMAL,
    maxDepth: 0,
    parent: options.parent || null,
    children: /* @__PURE__ */ new Map(),
    data: options.data || null,
    paramName: options.paramName || null,
    wildcardChildNode: null,
    placeholderChildren: []
  };
}
function getNodeType(str) {
  if (str.startsWith("**")) {
    return NODE_TYPES.WILDCARD;
  }
  if (str[0] === ":" || str === "*") {
    return NODE_TYPES.PLACEHOLDER;
  }
  return NODE_TYPES.NORMAL;
}

function toRouteMatcher(router) {
  const table = _routerNodeToTable("", router.ctx.rootNode);
  return _createMatcher(table, router.ctx.options.strictTrailingSlash);
}
function _createMatcher(table, strictTrailingSlash) {
  return {
    ctx: { table },
    matchAll: (path) => _matchRoutes(path, table, strictTrailingSlash)
  };
}
function _createRouteTable() {
  return {
    static: /* @__PURE__ */ new Map(),
    wildcard: /* @__PURE__ */ new Map(),
    dynamic: /* @__PURE__ */ new Map()
  };
}
function _matchRoutes(path, table, strictTrailingSlash) {
  if (strictTrailingSlash !== true && path.endsWith("/")) {
    path = path.slice(0, -1) || "/";
  }
  const matches = [];
  for (const [key, value] of _sortRoutesMap(table.wildcard)) {
    if (path === key || path.startsWith(key + "/")) {
      matches.push(value);
    }
  }
  for (const [key, value] of _sortRoutesMap(table.dynamic)) {
    if (path.startsWith(key + "/")) {
      const subPath = "/" + path.slice(key.length).split("/").splice(2).join("/");
      matches.push(..._matchRoutes(subPath, value));
    }
  }
  const staticMatch = table.static.get(path);
  if (staticMatch) {
    matches.push(staticMatch);
  }
  return matches.filter(Boolean);
}
function _sortRoutesMap(m) {
  return [...m.entries()].sort((a, b) => a[0].length - b[0].length);
}
function _routerNodeToTable(initialPath, initialNode) {
  const table = _createRouteTable();
  function _addNode(path, node) {
    if (path) {
      if (node.type === NODE_TYPES.NORMAL && !(path.includes("*") || path.includes(":"))) {
        if (node.data) {
          table.static.set(path, node.data);
        }
      } else if (node.type === NODE_TYPES.WILDCARD) {
        table.wildcard.set(path.replace("/**", ""), node.data);
      } else if (node.type === NODE_TYPES.PLACEHOLDER) {
        const subTable = _routerNodeToTable("", node);
        if (node.data) {
          subTable.static.set("/", node.data);
        }
        table.dynamic.set(path.replace(/\/\*|\/:\w+/, ""), subTable);
        return;
      }
    }
    for (const [childPath, child] of node.children.entries()) {
      _addNode(`${path}/${childPath}`.replace("//", "/"), child);
    }
  }
  _addNode(initialPath, initialNode);
  return table;
}

function isPlainObject(value) {
  if (value === null || typeof value !== "object") {
    return false;
  }
  const prototype = Object.getPrototypeOf(value);
  if (prototype !== null && prototype !== Object.prototype && Object.getPrototypeOf(prototype) !== null) {
    return false;
  }
  if (Symbol.iterator in value) {
    return false;
  }
  if (Symbol.toStringTag in value) {
    return Object.prototype.toString.call(value) === "[object Module]";
  }
  return true;
}

function _defu(baseObject, defaults, namespace = ".", merger) {
  if (!isPlainObject(defaults)) {
    return _defu(baseObject, {}, namespace, merger);
  }
  const object = Object.assign({}, defaults);
  for (const key in baseObject) {
    if (key === "__proto__" || key === "constructor") {
      continue;
    }
    const value = baseObject[key];
    if (value === null || value === void 0) {
      continue;
    }
    if (merger && merger(object, key, value, namespace)) {
      continue;
    }
    if (Array.isArray(value) && Array.isArray(object[key])) {
      object[key] = [...value, ...object[key]];
    } else if (isPlainObject(value) && isPlainObject(object[key])) {
      object[key] = _defu(
        value,
        object[key],
        (namespace ? `${namespace}.` : "") + key.toString(),
        merger
      );
    } else {
      object[key] = value;
    }
  }
  return object;
}
function createDefu(merger) {
  return (...arguments_) => (
    // eslint-disable-next-line unicorn/no-array-reduce
    arguments_.reduce((p, c) => _defu(p, c, "", merger), {})
  );
}
const defu = createDefu();
const defuFn = createDefu((object, key, currentValue) => {
  if (object[key] !== void 0 && typeof currentValue === "function") {
    object[key] = currentValue(object[key]);
    return true;
  }
});

function o(n){throw new Error(`${n} is not implemented yet!`)}let i$1 = class i extends EventEmitter{__unenv__={};readableEncoding=null;readableEnded=true;readableFlowing=false;readableHighWaterMark=0;readableLength=0;readableObjectMode=false;readableAborted=false;readableDidRead=false;closed=false;errored=null;readable=false;destroyed=false;static from(e,t){return new i(t)}constructor(e){super();}_read(e){}read(e){}setEncoding(e){return this}pause(){return this}resume(){return this}isPaused(){return  true}unpipe(e){return this}unshift(e,t){}wrap(e){return this}push(e,t){return  false}_destroy(e,t){this.removeAllListeners();}destroy(e){return this.destroyed=true,this._destroy(e),this}pipe(e,t){return {}}compose(e,t){throw new Error("Method not implemented.")}[Symbol.asyncDispose](){return this.destroy(),Promise.resolve()}async*[Symbol.asyncIterator](){throw o("Readable.asyncIterator")}iterator(e){throw o("Readable.iterator")}map(e,t){throw o("Readable.map")}filter(e,t){throw o("Readable.filter")}forEach(e,t){throw o("Readable.forEach")}reduce(e,t,r){throw o("Readable.reduce")}find(e,t){throw o("Readable.find")}findIndex(e,t){throw o("Readable.findIndex")}some(e,t){throw o("Readable.some")}toArray(e){throw o("Readable.toArray")}every(e,t){throw o("Readable.every")}flatMap(e,t){throw o("Readable.flatMap")}drop(e,t){throw o("Readable.drop")}take(e,t){throw o("Readable.take")}asIndexedPairs(e){throw o("Readable.asIndexedPairs")}};let l$1 = class l extends EventEmitter{__unenv__={};writable=true;writableEnded=false;writableFinished=false;writableHighWaterMark=0;writableLength=0;writableObjectMode=false;writableCorked=0;closed=false;errored=null;writableNeedDrain=false;writableAborted=false;destroyed=false;_data;_encoding="utf8";constructor(e){super();}pipe(e,t){return {}}_write(e,t,r){if(this.writableEnded){r&&r();return}if(this._data===void 0)this._data=e;else {const s=typeof this._data=="string"?Buffer$1.from(this._data,this._encoding||t||"utf8"):this._data,a=typeof e=="string"?Buffer$1.from(e,t||this._encoding||"utf8"):e;this._data=Buffer$1.concat([s,a]);}this._encoding=t,r&&r();}_writev(e,t){}_destroy(e,t){}_final(e){}write(e,t,r){const s=typeof t=="string"?this._encoding:"utf8",a=typeof t=="function"?t:typeof r=="function"?r:void 0;return this._write(e,s,a),true}setDefaultEncoding(e){return this}end(e,t,r){const s=typeof e=="function"?e:typeof t=="function"?t:typeof r=="function"?r:void 0;if(this.writableEnded)return s&&s(),this;const a=e===s?void 0:e;if(a){const u=t===s?void 0:t;this.write(a,u,s);}return this.writableEnded=true,this.writableFinished=true,this.emit("close"),this.emit("finish"),this}cork(){}uncork(){}destroy(e){return this.destroyed=true,delete this._data,this.removeAllListeners(),this}compose(e,t){throw new Error("Method not implemented.")}[Symbol.asyncDispose](){return Promise.resolve()}};const c$1=class c{allowHalfOpen=true;_destroy;constructor(e=new i$1,t=new l$1){Object.assign(this,e),Object.assign(this,t),this._destroy=m(e._destroy,t._destroy);}};function _(){return Object.assign(c$1.prototype,i$1.prototype),Object.assign(c$1.prototype,l$1.prototype),c$1}function m(...n){return function(...e){for(const t of n)t(...e);}}const g=_();class A extends g{__unenv__={};bufferSize=0;bytesRead=0;bytesWritten=0;connecting=false;destroyed=false;pending=false;localAddress="";localPort=0;remoteAddress="";remoteFamily="";remotePort=0;autoSelectFamilyAttemptedAddresses=[];readyState="readOnly";constructor(e){super();}write(e,t,r){return  false}connect(e,t,r){return this}end(e,t,r){return this}setEncoding(e){return this}pause(){return this}resume(){return this}setTimeout(e,t){return this}setNoDelay(e){return this}setKeepAlive(e,t){return this}address(){return {}}unref(){return this}ref(){return this}destroySoon(){this.destroy();}resetAndDestroy(){const e=new Error("ERR_SOCKET_CLOSED");return e.code="ERR_SOCKET_CLOSED",this.destroy(e),this}}class y extends i$1{aborted=false;httpVersion="1.1";httpVersionMajor=1;httpVersionMinor=1;complete=true;connection;socket;headers={};trailers={};method="GET";url="/";statusCode=200;statusMessage="";closed=false;errored=null;readable=false;constructor(e){super(),this.socket=this.connection=e||new A;}get rawHeaders(){const e=this.headers,t=[];for(const r in e)if(Array.isArray(e[r]))for(const s of e[r])t.push(r,s);else t.push(r,e[r]);return t}get rawTrailers(){return []}setTimeout(e,t){return this}get headersDistinct(){return p(this.headers)}get trailersDistinct(){return p(this.trailers)}}function p(n){const e={};for(const[t,r]of Object.entries(n))t&&(e[t]=(Array.isArray(r)?r:[r]).filter(Boolean));return e}class w extends l$1{statusCode=200;statusMessage="";upgrading=false;chunkedEncoding=false;shouldKeepAlive=false;useChunkedEncodingByDefault=false;sendDate=false;finished=false;headersSent=false;strictContentLength=false;connection=null;socket=null;req;_headers={};constructor(e){super(),this.req=e;}assignSocket(e){e._httpMessage=this,this.socket=e,this.connection=e,this.emit("socket",e),this._flush();}_flush(){this.flushHeaders();}detachSocket(e){}writeContinue(e){}writeHead(e,t,r){e&&(this.statusCode=e),typeof t=="string"&&(this.statusMessage=t,t=void 0);const s=r||t;if(s&&!Array.isArray(s))for(const a in s)this.setHeader(a,s[a]);return this.headersSent=true,this}writeProcessing(){}setTimeout(e,t){return this}appendHeader(e,t){e=e.toLowerCase();const r=this._headers[e],s=[...Array.isArray(r)?r:[r],...Array.isArray(t)?t:[t]].filter(Boolean);return this._headers[e]=s.length>1?s:s[0],this}setHeader(e,t){return this._headers[e.toLowerCase()]=t,this}setHeaders(e){for(const[t,r]of Object.entries(e))this.setHeader(t,r);return this}getHeader(e){return this._headers[e.toLowerCase()]}getHeaders(){return this._headers}getHeaderNames(){return Object.keys(this._headers)}hasHeader(e){return e.toLowerCase()in this._headers}removeHeader(e){delete this._headers[e.toLowerCase()];}addTrailers(e){}flushHeaders(){}writeEarlyHints(e,t){typeof t=="function"&&t();}}const E=(()=>{const n=function(){};return n.prototype=Object.create(null),n})();function R(n={}){const e=new E,t=Array.isArray(n)||H(n)?n:Object.entries(n);for(const[r,s]of t)if(s){if(e[r]===void 0){e[r]=s;continue}e[r]=[...Array.isArray(e[r])?e[r]:[e[r]],...Array.isArray(s)?s:[s]];}return e}function H(n){return typeof n?.entries=="function"}function v(n={}){if(n instanceof Headers)return n;const e=new Headers;for(const[t,r]of Object.entries(n))if(r!==void 0){if(Array.isArray(r)){for(const s of r)e.append(t,String(s));continue}e.set(t,String(r));}return e}const S=new Set([101,204,205,304]);async function b(n,e){const t=new y,r=new w(t);t.url=e.url?.toString()||"/";let s;if(!t.url.startsWith("/")){const d=new URL(t.url);s=d.host,t.url=d.pathname+d.search+d.hash;}t.method=e.method||"GET",t.headers=R(e.headers||{}),t.headers.host||(t.headers.host=e.host||s||"localhost"),t.connection.encrypted=t.connection.encrypted||e.protocol==="https",t.body=e.body||null,t.__unenv__=e.context,await n(t,r);let a=r._data;(S.has(r.statusCode)||t.method.toUpperCase()==="HEAD")&&(a=null,delete r._headers["content-length"]);const u={status:r.statusCode,statusText:r.statusMessage,headers:r._headers,body:a};return t.destroy(),r.destroy(),u}async function C(n,e,t={}){try{const r=await b(n,{url:e,...t});return new Response(r.body,{status:r.status,statusText:r.statusText,headers:v(r.headers)})}catch(r){return new Response(r.toString(),{status:Number.parseInt(r.statusCode||r.code)||500,statusText:r.statusText})}}

function hasProp(obj, prop) {
  try {
    return prop in obj;
  } catch {
    return false;
  }
}

class H3Error extends Error {
  static __h3_error__ = true;
  statusCode = 500;
  fatal = false;
  unhandled = false;
  statusMessage;
  data;
  cause;
  constructor(message, opts = {}) {
    super(message, opts);
    if (opts.cause && !this.cause) {
      this.cause = opts.cause;
    }
  }
  toJSON() {
    const obj = {
      message: this.message,
      statusCode: sanitizeStatusCode(this.statusCode, 500)
    };
    if (this.statusMessage) {
      obj.statusMessage = sanitizeStatusMessage(this.statusMessage);
    }
    if (this.data !== void 0) {
      obj.data = this.data;
    }
    return obj;
  }
}
function createError$1(input) {
  if (typeof input === "string") {
    return new H3Error(input);
  }
  if (isError(input)) {
    return input;
  }
  const err = new H3Error(input.message ?? input.statusMessage ?? "", {
    cause: input.cause || input
  });
  if (hasProp(input, "stack")) {
    try {
      Object.defineProperty(err, "stack", {
        get() {
          return input.stack;
        }
      });
    } catch {
      try {
        err.stack = input.stack;
      } catch {
      }
    }
  }
  if (input.data) {
    err.data = input.data;
  }
  if (input.statusCode) {
    err.statusCode = sanitizeStatusCode(input.statusCode, err.statusCode);
  } else if (input.status) {
    err.statusCode = sanitizeStatusCode(input.status, err.statusCode);
  }
  if (input.statusMessage) {
    err.statusMessage = input.statusMessage;
  } else if (input.statusText) {
    err.statusMessage = input.statusText;
  }
  if (err.statusMessage) {
    const originalMessage = err.statusMessage;
    const sanitizedMessage = sanitizeStatusMessage(err.statusMessage);
    if (sanitizedMessage !== originalMessage) {
      console.warn(
        "[h3] Please prefer using `message` for longer error messages instead of `statusMessage`. In the future, `statusMessage` will be sanitized by default."
      );
    }
  }
  if (input.fatal !== void 0) {
    err.fatal = input.fatal;
  }
  if (input.unhandled !== void 0) {
    err.unhandled = input.unhandled;
  }
  return err;
}
function sendError(event, error, debug) {
  if (event.handled) {
    return;
  }
  const h3Error = isError(error) ? error : createError$1(error);
  const responseBody = {
    statusCode: h3Error.statusCode,
    statusMessage: h3Error.statusMessage,
    stack: [],
    data: h3Error.data
  };
  if (debug) {
    responseBody.stack = (h3Error.stack || "").split("\n").map((l) => l.trim());
  }
  if (event.handled) {
    return;
  }
  const _code = Number.parseInt(h3Error.statusCode);
  setResponseStatus(event, _code, h3Error.statusMessage);
  event.node.res.setHeader("content-type", MIMES.json);
  event.node.res.end(JSON.stringify(responseBody, void 0, 2));
}
function isError(input) {
  return input?.constructor?.__h3_error__ === true;
}

function getQuery(event) {
  return getQuery$1(event.path || "");
}
function isMethod(event, expected, allowHead) {
  if (typeof expected === "string") {
    if (event.method === expected) {
      return true;
    }
  } else if (expected.includes(event.method)) {
    return true;
  }
  return false;
}
function assertMethod(event, expected, allowHead) {
  if (!isMethod(event, expected)) {
    throw createError$1({
      statusCode: 405,
      statusMessage: "HTTP method is not allowed."
    });
  }
}
function getRequestHeaders(event) {
  const _headers = {};
  for (const key in event.node.req.headers) {
    const val = event.node.req.headers[key];
    _headers[key] = Array.isArray(val) ? val.filter(Boolean).join(", ") : val;
  }
  return _headers;
}
function getRequestHeader(event, name) {
  const headers = getRequestHeaders(event);
  const value = headers[name.toLowerCase()];
  return value;
}
function getRequestHost(event, opts = {}) {
  if (opts.xForwardedHost) {
    const _header = event.node.req.headers["x-forwarded-host"];
    const xForwardedHost = (_header || "").split(",").shift()?.trim();
    if (xForwardedHost) {
      return xForwardedHost;
    }
  }
  return event.node.req.headers.host || "localhost";
}
function getRequestProtocol(event, opts = {}) {
  if (opts.xForwardedProto !== false && event.node.req.headers["x-forwarded-proto"] === "https") {
    return "https";
  }
  return event.node.req.connection?.encrypted ? "https" : "http";
}
function getRequestURL(event, opts = {}) {
  const host = getRequestHost(event, opts);
  const protocol = getRequestProtocol(event, opts);
  const path = (event.node.req.originalUrl || event.path).replace(
    /^[/\\]+/g,
    "/"
  );
  return new URL(path, `${protocol}://${host}`);
}

const RawBodySymbol = Symbol.for("h3RawBody");
const PayloadMethods$1 = ["PATCH", "POST", "PUT", "DELETE"];
function readRawBody(event, encoding = "utf8") {
  assertMethod(event, PayloadMethods$1);
  const _rawBody = event._requestBody || event.web?.request?.body || event.node.req[RawBodySymbol] || event.node.req.rawBody || event.node.req.body;
  if (_rawBody) {
    const promise2 = Promise.resolve(_rawBody).then((_resolved) => {
      if (Buffer.isBuffer(_resolved)) {
        return _resolved;
      }
      if (typeof _resolved.pipeTo === "function") {
        return new Promise((resolve, reject) => {
          const chunks = [];
          _resolved.pipeTo(
            new WritableStream({
              write(chunk) {
                chunks.push(chunk);
              },
              close() {
                resolve(Buffer.concat(chunks));
              },
              abort(reason) {
                reject(reason);
              }
            })
          ).catch(reject);
        });
      } else if (typeof _resolved.pipe === "function") {
        return new Promise((resolve, reject) => {
          const chunks = [];
          _resolved.on("data", (chunk) => {
            chunks.push(chunk);
          }).on("end", () => {
            resolve(Buffer.concat(chunks));
          }).on("error", reject);
        });
      }
      if (_resolved.constructor === Object) {
        return Buffer.from(JSON.stringify(_resolved));
      }
      if (_resolved instanceof URLSearchParams) {
        return Buffer.from(_resolved.toString());
      }
      if (_resolved instanceof FormData) {
        return new Response(_resolved).bytes().then((uint8arr) => Buffer.from(uint8arr));
      }
      return Buffer.from(_resolved);
    });
    return encoding ? promise2.then((buff) => buff.toString(encoding)) : promise2;
  }
  if (!Number.parseInt(event.node.req.headers["content-length"] || "") && !/\bchunked\b/i.test(
    String(event.node.req.headers["transfer-encoding"] ?? "")
  )) {
    return Promise.resolve(void 0);
  }
  const promise = event.node.req[RawBodySymbol] = new Promise(
    (resolve, reject) => {
      const bodyData = [];
      event.node.req.on("error", (err) => {
        reject(err);
      }).on("data", (chunk) => {
        bodyData.push(chunk);
      }).on("end", () => {
        resolve(Buffer.concat(bodyData));
      });
    }
  );
  const result = encoding ? promise.then((buff) => buff.toString(encoding)) : promise;
  return result;
}
function getRequestWebStream(event) {
  if (!PayloadMethods$1.includes(event.method)) {
    return;
  }
  const bodyStream = event.web?.request?.body || event._requestBody;
  if (bodyStream) {
    return bodyStream;
  }
  const _hasRawBody = RawBodySymbol in event.node.req || "rawBody" in event.node.req || "body" in event.node.req || "__unenv__" in event.node.req;
  if (_hasRawBody) {
    return new ReadableStream({
      async start(controller) {
        const _rawBody = await readRawBody(event, false);
        if (_rawBody) {
          controller.enqueue(_rawBody);
        }
        controller.close();
      }
    });
  }
  return new ReadableStream({
    start: (controller) => {
      event.node.req.on("data", (chunk) => {
        controller.enqueue(chunk);
      });
      event.node.req.on("end", () => {
        controller.close();
      });
      event.node.req.on("error", (err) => {
        controller.error(err);
      });
    }
  });
}

function handleCacheHeaders(event, opts) {
  const cacheControls = ["public", ...opts.cacheControls || []];
  let cacheMatched = false;
  if (opts.maxAge !== void 0) {
    cacheControls.push(`max-age=${+opts.maxAge}`, `s-maxage=${+opts.maxAge}`);
  }
  if (opts.modifiedTime) {
    const modifiedTime = new Date(opts.modifiedTime);
    const ifModifiedSince = event.node.req.headers["if-modified-since"];
    event.node.res.setHeader("last-modified", modifiedTime.toUTCString());
    if (ifModifiedSince && new Date(ifModifiedSince) >= modifiedTime) {
      cacheMatched = true;
    }
  }
  if (opts.etag) {
    event.node.res.setHeader("etag", opts.etag);
    const ifNonMatch = event.node.req.headers["if-none-match"];
    if (ifNonMatch === opts.etag) {
      cacheMatched = true;
    }
  }
  event.node.res.setHeader("cache-control", cacheControls.join(", "));
  if (cacheMatched) {
    event.node.res.statusCode = 304;
    if (!event.handled) {
      event.node.res.end();
    }
    return true;
  }
  return false;
}

const MIMES = {
  html: "text/html",
  json: "application/json"
};

const DISALLOWED_STATUS_CHARS = /[^\u0009\u0020-\u007E]/g;
function sanitizeStatusMessage(statusMessage = "") {
  return statusMessage.replace(DISALLOWED_STATUS_CHARS, "");
}
function sanitizeStatusCode(statusCode, defaultStatusCode = 200) {
  if (!statusCode) {
    return defaultStatusCode;
  }
  if (typeof statusCode === "string") {
    statusCode = Number.parseInt(statusCode, 10);
  }
  if (statusCode < 100 || statusCode > 999) {
    return defaultStatusCode;
  }
  return statusCode;
}

function getDistinctCookieKey(name, opts) {
  return [name, opts.domain || "", opts.path || "/"].join(";");
}

function parseCookies(event) {
  return parse(event.node.req.headers.cookie || "");
}
function getCookie(event, name) {
  return parseCookies(event)[name];
}
function setCookie(event, name, value, serializeOptions = {}) {
  if (!serializeOptions.path) {
    serializeOptions = { path: "/", ...serializeOptions };
  }
  const newCookie = serialize$2(name, value, serializeOptions);
  const currentCookies = splitCookiesString(
    event.node.res.getHeader("set-cookie")
  );
  if (currentCookies.length === 0) {
    event.node.res.setHeader("set-cookie", newCookie);
    return;
  }
  const newCookieKey = getDistinctCookieKey(name, serializeOptions);
  event.node.res.removeHeader("set-cookie");
  for (const cookie of currentCookies) {
    const parsed = parseSetCookie(cookie);
    const key = getDistinctCookieKey(parsed.name, parsed);
    if (key === newCookieKey) {
      continue;
    }
    event.node.res.appendHeader("set-cookie", cookie);
  }
  event.node.res.appendHeader("set-cookie", newCookie);
}
function deleteCookie(event, name, serializeOptions) {
  setCookie(event, name, "", {
    ...serializeOptions,
    maxAge: 0
  });
}
function splitCookiesString(cookiesString) {
  if (Array.isArray(cookiesString)) {
    return cookiesString.flatMap((c) => splitCookiesString(c));
  }
  if (typeof cookiesString !== "string") {
    return [];
  }
  const cookiesStrings = [];
  let pos = 0;
  let start;
  let ch;
  let lastComma;
  let nextStart;
  let cookiesSeparatorFound;
  const skipWhitespace = () => {
    while (pos < cookiesString.length && /\s/.test(cookiesString.charAt(pos))) {
      pos += 1;
    }
    return pos < cookiesString.length;
  };
  const notSpecialChar = () => {
    ch = cookiesString.charAt(pos);
    return ch !== "=" && ch !== ";" && ch !== ",";
  };
  while (pos < cookiesString.length) {
    start = pos;
    cookiesSeparatorFound = false;
    while (skipWhitespace()) {
      ch = cookiesString.charAt(pos);
      if (ch === ",") {
        lastComma = pos;
        pos += 1;
        skipWhitespace();
        nextStart = pos;
        while (pos < cookiesString.length && notSpecialChar()) {
          pos += 1;
        }
        if (pos < cookiesString.length && cookiesString.charAt(pos) === "=") {
          cookiesSeparatorFound = true;
          pos = nextStart;
          cookiesStrings.push(cookiesString.slice(start, lastComma));
          start = pos;
        } else {
          pos = lastComma + 1;
        }
      } else {
        pos += 1;
      }
    }
    if (!cookiesSeparatorFound || pos >= cookiesString.length) {
      cookiesStrings.push(cookiesString.slice(start));
    }
  }
  return cookiesStrings;
}

const defer = typeof setImmediate === "undefined" ? (fn) => fn() : setImmediate;
function send(event, data, type) {
  if (type) {
    defaultContentType(event, type);
  }
  return new Promise((resolve) => {
    defer(() => {
      if (!event.handled) {
        event.node.res.end(data);
      }
      resolve();
    });
  });
}
function sendNoContent(event, code) {
  if (event.handled) {
    return;
  }
  if (!code && event.node.res.statusCode !== 200) {
    code = event.node.res.statusCode;
  }
  const _code = sanitizeStatusCode(code, 204);
  if (_code === 204) {
    event.node.res.removeHeader("content-length");
  }
  event.node.res.writeHead(_code);
  event.node.res.end();
}
function setResponseStatus(event, code, text) {
  if (code) {
    event.node.res.statusCode = sanitizeStatusCode(
      code,
      event.node.res.statusCode
    );
  }
  if (text) {
    event.node.res.statusMessage = sanitizeStatusMessage(text);
  }
}
function getResponseStatus(event) {
  return event.node.res.statusCode;
}
function getResponseStatusText(event) {
  return event.node.res.statusMessage;
}
function defaultContentType(event, type) {
  if (type && event.node.res.statusCode !== 304 && !event.node.res.getHeader("content-type")) {
    event.node.res.setHeader("content-type", type);
  }
}
function sendRedirect(event, location, code = 302) {
  event.node.res.statusCode = sanitizeStatusCode(
    code,
    event.node.res.statusCode
  );
  event.node.res.setHeader("location", location);
  const encodedLoc = location.replace(/"/g, "%22");
  const html = `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0; url=${encodedLoc}"></head></html>`;
  return send(event, html, MIMES.html);
}
function getResponseHeader(event, name) {
  return event.node.res.getHeader(name);
}
function setResponseHeaders(event, headers) {
  for (const [name, value] of Object.entries(headers)) {
    event.node.res.setHeader(
      name,
      value
    );
  }
}
const setHeaders = setResponseHeaders;
function setResponseHeader(event, name, value) {
  event.node.res.setHeader(name, value);
}
function appendResponseHeader(event, name, value) {
  let current = event.node.res.getHeader(name);
  if (!current) {
    event.node.res.setHeader(name, value);
    return;
  }
  if (!Array.isArray(current)) {
    current = [current.toString()];
  }
  event.node.res.setHeader(name, [...current, value]);
}
function removeResponseHeader(event, name) {
  return event.node.res.removeHeader(name);
}
function isStream(data) {
  if (!data || typeof data !== "object") {
    return false;
  }
  if (typeof data.pipe === "function") {
    if (typeof data._read === "function") {
      return true;
    }
    if (typeof data.abort === "function") {
      return true;
    }
  }
  if (typeof data.pipeTo === "function") {
    return true;
  }
  return false;
}
function isWebResponse(data) {
  return typeof Response !== "undefined" && data instanceof Response;
}
function sendStream(event, stream) {
  if (!stream || typeof stream !== "object") {
    throw new Error("[h3] Invalid stream provided.");
  }
  event.node.res._data = stream;
  if (!event.node.res.socket) {
    event._handled = true;
    return Promise.resolve();
  }
  if (hasProp(stream, "pipeTo") && typeof stream.pipeTo === "function") {
    return stream.pipeTo(
      new WritableStream({
        write(chunk) {
          event.node.res.write(chunk);
        }
      })
    ).then(() => {
      event.node.res.end();
    });
  }
  if (hasProp(stream, "pipe") && typeof stream.pipe === "function") {
    return new Promise((resolve, reject) => {
      stream.pipe(event.node.res);
      if (stream.on) {
        stream.on("end", () => {
          event.node.res.end();
          resolve();
        });
        stream.on("error", (error) => {
          reject(error);
        });
      }
      event.node.res.on("close", () => {
        if (stream.abort) {
          stream.abort();
        }
      });
    });
  }
  throw new Error("[h3] Invalid or incompatible stream provided.");
}
function sendWebResponse(event, response) {
  for (const [key, value] of response.headers) {
    if (key === "set-cookie") {
      event.node.res.appendHeader(key, splitCookiesString(value));
    } else {
      event.node.res.setHeader(key, value);
    }
  }
  if (response.status) {
    event.node.res.statusCode = sanitizeStatusCode(
      response.status,
      event.node.res.statusCode
    );
  }
  if (response.statusText) {
    event.node.res.statusMessage = sanitizeStatusMessage(response.statusText);
  }
  if (response.redirected) {
    event.node.res.setHeader("location", response.url);
  }
  if (!response.body) {
    event.node.res.end();
    return;
  }
  return sendStream(event, response.body);
}

const PayloadMethods = /* @__PURE__ */ new Set(["PATCH", "POST", "PUT", "DELETE"]);
const ignoredHeaders = /* @__PURE__ */ new Set([
  "transfer-encoding",
  "accept-encoding",
  "connection",
  "keep-alive",
  "upgrade",
  "expect",
  "host",
  "accept"
]);
async function proxyRequest(event, target, opts = {}) {
  let body;
  let duplex;
  if (PayloadMethods.has(event.method)) {
    if (opts.streamRequest) {
      body = getRequestWebStream(event);
      duplex = "half";
    } else {
      body = await readRawBody(event, false).catch(() => void 0);
    }
  }
  const method = opts.fetchOptions?.method || event.method;
  const fetchHeaders = mergeHeaders$1(
    getProxyRequestHeaders(event, { host: target.startsWith("/") }),
    opts.fetchOptions?.headers,
    opts.headers
  );
  return sendProxy(event, target, {
    ...opts,
    fetchOptions: {
      method,
      body,
      duplex,
      ...opts.fetchOptions,
      headers: fetchHeaders
    }
  });
}
async function sendProxy(event, target, opts = {}) {
  let response;
  try {
    response = await _getFetch(opts.fetch)(target, {
      headers: opts.headers,
      ignoreResponseError: true,
      // make $ofetch.raw transparent
      ...opts.fetchOptions
    });
  } catch (error) {
    throw createError$1({
      status: 502,
      statusMessage: "Bad Gateway",
      cause: error
    });
  }
  event.node.res.statusCode = sanitizeStatusCode(
    response.status,
    event.node.res.statusCode
  );
  event.node.res.statusMessage = sanitizeStatusMessage(response.statusText);
  const cookies = [];
  for (const [key, value] of response.headers.entries()) {
    if (key === "content-encoding") {
      continue;
    }
    if (key === "content-length") {
      continue;
    }
    if (key === "set-cookie") {
      cookies.push(...splitCookiesString(value));
      continue;
    }
    event.node.res.setHeader(key, value);
  }
  if (cookies.length > 0) {
    event.node.res.setHeader(
      "set-cookie",
      cookies.map((cookie) => {
        if (opts.cookieDomainRewrite) {
          cookie = rewriteCookieProperty(
            cookie,
            opts.cookieDomainRewrite,
            "domain"
          );
        }
        if (opts.cookiePathRewrite) {
          cookie = rewriteCookieProperty(
            cookie,
            opts.cookiePathRewrite,
            "path"
          );
        }
        return cookie;
      })
    );
  }
  if (opts.onResponse) {
    await opts.onResponse(event, response);
  }
  if (response._data !== void 0) {
    return response._data;
  }
  if (event.handled) {
    return;
  }
  if (opts.sendStream === false) {
    const data = new Uint8Array(await response.arrayBuffer());
    return event.node.res.end(data);
  }
  if (response.body) {
    for await (const chunk of response.body) {
      event.node.res.write(chunk);
    }
  }
  return event.node.res.end();
}
function getProxyRequestHeaders(event, opts) {
  const headers = /* @__PURE__ */ Object.create(null);
  const reqHeaders = getRequestHeaders(event);
  for (const name in reqHeaders) {
    if (!ignoredHeaders.has(name) || name === "host" && opts?.host) {
      headers[name] = reqHeaders[name];
    }
  }
  return headers;
}
function fetchWithEvent(event, req, init, options) {
  return _getFetch(options?.fetch)(req, {
    ...init,
    context: init?.context || event.context,
    headers: {
      ...getProxyRequestHeaders(event, {
        host: typeof req === "string" && req.startsWith("/")
      }),
      ...init?.headers
    }
  });
}
function _getFetch(_fetch) {
  if (_fetch) {
    return _fetch;
  }
  if (globalThis.fetch) {
    return globalThis.fetch;
  }
  throw new Error(
    "fetch is not available. Try importing `node-fetch-native/polyfill` for Node.js."
  );
}
function rewriteCookieProperty(header, map, property) {
  const _map = typeof map === "string" ? { "*": map } : map;
  return header.replace(
    new RegExp(`(;\\s*${property}=)([^;]+)`, "gi"),
    (match, prefix, previousValue) => {
      let newValue;
      if (previousValue in _map) {
        newValue = _map[previousValue];
      } else if ("*" in _map) {
        newValue = _map["*"];
      } else {
        return match;
      }
      return newValue ? prefix + newValue : "";
    }
  );
}
function mergeHeaders$1(defaults, ...inputs) {
  const _inputs = inputs.filter(Boolean);
  if (_inputs.length === 0) {
    return defaults;
  }
  const merged = new Headers(defaults);
  for (const input of _inputs) {
    const entries = Array.isArray(input) ? input : typeof input.entries === "function" ? input.entries() : Object.entries(input);
    for (const [key, value] of entries) {
      if (value !== void 0) {
        merged.set(key, value);
      }
    }
  }
  return merged;
}

class H3Event {
  "__is_event__" = true;
  // Context
  node;
  // Node
  web;
  // Web
  context = {};
  // Shared
  // Request
  _method;
  _path;
  _headers;
  _requestBody;
  // Response
  _handled = false;
  // Hooks
  _onBeforeResponseCalled;
  _onAfterResponseCalled;
  constructor(req, res) {
    this.node = { req, res };
  }
  // --- Request ---
  get method() {
    if (!this._method) {
      this._method = (this.node.req.method || "GET").toUpperCase();
    }
    return this._method;
  }
  get path() {
    return this._path || this.node.req.url || "/";
  }
  get headers() {
    if (!this._headers) {
      this._headers = _normalizeNodeHeaders(this.node.req.headers);
    }
    return this._headers;
  }
  // --- Respoonse ---
  get handled() {
    return this._handled || this.node.res.writableEnded || this.node.res.headersSent;
  }
  respondWith(response) {
    return Promise.resolve(response).then(
      (_response) => sendWebResponse(this, _response)
    );
  }
  // --- Utils ---
  toString() {
    return `[${this.method}] ${this.path}`;
  }
  toJSON() {
    return this.toString();
  }
  // --- Deprecated ---
  /** @deprecated Please use `event.node.req` instead. */
  get req() {
    return this.node.req;
  }
  /** @deprecated Please use `event.node.res` instead. */
  get res() {
    return this.node.res;
  }
}
function isEvent(input) {
  return hasProp(input, "__is_event__");
}
function createEvent(req, res) {
  return new H3Event(req, res);
}
function _normalizeNodeHeaders(nodeHeaders) {
  const headers = new Headers();
  for (const [name, value] of Object.entries(nodeHeaders)) {
    if (Array.isArray(value)) {
      for (const item of value) {
        headers.append(name, item);
      }
    } else if (value) {
      headers.set(name, value);
    }
  }
  return headers;
}

function defineEventHandler(handler) {
  if (typeof handler === "function") {
    handler.__is_handler__ = true;
    return handler;
  }
  const _hooks = {
    onRequest: _normalizeArray(handler.onRequest),
    onBeforeResponse: _normalizeArray(handler.onBeforeResponse)
  };
  const _handler = (event) => {
    return _callHandler(event, handler.handler, _hooks);
  };
  _handler.__is_handler__ = true;
  _handler.__resolve__ = handler.handler.__resolve__;
  _handler.__websocket__ = handler.websocket;
  return _handler;
}
function _normalizeArray(input) {
  return input ? Array.isArray(input) ? input : [input] : void 0;
}
async function _callHandler(event, handler, hooks) {
  if (hooks.onRequest) {
    for (const hook of hooks.onRequest) {
      await hook(event);
      if (event.handled) {
        return;
      }
    }
  }
  const body = await handler(event);
  const response = { body };
  if (hooks.onBeforeResponse) {
    for (const hook of hooks.onBeforeResponse) {
      await hook(event, response);
    }
  }
  return response.body;
}
const eventHandler = defineEventHandler;
function isEventHandler(input) {
  return hasProp(input, "__is_handler__");
}
function toEventHandler(input, _, _route) {
  if (!isEventHandler(input)) {
    console.warn(
      "[h3] Implicit event handler conversion is deprecated. Use `eventHandler()` or `fromNodeMiddleware()` to define event handlers.",
      _route && _route !== "/" ? `
     Route: ${_route}` : "",
      `
     Handler: ${input}`
    );
  }
  return input;
}
function defineLazyEventHandler(factory) {
  let _promise;
  let _resolved;
  const resolveHandler = () => {
    if (_resolved) {
      return Promise.resolve(_resolved);
    }
    if (!_promise) {
      _promise = Promise.resolve(factory()).then((r) => {
        const handler2 = r.default || r;
        if (typeof handler2 !== "function") {
          throw new TypeError(
            "Invalid lazy handler result. It should be a function:",
            handler2
          );
        }
        _resolved = { handler: toEventHandler(r.default || r) };
        return _resolved;
      });
    }
    return _promise;
  };
  const handler = eventHandler((event) => {
    if (_resolved) {
      return _resolved.handler(event);
    }
    return resolveHandler().then((r) => r.handler(event));
  });
  handler.__resolve__ = resolveHandler;
  return handler;
}
const lazyEventHandler = defineLazyEventHandler;

function createApp(options = {}) {
  const stack = [];
  const handler = createAppEventHandler(stack, options);
  const resolve = createResolver(stack);
  handler.__resolve__ = resolve;
  const getWebsocket = cachedFn(() => websocketOptions(resolve, options));
  const app = {
    // @ts-expect-error
    use: (arg1, arg2, arg3) => use(app, arg1, arg2, arg3),
    resolve,
    handler,
    stack,
    options,
    get websocket() {
      return getWebsocket();
    }
  };
  return app;
}
function use(app, arg1, arg2, arg3) {
  if (Array.isArray(arg1)) {
    for (const i of arg1) {
      use(app, i, arg2, arg3);
    }
  } else if (Array.isArray(arg2)) {
    for (const i of arg2) {
      use(app, arg1, i, arg3);
    }
  } else if (typeof arg1 === "string") {
    app.stack.push(
      normalizeLayer({ ...arg3, route: arg1, handler: arg2 })
    );
  } else if (typeof arg1 === "function") {
    app.stack.push(normalizeLayer({ ...arg2, handler: arg1 }));
  } else {
    app.stack.push(normalizeLayer({ ...arg1 }));
  }
  return app;
}
function createAppEventHandler(stack, options) {
  const spacing = options.debug ? 2 : void 0;
  return eventHandler(async (event) => {
    event.node.req.originalUrl = event.node.req.originalUrl || event.node.req.url || "/";
    const _reqPath = event._path || event.node.req.url || "/";
    let _layerPath;
    if (options.onRequest) {
      await options.onRequest(event);
    }
    for (const layer of stack) {
      if (layer.route.length > 1) {
        if (!_reqPath.startsWith(layer.route)) {
          continue;
        }
        _layerPath = _reqPath.slice(layer.route.length) || "/";
      } else {
        _layerPath = _reqPath;
      }
      if (layer.match && !layer.match(_layerPath, event)) {
        continue;
      }
      event._path = _layerPath;
      event.node.req.url = _layerPath;
      const val = await layer.handler(event);
      const _body = val === void 0 ? void 0 : await val;
      if (_body !== void 0) {
        const _response = { body: _body };
        if (options.onBeforeResponse) {
          event._onBeforeResponseCalled = true;
          await options.onBeforeResponse(event, _response);
        }
        await handleHandlerResponse(event, _response.body, spacing);
        if (options.onAfterResponse) {
          event._onAfterResponseCalled = true;
          await options.onAfterResponse(event, _response);
        }
        return;
      }
      if (event.handled) {
        if (options.onAfterResponse) {
          event._onAfterResponseCalled = true;
          await options.onAfterResponse(event, void 0);
        }
        return;
      }
    }
    if (!event.handled) {
      throw createError$1({
        statusCode: 404,
        statusMessage: `Cannot find any path matching ${event.path || "/"}.`
      });
    }
    if (options.onAfterResponse) {
      event._onAfterResponseCalled = true;
      await options.onAfterResponse(event, void 0);
    }
  });
}
function createResolver(stack) {
  return async (path) => {
    let _layerPath;
    for (const layer of stack) {
      if (layer.route === "/" && !layer.handler.__resolve__) {
        continue;
      }
      if (!path.startsWith(layer.route)) {
        continue;
      }
      _layerPath = path.slice(layer.route.length) || "/";
      if (layer.match && !layer.match(_layerPath, void 0)) {
        continue;
      }
      let res = { route: layer.route, handler: layer.handler };
      if (res.handler.__resolve__) {
        const _res = await res.handler.__resolve__(_layerPath);
        if (!_res) {
          continue;
        }
        res = {
          ...res,
          ..._res,
          route: joinURL(res.route || "/", _res.route || "/")
        };
      }
      return res;
    }
  };
}
function normalizeLayer(input) {
  let handler = input.handler;
  if (handler.handler) {
    handler = handler.handler;
  }
  if (input.lazy) {
    handler = lazyEventHandler(handler);
  } else if (!isEventHandler(handler)) {
    handler = toEventHandler(handler, void 0, input.route);
  }
  return {
    route: withoutTrailingSlash(input.route),
    match: input.match,
    handler
  };
}
function handleHandlerResponse(event, val, jsonSpace) {
  if (val === null) {
    return sendNoContent(event);
  }
  if (val) {
    if (isWebResponse(val)) {
      return sendWebResponse(event, val);
    }
    if (isStream(val)) {
      return sendStream(event, val);
    }
    if (val.buffer) {
      return send(event, val);
    }
    if (val.arrayBuffer && typeof val.arrayBuffer === "function") {
      return val.arrayBuffer().then((arrayBuffer) => {
        return send(event, Buffer.from(arrayBuffer), val.type);
      });
    }
    if (val instanceof Error) {
      throw createError$1(val);
    }
    if (typeof val.end === "function") {
      return true;
    }
  }
  const valType = typeof val;
  if (valType === "string") {
    return send(event, val, MIMES.html);
  }
  if (valType === "object" || valType === "boolean" || valType === "number") {
    return send(event, JSON.stringify(val, void 0, jsonSpace), MIMES.json);
  }
  if (valType === "bigint") {
    return send(event, val.toString(), MIMES.json);
  }
  throw createError$1({
    statusCode: 500,
    statusMessage: `[h3] Cannot send ${valType} as response.`
  });
}
function cachedFn(fn) {
  let cache;
  return () => {
    if (!cache) {
      cache = fn();
    }
    return cache;
  };
}
function websocketOptions(evResolver, appOptions) {
  return {
    ...appOptions.websocket,
    async resolve(info) {
      const url = info.request?.url || info.url || "/";
      const { pathname } = typeof url === "string" ? parseURL(url) : url;
      const resolved = await evResolver(pathname);
      return resolved?.handler?.__websocket__ || {};
    }
  };
}

const RouterMethods = [
  "connect",
  "delete",
  "get",
  "head",
  "options",
  "post",
  "put",
  "trace",
  "patch"
];
function createRouter(opts = {}) {
  const _router = createRouter$1({});
  const routes = {};
  let _matcher;
  const router = {};
  const addRoute = (path, handler, method) => {
    let route = routes[path];
    if (!route) {
      routes[path] = route = { path, handlers: {} };
      _router.insert(path, route);
    }
    if (Array.isArray(method)) {
      for (const m of method) {
        addRoute(path, handler, m);
      }
    } else {
      route.handlers[method] = toEventHandler(handler, void 0, path);
    }
    return router;
  };
  router.use = router.add = (path, handler, method) => addRoute(path, handler, method || "all");
  for (const method of RouterMethods) {
    router[method] = (path, handle) => router.add(path, handle, method);
  }
  const matchHandler = (path = "/", method = "get") => {
    const qIndex = path.indexOf("?");
    if (qIndex !== -1) {
      path = path.slice(0, Math.max(0, qIndex));
    }
    const matched = _router.lookup(path);
    if (!matched || !matched.handlers) {
      return {
        error: createError$1({
          statusCode: 404,
          name: "Not Found",
          statusMessage: `Cannot find any route matching ${path || "/"}.`
        })
      };
    }
    let handler = matched.handlers[method] || matched.handlers.all;
    if (!handler) {
      if (!_matcher) {
        _matcher = toRouteMatcher(_router);
      }
      const _matches = _matcher.matchAll(path).reverse();
      for (const _match of _matches) {
        if (_match.handlers[method]) {
          handler = _match.handlers[method];
          matched.handlers[method] = matched.handlers[method] || handler;
          break;
        }
        if (_match.handlers.all) {
          handler = _match.handlers.all;
          matched.handlers.all = matched.handlers.all || handler;
          break;
        }
      }
    }
    if (!handler) {
      return {
        error: createError$1({
          statusCode: 405,
          name: "Method Not Allowed",
          statusMessage: `Method ${method} is not allowed on this route.`
        })
      };
    }
    return { matched, handler };
  };
  const isPreemptive = opts.preemptive || opts.preemtive;
  router.handler = eventHandler((event) => {
    const match = matchHandler(
      event.path,
      event.method.toLowerCase()
    );
    if ("error" in match) {
      if (isPreemptive) {
        throw match.error;
      } else {
        return;
      }
    }
    event.context.matchedRoute = match.matched;
    const params = match.matched.params || {};
    event.context.params = params;
    return Promise.resolve(match.handler(event)).then((res) => {
      if (res === void 0 && isPreemptive) {
        return null;
      }
      return res;
    });
  });
  router.handler.__resolve__ = async (path) => {
    path = withLeadingSlash(path);
    const match = matchHandler(path);
    if ("error" in match) {
      return;
    }
    let res = {
      route: match.matched.path,
      handler: match.handler
    };
    if (match.handler.__resolve__) {
      const _res = await match.handler.__resolve__(path);
      if (!_res) {
        return;
      }
      res = { ...res, ..._res };
    }
    return res;
  };
  return router;
}
function fromNodeMiddleware(handler) {
  if (isEventHandler(handler)) {
    return handler;
  }
  if (typeof handler !== "function") {
    throw new TypeError(
      "Invalid handler. It should be a function:",
      handler
    );
  }
  return eventHandler((event) => {
    return callNodeListener(
      handler,
      event.node.req,
      event.node.res
    );
  });
}
function toNodeListener(app) {
  const toNodeHandle = async function(req, res) {
    const event = createEvent(req, res);
    try {
      await app.handler(event);
    } catch (_error) {
      const error = createError$1(_error);
      if (!isError(_error)) {
        error.unhandled = true;
      }
      setResponseStatus(event, error.statusCode, error.statusMessage);
      if (app.options.onError) {
        await app.options.onError(error, event);
      }
      if (event.handled) {
        return;
      }
      if (error.unhandled || error.fatal) {
        console.error("[h3]", error.fatal ? "[fatal]" : "[unhandled]", error);
      }
      if (app.options.onBeforeResponse && !event._onBeforeResponseCalled) {
        await app.options.onBeforeResponse(event, { body: error });
      }
      await sendError(event, error, !!app.options.debug);
      if (app.options.onAfterResponse && !event._onAfterResponseCalled) {
        await app.options.onAfterResponse(event, { body: error });
      }
    }
  };
  return toNodeHandle;
}
function callNodeListener(handler, req, res) {
  const isMiddleware = handler.length > 2;
  return new Promise((resolve, reject) => {
    const next = (err) => {
      if (isMiddleware) {
        res.off("close", next);
        res.off("error", next);
      }
      return err ? reject(createError$1(err)) : resolve(void 0);
    };
    try {
      const returned = handler(req, res, next);
      if (isMiddleware && returned === void 0) {
        res.once("close", next);
        res.once("error", next);
      } else {
        resolve(returned);
      }
    } catch (error) {
      next(error);
    }
  });
}

function flatHooks(configHooks, hooks = {}, parentName) {
  for (const key in configHooks) {
    const subHook = configHooks[key];
    const name = parentName ? `${parentName}:${key}` : key;
    if (typeof subHook === "object" && subHook !== null) {
      flatHooks(subHook, hooks, name);
    } else if (typeof subHook === "function") {
      hooks[name] = subHook;
    }
  }
  return hooks;
}
const defaultTask = { run: (function_) => function_() };
const _createTask = () => defaultTask;
const createTask = typeof console.createTask !== "undefined" ? console.createTask : _createTask;
function serialTaskCaller(hooks, args) {
  const name = args.shift();
  const task = createTask(name);
  return hooks.reduce(
    (promise, hookFunction) => promise.then(() => task.run(() => hookFunction(...args))),
    Promise.resolve()
  );
}
function parallelTaskCaller(hooks, args) {
  const name = args.shift();
  const task = createTask(name);
  return Promise.all(hooks.map((hook) => task.run(() => hook(...args))));
}
function callEachWith(callbacks, arg0) {
  for (const callback of [...callbacks]) {
    callback(arg0);
  }
}

class Hookable {
  constructor() {
    this._hooks = {};
    this._before = void 0;
    this._after = void 0;
    this._deprecatedMessages = void 0;
    this._deprecatedHooks = {};
    this.hook = this.hook.bind(this);
    this.callHook = this.callHook.bind(this);
    this.callHookWith = this.callHookWith.bind(this);
  }
  hook(name, function_, options = {}) {
    if (!name || typeof function_ !== "function") {
      return () => {
      };
    }
    const originalName = name;
    let dep;
    while (this._deprecatedHooks[name]) {
      dep = this._deprecatedHooks[name];
      name = dep.to;
    }
    if (dep && !options.allowDeprecated) {
      let message = dep.message;
      if (!message) {
        message = `${originalName} hook has been deprecated` + (dep.to ? `, please use ${dep.to}` : "");
      }
      if (!this._deprecatedMessages) {
        this._deprecatedMessages = /* @__PURE__ */ new Set();
      }
      if (!this._deprecatedMessages.has(message)) {
        console.warn(message);
        this._deprecatedMessages.add(message);
      }
    }
    if (!function_.name) {
      try {
        Object.defineProperty(function_, "name", {
          get: () => "_" + name.replace(/\W+/g, "_") + "_hook_cb",
          configurable: true
        });
      } catch {
      }
    }
    this._hooks[name] = this._hooks[name] || [];
    this._hooks[name].push(function_);
    return () => {
      if (function_) {
        this.removeHook(name, function_);
        function_ = void 0;
      }
    };
  }
  hookOnce(name, function_) {
    let _unreg;
    let _function = (...arguments_) => {
      if (typeof _unreg === "function") {
        _unreg();
      }
      _unreg = void 0;
      _function = void 0;
      return function_(...arguments_);
    };
    _unreg = this.hook(name, _function);
    return _unreg;
  }
  removeHook(name, function_) {
    if (this._hooks[name]) {
      const index = this._hooks[name].indexOf(function_);
      if (index !== -1) {
        this._hooks[name].splice(index, 1);
      }
      if (this._hooks[name].length === 0) {
        delete this._hooks[name];
      }
    }
  }
  deprecateHook(name, deprecated) {
    this._deprecatedHooks[name] = typeof deprecated === "string" ? { to: deprecated } : deprecated;
    const _hooks = this._hooks[name] || [];
    delete this._hooks[name];
    for (const hook of _hooks) {
      this.hook(name, hook);
    }
  }
  deprecateHooks(deprecatedHooks) {
    Object.assign(this._deprecatedHooks, deprecatedHooks);
    for (const name in deprecatedHooks) {
      this.deprecateHook(name, deprecatedHooks[name]);
    }
  }
  addHooks(configHooks) {
    const hooks = flatHooks(configHooks);
    const removeFns = Object.keys(hooks).map(
      (key) => this.hook(key, hooks[key])
    );
    return () => {
      for (const unreg of removeFns.splice(0, removeFns.length)) {
        unreg();
      }
    };
  }
  removeHooks(configHooks) {
    const hooks = flatHooks(configHooks);
    for (const key in hooks) {
      this.removeHook(key, hooks[key]);
    }
  }
  removeAllHooks() {
    for (const key in this._hooks) {
      delete this._hooks[key];
    }
  }
  callHook(name, ...arguments_) {
    arguments_.unshift(name);
    return this.callHookWith(serialTaskCaller, name, ...arguments_);
  }
  callHookParallel(name, ...arguments_) {
    arguments_.unshift(name);
    return this.callHookWith(parallelTaskCaller, name, ...arguments_);
  }
  callHookWith(caller, name, ...arguments_) {
    const event = this._before || this._after ? { name, args: arguments_, context: {} } : void 0;
    if (this._before) {
      callEachWith(this._before, event);
    }
    const result = caller(
      name in this._hooks ? [...this._hooks[name]] : [],
      arguments_
    );
    if (result instanceof Promise) {
      return result.finally(() => {
        if (this._after && event) {
          callEachWith(this._after, event);
        }
      });
    }
    if (this._after && event) {
      callEachWith(this._after, event);
    }
    return result;
  }
  beforeEach(function_) {
    this._before = this._before || [];
    this._before.push(function_);
    return () => {
      if (this._before !== void 0) {
        const index = this._before.indexOf(function_);
        if (index !== -1) {
          this._before.splice(index, 1);
        }
      }
    };
  }
  afterEach(function_) {
    this._after = this._after || [];
    this._after.push(function_);
    return () => {
      if (this._after !== void 0) {
        const index = this._after.indexOf(function_);
        if (index !== -1) {
          this._after.splice(index, 1);
        }
      }
    };
  }
}
function createHooks() {
  return new Hookable();
}

const s$1=globalThis.Headers,i=globalThis.AbortController,l=globalThis.fetch||(()=>{throw new Error("[node-fetch-native] Failed to fetch: `globalThis.fetch` is not available!")});

class FetchError extends Error {
  constructor(message, opts) {
    super(message, opts);
    this.name = "FetchError";
    if (opts?.cause && !this.cause) {
      this.cause = opts.cause;
    }
  }
}
function createFetchError(ctx) {
  const errorMessage = ctx.error?.message || ctx.error?.toString() || "";
  const method = ctx.request?.method || ctx.options?.method || "GET";
  const url = ctx.request?.url || String(ctx.request) || "/";
  const requestStr = `[${method}] ${JSON.stringify(url)}`;
  const statusStr = ctx.response ? `${ctx.response.status} ${ctx.response.statusText}` : "<no response>";
  const message = `${requestStr}: ${statusStr}${errorMessage ? ` ${errorMessage}` : ""}`;
  const fetchError = new FetchError(
    message,
    ctx.error ? { cause: ctx.error } : void 0
  );
  for (const key of ["request", "options", "response"]) {
    Object.defineProperty(fetchError, key, {
      get() {
        return ctx[key];
      }
    });
  }
  for (const [key, refKey] of [
    ["data", "_data"],
    ["status", "status"],
    ["statusCode", "status"],
    ["statusText", "statusText"],
    ["statusMessage", "statusText"]
  ]) {
    Object.defineProperty(fetchError, key, {
      get() {
        return ctx.response && ctx.response[refKey];
      }
    });
  }
  return fetchError;
}

const payloadMethods = new Set(
  Object.freeze(["PATCH", "POST", "PUT", "DELETE"])
);
function isPayloadMethod(method = "GET") {
  return payloadMethods.has(method.toUpperCase());
}
function isJSONSerializable(value) {
  if (value === void 0) {
    return false;
  }
  const t = typeof value;
  if (t === "string" || t === "number" || t === "boolean" || t === null) {
    return true;
  }
  if (t !== "object") {
    return false;
  }
  if (Array.isArray(value)) {
    return true;
  }
  if (value.buffer) {
    return false;
  }
  if (value instanceof FormData || value instanceof URLSearchParams) {
    return false;
  }
  return value.constructor && value.constructor.name === "Object" || typeof value.toJSON === "function";
}
const textTypes = /* @__PURE__ */ new Set([
  "image/svg",
  "application/xml",
  "application/xhtml",
  "application/html"
]);
const JSON_RE = /^application\/(?:[\w!#$%&*.^`~-]*\+)?json(;.+)?$/i;
function detectResponseType(_contentType = "") {
  if (!_contentType) {
    return "json";
  }
  const contentType = _contentType.split(";").shift() || "";
  if (JSON_RE.test(contentType)) {
    return "json";
  }
  if (contentType === "text/event-stream") {
    return "stream";
  }
  if (textTypes.has(contentType) || contentType.startsWith("text/")) {
    return "text";
  }
  return "blob";
}
function resolveFetchOptions(request, input, defaults, Headers) {
  const headers = mergeHeaders(
    input?.headers ?? request?.headers,
    defaults?.headers,
    Headers
  );
  let query;
  if (defaults?.query || defaults?.params || input?.params || input?.query) {
    query = {
      ...defaults?.params,
      ...defaults?.query,
      ...input?.params,
      ...input?.query
    };
  }
  return {
    ...defaults,
    ...input,
    query,
    params: query,
    headers
  };
}
function mergeHeaders(input, defaults, Headers) {
  if (!defaults) {
    return new Headers(input);
  }
  const headers = new Headers(defaults);
  if (input) {
    for (const [key, value] of Symbol.iterator in input || Array.isArray(input) ? input : new Headers(input)) {
      headers.set(key, value);
    }
  }
  return headers;
}
async function callHooks(context, hooks) {
  if (hooks) {
    if (Array.isArray(hooks)) {
      for (const hook of hooks) {
        await hook(context);
      }
    } else {
      await hooks(context);
    }
  }
}

const retryStatusCodes = /* @__PURE__ */ new Set([
  408,
  // Request Timeout
  409,
  // Conflict
  425,
  // Too Early (Experimental)
  429,
  // Too Many Requests
  500,
  // Internal Server Error
  502,
  // Bad Gateway
  503,
  // Service Unavailable
  504
  // Gateway Timeout
]);
const nullBodyResponses = /* @__PURE__ */ new Set([101, 204, 205, 304]);
function createFetch(globalOptions = {}) {
  const {
    fetch = globalThis.fetch,
    Headers = globalThis.Headers,
    AbortController = globalThis.AbortController
  } = globalOptions;
  async function onError(context) {
    const isAbort = context.error && context.error.name === "AbortError" && !context.options.timeout || false;
    if (context.options.retry !== false && !isAbort) {
      let retries;
      if (typeof context.options.retry === "number") {
        retries = context.options.retry;
      } else {
        retries = isPayloadMethod(context.options.method) ? 0 : 1;
      }
      const responseCode = context.response && context.response.status || 500;
      if (retries > 0 && (Array.isArray(context.options.retryStatusCodes) ? context.options.retryStatusCodes.includes(responseCode) : retryStatusCodes.has(responseCode))) {
        const retryDelay = typeof context.options.retryDelay === "function" ? context.options.retryDelay(context) : context.options.retryDelay || 0;
        if (retryDelay > 0) {
          await new Promise((resolve) => setTimeout(resolve, retryDelay));
        }
        return $fetchRaw(context.request, {
          ...context.options,
          retry: retries - 1
        });
      }
    }
    const error = createFetchError(context);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(error, $fetchRaw);
    }
    throw error;
  }
  const $fetchRaw = async function $fetchRaw2(_request, _options = {}) {
    const context = {
      request: _request,
      options: resolveFetchOptions(
        _request,
        _options,
        globalOptions.defaults,
        Headers
      ),
      response: void 0,
      error: void 0
    };
    if (context.options.method) {
      context.options.method = context.options.method.toUpperCase();
    }
    if (context.options.onRequest) {
      await callHooks(context, context.options.onRequest);
      if (!(context.options.headers instanceof Headers)) {
        context.options.headers = new Headers(
          context.options.headers || {}
          /* compat */
        );
      }
    }
    if (typeof context.request === "string") {
      if (context.options.baseURL) {
        context.request = withBase(context.request, context.options.baseURL);
      }
      if (context.options.query) {
        context.request = withQuery(context.request, context.options.query);
        delete context.options.query;
      }
      if ("query" in context.options) {
        delete context.options.query;
      }
      if ("params" in context.options) {
        delete context.options.params;
      }
    }
    if (context.options.body && isPayloadMethod(context.options.method)) {
      if (isJSONSerializable(context.options.body)) {
        const contentType = context.options.headers.get("content-type");
        if (typeof context.options.body !== "string") {
          context.options.body = contentType === "application/x-www-form-urlencoded" ? new URLSearchParams(
            context.options.body
          ).toString() : JSON.stringify(context.options.body);
        }
        if (!contentType) {
          context.options.headers.set("content-type", "application/json");
        }
        if (!context.options.headers.has("accept")) {
          context.options.headers.set("accept", "application/json");
        }
      } else if (
        // ReadableStream Body
        "pipeTo" in context.options.body && typeof context.options.body.pipeTo === "function" || // Node.js Stream Body
        typeof context.options.body.pipe === "function"
      ) {
        if (!("duplex" in context.options)) {
          context.options.duplex = "half";
        }
      }
    }
    let abortTimeout;
    if (!context.options.signal && context.options.timeout) {
      const controller = new AbortController();
      abortTimeout = setTimeout(() => {
        const error = new Error(
          "[TimeoutError]: The operation was aborted due to timeout"
        );
        error.name = "TimeoutError";
        error.code = 23;
        controller.abort(error);
      }, context.options.timeout);
      context.options.signal = controller.signal;
    }
    try {
      context.response = await fetch(
        context.request,
        context.options
      );
    } catch (error) {
      context.error = error;
      if (context.options.onRequestError) {
        await callHooks(
          context,
          context.options.onRequestError
        );
      }
      return await onError(context);
    } finally {
      if (abortTimeout) {
        clearTimeout(abortTimeout);
      }
    }
    const hasBody = (context.response.body || // https://github.com/unjs/ofetch/issues/324
    // https://github.com/unjs/ofetch/issues/294
    // https://github.com/JakeChampion/fetch/issues/1454
    context.response._bodyInit) && !nullBodyResponses.has(context.response.status) && context.options.method !== "HEAD";
    if (hasBody) {
      const responseType = (context.options.parseResponse ? "json" : context.options.responseType) || detectResponseType(context.response.headers.get("content-type") || "");
      switch (responseType) {
        case "json": {
          const data = await context.response.text();
          const parseFunction = context.options.parseResponse || destr;
          context.response._data = parseFunction(data);
          break;
        }
        case "stream": {
          context.response._data = context.response.body || context.response._bodyInit;
          break;
        }
        default: {
          context.response._data = await context.response[responseType]();
        }
      }
    }
    if (context.options.onResponse) {
      await callHooks(
        context,
        context.options.onResponse
      );
    }
    if (!context.options.ignoreResponseError && context.response.status >= 400 && context.response.status < 600) {
      if (context.options.onResponseError) {
        await callHooks(
          context,
          context.options.onResponseError
        );
      }
      return await onError(context);
    }
    return context.response;
  };
  const $fetch = async function $fetch2(request, options) {
    const r = await $fetchRaw(request, options);
    return r._data;
  };
  $fetch.raw = $fetchRaw;
  $fetch.native = (...args) => fetch(...args);
  $fetch.create = (defaultOptions = {}, customGlobalOptions = {}) => createFetch({
    ...globalOptions,
    ...customGlobalOptions,
    defaults: {
      ...globalOptions.defaults,
      ...customGlobalOptions.defaults,
      ...defaultOptions
    }
  });
  return $fetch;
}

function createNodeFetch() {
  const useKeepAlive = JSON.parse(process.env.FETCH_KEEP_ALIVE || "false");
  if (!useKeepAlive) {
    return l;
  }
  const agentOptions = { keepAlive: true };
  const httpAgent = new http.Agent(agentOptions);
  const httpsAgent = new https.Agent(agentOptions);
  const nodeFetchOptions = {
    agent(parsedURL) {
      return parsedURL.protocol === "http:" ? httpAgent : httpsAgent;
    }
  };
  return function nodeFetchWithKeepAlive(input, init) {
    return l(input, { ...nodeFetchOptions, ...init });
  };
}
const fetch = globalThis.fetch ? (...args) => globalThis.fetch(...args) : createNodeFetch();
const Headers$1 = globalThis.Headers || s$1;
const AbortController = globalThis.AbortController || i;
const ofetch = createFetch({ fetch, Headers: Headers$1, AbortController });
const $fetch = ofetch;

function wrapToPromise(value) {
  if (!value || typeof value.then !== "function") {
    return Promise.resolve(value);
  }
  return value;
}
function asyncCall(function_, ...arguments_) {
  try {
    return wrapToPromise(function_(...arguments_));
  } catch (error) {
    return Promise.reject(error);
  }
}
function isPrimitive(value) {
  const type = typeof value;
  return value === null || type !== "object" && type !== "function";
}
function isPureObject(value) {
  const proto = Object.getPrototypeOf(value);
  return !proto || proto.isPrototypeOf(Object);
}
function stringify(value) {
  if (isPrimitive(value)) {
    return String(value);
  }
  if (isPureObject(value) || Array.isArray(value)) {
    return JSON.stringify(value);
  }
  if (typeof value.toJSON === "function") {
    return stringify(value.toJSON());
  }
  throw new Error("[unstorage] Cannot stringify value!");
}
const BASE64_PREFIX = "base64:";
function serializeRaw(value) {
  if (typeof value === "string") {
    return value;
  }
  return BASE64_PREFIX + base64Encode(value);
}
function deserializeRaw(value) {
  if (typeof value !== "string") {
    return value;
  }
  if (!value.startsWith(BASE64_PREFIX)) {
    return value;
  }
  return base64Decode(value.slice(BASE64_PREFIX.length));
}
function base64Decode(input) {
  if (globalThis.Buffer) {
    return Buffer.from(input, "base64");
  }
  return Uint8Array.from(
    globalThis.atob(input),
    (c) => c.codePointAt(0)
  );
}
function base64Encode(input) {
  if (globalThis.Buffer) {
    return Buffer.from(input).toString("base64");
  }
  return globalThis.btoa(String.fromCodePoint(...input));
}

const storageKeyProperties = [
  "has",
  "hasItem",
  "get",
  "getItem",
  "getItemRaw",
  "set",
  "setItem",
  "setItemRaw",
  "del",
  "remove",
  "removeItem",
  "getMeta",
  "setMeta",
  "removeMeta",
  "getKeys",
  "clear",
  "mount",
  "unmount"
];
function prefixStorage(storage, base) {
  base = normalizeBaseKey(base);
  if (!base) {
    return storage;
  }
  const nsStorage = { ...storage };
  for (const property of storageKeyProperties) {
    nsStorage[property] = (key = "", ...args) => (
      // @ts-ignore
      storage[property](base + key, ...args)
    );
  }
  nsStorage.getKeys = (key = "", ...arguments_) => storage.getKeys(base + key, ...arguments_).then((keys) => keys.map((key2) => key2.slice(base.length)));
  nsStorage.keys = nsStorage.getKeys;
  nsStorage.getItems = async (items, commonOptions) => {
    const prefixedItems = items.map(
      (item) => typeof item === "string" ? base + item : { ...item, key: base + item.key }
    );
    const results = await storage.getItems(prefixedItems, commonOptions);
    return results.map((entry) => ({
      key: entry.key.slice(base.length),
      value: entry.value
    }));
  };
  nsStorage.setItems = async (items, commonOptions) => {
    const prefixedItems = items.map((item) => ({
      key: base + item.key,
      value: item.value,
      options: item.options
    }));
    return storage.setItems(prefixedItems, commonOptions);
  };
  return nsStorage;
}
function normalizeKey$1(key) {
  if (!key) {
    return "";
  }
  return key.split("?")[0]?.replace(/[/\\]/g, ":").replace(/:+/g, ":").replace(/^:|:$/g, "") || "";
}
function joinKeys(...keys) {
  return normalizeKey$1(keys.join(":"));
}
function normalizeBaseKey(base) {
  base = normalizeKey$1(base);
  return base ? base + ":" : "";
}
function filterKeyByDepth(key, depth) {
  if (depth === void 0) {
    return true;
  }
  let substrCount = 0;
  let index = key.indexOf(":");
  while (index > -1) {
    substrCount++;
    index = key.indexOf(":", index + 1);
  }
  return substrCount <= depth;
}
function filterKeyByBase(key, base) {
  if (base) {
    return key.startsWith(base) && key[key.length - 1] !== "$";
  }
  return key[key.length - 1] !== "$";
}

function defineDriver$1(factory) {
  return factory;
}

const DRIVER_NAME$1 = "memory";
const memory = defineDriver$1(() => {
  const data = /* @__PURE__ */ new Map();
  return {
    name: DRIVER_NAME$1,
    getInstance: () => data,
    hasItem(key) {
      return data.has(key);
    },
    getItem(key) {
      return data.get(key) ?? null;
    },
    getItemRaw(key) {
      return data.get(key) ?? null;
    },
    setItem(key, value) {
      data.set(key, value);
    },
    setItemRaw(key, value) {
      data.set(key, value);
    },
    removeItem(key) {
      data.delete(key);
    },
    getKeys() {
      return [...data.keys()];
    },
    clear() {
      data.clear();
    },
    dispose() {
      data.clear();
    }
  };
});

function createStorage(options = {}) {
  const context = {
    mounts: { "": options.driver || memory() },
    mountpoints: [""],
    watching: false,
    watchListeners: [],
    unwatch: {}
  };
  const getMount = (key) => {
    for (const base of context.mountpoints) {
      if (key.startsWith(base)) {
        return {
          base,
          relativeKey: key.slice(base.length),
          driver: context.mounts[base]
        };
      }
    }
    return {
      base: "",
      relativeKey: key,
      driver: context.mounts[""]
    };
  };
  const getMounts = (base, includeParent) => {
    return context.mountpoints.filter(
      (mountpoint) => mountpoint.startsWith(base) || includeParent && base.startsWith(mountpoint)
    ).map((mountpoint) => ({
      relativeBase: base.length > mountpoint.length ? base.slice(mountpoint.length) : void 0,
      mountpoint,
      driver: context.mounts[mountpoint]
    }));
  };
  const onChange = (event, key) => {
    if (!context.watching) {
      return;
    }
    key = normalizeKey$1(key);
    for (const listener of context.watchListeners) {
      listener(event, key);
    }
  };
  const startWatch = async () => {
    if (context.watching) {
      return;
    }
    context.watching = true;
    for (const mountpoint in context.mounts) {
      context.unwatch[mountpoint] = await watch(
        context.mounts[mountpoint],
        onChange,
        mountpoint
      );
    }
  };
  const stopWatch = async () => {
    if (!context.watching) {
      return;
    }
    for (const mountpoint in context.unwatch) {
      await context.unwatch[mountpoint]();
    }
    context.unwatch = {};
    context.watching = false;
  };
  const runBatch = (items, commonOptions, cb) => {
    const batches = /* @__PURE__ */ new Map();
    const getBatch = (mount) => {
      let batch = batches.get(mount.base);
      if (!batch) {
        batch = {
          driver: mount.driver,
          base: mount.base,
          items: []
        };
        batches.set(mount.base, batch);
      }
      return batch;
    };
    for (const item of items) {
      const isStringItem = typeof item === "string";
      const key = normalizeKey$1(isStringItem ? item : item.key);
      const value = isStringItem ? void 0 : item.value;
      const options2 = isStringItem || !item.options ? commonOptions : { ...commonOptions, ...item.options };
      const mount = getMount(key);
      getBatch(mount).items.push({
        key,
        value,
        relativeKey: mount.relativeKey,
        options: options2
      });
    }
    return Promise.all([...batches.values()].map((batch) => cb(batch))).then(
      (r) => r.flat()
    );
  };
  const storage = {
    // Item
    hasItem(key, opts = {}) {
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      return asyncCall(driver.hasItem, relativeKey, opts);
    },
    getItem(key, opts = {}) {
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      return asyncCall(driver.getItem, relativeKey, opts).then(
        (value) => destr(value)
      );
    },
    getItems(items, commonOptions = {}) {
      return runBatch(items, commonOptions, (batch) => {
        if (batch.driver.getItems) {
          return asyncCall(
            batch.driver.getItems,
            batch.items.map((item) => ({
              key: item.relativeKey,
              options: item.options
            })),
            commonOptions
          ).then(
            (r) => r.map((item) => ({
              key: joinKeys(batch.base, item.key),
              value: destr(item.value)
            }))
          );
        }
        return Promise.all(
          batch.items.map((item) => {
            return asyncCall(
              batch.driver.getItem,
              item.relativeKey,
              item.options
            ).then((value) => ({
              key: item.key,
              value: destr(value)
            }));
          })
        );
      });
    },
    getItemRaw(key, opts = {}) {
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      if (driver.getItemRaw) {
        return asyncCall(driver.getItemRaw, relativeKey, opts);
      }
      return asyncCall(driver.getItem, relativeKey, opts).then(
        (value) => deserializeRaw(value)
      );
    },
    async setItem(key, value, opts = {}) {
      if (value === void 0) {
        return storage.removeItem(key);
      }
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      if (!driver.setItem) {
        return;
      }
      await asyncCall(driver.setItem, relativeKey, stringify(value), opts);
      if (!driver.watch) {
        onChange("update", key);
      }
    },
    async setItems(items, commonOptions) {
      await runBatch(items, commonOptions, async (batch) => {
        if (batch.driver.setItems) {
          return asyncCall(
            batch.driver.setItems,
            batch.items.map((item) => ({
              key: item.relativeKey,
              value: stringify(item.value),
              options: item.options
            })),
            commonOptions
          );
        }
        if (!batch.driver.setItem) {
          return;
        }
        await Promise.all(
          batch.items.map((item) => {
            return asyncCall(
              batch.driver.setItem,
              item.relativeKey,
              stringify(item.value),
              item.options
            );
          })
        );
      });
    },
    async setItemRaw(key, value, opts = {}) {
      if (value === void 0) {
        return storage.removeItem(key, opts);
      }
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      if (driver.setItemRaw) {
        await asyncCall(driver.setItemRaw, relativeKey, value, opts);
      } else if (driver.setItem) {
        await asyncCall(driver.setItem, relativeKey, serializeRaw(value), opts);
      } else {
        return;
      }
      if (!driver.watch) {
        onChange("update", key);
      }
    },
    async removeItem(key, opts = {}) {
      if (typeof opts === "boolean") {
        opts = { removeMeta: opts };
      }
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      if (!driver.removeItem) {
        return;
      }
      await asyncCall(driver.removeItem, relativeKey, opts);
      if (opts.removeMeta || opts.removeMata) {
        await asyncCall(driver.removeItem, relativeKey + "$", opts);
      }
      if (!driver.watch) {
        onChange("remove", key);
      }
    },
    // Meta
    async getMeta(key, opts = {}) {
      if (typeof opts === "boolean") {
        opts = { nativeOnly: opts };
      }
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      const meta = /* @__PURE__ */ Object.create(null);
      if (driver.getMeta) {
        Object.assign(meta, await asyncCall(driver.getMeta, relativeKey, opts));
      }
      if (!opts.nativeOnly) {
        const value = await asyncCall(
          driver.getItem,
          relativeKey + "$",
          opts
        ).then((value_) => destr(value_));
        if (value && typeof value === "object") {
          if (typeof value.atime === "string") {
            value.atime = new Date(value.atime);
          }
          if (typeof value.mtime === "string") {
            value.mtime = new Date(value.mtime);
          }
          Object.assign(meta, value);
        }
      }
      return meta;
    },
    setMeta(key, value, opts = {}) {
      return this.setItem(key + "$", value, opts);
    },
    removeMeta(key, opts = {}) {
      return this.removeItem(key + "$", opts);
    },
    // Keys
    async getKeys(base, opts = {}) {
      base = normalizeBaseKey(base);
      const mounts = getMounts(base, true);
      let maskedMounts = [];
      const allKeys = [];
      let allMountsSupportMaxDepth = true;
      for (const mount of mounts) {
        if (!mount.driver.flags?.maxDepth) {
          allMountsSupportMaxDepth = false;
        }
        const rawKeys = await asyncCall(
          mount.driver.getKeys,
          mount.relativeBase,
          opts
        );
        for (const key of rawKeys) {
          const fullKey = mount.mountpoint + normalizeKey$1(key);
          if (!maskedMounts.some((p) => fullKey.startsWith(p))) {
            allKeys.push(fullKey);
          }
        }
        maskedMounts = [
          mount.mountpoint,
          ...maskedMounts.filter((p) => !p.startsWith(mount.mountpoint))
        ];
      }
      const shouldFilterByDepth = opts.maxDepth !== void 0 && !allMountsSupportMaxDepth;
      return allKeys.filter(
        (key) => (!shouldFilterByDepth || filterKeyByDepth(key, opts.maxDepth)) && filterKeyByBase(key, base)
      );
    },
    // Utils
    async clear(base, opts = {}) {
      base = normalizeBaseKey(base);
      await Promise.all(
        getMounts(base, false).map(async (m) => {
          if (m.driver.clear) {
            return asyncCall(m.driver.clear, m.relativeBase, opts);
          }
          if (m.driver.removeItem) {
            const keys = await m.driver.getKeys(m.relativeBase || "", opts);
            return Promise.all(
              keys.map((key) => m.driver.removeItem(key, opts))
            );
          }
        })
      );
    },
    async dispose() {
      await Promise.all(
        Object.values(context.mounts).map((driver) => dispose(driver))
      );
    },
    async watch(callback) {
      await startWatch();
      context.watchListeners.push(callback);
      return async () => {
        context.watchListeners = context.watchListeners.filter(
          (listener) => listener !== callback
        );
        if (context.watchListeners.length === 0) {
          await stopWatch();
        }
      };
    },
    async unwatch() {
      context.watchListeners = [];
      await stopWatch();
    },
    // Mount
    mount(base, driver) {
      base = normalizeBaseKey(base);
      if (base && context.mounts[base]) {
        throw new Error(`already mounted at ${base}`);
      }
      if (base) {
        context.mountpoints.push(base);
        context.mountpoints.sort((a, b) => b.length - a.length);
      }
      context.mounts[base] = driver;
      if (context.watching) {
        Promise.resolve(watch(driver, onChange, base)).then((unwatcher) => {
          context.unwatch[base] = unwatcher;
        }).catch(console.error);
      }
      return storage;
    },
    async unmount(base, _dispose = true) {
      base = normalizeBaseKey(base);
      if (!base || !context.mounts[base]) {
        return;
      }
      if (context.watching && base in context.unwatch) {
        context.unwatch[base]?.();
        delete context.unwatch[base];
      }
      if (_dispose) {
        await dispose(context.mounts[base]);
      }
      context.mountpoints = context.mountpoints.filter((key) => key !== base);
      delete context.mounts[base];
    },
    getMount(key = "") {
      key = normalizeKey$1(key) + ":";
      const m = getMount(key);
      return {
        driver: m.driver,
        base: m.base
      };
    },
    getMounts(base = "", opts = {}) {
      base = normalizeKey$1(base);
      const mounts = getMounts(base, opts.parents);
      return mounts.map((m) => ({
        driver: m.driver,
        base: m.mountpoint
      }));
    },
    // Aliases
    keys: (base, opts = {}) => storage.getKeys(base, opts),
    get: (key, opts = {}) => storage.getItem(key, opts),
    set: (key, value, opts = {}) => storage.setItem(key, value, opts),
    has: (key, opts = {}) => storage.hasItem(key, opts),
    del: (key, opts = {}) => storage.removeItem(key, opts),
    remove: (key, opts = {}) => storage.removeItem(key, opts)
  };
  return storage;
}
function watch(driver, onChange, base) {
  return driver.watch ? driver.watch((event, key) => onChange(event, base + key)) : () => {
  };
}
async function dispose(driver) {
  if (typeof driver.dispose === "function") {
    await asyncCall(driver.dispose);
  }
}

const _assets = {

};

const normalizeKey = function normalizeKey(key) {
  if (!key) {
    return "";
  }
  return key.split("?")[0]?.replace(/[/\\]/g, ":").replace(/:+/g, ":").replace(/^:|:$/g, "") || "";
};

const assets$1 = {
  getKeys() {
    return Promise.resolve(Object.keys(_assets))
  },
  hasItem (id) {
    id = normalizeKey(id);
    return Promise.resolve(id in _assets)
  },
  getItem (id) {
    id = normalizeKey(id);
    return Promise.resolve(_assets[id] ? _assets[id].import() : null)
  },
  getMeta (id) {
    id = normalizeKey(id);
    return Promise.resolve(_assets[id] ? _assets[id].meta : {})
  }
};

function defineDriver(factory) {
  return factory;
}
function createError(driver, message, opts) {
  const err = new Error(`[unstorage] [${driver}] ${message}`, opts);
  if (Error.captureStackTrace) {
    Error.captureStackTrace(err, createError);
  }
  return err;
}
function createRequiredError(driver, name) {
  if (Array.isArray(name)) {
    return createError(
      driver,
      `Missing some of the required options ${name.map((n) => "`" + n + "`").join(", ")}`
    );
  }
  return createError(driver, `Missing required option \`${name}\`.`);
}

function ignoreNotfound(err) {
  return err.code === "ENOENT" || err.code === "EISDIR" ? null : err;
}
function ignoreExists(err) {
  return err.code === "EEXIST" ? null : err;
}
async function writeFile(path, data, encoding) {
  await ensuredir(dirname$1(path));
  return promises.writeFile(path, data, encoding);
}
function readFile(path, encoding) {
  return promises.readFile(path, encoding).catch(ignoreNotfound);
}
function unlink(path) {
  return promises.unlink(path).catch(ignoreNotfound);
}
function readdir(dir) {
  return promises.readdir(dir, { withFileTypes: true }).catch(ignoreNotfound).then((r) => r || []);
}
async function ensuredir(dir) {
  if (existsSync(dir)) {
    return;
  }
  await ensuredir(dirname$1(dir)).catch(ignoreExists);
  await promises.mkdir(dir).catch(ignoreExists);
}
async function readdirRecursive(dir, ignore, maxDepth) {
  if (ignore && ignore(dir)) {
    return [];
  }
  const entries = await readdir(dir);
  const files = [];
  await Promise.all(
    entries.map(async (entry) => {
      const entryPath = resolve$1(dir, entry.name);
      if (entry.isDirectory()) {
        if (maxDepth === void 0 || maxDepth > 0) {
          const dirFiles = await readdirRecursive(
            entryPath,
            ignore,
            maxDepth === void 0 ? void 0 : maxDepth - 1
          );
          files.push(...dirFiles.map((f) => entry.name + "/" + f));
        }
      } else {
        if (!(ignore && ignore(entry.name))) {
          files.push(entry.name);
        }
      }
    })
  );
  return files;
}
async function rmRecursive(dir) {
  const entries = await readdir(dir);
  await Promise.all(
    entries.map((entry) => {
      const entryPath = resolve$1(dir, entry.name);
      if (entry.isDirectory()) {
        return rmRecursive(entryPath).then(() => promises.rmdir(entryPath));
      } else {
        return promises.unlink(entryPath);
      }
    })
  );
}

const PATH_TRAVERSE_RE = /\.\.:|\.\.$/;
const DRIVER_NAME = "fs-lite";
const unstorage_47drivers_47fs_45lite = defineDriver((opts = {}) => {
  if (!opts.base) {
    throw createRequiredError(DRIVER_NAME, "base");
  }
  opts.base = resolve$1(opts.base);
  const r = (key) => {
    if (PATH_TRAVERSE_RE.test(key)) {
      throw createError(
        DRIVER_NAME,
        `Invalid key: ${JSON.stringify(key)}. It should not contain .. segments`
      );
    }
    const resolved = join(opts.base, key.replace(/:/g, "/"));
    return resolved;
  };
  return {
    name: DRIVER_NAME,
    options: opts,
    flags: {
      maxDepth: true
    },
    hasItem(key) {
      return existsSync(r(key));
    },
    getItem(key) {
      return readFile(r(key), "utf8");
    },
    getItemRaw(key) {
      return readFile(r(key));
    },
    async getMeta(key) {
      const { atime, mtime, size, birthtime, ctime } = await promises.stat(r(key)).catch(() => ({}));
      return { atime, mtime, size, birthtime, ctime };
    },
    setItem(key, value) {
      if (opts.readOnly) {
        return;
      }
      return writeFile(r(key), value, "utf8");
    },
    setItemRaw(key, value) {
      if (opts.readOnly) {
        return;
      }
      return writeFile(r(key), value);
    },
    removeItem(key) {
      if (opts.readOnly) {
        return;
      }
      return unlink(r(key));
    },
    getKeys(_base, topts) {
      return readdirRecursive(r("."), opts.ignore, topts?.maxDepth);
    },
    async clear() {
      if (opts.readOnly || opts.noClear) {
        return;
      }
      await rmRecursive(r("."));
    }
  };
});

const storage = createStorage({});

storage.mount('/assets', assets$1);

storage.mount('data', unstorage_47drivers_47fs_45lite({"driver":"fsLite","base":"./.data/kv"}));

function useStorage(base = "") {
  return base ? prefixStorage(storage, base) : storage;
}

function serialize$1(o){return typeof o=="string"?`'${o}'`:new c().serialize(o)}const c=/*@__PURE__*/function(){class o{#t=new Map;compare(t,r){const e=typeof t,n=typeof r;return e==="string"&&n==="string"?t.localeCompare(r):e==="number"&&n==="number"?t-r:String.prototype.localeCompare.call(this.serialize(t,true),this.serialize(r,true))}serialize(t,r){if(t===null)return "null";switch(typeof t){case "string":return r?t:`'${t}'`;case "bigint":return `${t}n`;case "object":return this.$object(t);case "function":return this.$function(t)}return String(t)}serializeObject(t){const r=Object.prototype.toString.call(t);if(r!=="[object Object]")return this.serializeBuiltInType(r.length<10?`unknown:${r}`:r.slice(8,-1),t);const e=t.constructor,n=e===Object||e===void 0?"":e.name;if(n!==""&&globalThis[n]===e)return this.serializeBuiltInType(n,t);if(typeof t.toJSON=="function"){const i=t.toJSON();return n+(i!==null&&typeof i=="object"?this.$object(i):`(${this.serialize(i)})`)}return this.serializeObjectEntries(n,Object.entries(t))}serializeBuiltInType(t,r){const e=this["$"+t];if(e)return e.call(this,r);if(typeof r?.entries=="function")return this.serializeObjectEntries(t,r.entries());throw new Error(`Cannot serialize ${t}`)}serializeObjectEntries(t,r){const e=Array.from(r).sort((i,a)=>this.compare(i[0],a[0]));let n=`${t}{`;for(let i=0;i<e.length;i++){const[a,l]=e[i];n+=`${this.serialize(a,true)}:${this.serialize(l)}`,i<e.length-1&&(n+=",");}return n+"}"}$object(t){let r=this.#t.get(t);return r===void 0&&(this.#t.set(t,`#${this.#t.size}`),r=this.serializeObject(t),this.#t.set(t,r)),r}$function(t){const r=Function.prototype.toString.call(t);return r.slice(-15)==="[native code] }"?`${t.name||""}()[native]`:`${t.name}(${t.length})${r.replace(/\s*\n\s*/g,"")}`}$Array(t){let r="[";for(let e=0;e<t.length;e++)r+=this.serialize(t[e]),e<t.length-1&&(r+=",");return r+"]"}$Date(t){try{return `Date(${t.toISOString()})`}catch{return "Date(null)"}}$ArrayBuffer(t){return `ArrayBuffer[${new Uint8Array(t).join(",")}]`}$Set(t){return `Set${this.$Array(Array.from(t).sort((r,e)=>this.compare(r,e)))}`}$Map(t){return this.serializeObjectEntries("Map",t.entries())}}for(const s of ["Error","RegExp","URL"])o.prototype["$"+s]=function(t){return `${s}(${t})`};for(const s of ["Int8Array","Uint8Array","Uint8ClampedArray","Int16Array","Uint16Array","Int32Array","Uint32Array","Float32Array","Float64Array"])o.prototype["$"+s]=function(t){return `${s}[${t.join(",")}]`};for(const s of ["BigInt64Array","BigUint64Array"])o.prototype["$"+s]=function(t){return `${s}[${t.join("n,")}${t.length>0?"n":""}]`};return o}();

function isEqual(object1, object2) {
  if (object1 === object2) {
    return true;
  }
  if (serialize$1(object1) === serialize$1(object2)) {
    return true;
  }
  return false;
}

const e=globalThis.process?.getBuiltinModule?.("crypto")?.hash,r="sha256",s="base64url";function digest(t){if(e)return e(r,t,s);const o=createHash(r).update(t);return globalThis.process?.versions?.webcontainer?o.digest().toString(s):o.digest(s)}

const Hasher = /* @__PURE__ */ (() => {
  class Hasher2 {
    buff = "";
    #context = /* @__PURE__ */ new Map();
    write(str) {
      this.buff += str;
    }
    dispatch(value) {
      const type = value === null ? "null" : typeof value;
      return this[type](value);
    }
    object(object) {
      if (object && typeof object.toJSON === "function") {
        return this.object(object.toJSON());
      }
      const objString = Object.prototype.toString.call(object);
      let objType = "";
      const objectLength = objString.length;
      objType = objectLength < 10 ? "unknown:[" + objString + "]" : objString.slice(8, objectLength - 1);
      objType = objType.toLowerCase();
      let objectNumber = null;
      if ((objectNumber = this.#context.get(object)) === void 0) {
        this.#context.set(object, this.#context.size);
      } else {
        return this.dispatch("[CIRCULAR:" + objectNumber + "]");
      }
      if (typeof Buffer !== "undefined" && Buffer.isBuffer && Buffer.isBuffer(object)) {
        this.write("buffer:");
        return this.write(object.toString("utf8"));
      }
      if (objType !== "object" && objType !== "function" && objType !== "asyncfunction") {
        if (this[objType]) {
          this[objType](object);
        } else {
          this.unknown(object, objType);
        }
      } else {
        const keys = Object.keys(object).sort();
        const extraKeys = [];
        this.write("object:" + (keys.length + extraKeys.length) + ":");
        const dispatchForKey = (key) => {
          this.dispatch(key);
          this.write(":");
          this.dispatch(object[key]);
          this.write(",");
        };
        for (const key of keys) {
          dispatchForKey(key);
        }
        for (const key of extraKeys) {
          dispatchForKey(key);
        }
      }
    }
    array(arr, unordered) {
      unordered = unordered === void 0 ? false : unordered;
      this.write("array:" + arr.length + ":");
      if (!unordered || arr.length <= 1) {
        for (const entry of arr) {
          this.dispatch(entry);
        }
        return;
      }
      const contextAdditions = /* @__PURE__ */ new Map();
      const entries = arr.map((entry) => {
        const hasher = new Hasher2();
        hasher.dispatch(entry);
        for (const [key, value] of hasher.#context) {
          contextAdditions.set(key, value);
        }
        return hasher.toString();
      });
      this.#context = contextAdditions;
      entries.sort();
      return this.array(entries, false);
    }
    date(date) {
      return this.write("date:" + date.toJSON());
    }
    symbol(sym) {
      return this.write("symbol:" + sym.toString());
    }
    unknown(value, type) {
      this.write(type);
      if (!value) {
        return;
      }
      this.write(":");
      if (value && typeof value.entries === "function") {
        return this.array(
          [...value.entries()],
          true
          /* ordered */
        );
      }
    }
    error(err) {
      return this.write("error:" + err.toString());
    }
    boolean(bool) {
      return this.write("bool:" + bool);
    }
    string(string) {
      this.write("string:" + string.length + ":");
      this.write(string);
    }
    function(fn) {
      this.write("fn:");
      if (isNativeFunction(fn)) {
        this.dispatch("[native]");
      } else {
        this.dispatch(fn.toString());
      }
    }
    number(number) {
      return this.write("number:" + number);
    }
    null() {
      return this.write("Null");
    }
    undefined() {
      return this.write("Undefined");
    }
    regexp(regex) {
      return this.write("regex:" + regex.toString());
    }
    arraybuffer(arr) {
      this.write("arraybuffer:");
      return this.dispatch(new Uint8Array(arr));
    }
    url(url) {
      return this.write("url:" + url.toString());
    }
    map(map) {
      this.write("map:");
      const arr = [...map];
      return this.array(arr, false);
    }
    set(set) {
      this.write("set:");
      const arr = [...set];
      return this.array(arr, false);
    }
    bigint(number) {
      return this.write("bigint:" + number.toString());
    }
  }
  for (const type of [
    "uint8array",
    "uint8clampedarray",
    "unt8array",
    "uint16array",
    "unt16array",
    "uint32array",
    "unt32array",
    "float32array",
    "float64array"
  ]) {
    Hasher2.prototype[type] = function(arr) {
      this.write(type + ":");
      return this.array([...arr], false);
    };
  }
  function isNativeFunction(f) {
    if (typeof f !== "function") {
      return false;
    }
    return Function.prototype.toString.call(f).slice(
      -15
      /* "[native code] }".length */
    ) === "[native code] }";
  }
  return Hasher2;
})();
function serialize(object) {
  const hasher = new Hasher();
  hasher.dispatch(object);
  return hasher.buff;
}
function hash(value) {
  return digest(typeof value === "string" ? value : serialize(value)).replace(/[-_]/g, "").slice(0, 10);
}

function defaultCacheOptions() {
  return {
    name: "_",
    base: "/cache",
    swr: true,
    maxAge: 1
  };
}
function defineCachedFunction(fn, opts = {}) {
  opts = { ...defaultCacheOptions(), ...opts };
  const pending = {};
  const group = opts.group || "nitro/functions";
  const name = opts.name || fn.name || "_";
  const integrity = opts.integrity || hash([fn, opts]);
  const validate = opts.validate || ((entry) => entry.value !== void 0);
  async function get(key, resolver, shouldInvalidateCache, event) {
    const cacheKey = [opts.base, group, name, key + ".json"].filter(Boolean).join(":").replace(/:\/$/, ":index");
    let entry = await useStorage().getItem(cacheKey).catch((error) => {
      console.error(`[cache] Cache read error.`, error);
      useNitroApp().captureError(error, { event, tags: ["cache"] });
    }) || {};
    if (typeof entry !== "object") {
      entry = {};
      const error = new Error("Malformed data read from cache.");
      console.error("[cache]", error);
      useNitroApp().captureError(error, { event, tags: ["cache"] });
    }
    const ttl = (opts.maxAge ?? 0) * 1e3;
    if (ttl) {
      entry.expires = Date.now() + ttl;
    }
    const expired = shouldInvalidateCache || entry.integrity !== integrity || ttl && Date.now() - (entry.mtime || 0) > ttl || validate(entry) === false;
    const _resolve = async () => {
      const isPending = pending[key];
      if (!isPending) {
        if (entry.value !== void 0 && (opts.staleMaxAge || 0) >= 0 && opts.swr === false) {
          entry.value = void 0;
          entry.integrity = void 0;
          entry.mtime = void 0;
          entry.expires = void 0;
        }
        pending[key] = Promise.resolve(resolver());
      }
      try {
        entry.value = await pending[key];
      } catch (error) {
        if (!isPending) {
          delete pending[key];
        }
        throw error;
      }
      if (!isPending) {
        entry.mtime = Date.now();
        entry.integrity = integrity;
        delete pending[key];
        if (validate(entry) !== false) {
          let setOpts;
          if (opts.maxAge && !opts.swr) {
            setOpts = { ttl: opts.maxAge };
          }
          const promise = useStorage().setItem(cacheKey, entry, setOpts).catch((error) => {
            console.error(`[cache] Cache write error.`, error);
            useNitroApp().captureError(error, { event, tags: ["cache"] });
          });
          if (event?.waitUntil) {
            event.waitUntil(promise);
          }
        }
      }
    };
    const _resolvePromise = expired ? _resolve() : Promise.resolve();
    if (entry.value === void 0) {
      await _resolvePromise;
    } else if (expired && event && event.waitUntil) {
      event.waitUntil(_resolvePromise);
    }
    if (opts.swr && validate(entry) !== false) {
      _resolvePromise.catch((error) => {
        console.error(`[cache] SWR handler error.`, error);
        useNitroApp().captureError(error, { event, tags: ["cache"] });
      });
      return entry;
    }
    return _resolvePromise.then(() => entry);
  }
  return async (...args) => {
    const shouldBypassCache = await opts.shouldBypassCache?.(...args);
    if (shouldBypassCache) {
      return fn(...args);
    }
    const key = await (opts.getKey || getKey)(...args);
    const shouldInvalidateCache = await opts.shouldInvalidateCache?.(...args);
    const entry = await get(
      key,
      () => fn(...args),
      shouldInvalidateCache,
      args[0] && isEvent(args[0]) ? args[0] : void 0
    );
    let value = entry.value;
    if (opts.transform) {
      value = await opts.transform(entry, ...args) || value;
    }
    return value;
  };
}
function cachedFunction(fn, opts = {}) {
  return defineCachedFunction(fn, opts);
}
function getKey(...args) {
  return args.length > 0 ? hash(args) : "";
}
function escapeKey(key) {
  return String(key).replace(/\W/g, "");
}
function defineCachedEventHandler(handler, opts = defaultCacheOptions()) {
  const variableHeaderNames = (opts.varies || []).filter(Boolean).map((h) => h.toLowerCase()).sort();
  const _opts = {
    ...opts,
    getKey: async (event) => {
      const customKey = await opts.getKey?.(event);
      if (customKey) {
        return escapeKey(customKey);
      }
      const _path = event.node.req.originalUrl || event.node.req.url || event.path;
      let _pathname;
      try {
        _pathname = escapeKey(decodeURI(parseURL(_path).pathname)).slice(0, 16) || "index";
      } catch {
        _pathname = "-";
      }
      const _hashedPath = `${_pathname}.${hash(_path)}`;
      const _headers = variableHeaderNames.map((header) => [header, event.node.req.headers[header]]).map(([name, value]) => `${escapeKey(name)}.${hash(value)}`);
      return [_hashedPath, ..._headers].join(":");
    },
    validate: (entry) => {
      if (!entry.value) {
        return false;
      }
      if (entry.value.code >= 400) {
        return false;
      }
      if (entry.value.body === void 0) {
        return false;
      }
      if (entry.value.headers.etag === "undefined" || entry.value.headers["last-modified"] === "undefined") {
        return false;
      }
      return true;
    },
    group: opts.group || "nitro/handlers",
    integrity: opts.integrity || hash([handler, opts])
  };
  const _cachedHandler = cachedFunction(
    async (incomingEvent) => {
      const variableHeaders = {};
      for (const header of variableHeaderNames) {
        const value = incomingEvent.node.req.headers[header];
        if (value !== void 0) {
          variableHeaders[header] = value;
        }
      }
      const reqProxy = cloneWithProxy(incomingEvent.node.req, {
        headers: variableHeaders
      });
      const resHeaders = {};
      let _resSendBody;
      const resProxy = cloneWithProxy(incomingEvent.node.res, {
        statusCode: 200,
        writableEnded: false,
        writableFinished: false,
        headersSent: false,
        closed: false,
        getHeader(name) {
          return resHeaders[name];
        },
        setHeader(name, value) {
          resHeaders[name] = value;
          return this;
        },
        getHeaderNames() {
          return Object.keys(resHeaders);
        },
        hasHeader(name) {
          return name in resHeaders;
        },
        removeHeader(name) {
          delete resHeaders[name];
        },
        getHeaders() {
          return resHeaders;
        },
        end(chunk, arg2, arg3) {
          if (typeof chunk === "string") {
            _resSendBody = chunk;
          }
          if (typeof arg2 === "function") {
            arg2();
          }
          if (typeof arg3 === "function") {
            arg3();
          }
          return this;
        },
        write(chunk, arg2, arg3) {
          if (typeof chunk === "string") {
            _resSendBody = chunk;
          }
          if (typeof arg2 === "function") {
            arg2(void 0);
          }
          if (typeof arg3 === "function") {
            arg3();
          }
          return true;
        },
        writeHead(statusCode, headers2) {
          this.statusCode = statusCode;
          if (headers2) {
            if (Array.isArray(headers2) || typeof headers2 === "string") {
              throw new TypeError("Raw headers  is not supported.");
            }
            for (const header in headers2) {
              const value = headers2[header];
              if (value !== void 0) {
                this.setHeader(
                  header,
                  value
                );
              }
            }
          }
          return this;
        }
      });
      const event = createEvent(reqProxy, resProxy);
      event.fetch = (url, fetchOptions) => fetchWithEvent(event, url, fetchOptions, {
        fetch: useNitroApp().localFetch
      });
      event.$fetch = (url, fetchOptions) => fetchWithEvent(event, url, fetchOptions, {
        fetch: globalThis.$fetch
      });
      event.waitUntil = incomingEvent.waitUntil;
      event.context = incomingEvent.context;
      event.context.cache = {
        options: _opts
      };
      const body = await handler(event) || _resSendBody;
      const headers = event.node.res.getHeaders();
      headers.etag = String(
        headers.Etag || headers.etag || `W/"${hash(body)}"`
      );
      headers["last-modified"] = String(
        headers["Last-Modified"] || headers["last-modified"] || (/* @__PURE__ */ new Date()).toUTCString()
      );
      const cacheControl = [];
      if (opts.swr) {
        if (opts.maxAge) {
          cacheControl.push(`s-maxage=${opts.maxAge}`);
        }
        if (opts.staleMaxAge) {
          cacheControl.push(`stale-while-revalidate=${opts.staleMaxAge}`);
        } else {
          cacheControl.push("stale-while-revalidate");
        }
      } else if (opts.maxAge) {
        cacheControl.push(`max-age=${opts.maxAge}`);
      }
      if (cacheControl.length > 0) {
        headers["cache-control"] = cacheControl.join(", ");
      }
      const cacheEntry = {
        code: event.node.res.statusCode,
        headers,
        body
      };
      return cacheEntry;
    },
    _opts
  );
  return defineEventHandler(async (event) => {
    if (opts.headersOnly) {
      if (handleCacheHeaders(event, { maxAge: opts.maxAge })) {
        return;
      }
      return handler(event);
    }
    const response = await _cachedHandler(
      event
    );
    if (event.node.res.headersSent || event.node.res.writableEnded) {
      return response.body;
    }
    if (handleCacheHeaders(event, {
      modifiedTime: new Date(response.headers["last-modified"]),
      etag: response.headers.etag,
      maxAge: opts.maxAge
    })) {
      return;
    }
    event.node.res.statusCode = response.code;
    for (const name in response.headers) {
      const value = response.headers[name];
      if (name === "set-cookie") {
        event.node.res.appendHeader(
          name,
          splitCookiesString(value)
        );
      } else {
        if (value !== void 0) {
          event.node.res.setHeader(name, value);
        }
      }
    }
    return response.body;
  });
}
function cloneWithProxy(obj, overrides) {
  return new Proxy(obj, {
    get(target, property, receiver) {
      if (property in overrides) {
        return overrides[property];
      }
      return Reflect.get(target, property, receiver);
    },
    set(target, property, value, receiver) {
      if (property in overrides) {
        overrides[property] = value;
        return true;
      }
      return Reflect.set(target, property, value, receiver);
    }
  });
}
const cachedEventHandler = defineCachedEventHandler;

function klona(x) {
	if (typeof x !== 'object') return x;

	var k, tmp, str=Object.prototype.toString.call(x);

	if (str === '[object Object]') {
		if (x.constructor !== Object && typeof x.constructor === 'function') {
			tmp = new x.constructor();
			for (k in x) {
				if (x.hasOwnProperty(k) && tmp[k] !== x[k]) {
					tmp[k] = klona(x[k]);
				}
			}
		} else {
			tmp = {}; // null
			for (k in x) {
				if (k === '__proto__') {
					Object.defineProperty(tmp, k, {
						value: klona(x[k]),
						configurable: true,
						enumerable: true,
						writable: true,
					});
				} else {
					tmp[k] = klona(x[k]);
				}
			}
		}
		return tmp;
	}

	if (str === '[object Array]') {
		k = x.length;
		for (tmp=Array(k); k--;) {
			tmp[k] = klona(x[k]);
		}
		return tmp;
	}

	if (str === '[object Set]') {
		tmp = new Set;
		x.forEach(function (val) {
			tmp.add(klona(val));
		});
		return tmp;
	}

	if (str === '[object Map]') {
		tmp = new Map;
		x.forEach(function (val, key) {
			tmp.set(klona(key), klona(val));
		});
		return tmp;
	}

	if (str === '[object Date]') {
		return new Date(+x);
	}

	if (str === '[object RegExp]') {
		tmp = new RegExp(x.source, x.flags);
		tmp.lastIndex = x.lastIndex;
		return tmp;
	}

	if (str === '[object DataView]') {
		return new x.constructor( klona(x.buffer) );
	}

	if (str === '[object ArrayBuffer]') {
		return x.slice(0);
	}

	// ArrayBuffer.isView(x)
	// ~> `new` bcuz `Buffer.slice` => ref
	if (str.slice(-6) === 'Array]') {
		return new x.constructor(x);
	}

	return x;
}

const inlineAppConfig = {
  "nuxt": {}
};



const appConfig = defuFn(inlineAppConfig);

const NUMBER_CHAR_RE = /\d/;
const STR_SPLITTERS = ["-", "_", "/", "."];
function isUppercase(char = "") {
  if (NUMBER_CHAR_RE.test(char)) {
    return void 0;
  }
  return char !== char.toLowerCase();
}
function splitByCase(str, separators) {
  const splitters = STR_SPLITTERS;
  const parts = [];
  if (!str || typeof str !== "string") {
    return parts;
  }
  let buff = "";
  let previousUpper;
  let previousSplitter;
  for (const char of str) {
    const isSplitter = splitters.includes(char);
    if (isSplitter === true) {
      parts.push(buff);
      buff = "";
      previousUpper = void 0;
      continue;
    }
    const isUpper = isUppercase(char);
    if (previousSplitter === false) {
      if (previousUpper === false && isUpper === true) {
        parts.push(buff);
        buff = char;
        previousUpper = isUpper;
        continue;
      }
      if (previousUpper === true && isUpper === false && buff.length > 1) {
        const lastChar = buff.at(-1);
        parts.push(buff.slice(0, Math.max(0, buff.length - 1)));
        buff = lastChar + char;
        previousUpper = isUpper;
        continue;
      }
    }
    buff += char;
    previousUpper = isUpper;
    previousSplitter = isSplitter;
  }
  parts.push(buff);
  return parts;
}
function kebabCase(str, joiner) {
  return str ? (Array.isArray(str) ? str : splitByCase(str)).map((p) => p.toLowerCase()).join(joiner) : "";
}
function snakeCase(str) {
  return kebabCase(str || "", "_");
}

function getEnv(key, opts) {
  const envKey = snakeCase(key).toUpperCase();
  return destr(
    process.env[opts.prefix + envKey] ?? process.env[opts.altPrefix + envKey]
  );
}
function _isObject(input) {
  return typeof input === "object" && !Array.isArray(input);
}
function applyEnv(obj, opts, parentKey = "") {
  for (const key in obj) {
    const subKey = parentKey ? `${parentKey}_${key}` : key;
    const envValue = getEnv(subKey, opts);
    if (_isObject(obj[key])) {
      if (_isObject(envValue)) {
        obj[key] = { ...obj[key], ...envValue };
        applyEnv(obj[key], opts, subKey);
      } else if (envValue === void 0) {
        applyEnv(obj[key], opts, subKey);
      } else {
        obj[key] = envValue ?? obj[key];
      }
    } else {
      obj[key] = envValue ?? obj[key];
    }
    if (opts.envExpansion && typeof obj[key] === "string") {
      obj[key] = _expandFromEnv(obj[key]);
    }
  }
  return obj;
}
const envExpandRx = /\{\{([^{}]*)\}\}/g;
function _expandFromEnv(value) {
  return value.replace(envExpandRx, (match, key) => {
    return process.env[key] || match;
  });
}

const _inlineRuntimeConfig = {
  "app": {
    "baseURL": "/",
    "buildId": "59e17b1a-3e09-424d-a5d5-3101d0535fe4",
    "buildAssetsDir": "/_nuxt/",
    "cdnURL": ""
  },
  "nitro": {
    "envPrefix": "NUXT_",
    "routeRules": {
      "/__nuxt_error": {
        "cache": false
      },
      "/_nuxt/**": {
        "headers": {
          "cache-control": "public, max-age=31536000, immutable"
        }
      }
    }
  },
  "public": {
    "baseURL": "",
    "browserBaseURL": "",
    "cfSiteKey": "",
    "gaMeasurementId": "",
    "browseOnlyMode": true,
    "gtag": {
      "enabled": true,
      "initMode": "auto",
      "id": "",
      "initCommands": [],
      "config": {},
      "tags": [],
      "loadingStrategy": "defer",
      "url": "https://www.googletagmanager.com/gtag/js"
    }
  },
  "jwtSecret": "",
  "sendGridApiKey": "",
  "mongooseUri": "mongodb://localhost:27017/effectindex"
};
const envOptions = {
  prefix: "NITRO_",
  altPrefix: _inlineRuntimeConfig.nitro.envPrefix ?? process.env.NITRO_ENV_PREFIX ?? "_",
  envExpansion: _inlineRuntimeConfig.nitro.envExpansion ?? process.env.NITRO_ENV_EXPANSION ?? false
};
const _sharedRuntimeConfig = _deepFreeze(
  applyEnv(klona(_inlineRuntimeConfig), envOptions)
);
function useRuntimeConfig(event) {
  if (!event) {
    return _sharedRuntimeConfig;
  }
  if (event.context.nitro.runtimeConfig) {
    return event.context.nitro.runtimeConfig;
  }
  const runtimeConfig = klona(_inlineRuntimeConfig);
  applyEnv(runtimeConfig, envOptions);
  event.context.nitro.runtimeConfig = runtimeConfig;
  return runtimeConfig;
}
_deepFreeze(klona(appConfig));
function _deepFreeze(object) {
  const propNames = Object.getOwnPropertyNames(object);
  for (const name of propNames) {
    const value = object[name];
    if (value && typeof value === "object") {
      _deepFreeze(value);
    }
  }
  return Object.freeze(object);
}
new Proxy(/* @__PURE__ */ Object.create(null), {
  get: (_, prop) => {
    console.warn(
      "Please use `useRuntimeConfig()` instead of accessing config directly."
    );
    const runtimeConfig = useRuntimeConfig();
    if (prop in runtimeConfig) {
      return runtimeConfig[prop];
    }
    return void 0;
  }
});

function createContext(opts = {}) {
  let currentInstance;
  let isSingleton = false;
  const checkConflict = (instance) => {
    if (currentInstance && currentInstance !== instance) {
      throw new Error("Context conflict");
    }
  };
  let als;
  if (opts.asyncContext) {
    const _AsyncLocalStorage = opts.AsyncLocalStorage || globalThis.AsyncLocalStorage;
    if (_AsyncLocalStorage) {
      als = new _AsyncLocalStorage();
    } else {
      console.warn("[unctx] `AsyncLocalStorage` is not provided.");
    }
  }
  const _getCurrentInstance = () => {
    if (als) {
      const instance = als.getStore();
      if (instance !== void 0) {
        return instance;
      }
    }
    return currentInstance;
  };
  return {
    use: () => {
      const _instance = _getCurrentInstance();
      if (_instance === void 0) {
        throw new Error("Context is not available");
      }
      return _instance;
    },
    tryUse: () => {
      return _getCurrentInstance();
    },
    set: (instance, replace) => {
      if (!replace) {
        checkConflict(instance);
      }
      currentInstance = instance;
      isSingleton = true;
    },
    unset: () => {
      currentInstance = void 0;
      isSingleton = false;
    },
    call: (instance, callback) => {
      checkConflict(instance);
      currentInstance = instance;
      try {
        return als ? als.run(instance, callback) : callback();
      } finally {
        if (!isSingleton) {
          currentInstance = void 0;
        }
      }
    },
    async callAsync(instance, callback) {
      currentInstance = instance;
      const onRestore = () => {
        currentInstance = instance;
      };
      const onLeave = () => currentInstance === instance ? onRestore : void 0;
      asyncHandlers.add(onLeave);
      try {
        const r = als ? als.run(instance, callback) : callback();
        if (!isSingleton) {
          currentInstance = void 0;
        }
        return await r;
      } finally {
        asyncHandlers.delete(onLeave);
      }
    }
  };
}
function createNamespace(defaultOpts = {}) {
  const contexts = {};
  return {
    get(key, opts = {}) {
      if (!contexts[key]) {
        contexts[key] = createContext({ ...defaultOpts, ...opts });
      }
      return contexts[key];
    }
  };
}
const _globalThis = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof global !== "undefined" ? global : {};
const globalKey = "__unctx__";
const defaultNamespace = _globalThis[globalKey] || (_globalThis[globalKey] = createNamespace());
const getContext = (key, opts = {}) => defaultNamespace.get(key, opts);
const asyncHandlersKey = "__unctx_async_handlers__";
const asyncHandlers = _globalThis[asyncHandlersKey] || (_globalThis[asyncHandlersKey] = /* @__PURE__ */ new Set());
function executeAsync(function_) {
  const restores = [];
  for (const leaveHandler of asyncHandlers) {
    const restore2 = leaveHandler();
    if (restore2) {
      restores.push(restore2);
    }
  }
  const restore = () => {
    for (const restore2 of restores) {
      restore2();
    }
  };
  let awaitable = function_();
  if (awaitable && typeof awaitable === "object" && "catch" in awaitable) {
    awaitable = awaitable.catch((error) => {
      restore();
      throw error;
    });
  }
  return [awaitable, restore];
}

getContext("nitro-app", {
  asyncContext: false,
  AsyncLocalStorage: void 0
});

const config = useRuntimeConfig();
const _routeRulesMatcher = toRouteMatcher(
  createRouter$1({ routes: config.nitro.routeRules })
);
function createRouteRulesHandler(ctx) {
  return eventHandler((event) => {
    const routeRules = getRouteRules(event);
    if (routeRules.headers) {
      setHeaders(event, routeRules.headers);
    }
    if (routeRules.redirect) {
      let target = routeRules.redirect.to;
      if (target.endsWith("/**")) {
        let targetPath = event.path;
        const strpBase = routeRules.redirect._redirectStripBase;
        if (strpBase) {
          targetPath = withoutBase(targetPath, strpBase);
        }
        target = joinURL(target.slice(0, -3), targetPath);
      } else if (event.path.includes("?")) {
        const query = getQuery$1(event.path);
        target = withQuery(target, query);
      }
      return sendRedirect(event, target, routeRules.redirect.statusCode);
    }
    if (routeRules.proxy) {
      let target = routeRules.proxy.to;
      if (target.endsWith("/**")) {
        let targetPath = event.path;
        const strpBase = routeRules.proxy._proxyStripBase;
        if (strpBase) {
          targetPath = withoutBase(targetPath, strpBase);
        }
        target = joinURL(target.slice(0, -3), targetPath);
      } else if (event.path.includes("?")) {
        const query = getQuery$1(event.path);
        target = withQuery(target, query);
      }
      return proxyRequest(event, target, {
        fetch: ctx.localFetch,
        ...routeRules.proxy
      });
    }
  });
}
function getRouteRules(event) {
  event.context._nitro = event.context._nitro || {};
  if (!event.context._nitro.routeRules) {
    event.context._nitro.routeRules = getRouteRulesForPath(
      withoutBase(event.path.split("?")[0], useRuntimeConfig().app.baseURL)
    );
  }
  return event.context._nitro.routeRules;
}
function getRouteRulesForPath(path) {
  return defu({}, ..._routeRulesMatcher.matchAll(path).reverse());
}

function _captureError(error, type) {
  console.error(`[${type}]`, error);
  useNitroApp().captureError(error, { tags: [type] });
}
function trapUnhandledNodeErrors() {
  process.on(
    "unhandledRejection",
    (error) => _captureError(error, "unhandledRejection")
  );
  process.on(
    "uncaughtException",
    (error) => _captureError(error, "uncaughtException")
  );
}
function joinHeaders(value) {
  return Array.isArray(value) ? value.join(", ") : String(value);
}
function normalizeFetchResponse(response) {
  if (!response.headers.has("set-cookie")) {
    return response;
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: normalizeCookieHeaders(response.headers)
  });
}
function normalizeCookieHeader(header = "") {
  return splitCookiesString(joinHeaders(header));
}
function normalizeCookieHeaders(headers) {
  const outgoingHeaders = new Headers();
  for (const [name, header] of headers) {
    if (name === "set-cookie") {
      for (const cookie of normalizeCookieHeader(header)) {
        outgoingHeaders.append("set-cookie", cookie);
      }
    } else {
      outgoingHeaders.set(name, joinHeaders(header));
    }
  }
  return outgoingHeaders;
}

/**
* Nitro internal functions extracted from https://github.com/nitrojs/nitro/blob/v2/src/runtime/internal/utils.ts
*/
function isJsonRequest(event) {
	// If the client specifically requests HTML, then avoid classifying as JSON.
	if (hasReqHeader(event, "accept", "text/html")) {
		return false;
	}
	return hasReqHeader(event, "accept", "application/json") || hasReqHeader(event, "user-agent", "curl/") || hasReqHeader(event, "user-agent", "httpie/") || hasReqHeader(event, "sec-fetch-mode", "cors") || event.path.startsWith("/api/") || event.path.endsWith(".json");
}
function hasReqHeader(event, name, includes) {
	const value = getRequestHeader(event, name);
	return value && typeof value === "string" && value.toLowerCase().includes(includes);
}

const errorHandler$0 = (async function errorhandler(error, event, { defaultHandler }) {
	if (event.handled || isJsonRequest(event)) {
		// let Nitro handle JSON errors
		return;
	}
	// invoke default Nitro error handler (which will log appropriately if required)
	const defaultRes = await defaultHandler(error, event, { json: true });
	// let Nitro handle redirect if appropriate
	const status = error.status || error.statusCode || 500;
	if (status === 404 && defaultRes.status === 302) {
		setResponseHeaders(event, defaultRes.headers);
		setResponseStatus(event, defaultRes.status, defaultRes.statusText);
		return send(event, JSON.stringify(defaultRes.body, null, 2));
	}
	const errorObject = defaultRes.body;
	// remove proto/hostname/port from URL
	const url = new URL(errorObject.url);
	errorObject.url = withoutBase(url.pathname, useRuntimeConfig(event).app.baseURL) + url.search + url.hash;
	// add default server message
	errorObject.message ||= "Server Error";
	// we will be rendering this error internally so we can pass along the error.data safely
	errorObject.data ||= error.data;
	errorObject.statusText ||= error.statusText || error.statusMessage;
	delete defaultRes.headers["content-type"];
	delete defaultRes.headers["content-security-policy"];
	setResponseHeaders(event, defaultRes.headers);
	// Access request headers
	const reqHeaders = getRequestHeaders(event);
	// Detect to avoid recursion in SSR rendering of errors
	const isRenderingError = event.path.startsWith("/__nuxt_error") || !!reqHeaders["x-nuxt-error"];
	// HTML response (via SSR)
	const res = isRenderingError ? null : await useNitroApp().localFetch(withQuery(joinURL(useRuntimeConfig(event).app.baseURL, "/__nuxt_error"), errorObject), {
		headers: {
			...reqHeaders,
			"x-nuxt-error": "true"
		},
		redirect: "manual"
	}).catch(() => null);
	if (event.handled) {
		return;
	}
	// Fallback to static rendered error page
	if (!res) {
		const { template } = await import('../_/error-500.mjs');
		setResponseHeader(event, "Content-Type", "text/html;charset=UTF-8");
		return send(event, template(errorObject));
	}
	const html = await res.text();
	for (const [header, value] of res.headers.entries()) {
		if (header === "set-cookie") {
			appendResponseHeader(event, header, value);
			continue;
		}
		setResponseHeader(event, header, value);
	}
	setResponseStatus(event, res.status && res.status !== 200 ? res.status : defaultRes.status, res.statusText || defaultRes.statusText);
	return send(event, html);
});

function defineNitroErrorHandler(handler) {
  return handler;
}

const errorHandler$1 = defineNitroErrorHandler(
  function defaultNitroErrorHandler(error, event) {
    const res = defaultHandler(error, event);
    setResponseHeaders(event, res.headers);
    setResponseStatus(event, res.status, res.statusText);
    return send(event, JSON.stringify(res.body, null, 2));
  }
);
function defaultHandler(error, event, opts) {
  const isSensitive = error.unhandled || error.fatal;
  const statusCode = error.statusCode || 500;
  const statusMessage = error.statusMessage || "Server Error";
  const url = getRequestURL(event, { xForwardedHost: true, xForwardedProto: true });
  if (statusCode === 404) {
    const baseURL = "/";
    if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) {
      const redirectTo = `${baseURL}${url.pathname.slice(1)}${url.search}`;
      return {
        status: 302,
        statusText: "Found",
        headers: { location: redirectTo },
        body: `Redirecting...`
      };
    }
  }
  if (isSensitive && !opts?.silent) {
    const tags = [error.unhandled && "[unhandled]", error.fatal && "[fatal]"].filter(Boolean).join(" ");
    console.error(`[request error] ${tags} [${event.method}] ${url}
`, error);
  }
  const headers = {
    "content-type": "application/json",
    // Prevent browser from guessing the MIME types of resources.
    "x-content-type-options": "nosniff",
    // Prevent error page from being embedded in an iframe
    "x-frame-options": "DENY",
    // Prevent browsers from sending the Referer header
    "referrer-policy": "no-referrer",
    // Disable the execution of any js
    "content-security-policy": "script-src 'none'; frame-ancestors 'none';"
  };
  setResponseStatus(event, statusCode, statusMessage);
  if (statusCode === 404 || !getResponseHeader(event, "cache-control")) {
    headers["cache-control"] = "no-cache";
  }
  const body = {
    error: true,
    url: url.href,
    statusCode,
    statusMessage,
    message: isSensitive ? "Server Error" : error.message,
    data: isSensitive ? void 0 : error.data
  };
  return {
    status: statusCode,
    statusText: statusMessage,
    headers,
    body
  };
}

const errorHandlers = [errorHandler$0, errorHandler$1];

async function errorHandler(error, event) {
  for (const handler of errorHandlers) {
    try {
      await handler(error, event, { defaultHandler });
      if (event.handled) {
        return; // Response handled
      }
    } catch(error) {
      // Handler itself thrown, log and continue
      console.error(error);
    }
  }
  // H3 will handle fallback
}

const plugins = [
  
];

const assets = {
  "/README.md": {
    "type": "text/markdown; charset=utf-8",
    "etag": "\"174-Qq1GYHLtrcqeBbYregp44pxPkCk\"",
    "mtime": "2026-02-12T20:16:12.347Z",
    "size": 372,
    "path": "../public/README.md"
  },
  "/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"67-/RF49Og1sNp8r8chfDPtpKVCQAA\"",
    "mtime": "2026-02-12T20:16:11.863Z",
    "size": 103,
    "path": "../public/_payload.json"
  },
  "/ebenefactors.png": {
    "type": "image/png",
    "etag": "\"624b-bLKduLeP/SRx1zjDEWHrn8Oq4hE\"",
    "mtime": "2026-02-12T20:16:12.354Z",
    "size": 25163,
    "path": "../public/ebenefactors.png"
  },
  "/dosebot.png": {
    "type": "image/png",
    "etag": "\"bce0-krfiS56oPV0dHz8WFjnzSO6kju0\"",
    "mtime": "2026-02-12T20:16:12.345Z",
    "size": 48352,
    "path": "../public/dosebot.png"
  },
  "/icon.png": {
    "type": "image/png",
    "etag": "\"580e-oKw1hSZeBGbRlu/mDiji0jfRmH4\"",
    "mtime": "2026-02-12T20:16:12.351Z",
    "size": 22542,
    "path": "../public/icon.png"
  },
  "/error.png": {
    "type": "image/png",
    "etag": "\"d555-vt3MquEuvPP+KyxfvVnVl3BUdq8\"",
    "mtime": "2026-02-12T20:16:12.351Z",
    "size": 54613,
    "path": "../public/error.png"
  },
  "/eth_qrcode.png": {
    "type": "image/png",
    "etag": "\"797-ZJRJxNEN9GswJY9nIdqZQ4uO2HQ\"",
    "mtime": "2026-02-12T20:16:12.350Z",
    "size": 1943,
    "path": "../public/eth_qrcode.png"
  },
  "/ei-donate.png": {
    "type": "image/png",
    "etag": "\"3543a-2IV4frZOlQnMDExITJjXk5NyPA4\"",
    "mtime": "2026-02-12T20:16:12.353Z",
    "size": 218170,
    "path": "../public/ei-donate.png"
  },
  "/logo-letter.png": {
    "type": "image/png",
    "etag": "\"430d-4bSoru8XmHHTOXNsbo83s231mk8\"",
    "mtime": "2026-02-12T20:16:12.355Z",
    "size": 17165,
    "path": "../public/logo-letter.png"
  },
  "/indy_iphone_edited.png": {
    "type": "image/png",
    "etag": "\"35063-3WJT0I1PIpdrU3NsjmWEBq20OFs\"",
    "mtime": "2026-02-12T20:16:12.353Z",
    "size": 217187,
    "path": "../public/indy_iphone_edited.png"
  },
  "/logo2.svg": {
    "type": "image/svg+xml",
    "etag": "\"1d3d-O14E53tpkOCCRmtSorh2G4Qbzt8\"",
    "mtime": "2026-02-12T20:16:12.353Z",
    "size": 7485,
    "path": "../public/logo2.svg"
  },
  "/psysim.png": {
    "type": "image/png",
    "etag": "\"16cc1-laTPJiETDkV7mpzmEADi6iAMXRo\"",
    "mtime": "2026-02-12T20:16:12.354Z",
    "size": 93377,
    "path": "../public/psysim.png"
  },
  "/indy_iphone_square.png": {
    "type": "image/png",
    "etag": "\"384c5-KVCrrXW9msBbA8pXPWL1/UZvw50\"",
    "mtime": "2026-02-12T20:16:12.353Z",
    "size": 230597,
    "path": "../public/indy_iphone_square.png"
  },
  "/sm-icon-facebook.svg": {
    "type": "image/svg+xml",
    "etag": "\"3dd-bHvC3t1uvNZ9ReOV230LDxhjHOs\"",
    "mtime": "2026-02-12T20:16:12.354Z",
    "size": 989,
    "path": "../public/sm-icon-facebook.svg"
  },
  "/sm-icon-github.svg": {
    "type": "image/svg+xml",
    "etag": "\"1609-oE02ni0o5X81WldGGefCO7TOtcI\"",
    "mtime": "2026-02-12T20:16:12.355Z",
    "size": 5641,
    "path": "../public/sm-icon-github.svg"
  },
  "/sm-icon-discord.svg": {
    "type": "image/svg+xml",
    "etag": "\"902-X8nWL/MC/cwiI/KokXmREVyisSA\"",
    "mtime": "2026-02-12T20:16:12.355Z",
    "size": 2306,
    "path": "../public/sm-icon-discord.svg"
  },
  "/sm-icon-instagram.svg": {
    "type": "image/svg+xml",
    "etag": "\"5a2-Ddv9QPacvHq6C7BdgIy36R24eMY\"",
    "mtime": "2026-02-12T20:16:12.355Z",
    "size": 1442,
    "path": "../public/sm-icon-instagram.svg"
  },
  "/logo.svg": {
    "type": "image/svg+xml",
    "etag": "\"11c8-8Xkm2f/KtmkC+BLfFkUmkVg6OGQ\"",
    "mtime": "2026-02-12T20:16:12.352Z",
    "size": 4552,
    "path": "../public/logo.svg"
  },
  "/sm-icon-youtube.svg": {
    "type": "image/svg+xml",
    "etag": "\"444-hF/07gYL5VBTwHNalh5qX8cHDOQ\"",
    "mtime": "2026-02-12T20:16:12.356Z",
    "size": 1092,
    "path": "../public/sm-icon-youtube.svg"
  },
  "/spinner.svg": {
    "type": "image/svg+xml",
    "etag": "\"43c-QNR5Q1+l7qUwhbwvnXPfmzfVlC4\"",
    "mtime": "2026-02-12T20:16:12.355Z",
    "size": 1084,
    "path": "../public/spinner.svg"
  },
  "/sm-icon-reddit.svg": {
    "type": "image/svg+xml",
    "etag": "\"a83-5jqzoiMop25Gg+zOuUijlbTbrVk\"",
    "mtime": "2026-02-12T20:16:12.355Z",
    "size": 2691,
    "path": "../public/sm-icon-reddit.svg"
  },
  "/logo-letter-large.png": {
    "type": "image/png",
    "etag": "\"c1ee-8iDglcuyCNZ2RYYOw5/Waj4E2/o\"",
    "mtime": "2026-02-12T20:16:12.353Z",
    "size": 49646,
    "path": "../public/logo-letter-large.png"
  },
  "/sm-icon-spotify.svg": {
    "type": "image/svg+xml",
    "etag": "\"83a-2O7VRbOC13BScT7zSfxPj+YXF74\"",
    "mtime": "2026-02-12T20:16:12.356Z",
    "size": 2106,
    "path": "../public/sm-icon-spotify.svg"
  },
  "/sw.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"ad79-05uUJs9tFOJNCNK2qbYQefOb86s\"",
    "mtime": "2026-02-12T20:16:14.479Z",
    "size": 44409,
    "path": "../public/sw.js"
  },
  "/about/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-EkGK/LZ5IDZbJV+Y4v7VjplNasA\"",
    "mtime": "2026-02-12T20:16:11.400Z",
    "size": 69,
    "path": "../public/about/_payload.json"
  },
  "/workbox-c06a7432.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"3d84-XCgZmYQ8JE63LxmenYt32+V36F4\"",
    "mtime": "2026-02-12T20:16:14.481Z",
    "size": 15748,
    "path": "../public/workbox-c06a7432.js"
  },
  "/blog/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"54-zzLFV0d6JpbJbd7LqUfYbTQnVSw\"",
    "mtime": "2026-02-12T20:16:11.404Z",
    "size": 84,
    "path": "../public/blog/_payload.json"
  },
  "/articles/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"634e1-ZGFAy6zbsBrjYPKtAPWzyS6UDUI\"",
    "mtime": "2026-02-12T20:16:11.405Z",
    "size": 406753,
    "path": "../public/articles/_payload.json"
  },
  "/categories/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"5c-uBgwLk3sijWzUPOoe1AWZ8ZULyE\"",
    "mtime": "2026-02-12T20:16:11.823Z",
    "size": 92,
    "path": "../public/categories/_payload.json"
  },
  "/about/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"7eec-n4LVDIo0TuTqmqcDardHXbC728w\"",
    "mtime": "2026-02-12T20:16:05.659Z",
    "size": 32492,
    "path": "../public/about/index.html"
  },
  "/blog/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"9449-CY40zNIYkryuikycno29pShq4JI\"",
    "mtime": "2026-02-12T20:16:06.453Z",
    "size": 37961,
    "path": "../public/blog/index.html"
  },
  "/articles/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"ac14-YCNIIzZe0I10vzYLC8QsNYvEH6c\"",
    "mtime": "2026-02-12T20:16:06.453Z",
    "size": 44052,
    "path": "../public/articles/index.html"
  },
  "/clinical/index.html": {
    "type": "text/html; charset=utf-8",
    "etag": "\"57-C9wvtL1R80WLEQq6DUL0gcu1eVY\"",
    "mtime": "2026-02-12T20:16:05.631Z",
    "size": 87,
    "path": "../public/clinical/index.html"
  },
  "/contact/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-OM15guFB4jCkB8A/ENIyE39cSds\"",
    "mtime": "2026-02-12T20:16:11.403Z",
    "size": 69,
    "path": "../public/contact/_payload.json"
  },
  "/_nuxt/ArticleListItem.tSLw6prm.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"67d-jFMYFoFdAEoYW8aYA3z8ap++sBM\"",
    "mtime": "2026-02-12T20:16:12.114Z",
    "size": 1661,
    "path": "../public/_nuxt/ArticleListItem.tSLw6prm.css"
  },
  "/contact/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"78a8-vZLwjw+i/uyYVUP0DuPv6yeFcQw\"",
    "mtime": "2026-02-12T20:16:05.659Z",
    "size": 30888,
    "path": "../public/contact/index.html"
  },
  "/_nuxt/AudioPlayer.DGmXtTLD.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"45a-4KK18XA+G/5dxVt3V6OXNgcx9UQ\"",
    "mtime": "2026-02-12T20:16:12.116Z",
    "size": 1114,
    "path": "../public/_nuxt/AudioPlayer.DGmXtTLD.css"
  },
  "/_nuxt/B2Upu_eN.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"101a-qsd74HWfPX2ANTB5zi8om2tc7is\"",
    "mtime": "2026-02-12T20:16:12.115Z",
    "size": 4122,
    "path": "../public/_nuxt/B2Upu_eN.js"
  },
  "/_nuxt/B4VB0g4n.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1367-lP9aEtquFdnWf4ht3kFgs+0HtAU\"",
    "mtime": "2026-02-12T20:16:12.116Z",
    "size": 4967,
    "path": "../public/_nuxt/B4VB0g4n.js"
  },
  "/_nuxt/B6_w-IrJ.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"81c-oKB1+KOCJPoWlNMctSHZYhlsXZ4\"",
    "mtime": "2026-02-12T20:16:12.116Z",
    "size": 2076,
    "path": "../public/_nuxt/B6_w-IrJ.js"
  },
  "/audio/Auditory Hallucinations - Normal vs Suppressed.ogg": {
    "type": "audio/ogg",
    "etag": "\"cee60-xAuzJbyEu17f+cG332TPpuouzOo\"",
    "mtime": "2026-02-12T20:16:12.198Z",
    "size": 847456,
    "path": "../public/audio/Auditory Hallucinations - Normal vs Suppressed.ogg"
  },
  "/audio/Auditory Hallucinations - Paranoid Voices.mp3": {
    "type": "audio/mpeg",
    "etag": "\"e0506-tuRsMpX2FSA/ZaI7rn79K2TL5Ho\"",
    "mtime": "2026-02-12T20:16:12.198Z",
    "size": 918790,
    "path": "../public/audio/Auditory Hallucinations - Paranoid Voices.mp3"
  },
  "/audio/Auditory Hallucinations - Distorted Forest.mp3": {
    "type": "audio/mpeg",
    "etag": "\"19a687-5pAmfb354EVVR4FmR9v7nSy6OMs\"",
    "mtime": "2026-02-12T20:16:12.204Z",
    "size": 1681031,
    "path": "../public/audio/Auditory Hallucinations - Distorted Forest.mp3"
  },
  "/audio/Auditory Hallucinations - DMT Drone.mp3": {
    "type": "audio/mpeg",
    "etag": "\"187305-uGYefObUnQhd4rYYopKwnPWlG8Y\"",
    "mtime": "2026-02-12T20:16:12.194Z",
    "size": 1602309,
    "path": "../public/audio/Auditory Hallucinations - DMT Drone.mp3"
  },
  "/_nuxt/BCspAUjg.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"276-tgAlrG1DMfcpYQb1Ia55c9Y0UMg\"",
    "mtime": "2026-02-12T20:16:12.116Z",
    "size": 630,
    "path": "../public/_nuxt/BCspAUjg.js"
  },
  "/_nuxt/BFkWPtpr.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1407-Nkl8BpmmDFy7PFNzjEYYxoQU9cA\"",
    "mtime": "2026-02-12T20:16:12.117Z",
    "size": 5127,
    "path": "../public/_nuxt/BFkWPtpr.js"
  },
  "/_nuxt/BIl4cyR9.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1681-8OY0+UaG+gUiKJSGiH59s2B32fM\"",
    "mtime": "2026-02-12T20:16:12.116Z",
    "size": 5761,
    "path": "../public/_nuxt/BIl4cyR9.js"
  },
  "/_nuxt/BNgQjywm.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"a03-2YhlfBvEF64/4Hb0iFIgthvkS+8\"",
    "mtime": "2026-02-12T20:16:12.117Z",
    "size": 2563,
    "path": "../public/_nuxt/BNgQjywm.js"
  },
  "/_nuxt/BMbMgkOg.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"7f6-xHLcp4R65WKFBfjnaUEY3YHfPk8\"",
    "mtime": "2026-02-12T20:16:12.117Z",
    "size": 2038,
    "path": "../public/_nuxt/BMbMgkOg.js"
  },
  "/_nuxt/BNbdSrjs.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1724-LUY8yDaLzMXNgXPIkevBAdCY1uU\"",
    "mtime": "2026-02-12T20:16:12.117Z",
    "size": 5924,
    "path": "../public/_nuxt/BNbdSrjs.js"
  },
  "/_nuxt/Bf0W0lGx.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1068-fn/VD9K/NUWECp7+QHemDdKJP04\"",
    "mtime": "2026-02-12T20:16:12.118Z",
    "size": 4200,
    "path": "../public/_nuxt/Bf0W0lGx.js"
  },
  "/_nuxt/BTWoe9OO.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"132-bL80QwR//9V9THR3VKA21AHZRNE\"",
    "mtime": "2026-02-12T20:16:12.117Z",
    "size": 306,
    "path": "../public/_nuxt/BTWoe9OO.js"
  },
  "/_nuxt/BfBlo2KZ.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"49d-M7JtCKAX3sdHUE5HKpC2NwibhcE\"",
    "mtime": "2026-02-12T20:16:12.118Z",
    "size": 1181,
    "path": "../public/_nuxt/BfBlo2KZ.js"
  },
  "/_nuxt/BhNrVmiC.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"ac8-UJp/zaSVVtu9z+5gpBxpIDyjIzU\"",
    "mtime": "2026-02-12T20:16:12.120Z",
    "size": 2760,
    "path": "../public/_nuxt/BhNrVmiC.js"
  },
  "/_nuxt/BkbdBAx1.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"5b9-7rMGDKLlJy5sLBTrjpyH3xhJlgw\"",
    "mtime": "2026-02-12T20:16:12.117Z",
    "size": 1465,
    "path": "../public/_nuxt/BkbdBAx1.js"
  },
  "/_nuxt/BYCDE23i.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1be2-t9Mus4j5vWcD+I47tZX7Bud6V44\"",
    "mtime": "2026-02-12T20:16:12.117Z",
    "size": 7138,
    "path": "../public/_nuxt/BYCDE23i.js"
  },
  "/_nuxt/BqWoxG67.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"a84-XvnVEn87J3beHlF6rxFCoEDwpaM\"",
    "mtime": "2026-02-12T20:16:12.117Z",
    "size": 2692,
    "path": "../public/_nuxt/BqWoxG67.js"
  },
  "/_nuxt/BujIgRvZ.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"10e-+XKDfBBi1Nyq9+3Te4WuIvXTU1I\"",
    "mtime": "2026-02-12T20:16:12.118Z",
    "size": 270,
    "path": "../public/_nuxt/BujIgRvZ.js"
  },
  "/_nuxt/Bv1ixl-H.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"d40-n1pEnXsAxQGLG/iAJbpIkyBIYPI\"",
    "mtime": "2026-02-12T20:16:12.118Z",
    "size": 3392,
    "path": "../public/_nuxt/Bv1ixl-H.js"
  },
  "/_nuxt/ByUyFcCO.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"545-n2wpaTeSbhTA3LZ3IHnIZ1fX2e8\"",
    "mtime": "2026-02-12T20:16:12.118Z",
    "size": 1349,
    "path": "../public/_nuxt/ByUyFcCO.js"
  },
  "/_nuxt/BzdQAlL2.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"153-bipS1M09w6VMMs3VuxWWiXZgwME\"",
    "mtime": "2026-02-12T20:16:12.118Z",
    "size": 339,
    "path": "../public/_nuxt/BzdQAlL2.js"
  },
  "/_nuxt/C-sGP6tR.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"48a-1wSnV/5zHs2Ht12z5+Y395IShx4\"",
    "mtime": "2026-02-12T20:16:12.119Z",
    "size": 1162,
    "path": "../public/_nuxt/C-sGP6tR.js"
  },
  "/_nuxt/C1o6TPGu.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"a37-M5ZbCapzkbFRluXGuIzQTg47yCY\"",
    "mtime": "2026-02-12T20:16:12.120Z",
    "size": 2615,
    "path": "../public/_nuxt/C1o6TPGu.js"
  },
  "/categories/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"337881-yvqrCTVtsag3tDFQdkoNsHZLleA\"",
    "mtime": "2026-02-12T20:16:06.817Z",
    "size": 3373185,
    "path": "../public/categories/index.html"
  },
  "/_nuxt/C3ff6f5q.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"9fd-Qj1wpaRJT2NKkVD3Feq0WQovBH8\"",
    "mtime": "2026-02-12T20:16:12.118Z",
    "size": 2557,
    "path": "../public/_nuxt/C3ff6f5q.js"
  },
  "/_nuxt/C7FiuG58.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"8e1-+8T3pzjA4R6X/lTl6TS96jsE6u0\"",
    "mtime": "2026-02-12T20:16:12.119Z",
    "size": 2273,
    "path": "../public/_nuxt/C7FiuG58.js"
  },
  "/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"515110-dxymmjEJBPRlZYdCw0M9/QQ4O/s\"",
    "mtime": "2026-02-12T20:16:07.418Z",
    "size": 5329168,
    "path": "../public/index.html"
  },
  "/_nuxt/C9W24H4k.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1ee9-+fsToSpLGMp0NvaKHkm7wMz2jxU\"",
    "mtime": "2026-02-12T20:16:12.119Z",
    "size": 7913,
    "path": "../public/_nuxt/C9W24H4k.js"
  },
  "/_nuxt/CAMg3WI1.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"4a1-kIv5HnUsHz2ZkWo6eDr21ZYFwtA\"",
    "mtime": "2026-02-12T20:16:12.119Z",
    "size": 1185,
    "path": "../public/_nuxt/CAMg3WI1.js"
  },
  "/_nuxt/CCGQwREu.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"5ea-3OJxsFUcPwFq+Yp0ZbUP1am1Emk\"",
    "mtime": "2026-02-12T20:16:12.120Z",
    "size": 1514,
    "path": "../public/_nuxt/CCGQwREu.js"
  },
  "/audio/Auditory Hallucinations - Math Lecture.ogg": {
    "type": "audio/ogg",
    "etag": "\"425824-hPwXIV8He/p3qUSC7qocukSlCHw\"",
    "mtime": "2026-02-12T20:16:12.202Z",
    "size": 4347940,
    "path": "../public/audio/Auditory Hallucinations - Math Lecture.ogg"
  },
  "/_nuxt/CWv-YT0F.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"36da-0NXjnSpnMrJJ6oZihZ9f0/YF16k\"",
    "mtime": "2026-02-12T20:16:12.119Z",
    "size": 14042,
    "path": "../public/_nuxt/CWv-YT0F.js"
  },
  "/_nuxt/CWzT1tL4.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"896-52p/W2ihT5KVO1pSXwLCg2Bxr4E\"",
    "mtime": "2026-02-12T20:16:12.119Z",
    "size": 2198,
    "path": "../public/_nuxt/CWzT1tL4.js"
  },
  "/_nuxt/CYc_opc0.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"134-Pue3OYnQapcu6A0zycavqKrnpkI\"",
    "mtime": "2026-02-12T20:16:12.119Z",
    "size": 308,
    "path": "../public/_nuxt/CYc_opc0.js"
  },
  "/_nuxt/C__hXVGv.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"89d-dcrfnjlIveJL69Jgt6PK/DRS0CU\"",
    "mtime": "2026-02-12T20:16:12.121Z",
    "size": 2205,
    "path": "../public/_nuxt/C__hXVGv.js"
  },
  "/_nuxt/CdWcNC_I.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"156-oZC+AfXcj6b4yr2JcsDHCYj9Hrc\"",
    "mtime": "2026-02-12T20:16:12.120Z",
    "size": 342,
    "path": "../public/_nuxt/CdWcNC_I.js"
  },
  "/_nuxt/CeuDeIwt.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"3051-fkbUG2FRTA0sP9uFA0QdByfSCjA\"",
    "mtime": "2026-02-12T20:16:12.120Z",
    "size": 12369,
    "path": "../public/_nuxt/CeuDeIwt.js"
  },
  "/_nuxt/Cg1YNCOL.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"4ff-oKflQNW5bkHO1sk+MSCYvVgeYms\"",
    "mtime": "2026-02-12T20:16:12.126Z",
    "size": 1279,
    "path": "../public/_nuxt/Cg1YNCOL.js"
  },
  "/_nuxt/CitationList.DU-RitA_.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"244-Tj2w3eQt2wydk+1rgSOG2EvdPIk\"",
    "mtime": "2026-02-12T20:16:12.120Z",
    "size": 580,
    "path": "../public/_nuxt/CitationList.DU-RitA_.css"
  },
  "/_nuxt/CmcjtSak.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"26ea-oIiTtZngrOlSSB0A2Hy9/19BBQc\"",
    "mtime": "2026-02-12T20:16:12.120Z",
    "size": 9962,
    "path": "../public/_nuxt/CmcjtSak.js"
  },
  "/_nuxt/Cng6FIo-.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"8fe-HG1frWlTufmw3J/eraMaERbwKzc\"",
    "mtime": "2026-02-12T20:16:12.120Z",
    "size": 2302,
    "path": "../public/_nuxt/Cng6FIo-.js"
  },
  "/_nuxt/Ct7gTLMg.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"8e7-+sSh7MTO9XAnvQ27NtzOAsI/wsk\"",
    "mtime": "2026-02-12T20:16:12.121Z",
    "size": 2279,
    "path": "../public/_nuxt/Ct7gTLMg.js"
  },
  "/_nuxt/CtCIXWFl.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"491-laRH9EKpLFk1DDY3GeJyoqOzT9c\"",
    "mtime": "2026-02-12T20:16:12.122Z",
    "size": 1169,
    "path": "../public/_nuxt/CtCIXWFl.js"
  },
  "/_nuxt/CtfgQ1au.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"959-V26d5YdpdcOlHeAPWZZ2ylf+Q18\"",
    "mtime": "2026-02-12T20:16:12.121Z",
    "size": 2393,
    "path": "../public/_nuxt/CtfgQ1au.js"
  },
  "/_nuxt/CxArLbnd.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"4ca-HlqWV2F0OVf5FIkaTgaeOyhO1Gk\"",
    "mtime": "2026-02-12T20:16:12.122Z",
    "size": 1226,
    "path": "../public/_nuxt/CxArLbnd.js"
  },
  "/_nuxt/CzdGgGSL.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"5ff-Ts7swE0Jz6BLnwy1L7cwPRZd528\"",
    "mtime": "2026-02-12T20:16:12.123Z",
    "size": 1535,
    "path": "../public/_nuxt/CzdGgGSL.js"
  },
  "/_nuxt/D48DS21k.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"28d-xj6g1PE8iueM2wwWWt1aOEFR5WI\"",
    "mtime": "2026-02-12T20:16:12.123Z",
    "size": 653,
    "path": "../public/_nuxt/D48DS21k.js"
  },
  "/search-index.json": {
    "type": "application/json",
    "etag": "\"6c6d3e-OyI+SVYIZfolR7MPGS7h1k3635E\"",
    "mtime": "2026-02-12T20:16:12.365Z",
    "size": 7105854,
    "path": "../public/search-index.json"
  },
  "/_nuxt/D7Yrsb7Z.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"72a-RXQtUcHvK25dCJ/38cqrjOTu+hU\"",
    "mtime": "2026-02-12T20:16:12.124Z",
    "size": 1834,
    "path": "../public/_nuxt/D7Yrsb7Z.js"
  },
  "/_nuxt/D9lMb8_o.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1c36-Z25pPJQRdOzhefWTODGqLqq5Th8\"",
    "mtime": "2026-02-12T20:16:12.124Z",
    "size": 7222,
    "path": "../public/_nuxt/D9lMb8_o.js"
  },
  "/_nuxt/D9tVF_Cw.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"448c-Ow5dTizVPbZSLSZhrk/le832/3I\"",
    "mtime": "2026-02-12T20:16:12.124Z",
    "size": 17548,
    "path": "../public/_nuxt/D9tVF_Cw.js"
  },
  "/_nuxt/DDilEUYT.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1776-bq5u/+0zMNN6EzeXE7ERWmvmIoE\"",
    "mtime": "2026-02-12T20:16:12.125Z",
    "size": 6006,
    "path": "../public/_nuxt/DDilEUYT.js"
  },
  "/_nuxt/DEIMjeUb.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1e2d-mHy+AliGO5FmSgIGmV3R3hzeQ2c\"",
    "mtime": "2026-02-12T20:16:12.125Z",
    "size": 7725,
    "path": "../public/_nuxt/DEIMjeUb.js"
  },
  "/_nuxt/DEpH6Psh.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"446-SmQgXS7ub3PXPZdNEJ1iBYnni/w\"",
    "mtime": "2026-02-12T20:16:12.127Z",
    "size": 1094,
    "path": "../public/_nuxt/DEpH6Psh.js"
  },
  "/_nuxt/DH2cLUYG.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"3ba-qv3w2P8Wb1AM9evO0I6DY69TyVw\"",
    "mtime": "2026-02-12T20:16:12.124Z",
    "size": 954,
    "path": "../public/_nuxt/DH2cLUYG.js"
  },
  "/_nuxt/DKAN-__Y.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"ce2-OGkzq6zznFkl846zBqWKhCknvYw\"",
    "mtime": "2026-02-12T20:16:12.125Z",
    "size": 3298,
    "path": "../public/_nuxt/DKAN-__Y.js"
  },
  "/_nuxt/DL_ExJ5t.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"47c-qhuug8IAwSjPW4AT3JUKJ9rvhZA\"",
    "mtime": "2026-02-12T20:16:12.127Z",
    "size": 1148,
    "path": "../public/_nuxt/DL_ExJ5t.js"
  },
  "/_nuxt/DWGZJtWy.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"978-Rs7TSumaYpjrDlkBFqHLCFHt+3Q\"",
    "mtime": "2026-02-12T20:16:12.128Z",
    "size": 2424,
    "path": "../public/_nuxt/DWGZJtWy.js"
  },
  "/_nuxt/DSqM2-aL.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"471-Tca8AAnCL0dPiYfM/2ovLjk+Ulc\"",
    "mtime": "2026-02-12T20:16:12.126Z",
    "size": 1137,
    "path": "../public/_nuxt/DSqM2-aL.js"
  },
  "/_nuxt/DWjcYtOg.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"44c-V6HKfiLn+JouXvrmjiUXCV4wsEM\"",
    "mtime": "2026-02-12T20:16:12.127Z",
    "size": 1100,
    "path": "../public/_nuxt/DWjcYtOg.js"
  },
  "/_nuxt/D_ihHMl2.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"41d-p3yPe1fZb7cxPYgbHfPvHI2yLXs\"",
    "mtime": "2026-02-12T20:16:12.127Z",
    "size": 1053,
    "path": "../public/_nuxt/D_ihHMl2.js"
  },
  "/_nuxt/DPwxPCpA.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"755-+mgMvCMq0fwZWxT46pWEF/gGun4\"",
    "mtime": "2026-02-12T20:16:12.127Z",
    "size": 1877,
    "path": "../public/_nuxt/DPwxPCpA.js"
  },
  "/_nuxt/DbI2bt7l.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"b40-8X+cC+JS8BDW8zPzkVIpd2xAafs\"",
    "mtime": "2026-02-12T20:16:12.127Z",
    "size": 2880,
    "path": "../public/_nuxt/DbI2bt7l.js"
  },
  "/_nuxt/DhAztI-q.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"6bd-OxWhhisTh5q0Bt6J/lPVmrv5kPU\"",
    "mtime": "2026-02-12T20:16:12.127Z",
    "size": 1725,
    "path": "../public/_nuxt/DhAztI-q.js"
  },
  "/_nuxt/DagAsSPK.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"186-UwRrWYzcf64h8J7RoV42bNBr/BQ\"",
    "mtime": "2026-02-12T20:16:12.128Z",
    "size": 390,
    "path": "../public/_nuxt/DagAsSPK.js"
  },
  "/_nuxt/DjU5EhCW.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"49e-96gyGIgSyi7X/2u2QwpPbpMewH4\"",
    "mtime": "2026-02-12T20:16:12.127Z",
    "size": 1182,
    "path": "../public/_nuxt/DjU5EhCW.js"
  },
  "/_nuxt/DlnX_Dxl.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"176d-IhljxY2ltkQUixhb3YQDz7ledvE\"",
    "mtime": "2026-02-12T20:16:12.127Z",
    "size": 5997,
    "path": "../public/_nuxt/DlnX_Dxl.js"
  },
  "/_nuxt/DoQDTapT.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"53-f967RuOQGP+sBqV8b1PpCngrz80\"",
    "mtime": "2026-02-12T20:16:12.135Z",
    "size": 83,
    "path": "../public/_nuxt/DoQDTapT.js"
  },
  "/_nuxt/Dq4oFyY3.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"4f8-Ff5cw11O2XKVonBiAyLJ/8GrfMM\"",
    "mtime": "2026-02-12T20:16:12.128Z",
    "size": 1272,
    "path": "../public/_nuxt/Dq4oFyY3.js"
  },
  "/_nuxt/DqIfzQtu.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1642-sv4TmB1JnF7lhnbqGNHus0/lhJ4\"",
    "mtime": "2026-02-12T20:16:12.128Z",
    "size": 5698,
    "path": "../public/_nuxt/DqIfzQtu.js"
  },
  "/_nuxt/DtGzeA2M.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"4bf-4o5XcYYHLnzZMlQzkRBMtNOLQSA\"",
    "mtime": "2026-02-12T20:16:12.128Z",
    "size": 1215,
    "path": "../public/_nuxt/DtGzeA2M.js"
  },
  "/_nuxt/Du8Rw0B5.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"f0d-8t1FgvpGdXqzIreJz8mGpS0WRT4\"",
    "mtime": "2026-02-12T20:16:12.128Z",
    "size": 3853,
    "path": "../public/_nuxt/Du8Rw0B5.js"
  },
  "/_nuxt/Dy3vCqys.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"169-xhQl9LMPLDcKuWnPPheU/bofNsg\"",
    "mtime": "2026-02-12T20:16:12.128Z",
    "size": 361,
    "path": "../public/_nuxt/Dy3vCqys.js"
  },
  "/_nuxt/EffectList.DR-d67MR.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"113-3hBxUAJiAlUFi+PfixOxD0IoGxo\"",
    "mtime": "2026-02-12T20:16:12.128Z",
    "size": 275,
    "path": "../public/_nuxt/EffectList.DR-d67MR.css"
  },
  "/_nuxt/FrontpageArticle.DKPni8Do.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"44-+Zw6WegtrmUD+uy1IPvmCKKTAR4\"",
    "mtime": "2026-02-12T20:16:12.128Z",
    "size": 68,
    "path": "../public/_nuxt/FrontpageArticle.DKPni8Do.css"
  },
  "/_nuxt/Icon.BiWQnYur.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"67-0KuS/AqL9iJdHwnVTCsuO7ccF/Y\"",
    "mtime": "2026-02-12T20:16:12.129Z",
    "size": 103,
    "path": "../public/_nuxt/Icon.BiWQnYur.css"
  },
  "/_nuxt/KRWHeus6.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"116b-4lyb9nW7FWVgtn3+lw7ZaODP/jE\"",
    "mtime": "2026-02-12T20:16:12.128Z",
    "size": 4459,
    "path": "../public/_nuxt/KRWHeus6.js"
  },
  "/_nuxt/LightBox.B7-d67EE.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"824-50hh/yRXaMGRwOedmD6Sb2LKXiQ\"",
    "mtime": "2026-02-12T20:16:12.129Z",
    "size": 2084,
    "path": "../public/_nuxt/LightBox.B7-d67EE.css"
  },
  "/_nuxt/LongSummary.DUCSZa1n.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"13a-E6jLDx/fBxsWl1znb7MhWmhYcoQ\"",
    "mtime": "2026-02-12T20:16:12.129Z",
    "size": 314,
    "path": "../public/_nuxt/LongSummary.DUCSZa1n.css"
  },
  "/_nuxt/PanelEffectList.CCq7Rt5X.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"62c-pJ91lj6sYCU0zgvN23MTefEgzGM\"",
    "mtime": "2026-02-12T20:16:12.129Z",
    "size": 1580,
    "path": "../public/_nuxt/PanelEffectList.CCq7Rt5X.css"
  },
  "/_nuxt/Post.DtG2OpG8.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"105-L4gc6kHavr/bOOGKvv2Kr5tmymA\"",
    "mtime": "2026-02-12T20:16:12.129Z",
    "size": 261,
    "path": "../public/_nuxt/Post.DtG2OpG8.css"
  },
  "/_nuxt/QG6_PbxX.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"63f-TKLD5So5MdU1azzNKfrHH+L0tL0\"",
    "mtime": "2026-02-12T20:16:12.129Z",
    "size": 1599,
    "path": "../public/_nuxt/QG6_PbxX.js"
  },
  "/_nuxt/QHcxNvK2.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"5701-ueLLEseQgBVctXhQVwI4Y2Ccu8w\"",
    "mtime": "2026-02-12T20:16:12.130Z",
    "size": 22273,
    "path": "../public/_nuxt/QHcxNvK2.js"
  },
  "/_nuxt/RI6aYXL9.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"8d1-5EuoTTnUm8yxhDtyRoLu9QPn2v4\"",
    "mtime": "2026-02-12T20:16:12.129Z",
    "size": 2257,
    "path": "../public/_nuxt/RI6aYXL9.js"
  },
  "/_nuxt/Srh0vk9r.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"85b-ZLl6V5KxxtIAz4vqsXVRvDTllDw\"",
    "mtime": "2026-02-12T20:16:12.130Z",
    "size": 2139,
    "path": "../public/_nuxt/Srh0vk9r.js"
  },
  "/_nuxt/PhNZAdwz.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"582e0-eqo32yS13iT0SQAgH2Bc4Bg5L9s\"",
    "mtime": "2026-02-12T20:16:12.131Z",
    "size": 361184,
    "path": "../public/_nuxt/PhNZAdwz.js"
  },
  "/_nuxt/TUSQIP9E.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"b14-VXDRWw0I2Gm1yK7B+7p53A7l05E\"",
    "mtime": "2026-02-12T20:16:12.130Z",
    "size": 2836,
    "path": "../public/_nuxt/TUSQIP9E.js"
  },
  "/_nuxt/Tag.B-x_Dj_5.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"44c-bUen78YoPpp2nhim9oaWa1qq4nk\"",
    "mtime": "2026-02-12T20:16:12.130Z",
    "size": 1100,
    "path": "../public/_nuxt/Tag.B-x_Dj_5.css"
  },
  "/_nuxt/Tag.BrpvfIol.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"12d-fdhYR6HIm6w1/gPAQMjaGm6oiCI\"",
    "mtime": "2026-02-12T20:16:12.131Z",
    "size": 301,
    "path": "../public/_nuxt/Tag.BrpvfIol.css"
  },
  "/_nuxt/TvAl80gT.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"e97-DF0P2+N6R8oxHNzwOtX1pjG713I\"",
    "mtime": "2026-02-12T20:16:12.131Z",
    "size": 3735,
    "path": "../public/_nuxt/TvAl80gT.js"
  },
  "/_nuxt/TvL2eXUu.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"608-etqft4hkExxIOyS/6HCCcH/SUH0\"",
    "mtime": "2026-02-12T20:16:12.131Z",
    "size": 1544,
    "path": "../public/_nuxt/TvL2eXUu.js"
  },
  "/_nuxt/_username_.C7DtljTn.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"12f-aSrnQmiDUYdtH8Q2GdRwbM0rxZA\"",
    "mtime": "2026-02-12T20:16:12.131Z",
    "size": 303,
    "path": "../public/_nuxt/_username_.C7DtljTn.css"
  },
  "/_nuxt/afO_l0J6.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"47c-v0RAEPSYQx/3p/q/D6wiU611d24\"",
    "mtime": "2026-02-12T20:16:12.131Z",
    "size": 1148,
    "path": "../public/_nuxt/afO_l0J6.js"
  },
  "/_nuxt/audio.DApAvY1B.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1ff-FQQ441fU2p2w235Jz+/jpD4N1pI\"",
    "mtime": "2026-02-12T20:16:12.131Z",
    "size": 511,
    "path": "../public/_nuxt/audio.DApAvY1B.css"
  },
  "/_nuxt/bVrOVOsH.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"e51-fRXq+dPGv8L4Fof05Q71wX5xRH4\"",
    "mtime": "2026-02-12T20:16:12.131Z",
    "size": 3665,
    "path": "../public/_nuxt/bVrOVOsH.js"
  },
  "/_nuxt/bfKoIkxj.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"16d6-eKi6IdwNEyz5uQ5VJP8nPwvsVtw\"",
    "mtime": "2026-02-12T20:16:12.131Z",
    "size": 5846,
    "path": "../public/_nuxt/bfKoIkxj.js"
  },
  "/_nuxt/boVuOvRo.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"ca-47RPBSNqQOV6fA5nQFeoCOdMTmg\"",
    "mtime": "2026-02-12T20:16:12.132Z",
    "size": 202,
    "path": "../public/_nuxt/boVuOvRo.js"
  },
  "/_nuxt/copyright-disclaimer.DUdPoXzU.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"a3-IqVigXfd4cAMjGf1b81+YOcaCPA\"",
    "mtime": "2026-02-12T20:16:12.131Z",
    "size": 163,
    "path": "../public/_nuxt/copyright-disclaimer.DUdPoXzU.css"
  },
  "/_nuxt/discord.C75T_fmc.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"a8-GfV1qW5S1N/HOLFG/Wym+b3D4kk\"",
    "mtime": "2026-02-12T20:16:12.132Z",
    "size": 168,
    "path": "../public/_nuxt/discord.C75T_fmc.css"
  },
  "/_nuxt/donate.BhkE6eby.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"20b-9f70QshVgMDkdutnEg3wOjPO8Rc\"",
    "mtime": "2026-02-12T20:16:12.132Z",
    "size": 523,
    "path": "../public/_nuxt/donate.BhkE6eby.css"
  },
  "/_nuxt/default.Bo3V1d40.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"25fc-pOxaLytSTEn4qbSg0FIWCXKuFvk\"",
    "mtime": "2026-02-12T20:16:12.131Z",
    "size": 9724,
    "path": "../public/_nuxt/default.Bo3V1d40.css"
  },
  "/_nuxt/entry.-cvR0kyN.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"3234-JDC+DhODYNm/Yf/23wekIDCtouA\"",
    "mtime": "2026-02-12T20:16:12.132Z",
    "size": 12852,
    "path": "../public/_nuxt/entry.-cvR0kyN.css"
  },
  "/_nuxt/error-404.DL_4WIao.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"dca-KnjyV0UbpsrliiJzZx69defY74k\"",
    "mtime": "2026-02-12T20:16:12.132Z",
    "size": 3530,
    "path": "../public/_nuxt/error-404.DL_4WIao.css"
  },
  "/_nuxt/error-500.I1Dtv2V5.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"75a-vEGyJqldBVJrnMfcLsrGaHcxYl0\"",
    "mtime": "2026-02-12T20:16:12.132Z",
    "size": 1882,
    "path": "../public/_nuxt/error-500.I1Dtv2V5.css"
  },
  "/_nuxt/index.BFYuHvxL.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"73-1x3HRswbVgoRp8bmb5XtxFYc/FY\"",
    "mtime": "2026-02-12T20:16:12.132Z",
    "size": 115,
    "path": "../public/_nuxt/index.BFYuHvxL.css"
  },
  "/_nuxt/index.BecNL1MB.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"3c7-mapsGtZYz8iRY0E1jyTH7S+lP2M\"",
    "mtime": "2026-02-12T20:16:12.135Z",
    "size": 967,
    "path": "../public/_nuxt/index.BecNL1MB.css"
  },
  "/_nuxt/error.CZFK08xJ.png": {
    "type": "image/png",
    "etag": "\"d555-vt3MquEuvPP+KyxfvVnVl3BUdq8\"",
    "mtime": "2026-02-12T20:16:12.132Z",
    "size": 54613,
    "path": "../public/_nuxt/error.CZFK08xJ.png"
  },
  "/_nuxt/index.CM-jzTGf.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"216-LX/vZBicBGcGvJtVBsAC/jTeD00\"",
    "mtime": "2026-02-12T20:16:12.133Z",
    "size": 534,
    "path": "../public/_nuxt/index.CM-jzTGf.css"
  },
  "/_nuxt/index.Crg01dzc.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1bf-7+M3Xys4Sq+M2wBzMuqcEUn2IqA\"",
    "mtime": "2026-02-12T20:16:12.133Z",
    "size": 447,
    "path": "../public/_nuxt/index.Crg01dzc.css"
  },
  "/_nuxt/index.CEZbAIEN.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1485-92DwjdLBYgPFQOo42S6I9lMNpyQ\"",
    "mtime": "2026-02-12T20:16:12.133Z",
    "size": 5253,
    "path": "../public/_nuxt/index.CEZbAIEN.css"
  },
  "/_nuxt/index.D8u9J5WO.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"18f-CNCeH6FRiVTlP3YGSa1M/UuZFuI\"",
    "mtime": "2026-02-12T20:16:12.133Z",
    "size": 399,
    "path": "../public/_nuxt/index.D8u9J5WO.css"
  },
  "/_nuxt/index.Dia1PmB0.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"150-XO8bxkV6rpnAfsGGKGdor2E8Pfg\"",
    "mtime": "2026-02-12T20:16:12.134Z",
    "size": 336,
    "path": "../public/_nuxt/index.Dia1PmB0.css"
  },
  "/_nuxt/index.CaU3Aqq7.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"ba7-VWKF55plcp0dGx2GTYWTJexS8BA\"",
    "mtime": "2026-02-12T20:16:12.133Z",
    "size": 2983,
    "path": "../public/_nuxt/index.CaU3Aqq7.css"
  },
  "/_nuxt/index.DGkrZ08i.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"3e7-/7IWTNo5nY1xOxQXRKodcFfTQwQ\"",
    "mtime": "2026-02-12T20:16:12.133Z",
    "size": 999,
    "path": "../public/_nuxt/index.DGkrZ08i.css"
  },
  "/_nuxt/index.DnLQI6Uf.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"19e-QhQZpLttMMLtssrVmt8L2jvv7iI\"",
    "mtime": "2026-02-12T20:16:12.134Z",
    "size": 414,
    "path": "../public/_nuxt/index.DnLQI6Uf.css"
  },
  "/_nuxt/error.YcHGAtk4.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"18c-WxFmOA5l+K/3D82nvKx+SghclHs\"",
    "mtime": "2026-02-12T20:16:12.132Z",
    "size": 396,
    "path": "../public/_nuxt/error.YcHGAtk4.css"
  },
  "/_nuxt/index.C3Q4Cqo6.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"74-R4V2IwJfbBcwzSjMXpg60ZYsihY\"",
    "mtime": "2026-02-12T20:16:12.133Z",
    "size": 116,
    "path": "../public/_nuxt/index.C3Q4Cqo6.css"
  },
  "/_nuxt/index.BKY0iVIg.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1b05-PDBggXedI43akKRu4OeE6TBvPvI\"",
    "mtime": "2026-02-12T20:16:12.132Z",
    "size": 6917,
    "path": "../public/_nuxt/index.BKY0iVIg.css"
  },
  "/_nuxt/q0n4b86h.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"3f9-o5IRqg/XXSALZaBxqhhxGkM+sFw\"",
    "mtime": "2026-02-12T20:16:12.134Z",
    "size": 1017,
    "path": "../public/_nuxt/q0n4b86h.js"
  },
  "/_nuxt/index.d3qLZBod.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"96-NJEUbh2pBmMlLbfTPfM0jIGyIas\"",
    "mtime": "2026-02-12T20:16:12.134Z",
    "size": 150,
    "path": "../public/_nuxt/index.d3qLZBod.css"
  },
  "/_nuxt/qBM3JSle.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"377-eyeRJEF7LhVZOmX8jiEy+5x9/wM\"",
    "mtime": "2026-02-12T20:16:12.134Z",
    "size": 887,
    "path": "../public/_nuxt/qBM3JSle.js"
  },
  "/_nuxt/reportList__item.C3I7EnYP.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"7df-E5JQyDyu7cvkH/ZX7t8reiBolns\"",
    "mtime": "2026-02-12T20:16:12.134Z",
    "size": 2015,
    "path": "../public/_nuxt/reportList__item.C3I7EnYP.css"
  },
  "/_nuxt/search.C5Z_0RTW.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"28e-fi44/zDW+uq/e/XzaVLb/NLi+H8\"",
    "mtime": "2026-02-12T20:16:12.134Z",
    "size": 654,
    "path": "../public/_nuxt/search.C5Z_0RTW.css"
  },
  "/_nuxt/vcode.CskhEvvZ.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"2a1d-A0ca6Z6SF2xtNtWFfVTucKzMcec\"",
    "mtime": "2026-02-12T20:16:12.134Z",
    "size": 10781,
    "path": "../public/_nuxt/vcode.CskhEvvZ.css"
  },
  "/_nuxt/tZfryRFc.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"637-KIf3cyajyEgV/gw6OE+LGLCXlog\"",
    "mtime": "2026-02-12T20:16:12.134Z",
    "size": 1591,
    "path": "../public/_nuxt/tZfryRFc.js"
  },
  "/_nuxt/vm6hrO1C.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"622-NFv1cfMapNh50y6V/pm2aDrRYkI\"",
    "mtime": "2026-02-12T20:16:12.135Z",
    "size": 1570,
    "path": "../public/_nuxt/vm6hrO1C.js"
  },
  "/_nuxt/vmnVuMQ2.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1182d-fT+h7OpLgyTRTCM+nGWL8MgqLTE\"",
    "mtime": "2026-02-12T20:16:12.135Z",
    "size": 71725,
    "path": "../public/_nuxt/vmnVuMQ2.js"
  },
  "/_nuxt/xdpP2I58.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"40a-sVxQnND/mSeD9AVnpugyldBNIKg\"",
    "mtime": "2026-02-12T20:16:12.134Z",
    "size": 1034,
    "path": "../public/_nuxt/xdpP2I58.js"
  },
  "/_nuxt/x61MxeYu.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"483-0nGiPbngxnYOfOyibOmUW9bSvqI\"",
    "mtime": "2026-02-12T20:16:12.135Z",
    "size": 1155,
    "path": "../public/_nuxt/x61MxeYu.js"
  },
  "/_nuxt/zyDOI8Nu.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"d2a-SE0qaX5Pj87jG2UmO5LxaYAnklA\"",
    "mtime": "2026-02-12T20:16:12.135Z",
    "size": 3370,
    "path": "../public/_nuxt/zyDOI8Nu.js"
  },
  "/copyright-disclaimer/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-OM15guFB4jCkB8A/ENIyE39cSds\"",
    "mtime": "2026-02-12T20:16:11.402Z",
    "size": 69,
    "path": "../public/copyright-disclaimer/_payload.json"
  },
  "/documentation-style-guide/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-OM15guFB4jCkB8A/ENIyE39cSds\"",
    "mtime": "2026-02-12T20:16:11.402Z",
    "size": 69,
    "path": "../public/documentation-style-guide/_payload.json"
  },
  "/discord/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-OM15guFB4jCkB8A/ENIyE39cSds\"",
    "mtime": "2026-02-12T20:16:11.402Z",
    "size": 69,
    "path": "../public/discord/_payload.json"
  },
  "/copyright-disclaimer/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"7be9-QFn2u4Cq9UZY0OHGDDHnzm3PPh4\"",
    "mtime": "2026-02-12T20:16:05.662Z",
    "size": 31721,
    "path": "../public/copyright-disclaimer/index.html"
  },
  "/documentation-style-guide/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"85c1-6NKg2EUy6RYUDZkov+h+sVoRukM\"",
    "mtime": "2026-02-12T20:16:05.659Z",
    "size": 34241,
    "path": "../public/documentation-style-guide/index.html"
  },
  "/donate/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"59-nSwZVfJE/DiVZzKyTWBcMAdx050\"",
    "mtime": "2026-02-12T20:16:11.404Z",
    "size": 89,
    "path": "../public/donate/_payload.json"
  },
  "/discord/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"7f96-rWmpf12gfjy3iprAch0HbRKmn3g\"",
    "mtime": "2026-02-12T20:16:05.662Z",
    "size": 32662,
    "path": "../public/discord/index.html"
  },
  "/fonts/FiraCode-Medium.ttf": {
    "type": "font/ttf",
    "etag": "\"2834c-XAE1QIWAIIPxhtPsNIHn5canBU0\"",
    "mtime": "2026-02-12T20:16:12.222Z",
    "size": 164684,
    "path": "../public/fonts/FiraCode-Medium.ttf"
  },
  "/fonts/FiraCode-Light.ttf": {
    "type": "font/ttf",
    "etag": "\"28428-EANVEUiX3TPRbQzAMr910H77TQE\"",
    "mtime": "2026-02-12T20:16:12.193Z",
    "size": 164904,
    "path": "../public/fonts/FiraCode-Light.ttf"
  },
  "/fonts/FiraCode-Bold.ttf": {
    "type": "font/ttf",
    "etag": "\"2854c-w9CZl4AngIas2+Oj4emK3v6tqz0\"",
    "mtime": "2026-02-12T20:16:12.224Z",
    "size": 165196,
    "path": "../public/fonts/FiraCode-Bold.ttf"
  },
  "/donate/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"6b6a3-Yb1m/iW+4cKa/aDUKCJOKqTu1OI\"",
    "mtime": "2026-02-12T20:16:06.453Z",
    "size": 439971,
    "path": "../public/donate/index.html"
  },
  "/fonts/FiraCode-Regular.ttf": {
    "type": "font/ttf",
    "etag": "\"28368-MTOfW/cFgyZKzff8222qxDPiCu4\"",
    "mtime": "2026-02-12T20:16:12.224Z",
    "size": 164712,
    "path": "../public/fonts/FiraCode-Regular.ttf"
  },
  "/fonts/Mark Simonson - Proxima Nova Alt Black-demo.html": {
    "type": "text/html; charset=utf-8",
    "etag": "\"95bd-6JoU1Oz7gcQqpscjCWR9iobnEAg\"",
    "mtime": "2026-02-12T20:16:12.226Z",
    "size": 38333,
    "path": "../public/fonts/Mark Simonson - Proxima Nova Alt Black-demo.html"
  },
  "/fonts/FiraCode-SemiBold.ttf": {
    "type": "font/ttf",
    "etag": "\"284a8-nQ+DnUkQhAfIjpOMHCIpt75wfE0\"",
    "mtime": "2026-02-12T20:16:12.230Z",
    "size": 165032,
    "path": "../public/fonts/FiraCode-SemiBold.ttf"
  },
  "/fonts/Mark Simonson - Proxima Nova Alt Black-webfont.svg": {
    "type": "image/svg+xml",
    "etag": "\"122c5-7Kvoe1QlEqHHyAOCz25wHegkF80\"",
    "mtime": "2026-02-12T20:16:12.226Z",
    "size": 74437,
    "path": "../public/fonts/Mark Simonson - Proxima Nova Alt Black-webfont.svg"
  },
  "/fonts/Mark Simonson - Proxima Nova Alt Black-webfont.ttf": {
    "type": "font/ttf",
    "etag": "\"affc-2zluSlSlUJc6YwHkMnnUEZpuw4Q\"",
    "mtime": "2026-02-12T20:16:12.227Z",
    "size": 45052,
    "path": "../public/fonts/Mark Simonson - Proxima Nova Alt Black-webfont.ttf"
  },
  "/fonts/Mark Simonson - Proxima Nova Alt Black-webfont.woff": {
    "type": "font/woff",
    "etag": "\"5d0c-F73b7pNJxYLsmQJlgvns5OVoh/Y\"",
    "mtime": "2026-02-12T20:16:12.227Z",
    "size": 23820,
    "path": "../public/fonts/Mark Simonson - Proxima Nova Alt Black-webfont.woff"
  },
  "/fonts/Mark Simonson - Proxima Nova Alt Black-webfont.woff2": {
    "type": "font/woff2",
    "etag": "\"4764-OaVsP9oZxYEBvjIl2BOXPmPOuhE\"",
    "mtime": "2026-02-12T20:16:12.230Z",
    "size": 18276,
    "path": "../public/fonts/Mark Simonson - Proxima Nova Alt Black-webfont.woff2"
  },
  "/fonts/Mark Simonson - Proxima Nova Alt Bold-demo.html": {
    "type": "text/html; charset=utf-8",
    "etag": "\"95ae-ej8WWZSfzr1qvRiYshOGWh8tew8\"",
    "mtime": "2026-02-12T20:16:12.228Z",
    "size": 38318,
    "path": "../public/fonts/Mark Simonson - Proxima Nova Alt Bold-demo.html"
  },
  "/fonts/Mark Simonson - Proxima Nova Alt Bold-webfont.eot": {
    "type": "application/vnd.ms-fontobject",
    "etag": "\"51e5-SEBZjKpFwVS6wgVGA5Sc1dSanGI\"",
    "mtime": "2026-02-12T20:16:12.229Z",
    "size": 20965,
    "path": "../public/fonts/Mark Simonson - Proxima Nova Alt Bold-webfont.eot"
  },
  "/fonts/Mark Simonson - Proxima Nova Alt Bold-webfont.svg": {
    "type": "image/svg+xml",
    "etag": "\"13318-mL8+DtU1C5yPYuUtM7Ojgc4grnM\"",
    "mtime": "2026-02-12T20:16:12.231Z",
    "size": 78616,
    "path": "../public/fonts/Mark Simonson - Proxima Nova Alt Bold-webfont.svg"
  },
  "/fonts/Mark Simonson - Proxima Nova Alt Bold-webfont.ttf": {
    "type": "font/ttf",
    "etag": "\"b29c-CmN5zEzeCCQNIoPbbGPRnPbB7tI\"",
    "mtime": "2026-02-12T20:16:12.232Z",
    "size": 45724,
    "path": "../public/fonts/Mark Simonson - Proxima Nova Alt Bold-webfont.ttf"
  },
  "/fonts/Mark Simonson - Proxima Nova Alt Bold-webfont.woff": {
    "type": "font/woff",
    "etag": "\"5f7c-xn1/gbINSNY5lGE8JWqymgfQDfw\"",
    "mtime": "2026-02-12T20:16:12.232Z",
    "size": 24444,
    "path": "../public/fonts/Mark Simonson - Proxima Nova Alt Bold-webfont.woff"
  },
  "/fonts/Mark Simonson - Proxima Nova Alt Bold-webfont.woff2": {
    "type": "font/woff2",
    "etag": "\"497c-Ss0CB15NE7vjysaRHy0J/aA4+TU\"",
    "mtime": "2026-02-12T20:16:12.231Z",
    "size": 18812,
    "path": "../public/fonts/Mark Simonson - Proxima Nova Alt Bold-webfont.woff2"
  },
  "/fonts/Mark Simonson - Proxima Nova Alt Condensed Semibold-webfont.eot": {
    "type": "application/vnd.ms-fontobject",
    "etag": "\"524a-EfoPMgHlo2oS9HduuDlRINlauS4\"",
    "mtime": "2026-02-12T20:16:12.232Z",
    "size": 21066,
    "path": "../public/fonts/Mark Simonson - Proxima Nova Alt Condensed Semibold-webfont.eot"
  },
  "/fonts/Mark Simonson - Proxima Nova Alt Condensed Semibold-demo.html": {
    "type": "text/html; charset=utf-8",
    "etag": "\"95bd-EswWWVYMFFhVhbz3Z+zgi0m9AcI\"",
    "mtime": "2026-02-12T20:16:12.233Z",
    "size": 38333,
    "path": "../public/fonts/Mark Simonson - Proxima Nova Alt Condensed Semibold-demo.html"
  },
  "/fonts/Mark Simonson - Proxima Nova Alt Condensed Semibold-webfont.ttf": {
    "type": "font/ttf",
    "etag": "\"b440-ltbuhLqxwdZLDwRo07d5Qn3iaeo\"",
    "mtime": "2026-02-12T20:16:12.233Z",
    "size": 46144,
    "path": "../public/fonts/Mark Simonson - Proxima Nova Alt Condensed Semibold-webfont.ttf"
  },
  "/fonts/Mark Simonson - Proxima Nova Alt Condensed Semibold-webfont.svg": {
    "type": "image/svg+xml",
    "etag": "\"1235a-3n6D86ixm1pgJAjU9TJ8iAvSKY8\"",
    "mtime": "2026-02-12T20:16:12.233Z",
    "size": 74586,
    "path": "../public/fonts/Mark Simonson - Proxima Nova Alt Condensed Semibold-webfont.svg"
  },
  "/fonts/Mark Simonson - Proxima Nova Alt Regular-demo.html": {
    "type": "text/html; charset=utf-8",
    "etag": "\"95bd-x6xx5pOInbNq2X986mv08hUjORE\"",
    "mtime": "2026-02-12T20:16:12.233Z",
    "size": 38333,
    "path": "../public/fonts/Mark Simonson - Proxima Nova Alt Regular-demo.html"
  },
  "/fonts/Mark Simonson - Proxima Nova Alt Regular-webfont.eot": {
    "type": "application/vnd.ms-fontobject",
    "etag": "\"511d-AAuCpUkweyJyONEPMk+CV3xERh4\"",
    "mtime": "2026-02-12T20:16:12.234Z",
    "size": 20765,
    "path": "../public/fonts/Mark Simonson - Proxima Nova Alt Regular-webfont.eot"
  },
  "/fonts/Mark Simonson - Proxima Nova Alt Regular-webfont.svg": {
    "type": "image/svg+xml",
    "etag": "\"136bf-6BG/HNo2Gy+5Sw6kfJBg9FYSMfA\"",
    "mtime": "2026-02-12T20:16:12.235Z",
    "size": 79551,
    "path": "../public/fonts/Mark Simonson - Proxima Nova Alt Regular-webfont.svg"
  },
  "/fonts/Mark Simonson - Proxima Nova Alt Regular-webfont.woff": {
    "type": "font/woff",
    "etag": "\"5e6c-woaLb+Zm+uo4PinMWuE7T+x/RIY\"",
    "mtime": "2026-02-12T20:16:12.234Z",
    "size": 24172,
    "path": "../public/fonts/Mark Simonson - Proxima Nova Alt Regular-webfont.woff"
  },
  "/fonts/Mark Simonson - Proxima Nova Alt Regular-webfont.ttf": {
    "type": "font/ttf",
    "etag": "\"b338-//bjGVvKkPQ2MOp3mrfSEve4K+g\"",
    "mtime": "2026-02-12T20:16:12.235Z",
    "size": 45880,
    "path": "../public/fonts/Mark Simonson - Proxima Nova Alt Regular-webfont.ttf"
  },
  "/fonts/Mark Simonson - Proxima Nova ScOsf Thin-webfont.eot": {
    "type": "application/vnd.ms-fontobject",
    "etag": "\"4c73-43fzuOqt/QdnscV8SCXFivsDXzM\"",
    "mtime": "2026-02-12T20:16:12.234Z",
    "size": 19571,
    "path": "../public/fonts/Mark Simonson - Proxima Nova ScOsf Thin-webfont.eot"
  },
  "/fonts/Mark Simonson - Proxima Nova ScOsf Thin-webfont.svg": {
    "type": "image/svg+xml",
    "etag": "\"131c2-v7UTEtFHVtW3Eku9KySIQPLY9uE\"",
    "mtime": "2026-02-12T20:16:12.237Z",
    "size": 78274,
    "path": "../public/fonts/Mark Simonson - Proxima Nova ScOsf Thin-webfont.svg"
  },
  "/fonts/Mark Simonson - Proxima Nova ScOsf Thin-webfont.ttf": {
    "type": "font/ttf",
    "etag": "\"ab5c-iS6DCXeCLnddE8LGqYkfWZV5bY0\"",
    "mtime": "2026-02-12T20:16:12.236Z",
    "size": 43868,
    "path": "../public/fonts/Mark Simonson - Proxima Nova ScOsf Thin-webfont.ttf"
  },
  "/fonts/Mark Simonson - Proxima Nova ScOsf Thin-webfont.woff": {
    "type": "font/woff",
    "etag": "\"58b4-o7583qExNyuSAF7OoVPRURSeRuE\"",
    "mtime": "2026-02-12T20:16:12.235Z",
    "size": 22708,
    "path": "../public/fonts/Mark Simonson - Proxima Nova ScOsf Thin-webfont.woff"
  },
  "/fonts/Mark Simonson - Proxima Nova Semibold-webfont.eot": {
    "type": "application/vnd.ms-fontobject",
    "etag": "\"59d1-FTW8cOepeKd8sB195oGzHirQ0Ww\"",
    "mtime": "2026-02-12T20:16:12.237Z",
    "size": 22993,
    "path": "../public/fonts/Mark Simonson - Proxima Nova Semibold-webfont.eot"
  },
  "/fonts/Mark Simonson - Proxima Nova Semibold-webfont.svg": {
    "type": "image/svg+xml",
    "etag": "\"13de7-1EZoQdmlC+DT9oEeOizCPzJL44Y\"",
    "mtime": "2026-02-12T20:16:12.238Z",
    "size": 81383,
    "path": "../public/fonts/Mark Simonson - Proxima Nova Semibold-webfont.svg"
  },
  "/fonts/Mark Simonson - Proxima Nova Semibold-webfont.ttf": {
    "type": "font/ttf",
    "etag": "\"d188-N6q+6dL0/bbCaEdcm+Lk2oW7aTE\"",
    "mtime": "2026-02-12T20:16:12.238Z",
    "size": 53640,
    "path": "../public/fonts/Mark Simonson - Proxima Nova Semibold-webfont.ttf"
  },
  "/fonts/Mark Simonson - Proxima Nova Semibold-webfont.woff2": {
    "type": "font/woff2",
    "etag": "\"4fb0-ZvWCp61/j+Ac/+bwrzXG+ctryZA\"",
    "mtime": "2026-02-12T20:16:12.240Z",
    "size": 20400,
    "path": "../public/fonts/Mark Simonson - Proxima Nova Semibold-webfont.woff2"
  },
  "/fonts/Mark Simonson - Proxima Nova Thin-webfont.eot": {
    "type": "application/vnd.ms-fontobject",
    "etag": "\"55d4-TFreSGDCF6hd1rL157wU1GfQTYA\"",
    "mtime": "2026-02-12T20:16:12.241Z",
    "size": 21972,
    "path": "../public/fonts/Mark Simonson - Proxima Nova Thin-webfont.eot"
  },
  "/fonts/Mark Simonson - Proxima Nova Thin-webfont.svg": {
    "type": "image/svg+xml",
    "etag": "\"13fb0-I3nO4QWxWMoom64tZpiuvWRD/EM\"",
    "mtime": "2026-02-12T20:16:12.239Z",
    "size": 81840,
    "path": "../public/fonts/Mark Simonson - Proxima Nova Thin-webfont.svg"
  },
  "/fonts/Mark Simonson - Proxima Nova Thin-webfont.ttf": {
    "type": "font/ttf",
    "etag": "\"cf0c-QxV/7PExiwmSK/NqYjA/Rn1U59I\"",
    "mtime": "2026-02-12T20:16:12.240Z",
    "size": 53004,
    "path": "../public/fonts/Mark Simonson - Proxima Nova Thin-webfont.ttf"
  },
  "/fonts/Mark Simonson - Proxima Nova Thin-webfont.woff": {
    "type": "font/woff",
    "etag": "\"61c0-vEmHNm8/PvGvaUESI+L6tfI64oc\"",
    "mtime": "2026-02-12T20:16:12.239Z",
    "size": 25024,
    "path": "../public/fonts/Mark Simonson - Proxima Nova Thin-webfont.woff"
  },
  "/fonts/Mark Simonson - Proxima Nova Thin-webfont.woff2": {
    "type": "font/woff2",
    "etag": "\"4bf0-q333K2BckWVX4Jzx4fZiInZjBqA\"",
    "mtime": "2026-02-12T20:16:12.240Z",
    "size": 19440,
    "path": "../public/fonts/Mark Simonson - Proxima Nova Thin-webfont.woff2"
  },
  "/fonts/Proxima-Nova-Semibold.woff2": {
    "type": "font/woff2",
    "etag": "\"4edc-q6/T4LDZQ3Nitz5lPCqVG1on6i8\"",
    "mtime": "2026-02-12T20:16:12.249Z",
    "size": 20188,
    "path": "../public/fonts/Proxima-Nova-Semibold.woff2"
  },
  "/fonts/Proxima-Nova-Regular.woff2": {
    "type": "font/woff2",
    "etag": "\"8780-HJrJp9LcuPdUi/MC0ZYiann+hlc\"",
    "mtime": "2026-02-12T20:16:12.241Z",
    "size": 34688,
    "path": "../public/fonts/Proxima-Nova-Regular.woff2"
  },
  "/fonts/fonts.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"fa6-y16n4Mgg4PHrxY46SiDC+JnoFXQ\"",
    "mtime": "2026-02-12T20:16:12.241Z",
    "size": 4006,
    "path": "../public/fonts/fonts.css"
  },
  "/fonts/proxima-nova-medium.woff2": {
    "type": "font/woff2",
    "etag": "\"9f6f-bMvz2QRsrPcJ3c38Ka/HvSUR+iM\"",
    "mtime": "2026-02-12T20:16:12.241Z",
    "size": 40815,
    "path": "../public/fonts/proxima-nova-medium.woff2"
  },
  "/fonts/fonts.min.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"cff-7ddMXVPQLr/JMU+MiETjyj1SxqU\"",
    "mtime": "2026-02-12T20:16:12.242Z",
    "size": 3327,
    "path": "../public/fonts/fonts.min.css"
  },
  "/icons/arrow-down.svg": {
    "type": "image/svg+xml",
    "etag": "\"1cd-XNCafwpfo1Re3OimmemjwKXTD38\"",
    "mtime": "2026-02-12T20:16:12.199Z",
    "size": 461,
    "path": "../public/icons/arrow-down.svg"
  },
  "/fonts/proxima-nova.woff": {
    "type": "font/woff",
    "etag": "\"58b4-o7583qExNyuSAF7OoVPRURSeRuE\"",
    "mtime": "2026-02-12T20:16:12.242Z",
    "size": 22708,
    "path": "../public/fonts/proxima-nova.woff"
  },
  "/icons/angle-double-up.svg": {
    "type": "image/svg+xml",
    "etag": "\"248-rTk9x4yj8uhsyXibyYYB9wwPPt0\"",
    "mtime": "2026-02-12T20:16:12.191Z",
    "size": 584,
    "path": "../public/icons/angle-double-up.svg"
  },
  "/icons/arrow-up.svg": {
    "type": "image/svg+xml",
    "etag": "\"222-O5tuk1+KhyNfRon3x10T2Dkc3pc\"",
    "mtime": "2026-02-12T20:16:12.199Z",
    "size": 546,
    "path": "../public/icons/arrow-up.svg"
  },
  "/icons/book-open.svg": {
    "type": "image/svg+xml",
    "etag": "\"400-dA0NrvHChPjX3ytP75KxNhTIXx8\"",
    "mtime": "2026-02-12T20:16:12.200Z",
    "size": 1024,
    "path": "../public/icons/book-open.svg"
  },
  "/icons/brain.svg": {
    "type": "image/svg+xml",
    "etag": "\"524-ViBSCnGP/bpBxqVDt8cqkvJVYMg\"",
    "mtime": "2026-02-12T20:16:12.204Z",
    "size": 1316,
    "path": "../public/icons/brain.svg"
  },
  "/icons/capsules.svg": {
    "type": "image/svg+xml",
    "etag": "\"24c-suknt8rcIHQNanGDMXkNbC7Tcjc\"",
    "mtime": "2026-02-12T20:16:12.202Z",
    "size": 588,
    "path": "../public/icons/capsules.svg"
  },
  "/icons/chart-line.svg": {
    "type": "image/svg+xml",
    "etag": "\"2c2-oyaDKbyTce/lzjMnpzQYxbB4S0c\"",
    "mtime": "2026-02-12T20:16:12.203Z",
    "size": 706,
    "path": "../public/icons/chart-line.svg"
  },
  "/icons/chart-line-down.svg": {
    "type": "image/svg+xml",
    "etag": "\"7a0-7Ts6cXcbHEh/skcsJTkbWVysiCI\"",
    "mtime": "2026-02-12T20:16:12.203Z",
    "size": 1952,
    "path": "../public/icons/chart-line-down.svg"
  },
  "/icons/check.svg": {
    "type": "image/svg+xml",
    "etag": "\"1f1-B9vsPo4u1+niI22cyezZEasmNlk\"",
    "mtime": "2026-02-12T20:16:12.203Z",
    "size": 497,
    "path": "../public/icons/check.svg"
  },
  "/icons/chevron-double-left.svg": {
    "type": "image/svg+xml",
    "etag": "\"250-acPYs02fuFvw/tKzgqkWYYFUR1s\"",
    "mtime": "2026-02-12T20:16:12.205Z",
    "size": 592,
    "path": "../public/icons/chevron-double-left.svg"
  },
  "/icons/chevron-double-right.svg": {
    "type": "image/svg+xml",
    "etag": "\"24f-C6Bv0SsDIE4ZUXxQKQ3rkyZCGgc\"",
    "mtime": "2026-02-12T20:16:12.206Z",
    "size": 591,
    "path": "../public/icons/chevron-double-right.svg"
  },
  "/icons/child.svg": {
    "type": "image/svg+xml",
    "etag": "\"41b-EmurmxXcP4y0lmZMVOG6vryVfrY\"",
    "mtime": "2026-02-12T20:16:12.206Z",
    "size": 1051,
    "path": "../public/icons/child.svg"
  },
  "/icons/clock.svg": {
    "type": "image/svg+xml",
    "etag": "\"21d-yZvBuJpUX8LPFDTy78MSLsNkXv0\"",
    "mtime": "2026-02-12T20:16:12.206Z",
    "size": 541,
    "path": "../public/icons/clock.svg"
  },
  "/icons/cogs.svg": {
    "type": "image/svg+xml",
    "etag": "\"d39-kDMyY4VZdkadfn6MLzhKggNGiGI\"",
    "mtime": "2026-02-12T20:16:12.206Z",
    "size": 3385,
    "path": "../public/icons/cogs.svg"
  },
  "/icons/comment.svg": {
    "type": "image/svg+xml",
    "etag": "\"28f-WcVIsmeZq3/JVPJ+qToQ88tC7zs\"",
    "mtime": "2026-02-12T20:16:12.207Z",
    "size": 655,
    "path": "../public/icons/comment.svg"
  },
  "/icons/copyright.svg": {
    "type": "image/svg+xml",
    "etag": "\"399-kD1yA6vZEhJ1neE7VM6wzxPqTvc\"",
    "mtime": "2026-02-12T20:16:12.209Z",
    "size": 921,
    "path": "../public/icons/copyright.svg"
  },
  "/icons/deliriant.svg": {
    "type": "image/svg+xml",
    "etag": "\"e7b-i05U5GT6E2L7ehZYf5X38QsFlFc\"",
    "mtime": "2026-02-12T20:16:12.210Z",
    "size": 3707,
    "path": "../public/icons/deliriant.svg"
  },
  "/icons/disconnective.svg": {
    "type": "image/svg+xml",
    "etag": "\"dc0-KSw5w7b/aUGiLVqHBMd8DLwQKRA\"",
    "mtime": "2026-02-12T20:16:12.207Z",
    "size": 3520,
    "path": "../public/icons/disconnective.svg"
  },
  "/icons/distortions.svg": {
    "type": "image/svg+xml",
    "etag": "\"d6b-IxLL+2qcQ4Zw6IGrGpPgKRSYIF4\"",
    "mtime": "2026-02-12T20:16:12.207Z",
    "size": 3435,
    "path": "../public/icons/distortions.svg"
  },
  "/icons/discord.svg": {
    "type": "image/svg+xml",
    "etag": "\"54b-771msCQPP4KgRoQdyIrEOXf582M\"",
    "mtime": "2026-02-12T20:16:12.207Z",
    "size": 1355,
    "path": "../public/icons/discord.svg"
  },
  "/icons/dragon.svg": {
    "type": "image/svg+xml",
    "etag": "\"450-VvhWWNPkCsDahKZpSnEFqibai8s\"",
    "mtime": "2026-02-12T20:16:12.207Z",
    "size": 1104,
    "path": "../public/icons/dragon.svg"
  },
  "/icons/edit.svg": {
    "type": "image/svg+xml",
    "etag": "\"2df-JshPlZiVvwe+mwSwoqojbAYORuU\"",
    "mtime": "2026-02-12T20:16:12.207Z",
    "size": 735,
    "path": "../public/icons/edit.svg"
  },
  "/icons/envelope.svg": {
    "type": "image/svg+xml",
    "etag": "\"2c7-/7CHMlDnJEI+y6JB2JwIEvRU13U\"",
    "mtime": "2026-02-12T20:16:12.207Z",
    "size": 711,
    "path": "../public/icons/envelope.svg"
  },
  "/icons/external-link.svg": {
    "type": "image/svg+xml",
    "etag": "\"2c8-PbPjLDt4Cgig1KRSCKWVJfPqb3Q\"",
    "mtime": "2026-02-12T20:16:12.207Z",
    "size": 712,
    "path": "../public/icons/external-link.svg"
  },
  "/icons/eye.svg": {
    "type": "image/svg+xml",
    "etag": "\"286-dmExLbdyo1N0F8YIQo3gWEaGdbo\"",
    "mtime": "2026-02-12T20:16:12.208Z",
    "size": 646,
    "path": "../public/icons/eye.svg"
  },
  "/icons/eyez.svg": {
    "type": "image/svg+xml",
    "etag": "\"b4c-CCVaQpcJGdCC7BUpGWpoLkmAYII\"",
    "mtime": "2026-02-12T20:16:12.207Z",
    "size": 2892,
    "path": "../public/icons/eyez.svg"
  },
  "/icons/facebook-f.svg": {
    "type": "image/svg+xml",
    "etag": "\"185-gHvo6bHFqkb86fEgGTMI5xMEQm4\"",
    "mtime": "2026-02-12T20:16:12.209Z",
    "size": 389,
    "path": "../public/icons/facebook-f.svg"
  },
  "/icons/facebook.svg": {
    "type": "image/svg+xml",
    "etag": "\"1e1-4ISjscTPFbBn05jnpSuTDjGRxYA\"",
    "mtime": "2026-02-12T20:16:12.209Z",
    "size": 481,
    "path": "../public/icons/facebook.svg"
  },
  "/icons/file-invoice.svg": {
    "type": "image/svg+xml",
    "etag": "\"42b-aMN5TWz3rEYrlUaZoe0cAVClzKk\"",
    "mtime": "2026-02-12T20:16:12.209Z",
    "size": 1067,
    "path": "../public/icons/file-invoice.svg"
  },
  "/icons/file-signature.svg": {
    "type": "image/svg+xml",
    "etag": "\"49f-DAv+nmSfT5u4H/xIiQ/h2qmPD/4\"",
    "mtime": "2026-02-12T20:16:12.209Z",
    "size": 1183,
    "path": "../public/icons/file-signature.svg"
  },
  "/icons/flask.svg": {
    "type": "image/svg+xml",
    "etag": "\"237-XN96282/oled5m71ElSlwGI/oHM\"",
    "mtime": "2026-02-12T20:16:12.209Z",
    "size": 567,
    "path": "../public/icons/flask.svg"
  },
  "/icons/frown.svg": {
    "type": "image/svg+xml",
    "etag": "\"2df-bfumRTbcVdrscOp3ANnK57bXnz4\"",
    "mtime": "2026-02-12T20:16:12.214Z",
    "size": 735,
    "path": "../public/icons/frown.svg"
  },
  "/icons/geometry.svg": {
    "type": "image/svg+xml",
    "etag": "\"822-nw6Db+BsV7elL4ymU9r30ydoRzg\"",
    "mtime": "2026-02-12T20:16:12.210Z",
    "size": 2082,
    "path": "../public/icons/geometry.svg"
  },
  "/icons/github.svg": {
    "type": "image/svg+xml",
    "etag": "\"5f1-RRcmOKR6CjBd5Ji4Mheygd1qjc4\"",
    "mtime": "2026-02-12T20:16:12.210Z",
    "size": 1521,
    "path": "../public/icons/github.svg"
  },
  "/icons/hallucinatory-states.svg": {
    "type": "image/svg+xml",
    "etag": "\"e3b-m7aFyZUFcmt4Vy/X2MAKF0j+5hg\"",
    "mtime": "2026-02-12T20:16:12.210Z",
    "size": 3643,
    "path": "../public/icons/hallucinatory-states.svg"
  },
  "/icons/hand-paper.svg": {
    "type": "image/svg+xml",
    "etag": "\"464-7cFDgCicb4mN/C/3pk1tldi7Cok\"",
    "mtime": "2026-02-12T20:16:12.210Z",
    "size": 1124,
    "path": "../public/icons/hand-paper.svg"
  },
  "/icons/heart-rate.svg": {
    "type": "image/svg+xml",
    "etag": "\"2d8-Hxa542tBDgs4qicYvcoGtLaQTyM\"",
    "mtime": "2026-02-12T20:16:12.218Z",
    "size": 728,
    "path": "../public/icons/heart-rate.svg"
  },
  "/icons/heart.svg": {
    "type": "image/svg+xml",
    "etag": "\"273-T/wOySnXQTzM0x8zmKrUh1o8DIk\"",
    "mtime": "2026-02-12T20:16:12.211Z",
    "size": 627,
    "path": "../public/icons/heart.svg"
  },
  "/icons/home.svg": {
    "type": "image/svg+xml",
    "etag": "\"2be-C5vpFDXqIPYUK3pp3xXXAg2OizA\"",
    "mtime": "2026-02-12T20:16:12.211Z",
    "size": 702,
    "path": "../public/icons/home.svg"
  },
  "/icons/hourglass.svg": {
    "type": "image/svg+xml",
    "etag": "\"30f-lbGNC+lzJc6h/kwIzRzJjv5n+hg\"",
    "mtime": "2026-02-12T20:16:12.211Z",
    "size": 783,
    "path": "../public/icons/hourglass.svg"
  },
  "/icons/image.svg": {
    "type": "image/svg+xml",
    "etag": "\"274-7cpsh0eVuCK8vHdyVH4F4Pfosrw\"",
    "mtime": "2026-02-12T20:16:12.211Z",
    "size": 628,
    "path": "../public/icons/image.svg"
  },
  "/icons/images.svg": {
    "type": "image/svg+xml",
    "etag": "\"30d-Y1U2ucsFDLjhpsXIEUMp7G+tW0A\"",
    "mtime": "2026-02-12T20:16:12.211Z",
    "size": 781,
    "path": "../public/icons/images.svg"
  },
  "/icons/infinity.svg": {
    "type": "image/svg+xml",
    "etag": "\"292-3aQUh9E5H4unw+KDSjlNCCLdRHE\"",
    "mtime": "2026-02-12T20:16:12.214Z",
    "size": 658,
    "path": "../public/icons/infinity.svg"
  },
  "/icons/instagram.svg": {
    "type": "image/svg+xml",
    "etag": "\"473-PfvNjcWf7sKBvsl5z5rHPmoSJfM\"",
    "mtime": "2026-02-12T20:16:12.214Z",
    "size": 1139,
    "path": "../public/icons/instagram.svg"
  },
  "/icons/lightbulb.svg": {
    "type": "image/svg+xml",
    "etag": "\"3e1-I0plvhll3JFPW7RAUpxs5eedoZw\"",
    "mtime": "2026-02-12T20:16:12.213Z",
    "size": 993,
    "path": "../public/icons/lightbulb.svg"
  },
  "/icons/list-alt.svg": {
    "type": "image/svg+xml",
    "etag": "\"3e3-OcnmkPK1i4HRnyu14lKVQRWQluQ\"",
    "mtime": "2026-02-12T20:16:12.214Z",
    "size": 995,
    "path": "../public/icons/list-alt.svg"
  },
  "/icons/moon.svg": {
    "type": "image/svg+xml",
    "etag": "\"2e0-yhl5j9bisy8ri62fVo89xfp7++Q\"",
    "mtime": "2026-02-12T20:16:12.214Z",
    "size": 736,
    "path": "../public/icons/moon.svg"
  },
  "/icons/percent.svg": {
    "type": "image/svg+xml",
    "etag": "\"263-Qb7KxeK6h8aGxO+SCGpDTDmmOho\"",
    "mtime": "2026-02-12T20:16:12.222Z",
    "size": 611,
    "path": "../public/icons/percent.svg"
  },
  "/icons/pause.svg": {
    "type": "image/svg+xml",
    "etag": "\"25d-EEwbh4WyFat0hpBkhUic7dIEywI\"",
    "mtime": "2026-02-12T20:16:12.214Z",
    "size": 605,
    "path": "../public/icons/pause.svg"
  },
  "/icons/play.svg": {
    "type": "image/svg+xml",
    "etag": "\"1af-LRvDtpaYUc5a+5nKILYp82jkUgQ\"",
    "mtime": "2026-02-12T20:16:12.215Z",
    "size": 431,
    "path": "../public/icons/play.svg"
  },
  "/icons/plus.svg": {
    "type": "image/svg+xml",
    "etag": "\"1b8-JFJIJXmzlzN2UjXbIgDBFMWkdUY\"",
    "mtime": "2026-02-12T20:16:12.215Z",
    "size": 440,
    "path": "../public/icons/plus.svg"
  },
  "/icons/psychedelic.svg": {
    "type": "image/svg+xml",
    "etag": "\"c1d-KGlD2Hr6avJMX54mgFU6/HxOHWY\"",
    "mtime": "2026-02-12T20:16:12.215Z",
    "size": 3101,
    "path": "../public/icons/psychedelic.svg"
  },
  "/icons/psychological.svg": {
    "type": "image/svg+xml",
    "etag": "\"73c-KsQC5d72Mrl+ulOGnJa0ZEXpFTo\"",
    "mtime": "2026-02-12T20:16:12.215Z",
    "size": 1852,
    "path": "../public/icons/psychological.svg"
  },
  "/icons/question.svg": {
    "type": "image/svg+xml",
    "etag": "\"464-vi40vD79r6dMcaPOUqygPDaCSO4\"",
    "mtime": "2026-02-12T20:16:12.229Z",
    "size": 1124,
    "path": "../public/icons/question.svg"
  },
  "/icons/reddit-alien.svg": {
    "type": "image/svg+xml",
    "etag": "\"427-ItD+TDbA4gAsKBM9WnXKRKXmOpo\"",
    "mtime": "2026-02-12T20:16:12.215Z",
    "size": 1063,
    "path": "../public/icons/reddit-alien.svg"
  },
  "/icons/reddit-square.svg": {
    "type": "image/svg+xml",
    "etag": "\"496-weVU4y/DV+BMwuVof6k76BXawbs\"",
    "mtime": "2026-02-12T20:16:12.215Z",
    "size": 1174,
    "path": "../public/icons/reddit-square.svg"
  },
  "/icons/reddit.svg": {
    "type": "image/svg+xml",
    "etag": "\"465-42jkpKUq6ETqyC8YhSEP1YcjWVQ\"",
    "mtime": "2026-02-12T20:16:12.216Z",
    "size": 1125,
    "path": "../public/icons/reddit.svg"
  },
  "/icons/search.svg": {
    "type": "image/svg+xml",
    "etag": "\"22a-lxJyUElFyccrOeRDom2Fc8UPK2s\"",
    "mtime": "2026-02-12T20:16:12.216Z",
    "size": 554,
    "path": "../public/icons/search.svg"
  },
  "/icons/sitemap.svg": {
    "type": "image/svg+xml",
    "etag": "\"396-lVhDgZH759bpPqJVe6kR73xb8yw\"",
    "mtime": "2026-02-12T20:16:12.216Z",
    "size": 918,
    "path": "../public/icons/sitemap.svg"
  },
  "/icons/star.svg": {
    "type": "image/svg+xml",
    "etag": "\"1d9-GbTmJLrcN2NeSOGvArT8l3ajyIU\"",
    "mtime": "2026-02-12T20:16:12.216Z",
    "size": 473,
    "path": "../public/icons/star.svg"
  },
  "/icons/sun.svg": {
    "type": "image/svg+xml",
    "etag": "\"441-pY2YNq8GmvOe47FH2yrrcdbusiA\"",
    "mtime": "2026-02-12T20:16:12.217Z",
    "size": 1089,
    "path": "../public/icons/sun.svg"
  },
  "/icons/tiktok.svg": {
    "type": "image/svg+xml",
    "etag": "\"1b4-MasEBc3BoFJtu2S2f/CcIEbmE6M\"",
    "mtime": "2026-02-12T20:16:12.217Z",
    "size": 436,
    "path": "../public/icons/tiktok.svg"
  },
  "/icons/times-circle.svg": {
    "type": "image/svg+xml",
    "etag": "\"2ad-x1i/D9N1lJsDF6Wa9keR5OG8r68\"",
    "mtime": "2026-02-12T20:16:12.217Z",
    "size": 685,
    "path": "../public/icons/times-circle.svg"
  },
  "/icons/times.svg": {
    "type": "image/svg+xml",
    "etag": "\"25d-FdW5KHesIlcoENU8IzSwjG0hg6E\"",
    "mtime": "2026-02-12T20:16:12.221Z",
    "size": 605,
    "path": "../public/icons/times.svg"
  },
  "/icons/trash.svg": {
    "type": "image/svg+xml",
    "etag": "\"1fb-IQzV+dLhSe78KvTTRGsL0yyqYSY\"",
    "mtime": "2026-02-12T20:16:12.217Z",
    "size": 507,
    "path": "../public/icons/trash.svg"
  },
  "/icons/tumblr.svg": {
    "type": "image/svg+xml",
    "etag": "\"246-yZuVFsuYoLHO24xy0e9NfaI3HX8\"",
    "mtime": "2026-02-12T20:16:12.217Z",
    "size": 582,
    "path": "../public/icons/tumblr.svg"
  },
  "/icons/twitter.svg": {
    "type": "image/svg+xml",
    "etag": "\"3f0-nmofIIITaoRW8I5hvpuc8I+DX8Y\"",
    "mtime": "2026-02-12T20:16:12.217Z",
    "size": 1008,
    "path": "../public/icons/twitter.svg"
  },
  "/icons/unlink.svg": {
    "type": "image/svg+xml",
    "etag": "\"4c8-/Mqxp07uAfMXPDJ8Z/xacN1ILPo\"",
    "mtime": "2026-02-12T20:16:12.218Z",
    "size": 1224,
    "path": "../public/icons/unlink.svg"
  },
  "/icons/user-cog.svg": {
    "type": "image/svg+xml",
    "etag": "\"588-wQu+xLnPFUiMTKOIHWE2NyFvR0g\"",
    "mtime": "2026-02-12T20:16:12.219Z",
    "size": 1416,
    "path": "../public/icons/user-cog.svg"
  },
  "/icons/user.svg": {
    "type": "image/svg+xml",
    "etag": "\"292-1pAdGfKbE+KYh86tLb+QJwh81Qk\"",
    "mtime": "2026-02-12T20:16:12.218Z",
    "size": 658,
    "path": "../public/icons/user.svg"
  },
  "/icons/users.svg": {
    "type": "image/svg+xml",
    "etag": "\"554-VmfOHqeUD4uocT6puNcJTR1ns+o\"",
    "mtime": "2026-02-12T20:16:12.220Z",
    "size": 1364,
    "path": "../public/icons/users.svg"
  },
  "/icons/utensils.svg": {
    "type": "image/svg+xml",
    "etag": "\"4b3-2x76bwv/s0JrRbMkA24bLKBXMZI\"",
    "mtime": "2026-02-12T20:16:12.220Z",
    "size": 1203,
    "path": "../public/icons/utensils.svg"
  },
  "/icons/youtube.svg": {
    "type": "image/svg+xml",
    "etag": "\"2af-QUl8rEuRp6XwrzgGbyZ/4WsKwOI\"",
    "mtime": "2026-02-12T20:16:12.220Z",
    "size": 687,
    "path": "../public/icons/youtube.svg"
  },
  "/effects/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"5b-J64oWIFKBfdYp+FjB5E0nPUxY/M\"",
    "mtime": "2026-02-12T20:16:11.823Z",
    "size": 91,
    "path": "../public/effects/_payload.json"
  },
  "/icons/volume-up.svg": {
    "type": "image/svg+xml",
    "etag": "\"514-68k9dpsuzHsy+p3kSavwutZFB/w\"",
    "mtime": "2026-02-12T20:16:12.220Z",
    "size": 1300,
    "path": "../public/icons/volume-up.svg"
  },
  "/profiles/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"57-pa0dIWa188UyRGELAXzUcJ8/QZo\"",
    "mtime": "2026-02-12T20:16:11.990Z",
    "size": 87,
    "path": "../public/profiles/_payload.json"
  },
  "/profiles/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"9c48-pZ8iK572zKrlVzgVReGA1cGUvpE\"",
    "mtime": "2026-02-12T20:16:09.281Z",
    "size": 40008,
    "path": "../public/profiles/index.html"
  },
  "/people/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"8324-7Eo6mVvbiWJ7+pn0p8H/R0iwqTE\"",
    "mtime": "2026-02-12T20:16:09.193Z",
    "size": 33572,
    "path": "../public/people/index.html"
  },
  "/people/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"204e-6cGQr47sSMy/4ov1/yJ9Tq2Lo/M\"",
    "mtime": "2026-02-12T20:16:11.987Z",
    "size": 8270,
    "path": "../public/people/_payload.json"
  },
  "/reports/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-rT7QLA2XQfhp72Vu/mkZgP9QoFA\"",
    "mtime": "2026-02-12T20:16:11.996Z",
    "size": 69,
    "path": "../public/reports/_payload.json"
  },
  "/search/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"5b-KJm8oQcKPYMcjPpfxuN8morpYM8\"",
    "mtime": "2026-02-12T20:16:12.071Z",
    "size": 91,
    "path": "../public/search/_payload.json"
  },
  "/search/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"7f0a-lnPCThq1ETi0k7AbNgDZgKACNSY\"",
    "mtime": "2026-02-12T20:16:11.403Z",
    "size": 32522,
    "path": "../public/search/index.html"
  },
  "/replications/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"5e-XQlvTpti/m1Hk6lqIPsrfziIb9E\"",
    "mtime": "2026-02-12T20:16:11.994Z",
    "size": 94,
    "path": "../public/replications/_payload.json"
  },
  "/summaries/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"5b-rY0+dZR2iBoNkYfPuU7urvVclE0\"",
    "mtime": "2026-02-12T20:16:12.071Z",
    "size": 91,
    "path": "../public/summaries/_payload.json"
  },
  "/replications/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"20918-2xISuHlltba72/BrZK7/mlAhas0\"",
    "mtime": "2026-02-12T20:16:09.315Z",
    "size": 133400,
    "path": "../public/replications/index.html"
  },
  "/blog/site-updates/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"6af-lRAUMwvURixdLcA/ppIkHUK+MDY\"",
    "mtime": "2026-02-12T20:16:11.404Z",
    "size": 1711,
    "path": "../public/blog/site-updates/_payload.json"
  },
  "/blog/site-updates/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"810d-blYKqGiLMPywEIUsSnwbBQgclRc\"",
    "mtime": "2026-02-12T20:16:06.453Z",
    "size": 33037,
    "path": "../public/blog/site-updates/index.html"
  },
  "/articles/approximate-frequency-of-occurrence-scale/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"1d11-geZmJq5bXdGZCMQjEJLvxcnj4WM\"",
    "mtime": "2026-02-12T20:16:11.812Z",
    "size": 7441,
    "path": "../public/articles/approximate-frequency-of-occurrence-scale/_payload.json"
  },
  "/articles/dissociative-intensity-scale/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"f2ad-f00LPOZl51/J0JhlWql1quTvQDU\"",
    "mtime": "2026-02-12T20:16:11.817Z",
    "size": 62125,
    "path": "../public/articles/dissociative-intensity-scale/_payload.json"
  },
  "/blog/welcome-to-the-effect-index/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"8151-tL2eAgEm6KfzvWg9VgeIO0bhZPA\"",
    "mtime": "2026-02-12T20:16:06.500Z",
    "size": 33105,
    "path": "../public/blog/welcome-to-the-effect-index/index.html"
  },
  "/blog/welcome-to-the-effect-index/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"688-y099cGOJbyRP/uaRj8PdcWXdWFY\"",
    "mtime": "2026-02-12T20:16:11.407Z",
    "size": 1672,
    "path": "../public/blog/welcome-to-the-effect-index/_payload.json"
  },
  "/articles/approximate-frequency-of-occurrence-scale/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"9168-/hauLH5N1kyZAY95/U1b7rjOAgQ\"",
    "mtime": "2026-02-12T20:16:06.520Z",
    "size": 37224,
    "path": "../public/articles/approximate-frequency-of-occurrence-scale/index.html"
  },
  "/articles/dissociative-intensity-scale/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"1127a-3nfMIHvL2gk2XFykCXRa+bA7XKo\"",
    "mtime": "2026-02-12T20:16:06.521Z",
    "size": 70266,
    "path": "../public/articles/dissociative-intensity-scale/index.html"
  },
  "/articles/dmt/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"1b24d-NMX+qkHAsbZtEnRDzmo/TTBS7KE\"",
    "mtime": "2026-02-12T20:16:06.456Z",
    "size": 111181,
    "path": "../public/articles/dmt/index.html"
  },
  "/articles/dmt-video-script/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"21738-no9Mq/JliNr8wwzv9kfUtdBTBxU\"",
    "mtime": "2026-02-12T20:16:11.816Z",
    "size": 137016,
    "path": "../public/articles/dmt-video-script/_payload.json"
  },
  "/articles/dmt/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"23be5-7vA1zn+JhhfrXAsVQ416v33txMk\"",
    "mtime": "2026-02-12T20:16:11.404Z",
    "size": 146405,
    "path": "../public/articles/dmt/_payload.json"
  },
  "/reports/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"1a49bf-8L0QePe2Rro5TGfXbb1NqG4d0xg\"",
    "mtime": "2026-02-12T20:16:09.412Z",
    "size": 1722815,
    "path": "../public/reports/index.html"
  },
  "/articles/dmt-video-script/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"19c3c-xFFdL6ruLOnXN1RjQXkKxTR9bo0\"",
    "mtime": "2026-02-12T20:16:06.521Z",
    "size": 105532,
    "path": "../public/articles/dmt-video-script/index.html"
  },
  "/articles/dreams/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"970a-MwCfORUalUXYESjHDnNYaHnXFD4\"",
    "mtime": "2026-02-12T20:16:11.813Z",
    "size": 38666,
    "path": "../public/articles/dreams/_payload.json"
  },
  "/articles/duration-terminology-explanation/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"1e3b-+p8GZ8SkdvXBKojqPpnbbHtln2U\"",
    "mtime": "2026-02-12T20:16:11.817Z",
    "size": 7739,
    "path": "../public/articles/duration-terminology-explanation/_payload.json"
  },
  "/articles/dreams/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"e9f8-D0vYaIUSHC68pCdImc9+ucYD8Rw\"",
    "mtime": "2026-02-12T20:16:06.521Z",
    "size": 59896,
    "path": "../public/articles/dreams/index.html"
  },
  "/articles/duration-terminology-explanation/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"909e-V1LYSJivK4AZjvR57dYt4yO+1qM\"",
    "mtime": "2026-02-12T20:16:06.521Z",
    "size": 37022,
    "path": "../public/articles/duration-terminology-explanation/index.html"
  },
  "/articles/dxm/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"1b6d5-ZBwZjPwrDf2TgsCAEZFwM2b06NE\"",
    "mtime": "2026-02-12T20:16:11.814Z",
    "size": 112341,
    "path": "../public/articles/dxm/_payload.json"
  },
  "/articles/dxm/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"17116-wxQy/RX5v9VMy9Y22RWmuOM5T78\"",
    "mtime": "2026-02-12T20:16:06.521Z",
    "size": 94486,
    "path": "../public/articles/dxm/index.html"
  },
  "/effects/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"33f9a4-dhhfGTeEd6YK0wKKMS2LARQnNwU\"",
    "mtime": "2026-02-12T20:16:06.819Z",
    "size": 3406244,
    "path": "../public/effects/index.html"
  },
  "/articles/ego-deaths-script/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"ad1f-NBYdQz49GK0CD2J/79ofHTKtmf8\"",
    "mtime": "2026-02-12T20:16:11.419Z",
    "size": 44319,
    "path": "../public/articles/ego-deaths-script/_payload.json"
  },
  "/articles/ego-deaths-script/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"f43c-j8Pl6WSsxI1ZbPufjce3oyegoB4\"",
    "mtime": "2026-02-12T20:16:06.520Z",
    "size": 62524,
    "path": "../public/articles/ego-deaths-script/index.html"
  },
  "/articles/esei-structure/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"f95f-wrcrRkWTL1NULj0vBvjt4+Ji5DY\"",
    "mtime": "2026-02-12T20:16:11.816Z",
    "size": 63839,
    "path": "../public/articles/esei-structure/_payload.json"
  },
  "/articles/esei-structure/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"f345-CmZc0SGOqsolBVb22Vx3q8i/XgI\"",
    "mtime": "2026-02-12T20:16:06.521Z",
    "size": 62277,
    "path": "../public/articles/esei-structure/index.html"
  },
  "/articles/experimental-identity-levelling-system/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"9c8d-qQoAgV9l6jldTeCZTEDk3iXtvfw\"",
    "mtime": "2026-02-12T20:16:11.813Z",
    "size": 40077,
    "path": "../public/articles/experimental-identity-levelling-system/_payload.json"
  },
  "/articles/funding-proposal/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"7ca0-C0v8/vO5g+3ZdM62zyM2DbEaEsQ\"",
    "mtime": "2026-02-12T20:16:11.813Z",
    "size": 31904,
    "path": "../public/articles/funding-proposal/_payload.json"
  },
  "/articles/experimental-identity-levelling-system/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"e0bc-9aS6URwEFwd+QkTrp5FS+CKbi9U\"",
    "mtime": "2026-02-12T20:16:06.521Z",
    "size": 57532,
    "path": "../public/articles/experimental-identity-levelling-system/index.html"
  },
  "/articles/heart-opening/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"4b47-mcx4WQSq4PFNe0QLfmCMv4dnTc4\"",
    "mtime": "2026-02-12T20:16:11.815Z",
    "size": 19271,
    "path": "../public/articles/heart-opening/_payload.json"
  },
  "/articles/heart-opening/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"b73d-G41oT96fFS9A7BTrNrrjOLfU8+o\"",
    "mtime": "2026-02-12T20:16:06.520Z",
    "size": 46909,
    "path": "../public/articles/heart-opening/index.html"
  },
  "/articles/funding-proposal/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"c826-yD0nHY7Ai7pkhIFcitnDizAmwjc\"",
    "mtime": "2026-02-12T20:16:06.520Z",
    "size": 51238,
    "path": "../public/articles/funding-proposal/index.html"
  },
  "/articles/lucid-dreaming/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"bfa1-O/ZPTiV6GzBI/H+XO30a2vLYlGk\"",
    "mtime": "2026-02-12T20:16:11.834Z",
    "size": 49057,
    "path": "../public/articles/lucid-dreaming/_payload.json"
  },
  "/articles/meditation/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"a1b9-Gahd4mX90IyqRcFu7AATxcfrFec\"",
    "mtime": "2026-02-12T20:16:11.813Z",
    "size": 41401,
    "path": "../public/articles/meditation/_payload.json"
  },
  "/articles/psychedelic-intensity-scale/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"15d6c-PEHMcGvhnxzG72Foh/xlcBkq2hU\"",
    "mtime": "2026-02-12T20:16:11.405Z",
    "size": 89452,
    "path": "../public/articles/psychedelic-intensity-scale/_payload.json"
  },
  "/articles/script-for-fundraising/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"46c2-NdafeLbYSY27uEUhsb1IMzcVERU\"",
    "mtime": "2026-02-12T20:16:11.407Z",
    "size": 18114,
    "path": "../public/articles/script-for-fundraising/_payload.json"
  },
  "/articles/lucid-dreaming/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"116f8-t/nXukxYSHbzjmC/qg+NhdgTDSk\"",
    "mtime": "2026-02-12T20:16:06.544Z",
    "size": 71416,
    "path": "../public/articles/lucid-dreaming/index.html"
  },
  "/articles/meditation/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"e7cc-0sTXEyeu0I9dIQ7EUQRUYqfRjXU\"",
    "mtime": "2026-02-12T20:16:06.521Z",
    "size": 59340,
    "path": "../public/articles/meditation/index.html"
  },
  "/articles/psychedelic-internal-hallucinations-video-script/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"a892-f1JICn42Bn6Tgn3ay3CyQtYa9EE\"",
    "mtime": "2026-02-12T20:16:11.813Z",
    "size": 43154,
    "path": "../public/articles/psychedelic-internal-hallucinations-video-script/_payload.json"
  },
  "/articles/psychedelic-intensity-scale/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"140f2-yKeF0k/I+gR6Goxdzz6KDcC83po\"",
    "mtime": "2026-02-12T20:16:06.476Z",
    "size": 82162,
    "path": "../public/articles/psychedelic-intensity-scale/index.html"
  },
  "/articles/script-for-fundraising/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"a309-HXUzPStBubklW4VXb6uMojQ18lU\"",
    "mtime": "2026-02-12T20:16:06.513Z",
    "size": 41737,
    "path": "../public/articles/script-for-fundraising/index.html"
  },
  "/articles/psychedelic-internal-hallucinations-video-script/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"f1c8-sxS2DkfnBB5Pt00aHq88JMdcm6c\"",
    "mtime": "2026-02-12T20:16:06.521Z",
    "size": 61896,
    "path": "../public/articles/psychedelic-internal-hallucinations-video-script/index.html"
  },
  "/articles/unity-script/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"b219-qpoE88e/TEUWyRRY/irFhPWQL7g\"",
    "mtime": "2026-02-12T20:16:11.816Z",
    "size": 45593,
    "path": "../public/articles/unity-script/_payload.json"
  },
  "/summaries/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"334833-RFVQgO5AJLNNywTciSrLqFK9wjw\"",
    "mtime": "2026-02-12T20:16:11.823Z",
    "size": 3360819,
    "path": "../public/summaries/index.html"
  },
  "/articles/unity-script/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"f654-IN9+2CMxzMrHzxJjQqdyb0tOG0c\"",
    "mtime": "2026-02-12T20:16:06.521Z",
    "size": 63060,
    "path": "../public/articles/unity-script/index.html"
  },
  "/effects/abnormal-heartbeat/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"209f-eA9FEshuyDkHbgtecuFXjJDDx+s\"",
    "mtime": "2026-02-12T20:16:11.405Z",
    "size": 8351,
    "path": "../public/effects/abnormal-heartbeat/_payload.json"
  },
  "/effects/abnormal-heartbeat/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"a804-FMIoydseZhVYngFTQ6g7xxiGSpI\"",
    "mtime": "2026-02-12T20:16:06.500Z",
    "size": 43012,
    "path": "../public/effects/abnormal-heartbeat/index.html"
  },
  "/effects/addiction-suppression/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"3574-xvM56NK/ve/mUCOOatvLOVsTygk\"",
    "mtime": "2026-02-12T20:16:11.405Z",
    "size": 13684,
    "path": "../public/effects/addiction-suppression/_payload.json"
  },
  "/effects/addiction-suppression/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"b545-6S5X3sw3u/o8f4xtaNPgulafhfc\"",
    "mtime": "2026-02-12T20:16:06.512Z",
    "size": 46405,
    "path": "../public/effects/addiction-suppression/index.html"
  },
  "/articles/symmetrical-texture-repetition-video-script/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"1d3a-8w5+AdlzITOjqg9LzIHFJkY+PR0\"",
    "mtime": "2026-02-12T20:16:11.817Z",
    "size": 7482,
    "path": "../public/articles/symmetrical-texture-repetition-video-script/_payload.json"
  },
  "/effects/after-images/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"4848-eqZTWTisiIFrLj+JPjIOQ+A8va8\"",
    "mtime": "2026-02-12T20:16:11.803Z",
    "size": 18504,
    "path": "../public/effects/after-images/_payload.json"
  },
  "/effects/amnesia/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"4ae9-1SM0aq5nWEqi7wgk8hdXWn5jd28\"",
    "mtime": "2026-02-12T20:16:11.803Z",
    "size": 19177,
    "path": "../public/effects/amnesia/_payload.json"
  },
  "/effects/analysis-enhancement/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"6313-zUk2ckMo52SHDNNIm3a2G71mzXc\"",
    "mtime": "2026-02-12T20:16:11.823Z",
    "size": 25363,
    "path": "../public/effects/analysis-enhancement/_payload.json"
  },
  "/articles/symmetrical-texture-repetition-video-script/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"8fcb-ldjl3AygUs52oUQbpPua5eCDhTE\"",
    "mtime": "2026-02-12T20:16:06.544Z",
    "size": 36811,
    "path": "../public/articles/symmetrical-texture-repetition-video-script/index.html"
  },
  "/effects/amnesia/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"c179-+IEfwGDdbRw+iJ9f9cYN3t3ypwY\"",
    "mtime": "2026-02-12T20:16:06.520Z",
    "size": 49529,
    "path": "../public/effects/amnesia/index.html"
  },
  "/icons/brands/500px.svg": {
    "type": "image/svg+xml",
    "etag": "\"566-bBiiGXK2qXeFnMlzO0BjBpiZsyA\"",
    "mtime": "2026-02-12T20:16:12.242Z",
    "size": 1382,
    "path": "../public/icons/brands/500px.svg"
  },
  "/effects/analysis-enhancement/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"bed8-ZCY7Huo+d1Tr504zQI1MvZ2R4ZU\"",
    "mtime": "2026-02-12T20:16:06.575Z",
    "size": 48856,
    "path": "../public/effects/analysis-enhancement/index.html"
  },
  "/icons/brands/accessible-icon.svg": {
    "type": "image/svg+xml",
    "etag": "\"390-X5yr+be4SzM5vYN5jok/Xx5j/hU\"",
    "mtime": "2026-02-12T20:16:12.242Z",
    "size": 912,
    "path": "../public/icons/brands/accessible-icon.svg"
  },
  "/icons/brands/accusoft.svg": {
    "type": "image/svg+xml",
    "etag": "\"3dd-icIG7iQhe4TVWohW1jhYeewyWv0\"",
    "mtime": "2026-02-12T20:16:12.193Z",
    "size": 989,
    "path": "../public/icons/brands/accusoft.svg"
  },
  "/icons/brands/acquisitions-incorporated.svg": {
    "type": "image/svg+xml",
    "etag": "\"5f8-HKgMwA+fxsrx3Gd8mIBGNtAZ3fc\"",
    "mtime": "2026-02-12T20:16:12.243Z",
    "size": 1528,
    "path": "../public/icons/brands/acquisitions-incorporated.svg"
  },
  "/icons/brands/adn.svg": {
    "type": "image/svg+xml",
    "etag": "\"194-X93YS0Yp0j9Andc3krShH1FUa5s\"",
    "mtime": "2026-02-12T20:16:12.243Z",
    "size": 404,
    "path": "../public/icons/brands/adn.svg"
  },
  "/icons/brands/adversal.svg": {
    "type": "image/svg+xml",
    "etag": "\"5a3-NA/kKtuFIT9+oynfoKdhud/8CT4\"",
    "mtime": "2026-02-12T20:16:12.243Z",
    "size": 1443,
    "path": "../public/icons/brands/adversal.svg"
  },
  "/icons/brands/affiliatetheme.svg": {
    "type": "image/svg+xml",
    "etag": "\"21d-hxA0VGPxXszdmlaRiLUhya63eN0\"",
    "mtime": "2026-02-12T20:16:12.243Z",
    "size": 541,
    "path": "../public/icons/brands/affiliatetheme.svg"
  },
  "/icons/brands/airbnb.svg": {
    "type": "image/svg+xml",
    "etag": "\"3da-Vlq8yGVgQlj28IWxyFGalJG/e68\"",
    "mtime": "2026-02-12T20:16:12.243Z",
    "size": 986,
    "path": "../public/icons/brands/airbnb.svg"
  },
  "/effects/after-images/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"ccf7-JTniZjmBeEOloU6FZoov1E/LT6g\"",
    "mtime": "2026-02-12T20:16:06.513Z",
    "size": 52471,
    "path": "../public/effects/after-images/index.html"
  },
  "/icons/brands/algolia.svg": {
    "type": "image/svg+xml",
    "etag": "\"414-eruY221NFcETsh0COUQ9vscQWso\"",
    "mtime": "2026-02-12T20:16:12.243Z",
    "size": 1044,
    "path": "../public/icons/brands/algolia.svg"
  },
  "/icons/brands/alipay.svg": {
    "type": "image/svg+xml",
    "etag": "\"372-HVB5/EWiV6tJBYPURJpDexmW0NA\"",
    "mtime": "2026-02-12T20:16:12.243Z",
    "size": 882,
    "path": "../public/icons/brands/alipay.svg"
  },
  "/icons/brands/amazon-pay.svg": {
    "type": "image/svg+xml",
    "etag": "\"e13-TbSsYHSrPp+GaGBw0Ut/r3n7bMc\"",
    "mtime": "2026-02-12T20:16:12.243Z",
    "size": 3603,
    "path": "../public/icons/brands/amazon-pay.svg"
  },
  "/icons/brands/amazon.svg": {
    "type": "image/svg+xml",
    "etag": "\"359-dYt0C+vyIQJb4KLEi8hrQaT97Z4\"",
    "mtime": "2026-02-12T20:16:12.243Z",
    "size": 857,
    "path": "../public/icons/brands/amazon.svg"
  },
  "/icons/brands/amilia.svg": {
    "type": "image/svg+xml",
    "etag": "\"2e6-5VKT1BG0elGc6vHb7BJf3zdv05Y\"",
    "mtime": "2026-02-12T20:16:12.243Z",
    "size": 742,
    "path": "../public/icons/brands/amilia.svg"
  },
  "/icons/brands/android.svg": {
    "type": "image/svg+xml",
    "etag": "\"206-Ec8Fr7WfAgKGPBqE04EnYjuszIg\"",
    "mtime": "2026-02-12T20:16:12.244Z",
    "size": 518,
    "path": "../public/icons/brands/android.svg"
  },
  "/icons/brands/angrycreative.svg": {
    "type": "image/svg+xml",
    "etag": "\"828-8ER/gO3Yk+fK8XsmpfwgETA5+2I\"",
    "mtime": "2026-02-12T20:16:12.244Z",
    "size": 2088,
    "path": "../public/icons/brands/angrycreative.svg"
  },
  "/icons/brands/angellist.svg": {
    "type": "image/svg+xml",
    "etag": "\"5ef-8BxWkXL+pKaM25KhhnxYNYFgEdg\"",
    "mtime": "2026-02-12T20:16:12.243Z",
    "size": 1519,
    "path": "../public/icons/brands/angellist.svg"
  },
  "/data/api-data.json": {
    "type": "application/json",
    "etag": "\"1109516-KLveip+3z3g080XFkLel6etnjkA\"",
    "mtime": "2026-02-12T20:16:12.222Z",
    "size": 17863958,
    "path": "../public/data/api-data.json"
  },
  "/icons/brands/angular.svg": {
    "type": "image/svg+xml",
    "etag": "\"178-XRuKHUnCHKD3d3nOVE5ZXVJ9AHw\"",
    "mtime": "2026-02-12T20:16:12.244Z",
    "size": 376,
    "path": "../public/icons/brands/angular.svg"
  },
  "/icons/brands/app-store.svg": {
    "type": "image/svg+xml",
    "etag": "\"3e3-FsqSvoHRIm/NmV2669hgkmFKwxE\"",
    "mtime": "2026-02-12T20:16:12.244Z",
    "size": 995,
    "path": "../public/icons/brands/app-store.svg"
  },
  "/icons/brands/app-store-ios.svg": {
    "type": "image/svg+xml",
    "etag": "\"35f-uEShSJMziMFnXpl1IfkquG0LqLs\"",
    "mtime": "2026-02-12T20:16:12.254Z",
    "size": 863,
    "path": "../public/icons/brands/app-store-ios.svg"
  },
  "/icons/brands/apple.svg": {
    "type": "image/svg+xml",
    "etag": "\"28c-4Gx9ipbcuTI6T6xlRASVSFop0k4\"",
    "mtime": "2026-02-12T20:16:12.244Z",
    "size": 652,
    "path": "../public/icons/brands/apple.svg"
  },
  "/icons/brands/artstation.svg": {
    "type": "image/svg+xml",
    "etag": "\"19a-FzgnpPsDUXg46mxoxdqI75oK8fM\"",
    "mtime": "2026-02-12T20:16:12.244Z",
    "size": 410,
    "path": "../public/icons/brands/artstation.svg"
  },
  "/icons/brands/apple-pay.svg": {
    "type": "image/svg+xml",
    "etag": "\"52f-qUjuwDxkpJ+wDnod6OxJ0OBthVE\"",
    "mtime": "2026-02-12T20:16:12.244Z",
    "size": 1327,
    "path": "../public/icons/brands/apple-pay.svg"
  },
  "/icons/brands/apper.svg": {
    "type": "image/svg+xml",
    "etag": "\"74a-i61JJUYFCTcrIk1XMiUY7bIIw+0\"",
    "mtime": "2026-02-12T20:16:12.244Z",
    "size": 1866,
    "path": "../public/icons/brands/apper.svg"
  },
  "/icons/brands/asymmetrik.svg": {
    "type": "image/svg+xml",
    "etag": "\"385-3XP9axxSKh7FQHAc1xlCX+2G1+Y\"",
    "mtime": "2026-02-12T20:16:12.245Z",
    "size": 901,
    "path": "../public/icons/brands/asymmetrik.svg"
  },
  "/icons/brands/audible.svg": {
    "type": "image/svg+xml",
    "etag": "\"2c7-RRKNAJ5Q3fsimEaPO4j/bWRDnkc\"",
    "mtime": "2026-02-12T20:16:12.244Z",
    "size": 711,
    "path": "../public/icons/brands/audible.svg"
  },
  "/icons/brands/atlassian.svg": {
    "type": "image/svg+xml",
    "etag": "\"1f7-RTk+vO+DuZzoK3NdEKw4m93ZDhQ\"",
    "mtime": "2026-02-12T20:16:12.244Z",
    "size": 503,
    "path": "../public/icons/brands/atlassian.svg"
  },
  "/icons/brands/autoprefixer.svg": {
    "type": "image/svg+xml",
    "etag": "\"1a0-G6aBMjMKynLalgZW0/bwgX9VL9s\"",
    "mtime": "2026-02-12T20:16:12.244Z",
    "size": 416,
    "path": "../public/icons/brands/autoprefixer.svg"
  },
  "/icons/brands/avianex.svg": {
    "type": "image/svg+xml",
    "etag": "\"2c4-9g1qWf5NLnQAtGXV3+5kTdxal7U\"",
    "mtime": "2026-02-12T20:16:12.245Z",
    "size": 708,
    "path": "../public/icons/brands/avianex.svg"
  },
  "/icons/brands/aviato.svg": {
    "type": "image/svg+xml",
    "etag": "\"90a-UgJ3d/Jqhv7IpFB3sYmzSWYQRQo\"",
    "mtime": "2026-02-12T20:16:12.245Z",
    "size": 2314,
    "path": "../public/icons/brands/aviato.svg"
  },
  "/icons/brands/aws.svg": {
    "type": "image/svg+xml",
    "etag": "\"98f-hOQNQqfw8rbQ0Ncn1yQLWV60bRA\"",
    "mtime": "2026-02-12T20:16:12.245Z",
    "size": 2447,
    "path": "../public/icons/brands/aws.svg"
  },
  "/icons/brands/bandcamp.svg": {
    "type": "image/svg+xml",
    "etag": "\"13d-UYiNLv2Gve0xg8ZHoahb5ZK5zEY\"",
    "mtime": "2026-02-12T20:16:12.245Z",
    "size": 317,
    "path": "../public/icons/brands/bandcamp.svg"
  },
  "/icons/brands/battle-net.svg": {
    "type": "image/svg+xml",
    "etag": "\"a96-0CF4CqoFn5TOx3sdyLA4u4brBSw\"",
    "mtime": "2026-02-12T20:16:12.246Z",
    "size": 2710,
    "path": "../public/icons/brands/battle-net.svg"
  },
  "/icons/brands/behance-square.svg": {
    "type": "image/svg+xml",
    "etag": "\"398-vnrFXVkdB0xmOwuZoQiLrTQCCmw\"",
    "mtime": "2026-02-12T20:16:12.246Z",
    "size": 920,
    "path": "../public/icons/brands/behance-square.svg"
  },
  "/icons/brands/behance.svg": {
    "type": "image/svg+xml",
    "etag": "\"335-frVNPYvCbD4ttCZy0ZlABnqCSvc\"",
    "mtime": "2026-02-12T20:16:12.246Z",
    "size": 821,
    "path": "../public/icons/brands/behance.svg"
  },
  "/icons/brands/bimobject.svg": {
    "type": "image/svg+xml",
    "etag": "\"26e-PxFLWjLvx+3lPgsNz7PK8W9lZA0\"",
    "mtime": "2026-02-12T20:16:12.246Z",
    "size": 622,
    "path": "../public/icons/brands/bimobject.svg"
  },
  "/icons/brands/bitbucket.svg": {
    "type": "image/svg+xml",
    "etag": "\"1bb-QMLZ6T6igOp8QmpxtvKOvxK+CWw\"",
    "mtime": "2026-02-12T20:16:12.248Z",
    "size": 443,
    "path": "../public/icons/brands/bitbucket.svg"
  },
  "/icons/brands/bitcoin.svg": {
    "type": "image/svg+xml",
    "etag": "\"516-Au+Qi5j9kbqQ69/O47KDQnI5K6U\"",
    "mtime": "2026-02-12T20:16:12.247Z",
    "size": 1302,
    "path": "../public/icons/brands/bitcoin.svg"
  },
  "/icons/brands/bity.svg": {
    "type": "image/svg+xml",
    "etag": "\"380-WCWmRqiyJ6RQJ1aYbZ9TiUhw2OM\"",
    "mtime": "2026-02-12T20:16:12.248Z",
    "size": 896,
    "path": "../public/icons/brands/bity.svg"
  },
  "/icons/brands/black-tie.svg": {
    "type": "image/svg+xml",
    "etag": "\"13a-xa1No5kEpoSoN+WeF7SRNm2Yr8I\"",
    "mtime": "2026-02-12T20:16:12.248Z",
    "size": 314,
    "path": "../public/icons/brands/black-tie.svg"
  },
  "/icons/brands/blackberry.svg": {
    "type": "image/svg+xml",
    "etag": "\"32d-T7izaV8UUglpLeFoW4sXiUEow+M\"",
    "mtime": "2026-02-12T20:16:12.248Z",
    "size": 813,
    "path": "../public/icons/brands/blackberry.svg"
  },
  "/icons/brands/blogger-b.svg": {
    "type": "image/svg+xml",
    "etag": "\"40d-Wp1KgeuyHf+rE5HpIDJKJilimng\"",
    "mtime": "2026-02-12T20:16:12.248Z",
    "size": 1037,
    "path": "../public/icons/brands/blogger-b.svg"
  },
  "/icons/brands/blogger.svg": {
    "type": "image/svg+xml",
    "etag": "\"538-UQXhPjhxyfG6PW1mV1aRWjSiTkI\"",
    "mtime": "2026-02-12T20:16:12.248Z",
    "size": 1336,
    "path": "../public/icons/brands/blogger.svg"
  },
  "/icons/brands/bluetooth-b.svg": {
    "type": "image/svg+xml",
    "etag": "\"1fc-NtqjEGCoTqI6XleLxFeRDOC0o8o\"",
    "mtime": "2026-02-12T20:16:12.249Z",
    "size": 508,
    "path": "../public/icons/brands/bluetooth-b.svg"
  },
  "/icons/brands/bluetooth.svg": {
    "type": "image/svg+xml",
    "etag": "\"1fb-yU0K9VYkXjmmD8/O6dVMiQ6EXSc\"",
    "mtime": "2026-02-12T20:16:12.249Z",
    "size": 507,
    "path": "../public/icons/brands/bluetooth.svg"
  },
  "/icons/brands/bootstrap.svg": {
    "type": "image/svg+xml",
    "etag": "\"2e7-TfH1wdwCoT8mIdIMQIy5H2CDzC4\"",
    "mtime": "2026-02-12T20:16:12.249Z",
    "size": 743,
    "path": "../public/icons/brands/bootstrap.svg"
  },
  "/icons/brands/btc.svg": {
    "type": "image/svg+xml",
    "etag": "\"37f-yrkkbfOFeVeXBbmVihyRgrZZoL4\"",
    "mtime": "2026-02-12T20:16:12.249Z",
    "size": 895,
    "path": "../public/icons/brands/btc.svg"
  },
  "/icons/brands/buffer.svg": {
    "type": "image/svg+xml",
    "etag": "\"358-bapmpzOCNgWlrZHZbo02kdPZZKo\"",
    "mtime": "2026-02-12T20:16:12.249Z",
    "size": 856,
    "path": "../public/icons/brands/buffer.svg"
  },
  "/icons/brands/buromobelexperte.svg": {
    "type": "image/svg+xml",
    "etag": "\"263-dVSvbvD0jvf23BfwsUiwsZaTlEA\"",
    "mtime": "2026-02-12T20:16:12.249Z",
    "size": 611,
    "path": "../public/icons/brands/buromobelexperte.svg"
  },
  "/icons/brands/buy-n-large.svg": {
    "type": "image/svg+xml",
    "etag": "\"3e1-VZUKm1qszxjDrBdj1wQyDAYOubQ\"",
    "mtime": "2026-02-12T20:16:12.249Z",
    "size": 993,
    "path": "../public/icons/brands/buy-n-large.svg"
  },
  "/icons/brands/canadian-maple-leaf.svg": {
    "type": "image/svg+xml",
    "etag": "\"3eb-wxvBbEped++IQ9heWqa4b7gJBJc\"",
    "mtime": "2026-02-12T20:16:12.249Z",
    "size": 1003,
    "path": "../public/icons/brands/canadian-maple-leaf.svg"
  },
  "/icons/brands/buysellads.svg": {
    "type": "image/svg+xml",
    "etag": "\"1b2-VwKU2H+wZzddaXpI1469VpdFz5o\"",
    "mtime": "2026-02-12T20:16:12.249Z",
    "size": 434,
    "path": "../public/icons/brands/buysellads.svg"
  },
  "/icons/brands/cc-amazon-pay.svg": {
    "type": "image/svg+xml",
    "etag": "\"ded-+XqOaOgMGZ6fZQLt9WcG2hsg9zU\"",
    "mtime": "2026-02-12T20:16:12.249Z",
    "size": 3565,
    "path": "../public/icons/brands/cc-amazon-pay.svg"
  },
  "/icons/brands/cc-amex.svg": {
    "type": "image/svg+xml",
    "etag": "\"d06-td8gu/QitNsdBo7NzQZB6BhFfJY\"",
    "mtime": "2026-02-12T20:16:12.250Z",
    "size": 3334,
    "path": "../public/icons/brands/cc-amex.svg"
  },
  "/icons/brands/cc-apple-pay.svg": {
    "type": "image/svg+xml",
    "etag": "\"58e-Duv8Wal52XbqYpDZungnUrbh0EE\"",
    "mtime": "2026-02-12T20:16:12.250Z",
    "size": 1422,
    "path": "../public/icons/brands/cc-apple-pay.svg"
  },
  "/icons/brands/cc-diners-club.svg": {
    "type": "image/svg+xml",
    "etag": "\"2e1-3pCbwQSZOS/RSxkVf6Fv6vc60uc\"",
    "mtime": "2026-02-12T20:16:12.250Z",
    "size": 737,
    "path": "../public/icons/brands/cc-diners-club.svg"
  },
  "/icons/brands/cc-discover.svg": {
    "type": "image/svg+xml",
    "etag": "\"55e-q4nCbjzhs0s3T8KeK/9c90NiZ4w\"",
    "mtime": "2026-02-12T20:16:12.250Z",
    "size": 1374,
    "path": "../public/icons/brands/cc-discover.svg"
  },
  "/icons/brands/cc-jcb.svg": {
    "type": "image/svg+xml",
    "etag": "\"394-UTlCXPLe5iR+PRz8uQ/AYtLwXOE\"",
    "mtime": "2026-02-12T20:16:12.250Z",
    "size": 916,
    "path": "../public/icons/brands/cc-jcb.svg"
  },
  "/icons/brands/cc-mastercard.svg": {
    "type": "image/svg+xml",
    "etag": "\"c55-3YDaYvdlhPUtYAo6nAEYkjM5hcc\"",
    "mtime": "2026-02-12T20:16:12.251Z",
    "size": 3157,
    "path": "../public/icons/brands/cc-mastercard.svg"
  },
  "/icons/brands/cc-paypal.svg": {
    "type": "image/svg+xml",
    "etag": "\"76b-vNJojWfiD9DnA+sez7gtgrcs1+A\"",
    "mtime": "2026-02-12T20:16:12.250Z",
    "size": 1899,
    "path": "../public/icons/brands/cc-paypal.svg"
  },
  "/icons/brands/cc-stripe.svg": {
    "type": "image/svg+xml",
    "etag": "\"591-Gs4j0p4SO2+K2j5JiytUUfollwA\"",
    "mtime": "2026-02-12T20:16:12.250Z",
    "size": 1425,
    "path": "../public/icons/brands/cc-stripe.svg"
  },
  "/icons/brands/cc-visa.svg": {
    "type": "image/svg+xml",
    "etag": "\"42f-VjnCb2x/K+XYXYECzl8MPkz/A28\"",
    "mtime": "2026-02-12T20:16:12.251Z",
    "size": 1071,
    "path": "../public/icons/brands/cc-visa.svg"
  },
  "/icons/brands/centercode.svg": {
    "type": "image/svg+xml",
    "etag": "\"250-cUHvprmJsphzN+YWlUhfDB2XY94\"",
    "mtime": "2026-02-12T20:16:12.250Z",
    "size": 592,
    "path": "../public/icons/brands/centercode.svg"
  },
  "/icons/brands/centos.svg": {
    "type": "image/svg+xml",
    "etag": "\"41a-AQhraIsKvsmJ0Jyj2OHfOXwkx/A\"",
    "mtime": "2026-02-12T20:16:12.250Z",
    "size": 1050,
    "path": "../public/icons/brands/centos.svg"
  },
  "/icons/brands/chrome.svg": {
    "type": "image/svg+xml",
    "etag": "\"2ca-/Te2SVIVsMYPV3zXLvp9hoXXSFM\"",
    "mtime": "2026-02-12T20:16:12.250Z",
    "size": 714,
    "path": "../public/icons/brands/chrome.svg"
  },
  "/icons/brands/chromecast.svg": {
    "type": "image/svg+xml",
    "etag": "\"26b-LVioJFIs436LPjq7IpkqiCUkRXQ\"",
    "mtime": "2026-02-12T20:16:12.251Z",
    "size": 619,
    "path": "../public/icons/brands/chromecast.svg"
  },
  "/icons/brands/cloudflare.svg": {
    "type": "image/svg+xml",
    "etag": "\"4df-Y3911XDceEDebzR7l89AX8/bLqc\"",
    "mtime": "2026-02-12T20:16:12.251Z",
    "size": 1247,
    "path": "../public/icons/brands/cloudflare.svg"
  },
  "/icons/brands/cloudscale.svg": {
    "type": "image/svg+xml",
    "etag": "\"300-yX7ELzGiPHe0oaRQjji8AN2k7z0\"",
    "mtime": "2026-02-12T20:16:12.251Z",
    "size": 768,
    "path": "../public/icons/brands/cloudscale.svg"
  },
  "/icons/brands/cloudsmith.svg": {
    "type": "image/svg+xml",
    "etag": "\"1af-ZLIwlO6ORA3wC89WqMo4u+WNqPw\"",
    "mtime": "2026-02-12T20:16:12.251Z",
    "size": 431,
    "path": "../public/icons/brands/cloudsmith.svg"
  },
  "/icons/brands/codepen.svg": {
    "type": "image/svg+xml",
    "etag": "\"372-mZiBlLCQ7pKvSSHopEMPs8uISCc\"",
    "mtime": "2026-02-12T20:16:12.251Z",
    "size": 882,
    "path": "../public/icons/brands/codepen.svg"
  },
  "/icons/brands/codiepie.svg": {
    "type": "image/svg+xml",
    "etag": "\"2a2-P4m+audujDl6C4FFGcvU/EGDE+4\"",
    "mtime": "2026-02-12T20:16:12.251Z",
    "size": 674,
    "path": "../public/icons/brands/codiepie.svg"
  },
  "/icons/brands/confluence.svg": {
    "type": "image/svg+xml",
    "etag": "\"2d9-Lc3JH3vXBXjpM/1pfLZpEcCQzv0\"",
    "mtime": "2026-02-12T20:16:12.251Z",
    "size": 729,
    "path": "../public/icons/brands/confluence.svg"
  },
  "/icons/brands/cloudversify.svg": {
    "type": "image/svg+xml",
    "etag": "\"5db-yy/GeaeJ0T6dogG23RG8Q8jUA1A\"",
    "mtime": "2026-02-12T20:16:12.256Z",
    "size": 1499,
    "path": "../public/icons/brands/cloudversify.svg"
  },
  "/icons/brands/connectdevelop.svg": {
    "type": "image/svg+xml",
    "etag": "\"cbb-IMJbFjqveMNoNFlkjSTpJN0c6Xk\"",
    "mtime": "2026-02-12T20:16:12.251Z",
    "size": 3259,
    "path": "../public/icons/brands/connectdevelop.svg"
  },
  "/icons/brands/contao.svg": {
    "type": "image/svg+xml",
    "etag": "\"2b1-bssygT0WAYz2u3eWGTwUEgIaOQc\"",
    "mtime": "2026-02-12T20:16:12.251Z",
    "size": 689,
    "path": "../public/icons/brands/contao.svg"
  },
  "/icons/brands/cotton-bureau.svg": {
    "type": "image/svg+xml",
    "etag": "\"593-Dxbci0KHoJ1/wsAlCRFpd74kNQY\"",
    "mtime": "2026-02-12T20:16:12.252Z",
    "size": 1427,
    "path": "../public/icons/brands/cotton-bureau.svg"
  },
  "/icons/brands/cpanel.svg": {
    "type": "image/svg+xml",
    "etag": "\"620-Z8MWq3tx5HUld9SN0QjIxZoB3o0\"",
    "mtime": "2026-02-12T20:16:12.252Z",
    "size": 1568,
    "path": "../public/icons/brands/cpanel.svg"
  },
  "/icons/brands/creative-commons-by.svg": {
    "type": "image/svg+xml",
    "etag": "\"2cc-B2b4ZRro6Gno+kEi0NZ64oY7APA\"",
    "mtime": "2026-02-12T20:16:12.252Z",
    "size": 716,
    "path": "../public/icons/brands/creative-commons-by.svg"
  },
  "/icons/brands/creative-commons-nc-eu.svg": {
    "type": "image/svg+xml",
    "etag": "\"3c1-C65LV+5F72zAc8C8zNg73CO2tY8\"",
    "mtime": "2026-02-12T20:16:12.252Z",
    "size": 961,
    "path": "../public/icons/brands/creative-commons-nc-eu.svg"
  },
  "/icons/brands/creative-commons-nc-jp.svg": {
    "type": "image/svg+xml",
    "etag": "\"2cf-kkXjsYpdjQEHl99y6dKi1xMenKQ\"",
    "mtime": "2026-02-12T20:16:12.252Z",
    "size": 719,
    "path": "../public/icons/brands/creative-commons-nc-jp.svg"
  },
  "/icons/brands/creative-commons-nc.svg": {
    "type": "image/svg+xml",
    "etag": "\"36f-hXyS0VVz/TgtQq26eyQNxLrvHws\"",
    "mtime": "2026-02-12T20:16:12.252Z",
    "size": 879,
    "path": "../public/icons/brands/creative-commons-nc.svg"
  },
  "/icons/brands/creative-commons-nd.svg": {
    "type": "image/svg+xml",
    "etag": "\"20b-nO3GdDGv6iqugK8HVqLZnoL4hVw\"",
    "mtime": "2026-02-12T20:16:12.252Z",
    "size": 523,
    "path": "../public/icons/brands/creative-commons-nd.svg"
  },
  "/icons/brands/creative-commons-pd-alt.svg": {
    "type": "image/svg+xml",
    "etag": "\"2f3-vHmfmAoFPGTacv7ObKWgOerlxKI\"",
    "mtime": "2026-02-12T20:16:12.252Z",
    "size": 755,
    "path": "../public/icons/brands/creative-commons-pd-alt.svg"
  },
  "/icons/brands/creative-commons-pd.svg": {
    "type": "image/svg+xml",
    "etag": "\"31b-jvj2S9tGQUiqVaEm4mSEPGP2w6A\"",
    "mtime": "2026-02-12T20:16:12.253Z",
    "size": 795,
    "path": "../public/icons/brands/creative-commons-pd.svg"
  },
  "/icons/brands/creative-commons-remix.svg": {
    "type": "image/svg+xml",
    "etag": "\"311-XcvX1co8iSRcC2z6MU/WRsNbXso\"",
    "mtime": "2026-02-12T20:16:12.252Z",
    "size": 785,
    "path": "../public/icons/brands/creative-commons-remix.svg"
  },
  "/icons/brands/creative-commons-sa.svg": {
    "type": "image/svg+xml",
    "etag": "\"2d3-Q7vICC+oOw/z8eIEeSUdkwo+nos\"",
    "mtime": "2026-02-12T20:16:12.253Z",
    "size": 723,
    "path": "../public/icons/brands/creative-commons-sa.svg"
  },
  "/icons/brands/creative-commons-sampling-plus.svg": {
    "type": "image/svg+xml",
    "etag": "\"51c-/LGUI2sfN6amm7miifsKtnl9/9Y\"",
    "mtime": "2026-02-12T20:16:12.253Z",
    "size": 1308,
    "path": "../public/icons/brands/creative-commons-sampling-plus.svg"
  },
  "/icons/brands/creative-commons-sampling.svg": {
    "type": "image/svg+xml",
    "etag": "\"55c-tQx32qge46GXetj1QtMqXzuk+5E\"",
    "mtime": "2026-02-12T20:16:12.253Z",
    "size": 1372,
    "path": "../public/icons/brands/creative-commons-sampling.svg"
  },
  "/icons/brands/creative-commons-share.svg": {
    "type": "image/svg+xml",
    "etag": "\"2fa-hLbGlQpCQHjgQkOAWh6zjYGA6nY\"",
    "mtime": "2026-02-12T20:16:12.253Z",
    "size": 762,
    "path": "../public/icons/brands/creative-commons-share.svg"
  },
  "/icons/brands/creative-commons-zero.svg": {
    "type": "image/svg+xml",
    "etag": "\"321-3fCv4s7aRLxElMzdVW7uEWcpEGo\"",
    "mtime": "2026-02-12T20:16:12.253Z",
    "size": 801,
    "path": "../public/icons/brands/creative-commons-zero.svg"
  },
  "/icons/brands/creative-commons.svg": {
    "type": "image/svg+xml",
    "etag": "\"44b-GIa7E8uAdyuxrsOK6JPbCi0PJrU\"",
    "mtime": "2026-02-12T20:16:12.253Z",
    "size": 1099,
    "path": "../public/icons/brands/creative-commons.svg"
  },
  "/icons/brands/critical-role.svg": {
    "type": "image/svg+xml",
    "etag": "\"1c66-VidqNR7FNF2wnAtZ4jbQTIPLb1A\"",
    "mtime": "2026-02-12T20:16:12.253Z",
    "size": 7270,
    "path": "../public/icons/brands/critical-role.svg"
  },
  "/icons/brands/css3-alt.svg": {
    "type": "image/svg+xml",
    "etag": "\"1c6-UodiZpbK/IqHjbL4+YPVhIqD3bo\"",
    "mtime": "2026-02-12T20:16:12.253Z",
    "size": 454,
    "path": "../public/icons/brands/css3-alt.svg"
  },
  "/icons/brands/d-and-d-beyond.svg": {
    "type": "image/svg+xml",
    "etag": "\"1025-tD+S4w/lV5iE5OEl8tfaL4dItYs\"",
    "mtime": "2026-02-12T20:16:12.253Z",
    "size": 4133,
    "path": "../public/icons/brands/d-and-d-beyond.svg"
  },
  "/icons/brands/cuttlefish.svg": {
    "type": "image/svg+xml",
    "etag": "\"1d3-fD1QMABtyLNfJylDB4JQKKf4BmE\"",
    "mtime": "2026-02-12T20:16:12.254Z",
    "size": 467,
    "path": "../public/icons/brands/cuttlefish.svg"
  },
  "/icons/brands/d-and-d.svg": {
    "type": "image/svg+xml",
    "etag": "\"1230-yqMwC4mVR9PdRyxBQvHWRtQV9hU\"",
    "mtime": "2026-02-12T20:16:12.254Z",
    "size": 4656,
    "path": "../public/icons/brands/d-and-d.svg"
  },
  "/icons/brands/dailymotion.svg": {
    "type": "image/svg+xml",
    "etag": "\"2af-3o06Jds1pMwkbytSw3Reev6ov2A\"",
    "mtime": "2026-02-12T20:16:12.254Z",
    "size": 687,
    "path": "../public/icons/brands/dailymotion.svg"
  },
  "/icons/brands/dashcube.svg": {
    "type": "image/svg+xml",
    "etag": "\"1c9-4Unpws+XJiwgxApcE1TV30iCLoE\"",
    "mtime": "2026-02-12T20:16:12.254Z",
    "size": 457,
    "path": "../public/icons/brands/dashcube.svg"
  },
  "/icons/brands/delicious.svg": {
    "type": "image/svg+xml",
    "etag": "\"2ab-ui9ZERAjgRfA5IuTXeOn6HHXKXE\"",
    "mtime": "2026-02-12T20:16:12.255Z",
    "size": 683,
    "path": "../public/icons/brands/delicious.svg"
  },
  "/icons/brands/css3.svg": {
    "type": "image/svg+xml",
    "etag": "\"158-sRv++UzvRxZ56v4Ete1tEw+Lu4k\"",
    "mtime": "2026-02-12T20:16:12.253Z",
    "size": 344,
    "path": "../public/icons/brands/css3.svg"
  },
  "/icons/brands/deezer.svg": {
    "type": "image/svg+xml",
    "etag": "\"1ec-Y0u4J+846RpAZ8z4XfvErBSS8co\"",
    "mtime": "2026-02-12T20:16:12.254Z",
    "size": 492,
    "path": "../public/icons/brands/deezer.svg"
  },
  "/icons/brands/deploydog.svg": {
    "type": "image/svg+xml",
    "etag": "\"3d5-mOp6DtBz2dxfdEmGd+TFhZbWJ/w\"",
    "mtime": "2026-02-12T20:16:12.254Z",
    "size": 981,
    "path": "../public/icons/brands/deploydog.svg"
  },
  "/icons/brands/deskpro.svg": {
    "type": "image/svg+xml",
    "etag": "\"338-rzyI6ttUXFWBmMWaE7lL1jonCZ0\"",
    "mtime": "2026-02-12T20:16:12.254Z",
    "size": 824,
    "path": "../public/icons/brands/deskpro.svg"
  },
  "/icons/brands/dev.svg": {
    "type": "image/svg+xml",
    "etag": "\"386-zieeFwbj6SyYjy/FDz5QP4jJTMI\"",
    "mtime": "2026-02-12T20:16:12.254Z",
    "size": 902,
    "path": "../public/icons/brands/dev.svg"
  },
  "/icons/brands/deviantart.svg": {
    "type": "image/svg+xml",
    "etag": "\"185-zY3hRYO14bLOyr201OkNqPMJTCI\"",
    "mtime": "2026-02-12T20:16:12.260Z",
    "size": 389,
    "path": "../public/icons/brands/deviantart.svg"
  },
  "/icons/brands/dhl.svg": {
    "type": "image/svg+xml",
    "etag": "\"3d0-E0P0VsgaTbrDjSmk9Ik4Zd8Ovvo\"",
    "mtime": "2026-02-12T20:16:12.255Z",
    "size": 976,
    "path": "../public/icons/brands/dhl.svg"
  },
  "/icons/brands/digg.svg": {
    "type": "image/svg+xml",
    "etag": "\"209-YbzMrahyd7hO6yZL6xCHxgEZxGI\"",
    "mtime": "2026-02-12T20:16:12.255Z",
    "size": 521,
    "path": "../public/icons/brands/digg.svg"
  },
  "/icons/brands/diaspora.svg": {
    "type": "image/svg+xml",
    "etag": "\"26f-sajQMJ5xBsa9vvQVU2xihqnGuMM\"",
    "mtime": "2026-02-12T20:16:12.255Z",
    "size": 623,
    "path": "../public/icons/brands/diaspora.svg"
  },
  "/icons/brands/digital-ocean.svg": {
    "type": "image/svg+xml",
    "etag": "\"201-hLIMDC9n8ZIxhvL2bu+c8V91teM\"",
    "mtime": "2026-02-12T20:16:12.255Z",
    "size": 513,
    "path": "../public/icons/brands/digital-ocean.svg"
  },
  "/icons/brands/discord.svg": {
    "type": "image/svg+xml",
    "etag": "\"54b-771msCQPP4KgRoQdyIrEOXf582M\"",
    "mtime": "2026-02-12T20:16:12.255Z",
    "size": 1355,
    "path": "../public/icons/brands/discord.svg"
  },
  "/icons/brands/discourse.svg": {
    "type": "image/svg+xml",
    "etag": "\"1e0-w5JyrTe0SpeI0KpykTGO3nnLhMw\"",
    "mtime": "2026-02-12T20:16:12.255Z",
    "size": 480,
    "path": "../public/icons/brands/discourse.svg"
  },
  "/icons/brands/dochub.svg": {
    "type": "image/svg+xml",
    "etag": "\"194-F/Oe9Nrm1ouZZD41D297J2FBOYY\"",
    "mtime": "2026-02-12T20:16:12.255Z",
    "size": 404,
    "path": "../public/icons/brands/dochub.svg"
  },
  "/icons/brands/docker.svg": {
    "type": "image/svg+xml",
    "etag": "\"320-XroE79pgQN3oBrQkC9/nBW4MaM4\"",
    "mtime": "2026-02-12T20:16:12.256Z",
    "size": 800,
    "path": "../public/icons/brands/docker.svg"
  },
  "/icons/brands/draft2digital.svg": {
    "type": "image/svg+xml",
    "etag": "\"394-4Z7F9h21rOvXNO6lpoIDcJy5GJU\"",
    "mtime": "2026-02-12T20:16:12.255Z",
    "size": 916,
    "path": "../public/icons/brands/draft2digital.svg"
  },
  "/icons/brands/dribbble-square.svg": {
    "type": "image/svg+xml",
    "etag": "\"422-mLZDO7IU9vDvZfkvAaPQdfu5PuI\"",
    "mtime": "2026-02-12T20:16:12.255Z",
    "size": 1058,
    "path": "../public/icons/brands/dribbble-square.svg"
  },
  "/icons/brands/dribbble.svg": {
    "type": "image/svg+xml",
    "etag": "\"4f4-MfnyjLTdZJETMyCYiIjBe7CZeX4\"",
    "mtime": "2026-02-12T20:16:12.256Z",
    "size": 1268,
    "path": "../public/icons/brands/dribbble.svg"
  },
  "/icons/brands/dropbox.svg": {
    "type": "image/svg+xml",
    "etag": "\"1bf-UzitB/dDpiKf/a6NH24UPHLpgVk\"",
    "mtime": "2026-02-12T20:16:12.256Z",
    "size": 447,
    "path": "../public/icons/brands/dropbox.svg"
  },
  "/icons/brands/drupal.svg": {
    "type": "image/svg+xml",
    "etag": "\"38c-OW8VuvmkRAnHdgOgpis64Hcdewg\"",
    "mtime": "2026-02-12T20:16:12.256Z",
    "size": 908,
    "path": "../public/icons/brands/drupal.svg"
  },
  "/icons/brands/earlybirds.svg": {
    "type": "image/svg+xml",
    "etag": "\"810-Xb+tf9VzFrvqH4JEC+flOwvJu7w\"",
    "mtime": "2026-02-12T20:16:12.256Z",
    "size": 2064,
    "path": "../public/icons/brands/earlybirds.svg"
  },
  "/icons/brands/dyalog.svg": {
    "type": "image/svg+xml",
    "etag": "\"18d-Mm218GlR1ihEgz3rkB9xdeSort0\"",
    "mtime": "2026-02-12T20:16:12.256Z",
    "size": 397,
    "path": "../public/icons/brands/dyalog.svg"
  },
  "/icons/brands/ebay.svg": {
    "type": "image/svg+xml",
    "etag": "\"4d2-GCMA9iv9BDE4GO/tPt4PLtAMr0c\"",
    "mtime": "2026-02-12T20:16:12.256Z",
    "size": 1234,
    "path": "../public/icons/brands/ebay.svg"
  },
  "/icons/brands/elementor.svg": {
    "type": "image/svg+xml",
    "etag": "\"1cf-d9qFeSRb2QBEOCsPUSBaKfyPyD4\"",
    "mtime": "2026-02-12T20:16:12.256Z",
    "size": 463,
    "path": "../public/icons/brands/elementor.svg"
  },
  "/icons/brands/ember.svg": {
    "type": "image/svg+xml",
    "etag": "\"816-ypy2UA1KcEq/XAUi0cx9ufE9mMY\"",
    "mtime": "2026-02-12T20:16:12.257Z",
    "size": 2070,
    "path": "../public/icons/brands/ember.svg"
  },
  "/icons/brands/ello.svg": {
    "type": "image/svg+xml",
    "etag": "\"235-CjKYoI7VjW6vQxKCf4wnzGGdXvQ\"",
    "mtime": "2026-02-12T20:16:12.256Z",
    "size": 565,
    "path": "../public/icons/brands/ello.svg"
  },
  "/icons/brands/empire.svg": {
    "type": "image/svg+xml",
    "etag": "\"7c0-oyNggtYwg2MzI2o24fGVgbbByjY\"",
    "mtime": "2026-02-12T20:16:12.257Z",
    "size": 1984,
    "path": "../public/icons/brands/empire.svg"
  },
  "/icons/brands/envira.svg": {
    "type": "image/svg+xml",
    "etag": "\"1f7-sEPZ8tFLkMr+Gxd61cJfjwTYpD0\"",
    "mtime": "2026-02-12T20:16:12.257Z",
    "size": 503,
    "path": "../public/icons/brands/envira.svg"
  },
  "/icons/brands/edge-legacy.svg": {
    "type": "image/svg+xml",
    "etag": "\"273-6Yyf4VCi0y2VFJXG4yJfzWIM2ys\"",
    "mtime": "2026-02-12T20:16:12.256Z",
    "size": 627,
    "path": "../public/icons/brands/edge-legacy.svg"
  },
  "/icons/brands/edge.svg": {
    "type": "image/svg+xml",
    "etag": "\"545-AtD6b1tKVOKahY0YHTn33f1OYPo\"",
    "mtime": "2026-02-12T20:16:12.256Z",
    "size": 1349,
    "path": "../public/icons/brands/edge.svg"
  },
  "/icons/brands/etsy.svg": {
    "type": "image/svg+xml",
    "etag": "\"31f-XuQ7jK/5cWfMPJq1U4gBuKxax6E\"",
    "mtime": "2026-02-12T20:16:12.257Z",
    "size": 799,
    "path": "../public/icons/brands/etsy.svg"
  },
  "/icons/brands/erlang.svg": {
    "type": "image/svg+xml",
    "etag": "\"239-tZ0cQv5VeBObpFYTe9fEVEaUJNY\"",
    "mtime": "2026-02-12T20:16:12.257Z",
    "size": 569,
    "path": "../public/icons/brands/erlang.svg"
  },
  "/icons/brands/evernote.svg": {
    "type": "image/svg+xml",
    "etag": "\"47a-bIQ+NXm8UDvtWATcISUzVtPRxSw\"",
    "mtime": "2026-02-12T20:16:12.257Z",
    "size": 1146,
    "path": "../public/icons/brands/evernote.svg"
  },
  "/icons/brands/ethereum.svg": {
    "type": "image/svg+xml",
    "etag": "\"138-sV9TZudCPe6J6WT8OT4V/mNR8Qo\"",
    "mtime": "2026-02-12T20:16:12.257Z",
    "size": 312,
    "path": "../public/icons/brands/ethereum.svg"
  },
  "/icons/brands/expeditedssl.svg": {
    "type": "image/svg+xml",
    "etag": "\"44b-hv85t3WNTbBKY3GFb4MFXW/ULQc\"",
    "mtime": "2026-02-12T20:16:12.257Z",
    "size": 1099,
    "path": "../public/icons/brands/expeditedssl.svg"
  },
  "/icons/brands/facebook-f.svg": {
    "type": "image/svg+xml",
    "etag": "\"185-gHvo6bHFqkb86fEgGTMI5xMEQm4\"",
    "mtime": "2026-02-12T20:16:12.258Z",
    "size": 389,
    "path": "../public/icons/brands/facebook-f.svg"
  },
  "/icons/brands/facebook-messenger.svg": {
    "type": "image/svg+xml",
    "etag": "\"2b3-MQA5+VtC0Gcv55N1+cVEqd89Nlw\"",
    "mtime": "2026-02-12T20:16:12.257Z",
    "size": 691,
    "path": "../public/icons/brands/facebook-messenger.svg"
  },
  "/icons/brands/facebook-square.svg": {
    "type": "image/svg+xml",
    "etag": "\"1db-3HPC3o8D9Z6blMWo5tQcc9w6Oho\"",
    "mtime": "2026-02-12T20:16:12.258Z",
    "size": 475,
    "path": "../public/icons/brands/facebook-square.svg"
  },
  "/icons/brands/facebook.svg": {
    "type": "image/svg+xml",
    "etag": "\"1e1-4ISjscTPFbBn05jnpSuTDjGRxYA\"",
    "mtime": "2026-02-12T20:16:12.258Z",
    "size": 481,
    "path": "../public/icons/brands/facebook.svg"
  },
  "/icons/brands/fantasy-flight-games.svg": {
    "type": "image/svg+xml",
    "etag": "\"4fc-KubrxqGxDSkLFEEEttbQCW6txvI\"",
    "mtime": "2026-02-12T20:16:12.258Z",
    "size": 1276,
    "path": "../public/icons/brands/fantasy-flight-games.svg"
  },
  "/icons/brands/fedex.svg": {
    "type": "image/svg+xml",
    "etag": "\"3bc-DIdzn6Pfz0DdAoAIuwgxJN81N60\"",
    "mtime": "2026-02-12T20:16:12.258Z",
    "size": 956,
    "path": "../public/icons/brands/fedex.svg"
  },
  "/icons/brands/figma.svg": {
    "type": "image/svg+xml",
    "etag": "\"190-u+BHjNW6yC+O9CfSHEbIJE6PKus\"",
    "mtime": "2026-02-12T20:16:12.259Z",
    "size": 400,
    "path": "../public/icons/brands/figma.svg"
  },
  "/icons/brands/fedora.svg": {
    "type": "image/svg+xml",
    "etag": "\"94c-X6NzwfQGjPfbarYfp4Sd+UfJhQc\"",
    "mtime": "2026-02-12T20:16:12.258Z",
    "size": 2380,
    "path": "../public/icons/brands/fedora.svg"
  },
  "/icons/brands/firefox-browser.svg": {
    "type": "image/svg+xml",
    "etag": "\"719-SRvpenXz63cSjNTvWDF3P0wdniY\"",
    "mtime": "2026-02-12T20:16:12.259Z",
    "size": 1817,
    "path": "../public/icons/brands/firefox-browser.svg"
  },
  "/icons/brands/firefox.svg": {
    "type": "image/svg+xml",
    "etag": "\"90b-hWs2clRopXPikM98W9sKN0h5Ds0\"",
    "mtime": "2026-02-12T20:16:12.259Z",
    "size": 2315,
    "path": "../public/icons/brands/firefox.svg"
  },
  "/icons/brands/first-order-alt.svg": {
    "type": "image/svg+xml",
    "etag": "\"683-bH+FQYmW3KRq5GdHyhV6on0IF/Q\"",
    "mtime": "2026-02-12T20:16:12.260Z",
    "size": 1667,
    "path": "../public/icons/brands/first-order-alt.svg"
  },
  "/icons/brands/first-order.svg": {
    "type": "image/svg+xml",
    "etag": "\"563-pqrFvmldgWMUAibMBbJXPz8eJyw\"",
    "mtime": "2026-02-12T20:16:12.260Z",
    "size": 1379,
    "path": "../public/icons/brands/first-order.svg"
  },
  "/icons/brands/flickr.svg": {
    "type": "image/svg+xml",
    "etag": "\"204-uWGiB/J3cA0VJDDfr2WbcMmMphY\"",
    "mtime": "2026-02-12T20:16:12.260Z",
    "size": 516,
    "path": "../public/icons/brands/flickr.svg"
  },
  "/icons/brands/flipboard.svg": {
    "type": "image/svg+xml",
    "etag": "\"125-lgcxq2A9XFCLrLXNxiQaVMxiAP0\"",
    "mtime": "2026-02-12T20:16:12.261Z",
    "size": 293,
    "path": "../public/icons/brands/flipboard.svg"
  },
  "/icons/brands/fly.svg": {
    "type": "image/svg+xml",
    "etag": "\"36d-4EftnMgLL/8y/32bKV6hZgnC+yg\"",
    "mtime": "2026-02-12T20:16:12.261Z",
    "size": 877,
    "path": "../public/icons/brands/fly.svg"
  },
  "/icons/brands/font-awesome-alt.svg": {
    "type": "image/svg+xml",
    "etag": "\"3b7-G4fYaYJfduo67JAH61krnEk4uN8\"",
    "mtime": "2026-02-12T20:16:12.261Z",
    "size": 951,
    "path": "../public/icons/brands/font-awesome-alt.svg"
  },
  "/icons/brands/firstdraft.svg": {
    "type": "image/svg+xml",
    "etag": "\"194-qezQi0m1MaMYZThs7MApgE1nEow\"",
    "mtime": "2026-02-12T20:16:12.261Z",
    "size": 404,
    "path": "../public/icons/brands/firstdraft.svg"
  },
  "/icons/brands/font-awesome-flag.svg": {
    "type": "image/svg+xml",
    "etag": "\"31a-dCgGTrG2EYeBOk7FVZZFaQ42j5Y\"",
    "mtime": "2026-02-12T20:16:12.261Z",
    "size": 794,
    "path": "../public/icons/brands/font-awesome-flag.svg"
  },
  "/icons/brands/font-awesome-logo-full.svg": {
    "type": "image/svg+xml",
    "etag": "\"c3b-UbDMXGGWaGsla8DlkyXpQpC5JDE\"",
    "mtime": "2026-02-12T20:16:12.261Z",
    "size": 3131,
    "path": "../public/icons/brands/font-awesome-logo-full.svg"
  },
  "/icons/brands/font-awesome.svg": {
    "type": "image/svg+xml",
    "etag": "\"344-EXMBr9aqu3nOJHlDidr0++hHMNk\"",
    "mtime": "2026-02-12T20:16:12.261Z",
    "size": 836,
    "path": "../public/icons/brands/font-awesome.svg"
  },
  "/icons/brands/fonticons-fi.svg": {
    "type": "image/svg+xml",
    "etag": "\"2ef-bB3OsbPZPw09w97sxPen1yqpkFE\"",
    "mtime": "2026-02-12T20:16:12.262Z",
    "size": 751,
    "path": "../public/icons/brands/fonticons-fi.svg"
  },
  "/icons/brands/fonticons.svg": {
    "type": "image/svg+xml",
    "etag": "\"309-6QpGgLVNRBtK2ReNs3/3P05qnas\"",
    "mtime": "2026-02-12T20:16:12.262Z",
    "size": 777,
    "path": "../public/icons/brands/fonticons.svg"
  },
  "/icons/brands/fort-awesome-alt.svg": {
    "type": "image/svg+xml",
    "etag": "\"ef4-ZGJYcMnDceW2kuupXnfGXAWyMwo\"",
    "mtime": "2026-02-12T20:16:12.262Z",
    "size": 3828,
    "path": "../public/icons/brands/fort-awesome-alt.svg"
  },
  "/icons/brands/forumbee.svg": {
    "type": "image/svg+xml",
    "etag": "\"2f2-4OryD0UkdnxyGBBIdMNgi6ViySI\"",
    "mtime": "2026-02-12T20:16:12.262Z",
    "size": 754,
    "path": "../public/icons/brands/forumbee.svg"
  },
  "/icons/brands/fort-awesome.svg": {
    "type": "image/svg+xml",
    "etag": "\"484-Qc5AIVeYovtAFlcPbg5+rC3jnh0\"",
    "mtime": "2026-02-12T20:16:12.262Z",
    "size": 1156,
    "path": "../public/icons/brands/fort-awesome.svg"
  },
  "/icons/brands/foursquare.svg": {
    "type": "image/svg+xml",
    "etag": "\"2f8-LH+MYMWXnG+/A1opOaUmk849gDE\"",
    "mtime": "2026-02-12T20:16:12.262Z",
    "size": 760,
    "path": "../public/icons/brands/foursquare.svg"
  },
  "/icons/brands/free-code-camp.svg": {
    "type": "image/svg+xml",
    "etag": "\"56b-x+epTbwnAuKXC5Lt3DTD15ypbOc\"",
    "mtime": "2026-02-12T20:16:12.262Z",
    "size": 1387,
    "path": "../public/icons/brands/free-code-camp.svg"
  },
  "/icons/brands/freebsd.svg": {
    "type": "image/svg+xml",
    "etag": "\"2dd-GsFxMiyuI/kwj0Snzmi5l7usH50\"",
    "mtime": "2026-02-12T20:16:12.262Z",
    "size": 733,
    "path": "../public/icons/brands/freebsd.svg"
  },
  "/icons/brands/fulcrum.svg": {
    "type": "image/svg+xml",
    "etag": "\"1dc-tTReTNbmjZU4WxqV2dPHlVJn72M\"",
    "mtime": "2026-02-12T20:16:12.266Z",
    "size": 476,
    "path": "../public/icons/brands/fulcrum.svg"
  },
  "/icons/brands/galactic-republic.svg": {
    "type": "image/svg+xml",
    "etag": "\"6cc-XQXNZWBYYZwsmfUUp2OjAjxTsX8\"",
    "mtime": "2026-02-12T20:16:12.263Z",
    "size": 1740,
    "path": "../public/icons/brands/galactic-republic.svg"
  },
  "/icons/brands/galactic-senate.svg": {
    "type": "image/svg+xml",
    "etag": "\"b05-ZDNpXJ6BHTTbG6UwZ5Lifnqxp9M\"",
    "mtime": "2026-02-12T20:16:12.263Z",
    "size": 2821,
    "path": "../public/icons/brands/galactic-senate.svg"
  },
  "/icons/brands/get-pocket.svg": {
    "type": "image/svg+xml",
    "etag": "\"231-SsJzT1qlWhjh+c63n2mM98CscVY\"",
    "mtime": "2026-02-12T20:16:12.262Z",
    "size": 561,
    "path": "../public/icons/brands/get-pocket.svg"
  },
  "/icons/brands/gg-circle.svg": {
    "type": "image/svg+xml",
    "etag": "\"223-qUOHXd5l4k82xze4xvVTLBnfFMU\"",
    "mtime": "2026-02-12T20:16:12.263Z",
    "size": 547,
    "path": "../public/icons/brands/gg-circle.svg"
  },
  "/icons/brands/gg.svg": {
    "type": "image/svg+xml",
    "etag": "\"1de-Kjf6SonOUkw4N5YLHPGli92cxss\"",
    "mtime": "2026-02-12T20:16:12.263Z",
    "size": 478,
    "path": "../public/icons/brands/gg.svg"
  },
  "/icons/brands/git-alt.svg": {
    "type": "image/svg+xml",
    "etag": "\"2a3-XVBtSAG5TPnd9/TIB2/Xk4/6xFM\"",
    "mtime": "2026-02-12T20:16:12.263Z",
    "size": 675,
    "path": "../public/icons/brands/git-alt.svg"
  },
  "/icons/brands/git-square.svg": {
    "type": "image/svg+xml",
    "etag": "\"549-g8kHoVdgWGnGPSdSgrprNi+kcdQ\"",
    "mtime": "2026-02-12T20:16:12.263Z",
    "size": 1353,
    "path": "../public/icons/brands/git-square.svg"
  },
  "/icons/brands/git.svg": {
    "type": "image/svg+xml",
    "etag": "\"4d4-D2Tt0TG7Vki5MGe1wvEFHq3JMxs\"",
    "mtime": "2026-02-12T20:16:12.264Z",
    "size": 1236,
    "path": "../public/icons/brands/git.svg"
  },
  "/icons/brands/github-square.svg": {
    "type": "image/svg+xml",
    "etag": "\"65f-Ftgt4OoDVCmoxgUFNmLRuagAvPI\"",
    "mtime": "2026-02-12T20:16:12.265Z",
    "size": 1631,
    "path": "../public/icons/brands/github-square.svg"
  },
  "/icons/brands/github.svg": {
    "type": "image/svg+xml",
    "etag": "\"5f1-RRcmOKR6CjBd5Ji4Mheygd1qjc4\"",
    "mtime": "2026-02-12T20:16:12.265Z",
    "size": 1521,
    "path": "../public/icons/brands/github.svg"
  },
  "/icons/brands/gitkraken.svg": {
    "type": "image/svg+xml",
    "etag": "\"5d3-STCRwjySTnFZhkjSnuGXXDespcs\"",
    "mtime": "2026-02-12T20:16:12.265Z",
    "size": 1491,
    "path": "../public/icons/brands/gitkraken.svg"
  },
  "/icons/brands/github-alt.svg": {
    "type": "image/svg+xml",
    "etag": "\"3f9-NjoVx3PdvxY0QTpY3B3RQ2C33Uk\"",
    "mtime": "2026-02-12T20:16:12.264Z",
    "size": 1017,
    "path": "../public/icons/brands/github-alt.svg"
  },
  "/icons/brands/gitlab.svg": {
    "type": "image/svg+xml",
    "etag": "\"1eb-5zTa+OVFy3W0WM27TMPqbvLcw8U\"",
    "mtime": "2026-02-12T20:16:12.265Z",
    "size": 491,
    "path": "../public/icons/brands/gitlab.svg"
  },
  "/icons/brands/glide-g.svg": {
    "type": "image/svg+xml",
    "etag": "\"37f-d6lu4zdSprXTaznHrHJ0AwcgA+U\"",
    "mtime": "2026-02-12T20:16:12.265Z",
    "size": 895,
    "path": "../public/icons/brands/glide-g.svg"
  },
  "/icons/brands/gitter.svg": {
    "type": "image/svg+xml",
    "etag": "\"14b-3JaeBtQtz1PTu5TvybrOB0lc+as\"",
    "mtime": "2026-02-12T20:16:12.266Z",
    "size": 331,
    "path": "../public/icons/brands/gitter.svg"
  },
  "/icons/brands/glide.svg": {
    "type": "image/svg+xml",
    "etag": "\"3e0-1XgM6mjFSsPV+xe/9ixxjEWWgXQ\"",
    "mtime": "2026-02-12T20:16:12.265Z",
    "size": 992,
    "path": "../public/icons/brands/glide.svg"
  },
  "/icons/brands/gofore.svg": {
    "type": "image/svg+xml",
    "etag": "\"241-46I4RaMNyTAacBOIUz3LA7oYEaE\"",
    "mtime": "2026-02-12T20:16:12.265Z",
    "size": 577,
    "path": "../public/icons/brands/gofore.svg"
  },
  "/icons/brands/goodreads.svg": {
    "type": "image/svg+xml",
    "etag": "\"3b4-/LUwtEJAIH1y3PHbXOVzql5xkvY\"",
    "mtime": "2026-02-12T20:16:12.266Z",
    "size": 948,
    "path": "../public/icons/brands/goodreads.svg"
  },
  "/icons/brands/goodreads-g.svg": {
    "type": "image/svg+xml",
    "etag": "\"35c-PS9UQLsOBmMNrl3A0rPimHAWwvk\"",
    "mtime": "2026-02-12T20:16:12.265Z",
    "size": 860,
    "path": "../public/icons/brands/goodreads-g.svg"
  },
  "/icons/brands/google-drive.svg": {
    "type": "image/svg+xml",
    "etag": "\"162-2RsVIjM5p2K3GZye2vrlR8u4VWg\"",
    "mtime": "2026-02-12T20:16:12.266Z",
    "size": 354,
    "path": "../public/icons/brands/google-drive.svg"
  },
  "/icons/brands/google-pay.svg": {
    "type": "image/svg+xml",
    "etag": "\"652-ugtChoE1HzMc+94s39AHJs5NhBc\"",
    "mtime": "2026-02-12T20:16:12.266Z",
    "size": 1618,
    "path": "../public/icons/brands/google-pay.svg"
  },
  "/icons/brands/google-play.svg": {
    "type": "image/svg+xml",
    "etag": "\"1cf-Qayz5LXVSq0tsygAUd1luicUSJM\"",
    "mtime": "2026-02-12T20:16:12.266Z",
    "size": 463,
    "path": "../public/icons/brands/google-play.svg"
  },
  "/icons/brands/google-plus-g.svg": {
    "type": "image/svg+xml",
    "etag": "\"2b6-330oUErxSyBIoDPBaHrz2gkxEnU\"",
    "mtime": "2026-02-12T20:16:12.266Z",
    "size": 694,
    "path": "../public/icons/brands/google-plus-g.svg"
  },
  "/icons/brands/google-plus-square.svg": {
    "type": "image/svg+xml",
    "etag": "\"27b-NVJ8bKt/a/O62dND3ZSOvgGnWvw\"",
    "mtime": "2026-02-12T20:16:12.267Z",
    "size": 635,
    "path": "../public/icons/brands/google-plus-square.svg"
  },
  "/icons/brands/google-plus.svg": {
    "type": "image/svg+xml",
    "etag": "\"263-X1lK7Mp68t3UnffWoNCfLTK/TFs\"",
    "mtime": "2026-02-12T20:16:12.267Z",
    "size": 611,
    "path": "../public/icons/brands/google-plus.svg"
  },
  "/icons/brands/google-wallet.svg": {
    "type": "image/svg+xml",
    "etag": "\"2df-VL2yUxUU337AJdtcOZHTYCC8zr8\"",
    "mtime": "2026-02-12T20:16:12.267Z",
    "size": 735,
    "path": "../public/icons/brands/google-wallet.svg"
  },
  "/icons/brands/google.svg": {
    "type": "image/svg+xml",
    "etag": "\"1d0-Ti5q/Qv8pmXhw1TiAy25ppvrnqI\"",
    "mtime": "2026-02-12T20:16:12.266Z",
    "size": 464,
    "path": "../public/icons/brands/google.svg"
  },
  "/icons/brands/grav.svg": {
    "type": "image/svg+xml",
    "etag": "\"6e5-coxTiJjVO4p2mcSy9/yzxh+9cYo\"",
    "mtime": "2026-02-12T20:16:12.267Z",
    "size": 1765,
    "path": "../public/icons/brands/grav.svg"
  },
  "/icons/brands/gratipay.svg": {
    "type": "image/svg+xml",
    "etag": "\"1d6-wbS2hzsgrsX0g7sXKU09U3Qry/4\"",
    "mtime": "2026-02-12T20:16:12.267Z",
    "size": 470,
    "path": "../public/icons/brands/gratipay.svg"
  },
  "/icons/brands/gripfire.svg": {
    "type": "image/svg+xml",
    "etag": "\"33b-csykhJ48AikjZ1gafCwWuvpGKik\"",
    "mtime": "2026-02-12T20:16:12.267Z",
    "size": 827,
    "path": "../public/icons/brands/gripfire.svg"
  },
  "/icons/brands/grunt.svg": {
    "type": "image/svg+xml",
    "etag": "\"15fb-hxY6FlnXSc39l8TFsihdcbsvo/Q\"",
    "mtime": "2026-02-12T20:16:12.267Z",
    "size": 5627,
    "path": "../public/icons/brands/grunt.svg"
  },
  "/icons/brands/guilded.svg": {
    "type": "image/svg+xml",
    "etag": "\"25c-7ZI4c4ikmVwblB1cSb0qp/1YprY\"",
    "mtime": "2026-02-12T20:16:12.268Z",
    "size": 604,
    "path": "../public/icons/brands/guilded.svg"
  },
  "/icons/brands/gulp.svg": {
    "type": "image/svg+xml",
    "etag": "\"ab2-whZTfaLmRVXIyhwYc47FhwsiTBk\"",
    "mtime": "2026-02-12T20:16:12.267Z",
    "size": 2738,
    "path": "../public/icons/brands/gulp.svg"
  },
  "/icons/brands/hacker-news-square.svg": {
    "type": "image/svg+xml",
    "etag": "\"1e3-mYxWC9Msa5+h8o2Y/avfMZqP3wc\"",
    "mtime": "2026-02-12T20:16:12.272Z",
    "size": 483,
    "path": "../public/icons/brands/hacker-news-square.svg"
  },
  "/icons/brands/hacker-news.svg": {
    "type": "image/svg+xml",
    "etag": "\"18d-JfdQINWTf65EmQT/223HZxuTu2o\"",
    "mtime": "2026-02-12T20:16:12.267Z",
    "size": 397,
    "path": "../public/icons/brands/hacker-news.svg"
  },
  "/icons/brands/hackerrank.svg": {
    "type": "image/svg+xml",
    "etag": "\"3d4-iFcgvph9RZyJJw73IiukA+TQ/4s\"",
    "mtime": "2026-02-12T20:16:12.268Z",
    "size": 980,
    "path": "../public/icons/brands/hackerrank.svg"
  },
  "/icons/brands/hips.svg": {
    "type": "image/svg+xml",
    "etag": "\"62e-Mt7BaMc0V0J4hBmYUQO35klor2E\"",
    "mtime": "2026-02-12T20:16:12.268Z",
    "size": 1582,
    "path": "../public/icons/brands/hips.svg"
  },
  "/icons/brands/hire-a-helper.svg": {
    "type": "image/svg+xml",
    "etag": "\"4af-ESnf1WgUwk32/1O2o20GwOYHT/0\"",
    "mtime": "2026-02-12T20:16:12.268Z",
    "size": 1199,
    "path": "../public/icons/brands/hire-a-helper.svg"
  },
  "/icons/brands/hive.svg": {
    "type": "image/svg+xml",
    "etag": "\"3c1-9dBJwAfOtk0w1N1hjBy/OBqFaGg\"",
    "mtime": "2026-02-12T20:16:12.269Z",
    "size": 961,
    "path": "../public/icons/brands/hive.svg"
  },
  "/icons/brands/hooli.svg": {
    "type": "image/svg+xml",
    "etag": "\"657-AogLEhSBdTUmThQQCucWbcvMBv4\"",
    "mtime": "2026-02-12T20:16:12.268Z",
    "size": 1623,
    "path": "../public/icons/brands/hooli.svg"
  },
  "/icons/brands/hornbill.svg": {
    "type": "image/svg+xml",
    "etag": "\"4cf-XFfwougvm5P+L3dcchlRPNt7phE\"",
    "mtime": "2026-02-12T20:16:12.268Z",
    "size": 1231,
    "path": "../public/icons/brands/hornbill.svg"
  },
  "/icons/brands/hotjar.svg": {
    "type": "image/svg+xml",
    "etag": "\"1e7-ifmaDP53WgQG5X5KM1vBwdDiCEk\"",
    "mtime": "2026-02-12T20:16:12.268Z",
    "size": 487,
    "path": "../public/icons/brands/hotjar.svg"
  },
  "/icons/brands/houzz.svg": {
    "type": "image/svg+xml",
    "etag": "\"117-qXeNhBHzNXau7GOj2taTBIlCSnE\"",
    "mtime": "2026-02-12T20:16:12.269Z",
    "size": 279,
    "path": "../public/icons/brands/houzz.svg"
  },
  "/icons/brands/html5.svg": {
    "type": "image/svg+xml",
    "etag": "\"1a0-vZH6u+C17IU7X7u/dci+56jyBbU\"",
    "mtime": "2026-02-12T20:16:12.269Z",
    "size": 416,
    "path": "../public/icons/brands/html5.svg"
  },
  "/icons/brands/hubspot.svg": {
    "type": "image/svg+xml",
    "etag": "\"3c9-0aliehaeBMy4kH7kDRBRZhN56bc\"",
    "mtime": "2026-02-12T20:16:12.268Z",
    "size": 969,
    "path": "../public/icons/brands/hubspot.svg"
  },
  "/icons/brands/ideal.svg": {
    "type": "image/svg+xml",
    "etag": "\"3e2-w0yOAXQTWDef5Suhufzho3M3nHg\"",
    "mtime": "2026-02-12T20:16:12.293Z",
    "size": 994,
    "path": "../public/icons/brands/ideal.svg"
  },
  "/icons/brands/imdb.svg": {
    "type": "image/svg+xml",
    "etag": "\"37a-YdZTv0723QHSBSw5WYwr5dDpa7o\"",
    "mtime": "2026-02-12T20:16:12.269Z",
    "size": 890,
    "path": "../public/icons/brands/imdb.svg"
  },
  "/icons/brands/innosoft.svg": {
    "type": "image/svg+xml",
    "etag": "\"36a-nZYyNYB3ThNyf5eZi4DXP8Pw0C8\"",
    "mtime": "2026-02-12T20:16:12.270Z",
    "size": 874,
    "path": "../public/icons/brands/innosoft.svg"
  },
  "/icons/brands/instagram-square.svg": {
    "type": "image/svg+xml",
    "etag": "\"496-5rLJaQPN+7QmjdAQg7k6PoOTH1c\"",
    "mtime": "2026-02-12T20:16:12.272Z",
    "size": 1174,
    "path": "../public/icons/brands/instagram-square.svg"
  },
  "/icons/brands/instagram.svg": {
    "type": "image/svg+xml",
    "etag": "\"473-PfvNjcWf7sKBvsl5z5rHPmoSJfM\"",
    "mtime": "2026-02-12T20:16:12.269Z",
    "size": 1139,
    "path": "../public/icons/brands/instagram.svg"
  },
  "/icons/brands/instalod.svg": {
    "type": "image/svg+xml",
    "etag": "\"18d-6GoEqD3XUCPn+ykzPppt1+uLjoE\"",
    "mtime": "2026-02-12T20:16:12.272Z",
    "size": 397,
    "path": "../public/icons/brands/instalod.svg"
  },
  "/icons/brands/intercom.svg": {
    "type": "image/svg+xml",
    "etag": "\"31f-mRXf87Dlh3zzeFjg8wgSz5Ax14I\"",
    "mtime": "2026-02-12T20:16:12.270Z",
    "size": 799,
    "path": "../public/icons/brands/intercom.svg"
  },
  "/icons/brands/internet-explorer.svg": {
    "type": "image/svg+xml",
    "etag": "\"432-DJLTgLDwhy8d+j5QqGniAibnVRQ\"",
    "mtime": "2026-02-12T20:16:12.272Z",
    "size": 1074,
    "path": "../public/icons/brands/internet-explorer.svg"
  },
  "/icons/brands/invision.svg": {
    "type": "image/svg+xml",
    "etag": "\"334-ixgBEjBSiayYIW+4DLMJ+tDDmQU\"",
    "mtime": "2026-02-12T20:16:12.274Z",
    "size": 820,
    "path": "../public/icons/brands/invision.svg"
  },
  "/icons/brands/ioxhost.svg": {
    "type": "image/svg+xml",
    "etag": "\"348-dnicSgJohlHE3+CB5DAQPdjih90\"",
    "mtime": "2026-02-12T20:16:12.275Z",
    "size": 840,
    "path": "../public/icons/brands/ioxhost.svg"
  },
  "/icons/brands/itch-io.svg": {
    "type": "image/svg+xml",
    "etag": "\"57a-Qetxjrv19JVLh+4myd2D6lVldTQ\"",
    "mtime": "2026-02-12T20:16:12.274Z",
    "size": 1402,
    "path": "../public/icons/brands/itch-io.svg"
  },
  "/icons/brands/itunes-note.svg": {
    "type": "image/svg+xml",
    "etag": "\"31f-nUXGDyWc2cAJuLJ7FWXkry8i1TY\"",
    "mtime": "2026-02-12T20:16:12.274Z",
    "size": 799,
    "path": "../public/icons/brands/itunes-note.svg"
  },
  "/icons/brands/jedi-order.svg": {
    "type": "image/svg+xml",
    "etag": "\"369-b7B0Pu01Ntr2ubEKzFLKn6n2CIE\"",
    "mtime": "2026-02-12T20:16:12.275Z",
    "size": 873,
    "path": "../public/icons/brands/jedi-order.svg"
  },
  "/icons/brands/java.svg": {
    "type": "image/svg+xml",
    "etag": "\"527-4lIDcL0XShkI/4ZU+plvZNP0GRc\"",
    "mtime": "2026-02-12T20:16:12.274Z",
    "size": 1319,
    "path": "../public/icons/brands/java.svg"
  },
  "/icons/brands/itunes.svg": {
    "type": "image/svg+xml",
    "etag": "\"441-LtQA+lk0qJtFEygBagiOikLrVjg\"",
    "mtime": "2026-02-12T20:16:12.273Z",
    "size": 1089,
    "path": "../public/icons/brands/itunes.svg"
  },
  "/icons/brands/jenkins.svg": {
    "type": "image/svg+xml",
    "etag": "\"117e-apDJdzQb2zv5x+EGV0VKpAI8pZM\"",
    "mtime": "2026-02-12T20:16:12.276Z",
    "size": 4478,
    "path": "../public/icons/brands/jenkins.svg"
  },
  "/icons/brands/jira.svg": {
    "type": "image/svg+xml",
    "etag": "\"1b4-Xnmhd3RMeTA6KMgOovkbKOLUdYI\"",
    "mtime": "2026-02-12T20:16:12.275Z",
    "size": 436,
    "path": "../public/icons/brands/jira.svg"
  },
  "/icons/brands/joget.svg": {
    "type": "image/svg+xml",
    "etag": "\"3f6-HdjnPMQeug0pJNkLudIlk+8DMeE\"",
    "mtime": "2026-02-12T20:16:12.275Z",
    "size": 1014,
    "path": "../public/icons/brands/joget.svg"
  },
  "/icons/brands/jsfiddle.svg": {
    "type": "image/svg+xml",
    "etag": "\"7f8-Ejf/euhtDOxO5eQE9QADEUY++9Q\"",
    "mtime": "2026-02-12T20:16:12.276Z",
    "size": 2040,
    "path": "../public/icons/brands/jsfiddle.svg"
  },
  "/icons/brands/js.svg": {
    "type": "image/svg+xml",
    "etag": "\"2ec-3/gKPmnzRmatKSy4hapNKzrjjqg\"",
    "mtime": "2026-02-12T20:16:12.276Z",
    "size": 748,
    "path": "../public/icons/brands/js.svg"
  },
  "/icons/brands/joomla.svg": {
    "type": "image/svg+xml",
    "etag": "\"502-L/uVf3ESxJNKfIhwgtKvulY/0KA\"",
    "mtime": "2026-02-12T20:16:12.275Z",
    "size": 1282,
    "path": "../public/icons/brands/joomla.svg"
  },
  "/icons/brands/kaggle.svg": {
    "type": "image/svg+xml",
    "etag": "\"1c7-xUgHZIO56SQIzhDwWRWOcOUAnhY\"",
    "mtime": "2026-02-12T20:16:12.276Z",
    "size": 455,
    "path": "../public/icons/brands/kaggle.svg"
  },
  "/icons/brands/keycdn.svg": {
    "type": "image/svg+xml",
    "etag": "\"678-/AAU1CEg4BScSkJfkkR/49++5g8\"",
    "mtime": "2026-02-12T20:16:12.276Z",
    "size": 1656,
    "path": "../public/icons/brands/keycdn.svg"
  },
  "/icons/brands/kickstarter-k.svg": {
    "type": "image/svg+xml",
    "etag": "\"1fd-azmJJrrZxOuHH2s9KJVM31/96Pg\"",
    "mtime": "2026-02-12T20:16:12.276Z",
    "size": 509,
    "path": "../public/icons/brands/kickstarter-k.svg"
  },
  "/icons/brands/js-square.svg": {
    "type": "image/svg+xml",
    "etag": "\"342-iAa7sbfSayh6oxqsww6laZPAl+A\"",
    "mtime": "2026-02-12T20:16:12.275Z",
    "size": 834,
    "path": "../public/icons/brands/js-square.svg"
  },
  "/icons/brands/keybase.svg": {
    "type": "image/svg+xml",
    "etag": "\"6a6-thwIMtrfGRi1m5bTVGct1DL/mMM\"",
    "mtime": "2026-02-12T20:16:12.279Z",
    "size": 1702,
    "path": "../public/icons/brands/keybase.svg"
  },
  "/icons/brands/kickstarter.svg": {
    "type": "image/svg+xml",
    "etag": "\"25e-obKZguxMwVVhZ60KXRjRR8tH9KQ\"",
    "mtime": "2026-02-12T20:16:12.276Z",
    "size": 606,
    "path": "../public/icons/brands/kickstarter.svg"
  },
  "/icons/brands/korvue.svg": {
    "type": "image/svg+xml",
    "etag": "\"1d3-NjSV4vf86s/dxNMBV58QVw4XVXk\"",
    "mtime": "2026-02-12T20:16:12.276Z",
    "size": 467,
    "path": "../public/icons/brands/korvue.svg"
  },
  "/icons/brands/laravel.svg": {
    "type": "image/svg+xml",
    "etag": "\"736-u6LMQcsG34YqHyn2d+2M7QQc6+o\"",
    "mtime": "2026-02-12T20:16:12.276Z",
    "size": 1846,
    "path": "../public/icons/brands/laravel.svg"
  },
  "/icons/brands/lastfm-square.svg": {
    "type": "image/svg+xml",
    "etag": "\"36a-Zt/bbP9IVIorpoSqtwB9NLYVpRo\"",
    "mtime": "2026-02-12T20:16:12.276Z",
    "size": 874,
    "path": "../public/icons/brands/lastfm-square.svg"
  },
  "/icons/brands/lastfm.svg": {
    "type": "image/svg+xml",
    "etag": "\"312-IMqg5rGhFY9nNR4C9jpFAuUzJlE\"",
    "mtime": "2026-02-12T20:16:12.280Z",
    "size": 786,
    "path": "../public/icons/brands/lastfm.svg"
  },
  "/icons/brands/leanpub.svg": {
    "type": "image/svg+xml",
    "etag": "\"514-jEzD7ZVoS9xaqYJ6BGZmm5lhYXk\"",
    "mtime": "2026-02-12T20:16:12.277Z",
    "size": 1300,
    "path": "../public/icons/brands/leanpub.svg"
  },
  "/icons/brands/less.svg": {
    "type": "image/svg+xml",
    "etag": "\"7b9-+apdbIqN54pBHx198UlxYjmvs/A\"",
    "mtime": "2026-02-12T20:16:12.277Z",
    "size": 1977,
    "path": "../public/icons/brands/less.svg"
  },
  "/icons/brands/line.svg": {
    "type": "image/svg+xml",
    "etag": "\"53e-lsKa3liI+n2j08ZuklY+OqhRfZQ\"",
    "mtime": "2026-02-12T20:16:12.277Z",
    "size": 1342,
    "path": "../public/icons/brands/line.svg"
  },
  "/icons/brands/linkedin-in.svg": {
    "type": "image/svg+xml",
    "etag": "\"205-Ig5y0+phsbOC8JiCJgTkHwIpxUU\"",
    "mtime": "2026-02-12T20:16:12.277Z",
    "size": 517,
    "path": "../public/icons/brands/linkedin-in.svg"
  },
  "/icons/brands/linkedin.svg": {
    "type": "image/svg+xml",
    "etag": "\"281-t4EiwmZ+HMWdqU6K/i3Z9I70ldo\"",
    "mtime": "2026-02-12T20:16:12.278Z",
    "size": 641,
    "path": "../public/icons/brands/linkedin.svg"
  },
  "/icons/brands/linux.svg": {
    "type": "image/svg+xml",
    "etag": "\"e79-xUsv1uO96s+ySebTKrHzOqfS8oM\"",
    "mtime": "2026-02-12T20:16:12.278Z",
    "size": 3705,
    "path": "../public/icons/brands/linux.svg"
  },
  "/icons/brands/linode.svg": {
    "type": "image/svg+xml",
    "etag": "\"5c2-Ea/5vL5vMCz5qCIzLn+MXPS6bp0\"",
    "mtime": "2026-02-12T20:16:12.277Z",
    "size": 1474,
    "path": "../public/icons/brands/linode.svg"
  },
  "/icons/brands/mailchimp.svg": {
    "type": "image/svg+xml",
    "etag": "\"cca-HqYt6wuIMTFk3mZSi4W8IM6Rs2c\"",
    "mtime": "2026-02-12T20:16:12.279Z",
    "size": 3274,
    "path": "../public/icons/brands/mailchimp.svg"
  },
  "/icons/brands/magento.svg": {
    "type": "image/svg+xml",
    "etag": "\"1a0-ZRJitZUC1KXm7Hr670j4A5zRSqs\"",
    "mtime": "2026-02-12T20:16:12.278Z",
    "size": 416,
    "path": "../public/icons/brands/magento.svg"
  },
  "/icons/brands/lyft.svg": {
    "type": "image/svg+xml",
    "etag": "\"32c-SwDiz7ewN4wyKrJ9PzioD7BlIiQ\"",
    "mtime": "2026-02-12T20:16:12.278Z",
    "size": 812,
    "path": "../public/icons/brands/lyft.svg"
  },
  "/icons/brands/mandalorian.svg": {
    "type": "image/svg+xml",
    "etag": "\"17ed-oGThdOVynHpDS2st+vRF/1G05+Y\"",
    "mtime": "2026-02-12T20:16:12.279Z",
    "size": 6125,
    "path": "../public/icons/brands/mandalorian.svg"
  },
  "/icons/brands/markdown.svg": {
    "type": "image/svg+xml",
    "etag": "\"1f0-2DnakQEXdAMWrtoM14biQCP1ob4\"",
    "mtime": "2026-02-12T20:16:12.279Z",
    "size": 496,
    "path": "../public/icons/brands/markdown.svg"
  },
  "/icons/brands/mastodon.svg": {
    "type": "image/svg+xml",
    "etag": "\"340-boDo7zoNBIa+XHInJMnLSMIU1dE\"",
    "mtime": "2026-02-12T20:16:12.280Z",
    "size": 832,
    "path": "../public/icons/brands/mastodon.svg"
  },
  "/icons/brands/maxcdn.svg": {
    "type": "image/svg+xml",
    "etag": "\"1b5-/TdU2AWJyZ91qavku4M9sawlSJ8\"",
    "mtime": "2026-02-12T20:16:12.280Z",
    "size": 437,
    "path": "../public/icons/brands/maxcdn.svg"
  },
  "/icons/brands/medium-m.svg": {
    "type": "image/svg+xml",
    "etag": "\"226-j2o3pVvdQEw4Lgx5aCbZ2shmu3w\"",
    "mtime": "2026-02-12T20:16:12.280Z",
    "size": 550,
    "path": "../public/icons/brands/medium-m.svg"
  },
  "/icons/brands/medapps.svg": {
    "type": "image/svg+xml",
    "etag": "\"409-upjjJqrWL7nnCi46bbfBjmQCu7I\"",
    "mtime": "2026-02-12T20:16:12.280Z",
    "size": 1033,
    "path": "../public/icons/brands/medapps.svg"
  },
  "/icons/brands/mdb.svg": {
    "type": "image/svg+xml",
    "etag": "\"302-9uSr+L37/n+LZN9QRKk2oSgoM2k\"",
    "mtime": "2026-02-12T20:16:12.280Z",
    "size": 770,
    "path": "../public/icons/brands/mdb.svg"
  },
  "/icons/brands/medium.svg": {
    "type": "image/svg+xml",
    "etag": "\"229-a1bV6VIrh3NrhC3FiwU9rHhsdqk\"",
    "mtime": "2026-02-12T20:16:12.281Z",
    "size": 553,
    "path": "../public/icons/brands/medium.svg"
  },
  "/icons/brands/meetup.svg": {
    "type": "image/svg+xml",
    "etag": "\"8dd-YTnkXo8I7AzUjJrNKJJUng+7ju0\"",
    "mtime": "2026-02-12T20:16:12.281Z",
    "size": 2269,
    "path": "../public/icons/brands/meetup.svg"
  },
  "/icons/brands/medrt.svg": {
    "type": "image/svg+xml",
    "etag": "\"3cd-3oWqk7dZwYFgNv5ZZm04qi2oS0k\"",
    "mtime": "2026-02-12T20:16:12.281Z",
    "size": 973,
    "path": "../public/icons/brands/medrt.svg"
  },
  "/icons/brands/megaport.svg": {
    "type": "image/svg+xml",
    "etag": "\"236-Ea9NIHw92Be5peKbmoCObztCbyk\"",
    "mtime": "2026-02-12T20:16:12.281Z",
    "size": 566,
    "path": "../public/icons/brands/megaport.svg"
  },
  "/icons/brands/mendeley.svg": {
    "type": "image/svg+xml",
    "etag": "\"369-AZgLQLsQxNvdYPnU5dgyICF5Hcc\"",
    "mtime": "2026-02-12T20:16:12.281Z",
    "size": 873,
    "path": "../public/icons/brands/mendeley.svg"
  },
  "/icons/brands/microblog.svg": {
    "type": "image/svg+xml",
    "etag": "\"2fd-POFXqK7bJ2TF18AQzKY7A92eJ6U\"",
    "mtime": "2026-02-12T20:16:12.281Z",
    "size": 765,
    "path": "../public/icons/brands/microblog.svg"
  },
  "/icons/brands/microsoft.svg": {
    "type": "image/svg+xml",
    "etag": "\"144-I/mZ4EZqR6Rz9xhaT8PLSZP01Yw\"",
    "mtime": "2026-02-12T20:16:12.281Z",
    "size": 324,
    "path": "../public/icons/brands/microsoft.svg"
  },
  "/icons/brands/mix.svg": {
    "type": "image/svg+xml",
    "etag": "\"169-a4F5ZPvIOPJfjYBh7LApp2ZKgTI\"",
    "mtime": "2026-02-12T20:16:12.281Z",
    "size": 361,
    "path": "../public/icons/brands/mix.svg"
  },
  "/icons/brands/mixcloud.svg": {
    "type": "image/svg+xml",
    "etag": "\"5e8-KgrXcQVitL3c9GHB/x64atZKDgI\"",
    "mtime": "2026-02-12T20:16:12.281Z",
    "size": 1512,
    "path": "../public/icons/brands/mixcloud.svg"
  },
  "/icons/brands/mixer.svg": {
    "type": "image/svg+xml",
    "etag": "\"283-6u3FRE8qcjERngBbZEY5MRLoVUE\"",
    "mtime": "2026-02-12T20:16:12.281Z",
    "size": 643,
    "path": "../public/icons/brands/mixer.svg"
  },
  "/icons/brands/mizuni.svg": {
    "type": "image/svg+xml",
    "etag": "\"23e-LXCzVcX6S+mW7t4DP49merBtrq4\"",
    "mtime": "2026-02-12T20:16:12.281Z",
    "size": 574,
    "path": "../public/icons/brands/mizuni.svg"
  },
  "/icons/brands/modx.svg": {
    "type": "image/svg+xml",
    "etag": "\"181-LgWaSHSV3WfgeFupE1FqwmCcn5M\"",
    "mtime": "2026-02-12T20:16:12.282Z",
    "size": 385,
    "path": "../public/icons/brands/modx.svg"
  },
  "/icons/brands/monero.svg": {
    "type": "image/svg+xml",
    "etag": "\"1af-qoIGbiK2TTG7gx8K/KwtYoDIUZ0\"",
    "mtime": "2026-02-12T20:16:12.282Z",
    "size": 431,
    "path": "../public/icons/brands/monero.svg"
  },
  "/icons/brands/napster.svg": {
    "type": "image/svg+xml",
    "etag": "\"45d-3/xt9YdSbpDahFrIJlZnvCSemKo\"",
    "mtime": "2026-02-12T20:16:12.282Z",
    "size": 1117,
    "path": "../public/icons/brands/napster.svg"
  },
  "/icons/brands/neos.svg": {
    "type": "image/svg+xml",
    "etag": "\"240-gtZr8QRIUGt1krY0irLRheM+lAc\"",
    "mtime": "2026-02-12T20:16:12.282Z",
    "size": 576,
    "path": "../public/icons/brands/neos.svg"
  },
  "/icons/brands/nimblr.svg": {
    "type": "image/svg+xml",
    "etag": "\"2b3-t0sJ5YRGXrX8oB9bjFXm3S5WBHU\"",
    "mtime": "2026-02-12T20:16:12.282Z",
    "size": 691,
    "path": "../public/icons/brands/nimblr.svg"
  },
  "/icons/brands/node-js.svg": {
    "type": "image/svg+xml",
    "etag": "\"515-cVuyVZSHC4/NWRezn7tT6nPMQ0k\"",
    "mtime": "2026-02-12T20:16:12.282Z",
    "size": 1301,
    "path": "../public/icons/brands/node-js.svg"
  },
  "/icons/brands/node.svg": {
    "type": "image/svg+xml",
    "etag": "\"cb6-RRwAY0VFh8X3DPTheTS0yEIAAJ4\"",
    "mtime": "2026-02-12T20:16:12.286Z",
    "size": 3254,
    "path": "../public/icons/brands/node.svg"
  },
  "/icons/brands/nutritionix.svg": {
    "type": "image/svg+xml",
    "etag": "\"663-BpKd3dYcsKuQkKMvoZlUViuctLA\"",
    "mtime": "2026-02-12T20:16:12.283Z",
    "size": 1635,
    "path": "../public/icons/brands/nutritionix.svg"
  },
  "/icons/brands/ns8.svg": {
    "type": "image/svg+xml",
    "etag": "\"8e1-0AApjxN3JFB6HmKrf2eEfUmvGO0\"",
    "mtime": "2026-02-12T20:16:12.282Z",
    "size": 2273,
    "path": "../public/icons/brands/ns8.svg"
  },
  "/icons/brands/old-republic.svg": {
    "type": "image/svg+xml",
    "etag": "\"2c5c-Z/oAGPB6pc30uFKMwfBHa43PZXA\"",
    "mtime": "2026-02-12T20:16:12.283Z",
    "size": 11356,
    "path": "../public/icons/brands/old-republic.svg"
  },
  "/icons/brands/npm.svg": {
    "type": "image/svg+xml",
    "etag": "\"187-IyIEqiwvR74JNrZix/xyaD4ndI8\"",
    "mtime": "2026-02-12T20:16:12.282Z",
    "size": 391,
    "path": "../public/icons/brands/npm.svg"
  },
  "/icons/brands/odnoklassniki-square.svg": {
    "type": "image/svg+xml",
    "etag": "\"389-/Q4n/ujF1PlVWxza8FHgUDrrsh0\"",
    "mtime": "2026-02-12T20:16:12.283Z",
    "size": 905,
    "path": "../public/icons/brands/odnoklassniki-square.svg"
  },
  "/icons/brands/octopus-deploy.svg": {
    "type": "image/svg+xml",
    "etag": "\"3d2-o9IE5Hym1rG1bXAxzCVlRNanbdM\"",
    "mtime": "2026-02-12T20:16:12.283Z",
    "size": 978,
    "path": "../public/icons/brands/octopus-deploy.svg"
  },
  "/icons/brands/opencart.svg": {
    "type": "image/svg+xml",
    "etag": "\"233-gh2MwTLyeP7vsRWEhLIbzuq9Cl4\"",
    "mtime": "2026-02-12T20:16:12.283Z",
    "size": 563,
    "path": "../public/icons/brands/opencart.svg"
  },
  "/icons/brands/odnoklassniki.svg": {
    "type": "image/svg+xml",
    "etag": "\"320-5FtVsx7Efxb5zz7G/45JUA0ls3Y\"",
    "mtime": "2026-02-12T20:16:12.283Z",
    "size": 800,
    "path": "../public/icons/brands/odnoklassniki.svg"
  },
  "/icons/brands/opera.svg": {
    "type": "image/svg+xml",
    "etag": "\"277-I//SDfGNj3yxbG/ic4LEil/YDb0\"",
    "mtime": "2026-02-12T20:16:12.283Z",
    "size": 631,
    "path": "../public/icons/brands/opera.svg"
  },
  "/icons/brands/openid.svg": {
    "type": "image/svg+xml",
    "etag": "\"1d7-LkERKT3JHMLfC9vwSAL+R3JftI0\"",
    "mtime": "2026-02-12T20:16:12.283Z",
    "size": 471,
    "path": "../public/icons/brands/openid.svg"
  },
  "/icons/brands/optin-monster.svg": {
    "type": "image/svg+xml",
    "etag": "\"1318-zg8UovnTzYSIeMg8FaUdSp7/WhM\"",
    "mtime": "2026-02-12T20:16:12.283Z",
    "size": 4888,
    "path": "../public/icons/brands/optin-monster.svg"
  },
  "/icons/brands/orcid.svg": {
    "type": "image/svg+xml",
    "etag": "\"244-3jKp+i7E691wJ48Ok6yciyTBs70\"",
    "mtime": "2026-02-12T20:16:12.284Z",
    "size": 580,
    "path": "../public/icons/brands/orcid.svg"
  },
  "/icons/brands/osi.svg": {
    "type": "image/svg+xml",
    "etag": "\"444-4LXUgLsvK9wXgTJMK1IIjSc9frc\"",
    "mtime": "2026-02-12T20:16:12.284Z",
    "size": 1092,
    "path": "../public/icons/brands/osi.svg"
  },
  "/icons/brands/page4.svg": {
    "type": "image/svg+xml",
    "etag": "\"3ad-bc3Amkprk0M1uUHjlDayEQ0jRB0\"",
    "mtime": "2026-02-12T20:16:12.284Z",
    "size": 941,
    "path": "../public/icons/brands/page4.svg"
  },
  "/icons/brands/pagelines.svg": {
    "type": "image/svg+xml",
    "etag": "\"2bd-GfuczUMUn2qlwiX/Y1xBjoNYMZc\"",
    "mtime": "2026-02-12T20:16:12.284Z",
    "size": 701,
    "path": "../public/icons/brands/pagelines.svg"
  },
  "/icons/brands/palfed.svg": {
    "type": "image/svg+xml",
    "etag": "\"3d3-D16/gfSkwS3onrFliPjGp0NZFTg\"",
    "mtime": "2026-02-12T20:16:12.284Z",
    "size": 979,
    "path": "../public/icons/brands/palfed.svg"
  },
  "/icons/brands/patreon.svg": {
    "type": "image/svg+xml",
    "etag": "\"176-fLsZ6j1GTGMQ2c0QK5iTmXFqfo8\"",
    "mtime": "2026-02-12T20:16:12.284Z",
    "size": 374,
    "path": "../public/icons/brands/patreon.svg"
  },
  "/icons/brands/paypal.svg": {
    "type": "image/svg+xml",
    "etag": "\"302-9Mi289JIXc42EBSop0G3Cv4vFEI\"",
    "mtime": "2026-02-12T20:16:12.284Z",
    "size": 770,
    "path": "../public/icons/brands/paypal.svg"
  },
  "/icons/brands/penny-arcade.svg": {
    "type": "image/svg+xml",
    "etag": "\"53b-MPy/HZBAd4jOanDyA4SJ1VOCCnk\"",
    "mtime": "2026-02-12T20:16:12.284Z",
    "size": 1339,
    "path": "../public/icons/brands/penny-arcade.svg"
  },
  "/icons/brands/perbyte.svg": {
    "type": "image/svg+xml",
    "etag": "\"373-4lVmIxfjICFQ/am27JWn5UgBZVE\"",
    "mtime": "2026-02-12T20:16:12.284Z",
    "size": 883,
    "path": "../public/icons/brands/perbyte.svg"
  },
  "/icons/brands/periscope.svg": {
    "type": "image/svg+xml",
    "etag": "\"2e9-ixiGdKI5ZIkMQYU/bZFvdcNSajQ\"",
    "mtime": "2026-02-12T20:16:12.284Z",
    "size": 745,
    "path": "../public/icons/brands/periscope.svg"
  },
  "/icons/brands/phabricator.svg": {
    "type": "image/svg+xml",
    "etag": "\"48d-sddcNYUhB/xgiptFTPTlRWfgmQU\"",
    "mtime": "2026-02-12T20:16:12.284Z",
    "size": 1165,
    "path": "../public/icons/brands/phabricator.svg"
  },
  "/icons/brands/phoenix-squadron.svg": {
    "type": "image/svg+xml",
    "etag": "\"6c6-lV0UkvZnOWnRctbaLXbJhSHqB3c\"",
    "mtime": "2026-02-12T20:16:12.285Z",
    "size": 1734,
    "path": "../public/icons/brands/phoenix-squadron.svg"
  },
  "/icons/brands/php.svg": {
    "type": "image/svg+xml",
    "etag": "\"3dd-ocXodscPdMs1EuPZ2dIz/mL7V+g\"",
    "mtime": "2026-02-12T20:16:12.285Z",
    "size": 989,
    "path": "../public/icons/brands/php.svg"
  },
  "/icons/brands/phoenix-framework.svg": {
    "type": "image/svg+xml",
    "etag": "\"a45-khcxGTGSk4virquV4ieadKtN5oA\"",
    "mtime": "2026-02-12T20:16:12.285Z",
    "size": 2629,
    "path": "../public/icons/brands/phoenix-framework.svg"
  },
  "/icons/brands/pied-piper-alt.svg": {
    "type": "image/svg+xml",
    "etag": "\"711-sSSG/P67fUgbc8mH9ySOD2XZkBw\"",
    "mtime": "2026-02-12T20:16:12.285Z",
    "size": 1809,
    "path": "../public/icons/brands/pied-piper-alt.svg"
  },
  "/icons/brands/pied-piper-hat.svg": {
    "type": "image/svg+xml",
    "etag": "\"2f5-rMTyBZymH0r4RK6BtPLa+sVy3Ws\"",
    "mtime": "2026-02-12T20:16:12.285Z",
    "size": 757,
    "path": "../public/icons/brands/pied-piper-hat.svg"
  },
  "/icons/brands/pied-piper-pp.svg": {
    "type": "image/svg+xml",
    "etag": "\"36f-6OQObgm1VekBYSkzfAfMcQ0XSl4\"",
    "mtime": "2026-02-12T20:16:12.285Z",
    "size": 879,
    "path": "../public/icons/brands/pied-piper-pp.svg"
  },
  "/icons/brands/pied-piper.svg": {
    "type": "image/svg+xml",
    "etag": "\"2fe-G0/mnyOLQ03WaLfUNz7bneKhxlc\"",
    "mtime": "2026-02-12T20:16:12.285Z",
    "size": 766,
    "path": "../public/icons/brands/pied-piper.svg"
  },
  "/icons/brands/pinterest-p.svg": {
    "type": "image/svg+xml",
    "etag": "\"2c8-GgrY2HpJ8lABaIBzPevJsvqOsxo\"",
    "mtime": "2026-02-12T20:16:12.285Z",
    "size": 712,
    "path": "../public/icons/brands/pinterest-p.svg"
  },
  "/icons/brands/pinterest-square.svg": {
    "type": "image/svg+xml",
    "etag": "\"34e-NniQnaTdUyICfRtPwQhouxtu5Ww\"",
    "mtime": "2026-02-12T20:16:12.286Z",
    "size": 846,
    "path": "../public/icons/brands/pinterest-square.svg"
  },
  "/icons/brands/pied-piper-square.svg": {
    "type": "image/svg+xml",
    "etag": "\"1f4-47WmdVm15ZKrB3ARXTV39fhuwNE\"",
    "mtime": "2026-02-12T20:16:12.285Z",
    "size": 500,
    "path": "../public/icons/brands/pied-piper-square.svg"
  },
  "/icons/brands/pinterest.svg": {
    "type": "image/svg+xml",
    "etag": "\"373-snaiiYG4wWEqQJjWkXVAdftoeRQ\"",
    "mtime": "2026-02-12T20:16:12.286Z",
    "size": 883,
    "path": "../public/icons/brands/pinterest.svg"
  },
  "/icons/brands/product-hunt.svg": {
    "type": "image/svg+xml",
    "etag": "\"1d1-2KeYn4/MVwm5zX08kVnlN7wh03k\"",
    "mtime": "2026-02-12T20:16:12.286Z",
    "size": 465,
    "path": "../public/icons/brands/product-hunt.svg"
  },
  "/icons/brands/playstation.svg": {
    "type": "image/svg+xml",
    "etag": "\"32b-wlv1tnzZzozlGvYs9b3p1Nafo0w\"",
    "mtime": "2026-02-12T20:16:12.286Z",
    "size": 811,
    "path": "../public/icons/brands/playstation.svg"
  },
  "/icons/brands/pushed.svg": {
    "type": "image/svg+xml",
    "etag": "\"2a8-ReWnOiJsob+wZ8Mz8ulzGerZHo0\"",
    "mtime": "2026-02-12T20:16:12.286Z",
    "size": 680,
    "path": "../public/icons/brands/pushed.svg"
  },
  "/icons/brands/python.svg": {
    "type": "image/svg+xml",
    "etag": "\"3d5-qrbDcZVIEg1Fbe7PnfLri4fmCFw\"",
    "mtime": "2026-02-12T20:16:12.286Z",
    "size": 981,
    "path": "../public/icons/brands/python.svg"
  },
  "/icons/brands/qq.svg": {
    "type": "image/svg+xml",
    "etag": "\"310-tjPfm8TO4Q8WIrsCiOAK8eCjrxo\"",
    "mtime": "2026-02-12T20:16:12.286Z",
    "size": 784,
    "path": "../public/icons/brands/qq.svg"
  },
  "/icons/brands/quinscape.svg": {
    "type": "image/svg+xml",
    "etag": "\"223-2BcsjA6DzgWm43RgWCjYXjfm5fg\"",
    "mtime": "2026-02-12T20:16:12.286Z",
    "size": 547,
    "path": "../public/icons/brands/quinscape.svg"
  },
  "/icons/brands/quora.svg": {
    "type": "image/svg+xml",
    "etag": "\"2c5-2SvMm+wHRw5LqVPTjTQV00Unytg\"",
    "mtime": "2026-02-12T20:16:12.286Z",
    "size": 709,
    "path": "../public/icons/brands/quora.svg"
  },
  "/icons/brands/r-project.svg": {
    "type": "image/svg+xml",
    "etag": "\"2fa-fq4DHbJ+NhUsyI4AaYGMhizPX4o\"",
    "mtime": "2026-02-12T20:16:12.286Z",
    "size": 762,
    "path": "../public/icons/brands/r-project.svg"
  },
  "/icons/brands/ravelry.svg": {
    "type": "image/svg+xml",
    "etag": "\"6f8-rJNXP0VTJ5KGsZq2MdM5ahn/es4\"",
    "mtime": "2026-02-12T20:16:12.287Z",
    "size": 1784,
    "path": "../public/icons/brands/ravelry.svg"
  },
  "/icons/brands/raspberry-pi.svg": {
    "type": "image/svg+xml",
    "etag": "\"f74-/rbtny4jfyNYfXsD5xvGuNQ19W4\"",
    "mtime": "2026-02-12T20:16:12.287Z",
    "size": 3956,
    "path": "../public/icons/brands/raspberry-pi.svg"
  },
  "/icons/brands/react.svg": {
    "type": "image/svg+xml",
    "etag": "\"be5-3L1+K7NCjIrVMtxDEo9l6X6KvOY\"",
    "mtime": "2026-02-12T20:16:12.287Z",
    "size": 3045,
    "path": "../public/icons/brands/react.svg"
  },
  "/icons/brands/reacteurope.svg": {
    "type": "image/svg+xml",
    "etag": "\"15f9-jculA3+p4//ici4OyuTJ3oQfXGc\"",
    "mtime": "2026-02-12T20:16:12.287Z",
    "size": 5625,
    "path": "../public/icons/brands/reacteurope.svg"
  },
  "/icons/brands/rebel.svg": {
    "type": "image/svg+xml",
    "etag": "\"300-ON6IP08s+H7Jcw22/wR/3k+OeaA\"",
    "mtime": "2026-02-12T20:16:12.287Z",
    "size": 768,
    "path": "../public/icons/brands/rebel.svg"
  },
  "/icons/brands/red-river.svg": {
    "type": "image/svg+xml",
    "etag": "\"272-2tCsk3NU+rRNrVPlxgqdIMnfh2Q\"",
    "mtime": "2026-02-12T20:16:12.287Z",
    "size": 626,
    "path": "../public/icons/brands/red-river.svg"
  },
  "/icons/brands/readme.svg": {
    "type": "image/svg+xml",
    "etag": "\"4b0-mGiJgZVWVedzY7AYBezAqTJYFv0\"",
    "mtime": "2026-02-12T20:16:12.287Z",
    "size": 1200,
    "path": "../public/icons/brands/readme.svg"
  },
  "/icons/brands/reddit-square.svg": {
    "type": "image/svg+xml",
    "etag": "\"496-weVU4y/DV+BMwuVof6k76BXawbs\"",
    "mtime": "2026-02-12T20:16:12.288Z",
    "size": 1174,
    "path": "../public/icons/brands/reddit-square.svg"
  },
  "/icons/brands/reddit-alien.svg": {
    "type": "image/svg+xml",
    "etag": "\"427-ItD+TDbA4gAsKBM9WnXKRKXmOpo\"",
    "mtime": "2026-02-12T20:16:12.287Z",
    "size": 1063,
    "path": "../public/icons/brands/reddit-alien.svg"
  },
  "/icons/brands/reddit.svg": {
    "type": "image/svg+xml",
    "etag": "\"465-42jkpKUq6ETqyC8YhSEP1YcjWVQ\"",
    "mtime": "2026-02-12T20:16:12.288Z",
    "size": 1125,
    "path": "../public/icons/brands/reddit.svg"
  },
  "/icons/brands/redhat.svg": {
    "type": "image/svg+xml",
    "etag": "\"30c-T5Z+SsQcwF31HtA2zVybo5olLXE\"",
    "mtime": "2026-02-12T20:16:12.288Z",
    "size": 780,
    "path": "../public/icons/brands/redhat.svg"
  },
  "/icons/brands/renren.svg": {
    "type": "image/svg+xml",
    "etag": "\"225-XnPBmiRMSzMieDN+WsD7b4Mha3A\"",
    "mtime": "2026-02-12T20:16:12.288Z",
    "size": 549,
    "path": "../public/icons/brands/renren.svg"
  },
  "/icons/brands/replyd.svg": {
    "type": "image/svg+xml",
    "etag": "\"59a-cz5cp5km6oDFBCJbo0Vrr3hf0b8\"",
    "mtime": "2026-02-12T20:16:12.288Z",
    "size": 1434,
    "path": "../public/icons/brands/replyd.svg"
  },
  "/icons/brands/researchgate.svg": {
    "type": "image/svg+xml",
    "etag": "\"3b5-OD8kndmg4Kgpkz4Exw6tq1AWh0Y\"",
    "mtime": "2026-02-12T20:16:12.289Z",
    "size": 949,
    "path": "../public/icons/brands/researchgate.svg"
  },
  "/icons/brands/resolving.svg": {
    "type": "image/svg+xml",
    "etag": "\"2b2-vcFJUXoi8bQsgF357NKa+Biw+kI\"",
    "mtime": "2026-02-12T20:16:12.288Z",
    "size": 690,
    "path": "../public/icons/brands/resolving.svg"
  },
  "/icons/brands/rev.svg": {
    "type": "image/svg+xml",
    "etag": "\"244-ZlYMaE6bnTZ8krivc7n83Rt3f8Q\"",
    "mtime": "2026-02-12T20:16:12.288Z",
    "size": 580,
    "path": "../public/icons/brands/rev.svg"
  },
  "/icons/brands/rocketchat.svg": {
    "type": "image/svg+xml",
    "etag": "\"5dc-fxlrv2A1os4G9dcgHo12IbShwnI\"",
    "mtime": "2026-02-12T20:16:12.289Z",
    "size": 1500,
    "path": "../public/icons/brands/rocketchat.svg"
  },
  "/icons/brands/rust.svg": {
    "type": "image/svg+xml",
    "etag": "\"fcd-A57I2z1amJoIhuu5J4195G/ZvN0\"",
    "mtime": "2026-02-12T20:16:12.289Z",
    "size": 4045,
    "path": "../public/icons/brands/rust.svg"
  },
  "/icons/brands/rockrms.svg": {
    "type": "image/svg+xml",
    "etag": "\"1e0-8H8P8aNdGCIVZp7EOjJZsKWjzMU\"",
    "mtime": "2026-02-12T20:16:12.290Z",
    "size": 480,
    "path": "../public/icons/brands/rockrms.svg"
  },
  "/icons/brands/safari.svg": {
    "type": "image/svg+xml",
    "etag": "\"728-jjiQgcnyAPLuyPyGG0cJvC0sn1M\"",
    "mtime": "2026-02-12T20:16:12.290Z",
    "size": 1832,
    "path": "../public/icons/brands/safari.svg"
  },
  "/icons/brands/sass.svg": {
    "type": "image/svg+xml",
    "etag": "\"c98-2qt0CQaPUitUJT7jul/hW+5JnLo\"",
    "mtime": "2026-02-12T20:16:12.289Z",
    "size": 3224,
    "path": "../public/icons/brands/sass.svg"
  },
  "/icons/brands/salesforce.svg": {
    "type": "image/svg+xml",
    "etag": "\"113f-pxRb6AjgwEb5Hyu+bVjhupzCmnk\"",
    "mtime": "2026-02-12T20:16:12.289Z",
    "size": 4415,
    "path": "../public/icons/brands/salesforce.svg"
  },
  "/icons/brands/schlix.svg": {
    "type": "image/svg+xml",
    "etag": "\"3e9-bjORIqoX+Xc8ODhttOWo0E23m/0\"",
    "mtime": "2026-02-12T20:16:12.289Z",
    "size": 1001,
    "path": "../public/icons/brands/schlix.svg"
  },
  "/icons/brands/scribd.svg": {
    "type": "image/svg+xml",
    "etag": "\"36a-uXoKlXMQ20PReLVLAwOZ6I+gK+I\"",
    "mtime": "2026-02-12T20:16:12.290Z",
    "size": 874,
    "path": "../public/icons/brands/scribd.svg"
  },
  "/icons/brands/searchengin.svg": {
    "type": "image/svg+xml",
    "etag": "\"37e-K0JQn6A/imz5ZoiooZMKzi9mrXU\"",
    "mtime": "2026-02-12T20:16:12.289Z",
    "size": 894,
    "path": "../public/icons/brands/searchengin.svg"
  },
  "/icons/brands/sellsy.svg": {
    "type": "image/svg+xml",
    "etag": "\"543-k7Pmnsejz+WLVE1zQsU/Mx8yZl8\"",
    "mtime": "2026-02-12T20:16:12.290Z",
    "size": 1347,
    "path": "../public/icons/brands/sellsy.svg"
  },
  "/icons/brands/sellcast.svg": {
    "type": "image/svg+xml",
    "etag": "\"3c7-uwJLsONnKI4J2e/gNGWQZR+DIMY\"",
    "mtime": "2026-02-12T20:16:12.289Z",
    "size": 967,
    "path": "../public/icons/brands/sellcast.svg"
  },
  "/icons/brands/servicestack.svg": {
    "type": "image/svg+xml",
    "etag": "\"183-9qTZaNwUYl8AqZO81lqyhx2TbDE\"",
    "mtime": "2026-02-12T20:16:12.291Z",
    "size": 387,
    "path": "../public/icons/brands/servicestack.svg"
  },
  "/icons/brands/shirtsinbulk.svg": {
    "type": "image/svg+xml",
    "etag": "\"6bd-Jw1DEtLhJLfylOYMRt2OtQ6CZaA\"",
    "mtime": "2026-02-12T20:16:12.291Z",
    "size": 1725,
    "path": "../public/icons/brands/shirtsinbulk.svg"
  },
  "/icons/brands/sistrix.svg": {
    "type": "image/svg+xml",
    "etag": "\"1ee-gu7oUQJIRazuXzDedeVXh8DJDDY\"",
    "mtime": "2026-02-12T20:16:12.293Z",
    "size": 494,
    "path": "../public/icons/brands/sistrix.svg"
  },
  "/icons/brands/shopify.svg": {
    "type": "image/svg+xml",
    "etag": "\"5ae-JgcVJDV0blmACB7U+C0ptzW/oA0\"",
    "mtime": "2026-02-12T20:16:12.292Z",
    "size": 1454,
    "path": "../public/icons/brands/shopify.svg"
  },
  "/icons/brands/shopware.svg": {
    "type": "image/svg+xml",
    "etag": "\"2d8-NNxX4mTWTUMS3H3CmrH8J3u3laU\"",
    "mtime": "2026-02-12T20:16:12.291Z",
    "size": 728,
    "path": "../public/icons/brands/shopware.svg"
  },
  "/icons/brands/sith.svg": {
    "type": "image/svg+xml",
    "etag": "\"3c3-bQx+MwW3Yfq6Yo3m49OfpcCsv7c\"",
    "mtime": "2026-02-12T20:16:12.291Z",
    "size": 963,
    "path": "../public/icons/brands/sith.svg"
  },
  "/icons/brands/simplybuilt.svg": {
    "type": "image/svg+xml",
    "etag": "\"29e-YdPpoVE2PjqXbBQrFuHhxzCIEiM\"",
    "mtime": "2026-02-12T20:16:12.292Z",
    "size": 670,
    "path": "../public/icons/brands/simplybuilt.svg"
  },
  "/icons/brands/sketch.svg": {
    "type": "image/svg+xml",
    "etag": "\"223-Z0Jyw9RTFnkJPEmfOtyvjREf9Mc\"",
    "mtime": "2026-02-12T20:16:12.292Z",
    "size": 547,
    "path": "../public/icons/brands/sketch.svg"
  },
  "/icons/brands/skyatlas.svg": {
    "type": "image/svg+xml",
    "etag": "\"36c-pXnElGCYPR81T6GDPmUh02ExRlw\"",
    "mtime": "2026-02-12T20:16:12.292Z",
    "size": 876,
    "path": "../public/icons/brands/skyatlas.svg"
  },
  "/icons/brands/skype.svg": {
    "type": "image/svg+xml",
    "etag": "\"39a-aO7jw7JdWuxsGGzjjnFZS3cbm3c\"",
    "mtime": "2026-02-12T20:16:12.292Z",
    "size": 922,
    "path": "../public/icons/brands/skype.svg"
  },
  "/icons/brands/slideshare.svg": {
    "type": "image/svg+xml",
    "etag": "\"3e7-gQAM3X/C9V28eVuVQaPIDmGfDTo\"",
    "mtime": "2026-02-12T20:16:12.293Z",
    "size": 999,
    "path": "../public/icons/brands/slideshare.svg"
  },
  "/icons/brands/slack-hash.svg": {
    "type": "image/svg+xml",
    "etag": "\"38c-Zz6cpiiPAiGFy7Szh6BeMHolYrA\"",
    "mtime": "2026-02-12T20:16:12.293Z",
    "size": 908,
    "path": "../public/icons/brands/slack-hash.svg"
  },
  "/icons/brands/slack.svg": {
    "type": "image/svg+xml",
    "etag": "\"4b6-lqz8Hezzym/MK+eP7v6t4MInnZs\"",
    "mtime": "2026-02-12T20:16:12.293Z",
    "size": 1206,
    "path": "../public/icons/brands/slack.svg"
  },
  "/icons/brands/snapchat-ghost.svg": {
    "type": "image/svg+xml",
    "etag": "\"653-QCDQWpmFtNRVjKN0AOdX8RpkzyU\"",
    "mtime": "2026-02-12T20:16:12.294Z",
    "size": 1619,
    "path": "../public/icons/brands/snapchat-ghost.svg"
  },
  "/icons/brands/snapchat.svg": {
    "type": "image/svg+xml",
    "etag": "\"4a8-5oD0Y+SzPik7N3FVGaAZwQbQQDA\"",
    "mtime": "2026-02-12T20:16:12.294Z",
    "size": 1192,
    "path": "../public/icons/brands/snapchat.svg"
  },
  "/icons/brands/snapchat-square.svg": {
    "type": "image/svg+xml",
    "etag": "\"4cb-T0cnG3HOxXXsVgtfwdg4YwLljYo\"",
    "mtime": "2026-02-12T20:16:12.293Z",
    "size": 1227,
    "path": "../public/icons/brands/snapchat-square.svg"
  },
  "/icons/brands/soundcloud.svg": {
    "type": "image/svg+xml",
    "etag": "\"915-WUOxo7hx6Nr/ONzkmFWqJQ1p/Xo\"",
    "mtime": "2026-02-12T20:16:12.295Z",
    "size": 2325,
    "path": "../public/icons/brands/soundcloud.svg"
  },
  "/icons/brands/sourcetree.svg": {
    "type": "image/svg+xml",
    "etag": "\"1d7-yp+LsxhqTJufRBZFJY7MmUYFo+Q\"",
    "mtime": "2026-02-12T20:16:12.295Z",
    "size": 471,
    "path": "../public/icons/brands/sourcetree.svg"
  },
  "/icons/brands/speaker-deck.svg": {
    "type": "image/svg+xml",
    "etag": "\"241-LUG5kQLVt4jtsNKwjPz2HcCHO94\"",
    "mtime": "2026-02-12T20:16:12.295Z",
    "size": 577,
    "path": "../public/icons/brands/speaker-deck.svg"
  },
  "/icons/brands/speakap.svg": {
    "type": "image/svg+xml",
    "etag": "\"304-GSJf6mrKmt+6ESYzEJaVvf+EOWg\"",
    "mtime": "2026-02-12T20:16:12.294Z",
    "size": 772,
    "path": "../public/icons/brands/speakap.svg"
  },
  "/icons/brands/spotify.svg": {
    "type": "image/svg+xml",
    "etag": "\"3ee-NsqzJSq96H+8JC1labzr5QiX82g\"",
    "mtime": "2026-02-12T20:16:12.295Z",
    "size": 1006,
    "path": "../public/icons/brands/spotify.svg"
  },
  "/icons/brands/squarespace.svg": {
    "type": "image/svg+xml",
    "etag": "\"52a-L9TcRWL/QERebr6Txyu0gZ9+VVU\"",
    "mtime": "2026-02-12T20:16:12.297Z",
    "size": 1322,
    "path": "../public/icons/brands/squarespace.svg"
  },
  "/icons/brands/stack-exchange.svg": {
    "type": "image/svg+xml",
    "etag": "\"1b5-4oFZ89cRffHRpFRIm7D5RhPmfdE\"",
    "mtime": "2026-02-12T20:16:12.295Z",
    "size": 437,
    "path": "../public/icons/brands/stack-exchange.svg"
  },
  "/icons/brands/stack-overflow.svg": {
    "type": "image/svg+xml",
    "etag": "\"1b4-HEkZxfui9qWvvHpny/drzLW47YE\"",
    "mtime": "2026-02-12T20:16:12.295Z",
    "size": 436,
    "path": "../public/icons/brands/stack-overflow.svg"
  },
  "/icons/brands/stackpath.svg": {
    "type": "image/svg+xml",
    "etag": "\"39b-sNkabg93yMXmbvcVBaDOY/JpX6E\"",
    "mtime": "2026-02-12T20:16:12.296Z",
    "size": 923,
    "path": "../public/icons/brands/stackpath.svg"
  },
  "/icons/brands/staylinked.svg": {
    "type": "image/svg+xml",
    "etag": "\"3a4-jSaIIRsvsIr/snTYQw2MTd6dUmQ\"",
    "mtime": "2026-02-12T20:16:12.297Z",
    "size": 932,
    "path": "../public/icons/brands/staylinked.svg"
  },
  "/icons/brands/steam-square.svg": {
    "type": "image/svg+xml",
    "etag": "\"3c6-r2vk2YGUYd7LWtqq7XGFFVKee2Q\"",
    "mtime": "2026-02-12T20:16:12.299Z",
    "size": 966,
    "path": "../public/icons/brands/steam-square.svg"
  },
  "/icons/brands/steam.svg": {
    "type": "image/svg+xml",
    "etag": "\"3b5-CJqwbCvqxwvDTdqHgLoWZjU9KDc\"",
    "mtime": "2026-02-12T20:16:12.297Z",
    "size": 949,
    "path": "../public/icons/brands/steam.svg"
  },
  "/icons/brands/steam-symbol.svg": {
    "type": "image/svg+xml",
    "etag": "\"33f-5sHVVFWSil790jR+Wdw4V5cBtDQ\"",
    "mtime": "2026-02-12T20:16:12.298Z",
    "size": 831,
    "path": "../public/icons/brands/steam-symbol.svg"
  },
  "/icons/brands/strava.svg": {
    "type": "image/svg+xml",
    "etag": "\"141-1cN6m9C+eyqpfOnP7XDjw2xO6ec\"",
    "mtime": "2026-02-12T20:16:12.297Z",
    "size": 321,
    "path": "../public/icons/brands/strava.svg"
  },
  "/icons/brands/stripe-s.svg": {
    "type": "image/svg+xml",
    "etag": "\"208-jqYOGqYM6j9KYc8svnTy0T8mXxk\"",
    "mtime": "2026-02-12T20:16:12.300Z",
    "size": 520,
    "path": "../public/icons/brands/stripe-s.svg"
  },
  "/icons/brands/sticker-mule.svg": {
    "type": "image/svg+xml",
    "etag": "\"6ec-9f3UZ/shfOly8ocNJLCMpGF2dZg\"",
    "mtime": "2026-02-12T20:16:12.299Z",
    "size": 1772,
    "path": "../public/icons/brands/sticker-mule.svg"
  },
  "/icons/brands/stripe.svg": {
    "type": "image/svg+xml",
    "etag": "\"538-5qtfcaMTNzd/IiAGOormgEHgmuw\"",
    "mtime": "2026-02-12T20:16:12.298Z",
    "size": 1336,
    "path": "../public/icons/brands/stripe.svg"
  },
  "/icons/brands/stumbleupon-circle.svg": {
    "type": "image/svg+xml",
    "etag": "\"2d4-lB7hDt6FqErMz5RKWkR9It1mXlQ\"",
    "mtime": "2026-02-12T20:16:12.298Z",
    "size": 724,
    "path": "../public/icons/brands/stumbleupon-circle.svg"
  },
  "/icons/brands/studiovinari.svg": {
    "type": "image/svg+xml",
    "etag": "\"2c0-NhJV5p6tas6xanDTPd0hmz8MMvo\"",
    "mtime": "2026-02-12T20:16:12.299Z",
    "size": 704,
    "path": "../public/icons/brands/studiovinari.svg"
  },
  "/icons/brands/stumbleupon.svg": {
    "type": "image/svg+xml",
    "etag": "\"27b-gs2y3A7Y2bvr8FkNwXpt8Zlonjw\"",
    "mtime": "2026-02-12T20:16:12.299Z",
    "size": 635,
    "path": "../public/icons/brands/stumbleupon.svg"
  },
  "/icons/brands/superpowers.svg": {
    "type": "image/svg+xml",
    "etag": "\"219-H5bL5eYFajSFZQL4FHEPqIdE3kw\"",
    "mtime": "2026-02-12T20:16:12.300Z",
    "size": 537,
    "path": "../public/icons/brands/superpowers.svg"
  },
  "/icons/brands/supple.svg": {
    "type": "image/svg+xml",
    "etag": "\"739-aPo4DioXOMRvt5TBlHLHVTFC7mw\"",
    "mtime": "2026-02-12T20:16:12.323Z",
    "size": 1849,
    "path": "../public/icons/brands/supple.svg"
  },
  "/icons/brands/suse.svg": {
    "type": "image/svg+xml",
    "etag": "\"592-7FQHgwlY0xzvhHSCco5J/0w6fNI\"",
    "mtime": "2026-02-12T20:16:12.300Z",
    "size": 1426,
    "path": "../public/icons/brands/suse.svg"
  },
  "/icons/brands/swift.svg": {
    "type": "image/svg+xml",
    "etag": "\"69a-dnkV1sL3K6NMYDysUiuNY40aOHo\"",
    "mtime": "2026-02-12T20:16:12.300Z",
    "size": 1690,
    "path": "../public/icons/brands/swift.svg"
  },
  "/icons/brands/teamspeak.svg": {
    "type": "image/svg+xml",
    "etag": "\"4bc-sqLrSisrnZ/AoCqsr7WtprhQQmY\"",
    "mtime": "2026-02-12T20:16:12.301Z",
    "size": 1212,
    "path": "../public/icons/brands/teamspeak.svg"
  },
  "/icons/brands/symfony.svg": {
    "type": "image/svg+xml",
    "etag": "\"528-Cf5IKBqntdDEhguCnvKGEVGUa1I\"",
    "mtime": "2026-02-12T20:16:12.301Z",
    "size": 1320,
    "path": "../public/icons/brands/symfony.svg"
  },
  "/icons/brands/telegram-plane.svg": {
    "type": "image/svg+xml",
    "etag": "\"1c9-6YlDoJAJuepQ2Y+c6R4lC7rf4OM\"",
    "mtime": "2026-02-12T20:16:12.300Z",
    "size": 457,
    "path": "../public/icons/brands/telegram-plane.svg"
  },
  "/icons/brands/telegram.svg": {
    "type": "image/svg+xml",
    "etag": "\"201-Ool7CM+3DJ9r+6WjVqQG41ZSsGk\"",
    "mtime": "2026-02-12T20:16:12.300Z",
    "size": 513,
    "path": "../public/icons/brands/telegram.svg"
  },
  "/icons/brands/the-red-yeti.svg": {
    "type": "image/svg+xml",
    "etag": "\"18a2-bN6fo7NNaGSlq+7rRJHQCYN61+8\"",
    "mtime": "2026-02-12T20:16:12.301Z",
    "size": 6306,
    "path": "../public/icons/brands/the-red-yeti.svg"
  },
  "/icons/brands/tencent-weibo.svg": {
    "type": "image/svg+xml",
    "etag": "\"279-G0GfmK7NgtfwJC/VEzLsedqBk7w\"",
    "mtime": "2026-02-12T20:16:12.301Z",
    "size": 633,
    "path": "../public/icons/brands/tencent-weibo.svg"
  },
  "/icons/brands/themeco.svg": {
    "type": "image/svg+xml",
    "etag": "\"37d-b+PZEEVceBcyeUOisswvnIvktjg\"",
    "mtime": "2026-02-12T20:16:12.301Z",
    "size": 893,
    "path": "../public/icons/brands/themeco.svg"
  },
  "/icons/brands/themeisle.svg": {
    "type": "image/svg+xml",
    "etag": "\"d58-LXZ+Xgtt/xOX7vcwajYLLI9GVqw\"",
    "mtime": "2026-02-12T20:16:12.301Z",
    "size": 3416,
    "path": "../public/icons/brands/themeisle.svg"
  },
  "/icons/brands/think-peaks.svg": {
    "type": "image/svg+xml",
    "etag": "\"15c-ChVpwilBrFX4zFXtV6rRBDE8mWk\"",
    "mtime": "2026-02-12T20:16:12.301Z",
    "size": 348,
    "path": "../public/icons/brands/think-peaks.svg"
  },
  "/icons/brands/trade-federation.svg": {
    "type": "image/svg+xml",
    "etag": "\"5eb-V2OGRGRIYgM62WQ6F6JJhAzusis\"",
    "mtime": "2026-02-12T20:16:12.301Z",
    "size": 1515,
    "path": "../public/icons/brands/trade-federation.svg"
  },
  "/icons/brands/tiktok.svg": {
    "type": "image/svg+xml",
    "etag": "\"1b4-MasEBc3BoFJtu2S2f/CcIEbmE6M\"",
    "mtime": "2026-02-12T20:16:12.302Z",
    "size": 436,
    "path": "../public/icons/brands/tiktok.svg"
  },
  "/icons/brands/trello.svg": {
    "type": "image/svg+xml",
    "etag": "\"26d-FZi2D7liViJ7Wv1e5s4B/Tm85o4\"",
    "mtime": "2026-02-12T20:16:12.322Z",
    "size": 621,
    "path": "../public/icons/brands/trello.svg"
  },
  "/icons/brands/tumblr.svg": {
    "type": "image/svg+xml",
    "etag": "\"246-yZuVFsuYoLHO24xy0e9NfaI3HX8\"",
    "mtime": "2026-02-12T20:16:12.302Z",
    "size": 582,
    "path": "../public/icons/brands/tumblr.svg"
  },
  "/icons/brands/twitch.svg": {
    "type": "image/svg+xml",
    "etag": "\"1a1-mkKK5qhUjSeQo1WfCacwEAtsml8\"",
    "mtime": "2026-02-12T20:16:12.302Z",
    "size": 417,
    "path": "../public/icons/brands/twitch.svg"
  },
  "/icons/brands/tumblr-square.svg": {
    "type": "image/svg+xml",
    "etag": "\"2b6-lvGpFuB2rXkD97jjTVk45XA7p7o\"",
    "mtime": "2026-02-12T20:16:12.302Z",
    "size": 694,
    "path": "../public/icons/brands/tumblr-square.svg"
  },
  "/icons/brands/twitter.svg": {
    "type": "image/svg+xml",
    "etag": "\"3f0-nmofIIITaoRW8I5hvpuc8I+DX8Y\"",
    "mtime": "2026-02-12T20:16:12.306Z",
    "size": 1008,
    "path": "../public/icons/brands/twitter.svg"
  },
  "/icons/brands/twitter-square.svg": {
    "type": "image/svg+xml",
    "etag": "\"328-KgRxVf20/9AHYoMM+b5AI/ZUA94\"",
    "mtime": "2026-02-12T20:16:12.303Z",
    "size": 808,
    "path": "../public/icons/brands/twitter-square.svg"
  },
  "/icons/brands/tripadvisor.svg": {
    "type": "image/svg+xml",
    "etag": "\"322-rgDWRuZRQquMP3ukS1eebsWzN4k\"",
    "mtime": "2026-02-12T20:16:12.302Z",
    "size": 802,
    "path": "../public/icons/brands/tripadvisor.svg"
  },
  "/icons/brands/typo3.svg": {
    "type": "image/svg+xml",
    "etag": "\"21b-XxzG3fq5EN/0jmaEomk4gzVNM90\"",
    "mtime": "2026-02-12T20:16:12.305Z",
    "size": 539,
    "path": "../public/icons/brands/typo3.svg"
  },
  "/icons/brands/uber.svg": {
    "type": "image/svg+xml",
    "etag": "\"255-hxCQwLnjFfaHqmQXh3B5+77r3m8\"",
    "mtime": "2026-02-12T20:16:12.305Z",
    "size": 597,
    "path": "../public/icons/brands/uber.svg"
  },
  "/icons/brands/ubuntu.svg": {
    "type": "image/svg+xml",
    "etag": "\"43e-K1HNAg+s+sw7HoqCZm2PQT7AA8M\"",
    "mtime": "2026-02-12T20:16:12.305Z",
    "size": 1086,
    "path": "../public/icons/brands/ubuntu.svg"
  },
  "/icons/brands/umbraco.svg": {
    "type": "image/svg+xml",
    "etag": "\"458-Yu8SId0+19gft2kv+5tTWbxr22Q\"",
    "mtime": "2026-02-12T20:16:12.306Z",
    "size": 1112,
    "path": "../public/icons/brands/umbraco.svg"
  },
  "/icons/brands/uikit.svg": {
    "type": "image/svg+xml",
    "etag": "\"174-LZfMMetnJ39f8ACCayffI1PkbL4\"",
    "mtime": "2026-02-12T20:16:12.306Z",
    "size": 372,
    "path": "../public/icons/brands/uikit.svg"
  },
  "/icons/brands/uncharted.svg": {
    "type": "image/svg+xml",
    "etag": "\"655-lCLcn9MrnM8WMqatBR/VQ6MlZwc\"",
    "mtime": "2026-02-12T20:16:12.309Z",
    "size": 1621,
    "path": "../public/icons/brands/uncharted.svg"
  },
  "/icons/brands/unity.svg": {
    "type": "image/svg+xml",
    "etag": "\"1e3-0aQactG6NGxEZR5McOTWjgElRZg\"",
    "mtime": "2026-02-12T20:16:12.309Z",
    "size": 483,
    "path": "../public/icons/brands/unity.svg"
  },
  "/icons/brands/uniregistry.svg": {
    "type": "image/svg+xml",
    "etag": "\"4a1-Vo3Cnr+AVh9Zv/atbJpmjntPLNo\"",
    "mtime": "2026-02-12T20:16:12.309Z",
    "size": 1185,
    "path": "../public/icons/brands/uniregistry.svg"
  },
  "/icons/brands/unsplash.svg": {
    "type": "image/svg+xml",
    "etag": "\"12e-auu/GQ7P167/dNUs6zhx9fGsARE\"",
    "mtime": "2026-02-12T20:16:12.309Z",
    "size": 302,
    "path": "../public/icons/brands/unsplash.svg"
  },
  "/icons/brands/untappd.svg": {
    "type": "image/svg+xml",
    "etag": "\"4eb-sX0Owx8m6nuwH5YyxQvAGi1QclU\"",
    "mtime": "2026-02-12T20:16:12.309Z",
    "size": 1259,
    "path": "../public/icons/brands/untappd.svg"
  },
  "/icons/brands/usb.svg": {
    "type": "image/svg+xml",
    "etag": "\"382-OQpC7qrocQE/gJUzG5I3zXMHsRo\"",
    "mtime": "2026-02-12T20:16:12.310Z",
    "size": 898,
    "path": "../public/icons/brands/usb.svg"
  },
  "/icons/brands/usps.svg": {
    "type": "image/svg+xml",
    "etag": "\"2c2-h4ephhq23sA/KseYBXNCCcjfX/8\"",
    "mtime": "2026-02-12T20:16:12.310Z",
    "size": 706,
    "path": "../public/icons/brands/usps.svg"
  },
  "/icons/brands/ups.svg": {
    "type": "image/svg+xml",
    "etag": "\"374-ARvCY3liMxurBiChNn+uWNoVJE8\"",
    "mtime": "2026-02-12T20:16:12.310Z",
    "size": 884,
    "path": "../public/icons/brands/ups.svg"
  },
  "/icons/brands/ussunnah.svg": {
    "type": "image/svg+xml",
    "etag": "\"d41-eYZOHqI4cRc0GphxfzuCQG8AQvA\"",
    "mtime": "2026-02-12T20:16:12.310Z",
    "size": 3393,
    "path": "../public/icons/brands/ussunnah.svg"
  },
  "/icons/brands/vaadin.svg": {
    "type": "image/svg+xml",
    "etag": "\"386-zKQMEjCFQ2alwrxRoIUw8m2dbW8\"",
    "mtime": "2026-02-12T20:16:12.310Z",
    "size": 902,
    "path": "../public/icons/brands/vaadin.svg"
  },
  "/icons/brands/viacoin.svg": {
    "type": "image/svg+xml",
    "etag": "\"175-ir0B9yfX3uKtpvLZ7E7DgMx6PKI\"",
    "mtime": "2026-02-12T20:16:12.311Z",
    "size": 373,
    "path": "../public/icons/brands/viacoin.svg"
  },
  "/icons/brands/viadeo-square.svg": {
    "type": "image/svg+xml",
    "etag": "\"3fe-AisZHQzcHbdnSv+xtNeV/v6Sarg\"",
    "mtime": "2026-02-12T20:16:12.310Z",
    "size": 1022,
    "path": "../public/icons/brands/viadeo-square.svg"
  },
  "/icons/brands/viadeo.svg": {
    "type": "image/svg+xml",
    "etag": "\"3ba-T7lVW1KQgP6JD5/YU5VEUu1w3qQ\"",
    "mtime": "2026-02-12T20:16:12.311Z",
    "size": 954,
    "path": "../public/icons/brands/viadeo.svg"
  },
  "/icons/brands/viber.svg": {
    "type": "image/svg+xml",
    "etag": "\"63a-ai3E95CfZv9cv91+Mdh2s0+bdpM\"",
    "mtime": "2026-02-12T20:16:12.311Z",
    "size": 1594,
    "path": "../public/icons/brands/viber.svg"
  },
  "/icons/brands/vimeo-v.svg": {
    "type": "image/svg+xml",
    "etag": "\"256-c2LvSBmIgr6RY/5zYptGMNuIdk0\"",
    "mtime": "2026-02-12T20:16:12.312Z",
    "size": 598,
    "path": "../public/icons/brands/vimeo-v.svg"
  },
  "/icons/brands/vine.svg": {
    "type": "image/svg+xml",
    "etag": "\"27e-GFfDuzdvAXrwgjhHBq5MIhl8D7o\"",
    "mtime": "2026-02-12T20:16:12.311Z",
    "size": 638,
    "path": "../public/icons/brands/vine.svg"
  },
  "/icons/brands/vk.svg": {
    "type": "image/svg+xml",
    "etag": "\"33a-ES+ajDk2L8nlgluPkSKBsGuM8sM\"",
    "mtime": "2026-02-12T20:16:12.311Z",
    "size": 826,
    "path": "../public/icons/brands/vk.svg"
  },
  "/icons/brands/vnv.svg": {
    "type": "image/svg+xml",
    "etag": "\"3dc-Z7R4yjGA4sZC+9VPwzmVvN1oNsU\"",
    "mtime": "2026-02-12T20:16:12.311Z",
    "size": 988,
    "path": "../public/icons/brands/vnv.svg"
  },
  "/icons/brands/vuejs.svg": {
    "type": "image/svg+xml",
    "etag": "\"151-r0QX+/YFonkTtCgTSM/irunvEpc\"",
    "mtime": "2026-02-12T20:16:12.311Z",
    "size": 337,
    "path": "../public/icons/brands/vuejs.svg"
  },
  "/icons/brands/watchman-monitoring.svg": {
    "type": "image/svg+xml",
    "etag": "\"414-2RYogACnSYJgiyV/1IEuskXjCh0\"",
    "mtime": "2026-02-12T20:16:12.311Z",
    "size": 1044,
    "path": "../public/icons/brands/watchman-monitoring.svg"
  },
  "/icons/brands/weebly.svg": {
    "type": "image/svg+xml",
    "etag": "\"479-/aBzR9Pu0dxlwunWJO9j3bpciBs\"",
    "mtime": "2026-02-12T20:16:12.313Z",
    "size": 1145,
    "path": "../public/icons/brands/weebly.svg"
  },
  "/icons/brands/weibo.svg": {
    "type": "image/svg+xml",
    "etag": "\"471-DGoZH+cpHmgMY0Yvc5B/MjeBeaY\"",
    "mtime": "2026-02-12T20:16:12.312Z",
    "size": 1137,
    "path": "../public/icons/brands/weibo.svg"
  },
  "/icons/brands/weixin.svg": {
    "type": "image/svg+xml",
    "etag": "\"43d-2lwQRpVdw31LbpA5v1GZjeYhyYs\"",
    "mtime": "2026-02-12T20:16:12.313Z",
    "size": 1085,
    "path": "../public/icons/brands/weixin.svg"
  },
  "/icons/brands/vimeo-square.svg": {
    "type": "image/svg+xml",
    "etag": "\"2b1-5C7zcHMwB3DDFshBPGAk9nQFpwY\"",
    "mtime": "2026-02-12T20:16:12.311Z",
    "size": 689,
    "path": "../public/icons/brands/vimeo-square.svg"
  },
  "/icons/brands/vimeo.svg": {
    "type": "image/svg+xml",
    "etag": "\"2c8-0F9R+E/erS04vKU66kfxUvo4pow\"",
    "mtime": "2026-02-12T20:16:12.311Z",
    "size": 712,
    "path": "../public/icons/brands/vimeo.svg"
  },
  "/icons/brands/waze.svg": {
    "type": "image/svg+xml",
    "etag": "\"4a6-K6PxE73qe7eLrSo6I3B+MhKjhOs\"",
    "mtime": "2026-02-12T20:16:12.313Z",
    "size": 1190,
    "path": "../public/icons/brands/waze.svg"
  },
  "/icons/brands/whatsapp-square.svg": {
    "type": "image/svg+xml",
    "etag": "\"48d-hb34CjRZXFQ31clmQtW2CkHZes8\"",
    "mtime": "2026-02-12T20:16:12.315Z",
    "size": 1165,
    "path": "../public/icons/brands/whatsapp-square.svg"
  },
  "/icons/brands/whatsapp.svg": {
    "type": "image/svg+xml",
    "etag": "\"44f-j2rPpE18aJ1pmRI0uEh8wpJ6ohM\"",
    "mtime": "2026-02-12T20:16:12.315Z",
    "size": 1103,
    "path": "../public/icons/brands/whatsapp.svg"
  },
  "/icons/brands/whmcs.svg": {
    "type": "image/svg+xml",
    "etag": "\"573-0Ezoj3/JTNobzSFQjw8X7FvlbXg\"",
    "mtime": "2026-02-12T20:16:12.314Z",
    "size": 1395,
    "path": "../public/icons/brands/whmcs.svg"
  },
  "/icons/brands/wikipedia-w.svg": {
    "type": "image/svg+xml",
    "etag": "\"392-DiTAAPnlyE1uJAwFRdrDrbNQWoo\"",
    "mtime": "2026-02-12T20:16:12.318Z",
    "size": 914,
    "path": "../public/icons/brands/wikipedia-w.svg"
  },
  "/icons/brands/wix.svg": {
    "type": "image/svg+xml",
    "etag": "\"555-AiS7bk0D6BhXHbWjY+iOzE2Z6Nc\"",
    "mtime": "2026-02-12T20:16:12.317Z",
    "size": 1365,
    "path": "../public/icons/brands/wix.svg"
  },
  "/icons/brands/windows.svg": {
    "type": "image/svg+xml",
    "etag": "\"160-5VoW97PH/x8BqmofJNNh8vXZelw\"",
    "mtime": "2026-02-12T20:16:12.315Z",
    "size": 352,
    "path": "../public/icons/brands/windows.svg"
  },
  "/icons/brands/wizards-of-the-coast.svg": {
    "type": "image/svg+xml",
    "etag": "\"2054-ACeS3nLZ3H2tK1qbILpoBWl7DZE\"",
    "mtime": "2026-02-12T20:16:12.316Z",
    "size": 8276,
    "path": "../public/icons/brands/wizards-of-the-coast.svg"
  },
  "/icons/brands/wodu.svg": {
    "type": "image/svg+xml",
    "etag": "\"530-vRDjzb65i19baK3VcpKLGA6q/qY\"",
    "mtime": "2026-02-12T20:16:12.317Z",
    "size": 1328,
    "path": "../public/icons/brands/wodu.svg"
  },
  "/icons/brands/wolf-pack-battalion.svg": {
    "type": "image/svg+xml",
    "etag": "\"a31-KEh1zuiw4Fkk0hB2VVFDZ9v1chw\"",
    "mtime": "2026-02-12T20:16:12.317Z",
    "size": 2609,
    "path": "../public/icons/brands/wolf-pack-battalion.svg"
  },
  "/icons/brands/wordpress-simple.svg": {
    "type": "image/svg+xml",
    "etag": "\"44c-eRrebkwJEmBVqnWKfjfdvFi9OAU\"",
    "mtime": "2026-02-12T20:16:12.317Z",
    "size": 1100,
    "path": "../public/icons/brands/wordpress-simple.svg"
  },
  "/icons/brands/wordpress.svg": {
    "type": "image/svg+xml",
    "etag": "\"4d9-f+7ydqENl8F30Td+KXDFI8/jMRs\"",
    "mtime": "2026-02-12T20:16:12.318Z",
    "size": 1241,
    "path": "../public/icons/brands/wordpress.svg"
  },
  "/icons/brands/wpbeginner.svg": {
    "type": "image/svg+xml",
    "etag": "\"2cb-rd0Mw03xVywzai1TOtlUxaWQqPc\"",
    "mtime": "2026-02-12T20:16:12.318Z",
    "size": 715,
    "path": "../public/icons/brands/wpbeginner.svg"
  },
  "/icons/brands/wpexplorer.svg": {
    "type": "image/svg+xml",
    "etag": "\"28e-STh8t7YDVt+6D1HzkxJUFWd0eHI\"",
    "mtime": "2026-02-12T20:16:12.318Z",
    "size": 654,
    "path": "../public/icons/brands/wpexplorer.svg"
  },
  "/icons/brands/wpressr.svg": {
    "type": "image/svg+xml",
    "etag": "\"545-/549UHzZ8Ef6Zi+BPGf5N3R7RzQ\"",
    "mtime": "2026-02-12T20:16:12.318Z",
    "size": 1349,
    "path": "../public/icons/brands/wpressr.svg"
  },
  "/icons/brands/wpforms.svg": {
    "type": "image/svg+xml",
    "etag": "\"2d7-mMEVqEnijCVey1Mm5cLub2TNJyQ\"",
    "mtime": "2026-02-12T20:16:12.318Z",
    "size": 727,
    "path": "../public/icons/brands/wpforms.svg"
  },
  "/icons/brands/xbox.svg": {
    "type": "image/svg+xml",
    "etag": "\"454-xwXwSfZzt4fHfiN7H94CdTYPOX4\"",
    "mtime": "2026-02-12T20:16:12.319Z",
    "size": 1108,
    "path": "../public/icons/brands/xbox.svg"
  },
  "/icons/brands/xing-square.svg": {
    "type": "image/svg+xml",
    "etag": "\"2af-7/W6EJw7VEA00keRUFhMZs0CzPI\"",
    "mtime": "2026-02-12T20:16:12.319Z",
    "size": 687,
    "path": "../public/icons/brands/xing-square.svg"
  },
  "/icons/brands/y-combinator.svg": {
    "type": "image/svg+xml",
    "etag": "\"15a-lziND18Obtda77bLOcrlHiQOFko\"",
    "mtime": "2026-02-12T20:16:12.319Z",
    "size": 346,
    "path": "../public/icons/brands/y-combinator.svg"
  },
  "/icons/brands/yammer.svg": {
    "type": "image/svg+xml",
    "etag": "\"340-177BW2FyHLLHpxUvaGZ7/xcrdQQ\"",
    "mtime": "2026-02-12T20:16:12.320Z",
    "size": 832,
    "path": "../public/icons/brands/yammer.svg"
  },
  "/icons/brands/yahoo.svg": {
    "type": "image/svg+xml",
    "etag": "\"1a3-lqb1WwOR2RivdP2QwuuQzBot9+o\"",
    "mtime": "2026-02-12T20:16:12.319Z",
    "size": 419,
    "path": "../public/icons/brands/yahoo.svg"
  },
  "/icons/brands/yandex.svg": {
    "type": "image/svg+xml",
    "etag": "\"1a3-rL0xCuZdh4mbHQMKQJDPjGFULEA\"",
    "mtime": "2026-02-12T20:16:12.319Z",
    "size": 419,
    "path": "../public/icons/brands/yandex.svg"
  },
  "/icons/brands/yarn.svg": {
    "type": "image/svg+xml",
    "etag": "\"60d-BdfNTjtATbgv3a+NBJUZHS5uM3M\"",
    "mtime": "2026-02-12T20:16:12.320Z",
    "size": 1549,
    "path": "../public/icons/brands/yarn.svg"
  },
  "/icons/brands/yelp.svg": {
    "type": "image/svg+xml",
    "etag": "\"3ce-q2POuNH76tho5EOwgWLGOl0Z4js\"",
    "mtime": "2026-02-12T20:16:12.320Z",
    "size": 974,
    "path": "../public/icons/brands/yelp.svg"
  },
  "/icons/brands/xing.svg": {
    "type": "image/svg+xml",
    "etag": "\"254-nuvzQB2DV1uMxt3m0cCRwDzu7wM\"",
    "mtime": "2026-02-12T20:16:12.319Z",
    "size": 596,
    "path": "../public/icons/brands/xing.svg"
  },
  "/icons/brands/yandex-international.svg": {
    "type": "image/svg+xml",
    "etag": "\"125-DJXFYQczpmJ9fM6nCK5Be3ix5oI\"",
    "mtime": "2026-02-12T20:16:12.320Z",
    "size": 293,
    "path": "../public/icons/brands/yandex-international.svg"
  },
  "/icons/brands/zhihu.svg": {
    "type": "image/svg+xml",
    "etag": "\"691-0n/KS+WmX7cZSUmXTh46agvmGzI\"",
    "mtime": "2026-02-12T20:16:12.322Z",
    "size": 1681,
    "path": "../public/icons/brands/zhihu.svg"
  },
  "/icons/brands/youtube.svg": {
    "type": "image/svg+xml",
    "etag": "\"2af-QUl8rEuRp6XwrzgGbyZ/4WsKwOI\"",
    "mtime": "2026-02-12T20:16:12.320Z",
    "size": 687,
    "path": "../public/icons/brands/youtube.svg"
  },
  "/icons/brands/yoast.svg": {
    "type": "image/svg+xml",
    "etag": "\"291-hkODi6ZTvh2wPxfuEjap6NuJmOE\"",
    "mtime": "2026-02-12T20:16:12.320Z",
    "size": 657,
    "path": "../public/icons/brands/yoast.svg"
  },
  "/effects/analysis-suppression/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"3795-vmujQf15v+CJGhODlgHedRkCM/8\"",
    "mtime": "2026-02-12T20:16:11.823Z",
    "size": 14229,
    "path": "../public/effects/analysis-suppression/_payload.json"
  },
  "/effects/anticipatory-response/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"1650-SZALzrB9E+e+1JBYkF4GFQ1m8CU\"",
    "mtime": "2026-02-12T20:16:11.823Z",
    "size": 5712,
    "path": "../public/effects/anticipatory-response/_payload.json"
  },
  "/effects/analysis-suppression/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"bf6b-OSKrSjnZYF4aS2DTnfUegmcWNKA\"",
    "mtime": "2026-02-12T20:16:06.837Z",
    "size": 49003,
    "path": "../public/effects/analysis-suppression/index.html"
  },
  "/icons/brands/youtube-square.svg": {
    "type": "image/svg+xml",
    "etag": "\"297-cwSYzOipM8RPazuhAwxOCmHgcJs\"",
    "mtime": "2026-02-12T20:16:12.320Z",
    "size": 663,
    "path": "../public/icons/brands/youtube-square.svg"
  },
  "/effects/anticipatory-response/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"94c4-A5ApBUT/3Zf4SiTeqciZRKwSLuA\"",
    "mtime": "2026-02-12T20:16:06.842Z",
    "size": 38084,
    "path": "../public/effects/anticipatory-response/index.html"
  },
  "/effects/anxiety/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"7a00-+RnKmqtWivhEAtVq3/sukZ0TzvY\"",
    "mtime": "2026-02-12T20:16:11.823Z",
    "size": 31232,
    "path": "../public/effects/anxiety/_payload.json"
  },
  "/effects/anxiety-suppression/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"34d3-oR419xtXVppQgyxBI4Vz5uEu9G8\"",
    "mtime": "2026-02-12T20:16:11.823Z",
    "size": 13523,
    "path": "../public/effects/anxiety-suppression/_payload.json"
  },
  "/effects/anxiety/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"cc92-Um5OBj1KUxiCU7GA2ytDnZB2Xa4\"",
    "mtime": "2026-02-12T20:16:06.844Z",
    "size": 52370,
    "path": "../public/effects/anxiety/index.html"
  },
  "/effects/anxiety-suppression/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"cee1-oDlPeLpl9gA0bU/sDkY1kzCsYIk\"",
    "mtime": "2026-02-12T20:16:06.891Z",
    "size": 52961,
    "path": "../public/effects/anxiety-suppression/index.html"
  },
  "/effects/appetite-enhancement/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"1a2d-nPslptefqZcPznv4TT/pqUZL1T4\"",
    "mtime": "2026-02-12T20:16:11.834Z",
    "size": 6701,
    "path": "../public/effects/appetite-enhancement/_payload.json"
  },
  "/effects/auditory-distortion/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"80c1-uo++mIoQTSrVz/BNdZEexiB2j4M\"",
    "mtime": "2026-02-12T20:16:11.844Z",
    "size": 32961,
    "path": "../public/effects/auditory-distortion/_payload.json"
  },
  "/effects/appetite-suppression/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"2df5-VslAlf90QMqdmjyw7hOz5fiiGMo\"",
    "mtime": "2026-02-12T20:16:11.825Z",
    "size": 11765,
    "path": "../public/effects/appetite-suppression/_payload.json"
  },
  "/effects/auditory-enhancement/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"3941-jQp22dzX/i1oNWlYFZx85bgpfqQ\"",
    "mtime": "2026-02-12T20:16:11.852Z",
    "size": 14657,
    "path": "../public/effects/auditory-enhancement/_payload.json"
  },
  "/effects/appetite-enhancement/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"a732-cPdtoE0raFwjgbi4yWa3LTAp6T8\"",
    "mtime": "2026-02-12T20:16:06.973Z",
    "size": 42802,
    "path": "../public/effects/appetite-enhancement/index.html"
  },
  "/effects/auditory-distortion/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"da8a-TCGKEsMQegTioelF/rW9bzJC7xs\"",
    "mtime": "2026-02-12T20:16:07.400Z",
    "size": 55946,
    "path": "../public/effects/auditory-distortion/index.html"
  },
  "/effects/auditory-hallucination/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"a400-3/unQdN2DLiw34eqwuW5V0vMNmY\"",
    "mtime": "2026-02-12T20:16:11.840Z",
    "size": 41984,
    "path": "../public/effects/auditory-hallucination/_payload.json"
  },
  "/effects/auditory-enhancement/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"ac87-1Jdwox8UYAoQy8ZsQc7UbQQvVJk\"",
    "mtime": "2026-02-12T20:16:07.400Z",
    "size": 44167,
    "path": "../public/effects/auditory-enhancement/index.html"
  },
  "/effects/appetite-suppression/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"b8ef-IXHlHMbCt8h63SYyj8Fev9JjUNo\"",
    "mtime": "2026-02-12T20:16:06.908Z",
    "size": 47343,
    "path": "../public/effects/appetite-suppression/index.html"
  },
  "/effects/auditory-suppression/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"2414-XQjpNJdnaRKU7SdcEzZPWXWIDuU\"",
    "mtime": "2026-02-12T20:16:11.840Z",
    "size": 9236,
    "path": "../public/effects/auditory-suppression/_payload.json"
  },
  "/effects/auditory-hallucination/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"febf-nDtsl3lH5AY+4939tmuih19VHhY\"",
    "mtime": "2026-02-12T20:16:07.400Z",
    "size": 65215,
    "path": "../public/effects/auditory-hallucination/index.html"
  },
  "/effects/auditory-misinterpretation/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"2cc0-78zV2haxjaFnPsMyNEzEkUx4BbA\"",
    "mtime": "2026-02-12T20:16:11.855Z",
    "size": 11456,
    "path": "../public/effects/auditory-misinterpretation/_payload.json"
  },
  "/effects/auditory-suppression/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"8859-SHd1G6/Asn1JRuHouyiqqCOZMQs\"",
    "mtime": "2026-02-12T20:16:07.400Z",
    "size": 34905,
    "path": "../public/effects/auditory-suppression/index.html"
  },
  "/effects/autonomous-entity/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"1b0b1-B6QYTkRVKfwfEOETuQVSGByYbJ4\"",
    "mtime": "2026-02-12T20:16:11.852Z",
    "size": 110769,
    "path": "../public/effects/autonomous-entity/_payload.json"
  },
  "/effects/auditory-misinterpretation/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"899d-Z8e4r5+VXeDTVcwipewvvWPSk8A\"",
    "mtime": "2026-02-12T20:16:07.401Z",
    "size": 35229,
    "path": "../public/effects/auditory-misinterpretation/index.html"
  },
  "/effects/autonomous-voice-communication/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"9ee2-64TX4sxGdl89LuEcQuniQ3YzSyA\"",
    "mtime": "2026-02-12T20:16:11.854Z",
    "size": 40674,
    "path": "../public/effects/autonomous-voice-communication/_payload.json"
  },
  "/effects/autonomous-entity/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"14c6b-sDZxc54uRGy8lPQh/eBmIz+xrK0\"",
    "mtime": "2026-02-12T20:16:07.400Z",
    "size": 85099,
    "path": "../public/effects/autonomous-entity/index.html"
  },
  "/effects/back-pain/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"23f4-fj7fSIiSv7nvHBf30FB5TS3oWzs\"",
    "mtime": "2026-02-12T20:16:11.852Z",
    "size": 9204,
    "path": "../public/effects/back-pain/_payload.json"
  },
  "/effects/back-pain/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"9f5d-OOMQv9S5Snp3grAdZWStCZ/J/M0\"",
    "mtime": "2026-02-12T20:16:07.400Z",
    "size": 40797,
    "path": "../public/effects/back-pain/index.html"
  },
  "/effects/autonomous-voice-communication/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"f625-9yuffeaYe/c7pML9oq6ctGzKe0Y\"",
    "mtime": "2026-02-12T20:16:07.401Z",
    "size": 63013,
    "path": "../public/effects/autonomous-voice-communication/index.html"
  },
  "/effects/bodily-control-enhancement/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"2029-z/xxD0uuYyIKJUbaq2kKHBqQYos\"",
    "mtime": "2026-02-12T20:16:11.852Z",
    "size": 8233,
    "path": "../public/effects/bodily-control-enhancement/_payload.json"
  },
  "/effects/bodily-control-enhancement/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"a880-V+8zLVaNsoEKUPnA+39kRfk4XNg\"",
    "mtime": "2026-02-12T20:16:07.400Z",
    "size": 43136,
    "path": "../public/effects/bodily-control-enhancement/index.html"
  },
  "/effects/bodily-pressures/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"1357-Kp1U95D+1+3KqTkctI0yD2lj8b8\"",
    "mtime": "2026-02-12T20:16:11.860Z",
    "size": 4951,
    "path": "../public/effects/bodily-pressures/_payload.json"
  },
  "/effects/body-odour-alteration/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"1231-r6d8tfQ6cfcqPby3Ofa6/d/EP+M\"",
    "mtime": "2026-02-12T20:16:11.855Z",
    "size": 4657,
    "path": "../public/effects/body-odour-alteration/_payload.json"
  },
  "/effects/brain-zaps/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"1da3-rxPjhtCH2ICWWIzJ5jch+MmIZZY\"",
    "mtime": "2026-02-12T20:16:11.855Z",
    "size": 7587,
    "path": "../public/effects/brain-zaps/_payload.json"
  },
  "/effects/brightness-alteration/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"2e91-4tXBdVSF2mgEZIvpmV9r9xwlywM\"",
    "mtime": "2026-02-12T20:16:11.852Z",
    "size": 11921,
    "path": "../public/effects/brightness-alteration/_payload.json"
  },
  "/effects/body-odour-alteration/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"8762-1Mh0AVv0MBqc9Cg4Svz6hEhM/lA\"",
    "mtime": "2026-02-12T20:16:07.401Z",
    "size": 34658,
    "path": "../public/effects/body-odour-alteration/index.html"
  },
  "/effects/brain-zaps/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"9d08-RuJipt//kKJz0VgxCPDJ3h0Tycs\"",
    "mtime": "2026-02-12T20:16:07.401Z",
    "size": 40200,
    "path": "../public/effects/brain-zaps/index.html"
  },
  "/effects/bodily-pressures/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"963f-dHQ1HfqA0d0Tlj9D/2tVe6V2uSU\"",
    "mtime": "2026-02-12T20:16:07.400Z",
    "size": 38463,
    "path": "../public/effects/bodily-pressures/index.html"
  },
  "/effects/bronchodilation/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"158e-ortetblfHhcYkqwt8J6s1K068s4\"",
    "mtime": "2026-02-12T20:16:11.855Z",
    "size": 5518,
    "path": "../public/effects/bronchodilation/_payload.json"
  },
  "/effects/catharsis/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"6f93-t45C8EhGS7Dj1VzW+JEHK9IJuzs\"",
    "mtime": "2026-02-12T20:16:11.853Z",
    "size": 28563,
    "path": "../public/effects/catharsis/_payload.json"
  },
  "/effects/changes-in-felt-bodily-form/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"339a-uLB3uv0XrxuYJVRxmXZs9UQnbIs\"",
    "mtime": "2026-02-12T20:16:11.852Z",
    "size": 13210,
    "path": "../public/effects/changes-in-felt-bodily-form/_payload.json"
  },
  "/effects/bronchodilation/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"946a-mEVCcqEJy8dwhZKloC/CQ+H1+PY\"",
    "mtime": "2026-02-12T20:16:07.401Z",
    "size": 37994,
    "path": "../public/effects/bronchodilation/index.html"
  },
  "/effects/brightness-alteration/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"ae07-M12USxgg6mxE7wHQqnDheiddm8c\"",
    "mtime": "2026-02-12T20:16:07.400Z",
    "size": 44551,
    "path": "../public/effects/brightness-alteration/index.html"
  },
  "/effects/changes-in-felt-gravity/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"3fc7-X1ENaGhyWwRQdusFH3anmh3+fow\"",
    "mtime": "2026-02-12T20:16:11.861Z",
    "size": 16327,
    "path": "../public/effects/changes-in-felt-gravity/_payload.json"
  },
  "/effects/catharsis/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"f0ce-LNEWmIjnJQQJsUTCTGsNWNF/4QA\"",
    "mtime": "2026-02-12T20:16:07.401Z",
    "size": 61646,
    "path": "../public/effects/catharsis/index.html"
  },
  "/effects/changes-in-felt-bodily-form/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"a5f4-ESQDr7TcJWW+RBU+Bf+8vTlLhnY\"",
    "mtime": "2026-02-12T20:16:07.400Z",
    "size": 42484,
    "path": "../public/effects/changes-in-felt-bodily-form/index.html"
  },
  "/effects/chromatic-aberration/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"2abb-P3y46FIZjeLmpwWllVwVHQ77EoA\"",
    "mtime": "2026-02-12T20:16:11.854Z",
    "size": 10939,
    "path": "../public/effects/chromatic-aberration/_payload.json"
  },
  "/effects/changes-in-felt-gravity/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"a3fd-86X6ceNjScrQiLtsLu+CxTj0KbE\"",
    "mtime": "2026-02-12T20:16:07.401Z",
    "size": 41981,
    "path": "../public/effects/changes-in-felt-gravity/index.html"
  },
  "/effects/chromatic-aberration/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"aa23-RNBQHpgD5vJo3h4GAEBW/H8Foug\"",
    "mtime": "2026-02-12T20:16:07.401Z",
    "size": 43555,
    "path": "../public/effects/chromatic-aberration/index.html"
  },
  "/effects/cognitive-disconnection/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"ab02-s2ftkYmtXbHnJ+IUSkB1WBLsKLg\"",
    "mtime": "2026-02-12T20:16:07.401Z",
    "size": 43778,
    "path": "../public/effects/cognitive-disconnection/index.html"
  },
  "/effects/cognitive-dysphoria/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"353c-aEx27zjq8PN87rtFH9I4eqxiM0g\"",
    "mtime": "2026-02-12T20:16:11.861Z",
    "size": 13628,
    "path": "../public/effects/cognitive-dysphoria/_payload.json"
  },
  "/effects/cognitive-disconnection/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"60a2-eoeNH6bhY7HONM2OZ2ar3avQutQ\"",
    "mtime": "2026-02-12T20:16:11.861Z",
    "size": 24738,
    "path": "../public/effects/cognitive-disconnection/_payload.json"
  },
  "/effects/cognitive-euphoria/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"4dcf-yOFOj+Hso7Xc4+psArvlv6I15qw\"",
    "mtime": "2026-02-12T20:16:11.861Z",
    "size": 19919,
    "path": "../public/effects/cognitive-euphoria/_payload.json"
  },
  "/effects/cognitive-dysphoria/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"affd-6Dx7nh2K1Mi3ToZFeYI44usl1/s\"",
    "mtime": "2026-02-12T20:16:07.412Z",
    "size": 45053,
    "path": "../public/effects/cognitive-dysphoria/index.html"
  },
  "/effects/cognitive-euphoria/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"bd01-gEC6y+1RpHdau7lYilkqUEWFI4Q\"",
    "mtime": "2026-02-12T20:16:07.412Z",
    "size": 48385,
    "path": "../public/effects/cognitive-euphoria/index.html"
  },
  "/effects/cognitive-fatigue/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"2d0f-a+w4MUOQvPJr8H+gjhY0/VIUaKM\"",
    "mtime": "2026-02-12T20:16:11.863Z",
    "size": 11535,
    "path": "../public/effects/cognitive-fatigue/_payload.json"
  },
  "/effects/cognitive-fatigue/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"a9ef-d/KuZayagit84gdBTDNIKLAItzc\"",
    "mtime": "2026-02-12T20:16:07.530Z",
    "size": 43503,
    "path": "../public/effects/cognitive-fatigue/index.html"
  },
  "/effects/colour-enhancement/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"71dc-2zZAPB2RUca1cTPKlDkR75LtKSA\"",
    "mtime": "2026-02-12T20:16:11.862Z",
    "size": 29148,
    "path": "../public/effects/colour-enhancement/_payload.json"
  },
  "/effects/colour-replacement/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"232e-eoUFK8rNvM3elluiFsFD7z+OsTY\"",
    "mtime": "2026-02-12T20:16:11.862Z",
    "size": 9006,
    "path": "../public/effects/colour-replacement/_payload.json"
  },
  "/effects/colour-shifting/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"4460-O6A7rIs2m854FpXIdWE+x2hnDqE\"",
    "mtime": "2026-02-12T20:16:11.862Z",
    "size": 17504,
    "path": "../public/effects/colour-shifting/_payload.json"
  },
  "/effects/colour-enhancement/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"c89f-EXlHVe5XNSepk0fsY6gm2GOigyc\"",
    "mtime": "2026-02-12T20:16:07.540Z",
    "size": 51359,
    "path": "../public/effects/colour-enhancement/index.html"
  },
  "/effects/colour-shifting/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"acc1-Z/3OqtXP4fjlZWdu5k6OHIdK/nQ\"",
    "mtime": "2026-02-12T20:16:07.582Z",
    "size": 44225,
    "path": "../public/effects/colour-shifting/index.html"
  },
  "/effects/colour-replacement/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"ae68-zipfu9wPFnIbLIgRuLB4FvdI7mU\"",
    "mtime": "2026-02-12T20:16:07.588Z",
    "size": 44648,
    "path": "../public/effects/colour-replacement/index.html"
  },
  "/effects/colour-suppression/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"1638-vIjQHwT86s3BixT6i4LRKtvHxnY\"",
    "mtime": "2026-02-12T20:16:11.883Z",
    "size": 5688,
    "path": "../public/effects/colour-suppression/_payload.json"
  },
  "/effects/component-controllability/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"1b4d-quBeXAVktsRz6J4tVnezX4cIbd4\"",
    "mtime": "2026-02-12T20:16:11.882Z",
    "size": 6989,
    "path": "../public/effects/component-controllability/_payload.json"
  },
  "/effects/colour-suppression/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"93e6-6+DzYSe7HarALaSWr3F3PRjNDoM\"",
    "mtime": "2026-02-12T20:16:07.605Z",
    "size": 37862,
    "path": "../public/effects/colour-suppression/index.html"
  },
  "/effects/compulsive-redosing/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"2638-3H39rX0lXn91tf5d6UvQ+tbdUEA\"",
    "mtime": "2026-02-12T20:16:11.883Z",
    "size": 9784,
    "path": "../public/effects/compulsive-redosing/_payload.json"
  },
  "/effects/conceptual-thinking/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"4b32-JWXyP/ZK/+/glLXhy94lD5FCaXM\"",
    "mtime": "2026-02-12T20:16:11.885Z",
    "size": 19250,
    "path": "../public/effects/conceptual-thinking/_payload.json"
  },
  "/effects/confusion/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"2c9f-ARGQjRnrXwwpttfVHAsXJhK+go8\"",
    "mtime": "2026-02-12T20:16:11.885Z",
    "size": 11423,
    "path": "../public/effects/confusion/_payload.json"
  },
  "/effects/component-controllability/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"89f5-m7gM68ZlkE0TSgdBMGkizMF5zys\"",
    "mtime": "2026-02-12T20:16:07.606Z",
    "size": 35317,
    "path": "../public/effects/component-controllability/index.html"
  },
  "/effects/conceptual-thinking/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"b013-aBywhMD9v2GU0OBSFHjSWV6bEEo\"",
    "mtime": "2026-02-12T20:16:07.628Z",
    "size": 45075,
    "path": "../public/effects/conceptual-thinking/index.html"
  },
  "/effects/confusion/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"c085-XtGHBih62kK4m6HLf9RDhhG30+0\"",
    "mtime": "2026-02-12T20:16:07.628Z",
    "size": 49285,
    "path": "../public/effects/confusion/index.html"
  },
  "/effects/constipation/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"188f-F8V1tLfbCr15jTCWd56xmQNvWZE\"",
    "mtime": "2026-02-12T20:16:11.885Z",
    "size": 6287,
    "path": "../public/effects/constipation/_payload.json"
  },
  "/effects/compulsive-redosing/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"9fa1-SOs5mgHO0BqfuWHPhF/pJXdMYkA\"",
    "mtime": "2026-02-12T20:16:07.606Z",
    "size": 40865,
    "path": "../public/effects/compulsive-redosing/index.html"
  },
  "/effects/cough-suppression/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"1a9c-E+kInsLxBz1RTT1IFSUqTYhW5cA\"",
    "mtime": "2026-02-12T20:16:11.898Z",
    "size": 6812,
    "path": "../public/effects/cough-suppression/_payload.json"
  },
  "/effects/creativity-enhancement/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"4492-ZqkvhFUdBzZmptNf+7xxD8+enhE\"",
    "mtime": "2026-02-12T20:16:11.900Z",
    "size": 17554,
    "path": "../public/effects/creativity-enhancement/_payload.json"
  },
  "/effects/cough-suppression/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"a5d2-i2oFhPf2oSDjrAAJXrVMtcF71zo\"",
    "mtime": "2026-02-12T20:16:07.643Z",
    "size": 42450,
    "path": "../public/effects/cough-suppression/index.html"
  },
  "/effects/constipation/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"8e38-52JNk4sH6hq5O5K9v1IMgEvGdIA\"",
    "mtime": "2026-02-12T20:16:07.643Z",
    "size": 36408,
    "path": "../public/effects/constipation/index.html"
  },
  "/effects/creativity-enhancement/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"b4cb-Q8qwfm25l0g60McUsan9uRwbtcc\"",
    "mtime": "2026-02-12T20:16:07.643Z",
    "size": 46283,
    "path": "../public/effects/creativity-enhancement/index.html"
  },
  "/effects/creativity-suppression/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"2396-b/tWa/TejnbhjBRMWZA+8AKnm8c\"",
    "mtime": "2026-02-12T20:16:11.893Z",
    "size": 9110,
    "path": "../public/effects/creativity-suppression/_payload.json"
  },
  "/effects/decreased-blood-pressure/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"12f4-6KkEVst0R+CB5lNApH7+uy8ewgE\"",
    "mtime": "2026-02-12T20:16:11.895Z",
    "size": 4852,
    "path": "../public/effects/decreased-blood-pressure/_payload.json"
  },
  "/effects/creativity-suppression/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"b025-ZjDnbLaVch+wcG6/H1QAfxjhL7U\"",
    "mtime": "2026-02-12T20:16:07.643Z",
    "size": 45093,
    "path": "../public/effects/creativity-suppression/index.html"
  },
  "/effects/decreased-heart-rate/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"1df9-JCAAHnFzMRRgo+gg5LmMRYalG0Q\"",
    "mtime": "2026-02-12T20:16:11.898Z",
    "size": 7673,
    "path": "../public/effects/decreased-heart-rate/_payload.json"
  },
  "/effects/decreased-blood-pressure/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"8eb6-qlRudTXIF7Wb0KOOTM3D/eZfCEk\"",
    "mtime": "2026-02-12T20:16:07.643Z",
    "size": 36534,
    "path": "../public/effects/decreased-blood-pressure/index.html"
  },
  "/effects/decreased-libido/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"1564-TRKlcdjRmiae4EjqKiSjTUB7z3M\"",
    "mtime": "2026-02-12T20:16:11.895Z",
    "size": 5476,
    "path": "../public/effects/decreased-libido/_payload.json"
  },
  "/effects/decreased-heart-rate/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"8ebf-h94INZXL65sGIQRbGiKg4zBHUO0\"",
    "mtime": "2026-02-12T20:16:07.643Z",
    "size": 36543,
    "path": "../public/effects/decreased-heart-rate/index.html"
  },
  "/effects/decreased-libido/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"8a1c-gZN0uBNKZpAyrKLC9XzgsxnWwsY\"",
    "mtime": "2026-02-12T20:16:07.643Z",
    "size": 35356,
    "path": "../public/effects/decreased-libido/index.html"
  },
  "/effects/dehydration/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"3633-AhygMaBG/X4XszL2z633b84WLGg\"",
    "mtime": "2026-02-12T20:16:11.900Z",
    "size": 13875,
    "path": "../public/effects/dehydration/_payload.json"
  },
  "/effects/dehydration/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"ad64-+OrGm6YPpbgFqgxPZaNF4DPFYeA\"",
    "mtime": "2026-02-12T20:16:07.643Z",
    "size": 44388,
    "path": "../public/effects/dehydration/index.html"
  },
  "/effects/delirium/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"6b62-cHdwYSH7Zj/d7MMdub2230GSZEU\"",
    "mtime": "2026-02-12T20:16:11.902Z",
    "size": 27490,
    "path": "../public/effects/delirium/_payload.json"
  },
  "/effects/deja-vu/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"4f98-fzpYqIWg7IKK4MraSu3nW/u43hA\"",
    "mtime": "2026-02-12T20:16:11.898Z",
    "size": 20376,
    "path": "../public/effects/deja-vu/_payload.json"
  },
  "/effects/deja-vu/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"b778-YKvWKuHEpS8+DaecX7W0YEc8UVw\"",
    "mtime": "2026-02-12T20:16:07.643Z",
    "size": 46968,
    "path": "../public/effects/deja-vu/index.html"
  },
  "/effects/delusion/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"16248-7bchpnEjUd/iUZeTbnP2qI9gVgQ\"",
    "mtime": "2026-02-12T20:16:11.900Z",
    "size": 90696,
    "path": "../public/effects/delusion/_payload.json"
  },
  "/effects/delirium/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"c6b4-T5xEdnUKgSRfw4pPjdMX79pJ9sY\"",
    "mtime": "2026-02-12T20:16:07.662Z",
    "size": 50868,
    "path": "../public/effects/delirium/index.html"
  },
  "/effects/depersonalization/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"8f07-4nrDzZyfmepO6ucDbh8uBfZkcic\"",
    "mtime": "2026-02-12T20:16:11.893Z",
    "size": 36615,
    "path": "../public/effects/depersonalization/_payload.json"
  },
  "/effects/depression/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"116a2-mknDh46IceLxcMoPZYJrXMsM5w8\"",
    "mtime": "2026-02-12T20:16:11.898Z",
    "size": 71330,
    "path": "../public/effects/depression/_payload.json"
  },
  "/effects/delusion/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"11a7a-bZ77jRG1no9g94UkC6PE42abWbM\"",
    "mtime": "2026-02-12T20:16:07.643Z",
    "size": 72314,
    "path": "../public/effects/delusion/index.html"
  },
  "/effects/depersonalization/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"ca69-DF7gsKlqhodncwPbzZCSJC5FaA0\"",
    "mtime": "2026-02-12T20:16:07.643Z",
    "size": 51817,
    "path": "../public/effects/depersonalization/index.html"
  },
  "/effects/depression/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"115cd-7+EO60XNzJISeR32ZnXkETqAIXg\"",
    "mtime": "2026-02-12T20:16:07.643Z",
    "size": 71117,
    "path": "../public/effects/depression/index.html"
  },
  "/effects/depression-reduction/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"c3a7-45Gx+jZkypKVQPYgfBrt6j9er/U\"",
    "mtime": "2026-02-12T20:16:11.899Z",
    "size": 50087,
    "path": "../public/effects/depression-reduction/_payload.json"
  },
  "/effects/depth-perception-distortions/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"3e0c-4t86zyCbeMW4GR5miXkYDppUgTI\"",
    "mtime": "2026-02-12T20:16:11.900Z",
    "size": 15884,
    "path": "../public/effects/depth-perception-distortions/_payload.json"
  },
  "/effects/derealization/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"4e3f-Ui4e63GpZ1pwfIf3GvBbyBm/CJk\"",
    "mtime": "2026-02-12T20:16:11.900Z",
    "size": 20031,
    "path": "../public/effects/derealization/_payload.json"
  },
  "/effects/depression-reduction/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"12569-opdhtbKRAuui7ye/1ZqF3e3GEoI\"",
    "mtime": "2026-02-12T20:16:07.643Z",
    "size": 75113,
    "path": "../public/effects/depression-reduction/index.html"
  },
  "/effects/depth-perception-distortions/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"bd02-MC6qPE9wezcvygGDBCP11CgZAZw\"",
    "mtime": "2026-02-12T20:16:07.644Z",
    "size": 48386,
    "path": "../public/effects/depth-perception-distortions/index.html"
  },
  "/effects/derealization/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"c09d-lRBY5fnvlUfu/jSh2e8hRfJIc3A\"",
    "mtime": "2026-02-12T20:16:07.656Z",
    "size": 49309,
    "path": "../public/effects/derealization/index.html"
  },
  "/effects/diarrhea/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"23cd-3KA4NxTY7IjI6oS3J9N4/ESZ2xs\"",
    "mtime": "2026-02-12T20:16:11.901Z",
    "size": 9165,
    "path": "../public/effects/diarrhea/_payload.json"
  },
  "/effects/diarrhea/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"a036-5wNTi2c0jBu1hNlCpAF/Cjvi3MQ\"",
    "mtime": "2026-02-12T20:16:07.662Z",
    "size": 41014,
    "path": "../public/effects/diarrhea/index.html"
  },
  "/effects/diffraction/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"12df-E2r8T+RaDSpEcfm3QZz/ElPUIBo\"",
    "mtime": "2026-02-12T20:16:11.902Z",
    "size": 4831,
    "path": "../public/effects/diffraction/_payload.json"
  },
  "/effects/difficulty-urinating/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"1b44-Q4DfrD+hcL56wPkhBhru/C4+PBo\"",
    "mtime": "2026-02-12T20:16:11.901Z",
    "size": 6980,
    "path": "../public/effects/difficulty-urinating/_payload.json"
  },
  "/effects/disinhibition/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"2b79-GBkGRFp83+supfDfLfHnUQoMbC8\"",
    "mtime": "2026-02-12T20:16:11.902Z",
    "size": 11129,
    "path": "../public/effects/disinhibition/_payload.json"
  },
  "/effects/difficulty-urinating/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"9eb9-O+dy/8zz2c++kGrJ5ew1xOJuMQQ\"",
    "mtime": "2026-02-12T20:16:07.662Z",
    "size": 40633,
    "path": "../public/effects/difficulty-urinating/index.html"
  },
  "/effects/diffraction/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"877e-TuiK/MvH8I2JcImA9a7LcVODEqo\"",
    "mtime": "2026-02-12T20:16:07.662Z",
    "size": 34686,
    "path": "../public/effects/diffraction/index.html"
  },
  "/effects/dizziness/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"30d9-ypq+b5QpS6lFoMq9cn0HXy0YJa8\"",
    "mtime": "2026-02-12T20:16:11.902Z",
    "size": 12505,
    "path": "../public/effects/dizziness/_payload.json"
  },
  "/effects/double-vision/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"56d9-z72fjIusMdpAoFOVjmbIkuXyuW4\"",
    "mtime": "2026-02-12T20:16:11.902Z",
    "size": 22233,
    "path": "../public/effects/double-vision/_payload.json"
  },
  "/effects/disinhibition/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"b7ed-/SH//GHGb9qhHYLslKtjwT6xLIQ\"",
    "mtime": "2026-02-12T20:16:07.662Z",
    "size": 47085,
    "path": "../public/effects/disinhibition/index.html"
  },
  "/effects/dizziness/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"a906-BQ+IkO1YY11Pb+bI4mVRRFA0pKo\"",
    "mtime": "2026-02-12T20:16:07.662Z",
    "size": 43270,
    "path": "../public/effects/dizziness/index.html"
  },
  "/effects/dosage-independent-intensity/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"3eae-CoYbjJSVoDeoK4tliCpZ8jvqD6Q\"",
    "mtime": "2026-02-12T20:16:11.902Z",
    "size": 16046,
    "path": "../public/effects/dosage-independent-intensity/_payload.json"
  },
  "/effects/dream-potentiation/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"3c54-QrnGHDtx4fHgze9U8ynoeG673IE\"",
    "mtime": "2026-02-12T20:16:11.902Z",
    "size": 15444,
    "path": "../public/effects/dream-potentiation/_payload.json"
  },
  "/effects/double-vision/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"c937-Jr+N0eIULG4KvN27ju/mu8eektc\"",
    "mtime": "2026-02-12T20:16:07.760Z",
    "size": 51511,
    "path": "../public/effects/double-vision/index.html"
  },
  "/effects/dream-suppression/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"1cf7-kl8eWD7G27AxFUFTSTexKvAMuHA\"",
    "mtime": "2026-02-12T20:16:11.902Z",
    "size": 7415,
    "path": "../public/effects/dream-suppression/_payload.json"
  },
  "/effects/dosage-independent-intensity/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"9851-X1KIGKFa4u74P3psQAOncP5lamM\"",
    "mtime": "2026-02-12T20:16:07.743Z",
    "size": 38993,
    "path": "../public/effects/dosage-independent-intensity/index.html"
  },
  "/effects/drifting/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"10695-6xeupORAAuJ1Oun99icBjmkyzgQ\"",
    "mtime": "2026-02-12T20:16:11.902Z",
    "size": 67221,
    "path": "../public/effects/drifting/_payload.json"
  },
  "/effects/dream-potentiation/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"d238-NHS4Ny2qGwtecl72/2KzQ/nwq0c\"",
    "mtime": "2026-02-12T20:16:07.797Z",
    "size": 53816,
    "path": "../public/effects/dream-potentiation/index.html"
  },
  "/effects/dream-suppression/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"9e29-XZ+fda6YUvnSOpKsIVxmnmNlI+E\"",
    "mtime": "2026-02-12T20:16:07.807Z",
    "size": 40489,
    "path": "../public/effects/dream-suppression/index.html"
  },
  "/effects/drifting/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"e97f-I1HXGHHPcA5kypA4XvlmjrobkJ4\"",
    "mtime": "2026-02-12T20:16:07.835Z",
    "size": 59775,
    "path": "../public/effects/drifting/index.html"
  },
  "/effects/dry-mouth/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"3996-zWemzxNEPMjLcxtZZSOCHlA77+M\"",
    "mtime": "2026-02-12T20:16:11.902Z",
    "size": 14742,
    "path": "../public/effects/dry-mouth/_payload.json"
  },
  "/effects/ego-death/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"18140-wgxLUhTlVnpMlHjZ3/Ph50mFQOE\"",
    "mtime": "2026-02-12T20:16:11.903Z",
    "size": 98624,
    "path": "../public/effects/ego-death/_payload.json"
  },
  "/effects/dry-mouth/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"a140-Mi632lHcHU8PFXO0CGoJj7noeFE\"",
    "mtime": "2026-02-12T20:16:07.876Z",
    "size": 41280,
    "path": "../public/effects/dry-mouth/index.html"
  },
  "/effects/ego-death/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"14c1b-70Qmd70IACdvpLxDn6In595R/A4\"",
    "mtime": "2026-02-12T20:16:07.880Z",
    "size": 85019,
    "path": "../public/effects/ego-death/index.html"
  },
  "/effects/ego-inflation/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"2d2d-+rA0/OlwFRaMtY6+V39UPW8LCZE\"",
    "mtime": "2026-02-12T20:16:11.904Z",
    "size": 11565,
    "path": "../public/effects/ego-inflation/_payload.json"
  },
  "/effects/ego-replacement/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"1944-elL/dy2db/G5ceASqd3Tfp6tonI\"",
    "mtime": "2026-02-12T20:16:11.902Z",
    "size": 6468,
    "path": "../public/effects/ego-replacement/_payload.json"
  },
  "/effects/ego-inflation/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"b577-eQNiku0UDQdmKFSFOdI+0eNWgMA\"",
    "mtime": "2026-02-12T20:16:07.884Z",
    "size": 46455,
    "path": "../public/effects/ego-inflation/index.html"
  },
  "/effects/ego-replacement/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"9571-sBd90wfAexMt/rIOzsZUlq4Jalg\"",
    "mtime": "2026-02-12T20:16:07.880Z",
    "size": 38257,
    "path": "../public/effects/ego-replacement/index.html"
  },
  "/effects/emotion-suppression/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"3465-U8gRTkamNs9HZynW1813fWZ4gzk\"",
    "mtime": "2026-02-12T20:16:11.903Z",
    "size": 13413,
    "path": "../public/effects/emotion-suppression/_payload.json"
  },
  "/effects/emotion-intensification/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"d23b-Pz9O0UY2TUYw/1zy+zp3Dfwqw5o\"",
    "mtime": "2026-02-12T20:16:07.893Z",
    "size": 53819,
    "path": "../public/effects/emotion-intensification/index.html"
  },
  "/effects/empathy-affection-and-sociability-enhancement/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"449c-ozkAP3GEB1EPXkgstmPcjgxgoU4\"",
    "mtime": "2026-02-12T20:16:11.904Z",
    "size": 17564,
    "path": "../public/effects/empathy-affection-and-sociability-enhancement/_payload.json"
  },
  "/effects/emotion-intensification/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"7245-lgt/CX1u73rQAq5L1UhHiS5eRk0\"",
    "mtime": "2026-02-12T20:16:11.910Z",
    "size": 29253,
    "path": "../public/effects/emotion-intensification/_payload.json"
  },
  "/effects/emotion-suppression/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"c4d1-u3aWbz/k65OEx8bPTQ5QUS5ySXs\"",
    "mtime": "2026-02-12T20:16:07.893Z",
    "size": 50385,
    "path": "../public/effects/emotion-suppression/index.html"
  },
  "/effects/empathy-affection-and-sociability-enhancement/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"c82f-OY2w3U/StMxmbU2H414nOja5W5c\"",
    "mtime": "2026-02-12T20:16:07.893Z",
    "size": 51247,
    "path": "../public/effects/empathy-affection-and-sociability-enhancement/index.html"
  },
  "/effects/environmental-cubism/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"3e46-1AIz8097MWzlKUzBO6C2siYlae4\"",
    "mtime": "2026-02-12T20:16:11.903Z",
    "size": 15942,
    "path": "../public/effects/environmental-cubism/_payload.json"
  },
  "/effects/enhancement-and-suppression-cycles/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"3cfd-4r3TSr2p5Us0Fntvm2WENsMyJzQ\"",
    "mtime": "2026-02-12T20:16:11.910Z",
    "size": 15613,
    "path": "../public/effects/enhancement-and-suppression-cycles/_payload.json"
  },
  "/effects/enhancement-and-suppression-cycles/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"9e87-D4b3S/cbEDBPT57Z+0/OpfKDvLU\"",
    "mtime": "2026-02-12T20:16:07.893Z",
    "size": 40583,
    "path": "../public/effects/enhancement-and-suppression-cycles/index.html"
  },
  "/effects/environmental-cubism/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"a9d7-yaAWwEdDNakAYIysD/YKtmexQ2M\"",
    "mtime": "2026-02-12T20:16:07.893Z",
    "size": 43479,
    "path": "../public/effects/environmental-cubism/index.html"
  },
  "/effects/environmental-patterning/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"3ec8-Rr27e3kIuGqlMMkEaldOczQrUbE\"",
    "mtime": "2026-02-12T20:16:11.912Z",
    "size": 16072,
    "path": "../public/effects/environmental-patterning/_payload.json"
  },
  "/effects/environmental-patterning/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"a13c-lre8QEoXH1nzfP/wMwbmEbwEqrM\"",
    "mtime": "2026-02-12T20:16:07.893Z",
    "size": 41276,
    "path": "../public/effects/environmental-patterning/index.html"
  },
  "/effects/excessive-yawning/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"1cd7-kOm53q8ySPLPpuLv+TrtwB6pP34\"",
    "mtime": "2026-02-12T20:16:11.911Z",
    "size": 7383,
    "path": "../public/effects/excessive-yawning/_payload.json"
  },
  "/effects/excessive-yawning/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"9aef-Jxe5KVlQo6afEAVNaXS7GhYKAd4\"",
    "mtime": "2026-02-12T20:16:07.893Z",
    "size": 39663,
    "path": "../public/effects/excessive-yawning/index.html"
  },
  "/effects/existential-self-realization/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"2a3c-enO9+IGFy33uaXwfay/hmFArNcM\"",
    "mtime": "2026-02-12T20:16:11.912Z",
    "size": 10812,
    "path": "../public/effects/existential-self-realization/_payload.json"
  },
  "/effects/external-hallucination/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"bfdf-64pxVGBVFjLShGllwsZR2Kk8SCI\"",
    "mtime": "2026-02-12T20:16:11.911Z",
    "size": 49119,
    "path": "../public/effects/external-hallucination/_payload.json"
  },
  "/effects/existential-self-realization/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"9f83-N4uVP36RIJIvbDqGzyef7QX7Fr4\"",
    "mtime": "2026-02-12T20:16:07.893Z",
    "size": 40835,
    "path": "../public/effects/existential-self-realization/index.html"
  },
  "/effects/feelings-of-impending-doom/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"2f92-AV6Pjxlcwidmq+SM98IqEbBubek\"",
    "mtime": "2026-02-12T20:16:11.912Z",
    "size": 12178,
    "path": "../public/effects/feelings-of-impending-doom/_payload.json"
  },
  "/effects/external-hallucination/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"e88c-e7C+1o6FKUqT8Qze0GgRw+Cyu9U\"",
    "mtime": "2026-02-12T20:16:07.893Z",
    "size": 59532,
    "path": "../public/effects/external-hallucination/index.html"
  },
  "/effects/feelings-of-impending-doom/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"a244-Dg1DnlLPvVIivkrS2PRgOSthLmc\"",
    "mtime": "2026-02-12T20:16:07.893Z",
    "size": 41540,
    "path": "../public/effects/feelings-of-impending-doom/index.html"
  },
  "/effects/field-of-view-alteration/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"26c1-hDBk4dihcdk9vU6wb5nDL7Vr7NA\"",
    "mtime": "2026-02-12T20:16:11.916Z",
    "size": 9921,
    "path": "../public/effects/field-of-view-alteration/_payload.json"
  },
  "/effects/field-of-view-alteration/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"a85d-j8hKlApYFyZQJ30sd5zMPj3w5w4\"",
    "mtime": "2026-02-12T20:16:07.893Z",
    "size": 43101,
    "path": "../public/effects/field-of-view-alteration/index.html"
  },
  "/effects/focus-enhancement/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"29ef-cn7fULdzrS8vSFHE2PP/FOhUQtw\"",
    "mtime": "2026-02-12T20:16:11.911Z",
    "size": 10735,
    "path": "../public/effects/focus-enhancement/_payload.json"
  },
  "/effects/focus-suppression/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"371d-HeAl49f/A5kY99N3Crg+Wh3cLR0\"",
    "mtime": "2026-02-12T20:16:11.914Z",
    "size": 14109,
    "path": "../public/effects/focus-suppression/_payload.json"
  },
  "/effects/frame-rate-suppression/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"2592-mbRlRJKFqUi6GdH+e+xSeSvUaVQ\"",
    "mtime": "2026-02-12T20:16:11.913Z",
    "size": 9618,
    "path": "../public/effects/frame-rate-suppression/_payload.json"
  },
  "/effects/focus-enhancement/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"b3ae-FDc+tA5Do2Xy+4lx53vR7mqndEE\"",
    "mtime": "2026-02-12T20:16:07.893Z",
    "size": 45998,
    "path": "../public/effects/focus-enhancement/index.html"
  },
  "/effects/focus-suppression/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"c107-tG6s8+pNNprJoDtQWz7LG/scbvo\"",
    "mtime": "2026-02-12T20:16:07.893Z",
    "size": 49415,
    "path": "../public/effects/focus-suppression/index.html"
  },
  "/effects/frequent-urination/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"1f18-0+nNNHZqxnm66vwCQi62npF+MBI\"",
    "mtime": "2026-02-12T20:16:11.914Z",
    "size": 7960,
    "path": "../public/effects/frequent-urination/_payload.json"
  },
  "/effects/gait-alteration/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"1ced-yPddbju5dzZMZFVLhbWTCr/RuJY\"",
    "mtime": "2026-02-12T20:16:11.916Z",
    "size": 7405,
    "path": "../public/effects/gait-alteration/_payload.json"
  },
  "/effects/geometry/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"1efd0-IaHFZFod2aEXu5sdFm7mhqGMo+0\"",
    "mtime": "2026-02-12T20:16:11.916Z",
    "size": 126928,
    "path": "../public/effects/geometry/_payload.json"
  },
  "/effects/gait-alteration/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"a2fe-OebUwR1h7gARqG+Y4f36vu9JYm8\"",
    "mtime": "2026-02-12T20:16:07.920Z",
    "size": 41726,
    "path": "../public/effects/gait-alteration/index.html"
  },
  "/effects/frequent-urination/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"a6a0-8WEfnBhSPUvpL2cTgCMBXt639Ks\"",
    "mtime": "2026-02-12T20:16:07.893Z",
    "size": 42656,
    "path": "../public/effects/frequent-urination/index.html"
  },
  "/effects/frame-rate-suppression/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"9e24-zhcw7RyHn449V3BZ1/mwItjyaZ0\"",
    "mtime": "2026-02-12T20:16:07.893Z",
    "size": 40484,
    "path": "../public/effects/frame-rate-suppression/index.html"
  },
  "/effects/geometry/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"12d3a-sih2MXiRMnJEHy5EoQk0Tt1A8F8\"",
    "mtime": "2026-02-12T20:16:07.921Z",
    "size": 77114,
    "path": "../public/effects/geometry/index.html"
  },
  "/effects/glossolalia/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"403d-PDpBwLQyPtm9siQxyzNa7x6BwJA\"",
    "mtime": "2026-02-12T20:16:11.919Z",
    "size": 16445,
    "path": "../public/effects/glossolalia/_payload.json"
  },
  "/effects/gustatory-enhancement/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"1533-KThAaEaXsf8PEM2MF9/02BfWu1E\"",
    "mtime": "2026-02-12T20:16:11.916Z",
    "size": 5427,
    "path": "../public/effects/gustatory-enhancement/_payload.json"
  },
  "/effects/geometry-video-script/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"7e2c-+j+5MrMEThR/A+gB7AssRvVCpCk\"",
    "mtime": "2026-02-12T20:16:07.921Z",
    "size": 32300,
    "path": "../public/effects/geometry-video-script/index.html"
  },
  "/effects/geometry-video-script/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"66ad-qQgtajtxqr2CeeYZLeHuhCGePZk\"",
    "mtime": "2026-02-12T20:16:11.915Z",
    "size": 26285,
    "path": "../public/effects/geometry-video-script/_payload.json"
  },
  "/effects/gustatory-hallucination/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"201d-ahwDWXfENNTT9JcuIGl5HH4WwpI\"",
    "mtime": "2026-02-12T20:16:11.916Z",
    "size": 8221,
    "path": "../public/effects/gustatory-hallucination/_payload.json"
  },
  "/effects/headache/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"26f7-gFiBgFZ+6LNrQpyDDsVV+hdQdYg\"",
    "mtime": "2026-02-12T20:16:11.918Z",
    "size": 9975,
    "path": "../public/effects/headache/_payload.json"
  },
  "/effects/gustatory-enhancement/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"8893-7wztnxVlF05qmzab7+UTd5sS/SY\"",
    "mtime": "2026-02-12T20:16:07.921Z",
    "size": 34963,
    "path": "../public/effects/gustatory-enhancement/index.html"
  },
  "/effects/glossolalia/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"a39d-/JBNgTltc9IDrP8Lg68yETEzuew\"",
    "mtime": "2026-02-12T20:16:07.921Z",
    "size": 41885,
    "path": "../public/effects/glossolalia/index.html"
  },
  "/effects/gustatory-hallucination/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"9aaa-Iih3DaSxBm6E9EqhqZbj8tsXMk8\"",
    "mtime": "2026-02-12T20:16:07.921Z",
    "size": 39594,
    "path": "../public/effects/gustatory-hallucination/index.html"
  },
  "/effects/headache/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"ae36-QMvfbyC8Bek+X6wGWBoM6BFjHuU\"",
    "mtime": "2026-02-12T20:16:08.005Z",
    "size": 44598,
    "path": "../public/effects/headache/index.html"
  },
  "/effects/identity-alteration/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"99f8-yZBs/zjYGVPuW8VsJ1i7HB0tHXM\"",
    "mtime": "2026-02-12T20:16:11.918Z",
    "size": 39416,
    "path": "../public/effects/identity-alteration/_payload.json"
  },
  "/effects/identity-alteration/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"91be-1/thh6YPjZLip292mMXB1jfo9fw\"",
    "mtime": "2026-02-12T20:16:08.017Z",
    "size": 37310,
    "path": "../public/effects/identity-alteration/index.html"
  },
  "/effects/immersion-enhancement/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"4bf2-K/EpKopTJ3JoeQDHGgjmBsV0xgI\"",
    "mtime": "2026-02-12T20:16:11.920Z",
    "size": 19442,
    "path": "../public/effects/immersion-enhancement/_payload.json"
  },
  "/effects/immersion-enhancement/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"b98a-armIjvxNfTlm2TQ/tdWp1Lm2LNw\"",
    "mtime": "2026-02-12T20:16:08.037Z",
    "size": 47498,
    "path": "../public/effects/immersion-enhancement/index.html"
  },
  "/effects/gustatory-suppression/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"1e88-YUCr9zzFqVMi/HDd4RRnRs6GwcE\"",
    "mtime": "2026-02-12T20:16:11.916Z",
    "size": 7816,
    "path": "../public/effects/gustatory-suppression/_payload.json"
  },
  "/effects/increased-blood-pressure/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"2898-8c+Upmq8LEgaoXA48/weYI8JqxY\"",
    "mtime": "2026-02-12T20:16:11.920Z",
    "size": 10392,
    "path": "../public/effects/increased-blood-pressure/_payload.json"
  },
  "/effects/gustatory-suppression/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"94ec-khDb2VLdheU53SZs/RkRjAHFrd8\"",
    "mtime": "2026-02-12T20:16:07.921Z",
    "size": 38124,
    "path": "../public/effects/gustatory-suppression/index.html"
  },
  "/effects/increased-blood-pressure/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"9ba8-MKRTpjMRtvDvpvJXmMe9Etk27k8\"",
    "mtime": "2026-02-12T20:16:08.024Z",
    "size": 39848,
    "path": "../public/effects/increased-blood-pressure/index.html"
  },
  "/effects/increased-bodily-temperature/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"46b0-qUBjNE/UD454r5tZZTAhIIAyyGs\"",
    "mtime": "2026-02-12T20:16:11.919Z",
    "size": 18096,
    "path": "../public/effects/increased-bodily-temperature/_payload.json"
  },
  "/effects/increased-heart-rate/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"334f-907h2mmDWDNyET+xiyVZjaJmMF4\"",
    "mtime": "2026-02-12T20:16:11.919Z",
    "size": 13135,
    "path": "../public/effects/increased-heart-rate/_payload.json"
  },
  "/effects/increased-libido/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"24e8-YYhL8JX46sShcdJAi/y8hkIxaC4\"",
    "mtime": "2026-02-12T20:16:11.919Z",
    "size": 9448,
    "path": "../public/effects/increased-libido/_payload.json"
  },
  "/effects/increased-bodily-temperature/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"bdc9-eaRA7J9oj9LEOhPlN4IDkG6pN24\"",
    "mtime": "2026-02-12T20:16:08.062Z",
    "size": 48585,
    "path": "../public/effects/increased-bodily-temperature/index.html"
  },
  "/effects/increased-heart-rate/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"ba64-PXBOmbNWt5qzui0lKFg6jcM3Mfk\"",
    "mtime": "2026-02-12T20:16:08.100Z",
    "size": 47716,
    "path": "../public/effects/increased-heart-rate/index.html"
  },
  "/effects/increased-libido/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"b639-fPhXW4ELb2dzubnQpJPn7J3/ScI\"",
    "mtime": "2026-02-12T20:16:08.107Z",
    "size": 46649,
    "path": "../public/effects/increased-libido/index.html"
  },
  "/effects/increased-pareidolia/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"554e-1ZyKcxTtjkWN3GN7TOd+H3GdKYc\"",
    "mtime": "2026-02-12T20:16:11.920Z",
    "size": 21838,
    "path": "../public/effects/increased-pareidolia/_payload.json"
  },
  "/effects/increased-music-appreciation/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"6d1e-/c6OLDWLgvsrwJredGs6xfjr+O8\"",
    "mtime": "2026-02-12T20:16:11.920Z",
    "size": 27934,
    "path": "../public/effects/increased-music-appreciation/_payload.json"
  },
  "/effects/increased-perspiration/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"243b-aPpDNgDprIbAaRPrrBzy4t/PFIw\"",
    "mtime": "2026-02-12T20:16:11.927Z",
    "size": 9275,
    "path": "../public/effects/increased-perspiration/_payload.json"
  },
  "/effects/increased-pareidolia/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"c42c-0FW6MMYULTTX/d3WWHweetCxsM8\"",
    "mtime": "2026-02-12T20:16:08.110Z",
    "size": 50220,
    "path": "../public/effects/increased-pareidolia/index.html"
  },
  "/effects/increased-music-appreciation/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"c7c6-h5LXk+ZhA6K2MgglCcddwyscwbA\"",
    "mtime": "2026-02-12T20:16:08.110Z",
    "size": 51142,
    "path": "../public/effects/increased-music-appreciation/index.html"
  },
  "/effects/increased-phlegm-production/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"19f8-gaLK4Na27ORCb5CLnyEP6CKUfFg\"",
    "mtime": "2026-02-12T20:16:11.928Z",
    "size": 6648,
    "path": "../public/effects/increased-phlegm-production/_payload.json"
  },
  "/effects/increased-salivation/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"1910-xK1hvJ1LFiWFfOoabaoxmKibLJA\"",
    "mtime": "2026-02-12T20:16:11.926Z",
    "size": 6416,
    "path": "../public/effects/increased-salivation/_payload.json"
  },
  "/effects/increased-sense-of-humor/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45e7-dmjHXNF+Socvn1rZwO1SaTwrm8U\"",
    "mtime": "2026-02-12T20:16:11.926Z",
    "size": 17895,
    "path": "../public/effects/increased-sense-of-humor/_payload.json"
  },
  "/effects/increased-phlegm-production/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"9a76-GGgVumHvOcUOgTsbc2D+luuKPyg\"",
    "mtime": "2026-02-12T20:16:08.119Z",
    "size": 39542,
    "path": "../public/effects/increased-phlegm-production/index.html"
  },
  "/effects/increased-salivation/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"9a32-3vGfcipe+7TP8JDuLGqYvqdklmw\"",
    "mtime": "2026-02-12T20:16:08.119Z",
    "size": 39474,
    "path": "../public/effects/increased-salivation/index.html"
  },
  "/effects/increased-suggestibility/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"354a-nE9BSHONxtAX7t0SaSNq/1Ami78\"",
    "mtime": "2026-02-12T20:16:11.928Z",
    "size": 13642,
    "path": "../public/effects/increased-suggestibility/_payload.json"
  },
  "/effects/increased-perspiration/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"ab82-+Q40kn/eWEPXxjTKS9eH93hbi60\"",
    "mtime": "2026-02-12T20:16:08.119Z",
    "size": 43906,
    "path": "../public/effects/increased-perspiration/index.html"
  },
  "/effects/increased-sense-of-humor/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"c1e9-v3o2EmDn4IQFdzgGmbRW3yZss/4\"",
    "mtime": "2026-02-12T20:16:08.119Z",
    "size": 49641,
    "path": "../public/effects/increased-sense-of-humor/index.html"
  },
  "/effects/increased-suggestibility/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"a0b3-P+/0RyQgJy/uvHiCDFZptCE/hc4\"",
    "mtime": "2026-02-12T20:16:08.119Z",
    "size": 41139,
    "path": "../public/effects/increased-suggestibility/index.html"
  },
  "/effects/internal-hallucination/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"17326-EudhcGumEtTDyYuO9B8CujCrqcI\"",
    "mtime": "2026-02-12T20:16:11.928Z",
    "size": 95014,
    "path": "../public/effects/internal-hallucination/_payload.json"
  },
  "/effects/introspection/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"776e-CHiNf3KUZwxuTqmjxTFI/6lZCjY\"",
    "mtime": "2026-02-12T20:16:11.928Z",
    "size": 30574,
    "path": "../public/effects/introspection/_payload.json"
  },
  "/effects/irritability/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"238d-aNWmC+8MW6A0d2Bene4vNwI0Rgk\"",
    "mtime": "2026-02-12T20:16:11.927Z",
    "size": 9101,
    "path": "../public/effects/irritability/_payload.json"
  },
  "/effects/internal-hallucination/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"1142f-lpihDZpXqPBhrN37FHnh9JX6JEU\"",
    "mtime": "2026-02-12T20:16:08.119Z",
    "size": 70703,
    "path": "../public/effects/internal-hallucination/index.html"
  },
  "/effects/introspection/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"ba8d-0pk7CkK4BT1PmVPWFzGos83odzA\"",
    "mtime": "2026-02-12T20:16:08.119Z",
    "size": 47757,
    "path": "../public/effects/introspection/index.html"
  },
  "/effects/irritability/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"9f47-mtf18pjEDFCe9WkESQJNdMYDa3I\"",
    "mtime": "2026-02-12T20:16:08.119Z",
    "size": 40775,
    "path": "../public/effects/irritability/index.html"
  },
  "/effects/jamais-vu/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"1c47-t7BXN70hsCuGzlGmzr+0193jeGI\"",
    "mtime": "2026-02-12T20:16:11.930Z",
    "size": 7239,
    "path": "../public/effects/jamais-vu/_payload.json"
  },
  "/effects/jamais-vu/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"8a95-+W1135c8xAKfLh+h7izp0NBTgns\"",
    "mtime": "2026-02-12T20:16:08.121Z",
    "size": 35477,
    "path": "../public/effects/jamais-vu/index.html"
  },
  "/effects/itchiness/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"1837-uJup9Q9+TimR1oUn8GE+LZUpej8\"",
    "mtime": "2026-02-12T20:16:11.927Z",
    "size": 6199,
    "path": "../public/effects/itchiness/_payload.json"
  },
  "/effects/itchiness/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"9d05-KDtRbAOAfGQje8KJAH78OQsMdmY\"",
    "mtime": "2026-02-12T20:16:08.119Z",
    "size": 40197,
    "path": "../public/effects/itchiness/index.html"
  },
  "/effects/language-suppression/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"534a-hu88gp2ApnbBNInAz9NdbhmQn18\"",
    "mtime": "2026-02-12T20:16:11.930Z",
    "size": 21322,
    "path": "../public/effects/language-suppression/_payload.json"
  },
  "/effects/laughter-fits/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"a920-e5Ew8/THOaQ7p0V5hgUge9vpzc8\"",
    "mtime": "2026-02-12T20:16:08.137Z",
    "size": 43296,
    "path": "../public/effects/laughter-fits/index.html"
  },
  "/effects/laughter-fits/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"30c2-QP7k2VfqfuBafs5ifFgUm+FmAmE\"",
    "mtime": "2026-02-12T20:16:11.931Z",
    "size": 12482,
    "path": "../public/effects/laughter-fits/_payload.json"
  },
  "/effects/language-suppression/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"cd38-l7o9AJaYpOoQZIaY4qaGs8wKZRs\"",
    "mtime": "2026-02-12T20:16:08.137Z",
    "size": 52536,
    "path": "../public/effects/language-suppression/index.html"
  },
  "/effects/machinescapes/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"68cd-yL/hZtRQnQMn5O23AM2PNnunfG4\"",
    "mtime": "2026-02-12T20:16:11.931Z",
    "size": 26829,
    "path": "../public/effects/machinescapes/_payload.json"
  },
  "/effects/machinescapes/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"b68e-bwYcvH7Nht4DOnCEe2CURSut6zg\"",
    "mtime": "2026-02-12T20:16:08.137Z",
    "size": 46734,
    "path": "../public/effects/machinescapes/index.html"
  },
  "/effects/magnification/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"41ad-urd4IbJStg/jN0bfS/v2wJ/E4r0\"",
    "mtime": "2026-02-12T20:16:11.930Z",
    "size": 16813,
    "path": "../public/effects/magnification/_payload.json"
  },
  "/effects/mania/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"6335-nQGWtMxI1aCLNDAwLgj30m1UyYo\"",
    "mtime": "2026-02-12T20:16:11.933Z",
    "size": 25397,
    "path": "../public/effects/mania/_payload.json"
  },
  "/effects/magnification/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"9452-r4FO003mV4zGyFrl1hBA38Q89Zc\"",
    "mtime": "2026-02-12T20:16:08.137Z",
    "size": 37970,
    "path": "../public/effects/magnification/index.html"
  },
  "/effects/mania/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"cb3f-lEQrZINZ9ygE7V1S6kNxlRefm90\"",
    "mtime": "2026-02-12T20:16:08.142Z",
    "size": 52031,
    "path": "../public/effects/mania/index.html"
  },
  "/effects/memory-enhancement/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"368f-g580mw6eFx1PWC30qeu7aMfSrys\"",
    "mtime": "2026-02-12T20:16:11.930Z",
    "size": 13967,
    "path": "../public/effects/memory-enhancement/_payload.json"
  },
  "/effects/memory-enhancement/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"b9de-+ozoVj25comXUr56GROQkA7Ue/Y\"",
    "mtime": "2026-02-12T20:16:08.137Z",
    "size": 47582,
    "path": "../public/effects/memory-enhancement/index.html"
  },
  "/effects/memory-replays/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"40a3-K7TWXJ6xmb3sworX1BfA/i7/Aqw\"",
    "mtime": "2026-02-12T20:16:11.932Z",
    "size": 16547,
    "path": "../public/effects/memory-replays/_payload.json"
  },
  "/effects/memory-replays/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"b60f-r1WGJOotO5k6MA7ddc13+Gu5gDs\"",
    "mtime": "2026-02-12T20:16:08.147Z",
    "size": 46607,
    "path": "../public/effects/memory-replays/index.html"
  },
  "/effects/memory-suppression/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"8c77-uL1ZN847kVWnsHkfW7mvtResL/A\"",
    "mtime": "2026-02-12T20:16:11.932Z",
    "size": 35959,
    "path": "../public/effects/memory-suppression/_payload.json"
  },
  "/effects/mixed-emotions/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"2b87-tgW5bwUgzsKysnaoSteULyJeUvo\"",
    "mtime": "2026-02-12T20:16:11.936Z",
    "size": 11143,
    "path": "../public/effects/mixed-emotions/_payload.json"
  },
  "/effects/memory-suppression/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"de34-1MjuKkMN6Cv5ZAiyy+veur2xN54\"",
    "mtime": "2026-02-12T20:16:08.187Z",
    "size": 56884,
    "path": "../public/effects/memory-suppression/index.html"
  },
  "/effects/mindfulness/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"bbe8-TEWc/+Hm8iU4WMnTdnprMvUU5m8\"",
    "mtime": "2026-02-12T20:16:08.187Z",
    "size": 48104,
    "path": "../public/effects/mindfulness/index.html"
  },
  "/effects/mindfulness/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"4b69-6eT2x7AoVKfP759LL6qgq5pXPF8\"",
    "mtime": "2026-02-12T20:16:11.932Z",
    "size": 19305,
    "path": "../public/effects/mindfulness/_payload.json"
  },
  "/effects/motivation-enhancement/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"3195-YcKEUfhlYWh4KIS/7NNB8oOEdvE\"",
    "mtime": "2026-02-12T20:16:11.932Z",
    "size": 12693,
    "path": "../public/effects/motivation-enhancement/_payload.json"
  },
  "/effects/mixed-emotions/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"9e9e-TcAconMgVQistb1PFFQvT7UOf6M\"",
    "mtime": "2026-02-12T20:16:08.203Z",
    "size": 40606,
    "path": "../public/effects/mixed-emotions/index.html"
  },
  "/effects/motivation-suppression/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"2a68-wU8/FBfttBJm0w42cC54kF/Sf3I\"",
    "mtime": "2026-02-12T20:16:11.934Z",
    "size": 10856,
    "path": "../public/effects/motivation-suppression/_payload.json"
  },
  "/effects/motor-control-loss/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"3121-o1tKykhDI2AY3acHbME0cb5TbtA\"",
    "mtime": "2026-02-12T20:16:11.934Z",
    "size": 12577,
    "path": "../public/effects/motor-control-loss/_payload.json"
  },
  "/effects/motivation-enhancement/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"c4ab-SsSREHf+Vuj6/zWhxK6GhCxJJKk\"",
    "mtime": "2026-02-12T20:16:08.187Z",
    "size": 50347,
    "path": "../public/effects/motivation-enhancement/index.html"
  },
  "/effects/motivation-suppression/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"b3e0-awBBzWvWGq/l09Gd7jgZBaySiYU\"",
    "mtime": "2026-02-12T20:16:08.203Z",
    "size": 46048,
    "path": "../public/effects/motivation-suppression/index.html"
  },
  "/effects/motor-control-loss/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"a800-JTveQme0Jgf12UVfhyVTTeQ4hSY\"",
    "mtime": "2026-02-12T20:16:08.197Z",
    "size": 43008,
    "path": "../public/effects/motor-control-loss/index.html"
  },
  "/effects/mouth-numbing/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"176c-xcJlJ4bIcfWVQ5u07EE+dGbmLmU\"",
    "mtime": "2026-02-12T20:16:11.936Z",
    "size": 5996,
    "path": "../public/effects/mouth-numbing/_payload.json"
  },
  "/effects/multiple-thought-streams/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"2028-d+/22Gm0/s3W95ZWcORqOXXLbqU\"",
    "mtime": "2026-02-12T20:16:11.936Z",
    "size": 8232,
    "path": "../public/effects/multiple-thought-streams/_payload.json"
  },
  "/effects/muscle-cramp/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"162f-evXKzpOwWOHnv0R68UjxUPASsuU\"",
    "mtime": "2026-02-12T20:16:11.936Z",
    "size": 5679,
    "path": "../public/effects/muscle-cramp/_payload.json"
  },
  "/effects/muscle-relaxation/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"19ae-ITcEWLhiPA1rIAhEonYRoEogRHU\"",
    "mtime": "2026-02-12T20:16:11.937Z",
    "size": 6574,
    "path": "../public/effects/muscle-relaxation/_payload.json"
  },
  "/effects/mouth-numbing/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"968e-vNJsmZvAqfmqfqYBaIOqVArgY9c\"",
    "mtime": "2026-02-12T20:16:08.222Z",
    "size": 38542,
    "path": "../public/effects/mouth-numbing/index.html"
  },
  "/effects/muscle-cramp/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"96ab-XDKs3am/14tOgSTZMVkO7ERxg6s\"",
    "mtime": "2026-02-12T20:16:08.231Z",
    "size": 38571,
    "path": "../public/effects/muscle-cramp/index.html"
  },
  "/effects/multiple-thought-streams/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"9a6d-1vRWjrZEIKYh7VuBVk73M2/RJ7Y\"",
    "mtime": "2026-02-12T20:16:08.231Z",
    "size": 39533,
    "path": "../public/effects/multiple-thought-streams/index.html"
  },
  "/effects/muscle-relaxation/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"a31b-+Aq974zq729Hk0SQMpl21e+BDT0\"",
    "mtime": "2026-02-12T20:16:08.266Z",
    "size": 41755,
    "path": "../public/effects/muscle-relaxation/index.html"
  },
  "/effects/muscle-tension/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"233b-3YVMPYStA7UM/oWicBi5S8Ejw9M\"",
    "mtime": "2026-02-12T20:16:11.937Z",
    "size": 9019,
    "path": "../public/effects/muscle-tension/_payload.json"
  },
  "/effects/muscle-tension/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"a711-efnflYfUDrs2ubVl0drM+6i5F7E\"",
    "mtime": "2026-02-12T20:16:08.307Z",
    "size": 42769,
    "path": "../public/effects/muscle-tension/index.html"
  },
  "/effects/muscle-twitching/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"19cb-/tEklAc30X5AkfGQnm1Kgopc5BY\"",
    "mtime": "2026-02-12T20:16:11.942Z",
    "size": 6603,
    "path": "../public/effects/muscle-twitching/_payload.json"
  },
  "/effects/nausea/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"b21b-GeRDZV6dO/ht/iFr0zUl0av1fyM\"",
    "mtime": "2026-02-12T20:16:11.942Z",
    "size": 45595,
    "path": "../public/effects/nausea/_payload.json"
  },
  "/effects/muscle-twitching/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"a5c4-c0Nu1kUnp52J6k15xKwFLJU8W60\"",
    "mtime": "2026-02-12T20:16:08.315Z",
    "size": 42436,
    "path": "../public/effects/muscle-twitching/index.html"
  },
  "/effects/nausea/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"b8b3-wGDwGaYv/dCJv9RED1zyPpRpiqE\"",
    "mtime": "2026-02-12T20:16:08.317Z",
    "size": 47283,
    "path": "../public/effects/nausea/index.html"
  },
  "/effects/nausea-suppression/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"4725-Dw5XawFvItJWRW/FlU/KmrCZKmg\"",
    "mtime": "2026-02-12T20:16:11.942Z",
    "size": 18213,
    "path": "../public/effects/nausea-suppression/_payload.json"
  },
  "/effects/novelty-enhancement/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"5d72-WYCIgiApKsbqP+6+9O81apSD/2U\"",
    "mtime": "2026-02-12T20:16:11.944Z",
    "size": 23922,
    "path": "../public/effects/novelty-enhancement/_payload.json"
  },
  "/effects/object-activation/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"43e7-4UB5FOcqTERBz+1deat4OPk7uYY\"",
    "mtime": "2026-02-12T20:16:11.945Z",
    "size": 17383,
    "path": "../public/effects/object-activation/_payload.json"
  },
  "/effects/nausea-suppression/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"a510-Ztm9I0rZignzTyhP3l4fK92KM5E\"",
    "mtime": "2026-02-12T20:16:08.324Z",
    "size": 42256,
    "path": "../public/effects/nausea-suppression/index.html"
  },
  "/effects/novelty-enhancement/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"c060-aFsDxNUBK1xcFL/SRclRF8GsAR8\"",
    "mtime": "2026-02-12T20:16:08.324Z",
    "size": 49248,
    "path": "../public/effects/novelty-enhancement/index.html"
  },
  "/effects/object-activation/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"8d76-4CsYxp+z8uwtWCdPYi2uoSRwXNk\"",
    "mtime": "2026-02-12T20:16:08.326Z",
    "size": 36214,
    "path": "../public/effects/object-activation/index.html"
  },
  "/effects/object-alteration/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"4507-GAierSKQkg6+GfxHFY3sFIhQRpg\"",
    "mtime": "2026-02-12T20:16:11.945Z",
    "size": 17671,
    "path": "../public/effects/object-alteration/_payload.json"
  },
  "/effects/olfactory-enhancement/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"1e06-FlIGGRBVS98SxBkOeys+R+ucu1U\"",
    "mtime": "2026-02-12T20:16:11.945Z",
    "size": 7686,
    "path": "../public/effects/olfactory-enhancement/_payload.json"
  },
  "/effects/object-alteration/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"a43f-HHo66xw2bPj1bD9paKs4fSy6LuI\"",
    "mtime": "2026-02-12T20:16:08.326Z",
    "size": 42047,
    "path": "../public/effects/object-alteration/index.html"
  },
  "/effects/olfactory-hallucination/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"2cff-/NZva48A5e0WMkie3cFhai/5as0\"",
    "mtime": "2026-02-12T20:16:11.947Z",
    "size": 11519,
    "path": "../public/effects/olfactory-hallucination/_payload.json"
  },
  "/effects/olfactory-suppression/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"11ab-+nhrrgJy+VhBp5+kFyIGKpxuVKs\"",
    "mtime": "2026-02-12T20:16:11.947Z",
    "size": 4523,
    "path": "../public/effects/olfactory-suppression/_payload.json"
  },
  "/effects/optical-sliding/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"151f-X5prcamFojr0/yTtSXujuAHAb0w\"",
    "mtime": "2026-02-12T20:16:11.945Z",
    "size": 5407,
    "path": "../public/effects/optical-sliding/_payload.json"
  },
  "/effects/olfactory-hallucination/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"ac7a-kFTzNf1tRHjNgCW9FkKJfvMpzeE\"",
    "mtime": "2026-02-12T20:16:08.326Z",
    "size": 44154,
    "path": "../public/effects/olfactory-hallucination/index.html"
  },
  "/effects/orgasm-suppression/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"1862-LZQjfyTu7Jm2B+38tNiY7RhOY6Y\"",
    "mtime": "2026-02-12T20:16:11.945Z",
    "size": 6242,
    "path": "../public/effects/orgasm-suppression/_payload.json"
  },
  "/effects/olfactory-suppression/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"873c-QhgQmuygJRU4IB3WmW1dLiMWUpE\"",
    "mtime": "2026-02-12T20:16:08.326Z",
    "size": 34620,
    "path": "../public/effects/olfactory-suppression/index.html"
  },
  "/effects/pain-relief/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"1e68-ZJOgL7wWlq4c2w9Z1imFc7pJBs4\"",
    "mtime": "2026-02-12T20:16:11.945Z",
    "size": 7784,
    "path": "../public/effects/pain-relief/_payload.json"
  },
  "/effects/olfactory-enhancement/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"a0d4-tIwm0LNA1xinQpd5f02cvUdWxbk\"",
    "mtime": "2026-02-12T20:16:08.326Z",
    "size": 41172,
    "path": "../public/effects/olfactory-enhancement/index.html"
  },
  "/effects/optical-sliding/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"936c-mHmSLcyX8nu515SEJCzjYGo0syo\"",
    "mtime": "2026-02-12T20:16:08.326Z",
    "size": 37740,
    "path": "../public/effects/optical-sliding/index.html"
  },
  "/effects/pain-relief/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"a4e8-L/qmdzxTYodl3JrUXdRo1KLjJh4\"",
    "mtime": "2026-02-12T20:16:08.326Z",
    "size": 42216,
    "path": "../public/effects/pain-relief/index.html"
  },
  "/effects/orgasm-suppression/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"9538-kVDbxg2HjgkZQpuP6nwrbhaaa00\"",
    "mtime": "2026-02-12T20:16:08.326Z",
    "size": 38200,
    "path": "../public/effects/orgasm-suppression/index.html"
  },
  "/effects/panic-attack/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"48f3-9JTCy7AciEdm0i59Rz6b6nuWA70\"",
    "mtime": "2026-02-12T20:16:11.946Z",
    "size": 18675,
    "path": "../public/effects/panic-attack/_payload.json"
  },
  "/effects/paranoia/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"328a-WmsfezKFMVYs98g0kCPeXBjft30\"",
    "mtime": "2026-02-12T20:16:11.949Z",
    "size": 12938,
    "path": "../public/effects/paranoia/_payload.json"
  },
  "/effects/panic-attack/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"b39f-/F+jkvVBAm5kOgA5bXzspfSyLwk\"",
    "mtime": "2026-02-12T20:16:08.326Z",
    "size": 45983,
    "path": "../public/effects/panic-attack/index.html"
  },
  "/effects/perception-of-bodily-heaviness/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"214a-2hVH0pr6Pirvgb0z+OxOKhTdvc0\"",
    "mtime": "2026-02-12T20:16:11.949Z",
    "size": 8522,
    "path": "../public/effects/perception-of-bodily-heaviness/_payload.json"
  },
  "/effects/paranoia/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"a89f-u26VQsH8tH7yW8f9GJobO77M9gY\"",
    "mtime": "2026-02-12T20:16:08.341Z",
    "size": 43167,
    "path": "../public/effects/paranoia/index.html"
  },
  "/effects/perception-of-bodily-heaviness/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"a529-bzbon6wvzuVyVdg4Gfm15F9M3ZU\"",
    "mtime": "2026-02-12T20:16:08.341Z",
    "size": 42281,
    "path": "../public/effects/perception-of-bodily-heaviness/index.html"
  },
  "/effects/perception-of-eternalism/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"5b67-YjNuHmn0dnJU1zfOh+pon/7niVM\"",
    "mtime": "2026-02-12T20:16:11.949Z",
    "size": 23399,
    "path": "../public/effects/perception-of-eternalism/_payload.json"
  },
  "/effects/perception-of-eternalism/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"b59c-3nP0ZhT2r3PcIDN7+rgWAhoKbDw\"",
    "mtime": "2026-02-12T20:16:08.341Z",
    "size": 46492,
    "path": "../public/effects/perception-of-eternalism/index.html"
  },
  "/effects/perception-of-interdependent-opposites/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"2f1a-iozZr867rgmGSURn2gudcA8qRzg\"",
    "mtime": "2026-02-12T20:16:11.953Z",
    "size": 12058,
    "path": "../public/effects/perception-of-interdependent-opposites/_payload.json"
  },
  "/effects/perception-of-bodily-lightness/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"3ec6-7ee9RvaWOPT6b4Uoyt8qS5wRyIU\"",
    "mtime": "2026-02-12T20:16:11.949Z",
    "size": 16070,
    "path": "../public/effects/perception-of-bodily-lightness/_payload.json"
  },
  "/effects/perception-of-predeterminism/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"3211-Za6gGhAfBlaBwjaLYVow0UJCx68\"",
    "mtime": "2026-02-12T20:16:11.953Z",
    "size": 12817,
    "path": "../public/effects/perception-of-predeterminism/_payload.json"
  },
  "/effects/perception-of-interdependent-opposites/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"abdd-3pMfs5lGsKXLTSkbk7/ZkwFjSrc\"",
    "mtime": "2026-02-12T20:16:08.341Z",
    "size": 43997,
    "path": "../public/effects/perception-of-interdependent-opposites/index.html"
  },
  "/effects/perception-of-bodily-lightness/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"a55a-Asyt2Brc/0AjhmsjsYuvp2ISc44\"",
    "mtime": "2026-02-12T20:16:08.341Z",
    "size": 42330,
    "path": "../public/effects/perception-of-bodily-lightness/index.html"
  },
  "/effects/peripheral-information-misinterpretation/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"17bc-F+eaQHLpxXEMWOT3b8jkH3W5d4A\"",
    "mtime": "2026-02-12T20:16:11.955Z",
    "size": 6076,
    "path": "../public/effects/peripheral-information-misinterpretation/_payload.json"
  },
  "/effects/perception-of-predeterminism/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"985a-0p1XYs2Nm4lm0fIpJ45oc4GjXZQ\"",
    "mtime": "2026-02-12T20:16:08.342Z",
    "size": 39002,
    "path": "../public/effects/perception-of-predeterminism/index.html"
  },
  "/effects/perception-of-self-design/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"25e9-DrPswRJ3iuiHbWV9IFv6XaLSVEY\"",
    "mtime": "2026-02-12T20:16:11.954Z",
    "size": 9705,
    "path": "../public/effects/perception-of-self-design/_payload.json"
  },
  "/effects/personal-bias-suppression/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"4fcb-KjIzTu6YERY+qLh1yOJNFgvipT8\"",
    "mtime": "2026-02-12T20:16:11.953Z",
    "size": 20427,
    "path": "../public/effects/personal-bias-suppression/_payload.json"
  },
  "/effects/peripheral-information-misinterpretation/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"8b2c-8QRAPAOBQKOyQlb5JZe97P2x/N4\"",
    "mtime": "2026-02-12T20:16:08.411Z",
    "size": 35628,
    "path": "../public/effects/peripheral-information-misinterpretation/index.html"
  },
  "/effects/personal-meaning-enhancement/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"4227-3cqr80ih2ujT26lj4DYcl7BcF5w\"",
    "mtime": "2026-02-12T20:16:11.953Z",
    "size": 16935,
    "path": "../public/effects/personal-meaning-enhancement/_payload.json"
  },
  "/effects/personal-bias-suppression/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"c156-5Yo+AwBbCNCUxkA1DWMJyKABuak\"",
    "mtime": "2026-02-12T20:16:08.406Z",
    "size": 49494,
    "path": "../public/effects/personal-bias-suppression/index.html"
  },
  "/effects/perception-of-self-design/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"a85a-PUl42fE3Rn6XVQ+4eGfzDpnBcW8\"",
    "mtime": "2026-02-12T20:16:08.406Z",
    "size": 43098,
    "path": "../public/effects/perception-of-self-design/index.html"
  },
  "/effects/personal-meaning-enhancement/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"bdd0-SRrTEYGQwMvPqQHAPyhRxBnHxUI\"",
    "mtime": "2026-02-12T20:16:08.396Z",
    "size": 48592,
    "path": "../public/effects/personal-meaning-enhancement/index.html"
  },
  "/effects/personality-regression/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"282c-NxlyDifXogQ40XHOEQn6YQjqlaM\"",
    "mtime": "2026-02-12T20:16:11.953Z",
    "size": 10284,
    "path": "../public/effects/personality-regression/_payload.json"
  },
  "/effects/perspective-distortion/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"8d44-fpH4RRjd+lEm8TcWKd2ouZDsmuc\"",
    "mtime": "2026-02-12T20:16:11.955Z",
    "size": 36164,
    "path": "../public/effects/perspective-distortion/_payload.json"
  },
  "/effects/personality-regression/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"b099-cGP213J2Kk8zgTyUedYy9olV1yY\"",
    "mtime": "2026-02-12T20:16:08.411Z",
    "size": 45209,
    "path": "../public/effects/personality-regression/index.html"
  },
  "/effects/perspective-distortion/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"d8ce-gnmqsmIIBEvJ2TtTTzd8zpNlStM\"",
    "mtime": "2026-02-12T20:16:08.412Z",
    "size": 55502,
    "path": "../public/effects/perspective-distortion/index.html"
  },
  "/effects/perspective-hallucination/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"51a7-x2jDfjmSKjB7gb84Gu9BDaWo2hM\"",
    "mtime": "2026-02-12T20:16:11.955Z",
    "size": 20903,
    "path": "../public/effects/perspective-hallucination/_payload.json"
  },
  "/effects/photophobia/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"12b9-iyXQ2T6dnfcBDZIIvHCC9Hc/uME\"",
    "mtime": "2026-02-12T20:16:11.955Z",
    "size": 4793,
    "path": "../public/effects/photophobia/_payload.json"
  },
  "/effects/perspective-hallucination/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"c76e-Ith9swfcHhqRq6hUktjCFZveTeA\"",
    "mtime": "2026-02-12T20:16:08.412Z",
    "size": 51054,
    "path": "../public/effects/perspective-hallucination/index.html"
  },
  "/effects/photophobia/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"87f0-RAYlqnbg93hxP9Wcsr3OSpP8BZ0\"",
    "mtime": "2026-02-12T20:16:08.425Z",
    "size": 34800,
    "path": "../public/effects/photophobia/index.html"
  },
  "/effects/physical-autonomy/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"2970-f6byx/7C+RMNjYCcwWTQ50wIl50\"",
    "mtime": "2026-02-12T20:16:11.955Z",
    "size": 10608,
    "path": "../public/effects/physical-autonomy/_payload.json"
  },
  "/effects/physical-autonomy/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"a93e-DqG3tCt6l4sR58nvk3pIePTBDgM\"",
    "mtime": "2026-02-12T20:16:08.425Z",
    "size": 43326,
    "path": "../public/effects/physical-autonomy/index.html"
  },
  "/effects/physical-disconnection/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"60a4-k+xnfN19nhrWWaoxDTvtNyMkKAo\"",
    "mtime": "2026-02-12T20:16:11.955Z",
    "size": 24740,
    "path": "../public/effects/physical-disconnection/_payload.json"
  },
  "/effects/physical-euphoria/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"3a8b-NlShscMXbhNtRKwRmvDtrxvt9FE\"",
    "mtime": "2026-02-12T20:16:11.956Z",
    "size": 14987,
    "path": "../public/effects/physical-euphoria/_payload.json"
  },
  "/effects/physical-fatigue/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"2d1e-MueFz/FNa1IDOKhuJge/QRWMZfU\"",
    "mtime": "2026-02-12T20:16:11.956Z",
    "size": 11550,
    "path": "../public/effects/physical-fatigue/_payload.json"
  },
  "/effects/physical-disconnection/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"ad0f-AiG284dA0UevAlHj7JNgi9bpK4Y\"",
    "mtime": "2026-02-12T20:16:08.425Z",
    "size": 44303,
    "path": "../public/effects/physical-disconnection/index.html"
  },
  "/effects/physical-euphoria/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"a952-kOFZKcQuynPOMlHKGYHDoVbHqww\"",
    "mtime": "2026-02-12T20:16:08.457Z",
    "size": 43346,
    "path": "../public/effects/physical-euphoria/index.html"
  },
  "/effects/physical-fatigue/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"8d62-MMK8tnHik0mhvoH0iClcsavQPsU\"",
    "mtime": "2026-02-12T20:16:08.554Z",
    "size": 36194,
    "path": "../public/effects/physical-fatigue/index.html"
  },
  "/effects/psychosis/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"60b8-Dp7CAJppTbkkepDS7IEYnCSZucI\"",
    "mtime": "2026-02-12T20:16:11.957Z",
    "size": 24760,
    "path": "../public/effects/psychosis/_payload.json"
  },
  "/effects/pupil-constriction/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"1449-bwA7Fuvl2ZXvdDJapk9HW1jqqFs\"",
    "mtime": "2026-02-12T20:16:11.957Z",
    "size": 5193,
    "path": "../public/effects/pupil-constriction/_payload.json"
  },
  "/effects/pupil-dilation/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"1f2b-IKRvme4/YOUlLMB4pjBy3V53Mu4\"",
    "mtime": "2026-02-12T20:16:11.956Z",
    "size": 7979,
    "path": "../public/effects/pupil-dilation/_payload.json"
  },
  "/effects/recursion/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"401b-Z0biLOHE/zIvWqumTuyHRivyfvw\"",
    "mtime": "2026-02-12T20:16:11.961Z",
    "size": 16411,
    "path": "../public/effects/recursion/_payload.json"
  },
  "/effects/psychosis/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"dab9-2UGE5A9l9BRr+xZmy1kWqQBkZ5o\"",
    "mtime": "2026-02-12T20:16:08.587Z",
    "size": 55993,
    "path": "../public/effects/psychosis/index.html"
  },
  "/effects/rejuvenation/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"3cb6-dszixxAr1v82g6rYaYgtVq7R9oE\"",
    "mtime": "2026-02-12T20:16:11.957Z",
    "size": 15542,
    "path": "../public/effects/rejuvenation/_payload.json"
  },
  "/effects/pupil-constriction/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"9793-mZ4Mgo/H+17lcuhyhxuIzqyLvPc\"",
    "mtime": "2026-02-12T20:16:08.557Z",
    "size": 38803,
    "path": "../public/effects/pupil-constriction/index.html"
  },
  "/effects/pupil-dilation/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"9b3e-eX8K/mN+fGu9ojpVhEiJTgIYlew\"",
    "mtime": "2026-02-12T20:16:08.597Z",
    "size": 39742,
    "path": "../public/effects/pupil-dilation/index.html"
  },
  "/effects/respiratory-depression/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"3dc5-lyWZ6AqMbITyb+aANmpZdeGn8YA\"",
    "mtime": "2026-02-12T20:16:11.961Z",
    "size": 15813,
    "path": "../public/effects/respiratory-depression/_payload.json"
  },
  "/effects/recursion/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"a3f8-3ck9UxH9ZGDLgFnN+JNJFd2DOuY\"",
    "mtime": "2026-02-12T20:16:08.598Z",
    "size": 41976,
    "path": "../public/effects/recursion/index.html"
  },
  "/effects/rejuvenation/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"bade-SePizgkcj09ov48tYvrrWVdEJrs\"",
    "mtime": "2026-02-12T20:16:08.598Z",
    "size": 47838,
    "path": "../public/effects/rejuvenation/index.html"
  },
  "/effects/restless-legs/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"1913-iS9STtvIyTHY+3DaWW4Z/xIslrQ\"",
    "mtime": "2026-02-12T20:16:11.961Z",
    "size": 6419,
    "path": "../public/effects/restless-legs/_payload.json"
  },
  "/effects/respiratory-depression/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"b4be-ZkYCs1KTNRiEVIIuAljetGWKn8w\"",
    "mtime": "2026-02-12T20:16:08.621Z",
    "size": 46270,
    "path": "../public/effects/respiratory-depression/index.html"
  },
  "/effects/restless-legs/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"9949-ANQs61XqZ2/ZAiobn73fuKDPJh0\"",
    "mtime": "2026-02-12T20:16:08.621Z",
    "size": 39241,
    "path": "../public/effects/restless-legs/index.html"
  },
  "/effects/runny-nose/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"25a5-o67QPNoaPV6993UKtsUGktzHXcc\"",
    "mtime": "2026-02-12T20:16:11.961Z",
    "size": 9637,
    "path": "../public/effects/runny-nose/_payload.json"
  },
  "/effects/scenarios-and-plots/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"5347-q+pSqUClpg/U1gNqMsG2530dPwo\"",
    "mtime": "2026-02-12T20:16:11.963Z",
    "size": 21319,
    "path": "../public/effects/scenarios-and-plots/_payload.json"
  },
  "/effects/runny-nose/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"aadc-4/J3wMdIsnGAR6lM+sShI4Xvbho\"",
    "mtime": "2026-02-12T20:16:08.621Z",
    "size": 43740,
    "path": "../public/effects/runny-nose/index.html"
  },
  "/effects/scenery-slicing/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"3964-GCUwAMTzInxqO62rwyxpMS3dmu8\"",
    "mtime": "2026-02-12T20:16:11.961Z",
    "size": 14692,
    "path": "../public/effects/scenery-slicing/_payload.json"
  },
  "/effects/scenarios-and-plots/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"ae72-xc14Te1YZm7IXI9edTnbPE89BBM\"",
    "mtime": "2026-02-12T20:16:08.621Z",
    "size": 44658,
    "path": "../public/effects/scenarios-and-plots/index.html"
  },
  "/effects/sedation/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"5a66-NbETLpz1XgTvykPZRGCOMpKSXco\"",
    "mtime": "2026-02-12T20:16:11.961Z",
    "size": 23142,
    "path": "../public/effects/sedation/_payload.json"
  },
  "/effects/scenery-slicing/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"9da3-OFgh5Z2wp8t68UN8UBwkpxEbLpg\"",
    "mtime": "2026-02-12T20:16:08.621Z",
    "size": 40355,
    "path": "../public/effects/scenery-slicing/index.html"
  },
  "/effects/seizure/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"2a88-pTxWp2TGaznK7s5rjru9Ro8JjX0\"",
    "mtime": "2026-02-12T20:16:11.961Z",
    "size": 10888,
    "path": "../public/effects/seizure/_payload.json"
  },
  "/effects/sedation/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"bd35-aTRj4xWPFkOUF6Yau20gz7uz3iA\"",
    "mtime": "2026-02-12T20:16:08.621Z",
    "size": 48437,
    "path": "../public/effects/sedation/index.html"
  },
  "/effects/sensed-presence/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"24e8-rUyKtMUchkBJjYm7Ftc4Xk0lerk\"",
    "mtime": "2026-02-12T20:16:11.963Z",
    "size": 9448,
    "path": "../public/effects/sensed-presence/_payload.json"
  },
  "/effects/seizure/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"9c42-gtAWd/jKD/ioLgs2d0l/4J8IP/Y\"",
    "mtime": "2026-02-12T20:16:08.621Z",
    "size": 40002,
    "path": "../public/effects/seizure/index.html"
  },
  "/effects/sensory-overload/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"22d7-haoFUlCfe2rt2ZGXAbiOKz4QjGw\"",
    "mtime": "2026-02-12T20:16:11.965Z",
    "size": 8919,
    "path": "../public/effects/sensory-overload/_payload.json"
  },
  "/effects/sensed-presence/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"9a17-YKIyjyc0FAJXgkm52CODnG6fKOo\"",
    "mtime": "2026-02-12T20:16:08.623Z",
    "size": 39447,
    "path": "../public/effects/sensed-presence/index.html"
  },
  "/effects/serotonin-syndrome/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"2dc8-N9OWW1rAavLQMxKeLWikhbsDO3Q\"",
    "mtime": "2026-02-12T20:16:11.964Z",
    "size": 11720,
    "path": "../public/effects/serotonin-syndrome/_payload.json"
  },
  "/effects/seizure-suppression/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"11bd-N7fN9s2w9kNxiyFLRsvBbRGPZ+c\"",
    "mtime": "2026-02-12T20:16:11.963Z",
    "size": 4541,
    "path": "../public/effects/seizure-suppression/_payload.json"
  },
  "/effects/settings-sceneries-and-landscapes/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"6021-6Lpcw/TFET78452TnSZJyfihQUk\"",
    "mtime": "2026-02-12T20:16:11.965Z",
    "size": 24609,
    "path": "../public/effects/settings-sceneries-and-landscapes/_payload.json"
  },
  "/effects/sensory-overload/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"9d57-c4N5tT2pStXQJZy1S49bqYN6OsI\"",
    "mtime": "2026-02-12T20:16:08.635Z",
    "size": 40279,
    "path": "../public/effects/sensory-overload/index.html"
  },
  "/effects/serotonin-syndrome/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"8bc3-v/LOrRyZ/lYKMgOUccG6LuJqUao\"",
    "mtime": "2026-02-12T20:16:08.635Z",
    "size": 35779,
    "path": "../public/effects/serotonin-syndrome/index.html"
  },
  "/effects/shadow-people/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"a712-2sX2w4KcIv77jAzSoyKHJ68DWIg\"",
    "mtime": "2026-02-12T20:16:11.970Z",
    "size": 42770,
    "path": "../public/effects/shadow-people/_payload.json"
  },
  "/effects/seizure-suppression/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"8881-LkWgdb4sLNWkgtMgG5XQRK08FS8\"",
    "mtime": "2026-02-12T20:16:08.623Z",
    "size": 34945,
    "path": "../public/effects/seizure-suppression/index.html"
  },
  "/effects/settings-sceneries-and-landscapes/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"b630-fSnwdq5FZtfFznZ3+IsLhNLmKCw\"",
    "mtime": "2026-02-12T20:16:08.635Z",
    "size": 46640,
    "path": "../public/effects/settings-sceneries-and-landscapes/index.html"
  },
  "/effects/shakiness/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"3657-4L51uMWyk5yDhVJp2ykvuqXRsvI\"",
    "mtime": "2026-02-12T20:16:11.965Z",
    "size": 13911,
    "path": "../public/effects/shakiness/_payload.json"
  },
  "/effects/shakiness/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"a17d-x/yd1D0jRtl4cncQnolgbbD8gMk\"",
    "mtime": "2026-02-12T20:16:08.636Z",
    "size": 41341,
    "path": "../public/effects/shakiness/index.html"
  },
  "/effects/skin-flushing/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"1288-gtTdhuz38Uu7JlAPogupwE5k/+k\"",
    "mtime": "2026-02-12T20:16:11.970Z",
    "size": 4744,
    "path": "../public/effects/skin-flushing/_payload.json"
  },
  "/effects/shadow-people/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"cd48-HNT9ujOm+94xm4qR0TdXPA+vsms\"",
    "mtime": "2026-02-12T20:16:08.636Z",
    "size": 52552,
    "path": "../public/effects/shadow-people/index.html"
  },
  "/effects/sleepiness/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"311c-Prhye4svFmBLHmzHr8aHOQ4B8+4\"",
    "mtime": "2026-02-12T20:16:11.971Z",
    "size": 12572,
    "path": "../public/effects/sleepiness/_payload.json"
  },
  "/effects/skin-flushing/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"8a16-YY/Jw4JoFVSE/t8Jpn4wxIGBmW4\"",
    "mtime": "2026-02-12T20:16:08.636Z",
    "size": 35350,
    "path": "../public/effects/skin-flushing/index.html"
  },
  "/effects/spatial-disorientation/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"311a-EqjcFBbIhmVyzltUnr4SMTHscI4\"",
    "mtime": "2026-02-12T20:16:11.971Z",
    "size": 12570,
    "path": "../public/effects/spatial-disorientation/_payload.json"
  },
  "/effects/sleepiness/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"c597-ZVqcX7WLySw8PypIhzQqCMnqg3E\"",
    "mtime": "2026-02-12T20:16:08.678Z",
    "size": 50583,
    "path": "../public/effects/sleepiness/index.html"
  },
  "/effects/spirituality-enhancement/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"846a-UUhc2mAr9/N2ab4WNWNWV5Xi5iQ\"",
    "mtime": "2026-02-12T20:16:11.970Z",
    "size": 33898,
    "path": "../public/effects/spirituality-enhancement/_payload.json"
  },
  "/effects/spontaneous-physical-movements/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"158d-JOY8tKuThL4K9n9CHt9DhuGeBmg\"",
    "mtime": "2026-02-12T20:16:11.971Z",
    "size": 5517,
    "path": "../public/effects/spontaneous-physical-movements/_payload.json"
  },
  "/effects/spatial-disorientation/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"b2a0-3o1Yauipft7rVYRqbVBHJvS7RGw\"",
    "mtime": "2026-02-12T20:16:08.678Z",
    "size": 45728,
    "path": "../public/effects/spatial-disorientation/index.html"
  },
  "/effects/spirituality-enhancement/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"11336-IJTpt++2/o1ifvneNncXQCHxobw\"",
    "mtime": "2026-02-12T20:16:08.678Z",
    "size": 70454,
    "path": "../public/effects/spirituality-enhancement/index.html"
  },
  "/effects/spontaneous-tactile-sensations/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"7aa3-Bn4b9jyPoaOMz/mzdbHvekAxe9Y\"",
    "mtime": "2026-02-12T20:16:11.970Z",
    "size": 31395,
    "path": "../public/effects/spontaneous-tactile-sensations/_payload.json"
  },
  "/effects/spontaneous-physical-movements/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"9401-VQkOy9FN9JrhKLXc8Ie70Ypj2h0\"",
    "mtime": "2026-02-12T20:16:08.690Z",
    "size": 37889,
    "path": "../public/effects/spontaneous-physical-movements/index.html"
  },
  "/effects/stamina-enhancement/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"1bfd-+3iegmSgP7s4EuSUdUwI1ZobwoU\"",
    "mtime": "2026-02-12T20:16:11.971Z",
    "size": 7165,
    "path": "../public/effects/stamina-enhancement/_payload.json"
  },
  "/effects/spontaneous-tactile-sensations/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"c5e4-a9nlQEtz9W/f7ZbsGNe3mbZ/BOg\"",
    "mtime": "2026-02-12T20:16:08.678Z",
    "size": 50660,
    "path": "../public/effects/spontaneous-tactile-sensations/index.html"
  },
  "/effects/stomach-bloating/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"2a69-s5Io9dAZuax3zwFxq4tTIq7FLcI\"",
    "mtime": "2026-02-12T20:16:11.971Z",
    "size": 10857,
    "path": "../public/effects/stomach-bloating/_payload.json"
  },
  "/effects/stamina-enhancement/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"95a2-vfY74oexIR5ZevNj6Vu/ZqEGG8k\"",
    "mtime": "2026-02-12T20:16:08.678Z",
    "size": 38306,
    "path": "../public/effects/stamina-enhancement/index.html"
  },
  "/effects/stimulation/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"79ce-1FuzXKlbDonOtC0GQokYLaES1Io\"",
    "mtime": "2026-02-12T20:16:11.971Z",
    "size": 31182,
    "path": "../public/effects/stimulation/_payload.json"
  },
  "/effects/stomach-bloating/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"aace-Yo3rqmpctqsxUmfMpjjHUwgeK3o\"",
    "mtime": "2026-02-12T20:16:08.726Z",
    "size": 43726,
    "path": "../public/effects/stomach-bloating/index.html"
  },
  "/effects/stomach-cramp/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"1a0c-OYLwtI8eC4VgeQQW5DsmLBxvPg4\"",
    "mtime": "2026-02-12T20:16:11.973Z",
    "size": 6668,
    "path": "../public/effects/stomach-cramp/_payload.json"
  },
  "/effects/suggestibility-suppression/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"3163-1zo5vLGK+Hfjiri8xTYHlx0Fiuk\"",
    "mtime": "2026-02-12T20:16:11.973Z",
    "size": 12643,
    "path": "../public/effects/suggestibility-suppression/_payload.json"
  },
  "/effects/stimulation/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"b4d3-uE1BL9rJiB/b4x7KFfkj9DEg8AI\"",
    "mtime": "2026-02-12T20:16:08.690Z",
    "size": 46291,
    "path": "../public/effects/stimulation/index.html"
  },
  "/effects/suicidal-ideation/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"1ae1-9qnwByxb5w2X8thPeifctfLvVhY\"",
    "mtime": "2026-02-12T20:16:11.973Z",
    "size": 6881,
    "path": "../public/effects/suicidal-ideation/_payload.json"
  },
  "/effects/stomach-cramp/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"9679-K81NsG4HgOkKrCOzHzd5Z9ulnJU\"",
    "mtime": "2026-02-12T20:16:08.726Z",
    "size": 38521,
    "path": "../public/effects/stomach-cramp/index.html"
  },
  "/effects/suggestibility-suppression/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"a2bf-y2ifPArlXgTR4K/IfdCpQIBePWc\"",
    "mtime": "2026-02-12T20:16:08.737Z",
    "size": 41663,
    "path": "../public/effects/suggestibility-suppression/index.html"
  },
  "/effects/symmetrical-texture-repetition/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"77de-Q4qX7uzJ0RwdVGa+ScljFZe1oNI\"",
    "mtime": "2026-02-12T20:16:11.973Z",
    "size": 30686,
    "path": "../public/effects/symmetrical-texture-repetition/_payload.json"
  },
  "/effects/symmetrical-texture-repetition/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"bcb7-N2wU67o1uIiT+HapRVq5EH270VQ\"",
    "mtime": "2026-02-12T20:16:08.800Z",
    "size": 48311,
    "path": "../public/effects/symmetrical-texture-repetition/index.html"
  },
  "/effects/suicidal-ideation/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"9845-9aESe5mH14WeY67sFu99Kv3ykMg\"",
    "mtime": "2026-02-12T20:16:08.773Z",
    "size": 38981,
    "path": "../public/effects/suicidal-ideation/index.html"
  },
  "/effects/synaesthesia/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"2f89-bvI4KZNaIdcElmZT21isERMZHrs\"",
    "mtime": "2026-02-12T20:16:11.976Z",
    "size": 12169,
    "path": "../public/effects/synaesthesia/_payload.json"
  },
  "/effects/synaesthesia/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"aff4-9j29W+N4Lj7xdSCN+tQDXy6ASbw\"",
    "mtime": "2026-02-12T20:16:08.811Z",
    "size": 45044,
    "path": "../public/effects/synaesthesia/index.html"
  },
  "/effects/tactile-distortion/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"1e79-eBttwHq4LRxhP/VYOm0naQqHEIY\"",
    "mtime": "2026-02-12T20:16:11.977Z",
    "size": 7801,
    "path": "../public/effects/tactile-distortion/_payload.json"
  },
  "/effects/tactile-distortion/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"982a-LIckwkluAmhVxToZhn7Wsrmyeig\"",
    "mtime": "2026-02-12T20:16:08.831Z",
    "size": 38954,
    "path": "../public/effects/tactile-distortion/index.html"
  },
  "/effects/tactile-enhancement/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"40e5-R0SXmwwQhDqkmxLqBBgHeQGfrCI\"",
    "mtime": "2026-02-12T20:16:11.976Z",
    "size": 16613,
    "path": "../public/effects/tactile-enhancement/_payload.json"
  },
  "/effects/tactile-enhancement/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"aa84-PgGFYJiVIzxF3gTZp5vyfgeK/F0\"",
    "mtime": "2026-02-12T20:16:08.837Z",
    "size": 43652,
    "path": "../public/effects/tactile-enhancement/index.html"
  },
  "/effects/tactile-hallucination/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"392e-ry0F8QElr62+pVRdjPniPnwTw3M\"",
    "mtime": "2026-02-12T20:16:11.976Z",
    "size": 14638,
    "path": "../public/effects/tactile-hallucination/_payload.json"
  },
  "/effects/tactile-hallucination/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"b440-3qQH8xyjEOJS2V1W+7i3fgqfpbk\"",
    "mtime": "2026-02-12T20:16:08.841Z",
    "size": 46144,
    "path": "../public/effects/tactile-hallucination/index.html"
  },
  "/effects/tactile-suppression/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"2a61-yFY0fA3siqurvyiwLiN0SC+6KS4\"",
    "mtime": "2026-02-12T20:16:11.978Z",
    "size": 10849,
    "path": "../public/effects/tactile-suppression/_payload.json"
  },
  "/effects/teeth-grinding/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"3530-KDF3e7CPPnSApFclmvjELr9/hcw\"",
    "mtime": "2026-02-12T20:16:11.977Z",
    "size": 13616,
    "path": "../public/effects/teeth-grinding/_payload.json"
  },
  "/effects/teeth-chattering/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"1721-rir1NQXDyFoPumLHmH8wNCSHcvk\"",
    "mtime": "2026-02-12T20:16:11.977Z",
    "size": 5921,
    "path": "../public/effects/teeth-chattering/_payload.json"
  },
  "/effects/temperature-regulation-suppression/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"2adf-uxxuU5yWqUn9bDvzG1aQZ1Dp3NY\"",
    "mtime": "2026-02-12T20:16:11.977Z",
    "size": 10975,
    "path": "../public/effects/temperature-regulation-suppression/_payload.json"
  },
  "/effects/tactile-suppression/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"a355-amtpjNV3yif9T7XPPMEE14oZCY4\"",
    "mtime": "2026-02-12T20:16:08.841Z",
    "size": 41813,
    "path": "../public/effects/tactile-suppression/index.html"
  },
  "/effects/texture-liquidation/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"2965-o/wsHsLDZOyh+QJqd/65iLBmRwA\"",
    "mtime": "2026-02-12T20:16:11.977Z",
    "size": 10597,
    "path": "../public/effects/texture-liquidation/_payload.json"
  },
  "/effects/teeth-chattering/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"963b-Jx33GpvV0g0tuDkYkhP447UvZ3g\"",
    "mtime": "2026-02-12T20:16:08.841Z",
    "size": 38459,
    "path": "../public/effects/teeth-chattering/index.html"
  },
  "/effects/teeth-grinding/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"af16-1OEWoU5dvnrr1CjYmdT1bgibN2Y\"",
    "mtime": "2026-02-12T20:16:08.841Z",
    "size": 44822,
    "path": "../public/effects/teeth-grinding/index.html"
  },
  "/effects/temperature-regulation-suppression/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"a669-1DeWu48vV/BtJkcPP42iw3uUFc4\"",
    "mtime": "2026-02-12T20:16:08.841Z",
    "size": 42601,
    "path": "../public/effects/temperature-regulation-suppression/index.html"
  },
  "/effects/temporary-erectile-dysfunction/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"19a2-FUMaveWAZfHbozE6q9lHReruAWs\"",
    "mtime": "2026-02-12T20:16:11.977Z",
    "size": 6562,
    "path": "../public/effects/temporary-erectile-dysfunction/_payload.json"
  },
  "/effects/texture-liquidation/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"ac2c-S3ap6N58a5ONw2ddA3rZaTmIBeA\"",
    "mtime": "2026-02-12T20:16:08.841Z",
    "size": 44076,
    "path": "../public/effects/texture-liquidation/index.html"
  },
  "/effects/thought-acceleration/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"2ca6-sf1+ihg3T3wpc83UmJbNi3V/9z8\"",
    "mtime": "2026-02-12T20:16:11.980Z",
    "size": 11430,
    "path": "../public/effects/thought-acceleration/_payload.json"
  },
  "/effects/temporary-erectile-dysfunction/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"97f0-jxSjAzKn7j+zR1YSoGAMkqPcbyA\"",
    "mtime": "2026-02-12T20:16:08.841Z",
    "size": 38896,
    "path": "../public/effects/temporary-erectile-dysfunction/index.html"
  },
  "/effects/thought-connectivity/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"6ff7-SGWOr0wDLztKWf62RHhFRDohns8\"",
    "mtime": "2026-02-12T20:16:11.978Z",
    "size": 28663,
    "path": "../public/effects/thought-connectivity/_payload.json"
  },
  "/effects/thought-acceleration/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"b7cf-ATEpmD+0E1vFkeqOuaaWt5zp65A\"",
    "mtime": "2026-02-12T20:16:08.847Z",
    "size": 47055,
    "path": "../public/effects/thought-acceleration/index.html"
  },
  "/effects/thought-deceleration/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"3e57-bnkz9xVbU4laU0hQF8LaSL+X64Q\"",
    "mtime": "2026-02-12T20:16:11.980Z",
    "size": 15959,
    "path": "../public/effects/thought-deceleration/_payload.json"
  },
  "/effects/thought-disorganization/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"4ae9-4voTH4BLYmtOPvvFgx9cqQsI5Jg\"",
    "mtime": "2026-02-12T20:16:11.981Z",
    "size": 19177,
    "path": "../public/effects/thought-disorganization/_payload.json"
  },
  "/effects/thought-deceleration/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"dac5-mipu57qgUip+VchpTF4kZkX2gfQ\"",
    "mtime": "2026-02-12T20:16:08.860Z",
    "size": 56005,
    "path": "../public/effects/thought-deceleration/index.html"
  },
  "/effects/thought-connectivity/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"d75c-5b/AEBiM/3E4Cv+hPMr6ZnFjoY0\"",
    "mtime": "2026-02-12T20:16:08.841Z",
    "size": 55132,
    "path": "../public/effects/thought-connectivity/index.html"
  },
  "/effects/thought-loops/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"41d6-NEG7e11HZMfKi5E5FX9GKdXzOkY\"",
    "mtime": "2026-02-12T20:16:11.982Z",
    "size": 16854,
    "path": "../public/effects/thought-loops/_payload.json"
  },
  "/effects/thought-disorganization/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"d01c-t+z2PmVLxK8PC6bN7G448eyYIA4\"",
    "mtime": "2026-02-12T20:16:08.860Z",
    "size": 53276,
    "path": "../public/effects/thought-disorganization/index.html"
  },
  "/effects/thought-loops/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"b4b8-ZwwX4lLPnqDCt91cRgeHg1q31gU\"",
    "mtime": "2026-02-12T20:16:08.860Z",
    "size": 46264,
    "path": "../public/effects/thought-loops/index.html"
  },
  "/effects/thought-organization/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"288a-5FMKhg/acmUeaSpr69t7gVlSnDk\"",
    "mtime": "2026-02-12T20:16:11.982Z",
    "size": 10378,
    "path": "../public/effects/thought-organization/_payload.json"
  },
  "/effects/thought-organization/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"a4d3-2PGMpzJbj6Aax0808Ql733lHZUs\"",
    "mtime": "2026-02-12T20:16:08.861Z",
    "size": 42195,
    "path": "../public/effects/thought-organization/index.html"
  },
  "/effects/tinnitus/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"1f92-ZJbWFo8CUoxvD53tVkr57uNmokI\"",
    "mtime": "2026-02-12T20:16:11.982Z",
    "size": 8082,
    "path": "../public/effects/tinnitus/_payload.json"
  },
  "/effects/tracers/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"7cd2-QWotKOjIP4C63msXdwW8EdppyPw\"",
    "mtime": "2026-02-12T20:16:11.983Z",
    "size": 31954,
    "path": "../public/effects/tracers/_payload.json"
  },
  "/effects/tinnitus/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"a5cb-0CL8pdCTenMFGAHojJhF8HqFBhQ\"",
    "mtime": "2026-02-12T20:16:08.909Z",
    "size": 42443,
    "path": "../public/effects/tinnitus/index.html"
  },
  "/effects/tracers/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"db59-0pZnvquQ3iUAxCROAafUtGeZ3fw\"",
    "mtime": "2026-02-12T20:16:08.924Z",
    "size": 56153,
    "path": "../public/effects/tracers/index.html"
  },
  "/effects/time-distortion/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"d922-cql4qklHT7xB2RY5x3QGli/ibGA\"",
    "mtime": "2026-02-12T20:16:11.983Z",
    "size": 55586,
    "path": "../public/effects/time-distortion/_payload.json"
  },
  "/effects/transformations/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"6447-PMtjRXrgfASCi3EEPp4Oj8i3lVE\"",
    "mtime": "2026-02-12T20:16:11.982Z",
    "size": 25671,
    "path": "../public/effects/transformations/_payload.json"
  },
  "/effects/time-distortion/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"f05c-oVOquiRpIL6dcjqTxOBfEFqgE5c\"",
    "mtime": "2026-02-12T20:16:08.862Z",
    "size": 61532,
    "path": "../public/effects/time-distortion/index.html"
  },
  "/effects/transformations/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"b2a8-EZUaXnthpPLyS3mwgwtb+Tuuqrk\"",
    "mtime": "2026-02-12T20:16:08.909Z",
    "size": 45736,
    "path": "../public/effects/transformations/index.html"
  },
  "/effects/unity-and-interconnectedness/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"1489c-Xmnomb5OkXhv1sDXYmnsg3HZQR0\"",
    "mtime": "2026-02-12T20:16:11.984Z",
    "size": 84124,
    "path": "../public/effects/unity-and-interconnectedness/_payload.json"
  },
  "/effects/vasoconstriction/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"2232-v4In9wTuViQiAxbIZ76Zxu0VLsQ\"",
    "mtime": "2026-02-12T20:16:11.984Z",
    "size": 8754,
    "path": "../public/effects/vasoconstriction/_payload.json"
  },
  "/effects/vasoconstriction/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"a410-8w5ulIWQ2Vd3YWRsODHfyvGsSNA\"",
    "mtime": "2026-02-12T20:16:08.941Z",
    "size": 42000,
    "path": "../public/effects/vasoconstriction/index.html"
  },
  "/effects/unspeakable-horrors/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"ab7c-fwo2i9iaUrWDbzd0YHHvgGdqj4M\"",
    "mtime": "2026-02-12T20:16:11.984Z",
    "size": 43900,
    "path": "../public/effects/unspeakable-horrors/_payload.json"
  },
  "/effects/unity-and-interconnectedness/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"110ef-LtUlewnej1GWsxlWTSpo3qNl32I\"",
    "mtime": "2026-02-12T20:16:08.941Z",
    "size": 69871,
    "path": "../public/effects/unity-and-interconnectedness/index.html"
  },
  "/effects/vasodilation/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"206e-PToZUAAB555wlhjBgYYrhFTrFmI\"",
    "mtime": "2026-02-12T20:16:11.984Z",
    "size": 8302,
    "path": "../public/effects/vasodilation/_payload.json"
  },
  "/effects/vibrating-vision/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"1ff3-G9XVBmYorF9JqWzCRbm61wuEkqU\"",
    "mtime": "2026-02-12T20:16:11.984Z",
    "size": 8179,
    "path": "../public/effects/vibrating-vision/_payload.json"
  },
  "/effects/unspeakable-horrors/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"c837-WXGRHk+XAT/QIEzawMOSwo9wSys\"",
    "mtime": "2026-02-12T20:16:08.941Z",
    "size": 51255,
    "path": "../public/effects/unspeakable-horrors/index.html"
  },
  "/effects/vasodilation/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"9871-7K4/KYyMiTaPDWXFKLKtczg4qw8\"",
    "mtime": "2026-02-12T20:16:08.941Z",
    "size": 39025,
    "path": "../public/effects/vasodilation/index.html"
  },
  "/effects/vibrating-vision/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"a89c-jTqg3ZHUuaG6fcfRxdxnXF4aK6M\"",
    "mtime": "2026-02-12T20:16:08.941Z",
    "size": 43164,
    "path": "../public/effects/vibrating-vision/index.html"
  },
  "/effects/visual-acuity-enhancement/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"591c-4omF4rDvYD3FUUZ2FDAAdH0mFBo\"",
    "mtime": "2026-02-12T20:16:11.984Z",
    "size": 22812,
    "path": "../public/effects/visual-acuity-enhancement/_payload.json"
  },
  "/effects/visual-acuity-enhancement/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"d128-PmUAh6AGcJDVZ4RcsKLpz83TkXE\"",
    "mtime": "2026-02-12T20:16:08.964Z",
    "size": 53544,
    "path": "../public/effects/visual-acuity-enhancement/index.html"
  },
  "/effects/visual-acuity-suppression/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"47e1-vX2ILCoMaAERxvfIoxCg4GpEqmY\"",
    "mtime": "2026-02-12T20:16:11.984Z",
    "size": 18401,
    "path": "../public/effects/visual-acuity-suppression/_payload.json"
  },
  "/effects/visual-acuity-suppression/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"bb56-T7qj//t9QByKH+HxRJuZDisgOYU\"",
    "mtime": "2026-02-12T20:16:08.964Z",
    "size": 47958,
    "path": "../public/effects/visual-acuity-suppression/index.html"
  },
  "/effects/visual-auras/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"1a98-JyrFSWdlhuGn104SKfekolp4o94\"",
    "mtime": "2026-02-12T20:16:11.985Z",
    "size": 6808,
    "path": "../public/effects/visual-auras/_payload.json"
  },
  "/effects/visual-agnosia/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"34e8-eIJ2cxr8RKEAgVBrGjdaqbbwawE\"",
    "mtime": "2026-02-12T20:16:11.984Z",
    "size": 13544,
    "path": "../public/effects/visual-agnosia/_payload.json"
  },
  "/effects/visual-auras/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"9a02-eFhotMDsv8e7fuMgyE6WzUp/FvY\"",
    "mtime": "2026-02-12T20:16:08.965Z",
    "size": 39426,
    "path": "../public/effects/visual-auras/index.html"
  },
  "/effects/visual-exposure-to-inner-mechanics-of-consciousness/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"316d-7sJYslS4XFfHaUQ+kJn3sbSr9SY\"",
    "mtime": "2026-02-12T20:16:11.985Z",
    "size": 12653,
    "path": "../public/effects/visual-exposure-to-inner-mechanics-of-consciousness/_payload.json"
  },
  "/effects/visual-agnosia/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"a2fa-RTusaV7w0Y4dlofuOlnipGd24gU\"",
    "mtime": "2026-02-12T20:16:08.964Z",
    "size": 41722,
    "path": "../public/effects/visual-agnosia/index.html"
  },
  "/effects/visual-exposure-to-inner-mechanics-of-consciousness/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"9326-oVLoF3Wx8GudgmvuRD8rvcBBZS4\"",
    "mtime": "2026-02-12T20:16:09.156Z",
    "size": 37670,
    "path": "../public/effects/visual-exposure-to-inner-mechanics-of-consciousness/index.html"
  },
  "/effects/visual-exposure-to-semantic-concept-network/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"44f6-JRJOEA/AlSjxzyxu3dkFGZm2dew\"",
    "mtime": "2026-02-12T20:16:11.986Z",
    "size": 17654,
    "path": "../public/effects/visual-exposure-to-semantic-concept-network/_payload.json"
  },
  "/effects/visual-disconnection/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"12b80-meb1dql0A+lEBPvP4oZd/uaaWEs\"",
    "mtime": "2026-02-12T20:16:11.985Z",
    "size": 76672,
    "path": "../public/effects/visual-disconnection/_payload.json"
  },
  "/effects/visual-exposure-to-semantic-concept-network/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"9b5f-gNpMt7+nirPxYeK35WUaLdg9JSY\"",
    "mtime": "2026-02-12T20:16:09.167Z",
    "size": 39775,
    "path": "../public/effects/visual-exposure-to-semantic-concept-network/index.html"
  },
  "/effects/visual-flipping/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"1630-MAWRWPC7BabM1UpCF1HpvqhehvM\"",
    "mtime": "2026-02-12T20:16:11.987Z",
    "size": 5680,
    "path": "../public/effects/visual-flipping/_payload.json"
  },
  "/effects/visual-disconnection/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"1022f-l0V+84szr4CZxmuT6YgLkTXSTMQ\"",
    "mtime": "2026-02-12T20:16:09.014Z",
    "size": 66095,
    "path": "../public/effects/visual-disconnection/index.html"
  },
  "/effects/visual-flipping/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"8823-+85rwU/TtvlGnf+bANLScYqmTB8\"",
    "mtime": "2026-02-12T20:16:09.171Z",
    "size": 34851,
    "path": "../public/effects/visual-flipping/index.html"
  },
  "/effects/visual-haze/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"2a40-KNG1TKupWoatmuYZ7k1aMttdQjo\"",
    "mtime": "2026-02-12T20:16:11.987Z",
    "size": 10816,
    "path": "../public/effects/visual-haze/_payload.json"
  },
  "/effects/visual-stretching/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"1b29-gXANFZtnp3ZqgVY9VuvSPP3CA0A\"",
    "mtime": "2026-02-12T20:16:11.987Z",
    "size": 6953,
    "path": "../public/effects/visual-stretching/_payload.json"
  },
  "/effects/visual-haze/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"a60f-qGcKkrtHc8+Fc0X4RR3xKR+zlOY\"",
    "mtime": "2026-02-12T20:16:09.170Z",
    "size": 42511,
    "path": "../public/effects/visual-haze/index.html"
  },
  "/effects/visual-processing-acceleration/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"9934-nCFuzLrc5y7A1YKPRAI2czu2xrE\"",
    "mtime": "2026-02-12T20:16:09.187Z",
    "size": 39220,
    "path": "../public/effects/visual-processing-acceleration/index.html"
  },
  "/effects/visual-strobing/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"2299-1triKKz5ZWBWjlv7gNh5/qv8Nok\"",
    "mtime": "2026-02-12T20:16:11.987Z",
    "size": 8857,
    "path": "../public/effects/visual-strobing/_payload.json"
  },
  "/effects/visual-processing-acceleration/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"1fbc-iRmjr41tnBKCoOX60HMWy9IcybE\"",
    "mtime": "2026-02-12T20:16:11.987Z",
    "size": 8124,
    "path": "../public/effects/visual-processing-acceleration/_payload.json"
  },
  "/effects/visual-stretching/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"a182-9QQs+Paf/iQDMIw5bGWx9GdHS2k\"",
    "mtime": "2026-02-12T20:16:09.187Z",
    "size": 41346,
    "path": "../public/effects/visual-stretching/index.html"
  },
  "/effects/visual-strobing/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"9fb5-yQhKM/VAygjxsx8NwmZX8EhER1I\"",
    "mtime": "2026-02-12T20:16:09.187Z",
    "size": 40885,
    "path": "../public/effects/visual-strobing/index.html"
  },
  "/effects/visual-twisting/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"1b5e-AKzSCdt6ZM0qf9nDXZCo7CIJLF0\"",
    "mtime": "2026-02-12T20:16:11.987Z",
    "size": 7006,
    "path": "../public/effects/visual-twisting/_payload.json"
  },
  "/effects/wakefulness/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"29b3-PKklNiODQIOojj/FIAW4fs0k8PY\"",
    "mtime": "2026-02-12T20:16:11.987Z",
    "size": 10675,
    "path": "../public/effects/wakefulness/_payload.json"
  },
  "/effects/visual-twisting/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"97f1-xedE1F+f31SWIsaEBK8Z0cPB+Mk\"",
    "mtime": "2026-02-12T20:16:09.187Z",
    "size": 38897,
    "path": "../public/effects/visual-twisting/index.html"
  },
  "/effects/watery-eyes/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"1bcc-bPoYlT0mZqJmRhoHbx8wmo+9HJ8\"",
    "mtime": "2026-02-12T20:16:11.987Z",
    "size": 7116,
    "path": "../public/effects/watery-eyes/_payload.json"
  },
  "/effects/wakefulness/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"bbd9-tyu8jL1B6uMB7XvgfqsMP1uMk+Q\"",
    "mtime": "2026-02-12T20:16:09.187Z",
    "size": 48089,
    "path": "../public/effects/wakefulness/index.html"
  },
  "/profiles/Hypnagogist/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-cKB6cSvoCoNaZQIg406VxHZy/J0\"",
    "mtime": "2026-02-12T20:16:11.994Z",
    "size": 69,
    "path": "../public/profiles/Hypnagogist/_payload.json"
  },
  "/effects/watery-eyes/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"9b82-JlnmiDMQ3ErBQtvk7ny6JPyHPR4\"",
    "mtime": "2026-02-12T20:16:09.187Z",
    "size": 39810,
    "path": "../public/effects/watery-eyes/index.html"
  },
  "/profiles/Hypnagogist/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"7866-Wcbe4r9DZs7vtXs/v5fvTqqmPMA\"",
    "mtime": "2026-02-12T20:16:09.282Z",
    "size": 30822,
    "path": "../public/profiles/Hypnagogist/index.html"
  },
  "/profiles/Josie/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-bVyA3+FjGbfy/Jn82uTBF26sFnU\"",
    "mtime": "2026-02-12T20:16:11.990Z",
    "size": 69,
    "path": "../public/profiles/Josie/_payload.json"
  },
  "/profiles/Maethor/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-h08yYYKtw/ASDDYuctJugXxk6VU\"",
    "mtime": "2026-02-12T20:16:11.990Z",
    "size": 69,
    "path": "../public/profiles/Maethor/_payload.json"
  },
  "/profiles/Natalie/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-73WlRJuxkrY9Zl3/6hPVl9TuBlE\"",
    "mtime": "2026-02-12T20:16:11.994Z",
    "size": 69,
    "path": "../public/profiles/Natalie/_payload.json"
  },
  "/profiles/Josie/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"7854-Lb0I0Ry+RmpYes/F61vq+IWcvyo\"",
    "mtime": "2026-02-12T20:16:09.282Z",
    "size": 30804,
    "path": "../public/profiles/Josie/index.html"
  },
  "/profiles/Rho/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-BUryfZBge4pSTmJP+v1ofQduMdk\"",
    "mtime": "2026-02-12T20:16:11.994Z",
    "size": 69,
    "path": "../public/profiles/Rho/_payload.json"
  },
  "/profiles/Maethor/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"785a-73VJ6T2r3FT4Qds2Oz54wjaQKik\"",
    "mtime": "2026-02-12T20:16:09.282Z",
    "size": 30810,
    "path": "../public/profiles/Maethor/index.html"
  },
  "/profiles/StingrayZ/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-4F0ldKchehvE+Sa3fd6sMpy14TA\"",
    "mtime": "2026-02-12T20:16:11.994Z",
    "size": 69,
    "path": "../public/profiles/StingrayZ/_payload.json"
  },
  "/profiles/Natalie/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"785a-Bm02tdI3ndRm3he+4aA/CzEOoNU\"",
    "mtime": "2026-02-12T20:16:09.303Z",
    "size": 30810,
    "path": "../public/profiles/Natalie/index.html"
  },
  "/profiles/nervewing/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-leBCpxQB++9Rz9MyomPCUR6DfBQ\"",
    "mtime": "2026-02-12T20:16:11.994Z",
    "size": 69,
    "path": "../public/profiles/nervewing/_payload.json"
  },
  "/profiles/StingrayZ/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"7860-7RfZrQa5R0KPUBV/lOH/YTXRJqQ\"",
    "mtime": "2026-02-12T20:16:09.315Z",
    "size": 30816,
    "path": "../public/profiles/StingrayZ/index.html"
  },
  "/profiles/Viscid/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"7857-htAWJx11FI1erB3nM0coBzZV7Nk\"",
    "mtime": "2026-02-12T20:16:09.315Z",
    "size": 30807,
    "path": "../public/profiles/Viscid/index.html"
  },
  "/profiles/Rho/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"784e-iTFDh2gdlD3NN0jqFahryi9EQkk\"",
    "mtime": "2026-02-12T20:16:09.315Z",
    "size": 30798,
    "path": "../public/profiles/Rho/index.html"
  },
  "/people/josie/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"896-ogD0UhUpb6PN1FZCof6KlVZNceU\"",
    "mtime": "2026-02-12T20:16:11.987Z",
    "size": 2198,
    "path": "../public/people/josie/_payload.json"
  },
  "/profiles/Viscid/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-CUQ3UwBQ0mUqQKIuW1WPHpu6iOU\"",
    "mtime": "2026-02-12T20:16:11.994Z",
    "size": 69,
    "path": "../public/profiles/Viscid/_payload.json"
  },
  "/profiles/nervewing/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"7860-Sm9TfmHxDmtOyDhM0uOQPv1JAD4\"",
    "mtime": "2026-02-12T20:16:09.315Z",
    "size": 30816,
    "path": "../public/profiles/nervewing/index.html"
  },
  "/people/maethor/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"783-nzyOSE09SJQHzZtqa41ytZrL1B4\"",
    "mtime": "2026-02-12T20:16:11.988Z",
    "size": 1923,
    "path": "../public/people/maethor/_payload.json"
  },
  "/people/utheraptor/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"f44-YE5uTHfua/RouEN4Hd6o1vo0fFw\"",
    "mtime": "2026-02-12T20:16:11.988Z",
    "size": 3908,
    "path": "../public/people/utheraptor/_payload.json"
  },
  "/people/josie/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"80ff-+iMXTSn9HqbdL8KmTHnMGetUOCE\"",
    "mtime": "2026-02-12T20:16:09.231Z",
    "size": 33023,
    "path": "../public/people/josie/index.html"
  },
  "/people/maethor/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"7f79-aTIsIQffXv/OR1JlpFEiW7QYKzY\"",
    "mtime": "2026-02-12T20:16:09.239Z",
    "size": 32633,
    "path": "../public/people/maethor/index.html"
  },
  "/people/utheraptor/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"843a-Djw4lU5Wk+N33hVunW8wMknz3uI\"",
    "mtime": "2026-02-12T20:16:09.251Z",
    "size": 33850,
    "path": "../public/people/utheraptor/index.html"
  },
  "/people/viscid/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"22f-8X7Zt8H37sVNyV2yATRrbYFrWWc\"",
    "mtime": "2026-02-12T20:16:11.988Z",
    "size": 559,
    "path": "../public/people/viscid/_payload.json"
  },
  "/people/viscid/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"7d7c-WVc7mG8+5EQGUMbVUNUBkbz+HrY\"",
    "mtime": "2026-02-12T20:16:09.247Z",
    "size": 32124,
    "path": "../public/people/viscid/index.html"
  },
  "/reports/a-cruel-prank/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-Slk2iy7hF0cSLmqHqWlzyM8VhO8\"",
    "mtime": "2026-02-12T20:16:11.994Z",
    "size": 69,
    "path": "../public/reports/a-cruel-prank/_payload.json"
  },
  "/reports/a-delightfully-fun-and-clear-headed-psychedelic/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-zE5xHyNydkocwQGNzE5d30SGNec\"",
    "mtime": "2026-02-12T20:16:11.995Z",
    "size": 69,
    "path": "../public/reports/a-delightfully-fun-and-clear-headed-psychedelic/_payload.json"
  },
  "/reports/a-fire-across-the-nation/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-1RFeFB7778lU0xZeRTin6gYtDF8\"",
    "mtime": "2026-02-12T20:16:11.995Z",
    "size": 69,
    "path": "../public/reports/a-fire-across-the-nation/_payload.json"
  },
  "/reports/a-hell-of-a-void/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-VK4qyalcxdM04+vqIZWSQH6G7sM\"",
    "mtime": "2026-02-12T20:16:11.996Z",
    "size": 69,
    "path": "../public/reports/a-hell-of-a-void/_payload.json"
  },
  "/reports/a-delightfully-fun-and-clear-headed-psychedelic/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"8692-tyuxKWu+RV0ycxqOUDCFLJMC4k4\"",
    "mtime": "2026-02-12T20:16:09.402Z",
    "size": 34450,
    "path": "../public/reports/a-delightfully-fun-and-clear-headed-psychedelic/index.html"
  },
  "/reports/a-fire-across-the-nation/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"864d-HLGONrT1V9NHBRVYNk+0O3UAcJQ\"",
    "mtime": "2026-02-12T20:16:09.405Z",
    "size": 34381,
    "path": "../public/reports/a-fire-across-the-nation/index.html"
  },
  "/reports/a-cruel-prank/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"862c-vTx1/6nSAmOtXGAy+SdxPdxqeiM\"",
    "mtime": "2026-02-12T20:16:09.351Z",
    "size": 34348,
    "path": "../public/reports/a-cruel-prank/index.html"
  },
  "/reports/a-hell-of-a-void/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"8635-Tdu/TfdYZLyDfWzq/bFoo7Q2JZ8\"",
    "mtime": "2026-02-12T20:16:09.412Z",
    "size": 34357,
    "path": "../public/reports/a-hell-of-a-void/index.html"
  },
  "/reports/a-pleasant-morning/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-0oR21ts4NXdc3SbsQh+9r2U011c\"",
    "mtime": "2026-02-12T20:16:11.997Z",
    "size": 69,
    "path": "../public/reports/a-pleasant-morning/_payload.json"
  },
  "/reports/a-hot-furnace-in-an-empty-room/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-gW0QK/yG/g0owWG2DSOoocCpAPQ\"",
    "mtime": "2026-02-12T20:16:11.998Z",
    "size": 69,
    "path": "../public/reports/a-hot-furnace-in-an-empty-room/_payload.json"
  },
  "/reports/a-profound-sense-of-oneness/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-5U+csGwgpP5Ax38I0i0LlcfW1DE\"",
    "mtime": "2026-02-12T20:16:11.997Z",
    "size": 69,
    "path": "../public/reports/a-profound-sense-of-oneness/_payload.json"
  },
  "/reports/a-punch-in-the-gut-3/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-D1RwtX7mvqaFot+ebdwPqf5briQ\"",
    "mtime": "2026-02-12T20:16:11.998Z",
    "size": 69,
    "path": "../public/reports/a-punch-in-the-gut-3/_payload.json"
  },
  "/reports/a-pleasant-morning/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"863b-JkGBTFxG8n5IA/2pwSPmpzNfDI8\"",
    "mtime": "2026-02-12T20:16:09.419Z",
    "size": 34363,
    "path": "../public/reports/a-pleasant-morning/index.html"
  },
  "/reports/a-relaxing-morning-in-the-park/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-uf363Fn8eqXwv/PDXJbbFY6h7MA\"",
    "mtime": "2026-02-12T20:16:11.998Z",
    "size": 69,
    "path": "../public/reports/a-relaxing-morning-in-the-park/_payload.json"
  },
  "/reports/a-hot-furnace-in-an-empty-room/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"865f-vZ6fDa1Xo6yBoFqDFr9YmvTUepk\"",
    "mtime": "2026-02-12T20:16:09.419Z",
    "size": 34399,
    "path": "../public/reports/a-hot-furnace-in-an-empty-room/index.html"
  },
  "/reports/a-river-of-gravel-drowning-in-my-mind/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-8t2L05Qme6KyMfybB3MS0JIlHy8\"",
    "mtime": "2026-02-12T20:16:11.997Z",
    "size": 69,
    "path": "../public/reports/a-river-of-gravel-drowning-in-my-mind/_payload.json"
  },
  "/reports/a-profound-sense-of-oneness/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"8656-RP8F1nHzgMpfitRgXvLKxGbQDa8\"",
    "mtime": "2026-02-12T20:16:09.419Z",
    "size": 34390,
    "path": "../public/reports/a-profound-sense-of-oneness/index.html"
  },
  "/reports/a-punch-in-the-gut-3/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"8641-QV/CsCzVCbMJNlg+3EQXcQqChuU\"",
    "mtime": "2026-02-12T20:16:09.419Z",
    "size": 34369,
    "path": "../public/reports/a-punch-in-the-gut-3/index.html"
  },
  "/reports/a-slap-in-the-face/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-I1kXXHOjEqOlLlovtJhrnBH9yM0\"",
    "mtime": "2026-02-12T20:16:11.998Z",
    "size": 69,
    "path": "../public/reports/a-slap-in-the-face/_payload.json"
  },
  "/reports/a-relaxing-morning-in-the-park/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"865f-84hyDxB04uqqRqHuu8MnemX6nD0\"",
    "mtime": "2026-02-12T20:16:09.419Z",
    "size": 34399,
    "path": "../public/reports/a-relaxing-morning-in-the-park/index.html"
  },
  "/reports/a-river-of-gravel-drowning-in-my-mind/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"8674-d9BGTYUMMSxxrpbkA2suRefyqsI\"",
    "mtime": "2026-02-12T20:16:09.419Z",
    "size": 34420,
    "path": "../public/reports/a-river-of-gravel-drowning-in-my-mind/index.html"
  },
  "/reports/a-slap-in-the-face/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"863b-TUmEoG5k/NchpP4yc6+j4IXP+Zg\"",
    "mtime": "2026-02-12T20:16:09.419Z",
    "size": 34363,
    "path": "../public/reports/a-slap-in-the-face/index.html"
  },
  "/reports/a-surprising-effect/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-ByJFrHCeLuVj8yU5AtQ+9bAGXkY\"",
    "mtime": "2026-02-12T20:16:11.998Z",
    "size": 69,
    "path": "../public/reports/a-surprising-effect/_payload.json"
  },
  "/reports/a-tall-humanoid-figure-wearing-a-white-cloak/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-7ihjsr/WUTkbAife8Yb6EHuwJqg\"",
    "mtime": "2026-02-12T20:16:11.998Z",
    "size": 69,
    "path": "../public/reports/a-tall-humanoid-figure-wearing-a-white-cloak/_payload.json"
  },
  "/reports/a-surprising-effect/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"863e-ca3lpCmbitNUnGm6CnsgB+Y9dG4\"",
    "mtime": "2026-02-12T20:16:09.419Z",
    "size": 34366,
    "path": "../public/reports/a-surprising-effect/index.html"
  },
  "/reports/a-tall-humanoid-figure-wearing-a-white-cloak/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"8689-iV5t2k4vNzOj7pyghEpqXn7poVA\"",
    "mtime": "2026-02-12T20:16:09.445Z",
    "size": 34441,
    "path": "../public/reports/a-tall-humanoid-figure-wearing-a-white-cloak/index.html"
  },
  "/reports/agile-and-competent/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-MXggldE086R3nw/2+KJ6b+GT0lk\"",
    "mtime": "2026-02-12T20:16:11.998Z",
    "size": 69,
    "path": "../public/reports/agile-and-competent/_payload.json"
  },
  "/reports/agile-and-competent/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"863e-V0QC7do7AMPLLmZQG6t96OfAfMY\"",
    "mtime": "2026-02-12T20:16:09.439Z",
    "size": 34366,
    "path": "../public/reports/agile-and-competent/index.html"
  },
  "/reports/altered-sounds-as-advertised/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-TmaQKRGzKCWf9PHicFtVEu8mnGY\"",
    "mtime": "2026-02-12T20:16:12.002Z",
    "size": 69,
    "path": "../public/reports/altered-sounds-as-advertised/_payload.json"
  },
  "/reports/an-arrow-to-the-face/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-L3r+82eCHFUtS+Dn3+lF0Ye0nC4\"",
    "mtime": "2026-02-12T20:16:12.000Z",
    "size": 69,
    "path": "../public/reports/an-arrow-to-the-face/_payload.json"
  },
  "/reports/altered-sounds-as-advertised/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"8659-P1KpZdjXX9zjrzIjm8FMQzsGBJo\"",
    "mtime": "2026-02-12T20:16:09.456Z",
    "size": 34393,
    "path": "../public/reports/altered-sounds-as-advertised/index.html"
  },
  "/reports/an-exploration-into-the-depths-of-psilocybin/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-Pok/sHgji0CSsBR1PzJAgaetCLU\"",
    "mtime": "2026-02-12T20:16:12.000Z",
    "size": 69,
    "path": "../public/reports/an-exploration-into-the-depths-of-psilocybin/_payload.json"
  },
  "/reports/an-interesting-night/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-dnx1elYLBesaPVuao4jQg7QoyBU\"",
    "mtime": "2026-02-12T20:16:12.001Z",
    "size": 69,
    "path": "../public/reports/an-interesting-night/_payload.json"
  },
  "/reports/an-underwhelming-experience/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-wT4dxOQCiWI6tlV1q3+LF2CVai4\"",
    "mtime": "2026-02-12T20:16:12.002Z",
    "size": 69,
    "path": "../public/reports/an-underwhelming-experience/_payload.json"
  },
  "/reports/an-arrow-to-the-face/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"8641-TOKAt7ZP9yl34E+tEt7puk+4FlY\"",
    "mtime": "2026-02-12T20:16:09.456Z",
    "size": 34369,
    "path": "../public/reports/an-arrow-to-the-face/index.html"
  },
  "/reports/an-exploration-into-the-depths-of-psilocybin/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"8689-9+3TLoDTWmno4RPY/5XV1/YJN74\"",
    "mtime": "2026-02-12T20:16:09.456Z",
    "size": 34441,
    "path": "../public/reports/an-exploration-into-the-depths-of-psilocybin/index.html"
  },
  "/reports/another-punch-in-the-gut/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-kWswWTiIweZWUJAdawvyVQPbYYw\"",
    "mtime": "2026-02-12T20:16:12.002Z",
    "size": 69,
    "path": "../public/reports/another-punch-in-the-gut/_payload.json"
  },
  "/reports/an-interesting-night/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"8641-a7BKn2lhBepAcrxgqslM6FmUoM0\"",
    "mtime": "2026-02-12T20:16:09.456Z",
    "size": 34369,
    "path": "../public/reports/an-interesting-night/index.html"
  },
  "/reports/an-underwhelming-experience/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"8656-V6CDsKb7YOdYHrxopwK/GMGra8I\"",
    "mtime": "2026-02-12T20:16:09.496Z",
    "size": 34390,
    "path": "../public/reports/an-underwhelming-experience/index.html"
  },
  "/reports/another-punch-in-the-gut/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"864d-c1VAjN3ik1jiRyS4umZBbGmU1Xg\"",
    "mtime": "2026-02-12T20:16:09.494Z",
    "size": 34381,
    "path": "../public/reports/another-punch-in-the-gut/index.html"
  },
  "/reports/awkward-acid/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-hi6LWP8BKqllgplzOufyGWsAtw8\"",
    "mtime": "2026-02-12T20:16:12.012Z",
    "size": 69,
    "path": "../public/reports/awkward-acid/_payload.json"
  },
  "/reports/bastard-wizard-and-his-miserable-little-witch-bitch/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-0JULGgCZlNx3c3oyhdVGVeFJxYA\"",
    "mtime": "2026-02-12T20:16:12.003Z",
    "size": 69,
    "path": "../public/reports/bastard-wizard-and-his-miserable-little-witch-bitch/_payload.json"
  },
  "/reports/best-cake-i-ve-had-for-a-while/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-wxlifi76PbIs1Z8E41y0gDAF+FU\"",
    "mtime": "2026-02-12T20:16:12.014Z",
    "size": 69,
    "path": "../public/reports/best-cake-i-ve-had-for-a-while/_payload.json"
  },
  "/reports/brief-unity-on-weed/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-jaFs+1vP7TABIqnlOfbFbJ40Q0k\"",
    "mtime": "2026-02-12T20:16:12.012Z",
    "size": 69,
    "path": "../public/reports/brief-unity-on-weed/_payload.json"
  },
  "/reports/awkward-acid/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"8629-HmVfXxGFVdIA/YSlK6Jg0Y30gPQ\"",
    "mtime": "2026-02-12T20:16:09.496Z",
    "size": 34345,
    "path": "../public/reports/awkward-acid/index.html"
  },
  "/reports/best-cake-i-ve-had-for-a-while/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"865f-lGOuROAshChbyb2ntk87we5oczo\"",
    "mtime": "2026-02-12T20:16:09.497Z",
    "size": 34399,
    "path": "../public/reports/best-cake-i-ve-had-for-a-while/index.html"
  },
  "/reports/bastard-wizard-and-his-miserable-little-witch-bitch/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"869e-rLPx/VitF87QWI9bqAFfCQ2w5/0\"",
    "mtime": "2026-02-12T20:16:09.496Z",
    "size": 34462,
    "path": "../public/reports/bastard-wizard-and-his-miserable-little-witch-bitch/index.html"
  },
  "/reports/brilliant-flogging/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-EQ++lNOUDvlGN1jB8ZPoeUJ38hM\"",
    "mtime": "2026-02-12T20:16:12.014Z",
    "size": 69,
    "path": "../public/reports/brilliant-flogging/_payload.json"
  },
  "/reports/brief-unity-on-weed/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"863e-ESpOmI3yZxuSY7Sts045QhvIjUw\"",
    "mtime": "2026-02-12T20:16:09.497Z",
    "size": 34366,
    "path": "../public/reports/brief-unity-on-weed/index.html"
  },
  "/reports/brilliant-flogging/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"863b-RaQ+p/17fVpBDPT7LN6H4ZPaRGY\"",
    "mtime": "2026-02-12T20:16:09.497Z",
    "size": 34363,
    "path": "../public/reports/brilliant-flogging/index.html"
  },
  "/reports/comfortably-melty-and-floaty/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-VP2SYYs9exKCxLq20xUlWVA10hw\"",
    "mtime": "2026-02-12T20:16:12.012Z",
    "size": 69,
    "path": "../public/reports/comfortably-melty-and-floaty/_payload.json"
  },
  "/reports/cosmic-copyright-warning/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-p8oFP+42XeYATPLxDamhSCIVU9E\"",
    "mtime": "2026-02-12T20:16:12.012Z",
    "size": 69,
    "path": "../public/reports/cosmic-copyright-warning/_payload.json"
  },
  "/reports/comfortably-melty-and-floaty/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"8659-xwbQQmkNFrblFvjDgMJiuc8uykQ\"",
    "mtime": "2026-02-12T20:16:09.516Z",
    "size": 34393,
    "path": "../public/reports/comfortably-melty-and-floaty/index.html"
  },
  "/reports/cold-shock/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-It32awd+mYmMU1KUP7MaFrRPWwM\"",
    "mtime": "2026-02-12T20:16:12.013Z",
    "size": 69,
    "path": "../public/reports/cold-shock/_payload.json"
  },
  "/reports/cosmic-copyright-warning/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"864d-TFW+ieTba0pnoOZmM1FKRBmi6xE\"",
    "mtime": "2026-02-12T20:16:09.516Z",
    "size": 34381,
    "path": "../public/reports/cosmic-copyright-warning/index.html"
  },
  "/reports/delirious-laughter/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-xLqaYjE1mUXysTDsGpkQxWHTcMU\"",
    "mtime": "2026-02-12T20:16:12.012Z",
    "size": 69,
    "path": "../public/reports/delirious-laughter/_payload.json"
  },
  "/reports/cold-shock/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"8623-Uxx4CuKfLh6uP7EURmI+/bMVPcg\"",
    "mtime": "2026-02-12T20:16:09.516Z",
    "size": 34339,
    "path": "../public/reports/cold-shock/index.html"
  },
  "/reports/crystal-clear-dream-recollection/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-RHlQL7MTpd9OWJQllnaCZCXYEiM\"",
    "mtime": "2026-02-12T20:16:12.012Z",
    "size": 69,
    "path": "../public/reports/crystal-clear-dream-recollection/_payload.json"
  },
  "/reports/difluoromethyl-aleph-flume-dot/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-RPCd+l54F+8/8PwFl69RfoiPTfU\"",
    "mtime": "2026-02-12T20:16:12.013Z",
    "size": 69,
    "path": "../public/reports/difluoromethyl-aleph-flume-dot/_payload.json"
  },
  "/reports/crystal-clear-dream-recollection/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"8665-G9E5yhJ5Xj9D1LS/LLbFndjZVjs\"",
    "mtime": "2026-02-12T20:16:09.516Z",
    "size": 34405,
    "path": "../public/reports/crystal-clear-dream-recollection/index.html"
  },
  "/reports/delirious-laughter/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"863b-U11Xntpt+6kFScVNynplaZvxS/Q\"",
    "mtime": "2026-02-12T20:16:09.516Z",
    "size": 34363,
    "path": "../public/reports/delirious-laughter/index.html"
  },
  "/reports/difluoromethyl-aleph-flume-dot/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"865f-jRW2NNqIW+gxVfMYbg/ciVFfu5A\"",
    "mtime": "2026-02-12T20:16:09.527Z",
    "size": 34399,
    "path": "../public/reports/difluoromethyl-aleph-flume-dot/index.html"
  },
  "/reports/dragged-out-to-sea/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-rF+jxHzlu6/1DI2WvVuB/Cny9x4\"",
    "mtime": "2026-02-12T20:16:12.014Z",
    "size": 69,
    "path": "../public/reports/dragged-out-to-sea/_payload.json"
  },
  "/reports/drenched-in-purgatory/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-enAM+Y5QDM0OgVhuJR1VIKjEJvk\"",
    "mtime": "2026-02-12T20:16:12.014Z",
    "size": 69,
    "path": "../public/reports/drenched-in-purgatory/_payload.json"
  },
  "/reports/dragged-out-to-sea/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"863b-DSv4QEcsUx9KCfGnPf/CvkBoa0k\"",
    "mtime": "2026-02-12T20:16:09.566Z",
    "size": 34363,
    "path": "../public/reports/dragged-out-to-sea/index.html"
  },
  "/reports/drenched-in-purgatory/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"8644-3pxaiKccUoqKGysY2KMjBZSFtFk\"",
    "mtime": "2026-02-12T20:16:09.609Z",
    "size": 34372,
    "path": "../public/reports/drenched-in-purgatory/index.html"
  },
  "/reports/drowning-in-its-throat/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-9t62wWRBVQ00I0/WaUUkqGNa25U\"",
    "mtime": "2026-02-12T20:16:12.014Z",
    "size": 69,
    "path": "../public/reports/drowning-in-its-throat/_payload.json"
  },
  "/reports/drowning-in-its-throat/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"8647-nwLI2WeGekO0ecWW/ZdgX2QJqPk\"",
    "mtime": "2026-02-12T20:16:09.616Z",
    "size": 34375,
    "path": "../public/reports/drowning-in-its-throat/index.html"
  },
  "/reports/dying-from-a-cosmic-slap/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-fkjksNjhoRTiMGhmHZSwACPHyEM\"",
    "mtime": "2026-02-12T20:16:12.014Z",
    "size": 69,
    "path": "../public/reports/dying-from-a-cosmic-slap/_payload.json"
  },
  "/reports/dying-from-a-cosmic-slap/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"864d-N1juqzhLJE8TZq4CdM6h9A2ANr0\"",
    "mtime": "2026-02-12T20:16:09.622Z",
    "size": 34381,
    "path": "../public/reports/dying-from-a-cosmic-slap/index.html"
  },
  "/reports/ego-death-and-a-total-break-through-in-the-snow/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-GtM59MwlM+EnKCJjx3jGZUaYku8\"",
    "mtime": "2026-02-12T20:16:12.014Z",
    "size": 69,
    "path": "../public/reports/ego-death-and-a-total-break-through-in-the-snow/_payload.json"
  },
  "/reports/ego-death-and-a-total-break-through-in-the-snow/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"8692-Rcfgq1hY8n1jTxK0FqHvC00Kb5o\"",
    "mtime": "2026-02-12T20:16:09.622Z",
    "size": 34450,
    "path": "../public/reports/ego-death-and-a-total-break-through-in-the-snow/index.html"
  },
  "/reports/ego-death-and-unity-with-a-friend/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-/8miQQraj9UvaphvxjBIK4P1NfI\"",
    "mtime": "2026-02-12T20:16:12.015Z",
    "size": 69,
    "path": "../public/reports/ego-death-and-unity-with-a-friend/_payload.json"
  },
  "/reports/ego-death-and-unity-with-a-friend/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"8668-WmKi0MHlr8y5bGaCTLjSXek5z9o\"",
    "mtime": "2026-02-12T20:16:09.625Z",
    "size": 34408,
    "path": "../public/reports/ego-death-and-unity-with-a-friend/index.html"
  },
  "/reports/encased-in-stone/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-QRiagAJYWWDtoZnmZRShOslppWI\"",
    "mtime": "2026-02-12T20:16:12.015Z",
    "size": 69,
    "path": "../public/reports/encased-in-stone/_payload.json"
  },
  "/reports/encased-in-stone/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"8635-n/s0MRRTHUE1VK1DtzXcLO33zUk\"",
    "mtime": "2026-02-12T20:16:09.625Z",
    "size": 34357,
    "path": "../public/reports/encased-in-stone/index.html"
  },
  "/reports/enhanced-film-experience/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-iFeunOTtyV43a34Xfm4OLBIjO+U\"",
    "mtime": "2026-02-12T20:16:12.016Z",
    "size": 69,
    "path": "../public/reports/enhanced-film-experience/_payload.json"
  },
  "/reports/enhanced-film-experience/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"864d-vLTB88l0+VNfA1KSmk0RJCLhsP8\"",
    "mtime": "2026-02-12T20:16:09.626Z",
    "size": 34381,
    "path": "../public/reports/enhanced-film-experience/index.html"
  },
  "/reports/entombed-in-syrup/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-o41AUhdTX6lNNwTCK+mpWljaR7g\"",
    "mtime": "2026-02-12T20:16:12.015Z",
    "size": 69,
    "path": "../public/reports/entombed-in-syrup/_payload.json"
  },
  "/reports/entombed-in-syrup/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"8638-Y3XxtUWIuu49YITmx+qt6LbBtPI\"",
    "mtime": "2026-02-12T20:16:09.625Z",
    "size": 34360,
    "path": "../public/reports/entombed-in-syrup/index.html"
  },
  "/reports/everything-happening-around-me/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"865f-lkKkRkkw11flz5yoSJPOrGaTpM8\"",
    "mtime": "2026-02-12T20:16:09.626Z",
    "size": 34399,
    "path": "../public/reports/everything-happening-around-me/index.html"
  },
  "/reports/exactly-as-advertised/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"8644-giYd4AsLu8QYk5d94iCv73D6qnM\"",
    "mtime": "2026-02-12T20:16:09.626Z",
    "size": 34372,
    "path": "../public/reports/exactly-as-advertised/index.html"
  },
  "/reports/everything-happening-around-me/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-swIo28FjyZ+PxiGMASSyjQxQ7zw\"",
    "mtime": "2026-02-12T20:16:12.015Z",
    "size": 69,
    "path": "../public/reports/everything-happening-around-me/_payload.json"
  },
  "/reports/exactly-as-advertised/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-3AwZS8CW5j9XY2BU1LFcLWqv2DY\"",
    "mtime": "2026-02-12T20:16:12.015Z",
    "size": 69,
    "path": "../public/reports/exactly-as-advertised/_payload.json"
  },
  "/reports/experiencing-death/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-OMtR+kuIerZesCywJT2XdIIiacs\"",
    "mtime": "2026-02-12T20:16:12.016Z",
    "size": 69,
    "path": "../public/reports/experiencing-death/_payload.json"
  },
  "/reports/experiencing-death/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"863b-fhJXyOsdBoKeCkEo8BF9DLjBdmg\"",
    "mtime": "2026-02-12T20:16:09.626Z",
    "size": 34363,
    "path": "../public/reports/experiencing-death/index.html"
  },
  "/reports/experimenting-with-e-cinnamal-in-combination-with-thc/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-eC0tWrqe2ktcERUwTzXdCPmEXvE\"",
    "mtime": "2026-02-12T20:16:12.016Z",
    "size": 69,
    "path": "../public/reports/experimenting-with-e-cinnamal-in-combination-with-thc/_payload.json"
  },
  "/reports/experimenting-with-e-cinnamal-in-combination-with-thc/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"86a4-GRBUIoMS3n49Uh+LIA4OB7/FMac\"",
    "mtime": "2026-02-12T20:16:09.629Z",
    "size": 34468,
    "path": "../public/reports/experimenting-with-e-cinnamal-in-combination-with-thc/index.html"
  },
  "/reports/extreme-psychosis/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-Qi+QNIKFE5i/mJqUhdnOM/Tl+o0\"",
    "mtime": "2026-02-12T20:16:12.016Z",
    "size": 69,
    "path": "../public/reports/extreme-psychosis/_payload.json"
  },
  "/reports/extremely-wreckless-drug-abuse-with-my-girlfriend/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-BW0fAWmvXxajtkL1AW5+8kGlm5g\"",
    "mtime": "2026-02-12T20:16:12.016Z",
    "size": 69,
    "path": "../public/reports/extremely-wreckless-drug-abuse-with-my-girlfriend/_payload.json"
  },
  "/reports/extreme-discomfort/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-qjnpJaAPOEqgsOEBzXo4j634UcU\"",
    "mtime": "2026-02-12T20:16:12.016Z",
    "size": 69,
    "path": "../public/reports/extreme-discomfort/_payload.json"
  },
  "/reports/extreme-discomfort/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"863b-PX0YzQPVgPwmTiJRweGFLx7EQSs\"",
    "mtime": "2026-02-12T20:16:09.633Z",
    "size": 34363,
    "path": "../public/reports/extreme-discomfort/index.html"
  },
  "/reports/extreme-psychosis/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"8638-/TF5HVCHNPe68wHlT/Xu3eCqmbg\"",
    "mtime": "2026-02-12T20:16:09.633Z",
    "size": 34360,
    "path": "../public/reports/extreme-psychosis/index.html"
  },
  "/reports/first-experiment-with-4-aco-det/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-1aDVYp/1W1veuXVKMpy6Iaxz86M\"",
    "mtime": "2026-02-12T20:16:12.016Z",
    "size": 69,
    "path": "../public/reports/first-experiment-with-4-aco-det/_payload.json"
  },
  "/reports/first-impressions-of-4-aco-det/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-Au9zUvFpyNmHvfcfmij9uJ/aVB8\"",
    "mtime": "2026-02-12T20:16:12.017Z",
    "size": 69,
    "path": "../public/reports/first-impressions-of-4-aco-det/_payload.json"
  },
  "/reports/extremely-wreckless-drug-abuse-with-my-girlfriend/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"8698-nrWdxzidI91Bq6aF3QeC+ibOGM4\"",
    "mtime": "2026-02-12T20:16:09.636Z",
    "size": 34456,
    "path": "../public/reports/extremely-wreckless-drug-abuse-with-my-girlfriend/index.html"
  },
  "/reports/first-impressions-of-4-aco-det/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"865f-J82mP3ppC71xa9VuvWNJEt2rjEU\"",
    "mtime": "2026-02-12T20:16:09.665Z",
    "size": 34399,
    "path": "../public/reports/first-impressions-of-4-aco-det/index.html"
  },
  "/reports/first-experiment-with-4-aco-det/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"8662-Vkn1ECgcCnKg3KrDlt47G7WsJcY\"",
    "mtime": "2026-02-12T20:16:09.665Z",
    "size": 34402,
    "path": "../public/reports/first-experiment-with-4-aco-det/index.html"
  },
  "/reports/first-trip-in-over-6-months/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-MvOw6Hma6yRwidcRQ6he9J1Ks+0\"",
    "mtime": "2026-02-12T20:16:12.017Z",
    "size": 69,
    "path": "../public/reports/first-trip-in-over-6-months/_payload.json"
  },
  "/reports/first-trip-in-over-6-months/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"8656-//l123bzzCUGB/HKCBPu5pKP4V4\"",
    "mtime": "2026-02-12T20:16:09.665Z",
    "size": 34390,
    "path": "../public/reports/first-trip-in-over-6-months/index.html"
  },
  "/reports/fog-of-the-smoldering-caustic-ash-possible-urotoxicity/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-KjmPC8z9X3IxYvq4kLSOX6L+lK4\"",
    "mtime": "2026-02-12T20:16:12.019Z",
    "size": 69,
    "path": "../public/reports/fog-of-the-smoldering-caustic-ash-possible-urotoxicity/_payload.json"
  },
  "/reports/fog-of-the-smoldering-caustic-ash-possible-urotoxicity/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"86a7-rL8wAOzZS81R7cPzvvEa2YQhnv0\"",
    "mtime": "2026-02-12T20:16:09.693Z",
    "size": 34471,
    "path": "../public/reports/fog-of-the-smoldering-caustic-ash-possible-urotoxicity/index.html"
  },
  "/reports/four-raccoons-and-a-squirrel/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-pEVZ7HfWbjJSyU0T9B19eewm234\"",
    "mtime": "2026-02-12T20:16:12.017Z",
    "size": 69,
    "path": "../public/reports/four-raccoons-and-a-squirrel/_payload.json"
  },
  "/reports/four-raccoons-and-a-squirrel/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"8659-V6gXPAQaWami1u5emlR2Hhw80nI\"",
    "mtime": "2026-02-12T20:16:09.665Z",
    "size": 34393,
    "path": "../public/reports/four-raccoons-and-a-squirrel/index.html"
  },
  "/reports/gaboxadol/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-0uiaOq2+MqK+MErXSVpfJHcZE7I\"",
    "mtime": "2026-02-12T20:16:12.019Z",
    "size": 69,
    "path": "../public/reports/gaboxadol/_payload.json"
  },
  "/reports/gentle-and-kind/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-FoU4XLiPFj4I6W4qLiwzk+2Ys3c\"",
    "mtime": "2026-02-12T20:16:12.017Z",
    "size": 69,
    "path": "../public/reports/gentle-and-kind/_payload.json"
  },
  "/reports/gaboxadol/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"8620-CmwOZZoOx3HzzRoF0bDASjc8baM\"",
    "mtime": "2026-02-12T20:16:09.680Z",
    "size": 34336,
    "path": "../public/reports/gaboxadol/index.html"
  },
  "/reports/getting-to-know-benzydamine/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-f9eaked67YZEYXvYd8WLsGEDKQ0\"",
    "mtime": "2026-02-12T20:16:12.019Z",
    "size": 69,
    "path": "../public/reports/getting-to-know-benzydamine/_payload.json"
  },
  "/reports/getting-to-know-benzydamine/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"8656-0FxqxA7Kvdj5lxXt+bzQ7PQlgQg\"",
    "mtime": "2026-02-12T20:16:09.703Z",
    "size": 34390,
    "path": "../public/reports/getting-to-know-benzydamine/index.html"
  },
  "/reports/gentle-and-kind/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"8632-W/MCM+z0bkp31IXEwctatQUi9qY\"",
    "mtime": "2026-02-12T20:16:09.680Z",
    "size": 34354,
    "path": "../public/reports/gentle-and-kind/index.html"
  },
  "/reports/greater-mind-lesser-body/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-hxiMuSCQN1fk/T/EJYNIby0W4fQ\"",
    "mtime": "2026-02-12T20:16:12.019Z",
    "size": 69,
    "path": "../public/reports/greater-mind-lesser-body/_payload.json"
  },
  "/reports/grey-glass/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-FoCmgFV7MmkHZHtoWCx4XO+/lgM\"",
    "mtime": "2026-02-12T20:16:12.019Z",
    "size": 69,
    "path": "../public/reports/grey-glass/_payload.json"
  },
  "/reports/grey-glass/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"8623-DkNLHK1QfK2f2YxQlWw6nJHu34g\"",
    "mtime": "2026-02-12T20:16:09.703Z",
    "size": 34339,
    "path": "../public/reports/grey-glass/index.html"
  },
  "/reports/hallucinate-everything-mode/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-iG2vi5Py5uFu6yPuMcxkXK5rlDM\"",
    "mtime": "2026-02-12T20:16:12.019Z",
    "size": 69,
    "path": "../public/reports/hallucinate-everything-mode/_payload.json"
  },
  "/reports/heat-waves/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-DjBhE0r/iTsgqO7dlT3D3AGyGe4\"",
    "mtime": "2026-02-12T20:16:12.020Z",
    "size": 69,
    "path": "../public/reports/heat-waves/_payload.json"
  },
  "/reports/heavy-dose-of-2c-e/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-cNus1Bm4yDng3iLU++GE92Mc62E\"",
    "mtime": "2026-02-12T20:16:12.020Z",
    "size": 69,
    "path": "../public/reports/heavy-dose-of-2c-e/_payload.json"
  },
  "/reports/hallucinate-everything-mode/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"8656-aCk2w26n0CG0LIrw7OZsSBiDAQc\"",
    "mtime": "2026-02-12T20:16:09.703Z",
    "size": 34390,
    "path": "../public/reports/hallucinate-everything-mode/index.html"
  },
  "/reports/heat-waves/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"8623-6Dr5nIkaMmiS6pr8Wq1wSBS4wP4\"",
    "mtime": "2026-02-12T20:16:09.704Z",
    "size": 34339,
    "path": "../public/reports/heat-waves/index.html"
  },
  "/reports/horrible-nausea/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-AamwejoHUWeVMe4rBF4YN/NsKBg\"",
    "mtime": "2026-02-12T20:16:12.019Z",
    "size": 69,
    "path": "../public/reports/horrible-nausea/_payload.json"
  },
  "/reports/heavy-dose-of-cough-syrup/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-t2nhXLcV2m2NMoH4QaG85tvH2Vg\"",
    "mtime": "2026-02-12T20:16:12.020Z",
    "size": 69,
    "path": "../public/reports/heavy-dose-of-cough-syrup/_payload.json"
  },
  "/reports/greater-mind-lesser-body/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"864d-QRY5cOqYtw3HdXxpsHjyHaxeUJ4\"",
    "mtime": "2026-02-12T20:16:09.703Z",
    "size": 34381,
    "path": "../public/reports/greater-mind-lesser-body/index.html"
  },
  "/reports/horrible-nausea/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"8632-vnZkfE5FA+EnsVo3KFYiVEEX6j4\"",
    "mtime": "2026-02-12T20:16:09.703Z",
    "size": 34354,
    "path": "../public/reports/horrible-nausea/index.html"
  },
  "/reports/heavy-dose-of-cough-syrup/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"8650-YgbPOsATbQ8Lff2v02S6dGt6GpQ\"",
    "mtime": "2026-02-12T20:16:09.703Z",
    "size": 34384,
    "path": "../public/reports/heavy-dose-of-cough-syrup/index.html"
  },
  "/reports/horrid-body-load-glowing-thoughts/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-qHKCkq4JV4RnQ19VCigXcLGDUA4\"",
    "mtime": "2026-02-12T20:16:12.020Z",
    "size": 69,
    "path": "../public/reports/horrid-body-load-glowing-thoughts/_payload.json"
  },
  "/reports/heavy-dose-of-2c-e/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"863b-G27KE6o+meifBxt79ZOh/D52wUk\"",
    "mtime": "2026-02-12T20:16:09.703Z",
    "size": 34363,
    "path": "../public/reports/heavy-dose-of-2c-e/index.html"
  },
  "/reports/horrid-body-load-glowing-thoughts/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"8668-b3HlKJg2mn1LzNnohKskbrT7mSg\"",
    "mtime": "2026-02-12T20:16:09.737Z",
    "size": 34408,
    "path": "../public/reports/horrid-body-load-glowing-thoughts/index.html"
  },
  "/reports/i-am-a-big-gushing-fool/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-tXeht6BIHJltTYMc2kajcmugBGc\"",
    "mtime": "2026-02-12T20:16:12.021Z",
    "size": 69,
    "path": "../public/reports/i-am-a-big-gushing-fool/_payload.json"
  },
  "/reports/i-am-a-big-gushing-fool/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"864a-LLjdC24ae2rMxYTXEBpzN+v4w0Y\"",
    "mtime": "2026-02-12T20:16:09.819Z",
    "size": 34378,
    "path": "../public/reports/i-am-a-big-gushing-fool/index.html"
  },
  "/reports/i-am-a-mannequin/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-pODLv+hTbaR8FzBS+4SlrD1pCb0\"",
    "mtime": "2026-02-12T20:16:12.021Z",
    "size": 69,
    "path": "../public/reports/i-am-a-mannequin/_payload.json"
  },
  "/reports/i-am-doing-nothing/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-d2HyJ9CK5INIODQ9jn7BX1heiq4\"",
    "mtime": "2026-02-12T20:16:12.020Z",
    "size": 69,
    "path": "../public/reports/i-am-doing-nothing/_payload.json"
  },
  "/reports/i-am-a-mannequin/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"8635-adWTDK0+y9hi/NTVppyY+iFLa3o\"",
    "mtime": "2026-02-12T20:16:09.826Z",
    "size": 34357,
    "path": "../public/reports/i-am-a-mannequin/index.html"
  },
  "/reports/i-am-doing-nothing/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"863b-zQPAUVV9Y2j7GsVRCD7bpA7PR1I\"",
    "mtime": "2026-02-12T20:16:09.836Z",
    "size": 34363,
    "path": "../public/reports/i-am-doing-nothing/index.html"
  },
  "/reports/i-begged-the-shroom-aliens-to-kill-me/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-eDocLxx75OY/cPoQ4acr4yAoRqk\"",
    "mtime": "2026-02-12T20:16:12.022Z",
    "size": 69,
    "path": "../public/reports/i-begged-the-shroom-aliens-to-kill-me/_payload.json"
  },
  "/reports/i-begged-the-shroom-aliens-to-kill-me/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"8674-L8fIRQF1kDOUx5PwZ8vlUyxNGxE\"",
    "mtime": "2026-02-12T20:16:09.845Z",
    "size": 34420,
    "path": "../public/reports/i-begged-the-shroom-aliens-to-kill-me/index.html"
  },
  "/reports/i-designed-it-this-way-myself/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"865c-vHFbUXD4mGJzYCDELwFMYOX0iV0\"",
    "mtime": "2026-02-12T20:16:09.837Z",
    "size": 34396,
    "path": "../public/reports/i-designed-it-this-way-myself/index.html"
  },
  "/reports/i-designed-it-this-way-myself/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-YiiyqZBYM8u8ZqpzJkCmGu31H+U\"",
    "mtime": "2026-02-12T20:16:12.022Z",
    "size": 69,
    "path": "../public/reports/i-designed-it-this-way-myself/_payload.json"
  },
  "/reports/i-found-god-inside-myself/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-TxtY4VHW+1w7CvU5d+dVt1fkaFk\"",
    "mtime": "2026-02-12T20:16:12.021Z",
    "size": 69,
    "path": "../public/reports/i-found-god-inside-myself/_payload.json"
  },
  "/reports/i-saw-an-angry-god-like-figure-made-of-clouds-glaring-down-at-me/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-YnUhknKCmZ9/TXluvZaw7Uy31Pg\"",
    "mtime": "2026-02-12T20:16:12.022Z",
    "size": 69,
    "path": "../public/reports/i-saw-an-angry-god-like-figure-made-of-clouds-glaring-down-at-me/_payload.json"
  },
  "/reports/i-slept-for-27-hours/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-iroj7wJKq/OH7XtyxL4/kklGTNQ\"",
    "mtime": "2026-02-12T20:16:12.020Z",
    "size": 69,
    "path": "../public/reports/i-slept-for-27-hours/_payload.json"
  },
  "/reports/i-saw-an-angry-god-like-figure-made-of-clouds-glaring-down-at-me/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"86c5-49cYrBdBpaaitOTJ9BLz4/YwlMY\"",
    "mtime": "2026-02-12T20:16:09.836Z",
    "size": 34501,
    "path": "../public/reports/i-saw-an-angry-god-like-figure-made-of-clouds-glaring-down-at-me/index.html"
  },
  "/reports/i-found-god-inside-myself/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"8650-r2mXt0WejOgAkEM4IOvq9cVztvk\"",
    "mtime": "2026-02-12T20:16:09.836Z",
    "size": 34384,
    "path": "../public/reports/i-found-god-inside-myself/index.html"
  },
  "/reports/i-was-overcome-with-feelings-about-my-family/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-sqBk988HB477xylzCKlV5RIQFew\"",
    "mtime": "2026-02-12T20:16:12.022Z",
    "size": 69,
    "path": "../public/reports/i-was-overcome-with-feelings-about-my-family/_payload.json"
  },
  "/reports/i-slept-for-27-hours/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"8641-+1G4j1kOO01skFCWvYBhjOGUaKs\"",
    "mtime": "2026-02-12T20:16:09.836Z",
    "size": 34369,
    "path": "../public/reports/i-slept-for-27-hours/index.html"
  },
  "/reports/immaculate-energy/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-5iqLgE1KMJMYH/9jR2NkXb1DWUc\"",
    "mtime": "2026-02-12T20:16:12.022Z",
    "size": 69,
    "path": "../public/reports/immaculate-energy/_payload.json"
  },
  "/reports/i-was-overcome-with-feelings-about-my-family/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"8689-FvVnmW31EgmS/+JSiZbwqWg2U2I\"",
    "mtime": "2026-02-12T20:16:09.850Z",
    "size": 34441,
    "path": "../public/reports/i-was-overcome-with-feelings-about-my-family/index.html"
  },
  "/reports/i-was-the-universe-s-prophet/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-ieWh5ll8b6Hjj+UVTaUpRLVAZNY\"",
    "mtime": "2026-02-12T20:16:12.022Z",
    "size": 69,
    "path": "../public/reports/i-was-the-universe-s-prophet/_payload.json"
  },
  "/reports/immensely-relaxed-and-gentle-meditation/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-9GN+TcRQ/wiAA3mm+A1llMyaqwg\"",
    "mtime": "2026-02-12T20:16:12.022Z",
    "size": 69,
    "path": "../public/reports/immensely-relaxed-and-gentle-meditation/_payload.json"
  },
  "/reports/i-was-the-universe-s-prophet/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"8659-HxbM4rIW7Hlet4WBnib1NnQfhs0\"",
    "mtime": "2026-02-12T20:16:09.850Z",
    "size": 34393,
    "path": "../public/reports/i-was-the-universe-s-prophet/index.html"
  },
  "/reports/immaculate-energy/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"8638-2UHHxtE1lL2Us96zGPhYFMZ2JK8\"",
    "mtime": "2026-02-12T20:16:09.850Z",
    "size": 34360,
    "path": "../public/reports/immaculate-energy/index.html"
  },
  "/reports/iridescent-pool-party/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-kGCdFEIFDlLNIuOodSMFkTSVD58\"",
    "mtime": "2026-02-12T20:16:12.022Z",
    "size": 69,
    "path": "../public/reports/iridescent-pool-party/_payload.json"
  },
  "/reports/immensely-relaxed-and-gentle-meditation/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"867a-lsvlIh+OP0Bm4f6g/tf9XmgR2+4\"",
    "mtime": "2026-02-12T20:16:09.850Z",
    "size": 34426,
    "path": "../public/reports/immensely-relaxed-and-gentle-meditation/index.html"
  },
  "/reports/iridescent-ripples/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-y2YnCTPQMPh423cQ4+odgXvp4Zw\"",
    "mtime": "2026-02-12T20:16:12.023Z",
    "size": 69,
    "path": "../public/reports/iridescent-ripples/_payload.json"
  },
  "/reports/it-felt-like-i-was-on-rails-the-whole-time/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"8683-Y20HM+BECG9hdKiNghEnRk0/gEA\"",
    "mtime": "2026-02-12T20:16:09.852Z",
    "size": 34435,
    "path": "../public/reports/it-felt-like-i-was-on-rails-the-whole-time/index.html"
  },
  "/reports/iridescent-pool-party/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"8644-/QqkzDiISCKXBVXEqctFhLkZKgU\"",
    "mtime": "2026-02-12T20:16:09.852Z",
    "size": 34372,
    "path": "../public/reports/iridescent-pool-party/index.html"
  },
  "/reports/iridescent-ripples/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"863b-kDOGuRo+FizWpGRNuAegHPsO6V8\"",
    "mtime": "2026-02-12T20:16:09.852Z",
    "size": 34363,
    "path": "../public/reports/iridescent-ripples/index.html"
  },
  "/reports/it-felt-like-i-was-on-rails-the-whole-time/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-2hFm+2iQe5udciRSAJc4lHwh5pM\"",
    "mtime": "2026-02-12T20:16:12.023Z",
    "size": 69,
    "path": "../public/reports/it-felt-like-i-was-on-rails-the-whole-time/_payload.json"
  },
  "/reports/k-holing-with-oppa-and-the-fire-nation/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-1Kg6W7OrGUwl3HOI9FkCKAFPVL8\"",
    "mtime": "2026-02-12T20:16:12.024Z",
    "size": 69,
    "path": "../public/reports/k-holing-with-oppa-and-the-fire-nation/_payload.json"
  },
  "/reports/k-holing-with-oppa-and-the-fire-nation/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"8677-iT50iWZ/F2PxjsXCA9ZzLENm0e0\"",
    "mtime": "2026-02-12T20:16:09.908Z",
    "size": 34423,
    "path": "../public/reports/k-holing-with-oppa-and-the-fire-nation/index.html"
  },
  "/reports/ketamine-case-report-1/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"8647-nBfyFB7oLKAaby2zmpelWPTCgcw\"",
    "mtime": "2026-02-12T20:16:09.908Z",
    "size": 34375,
    "path": "../public/reports/ketamine-case-report-1/index.html"
  },
  "/reports/little-psychedelic-blanket/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-AzcEoPI6de3oPExjfpR9Fr7rKwI\"",
    "mtime": "2026-02-12T20:16:12.024Z",
    "size": 69,
    "path": "../public/reports/little-psychedelic-blanket/_payload.json"
  },
  "/reports/ketamine-case-report-1/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-vutqeJYqNWAmd0bs+B/YDMnTLx4\"",
    "mtime": "2026-02-12T20:16:12.023Z",
    "size": 69,
    "path": "../public/reports/ketamine-case-report-1/_payload.json"
  },
  "/reports/lucid-and-comfortable-sedation/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-8n6PBGR0IHv+nNXPwbOINeuvNxc\"",
    "mtime": "2026-02-12T20:16:12.024Z",
    "size": 69,
    "path": "../public/reports/lucid-and-comfortable-sedation/_payload.json"
  },
  "/reports/lucid-and-comfortable-sedation/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"865f-/6pXS59w4sXia+KcsyWC4aAc6+Q\"",
    "mtime": "2026-02-12T20:16:09.909Z",
    "size": 34399,
    "path": "../public/reports/lucid-and-comfortable-sedation/index.html"
  },
  "/reports/mad-max-fury-road/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-/0yUMxuy+SS2H5Jb/6wGI22732A\"",
    "mtime": "2026-02-12T20:16:12.024Z",
    "size": 69,
    "path": "../public/reports/mad-max-fury-road/_payload.json"
  },
  "/reports/manic-cleaning-frenzy/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-1Gq89ZGhKAJBCUSbo6uEv2yiQ1A\"",
    "mtime": "2026-02-12T20:16:12.035Z",
    "size": 69,
    "path": "../public/reports/manic-cleaning-frenzy/_payload.json"
  },
  "/reports/mad-max-fury-road/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"8638-cW5Vf2IkXLU5quQKuNmmRuZvie4\"",
    "mtime": "2026-02-12T20:16:09.908Z",
    "size": 34360,
    "path": "../public/reports/mad-max-fury-road/index.html"
  },
  "/reports/mdma/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-Cpz6f2NMUd7+9OfK4xhWo1yQf9w\"",
    "mtime": "2026-02-12T20:16:12.024Z",
    "size": 69,
    "path": "../public/reports/mdma/_payload.json"
  },
  "/reports/little-psychedelic-blanket/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"8653-biWkUQ/TybPOmDAWGgN7Bj2yiJ4\"",
    "mtime": "2026-02-12T20:16:09.908Z",
    "size": 34387,
    "path": "../public/reports/little-psychedelic-blanket/index.html"
  },
  "/reports/mdma/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"8611-UFwAQn+6U2OdWH+1EA8iIfLCQbU\"",
    "mtime": "2026-02-12T20:16:09.952Z",
    "size": 34321,
    "path": "../public/reports/mdma/index.html"
  },
  "/reports/manic-cleaning-frenzy/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"8644-dWTK/7nyq+iv7U4pwmJUbAdlkc8\"",
    "mtime": "2026-02-12T20:16:09.953Z",
    "size": 34372,
    "path": "../public/reports/manic-cleaning-frenzy/index.html"
  },
  "/reports/microcosms/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"8623-ZF+PNHcphJW4vTrNoNBky4heeOU\"",
    "mtime": "2026-02-12T20:16:09.952Z",
    "size": 34339,
    "path": "../public/reports/microcosms/index.html"
  },
  "/reports/microcosms/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-jozBrYLuc9QEDBnuwECwre62fNc\"",
    "mtime": "2026-02-12T20:16:12.035Z",
    "size": 69,
    "path": "../public/reports/microcosms/_payload.json"
  },
  "/reports/mirogabalin/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-U1zPAHP5s1g4XkerXU3+mJKarhg\"",
    "mtime": "2026-02-12T20:16:12.035Z",
    "size": 69,
    "path": "../public/reports/mirogabalin/_payload.json"
  },
  "/reports/my-first-experience-with-unity/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-ZRj8iEuLnBCJ8NzmxFKG81z7Bpo\"",
    "mtime": "2026-02-12T20:16:12.035Z",
    "size": 69,
    "path": "../public/reports/my-first-experience-with-unity/_payload.json"
  },
  "/reports/my-first-experience-with-unity/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"865f-j4ogF6f8a2Dyje6/rNrVe6WSDuU\"",
    "mtime": "2026-02-12T20:16:09.952Z",
    "size": 34399,
    "path": "../public/reports/my-first-experience-with-unity/index.html"
  },
  "/reports/mirogabalin/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"8626-fHPWrT5COfFWYpYpwcEoTmCbvs0\"",
    "mtime": "2026-02-12T20:16:09.953Z",
    "size": 34342,
    "path": "../public/reports/mirogabalin/index.html"
  },
  "/reports/my-first-proper-psychedelic-experience/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-MsldzWX/S+8EESu1QfkSJ6HKWmY\"",
    "mtime": "2026-02-12T20:16:12.035Z",
    "size": 69,
    "path": "../public/reports/my-first-proper-psychedelic-experience/_payload.json"
  },
  "/reports/my-fourth-experience-with-unity/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-aTc6GcfB63tF0c6hZ79HePPyg00\"",
    "mtime": "2026-02-12T20:16:12.035Z",
    "size": 69,
    "path": "../public/reports/my-fourth-experience-with-unity/_payload.json"
  },
  "/reports/my-one-bad-trip/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-9Ov6/FCYuayDepZcQ6nb9wx4AHs\"",
    "mtime": "2026-02-12T20:16:12.051Z",
    "size": 69,
    "path": "../public/reports/my-one-bad-trip/_payload.json"
  },
  "/reports/my-second-experience-with-4-aco-det/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-yEpROju1EGuQWO/sh03wASQ2+7M\"",
    "mtime": "2026-02-12T20:16:12.051Z",
    "size": 69,
    "path": "../public/reports/my-second-experience-with-4-aco-det/_payload.json"
  },
  "/reports/my-fourth-experience-with-unity/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"8662-lneRz5o2/fNjzv3BHfeAYBU4k/A\"",
    "mtime": "2026-02-12T20:16:09.953Z",
    "size": 34402,
    "path": "../public/reports/my-fourth-experience-with-unity/index.html"
  },
  "/reports/my-first-proper-psychedelic-experience/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"8677-kX8HCkuGyFb/ZLaT9yQES3R15CM\"",
    "mtime": "2026-02-12T20:16:09.953Z",
    "size": 34423,
    "path": "../public/reports/my-first-proper-psychedelic-experience/index.html"
  },
  "/reports/my-one-bad-trip/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"8632-GZL1y9lWpQ6gtSnRbULxup1qSGw\"",
    "mtime": "2026-02-12T20:16:09.961Z",
    "size": 34354,
    "path": "../public/reports/my-one-bad-trip/index.html"
  },
  "/reports/my-second-experience-with-4-aco-det/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"866e-jA9oZ87mt/8l1Q7/3zkIgEs8jUQ\"",
    "mtime": "2026-02-12T20:16:09.953Z",
    "size": 34414,
    "path": "../public/reports/my-second-experience-with-4-aco-det/index.html"
  },
  "/reports/my-second-experience-with-unity/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-VxDfbhJd5srcuWLi7zKoUu+XAFk\"",
    "mtime": "2026-02-12T20:16:12.035Z",
    "size": 69,
    "path": "../public/reports/my-second-experience-with-unity/_payload.json"
  },
  "/reports/my-second-experience-with-unity/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"8662-eQvuDwN+R3LRoFHMIaY9xUDL8z8\"",
    "mtime": "2026-02-12T20:16:09.953Z",
    "size": 34402,
    "path": "../public/reports/my-second-experience-with-unity/index.html"
  },
  "/reports/my-skin-didn-t-look-like-this-before/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-h+zQrmkWCyRjiVOLodRmjpO1lHQ\"",
    "mtime": "2026-02-12T20:16:12.051Z",
    "size": 69,
    "path": "../public/reports/my-skin-didn-t-look-like-this-before/_payload.json"
  },
  "/reports/my-triumphent-return/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-r+EX+65fXpc50ptfQPOvgZivymE\"",
    "mtime": "2026-02-12T20:16:12.051Z",
    "size": 69,
    "path": "../public/reports/my-triumphent-return/_payload.json"
  },
  "/reports/nexuswalk-a-beautiful-mix-of-dxm-and-2c-b/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-Tb9MLUeuL2hgiyycdXpznY7QbvQ\"",
    "mtime": "2026-02-12T20:16:12.052Z",
    "size": 69,
    "path": "../public/reports/nexuswalk-a-beautiful-mix-of-dxm-and-2c-b/_payload.json"
  },
  "/reports/my-skin-didn-t-look-like-this-before/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"8671-C8isNooo6zb6sBlJk4MxWf4WaRM\"",
    "mtime": "2026-02-12T20:16:10.171Z",
    "size": 34417,
    "path": "../public/reports/my-skin-didn-t-look-like-this-before/index.html"
  },
  "/reports/nightmares-in-eiriel/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-lNAkpd7scH+RppJbbTLfBRuzwOY\"",
    "mtime": "2026-02-12T20:16:12.052Z",
    "size": 69,
    "path": "../public/reports/nightmares-in-eiriel/_payload.json"
  },
  "/reports/nexuswalk-a-beautiful-mix-of-dxm-and-2c-b/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"8680-0+uqOzQgsLlxOaqHpUEZjEz/XKk\"",
    "mtime": "2026-02-12T20:16:10.396Z",
    "size": 34432,
    "path": "../public/reports/nexuswalk-a-beautiful-mix-of-dxm-and-2c-b/index.html"
  },
  "/reports/my-triumphent-return/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"8641-UVrAZbPIwj5eNyxrN9w1G5aTXDI\"",
    "mtime": "2026-02-12T20:16:10.351Z",
    "size": 34369,
    "path": "../public/reports/my-triumphent-return/index.html"
  },
  "/reports/nitrous-entities/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-RpkBjppXJEUJxKDG9L2dQZrxHaY\"",
    "mtime": "2026-02-12T20:16:12.052Z",
    "size": 69,
    "path": "../public/reports/nitrous-entities/_payload.json"
  },
  "/reports/nightmares-in-eiriel/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"8641-Q4otA4g7IctxTs2+BKflXtzm2zQ\"",
    "mtime": "2026-02-12T20:16:10.417Z",
    "size": 34369,
    "path": "../public/reports/nightmares-in-eiriel/index.html"
  },
  "/reports/nitrous-entities/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"8635-EnZRnizyq2H0d7wSLQDAi0pJh/4\"",
    "mtime": "2026-02-12T20:16:10.417Z",
    "size": 34357,
    "path": "../public/reports/nitrous-entities/index.html"
  },
  "/reports/nostalgic-forest/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-+OVUftyTKWK9IXJWEYNC1HCHeDs\"",
    "mtime": "2026-02-12T20:16:12.052Z",
    "size": 69,
    "path": "../public/reports/nostalgic-forest/_payload.json"
  },
  "/reports/nostalgic-forest/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"8635-9rPwdINvfFdUgXEnaR+6HtE2jk8\"",
    "mtime": "2026-02-12T20:16:10.417Z",
    "size": 34357,
    "path": "../public/reports/nostalgic-forest/index.html"
  },
  "/reports/novel-pleasantry/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-5CmR7gk1NS0Hws7aouqcONXnWyk\"",
    "mtime": "2026-02-12T20:16:12.055Z",
    "size": 69,
    "path": "../public/reports/novel-pleasantry/_payload.json"
  },
  "/reports/oceanic/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-BLqp8gMMZKgEv2Iq9IdpTS5ILf0\"",
    "mtime": "2026-02-12T20:16:12.052Z",
    "size": 69,
    "path": "../public/reports/oceanic/_payload.json"
  },
  "/reports/opening-up/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-K3gyl7uEz97zV8ZnTC1rpXN5a9k\"",
    "mtime": "2026-02-12T20:16:12.055Z",
    "size": 69,
    "path": "../public/reports/opening-up/_payload.json"
  },
  "/reports/novel-pleasantry/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"8635-U3303a1II+0JgZbi+eC2QAUK6mg\"",
    "mtime": "2026-02-12T20:16:10.420Z",
    "size": 34357,
    "path": "../public/reports/novel-pleasantry/index.html"
  },
  "/reports/oceanic/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"861a-FRdiEQUgXuolIo3H9aLekSK1bgE\"",
    "mtime": "2026-02-12T20:16:10.417Z",
    "size": 34330,
    "path": "../public/reports/oceanic/index.html"
  },
  "/reports/permanent-all-encompassing-states-of-unity-and-interconnectedness/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-EcRPSn9EQZuTbTPH5Ifb9hK4eg4\"",
    "mtime": "2026-02-12T20:16:12.055Z",
    "size": 69,
    "path": "../public/reports/permanent-all-encompassing-states-of-unity-and-interconnectedness/_payload.json"
  },
  "/reports/oneness-through-meditation/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-VOhPBNTuPHipDVyGYpbnjvAeMNA\"",
    "mtime": "2026-02-12T20:16:12.055Z",
    "size": 69,
    "path": "../public/reports/oneness-through-meditation/_payload.json"
  },
  "/reports/opening-up/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"8623-9mHx6PPb/ltKb8XyQPycpNDZWOI\"",
    "mtime": "2026-02-12T20:16:10.439Z",
    "size": 34339,
    "path": "../public/reports/opening-up/index.html"
  },
  "/reports/oneness-through-meditation/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"8653-zSCC5528WjRt/Ivw8bphH110p3c\"",
    "mtime": "2026-02-12T20:16:10.439Z",
    "size": 34387,
    "path": "../public/reports/oneness-through-meditation/index.html"
  },
  "/reports/productive-stimulation-without-euphoria/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-Dj/L+vY97/iXlqF1p7U3T0oarC0\"",
    "mtime": "2026-02-12T20:16:12.055Z",
    "size": 69,
    "path": "../public/reports/productive-stimulation-without-euphoria/_payload.json"
  },
  "/reports/permanent-all-encompassing-states-of-unity-and-interconnectedness/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"86c8-krWkZvKVoBB1YsqtC0O+jIuOew4\"",
    "mtime": "2026-02-12T20:16:10.439Z",
    "size": 34504,
    "path": "../public/reports/permanent-all-encompassing-states-of-unity-and-interconnectedness/index.html"
  },
  "/reports/productive-stimulation-without-euphoria/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"867a-7n2rguV+gUYAVK8j3SM/PoZmy2I\"",
    "mtime": "2026-02-12T20:16:10.439Z",
    "size": 34426,
    "path": "../public/reports/productive-stimulation-without-euphoria/index.html"
  },
  "/reports/profound-religious-experience/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-K5BPHdh5385yXEkQ7aNyZPP/+Ag\"",
    "mtime": "2026-02-12T20:16:12.055Z",
    "size": 69,
    "path": "../public/reports/profound-religious-experience/_payload.json"
  },
  "/reports/profound-religious-experience/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"865c-FbKhwK3vJhmJcBls92pUTQSj8+0\"",
    "mtime": "2026-02-12T20:16:10.439Z",
    "size": 34396,
    "path": "../public/reports/profound-religious-experience/index.html"
  },
  "/reports/psychedelic-dissociation/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-kNFcUIzqCXI9F1wWtfKMOgx063Q\"",
    "mtime": "2026-02-12T20:16:12.055Z",
    "size": 69,
    "path": "../public/reports/psychedelic-dissociation/_payload.json"
  },
  "/reports/psychedelic-dissociation/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"864d-DeXQ15KrFEJsFN5TEBN1ZE84Ib4\"",
    "mtime": "2026-02-12T20:16:10.440Z",
    "size": 34381,
    "path": "../public/reports/psychedelic-dissociation/index.html"
  },
  "/reports/psychostimulant-egodeath/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-UHv8pA4LharlkO5fKwy7A5RlG6k\"",
    "mtime": "2026-02-12T20:16:12.056Z",
    "size": 69,
    "path": "../public/reports/psychostimulant-egodeath/_payload.json"
  },
  "/reports/psychostimulant-egodeath/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"864d-SXPvXiV9qcrcFJB1zbmCoEJJP6c\"",
    "mtime": "2026-02-12T20:16:10.506Z",
    "size": 34381,
    "path": "../public/reports/psychostimulant-egodeath/index.html"
  },
  "/reports/pyrazolam/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-UmzuOllV82me4gOCXN9xm4GBDAs\"",
    "mtime": "2026-02-12T20:16:12.058Z",
    "size": 69,
    "path": "../public/reports/pyrazolam/_payload.json"
  },
  "/reports/re-discovering-dxm/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-/FzGObWWrjV45fQq3uka09XDxvo\"",
    "mtime": "2026-02-12T20:16:12.058Z",
    "size": 69,
    "path": "../public/reports/re-discovering-dxm/_payload.json"
  },
  "/reports/relationship-problems/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-TFxP2nkyMW6QxySJLDx6K8TlPik\"",
    "mtime": "2026-02-12T20:16:12.058Z",
    "size": 69,
    "path": "../public/reports/relationship-problems/_payload.json"
  },
  "/reports/resplendent-and-warm/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-t5ihN7m0YCK63b0eZEXYSJNX2mM\"",
    "mtime": "2026-02-12T20:16:12.060Z",
    "size": 69,
    "path": "../public/reports/resplendent-and-warm/_payload.json"
  },
  "/reports/pyrazolam/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"8620-kQToT/ozFtqylzgk/MV48olqNmU\"",
    "mtime": "2026-02-12T20:16:10.506Z",
    "size": 34336,
    "path": "../public/reports/pyrazolam/index.html"
  },
  "/reports/re-discovering-dxm/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"863b-8TucfT7Uh7nh3ydvse1ENBMOIpU\"",
    "mtime": "2026-02-12T20:16:10.506Z",
    "size": 34363,
    "path": "../public/reports/re-discovering-dxm/index.html"
  },
  "/reports/relationship-problems/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"8644-DmjrwOf61HnE4eNAqzd0elmdZYM\"",
    "mtime": "2026-02-12T20:16:10.506Z",
    "size": 34372,
    "path": "../public/reports/relationship-problems/index.html"
  },
  "/reports/resplendent-and-warm/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"8641-z/zjATLzqbkdymHkeznbbCHJMy4\"",
    "mtime": "2026-02-12T20:16:10.506Z",
    "size": 34369,
    "path": "../public/reports/resplendent-and-warm/index.html"
  },
  "/reports/restless-mind/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-dvMe8U5SLNpZ0FgVXYfKeSD1SqI\"",
    "mtime": "2026-02-12T20:16:12.060Z",
    "size": 69,
    "path": "../public/reports/restless-mind/_payload.json"
  },
  "/reports/salvia-people-in-a-courtyard/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-Qo79pgQrlbnE+sZMdRN92EHqBXg\"",
    "mtime": "2026-02-12T20:16:12.061Z",
    "size": 69,
    "path": "../public/reports/salvia-people-in-a-courtyard/_payload.json"
  },
  "/reports/restless-mind/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"862c-5iWXoEDmFmeeCeMsTPrIe5fWxMk\"",
    "mtime": "2026-02-12T20:16:10.534Z",
    "size": 34348,
    "path": "../public/reports/restless-mind/index.html"
  },
  "/reports/shaking-a-lot/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-VOT2tt0F3B5QVFH1sd7lPJuUfUs\"",
    "mtime": "2026-02-12T20:16:12.061Z",
    "size": 69,
    "path": "../public/reports/shaking-a-lot/_payload.json"
  },
  "/reports/searing-sizzling-joviality/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-lMhcZORKaIEZVY8vdCa7hso2LxM\"",
    "mtime": "2026-02-12T20:16:12.061Z",
    "size": 69,
    "path": "../public/reports/searing-sizzling-joviality/_payload.json"
  },
  "/reports/salvia-people-in-a-courtyard/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"8659-E/hzWwGSJ8lqioqriQ38ifKnyYY\"",
    "mtime": "2026-02-12T20:16:10.534Z",
    "size": 34393,
    "path": "../public/reports/salvia-people-in-a-courtyard/index.html"
  },
  "/reports/searing-sizzling-joviality/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"8653-Z+bDP9QMbBHQpAWb4tXuEhXd3Bo\"",
    "mtime": "2026-02-12T20:16:10.567Z",
    "size": 34387,
    "path": "../public/reports/searing-sizzling-joviality/index.html"
  },
  "/reports/shaking-a-lot/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"862c-lpeYqn42okKIdQJZ3b2QMwLnZAY\"",
    "mtime": "2026-02-12T20:16:10.567Z",
    "size": 34348,
    "path": "../public/reports/shaking-a-lot/index.html"
  },
  "/reports/sharp-and-instant/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-7Wy9t+JkK8iQ7d2evtnITt5478U\"",
    "mtime": "2026-02-12T20:16:12.062Z",
    "size": 69,
    "path": "../public/reports/sharp-and-instant/_payload.json"
  },
  "/reports/shredded-by-noise/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-w3TMYPx/EFDWi6dd/ZCx/ufS3CI\"",
    "mtime": "2026-02-12T20:16:12.061Z",
    "size": 69,
    "path": "../public/reports/shredded-by-noise/_payload.json"
  },
  "/reports/sharp-and-instant/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"8638-E8Yvxd9HitIqGiBvJKtE4sJIVbQ\"",
    "mtime": "2026-02-12T20:16:10.574Z",
    "size": 34360,
    "path": "../public/reports/sharp-and-instant/index.html"
  },
  "/reports/sheer-awe-and-joy/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-WU3hkHNn0viAaSc3UlM75yUlj9w\"",
    "mtime": "2026-02-12T20:16:12.061Z",
    "size": 69,
    "path": "../public/reports/sheer-awe-and-joy/_payload.json"
  },
  "/reports/shredded-by-noise/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"8638-TO35sEsHxjM+84zvxzlycF6ETiI\"",
    "mtime": "2026-02-12T20:16:10.567Z",
    "size": 34360,
    "path": "../public/reports/shredded-by-noise/index.html"
  },
  "/reports/sheer-awe-and-joy/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"8638-5slFD9N5A8RasNE3ugiuFmg7k7c\"",
    "mtime": "2026-02-12T20:16:10.567Z",
    "size": 34360,
    "path": "../public/reports/sheer-awe-and-joy/index.html"
  },
  "/reports/sick-off-of-alien-resplendence/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-c/GDRJ781JcrU566/sDRPmrfGhI\"",
    "mtime": "2026-02-12T20:16:12.061Z",
    "size": 69,
    "path": "../public/reports/sick-off-of-alien-resplendence/_payload.json"
  },
  "/reports/sleepy-and-hungry-dreams/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-xu98Nfmhw3BiMr+r/Yz8LAggfF8\"",
    "mtime": "2026-02-12T20:16:12.061Z",
    "size": 69,
    "path": "../public/reports/sleepy-and-hungry-dreams/_payload.json"
  },
  "/reports/sick-off-of-alien-resplendence/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"865f-NxLEVQnsDdGGk1L0KN/1VANi1IM\"",
    "mtime": "2026-02-12T20:16:10.567Z",
    "size": 34399,
    "path": "../public/reports/sick-off-of-alien-resplendence/index.html"
  },
  "/reports/so-fast-it-makes-you-sick/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-PH3672oqSS6hCHhawSU+q21Bq9M\"",
    "mtime": "2026-02-12T20:16:12.060Z",
    "size": 69,
    "path": "../public/reports/so-fast-it-makes-you-sick/_payload.json"
  },
  "/reports/sonic-phantoms/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-pxQF52kWtsT4Y5SpuFSHMzNdxFs\"",
    "mtime": "2026-02-12T20:16:12.061Z",
    "size": 69,
    "path": "../public/reports/sonic-phantoms/_payload.json"
  },
  "/reports/so-fast-it-makes-you-sick/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"8650-jCEcyr5J5kyRMj0B8b76ncqYQ4g\"",
    "mtime": "2026-02-12T20:16:10.567Z",
    "size": 34384,
    "path": "../public/reports/so-fast-it-makes-you-sick/index.html"
  },
  "/reports/sleepy-and-hungry-dreams/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"864d-VJJhjtuqfQafUwI/wBqNSrcHy7o\"",
    "mtime": "2026-02-12T20:16:10.567Z",
    "size": 34381,
    "path": "../public/reports/sleepy-and-hungry-dreams/index.html"
  },
  "/reports/spitfire/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-60xbnlrkCe9U8EKNFhd0gaQQpGQ\"",
    "mtime": "2026-02-12T20:16:12.063Z",
    "size": 69,
    "path": "../public/reports/spitfire/_payload.json"
  },
  "/reports/st-elmo-s-fire/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-6wBdUFGkuEMoQlz9AC6AymkmLow\"",
    "mtime": "2026-02-12T20:16:12.062Z",
    "size": 69,
    "path": "../public/reports/st-elmo-s-fire/_payload.json"
  },
  "/reports/strolling-through-hypnagogic-hyperspace/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-bFs4ujx0aKkvPKzJoUuQ+w32XH8\"",
    "mtime": "2026-02-12T20:16:12.062Z",
    "size": 69,
    "path": "../public/reports/strolling-through-hypnagogic-hyperspace/_payload.json"
  },
  "/reports/sonic-phantoms/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"862f-YVJzUwKzFOWIOTczqdSn4A1NITg\"",
    "mtime": "2026-02-12T20:16:10.567Z",
    "size": 34351,
    "path": "../public/reports/sonic-phantoms/index.html"
  },
  "/reports/st-elmo-s-fire/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"862f-u7gmR5DzL+D5uMYwR6itwCOdCVE\"",
    "mtime": "2026-02-12T20:16:10.602Z",
    "size": 34351,
    "path": "../public/reports/st-elmo-s-fire/index.html"
  },
  "/reports/surfing-on-gentle-optimism/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-QZ37fQXuFlfF9pPGNZRi52sipLs\"",
    "mtime": "2026-02-12T20:16:12.063Z",
    "size": 69,
    "path": "../public/reports/surfing-on-gentle-optimism/_payload.json"
  },
  "/reports/spitfire/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"861d-jkWMnjI1AWXHbj5ICE3ecQLaXnI\"",
    "mtime": "2026-02-12T20:16:10.602Z",
    "size": 34333,
    "path": "../public/reports/spitfire/index.html"
  },
  "/reports/strolling-through-hypnagogic-hyperspace/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"867a-vRkuTFHVYnuZvxDynv/FcLEH5Nk\"",
    "mtime": "2026-02-12T20:16:10.659Z",
    "size": 34426,
    "path": "../public/reports/strolling-through-hypnagogic-hyperspace/index.html"
  },
  "/reports/surfing-on-gentle-optimism/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"8653-b1CKlVCPwjXXWfN7nPBRHfYh360\"",
    "mtime": "2026-02-12T20:16:10.684Z",
    "size": 34387,
    "path": "../public/reports/surfing-on-gentle-optimism/index.html"
  },
  "/reports/surprisingly-nauseous-and-disappointing/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-cxi4xYDb1WTZHfAbzKxAypHu/xA\"",
    "mtime": "2026-02-12T20:16:12.063Z",
    "size": 69,
    "path": "../public/reports/surprisingly-nauseous-and-disappointing/_payload.json"
  },
  "/reports/swimming-in-the-dextroverse/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-YaCvcqR+F8rJVoGEus4Iw6vcnd4\"",
    "mtime": "2026-02-12T20:16:12.063Z",
    "size": 69,
    "path": "../public/reports/swimming-in-the-dextroverse/_payload.json"
  },
  "/reports/surprisingly-nauseous-and-disappointing/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"867a-YGDkNp3HaZmxS99jXdFcFS1KpH8\"",
    "mtime": "2026-02-12T20:16:10.697Z",
    "size": 34426,
    "path": "../public/reports/surprisingly-nauseous-and-disappointing/index.html"
  },
  "/reports/surrender/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-Ma6wNeQ5DwbA/6EPqBIgcyKafNc\"",
    "mtime": "2026-02-12T20:16:12.063Z",
    "size": 69,
    "path": "../public/reports/surrender/_payload.json"
  },
  "/reports/swimming-in-the-dextroverse/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"8656-JrnWy+j3p7Y8ZKV1jeor8IWXlQQ\"",
    "mtime": "2026-02-12T20:16:10.699Z",
    "size": 34390,
    "path": "../public/reports/swimming-in-the-dextroverse/index.html"
  },
  "/reports/tainted-euphoria/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-cl/VpQZy3JEzu3Od+2wQ8/Bgi2k\"",
    "mtime": "2026-02-12T20:16:12.063Z",
    "size": 69,
    "path": "../public/reports/tainted-euphoria/_payload.json"
  },
  "/reports/surrender/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"8620-2tbAbK1zSFAQPvlqkJLha499wus\"",
    "mtime": "2026-02-12T20:16:10.699Z",
    "size": 34336,
    "path": "../public/reports/surrender/index.html"
  },
  "/reports/tainted-euphoria/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"8635-7T9SaKcStWrS7v3624yqecQG1ZA\"",
    "mtime": "2026-02-12T20:16:10.698Z",
    "size": 34357,
    "path": "../public/reports/tainted-euphoria/index.html"
  },
  "/reports/tense-and-restless/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-mVoCIOkKnHQk3/qB+CtM7W7VV7s\"",
    "mtime": "2026-02-12T20:16:12.063Z",
    "size": 69,
    "path": "../public/reports/tense-and-restless/_payload.json"
  },
  "/reports/tense-and-restless/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"863b-csACc4otnXZTIfabxmf9suDWh7g\"",
    "mtime": "2026-02-12T20:16:10.698Z",
    "size": 34363,
    "path": "../public/reports/tense-and-restless/index.html"
  },
  "/reports/thawing/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-kS1NJwTvDw45DZMwEw/ATsbCa28\"",
    "mtime": "2026-02-12T20:16:12.063Z",
    "size": 69,
    "path": "../public/reports/thawing/_payload.json"
  },
  "/reports/the-bliss-of-summer/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-Qq+mn0BWQJgWcTpB2beFFGCw1wk\"",
    "mtime": "2026-02-12T20:16:12.063Z",
    "size": 69,
    "path": "../public/reports/the-bliss-of-summer/_payload.json"
  },
  "/reports/thawing/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"861a-ut1bToihls8Cs7Cy4bAtYM7p6bc\"",
    "mtime": "2026-02-12T20:16:10.705Z",
    "size": 34330,
    "path": "../public/reports/thawing/index.html"
  },
  "/reports/the-blizzard/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-9ZZucNSZ90p8AEZFYuJJDntLsmA\"",
    "mtime": "2026-02-12T20:16:12.064Z",
    "size": 69,
    "path": "../public/reports/the-blizzard/_payload.json"
  },
  "/reports/the-dizzying-squalls/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-AOsmEIKncquN+Ro0BP/0cjgOyxA\"",
    "mtime": "2026-02-12T20:16:12.063Z",
    "size": 69,
    "path": "../public/reports/the-dizzying-squalls/_payload.json"
  },
  "/reports/the-blizzard/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"8629-HvoENQXlD64IaHJXYdaC1L23oHU\"",
    "mtime": "2026-02-12T20:16:10.712Z",
    "size": 34345,
    "path": "../public/reports/the-blizzard/index.html"
  },
  "/reports/the-bliss-of-summer/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"863e-TplLfVg74RqV68spcnnVUEfbJZs\"",
    "mtime": "2026-02-12T20:16:10.706Z",
    "size": 34366,
    "path": "../public/reports/the-bliss-of-summer/index.html"
  },
  "/reports/the-dizzying-squalls/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"8641-W2XV1STy/PmiERau4ra9vcHySTU\"",
    "mtime": "2026-02-12T20:16:10.706Z",
    "size": 34369,
    "path": "../public/reports/the-dizzying-squalls/index.html"
  },
  "/reports/the-essence-of-bugs-3/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-1gMNAfETyq33BR5ief9b49N2Eo8\"",
    "mtime": "2026-02-12T20:16:12.063Z",
    "size": 69,
    "path": "../public/reports/the-essence-of-bugs-3/_payload.json"
  },
  "/reports/the-expedition/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-TMBx8U4tg8QUzSDZuvW6lLoRQYc\"",
    "mtime": "2026-02-12T20:16:12.064Z",
    "size": 69,
    "path": "../public/reports/the-expedition/_payload.json"
  },
  "/reports/the-essence-of-bugs-3/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"8644-cee5ZwCWWlPWgltHtmK4v5tesEA\"",
    "mtime": "2026-02-12T20:16:10.706Z",
    "size": 34372,
    "path": "../public/reports/the-essence-of-bugs-3/index.html"
  },
  "/reports/the-great-vibration/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-JpDAOCXD/dmqGiBOdChZNqEqWPg\"",
    "mtime": "2026-02-12T20:16:12.065Z",
    "size": 69,
    "path": "../public/reports/the-great-vibration/_payload.json"
  },
  "/reports/the-grinding-depths/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-AJCu9JjyL36ltbEq5Vo18WDsTAM\"",
    "mtime": "2026-02-12T20:16:12.067Z",
    "size": 69,
    "path": "../public/reports/the-grinding-depths/_payload.json"
  },
  "/reports/the-glory-of-the-sun/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-fYxIVIctNUrWtfSCCoAWMiMaFBU\"",
    "mtime": "2026-02-12T20:16:12.065Z",
    "size": 69,
    "path": "../public/reports/the-glory-of-the-sun/_payload.json"
  },
  "/reports/the-glory-of-the-sun/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"8641-dg8PKokR4ui7Zu6nxEz0Br3u/+o\"",
    "mtime": "2026-02-12T20:16:10.719Z",
    "size": 34369,
    "path": "../public/reports/the-glory-of-the-sun/index.html"
  },
  "/reports/the-great-vibration/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"863e-woWchOfTyEBB/wbm+MNX1Jd2pcM\"",
    "mtime": "2026-02-12T20:16:10.719Z",
    "size": 34366,
    "path": "../public/reports/the-great-vibration/index.html"
  },
  "/reports/the-expedition/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"862f-E5RGvnohKpYElqXn+lRrB2ZoG1I\"",
    "mtime": "2026-02-12T20:16:10.710Z",
    "size": 34351,
    "path": "../public/reports/the-expedition/index.html"
  },
  "/reports/the-grinding-depths/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"863e-7x13CGJTA860r6q/CTXZWIfLaVA\"",
    "mtime": "2026-02-12T20:16:10.719Z",
    "size": 34366,
    "path": "../public/reports/the-grinding-depths/index.html"
  },
  "/reports/the-hallway-of-a-thousand-things/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-Ll3Bbj5F+RTaIfnVJfcPLxW5c3M\"",
    "mtime": "2026-02-12T20:16:12.067Z",
    "size": 69,
    "path": "../public/reports/the-hallway-of-a-thousand-things/_payload.json"
  },
  "/reports/the-hallway-of-a-thousand-things/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"8665-/MeoKr4PYxsx80w/vvaqXHO1k/Q\"",
    "mtime": "2026-02-12T20:16:10.720Z",
    "size": 34405,
    "path": "../public/reports/the-hallway-of-a-thousand-things/index.html"
  },
  "/reports/the-little-boost/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-fC8Bd5zIxjwKNc7huILUwJP89Zk\"",
    "mtime": "2026-02-12T20:16:12.067Z",
    "size": 69,
    "path": "../public/reports/the-little-boost/_payload.json"
  },
  "/reports/the-little-boost/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"8635-3sSaYKMzmATePIQQX+zH227z04k\"",
    "mtime": "2026-02-12T20:16:10.720Z",
    "size": 34357,
    "path": "../public/reports/the-little-boost/index.html"
  },
  "/reports/the-magic-crystal/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-8twewVmY0+o3sKYBh6/jVV2cPTU\"",
    "mtime": "2026-02-12T20:16:12.069Z",
    "size": 69,
    "path": "../public/reports/the-magic-crystal/_payload.json"
  },
  "/reports/the-planet-became-a-watermelon/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"865f-Enj7PAfy1WkLn8039+Igk8d451o\"",
    "mtime": "2026-02-12T20:16:10.881Z",
    "size": 34399,
    "path": "../public/reports/the-planet-became-a-watermelon/index.html"
  },
  "/reports/the-magic-crystal/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"8638-vjmGSPc+ZHDPzzYywYTEGWAu+6c\"",
    "mtime": "2026-02-12T20:16:10.720Z",
    "size": 34360,
    "path": "../public/reports/the-magic-crystal/index.html"
  },
  "/reports/the-planet-became-a-watermelon/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-ng/uZAv2h02Bp9t+c8Qcc8vnWMA\"",
    "mtime": "2026-02-12T20:16:12.069Z",
    "size": 69,
    "path": "../public/reports/the-planet-became-a-watermelon/_payload.json"
  },
  "/reports/the-polychrome-sea/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-d5SA2+eDvraD+Zyc5uWOheBjGUc\"",
    "mtime": "2026-02-12T20:16:12.069Z",
    "size": 69,
    "path": "../public/reports/the-polychrome-sea/_payload.json"
  },
  "/reports/the-stillness-and-the-fluttering/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-Rym9tpj58dTkB/43ssGMR2cKEdg\"",
    "mtime": "2026-02-12T20:16:12.070Z",
    "size": 69,
    "path": "../public/reports/the-stillness-and-the-fluttering/_payload.json"
  },
  "/reports/the-stillness-and-the-fluttering/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"8665-xoO/Ic44miOQbDkbl+3VF6nxcjA\"",
    "mtime": "2026-02-12T20:16:11.032Z",
    "size": 34405,
    "path": "../public/reports/the-stillness-and-the-fluttering/index.html"
  },
  "/reports/these-voices-are-the-building-blocks-of-consciousness/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"86a4-81B+/S3cVJXLD2O7l05H/fRPOi8\"",
    "mtime": "2026-02-12T20:16:11.032Z",
    "size": 34468,
    "path": "../public/reports/these-voices-are-the-building-blocks-of-consciousness/index.html"
  },
  "/reports/the-polychrome-sea/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"863b-8a6LfNq5rns9QXQ4W477hRUW83o\"",
    "mtime": "2026-02-12T20:16:10.921Z",
    "size": 34363,
    "path": "../public/reports/the-polychrome-sea/index.html"
  },
  "/reports/these-voices-are-the-building-blocks-of-consciousness/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-NQAigN06cuGDiPZUCF3LFZMxXMY\"",
    "mtime": "2026-02-12T20:16:12.069Z",
    "size": 69,
    "path": "../public/reports/these-voices-are-the-building-blocks-of-consciousness/_payload.json"
  },
  "/reports/this-is-disgusting-and-shameful/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-2zJPl77qschRFNuRHLi8z+hvKI8\"",
    "mtime": "2026-02-12T20:16:12.070Z",
    "size": 69,
    "path": "../public/reports/this-is-disgusting-and-shameful/_payload.json"
  },
  "/reports/thinking-about-blood-and-gore/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"865c-mCNHRQ6XLiqUkRs4M2a+W3aGuNM\"",
    "mtime": "2026-02-12T20:16:11.032Z",
    "size": 34396,
    "path": "../public/reports/thinking-about-blood-and-gore/index.html"
  },
  "/reports/truth/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-txjUcdC9NhgGd1kI3RRB1XIj/mk\"",
    "mtime": "2026-02-12T20:16:12.069Z",
    "size": 69,
    "path": "../public/reports/truth/_payload.json"
  },
  "/reports/twisted-flesh/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-nW0pUVbHh6M+U59SsRS5iO4OUpc\"",
    "mtime": "2026-02-12T20:16:12.070Z",
    "size": 69,
    "path": "../public/reports/twisted-flesh/_payload.json"
  },
  "/reports/thinking-about-blood-and-gore/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-s08TDdpclu6T5xaJgzWBYyqtKsQ\"",
    "mtime": "2026-02-12T20:16:12.070Z",
    "size": 69,
    "path": "../public/reports/thinking-about-blood-and-gore/_payload.json"
  },
  "/reports/to-the-dextroverse/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-N7d+V91CeDOtmnJxbX4qPnhAlKA\"",
    "mtime": "2026-02-12T20:16:12.069Z",
    "size": 69,
    "path": "../public/reports/to-the-dextroverse/_payload.json"
  },
  "/reports/this-is-disgusting-and-shameful/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"8662-iFTL5TSSBZwP+oR94a0G6Rjafl0\"",
    "mtime": "2026-02-12T20:16:11.032Z",
    "size": 34402,
    "path": "../public/reports/this-is-disgusting-and-shameful/index.html"
  },
  "/reports/trying-to-engage-in-sexual-intercourse-with-the-personification-of-ayahuasca/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-sdw8xT3wAGJo0xg63ZEJWqP+JG8\"",
    "mtime": "2026-02-12T20:16:12.070Z",
    "size": 69,
    "path": "../public/reports/trying-to-engage-in-sexual-intercourse-with-the-personification-of-ayahuasca/_payload.json"
  },
  "/reports/twisted-flesh/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"862c-Ds5EXvWdnHOT19j784g7cg4bvn8\"",
    "mtime": "2026-02-12T20:16:11.032Z",
    "size": 34348,
    "path": "../public/reports/twisted-flesh/index.html"
  },
  "/reports/truth/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"8614-U1fOEgjaUWAm/xJU74P3SvHkxe8\"",
    "mtime": "2026-02-12T20:16:11.032Z",
    "size": 34324,
    "path": "../public/reports/truth/index.html"
  },
  "/reports/to-the-dextroverse/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"863b-5FAgK3OEg+wON/YCx0Mf9ZINJCo\"",
    "mtime": "2026-02-12T20:16:11.032Z",
    "size": 34363,
    "path": "../public/reports/to-the-dextroverse/index.html"
  },
  "/reports/trying-to-engage-in-sexual-intercourse-with-the-personification-of-ayahuasca/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"86e9-4HnIZFwebwgGehBD40hklX2PCNc\"",
    "mtime": "2026-02-12T20:16:11.032Z",
    "size": 34537,
    "path": "../public/reports/trying-to-engage-in-sexual-intercourse-with-the-personification-of-ayahuasca/index.html"
  },
  "/reports/uncomfortable-introspection-nihilistic-stimulation/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-mG7554VJ5AfiXwg0L6lTdImh6W0\"",
    "mtime": "2026-02-12T20:16:12.070Z",
    "size": 69,
    "path": "../public/reports/uncomfortable-introspection-nihilistic-stimulation/_payload.json"
  },
  "/reports/uncomfortable-introspection-nihilistic-stimulation/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"869b-sB3WzANiMeSaefEP53vWGvjI2Rk\"",
    "mtime": "2026-02-12T20:16:11.055Z",
    "size": 34459,
    "path": "../public/reports/uncomfortable-introspection-nihilistic-stimulation/index.html"
  },
  "/reports/unity-with-a-friend/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-DLvcgPXmwka6/Sc5mYgF6xNmRdE\"",
    "mtime": "2026-02-12T20:16:12.071Z",
    "size": 69,
    "path": "../public/reports/unity-with-a-friend/_payload.json"
  },
  "/reports/unity-with-a-friend/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"863e-vKgSO25CTjXxkTfPlAvhVNnsZcs\"",
    "mtime": "2026-02-12T20:16:11.058Z",
    "size": 34366,
    "path": "../public/reports/unity-with-a-friend/index.html"
  },
  "/reports/unnecessarily-large-dosage/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-SGivXEG24n+Bt2lZkNtvrFCf6V8\"",
    "mtime": "2026-02-12T20:16:12.070Z",
    "size": 69,
    "path": "../public/reports/unnecessarily-large-dosage/_payload.json"
  },
  "/reports/unusually-intense-trip/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-25Ol9nWNfZmV9i708MDP3uh4VKM\"",
    "mtime": "2026-02-12T20:16:12.071Z",
    "size": 69,
    "path": "../public/reports/unusually-intense-trip/_payload.json"
  },
  "/reports/unnecessarily-large-dosage/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"8653-bXc7KAx7EF8iKiFa/bEOwaNPtjY\"",
    "mtime": "2026-02-12T20:16:11.058Z",
    "size": 34387,
    "path": "../public/reports/unnecessarily-large-dosage/index.html"
  },
  "/reports/unusually-intense-trip/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"8647-/dCFdE+Z/e7U41eaSKsrH9PRLNE\"",
    "mtime": "2026-02-12T20:16:11.203Z",
    "size": 34375,
    "path": "../public/reports/unusually-intense-trip/index.html"
  },
  "/reports/vestiges-of-a-trip/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-VumXpi7X9qKhze1WljA/GuEFypE\"",
    "mtime": "2026-02-12T20:16:12.071Z",
    "size": 69,
    "path": "../public/reports/vestiges-of-a-trip/_payload.json"
  },
  "/reports/warm-and-arrogant-feeling/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-fqH7njiFXAtAaND3XHYffYp3Elg\"",
    "mtime": "2026-02-12T20:16:12.071Z",
    "size": 69,
    "path": "../public/reports/warm-and-arrogant-feeling/_payload.json"
  },
  "/reports/wintry-void/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-f8gQMVhviMQchWz7Y2kZ6t1Daxs\"",
    "mtime": "2026-02-12T20:16:12.071Z",
    "size": 69,
    "path": "../public/reports/wintry-void/_payload.json"
  },
  "/reports/wisdom-through-pain/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-x5nCANgELQxnNTNcWYmvmb7iQeU\"",
    "mtime": "2026-02-12T20:16:12.071Z",
    "size": 69,
    "path": "../public/reports/wisdom-through-pain/_payload.json"
  },
  "/reports/vestiges-of-a-trip/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"863b-X0kzuU/KI10ZzPMFrTrO2HAXI74\"",
    "mtime": "2026-02-12T20:16:11.400Z",
    "size": 34363,
    "path": "../public/reports/vestiges-of-a-trip/index.html"
  },
  "/reports/wintry-void/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"8626-gOuf4vqLyf2vyeyT/fZ25i1pBJ4\"",
    "mtime": "2026-02-12T20:16:11.403Z",
    "size": 34342,
    "path": "../public/reports/wintry-void/index.html"
  },
  "/reports/warm-and-arrogant-feeling/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"8650-U3OenEyZW39qrWLI0ULpE3X+ch8\"",
    "mtime": "2026-02-12T20:16:11.402Z",
    "size": 34384,
    "path": "../public/reports/warm-and-arrogant-feeling/index.html"
  },
  "/reports/wracked-with-color/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-dYLy33Si//hm2/VVhP+OnEMqc08\"",
    "mtime": "2026-02-12T20:16:12.071Z",
    "size": 69,
    "path": "../public/reports/wracked-with-color/_payload.json"
  },
  "/reports/you-do-not-need-to-understand/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-8/HTni3H/nj9nGkM6LeeDu3obaQ\"",
    "mtime": "2026-02-12T20:16:12.071Z",
    "size": 69,
    "path": "../public/reports/you-do-not-need-to-understand/_payload.json"
  },
  "/reports/wisdom-through-pain/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"863e-5cKhlRcUd0g0iDGnhpxhyxTKpZc\"",
    "mtime": "2026-02-12T20:16:11.403Z",
    "size": 34366,
    "path": "../public/reports/wisdom-through-pain/index.html"
  },
  "/reports/wracked-with-color/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"863b-b4rgqxdM9OLjZiXktLf1QG7OFp4\"",
    "mtime": "2026-02-12T20:16:11.403Z",
    "size": 34363,
    "path": "../public/reports/wracked-with-color/index.html"
  },
  "/methodology/approximate-frequency-of-occurence-scale/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-13UIBGsQR2YDwXFpPkhX80oLB2o\"",
    "mtime": "2026-02-12T20:16:11.990Z",
    "size": 69,
    "path": "../public/methodology/approximate-frequency-of-occurence-scale/_payload.json"
  },
  "/reports/you-do-not-need-to-understand/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"865c-RT02lFEH9l4xFlSQEIuLCDDJvQ0\"",
    "mtime": "2026-02-12T20:16:11.403Z",
    "size": 34396,
    "path": "../public/reports/you-do-not-need-to-understand/index.html"
  },
  "/methodology/duration-terminology/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-1PYGnUIHy++suXiVGk5Lzvt6W1Q\"",
    "mtime": "2026-02-12T20:16:11.994Z",
    "size": 69,
    "path": "../public/methodology/duration-terminology/_payload.json"
  },
  "/replications/audio/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-BIAPXxslaK5hmx8nfaMIXAH0HUM\"",
    "mtime": "2026-02-12T20:16:11.994Z",
    "size": 69,
    "path": "../public/replications/audio/_payload.json"
  },
  "/methodology/approximate-frequency-of-occurence-scale/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"7d36-HYZpHWQ7GZXV4CeKuazBN3t+VfQ\"",
    "mtime": "2026-02-12T20:16:09.267Z",
    "size": 32054,
    "path": "../public/methodology/approximate-frequency-of-occurence-scale/index.html"
  },
  "/methodology/duration-terminology/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"7d20-TusbWbwtY6Jfj2/CGbcANwyT0Vg\"",
    "mtime": "2026-02-12T20:16:09.315Z",
    "size": 32032,
    "path": "../public/methodology/duration-terminology/index.html"
  },
  "/replications/tutorials/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"45-JpbzEgGnaouLI+rzJBcA3gqhpp0\"",
    "mtime": "2026-02-12T20:16:11.994Z",
    "size": 69,
    "path": "../public/replications/tutorials/_payload.json"
  },
  "/replications/tutorials/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"7ee6-nAvJw2XqOd+53HeMSD5YilitQrk\"",
    "mtime": "2026-02-12T20:16:09.315Z",
    "size": 32486,
    "path": "../public/replications/tutorials/index.html"
  },
  "/summaries/dissociatives/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"5b-y0MbCBsiWidWL+ZM8a0fJ2m3JG8\"",
    "mtime": "2026-02-12T20:16:12.071Z",
    "size": 91,
    "path": "../public/summaries/dissociatives/_payload.json"
  },
  "/replications/audio/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"1ef17-yye07MiuIe2Qp12bhCwECZmOr4k\"",
    "mtime": "2026-02-12T20:16:09.315Z",
    "size": 126743,
    "path": "../public/replications/audio/index.html"
  },
  "/summaries/deliriants/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"5b-CCVnEd/LxPpoSbHjo5FYBwFeeHs\"",
    "mtime": "2026-02-12T20:16:12.071Z",
    "size": 91,
    "path": "../public/summaries/deliriants/_payload.json"
  },
  "/summaries/psychedelics/cognitive/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"5b-tx/MNhVY1srFSHtIoxZy6044bgU\"",
    "mtime": "2026-02-12T20:16:12.071Z",
    "size": 91,
    "path": "../public/summaries/psychedelics/cognitive/_payload.json"
  },
  "/summaries/psychedelics/visual/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"5b-QmjHmolD7VH3DeDt8AmoafZ5JN4\"",
    "mtime": "2026-02-12T20:16:12.072Z",
    "size": 91,
    "path": "../public/summaries/psychedelics/visual/_payload.json"
  },
  "/summaries/psychedelics/miscellaneous/_payload.json": {
    "type": "application/json;charset=utf-8",
    "etag": "\"5b-OSQpsrDNDj4BBB8f4dzKyTY+tM0\"",
    "mtime": "2026-02-12T20:16:12.071Z",
    "size": 91,
    "path": "../public/summaries/psychedelics/miscellaneous/_payload.json"
  },
  "/summaries/dissociatives/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"3449dc-yfrm0iOV3k8zbdhemMpY/X7nW14\"",
    "mtime": "2026-02-12T20:16:11.831Z",
    "size": 3426780,
    "path": "../public/summaries/dissociatives/index.html"
  },
  "/summaries/psychedelics/cognitive/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"344376-/CKY/76Tg4bw1Zza7yHP8H2gcMc\"",
    "mtime": "2026-02-12T20:16:11.852Z",
    "size": 3425142,
    "path": "../public/summaries/psychedelics/cognitive/index.html"
  },
  "/summaries/psychedelics/visual/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"33f873-YcnIQx0EN+GpXlPeZNl854ESQtw\"",
    "mtime": "2026-02-12T20:16:11.854Z",
    "size": 3405939,
    "path": "../public/summaries/psychedelics/visual/index.html"
  },
  "/summaries/psychedelics/miscellaneous/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"33b124-GIR+W0qaGGk0oxy0U9J0MGSdO+Q\"",
    "mtime": "2026-02-12T20:16:11.852Z",
    "size": 3387684,
    "path": "../public/summaries/psychedelics/miscellaneous/index.html"
  },
  "/summaries/deliriants/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"348ecd-8rVwBf2cvIBO+brh1OIMUPIeZ3g\"",
    "mtime": "2026-02-12T20:16:11.817Z",
    "size": 3444429,
    "path": "../public/summaries/deliriants/index.html"
  }
};

function normalizeWindowsPath(input = "") {
  if (!input || !input.includes("\\")) {
    return input;
  }
  return input.replace(/\\/g, "/");
}
const _IS_ABSOLUTE_RE = /^[/\\](?![/\\])|^[/\\]{2}(?!\.)|^[A-Za-z]:[/\\]/;
const _DRIVE_LETTER_RE = /^[A-Za-z]:$/;
function cwd() {
  if (typeof process !== "undefined") {
    return process.cwd().replace(/\\/g, "/");
  }
  return "/";
}
const resolve = function(...arguments_) {
  arguments_ = arguments_.map((argument) => normalizeWindowsPath(argument));
  let resolvedPath = "";
  let resolvedAbsolute = false;
  for (let index = arguments_.length - 1; index >= -1 && !resolvedAbsolute; index--) {
    const path = index >= 0 ? arguments_[index] : cwd();
    if (!path || path.length === 0) {
      continue;
    }
    resolvedPath = `${path}/${resolvedPath}`;
    resolvedAbsolute = isAbsolute(path);
  }
  resolvedPath = normalizeString(resolvedPath, !resolvedAbsolute);
  if (resolvedAbsolute && !isAbsolute(resolvedPath)) {
    return `/${resolvedPath}`;
  }
  return resolvedPath.length > 0 ? resolvedPath : ".";
};
function normalizeString(path, allowAboveRoot) {
  let res = "";
  let lastSegmentLength = 0;
  let lastSlash = -1;
  let dots = 0;
  let char = null;
  for (let index = 0; index <= path.length; ++index) {
    if (index < path.length) {
      char = path[index];
    } else if (char === "/") {
      break;
    } else {
      char = "/";
    }
    if (char === "/") {
      if (lastSlash === index - 1 || dots === 1) ; else if (dots === 2) {
        if (res.length < 2 || lastSegmentLength !== 2 || res[res.length - 1] !== "." || res[res.length - 2] !== ".") {
          if (res.length > 2) {
            const lastSlashIndex = res.lastIndexOf("/");
            if (lastSlashIndex === -1) {
              res = "";
              lastSegmentLength = 0;
            } else {
              res = res.slice(0, lastSlashIndex);
              lastSegmentLength = res.length - 1 - res.lastIndexOf("/");
            }
            lastSlash = index;
            dots = 0;
            continue;
          } else if (res.length > 0) {
            res = "";
            lastSegmentLength = 0;
            lastSlash = index;
            dots = 0;
            continue;
          }
        }
        if (allowAboveRoot) {
          res += res.length > 0 ? "/.." : "..";
          lastSegmentLength = 2;
        }
      } else {
        if (res.length > 0) {
          res += `/${path.slice(lastSlash + 1, index)}`;
        } else {
          res = path.slice(lastSlash + 1, index);
        }
        lastSegmentLength = index - lastSlash - 1;
      }
      lastSlash = index;
      dots = 0;
    } else if (char === "." && dots !== -1) {
      ++dots;
    } else {
      dots = -1;
    }
  }
  return res;
}
const isAbsolute = function(p) {
  return _IS_ABSOLUTE_RE.test(p);
};
const dirname = function(p) {
  const segments = normalizeWindowsPath(p).replace(/\/$/, "").split("/").slice(0, -1);
  if (segments.length === 1 && _DRIVE_LETTER_RE.test(segments[0])) {
    segments[0] += "/";
  }
  return segments.join("/") || (isAbsolute(p) ? "/" : ".");
};

function readAsset (id) {
  const serverDir = dirname(fileURLToPath(globalThis._importMeta_.url));
  return promises.readFile(resolve(serverDir, assets[id].path))
}

const publicAssetBases = {"/_nuxt/":{"maxAge":31536000}};

function isPublicAssetURL(id = '') {
  if (assets[id]) {
    return true
  }
  for (const base in publicAssetBases) {
    if (id.startsWith(base)) { return true }
  }
  return false
}

function getAsset (id) {
  return assets[id]
}

const METHODS = /* @__PURE__ */ new Set(["HEAD", "GET"]);
const EncodingMap = { gzip: ".gz", br: ".br" };
const _DCRv1h = eventHandler((event) => {
  if (event.method && !METHODS.has(event.method)) {
    return;
  }
  let id = decodePath(
    withLeadingSlash(withoutTrailingSlash(parseURL(event.path).pathname))
  );
  let asset;
  const encodingHeader = String(
    getRequestHeader(event, "accept-encoding") || ""
  );
  const encodings = [
    ...encodingHeader.split(",").map((e) => EncodingMap[e.trim()]).filter(Boolean).sort(),
    ""
  ];
  for (const encoding of encodings) {
    for (const _id of [id + encoding, joinURL(id, "index.html" + encoding)]) {
      const _asset = getAsset(_id);
      if (_asset) {
        asset = _asset;
        id = _id;
        break;
      }
    }
  }
  if (!asset) {
    if (isPublicAssetURL(id)) {
      removeResponseHeader(event, "Cache-Control");
      throw createError$1({ statusCode: 404 });
    }
    return;
  }
  if (asset.encoding !== void 0) {
    appendResponseHeader(event, "Vary", "Accept-Encoding");
  }
  const ifNotMatch = getRequestHeader(event, "if-none-match") === asset.etag;
  if (ifNotMatch) {
    setResponseStatus(event, 304, "Not Modified");
    return "";
  }
  const ifModifiedSinceH = getRequestHeader(event, "if-modified-since");
  const mtimeDate = new Date(asset.mtime);
  if (ifModifiedSinceH && asset.mtime && new Date(ifModifiedSinceH) >= mtimeDate) {
    setResponseStatus(event, 304, "Not Modified");
    return "";
  }
  if (asset.type && !getResponseHeader(event, "Content-Type")) {
    setResponseHeader(event, "Content-Type", asset.type);
  }
  if (asset.etag && !getResponseHeader(event, "ETag")) {
    setResponseHeader(event, "ETag", asset.etag);
  }
  if (asset.mtime && !getResponseHeader(event, "Last-Modified")) {
    setResponseHeader(event, "Last-Modified", mtimeDate.toUTCString());
  }
  if (asset.encoding && !getResponseHeader(event, "Content-Encoding")) {
    setResponseHeader(event, "Content-Encoding", asset.encoding);
  }
  if (asset.size > 0 && !getResponseHeader(event, "Content-Length")) {
    setResponseHeader(event, "Content-Length", asset.size);
  }
  return readAsset(id);
});

const require$1 = createRequire(globalThis._importMeta_.url);
const parseBooleanEnv = (value, defaultValue = false) => {
  if (value === void 0) return defaultValue;
  return ["1", "true", "yes", "on"].includes(value.toLowerCase());
};
const browseOnlyMode = parseBooleanEnv(process.env.BROWSE_ONLY_MODE, true);
const backendPath = resolve$1(process.cwd(), "backend/index.js");
const expressApp = browseOnlyMode ? null : require$1(backendPath);
const shouldHandleApiRequest = (url = "") => {
  return url === "/api" || url.startsWith("/api/") || url.startsWith("/api?");
};
const _zNNlIk = fromNodeMiddleware((req, res, next) => {
  if (browseOnlyMode || !expressApp) {
    return next();
  }
  if (!shouldHandleApiRequest(req.url || "")) {
    return next();
  }
  return expressApp(req, res, next);
});

const _SxA8c9 = defineEventHandler(() => {});

const _lazy_6fgu7c = () => import('../routes/renderer.mjs').then(function (n) { return n.r; });

const handlers = [
  { route: '', handler: _DCRv1h, lazy: false, middleware: true, method: undefined },
  { route: '', handler: _zNNlIk, lazy: false, middleware: true, method: undefined },
  { route: '/__nuxt_error', handler: _lazy_6fgu7c, lazy: true, middleware: false, method: undefined },
  { route: '/__nuxt_island/**', handler: _SxA8c9, lazy: false, middleware: false, method: undefined },
  { route: '/**', handler: _lazy_6fgu7c, lazy: true, middleware: false, method: undefined }
];

function createNitroApp() {
  const config = useRuntimeConfig();
  const hooks = createHooks();
  const captureError = (error, context = {}) => {
    const promise = hooks.callHookParallel("error", error, context).catch((error_) => {
      console.error("Error while capturing another error", error_);
    });
    if (context.event && isEvent(context.event)) {
      const errors = context.event.context.nitro?.errors;
      if (errors) {
        errors.push({ error, context });
      }
      if (context.event.waitUntil) {
        context.event.waitUntil(promise);
      }
    }
  };
  const h3App = createApp({
    debug: destr(false),
    onError: (error, event) => {
      captureError(error, { event, tags: ["request"] });
      return errorHandler(error, event);
    },
    onRequest: async (event) => {
      event.context.nitro = event.context.nitro || { errors: [] };
      const fetchContext = event.node.req?.__unenv__;
      if (fetchContext?._platform) {
        event.context = {
          _platform: fetchContext?._platform,
          // #3335
          ...fetchContext._platform,
          ...event.context
        };
      }
      if (!event.context.waitUntil && fetchContext?.waitUntil) {
        event.context.waitUntil = fetchContext.waitUntil;
      }
      event.fetch = (req, init) => fetchWithEvent(event, req, init, { fetch: localFetch });
      event.$fetch = (req, init) => fetchWithEvent(event, req, init, {
        fetch: $fetch
      });
      event.waitUntil = (promise) => {
        if (!event.context.nitro._waitUntilPromises) {
          event.context.nitro._waitUntilPromises = [];
        }
        event.context.nitro._waitUntilPromises.push(promise);
        if (event.context.waitUntil) {
          event.context.waitUntil(promise);
        }
      };
      event.captureError = (error, context) => {
        captureError(error, { event, ...context });
      };
      await nitroApp$1.hooks.callHook("request", event).catch((error) => {
        captureError(error, { event, tags: ["request"] });
      });
    },
    onBeforeResponse: async (event, response) => {
      await nitroApp$1.hooks.callHook("beforeResponse", event, response).catch((error) => {
        captureError(error, { event, tags: ["request", "response"] });
      });
    },
    onAfterResponse: async (event, response) => {
      await nitroApp$1.hooks.callHook("afterResponse", event, response).catch((error) => {
        captureError(error, { event, tags: ["request", "response"] });
      });
    }
  });
  const router = createRouter({
    preemptive: true
  });
  const nodeHandler = toNodeListener(h3App);
  const localCall = (aRequest) => b(
    nodeHandler,
    aRequest
  );
  const localFetch = (input, init) => {
    if (!input.toString().startsWith("/")) {
      return globalThis.fetch(input, init);
    }
    return C(
      nodeHandler,
      input,
      init
    ).then((response) => normalizeFetchResponse(response));
  };
  const $fetch = createFetch({
    fetch: localFetch,
    Headers: Headers$1,
    defaults: { baseURL: config.app.baseURL }
  });
  globalThis.$fetch = $fetch;
  h3App.use(createRouteRulesHandler({ localFetch }));
  for (const h of handlers) {
    let handler = h.lazy ? lazyEventHandler(h.handler) : h.handler;
    if (h.middleware || !h.route) {
      const middlewareBase = (config.app.baseURL + (h.route || "/")).replace(
        /\/+/g,
        "/"
      );
      h3App.use(middlewareBase, handler);
    } else {
      const routeRules = getRouteRulesForPath(
        h.route.replace(/:\w+|\*\*/g, "_")
      );
      if (routeRules.cache) {
        handler = cachedEventHandler(handler, {
          group: "nitro/routes",
          ...routeRules.cache
        });
      }
      router.use(h.route, handler, h.method);
    }
  }
  h3App.use(config.app.baseURL, router.handler);
  const app = {
    hooks,
    h3App,
    router,
    localCall,
    localFetch,
    captureError
  };
  return app;
}
function runNitroPlugins(nitroApp2) {
  for (const plugin of plugins) {
    try {
      plugin(nitroApp2);
    } catch (error) {
      nitroApp2.captureError(error, { tags: ["plugin"] });
      throw error;
    }
  }
}
const nitroApp$1 = createNitroApp();
function useNitroApp() {
  return nitroApp$1;
}
runNitroPlugins(nitroApp$1);

function defineRenderHandler(render) {
  const runtimeConfig = useRuntimeConfig();
  return eventHandler(async (event) => {
    const nitroApp = useNitroApp();
    const ctx = { event, render, response: void 0 };
    await nitroApp.hooks.callHook("render:before", ctx);
    if (!ctx.response) {
      if (event.path === `${runtimeConfig.app.baseURL}favicon.ico`) {
        setResponseHeader(event, "Content-Type", "image/x-icon");
        return send(
          event,
          "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
        );
      }
      ctx.response = await ctx.render(event);
      if (!ctx.response) {
        const _currentStatus = getResponseStatus(event);
        setResponseStatus(event, _currentStatus === 200 ? 500 : _currentStatus);
        return send(
          event,
          "No response returned from render handler: " + event.path
        );
      }
    }
    await nitroApp.hooks.callHook("render:response", ctx.response, ctx);
    if (ctx.response.headers) {
      setResponseHeaders(event, ctx.response.headers);
    }
    if (ctx.response.statusCode || ctx.response.statusMessage) {
      setResponseStatus(
        event,
        ctx.response.statusCode,
        ctx.response.statusMessage
      );
    }
    return ctx.response.body;
  });
}

const debug = (...args) => {
};
function GracefulShutdown(server, opts) {
  opts = opts || {};
  const options = Object.assign(
    {
      signals: "SIGINT SIGTERM",
      timeout: 3e4,
      development: false,
      forceExit: true,
      onShutdown: (signal) => Promise.resolve(signal),
      preShutdown: (signal) => Promise.resolve(signal)
    },
    opts
  );
  let isShuttingDown = false;
  const connections = {};
  let connectionCounter = 0;
  const secureConnections = {};
  let secureConnectionCounter = 0;
  let failed = false;
  let finalRun = false;
  function onceFactory() {
    let called = false;
    return (emitter, events, callback) => {
      function call() {
        if (!called) {
          called = true;
          return Reflect.apply(callback, this, arguments);
        }
      }
      for (const e of events) {
        emitter.on(e, call);
      }
    };
  }
  const signals = options.signals.split(" ").map((s) => s.trim()).filter((s) => s.length > 0);
  const once = onceFactory();
  once(process, signals, (signal) => {
    debug("received shut down signal", signal);
    shutdown(signal).then(() => {
      if (options.forceExit) {
        process.exit(failed ? 1 : 0);
      }
    }).catch((error) => {
      debug("server shut down error occurred", error);
      process.exit(1);
    });
  });
  function isFunction(functionToCheck) {
    const getType = Object.prototype.toString.call(functionToCheck);
    return /^\[object\s([A-Za-z]+)?Function]$/.test(getType);
  }
  function destroy(socket, force = false) {
    if (socket._isIdle && isShuttingDown || force) {
      socket.destroy();
      if (socket.server instanceof http.Server) {
        delete connections[socket._connectionId];
      } else {
        delete secureConnections[socket._connectionId];
      }
    }
  }
  function destroyAllConnections(force = false) {
    debug("Destroy Connections : " + (force ? "forced close" : "close"));
    let counter = 0;
    let secureCounter = 0;
    for (const key of Object.keys(connections)) {
      const socket = connections[key];
      const serverResponse = socket._httpMessage;
      if (serverResponse && !force) {
        if (!serverResponse.headersSent) {
          serverResponse.setHeader("connection", "close");
        }
      } else {
        counter++;
        destroy(socket);
      }
    }
    debug("Connections destroyed : " + counter);
    debug("Connection Counter    : " + connectionCounter);
    for (const key of Object.keys(secureConnections)) {
      const socket = secureConnections[key];
      const serverResponse = socket._httpMessage;
      if (serverResponse && !force) {
        if (!serverResponse.headersSent) {
          serverResponse.setHeader("connection", "close");
        }
      } else {
        secureCounter++;
        destroy(socket);
      }
    }
    debug("Secure Connections destroyed : " + secureCounter);
    debug("Secure Connection Counter    : " + secureConnectionCounter);
  }
  server.on("request", (req, res) => {
    req.socket._isIdle = false;
    if (isShuttingDown && !res.headersSent) {
      res.setHeader("connection", "close");
    }
    res.on("finish", () => {
      req.socket._isIdle = true;
      destroy(req.socket);
    });
  });
  server.on("connection", (socket) => {
    if (isShuttingDown) {
      socket.destroy();
    } else {
      const id = connectionCounter++;
      socket._isIdle = true;
      socket._connectionId = id;
      connections[id] = socket;
      socket.once("close", () => {
        delete connections[socket._connectionId];
      });
    }
  });
  server.on("secureConnection", (socket) => {
    if (isShuttingDown) {
      socket.destroy();
    } else {
      const id = secureConnectionCounter++;
      socket._isIdle = true;
      socket._connectionId = id;
      secureConnections[id] = socket;
      socket.once("close", () => {
        delete secureConnections[socket._connectionId];
      });
    }
  });
  process.on("close", () => {
    debug("closed");
  });
  function shutdown(sig) {
    function cleanupHttp() {
      destroyAllConnections();
      debug("Close http server");
      return new Promise((resolve, reject) => {
        server.close((err) => {
          if (err) {
            return reject(err);
          }
          return resolve(true);
        });
      });
    }
    debug("shutdown signal - " + sig);
    if (options.development) {
      debug("DEV-Mode - immediate forceful shutdown");
      return process.exit(0);
    }
    function finalHandler() {
      if (!finalRun) {
        finalRun = true;
        if (options.finally && isFunction(options.finally)) {
          debug("executing finally()");
          options.finally();
        }
      }
      return Promise.resolve();
    }
    function waitForReadyToShutDown(totalNumInterval) {
      debug(`waitForReadyToShutDown... ${totalNumInterval}`);
      if (totalNumInterval === 0) {
        debug(
          `Could not close connections in time (${options.timeout}ms), will forcefully shut down`
        );
        return Promise.resolve(true);
      }
      const allConnectionsClosed = Object.keys(connections).length === 0 && Object.keys(secureConnections).length === 0;
      if (allConnectionsClosed) {
        debug("All connections closed. Continue to shutting down");
        return Promise.resolve(false);
      }
      debug("Schedule the next waitForReadyToShutdown");
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(waitForReadyToShutDown(totalNumInterval - 1));
        }, 250);
      });
    }
    if (isShuttingDown) {
      return Promise.resolve();
    }
    debug("shutting down");
    return options.preShutdown(sig).then(() => {
      isShuttingDown = true;
      cleanupHttp();
    }).then(() => {
      const pollIterations = options.timeout ? Math.round(options.timeout / 250) : 0;
      return waitForReadyToShutDown(pollIterations);
    }).then((force) => {
      debug("Do onShutdown now");
      if (force) {
        destroyAllConnections(force);
      }
      return options.onShutdown(sig);
    }).then(finalHandler).catch((error) => {
      const errString = typeof error === "string" ? error : JSON.stringify(error);
      debug(errString);
      failed = true;
      throw errString;
    });
  }
  function shutdownManual() {
    return shutdown("manual");
  }
  return shutdownManual;
}

function getGracefulShutdownConfig() {
  return {
    disabled: !!process.env.NITRO_SHUTDOWN_DISABLED,
    signals: (process.env.NITRO_SHUTDOWN_SIGNALS || "SIGTERM SIGINT").split(" ").map((s) => s.trim()),
    timeout: Number.parseInt(process.env.NITRO_SHUTDOWN_TIMEOUT || "", 10) || 3e4,
    forceExit: !process.env.NITRO_SHUTDOWN_NO_FORCE_EXIT
  };
}
function setupGracefulShutdown(listener, nitroApp) {
  const shutdownConfig = getGracefulShutdownConfig();
  if (shutdownConfig.disabled) {
    return;
  }
  GracefulShutdown(listener, {
    signals: shutdownConfig.signals.join(" "),
    timeout: shutdownConfig.timeout,
    forceExit: shutdownConfig.forceExit,
    onShutdown: async () => {
      await new Promise((resolve) => {
        const timeout = setTimeout(() => {
          console.warn("Graceful shutdown timeout, force exiting...");
          resolve();
        }, shutdownConfig.timeout);
        nitroApp.hooks.callHook("close").catch((error) => {
          console.error(error);
        }).finally(() => {
          clearTimeout(timeout);
          resolve();
        });
      });
    }
  });
}

const cert = process.env.NITRO_SSL_CERT;
const key = process.env.NITRO_SSL_KEY;
const nitroApp = useNitroApp();
const server = cert && key ? new Server({ key, cert }, toNodeListener(nitroApp.h3App)) : new Server$1(toNodeListener(nitroApp.h3App));
const port = destr(process.env.NITRO_PORT || process.env.PORT) || 3e3;
const host = process.env.NITRO_HOST || process.env.HOST;
const path = process.env.NITRO_UNIX_SOCKET;
const listener = server.listen(path ? { path } : { port, host }, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  const protocol = cert && key ? "https" : "http";
  const addressInfo = listener.address();
  if (typeof addressInfo === "string") {
    console.log(`Listening on unix socket ${addressInfo}`);
    return;
  }
  const baseURL = (useRuntimeConfig().app.baseURL || "").replace(/\/$/, "");
  const url = `${protocol}://${addressInfo.family === "IPv6" ? `[${addressInfo.address}]` : addressInfo.address}:${addressInfo.port}${baseURL}`;
  console.log(`Listening on ${url}`);
});
trapUnhandledNodeErrors();
setupGracefulShutdown(listener, nitroApp);
const nodeServer = {};

export { $fetch as $, parseQuery as A, withTrailingSlash as B, withoutTrailingSlash as C, nodeServer as D, getResponseStatus as a, defineRenderHandler as b, getQuery as c, decodePath as d, createError$1 as e, getRouteRules as f, getResponseStatusText as g, joinURL as h, useNitroApp as i, joinRelativeURL as j, hasProtocol as k, isScriptProtocol as l, klona as m, getContext as n, getRequestHeader as o, destr as p, isEqual as q, setCookie as r, sanitizeStatusCode as s, getCookie as t, useRuntimeConfig as u, deleteCookie as v, withQuery as w, createHooks as x, defu as y, executeAsync as z };
//# sourceMappingURL=nitro.mjs.map
