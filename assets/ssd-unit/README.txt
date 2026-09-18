SSD_UNIT 网页素材包（从 PDF 与补充角色板提取）

目录说明
- 01_HERO/hero_world-web.webp
  来自 PDF 世界观主场景，适合作为首页 Hero 背景。

- 02_CULTURE/
  artifact_zongmu-web.webp：从 Hero 场景中裁出的纵目青铜头像细节。
  artifact_tree-web.webp：从 Hero 场景中裁出的神树细节。
  artifact_ritual-web.webp：来自第 2 页文化转译主视觉。
  culture_visual_01-web.webp：同一张文化转译主视觉保留整图。
  archive_world-web.webp：从 Hero 场景中裁出的世界档案氛围图。

- 03_CHARACTERS/
  character_group-web.webp：第 4 页五人合体干净图。
  jin-web.webp / sen-web.webp / yao-web.webp / yu-web.webp / yang-web.webp：从五人合体图裁出的单人图（PNG 格式，但当前不是透明抠图，而是单人裁切版）。
  character_board_reference-web.webp：你刚补充的五频角色整板原图。
  *_panel.jpg：从补充整板中裁出的五个角色竖版参考图。

- 04_EXPERIENCE/
  blindbox_normal-web.webp：常规系列产品图。
  blindbox_secret-web.webp：隐藏组合产品图。
  museum_night-web.webp：博物馆夜场主场景。

- 05_ECOSYSTEM/
  当前保留空目录与说明，建议后续由网页端用 HTML/CSS 重构第 8 页交互。

建议给 Codex 的使用原则
1. 所有标题、正文、按钮、数字、说明文案、线框，全部用 HTML/CSS 重排，不要写进图片。
2. 首页只保留 hero_world-web.webp，不要同时再放一套相似世界观大图。
3. 角色区优先使用单人图 + 文本切换；如果后续找到原始单人透明图，直接替换 03_CHARACTERS/ 下同名文件。
4. P5（视觉语言）和 P8（生态结构）更适合做成网页排版与交互，不建议直接截图。

来源备注
- PDF：/mnt/data/SSD-UNIT世界观项目作品集.pdf
- 补充参考图：当前会话中新增的“五频角色整板”图片
