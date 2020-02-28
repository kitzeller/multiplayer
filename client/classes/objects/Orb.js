import * as BABYLON from 'babylonjs';

export default class Orb {
    constructor(scene, shaderMaterials) {

        this.scene = scene;
        this.shaderMaterials = shaderMaterials;

        BABYLON.Effect.ShadersStore["customVertexShader"] = "precision highp float;\r\n" +

            "// Attributes\r\n" +
            "attribute vec3 position;\r\n" +
            "attribute vec3 normal;\r\n" +
            "attribute vec2 uv;\r\n" +

            "// Uniforms\r\n" +
            "uniform mat4 worldViewProjection;\r\n" +

            "// Varying\r\n" +
            "varying vec4 vPosition;\r\n" +
            "varying vec2 vUv;\r\n" +
            "varying vec3 vNormal;\r\n" +

            "void main() {\r\n" +

            "    vec4 p = vec4( position, 1. );\r\n" +

            "    vPosition = p;\r\n" +
            "    vNormal = normal;\r\n" +
            "    vUv = uv;\r\n" +

            "    gl_Position = worldViewProjection * p;\r\n" +

            "}\r\n";

        BABYLON.Effect.ShadersStore["customFragmentShader"] = "precision highp float;\r\n" +

            "uniform mat4 worldView;\r\n" +
            "varying vec2 vUv;\r\n" +

            "uniform float time;\r\n" +
            "uniform vec2 resolution;\r\n" +
            "varying vec4 vPosition;\r\n" +
            "varying vec3 vNormal;\r\n" +

            "uniform sampler2D textureSampler;\r\n" +
            "uniform sampler2D refSampler;mat2 m = mat2(0.90, 0.110, -0.70, 1.00);\r\n" +
            "float ha(float n) \r\n" +
            "{\r\n" +
            "    return fract(sin(n) * 758.5453);\r\n" +
            "}\r\n" +
            "float no(in vec3 x) \r\n" +
            "{\r\n" +
            "    vec3 p = floor(x);\r\n" +
            "    vec3 f = fract(x);\r\n" +
            "    float n = p.x + p.y * 57.0 + p.z * 800.0;\r\n" +
            "    float res = mix(mix(mix(ha(n + 0.0), ha(n + 1.0), f.x), mix(ha(n + 57.0), ha(n + 58.0), f.x), f.y), mix(mix(ha(n + 800.0), ha(n + 801.0), f.x), mix(ha(n + 857.0), ha(n + 858.0), f.x), f.y), f.z);\r\n" +
            "    return res;\r\n" +
            "}\r\n" +
            "float fbm(vec3 p) \r\n" +
            "{\r\n" +
            "    float f = 0.0;\r\n" +
            "    f += 0.50000 * no(p);\r\n" +
            "    p = p * 2.02;\r\n" +
            "    f -= 0.25000 * no(p);\r\n" +
            "    p = p * 2.03;\r\n" +
            "    f += 0.12500 * no(p);\r\n" +
            "    p = p * 2.01;\r\n" +
            "    f += 0.06250 * no(p);\r\n" +
            "    p = p * 2.04;\r\n" +
            "    f -= 0.03125 * no(p);\r\n" +
            "    return f / 0.984375;\r\n" +
            "}\r\n" +
            "float cloud(vec3 p) \r\n" +
            "{\r\n" +
            "    p -= fbm(vec3(p.x, p.y, 0.0) * 0.5) * 2.25;\r\n" +
            "    float a = 0.0;\r\n" +
            "    a -= fbm(p * 3.0) * 2.2 - 1.1;\r\n" +
            "    if (a < 0.0) a = 0.0;\r\n" +
            "     a = a * a;\r\n" +
            "    return a;\r\n" +
            "}\r\n" +
            "vec3 f2(vec3 c) \r\n" +
            "{\r\n" +
            "    c += ha(vUv.x + vUv.y * 9.9) * 0.01;\r\n" +
            "    c *= 0.7 - length(vUv.xy / vec2(1.,1.) - 0.5) * 0.7;\r\n" +
            "    float w = length(c);\r\n" +
            "    c = mix(c * vec3(1.0, 1.0, 1.6), vec3(w, w, w) * vec3(1.4, 1.2, 1.0), w * 1.1 - 0.2);\r\n" +
            "    return c;\r\n" +
            "}\r\n" +
            "void main(void) \r\n" +
            "{\r\n" +
            "     \r\n" +
            "    vec2 position = (vUv.xy /vec2(1.,1.));\r\n" +
            "    position.y += 0.2;\r\n" +
            "    vec2 coord = vec2((position.x - 0.5) / position.y, 1.0 / (position.y + 0.2));\r\n" +
            "    coord += time * 0.1;\r\n" +
            "    float q = cloud(vec3(coord * 1.0, 0.222));\r\n" +
            "    vec3 col = vec3(0.2, 0.4, 0.5) + vec3(q * vec3(0.2, 0.4, 0.1));\r\n" +
            "    gl_FragColor = vec4(f2(col), 1.0);\r\n" +
            "}\r\n";


        var shaderMaterial = new BABYLON.ShaderMaterial("shader", this.scene, {
                vertex: "custom",
                fragment: "custom",
            },
            {
                attributes: ["position", "normal", "uv"],
                uniforms: ["world", "worldView", "worldViewProjection", "view", "projection"]
            });


        shaderMaterial.backFaceCulling = false;
        var orb = BABYLON.MeshBuilder.CreateSphere("orb", {diameter: 30}, this.scene);
        orb.position.y = 20;
        orb.position.z = 30;
        orb.material = shaderMaterial;
        this.shaderMaterials.push(shaderMaterial);

        return orb;
    }
}
