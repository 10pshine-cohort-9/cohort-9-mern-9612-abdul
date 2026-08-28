import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Placeholder } from '@tiptap/extension-placeholder';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import AnimatedBackground from '../components/AnimatedBackground';
import { fetchNote, createNote, updateNote } from '../services/notesService';

const ToolbarButton = ({ onClick, isActive, icon, title }) => (
  <button
    type="button"
    onClick={onClick}
    title={title}
    aria-label={title}
    className={`p-1.5 md:p-2 shrink-0 rounded-full transition-all duration-200 flex items-center justify-center ${isActive
        ? 'bg-deep-space-blue text-white shadow-subtle scale-105'
        : 'text-on-surface-variant hover:bg-outline/20 hover:text-on-surface'
      }`}
  >
    <span className="material-symbols-outlined text-[18px] md:text-[20px]">{icon}</span>
  </button>
);

const EditorToolbar = ({ editor }) => {
  if (!editor) return null;

  return (
    <div className="fixed bottom-6 md:bottom-10 left-1/2 md:left-[calc(50%+8rem)] -translate-x-1/2 flex items-center gap-1 md:gap-1.5 px-2 md:px-3 py-1.5 md:py-2 bg-surface/80 backdrop-blur-xl border border-outline/30 rounded-full shadow-floating z-50 transition-all hover:bg-surface/95 hover:border-outline/50 max-w-[95vw] md:max-w-max overflow-x-auto custom-scrollbar">
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
      <div className="w-px h-6 bg-outline/40 mx-1" />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        isActive={editor.isActive('heading', { level: 2 })}
        icon="title"
        title="Heading 2"
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        isActive={editor.isActive('heading', { level: 3 })}
        icon="format_size"
        title="Heading 3"
      />
      <div className="w-px h-6 bg-outline/40 mx-1" />
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
      <div className="w-px h-6 bg-outline/40 mx-1" />
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
  const { logout } = useAuth();
  const isEditMode = Boolean(id);

  const [title, setTitle] = useState('');
  const [titleError, setTitleError] = useState('');
  const [saveError, setSaveError] = useState('');
  const [isLoading, setIsLoading] = useState(isEditMode);
  const [notFound, setNotFound] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [, setEditorStateTick] = useState(0);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Start writing your thought...',
        emptyEditorClass: 'is-editor-empty',
      }),
    ],
    content: '',
    editorProps: {
      attributes: {
        class: 'tiptap-editor outline-none min-h-[500px] font-body-md text-on-surface text-[17px] leading-relaxed',
        'aria-labelledby': 'note-content-label',
      },
    },
    onTransaction: () => {
      setEditorStateTick((tick) => tick + 1);
    },
    onSelectionUpdate: () => {
      setEditorStateTick((tick) => tick + 1);
    },
  });

  useEffect(() => {
    if (!isEditMode || !editor || editor.isDestroyed) return;

    let cancelled = false;

    const loadNote = async () => {
      try {
        const note = await fetchNote(id);
        if (cancelled) return;
        setTitle(note.title);
        editor.commands.setContent(note.content);
      } catch (err) {
        if (cancelled) return;
        if (err.status === 404) {
          setNotFound(true);
        } else if (err.status === 401) {
          logout();
          navigate('/login', { replace: true });
        } else {
          setSaveError(err.message || 'Failed to load note. Please try again.');
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    loadNote();

    return () => {
      cancelled = true;
    };
  }, [id, isEditMode, editor, logout, navigate]);

  const handleSave = async () => {
    if (!title.trim()) {
      setTitleError('Please enter a title for your note.');
      return;
    }

    setSaveError('');
    setIsSaving(true);

    const payload = {
      title: title.trim(),
      content: editor.getHTML(),
    };

    try {
      if (isEditMode) {
        await updateNote(id, payload);
      } else {
        await createNote(payload);
      }
      navigate('/dashboard');
    } catch (err) {
      if (err.status === 401) {
        logout();
        navigate('/login', { replace: true });
      } else {
        setSaveError(err.message || 'Failed to save note. Please try again.');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/dashboard');
  };

  if (isLoading) {
    return (
      <div className="font-body-md text-on-surface antialiased flex h-screen overflow-hidden bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col w-full ml-64 items-center justify-center">
          <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="font-body-md text-on-surface antialiased flex h-screen overflow-hidden bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col w-full ml-64 items-center justify-center gap-6">
          <div className="w-24 h-24 rounded-full bg-outline/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-[48px] text-on-surface-variant/50">search_off</span>
          </div>
          <div className="text-center">
            <h2 className="text-3xl font-bold text-on-surface mb-2 tracking-tight">Note not found</h2>
            <p className="text-on-surface-variant text-lg">The note you're looking for doesn't exist or has been deleted.</p>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="mt-4 bg-primary text-white font-label-md py-3 px-8 rounded-full hover:bg-primary-hover active:scale-[0.98] transition-all shadow-subtle"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="font-body-md text-on-surface antialiased flex h-screen overflow-hidden bg-background relative">
      <AnimatedBackground variant="dark" />
      <Sidebar />

      <div className="flex-1 flex flex-col w-full ml-0 md:ml-64 relative z-10 transition-all duration-300">


        <header className="h-[72px] flex items-center justify-between px-4 pl-16 md:px-12 border-b border-outline/10 bg-background/80 backdrop-blur-xl sticky top-0 z-40">
          <div className="flex items-center gap-4 md:gap-6">
            <button
              onClick={handleCancel}
              className="hidden md:flex text-on-surface-variant hover:text-on-surface hover:bg-outline/10 p-2 -ml-2 rounded-full transition-all items-center gap-2 group"
            >
              <span className="material-symbols-outlined text-[22px] group-hover:-translate-x-0.5 transition-transform">arrow_back</span>
            </button>
            <div className="hidden sm:block h-4 w-px bg-outline/30"></div>
            <span className="hidden sm:inline-block text-sm font-medium tracking-wide text-on-surface-variant/60 uppercase">
              {isEditMode ? 'Editing Note' : 'Drafting Note'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Mobile Back Button */}
            <button
              onClick={handleCancel}
              className="md:hidden bg-outline/10 text-on-surface font-label-md py-2 px-3 rounded-full hover:bg-outline/20 active:scale-[0.97] transition-all shadow-subtle flex items-center justify-center"
              aria-label="Back"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            </button>

            {/* Save Button */}
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-primary text-white font-label-md py-2 px-5 md:py-2.5 md:px-7 rounded-full hover:bg-primary-hover active:scale-[0.97] transition-all shadow-subtle flex items-center gap-2 disabled:opacity-70 disabled:active:scale-100"
            >
              {isSaving ? (
                <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
              ) : (
                <span className="material-symbols-outlined text-[18px]">done</span>
              )}
              <span>{isSaving ? 'Saving...' : 'Save'}</span>
            </button>
          </div>
        </header>


        <main className="flex-1 overflow-y-auto px-4 md:px-16 py-8 md:py-16 w-full flex flex-col items-center custom-scrollbar">
          <div className="max-w-[720px] w-full flex flex-col gap-6 md:gap-8 pb-40">


            {saveError && (
              <div className="flex items-center gap-2 px-4 py-3 bg-danger/10 border border-danger/30 rounded-editorial text-danger font-label-sm" role="alert">
                <span className="material-symbols-outlined text-[16px] shrink-0">error</span>
                <p>{saveError}</p>
              </div>
            )}


            <div className="relative group flex flex-col gap-2">
              <input
                id="note-title"
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (titleError) setTitleError('');
                  if (saveError) setSaveError('');
                }}
                placeholder="Untitled Document"
                className={`bg-transparent border-none outline-none font-headline-lg text-3xl md:text-[54px] leading-[1.1] font-extrabold text-on-surface w-full placeholder:text-on-surface-variant/20 transition-all focus:ring-0 ${titleError ? 'text-danger' : ''}`}
                style={{ padding: 0, boxShadow: 'none' }}
              />
              {titleError && (
                <div className="flex items-center gap-2 text-danger mt-2 animate-fade-in">
                  <span className="material-symbols-outlined text-[16px]">error</span>
                  <p className="font-label-sm">{titleError}</p>
                </div>
              )}
            </div>


            <div className="flex flex-col relative group">
              <label className="sr-only" id="note-content-label">Content</label>
              <div className="border-none bg-transparent">
                <EditorContent editor={editor} />
              </div>
            </div>

          </div>
        </main>


        <EditorToolbar editor={editor} />

      </div>
    </div>
  );
};

export default NoteEditor;
