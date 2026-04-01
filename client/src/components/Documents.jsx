import { useState } from 'react';
import { FileText, Download, Upload, Search, Folder, Calendar, Eye, X } from 'lucide-react';
import { API_BASE_URL } from '../services/api';

// Base URL for backend-served static documents
const DOCS_BASE = API_BASE_URL.replace('/api', '/documents');





export function Documents({ userRole }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadForm, setUploadForm] = useState({ name: '', category: '', description: '', file: null });

  const categories = [
    { id: 'all', name: 'All Documents', count: 5 },
    { id: 'bylaws', name: 'Society Bylaws', count: 1 },
    { id: 'meetings', name: 'Meeting Minutes', count: 2 },
    { id: 'financials', name: 'Financial Reports', count: 1 },
    { id: 'circulars', name: 'Circulars', count: 1 },
  ];

  const [documents, setDocuments] = useState([
    { id: 1, name: 'Society Bylaws 2026',              category: 'bylaws',      uploadedBy: 'Jayawant Gore', uploadDate: '2026-01-10', size: '2.4 MB', type: 'pdf', description: 'Updated society rules and regulations for FY 2026', fileUrl: `${DOCS_BASE}/society-bylaws-2024.pdf`,          fileName: 'society-bylaws-2024.pdf'          },
    { id: 2, name: 'Annual General Meeting Minutes',   category: 'meetings',    uploadedBy: 'Jayawant Gore', uploadDate: '2026-01-06', size: '1.8 MB', type: 'pdf', description: 'AGM held on 5 January 2026',                    fileUrl: `${DOCS_BASE}/agm-minutes-2024.pdf`,            fileName: 'agm-minutes-2024.pdf'            },
    { id: 3, name: 'Financial Report Q3 2025-26',      category: 'financials',  uploadedBy: 'Jayawant Gore', uploadDate: '2026-02-05', size: '3.2 MB', type: 'pdf', description: 'Quarterly financial statement Oct–Dec 2025',    fileUrl: `${DOCS_BASE}/financial-report-q4-2023.pdf`,   fileName: 'financial-report-q4-2023.pdf'   },
    { id: 4, name: 'Parking Rules Circular – 2026',    category: 'circulars',   uploadedBy: 'Jayawant Gore', uploadDate: '2026-03-01', size: '0.8 MB', type: 'pdf', description: 'Revised parking allocation guidelines – 2026',  fileUrl: `${DOCS_BASE}/parking-rules-circular.pdf`,     fileName: 'parking-rules-circular.pdf'     },
    { id: 5, name: 'Monthly Committee Meeting – Mar',  category: 'meetings',    uploadedBy: 'Jayawant Gore', uploadDate: '2026-03-28', size: '1.2 MB', type: 'pdf', description: 'March 2026 committee meeting minutes',          fileUrl: `${DOCS_BASE}/committee-meeting-dec-2023.pdf`, fileName: 'committee-meeting-dec-2023.pdf' },
  ]);

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadForm({ ...uploadForm, file });
    }
  };

  const handleUploadSubmit = () => {
    if (!uploadForm.name || !uploadForm.category || !uploadForm.file) {
      alert('Please fill all required fields');
      return;
    }
    
    // Create a blob URL for the uploaded file
    const fileUrl = URL.createObjectURL(uploadForm.file);
    
    const newDoc = {
      id: documents.length + 1,
      name: uploadForm.name,
      category: uploadForm.category,
      uploadedBy: 'Admin',
      uploadDate: new Date().toISOString().split('T')[0],
      size: `${(uploadForm.file.size / (1024 * 1024)).toFixed(1)} MB`,
      type: uploadForm.file.type.includes('pdf') ? 'pdf' : 'doc',
      description: uploadForm.description,
      fileUrl: fileUrl, // Store the blob URL for download
      fileName: uploadForm.file.name,
    };
    
    setDocuments([newDoc, ...documents]);
    setShowUploadModal(false);
    setUploadForm({ name: '', category: '', description: '', file: null });
  };

  const handleDownload = (doc) => {
    // Works for both newly uploaded (blob URL) and pre-existing (backend URL) docs
    const link = document.createElement('a');
    link.href = doc.fileUrl;
    link.download = doc.fileName || `${doc.name}.pdf`;
    link.target = '_blank';  // fallback: open in new tab if download blocked
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleView = (doc) => {
    // Open in a new browser tab – works for blob URLs and server-hosted files
    if (doc.fileUrl) {
      window.open(doc.fileUrl, '_blank', 'noopener,noreferrer');
    }
  };

  /** Format upload date as "15 Jan 2024" */
  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const inputStyle = {
    border: '1.5px solid rgba(186,192,149,0.5)',
    background: '#f8f9f4',
    color: '#1a1e0f',
    borderRadius: '0.75rem',
    padding: '0.625rem 0.875rem',
    width: '100%',
    outline: 'none',
    fontSize: '0.875rem',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 style={{ color: '#3D4127' }} className="mb-1">Documents &amp; Files</h1>
          <p className="text-sm" style={{ color: '#6b7155' }}>Access society documents and important files</p>
        </div>
        {userRole === 'admin' && (
          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm transition-all hover:shadow-lg hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #636B2F, #7a8338)', boxShadow: '0 2px 12px rgba(99,107,47,0.3)' }}
          >
            <Upload className="w-4 h-4" />
            Upload Document
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Categories Sidebar */}
        <div className="lg:col-span-1">
          <div
            className="bg-white rounded-xl p-4"
            style={{ border: '1px solid rgba(99,107,47,0.12)' }}
          >
            <h3 className="text-sm mb-4" style={{ color: '#3D4127' }}>Categories</h3>
            <div className="space-y-1">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all"
                  style={
                    selectedCategory === cat.id
                      ? { background: 'rgba(99,107,47,0.1)', color: '#3D4127' }
                      : { color: '#6b7155' }
                  }
                  onMouseEnter={(e) => {
                    if (selectedCategory !== cat.id)
                      (e.currentTarget).style.background = 'rgba(186,192,149,0.1)';
                  }}
                  onMouseLeave={(e) => {
                    if (selectedCategory !== cat.id)
                      (e.currentTarget).style.background = 'transparent';
                  }}
                >
                  <div className="flex items-center gap-2">
                    <Folder className="w-4 h-4" style={{ color: selectedCategory === cat.id ? '#636B2F' : '#BAC095' }} />
                    <span>{cat.name}</span>
                  </div>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{ background: 'rgba(186,192,149,0.2)', color: '#636B2F' }}
                  >
                    {cat.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Documents List */}
        <div className="lg:col-span-3 space-y-4">
          {/* Search */}
          <div className="bg-white rounded-xl p-4" style={{ border: '1px solid rgba(99,107,47,0.12)' }}>
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#BAC095' }} />
              <input
                type="text"
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none"
                style={{ border: '1.5px solid rgba(186,192,149,0.4)', background: '#f8f9f4', color: '#1a1e0f' }}
              />
            </div>
          </div>

          {/* Documents */}
          {filteredDocuments.length > 0 ? (
            <div className="space-y-3">
              {filteredDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className="bg-white rounded-xl p-5 transition-all hover:-translate-y-0.5"
                  style={{ border: '1px solid rgba(99,107,47,0.12)' }}
                  onMouseEnter={(e) => {
                    (e.currentTarget).style.boxShadow = '0 6px 20px rgba(99,107,47,0.1)';
                    (e.currentTarget).style.borderColor = 'rgba(99,107,47,0.22)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget).style.boxShadow = '';
                    (e.currentTarget).style.borderColor = 'rgba(99,107,47,0.12)';
                  }}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: 'rgba(99,107,47,0.1)' }}
                    >
                      <FileText className="w-5 h-5" style={{ color: '#636B2F' }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm mb-1 truncate" style={{ color: '#1a1e0f' }}>{doc.name}</h3>
                      {doc.description && (
                        <p className="text-xs mb-2" style={{ color: '#6b7155' }}>{doc.description}</p>
                      )}
                      <div className="flex flex-wrap items-center gap-3 text-xs" style={{ color: '#9aA278' }}>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(doc.uploadDate)}
                        </span>
                        <span>·</span>
                        <span>{doc.size}</span>
                        <span>·</span>
                        <span>By {doc.uploadedBy}</span>
                      </div>
                    </div>
                    <div className="flex gap-1.5 flex-shrink-0">
                      <button
                        onClick={() => handleView(doc)}
                        className="p-2 rounded-xl transition-all"
                        style={{ color: '#BAC095' }}
                        onMouseEnter={(e) => {
                          (e.currentTarget).style.background = 'rgba(99,107,47,0.1)';
                          (e.currentTarget).style.color = '#636B2F';
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget).style.background = 'transparent';
                          (e.currentTarget).style.color = '#BAC095';
                        }}
                        title="View document"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDownload(doc)}
                        className="p-2 rounded-xl transition-all"
                        style={{ color: '#BAC095' }}
                        onMouseEnter={(e) => {
                          (e.currentTarget).style.background = 'rgba(22,163,74,0.1)';
                          (e.currentTarget).style.color = '#16a34a';
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget).style.background = 'transparent';
                          (e.currentTarget).style.color = '#BAC095';
                        }}
                        title="Download document"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              className="bg-white rounded-xl p-16 text-center"
              style={{ border: '1px solid rgba(186,192,149,0.3)' }}
            >
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{ background: 'rgba(186,192,149,0.2)' }}
              >
                <FileText className="size-8" style={{ color: '#BAC095' }} />
              </div>
              <p style={{ color: '#6b7155' }}>No documents match your search criteria.</p>
            </div>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div
            className="bg-white rounded-2xl w-full max-w-lg shadow-2xl"
            style={{ border: '1px solid rgba(99,107,47,0.2)' }}
          >
            <div className="p-6 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(186,192,149,0.3)' }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(99,107,47,0.1)' }}>
                  <Upload className="w-5 h-5" style={{ color: '#636B2F' }} />
                </div>
                <h2 style={{ color: '#3D4127' }}>Upload Document</h2>
              </div>
              <button onClick={() => setShowUploadModal(false)} className="p-2 rounded-xl hover:bg-gray-100 transition-colors" style={{ color: '#9aA278' }}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm mb-1.5" style={{ color: '#3D4127' }}>Document Name *</label>
                <input 
                  type="text" 
                  placeholder="Enter document name" 
                  value={uploadForm.name}
                  onChange={(e) => setUploadForm({ ...uploadForm, name: e.target.value })}
                  style={inputStyle} 
                />
              </div>
              <div>
                <label className="block text-sm mb-1.5" style={{ color: '#3D4127' }}>Category *</label>
                <select 
                  value={uploadForm.category}
                  onChange={(e) => setUploadForm({ ...uploadForm, category: e.target.value })}
                  style={inputStyle}
                >
                  <option value="">Select category</option>
                  <option value="bylaws">Society Bylaws</option>
                  <option value="meetings">Meeting Minutes</option>
                  <option value="financials">Financial Reports</option>
                  <option value="circulars">Circulars</option>
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1.5" style={{ color: '#3D4127' }}>Description</label>
                <textarea 
                  placeholder="Brief description of the document" 
                  rows={3} 
                  value={uploadForm.description}
                  onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                  style={{ ...inputStyle, resize: 'vertical' }} 
                />
              </div>
              <div>
                <label className="block text-sm mb-1.5" style={{ color: '#3D4127' }}>Upload File *</label>
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  accept=".pdf,.doc,.docx,image/*"
                  onChange={handleFileChange}
                />
                <label
                  htmlFor="file-upload"
                  className="block border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all"
                  style={{ borderColor: 'rgba(186,192,149,0.5)', background: '#f8f9f4' }}
                  onMouseEnter={(e) => {
                    (e.currentTarget).style.borderColor = '#636B2F';
                    (e.currentTarget).style.background = 'rgba(99,107,47,0.03)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget).style.borderColor = 'rgba(186,192,149,0.5)';
                    (e.currentTarget).style.background = '#f8f9f4';
                  }}
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2" style={{ background: 'rgba(99,107,47,0.1)' }}>
                    <Upload className="w-5 h-5" style={{ color: '#636B2F' }} />
                  </div>
                  <p className="text-sm mb-1" style={{ color: '#3D4127' }}>
                    {uploadForm.file ? uploadForm.file.name : 'Click to upload or drag and drop'}
                  </p>
                  <p className="text-xs" style={{ color: '#9aA278' }}>PDF, DOC, or Image (Max 10MB)</p>
                </label>
              </div>
            </div>
            <div className="p-6 flex justify-end gap-3" style={{ borderTop: '1px solid rgba(186,192,149,0.3)' }}>
              <button onClick={() => setShowUploadModal(false)} className="px-4 py-2.5 rounded-xl text-sm" style={{ border: '1.5px solid rgba(186,192,149,0.5)', color: '#3D4127', background: '#f8f9f4' }}>
                Cancel
              </button>
              <button 
                onClick={handleUploadSubmit}
                className="px-5 py-2.5 rounded-xl text-white text-sm hover:shadow-lg transition-all" 
                style={{ background: 'linear-gradient(135deg, #636B2F, #7a8338)' }}
              >
                Upload Document
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
