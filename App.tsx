
import React, { useState, useCallback, useRef } from 'react';
import { generateYouTubeTags } from './services/geminiService';
import { TagBadge } from './components/TagBadge';
import { StatsBoard } from './components/StatsBoard';

const App: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');
  const [error, setError] = useState<string | null>(null);
  
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setIsGenerating(true);
    setError(null);
    setTags([]);

    try {
      const generatedTags = await generateYouTubeTags(topic);
      setTags(generatedTags);
      
      // Smooth scroll to results
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err: any) {
      setError(err.message || 'Failed to generate tags. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = useCallback(() => {
    if (tags.length === 0) return;
    const tagString = tags.join(', ');
    navigator.clipboard.writeText(tagString);
    setCopyStatus('copied');
    setTimeout(() => setCopyStatus('idle'), 2000);
  }, [tags]);

  const removeTag = (indexToRemove: number) => {
    setTags(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const downloadCSV = () => {
    if (tags.length === 0) return;
    const blob = new Blob([tags.join(',')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `youtube-tags-${topic.toLowerCase().replace(/\s+/g, '-')}.csv`;
    a.click();
  };

  return (
    <div className="min-h-screen pb-20 selection:bg-red-500/30">
      {/* Header / Hero Section */}
      <header className="relative py-16 px-4 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-red-600/10 blur-[120px] rounded-full -z-10"></div>
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-red-500/10 border border-red-500/20 rounded-full text-red-500 text-sm font-semibold mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/></svg>
            KEYWORD MASTER
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
            Go Viral with <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-rose-400">Smart Tags</span>
          </h1>
          <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto">
            Generate 100 high-traffic, SEO-optimized keywords for your YouTube videos in seconds using our professional AI model.
          </p>

          <form onSubmit={handleGenerate} className="relative max-w-2xl mx-auto mt-10">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter your video topic (e.g., Tesla Model 3 Review)"
              className="w-full h-16 pl-6 pr-40 bg-zinc-900 border border-zinc-800 rounded-2xl text-lg focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all shadow-2xl"
              required
            />
            <button
              type="submit"
              disabled={isGenerating}
              className="absolute right-2 top-2 bottom-2 px-8 bg-red-600 hover:bg-red-500 disabled:bg-zinc-800 disabled:text-zinc-500 rounded-xl font-bold transition-all flex items-center gap-2"
            >
              {isGenerating ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : 'Generate'}
            </button>
          </form>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-5xl mx-auto px-4 space-y-12">
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            {error}
          </div>
        )}

        <div ref={resultsRef} className="space-y-8">
          {/* Stats Section */}
          <StatsBoard tags={tags} />

          {/* Tags Display */}
          {tags.length > 0 && (
            <div className="glass-panel p-8 rounded-3xl space-y-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-zinc-800 pb-6">
                <div>
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <span className="youtube-bg-red p-1.5 rounded-lg">
                       <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="white" stroke="none"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.42a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.42 8.6.42 8.6.42s6.88 0 8.6-.42a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="#FF0000"/></svg>
                    </span>
                    Results for "{topic}"
                  </h2>
                  <p className="text-zinc-500 mt-1">Found {tags.length} high-potential keywords</p>
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={copyToClipboard}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all ${
                      copyStatus === 'copied' 
                      ? 'bg-green-600 text-white' 
                      : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'
                    }`}
                  >
                    {copyStatus === 'copied' ? (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                        Copied!
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                        Copy All
                      </>
                    )}
                  </button>
                  <button 
                    onClick={downloadCSV}
                    className="flex items-center gap-2 px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl font-semibold transition-all"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                    CSV
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {tags.map((tag, index) => (
                  <TagBadge 
                    key={`${tag}-${index}`} 
                    tag={tag} 
                    onRemove={() => removeTag(index)} 
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* SEO Tips Section */}
      <section className="max-w-5xl mx-auto px-4 mt-20">
        <h2 className="text-3xl font-bold mb-8 text-center">Master YouTube SEO</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Long-Tail Strategy",
              desc: "Include tags with 3+ words. These have lower competition and higher intent, helping you rank faster.",
              icon: <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
            },
            {
              title: "Broad Keywords",
              desc: "Don't forget massive category tags. They help YouTube's algorithm understand your general niche.",
              icon: <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path></svg>
            },
            {
              title: "Viral Momentum",
              desc: "Our AI adds trending modifiers to your base topic to capture current search surges.",
              icon: <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.5-7 3 10 13 11 13 11z"></path></svg>
            }
          ].map((item, i) => (
            <div key={i} className="glass-panel p-8 rounded-3xl hover:border-zinc-500/30 transition-all group">
              <div className="mb-4 transform group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{item.title}</h3>
              <p className="text-zinc-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-20 py-10 border-t border-zinc-900 text-center text-zinc-500 text-sm">
        <p>© {new Date().getFullYear()} Keyword Master by Sagor. Optimized for Gemini AI.</p>
      </footer>
    </div>
  );
};

export default App;
