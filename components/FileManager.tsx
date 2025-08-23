import React from 'react';
import { FileIcon, CloseIcon } from './icons';

interface FileManagerProps {
  files: File[];
  onRemoveFile: (fileName: string) => void;
}

const FileManager: React.FC<FileManagerProps> = ({ files, onRemoveFile }) => {
  if (files.length === 0) {
    return null;
  }

  return (
    <div>
      <h2 className="text-xs font-semibold text-muted-foreground dark:text-dark-muted-foreground uppercase tracking-wider mb-2">
        Arquivos Carregados
      </h2>
      <div className="space-y-2 max-h-48 overflow-y-auto p-2 border border-border dark:border-dark-border rounded-md bg-muted/50 dark:bg-dark-muted/50">
        {files.map(file => (
          <div
            key={file.name}
            className="flex items-center justify-between text-sm p-2 bg-card/80 dark:bg-dark-card/80 backdrop-blur-sm rounded-md shadow-sm"
          >
            <div className="flex items-center gap-2 overflow-hidden">
              <FileIcon className="h-5 w-5 text-muted-foreground dark:text-dark-muted-foreground flex-shrink-0" />
              <span className="truncate" title={file.name}>
                {file.name}
              </span>
            </div>
            <button
              onClick={() => onRemoveFile(file.name)}
              className="p-1 rounded-full text-muted-foreground dark:text-dark-muted-foreground hover:bg-muted dark:hover:bg-dark-muted hover:text-foreground dark:hover:text-dark-foreground transition-colors flex-shrink-0"
              aria-label={`Remover ${file.name}`}
            >
              <CloseIcon className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileManager;