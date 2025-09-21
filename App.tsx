import React, { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence, MotionProps } from 'framer-motion';
import { Decimal } from 'decimal.js';
import { ButtonType, CalculatorButtonConfig, Theme } from './types';
import { calculatorButtons } from './constants';
import { themes } from './themes';
import CalculatorButton from './components/CalculatorButton';

// Set precision for decimal.js
Decimal.set({ precision: 28 });

const App: React.FC = () => {
  const [currentOperand, setCurrentOperand] = useState<string>('0');
  const [previousOperand, setPreviousOperand] = useState<string | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [overwrite, setOverwrite] = useState<boolean>(true);
  const [history, setHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [activeTheme, setActiveTheme] = useState<Theme>(themes[0]);

  // Load state from localStorage on initial render
  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem('calculatorHistory');
      if (storedHistory) setHistory(JSON.parse(storedHistory));
      
      const storedThemeId = localStorage.getItem('calculatorTheme');
      const foundTheme = themes.find(t => t.id === storedThemeId);
      if (foundTheme) setActiveTheme(foundTheme);

    } catch (error) {
      console.error("Failed to load from localStorage", error);
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('calculatorHistory', JSON.stringify(history));
      localStorage.setItem('calculatorTheme', activeTheme.id);
    } catch (error) {
      console.error("Failed to save to localStorage", error);
    }
  }, [history, activeTheme]);

  // Apply theme background to body
  useEffect(() => {
    document.body.className = activeTheme.background;
    return () => { // Cleanup on component unmount
      document.body.className = '';
    }
  }, [activeTheme]);

  const formatOperand = (operand: string | null): string => {
    if (operand === null) return '';
    if (operand === 'Error' || !isFinite(Number(operand))) return 'Error';
    
    if (operand === '-' || operand.endsWith('.')) {
      return operand;
    }
    
    const [integer, decimal] = operand.split('.');
    if (integer === '' && decimal !== undefined) {
      return `.${decimal}`; // Handle cases like '.5'
    }
    
    try {
      const formattedInteger = BigInt(integer || 0).toLocaleString('en-US');
      return decimal !== undefined ? `${formattedInteger}.${decimal}` : formattedInteger;
    } catch(e) {
      return 'Error'; // Handle cases where integer part is not a valid BigInt
    }
  };

  const calculate = useCallback((): string => {
    try {
      const prev = new Decimal(previousOperand!);
      const current = new Decimal(currentOperand);
      let result: Decimal;

      switch (operation) {
        case '+':
          result = prev.plus(current);
          break;
        case '−':
          result = prev.minus(current);
          break;
        case '×':
          result = prev.times(current);
          break;
        case '÷':
          if (current.isZero()) return 'Error';
          result = prev.dividedBy(current);
          break;
        default:
          return 'Error';
      }
      
      return result.toPrecision(15).replace(/(\.\d*?[1-9])0+$/, '$1').replace(/\.0+$/, '');

    } catch (error) {
      return 'Error';
    }
  }, [currentOperand, previousOperand, operation]);
  
  const handleEqualClick = useCallback(() => {
    if (operation && previousOperand !== null) {
      const currentVal = currentOperand;
      const result = calculate();
      
      if (result === 'Error') {
        setCurrentOperand(result);
        setPreviousOperand(null);
        setOperation(null);
        setOverwrite(true);
        return;
      }
      
      const calculationString = `${formatOperand(previousOperand)} ${operation} ${formatOperand(currentVal)} = ${formatOperand(result)}`;
      setHistory(prevHistory => [calculationString, ...prevHistory].slice(0, 100));

      setCurrentOperand(result);
      setPreviousOperand(null);
      setOperation(null);
      setOverwrite(true);
    }
  }, [calculate, currentOperand, operation, previousOperand]);

  const handleNumberClick = useCallback((label: string) => {
    if (currentOperand === 'Error') {
      setCurrentOperand(label === '.' ? '0.' : label);
      setOverwrite(false);
      return;
    }
    if (currentOperand.length > 20 && !overwrite) return;
    if (label === '.' && currentOperand.includes('.')) return;
    
    if (overwrite) {
      setCurrentOperand(label === '.' ? '0.' : label);
      setOverwrite(false);
    } else {
      setCurrentOperand(prev => (prev === '0' && label !== '.') ? label : prev + label);
    }
  }, [currentOperand, overwrite]);
  
  const handleOperatorClick = useCallback((label: string) => {
    if (currentOperand === 'Error') {
       setCurrentOperand('0');
       setPreviousOperand(null);
       setOperation(null);
       setOverwrite(true);
    }

    if (previousOperand !== null && operation && !overwrite) {
      const result = calculate();
       if (result === 'Error') {
        setCurrentOperand(result);
        setPreviousOperand(null);
        setOperation(null);
        setOverwrite(true);
        return;
      }
      setPreviousOperand(result);
      setCurrentOperand(result);
    } else {
      setPreviousOperand(currentOperand);
    }
    
    setOperation(label);
    setOverwrite(true);
  }, [calculate, currentOperand, operation, overwrite, previousOperand]);
  
  const handleSpecialClick = useCallback((label: string) => {
     switch (label) {
      case 'AC':
        setCurrentOperand('0');
        setPreviousOperand(null);
        setOperation(null);
        setOverwrite(true);
        break;
      case '⌫':
        if (overwrite) break;
        if (currentOperand === 'Error') {
            setCurrentOperand('0');
            setOverwrite(true);
            break;
        }
        if (currentOperand.length === 2 && currentOperand.startsWith('-')) {
          setCurrentOperand('0');
          setOverwrite(true);
        } else if (currentOperand.length > 1) {
            setCurrentOperand(currentOperand.slice(0, -1));
        } else {
            setCurrentOperand('0');
            setOverwrite(true);
        }
        break;
      case '%':
        if (currentOperand !== 'Error') {
          try {
            const result = new Decimal(currentOperand).dividedBy(100);
            setCurrentOperand(result.toString());
            setOverwrite(true);
          } catch (e) {
            setCurrentOperand('Error');
            setOverwrite(true);
          }
        }
        break;
    }
  }, [currentOperand, overwrite]);

  const handleButtonClick = useCallback((label: string, type: ButtonType) => {
    switch(type) {
      case ButtonType.NUMBER:
        handleNumberClick(label);
        break;
      case ButtonType.OPERATOR:
        handleOperatorClick(label);
        break;
      case ButtonType.EQUAL:
        handleEqualClick();
        break;
      case ButtonType.SPECIAL:
        handleSpecialClick(label);
        break;
    }
  }, [handleNumberClick, handleOperatorClick, handleEqualClick, handleSpecialClick]);
  
  const handleButtonClickRef = useRef(handleButtonClick);
  handleButtonClickRef.current = handleButtonClick;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key;
      let buttonConfig: CalculatorButtonConfig | undefined;

      const keyMap: { [key: string]: string } = {
        '+': '+', '-': '−', '*': '×', '/': '÷',
        'Enter': '=', '=': '=',
        'Backspace': '⌫', 'Escape': 'AC', '%': '%'
      };

      const labelToPress = (key >= '0' && key <= '9') || key === '.' ? key : keyMap[key];
      
      if (labelToPress) {
        event.preventDefault();
        buttonConfig = calculatorButtons.find(btn => btn.label === labelToPress);
        if (buttonConfig) {
          handleButtonClickRef.current(buttonConfig.label, buttonConfig.type);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);


  const clearHistory = () => setHistory([]);

  const displayValue = formatOperand(currentOperand);
  const displayLength = displayValue.replace(/,/g, '').length;

  const getDynamicFontSize = (length: number) => {
    // Refined parameters for more graceful resizing and a smaller, yet readable, minimum font size.
    const baseSize = 7.5;       // Base font size in rem for short numbers.
    const minSize = 2.25;       // Minimum font size in rem for very long numbers.
    const shrinkThreshold = 9;  // Number of digits before font starts shrinking.
    const shrinkFactor = 0.38;  // How aggressively the font shrinks per character.

    if (length <= shrinkThreshold) return baseSize;
    
    const calculatedSize = baseSize - (length - shrinkThreshold) * shrinkFactor;
    return Math.max(minSize, calculatedSize);
  };
  
  const displayFontSize = getDynamicFontSize(displayLength);

  // FIX: Explicitly type modalAnimation with MotionProps to fix a TypeScript type inference issue.
  // This ensures the 'ease' property is correctly interpreted as a cubic-bezier tuple, not a generic number array.
  const modalAnimation: MotionProps = {
    initial: { opacity: 0, y: '100%' },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: '100%' },
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 antialiased" style={{ fontFamily: "'Poppins', sans-serif" }}>
      <div className="w-full max-w-sm mx-auto bg-white/10 backdrop-blur-lg rounded-[3rem] shadow-2xl shadow-black/30 p-8 space-y-4 ring-1 ring-white/20 relative" style={activeTheme.variables as React.CSSProperties}>
        
        <AnimatePresence>
          {showHistory && (
            <motion.div {...modalAnimation} className="absolute inset-0 bg-black/50 backdrop-blur-xl z-20 rounded-[3rem] flex flex-col p-6">
              <div className="grid grid-cols-3 items-center mb-4">
                <div className="flex justify-start">
                  <button onClick={() => setShowHistory(false)} className="text-white/70 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/50">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                  </button>
                </div>
                <h2 className="text-2xl font-bold text-white text-center">History</h2>
                <div className="flex justify-end">
                  <button onClick={clearHistory} className="text-sm text-[--history-clear-color] hover:text-[--history-clear-color-hover] transition-colors flex items-center">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" /></svg>
                    Clear
                  </button>
                </div>
              </div>
              <ul className="flex-grow overflow-y-auto space-y-2 text-right pr-2">
                {history.length === 0 ? (
                  <li className="text-white/50 text-center italic mt-8">No history yet.</li>
                ) : (
                  history.map((calc, index) => (
                    <li key={index} className="text-white/80 border-b border-white/10 pb-2">
                      <span className="text-2xl block">{calc.split('=')[1]}</span>
                      <span className="text-sm text-white/50">{calc.split('=')[0]}=</span>
                    </li>
                  ))
                )}
              </ul>
            </motion.div>
          )}
          {showSettings && (
             <motion.div {...modalAnimation} className="absolute inset-0 bg-black/50 backdrop-blur-xl z-20 rounded-[3rem] flex flex-col p-6">
              <div className="grid grid-cols-3 items-center mb-6">
                 <button onClick={() => setShowSettings(false)} className="text-white/70 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/50 justify-self-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                  </button>
                <h2 className="text-2xl font-bold text-white text-center">Themes</h2>
              </div>
              <div className="flex-grow overflow-y-auto grid grid-cols-2 gap-4">
                {themes.map(theme => (
                  <button key={theme.id} onClick={() => setActiveTheme(theme)} className="w-full aspect-video rounded-2xl p-3 flex flex-col justify-end ring-2 ring-transparent hover:ring-white/50 transition-all focus:outline-none focus:ring-white/50" style={{background: `linear-gradient(to bottom right, ${theme.background.match(/from-([a-z]+-[0-9]+)/)?.[1].replace('-', '.')}, ${theme.background.match(/to-([a-z]+-[0-9]+)/)?.[1].replace('-', '.')})`}}>
                     <div className={`${theme.background} w-full h-full rounded-xl flex flex-col justify-end p-3`}>
                      <span className="font-semibold text-white text-left drop-shadow-md">{theme.name}</span>
                     </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <div className="flex justify-end items-center px-2 space-x-2">
           <button onClick={() => setShowHistory(true)} className="text-white/70 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/50 z-10">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
           </button>
            <button onClick={() => setShowSettings(true)} className="text-white/70 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/50 z-10">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
           </button>
        </div>

        <div className="text-right h-52 flex flex-col justify-end p-4 bg-black/20 rounded-2xl ring-1 ring-inset ring-white/10 relative">
          <div className="truncate" style={{ color: 'var(--text-color-display-secondary)', fontSize: '2.25rem', lineHeight: '2.5rem', fontWeight: '300', marginBottom: '0.25rem' }} title={previousOperand ? `${formatOperand(previousOperand)} ${operation}` : ''}>
            {previousOperand ? `${formatOperand(previousOperand)} ${operation}` : ''}
          </div>
          <AnimatePresence mode="popLayout">
            <motion.div
              key={displayValue}
              className="font-medium whitespace-nowrap min-w-0" 
              title={displayValue}
              initial={{ opacity: 0, y: 25, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -25, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              style={{
                color: 'var(--text-color-display)',
                fontSize: `${displayFontSize}rem`,
                lineHeight: 1,
                overflowX: 'auto', 
                scrollbarWidth: 'none', 
                msOverflowStyle: 'none'
              }}
            >
              {displayValue}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="grid grid-cols-4 gap-5">
          {calculatorButtons.map((btn) => (
            <CalculatorButton key={btn.label} {...btn} onClick={handleButtonClick} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;