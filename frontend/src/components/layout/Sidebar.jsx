// import React, { useState, useEffect } from 'react';
// import { NavLink, useNavigate } from 'react-router-dom';
// import { UserButton, useUser } from '@clerk/clerk-react';
// import { 
//   LayoutDashboard, 
//   CheckSquare, 
//   Calendar as CalendarIcon, 
//   FileBarChart, 
//   Sheet, 
//   PlusCircle, 
//   X 
// } from 'lucide-react';
// import api from '../../services/api';

// const navItems = [

//   { name: 'Dashboard', path: '/', icon: LayoutDashboard },
//   { name: 'My Tasks', path: '/tasks', icon: CheckSquare },
//   { name: 'Calendar', path: '/calendar', icon: CalendarIcon },
//   { name: 'Monthly Reports', path: '/reports', icon: FileBarChart },
//   { name: 'Google Sheets', path: '/google-sheets', icon: Sheet },
// ];

// const COLORS = ['bg-blue-500', 'bg-emerald-500', 'bg-amber-500', 'bg-purple-500', 'bg-pink-500', 'bg-indigo-500'];

// export default function Sidebar({ onOpenAddTask }) {
//   const { user } = useUser();
//   const navigate = useNavigate();
//   const [projects, setProjects] = useState([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [newProjectName, setNewProjectName] = useState('');
//   const [selectedColor, setSelectedColor] = useState(COLORS[0]);

//   useEffect(() => {
//     fetchProjects();
//   }, []);

//   const fetchProjects = async () => {
//     try {
//       const res = await api.get('/projects/');
//       const data = res.data.results || res.data;
//       if (data && data.length > 0) {
//         setProjects(data);
//       } else {
//         setProjects([
//           { name: 'OpenAtlas', color: 'bg-blue-500' },
//           { name: 'AI Projects', color: 'bg-emerald-500' },
//           { name: 'College Work', color: 'bg-amber-500' }
//         ]);
//       }
//     } catch {
//       setProjects([
//         { name: 'OpenAtlas', color: 'bg-blue-500' },
//         { name: 'AI Projects', color: 'bg-emerald-500' },
//         { name: 'College Work', color: 'bg-amber-500' }
//       ]);
//     }
//   };

//   const handleCreateProject = async (e) => {
//     e.preventDefault();
//     if (!newProjectName.trim()) return;

//     try {
//       const res = await api.post('/projects/', {
//         name: newProjectName.trim(),
//         color: selectedColor
//       });
//       setProjects((prev) => [...prev, res.data]);
//     } catch {
//       setProjects((prev) => [...prev, { name: newProjectName.trim(), color: selectedColor }]);
//     }
//     setNewProjectName('');
//     setIsModalOpen(false);
//   };

//   return (
//     <aside className="w-64 bg-white dark:bg-[#141822] border-r border-gray-200 dark:border-[#242A38] flex flex-col justify-between shrink-0 transition-colors duration-200">
//       <div>
//         <div className="h-16 flex items-center px-6 gap-3 border-b border-gray-200 dark:border-[#242A38]">
//           <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/30">
//             W
//           </div>
//           <div>
//             <h1 className="font-bold text-gray-900 dark:text-white text-base tracking-wide">WorkTracker</h1>
//             <p className="text-[11px] text-gray-500 dark:text-gray-400">Track • Plan • Grow</p>
//           </div>
//         </div>

//         <nav className="p-4 space-y-1.5">
//           {navItems.map((item) => {
//             const Icon = item.icon;
//             return (
//               <NavLink
//                 key={item.path}
//                 to={item.path}
//                 className={({ isActive }) =>
//                   `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
//                     isActive
//                       ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
//                       : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#1C2230]'
//                   }`
//                 }
//               >
//                 <Icon size={18} />
//                 {item.name}
//               </NavLink>
//             );
//           })}
//         </nav>

//         {/* Projects section with add button */}
//         <div className="px-5 mt-6">
//           <div className="flex items-center justify-between text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
//             <span>Projects</span>
//             <button
//               onClick={() => setIsModalOpen(true)}
//               className="hover:text-blue-600 dark:hover:text-blue-400 transition cursor-pointer"
//               title="Add New Project"
//             >
//               <PlusCircle size={15} />
//             </button>
//           </div>

//           <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400 max-h-48 overflow-y-auto">
//             {projects.map((proj, idx) => (
//               <div
//                 key={proj.id || idx}
//                 onClick={() => navigate(`/projects/${encodeURIComponent(proj.name)}`)}
//                 className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-gray-100 dark:hover:bg-[#1C2230] cursor-pointer transition-colors"
//               >
//                 <span className={`h-2.5 w-2.5 rounded-full shrink-0 ${proj.color || 'bg-blue-500'}`}></span>
//                 <span className="truncate hover:text-gray-900 dark:hover:text-white font-medium">{proj.name}</span>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       <div className="p-4 border-t border-gray-200 dark:border-[#242A38] flex items-center justify-between">
//         <div className="flex items-center gap-3">
//           <UserButton afterSignOutUrl="/sign-in" />
//           <div className="overflow-hidden">
//             <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user?.fullName || user?.firstName || 'User'}</p>
//             <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.primaryEmailAddress?.emailAddress}</p>
//           </div>
//         </div>
//       </div>

//       {/* Add Project Modal */}
//       {isModalOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
//           <div className="bg-white dark:bg-[#181C24] border border-gray-200 dark:border-[#282F3E] rounded-xl w-full max-w-sm p-5 shadow-2xl">
//             <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-[#282F3E]">
//               <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Pudhu Project Create Seiyya</h3>
//               <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-white cursor-pointer">
//                 <X size={18} />
//               </button>
//             </div>

//             <form onSubmit={handleCreateProject} className="mt-4 space-y-4 text-xs">
//               <div>
//                 <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1.5">Project Name</label>
//                 <input
//                   type="text"
//                   required
//                   placeholder="e.g. Mobile App Dev"
//                   value={newProjectName}
//                   onChange={(e) => setNewProjectName(e.target.value)}
//                   className="w-full bg-gray-50 dark:bg-[#10131A] border border-gray-300 dark:border-[#282F3E] rounded-lg px-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
//                 />
//               </div>

//               <div>
//                 <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1.5">Badge Color</label>
//                 <div className="flex items-center gap-2">
//                   {COLORS.map((col) => (
//                     <button
//                       key={col}
//                       type="button"
//                       onClick={() => setSelectedColor(col)}
//                       className={`h-6 w-6 rounded-full cursor-pointer ${col} ${selectedColor === col ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`}
//                     />
//                   ))}
//                 </div>
//               </div>

//               <div className="flex justify-end gap-2 pt-2">
//                 <button
//                   type="button"
//                   onClick={() => setIsModalOpen(false)}
//                   className="px-3 py-1.5 rounded-lg bg-gray-200 dark:bg-[#282F3E] text-gray-700 dark:text-gray-300 cursor-pointer"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium cursor-pointer"
//                 >
//                   Create Project
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </aside>
//   );
// }
import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { UserButton, useUser } from '@clerk/clerk-react';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Calendar as CalendarIcon, 
  FileBarChart, 
  Sheet, 
  PlusCircle, 
  X 
} from 'lucide-react';
import api from '../../services/api';

const navItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'My Tasks', path: '/tasks', icon: CheckSquare },
  { name: 'Calendar', path: '/calendar', icon: CalendarIcon },
  { name: 'Monthly Reports', path: '/reports', icon: FileBarChart },
  { name: 'Google Sheets', path: '/google-sheets', icon: Sheet },
];

const COLORS = ['bg-blue-500', 'bg-emerald-500', 'bg-amber-500', 'bg-purple-500', 'bg-pink-500', 'bg-indigo-500'];

export default function Sidebar({ onCloseMobile, onOpenAddTask }) {
  const { user } = useUser();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await api.get('/projects/');
      const data = res.data.results || res.data;
      if (data && data.length > 0) {
        setProjects(data);
      } else {
        setProjects([
          { name: 'OpenAtlas', color: 'bg-blue-500' },
          { name: 'AI Projects', color: 'bg-emerald-500' },
          { name: 'College Work', color: 'bg-amber-500' }
        ]);
      }
    } catch {
      setProjects([
        { name: 'OpenAtlas', color: 'bg-blue-500' },
        { name: 'AI Projects', color: 'bg-emerald-500' },
        { name: 'College Work', color: 'bg-amber-500' }
      ]);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;

    try {
      const res = await api.post('/projects/', {
        name: newProjectName.trim(),
        color: selectedColor
      });
      setProjects((prev) => [...prev, res.data]);
    } catch {
      setProjects((prev) => [...prev, { name: newProjectName.trim(), color: selectedColor }]);
    }
    setNewProjectName('');
    setIsModalOpen(false);
  };

  const handleNavClick = () => {
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  const handleProjectClick = (projectName) => {
    navigate(`/projects/${encodeURIComponent(projectName)}`);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  return (
    <aside className="w-64 h-full bg-white dark:bg-[#141822] border-r border-gray-200 dark:border-[#242A38] flex flex-col justify-between shrink-0 transition-colors duration-200 shadow-xl lg:shadow-none">
      <div>
        {/* Header with Title and Mobile Close (X) button */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200 dark:border-[#242A38]">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/30">
              W
            </div>
            <div>
              <h1 className="font-bold text-gray-900 dark:text-white text-base tracking-wide">WorkTracker</h1>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">Track • Plan • Grow</p>
            </div>
          </div>

          {/* Close button - visible only on Mobile */}
          <button
            type="button"
            onClick={onCloseMobile}
            className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-white lg:hidden cursor-pointer"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation items */}
        <nav className="p-4 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={handleNavClick}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#1C2230]'
                  }`
                }
              >
                <Icon size={18} />
                {item.name}
              </NavLink>
            );
          })}
        </nav>

        {/* Projects section */}
        <div className="px-5 mt-4 sm:mt-6">
          <div className="flex items-center justify-between text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
            <span>Projects</span>
            <button
              onClick={() => setIsModalOpen(true)}
              className="hover:text-blue-600 dark:hover:text-blue-400 transition cursor-pointer"
              title="Add New Project"
            >
              <PlusCircle size={15} />
            </button>
          </div>

          <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400 max-h-40 sm:max-h-48 overflow-y-auto">
            {projects.map((proj, idx) => (
              <div
                key={proj.id || idx}
                onClick={() => handleProjectClick(proj.name)}
                className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-gray-100 dark:hover:bg-[#1C2230] cursor-pointer transition-colors"
              >
                <span className={`h-2.5 w-2.5 rounded-full shrink-0 ${proj.color || 'bg-blue-500'}`}></span>
                <span className="truncate hover:text-gray-900 dark:hover:text-white font-medium">{proj.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* User info footer */}
      <div className="p-4 border-t border-gray-200 dark:border-[#242A38] flex items-center justify-between">
        <div className="flex items-center gap-3 overflow-hidden">
          <UserButton afterSignOutUrl="/sign-in" />
          <div className="overflow-hidden">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user?.fullName || user?.firstName || 'User'}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.primaryEmailAddress?.emailAddress}</p>
          </div>
        </div>
      </div>

      {/* Add Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#181C24] border border-gray-200 dark:border-[#282F3E] rounded-xl w-full max-w-sm p-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-[#282F3E]">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Pudhu Project Create Seiyya</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-white cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1.5">Project Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mobile App Dev"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-[#10131A] border border-gray-300 dark:border-[#282F3E] rounded-lg px-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1.5">Badge Color</label>
                <div className="flex items-center gap-2">
                  {COLORS.map((col) => (
                    <button
                      key={col}
                      type="button"
                      onClick={() => setSelectedColor(col)}
                      className={`h-6 w-6 rounded-full cursor-pointer ${col} ${selectedColor === col ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`}
                    />
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg bg-gray-200 dark:bg-[#282F3E] text-gray-700 dark:text-gray-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium cursor-pointer"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </aside>
  );
}