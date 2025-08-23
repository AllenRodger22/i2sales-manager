import React, { useCallback } from 'react';
import { useDashboard } from '../contexts/DashboardContext';
import { Upload, FileText } from 'lucide-react';

const CSVUploader: React.FC = () => {
  const { uploadFiles, isLoading } = useDashboard();

  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      try {
        await uploadFiles(files);
      } catch (error) {
        console.error('Erro ao fazer upload:', error);
      }
    }
  }, [uploadFiles]);

  const handleDrop = useCallback(async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files && files.length > 0) {
      try {
        await uploadFiles(files);
      } catch (error) {
        console.error('Erro ao fazer upload:', error);
      }
    }
  }, [uploadFiles]);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Carregue seus arquivos CSV
        </h2>
        <p className="text-gray-600 mb-6">
          Faça upload dos arquivos de produtividade e clientes para gerar análises de BI
        </p>
      </div>

      <div
        className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-gray-400 transition-colors"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <div className="space-y-2">
          <p className="text-lg font-medium text-gray-900">
            Arraste e solte seus arquivos aqui
          </p>
          <p className="text-gray-600">ou</p>
          <label className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 cursor-pointer">
            <FileText className="h-4 w-4 mr-2" />
            Selecionar arquivos
            <input
              type="file"
              multiple
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
              disabled={isLoading}
            />
          </label>
        </div>
        
        {isLoading && (
          <div className="mt-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-sm text-gray-600 mt-2">Processando arquivos...</p>
          </div>
        )}
      </div>

      <div className="mt-8 bg-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-medium text-blue-900 mb-4">
          Convenções de Nomenclatura
        </h3>
        <div className="space-y-3 text-sm text-blue-800">
          <div>
            <strong>Produtividade:</strong> produtividade_NomeDoAgente_DataInicio-DataFim.csv
            <br />
            <span className="text-blue-600">Exemplo: produtividade_Joao_Silva_01082024-31082024.csv</span>
          </div>
          <div>
            <strong>Clientes:</strong> clientes_NomeDoAgente_Descricao.csv
            <br />
            <span className="text-blue-600">Exemplo: clientes_Joao_Silva_base_completa.csv</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CSVUploader;
