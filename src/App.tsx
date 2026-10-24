/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { TopBar } from './components/TopBar';
import { SplitControlPanel } from './components/SplitControlPanel';
import { ModelComparisonSection } from './components/ModelComparisonSection';
import { DecisionSpaceViewer } from './components/DecisionSpaceViewer';
import { ConfusionMatrixViewer } from './components/ConfusionMatrixViewer';
import { DecisionTreeViewer } from './components/DecisionTreeViewer';
import { FeatureImportanceViewer } from './components/FeatureImportanceViewer';
import { DatasetExplorer } from './components/DatasetExplorer';
import { PythonRunner } from './components/PythonRunner';
import { IRIS_DATA } from './data/irisData';
import {
  trainTestSplit,
  trainLogisticRegression,
  trainDecisionTree,
  trainRandomForest,
  evaluateModel,
  predictLogReg,
  predictTreeSample,
  predictForest,
} from './ml/mlEngine';

export default function App() {
  const [activeTab, setActiveTab] = useState('comparison');

  // Split Configuration Parameters
  const [testSize, setTestSize] = useState<number>(0.2);
  const [randomState, setRandomState] = useState<number>(42);
  const [stratify, setStratify] = useState<boolean>(true);

  // Model Hyperparameters
  const [logRegC, setLogRegC] = useState<number>(1.0);
  const [treeDepth, setTreeDepth] = useState<number>(3);
  const [rfEstimators, setRfEstimators] = useState<number>(50);

  // 1 & 2: Split dataset into Train and Test
  const splitResult = useMemo(() => {
    return trainTestSplit(IRIS_DATA, testSize, randomState, stratify);
  }, [testSize, randomState, stratify]);

  // 3: Train all 3 models on the EXACT SAME training dataset
  const models = useMemo(() => {
    const logReg = trainLogisticRegression(splitResult.train, logRegC);
    const dt = trainDecisionTree(splitResult.train, treeDepth, 2);
    const rf = trainRandomForest(splitResult.train, rfEstimators, treeDepth, randomState);
    return { logReg, dt, rf };
  }, [splitResult.train, logRegC, treeDepth, rfEstimators, randomState]);

  // Evaluate all 3 models on the EXACT SAME test dataset
  const metrics = useMemo(() => {
    // OvR feature importance for LogReg: average absolute normalized weights across 3 classes
    const lrWeightsSum = [0, 0, 0, 0];
    for (let c = 0; c < 3; c++) {
      for (let f = 0; f < 4; f++) {
        lrWeightsSum[f] += Math.abs(models.logReg.weights[c][f]);
      }
    }
    const lrTotal = lrWeightsSum.reduce((a, b) => a + b, 0) || 1;
    const lrImportance: [number, number, number, number] = [
      lrWeightsSum[0] / lrTotal,
      lrWeightsSum[1] / lrTotal,
      lrWeightsSum[2] / lrTotal,
      lrWeightsSum[3] / lrTotal,
    ];

    const logRegMetrics = evaluateModel(
      'Logistic Regression',
      (vec) => predictLogReg(models.logReg, vec),
      splitResult.train,
      splitResult.test,
      lrImportance
    );

    const dtMetrics = evaluateModel(
      'Decision Tree',
      (vec) => predictTreeSample(models.dt.root, vec).predictedClass,
      splitResult.train,
      splitResult.test,
      models.dt.featureImportances
    );

    const rfMetrics = evaluateModel(
      'Random Forest',
      (vec) => predictForest(models.rf, vec),
      splitResult.train,
      splitResult.test,
      models.rf.featureImportances
    );

    return {
      logReg: logRegMetrics,
      dt: dtMetrics,
      rf: rfMetrics,
    };
  }, [models, splitResult.train, splitResult.test]);

  const predictFns = useMemo(() => {
    return {
      logReg: (vec: number[]) => predictLogReg(models.logReg, vec),
      dt: (vec: number[]) => predictTreeSample(models.dt.root, vec).predictedClass,
      rf: (vec: number[]) => predictForest(models.rf, vec),
    };
  }, [models]);

  const resetToDefaults = () => {
    setTestSize(0.2);
    setRandomState(42);
    setStratify(true);
    setLogRegC(1.0);
    setTreeDepth(3);
    setRfEstimators(50);
  };

  // Download .py file
  const handleDownloadPy = () => {
    const element = document.createElement('a');
    element.setAttribute('href', '/iris_classifier_comparison.py');
    element.setAttribute('download', 'iris_classifier_comparison.py');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Download .ipynb file
  const handleDownloadIpynb = () => {
    const element = document.createElement('a');
    element.setAttribute('href', '/iris_classifier_comparison.ipynb');
    element.setAttribute('download', 'iris_classifier_comparison.ipynb');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans antialiased flex flex-col">
      {/* Top Bar with Top Bar Contract */}
      <TopBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onDownloadPy={handleDownloadPy}
        onDownloadIpynb={handleDownloadIpynb}
      />

      {/* Main Scientific Console Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Global Split Control & Invariant Verification Panel */}
        <SplitControlPanel
          testSize={testSize}
          setTestSize={setTestSize}
          randomState={randomState}
          setRandomState={setRandomState}
          stratify={stratify}
          setStratify={setStratify}
          splitResult={splitResult}
          onReset={resetToDefaults}
        />

        {/* Tab Views */}
        {activeTab === 'comparison' && (
          <ModelComparisonSection
            metrics={metrics}
            logRegC={logRegC}
            setLogRegC={setLogRegC}
            treeDepth={treeDepth}
            setTreeDepth={setTreeDepth}
            rfEstimators={rfEstimators}
            setRfEstimators={setRfEstimators}
            onSelectTab={setActiveTab}
          />
        )}

        {activeTab === 'boundaries' && (
          <DecisionSpaceViewer
            trainData={splitResult.train}
            testData={splitResult.test}
            logRegModel={models.logReg}
            dtModel={models.dt}
            rfModel={models.rf}
          />
        )}

        {activeTab === 'matrices' && (
          <ConfusionMatrixViewer
            metrics={metrics}
            testData={splitResult.test}
            predictFns={predictFns}
          />
        )}

        {activeTab === 'tree' && <DecisionTreeViewer dtModel={models.dt} />}

        {activeTab === 'importance' && <FeatureImportanceViewer metrics={metrics} />}

        {activeTab === 'dataset' && <DatasetExplorer />}

        {activeTab === 'python' && (
          <PythonRunner
            onDownloadPy={handleDownloadPy}
            onDownloadIpynb={handleDownloadIpynb}
          />
        )}
      </main>

      {/* Quiet Clean Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500 py-6 text-xs transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              Iris ML Classifier Bench
            </span>
            <span aria-hidden="true">·</span>
            <span>Empirical benchmark: Logistic Regression, Decision Tree &amp; Random Forest</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <button
              onClick={() => setActiveTab('python')}
              className="hover:text-slate-700 dark:hover:text-white transition-colors"
            >
              Python Script
            </button>
            <button
              onClick={() => setActiveTab('dataset')}
              className="hover:text-slate-700 dark:hover:text-white transition-colors"
            >
              Fisher 1936 Dataset
            </button>
            <button
              onClick={handleDownloadPy}
              className="hover:text-slate-700 dark:hover:text-white transition-colors font-mono"
            >
              iris_classifier_comparison.py
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
