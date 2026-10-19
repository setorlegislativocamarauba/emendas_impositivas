import React, { useState } from 'react';
import { findParlamentar, getInitials } from '../utils/parlamentarService';

interface ParlamentarAvatarProps {
  nome: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showLinkToSapl?: boolean;
}

const sizeClasses = {
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-8 h-8 text-xs',
  md: 'w-11 h-11 text-sm',
  lg: 'w-16 h-16 text-base',
  xl: 'w-20 h-20 text-lg',
};

export const ParlamentarAvatar: React.FC<ParlamentarAvatarProps> = ({
  nome,
  size = 'md',
  className = '',
  showLinkToSapl = false,
}) => {
  const info = findParlamentar(nome);
  const initials = getInitials(info?.nomeParlamentar || nome);

  // Fallback stages: 0 = local file, 1 = SAPL remote URL, 2 = initials fallback
  const [stage, setStage] = useState<number>(0);

  const photoSrc =
    stage === 0
      ? info?.fotoLocal
      : stage === 1
      ? info?.fotoSapl
      : undefined;

  const handleImageError = () => {
    if (stage === 0 && info?.fotoSapl) {
      setStage(1);
    } else {
      setStage(2);
    }
  };

  const content = (
    <div
      className={`relative rounded-full overflow-hidden shrink-0 select-none shadow-xs border border-slate-200/80 bg-slate-100 flex items-center justify-center font-bold text-white transition-transform ${sizeClasses[size]} ${className}`}
    >
      {photoSrc && stage < 2 ? (
        <img
          src={photoSrc}
          alt={`Foto de ${info?.nomeParlamentar || nome}`}
          onError={handleImageError}
          className="w-full h-full object-cover object-top"
          loading="lazy"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-tr from-blue-700 via-indigo-600 to-purple-600 flex items-center justify-center font-black tracking-wider">
          {initials}
        </div>
      )}
    </div>
  );

  if (showLinkToSapl && info?.saplUrl) {
    return (
      <a
        href={info.saplUrl}
        target="_blank"
        rel="noopener noreferrer"
        title={`Abrir perfil de ${info.nomeParlamentar} no SAPL da Câmara de Ubá`}
        className="hover:opacity-90 hover:scale-105 transition-all inline-block"
      >
        {content}
      </a>
    );
  }

  return content;
};
