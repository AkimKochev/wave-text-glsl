uniform float u_time;
uniform float u_hover;

varying float vNoise;
varying vec2 vUv;

void main() {
    vec3 newPosition = position;
    float PI = 3.14159265;

    // float noise = vec3(newPosition.x * 4. + u_time / 100., newPosition.y * 4. + u_time / 100., 0.);
		float dist = distance(uv, vec2(.5));
    vNoise = sin(u_time + dist);
    newPosition += normal * 0.2 * vNoise;
    vUv = uv;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}
