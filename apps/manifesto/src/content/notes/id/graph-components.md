---
title: Komponen Graf
description: Jenis node dan edge yang membentuk sebuah graf dialektik
---

Komponen graf adalah blok penyusun dari sebuah [Graf Dialektik](./dialectical-graph): jenis node yang merepresentasikan objek epistemik dan jenis edge yang merepresentasikan relasi di antara mereka.

**Jenis node** (lihat [Node Graf Dialektik](./dialectical-graph-nodes)):

- [Klaim](./claim) — proposisi yang dapat diverifikasi
- [Cuplikan Bukti](./evidence-span) — teks kutipan persis dari sumber
- [Cakupan](./scope) — kondisi penerapan
- [Asumsi](./assumption) — premis implisit
- [Metode](./method) — prosedur untuk menghasilkan bukti
- [Sumber](./source) — jangkar asal-usul (provenance)
- [Kontracontoh](./counterexample) — kasus yang mematahkan klaim
- [Node Isu](./issue-node) — bundel klaim yang saling bertabrakan

**Jenis edge** (lihat [Edge Graf Dialektik](./dialectical-graph-edges)):

- [Serangan](./attack) — tantangan langsung terhadap kebenaran
- [Undercut](./undercut) — tantangan terhadap dasar
- `supports`, `refines`, `generalizes`, `specializes`
- `cites`, `defines`, `measures`, `replicates`, `fails_to_replicate`
- [Kontensi](./contention) — penanda konflik terstruktur