document.addEventListener('DOMContentLoaded', () => {
    // 1. Custom Cursor
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    
    if (cursorDot && cursorOutline && window.innerWidth > 1024) {
        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;
            
            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;
            
            cursorOutline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 500, fill: "forwards" });
        });

        const interactives = document.querySelectorAll('a, button, .faq-question, .mobile-toggle, input, textarea, .rec-opt, .sim-opt, .upload-zone, .goal-btn, .unlock-btn');
        interactives.forEach(el => {
            el.addEventListener('mouseenter', () => document.documentElement.classList.add('cursor-hover'));
            el.addEventListener('mouseleave', () => document.documentElement.classList.remove('cursor-hover'));
        });
    }

    // 2. Premium Loader
    const loader = document.getElementById('loader');
    if (loader) {
        setTimeout(() => {
            loader.style.opacity = '0';
            loader.style.visibility = 'hidden';
            setTimeout(revealFunc, 500);
        }, 2200);
    }

    // 3. Scroll Progress Bar
    const scrollProgress = document.getElementById('scroll-progress');
    if (scrollProgress) {
        window.addEventListener('scroll', () => {
            const totalScroll = document.documentElement.scrollTop;
            const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scroll = `${totalScroll / windowHeight * 100}%`;
            scrollProgress.style.width = scroll;
        });
    }

    // 4. Sticky Navbar
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) header.classList.add('scrolled');
        else header.classList.remove('scrolled');
    });

    // Mobile Navbar Toggle
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelector('.nav-links');
    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            const icon = mobileToggle.querySelector('i');
            if (navMenu) {
                navMenu.classList.toggle('active');
                if (navMenu.classList.contains('active')) {
                    if (icon) icon.className = 'ri-close-line';
                } else {
                    if (icon) icon.className = 'ri-menu-3-line';
                }
            } else if (navLinks) {
                navLinks.classList.toggle('active');
                if (navLinks.classList.contains('active')) {
                    if (icon) icon.className = 'ri-close-line';
                } else {
                    if (icon) icon.className = 'ri-menu-3-line';
                }
            }
        });
    }

    // Close mobile menu when links are clicked
    const menuLinks = document.querySelectorAll('.nav-links a');
    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu) {
                navMenu.classList.remove('active');
                const icon = mobileToggle ? mobileToggle.querySelector('i') : null;
                if (icon) icon.className = 'ri-menu-3-line';
            } else if (navLinks) {
                navLinks.classList.remove('active');
                const icon = mobileToggle ? mobileToggle.querySelector('i') : null;
                if (icon) icon.className = 'ri-menu-3-line';
            }
        });
    });

    // 5. Scroll Reveal
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    const revealFunc = () => {
        let windowHeight = window.innerHeight;
        revealElements.forEach(el => {
            let elementTop = el.getBoundingClientRect().top;
            if (elementTop < windowHeight - 100) el.classList.add('active');
        });
    };
    window.addEventListener('scroll', revealFunc);

    // 6. Before/After Transformation Slider (Consolidated & Improved)
    const baContainers = document.querySelectorAll('.ba-container');
    baContainers.forEach(baContainer => {
        const baBefore = baContainer.querySelector('.ba-before');
        const baSliderLine = baContainer.querySelector('.ba-slider-line');
        const baSliderBtn = baContainer.querySelector('.ba-slider-btn');
        let isDragging = false;
        
        const moveSlider = (e) => {
            if (!isDragging && e.type !== 'touchmove') return;
            if (e.type === 'touchmove') {
                e.preventDefault();
            }
            const rect = baContainer.getBoundingClientRect();
            let x = e.clientX || (e.touches && e.touches[0].clientX);
            if (x === undefined) return;
            
            let position = ((x - rect.left) / rect.width) * 100;
            position = Math.max(0, Math.min(100, position));
            
            if (baBefore) baBefore.style.clipPath = `polygon(0 0, ${position}% 0, ${position}% 100%, 0 100%)`;
            if (baSliderLine) baSliderLine.style.left = `${position}%`;
            if (baSliderBtn) baSliderBtn.style.left = `${position}%`;
        };

        const startDragging = () => isDragging = true;
        const stopDragging = () => isDragging = false;

        baContainer.addEventListener('mousedown', startDragging);
        baContainer.addEventListener('touchstart', startDragging, { passive: true });
        window.addEventListener('mouseup', stopDragging);
        window.addEventListener('touchend', stopDragging, { passive: true });
        
        baContainer.addEventListener('mousemove', moveSlider);
        baContainer.addEventListener('touchmove', moveSlider, { passive: false });
    });

    // Sim Options & Range
    const simOpts = document.querySelectorAll('.sim-opt');
    simOpts.forEach(opt => {
        opt.addEventListener('click', () => {
            simOpts.forEach(o => o.classList.remove('active'));
            opt.classList.add('active');
            const afterImg = document.getElementById('sim-after');
            if (afterImg) {
                afterImg.style.opacity = '0.5';
                setTimeout(() => afterImg.style.opacity = '1', 300);
            }
        });
    });

    const simRange = document.getElementById('sim-range');
    const simDaysDisplay = document.getElementById('sim-days');
    if(simRange) {
        simRange.addEventListener('input', (e) => {
            if (simDaysDisplay) simDaysDisplay.innerText = `${e.target.value} Days`;
            const labels = document.querySelectorAll('.ba-label');
            if(labels[1]) labels[1].innerText = `Day ${e.target.value}`;
        });
    }

    // 7. Smart Recommendation Engine Logic
    const openRecBtn = document.getElementById('open-rec-engine');
    const recModal = document.getElementById('rec-modal');
    if(openRecBtn) {
        openRecBtn.addEventListener('click', () => recModal.classList.add('active'));
        
        const steps = document.querySelectorAll('.step');
        const recOpts = document.querySelectorAll('.rec-opt');
        const progressBar = id('rec-progress');
        
        recOpts.forEach(opt => {
            opt.addEventListener('click', () => {
                const stepEl = opt.closest('.step');
                const stepNum = parseInt(stepEl.dataset.step);
                if (stepNum < 3) {
                    stepEl.classList.remove('active');
                    steps[stepNum].classList.add('active');
                    progressBar.style.width = `${((stepNum + 1) / 3) * 100}%`;
                } else {
                    steps.forEach(s => s.classList.remove('active'));
                    id('rec-result').classList.add('active');
                    progressBar.style.width = '100%';
                    id('rec-display').innerHTML = `
                        <div class="glass-card" style="border: 1px solid var(--primary); padding: 2rem;">
                            <h3 style="font-size: 1.5rem; margin-bottom: 0.5rem;">ULTIMATE VIP</h3>
                            <p style="font-size: 2rem; font-weight: 900; color: var(--primary);">৳15,000/mo</p>
                            <p class="text-muted" style="margin-top: 1rem;">Based on your ambitious goals, this plan will yield results in 45 days.</p>
                        </div>
                    `;
                }
            });
        });
    }

    // 8. Live Crowd Meter Logic
    const crowdVal = document.querySelector('.crowd-val');
    const crowdIndicator = document.querySelector('.crowd-indicator');
    if(crowdVal) {
        setInterval(() => {
            const rand = Math.floor(Math.random() * 100);
            let status = rand < 40 ? "Low" : (rand < 80 ? "Medium" : "Peak");
            let color = rand < 40 ? "#4CAF50" : (rand < 80 ? "#FFC107" : "#F44336");
            crowdVal.innerText = `${status} (${rand}%)`;
            crowdIndicator.style.backgroundColor = color;
            crowdIndicator.style.boxShadow = `0 0 10px ${color}`;
        }, 5000);
    }

    // 9. Counter Animation for Stats
    const counters = document.querySelectorAll('.counter');
    const speed = 200; // The higher the slower

    const startCounter = (el) => {
        const target = +el.getAttribute('data-target');
        const count = +el.innerText;
        const inc = target / speed;

        if (count < target) {
            el.innerText = Math.ceil(count + inc);
            setTimeout(() => startCounter(el), 1);
        } else {
            el.innerText = target;
        }
    };

    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                startCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));

    // 10. Social Proof Engine
    const proofToasts = document.getElementById('proof-toasts');
    if(proofToasts) {
        const toastData = ["12 people joined this week", "3 slots left for PT", "Rahim just achieved his 90-day goal!"];
        let idx = 0;
        setInterval(() => {
            const t = document.createElement('div');
            t.className = 'toast';
            t.innerHTML = `<i class="ri-notification-3-line"></i> <span class="toast-text">${toastData[idx]}</span>`;
            proofToasts.appendChild(t);
            setTimeout(() => t.classList.add('active'), 100);
            setTimeout(() => { t.classList.remove('active'); setTimeout(() => t.remove(), 500); }, 4000);
            idx = (idx + 1) % toastData.length;
        }, 8000);
    }

    // 11. Currency Converter
    const currToggle = document.querySelector('.currency-toggle');
    if (currToggle) {
        currToggle.addEventListener('click', (e) => {
            const target = e.target.closest('span');
            if (!target) return;
            currToggle.querySelectorAll('span').forEach(s => s.classList.remove('active'));
            target.classList.add('active');
            
            const isUsd = target.dataset.curr === 'USD';
            const prices = document.querySelectorAll('.plan-price');
            prices.forEach(p => {
                const bdt = parseInt(p.dataset.bdt);
                const currSpan = p.querySelector('.currency');
                const valSpan = p.querySelector('.price-val');
                if (isUsd) {
                    currSpan.innerText = '$';
                    valSpan.innerText = Math.round(bdt * 0.0091);
                } else {
                    currSpan.innerText = '৳';
                    valSpan.innerText = bdt.toLocaleString();
                }
            });
        });
    }

    // 12. Flash Sale Countdown Timer
    const countdownEl = document.getElementById('countdown');
    if (countdownEl) {
        let timeLeft = 2 * 60 * 60;
        const timer = setInterval(() => {
            const h = Math.floor(timeLeft / 3600);
            const m = Math.floor((timeLeft % 3600) / 60);
            const s = timeLeft % 60;
            countdownEl.innerText = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
            if (timeLeft <= 1800) countdownEl.parentElement.style.color = "#ffff00"; // Warn at 30 mins
            if (timeLeft <= 0) clearInterval(timer);
            timeLeft--;
        }, 1000);
    }

    // 13. Goal-Based Content Switcher
    const goalBtns = document.querySelectorAll('.goal-btn');
    const dynamicContent = document.getElementById('hero-dynamic-content');
    const goalData = {
        weight: { subtitle: "💪 Modern Fitness Center – Badda", title: "LOSE WEIGHT <br><span>FEEL HEALTHY</span>", desc: "Achieve your ideal physique with expert-guided weight loss programs, high-energy cardio workouts, and premium support at Extreme Fitness." },
        muscle: { subtitle: "💪 Modern Fitness Center – Badda", title: "BUILD STRENGTH <br><span>FEEL EMPOWERED</span>", desc: "Build elite muscle and raw power with modern strength training equipment and professional coaching at Extreme Fitness." },
        fit: { subtitle: "💪 Modern Fitness Center – Badda", title: "TRANSFORM YOUR BODY <br><span>PRIORITIZE WELLBEING</span>", desc: "Extreme Fitness is a complete fitness destination in Badda featuring expert trainers, modern equipment, and structured programs." }
    };
    goalBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const goal = btn.dataset.goal;
            goalBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            dynamicContent.style.opacity = '0';
            setTimeout(() => {
                const d = goalData[goal];
                dynamicContent.querySelector('.hero-eyebrow').innerText = d.subtitle;
                dynamicContent.querySelector('.hero-title').innerHTML = d.title;
                dynamicContent.querySelector('.hero-desc').innerText = d.desc;
                dynamicContent.style.opacity = '1';
            }, 400);
        });
    });

    // 14. Interactive Price Reveal V2
    const unlockBtnsV2 = document.querySelectorAll('.unlock-btn-v2');
    unlockBtnsV2.forEach(btn => {
        btn.addEventListener('click', () => {
            const card = btn.closest('.pricing-card-v2');
            btn.style.display = 'none';
            const joinBtn = card.querySelector('.join-btn-v2');
            if (joinBtn) joinBtn.style.display = 'inline-block';
            window.triggerSuccess();
        });
    });

    // 15. Testimonial Carousel
    const track = id('testimonial-track');
    const dotsContainer = id('carousel-dots');
    if (track) {
        const items = document.querySelectorAll('.testimonial-item');
        items.forEach((_, i) => {
            const d = document.createElement('div');
            d.className = `dot ${i === 0 ? 'active' : ''}`;
            d.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(d);
        });
        const dots = document.querySelectorAll('.dot');
        const goToSlide = (idx) => {
            track.style.transform = `translateX(-${idx * 100}%)`;
            dots.forEach(d => d.classList.remove('active'));
            dots[idx].classList.add('active');
        };
        let cur = 0;
        setInterval(() => { cur = (cur + 1) % items.length; goToSlide(cur); }, 3000);
    }

    // 16. Pricing Switcher Logic
    const priceSwitch = id('price-switch');
    if (priceSwitch) {
        const labels = [id('label-monthly'), id('label-yearly')];
        const priceVals = document.querySelectorAll('.price-val-v2');
        
        priceSwitch.addEventListener('click', () => {
            priceSwitch.classList.toggle('active');
            const isYearly = priceSwitch.classList.contains('active');
            
            labels.forEach(l => l.classList.toggle('active'));
            if (isYearly) {
                labels[0].style.color = 'var(--text-muted)';
                labels[1].style.color = 'var(--primary)';
            } else {
                labels[0].style.color = 'var(--primary)';
                labels[1].style.color = 'var(--text-muted)';
            }

            priceVals.forEach(val => {
                const target = isYearly ? val.dataset.yearly : val.dataset.monthly;
                let current = parseInt(val.innerText.replace(',', ''));
                let start = Date.now();
                const duration = 400;
                const animate = () => {
                    let progress = (Date.now() - start) / duration;
                    if (progress > 1) progress = 1;
                    let v = Math.round(current + (target - current) * progress);
                    val.innerText = v.toLocaleString();
                    if (progress < 1) requestAnimationFrame(animate);
                };
                requestAnimationFrame(animate);
            });
        });
    }

    // Utility
    function id(n) { return document.getElementById(n); }
    window.triggerSuccess = () => {
        for(let i=0; i<30; i++) {
            const c = document.createElement('div');
            c.style.cssText = `position:fixed; width:10px; height:10px; background:${['#fff', '#9d50bb', '#d4af37'][Math.floor(Math.random()*3)]}; left:50%; top:50%; z-index:10003; pointer-events:none;`;
            document.body.appendChild(c);
            const dx = (Math.random() - 0.5) * window.innerWidth, dy = (Math.random() - 0.5) * window.innerHeight;
            c.animate([{ transform: 'translate(0,0)', opacity:1 }, { transform: `translate(${dx}px,${dy}px)`, opacity:0 }], { duration: 2000 }).onfinish = () => c.remove();
        }
    };

    // ── BMI Calculator ──────────────────────────────────────────────
    const bmiForm = document.getElementById('bmi-form');
    const bmiResult = document.getElementById('bmi-result');
    if (bmiForm) {
        bmiForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const w = parseFloat(document.getElementById('weight').value);
            const hCm = parseFloat(document.getElementById('height').value);
            if (!w || !hCm) return;
            const hM = hCm / 100;
            const bmi = (w / (hM * hM)).toFixed(1);
            let cat, col, tip;
            if (bmi < 18.5)      { cat = 'Underweight'; col = '#60a5fa'; tip = 'A muscle-gain program with our strength coaches will get you to your ideal weight.'; }
            else if (bmi < 25)   { cat = 'Normal';      col = '#4ade80'; tip = 'Great shape! Maintain it with our Pro membership.'; }
            else if (bmi < 30)   { cat = 'Overweight';  col = '#fbbf24'; tip = 'Our fat-loss program can help you shed those extra kilos in 60 days.'; }
            else                 { cat = 'Obese';        col = '#f87171'; tip = 'Start your transformation today — our coaches specialize in sustainable weight loss.'; }

            const pct = Math.min(Math.max(((bmi - 10) / 40) * 100, 0), 100);
            bmiResult.innerHTML = `
                <div class="bmi-output">
                    <div class="bmi-score" style="color:${col};">${bmi}</div>
                    <div class="bmi-label" style="color:${col};">${cat}</div>
                    <div class="bmi-bar-wrap">
                        <div class="bmi-bar-fill" style="width:${pct}%;background:${col};"></div>
                    </div>
                    <p class="bmi-tip"><i class="ri-lightbulb-flash-line" style="color:var(--primary);"></i> ${tip}</p>
                    <a href="#pricing" class="btn btn-primary" style="margin-top:1.2rem;width:100%;border-radius:50px;">See My Plan →</a>
                </div>`;
        });
    }

    // ── Start Sim Button ────────────────────────────────────────────
    const startSimBtn = document.getElementById('start-sim-btn');
    if (startSimBtn) {
        startSimBtn.addEventListener('click', () => {
            startSimBtn.innerHTML = '<i class="ri-loader-4-line" style="animation:spin .6s linear infinite;display:inline-block;"></i> Processing...';
            setTimeout(() => {
                startSimBtn.innerHTML = '✓ Transformation Simulated!';
                startSimBtn.style.background = 'linear-gradient(90deg,#4ade80,#16a34a)';
                const afterImg = document.getElementById('sim-after');
                if (afterImg) {
                    afterImg.style.filter = 'saturate(1.3) contrast(1.1)';
                }
                window.triggerSuccess();
            }, 1800);
        });
    }

    // ── Upload Zone ─────────────────────────────────────────────────
    const uploadZone = document.getElementById('sim-upload');
    if (uploadZone) {
        uploadZone.addEventListener('click', () => {
            const inp = document.createElement('input');
            inp.type = 'file'; inp.accept = 'image/*';
            inp.onchange = (e) => {
                const file = e.target.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = (ev) => {
                    const before = document.getElementById('sim-before');
                    if (before) { before.src = ev.target.result; }
                    uploadZone.innerHTML = `<i class="ri-check-line" style="font-size:2.5rem;color:#4ade80;"></i><h4 style="color:#4ade80;">Photo Loaded!</h4>`;
                };
                reader.readAsDataURL(file);
            };
            inp.click();
        });
    }

    // ── Re-engage popup (idle 30s) ──────────────────────────────────
    const reEngage = document.getElementById('re-engage-popup');
    if (reEngage) {
        let idleTimer;
        const resetIdle = () => {
            clearTimeout(idleTimer);
            idleTimer = setTimeout(() => reEngage.classList.add('active'), 30000);
        };
        ['mousemove','scroll','keypress','touchstart'].forEach(ev =>
            document.addEventListener(ev, resetIdle, { passive: true }));
        resetIdle();
    }

    // ── Mouse Gradient Sections ─────────────────────────────────────
    document.querySelectorAll('.mouse-gradient').forEach(section => {
        section.addEventListener('mousemove', (e) => {
            const rect = section.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top)  / rect.height) * 100;
            section.style.setProperty('--mx', `${x}%`);
            section.style.setProperty('--my', `${y}%`);
        });
    });

    // ── Parallax Scroll ─────────────────────────────────────────────
    const parallaxBgs = document.querySelectorAll('.parallax-bg');
    window.addEventListener('scroll', () => {
        parallaxBgs.forEach(bg => {
            const rect = bg.closest('.parallax-section').getBoundingClientRect();
            const offset = -rect.top * 0.35;
            bg.style.transform = `translateY(${offset}px) scale(1.12)`;
        });
    }, { passive: true });

    // ── Hero Canvas (Particle Field) ────────────────────────────────
    const canvas = document.getElementById('hero-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let W, H, particles = [];
        const resize = () => {
            W = canvas.width  = canvas.offsetWidth;
            H = canvas.height = canvas.offsetHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        const NUM = 60;
        for (let i = 0; i < NUM; i++) {
            particles.push({
                x: Math.random() * 2000, y: Math.random() * 900,
                r: Math.random() * 1.8 + 0.3,
                dx: (Math.random() - 0.5) * 0.4,
                dy: (Math.random() - 0.5) * 0.3,
                a: Math.random() * 0.6 + 0.1
            });
        }

        const drawParticles = () => {
            ctx.clearRect(0, 0, W, H);
            particles.forEach(p => {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(168,85,247,${p.a})`;
                ctx.fill();
                p.x += p.dx; p.y += p.dy;
                if (p.x < 0 || p.x > W) p.dx *= -1;
                if (p.y < 0 || p.y > H) p.dy *= -1;
            });
            // draw connecting lines
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx*dx + dy*dy);
                    if (dist < 140) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(168,85,247,${0.12 * (1 - dist/140)})`;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(drawParticles);
        };
        drawParticles();
    }

    // ── Glitch text hover ───────────────────────────────────────────
    document.querySelectorAll('.glitch-text').forEach(el => {
        el.addEventListener('mouseenter', () => el.classList.add('glitching'));
        el.addEventListener('mouseleave', () => el.classList.remove('glitching'));
    });

});

