import { isImageExtension, getFileExtension, getFileNameFromUrl } from '../utils/fileHelpers';

const EXTENSION_STYLES = {
  pdf: 'bg-red-50 text-red-600',
  doc: 'bg-blue-50 text-blue-600',
  docx: 'bg-blue-50 text-blue-600',
};


function FileThumbnail({ url, name, sizeClass = 'h-28 w-28', className = '', onImageError, clickable = true }) {
  if (!url) return null;

  const displayName = name || getFileNameFromUrl(url);
  const ext = getFileExtension(name || url);
  const isImage = isImageExtension(ext);
  const colorClass = EXTENSION_STYLES[ext] || 'bg-gray-50 text-gray-500';

  const content = isImage ? (
    <img
      src={url}
      alt={displayName}
      className="w-full h-full object-cover"
      onError={onImageError}
    />
  ) : (
    <div className={`w-full h-full flex flex-col items-center justify-center p-2 ${colorClass}`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-8 h-8 mb-1"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
      <span className="text-[10px] font-semibold uppercase tracking-wide">{ext || 'file'}</span>
    </div>
  );

  const wrapperClass = `${sizeClass} ${className} rounded-md border border-gray-200 overflow-hidden`;

  if (!clickable) {
    return <div className={wrapperClass}>{content}</div>;
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      title={`Open ${displayName}`}
      className={`${wrapperClass} block hover:opacity-90 transition-opacity`}
    >
      {content}
    </a>
  );
}

export default FileThumbnail;