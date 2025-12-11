/*!
 *
 * Simple Snow – Lightweight Snowfall Effect for WordPress
 * Copyright (c) 2025 Creating Bee & Shahzad Shahab
 * https://creatingbee.com
 * 
 * This file is part of the Simple Snow plugin.
 * Distributed under the GPLv2 or later license.
 * You are free to modify, distribute, and use this code under GPL terms.
 * 
 * If you have any suggestions or need to report a bug
 * please head to my Github or user WordPress support forums.
 * 
 */


(function () {
	'use strict';

	document.addEventListener('DOMContentLoaded', function () {
		const canvas = document.createElement('canvas');
		canvas.id = 'wpss_canvas';
		canvas.style.position = 'fixed';
		canvas.style.top = '0';
		canvas.style.left = '0';
		canvas.style.width = '100%';
		canvas.style.height = '100%';
		canvas.style.pointerEvents = 'none';
		canvas.style.zIndex = '999999';

		document.body.appendChild(canvas);

		const ctx = canvas.getContext('2d');

		function resize() {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
		}

		window.addEventListener('resize', resize);
		resize();

		// Passed from PHP
		const themeIsDark = (wpssSnowSettings.mode === 'dark');

		function rand(min, max) {
			return Math.random() * (max - min) + min;
		}

		const flakes = [];
		const maxFlakes = 90;
		let globalWind = rand(-0.1, 0.1);

		function makeFlake() {
			return {
				x: rand(0, window.innerWidth),
				y: rand(-window.innerHeight, 0),
				size: rand(2.2, 4.8),
				speed: rand(0.4, 1.2),
				opacity: rand(0.65, 1),
				drift: rand(-0.25, 0.25),
				rotation: rand(0, Math.PI * 2),
				rotationSpeed: rand(-0.02, 0.02),
			};
		}

		for (let i = 0; i < maxFlakes; i++) {
			flakes.push(makeFlake());
		}

		function drawFlake(f) {
			ctx.save();
			ctx.globalAlpha = f.opacity;

			ctx.translate(f.x, f.y);
			ctx.rotate(f.rotation);

			const r = f.size;
			const g = ctx.createRadialGradient(0, 0, 0, 0, 0, r);

			// === Gradient Colors ===
			if (themeIsDark) {
				// Bright white for dark themes
				g.addColorStop(0, 'rgba(255,255,255,1)');
				g.addColorStop(0.6, 'rgba(255,255,255,0.9)');
				g.addColorStop(1, 'rgba(255,255,255,0.05)');
			} else {
				// Icy-blue glow for light themes
				g.addColorStop(0, 'rgba(255,255,255,1)');
				g.addColorStop(0.45, 'rgba(240,245,255,0.95)');
				g.addColorStop(1, 'rgba(180,215,255,0.40)');
			}

			ctx.fillStyle = g;

			// === Subtle Icy-Blue Shadow (Light Theme Only) ===
			if (!themeIsDark) {
				ctx.shadowColor = 'rgba(150,190,255,0.45)'; // icy glow
				ctx.shadowBlur = r * 0.85;
			}

			ctx.beginPath();
			ctx.arc(0, 0, r, 0, Math.PI * 2);
			ctx.fill();

			ctx.restore();
		}

		function update() {
			ctx.clearRect(0, 0, canvas.width, canvas.height);

			for (const f of flakes) {
				f.y += f.speed;
				f.x += (globalWind + f.drift) * 0.35;
				f.rotation += f.rotationSpeed;

				// Respawn flake
				if (f.y > window.innerHeight + 10) {
					const nf = makeFlake();
					nf.y = -10;
					Object.assign(f, nf);
				}
			}

			for (const f of flakes) {
				drawFlake(f);
			}

			requestAnimationFrame(update);
		}

		update();
	});
})();
