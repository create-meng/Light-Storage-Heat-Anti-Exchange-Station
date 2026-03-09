module.exports = {

"[project]/app/components/BatteryModuleWithPCM.tsx [app-ssr] (ecmascript)": (({ r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__ }) => (() => {
"use strict";

__turbopack_esm__({
    "BatteryClusterWithPCM": ()=>BatteryClusterWithPCM,
    "BatteryModuleWithPCM": ()=>BatteryModuleWithPCM,
    "LAYER_THICKNESS": ()=>LAYER_THICKNESS,
    "SmallBatteryModuleWithPCM": ()=>SmallBatteryModuleWithPCM,
    "default": ()=>__TURBOPACK__default__export__
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/server/future/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/server/future/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$776716bd$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__F__as__useFrame$3e$__ = __turbopack_import__("[project]/node_modules/@react-three/fiber/dist/events-776716bd.esm.js [app-ssr] (ecmascript) <export F as useFrame>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$RoundedBox$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/@react-three/drei/core/RoundedBox.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$facade$3e$__ = __turbopack_import__("[project]/node_modules/three/build/three.module.js [app-ssr] (ecmascript) <facade>");
"__TURBOPACK__ecmascript__hoisting__location__";
'use client';
;
;
;
;
;
const LAYER_THICKNESS = {
    battery: 0.68,
    siliconePad: 0.018,
    pcm1: 0.035,
    foil: 0.008,
    pcm2: 0.028,
    aerogel: 0.022,
    shell: 0.012,
    quickRelease: 0.0
};
// PCM着色器
const PCM_SHADER = {
    vertex: `
    varying vec3 vPos;
    varying vec3 vN;
    void main() {
      vPos = position;
      vN = normal;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
    fragment: `
    uniform float uTime;
    uniform float uMelt;
    uniform vec3 uBaseColor;
    uniform vec3 uHotColor;
    varying vec3 vPos;
    varying vec3 vN;

    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
    }

    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      float a = hash(i);
      float b = hash(i + vec2(1.0, 0.0));
      float c = hash(i + vec2(0.0, 1.0));
      float d = hash(i + vec2(1.0, 1.0));
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
    }

    void main() {
      vec2 uv = vPos.xy * 2.5;
      float n1 = noise(uv + vec2(uTime * 0.15, uTime * 0.1));
      float n2 = noise(uv * 2.0 - vec2(uTime * 0.2, uTime * 0.15));
      float n = n1 * 0.6 + n2 * 0.4;

      float wave = sin((uv.x + uv.y) * 6.0 + uTime * 2.5) * 0.05;
      float liquidMask = smoothstep(0.15, 0.85, uMelt + (n - 0.5) * 0.4 + wave);

      vec3 base = mix(uBaseColor, uHotColor, smoothstep(0.3, 1.0, uMelt));
      vec3 col = mix(uBaseColor, base, liquidMask);

      float fresnel = pow(1.0 - max(dot(normalize(vN), vec3(0.0, 0.0, 1.0)), 0.0), 2.5);
      float sheen = smoothstep(0.15, 1.0, fresnel) * (0.1 + 0.2 * liquidMask);
      col += vec3(sheen);

      float alpha = mix(0.65, 0.85, liquidMask);
      gl_FragColor = vec4(col, alpha);
    }
  `
};
function BatteryModuleWithPCM({ position = [
    0,
    0,
    0
], scale = 1, isFault = false, mode, temperature = 28, showDetails = true, onDoubleClick }) {
    // 计算相变状态
    const pcm1Melt = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        if (mode !== 'abnormal') return 0.12;
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$facade$3e$__.MathUtils.clamp((temperature - 28) / (55 - 28), 0, 1);
    }, [
        mode,
        temperature
    ]);
    const pcm2Melt = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        if (mode !== 'abnormal' || temperature < 55) return 0;
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$facade$3e$__.MathUtils.clamp((temperature - 55) / (120 - 55), 0, 1);
    }, [
        mode,
        temperature
    ]);
    // 状态灯颜色
    const statusColor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        if (!isFault) return {
            col: '#22c55e',
            emi: '#22c55e',
            intensity: 0.65
        };
        if (mode !== 'abnormal') return {
            col: '#22c55e',
            emi: '#22c55e',
            intensity: 0.65
        };
        const t = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$facade$3e$__.MathUtils.clamp((temperature - 45) / 55, 0, 1);
        const col = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$facade$3e$__.Color('#22c55e').lerp(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$facade$3e$__.Color('#f97316'), Math.min(1, t * 1.1)).lerp(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$facade$3e$__.Color('#ef4444'), Math.max(0, t - 0.25) / 0.75);
        return {
            col: `#${col.getHexString()}`,
            emi: `#${col.getHexString()}`,
            intensity: 0.45 + 0.75 * t
        };
    }, [
        isFault,
        mode,
        temperature
    ]);
    // PCM材质动画
    const pcm1MatRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const pcm2MatRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const timeRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(0);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$776716bd$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__F__as__useFrame$3e$__["useFrame"])((_, delta)=>{
        timeRef.current += delta;
        const t = timeRef.current;
        const pcm1TargetMelt = (()=>{
            if (mode === 'normal') {
                const base = 0.18;
                const amp = 0.12;
                return base + amp * (0.5 + 0.5 * Math.sin(t * 1.6));
            }
            return pcm1Melt;
        })();
        if (pcm1MatRef.current) {
            pcm1MatRef.current.uniforms.uTime.value = timeRef.current;
            pcm1MatRef.current.uniforms.uMelt.value = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$facade$3e$__.MathUtils.lerp(pcm1MatRef.current.uniforms.uMelt.value, pcm1TargetMelt, 1 - Math.pow(0.001, delta));
        }
        if (pcm2MatRef.current) {
            pcm2MatRef.current.uniforms.uTime.value = timeRef.current;
            pcm2MatRef.current.uniforms.uMelt.value = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$facade$3e$__.MathUtils.lerp(pcm2MatRef.current.uniforms.uMelt.value, pcm2Melt, 1 - Math.pow(0.001, delta));
        }
    });
    const layer = LAYER_THICKNESS;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
        position: position,
        scale: scale,
        onDoubleClick: onDoubleClick,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$RoundedBox$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RoundedBox"], {
                        args: [
                            layer.battery,
                            0.82,
                            0.44
                        ],
                        radius: 0.03,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                            color: "#cbd5e1",
                            emissive: "#94a3b8",
                            emissiveIntensity: 0.05,
                            transparent: true,
                            opacity: 0.42,
                            depthWrite: false,
                            metalness: 0.12,
                            roughness: 0.75
                        }, void 0, false, {
                            fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                            lineNumber: 170,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                        lineNumber: 169,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$RoundedBox$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RoundedBox"], {
                        args: [
                            layer.battery + 0.02,
                            0.84,
                            0.46
                        ],
                        radius: 0.032,
                        renderOrder: 10,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                            color: "#0f172a",
                            emissive: "#22d3ee",
                            emissiveIntensity: 0.06,
                            transparent: true,
                            opacity: 0.16,
                            depthWrite: false,
                            depthTest: false,
                            wireframe: true
                        }, void 0, false, {
                            fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                            lineNumber: 184,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                        lineNumber: 183,
                        columnNumber: 9
                    }, this),
                    [
                        -0.24,
                        -0.08,
                        0.08,
                        0.24
                    ].map((x, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$RoundedBox$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RoundedBox"], {
                            args: [
                                0.14,
                                0.72,
                                0.38
                            ],
                            position: [
                                x,
                                0,
                                0
                            ],
                            radius: 0.015,
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                                color: "#e2e8f0",
                                transparent: true,
                                opacity: showDetails ? 0.22 : 0.14,
                                depthWrite: false,
                                metalness: 0.05,
                                roughness: 0.85
                            }, void 0, false, {
                                fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                                lineNumber: 199,
                                columnNumber: 13
                            }, this)
                        }, `cell-${idx}`, false, {
                            fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                            lineNumber: 198,
                            columnNumber: 11
                        }, this)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$RoundedBox$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RoundedBox"], {
                        args: [
                            layer.battery - 0.02,
                            0.05,
                            0.42
                        ],
                        position: [
                            0,
                            0.42,
                            0
                        ],
                        radius: 0.02,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                            color: "#94a3b8",
                            transparent: true,
                            opacity: 0.25,
                            metalness: 0.35,
                            roughness: 0.5
                        }, void 0, false, {
                            fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                            lineNumber: 212,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                        lineNumber: 211,
                        columnNumber: 9
                    }, this),
                    showDetails && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
                        children: [
                            0.18,
                            -0.08
                        ].map((y, bandIdx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
                                position: [
                                    0,
                                    y,
                                    0
                                ],
                                renderOrder: 11,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$RoundedBox$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RoundedBox"], {
                                        args: [
                                            0.02,
                                            0.04,
                                            0.46
                                        ],
                                        position: [
                                            -(layer.battery / 2 + 0.01),
                                            0,
                                            0
                                        ],
                                        radius: 0.008,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                                            color: "#0ea5e9",
                                            emissive: "#22d3ee",
                                            emissiveIntensity: 0.35,
                                            transparent: true,
                                            opacity: 0.85,
                                            depthWrite: false,
                                            roughness: 0.25,
                                            metalness: 0.15
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                                            lineNumber: 228,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                                        lineNumber: 227,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$RoundedBox$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RoundedBox"], {
                                        args: [
                                            0.02,
                                            0.04,
                                            0.46
                                        ],
                                        position: [
                                            layer.battery / 2 + 0.01,
                                            0,
                                            0
                                        ],
                                        radius: 0.008,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                                            color: "#0ea5e9",
                                            emissive: "#22d3ee",
                                            emissiveIntensity: 0.35,
                                            transparent: true,
                                            opacity: 0.85,
                                            depthWrite: false,
                                            roughness: 0.25,
                                            metalness: 0.15
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                                            lineNumber: 241,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                                        lineNumber: 240,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$RoundedBox$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RoundedBox"], {
                                        args: [
                                            layer.battery + 0.06,
                                            0.04,
                                            0.02
                                        ],
                                        position: [
                                            0,
                                            0,
                                            0.44 / 2 + 0.01
                                        ],
                                        radius: 0.008,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                                            color: "#0ea5e9",
                                            emissive: "#22d3ee",
                                            emissiveIntensity: 0.35,
                                            transparent: true,
                                            opacity: 0.85,
                                            depthWrite: false,
                                            roughness: 0.25,
                                            metalness: 0.15
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                                            lineNumber: 254,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                                        lineNumber: 253,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$RoundedBox$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RoundedBox"], {
                                        args: [
                                            layer.battery + 0.06,
                                            0.04,
                                            0.02
                                        ],
                                        position: [
                                            0,
                                            0,
                                            -(0.44 / 2 + 0.01)
                                        ],
                                        radius: 0.008,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                                            color: "#0ea5e9",
                                            emissive: "#22d3ee",
                                            emissiveIntensity: 0.35,
                                            transparent: true,
                                            opacity: 0.85,
                                            depthWrite: false,
                                            roughness: 0.25,
                                            metalness: 0.15
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                                            lineNumber: 267,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                                        lineNumber: 266,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, `band-${bandIdx}`, true, {
                                fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                                lineNumber: 225,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                        lineNumber: 223,
                        columnNumber: 11
                    }, this),
                    showDetails && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$RoundedBox$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RoundedBox"], {
                        args: [
                            0.22,
                            0.06,
                            0.05
                        ],
                        position: [
                            0,
                            0.22,
                            -0.22
                        ],
                        radius: 0.015,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                            color: "#475569",
                            metalness: 0.7,
                            roughness: 0.4
                        }, void 0, false, {
                            fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                            lineNumber: 286,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                        lineNumber: 285,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$RoundedBox$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RoundedBox"], {
                        args: [
                            0.38,
                            0.01,
                            0.035
                        ],
                        position: [
                            0.16,
                            0.42,
                            -0.1
                        ],
                        radius: 0.005,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                            color: statusColor.col,
                            emissive: statusColor.emi,
                            emissiveIntensity: statusColor.intensity,
                            transparent: true,
                            opacity: 0.95
                        }, void 0, false, {
                            fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                            lineNumber: 292,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                        lineNumber: 291,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                lineNumber: 167,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$RoundedBox$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RoundedBox"], {
                args: [
                    layer.siliconePad,
                    0.78,
                    0.42
                ],
                position: [
                    -(layer.battery / 2 + layer.siliconePad / 2),
                    0,
                    0
                ],
                radius: 0.006,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                    color: "#c4b5fd",
                    emissive: "#a78bfa",
                    emissiveIntensity: 0.65,
                    transparent: true,
                    opacity: 0.93,
                    depthWrite: false,
                    roughness: 0.4,
                    metalness: 0.15
                }, void 0, false, {
                    fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                    lineNumber: 309,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                lineNumber: 304,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$RoundedBox$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RoundedBox"], {
                args: [
                    layer.siliconePad,
                    0.78,
                    0.42
                ],
                position: [
                    layer.battery / 2 + layer.siliconePad / 2,
                    0,
                    0
                ],
                radius: 0.006,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                    color: "#c4b5fd",
                    emissive: "#a78bfa",
                    emissiveIntensity: 0.65,
                    transparent: true,
                    opacity: 0.93,
                    depthWrite: false,
                    roughness: 0.4,
                    metalness: 0.15
                }, void 0, false, {
                    fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                    lineNumber: 326,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                lineNumber: 321,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$RoundedBox$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RoundedBox"], {
                args: [
                    layer.battery + layer.siliconePad * 2,
                    0.78,
                    layer.siliconePad
                ],
                position: [
                    0,
                    0,
                    0.44 / 2 + layer.siliconePad / 2
                ],
                radius: 0.005,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                    color: "#94a3b8",
                    emissive: "#94a3b8",
                    emissiveIntensity: 0.22,
                    transparent: true,
                    opacity: 0.88,
                    depthWrite: false,
                    roughness: 0.65,
                    metalness: 0.1
                }, void 0, false, {
                    fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                    lineNumber: 343,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                lineNumber: 338,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$RoundedBox$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RoundedBox"], {
                args: [
                    layer.battery + layer.siliconePad * 2,
                    0.78,
                    layer.siliconePad
                ],
                position: [
                    0,
                    0,
                    -(0.44 / 2 + layer.siliconePad / 2)
                ],
                radius: 0.005,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                    color: "#94a3b8",
                    emissive: "#94a3b8",
                    emissiveIntensity: 0.22,
                    transparent: true,
                    opacity: 0.88,
                    depthWrite: false,
                    roughness: 0.65,
                    metalness: 0.1
                }, void 0, false, {
                    fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                    lineNumber: 360,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                lineNumber: 355,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$RoundedBox$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RoundedBox"], {
                args: [
                    layer.pcm1,
                    0.76,
                    0.40
                ],
                position: [
                    -(layer.battery / 2 + layer.siliconePad + layer.pcm1 / 2),
                    0,
                    0
                ],
                radius: 0.012,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("shaderMaterial", {
                    ref: pcm1MatRef,
                    vertexShader: PCM_SHADER.vertex,
                    fragmentShader: PCM_SHADER.fragment,
                    transparent: true,
                    depthWrite: false,
                    side: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$facade$3e$__.DoubleSide,
                    uniforms: {
                        uTime: {
                            value: 0
                        },
                        uMelt: {
                            value: pcm1Melt
                        },
                        uBaseColor: {
                            value: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$facade$3e$__.Color('#06b6d4')
                        },
                        uHotColor: {
                            value: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$facade$3e$__.Color('#f97316')
                        }
                    }
                }, void 0, false, {
                    fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                    lineNumber: 379,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                lineNumber: 374,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$RoundedBox$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RoundedBox"], {
                args: [
                    layer.pcm1,
                    0.76,
                    0.40
                ],
                position: [
                    layer.battery / 2 + layer.siliconePad + layer.pcm1 / 2,
                    0,
                    0
                ],
                radius: 0.012,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("shaderMaterial", {
                    vertexShader: PCM_SHADER.vertex,
                    fragmentShader: PCM_SHADER.fragment,
                    transparent: true,
                    depthWrite: false,
                    side: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$facade$3e$__.DoubleSide,
                    uniforms: {
                        uTime: {
                            value: 0
                        },
                        uMelt: {
                            value: pcm1Melt
                        },
                        uBaseColor: {
                            value: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$facade$3e$__.Color('#06b6d4')
                        },
                        uHotColor: {
                            value: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$facade$3e$__.Color('#f97316')
                        }
                    }
                }, void 0, false, {
                    fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                    lineNumber: 400,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                lineNumber: 395,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$RoundedBox$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RoundedBox"], {
                args: [
                    layer.battery + (layer.siliconePad + layer.pcm1) * 2,
                    0.76,
                    layer.pcm1
                ],
                position: [
                    0,
                    0,
                    0.44 / 2 + layer.siliconePad + layer.pcm1 / 2
                ],
                radius: 0.008,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                    color: "#14b8a6",
                    emissive: "#22d3ee",
                    emissiveIntensity: mode === 'abnormal' ? 0.55 : 0.3,
                    transparent: true,
                    opacity: mode === 'abnormal' ? 0.85 : 0.68,
                    depthWrite: false,
                    roughness: 0.25,
                    metalness: 0.05
                }, void 0, false, {
                    fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                    lineNumber: 420,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                lineNumber: 415,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$RoundedBox$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RoundedBox"], {
                args: [
                    layer.battery + (layer.siliconePad + layer.pcm1) * 2,
                    0.76,
                    layer.pcm1
                ],
                position: [
                    0,
                    0,
                    -(0.44 / 2 + layer.siliconePad + layer.pcm1 / 2)
                ],
                radius: 0.008,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                    color: "#14b8a6",
                    emissive: "#22d3ee",
                    emissiveIntensity: mode === 'abnormal' ? 0.55 : 0.3,
                    transparent: true,
                    opacity: mode === 'abnormal' ? 0.85 : 0.68,
                    depthWrite: false,
                    roughness: 0.25,
                    metalness: 0.05
                }, void 0, false, {
                    fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                    lineNumber: 437,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                lineNumber: 432,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$RoundedBox$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RoundedBox"], {
                args: [
                    layer.foil,
                    0.74,
                    0.38
                ],
                position: [
                    -(layer.battery / 2 + layer.siliconePad + layer.pcm1 + layer.foil / 2),
                    0,
                    0
                ],
                radius: 0.003,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                    color: "#e2e8f0",
                    emissive: "#e2e8f0",
                    emissiveIntensity: 0.12,
                    transparent: true,
                    opacity: 0.6,
                    roughness: 0.2,
                    metalness: 0.9
                }, void 0, false, {
                    fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                    lineNumber: 456,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                lineNumber: 451,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$RoundedBox$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RoundedBox"], {
                args: [
                    layer.foil,
                    0.74,
                    0.38
                ],
                position: [
                    layer.battery / 2 + layer.siliconePad + layer.pcm1 + layer.foil / 2,
                    0,
                    0
                ],
                radius: 0.003,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                    color: "#e2e8f0",
                    emissive: "#e2e8f0",
                    emissiveIntensity: 0.12,
                    transparent: true,
                    opacity: 0.6,
                    roughness: 0.2,
                    metalness: 0.9
                }, void 0, false, {
                    fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                    lineNumber: 472,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                lineNumber: 467,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$RoundedBox$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RoundedBox"], {
                args: [
                    layer.battery + (layer.siliconePad + layer.pcm1 + layer.foil) * 2,
                    0.74,
                    layer.foil
                ],
                position: [
                    0,
                    0,
                    0.44 / 2 + layer.siliconePad + layer.pcm1 + layer.foil / 2
                ],
                radius: 0.003,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                    color: "#e2e8f0",
                    emissive: "#e2e8f0",
                    emissiveIntensity: 0.12,
                    transparent: true,
                    opacity: 0.6,
                    roughness: 0.2,
                    metalness: 0.9
                }, void 0, false, {
                    fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                    lineNumber: 488,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                lineNumber: 483,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$RoundedBox$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RoundedBox"], {
                args: [
                    layer.battery + (layer.siliconePad + layer.pcm1 + layer.foil) * 2,
                    0.74,
                    layer.foil
                ],
                position: [
                    0,
                    0,
                    -(0.44 / 2 + layer.siliconePad + layer.pcm1 + layer.foil / 2)
                ],
                radius: 0.003,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                    color: "#e2e8f0",
                    emissive: "#e2e8f0",
                    emissiveIntensity: 0.12,
                    transparent: true,
                    opacity: 0.6,
                    roughness: 0.2,
                    metalness: 0.9
                }, void 0, false, {
                    fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                    lineNumber: 504,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                lineNumber: 499,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$RoundedBox$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RoundedBox"], {
                args: [
                    layer.pcm2,
                    0.72,
                    0.36
                ],
                position: [
                    -(layer.battery / 2 + layer.siliconePad + layer.pcm1 + layer.foil + layer.pcm2 / 2),
                    0,
                    0
                ],
                radius: 0.01,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("shaderMaterial", {
                    ref: pcm2MatRef,
                    vertexShader: PCM_SHADER.vertex,
                    fragmentShader: PCM_SHADER.fragment,
                    transparent: true,
                    depthWrite: false,
                    side: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$facade$3e$__.DoubleSide,
                    uniforms: {
                        uTime: {
                            value: 0
                        },
                        uMelt: {
                            value: pcm2Melt
                        },
                        uBaseColor: {
                            value: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$facade$3e$__.Color('#3b82f6')
                        },
                        uHotColor: {
                            value: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$facade$3e$__.Color('#ef4444')
                        }
                    }
                }, void 0, false, {
                    fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                    lineNumber: 522,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                lineNumber: 517,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$RoundedBox$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RoundedBox"], {
                args: [
                    layer.pcm2,
                    0.72,
                    0.36
                ],
                position: [
                    layer.battery / 2 + layer.siliconePad + layer.pcm1 + layer.foil + layer.pcm2 / 2,
                    0,
                    0
                ],
                radius: 0.01,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("shaderMaterial", {
                    vertexShader: PCM_SHADER.vertex,
                    fragmentShader: PCM_SHADER.fragment,
                    transparent: true,
                    depthWrite: false,
                    side: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$facade$3e$__.DoubleSide,
                    uniforms: {
                        uTime: {
                            value: 0
                        },
                        uMelt: {
                            value: pcm2Melt
                        },
                        uBaseColor: {
                            value: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$facade$3e$__.Color('#3b82f6')
                        },
                        uHotColor: {
                            value: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$facade$3e$__.Color('#ef4444')
                        }
                    }
                }, void 0, false, {
                    fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                    lineNumber: 543,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                lineNumber: 538,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$RoundedBox$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RoundedBox"], {
                args: [
                    layer.battery + (layer.siliconePad + layer.pcm1 + layer.foil + layer.pcm2) * 2,
                    0.72,
                    layer.pcm2
                ],
                position: [
                    0,
                    0,
                    0.44 / 2 + layer.siliconePad + layer.pcm1 + layer.foil + layer.pcm2 / 2
                ],
                radius: 0.006,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                    color: mode === 'abnormal' && temperature >= 55 ? '#f97316' : '#60a5fa',
                    emissive: mode === 'abnormal' && temperature >= 55 ? '#fb7185' : '#60a5fa',
                    emissiveIntensity: mode === 'abnormal' && temperature >= 55 ? 0.7 : 0.28,
                    transparent: true,
                    opacity: mode === 'abnormal' && temperature >= 55 ? 0.88 : 0.62,
                    depthWrite: false,
                    roughness: 0.3,
                    metalness: 0.05
                }, void 0, false, {
                    fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                    lineNumber: 563,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                lineNumber: 558,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$RoundedBox$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RoundedBox"], {
                args: [
                    layer.battery + (layer.siliconePad + layer.pcm1 + layer.foil + layer.pcm2) * 2,
                    0.72,
                    layer.pcm2
                ],
                position: [
                    0,
                    0,
                    -(0.44 / 2 + layer.siliconePad + layer.pcm1 + layer.foil + layer.pcm2 / 2)
                ],
                radius: 0.006,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                    color: mode === 'abnormal' && temperature >= 55 ? '#f97316' : '#60a5fa',
                    emissive: mode === 'abnormal' && temperature >= 55 ? '#fb7185' : '#60a5fa',
                    emissiveIntensity: mode === 'abnormal' && temperature >= 55 ? 0.7 : 0.28,
                    transparent: true,
                    opacity: mode === 'abnormal' && temperature >= 55 ? 0.88 : 0.62,
                    depthWrite: false,
                    roughness: 0.3,
                    metalness: 0.05
                }, void 0, false, {
                    fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                    lineNumber: 580,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                lineNumber: 575,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$RoundedBox$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RoundedBox"], {
                args: [
                    layer.aerogel,
                    0.70,
                    0.34
                ],
                position: [
                    -(layer.battery / 2 + layer.siliconePad + layer.pcm1 + layer.foil + layer.pcm2 + layer.aerogel / 2),
                    0,
                    0
                ],
                radius: 0.008,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                    color: "#f8fafc",
                    emissive: "#67e8f9",
                    emissiveIntensity: 0.38,
                    transparent: true,
                    opacity: mode === 'abnormal' && temperature >= 100 ? 0.88 : 0.72,
                    depthWrite: false,
                    roughness: 0.9,
                    metalness: 0
                }, void 0, false, {
                    fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                    lineNumber: 599,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                lineNumber: 594,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$RoundedBox$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RoundedBox"], {
                args: [
                    layer.aerogel,
                    0.70,
                    0.34
                ],
                position: [
                    layer.battery / 2 + layer.siliconePad + layer.pcm1 + layer.foil + layer.pcm2 + layer.aerogel / 2,
                    0,
                    0
                ],
                radius: 0.008,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                    color: "#f8fafc",
                    emissive: "#67e8f9",
                    emissiveIntensity: 0.38,
                    transparent: true,
                    opacity: mode === 'abnormal' && temperature >= 100 ? 0.88 : 0.72,
                    depthWrite: false,
                    roughness: 0.9,
                    metalness: 0
                }, void 0, false, {
                    fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                    lineNumber: 617,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                lineNumber: 612,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$RoundedBox$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RoundedBox"], {
                args: [
                    layer.battery + (layer.siliconePad + layer.pcm1 + layer.foil + layer.pcm2 + layer.aerogel) * 2,
                    0.70,
                    layer.aerogel
                ],
                position: [
                    0,
                    0,
                    0.44 / 2 + layer.siliconePad + layer.pcm1 + layer.foil + layer.pcm2 + layer.aerogel / 2
                ],
                radius: 0.005,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                    color: "#f8fafc",
                    emissive: "#67e8f9",
                    emissiveIntensity: 0.32,
                    transparent: true,
                    opacity: mode === 'abnormal' && temperature >= 100 ? 0.86 : 0.7,
                    depthWrite: false,
                    roughness: 0.9,
                    metalness: 0
                }, void 0, false, {
                    fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                    lineNumber: 635,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                lineNumber: 630,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$RoundedBox$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RoundedBox"], {
                args: [
                    layer.battery + (layer.siliconePad + layer.pcm1 + layer.foil + layer.pcm2 + layer.aerogel) * 2,
                    0.70,
                    layer.aerogel
                ],
                position: [
                    0,
                    0,
                    -(0.44 / 2 + layer.siliconePad + layer.pcm1 + layer.foil + layer.pcm2 + layer.aerogel / 2)
                ],
                radius: 0.005,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                    color: "#f8fafc",
                    emissive: "#67e8f9",
                    emissiveIntensity: 0.32,
                    transparent: true,
                    opacity: mode === 'abnormal' && temperature >= 100 ? 0.86 : 0.7,
                    depthWrite: false,
                    roughness: 0.9,
                    metalness: 0
                }, void 0, false, {
                    fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                    lineNumber: 653,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                lineNumber: 648,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$RoundedBox$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RoundedBox"], {
                args: [
                    layer.shell,
                    0.68,
                    0.32
                ],
                position: [
                    -(layer.battery / 2 + layer.siliconePad + layer.pcm1 + layer.foil + layer.pcm2 + layer.aerogel + layer.shell / 2),
                    0,
                    0
                ],
                radius: 0.004,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                    color: "#475569",
                    emissive: "#0f172a",
                    emissiveIntensity: 0.08,
                    metalness: 0.7,
                    roughness: 0.4,
                    transparent: true,
                    opacity: 0.55,
                    depthWrite: false
                }, void 0, false, {
                    fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                    lineNumber: 672,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                lineNumber: 667,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$RoundedBox$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RoundedBox"], {
                args: [
                    layer.shell,
                    0.68,
                    0.32
                ],
                position: [
                    layer.battery / 2 + layer.siliconePad + layer.pcm1 + layer.foil + layer.pcm2 + layer.aerogel + layer.shell / 2,
                    0,
                    0
                ],
                radius: 0.004,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                    color: "#475569",
                    emissive: "#0f172a",
                    emissiveIntensity: 0.08,
                    metalness: 0.7,
                    roughness: 0.4,
                    transparent: true,
                    opacity: 0.55,
                    depthWrite: false
                }, void 0, false, {
                    fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                    lineNumber: 689,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                lineNumber: 684,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$RoundedBox$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RoundedBox"], {
                args: [
                    layer.battery + (layer.siliconePad + layer.pcm1 + layer.foil + layer.pcm2 + layer.aerogel + layer.shell) * 2,
                    0.68,
                    layer.shell
                ],
                position: [
                    0,
                    0,
                    0.44 / 2 + layer.siliconePad + layer.pcm1 + layer.foil + layer.pcm2 + layer.aerogel + layer.shell / 2
                ],
                radius: 0.004,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                    color: "#475569",
                    metalness: 0.7,
                    roughness: 0.4,
                    transparent: true,
                    opacity: 0.55,
                    depthWrite: false
                }, void 0, false, {
                    fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                    lineNumber: 706,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                lineNumber: 701,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$RoundedBox$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RoundedBox"], {
                args: [
                    layer.battery + (layer.siliconePad + layer.pcm1 + layer.foil + layer.pcm2 + layer.aerogel + layer.shell) * 2,
                    0.68,
                    layer.shell
                ],
                position: [
                    0,
                    0,
                    -(0.44 / 2 + layer.siliconePad + layer.pcm1 + layer.foil + layer.pcm2 + layer.aerogel + layer.shell / 2)
                ],
                radius: 0.004,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                    color: "#475569",
                    metalness: 0.7,
                    roughness: 0.4,
                    transparent: true,
                    opacity: 0.55,
                    depthWrite: false
                }, void 0, false, {
                    fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                    lineNumber: 721,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                lineNumber: 716,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
        lineNumber: 161,
        columnNumber: 5
    }, this);
}
function SmallBatteryModuleWithPCM({ position = [
    0,
    0,
    0
], mode, temperature = 28 }) {
    const layer = {
        battery: 0.16,
        siliconePad: 0.004,
        pcm1: 0.006,
        foil: 0.002,
        pcm2: 0.005,
        aerogel: 0.004,
        shell: 0.003
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
        position: position,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$RoundedBox$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RoundedBox"], {
                args: [
                    layer.battery,
                    0.12,
                    0.18
                ],
                radius: 0.015,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                    color: "#1e293b",
                    metalness: 0.35,
                    roughness: 0.5
                }, void 0, false, {
                    fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                    lineNumber: 761,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                lineNumber: 760,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$RoundedBox$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RoundedBox"], {
                args: [
                    layer.battery - 0.02,
                    0.008,
                    0.025
                ],
                position: [
                    0,
                    0.065,
                    0.08
                ],
                radius: 0.003,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                    color: "#22c55e",
                    emissive: "#22c55e",
                    emissiveIntensity: 0.5
                }, void 0, false, {
                    fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                    lineNumber: 766,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                lineNumber: 765,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$RoundedBox$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RoundedBox"], {
                args: [
                    layer.siliconePad,
                    0.10,
                    0.16
                ],
                position: [
                    -(layer.battery / 2 + layer.siliconePad / 2),
                    0,
                    0
                ],
                radius: 0.002,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                    color: "#94a3b8",
                    emissive: "#94a3b8",
                    emissiveIntensity: 0.06,
                    transparent: true,
                    opacity: 0.65,
                    roughness: 0.65
                }, void 0, false, {
                    fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                    lineNumber: 771,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                lineNumber: 770,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$RoundedBox$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RoundedBox"], {
                args: [
                    layer.siliconePad,
                    0.10,
                    0.16
                ],
                position: [
                    layer.battery / 2 + layer.siliconePad / 2,
                    0,
                    0
                ],
                radius: 0.002,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                    color: "#94a3b8",
                    emissive: "#94a3b8",
                    emissiveIntensity: 0.06,
                    transparent: true,
                    opacity: 0.65,
                    roughness: 0.65
                }, void 0, false, {
                    fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                    lineNumber: 774,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                lineNumber: 773,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$RoundedBox$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RoundedBox"], {
                args: [
                    layer.battery + layer.siliconePad * 2,
                    0.10,
                    layer.siliconePad
                ],
                position: [
                    0,
                    0,
                    0.18 / 2 + layer.siliconePad / 2
                ],
                radius: 0.002,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                    color: "#94a3b8",
                    emissive: "#94a3b8",
                    emissiveIntensity: 0.06,
                    transparent: true,
                    opacity: 0.65,
                    roughness: 0.65
                }, void 0, false, {
                    fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                    lineNumber: 777,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                lineNumber: 776,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$RoundedBox$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RoundedBox"], {
                args: [
                    layer.battery + layer.siliconePad * 2,
                    0.10,
                    layer.siliconePad
                ],
                position: [
                    0,
                    0,
                    -(0.18 / 2 + layer.siliconePad / 2)
                ],
                radius: 0.002,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                    color: "#94a3b8",
                    emissive: "#94a3b8",
                    emissiveIntensity: 0.06,
                    transparent: true,
                    opacity: 0.65,
                    roughness: 0.65
                }, void 0, false, {
                    fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                    lineNumber: 780,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                lineNumber: 779,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$RoundedBox$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RoundedBox"], {
                args: [
                    layer.pcm1,
                    0.09,
                    0.14
                ],
                position: [
                    -(layer.battery / 2 + layer.siliconePad + layer.pcm1 / 2),
                    0,
                    0
                ],
                radius: 0.003,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                    color: "#14b8a6",
                    emissive: "#22d3ee",
                    emissiveIntensity: mode === 'abnormal' ? 0.35 : 0.2,
                    transparent: true,
                    opacity: mode === 'abnormal' ? 0.7 : 0.5,
                    roughness: 0.25
                }, void 0, false, {
                    fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                    lineNumber: 785,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                lineNumber: 784,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$RoundedBox$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RoundedBox"], {
                args: [
                    layer.pcm1,
                    0.09,
                    0.14
                ],
                position: [
                    layer.battery / 2 + layer.siliconePad + layer.pcm1 / 2,
                    0,
                    0
                ],
                radius: 0.003,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                    color: "#14b8a6",
                    emissive: "#22d3ee",
                    emissiveIntensity: mode === 'abnormal' ? 0.35 : 0.2,
                    transparent: true,
                    opacity: mode === 'abnormal' ? 0.7 : 0.5,
                    roughness: 0.25
                }, void 0, false, {
                    fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                    lineNumber: 788,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                lineNumber: 787,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$RoundedBox$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RoundedBox"], {
                args: [
                    layer.battery + (layer.siliconePad + layer.pcm1) * 2,
                    0.09,
                    layer.pcm1
                ],
                position: [
                    0,
                    0,
                    0.18 / 2 + layer.siliconePad + layer.pcm1 / 2
                ],
                radius: 0.003,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                    color: "#14b8a6",
                    emissive: "#22d3ee",
                    emissiveIntensity: mode === 'abnormal' ? 0.32 : 0.18,
                    transparent: true,
                    opacity: mode === 'abnormal' ? 0.65 : 0.45,
                    roughness: 0.25
                }, void 0, false, {
                    fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                    lineNumber: 791,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                lineNumber: 790,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$RoundedBox$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RoundedBox"], {
                args: [
                    layer.battery + (layer.siliconePad + layer.pcm1) * 2,
                    0.09,
                    layer.pcm1
                ],
                position: [
                    0,
                    0,
                    -(0.18 / 2 + layer.siliconePad + layer.pcm1 / 2)
                ],
                radius: 0.003,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                    color: "#14b8a6",
                    emissive: "#22d3ee",
                    emissiveIntensity: mode === 'abnormal' ? 0.32 : 0.18,
                    transparent: true,
                    opacity: mode === 'abnormal' ? 0.65 : 0.45,
                    roughness: 0.25
                }, void 0, false, {
                    fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                    lineNumber: 794,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                lineNumber: 793,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$RoundedBox$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RoundedBox"], {
                args: [
                    layer.foil,
                    0.08,
                    0.12
                ],
                position: [
                    -(layer.battery / 2 + layer.siliconePad + layer.pcm1 + layer.foil / 2),
                    0,
                    0
                ],
                radius: 0.001,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                    color: "#e2e8f0",
                    emissive: "#e2e8f0",
                    emissiveIntensity: 0.1,
                    transparent: true,
                    opacity: 0.55,
                    roughness: 0.2,
                    metalness: 0.9
                }, void 0, false, {
                    fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                    lineNumber: 799,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                lineNumber: 798,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$RoundedBox$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RoundedBox"], {
                args: [
                    layer.foil,
                    0.08,
                    0.12
                ],
                position: [
                    layer.battery / 2 + layer.siliconePad + layer.pcm1 + layer.foil / 2,
                    0,
                    0
                ],
                radius: 0.001,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                    color: "#e2e8f0",
                    emissive: "#e2e8f0",
                    emissiveIntensity: 0.1,
                    transparent: true,
                    opacity: 0.55,
                    roughness: 0.2,
                    metalness: 0.9
                }, void 0, false, {
                    fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                    lineNumber: 802,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                lineNumber: 801,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$RoundedBox$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RoundedBox"], {
                args: [
                    layer.battery + (layer.siliconePad + layer.pcm1 + layer.foil) * 2,
                    0.08,
                    layer.foil
                ],
                position: [
                    0,
                    0,
                    0.18 / 2 + layer.siliconePad + layer.pcm1 + layer.foil / 2
                ],
                radius: 0.001,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                    color: "#e2e8f0",
                    emissive: "#e2e8f0",
                    emissiveIntensity: 0.1,
                    transparent: true,
                    opacity: 0.55,
                    roughness: 0.2,
                    metalness: 0.9
                }, void 0, false, {
                    fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                    lineNumber: 805,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                lineNumber: 804,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$RoundedBox$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RoundedBox"], {
                args: [
                    layer.battery + (layer.siliconePad + layer.pcm1 + layer.foil) * 2,
                    0.08,
                    layer.foil
                ],
                position: [
                    0,
                    0,
                    -(0.18 / 2 + layer.siliconePad + layer.pcm1 + layer.foil / 2)
                ],
                radius: 0.001,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                    color: "#e2e8f0",
                    emissive: "#e2e8f0",
                    emissiveIntensity: 0.1,
                    transparent: true,
                    opacity: 0.55,
                    roughness: 0.2,
                    metalness: 0.9
                }, void 0, false, {
                    fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                    lineNumber: 808,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                lineNumber: 807,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$RoundedBox$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RoundedBox"], {
                args: [
                    layer.pcm2,
                    0.07,
                    0.10
                ],
                position: [
                    -(layer.battery / 2 + layer.siliconePad + layer.pcm1 + layer.foil + layer.pcm2 / 2),
                    0,
                    0
                ],
                radius: 0.002,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                    color: mode === 'abnormal' && temperature >= 55 ? '#f97316' : '#60a5fa',
                    emissive: mode === 'abnormal' && temperature >= 55 ? '#fb7185' : '#60a5fa',
                    emissiveIntensity: mode === 'abnormal' && temperature >= 55 ? 0.4 : 0.15,
                    transparent: true,
                    opacity: mode === 'abnormal' && temperature >= 55 ? 0.7 : 0.4,
                    roughness: 0.3
                }, void 0, false, {
                    fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                    lineNumber: 813,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                lineNumber: 812,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$RoundedBox$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RoundedBox"], {
                args: [
                    layer.pcm2,
                    0.07,
                    0.10
                ],
                position: [
                    layer.battery / 2 + layer.siliconePad + layer.pcm1 + layer.foil + layer.pcm2 / 2,
                    0,
                    0
                ],
                radius: 0.002,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                    color: mode === 'abnormal' && temperature >= 55 ? '#f97316' : '#60a5fa',
                    emissive: mode === 'abnormal' && temperature >= 55 ? '#fb7185' : '#60a5fa',
                    emissiveIntensity: mode === 'abnormal' && temperature >= 55 ? 0.4 : 0.15,
                    transparent: true,
                    opacity: mode === 'abnormal' && temperature >= 55 ? 0.7 : 0.4,
                    roughness: 0.3
                }, void 0, false, {
                    fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                    lineNumber: 816,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                lineNumber: 815,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$RoundedBox$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RoundedBox"], {
                args: [
                    layer.battery + (layer.siliconePad + layer.pcm1 + layer.foil + layer.pcm2) * 2,
                    0.07,
                    layer.pcm2
                ],
                position: [
                    0,
                    0,
                    0.18 / 2 + layer.siliconePad + layer.pcm1 + layer.foil + layer.pcm2 / 2
                ],
                radius: 0.002,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                    color: mode === 'abnormal' && temperature >= 55 ? '#f97316' : '#60a5fa',
                    emissive: mode === 'abnormal' && temperature >= 55 ? '#fb7185' : '#60a5fa',
                    emissiveIntensity: mode === 'abnormal' && temperature >= 55 ? 0.35 : 0.12,
                    transparent: true,
                    opacity: mode === 'abnormal' && temperature >= 55 ? 0.65 : 0.35,
                    roughness: 0.3
                }, void 0, false, {
                    fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                    lineNumber: 819,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                lineNumber: 818,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$RoundedBox$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RoundedBox"], {
                args: [
                    layer.battery + (layer.siliconePad + layer.pcm1 + layer.foil + layer.pcm2) * 2,
                    0.07,
                    layer.pcm2
                ],
                position: [
                    0,
                    0,
                    -(0.18 / 2 + layer.siliconePad + layer.pcm1 + layer.foil + layer.pcm2 / 2)
                ],
                radius: 0.002,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                    color: mode === 'abnormal' && temperature >= 55 ? '#f97316' : '#60a5fa',
                    emissive: mode === 'abnormal' && temperature >= 55 ? '#fb7185' : '#60a5fa',
                    emissiveIntensity: mode === 'abnormal' && temperature >= 55 ? 0.35 : 0.12,
                    transparent: true,
                    opacity: mode === 'abnormal' && temperature >= 55 ? 0.65 : 0.35,
                    roughness: 0.3
                }, void 0, false, {
                    fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                    lineNumber: 822,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                lineNumber: 821,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$RoundedBox$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RoundedBox"], {
                args: [
                    layer.aerogel,
                    0.06,
                    0.08
                ],
                position: [
                    -(layer.battery / 2 + layer.siliconePad + layer.pcm1 + layer.foil + layer.pcm2 + layer.aerogel / 2),
                    0,
                    0
                ],
                radius: 0.002,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                    color: "#ffffff",
                    emissive: "#ffffff",
                    emissiveIntensity: 0.04,
                    transparent: true,
                    opacity: 0.22,
                    roughness: 0.9
                }, void 0, false, {
                    fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                    lineNumber: 827,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                lineNumber: 826,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$RoundedBox$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RoundedBox"], {
                args: [
                    layer.aerogel,
                    0.06,
                    0.08
                ],
                position: [
                    layer.battery / 2 + layer.siliconePad + layer.pcm1 + layer.foil + layer.pcm2 + layer.aerogel / 2,
                    0,
                    0
                ],
                radius: 0.002,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                    color: "#ffffff",
                    emissive: "#ffffff",
                    emissiveIntensity: 0.04,
                    transparent: true,
                    opacity: 0.22,
                    roughness: 0.9
                }, void 0, false, {
                    fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                    lineNumber: 830,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                lineNumber: 829,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$RoundedBox$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RoundedBox"], {
                args: [
                    layer.battery + (layer.siliconePad + layer.pcm1 + layer.foil + layer.pcm2 + layer.aerogel) * 2,
                    0.06,
                    layer.aerogel
                ],
                position: [
                    0,
                    0,
                    0.18 / 2 + layer.siliconePad + layer.pcm1 + layer.foil + layer.pcm2 + layer.aerogel / 2
                ],
                radius: 0.002,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                    color: "#ffffff",
                    emissive: "#ffffff",
                    emissiveIntensity: 0.03,
                    transparent: true,
                    opacity: 0.2,
                    roughness: 0.9
                }, void 0, false, {
                    fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                    lineNumber: 833,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                lineNumber: 832,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$RoundedBox$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RoundedBox"], {
                args: [
                    layer.battery + (layer.siliconePad + layer.pcm1 + layer.foil + layer.pcm2 + layer.aerogel) * 2,
                    0.06,
                    layer.aerogel
                ],
                position: [
                    0,
                    0,
                    -(0.18 / 2 + layer.siliconePad + layer.pcm1 + layer.foil + layer.pcm2 + layer.aerogel / 2)
                ],
                radius: 0.002,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                    color: "#ffffff",
                    emissive: "#ffffff",
                    emissiveIntensity: 0.03,
                    transparent: true,
                    opacity: 0.2,
                    roughness: 0.9
                }, void 0, false, {
                    fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                    lineNumber: 836,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                lineNumber: 835,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$RoundedBox$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RoundedBox"], {
                args: [
                    layer.shell,
                    0.05,
                    0.06
                ],
                position: [
                    -(layer.battery / 2 + layer.siliconePad + layer.pcm1 + layer.foil + layer.pcm2 + layer.aerogel + layer.shell / 2),
                    0,
                    0
                ],
                radius: 0.001,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                    color: "#475569",
                    metalness: 0.7,
                    roughness: 0.4,
                    transparent: true,
                    opacity: 0.8
                }, void 0, false, {
                    fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                    lineNumber: 841,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                lineNumber: 840,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$RoundedBox$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RoundedBox"], {
                args: [
                    layer.shell,
                    0.05,
                    0.06
                ],
                position: [
                    layer.battery / 2 + layer.siliconePad + layer.pcm1 + layer.foil + layer.pcm2 + layer.aerogel + layer.shell / 2,
                    0,
                    0
                ],
                radius: 0.001,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                    color: "#475569",
                    metalness: 0.7,
                    roughness: 0.4,
                    transparent: true,
                    opacity: 0.8
                }, void 0, false, {
                    fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                    lineNumber: 844,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                lineNumber: 843,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$RoundedBox$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RoundedBox"], {
                args: [
                    layer.battery + (layer.siliconePad + layer.pcm1 + layer.foil + layer.pcm2 + layer.aerogel + layer.shell) * 2,
                    0.05,
                    layer.shell
                ],
                position: [
                    0,
                    0,
                    0.18 / 2 + layer.siliconePad + layer.pcm1 + layer.foil + layer.pcm2 + layer.aerogel + layer.shell / 2
                ],
                radius: 0.001,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                    color: "#475569",
                    metalness: 0.7,
                    roughness: 0.4,
                    transparent: true,
                    opacity: 0.8
                }, void 0, false, {
                    fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                    lineNumber: 847,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                lineNumber: 846,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$RoundedBox$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RoundedBox"], {
                args: [
                    layer.battery + (layer.siliconePad + layer.pcm1 + layer.foil + layer.pcm2 + layer.aerogel + layer.shell) * 2,
                    0.05,
                    layer.shell
                ],
                position: [
                    0,
                    0,
                    -(0.18 / 2 + layer.siliconePad + layer.pcm1 + layer.foil + layer.pcm2 + layer.aerogel + layer.shell / 2)
                ],
                radius: 0.001,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                    color: "#475569",
                    metalness: 0.7,
                    roughness: 0.4,
                    transparent: true,
                    opacity: 0.8
                }, void 0, false, {
                    fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                    lineNumber: 850,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                lineNumber: 849,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
        lineNumber: 758,
        columnNumber: 5
    }, this);
}
function BatteryClusterWithPCM({ position = [
    0,
    0,
    0
], mode, temperature = 28 }) {
    const layer = {
        battery: 0.55,
        siliconePad: 0.008,
        pcm1: 0.012,
        foil: 0.003,
        pcm2: 0.010,
        aerogel: 0.008,
        shell: 0.005
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
        position: position,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$RoundedBox$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RoundedBox"], {
                args: [
                    layer.battery,
                    0.78,
                    0.42
                ],
                radius: 0.025,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                    color: "#1e293b",
                    metalness: 0.35,
                    roughness: 0.5
                }, void 0, false, {
                    fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                    lineNumber: 883,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                lineNumber: 882,
                columnNumber: 7
            }, this),
            [
                -0.15,
                0,
                0.15
            ].map((cx, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$RoundedBox$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RoundedBox"], {
                    args: [
                        0.12,
                        0.68,
                        0.36
                    ],
                    position: [
                        cx,
                        0,
                        0
                    ],
                    radius: 0.012,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                        color: "#334155",
                        metalness: 0.25,
                        roughness: 0.6
                    }, void 0, false, {
                        fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                        lineNumber: 889,
                        columnNumber: 11
                    }, this)
                }, `cell-${idx}`, false, {
                    fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                    lineNumber: 888,
                    columnNumber: 9
                }, this)),
            [
                0.25,
                0,
                -0.25
            ].map((y, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$RoundedBox$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RoundedBox"], {
                    args: [
                        layer.battery - 0.05,
                        0.01,
                        0.025
                    ],
                    position: [
                        0,
                        y,
                        0.22
                    ],
                    radius: 0.004,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                        color: '#22c55e',
                        emissive: '#22c55e',
                        emissiveIntensity: 0.45 - i * 0.1
                    }, void 0, false, {
                        fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                        lineNumber: 896,
                        columnNumber: 11
                    }, this)
                }, `lamp-${i}`, false, {
                    fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                    lineNumber: 895,
                    columnNumber: 9
                }, this)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$RoundedBox$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RoundedBox"], {
                args: [
                    layer.battery - 0.02,
                    0.05,
                    0.40
                ],
                position: [
                    0,
                    0.40,
                    0
                ],
                radius: 0.015,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                    color: "#0f172a",
                    metalness: 0.6,
                    roughness: 0.35
                }, void 0, false, {
                    fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                    lineNumber: 906,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                lineNumber: 905,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$RoundedBox$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RoundedBox"], {
                args: [
                    layer.siliconePad,
                    0.72,
                    0.38
                ],
                position: [
                    -(layer.battery / 2 + layer.siliconePad / 2),
                    0,
                    0
                ],
                radius: 0.003,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                    color: "#94a3b8",
                    emissive: "#94a3b8",
                    emissiveIntensity: 0.07,
                    transparent: true,
                    opacity: 0.68,
                    roughness: 0.65
                }, void 0, false, {
                    fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                    lineNumber: 911,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                lineNumber: 910,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$RoundedBox$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RoundedBox"], {
                args: [
                    layer.siliconePad,
                    0.72,
                    0.38
                ],
                position: [
                    layer.battery / 2 + layer.siliconePad / 2,
                    0,
                    0
                ],
                radius: 0.003,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                    color: "#94a3b8",
                    emissive: "#94a3b8",
                    emissiveIntensity: 0.07,
                    transparent: true,
                    opacity: 0.68,
                    roughness: 0.65
                }, void 0, false, {
                    fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                    lineNumber: 914,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                lineNumber: 913,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$RoundedBox$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RoundedBox"], {
                args: [
                    layer.battery + layer.siliconePad * 2,
                    0.72,
                    layer.siliconePad
                ],
                position: [
                    0,
                    0,
                    0.42 / 2 + layer.siliconePad / 2
                ],
                radius: 0.003,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                    color: "#94a3b8",
                    emissive: "#94a3b8",
                    emissiveIntensity: 0.07,
                    transparent: true,
                    opacity: 0.68,
                    roughness: 0.65
                }, void 0, false, {
                    fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                    lineNumber: 917,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                lineNumber: 916,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$RoundedBox$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RoundedBox"], {
                args: [
                    layer.battery + layer.siliconePad * 2,
                    0.72,
                    layer.siliconePad
                ],
                position: [
                    0,
                    0,
                    -(0.42 / 2 + layer.siliconePad / 2)
                ],
                radius: 0.003,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                    color: "#94a3b8",
                    emissive: "#94a3b8",
                    emissiveIntensity: 0.07,
                    transparent: true,
                    opacity: 0.68,
                    roughness: 0.65
                }, void 0, false, {
                    fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                    lineNumber: 920,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                lineNumber: 919,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$RoundedBox$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RoundedBox"], {
                args: [
                    layer.pcm1,
                    0.68,
                    0.34
                ],
                position: [
                    -(layer.battery / 2 + layer.siliconePad + layer.pcm1 / 2),
                    0,
                    0
                ],
                radius: 0.005,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                    color: "#14b8a6",
                    emissive: "#22d3ee",
                    emissiveIntensity: mode === 'abnormal' ? 0.35 : 0.2,
                    transparent: true,
                    opacity: mode === 'abnormal' ? 0.72 : 0.52,
                    roughness: 0.25
                }, void 0, false, {
                    fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                    lineNumber: 925,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                lineNumber: 924,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$RoundedBox$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RoundedBox"], {
                args: [
                    layer.pcm1,
                    0.68,
                    0.34
                ],
                position: [
                    layer.battery / 2 + layer.siliconePad + layer.pcm1 / 2,
                    0,
                    0
                ],
                radius: 0.005,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                    color: "#14b8a6",
                    emissive: "#22d3ee",
                    emissiveIntensity: mode === 'abnormal' ? 0.35 : 0.2,
                    transparent: true,
                    opacity: mode === 'abnormal' ? 0.72 : 0.52,
                    roughness: 0.25
                }, void 0, false, {
                    fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                    lineNumber: 928,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                lineNumber: 927,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$RoundedBox$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RoundedBox"], {
                args: [
                    layer.battery + (layer.siliconePad + layer.pcm1) * 2,
                    0.68,
                    layer.pcm1
                ],
                position: [
                    0,
                    0,
                    0.42 / 2 + layer.siliconePad + layer.pcm1 / 2
                ],
                radius: 0.005,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                    color: "#14b8a6",
                    emissive: "#22d3ee",
                    emissiveIntensity: mode === 'abnormal' ? 0.32 : 0.18,
                    transparent: true,
                    opacity: mode === 'abnormal' ? 0.68 : 0.48,
                    roughness: 0.25
                }, void 0, false, {
                    fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                    lineNumber: 931,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                lineNumber: 930,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$RoundedBox$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RoundedBox"], {
                args: [
                    layer.battery + (layer.siliconePad + layer.pcm1) * 2,
                    0.68,
                    layer.pcm1
                ],
                position: [
                    0,
                    0,
                    -(0.42 / 2 + layer.siliconePad + layer.pcm1 / 2)
                ],
                radius: 0.005,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                    color: "#14b8a6",
                    emissive: "#22d3ee",
                    emissiveIntensity: mode === 'abnormal' ? 0.32 : 0.18,
                    transparent: true,
                    opacity: mode === 'abnormal' ? 0.68 : 0.48,
                    roughness: 0.25
                }, void 0, false, {
                    fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                    lineNumber: 934,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                lineNumber: 933,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$RoundedBox$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RoundedBox"], {
                args: [
                    layer.foil,
                    0.64,
                    0.30
                ],
                position: [
                    -(layer.battery / 2 + layer.siliconePad + layer.pcm1 + layer.foil / 2),
                    0,
                    0
                ],
                radius: 0.002,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                    color: "#e2e8f0",
                    emissive: "#e2e8f0",
                    emissiveIntensity: 0.11,
                    transparent: true,
                    opacity: 0.58,
                    roughness: 0.2,
                    metalness: 0.9
                }, void 0, false, {
                    fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                    lineNumber: 939,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                lineNumber: 938,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$RoundedBox$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RoundedBox"], {
                args: [
                    layer.foil,
                    0.64,
                    0.30
                ],
                position: [
                    layer.battery / 2 + layer.siliconePad + layer.pcm1 + layer.foil / 2,
                    0,
                    0
                ],
                radius: 0.002,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                    color: "#e2e8f0",
                    emissive: "#e2e8f0",
                    emissiveIntensity: 0.11,
                    transparent: true,
                    opacity: 0.58,
                    roughness: 0.2,
                    metalness: 0.9
                }, void 0, false, {
                    fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                    lineNumber: 942,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                lineNumber: 941,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$RoundedBox$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RoundedBox"], {
                args: [
                    layer.battery + (layer.siliconePad + layer.pcm1 + layer.foil) * 2,
                    0.64,
                    layer.foil
                ],
                position: [
                    0,
                    0,
                    0.42 / 2 + layer.siliconePad + layer.pcm1 + layer.foil / 2
                ],
                radius: 0.002,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                    color: "#e2e8f0",
                    emissive: "#e2e8f0",
                    emissiveIntensity: 0.11,
                    transparent: true,
                    opacity: 0.58,
                    roughness: 0.2,
                    metalness: 0.9
                }, void 0, false, {
                    fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                    lineNumber: 945,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                lineNumber: 944,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$RoundedBox$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RoundedBox"], {
                args: [
                    layer.battery + (layer.siliconePad + layer.pcm1 + layer.foil) * 2,
                    0.64,
                    layer.foil
                ],
                position: [
                    0,
                    0,
                    -(0.42 / 2 + layer.siliconePad + layer.pcm1 + layer.foil / 2)
                ],
                radius: 0.002,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                    color: "#e2e8f0",
                    emissive: "#e2e8f0",
                    emissiveIntensity: 0.11,
                    transparent: true,
                    opacity: 0.58,
                    roughness: 0.2,
                    metalness: 0.9
                }, void 0, false, {
                    fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                    lineNumber: 948,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                lineNumber: 947,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$RoundedBox$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RoundedBox"], {
                args: [
                    layer.pcm2,
                    0.60,
                    0.26
                ],
                position: [
                    -(layer.battery / 2 + layer.siliconePad + layer.pcm1 + layer.foil + layer.pcm2 / 2),
                    0,
                    0
                ],
                radius: 0.004,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                    color: mode === 'abnormal' && temperature >= 55 ? '#f97316' : '#60a5fa',
                    emissive: mode === 'abnormal' && temperature >= 55 ? '#fb7185' : '#60a5fa',
                    emissiveIntensity: mode === 'abnormal' && temperature >= 55 ? 0.42 : 0.16,
                    transparent: true,
                    opacity: mode === 'abnormal' && temperature >= 55 ? 0.72 : 0.42,
                    roughness: 0.3
                }, void 0, false, {
                    fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                    lineNumber: 953,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                lineNumber: 952,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$RoundedBox$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RoundedBox"], {
                args: [
                    layer.pcm2,
                    0.60,
                    0.26
                ],
                position: [
                    layer.battery / 2 + layer.siliconePad + layer.pcm1 + layer.foil + layer.pcm2 / 2,
                    0,
                    0
                ],
                radius: 0.004,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                    color: mode === 'abnormal' && temperature >= 55 ? '#f97316' : '#60a5fa',
                    emissive: mode === 'abnormal' && temperature >= 55 ? '#fb7185' : '#60a5fa',
                    emissiveIntensity: mode === 'abnormal' && temperature >= 55 ? 0.42 : 0.16,
                    transparent: true,
                    opacity: mode === 'abnormal' && temperature >= 55 ? 0.72 : 0.42,
                    roughness: 0.3
                }, void 0, false, {
                    fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                    lineNumber: 956,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                lineNumber: 955,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$RoundedBox$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RoundedBox"], {
                args: [
                    layer.battery + (layer.siliconePad + layer.pcm1 + layer.foil + layer.pcm2) * 2,
                    0.60,
                    layer.pcm2
                ],
                position: [
                    0,
                    0,
                    0.42 / 2 + layer.siliconePad + layer.pcm1 + layer.foil + layer.pcm2 / 2
                ],
                radius: 0.004,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                    color: mode === 'abnormal' && temperature >= 55 ? '#f97316' : '#60a5fa',
                    emissive: mode === 'abnormal' && temperature >= 55 ? '#fb7185' : '#60a5fa',
                    emissiveIntensity: mode === 'abnormal' && temperature >= 55 ? 0.38 : 0.14,
                    transparent: true,
                    opacity: mode === 'abnormal' && temperature >= 55 ? 0.68 : 0.38,
                    roughness: 0.3
                }, void 0, false, {
                    fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                    lineNumber: 959,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                lineNumber: 958,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$RoundedBox$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RoundedBox"], {
                args: [
                    layer.battery + (layer.siliconePad + layer.pcm1 + layer.foil + layer.pcm2) * 2,
                    0.60,
                    layer.pcm2
                ],
                position: [
                    0,
                    0,
                    -(0.42 / 2 + layer.siliconePad + layer.pcm1 + layer.foil + layer.pcm2 / 2)
                ],
                radius: 0.004,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                    color: mode === 'abnormal' && temperature >= 55 ? '#f97316' : '#60a5fa',
                    emissive: mode === 'abnormal' && temperature >= 55 ? '#fb7185' : '#60a5fa',
                    emissiveIntensity: mode === 'abnormal' && temperature >= 55 ? 0.38 : 0.14,
                    transparent: true,
                    opacity: mode === 'abnormal' && temperature >= 55 ? 0.68 : 0.38,
                    roughness: 0.3
                }, void 0, false, {
                    fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                    lineNumber: 962,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                lineNumber: 961,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$RoundedBox$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RoundedBox"], {
                args: [
                    layer.aerogel,
                    0.56,
                    0.22
                ],
                position: [
                    -(layer.battery / 2 + layer.siliconePad + layer.pcm1 + layer.foil + layer.pcm2 + layer.aerogel / 2),
                    0,
                    0
                ],
                radius: 0.003,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                    color: "#ffffff",
                    emissive: "#ffffff",
                    emissiveIntensity: mode === 'abnormal' && temperature >= 100 ? 0.15 : 0.05,
                    transparent: true,
                    opacity: mode === 'abnormal' && temperature >= 100 ? 0.5 : 0.24,
                    roughness: 0.9
                }, void 0, false, {
                    fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                    lineNumber: 967,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                lineNumber: 966,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$RoundedBox$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RoundedBox"], {
                args: [
                    layer.aerogel,
                    0.56,
                    0.22
                ],
                position: [
                    layer.battery / 2 + layer.siliconePad + layer.pcm1 + layer.foil + layer.pcm2 + layer.aerogel / 2,
                    0,
                    0
                ],
                radius: 0.003,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                    color: "#ffffff",
                    emissive: "#ffffff",
                    emissiveIntensity: mode === 'abnormal' && temperature >= 100 ? 0.15 : 0.05,
                    transparent: true,
                    opacity: mode === 'abnormal' && temperature >= 100 ? 0.5 : 0.24,
                    roughness: 0.9
                }, void 0, false, {
                    fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                    lineNumber: 970,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                lineNumber: 969,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$RoundedBox$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RoundedBox"], {
                args: [
                    layer.battery + (layer.siliconePad + layer.pcm1 + layer.foil + layer.pcm2 + layer.aerogel) * 2,
                    0.56,
                    layer.aerogel
                ],
                position: [
                    0,
                    0,
                    0.42 / 2 + layer.siliconePad + layer.pcm1 + layer.foil + layer.pcm2 + layer.aerogel / 2
                ],
                radius: 0.003,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                    color: "#ffffff",
                    emissive: "#ffffff",
                    emissiveIntensity: mode === 'abnormal' && temperature >= 100 ? 0.12 : 0.04,
                    transparent: true,
                    opacity: mode === 'abnormal' && temperature >= 100 ? 0.45 : 0.22,
                    roughness: 0.9
                }, void 0, false, {
                    fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                    lineNumber: 973,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                lineNumber: 972,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$RoundedBox$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RoundedBox"], {
                args: [
                    layer.battery + (layer.siliconePad + layer.pcm1 + layer.foil + layer.pcm2 + layer.aerogel) * 2,
                    0.56,
                    layer.aerogel
                ],
                position: [
                    0,
                    0,
                    -(0.42 / 2 + layer.siliconePad + layer.pcm1 + layer.foil + layer.pcm2 + layer.aerogel / 2)
                ],
                radius: 0.003,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                    color: "#ffffff",
                    emissive: "#ffffff",
                    emissiveIntensity: mode === 'abnormal' && temperature >= 100 ? 0.12 : 0.04,
                    transparent: true,
                    opacity: mode === 'abnormal' && temperature >= 100 ? 0.45 : 0.22,
                    roughness: 0.9
                }, void 0, false, {
                    fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                    lineNumber: 976,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                lineNumber: 975,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$RoundedBox$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RoundedBox"], {
                args: [
                    layer.shell,
                    0.52,
                    0.18
                ],
                position: [
                    -(layer.battery / 2 + layer.siliconePad + layer.pcm1 + layer.foil + layer.pcm2 + layer.aerogel + layer.shell / 2),
                    0,
                    0
                ],
                radius: 0.002,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                    color: "#475569",
                    metalness: 0.7,
                    roughness: 0.4,
                    transparent: true,
                    opacity: 0.85
                }, void 0, false, {
                    fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                    lineNumber: 981,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                lineNumber: 980,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$RoundedBox$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RoundedBox"], {
                args: [
                    layer.shell,
                    0.52,
                    0.18
                ],
                position: [
                    layer.battery / 2 + layer.siliconePad + layer.pcm1 + layer.foil + layer.pcm2 + layer.aerogel + layer.shell / 2,
                    0,
                    0
                ],
                radius: 0.002,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                    color: "#475569",
                    metalness: 0.7,
                    roughness: 0.4,
                    transparent: true,
                    opacity: 0.85
                }, void 0, false, {
                    fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                    lineNumber: 984,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                lineNumber: 983,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$RoundedBox$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RoundedBox"], {
                args: [
                    layer.battery + (layer.siliconePad + layer.pcm1 + layer.foil + layer.pcm2 + layer.aerogel + layer.shell) * 2,
                    0.52,
                    layer.shell
                ],
                position: [
                    0,
                    0,
                    0.42 / 2 + layer.siliconePad + layer.pcm1 + layer.foil + layer.pcm2 + layer.aerogel + layer.shell / 2
                ],
                radius: 0.002,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                    color: "#475569",
                    metalness: 0.7,
                    roughness: 0.4,
                    transparent: true,
                    opacity: 0.85
                }, void 0, false, {
                    fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                    lineNumber: 987,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                lineNumber: 986,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$RoundedBox$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RoundedBox"], {
                args: [
                    layer.battery + (layer.siliconePad + layer.pcm1 + layer.foil + layer.pcm2 + layer.aerogel + layer.shell) * 2,
                    0.52,
                    layer.shell
                ],
                position: [
                    0,
                    0,
                    -(0.42 / 2 + layer.siliconePad + layer.pcm1 + layer.foil + layer.pcm2 + layer.aerogel + layer.shell / 2)
                ],
                radius: 0.002,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                    color: "#475569",
                    metalness: 0.7,
                    roughness: 0.4,
                    transparent: true,
                    opacity: 0.85
                }, void 0, false, {
                    fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                    lineNumber: 990,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
                lineNumber: 989,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/BatteryModuleWithPCM.tsx",
        lineNumber: 880,
        columnNumber: 5
    }, this);
}
const __TURBOPACK__default__export__ = BatteryModuleWithPCM;

})()),
"[project]/app/components/Model3D.tsx [app-ssr] (ecmascript)": (({ r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__ }) => (() => {
"use strict";

__turbopack_esm__({
    "default": ()=>Model3D
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/server/future/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/server/future/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$react$2d$three$2d$fiber$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_import__("[project]/node_modules/@react-three/fiber/dist/react-three-fiber.esm.js [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$776716bd$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__F__as__useFrame$3e$__ = __turbopack_import__("[project]/node_modules/@react-three/fiber/dist/events-776716bd.esm.js [app-ssr] (ecmascript) <export F as useFrame>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$776716bd$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__D__as__useThree$3e$__ = __turbopack_import__("[project]/node_modules/@react-three/fiber/dist/events-776716bd.esm.js [app-ssr] (ecmascript) <export D as useThree>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$OrbitControls$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/@react-three/drei/core/OrbitControls.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$RoundedBox$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/@react-three/drei/core/RoundedBox.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$shapes$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/@react-three/drei/core/shapes.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$Line$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/@react-three/drei/core/Line.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$web$2f$Html$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/@react-three/drei/web/Html.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$postprocessing$2f$dist$2f$EffectComposer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/@react-three/postprocessing/dist/EffectComposer.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$postprocessing$2f$dist$2f$effects$2f$Bloom$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/@react-three/postprocessing/dist/effects/Bloom.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$postprocessing$2f$dist$2f$effects$2f$Vignette$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/@react-three/postprocessing/dist/effects/Vignette.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$facade$3e$__ = __turbopack_import__("[project]/node_modules/three/build/three.module.js [app-ssr] (ecmascript) <facade>");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$BatteryModuleWithPCM$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/app/components/BatteryModuleWithPCM.tsx [app-ssr] (ecmascript)");
"__TURBOPACK__ecmascript__hoisting__location__";
'use client';
;
;
;
;
;
;
;
const HIDE_BATTERY_MODULES = false;
const DEBUG_HIDE_LEVEL = 0;
const DEBUG_HIDE_BAYS_LEVEL = 0;
const BATTERY_SYSTEM_MODULE_POSITIONS = [
    [
        1.12,
        0.55,
        0.9
    ],
    [
        0.37,
        0.55,
        0.9
    ],
    [
        -0.37,
        0.55,
        0.9
    ],
    [
        -1.12,
        0.55,
        0.9
    ],
    [
        1.12,
        0.55,
        0.3
    ],
    [
        0.37,
        0.55,
        0.3
    ],
    [
        -0.37,
        0.55,
        0.3
    ],
    [
        -1.12,
        0.55,
        0.3
    ],
    [
        1.12,
        0.55,
        -0.3
    ],
    [
        0.37,
        0.55,
        -0.3
    ],
    [
        -0.37,
        0.55,
        -0.3
    ],
    [
        -1.12,
        0.55,
        -0.3
    ],
    [
        1.12,
        0.55,
        -0.9
    ],
    [
        0.37,
        0.55,
        -0.9
    ],
    [
        -0.37,
        0.55,
        -0.9
    ],
    [
        -1.12,
        0.55,
        -0.9
    ]
];
const FAULT_MODULE_INDEX = 0;
// LAYER_THICKNESS 已移至 BatteryModuleWithPCM.tsx
function ExtinguishSpray({ state, targetPos }) {
    const pointsRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const nozzleRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const count = 400 // 进一步增加粒子数量
    ;
    const origin = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$facade$3e$__.Vector3(), []);
    const target = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$facade$3e$__.Vector3(), []);
    // 动画状态控制
    const fadeProgressRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(0);
    const spriteMap = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');
        if (!ctx) return null;
        const cx = 32;
        const cy = 32;
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, 32);
        g.addColorStop(0, 'rgba(255,255,255,1)');
        g.addColorStop(0.15, 'rgba(224,242,254,0.95)') // 增强核心亮度
        ;
        g.addColorStop(0.4, 'rgba(125,211,252,0.5)') // 增加中间层浓度
        ;
        g.addColorStop(1, 'rgba(125,211,252,0)');
        ctx.clearRect(0, 0, 64, 64);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(cx, cy, 32, 0, Math.PI * 2);
        ctx.fill();
        const tex = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$facade$3e$__.CanvasTexture(canvas);
        tex.needsUpdate = true;
        return tex;
    }, []);
    const { positions, velocities, lifetimes } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const pos = new Float32Array(count * 3);
        const vel = new Float32Array(count * 3);
        const life = new Float32Array(count);
        for(let i = 0; i < count; i++){
            const angle = Math.random() * Math.PI * 2;
            const radius = Math.random() * 0.12;
            pos[i * 3] = Math.cos(angle) * radius;
            pos[i * 3 + 1] = Math.random() * -0.5 // 垂直分布在起点下方
            ;
            pos[i * 3 + 2] = Math.sin(angle) * radius;
            vel[i * 3] = (Math.random() - 0.5) * 0.15;
            vel[i * 3 + 1] = -2.0 - Math.random() * 1.5;
            vel[i * 3 + 2] = (Math.random() - 0.5) * 0.15;
            life[i] = Math.random();
        }
        return {
            positions: pos,
            velocities: vel,
            lifetimes: life
        };
    }, []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$776716bd$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__F__as__useFrame$3e$__["useFrame"])((_, delta)=>{
        const isActive = state === 'active';
        // 平滑淡入淡出逻辑
        if (isActive) {
            fadeProgressRef.current = Math.min(1, fadeProgressRef.current + delta * 1.2) // 约0.8秒完全淡入
            ;
        } else {
            fadeProgressRef.current = Math.max(0, fadeProgressRef.current - delta * 2.0) // 约0.5秒淡出
            ;
        }
        if (!pointsRef.current || fadeProgressRef.current <= 0) return;
        // 更新材质透明度
        if (pointsRef.current.material) {
            pointsRef.current.material.opacity = fadeProgressRef.current * 0.8;
        }
        if (nozzleRef.current && nozzleRef.current.material) {
            nozzleRef.current.material.opacity = fadeProgressRef.current;
            nozzleRef.current.scale.setScalar(0.5 + 0.5 * fadeProgressRef.current) // 喷头也有个缩放动画
            ;
        }
        // 只有在激活时才进行物理更新
        if (isActive || fadeProgressRef.current > 0) {
            origin.copy(targetPos).add(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$facade$3e$__.Vector3(0, 1.2, 0));
            target.copy(targetPos);
            const posArr = pointsRef.current.geometry.attributes.position.array;
            for(let i = 0; i < count; i++){
                lifetimes[i] += delta * 1.6;
                if (lifetimes[i] > 1.0) {
                    lifetimes[i] = 0;
                    const angle = Math.random() * Math.PI * 2;
                    const radius = Math.random() * 0.18;
                    posArr[i * 3] = Math.cos(angle) * radius;
                    posArr[i * 3 + 1] = 0.05;
                    posArr[i * 3 + 2] = Math.sin(angle) * radius;
                    velocities[i * 3] = (Math.random() - 0.5) * 0.25;
                    velocities[i * 3 + 1] = -2.5 - Math.random() * 2.0;
                    velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.25;
                }
                posArr[i * 3] += velocities[i * 3] * delta;
                posArr[i * 3 + 1] += velocities[i * 3 + 1] * delta;
                posArr[i * 3 + 2] += velocities[i * 3 + 2] * delta;
                velocities[i * 3 + 1] -= 3.5 * delta // 加强重力感
                ;
            }
            pointsRef.current.geometry.attributes.position.needsUpdate = true;
            pointsRef.current.position.copy(origin);
        }
    });
    // 如果完全不可见则不渲染
    // 注意：为了平滑淡出，这里不能在 state !== 'active' 时立即 return null
    // 而是通过 fadeProgressRef 控制
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
        renderOrder: 998,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("points", {
                ref: pointsRef,
                frustumCulled: false,
                visible: true,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("bufferGeometry", {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("bufferAttribute", {
                            attach: "attributes-position",
                            count: count,
                            array: positions,
                            itemSize: 3
                        }, void 0, false, {
                            fileName: "[project]/app/components/Model3D.tsx",
                            lineNumber: 170,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/components/Model3D.tsx",
                        lineNumber: 169,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("pointsMaterial", {
                        size: 0.15,
                        sizeAttenuation: true,
                        transparent: true,
                        opacity: 0,
                        color: "#f0f9ff",
                        depthWrite: false,
                        blending: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$facade$3e$__.AdditiveBlending,
                        map: spriteMap ?? undefined
                    }, void 0, false, {
                        fileName: "[project]/app/components/Model3D.tsx",
                        lineNumber: 172,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/Model3D.tsx",
                lineNumber: 168,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                ref: nozzleRef,
                position: [
                    targetPos.x,
                    targetPos.y + 1.25,
                    targetPos.z
                ],
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("cylinderGeometry", {
                        args: [
                            0.08,
                            0.1,
                            0.1,
                            16
                        ]
                    }, void 0, false, {
                        fileName: "[project]/app/components/Model3D.tsx",
                        lineNumber: 186,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                        color: "#334155",
                        metalness: 0.8,
                        roughness: 0.2,
                        transparent: true,
                        opacity: 0
                    }, void 0, false, {
                        fileName: "[project]/app/components/Model3D.tsx",
                        lineNumber: 187,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/Model3D.tsx",
                lineNumber: 185,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/Model3D.tsx",
        lineNumber: 167,
        columnNumber: 5
    }, this);
}
function Callout({ anchor, labelPos, title, subtitle }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$Line$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Line"], {
                points: [
                    anchor,
                    labelPos
                ],
                color: "#67e8f9",
                lineWidth: 1,
                dashed: true,
                dashSize: 0.18,
                gapSize: 0.12,
                transparent: true,
                opacity: 0.75
            }, void 0, false, {
                fileName: "[project]/app/components/Model3D.tsx",
                lineNumber: 212,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
                position: labelPos,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$web$2f$Html$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Html"], {
                    transform: true,
                    distanceFactor: 10,
                    occlude: false,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            pointerEvents: 'none',
                            padding: '6px 10px',
                            borderRadius: 12,
                            border: '1px solid rgba(56,189,248,0.45)',
                            background: 'rgba(2,6,23,0.65)',
                            boxShadow: '0 10px 24px rgba(0,0,0,0.25)',
                            backdropFilter: 'blur(8px)',
                            minWidth: 120
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    fontSize: 12,
                                    fontWeight: 800,
                                    color: '#67e8f9',
                                    letterSpacing: 0.4
                                },
                                children: title
                            }, void 0, false, {
                                fileName: "[project]/app/components/Model3D.tsx",
                                lineNumber: 227,
                                columnNumber: 13
                            }, this),
                            subtitle ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    fontSize: 11,
                                    color: '#cbd5e1',
                                    marginTop: 2
                                },
                                children: subtitle
                            }, void 0, false, {
                                fileName: "[project]/app/components/Model3D.tsx",
                                lineNumber: 228,
                                columnNumber: 25
                            }, this) : null
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/Model3D.tsx",
                        lineNumber: 215,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/components/Model3D.tsx",
                    lineNumber: 214,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/Model3D.tsx",
                lineNumber: 213,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/Model3D.tsx",
        lineNumber: 211,
        columnNumber: 5
    }, this);
}
function StationShell() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
        position: [
            0,
            0,
            0
        ],
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$RoundedBox$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RoundedBox"], {
                args: [
                    7.8,
                    2.4,
                    4.2
                ],
                position: [
                    0,
                    1.2,
                    0
                ],
                radius: 0.06,
                renderOrder: 1,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                    color: "#0b1222",
                    transparent: true,
                    opacity: 0.10,
                    roughness: 0.55,
                    metalness: 0.15,
                    depthWrite: false
                }, void 0, false, {
                    fileName: "[project]/app/components/Model3D.tsx",
                    lineNumber: 240,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/Model3D.tsx",
                lineNumber: 239,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("lineSegments", {
                position: [
                    0,
                    1.2,
                    0
                ],
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("edgesGeometry", {
                        args: [
                            new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$facade$3e$__.BoxGeometry(7.8, 2.4, 4.2)
                        ]
                    }, void 0, false, {
                        fileName: "[project]/app/components/Model3D.tsx",
                        lineNumber: 251,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("lineBasicMaterial", {
                        color: "#0b2a55",
                        transparent: true,
                        opacity: 0.12,
                        depthWrite: false
                    }, void 0, false, {
                        fileName: "[project]/app/components/Model3D.tsx",
                        lineNumber: 252,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/Model3D.tsx",
                lineNumber: 250,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$RoundedBox$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RoundedBox"], {
                args: [
                    7.6,
                    0.05,
                    4.0
                ],
                position: [
                    0,
                    0.025,
                    0
                ],
                radius: 0.04,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                    color: "#0f172a",
                    metalness: 0.6,
                    roughness: 0.35
                }, void 0, false, {
                    fileName: "[project]/app/components/Model3D.tsx",
                    lineNumber: 256,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/Model3D.tsx",
                lineNumber: 255,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$RoundedBox$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RoundedBox"], {
                args: [
                    7.4,
                    2.2,
                    0.04
                ],
                position: [
                    0,
                    1.1,
                    -1.35
                ],
                radius: 0.02,
                renderOrder: 2,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                    color: "#1e293b",
                    transparent: true,
                    opacity: 0.14,
                    metalness: 0.15,
                    roughness: 0.9,
                    depthWrite: false
                }, void 0, false, {
                    fileName: "[project]/app/components/Model3D.tsx",
                    lineNumber: 260,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/Model3D.tsx",
                lineNumber: 259,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$RoundedBox$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RoundedBox"], {
                args: [
                    7.4,
                    2.2,
                    0.04
                ],
                position: [
                    0,
                    1.1,
                    1.35
                ],
                radius: 0.02,
                renderOrder: 2,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                    color: "#1e293b",
                    transparent: true,
                    opacity: 0.14,
                    metalness: 0.15,
                    roughness: 0.9,
                    depthWrite: false
                }, void 0, false, {
                    fileName: "[project]/app/components/Model3D.tsx",
                    lineNumber: 270,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/Model3D.tsx",
                lineNumber: 269,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/Model3D.tsx",
        lineNumber: 238,
        columnNumber: 5
    }, this);
}
function SwapBay() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
        position: [
            0,
            0.02,
            1.55
        ],
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$RoundedBox$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RoundedBox"], {
                args: [
                    7.2,
                    0.05,
                    1.35
                ],
                position: [
                    0,
                    0.025,
                    0
                ],
                radius: 0.04,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                    color: "#0b1222",
                    metalness: 0.35,
                    roughness: 0.85
                }, void 0, false, {
                    fileName: "[project]/app/components/Model3D.tsx",
                    lineNumber: 287,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/Model3D.tsx",
                lineNumber: 286,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$Line$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Line"], {
                points: [
                    [
                        -3.4,
                        0.06,
                        0.55
                    ],
                    [
                        3.4,
                        0.06,
                        0.55
                    ]
                ],
                color: "#38bdf8",
                lineWidth: 1,
                transparent: true,
                opacity: 0.35
            }, void 0, false, {
                fileName: "[project]/app/components/Model3D.tsx",
                lineNumber: 289,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$Line$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Line"], {
                points: [
                    [
                        -3.4,
                        0.06,
                        -0.55
                    ],
                    [
                        3.4,
                        0.06,
                        -0.55
                    ]
                ],
                color: "#38bdf8",
                lineWidth: 1,
                transparent: true,
                opacity: 0.35
            }, void 0, false, {
                fileName: "[project]/app/components/Model3D.tsx",
                lineNumber: 290,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$Line$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Line"], {
                points: [
                    [
                        -3.4,
                        0.06,
                        -0.55
                    ],
                    [
                        -3.4,
                        0.06,
                        0.55
                    ]
                ],
                color: "#38bdf8",
                lineWidth: 1,
                transparent: true,
                opacity: 0.35
            }, void 0, false, {
                fileName: "[project]/app/components/Model3D.tsx",
                lineNumber: 291,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$Line$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Line"], {
                points: [
                    [
                        3.4,
                        0.06,
                        -0.55
                    ],
                    [
                        3.4,
                        0.06,
                        0.55
                    ]
                ],
                color: "#38bdf8",
                lineWidth: 1,
                transparent: true,
                opacity: 0.35
            }, void 0, false, {
                fileName: "[project]/app/components/Model3D.tsx",
                lineNumber: 292,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/Model3D.tsx",
        lineNumber: 285,
        columnNumber: 5
    }, this);
}
function EquipmentBay() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
        position: [
            0,
            0.02,
            -1.55
        ],
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$RoundedBox$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RoundedBox"], {
            args: [
                7.2,
                0.05,
                1.35
            ],
            position: [
                0,
                0.025,
                0
            ],
            radius: 0.04,
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                color: "#0b1222",
                metalness: 0.35,
                roughness: 0.85
            }, void 0, false, {
                fileName: "[project]/app/components/Model3D.tsx",
                lineNumber: 301,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/components/Model3D.tsx",
            lineNumber: 300,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/components/Model3D.tsx",
        lineNumber: 299,
        columnNumber: 5
    }, this);
}
function StationModel({ mode, temperature, alertLevel, fireWallState, extinguishState, onSelectModule }) {
    const fireWallActive = alertLevel === 'critical';
    const hideStationShell = DEBUG_HIDE_LEVEL >= 1;
    const hideRoof = DEBUG_HIDE_LEVEL >= 2;
    const debugBays = DEBUG_HIDE_LEVEL >= 3;
    const hideEnergyStorage = debugBays && DEBUG_HIDE_BAYS_LEVEL >= 1;
    const hideBatteryRacks = debugBays && DEBUG_HIDE_BAYS_LEVEL >= 2;
    const hideBatterySystem = debugBays && DEBUG_HIDE_BAYS_LEVEL >= 3;
    const hideFireProtection = debugBays && DEBUG_HIDE_BAYS_LEVEL >= 4;
    const hideExtinguish = debugBays && DEBUG_HIDE_BAYS_LEVEL >= 5;
    const hideBaysFloors = DEBUG_HIDE_LEVEL >= 4;
    const faultPos = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const p = BATTERY_SYSTEM_MODULE_POSITIONS[FAULT_MODULE_INDEX];
        return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$facade$3e$__.Vector3(p[0], p[1], p[2]);
    }, []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
        children: [
            !hideStationShell && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(StationShell, {}, void 0, false, {
                fileName: "[project]/app/components/Model3D.tsx",
                lineNumber: 327,
                columnNumber: 29
            }, this),
            !hideRoof && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(RoofWithSolar, {}, void 0, false, {
                fileName: "[project]/app/components/Model3D.tsx",
                lineNumber: 328,
                columnNumber: 21
            }, this),
            !hideEnergyStorage && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
                position: [
                    -1.9,
                    0.03,
                    -1.7
                ],
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(EnergyStorageSystem, {
                    mode: mode,
                    temperature: temperature
                }, void 0, false, {
                    fileName: "[project]/app/components/Model3D.tsx",
                    lineNumber: 335,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/Model3D.tsx",
                lineNumber: 334,
                columnNumber: 9
            }, this),
            !hideBaysFloors && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(SwapBay, {}, void 0, false, {
                fileName: "[project]/app/components/Model3D.tsx",
                lineNumber: 339,
                columnNumber: 27
            }, this),
            (!hideBatteryRacks || !hideBatterySystem || !hideFireProtection && fireWallActive && fireWallState !== 'open' || !hideExtinguish && extinguishState !== 'standby') && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
                position: [
                    0,
                    0.03,
                    0
                ],
                children: [
                    !hideBatteryRacks && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(BatteryRacks, {
                        mode: mode,
                        temperature: temperature
                    }, void 0, false, {
                        fileName: "[project]/app/components/Model3D.tsx",
                        lineNumber: 343,
                        columnNumber: 33
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
                        position: [
                            0,
                            0.0,
                            0
                        ],
                        children: [
                            !hideBatterySystem && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(BatterySystem, {
                                temperature: temperature,
                                mode: mode,
                                onSelectModule: onSelectModule
                            }, void 0, false, {
                                fileName: "[project]/app/components/Model3D.tsx",
                                lineNumber: 345,
                                columnNumber: 36
                            }, this),
                            !hideFireProtection && fireWallActive && fireWallState !== 'open' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(FireProtectionSystem, {
                                active: fireWallActive,
                                fireWallState: fireWallState,
                                targetPos: faultPos
                            }, void 0, false, {
                                fileName: "[project]/app/components/Model3D.tsx",
                                lineNumber: 347,
                                columnNumber: 15
                            }, this),
                            !hideExtinguish && extinguishState !== 'standby' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ExtinguishSpray, {
                                state: extinguishState,
                                targetPos: faultPos
                            }, void 0, false, {
                                fileName: "[project]/app/components/Model3D.tsx",
                                lineNumber: 349,
                                columnNumber: 66
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/Model3D.tsx",
                        lineNumber: 344,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/Model3D.tsx",
                lineNumber: 342,
                columnNumber: 9
            }, this),
            !hideBaysFloors && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(EquipmentBay, {}, void 0, false, {
                fileName: "[project]/app/components/Model3D.tsx",
                lineNumber: 354,
                columnNumber: 27
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/Model3D.tsx",
        lineNumber: 326,
        columnNumber: 5
    }, this);
}
// RackBatteryModule 已替换为 SmallBatteryModuleWithPCM（从 BatteryModuleWithPCM.tsx 导入）
function BatteryRacks({ mode, temperature }) {
    const racks = [];
    // 电池架 - 展示清晰的层级结构
    for(let side = -1; side <= 1; side += 2){
        for(let col = 1; col <= 2; col++){
            const x = side * 2.75;
            const z = -0.9 + col * 0.6;
            racks.push(/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
                position: [
                    x,
                    0.45,
                    z
                ],
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$RoundedBox$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RoundedBox"], {
                        args: [
                            0.6,
                            2.0,
                            0.9
                        ],
                        radius: 0.04,
                        renderOrder: 3,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                            color: "#0f172a",
                            transparent: true,
                            opacity: 0.14,
                            roughness: 0.25,
                            metalness: 0.25,
                            depthWrite: false
                        }, void 0, false, {
                            fileName: "[project]/app/components/Model3D.tsx",
                            lineNumber: 374,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/components/Model3D.tsx",
                        lineNumber: 373,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("lineSegments", {
                        renderOrder: 4,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("edgesGeometry", {
                                args: [
                                    new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$facade$3e$__.BoxGeometry(0.6, 2.0, 0.9)
                                ]
                            }, void 0, false, {
                                fileName: "[project]/app/components/Model3D.tsx",
                                lineNumber: 385,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("lineBasicMaterial", {
                                color: "#1e293b",
                                transparent: true,
                                opacity: 0.18,
                                depthTest: true,
                                depthWrite: false
                            }, void 0, false, {
                                fileName: "[project]/app/components/Model3D.tsx",
                                lineNumber: 386,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/Model3D.tsx",
                        lineNumber: 384,
                        columnNumber: 11
                    }, this),
                    [
                        -0.35,
                        -0.05,
                        0.25,
                        0.55,
                        0.85
                    ].map((y, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$RoundedBox$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RoundedBox"], {
                            args: [
                                0.52,
                                0.04,
                                0.82
                            ],
                            position: [
                                0,
                                y,
                                0
                            ],
                            radius: 0.02,
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                                color: "#1e293b",
                                metalness: 0.35,
                                roughness: 0.6,
                                transparent: true,
                                opacity: 0.18,
                                depthWrite: false
                            }, void 0, false, {
                                fileName: "[project]/app/components/Model3D.tsx",
                                lineNumber: 392,
                                columnNumber: 15
                            }, this)
                        }, i, false, {
                            fileName: "[project]/app/components/Model3D.tsx",
                            lineNumber: 391,
                            columnNumber: 13
                        }, this)),
                    !HIDE_BATTERY_MODULES && [
                        -0.3,
                        0.0,
                        0.3,
                        0.6,
                        0.9
                    ].flatMap((y, rowIdx)=>[
                            -0.18,
                            0.0,
                            0.18
                        ].map((xOff, colIdx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$BatteryModuleWithPCM$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BatteryModuleWithPCM"], {
                                position: [
                                    xOff,
                                    y,
                                    0.12
                                ],
                                scale: 0.145,
                                mode: mode,
                                temperature: temperature,
                                isFault: false,
                                showDetails: false
                            }, `cell-${rowIdx}-${colIdx}`, false, {
                                fileName: "[project]/app/components/Model3D.tsx",
                                lineNumber: 407,
                                columnNumber: 17
                            }, this)))
                ]
            }, `rack-${side}-${col}`, true, {
                fileName: "[project]/app/components/Model3D.tsx",
                lineNumber: 371,
                columnNumber: 9
            }, this));
        }
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
        children: racks
    }, void 0, false, {
        fileName: "[project]/app/components/Model3D.tsx",
        lineNumber: 423,
        columnNumber: 10
    }, this);
}
// BatteryModule 已替换为 BatteryModuleWithPCM（从 BatteryModuleWithPCM.tsx 导入）
function PCMSectionInset() {
    return null;
}
// ============ 能量流动粒子（增强版）============
function EnergyFlowParticles({ mode }) {
    const particlesRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const count = 120;
    const tRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(0);
    const solarToStorageCurve = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$facade$3e$__.CatmullRomCurve3([
            new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$facade$3e$__.Vector3(0.0, 2.85, 0.0),
            new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$facade$3e$__.Vector3(0.4, 2.35, -0.6),
            new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$facade$3e$__.Vector3(1.4, 1.25, -1.15),
            new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$facade$3e$__.Vector3(2.55, 0.95, -1.15)
        ], false), []);
    const storageToBatteryCurve = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$facade$3e$__.CatmullRomCurve3([
            new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$facade$3e$__.Vector3(2.55, 0.95, -1.15),
            new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$facade$3e$__.Vector3(1.7, 0.95, -0.7),
            new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$facade$3e$__.Vector3(0.8, 0.9, -0.15),
            new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$facade$3e$__.Vector3(0.0, 0.95, 0.0)
        ], false), []);
    const { positions, colors, sizes, phases } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const pos = new Float32Array(count * 3);
        const col = new Float32Array(count * 3);
        const siz = new Float32Array(count);
        const ph = new Float32Array(count);
        for(let i = 0; i < count; i++){
            // 分布在不同的能量流路径上（仅保留能量流，不要无用环境绿点）
            const pathType = i % 2;
            if (pathType === 0) {
                // 光伏到储能路径（沿曲线连续流动）
                pos[i * 3] = 0;
                pos[i * 3 + 1] = 2.5;
                pos[i * 3 + 2] = -2;
            } else if (pathType === 1) {
                // 储能到电池路径（沿曲线连续流动）
                pos[i * 3] = -2;
                pos[i * 3 + 1] = 0.6;
                pos[i * 3 + 2] = -1.2;
            }
            ph[i] = Math.random();
            // 绿色能量粒子
            col[i * 3] = 0.13 + Math.random() * 0.2;
            col[i * 3 + 1] = 0.77 + Math.random() * 0.2;
            col[i * 3 + 2] = 0.37 + Math.random() * 0.2;
            siz[i] = 0.03 + Math.random() * 0.05;
        }
        return {
            positions: pos,
            colors: col,
            sizes: siz,
            phases: ph
        };
    }, []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$776716bd$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__F__as__useFrame$3e$__["useFrame"])((_, delta)=>{
        if (!particlesRef.current || mode === 'idle') return;
        tRef.current += delta;
        const arr = particlesRef.current.geometry.attributes.position.array;
        const colArr = particlesRef.current.geometry.attributes.color.array;
        for(let i = 0; i < count; i++){
            const pathType = i % 2;
            if (pathType === 0) {
                // 光伏到储能：沿曲线连续流动
                const speed = mode === 'abnormal' ? 0.35 : 0.22;
                const t = (phases[i] + tRef.current * speed) % 1;
                const p = solarToStorageCurve.getPointAt(t);
                arr[i * 3] = p.x;
                arr[i * 3 + 1] = p.y;
                arr[i * 3 + 2] = p.z;
            } else if (pathType === 1) {
                // 储能到电池：沿曲线连续流动
                const speed = mode === 'abnormal' ? 0.38 : 0.25;
                const t = (phases[i] + tRef.current * speed) % 1;
                const p = storageToBatteryCurve.getPointAt(t);
                arr[i * 3] = p.x;
                arr[i * 3 + 1] = p.y;
                arr[i * 3 + 2] = p.z;
            } else {
                // 环境粒子：缓慢上升
                arr[i * 3 + 1] += delta * 0.3;
                if (arr[i * 3 + 1] > 2.5) arr[i * 3 + 1] = 0.3;
            }
            // 能源粒子保持绿色（异常演示时也不变色）
            colArr[i * 3] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$facade$3e$__.MathUtils.clamp(colArr[i * 3], 0.13, 0.35);
            colArr[i * 3 + 1] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$facade$3e$__.MathUtils.clamp(colArr[i * 3 + 1], 0.77, 0.97);
            colArr[i * 3 + 2] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$facade$3e$__.MathUtils.clamp(colArr[i * 3 + 2], 0.37, 0.57);
        }
        particlesRef.current.geometry.attributes.position.needsUpdate = true;
        particlesRef.current.geometry.attributes.color.needsUpdate = true;
    });
    if (mode === 'idle') return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("points", {
        ref: particlesRef,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("bufferGeometry", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("bufferAttribute", {
                        attach: "attributes-position",
                        count: count,
                        array: positions,
                        itemSize: 3
                    }, void 0, false, {
                        fileName: "[project]/app/components/Model3D.tsx",
                        lineNumber: 543,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("bufferAttribute", {
                        attach: "attributes-color",
                        count: count,
                        array: colors,
                        itemSize: 3
                    }, void 0, false, {
                        fileName: "[project]/app/components/Model3D.tsx",
                        lineNumber: 544,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("bufferAttribute", {
                        attach: "attributes-size",
                        count: count,
                        array: sizes,
                        itemSize: 1
                    }, void 0, false, {
                        fileName: "[project]/app/components/Model3D.tsx",
                        lineNumber: 545,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/Model3D.tsx",
                lineNumber: 542,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("pointsMaterial", {
                size: 0.05,
                vertexColors: true,
                transparent: true,
                opacity: 0.8,
                sizeAttenuation: true,
                blending: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$facade$3e$__.AdditiveBlending
            }, void 0, false, {
                fileName: "[project]/app/components/Model3D.tsx",
                lineNumber: 547,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/Model3D.tsx",
        lineNumber: 541,
        columnNumber: 5
    }, this);
}
// ============ 光伏阵列（真实太阳能板样式）============
function SolarArray() {
    const panels = [];
    const rows = 2;
    const cols = 4;
    const spacing = 1.1;
    // 单块太阳能板组件
    const SolarPanel = ({ position })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
            position: position,
            rotation: [
                0.55,
                0,
                0
            ],
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$RoundedBox$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RoundedBox"], {
                    args: [
                        0.95,
                        0.035,
                        0.6
                    ],
                    radius: 0.008,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                        color: "#c0c0c0",
                        metalness: 0.85,
                        roughness: 0.25
                    }, void 0, false, {
                        fileName: "[project]/app/components/Model3D.tsx",
                        lineNumber: 571,
                        columnNumber: 9
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/components/Model3D.tsx",
                    lineNumber: 570,
                    columnNumber: 7
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$RoundedBox$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RoundedBox"], {
                    args: [
                        0.88,
                        0.03,
                        0.53
                    ],
                    position: [
                        0,
                        0.003,
                        0
                    ],
                    radius: 0.005,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                        color: "#1a1a2e",
                        emissive: "#1e3a5f",
                        emissiveIntensity: 0.15,
                        metalness: 0.3,
                        roughness: 0.15
                    }, void 0, false, {
                        fileName: "[project]/app/components/Model3D.tsx",
                        lineNumber: 576,
                        columnNumber: 9
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/components/Model3D.tsx",
                    lineNumber: 575,
                    columnNumber: 7
                }, this),
                [
                    -0.35,
                    -0.12,
                    0.12,
                    0.35
                ].map((x, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$shapes$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Box"], {
                        args: [
                            0.008,
                            0.001,
                            0.48
                        ],
                        position: [
                            x,
                            0.018,
                            0
                        ],
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                            color: "#d4d4d4",
                            metalness: 0.9,
                            roughness: 0.1
                        }, void 0, false, {
                            fileName: "[project]/app/components/Model3D.tsx",
                            lineNumber: 589,
                            columnNumber: 11
                        }, this)
                    }, `vbus-${i}`, false, {
                        fileName: "[project]/app/components/Model3D.tsx",
                        lineNumber: 588,
                        columnNumber: 9
                    }, this)),
                [
                    -0.18,
                    0,
                    0.18
                ].map((z, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$shapes$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Box"], {
                        args: [
                            0.82,
                            0.001,
                            0.003
                        ],
                        position: [
                            0,
                            0.018,
                            z
                        ],
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                            color: "#a3a3a3",
                            metalness: 0.7,
                            roughness: 0.2
                        }, void 0, false, {
                            fileName: "[project]/app/components/Model3D.tsx",
                            lineNumber: 595,
                            columnNumber: 11
                        }, this)
                    }, `hbus-${i}`, false, {
                        fileName: "[project]/app/components/Model3D.tsx",
                        lineNumber: 594,
                        columnNumber: 9
                    }, this)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$shapes$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Box"], {
                    args: [
                        0.12,
                        0.04,
                        0.08
                    ],
                    position: [
                        0,
                        -0.035,
                        0.2
                    ],
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                        color: "#262626",
                        metalness: 0.5,
                        roughness: 0.6
                    }, void 0, false, {
                        fileName: "[project]/app/components/Model3D.tsx",
                        lineNumber: 601,
                        columnNumber: 9
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/components/Model3D.tsx",
                    lineNumber: 600,
                    columnNumber: 7
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$shapes$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Cylinder"], {
                    args: [
                        0.012,
                        0.012,
                        0.28
                    ],
                    position: [
                        0.38,
                        -0.14,
                        0.22
                    ],
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                        color: "#71717a",
                        metalness: 0.85,
                        roughness: 0.3
                    }, void 0, false, {
                        fileName: "[project]/app/components/Model3D.tsx",
                        lineNumber: 606,
                        columnNumber: 9
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/components/Model3D.tsx",
                    lineNumber: 605,
                    columnNumber: 7
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$shapes$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Cylinder"], {
                    args: [
                        0.012,
                        0.012,
                        0.28
                    ],
                    position: [
                        -0.38,
                        -0.14,
                        0.22
                    ],
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                        color: "#71717a",
                        metalness: 0.85,
                        roughness: 0.3
                    }, void 0, false, {
                        fileName: "[project]/app/components/Model3D.tsx",
                        lineNumber: 609,
                        columnNumber: 9
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/components/Model3D.tsx",
                    lineNumber: 608,
                    columnNumber: 7
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/components/Model3D.tsx",
            lineNumber: 568,
            columnNumber: 5
        }, this);
    for(let r = 0; r < rows; r++){
        for(let c = 0; c < cols; c++){
            const x = (c - (cols - 1) / 2) * spacing;
            const z = -0.35 + r * 0.62;
            panels.push(/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(SolarPanel, {
                position: [
                    x,
                    0.12,
                    z
                ]
            }, `solar-${r}-${c}`, false, {
                fileName: "[project]/app/components/Model3D.tsx",
                lineNumber: 618,
                columnNumber: 19
            }, this));
        }
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
        children: panels
    }, void 0, false, {
        fileName: "[project]/app/components/Model3D.tsx",
        lineNumber: 621,
        columnNumber: 10
    }, this);
}
function RoofWithSolar() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
        position: [
            0,
            2.55,
            0
        ],
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {}, void 0, false, {
                fileName: "[project]/app/components/Model3D.tsx",
                lineNumber: 628,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
                position: [
                    0,
                    0.1,
                    0.15
                ],
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$RoundedBox$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RoundedBox"], {
                    args: [
                        7.55,
                        0.08,
                        2.1
                    ],
                    position: [
                        0,
                        0.35,
                        0
                    ],
                    rotation: [
                        0.0,
                        0.0,
                        0.0
                    ],
                    radius: 0.02,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                        color: "#334155",
                        metalness: 0.15,
                        roughness: 0.7,
                        emissive: "#0b1222",
                        emissiveIntensity: 0.15
                    }, void 0, false, {
                        fileName: "[project]/app/components/Model3D.tsx",
                        lineNumber: 632,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/components/Model3D.tsx",
                    lineNumber: 631,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/Model3D.tsx",
                lineNumber: 630,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
                position: [
                    -2.15,
                    0.55,
                    -0.6
                ],
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(SolarArray, {}, void 0, false, {
                    fileName: "[project]/app/components/Model3D.tsx",
                    lineNumber: 638,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/Model3D.tsx",
                lineNumber: 637,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
                position: [
                    0.25,
                    0.55,
                    -0.6
                ],
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(SolarArray, {}, void 0, false, {
                    fileName: "[project]/app/components/Model3D.tsx",
                    lineNumber: 641,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/Model3D.tsx",
                lineNumber: 640,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
                position: [
                    2.65,
                    0.55,
                    -0.6
                ],
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(SolarArray, {}, void 0, false, {
                    fileName: "[project]/app/components/Model3D.tsx",
                    lineNumber: 644,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/Model3D.tsx",
                lineNumber: 643,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/Model3D.tsx",
        lineNumber: 626,
        columnNumber: 5
    }, this);
}
// BatteryCluster 已替换为 BatteryClusterWithPCM（从 BatteryModuleWithPCM.tsx 导入）
function EnergyStorageSystem({ mode, temperature }) {
    // 储能柜 - 展示清晰的层级结构
    const positions = [
        [
            -0.45,
            -0.45
        ],
        [
            0.45,
            -0.45
        ],
        [
            -0.45,
            0.45
        ],
        [
            0.45,
            0.45
        ]
    ];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$RoundedBox$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RoundedBox"], {
            args: [
                1.4,
                1.1,
                1.4
            ],
            position: [
                0,
                0.5,
                0
            ],
            radius: 0.08,
            renderOrder: 4,
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                color: "#0f172a",
                metalness: 0.4,
                roughness: 0.7,
                transparent: true,
                opacity: 0.18,
                depthWrite: false
            }, void 0, false, {
                fileName: "[project]/app/components/Model3D.tsx",
                lineNumber: 665,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/components/Model3D.tsx",
            lineNumber: 664,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/components/Model3D.tsx",
        lineNumber: 662,
        columnNumber: 5
    }, this);
}
// ============ 电池仓+PCM+热管理（体现内部结构）============
function BatterySystem({ temperature, mode, onSelectModule }) {
    const pcmMatRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const fanRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const abnormalLamp = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        if (mode !== 'abnormal') return {
            col: '#22c55e',
            emi: '#22c55e',
            intensity: 0.7
        };
        const t = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$facade$3e$__.MathUtils.clamp((temperature - 45) / 55, 0, 1);
        const col = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$facade$3e$__.Color('#22c55e').lerp(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$facade$3e$__.Color('#f97316'), Math.min(1, t * 1.1)).lerp(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$facade$3e$__.Color('#ef4444'), Math.max(0, t - 0.25) / 0.75);
        const hex = `#${col.getHexString()}`;
        return {
            col: hex,
            emi: hex,
            intensity: 0.45 + 0.75 * t
        };
    }, [
        mode,
        temperature
    ]);
    const pcmColor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        if (mode === 'abnormal' && temperature > 60) {
            return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$facade$3e$__.Color('#f97316').lerp(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$facade$3e$__.Color('#dc2626'), Math.min(1, (temperature - 60) / 50));
        }
        return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$facade$3e$__.Color('#14b8a6');
    }, [
        mode,
        temperature
    ]);
    const melt = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        if (mode === 'abnormal') return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$facade$3e$__.MathUtils.clamp((temperature - 32) / 70, 0, 1);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$facade$3e$__.MathUtils.clamp((temperature - 28) / 8, 0, 0.35);
    }, [
        mode,
        temperature
    ]);
    const pcmShader = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const vertexShader = `
      varying vec3 vPos;
      varying vec3 vN;
      void main(){
        vPos = position;
        vN = normal;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;
        const fragmentShader = `
      uniform float uTime;
      uniform float uMelt;
      uniform vec3 uBase;
      uniform vec3 uHot;
      varying vec3 vPos;
      varying vec3 vN;

      float hash(vec2 p){
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
      }

      float noise(vec2 p){
        vec2 i = floor(p);
        vec2 f = fract(p);
        float a = hash(i);
        float b = hash(i + vec2(1.0, 0.0));
        float c = hash(i + vec2(0.0, 1.0));
        float d = hash(i + vec2(1.0, 1.0));
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
      }

      void main(){
        vec2 uv = vPos.xz * 1.25;
        float n1 = noise(uv + vec2(uTime * 0.12, uTime * 0.08));
        float n2 = noise(uv * 2.2 - vec2(uTime * 0.18, uTime * 0.14));
        float n = (n1 * 0.65 + n2 * 0.35);

        float ripples = sin((uv.x + uv.y) * 7.5 + uTime * 2.0) * 0.04;
        float liquidMask = smoothstep(0.18, 0.88, uMelt + (n - 0.5) * 0.35 + ripples);

        vec3 base = mix(uBase, uHot, smoothstep(0.35, 1.0, uMelt));
        vec3 col = mix(uBase, base, liquidMask);

        float fresnel = pow(1.0 - max(dot(normalize(vN), vec3(0.0, 1.0, 0.0)), 0.0), 2.2);
        float sheen = smoothstep(0.2, 1.0, fresnel) * (0.12 + 0.22 * liquidMask);
        col += vec3(sheen);

        float alpha = mix(0.72, 0.88, liquidMask);
        gl_FragColor = vec4(col, alpha);
      }
    `;
        return {
            vertexShader,
            fragmentShader
        };
    }, []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$776716bd$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__F__as__useFrame$3e$__["useFrame"])((_, delta)=>{
        if (pcmMatRef.current) {
            pcmMatRef.current.uniforms.uTime.value += delta;
            pcmMatRef.current.uniforms.uMelt.value = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$facade$3e$__.MathUtils.lerp(pcmMatRef.current.uniforms.uMelt.value, melt, 1 - Math.pow(0.001, delta));
            pcmMatRef.current.uniforms.uBase.value.copy(pcmColor);
        }
        if (fanRef.current) {
            const target = mode === 'idle' ? 0 : mode === 'abnormal' ? 5.5 : 2.8;
            fanRef.current.rotation.z += delta * target;
        }
    });
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
        position: [
            0,
            0,
            0
        ],
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$RoundedBox$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RoundedBox"], {
                args: [
                    3.2,
                    1.8,
                    2.2
                ],
                position: [
                    0,
                    0.9,
                    0
                ],
                radius: 0.06,
                raycast: ()=>null,
                renderOrder: 3,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                    color: "#0f172a",
                    transparent: true,
                    opacity: 0.14,
                    roughness: 0.25,
                    metalness: 0.25,
                    depthWrite: false
                }, void 0, false, {
                    fileName: "[project]/app/components/Model3D.tsx",
                    lineNumber: 799,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/Model3D.tsx",
                lineNumber: 792,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("lineSegments", {
                position: [
                    0,
                    0.9,
                    0
                ],
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("edgesGeometry", {
                        args: [
                            new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$facade$3e$__.BoxGeometry(3.2, 1.8, 2.2)
                        ]
                    }, void 0, false, {
                        fileName: "[project]/app/components/Model3D.tsx",
                        lineNumber: 811,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("lineBasicMaterial", {
                        color: "#334155",
                        transparent: true,
                        opacity: 0.12,
                        depthWrite: false
                    }, void 0, false, {
                        fileName: "[project]/app/components/Model3D.tsx",
                        lineNumber: 812,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/Model3D.tsx",
                lineNumber: 810,
                columnNumber: 7
            }, this),
            !HIDE_BATTERY_MODULES && BATTERY_SYSTEM_MODULE_POSITIONS.map((pos, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
                    position: pos,
                    onDoubleClick: ()=>onSelectModule(i),
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$BatteryModuleWithPCM$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BatteryModuleWithPCM"], {
                            position: [
                                0,
                                0,
                                0
                            ],
                            scale: 0.64,
                            mode: mode,
                            temperature: temperature,
                            isFault: i === FAULT_MODULE_INDEX,
                            showDetails: true
                        }, void 0, false, {
                            fileName: "[project]/app/components/Model3D.tsx",
                            lineNumber: 820,
                            columnNumber: 13
                        }, this),
                        i === FAULT_MODULE_INDEX && mode === 'abnormal' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
                            position: [
                                0,
                                0.55,
                                0
                            ],
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("pointLight", {
                                color: "#ef4444",
                                intensity: 1.6,
                                distance: 2.5
                            }, void 0, false, {
                                fileName: "[project]/app/components/Model3D.tsx",
                                lineNumber: 830,
                                columnNumber: 17
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/components/Model3D.tsx",
                            lineNumber: 829,
                            columnNumber: 15
                        }, this)
                    ]
                }, `bm-${i}`, true, {
                    fileName: "[project]/app/components/Model3D.tsx",
                    lineNumber: 819,
                    columnNumber: 11
                }, this))
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/Model3D.tsx",
        lineNumber: 790,
        columnNumber: 5
    }, this);
}
// ============ 消防系统 ============
function FireProtectionSystem({ active, fireWallState, targetPos }) {
    const wallRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const wallProgressRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(0);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$776716bd$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__F__as__useFrame$3e$__["useFrame"])((_, delta)=>{
        const speed = 1 / 3;
        if (fireWallState === 'open') wallProgressRef.current = Math.max(0, wallProgressRef.current - delta * 1.8);
        if (fireWallState === 'closing') wallProgressRef.current = Math.min(1, wallProgressRef.current + delta * speed);
        if (fireWallState === 'closed') wallProgressRef.current = Math.min(1, wallProgressRef.current + delta * 1.8);
        if (wallRef.current) {
            const p = wallProgressRef.current;
            const startY = 2.25;
            const endY = 0.55;
            wallRef.current.position.x = targetPos.x;
            wallRef.current.position.y = startY - p * (startY - endY);
            wallRef.current.position.z = targetPos.z;
            wallRef.current.rotation.set(0, 0, 0);
        }
    });
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
                ref: wallRef,
                position: [
                    0,
                    2.6,
                    0.55
                ],
                scale: 0.65,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$RoundedBox$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RoundedBox"], {
                            args: [
                                1.15,
                                0.9,
                                0.04
                            ],
                            position: [
                                0,
                                0,
                                0.35
                            ],
                            radius: 0.02,
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                                color: "#dc2626",
                                emissive: active ? '#ef4444' : '#991b1b',
                                emissiveIntensity: active ? 0.9 : 0.3,
                                transparent: true,
                                opacity: active ? 0.85 : 0.6
                            }, void 0, false, {
                                fileName: "[project]/app/components/Model3D.tsx",
                                lineNumber: 875,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/components/Model3D.tsx",
                            lineNumber: 874,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$RoundedBox$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RoundedBox"], {
                            args: [
                                1.15,
                                0.9,
                                0.04
                            ],
                            position: [
                                0,
                                0,
                                -0.35
                            ],
                            radius: 0.02,
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                                color: "#dc2626",
                                emissive: active ? '#ef4444' : '#991b1b',
                                emissiveIntensity: active ? 0.9 : 0.3,
                                transparent: true,
                                opacity: active ? 0.85 : 0.6
                            }, void 0, false, {
                                fileName: "[project]/app/components/Model3D.tsx",
                                lineNumber: 884,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/components/Model3D.tsx",
                            lineNumber: 883,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$RoundedBox$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RoundedBox"], {
                            args: [
                                0.04,
                                0.9,
                                0.62
                            ],
                            position: [
                                0.57,
                                0,
                                0
                            ],
                            radius: 0.02,
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                                color: "#dc2626",
                                emissive: active ? '#ef4444' : '#991b1b',
                                emissiveIntensity: active ? 0.9 : 0.3,
                                transparent: true,
                                opacity: active ? 0.85 : 0.6
                            }, void 0, false, {
                                fileName: "[project]/app/components/Model3D.tsx",
                                lineNumber: 893,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/components/Model3D.tsx",
                            lineNumber: 892,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$RoundedBox$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RoundedBox"], {
                            args: [
                                0.04,
                                0.9,
                                0.62
                            ],
                            position: [
                                -0.57,
                                0,
                                0
                            ],
                            radius: 0.02,
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                                color: "#dc2626",
                                emissive: active ? '#ef4444' : '#991b1b',
                                emissiveIntensity: active ? 0.9 : 0.3,
                                transparent: true,
                                opacity: active ? 0.85 : 0.6
                            }, void 0, false, {
                                fileName: "[project]/app/components/Model3D.tsx",
                                lineNumber: 902,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/components/Model3D.tsx",
                            lineNumber: 901,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$RoundedBox$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RoundedBox"], {
                            args: [
                                1.22,
                                0.05,
                                0.68
                            ],
                            position: [
                                0,
                                0.48,
                                0
                            ],
                            radius: 0.02,
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                                color: "#475569",
                                metalness: 0.95
                            }, void 0, false, {
                                fileName: "[project]/app/components/Model3D.tsx",
                                lineNumber: 911,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/components/Model3D.tsx",
                            lineNumber: 910,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("lineSegments", {
                            renderOrder: 999,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("edgesGeometry", {
                                    args: [
                                        new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$facade$3e$__.BoxGeometry(1.24, 0.96, 0.74)
                                    ]
                                }, void 0, false, {
                                    fileName: "[project]/app/components/Model3D.tsx",
                                    lineNumber: 915,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("lineBasicMaterial", {
                                    color: "#fb7185",
                                    transparent: true,
                                    opacity: active ? 1 : 0.7,
                                    depthTest: false,
                                    depthWrite: false
                                }, void 0, false, {
                                    fileName: "[project]/app/components/Model3D.tsx",
                                    lineNumber: 916,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/Model3D.tsx",
                            lineNumber: 914,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/components/Model3D.tsx",
                    lineNumber: 873,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/Model3D.tsx",
                lineNumber: 872,
                columnNumber: 7
            }, this),
            [
                [
                    -0.8,
                    1.85,
                    1
                ],
                [
                    0,
                    1.85,
                    1
                ],
                [
                    0.8,
                    1.85,
                    1
                ]
            ].map((pos, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$shapes$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Cylinder"], {
                    args: [
                        0.025,
                        0.025,
                        0.08
                    ],
                    position: pos,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                        color: "#94a3b8",
                        metalness: 0.9
                    }, void 0, false, {
                        fileName: "[project]/app/components/Model3D.tsx",
                        lineNumber: 924,
                        columnNumber: 11
                    }, this)
                }, i, false, {
                    fileName: "[project]/app/components/Model3D.tsx",
                    lineNumber: 923,
                    columnNumber: 9
                }, this))
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/Model3D.tsx",
        lineNumber: 870,
        columnNumber: 5
    }, this);
}
// ============ 传感器系统 ============
function SensorSystem({ mode, temperature }) {
    const sensorColor = mode === 'abnormal' && temperature > 60 ? '#ef4444' : '#22c55e';
    return null;
}
// ============ 数据流连接线 ============
function DataConnectionLines({ mode }) {
    const lineColor = mode === 'abnormal' ? '#f87171' : mode === 'normal' ? '#22c55e' : '#8b5cf6';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$Line$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Line"], {
                points: [
                    [
                        -2,
                        2.8,
                        -2.2
                    ],
                    [
                        -2.5,
                        0.5,
                        -1.5
                    ]
                ],
                color: lineColor,
                lineWidth: 1,
                transparent: true,
                opacity: 0.4
            }, void 0, false, {
                fileName: "[project]/app/components/Model3D.tsx",
                lineNumber: 945,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$Line$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Line"], {
                points: [
                    [
                        1,
                        2.8,
                        -2.2
                    ],
                    [
                        -2.5,
                        0.5,
                        -1.5
                    ]
                ],
                color: lineColor,
                lineWidth: 1,
                transparent: true,
                opacity: 0.4
            }, void 0, false, {
                fileName: "[project]/app/components/Model3D.tsx",
                lineNumber: 946,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$Line$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Line"], {
                points: [
                    [
                        -2.5,
                        0,
                        -1
                    ],
                    [
                        0,
                        0.5,
                        0
                    ]
                ],
                color: lineColor,
                lineWidth: 1,
                transparent: true,
                opacity: 0.4
            }, void 0, false, {
                fileName: "[project]/app/components/Model3D.tsx",
                lineNumber: 948,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$Line$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Line"], {
                points: [
                    [
                        -1.6,
                        0,
                        -1
                    ],
                    [
                        0,
                        0.5,
                        0
                    ]
                ],
                color: lineColor,
                lineWidth: 1,
                transparent: true,
                opacity: 0.4
            }, void 0, false, {
                fileName: "[project]/app/components/Model3D.tsx",
                lineNumber: 949,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/Model3D.tsx",
        lineNumber: 943,
        columnNumber: 5
    }, this);
}
function CameraRig({ focus, controlsRef }) {
    const { camera } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$776716bd$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__D__as__useThree$3e$__["useThree"])();
    const targetPosRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$facade$3e$__.Vector3(6, 4, 8));
    const targetLookRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$facade$3e$__.Vector3(0, 0.9, 0));
    const tmpV = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$facade$3e$__.Vector3(), []);
    const isAutoMoveRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(true);
    const lastFocusRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])('overview');
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$776716bd$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__F__as__useFrame$3e$__["useFrame"])((_, delta)=>{
        const controls = controlsRef.current;
        if (controls && controls.__isUserInteracting) {
            isAutoMoveRef.current = false;
            return;
        }
        if (focus !== lastFocusRef.current) {
            lastFocusRef.current = focus;
            isAutoMoveRef.current = true;
        }
        if (!isAutoMoveRef.current) return;
        const presets = {
            overview: {
                pos: [
                    9.5,
                    6.2,
                    9.8
                ],
                look: [
                    0,
                    1.0,
                    0
                ]
            },
            light: {
                pos: [
                    0.0,
                    4.15,
                    -2.65
                ],
                look: [
                    0.0,
                    2.75,
                    -0.75
                ]
            },
            storage: {
                pos: [
                    -5.2,
                    2.2,
                    -2.4
                ],
                look: [
                    -2.1,
                    0.55,
                    -1.1
                ]
            },
            thermal: {
                pos: [
                    4.9,
                    2.9,
                    4.8
                ],
                look: [
                    0,
                    0.95,
                    0.2
                ]
            },
            fire: {
                pos: [
                    0.1,
                    2.2,
                    5.4
                ],
                look: [
                    0,
                    1.0,
                    1.1
                ]
            }
        };
        const preset = presets[focus];
        targetPosRef.current.set(preset.pos[0], preset.pos[1], preset.pos[2]);
        targetLookRef.current.set(preset.look[0], preset.look[1], preset.look[2]);
        const t = 1 - Math.pow(0.0006, delta);
        camera.position.lerp(targetPosRef.current, t);
        if (controls && controls.target) {
            tmpV.copy(controls.target);
            tmpV.lerp(targetLookRef.current, t);
            controls.target.copy(tmpV);
            controls.update();
        } else {
            camera.lookAt(targetLookRef.current);
        }
        const posDone = camera.position.distanceTo(targetPosRef.current) < 0.02;
        const lookDone = controls && controls.target ? controls.target.distanceTo(targetLookRef.current) < 0.02 : true;
        if (posDone && lookDone) {
            isAutoMoveRef.current = false;
        }
    });
    return null;
}
// ============ 主体底座 ============
function Platform() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$RoundedBox$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RoundedBox"], {
                args: [
                    8,
                    0.1,
                    5
                ],
                position: [
                    0,
                    -0.05,
                    0
                ],
                radius: 0.03,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                    color: "#1e293b",
                    metalness: 0.9,
                    roughness: 0.2
                }, void 0, false, {
                    fileName: "[project]/app/components/Model3D.tsx",
                    lineNumber: 1022,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/Model3D.tsx",
                lineNumber: 1021,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("gridHelper", {
                args: [
                    16,
                    32,
                    '#0b1222',
                    '#070b14'
                ],
                position: [
                    0,
                    0.01,
                    0
                ]
            }, void 0, false, {
                fileName: "[project]/app/components/Model3D.tsx",
                lineNumber: 1025,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/Model3D.tsx",
        lineNumber: 1020,
        columnNumber: 5
    }, this);
}
// ============ 主场景 ============
function Scene({ mode, temperature, alertLevel, fireWallState, extinguishState, focus }) {
    const fireWallActive = alertLevel === 'critical';
    const controlsRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const pickDebugEnabled = true;
    const hidePlatform = DEBUG_HIDE_LEVEL >= 5;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
        onPointerDown: (e)=>{
            if (!pickDebugEnabled) return;
            if (!e.nativeEvent?.shiftKey) return;
            e.stopPropagation();
            const intersections = e.intersections;
            const hitObj = intersections?.[0]?.object ?? e.object;
            if (!hitObj) return;
            const wp = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$facade$3e$__.Vector3();
            hitObj.getWorldPosition(wp);
            const mat = hitObj.material;
            const col = mat?.color?.getHexString ? `#${mat.color.getHexString()}` : undefined;
            const emi = mat?.emissive?.getHexString ? `#${mat.emissive.getHexString()}` : undefined;
            const chain = [];
            let cur = hitObj;
            for(let i = 0; i < 6 && cur; i++){
                chain.push(cur.name || cur.type);
                cur = cur.parent;
            }
            // eslint-disable-next-line no-console
            console.log('[pick]', {
                chain,
                worldPos: [
                    Number(wp.x.toFixed(3)),
                    Number(wp.y.toFixed(3)),
                    Number(wp.z.toFixed(3))
                ],
                color: col,
                emissive: emi,
                opacity: mat?.opacity,
                transparent: mat?.transparent
            });
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ambientLight", {
                intensity: 0.35
            }, void 0, false, {
                fileName: "[project]/app/components/Model3D.tsx",
                lineNumber: 1080,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("hemisphereLight", {
                intensity: 0.5,
                color: "#e0f2fe",
                groundColor: "#0f172a"
            }, void 0, false, {
                fileName: "[project]/app/components/Model3D.tsx",
                lineNumber: 1081,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("directionalLight", {
                position: [
                    8,
                    12,
                    8
                ],
                intensity: 1.5,
                castShadow: true,
                "shadow-mapSize": [
                    4096,
                    4096
                ],
                "shadow-bias": -0.00008,
                "shadow-normalBias": 0.015,
                "shadow-camera-near": 1,
                "shadow-camera-far": 50,
                "shadow-camera-left": -15,
                "shadow-camera-right": 15,
                "shadow-camera-top": 15,
                "shadow-camera-bottom": -15
            }, void 0, false, {
                fileName: "[project]/app/components/Model3D.tsx",
                lineNumber: 1082,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("pointLight", {
                position: [
                    -6,
                    3,
                    -4
                ],
                intensity: 0.8,
                color: "#06b6d4",
                distance: 12
            }, void 0, false, {
                fileName: "[project]/app/components/Model3D.tsx",
                lineNumber: 1097,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("pointLight", {
                position: [
                    0,
                    2,
                    6
                ],
                intensity: 0.5,
                color: "#22c55e",
                distance: 10
            }, void 0, false, {
                fileName: "[project]/app/components/Model3D.tsx",
                lineNumber: 1098,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("pointLight", {
                position: [
                    4,
                    2,
                    0
                ],
                intensity: 0.6,
                color: "#3b82f6",
                distance: 8
            }, void 0, false, {
                fileName: "[project]/app/components/Model3D.tsx",
                lineNumber: 1099,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rectAreaLight", {
                position: [
                    0,
                    4,
                    -3
                ],
                intensity: 0.4,
                color: "#f0fdfa",
                width: 8,
                height: 4
            }, void 0, false, {
                fileName: "[project]/app/components/Model3D.tsx",
                lineNumber: 1101,
                columnNumber: 7
            }, this),
            !hidePlatform && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Platform, {}, void 0, false, {
                fileName: "[project]/app/components/Model3D.tsx",
                lineNumber: 1103,
                columnNumber: 25
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(StationModel, {
                mode: mode,
                temperature: temperature,
                alertLevel: alertLevel,
                fireWallState: fireWallState,
                extinguishState: extinguishState,
                onSelectModule: ()=>null
            }, void 0, false, {
                fileName: "[project]/app/components/Model3D.tsx",
                lineNumber: 1104,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(PCMSectionInset, {}, void 0, false, {
                fileName: "[project]/app/components/Model3D.tsx",
                lineNumber: 1113,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(SensorSystem, {
                mode: mode,
                temperature: temperature
            }, void 0, false, {
                fileName: "[project]/app/components/Model3D.tsx",
                lineNumber: 1114,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(EnergyFlowParticles, {
                mode: mode
            }, void 0, false, {
                fileName: "[project]/app/components/Model3D.tsx",
                lineNumber: 1116,
                columnNumber: 7
            }, this),
            null,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(CameraRig, {
                focus: focus,
                controlsRef: controlsRef
            }, void 0, false, {
                fileName: "[project]/app/components/Model3D.tsx",
                lineNumber: 1119,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$OrbitControls$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["OrbitControls"], {
                ref: controlsRef,
                enablePan: true,
                enableRotate: true,
                enableDamping: true,
                dampingFactor: 0.08,
                minDistance: 3,
                maxDistance: 24,
                minPolarAngle: 0,
                maxPolarAngle: Math.PI * 0.92,
                onStart: ()=>{
                    if (controlsRef.current) controlsRef.current.__isUserInteracting = true;
                },
                onEnd: ()=>{
                    if (controlsRef.current) controlsRef.current.__isUserInteracting = false;
                }
            }, void 0, false, {
                fileName: "[project]/app/components/Model3D.tsx",
                lineNumber: 1121,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$postprocessing$2f$dist$2f$EffectComposer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["EffectComposer"], {
                multisampling: 0,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$postprocessing$2f$dist$2f$effects$2f$Bloom$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Bloom"], {
                        intensity: fireWallActive ? 0.6 : mode === 'normal' ? 0.35 : 0.2,
                        luminanceThreshold: 0.35,
                        luminanceSmoothing: 0.9,
                        mipmapBlur: true,
                        radius: 0.5
                    }, void 0, false, {
                        fileName: "[project]/app/components/Model3D.tsx",
                        lineNumber: 1141,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$postprocessing$2f$dist$2f$effects$2f$Vignette$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Vignette"], {
                        eskil: false,
                        offset: 0.25,
                        darkness: 0.35
                    }, void 0, false, {
                        fileName: "[project]/app/components/Model3D.tsx",
                        lineNumber: 1148,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/Model3D.tsx",
                lineNumber: 1140,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                rotation: [
                    -Math.PI / 2,
                    0,
                    0
                ],
                position: [
                    0,
                    -0.06,
                    0
                ],
                receiveShadow: true,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("planeGeometry", {
                        args: [
                            40,
                            40
                        ]
                    }, void 0, false, {
                        fileName: "[project]/app/components/Model3D.tsx",
                        lineNumber: 1152,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("shadowMaterial", {
                        opacity: 0.1
                    }, void 0, false, {
                        fileName: "[project]/app/components/Model3D.tsx",
                        lineNumber: 1153,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/Model3D.tsx",
                lineNumber: 1151,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/Model3D.tsx",
        lineNumber: 1045,
        columnNumber: 5
    }, this);
}
function Model3D(props) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            width: '100%',
            height: '100%',
            background: 'linear-gradient(180deg, #0a0f1a 0%, #0f172a 100%)'
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$react$2d$three$2d$fiber$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Canvas"], {
            shadows: "soft",
            dpr: Math.min(1.5, typeof window !== 'undefined' ? window.devicePixelRatio : 1),
            gl: {
                antialias: true,
                powerPreference: 'high-performance',
                alpha: false
            },
            onCreated: ({ gl })=>{
                gl.shadowMap.enabled = true;
                gl.shadowMap.type = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$facade$3e$__.PCFSoftShadowMap;
            },
            camera: {
                position: [
                    6,
                    4,
                    8
                ],
                fov: 42
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("color", {
                    attach: "background",
                    args: [
                        '#0a0f1a'
                    ]
                }, void 0, false, {
                    fileName: "[project]/app/components/Model3D.tsx",
                    lineNumber: 1172,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("fog", {
                    attach: "fog",
                    args: [
                        '#0a0f1a',
                        15,
                        35
                    ]
                }, void 0, false, {
                    fileName: "[project]/app/components/Model3D.tsx",
                    lineNumber: 1173,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Scene, {
                    ...props
                }, void 0, false, {
                    fileName: "[project]/app/components/Model3D.tsx",
                    lineNumber: 1174,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/components/Model3D.tsx",
            lineNumber: 1162,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/components/Model3D.tsx",
        lineNumber: 1161,
        columnNumber: 5
    }, this);
}

})()),
"[project]/app/components/PCMStructureDiagram.tsx [app-ssr] (ecmascript)": (({ r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__ }) => (() => {
"use strict";

__turbopack_esm__({
    "default": ()=>PCMStructureDiagram
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/server/future/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/server/future/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Layers$3e$__ = __turbopack_import__("[project]/node_modules/lucide-react/dist/esm/icons/layers.js [app-ssr] (ecmascript) <export default as Layers>");
"__TURBOPACK__ecmascript__hoisting__location__";
'use client';
;
;
;
;
const layers = [
    {
        id: 1,
        name: '电芯核心矩阵',
        size: '1200×800mm',
        color: '#1e40af',
        gradient: 'linear-gradient(145deg, #1e40af 0%, #1e3a8a 50%, #172554 100%)',
        material: 'core'
    },
    {
        id: 2,
        name: '内侧导热硅胶垫',
        size: '2mm',
        color: '#c084fc',
        gradient: 'linear-gradient(145deg, rgba(192,132,252,0.85), rgba(167,139,250,0.7))',
        material: 'pad'
    },
    {
        id: 3,
        name: '内侧相变材料 PCM-1',
        size: '28-32°C',
        tempRange: 'Stage 1',
        color: '#06b6d4',
        gradient: 'linear-gradient(145deg, rgba(6,182,212,0.75), rgba(8,145,178,0.6))',
        material: 'pcm'
    },
    {
        id: 4,
        name: '铝箔均热层',
        size: '0.5mm',
        color: '#cbd5e1',
        gradient: 'linear-gradient(145deg, rgba(203,213,225,0.95), rgba(148,163,184,0.85))',
        material: 'foil'
    },
    {
        id: 5,
        name: '外侧相变材料 PCM-2',
        size: '55-60°C',
        tempRange: 'Stage 2',
        color: '#f97316',
        gradient: 'linear-gradient(145deg, rgba(249,115,22,0.75), rgba(234,88,12,0.6))',
        material: 'pcm'
    },
    {
        id: 6,
        name: '纳米孔气凝胶毯',
        size: '10mm',
        color: '#5eead4',
        gradient: 'linear-gradient(145deg, rgba(94,234,212,0.5), rgba(20,184,166,0.35))',
        material: 'aerogel'
    },
    {
        id: 7,
        name: 'ABS保护外壳',
        size: '5mm',
        color: '#334155',
        gradient: 'linear-gradient(145deg, rgba(51,65,85,0.95), rgba(30,41,59,0.85))',
        material: 'shell'
    }
];
// 电芯单元配置
const CELL_COLS = 6;
const CELL_ROWS = 4;
function PCMStructureDiagram() {
    const [hoveredLayer, setHoveredLayer] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [selectedLayer, setSelectedLayer] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const containerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [containerSize, setContainerSize] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        w: 0,
        h: 0
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const el = containerRef.current;
        if (!el) return;
        const ro = new ResizeObserver((entries)=>{
            const entry = entries[0];
            if (!entry) return;
            const { width, height } = entry.contentRect;
            setContainerSize({
                w: Math.floor(width),
                h: Math.floor(height)
            });
        });
        ro.observe(el);
        return ()=>ro.disconnect();
    }, []);
    const layout = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const listW = 150;
        const bottomBarH = 0;
        const gap = 12;
        const padding = 8;
        const availW = Math.max(0, containerSize.w - padding * 2);
        const availH = Math.max(0, containerSize.h - padding * 2);
        const sceneW = Math.max(0, availW - listW - gap - 20);
        const sceneH = Math.max(0, availH - bottomBarH);
        const baseSceneW = 180;
        const baseSceneH = 120;
        const scale = Math.min(1, Math.max(0.4, Math.min(sceneW / baseSceneW, sceneH / baseSceneH)));
        const listAreaH = Math.max(0, availH - bottomBarH);
        const rowH = Math.max(16, Math.min(26, Math.floor(listAreaH / layers.length)));
        return {
            listW,
            bottomBarH,
            scale,
            baseSceneW,
            baseSceneH,
            rowH
        };
    }, [
        containerSize.h,
        containerSize.w
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "h-full flex flex-col",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "panel-header flex items-center justify-between flex-shrink-0",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Layers$3e$__["Layers"], {
                                className: "w-4 h-4",
                                style: {
                                    color: 'var(--accent-cyan)'
                                }
                            }, void 0, false, {
                                fileName: "[project]/app/components/PCMStructureDiagram.tsx",
                                lineNumber: 138,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "panel-title",
                                children: "双极PCM分层结构"
                            }, void 0, false, {
                                fileName: "[project]/app/components/PCMStructureDiagram.tsx",
                                lineNumber: 139,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/PCMStructureDiagram.tsx",
                        lineNumber: 137,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-[10px] font-tech",
                        style: {
                            color: 'var(--text-muted)'
                        },
                        children: '"回"字形全包裹核心结构'
                    }, void 0, false, {
                        fileName: "[project]/app/components/PCMStructureDiagram.tsx",
                        lineNumber: 141,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/PCMStructureDiagram.tsx",
                lineNumber: 136,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                ref: containerRef,
                className: "flex-1 relative min-h-0 overflow-hidden",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "absolute inset-0 p-2",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "h-full grid grid-cols-[135px_1fr] gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "min-h-0",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "h-full flex flex-col",
                                    style: {
                                        gap: '2px'
                                    },
                                    children: layers.map((layer)=>(()=>{
                                            const isHighlight = layer.material === 'pcm' || layer.material === 'aerogel';
                                            const isActive = hoveredLayer === layer.id || selectedLayer === layer.id;
                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-1 py-0.5 px-1 rounded cursor-pointer transition-all",
                                                style: {
                                                    height: layout.rowH,
                                                    background: isActive ? `${layer.color}35` : isHighlight ? `${layer.color}1a` : 'transparent',
                                                    borderLeft: `2px solid ${layer.color}`,
                                                    boxShadow: isActive ? `0 0 0 1px ${layer.color}80` : undefined
                                                },
                                                onMouseEnter: ()=>setHoveredLayer(layer.id),
                                                onMouseLeave: ()=>setHoveredLayer(null),
                                                onClick: ()=>setSelectedLayer((cur)=>cur === layer.id ? null : layer.id),
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "w-3 h-3 rounded-sm flex-shrink-0",
                                                        style: {
                                                            background: layer.color,
                                                            boxShadow: `0 0 4px ${layer.color}`
                                                        }
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/PCMStructureDiagram.tsx",
                                                        lineNumber: 171,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex-1 min-w-0",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "text-[11px] leading-4 font-medium text-white",
                                                            style: {
                                                                whiteSpace: 'nowrap',
                                                                opacity: isHighlight ? 1 : 0.9
                                                            },
                                                            children: layer.name
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/components/PCMStructureDiagram.tsx",
                                                            lineNumber: 176,
                                                            columnNumber: 23
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/PCMStructureDiagram.tsx",
                                                        lineNumber: 175,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, layer.id, true, {
                                                fileName: "[project]/app/components/PCMStructureDiagram.tsx",
                                                lineNumber: 158,
                                                columnNumber: 19
                                            }, this);
                                        })())
                                }, void 0, false, {
                                    fileName: "[project]/app/components/PCMStructureDiagram.tsx",
                                    lineNumber: 151,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/components/PCMStructureDiagram.tsx",
                                lineNumber: 150,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "min-h-0 flex items-center justify-center",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "relative",
                                    style: {
                                        width: layout.baseSceneW,
                                        height: layout.baseSceneH,
                                        perspective: '900px',
                                        transform: `scale(${layout.scale})`,
                                        transformOrigin: 'center'
                                    },
                                    children: [
                                        layers.slice(1).map((layer, index)=>{
                                            const isHovered = hoveredLayer === layer.id;
                                            const isActive = isHovered || selectedLayer === layer.id;
                                            const size = 46 + (index + 1) * 14;
                                            const reverseIndex = layers.length - 2 - index;
                                            const isHighlight = layer.material === 'pcm' || layer.material === 'aerogel';
                                            const baseTransform = `rotateX(55deg) rotateZ(-12deg) translateZ(${(reverseIndex + 1) * 5}px)`;
                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                                                className: "absolute left-1/2 top-1/2 pointer-events-auto",
                                                style: {
                                                    width: size,
                                                    height: size * 0.7,
                                                    marginLeft: -size / 2,
                                                    marginTop: -(size * 0.7) / 2,
                                                    transform: isActive ? `${baseTransform} scale(1.02)` : baseTransform,
                                                    zIndex: reverseIndex + 1
                                                },
                                                animate: {
                                                    opacity: isActive ? 1 : isHighlight ? 0.95 : 0.7
                                                },
                                                transition: {
                                                    duration: 0.15
                                                },
                                                onMouseEnter: ()=>setHoveredLayer(layer.id),
                                                onMouseLeave: ()=>setHoveredLayer(null),
                                                onClick: ()=>setSelectedLayer((cur)=>cur === layer.id ? null : layer.id),
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "absolute inset-0 rounded-lg",
                                                        style: {
                                                            background: layer.gradient,
                                                            border: isHighlight ? `2px solid ${layer.color}` : `1px solid ${isActive ? layer.color : `${layer.color}40`}`,
                                                            boxShadow: isHighlight ? `0 0 25px ${layer.color}80, 0 0 50px ${layer.color}40, inset 0 1px 0 rgba(255,255,255,0.15)` : isActive ? `0 0 20px ${layer.color}60, inset 0 1px 0 rgba(255,255,255,0.1)` : `inset 0 1px 0 rgba(255,255,255,0.05)`
                                                        }
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/PCMStructureDiagram.tsx",
                                                        lineNumber: 234,
                                                        columnNumber: 23
                                                    }, this),
                                                    layer.material === 'pcm' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                                                        className: "absolute inset-0 rounded-lg",
                                                        animate: {
                                                            opacity: [
                                                                0.3,
                                                                0.6,
                                                                0.3
                                                            ]
                                                        },
                                                        transition: {
                                                            duration: 2,
                                                            repeat: Infinity,
                                                            ease: 'easeInOut'
                                                        },
                                                        style: {
                                                            background: `radial-gradient(ellipse at center, ${layer.color}40 0%, transparent 70%)`
                                                        }
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/PCMStructureDiagram.tsx",
                                                        lineNumber: 249,
                                                        columnNumber: 25
                                                    }, this),
                                                    layer.material === 'foil' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "absolute inset-0 rounded-lg",
                                                        style: {
                                                            background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 50%, rgba(255,255,255,0.2) 100%)'
                                                        }
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/PCMStructureDiagram.tsx",
                                                        lineNumber: 266,
                                                        columnNumber: 25
                                                    }, this),
                                                    layer.material === 'aerogel' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "absolute inset-0 rounded-lg",
                                                                style: {
                                                                    background: 'radial-gradient(ellipse at 30% 30%, rgba(255,255,255,0.2) 0%, transparent 70%)'
                                                                }
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/components/PCMStructureDiagram.tsx",
                                                                lineNumber: 275,
                                                                columnNumber: 27
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                                                                className: "absolute inset-0 rounded-lg",
                                                                animate: {
                                                                    opacity: [
                                                                        0.2,
                                                                        0.5,
                                                                        0.2
                                                                    ]
                                                                },
                                                                transition: {
                                                                    duration: 3,
                                                                    repeat: Infinity,
                                                                    ease: 'easeInOut'
                                                                },
                                                                style: {
                                                                    background: 'radial-gradient(ellipse at center, rgba(94,234,212,0.3) 0%, transparent 60%)',
                                                                    boxShadow: 'inset 0 0 20px rgba(94,234,212,0.2)'
                                                                }
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/components/PCMStructureDiagram.tsx",
                                                                lineNumber: 281,
                                                                columnNumber: 27
                                                            }, this)
                                                        ]
                                                    }, void 0, true)
                                                ]
                                            }, layer.id, true, {
                                                fileName: "[project]/app/components/PCMStructureDiagram.tsx",
                                                lineNumber: 214,
                                                columnNumber: 21
                                            }, this);
                                        }),
                                        (()=>{
                                            const isActive = hoveredLayer === 1 || selectedLayer === 1;
                                            const baseTransform = `rotateX(55deg) rotateZ(-12deg) translateZ(45px)`;
                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                                                className: "absolute left-1/2 top-1/2 pointer-events-auto",
                                                style: {
                                                    width: 56,
                                                    height: 40,
                                                    marginLeft: -28,
                                                    marginTop: -20,
                                                    transform: isActive ? `${baseTransform} scale(1.05)` : baseTransform,
                                                    zIndex: 50
                                                },
                                                onMouseEnter: ()=>setHoveredLayer(1),
                                                onMouseLeave: ()=>setHoveredLayer(null),
                                                onClick: ()=>setSelectedLayer((cur)=>cur === 1 ? null : 1),
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "absolute inset-0 rounded-md shadow-lg",
                                                        style: {
                                                            background: '#1e40af',
                                                            border: isActive ? '2px solid #3b82f6' : '1px solid rgba(255,255,255,0.2)',
                                                            boxShadow: isActive ? '0 0 15px rgba(59,130,246,0.6)' : 'none'
                                                        }
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/PCMStructureDiagram.tsx",
                                                        lineNumber: 323,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "absolute inset-1 grid gap-0.5",
                                                        style: {
                                                            gridTemplateColumns: `repeat(${CELL_COLS}, 1fr)`,
                                                            gridTemplateRows: `repeat(${CELL_ROWS}, 1fr)`
                                                        },
                                                        children: Array.from({
                                                            length: CELL_COLS * CELL_ROWS
                                                        }).map((_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "rounded-sm bg-blue-600 opacity-90 border-[0.5px] border-blue-400/30"
                                                            }, i, false, {
                                                                fileName: "[project]/app/components/PCMStructureDiagram.tsx",
                                                                lineNumber: 335,
                                                                columnNumber: 27
                                                            }, this))
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/PCMStructureDiagram.tsx",
                                                        lineNumber: 333,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/components/PCMStructureDiagram.tsx",
                                                lineNumber: 308,
                                                columnNumber: 21
                                            }, this);
                                        })()
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/PCMStructureDiagram.tsx",
                                    lineNumber: 194,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/components/PCMStructureDiagram.tsx",
                                lineNumber: 193,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/PCMStructureDiagram.tsx",
                        lineNumber: 149,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/components/PCMStructureDiagram.tsx",
                    lineNumber: 148,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/PCMStructureDiagram.tsx",
                lineNumber: 147,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/PCMStructureDiagram.tsx",
        lineNumber: 134,
        columnNumber: 5
    }, this);
}

})()),
"[project]/app/page.tsx [app-ssr] (ecmascript)": (({ r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__ }) => (() => {
"use strict";

__turbopack_esm__({
    "default": ()=>Home
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/server/future/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/styled-jsx/style.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/server/future/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__ = __turbopack_import__("[project]/node_modules/lucide-react/dist/esm/icons/zap.js [app-ssr] (ecmascript) <export default as Zap>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$battery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Battery$3e$__ = __turbopack_import__("[project]/node_modules/lucide-react/dist/esm/icons/battery.js [app-ssr] (ecmascript) <export default as Battery>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$activity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Activity$3e$__ = __turbopack_import__("[project]/node_modules/lucide-react/dist/esm/icons/activity.js [app-ssr] (ecmascript) <export default as Activity>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Shield$3e$__ = __turbopack_import__("[project]/node_modules/lucide-react/dist/esm/icons/shield.js [app-ssr] (ecmascript) <export default as Shield>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$flame$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Flame$3e$__ = __turbopack_import__("[project]/node_modules/lucide-react/dist/esm/icons/flame.js [app-ssr] (ecmascript) <export default as Flame>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$play$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Play$3e$__ = __turbopack_import__("[project]/node_modules/lucide-react/dist/esm/icons/play.js [app-ssr] (ecmascript) <export default as Play>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__ = __turbopack_import__("[project]/node_modules/lucide-react/dist/esm/icons/triangle-alert.js [app-ssr] (ecmascript) <export default as AlertTriangle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$rotate$2d$ccw$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__RotateCcw$3e$__ = __turbopack_import__("[project]/node_modules/lucide-react/dist/esm/icons/rotate-ccw.js [app-ssr] (ecmascript) <export default as RotateCcw>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$thermometer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Thermometer$3e$__ = __turbopack_import__("[project]/node_modules/lucide-react/dist/esm/icons/thermometer.js [app-ssr] (ecmascript) <export default as Thermometer>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sun$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Sun$3e$__ = __turbopack_import__("[project]/node_modules/lucide-react/dist/esm/icons/sun.js [app-ssr] (ecmascript) <export default as Sun>");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$Model3D$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/app/components/Model3D.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$PCMStructureDiagram$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/app/components/PCMStructureDiagram.tsx [app-ssr] (ecmascript)");
"__TURBOPACK__ecmascript__hoisting__location__";
'use client';
;
;
;
;
;
;
;
function Home() {
    const [mode, setMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('idle');
    const [alertLevel, setAlertLevel] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('normal');
    const [temperature, setTemperature] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(28.5);
    const [dTdt, setDTdt] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const [fireWallState, setFireWallState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('open');
    const [extinguishState, setExtinguishState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('standby');
    const [currentTime, setCurrentTime] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const focus = 'overview';
    const [safetyPanelCollapsed, setSafetyPanelCollapsed] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [pvPower, setPvPower] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(23.4);
    const [loadPower, setLoadPower] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(35.6);
    const [gridPower, setGridPower] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(12.2);
    const [storageSoc, setStorageSoc] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(85);
    const [selfSupplyRate, setSelfSupplyRate] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const [timeline, setTimeline] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const timeoutsRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])([]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const updateTime = ()=>{
            const now = new Date();
            setCurrentTime(now.toLocaleString('zh-CN', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            }));
        };
        updateTime();
        const interval = setInterval(updateTime, 1000);
        return ()=>clearInterval(interval);
    }, []);
    const clearTimeouts = ()=>{
        timeoutsRef.current.forEach((id)=>window.clearTimeout(id));
        timeoutsRef.current = [];
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (mode === 'idle') return;
        const calcAlertLevel = (t, dTdtPerMin)=>{
            if (t > 100) return 'critical';
            if (t > 60 && dTdtPerMin > 3) return 'danger';
            if (dTdtPerMin > 2) return 'warning';
            return 'normal';
        };
        const interval = setInterval(()=>{
            if (mode === 'normal') {
                setTemperature((prev)=>{
                    const next = 28 + Math.random() * 4;
                    const ratePerMin = (next - prev) * 60;
                    setDTdt(ratePerMin);
                    return next;
                });
                setAlertLevel('normal');
                const pv = 26 + Math.random() * 8;
                const load = 22 + Math.random() * 6;
                const grid = Math.max(load - pv, 0);
                setPvPower(pv);
                setLoadPower(load);
                setGridPower(grid);
                setSelfSupplyRate(Math.min(100, pv / Math.max(load, 1) * 100));
                setStorageSoc((prev)=>{
                    const next = Math.min(100, Math.max(30, prev + (pv > load ? 0.3 : -0.2)));
                    return Number(next.toFixed(1));
                });
            } else if (mode === 'abnormal') {
                setTemperature((prev)=>{
                    const next = prev + (Math.random() * 3 + 1);
                    const ratePerMin = (next - prev) * 60;
                    setDTdt(ratePerMin);
                    setAlertLevel(calcAlertLevel(next, ratePerMin));
                    return Math.min(next, 120);
                });
                const pv = 20 + Math.random() * 6;
                const load = 30 + Math.random() * 10;
                const grid = Math.max(load - pv, 0);
                setPvPower(pv);
                setLoadPower(load);
                setGridPower(grid);
                setSelfSupplyRate(Math.min(100, pv / Math.max(load, 1) * 100));
                setStorageSoc((prev)=>{
                    const next = Math.min(100, Math.max(10, prev - 0.8));
                    return Number(next.toFixed(1));
                });
            }
        }, 1000);
        return ()=>clearInterval(interval);
    }, [
        mode
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (mode === 'abnormal' && alertLevel === 'critical') {
            clearTimeouts();
            const events = [
                {
                    time: 'T+0s',
                    label: '红色预警触发',
                    active: false
                },
                {
                    time: 'T+0s',
                    label: '防火围栏启动',
                    active: false
                },
                {
                    time: 'T+3s',
                    label: '围栏关闭到位',
                    active: false
                },
                {
                    time: 'T+3s',
                    label: '定向灭火启动',
                    active: false
                },
                {
                    time: 'T+5s',
                    label: '数据上传完成',
                    active: false
                },
                {
                    time: 'T+10s',
                    label: '进入维持监测',
                    active: false
                }
            ];
            setFireWallState('closing');
            setExtinguishState('standby');
            const delays = [
                0,
                0,
                3000,
                3000,
                5000,
                10000
            ];
            events.forEach((event, index)=>{
                const delay = delays[index] ?? index * 1500;
                const id = window.setTimeout(()=>{
                    setTimeline((prev)=>{
                        const newTimeline = [
                            ...prev
                        ];
                        newTimeline[index] = {
                            ...event,
                            active: true
                        };
                        return newTimeline;
                    });
                    if (index === 0) setFireWallState('closing');
                    if (index === 2) setFireWallState('closed');
                    if (index === 3) setExtinguishState('active');
                }, delay);
                timeoutsRef.current.push(id);
            });
        }
    }, [
        mode,
        alertLevel
    ]);
    const startNormalDemo = ()=>{
        clearTimeouts();
        setMode('normal');
        setTimeline([]);
        setTemperature(28.5);
        setDTdt(0);
        setAlertLevel('normal');
        setFireWallState('open');
        setExtinguishState('standby');
    };
    const startAbnormalDemo = ()=>{
        clearTimeouts();
        setMode('abnormal');
        setTemperature(30);
        setDTdt(0);
        setTimeline([]);
        setAlertLevel('normal');
        setFireWallState('open');
        setExtinguishState('standby');
    };
    const resetDemo = ()=>{
        clearTimeouts();
        setMode('idle');
        setAlertLevel('normal');
        setTemperature(28.5);
        setDTdt(0);
        setTimeline([]);
        setFireWallState('open');
        setExtinguishState('standby');
        setPvPower(0);
        setLoadPower(0);
        setGridPower(0);
        setSelfSupplyRate(0);
        setStorageSoc(85);
    };
    const pcmStage = mode !== 'abnormal' ? 0 : temperature < 55 ? 1 : temperature < 120 ? 2 : 3;
    const meltL1 = mode !== 'abnormal' ? 0.12 : Math.min(1, Math.max(0, (temperature - 30) / (55 - 30)));
    const meltL2 = mode !== 'abnormal' ? 0.0 : pcmStage >= 2 ? Math.min(1, Math.max(0, (temperature - 55) / (120 - 55))) : 0;
    const getAlertBadgeClass = ()=>{
        switch(alertLevel){
            case 'normal':
                return 'badge-normal';
            case 'warning':
                return 'badge-warning';
            case 'danger':
                return 'badge-danger';
            case 'critical':
                return 'badge-critical';
        }
    };
    const getAlertText = ()=>{
        switch(alertLevel){
            case 'normal':
                return '正常';
            case 'warning':
                return '预警';
            case 'danger':
                return '危险';
            case 'critical':
                return '热失控';
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        style: {
            background: 'var(--bg-primary)'
        },
        className: "jsx-a6d471fbec0d97d3" + " " + "min-h-screen relative overflow-hidden",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "jsx-a6d471fbec0d97d3" + " " + "deep-space-glow"
            }, void 0, false, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 229,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "jsx-a6d471fbec0d97d3" + " " + "fixed inset-0 z-10",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$Model3D$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                    mode: mode,
                    temperature: temperature,
                    alertLevel: alertLevel,
                    fireWallState: fireWallState,
                    extinguishState: extinguishState,
                    focus: focus
                }, void 0, false, {
                    fileName: "[project]/app/page.tsx",
                    lineNumber: 233,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 232,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "jsx-a6d471fbec0d97d3" + " " + "fixed inset-0 z-30 pointer-events-none",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-a6d471fbec0d97d3" + " " + "absolute top-0 left-0 w-32 h-32",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-a6d471fbec0d97d3" + " " + "absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--hud-corner)] to-transparent"
                            }, void 0, false, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 247,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-a6d471fbec0d97d3" + " " + "absolute top-0 left-0 h-full w-1 bg-gradient-b from-[var(--hud-corner)] to-transparent"
                            }, void 0, false, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 248,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 246,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-a6d471fbec0d97d3" + " " + "absolute top-0 right-0 w-32 h-32",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-a6d471fbec0d97d3" + " " + "absolute top-0 right-0 w-full h-1 bg-gradient-to-l from-[var(--hud-corner)] to-transparent"
                            }, void 0, false, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 251,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-a6d471fbec0d97d3" + " " + "absolute top-0 right-0 h-full w-1 bg-gradient-b from-[var(--hud-corner)] to-transparent"
                            }, void 0, false, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 252,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 250,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-a6d471fbec0d97d3" + " " + "absolute bottom-0 left-0 w-32 h-32",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-a6d471fbec0d97d3" + " " + "absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--hud-corner)] to-transparent"
                            }, void 0, false, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 255,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-a6d471fbec0d97d3" + " " + "absolute bottom-0 left-0 h-full w-1 bg-gradient-t from-[var(--hud-corner)] to-transparent"
                            }, void 0, false, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 256,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 254,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-a6d471fbec0d97d3" + " " + "absolute bottom-0 right-0 w-32 h-32",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-a6d471fbec0d97d3" + " " + "absolute bottom-0 right-0 w-full h-1 bg-gradient-to-l from-[var(--hud-corner)] to-transparent"
                            }, void 0, false, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 259,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-a6d471fbec0d97d3" + " " + "absolute bottom-0 right-0 h-full w-1 bg-gradient-t from-[var(--hud-corner)] to-transparent"
                            }, void 0, false, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 260,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 258,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-a6d471fbec0d97d3" + " " + "absolute top-20 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--hud-line)] to-transparent opacity-50"
                    }, void 0, false, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 264,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-a6d471fbec0d97d3" + " " + "absolute bottom-20 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--hud-line)] to-transparent opacity-50"
                    }, void 0, false, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 265,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 244,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: "jsx-a6d471fbec0d97d3" + " " + "fixed top-0 left-0 right-0 z-50 pointer-events-none",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "jsx-a6d471fbec0d97d3" + " " + "header-container",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "jsx-a6d471fbec0d97d3" + " " + "header-top-decorator",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-a6d471fbec0d97d3" + " " + "header-top-line"
                            }, void 0, false, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 272,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/page.tsx",
                            lineNumber: 271,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "jsx-a6d471fbec0d97d3" + " " + "header-line-left"
                        }, void 0, false, {
                            fileName: "[project]/app/page.tsx",
                            lineNumber: 276,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "jsx-a6d471fbec0d97d3" + " " + "header-line-right"
                        }, void 0, false, {
                            fileName: "[project]/app/page.tsx",
                            lineNumber: 277,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "jsx-a6d471fbec0d97d3" + " " + "header-bg-shape",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                    className: "jsx-a6d471fbec0d97d3" + " " + "hud-title-main",
                                    children: "光-储-热-防 换电站节能减排系统"
                                }, void 0, false, {
                                    fileName: "[project]/app/page.tsx",
                                    lineNumber: 281,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "jsx-a6d471fbec0d97d3" + " " + "header-line-inner"
                                }, void 0, false, {
                                    fileName: "[project]/app/page.tsx",
                                    lineNumber: 283,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/page.tsx",
                            lineNumber: 280,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/page.tsx",
                    lineNumber: 269,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 268,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                id: "a6d471fbec0d97d3",
                children: "@keyframes pcmFlow{0%{opacity:.25;transform:translate(-40%)}50%{opacity:.45}to{opacity:.25;transform:translate(40%)}}@keyframes pcmMelt{0%{opacity:.15;transform:translateY(20%)}50%{opacity:.45;transform:translateY(0%)}to{opacity:.15;transform:translateY(-20%)}}@keyframes pcmWobble{0%{background-position:0%;transform:translate(-6%)}50%{background-position:100%;transform:translate(6%)}to{background-position:0%;transform:translate(-6%)}}"
            }, void 0, false, void 0, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "jsx-a6d471fbec0d97d3" + " " + "fixed top-16 bottom-4 left-4 right-4 z-40 pointer-events-none",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "jsx-a6d471fbec0d97d3" + " " + "h-full grid grid-cols-[280px_1fr_360px] gap-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
                            className: "jsx-a6d471fbec0d97d3" + " " + "pointer-events-auto overflow-hidden min-h-0",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-a6d471fbec0d97d3" + " " + "h-full flex flex-col gap-3 min-h-0",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-a6d471fbec0d97d3" + " " + "glass-panel glass-panel-glow glass-panel-compact",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "jsx-a6d471fbec0d97d3" + " " + "flex items-center gap-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "jsx-a6d471fbec0d97d3" + " " + "w-2 h-2 rounded-full bg-[var(--accent-cyan)] animate-pulse"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/page.tsx",
                                                    lineNumber: 314,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    style: {
                                                        color: 'var(--accent-cyan)'
                                                    },
                                                    className: "jsx-a6d471fbec0d97d3" + " " + "font-tech text-[11px] font-bold tracking-[0.2em] text-glow",
                                                    children: "DIGITAL TWIN"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/page.tsx",
                                                    lineNumber: 315,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/page.tsx",
                                            lineNumber: 313,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 312,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-a6d471fbec0d97d3" + " " + `glass-panel glass-panel-glow glass-panel-compact data-card-glow ${alertLevel === 'critical' ? 'glass-panel-danger' : alertLevel === 'danger' ? 'glass-panel-warning' : ''}`,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-a6d471fbec0d97d3" + " " + "panel-header",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "jsx-a6d471fbec0d97d3" + " " + "flex items-center gap-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$thermometer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Thermometer$3e$__["Thermometer"], {
                                                            className: "w-4 h-4",
                                                            style: {
                                                                color: alertLevel === 'normal' ? 'var(--accent-emerald)' : alertLevel === 'warning' ? 'var(--accent-amber)' : 'var(--status-critical)'
                                                            }
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/page.tsx",
                                                            lineNumber: 323,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "jsx-a6d471fbec0d97d3" + " " + "panel-title",
                                                            children: "温度监控"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/page.tsx",
                                                            lineNumber: 324,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/page.tsx",
                                                    lineNumber: 322,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 321,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-a6d471fbec0d97d3" + " " + "flex items-baseline gap-1.5",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        style: {
                                                            color: alertLevel === 'normal' ? 'var(--accent-emerald)' : alertLevel === 'warning' ? 'var(--accent-amber)' : 'var(--status-critical)'
                                                        },
                                                        className: "jsx-a6d471fbec0d97d3" + " " + "data-value text-glow",
                                                        children: temperature.toFixed(1)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/page.tsx",
                                                        lineNumber: 328,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "jsx-a6d471fbec0d97d3" + " " + "data-unit",
                                                        children: "℃"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/page.tsx",
                                                        lineNumber: 331,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 327,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-a6d471fbec0d97d3" + " " + "mt-3 flex items-center justify-between",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        style: {
                                                            color: 'var(--text-muted)'
                                                        },
                                                        className: "jsx-a6d471fbec0d97d3" + " " + "text-xs",
                                                        children: "温升速率"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/page.tsx",
                                                        lineNumber: 334,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        style: {
                                                            color: dTdt > 2 ? 'var(--status-danger)' : 'var(--text-muted)'
                                                        },
                                                        className: "jsx-a6d471fbec0d97d3" + " " + `font-mono text-sm ${dTdt > 2 ? 'text-glow' : ''}`,
                                                        children: [
                                                            dTdt.toFixed(1),
                                                            " ℃/min"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/page.tsx",
                                                        lineNumber: 335,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 333,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 320,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-a6d471fbec0d97d3" + " " + "glass-panel glass-panel-glow glass-panel-compact data-card-glow",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-a6d471fbec0d97d3" + " " + "panel-header",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "jsx-a6d471fbec0d97d3" + " " + "flex items-center gap-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Shield$3e$__["Shield"], {
                                                            className: "w-4 h-4",
                                                            style: {
                                                                color: 'var(--accent-cyan)'
                                                            }
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/page.tsx",
                                                            lineNumber: 345,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "jsx-a6d471fbec0d97d3" + " " + "panel-title",
                                                            children: "预警状态"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/page.tsx",
                                                            lineNumber: 346,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/page.tsx",
                                                    lineNumber: 344,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 343,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-a6d471fbec0d97d3" + " " + "flex items-center gap-3",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "jsx-a6d471fbec0d97d3" + " " + `status-dot-lg status-${alertLevel} ${alertLevel !== 'normal' ? 'animate-pulse-subtle' : ''}`
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/page.tsx",
                                                        lineNumber: 350,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "jsx-a6d471fbec0d97d3" + " " + "text-xl font-semibold text-white font-tech tracking-wider",
                                                        children: getAlertText()
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/page.tsx",
                                                        lineNumber: 351,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 349,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 342,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-a6d471fbec0d97d3" + " " + "glass-panel glass-panel-glow glass-panel-compact data-card-glow",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-a6d471fbec0d97d3" + " " + "panel-header",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "jsx-a6d471fbec0d97d3" + " " + "flex items-center gap-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$flame$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Flame$3e$__["Flame"], {
                                                            className: "w-4 h-4",
                                                            style: {
                                                                color: 'var(--accent-rose)'
                                                            }
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/page.tsx",
                                                            lineNumber: 359,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "jsx-a6d471fbec0d97d3" + " " + "panel-title",
                                                            children: "消防系统"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/page.tsx",
                                                            lineNumber: 360,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/page.tsx",
                                                    lineNumber: 358,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 357,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-a6d471fbec0d97d3" + " " + "space-y-3",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "jsx-a6d471fbec0d97d3" + " " + "flex items-center justify-between",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                style: {
                                                                    color: 'var(--text-muted)'
                                                                },
                                                                className: "jsx-a6d471fbec0d97d3" + " " + "text-xs",
                                                                children: "自动状态"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/page.tsx",
                                                                lineNumber: 365,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "jsx-a6d471fbec0d97d3" + " " + "flex items-center gap-2",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "jsx-a6d471fbec0d97d3" + " " + `status-dot status-normal`
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/page.tsx",
                                                                        lineNumber: 367,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        style: {
                                                                            color: 'var(--text-primary)'
                                                                        },
                                                                        className: "jsx-a6d471fbec0d97d3" + " " + "text-sm font-medium",
                                                                        children: "开启"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/page.tsx",
                                                                        lineNumber: 368,
                                                                        columnNumber: 23
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/page.tsx",
                                                                lineNumber: 366,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/page.tsx",
                                                        lineNumber: 364,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "jsx-a6d471fbec0d97d3" + " " + "flex items-center justify-between",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                style: {
                                                                    color: 'var(--text-muted)'
                                                                },
                                                                className: "jsx-a6d471fbec0d97d3" + " " + "text-xs",
                                                                children: "灭火状态"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/page.tsx",
                                                                lineNumber: 374,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "jsx-a6d471fbec0d97d3" + " " + "flex items-center gap-2",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "jsx-a6d471fbec0d97d3" + " " + `status-dot status-normal`
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/page.tsx",
                                                                        lineNumber: 376,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        style: {
                                                                            color: 'var(--text-primary)'
                                                                        },
                                                                        className: "jsx-a6d471fbec0d97d3" + " " + "text-sm font-medium",
                                                                        children: "待命"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/page.tsx",
                                                                        lineNumber: 377,
                                                                        columnNumber: 23
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/page.tsx",
                                                                lineNumber: 375,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/page.tsx",
                                                        lineNumber: 373,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 363,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 356,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-a6d471fbec0d97d3" + " " + "glass-panel glass-panel-glow glass-panel-compact flex-1 min-h-0",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-a6d471fbec0d97d3" + " " + "panel-header",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "jsx-a6d471fbec0d97d3" + " " + "flex items-center gap-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__["Zap"], {
                                                            className: "w-4 h-4",
                                                            style: {
                                                                color: 'var(--accent-amber)'
                                                            }
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/page.tsx",
                                                            lineNumber: 389,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "jsx-a6d471fbec0d97d3" + " " + "panel-title",
                                                            children: "安全提示"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/page.tsx",
                                                            lineNumber: 390,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/page.tsx",
                                                    lineNumber: 388,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 387,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-a6d471fbec0d97d3" + " " + "flex-1 flex flex-col justify-center",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "jsx-a6d471fbec0d97d3" + " " + "p-3 rounded bg-[var(--bg-card)] border border-[var(--glass-border)]",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            color: 'var(--text-muted)'
                                                        },
                                                        className: "jsx-a6d471fbec0d97d3" + " " + "text-xs text-center",
                                                        children: "系统正常运行中"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/page.tsx",
                                                        lineNumber: 395,
                                                        columnNumber: 21
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/page.tsx",
                                                    lineNumber: 394,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 393,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 386,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 310,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/page.tsx",
                            lineNumber: 309,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "jsx-a6d471fbec0d97d3"
                        }, void 0, false, {
                            fileName: "[project]/app/page.tsx",
                            lineNumber: 404,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
                            className: "jsx-a6d471fbec0d97d3" + " " + "pointer-events-auto overflow-hidden min-h-0",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-a6d471fbec0d97d3" + " " + "h-full flex flex-col gap-3 min-h-0",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-a6d471fbec0d97d3" + " " + "glass-panel glass-panel-glow glass-panel-compact",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "jsx-a6d471fbec0d97d3" + " " + "flex justify-center",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    color: 'var(--accent-cyan)'
                                                },
                                                className: "jsx-a6d471fbec0d97d3" + " " + "font-mono text-[20px] font-bold text-glow",
                                                children: currentTime
                                            }, void 0, false, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 412,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/page.tsx",
                                            lineNumber: 411,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 410,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-a6d471fbec0d97d3" + " " + "glass-panel glass-panel-glow glass-panel-compact data-card-glow",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-a6d471fbec0d97d3" + " " + "panel-header",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "jsx-a6d471fbec0d97d3" + " " + "flex items-center gap-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sun$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Sun$3e$__["Sun"], {
                                                                className: "w-4 h-4",
                                                                style: {
                                                                    color: 'var(--accent-amber)'
                                                                }
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/page.tsx",
                                                                lineNumber: 422,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "jsx-a6d471fbec0d97d3" + " " + "panel-title",
                                                                children: "光发电"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/page.tsx",
                                                                lineNumber: 423,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/page.tsx",
                                                        lineNumber: 421,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "jsx-a6d471fbec0d97d3" + " " + "flex items-center gap-1",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    background: 'var(--accent-amber)'
                                                                },
                                                                className: "jsx-a6d471fbec0d97d3" + " " + "w-1.5 h-1.5 rounded-full animate-pulse"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/page.tsx",
                                                                lineNumber: 426,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                style: {
                                                                    color: 'var(--accent-amber)'
                                                                },
                                                                className: "jsx-a6d471fbec0d97d3" + " " + "text-[10px] font-tech",
                                                                children: "ACTIVE"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/page.tsx",
                                                                lineNumber: 427,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/page.tsx",
                                                        lineNumber: 425,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 420,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-a6d471fbec0d97d3" + " " + "flex items-baseline gap-1.5",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        style: {
                                                            color: 'var(--accent-amber)'
                                                        },
                                                        className: "jsx-a6d471fbec0d97d3" + " " + "data-value text-glow",
                                                        children: pvPower.toFixed(1)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/page.tsx",
                                                        lineNumber: 431,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "jsx-a6d471fbec0d97d3" + " " + "data-unit",
                                                        children: "kW"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/page.tsx",
                                                        lineNumber: 432,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 430,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-a6d471fbec0d97d3" + " " + "progress-bar mt-3",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        width: `${Math.min(100, pvPower / 40 * 100)}%`,
                                                        background: 'linear-gradient(90deg, var(--accent-amber), rgba(255,179,71,0.5))',
                                                        boxShadow: '0 0 10px rgba(255,179,71,0.4)'
                                                    },
                                                    className: "jsx-a6d471fbec0d97d3" + " " + "progress-bar-fill"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/page.tsx",
                                                    lineNumber: 435,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 434,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 419,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-a6d471fbec0d97d3" + " " + "glass-panel glass-panel-glow glass-panel-compact data-card-glow",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-a6d471fbec0d97d3" + " " + "panel-header",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "jsx-a6d471fbec0d97d3" + " " + "flex items-center gap-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$activity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Activity$3e$__["Activity"], {
                                                            className: "w-4 h-4",
                                                            style: {
                                                                color: 'var(--accent-rose)'
                                                            }
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/page.tsx",
                                                            lineNumber: 443,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "jsx-a6d471fbec0d97d3" + " " + "panel-title",
                                                            children: "站内负荷"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/page.tsx",
                                                            lineNumber: 444,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/page.tsx",
                                                    lineNumber: 442,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 441,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-a6d471fbec0d97d3" + " " + "flex items-baseline gap-1.5",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        style: {
                                                            color: 'var(--accent-rose)'
                                                        },
                                                        className: "jsx-a6d471fbec0d97d3" + " " + "data-value text-glow",
                                                        children: loadPower.toFixed(1)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/page.tsx",
                                                        lineNumber: 448,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "jsx-a6d471fbec0d97d3" + " " + "data-unit",
                                                        children: "kW"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/page.tsx",
                                                        lineNumber: 449,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 447,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-a6d471fbec0d97d3" + " " + "mt-3 flex items-center justify-between",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        style: {
                                                            color: 'var(--text-muted)'
                                                        },
                                                        className: "jsx-a6d471fbec0d97d3" + " " + "text-xs",
                                                        children: "站电负荷率"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/page.tsx",
                                                        lineNumber: 452,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        style: {
                                                            color: 'var(--accent-rose)'
                                                        },
                                                        className: "jsx-a6d471fbec0d97d3" + " " + `font-mono text-sm text-glow`,
                                                        children: [
                                                            loadPower.toFixed(1),
                                                            " kW"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/page.tsx",
                                                        lineNumber: 453,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 451,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 440,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-a6d471fbec0d97d3" + " " + "glass-panel glass-panel-glow glass-panel-compact data-card-glow",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-a6d471fbec0d97d3" + " " + "panel-header",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "jsx-a6d471fbec0d97d3" + " " + "flex items-center gap-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$battery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Battery$3e$__["Battery"], {
                                                            className: "w-4 h-4",
                                                            style: {
                                                                color: 'var(--accent-emerald)'
                                                            }
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/page.tsx",
                                                            lineNumber: 463,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "jsx-a6d471fbec0d97d3" + " " + "panel-title",
                                                            children: "储能系统"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/page.tsx",
                                                            lineNumber: 464,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/page.tsx",
                                                    lineNumber: 462,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 461,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-a6d471fbec0d97d3" + " " + "flex items-baseline gap-1.5",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        style: {
                                                            color: 'var(--accent-emerald)'
                                                        },
                                                        className: "jsx-a6d471fbec0d97d3" + " " + "data-value text-glow",
                                                        children: storageSoc.toFixed(0)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/page.tsx",
                                                        lineNumber: 468,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "jsx-a6d471fbec0d97d3" + " " + "data-unit",
                                                        children: "%"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/page.tsx",
                                                        lineNumber: 469,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 467,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-a6d471fbec0d97d3" + " " + "progress-bar mt-3",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        width: `${storageSoc}%`,
                                                        background: 'linear-gradient(90deg, var(--accent-emerald), rgba(74,255,212,0.5))',
                                                        boxShadow: '0 0 10px rgba(74,255,212,0.4)'
                                                    },
                                                    className: "jsx-a6d471fbec0d97d3" + " " + "progress-bar-fill"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/page.tsx",
                                                    lineNumber: 472,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 471,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-a6d471fbec0d97d3" + " " + "mt-3 flex items-center justify-between",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        style: {
                                                            color: 'var(--text-muted)'
                                                        },
                                                        className: "jsx-a6d471fbec0d97d3" + " " + "text-xs",
                                                        children: "负荷率"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/page.tsx",
                                                        lineNumber: 475,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        style: {
                                                            color: 'var(--accent-emerald)'
                                                        },
                                                        className: "jsx-a6d471fbec0d97d3" + " " + "font-mono text-sm text-glow",
                                                        children: "0%"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/page.tsx",
                                                        lineNumber: 476,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 474,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 460,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-a6d471fbec0d97d3" + " " + "glass-panel glass-panel-glow glass-panel-compact flex-1 min-h-0 overflow-hidden",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$PCMStructureDiagram$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                                            fileName: "[project]/app/page.tsx",
                                            lineNumber: 482,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 481,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 408,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/page.tsx",
                            lineNumber: 407,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/page.tsx",
                    lineNumber: 307,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 306,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "jsx-a6d471fbec0d97d3" + " " + "fixed left-0 right-0 bottom-3 z-50 pointer-events-none px-3",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "jsx-a6d471fbec0d97d3" + " " + "flex justify-center",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-a6d471fbec0d97d3" + " " + "pointer-events-auto w-full max-w-[760px]",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "jsx-a6d471fbec0d97d3" + " " + "glass-panel glass-panel-glow px-5 py-2",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-a6d471fbec0d97d3" + " " + "flex items-center gap-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-a6d471fbec0d97d3" + " " + "min-w-[180px]",
                                        children: timeline.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "jsx-a6d471fbec0d97d3" + " " + "flex items-center gap-2",
                                            children: timeline.slice(0, 4).map((event, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                                                    initial: {
                                                        opacity: 0,
                                                        scale: 0.8
                                                    },
                                                    animate: {
                                                        opacity: event.active ? 1 : 0.3,
                                                        scale: event.active ? 1 : 0.85
                                                    },
                                                    className: "flex items-center gap-1.5",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "jsx-a6d471fbec0d97d3" + " " + `timeline-dot ${event.active ? 'active' : ''}`,
                                                            children: index + 1
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/page.tsx",
                                                            lineNumber: 506,
                                                            columnNumber: 27
                                                        }, this),
                                                        index < 3 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "jsx-a6d471fbec0d97d3" + " " + `timeline-connector ${event.active ? 'active' : ''}`
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/page.tsx",
                                                            lineNumber: 509,
                                                            columnNumber: 41
                                                        }, this)
                                                    ]
                                                }, index, true, {
                                                    fileName: "[project]/app/page.tsx",
                                                    lineNumber: 500,
                                                    columnNumber: 25
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/app/page.tsx",
                                            lineNumber: 498,
                                            columnNumber: 21
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "jsx-a6d471fbec0d97d3" + " " + "flex items-center gap-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$activity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Activity$3e$__["Activity"], {
                                                    className: "w-4 h-4",
                                                    style: {
                                                        color: 'var(--accent-cyan)'
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/app/page.tsx",
                                                    lineNumber: 515,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    style: {
                                                        color: 'var(--text-muted)'
                                                    },
                                                    className: "jsx-a6d471fbec0d97d3" + " " + "text-sm font-tech",
                                                    children: "SYSTEM STANDBY"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/page.tsx",
                                                    lineNumber: 516,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/page.tsx",
                                            lineNumber: 514,
                                            columnNumber: 21
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 496,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-a6d471fbec0d97d3" + " " + "flex items-center gap-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: startNormalDemo,
                                                className: "jsx-a6d471fbec0d97d3" + " " + "btn btn-primary",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$play$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Play$3e$__["Play"], {
                                                        className: "w-4 h-4"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/page.tsx",
                                                        lineNumber: 524,
                                                        columnNumber: 21
                                                    }, this),
                                                    "正常演示"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 523,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: startAbnormalDemo,
                                                className: "jsx-a6d471fbec0d97d3" + " " + "btn btn-danger",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                                                        className: "w-4 h-4"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/page.tsx",
                                                        lineNumber: 528,
                                                        columnNumber: 21
                                                    }, this),
                                                    "异常演示"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 527,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: resetDemo,
                                                className: "jsx-a6d471fbec0d97d3" + " " + "btn btn-secondary",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$rotate$2d$ccw$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__RotateCcw$3e$__["RotateCcw"], {
                                                        className: "w-4 h-4"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/page.tsx",
                                                        lineNumber: 532,
                                                        columnNumber: 21
                                                    }, this),
                                                    "重置"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 531,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 522,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 494,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/page.tsx",
                            lineNumber: 493,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 492,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/page.tsx",
                    lineNumber: 490,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 489,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/page.tsx",
        lineNumber: 227,
        columnNumber: 5
    }, this);
}

})()),
"[project]/app/page.tsx [app-rsc] (ecmascript, Next.js server component, client modules ssr)": (({ r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, g: global, __dirname }) => (() => {


})()),

};

//# sourceMappingURL=app_db3847._.js.map