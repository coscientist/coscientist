---
title: 流暢性の罠
description: 滑らかなAI文章を正確さと取り違えること
---

流暢性の罠とは、滑らかで自信に満ちて聞こえる文章を正確だとみなしてしまう認知バイアスである。[LLMs](./llm) はもっともらしい次のトークンを最適化するため、出力は誤っていても読みやすく感じられることが多い。流暢さは、裏付けとなる検証がないまま、専門性の表層的な特徴だけを模倣してしまう。

この罠は [Encyclopedia Meltdown](./encyclopedia-meltdown) の中核的なメカニズムである。ユーザーが「正しそうに聞こえる」からという理由でAI出力を受け入れると、誤りが摩擦なく伝播してしまう。同じ現象は、学習における [illusions of competence](./illusions-of-competence) にも現れる。読み返しは、内容が見覚えのあるものに感じられるため、生産的だと思い込みやすい。

流暢性の罠に対抗するには、能動的な努力が必要である。[Coscientist](./coscientist) では、それは [rebuttal-first search](./rebuttal-first-search)、[evidence spans](./evidence-span) への [traceability](./traceability)、そして [verification](./verification) を [Operator](./operator) の明示的な責任にすることを意味する。