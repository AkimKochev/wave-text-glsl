import * as THREE from 'three';
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import fragment from './shaders/fragment.glsl';
import vertex from './shaders/vertex.glsl';
import {FontLoader} from 'three/examples/jsm/loaders/FontLoader.js';
import {TextGeometry} from 'three/examples/jsm/geometries/TextGeometry.js';

import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';

class App {
	constructor() {
		this.clock = new THREE.Clock();
		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera(
			75,
			window.innerWidth / window.innerHeight,
			0.1,
			1000
		);
		this.renderer = new THREE.WebGLRenderer({
			antialias: true,
			alpha: true,
		});
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
		document.body.appendChild(this.renderer.domElement);

		// this.controls = new OrbitControls(this.camera, this.renderer.domElement);
		// this.controls.enableDamping = true;

		// mouse event
		this.raycaster = new THREE.Raycaster();
		this.pointer = new THREE.Vector2();

		this.createObject();
		this.addEventListeners();
	}

	async createObject() {
		const textContent = `We have done \nwhat wanted. \nWe have discarded dreams,\npreferring the heavy \nindustry of each other, \nand we have welcomed \ngrief and called ruin \nthe impossible habit to break. \nAnd now we are here. \nThe dinner is ready \nand we cannot eat. \nThe meat sits...`;
		const loader = new FontLoader();
		loader.load('fonts/helvetiker_regular.typeface.json', (font) => {
			this.geometry = new TextGeometry(textContent, {
				font: font,
				size: 1,
				height: 0,
				curveSegments: 12,
				// bevelEnabled: true,
				bevelThickness: 0.03,
				bevelSize: 0.02,
				bevelOffset: 0,
				bevelSegments: 5,
			});

			this.geometry.center();
			this.material = new THREE.ShaderMaterial({
				vertexShader: vertex,
				fragmentShader: fragment,
				uniforms: {
					u_time: {
						value: 0,
					},
					u_hover: {value: new THREE.Vector2(0.5, 0.5)},
				},
			});
			const text = new THREE.Mesh(this.geometry, this.material);
			this.scene.add(text);

			this.camera.position.z = 20;
			this.camera.position.y = -4;
			text.rotation.z = 0.8;
			text.rotation.x = -0.8;
			this.update();
		});
	}

	resize() {
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.camera.aspect(window.innerWidth, window.innerHeight);
		this.camera.updateProjectionMatrix();
	}

	mouseMove(event) {
		this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
		this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

		// update the picking ray with the camera and pointer position
		this.raycaster.setFromCamera(this.pointer, this.camera);

		const intersects = this.raycaster.intersectObjects(this.scene.children);

		if (intersects.length > 0) {
			let obj = intersects[0].object;
			obj.material.uniforms.u_hover.value = intersects[0].uv;
		}
	}

	addEventListeners() {
		window.addEventListener('resize', this.resize.bind(this));
		window.addEventListener('mousemove', this.mouseMove.bind(this));
	}

	update() {
		// this.text.rotation.x += 0.01;
		// this.text.rotation.y += 0.01;
		this.renderer.render(this.scene, this.camera);

		const elapsedTime = this.clock.getElapsedTime();
		this.material.uniforms.u_time.value = elapsedTime;

		requestAnimationFrame(this.update.bind(this));
	}
}

new App();
