import type { Decision, AnalysisResult } from './decision-engine';

export function generateDetailedReport(decision: Decision, results: AnalysisResult[]): string {
  const timestamp = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  let report = `╔═══════════════════════════════════════════════════════════════════════════════╗
║                         DECISION ANALYSIS REPORT                              ║
╚═══════════════════════════════════════════════════════════════════════════════╝

Generated: ${timestamp}
Decision: ${decision.name}

${decision.description ? `Description: ${decision.description}\n` : ''}

┌─────────────────────────────────────────────────────────────────────────────┐
│ CRITERIA & WEIGHTS                                                          │
└─────────────────────────────────────────────────────────────────────────────┘

`;

  decision.criteria.forEach((criterion) => {
    report += `  • ${criterion.name.padEnd(35)} ${criterion.weight}%\n`;
  });

  report += `\n┌─────────────────────────────────────────────────────────────────────────────┐
│ OPTIONS EVALUATED                                                           │
└─────────────────────────────────────────────────────────────────────────────┘

`;

  decision.options.forEach((option, idx) => {
    report += `  ${idx + 1}. ${option.name}\n`;
  });

  report += `\n┌─────────────────────────────────────────────────────────────────────────────┐
│ SCORING MATRIX                                                              │
└─────────────────────────────────────────────────────────────────────────────┘

`;

  // Build scoring table
  const colWidth = 12;
  report += `  ${'Option'.padEnd(20)}`;
  decision.criteria.forEach((c) => {
    report += c.name.substring(0, 10).padEnd(colWidth);
  });
  report += 'Total\n';
  report += '  ' + '─'.repeat(Math.max(70, 20 + decision.criteria.length * colWidth + 8)) + '\n';

  results.forEach((result) => {
    report += `  ${result.optionName.padEnd(20)}`;
    result.scores.forEach((score) => {
      report += score.score.toFixed(1).padEnd(colWidth);
    });
    report += `${result.totalScore.toFixed(2)}\n`;
  });

  report += `\n┌─────────────────────────────────────────────────────────────────────────────┐
│ WEIGHTED SCORES                                                             │
└─────────────────────────────────────────────────────────────────────────────┘

`;

  results.forEach((result) => {
    report += `  ${result.optionName.padEnd(30)} ${result.totalScore.toFixed(2)}/10 (${result.percentage.toFixed(1)}%)\n`;
  });

  report += `\n┌─────────────────────────────────────────────────────────────────────────────┐
│ FINAL RANKINGS                                                              │
└─────────────────────────────────────────────────────────────────────────────┘

`;

  results.forEach((result) => {
    const medal = result.rank === 1 ? '🥇' : result.rank === 2 ? '🥈' : result.rank === 3 ? '🥉' : '  ';
    report += `  ${medal} #${result.rank.toString().padEnd(3)} ${result.optionName.padEnd(30)} ${result.totalScore.toFixed(2)}/10\n`;
  });

  report += `\n┌─────────────────────────────────────────────────────────────────────────────┐
│ RECOMMENDATION                                                              │
└─────────────────────────────────────────────────────────────────────────────┘

`;

  const topChoice = results[0];
  const runner = results[1];
  const scoreGap = topChoice.totalScore - (runner?.totalScore || 0);

  report += `
  PRIMARY CHOICE: ${topChoice.optionName}
  Score: ${topChoice.totalScore.toFixed(2)}/10 (${topChoice.percentage.toFixed(1)}% confidence)
  
${runner ? `
  RUNNER-UP: ${runner.optionName}
  Score: ${runner.totalScore.toFixed(2)}/10 (${runner.percentage.toFixed(1)}% confidence)
  Score Difference: ${scoreGap.toFixed(2)} points
` : ''}
  
  Based on weighted scoring analysis, "${topChoice.optionName}" is the recommended 
  choice as it best aligns with your defined criteria and priorities.

`;

  report += `\n┌─────────────────────────────────────────────────────────────────────────────┐
│ DETAILED ANALYSIS                                                           │
└─────────────────────────────────────────────────────────────────────────────┘

`;

  results.forEach((result) => {
    report += `\n${result.optionName} (Rank #${result.rank})\n`;
    report += '─'.repeat(50) + '\n';

    result.scores.forEach((score, idx) => {
      const weight = decision.criteria[idx]?.weight || 0;
      const weighted = (score.score * weight) / 100;
      const bar = '█'.repeat(Math.round(score.score / 2)) + '░'.repeat(Math.round((10 - score.score) / 2));
      report += `  ${score.criterionName.padEnd(25)} ${bar} ${score.score.toFixed(1)}/10 (×${weight}% = ${weighted.toFixed(2)})\n`;
    });

    report += `\n  Total Weighted Score: ${result.totalScore.toFixed(2)}/10\n`;
  });

  report += `\n╔═══════════════════════════════════════════════════════════════════════════════╗
║ End of Report - Decision Companion                                          ║
╚═══════════════════════════════════════════════════════════════════════════════╝
`;

  return report;
}

export function exportAsJSON(decision: Decision, results: AnalysisResult[]) {
  const data = {
    metadata: {
      exportedAt: new Date().toISOString(),
      version: '1.0',
    },
    decision: {
      name: decision.name,
      description: decision.description,
      criteria: decision.criteria,
      options: decision.options,
    },
    results,
    timestamp: new Date().toLocaleString(),
  };

  return JSON.stringify(data, null, 2);
}

export function exportAsCSV(decision: Decision, results: AnalysisResult[]) {
  let csv = 'Decision Analysis Export\n';
  csv += `Decision: ${decision.name}\n`;
  csv += `Date: ${new Date().toLocaleString()}\n\n`;

  // Criteria row
  csv += 'Option,' + decision.criteria.map((c) => `${c.name} (${c.weight}%)`).join(',') + ',Total Score,Rank\n';

  // Results rows
  results.forEach((result) => {
    const scores = result.scores.map((s) => s.score).join(',');
    csv += `${result.optionName},${scores},${result.totalScore.toFixed(2)},${result.rank}\n`;
  });

  return csv;
}

export function downloadFile(content: string, filename: string, mimeType: string = 'text/plain') {
  const element = document.createElement('a');
  element.setAttribute('href', `data:${mimeType};charset=utf-8,${encodeURIComponent(content)}`);
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}
