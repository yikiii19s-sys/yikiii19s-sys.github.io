const topics = [
  {type:"场景", title:"今天的心情，适合哪一杯？", reason:"把四款饮品放进熟悉的日常场景，帮助用户理解系列差异。", steps:["用通勤、午休和下班后的情绪切入","展示不同情绪对应的饮品","邀请读者留言分享今天的心情"]},
  {type:"产品", title:"四杯饮品里的四种情绪天气", reason:"集中介绍品牌概念和产品系列，适合新品认知阶段。", steps:["用一张图介绍情绪天气概念","分屏展示四款产品","用一句话概括每款的主题"]},
  {type:"互动", title:"给今天的心情点一杯", reason:"用容易参与的问题引出用户的表达，再把回答带回产品。", steps:["提供四种心情选项","呈现每个选项对应的饮品","邀请用户选择并分享原因"]},
  {type:"痛点", title:"点单纠结时，先问问今天是什么心情", reason:"用选择困难作为切入点，演示一种更容易理解的产品分类。", steps:["还原点单场景","用情绪替代长菜单","展示一组选择示例"]},
  {type:"热点", title:"用天气预报的方式播报今天的心情", reason:"用熟悉的表达形式承载品牌主题，便于做成短视频。", steps:["设计一句天气播报开场","将情绪变化对应到饮品画面","在结尾呈现系列"]},
];
const task = document.querySelector("#task");
const create = document.querySelector("#create");
const results = document.querySelector("#results");
const edit = document.querySelector("#edit");
const review = document.querySelector("#review");
const filters = document.querySelector("#filters");
const list = document.querySelector("#topics");
const brief = document.querySelector("#brief");
let filter = "Top 3";
let selected = 0;

function showResults(active) {
  create.hidden = active;
  results.hidden = !active;
  (active ? edit : review).removeAttribute("aria-current");
  (active ? review : edit).setAttribute("aria-current", "step");
  (active ? document.querySelector("#result-title") : task.elements.brand).focus();
}

function render() {
  const visible = topics.map((topic, index) => ({...topic, index})).filter(({type, index}) =>
    filter === "全部" || (filter === "Top 3" ? index < 3 : type === filter));
  if (!visible.some(({index}) => index === selected)) selected = visible[0].index;
  document.querySelector("#count").textContent = `${visible.length} 条选题`;
  filters.innerHTML = ["Top 3", "全部", "痛点", "场景", "产品", "互动", "热点"].map(type =>
    `<button type="button" data-filter="${type}" aria-pressed="${type === filter}">${type}</button>`).join("");
  list.innerHTML = visible.map(({title, type, index}) =>
    `<button class="topic" type="button" data-index="${index}" aria-pressed="${selected === index}"><small>${type}${index < 3 ? ` · 推荐 0${index + 1}` : ""}</small><b>${title}</b></button>`).join("");
  const {title, type, reason, steps} = topics[selected];
  brief.innerHTML = `<span class="tag">${type} · 示例 Brief</span><h2>${title}</h2>
    <h3>推荐理由</h3><p>${reason}</p><h3>内容提纲</h3>
    <ol>${steps.map(step => `<li>${step}</li>`).join("")}</ol>`;
}
task.addEventListener("submit", event => {
  event.preventDefault();
  const fields = new FormData(task);
  document.querySelector("#summary").textContent =
    `当前任务 · ${fields.get("brand")} / ${fields.get("platform")} / ${fields.get("goal")}。下方为晚风研究所的固定示例。`;
  review.disabled = false;
  render();
  showResults(true);
});
edit.addEventListener("click", () => showResults(false));
review.addEventListener("click", () => showResults(true));
filters.addEventListener("click", event => {
  const button = event.target.closest("button");
  if (!button) return;
  filter = button.dataset.filter;
  render();
  filters.querySelector('[aria-pressed="true"]').focus();
});
list.addEventListener("click", event => {
  const button = event.target.closest("button");
  if (!button) return;
  selected = Number(button.dataset.index);
  render();
  list.querySelector('[aria-pressed="true"]').focus();
});
