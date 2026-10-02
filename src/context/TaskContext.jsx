import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_LAB_TASKS, INITIAL_PHARMACY_TASKS, INITIAL_COMPLETED_HISTORY, EARNINGS_SUMMARY } from '../data/mockData';
import { soundEffects } from '../utils/audio';

const TaskContext = createContext(null);

const DATA_VERSION = 'v6_pharmacy_flow_fixed';

export function TaskProvider({ children }) {
  const isOutdated = typeof window !== 'undefined' && localStorage.getItem('mediunify_data_version') !== DATA_VERSION;

  const [labTasks, setLabTasks] = useState(() => {
    if (isOutdated) return INITIAL_LAB_TASKS;
    const saved = localStorage.getItem('mediunify_lab_tasks');
    return saved ? JSON.parse(saved) : INITIAL_LAB_TASKS;
  });

  const [pharmacyTasks, setPharmacyTasks] = useState(() => {
    if (isOutdated) return INITIAL_PHARMACY_TASKS;
    const saved = localStorage.getItem('mediunify_pharmacy_tasks');
    return saved ? JSON.parse(saved) : INITIAL_PHARMACY_TASKS;
  });

  const [history, setHistory] = useState(() => {
    if (isOutdated) return INITIAL_COMPLETED_HISTORY;
    const saved = localStorage.getItem('mediunify_task_history');
    return saved ? JSON.parse(saved) : INITIAL_COMPLETED_HISTORY;
  });

  const [earnings, setEarnings] = useState(() => {
    if (isOutdated) return EARNINGS_SUMMARY;
    const saved = localStorage.getItem('mediunify_earnings');
    return saved ? JSON.parse(saved) : EARNINGS_SUMMARY;
  });

  // Save changes and data version to localStorage
  useEffect(() => {
    localStorage.setItem('mediunify_data_version', DATA_VERSION);
    localStorage.setItem('mediunify_lab_tasks', JSON.stringify(labTasks));
  }, [labTasks]);

  useEffect(() => {
    localStorage.setItem('mediunify_pharmacy_tasks', JSON.stringify(pharmacyTasks));
  }, [pharmacyTasks]);

  useEffect(() => {
    localStorage.setItem('mediunify_task_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem('mediunify_earnings', JSON.stringify(earnings));
  }, [earnings]);

  // Update specific task by ID
  const updateTaskStatus = (taskId, newStatus, extraData = {}) => {
    const isLab = taskId.startsWith('LAB');
    soundEffects.playSuccess();

    if (isLab) {
      setLabTasks(prev =>
        prev.map(t => {
          if (t.id === taskId) {
            const updated = { ...t, status: newStatus, ...extraData, lastUpdated: new Date().toLocaleTimeString() };
            if (newStatus === 'COMPLETED') {
              triggerCompletion(updated);
            }
            return updated;
          }
          return t;
        })
      );
    } else {
      setPharmacyTasks(prev =>
        prev.map(t => {
          if (t.id === taskId) {
            const updated = { ...t, status: newStatus, ...extraData, lastUpdated: new Date().toLocaleTimeString() };
            if (newStatus === 'COMPLETED') {
              triggerCompletion(updated);
            }
            return updated;
          }
          return t;
        })
      );
    }
  };

  const triggerCompletion = (task) => {
    soundEffects.playComplete();

    // Add to history
    const historyItem = {
      id: task.id,
      type: task.type,
      title: task.testName || (task.medicines && task.medicines[0]?.name) || 'Field Order',
      patientName: task.patientName,
      patientAddress: task.patientAddress || task.deliveryAddress,
      date: 'Today, ' + new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      completedTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'COMPLETED',
      earnings: task.earnings || 150,
      totalAmount: task.totalAmount,
      patientRating: 5.0,
      proofImage: task.proofImage || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&auto=format&fit=crop&q=80',
      proofSignature: task.proofSignature
    };

    setHistory(prev => [historyItem, ...prev]);

    // Increment today's earnings
    setEarnings(prev => ({
      ...prev,
      today: {
        ...prev.today,
        amount: prev.today.amount + (task.earnings || 150),
        tasksCompleted: prev.today.tasksCompleted + 1
      },
      thisWeek: {
        ...prev.thisWeek,
        amount: prev.thisWeek.amount + (task.earnings || 150),
        tasksCompleted: prev.thisWeek.tasksCompleted + 1
      },
      totalLifetime: prev.totalLifetime + (task.earnings || 150)
    }));
  };

  const resetAllTasks = () => {
    setLabTasks(INITIAL_LAB_TASKS);
    setPharmacyTasks(INITIAL_PHARMACY_TASKS);
    setHistory(INITIAL_COMPLETED_HISTORY);
    setEarnings(EARNINGS_SUMMARY);
    localStorage.removeItem('mediunify_lab_tasks');
    localStorage.removeItem('mediunify_pharmacy_tasks');
    localStorage.removeItem('mediunify_task_history');
    localStorage.removeItem('mediunify_earnings');
    soundEffects.playAlert();
  };

  const updateTaskOtp = (taskId, otpType, newOtp) => {
    const isLab = taskId.startsWith('LAB');
    if (isLab) {
      setLabTasks(prev => prev.map(t => t.id === taskId ? { ...t, [otpType]: newOtp } : t));
    } else {
      setPharmacyTasks(prev => prev.map(t => t.id === taskId ? { ...t, [otpType]: newOtp } : t));
    }
  };

  const getTaskById = (id) => {
    if (!id) return null;
    return (
      labTasks.find(t => t.id === id) ||
      pharmacyTasks.find(t => t.id === id) ||
      history.find(t => t.id === id) ||
      null
    );
  };

  return (
    <TaskContext.Provider
      value={{
        labTasks,
        pharmacyTasks,
        history,
        earnings,
        updateTaskStatus,
        updateTaskOtp,
        getTaskById,
        resetAllTasks
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
}
