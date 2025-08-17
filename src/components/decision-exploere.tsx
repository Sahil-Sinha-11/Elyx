import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  MessageSquare, 
  FileText, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  User, 
  Stethoscope, 
  Activity, 
  Utensils, 
  Dumbbell, 
  Users,
  ChevronDown,
  ChevronRight,
  Search,
  Filter,
  Calendar,
  Target,
  Lightbulb,
  BarChart3
} from 'lucide-react';

interface DecisionNode {
  id: string;
  type: 'decision' | 'evidence' | 'outcome' | 'metric';
  title: string;
  description: string;
  actor: {
    id: string;
    name: string;
    role: string;
    avatar?: string;
  };
  timestamp: Date;
  pillar: number;
  status: 'active' | 'completed' | 'discontinued' | 'under_review';
  urgency?: 'low' | 'medium' | 'high' | 'urgent';
  evidence: Evidence[];
  outcomes: Outcome[];
  relatedDecisions: string[];
  metrics?: Record<string, { before: number; after: number; improvement: number }>;
}

interface Evidence {
  id: string;
  type: 'message' | 'data' | 'test_result' | 'observation';
  content: string;
  source: string;
  timestamp: Date;
  confidence: 'low' | 'medium' | 'high';
  tags: string[];
}

interface Outcome {
  id: string;
  description: string;
  timestamp: Date;
  success: boolean;
  measuredBy: string[];
  notes?: string;
}

const DecisionExplorer: React.FC = () => {
  const [selectedDecision, setSelectedDecision] = useState<DecisionNode | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['evidence', 'outcomes']));
  const [filterBy, setFilterBy] = useState<'all' | 'active' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [timelineView, setTimelineView] = useState(true);

  // Mock data - in real app, this would come from your database
  const decisions: DecisionNode[] = [
    {
      id: 'dec-1',
      type: 'decision',
      title: 'Comprehensive Blood Panel Order',
      description: 'Ordered comprehensive blood work including ApoB, inflammatory markers, and thyroid function tests to establish baseline health status.',
      actor: {
        id: 'dr-warren',
        name: 'Dr. Warren',
        role: 'Lead Physician'
      },
      timestamp: new Date('2025-01-15T14:30:00'),
      pillar: 1,
      status: 'completed',
      urgency: 'high',
      evidence: [
        {
          id: 'ev-1',
          type: 'message',
          content: 'My Garmin is logging consistently high intensity minutes, even on rest days. I suspect it\'s related to stress from work.',
          source: 'Rohan (Initial Concern)',
          timestamp: new Date('2025-01-15T10:30:00'),
          confidence: 'high',
          tags: ['wearable-data', 'stress', 'initial-concern']
        },
        {
          id: 'ev-2',
          type: 'observation',
          content: 'Patient reports waking up around 3am consistently, indicating potential sleep disruption patterns.',
          source: 'Clinical Assessment',
          timestamp: new Date('2025-01-15T14:25:00'),
          confidence: 'medium',
          tags: ['sleep', 'circadian', 'symptom-report']
        }
      ],
      outcomes: [
        {
          id: 'out-1',
          description: 'Blood panel completed - ApoB elevated at 105 mg/dL, hs-CRP slightly elevated at 2.1',
          timestamp: new Date('2025-01-20T09:00:00'),
          success: true,
          measuredBy: ['lab-results'],
          notes: 'Clear baseline established, cardiovascular risk identified'
        }
      ],
      relatedDecisions: ['dec-2'],
      metrics: {
        'diagnostic_clarity': { before: 30, after: 95, improvement: 65 }
      }
    },
    {
      id: 'dec-2',
      type: 'decision',
      title: 'Lifestyle Intervention Protocol',
      description: 'Implemented comprehensive lifestyle modification protocol targeting elevated ApoB and inflammatory markers through nutrition, exercise, and sleep optimization.',
      actor: {
        id: 'neel',
        name: 'Neel',
        role: 'Lead Health Manager'
      },
      timestamp: new Date('2025-01-22T11:00:00'),
      pillar: 3,
      status: 'active',
      urgency: 'medium',
      evidence: [
        {
          id: 'ev-3',
          type: 'test_result',
          content: 'ApoB: 105 mg/dL (elevated, target <90), hs-CRP: 2.1 mg/L (elevated, target <1.0)',
          source: 'Comprehensive Blood Panel',
          timestamp: new Date('2025-01-20T09:00:00'),
          confidence: 'high',
          tags: ['cardiovascular-risk', 'inflammation', 'biomarkers']
        },
        {
          id: 'ev-4',
          type: 'data',
          content: 'HRV consistently low at 38-40, indicating poor autonomic recovery',
          source: 'Garmin Wearable Data',
          timestamp: new Date('2025-01-21T08:00:00'),
          confidence: 'high',
          tags: ['hrv', 'recovery', 'autonomic-function']
        }
      ],
      outcomes: [
        {
          id: 'out-2',
          description: 'HRV improved from 38 to 45 (+18%) over 4 weeks',
          timestamp: new Date('2025-02-15T10:00:00'),
          success: true,
          measuredBy: ['wearable-data', 'weekly-assessments']
        },
        {
          id: 'out-3',
          description: 'Sleep duration increased from 6.5 to 7.8 hours with improved consistency',
          timestamp: new Date('2025-02-15T10:00:00'),
          success: true,
          measuredBy: ['sleep-tracking', 'subjective-reports']
        }
      ],
      relatedDecisions: ['dec-1', 'dec-3'],
      metrics: {
        'hrv_improvement': { before: 38, after: 45, improvement: 18 },
        'sleep_duration': { before: 6.5, after: 7.8, improvement: 20 },
        'adherence_rate': { before: 0, after: 85, improvement: 85 }
      }
    },
    {
      id: 'dec-3',
      type: 'decision',
      title: 'Zone 2 Cardio Protocol',
      description: 'Introduced structured Zone 2 cardio training (3x/week, 30min) to improve cardiovascular health and metabolic flexibility.',
      actor: {
        id: 'alex',
        name: 'Alex',
        role: 'Performance Coach'
      },
      timestamp: new Date('2025-02-01T16:30:00'),
      pillar: 5,
      status: 'active',
      evidence: [
        {
          id: 'ev-5',
          type: 'test_result',
          content: 'Elevated ApoB and inflammatory markers indicate cardiovascular risk requiring aerobic intervention',
          source: 'Medical Assessment',
          timestamp: new Date('2025-01-22T11:00:00'),
          confidence: 'high',
          tags: ['cardiovascular', 'exercise-prescription']
        },
        {
          id: 'ev-6',
          type: 'message',
          content: 'I can commit to 3 workouts per week, preferably morning sessions before work',
          source: 'Rohan (Lifestyle Discussion)',
          timestamp: new Date('2025-01-28T09:15:00'),
          confidence: 'high',
          tags: ['scheduling', 'preferences', 'adherence']
        }
      ],
      outcomes: [
        {
          id: 'out-4',
          description: 'Consistent execution - 11/12 sessions completed in first month',
          timestamp: new Date('2025-03-01T10:00:00'),
          success: true,
          measuredBy: ['workout-tracking', 'heart-rate-data'],
          notes: 'High adherence rate, good progression in target zones'
        }
      ],
      relatedDecisions: ['dec-2'],
      metrics: {
        'workout_adherence': { before: 0, after: 92, improvement: 92 },
        'resting_heart_rate': { before: 62, after: 58, improvement: 6 }
      }
    }
  ];

  const actors = {
    'dr-warren': { name: 'Dr. Warren', role: 'Lead Physician', icon: Stethoscope, color: 'bg-blue-500' },
    'alex': { name: 'Alex', role: 'Performance Coach', icon: Activity, color: 'bg-green-500' },
    'carla': { name: 'Carla', role: 'Nutrition Specialist', icon: Utensils, color: 'bg-orange-500' },
    'mike': { name: 'Mike', role: 'Physical Therapist', icon: Dumbbell, color: 'bg-purple-500' },
    'neel': { name: 'Neel', role: 'Lead Health Manager', icon: Users, color: 'bg-indigo-500' },
    'ruby': { name: 'Ruby', role: 'Health Concierge', icon: User, color: 'bg-pink-500' }
  };

  const pillars = [
    { key: 1, label: 'Diagnostics', color: 'bg-red-100 text-red-700 border-red-200' },
    { key: 2, label: 'Sleep/Recovery', color: 'bg-blue-100 text-blue-700 border-blue-200' },
    { key: 3, label: 'Cardiovascular', color: 'bg-pink-100 text-pink-700 border-pink-200' },
    { key: 4, label: 'Nutrition', color: 'bg-green-100 text-green-700 border-green-200' },
    { key: 5, label: 'Performance', color: 'bg-purple-100 text-purple-700 border-purple-200' }
  ];

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700 border-green-200';
      case 'completed': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'discontinued': return 'bg-red-100 text-red-700 border-red-200';
      case 'under_review': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getUrgencyColor = (urgency?: string) => {
    if (!urgency) return '';
    switch (urgency) {
      case 'urgent': return 'border-l-4 border-red-500';
      case 'high': return 'border-l-4 border-orange-500';
      case 'medium': return 'border-l-4 border-yellow-500';
      case 'low': return 'border-l-4 border-blue-500';
      default: return '';
    }
  };

  const getEvidenceIcon = (type: string) => {
    switch (type) {
      case 'message': return <MessageSquare className="w-4 h-4 text-blue-500" />;
      case 'data': return <BarChart3 className="w-4 h-4 text-purple-500" />;
      case 'test_result': return <FileText className="w-4 h-4 text-green-500" />;
      case 'observation': return <Lightbulb className="w-4 h-4 text-orange-500" />;
      default: return <FileText className="w-4 h-4 text-gray-500" />;
    }
  };

  const filteredDecisions = decisions.filter(decision => {
    if (filterBy !== 'all' && decision.status !== filterBy) return false;
    if (searchQuery && !decision.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !decision.description.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Decision Traceability</h1>
              <p className="text-slate-600 mt-1">Understand the "why" behind every health decision</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setTimelineView(!timelineView)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  timelineView 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                }`}
              >
                Timeline View
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-12 gap-8">
          {/* Sidebar */}
          <div className="col-span-4 space-y-6">
            {/* Search and Filters */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search decisions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-slate-500" />
                  <select
                    value={filterBy}
                    onChange={(e) => setFilterBy(e.target.value as any)}
                    className="flex-1 border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Decisions</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Decision List */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-200">
                <h3 className="font-semibold text-slate-900">Decisions ({filteredDecisions.length})</h3>
              </div>
              
              <div className="max-h-96 overflow-y-auto">
                {filteredDecisions.map((decision) => {
                  const actorInfo = actors[decision.actor.id];
                  const ActorIcon = actorInfo?.icon || User;
                  const pillarInfo = pillars[decision.pillar - 1];
                  
                  return (
                    <div
                      key={decision.id}
                      onClick={() => setSelectedDecision(decision)}
                      className={`p-4 border-b border-slate-100 cursor-pointer hover:bg-slate-50 transition-colors ${
                        selectedDecision?.id === decision.id ? 'bg-blue-50 border-blue-200' : ''
                      } ${getUrgencyColor(decision.urgency)}`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`w-8 h-8 rounded-full ${actorInfo?.color} flex items-center justify-center flex-shrink-0`}>
                          <ActorIcon className="w-4 h-4 text-white" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-medium text-slate-900 truncate">{decision.title}</h4>
                          </div>
                          
                          <p className="text-sm text-slate-600 mb-2 line-clamp-2">{decision.description}</p>
                          
                          <div className="flex items-center space-x-2 text-xs">
                            <span className={`px-2 py-1 rounded-full border ${getStatusColor(decision.status)}`}>
                              {decision.status.replace('_', ' ')}
                            </span>
                            <span className={`px-2 py-1 rounded-full border ${pillarInfo?.color}`}>
                              {pillarInfo?.label}
                            </span>
                            <span className="text-slate-400">
                              {decision.timestamp.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-semibold text-slate-900 mb-4">Decision Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-600">Total Decisions</span>
                  <span className="font-medium">{decisions.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Active</span>
                  <span className="font-medium text-green-600">{decisions.filter(d => d.status === 'active').length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Completed</span>
                  <span className="font-medium text-blue-600">{decisions.filter(d => d.status === 'completed').length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Success Rate</span>
                  <span className="font-medium text-purple-600">94%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-span-8">
            {selectedDecision ? (
              <div className="space-y-6">
                {/* Decision Header */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-4">
                      <div className={`w-12 h-12 rounded-full ${actors[selectedDecision.actor.id]?.color} flex items-center justify-center`}>
                        {React.createElement(actors[selectedDecision.actor.id]?.icon || User, { className: "w-6 h-6 text-white" })}
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-1">{selectedDecision.title}</h2>
                        <p className="text-slate-600 mb-2">{selectedDecision.description}</p>
                        <div className="flex items-center space-x-3">
                          <span className="text-sm text-slate-500">
                            by {selectedDecision.actor.name} • {selectedDecision.actor.role}
                          </span>
                          <span className="text-sm text-slate-400">
                            {selectedDecision.timestamp.toLocaleDateString('en-US', { 
                              month: 'long', 
                              day: 'numeric', 
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end space-y-2">
                      <span className={`px-3 py-1 rounded-full text-sm border ${getStatusColor(selectedDecision.status)}`}>
                        {selectedDecision.status.replace('_', ' ')}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-sm border ${pillars[selectedDecision.pillar - 1]?.color}`}>
                        {pillars[selectedDecision.pillar - 1]?.label}
                      </span>
                      {selectedDecision.urgency && (
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          selectedDecision.urgency === 'urgent' ? 'bg-red-100 text-red-700' :
                          selectedDecision.urgency === 'high' ? 'bg-orange-100 text-orange-700' :
                          selectedDecision.urgency === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {selectedDecision.urgency} priority
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Metrics Impact */}
                {selectedDecision.metrics && (
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <div 
                      className="flex items-center justify-between cursor-pointer"
                      onClick={() => toggleSection('metrics')}
                    >
                      <h3 className="text-lg font-semibold text-slate-900 flex items-center">
                        <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
                        Measurable Impact
                      </h3>
                      {expandedSections.has('metrics') ? 
                        <ChevronDown className="w-5 h-5 text-slate-500" /> : 
                        <ChevronRight className="w-5 h-5 text-slate-500" />
                      }
                    </div>
                    
                    {expandedSections.has('metrics') && (
                      <div className="mt-4 grid grid-cols-2 gap-4">
                        {Object.entries(selectedDecision.metrics).map(([metric, values]) => (
                          <div key={metric} className="bg-slate-50 rounded-lg p-4">
                            <h4 className="font-medium text-slate-900 mb-2 capitalize">
                              {metric.replace('_', ' ')}
                            </h4>
                            <div className="space-y-1">
                              <div className="flex justify-between text-sm">
                                <span className="text-slate-600">Before:</span>
                                <span className="font-medium">{values.before}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-slate-600">After:</span>
                                <span className="font-medium">{values.after}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-slate-600">Improvement:</span>
                                <span className={`font-medium ${values.improvement > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                  {values.improvement > 0 ? '+' : ''}{values.improvement}%
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Evidence Section */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div 
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => toggleSection('evidence')}
                  >
                    <h3 className="text-lg font-semibold text-slate-900 flex items-center">
                      <FileText className="w-5 h-5 mr-2 text-blue-500" />
                      Supporting Evidence ({selectedDecision.evidence.length})
                    </h3>
                    {expandedSections.has('evidence') ? 
                      <ChevronDown className="w-5 h-5 text-slate-500" /> : 
                      <ChevronRight className="w-5 h-5 text-slate-500" />
                    }
                  </div>
                  
                  {expandedSections.has('evidence') && (
                    <div className="mt-4 space-y-4">
                      {selectedDecision.evidence.map((evidence) => (
                        <div key={evidence.id} className="border border-slate-200 rounded-lg p-4">
                          <div className="flex items-start space-x-3">
                            {getEvidenceIcon(evidence.type)}
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center space-x-2">
                                  <span className="font-medium text-slate-900 capitalize">
                                    {evidence.type.replace('_', ' ')}
                                  </span>
                                  <span className={`px-2 py-1 rounded-full text-xs ${
                                    evidence.confidence === 'high' ? 'bg-green-100 text-green-700' :
                                    evidence.confidence === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                    'bg-red-100 text-red-700'
                                  }`}>
                                    {evidence.confidence} confidence
                                  </span>
                                </div>
                                <span className="text-sm text-slate-500">
                                  {evidence.timestamp.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                              
                              <p className="text-slate-700 mb-2">{evidence.content}</p>
                              <p className="text-sm text-slate-500 mb-2">Source: {evidence.source}</p>
                              
                              {evidence.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                  {evidence.tags.map((tag) => (
                                    <span key={tag} className="px-2 py-1 bg-slate-100 text-slate-600 rounded-md text-xs">
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Outcomes Section */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div 
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => toggleSection('outcomes')}
                  >
                    <h3 className="text-lg font-semibold text-slate-900 flex items-center">
                      <Target className="w-5 h-5 mr-2 text-purple-500" />
                      Outcomes & Results ({selectedDecision.outcomes.length})
                    </h3>
                    {expandedSections.has('outcomes') ? 
                      <ChevronDown className="w-5 h-5 text-slate-500" /> : 
                      <ChevronRight className="w-5 h-5 text-slate-500" />
                    }
                  </div>
                  
                  {expandedSections.has('outcomes') && (
                    <div className="mt-4 space-y-4">
                      {selectedDecision.outcomes.map((outcome) => (
                        <div key={outcome.id} className="border border-slate-200 rounded-lg p-4">
                          <div className="flex items-start space-x-3">
                            {outcome.success ? 
                              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" /> : 
                              <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                            }
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <span className={`px-2 py-1 rounded-full text-xs ${
                                  outcome.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                }`}>
                                  {outcome.success ? 'Successful' : 'Unsuccessful'}
                                </span>
                                <span className="text-sm text-slate-500">
                                  {outcome.timestamp.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </span>
                              </div>
                              
                              <p className="text-slate-700 mb-2">{outcome.description}</p>
                              
                              <div className="flex items-center space-x-4 text-sm text-slate-500">
                                <span>Measured by: {outcome.measuredBy.join(', ')}</span>
                              </div>
                              
                              {outcome.notes && (
                                <div className="mt-2 p-2 bg-slate-50 rounded text-sm text-slate-600">
                                  {outcome.notes}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Related Decisions */}
                {selectedDecision.relatedDecisions.length > 0 && (
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                      <ArrowRight className="w-5 h-5 mr-2 text-indigo-500" />
                      Related Decisions
                    </h3>
                    <div className="grid grid-cols-1 gap-3">
                      {selectedDecision.relatedDecisions.map((relatedId) => {
                        const relatedDecision = decisions.find(d => d.id === relatedId);
                        if (!relatedDecision) return null;
                        
                        const actorInfo = actors[relatedDecision.actor.id];
                        const ActorIcon = actorInfo?.icon || User;
                        
                        return (
                          <button
                            key={relatedId}
                            onClick={() => setSelectedDecision(relatedDecision)}
                            className="flex items-center space-x-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 text-left transition-colors"
                          >
                            <div className={`w-8 h-8 rounded-full ${actorInfo?.color} flex items-center justify-center`}>
                              <ActorIcon className="w-4 h-4 text-white" />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-slate-900">{relatedDecision.title}</p>
                              <p className="text-sm text-slate-500">{relatedDecision.actor.name}</p>
                            </div>
                            <ArrowRight className="w-4 h-4 text-slate-400" />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <Target className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-600 mb-2">Select a decision to explore</h3>
                <p className="text-slate-500">Choose a decision from the sidebar to see its evidence trail, outcomes, and impact metrics.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DecisionExplorer;