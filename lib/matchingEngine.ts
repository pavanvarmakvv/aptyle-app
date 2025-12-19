export function calculateCategory(
  height: number, 
  weight: number, 
  shoulderType: string, 
  chestType: string
) {
  // 1. Athletic/Broad (Matches: athletic_v_shape)
  if (shoulderType === 'broad' || chestType === 'muscular' || weight > 85) {
    return 'athletic_v_shape';
  }
  
  // 2. Lean/Slim (Matches: lean_sculpted)
  if (height > 170 && weight < 75 && chestType === 'flat') {
    return 'lean_sculpted';
  }

  // 3. Robust/Classic (Optional: if you want to target this specifically)
  if (weight > 95 || (height < 170 && weight > 85)) {
    return 'robust_classic';
  }

  // 4. Regular/Classic (Matches: balanced_standard)
  return 'balanced_standard';
}