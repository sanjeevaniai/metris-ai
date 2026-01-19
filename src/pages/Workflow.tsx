import scoutMascot from "@/assets/scout-mascot.png";
import { PublicHeader } from "@/components/layout/PublicHeader";

const Workflow = () => {
  return (
    <div className="min-h-screen bg-background pt-2">
      <PublicHeader />
      <div className="workflow-page">
        <style>{`
          .workflow-page {
            font-family: 'Inter', -apple-system, sans-serif;
            background: transparent;
            color: hsl(var(--foreground));
            padding: 40px 20px;
          }
          
          .workflow-container {
            max-width: 1400px;
            margin: 0 auto;
          }
          
          .workflow-header {
            text-align: center;
            margin-bottom: 50px;
          }
          
          .header-tag {
            font-size: 12px;
            letter-spacing: 4px;
            color: #22c55e;
            margin-bottom: 12px;
            font-weight: 600;
          }
          
          .workflow-header h1 {
            font-size: clamp(28px, 5vw, 48px);
            font-weight: 800;
            background: linear-gradient(135deg, #fff 0%, #86efac 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            letter-spacing: -1px;
          }
          
          .workflow-header p {
            font-size: 18px;
            color: #94a3b8;
            margin-top: 16px;
          }

          .tagline {
            font-size: 20px;
            color: #e2e8f0;
            margin-top: 12px;
            font-weight: 500;
          }

          .tagline-loop {
            font-size: 14px;
            color: #22c55e;
            margin-top: 8px;
            letter-spacing: 1px;
          }

          /* Three Outcomes Section */
          .three-outcomes {
            display: flex;
            justify-content: center;
            gap: 24px;
            margin: 40px 0 50px;
            flex-wrap: wrap;
          }

          .outcome-card {
            background: linear-gradient(135deg, #1e1e2e 0%, #252538 100%);
            border: 2px solid #22c55e;
            border-radius: 20px;
            padding: 30px 40px;
            text-align: center;
            min-width: 180px;
            box-shadow: 0 0 40px rgba(34, 197, 94, 0.15);
            transition: all 0.3s ease;
          }

          .outcome-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 0 60px rgba(34, 197, 94, 0.25);
          }

          .outcome-label {
            font-size: 11px;
            letter-spacing: 3px;
            color: #22c55e;
            margin-bottom: 12px;
            font-weight: 600;
          }

          .outcome-value {
            font-size: 42px;
            font-weight: 800;
            color: #fff;
            margin-bottom: 8px;
          }

          .outcome-subtext {
            font-size: 14px;
            color: #64748b;
          }

          .company-entry {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 40px;
            margin-bottom: 30px;
            flex-wrap: wrap;
          }
          
          .company-box {
            background: linear-gradient(135deg, #1e1e2e 0%, #2a2a3e 100%);
            border: 2px solid #22c55e;
            border-radius: 16px;
            padding: 24px 40px;
            text-align: center;
            box-shadow: 0 0 40px rgba(34, 197, 94, 0.2);
          }
          
          .company-label {
            font-size: 12px;
            color: #22c55e;
            letter-spacing: 2px;
            margin-bottom: 8px;
          }
          
          .company-name {
            font-size: 24px;
            font-weight: 700;
            color: #fff;
          }

          .arrow-right {
            font-size: 40px;
            color: #22c55e;
          }

          .scout-section {
            background: linear-gradient(135deg, #1e1e2e 0%, #252538 100%);
            border: 3px solid #22c55e;
            border-radius: 24px;
            padding: 30px 40px;
            margin-bottom: 40px;
            box-shadow: 0 0 60px rgba(34, 197, 94, 0.2);
            position: relative;
          }

          .scout-header {
            display: flex;
            align-items: center;
            gap: 20px;
            margin-bottom: 24px;
          }

          .scout-avatar {
            width: 70px;
            height: 70px;
            background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 0 30px rgba(34, 197, 94, 0.4);
            overflow: hidden;
            padding: 4px;
          }
          
          .scout-avatar img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 50%;
          }

          .scout-title {
            flex: 1;
          }

          .scout-title h2 {
            font-size: 28px;
            font-weight: 800;
            color: #22c55e;
            margin-bottom: 4px;
          }

          .scout-title p {
            color: #94a3b8;
            font-size: 14px;
          }

          .scout-badge {
            background: rgba(34, 197, 94, 0.2);
            border: 1px solid #22c55e;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 11px;
            letter-spacing: 2px;
            color: #22c55e;
            font-weight: 600;
          }

          .scout-content {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 30px;
          }

          @media (max-width: 800px) {
            .scout-content {
              grid-template-columns: 1fr;
            }
          }

          .scout-mode {
            background: rgba(0, 0, 0, 0.3);
            border-radius: 16px;
            padding: 24px;
          }

          .mode-header {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 16px;
          }

          .mode-icon {
            width: 40px;
            height: 40px;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
          }

          .mode-icon.onboard { background: #16a34a; }
          .mode-icon.global { background: #0891b2; }

          .mode-title {
            font-size: 16px;
            font-weight: 700;
            color: #fff;
          }

          .mode-subtitle {
            font-size: 12px;
            color: #64748b;
          }

          .mode-actions {
            display: flex;
            flex-direction: column;
            gap: 10px;
          }

          .action-item {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 10px 14px;
            background: rgba(34, 197, 94, 0.1);
            border-radius: 8px;
            font-size: 13px;
            color: #86efac;
          }

          .action-item span {
            font-size: 16px;
          }

          .scout-arrow {
            text-align: center;
            margin: 30px 0;
          }

          .scout-arrow-icon {
            font-size: 36px;
            color: #22c55e;
          }

          .scout-arrow-label {
            font-size: 12px;
            color: #22c55e;
            letter-spacing: 2px;
            margin-top: 8px;
          }

          /* The Loop Section */
          .loop-section {
            margin-bottom: 40px;
          }

          .loop-header {
            text-align: center;
            margin-bottom: 30px;
          }

          .loop-header h3 {
            font-size: 20px;
            font-weight: 700;
            color: #fff;
            margin-bottom: 8px;
          }

          .loop-header p {
            color: #64748b;
            font-size: 14px;
          }

          .loop-container {
            position: relative;
            margin: 40px 0;
          }
          
          .tracking-line {
            position: absolute;
            top: 100px;
            left: 5%;
            right: 5%;
            height: 6px;
            background: linear-gradient(90deg, #22c55e 0%, #22c55e 100%);
            border-radius: 3px;
            z-index: 0;
          }
          
          .tracking-label {
            position: absolute;
            top: 120px;
            left: 50%;
            transform: translateX(-50%);
            background: #1a1a2e;
            padding: 10px 28px;
            border-radius: 25px;
            border: 1px solid #22c55e;
            font-size: 11px;
            letter-spacing: 3px;
            color: #22c55e;
            font-weight: 600;
            z-index: 2;
            white-space: nowrap;
          }
          
          .loop-stages {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 24px;
            position: relative;
            z-index: 1;
          }
          
          @media (max-width: 900px) {
            .loop-stages {
              grid-template-columns: 1fr;
            }
            .tracking-line, .tracking-label {
              display: none;
            }
          }
          
          .loop-card {
            background: linear-gradient(135deg, #1e1e2e 0%, #252538 100%);
            border: 2px solid #22c55e;
            border-radius: 20px;
            padding: 24px;
            transition: all 0.3s ease;
            position: relative;
          }
          
          .loop-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 0 40px rgba(34, 197, 94, 0.3);
          }

          .loop-card-header {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 20px;
          }

          .loop-card-icon {
            width: 50px;
            height: 50px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            background: rgba(34, 197, 94, 0.2);
          }

          .loop-card-label {
            font-size: 11px;
            letter-spacing: 2px;
            color: #22c55e;
            font-weight: 600;
          }

          .loop-card-title {
            font-size: 22px;
            font-weight: 700;
            color: #fff;
          }
          
          .loop-card-desc {
            font-size: 13px;
            color: #64748b;
            margin-bottom: 20px;
            line-height: 1.5;
          }
          
          .metrics-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
          }
          
          .metric-box {
            background: rgba(0, 0, 0, 0.3);
            border-radius: 10px;
            padding: 12px;
          }
          
          .metric-label {
            font-size: 9px;
            color: #64748b;
            margin-bottom: 4px;
            letter-spacing: 1px;
          }
          
          .metric-value {
            font-size: 22px;
            font-weight: 800;
          }
          
          .metric-value.green { color: #22c55e; }
          .metric-value.white { color: #f8fafc; font-size: 18px; }
          .metric-value.emerald { color: #10b981; font-size: 18px; }
          .metric-value.status { color: #86efac; font-size: 13px; font-weight: 600; }

          .scout-help {
            margin-top: 16px;
            background: rgba(34, 197, 94, 0.1);
            border: 1px solid rgba(34, 197, 94, 0.3);
            border-radius: 10px;
            padding: 12px;
            font-size: 12px;
            color: #86efac;
          }

          .connection-methods {
            display: flex;
            justify-content: center;
            gap: 12px;
            flex-wrap: wrap;
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid rgba(255,255,255,0.1);
          }
          
          .connection-item {
            background: rgba(34, 197, 94, 0.15);
            border: 1px solid #22c55e;
            border-radius: 10px;
            padding: 10px 16px;
            font-size: 13px;
            transition: all 0.3s ease;
            cursor: pointer;
            color: #86efac;
          }
          
          .connection-item:hover {
            background: linear-gradient(135deg, #16a34a 0%, #22c55e 100%);
            transform: translateY(-2px);
            color: #fff;
          }
          
          .connection-item span {
            font-size: 16px;
            margin-right: 8px;
          }

          .equation-section {
            max-width: 1000px;
            margin: 60px auto 0;
            background: linear-gradient(135deg, #1e1e2e 0%, #252538 100%);
            border: 2px solid #22c55e;
            border-radius: 20px;
            padding: 36px;
            text-align: center;
          }
          
          .equation-title {
            font-size: 16px;
            font-weight: 700;
            margin-bottom: 24px;
            color: #fff;
          }
          
          .equation {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 10px;
            flex-wrap: wrap;
          }
          
          .eq-item {
            padding: 10px 16px;
            border-radius: 8px;
            font-weight: 600;
            font-size: 13px;
            color: #fff;
          }
          
          .eq-item.numbers { background: #3730a3; }
          .eq-item.dollars { background: #dc2626; }
          .eq-item.humans { background: #059669; }
          .eq-item.loop { background: #7c3aed; }
          .eq-item.continuous { background: #0891b2; }
          .eq-item.result { 
            background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
            font-size: 15px;
            font-weight: 700;
            padding: 10px 20px;
          }
          
          .eq-operator {
            color: #22c55e;
            font-size: 20px;
            font-weight: 600;
          }
          
          .equation-note {
            margin-top: 24px;
            color: #94a3b8;
            font-size: 14px;
            line-height: 1.6;
          }

          /* Brand Mission Section */
          .brand-section {
            max-width: 800px;
            margin: 60px auto 0;
            text-align: center;
          }

          .brand-company {
            font-size: 14px;
            letter-spacing: 3px;
            color: #22c55e;
            margin-bottom: 8px;
          }

          .brand-tagline {
            font-size: 18px;
            color: #e2e8f0;
            margin-bottom: 24px;
          }

          .brand-description {
            color: #94a3b8;
            font-size: 15px;
            line-height: 1.7;
          }

          .workflow-footer {
            text-align: center;
            margin-top: 50px;
            color: #64748b;
            font-size: 14px;
          }
          
          .workflow-footer strong {
            color: #22c55e;
          }
        `}</style>

        <div className="workflow-container">
          {/* Header */}
          <header className="workflow-header">
            <div className="header-tag">TRACEABILITY TO THE HUMAN</div>
            <h1>METRIS</h1>
            <p className="tagline">Governance in numbers. Risk in dollars. Traceability to the Human.</p>
            <p className="tagline-loop">In a loop. Continuously.</p>
          </header>

          {/* Three Outcomes */}
          <div className="three-outcomes">
            <div className="outcome-card">
              <div className="outcome-label">NUMBERS</div>
              <div className="outcome-value">743</div>
              <div className="outcome-subtext">governance score</div>
            </div>
            <div className="outcome-card">
              <div className="outcome-label">DOLLARS</div>
              <div className="outcome-value">$2.3M</div>
              <div className="outcome-subtext">risk exposure</div>
            </div>
            <div className="outcome-card">
              <div className="outcome-label">HUMANS</div>
              <div className="outcome-value">3,247</div>
              <div className="outcome-subtext">affected</div>
            </div>
          </div>

          {/* Company Entry Point */}
          <div className="company-entry">
            <div className="company-box">
              <div className="company-label">YOUR COMPANY</div>
              <div className="company-name">A-CORP AI SYSTEMS</div>
            </div>
            <div className="arrow-right">→</div>
            <div className="company-box">
              <div className="company-label">MEETS</div>
              <div
                className="company-name"
                style={{ display: "flex", alignItems: "center", gap: "10px", justifyContent: "center" }}
              >
                <img src={scoutMascot} alt="Scout AI" style={{ width: "32px", height: "32px", borderRadius: "50%" }} />
                SCOUT AI
              </div>
            </div>
          </div>

          {/* Scout AI Section */}
          <div className="scout-section">
            <div className="scout-header">
              <div className="scout-avatar">
                <img src={scoutMascot} alt="Scout AI" />
              </div>
              <div className="scout-title">
                <h2>SCOUT AI</h2>
                <p>Your AI Governance Analyst — Always Present, Always Helping</p>
              </div>
              <div className="scout-badge">ALWAYS ON</div>
            </div>

            <div className="scout-content">
              {/* Assessment Mode */}
              <div className="scout-mode">
                <div className="mode-header">
                  <div className="mode-icon onboard">🎯</div>
                  <div>
                    <div className="mode-title">Assessment & Discovery</div>
                    <div className="mode-subtitle">Get your NUMBERS, DOLLARS, HUMANS</div>
                  </div>
                </div>
                <div className="mode-actions">
                  <div className="action-item">
                    <span>💬</span> Asks discovery questions
                  </div>
                  <div className="action-item">
                    <span>📊</span> Captures decision volume
                  </div>
                  <div className="action-item">
                    <span>🔗</span> Connects your systems
                  </div>
                  <div className="action-item">
                    <span>🎯</span> Runs 25-agent assessment
                  </div>
                </div>
              </div>

              {/* Continuous Mode */}
              <div className="scout-mode">
                <div className="mode-header">
                  <div className="mode-icon global">🔄</div>
                  <div>
                    <div className="mode-title">Continuous Monitoring</div>
                    <div className="mode-subtitle">The loop never stops</div>
                  </div>
                </div>
                <div className="mode-actions">
                  <div className="action-item">
                    <span>📈</span> Tracks score drift in real-time
                  </div>
                  <div className="action-item">
                    <span>💰</span> Updates risk exposure continuously
                  </div>
                  <div className="action-item">
                    <span>👥</span> Monitors affected population
                  </div>
                  <div className="action-item">
                    <span>🚨</span> Alerts before crisis
                  </div>
                </div>
              </div>
            </div>

            {/* Connection Methods */}
            <div className="connection-methods">
              <div
                style={{
                  width: "100%",
                  textAlign: "center",
                  marginBottom: "12px",
                  fontSize: "11px",
                  letterSpacing: "2px",
                  color: "#64748b",
                }}
              >
                SCOUT CONNECTS VIA
              </div>
              <div className="connection-item">
                <span>⚡</span>API
              </div>
              <div className="connection-item">
                <span>📦</span>GitHub
              </div>
              <div className="connection-item">
                <span>📄</span>Documents
              </div>
              <div className="connection-item">
                <span>🌐</span>Website
              </div>
            </div>
          </div>

          {/* Arrow down from Scout */}
          <div className="scout-arrow">
            <div className="scout-arrow-icon">↓</div>
            <div className="scout-arrow-label">ONE ASSESSMENT. THREE ANSWERS. IN A LOOP.</div>
          </div>

          {/* The Loop Section */}
          <div className="loop-section">
            <div className="loop-header">
              <h3>THE CONTINUOUS TRACEABILITY LOOP</h3>
              <p>Every metric traces back to humans affected. That's what makes it real.</p>
            </div>

            <div className="loop-container">
              <div className="tracking-line"></div>
              <div className="tracking-label">◀ IN A LOOP. CONTINUOUSLY. ▶</div>

              <div className="loop-stages">
                {/* NUMBERS */}
                <div className="loop-card">
                  <div className="loop-card-header">
                    <div className="loop-card-icon">📊</div>
                    <div>
                      <div className="loop-card-label">NUMBERS</div>
                      <div className="loop-card-title">Your Score</div>
                    </div>
                  </div>
                  <div className="loop-card-desc">
                    Not "compliant" or "non-compliant" — a real number. 0-1000 Bayesian score with confidence intervals.
                  </div>

                  <div className="metrics-grid">
                    <div className="metric-box">
                      <div className="metric-label">SCORE</div>
                      <div className="metric-value green">743</div>
                    </div>
                    <div className="metric-box">
                      <div className="metric-label">CONFIDENCE</div>
                      <div className="metric-value white">± 48 (95%)</div>
                    </div>
                    <div className="metric-box">
                      <div className="metric-label">CHECKPOINTS</div>
                      <div className="metric-value emerald">1,900+</div>
                    </div>
                    <div className="metric-box">
                      <div className="metric-label">TIER</div>
                      <div className="metric-value status">Developing</div>
                    </div>
                  </div>

                  <div className="scout-help">
                    💬 Scout: "Your score is 743. That's Developing tier. Let me show you what's driving it down."
                  </div>
                </div>

                {/* DOLLARS */}
                <div className="loop-card">
                  <div className="loop-card-header">
                    <div className="loop-card-icon">💰</div>
                    <div>
                      <div className="loop-card-label">DOLLARS</div>
                      <div className="loop-card-title">Your Risk</div>
                    </div>
                  </div>
                  <div className="loop-card-desc">
                    Not "high risk" — actual dollar exposure. VaR, CVaR, Monte Carlo simulation. Board-ready numbers.
                  </div>

                  <div className="metrics-grid">
                    <div className="metric-box">
                      <div className="metric-label">VAR 95%</div>
                      <div className="metric-value green">$2.3M</div>
                    </div>
                    <div className="metric-box">
                      <div className="metric-label">CVAR 99%</div>
                      <div className="metric-value white">$4.1M</div>
                    </div>
                    <div className="metric-box">
                      <div className="metric-label">EXPECTED</div>
                      <div className="metric-value emerald">$847K</div>
                    </div>
                    <div className="metric-box">
                      <div className="metric-label">FIX ROI</div>
                      <div className="metric-value status">12.4x</div>
                    </div>
                  </div>

                  <div className="scout-help">
                    💬 Scout: "Your VaR is $2.3M. Fix CP-024 first — $180K cost, $2.2M risk reduction. That's 12.4x
                    ROI."
                  </div>
                </div>

                {/* HUMANS */}
                <div className="loop-card">
                  <div className="loop-card-header">
                    <div className="loop-card-icon">👥</div>
                    <div>
                      <div className="loop-card-label">HUMANS</div>
                      <div className="loop-card-title">Who's Affected</div>
                    </div>
                  </div>
                  <div className="loop-card-desc">
                    Not "fairness gap" — real humans in the blast radius. Traceback chain from checkpoint to person.
                  </div>

                  <div className="metrics-grid">
                    <div className="metric-box">
                      <div className="metric-label">AFFECTED</div>
                      <div className="metric-value green">3,247</div>
                    </div>
                    <div className="metric-box">
                      <div className="metric-label">DECISIONS/DAY</div>
                      <div className="metric-value white">9,400</div>
                    </div>
                    <div className="metric-box">
                      <div className="metric-label">90-DAY PROJ</div>
                      <div className="metric-value emerald">+12,400</div>
                    </div>
                    <div className="metric-box">
                      <div className="metric-label">AFTER FIX</div>
                      <div className="metric-value status">Protected ✓</div>
                    </div>
                  </div>

                  <div className="scout-help">
                    💬 Scout: "3,247 humans affected by fairness gap in CP-024. Fix it → 15,647 protected over 90 days."
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Equation Section */}
          <div className="equation-section">
            <div className="equation-title">THE METRIS EQUATION</div>
            <div className="equation">
              <div className="eq-item numbers">NUMBERS</div>
              <div className="eq-operator">+</div>
              <div className="eq-item dollars">DOLLARS</div>
              <div className="eq-operator">+</div>
              <div className="eq-item humans">HUMANS</div>
              <div className="eq-operator">×</div>
              <div className="eq-item loop">LOOP</div>
              <div className="eq-operator">×</div>
              <div className="eq-item continuous">CONTINUOUS</div>
              <div className="eq-operator">=</div>
              <div className="eq-item result">TRACEABILITY</div>
            </div>
            <div className="equation-note">
              Competitors give you a score and stop. We give you a score, the risk in dollars, and who's affected.
              <br />
              Then we keep watching. That's Traceability to the Human.
            </div>
          </div>

          {/* Brand Section */}
          <div className="brand-section">
            <div className="brand-company">SANJEEVANI AI</div>
            <div className="brand-tagline">Traceability to the Human</div>
            <div className="brand-description">
              SANJEEVANI means "life-giving" — and what gives life to AI governance? The human it traces back to.
              Without traceability to the human, it's just checkboxes. We give it meaning.
            </div>
          </div>

          {/* Footer */}
          <footer className="workflow-footer">
            <strong>METRIS</strong> by SANJEEVANI AI — Governance in numbers. Risk in dollars. Traceability to the
            Human.
          </footer>
        </div>
      </div>
    </div>
  );
};

export default Workflow;
