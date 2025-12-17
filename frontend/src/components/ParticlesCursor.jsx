import { useEffect, useMemo, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadFull } from "tsparticles"; 

const ParticlesCursor = () => {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadFull(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const options = useMemo(
    () => ({
      fpsLimit: 120,
      interactivity: {
        detectsOn: "window", // Important: Detects mouse everywhere
        events: {
          onHover: {
            enable: true,
            mode: "trail", // The trail effect
          },
        },
        modes: {
          trail: {
            delay: 0.005,
            pauseOnStop: true,
            quantity: 4, // Number of particles per move
          },
        },
      },
      particles: {
        color: {
          value: "#2563eb", // Professional Blue (Matches your theme)
        },
        move: {
          direction: "none",
          enable: true,
          outModes: {
            default: "destroy", // Particles disappear when they stop
          },
          random: true,
          speed: 3, // Speed of the dust flying away
          straight: false,
        },
        number: {
          value: 0, // Start with 0 (only create on mouse move)
        },
        opacity: {
          value: { min: 0.3, max: 0.8 },
          animation: {
            enable: true,
            speed: 3, // Fade out speed
            sync: false,
            startValue: "max",
            destroy: "min",
          },
        },
        shape: {
          type: "circle",
        },
        size: {
          value: { min: 2, max: 5 }, // Varied size for "dust" look
        },
      },
      detectRetina: true,
      fullScreen: {
        enable: true,
        zIndex: 9999, // On top of everything
      },
    }),
    [],
  );

  if (init) {
    return (
      <Particles 
        id="tsparticles" 
        options={options} 
        style={{ pointerEvents: "none" }} // Crucial: Lets you click buttons through the particles
      />
    );
  }

  return <></>;
};

export default ParticlesCursor;