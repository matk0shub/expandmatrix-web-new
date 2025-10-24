# Partner logos

Place monochrome partner logos in this folder. Prefer SVG assets with transparent backgrounds so the liquid glass effect can shine through.

Keep colours neutral – aim for light to mid greys (`#d7dde7` to `#4a5363`). Bright or saturated colours will be desaturated in the UI, but starting with greys gives the cleanest result.

Once a logo is added, register it in `src/constants/partners.ts` with:
```ts
{
  kind: 'logo',
  src: '/images/partners/<file-name>.svg',
  alt: 'Company name'
}
```

Any slots left as `label` entries will render the minimal typographic placeholders inside the glass spheres.
