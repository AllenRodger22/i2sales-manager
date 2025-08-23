import React, { useCallback, useState } from 'react';
import { UploadIcon } from './icons';

interface FileUploadProps {
  onFilesSelected: (files: FileList) => void;
  isLoading: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFilesSelected, isLoading }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFilesSelected(e.dataTransfer.files);
    }
  }, [onFilesSelected]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesSelected(e.target.files);
    }
  };

  return (
    <div className="w-full">
      <label
        htmlFor="file-upload"
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`flex flex-col items-center justify-center w-full min-h-48 border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-300 ${
          isDragging ? 'border-primary bg-orange-50 dark:bg-dark-card' : 'border-border dark:border-dark-border bg-muted/50 dark:bg-dark-muted/50 hover:bg-muted dark:hover:bg-dark-muted'
        }`}
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
          {isLoading ? (
            <>
              <svg className="animate-spin h-8 w-8 text-primary dark:text-dark-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="mt-2 text-sm text-muted-foreground dark:text-dark-muted-foreground">Processando...</p>
            </>
          ) : (
            <>
              <UploadIcon className="w-10 h-10 mb-3 text-muted-foreground/50 dark:text-dark-muted-foreground/50" />
              <p className="mb-2 text-sm text-muted-foreground dark:text-dark-muted-foreground">
                <span className="font-semibold text-primary dark:text-dark-primary">Clique para carregar</span> ou arraste
              </p>
              <div className="text-xs text-muted-foreground/80 dark:text-dark-muted-foreground/80 text-center space-y-1 mt-2">
                  <p>Carregue os arquivos CSV para análise.</p>
                  <p>Suporta modos Individual, Equipe e Comparativo.</p>
              </div>
            </>
          )}
        </div>
        <input id="file-upload" type="file" className="hidden" multiple accept=".csv" onChange={handleFileChange} disabled={isLoading} />
      </label>
    </div>
  );
};

export default FileUpload;