import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  CheckCircle, Circle, Edit3, Trash2, Plus, X, Sun, Moon, Settings, 
  Filter, Search, Calendar, Award, Target, Zap, RotateCcw, RotateCw,
  Star, Clock, Tag, ChevronDown, ChevronUp, Bell, Volume2, VolumeX,
  Trophy, TrendingUp, Users, Rocket, Sparkles, Crown, Medal, AlarmClock,
  RotateCcw as ResetIcon, Pause, Play
} from 'lucide-react';

// Confetti effect component
const Confetti = () => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles = [];
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#FF9FF3', '#54A0FF'];
    
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = -20;
        this.size = Math.random() * 12 + 3;
        this.speedX = Math.random() * 6 - 3;
        this.speedY = Math.random() * 8 + 3;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.angle = 0;
        this.va = Math.random() * 0.2 - 0.1;
        this.shape = Math.random() > 0.5 ? 'circle' : 'rect';
      }
      
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.angle += this.va;
        this.speedY += 0.1;
      }
      
      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.fillStyle = this.color;
        
        if (this.shape === 'circle') {
          ctx.beginPath();
          ctx.arc(0, 0, this.size/2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillRect(-this.size/2, -this.size/2, this.size, this.size);
        }
        
        ctx.restore();
      }
    }
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
        
        if (particles[i].y > canvas.height + 50) {
          particles.splice(i, 1);
          i--;
        }
      }
      
      if (particles.length > 0) {
        requestAnimationFrame(animate);
      }
    };
    
    // Create particles
    for (let i = 0; i < 200; i++) {
      setTimeout(() => {
        particles.push(new Particle());
        if (particles.length === 1) animate();
      }, i * 15);
    }
    
    // Clean up after 4 seconds
    const cleanup = setTimeout(() => {
      particles.length = 0;
    }, 4000);
    
    return () => {
      clearTimeout(cleanup);
    };
  }, []);
  
  return (
    <canvas 
      ref={canvasRef} 
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-50"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};

// Reminder Modal Component
const ReminderModal = ({ isOpen, task, onSnooze, onStop, darkMode }) => {
  const [selectedSnooze, setSelectedSnooze] = useState(5);
  
  if (!isOpen || !task) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className={`w-full max-w-md p-6 rounded-3xl shadow-2xl animate-pulse ${
        darkMode 
          ? 'bg-gradient-to-br from-red-900 to-orange-900 border border-red-700' 
          : 'bg-gradient-to-br from-red-500 to-orange-500 border border-red-300'
      }`}>
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-4 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <AlarmClock size={40} className="text-white" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">⏰ Task Reminder!</h3>
          <p className="text-white text-lg mb-1">"{task.text}"</p>
          <p className="text-white text-opacity-90 mb-6">
            Due: {new Date(task.dueDateTime).toLocaleString()}
          </p>
          
          <div className="space-y-3">
            <div className="flex gap-2 mb-4">
              <select
                value={selectedSnooze}
                onChange={(e) => setSelectedSnooze(parseInt(e.target.value))}
                className="flex-1 px-3 py-2 rounded-lg bg-white bg-opacity-20 text-white border border-white border-opacity-30"
              >
                <option value={5}>5 minutes</option>
                <option value={10}>10 minutes</option>
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes</option>
              </select>
              <button
                onClick={() => onSnooze(task.id, selectedSnooze)}
                className="bg-white text-orange-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Snooze
              </button>
            </div>
            <button
              onClick={() => onStop(task.id)}
              className="w-full bg-white bg-opacity-20 text-white px-4 py-3 rounded-lg font-semibold hover:bg-opacity-30 transition-colors border border-white border-opacity-30"
            >
              Stop Reminder
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Achievement Badge Component
const AchievementBadge = ({ achievement, unlocked, onClick }) => {
  const IconComponent = achievement.icon;
  
  return (
    <div 
      onClick={onClick}
      className={`relative p-4 rounded-2xl border-2 transition-all duration-300 transform cursor-pointer ${
        unlocked
          ? 'bg-gradient-to-br from-yellow-400 to-orange-500 border-yellow-300 shadow-lg scale-100 hover:scale-105'
          : 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 opacity-60 scale-95'
      }`}
    >
      <div className={`flex items-center gap-3 ${unlocked ? 'text-white' : 'text-gray-500 dark:text-gray-400'}`}>
        <div className={`p-2 rounded-full ${unlocked ? 'bg-white bg-opacity-20' : 'bg-gray-200 dark:bg-gray-700'}`}>
          <IconComponent size={24} className={unlocked ? 'text-white' : 'text-gray-400'} />
        </div>
        <div className="flex-1">
          <h4 className={`font-bold text-sm ${unlocked ? 'text-white' : 'text-gray-700 dark:text-gray-300'}`}>
            {achievement.title}
          </h4>
          <p className={`text-xs mt-1 ${unlocked ? 'text-yellow-100' : 'text-gray-500 dark:text-gray-400'}`}>
            {achievement.description}
          </p>
          {unlocked && achievement.unlockedAt && (
            <p className="text-xs text-yellow-200 mt-1">
              Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
            </p>
          )}
        </div>
        {unlocked && (
          <Sparkles size={16} className="text-white animate-pulse" />
        )}
      </div>
      
      {!unlocked && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 rounded-2xl opacity-60"></div>
      )}
    </div>
  );
};

// Reset Confirmation Modal
const ResetModal = ({ isOpen, onClose, onConfirm, darkMode }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className={`w-full max-w-md p-6 rounded-3xl shadow-2xl ${
        darkMode 
          ? 'bg-gradient-to-br from-gray-800 to-gray-900' 
          : 'bg-gradient-to-br from-white to-gray-50'
      }`}>
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
            <ResetIcon size={32} className="text-red-600 dark:text-red-400" />
          </div>
          <h3 className="text-2xl font-bold mb-2">Reset Everything?</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            This will permanently delete all tasks, achievements, and statistics. This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-colors ${
                darkMode 
                  ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 py-3 px-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-colors"
            >
              Reset All Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Settings Modal Component
const SettingsModal = ({ 
  isOpen, 
  onClose, 
  darkMode, 
  soundEnabled, 
  setSoundEnabled, 
  categories, 
  setCategories,
  onReset 
}) => {
  const [newCategory, setNewCategory] = useState('');
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const addCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      setCategories([...categories, newCategory.trim()]);
      setNewCategory('');
    }
  };

  const removeCategory = (categoryToRemove) => {
    setCategories(categories.filter(cat => cat !== categoryToRemove));
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
        <div 
          className={`w-full max-w-md p-6 rounded-3xl shadow-2xl transform transition-all duration-300 ${
            darkMode 
              ? 'bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700' 
              : 'bg-gradient-to-br from-white to-gray-50 border border-gray-200'
          }`}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Settings
            </h2>
            <button 
              onClick={onClose}
              className={`p-2 rounded-xl transition-all duration-200 ${
                darkMode 
                  ? 'hover:bg-gray-700 text-gray-400 hover:text-white' 
                  : 'hover:bg-gray-200 text-gray-500 hover:text-gray-700'
              }`}
            >
              <X size={24} />
            </button>
          </div>

          <div className="space-y-6">
            {/* Sound Settings */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-800">
              <div className="flex items-center gap-3">
                {soundEnabled ? 
                  <Volume2 size={24} className="text-green-500" /> : 
                  <VolumeX size={24} className="text-red-500" />
                }
                <div>
                  <div className="font-semibold">Sound Effects</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Play sounds for actions</div>
                </div>
              </div>
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`w-14 h-7 rounded-full transition-all duration-300 ${
                  soundEnabled 
                    ? 'bg-green-500' 
                    : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white transform transition-transform duration-300 ${
                  soundEnabled ? 'translate-x-8' : 'translate-x-1'
                } shadow-lg`} />
              </button>
            </div>

            {/* Category Management */}
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800">
              <h3 className="font-semibold mb-3 text-lg">Categories</h3>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addCategory()}
                  placeholder="Add new category"
                  className={`flex-1 px-4 py-3 rounded-xl border-2 transition-colors ${
                    darkMode 
                      ? 'bg-gray-700 text-white border-gray-600 focus:border-purple-500' 
                      : 'bg-white text-gray-800 border-gray-300 focus:border-purple-400'
                  }`}
                />
                <button
                  onClick={addCategory}
                  className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 shadow-lg"
                >
                  Add
                </button>
              </div>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {categories.map((category) => (
                  <div key={category} className="flex justify-between items-center p-3 rounded-lg bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600">
                    <span className="font-medium">{category}</span>
                    <button
                      onClick={() => removeCategory(category)}
                      className="text-red-500 hover:text-red-700 transition-colors p-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-900"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Reset Section */}
            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700">
              <h3 className="font-semibold mb-3 text-lg text-red-800 dark:text-red-200">Danger Zone</h3>
              <p className="text-sm text-red-600 dark:text-red-300 mb-3">
                This will permanently delete all your data including tasks, achievements, and statistics.
              </p>
              <button
                onClick={() => setShowResetConfirm(true)}
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <ResetIcon size={20} />
                Reset All Data
              </button>
            </div>
          </div>
        </div>
      </div>

      <ResetModal
        isOpen={showResetConfirm}
        onClose={() => setShowResetConfirm(false)}
        onConfirm={() => {
          onReset();
          setShowResetConfirm(false);
          onClose();
        }}
        darkMode={darkMode}
      />
    </>
  );
};

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [filter, setFilter] = useState('all');
  const [darkMode, setDarkMode] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('normal');
  const [showConfetti, setShowConfetti] = useState(false);
  const [streak, setStreak] = useState(0);
  const [achievements, setAchievements] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [taskHistory, setTaskHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [categories, setCategories] = useState(['Work', 'Personal', 'Shopping', 'Health', 'Fitness']);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showAchievements, setShowAchievements] = useState(false);
  const [dueDateTime, setDueDateTime] = useState('');
  const [activeReminders, setActiveReminders] = useState([]);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [currentReminderTask, setCurrentReminderTask] = useState(null);
  const [reminderSoundPlaying, setReminderSoundPlaying] = useState(false);
  
  const audioContextRef = useRef(null);
  const reminderIntervalRef = useRef(null);
  const reminderSoundIntervalRef = useRef(null);
  const oscillatorRef = useRef(null);

  // Available achievements with icons and conditions
  const availableAchievements = [
    {
      id: 'first_task',
      title: 'First Step',
      description: 'Complete your first task',
      icon: Target,
      condition: (tasks) => tasks.filter(t => t.completed).length >= 1
    },
    {
      id: 'task_master',
      title: 'Task Master',
      description: 'Complete 10 tasks',
      icon: Trophy,
      condition: (tasks) => tasks.filter(t => t.completed).length >= 10
    },
    {
      id: 'productivity_guru',
      title: 'Productivity Guru',
      description: 'Complete 25 tasks',
      icon: TrendingUp,
      condition: (tasks) => tasks.filter(t => t.completed).length >= 25
    },
    {
      id: 'completionist',
      title: 'Completionist',
      description: 'Complete 50 tasks',
      icon: Crown,
      condition: (tasks) => tasks.filter(t => t.completed).length >= 50
    },
    {
      id: 'early_bird',
      title: 'Early Bird',
      description: 'Complete 5 tasks before 7 AM',
      icon: Clock,
      condition: (tasks) => tasks.filter(t => {
        if (!t.completedAt) return false;
        const completedTime = new Date(t.completedAt);
        return t.completed && completedTime.getHours() < 7;
      }).length >= 5
    },
    {
      id: 'weekend_warrior',
      title: 'Weekend Warrior',
      description: 'Complete 10 tasks on weekends',
      icon: Medal,
      condition: (tasks) => tasks.filter(t => {
        if (!t.completedAt) return false;
        const completedDate = new Date(t.completedAt);
        return t.completed && (completedDate.getDay() === 0 || completedDate.getDay() === 6);
      }).length >= 10
    },
    {
      id: 'speed_demon',
      title: 'Speed Demon',
      description: 'Complete 3 tasks within an hour',
      icon: Zap,
      condition: (tasks) => {
        const completedTasks = tasks.filter(t => t.completed && t.completedAt).sort((a, b) => 
          new Date(a.completedAt) - new Date(b.completedAt)
        );
        
        for (let i = 0; i < completedTasks.length - 2; i++) {
          const timeDiff = new Date(completedTasks[i + 2].completedAt) - new Date(completedTasks[i].completedAt);
          if (timeDiff <= 3600000) return true; // 1 hour in milliseconds
        }
        return false;
      }
    },
    {
      id: 'category_explorer',
      title: 'Category Explorer',
      description: 'Use 5 different categories',
      icon: Tag,
      condition: (tasks) => {
        const uniqueCategories = new Set(tasks.map(t => t.category));
        return uniqueCategories.size >= 5;
      }
    },
    {
      id: 'reminder_pro',
      title: 'Reminder Pro',
      description: 'Set reminders for 5 different tasks',
      icon: AlarmClock,
      condition: (tasks) => {
        const tasksWithReminders = tasks.filter(t => t.dueDateTime);
        return tasksWithReminders.length >= 5;
      }
    }
  ];

  // Enhanced data loading with better error handling
  useEffect(() => {
    const loadData = () => {
      try {
        console.log('Loading data from localStorage...');
        
        const savedTasks = localStorage.getItem('taskflow_tasks');
        const savedDarkMode = localStorage.getItem('taskflow_darkMode');
        const savedStreak = localStorage.getItem('taskflow_streak');
        const savedAchievements = localStorage.getItem('taskflow_achievements');
        const savedSound = localStorage.getItem('taskflow_soundEnabled');
        const savedCategories = localStorage.getItem('taskflow_categories');
        const savedLastCompletion = localStorage.getItem('taskflow_lastCompletion');
        
        console.log('Raw saved tasks:', savedTasks);
        
        if (savedTasks) {
          const parsedTasks = JSON.parse(savedTasks);
          console.log('Parsed tasks:', parsedTasks);
          setTasks(parsedTasks);
        }
        
        if (savedDarkMode !== null) {
          setDarkMode(savedDarkMode === 'true');
          document.documentElement.classList.toggle('dark', savedDarkMode === 'true');
        }
        
        if (savedStreak) setStreak(parseInt(savedStreak));
        if (savedAchievements) setAchievements(JSON.parse(savedAchievements));
        if (savedSound !== null) setSoundEnabled(savedSound === 'true');
        if (savedCategories) setCategories(JSON.parse(savedCategories));
        
        console.log('Data loaded successfully');
      } catch (error) {
        console.error('Error loading data from localStorage:', error);
        // Initialize with default values if loading fails
        setTasks([]);
        setAchievements([]);
        setStreak(0);
        setCategories(['Work', 'Personal', 'Shopping', 'Health', 'Fitness']);
      }
    };

    loadData();
  }, []);

  // Enhanced data saving
  useEffect(() => {
    const saveData = () => {
      try {
        console.log('Saving data to localStorage...');
        console.log('Current tasks:', tasks);
        
        localStorage.setItem('taskflow_tasks', JSON.stringify(tasks));
        localStorage.setItem('taskflow_darkMode', darkMode.toString());
        localStorage.setItem('taskflow_streak', streak.toString());
        localStorage.setItem('taskflow_achievements', JSON.stringify(achievements));
        localStorage.setItem('taskflow_soundEnabled', soundEnabled.toString());
        localStorage.setItem('taskflow_categories', JSON.stringify(categories));
        
        document.documentElement.classList.toggle('dark', darkMode);
        console.log('Data saved successfully');
      } catch (error) {
        console.error('Error saving data to localStorage:', error);
      }
    };

    saveData();
  }, [tasks, darkMode, streak, achievements, soundEnabled, categories]);

  // Play continuous reminder sound
  const playReminderSound = useCallback(() => {
    if (!soundEnabled || reminderSoundPlaying) return;
    
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      
      const context = audioContextRef.current;
      const oscillator = context.createOscillator();
      const gainNode = context.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(context.destination);
      
      // Continuous beep pattern
      oscillator.frequency.setValueAtTime(800, context.currentTime);
      gainNode.gain.setValueAtTime(0.3, context.currentTime);
      
      oscillator.start(context.currentTime);
      oscillatorRef.current = oscillator;
      setReminderSoundPlaying(true);
      
    } catch (error) {
      console.log('Reminder sound playback failed:', error);
    }
  }, [soundEnabled, reminderSoundPlaying]);

  // Stop reminder sound
  const stopReminderSound = useCallback(() => {
    if (oscillatorRef.current) {
      oscillatorRef.current.stop();
      oscillatorRef.current = null;
    }
    setReminderSoundPlaying(false);
  }, []);

  // Check for reminders
  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      const newActiveReminders = [];
      
      tasks.forEach(task => {
        if (task.dueDateTime && !task.completed && !task.reminderShown) {
          const dueDate = new Date(task.dueDateTime);
          const timeDiff = dueDate.getTime() - now.getTime();
          
          // Show reminder if due date is within 1 minute
          if (timeDiff > 0 && timeDiff <= 60000) {
            newActiveReminders.push(task);
          }
        }
      });
      
      // Show modal for new reminders
      if (newActiveReminders.length > 0 && !showReminderModal) {
        const nextReminder = newActiveReminders[0];
        setCurrentReminderTask(nextReminder);
        setShowReminderModal(true);
        playReminderSound();
        
        // Mark reminder as shown
        setTasks(prev => prev.map(t => 
          t.id === nextReminder.id ? { ...t, reminderShown: true } : t
        ));
      }
      
      setActiveReminders(newActiveReminders);
    };

    // Check reminders every 10 seconds for better accuracy
    reminderIntervalRef.current = setInterval(checkReminders, 10000);
    
    return () => {
      if (reminderIntervalRef.current) {
        clearInterval(reminderIntervalRef.current);
      }
      stopReminderSound();
    };
  }, [tasks, showReminderModal, playReminderSound, stopReminderSound]);

  // Handle reminder actions
  const handleSnooze = (taskId, minutes) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        const newDueDate = new Date(task.dueDateTime);
        newDueDate.setMinutes(newDueDate.getMinutes() + minutes);
        return {
          ...task,
          dueDateTime: newDueDate.toISOString(),
          reminderShown: false
        };
      }
      return task;
    });
    
    setTasks(updatedTasks);
    setShowReminderModal(false);
    stopReminderSound();
    showToastMessage(`Reminder snoozed for ${minutes} minutes ⏰`);
  };

  const handleStopReminder = (taskId) => {
    setTasks(prev => prev.map(t => 
      t.id === taskId ? { ...t, reminderShown: true } : t
    ));
    setShowReminderModal(false);
    stopReminderSound();
    showToastMessage('Reminder stopped 🔕');
  };

  // Check for new achievements whenever tasks change
  useEffect(() => {
    const unlockedAchievements = [];
    
    availableAchievements.forEach(achievement => {
      const isUnlocked = achievement.condition(tasks);
      const alreadyUnlocked = achievements.find(a => a.id === achievement.id);
      
      if (isUnlocked && !alreadyUnlocked) {
        unlockedAchievements.push({
          ...achievement,
          unlockedAt: new Date().toISOString()
        });
      }
    });
    
    if (unlockedAchievements.length > 0) {
      const newAchievements = [...achievements, ...unlockedAchievements];
      setAchievements(newAchievements);
      
      // Show toast for each new achievement
      unlockedAchievements.forEach(achievement => {
        showToastMessage(`🎉 Achievement Unlocked: ${achievement.title}!`);
      });
      
      // Trigger confetti for major achievements
      if (unlockedAchievements.some(a => ['completionist', 'productivity_guru'].includes(a.id))) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 4000);
      }
    }
  }, [tasks]);

  // Sound effects using Web Audio API
  const playSound = useCallback((type) => {
    if (!soundEnabled) return;
    
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      
      const context = audioContextRef.current;
      const oscillator = context.createOscillator();
      const gainNode = context.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(context.destination);
      
      switch(type) {
        case 'complete':
          oscillator.frequency.setValueAtTime(523.25, context.currentTime);
          oscillator.frequency.setValueAtTime(659.25, context.currentTime + 0.1);
          break;
        case 'add':
          oscillator.frequency.setValueAtTime(659.25, context.currentTime);
          oscillator.frequency.setValueAtTime(783.99, context.currentTime + 0.1);
          break;
        case 'achievement':
          oscillator.frequency.setValueAtTime(880, context.currentTime);
          oscillator.frequency.setValueAtTime(1046.5, context.currentTime + 0.1);
          oscillator.frequency.setValueAtTime(1318.5, context.currentTime + 0.2);
          break;
        default:
          oscillator.frequency.setValueAtTime(440, context.currentTime);
      }
      
      gainNode.gain.setValueAtTime(0.3, context.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.5);
      
      oscillator.start(context.currentTime);
      oscillator.stop(context.currentTime + 0.5);
    } catch (error) {
      console.log('Audio playback failed:', error);
    }
  }, [soundEnabled]);

  // Show toast notification
  const showToastMessage = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
  };

  // Save to history for undo/redo
  const saveToHistory = useCallback((newTasks) => {
    const newHistory = [...taskHistory.slice(0, historyIndex + 1), newTasks];
    setTaskHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [taskHistory, historyIndex]);

  // Add task
  const addTask = () => {
    if (newTask.trim() !== '') {
      const newTaskObj = {
        id: Date.now(),
        text: newTask.trim(),
        completed: false,
        createdAt: new Date().toISOString(),
        completedAt: null,
        priority: selectedPriority,
        category: selectedCategory === 'All' ? 'Personal' : selectedCategory,
        dueDateTime: dueDateTime || null,
        reminderShown: false
      };
      
      const updatedTasks = [...tasks, newTaskObj];
      setTasks(updatedTasks);
      saveToHistory(updatedTasks);
      setNewTask('');
      setDueDateTime('');
      playSound('add');
      showToastMessage('Task added successfully! 🚀');
    }
  };

  // Toggle complete
  const toggleComplete = (id) => {
    const updatedTasks = tasks.map(task =>
      task.id === id ? { 
        ...task, 
        completed: !task.completed,
        completedAt: !task.completed ? new Date().toISOString() : null
      } : task
    );
    
    setTasks(updatedTasks);
    saveToHistory(updatedTasks);
    playSound('complete');
    
    // Update streak
    const today = new Date().toDateString();
    const lastCompletion = localStorage.getItem('taskflow_lastCompletion');
    if (lastCompletion !== today) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      localStorage.setItem('taskflow_lastCompletion', today);
      
      if (newStreak % 7 === 0) {
        showToastMessage(`🔥 Amazing! ${newStreak} day streak!`);
      }
    }
    
    showToastMessage('Task completed! ✅');
  };

  // Delete task
  const deleteTask = (id) => {
    const updatedTasks = tasks.filter(task => task.id !== id);
    setTasks(updatedTasks);
    saveToHistory(updatedTasks);
    if (editingId === id) setEditingId(null);
    showToastMessage('Task deleted! 🗑️');
  };

  // Edit task
  const saveEdit = () => {
    if (editText.trim() !== '') {
      const updatedTasks = tasks.map(task =>
        task.id === editingId ? { ...task, text: editText.trim() } : task
      );
      setTasks(updatedTasks);
      saveToHistory(updatedTasks);
      setEditingId(null);
      showToastMessage('Task updated! ✏️');
    }
  };

  // Undo/Redo
  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setTasks(taskHistory[newIndex]);
      setHistoryIndex(newIndex);
      showToastMessage('Undo successful! ↩️');
    }
  };

  const redo = () => {
    if (historyIndex < taskHistory.length - 1) {
      const newIndex = historyIndex + 1;
      setTasks(taskHistory[newIndex]);
      setHistoryIndex(newIndex);
      showToastMessage('Redo successful! ↪️');
    }
  };

  // Clear completed tasks
  const clearCompleted = () => {
    const updatedTasks = tasks.filter(task => !task.completed);
    setTasks(updatedTasks);
    saveToHistory(updatedTasks);
    showToastMessage('Completed tasks cleared! 🧹');
  };

  // Reset all data
  const resetAllData = () => {
    setTasks([]);
    setAchievements([]);
    setStreak(0);
    setTaskHistory([]);
    setHistoryIndex(-1);
    localStorage.removeItem('taskflow_tasks');
    localStorage.removeItem('taskflow_achievements');
    localStorage.removeItem('taskflow_streak');
    localStorage.removeItem('taskflow_lastCompletion');
    localStorage.removeItem('taskflow_darkMode');
    localStorage.removeItem('taskflow_soundEnabled');
    localStorage.removeItem('taskflow_categories');
    showToastMessage('All data has been reset! 🔄');
  };

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.text.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || task.category === selectedCategory;
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
    
    let matchesStatus = true;
    if (filter === 'active') matchesStatus = !task.completed;
    if (filter === 'completed') matchesStatus = task.completed;
    
    return matchesSearch && matchesCategory && matchesPriority && matchesStatus;
  });

  // Stats
  const completedCount = tasks.filter(task => task.completed).length;
  const activeCount = tasks.length - completedCount;
  const progressPercentage = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;
  const upcomingTasks = tasks.filter(task => 
    task.dueDateTime && !task.completed && new Date(task.dueDateTime) > new Date()
  ).length;

  // Motivational quotes
  const quotes = [
    "The secret of getting ahead is getting started.",
    "Don't watch the clock; do what it does. Keep going.",
    "Small daily improvements are the key to staggering long-term results.",
    "Productivity is never an accident. It is always the result of a commitment to excellence.",
    "You don't have to see the whole staircase, just take the first step.",
    "The way to get started is to quit talking and begin doing.",
    "It's not about having time, it's about making time.",
    "Focus on being productive instead of busy."
  ];
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white' 
        : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 text-gray-800'
    }`}>
      {showConfetti && <Confetti />}
      
      {/* Reminder Modal */}
      <ReminderModal
        isOpen={showReminderModal}
        task={currentReminderTask}
        onSnooze={handleSnooze}
        onStop={handleStopReminder}
        darkMode={darkMode}
      />
      
      {/* Settings Modal */}
      <SettingsModal 
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        darkMode={darkMode}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        categories={categories}
        setCategories={setCategories}
        onReset={resetAllData}
      />
      
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-6 right-6 z-50 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-4 rounded-2xl shadow-2xl animate-fadeIn border border-white border-opacity-20">
          <div className="flex items-center gap-3">
            <Sparkles size={20} className="text-yellow-300" />
            <span className="font-semibold">{toastMessage}</span>
          </div>
        </div>
      )}
      
      <div className="max-w-7xl mx-auto pt-8 px-4 sm:px-6">
        {/* Header */}
        <div className={`p-8 rounded-3xl shadow-2xl mb-8 border ${
          darkMode 
            ? 'bg-gradient-to-r from-gray-800 to-gray-900 border-gray-700' 
            : 'bg-gradient-to-r from-white to-gray-50 border-gray-200'
        }`}>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                TaskFlow Pro
              </h1>
              <p className="text-lg mt-2 opacity-80">Your Ultimate Productivity Companion</p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowAchievements(!showAchievements)}
                className={`p-3 rounded-2xl transition-all duration-300 ${
                  darkMode 
                    ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400' 
                    : 'bg-white hover:bg-gray-100 text-yellow-500 shadow-lg'
                }`}
                aria-label="Achievements"
              >
                <Trophy size={24} />
              </button>
              <button 
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`p-3 rounded-2xl transition-all duration-300 ${
                  darkMode 
                    ? 'bg-gray-700 hover:bg-gray-600' 
                    : 'bg-white hover:bg-gray-100 shadow-lg'
                }`}
                aria-label={soundEnabled ? "Mute sound" : "Unmute sound"}
              >
                {soundEnabled ? 
                  <Volume2 size={24} className="text-green-500" /> : 
                  <VolumeX size={24} className="text-red-500" />
                }
              </button>
              <button 
                onClick={() => setDarkMode(!darkMode)}
                className={`p-3 rounded-2xl transition-all duration-300 ${
                  darkMode 
                    ? 'bg-yellow-500 hover:bg-yellow-400 text-gray-900' 
                    : 'bg-gray-800 hover:bg-gray-700 text-yellow-400 shadow-lg'
                }`}
                aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
              >
                {darkMode ? <Sun size={24} /> : <Moon size={24} />}
              </button>
              <button 
                onClick={() => setShowSettings(true)}
                className={`p-3 rounded-2xl transition-all duration-300 ${
                  darkMode 
                    ? 'bg-gray-700 hover:bg-gray-600' 
                    : 'bg-white hover:bg-gray-100 shadow-lg'
                }`}
                aria-label="Settings"
              >
                <Settings size={24} />
              </button>
            </div>
          </div>

          {/* Progress Section */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className={`p-6 rounded-2xl ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            } shadow-lg hover:scale-105 transition-transform duration-300`}>
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp size={24} className="text-green-500" />
                <h3 className="font-bold text-lg">Progress</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Completion</span>
                  <span className="text-2xl font-bold bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">
                    {progressPercentage}%
                  </span>
                </div>
                <div className={`w-full h-3 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-green-400 to-blue-500 transition-all duration-1000 ease-out"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm">
                  <span>{activeCount} tasks left</span>
                  <span className="flex items-center gap-1">
                    <Sparkles size={16} className="text-yellow-500" />
                    {streak} day streak
                  </span>
                </div>
              </div>
            </div>

            <div className={`p-6 rounded-2xl ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            } shadow-lg hover:scale-105 transition-transform duration-300`}>
              <div className="flex items-center gap-3 mb-4">
                <Target size={24} className="text-blue-500" />
                <h3 className="font-bold text-lg">Statistics</h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Total Tasks</span>
                  <span className="font-bold">{tasks.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Completed</span>
                  <span className="font-bold text-green-500">{completedCount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Active</span>
                  <span className="font-bold text-orange-500">{activeCount}</span>
                </div>
              </div>
            </div>

            <div className={`p-6 rounded-2xl ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            } shadow-lg hover:scale-105 transition-transform duration-300`}>
              <div className="flex items-center gap-3 mb-4">
                <AlarmClock size={24} className="text-purple-500" />
                <h3 className="font-bold text-lg">Reminders</h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Upcoming</span>
                  <span className="font-bold text-purple-500">{upcomingTasks}</span>
                </div>
                <div className="flex justify-between">
                  <span>With Due Date</span>
                  <span className="font-bold">{tasks.filter(t => t.dueDateTime).length}</span>
                </div>
              </div>
            </div>

            <div className={`p-6 rounded-2xl ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            } shadow-lg hover:scale-105 transition-transform duration-300`}>
              <div className="flex items-center gap-3 mb-4">
                <Rocket size={24} className="text-purple-500" />
                <h3 className="font-bold text-lg">Motivation</h3>
              </div>
              <p className="italic text-sm opacity-80">"{randomQuote}"</p>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Task Management */}
          <div className="lg:col-span-2 space-y-6">
            {/* Undo/Redo Controls */}
            <div className={`p-4 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
              <div className="flex gap-3">
                <button 
                  onClick={undo}
                  disabled={historyIndex <= 0}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-all duration-200 ${
                    historyIndex <= 0 
                      ? 'opacity-50 cursor-not-allowed' 
                      : 'hover:scale-105 shadow-md hover:bg-gray-200 dark:hover:bg-gray-700'
                  } ${
                    darkMode 
                      ? 'bg-gray-700 text-gray-300' 
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  <RotateCcw size={18} />
                  Undo
                </button>
                <button 
                  onClick={redo}
                  disabled={historyIndex >= taskHistory.length - 1}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-all duration-200 ${
                    historyIndex >= taskHistory.length - 1 
                      ? 'opacity-50 cursor-not-allowed' 
                      : 'hover:scale-105 shadow-md hover:bg-gray-200 dark:hover:bg-gray-700'
                  } ${
                    darkMode 
                      ? 'bg-gray-700 text-gray-300' 
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  <RotateCw size={18} />
                  Redo
                </button>
              </div>
            </div>

            {/* Add Task Form */}
            <div className={`p-6 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
              <div className="flex gap-3 mb-4">
                <input
                  type="text"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addTask()}
                  placeholder="What needs to be done?"
                  className={`flex-1 px-4 py-4 rounded-xl text-lg border-2 transition-colors ${
                    darkMode 
                      ? 'bg-gray-700 text-white border-gray-600 focus:border-purple-500' 
                      : 'border-gray-300 focus:border-purple-400 focus:ring-4 focus:ring-purple-100'
                  }`}
                />
                <button
                  onClick={addTask}
                  className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white p-4 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg font-semibold"
                  aria-label="Add task"
                >
                  <Plus size={24} />
                </button>
              </div>
              
              {/* Priority, Category, and DateTime Selection - FIXED LAYOUT */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <Zap size={20} className="text-yellow-500" />
                  <select 
                    value={selectedPriority}
                    onChange={(e) => setSelectedPriority(e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border-2 font-medium ${
                      darkMode 
                        ? 'bg-gray-700 text-white border-gray-600' 
                        : 'bg-white text-gray-700 border-gray-300'
                    }`}
                  >
                    <option value="low">Low Priority</option>
                    <option value="normal">Normal Priority</option>
                    <option value="high">High Priority</option>
                  </select>
                </div>
                
                <div className="flex items-center gap-2">
                  <Tag size={20} className="text-blue-500" />
                  <select 
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border-2 font-medium ${
                      darkMode 
                        ? 'bg-gray-700 text-white border-gray-600' 
                        : 'bg-white text-gray-700 border-gray-300'
                    }`}
                  >
                    <option value="All">All Categories</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Calendar size={20} className="text-green-500" />
                    <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Due Date & Time
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="date"
                      value={dueDateTime ? dueDateTime.split('T')[0] : ''}
                      onChange={(e) => {
                        const date = e.target.value;
                        const time = dueDateTime ? dueDateTime.split('T')[1] : '12:00';
                        setDueDateTime(date && time ? `${date}T${time}` : '');
                      }}
                      className={`flex-1 px-3 py-2 rounded-lg border-2 text-sm ${
                        darkMode 
                          ? 'bg-gray-700 text-white border-gray-600' 
                          : 'bg-white text-gray-800 border-gray-300'
                      }`}
                    />
                    <input
                      type="time"
                      value={dueDateTime ? dueDateTime.split('T')[1] : ''}
                      onChange={(e) => {
                        const time = e.target.value;
                        const date = dueDateTime ? dueDateTime.split('T')[0] : new Date().toISOString().split('T')[0];
                        setDueDateTime(date && time ? `${date}T${time}` : '');
                      }}
                      className={`flex-1 px-3 py-2 rounded-lg border-2 text-sm ${
                        darkMode 
                          ? 'bg-gray-700 text-white border-gray-600' 
                          : 'bg-white text-gray-800 border-gray-300'
                      }`}
                    />
                    {dueDateTime && (
                      <button
                        onClick={() => setDueDateTime('')}
                        className={`p-2 rounded-lg transition-colors ${
                          darkMode 
                            ? 'bg-gray-600 hover:bg-gray-500 text-white' 
                            : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                        }`}
                        title="Clear date and time"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Filters and Search */}
            <div className={`p-6 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
              <div className="flex flex-wrap gap-4">
                {/* Search */}
                <div className="flex-1 min-w-[250px]">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search tasks..."
                      className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 ${
                        darkMode 
                          ? 'bg-gray-700 text-white border-gray-600' 
                          : 'border-gray-300'
                      }`}
                    />
                  </div>
                </div>
                
                {/* Priority Filter */}
                <select 
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className={`px-4 py-3 rounded-xl border-2 font-medium ${
                    darkMode 
                      ? 'bg-gray-700 text-white border-gray-600' 
                      : 'bg-white text-gray-700 border-gray-300'
                  }`}
                >
                  <option value="all">All Priorities</option>
                  <option value="high">High Priority</option>
                  <option value="normal">Normal Priority</option>
                  <option value="low">Low Priority</option>
                </select>
                
                {/* Status Filter */}
                <div className="flex gap-2">
                  {['all', 'active', 'completed'].map((filterType) => (
                    <button
                      key={filterType}
                      onClick={() => setFilter(filterType)}
                      className={`px-4 py-3 rounded-xl capitalize font-medium transition-all duration-200 ${
                        filter === filterType
                          ? `${darkMode ? 'bg-purple-600 text-white' : 'bg-purple-500 text-white'} shadow-lg`
                          : `${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`
                      }`}
                    >
                      {filterType}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Task List */}
            <div className={`rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg overflow-hidden`}>
              <div className={`px-6 py-4 border-b ${
                darkMode ? 'border-gray-700' : 'border-gray-200'
              }`}>
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold">Tasks ({filteredTasks.length})</h3>
                  <button 
                    onClick={clearCompleted}
                    className={`text-red-500 hover:text-red-700 font-medium transition-colors ${
                      darkMode ? 'hover:text-red-400' : ''
                    }`}
                  >
                    Clear Completed
                  </button>
                </div>
              </div>
              
              <div className="max-h-[600px] overflow-y-auto">
                {filteredTasks.length === 0 ? (
                  <div className={`py-16 text-center ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    <div className="text-6xl mb-4">📝</div>
                    <div className="text-xl font-semibold mb-2">No tasks found</div>
                    <p className="text-sm opacity-75">
                      {searchTerm ? "Try a different search term" : 
                       filter === 'completed' ? "You haven't completed any tasks yet" : 
                       "Add your first task to get started!"}
                    </p>
                  </div>
                ) : (
                  <ul className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-100'}`}>
                    {filteredTasks.map((task) => (
                      <li 
                        key={task.id} 
                        className={`p-6 transition-all duration-300 ${
                          task.completed 
                            ? `${darkMode ? 'bg-gray-750' : 'bg-gray-50'} opacity-80` 
                            : `${darkMode ? 'hover:bg-gray-750' : 'hover:bg-gray-50'}`
                        }`}
                      >
                        {editingId === task.id ? (
                          <div className="flex gap-3">
                            <input
                              type="text"
                              value={editText}
                              onChange={(e) => setEditText(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && saveEdit()}
                              className={`flex-1 px-4 py-3 rounded-xl border-2 text-lg ${
                                darkMode 
                                  ? 'bg-gray-700 text-white border-purple-500' 
                                  : 'border-purple-400 focus:ring-4 focus:ring-purple-100'
                              }`}
                              autoFocus
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={saveEdit}
                                className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-xl transition-colors"
                                aria-label="Save"
                              >
                                <CheckCircle size={20} />
                              </button>
                              <button
                                onClick={() => setEditingId(null)}
                                className={`p-3 rounded-xl transition-colors ${
                                  darkMode 
                                    ? 'bg-gray-600 hover:bg-gray-500 text-white' 
                                    : 'bg-gray-300 hover:bg-gray-400 text-gray-700'
                                }`}
                                aria-label="Cancel"
                              >
                                <X size={20} />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-4">
                            <button
                              onClick={() => toggleComplete(task.id)}
                              className="flex-shrink-0 transition-transform duration-200 hover:scale-110"
                              aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
                            >
                              {task.completed ? (
                                <CheckCircle className="text-green-500" size={28} />
                              ) : (
                                <Circle className={`${
                                  darkMode 
                                    ? 'text-gray-400 hover:text-purple-400' 
                                    : 'text-gray-400 hover:text-purple-500'
                                }`} size={28} />
                              )}
                            </button>
                            <div className="flex-1 min-w-0">
                              <span
                                className={`block text-lg ${
                                  task.completed 
                                    ? 'line-through text-gray-500' 
                                    : `${darkMode ? 'text-white' : 'text-gray-800'}`
                                }`}
                              >
                                {task.text}
                              </span>
                              <div className="flex gap-2 mt-2 flex-wrap">
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                  darkMode ? 'bg-gray-700' : 'bg-gray-200'
                                }`}>
                                  {task.category}
                                </span>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                  task.priority === 'high' 
                                    ? 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100' 
                                    : task.priority === 'low' 
                                      ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                                      : 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100'
                                }`}>
                                  {task.priority}
                                </span>
                                {task.dueDateTime && (
                                  <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${
                                    darkMode ? 'bg-purple-800 text-purple-200' : 'bg-purple-100 text-purple-800'
                                  }`}>
                                    <Calendar size={12} />
                                    {new Date(task.dueDateTime).toLocaleDateString()} 
                                    {new Date(task.dueDateTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  setEditingId(task.id);
                                  setEditText(task.text);
                                }}
                                className={`p-2 rounded-lg transition-all duration-200 hover:scale-110 ${
                                  darkMode 
                                    ? 'text-gray-400 hover:text-purple-400 hover:bg-gray-700' 
                                    : 'text-gray-500 hover:text-purple-500 hover:bg-gray-200'
                                }`}
                                aria-label="Edit task"
                              >
                                <Edit3 size={20} />
                              </button>
                              <button
                                onClick={() => deleteTask(task.id)}
                                className={`p-2 rounded-lg transition-all duration-200 hover:scale-110 ${
                                  darkMode 
                                    ? 'text-gray-400 hover:text-red-400 hover:bg-gray-700' 
                                    : 'text-gray-500 hover:text-red-500 hover:bg-gray-200'
                                }`}
                                aria-label="Delete task"
                              >
                                <Trash2 size={20} />
                              </button>
                            </div>
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Achievements */}
          <div className="space-y-6">
            {/* Achievements Panel */}
            <div className={`p-6 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg sticky top-6`}>
              <div className="flex items-center gap-3 mb-6">
                <Trophy size={28} className="text-yellow-500" />
                <h3 className="text-2xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
                  Achievements
                </h3>
              </div>
              
              <div className="space-y-4">
                {availableAchievements.map((achievement) => {
                  const unlockedAchievement = achievements.find(a => a.id === achievement.id);
                  return (
                    <AchievementBadge
                      key={achievement.id}
                      achievement={achievement}
                      unlocked={!!unlockedAchievement}
                      onClick={() => {
                        if (unlockedAchievement) {
                          showToastMessage(`Achievement: ${achievement.title} - ${achievement.description}`);
                        }
                      }}
                    />
                  );
                })}
              </div>
              
              <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                <div className="text-center">
                  <div className="text-2xl font-bold mb-1">
                    {achievements.length}/{availableAchievements.length}
                  </div>
                  <div className="text-sm opacity-90">Achievements Unlocked</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={`mt-8 px-6 py-4 text-center text-sm rounded-2xl ${
          darkMode 
            ? 'bg-gray-800 text-gray-400' 
            : 'bg-white text-gray-500 shadow-lg'
        }`}>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-2">
            <span>TaskFlow Pro v5.0 • Professional Productivity Suite</span>
            <span className="hidden sm:block">•</span>
            <span>Made with ❤️ for maximum productivity</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;