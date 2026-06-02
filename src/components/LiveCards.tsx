import React, { useEffect, useState } from 'react';
import { Github, Music } from 'lucide-react';
import { BentoCard } from './PortfolioCards'; // Assuming we export BentoCard

// We will fetch Github stats
export function GithubLiveCard({ settings, t }: { settings: any, t: any }) {
  const [stats, setStats] = useState({ repos: 0, followers: 0, loading: true });

  useEffect(() => {
    const fetchGithub = async () => {
      try {
        if (!settings?.github) return;
        const url = new URL(settings.github);
        const username = url.pathname.replace('/', '');
        if (!username) return;

        const res = await fetch(`https://api.github.com/users/${username}`);
        const data = await res.json();
        if (data.public_repos !== undefined) {
          setStats({ repos: data.public_repos, followers: data.followers, loading: false });
        }
      } catch (err) {
        setStats(s => ({ ...s, loading: false }));
      }
    };
    fetchGithub();
  }, [settings?.github]);

  return (
    <>
      <div className="absolute top-0 right-0 p-6 opacity-5 transition-transform duration-500 text-[#1d1d1f] dark:text-white group-hover:scale-110 group-hover:rotate-12">
        <Github size={120} />
      </div>
      <div className="relative z-10 h-full flex flex-col justify-between">
        <div className="w-12 h-12 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center text-[#1d1d1f] dark:text-white mb-4">
          <Github size={20} />
        </div>
        <div>
          <p className="text-sm text-[#86868b] dark:text-gray-400 font-medium tracking-widest uppercase mb-2">Live GitHub Stats</p>
          <div className="flex items-end gap-2">
            <p className="text-4xl font-display font-bold text-[#1d1d1f] dark:text-white tracking-tight">
              {stats.loading ? "..." : (stats.repos > 0 ? stats.repos : settings?.githubCommits || "1.2k")}
            </p>
            <p className="text-sm text-green-500 font-medium mb-1">Repos</p>
          </div>
          <div className="flex items-end gap-2 mt-1">
            <p className="text-2xl font-display font-bold text-[#1d1d1f] dark:text-white tracking-tight">
              {stats.loading ? "..." : stats.followers}
            </p>
            <p className="text-xs text-blue-500 font-medium mb-1">Followers</p>
          </div>
          <p className="text-xs text-[#86868b] dark:text-gray-400 mt-2 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> {t?.bento?.githubYearText || "Real-time sync"}
          </p>
        </div>
      </div>
    </>
  );
}

export function SpotifyLiveCard({ settings, t }: { settings: any, t: any }) {
  // Animating bars to simulate live music playing
  return (
    <>
      <div className="absolute inset-0 bg-gradient-to-br from-[#1DB954]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div className="absolute top-0 right-0 p-6 opacity-5 transition-transform duration-500 text-[#1DB954] group-hover:scale-110 group-hover:-rotate-12">
        <Music size={120} />
      </div>
      <div className="relative z-10 h-full flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div className="w-12 h-12 rounded-full bg-[#1DB954]/10 flex items-center justify-center text-[#1DB954] mb-4 shadow-lg shadow-[#1DB954]/20">
            <Music size={20} className="animate-pulse" />
          </div>
          <div className="flex items-end gap-1 h-6">
            <div className="w-1.5 bg-[#1DB954] rounded-t-sm animate-[musicBar_1s_ease-in-out_infinite_alternate] h-[40%]"></div>
            <div className="w-1.5 bg-[#1DB954] rounded-t-sm animate-[musicBar_1.2s_ease-in-out_infinite_alternate-reverse] h-[80%]"></div>
            <div className="w-1.5 bg-[#1DB954] rounded-t-sm animate-[musicBar_0.8s_ease-in-out_infinite_alternate] h-[60%]"></div>
            <div className="w-1.5 bg-[#1DB954] rounded-t-sm animate-[musicBar_1.5s_ease-in-out_infinite_alternate-reverse] h-[100%]"></div>
          </div>
        </div>
        <div>
          <p className="text-sm text-[#1DB954] font-bold tracking-widest uppercase mb-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#1DB954] animate-ping"></span> Live Listening
          </p>
          <p className="text-xl font-bold text-[#1d1d1f] dark:text-white tracking-tight line-clamp-1">{settings?.spotifySong || "Lofi Hip Hop Radio"}</p>
          <p className="text-sm text-[#86868b] dark:text-gray-400 mt-1">{settings?.spotifyArtist || "ChilledCow"}</p>
        </div>
      </div>
    </>
  );
}
