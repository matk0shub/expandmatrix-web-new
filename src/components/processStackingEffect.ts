'use client';

type GsapModule = typeof import('gsap');
type ScrollTriggerModule = typeof import('gsap/ScrollTrigger');

let gsapInstance: GsapModule['gsap'] | undefined;
let scrollTriggerInstance: ScrollTriggerModule['ScrollTrigger'] | undefined;
let hasLoaded = false;

async function loadGsapCore() {
  if (!hasLoaded) {
    const [{ gsap }, { ScrollTrigger }] = await Promise.all([
      import('gsap'),
      import('gsap/ScrollTrigger'),
    ]);

    gsapInstance = gsap;
    scrollTriggerInstance = ScrollTrigger;

    if (gsapInstance && scrollTriggerInstance) {
      gsapInstance.registerPlugin(scrollTriggerInstance);
    }

    hasLoaded = true;
  }

  return { gsap: gsapInstance, ScrollTrigger: scrollTriggerInstance };
}

type AnimationConfig = {
  stickDistance: number;
  duration: number;
  ease: string;
  scrub: number;
};

export type ProcessStackingOptions = {
  container: HTMLElement;
  cardRotations: readonly (string | number)[];
  cardOffsets: readonly string[];
  animation: AnimationConfig;
};

export async function initProcessStackingEffect({
  container,
  cardRotations,
  cardOffsets,
  animation,
}: ProcessStackingOptions) {
  const { gsap, ScrollTrigger } = await loadGsapCore();
  if (!gsap || !ScrollTrigger) {
    return () => {};
  }

  const ctx = gsap.context(() => {
    const cardWrappers = gsap.utils.toArray<HTMLElement>(
      container.querySelectorAll('.process-card-wrapper'),
    );

    if (cardWrappers.length === 0) {
      return;
    }

    const cards = cardWrappers
      .map((wrapper) => wrapper.querySelector<HTMLElement>('.process-card'))
      .filter((card): card is HTMLElement => Boolean(card));

    if (cards.length === 0) {
      return;
    }

    cards.forEach((card, idx) => {
      const rotationValue = cardRotations[idx];
      gsap.set(card, {
        opacity: 1,
        yPercent: 12,
        scale: 0.97,
        rotation:
          typeof rotationValue === 'string' ? parseFloat(rotationValue) || 0 : rotationValue ?? 0,
        x: cardOffsets[idx] ?? 0,
      });
    });

    const lastCardTrigger = ScrollTrigger.create({
      trigger: cardWrappers[cardWrappers.length - 1],
      start: 'bottom bottom',
    });

    cardWrappers.forEach((wrapper, index) => {
      const card = cards[index];
      if (!card) return;

      const rotationValue = cardRotations[index];
      const tween = gsap
        .to(card, {
          yPercent: 0,
          scale: 1,
          rotation:
            typeof rotationValue === 'string'
              ? parseFloat(rotationValue) || 0
              : rotationValue ?? 0,
          x: cardOffsets[index],
          duration: animation.duration,
          ease: animation.ease,
          overwrite: 'auto',
        })
        .pause();

      ScrollTrigger.create({
        id: `process-card-${index}`,
        trigger: wrapper,
        start: 'center center',
        end: () => (lastCardTrigger.start || 0) + animation.stickDistance,
        pin: true,
        pinSpacing: false,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        scrub: animation.scrub,
        animation: tween,
      });
    });

    ScrollTrigger.refresh();
  }, container);

  return () => {
    ctx.revert();
    const cards = container.querySelectorAll<HTMLElement>('.process-card');
    gsap.set(cards, { clearProps: 'transform,rotation,x,y' });
  };
}
