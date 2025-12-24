import React, { useState, useEffect, useMemo } from 'react';
import { 
  Folder, 
  FileText, 
  Image as ImageIcon, 
  File, 
  Upload, 
  FolderPlus, 
  Download, 
  ArrowLeft, 
  Home, 
  User,
  Trash2,
  FileDigit,
  Presentation,
  Loader2,
  AlertCircle
} from 'lucide-react';

// --- Firebase Imports ---
import { 
  signInAnonymously, 
  onAuthStateChanged,
  signInWithCustomToken
} from 'firebase/auth';
import { 
  collection, 
  addDoc, 
  onSnapshot, 
  doc, 
  serverTimestamp,
  query,
  where,
  getDocs,
  writeBatch
} from 'firebase/firestore';
import { auth, db, appId } from './firebase';

// --- Constants ---
// Firestore 每个文档最大 1MB，这里将单块控制在 200KB，留出字段开销
const CHUNK_SIZE = 200 * 1024; // 200KB per chunk
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB Limit

// --- Utility Functions ---
const formatBytes = (bytes, decimals = 2) => {
  if (!+bytes) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

const getFileIcon = (mimeType = '', name = '') => {
  const lowerName = name.toLowerCase();
  if (mimeType.includes('image')) return <ImageIcon className="w-8 h-8 text-purple-500" />;
  if (mimeType.includes('pdf')) return <FileText className="w-8 h-8 text-red-500" />;
  if (lowerName.endsWith('.ppt') || lowerName.endsWith('.pptx')) return <Presentation className="w-8 h-8 text-orange-500" />;
  if (lowerName.endsWith('.doc') || lowerName.endsWith('.docx')) return <FileText className="w-8 h-8 text-blue-500" />;
  return <File className="w-8 h-8 text-gray-500" />;
};

// --- Main Component ---
export default function App() {
  const [user, setUser] = useState(null);
  const [items, setItems] = useState([]);
  const [currentFolderId, setCurrentFolderId] = useState('root');
  const [folderPath, setFolderPath] = useState([{ id: 'root', name: '首页' }]);
  
  // Status States
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0); 
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadingFileId, setDownloadingFileId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Modal States
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // 1. Auth Initialization
  useEffect(() => {
    let timeoutId;
    let unsubscribe;
    let isMounted = true;
    
    const initAuth = async () => {
      try {
        // 设置超时，10秒后如果还没登录成功就显示错误
        timeoutId = setTimeout(() => {
          if (isMounted) {
            setErrorMsg("连接超时。请检查：1) Firebase 匿名登录已启用 2) 网络连接正常 3) Firestore 规则已配置");
          }
        }, 10000);

        await signInAnonymously(auth);
        console.log("匿名登录成功");
        if (isMounted) {
          clearTimeout(timeoutId);
        }
      } catch (err) {
        console.error("Auth failed:", err);
        if (isMounted) {
          clearTimeout(timeoutId);
          if (err.code === 'auth/operation-not-allowed') {
            setErrorMsg("Firebase 匿名登录未启用。请在 Firebase Console 的 Authentication 中启用 Anonymous 登录方式。");
          } else {
            setErrorMsg(`登录失败: ${err.message || err.code || '未知错误'}。请检查 Firebase 配置和网络连接。`);
          }
        }
      }
    };
    
    initAuth();
    unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        clearTimeout(timeoutId);
        console.log("用户已登录:", currentUser.uid);
      }
      if (isMounted) {
        setUser(currentUser);
      }
    });
    
    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // 2. Data Fetching
  useEffect(() => {
    if (!user) return;

    const q = collection(db, 'artifacts', appId, 'public', 'data', 'files');
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loadedItems = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      const visibleItems = loadedItems.filter(item => item.type === 'folder' || item.type === 'file');

      visibleItems.sort((a, b) => {
        if (a.type === 'folder' && b.type !== 'folder') return -1;
        if (a.type !== 'folder' && b.type === 'folder') return 1;
        return (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0);
      });
      setItems(visibleItems);
    }, (error) => {
      console.error("Data fetch error:", error);
      setErrorMsg("无法加载文件，请检查网络。");
    });

    return () => unsubscribe();
  }, [user]);

  // 3. Filter Items for Current Folder View
  const currentItems = useMemo(() => {
    return items.filter(item => item.parentId === currentFolderId);
  }, [items, currentFolderId]);

  // --- Handlers ---

  const showMessage = (msg, isError = false) => {
    if (isError) {
      setErrorMsg(msg);
      setTimeout(() => setErrorMsg(''), 4000);
    } else {
      setSuccessMsg(msg);
      setTimeout(() => setSuccessMsg(''), 3000);
    }
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;
    try {
      await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'files'), {
        name: newFolderName,
        type: 'folder',
        parentId: currentFolderId,
        ownerId: user.uid,
        createdAt: serverTimestamp()
      });
      setNewFolderName('');
      setShowNewFolderModal(false);
      showMessage("文件夹创建成功");
    } catch (err) {
      console.error(err);
      if (err.code === 'permission-denied') {
        showMessage("创建文件夹失败：Firestore 权限不足，请检查规则。", true);
      } else {
        showMessage("创建文件夹失败", true);
      }
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      showMessage(`文件过大！支持最大 10MB。\n您的文件: ${formatBytes(file.size)}`, true);
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64Full = event.target.result;
      const totalLength = base64Full.length;
      
      const chunks = [];
      for (let i = 0; i < totalLength; i += CHUNK_SIZE) {
        chunks.push(base64Full.substring(i, i + CHUNK_SIZE));
      }

      try {
        const fileDocRef = await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'files'), {
          name: file.name,
          type: 'file',
          size: file.size,
          mimeType: file.type,
          parentId: currentFolderId,
          ownerId: user.uid,
          chunkCount: chunks.length,
          createdAt: serverTimestamp()
        });

        for (let i = 0; i < chunks.length; i++) {
          await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'files'), {
            type: 'chunk',
            parentFileId: fileDocRef.id, 
            index: i,
            data: chunks[i],
            ownerId: user.uid
          });
          setUploadProgress(Math.round(((i + 1) / chunks.length) * 100));
        }

        setIsUploading(false);
        setUploadProgress(0);
        showMessage("上传成功");
        // Reset file input
        e.target.value = '';
      } catch (err) {
        console.error("Upload error:", err);
        if (err.code === 'permission-denied') {
          showMessage("上传失败：Firestore 权限不足，请检查安全规则和登录状态。", true);
        } else if (err.code === 'resource-exhausted') {
          showMessage("上传失败：单文件写入过大，请尝试更小的文件或降低分片大小。", true);
        } else {
          showMessage("上传失败，请重试。", true);
        }
        setIsUploading(false);
        setUploadProgress(0);
      }
    };

    reader.onerror = () => {
      showMessage("读取文件失败", true);
      setIsUploading(false);
      setUploadProgress(0);
    };
    reader.readAsDataURL(file);
  };

  const handleDownload = async (fileItem) => {
    if (isDownloading) return;
    setIsDownloading(true);
    setDownloadingFileId(fileItem.id);

    try {
      const q = query(
        collection(db, 'artifacts', appId, 'public', 'data', 'files'), 
        where('parentFileId', '==', fileItem.id),
        where('type', '==', 'chunk')
      );
      
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        if (fileItem.data) {
           triggerDownload(fileItem.data, fileItem.name);
        } else {
           showMessage("文件数据已丢失，无法下载。", true);
        }
        setIsDownloading(false);
        setDownloadingFileId(null);
        return;
      }

      const chunks = snapshot.docs.map(d => d.data());
      chunks.sort((a, b) => a.index - b.index);

      const fullBase64 = chunks.map(c => c.data).join('');
      if (!fullBase64) {
        showMessage("文件数据为空，无法下载。", true);
      } else {
        triggerDownload(fullBase64, fileItem.name);
        showMessage("下载成功");
      }

    } catch (err) {
      console.error("Download error:", err);
      if (err.code === 'permission-denied') {
        showMessage("下载失败：Firestore 权限不足，请检查规则。", true);
      } else {
        showMessage("下载失败，请刷新重试。", true);
      }
    } finally {
      setIsDownloading(false);
      setDownloadingFileId(null);
    }
  };

  const triggerDownload = (base64Data, fileName) => {
    const link = document.createElement("a");
    link.href = base64Data;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = async (item) => {
    // Permission check warning (optional: you can remove this if you want total freedom)
    if (item.ownerId && user && item.ownerId !== user.uid) {
       if (!confirm("这不是您的文件。确定要强制删除吗？")) return;
    } else {
       if (!confirm(`确定要删除 "${item.name}" 吗？此操作不可恢复。`)) return;
    }

    setIsDeleting(true);

    try {
      const batch = writeBatch(db);
      const collectionRef = collection(db, 'artifacts', appId, 'public', 'data', 'files');

      // 1. Delete the item itself
      const itemRef = doc(db, 'artifacts', appId, 'public', 'data', 'files', item.id);
      batch.delete(itemRef);

      // 2. If it's a file, delete all its chunks
      if (item.type === 'file') {
        const qChunks = query(collectionRef, where('parentFileId', '==', item.id));
        const chunkSnapshot = await getDocs(qChunks);
        chunkSnapshot.forEach(doc => {
          batch.delete(doc.ref);
        });
      }

      // 3. If it's a folder, delete its direct children (files/folders) 
      // Note: This is a shallow delete for one level. Deep recursive delete is complex in client-side only.
      if (item.type === 'folder') {
        const qChildren = query(collectionRef, where('parentId', '==', item.id));
        const childrenSnapshot = await getDocs(qChildren);
        
        // We need to fetch chunks for any files inside this folder too to keep DB clean
        // This simple implementation deletes the file docs, rendering chunks orphaned (which is acceptable for simple demo)
        childrenSnapshot.forEach(doc => {
          batch.delete(doc.ref);
        });
      }

      await batch.commit();
      showMessage("删除成功");

    } catch (err) {
      console.error("Delete error:", err);
      if (err.code === 'permission-denied') {
        showMessage("无法删除：权限不足。您只能删除自己上传的文件。", true);
      } else {
        showMessage("删除失败，请刷新后重试。", true);
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const navigateToFolder = (folderId, folderName) => {
    setCurrentFolderId(folderId);
    const index = folderPath.findIndex(p => p.id === folderId);
    if (index !== -1) {
      setFolderPath(folderPath.slice(0, index + 1));
    } else {
      setFolderPath([...folderPath, { id: folderId, name: folderName }]);
    }
  };

  const navigateUp = () => {
    if (folderPath.length <= 1) return;
    const parent = folderPath[folderPath.length - 2];
    navigateToFolder(parent.id, parent.name);
  };

  // --- Render ---

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50 text-gray-800">
        <div className="flex items-center mb-4 text-gray-500">
          <div className="animate-spin mr-2"><Upload size={24}/></div>
          正在连接到云盘...
        </div>
        {errorMsg && (
          <div className="max-w-md mx-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-sm">
            <div className="flex items-center mb-2">
              <AlertCircle size={20} className="mr-2" />
              <p className="font-bold">连接失败</p>
            </div>
            <p className="text-sm">{errorMsg}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
            >
              刷新页面
            </button>
          </div>
        )}
        <p className="text-xs text-gray-400 mt-4">如果长时间无法连接，请检查浏览器控制台的错误信息</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50 text-gray-800 font-sans">
      {/* Navbar */}
      <div className="bg-blue-600 text-white shadow-md p-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center space-x-2">
          <div className="bg-white p-1 rounded">
            <div className="bg-blue-600 rounded-sm p-0.5">
               <FileDigit size={20} className="text-white" />
            </div>
          </div>
          <h1 className="text-xl font-bold tracking-tight">MiniCloud</h1>
        </div>
        <div className="flex items-center space-x-4 text-sm">
          <div className="hidden md:flex items-center opacity-90">
             <User size={16} className="mr-1"/> 
             用户: {user.uid.slice(0, 6)}...
          </div>
        </div>
      </div>

      {/* Toolbar & Breadcrumbs */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
        
        {/* Breadcrumbs */}
        <div className="flex items-center overflow-x-auto whitespace-nowrap text-sm text-gray-600 no-scrollbar">
          {folderPath.length > 1 && (
            <button onClick={navigateUp} className="mr-2 hover:bg-gray-100 p-1 rounded">
              <ArrowLeft size={18} />
            </button>
          )}
          {folderPath.map((crumb, index) => (
            <div key={crumb.id} className="flex items-center">
              {index > 0 && <span className="mx-2 text-gray-400">/</span>}
              <button 
                onClick={() => navigateToFolder(crumb.id, crumb.name)}
                className={`hover:text-blue-600 font-medium px-1 rounded ${index === folderPath.length - 1 ? 'text-gray-900 font-bold' : ''}`}
              >
                {crumb.id === 'root' ? <Home size={16} /> : crumb.name}
              </button>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setShowNewFolderModal(true)}
            disabled={isDeleting}
            className="flex items-center px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm transition-colors"
          >
            <FolderPlus size={16} className="mr-2" />
            新建文件夹
          </button>
          
          <label className={`flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm cursor-pointer transition-colors shadow-sm ${isUploading || isDeleting ? 'opacity-70 cursor-not-allowed' : ''}`}>
            {isUploading ? (
              <div className="flex items-center">
                <Loader2 size={16} className="mr-2 animate-spin" />
                <span>上传中 {uploadProgress}%</span>
              </div>
            ) : (
              <>
                <div className="flex items-center">
                  <Upload size={16} className="mr-2" />
                  <span>上传文件</span>
                </div>
                <input 
                  type="file" 
                  className="hidden" 
                  onChange={handleFileUpload} 
                  disabled={isUploading || isDeleting}
                  accept=".pdf,.ppt,.pptx,.jpg,.jpeg,.png,.doc,.docx"
                />
              </>
            )}
          </label>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 relative">
        
        {/* Global Loading Overlay for Deleting */}
        {isDeleting && (
          <div className="absolute inset-0 z-20 bg-white/50 flex items-center justify-center">
            <div className="bg-black/80 text-white px-4 py-2 rounded-lg flex items-center">
              <Loader2 className="animate-spin mr-2" size={16} />
              正在删除...
            </div>
          </div>
        )}

        {errorMsg && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded shadow-sm flex justify-between items-center animate-in slide-in-from-top-2">
            <div className="flex items-center">
              <AlertCircle size={20} className="mr-2" />
              <p>{errorMsg}</p>
            </div>
            <button onClick={() => setErrorMsg('')} className="text-red-500 hover:text-red-700 font-bold">×</button>
          </div>
        )}

        {successMsg && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4 rounded shadow-sm flex justify-between items-center animate-in slide-in-from-top-2">
            <p>{successMsg}</p>
          </div>
        )}

        {/* Empty State */}
        {currentItems.length === 0 && !isUploading && (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <div className="bg-gray-100 p-6 rounded-full mb-4">
              <FolderPlus size={48} className="text-gray-300" />
            </div>
            <p className="text-lg font-medium">此文件夹为空</p>
            <p className="text-sm">点击右上角上传文件或创建文件夹</p>
          </div>
        )}

        {/* Grid Layout */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          
          {/* Folders */}
          {currentItems.filter(i => i.type === 'folder').map((item) => (
            <div 
              key={item.id}
              onClick={() => navigateToFolder(item.id, item.name)}
              className="group relative flex flex-col items-center p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-400 hover:shadow-md cursor-pointer transition-all active:scale-95"
            >
              <Folder className="w-12 h-12 text-yellow-400 mb-3 fill-current" />
              <span className="text-sm font-medium text-gray-700 text-center truncate w-full px-2">
                {item.name}
              </span>
              <span className="text-xs text-gray-400 mt-1">文件夹</span>
              
              {/* Delete Button (visible on hover) */}
              <button 
                onClick={(e) => { 
                  e.stopPropagation(); 
                  handleDelete(item); 
                }}
                className="absolute top-1 right-1 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all z-10"
                title="删除文件夹"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}

          {/* Files */}
          {currentItems.filter(i => i.type === 'file').map((item) => (
            <div 
              key={item.id}
              className="group relative flex flex-col p-4 bg-white rounded-xl border border-gray-200 hover:shadow-md transition-all"
            >
              <div className="flex justify-center mb-3">
                {getFileIcon(item.mimeType, item.name)}
              </div>
              <div className="flex-1 min-w-0 w-full">
                <p className="text-sm font-medium text-gray-700 truncate w-full text-center mb-1" title={item.name}>
                  {item.name}
                </p>
                <p className="text-xs text-gray-400 text-center">
                  {formatBytes(item.size)}
                </p>
              </div>

              {/* Action Bar */}
              <div className="mt-3 flex items-center justify-center space-x-2 pt-2 border-t border-gray-100 w-full">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownload(item);
                  }}
                  disabled={isDownloading}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors relative"
                  title="下载"
                >
                  {isDownloading && downloadingFileId === item.id ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Download size={16} />
                  )}
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(item);
                  }}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                  title="删除"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* New Folder Modal */}
      {showNewFolderModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-lg">新建文件夹</h3>
              <button onClick={() => setShowNewFolderModal(false)} className="text-gray-400 hover:text-gray-600">×</button>
            </div>
            <div className="p-4">
              <input
                autoFocus
                type="text"
                placeholder="文件夹名称"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreateFolder()}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="p-4 bg-gray-50 flex justify-end space-x-2">
              <button 
                onClick={() => setShowNewFolderModal(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg text-sm"
              >
                取消
              </button>
              <button 
                onClick={handleCreateFolder}
                className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg text-sm font-medium"
              >
                创建
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

