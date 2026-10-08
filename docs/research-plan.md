# Research and experiment plan: a local co-scientist model for a 128 GB M5 Max

Date of evidence: 2026-09-19. Revised the same day against the correction that a 12-week cook and a 27B student ceiling are 2018 planning. Every consequential claim carries a status tag: [E] established from a fetched primary source, [EE] engineering estimate with the arithmetic shown, [H] research hypothesis or single unreplicated paper, [U] unverified or tertiary. Claims that an independent verifier corrected are marked [V]. Section 13 lists the sources.

## 1. Verdict

The Mac is the deploy seat. The student is the largest open-weight model that fine-tunes under a clean license and still fits 128 GB after quantization. Training is rented GPUs or Tinker. LoRA at Open Character Training scale (about 14 million tokens) is minutes of math on an 8x H100-class node and a few hours wall-clock including self-distillation. That is a weekend, not a quarter [EE, E].

Qwen3.8-27B is the Apache 2.0 companion, not the student. It scores 34 on Artificial Analysis Intelligence Index v4.3. The bigger Qwen 3.8 open-weight that fits this machine is Qwen3.8-Flash-Next: 125B backbone, 6B active, 51B n-gram table, 4B MTP, 180B on disk, index 40, Qwen Community License 1.0. Fine-tuning is granted. Internal use is granted when outputs and capabilities are not made available to third parties. Axolotl ships a QLoRA example (`examples/qwen3.8-flash-next/qlora.yaml`): `quantize_moe_experts: true` because fused 3D expert tensors are not visible to stock bitsandbytes, and `ple_cpu_offload: true` because the 51.2B n-gram table is 95.4 GiB and stays in host RAM. About 120 GiB GPU with offload on one B300, about 216 GiB without. Hugging Face lists 51 fine-tunes of this checkpoint. Unsloth 4-bit GGUF is 96 to 114 GB. UD-IQ4_XS is 93.7 GB at 89.6 percent top-1 agreement with bf16 [E].

The MIT alternative is GLM-5.3-Flash: 320B total, 18B active, index 42, 17 fine-tunes. Unquantized it is the stronger fitting open model. 4-bit does not fit (162 to 210 GB). Unsloth 3-bit UD-IQ3_XXS is 120 GB at 82 percent top-1; 2-bit UD-Q2_K_XL is 109 GB at 78 percent. That is a real quality tax at the bits this chassis can hold. Use GLM-5.3-Flash if MIT and two index points beat that tax; otherwise Flash-Next is the default student [E].

Frontier-level general intelligence in 128 GB is still not supported. The frontier ceiling on the same index is 53 (Claude Fable 5.1 and GPT-6 Astra at maximum effort). The best open-weight model of any size scores 45 and needs about 420 GB. Openness still costs index points. What the earlier draft got wrong was the landing zone: a trained 27B was projected at 36 to 39, and Flash-Next was treated as an untrained probe with no training path. The student is already 40 or 42. Distilling a 42 teacher into a 27B student is a downgrade. Train the bigger model. Disposition work (character training, anti-sycophancy preference) is LoRA on that student, not a reason to shrink it [E, EE].

Qwen3.8-2.4T-A95B scores 40, the same as Flash-Next, and does not fit: the smallest published Unsloth quant is 397 GB. There is no official Qwen 3.8 size between 27B and Flash-Next, and no public 3.8 Base [E].

The binding constraint for a powered scientific claim is still measurement. No candidate model card reports a sycophancy, premise-critique, diversity, or calibration number. LLM judges are unsafe as first gates for research quality. The cook does not wait on a 1,210-item private battery. Public screens plus owner sessions ship the first adapter. The private battery is built after the first ship if the owner wants powered claims.

Recommended path: Qwen3.8-Flash-Next as the student, Axolotl QLoRA on a rented B300 or 8x H200 this weekend, Unsloth 3-bit or 4-bit GGUF on the Mac; GLM-5.3-Flash as the MIT bake-off if 2-bit or 3-bit quality holds on a 200-item smoke; Qwen3.8-27B as the Apache-clean Tinker and Unsloth notebook path. mlx-lm PR 1788 (qwen4_exp) is still open. Deploy Flash-Next through llama.cpp or Unsloth Desktop GGUF, or mlx-vlm which already merged qwen4_exp [E].

## 2. Deployment target

### 2.1 Verified configuration

- Apple M5 Max exists. Announced 2026-03-03 in the MacBook Pro 14 and 16 (available 2026-03-11). Mac Studio with M5 Max announced 2026-08-25, general availability 2026-09-22, three days after the evidence date, so no independent Mac Studio review exists [E].
- 128 GB unified memory is offered only with the 18-core CPU, 40-core GPU part, which is also the only M5 Max tier at 614 GB/s. The 32-core GPU tier is 460 GB/s and is not offered with 128 GB. 128 GB is the M5 Max ceiling; M5 Ultra offers 96, 256, or 512 GB at 1.2 TB/s [E].
- Every GPU core has a Neural Accelerator. MLX needs macOS 26.2 or later to use it. Apple's own reproducible measurement on the base M5 shows time to first token 3.33x to 4.06x faster than M4 and decode only 1.19x to 1.27x faster [E]. The deployment OS will be macOS 27, reported released on 2026-09-14 by a secondary source [U].
- Thermals: a 14-inch MacBook Pro M5 Max lost 24 percent of sustained multi-core performance over 30 minutes, and a macOS point update cut sustained GPU retention in Automatic mode from 98.5 to 87.3 percent on the 16-inch. Every throughput number in this plan must record chassis, macOS build, and power mode [E].

### 2.2 Memory budget

- Sources conflict on the default GPU working set. Older community guidance says about 75 percent (96 GiB on 128 GB). Two independent 128 GB machines (an M4 Max and an M5 Max) with the sysctl unset report about 107 GiB (84 percent), and the fraction scales with installed memory [V]. Apple does not document the value.
- The limit is raised with `sudo sysctl iogpu.wired_limit_mb`, commonly to 112 to 120 GiB; it resets on reboot. Metal's maximum single allocation on a 128 GB machine is reported as 80.64 GiB [V, community measurement].
- Provisional budget until measured: 96 GiB by default, 108 to 112 GiB raised, for weights plus KV plus runtime. Measuring `recommendedMaxWorkingSetSize` is the first task on the machine.

### 2.3 Speed model and measurements

- Decode is memory-bandwidth bound: tokens per second is about 0.75 to 0.85 times 614 GB/s divided by bytes read per token for dense models at short context. The official llama.cpp Apple thread measured a 7B model on an M5 Max 128 GB at 119.9 t/s (Q4_0), 72.4 t/s (Q8_0), and 37.1 t/s (F16), which is 75 to 85 percent of the roofline. Prefill (F16, 512 tokens) was 3,158 t/s, 3.4x the M4 Max figure [E]. llama.cpp reached the Neural Accelerators only on 2026-09-01, so earlier M5 prefill numbers understate it [E]. Large mixture-of-experts builds realize less: the one measured 128 GB build (DeepSeek V4-Flash mixed 2/3/8-bit at about 53 t/s) implies about 46 percent of the roofline [EE]. Decode also falls with context: a community series shows a dense 27B at 6-bit dropping from 23.6 t/s at 4K to 14.9 t/s at 32K [U].
- Long prompts are slow: about 449 t/s at a 102K-token prompt on M5 Max, about 3.8 minutes to first token [U]. Prompt caching in mlx-lm and llama.cpp removes this for repeated context, but community reports say llama.cpp slot restore forces a full re-prefill on hybrid Gated DeltaNet models; this is unmeasured on MLX and must be tested [U].
- Speculative decoding is lossless and available. Qwen3.8 models ship multi-token-prediction heads. Unsloth reports Flash-Next MTP at 1.3x to 1.7x on GPU (170 t/s vs 100 t/s on one RTX 6000 PRO). Gains are smaller on lower-bandwidth devices, including older Macs [E].
- Flash-Next's n-gram table is random-access and is kept at 4-bit in Unsloth's 1-bit GGUFs. Unsloth states RAM or unified-memory inference is closer to VRAM performance for this architecture than for typical MoEs, which is why a 75 GB 1-bit build is advertised for Macs [E].

### 2.4 Runtimes and quantization

- MLX core 0.32.2, mlx-lm 0.31.3 (2026-04-22), llama.cpp b11046, Ollama 0.34.2 with an MLX backend, LM Studio 0.4.25, and vllm-metal are current. mlx-lm has modules for the qwen3_5 architecture (Qwen3.8-27B). It has no merged module for Qwen3.8-Flash-Next (qwen4_exp); PR 1788 is open, labeled await verification, last activity 2026-09-16. mlx-vlm merged qwen4_exp. Official Flash-Next docs point Apple Silicon users at mlx-vlm. Deploy the student through llama.cpp or Unsloth Desktop GGUF until mlx-lm merges [E].
- MLX affine quantization costs (bits + 32/group_size)/8 bytes per parameter: 0.5625 bytes at 4-bit, 0.8125 at 6-bit, 1.0625 at 8-bit, which predicts on-disk sizes within 0.3 percent [E].
- Unsloth Dynamic GGUF top-1 agreement is the quality table for the big students (section 2.5). Apple's M4 Max table on a 30B MoE still applies to the 27B companion: MMLU-Pro 72.62 (bf16), 72.46 (8-bit), 71.97 (5-bit), 70.71 (4-bit) [E].
- 4-bit KV cache quantization is destructive on MLX; 8-bit is usually acceptable but disables batching in the mlx-lm server [E].
- Quantization changes behavior, not only accuracy. Quantized reasoning models produce longer chains of thought, oversample "wait", "but", and "alternatively", and in up to 52 percent of failures reach the right answer without emitting it; 2-bit builds show repetition loops and delayed commitment [E]. The final deployed configuration must be evaluated at item level.

### 2.5 Deployment configurations

| Configuration | Weights | KV at 64K | Fit on 128 GB | Quality vs bf16 | Notes |
|---|---|---|---|---|---|
| A (default): Qwen3.8-Flash-Next UD-IQ4_XS | 93.7 GB | n-gram table already in the weight file; attention KV is sparse QSA, unmeasured on this chassis [U] | yes, with headroom | 89.6 percent top-1 [E] | Default ship. Internal-use Community 1.0 |
| B: Qwen3.8-Flash-Next UD-Q4_K_XL | 111.3 GB | tight | yes if sysctl raised and KV stays small | 92.3 percent top-1 [E] | Use if A loses item-level open-ended quality |
| C: Qwen3.8-Flash-Next UD-Q3_K_XL | 90.0 GB | yes | yes | 88.3 percent top-1 [E] | Speed and headroom option |
| D: GLM-5.3-Flash UD-Q2_K_XL | 108.7 GB | tight | yes | 78.3 percent top-1 [E] | MIT. Quality tax |
| E: GLM-5.3-Flash UD-IQ3_XXS | 120.4 GB | almost none | Unsloth demo on 128 GB devices [E] | 81.6 percent top-1 [E] | Only if D fails and 64K KV is not required |
| F: Qwen3.8-27B Q8_0 | 29 GB | about 4 GB at 64K [EE] | yes, lots of spare | 8-bit, near bf16 on MMLU-Pro [E] | Apache companion. Tinker and Unsloth 24 GB QLoRA |

"Relatively small" is retired as a student-size rule. The deploy rule is: resident weights plus KV fit the raised working set with enough spare that 40 long generations do not loop or OOM. Training size is independent of that rule.

## 3. Candidate models

### 3.1 Identities and licenses

- Qwen3.8 open weights are three post-trained checkpoints plus FP8 siblings. No public 3.8 Base. No official size between 27B and Flash-Next [E].
- Qwen/Qwen3.8-27B: Apache 2.0, dense 27.78B, hybrid Gated DeltaNet plus gated attention, 262,144 native context, vision-language, reasoning effort xhigh, medium, low. Released 2026-08-14 [E].
- Qwen/Qwen3.8-Flash-Next: Qwen Community License 1.0. Fine-tune, derivatives, and internal use are granted. A separate commercial license is required for Model-as-a-Service or AI Work Assistant businesses; that requirement does not apply to internal use that does not make the software, its outputs, or its capabilities available to a third party. Name display above 100 million monthly active users or USD 20 million monthly revenue [E].
- Qwen/Qwen3.8-2.4T-A95B: custom Qwen3.8-Max license, 2.4T, 95B active, does not fit [E].
- zai-org/GLM-5.3-Flash: MIT, 320B, 18B active, 1M native context, multimodal. Released 2026-08-26 [E].

### 3.2 Ranked shortlist

| Rank | Model | Total / active | AA v4.3 | License | Train today | Deploy on 128 GB | Role |
|---|---|---|---|---|---|---|---|
| 1 | Qwen3.8-Flash-Next | 180B disk, 6B active | 40 | Community 1.0, internal OK | Axolotl QLoRA on NVIDIA (`examples/qwen3.8-flash-next/qlora.yaml`, expert quantization plus PLE offload). Official README also names Unsloth, Swift, Llama-Factory. Not on Tinker. No merged mlx-lm LoRA. 51 HF fine-tunes [E] | 3-bit 90 GB or 4-bit 94 to 111 GB | Default student |
| 2 | GLM-5.3-Flash | 320B, 18B active | 42 | MIT | 17 HF fine-tunes, including a published expert `down_proj` LoRA. Unsloth run docs; no Tinker row for Flash (Tinker lists GLM-5.3 753B-A40B instead). Axolotl kernel list stops at GLM 5.2 [E] | 2-bit 109 GB or 3-bit 120 GB, quality tax | MIT student if D or E pass item-level smoke |
| 3 | Qwen3.8-27B | 27.78B dense | 34 | Apache 2.0 | Unsloth QLoRA 24 GB, Axolotl, Llama-Factory, Tinker [E] | 8-bit 29 GB, bf16 56 GB | Apache companion, Tinker path |
| 4 | DeepSeek V4-Flash-0731 | 284B, 13B active | 35 | MIT | Axolotl NVFP4 LoRA (ScatterMoE). Not on Tinker. Unsloth page is run-local [E] | 3-bit 104 GB or mixed 2/3/8 about 98 GB resident; 4-bit 137 to 155 GB does not fit [E] | MIT backup if Flash-Next Axolotl breaks; only one index point above 27B |
| 5 | Qwen3.5-122B-A10B | 122B, 10B active | 16 | Apache 2.0 | Unsloth Qwen3.5 fine-tune guide; Llama-Factory listed [E] | 4-bit about 69 GB | Apache bigger fallback only if Community license binds; 18 index points behind 27B |
| 6 | GLM-5.3 (full) | 753B, 40B active | 45 | GLM-5.3 License, not MIT | Tinker LoRA, train USD 14.58 per million tokens at 256K [E] | 3-bit about 329 GB, does not fit [EE] | Tinker experiment, not a Mac student |
| 7 | Qwen3.6-35B-A3B | 35B, 3B active | about 19 | Apache 2.0 | Tinker [E] | 4-bit 20 GB | Drafter or fast companion |
| 8 | Qwen3.8-2.4T-A95B | 2.4T, 95B active | 40 | Qwen3.8-Max | Llama-Factory listed; no Axolotl example [E] | smallest published quant 397 GB | Does not fit |

Index scores are not comparable across Artificial Analysis versions. Every reference is pinned to v4.3.

Tinker, fetched 2026-09-19, also lists Nemotron-3-Super-120B-A12B (train USD 1.276 per million at the 50 percent discount), GPT-OSS-120B (USD 0.737), Qwen3.5-397B-A17B (USD 6.60), Kimi-K2.6, and Inkling. None of those beat Flash-Next on the v4.3 numbers already in this plan, and 397B does not deploy on 128 GB. They are Tinker backups, not the student [E].

## 4. The intelligence target

### 4.1 Named references, 2026-09-19

Frontier set: Claude Fable 5.1 and Claude Mythos 5.1 (September 2026), Claude Opus 5 (2026-07-24), GPT-6 Astra (system card 2026-09-03), Gemini 3.8 Flash (2026-09-02), Grok 4.6 (August 2026), Muse Spark 1.3 [E]. Epoch Capabilities Index leader: GPT-6 Astra at 166. LMArena text leader: claude-fable-5-high at 1506; best open-weight entry GLM-5.3-max at 1483, which does not fit [E].

The owner names GPT-6 Astra and Claude Fable as poor examples for the disposition target. This plan uses them as the capability reference only. They are never the disposition gold standard and never a training-data source; their terms forbid using outputs for training and enforcement is active (section 5.4).

### 4.2 Axes, conditions, and gaps

| Axis | Frontier reference | Best fitting open student | Gap | Note |
|---|---|---|---|---|
| Composite (AA v4.3) | 53, Fable 5.1 and GPT-6 Astra, max effort | 40 Flash-Next; 42 GLM-5.3-Flash; 34 Qwen3.8-27B | 13, 11, or 19 | The student already is 40 or 42. Do not distill down to 27B to "reach" 36 to 39 |
| Humanity's Last Exam (vendor, GPT-4o judge) | 40.0 Claude Opus 4.6 Max | 35.9 Flash-Next; 30.8 Qwen3.8-27B | about 4 to 9 vendor points | Independent AA HLE is cited from the index, not reproduced |
| GPQA Diamond (vendor) | 91.3 Opus 4.6 Max | 91.7 Flash-Next; 89.2 Qwen3.8-27B | saturated | Not a reason to pick 27B |
| Human preference (LMArena text) | 1506 | no fitting model in the top 20 | unmeasured for the shortlist | |
| Agentic long-horizon | Fable 5.1 Terminal-Bench 4.0 55.8 (vendor) | GLM-5.3-Flash Terminal-Bench 2.1 84.3 (vendor, different version); Flash-Next CoWorkBench 73.9 (vendor) | versions are not comparable | Out of scope unless the owner asks |
| ARC-AGI-2, FrontierMath, CritPt | frontier numbers exist | none published for these students | unmeasurable | |

General intelligence and disposition are evaluated separately (section 8). Gains from tools, retrieval, extra inference compute, or multi-model orchestration are reported on separate lines from model-only scores at a pinned effort level.

## 5. The disposition target

### 5.1 What the evidence supports

- Post-training narrows output diversity in measured stages: Tulu-3 70B semantic diversity on a poem task fell from 45.4 percent (base) to 20.8 (SFT) to 10.8 (DPO), with the cause fitted to typicality bias in preference data (alpha 0.57 to 0.65, p below 1e-14) [E, preprint]. Co-writing with the feedback-tuned InstructGPT reduced content diversity while the base GPT-3 did not [E]. Across 70 or more models, open-ended outputs are homogeneous within and across models, and reward models are least calibrated where human preferences are idiosyncratic [E]. Alignment cuts the Creativity Index about 30 percent [E].
- Sycophancy is rewarded by preference data, grows with conversation length, and survives reasoning training. At turn 25 of sustained pushback, false-presupposition collapse reaches 58 to 92 percent across models, and the correct position is still in the reasoning trace in 62 to 83 percent of collapses. Thinking variants collapse at nearly the same rate as instruct variants [E].
- Pre-execution novelty ratings overstate LLM ideas: rated more novel than expert ideas before execution, they dropped significantly more on every metric after 43 experts each spent over 100 hours executing them, and the advantage disappeared [E, V].
- Prompting recovers a large share of diversity (Verbalized Sampling retains 66.8 percent of base diversity versus 23.8 for direct prompting), and third-person reframing cuts sycophancy up to 63.8 percent in debate settings, though every model still flips under extended pressure [E].

### 5.2 What the brief assumes without evidence

- No fetched source measures elegance, simplicity, or solution conservatism in RL-tuned coding or reasoning models. The plan restates it into constructs with instruments and treats an elegance instrument as a research hypothesis (section 8.4).
- Whether orchestration supplies most of the apparent AI-scientist capability is contested. The plan reports orchestration gains separately.
- Whether diversity recovered by prompting transfers to better scientific ideation is untested; the measurements are on poems, stories, jokes, and alternative-uses tasks [E].

### 5.3 Operational constructs

The disposition target is six measurable constructs. Each has a positive form and a two-sided failure mode, so reflexive contrarianism fails as surely as capitulation.

1. Proactive premise critique on underspecified premises, without false critique of sound premises.
2. Explore-versus-believe separation: a proposition can be rated worth pursuing while being rated not yet worth believing, and the gap must track later outcomes. This includes the premature-dismissal rate on immature ideas whose later outcome was favorable.
3. Refutation handling: concede valid refutations, hold against refutations whose assumptions do not apply, and say which.
4. Sustained inquiry: keep developing an uncertain idea over 12 to 25 turns under pressure without capitulating or entrenching.
5. Conceptual flexibility: produce distinct framings on repeated sampling, measured with length control.
6. Calibration: expressed confidence tracks correctness, with abstention counted.

"Sycophancy" is not a single construct; expert single-rater reliability is 0.184 and two leading benchmarks rank models in opposite order [E]. The plan names the behaviors above instead of the word.

### 5.4 Data and license constraints

- Frontier API outputs cannot be training data. OpenAI terms (effective 2026-01-01), Anthropic Commercial Terms D.4 (2025-06-17), Gemini API terms (2026-04-28), and the SpaceXAI acceptable use policy (2026-08-14, names distillation) all forbid it. Anthropic's 2026-02-23 report documents about 24,000 accounts and 16.5 million exchanges attributed to distillation attacks [E].
- Clean teachers (Apache 2.0 or MIT with no output clause): the Qwen3.5 family, Qwen3.8-27B, DeepSeek V3.x to V4.x, GLM-4.5 through GLM-5.3-Flash, gpt-oss, Olmo, Seed-OSS, Mistral Large 3, Muse Glimmer. Conditional but usable for an internal research project: GLM-5.3, Kimi K2 and K3, Qwen Community License models. Not teachers: Gemma (distillation creates a bound Model Derivative), Llama 4 (naming duty), Hunyuan, MiniMax-M3 [E].
- The intended transfer for character training is self-distillation: the student writes chosen responses with the constitution in context and rejected responses without it. No foreign teacher is required for that rung. Real corpus text is mixed in.
- Clean post-training corpora: Dolci-Think-SFT (ODC-BY, 2.25M examples, DeepSeek R1 traces), OpenThoughts3-1.2M (Apache 2.0), Nemotron post-training sets (CC BY 4.0), SciRIFF (ODC-BY). Tainted: Tulu 3 SFT mixture and Dolci-Instruct-SFT contain GPT-4-class outputs [E].
- No dataset of scientific idea-development dialogue exists at any scale [E]. Nearest substitutes remain ARIES, OpenReview, ReviewCritique, DEFEND, eLife, F1000, Si et al., MOOSE-Chem, ResearchBench, AI Idea Bench 2025, Rust RFC and PEP threads, DARPA SCORE, Retraction Watch via Crossref. Stack Exchange dumps after April 2024 forbid LLM training [E].
- Source partition: review corpora that feed both training and evaluation are split at the document level by venue and year before either use.

## 6. New capability versus changed expression

| Goal component | Needs | Evidence | Lever |
|---|---|---|---|
| Factual recall, long-tail knowledge | New capability; scales with total parameters | Removing the bottom 25 percent of experts costs more than 10 percent; continued pretraining at useful scale is not a weekend [E, EE] | Retrieval, reported as a tool gain |
| Hard research reasoning (HLE class) | Mostly already in the student | Flash-Next vendor HLE 35.9 versus 27B 30.8 versus Opus 4.6 Max 40.0 [E] | Use the bigger student. Do not distill down |
| Agentic long-horizon work | New capability plus scaffold | 30 percent of the AA index is tool-equipped multi-step work [E] | Out of scope unless the owner asks |
| Scientific coding | Trainable capability | ether0: RL on a 24B beat frontier models on molecular design with no domain pretraining [E] | Optional second-weekend RLVR, not the first cook |
| Premise critique, refutation handling, position under pressure | Expression, mostly | Correct position present in the trace in 62 to 83 percent of collapses [E] | Weekend character training on the big student |
| Diversity of framings | Expression | 66.8 percent of base diversity recoverable by prompting [E] | Sampling, then DivPO-style preference if prompting is not enough |
| Explore-versus-believe separation | Unknown; no instrument | Only the Si et al. corpus carries within-dataset ground truth [E] | Build the instrument after the first ship |
| Elegance and simplicity of solutions | Unknown; no instrument | No prior art [E] | Narrow proxy, not a cook gate |

## 7. Interventions compared

Ranked by expected information per dollar. "Changes" states whether the rung is expected to change capability, disposition, or both.

| Rank | Intervention | Changes | Best evidence | Marginal cost |
|---|---|---|---|---|
| 0 | Unmodified Flash-Next (and GLM-5.3-Flash) at vendor defaults, at the shipped quant | neither; required control | No candidate card reports a disposition metric [U] | evaluation only |
| 1 | Decoding and effort: temperature, min-p, reasoning effort | expression of both | min-p improves quality and diversity together; effort moves a frontier model 6 to 7 index points [E] | zero |
| 2 | Constitution system prompt plus inquiry protocol | disposition | Third-person reframing cuts sycophancy up to 63.8 percent [E] | zero |
| 3 | Weekend LoRA character training on the student: about 6M DPO plus 8M introspection, rank 64 on MLP and MoE, learning rate about 10x full FT, placebo-constitution arm | disposition | Open Character Training; LoRA matches FullFT on post-training scale when applied to MLP/MoE [E] | hours on one node, about USD 40 to 400 |
| 4 | Inference-time methods on the Mac: verbalized sampling, best-of-N, second-family critic | expression | Verbalized Sampling 1.6 to 2.1x diversity [E] | 4x to 32x tokens, reported separately |
| 5 | Second-weekend multi-turn preference against a fine-tuned 8B simulator | disposition, multi-turn | TurnWise, CollabLLM; prompted role-play simulators did not transfer [E] | under USD 500 |
| 6 | Domain RLVR on scientific coding, shuffled-reward control | capability on the trained axis | ether0; LoRA matches FullFT for RL even at rank 1 [E] | hours to a couple of days on a node at a 10k-prompt envelope; not 10B rollout tokens |
| 7 | Activation steering | disposition | Less robust than character training; unmeasured under quantization [E] | skip unless LoRA fails |
| 8 | Deploy GLM-5.3-Flash at 2-bit or 3-bit untrained | capability up, open-ended generation down | Unsloth top-1 78 to 82 percent [E] | one afternoon of downloads |
| 9 | Distill GLM-5.3-Flash into Qwen3.8-27B | capability down relative to training Flash-Next | Teacher is 42, student would be 27B [E] | rejected as the capability path |
| 10 | Continued pretraining on a science corpus | capability, at a disposition cost | 100B tokens on a 27B is about 13,400 H100-hours [EE] | rejected |
| 11 | Multi-agent debate with copies of the local model | neither reliably | Often fails to beat chain of thought [E] | rejected |

## 8. Evaluation system

The cook does not wait on this section. Public screens and 25 owner sessions are the weekend gates. The private battery and powered human panel are how you later tell a real disposition gain from its appearance.

### 8.1 Capability battery

Run at a pinned effort level with three seeds, on a hosted bf16 or FP8 reference and on the shipped GGUF. Public, objectively scored, contamination-controlled: LiveBench, LiveCodeBench (date-split), SciCode (288 subproblems, pass@1, no tools), ResearchCodeBench, Humanity's Last Exam text subset with RMS calibration error, SimpleQA three-way grading as the abstention proxy, LongBench v2 at 100K, IFBench, MultiChallenge, MMLU-Pro. Frontier numbers are cited under recorded conditions, never reproduced in house.

Weekend smoke uses a subset: SciCode, HLE text, GPQA Diamond, IFBench, and 40 long generations for loops. Full sweeps run on hosted open-weight inference (about USD 120 per sweep at USD 3 per million output tokens). The Mac runs throughput measurement and the shipped-quant item-level check.

### 8.2 Disposition battery

Public screens, adopted as is, are the weekend set: PCBench, RPCBench, REFUTE, MUSE, SPINE, SYCON Bench, ELEPHANT, AskBench, NoveltyBench, Infinity-Chat, LiveIdeaBench, SoundnessBench.

Private battery, 1,210 items plus 60 sessions, 60 percent development and 40 percent held out, is built after the first ship if the owner wants powered claims. Item recipe is unchanged from the prior draft (assumption-flip, valid/invalid refutation, explore vs believe, outcome-grounded time split, performed-curiosity, premature-dismissal, sustained inquiry). Every item carries a canary string, a date stamp, and a rephrased twin. Nothing from the held-out set enters a training loop or a judge prompt used as reward.

### 8.3 Discriminators

| Failure mode | Control |
|---|---|
| Hallucination | SimpleQA incorrect rate and HLE calibration error must not worsen by more than 2 points; abstention counted |
| Sycophancy | MUSE zero-entropy flip rate, SPINE collapse at turn 25, pushback-conditioned slice |
| Reflexive contrarianism | False-critique rate on constraint-holds items; ReCrit Boundary and Correction both reported |
| Superficial novelty | Outcome-grounded arm; a pre-execution ranking that reverses against outcomes fails |
| Verbosity | Per-item output tokens capped at 1.25x the baseline median; a gain that does not survive length control counts as zero |
| Persuasive presentation | Style-stripped re-judging must preserve at least 70 percent of any gain |
| Over-asking | Clarification redundancy below 0.15 |
| Quantization damage | Item-level flip analysis against the hosted bf16 or FP8 reference; 40 long generations for loops |

### 8.4 Elegance proxy (research hypothesis)

No instrument exists. A narrow proxy can be built later: 80 problems that admit both a short general solution and a longer special-cased one. Not a cook gate.

### 8.5 Judge protocol and human panel

- Two open-weight judge families, neither related to any teacher and never the model under test. The published versions of SPINE, ELEPHANT, and PCBench used frontier judges; this plan re-runs them with open judges. No judge output becomes a training reward [E].
- Judges are calibrated against 150 already-labeled pairs from PCBench and ReviewCritique before they gate a powered claim. That calibration is a few hours and a few hundred dollars, not a four-week instrument stage [E].
- Owner arm: 25 blind paired sessions on real problems. 7 of 10 against chance is p = 0.17 one-sided and decides nothing; 18 of 25 is the powered line.
- Human panel and 8-week idea execution remain the way to tell pre-execution ratings from outcomes. They run after the adapter ships, not before the cook.

### 8.6 Statistics

Three seeds and confidence intervals on every reported number. Paired items use McNemar. The disposition composite has no defined zero until the unmodified student is measured; weekend gates are relative to that baseline at the shipped quant.

### 8.7 Deployed-configuration re-test

The ship gate runs on the Mac at the shipped GGUF: item-level flip analysis against the hosted reference on open-ended items, 40 long-generation runs, throughput with chassis, macOS build, and power mode. Iteration sweeps stay on hosted inference.

## 9. Cook sequence

The cook is a weekend. Evaluation instruments run in parallel and do not gate Friday night. Thresholds are provisional, pre-registered before the run, and measured length-controlled against the unmodified student at the same quant and effort.

### Friday

- Freeze the student: Qwen3.8-Flash-Next unless the owner picks GLM-5.3-Flash for MIT. Write the constitution.
- Generate on-policy pairs: student with constitution in context writes chosen, student without it writes rejected. Mix real corpus text into the introspection set. Hosted sampling of the student, not a frontier teacher.
- Placebo constitution is a second adapter, same data budget, same night if the node is up.
- Smoke-load configuration A (Flash-Next UD-IQ4_XS) on the Mac. Record working set, decode at 4K and 32K, one 30-minute thermal soak. If A OOMs or loops, drop to C. If the owner picked GLM, smoke D then E.

Gate 0 (same day): the GGUF loads, produces coherent English, and does not loop in 40 generations. If it fails, the student is still trainable; the ship quant changes.

### Saturday

- Axolotl QLoRA on Flash-Next, starting from `examples/qwen3.8-flash-next/qlora.yaml`: 4-bit load, `quantize_moe_experts: true`, `ple_cpu_offload: true`, LoRA on linear attention, shared expert, q/k/v/o, and the fused expert `gate_up_proj` / `down_proj` via `lora_target_parameters`. The example uses rank 16 and learning rate 2e-4. Open Character Training used rank 64 on models under 10B; do not invent a different recipe until this example runs [E].
- About 6M DPO tokens plus 8M introspection SFT tokens, one epoch [E]. If GLM-5.3-Flash is the student, use published expert `down_proj` LoRA as the existence proof and budget 4 to 8x H200, because Axolotl's special kernels stop at GLM 5.2 [E]. If the student is 27B, Tinker or Unsloth 24 GB QLoRA.
- Merge adapters. Export GGUF at A and B (or D and E). Drop on the Mac.

Arithmetic for the weight update, LoRA FLOPs about `4 * N_active * T`, T = 14e6, 35 percent MFU, 989.5 TFLOP/s per H100 [EE]:

| Student | N_active | 1x H100 math | 8x H100 math |
|---|---|---|---|
| Qwen3.8-Flash-Next | 6B | 0.27 h | 2 min |
| GLM-5.3-Flash | 18B | 0.81 h | 6 min |
| Qwen3.8-27B | 27B | 1.2 h | 9 min |

Wall-clock including load, compile, and self-distill generation is about 2 to 8 hours on an 8x H200, about USD 70 to 290 at USD 36 per node-hour. First-time 320B expert-parallel bring-up can burn a weekend on plumbing. Flash-Next Axolotl QLoRA is the path that already has an example file [EE, E].

Gate E (Sunday morning): real-constitution adapter beats placebo and beats the unmodified student on the public disposition screens, length-controlled; capability smoke within 1.5 points of the unmodified student across three seeds; zero-entropy flip rate no worse; false-refutation rate up by no more than 5 points.

### Sunday

- Disposition smoke: PCBench, SPINE subset, MUSE, 25 owner sessions.
- Capability smoke: SciCode, HLE text, GPQA, IFBench, 40 long generations.
- Item-level flip analysis of the shipped GGUF against hosted FP8 or bf16 on 200 open-ended items.
- Ship the winner. Name the model and the quant.

Gate C is inverted from the prior draft. Prompting is tried on Friday in parallel with data gen. If prompting alone closes the disposition gap, still train: the adapter is cheap, and prompts are not robust under adversarial pressure [E]. Do not wait three weeks to find that out.

### Optional second weekend

- Multi-turn preference against a fine-tuned 8B simulator (OpenReview, eLife, F1000, Rust RFC). Never a prompted role-play assistant. Gate F: SPINE-style collapse at turn 25 at or below 40 percent; ReCrit Correction no more than 3 points below baseline.
- Domain RLVR on scientific coding only if capability still binds after the bigger student is in, which it should not on HLE-class vendor numbers. 10k-prompt envelope, shuffled-reward control, 8,000-token reasoning budget. 10B-plus rollout tokens is days on a node, not Saturday [EE].

### After the ship

- Private battery, judge calibration, and powered human panel, if the owner wants a claim that survives style stripping and outcomes. That work is research quality, not cook time.
- mlx-lm PR 1788: switch the Mac runtime to mlx-lm when it merges. Until then llama.cpp / Unsloth Desktop GGUF is the ship path.

Route decisions: Gate 0 failing is a quant or runtime problem, not a reason to shrink the student. Gate E failing with capability intact means the constitution or the pairs are wrong; fix data, do not distill into 27B. Capability falling more than 1.5 points means the LoRA hit reasoning; mix at least 75 percent reasoning-style data (Unsloth's 27B note) and rerun. F2 (trace presence under 40 percent on collapses) means the failure is knowledge, which this plan supplies by using the bigger student and retrieval, not by continued pretraining.

## 10. Cost, memory, and time

Rates fetched 2026-09-19 [E]: H100 median USD 3.38 per GPU-hour, H200 4.44 (Nebius on-demand 4.50, preemptible 2.45), B200 7.15; 8x H200 about USD 36 per hour on demand. HF Jobs `h200x8` USD 40 per hour. Tinker: Qwen3.8-27B train USD 4.103 and sample 5.595 per million tokens at 64K; GLM-5.3 (753B) train USD 14.58 at 256K; Qwen3.5-397B-A17B train USD 6.60. Flash-Next and GLM-5.3-Flash are not on Tinker. Open-student API output: GLM-5.3-Flash USD 0.50, Flash-Next USD 0.47 per million tokens.

| Step | Compute | Wall-clock | Cost |
|---|---|---|---|
| Friday data gen, 14M to 20M student tokens | hosted student sampling | 0.5 to 4 h | about USD 10 to 80 |
| Saturday LoRA, Flash-Next QLoRA | 1x B300 or 8x H200 | 2 to 8 h including overhead | about USD 40 to 290 |
| Saturday LoRA, 27B on Tinker | Tinker LoRA | minutes to a couple of hours queued | about USD 57 train plus USD 78 sample, about USD 136 |
| Sunday smoke on Mac plus hosted eval | Mac plus hosted | 4 to 12 h | under USD 150 hosted |
| Optional second-weekend multi-turn | 8B simulator plus preference | one more weekend | under USD 500 |
| Optional 10k-prompt RLVR | 8x H200 | hours to a couple of days | USD 330 to 2,200 at the low envelope [EE] |
| Private battery and human panel | people | days to weeks, after the ship | USD 4,000 to 9,000 per powered head-to-head |

The prior draft's 14 to 18 weeks and USD 17,000 to 19,000 of human evaluation was the instrument path, not the cook. The cook is USD 100 to 400 and a weekend. Human evaluation is optional and posterior.

What is not a weekend: continued pretraining, from-scratch training, RLVR at 10 billion-plus rollout tokens, building 1,210 private items, powered panels.

## 11. Risks and detection

- Optimizing the appearance of curiosity. Detected by the performed-curiosity set once it exists, style stripping, length control, out-of-family judges, and owner sessions.
- Sycophancy traded for stubbornness. All four ReCrit quadrants; constraint-holds items.
- Flash-Next Community license. Internal use is allowed. Shipping a public endpoint or an AI work assistant needs a separate Qwen license. GLM-5.3-Flash is the MIT escape hatch.
- Quantization tax on GLM-5.3-Flash. 4-bit does not fit. 2-bit and 3-bit top-1 is 78 to 82 percent. Item-level open-ended check can kill D and E in an afternoon.
- Axolotl QLoRA of Flash-Next is documented on NVIDIA, not on the Mac. The Mac never trains.
- mlx-lm qwen4_exp is an open PR. Pin llama.cpp / Unsloth GGUF. mlx-vlm is the MLX inference fallback.
- Unsloth's dedicated train notebook is 27B. Do not confuse that with "Flash-Next cannot be trained." Axolotl has the example; 51 fine-tunes exist.
- MoE QLoRA via bitsandbytes is not recommended in Unsloth's faster-MoE note. Axolotl's Flash-Next example sets `quantize_moe_experts: true`. If that path breaks, fall back to bf16 LoRA on 8x H200 (Flash-Next bf16 is 335 GB; 8x H200 is 1,128 GB) [E].
- First-time 320B expert-parallel bring-up can waste a weekend. If GLM is the student and the node is not already up, Flash-Next Axolotl is the faster cook.
- Teacher imprinting. Self-distillation from the student itself is the intended transfer. No frontier teacher.
- Spurious RL credit. Shuffled-reward control on any RL weekend.
- Runtime drift. Pin llama.cpp and Unsloth Desktop builds.
- Verbosity. Flash-Next and GLM-5.3-Flash are both flagged very verbose on Artificial Analysis. Pin a reasoning-token budget per stage.
- Panel noise. At 56.1 percent reviewer balanced accuracy, at least three ratings per item when a panel runs.

## 12. Missing inputs and provisional assumptions

| Input | Why it changes the plan | Provisional assumption |
|---|---|---|
| Student pick | Flash-Next vs GLM-5.3-Flash vs 27B | Flash-Next default; GLM if MIT and 2-bit or 3-bit quality hold; 27B if Apache-only |
| Acceptable ship quant | Decides A vs B vs C, or D vs E | A (UD-IQ4_XS) unless item-level flips force B |
| Acceptable speed and thinking budget | Decides effort and whether 64K KV is required | At least 15 t/s sustained at 4K, effort medium, at most 8,000 reasoning tokens per turn |
| Working context | 64K KV may kill GLM 3-bit | 64K working, 262K available |
| Commercial intent | Community 1.0 internal-use carve-out | Private internal use |
| Capability priorities | Agentic business workflow is 30 percent of the index | Scientific reasoning and long context in scope; agentic workflow out |
| Mac availability | Mac Studio ships 2026-09-22 | GGUF smoke can run on any 128 GB M5 Max; Studio is not a cook blocker |
| Willingness to execute ideas | Outcome-grounded gate only | After the ship, 10 ideas with blind self-scoring |

## 13. Evidence status and sources

This plan was revised on 2026-09-19 after the owner rejected a 12-week cook and a 27B student ceiling. The local capability claim does not depend on any frontier model: no frontier output is proposed as training data, no frontier model is proposed as a judge that feeds training, and every weekend gate can be run with open-weight judges and the owner.

Established facts rest on primary pages. Engineering estimates show their arithmetic. Research hypotheses are labeled where they appear. Three items remain unverified on the target: the default GPU working set on a 128 GB M5 Max, Flash-Next and GLM-5.3-Flash decode at 4K and 32K on an M5 Max, and prompt-cache restore on hybrid-attention models.

Primary sources for consequential claims:

- Apple M5 Max specifications and memory tiers: https://support.apple.com/en-us/126319 , https://www.apple.com/mac-studio/specs/ , https://www.apple.com/newsroom/2026/03/apple-debuts-m5-pro-and-m5-max-to-supercharge-the-most-demanding-pro-workflows/ , https://www.apple.com/newsroom/2026/08/apple-introduces-new-mac-studio-with-m5-max-and-m5-ultra/
- Neural Accelerators and prefill versus decode: https://machinelearning.apple.com/research/exploring-llms-mlx-m5
- M5 Max llama.cpp measurements: https://github.com/ggml-org/llama.cpp/discussions/4167 , https://github.com/ggml-org/llama.cpp/pull/27461
- Working set on 128 GB machines: https://github.com/waired-ai/waired-agent/issues/857 , https://raw.githubusercontent.com/jundot/omlx/main/docs/MoE_Expert_Offload.md
- Thermals: https://www.notebookcheck.net/M5-Max-with-inconsistent-performance-and-throttling-issues-Apple-MacBook-Pro-14-Review.1246064.0.html , https://www.notebookcheck.net/Did-Apple-reduce-the-performance-of-the-M5-Max-via-software-update-Yes-and-no.1376940.0.html
- Qwen3.8-27B: https://huggingface.co/Qwen/Qwen3.8-27B , https://github.com/QwenLM/Qwen3.8 , https://unsloth.ai/docs/models/qwen3.8/train , https://artificialanalysis.ai/models/qwen3-8-27b
- Qwen3.8-Flash-Next: https://huggingface.co/Qwen/Qwen3.8-Flash-Next , https://huggingface.co/Qwen/Qwen3.8-Flash-Next/raw/main/LICENSE , https://github.com/QwenLM/Qwen3.8-Flash-Next , https://unsloth.ai/docs/models/qwen3.8-next , https://docs.axolotl.ai/docs/models/qwen3.8-flash-next.html , https://github.com/axolotl-ai-cloud/axolotl/blob/main/examples/qwen3.8-flash-next/qlora.yaml , https://artificialanalysis.ai/models/qwen3-8-flash-next , https://huggingface.co/models?other=base_model:finetune:Qwen/Qwen3.8-Flash-Next
- mlx-lm qwen4_exp: https://github.com/ml-explore/mlx-lm/pull/1788
- DeepSeek V4-Flash-0731: https://huggingface.co/deepseek-ai/DeepSeek-V4-Flash-0731 , https://artificialanalysis.ai/models/deepseek-v4-flash , https://docs.axolotl.ai/docs/support-matrix.html , https://huggingface.co/unsloth/DeepSeek-V4-Flash-0731-GGUF
- GLM-5.3-Flash: https://huggingface.co/zai-org/GLM-5.3-Flash , https://huggingface.co/zai-org/GLM-5.3-Flash/resolve/main/LICENSE , https://unsloth.ai/docs/models/glm-5.3-flash , https://artificialanalysis.ai/models/glm-5-3-flash , https://huggingface.co/unsloth/GLM-5.3-Flash-GGUF
- Tinker models and prices: https://tinker-docs.thinkingmachines.ai/tinker/models/ , https://tinker-docs.thinkingmachines.ai/tinker/models.json
- LoRA sample efficiency: https://thinkingmachines.ai/blog/lora/
- Open Character Training: https://arxiv.org/abs/2511.01689 , https://github.com/maiush/OpenCharacterTraining
- GPU rental: https://nebius.com/prices , https://www.runpod.io/pricing , https://huggingface.co/docs/hub/jobs-pricing
- Diversity and post-training: https://arxiv.org/abs/2510.01171 , https://arxiv.org/abs/2309.05196 , https://arxiv.org/abs/2510.22954 , https://arxiv.org/abs/2410.04265 , https://arxiv.org/abs/2504.05228 , https://arxiv.org/abs/2501.18101 , https://arxiv.org/abs/2407.01082
- Ideation and execution: https://arxiv.org/abs/2409.04109 , https://arxiv.org/abs/2506.20803 , https://arxiv.org/abs/2608.29696
- Sycophancy and multi-turn: https://arxiv.org/abs/2310.13548 , https://arxiv.org/abs/2505.13995 , https://arxiv.org/html/2605.27288v1 , https://arxiv.org/html/2609.09090 , https://arxiv.org/abs/2505.23840 , https://huggingface.co/microsoft/UserLM-8b
- Character and disposition training: https://arxiv.org/abs/2511.01689 , https://www.anthropic.com/research/claude-character , https://arxiv.org/abs/2507.21509
- RL, distillation, and adaptation: https://arxiv.org/abs/2507.17746 , https://thinkingmachines.ai/blog/on-policy-distillation/ , https://github.com/ruixin31/Spurious_Rewards
- Licensing and data: https://www.anthropic.com/legal/commercial-terms , https://ai.google.dev/gemini-api/terms , https://x.ai/legal/acceptable-use-policy , https://www.anthropic.com/news/detecting-and-preventing-distillation-attacks
- Frontier model pages: https://platform.claude.com/docs/en/about-claude/models/overview , https://www.anthropic.com/claude-fable-and-mythos-5-1 , https://developers.openai.com/api/docs/models/gpt-6-astra , https://arena.ai/leaderboard/text , https://epoch.ai/benchmarks
