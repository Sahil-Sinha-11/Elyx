import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, MoreVertical, Phone, Video, Search, ArrowLeft, Clock, Check, CheckCheck, User, Stethoscope, Activity, Utensils, Dumbbell, Users } from 'lucide-react';

interface ChatMessage {
  id: string;
  timestamp: Date;
  senderId: string;
  senderName: string;
  senderRole?: string;
  text: string;
  isFromMember: boolean;
  attachments?: Array<{
    type: 'image' | 'document' | 'voice' | 'data';
    url: string;
    filename: string;
  }>;
  tags: Array<{
    category: string;
    value: string;
  }>;
  urgency?: 'low' | 'medium' | 'high' | 'urgent';
  readAt?: Date;
  pillar?: number;
}

interface ChatThread {
  id: string;
  title: string;
  participants: Array<{
    id: string;
    name: string;
    role: string;
    avatar?: string;
  }>;
  lastMessage: string;
  lastActivity: Date;
  unreadCount: number;
  category: string;
}

const ChatViewer: React.FC = () => {
  const [selectedThread, setSelectedThread] = useState<ChatThread | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterByActor, setFilterByActor] = useState<string>('all');
  const [filterByPillar, setFilterByPillar] = useState<number | 'all'>('all');
  const [showSearchResults, setShowSearchResults] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock data - in real app, this would come from your database
  const chatThreads: ChatThread[] = [
    {
      id: 'thread-1',
      title: 'Initial Health Assessment',
      participants: [
        { id: 'rohan', name: 'Rohan', role: 'Member' },
        { id: 'ruby', name: 'Ruby', role: 'Health Concierge' },
        { id: 'dr-warren', name: 'Dr. Warren', role: 'Lead Physician' }
      ],
      lastMessage: 'Your blood work results are in. Let\'s discuss the findings.',
      lastActivity: new Date('2025-01-20T14:30:00'),
      unreadCount: 0,
      category: 'Medical'
    },
    {
      id: 'thread-2', 
      title: 'Tokyo Travel Planning',
      participants: [
        { id: 'rohan', name: 'Rohan', role: 'Member' },
        { id: 'ruby', name: 'Ruby', role: 'Health Concierge' },
        { id: 'alex', name: 'Alex', role: 'Performance Coach' }
      ],
      lastMessage: 'Your complete Tokyo protocol is ready! Safe travels.',
      lastActivity: new Date('2025-02-10T09:15:00'),
      unreadCount: 2,
      category: 'Travel'
    },
    {
      id: 'thread-3',
      title: 'HRV Optimization Discussion',
      participants: [
        { id: 'rohan', name: 'Rohan', role: 'Member' },
        { id: 'alex', name: 'Alex', role: 'Performance Coach' }
      ],
      lastMessage: 'Your HRV trend is looking excellent - up 15% this month!',
      lastActivity: new Date('2025-02-15T16:45:00'),
      unreadCount: 1,
      category: 'Performance'
    }
  ];

  const sampleMessages: ChatMessage[] = [
    {
      id: 'msg-1',
      timestamp: new Date('2025-01-15T10:30:00'),
      senderId: 'rohan',
      senderName: 'Rohan',
      text: 'Hi Ruby. My Garmin is logging consistently high intensity minutes, even on rest days. I suspect it\'s related to stress from work. My current health management feels very random and uncoordinated. I need a proper medical review.',
      isFromMember: true,
      tags: [
        { category: 'diagnostic', value: 'initial-concern' },
        { category: 'data-sharing', value: 'wearable-data' }
      ],
      urgency: 'medium',
      pillar: 1
    },
    {
      id: 'msg-2',
      timestamp: new Date('2025-01-15T10:45:00'),
      senderId: 'ruby',
      senderName: 'Ruby',
      senderRole: 'Health Concierge',
      text: 'Hi Rohan, thank you for reaching out. I can see why this would be concerning - elevated intensity readings during rest can indicate several things. Are you experiencing any other symptoms like dizziness or shortness of breath? I\'m flagging this for Dr. Warren to review immediately as Priority 1.',
      isFromMember: false,
      tags: [
        { category: 'follow-up', value: 'initial-assessment' },
        { category: 'logistics', value: 'escalation' }
      ],
      pillar: 1,
      readAt: new Date('2025-01-15T10:46:00')
    },
    {
      id: 'msg-3',
      timestamp: new Date('2025-01-15T14:20:00'),
      senderId: 'dr-warren',
      senderName: 'Dr. Warren',
      senderRole: 'Lead Physician',
      text: 'Rohan, I\'ve reviewed your concern about the elevated intensity readings. This pattern often indicates heightened sympathetic nervous system activity. Let\'s get a comprehensive baseline assessment - I\'m ordering a full blood panel, inflammatory markers, and thyroid function tests. We\'ll also need a detailed stress/sleep history.',
      isFromMember: false,
      tags: [
        { category: 'diagnostic', value: 'test-orders' },
        { category: 'education', value: 'explanation' }
      ],
      urgency: 'high',
      pillar: 1,
      readAt: new Date('2025-01-15T14:22:00')
    },
    {
      id: 'msg-4',
      timestamp: new Date('2025-01-15T14:25:00'),
      senderId: 'rohan',
      senderName: 'Rohan',
      text: 'That makes sense. No dizziness or shortness of breath, but I have been waking up around 3am consistently. I can get the blood work done tomorrow morning. Should I fast?',
      isFromMember: true,
      tags: [
        { category: 'feedback', value: 'symptom-report' },
        { category: 'logistics', value: 'scheduling' }
      ],
      readAt: new Date('2025-01-15T14:25:30')
    }
  ];

  const actors = [
    { id: 'ruby', name: 'Ruby', role: 'Health Concierge', icon: User, color: 'bg-pink-500' },
    { id: 'dr-warren', name: 'Dr. Warren', role: 'Lead Physician', icon: Stethoscope, color: 'bg-blue-500' },
    { id: 'alex', name: 'Alex', role: 'Performance Coach', icon: Activity, color: 'bg-green-500' },
    { id: 'carla', name: 'Carla', role: 'Nutrition Specialist', icon: Utensils, color: 'bg-orange-500' },
    { id: 'mike', name: 'Mike', role: 'Physical Therapist', icon: Dumbbell, color: 'bg-purple-500' },
    { id: 'neel', name: 'Neel', role: 'Lead Health Manager', icon: Users, color: 'bg-indigo-500' }
  ];

  const pillars = [
    { key: 1, label: 'Diagnostics', color: 'bg-red-100 text-red-700' },
    { key: 2, label: 'Sleep/Recovery', color: 'bg-blue-100 text-blue-700' },
    { key: 3, label: 'Cardiovascular', color: 'bg-pink-100 text-pink-700' },
    { key: 4, label: 'Nutrition', color: 'bg-green-100 text-green-700' },
    { key: 5, label: 'Performance', color: 'bg-purple-100 text-purple-700' }
  ];

  useEffect(() => {
    if (selectedThread) {
      // In real app, fetch messages for selected thread
      setMessages(sampleMessages);
    }
  }, [selectedThread]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false
    });
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  const getActorInfo = (actorId: string) => {
    return actors.find(a => a.id === actorId) || { 
      id: actorId, 
      name: actorId, 
      role: 'Unknown', 
      icon: User, 
      color: 'bg-gray-500' 
    };
  };

  const renderMessage = (message: ChatMessage, isLastInGroup: boolean = false, isFirstInGroup: boolean = false) => {
    const isFromMember = message.isFromMember;
    const actorInfo = !isFromMember ? getActorInfo(message.senderId) : null;
    const ActorIcon = actorInfo?.icon || User;

    return (
      <div key={message.id} className={`flex ${isFromMember ? 'justify-end' : 'justify-start'} mb-1`}>
        <div className={`flex max-w-[70%] ${isFromMember ? 'flex-row-reverse' : 'flex-row'}`}>
          {/* Avatar */}
          {!isFromMember && isLastInGroup && (
            <div className={`w-8 h-8 rounded-full ${actorInfo?.color} flex items-center justify-center mr-2 flex-shrink-0`}>
              <ActorIcon className="w-4 h-4 text-white" />
            </div>
          )}
          {!isFromMember && !isLastInGroup && (
            <div className="w-8 mr-2"></div>
          )}

          <div className={`flex flex-col ${isFromMember ? 'items-end' : 'items-start'}`}>
            {/* Sender name for team messages */}
            {!isFromMember && isFirstInGroup && (
              <div className="mb-1">
                <span className="text-xs font-medium text-slate-600">{message.senderName}</span>
                <span className="text-xs text-slate-400 ml-1">• {message.senderRole}</span>
              </div>
            )}

            {/* Message bubble */}
            <div
              className={`px-4 py-2 rounded-2xl max-w-full ${
                isFromMember
                  ? 'bg-blue-500 text-white rounded-br-md'
                  : 'bg-white text-slate-900 shadow-sm border border-slate-200 rounded-bl-md'
              }`}
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
              
              {/* Message tags */}
              {message.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {message.tags.map((tag, index) => (
                    <span
                      key={index}
                      className={`px-2 py-1 rounded-full text-xs ${
                        isFromMember 
                          ? 'bg-blue-400 text-blue-100' 
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {tag.value}
                    </span>
                  ))}
                </div>
              )}
              
              {/* Pillar indicator */}
              {message.pillar && (
                <div className="mt-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${pillars[message.pillar - 1]?.color || 'bg-gray-100 text-gray-600'}`}>
                    {pillars[message.pillar - 1]?.label || `Pillar ${message.pillar}`}
                  </span>
                </div>
              )}
            </div>

            {/* Timestamp and read status */}
            {isLastInGroup && (
              <div className="flex items-center mt-1 space-x-2">
                <span className="text-xs text-slate-400">{formatTime(message.timestamp)}</span>
                {message.urgency && (
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    message.urgency === 'urgent' ? 'bg-red-100 text-red-600' :
                    message.urgency === 'high' ? 'bg-orange-100 text-orange-600' :
                    message.urgency === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                    'bg-blue-100 text-blue-600'
                  }`}>
                    {message.urgency}
                  </span>
                )}
                {isFromMember && (
                  <div>
                    {message.readAt ? (
                      <CheckCheck className="w-4 h-4 text-blue-500" />
                    ) : (
                      <Check className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const groupMessages = (messages: ChatMessage[]) => {
    const groups: Array<{messages: ChatMessage[], sender: string, date: string}> = [];
    let currentGroup: ChatMessage[] = [];
    let currentSender = '';
    let currentDate = '';

    messages.forEach((message, index) => {
      const messageDate = formatDate(message.timestamp);
      const sameSender = message.senderId === currentSender;
      const sameDate = messageDate === currentDate;
      const timeDiff = index > 0 ? message.timestamp.getTime() - messages[index - 1].timestamp.getTime() : 0;
      const closeInTime = timeDiff < 5 * 60 * 1000; // 5 minutes

      if (sameSender && sameDate && closeInTime && currentGroup.length > 0) {
        currentGroup.push(message);
      } else {
        if (currentGroup.length > 0) {
          groups.push({ messages: [...currentGroup], sender: currentSender, date: currentDate });
        }
        currentGroup = [message];
        currentSender = message.senderId;
        currentDate = messageDate;
      }
    });

    if (currentGroup.length > 0) {
      groups.push({ messages: [...currentGroup], sender: currentSender, date: currentDate });
    }

    return groups;
  };

  if (!selectedThread) {
    return (
      <div className="h-screen bg-slate-50 flex">
        {/* Thread List */}
        <div className="w-80 bg-white border-r border-slate-200">
          {/* Header */}
          <div className="p-4 border-b border-slate-200 bg-white">
            <h2 className="text-lg font-semibold text-slate-900">Conversations</h2>
            <div className="mt-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="p-4 border-b border-slate-100">
            <div className="flex space-x-2">
              <select
                value={filterByActor}
                onChange={(e) => setFilterByActor(e.target.value)}
                className="text-sm border border-slate-200 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Team Members</option>
                {actors.map(actor => (
                  <option key={actor.id} value={actor.id}>{actor.name}</option>
                ))}
              </select>
              
              <select
                value={filterByPillar}
                onChange={(e) => setFilterByPillar(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
                className="text-sm border border-slate-200 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Pillars</option>
                {pillars.map(pillar => (
                  <option key={pillar.key} value={pillar.key}>{pillar.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Thread List */}
          <div className="overflow-y-auto h-full">
            {chatThreads.map((thread) => (
              <div
                key={thread.id}
                onClick={() => setSelectedThread(thread)}
                className="p-4 hover:bg-slate-50 cursor-pointer border-b border-slate-100 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-medium text-slate-900 truncate">{thread.title}</h3>
                      {thread.unreadCount > 0 && (
                        <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
                          {thread.unreadCount}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-600 truncate mb-1">{thread.lastMessage}</p>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-slate-400">
                        {formatDate(thread.lastActivity)} • {formatTime(thread.lastActivity)}
                      </span>
                      <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                        {thread.category}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Participants */}
                <div className="flex items-center mt-2 space-x-1">
                  {thread.participants.slice(0, 3).map((participant) => {
                    const actorInfo = getActorInfo(participant.id);
                    const Icon = actorInfo.icon;
                    return (
                      <div
                        key={participant.id}
                        className={`w-6 h-6 rounded-full ${participant.id === 'rohan' ? 'bg-slate-300' : actorInfo.color} flex items-center justify-center`}
                      >
                        <Icon className="w-3 h-3 text-white" />
                      </div>
                    );
                  })}
                  {thread.participants.length > 3 && (
                    <span className="text-xs text-slate-400">
                      +{thread.participants.length - 3}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Empty State */}
        <div className="flex-1 flex items-center justify-center bg-slate-50">
          <div className="text-center">
            <MessageSquare className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-600 mb-2">Select a conversation</h3>
            <p className="text-slate-500">Choose a conversation thread to view the message history</p>
          </div>
        </div>
      </div>
    );
  }

  const messageGroups = groupMessages(messages);
  let currentDate = '';

  return (
    <div className="h-screen bg-slate-50 flex">
      {/* Thread List - Collapsed */}
      <div className="w-16 bg-white border-r border-slate-200 flex flex-col items-center py-4">
        <button
          onClick={() => setSelectedThread(null)}
          className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors mb-4"
        >
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        
        {chatThreads.map((thread, index) => (
          <div
            key={thread.id}
            className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 cursor-pointer transition-colors ${
              selectedThread.id === thread.id ? 'bg-blue-500' : 'bg-slate-200 hover:bg-slate-300'
            }`}
            onClick={() => setSelectedThread(thread)}
          >
            <span className={`text-sm font-medium ${
              selectedThread.id === thread.id ? 'text-white' : 'text-slate-700'
            }`}>
              {index + 1}
            </span>
          </div>
        ))}
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="bg-white border-b border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-slate-900">{selectedThread.title}</h2>
              <div className="flex items-center space-x-2 mt-1">
                {selectedThread.participants.map((participant, index) => (
                  <span key={participant.id} className="text-sm text-slate-600">
                    {participant.name}
                    {index < selectedThread.participants.length - 1 && ', '}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-2 hover:bg-slate-100 rounded-full">
                <Phone className="w-5 h-5 text-slate-600" />
              </button>
              <button className="p-2 hover:bg-slate-100 rounded-full">
                <Video className="w-5 h-5 text-slate-600" />
              </button>
              <button className="p-2 hover:bg-slate-100 rounded-full">
                <MoreVertical className="w-5 h-5 text-slate-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messageGroups.map((group, groupIndex) => (
            <div key={groupIndex}>
              {/* Date separator */}
              {group.date !== currentDate && (
                <div className="flex items-center justify-center mb-4">
                  <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs">
                    {group.date}
                  </span>
                  <span className="hidden">{currentDate = group.date}</span>
                </div>
              )}
              
              {/* Message group */}
              <div className="space-y-1">
                {group.messages.map((message, messageIndex) => 
                  renderMessage(
                    message, 
                    messageIndex === group.messages.length - 1, // isLastInGroup
                    messageIndex === 0 // isFirstInGroup
                  )
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="bg-white border-t border-slate-200 p-4">
          <div className="flex items-center space-x-3">
            <button className="p-2 hover:bg-slate-100 rounded-full">
              <Paperclip className="w-5 h-5 text-slate-600" />
            </button>
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Type a message..."
                className="w-full px-4 py-2 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full">
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatViewer;