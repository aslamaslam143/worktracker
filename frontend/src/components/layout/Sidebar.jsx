// import React, { useState, useEffect } from 'react';
// import { NavLink, useNavigate } from 'react-router-dom';
// import { UserButton, useUser, useAuth } from '@clerk/clerk-react';
// import { 
//   LayoutDashboard, 
//   CheckSquare, 
//   Calendar as CalendarIcon, 
//   FileBarChart, 
//   Sheet, 
//   PlusCircle, 
//   Trash2,
//   X 
// } from 'lucide-react';
// import toast from 'react-hot-toast';
// import api from '../../services/api';
// import ConfirmModal from '../common/ConfirmModal';

// const navItems = [
//   { name: 'Dashboard', path: '/', icon: LayoutDashboard },
//   { name: 'My Tasks', path: '/tasks', icon: CheckSquare },
//   { name: 'Calendar', path: '/calendar', icon: CalendarIcon },
//   { name: 'Monthly Reports', path: '/reports', icon: FileBarChart },
//   { name: 'Google Sheets', path: '/google-sheets', icon: Sheet },
// ];

// const COLORS = ['bg-blue-500', 'bg-emerald-500', 'bg-amber-500', 'bg-purple-500', 'bg-pink-500', 'bg-indigo-500'];

// export default function Sidebar({ onCloseMobile, onOpenAddTask }) {
//   const { user } = useUser();
//   const { isLoaded, isSignedIn } = useAuth();
//   const navigate = useNavigate();
//   const [projects, setProjects] = useState([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [newProjectName, setNewProjectName] = useState('');
//   const [selectedColor, setSelectedColor] = useState(COLORS[0]);

//   // Project Delete Confirmation States
//   const [deleteModalOpen, setDeleteModalOpen] = useState(false);
//   const [projectToDelete, setProjectToDelete] = useState(null);
//   const [deleteLoading, setDeleteLoading] = useState(false);

//   useEffect(() => {
//     if (isLoaded && isSignedIn) {
//       fetchProjects();
//     }
//   }, [isLoaded, isSignedIn]);

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
//       toast.success('Project created successfully!');
//     } catch {
//       setProjects((prev) => [...prev, { name: newProjectName.trim(), color: selectedColor }]);
//       toast.success('Project added locally');
//     }
//     setNewProjectName('');
//     setIsModalOpen(false);
//   };

//   const handleOpenDeleteProject = (e, project) => {
//     e.stopPropagation();
//     setProjectToDelete(project);
//     setDeleteModalOpen(true);
//   };

//   const handleConfirmDeleteProject = async () => {
//     if (!projectToDelete) return;
//     try {
//       setDeleteLoading(true);
//       if (projectToDelete.id) {
//         await api.delete(`/projects/${projectToDelete.id}/`);
//       }
//       setProjects((prev) => prev.filter((p) => (p.id ? p.id !== projectToDelete.id : p.name !== projectToDelete.name)));
//       toast.success(`Project "${projectToDelete.name}" deleted successfully!`);
//       setDeleteModalOpen(false);
//       setProjectToDelete(null);
//       navigate('/');
//     } catch (err) {
//       console.error(err);
//       toast.error('Failed to delete project.');
//     } finally {
//       setDeleteLoading(false);
//     }
//   };

//   const handleNavClick = () => {
//     if (onCloseMobile) onCloseMobile();
//   };

//   const handleProjectClick = (projectName) => {
//     navigate(`/projects/${encodeURIComponent(projectName)}`);
//     if (onCloseMobile) onCloseMobile();
//   };

//   return (
//     <aside className="w-64 h-full bg-white dark:bg-[#141822] border-r border-gray-200 dark:border-[#242A38] flex flex-col justify-between shrink-0 transition-colors duration-200 shadow-xl lg:shadow-none">
//       <div>
//         {/* Header */}
//         <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200 dark:border-[#242A38]">
//           <div className="flex items-center gap-3">
//             <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/30">
//               W
//             </div>
//             <div>
//               <h1 className="font-bold text-gray-900 dark:text-white text-base tracking-wide">WorkTracker</h1>
//               <p className="text-[11px] text-gray-500 dark:text-gray-400">Track • Plan • Grow</p>
//             </div>
//           </div>

//           <button
//             type="button"
//             onClick={onCloseMobile}
//             className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-white lg:hidden cursor-pointer"
//             aria-label="Close sidebar"
//           >
//             <X size={20} />
//           </button>
//         </div>

//         {/* Navigation items */}
//         <nav className="p-4 space-y-1.5">
//           {navItems.map((item) => {
//             const Icon = item.icon;
//             return (
//               <NavLink
//                 key={item.path}
//                 to={item.path}
//                 onClick={handleNavClick}
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

//         {/* Projects Section */}
//         <div className="px-5 mt-4 sm:mt-6">
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

//           <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400 max-h-40 sm:max-h-48 overflow-y-auto">
//             {projects.map((proj, idx) => (
//               <div
//                 key={proj.id || idx}
//                 onClick={() => handleProjectClick(proj.name)}
//                 className="group flex items-center justify-between px-2 py-1.5 rounded hover:bg-gray-100 dark:hover:bg-[#1C2230] cursor-pointer transition-colors"
//               >
//                 <div className="flex items-center gap-2 overflow-hidden">
//                   <span className={`h-2.5 w-2.5 rounded-full shrink-0 ${proj.color || 'bg-blue-500'}`}></span>
//                   <span className="truncate hover:text-gray-900 dark:hover:text-white font-medium">{proj.name}</span>
//                 </div>

//                 {/* Project Delete Button (Disel hover kelyanantar) */}
//                 <button
//                   type="button"
//                   onClick={(e) => handleOpenDeleteProject(e, proj)}
//                   className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition rounded"
//                   title="Delete Project"
//                 >
//                   <Trash2 size={13} />
//                 </button>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* User Info Footer */}
//       <div className="p-4 border-t border-gray-200 dark:border-[#242A38] flex items-center justify-between">
//         <div className="flex items-center gap-3 overflow-hidden">
//           <UserButton afterSignOutUrl="/sign-in" />
//           <div className="overflow-hidden">
//             <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user?.fullName || user?.firstName || 'User'}</p>
//             <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.primaryEmailAddress?.emailAddress}</p>
//           </div>
//         </div>
//       </div>

//       {/* Create Project Modal (Clean English) */}
//       {isModalOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
//           <div className="bg-white dark:bg-[#181C24] border border-gray-200 dark:border-[#282F3E] rounded-xl w-full max-w-sm p-5 shadow-2xl">
//             <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-[#282F3E]">
//               <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Create New Project</h3>
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

//       {/* Project Delete Confirmation Modal */}
//       <ConfirmModal
//         isOpen={deleteModalOpen}
//         title="Delete project?"
//         description={`This will permanently delete the project "${projectToDelete?.name}". All tasks mapped under this project will also be affected. This action cannot be undone.`}
//         confirmText="Delete project"
//         cancelText="Cancel"
//         loading={deleteLoading}
//         onConfirm={handleConfirmDeleteProject}
//         onClose={() => {
//           setDeleteModalOpen(false);
//           setProjectToDelete(null);
//         }}
//       />
//     </aside>
//   );
// }

import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { UserButton, useUser, useAuth } from '@clerk/clerk-react';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Calendar as CalendarIcon, 
  FileBarChart, 
  Sheet, 
  PlusCircle, 
  Edit2,
  Trash2,
  X 
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import ConfirmModal from '../common/ConfirmModal';

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
  const { isLoaded, isSignedIn } = useAuth();
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  
  // Create Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newSelectedColor, setNewSelectedColor] = useState(COLORS[0]);

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState(null);
  const [editName, setEditName] = useState('');
  const [editColor, setEditColor] = useState(COLORS[0]);
  const [editLoading, setEditLoading] = useState(false);

  // Delete Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      fetchProjects();
    }
  }, [isLoaded, isSignedIn]);

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

  // Create Project
  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;

    try {
      const res = await api.post('/projects/', {
        name: newProjectName.trim(),
        color: newSelectedColor
      });
      setProjects((prev) => [...prev, res.data]);
      toast.success('Project created successfully!');
    } catch {
      setProjects((prev) => [...prev, { name: newProjectName.trim(), color: newSelectedColor }]);
      toast.success('Project added locally');
    }
    setNewProjectName('');
    setIsCreateModalOpen(false);
  };

  // Open Edit Modal
  const handleOpenEdit = (e, project) => {
    e.stopPropagation();
    setProjectToEdit(project);
    setEditName(project.name);
    setEditColor(project.color || COLORS[0]);
    setIsEditModalOpen(true);
  };

  // Submit Edit Project
  const handleUpdateProject = async (e) => {
    e.preventDefault();
    if (!editName.trim() || !projectToEdit) return;

    try {
      setEditLoading(true);
      if (projectToEdit.id) {
        await api.patch(`/projects/${projectToEdit.id}/`, {
          name: editName.trim(),
          color: editColor
        });
      }
      setProjects((prev) =>
        prev.map((p) =>
          (p.id && p.id === projectToEdit.id) || p.name === projectToEdit.name
            ? { ...p, name: editName.trim(), color: editColor }
            : p
        )
      );
      toast.success('Project updated successfully!');
      setIsEditModalOpen(false);
      setProjectToEdit(null);
    } catch (err) {
      console.error(err);
      toast.error('Failed to update project.');
    } finally {
      setEditLoading(false);
    }
  };

  // Open Delete Modal
  const handleOpenDelete = (e, project) => {
    e.stopPropagation();
    setProjectToDelete(project);
    setDeleteModalOpen(true);
  };

  // Submit Delete Project
  const handleConfirmDelete = async () => {
    if (!projectToDelete) return;
    try {
      setDeleteLoading(true);
      if (projectToDelete.id) {
        await api.delete(`/projects/${projectToDelete.id}/`);
      }
      setProjects((prev) =>
        prev.filter((p) => (p.id ? p.id !== projectToDelete.id : p.name !== projectToDelete.name))
      );
      toast.success(`Project "${projectToDelete.name}" deleted!`);
      setDeleteModalOpen(false);
      setProjectToDelete(null);
      navigate('/');
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete project.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleNavClick = () => {
    if (onCloseMobile) onCloseMobile();
  };

  const handleProjectClick = (projectName) => {
    navigate(`/projects/${encodeURIComponent(projectName)}`);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <aside className="w-64 h-full bg-white dark:bg-[#141822] border-r border-gray-200 dark:border-[#242A38] flex flex-col justify-between shrink-0 transition-colors duration-200 shadow-xl lg:shadow-none">
      <div>
        {/* Header */}
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

          <button
            type="button"
            onClick={onCloseMobile}
            className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-white lg:hidden cursor-pointer"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Items */}
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

        {/* Projects Section */}
        <div className="px-5 mt-4 sm:mt-6">
          <div className="flex items-center justify-between text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
            <span>Projects</span>
            <button
              onClick={() => setIsCreateModalOpen(true)}
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
                className="group flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-[#1C2230] cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  <span className={`h-2.5 w-2.5 rounded-full shrink-0 ${proj.color || 'bg-blue-500'}`}></span>
                  <span className="truncate hover:text-gray-900 dark:hover:text-white font-medium">{proj.name}</span>
                </div>

                {/* Hover Action Buttons: Edit & Delete */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={(e) => handleOpenEdit(e, proj)}
                    className="p-1 text-gray-400 hover:text-blue-400 hover:bg-[#282F3E] rounded transition"
                    title="Edit Project"
                  >
                    <Edit2 size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => handleOpenDelete(e, proj)}
                    className="p-1 text-gray-400 hover:text-red-400 hover:bg-[#282F3E] rounded transition"
                    title="Delete Project"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* User Info Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-[#242A38] flex items-center justify-between">
        <div className="flex items-center gap-3 overflow-hidden">
          <UserButton afterSignOutUrl="/sign-in" />
          <div className="overflow-hidden">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user?.fullName || user?.firstName || 'User'}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.primaryEmailAddress?.emailAddress}</p>
          </div>
        </div>
      </div>

      {/* CREATE PROJECT MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#181C24] border border-gray-200 dark:border-[#282F3E] rounded-2xl w-full max-w-sm p-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-[#282F3E]">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Create New Project</h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-white cursor-pointer">
                <X size={16} />
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
                  className="w-full bg-gray-50 dark:bg-[#10131A] border border-gray-300 dark:border-[#282F3E] rounded-xl px-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1.5">Badge Color</label>
                <div className="flex items-center gap-2">
                  {COLORS.map((col) => (
                    <button
                      key={col}
                      type="button"
                      onClick={() => setNewSelectedColor(col)}
                      className={`h-6 w-6 rounded-full cursor-pointer ${col} ${newSelectedColor === col ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`}
                    />
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-xl bg-gray-200 dark:bg-[#282F3E] text-gray-700 dark:text-gray-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium cursor-pointer shadow-sm"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT PROJECT MODAL */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#181C24] border border-gray-200 dark:border-[#282F3E] rounded-2xl w-full max-w-sm p-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-[#282F3E]">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Edit Project</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-white cursor-pointer">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleUpdateProject} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1.5">Project Name</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-[#10131A] border border-gray-300 dark:border-[#282F3E] rounded-xl px-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1.5">Badge Color</label>
                <div className="flex items-center gap-2">
                  {COLORS.map((col) => (
                    <button
                      key={col}
                      type="button"
                      onClick={() => setEditColor(col)}
                      className={`h-6 w-6 rounded-full cursor-pointer ${col} ${editColor === col ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`}
                    />
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-xl bg-gray-200 dark:bg-[#282F3E] text-gray-700 dark:text-gray-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editLoading}
                  className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium cursor-pointer shadow-sm disabled:opacity-50"
                >
                  {editLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE PROJECT CONFIRMATION MODAL */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Delete project?"
        description={`This will permanently delete "${projectToDelete?.name}". All tasks mapped under this project will also be removed. This cannot be undone.`}
        confirmText="Delete project"
        cancelText="Cancel"
        loading={deleteLoading}
        onConfirm={handleConfirmDelete}
        onClose={() => {
          setDeleteModalOpen(false);
          setProjectToDelete(null);
        }}
      />
    </aside>
  );
}