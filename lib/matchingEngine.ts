export function calculateCategory(
  height: number, 
  weight: number, 
  shoulderType: string, 
  chestType: string
) {
  // CATEGORY_2: Athletic/Broad (athletic_v_shape)
  if (shoulderType === 'broad' || chestType === 'muscular' || weight > 85) {
    return 'athletic_v_shape'; // Updated from 'CATEGORY_2'
  }
  
  // CATEGORY_1: Lean/Slim (lean_sculpted)
  if (height > 170 && weight < 75 && chestType === 'flat') {
    return 'lean_sculpted'; // Updated from 'CATEGORY_1'
  }

  // CATEGORY_3: Regular/Classic (balanced_standard)
  return 'balanced_standard'; // Updated from 'CATEGORY_3'
}