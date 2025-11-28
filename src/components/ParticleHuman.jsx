// src/components/ParticleHuman.jsx
import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export default function ParticleHuman({
  selectedMuscle,
  hoverMuscle,
  width = 400,
  height = 600,
}) {
  const mountRef = useRef(null);
  const particleGroupsRef = useRef({});

  // 색상 매핑
  const muscleColors = {
    neck: 0xff6b9d,
    shoulders: 0xffa500,
    chest: 0xff0000,
    back: 0x7b68ee,
    arms: 0x32cd32,
    core: 0xffd700,
    glutes: 0xff1493,
    thighs: 0x1e90ff,
    calves: 0x00fa9a,
  };

  // 기본 Z축 분류
  const getBodyPartByZ = (z) => {
    if (z > 170) return "neck";
    if (z > 150) return "shoulders";
    if (z > 120) return "chest";
    if (z > 80) return "core";
    if (z > 50) return "glutes";
    if (z > 25) return "thighs";
    return "calves";
  };

  // ⭐ 좌표 기반 부위 분류 함수
  const detectPartByCoords = (x, y, z) => {
    // 앞쪽/뒤쪽 분리 기준
    const isFront = y >= 0;
    const isBackSide = y < 0;

    // --- 목 (Neck) - 가장 높은 부분
    if (z > 175 && Math.abs(x) <= 15) {
      return "neck";
    }

    // --- 어깨 (Shoulders) - 높은 부분 + 팔 쪽
    if ((Math.abs(x) > 15 && z >= 120) || (z >= 155 && z <= 175)) {
      return "shoulders";
    }

    // --- 가슴 (Front Chest) - 앞쪽, 중간 높이
    if (
      isFront &&
      Math.abs(x) <= 15 &&
      z >= 145 &&
      z <= 175
    ) {
      return "chest";
    }

    // --- 등 (Back) - 뒤쪽, 중간 높이
    if (isBackSide && z >= 110 && z <= 175) {
      return "back";
    }

    // --- 코어 (복부) - 앞쪽, 중간-하단
    if (isFront && z >= 90 && z <= 145) {
      return "core";
    }

    // --- 엉덩이 (Glutes) - 뒤쪽, 중간-하단
    if (isBackSide && z >= 50 && z <= 110) {
      return "glutes";
    }

    // --- 허벅지 (Thighs)
    if (z >= 25 && z <= 90) {
      return "thighs";
    }

    // --- 종아리 (Calves)
    if (z < 25) {
      return "calves";
    }

    // fallback
    return getBodyPartByZ(z);
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const w = container.clientWidth;
    const h = container.clientHeight;

    const scene = new THREE.Scene();
    scene.background = null;

    const camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 1000);
    camera.position.set(0, 0, 2.5);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 1.5;
    controls.maxDistance = 5;

    scene.add(new THREE.AmbientLight(0xffffff, 1.5));
    const d1 = new THREE.DirectionalLight(0xffffff, 1);
    d1.position.set(5, 5, 5);
    scene.add(d1);

    const d2 = new THREE.DirectionalLight(0x00d4ff, 0.5);
    d2.position.set(-5, 3, -3);
    scene.add(d2);

    const loader = new GLTFLoader();

    loader.load(
      "/models/human.glb",
      (gltf) => {
        const model = gltf.scene;

        const particlesByPart = {};

        model.traverse((child) => {
          if (child.isMesh && child.geometry?.attributes?.position) {
            const positions = child.geometry.attributes.position.array;

            for (let i = 0; i < positions.length; i += 90) {
              const x = positions[i];
              const y = positions[i + 1];
              const z = positions[i + 2];

              // ⭐ 좌표 기반 분류
              const partName = detectPartByCoords(x, y, z);

              if (!particlesByPart[partName]) {
                particlesByPart[partName] = [];
              }
              particlesByPart[partName].push(new THREE.Vector3(x, y, z));
            }
          }
        });

        console.log("📌 분류된 파티클");
        console.table(
          Object.entries(particlesByPart).map(([p, arr]) => ({
            part: p,
            count: arr.length,
          }))
        );

        // 모델 중심 정렬
        const box = new THREE.Box3().setFromObject(model);
        const size = new THREE.Vector3();
        const center = new THREE.Vector3();
        box.getSize(size);
        box.getCenter(center);

        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 1.8 / maxDim;

        // 파티클 시스템 생성
        Object.keys(particlesByPart).forEach((partName) => {
          const pts = particlesByPart[partName];
          const geom = new THREE.BufferGeometry();
          const buf = new Float32Array(pts.length * 3);

          pts.forEach((p, i) => {
            buf[i * 3] = p.x;
            buf[i * 3 + 1] = p.y;
            buf[i * 3 + 2] = p.z;
          });

          geom.setAttribute("position", new THREE.BufferAttribute(buf, 3));

          const mat = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.012,
            opacity: 0.7,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
            sizeAttenuation: true,
          });

          const mesh = new THREE.Points(geom, mat);
          mesh.scale.setScalar(scale);
          mesh.position.set(-center.x * scale, -center.y * scale, -center.z * scale);
          mesh.rotation.x = -Math.PI / 2;
          scene.add(mesh);

          particleGroupsRef.current[partName] = {
            system: mesh,
            targetColor: new THREE.Color(0xffffff),
            currentColor: new THREE.Color(0xffffff),
          };
        });

        console.log("🎉 파티클 생성 완료");
      },
      undefined,
      (e) => console.log("⚠ GLB load error:", e)
    );

    const animate = () => {
      requestAnimationFrame(animate);

      Object.values(particleGroupsRef.current).forEach((g) => {
        g.currentColor.lerp(g.targetColor, 0.08);
        g.system.material.color.copy(g.currentColor);
      });

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      renderer.setSize(newW, newH);
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      container.innerHTML = "";
    };
  }, []);

  // 선택/호버 색상 반영
  useEffect(() => {
    const active = hoverMuscle || selectedMuscle;
    Object.keys(particleGroupsRef.current).forEach((name) => {
      const g = particleGroupsRef.current[name];
      if (name === active && muscleColors[active]) {
        g.targetColor.setHex(muscleColors[active]);
      } else {
        g.targetColor.setHex(0xffffff);
      }
    });
  }, [selectedMuscle, hoverMuscle]);

  return (
    <div
      ref={mountRef}
      style={{
        width: "100%",
        height: "100%",
        minHeight: height,
        borderRadius: "20px",
        background: "transparent",
        cursor: "grab",
      }}
    />
  );
}