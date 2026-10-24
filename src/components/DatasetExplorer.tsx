import React, { useState, useMemo } from 'react';
import {
  IRIS_DATA,
  IrisSample,
  SPECIES_DETAILS,
  FEATURE_NAMES,
  FEATURE_KEYS,
  computeFeatureStats,
} from '../data/irisData';
import { Search, Database, ArrowUpDown, Filter } from 'lucide-react';

export const DatasetExplorer: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [speciesFilter, setSpeciesFilter] = useState<'all' | 'setosa' | 'versicolor' | 'virginica'>('all');
  const [sortKey, setSortKey] = useState<keyof IrisSample>('id');
  const [sortAsc, setSortAsc] = useState(true);

  const stats = useMemo(() => computeFeatureStats(), []);

  const filteredData = useMemo(() => {
    return IRIS_DATA.filter((s) => {
      const matchSpecies = speciesFilter === 'all' || s.speciesName === speciesFilter;
      const matchSearch =
        searchTerm === '' ||
        s.id.toString().includes(searchTerm) ||
        s.speciesName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.sepalLength.toString().includes(searchTerm) ||
        s.petalLength.toString().includes(searchTerm);
      return matchSpecies && matchSearch;
    }).sort((a, b) => {
      const valA = a[sortKey];
      const valB = b[sortKey];
      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortAsc ? valA - valB : valB - valA;
      }
      return sortAsc
        ? String(valA).localeCompare(String(valB))
        : String(valB).localeCompare(String(valA));
    });
  }, [searchTerm, speciesFilter, sortKey, sortAsc]);

  const toggleSort = (key: keyof IrisSample) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            <Database className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Dataset Inspection (EDA)</span>
            <span aria-hidden="true">·</span>
            <span>Step 1</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
            Fisher&apos;s Iris Dataset (150 Samples)
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
            Created by Ronald Fisher in 1936. Contains 50 specimens each of Iris setosa, Iris versicolor, and Iris virginica with 4 physical measurements in centimeters.
          </p>
        </div>

        <div className="text-xs text-slate-500 font-mono">
          Showing {filteredData.length} of 150 instances
        </div>
      </div>

      {/* Feature Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {FEATURE_KEYS.map((key, idx) => {
          const s = stats[key];
          return (
            <div
              key={key}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm"
            >
              <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                {FEATURE_NAMES[idx]}
              </div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
                  {s.mean.toFixed(2)}
                </span>
                <span className="text-xs text-slate-500 font-mono">cm mean</span>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] font-mono text-slate-500">
                <div>Min: <strong className="text-slate-700 dark:text-slate-300">{s.min}</strong></div>
                <div>Max: <strong className="text-slate-700 dark:text-slate-300">{s.max}</strong></div>
                <div>Std: <strong className="text-slate-700 dark:text-slate-300">{s.std.toFixed(2)}</strong></div>
                <div>Range: <strong className="text-slate-700 dark:text-slate-300">{(s.max - s.min).toFixed(1)}</strong></div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by ID, species, feature..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
          />
        </div>

        {/* Species Filter Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs self-stretch sm:self-auto justify-center">
          {(['all', 'setosa', 'versicolor', 'virginica'] as const).map((sp) => (
            <button
              key={sp}
              onClick={() => setSpeciesFilter(sp)}
              className={`px-3 py-1 rounded-md font-medium capitalize transition-colors ${
                speciesFilter === sp
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {sp === 'all' ? 'All (150)' : `${sp} (50)`}
            </button>
          ))}
        </div>
      </div>

      {/* 150-Row Data Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto max-h-[460px]">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-50 dark:bg-slate-800/80 sticky top-0 border-b border-slate-200 dark:border-slate-800 z-10">
              <tr>
                <th
                  onClick={() => toggleSort('id')}
                  className="py-2.5 px-4 cursor-pointer hover:text-blue-600"
                >
                  <div className="flex items-center gap-1">
                    <span># ID</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort('speciesName')}
                  className="py-2.5 px-4 cursor-pointer hover:text-blue-600 font-sans"
                >
                  <div className="flex items-center gap-1">
                    <span>Species</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort('sepalLength')}
                  className="py-2.5 px-4 cursor-pointer hover:text-blue-600 text-right"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Sepal Length</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort('sepalWidth')}
                  className="py-2.5 px-4 cursor-pointer hover:text-blue-600 text-right"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Sepal Width</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort('petalLength')}
                  className="py-2.5 px-4 cursor-pointer hover:text-blue-600 text-right"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Petal Length</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort('petalWidth')}
                  className="py-2.5 px-4 cursor-pointer hover:text-blue-600 text-right"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Petal Width</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {filteredData.map((s) => {
                const spDetail = SPECIES_DETAILS[s.species];
                return (
                  <tr key={s.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                    <td className="py-2.5 px-4 font-semibold text-slate-400">#{s.id}</td>
                    <td className="py-2.5 px-4 font-sans font-medium text-slate-800 dark:text-slate-200 flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-sm shrink-0"
                        style={{ backgroundColor: spDetail.color }}
                      />
                      <span>{spDetail.displayName}</span>
                    </td>
                    <td className="py-2.5 px-4 text-right text-slate-700 dark:text-slate-300 tabular-nums">
                      {s.sepalLength.toFixed(1)} cm
                    </td>
                    <td className="py-2.5 px-4 text-right text-slate-700 dark:text-slate-300 tabular-nums">
                      {s.sepalWidth.toFixed(1)} cm
                    </td>
                    <td className="py-2.5 px-4 text-right font-medium text-slate-900 dark:text-white tabular-nums">
                      {s.petalLength.toFixed(1)} cm
                    </td>
                    <td className="py-2.5 px-4 text-right font-medium text-slate-900 dark:text-white tabular-nums">
                      {s.petalWidth.toFixed(1)} cm
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
