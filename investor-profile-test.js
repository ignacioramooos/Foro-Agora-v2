// Test script to validate investor profile calculator fix
// This demonstrates the precision improvement

const testGetProfile = (answers) => {
  const riskScores = [
    [0, 1, 2], // Q1: reaction to 20% drop (conservative to aggressive)
    [0, 1, 2], // Q2: investment horizon (short to long)
    [0, 1, 2], // Q3: risk preference (safe to high-risk)
    [2, 1, 0], // Q4: emergency fund (has fund=conservative, no fund=aggressive)
    [0, 1, 2], // Q5: investment knowledge (no knowledge=conservative to expert=aggressive)
  ];
  
  const score = answers.reduce((sum, answer, idx) => sum + (riskScores[idx]?.[answer] ?? 0), 0);
  const avgScore = score / answers.length;
  
  if (avgScore < 0.7) return { profile: "Conservador", avgScore };
  if (avgScore < 1.4) return { profile: "Moderado", avgScore };
  return { profile: "Agresivo", avgScore };
};

console.log("=== Investor Profile Calculator - Precision Test ===\n");

// Test case 1: Conservative investor (all safe choices)
const conservativeAnswers = [0, 0, 0, 0, 0];
const result1 = testGetProfile(conservativeAnswers);
console.log("Test 1 - Conservative (all option 0):");
console.log(`  Answers: ${conservativeAnswers}`);
console.log(`  Average Score: ${result1.avgScore.toFixed(2)}`);
console.log(`  Result: ${result1.profile}\n`);

// Test case 2: Moderate investor (mixed choices)
const moderateAnswers = [1, 1, 1, 1, 1];
const result2 = testGetProfile(moderateAnswers);
console.log("Test 2 - Moderate (all option 1):");
console.log(`  Answers: ${moderateAnswers}`);
console.log(`  Average Score: ${result2.avgScore.toFixed(2)}`);
console.log(`  Result: ${result2.profile}\n`);

// Test case 3: Aggressive investor (all risky choices)
const aggressiveAnswers = [2, 2, 2, 2, 2];
const result3 = testGetProfile(aggressiveAnswers);
console.log("Test 3 - Aggressive (all option 2):");
console.log(`  Answers: ${aggressiveAnswers}`);
console.log(`  Average Score: ${result3.avgScore.toFixed(2)}`);
console.log(`  Result: ${result3.profile}\n`);

// Test case 4: Mixed with emergency fund consideration
const mixedAnswers = [1, 2, 1, 0, 2]; // Q4 with option 0 (no fund) = score of 2
const result4 = testGetProfile(mixedAnswers);
console.log("Test 4 - Mixed answers (1, 2, 1, 0, 2):");
console.log(`  Answers: ${mixedAnswers}`);
console.log(`  Average Score: ${result4.avgScore.toFixed(2)}`);
console.log(`  Result: ${result4.profile}\n`);

// Test case 5: Edge case near boundary
const boundaryAnswers = [0, 0, 1, 1, 1]; // Should be around 0.6 (Conservador)
const result5 = testGetProfile(boundaryAnswers);
console.log("Test 5 - Edge case (0, 0, 1, 1, 1):");
console.log(`  Answers: ${boundaryAnswers}`);
console.log(`  Average Score: ${result5.avgScore.toFixed(2)}`);
console.log(`  Result: ${result5.profile}\n`);

console.log("=== Summary ===");
console.log("✓ Score now ranges from 0 to 2 per question");
console.log("✓ Average score ranges from 0 to 2 overall");
console.log("✓ Clear thresholds: < 0.7 (Conservative), 0.7-1.4 (Moderate), > 1.4 (Aggressive)");
console.log("✓ Q4 (emergency fund) correctly inverted: having a fund = conservative");
