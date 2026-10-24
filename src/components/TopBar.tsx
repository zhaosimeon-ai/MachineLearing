import React from 'react';
import { Download, Code2, Sparkles, FileCode } from 'lucide-react';

interface TopBarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onDownloadPy: () => void;
  onDownloadIpynb: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  activeTab,
  setActiveTab,
  onDownloadPy,
  onDownloadIpynb,
}) => {
  const [showExportMenu, setShowExportMenu] = React.useState(false);

  const navLinks = [
    { id: 'comparison', label: 'Comparison' },
    { id: 'boundaries', label: 'Decision Space' },
    { id: 'matrices', label: 'Confusion Matrices' },
    { id: 'tree', label: 'Tree Structure' },
    { id: 'importance', label: 'Feature Importance' },
    { id: 'dataset', label: 'Iris Data' },
    { id: 'python', label: 'Python Script' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text element wordmark */}
          <button
            onClick={() => setActiveTab('comparison')}
            className="text-lg font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap shrink-0 flex items-center gap-2 text-left"
          >
            <span>Iris ML Classifier Bench</span>
          </button>

          {/* Zone 2: Single-line text navigation links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
            {navLinks.map((link) => {
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => setActiveTab(link.id)}
                  className={`hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                    isActive
                      ? 'border-blue-600 text-slate-900 dark:text-white font-semibold'
                      : 'border-transparent text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1 primary action with export dropdown */}
          <div className="relative shrink-0 flex items-center gap-2">
            <button
              onClick={() => onDownloadPy()}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-700 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 shadow-sm"
              title="Download standalone iris_classifier_comparison.py"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download .py Script</span>
            </button>
            <button
              onClick={() => onDownloadIpynb()}
              className="hidden sm:flex px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors whitespace-nowrap shrink-0 items-center gap-1.5"
              title="Download Jupyter Notebook (.ipynb)"
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>Jupyter .ipynb</span>
            </button>
          </div>
        </div>

        {/* Mobile secondary tab strip */}
        <div className="lg:hidden flex items-center gap-2 overflow-x-auto py-2 border-t border-slate-100 dark:border-slate-800 text-xs no-scrollbar">
          {navLinks.map((link) => {
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => setActiveTab(link.id)}
                className={`px-3 py-1 rounded-md whitespace-nowrap shrink-0 font-medium transition-colors ${
                  isActive
                    ? 'bg-slate-900 text-white dark:bg-blue-600'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
