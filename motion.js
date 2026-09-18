/* Native scrolling, progressive enhancement, and a user-controlled motion setting. */
(() => {
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const desktop = matchMedia('(min-width: 901px) and (pointer: fine)');
  const root = document.documentElement;
  const button = document.querySelector('.motion-toggle');
  const cover = document.querySelector('.home-hero');
  const running = new Set();
  const celestialCover = document.querySelector(".te-hero");
  let disabled = false;
  try { disabled = localStorage.getItem('sylvia-motion') === 'off'; } catch {}
  let frame = 0;
  let observer;
  const seen = new WeakSet();
  const enabled = () => !disabled && !preference.matches;
  function paint() {
    frame = 0;
    if (!enabled() || document.hidden) return;
    const celestialRect = celestialCover?.getBoundingClientRect();
    root.style.setProperty("--tg-drift", `${desktop.matches && celestialRect ? Math.max(-18, Math.min(18, -celestialRect.top * .035)) : 0}px`);
    const rect = cover.getBoundingClientRect();
    const offset = desktop.matches ? Math.min(Math.max(-rect.top, 0), rect.height) : 0;
    root.style.setProperty('--cover-drift', `${Math.min(offset * .15, 80)}px`);
    root.style.setProperty('--copy-drift', `${-Math.min(offset * .05, 28)}px`);
  }
  function schedule() {
    if (!frame && enabled() && !document.hidden) frame = requestAnimationFrame(paint);
  }
  function sync() {
    const on = enabled();
    root.classList.toggle('motion-off', !on);
    button.setAttribute('aria-pressed', String(on));
    button.textContent = preference.matches ? '动态效果：已随系统关闭' : `动态效果：${on ? '开' : '关'}`;
    button.disabled = preference.matches;
    if (!on) {
      cancelAnimationFrame(frame); frame = 0;
      root.style.setProperty('--cover-drift', '0px');
      root.style.setProperty('--copy-drift', '0px');
      root.style.setProperty('--tg-drift', '0px');
      running.forEach(animation => animation.cancel()); running.clear();
    }
    schedule();
  }
  button.addEventListener('click', () => {
    disabled = !disabled;
    try { localStorage.setItem('sylvia-motion', disabled ? 'off' : 'on'); } catch {}
    sync();
  });
  if ('IntersectionObserver' in window && Element.prototype.animate) {
    observer = new IntersectionObserver(entries => {
      entries.forEach(({target, isIntersecting}) => {
        if (!isIntersecting || seen.has(target)) return;
        seen.add(target); observer.unobserve(target);
        // Hash navigation and keyboard focus never wait for an entrance animation.
        if (!enabled() || target.contains(document.activeElement)) return;
        const animation = target.animate([
          {opacity: .35, transform: `translateY(${desktop.matches ? 18 : 0}px)`},
          {opacity: 1, transform: 'translateY(0)'}
        ], {duration: desktop.matches ? 620 : 300, easing: 'cubic-bezier(.22,.61,.36,1)'});
        running.add(animation);
        animation.onfinish = animation.oncancel = () => running.delete(animation);
      });
    }, {threshold: .08});
    document.querySelectorAll('.selected-heading, .profile-intro, .profile-details, .wf-hero, .wf-insight-copy, .wf-wide, .section-head, .wf-campaign figure, .wf-process-copy, .deck-cover, .process-evidence, .process-decisions article, .project-results, .te-intro, .te-feather>div, .te-phoenix>div, .te-film-heading, .vp-heading, .vp-intro').forEach(el => observer.observe(el));
  }
  window.addEventListener('scroll', schedule, {passive: true});
  window.addEventListener('resize', schedule, {passive: true});
  desktop.addEventListener('change', schedule);
  preference.addEventListener('change', sync);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { cancelAnimationFrame(frame); frame = 0; }
    else schedule();
  });
  document.addEventListener('focusin', () => { running.forEach(a => a.cancel()); });
  sync();
})();
