import { useState, useEffect } from 'react';
import { BRASAO_UBA_BASE64 } from '../assets/brasaoBase64';

const STORAGE_KEY = 'uba_custom_logo_data';
const EVENT_NAME = 'uba_logo_updated';

export function getActiveLogo(): string {
  try {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && stored.startsWith('data:image/')) {
        return stored;
      }
    }
  } catch (e) {
    console.warn('Erro ao acessar localStorage para logo:', e);
  }
  return BRASAO_UBA_BASE64;
}

export function isCustomLogoActive(): boolean {
  try {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem(STORAGE_KEY);
    }
  } catch {
    // fallback
  }
  return false;
}

export function saveCustomLogo(base64Data: string): boolean {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, base64Data);
      window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: base64Data }));
      return true;
    }
  } catch (e) {
    console.error('Falha ao salvar logo personalizada no localStorage:', e);
  }
  return false;
}

export function resetToDefaultLogo(): void {
  try {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
      window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: BRASAO_UBA_BASE64 }));
    }
  } catch (e) {
    console.error('Falha ao redefinir logo padrão:', e);
  }
}

export function useCamaraLogo() {
  const [logo, setLogo] = useState<string>(getActiveLogo);
  const [isCustom, setIsCustom] = useState<boolean>(isCustomLogoActive);

  useEffect(() => {
    const handleUpdate = () => {
      setLogo(getActiveLogo());
      setIsCustom(isCustomLogoActive());
    };

    window.addEventListener(EVENT_NAME, handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener(EVENT_NAME, handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const handleUploadFile = (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      if (!file.type.startsWith('image/')) {
        console.warn('Arquivo de imagem inválido. Selecione um formato suportado (.png, .jpg, .webp).');
        resolve(false);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (result) {
          saveCustomLogo(result);
          resolve(true);
        } else {
          resolve(false);
        }
      };
      reader.onerror = () => resolve(false);
      reader.readAsDataURL(file);
    });
  };

  return {
    logo,
    isCustom,
    uploadLogo: handleUploadFile,
    resetLogo: resetToDefaultLogo,
  };
}
