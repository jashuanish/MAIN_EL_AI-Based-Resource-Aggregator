import React from 'react';
import { LearningResource } from '../types';
import { Play, FileText, BookOpen, Star, Clock, ArrowRight } from 'lucide-react';

interface ResourceCardProps {
  resource: LearningResource;
  onViewDetails?: (resource: LearningResource) => void;
}

const ResourceCard: React.FC<ResourceCardProps> = ({ resource, onViewDetails }) => {
  const getIcon = () => {
    switch (resource.type) {
      case 'video': return <Play size={16} className="text-red-500" />;
      case 'pdf': return <FileText size={16} className="text-orange-500" />;
      case 'article': return <BookOpen size={16} className="text-blue-500" />;
    }
  };

  const getBadgeColor = () => {
    switch (resource.difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-700';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-700';
      case 'Advanced': return 'bg-red-100 text-red-700';
    }
  };

  const handleClick = () => {
    if (onViewDetails) {
      onViewDetails(resource);
    }
  };

  return (
    <div className="group bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-lg hover:border-blue-200 transition-all duration-300 flex flex-col h-full overflow-hidden">
      {/* Header / Type */}
      <div className="p-5 flex-1">
        <div className="flex justify-between items-start mb-3">
          <div className="flex gap-2">
            <span className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                {getIcon()}
            </span>
            <span className={`px-2 py-1 h-fit text-[10px] font-bold uppercase tracking-wider rounded-md ${getBadgeColor()}`}>
                {resource.difficulty}
            </span>
          </div>
          <div className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-full">
            <Star size={12} className="text-yellow-400 fill-current" />
            <span className="text-xs font-bold text-slate-700">{resource.qualityScore}</span>
          </div>
        </div>

        <h3 
          onClick={handleClick}
          className="font-bold text-slate-800 text-lg mb-1 leading-snug group-hover:text-blue-600 transition-colors line-clamp-2 cursor-pointer"
        >
          {resource.title}
        </h3>
        <p className="text-xs text-slate-500 mb-4 font-medium">{resource.source} • {resource.date}</p>

        {/* AI Summary Preview */}
        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100/50 mb-4">
          <div className="flex items-center gap-1.5 mb-2">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
            <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-wide">AI Summary</span>
          </div>
          <ul className="space-y-1.5">
            {resource.summary.slice(0, 2).map((point, idx) => (
              <li key={idx} className="text-xs text-slate-600 pl-2 border-l-2 border-slate-200 line-clamp-1">
                {point}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-slate-50 bg-slate-50/30 flex justify-between items-center mt-auto">
        <div className="flex items-center gap-1.5 text-slate-500 text-xs">
          <Clock size={14} />
          <span>{resource.duration}</span>
        </div>
        <button 
          onClick={handleClick}
          className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 group/btn"
        >
          Study Now
          <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default ResourceCard;