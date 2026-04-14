import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../ui/dialog';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

interface AlertSubmission {
  id: string;
  authority: string;
  name: string;
  email: string;
  mobile: string;
  address: string;
  message: string;
  timestamp: Date;
  status: 'submitted' | 'acknowledged' | 'processing' | 'resolved';
}

const AUTHORITIES = [
  {
    id: 'municipality',
    name: 'Municipality',
    icon: '🏛️',
    email: 'alerts@municipality.gov.in',
    description: 'Local municipal corporation for waste management',
    color: 'blue',
  },
  {
    id: 'spcb',
    name: 'State Pollution Control Board',
    icon: '🌍',
    email: 'grievances@spcb.gov.in',
    description: 'State authority for pollution monitoring and regulation',
    color: 'green',
  },
  {
    id: 'cpcb',
    name: 'Central Pollution Control Board',
    icon: '🏢',
    email: 'complaints@cpcb.gov.in',
    description: 'National environmental protection authority',
    color: 'purple',
  },
];

const DEFAULT_MESSAGES: Record<string, string[]> = {
  municipality: [
    'Illegal dumping site found in residential area',
    'Waste collection vehicle not arrived for pickup',
    'Foul smell from local waste dump',
    'Water contamination near dump site',
    'Waste saturation in locality',
  ],
  spcb: [
    'High pollution levels detected',
    'Industrial effluent discharge observed',
    'Air quality below standards',
    'Water quality degradation',
    'Hazardous waste disposal',
  ],
  cpcb: [
    'Cross-state pollution incident',
    'Major industrial contamination',
    'National environmental emergency',
    'Compliance violation by large industry',
    'National water pollution crisis',
  ],
};

interface AlertFormData {
  name: string;
  email: string;
  mobile: string;
  address: string;
  message: string;
}

const INITIAL_FORM_STATE: AlertFormData = {
  name: '',
  email: '',
  mobile: '',
  address: '',
  message: '',
};

interface AlertTabProps {
  authority: (typeof AUTHORITIES)[number];
  onSubmit: (data: AlertFormData) => void;
  isLoading: boolean;
}

const AlertForm: React.FC<AlertTabProps> = ({ authority, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<AlertFormData>(INITIAL_FORM_STATE);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.mobile && formData.address && formData.message) {
      onSubmit(formData);
      setFormData(INITIAL_FORM_STATE);
      setSelectedTemplate('');
    }
  };

  const handleTemplateSelect = (template: string) => {
    setSelectedTemplate(template);
    setFormData(prev => ({ ...prev, message: template }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1">Your Name *</label>
          <Input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Full Name"
            required
            className="border-gray-300"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1">Email Address *</label>
          <Input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="your@email.com"
            required
            className="border-gray-300"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1">Mobile Number *</label>
          <Input
            type="tel"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            placeholder="+91 XXXXX XXXXX"
            required
            className="border-gray-300"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1">Location/Address *</label>
          <Input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Street, Area, City"
            required
            className="border-gray-300"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">Message/Alert Details *</label>
        <Textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="Describe the issue in detail..."
          required
          className="border-gray-300 min-h-[120px]"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">Quick Templates</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {DEFAULT_MESSAGES[authority.id].map((template, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleTemplateSelect(template)}
              className={`p-2 rounded-lg border text-xs font-medium text-left transition-colors ${
                selectedTemplate === template
                  ? 'bg-blue-100 border-blue-300 text-blue-900'
                  : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
              }`}
            >
              {template}
            </button>
          ))}
        </div>
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className={`w-full font-semibold py-2 ${
          authority.color === 'blue'
            ? 'bg-blue-600 hover:bg-blue-700 text-white'
            : authority.color === 'green'
            ? 'bg-green-600 hover:bg-green-700 text-white'
            : 'bg-purple-600 hover:bg-purple-700 text-white'
        }`}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin inline" />
            Submitting...
          </>
        ) : (
          `Submit to ${authority.name}`
        )}
      </Button>
    </form>
  );
};

export const RaiseAlertSection: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [submissions, setSubmissions] = useState<AlertSubmission[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleAlertSubmit = (authority: typeof AUTHORITIES[number]) => {
    return async (formData: AlertFormData) => {
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      const newSubmission: AlertSubmission = {
        id: `alert-${Date.now()}`,
        authority: authority.name,
        ...formData,
        timestamp: new Date(),
        status: 'submitted',
      };

      setSubmissions(prev => [newSubmission, ...prev]);
      setSuccessMessage(`Alert successfully submitted to ${authority.name}`);
      setIsLoading(false);
      setDialogOpen(false);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    };
  };

  const getStatusColor = (status: AlertSubmission['status']): string => {
    switch (status) {
      case 'submitted':
        return 'bg-blue-100 text-blue-800';
      case 'acknowledged':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-orange-100 text-orange-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="border-l-4 border-l-red-500 bg-gradient-to-br from-red-50 to-pink-50">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-red-900">Raise Alert / Report Issue</CardTitle>
        <CardDescription className="text-red-700">
          Report pollution incidents, waste saturation, or illegal dumping to relevant authorities
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Success Message */}
        {successMessage && (
          <div className="bg-green-100 border border-green-300 text-green-800 px-4 py-3 rounded-lg flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">{successMessage}</span>
          </div>
        )}

        {/* Authority Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {AUTHORITIES.map(authority => (
            <Dialog key={authority.id} open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <button
                  className={`p-4 rounded-lg border-2 hover:shadow-lg transition-all text-left h-full ${
                    authority.color === 'blue'
                      ? 'border-blue-200 bg-blue-50 hover:bg-blue-100'
                      : authority.color === 'green'
                      ? 'border-green-200 bg-green-50 hover:bg-green-100'
                      : 'border-purple-200 bg-purple-50 hover:bg-purple-100'
                  }`}
                >
                  <div className="text-3xl mb-2">{authority.icon}</div>
                  <h3 className="font-bold text-gray-900">{authority.name}</h3>
                  <p className="text-xs text-gray-600 mt-2">{authority.description}</p>
                  <button className={`mt-3 px-3 py-1 rounded text-sm font-semibold ${
                    authority.color === 'blue'
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : authority.color === 'green'
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-purple-600 hover:bg-purple-700 text-white'
                  }`}>
                    Report Now
                  </button>
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-xl">
                    <span className="text-2xl">{authority.icon}</span>
                    Submit Alert to {authority.name}
                  </DialogTitle>
                  <DialogDescription>
                    Fill in the details below to report a pollution incident or waste management issue
                  </DialogDescription>
                </DialogHeader>
                <AlertForm
                  authority={authority}
                  onSubmit={handleAlertSubmit(authority)}
                  isLoading={isLoading}
                />
              </DialogContent>
            </Dialog>
          ))}
        </div>

        {/* Recent Submissions */}
        {submissions.length > 0 && (
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              Your Recent Alerts ({submissions.length})
            </h3>
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {submissions.map(submission => (
                <div key={submission.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{submission.authority}</p>
                      <p className="text-sm text-gray-700 mt-1">{submission.message}</p>
                      <div className="flex flex-wrap gap-2 mt-2 text-xs text-gray-600">
                        <span>📍 {submission.address}</span>
                        <span>📧 {submission.email}</span>
                        <span>📱 {submission.mobile}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(submission.status)}`}>
                        {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                      </span>
                      <span className="text-xs text-gray-500">{submission.timestamp.toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Information Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-2">📋 Important Information</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Your report will be tracked with a unique ID</li>
            <li>• Authorities will acknowledge receipt within 24 hours</li>
            <li>• You can check status updates on your registered mobile/email</li>
            <li>• Multiple reports help identify patterns and enforce compliance</li>
            <li>• Provide as much detail as possible for faster resolution</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
