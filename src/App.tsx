/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { jsPDF } from 'jspdf';
import { 
  DATA_MATRIX, 
  I18N, 
  Role, 
  Scenario 
} from './data/matrix';
import { 
  Shield, 
  Flame, 
  Activity, 
  DoorOpen, 
  Radio, 
  Volume2, 
  VolumeX, 
  Globe, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  ArrowRight, 
  ArrowLeft, 
  AlertTriangle, 
  Clock, 
  Download, 
  Share2, 
  Award, 
  Timer,
  Check
} from 'lucide-react';

interface CandidateAnswer {
  roleId: string;
  roleTitleEn: string;
  scenarioId: number;
  scenarioTitleEn: string;
  scenarioDescEn: string;
  chosen: 'FIGHT' | 'FLEE' | 'TIMEOUT';
  correctDecision: 'FIGHT' | 'FLEE';
  isCorrect: boolean;
  timeSpentSec: number;
  feedbackEn: {
    correct: string;
    incorrect: string;
    steps: string[];
  };
}

interface RoleResult {
  roleId: string;
  roleTitleEn: string;
  roleTitleAr: string;
  scorePercent: number;
  correctCount: number;
  totalQuestions: number;
  isPassed: boolean;
  answers: CandidateAnswer[];
}

const COUNTDOWN_INITIAL_SECONDS = 20;
const PASSING_THRESHOLD_PERCENT = 70;

export default function App() {
  const [lang, setLang] = useState<'en' | 'ar'>('en');
  // screen:
  // 0: Registration
  // 1: Role 1 Select (Primary 1/3)
  // 2: Active Scenario Playing (with realistic drill photo!)
  // 3: Intermission 1 (Role 1 Result)
  // 4: Role 2 Select (Secondary 2/3)
  // 5: Final Official Report (All 3 Roles)
  // 6: Intermission 2 (Role 2 Result)
  // 7: Role 3 Select (Tertiary 3/3)
  const [screen, setScreen] = useState<0 | 1 | 2 | 3 | 4 | 5 | 6 | 7>(0);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Participant credentials
  const [fullName, setFullName] = useState<string>('');
  const [empId, setEmpId] = useState<string>('');
  const [assessmentDate, setAssessmentDate] = useState<string>(() => {
    return new Date().toISOString().split('T')[0];
  });

  // Qualification State across 3 Roles
  const [attemptsCount, setAttemptsCount] = useState<number>(1);
  const [testStartTime, setTestStartTime] = useState<number | null>(null);
  const [totalElapsedTimeSec, setTotalElapsedTimeSec] = useState<number>(0);

  // Role 1 Data
  const [role1Id, setRole1Id] = useState<string | null>(null);
  const [role1Result, setRole1Result] = useState<RoleResult | null>(null);

  // Role 2 Data
  const [role2Id, setRole2Id] = useState<string | null>(null);
  const [role2Result, setRole2Result] = useState<RoleResult | null>(null);

  // Role 3 Data
  const [role3Id, setRole3Id] = useState<string | null>(null);
  const [role3Result, setRole3Result] = useState<RoleResult | null>(null);

  // Active Role & Scenario Progress
  const [activeRoleSlot, setActiveRoleSlot] = useState<1 | 2 | 3>(1);
  const [currentScenarioIdx, setCurrentScenarioIdx] = useState<number>(0);
  const [currentRoleAnswers, setCurrentRoleAnswers] = useState<CandidateAnswer[]>([]);
  const [answeredState, setAnsweredState] = useState<{
    chosen: 'FIGHT' | 'FLEE' | 'TIMEOUT';
    isCorrect: boolean;
  } | null>(null);

  // Per-Scenario Countdown Clock
  const [secondsRemaining, setSecondsRemaining] = useState<number>(COUNTDOWN_INITIAL_SECONDS);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const dict = I18N[lang];
  const isRtl = lang === 'ar';

  // Synchronize document direction and lang
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
  }, [lang, isRtl]);

  // Smooth scroll to top helper
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Sound generator
  const playSound = (type: 'click' | 'correct' | 'incorrect' | 'transition' | 'tick' | 'alarm') => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'click') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(400, now + 0.04);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
        osc.start(now);
        osc.stop(now + 0.04);
      } else if (type === 'tick') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1000, now);
        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
        osc.start(now);
        osc.stop(now + 0.03);
      } else if (type === 'correct') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.setValueAtTime(659.25, now + 0.08);
        osc.frequency.setValueAtTime(783.99, now + 0.16);
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.35);
      } else if (type === 'incorrect' || type === 'alarm') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.setValueAtTime(164.81, now + 0.12);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.32);
        osc.start(now);
        osc.stop(now + 0.32);
      } else if (type === 'transition') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.12);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc.start(now);
        osc.stop(now + 0.12);
      }
    } catch {
      // Audio fallback safe
    }
  };

  // Screen transition with smooth scroll
  const changeScreen = (nextScreen: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7) => {
    setScreen(nextScreen);
    playSound('transition');
    scrollToTop();
  };

  // Active role definition
  const currentRoleId = activeRoleSlot === 1 ? role1Id : (activeRoleSlot === 2 ? role2Id : role3Id);
  const currentRoleScenarios = currentRoleId 
    ? DATA_MATRIX.scenarios.filter(s => s.roleId === currentRoleId)
    : [];
  const currentScenario: Scenario | undefined = currentRoleScenarios[currentScenarioIdx];
  const currentRoleInfo: Role | undefined = DATA_MATRIX.roles.find(r => r.id === currentRoleId);

  // Manage Countdown Clock
  useEffect(() => {
    if (screen === 2 && isTimerRunning && !answeredState) {
      timerRef.current = setInterval(() => {
        setSecondsRemaining(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            handleTimeExpired();
            return 0;
          }
          if (prev <= 5) {
            playSound('tick');
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [screen, isTimerRunning, answeredState, currentScenarioIdx]);

  // When a new scenario loads, reset countdown and start
  const startScenarioCountdown = () => {
    setSecondsRemaining(COUNTDOWN_INITIAL_SECONDS);
    setIsTimerRunning(true);
    setAnsweredState(null);
  };

  // Handle Timeout (Hesitation in Emergency)
  const handleTimeExpired = () => {
    if (!currentScenario || answeredState) return;
    setIsTimerRunning(false);
    playSound('alarm');

    const roleObj = DATA_MATRIX.roles.find(r => r.id === currentRoleId);
    const newAnswer: CandidateAnswer = {
      roleId: currentRoleId || '',
      roleTitleEn: roleObj ? roleObj.title.en : 'ERT Role',
      scenarioId: currentScenario.id,
      scenarioTitleEn: currentScenario.title.en,
      scenarioDescEn: currentScenario.description.en,
      chosen: 'TIMEOUT',
      correctDecision: currentScenario.correctDecision,
      isCorrect: false,
      timeSpentSec: COUNTDOWN_INITIAL_SECONDS,
      feedbackEn: currentScenario.feedback.en
    };

    setCurrentRoleAnswers(prev => [...prev, newAnswer]);
    setAnsweredState({ chosen: 'TIMEOUT', isCorrect: false });
    scrollToTop();
  };

  // Form Validation for Screen 0
  const isFormValid = fullName.trim().length > 0 && empId.trim().length > 0 && assessmentDate.trim().length > 0;

  // Handle Start Assessment from Screen 0
  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    setTestStartTime(Date.now());
    changeScreen(1);
  };

  // Select Primary Role (Screen 1)
  const handleSelectRole1 = (roleId: string) => {
    setRole1Id(roleId);
    setActiveRoleSlot(1);
    setCurrentScenarioIdx(0);
    setCurrentRoleAnswers([]);
    setAnsweredState(null);
    changeScreen(2);
    startScenarioCountdown();
  };

  // Select Secondary Role (Screen 4)
  const handleSelectRole2 = (roleId: string) => {
    setRole2Id(roleId);
    setActiveRoleSlot(2);
    setCurrentScenarioIdx(0);
    setCurrentRoleAnswers([]);
    setAnsweredState(null);
    changeScreen(2);
    startScenarioCountdown();
  };

  // Select Tertiary Role (Screen 7)
  const handleSelectRole3 = (roleId: string) => {
    setRole3Id(roleId);
    setActiveRoleSlot(3);
    setCurrentScenarioIdx(0);
    setCurrentRoleAnswers([]);
    setAnsweredState(null);
    changeScreen(2);
    startScenarioCountdown();
  };

  // Handle Decision (FIGHT / FLEE)
  const handleDecision = (choice: 'FIGHT' | 'FLEE') => {
    if (!currentScenario || answeredState) return;

    // CRITICAL: Stop countdown clock immediately
    setIsTimerRunning(false);
    if (timerRef.current) clearInterval(timerRef.current);

    const timeSpent = COUNTDOWN_INITIAL_SECONDS - secondsRemaining;
    const isCorrect = choice === currentScenario.correctDecision;

    playSound(isCorrect ? 'correct' : 'incorrect');

    const roleObj = DATA_MATRIX.roles.find(r => r.id === currentRoleId);
    const newAnswer: CandidateAnswer = {
      roleId: currentRoleId || '',
      roleTitleEn: roleObj ? roleObj.title.en : 'ERT Role',
      scenarioId: currentScenario.id,
      scenarioTitleEn: currentScenario.title.en,
      scenarioDescEn: currentScenario.description.en,
      chosen: choice,
      correctDecision: currentScenario.correctDecision,
      isCorrect,
      timeSpentSec: timeSpent,
      feedbackEn: currentScenario.feedback.en
    };

    setCurrentRoleAnswers(prev => [...prev, newAnswer]);
    setAnsweredState({ chosen: choice, isCorrect });

    // CRITICAL: Smooth scroll to top immediately after submitting an answer
    scrollToTop();
  };

  // Handle Next Scenario within active role
  const handleNextScenario = () => {
    if (currentScenarioIdx < currentRoleScenarios.length - 1) {
      setCurrentScenarioIdx(prev => prev + 1);
      startScenarioCountdown();
      playSound('transition');
      scrollToTop();
    } else {
      // Completed all 5 scenarios of current role
      finishCurrentRole();
    }
  };

  // Finish current role evaluation
  const finishCurrentRole = () => {
    const totalQ = currentRoleScenarios.length;
    const correctCount = currentRoleAnswers.filter(a => a.isCorrect).length;
    const scorePct = Math.round((correctCount / totalQ) * 100);
    const passed = scorePct >= PASSING_THRESHOLD_PERCENT;

    const roleObj = DATA_MATRIX.roles.find(r => r.id === currentRoleId);
    const resultObj: RoleResult = {
      roleId: currentRoleId || '',
      roleTitleEn: roleObj ? roleObj.title.en : 'ERT Role',
      roleTitleAr: roleObj ? roleObj.title.ar : 'دور فريق الطوارئ',
      scorePercent: scorePct,
      correctCount,
      totalQuestions: totalQ,
      isPassed: passed,
      answers: currentRoleAnswers
    };

    if (activeRoleSlot === 1) {
      setRole1Result(resultObj);
      changeScreen(3); // Intermission 1 for Role 1
    } else if (activeRoleSlot === 2) {
      setRole2Result(resultObj);
      changeScreen(6); // Intermission 2 for Role 2
    } else {
      setRole3Result(resultObj);
      // Finished all 3 Roles! Calculate total elapsed time and go to Final Report
      if (testStartTime) {
        setTotalElapsedTimeSec(Math.round((Date.now() - testStartTime) / 1000));
      }
      changeScreen(5); // Final Official Report
    }
  };

  // Retake Active Role (increments attempts)
  const handleRetakeActiveRole = () => {
    setAttemptsCount(prev => prev + 1);
    setCurrentScenarioIdx(0);
    setCurrentRoleAnswers([]);
    setAnsweredState(null);
    changeScreen(2);
    startScenarioCountdown();
  };

  // Retake Full Assessment
  const handleRetakeFullAssessment = () => {
    setAttemptsCount(prev => prev + 1);
    setRole1Id(null);
    setRole1Result(null);
    setRole2Id(null);
    setRole2Result(null);
    setRole3Id(null);
    setRole3Result(null);
    setActiveRoleSlot(1);
    setCurrentScenarioIdx(0);
    setCurrentRoleAnswers([]);
    setAnsweredState(null);
    setTestStartTime(Date.now());
    changeScreen(1);
  };

  // Handle Download Report (Generates and downloads official PDF file with all 3 roles!)
  const handleDownloadReport = () => {
    playSound('click');

    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = 210;
      const margin = 14;
      const contentWidth = pageWidth - margin * 2; // 182mm
      let y = 14;

      const checkPageBreak = (neededHeight: number) => {
        if (y + neededHeight > 275) {
          doc.addPage();
          y = 14;
          // Running top header
          doc.setFontSize(8);
          doc.setTextColor(148, 163, 184);
          doc.text(`KSIA ERT Official Qualification Report • Candidate: ${fullName || 'Responder'} (${empId || 'N/A'})`, margin, y);
          doc.setDrawColor(226, 232, 240);
          doc.line(margin, y + 2, margin + contentWidth, y + 2);
          y += 8;
        }
      };

      // 1. Top Header Banner (Dark slate fill)
      doc.setFillColor(15, 23, 42); // #0f172a
      doc.roundedRect(margin, y, contentWidth, 20, 2, 2, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(255, 255, 255);
      doc.text('KING SALMAN INTERNATIONAL AIRPORT (KSIA)', margin + 6, y + 8);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(56, 189, 248); // #38bdf8
      doc.text('EMERGENCY RESPONSE TEAM (ERT) • TRIPLE-ROLE QUALIFICATION REPORT', margin + 6, y + 14);

      // Serial Code Pill in top right
      const serialText = `KSIA-ERT-2026-${allThreeRolesPassed ? 'QUALIFIED' : 'PENDING'}`;
      doc.setFillColor(30, 41, 59);
      doc.roundedRect(margin + contentWidth - 46, y + 4, 42, 12, 1, 1, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(56, 189, 248);
      doc.text(serialText, margin + contentWidth - 44, y + 11);

      y += 24;

      // 2. Candidate & Session Details Grid
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(margin, y, contentWidth, 18, 2, 2, 'FD');

      const colWidth = contentWidth / 4;

      // Col 1: Name
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.setTextColor(100, 116, 139);
      doc.text('CANDIDATE NAME', margin + 4, y + 6);
      doc.setFontSize(9);
      doc.setTextColor(15, 23, 42);
      doc.text(doc.splitTextToSize(fullName || 'Responder', colWidth - 6)[0], margin + 4, y + 13);

      // Col 2: Employee ID
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.setTextColor(100, 116, 139);
      doc.text('EMPLOYEE ID', margin + colWidth + 4, y + 6);
      doc.setFontSize(9);
      doc.setTextColor(15, 23, 42);
      doc.text(empId || 'N/A', margin + colWidth + 4, y + 13);

      // Col 3: Date
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.setTextColor(100, 116, 139);
      doc.text('ASSESSMENT DATE', margin + colWidth * 2 + 4, y + 6);
      doc.setFontSize(9);
      doc.setTextColor(15, 23, 42);
      doc.text(assessmentDate || '2026-10-09', margin + colWidth * 2 + 4, y + 13);

      // Col 4: Attempts & Time
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.setTextColor(100, 116, 139);
      doc.text('ATTEMPTS & TIME', margin + colWidth * 3 + 4, y + 6);
      doc.setFontSize(9);
      doc.setTextColor(15, 23, 42);
      doc.text(`Att #${attemptsCount} • ${formatTime(totalElapsedTimeSec)}`, margin + colWidth * 3 + 4, y + 13);

      y += 22;

      // 3. Three Roles Summary Cards (3 Columns)
      const thirdWidth = (contentWidth - 8) / 3;

      // Role 1 Card
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(margin, y, thirdWidth, 22, 2, 2, 'FD');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.setTextColor(2, 132, 199);
      doc.text(`ROLE 1: ${(role1Result?.roleTitleEn || 'N/A').toUpperCase()}`, margin + 3, y + 5);
      const r1Passed = role1Result?.isPassed ?? false;
      doc.setFontSize(6.5);
      doc.setTextColor(r1Passed ? 22 : 220, r1Passed ? 163 : 38, r1Passed ? 74 : 38);
      doc.text(r1Passed ? 'PASSED (>=70%)' : 'NEEDS RETRAIN', margin + 3, y + 10);
      doc.setFontSize(12);
      doc.setTextColor(15, 23, 42);
      doc.text(`${role1Result?.scorePercent || 0}%`, margin + 3, y + 18);
      doc.setFontSize(7);
      doc.setTextColor(100, 116, 139);
      doc.text(`(${role1Result?.correctCount || 0}/5 Correct)`, margin + 17, y + 18);

      // Role 2 Card
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(margin + thirdWidth + 4, y, thirdWidth, 22, 2, 2, 'FD');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.setTextColor(2, 132, 199);
      doc.text(`ROLE 2: ${(role2Result?.roleTitleEn || 'N/A').toUpperCase()}`, margin + thirdWidth + 7, y + 5);
      const r2Passed = role2Result?.isPassed ?? false;
      doc.setFontSize(6.5);
      doc.setTextColor(r2Passed ? 22 : 220, r2Passed ? 163 : 38, r2Passed ? 74 : 38);
      doc.text(r2Passed ? 'PASSED (>=70%)' : 'NEEDS RETRAIN', margin + thirdWidth + 7, y + 10);
      doc.setFontSize(12);
      doc.setTextColor(15, 23, 42);
      doc.text(`${role2Result?.scorePercent || 0}%`, margin + thirdWidth + 7, y + 18);
      doc.setFontSize(7);
      doc.setTextColor(100, 116, 139);
      doc.text(`(${role2Result?.correctCount || 0}/5 Correct)`, margin + thirdWidth + 21, y + 18);

      // Role 3 Card
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(margin + (thirdWidth + 4) * 2, y, thirdWidth, 22, 2, 2, 'FD');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.setTextColor(2, 132, 199);
      doc.text(`ROLE 3: ${(role3Result?.roleTitleEn || 'N/A').toUpperCase()}`, margin + (thirdWidth + 4) * 2 + 3, y + 5);
      const r3Passed = role3Result?.isPassed ?? false;
      doc.setFontSize(6.5);
      doc.setTextColor(r3Passed ? 22 : 220, r3Passed ? 163 : 38, r3Passed ? 74 : 38);
      doc.text(r3Passed ? 'PASSED (>=70%)' : 'NEEDS RETRAIN', margin + (thirdWidth + 4) * 2 + 3, y + 10);
      doc.setFontSize(12);
      doc.setTextColor(15, 23, 42);
      doc.text(`${role3Result?.scorePercent || 0}%`, margin + (thirdWidth + 4) * 2 + 3, y + 18);
      doc.setFontSize(7);
      doc.setTextColor(100, 116, 139);
      doc.text(`(${role3Result?.correctCount || 0}/5 Correct)`, margin + (thirdWidth + 4) * 2 + 17, y + 18);

      y += 26;

      // 4. Overall Qualification Banner
      if (allThreeRolesPassed) {
        doc.setFillColor(240, 253, 244);
        doc.setDrawColor(22, 163, 74);
      } else {
        doc.setFillColor(254, 242, 242);
        doc.setDrawColor(220, 38, 38);
      }
      doc.roundedRect(margin, y, contentWidth, 18, 2, 2, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(allThreeRolesPassed ? 21 : 185, allThreeRolesPassed ? 128 : 28, allThreeRolesPassed ? 61 : 28);
      doc.text(allThreeRolesPassed ? 'PASSED -- TRIPLE-ROLE QUALIFIED' : 'NEEDS RETRAINING -- RE-EVALUATION REQUIRED', margin + 6, y + 7);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(51, 65, 85);
      const statusDesc = allThreeRolesPassed
        ? 'Candidate has successfully demonstrated tactical emergency readiness across three required operational roles (Threshold: 70% in each).'
        : 'Candidate did not reach the mandatory 70% passing threshold in all three roles. Retraining required before active deployment.';
      doc.text(doc.splitTextToSize(statusDesc, contentWidth - 30), margin + 6, y + 13);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.setTextColor(allThreeRolesPassed ? 21 : 185, allThreeRolesPassed ? 128 : 28, allThreeRolesPassed ? 61 : 28);
      doc.text(`${overallScorePercent}%`, margin + contentWidth - 18, y + 11);

      y += 24;

      // 5. Itemized Breakdown Heading
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(15, 23, 42);
      doc.text('ITEMIZED SCENARIO PERFORMANCE & STANDARD OPERATING PROCEDURES (SOP)', margin, y);
      doc.setDrawColor(226, 232, 240);
      doc.line(margin, y + 2, margin + contentWidth, y + 2);
      y += 7;

      // 6. Loop through all 15 scenarios across all 3 roles
      combinedAnswers.forEach((ans) => {
        const titleLines = doc.splitTextToSize(`[${ans.roleTitleEn}] ${ans.scenarioTitleEn}`, contentWidth - 35);
        const explText = `Tactical Rationale: ${ans.isCorrect ? ans.feedbackEn.correct : ans.feedbackEn.incorrect}`;
        const explLines = doc.splitTextToSize(explText, contentWidth - 10);
        
        let sopLineCount = 0;
        ans.feedbackEn.steps.forEach(st => {
          const stLines = doc.splitTextToSize(`- ${st}`, contentWidth - 14);
          sopLineCount += stLines.length;
        });

        const cardHeight = 16 + titleLines.length * 4 + explLines.length * 3.5 + sopLineCount * 3.5 + 4;

        checkPageBreak(cardHeight);

        // Card container
        doc.setFillColor(255, 255, 255);
        doc.setDrawColor(226, 232, 240);
        doc.roundedRect(margin, y, contentWidth, cardHeight - 2, 1.5, 1.5, 'FD');

        // Color accent border on left
        doc.setFillColor(ans.isCorrect ? 22 : 220, ans.isCorrect ? 163 : 38, ans.isCorrect ? 74 : 38);
        doc.rect(margin, y, 2.5, cardHeight - 2, 'F');

        let cardY = y + 5;

        // Title
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(15, 23, 42);
        doc.text(titleLines, margin + 5, cardY);

        // Badge
        const badgeLabel = ans.isCorrect ? 'CORRECT' : (ans.chosen === 'TIMEOUT' ? 'TIMED OUT' : 'INCORRECT');
        doc.setFontSize(7);
        doc.setTextColor(ans.isCorrect ? 22 : 220, ans.isCorrect ? 163 : 38, ans.isCorrect ? 74 : 38);
        doc.text(badgeLabel, margin + contentWidth - 22, cardY);

        cardY += titleLines.length * 4 + 1;

        // Candidate Choice vs Mandated
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(71, 85, 105);
        doc.text(`Candidate Decision: ${ans.chosen}  |  Required Protocol: ${ans.correctDecision}  |  Time: ${ans.timeSpentSec}s`, margin + 5, cardY);
        cardY += 4.5;

        // Tactical Explanation
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(51, 65, 85);
        doc.text(explLines, margin + 5, cardY);
        cardY += explLines.length * 3.5 + 1;

        // SOP divider and steps
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7);
        doc.setTextColor(2, 132, 199);
        doc.text('Standard Operating Procedures (SOP):', margin + 5, cardY);
        cardY += 3.5;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7);
        doc.setTextColor(100, 116, 139);
        ans.feedbackEn.steps.forEach(st => {
          const stLines = doc.splitTextToSize(`- ${st}`, contentWidth - 12);
          doc.text(stLines, margin + 6, cardY);
          cardY += stLines.length * 3.5;
        });

        y += cardHeight + 2;
      });

      // Save PDF file
      const cleanEmpId = (empId.trim() || 'Candidate').replace(/[^a-zA-Z0-9-_]/g, '_');
      doc.save(`KSIA_ERT_Qualification_Report_${cleanEmpId}.pdf`);
    } catch (err) {
      console.error('PDF Generation Error:', err);
    }
  };

  // Format seconds into minutes and seconds
  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    if (mins === 0) return `${secs}s`;
    return `${mins}m ${secs}s`;
  };

  // Render role icons
  const renderRoleIcon = (iconType: string, className = "w-6 h-6") => {
    switch (iconType) {
      case 'shield': return <Shield className={className} />;
      case 'flame': return <Flame className={className} />;
      case 'cross': return <Activity className={className} />;
      case 'door': return <DoorOpen className={className} />;
      case 'radio': return <Radio className={className} />;
      default: return <Shield className={className} />;
    }
  };

  // Overall combined score for Final Report (across all 3 roles!)
  const combinedAnswers = [
    ...(role1Result?.answers || []),
    ...(role2Result?.answers || []),
    ...(role3Result?.answers || [])
  ];
  const combinedCorrect = combinedAnswers.filter(a => a.isCorrect).length;
  const combinedTotal = combinedAnswers.length || 15;
  const overallScorePercent = combinedTotal > 0 ? Math.round((combinedCorrect / combinedTotal) * 100) : 0;
  const allThreeRolesPassed = (role1Result?.isPassed ?? false) && (role2Result?.isPassed ?? false) && (role3Result?.isPassed ?? false);

  return (
    <div className="min-h-screen bg-[#0f172a] text-[#f8fafc] font-sans flex flex-col justify-between selection:bg-[#0284c7] selection:text-white">
      {/* Top Main Container */}
      <div className="w-full max-w-4xl mx-auto p-4 md:p-6 flex-1 flex flex-col">
        
        {/* TOP TACTICAL NAVIGATION BAR (Always visible) */}
        <header className="flex items-center justify-between gap-3 p-3 md:p-4 bg-[#1e293b] border border-[#334155] rounded-xl shadow-lg mb-4 print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#0284c7] to-[#0f172a] border border-[#38bdf8] flex items-center justify-center text-[#38bdf8] shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-sm md:text-base font-extrabold tracking-wider uppercase text-white leading-tight">
                {dict.appTitle}
              </h1>
              <p className="text-[11px] md:text-xs text-[#38bdf8] font-semibold tracking-wide">
                {dict.appSubtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Audio Toggle */}
            <button
              type="button"
              onClick={() => {
                setSoundEnabled(prev => !prev);
                playSound('click');
              }}
              className="p-2 rounded-lg bg-[#0f172a] border border-[#334155] hover:border-[#0284c7] text-[#94a3b8] hover:text-[#38bdf8] transition-colors"
              title="Toggle Audio FX"
              aria-label="Toggle Audio FX"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-[#38bdf8]" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Language Switcher */}
            <button
              type="button"
              onClick={() => {
                playSound('click');
                setLang(prev => prev === 'en' ? 'ar' : 'en');
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#0f172a] border border-[#334155] hover:border-[#0284c7] text-[#f8fafc] text-xs font-bold transition-all shadow-sm"
              aria-label="Toggle Language"
            >
              <Globe className="w-3.5 h-3.5 text-[#38bdf8]" />
              <span>{dict.langToggleLabel}</span>
            </button>
          </div>
        </header>

        {/* Tactical Status Ribbon */}
        <div className="flex items-center justify-between gap-2 px-3.5 py-2 bg-[#0284c7]/10 border border-[#0284c7]/30 rounded-lg mb-5 text-xs font-semibold text-[#38bdf8] print:hidden">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#22c55e]" />
            <span className="uppercase tracking-wider">
              {dict.statusPrefix}
              {screen === 0 && dict.stateScreen0}
              {screen === 1 && dict.stateScreen1Role1}
              {screen === 2 && dict.stateScreen2.replace('%idx%', (currentScenarioIdx + 1).toString())}
              {screen === 3 && `ROLE 1 EVALUATION // ${role1Result?.isPassed ? 'PASSED' : 'RETRY'}`}
              {screen === 4 && dict.stateScreen1Role2}
              {screen === 6 && `ROLE 2 EVALUATION // ${role2Result?.isPassed ? 'PASSED' : 'RETRY'}`}
              {screen === 7 && dict.stateScreen1Role3}
              {screen === 5 && dict.stateScreen3}
            </span>
          </div>
          <div className="flex items-center gap-3 font-mono text-[11px] text-[#94a3b8]">
            <span>ATTEMPT #{attemptsCount}</span>
            <span className="hidden sm:inline">|</span>
            <span className="hidden sm:inline">{dict.sessionReady}</span>
          </div>
        </div>

        {/* ================= SCREEN 0: PARTICIPANT REGISTRATION ================= */}
        {screen === 0 && (
          <div className="bg-[#1e293b] border border-[#334155] rounded-2xl p-6 md:p-8 shadow-2xl animate-in fade-in duration-300">
            <div className="border-b border-[#334155] pb-4 mb-6">
              <span className="inline-block px-2.5 py-1 bg-[#0284c7]/15 border border-[#0284c7]/40 text-[#38bdf8] text-[11px] font-bold tracking-wider rounded-md uppercase mb-2">
                {dict.tagScreen0}
              </span>
              <h2 className="text-xl md:text-2xl font-extrabold text-white">
                {dict.titleScreen0}
              </h2>
              <p className="text-sm text-[#94a3b8] mt-1 leading-relaxed">
                {dict.descScreen0}
              </p>
            </div>

            <form onSubmit={handleStart} className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#f8fafc] mb-2" htmlFor="inp-name">
                  {dict.lblFullName} <span className="text-red-500">*</span>
                </label>
                <input
                  id="inp-name"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Tariq Al-Ghamdi"
                  required
                  className="w-full bg-[#0b1120] border border-[#334155] focus:border-[#0284c7] focus:ring-2 focus:ring-[#0284c7]/30 text-white rounded-xl px-4 py-3.5 text-sm outline-none transition"
                />
                <p className="text-[11px] text-[#64748b] mt-1">{dict.helpFullName}</p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#f8fafc] mb-2" htmlFor="inp-emp">
                  {dict.lblEmpId} <span className="text-red-500">*</span>
                </label>
                <input
                  id="inp-emp"
                  type="text"
                  value={empId}
                  onChange={(e) => setEmpId(e.target.value)}
                  placeholder="e.g. KSIA-4421"
                  required
                  className="w-full bg-[#0b1120] border border-[#334155] focus:border-[#0284c7] focus:ring-2 focus:ring-[#0284c7]/30 text-white rounded-xl px-4 py-3.5 text-sm outline-none transition font-mono"
                />
                <p className="text-[11px] text-[#64748b] mt-1">{dict.helpEmpId}</p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#f8fafc] mb-2" htmlFor="inp-date">
                  {dict.lblDate} <span className="text-red-500">*</span>
                </label>
                <input
                  id="inp-date"
                  type="date"
                  value={assessmentDate}
                  onChange={(e) => setAssessmentDate(e.target.value)}
                  required
                  className="w-full bg-[#0b1120] border border-[#334155] focus:border-[#0284c7] focus:ring-2 focus:ring-[#0284c7]/30 text-white rounded-xl px-4 py-3.5 text-sm outline-none transition"
                />
                <p className="text-[11px] text-[#64748b] mt-1">{dict.helpDate}</p>
              </div>

              {/* Directive Alert Box */}
              <div className="bg-[#0b1120]/80 border border-dashed border-[#334155] rounded-xl p-4 flex gap-3 items-start">
                <Clock className="w-5 h-5 text-[#38bdf8] shrink-0 mt-0.5" />
                <div 
                  className="text-xs text-[#94a3b8] leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: dict.boxDirective }}
                />
              </div>

              <button
                type="submit"
                disabled={!isFormValid}
                className="w-full bg-[#0284c7] hover:bg-[#0369a1] disabled:bg-[#1e293b] disabled:border disabled:border-[#334155] disabled:text-[#64748b] disabled:cursor-not-allowed text-white font-extrabold uppercase tracking-wider text-sm md:text-base py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-[#0284c7]/20 transition-all duration-200"
              >
                <span>{dict.btnStart}</span>
                {isRtl ? <ArrowLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
              </button>
            </form>
          </div>
        )}

        {/* ================= SCREEN 1: PRIMARY ROLE SELECTION (1 OF 3) ================= */}
        {screen === 1 && (
          <div className="bg-[#1e293b] border border-[#334155] rounded-2xl p-6 md:p-8 shadow-2xl animate-in fade-in duration-300">
            <div className="border-b border-[#334155] pb-4 mb-6">
              <span className="inline-block px-2.5 py-1 bg-[#0284c7]/15 border border-[#0284c7]/40 text-[#38bdf8] text-[11px] font-bold tracking-wider rounded-md uppercase mb-2">
                {dict.tagScreen1Primary}
              </span>
              <h2 className="text-xl md:text-2xl font-extrabold text-white">
                {dict.titleScreen1Primary}
              </h2>
              <p className="text-sm text-[#94a3b8] mt-1 leading-relaxed">
                {dict.descScreen1Primary}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3.5">
              {DATA_MATRIX.roles.map(role => (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => handleSelectRole1(role.id)}
                  className="w-full p-4 md:p-5 rounded-xl bg-[#0f172a] hover:bg-[#1e293b] border border-[#334155] hover:border-[#0284c7] flex items-center gap-4 text-start transition-all duration-200 group relative overflow-hidden shadow-md"
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border border-[#334155] group-hover:border-[#0284c7] shrink-0 relative bg-[#0b1120]">
                    <img
                      src={role.drillImage}
                      alt={role.title[lang]}
                      className="w-full h-full object-cover object-center filter brightness-[0.88] group-hover:brightness-100 group-hover:scale-105 transition-all duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
                    <div className="absolute bottom-1 end-1 bg-black/80 rounded p-1 text-[#38bdf8]">
                      {renderRoleIcon(role.iconType, "w-3.5 h-3.5")}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base md:text-lg font-bold text-white group-hover:text-[#38bdf8] transition-colors">
                      {role.title[lang]}
                    </h3>
                    <p className="text-xs text-[#94a3b8] mt-0.5 leading-snug">
                      {role.context[lang]}
                    </p>
                  </div>
                  <div className="text-[#64748b] group-hover:text-[#38bdf8] transition-all shrink-0">
                    {isRtl ? (
                      <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    ) : (
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ================= SCREEN 2: ACTIVE SCENARIOS WITH REALISTIC DRILL PHOTO & COUNTDOWN ================= */}
        {screen === 2 && currentScenario && (
          <div className="space-y-4 animate-in fade-in duration-300">
            {/* Top Tactical Banner with Role + Progress + Countdown Clock */}
            <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-3 md:p-4 shadow-md flex items-center justify-between gap-4">
              <div>
                <div className="text-xs font-bold text-[#38bdf8] uppercase tracking-wider">
                  ROLE {activeRoleSlot} OF 3: {currentRoleInfo ? currentRoleInfo.title[lang] : ''}
                </div>
                <div className="text-[11px] text-[#94a3b8] mt-0.5">
                  Scenario Drill {currentScenarioIdx + 1} of {currentRoleScenarios.length}
                </div>
              </div>

              {/* Active Countdown Clock */}
              <div className="flex items-center gap-2">
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-mono font-bold text-sm ${
                  isTimerRunning
                    ? secondsRemaining <= 5
                      ? 'bg-red-950/60 border-red-500 text-red-400 animate-pulse'
                      : 'bg-[#0f172a] border-[#0284c7] text-[#38bdf8]'
                    : 'bg-[#0f172a] border-[#334155] text-slate-400'
                }`}>
                  <Timer className={`w-4 h-4 ${isTimerRunning && secondsRemaining <= 5 ? 'text-red-400 animate-spin' : 'text-[#38bdf8]'}`} />
                  <span>{secondsRemaining.toString().padStart(2, '0')}s</span>
                </div>
              </div>
            </div>

            {/* Scenario Progress Bar */}
            <div className="w-full h-1.5 bg-[#0b1120] rounded-full overflow-hidden border border-[#334155]">
              <div 
                className="h-full bg-gradient-to-r from-[#0284c7] to-[#38bdf8] transition-all duration-300"
                style={{ width: `${((currentScenarioIdx + 1) / currentRoleScenarios.length) * 100}%` }}
              />
            </div>

            {/* Tactical Scenario Card */}
            <div className="bg-[#1e293b] border border-[#334155] rounded-2xl p-5 md:p-8 shadow-2xl">
              
              {/* REALISTIC PHOTOGRAPHIC DRILL IMAGE (Scenario-Specific!) */}
              {(currentScenario.drillImage || currentRoleInfo?.drillImage) && (
                <div className="relative w-full h-56 sm:h-72 md:h-80 rounded-xl overflow-hidden mb-5 border border-[#334155] shadow-xl group bg-[#0b1120]">
                  <img
                    src={currentScenario.drillImage || currentRoleInfo?.drillImage}
                    alt={`${currentScenario.title[lang]} Simulation`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center filter brightness-[0.95] contrast-[1.05]"
                  />
                  {/* Tactical HUD Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-black/30 pointer-events-none" />
                  <div className="absolute top-3 start-3 flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-md bg-black/75 backdrop-blur-sm border border-emerald-500/50 text-emerald-400 font-mono text-[11px] font-bold tracking-wider flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      REALISTIC SIMULATION DRILL
                    </span>
                  </div>
                  <div className="absolute bottom-3 start-3 end-3 flex items-center justify-between text-xs text-white/90">
                    <span className="font-bold text-[11px] uppercase tracking-wider bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded border border-white/10">
                      {currentRoleInfo ? currentRoleInfo.context[lang] : ''}
                    </span>
                    <span className="font-mono text-[10px] text-[#38bdf8] bg-black/60 px-2 py-0.5 rounded border border-[#0284c7]/30">
                      DRILL #{currentScenario.id}
                    </span>
                  </div>
                </div>
              )}

              <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                <span className="px-2.5 py-1 bg-[#0f172a] border border-[#38bdf8] text-[#38bdf8] font-mono text-xs font-bold rounded-md">
                  DRILL #{currentScenario.id}
                </span>
                <span className="text-xs text-[#94a3b8] bg-[#0f172a]/60 border border-[#334155] px-2.5 py-1 rounded-md flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-[#0284c7]" />
                  <span>{currentRoleInfo ? currentRoleInfo.context[lang] : dict.lblLocationPrefix}</span>
                </span>
              </div>

              <h2 className="text-lg md:text-xl font-extrabold text-white mb-4 leading-snug">
                {currentScenario.title[lang]}
              </h2>

              {/* Simplified Situation Box */}
              <div className="bg-[#0b1120] border border-[#334155] border-l-4 border-l-[#0284c7] rtl:border-l-[#334155] rtl:border-r-4 rtl:border-r-[#0284c7] rounded-xl p-4 md:p-5 mb-6">
                <div className="text-[11px] font-extrabold text-[#38bdf8] uppercase tracking-wider flex items-center gap-1.5 mb-2">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>{dict.lblSituation}</span>
                </div>
                <p className="text-sm md:text-base text-[#e2e8f0] leading-relaxed font-normal">
                  {currentScenario.description[lang]}
                </p>
              </div>

              {/* Tactical Feedback Box (Timer stopped, candidate has unlimited time to learn SOP) */}
              {answeredState && (
                <div 
                  className={`rounded-xl p-5 mb-6 border-2 transition-all duration-300 animate-in fade-in slide-in-from-top-2 ${
                    answeredState.isCorrect 
                      ? 'bg-emerald-950/20 border-[#16a34a] shadow-[0_0_20px_rgba(22,163,74,0.2)]' 
                      : 'bg-rose-950/20 border-[#dc2626] shadow-[0_0_20px_rgba(220,38,38,0.2)]'
                  }`}
                  role="region"
                  aria-live="polite"
                >
                  <div className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg mb-3 ${
                    answeredState.isCorrect 
                      ? 'bg-[#16a34a]/20 text-emerald-400 border border-[#16a34a]/40' 
                      : 'bg-[#dc2626]/20 text-rose-400 border border-[#dc2626]/40'
                  }`}>
                    {answeredState.isCorrect ? (
                      <CheckCircle2 className="w-5 h-5 shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 shrink-0" />
                    )}
                    <span className="font-extrabold text-sm md:text-base uppercase tracking-wider">
                      {answeredState.chosen === 'TIMEOUT' 
                        ? dict.feedbackTimeoutTitle
                        : (answeredState.isCorrect ? dict.feedbackCorrectTitle : dict.feedbackIncorrectTitle)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-[#94a3b8] bg-[#1e293b]/60 px-3 py-2 rounded-md mb-4 border border-[#334155]">
                    <span>{dict.recapChosen}</span>
                    <strong className="text-white">{answeredState.chosen}</strong>
                    <span className="opacity-40">|</span>
                    <span>{dict.recapRequired}</span>
                    <strong className="text-white">{currentScenario.correctDecision}</strong>
                  </div>

                  <p className="text-sm text-[#e2e8f0] leading-relaxed pb-4 mb-4 border-b border-[#334155]">
                    {answeredState.chosen === 'TIMEOUT' && (
                      <span className="block text-amber-300 font-bold mb-1">
                        {dict.timeRanOutMsg}
                      </span>
                    )}
                    {answeredState.isCorrect 
                      ? currentScenario.feedback[lang].correct 
                      : currentScenario.feedback[lang].incorrect}
                  </p>

                  <div className="text-xs font-bold text-[#38bdf8] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{dict.lblProtocol}</span>
                  </div>

                  <ul className="space-y-2 mb-5">
                    {currentScenario.feedback[lang].steps.map((step, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 bg-[#1e293b]/70 border border-[#334155] rounded-lg p-3 text-xs md:text-sm text-[#cbd5e1] leading-relaxed">
                        <span className="text-[#38bdf8] font-mono font-bold shrink-0">✓</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    type="button"
                    onClick={handleNextScenario}
                    className="w-full bg-[#0284c7] hover:bg-[#0369a1] text-white font-extrabold uppercase tracking-wider text-sm py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-[#0284c7]/25 transition"
                  >
                    <span>
                      {currentScenarioIdx < currentRoleScenarios.length - 1 
                        ? dict.btnNext 
                        : (activeRoleSlot === 1 
                            ? dict.btnFinishRole1 
                            : (activeRoleSlot === 2 ? dict.btnFinishRole2 : dict.btnFinishRole3))}
                    </span>
                    {isRtl ? <ArrowLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
                  </button>
                </div>
              )}

              {/* Decision Action Buttons */}
              <div className="space-y-3">
                <div className="text-center text-xs font-extrabold uppercase tracking-widest text-[#94a3b8] flex items-center justify-center gap-3">
                  <div className="h-px bg-[#334155] flex-1" />
                  <span>{dict.promptDecision}</span>
                  <div className="h-px bg-[#334155] flex-1" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* FIGHT / ACT Button (Green #16a34a) */}
                  <button
                    type="button"
                    disabled={answeredState !== null}
                    onClick={() => handleDecision('FIGHT')}
                    className="p-5 rounded-xl bg-gradient-to-b from-[#16a34a] to-[#15803d] hover:from-[#15803d] hover:to-[#166534] disabled:opacity-50 disabled:cursor-not-allowed border border-emerald-400 text-white font-black text-base uppercase tracking-wider flex flex-col items-center justify-center gap-1 shadow-lg shadow-[#16a34a]/30 active:scale-[0.98] transition-all"
                  >
                    <div className="flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      <span>{dict.btnFight}</span>
                    </div>
                    <span className="text-[11px] font-medium text-emerald-100 opacity-90">
                      {dict.btnFightSub}
                    </span>
                  </button>

                  {/* FLEE / EVACUATE Button (Red #dc2626) */}
                  <button
                    type="button"
                    disabled={answeredState !== null}
                    onClick={() => handleDecision('FLEE')}
                    className="p-5 rounded-xl bg-gradient-to-b from-[#dc2626] to-[#b91c1c] hover:from-[#b91c1c] hover:to-[#991b1b] disabled:opacity-50 disabled:cursor-not-allowed border border-rose-400 text-white font-black text-base uppercase tracking-wider flex flex-col items-center justify-center gap-1 shadow-lg shadow-[#dc2626]/30 active:scale-[0.98] transition-all"
                  >
                    <div className="flex items-center gap-2">
                      <DoorOpen className="w-5 h-5" />
                      <span>{dict.btnFlee}</span>
                    </div>
                    <span className="text-[11px] font-medium text-rose-100 opacity-90">
                      {dict.btnFleeSub}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= SCREEN 3: ROLE 1 EVALUATION INTERMISSION ================= */}
        {screen === 3 && role1Result && (
          <div className="bg-[#1e293b] border border-[#334155] rounded-2xl p-6 md:p-8 shadow-2xl animate-in fade-in duration-300">
            <div className="text-center mb-6">
              <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 ${
                role1Result.isPassed ? 'bg-emerald-500/20 text-emerald-400 border-2 border-emerald-500' : 'bg-red-500/20 text-red-400 border-2 border-red-500'
              }`}>
                {role1Result.isPassed ? <Award className="w-10 h-10" /> : <AlertTriangle className="w-10 h-10" />}
              </div>

              <h2 className="text-2xl font-black text-white uppercase tracking-wide">
                {role1Result.isPassed 
                  ? (lang === 'ar' ? 'اجتزت الدور الأول بنجاح! (1 من 3)' : 'ROLE 1 COMPLETED SUCCESSFULLY! (1 OF 3)')
                  : (lang === 'ar' ? 'يحتاج هذا الدور إلى إعادة تدريب' : 'ROLE 1 NEEDS RETRAINING')}
              </h2>

              <p className="text-sm text-[#94a3b8] mt-2 max-w-md mx-auto">
                {role1Result.isPassed
                  ? (lang === 'ar' 
                      ? `حققت ${role1Result.scorePercent}% في ${role1Result.roleTitleAr}. للتأهل الرسمي، يجب عليك إكمال الدور الثاني ثم الثالث.` 
                      : `You scored ${role1Result.scorePercent}% in ${role1Result.roleTitleEn}. Now proceed to choose your second required ERT role.`)
                  : (lang === 'ar'
                      ? `حققت ${role1Result.scorePercent}% (المطلوب 70% على الأقل). يرجى إعادة محاولة هذا الدور لتحقيق النجاح.`
                      : `You scored ${role1Result.scorePercent}% (Minimum required: 70%). Please retake this role to qualify.`)}
              </p>
            </div>

            <div className="bg-[#0b1120] border border-[#334155] rounded-xl p-4 mb-6 flex items-center justify-around">
              <div className="text-center">
                <span className="text-[11px] text-[#64748b] uppercase font-bold block">Score</span>
                <span className={`text-2xl font-black ${role1Result.isPassed ? 'text-emerald-400' : 'text-red-400'}`}>
                  {role1Result.scorePercent}%
                </span>
              </div>
              <div className="h-8 w-px bg-[#334155]" />
              <div className="text-center">
                <span className="text-[11px] text-[#64748b] uppercase font-bold block">Correct</span>
                <span className="text-2xl font-black text-white">
                  {role1Result.correctCount} / {role1Result.totalQuestions}
                </span>
              </div>
              <div className="h-8 w-px bg-[#334155]" />
              <div className="text-center">
                <span className="text-[11px] text-[#64748b] uppercase font-bold block">Status</span>
                <span className={`text-xs font-black uppercase px-2.5 py-1 rounded ${
                  role1Result.isPassed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                }`}>
                  {role1Result.isPassed ? 'PASSED' : 'RETRY'}
                </span>
              </div>
            </div>

            {role1Result.isPassed ? (
              <button
                type="button"
                onClick={() => changeScreen(4)}
                className="w-full bg-[#0284c7] hover:bg-[#0369a1] text-white font-extrabold uppercase tracking-wider text-sm md:text-base py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-[#0284c7]/20 transition"
              >
                <span>{lang === 'ar' ? 'متابعة إلى اختيار الدور الثاني (2 من 3)' : 'PROCEED TO SECONDARY ROLE SELECTION (2 OF 3)'}</span>
                {isRtl ? <ArrowLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
              </button>
            ) : (
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={handleRetakeActiveRole}
                  className="w-full bg-[#0284c7] hover:bg-[#0369a1] text-white font-extrabold uppercase tracking-wider text-sm py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-[#0284c7]/20 transition"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>{lang === 'ar' ? 'إعادة محاولة هذا الدور الآن' : 'RETAKE THIS ROLE NOW'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => changeScreen(1)}
                  className="w-full bg-[#0f172a] hover:bg-[#1e293b] border border-[#334155] text-white font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl transition"
                >
                  <span>{lang === 'ar' ? 'تغيير الدور التكتيكي' : 'CHOOSE A DIFFERENT ROLE'}</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* ================= SCREEN 4: SECONDARY ROLE SELECTION (2 OF 3) ================= */}
        {screen === 4 && (
          <div className="bg-[#1e293b] border border-[#334155] rounded-2xl p-6 md:p-8 shadow-2xl animate-in fade-in duration-300">
            <div className="border-b border-[#334155] pb-4 mb-6">
              <span className="inline-block px-2.5 py-1 bg-[#0284c7]/15 border border-[#0284c7]/40 text-[#38bdf8] text-[11px] font-bold tracking-wider rounded-md uppercase mb-2">
                {dict.tagScreen1Secondary}
              </span>
              <h2 className="text-xl md:text-2xl font-extrabold text-white">
                {dict.titleScreen1Secondary}
              </h2>
              <p className="text-sm text-[#94a3b8] mt-1 leading-relaxed">
                {dict.descScreen1Secondary}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3.5">
              {DATA_MATRIX.roles.map(role => {
                const isRole1 = role.id === role1Id;

                return (
                  <button
                    key={role.id}
                    type="button"
                    disabled={isRole1}
                    onClick={() => handleSelectRole2(role.id)}
                    className={`w-full p-4 md:p-5 rounded-xl border flex items-center gap-4 text-start transition-all duration-200 group relative overflow-hidden shadow-md ${
                      isRole1
                        ? 'bg-[#0b1120] border-[#334155] opacity-60 cursor-not-allowed'
                        : 'bg-[#0f172a] hover:bg-[#1e293b] border-[#334155] hover:border-[#0284c7]'
                    }`}
                  >
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border border-[#334155] group-hover:border-[#0284c7] shrink-0 relative bg-[#0b1120]">
                      <img
                        src={role.drillImage}
                        alt={role.title[lang]}
                        className="w-full h-full object-cover object-center filter brightness-[0.88] group-hover:brightness-100 group-hover:scale-105 transition-all duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
                      <div className="absolute bottom-1 end-1 bg-black/80 rounded p-1 text-[#38bdf8]">
                        {renderRoleIcon(role.iconType, "w-3.5 h-3.5")}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-base md:text-lg font-bold text-white group-hover:text-[#38bdf8] transition-colors">
                          {role.title[lang]}
                        </h3>
                        {isRole1 && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                            {dict.rolePassedBadge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#94a3b8] mt-0.5 leading-snug">
                        {role.context[lang]}
                      </p>
                    </div>
                    {!isRole1 && (
                      <div className="text-[#64748b] group-hover:text-[#38bdf8] transition-all shrink-0">
                        {isRtl ? (
                          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        ) : (
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= SCREEN 6: ROLE 2 EVALUATION INTERMISSION ================= */}
        {screen === 6 && role2Result && (
          <div className="bg-[#1e293b] border border-[#334155] rounded-2xl p-6 md:p-8 shadow-2xl animate-in fade-in duration-300">
            <div className="text-center mb-6">
              <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 ${
                role2Result.isPassed ? 'bg-emerald-500/20 text-emerald-400 border-2 border-emerald-500' : 'bg-red-500/20 text-red-400 border-2 border-red-500'
              }`}>
                {role2Result.isPassed ? <Award className="w-10 h-10" /> : <AlertTriangle className="w-10 h-10" />}
              </div>

              <h2 className="text-2xl font-black text-white uppercase tracking-wide">
                {role2Result.isPassed 
                  ? (lang === 'ar' ? 'اجتزت الدور الثاني بنجاح! (2 من 3)' : 'ROLE 2 COMPLETED SUCCESSFULLY! (2 OF 3)')
                  : (lang === 'ar' ? 'يحتاج هذا الدور إلى إعادة تدريب' : 'ROLE 2 NEEDS RETRAINING')}
              </h2>

              <p className="text-sm text-[#94a3b8] mt-2 max-w-md mx-auto">
                {role2Result.isPassed
                  ? (lang === 'ar' 
                      ? `حققت ${role2Result.scorePercent}% في ${role2Result.roleTitleAr}. والآن توجه لاختيار دورك الثالث والأخير لإتمام التأهيل!` 
                      : `You scored ${role2Result.scorePercent}% in ${role2Result.roleTitleEn}. Now proceed to select your third required ERT role to complete final qualification!`)
                  : (lang === 'ar'
                      ? `حققت ${role2Result.scorePercent}% (المطلوب 70% على الأقل). يرجى إعادة محاولة هذا الدور لتحقيق النجاح.`
                      : `You scored ${role2Result.scorePercent}% (Minimum required: 70%). Please retake this role to qualify.`)}
              </p>
            </div>

            <div className="bg-[#0b1120] border border-[#334155] rounded-xl p-4 mb-6 flex items-center justify-around">
              <div className="text-center">
                <span className="text-[11px] text-[#64748b] uppercase font-bold block">Score</span>
                <span className={`text-2xl font-black ${role2Result.isPassed ? 'text-emerald-400' : 'text-red-400'}`}>
                  {role2Result.scorePercent}%
                </span>
              </div>
              <div className="h-8 w-px bg-[#334155]" />
              <div className="text-center">
                <span className="text-[11px] text-[#64748b] uppercase font-bold block">Correct</span>
                <span className="text-2xl font-black text-white">
                  {role2Result.correctCount} / {role2Result.totalQuestions}
                </span>
              </div>
              <div className="h-8 w-px bg-[#334155]" />
              <div className="text-center">
                <span className="text-[11px] text-[#64748b] uppercase font-bold block">Status</span>
                <span className={`text-xs font-black uppercase px-2.5 py-1 rounded ${
                  role2Result.isPassed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                }`}>
                  {role2Result.isPassed ? 'PASSED' : 'RETRY'}
                </span>
              </div>
            </div>

            {role2Result.isPassed ? (
              <button
                type="button"
                onClick={() => changeScreen(7)}
                className="w-full bg-[#0284c7] hover:bg-[#0369a1] text-white font-extrabold uppercase tracking-wider text-sm md:text-base py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-[#0284c7]/20 transition"
              >
                <span>{lang === 'ar' ? 'متابعة إلى اختيار الدور الثالث (3 من 3)' : 'PROCEED TO THIRD ROLE SELECTION (3 OF 3)'}</span>
                {isRtl ? <ArrowLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
              </button>
            ) : (
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={handleRetakeActiveRole}
                  className="w-full bg-[#0284c7] hover:bg-[#0369a1] text-white font-extrabold uppercase tracking-wider text-sm py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-[#0284c7]/20 transition"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>{lang === 'ar' ? 'إعادة محاولة هذا الدور الآن' : 'RETAKE THIS ROLE NOW'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => changeScreen(4)}
                  className="w-full bg-[#0f172a] hover:bg-[#1e293b] border border-[#334155] text-white font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl transition"
                >
                  <span>{lang === 'ar' ? 'تغيير الدور التكتيكي' : 'CHOOSE A DIFFERENT ROLE'}</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* ================= SCREEN 7: TERTIARY ROLE SELECTION (3 OF 3) ================= */}
        {screen === 7 && (
          <div className="bg-[#1e293b] border border-[#334155] rounded-2xl p-6 md:p-8 shadow-2xl animate-in fade-in duration-300">
            <div className="border-b border-[#334155] pb-4 mb-6">
              <span className="inline-block px-2.5 py-1 bg-[#0284c7]/15 border border-[#0284c7]/40 text-[#38bdf8] text-[11px] font-bold tracking-wider rounded-md uppercase mb-2">
                {dict.tagScreen1Tertiary}
              </span>
              <h2 className="text-xl md:text-2xl font-extrabold text-white">
                {dict.titleScreen1Tertiary}
              </h2>
              <p className="text-sm text-[#94a3b8] mt-1 leading-relaxed">
                {dict.descScreen1Tertiary}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3.5">
              {DATA_MATRIX.roles.map(role => {
                const isRole1 = role.id === role1Id;
                const isRole2 = role.id === role2Id;
                const isCompleted = isRole1 || isRole2;

                return (
                  <button
                    key={role.id}
                    type="button"
                    disabled={isCompleted}
                    onClick={() => handleSelectRole3(role.id)}
                    className={`w-full p-4 md:p-5 rounded-xl border flex items-center gap-4 text-start transition-all duration-200 group relative overflow-hidden shadow-md ${
                      isCompleted
                        ? 'bg-[#0b1120] border-[#334155] opacity-60 cursor-not-allowed'
                        : 'bg-[#0f172a] hover:bg-[#1e293b] border-[#334155] hover:border-[#0284c7]'
                    }`}
                  >
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border border-[#334155] group-hover:border-[#0284c7] shrink-0 relative bg-[#0b1120]">
                      <img
                        src={role.drillImage}
                        alt={role.title[lang]}
                        className="w-full h-full object-cover object-center filter brightness-[0.88] group-hover:brightness-100 group-hover:scale-105 transition-all duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
                      <div className="absolute bottom-1 end-1 bg-black/80 rounded p-1 text-[#38bdf8]">
                        {renderRoleIcon(role.iconType, "w-3.5 h-3.5")}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-base md:text-lg font-bold text-white group-hover:text-[#38bdf8] transition-colors">
                          {role.title[lang]}
                        </h3>
                        {isCompleted && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                            {dict.rolePassedBadge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#94a3b8] mt-0.5 leading-snug">
                        {role.context[lang]}
                      </p>
                    </div>
                    {!isCompleted && (
                      <div className="text-[#64748b] group-hover:text-[#38bdf8] transition-all shrink-0">
                        {isRtl ? (
                          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        ) : (
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= SCREEN 5: OFFICIAL AUDIT REPORT (ALL 3 ROLES) ================= */}
        {/* MANDATORY: Always in English for corporate compliance & audit */}
        {screen === 5 && (
          <div className="bg-[#1e293b] border border-[#334155] rounded-2xl p-6 md:p-8 shadow-2xl animate-in fade-in duration-300 print:bg-white print:text-black print:border-none print:p-0">
            
            {/* WHATSAPP SHARING REMINDER */}
            <div className="bg-emerald-950/40 border-2 border-emerald-500 rounded-xl p-4 mb-6 flex items-start gap-3 print:hidden shadow-lg shadow-emerald-500/10">
              <Share2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-black text-emerald-300 uppercase tracking-wide">
                  📲 IMPORTANT: SHARE RESULTS WITH YOUR ERT WHATSAPP GROUP
                </h4>
                <p className="text-xs text-emerald-100/90 mt-1 leading-relaxed">
                  Please don't forget to click the <strong>DOWNLOAD REPORT</strong> button below to save your official qualification PDF, and share it directly to your ERT team WhatsApp group for training accountability.
                </p>
              </div>
            </div>

            {/* Authority Header */}
            <div className="border-b-2 border-[#334155] print:border-black pb-5 mb-6">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                <div>
                  <h2 className="text-xl md:text-2xl font-black text-white print:text-black tracking-wide uppercase">
                    KING SALMAN INTERNATIONAL AIRPORT (KSIA)
                  </h2>
                  <p className="text-xs md:text-sm text-[#38bdf8] print:text-blue-700 font-bold tracking-wider uppercase">
                    EMERGENCY RESPONSE TEAM (ERT) • TRIPLE-ROLE QUALIFICATION AUDIT
                  </p>
                </div>
                <div className="px-3 py-1.5 bg-[#0b1120] print:bg-slate-100 border border-[#38bdf8] print:border-black text-[#38bdf8] print:text-black rounded-lg font-mono text-xs font-bold">
                  KSIA-ERT-2026-{allThreeRolesPassed ? 'QUALIFIED' : 'PENDING'}
                </div>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-[#94a3b8] print:text-gray-600 bg-[#0284c7]/10 print:bg-gray-100 p-2.5 rounded-lg border border-[#0284c7]/30 print:border-gray-300">
                <Shield className="w-4 h-4 text-[#0284c7] print:text-black shrink-0" />
                <span>
                  Official Corporate Audit Form 1445-ERT-TR • Generated in English for Aviation Safety & Saudi Civil Defense Records.
                </span>
              </div>
            </div>

            {/* Candidate Metadata Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-[#0b1120] print:bg-gray-50 border border-[#334155] print:border-gray-300 rounded-xl p-4 mb-6">
              <div>
                <span className="block text-[10px] font-bold text-[#64748b] print:text-gray-500 uppercase tracking-wider">Candidate Name</span>
                <span className="text-sm font-extrabold text-white print:text-black">{fullName || "Responder"}</span>
              </div>
              <div>
                <span className="block text-[10px] font-bold text-[#64748b] print:text-gray-500 uppercase tracking-wider">Employee ID</span>
                <span className="text-sm font-extrabold text-white print:text-black font-mono">{empId || "N/A"}</span>
              </div>
              <div>
                <span className="block text-[10px] font-bold text-[#64748b] print:text-gray-500 uppercase tracking-wider">Attempts Taken</span>
                <span className="text-sm font-extrabold text-amber-400 print:text-black font-mono">Attempt #{attemptsCount}</span>
              </div>
              <div>
                <span className="block text-[10px] font-bold text-[#64748b] print:text-gray-500 uppercase tracking-wider">Time to Complete</span>
                <span className="text-sm font-extrabold text-sky-400 print:text-black font-mono">{formatTime(totalElapsedTimeSec)}</span>
              </div>
            </div>

            {/* 3 Roles Performance Badges */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mb-6">
              {/* Role 1 Card */}
              <div className="bg-[#0b1120] print:bg-gray-50 border border-[#334155] print:border-gray-300 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-[#38bdf8] uppercase tracking-wider truncate">
                    Role 1: {role1Result?.roleTitleEn}
                  </span>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded shrink-0 ${
                    role1Result?.isPassed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                  }`}>
                    {role1Result?.isPassed ? 'PASSED (≥70%)' : 'NEEDS RETRAIN'}
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-white print:text-black">{role1Result?.scorePercent}%</span>
                  <span className="text-xs text-[#94a3b8] print:text-gray-600">({role1Result?.correctCount} / {role1Result?.totalQuestions} Correct)</span>
                </div>
              </div>

              {/* Role 2 Card */}
              <div className="bg-[#0b1120] print:bg-gray-50 border border-[#334155] print:border-gray-300 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-[#38bdf8] uppercase tracking-wider truncate">
                    Role 2: {role2Result?.roleTitleEn}
                  </span>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded shrink-0 ${
                    role2Result?.isPassed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                  }`}>
                    {role2Result?.isPassed ? 'PASSED (≥70%)' : 'NEEDS RETRAIN'}
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-white print:text-black">{role2Result?.scorePercent}%</span>
                  <span className="text-xs text-[#94a3b8] print:text-gray-600">({role2Result?.correctCount} / {role2Result?.totalQuestions} Correct)</span>
                </div>
              </div>

              {/* Role 3 Card */}
              <div className="bg-[#0b1120] print:bg-gray-50 border border-[#334155] print:border-gray-300 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-[#38bdf8] uppercase tracking-wider truncate">
                    Role 3: {role3Result?.roleTitleEn}
                  </span>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded shrink-0 ${
                    role3Result?.isPassed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                  }`}>
                    {role3Result?.isPassed ? 'PASSED (≥70%)' : 'NEEDS RETRAIN'}
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-white print:text-black">{role3Result?.scorePercent}%</span>
                  <span className="text-xs text-[#94a3b8] print:text-gray-600">({role3Result?.correctCount} / {role3Result?.totalQuestions} Correct)</span>
                </div>
              </div>
            </div>

            {/* Overall Status Banner */}
            <div className={`p-5 rounded-xl border-2 mb-6 flex flex-wrap items-center justify-between gap-4 ${
              allThreeRolesPassed 
                ? 'bg-emerald-950/20 border-[#16a34a] print:border-emerald-600 print:bg-emerald-50' 
                : 'bg-rose-950/20 border-[#dc2626] print:border-red-600 print:bg-red-50'
            }`}>
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-full flex flex-col items-center justify-center font-black border-4 shrink-0 ${
                  allThreeRolesPassed 
                    ? 'border-[#16a34a] text-emerald-400 print:text-emerald-700 bg-emerald-950/30 print:bg-white' 
                    : 'border-[#dc2626] text-rose-400 print:text-red-700 bg-rose-950/30 print:bg-white'
                }`}>
                  <span className="text-xl leading-none">{overallScorePercent}</span>
                  <span className="text-[10px] font-bold">%</span>
                </div>
                <div>
                  <h3 className={`text-base md:text-lg font-black uppercase tracking-wide ${
                    allThreeRolesPassed ? 'text-emerald-400 print:text-emerald-700' : 'text-rose-400 print:text-red-700'
                  }`}>
                    {allThreeRolesPassed ? 'PASSED — TRIPLE-ROLE QUALIFIED' : 'NEEDS RETRAINING — RE-EVALUATION REQUIRED'}
                  </h3>
                  <p className="text-xs text-[#cbd5e1] print:text-gray-700 mt-0.5">
                    {allThreeRolesPassed 
                      ? 'Candidate has successfully demonstrated tactical emergency readiness across three required operational roles (Threshold: 70% in each).'
                      : 'Candidate did not reach the mandatory 70% passing threshold in all three roles. Retraining required before active deployment.'}
                  </p>
                </div>
              </div>

              <div className="text-xs font-bold text-[#94a3b8] print:text-gray-800 bg-[#0f172a] print:bg-white px-3 py-2 rounded-lg border border-[#334155] print:border-gray-400">
                {combinedCorrect} of {combinedTotal} Total Scenarios Verified
              </div>
            </div>

            {/* Itemized Scenarios & SOPs Breakdown for All 3 Roles */}
            <div className="mb-6">
              <h4 className="text-sm font-bold text-white print:text-black uppercase tracking-wider mb-3">
                Complete Itemized Scenario Breakdown & Standard Operating Procedures (SOP) across 3 Roles (15 Drills)
              </h4>

              <div className="space-y-3">
                {combinedAnswers.map((ans, idx) => (
                  <div 
                    key={idx}
                    className={`bg-[#0b1120] print:bg-white border rounded-xl p-4 ${
                      ans.isCorrect 
                        ? 'border-l-4 border-l-[#16a34a] border-[#334155] print:border-gray-300' 
                        : 'border-l-4 border-l-[#dc2626] border-[#334155] print:border-gray-300'
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1e293b] print:bg-gray-100 text-[#38bdf8] print:text-blue-800 font-bold">
                          {ans.roleTitleEn}
                        </span>
                        <span className="font-extrabold text-sm text-white print:text-black">
                          {ans.scenarioTitleEn}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-[#64748b] font-mono">
                          {ans.timeSpentSec}s response
                        </span>
                        <span className={`text-[11px] font-extrabold px-2 py-0.5 rounded ${
                          ans.isCorrect 
                            ? 'bg-[#16a34a]/20 text-emerald-400 print:text-emerald-800 border border-[#16a34a]/40' 
                            : 'bg-[#dc2626]/20 text-rose-400 print:text-red-800 border border-[#dc2626]/40'
                        }`}>
                          {ans.isCorrect ? '✓ CORRECT' : (ans.chosen === 'TIMEOUT' ? '⏱ TIMED OUT' : '✕ INCORRECT')}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-xs bg-[#1e293b]/50 print:bg-gray-100 px-3 py-1.5 rounded-md mb-2 text-[#94a3b8] print:text-gray-700">
                      <span>Candidate Decision: <strong className="text-white print:text-black">{ans.chosen}</strong></span>
                      <span>|</span>
                      <span>Required Tactical Protocol: <strong className="text-white print:text-black">{ans.correctDecision}</strong></span>
                    </div>

                    <p className="text-xs text-[#cbd5e1] print:text-gray-800 leading-relaxed mb-2">
                      <strong className="text-white print:text-black">Tactical Explanation:</strong>{' '}
                      {ans.isCorrect ? ans.feedbackEn.correct : ans.feedbackEn.incorrect}
                    </p>

                    <div className="border-t border-[#1e293b] print:border-gray-200 pt-2 text-[11px] text-[#94a3b8] print:text-gray-600 space-y-0.5">
                      <span className="text-[#38bdf8] print:text-blue-800 font-bold uppercase tracking-wider block">Standard Operating Procedures (SOP):</span>
                      {ans.feedbackEn.steps.map((st, sIdx) => (
                        <div key={sIdx} className="leading-tight">• {st}</div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ACTION BUTTONS (Yellow Bleeping Button downloads true PDF!) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 print:hidden">
              {/* YELLOW BLEEPING DOWNLOAD REPORT BUTTON */}
              <button
                type="button"
                onClick={handleDownloadReport}
                className="btn-yellow-bleep py-4 px-6 bg-yellow-400 hover:bg-yellow-300 text-slate-950 rounded-xl font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition transform active:scale-95 shadow-xl"
              >
                <Download className="w-5 h-5 text-slate-950" />
                <span>DOWNLOAD REPORT</span>
              </button>

              {/* Retake Assessment Button */}
              <button
                type="button"
                onClick={handleRetakeFullAssessment}
                className="py-4 px-6 bg-[#0f172a] hover:bg-[#1e293b] border border-[#334155] hover:border-[#0284c7] text-white rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Retake Full Assessment</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
