import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import SentimentBadge from './SentimentBadge';
import { analyzeJournalHistory, analyzeSentiment } from '../../utils/sentimentUtils';
import { getHabitJournal } from '../../utils/journalUtils';

const JournalAnalyticsPanel = ({ habitId, allJournalEntries = [] }) => {
  const entries = useMemo(() => {
    if (allJournalEntries.length > 0) {
      return allJournalEntries;
    }
    if (habitId) {
      return getHabitJournal(habitId);
    }
    return [];
  }, [habitId, allJournalEntries]);

  const analysis = useMemo(() => {
    return analyzeJournalHistory(entries);
  }, [entries]);

  const hasEnoughData = entries.length >= 3;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        backgroundColor: 'var(--surface)',
        borderRadius: '16px',
        padding: '24px',
        border: '1px solid var(--border)',
      }}
    >
      <h2
        style={{
          margin: '0 0 20px 0',
          fontSize: '18px',
          fontWeight: '600',
          color: 'var(--text)',
        }}
      >
        AI Journal Analysis 🤖
      </h2>

      {!hasEnoughData ? (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-secondary)' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📊</div>
          <p style={{ margin: 0, fontSize: '14px' }}>
            Write at least 3 journal entries to see your sentiment analysis
          </p>
        </div>
      ) : (
        <>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              marginBottom: '24px',
              padding: '16px',
              backgroundColor: 'var(--bg)',
              borderRadius: '12px',
            }}
          >
            <div style={{ fontSize: '40px' }}>
              {analysis.averageScore > 10 ? '😊' : analysis.averageScore < -10 ? '😔' : '😐'}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text)', marginBottom: '4px' }}>
                Overall: {analysis.averageScore > 0 ? '+' : ''}{analysis.averageScore} ({analysis.overallTrend === 'improving' ? '↑' : analysis.overallTrend === 'declining' ? '↓' : '→'} {analysis.overallTrend})
              </div>
              <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--border)', borderRadius: '4px', overflow: 'hidden' }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(Math.max(analysis.averageScore + 100, 0), 200) / 2}%` }}
                  style={{
                    height: '100%',
                    backgroundColor: analysis.averageScore > 10 ? '#22c55e' : analysis.averageScore < -10 ? '#dc2626' : '#6b7280',
                    borderRadius: '4px',
                  }}
                />
              </div>
            </div>
          </div>

          {analysis.bestDay && (
            <div
              style={{
                marginBottom: '16px',
                padding: '12px',
                backgroundColor: '#dcfce7',
                borderRadius: '8px',
                borderLeft: '3px solid #22c55e',
              }}
            >
              <div style={{ fontSize: '12px', color: '#16a34a', marginBottom: '4px' }}>Best Entry 😄</div>
              <div style={{ fontSize: '12px', color: 'var(--text)', fontWeight: '500' }}>
                {analysis.bestDay.date}
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text)', marginTop: '4px' }}>
                {analysis.bestDay.note?.slice(0, 50)}...
              </div>
            </div>
          )}

          {analysis.worstDay && (
            <div
              style={{
                marginBottom: '24px',
                padding: '12px',
                backgroundColor: '#fef2f2',
                borderRadius: '8px',
                borderLeft: '3px solid #dc2626',
              }}
            >
              <div style={{ fontSize: '12px', color: '#dc2626', marginBottom: '4px' }}>Needs Attention 😔</div>
              <div style={{ fontSize: '12px', color: 'var(--text)', fontWeight: '500' }}>
                {analysis.worstDay.date}
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text)', marginTop: '4px' }}>
                {analysis.worstDay.note?.slice(0, 50)}...
              </div>
            </div>
          )}

          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px', color: 'var(--text)' }}>
              This Week's Mood Words
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {analysis.topPositiveWords.length > 0 ? (
                analysis.topPositiveWords.map(({ word, count }) => (
                  <span
                    key={word}
                    style={{
                      padding: '4px 10px',
                      backgroundColor: '#dcfce7',
                      color: '#16a34a',
                      borderRadius: '12px',
                      fontSize: '12px',
                    }}
                  >
                    {word} ({count})
                  </span>
                ))
              ) : (
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>No positive words yet</span>
              )}
              {analysis.topNegativeWords.length > 0 ? (
                analysis.topNegativeWords.map(({ word, count }) => (
                  <span
                    key={word}
                    style={{
                      padding: '4px 10px',
                      backgroundColor: '#fef2f2',
                      color: '#dc2626',
                      borderRadius: '12px',
                      fontSize: '12px',
                    }}
                  >
                    {word} ({count})
                  </span>
                ))
              ) : null}
            </div>
          </div>

          {analysis.weeklyScores.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px', color: 'var(--text)' }}>
                Weekly Trend
              </h3>
              <ResponsiveContainer width="100%" height={150}>
                <LineChart data={analysis.weeklyScores}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis
                    dataKey="week"
                    tick={{ fontSize: 10, fill: 'var(--text-secondary)' }}
                    stroke="var(--border)"
                    tickFormatter={(value) => value.slice(5)}
                  />
                  <YAxis
                    domain={[-100, 100]}
                    tick={{ fontSize: 10, fill: 'var(--text-secondary)' }}
                    stroke="var(--border)"
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--surface)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                      color: 'var(--text)',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="avgScore"
                    stroke="#534AB7"
                    strokeWidth={2}
                    dot={{ fill: '#534AB7', r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          <div
            style={{
              padding: '16px',
              backgroundColor: '#EEEDFE',
              borderRadius: '8px',
              borderLeft: '3px solid #534AB7',
            }}
          >
            <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#534AB7' }}>
              Key Insight
            </h3>
            <p style={{ margin: 0, fontSize: '13px', color: 'var(--text)' }}>
              {analysis.insight}
            </p>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default JournalAnalyticsPanel;