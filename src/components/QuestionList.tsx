import React from 'react';
import { Question } from '@/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface QuestionListProps {
  questions: Question[];
  onSelectQuestion: (question: Question) => void;
  onDeleteQuestion: (id: string) => void;
}

export const QuestionList: React.FC<QuestionListProps> = ({
  questions,
  onSelectQuestion,
  onDeleteQuestion,
}) => {
  return (
    <div className="space-y-4">
      {questions.map((question) => (
        <Card key={question.id} className="p-4 bg-coffee-900/50 border-coffee-800">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold text-white">{question.title}</h3>
              <p className="text-coffee-300 mt-1">{question.question}</p>
              <div className="mt-2 text-sm text-coffee-400">
                {new Date(question.created_at).toLocaleDateString('tr-TR')}
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onSelectQuestion(question)}
              >
                Cevapla
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onDeleteQuestion(question.id)}
              >
                Sil
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}; 