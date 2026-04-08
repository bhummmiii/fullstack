import { useState } from 'react';
import { MessageSquare, Upload, X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { toast } from 'sonner';
import { complaintsApi } from '../services/api';



export function RaiseComplaint({ currentUser, onSuccess }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState('normal');
  const [description, setDescription] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const categories = [
    { value: 'water', label: 'Water Supply & Plumbing', icon: '💧' },
    { value: 'electricity', label: 'Electricity & Power', icon: '⚡' },
    { value: 'cleanliness', label: 'Cleanliness & Hygiene', icon: '🧹' },
    { value: 'parking', label: 'Parking', icon: '🚗' },
    { value: 'security', label: 'Security', icon: '🔒' },
    { value: 'maintenance', label: 'Building Maintenance', icon: '🔧' },
    { value: 'noise', label: 'Noise Complaint', icon: '🔊' },
    { value: 'other', label: 'Other', icon: '📋' },
  ];

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => {
      const isValidSize = file.size <= 5 * 1024 * 1024;
      const isValidType = file.type.startsWith('image/');
      return isValidSize && isValidType;
    });
    if (validFiles.length !== files.length) {
      toast.error('Some files were not added. Only images under 5MB are allowed.');
    }
    setUploadedFiles(prev => [...prev, ...validFiles].slice(0, 3));
  };

  const removeFile = (index) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors= {};
    if (!title.trim()) newErrors.title = 'Please enter a complaint title';
    else if (title.length < 10) newErrors.title = 'Title should be at least 10 characters';
    if (!category) newErrors.category = 'Please select a category';
    if (!description.trim()) newErrors.description = 'Please provide a description';
    else if (description.length < 20) newErrors.description = 'Description should be at least 20 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) { toast.error('Please fix the errors in the form'); return; }
    setIsSubmitting(true);
    try {
      // Build payload
      let payload;
      if (uploadedFiles.length > 0) {
        payload = new FormData();
        payload.append('title', title);
        payload.append('category', category);
        payload.append('priority', priority === 'normal' ? 'medium' : priority);
        payload.append('description', description);
        uploadedFiles.forEach(f => payload.append('attachments', f));
      } else {
        payload = { title, category, priority: priority === 'normal' ? 'medium' : priority, description };
      }
      const res = await complaintsApi.create(payload);
      toast.success('Complaint Submitted Successfully', {
        description: `Complaint #${res.data._id.slice(-6).toUpperCase()} has been registered. We'll respond within 24–48 hours.`,
        duration: 5000,
      });
      setTitle(''); setCategory(''); setPriority('normal'); setDescription('');
      setUploadedFiles([]); setErrors({});
      onSuccess?.();
    } catch (err) {
      toast.error(err.message || 'Failed to submit complaint. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputStyle = {
    border: '1.5px solid rgba(186,192,149,0.5)',
    background: '#f8f9f4',
    color: '#1a1e0f',
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, rgba(99,107,47,0.15), rgba(186,192,149,0.2))', border: '1.5px solid rgba(99,107,47,0.2)' }}
        >
          <MessageSquare className="size-6" style={{ color: '#636B2F' }} />
        </div>
        <div>
          <h1 style={{ color: '#2c3018' }}>Raise a Complaint</h1>
          <p className="text-sm" style={{ color: '#6b7155' }}>Submit your issue and we'll address it promptly</p>
        </div>
      </div>

      {/* Info Banner */}
      <div
        className="flex items-start gap-3 p-4 rounded-xl"
        style={{ background: 'rgba(212,222,149,0.2)', border: '1px solid rgba(186,192,149,0.4)' }}
      >
        <Info className="size-5 shrink-0 mt-0.5" style={{ color: '#636B2F' }} />
        <div>
          <p className="text-sm" style={{ color: '#3D4127' }}>
            <span className="font-medium">Complaint from Flat {currentUser?.flatNumber || 'your flat'}</span>
          </p>
          <p className="text-xs mt-1" style={{ color: '#6b7155' }}>
            Our team will review your complaint and update you within 24–48 hours. For urgent issues, mark priority as "Urgent".
          </p>
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl p-8 space-y-6"
        style={{ border: '1px solid rgba(99,107,47,0.12)', boxShadow: '0 2px 12px rgba(61,65,39,0.05)' }}
      >
        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="title" style={{ color: '#3D4127' }}>
            Complaint Title <span className="text-red-500">*</span>
          </Label>
          <Input
            id="title"
            type="text"
            placeholder="e.g., Water leakage in bathroom"
            value={title}
            onChange={(e) => { setTitle(e.target.value); if (errors.title) setErrors(p => ({ ...p, title: '' })); }}
            className="h-11"
            style={{ ...inputStyle, ...(errors.title ? { borderColor: '#dc2626' } : {}) }}
            disabled={isSubmitting}
          />
          {errors.title && (
            <p className="text-xs text-red-600 flex items-center gap-1">
              <AlertCircle className="size-3" />{errors.title}
            </p>
          )}
          <p className="text-xs" style={{ color: '#9aA278' }}>Provide a clear, brief title that describes your issue</p>
        </div>

        {/* Category */}
        <div className="space-y-2">
          <Label htmlFor="category" style={{ color: '#3D4127' }}>
            Category <span className="text-red-500">*</span>
          </Label>
          <Select
            value={category}
            onValueChange={(value) => { setCategory(value); if (errors.category) setErrors(p => ({ ...p, category: '' })); }}
            disabled={isSubmitting}
          >
            <SelectTrigger
              id="category"
              className="h-11"
              style={{ ...inputStyle, ...(errors.category ? { borderColor: '#dc2626' } : {}) }}
            >
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  <span className="flex items-center gap-2">
                    <span>{cat.icon}</span>
                    <span>{cat.label}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.category && (
            <p className="text-xs text-red-600 flex items-center gap-1">
              <AlertCircle className="size-3" />{errors.category}
            </p>
          )}
        </div>

        {/* Priority */}
        <div className="space-y-3">
          <Label style={{ color: '#3D4127' }}>
            Priority <span className="text-red-500">*</span>
          </Label>
          <RadioGroup value={priority} onValueChange={setPriority} disabled={isSubmitting}>
            <div className="flex items-center gap-4">
              <label
                className="flex items-center gap-3 flex-1 px-4 py-3 rounded-xl cursor-pointer transition-all"
                style={{
                  border: priority === 'normal' ? '2px solid #636B2F' : '1.5px solid rgba(186,192,149,0.4)',
                  background: priority === 'normal' ? 'rgba(99,107,47,0.06)' : '#f8f9f4',
                }}
              >
                <RadioGroupItem value="normal" id="priority-normal" />
                <div>
                  <p className="text-sm" style={{ color: '#3D4127' }}>Normal Priority</p>
                  <p className="text-xs" style={{ color: '#9aA278' }}>Standard response time</p>
                </div>
              </label>
              <label
                className="flex items-center gap-3 flex-1 px-4 py-3 rounded-xl cursor-pointer transition-all"
                style={{
                  border: priority === 'urgent' ? '2px solid #ea580c' : '1.5px solid rgba(234,88,12,0.25)',
                  background: priority === 'urgent' ? 'rgba(234,88,12,0.06)' : '#fdf8f5',
                }}
              >
                <RadioGroupItem value="urgent" id="priority-urgent" />
                <div>
                  <p className="text-sm" style={{ color: '#ea580c' }}>Urgent Priority</p>
                  <p className="text-xs" style={{ color: '#9a6040' }}>Immediate attention needed</p>
                </div>
              </label>
            </div>
          </RadioGroup>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description" style={{ color: '#3D4127' }}>
            Description <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="description"
            placeholder="Please describe your complaint in detail. Include when the issue started, how it affects you, and any other relevant information..."
            value={description}
            onChange={(e) => { setDescription(e.target.value); if (errors.description) setErrors(p => ({ ...p, description: '' })); }}
            className="min-h-32"
            style={{ ...inputStyle, ...(errors.description ? { borderColor: '#dc2626' } : {}) }}
            disabled={isSubmitting}
          />
          {errors.description && (
            <p className="text-xs text-red-600 flex items-center gap-1">
              <AlertCircle className="size-3" />{errors.description}
            </p>
          )}
          <div className="flex justify-between">
            <p className="text-xs" style={{ color: '#9aA278' }}>Provide detailed information to help us resolve faster</p>
            <p className="text-xs" style={{ color: '#9aA278' }}>{description.length} chars</p>
          </div>
        </div>

        {/* Photo Upload */}
        <div className="space-y-3">
          <Label htmlFor="photos" style={{ color: '#3D4127' }}>Photos (Optional)</Label>
          <div
            className="border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer"
            style={{ borderColor: 'rgba(186,192,149,0.5)', background: '#f8f9f4' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#636B2F';
              e.currentTarget.style.background = 'rgba(99,107,47,0.04)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(186,192,149,0.5)';
              e.currentTarget.style.background = '#f8f9f4';
            }}
          >
            <input
              type="file" id="photos" className="hidden"
              accept="image/*" multiple
              onChange={handleFileUpload}
              disabled={isSubmitting || uploadedFiles.length >= 3}
            />
            <label
              htmlFor="photos"
              className={`cursor-pointer ${uploadedFiles.length >= 3 ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3"
                style={{ background: 'rgba(99,107,47,0.1)' }}
              >
                <Upload className="size-6" style={{ color: '#636B2F' }} />
              </div>
              <p className="text-sm mb-1" style={{ color: '#3D4127' }}>Click to upload or drag and drop</p>
              <p className="text-xs" style={{ color: '#9aA278' }}>PNG, JPG up to 5MB (Max 3 files)</p>
            </label>
          </div>
          {uploadedFiles.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {uploadedFiles.map((file, index) => (
                <div
                  key={index}
                  className="relative flex items-center gap-2 p-3 rounded-xl"
                  style={{ background: '#f8f9f4', border: '1px solid rgba(186,192,149,0.3)' }}
                >
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(99,107,47,0.1)' }}
                  >
                    <Upload className="size-4" style={{ color: '#636B2F' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs truncate" style={{ color: '#1a1e0f' }}>{file.name}</p>
                    <p className="text-xs" style={{ color: '#9aA278' }}>{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="p-1 rounded-lg transition-colors hover:bg-red-50 text-gray-400 hover:text-red-600"
                    disabled={isSubmitting}
                  >
                    <X className="size-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit */}
        <div
          className="flex items-center gap-3 pt-4"
          style={{ borderTop: '1px solid rgba(186,192,149,0.3)' }}
        >
          <button
            type="submit"
            className="px-8 h-11 rounded-xl text-white text-sm transition-all hover:shadow-lg disabled:opacity-60"
            style={{ background: 'linear-gradient(135deg, #636B2F, #7a8338)', boxShadow: '0 4px 12px rgba(99,107,47,0.3)' }}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Submitting...
              </span>
            ) : 'Submit Complaint'}
          </button>
          <Button
            type="button"
            variant="outline"
            className="h-11"
            style={{ borderColor: 'rgba(186,192,149,0.5)', color: '#3D4127' }}
            onClick={() => {
              setTitle(''); setCategory(''); setPriority('normal');
              setDescription(''); setUploadedFiles([]); setErrors({});
            }}
            disabled={isSubmitting}
          >
            Clear Form
          </Button>
        </div>
      </form>

      {/* Guidelines */}
      <div
        className="rounded-xl p-6"
        style={{ background: 'rgba(212,222,149,0.12)', border: '1px solid rgba(186,192,149,0.3)' }}
      >
        <h3 className="text-sm mb-4 flex items-center gap-2" style={{ color: '#3D4127' }}>
          <span>💡</span> Complaint Guidelines
        </h3>
        <ul className="space-y-3">
          {[
            'Be specific and provide all relevant details about the issue',
            'Attach clear photos if the issue is visible',
            'Mark as "Urgent" only for critical safety or security issues',
            'Track the status of your complaint in the Issues section',
          ].map((tip, i) => (
            <li key={i} className="flex items-start gap-2 text-xs" style={{ color: '#6b7155' }}>
              <CheckCircle className="size-4 shrink-0 mt-0.5" style={{ color: '#636B2F' }} />
              {tip}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
