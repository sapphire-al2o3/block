const Emitter = {

};

const particles = [];
const Max = 500;

const createParticles = (x, y, n) => {
    for (let k = 0; k < n; k++) {
        let p;
        if (particles.length < Max) {
            p = {
                x: 0,
                y: 0,
                vx: 0,
                vy: 0,
                life: 100
            };
            particles.push(p);
        } else {
            for (let i = 0; i < particles.length; i++) {
                if (particles[i].life <= 0) {
                    p = particles[i];
                    break;
                }
            }
        }
        if (p) {
            const r = Math.random() * Math.PI * 2;
            const speed = Math.random() + 1;
            p.x = x;
            p.y = y;
            p.vx = Math.cos(r) * speed;
            p.vy = Math.sin(r) * speed;
            p.life = 16;
        }
    }
};

const updateParticles = () => {
    for (let p of particles) {
        if (p.life > 0) {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.098;
            p.life--;
        }
    }
};
