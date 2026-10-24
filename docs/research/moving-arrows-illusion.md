# Static shapes that appear to move: the "moving arrows" illusion

Research notes for the illusion described as: _"moving arrows that are really fixed, but colour animations at their edges make them look as if they are moving"_.

## TL;DR

The best match is the **Perpetual Diamond** (Flynn & Shapiro, 2018), which comes from the **reversed-phi / four-stroke** family. The shape, its body and its position never change. A **thin edge strip** and the **region just outside it** both flicker sinusoidally (2 Hz in the paper), but **90° out of phase**. Edges on the side the shape should move toward run a quarter cycle _ahead_ of the adjacent background. Edges on the opposite side run a quarter cycle _behind_. The result is continuous, unambiguous motion in one direction for as long as the animation runs.
([PMC full text](https://pmc.ncbi.nlm.nih.gov/articles/PMC8825246/))

The viral 2020 GIFs by **@jagarikin** ("these boxes aren't moving/rotating") use the same trick. In them, thin slivers along the edges and the background cycle through white, grey and black ([SoraNews24](https://soranews24.com/2020/02/25/brain-breaking-optical-illusion-from-japan-is-a-lie-within-a-lie-truly-amazing%e3%80%90video%e3%80%91/), [Boing Boing](https://boingboing.net/2020/03/03/these-boxes-arent-rotating.html)). The user is probably remembering one of these GIFs or a version with arrows. _Uncertain:_ I could not find the original arrow GIF. One forum comment notes that "the arrows just indicate the direction". Same mechanism.

**Why the current `ChevronArrow` fails:** it translates a _spatial_ gradient _inside_ the edge band. This is real motion of texture along the band (a marquee), so it gets read as shimmer or wobble along the contour. Nothing creates a _temporal phase lag across_ the contour, between the edge and what lies outside it. Also, the background is static, and the front and back edges are not given opposite phase relations.

---

## 1. Candidates, ranked by fit

| Rank | Illusion                                                                                                                                                                                   | Shape static?                                    | Fit                                                                          | Primary source                                                                                                                                                                                                                                                   |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------ | ---------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1    | **Perpetual Diamond**: edge strips + background in quadrature                                                                                                                              | Yes, fully. Body luminance is constant too       | Exact                                                                        | Flynn & Shapiro 2018, _i-Perception_ 9(6), doi:10.1177/2041669518815708 ([PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC8825246/))                                                                                                                               |
| 1b   | **Jagarikin GIFs** (boxes, cubes): same principle, popular form                                                                                                                            | Yes                                              | Exact (folk version)                                                         | [SoraNews24](https://soranews24.com/2020/02/25/brain-breaking-optical-illusion-from-japan-is-a-lie-within-a-lie-truly-amazing%e3%80%90video%e3%80%91/), artist: twitter.com/jagarikin                                                                            |
| 2    | **Gregory & Heard "phenomenal phenomena"**: grey rectangle with a thin light strip on one side and a thin dark strip on the other. Surround luminance ramps → rectangle appears to _shift_ | Yes                                              | Good, but motion is **back-and-forth**, not continuous                       | Gregory & Heard 1983, _QJEP-A_ 35:217; analysed in [Rogers, Anstis, Ashida & Kitaoka 2019](https://pmc.ncbi.nlm.nih.gov/articles/PMC6661801/)                                                                                                                    |
| 2b   | **Shapiro single-field contrast asynchronies** ("motion-illusion building blocks"): an edge modulates next to a static centre, or vice versa                                               | Yes                                              | Good building block. Motion is inward/outward                                | Shapiro, Charles & Shear-Heyman 2005, _J Vis_ 5:764; [Illusion of the Year 2005](https://illusionoftheyear.com/2005/08/motion-illusion-building-blocks/)                                                                                                         |
| 3    | **Four-stroke apparent motion**: small forward step, then a backward step _with contrast reversal_ → continuous forward motion                                                             | No. Jitters by a few arcmin and inverts contrast | Good effect, but the object visibly changes                                  | Anstis & Rogers 1986, _Perception_ 15:627 ([abstract via Europe PMC](https://europepmc.org/article/MED/3588223)); [Bach: Reverse Phi](https://michaelbach.de/ot/mot-reversePhi/); Mather & Murdoch 1999 ([abstract](https://europepmc.org/article/MED/10343871)) |
| 4    | **Motion without movement**: a static image is filtered with a quadrature pair whose phase rotates over time                                                                               | Yes                                              | Same idea, general image-processing form. Overkill for vector arrows         | Freeman, Adelson & Heeger 1991, SIGGRAPH ([PDF](https://www.cns.nyu.edu/heegerlab/content/publications/Freeman-siggraph1991.pdf))                                                                                                                                |
| –    | Peripheral drift / Rotating Snakes (Faubert & Herbert 1999; Kitaoka)                                                                                                                       | Static _image_, nothing animated                 | Poor. Needs no animation, and the motion comes from eye movements and blinks | [Bach: Rotating Snakes](https://michaelbach.de/ot/mot-snakes/)                                                                                                                                                                                                   |
| –    | Footsteps (Anstis)                                                                                                                                                                         | No. The object really moves                      | Poor                                                                         | [Bach: Stepping feet](https://michaelbach.de/ot/mot-feetLin/)                                                                                                                                                                                                    |

## 2. Mechanism

- **Reversed phi.** When an image is replaced by a slightly _displaced, contrast-reversed_ copy, motion is seen _opposite_ to the displacement. This only works for small shifts (< ~10 arcmin) ([Rogers et al. 2019](https://pmc.ncbi.nlm.nih.gov/articles/PMC6661801/)). Bach's explanation: motion detectors are sign-dependent. "Simultaneous inversion of contrast _and_ motion direction does not reverse _perceived_ motion direction" ([Bach](https://michaelbach.de/ot/mot-reversePhi/)).
- **Four-stroke** uses this to cancel the return jump: forward step (normal phi) → backward step with inversion (reversed phi, read as forward) → repeat. The visual system reports continuous forward motion, while feature tracking reports a forward-backward jump. That conflict is the "disconcerting" quality ([Bach](https://michaelbach.de/ot/mot-reversePhi/)). Anstis & Rogers attribute this to "spatial filtering by neural mechanisms, which shifts the effective position of the positive-negative contours" ([abstract](https://europepmc.org/article/MED/3588223)).
- **Spatial-smoothing account.** Low-pass filtering (receptive-field summation) of a thin light/dark strip next to a region whose luminance changes makes the _blurred_ contour's peak/zero-crossing physically shift over time. Every downstream motion, stereo or Vernier mechanism therefore "sees" displacement. The predicted shift grows with receptive-field size, which explains why the effect is **stronger in the periphery** and **dies when strips exceed the summation width** ([Rogers et al. 2019](https://pmc.ncbi.nlm.nih.gov/articles/PMC6661801/)).
- **Perpetual Diamond (first-order motion energy).** The edge strip and the adjacent background are two neighbouring positions modulating sinusoidally with a 90° phase difference. Space-time, this is a coarsely sampled _drifting_ sinusoid, so a standard Adelson–Bergen motion-energy model, with dark and light inputs weighted equally, predicts the direction. "The perceived motion … corresponds to motion energy available in the stimulus even though the edges and diamond remain in a fixed location" ([Flynn & Shapiro](https://pmc.ncbi.nlm.nih.gov/articles/PMC8825246/)).
- **Why the _shape_ moves.** Each edge produces its own local motion signal (each edge only needs to be in quadrature with _its own_ adjacent background patch; Movie 2 in the paper). The visual system then integrates the four local signals into one object-motion percept (citing Scarfe & Johnston 2011). Position cues say "stationary", so the percept is "moves yet stays in place" ([Flynn & Shapiro](https://pmc.ncbi.nlm.nih.gov/articles/PMC8825246/)).

**Direction rule** (derived from the paper's example; check with a quick prototype): motion goes **from the phase-leading region to the phase-lagging region**. In the paper, "the two top edges … modulate in quadrature phase ahead of the background and the two bottom edges … behind the background → the diamond appears to move continuously upward." Top edges: edge (inner) leads, background above lags → upward. Bottom edges: background below leads, edge lags → upward. ✔

## 3. Known stimulus parameters

**Perpetual Diamond** ([PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC8825246/)):

- Steady **mid-luminance** diamond. Background and edge strips modulate around it. Monitor linearised, **mean 50 cd/m²**.
- Modulation: **sinusoidal in time, 2 Hz**, luminance or colour.
- Phase: edges **±90°** relative to the adjacent background. Lead on the side facing the motion, lag on the opposite side. Absolute phase is irrelevant; only the edge-minus-background phase matters.
- Edge width: "very thin". Direction was detected above chance down to **3.6 arcsec**. Absolute amplitudes are **not given** in the text; Fig. 1 varies "modulation contrast".
- The background may be split into separate patches per edge, each modulated independently, and motion survives.
- Works equally well for any cardinal orientation.

**Gregory & Heard / reversed phi** ([Rogers et al. 2019](https://pmc.ncbi.nlm.nih.gov/articles/PMC6661801/)):

- Light strip on one side and dark strip on the other side of a constant mid-grey rectangle. The surround goes from iso-dark-strip to iso-light-strip luminance.
- G&H strip width **1.8 arcmin**. The effect **disappears at 10 arcmin**. Reversed phi is limited to < 10 arcmin. Stronger in **peripheral vision**.
- A smooth temporal **dissolve is much stronger than a hard cut**.

**Four-stroke** ([Bach](https://michaelbach.de/ot/mot-reversePhi/), [Kitaoka](https://www.psy.ritsumei.ac.jp/akitaoka/reversephi.html)):

- 4 frames: `P(x)`, `P(x+d)`, `N(x)`, `N(x+d)`, where `N` is the photographic negative. Bach's demo steps in multiples of 17 ms.
- Kitaoka's four-stroke GIFs use **80–100 ms/frame**. 300 ms/frame variants also exist.
- Anstis & Rogers did it as a continuous cycle: shift right, dim, shift back left, brighten ([abstract](https://europepmc.org/article/MED/3588223)).

## 4. Strong vs weak

| Factor             | Stronger                                                                            | Weaker / breaks                                                                                                                                            |
| ------------------ | ----------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Edge strip width   | Thin: ~1–3 arcmin. On a desktop at ~60 cm, 1 CSS px ≈ 1.5 arcmin, so use **1–4 px** | ≥ ~10 arcmin (≈ 6+ px): becomes surface flicker. _Secondary source:_ FAU work (Nichols) reports edge-motion turning into surface-motion as the band widens |
| Phase offset       | **90°** (quadrature)                                                                | 0° or 180° gives no direction, only flicker or bounce                                                                                                      |
| Temporal frequency | ~**2 Hz** per the paper. _Uncertain:_ a patent claims ~1–8 Hz works                 | Very slow: looks like fading. Very fast: flicker fusion                                                                                                    |
| Contrast           | Large modulation amplitude, centred on the body's grey                              | Low amplitude                                                                                                                                              |
| Viewing            | **Peripheral**, small shapes, many copies                                           | Foveal scrutiny of a large shape                                                                                                                           |
| Waveform           | Smooth sinusoid or a dissolve                                                       | Hard cuts work, but are weaker (shown for reversed phi)                                                                                                    |

Safety: this is full-field flicker. A 2 Hz sinusoid stays under the WCAG "three flashes per second" threshold. Add a flicker warning and a pause control anyway, as Bach does.

## 5. SVG/CSS recipe: Perpetual Arrow (recommended demo)

Layout per arrow (chevron pointing right, motion → right):

1. **Tile background** behind the arrow: modulates (`phase 0`). Faithful to the paper. _Variant (untested):_ instead of the whole tile, use a thin-to-medium **outer halo** stroke around the arrow that carries the background phase, with the page static. The paper only requires each edge to be in quadrature with its _adjacent_ region. However, the halo's own outer border against the static page creates an extra symmetric (breathing) signal, so make the halo several times wider than the edge strip, or feather it.
2. **Body**: static fill = the modulation's mean grey (`#808080`). Never animated.
3. **Front edge strip**: the two outer edges of the tip, whose outward normals point into the motion direction. An inset stroke 1–4 px wide, phase **+90°** (leads the background).
4. **Back edge strip**: the two edges of the notch, whose outward normals point against the motion. Phase **−90°** (lags the background).
5. Flat end caps (normals ⟂ motion): give them background phase (no signal) or keep them very short. _My suggestion, not from a source._

Generalisation for any outline: edge phase offset = `+90°` where `n̂·d̂ > 0` and `−90°` where `n̂·d̂ < 0`, with n̂ = outward normal and d̂ = desired direction. Swapping the two offsets reverses the direction with an _identical_ static frame, which makes a good control toggle.

Keyframes: an 8-sample sinusoid with linear interpolation (≈ smooth). Mean 50 % in sRGB code values, amplitude 45 %:

```css
@keyframes lum {
	0% {
		fill: #808080;
	}
	12.5% {
		fill: #d1d1d1;
	}
	25% {
		fill: #f2f2f2;
	}
	37.5% {
		fill: #d1d1d1;
	}
	50% {
		fill: #808080;
	}
	62.5% {
		fill: #2e2e2e;
	}
	75% {
		fill: #0d0d0d;
	}
	87.5% {
		fill: #2e2e2e;
	}
	100% {
		fill: #808080;
	}
}
/* T = 0.5 s → 2 Hz. Negative delay = phase lead. */
.bg,
.edge-front,
.edge-back {
	animation: lum var(--T, 0.5s) linear infinite;
}
.edge-front {
	animation-delay: calc(var(--T, 0.5s) * -0.25);
} /* +90°: leads bg */
.edge-back {
	animation-delay: calc(var(--T, 0.5s) * -0.75);
} /* −90°: lags bg  */
.body {
	fill: #808080;
}
```

(Use `stroke` instead of `fill` in the keyframes when the strips are drawn as strokes clipped to the inside of the polygon. Clip each stroke to the shape so only the inner half shows. Split the outline into two `<path>`s, front and back.)

Notes:

- Smooth interpolation is preferred. 4 hard steps per cycle still give a direction (it degenerates into a four-stroke-like sequence) but should be weaker, per the dissolve-vs-cut finding. _Uncertain magnitude._
- CSS interpolates in gamma-encoded sRGB, so the sinusoid is not linear in luminance. This is fine for a demo. Compute values in JS for a calibrated version.
- Colour works too, e.g. modulate along a hue axis at equal phase rules. The paper says "luminance (or color)". A luminance component makes it much stronger. _Expectation, not verified._
- Rows or grids of identical arrows sharing the same phases look like a marching column. Seen peripherally, the effect strengthens.

## 6. Recipes for alternative demos

**A. Phenomenal phenomena (oscillating, simplest).** Body: static `#808080`. One thin light strip (`#f2f2f2`) on the tip side, one thin dark strip (`#0d0d0d`) on the tail side, both static, 1–3 px. Animate only the background luminance sinusoidally between the dark and light strip values (~1–2 Hz). The arrow appears to slide back and forth while never moving ([Rogers et al. 2019, §G&H](https://pmc.ncbi.nlm.nih.gov/articles/PMC6661801/)). Good "step 1" before the perpetual version.

**B. Four-stroke arrow (continuous, but not strictly static).** Mid-grey background. The arrow is drawn as a positive pattern P (e.g. black outline + white inner line). Use `steps(1)` keyframes on a 4-frame loop, 80–100 ms per frame:

| frame | position | contrast                     |
| ----- | -------- | ---------------------------- |
| 1     | x        | P                            |
| 2     | x + d    | P                            |
| 3     | x        | N (inverted around the grey) |
| 4     | x + d    | N                            |

`d` small: 1–4 px (< 10 arcmin). Perceived as continuous motion toward +d ([Bach](https://michaelbach.de/ot/mot-reversePhi/); [Anstis & Rogers 1986](https://europepmc.org/article/MED/3588223)).

**C. Motion without movement (general images).** `I(t) = cos(ωt)·(G * I) + sin(ωt)·(H * I)`, where G and H are an oriented quadrature filter pair (even/odd). For a vector arrow, approximate it with two overlay layers: an even-symmetric edge profile (light line, dark flanks) and an odd-symmetric one (light on one side, dark on the other along d̂). Cross-fade them with `cos`/`sin` opacities on a mid-grey base ([Freeman, Adelson & Heeger 1991](https://www.cns.nyu.edu/heegerlab/content/publications/Freeman-siggraph1991.pdf)). _Formula from memory of the paper's method. The PDF was not read in full here._

## Not verified / open

- Absolute modulation amplitudes and the exact edge pixel widths used in the Perpetual Diamond movies.
- Shapiro 2005 direction rules beyond the one-line summary on the Illusion-of-the-Year page. The JOV full text was not accessible.
- The exact Jagarikin arrow GIF and its frame sequence.
