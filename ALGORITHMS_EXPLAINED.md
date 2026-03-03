# Decision Companion: Algorithms & Calculations Explained

> **Transparency Note:** All development work, research, design, and coding in this project was performed by the human developer. AI tools (V0.dev, ChatGPT, GitHub Copilot) were used as assistants to help look up information, generate boilerplate code, and structure documentation professionally. This log itself was created by the developer and formatted with AI assistance to ensure clear, professional presentation. Every decision, modification, and implementation was human-driven.

## 📊 Overview

This document explains how Decision Companion calculates scores, risk assessments, and analysis results. All algorithms are **transparent, explainable, and mathematically sound**—there are no "black box" AI models or hidden calculations. Every recommendation can be traced back to simple arithmetic that anyone can verify.

**Why This Matters:**  
Transparent algorithms build trust. You can see exactly which criteria influenced your decision and by how much.

## 🚀 Quick Reference

**Main Formula**: `Total Score = Σ(Weight × Score) / 100`

**Common Queries Solved**:
- "Which option has the highest weighted score?"
- "How sensitive is my decision to weight changes?"
- "What's the confidence level of my top choice?"
- "Are there any risky aspects to this decision?"
- "Which criteria matter most in my final ranking?"

---

## 🧮 Core Scoring Algorithm

### **Weighted Score Calculation**

Each option gets scored using this formula:

```
Total Score = Σ(Criterion_Weight × Option_Score) / 100

Where:
- Criterion_Weight = Weight percentage (0-100)
- Option_Score = User rating (0-10)
- Σ = Sum across all criteria
```

### **Example Calculation**

**Job Evaluation:**
- Salary (35%): Score = 8
- Growth (25%): Score = 9  
- Work-Life (20%): Score = 7
- Culture (15%): Score = 8
- Location (5%): Score = 6

**Calculation:**
```
Total Score = (35×8 + 25×9 + 20×7 + 15×8 + 5×6) / 100
           = (280 + 225 + 140 + 120 + 30) / 100
           = 795 / 100
           = 7.95/10
```

### **Percentage Conversion**
```
Percentage = (Total Score / 10) × 100
           = (7.95 / 10) × 100
           = 79.5%
```

**Why This Formula:**  
Simple weighted average—no AI, no machine learning, no hidden factors. Just transparent mathematics where you control every input.

---

## ⚠️ Risk Assessment Algorithms

### **1. Option Diversity Risk**

**Purpose:** Measures how many viable alternatives you have.

**Algorithm:**
```javascript
// Step 1: Count options with total score ≥ 7.0
const wellScoredOptions = results.filter(r => r.totalScore >= 7).length;

// Step 2: Calculate concentration risk percentage
const concentrationRisk = ((totalOptions - wellScoredOptions) / totalOptions) × 100;

// Step 3: Determine risk level
if (concentrationRisk > 60) {
    level = 'high';
    score = concentrationRisk; // 60-100
} else if (concentrationRisk > 30) {
    level = 'medium'; 
    score = concentrationRisk; // 30-60
} else {
    level = 'low';
    score = concentrationRisk; // 0-30
}
```

**Examples:**

**Low Risk (Good Diversity):**
```
Options: [8.5, 7.8, 7.2, 6.9] → 3 options ≥ 7.0
Concentration Risk = (4-3)/4 × 100 = 25%
Risk Score = 25/100 (LOW - Good diversity)
```

**High Risk (Poor Diversity):**
```
Options: [8.5, 5.2, 4.1, 3.8, 2.7] → 1 option ≥ 7.0  
Concentration Risk = (5-1)/5 × 100 = 80%
Risk Score = 80/100 (HIGH - Limited alternatives)
```

### **2. Decision Clarity Risk**

**Purpose:** Measures consistency of top option across criteria.

**Algorithm:**
```javascript
// Step 1: Get top option's scores across all criteria
const scores = topOption.scores.map(s => s.score); // [8, 9, 7, 8, 6]

// Step 2: Calculate average
const avgScore = scores.reduce((a,b) => a+b, 0) / scores.length;

// Step 3: Calculate standard deviation
const variance = scores.reduce((sum, score) => {
    return sum + Math.pow(score - avgScore, 2);
}, 0) / scores.length;

const stdDev = Math.sqrt(variance);

// Step 4: Determine risk level
if (stdDev > 3) {
    level = 'high'; // Very inconsistent performance
    score = Math.min(100, stdDev * 25);
} else if (stdDev > 2) {
    level = 'medium'; // Some inconsistency
    score = Math.min(100, stdDev * 20);
} else {
    level = 'low'; // Consistent performance
    score = Math.min(100, stdDev * 15);
}
```

**Example:**
```
Top Option Scores: [8, 9, 7, 8, 6]
Average = (8+9+7+8+6)/5 = 7.6
Variance = [(8-7.6)² + (9-7.6)² + (7-7.6)² + (8-7.6)² + (6-7.6)²]/5
         = [0.16 + 1.96 + 0.36 + 0.16 + 2.56]/5
         = 5.2/5 = 1.04
StdDev = √1.04 = 1.02

Since 1.02 < 2: Risk Level = LOW, Score ≈ 15/100
```

### **3. Weight Certainty Risk**

**Purpose:** Identifies potentially unrealistic weight distributions.

**Algorithm:**
```javascript
// Check for very low weights (< 10%)
const hasVeryLowWeights = criteria.some(c => c.weight < 10);

if (hasVeryLowWeights) {
    level = 'medium';
    score = 35;
    description = "Some criteria have very low weights - consider their actual importance";
} else {
    level = 'low';
    score = 10;
    description = "Weights are well-distributed across all criteria";
}
```

### **4. Recommendation Confidence Risk**

**Purpose:** Assesses confidence in the top recommendation.

**Algorithm:**
```javascript
const topScore = topOption.totalScore;

if (topScore > 8.0) {
    level = 'low';
    score = Math.max(0, 100 - (topScore * 10)); // ~20 or less
    description = "Highly confident in this recommendation";
} else if (topScore > 6.0) {
    level = 'medium';
    score = Math.max(0, 100 - (topScore * 10)); // ~20-40
    description = "Moderate confidence - consider runner-up options";
} else {
    level = 'high';
    score = Math.max(0, 100 - (topScore * 10)); // ~40+
    description = "Low confidence - results are close, review carefully";
}
```

---

## 📈 Sensitivity Analysis

### **Weight Adjustment Algorithm**

**Purpose:** Test how sensitive your decision is to weight changes.

```javascript
function performSensitivityAnalysis(decision, criterionId, weightChanges) {
    const originalWeight = decision.criteria.find(c => c.id === criterionId).weight;
    const results = [];
    
    weightChanges.forEach(newWeight => {
        // Create modified decision with new weight
        const modifiedDecision = {
            ...decision,
            criteria: decision.criteria.map(c => 
                c.id === criterionId 
                    ? { ...c, weight: newWeight }
                    : c
            )
        };
        
        // Calculate rankings with new weights
        const newResults = analyzeDecision(modifiedDecision);
        
        results.push({
            weight: newWeight,
            topOption: newResults[0].optionName,
            topScore: newResults[0].totalScore,
            rankings: newResults.map((r, i) => ({
                rank: i + 1,
                option: r.optionName,
                score: r.totalScore
            }))
        });
    });
    
    return results;
}
```

---

## 📊 High Variance Criteria Detection

### **Criteria Variance Algorithm**

**Purpose:** Identify which criteria create the most uncertainty.

```javascript
// For each criterion, calculate variance across all options
const criteriaVariance = decision.criteria.map(criterion => {
    // Get all scores for this criterion across options
    const scores = decision.options.map(option => {
        const score = decision.scores.find(s => 
            s.optionId === option.id && s.criterionId === criterion.id
        );
        return score?.score || 0;
    });
    
    // Calculate variance
    const avg = scores.reduce((a,b) => a+b, 0) / scores.length;
    const variance = scores.reduce((sum, score) => 
        sum + Math.pow(score - avg, 2), 0
    ) / scores.length;
    
    return {
        criterion: criterion,
        variance: Math.sqrt(variance), // Standard deviation
        avgScore: avg
    };
});

// Sort by variance (highest first)
const highVarianceCriteria = criteriaVariance
    .sort((a, b) => b.variance - a.variance)
    .slice(0, 3); // Top 3 most variable
```

**Example:**
```
Criterion: "Price"
Option Scores: [9, 3, 8, 2] → High variance (6.5)
Interpretation: Price scores vary wildly, creates uncertainty

Criterion: "Quality"  
Option Scores: [7, 8, 7, 8] → Low variance (0.5)
Interpretation: Quality is consistent across options
```

---

## 🎯 Overall Risk Calculation

### **Combined Risk Score**

```javascript
// Calculate overall risk from individual factors
const riskFactors = [decisionClarity, optionDiversity, weightCertainty, confidence];

const overallRiskScore = riskFactors.reduce((sum, factor) => {
    const numericalRisk = {
        'low': 1,
        'medium': 2, 
        'high': 3,
        'critical': 4
    };
    return sum + numericalRisk[factor.level];
}, 0) / riskFactors.length;

// Convert to categorical risk
const overallRisk = overallRiskScore > 3 ? 'high' 
                  : overallRiskScore > 2 ? 'medium' 
                  : 'low';
```

---

## 🔬 Testing Examples

### **Test Case 1: Perfect Decision**
```
Options: [9.2, 8.8, 8.1] (3 strong options)
Top Option Scores: [9, 9, 9, 9, 9] (very consistent)
Weights: [30, 25, 20, 15, 10] (well distributed)

Expected Results:
- Option Diversity: 0/100 (LOW - excellent)
- Decision Clarity: 0/100 (LOW - very consistent)
- Weight Certainty: 10/100 (LOW - good distribution)
- Confidence: 8/100 (LOW - high confidence)
- Overall Risk: LOW
```

### **Test Case 2: Risky Decision**
```
Options: [7.1, 4.2, 3.8, 2.9] (only 1 good option)
Top Option Scores: [9, 4, 8, 3, 6] (very inconsistent)  
Weights: [50, 30, 15, 3, 2] (some very low weights)

Expected Results:
- Option Diversity: 75/100 (HIGH - limited alternatives)
- Decision Clarity: 60/100 (HIGH - inconsistent performance) 
- Weight Certainty: 35/100 (MEDIUM - very low weights)
- Confidence: 29/100 (MEDIUM - moderate confidence)
- Overall Risk: HIGH
```

---

## 💡 Key Formulas Summary

| Calculation | Formula |
|-------------|---------|
| **Weighted Score** | `Σ(weight × score) / 100` |
| **Percentage** | `(totalScore / 10) × 100` |
| **Concentration Risk** | `(totalOptions - goodOptions) / totalOptions × 100` |
| **Standard Deviation** | `√(Σ(x - μ)² / n)` |
| **Variance** | `Σ(x - μ)² / n` |
| **Confidence Score** | `100 - (topScore × 10)` |

---

## ⚙️ Algorithm Configuration

### **Thresholds Used:**
- **Good Option Threshold**: 7.0/10 total score
- **High Variance Threshold**: StdDev > 3.0  
- **Medium Variance Threshold**: StdDev > 2.0
- **Low Weight Threshold**: < 10%
- **High Confidence Threshold**: > 8.0/10

### **Risk Level Mappings:**
```
Score Range → Risk Level
0-30:      LOW
31-60:     MEDIUM  
61-100:    HIGH
```

---

## 🎓 Understanding Your Results

### **Good Results Look Like:**
- Multiple options scoring 7.0+ (low diversity risk)
- Top option with consistent scores across criteria (low clarity risk)
- Well-distributed weights >5% each (low weight risk)
- Top option scoring 8.0+ (high confidence)

### **Warning Signs:**
- Only 1 option scoring 7.0+ (high diversity risk)
- Top option with wildly varying scores (high clarity risk)  
- Any weights <5% (question relevance)
- Top option scoring <6.0 (low confidence)

---

## 🔍 Why No AI or Machine Learning?

**Question:** Why not use AI for smarter recommendations?

**Answer:** Transparency and control. The assignment requirement states the system should be **explainable and not a "black box"**. Here's why our approach is better for decision-making:

**My Approach (Transparent Mathematics):**
- ✅ You control every input (weights, scores, criteria)
- ✅ Every calculation can be verified with a calculator
- ✅ Results are consistent and reproducible
- ✅ You can explain decisions to others with confidence
- ✅ No hidden biases or training data influencing outcomes
- ✅ Works offline, no API calls, complete privacy

**Bottom Line:** For important decisions, you should understand exactly how your answer was calculated. That's what this system provides.

---

This documentation provides the complete mathematical foundation for understanding exactly how Decision Companion calculates every score and assessment—with full transparency and zero hidden logic! 🎯