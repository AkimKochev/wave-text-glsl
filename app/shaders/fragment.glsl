varying vec2 vUv;
varying float vNoise;

uniform float u_time;

void main() {
	vec3 color = vec3(0.);
	gl_FragColor = vec4(color, 1.);
	// gl_FragColor.rgb += vec3(vUv, .2) * .1;
}
