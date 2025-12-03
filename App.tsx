import React, { useState, useMemo } from 'react';
import { MOCK_RESOURCES, MOCK_CONCEPT_MAP, USER_STATS } from './services/mockData';
import { fetchResourcesForTopic } from './services/geminiService';
import { LearningResource } from './types';
import ResourceCard from './components/ResourceCard';
import ChatInterface from './components/ChatInterface';
import ConceptMap from './components/ConceptMap';
import StatsDashboard from './components/StatsDashboard';
import ResourceViewerModal from './components/ResourceViewerModal';
import { 
  Search, Layout, BookOpen, MessageSquare, 
  Bookmark, User, Zap, Filter, Compass, Loader2
} from 'lucide-react';

// Navigation items
const TABS = [
  { id: 'home', label: 'Home', icon: Search },
  { id: 'explore', label: 'Explore Topics', icon: Compass },
  { id: 'workspace', label: 'Workspace', icon: Layout },
  { id: 'chat', label: 'AI Tutor', icon: MessageSquare },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTopic, setActiveTopic] = useState('Machine Learning');
  
  // Resource State
  const [resources, setResources] = useState<LearningResource[]>(MOCK_RESOURCES);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedResource, setSelectedResource] = useState<LearningResource | null>(null);

  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<string>('All');

  // Filter Logic (Client-side filtering of the fetched results)
  const filteredResources = useMemo(() => {
    return resources.filter(res => {
      // We don't filter by query here anymore because the query fetches new data
      // But we keep tag filtering just in case the user wants to narrow down the AI results
      const matchesDiff = selectedDifficulty === 'All' || res.difficulty === selectedDifficulty;
      const matchesType = selectedType === 'All' || res.type === selectedType;
      return matchesDiff && matchesType;
    });
  }, [resources, selectedDifficulty, selectedType]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    setActiveTopic(searchQuery); // Switch context for Chat/Insight
    
    try {
      const newResources = await fetchResourcesForTopic(searchQuery);
      setResources(newResources);
    } catch (error) {
      console.error("Search failed", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Main Content Renderer
  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="animate-fade-in space-y-8 pb-20">
            {/* Hero Section */}
            <div className="text-center py-16 px-4 bg-gradient-to-b from-blue-50/50 to-transparent rounded-3xl mb-8 border border-white/50 shadow-sm transition-all duration-500">
              <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
                Your AI Learning Companion
              </h1>
              <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                Search once. Learn smarter. Let AI aggregate, filter, and summarize the world's best educational content for you.
              </p>
              
              <div className="max-w-xl mx-auto relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  {isSearching ? (
                    <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
                  ) : (
                    <Search className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                  )}
                </div>
                <input
                  type="text"
                  className="block w-full pl-11 pr-24 py-4 bg-white border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 shadow-xl shadow-blue-500/5 transition-all"
                  placeholder="Search any topic — e.g., Machine Learning, Quantum Physics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isSearching}
                />
                <div className="absolute inset-y-0 right-2 flex items-center">
                   <button 
                    onClick={handleSearch}
                    disabled={isSearching || !searchQuery.trim()}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                   >
                     {isSearching ? 'Searching...' : 'Search'}
                   </button>
                </div>
              </div>
            </div>

            {/* Results Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 px-4 md:px-8">
              {/* Left Sidebar Filters */}
              <div className="lg:col-span-3 space-y-6">
                 <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm sticky top-24">
                    <div className="flex items-center gap-2 mb-4 font-semibold text-slate-800">
                      <Filter size={18} /> Filters
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-semibold text-slate-500 uppercase mb-2 block">Difficulty</label>
                        <div className="space-y-2">
                          {['All', 'Beginner', 'Intermediate', 'Advanced'].map(d => (
                            <label key={d} className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer hover:text-blue-600">
                              <input 
                                type="radio" 
                                name="difficulty" 
                                checked={selectedDifficulty === d}
                                onChange={() => setSelectedDifficulty(d)}
                                className="accent-blue-600"
                              /> {d}
                            </label>
                          ))}
                        </div>
                      </div>
                      
                      <div className="h-px bg-slate-100" />

                      <div>
                        <label className="text-xs font-semibold text-slate-500 uppercase mb-2 block">Format</label>
                        <div className="space-y-2">
                          {['All', 'video', 'article', 'pdf'].map(t => (
                            <label key={t} className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer hover:text-blue-600 capitalize">
                              <input 
                                type="radio" 
                                name="type" 
                                checked={selectedType === t}
                                onChange={() => setSelectedType(t)}
                                className="accent-blue-600"
                              /> {t}
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                 </div>

                 {/* Dynamic AI Insight */}
                 <div className="bg-indigo-600 p-5 rounded-xl shadow-lg text-white relative overflow-hidden transition-all duration-500">
                    <div className="relative z-10">
                       <h4 className="font-bold flex items-center gap-2 mb-2">
                         <Zap size={16} className="text-yellow-300" /> AI Insight
                       </h4>
                       <p className="text-sm text-indigo-100 leading-relaxed">
                         Topic: <b>{activeTopic}</b>.<br/>
                         We've aggregated {resources.length} high-quality resources. Start with the "Beginner" videos to build a strong foundation.
                       </p>
                    </div>
                    <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
                 </div>
              </div>

              {/* Main Feed */}
              <div className="lg:col-span-9">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-slate-800">
                    {isSearching ? `Searching for "${searchQuery}"...` : `Results for "${activeTopic}"`}
                  </h2>
                  {!isSearching && (
                    <span className="text-sm text-slate-500">Sorted by <span className="font-semibold text-slate-800">AI Relevance</span></span>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {isSearching ? (
                    // Skeleton Loading State
                    Array(6).fill(0).map((_, i) => (
                      <div key={i} className="bg-white rounded-xl border border-slate-100 h-[300px] p-5 flex flex-col gap-4 animate-pulse">
                         <div className="flex justify-between">
                            <div className="w-8 h-8 bg-slate-100 rounded-lg"></div>
                            <div className="w-16 h-4 bg-slate-100 rounded-full"></div>
                         </div>
                         <div className="w-3/4 h-6 bg-slate-100 rounded mb-2"></div>
                         <div className="w-1/2 h-4 bg-slate-100 rounded mb-4"></div>
                         <div className="flex-1 bg-slate-50 rounded-lg border border-slate-100/50"></div>
                         <div className="w-full h-8 bg-slate-100 rounded"></div>
                      </div>
                    ))
                  ) : filteredResources.length > 0 ? (
                    filteredResources.map(res => (
                      <ResourceCard 
                        key={res.id} 
                        resource={res} 
                        onViewDetails={setSelectedResource}
                      />
                    ))
                  ) : (
                    <div className="col-span-full py-20 text-center text-slate-400 bg-white rounded-xl border border-slate-100 border-dashed">
                       <Search size={48} className="mx-auto mb-4 text-slate-200" />
                       <p className="text-lg font-medium text-slate-600">No resources found.</p>
                       <p className="text-sm">Try adjusting your filters or search for a different topic.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case 'explore':
        return (
          <div className="animate-fade-in grid grid-cols-1 lg:grid-cols-3 gap-8 px-4 py-8 h-[calc(100vh-100px)]">
            <div className="lg:col-span-2 h-full flex flex-col">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Interactive Concept Map</h2>
              <div className="flex-1 min-h-0">
                <ConceptMap data={MOCK_CONCEPT_MAP} />
              </div>
            </div>
            <div className="space-y-6">
               <h2 className="text-2xl font-bold text-slate-900">Topic Overview</h2>
               <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                  <h3 className="font-bold text-lg mb-2 text-blue-900">{activeTopic}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-4">
                    Current Focus: <b>{activeTopic}</b>. <br/>
                    Explore the generated knowledge graph to understand prerequisites and sub-domains related to this subject.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-slate-100 rounded-full text-xs font-medium text-slate-600">Fundamentals</span>
                    <span className="px-3 py-1 bg-slate-100 rounded-full text-xs font-medium text-slate-600">Theory</span>
                    <span className="px-3 py-1 bg-slate-100 rounded-full text-xs font-medium text-slate-600">Practice</span>
                  </div>
               </div>
               <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100">
                  <h4 className="font-semibold text-indigo-900 mb-2">Recommended Path</h4>
                  <ul className="space-y-2 text-sm text-indigo-800">
                    <li className="flex items-center gap-2">1. Start with Beginner Videos</li>
                    <li className="flex items-center gap-2">2. Read Core Concepts PDF</li>
                    <li className="flex items-center gap-2">3. Practice with AI Tutor</li>
                  </ul>
               </div>
            </div>
          </div>
        );

      case 'workspace':
        return (
           <div className="animate-fade-in px-4 py-8 max-w-7xl mx-auto">
              <div className="flex justify-between items-end mb-8">
                 <div>
                    <h1 className="text-3xl font-bold text-slate-900">My Workspace</h1>
                    <p className="text-slate-500 mt-1">Track your progress and manage saved sessions.</p>
                 </div>
                 <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm">
                    + New Session
                 </button>
              </div>
              <StatsDashboard stats={USER_STATS} />
              
              <div className="mt-12">
                <h3 className="font-bold text-xl text-slate-900 mb-6">Continue Learning</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                   {MOCK_RESOURCES.slice(0,3).map(res => (
                      <div key={res.id} className="relative opacity-75 hover:opacity-100 transition-opacity">
                        <div className="absolute top-3 left-3 bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded">IN PROGRESS</div>
                        <ResourceCard resource={res} onViewDetails={setSelectedResource} />
                        <div className="mt-2 h-1 w-full bg-slate-200 rounded-full overflow-hidden">
                           <div className="h-full bg-blue-500 w-2/3"></div>
                        </div>
                      </div>
                   ))}
                </div>
              </div>
           </div>
        );

      case 'chat':
        return (
          <div className="animate-fade-in px-4 py-8 max-w-4xl mx-auto h-[calc(100vh-80px)]">
             <div className="mb-6 text-center">
               <h1 className="text-2xl font-bold text-slate-900">AI Personal Tutor</h1>
               <p className="text-slate-500 text-sm">Focusing on: <span className="font-semibold text-blue-600">{activeTopic}</span></p>
             </div>
             <ChatInterface topic={activeTopic} />
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Top Navigation */}
      <nav className="sticky top-0 z-50 glass border-b border-white/20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('home')}>
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                C
              </div>
              <span className="font-bold text-xl tracking-tight text-slate-900">Cognos<span className="text-blue-600">.ai</span></span>
            </div>
            
            <div className="hidden md:flex items-center space-x-1">
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    activeTab === tab.id 
                      ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/10' 
                      : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <tab.icon size={18} />
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <button className="text-slate-400 hover:text-slate-600">
                <Bookmark size={20} />
              </button>
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 p-[2px]">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                  <User size={16} className="text-slate-700" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto pt-6">
        {renderContent()}
      </main>

      {/* Resource Modal */}
      {selectedResource && (
        <ResourceViewerModal 
          resource={selectedResource} 
          onClose={() => setSelectedResource(null)} 
        />
      )}
      
      {/* Mobile Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-6 py-3 flex justify-between items-center z-50">
        {TABS.map(tab => (
           <button
             key={tab.id}
             onClick={() => setActiveTab(tab.id)}
             className={`flex flex-col items-center gap-1 ${activeTab === tab.id ? 'text-blue-600' : 'text-slate-400'}`}
           >
             <tab.icon size={20} />
             <span className="text-[10px] font-medium">{tab.label}</span>
           </button>
        ))}
      </div>
    </div>
  );
}