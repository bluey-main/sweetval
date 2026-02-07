
import React, { useState, useEffect } from 'react';
import { AppMode, ValentineData } from './types';
import CodeEntry from './components/CodeEntry';
import CreatorMode from './components/CreatorMode';
import RecipientExperience from './components/RecipientExperience';
import SuccessScreen from './components/SuccessScreen';
import { getValentine } from './utils/storage';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.CODE_ENTRY);
  const [activeData, setActiveData] = useState<ValentineData | null>(null);
  const [generatedCode, setGeneratedCode] = useState<string>('');

  const handleEnterCode = async (code: string) => {
    const data = await getValentine(code);
    if (data) {
      setActiveData(data);
      setMode(AppMode.RECIPIENT_EXPERIENCE);
    } else {
      throw new Error("Invalid Code");
    }
  };

  const handleCreateSuccess = (data: ValentineData) => {
    setGeneratedCode(data.code);
    setMode(AppMode.SUCCESS);
  };

  const handleExitCreator = () => {
    setMode(AppMode.CODE_ENTRY);
  };

  return (
    <div className="min-h-screen">
      {mode === AppMode.CODE_ENTRY && (
        <CodeEntry
          onSuccess={handleEnterCode}
          onOpenCreator={() => setMode(AppMode.CREATOR)}
        />
      )}

      {mode === AppMode.CREATOR && (
        <CreatorMode
          onSuccess={handleCreateSuccess}
          onCancel={handleExitCreator}
        />
      )}

      {mode === AppMode.RECIPIENT_EXPERIENCE && activeData && (
        <RecipientExperience
          data={activeData}
          onExit={() => setMode(AppMode.CODE_ENTRY)}
        />
      )}

      {mode === AppMode.SUCCESS && (
        <SuccessScreen
          code={generatedCode}
          onReset={() => setMode(AppMode.CODE_ENTRY)}
        />
      )}
    </div>
  );
};

export default App;
