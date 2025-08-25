import React from 'react';
import { LogoIcon, SunIcon, MoonIcon, InfoIcon, AlertTriangleIcon } from './icons';
import FileUpload from './FileUpload';

interface InitialScreenProps {
  onFilesSelected: (files: FileList) => void;
  isLoading: boolean;
  error: string | null;
  onShowInfo: () => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const InitialScreen: React.FC<InitialScreenProps> = ({ onFilesSelected, isLoading, error, onShowInfo, theme, toggleTheme }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-transparent text-foreground dark:text-dark-foreground p-4 font-sans">
      <header className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
            <LogoIcon className="h-10 w-10 text-primary dark:text-dark-primary" />
            <h1 className="text-2xl font-bold text-foreground dark:text-dark-foreground">i2Sales</h1>
            <button onClick={onShowInfo} className="p-2 rounded-full text-muted-foreground dark:text-dark-muted-foreground hover:bg-muted dark:hover:bg-dark-muted transition-colors" aria-label="Saiba mais">
                <InfoIcon className="h-6 w-6" />
            </button>
        </div>
        <button onClick={toggleTheme} className="p-2 rounded-full text-muted-foreground dark:text-dark-muted-foreground hover:bg-muted dark:hover:bg-dark-muted transition-colors">
            {theme === 'light' ? <MoonIcon className="h-6 w-6" /> : <SunIcon className="h-6 w-6" />}
        </button>
      </header>

      <div className="w-full max-w-2xl text-center">
        <div className="bg-black/10 dark:bg-black/20 backdrop-blur-sm p-8 rounded-lg">
            <h1 className="text-5xl font-bold mb-2">Bem-vindo ao i2Sales</h1>
            <p className="text-lg text-muted-foreground dark:text-dark-muted-foreground mb-8">
              Sua plataforma de Business Intelligence para análise de vendas.
            </p>
            <FileUpload onFilesSelected={onFilesSelected} isLoading={isLoading} />
            {error && (
                <div className="mt-4 max-w-xl mx-auto p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg flex items-center justify-center gap-3">
                    <AlertTriangleIcon className="h-6 w-6"/>
                    <p className="text-sm font-medium">{error}</p>
                </div>
            )}
             <p className="text-xs text-muted-foreground dark:text-dark-muted-foreground mt-4">
                Para começar, carregue um ou mais arquivos de exportação (.csv). O nome de cada arquivo será usado como o nome do corretor (ex: <strong>JoaoSilva.csv</strong>).
            </p>
        </div>
      </div>
    </div>
  );
};

export default InitialScreen;
