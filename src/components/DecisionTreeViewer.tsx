import React, { useState } from 'react';
import { DecisionTreeModel, TreeNode } from '../ml/mlEngine';
import { SPECIES_DETAILS, FEATURE_NAMES } from '../data/irisData';
import { GitBranch, ChevronRight, CheckCircle, Info, Code } from 'lucide-react';

interface DecisionTreeViewerProps {
  dtModel: DecisionTreeModel;
}

export const DecisionTreeViewer: React.FC<DecisionTreeViewerProps> = ({ dtModel }) => {
  const [selectedNode, setSelectedNode] = useState<TreeNode | null>(dtModel.root);

  // Render tree node recursively as a clean hierarchical diagram
  const renderNodeHierarchy = (node: TreeNode, depth: number = 0, pathLabel: string = 'Root') => {
    const isSelected = selectedNode?.id === node.id;
    const isLeaf = node.isLeaf;
    const winnerSp = SPECIES_DETAILS[node.predictedClass];

    return (
      <div key={node.id} className="flex flex-col items-center">
        {/* Node Box */}
        <div
          onClick={() => setSelectedNode(node)}
          className={`cursor-pointer transition-all rounded-xl p-3 border text-xs text-left min-w-[210px] max-w-[240px] shadow-sm ${
            isSelected
              ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-950/40'
              : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
          }`}
        >
          {/* Node Header */}
          <div className="flex items-center justify-between pb-1.5 border-b border-slate-100 dark:border-slate-800 mb-2">
            <span className="text-[10px] font-mono text-slate-400 uppercase">
              {pathLabel} {isLeaf && '· [LEAF]'}
            </span>
            <span
              className="w-2.5 h-2.5 rounded-sm"
              style={{ backgroundColor: winnerSp.color }}
              title={`Majority: ${winnerSp.displayName}`}
            />
          </div>

          {/* Condition or Prediction */}
          {isLeaf ? (
            <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 mb-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>Predict {winnerSp.displayName}</span>
            </div>
          ) : (
            <div className="font-bold font-mono text-emerald-700 dark:text-emerald-400 mb-1.5">
              {node.featureName} &le; {node.threshold} cm
            </div>
          )}

          {/* Gini & Samples */}
          <div className="text-[11px] font-mono text-slate-600 dark:text-slate-400 space-y-0.5">
            <div className="flex justify-between">
              <span>Gini Impurity:</span>
              <span className="font-semibold tabular-nums">{node.gini.toFixed(3)}</span>
            </div>
            <div className="flex justify-between">
              <span>Samples:</span>
              <span className="font-semibold tabular-nums">{node.samples}</span>
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800">
              <span>Classes:</span>
              <span className="tabular-nums">[{node.classCounts.join(', ')}]</span>
            </div>
          </div>
        </div>

        {/* Children Connectors */}
        {!isLeaf && node.left && node.right && (
          <div className="flex flex-col items-center w-full mt-2">
            <div className="w-0.5 h-4 bg-slate-300 dark:bg-slate-700" />
            <div className="relative flex justify-center gap-6 pt-2">
              <div className="absolute top-0 left-1/4 right-1/4 h-0.5 bg-slate-300 dark:bg-slate-700" />
              <div className="flex flex-col items-center">
                <span className="text-[9px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800 mb-1">
                  True (&le;)
                </span>
                {renderNodeHierarchy(node.left, depth + 1, 'Left Child')}
              </div>
              <div className="flex flex-col items-center">
                <span className="text-[9px] font-mono text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 px-1.5 py-0.5 rounded border border-rose-200 dark:border-rose-800 mb-1">
                  False (&gt;)
                </span>
                {renderNodeHierarchy(node.right, depth + 1, 'Right Child')}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            <GitBranch className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>White-Box Tree Interpretability</span>
            <span aria-hidden="true">·</span>
            <span>CART Recursive Partitioning</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
            Decision Tree Graph &amp; Rule Hierarchy
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
            Trained with Gini Impurity reduction. Observe how node 0 isolates Setosa with 100% purity, while subsequent branches separate Versicolor and Virginica.
          </p>
        </div>

        <div className="text-xs text-slate-500 font-mono">
          Max Depth Limit: {dtModel.maxDepth} levels
        </div>
      </div>

      {/* Tree Diagram Container */}
      <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-6 overflow-x-auto shadow-inner flex justify-center min-h-[380px]">
        {renderNodeHierarchy(dtModel.root)}
      </div>

      {/* Selected Node Details & Explanation */}
      {selectedNode && (
        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
              <Info className="w-4 h-4 text-emerald-600" />
              <span>Node Inspector Details</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              Node ID: {selectedNode.id}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 text-xs">
            <div className="bg-slate-50 dark:bg-slate-800/40 p-3 rounded-lg">
              <div className="text-slate-500 text-[11px] uppercase">Decision Test</div>
              <div className="font-mono font-bold text-slate-900 dark:text-white mt-1">
                {selectedNode.isLeaf
                  ? 'Leaf Node (Terminal)'
                  : `${selectedNode.featureName} <= ${selectedNode.threshold} cm`}
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/40 p-3 rounded-lg">
              <div className="text-slate-500 text-[11px] uppercase">Gini Impurity</div>
              <div className="font-mono font-bold text-slate-900 dark:text-white mt-1">
                {selectedNode.gini.toFixed(4)}{' '}
                <span className="text-[11px] text-slate-400 font-normal">
                  ({selectedNode.gini === 0 ? 'Pure Leaf' : 'Impure'})
                </span>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/40 p-3 rounded-lg">
              <div className="text-slate-500 text-[11px] uppercase">Class Distribution</div>
              <div className="font-mono text-slate-900 dark:text-white mt-1 space-y-0.5">
                {SPECIES_DETAILS.map((sp) => (
                  <div key={sp.id} className="flex justify-between text-[11px]">
                    <span className="text-slate-500">{sp.displayName}:</span>
                    <span className="font-semibold">{selectedNode.classCounts[sp.id]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
