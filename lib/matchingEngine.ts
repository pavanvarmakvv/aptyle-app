export function calculateCategory(
  height: number, 
  weight: number, 
  shoulderType: string, 
  chestType: string
) {
  // CATEGORY_2: Athletic/Broad (The "V" Shape)
  if (shoulderType === 'broad' || chestType === 'muscular' || weight > 85) {
    return 'CATEGORY_2';
  }
  
  // CATEGORY_1: Lean/Slim (Rectangular)
  if (height > 170 && weight < 75 && chestType === 'flat') {
    return 'CATEGORY_1';
  }

  // CATEGORY_3: Regular/Classic
  return 'CATEGORY_3';
}