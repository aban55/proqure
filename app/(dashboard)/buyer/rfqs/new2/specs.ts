export const shapeOptions = ["ROUND", "SHS", "RHS"];

export const materialOptions = [
  "BLACK MS",
  "GI",
  "GP",
  "CR",
  "SS202",
  "SS304",
  "SS316",
];

export const sizeOptions: Record<string, string[]> = {
  ROUND: ["15NB", "20NB", "25NB", "32NB", "40NB", "50NB", "65NB", "80NB", "100NB"],
  SHS: ["25x25", "32x32", "40x40", "50x50", "72x72", "100x100", "150x150", "200x200"],
  RHS: ["25x15", "50x25", "80x40", "100x50", "150x100", "200x100", "200x150"],
};

// Thickness logic prototype
export function thicknessOptions(material: string, size: string): string[] {
  if (material === "GI") return ["1.4", "1.6", "2.0", "2.5", "3.0", "4.0"];
  if (material === "GP") return ["0.7", "1.0", "1.2", "1.6", "2.0", "2.5"];
  if (material === "BLACK MS") return ["1.2", "1.6", "2.0", "2.5", "3.0", "4.0", "5.0"];
  return ["1.0", "1.2", "1.6", "2.0", "3.0"];
}
