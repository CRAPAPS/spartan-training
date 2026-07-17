'use client';

import { useRef, useState } from 'react';
import { BrassButton } from '@/components/primitives/BrassButton';
import { MonoLabel } from '@/components/primitives/MonoLabel';
import type { PracticalSubmissionState } from '@/types/lesson';
import { ACCEPT_ATTR, ALLOWED_MIME, MAX_REPORT_BYTES } from '@/lib/practicals';

interface PracticalUploadWidgetProps {
  moduleId: string;
  initialSubmission: PracticalSubmissionState | null;
}

export function PracticalUploadWidget({ moduleId, initialSubmission }: PracticalUploadWidgetProps) {
  const [submission, setSubmission] = useState<PracticalSubmissionState | null>(initialSubmission);
  const [uploading, setUploading]   = useState(false);
  const [error, setError]           = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setError(null);

    if (!ALLOWED_MIME[file.type]) {
      setError('Accepted formats: PDF, Word document (.doc/.docx), or a photo of your report (JPG/PNG/WebP/HEIC).');
      return;
    }
    if (file.size > MAX_REPORT_BYTES) {
      setError('File exceeds the 10 MB limit. Compress or re-export your report and try again.');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch(`/api/practical/${moduleId}`, { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) {
        setError(typeof data?.error === 'string' ? data.error : 'Upload failed. Try again.');
        return;
      }
      setSubmission(data as PracticalSubmissionState);
    } catch {
      setError('Upload failed — check your connection and try again.');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const graded = submission?.status === 'graded';

  return (
    <div style={{ border: '1px solid var(--border)', background: 'var(--bg-elev-1)', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT_ATTR}
        style={{ display: 'none' }}
        onChange={e => { const f = e.target.files?.[0]; if (f) void handleFile(f); }}
      />

      {submission ? (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <MonoLabel dot dotColor={graded ? 'var(--success, #22c55e)' : 'var(--brass)'}>
              {graded ? 'GRADED' : 'SUBMITTED'}
            </MonoLabel>
            <span style={{ fontFamily: 'var(--font-ui)', fontSize: '13px', color: 'var(--ink)', wordBreak: 'break-all' }}>
              {submission.fileName}
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.12em', color: 'var(--ink-mute)', textTransform: 'uppercase' }}>
              {new Date(submission.submittedAt).toLocaleDateString()}
            </span>
          </div>

          {graded && submission.feedback && (
            <div style={{ borderLeft: '3px solid var(--brass)', padding: '10px 14px', background: 'rgba(197,160,89,.06)' }}>
              <MonoLabel size="xs" style={{ marginBottom: '6px' }}>INSTRUCTOR FEEDBACK</MonoLabel>
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: '13px', color: 'var(--ink-dim)', lineHeight: 1.7, margin: 0 }}>
                {submission.feedback}
              </p>
            </div>
          )}

          <div>
            <BrassButton variant="ghost" size="sm" onClick={() => inputRef.current?.click()} disabled={uploading}>
              {uploading ? 'Uploading…' : 'Replace File'}
            </BrassButton>
          </div>
        </>
      ) : (
        <>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '13px', color: 'var(--ink-dim)', lineHeight: 1.7, margin: 0 }}>
            Upload your completed report — PDF, Word document, or a clear photo of a printed report.
            Maximum 10 MB. You may replace your submission at any time before it is graded.
          </p>
          <div>
            <BrassButton variant="primary" size="sm" onClick={() => inputRef.current?.click()} disabled={uploading}>
              {uploading ? 'Uploading…' : 'Submit Report ⤳'}
            </BrassButton>
          </div>
        </>
      )}

      {error && (
        <span style={{ fontFamily: 'var(--font-ui)', fontSize: '12px', color: 'var(--danger, #E84040)', lineHeight: 1.6 }}>
          {error}
        </span>
      )}
    </div>
  );
}
