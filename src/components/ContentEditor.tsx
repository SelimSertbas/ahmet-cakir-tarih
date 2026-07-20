import React, { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface ContentEditorProps {
  initialValue?: string;
  onChange: (value: string) => void;
}

const modules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    ['blockquote', 'code-block'],
    ['link', 'image'],
    [{ 'align': [] }],
    [{ 'color': [] }, { 'background': [] }],
    ['clean']
  ]
};

const formats = [
  'header', 'bold', 'italic', 'underline', 'strike',
  'list', 'bullet', 'blockquote', 'code-block',
  'link', 'image', 'align', 'color', 'background'
];

const ContentEditor: React.FC<ContentEditorProps> = ({ initialValue = '', onChange }) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    onChange(value);
  }, [value, onChange]);

  // SSR'da null döndür
  if (typeof window === 'undefined') return null;

  return (
    <div className="border border-coffee-200 rounded-lg overflow-hidden bg-white dark:bg-coffee-50">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={setValue}
        modules={modules}
        formats={formats}
        placeholder="İçeriğinizi buraya yazın..."
        style={{ minHeight: 300 }}
      />
    </div>
  );
};

export default ContentEditor; 