export interface DimensionResult {
  leftPercentage: number;
  rightPercentage: number;
}

export interface Dimensions {
  nomad: DimensionResult;
  order: DimensionResult;
  function: DimensionResult;
  endure: DimensionResult;
}

export interface Interpretation {
  dimension: string;
  text: string;
}

export interface DeskPersonalityResult {
  isWorkspace?: boolean;
  message?: string;
  title: string;
  dimensions: Dimensions;
  interpretations: Interpretation[];
  easterEggs: string[];
  tags: string;
  workHabits?: string[];
  catchphrases?: string[];
}
