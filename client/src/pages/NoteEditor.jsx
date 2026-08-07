import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Placeholder } from '@tiptap/extension-placeholder';
import Header from '../components/Header';
import { getNotes, saveNotes } from '../utils/storage';



const ToolbarButton = ({ onClick, isActive, icon, title }) => (
  <button
    type="button"
    onClick={onClick}
    title={title}
    aria-label={title}
    className={`p-xs rounded-sm transition-colors ${
      isActive
        ? 'bg-primary-container text-on-primary'
        : 'text-on-surface-variant hover:bg-[#f0edf0]'
    }`}
  >
    <span className="material-symbols-outlined text-[20px]">{icon}</span>
  </button>
);

const EditorToolbar = ({ editor }) => {
  if (!editor) return null;

  return (
    <div className="flex items-center gap-xs p-sm border-b border-outline-variant bg-[#fbf8fb] rounded-t-sm">
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        isActive={editor.isActive('bold')}
        icon="format_bold"
        title="Bold"
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        isActive={editor.isActive('italic')}
        icon="format_italic"
        title="Italic"
      />
      <div className="w-px h-5 bg-outline-variant mx-xs" />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        isActive={editor.isActive('heading', { level: 2 })}
        icon="title"
        title="Heading"
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        isActive={editor.isActive('bulletList')}
        icon="format_list_bulleted"
        title="Bullet List"
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        isActive={editor.isActive('orderedList')}
        icon="format_list_numbered"
        title="Ordered List"
      />
      <div className="w-px h-5 bg-outline-variant mx-xs" />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        isActive={editor.isActive('blockquote')}
        icon="format_quote"
        title="Blockquote"
      />
    </div>
  );
};

const NoteEditor = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [title, setTitle] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(isEditMode);
  const [notFound, setNotFound] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Start writing your note...',
      }),
    ],
    content: '',
    editorProps: {
      attributes: {
        class: 'tiptap-editor outline-none min-h-[300px] p-md font-body-md text-body-md text-on-background',
        'aria-labelledby': 'note-content-label',
      },
    },
  });

  useEffect(() => {
    if (!isEditMode || !editor || editor.isDestroyed) return;
    const savedNotes = getNotes();
    const note = savedNotes.find(n => n.id === id);
    if (note) {
      setTitle(note.title);
      editor.commands.setContent(note.content);
    } else {
      setNotFound(true);
    }
    setIsLoading(false);
  }, [id, isEditMode, editor]);

  const handleSave = () => {
    if (!title.trim()) {
      setError('Please enter a title for your note.');
      return;
    }
    
    const data = {
      title: title.trim(),
      content: editor.getHTML(),
      excerpt: editor.getText()
    };

    const savedNotes = getNotes();
    
    if (isEditMode) {
      const updatedNotes = savedNotes.map(n => 
        n.id === id 
          ? { ...n, title: data.title, content: data.content, excerpt: data.excerpt, updatedAt: 'just now' }
          : n
      );
      saveNotes(updatedNotes);
    } else {
      const newNote = {
        id: Date.now().toString(),
        title: data.title,
        content: data.content,
        excerpt: data.excerpt,
        updatedAt: 'just now',
        tags: []
      };
      saveNotes([newNote, ...savedNotes]);
    }
    
    console.log(`Saved note: ID=${isEditMode ? id : 'new'}, titleLength=${data.title.length}, contentLength=${data.content.length}`);
    
    navigate('/dashboard');
  };

  const handleCancel = () => {
    navigate('/dashboard');
  };

  if (isLoading) {
    return (
      <div className="font-body-md text-body-md text-on-background antialiased flex h-screen overflow-hidden bg-[#fbf8fb]">
        <div className="flex-1 flex flex-col w-full items-center justify-center">
          <p className="text-on-surface-variant">Loading note...</p>
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="font-body-md text-body-md text-on-background antialiased flex h-screen overflow-hidden bg-[#fbf8fb]">
        <div className="flex-1 flex flex-col w-full">
          <Header />
          <div className="flex-1 flex flex-col items-center justify-center gap-md">
            <span className="material-symbols-outlined text-[48px] text-on-surface-variant">search_off</span>
            <p className="font-headline-lg-mobile text-headline-lg-mobile text-primary">Note not found</p>
            <p className="font-body-md text-body-md text-on-surface-variant">The note you're looking for doesn't exist or has been deleted.</p>
            <button
              onClick={() => navigate('/dashboard')}
              className="mt-sm bg-primary-container text-on-primary font-label-md text-label-md py-sm px-md rounded-sm hover:opacity-90 transition-opacity"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="font-body-md text-body-md text-on-background antialiased flex h-screen overflow-hidden bg-[#fbf8fb]">
      <div className="flex-1 flex flex-col w-full">
        <Header>
          <div className="flex items-center gap-sm">
            <button
              onClick={handleCancel}
              className="bg-white text-primary py-sm px-md rounded-sm border border-outline-variant hover:bg-[#f5f3f5] transition-colors font-label-md text-label-md"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="bg-primary-container text-on-primary font-label-md text-label-md py-sm px-md rounded-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-sm"
            >
              <span className="material-symbols-outlined text-[18px]">save</span>
              Save
            </button>
          </div>
        </Header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8 max-w-[1200px] mx-auto w-full">
          <div className="mb-xl">
            <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary mb-xs">
              {isEditMode ? 'Edit Note' : 'New Note'}
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              {isEditMode ? 'Update your note below.' : 'Create a new note with rich text formatting.'}
            </p>
          </div>

          <div className="flex flex-col gap-md">
            <div className="flex flex-col gap-xs">
              <label className="font-label-md text-label-md text-on-background" htmlFor="note-title">
                Title
              </label>
              <input
                id="note-title"
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (error) setError('');
                }}
                placeholder="Give your note a title..."
                className={`px-[16px] py-[12px] bg-white border ${error ? 'border-[#ba1a1a] focus:border-[#ba1a1a] focus:ring-[#ba1a1a]' : 'border-outline-variant focus:border-primary-container focus:ring-primary-container'} focus:outline-none focus:ring-1 transition-colors font-body-md text-body-md text-on-background w-full rounded-editorial`}
              />
              {error && <p className="text-[#ba1a1a] font-label-sm text-label-sm mt-1">{error}</p>}
            </div>

            <div className="flex flex-col gap-xs">
              <label className="font-label-md text-label-md text-on-background" id="note-content-label">
                Content
              </label>
              <div className="bg-white border border-outline-variant rounded-sm overflow-hidden focus-within:border-primary-container focus-within:ring-1 focus-within:ring-primary-container transition-colors">
                <EditorToolbar editor={editor} />
                <EditorContent editor={editor} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default NoteEditor;
