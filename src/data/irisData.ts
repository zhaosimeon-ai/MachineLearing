/**
 * Canonical Fisher's Iris Dataset (150 samples)
 * Features:
 * 0: Sepal Length (cm)
 * 1: Sepal Width (cm)
 * 2: Petal Length (cm)
 * 3: Petal Width (cm)
 *
 * Classes:
 * 0: Iris setosa
 * 1: Iris versicolor
 * 2: Iris virginica
 */

export interface IrisSample {
  id: number;
  sepalLength: number;
  sepalWidth: number;
  petalLength: number;
  petalWidth: number;
  species: 0 | 1 | 2;
  speciesName: 'setosa' | 'versicolor' | 'virginica';
}

export const FEATURE_NAMES = [
  'Sepal Length (cm)',
  'Sepal Width (cm)',
  'Petal Length (cm)',
  'Petal Width (cm)',
] as const;

export const FEATURE_KEYS: (keyof Pick<IrisSample, 'sepalLength' | 'sepalWidth' | 'petalLength' | 'petalWidth'>)[] = [
  'sepalLength',
  'sepalWidth',
  'petalLength',
  'petalWidth',
];

export const SPECIES_NAMES = ['setosa', 'versicolor', 'virginica'] as const;

export const SPECIES_DETAILS = [
  {
    id: 0,
    name: 'setosa',
    displayName: 'Iris-setosa',
    color: '#06B6D4', // laser cyan
    bgLight: 'bg-cyan-500/10',
    border: 'border-cyan-500/30',
    textColor: 'text-cyan-600 dark:text-cyan-400',
    description: 'Distinctive small petals, wide sepals, linearly separable from other species.',
  },
  {
    id: 1,
    name: 'versicolor',
    displayName: 'Iris-versicolor',
    color: '#F59E0B', // telemetry amber
    bgLight: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    textColor: 'text-amber-600 dark:text-amber-400',
    description: 'Intermediate petal lengths and widths, partial overlap with Virginica.',
  },
  {
    id: 2,
    name: 'virginica',
    displayName: 'Iris-virginica',
    color: '#3B82F6', // cobalt blue
    bgLight: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    textColor: 'text-blue-600 dark:text-blue-400',
    description: 'Largest petal length and width among the three species.',
  },
] as const;

export const IRIS_DATA: IrisSample[] = [
  // 50 Setosa (0)
  { id: 1, sepalLength: 5.1, sepalWidth: 3.5, petalLength: 1.4, petalWidth: 0.2, species: 0, speciesName: 'setosa' },
  { id: 2, sepalLength: 4.9, sepalWidth: 3.0, petalLength: 1.4, petalWidth: 0.2, species: 0, speciesName: 'setosa' },
  { id: 3, sepalLength: 4.7, sepalWidth: 3.2, petalLength: 1.3, petalWidth: 0.2, species: 0, speciesName: 'setosa' },
  { id: 4, sepalLength: 4.6, sepalWidth: 3.1, petalLength: 1.5, petalWidth: 0.2, species: 0, speciesName: 'setosa' },
  { id: 5, sepalLength: 5.0, sepalWidth: 3.6, petalLength: 1.4, petalWidth: 0.2, species: 0, speciesName: 'setosa' },
  { id: 6, sepalLength: 5.4, sepalWidth: 3.9, petalLength: 1.7, petalWidth: 0.4, species: 0, speciesName: 'setosa' },
  { id: 7, sepalLength: 4.6, sepalWidth: 3.4, petalLength: 1.4, petalWidth: 0.3, species: 0, speciesName: 'setosa' },
  { id: 8, sepalLength: 5.0, sepalWidth: 3.4, petalLength: 1.5, petalWidth: 0.2, species: 0, speciesName: 'setosa' },
  { id: 9, sepalLength: 4.4, sepalWidth: 2.9, petalLength: 1.4, petalWidth: 0.2, species: 0, speciesName: 'setosa' },
  { id: 10, sepalLength: 4.9, sepalWidth: 3.1, petalLength: 1.5, petalWidth: 0.1, species: 0, speciesName: 'setosa' },
  { id: 11, sepalLength: 5.4, sepalWidth: 3.7, petalLength: 1.5, petalWidth: 0.2, species: 0, speciesName: 'setosa' },
  { id: 12, sepalLength: 4.8, sepalWidth: 3.4, petalLength: 1.6, petalWidth: 0.2, species: 0, speciesName: 'setosa' },
  { id: 13, sepalLength: 4.8, sepalWidth: 3.0, petalLength: 1.4, petalWidth: 0.1, species: 0, speciesName: 'setosa' },
  { id: 14, sepalLength: 4.3, sepalWidth: 3.0, petalLength: 1.1, petalWidth: 0.1, species: 0, speciesName: 'setosa' },
  { id: 15, sepalLength: 5.8, sepalWidth: 4.0, petalLength: 1.2, petalWidth: 0.2, species: 0, speciesName: 'setosa' },
  { id: 16, sepalLength: 5.7, sepalWidth: 4.4, petalLength: 1.5, petalWidth: 0.4, species: 0, speciesName: 'setosa' },
  { id: 17, sepalLength: 5.4, sepalWidth: 3.9, petalLength: 1.3, petalWidth: 0.4, species: 0, speciesName: 'setosa' },
  { id: 18, sepalLength: 5.1, sepalWidth: 3.5, petalLength: 1.4, petalWidth: 0.3, species: 0, speciesName: 'setosa' },
  { id: 19, sepalLength: 5.7, sepalWidth: 3.8, petalLength: 1.7, petalWidth: 0.3, species: 0, speciesName: 'setosa' },
  { id: 20, sepalLength: 5.1, sepalWidth: 3.8, petalLength: 1.5, petalWidth: 0.3, species: 0, speciesName: 'setosa' },
  { id: 21, sepalLength: 5.4, sepalWidth: 3.4, petalLength: 1.7, petalWidth: 0.2, species: 0, speciesName: 'setosa' },
  { id: 22, sepalLength: 5.1, sepalWidth: 3.7, petalLength: 1.5, petalWidth: 0.4, species: 0, speciesName: 'setosa' },
  { id: 23, sepalLength: 4.6, sepalWidth: 3.6, petalLength: 1.0, petalWidth: 0.2, species: 0, speciesName: 'setosa' },
  { id: 24, sepalLength: 5.1, sepalWidth: 3.3, petalLength: 1.7, petalWidth: 0.5, species: 0, speciesName: 'setosa' },
  { id: 25, sepalLength: 4.8, sepalWidth: 3.4, petalLength: 1.9, petalWidth: 0.2, species: 0, speciesName: 'setosa' },
  { id: 26, sepalLength: 5.0, sepalWidth: 3.0, petalLength: 1.6, petalWidth: 0.2, species: 0, speciesName: 'setosa' },
  { id: 27, sepalLength: 5.0, sepalWidth: 3.4, petalLength: 1.6, petalWidth: 0.4, species: 0, speciesName: 'setosa' },
  { id: 28, sepalLength: 5.2, sepalWidth: 3.5, petalLength: 1.5, petalWidth: 0.2, species: 0, speciesName: 'setosa' },
  { id: 29, sepalLength: 5.2, sepalWidth: 3.4, petalLength: 1.4, petalWidth: 0.2, species: 0, speciesName: 'setosa' },
  { id: 30, sepalLength: 4.7, sepalWidth: 3.2, petalLength: 1.6, petalWidth: 0.2, species: 0, speciesName: 'setosa' },
  { id: 31, sepalLength: 4.8, sepalWidth: 3.1, petalLength: 1.6, petalWidth: 0.2, species: 0, speciesName: 'setosa' },
  { id: 32, sepalLength: 5.4, sepalWidth: 3.4, petalLength: 1.5, petalWidth: 0.4, species: 0, speciesName: 'setosa' },
  { id: 33, sepalLength: 5.2, sepalWidth: 4.1, petalLength: 1.5, petalWidth: 0.1, species: 0, speciesName: 'setosa' },
  { id: 34, sepalLength: 5.5, sepalWidth: 4.2, petalLength: 1.4, petalWidth: 0.2, species: 0, speciesName: 'setosa' },
  { id: 35, sepalLength: 4.9, sepalWidth: 3.1, petalLength: 1.5, petalWidth: 0.2, species: 0, speciesName: 'setosa' },
  { id: 36, sepalLength: 5.0, sepalWidth: 3.2, petalLength: 1.2, petalWidth: 0.2, species: 0, speciesName: 'setosa' },
  { id: 37, sepalLength: 5.5, sepalWidth: 3.5, petalLength: 1.3, petalWidth: 0.2, species: 0, speciesName: 'setosa' },
  { id: 38, sepalLength: 4.9, sepalWidth: 3.6, petalLength: 1.4, petalWidth: 0.1, species: 0, speciesName: 'setosa' },
  { id: 39, sepalLength: 4.4, sepalWidth: 3.0, petalLength: 1.3, petalWidth: 0.2, species: 0, speciesName: 'setosa' },
  { id: 40, sepalLength: 5.1, sepalWidth: 3.4, petalLength: 1.5, petalWidth: 0.2, species: 0, speciesName: 'setosa' },
  { id: 41, sepalLength: 5.0, sepalWidth: 3.5, petalLength: 1.3, petalWidth: 0.3, species: 0, speciesName: 'setosa' },
  { id: 42, sepalLength: 4.5, sepalWidth: 2.3, petalLength: 1.3, petalWidth: 0.3, species: 0, speciesName: 'setosa' },
  { id: 43, sepalLength: 4.4, sepalWidth: 3.2, petalLength: 1.3, petalWidth: 0.2, species: 0, speciesName: 'setosa' },
  { id: 44, sepalLength: 5.0, sepalWidth: 3.5, petalLength: 1.6, petalWidth: 0.6, species: 0, speciesName: 'setosa' },
  { id: 45, sepalLength: 5.1, sepalWidth: 3.8, petalLength: 1.9, petalWidth: 0.4, species: 0, speciesName: 'setosa' },
  { id: 46, sepalLength: 4.8, sepalWidth: 3.0, petalLength: 1.4, petalWidth: 0.3, species: 0, speciesName: 'setosa' },
  { id: 47, sepalLength: 5.1, sepalWidth: 3.8, petalLength: 1.6, petalWidth: 0.2, species: 0, speciesName: 'setosa' },
  { id: 48, sepalLength: 4.6, sepalWidth: 3.2, petalLength: 1.4, petalWidth: 0.2, species: 0, speciesName: 'setosa' },
  { id: 49, sepalLength: 5.3, sepalWidth: 3.7, petalLength: 1.5, petalWidth: 0.2, species: 0, speciesName: 'setosa' },
  { id: 50, sepalLength: 5.0, sepalWidth: 3.3, petalLength: 1.4, petalWidth: 0.2, species: 0, speciesName: 'setosa' },

  // 50 Versicolor (1)
  { id: 51, sepalLength: 7.0, sepalWidth: 3.2, petalLength: 4.7, petalWidth: 1.4, species: 1, speciesName: 'versicolor' },
  { id: 52, sepalLength: 6.4, sepalWidth: 3.2, petalLength: 4.5, petalWidth: 1.5, species: 1, speciesName: 'versicolor' },
  { id: 53, sepalLength: 6.9, sepalWidth: 3.1, petalLength: 4.9, petalWidth: 1.5, species: 1, speciesName: 'versicolor' },
  { id: 54, sepalLength: 5.5, sepalWidth: 2.3, petalLength: 4.0, petalWidth: 1.3, species: 1, speciesName: 'versicolor' },
  { id: 55, sepalLength: 6.5, sepalWidth: 2.8, petalLength: 4.6, petalWidth: 1.5, species: 1, speciesName: 'versicolor' },
  { id: 56, sepalLength: 5.7, sepalWidth: 2.8, petalLength: 4.5, petalWidth: 1.3, species: 1, speciesName: 'versicolor' },
  { id: 57, sepalLength: 6.3, sepalWidth: 3.3, petalLength: 4.7, petalWidth: 1.6, species: 1, speciesName: 'versicolor' },
  { id: 58, sepalLength: 4.9, sepalWidth: 2.4, petalLength: 3.3, petalWidth: 1.0, species: 1, speciesName: 'versicolor' },
  { id: 59, sepalLength: 6.6, sepalWidth: 2.9, petalLength: 4.6, petalWidth: 1.3, species: 1, speciesName: 'versicolor' },
  { id: 60, sepalLength: 5.2, sepalWidth: 2.7, petalLength: 3.9, petalWidth: 1.4, species: 1, speciesName: 'versicolor' },
  { id: 61, sepalLength: 5.0, sepalWidth: 2.0, petalLength: 3.5, petalWidth: 1.0, species: 1, speciesName: 'versicolor' },
  { id: 62, sepalLength: 5.9, sepalWidth: 3.0, petalLength: 4.2, petalWidth: 1.5, species: 1, speciesName: 'versicolor' },
  { id: 63, sepalLength: 6.0, sepalWidth: 2.2, petalLength: 4.0, petalWidth: 1.0, species: 1, speciesName: 'versicolor' },
  { id: 64, sepalLength: 6.1, sepalWidth: 2.9, petalLength: 4.7, petalWidth: 1.4, species: 1, speciesName: 'versicolor' },
  { id: 65, sepalLength: 5.6, sepalWidth: 2.9, petalLength: 3.6, petalWidth: 1.3, species: 1, speciesName: 'versicolor' },
  { id: 66, sepalLength: 6.7, sepalWidth: 3.1, petalLength: 4.4, petalWidth: 1.4, species: 1, speciesName: 'versicolor' },
  { id: 67, sepalLength: 5.6, sepalWidth: 3.0, petalLength: 4.5, petalWidth: 1.5, species: 1, speciesName: 'versicolor' },
  { id: 68, sepalLength: 5.8, sepalWidth: 2.7, petalLength: 4.1, petalWidth: 1.0, species: 1, speciesName: 'versicolor' },
  { id: 69, sepalLength: 6.2, sepalWidth: 2.2, petalLength: 4.5, petalWidth: 1.5, species: 1, speciesName: 'versicolor' },
  { id: 70, sepalLength: 5.6, sepalWidth: 2.5, petalLength: 3.9, petalWidth: 1.1, species: 1, speciesName: 'versicolor' },
  { id: 71, sepalLength: 5.9, sepalWidth: 3.2, petalLength: 4.8, petalWidth: 1.8, species: 1, speciesName: 'versicolor' },
  { id: 72, sepalLength: 6.1, sepalWidth: 2.8, petalLength: 4.0, petalWidth: 1.3, species: 1, speciesName: 'versicolor' },
  { id: 73, sepalLength: 6.3, sepalWidth: 2.5, petalLength: 4.9, petalWidth: 1.5, species: 1, speciesName: 'versicolor' },
  { id: 74, sepalLength: 6.1, sepalWidth: 2.8, petalLength: 4.7, petalWidth: 1.2, species: 1, speciesName: 'versicolor' },
  { id: 75, sepalLength: 6.4, sepalWidth: 2.9, petalLength: 4.3, petalWidth: 1.3, species: 1, speciesName: 'versicolor' },
  { id: 76, sepalLength: 6.6, sepalWidth: 3.0, petalLength: 4.4, petalWidth: 1.4, species: 1, speciesName: 'versicolor' },
  { id: 77, sepalLength: 6.8, sepalWidth: 2.8, petalLength: 4.8, petalWidth: 1.4, species: 1, speciesName: 'versicolor' },
  { id: 78, sepalLength: 6.7, sepalWidth: 3.0, petalLength: 5.0, petalWidth: 1.7, species: 1, speciesName: 'versicolor' },
  { id: 79, sepalLength: 6.0, sepalWidth: 2.9, petalLength: 4.5, petalWidth: 1.5, species: 1, speciesName: 'versicolor' },
  { id: 80, sepalLength: 5.7, sepalWidth: 2.6, petalLength: 3.5, petalWidth: 1.0, species: 1, speciesName: 'versicolor' },
  { id: 81, sepalLength: 5.5, sepalWidth: 2.4, petalLength: 3.8, petalWidth: 1.1, species: 1, speciesName: 'versicolor' },
  { id: 82, sepalLength: 5.5, sepalWidth: 2.4, petalLength: 3.7, petalWidth: 1.0, species: 1, speciesName: 'versicolor' },
  { id: 83, sepalLength: 5.8, sepalWidth: 2.7, petalLength: 3.9, petalWidth: 1.2, species: 1, speciesName: 'versicolor' },
  { id: 84, sepalLength: 6.0, sepalWidth: 2.7, petalLength: 5.1, petalWidth: 1.6, species: 1, speciesName: 'versicolor' },
  { id: 85, sepalLength: 5.4, sepalWidth: 3.0, petalLength: 4.5, petalWidth: 1.5, species: 1, speciesName: 'versicolor' },
  { id: 86, sepalLength: 6.0, sepalWidth: 3.4, petalLength: 4.5, petalWidth: 1.6, species: 1, speciesName: 'versicolor' },
  { id: 87, sepalLength: 6.7, sepalWidth: 3.1, petalLength: 4.7, petalWidth: 1.5, species: 1, speciesName: 'versicolor' },
  { id: 88, sepalLength: 6.3, sepalWidth: 2.3, petalLength: 4.4, petalWidth: 1.3, species: 1, speciesName: 'versicolor' },
  { id: 89, sepalLength: 5.6, sepalWidth: 3.0, petalLength: 4.1, petalWidth: 1.3, species: 1, speciesName: 'versicolor' },
  { id: 90, sepalLength: 5.5, sepalWidth: 2.5, petalLength: 4.0, petalWidth: 1.3, species: 1, speciesName: 'versicolor' },
  { id: 91, sepalLength: 5.5, sepalWidth: 2.6, petalLength: 4.4, petalWidth: 1.2, species: 1, speciesName: 'versicolor' },
  { id: 92, sepalLength: 6.1, sepalWidth: 3.0, petalLength: 4.6, petalWidth: 1.4, species: 1, speciesName: 'versicolor' },
  { id: 93, sepalLength: 5.8, sepalWidth: 2.6, petalLength: 4.0, petalWidth: 1.2, species: 1, speciesName: 'versicolor' },
  { id: 94, sepalLength: 5.0, sepalWidth: 2.3, petalLength: 3.3, petalWidth: 1.0, species: 1, speciesName: 'versicolor' },
  { id: 95, sepalLength: 5.6, sepalWidth: 2.7, petalLength: 4.2, petalWidth: 1.3, species: 1, speciesName: 'versicolor' },
  { id: 96, sepalLength: 5.7, sepalWidth: 3.0, petalLength: 4.2, petalWidth: 1.2, species: 1, speciesName: 'versicolor' },
  { id: 97, sepalLength: 5.7, sepalWidth: 2.9, petalLength: 4.2, petalWidth: 1.3, species: 1, speciesName: 'versicolor' },
  { id: 98, sepalLength: 6.2, sepalWidth: 2.9, petalLength: 4.3, petalWidth: 1.3, species: 1, speciesName: 'versicolor' },
  { id: 99, sepalLength: 5.1, sepalWidth: 2.5, petalLength: 3.0, petalWidth: 1.1, species: 1, speciesName: 'versicolor' },
  { id: 100, sepalLength: 5.7, sepalWidth: 2.8, petalLength: 4.1, petalWidth: 1.3, species: 1, speciesName: 'versicolor' },

  // 50 Virginica (2)
  { id: 101, sepalLength: 6.3, sepalWidth: 3.3, petalLength: 6.0, petalWidth: 2.5, species: 2, speciesName: 'virginica' },
  { id: 102, sepalLength: 5.8, sepalWidth: 2.7, petalLength: 5.1, petalWidth: 1.9, species: 2, speciesName: 'virginica' },
  { id: 103, sepalLength: 7.1, sepalWidth: 3.0, petalLength: 5.9, petalWidth: 2.1, species: 2, speciesName: 'virginica' },
  { id: 104, sepalLength: 6.3, sepalWidth: 2.9, petalLength: 5.6, petalWidth: 1.8, species: 2, speciesName: 'virginica' },
  { id: 105, sepalLength: 6.5, sepalWidth: 3.0, petalLength: 5.8, petalWidth: 2.2, species: 2, speciesName: 'virginica' },
  { id: 106, sepalLength: 7.6, sepalWidth: 3.0, petalLength: 6.6, petalWidth: 2.1, species: 2, speciesName: 'virginica' },
  { id: 107, sepalLength: 4.9, sepalWidth: 2.5, petalLength: 4.5, petalWidth: 1.7, species: 2, speciesName: 'virginica' },
  { id: 108, sepalLength: 7.3, sepalWidth: 2.9, petalLength: 6.3, petalWidth: 1.8, species: 2, speciesName: 'virginica' },
  { id: 109, sepalLength: 6.7, sepalWidth: 2.5, petalLength: 5.8, petalWidth: 1.8, species: 2, speciesName: 'virginica' },
  { id: 110, sepalLength: 7.2, sepalWidth: 3.6, petalLength: 6.1, petalWidth: 2.5, species: 2, speciesName: 'virginica' },
  { id: 111, sepalLength: 6.5, sepalWidth: 3.2, petalLength: 5.1, petalWidth: 2.0, species: 2, speciesName: 'virginica' },
  { id: 112, sepalLength: 6.8, sepalWidth: 3.0, petalLength: 5.5, petalWidth: 2.1, species: 2, speciesName: 'virginica' },
  { id: 113, sepalLength: 5.7, sepalWidth: 2.5, petalLength: 5.0, petalWidth: 2.0, species: 2, speciesName: 'virginica' },
  { id: 114, sepalLength: 5.8, sepalWidth: 2.8, petalLength: 5.1, petalWidth: 2.4, species: 2, speciesName: 'virginica' },
  { id: 115, sepalLength: 6.4, sepalWidth: 3.2, petalLength: 5.3, petalWidth: 2.3, species: 2, speciesName: 'virginica' },
  { id: 116, sepalLength: 6.5, sepalWidth: 3.0, petalLength: 5.5, petalWidth: 1.8, species: 2, speciesName: 'virginica' },
  { id: 117, sepalLength: 7.7, sepalWidth: 3.8, petalLength: 6.7, petalWidth: 2.2, species: 2, speciesName: 'virginica' },
  { id: 118, sepalLength: 7.7, sepalWidth: 2.6, petalLength: 6.9, petalWidth: 2.3, species: 2, speciesName: 'virginica' },
  { id: 119, sepalLength: 6.0, sepalWidth: 2.2, petalLength: 5.0, petalWidth: 1.5, species: 2, speciesName: 'virginica' },
  { id: 120, sepalLength: 6.9, sepalWidth: 3.2, petalLength: 5.7, petalWidth: 2.3, species: 2, speciesName: 'virginica' },
  { id: 121, sepalLength: 5.6, sepalWidth: 2.8, petalLength: 4.9, petalWidth: 2.0, species: 2, speciesName: 'virginica' },
  { id: 122, sepalLength: 7.7, sepalWidth: 2.8, petalLength: 6.7, petalWidth: 2.0, species: 2, speciesName: 'virginica' },
  { id: 123, sepalLength: 6.3, sepalWidth: 2.7, petalLength: 4.9, petalWidth: 1.8, species: 2, speciesName: 'virginica' },
  { id: 124, sepalLength: 6.7, sepalWidth: 3.3, petalLength: 5.7, petalWidth: 2.1, species: 2, speciesName: 'virginica' },
  { id: 125, sepalLength: 7.2, sepalWidth: 3.2, petalLength: 6.0, petalWidth: 1.8, species: 2, speciesName: 'virginica' },
  { id: 126, sepalLength: 6.2, sepalWidth: 2.8, petalLength: 4.8, petalWidth: 1.8, species: 2, speciesName: 'virginica' },
  { id: 127, sepalLength: 6.1, sepalWidth: 3.0, petalLength: 4.9, petalWidth: 1.8, species: 2, speciesName: 'virginica' },
  { id: 128, sepalLength: 6.4, sepalWidth: 2.8, petalLength: 5.6, petalWidth: 2.1, species: 2, speciesName: 'virginica' },
  { id: 129, sepalLength: 7.2, sepalWidth: 3.0, petalLength: 5.8, petalWidth: 1.6, species: 2, speciesName: 'virginica' },
  { id: 130, sepalLength: 7.4, sepalWidth: 2.8, petalLength: 6.1, petalWidth: 1.9, species: 2, speciesName: 'virginica' },
  { id: 131, sepalLength: 7.9, sepalWidth: 3.8, petalLength: 6.4, petalWidth: 2.0, species: 2, speciesName: 'virginica' },
  { id: 132, sepalLength: 6.4, sepalWidth: 2.8, petalLength: 5.6, petalWidth: 2.2, species: 2, speciesName: 'virginica' },
  { id: 133, sepalLength: 6.3, sepalWidth: 2.8, petalLength: 5.1, petalWidth: 1.5, species: 2, speciesName: 'virginica' },
  { id: 134, sepalLength: 6.1, sepalWidth: 2.6, petalLength: 5.6, petalWidth: 1.4, species: 2, speciesName: 'virginica' },
  { id: 135, sepalLength: 7.7, sepalWidth: 3.0, petalLength: 6.1, petalWidth: 2.3, species: 2, speciesName: 'virginica' },
  { id: 136, sepalLength: 6.3, sepalWidth: 3.4, petalLength: 5.6, petalWidth: 2.4, species: 2, speciesName: 'virginica' },
  { id: 137, sepalLength: 6.4, sepalWidth: 3.1, petalLength: 5.5, petalWidth: 1.8, species: 2, speciesName: 'virginica' },
  { id: 138, sepalLength: 6.0, sepalWidth: 3.0, petalLength: 4.8, petalWidth: 1.8, species: 2, speciesName: 'virginica' },
  { id: 139, sepalLength: 6.9, sepalWidth: 3.1, petalLength: 5.4, petalWidth: 2.1, species: 2, speciesName: 'virginica' },
  { id: 140, sepalLength: 6.7, sepalWidth: 3.1, petalLength: 5.6, petalWidth: 2.4, species: 2, speciesName: 'virginica' },
  { id: 141, sepalLength: 6.9, sepalWidth: 3.1, petalLength: 5.1, petalWidth: 2.3, species: 2, speciesName: 'virginica' },
  { id: 142, sepalLength: 5.8, sepalWidth: 2.7, petalLength: 5.1, petalWidth: 1.9, species: 2, speciesName: 'virginica' },
  { id: 143, sepalLength: 6.8, sepalWidth: 3.2, petalLength: 5.9, petalWidth: 2.3, species: 2, speciesName: 'virginica' },
  { id: 144, sepalLength: 6.7, sepalWidth: 3.3, petalLength: 5.7, petalWidth: 2.5, species: 2, speciesName: 'virginica' },
  { id: 145, sepalLength: 6.7, sepalWidth: 3.0, petalLength: 5.2, petalWidth: 2.3, species: 2, speciesName: 'virginica' },
  { id: 146, sepalLength: 6.3, sepalWidth: 2.5, petalLength: 5.0, petalWidth: 1.9, species: 2, speciesName: 'virginica' },
  { id: 147, sepalLength: 6.5, sepalWidth: 3.0, petalLength: 5.2, petalWidth: 2.0, species: 2, speciesName: 'virginica' },
  { id: 148, sepalLength: 6.2, sepalWidth: 3.4, petalLength: 5.4, petalWidth: 2.3, species: 2, speciesName: 'virginica' },
  { id: 149, sepalLength: 5.9, sepalWidth: 3.0, petalLength: 5.1, petalWidth: 1.8, species: 2, speciesName: 'virginica' },
  { id: 150, sepalLength: 5.9, sepalWidth: 3.0, petalLength: 5.1, petalWidth: 1.8, species: 2, speciesName: 'virginica' },
];

export interface FeatureStats {
  min: number;
  max: number;
  mean: number;
  std: number;
}

export function computeFeatureStats(): Record<string, FeatureStats> {
  const stats: Record<string, FeatureStats> = {};
  FEATURE_KEYS.forEach((key) => {
    const vals = IRIS_DATA.map((d) => d[key]);
    const min = Math.min(...vals);
    const max = Math.max(...vals);
    const mean = vals.reduce((a, b) => a + b, 0) / vals.length;
    const variance = vals.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / vals.length;
    stats[key] = { min, max, mean, std: Math.sqrt(variance) };
  });
  return stats;
}
