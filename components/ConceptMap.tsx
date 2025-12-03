import React, { useState } from 'react';
import { ConceptNode } from '../types';
import { ChevronRight, ChevronDown, Circle } from 'lucide-react';

interface ConceptMapProps {
  data: ConceptNode;
}

const TreeNode: React.FC<{ node: ConceptNode; depth: number }> = ({ node, depth }) => {
  const [isExpanded, setIsExpanded] = useState(node.isExpanded || false);
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className="flex flex-col select-none transition-all duration-300">
      <div 
        className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer hover:bg-blue-50 transition-colors ${depth === 0 ? 'bg-blue-100 font-semibold' : ''}`}
        style={{ marginLeft: `${depth * 20}px` }}
        onClick={() => hasChildren && setIsExpanded(!isExpanded)}
      >
        {hasChildren ? (
          isExpanded ? <ChevronDown size={16} className="text-slate-500" /> : <ChevronRight size={16} className="text-slate-500" />
        ) : (
          <Circle size={8} className="text-blue-400 ml-1" fill="currentColor" />
        )}
        <span className={`text-sm ${depth === 0 ? 'text-blue-900 text-base' : 'text-slate-700'}`}>
          {node.label}
        </span>
      </div>
      
      {isExpanded && hasChildren && (
        <div className="flex flex-col animate-slide-up origin-top">
          {node.children!.map((child) => (
            <TreeNode key={child.id} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

const ConceptMap: React.FC<ConceptMapProps> = ({ data }) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 h-full overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-slate-800 flex items-center gap-2">
           Concept Map
        </h3>
        <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">AI Generated</span>
      </div>
      <div className="relative">
        <div className="absolute left-4 top-4 bottom-4 w-px bg-slate-200 -z-10" />
        <TreeNode node={data} depth={0} />
      </div>
    </div>
  );
};

export default ConceptMap;
