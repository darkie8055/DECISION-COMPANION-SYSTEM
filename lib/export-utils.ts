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

export function generatePDFContent(decision: Decision, results: AnalysisResult[]): string {
  return `<!DOCTYPE html>
<html>
<head>
    <title>Decision Analysis Report - ${decision.name}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
        .header { text-align: center; margin-bottom: 30px; }
        .section { margin-bottom: 25px; }
        .criteria-table, .results-table { width: 100%; border-collapse: collapse; margin: 15px 0; }
        .criteria-table th, .criteria-table td, .results-table th, .results-table td { 
            border: 1px solid #ddd; padding: 8px; text-align: left; 
        }
        .criteria-table th, .results-table th { background-color: #f2f2f2; }
        .winner { background-color: #e8f5e8; font-weight: bold; }
        .timestamp { color: #666; font-size: 12px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Decision Analysis Report</h1>
        <h2>${decision.name}</h2>
        <p class="timestamp">Generated: ${new Date().toLocaleString()}</p>
    </div>
    
    ${decision.description ? `<div class="section">
        <h3>Description</h3>
        <p>${decision.description}</p>
    </div>` : ''}
    
    <div class="section">
        <h3>Criteria & Weights</h3>
        <table class="criteria-table">
            <tr><th>Criterion</th><th>Weight (%)</th></tr>
            ${decision.criteria.map(c => `<tr><td>${c.name}</td><td>${c.weight}%</td></tr>`).join('')}
        </table>
    </div>
    
    <div class="section">
        <h3>Results</h3>
        <table class="results-table">
            <tr>
                <th>Rank</th><th>Option</th><th>Total Score</th><th>Percentage</th>
            </tr>
            ${results.map((r, i) => `<tr ${i === 0 ? 'class="winner"' : ''}>
                <td>${r.rank}</td>
                <td>${r.optionName}</td>
                <td>${r.totalScore.toFixed(2)}</td>
                <td>${r.percentage.toFixed(1)}%</td>
            </tr>`).join('')}
        </table>
    </div>
    
    <div class="section">
        <h3>Detailed Scoring</h3>
        <table class="results-table">
            <tr>
                <th>Option</th>
                ${decision.criteria.map(c => `<th>${c.name}</th>`).join('')}
                <th>Total</th>
            </tr>
            ${results.map(result => `<tr>
                <td>${result.optionName}</td>
                ${result.scores.map(s => `<td>${s.score}/10</td>`).join('')}
                <td><strong>${result.totalScore.toFixed(2)}</strong></td>
            </tr>`).join('')}
        </table>
    </div>
</body>
</html>`;
}

export function generateExcelContent(decision: Decision, results: AnalysisResult[]): string {
  // Generate Excel-compatible CSV with multiple sheets
  let excel = 'Decision Analysis Report\n';
  excel += `Decision: ${decision.name}\n`;
  excel += `Generated: ${new Date().toLocaleString()}\n\n`;
  
  // Summary Sheet
  excel += 'SUMMARY\n';
  excel += 'Rank,Option,Total Score,Percentage\n';
  results.forEach(result => {
    excel += `${result.rank},${result.optionName},${result.totalScore.toFixed(2)},${result.percentage.toFixed(1)}%\n`;
  });
  
  excel += '\n\nCRITERIA\n';
  excel += 'Criterion,Weight (%)\n';
  decision.criteria.forEach(criterion => {
    excel += `${criterion.name},${criterion.weight}\n`;
  });
  
  excel += '\n\nDETAILED SCORING\n';
  excel += 'Option,' + decision.criteria.map(c => c.name).join(',') + ',Total Score\n';
  results.forEach(result => {
    const scores = result.scores.map(s => s.score).join(',');
    excel += `${result.optionName},${scores},${result.totalScore.toFixed(2)}\n`;
  });
  
  return excel;
}

export function exportDecision(decision: Decision, results: AnalysisResult[], format: 'txt' | 'json' | 'csv' | 'pdf' | 'excel') {
  const timestamp = new Date().getTime();
  const baseName = decision.name.toLowerCase().replace(/\s+/g, '-');
  
  switch (format) {
    case 'txt':
      const textContent = generateDetailedReport(decision, results);
      downloadFile(textContent, `decision-report-${baseName}-${timestamp}.txt`, 'text/plain');
      break;
      
    case 'json':
      const jsonContent = exportAsJSON(decision, results);
      downloadFile(jsonContent, `decision-data-${baseName}-${timestamp}.json`, 'application/json');
      break;
      
    case 'csv':
      const csvContent = exportAsCSV(decision, results);
      downloadFile(csvContent, `decision-data-${baseName}-${timestamp}.csv`, 'text/csv');
      break;
      
    case 'pdf':
      const pdfContent = generatePDFContent(decision, results);
      downloadFile(pdfContent, `decision-report-${baseName}-${timestamp}.html`, 'text/html');
      break;
      
    case 'excel':
      const excelContent = generateExcelContent(decision, results);
      downloadFile(excelContent, `decision-analysis-${baseName}-${timestamp}.csv`, 'text/csv');
      break;
  }
}
