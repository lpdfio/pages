// wasm/lpdf-web.js
var LpdfEngine = class {
  __destroy_into_raw() {
    const ptr = this.__wbg_ptr;
    this.__wbg_ptr = 0;
    LpdfEngineFinalization.unregister(this);
    return ptr;
  }
  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_lpdfengine_free(ptr, 0);
  }
  /**
   * Register the bytes of a file a document carries, for the `<file>` of its `<attachments>` whose `ref`, or with
   * no ref whose name, is `name`. The PDF carries them as they are.
   * @param {string} name
   * @param {Uint8Array} bytes
   */
  load_file(name, bytes) {
    const ptr0 = passStringToWasm0(name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
    const len1 = WASM_VECTOR_LEN;
    wasm.lpdfengine_load_file(this.__wbg_ptr, ptr0, len0, ptr1, len1);
  }
  /**
   * Register raw font bytes (TTF/OTF) for a custom font name.
   * Call this once per font before calling `render_pdf`.
   * Glyph advance-width metrics are extracted automatically from the font
   * bytes so the layout engine can measure text accurately — no separate
   * `set_font_metrics` call is required.
   * @param {string} name
   * @param {Uint8Array} bytes
   */
  load_font(name, bytes) {
    const ptr0 = passStringToWasm0(name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
    const len1 = WASM_VECTOR_LEN;
    wasm.lpdfengine_load_font(this.__wbg_ptr, ptr0, len0, ptr1, len1);
  }
  /**
   * Register raw image bytes (JPEG or PNG) for an image name.
   * Call this for every image referenced by `<img name="…">` nodes.
   * @param {string} name
   * @param {Uint8Array} bytes
   */
  load_image(name, bytes) {
    const ptr0 = passStringToWasm0(name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
    const len1 = WASM_VECTOR_LEN;
    wasm.lpdfengine_load_image(this.__wbg_ptr, ptr0, len0, ptr1, len1);
  }
  /**
   * Register the text of a file of Markdown rules, the root of which is a `<markdown-styles>`, for the
   * `src` that names it. The engine reads no files: call this once for every `<markdown-styles src="…">`
   * of the document before `render_pdf`, as `load_font` is called for a font.
   * @param {string} src
   * @param {string} xml
   */
  load_markdown_styles(src, xml) {
    const ptr0 = passStringToWasm0(src, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passStringToWasm0(xml, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    wasm.lpdfengine_load_markdown_styles(this.__wbg_ptr, ptr0, len0, ptr1, len1);
  }
  /**
   * Register the bytes of an ICC colour profile, for the `<profile>` of a document's `<assets>` whose `ref`, or with
   * no ref whose name, is `name`: the press profile a PDF/X document names in `<output profile>`.
   * @param {string} name
   * @param {Uint8Array} bytes
   */
  load_profile(name, bytes) {
    const ptr0 = passStringToWasm0(name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
    const len1 = WASM_VECTOR_LEN;
    wasm.lpdfengine_load_profile(this.__wbg_ptr, ptr0, len0, ptr1, len1);
  }
  /**
   * @param {string} license_key
   */
  constructor(license_key) {
    const ptr0 = passStringToWasm0(license_key, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.lpdfengine_new(ptr0, len0);
    this.__wbg_ptr = ret >>> 0;
    LpdfEngineFinalization.register(this, this.__wbg_ptr, this);
    return this;
  }
  /**
   * @param {string} xml
   * @returns {string}
   */
  render(xml) {
    let deferred2_0;
    let deferred2_1;
    try {
      const ptr0 = passStringToWasm0(xml, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
      const len0 = WASM_VECTOR_LEN;
      const ret = wasm.lpdfengine_render(this.__wbg_ptr, ptr0, len0);
      deferred2_0 = ret[0];
      deferred2_1 = ret[1];
      return getStringFromWasm0(ret[0], ret[1]);
    } finally {
      wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
    }
  }
  /**
   * Render `xml` to binary PDF bytes.
   *
   * Any custom fonts referenced in `<font src="…">` declarations must have
   * their bytes registered via `load_font` before calling this method.
   *
   * `json_data` is an optional JSON string used to resolve `data-*`
   * attributes in the template.  Pass `None` (or `null` / `undefined` from
   * JavaScript) to render the template with its inline fallback content.
   *
   * The rest is for a document that asks for encryption in its `<output>`, which sets the cipher and
   * the permissions: the passwords, which the template never holds, and `entropy`, at least 32 random
   * bytes from the host's secure generator for AES-256. A document that asks for encryption needs an
   * owner password, or `skip_encryption` to render it unencrypted, as a preview does; passwords for a
   * document that doesn't ask for it are an error, and so are passwords with `skip_encryption`.
   * @param {string} xml
   * @param {string | null | undefined} json_data
   * @param {string | null | undefined} user_password
   * @param {string | null | undefined} owner_password
   * @param {boolean} skip_encryption
   * @param {Uint8Array} entropy
   * @returns {Uint8Array}
   */
  render_pdf(xml, json_data, user_password, owner_password, skip_encryption, entropy) {
    const ptr0 = passStringToWasm0(xml, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    var ptr1 = isLikeNone(json_data) ? 0 : passStringToWasm0(json_data, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len1 = WASM_VECTOR_LEN;
    var ptr2 = isLikeNone(user_password) ? 0 : passStringToWasm0(user_password, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len2 = WASM_VECTOR_LEN;
    var ptr3 = isLikeNone(owner_password) ? 0 : passStringToWasm0(owner_password, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len3 = WASM_VECTOR_LEN;
    const ptr4 = passArray8ToWasm0(entropy, wasm.__wbindgen_malloc);
    const len4 = WASM_VECTOR_LEN;
    const ret = wasm.lpdfengine_render_pdf(this.__wbg_ptr, ptr0, len0, ptr1, len1, ptr2, len2, ptr3, len3, skip_encryption, ptr4, len4);
    if (ret[3]) {
      throw takeFromExternrefTable0(ret[2]);
    }
    var v6 = getArrayU8FromWasm0(ret[0], ret[1]).slice();
    wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
    return v6;
  }
  /**
   * @param {string} json
   * @returns {string}
   */
  render_tree(json) {
    let deferred2_0;
    let deferred2_1;
    try {
      const ptr0 = passStringToWasm0(json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
      const len0 = WASM_VECTOR_LEN;
      const ret = wasm.lpdfengine_render_tree(this.__wbg_ptr, ptr0, len0);
      deferred2_0 = ret[0];
      deferred2_1 = ret[1];
      return getStringFromWasm0(ret[0], ret[1]);
    } finally {
      wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
    }
  }
  /**
   * Render a JSON kit-tree document to PDF bytes.
   *
   * This is the JSON counterpart of `render_pdf`. The Node adapter uses it
   * when an `LpdfDocument` Kit tree is passed to `renderPdf()`, avoiding an
   * intermediate XML serialisation step. PHP, Python, and .NET adapters also
   * use this entry point.
   *
   * The passwords, `skip_encryption` and `entropy` are those of `render_pdf`, for a document whose
   * `output` asks for encryption.
   * @param {string} json
   * @param {string | null | undefined} user_password
   * @param {string | null | undefined} owner_password
   * @param {boolean} skip_encryption
   * @param {Uint8Array} entropy
   * @returns {Uint8Array}
   */
  render_tree_pdf(json, user_password, owner_password, skip_encryption, entropy) {
    const ptr0 = passStringToWasm0(json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    var ptr1 = isLikeNone(user_password) ? 0 : passStringToWasm0(user_password, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len1 = WASM_VECTOR_LEN;
    var ptr2 = isLikeNone(owner_password) ? 0 : passStringToWasm0(owner_password, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len2 = WASM_VECTOR_LEN;
    const ptr3 = passArray8ToWasm0(entropy, wasm.__wbindgen_malloc);
    const len3 = WASM_VECTOR_LEN;
    const ret = wasm.lpdfengine_render_tree_pdf(this.__wbg_ptr, ptr0, len0, ptr1, len1, ptr2, len2, skip_encryption, ptr3, len3);
    if (ret[3]) {
      throw takeFromExternrefTable0(ret[2]);
    }
    var v5 = getArrayU8FromWasm0(ret[0], ret[1]).slice();
    wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
    return v5;
  }
  /**
   * Set an optional ISO 8601 creation timestamp (e.g. `"2024-06-01T12:00:00"`, `"2024-06-01T12:00:00.000Z"` or
   * `"2024-06-01T12:00:00+01:00"`). When provided, written as `/CreationDate` in the PDF info dictionary, with
   * the precision and the time zone it was given in; a value that is not a date makes the render an error.
   * Omitting this keeps builds reproducible (no embedded timestamp).
   * @param {string} iso
   */
  set_created_on(iso) {
    const ptr0 = passStringToWasm0(iso, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    wasm.lpdfengine_set_created_on(this.__wbg_ptr, ptr0, len0);
  }
  /**
   * Inject glyph advance-width tables for custom fonts.
   *
   * Call this *before* `render_pdf` / `render` when the document uses custom
   * fonts (declared via `<font src="…"`). The adapter extracts these widths
   * from the font binary and passes them as a JSON object:
   *
   * ```json
   * { "fontName": { "default": 500, "ascii": [260, 285, …] } }
   * ```
   *
   * `ascii` is a 95-element array for code points 32–126. `default` is used
   * for code points outside that range. All values are in 1/1000 em units.
   * @param {string} json
   */
  set_font_metrics(json) {
    const ptr0 = passStringToWasm0(json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    wasm.lpdfengine_set_font_metrics(this.__wbg_ptr, ptr0, len0);
  }
  /**
   * Set the memory a render may allocate, in megabytes: 1024 when it isn't set. A render that needs more stops
   * with an error that names the cap. What the engine holds before the render, such as its loaded fonts, doesn't
   * count.
   *
   * Returns an error when `mb` is 0 or above 4096, the most 32-bit WebAssembly addresses.
   * @param {number} mb
   */
  set_max_memory_mb(mb) {
    const ret = wasm.lpdfengine_set_max_memory_mb(this.__wbg_ptr, mb);
    if (ret[1]) {
      throw takeFromExternrefTable0(ret[0]);
    }
  }
  /**
   * Set the current Unix timestamp (seconds) for license expiry checking.
   * Must be called before `render_pdf` when using a time-limited token.
   * If not set (default `0`), expiry is not checked.
   * @param {bigint} unix
   */
  set_now(unix) {
    wasm.lpdfengine_set_now(this.__wbg_ptr, unix);
  }
  /**
   * Draw PNG stamps over the pages of an existing PDF, and return the file with them added as an incremental
   * update: the input, byte for byte, then the images and the pages they change. The original bytes stay as they
   * were, so an owner password and its permissions stay, and so does a digital signature's revision.
   *
   * `stamps` is a JSON list of stamps, each with an `image`, the name of a PNG loaded with `load_image`, a `page`
   * scope, a box (`x`, `y`, `anchor`, `width`, `height`, placed as a layer element is) and how the image sits in it
   * (`align`, `justify`, `scale`, `max-grow`). Without a valid license key, each stamped page gets the attribution
   * line of a render in its top-right corner.
   * @param {Uint8Array} pdf
   * @param {string} stamps
   * @returns {Uint8Array}
   */
  stamp(pdf, stamps) {
    const ptr0 = passArray8ToWasm0(pdf, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passStringToWasm0(stamps, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    const ret = wasm.lpdfengine_stamp(this.__wbg_ptr, ptr0, len0, ptr1, len1);
    if (ret[3]) {
      throw takeFromExternrefTable0(ret[2]);
    }
    var v3 = getArrayU8FromWasm0(ret[0], ret[1]).slice();
    wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
    return v3;
  }
};
if (Symbol.dispose) LpdfEngine.prototype[Symbol.dispose] = LpdfEngine.prototype.free;
function check_license(token, now_unix) {
  let deferred2_0;
  let deferred2_1;
  try {
    const ptr0 = passStringToWasm0(token, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.check_license(ptr0, len0, now_unix);
    deferred2_0 = ret[0];
    deferred2_1 = ret[1];
    return getStringFromWasm0(ret[0], ret[1]);
  } finally {
    wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
  }
}
function __wbg_get_imports() {
  const import0 = {
    __proto__: null,
    __wbg___wbindgen_throw_6b64449b9b9ed33c: function(arg0, arg1) {
      throw new Error(getStringFromWasm0(arg0, arg1));
    },
    __wbg_getRandomValues_cc7f052a444bb2ce: function() {
      return handleError(function(arg0, arg1) {
        globalThis.crypto.getRandomValues(getArrayU8FromWasm0(arg0, arg1));
      }, arguments);
    },
    __wbindgen_cast_0000000000000001: function(arg0, arg1) {
      const ret = getStringFromWasm0(arg0, arg1);
      return ret;
    },
    __wbindgen_init_externref_table: function() {
      const table = wasm.__wbindgen_externrefs;
      const offset = table.grow(4);
      table.set(0, void 0);
      table.set(offset + 0, void 0);
      table.set(offset + 1, null);
      table.set(offset + 2, true);
      table.set(offset + 3, false);
    }
  };
  return {
    __proto__: null,
    "./lpdf_bg.js": import0
  };
}
var LpdfEngineFinalization = typeof FinalizationRegistry === "undefined" ? { register: () => {
}, unregister: () => {
} } : new FinalizationRegistry((ptr) => wasm.__wbg_lpdfengine_free(ptr >>> 0, 1));
function addToExternrefTable0(obj) {
  const idx = wasm.__externref_table_alloc();
  wasm.__wbindgen_externrefs.set(idx, obj);
  return idx;
}
function getArrayU8FromWasm0(ptr, len) {
  ptr = ptr >>> 0;
  return getUint8ArrayMemory0().subarray(ptr / 1, ptr / 1 + len);
}
function getStringFromWasm0(ptr, len) {
  ptr = ptr >>> 0;
  return decodeText(ptr, len);
}
var cachedUint8ArrayMemory0 = null;
function getUint8ArrayMemory0() {
  if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
    cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
  }
  return cachedUint8ArrayMemory0;
}
function handleError(f, args) {
  try {
    return f.apply(this, args);
  } catch (e) {
    const idx = addToExternrefTable0(e);
    wasm.__wbindgen_exn_store(idx);
  }
}
function isLikeNone(x) {
  return x === void 0 || x === null;
}
function passArray8ToWasm0(arg, malloc) {
  const ptr = malloc(arg.length * 1, 1) >>> 0;
  getUint8ArrayMemory0().set(arg, ptr / 1);
  WASM_VECTOR_LEN = arg.length;
  return ptr;
}
function passStringToWasm0(arg, malloc, realloc) {
  if (realloc === void 0) {
    const buf = cachedTextEncoder.encode(arg);
    const ptr2 = malloc(buf.length, 1) >>> 0;
    getUint8ArrayMemory0().subarray(ptr2, ptr2 + buf.length).set(buf);
    WASM_VECTOR_LEN = buf.length;
    return ptr2;
  }
  let len = arg.length;
  let ptr = malloc(len, 1) >>> 0;
  const mem = getUint8ArrayMemory0();
  let offset = 0;
  for (; offset < len; offset++) {
    const code = arg.charCodeAt(offset);
    if (code > 127) break;
    mem[ptr + offset] = code;
  }
  if (offset !== len) {
    if (offset !== 0) {
      arg = arg.slice(offset);
    }
    ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
    const view = getUint8ArrayMemory0().subarray(ptr + offset, ptr + len);
    const ret = cachedTextEncoder.encodeInto(arg, view);
    offset += ret.written;
    ptr = realloc(ptr, len, offset, 1) >>> 0;
  }
  WASM_VECTOR_LEN = offset;
  return ptr;
}
function takeFromExternrefTable0(idx) {
  const value = wasm.__wbindgen_externrefs.get(idx);
  wasm.__externref_table_dealloc(idx);
  return value;
}
var cachedTextDecoder = new TextDecoder("utf-8", { ignoreBOM: true, fatal: true });
cachedTextDecoder.decode();
var MAX_SAFARI_DECODE_BYTES = 2146435072;
var numBytesDecoded = 0;
function decodeText(ptr, len) {
  numBytesDecoded += len;
  if (numBytesDecoded >= MAX_SAFARI_DECODE_BYTES) {
    cachedTextDecoder = new TextDecoder("utf-8", { ignoreBOM: true, fatal: true });
    cachedTextDecoder.decode();
    numBytesDecoded = len;
  }
  return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
}
var cachedTextEncoder = new TextEncoder();
if (!("encodeInto" in cachedTextEncoder)) {
  cachedTextEncoder.encodeInto = function(arg, view) {
    const buf = cachedTextEncoder.encode(arg);
    view.set(buf);
    return {
      read: arg.length,
      written: buf.length
    };
  };
}
var WASM_VECTOR_LEN = 0;
var wasmModule;
var wasm;
function __wbg_finalize_init(instance, module) {
  wasm = instance.exports;
  wasmModule = module;
  cachedUint8ArrayMemory0 = null;
  wasm.__wbindgen_start();
  return wasm;
}
async function __wbg_load(module, imports) {
  if (typeof Response === "function" && module instanceof Response) {
    if (typeof WebAssembly.instantiateStreaming === "function") {
      try {
        return await WebAssembly.instantiateStreaming(module, imports);
      } catch (e) {
        const validResponse = module.ok && expectedResponseType(module.type);
        if (validResponse && module.headers.get("Content-Type") !== "application/wasm") {
          console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve Wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);
        } else {
          throw e;
        }
      }
    }
    const bytes = await module.arrayBuffer();
    return await WebAssembly.instantiate(bytes, imports);
  } else {
    const instance = await WebAssembly.instantiate(module, imports);
    if (instance instanceof WebAssembly.Instance) {
      return { instance, module };
    } else {
      return instance;
    }
  }
  function expectedResponseType(type) {
    switch (type) {
      case "basic":
      case "cors":
      case "default":
        return true;
    }
    return false;
  }
}
async function __wbg_init(module_or_path) {
  if (wasm !== void 0) return wasm;
  if (module_or_path !== void 0) {
    if (Object.getPrototypeOf(module_or_path) === Object.prototype) {
      ({ module_or_path } = module_or_path);
    } else {
      console.warn("using deprecated parameters for the initialization function; pass a single object instead");
    }
  }
  if (module_or_path === void 0) {
    module_or_path = new URL("lpdf_bg.wasm", import.meta.url);
  }
  const imports = __wbg_get_imports();
  if (typeof module_or_path === "string" || typeof Request === "function" && module_or_path instanceof Request || typeof URL === "function" && module_or_path instanceof URL) {
    module_or_path = fetch(module_or_path);
  }
  const { instance, module } = await __wbg_load(await module_or_path, imports);
  return __wbg_finalize_init(instance, module);
}

// src/_shared.ts
var DEFAULT_MAX_MEMORY_MB = 1024;
var MAX_MEMORY_MB = 4096;
function maxMemoryMb(value) {
  if (value === void 0) return DEFAULT_MAX_MEMORY_MB;
  if (!Number.isInteger(value) || value < 1 || value > MAX_MEMORY_MB) {
    throw new RangeError(`maxMemoryMb must be a whole number of megabytes from 1 to ${MAX_MEMORY_MB}, not ${value}`);
  }
  return value;
}
var ENTROPY_BYTES = 32;
function encryptionArguments(options, randomBytes) {
  const hasPassword = options.userPassword !== void 0 || options.ownerPassword !== void 0;
  return [
    options.userPassword ?? null,
    options.ownerPassword ?? null,
    options.skipEncryption ?? false,
    hasPassword ? randomBytes(ENTROPY_BYTES) : new Uint8Array(0)
  ];
}

// src/render-error.ts
var LpdfRenderError = class extends Error {
  constructor(message, cause) {
    super(message);
    this.name = "LpdfRenderError";
    if (cause !== void 0) this.cause = cause;
  }
};

// src/render-queue.ts
var DEFAULT_TIMEOUT = 5;
var MAX_DELAY_MS = 2 ** 31 - 1;
function renderTimeout(timeout) {
  if (timeout === void 0) return DEFAULT_TIMEOUT;
  if (!Number.isFinite(timeout) || timeout < 0) {
    throw new RangeError(`timeout must be a number of seconds, 0 for no limit, not ${timeout}`);
  }
  return timeout;
}
function seconds(count) {
  return count === 1 ? "1 second" : `${count} seconds`;
}
var RenderQueue = class {
  constructor(_start) {
    this._start = _start;
    this._waiting = [];
  }
  /**
   * Renders `job` once the renders before it have ended. Its timeout counts from when it starts.
   *
   * @param timeout - The seconds it may run, 0 for no limit.
   * @returns The PDF; rejects with an `LpdfRenderError` when the engine refuses the document or the render runs
   *   past its timeout.
   */
  render(job, timeout) {
    return new Promise((resolve, reject) => {
      this._waiting.push({ job, timeout, resolve, reject });
      this._next();
    });
  }
  _next() {
    if (this._running) return;
    const pending = this._waiting.shift();
    if (!pending) {
      this._worker?.hold?.(false);
      return;
    }
    this._running = pending;
    try {
      const worker = this._worker ??= this._startWorker();
      worker.hold?.(true);
      if (pending.timeout > 0) {
        pending.timer = setTimeout(() => this._timedOut(pending), Math.min(pending.timeout * 1e3, MAX_DELAY_MS));
      }
      worker.post(pending.job);
    } catch (e) {
      this._dropWorker();
      this._settle({ error: `The render worker failed: ${e instanceof Error ? e.message : String(e)}`, broken: true });
    }
  }
  _startWorker() {
    const worker = this._start({
      replied: (reply) => {
        if (worker !== this._worker) return;
        if ("error" in reply && reply.broken) this._dropWorker();
        this._settle(reply);
      },
      failed: (message) => {
        if (worker !== this._worker) return;
        this._dropWorker();
        this._settle({ error: message, broken: true });
      }
    });
    return worker;
  }
  _dropWorker() {
    this._worker?.terminate();
    this._worker = void 0;
  }
  _settle(reply) {
    const pending = this._running;
    if (!pending) return;
    this._running = void 0;
    clearTimeout(pending.timer);
    if ("pdf" in reply) {
      pending.resolve(reply.pdf);
    } else {
      pending.reject(new LpdfRenderError(reply.error, reply.cause));
    }
    this._next();
  }
  _timedOut(pending) {
    if (pending !== this._running) return;
    this._dropWorker();
    this._settle({ error: `The render timed out after ${seconds(pending.timeout)}.`, broken: true });
  }
};

// src/stamp.ts
function stampRequest(stamps) {
  const images = /* @__PURE__ */ new Map();
  const names = /* @__PURE__ */ new Map();
  const list = stamps.map(({ image, maxGrow, ...rest }, i) => {
    if (!(image instanceof Uint8Array)) {
      throw new TypeError(`stamp ${i + 1}: image must be the PNG's bytes, a Uint8Array`);
    }
    let name = names.get(image);
    if (name === void 0) {
      name = `stamp-${names.size}`;
      names.set(image, name);
      images.set(name, image);
    }
    return { ...rest, image: name, ...maxGrow === void 0 ? {} : { "max-grow": maxGrow } };
  });
  return { stamps: JSON.stringify(list), images };
}

// src/constants.ts
var FieldType = {
  Text: "text",
  Checkbox: "checkbox",
  Dropdown: "dropdown",
  Radio: "radio",
  Button: "button"
};
var Pin = {
  Top: "top",
  Bottom: "bottom",
  Left: "left",
  Right: "right",
  Inset: "inset"
};
var Orientation = {
  Portrait: "portrait",
  Landscape: "landscape"
};
var SectionType = {
  Toc: "toc"
};
var FootnoteCounter = {
  Page: "page",
  Section: "section",
  Document: "document"
};
var ColumnFill = {
  Auto: "auto",
  Balance: "balance"
};
var Cipher = {
  Aes256: "aes-256",
  Rc4128: "rc4-128"
};
var Permission = {
  All: "all",
  Print: "print",
  Modify: "modify",
  Copy: "copy",
  Annotate: "annotate",
  FillForms: "fill-forms",
  Accessibility: "accessibility",
  Assemble: "assemble"
};
var FileRelationship = {
  Source: "source",
  Data: "data",
  Alternative: "alternative",
  Supplement: "supplement",
  Unspecified: "unspecified"
};
var BuiltinFont = {
  Courier: "Courier",
  CourierBold: "Courier-Bold",
  CourierOblique: "Courier-Oblique",
  CourierBoldOblique: "Courier-BoldOblique",
  Helvetica: "Helvetica",
  HelveticaBold: "Helvetica-Bold",
  HelveticaOblique: "Helvetica-Oblique",
  HelveticaBoldOblique: "Helvetica-BoldOblique",
  TimesRoman: "Times-Roman",
  TimesBold: "Times-Bold",
  TimesItalic: "Times-Italic",
  TimesBoldItalic: "Times-BoldItalic",
  Symbol: "Symbol",
  ZapfDingbats: "ZapfDingbats"
};
var PageScope = {
  Each: "each",
  First: "first",
  Last: "last",
  Odd: "odd",
  Even: "even"
};

// src/browser.ts
var NoAttr = null;
function nowUnix() {
  return BigInt(Math.floor(Date.now() / 1e3));
}
function secureRandomBytes(count) {
  return crypto.getRandomValues(new Uint8Array(count));
}
async function compileEngine(source) {
  if (source instanceof WebAssembly.Module) return source;
  const from = source ?? new URL("lpdf_bg.wasm", import.meta.url);
  if (typeof from === "string" || from instanceof URL || from instanceof Request) {
    return compileResponse(await fetch(from));
  }
  if (from instanceof Response) return compileResponse(from);
  return WebAssembly.compile(from);
}
async function compileResponse(response) {
  if (!response.ok) {
    throw new Error(`The engine could not be loaded from ${response.url}: ${response.status} ${response.statusText}`);
  }
  if (response.headers.get("Content-Type")?.startsWith("application/wasm")) {
    return WebAssembly.compileStreaming(response);
  }
  return WebAssembly.compile(await response.arrayBuffer());
}
var renderWorkerUrl;
function startBrowserWorker(module, events) {
  renderWorkerUrl ??= URL.createObjectURL(new Blob(['"use strict";\n(() => {\n  // wasm/lpdf-web.js\n  var import_meta = {};\n  var LpdfEngine = class {\n    __destroy_into_raw() {\n      const ptr = this.__wbg_ptr;\n      this.__wbg_ptr = 0;\n      LpdfEngineFinalization.unregister(this);\n      return ptr;\n    }\n    free() {\n      const ptr = this.__destroy_into_raw();\n      wasm.__wbg_lpdfengine_free(ptr, 0);\n    }\n    /**\n     * Register the bytes of a file a document carries, for the `<file>` of its `<attachments>` whose `ref`, or with\n     * no ref whose name, is `name`. The PDF carries them as they are.\n     * @param {string} name\n     * @param {Uint8Array} bytes\n     */\n    load_file(name, bytes) {\n      const ptr0 = passStringToWasm0(name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);\n      const len0 = WASM_VECTOR_LEN;\n      const ptr1 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);\n      const len1 = WASM_VECTOR_LEN;\n      wasm.lpdfengine_load_file(this.__wbg_ptr, ptr0, len0, ptr1, len1);\n    }\n    /**\n     * Register raw font bytes (TTF/OTF) for a custom font name.\n     * Call this once per font before calling `render_pdf`.\n     * Glyph advance-width metrics are extracted automatically from the font\n     * bytes so the layout engine can measure text accurately \u2014 no separate\n     * `set_font_metrics` call is required.\n     * @param {string} name\n     * @param {Uint8Array} bytes\n     */\n    load_font(name, bytes) {\n      const ptr0 = passStringToWasm0(name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);\n      const len0 = WASM_VECTOR_LEN;\n      const ptr1 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);\n      const len1 = WASM_VECTOR_LEN;\n      wasm.lpdfengine_load_font(this.__wbg_ptr, ptr0, len0, ptr1, len1);\n    }\n    /**\n     * Register raw image bytes (JPEG or PNG) for an image name.\n     * Call this for every image referenced by `<img name="\u2026">` nodes.\n     * @param {string} name\n     * @param {Uint8Array} bytes\n     */\n    load_image(name, bytes) {\n      const ptr0 = passStringToWasm0(name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);\n      const len0 = WASM_VECTOR_LEN;\n      const ptr1 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);\n      const len1 = WASM_VECTOR_LEN;\n      wasm.lpdfengine_load_image(this.__wbg_ptr, ptr0, len0, ptr1, len1);\n    }\n    /**\n     * Register the text of a file of Markdown rules, the root of which is a `<markdown-styles>`, for the\n     * `src` that names it. The engine reads no files: call this once for every `<markdown-styles src="\u2026">`\n     * of the document before `render_pdf`, as `load_font` is called for a font.\n     * @param {string} src\n     * @param {string} xml\n     */\n    load_markdown_styles(src, xml) {\n      const ptr0 = passStringToWasm0(src, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);\n      const len0 = WASM_VECTOR_LEN;\n      const ptr1 = passStringToWasm0(xml, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);\n      const len1 = WASM_VECTOR_LEN;\n      wasm.lpdfengine_load_markdown_styles(this.__wbg_ptr, ptr0, len0, ptr1, len1);\n    }\n    /**\n     * Register the bytes of an ICC colour profile, for the `<profile>` of a document\'s `<assets>` whose `ref`, or with\n     * no ref whose name, is `name`: the press profile a PDF/X document names in `<output profile>`.\n     * @param {string} name\n     * @param {Uint8Array} bytes\n     */\n    load_profile(name, bytes) {\n      const ptr0 = passStringToWasm0(name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);\n      const len0 = WASM_VECTOR_LEN;\n      const ptr1 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);\n      const len1 = WASM_VECTOR_LEN;\n      wasm.lpdfengine_load_profile(this.__wbg_ptr, ptr0, len0, ptr1, len1);\n    }\n    /**\n     * @param {string} license_key\n     */\n    constructor(license_key) {\n      const ptr0 = passStringToWasm0(license_key, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);\n      const len0 = WASM_VECTOR_LEN;\n      const ret = wasm.lpdfengine_new(ptr0, len0);\n      this.__wbg_ptr = ret >>> 0;\n      LpdfEngineFinalization.register(this, this.__wbg_ptr, this);\n      return this;\n    }\n    /**\n     * @param {string} xml\n     * @returns {string}\n     */\n    render(xml) {\n      let deferred2_0;\n      let deferred2_1;\n      try {\n        const ptr0 = passStringToWasm0(xml, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);\n        const len0 = WASM_VECTOR_LEN;\n        const ret = wasm.lpdfengine_render(this.__wbg_ptr, ptr0, len0);\n        deferred2_0 = ret[0];\n        deferred2_1 = ret[1];\n        return getStringFromWasm0(ret[0], ret[1]);\n      } finally {\n        wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);\n      }\n    }\n    /**\n     * Render `xml` to binary PDF bytes.\n     *\n     * Any custom fonts referenced in `<font src="\u2026">` declarations must have\n     * their bytes registered via `load_font` before calling this method.\n     *\n     * `json_data` is an optional JSON string used to resolve `data-*`\n     * attributes in the template.  Pass `None` (or `null` / `undefined` from\n     * JavaScript) to render the template with its inline fallback content.\n     *\n     * The rest is for a document that asks for encryption in its `<output>`, which sets the cipher and\n     * the permissions: the passwords, which the template never holds, and `entropy`, at least 32 random\n     * bytes from the host\'s secure generator for AES-256. A document that asks for encryption needs an\n     * owner password, or `skip_encryption` to render it unencrypted, as a preview does; passwords for a\n     * document that doesn\'t ask for it are an error, and so are passwords with `skip_encryption`.\n     * @param {string} xml\n     * @param {string | null | undefined} json_data\n     * @param {string | null | undefined} user_password\n     * @param {string | null | undefined} owner_password\n     * @param {boolean} skip_encryption\n     * @param {Uint8Array} entropy\n     * @returns {Uint8Array}\n     */\n    render_pdf(xml, json_data, user_password, owner_password, skip_encryption, entropy) {\n      const ptr0 = passStringToWasm0(xml, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);\n      const len0 = WASM_VECTOR_LEN;\n      var ptr1 = isLikeNone(json_data) ? 0 : passStringToWasm0(json_data, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);\n      var len1 = WASM_VECTOR_LEN;\n      var ptr2 = isLikeNone(user_password) ? 0 : passStringToWasm0(user_password, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);\n      var len2 = WASM_VECTOR_LEN;\n      var ptr3 = isLikeNone(owner_password) ? 0 : passStringToWasm0(owner_password, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);\n      var len3 = WASM_VECTOR_LEN;\n      const ptr4 = passArray8ToWasm0(entropy, wasm.__wbindgen_malloc);\n      const len4 = WASM_VECTOR_LEN;\n      const ret = wasm.lpdfengine_render_pdf(this.__wbg_ptr, ptr0, len0, ptr1, len1, ptr2, len2, ptr3, len3, skip_encryption, ptr4, len4);\n      if (ret[3]) {\n        throw takeFromExternrefTable0(ret[2]);\n      }\n      var v6 = getArrayU8FromWasm0(ret[0], ret[1]).slice();\n      wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);\n      return v6;\n    }\n    /**\n     * @param {string} json\n     * @returns {string}\n     */\n    render_tree(json) {\n      let deferred2_0;\n      let deferred2_1;\n      try {\n        const ptr0 = passStringToWasm0(json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);\n        const len0 = WASM_VECTOR_LEN;\n        const ret = wasm.lpdfengine_render_tree(this.__wbg_ptr, ptr0, len0);\n        deferred2_0 = ret[0];\n        deferred2_1 = ret[1];\n        return getStringFromWasm0(ret[0], ret[1]);\n      } finally {\n        wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);\n      }\n    }\n    /**\n     * Render a JSON kit-tree document to PDF bytes.\n     *\n     * This is the JSON counterpart of `render_pdf`. The Node adapter uses it\n     * when an `LpdfDocument` Kit tree is passed to `renderPdf()`, avoiding an\n     * intermediate XML serialisation step. PHP, Python, and .NET adapters also\n     * use this entry point.\n     *\n     * The passwords, `skip_encryption` and `entropy` are those of `render_pdf`, for a document whose\n     * `output` asks for encryption.\n     * @param {string} json\n     * @param {string | null | undefined} user_password\n     * @param {string | null | undefined} owner_password\n     * @param {boolean} skip_encryption\n     * @param {Uint8Array} entropy\n     * @returns {Uint8Array}\n     */\n    render_tree_pdf(json, user_password, owner_password, skip_encryption, entropy) {\n      const ptr0 = passStringToWasm0(json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);\n      const len0 = WASM_VECTOR_LEN;\n      var ptr1 = isLikeNone(user_password) ? 0 : passStringToWasm0(user_password, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);\n      var len1 = WASM_VECTOR_LEN;\n      var ptr2 = isLikeNone(owner_password) ? 0 : passStringToWasm0(owner_password, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);\n      var len2 = WASM_VECTOR_LEN;\n      const ptr3 = passArray8ToWasm0(entropy, wasm.__wbindgen_malloc);\n      const len3 = WASM_VECTOR_LEN;\n      const ret = wasm.lpdfengine_render_tree_pdf(this.__wbg_ptr, ptr0, len0, ptr1, len1, ptr2, len2, skip_encryption, ptr3, len3);\n      if (ret[3]) {\n        throw takeFromExternrefTable0(ret[2]);\n      }\n      var v5 = getArrayU8FromWasm0(ret[0], ret[1]).slice();\n      wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);\n      return v5;\n    }\n    /**\n     * Set an optional ISO 8601 creation timestamp (e.g. `"2024-06-01T12:00:00"`, `"2024-06-01T12:00:00.000Z"` or\n     * `"2024-06-01T12:00:00+01:00"`). When provided, written as `/CreationDate` in the PDF info dictionary, with\n     * the precision and the time zone it was given in; a value that is not a date makes the render an error.\n     * Omitting this keeps builds reproducible (no embedded timestamp).\n     * @param {string} iso\n     */\n    set_created_on(iso) {\n      const ptr0 = passStringToWasm0(iso, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);\n      const len0 = WASM_VECTOR_LEN;\n      wasm.lpdfengine_set_created_on(this.__wbg_ptr, ptr0, len0);\n    }\n    /**\n     * Inject glyph advance-width tables for custom fonts.\n     *\n     * Call this *before* `render_pdf` / `render` when the document uses custom\n     * fonts (declared via `<font src="\u2026"`). The adapter extracts these widths\n     * from the font binary and passes them as a JSON object:\n     *\n     * ```json\n     * { "fontName": { "default": 500, "ascii": [260, 285, \u2026] } }\n     * ```\n     *\n     * `ascii` is a 95-element array for code points 32\u2013126. `default` is used\n     * for code points outside that range. All values are in 1/1000 em units.\n     * @param {string} json\n     */\n    set_font_metrics(json) {\n      const ptr0 = passStringToWasm0(json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);\n      const len0 = WASM_VECTOR_LEN;\n      wasm.lpdfengine_set_font_metrics(this.__wbg_ptr, ptr0, len0);\n    }\n    /**\n     * Set the memory a render may allocate, in megabytes: 1024 when it isn\'t set. A render that needs more stops\n     * with an error that names the cap. What the engine holds before the render, such as its loaded fonts, doesn\'t\n     * count.\n     *\n     * Returns an error when `mb` is 0 or above 4096, the most 32-bit WebAssembly addresses.\n     * @param {number} mb\n     */\n    set_max_memory_mb(mb) {\n      const ret = wasm.lpdfengine_set_max_memory_mb(this.__wbg_ptr, mb);\n      if (ret[1]) {\n        throw takeFromExternrefTable0(ret[0]);\n      }\n    }\n    /**\n     * Set the current Unix timestamp (seconds) for license expiry checking.\n     * Must be called before `render_pdf` when using a time-limited token.\n     * If not set (default `0`), expiry is not checked.\n     * @param {bigint} unix\n     */\n    set_now(unix) {\n      wasm.lpdfengine_set_now(this.__wbg_ptr, unix);\n    }\n    /**\n     * Draw PNG stamps over the pages of an existing PDF, and return the file with them added as an incremental\n     * update: the input, byte for byte, then the images and the pages they change. The original bytes stay as they\n     * were, so an owner password and its permissions stay, and so does a digital signature\'s revision.\n     *\n     * `stamps` is a JSON list of stamps, each with an `image`, the name of a PNG loaded with `load_image`, a `page`\n     * scope, a box (`x`, `y`, `anchor`, `width`, `height`, placed as a layer element is) and how the image sits in it\n     * (`align`, `justify`, `scale`, `max-grow`). Without a valid license key, each stamped page gets the attribution\n     * line of a render in its top-right corner.\n     * @param {Uint8Array} pdf\n     * @param {string} stamps\n     * @returns {Uint8Array}\n     */\n    stamp(pdf, stamps) {\n      const ptr0 = passArray8ToWasm0(pdf, wasm.__wbindgen_malloc);\n      const len0 = WASM_VECTOR_LEN;\n      const ptr1 = passStringToWasm0(stamps, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);\n      const len1 = WASM_VECTOR_LEN;\n      const ret = wasm.lpdfengine_stamp(this.__wbg_ptr, ptr0, len0, ptr1, len1);\n      if (ret[3]) {\n        throw takeFromExternrefTable0(ret[2]);\n      }\n      var v3 = getArrayU8FromWasm0(ret[0], ret[1]).slice();\n      wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);\n      return v3;\n    }\n  };\n  if (Symbol.dispose) LpdfEngine.prototype[Symbol.dispose] = LpdfEngine.prototype.free;\n  function __wbg_get_imports() {\n    const import0 = {\n      __proto__: null,\n      __wbg___wbindgen_throw_6b64449b9b9ed33c: function(arg0, arg1) {\n        throw new Error(getStringFromWasm0(arg0, arg1));\n      },\n      __wbg_getRandomValues_cc7f052a444bb2ce: function() {\n        return handleError(function(arg0, arg1) {\n          globalThis.crypto.getRandomValues(getArrayU8FromWasm0(arg0, arg1));\n        }, arguments);\n      },\n      __wbindgen_cast_0000000000000001: function(arg0, arg1) {\n        const ret = getStringFromWasm0(arg0, arg1);\n        return ret;\n      },\n      __wbindgen_init_externref_table: function() {\n        const table = wasm.__wbindgen_externrefs;\n        const offset = table.grow(4);\n        table.set(0, void 0);\n        table.set(offset + 0, void 0);\n        table.set(offset + 1, null);\n        table.set(offset + 2, true);\n        table.set(offset + 3, false);\n      }\n    };\n    return {\n      __proto__: null,\n      "./lpdf_bg.js": import0\n    };\n  }\n  var LpdfEngineFinalization = typeof FinalizationRegistry === "undefined" ? { register: () => {\n  }, unregister: () => {\n  } } : new FinalizationRegistry((ptr) => wasm.__wbg_lpdfengine_free(ptr >>> 0, 1));\n  function addToExternrefTable0(obj) {\n    const idx = wasm.__externref_table_alloc();\n    wasm.__wbindgen_externrefs.set(idx, obj);\n    return idx;\n  }\n  function getArrayU8FromWasm0(ptr, len) {\n    ptr = ptr >>> 0;\n    return getUint8ArrayMemory0().subarray(ptr / 1, ptr / 1 + len);\n  }\n  function getStringFromWasm0(ptr, len) {\n    ptr = ptr >>> 0;\n    return decodeText(ptr, len);\n  }\n  var cachedUint8ArrayMemory0 = null;\n  function getUint8ArrayMemory0() {\n    if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {\n      cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);\n    }\n    return cachedUint8ArrayMemory0;\n  }\n  function handleError(f, args) {\n    try {\n      return f.apply(this, args);\n    } catch (e) {\n      const idx = addToExternrefTable0(e);\n      wasm.__wbindgen_exn_store(idx);\n    }\n  }\n  function isLikeNone(x) {\n    return x === void 0 || x === null;\n  }\n  function passArray8ToWasm0(arg, malloc) {\n    const ptr = malloc(arg.length * 1, 1) >>> 0;\n    getUint8ArrayMemory0().set(arg, ptr / 1);\n    WASM_VECTOR_LEN = arg.length;\n    return ptr;\n  }\n  function passStringToWasm0(arg, malloc, realloc) {\n    if (realloc === void 0) {\n      const buf = cachedTextEncoder.encode(arg);\n      const ptr2 = malloc(buf.length, 1) >>> 0;\n      getUint8ArrayMemory0().subarray(ptr2, ptr2 + buf.length).set(buf);\n      WASM_VECTOR_LEN = buf.length;\n      return ptr2;\n    }\n    let len = arg.length;\n    let ptr = malloc(len, 1) >>> 0;\n    const mem = getUint8ArrayMemory0();\n    let offset = 0;\n    for (; offset < len; offset++) {\n      const code = arg.charCodeAt(offset);\n      if (code > 127) break;\n      mem[ptr + offset] = code;\n    }\n    if (offset !== len) {\n      if (offset !== 0) {\n        arg = arg.slice(offset);\n      }\n      ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;\n      const view = getUint8ArrayMemory0().subarray(ptr + offset, ptr + len);\n      const ret = cachedTextEncoder.encodeInto(arg, view);\n      offset += ret.written;\n      ptr = realloc(ptr, len, offset, 1) >>> 0;\n    }\n    WASM_VECTOR_LEN = offset;\n    return ptr;\n  }\n  function takeFromExternrefTable0(idx) {\n    const value = wasm.__wbindgen_externrefs.get(idx);\n    wasm.__externref_table_dealloc(idx);\n    return value;\n  }\n  var cachedTextDecoder = new TextDecoder("utf-8", { ignoreBOM: true, fatal: true });\n  cachedTextDecoder.decode();\n  var MAX_SAFARI_DECODE_BYTES = 2146435072;\n  var numBytesDecoded = 0;\n  function decodeText(ptr, len) {\n    numBytesDecoded += len;\n    if (numBytesDecoded >= MAX_SAFARI_DECODE_BYTES) {\n      cachedTextDecoder = new TextDecoder("utf-8", { ignoreBOM: true, fatal: true });\n      cachedTextDecoder.decode();\n      numBytesDecoded = len;\n    }\n    return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));\n  }\n  var cachedTextEncoder = new TextEncoder();\n  if (!("encodeInto" in cachedTextEncoder)) {\n    cachedTextEncoder.encodeInto = function(arg, view) {\n      const buf = cachedTextEncoder.encode(arg);\n      view.set(buf);\n      return {\n        read: arg.length,\n        written: buf.length\n      };\n    };\n  }\n  var WASM_VECTOR_LEN = 0;\n  var wasmModule;\n  var wasm;\n  function __wbg_finalize_init(instance, module) {\n    wasm = instance.exports;\n    wasmModule = module;\n    cachedUint8ArrayMemory0 = null;\n    wasm.__wbindgen_start();\n    return wasm;\n  }\n  async function __wbg_load(module, imports) {\n    if (typeof Response === "function" && module instanceof Response) {\n      if (typeof WebAssembly.instantiateStreaming === "function") {\n        try {\n          return await WebAssembly.instantiateStreaming(module, imports);\n        } catch (e) {\n          const validResponse = module.ok && expectedResponseType(module.type);\n          if (validResponse && module.headers.get("Content-Type") !== "application/wasm") {\n            console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve Wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\\n", e);\n          } else {\n            throw e;\n          }\n        }\n      }\n      const bytes = await module.arrayBuffer();\n      return await WebAssembly.instantiate(bytes, imports);\n    } else {\n      const instance = await WebAssembly.instantiate(module, imports);\n      if (instance instanceof WebAssembly.Instance) {\n        return { instance, module };\n      } else {\n        return instance;\n      }\n    }\n    function expectedResponseType(type) {\n      switch (type) {\n        case "basic":\n        case "cors":\n        case "default":\n          return true;\n      }\n      return false;\n    }\n  }\n  async function __wbg_init(module_or_path) {\n    if (wasm !== void 0) return wasm;\n    if (module_or_path !== void 0) {\n      if (Object.getPrototypeOf(module_or_path) === Object.prototype) {\n        ({ module_or_path } = module_or_path);\n      } else {\n        console.warn("using deprecated parameters for the initialization function; pass a single object instead");\n      }\n    }\n    if (module_or_path === void 0) {\n      module_or_path = new URL("lpdf_bg.wasm", import_meta.url);\n    }\n    const imports = __wbg_get_imports();\n    if (typeof module_or_path === "string" || typeof Request === "function" && module_or_path instanceof Request || typeof URL === "function" && module_or_path instanceof URL) {\n      module_or_path = fetch(module_or_path);\n    }\n    const { instance, module } = await __wbg_load(await module_or_path, imports);\n    return __wbg_finalize_init(instance, module);\n  }\n\n  // src/render-error.ts\n  var ENGINE_CRASHED = "The engine crashed during the render. This is a bug in Lpdf, or the render ran out of memory before its cap stopped it: please report it with the document at https://github.com/lpdfio/lpdf/issues.";\n\n  // src/render-job.ts\n  function runRenderJob(createEngine, job) {\n    let engine;\n    let reply;\n    try {\n      engine = createEngine(job.licenseKey);\n      engine.set_now(job.now);\n      engine.set_max_memory_mb(job.maxMemoryMb);\n      if (job.createdOn) engine.set_created_on(job.createdOn);\n      for (const [name, bytes] of job.fonts) engine.load_font(name, bytes);\n      for (const [name, bytes] of job.images) engine.load_image(name, bytes);\n      for (const [name, bytes] of job.files) engine.load_file(name, bytes);\n      for (const [name, bytes] of job.profiles) engine.load_profile(name, bytes);\n      for (const [src, text] of job.markdownStyles) engine.load_markdown_styles(src, text);\n      const { document } = job;\n      const pdf = "xml" in document ? engine.render_pdf(document.xml, document.data, ...job.encryption) : "tree" in document ? engine.render_tree_pdf(document.tree, ...job.encryption) : engine.stamp(document.pdf, document.stamps);\n      reply = { pdf };\n    } catch (e) {\n      const crashed = e instanceof WebAssembly.RuntimeError || e instanceof RangeError;\n      reply = crashed ? { error: ENGINE_CRASHED, broken: true, cause: `${e.name}: ${e.message}` } : { error: e instanceof Error ? e.message : String(e), broken: false };\n    }\n    if ("pdf" in reply || !reply.broken) {\n      try {\n        engine?.free();\n      } catch {\n        if ("error" in reply) reply = { ...reply, broken: true };\n      }\n    }\n    return reply;\n  }\n  function transferList(reply) {\n    if (!("pdf" in reply)) return [];\n    const { buffer, byteLength } = reply.pdf;\n    return buffer instanceof ArrayBuffer && buffer.byteLength === byteLength ? [buffer] : [];\n  }\n\n  // src/browser-worker.ts\n  var ready;\n  self.onmessage = async (event) => {\n    const message = event.data;\n    if ("module" in message) {\n      const loading = __wbg_init({ module_or_path: message.module });\n      loading.catch(() => void 0);\n      ready = loading;\n      return;\n    }\n    let reply;\n    try {\n      if (!ready) throw new Error("the worker was sent no engine");\n      await ready;\n    } catch (e) {\n      reply = { error: `The engine did not load: ${e instanceof Error ? e.message : String(e)}`, broken: true };\n      self.postMessage(reply);\n      return;\n    }\n    try {\n      reply = runRenderJob((licenseKey) => new LpdfEngine(licenseKey), message);\n    } catch (e) {\n      reply = { error: e instanceof Error ? e.message : String(e), broken: true };\n    }\n    self.postMessage(reply, { transfer: transferList(reply) });\n  };\n})();\n'], { type: "text/javascript" }));
  const worker = new Worker(renderWorkerUrl, { name: "lpdf-render" });
  worker.onmessage = (event) => events.replied(event.data);
  worker.onerror = (event) => {
    event.preventDefault();
    events.failed(
      `The render worker failed${event.message ? `: ${event.message}` : ""}. A page with a Content-Security-Policy must allow blob: in worker-src for it.`
    );
  };
  worker.onmessageerror = () => events.failed("A reply of the render worker could not be read.");
  worker.postMessage({ module });
  return {
    post: (job) => worker.postMessage(job),
    terminate: () => worker.terminate()
  };
}
async function initLpdf(wasmSource, licenseKey = "", options = {}) {
  const timeout = renderTimeout(options.timeout);
  const memory = maxMemoryMb(options.maxMemoryMb);
  const module = await compileEngine(wasmSource);
  await __wbg_init({ module_or_path: module });
  const queue = new RenderQueue((events) => startBrowserWorker(module, events));
  const fontMap = /* @__PURE__ */ new Map();
  const imageMap = /* @__PURE__ */ new Map();
  const fileMap = /* @__PURE__ */ new Map();
  const profileMap = /* @__PURE__ */ new Map();
  const markdownStyles = /* @__PURE__ */ new Map();
  return {
    loadFont(name, bytes) {
      fontMap.set(name, bytes);
    },
    loadImage(name, bytes) {
      imageMap.set(name, bytes);
    },
    loadFile(name, bytes) {
      fileMap.set(name, bytes);
    },
    loadProfile(name, bytes) {
      profileMap.set(name, bytes);
    },
    loadMarkdownStyles(src, text) {
      markdownStyles.set(src, text);
    },
    checkLicenseKey(key) {
      return JSON.parse(check_license(key ?? licenseKey, nowUnix()));
    },
    async render(input, callOptions = {}) {
      const job = {
        licenseKey,
        now: nowUnix(),
        maxMemoryMb: memory,
        createdOn: callOptions.createdOn,
        fonts: new Map(fontMap),
        images: new Map(imageMap),
        files: new Map(fileMap),
        profiles: new Map(profileMap),
        markdownStyles: new Map(markdownStyles),
        document: typeof input === "string" ? { xml: input, data: callOptions.data != null ? JSON.stringify(callOptions.data) : null } : { tree: JSON.stringify(input) },
        encryption: encryptionArguments(callOptions, secureRandomBytes)
      };
      return queue.render(job, timeout);
    },
    async stamp(pdf, stamps) {
      const { stamps: json, images } = stampRequest(stamps);
      const job = {
        licenseKey,
        now: nowUnix(),
        maxMemoryMb: memory,
        createdOn: void 0,
        fonts: /* @__PURE__ */ new Map(),
        images,
        files: /* @__PURE__ */ new Map(),
        profiles: /* @__PURE__ */ new Map(),
        markdownStyles: /* @__PURE__ */ new Map(),
        document: { pdf, stamps: json },
        encryption: [null, null, false, new Uint8Array()]
      };
      return queue.render(job, timeout);
    }
  };
}
export {
  BuiltinFont,
  Cipher,
  ColumnFill,
  FieldType,
  FileRelationship,
  FootnoteCounter,
  LpdfRenderError,
  NoAttr,
  Orientation,
  PageScope,
  Permission,
  Pin,
  SectionType,
  initLpdf
};
