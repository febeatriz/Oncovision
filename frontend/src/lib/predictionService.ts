
// This is a simplified example of a prediction service
// In a real application, you would use a more sophisticated model

interface PredictionResult {
  malignant: number;
  benign: number;
}

// Sample features that might be important for breast cancer prediction
const IMPORTANT_FEATURES = [
  'radius_mean', 'texture_mean', 'perimeter_mean', 'area_mean', 'smoothness_mean',
  'compactness_mean', 'concavity_mean', 'concave_points_mean', 'symmetry_mean',
  'fractal_dimension_mean', 'radius_worst', 'texture_worst', 'perimeter_worst',
  'area_worst', 'smoothness_worst', 'compactness_worst', 'concavity_worst',
  'concave_points_worst', 'symmetry_worst', 'fractal_dimension_worst'
];

// This is a simulated prediction function
// In a real-world scenario, you would use a trained model
export const predictCancer = (data: any): { result: PredictionResult, confidence: number } => {
  // Check if we have a diagnosis column directly
  if (data.diagnosis !== undefined) {
    const isDiagnosisMalignant = typeof data.diagnosis === 'string' 
      ? data.diagnosis.toLowerCase().includes('m')
      : false;
    
    return {
      result: {
        malignant: isDiagnosisMalignant ? 0.9 : 0.1,
        benign: isDiagnosisMalignant ? 0.1 : 0.9
      },
      confidence: 0.9
    };
  }
  
  // Calculate a simple score based on the available features
  let score = 0;
  let featuresFound = 0;
  
  IMPORTANT_FEATURES.forEach(feature => {
    if (data[feature] !== undefined) {
      // For this simplified example, we'll use a basic heuristic:
      // - Higher values of radius, texture, perimeter, area contribute to malignancy
      // - Higher values of symmetry suggest benign
      
      const value = parseFloat(data[feature]);
      if (!isNaN(value)) {
        if (feature.includes('symmetry')) {
          score -= value / 10; // Lower score (more benign) with higher symmetry
        } else if (feature.includes('radius') || 
                  feature.includes('texture') || 
                  feature.includes('perimeter') || 
                  feature.includes('area')) {
          score += value / 100; // Higher score with higher values
        } else if (feature.includes('concavity') || 
                  feature.includes('concave_points')) {
          score += value * 2; // These are often important indicators
        }
        
        featuresFound++;
      }
    }
  });
  
  // Normalize score to a probability between 0 and 1
  // This is a very simplified approach
  if (featuresFound > 0) {
    score = score / featuresFound;
  }
  
  // Sigmoid function to convert score to probability
  const malignantProb = 1 / (1 + Math.exp(-score));
  const benignProb = 1 - malignantProb;
  
  // Calculate a fake confidence based on number of features found
  const confidence = Math.min(0.5 + (featuresFound / IMPORTANT_FEATURES.length) * 0.5, 0.95);
  
  return {
    result: {
      malignant: malignantProb,
      benign: benignProb
    },
    confidence
  };
};

// Function to make a prediction on a full dataset
export const analyzeDataset = (rows: any[]): { 
  malignantCount: number, 
  benignCount: number, 
  predictions: any[]
} => {
  let malignantCount = 0;
  let benignCount = 0;
  const predictions = [];
  
  for (const row of rows) {
    const { result } = predictCancer(row);
    
    if (result.malignant > result.benign) {
      malignantCount++;
    } else {
      benignCount++;
    }
    
    predictions.push({
      ...row,
      predicted_malignant: result.malignant,
      predicted_benign: result.benign,
      prediction: result.malignant > result.benign ? 'Malignant' : 'Benign'
    });
  }
  
  return {
    malignantCount,
    benignCount,
    predictions
  };
};
