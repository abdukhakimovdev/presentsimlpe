import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';
import { useLang } from '../i18n/LanguageContext';

interface ErrorBoundaryState {
  hasError: boolean;
}

class InnerErrorBoundary extends React.Component<
  {
    children: React.ReactNode;
    title: string;
    desc: string;
    btnLabel: string;
  },
  ErrorBoundaryState
> {
  constructor(props: {
    children: React.ReactNode;
    title: string;
    desc: string;
    btnLabel: string;
  }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-950">
          <div className="max-w-md w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 text-center shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
              {this.props.title}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
              {this.props.desc}
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              {this.props.btnLabel}
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export const ErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { t } = useLang();
  return (
    <InnerErrorBoundary
      title={t.errors.boundaryTitle}
      desc={t.errors.boundaryDesc}
      btnLabel={t.errors.reloadBtn}
    >
      {children}
    </InnerErrorBoundary>
  );
};
