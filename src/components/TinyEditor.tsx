
import { Editor } from '@tinymce/tinymce-react';
import React, { useEffect, useState } from 'react';

interface TinyEditorProps {
  initialValue?: string;
  onChange: (content: string) => void;
}

const TinyEditor: React.FC<TinyEditorProps> = ({ initialValue = '', onChange }) => {
  const [isDark, setIsDark] = useState<boolean>(false);

  useEffect(() => {
    // Check for dark mode
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };

    // Set initial value
    checkTheme();

    // Watch for changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          checkTheme();
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <Editor
      apiKey="unh5m2senmkmil9140h8fc0p2sjnscogkk58j1j0luuf949s"
      init={{
        height: 500,
        menubar: true,
        plugins: [
          'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
          'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
          'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
        ],
        toolbar: 'undo redo | formatselect | ' +
          'bold italic backcolor | alignleft aligncenter ' +
          'alignright alignjustify | bullist numlist outdent indent | ' +
          'removeformat | help',
        content_style: isDark 
          ? 'body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; font-size: 16px; background-color: #2d2a24; color: #f0ece8; }'
          : 'body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; font-size: 16px; background-color: #f0ece8; color: #2d2a24; }',
        skin: isDark ? 'oxide-dark' : 'oxide',
        content_css: isDark ? 'dark' : 'default',
        // Add this setting to fix the domain issue
        toolbar_sticky: true,
        // Disable the URL check for development
        readonly: false
      }}
      initialValue={initialValue}
      onEditorChange={(content) => onChange(content)}
    />
  );
};

export default TinyEditor;
