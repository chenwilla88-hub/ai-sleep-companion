import { navItems, stateOptions, soundAssets, sessionPhases } from "./data.js";

const appState = {
  route: "home",
  selectedState: "脑子停不下来",
  journal: "",
  score: 8,
  playing: false,
};

const routes = {
  home: renderHome,
  coach: renderCoach,
  analysis: renderAnalysis,
  recommendation: renderRecommendation,
  session: renderSession,
  feedback: renderFeedback,
  mixer: renderMixer,
  records: renderRecords,
  profile: renderProfile,
  settings: renderSettings,
};

function stateScores() {
  const label = appState.selectedState;
  const text = appState.journal;
  const hasPressure = /压力|工作|论文|答辩|考试|焦虑|紧张/.test(`${label}${text}`);
  const hasTired = /累|疲惫|困|身体/.test(`${label}${text}`);
  const hasActiveMind = /脑子|停不下来|想|担心|明天/.test(`${label}${text}`);

  return {
    anxiety: hasPressure ? 8 : label.includes("焦虑") ? 7 : 4,
    fatigue: hasTired ? 7 : 5,
    mental: hasActiveMind ? 9 : 5,
    mood: label.includes("情绪") ? 4 : 6,
  };
}

function coachReply() {
  const scores = stateScores();
  if (scores.mental >= 8) {
    return "你的大脑今晚可能还在处理很多事情。我们先把节奏放慢，用几分钟让注意力从问题里退出来。";
  }
  if (scores.anxiety >= 7) {
    return "今晚不用急着解决所有事情。先让呼吸稳定下来，声音会帮你把注意力慢慢放回身体。";
  }
  if (scores.fatigue >= 7) {
    return "身体已经很累了，今晚适合少一点引导、多一点稳定的环境声音。";
  }
  return "今晚状态不错。我们保持简单安静，让声音轻轻陪你入睡。";
}

function recommendedTracks() {
  const scores = stateScores();
  if (scores.mental >= 8) {
    return [
      { id: "light-rain", weight: 50 },
      { id: "wind", weight: 20 },
      { id: "brown-noise", weight: 20 },
      { id: "ambient-pad", weight: 10 },
    ];
  }
  if (scores.anxiety >= 7) {
    return [
      { id: "stream", weight: 40 },
      { id: "pink-noise", weight: 25 },
      { id: "ambient-pad", weight: 25 },
      { id: "fireplace", weight: 10 },
    ];
  }
  if (scores.fatigue >= 7) {
    return [
      { id: "fan", weight: 45 },
      { id: "brown-noise", weight: 35 },
      { id: "distant-train", weight: 20 },
    ];
  }
  return [
    { id: "ocean", weight: 45 },
    { id: "forest", weight: 30 },
    { id: "ambient-pad", weight: 25 },
  ];
}

function assetById(id) {
  return soundAssets.find((asset) => asset.id === id);
}

function navigate(route) {
  appState.route = route;
  window.location.hash = route;
  render();
}

function shell(content) {
  return `
    <div class="shell">
      <aside class="sidebar">
        <div class="brand">
          <div class="brand-mark" aria-hidden="true"></div>
          <div>
            <div class="brand-title">AI Sleep Companion</div>
            <div class="brand-subtitle">今晚我已经为你准备好了</div>
          </div>
        </div>
        <nav class="nav" aria-label="Primary">
          ${navItems
            .map(
              (item) => `
                <button class="${appState.route === item.route ? "active" : ""}" data-route="${item.route}">
                  ${item.label}
                </button>
              `,
            )
            .join("")}
        </nav>
        <div class="sidebar-note">
          MVP 第一阶段：页面结构、主路径和静态交互。AI 与真实音频将在后续阶段接入。
        </div>
      </aside>
      <main class="main">
        ${content}
      </main>
      <nav class="mobile-nav" aria-label="Mobile primary">
        ${navItems
          .slice(0, 5)
          .map(
            (item) => `
              <button class="${appState.route === item.route ? "active" : ""}" data-route="${item.route}">
                ${item.shortLabel}
              </button>
            `,
          )
          .join("")}
      </nav>
    </div>
  `;
}

function renderHome() {
  return shell(`
    <section class="view home-grid">
      <div>
        <div class="kicker">AI 睡眠陪伴</div>
        <h1>今晚感觉怎么样？</h1>
        <p class="lead">告诉我一点点现在的状态，我会为今晚生成一段更适合你的睡眠声音流程。</p>
        <div class="home-actions">
          <button class="button" data-route="coach">开始今晚的睡眠</button>
          <button class="button secondary" data-route="records">查看睡眠记录</button>
        </div>
      </div>
      <aside class="tonight-panel">
        <div>
          <div class="small-label">Tonight</div>
          <h3>安静模式</h3>
          <div class="moon-meter" aria-hidden="true"></div>
        </div>
        <div class="quiet-list">
          <div class="quiet-row"><span>引导语音</span><span>前 5 分钟</span></div>
          <div class="quiet-row"><span>环境声音</span><span>持续播放</span></div>
          <div class="quiet-row"><span>整体音量</span><span>逐渐降低</span></div>
        </div>
      </aside>
    </section>
  `);
}

function renderCoach() {
  return shell(`
    <section class="view">
      <div class="page-head">
        <div>
          <div class="kicker">AI Sleep Coach</div>
          <h2>先说一句今晚的状态。</h2>
          <p>不用整理得很完整。越短越好，避免睡前越聊越清醒。</p>
        </div>
      </div>
      <div class="coach-layout">
        <div class="panel">
          <h3>选择一个最接近的状态</h3>
          <div class="chips">
            ${stateOptions
              .map(
                (option) => `
                  <button class="chip ${appState.selectedState === option ? "selected" : ""}" data-state="${option}">
                    ${option}
                  </button>
                `,
              )
              .join("")}
          </div>
          <textarea class="journal" data-journal placeholder="也可以写一句，例如：今天论文被打回来三次，现在脑子停不下来。">${appState.journal}</textarea>
          <div class="home-actions">
            <button class="button" data-route="analysis">生成今晚状态分析</button>
            <button class="button ghost" data-route="home">返回首页</button>
          </div>
        </div>
        <aside class="panel">
          <div class="small-label">AI 回复风格</div>
          <p class="coach-reply">${coachReply()}</p>
        </aside>
      </div>
    </section>
  `);
}

function renderAnalysis() {
  const scores = stateScores();
  return shell(`
    <section class="view">
      <div class="page-head">
        <div>
          <div class="kicker">睡眠状态分析</div>
          <h2>今晚先把大脑慢下来。</h2>
          <p>${coachReply()}</p>
        </div>
      </div>
      <div class="two-col">
        <div class="panel">
          <h3>状态模型</h3>
          <div class="metrics" style="margin-top: 22px;">
            ${metric("焦虑程度", scores.anxiety)}
            ${metric("疲劳程度", scores.fatigue)}
            ${metric("思维活跃度", scores.mental)}
            ${metric("情绪稳定度", scores.mood)}
          </div>
        </div>
        <div class="panel">
          <h3>今晚策略</h3>
          <div class="timeline">
            <div class="phase">
              <div class="phase-time">前 5 分钟</div>
              <div>
                <div class="phase-title">少量 AI 引导</div>
                <div class="phase-copy">帮助注意力从工作、学习或担心中退出。</div>
              </div>
            </div>
            <div class="phase">
              <div class="phase-time">之后</div>
              <div>
                <div class="phase-title">稳定环境声音</div>
                <div class="phase-copy">减少变化，保留低亮度、低刺激的声音层。</div>
              </div>
            </div>
          </div>
          <div class="home-actions">
            <button class="button" data-route="recommendation">查看声音推荐</button>
          </div>
        </div>
      </div>
    </section>
  `);
}

function renderRecommendation() {
  const tracks = recommendedTracks();
  return shell(`
    <section class="view">
      <div class="page-head">
        <div>
          <div class="kicker">AI 声音推荐</div>
          <h2>今晚的声音组合已经准备好。</h2>
          <p>第一版使用规则推荐和偏好权重。后续可以替换为机器学习推荐模型。</p>
        </div>
        <button class="button" data-route="session">开始 Sleep Session</button>
      </div>
      <div class="recommendation-grid">
        <div class="panel">
          <h3>Sound Profile</h3>
          <div class="track-list" style="margin-top: 18px;">
            ${tracks
              .map((track) => {
                const asset = assetById(track.id);
                return `
                  <div class="track-row">
                    <div>
                      <div class="track-name">${asset.name}</div>
                      <div class="track-meta">${asset.category} · ${asset.role}</div>
                      <div class="bar" style="margin-top: 10px;"><span style="--value: ${track.weight}%"></span></div>
                    </div>
                    <div class="track-weight">${track.weight}%</div>
                  </div>
                `;
              })
              .join("")}
          </div>
        </div>
        <aside class="panel">
          <h3>Session Timeline</h3>
          <div class="timeline">
            ${sessionPhases
              .map(
                (phase) => `
                  <div class="phase">
                    <div class="phase-time">${phase.time}</div>
                    <div>
                      <div class="phase-title">${phase.title}</div>
                      <div class="phase-copy">${phase.copy}</div>
                    </div>
                  </div>
                `,
              )
              .join("")}
          </div>
        </aside>
      </div>
    </section>
  `);
}

function renderSession() {
  return shell(`
    <section class="view session-view">
      <div class="session-panel">
        <div class="kicker">Sleep Session</div>
        <h2>${appState.playing ? "声音正在慢慢降低。" : "准备开始今晚的睡眠。"}</h2>
        <div class="breath-circle" aria-hidden="true"></div>
        <p class="session-copy">${appState.playing ? "先不用做什么。把屏幕放远一点，让声音继续陪你。" : "点击开始后，页面会保持低信息密度。第一版这里是播放控制原型，后续接入 Web Audio API。"}</p>
        <div class="player-controls">
          <button class="button" data-play>${appState.playing ? "暂停" : "开始播放"}</button>
          <button class="button secondary" data-route="feedback">明早反馈</button>
          <button class="button ghost" data-route="mixer">查看混音</button>
        </div>
      </div>
    </section>
  `);
}

function renderFeedback() {
  return shell(`
    <section class="view">
      <div class="page-head">
        <div>
          <div class="kicker">Sleep Feedback</div>
          <h2>昨晚睡得怎么样？</h2>
          <p>只需要一个评分，系统会用它更新声音偏好。</p>
        </div>
      </div>
      <div class="panel">
        <h3>选择评分</h3>
        <div class="feedback-scale">
          ${Array.from({ length: 10 }, (_, index) => index + 1)
            .map(
              (score) => `
                <button class="score-button ${appState.score === score ? "selected" : ""}" data-score="${score}">
                  ${score}
                </button>
              `,
            )
            .join("")}
        </div>
        <textarea class="journal" placeholder="昨晚什么最影响你的睡眠？"></textarea>
        <div class="home-actions">
          <button class="button" data-route="profile">保存反馈</button>
        </div>
      </div>
    </section>
  `);
}

function renderMixer() {
  const tracks = recommendedTracks();
  return shell(`
    <section class="view">
      <div class="page-head">
        <div>
          <div class="kicker">声音混音器</div>
          <h2>参数来自 Sound Profile。</h2>
          <p>这里是后续 Audio Engine 的调试和高级微调入口。</p>
        </div>
      </div>
      <div class="panel">
        <div class="track-list">
          ${tracks
            .map((track) => {
              const asset = assetById(track.id);
              return `
                <div class="track-row">
                  <div>
                    <div class="track-name">${asset.name}</div>
                    <div class="bar"><span style="--value: ${track.weight}%"></span></div>
                  </div>
                  <div class="track-weight">${track.weight}%</div>
                </div>
              `;
            })
            .join("")}
        </div>
      </div>
    </section>
  `);
}

function renderRecords() {
  return shell(`
    <section class="view">
      <div class="page-head">
        <div>
          <div class="kicker">睡眠记录</div>
          <h2>记录会让推荐越来越像你。</h2>
          <p>第一版只使用用户主动输入和 App 内行为，不伪装成医疗级睡眠监测。</p>
        </div>
      </div>
      <div class="panel">
        <h3>最近记录</h3>
        <div class="stat-grid">
          <div class="stat"><strong>8.3</strong><span>平均反馈评分</span></div>
          <div class="stat"><strong>26m</strong><span>平均睡前使用</span></div>
          <div class="stat"><strong>雨声</strong><span>常用声音</span></div>
        </div>
      </div>
    </section>
  `);
}

function renderProfile() {
  return shell(`
    <section class="view">
      <div class="page-head">
        <div>
          <div class="kicker">Sleep Profile</div>
          <h2>个人睡眠画像正在形成。</h2>
          <p>偏好权重会根据反馈逐渐调整，未来可替换为推荐模型。</p>
        </div>
      </div>
      <div class="two-col">
        <div class="panel">
          <h3>声音偏好</h3>
          <div class="metrics" style="margin-top: 22px;">
            ${metric("雨声", 9)}
            ${metric("棕噪声", 7)}
            ${metric("海浪", 6)}
            ${metric("钢琴", 2)}
          </div>
        </div>
        <div class="panel">
          <h3>睡前状态</h3>
          <div class="timeline">
            <div class="phase"><div class="phase-time">敏感</div><div><div class="phase-title">工作压力</div><div class="phase-copy">压力相关输入会触发更短的引导和更稳定的底噪。</div></div></div>
            <div class="phase"><div class="phase-time">常见</div><div><div class="phase-title">思维活跃</div><div class="phase-copy">更适合雨声、风声、棕噪声的低变化组合。</div></div></div>
          </div>
        </div>
      </div>
    </section>
  `);
}

function renderSettings() {
  return shell(`
    <section class="view">
      <div class="page-head">
        <div>
          <div class="kicker">设置</div>
          <h2>保持简单。</h2>
          <p>只保留 MVP 必要设置，复杂会员、社交和医疗数据不进入第一版。</p>
        </div>
      </div>
      <div class="panel">
        <div class="settings-list">
          <div class="setting-row"><span>默认 30 分钟后降低音量</span><span class="toggle" aria-hidden="true"></span></div>
          <div class="setting-row"><span>明早反馈提醒</span><span class="toggle" aria-hidden="true"></span></div>
          <div class="setting-row"><span>低亮度播放页</span><span class="toggle" aria-hidden="true"></span></div>
        </div>
      </div>
    </section>
  `);
}

function metric(label, value) {
  return `
    <div class="metric">
      <div class="metric-top"><span>${label}</span><span>${value}/10</span></div>
      <div class="bar"><span style="--value: ${value * 10}%"></span></div>
    </div>
  `;
}

function bindEvents() {
  document.querySelectorAll("[data-route]").forEach((button) => {
    button.addEventListener("click", () => navigate(button.dataset.route));
  });

  document.querySelectorAll("[data-state]").forEach((button) => {
    button.addEventListener("click", () => {
      appState.selectedState = button.dataset.state;
      render();
    });
  });

  const journal = document.querySelector("[data-journal]");
  if (journal) {
    journal.addEventListener("input", (event) => {
      appState.journal = event.target.value;
    });
  }

  document.querySelectorAll("[data-score]").forEach((button) => {
    button.addEventListener("click", () => {
      appState.score = Number(button.dataset.score);
      render();
    });
  });

  const play = document.querySelector("[data-play]");
  if (play) {
    play.addEventListener("click", () => {
      appState.playing = !appState.playing;
      render();
    });
  }
}

function render() {
  const renderRoute = routes[appState.route] || routes.home;
  document.querySelector("#app").innerHTML = renderRoute();
  bindEvents();
}

function init() {
  const route = window.location.hash.replace("#", "");
  if (routes[route]) {
    appState.route = route;
  }
  window.addEventListener("hashchange", () => {
    const nextRoute = window.location.hash.replace("#", "");
    if (routes[nextRoute]) {
      appState.route = nextRoute;
      render();
    }
  });
  render();
}

init();
