uniform float uTime;
uniform vec2 uPointer;
uniform float uIntensity;
uniform vec3 uDeep;
uniform vec3 uGlow;
uniform vec3 uHot;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

float hash(vec3 p) {
  p = fract(p * 0.3183099 + vec3(0.1, 0.2, 0.3));
  p *= 17.0;
  return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
}
float noise(vec3 x) {
  vec3 i = floor(x);
  vec3 f = fract(x);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(mix(hash(i), hash(i + vec3(1,0,0)), f.x),
                 mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
             mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
                 mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y), f.z);
}
void main() {
  vec2 uv = vUv - 0.5;
  float t = uTime * 0.16;
  float slice = step(0.985, sin(floor(uv.y * 74.0) + floor(uTime * 2.4)));
  float sliceShift = slice * sin(uTime * 31.0) * 0.018;
  uv.x += sliceShift;
  vec3 p = vec3(uv * 3.4, t);
  float n = noise(p * 2.1 + vec3(sin(t), cos(t * 0.7), 0.0));
  float bands = sin((uv.x * 8.0 + uv.y * 5.0) + n * 5.0 + t * 2.0);
  float field = smoothstep(0.12, 0.92, n * 0.7 + bands * 0.17 + 0.24);
  float rim = pow(1.0 - max(dot(normalize(vNormal), normalize(vec3(0.0, 0.0, 1.0))), 0.0), 2.2);
  float pointerGlow = exp(-length(uv - uPointer) * 4.0);
  vec3 color = mix(uDeep, uGlow, field);
  color = mix(color, uHot, smoothstep(0.64, 1.0, field) * 0.58);
  color += uHot * (rim * 0.9 + pointerGlow * 0.28) * uIntensity;
  color += uGlow * (0.5 + 0.5 * sin(t + uv.y * 9.0)) * 0.22;
  float alpha = smoothstep(0.0, 0.18, length(uv)) * 0.94 + 0.06;
  float chromaHit = smoothstep(0.985, 1.0, sin(uTime * 1.7 + floor(uv.y * 42.0)));
  color.r += chromaHit * 0.12;
  color.b += chromaHit * 0.16;
  gl_FragColor = vec4(color, alpha);
}